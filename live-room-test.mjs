import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "artifacts", "geddes-live-room");
fs.mkdirSync(out, { recursive: true });
const mime = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".svg":"image/svg+xml", ".png":"image/png", ".woff":"font/woff", ".woff2":"font/woff2" };

const server = http.createServer((req,res) => {
  const pathname = decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const target = path.resolve(root,"."+pathname);
  if (!target.startsWith(root)) return res.writeHead(403).end("Forbidden");
  fs.readFile(target,(err,data) => {
    if (err) return res.writeHead(404).end("Not found");
    res.writeHead(200,{"Content-Type":mime[path.extname(target)]||"application/octet-stream"}).end(data);
  });
});
await new Promise(resolve => server.listen(4174,"127.0.0.1",resolve));

let firebaseOnline = true;
let ntfyOnline = true;
let delayResponsePost = false;
let responsePosts = 0;
const roomData = {};
const ntfyHistory = [];
const sseWaiters = [];

function at(parts) { return parts.reduce((v,k) => v == null ? undefined : v[k], roomData); }
function setAt(parts,value) {
  if (!parts.length) return;
  let node = roomData;
  for (let i=0;i<parts.length-1;i++) node = node[parts[i]] || (node[parts[i]] = {});
  node[parts[parts.length-1]] = value;
}
function deleteAt(parts) {
  if (!parts.length) return;
  const parent = at(parts.slice(0,-1));
  if (parent && typeof parent === "object") delete parent[parts[parts.length-1]];
}
function json(route,status,value) {
  return route.fulfill({status,contentType:"application/json",body:JSON.stringify(value == null ? null : value)});
}
function eventsAfter(id) {
  return ntfyHistory.slice(id).map((message,index) => {
    const n=id+index+1;
    return "id: "+n+"\nevent: message\ndata: "+JSON.stringify({event:"message",message:JSON.stringify(message)})+"\n\n";
  }).join("");
}

const browser = await chromium.launch({headless:true});
const presenterContext = await browser.newContext({viewport:{width:1366,height:768}});
const studentContext = await browser.newContext({viewport:{width:1366,height:768}});
async function installMocks(context) {
await context.route("https://intl6010-default-rtdb.firebaseio.com/**", async route => {
  const req=route.request(), url=new URL(req.url());
  const raw=(url.pathname.split("/deck/")[1]||"").replace(/\.json$/,"");
  const parts=raw.split("/").filter(Boolean).slice(1);
  if (!firebaseOnline) return route.fulfill({status:503,body:"mock Firebase unavailable"});
  if (req.method()==="GET") return json(route,200,at(parts));
  if (req.method()==="PUT") {
    setAt(parts,JSON.parse(req.postData()||"null"));
    return json(route,200,at(parts));
  }
  if (req.method()==="PATCH") {
    const patch=JSON.parse(req.postData()||"{}");
    Object.keys(patch).forEach(k => patch[k]===null ? delete roomData[k] : roomData[k]=patch[k]);
    return json(route,200,roomData);
  }
  if (req.method()==="DELETE") { deleteAt(parts); return json(route,200,null); }
  return route.fulfill({status:405,body:"Method not allowed"});
});
await context.route("https://ntfy.sh/**", async route => {
  const req=route.request(), url=new URL(req.url());
  if (!ntfyOnline) return route.fulfill({status:503,body:"mock backup unavailable"});
  if (req.method()==="POST") {
    const msg=JSON.parse(req.postData()||"{}");
    if (delayResponsePost && msg.t==="resp") await new Promise(resolve=>setTimeout(resolve,350));
    if (msg.t==="resp") responsePosts++;
    ntfyHistory.push(msg);
    sseWaiters.splice(0).forEach(resolve=>resolve());
    return route.fulfill({status:200,body:"ok"});
  }
  if (url.pathname.endsWith("/json")) {
    return route.fulfill({status:200,contentType:"text/plain",body:ntfyHistory.map(msg=>JSON.stringify({event:"message",message:JSON.stringify(msg)})).join("\n")});
  }
  if (url.pathname.endsWith("/sse")) {
    const last=Number(req.headers()["last-event-id"]||0);
    if (ntfyHistory.length<=last) {
      let wake;
      const waiting=new Promise(resolve=>{wake=resolve;sseWaiters.push(wake);});
      await Promise.race([waiting,new Promise(resolve=>setTimeout(resolve,1000))]);
      const index=sseWaiters.indexOf(wake);
      if(index>=0)sseWaiters.splice(index,1);
    }
    return route.fulfill({status:200,headers:{"Content-Type":"text/event-stream","Cache-Control":"no-cache"},body:eventsAfter(last)});
  }
  return route.fulfill({status:404,body:"Not found"});
});
}
await installMocks(presenterContext);
await installMocks(studentContext);

