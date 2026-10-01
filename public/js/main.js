(function(){
var b=document.getElementById("burger"),n=document.getElementById("nav");
if(b)b.addEventListener("click",function(){var o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)});
var y=document.getElementById("yr");if(y)y.textContent=new Date().getFullYear();
var f=document.getElementById("contact-form");if(!f)return;
var m=document.getElementById("form-msg");
f.addEventListener("submit",function(e){
 e.preventDefault();var d=Object.fromEntries(new FormData(f));m.className="full";m.textContent="";
 if(!d.name||!/^\S+@\S+\.\S+$/.test(d.email||"")||!d.need||(d.message||"").length<10){m.className="full msg err";m.textContent="Please fill in your name, a valid email, the service you need and a short message.";return}
 var s=f.querySelector("button");s.disabled=true;s.textContent="Sending…";
 window.vxSend(d).then(function(){f.reset();m.className="full msg ok";m.textContent="Thanks, we've received your message and will reply by email shortly."})
 .catch(function(){m.className="full msg err";m.innerHTML='We couldn\'t send that right now. Please email <a href="mailto:vinuutha.gm@veritixgroup.com"><b>vinuutha.gm@veritixgroup.com</b></a> or message us on <a href="https://wa.me/916360947499"><b>WhatsApp</b></a>.'})
 .finally(function(){s.disabled=false;s.textContent="Start a Conversation"})});
})();
window.vxSend=function(d){return fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(function(r){if(!r.ok)throw new Error("fail");return r.json()})};
