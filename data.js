// data.js — default starter data for Goal Grinder
// Load this BEFORE app.js in index.html

const DEFAULT_DATA = {
  settings: {
    dailyGoalMinutes: 120,     // change to your target minutes/day
    sectionColors: {},         // optional per-section colors keyed by section id
    collapsed: {}              // which sections are collapsed (id -> true)
  },

  // Top-level sections (you can reorder, add, or delete)
  sections: [
    {
      id: "sec-school",
      title: "School",
      items: [
        { id: "it-english-outline", title: "English – outline essay intro", duration: 25, notes: "" },
        { id: "it-chem-labprep",    title: "Chemistry – prep for next lab", duration: 20, notes: "" },
        { id: "it-history-rev",     title: "History – review key dates",    duration: 15, notes: "" }
      ],
      // Optional nested subsections
      children: [
        {
          id: "sec-math",
          title: "Math – Practice",
          items: [
            { id: "it-math-sets",     title: "Problem set (10 Qs)", duration: 30, notes: "" },
            { id: "it-math-mistakes", title: "Fix yesterday’s mistakes", duration: 15, notes: "" }
          ],
          children: []
        }
      ]
    },

    {
      id: "sec-fitness",
      title: "Fitness",
      items: [
        { id: "it-swim",     title: "Swimming – intervals", duration: 20, notes: "" },
        { id: "it-grappling",title: "Grappling drills",     duration: 20, notes: "" },
        { id: "it-cards",    title: "Card-deck workout",    duration: 10, notes: "" }
      ],
      children: []
    },

    {
      id: "sec-projects",
      title: "Projects",
      items: [
        { id: "it-plan-week",   title: "Plan week (tasks & deadlines)", duration: 15, notes: "" },
        { id: "it-cleanup-files", title: "Organize files/folders",       duration: 10, notes: "" }
      ],
      children: []
    },

    {
      id: "sec-personal",
      title: "Personal",
      items: [
        { id: "it-read20",   title: "Read 20 minutes", duration: 20, notes: "" },
        { id: "it-journal10",title: "Journal 10 minutes", duration: 10, notes: "" }
      ],
      children: []
    }
  ],

  // “Today” study queue (empty by default; the app can fill this)
  today: {
    date: (new Date()).toISOString().slice(0, 10),
    queue: [],          // typically holds {secId, itemId} entries
    active: null,       // currently active {secId, itemId} or null
    studiedSeconds: 0
  },

  // Daily totals or sessions can be recorded here by the app (date -> data)
  history: {
    // "2025-08-15": { studiedSeconds: 3600 }
  }
};
