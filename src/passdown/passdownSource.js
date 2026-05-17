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
  var A = '#5eb9ff', NAVY = '#1a3a6e', BG = '#0d1018';

  if (!document.getElementById('__pd_font')) {
    var lnk = document.createElement('link');
    lnk.id = '__pd_font'; lnk.rel = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
    document.head.appendChild(lnk);
  }
  var SANS = "'Outfit',system-ui,sans-serif";

  var ov = document.createElement('div');
  ov.id = '__pd_overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:999999;overflow-y:auto;font-family:'+SANS+';color:#fff;';
  document.body.appendChild(ov);

  var style = document.createElement('style');
  style.textContent = [
    '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap");',
    '@keyframes __pd_spin{to{transform:rotate(360deg)}}',
    '#__pd_overlay *{box-sizing:border-box;}',
    '.pd-field{background:rgba(0,0,0,.4);border:1.5px solid rgba(94,185,255,.3);color:#e8f4ff;font-family:'+SANS+';font-size:13px;border-radius:8px;padding:10px 12px;width:100%;resize:vertical;outline:none;line-height:1.55;}',
    '.pd-field:focus{border-color:'+A+';}',
    '.pd-inp{background:rgba(0,0,0,.4);border:1.5px solid rgba(94,185,255,.3);color:#e8f4ff;font-family:'+SANS+';font-size:13px;border-radius:8px;padding:8px 12px;width:100%;outline:none;}',
    '.pd-inp:focus{border-color:'+A+';}',
    '.pd-btn{transition:box-shadow .2s,border-color .2s;}',
    '.pd-btn:hover{box-shadow:0 0 0 1px '+A+',0 0 14px rgba(94,185,255,.45);border-color:'+A+';}',
    '.pd-sec-hdr{background:rgba(94,185,255,.1);border-left:3px solid '+A+';padding:8px 14px;font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:'+A+';margin:0 0 10px;}',
    '.pd-absence-row{display:flex;gap:8px;align-items:flex-start;padding:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;margin-bottom:8px;}',
    '.pd-del-btn{flex-shrink:0;background:rgba(255,80,80,.12);border:1px solid rgba(255,80,80,.35);color:#ff6b6b;padding:6px 10px;border-radius:6px;font-size:12px;cursor:pointer;font-family:'+SANS+';}',
    '.pd-del-btn:hover{background:rgba(255,80,80,.22);}',
    '.pd-add-btn{background:rgba(94,185,255,.1);border:1px solid rgba(94,185,255,.35);color:'+A+';padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'+SANS+';width:100%;}',
    '.pd-add-btn:hover{background:rgba(94,185,255,.18);}',
    '.mel-warn{color:#f87171;font-weight:700;}',
    '.mel-acc-hdr{display:flex;align-items:center;gap:10px;padding:9px 12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;margin-bottom:4px;user-select:none;}',
    '.mel-acc-hdr:hover{background:rgba(94,185,255,.07);}',
    '.mel-acc-body{display:none;padding:4px 0 10px;}',
    '.mel-acc-body.open{display:block;}',
    '.mel-def-card{background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:12px 14px;margin-bottom:8px;}',
    '.mel-lbl{font-size:10px;letter-spacing:1.5px;color:rgba(255,255,255,.45);text-transform:uppercase;margin-bottom:3px;}',
    '.mel-val{font-size:13px;color:#d0e8ff;margin-bottom:10px;line-height:1.5;}',
    '.pv-field{border:none;border-bottom:1px solid #ccc;background:transparent;resize:none;width:100%;font-family:Arial,sans-serif;font-size:8.5pt;color:#1a2035;line-height:1.55;padding:3px 0;outline:none;}',
    '.pv-field:focus{border-bottom-color:'+A+';}',
    '.pv-inp{border:none;border-bottom:1px solid #ccc;background:transparent;width:100%;font-family:Arial,sans-serif;font-size:8.5pt;color:#1a2035;padding:3px 0;outline:none;}',
    '.pv-inp:focus{border-bottom-color:'+A+';}',
    '@media(max-width:900px){#__pd_doc{zoom:0.82;transform-origin:top center;}}',
    '@media print{.pd-np{display:none!important}#__pd_doc{box-shadow:none!important;margin:0 auto!important}#__pd_overlay{background:#fff!important;overflow:visible!important}@page{size:letter;margin:.4in}}'
  ].join('');
  document.head.appendChild(style);

  // Module state
  var scheduledMX = [], melData = {}, calendarEntries = [], fetchErrors = [];
  var reportDateStr = '', endDateStr = '';
  var absences = [], absenceIdSeq = 0;
  var melExpanded = {};

  // ── Utilities ──────────────────────────────────────────────────────────────

  function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

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
    m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) return new Date(+m[1], +m[2]-1, +m[3]);
    m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return new Date(+m[3], +m[1]-1, +m[2]);
    m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
    if (m) { var yr = +m[3]; return new Date(yr < 50 ? 2000+yr : 1900+yr, +m[1]-1, +m[2]); }
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
    var mo = d.getMonth()+1, dy = d.getDate();
    return d.getFullYear()+'-'+(mo<10?'0':'')+mo+'-'+(dy<10?'0':'')+dy;
  }

  function addDays(str, n) {
    var p = str.split('-');
    var d = new Date(+p[0], +p[1]-1, +p[2]);
    d.setDate(d.getDate() + n);
    var mo = d.getMonth()+1, dy = d.getDate();
    return d.getFullYear()+'-'+(mo<10?'0':'')+mo+'-'+(dy<10?'0':'')+dy;
  }

  function fmtDisplay(str) {
    if (!str) return '';
    var p = str.split('-');
    return p.length === 3 ? p[1]+'/'+p[2]+'/'+p[0] : str;
  }

  function zuluNow() {
    var d = new Date();
    var h = d.getUTCHours(), mn = d.getUTCMinutes();
    return (h<10?'0':'')+h+(mn<10?'0':'')+mn+'Z';
  }

  function gv(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

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

  function loadLib(src) {
    return new Promise(function(resolve, reject) {
      if (document.querySelector('script[src="'+src+'"]')) { resolve(); return; }
      var s = document.createElement('script'); s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function log(msg) {
    var el = document.getElementById('__pd_log');
    if (el) el.innerHTML += '<div>▸ ' + msg + '</div>';
  }

  // ── Phase 1: Config Screen ─────────────────────────────────────────────────

  function renderConfigScreen() {
    ov.style.background = BG;
    var td = todayStr();
    ov.innerHTML = '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 18px;">'
      + '<div style="width:100%;max-width:480px;">'
      + '<div style="text-align:center;margin-bottom:36px;">'
      +   '<div style="font-size:10px;letter-spacing:3px;color:'+A+';font-family:'+SANS+';text-transform:uppercase;margin-bottom:14px;">MX Passdown</div>'
      +   '<h1 style="font-family:'+SANS+';font-weight:700;font-size:28px;color:#fff;margin:0 0 8px;">Configure Report</h1>'
      +   '<p style="font-family:'+SANS+';font-size:14px;color:rgba(255,255,255,.5);margin:0;">Select the report date and how far out to pull MX data.</p>'
      + '</div>'
      + '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:28px 24px;">'
      +   '<div style="margin-bottom:24px;">'
      +     '<label style="display:block;font-family:'+SANS+';font-size:11px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:10px;">Report Date</label>'
      +     '<select id="__pd_preset" class="pd-inp" style="cursor:pointer;">'
      +       '<option value="0">Today — ' + fmtDisplay(td) + '</option>'
      +       '<option value="1">Tomorrow — ' + fmtDisplay(addDays(td,1)) + '</option>'
      +       '<option value="2">Day After Tomorrow — ' + fmtDisplay(addDays(td,2)) + '</option>'
      +       '<option value="custom">Custom date…</option>'
      +     '</select>'
      +     '<input type="date" id="__pd_custom_date" value="'+td+'" style="display:none;margin-top:10px;background:rgba(0,0,0,.4);border:1.5px solid rgba(94,185,255,.3);color:#e8f4ff;font-family:'+SANS+';font-size:13px;border-radius:8px;padding:8px 12px;width:100%;outline:none;">'
      +   '</div>'
      +   '<div style="margin-bottom:28px;">'
      +     '<label style="display:block;font-family:'+SANS+';font-size:11px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-bottom:10px;">Include MX Data For The Next…</label>'
      +     '<select id="__pd_range" class="pd-inp" style="cursor:pointer;">'
      +       '<option value="1">1 day</option>'
      +       '<option value="2" selected>2 days</option>'
      +       '<option value="3">3 days</option>'
      +       '<option value="7">7 days</option>'
      +       '<option value="custom">Custom…</option>'
      +     '</select>'
      +     '<input type="date" id="__pd_custom_range" style="display:none;margin-top:10px;background:rgba(0,0,0,.4);border:1.5px solid rgba(94,185,255,.3);color:#e8f4ff;font-family:'+SANS+';font-size:13px;border-radius:8px;padding:8px 12px;width:100%;outline:none;box-sizing:border-box;">'
      +   '</div>'
      +   '<button id="__pd_fetch_btn" class="pd-btn" style="width:100%;background:'+A+';border:2px solid '+A+';color:#0d1018;padding:14px 24px;font-family:'+SANS+';font-size:15px;font-weight:700;letter-spacing:0.4px;cursor:pointer;border-radius:10px;">Fetch Data →</button>'
      + '</div>'
      + '<div style="text-align:center;margin-top:16px;font-family:'+SANS+';font-size:11px;color:rgba(255,255,255,.28);letter-spacing:2px;text-transform:uppercase;">Must be on portal.jetinsight.com</div>'
      + '</div>'
      + '</div>';

    document.getElementById('__pd_preset').onchange = function() {
      document.getElementById('__pd_custom_date').style.display = this.value === 'custom' ? 'block' : 'none';
    };

    document.getElementById('__pd_range').onchange = function() {
      document.getElementById('__pd_custom_range').style.display = this.value === 'custom' ? 'block' : 'none';
    };

    document.getElementById('__pd_fetch_btn').onclick = function() {
      var preset = document.getElementById('__pd_preset').value;
      var reportDate = preset === 'custom'
        ? (document.getElementById('__pd_custom_date').value || td)
        : addDays(td, +preset);
      var rangeVal = document.getElementById('__pd_range').value;
      var endDate = rangeVal === 'custom'
        ? (document.getElementById('__pd_custom_range').value || addDays(reportDate, 2))
        : addDays(reportDate, +rangeVal || 2);
      reportDateStr = reportDate;
      endDateStr = endDate;
      runFetch(reportDate, endDate);
    };
  }

  // ── Phase 2: Loading + Fetch ───────────────────────────────────────────────

  async function runFetch(reportDate, endDate) {
    ov.style.background = BG;
    ov.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px;padding:24px;">'
      + '<div style="width:44px;height:44px;border:3px solid rgba(94,185,255,.2);border-top-color:'+A+';border-radius:50%;animation:__pd_spin 0.8s linear infinite;"></div>'
      + '<div id="__pd_log" style="font-size:13px;color:rgba(255,255,255,.55);font-family:'+SANS+';text-align:center;line-height:2;max-width:420px;"></div>'
      + '</div>';

    scheduledMX = []; melData = {}; calendarEntries = []; fetchErrors = [];
    absences = []; absenceIdSeq = 0; melExpanded = {};
    var parser = new DOMParser();
    var SKIP_HDR = ['looking for', 'photos', 'maintenance sign', 'mel - category'];

    await fetch('/compliance/aircraft_readiness', { credentials: 'include' }).catch(function() {});

    // 1. Schedule
    try {
      log('Fetching MX schedule…');
      var sr = await fetch(
        '/schedule/aircraft.json?start='+reportDate+'&end='+endDate+'&time_zone=America%2FLos_Angeles',
        { credentials: 'include' }
      );
      var sched = await sr.json();
      if (!Array.isArray(sched)) sched = sched.events || sched.data || [];
      sched.forEach(function(e) {
        var type = (e.extendedProps && e.extendedProps.event_type_name) || '';
        if (type !== 'Maintenance') return;
        var tail  = ((e.extendedProps && e.extendedProps.aircraft) || '').trim();
        var loc   = ((e.extendedProps && e.extendedProps.origin_short) || (e.extendedProps && e.extendedProps.destination_short) || '').trim();
        var notes = ((e.extendedProps && e.extendedProps.notes) || '').trim().replace(/\n/g, ' ');
        if (tail) scheduledMX.push({ tail: tail, loc: loc, notes: notes });
      });
      log('Schedule: ' + scheduledMX.length + ' MX event' + (scheduledMX.length !== 1 ? 's' : '') + ' found');
    } catch(e) {
      fetchErrors.push('Schedule: ' + e.message);
      log('Schedule fetch failed');
    }

    var tails = [];
    scheduledMX.forEach(function(r) { if (r.tail && !tails.includes(r.tail)) tails.push(r.tail); });

    // 2. MELs — sequential, enrich with per-deferral items[]
    for (var ti = 0; ti < tails.length; ti++) {
      var tail2 = tails[ti];
      try {
        log('Scanning MELs: ' + tail2 + '…');
        var disHtml = await fetch(
          '/compliance/discrepancies/index_discrepancies_by_aircraft?aircraft='+encodeURIComponent(tail2)+'&per_page=500',
          { credentials: 'include' }
        ).then(function(r) { return r.text(); });
        var disDoc = parser.parseFromString(disHtml, 'text/html');
        var deferrals = [];
        disDoc.querySelectorAll('tbody tr').forEach(function(row) {
          var tds = Array.from(row.querySelectorAll('td'));
          if (!tds.length) return;
          if (tds[tds.length-1].textContent.trim() === 'Deferred') {
            var a = row.querySelector('a');
            if (a) deferrals.push({ href: a.href || (window.location.origin + a.getAttribute('href')), id: a.textContent.trim() });
          }
        });
        var defs = [];
        for (var di = 0; di < deferrals.length; di++) {
          try {
            var dh = await fetch(deferrals[di].href, { credentials: 'include' }).then(function(r) { return r.text(); });
            var dd = parser.parseFromString(dh, 'text/html');
            var expStr = getField(dd, 'Deferral expiration date');
            var allHdrs = Array.from(dd.querySelectorAll('.panel-heading'));
            var tEl = null;
            for (var hi = 0; hi < allHdrs.length; hi++) {
              var htxt = allHdrs[hi].textContent.toLowerCase();
              if (!SKIP_HDR.some(function(s){ return htxt.includes(s); })) { tEl = allHdrs[hi]; break; }
            }
            var mH = allHdrs.find(function(h){ return h.textContent.toLowerCase().includes('mel - category'); });
            var catM = mH ? mH.textContent.match(/Category\s+(\w)/i) : null;
            defs.push({
              id: deferrals[di].id,
              title: tEl ? tEl.textContent.trim() : deferrals[di].id,
              details: getField(dd, 'Details'),
              foundBy: getField(dd, 'Found by'),
              melCat: catM ? catM[1].toUpperCase() : '',
              melItem: getField(dd, 'Item number'),
              melLim: getField(dd, 'Operational limitation'),
              melExpiry: expStr,
              expiry: parseExpiry(expStr)
            });
          } catch(e2) { /* skip failed detail pages */ }
        }
        if (deferrals.length > 0) {
          var earliest = defs.reduce(function(min, d) {
            return d.expiry && (!min || d.expiry < min) ? d.expiry : min;
          }, null);
          melData[tail2] = { count: deferrals.length, expiry: earliest, items: defs };
        }
      } catch(e) {
        fetchErrors.push('MEL ' + tail2 + ': ' + e.message);
      }
    }

    // 3. General calendar — best-effort
    try {
      log('Checking mechanic calendar…');
      var cr = await fetch('/schedule/general.json?start='+reportDate+'&end='+endDate, { credentials: 'include' });
      if (cr.ok) {
        var calArr = await cr.json();
        if (!Array.isArray(calArr)) calArr = calArr.events || calArr.data || [];
        calArr.forEach(function(ev) {
          var title = ev.title || ev.name || '';
          var body  = ev.notes || ev.description || '';
          if (mechNameMatch(title) || mechNameMatch(body)) {
            calendarEntries.push(title + (body ? ' — ' + body : ''));
          }
        });
      }
    } catch(e) { /* calendar stays empty */ }

    log('Done — opening editor…');
    setTimeout(function() { renderEditorScreen(null); }, 400);
  }

  // ── Phase 3: Editor ────────────────────────────────────────────────────────

  function renderEditorScreen(savedVals) {
    ov.style.background = BG;
    var sv = savedVals || {};

    function mxSummaryDef() {
      if (!scheduledMX.length) return '';
      return scheduledMX.length + ' — ' + scheduledMX.map(function(r){ return r.tail; }).join(', ');
    }
    function mxDetailDef() {
      if (!scheduledMX.length) return '';
      return scheduledMX.map(function(r){ return r.tail + ' — MX @ ' + (r.loc||'?') + (r.notes?' | '+r.notes:''); }).join('\n');
    }

    var calDefault = sv.calendar !== undefined ? sv.calendar : (calendarEntries.length ? calendarEntries.join('\n') : '');

    function sec(label, content) {
      return '<div style="margin-bottom:22px;"><div class="pd-sec-hdr">'+label+'</div>'+content+'</div>';
    }
    function ta(id, val, rows, ph) {
      return '<textarea id="'+id+'" class="pd-field" rows="'+(rows||3)+'" placeholder="'+(ph||'')+'" style="min-height:'+(rows||3)*24+'px;">'+esc(val)+'</textarea>';
    }

    ov.innerHTML = '<div style="max-width:860px;margin:0 auto;padding:0 18px 100px;">'

      // Sticky toolbar
      + '<div style="position:sticky;top:0;z-index:10;background:'+BG+';display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:26px;">'
      +   '<button class="pd-btn" id="__pd_back_cfg" style="background:transparent;border:2px solid rgba(255,255,255,.14);color:rgba(255,255,255,.55);padding:8px 14px;font-family:'+SANS+';font-size:13px;font-weight:500;cursor:pointer;border-radius:8px;">← Config</button>'
      +   '<div style="text-align:center;">'
      +     '<div style="font-size:10px;letter-spacing:2px;color:rgba(255,255,255,.4);text-transform:uppercase;font-family:'+SANS+';margin-bottom:4px;">Report Date</div>'
      +     '<input type="date" id="__pd_date" value="'+(sv.reportDate||reportDateStr)+'" style="background:rgba(0,0,0,.4);border:1.5px solid rgba(94,185,255,.3);color:#e8f4ff;font-family:'+SANS+';font-size:13px;border-radius:8px;padding:7px 10px;outline:none;cursor:pointer;">'
      +   '</div>'
      +   '<button class="pd-btn" id="__pd_close" style="background:transparent;border:2px solid rgba(255,255,255,.14);color:rgba(255,255,255,.55);padding:8px 14px;font-family:'+SANS+';font-size:13px;font-weight:500;cursor:pointer;border-radius:8px;">✕ Close</button>'
      + '</div>'

      + '<h1 style="font-family:'+SANS+';font-weight:700;font-size:24px;color:#fff;margin:0 0 20px;">MX Pass Down — Edit Fields</h1>'

      + (fetchErrors.length ? '<div style="background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.35);border-radius:8px;padding:12px 16px;margin-bottom:18px;font-size:12px;color:#fca5a5;font-family:'+SANS+';">⚠ Some data could not be fetched — fill in manually:<br>'+fetchErrors.map(esc).join('<br>')+'</div>' : '')

      + sec('AOG Aircraft',
          '<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">'
          + '<span style="font-family:'+SANS+';font-size:13px;color:rgba(255,255,255,.6);">Count:</span>'
          + '<input type="text" id="__pd_aog_count" class="pd-inp" value="'+(sv.aogCount||'0')+'" style="width:70px;text-align:center;">'
          + '</div>'
          + ta('__pd_aog', sv.aogTails !== undefined ? sv.aogTails : 'N/A', 2, 'Tail numbers…'))

      + sec('Scheduled MX',
          '<div style="font-size:11px;color:rgba(255,255,255,.35);font-family:'+SANS+';margin-bottom:6px;">Summary line (editable)</div>'
          + ta('__pd_mx_summary', sv.mxSummary !== undefined ? sv.mxSummary : mxSummaryDef(), 2, 'Count and tail list…'))

      + '<div style="margin-bottom:22px;"><div class="pd-sec-hdr">Open MELs</div>'
      + '<div id="__pd_mel_acc"></div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,.35);font-family:'+SANS+';margin-top:10px;margin-bottom:6px;">Override / additional notes</div>'
      + ta('__pd_mel_notes', sv.melNotes||'', 2, 'Extra MEL notes…')
      + '</div>'

      + sec('Waiting for Parts',
          '<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px;">'
          + '<span style="font-family:'+SANS+';font-size:13px;color:rgba(255,255,255,.6);">Count:</span>'
          + '<input type="text" id="__pd_wfp_count" class="pd-inp" value="'+(sv.wfpCount||'0')+'" style="width:70px;text-align:center;">'
          + '</div>'
          + ta('__pd_wfp', sv.wfpText !== undefined ? sv.wfpText : 'N/A', 2, 'Tail — part description…'))

      + sec('Scheduled MX Detail',
          ta('__pd_mx_detail', sv.mxDetail !== undefined ? sv.mxDetail : mxDetailDef(), Math.max(3, scheduledMX.length+1), 'Per-tail detail lines…'))

      + sec('MX Beginning Tomorrow',
          ta('__pd_tomorrow', sv.tomorrow||'', 3, 'Any MX starting tomorrow…'))

      + sec('Aircraft Low Hours / Low Landings',
          '<input type="text" id="__pd_low_hours" class="pd-inp" value="'+(sv.lowHours||'')+'" placeholder="N/A">')

      + sec('MX Coverage — Standard Schedule',
          ta('__pd_coverage', sv.coverage !== undefined ? sv.coverage : STATIC_COVERAGE, 7))

      + sec('MX Coverage — Calendar Absences',
          ta('__pd_calendar', calDefault, Math.max(3, calendarEntries.length+1), 'Calendar absences…'))

      + '<div style="margin-bottom:22px;"><div class="pd-sec-hdr">Pop-up Absences (Sick Calls / Last-Minute)</div>'
      + '<div id="__pd_abs_list"></div>'
      + '<button class="pd-add-btn" id="__pd_add_abs">+ Add Absence</button>'
      + '</div>'

      + sec('Notes', ta('__pd_notes_ta', sv.notes||'', 4, 'Additional notes for this passdown…'))

      + '<div style="padding-top:16px;border-top:1px solid rgba(255,255,255,.08);">'
      + '<button class="pd-btn" id="__pd_generate" style="width:100%;background:'+A+';border:2px solid '+A+';color:#0d1018;padding:16px 24px;font-family:'+SANS+';font-size:16px;font-weight:700;letter-spacing:0.4px;cursor:pointer;border-radius:12px;">Generate MX Passdown →</button>'
      + '</div>'

      + '</div>';

    renderMelAccordion();
    if (sv.absences) absences = sv.absences.slice();
    renderAbsences();

    document.getElementById('__pd_back_cfg').onclick = function() { renderConfigScreen(); };
    document.getElementById('__pd_close').onclick = function() { ov.remove(); style.remove(); };
    document.getElementById('__pd_add_abs').onclick = function() {
      absences.push({ id: ++absenceIdSeq, name: '', dates: '', note: '' });
      renderAbsences();
    };
    document.getElementById('__pd_generate').onclick = function() {
      renderPrintView(captureEditorVals());
    };
  }

  function renderMelAccordion() {
    var container = document.getElementById('__pd_mel_acc');
    if (!container) return;
    var keys = Object.keys(melData).sort();
    if (!keys.length) {
      container.innerHTML = '<div style="color:rgba(255,255,255,.4);font-size:13px;padding:6px 0;">No MEL data retrieved — add notes manually below if needed.</div>';
      return;
    }
    container.innerHTML = '';
    keys.forEach(function(tail) {
      var m = melData[tail];
      var days = daysUntil(m.expiry);
      var expStr = m.expiry ? fmtDate(m.expiry) : '';
      var warn = days <= MEL_WARN_DAYS;
      var isOpen = !!melExpanded[tail];

      var wrap = document.createElement('div');
      wrap.style.marginBottom = '6px';

      var hdr = document.createElement('div');
      hdr.className = 'mel-acc-hdr';
      hdr.innerHTML = '<span id="__mel_arrow_'+tail+'" style="font-size:12px;color:rgba(255,255,255,.5);display:inline-block;transform:rotate('+(isOpen?'90':'0')+'deg);transition:transform .2s;">▶</span>'
        + '<span style="font-weight:700;color:#e8f4ff;font-family:'+SANS+';font-size:14px;">'+esc(tail)+'</span>'
        + '<span style="color:rgba(255,255,255,.6);font-size:13px;">'+m.count+' MEL'+(m.count!==1?'s':'')+'</span>'
        + (expStr ? '<span style="margin-left:auto;font-size:13px;" class="'+(warn?'mel-warn':'')+'">'+(warn?'⚠ ':'')+'EXP '+expStr+'</span>' : '');

      var body = document.createElement('div');
      body.className = 'mel-acc-body' + (isOpen ? ' open' : '');

      if (m.items && m.items.length) {
        m.items.forEach(function(item) {
          var idays = daysUntil(item.expiry);
          var iwarn = idays <= MEL_WARN_DAYS;
          var card = document.createElement('div');
          card.className = 'mel-def-card';
          card.innerHTML = '<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap;">'
            + '<span style="background:rgba(94,185,255,.15);border:1px solid rgba(94,185,255,.35);color:'+A+';font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;">'+esc(item.id)+'</span>'
            + (item.melCat ? '<span style="background:rgba(255,200,0,.12);border:1px solid rgba(255,200,0,.35);color:#fcd34d;font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;">CAT '+esc(item.melCat)+'</span>' : '')
            + (item.melExpiry ? '<span class="'+(iwarn?'mel-warn':'')+'" style="font-size:12px;margin-left:auto;">'+(iwarn?'⚠ ':'')+'EXP '+esc(item.melExpiry)+'</span>' : '')
            + '</div>'
            + (item.title   ? '<div class="mel-lbl">Discrepancy</div><div class="mel-val">'+esc(item.title)+'</div>' : '')
            + (item.foundBy ? '<div class="mel-lbl">Found By</div><div class="mel-val">'+esc(item.foundBy)+'</div>' : '')
            + (item.details ? '<div class="mel-lbl">Pilot Description</div><div class="mel-val">'+esc(item.details)+'</div>' : '')
            + (item.melLim  ? '<div class="mel-lbl">Operational Limitation</div><div class="mel-val" style="margin-bottom:0;">'+esc(item.melLim)+'</div>' : '');
          body.appendChild(card);
        });
      } else {
        body.innerHTML = '<div style="font-size:13px;color:rgba(255,255,255,.45);padding:8px 0;">Detail pages unavailable — expiry: '+(expStr||'unknown')+'</div>';
      }

      hdr.onclick = function() {
        melExpanded[tail] = !melExpanded[tail];
        body.classList.toggle('open', melExpanded[tail]);
        var arrow = document.getElementById('__mel_arrow_'+tail);
        if (arrow) arrow.style.transform = melExpanded[tail] ? 'rotate(90deg)' : 'rotate(0deg)';
      };

      wrap.appendChild(hdr);
      wrap.appendChild(body);
      container.appendChild(wrap);
    });
  }

  function renderAbsences() {
    var container = document.getElementById('__pd_abs_list');
    if (!container) return;
    container.innerHTML = '';
    absences.forEach(function(ab) {
      var row = document.createElement('div');
      row.className = 'pd-absence-row';
      row.innerHTML = '<input type="text" class="pd-inp" placeholder="Name" value="'+esc(ab.name)+'" data-id="'+ab.id+'" data-field="name" style="flex:0 0 130px;min-width:0;">'
        + '<input type="text" class="pd-inp" placeholder="Dates (e.g. 5/16–5/17)" value="'+esc(ab.dates)+'" data-id="'+ab.id+'" data-field="dates" style="flex:0 0 155px;min-width:0;">'
        + '<input type="text" class="pd-inp" placeholder="Note (sick call, PTO…)" value="'+esc(ab.note)+'" data-id="'+ab.id+'" data-field="note" style="flex:1;min-width:0;">'
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

  function captureEditorVals() {
    return {
      reportDate: gv('__pd_date') || reportDateStr,
      aogCount:   gv('__pd_aog_count') || '0',
      aogTails:   gv('__pd_aog') || 'N/A',
      mxSummary:  gv('__pd_mx_summary'),
      mxDetail:   gv('__pd_mx_detail'),
      melNotes:   gv('__pd_mel_notes'),
      wfpCount:   gv('__pd_wfp_count') || '0',
      wfpText:    gv('__pd_wfp') || 'N/A',
      tomorrow:   gv('__pd_tomorrow'),
      lowHours:   gv('__pd_low_hours'),
      coverage:   gv('__pd_coverage') || STATIC_COVERAGE,
      calendar:   gv('__pd_calendar'),
      notes:      gv('__pd_notes_ta'),
      absences:   absences.slice()
    };
  }

  // ── Phase 4: Print View ────────────────────────────────────────────────────

  function renderPrintView(vals) {
    ov.style.background = '#c0c0c0';
    ov.innerHTML = '';

    var melTails = Object.keys(melData).sort();
    var melTotal = melTails.reduce(function(s,t){ return s + melData[t].count; }, 0);
    var mostRestr = melTails.reduce(function(acc,t) {
      var m = melData[t];
      if (!m.expiry) return acc;
      if (!acc.expiry || m.expiry < acc.expiry) return { tail: t, expiry: m.expiry };
      return acc;
    }, {});

    function pvSec(label, content) {
      return '<div style="margin-bottom:11px;">'
        + '<div style="background:'+NAVY+';color:#fff;font-size:8px;letter-spacing:2.5px;text-transform:uppercase;font-weight:700;padding:5px 10px;border-radius:3px 3px 0 0;">'+label+'</div>'
        + '<div style="border:1px solid #d0d0d0;border-top:none;border-radius:0 0 3px 3px;padding:7px 10px;">'+content+'</div>'
        + '</div>';
    }
    function pvTa(id, val, rows) {
      return '<textarea id="'+id+'" class="pv-field" rows="'+(rows||2)+'">'+esc(val)+'</textarea>';
    }
    function pvInp(id, val) {
      return '<input type="text" id="'+id+'" class="pv-inp" value="'+esc(val)+'">';
    }

    var melBodyText = melTails.length
      ? melTails.map(function(t) {
          var m = melData[t], days = daysUntil(m.expiry), expStr = m.expiry ? fmtDate(m.expiry) : '';
          return t + ' — ' + m.count + ' MEL'+(m.count!==1?'s':'')+(expStr ? ' | '+(days<=MEL_WARN_DAYS?'⚠ ':'')+' EXP '+expStr : '');
        }).join('\n') + (vals.melNotes ? '\n'+vals.melNotes : '')
      : (vals.melNotes || 'None');

    var absLines = vals.absences.filter(function(a){ return a.name||a.dates; }).map(function(a) {
      return (a.name||'?')+(a.dates?' — '+a.dates:'')+(a.note?' ('+a.note+')':'');
    });

    var melHdr = 'Open MELs — '+melTotal+(mostRestr.expiry?' | Most Restrictive: '+mostRestr.tail+' EXP '+fmtDate(mostRestr.expiry):'');

    // Toolbar
    var toolbar = document.createElement('div');
    toolbar.className = 'pd-np';
    toolbar.style.cssText = 'position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;padding:10px 20px;background:#0d1018;border-bottom:2.5px solid '+A+';gap:12px;flex-wrap:wrap;';
    toolbar.innerHTML = '<button id="__pd_back_edit" style="background:transparent;border:2px solid rgba(255,255,255,.14);color:rgba(255,255,255,.55);padding:8px 16px;font-family:'+SANS+';font-size:13px;font-weight:500;cursor:pointer;border-radius:8px;">← Back to Edit</button>'
      + '<span style="color:'+A+';font-family:'+SANS+';font-weight:600;font-size:12px;flex:1;text-align:center;letter-spacing:0.5px;">MX Passdown · '+fmtDisplay(vals.reportDate)+' · click any field to edit</span>'
      + '<div style="display:flex;gap:10px;">'
      + '<button id="__pd_copy_pv" style="background:rgba(94,185,255,.12);border:2px solid rgba(94,185,255,.45);color:'+A+';padding:8px 16px;font-family:'+SANS+';font-size:13px;font-weight:700;cursor:pointer;border-radius:8px;">📋 Copy Text</button>'
      + '<button id="__pd_pdf_pv" style="background:'+A+';border:2px solid '+A+';color:#0d1018;padding:8px 18px;font-family:'+SANS+';font-size:13px;font-weight:700;cursor:pointer;border-radius:8px;">⬇ Download PDF</button>'
      + '</div>';

    // Letter document
    var docEl = document.createElement('div');
    docEl.id = '__pd_doc';
    docEl.style.cssText = 'background:#fff;width:816px;min-height:1056px;margin:20px auto 40px;padding:32pt 36pt 40pt;box-shadow:0 8px 56px rgba(0,0,0,.28);color:#1a2035;font-family:Arial,sans-serif;';

    var leftCol = [
      pvSec('AOG Aircraft — '+vals.aogCount, pvTa('__pv_aog', vals.aogTails||'N/A', 2)),
      pvSec('Scheduled MX — '+(vals.mxSummary||'0'), pvTa('__pv_mx_detail', vals.mxDetail||'N/A', Math.max(2, scheduledMX.length+1))),
      pvSec(melHdr, pvTa('__pv_mel', melBodyText, Math.max(2, melTails.length*2+1))),
      pvSec('Waiting for Parts — '+vals.wfpCount, pvTa('__pv_wfp', vals.wfpText||'N/A', 2)),
    ].join('');

    var rightCol = [
      pvSec('MX Beginning Tomorrow', pvTa('__pv_tomorrow', vals.tomorrow||'N/A', 3)),
      pvSec('Aircraft Low Hours / Low Landings', pvInp('__pv_low_hours', vals.lowHours||'N/A')),
      pvSec('MX Coverage', pvTa('__pv_coverage', vals.coverage||STATIC_COVERAGE, 7)),
      (vals.calendar ? pvSec('Calendar Absences', pvTa('__pv_calendar', vals.calendar, Math.max(2, calendarEntries.length+1))) : ''),
      (absLines.length ? pvSec('Pop-up Absences', pvTa('__pv_absences', absLines.join('\n'), Math.max(2, absLines.length))) : ''),
      (vals.notes ? pvSec('Notes', pvTa('__pv_notes', vals.notes, 3)) : ''),
    ].join('');

    docEl.innerHTML = ''
      + '<div style="text-align:center;margin-bottom:20px;padding-bottom:14px;border-bottom:2.5px solid '+NAVY+';">'
      +   '<div style="font-size:19pt;font-weight:700;color:'+NAVY+';letter-spacing:1px;font-family:Arial,sans-serif;">ADVANCED AIR</div>'
      +   '<div style="font-size:8.5pt;color:#6b7280;letter-spacing:3px;text-transform:uppercase;margin:4px 0 8px;font-family:Arial,sans-serif;">MX Passdown Report</div>'
      +   '<div style="font-size:8.5pt;color:#4b5563;font-family:Arial,sans-serif;">Date: '+fmtDisplay(vals.reportDate)+' &nbsp;|&nbsp; Generated: '+zuluNow()+'</div>'
      + '</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start;">'
      +   '<div>'+leftCol+'</div>'
      +   '<div>'+rightCol+'</div>'
      + '</div>'
      + '<div style="margin-top:20px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:7.5pt;color:#94a3b8;text-align:center;letter-spacing:1px;font-family:Arial,sans-serif;">ADVANCED AIR, LLC — INTERNAL USE ONLY &nbsp;|&nbsp; '+fmtDisplay(vals.reportDate)+'</div>';

    ov.appendChild(toolbar);
    ov.appendChild(docEl);

    document.getElementById('__pd_back_edit').onclick = function() {
      absences = vals.absences.slice();
      renderEditorScreen(vals);
    };

    document.getElementById('__pd_copy_pv').onclick = async function() {
      var btn = this;
      var pvVals = capturePvVals(vals);
      try { await navigator.clipboard.writeText(buildPlainText(pvVals)); }
      catch(e) {
        var ta2 = document.createElement('textarea');
        ta2.value = buildPlainText(pvVals);
        ta2.style.cssText = 'position:fixed;top:-9999px;';
        document.body.appendChild(ta2); ta2.select(); document.execCommand('copy'); ta2.remove();
      }
      var orig = btn.textContent; btn.textContent = '✓ Copied!';
      btn.style.background='rgba(74,222,128,.15)'; btn.style.borderColor='#4ade80'; btn.style.color='#4ade80';
      setTimeout(function(){ btn.textContent=orig; btn.style.background='rgba(94,185,255,.12)'; btn.style.borderColor='rgba(94,185,255,.45)'; btn.style.color=A; }, 2000);
    };

    document.getElementById('__pd_pdf_pv').onclick = async function() {
      var btn = this; btn.textContent = '⏳ Generating…'; btn.disabled = true;
      try { await downloadPDF(docEl, vals.reportDate); }
      catch(e) { alert('PDF generation failed — use browser Print instead.'); }
      finally { btn.textContent = '⬇ Download PDF'; btn.disabled = false; }
    };
  }

  function capturePvVals(baseVals) {
    function pvgv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
    return {
      reportDate: baseVals.reportDate,
      aogCount:   baseVals.aogCount,
      aogTails:   pvgv('__pv_aog') || baseVals.aogTails,
      mxSummary:  baseVals.mxSummary,
      mxDetail:   pvgv('__pv_mx_detail') || baseVals.mxDetail,
      melNotes:   pvgv('__pv_mel') || '',
      wfpCount:   baseVals.wfpCount,
      wfpText:    pvgv('__pv_wfp') || baseVals.wfpText,
      tomorrow:   pvgv('__pv_tomorrow') || baseVals.tomorrow,
      lowHours:   pvgv('__pv_low_hours') || baseVals.lowHours,
      coverage:   pvgv('__pv_coverage') || baseVals.coverage,
      calendar:   pvgv('__pv_calendar') || baseVals.calendar,
      notes:      pvgv('__pv_notes') || baseVals.notes,
      absences:   baseVals.absences
    };
  }

  // ── Plain text output ──────────────────────────────────────────────────────

  function buildPlainText(vals) {
    var melTails = Object.keys(melData).sort();
    var melTotal = melTails.reduce(function(s,t){ return s + melData[t].count; }, 0);
    var mostRestr = melTails.reduce(function(acc,t) {
      var m = melData[t];
      if (!m.expiry) return acc;
      if (!acc.expiry || m.expiry < acc.expiry) return { tail: t, expiry: m.expiry };
      return acc;
    }, {});
    var melLines = melTails.map(function(t) {
      var m = melData[t], days = daysUntil(m.expiry), expStr = m.expiry ? fmtDate(m.expiry) : '';
      return t + ' - ' + m.count + (expStr ? ' | '+(days<=MEL_WARN_DAYS?'⚠ ':'')+' EXP '+expStr : '');
    });
    if (vals.melNotes) melLines.push(vals.melNotes);
    var absLines = (vals.absences||[]).filter(function(a){ return a.name||a.dates; }).map(function(a) {
      return (a.name||'?')+(a.dates?' — '+a.dates:'')+(a.note?' ('+a.note+')':'');
    });
    var lines = [
      'MX Pass down', '',
      'AOG Aircraft - '+(vals.aogCount||'0'),
      vals.aogTails||'N/A', '',
      'Scheduled MX - '+(vals.mxSummary||'0'),
      vals.mxDetail||'N/A', ''
    ];
    if (melLines.length) {
      lines.push('Open MELs - '+melTotal+(mostRestr.expiry?', most restrictive due - '+mostRestr.tail+' EXP '+fmtDate(mostRestr.expiry):''));
      melLines.forEach(function(l){ lines.push(l); });
      lines.push('');
    }
    lines.push('Waiting for Parts - '+(vals.wfpCount||'0'));
    lines.push(vals.wfpText||'N/A');
    lines.push('');
    lines.push('MX BEGINNING TOMORROW');
    lines.push(vals.tomorrow||'N/A');
    lines.push('');
    lines.push('AIRCRAFT WITH LOW HOURS / LOW LANDINGS: '+(vals.lowHours||'N/A'));
    lines.push('');
    lines.push('MX COVERAGE');
    lines.push(vals.coverage||STATIC_COVERAGE);
    if (vals.calendar) { lines.push(''); lines.push(vals.calendar); }
    if (absLines.length) { lines.push(''); absLines.forEach(function(l){ lines.push(l); }); }
    lines.push('');
    lines.push('*NOTE: Information here is intended as an update and can change at any point in the evening.');
    if (vals.notes) { lines.push(''); lines.push(vals.notes); }
    return lines.join('\n');
  }

  // ── PDF generation ─────────────────────────────────────────────────────────

  async function downloadPDF(docEl, dateStr) {
    await loadLib('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    await loadLib('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

    // Swap input/textarea → proxy divs (same technique as ChecklistApp.jsx)
    var swaps = [];
    docEl.querySelectorAll('input, textarea').forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var cs = window.getComputedStyle(el);
      var proxy = document.createElement('div');
      proxy.style.cssText = el.style.cssText;
      proxy.style.width = rect.width + 'px';
      proxy.style.minHeight = rect.height + 'px';
      proxy.style.display = 'block';
      proxy.style.overflow = 'visible';
      proxy.style.whiteSpace = el.tagName === 'TEXTAREA' ? 'pre-wrap' : 'nowrap';
      proxy.style.lineHeight = cs.lineHeight;
      proxy.style.fontFamily = cs.fontFamily;
      proxy.style.fontSize = cs.fontSize;
      proxy.style.color = cs.color;
      proxy.style.padding = cs.padding;
      proxy.style.borderBottomWidth = cs.borderBottomWidth;
      proxy.style.borderBottomStyle = cs.borderBottomStyle;
      proxy.style.borderBottomColor = cs.borderBottomColor;
      proxy.textContent = el.value;
      el.insertAdjacentElement('afterend', proxy);
      el.style.display = 'none';
      swaps.push({ el: el, proxy: proxy });
    });

    try {
      var canvas = await html2canvas(docEl, {
        scale: 3, useCORS: true, allowTaint: true,
        backgroundColor: '#fff', logging: false,
        windowWidth: 900, scrollX: 0, scrollY: 0
      });
      var jsPDFCtor = window.jspdf.jsPDF;
      var pdf = new jsPDFCtor({ orientation: 'portrait', unit: 'pt', format: 'letter' });
      var m = 18, pageW = 612 - m*2, pageH = 792 - m*2;
      var sc = Math.min(pageW / canvas.width, pageH / canvas.height);
      var w = canvas.width * sc, h = canvas.height * sc;

      if (h <= pageH) {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (612-w)/2, m, w, h);
      } else {
        var rowH = Math.floor(canvas.height * pageH / h);
        var pages = Math.ceil(canvas.height / rowH);
        for (var pg = 0; pg < pages; pg++) {
          if (pg > 0) pdf.addPage();
          var srcY = pg * rowH;
          var srcH2 = Math.min(rowH, canvas.height - srcY);
          var slice = document.createElement('canvas');
          slice.width = canvas.width; slice.height = srcH2;
          slice.getContext('2d').drawImage(canvas, 0, srcY, canvas.width, srcH2, 0, 0, canvas.width, srcH2);
          pdf.addImage(slice.toDataURL('image/png'), 'PNG', (612-w)/2, m, w, srcH2*sc);
        }
      }
      pdf.save('AAL_MX_Passdown_' + (dateStr || todayStr()) + '.pdf');
    } finally {
      swaps.forEach(function(s){ s.el.style.display = ''; s.proxy.remove(); });
    }
  }

  // ── Kick off ───────────────────────────────────────────────────────────────
  renderConfigScreen();

})();
