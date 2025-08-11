/* Step 1 Planner – Local, Offline, Collapsible, Trackable */
const LS_KEY = "step1_planner_state_v1";

let state = loadState();

// DOM
const sectionsEl = document.getElementById("sections");
const searchEl = document.getElementById("search");
const dailyGoalEl = document.getElementById("dailyGoal");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const resetBtn = document.getElementById("resetBtn");
const addSectionBtn = document.getElementById("addSectionBtn");
const fillTodayBtn = document.getElementById("fillTodayBtn");
const clearTodayBtn = document.getElementById("clearTodayBtn");
const todayListEl = document.getElementById("todayList");
const todayMetaEl = document.getElementById("todayMeta");
const activeTaskLabel = document.getElementById("activeTaskLabel");
const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const stopTimerBtn = document.getElementById("stopTimerBtn");
// Global progress
const overallPctEl = document.getElementById("overallPct");
const overallCountEl = document.getElementById("overallCount");
const overallBarEl = document.getElementById("overallBar");
const studiedTodayEl = document.getElementById("studiedToday");
const streakDaysEl = document.getElementById("streakDays");

// NEW: bulk add controls
const bulkBtn = document.getElementById("bulkBtn");
const bulkFile = document.getElementById("bulkFile");
const templateBtn = document.getElementById("templateBtn");

// Templates
const sectionTmpl = document.getElementById("sectionTmpl");
const itemTmpl = document.getElementById("itemTmpl");
const todayItemTmpl = document.getElementById("todayItemTmpl");

// Init
renderAll();
setupEvents();
tickTimer(); setInterval(tickTimer, 1000);

// ————— Core —————
function loadState(){
  const raw = localStorage.getItem(LS_KEY);
  if (!raw){
    const starter = structuredClone(DEFAULT_DATA);
    persist(starter);
    return starter;
  }
  try{
    const parsed = JSON.parse(raw);
    if (!parsed.today || parsed.today.date !== todayISO()){
      parsed.today = { date: todayISO(), queue: [], active: null, studiedSeconds: 0 };
    }
    parsed.settings = parsed.settings || { dailyGoalMinutes: 120 };
    return parsed;
  }catch{
    const starter = structuredClone(DEFAULT_DATA);
    persist(starter);
    return starter;
  }
}
function persist(s=state){ localStorage.setItem(LS_KEY, JSON.stringify(s)); }

function renderAll(){
  dailyGoalEl.value = state.settings.dailyGoalMinutes ?? 120;
  renderSections();
  renderToday();
  renderStats();
}

function renderSections(){
  sectionsEl.innerHTML = "";
  const q = (searchEl.value || "").trim().toLowerCase();
  state.sections.forEach(sec => {
    const el = sectionTmpl.content.firstElementChild.cloneNode(true);
    const titleEl = el.querySelector(".section-title");
    const countEl = el.querySelector(".count");
    const progressEl = el.querySelector(".progress .bar");
    const itemsWrap = el.querySelector(".items");
    titleEl.textContent = sec.title;

    const visibleItems = sec.items.filter(it => matchesQuery(it, q));
    countEl.textContent = `${visibleItems.length}/${sec.items.length} shown`;

    // section progress
    const doneCount = sec.items.filter(i => i.done).length;
    const pct = sec.items.length ? Math.round(100*doneCount/sec.items.length) : 0;
    progressEl.style.width = pct + "%";

    // header actions
    el.querySelector(".addItem").addEventListener("click", () => addItem(sec.id));
    el.querySelector(".rename").addEventListener("click", () => renameSection(sec.id));
    el.querySelector(".delete").addEventListener("click", () => deleteSection(sec.id));

    // items
    visibleItems.forEach((it) => {
      const row = itemTmpl.content.firstElementChild.cloneNode(true);
      const doneEl = row.querySelector(".done");
      const titleIn = row.querySelector(".title");
      const durIn = row.querySelector(".duration");
      const notesIn = row.querySelector(".notes");

      doneEl.checked = !!it.done;
      titleIn.value = it.title || "";
      durIn.value = it.duration || "";
      notesIn.value = it.notes || "";

      doneEl.addEventListener("change", () => {
        it.done = doneEl.checked;
        removeFromToday(sec.id, it.id, false);
        persist(); renderAll();
      });
      titleIn.addEventListener("input", () => { it.title = titleIn.value; persist(); });
      durIn.addEventListener("input", () => { it.duration = durIn.value; persist(); renderTodayMeta(); });
      notesIn.addEventListener("input", () => { it.notes = notesIn.value; persist(); });

      row.querySelector(".toToday").addEventListener("click", () => addToToday(sec.id, it.id));
      row.querySelector(".remove").addEventListener("click", () => deleteItem(sec.id, it.id));
      row.querySelector(".moveUp").addEventListener("click", () => moveItem(sec.id, it.id, -1));
      row.querySelector(".moveDown").addEventListener("click", () => moveItem(sec.id, it.id, +1));

      itemsWrap.appendChild(row);
    });

    sectionsEl.appendChild(el);
  });
}

