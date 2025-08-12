// cryptoId shim for data.js (runs before app.js)
if (typeof cryptoId !== 'function'){
  var cryptoId = (function(){
    try{
      if (window.crypto && window.crypto.randomUUID) return function(){ return window.crypto.randomUUID(); };
    }catch(e){}
    return function(){ return 'id-' + Math.random().toString(36).slice(2,10); };
  })();
}

// Full Sketchy Micro list (from your image) + editable durations.
// If a few timestamps look off, tweak inline; it autosaves.

const DEFAULT_DATA = {
  settings: {
    dailyGoalMinutes: 120
  },
  sections: [
    {
      id: cryptoId(),
      title: "Bacteria — 01 Gram Positive Cocci",
      items: [
        { id: cryptoId(), title: "1.1 Staphylococcus aureus", duration: "11:03", notes: "", done: false },
        { id: cryptoId(), title: "1.2 Staphylococcus epidermidis", duration: "06:54", notes: "", done: false },
        { id: cryptoId(), title: "1.3 Streptococcus pyogenes (Group A Strep)", duration: "14:30", notes: "", done: false },
        { id: cryptoId(), title: "1.4 Streptococcus agalactiae (Group B Strep)", duration: "05:23", notes: "", done: false },
        { id: cryptoId(), title: "1.5 Streptococcus pneumoniae & Viridans", duration: "09:17", notes: "", done: false },
        { id: cryptoId(), title: "1.6 Enterococcus", duration: "04:06", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 02 Gram Positive Bacilli",
      items: [
        { id: cryptoId(), title: "2.1 Bacillus anthracis & Bacillus cereus", duration: "09:50", notes: "", done: false },
        { id: cryptoId(), title: "2.2 Clostridium tetani", duration: "06:42", notes: "", done: false },
        { id: cryptoId(), title: "2.3 Clostridium botulinum", duration: "07:35", notes: "", done: false },
        { id: cryptoId(), title: "2.4 Clostridium difficile", duration: "08:17", notes: "", done: false },
        { id: cryptoId(), title: "2.5 Clostridium perfringens", duration: "05:13", notes: "Verify time", done: false },
        { id: cryptoId(), title: "2.6 Corynebacterium diphtheriae", duration: "06:49", notes: "", done: false },
        { id: cryptoId(), title: "2.7 Listeria monocytogenes", duration: "04:04", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 03 Branching Filamentous Rods",
      items: [
        { id: cryptoId(), title: "3.1 Actinomyces israelii", duration: "03:01", notes: "", done: false },
        { id: cryptoId(), title: "3.2 Nocardia", duration: "06:50", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 04 Gram Negative Cocci",
      items: [
        { id: cryptoId(), title: "4.1 Neisseria species overview", duration: "05:07", notes: "", done: false },
        { id: cryptoId(), title: "4.2 Neisseria meningitidis", duration: "08:59", notes: "", done: false },
        { id: cryptoId(), title: "4.3 Neisseria gonorrhoeae", duration: "07:33", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 05 Gram Negative Bacilli (Enteric tract)",
      items: [
        { id: cryptoId(), title: "5.1 Klebsiella, Enterobacter, Serratia", duration: "07:49", notes: "", done: false },
        { id: cryptoId(), title: "5.2 Salmonella", duration: "05:51", notes: "", done: false },
        { id: cryptoId(), title: "5.3 Shigella", duration: "06:26", notes: "", done: false },
        { id: cryptoId(), title: "5.4 Escherichia coli (ETEC, EHEC)", duration: "08:51", notes: "", done: false },
        { id: cryptoId(), title: "5.5 Yersinia enterocolitica", duration: "07:54", notes: "", done: false },
        { id: cryptoId(), title: "5.6 Campylobacter", duration: "05:30", notes: "", done: false },
        { id: cryptoId(), title: "5.7 Vibrio", duration: "05:45", notes: "", done: false },
        { id: cryptoId(), title: "5.8 Helicobacter pylori", duration: "05:23", notes: "", done: false },
        { id: cryptoId(), title: "5.9 Pseudomonas aeruginosa", duration: "09:59", notes: "", done: false },
        { id: cryptoId(), title: "5.10 Proteus mirabilis", duration: "02:54", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 06 Gram Negative Bacilli (Respiratory tract)",
      items: [
        { id: cryptoId(), title: "6.1 Bordetella pertussis", duration: "07:39", notes: "", done: false },
        { id: cryptoId(), title: "6.2 Haemophilus influenzae", duration: "08:46", notes: "", done: false },
        { id: cryptoId(), title: "6.3 Legionella pneumophila", duration: "07:26", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 07 Gram Negative Bacilli (Zoonotics)",
      items: [
        { id: cryptoId(), title: "7.1 Bartonella henselae", duration: "04:15", notes: "", done: false },
        { id: cryptoId(), title: "7.2 Brucella", duration: "04:41", notes: "", done: false },
        { id: cryptoId(), title: "7.3 Francisella tularensis", duration: "03:50", notes: "", done: false },
        { id: cryptoId(), title: "7.4 Pasteurella multocida", duration: "03:55", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 08 Mycobacteria",
      items: [
        { id: cryptoId(), title: "8.1 Mycobacterium tuberculosis", duration: "16:35", notes: "", done: false },
        { id: cryptoId(), title: "8.2 Mycobacterium leprae", duration: "09:17", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 09 Spirochetes",
      items: [
        { id: cryptoId(), title: "9.1 Borrelia (Lyme)", duration: "08:16", notes: "", done: false },
        { id: cryptoId(), title: "9.2 Leptospirosis", duration: "04:18", notes: "", done: false },
        { id: cryptoId(), title: "9.3 Treponema pallidum", duration: "12:52", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Bacteria — 10 Gram-Indeterminate",
      items: [
        { id: cryptoId(), title: "10.1 Chlamydia", duration: "15:49", notes: "Verify time", done: false },
        { id: cryptoId(), title: "10.2 Coxiella burnetii", duration: "04:57", notes: "Verify time", done: false },
        { id: cryptoId(), title: "10.3 Gardnerella vaginalis", duration: "05:32", notes: "", done: false },
        { id: cryptoId(), title: "10.4 Mycoplasma pneumoniae", duration: "05:57", notes: "Verify time", done: false },
        { id: cryptoId(), title: "10.5 Rickettsia species overview", duration: "03:34", notes: "", done: false },
        { id: cryptoId(), title: "10.6 Rickettsia prowazekii", duration: "04:11", notes: "", done: false },
        { id: cryptoId(), title: "10.7 Rickettsia rickettsii", duration: "04:00", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Fungi — 1 Systemic Mycoses",
      items: [
        { id: cryptoId(), title: "1.1 Histoplasmosis", duration: "09:38", notes: "", done: false },
        { id: cryptoId(), title: "1.2 Blastomycosis", duration: "06:09", notes: "", done: false },
        { id: cryptoId(), title: "1.3 Coccidioidomycosis", duration: "07:26", notes: "", done: false },
        { id: cryptoId(), title: "1.4 Paracoccidioidomycosis", duration: "04:55", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Fungi — 2 Cutaneous Mycoses",
      items: [
        { id: cryptoId(), title: "2.1 Malassezia furfur / Pityriasis versicolor", duration: "05:10", notes: "", done: false },
        { id: cryptoId(), title: "2.2 Dermatophytes", duration: "06:01", notes: "", done: false },
        { id: cryptoId(), title: "2.3 Sporothrix schenckii", duration: "04:24", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Fungi — 3 Opportunistic Infections",
      items: [
        { id: cryptoId(), title: "3.1 Candida albicans", duration: "12:49", notes: "", done: false },
        { id: cryptoId(), title: "3.2 Aspergillus fumigatus", duration: "10:51", notes: "", done: false },
        { id: cryptoId(), title: "3.3 Cryptococcus neoformans", duration: "09:00", notes: "", done: false },
        { id: cryptoId(), title: "3.4 Mucormycosis", duration: "06:17", notes: "", done: false },
        { id: cryptoId(), title: "3.5 Pneumocystis pneumonia (PJP)", duration: "05:49", notes: "", done: false }
      ]
    },
    {
      id: cryptoId(),
      title: "Custom — Add Anything (UW, Anki, Pathoma, FA)",
      items: [
        { id: cryptoId(), title: "UWorld Micro Block 1 (timed)", duration: "75:00", notes: "", done: false }
      ]
    }
  ],
  today: {
    date: todayISO(),
    queue: [],
    active: null,
    studiedSeconds: 0
  },
  history: {}
};

// Helpers available to app.js at load time
function cryptoId(){
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2, 10);
}
function todayISO(){ return new Date().toISOString().slice(0,10); }
