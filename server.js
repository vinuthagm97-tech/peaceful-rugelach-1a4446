const express = require("express");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
try { process.loadEnvFile && fs.existsSync(".env") && process.loadEnvFile(".env"); } catch {}

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));
app.use((req, res, next) => { res.set({ "X-Content-Type-Options": "nosniff", "X-Frame-Options": "SAMEORIGIN", "Referrer-Policy": "strict-origin-when-cross-origin" }); next(); });
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"], maxAge: "7d" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const clean = (s, n = 2000) => String(s ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, n);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

app.post("/api/contact", limiter, async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot
  const d = { name: clean(b.name, 120), company: clean(b.company, 120), email: clean(b.email, 160), phone: clean(b.phone, 40), need: clean(b.need, 60), message: clean(b.message, 3000) };
  if (!d.name || !/^\S+@\S+\.\S+$/.test(d.email) || d.message.length < 10) return res.status(400).json({ error: "Please check your details." });
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
  fs.appendFileSync(path.join(__dirname, "data", "enquiries.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...d }) + "\n");
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      const t = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 465, secure: (+process.env.SMTP_PORT || 465) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
      await t.sendMail({ from: `"VeritixGroup Website" <${process.env.SMTP_USER}>`, to: process.env.MAIL_TO || "vinuutha.gm@veritixgroup.com", replyTo: d.email, subject: `New enquiry: ${d.need} from ${d.name}`,
        html: `<p><b>Name:</b> ${esc(d.name)}<br><b>Company:</b> ${esc(d.company)}<br><b>Email:</b> ${esc(d.email)}<br><b>Phone:</b> ${esc(d.phone)}<br><b>Need:</b> ${esc(d.need)}</p><p>${esc(d.message).replace(/\n/g, "<br>")}</p>` });
    } catch (e) { console.error("Mail failed (enquiry still saved):", e.message); }
  }
  res.json({ ok: true });
});

const SYSTEM = "You are the website assistant for VeritixGroup, a Bangalore-based Business Growth & Digital Solutions company (tagline: Build. Grow. Hire.) offering Brand, Digital, Tech and Talent services: brand identity and collateral; digital marketing, SEO, ads, lead generation; websites, e-commerce, web apps; IT/non-IT recruitment, staffing, executive search, RPO. Contact: vinuutha.gm@veritixgroup.com, +91 63609 47499 (also WhatsApp). Be concise (under 80 words) and friendly. Never invent prices, clients, results or timelines; for pricing or specifics invite the visitor to share their requirement or contact the team. Stay on topic.";
app.post("/api/chat", limiter, async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) return res.status(501).json({ error: "disabled" });
  const msgs = (Array.isArray(req.body?.messages) ? req.body.messages : []).slice(-8).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: clean(m.content, 800) })).filter((m) => m.content);
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return res.status(400).json({ error: "bad" });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model: process.env.CHAT_MODEL || "claude-sonnet-4-6", max_tokens: 300, system: SYSTEM, messages: msgs }) });
    if (!r.ok) throw new Error(r.status);
    const j = await r.json();
    res.json({ reply: (j.content || []).map((c) => c.text || "").join("").trim() });
  } catch (e) { res.status(502).json({ error: "upstream" }); }
});

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, "public", "index.html")));
app.listen(process.env.PORT || 3000, () => console.log("VeritixGroup site running on port " + (process.env.PORT || 3000)));