function renderToday(){
  todayListEl.innerHTML = "";
  state.today.queue.forEach((q, idx) => {
    const sec = findSection(q.sectionId); if (!sec) return;
    const it = sec.items.find(x => x.id === q.itemId); if (!it) return;

    const row = todayItemTmpl.content.firstElementChild.cloneNode(true);
    row.querySelector(".ti-title").textContent = it.title;
    row.querySelector(".ti-duration").textContent = it.duration || "--:--";

    row.querySelector(".start").addEventListener("click", () => startTimer(q.sectionId, q.itemId));
    row.querySelector(".up").addEventListener("click", () => moveToday(idx, -1));
    row.querySelector(".down").addEventListener("click", () => moveToday(idx, +1));
    row.querySelector(".remove").addEventListener("click", () => removeFromToday(q.sectionId, q.itemId));

    todayListEl.appendChild(row);
  });
  renderTodayMeta();
  renderTimerUI();
}
function renderTodayMeta(){
  const goal = Number(state.settings.dailyGoalMinutes || 0);
  const planned = totalPlannedMinutes(state.today.queue);
  todayMetaEl.textContent = `Planned: ${planned} min  |  Goal: ${goal} min`;
}
function renderStats(){
  const [done, total] = totalDoneOverall();
  const pct = total ? Math.round(100*done/total) : 0;
  overallPctEl.textContent = pct + "%";
  overallCountEl.textContent = `${done}/${total}`;
  overallBarEl.style.width = pct + "%";

  const studiedMin = Math.round((state.today.studiedSeconds || 0) / 60);
  studiedTodayEl.textContent = `${studiedMin} min`;
  streakDaysEl.textContent = `${calcStreak()} days`;
}

// ————— Events —————
function setupEvents(){
  searchEl.addEventListener("input", () => renderSections());
  dailyGoalEl.addEventListener("input", () => {
    state.settings.dailyGoalMinutes = Number(dailyGoalEl.value || 0);
    persist(); renderTodayMeta();
  });

  exportBtn.addEventListener("click", onExport);
  importFile.addEventListener("change", onImport);
  resetBtn.addEventListener("click", onReset);

  addSectionBtn.addEventListener("click", addSection);
  fillTodayBtn.addEventListener("click", autoFillToday);
  clearTodayBtn.addEventListener("click", clearTodayQueue);

  startTimerBtn.addEventListener("click", () => {
    if (state.today.active) return;
    if (state.today.queue[0]) {
      const {sectionId, itemId} = state.today.queue[0];
      startTimer(sectionId, itemId);
    }
  });
  pauseTimerBtn.addEventListener("click", pauseTimer);
  stopTimerBtn.addEventListener("click", stopTimer);

  // Bulk add
  bulkBtn.addEventListener("click", () => bulkFile.click());
  bulkFile.addEventListener("change", handleBulkFile);
  templateBtn.addEventListener("click", downloadTemplateCSV);
}