const checks=[], failures=[];
function check(ok,label){(ok?checks:failures).push(label);}
async function waitForStoredResponse() {
  const until=Date.now()+12000;
  while(Date.now()<until) {
    const rows=Object.assign({},(roomData.places && roomData.places["2"]) || {},(roomData.votes && roomData.votes["2"]) || {});
    if(Object.keys(rows).length===5) return true;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  return false;
}

try {
  const presenter=await presenterContext.newPage();
  await presenter.addInitScript(()=>sessionStorage.setItem("deck-key","6010"));
  presenter.on("pageerror",e=>failures.push("presenter browser error: "+e.message));
  await presenter.goto("http://127.0.0.1:4174/present/index.html?room=geddes-qa",{waitUntil:"domcontentloaded"});
  await presenter.waitForSelector("#live",{state:"visible"});
  await presenter.click("#live");
  await presenter.waitForFunction(()=>DeckSync.isPresenting());

  const student=await studentContext.newPage();
  student.on("pageerror",e=>failures.push("student browser error: "+e.message));
  await student.goto("http://127.0.0.1:4174/index.html?room=geddes-qa",{waitUntil:"domcontentloaded"});
  await student.waitForSelector("#seat",{state:"visible"});
  await student.click("#seat");
  await student.waitForFunction(()=>DeckSync.seated()&&DeckSync.isPresenting());

  await presenter.click("#next");
  await presenter.click("#next");
  await presenter.waitForFunction(()=>document.querySelector("#counter")?.textContent.trim()==="3");
  await student.waitForFunction(()=>(document.querySelector("#counter")?.textContent||"").startsWith("3"));
  await student.waitForSelector("#drag-place");
  const firstPlace=student.locator('select[data-token-place="Labour was repressed or coopted"]');
  const secondPlace=student.locator('select[data-token-place="That produced fast growth"]');
  const thirdPlace=student.locator('select[data-token-place="Slower-growth countries are missing"]');
  await firstPlace.focus();
  await firstPlace.press("ArrowDown");
  await firstPlace.press("Enter");
  await secondPlace.focus();
  await secondPlace.press("ArrowDown");
  await secondPlace.press("ArrowDown");
  await secondPlace.press("Enter");
  await thirdPlace.focus();
  await thirdPlace.press("ArrowDown");
  await thirdPlace.press("Enter");
  check(await firstPlace.inputValue()==="shown" && await secondPlace.inputValue()==="not" && await thirdPlace.inputValue()==="shown","placement interaction works using keyboard-only controls");

  firebaseOnline=false;
  ntfyOnline=false;
  await Promise.all([
    presenter.waitForFunction(()=>DeckSync.getStatus().mode==="backup",null,{timeout:8000}),
    student.waitForFunction(()=>DeckSync.getStatus().mode==="backup",null,{timeout:8000})
  ]);
  await student.click("#drag-send");
  await student.waitForSelector(".submit-error",{state:"visible"});
  check(await student.locator("#drag-send").isEnabled(),"failed submission re-enables Send");
  check((await student.locator(".submit-error").innerText()).includes("did not reach the room"),"failed submission gives a clear retry message");
  check(responsePosts===0,"failed submission is not counted as delivered");
  check(await presenter.locator(".responses li").count()===0,"failed response is not shown to the presenter");
  await student.screenshot({path:path.join(out,"failed-submission.png"),animations:"disabled"});

  ntfyOnline=true;
  delayResponsePost=true;
  await student.locator("#drag-send").evaluate(button=>button.click());
  await student.waitForTimeout(40);
  check(!(await student.locator("#drag-send").isEnabled()),"Send locks while a response is in flight");
  await student.locator("#drag-send").evaluate(button=>button.click());
  await student.waitForSelector(".thanks",{state:"visible",timeout:10000});
  await presenter.waitForSelector(".responses li",{state:"visible",timeout:10000});
  check(responsePosts===1,"rapid duplicate activation produces one response post");
  check(await presenter.locator(".responses li").count()===1,"presenter sees the first response row");

  /* Four additional browser sessions submit under distinct student IDs.
     This isolates response transport/aggregation from the slide-navigation UI. */
  const extraStudents=[];
  for(let n=0;n<4;n++) {
    const peer=await studentContext.newPage();
    peer.on("pageerror",e=>failures.push("additional student browser error: "+e.message));
    await peer.goto("http://127.0.0.1:4174/index.html?room=geddes-qa",{waitUntil:"domcontentloaded"});
    await peer.waitForFunction(()=>typeof DeckSync!=="undefined"&&DeckSync.getStatus().mode==="backup",null,{timeout:10000});
    const delivered=await peer.evaluate(async n=>{
      sessionStorage.setItem("deck-sid","geddes-qa-student-"+n);
      return DeckSync.submit("2",{text:"Additional student "+n+" response",choice:"shown",kind:"place",bin:"place"});
    },n);
    check(delivered,"additional student "+(n+1)+" response reaches the backup room");
    extraStudents.push(peer);
  }
  await presenter.waitForFunction(()=>DeckSync.getResponses("2").length===5,null,{timeout:15000});
  await presenter.waitForFunction(()=>document.querySelectorAll(".responses li").length===5,null,{timeout:10000});
  check(responsePosts===5,"five students produce five distinct response posts");
  check(await presenter.locator(".responses li").count()===5,"presenter renders all five responses");
  await presenter.screenshot({path:path.join(out,"five-responses.png"),animations:"disabled"});
  await presenter.screenshot({path:path.join(out,"backup-response.png"),animations:"disabled"});

  await presenter.reload({waitUntil:"domcontentloaded"});
  await presenter.waitForFunction(()=>DeckSync.getStatus().mode==="backup",null,{timeout:8000});
  await presenter.waitForFunction(()=>DeckSync.isPresenting(),null,{timeout:8000});
  const backupRefreshState = await presenter.evaluate(()=>({
    slide:DeckSync.getSlide(),
    counter:document.querySelector("#counter")?.textContent||"",
    saved:sessionStorage.getItem("deck-slide-geddes-qa"),
    presenting:DeckSync.isPresenting()
  }));
  console.log("Backup presenter refresh state: "+JSON.stringify(backupRefreshState));
  await presenter.waitForFunction(()=>(document.querySelector("#counter")?.textContent||"").trim()==="3",null,{timeout:15000});
  await presenter.waitForFunction(()=>DeckSync.getResponses("2").length===5,null,{timeout:15000});
  await presenter.waitForFunction(()=>document.querySelectorAll(".responses li").length===5,null,{timeout:10000});
  check(await presenter.locator(".responses li").count()===5,"presenter refresh restores all five responses from backup history");
  check(await presenter.evaluate(()=>DeckSync.isPresenting()),"presenter refresh restores the live room state");
  await presenter.screenshot({path:path.join(out,"refresh-from-backup.png"),animations:"disabled"});

  firebaseOnline=true;
  /* The last student tab has the complete local response queue. Reloading it
     forces an immediate Firebase bootstrap and verifies the whole queue flush. */
  await extraStudents[3].reload({waitUntil:"domcontentloaded"});
  await extraStudents[3].waitForFunction(()=>DeckSync.getStatus().mode==="firebase",null,{timeout:15000});
  await presenter.waitForFunction(()=>DeckSync.getStatus().mode==="firebase",null,{timeout:30000});
  await student.waitForFunction(()=>DeckSync.getStatus().mode==="firebase",null,{timeout:30000});
  await presenter.waitForFunction(()=>DeckSync.isPresenting(),null,{timeout:10000});
  check(await waitForStoredResponse(),"Firebase reconnection persists all five queued responses");

  await presenter.reload({waitUntil:"domcontentloaded"});
  await presenter.waitForFunction(()=>(document.querySelector("#counter")?.textContent||"").trim()==="3",null,{timeout:15000});
  await presenter.waitForFunction(()=>DeckSync.getResponses("2").length===5,null,{timeout:15000});
  await presenter.waitForFunction(()=>document.querySelectorAll(".responses li").length===5,null,{timeout:10000});
  check(await presenter.locator(".responses li").count()===5,"normal presenter refresh restores all five responses from Firebase");
  await presenter.screenshot({path:path.join(out,"refresh-from-firebase.png"),animations:"disabled"});

  console.log("Live-room checks: "+checks.length);
  checks.forEach(x=>console.log("PASS "+x));
  if(failures.length){failures.forEach(x=>console.error("FAIL "+x));process.exitCode=1;}
} finally {
  await presenterContext.close();
  await studentContext.close();
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
  fs.writeFileSync(path.join(out,"report.json"),JSON.stringify({checks,failures,responsePosts,ntfyHistory:ntfyHistory.length},null,2));
}
