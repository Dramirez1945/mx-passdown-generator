(async function MXPassdown() {
  var existing = document.getElementById('__pd_overlay');
  if (existing) { existing.remove(); return; }

  var MECHANIC_NAMES = [
    { name: 'Daniel Ramirez',            aliases: ['Daniel', 'Dan', 'Ramirez'] },
    { name: 'Edward Rosales',            aliases: ['Edward', 'Ed', 'Eddie', 'Rosales'] },
    { name: 'Jose Gonzalez',             aliases: ['Jose', 'Joe', 'Gonzalez'] },
    { name: 'Alexander McQueen',         aliases: ['Alexander', 'Alex', 'McQueen'] },
    { name: 'Andres Guzman',             aliases: ['Andres', 'Guzman'] },
    { name: 'Andres Almazan-Uriostegui', aliases: ['Andres', 'Almazan'] },
    { name: 'Andy Ortiz',                aliases: ['Andy', 'Ortiz'] },
    { name: 'Daryl Medel',               aliases: ['Daryl', 'Medel'] },
    { name: 'Oscar Munoz Carrilo',       aliases: ['Oscar', 'Munoz'] },
    { name: 'Rodney Laney',              aliases: ['Rodney', 'Rod', 'Laney'] }
  ];
  var MEL_WARN_DAYS = 7;
  var STATIC_COVERAGE = 'HHR MX Day Shift 6:00am local to 5:00pm local (14:00 Z - 00:00 Z)\nDay Shift Lead: Ed R.\nEvening Shift (Monday through Friday): 3:00pm local to 12:00am local (22:00 Z - 07:00 Z)\nEvening Shift Lead: Andres G.\nPHX MX - Weekly hours 6:00am local to 5:00pm local (14:00 Z - 00:00 Z)\nSunday - Wednesday - Daniel R.\nWednesday - Saturday - Jose G.';
  var A = '#5eb9ff';
  var NAVY = '#1a3a6e';
  var BG = '#0d1018';

  // Inject Outfit font
  if (!document.getElementById('__pd_font')) {
    var lnk = document.createElement('link');
    lnk.id = '__pd_font';
    lnk.rel = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
    document.head.appendChild(lnk);
  }

  var SANS = "'Outfit',system-ui,sans-serif";

  // ── Utilities ──────────────────────────────────────────────────────────────

  function mechNameMatch(text) {
    if (!text) return false;
    var t = text.toLowerCase();
    return MECHANIC_NAMES.some(function(m) {
      return m.aliases.some(function(a) { return t.includes(a.toLowerCase()); });
    });
  }

  function parseExpiry(str) {
    if (!str) return null;
    str = str.trim();
    var m;
    // YYYY-MM-DD
    m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2]-1, +m[3]);
    // MM/DD/YYYY
    m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(+m[3], +m[1]-1, +m[2]);
    // MM/DD/YY
    m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
    if (m) { var yr = +m[3]; return new Date(yr < 50 ? 2000+yr : 1900+yr, +m[1]-1, +m[2]); }
    // MM/DD
    m = str.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (m) { var now = new Date(); return new Date(now.getFullYear(), +m[1]-1, +m[2]); }
    return null;
  }

  function daysUntil(d) {
    if (!d) return 9999;
    var now = new Date(); now.setHours(0,0,0,0);
    return Math.round((d - now) / 86400000);
  }

  function fmtDate(d) {
    if (!d) return '';
    var mo = d.getMonth()+1, dy = d.getDate();
    return (mo<10?'0':'')+mo+'/'+(dy<10?'0':'')+dy;
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear()+'-'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'-'+(d.getDate()<10?'0':'')+d.getDate();
  }

  function tomorrowStr() {
    var d = new Date(); d.setDate(d.getDate()+1);
    return d.getFullYear()+'-'+(d.getMonth()<9?'0':'')+(d.getMonth()+1)+'-'+(d.getDate()<10?'0':'')+d.getDate();
  }

  function zuluNow() {
    var d = new Date();
    var h = d.getUTCHours(), m2 = d.getUTCMinutes();
    return (h<10?'0':'')+h+(m2<10?'0':'')+m2+'Z';
  }

  // getField: extract JetInsight label→value (copied from working mx-report bookmarklet)
  function getField(doc, label) {
    var v = '';
    doc.querySelectorAll('div').forEach(function(d) {
      if (d.children.length === 0 && d.textContent.trim() === label) {
        var ns = d.nextElementSibling;
        v = ns ? ns.textContent.trim() : '';
      }
    });
    return v;
  }

  // ── Overlay skeleton ───────────────────────────────────────────────────────

  var ov = document.createElement('div');
  ov.id = '__pd_overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:999999;background:'+BG+';overflow-y:auto;font-family:'+SANS+';color:#fff;';
  document.body.appendChild(ov);

  var style = document.createElement('style');
  style.textContent = [
    '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap");',
    '#__pd_overlay *{box-sizing:border-box;}',
    '#__pd_overlay textarea,#__pd_overlay input[type=text]{background:rgba(0,0,0,.4);border:1.5px solid rgba(94,185,255,.3);color:#e8f4ff;font-family:'+SANS+';font-size:13px;border-radius:8px;padding:10px 12px;width:100%;resize:vertical;outline:none;line-height:1.55;}',
    '#__pd_overlay textarea:focus,#__pd_overlay input[type=text]:focus{border-color:'+A+';}',
    '#__pd_overlay button.pd-btn{transition:box-shadow .2s,border-color .2s;}',
    '#__pd_overlay button.pd-btn:hover{box-shadow:0 0 0 1px '+A+',0 0 14px rgba(94,185,255,.45);border-color:'+A+';}',
    '.pd-sec-hdr{background:rgba(94,185,255,.1);border-left:3px solid '+A+';padding:8px 14px;font-weight:700;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:'+A+';margin:0 0 10px;}',
    '.pd-absence-row{display:flex;gap:8px;align-items:flex-start;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;margin-bottom:8px;}',
    '.pd-absence-row input[type=text]{flex:1;min-width:0;}',
    '.pd-del-btn{flex-shrink:0;background:rgba(255,80,80,.12);border:1px solid rgba(255,80,80,.35);color:#ff6b6b;padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer;font-family:'+SANS+';}',
    '.pd-del-btn:hover{background:rgba(255,80,80,.22);}',
    '.pd-add-btn{background:rgba(94,185,255,.1);border:1px solid rgba(94,185,255,.35);color:'+A+';padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'+SANS+';width:100%;}',
    '.pd-add-btn:hover{background:rgba(94,185,255,.18);}',
    '.mel-warn{color:#f87171;font-weight:700;}',
  ].join('');
  document.head.appendChild(style);

  // Loading state with progress log
  ov.innerHTML = '<div id="__pd_load" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px;">'
    + '<div style="width:44px;height:44px;border:3px solid rgba(94,185,255,.2);border-top-color:'+A+';border-radius:50%;animation:__pd_spin 0.8s linear infinite;"></div>'
    + '<div id="__pd_log" style="font-size:13px;color:rgba(255,255,255,.55);font-family:'+SANS+';text-align:center;line-height:2;"></div>'
    + '</div>';
  var spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes __pd_spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(spinStyle);

  function log(msg) {
    var el = document.getElementById('__pd_log');
    if (el) el.innerHTML += '<div>▸ ' + msg + '</div>';
  }

  // ── Data fetching (correct JetInsight API — mirrors mx-report/bookmarklet.js) ──

  var today = todayStr(), tomorrow = tomorrowStr();
  var scheduledMX = [], melData = {}, calendarEntries = [], fetchErrors = [];
  var parser = new DOMParser();

  // Priming call (same warm-up as working bookmarklet)
  await fetch('/compliance/aircraft_readiness', { credentials: 'include' }).catch(function() {});

  // 1. Schedule — response is a direct JSON array
  try {
    log('Fetching schedule…');
    var schedResp = await fetch(
      '/schedule/aircraft.json?start=' + today + '&end=' + tomorrow + '&time_zone=America%2FLos_Angeles',
      { credentials: 'include' }
    );
    var sched = await schedResp.json();
    sched.forEach(function(e) {
      var type = (e.extendedProps && e.extendedProps.event_type_name) || '';
      if (type !== 'Maintenance') return;
      var tail  = (e.extendedProps && e.extendedProps.aircraft) || '';
      var loc   = (e.extendedProps && e.extendedProps.origin_short)
               || (e.extendedProps && e.extendedProps.destination_short) || '';
      var notes = ((e.extendedProps && e.extendedProps.notes) || '').trim().replace(/\n/g, ' ');
      if (tail) scheduledMX.push({ tail: tail.trim(), loc: loc.trim(), notes: notes });
    });
    log('Schedule: ' + scheduledMX.length + ' MX event' + (scheduledMX.length !== 1 ? 's' : '') + ' found');
  } catch(e) {
    fetchErrors.push('Schedule: ' + e.message);
    log('Schedule fetch failed');
  }

  // Unique tails from scheduled MX
  var tails = [];
  scheduledMX.forEach(function(r) { if (r.tail && !tails.includes(r.tail)) tails.push(r.tail); });

  // 2. MELs — sequential per tail, fetch each deferral detail page for expiry date
  for (var ti = 0; ti < tails.length; ti++) {
    var tail2 = tails[ti];
    try {
      log('Scanning MELs: ' + tail2 + '…');
      var disHtml = await fetch(
        '/compliance/discrepancies/index_discrepancies_by_aircraft?aircraft=' + encodeURIComponent(tail2) + '&per_page=500',
        { credentials: 'include' }
      ).then(function(r) { return r.text(); });
      var disDoc = parser.parseFromString(disHtml, 'text/html');

      // Find rows where last <td> is exactly "Deferred"
      var deferrals = [];
      disDoc.querySelectorAll('tbody tr').forEach(function(row) {
        var tds = Array.from(row.querySelectorAll('td'));
        if (!tds.length) return;
        if (tds[tds.length - 1].textContent.trim() === 'Deferred') {
          var a = row.querySelector('a');
          if (a) deferrals.push({
            href: a.href || (window.location.origin + a.getAttribute('href')),
            id: a.textContent.trim()
          });
        }
      });

      // Fetch each deferral detail page for the expiry date
      var defs = [];
      for (var di = 0; di < deferrals.length; di++) {
        try {
          var dh = await fetch(deferrals[di].href, { credentials: 'include' }).then(function(r) { return r.text(); });
          var dd = parser.parseFromString(dh, 'text/html');
          var expStr = getField(dd, 'Deferral expiration date');
          defs.push({ id: deferrals[di].id, expiry: parseExpiry(expStr) });
        } catch(e2) { /* skip unreachable detail pages */ }
      }

      if (deferrals.length > 0) {
        var earliest = defs.reduce(function(min, d) {
          return d.expiry && (!min || d.expiry < min) ? d.expiry : min;
        }, null);
        melData[tail2] = { count: deferrals.length, expiry: earliest };
      }
    } catch(e) {
      fetchErrors.push('MEL ' + tail2 + ': ' + e.message);
    }
  }

  // 3. General calendar — best-effort, may 404
  try {
    log('Checking mechanic calendar…');
    var calResp = await fetch(
      '/schedule/general.json?start=' + today + '&end=' + tomorrow,
      { credentials: 'include' }
    );
    if (calResp.ok) {
      var calArr = await calResp.json();
      if (!Array.isArray(calArr)) calArr = calArr.events || calArr.data || [];
      calArr.forEach(function(ev) {
        var title = ev.title || ev.name || '';
        var body  = ev.notes || ev.description || '';
        if (mechNameMatch(title) || mechNameMatch(body)) {
          calendarEntries.push(title + (body ? ' — ' + body : ''));
        }
      });
    }
  } catch(e) { /* calendar stays empty — manual entry only */ }

  // ── Build editor UI ────────────────────────────────────────────────────────

  var reportDate = today;
  var absences = []; // { name, dates, note }
  var absenceIdSeq = 0;

  function renderAbsences() {
    var container = document.getElementById('__pd_abs_list');
    if (!container) return;
    container.innerHTML = '';
    absences.forEach(function(ab) {
      var row = document.createElement('div');
      row.className = 'pd-absence-row';
      row.innerHTML = '<input type="text" placeholder="Name" value="'+esc(ab.name)+'" data-id="'+ab.id+'" data-field="name" style="flex:0 0 140px;">'
        + '<input type="text" placeholder="Dates (e.g. 5/16-5/17)" value="'+esc(ab.dates)+'" data-id="'+ab.id+'" data-field="dates" style="flex:0 0 160px;">'
        + '<input type="text" placeholder="Note (sick call, PTO…)" value="'+esc(ab.note)+'" data-id="'+ab.id+'" data-field="note">'
        + '<button class="pd-del-btn" data-id="'+ab.id+'">✕</button>';
      container.appendChild(row);
    });
    container.querySelectorAll('input[type=text]').forEach(function(inp) {
      inp.addEventListener('input', function() {
        var id = +this.dataset.id, field = this.dataset.field;
        var rec = absences.find(function(a){ return a.id===id; });
        if (rec) rec[field] = this.value;
      });
    });
    container.querySelectorAll('.pd-del-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = +this.dataset.id;
        absences = absences.filter(function(a){ return a.id!==id; });
        renderAbsences();
      });
    });
  }

  function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

  // MEL summary rows HTML
  function melRowsHtml() {
    if (!Object.keys(melData).length) return '<div style="color:rgba(255,255,255,.4);font-size:13px;">No MEL data retrieved — enter manually if needed.</div>';
    var html = '';
    Object.keys(melData).sort().forEach(function(tail) {
      var m = melData[tail];
      var days = daysUntil(m.expiry);
      var expStr = m.expiry ? fmtDate(m.expiry) : '';
      var warn = days <= MEL_WARN_DAYS;
      html += '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.06);">'
        + '<span style="min-width:80px;font-weight:600;color:#e8f4ff;">'+esc(tail)+'</span>'
        + '<span style="color:rgba(255,255,255,.65);">'+m.count+' MEL'+(m.count!==1?'s':'')+'</span>'
        + (expStr ? '<span class="'+(warn?'mel-warn':'')+'" style="margin-left:auto;">'+( warn?'⚠ ':'')+'EXP '+expStr+'</span>' : '')
        + '</div>';
    });
    return html;
  }

  // Scheduled MX detail rows
  function mxDetailDefault() {
    if (!scheduledMX.length) return '';
    return scheduledMX.map(function(r){ return r.tail + ' — MX @ ' + (r.loc||'?') + (r.notes?' | '+r.notes:''); }).join('\n');
  }

  function mxSummaryDefault() {
    if (!scheduledMX.length) return '';
    var tls = scheduledMX.map(function(r){ return r.tail; }).join(', ');
    return scheduledMX.length + ' — ' + tls;
  }

  // Build inner HTML
  function sec(label, id, content, extra) {
    return '<div style="margin-bottom:22px;">'
      + '<div class="pd-sec-hdr">'+label+'</div>'
      + (extra||'')
      + content
      + '</div>';
  }

  function ta(id, val, rows, ph) {
    return '<textarea id="'+id+'" rows="'+(rows||3)+'" placeholder="'+(ph||'')+'" style="min-height:'+(rows||3)*22+'px;">'+esc(val)+'</textarea>';
  }

  var calDefault = calendarEntries.length ? calendarEntries.join('\n') : '';

  var editorHtml = '<div style="max-width:860px;margin:0 auto;padding:20px 18px 80px;">'

    // Toolbar
    + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:26px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.08);">'
    +   '<button class="pd-btn" id="__pd_close" style="background:transparent;border:2px solid rgba(255,255,255,.14);color:rgba(255,255,255,.55);padding:8px 14px;font-family:'+SANS+';font-size:13px;font-weight:500;cursor:pointer;border-radius:8px;">✕ Close</button>'
    +   '<div style="display:flex;align-items:center;gap:8px;">'
    +     '<span style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,.4);text-transform:uppercase;font-family:'+SANS+';">Report Date</span>'
    +     '<input type="date" id="__pd_date" value="'+today+'" style="background:rgba(0,0,0,.4);border:1.5px solid rgba(94,185,255,.3);color:#e8f4ff;font-family:'+SANS+';font-size:13px;border-radius:8px;padding:7px 10px;outline:none;cursor:pointer;">'
    +   '</div>'
    +   '<div style="display:flex;gap:10px;">'
    +     '<button class="pd-btn" id="__pd_copy" style="background:rgba(94,185,255,.12);border:2px solid rgba(94,185,255,.45);color:'+A+';padding:9px 18px;font-family:'+SANS+';font-size:13px;font-weight:700;cursor:pointer;border-radius:8px;">📋 Copy Text</button>'
    +     '<button class="pd-btn" id="__pd_pdf" style="background:'+A+';border:2px solid '+A+';color:#0d1018;padding:9px 18px;font-family:'+SANS+';font-size:13px;font-weight:700;cursor:pointer;border-radius:8px;">⬇ Download PDF</button>'
    +   '</div>'
    + '</div>'

    // Title
    + '<h1 style="font-family:'+SANS+';font-weight:700;font-size:26px;color:#fff;margin:0 0 22px;letter-spacing:0.2px;">MX Pass Down</h1>'

    // Fetch errors notice
    + (fetchErrors.length ? '<div style="background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.35);border-radius:8px;padding:12px 16px;margin-bottom:18px;font-size:12px;color:#fca5a5;font-family:'+SANS+';">⚠ Some data could not be fetched automatically — fill in manually:<br>'+fetchErrors.map(esc).join('<br>')+'</div>' : '')

    + sec('AOG Aircraft', '__pd_aog',
        '<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">'
        + '<span style="font-family:'+SANS+';font-size:13px;color:rgba(255,255,255,.6);">Count:</span>'
        + '<input type="text" id="__pd_aog_count" value="0" style="width:60px;text-align:center;resize:none;">'
        + '</div>'
        + ta('__pd_aog', 'N/A', 2, 'Tail numbers…'))

    + sec('Scheduled MX', '__pd_mx',
        ta('__pd_mx_summary', mxSummaryDefault(), 2, 'Count and tail list…'),
        '<div style="font-size:11px;color:rgba(255,255,255,.35);font-family:'+SANS+';margin-bottom:6px;">Summary line (editable)</div>')

    + sec('Open MELs', '__pd_mels',
        '<div id="__pd_mel_rows" style="margin-bottom:10px;">'+melRowsHtml()+'</div>'
        + '<div style="font-size:11px;color:rgba(255,255,255,.35);font-family:'+SANS+';margin-bottom:6px;">Override / additional notes</div>'
        + ta('__pd_mel_notes', '', 2, 'Extra MEL notes…'))

    + sec('Waiting for Parts', '__pd_wfp',
        '<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">'
        + '<span style="font-family:'+SANS+';font-size:13px;color:rgba(255,255,255,.6);">Count:</span>'
        + '<input type="text" id="__pd_wfp_count" value="0" style="width:60px;text-align:center;">'
        + '</div>'
        + ta('__pd_wfp', 'N/A', 2, 'Tail — part description…'))

    + sec('Scheduled MX Detail', '__pd_mxd',
        ta('__pd_mx_detail', mxDetailDefault(), Math.max(3, scheduledMX.length+1), 'Per-tail detail lines…'))

    + sec('MX Beginning Tomorrow', '__pd_tmr',
        ta('__pd_tomorrow', '', 3, 'Any MX starting tomorrow…'))

    + sec('Aircraft Low Hours / Low Landings', '__pd_lh',
        '<input type="text" id="__pd_low_hours" placeholder="N/A" style="resize:none;">')

    + sec('MX Coverage — Standard Schedule', '__pd_cov',
        ta('__pd_coverage', STATIC_COVERAGE, 7))

    + sec('MX Coverage — Calendar Absences', '__pd_cal',
        ta('__pd_calendar', calDefault, Math.max(3, calendarEntries.length+1), 'Calendar absences (auto-populated from JetInsight general calendar)…'))

    + sec('Pop-up Absences (Sick Calls / Last-Minute)', '__pd_abs',
        '<div id="__pd_abs_list"></div>'
        + '<button class="pd-add-btn" id="__pd_add_abs">+ Add Absence</button>')

    + sec('Notes', '__pd_notes',
        ta('__pd_notes_ta', '', 4, 'Any additional notes for this passdown…'))

    + '</div>'; // end max-width container

  ov.innerHTML = editorHtml;

  // Wire up interactive controls
  renderAbsences();

  document.getElementById('__pd_close').onclick = function() { ov.remove(); style.remove(); spinStyle.remove(); };

  document.getElementById('__pd_date').onchange = function() { reportDate = this.value; };

  document.getElementById('__pd_add_abs').onclick = function() {
    absences.push({ id: ++absenceIdSeq, name: '', dates: '', note: '' });
    renderAbsences();
  };

  // ── Copy Text ──────────────────────────────────────────────────────────────

  function gv(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function buildPlainText() {
    var aogCount = gv('__pd_aog_count') || '0';
    var aogTails = gv('__pd_aog') || 'N/A';
    var mxSummary = gv('__pd_mx_summary') || 'N/A';
    var mxDetail = gv('__pd_mx_detail') || 'N/A';
    var melNotes = gv('__pd_mel_notes');
    var wfpCount = gv('__pd_wfp_count') || '0';
    var wfpText = gv('__pd_wfp') || 'N/A';
    var tomorrow2 = gv('__pd_tomorrow') || 'N/A';
    var lowHours = gv('__pd_low_hours') || 'N/A';
    var coverage = gv('__pd_coverage') || STATIC_COVERAGE;
    var calendar = gv('__pd_calendar');
    var notesText = gv('__pd_notes_ta');

    // MEL lines
    var melLines = Object.keys(melData).sort().map(function(tail) {
      var m = melData[tail];
      var days = daysUntil(m.expiry);
      var expStr = m.expiry ? fmtDate(m.expiry) : '';
      var warn = days <= MEL_WARN_DAYS;
      return tail + ' - ' + m.count + (expStr ? ' | ' + (warn ? '⚠ ' : '') + 'EXP ' + expStr : '');
    });
    if (melNotes) melLines.push(melNotes);
    var melTotal = Object.values(melData).reduce(function(s,m){ return s+m.count; }, 0);
    var mostRestr = Object.keys(melData).sort().reduce(function(acc, tail) {
      var m = melData[tail];
      if (!m.expiry) return acc;
      if (!acc.expiry || m.expiry < acc.expiry) return { tail: tail, expiry: m.expiry };
      return acc;
    }, {});

    var absLines = absences.filter(function(a){ return a.name||a.dates; }).map(function(a) {
      return (a.name||'?') + (a.dates?' — '+a.dates:'') + (a.note?' ('+a.note+')':'');
    });

    var lines = [
      'MX Pass down',
      '',
      'AOG Aircraft - ' + aogCount,
      aogTails,
      '',
      'Scheduled MX - ' + mxSummary,
      mxDetail,
      '',
    ];

    if (melLines.length) {
      lines.push('Open MELs - ' + melTotal + (mostRestr.expiry ? ', most restrictive due - ' + mostRestr.tail + ' EXP ' + fmtDate(mostRestr.expiry) : ''));
      melLines.forEach(function(l){ lines.push(l); });
      lines.push('');
    }

    lines.push('Waiting for Parts - ' + wfpCount);
    lines.push(wfpText);
    lines.push('');
    lines.push('MX BEGINNING TOMORROW');
    lines.push(tomorrow2);
    lines.push('');
    lines.push('AIRCRAFT WITH LOW HOURS / LOW LANDINGS: ' + lowHours);
    lines.push('');
    lines.push('MX COVERAGE');
    lines.push(coverage);
    if (calendar) { lines.push(''); lines.push(calendar); }
    if (absLines.length) { lines.push(''); absLines.forEach(function(l){ lines.push(l); }); }
    lines.push('');
    lines.push('*NOTE: Information here is intended as an update and can change at any point in the evening.');
    if (notesText) { lines.push(''); lines.push(notesText); }

    return lines.join('\n');
  }

  document.getElementById('__pd_copy').onclick = async function() {
    var btn = this;
    try {
      await navigator.clipboard.writeText(buildPlainText());
    } catch(e) {
      var ta2 = document.createElement('textarea');
      ta2.value = buildPlainText();
      ta2.style.cssText = 'position:fixed;top:-9999px;';
      document.body.appendChild(ta2); ta2.select(); document.execCommand('copy'); ta2.remove();
    }
    var orig = btn.textContent; btn.textContent = '✓ Copied!'; btn.style.background = 'rgba(74,222,128,.15)'; btn.style.borderColor = '#4ade80'; btn.style.color = '#4ade80';
    setTimeout(function(){ btn.textContent = orig; btn.style.background = 'rgba(94,185,255,.12)'; btn.style.borderColor = 'rgba(94,185,255,.45)'; btn.style.color = '#5eb9ff'; }, 2000);
  };

  // ── PDF generation ─────────────────────────────────────────────────────────

  function loadLib(src) {
    return new Promise(function(resolve, reject) {
      if (document.querySelector('script[src="'+src+'"]')) { resolve(); return; }
      var s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  document.getElementById('__pd_pdf').onclick = async function() {
    var btn = this;
    btn.textContent = '⏳ Generating…'; btn.disabled = true;

    await loadLib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadLib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

    var aogCount = gv('__pd_aog_count') || '0';
    var aogTails = gv('__pd_aog') || 'N/A';
    var mxSummary = gv('__pd_mx_summary') || 'N/A';
    var mxDetail = gv('__pd_mx_detail') || 'N/A';
    var melNotes = gv('__pd_mel_notes');
    var wfpCount = gv('__pd_wfp_count') || '0';
    var wfpText = gv('__pd_wfp') || 'N/A';
    var tomorrow2 = gv('__pd_tomorrow') || 'N/A';
    var lowHours = gv('__pd_low_hours') || 'N/A';
    var coverage = gv('__pd_coverage') || STATIC_COVERAGE;
    var calendar2 = gv('__pd_calendar');
    var notesText = gv('__pd_notes_ta');
    var absLines = absences.filter(function(a){ return a.name||a.dates; }).map(function(a) {
      return (a.name||'?') + (a.dates?' — '+a.dates:'') + (a.note?' ('+a.note+')':'');
    });
    var melTotal = Object.values(melData).reduce(function(s,m){ return s+m.count; }, 0);
    var mostRestr = Object.keys(melData).sort().reduce(function(acc, tail) {
      var m = melData[tail];
      if (!m.expiry) return acc;
      if (!acc.expiry || m.expiry < acc.expiry) return { tail: tail, expiry: m.expiry };
      return acc;
    }, {});

    // Build printable div
    var pp = document.createElement('div');
    pp.id = '__pd_print';
    pp.style.cssText = 'position:fixed;left:-9999px;top:0;width:816px;background:#fff;color:#1a2035;font-family:Outfit,system-ui,sans-serif;padding:48px 54px 54px;';

    function pSec(label, body) {
      return '<div style="margin-bottom:18px;">'
        + '<div style="background:#1a3a6e;color:#fff;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;padding:7px 14px;border-radius:4px 4px 0 0;margin-bottom:0;">'+label+'</div>'
        + '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 4px 4px;padding:12px 14px;font-size:12.5px;line-height:1.65;color:#1a2035;white-space:pre-wrap;">'+body+'</div>'
        + '</div>';
    }

    function hl(s) {
      // highlight ⚠ lines in red
      return s.split('\n').map(function(l){
        return l.includes('⚠') ? '<span style="color:#dc2626;font-weight:700;">'+esc(l)+'</span>' : esc(l);
      }).join('\n');
    }

    var melBodyLines = Object.keys(melData).sort().map(function(tail) {
      var m = melData[tail];
      var days = daysUntil(m.expiry);
      var expStr = m.expiry ? fmtDate(m.expiry) : '';
      var warn = days <= MEL_WARN_DAYS;
      return tail + ' — ' + m.count + ' MEL' + (m.count!==1?'s':'') + (expStr ? ' | ' + (warn ? '⚠ ' : '') + 'EXP ' + expStr : '');
    });
    if (melNotes) melBodyLines.push(melNotes);

    pp.innerHTML = ''
      // Header
      + '<div style="text-align:center;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #1a3a6e;">'
      +   '<div style="font-size:22px;font-weight:700;color:#1a3a6e;letter-spacing:1px;">ADVANCED AIR</div>'
      +   '<div style="font-size:14px;font-weight:600;color:#4a5568;letter-spacing:2px;text-transform:uppercase;margin:4px 0 12px;">MX Passdown Report</div>'
      +   '<div style="font-size:12px;color:#64748b;">Date: ' + reportDate + ' &nbsp;|&nbsp; Generated: ' + zuluNow() + '</div>'
      + '</div>'

      + pSec('AOG Aircraft — ' + aogCount, esc(aogTails))
      + pSec('Scheduled MX — ' + mxSummary, esc(mxDetail))
      + pSec('Open MELs — Total ' + melTotal + (mostRestr.expiry?' | Most restrictive: '+mostRestr.tail+' EXP '+fmtDate(mostRestr.expiry):''), hl(melBodyLines.join('\n') || 'None'))
      + pSec('Waiting for Parts — ' + wfpCount, esc(wfpText))
      + pSec('MX Beginning Tomorrow', esc(tomorrow2))
      + pSec('Aircraft Low Hours / Low Landings', esc(lowHours))
      + '<div style="margin-bottom:18px;">'
      +   '<div style="background:#1a3a6e;color:#fff;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;padding:7px 14px;border-radius:4px 4px 0 0;">MX Coverage</div>'
      +   '<div style="background:#f0f4ff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 4px 4px;padding:12px 14px;font-size:12.5px;line-height:1.65;color:#1a2035;white-space:pre-wrap;">'+esc(coverage)+'</div>'
      + '</div>'
      + (calendar2 ? pSec('Calendar Absences', esc(calendar2)) : '')
      + (absLines.length ? pSec('Pop-up Absences', esc(absLines.join('\n'))) : '')
      + (notesText ? pSec('Notes', esc(notesText)) : '')

      // Footer
      + '<div style="margin-top:32px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center;letter-spacing:1px;">ADVANCED AIR, LLC — INTERNAL USE ONLY &nbsp;|&nbsp; ' + reportDate + '</div>';

    document.body.appendChild(pp);

    try {
      var canvas = await html2canvas(pp, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
      var { jsPDF } = window.jspdf;
      var pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      var pW = pdf.internal.pageSize.getWidth();
      var pH = pdf.internal.pageSize.getHeight();
      var margin = 0;
      var imgW = pW - margin*2;
      var imgH = (canvas.height * imgW) / canvas.width;
      var pageH = pH - margin*2;
      var pagesNeeded = Math.ceil(imgH / pageH);
      var srcH = Math.floor(canvas.height / pagesNeeded);

      for (var page = 0; page < pagesNeeded; page++) {
        if (page > 0) pdf.addPage();
        var srcY = page * srcH;
        var actualH = Math.min(srcH, canvas.height - srcY);
        var sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = actualH;
        var ctx = sliceCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, srcY, canvas.width, actualH, 0, 0, canvas.width, actualH);
        var sliceH = (actualH * imgW) / canvas.width;
        pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', margin, margin, imgW, sliceH);
      }

      var dateStr = reportDate || today;
      pdf.save('AAL_MX_Passdown_' + dateStr + '.pdf');
    } finally {
      pp.remove();
      btn.textContent = '⬇ Download PDF'; btn.disabled = false;
    }
  };

})();