// ————— Sections/Items CRUD —————
function addSection(){
  const title = prompt("Section name (eg, Sketchy Micro – Parasites):");
  if (!title) return;
  state.sections.push({ id: cryptoId(), title, items: [] });
  persist(); renderAll();
}
function renameSection(secId){
  const sec = findSection(secId); if (!sec) return;
  const title = prompt("Rename section:", sec.title);
  if (!title) return;
  sec.title = title; persist(); renderSections();
}
function deleteSection(secId){
  if (!confirm("Delete this section and all its items?")) return;
  const sec = findSection(secId);
  if (sec){ sec.items.forEach(it => removeFromToday(secId, it.id, false)); }
  state.sections = state.sections.filter(s => s.id !== secId);
  persist(); renderAll();
}
function addItem(secId){
  const sec = findSection(secId); if (!sec) return;
  const title = prompt("Item title:");
  if (!title) return;
  sec.items.push({ id: cryptoId(), title, duration: "", notes: "", done: false });
  persist(); renderSections();
}
function deleteItem(secId, itemId){
  const sec = findSection(secId); if (!sec) return;
  sec.items = sec.items.filter(i => i.id !== itemId);
  removeFromToday(secId, itemId, false);
  persist(); renderAll();
}
function moveItem(secId, itemId, dir){
  const sec = findSection(secId); if (!sec) return;
  const idx = sec.items.findIndex(i => i.id === itemId);
  if (idx<0) return;
  const j = idx + dir;
  if (j<0 || j>=sec.items.length) return;
  [sec.items[idx], sec.items[j]] = [sec.items[j], sec.items[idx]];
  persist(); renderSections();
}

// ————— Today Queue —————
function addToToday(sectionId, itemId){
  const sec = findSection(sectionId); if (!sec) return;
  const it = sec.items.find(i=>i.id===itemId); if (!it || it.done) return;
  if (!state.today.queue.find(q => q.sectionId===sectionId && q.itemId===itemId)){
    state.today.queue.push({sectionId, itemId});
    persist(); renderToday();
  }
}
function removeFromToday(sectionId, itemId, rerender=true){
  state.today.queue = state.today.queue.filter(q => !(q.sectionId===sectionId && q.itemId===itemId));
  if (state.today.active && state.today.active.sectionId===sectionId && state.today.active.itemId===itemId){
    state.today.active = null;
  }
  persist(); if (rerender) renderToday();
}
function moveToday(idx, dir){
  const j = idx + dir;
  if (j<0 || j>=state.today.queue.length) return;
  [state.today.queue[idx], state.today.queue[j]] = [state.today.queue[j], state.today.queue[idx]];
  persist(); renderToday();
}
function clearTodayQueue(){
  state.today.queue = [];
  state.today.active = null;
  state.today.studiedSeconds = state.today.studiedSeconds || 0;
  persist(); renderToday();
}
function autoFillToday(){
  const goal = Number(state.settings.dailyGoalMinutes||0);
  if (!goal) return;
  const remaining = uncompletedItems();
  let minutes = totalPlannedMinutes(state.today.queue);
  for (const {sec,it} of remaining){
    if (minutes >= goal) break;
    if (!state.today.queue.find(q => q.sectionId===sec.id && q.itemId===it.id)){
      state.today.queue.push({sectionId: sec.id, itemId: it.id});
      minutes += asMinutes(it.duration || "0");
    }
  }
  persist(); renderToday();
}

