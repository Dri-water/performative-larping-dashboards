export const agents = [
  {name:'ORACLE', role:'Chief of possibilities', color:'#ffd083', glyph:'◎', quote:'I have considered considering it.'},
  {name:'MOTH', role:'Signal acquisition', color:'#80efc0', glyph:'✧', quote:'A new signal. Probably a lamp.'},
  {name:'QUILL', role:'Narrative compliance', color:'#b9a0ff', glyph:'⌁', quote:'This could have been a footnote.'},
  {name:'VAULT', role:'Keeper of receipts', color:'#79cbff', glyph:'▧', quote:'I have filed the filing request.'},
  {name:'OMEN', role:'Contingency division', color:'#ff8eab', glyph:'◈', quote:'What if everything is fine?'},
  {name:'CLERK', role:'Final final approval', color:'#e3ec9a', glyph:'⊹', quote:'Approved for further approval.'},
];
export const wave = (x) => (Math.sin(x * 1.17) + Math.sin(x * .43 + 2) * .5) / 3 + .5;
export function stateAt(time, scenario='routine') {
  const multiplier = scenario === 'surge' ? 2 : scenario === 'night' ? .5 : 1;
  const count = Math.floor(time * multiplier);
  const phase = Math.floor(time % 12 / 3);
  return { time, count, multiplier, phase, processed: 1248 + count,
    pressure: 54 + wave(time * .5) * 42,
    loads: agents.map((_, i) => 30 + wave(time * .45 + i * 2.7) * 65),
    events: Array.from({length: 4}, (_, i) => {
      const n = count - i;
      return {id: Math.max(0,n), agent: ((n % 6) + 6) % 6, label: ['Dossier received', 'Possibility inspected', 'Committee consulted', 'Receipt dispatched'][((n%4)+4)%4]};
    }),
    phaseLabel: ['Receiving an extremely normal request','Consulting six separate departments','Synthesizing unnecessary complexity','Issuing a provisional conclusion'][phase],
  };
}
