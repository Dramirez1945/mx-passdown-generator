import { useState } from "react";
import { A, A_RGB, SANS, BG } from "../theme.js";
import { passdownUrl } from "./passdownUrl.js";

const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; }
html, body { overflow-x: hidden; max-width: 100vw; }
.pd-btn { transition: box-shadow .2s ease, border-color .2s ease; }
.pd-btn:hover { box-shadow: 0 0 0 1px ${A}, 0 0 16px rgba(${A_RGB},.55); border-color: ${A}; }
.pd-code {
  width: 100%;
  background: rgba(0,0,0,.45);
  border: 2px solid rgba(${A_RGB},.32);
  color: #cfe8ff;
  font-family: 'Courier New', ui-monospace, monospace;
  font-size: 11px;
  line-height: 1.5;
  padding: 14px 16px;
  border-radius: 10px;
  resize: none;
  outline: none;
  word-break: break-all;
  white-space: pre-wrap;
}
.pd-code:focus { border-color: ${A}; box-shadow: 0 0 0 1px ${A}, 0 0 12px rgba(${A_RGB},.40); }
.pd-drag-target {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: ${A};
  color: #0d1018;
  font-family: ${SANS};
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.3px;
  padding: 11px 20px;
  border-radius: 999px;
  border: none;
  cursor: grab;
  text-decoration: none;
  user-select: none;
  transition: box-shadow .2s ease;
}
.pd-drag-target:hover { box-shadow: 0 0 0 2px ${A}, 0 0 20px rgba(${A_RGB},.55); }
.pd-drag-target:active { cursor: grabbing; }
`;

const eyebrow = { fontFamily:SANS, fontWeight:500, fontSize:11, letterSpacing:3, color:"rgba(255,255,255,.45)", textTransform:"uppercase" };
const panel = { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"22px 24px", marginBottom:18 };
const bodyText = { fontFamily:SANS, fontWeight:400, fontSize:14.5, lineHeight:1.65, color:"rgba(255,255,255,.78)" };
const cd = { fontFamily:"'Courier New', ui-monospace, monospace", fontSize:12, background:"rgba(255,255,255,.06)", padding:"1px 6px", borderRadius:4, color:"#cfe8ff" };

export default function PassdownPage() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(passdownUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.getElementById("pd-code-textarea");
      if (ta) { ta.select(); document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:SANS, color:"#fff", padding:"22px 18px 60px" }}>
      <style>{PAGE_CSS}</style>
      <div style={{ maxWidth:780, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:26 }}>
          <img src="/logo.png" alt="Advanced Air" style={{ height:32, width:"auto", filter:"brightness(0) invert(1)", opacity:.7 }}/>
          <span style={eyebrow}>MX Passdown</span>
        </div>

        {/* Hero */}
        <div style={{ marginBottom:28 }}>
          <div style={{ display:"inline-block", fontFamily:SANS, fontWeight:700, fontSize:10, letterSpacing:2.4, color:A, background:`rgba(${A_RGB},.12)`, border:`1px solid rgba(${A_RGB},.45)`, padding:"5px 11px", borderRadius:999, marginBottom:18 }}>
            ONE-TIME SETUP · UNDER 60 SECONDS
          </div>
          <h1 style={{ fontFamily:SANS, fontWeight:700, fontSize:30, color:"#fff", margin:"0 0 14px", letterSpacing:0.2 }}>
            Passdown Report Generator
          </h1>
          <p style={bodyText}>
            A browser bookmark that runs directly on JetInsight using your existing login. One click pulls
            live Scheduled MX, open MELs, and mechanic calendar entries into an editable report. Review
            everything, make any corrections, then copy the text for Teams or download a clean PDF.
          </p>
          <p style={{ ...bodyText, marginTop:12 }}>
            Nothing is locked — every field is editable before export. JetInsight data is a starting point, not a final output.
          </p>
        </div>

        {/* What it pulls */}
        <div style={panel}>
          <div style={{ ...eyebrow, color:A, marginBottom:12 }}>What gets auto-populated from JetInsight</div>
          <ul style={{ ...bodyText, paddingLeft:18, margin:0, fontSize:13.5 }}>
            <li style={{ marginBottom:7 }}><b style={{ color:"#f0f0f0" }}>Scheduled MX</b> — tail numbers and locations pulled from the MX schedule</li>
            <li style={{ marginBottom:7 }}><b style={{ color:"#f0f0f0" }}>Open MELs</b> — count per tail and most restrictive expiration date; expirations within 7 days are flagged automatically</li>
            <li style={{ marginBottom:7 }}><b style={{ color:"#f0f0f0" }}>Mechanic calendar</b> — general calendar entries matching your team's names, surfaced as-is for review</li>
            <li><b style={{ color:"#f0f0f0" }}>MX Coverage</b> — standard shift schedule pre-filled; add pop-up absences and last-minute sick calls manually</li>
          </ul>
        </div>

        {/* Manual-entry callout */}
        <div style={{ ...panel, borderLeft:`3px solid rgba(${A_RGB},.6)`, marginBottom:18 }}>
          <div style={{ ...eyebrow, color:A, marginBottom:8 }}>Manual entry only</div>
          <p style={{ ...bodyText, fontSize:13.5, margin:0 }}>
            <b style={{ color:"#f0f0f0" }}>AOG aircraft</b> and <b style={{ color:"#f0f0f0" }}>Waiting for Parts</b> are entered manually each shift — these aren't available in the API.
            Pop-up absences (last-minute sick calls not in JetInsight) have a dedicated field. All other sections are editable too.
          </p>
        </div>

        {/* Install — drag method */}
        <div style={panel}>
          <div style={{ ...eyebrow, color:A, marginBottom:16 }}>Step 1 — Install the bookmark</div>
          <p style={{ ...bodyText, fontSize:13.5, marginBottom:20 }}>
            Drag the button below to your browser bookmarks bar. That's it — no extensions, no logins, no extra setup.
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", marginBottom:16 }}>
            <a href={passdownUrl} className="pd-drag-target" onClick={(e) => e.preventDefault()}>
              📋 MX Passdown Report
            </a>
            <span style={{ fontFamily:SANS, fontSize:13, color:"rgba(255,255,255,.45)" }}>← drag this to your bookmarks bar</span>
          </div>
          <div style={{ fontFamily:SANS, fontSize:12, color:"rgba(255,255,255,.38)", lineHeight:1.6 }}>
            <b style={{ color:"rgba(255,255,255,.55)" }}>Bookmarks bar not visible?</b> Press <b style={{ color:"rgba(255,255,255,.55)" }}>Ctrl+Shift+B</b> (Windows) or <b style={{ color:"rgba(255,255,255,.55)" }}>Cmd+Shift+B</b> (Mac) to show it.
          </div>
        </div>

        {/* Install — manual copy method */}
        <div style={panel}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, marginBottom:10 }}>
            <div>
              <div style={{ ...eyebrow, color:A, marginBottom:4 }}>Alternative — copy the code manually</div>
              <div style={{ fontFamily:SANS, fontSize:12, color:"rgba(255,255,255,.45)" }}>Use this if drag-and-drop doesn't work in your browser</div>
            </div>
            <button className="pd-btn"
              style={{ background:copied?"rgba(74,222,128,.15)":A, border:`2px solid ${copied?"#4ade80":A}`, color:copied?"#4ade80":"#0d1018", padding:"9px 20px", fontFamily:SANS, fontSize:13, fontWeight:700, letterSpacing:0.4, cursor:"pointer", borderRadius:8, minWidth:130 }}
              onClick={copy}>
              {copied ? "✓ Copied!" : "Copy Code"}
            </button>
          </div>
          <textarea id="pd-code-textarea" className="pd-code" readOnly spellCheck={false} rows={4} value={passdownUrl}/>
          <div style={{ fontFamily:SANS, fontSize:11, color:"rgba(255,255,255,.28)", marginTop:8 }}>
            Right-click your bookmarks bar → Add page → paste this into the URL field → Save
          </div>
        </div>

        {/* Step 2 — Using the tool */}
        <div style={panel}>
          <div style={{ ...eyebrow, color:A, marginBottom:18 }}>Step 2 — Generate a passdown</div>
          <Step n={1} title="Open JetInsight and log in">
            Go to <code style={cd}>portal.jetinsight.com</code> and sign in normally. You don't need to navigate to any particular page.
          </Step>
          <Step n={2} title="Click the bookmark">
            Click <b>📋 MX Passdown Report</b> in your bookmarks bar. A loading overlay appears while data is pulled from JetInsight — this takes about 10–15 seconds.
          </Step>
          <Step n={3} title="Review and edit">
            All auto-populated fields are editable. Add AOG aircraft, Waiting for Parts, pop-up absences, and any corrections. Nothing is submitted until you explicitly export.
          </Step>
          <Step n={4} title="Export" last>
            Hit <b>Copy Text</b> to copy a formatted plain-text passdown straight to your clipboard — ready to paste into Teams. Or hit <b>Download PDF</b> for a professional styled PDF you can drop into the channel.
          </Step>
        </div>

        {/* Tips */}
        <div style={{ ...panel, borderLeft:`3px solid ${A}` }}>
          <div style={{ ...eyebrow, color:A, marginBottom:12 }}>Tips & notes</div>
          <ul style={{ ...bodyText, fontSize:13.5, paddingLeft:18, margin:0 }}>
            <li style={{ marginBottom:6 }}>The bookmark runs entirely on JetInsight — clicking it anywhere else won't do anything.</li>
            <li style={{ marginBottom:6 }}>Install once per browser. It survives restarts and browser updates.</li>
            <li style={{ marginBottom:6 }}>Report date defaults to today. You can change it at the top of the editor before generating.</li>
            <li style={{ marginBottom:6 }}>MEL expirations within 7 days are automatically highlighted in red — no manual check needed.</li>
            <li>To update the bookmark later: right-click it → Edit → paste new code into the URL field.</li>
          </ul>
        </div>

        <div style={{ textAlign:"center", marginTop:30, fontFamily:SANS, fontSize:10, letterSpacing:2.2, color:"rgba(255,255,255,.22)" }}>
          ADVANCED AIR, LLC · INTERNAL USE ONLY
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, children, last }) {
  return (
    <div style={{ display:"flex", gap:16, marginBottom:last ? 0 : 18 }}>
      <div style={{ flexShrink:0, width:30, height:30, borderRadius:"50%", border:`2px solid ${A}`, background:`rgba(${A_RGB},.12)`, color:A, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SANS, fontWeight:700, fontSize:13 }}>{n}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:SANS, fontWeight:600, fontSize:15, color:"#f0f0f0", marginBottom:5 }}>{title}</div>
        <div style={{ fontFamily:SANS, fontSize:13.5, lineHeight:1.6, color:"rgba(255,255,255,.7)" }}>{children}</div>
      </div>
    </div>
  );
}