// ————— Timer —————
function startTimer(sectionId, itemId){
  const sec = findSection(sectionId); if (!sec) return;
  const it = sec.items.find(x=>x.id===itemId); if (!it) return;
  state.today.active = { sectionId, itemId, startedAt: Date.now(), elapsed: 0 };
  persist(); renderTimerUI();
  setActiveLabel(it.title);
}
function pauseTimer(){
  if (!state.today.active) return;
  const delta = Math.floor((Date.now() - state.today.active.startedAt)/1000);
  state.today.active.elapsed += delta;
  state.today.active.startedAt = Date.now();
  state.today.studiedSeconds += delta;
  persist(); renderTimerUI(); renderStats();
}
function stopTimer(){
  if (!state.today.active) return;
  const delta = Math.floor((Date.now() - state.today.active.startedAt)/1000);
  state.today.studiedSeconds += delta;
  const {sectionId, itemId} = state.today.active;
  const sec = findSection(sectionId); if (sec){
    const it = sec.items.find(i=>i.id===itemId);
    if (it) it.done = true;
  }
  removeFromToday(sectionId, itemId, false);
  state.today.active = null;
  persist(); renderAll();
}
function tickTimer(){
  if (!state.today.active){
    timerDisplay.textContent = "00:00:00"; return;
  }
  const secs = Math.floor((Date.now() - state.today.active.startedAt)/1000) + (state.today.active.elapsed||0);
  timerDisplay.textContent = formatHMS(secs);
}
function renderTimerUI(){
  if (!state.today.active){
    setActiveLabel("No active task"); timerDisplay.textContent = "00:00:00"; return;
  }
  const it = getItem(state.today.active.sectionId, state.today.active.itemId);
  setActiveLabel(it ? it.title : "Active task");
}
function setActiveLabel(txt){ activeTaskLabel.textContent = txt; }

// ————— Import/Export (state JSON) —————
function onExport(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `step1-planner-${todayISO()}.json`;
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
}
function onImport(e){
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const imported = JSON.parse(reader.result);
      if (!imported.settings) imported.settings = state.settings;
      state = imported; persist(); renderAll();
      alert("Import complete.");
    }catch{ alert("Invalid JSON."); }
    finally{ importFile.value = ""; }
  };
  reader.readAsText(file);
}
function onReset(){
  if (!confirm("This resets ALL data. Continue?")) return;
  state = structuredClone(DEFAULT_DATA);
  persist(); renderAll();
}

// ————— Bulk Add (CSV/XLSX) —————
function handleBulkFile(e){
  const f = e.target.files?.[0]; if (!f) return;
  const ext = f.name.split(".").pop().toLowerCase();
  const reader = new FileReader();

  if (ext === "csv") {
    reader.onload = () => importCSV(reader.result);
    reader.readAsText(f);
  } else if (ext === "xlsx" || ext === "xls") {
    if (window.XLSX){
      reader.onload = () => {
        const wb = XLSX.read(new Uint8Array(reader.result), {type:"array"});
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        importCSV(csv);
      };
      reader.readAsArrayBuffer(f);
    } else {
      alert("XLSX not available offline. Please export your sheet as CSV or keep the XLSX script tag.");
    }
  } else {
    alert("Please upload a .csv or .xlsx file.");
  }
  bulkFile.value = "";
}
function importCSV(csvText){
  const rows = csvToObjects(csvText);
  if (!rows.length){ alert("No rows found."); return; }

  let added=0, updated=0, createdSections=0;
  rows.forEach(r=>{
    const obj = normalizeRow(r);
    if (!obj.section || !obj.title) return;

    let sec = state.sections.find(s => (s.title||"").trim() === obj.section);
    if (!sec){
      sec = { id: cryptoId(), title: obj.section, items: [] };
      state.sections.push(sec); createdSections++;
    }
    const existing = sec.items.find(i => (i.title||"").trim() === obj.title);
    if (existing){
      existing.duration = obj.duration || existing.duration || "";
      existing.notes = obj.notes ?? existing.notes ?? "";
      updated++;
    }else{
      sec.items.push({
        id: cryptoId(),
        title: obj.title,
        duration: obj.duration || "",
        notes: obj.notes || "",
        done: false
      });
      added++;
    }
  });

  persist(); renderAll();
  alert(`Bulk add complete.\nSections created: ${createdSections}\nItems added: ${added}\nItems updated: ${updated}`);
}

