// You can freely edit this starter template in-app or here.
// Timestamps are placeholders; update as you go.
// Tip: Use Export to back up, then paste back into this file if you want a new baseline.

const DEFAULT_DATA = {
  settings: {
    dailyGoalMinutes: 120
  },
  sections: [
    {
      id: cryptoId(),
      title: "Sketchy Micro – Gram Positive Bacteria",
      items: [
        { id: cryptoId(), title: "Staphylococcus aureus", duration: "21:00", notes: "", done: false },
        { id: cryptoId(), title: "Streptococcus pyogenes (GAS)", duration: "18:30", notes: "", done: false },
        { id: cryptoId(), title: "Streptococcus agalactiae (GBS)", duration: "13:45", notes: "", done: false },
        { id: cryptoId(), title: "Enterococcus", duration: "12:10", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Sketchy Micro – Gram Negative Bacteria",
      items: [
        { id: cryptoId(), title: "E. coli", duration: "23:10", notes: "", done: false },
        { id: cryptoId(), title: "Klebsiella", duration: "15:00", notes: "", done: false },
        { id: cryptoId(), title: "Pseudomonas", duration: "19:20", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Sketchy Micro – Viruses",
      items: [
        { id: cryptoId(), title: "HSV 1 and 2", duration: "20:00", notes: "", done: false },
        { id: cryptoId(), title: "Influenza", duration: "17:30", notes: "", done: false },
        { id: cryptoId(), title: "Hepatitis B", duration: "22:40", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Custom – Add Anything (UW blocks, Anki, Pathoma)",
      items: [
        { id: cryptoId(), title: "UWorld IM Block 1", duration: "75:00", notes: "Timed, tutor later", done: false },
        { id: cryptoId(), title: "Anki Micro review", duration: "30:00", notes: "Filtered deck 500 cards", done: false }
      ]
    }
  ],
  today: {
    date: todayISO(),
    queue: [], // [{sectionId, itemId}]
    active: null, // {sectionId, itemId, startedAt, elapsed}
    studiedSeconds: 0
  },
  history: {
    // "YYYY-MM-DD": minutes
  }
};

// Helpers available to app.js at load time
function cryptoId(){
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2, 10);
}
function todayISO(){ return new Date().toISOString().slice(0,10); }
