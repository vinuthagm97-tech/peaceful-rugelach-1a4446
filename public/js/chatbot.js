(function(){
var WA="https://wa.me/916360947499?text=",EM="vinuutha.gm@veritixgroup.com";
var KB=[
 {k:["brand","logo","identity","design","collateral","brochure","stationery"],a:"Brand & Creative: logo and visual identity, brand guidelines, business cards and stationery, company profiles and brochures, social media creatives and marketing collateral."},
 {k:["marketing","seo","social","ads","advertis","lead","performance","content","google","meta"],a:"Digital Marketing & Growth: social media management, content strategy, SEO, Google and Meta advertising, lead generation, performance marketing and analytics reporting."},
 {k:["website","web","app","ecommerce","e-commerce","landing","tech","ui","ux","integration"],a:"Website & Technology: business websites, landing pages, e-commerce, web applications, UI/UX, third-party integrations and website maintenance."},
 {k:["recruit","hire","hiring","talent","staff","rpo","executive","job","team"],a:"Recruitment & Talent: IT and non-IT recruitment, permanent hiring, contract staffing, executive search, RPO and talent consulting."},
 {k:["price","cost","quote","budget","charge","fee","rate"],a:"Pricing depends on scope. Share your requirement and we'll come back with a clear proposal."},
 {k:["where","location","address","bangalore","bengaluru","office"],a:"We're based in Bangalore, Karnataka."},
 {k:["process","how do you work","how it works","steps"],a:"Our process: Discover, Strategize, Create, Launch, Grow."},
 {k:["about","who are you","veritix","company"],a:"VeritixGroup is a Business Growth & Digital Solutions company. We bring Brand, Digital, Tech and Talent together under one roof."},
 {k:["email","mail","phone","call","contact","whatsapp","number","reach"],a:"You can reach us at "+EM+", call +91 63609 47499, or message us on WhatsApp at the same number."}];
var QR=["Services","Get a quote","Hiring help","Contact details","Talk to the team"];
var fab,box,log,qr,form,inp,lead=null,hist=[];
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
function say(t,who){var b=el("div","b "+who,t);log.appendChild(b);log.scrollTop=log.scrollHeight;return b}
function chips(a){qr.innerHTML="";setTimeout(function(){log.scrollTop=log.scrollHeight},0);a.forEach(function(t){var b=el("button","",t);b.type="button";b.onclick=function(){handle(t)};qr.appendChild(b)})}
function link(t,h){var a=el("a","",t);a.href=h;a.target="_blank";a.rel="noopener";a.style.cssText="color:var(--gold);font-weight:700;display:block;margin-top:6px";return a}
function startLead(){lead={s:0,d:{}};say("Happy to connect you with the team. What's your name?","bot");chips([])}
function leadStep(t){var q=[["name","Thanks! What's your email address?"],["email","And your phone number (optional, type - to skip)?"],["phone","What do you need help with? A short note is enough."],["message",null]],cur=q[lead.s];
 if(cur[0]==="email"&&!/^\S+@\S+\.\S+$/.test(t)){say("That doesn't look like a valid email. Please try again.","bot");return}
 lead.d[cur[0]]=t==="-"?"":t;lead.s++;
 if(lead.s<4){say(q[lead.s-1][1],"bot");return}
 var d=lead.d;d.need="Other";d.company="";d.message=(d.message||"").length<10?(d.message||"")+" (via chatbot)":d.message;lead=null;
 var w=say("Sending…","bot");window.vxSend(d).then(function(){w.textContent="Thank you, your enquiry has reached the team. We'll reply shortly.";chips(QR)})
 .catch(function(){w.textContent="I couldn't send that automatically. Please use WhatsApp or email instead.";w.appendChild(link("Continue on WhatsApp",WA+encodeURIComponent("Hi VeritixGroup, I'm "+d.name+". "+d.message)));chips(QR)})}
function handle(t){t=t.trim();if(!t)return;say(t,"me");
 if(lead){leadStep(t);return}
 var l=t.toLowerCase();
 if(/quote|talk|team|human|connect|enquir|inquir/.test(l)&&!/price|cost/.test(l)||l==="get a quote"){startLead();return}
 if(/^(hi|hello|hey|namaste)\b/.test(l)){say("Hello! How can I help you today?","bot");chips(QR);return}
 if(l==="services"){say("We offer four capabilities: Brand, Digital, Tech and Talent. Which one would you like to know about?","bot");chips(["Brand","Digital marketing","Website","Recruitment"]);return}
 if(l==="hiring help"){l="recruit"}
 if(l==="contact details"){l="contact"}
 var best=null,sc=0;KB.forEach(function(e){var s=0;e.k.forEach(function(k){if(l.indexOf(k)>-1)s++});if(s>sc){sc=s;best=e}});
 if(best){say(best.a,"bot");chips(["Get a quote","Services","Contact details"]);return}
 hist.push({role:"user",content:t});
 var w=say("…","bot");
 fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:hist.slice(-8)})}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){if(!j.reply)throw 0;w.textContent=j.reply;hist.push({role:"assistant",content:j.reply});chips(["Get a quote","Services"])})
 .catch(function(){w.textContent="I'm not sure about that one. I can connect you with the team directly.";w.appendChild(link("Message us on WhatsApp",WA+encodeURIComponent(t)));chips(["Get a quote","Services"])})}
function init(){
 fab=el("button");fab.id="cb-fab";fab.type="button";fab.setAttribute("aria-label","Open chat");fab.innerHTML='<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z"/></svg>Chat with us';
 box=el("div");box.id="cb";box.setAttribute("role","dialog");box.setAttribute("aria-label","VeritixGroup assistant");
 box.innerHTML='<header><div><b>VeritixGroup Assistant</b><small>Build · Grow · Hire</small></div><button type="button" aria-label="Close chat">&times;</button></header><div id="cb-log" aria-live="polite"></div><div class="qr"></div><form><input aria-label="Type your message" placeholder="Type your question…" autocomplete="off"><button>Send</button></form>';
 document.body.appendChild(fab);document.body.appendChild(box);
 log=box.querySelector("#cb-log");qr=box.querySelector(".qr");form=box.querySelector("form");inp=box.querySelector("input");
 var first=true;
 function open(o){box.classList.toggle("open",o);fab.style.display=o?"none":"flex";if(o){inp.focus();if(first){first=false;say("Hi! I'm the VeritixGroup assistant. Ask me about our services, or I can connect you with the team.","bot");chips(QR)}}}
 fab.onclick=function(){open(true)};box.querySelector("header button").onclick=function(){open(false)};
 document.addEventListener("keydown",function(e){if(e.key==="Escape")open(false)});
 form.onsubmit=function(e){e.preventDefault();var v=inp.value;inp.value="";handle(v)}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