function csvToObjects(text){
  const rows = csvToRows(text);
  if (!rows.length) return [];
  const headers = rows[0].map(h => (h||"").trim().toLowerCase());
  const out = [];
  for (let i=1;i<rows.length;i++){
    const row = rows[i];
    if (row.every(c => (c||"").trim()==="")) continue;
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (row[idx]||"").trim(); });
    out.push(obj);
  }
  return out;
}
function csvToRows(str){
  // Robust CSV parser: handles quotes, commas, newlines
  const rows = [];
  let cur = [], val = "", inQuotes = false;
  const s = String(str).replace(/\r\n/g,"\n").replace(/\r/g,"\n");
  for (let i=0;i<s.length;i++){
    const c = s[i], n = s[i+1];
    if (c === '"' ){
      if (inQuotes && n === '"'){ val += '"'; i++; } // escaped quote
      else { inQuotes = !inQuotes; }
    } else if (c === ',' && !inQuotes){
      cur.push(val); val="";
    } else if (c === '\n' && !inQuotes){
      cur.push(val); rows.push(cur); cur=[], val="";
    } else {
      val += c;
    }
  }
  cur.push(val); rows.push(cur);
  return rows;
}
function normalizeRow(r){
  // Accept a variety of header names
  const g = (k)=> r[k] ?? r[k?.toLowerCase()] ?? "";
  const byKeys = (keys)=> keys.map(k=>g(k)).find(v=>v!==undefined && v!=="") || "";
  return {
    section: byKeys(["section","sections"]),
    title: byKeys(["title","item","name"]),
    duration: byKeys(["duration","length","time"]),
    notes: byKeys(["notes","note","comment"])
  };
}
function downloadTemplateCSV(){
  const sample =
`Section,Title,Duration,Notes
Bacteria — 01 Gram Positive Cocci,Staphylococcus aureus,11:03,
Bacteria — 02 Gram Positive Bacilli,Clostridium difficile,08:17,watch with FA pg 135
Custom — Add Anything (UW, Anki, Pathoma, FA),UWorld Micro Block 2,75:00,Timed
`;
  const blob = new Blob([sample], {type:"text/csv"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "bulk-template.csv";
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
}

// ————— Utilities —————
function findSection(id){ return state.sections.find(s => s.id === id); }
function getItem(sectionId, itemId){
  const sec = findSection(sectionId); if (!sec) return null;
  return sec.items.find(i => i.id === itemId) || null;
}
function matchesQuery(it, q){
  if (!q) return true;
  return (it.title || "").toLowerCase().includes(q) || (it.notes || "").toLowerCase().includes(q);
}
function asMinutes(hms){
  if (!hms) return 0;
  const parts = hms.split(":").map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length===3){ const [h,m,s]=parts; return h*60 + m + Math.round(s/60) }
  if (parts.length===2){ const [m,s]=parts; return m + Math.round(s/60) }
  if (parts.length===1){ return Number(parts[0])||0; }
  return 0;
}
function formatHMS(secs){
  const h = Math.floor(secs/3600);
  const m = Math.floor((secs%3600)/60);
  const s = secs%60;
  const pad = n => String(n).padStart(2,"0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
function uncompletedItems(){
  const out = [];
  state.sections.forEach(sec=>{ sec.items.forEach(it=>{ if (!it.done) out.push({sec, it}); }); });
  return out;
}
function totalPlannedMinutes(queue){
  let total = 0;
  queue.forEach(q=>{
    const it = getItem(q.sectionId, q.itemId);
    total += asMinutes(it?.duration || "0");
  });
  return total;
}
function totalDoneOverall(){
  let done=0,total=0;
  state.sections.forEach(sec=>{
    sec.items.forEach(it=>{ total++; if (it.done) done++; });
  });
  return [done,total];
}
function calcStreak(){
  const today = todayISO();
  state.history[today] = Math.round((state.today.studiedSeconds||0)/60);
  persist();
  let streak = 0;
  let d = new Date(today);
  while (true){
    const key = d.toISOString().slice(0,10);
    const minutes = state.history[key] || 0;
    if (minutes>0) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}
function todayISO(){ return new Date().toISOString().slice(0,10); }
