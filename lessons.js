/* Legal Lab — lesson content
 * ------------------------------------------------------------
 * To add lessons: append objects to LESSONS in teaching order, bump CONTENT_VERSION,
 * and bump CACHE in sw.js. NEVER change or reuse an existing item id — student
 * review schedules are keyed to them.
 *
 * Item types:
 *   {type:'mc',   q, options:[...], answer:<index>, explain, hint?, src?}
 *   {type:'tf',   q, answer:true|false, explain, hint?, src?}
 *   {type:'text', q, accept:['canonical answer', 'variant', ...], explain, hint?, src?}
 *       (marking ignores case/punctuation/leading 'the' and tolerates small misspellings)
 *   {type:'short', q, rubric, marks}   <- RESERVED for future AI marking; skipped for now.
 * Teach card types: rule {title, html} · contrast {title, rule, examples, nonexamples} · diagram {title, svg, caption}
 * Set released:false to hide a lesson until it's taught.
 */
window.CONTENT_VERSION = '1.5.0';

const SVG_COURTS = `
<svg class="diagram" viewBox="0 0 640 380" role="img" aria-label="Victorian court hierarchy for criminal cases">
 <defs><marker id="ar" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f7a8c"/></marker></defs>
 <rect x="20" y="10" width="250" height="56" rx="10" fill="#fff" stroke="#9aa3ad" stroke-dasharray="6 4" stroke-width="2"/>
 <text x="145" y="35" text-anchor="middle" font-size="16" font-weight="700" fill="#1d3557">High Court of Australia</text>
 <text x="145" y="55" text-anchor="middle" font-size="12" fill="#5b6675">federal · final appeals</text>
 <rect x="20" y="96" width="250" height="56" rx="10" fill="#e8eef6" stroke="#1d3557" stroke-width="2"/>
 <text x="145" y="121" text-anchor="middle" font-size="15" font-weight="700" fill="#1d3557">Supreme Court – Court of Appeal</text>
 <text x="145" y="141" text-anchor="middle" font-size="12" fill="#5b6675">hears appeals</text>
 <rect x="20" y="182" width="250" height="56" rx="10" fill="#e8eef6" stroke="#1d3557" stroke-width="2"/>
 <text x="145" y="207" text-anchor="middle" font-size="15" font-weight="700" fill="#1d3557">Supreme Court – Trial Division</text>
 <text x="145" y="227" text-anchor="middle" font-size="12" fill="#5b6675">judge + jury</text>
 <rect x="20" y="248" width="250" height="56" rx="10" fill="#e8eef6" stroke="#1d3557" stroke-width="2"/>
 <text x="145" y="273" text-anchor="middle" font-size="16" font-weight="700" fill="#1d3557">County Court</text>
 <text x="145" y="293" text-anchor="middle" font-size="12" fill="#5b6675">judge + jury</text>
 <rect x="20" y="314" width="250" height="56" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="2"/>
 <text x="145" y="339" text-anchor="middle" font-size="16" font-weight="700" fill="#1d3557">Magistrates' Court</text>
 <text x="145" y="359" text-anchor="middle" font-size="12" fill="#5b6675">magistrate · no jury</text>
 <line x1="300" y1="360" x2="300" y2="20" stroke="#1f7a8c" stroke-width="3" marker-end="url(#ar)"/>
 <text x="312" y="200" font-size="13" fill="#1f7a8c" font-weight="700" transform="rotate(-90 312 200)" text-anchor="middle">more serious · appeals go up</text>
 <text x="340" y="205" font-size="14" fill="#1b2430"><tspan font-weight="700">Most serious indictable</tspan></text>
 <text x="340" y="223" font-size="13" fill="#5b6675">e.g. murder, attempted murder</text>
 <text x="340" y="271" font-size="14" fill="#1b2430"><tspan font-weight="700">Most indictable offences</tspan></text>
 <text x="340" y="289" font-size="13" fill="#5b6675">e.g. armed robbery, culpable driving</text>
 <text x="340" y="335" font-size="14" fill="#1b2430"><tspan font-weight="700">Summary offences</tspan></text>
 <text x="340" y="353" font-size="13" fill="#5b6675">+ indictable offences heard summarily</text>
</svg>`;

const SVG_STANDARD = `
<svg class="diagram" viewBox="0 0 640 220" role="img" aria-label="Standard of proof comparison">
 <text x="20" y="30" font-size="15" font-weight="700" fill="#1d3557">Civil case — plaintiff must prove…</text>
 <rect x="20" y="42" width="600" height="28" rx="6" fill="#e3e7ec"/>
 <rect x="20" y="42" width="312" height="28" rx="6" fill="#1f7a8c"/>
 <line x1="320" y1="36" x2="320" y2="78" stroke="#1b2430" stroke-width="2"/>
 <text x="326" y="95" font-size="13" fill="#1b2430">tips the scales: <tspan font-weight="700">more probable than not</tspan></text>
 <text x="20" y="135" font-size="15" font-weight="700" fill="#1d3557">Criminal case — prosecution must prove…</text>
 <rect x="20" y="147" width="600" height="28" rx="6" fill="#e3e7ec"/>
 <rect x="20" y="147" width="560" height="28" rx="6" fill="#1d3557"/>
 <line x1="572" y1="141" x2="572" y2="183" stroke="#1b2430" stroke-width="2"/>
 <text x="566" y="200" font-size="13" fill="#1b2430" text-anchor="end"><tspan font-weight="700">beyond reasonable doubt</tspan> — no reasonable doubt left</text>
</svg>`;


const SVG_SANCTIONS = `
<svg class="diagram" viewBox="0 0 640 400" role="img" aria-label="Sanctions ladder: fine, community correction order, imprisonment">
 <text x="10" y="30" font-size="20" font-weight="700" fill="#1f7a8c">More severe →</text>
 <rect x="10" y="250" width="200" height="140" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="3"/>
 <text x="110" y="285" text-anchor="middle" font-size="26" font-weight="700" fill="#1d3557">Fine</text>
 <text x="110" y="318" text-anchor="middle" font-size="18" fill="#1b2430">punishment</text>
 <text x="110" y="342" text-anchor="middle" font-size="18" fill="#1b2430">deterrence</text>
 <text x="110" y="366" text-anchor="middle" font-size="18" fill="#1b2430">denunciation</text>
 <rect x="220" y="150" width="200" height="240" rx="10" fill="#fff4c2" stroke="#b08900" stroke-width="3"/>
 <text x="320" y="185" text-anchor="middle" font-size="26" font-weight="700" fill="#1d3557">CCO</text>
 <text x="320" y="210" text-anchor="middle" font-size="15" fill="#5b6675">in the community</text>
 <text x="320" y="245" text-anchor="middle" font-size="18" font-weight="700" fill="#1b2430">rehabilitation</text>
 <text x="320" y="270" text-anchor="middle" font-size="18" fill="#1b2430">punishment</text>
 <text x="320" y="294" text-anchor="middle" font-size="18" fill="#1b2430">protection</text>
 <rect x="430" y="50" width="200" height="340" rx="10" fill="#fdecea" stroke="#c62828" stroke-width="3"/>
 <text x="530" y="85" text-anchor="middle" font-size="24" font-weight="700" fill="#1d3557">Imprisonment</text>
 <text x="530" y="110" text-anchor="middle" font-size="15" font-weight="700" fill="#c62828">LAST RESORT</text>
 <text x="530" y="145" text-anchor="middle" font-size="18" font-weight="700" fill="#1b2430">protection</text>
 <text x="530" y="170" text-anchor="middle" font-size="18" fill="#1b2430">punishment</text>
 <text x="530" y="194" text-anchor="middle" font-size="18" fill="#1b2430">denunciation</text>
 <text x="530" y="218" text-anchor="middle" font-size="18" fill="#1b2430">deterrence</text>
</svg>`;


const SVG_ADR = `
<svg class="diagram" viewBox="0 0 640 300" role="img" aria-label="Power of the third party: mediation, conciliation, arbitration">
 <defs><marker id="ar2" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f7a8c"/></marker></defs>
 <line x1="20" y1="40" x2="610" y2="40" stroke="#1f7a8c" stroke-width="4" marker-end="url(#ar2)"/>
 <text x="20" y="26" font-size="18" font-weight="700" fill="#1f7a8c">Third party has more power →</text>
 <rect x="10" y="70" width="200" height="210" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="3"/>
 <text x="110" y="108" text-anchor="middle" font-size="24" font-weight="700" fill="#1d3557">Mediation</text>
 <text x="110" y="148" text-anchor="middle" font-size="18" fill="#1b2430">mediator</text>
 <text x="110" y="174" text-anchor="middle" font-size="18" font-weight="700" fill="#1b2430">facilitates</text>
 <text x="110" y="226" text-anchor="middle" font-size="16" fill="#5b6675">parties decide</text>
 <rect x="220" y="70" width="200" height="210" rx="10" fill="#fff4c2" stroke="#b08900" stroke-width="3"/>
 <text x="320" y="108" text-anchor="middle" font-size="24" font-weight="700" fill="#1d3557">Conciliation</text>
 <text x="320" y="148" text-anchor="middle" font-size="18" fill="#1b2430">conciliator</text>
 <text x="320" y="174" text-anchor="middle" font-size="18" font-weight="700" fill="#1b2430">suggests</text>
 <text x="320" y="226" text-anchor="middle" font-size="16" fill="#5b6675">parties decide</text>
 <rect x="430" y="70" width="200" height="210" rx="10" fill="#fdecea" stroke="#c62828" stroke-width="3"/>
 <text x="530" y="108" text-anchor="middle" font-size="24" font-weight="700" fill="#1d3557">Arbitration</text>
 <text x="530" y="148" text-anchor="middle" font-size="18" fill="#1b2430">arbitrator</text>
 <text x="530" y="174" text-anchor="middle" font-size="18" font-weight="700" fill="#1b2430">decides</text>
 <text x="530" y="226" text-anchor="middle" font-size="16" fill="#5b6675">binding award</text>
</svg>`;

const SVG_CIVIL_COURTS = `
<svg class="diagram" viewBox="0 0 640 330" role="img" aria-label="Victorian courts' civil jurisdiction">
 <rect x="10" y="10" width="370" height="70" rx="10" fill="#e8eef6" stroke="#1d3557" stroke-width="3"/>
 <text x="195" y="42" text-anchor="middle" font-size="21" font-weight="700" fill="#1d3557">Court of Appeal</text>
 <text x="195" y="67" text-anchor="middle" font-size="17" fill="#5b6675">appeals</text>
 <rect x="10" y="90" width="370" height="70" rx="10" fill="#e8eef6" stroke="#1d3557" stroke-width="3"/>
 <text x="195" y="122" text-anchor="middle" font-size="21" font-weight="700" fill="#1d3557">Supreme Court (Trial Div.)</text>
 <text x="195" y="147" text-anchor="middle" font-size="17" fill="#5b6675">unlimited · complex · class actions</text>
 <rect x="10" y="170" width="370" height="70" rx="10" fill="#e8eef6" stroke="#1d3557" stroke-width="3"/>
 <text x="195" y="202" text-anchor="middle" font-size="21" font-weight="700" fill="#1d3557">County Court</text>
 <text x="195" y="227" text-anchor="middle" font-size="17" fill="#5b6675">unlimited</text>
 <rect x="10" y="250" width="370" height="70" rx="10" fill="#e8f5e9" stroke="#2e7d32" stroke-width="3"/>
 <text x="195" y="282" text-anchor="middle" font-size="21" font-weight="700" fill="#1d3557">Magistrates' Court</text>
 <text x="195" y="307" text-anchor="middle" font-size="17" fill="#5b6675">up to $100,000</text>
 <path d="M392,95 L405,95 L405,235 L392,235" fill="none" stroke="#1f7a8c" stroke-width="3"/>
 <text x="415" y="150" font-size="20" font-weight="700" fill="#1b2430">Jury of 6</text>
 <text x="415" y="175" font-size="17" fill="#5b6675">if a party asks</text>
 <text x="415" y="197" font-size="17" fill="#5b6675">and pays</text>
 <text x="415" y="280" font-size="20" font-weight="700" fill="#1b2430">No jury</text>
 <text x="415" y="304" font-size="17" fill="#5b6675">arbitration &lt; $10,000</text>
</svg>`;

const SVG_FAIR_EQUAL = `
<svg class="diagram" viewBox="0 0 400 470" role="img" aria-label="Fairness looks at the process; equality compares people">
 <rect x="6" y="6" width="388" height="220" rx="14" fill="#e8eef6" stroke="#1d3557" stroke-width="3"/>
 <text x="200" y="40" text-anchor="middle" font-size="24" font-weight="700" fill="#1d3557">FAIRNESS</text>
 <text x="200" y="64" text-anchor="middle" font-size="17" fill="#5b6675">looks at the PROCESS</text>
 <text x="30" y="104" font-size="19" fill="#1b2430">✔ Can people <tspan font-weight="700">take part</tspan>?</text>
 <text x="30" y="148" font-size="19" fill="#1b2430">✔ Is the decider <tspan font-weight="700">unbiased</tspan>?</text>
 <text x="30" y="192" font-size="19" fill="#1b2430">✔ Is it <tspan font-weight="700">open</tspan> to view?</text>
 <rect x="6" y="240" width="388" height="224" rx="14" fill="#fff4c2" stroke="#b08900" stroke-width="3"/>
 <text x="200" y="274" text-anchor="middle" font-size="24" font-weight="700" fill="#1d3557">EQUALITY</text>
 <text x="200" y="298" text-anchor="middle" font-size="17" fill="#5b6675">COMPARES PEOPLE</text>
 <circle cx="150" cy="330" r="16" fill="#1f7a8c"/><text x="200" y="338" text-anchor="middle" font-size="26" font-weight="700" fill="#1b2430">=</text><circle cx="250" cy="330" r="16" fill="#1f7a8c"/>
 <text x="30" y="380" font-size="19" fill="#1b2430">① <tspan font-weight="700">Same treatment</tspan> for all</text>
 <text x="30" y="418" font-size="19" fill="#1b2430">② If same = disadvantage,</text>
 <text x="56" y="446" font-size="19" fill="#1b2430"><tspan font-weight="700">extra help</tspan> (adequate measures)</text>
</svg>`;

window.LESSONS = [

/* ============================================================ 1 */
{ id:'U3A1-01', area:'Unit 3 AOS 1 · Criminal justice system', title:'The principles of justice',
  kk:'The principles of justice: fairness, equality and access',
  pretrain:[
    {term:'Fairness', def:'Asks about the <span class="key">PROCESS</span>: can people <span class="key">take part</span>, is the decision-maker <span class="key">unbiased</span>, and is it done <span class="key">in the open</span>?'},
    {term:'Equality', def:'Asks about how <span class="key">PEOPLE are treated compared with each other</span>: does everyone get the <span class="key">same treatment</span> — and if the same treatment would leave someone behind, do they get <span class="key">extra help</span>?'},
    {term:'Access', def:'Asks whether people can <span class="key">know about and use</span> the justice system — engaging with it on an <span class="key">informed basis</span>.'}
  ],
  teach:[
    {type:'rule', title:'Three principles, three questions', html:`
      <p>Each principle asks <b>one question</b>. Learn the question first; the official parts come after.</p>
      <table class="mini"><tr><th>Principle</th><th>The question it asks</th><th>Official parts</th></tr>
      <tr><td><b>Fairness</b></td><td>Is the <b>process</b> fair?</td><td>① participation ② impartiality ③ openness</td></tr>
      <tr><td><b>Equality</b></td><td>Are <b>people</b> treated alike — with extra help where alike isn't enough?</td><td>① same treatment ② adequate measures where same treatment causes disadvantage</td></tr>
      <tr><td><b>Access</b></td><td>Can people <b>know about and use</b> the system?</td><td>engaging on an informed basis</td></tr></table>`},
    {type:'rule', title:'A picture to hold onto: a football match', html:`
      <table class="mini"><tr><th>Principle</th><th>In a football match…</th></tr>
      <tr><td><b>Fairness</b></td><td>Both teams get to <b>play</b>. The <b>umpire</b> doesn't barrack for either side. The game is played where the <b>crowd can watch</b>.</td></tr>
      <tr><td><b>Equality</b></td><td>Both teams play by the <b>same rules</b>. A player who uses a wheelchair gets a <b>ramp</b> onto the ground — otherwise "same rules" would shut them out.</td></tr>
      <tr><td><b>Access</b></td><td>People <b>know the game is on</b>, understand the rules, and can <b>get to the ground</b>.</td></tr></table>
      <p>Notice: fairness is about <b>how the game is run</b>. Equality is about <b>how the players are treated compared with each other</b>.</p>`},
    {type:'diagram', title:'Process or people?', svg:SVG_FAIR_EQUAL, caption:'Fairness looks at the hearing itself. Equality compares one person with another.'},
    {type:'contrast', title:'Fairness — about the process',
      rule:'Ask: is this about <b>taking part</b>, an <b>unbiased decision-maker</b>, or the process being <b>public</b>? If so, it is fairness.',
      examples:[
        {text:'The accused can call witnesses and cross-examine the prosecution\'s witnesses.', why:'Taking part → participation.'},
        {text:'A judge who personally knows the victim withdraws from the case.', why:'Unbiased decision-maker → impartiality.'},
        {text:'Trials are generally open to the public and the media.', why:'Public → openness.'}],
      nonexamples:[
        {text:'The same rules of evidence apply to every accused.', why:'This compares people → equality.'},
        {text:'A free phone line explains how to plead in the Magistrates\' Court.', why:'This helps people know about the system → access.'}]},
    {type:'contrast', title:'Equality — about comparing people',
      rule:'Equality has <b>two</b> parts. Ask: are people treated <b>the same</b>? And if the same treatment would leave someone at a <b>disadvantage</b>, is something <b>extra</b> provided?',
      examples:[
        {text:'The same rules of evidence apply whether the accused is wealthy or poor.', why:'Same treatment — part ①.'},
        {text:'A Deaf witness is given an Auslan interpreter.', why:'Without it, "same treatment" would shut her out — an adequate measure, part ②.'}],
      nonexamples:[
        {text:'Treating everyone identically even though it shuts some people out.', why:'That fails part ②. Equality is not just "identical".'},
        {text:'Court hearings are open to the media.', why:'That is about the process being public → fairness.'}]},
    {type:'pairs', title:'Fairness or equality? Spot the difference',
      rule:'Each row is about the same topic. The left one is fairness; the right one is equality. The test: <b>is it about how the process runs, or about how people are treated compared with each other?</b>',
      rows:[
        {topic:'Questioning witnesses',
          fair:{text:'The accused is allowed to question the prosecution\'s witnesses.', why:'The accused takes part → participation.'},
          equal:{text:'Every accused, rich or poor, follows the same rules when questioning witnesses.', why:'Comparing people → same treatment.'}},
        {topic:'The magistrate',
          fair:{text:'A magistrate who is related to the accused steps aside.', why:'Unbiased decision-maker → impartiality.'},
          equal:{text:'Magistrates apply the same sentencing principles to every offender, whatever their background.', why:'Comparing people → same treatment.'}},
        {topic:'An open hearing',
          fair:{text:'The hearing is held in open court.', why:'The process is public → openness.'},
          equal:{text:'An accused with a hearing impairment is given a hearing loop so she can follow the hearing.', why:'Extra help so she isn\'t disadvantaged → adequate measures.'}}]},
    {type:'rule', title:'When a feature fits both', html:`
      <p>Some features genuinely support more than one principle. An interpreter, for example, removes a disadvantage (<b>equality</b>) <i>and</i> lets the person take part (<b>fairness</b>).</p>
      <p><b>In this app:</b> if a feature gives a particular person <b>something extra</b> to overcome a disadvantage, the best answer is <b>equality</b>.</p>
      <p><b>In the exam:</b> the question usually names the principle. Your job is to link the feature to that principle's <b>specific part</b> — e.g. "the interpreter allows Mia to <i>participate</i>, upholding fairness".</p>`},
    {type:'contrast', title:'Access — about knowing and using the system',
      rule:'Ask: does this help people <b>know about and use</b> the system?',
      examples:[
        {text:'Victoria Legal Aid publishes plain-English guides on going to court.'},
        {text:'A community legal centre gives free advice to a victim of crime.'}],
      nonexamples:[
        {text:'A magistrate has no connection to either party.', why:'Unbiased decision-maker → fairness.'},
        {text:'Every accused must follow the same court procedures.', why:'Same treatment → equality.'}]},
    {type:'rule', title:'Exam trap', html:`
      <p>There are exactly <b>three</b> principles of justice in VCE Legal Studies. <span class="key">Efficiency</span>, <span class="key">timeliness</span> and <span class="key">cost</span> are <b>not</b> principles — they are factors that can <i>affect</i> the principles (e.g. long delays can reduce access).</p>`}
  ],
  worked:[
    {title:'Equality — step by step', prompt:'Mia is Deaf and is a witness in a County Court trial. The court provides an Auslan interpreter. Which principle of justice is most directly upheld?',
     steps:[
      'Process or people? One person receives something extra that others don\'t — that compares people.',
      'Ask the equality test: would <i>identical</i> treatment disadvantage Mia? Yes — without an interpreter she could not engage with the trial.',
      'Match to a part: equality includes <b>adequate measures</b> where same treatment creates disadvantage.',
      'Write the link: the interpreter removes the disadvantage so Mia engages on an equal footing.'],
     answer:'<b>Equality</b> — an adequate measure is provided because same treatment would disadvantage Mia.'},
    {title:'Fairness — step by step', prompt:'A County Court judge realises she once acted as the accused\'s lawyer, so she hands the trial to another judge. Which principle of justice is most directly upheld?',
     steps:[
      'Process or people? This is about who makes the decision — how the process runs. Nobody is being compared with anyone else.',
      'Which part of fairness? Participation, impartiality or openness? It is about the decision-maker having no bias.',
      'Match to a part: <b>impartiality</b>.',
      'Write the link: replacing the judge means the decision is made by someone with no connection to the accused.'],
     answer:'<b>Fairness</b> — specifically impartiality.'}
  ],
  faded:[
    {title:'Your turn', prompt:'At his trial, Kai\'s lawyer calls two witnesses and cross-examines the prosecution\'s main witness.',
     given:['Process or people? This is about how the trial runs — Kai is not being compared with anyone.','Which part? Kai is taking part in his own trial.'],
     item:{id:'U3A1-01-f2', type:'mc', q:'So which principle of justice is upheld?', options:['Fairness — participation','Equality — same treatment','Equality — adequate measures','Access — informed basis'], answer:0,
       explain:'Taking part in the process = participation, a part of fairness.', hint:'Is anyone being compared with anyone else?'}},
    {title:'Your turn', prompt:'Ana uses a wheelchair. The court moves her hearing to a ground-floor courtroom with ramp access.',
     given:['Process or people? Ana is given something extra that others don\'t need.'],
     item:{id:'U3A1-01-f3', type:'mc', q:'Would the same treatment as everyone else (an upstairs courtroom) disadvantage her — and so which principle is upheld?', options:['Yes — equality (adequate measures)','No — fairness (openness)','Yes — access (informed basis)','No — fairness (impartiality)'], answer:0,
       explain:'Same treatment would shut her out, so an adequate measure is provided → equality.', hint:'Something extra to overcome a disadvantage…'}}
  ],
  practice:[
    {id:'U3A1-01-p1', type:'mc', q:'Which principle requires that the justice system\'s processes be <b>impartial and open</b>?', options:['Fairness','Equality','Access','Efficiency'], answer:0, explain:'Fairness = participation, impartiality, openness.', hint:'Think: no bias, and in public.'},
    {id:'U3A1-01-p8', type:'mc', q:'Fairness is mainly about the ______; equality is mainly about how ______ are treated compared with each other.', options:['process; people','people; process','money; lawyers','courts; judges'], answer:0, explain:'Fairness → process. Equality → people compared.', hint:'Process or people?'},
    {id:'U3A1-01-p9', type:'mc', q:'Every accused, wealthy or poor, faces the same rules of evidence. Fairness or equality?', options:['Equality','Fairness'], answer:0, explain:'It compares people → same treatment → equality.'},
    {id:'U3A1-01-p10', type:'mc', q:'A trial is held in open court, where the public and media can attend. Fairness or equality?', options:['Fairness','Equality'], answer:0, explain:'How the process runs → openness → fairness.'},
    {id:'U3A1-01-p11', type:'mc', q:'An accused who doesn\'t speak English is given a free interpreter. Fairness or equality? (Use this app\'s tie-break rule.)', options:['Equality','Fairness'], answer:0, explain:'Something extra for one person to overcome a disadvantage → equality (adequate measures). It also helps participation, but equality is the best answer.'},
    {id:'U3A1-01-p2', type:'mc', q:'A free online guide explains to accused people what happens at their first court date. Which principle does this most directly support?', options:['Access','Fairness','Equality','Impartiality'], answer:0, explain:'It helps people engage on an informed basis → access.'},
    {id:'U3A1-01-p3', type:'mc', q:'A courtroom has a hearing loop and wheelchair ramp so that a witness with a disability can give evidence without disadvantage. Which principle?', options:['Equality','Fairness','Access','Openness'], answer:0, explain:'Same treatment would disadvantage the witness, so an adequate measure is provided → equality.'},
    {id:'U3A1-01-p4', type:'text', q:'Name the principle of justice: all people can engage with the justice system on an <b>informed basis</b>.', accept:['access'], explain:'Access = engaging on an informed basis.'},
    {id:'U3A1-01-p5', type:'tf', q:'Under the VCE definition, equality always means treating everyone in exactly the same way.', answer:false, explain:'False. Equality also requires adequate measures where same treatment creates disadvantage.'},
    {id:'U3A1-01-p6', type:'mc', q:'Which of these is <b>not</b> one of the three principles of justice in VCE Legal Studies?', options:['Efficiency','Fairness','Equality','Access'], answer:0, explain:'Efficiency is not a principle of justice. It can affect the principles, but it is not one.'},
    {id:'U3A1-01-p7', type:'mc', q:'The accused is allowed to give evidence and question the prosecution\'s witnesses. Which part of which principle?', options:['Participation — fairness','Same treatment — equality','Being informed — access','Openness — fairness'], answer:0, explain:'Taking part in the process = participation, a part of fairness.'},
    {id:'U3A1-01-p12', type:'tf', q:'"Participation" is a part of equality.', answer:false, explain:'False. Participation is a part of fairness. Equality\'s parts are same treatment and adequate measures.'}
  ],
  check:[
    {id:'U3A1-01-c1', type:'mc', q:'A magistrate discovers she is related to the accused and withdraws from the case. Which principle is upheld?', options:['Fairness','Equality','Access','None of these'], answer:0, explain:'Avoiding bias = impartiality → fairness.'},
    {id:'U3A1-01-c2', type:'mc', q:'The same rules of evidence apply to every accused regardless of their wealth. Which principle?', options:['Equality','Fairness','Access','Openness'], answer:0, explain:'Same treatment → equality.'},
    {id:'U3A1-01-c3', type:'text', q:'Which principle\'s definition includes <b>adequate measures</b> where the same treatment creates disadvantage?', accept:['equality'], explain:'Equality.'},
    {id:'U3A1-01-c4', type:'mc', q:'A community legal centre explains to a victim of crime what her rights are in the upcoming trial. Which principle?', options:['Access','Fairness','Equality','Impartiality'], answer:0, explain:'Being informed about rights and processes → access.'},
    {id:'U3A1-01-c5', type:'mc', q:'Which list contains <b>only</b> parts of fairness?', options:['Participation, impartiality, openness','Participation, equality, access','Openness, efficiency, impartiality','Same treatment, adequate measures, openness'], answer:0, explain:'Fairness = participation, impartiality, openness.'},
    {id:'U3A1-01-c6', type:'mc', q:'Which feature is best described as upholding <b>equality</b> rather than fairness?', options:['A witness with a vision impairment is given documents in large print','The accused cross-examines a witness','The judge has no link to either party','The trial is reported in the media'], answer:0, explain:'Extra help so one person isn\'t disadvantaged → adequate measures → equality. The others are about the process → fairness.'}
  ]
},

/* ============================================================ 2 */
{ id:'U3A1-02', area:'Unit 3 AOS 1 · Criminal justice system', title:'Summary and indictable offences',
  kk:'The distinction between summary offences and indictable offences',
  pretrain:[
    {term:'Summary offence', def:'A <span class="key">less serious</span> offence, heard in the <span class="key">Magistrates\' Court</span> by a magistrate (no jury).'},
    {term:'Indictable offence', def:'A <span class="key">more serious</span> offence, heard in the <span class="key">County Court</span> or <span class="key">Supreme Court</span>.'},
    {term:'Indictable offence heard summarily', def:'An indictable offence that is heard in the <span class="key">Magistrates\' Court</span> as if it were a summary offence.'},
    {term:'Plead', def:'The accused\'s formal answer to the charge: guilty or not guilty.'}
  ],
  teach:[
    {type:'rule', title:'The rule', html:`
      <p>Offences are classified by <b>seriousness</b>, and seriousness decides <b>which court</b> hears the case.</p>
      <table class="mini"><tr><th></th><th>Summary</th><th>Indictable</th></tr>
      <tr><td>Seriousness</td><td>Less serious</td><td>More serious</td></tr>
      <tr><td>Court</td><td>Magistrates' Court</td><td>County or Supreme Court</td></tr>
      <tr><td>Decided by</td><td>Magistrate</td><td>Judge and jury (if accused pleads not guilty)</td></tr>
      <tr><td>Examples</td><td>Careless driving; offensive behaviour</td><td>Murder; armed robbery; trafficking a commercial quantity of drugs</td></tr></table>`},
    {type:'diagram', title:'Where criminal cases go', svg:SVG_COURTS, caption:'Seriousness rises as you go up. Appeals also go up the hierarchy.'},
    {type:'rule', title:'Indictable offences heard summarily', html:`
      <p>Some indictable offences can be heard in the Magistrates' Court. <b>Two conditions</b> must both be met:</p>
      <p>① the court considers it <span class="key">appropriate</span>, and ② the <span class="key">accused consents</span>.</p>
      <p>Why it matters: it is quicker and cheaper — but there is <b>no jury</b>, and the magistrate's sentencing powers are limited.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'A juror charged with contempt of court (an indictable offence) has his case heard in the Magistrates\' Court.', why:'Indictable offence heard summarily. (Based on the 2024 exam scenario.)'},
        {text:'A person charged with murder is tried in the Supreme Court.', why:'Most serious indictable offence → Supreme Court.'}],
      nonexamples:[
        {text:'"All indictable offences are decided by a jury."', why:'Wrong. If the accused pleads guilty there is no trial — the judge proceeds to sentencing. And indictable offences heard summarily have no jury.'},
        {text:'"Summary offences are heard in the County Court."', why:'Wrong. Summary offences are heard in the Magistrates\' Court.'}]}
  ],
  worked:[
    {title:'Classifying an offence', prompt:'Sam is charged with armed robbery and pleads not guilty. What type of offence is this, and where will it be heard?',
     steps:['Judge seriousness: armed robbery involves violence or threat with a weapon — serious.',
      'Serious → indictable offence.',
      'Most indictable offences go to the County Court (the Supreme Court takes the most serious, like murder).',
      'Sam pleads not guilty → a trial before a judge and jury.'],
     answer:'<b>Indictable</b> offence, heard in the <b>County Court</b> before a judge and jury.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Emma is charged with trafficking a commercial quantity of drugs. She pleads not guilty and is tried in the County Court. (Based on the 2025 exam scenario.)',
     given:['Judge seriousness: a commercial quantity of drugs — serious.','It was heard in the County Court before a jury.'],
     item:{id:'U3A1-02-f1', type:'text', q:'So what type of offence is it? (one word)', accept:['indictable','indictable offence'], explain:'Serious + County Court → indictable.', hint:'Summary or …?'}}
  ],
  practice:[
    {id:'U3A1-02-p1', type:'text', q:'What type of offence is murder?', accept:['indictable','indictable offence'], explain:'Murder is the most serious kind of indictable offence.'},
    {id:'U3A1-02-p2', type:'mc', q:'Which court hears summary offences?', options:['Magistrates\' Court','County Court','Supreme Court','High Court'], answer:0, explain:'Summary offences → Magistrates\' Court.'},
    {id:'U3A1-02-p3', type:'mc', q:'Which of these is most likely a <b>summary</b> offence?', options:['Careless driving','Murder','Armed robbery','Trafficking a commercial quantity of drugs'], answer:0, explain:'Careless driving is less serious → summary.'},
    {id:'U3A1-02-p4', type:'tf', q:'Summary offences are heard before a judge and jury.', answer:false, explain:'False. A magistrate hears summary offences; there is no jury in the Magistrates\' Court.'},
    {id:'U3A1-02-p5', type:'mc', q:'For an indictable offence to be heard summarily, which <b>two</b> conditions must be met?', options:['The court considers it appropriate and the accused consents','The victim consents and the police agree','The accused pleads guilty and the judge agrees','The prosecution requests it and the jury agrees'], answer:0, hint:'One condition is about the court; one is about the accused.', explain:'Court considers it appropriate + accused consents.'},
    {id:'U3A1-02-p6', type:'text', q:'Which Victorian court hears murder trials?', accept:['Supreme Court','supreme','supreme court of victoria','supreme court trial division','trial division of the supreme court'], explain:'Murder → Supreme Court (Trial Division).'},
    {id:'U3A1-02-p7', type:'tf', q:'If an accused pleads guilty to an indictable offence, there is no jury trial.', answer:true, explain:'True. With a guilty plea there is nothing for a jury to decide; the judge moves to sentencing.'}
  ],
  check:[
    {id:'U3A1-02-c1', type:'mc', q:'Luke is charged with an indictable offence, but his case is heard in the Magistrates\' Court. This is called:', options:['An indictable offence heard summarily','A summary offence','A committal hearing','An appeal'], answer:0, src:'2024 Sec B Q1', explain:'An indictable offence heard in the Magistrates\' Court = heard summarily.'},
    {id:'U3A1-02-c2', type:'tf', q:'Every person charged with an indictable offence is tried by a jury.', answer:false, explain:'False — not if they plead guilty, and not if the offence is heard summarily.'},
    {id:'U3A1-02-c3', type:'text', q:'Which court hears most summary offences?', accept:['Magistrates\' Court','magistrates court','magistrates','magistrate court','magistrates\''], explain:'Magistrates\' Court.'},
    {id:'U3A1-02-c4', type:'mc', q:'Which statement is accurate?', options:['Indictable offences are more serious and are heard in the County or Supreme Court','Indictable offences are less serious and are heard in the Magistrates\' Court','Summary offences are always heard by a jury','Summary offences are heard in the Supreme Court'], answer:0, explain:'Indictable = more serious → County/Supreme Court.'},
    {id:'U3A1-02-c5', type:'mc', q:'Which is an <b>indictable</b> offence?', options:['Culpable driving causing death','Careless driving','Offensive behaviour in public','A minor parking breach'], answer:0, explain:'Culpable driving causing death is serious → indictable.'}
  ]
},

/* ============================================================ 3 */
{ id:'U3A1-03', area:'Unit 3 AOS 1 · Criminal justice system', title:'The burden of proof',
  kk:'Key principles: the burden of proof',
  pretrain:[
    {term:'Burden of proof', def:'The <span class="key">responsibility of proving</span> the facts of a case — <i>who</i> has to prove it.'},
    {term:'Prosecution', def:'The party that brings a <span class="key">criminal</span> case, on behalf of the state.'},
    {term:'Accused', def:'The person charged with a crime.'},
    {term:'Plaintiff', def:'The party that brings a <span class="key">civil</span> case (the one suing).'},
    {term:'Defendant', def:'The party being sued in a civil case.'}
  ],
  teach:[
    {type:'rule', title:'The rule', html:`
      <p>The burden of proof lies with <b>the party who brings the case</b>.</p>
      <table class="mini"><tr><th>Type of case</th><th>Who brings it</th><th>Who has the burden</th></tr>
      <tr><td>Criminal</td><td>Prosecution</td><td><b>Prosecution</b></td></tr>
      <tr><td>Civil</td><td>Plaintiff</td><td><b>Plaintiff</b></td></tr></table>
      <p>The accused does <b>not</b> have to prove they are innocent. The defendant does <b>not</b> have to prove they are not liable.</p>`},
    {type:'contrast', title:'Burden vs standard — don\'t mix them up',
      rule:'<b>Burden</b> = <i>who</i> must prove. <b>Standard</b> = <i>how much</i> they must prove (next lesson).',
      examples:[
        {text:'"In Grant\'s criminal case, the prosecution has the burden of proof."', why:'Correct: names the party.'},
        {text:'"In Louise\'s case, her clients (the plaintiffs) have the burden of proof."', why:'Correct: names the party. (2024 exam scenario.)'}],
      nonexamples:[
        {text:'"The burden of proof is beyond reasonable doubt."', why:'That is the standard, not the burden.'},
        {text:'"The accused must prove they did not commit the crime."', why:'Wrong — the burden is on the prosecution.'},
        {text:'"Both parties share the burden of proof equally."', why:'Wrong — it rests with the party who brings the case.'}]},
    {type:'rule', title:'Later note (not for now)', html:`<p class="muted">There are rare exceptions where the accused must prove something — e.g. an accused who raises the defence of mental impairment must prove it. Learn the main rule first; this exception won't be tested in your check.</p>`}
  ],
  worked:[
    {title:'Identifying the burden', prompt:'Louise\'s 22 clients sue her in the County Court to recover money they lost. Who has the burden of proof? (2024 exam scenario)',
     steps:['Is it criminal or civil? Clients suing for compensation → civil.','Who brings a civil case? The plaintiffs — the clients.','Rule: the party who brings the case has the burden.'],
     answer:'The <b>clients (plaintiffs)</b> have the burden of proof.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Grant is charged with aggravated assault. (2025 exam scenario)',
     given:['Is it criminal or civil? Charged with an offence → criminal.','Who brings a criminal case? The prosecution.'],
     item:{id:'U3A1-03-f1', type:'text', q:'So who has the burden of proof?', accept:['prosecution','the prosecution','prosecutor','the prosecutor','the crown','crown'], explain:'The party who brings the case — the prosecution.', hint:'Rule: the party who brings the case.'}}
  ],
  practice:[
    {id:'U3A1-03-p1', type:'text', q:'Which party has the burden of proof in a <b>criminal</b> case?', accept:['prosecution','the prosecution','prosecutor','the crown'], explain:'Prosecution.'},
    {id:'U3A1-03-p2', type:'text', q:'Which party has the burden of proof in a <b>civil</b> case?', accept:['plaintiff','the plaintiff','plaintiffs'], explain:'Plaintiff.'},
    {id:'U3A1-03-p3', type:'mc', q:'What is the burden of proof?', options:['The responsibility of proving the facts of a case','The degree to which the facts must be proven','The right of the accused to remain silent','The judge\'s duty to decide the case'], answer:0, explain:'Burden = who has the responsibility of proving. The degree is the standard.'},
    {id:'U3A1-03-p4', type:'tf', q:'In a criminal trial, the accused must prove they are innocent.', answer:false, explain:'False. The prosecution must prove guilt.'},
    {id:'U3A1-03-p5', type:'mc', q:'"The burden of proof is on the balance of probabilities." What is wrong with this sentence?', options:['It describes the standard, not the burden','Nothing — it is correct','It should say "beyond reasonable doubt"','The burden only applies in criminal cases'], answer:0, explain:'Balance of probabilities is a standard of proof. The burden names a party.'},
    {id:'U3A1-03-p6', type:'mc', q:'Andy sues Grant for compensation for pain and suffering. Who has the burden of proof?', options:['Andy','Grant','The prosecution','The judge'], answer:0, src:'2025 Sec A Q2', explain:'Andy brings the civil case → plaintiff → burden.'}
  ],
  check:[
    {id:'U3A1-03-c1', type:'mc', q:'In a civil claim for negligence, who must prove the claim?', options:['The plaintiff','The defendant','The prosecution','Both parties equally'], answer:0, explain:'The party who brings the case — the plaintiff.'},
    {id:'U3A1-03-c2', type:'mc', q:'Which sentence correctly uses the term "burden of proof"?', options:['The burden of proof rests with the prosecution.','The burden of proof is beyond reasonable doubt.','The burden of proof is shared by both parties.','The burden of proof means the accused must explain their actions.'], answer:0, explain:'The burden names a party.'},
    {id:'U3A1-03-c3', type:'text', q:'In a criminal case, which party carries the burden of proof?', accept:['prosecution','the prosecution','prosecutor','the crown'], explain:'Prosecution.'},
    {id:'U3A1-03-c4', type:'tf', q:'The defendant in a civil case must prove they are not liable.', answer:false, explain:'False. The plaintiff must prove the claim.'},
    {id:'U3A1-03-c5', type:'mc', q:'The difference between "burden" and "standard" of proof is:', options:['Burden = who must prove; standard = to what degree','Burden = to what degree; standard = who must prove','They mean the same thing','Burden applies to civil cases; standard to criminal'], answer:0, explain:'Burden = who. Standard = how much.'}
  ]
},

/* ============================================================ 4 */
{ id:'U3A1-04', area:'Unit 3 AOS 1 · Criminal justice system', title:'The standard of proof',
  kk:'Key principles: the standard of proof',
  pretrain:[
    {term:'Standard of proof', def:'The <span class="key">degree</span> or extent to which a case must be proven.'},
    {term:'Beyond reasonable doubt', def:'The <span class="key">criminal</span> standard: there is no reasonable doubt that the accused is guilty.'},
    {term:'On the balance of probabilities', def:'The <span class="key">civil</span> standard: the plaintiff\'s case is <span class="key">more probable than not</span>.'}
  ],
  teach:[
    {type:'diagram', title:'Two standards, two thresholds', svg:SVG_STANDARD, caption:'Illustration only — the standards are not percentages.'},
    {type:'rule', title:'Why is the criminal standard higher?', html:`
      <p>① A criminal conviction can take away a person's <b>liberty</b> (imprisonment) and brands them a criminal.</p>
      <p>② The prosecution has the resources of the <b>state</b>; the accused is an individual.</p>
      <p>③ The high standard supports the <b>presumption of innocence</b>.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'In Grant\'s criminal trial, the prosecution must prove guilt beyond reasonable doubt.'},
        {text:'In Andy\'s civil claim against Grant, Andy must prove his case on the balance of probabilities.', why:'Same facts, different case, different standard. (2025 exam scenario.)'}],
      nonexamples:[
        {text:'"Beyond all doubt."', why:'Wrong wording. The standard is beyond <b>reasonable</b> doubt — fanciful doubts don\'t count.'},
        {text:'"The plaintiff must prove the case beyond reasonable doubt."', why:'Wrong standard for a civil case.'},
        {text:'"Balance of probabilities means the plaintiff must be certain."', why:'No — more probable than not is enough.'}]}
  ],
  worked:[
    {title:'Same facts, two cases', prompt:'Grant stabbed Andy. Grant faces a criminal trial, and Andy is also suing Grant. What standard applies in each? (2025 exam scenario)',
     steps:['Separate the two cases: one criminal (prosecution v Grant), one civil (Andy v Grant).','Criminal → beyond reasonable doubt.','Civil → on the balance of probabilities.','So it is possible for Grant to be found not guilty but still liable — the civil standard is lower.'],
     answer:'Criminal: <b>beyond reasonable doubt</b>. Civil: <b>on the balance of probabilities</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Agu and Kim are considering suing Emma for the cost of rebuilding their property. (2025 exam scenario)',
     given:['Criminal or civil? Suing for compensation → civil.'],
     item:{id:'U3A1-04-f1', type:'text', q:'So what is the standard of proof?', accept:['balance of probabilities','on the balance of probabilities','the balance of probabilities'], explain:'Civil → on the balance of probabilities.', hint:'Civil standard: more probable than not.'}}
  ],
  practice:[
    {id:'U3A1-04-p1', type:'text', q:'What is the standard of proof in a <b>criminal</b> case?', accept:['beyond reasonable doubt','beyond a reasonable doubt'], explain:'Beyond reasonable doubt.'},
    {id:'U3A1-04-p2', type:'text', q:'What is the standard of proof in a <b>civil</b> case?', accept:['balance of probabilities','on the balance of probabilities','the balance of probabilities'], explain:'On the balance of probabilities.'},
    {id:'U3A1-04-p3', type:'mc', q:'What does "on the balance of probabilities" mean?', options:['More probable than not','Beyond all doubt','Certain','Beyond reasonable doubt'], answer:0, explain:'The plaintiff\'s version is more probable than not.'},
    {id:'U3A1-04-p4', type:'mc', q:'Which is the best reason the criminal standard is higher than the civil standard?', options:['A conviction can result in loss of liberty','Criminal cases are heard in higher courts','Juries are less intelligent than judges','Civil cases are less important'], answer:0, explain:'The consequences (e.g. imprisonment) are more serious.'},
    {id:'U3A1-04-p5', type:'tf', q:'An accused can be found not guilty in a criminal trial but still be found liable in a civil case about the same events.', answer:true, explain:'True — the civil standard is lower.'},
    {id:'U3A1-04-p6', type:'mc', q:'"The prosecution must prove guilt beyond all doubt." What is wrong?', options:['The standard is beyond <i>reasonable</i> doubt','Nothing','It should be the balance of probabilities','The accused must prove innocence'], answer:0, explain:'Only reasonable doubts matter.'}
  ],
  check:[
    {id:'U3A1-04-c1', type:'mc', q:'Louise\'s clients sue her in the County Court. What standard of proof applies?', options:['On the balance of probabilities','Beyond reasonable doubt','Beyond all doubt','On the burden of proof'], answer:0, src:'2024 Sec A Q1a', explain:'Civil → balance of probabilities.'},
    {id:'U3A1-04-c2', type:'text', q:'Standard of proof in a criminal case?', accept:['beyond reasonable doubt','beyond a reasonable doubt'], explain:'Beyond reasonable doubt.'},
    {id:'U3A1-04-c3', type:'mc', q:'What is the standard of proof?', options:['The degree to which a case must be proven','The party responsible for proving a case','The type of court that hears the case','The maximum penalty for an offence'], answer:0, explain:'Standard = degree. Burden = party.'},
    {id:'U3A1-04-c4', type:'tf', q:'A plaintiff must prove their case beyond reasonable doubt.', answer:false, explain:'False — balance of probabilities.'},
    {id:'U3A1-04-c5', type:'mc', q:'Which pairing is correct?', options:['Criminal — beyond reasonable doubt; civil — balance of probabilities','Criminal — balance of probabilities; civil — beyond reasonable doubt','Both — beyond reasonable doubt','Both — balance of probabilities'], answer:0, explain:'Criminal BRD, civil BoP.'}
  ]
},

/* ============================================================ 5 */
{ id:'U3A1-05', area:'Unit 3 AOS 1 · Criminal justice system', title:'The presumption of innocence',
  kk:'Key principles: the presumption of innocence',
  pretrain:[
    {term:'Presumption of innocence', def:'A person accused of a crime is <span class="key">presumed innocent until proven guilty</span> beyond reasonable doubt.'},
    {term:'Charter of Human Rights and Responsibilities', def:'A Victorian Act (2006) that protects certain rights, including the presumption of innocence.'},
    {term:'Remand', def:'Being held in custody while waiting for trial (bail refused).'}
  ],
  teach:[
    {type:'rule', title:'The rule', html:`
      <p>The accused is treated as innocent <b>until</b> the prosecution proves guilt <b>beyond reasonable doubt</b>. It is protected in Victoria by the <i>Charter of Human Rights and Responsibilities</i>.</p>
      <p>It is a rule about how the <b>process</b> treats the accused — it is not a finding that they are innocent.</p>`},
    {type:'contrast', title:'What upholds it — and what it does NOT mean',
      rule:'Several features of the criminal justice system work together to uphold the presumption:',
      examples:[
        {text:'The <b>burden</b> of proof is on the prosecution.', why:'The accused doesn\'t have to prove anything.'},
        {text:'The <b>standard</b> is beyond reasonable doubt.', why:'A high bar before the presumption is displaced.'},
        {text:'The <b>right to silence</b>.', why:'The accused can make the prosecution prove its case without their help.'},
        {text:'The jury is generally not told about the accused\'s prior convictions.', why:'So guilt isn\'t assumed from past behaviour.'}],
      nonexamples:[
        {text:'"The presumption of innocence means the accused is innocent."', why:'No — it means they are treated as innocent until proven guilty.'},
        {text:'"The presumption of innocence means an accused can never be held in custody before trial."', why:'No — bail can be refused and the accused remanded.'},
        {text:'"The presumption of innocence applies to the defendant in a civil case."', why:'No — it is a criminal justice principle.'}]}
  ],
  worked:[
    {title:'Linking a right to the presumption', prompt:'Emma chose to exercise her right to silence. How does this uphold the presumption of innocence? (2025 exam scenario)',
     steps:['State the presumption: Emma is presumed innocent until proven guilty beyond reasonable doubt.','State what the right does: Emma doesn\'t have to answer police questions or give evidence, and her silence can\'t be used to suggest guilt.','Link them: the burden stays on the prosecution — Emma isn\'t forced to help prove her own guilt.'],
     answer:'The right to silence keeps the burden on the prosecution, so Emma is <b>treated as innocent</b> unless the prosecution proves guilt beyond reasonable doubt without her help.'}
  ],
  faded:[
    {title:'Your turn', prompt:'At Jack\'s trial, the judge does not allow the jury to hear about his previous convictions.',
     given:['State the presumption: Jack is presumed innocent until proven guilty.','What does this rule do? Stops the jury reasoning "he did it before, so he did it again".'],
     item:{id:'U3A1-05-f1', type:'mc', q:'So how does this uphold the presumption of innocence?', options:['Guilt must be proven by evidence of this offence, not assumed from his past','It means Jack is innocent','It shifts the burden of proof to Jack','It lowers the standard of proof'], answer:0, explain:'The jury must decide based on evidence of this offence, so innocence is presumed until proven otherwise.', hint:'What would the jury be tempted to assume?'}}
  ],
  practice:[
    {id:'U3A1-05-p1', type:'mc', q:'What is the presumption of innocence?', options:['An accused is presumed innocent until proven guilty beyond reasonable doubt','An accused is innocent','An accused must prove their innocence','An accused cannot be arrested'], answer:0, explain:'Presumed innocent until proven guilty beyond reasonable doubt.'},
    {id:'U3A1-05-p2', type:'mc', q:'Which Victorian Act protects the presumption of innocence?', options:['Charter of Human Rights and Responsibilities Act 2006','Juries Act 2000','Victims\' Charter Act 2006','Australian Constitution'], answer:0, explain:'The Charter of Human Rights and Responsibilities.'},
    {id:'U3A1-05-p3', type:'tf', q:'Because of the presumption of innocence, an accused can never be held on remand.', answer:false, explain:'False — bail can be refused.'},
    {id:'U3A1-05-p4', type:'mc', q:'Which feature does <b>not</b> uphold the presumption of innocence?', options:['A victim impact statement','The burden of proof on the prosecution','The right to silence','The beyond reasonable doubt standard'], answer:0, explain:'Victim impact statements are used at sentencing — after guilt is established.'},
    {id:'U3A1-05-p5', type:'tf', q:'The presumption of innocence is a principle of the criminal justice system, not the civil justice system.', answer:true, explain:'True.'},
    {id:'U3A1-05-p6', type:'mc', q:'How does placing the burden of proof on the prosecution uphold the presumption of innocence?', options:['The accused does not have to prove anything; the state must prove guilt','The accused must explain their actions','The judge decides guilt without evidence','The jury must assume guilt'], answer:0, explain:'The accused is treated as innocent unless the prosecution proves otherwise.'}
  ],
  check:[
    {id:'U3A1-05-c1', type:'mc', q:'Which best describes the presumption of innocence?', options:['A person accused of a crime is treated as innocent until proven guilty beyond reasonable doubt','A person accused of a crime is innocent','A person must be released on bail','A person cannot be questioned by police'], answer:0, explain:'Treated as innocent until proven guilty BRD.'},
    {id:'U3A1-05-c2', type:'mc', q:'Which feature most directly upholds the presumption of innocence?', options:['The right to silence','Plea negotiations','Victim impact statements','Class actions'], answer:0, src:'2025 Sec B Q1a', explain:'The right to silence keeps the burden on the prosecution.'},
    {id:'U3A1-05-c3', type:'tf', q:'The presumption of innocence means the accused has been found innocent.', answer:false, explain:'False — it is a presumption about how they are treated.'},
    {id:'U3A1-05-c4', type:'text', q:'Complete: presumed innocent until proven guilty beyond ______ ______.', accept:['reasonable doubt'], explain:'Beyond reasonable doubt.'},
    {id:'U3A1-05-c5', type:'mc', q:'Why is the jury generally not told about the accused\'s prior convictions?', options:['So guilt is not assumed from past behaviour','Because prior convictions are secret','To save time','Because the accused has a right to a jury'], answer:0, explain:'Upholds the presumption of innocence.'}
  ]
},

/* ============================================================ 6 */
{ id:'U3A1-06', area:'Unit 3 AOS 1 · Criminal justice system', title:'Right to be tried without unreasonable delay',
  kk:'Rights of an accused: the right to be tried without unreasonable delay',
  pretrain:[
    {term:'Unreasonable delay', def:'A wait before trial that is <span class="key">longer than the circumstances justify</span>.'},
    {term:'Remand', def:'Being held in custody while waiting for trial.'}
  ],
  teach:[
    {type:'rule', title:'The rule', html:`
      <p>An accused has the right to be <b>tried without unreasonable delay</b>. It is protected by the <i>Charter of Human Rights and Responsibilities</i>.</p>
      <p>The key word is <span class="key">unreasonable</span>. Some delay is normal. Whether a delay is unreasonable depends on the circumstances — e.g. how complex the case is, how much evidence must be gathered, how many witnesses there are.</p>`},
    {type:'rule', title:'Why it matters', html:`
      <p>① An accused on <b>remand</b> may spend months in custody while still presumed innocent.</p>
      <p>② Delay causes <b>stress and uncertainty</b> for the accused (and for victims and witnesses).</p>
      <p>③ Evidence can <b>deteriorate</b> — witnesses' memories fade.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'A straightforward case with one accused and no complex evidence waits two years for a hearing.', why:'Likely unreasonable — nothing about the case justifies the wait.'},
        {text:'Plea negotiations resolve a case without a trial, freeing court time.', why:'Helps uphold the right.'}],
      nonexamples:[
        {text:'"Any delay at all breaches the right."', why:'No — only unreasonable delay.'},
        {text:'"A complex fraud trial with thousands of documents takes longer to prepare."', why:'Probably reasonable given the complexity.'},
        {text:'"The right sets a fixed deadline every trial must meet."', why:'No — it depends on the circumstances.'}]}
  ],
  worked:[
    {title:'Applying the right', prompt:'Luke\'s contempt of court case involves one accused and no complex evidence. Explain his right to be tried without unreasonable delay. (2024 exam scenario)',
     steps:['State the right: Luke has the right to be tried without unreasonable delay (Charter).','Explain "unreasonable": a delay must be justified by the circumstances.','Apply: Luke\'s case is simple — one accused, no complex evidence.','Conclude: a long delay would be hard to justify, so he is entitled to a relatively prompt hearing.'],
     answer:'Because Luke\'s case is <b>simple</b>, there is little to justify a long delay — he is entitled to have it heard relatively quickly.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Priya is accused of a large corporate fraud involving 40 witnesses and forensic accounting reports. Her trial starts 18 months after she is charged.',
     given:['State the right: Priya has the right to be tried without unreasonable delay.','Apply: the case is very complex — many witnesses and expert evidence.'],
     item:{id:'U3A1-06-f1', type:'mc', q:'So is the 18-month delay more likely reasonable or unreasonable?', options:['More likely reasonable, given the complexity','Unreasonable — any delay breaches the right','Unreasonable — trials must start within 6 months','Irrelevant — the right only applies to summary offences'], answer:0, explain:'Complexity can justify longer preparation time.', hint:'What does "unreasonable" depend on?'}}
  ],
  practice:[
    {id:'U3A1-06-p1', type:'mc', q:'Which Victorian Act protects the right to be tried without unreasonable delay?', options:['Charter of Human Rights and Responsibilities Act 2006','Juries Act 2000','Victims\' Charter Act 2006','Sentencing Act 1991'], answer:0, explain:'The Charter.'},
    {id:'U3A1-06-p2', type:'tf', q:'Any delay before a trial breaches the right to be tried without unreasonable delay.', answer:false, explain:'False — only unreasonable delay.'},
    {id:'U3A1-06-p3', type:'mc', q:'Which factor would most likely make a longer delay <b>reasonable</b>?', options:['The case involves complex forensic evidence and many witnesses','The accused is on remand','The case is straightforward','The victim wants a quick result'], answer:0, explain:'Complexity can justify delay.'},
    {id:'U3A1-06-p4', type:'mc', q:'Why is delay especially harmful for an accused on remand?', options:['They may spend a long time in custody while presumed innocent','They lose the right to silence','They must plead guilty','They lose the right to a jury'], answer:0, explain:'Custody while presumed innocent.'},
    {id:'U3A1-06-p5', type:'mc', q:'Which is a reason delay can harm the fairness of a trial?', options:['Witnesses\' memories fade','Juries become larger','The standard of proof changes','The burden of proof shifts'], answer:0, explain:'Evidence deteriorates over time.'},
    {id:'U3A1-06-p6', type:'text', q:'Complete the right: to be tried without ______ delay.', accept:['unreasonable'], explain:'Unreasonable.'}
  ],
  check:[
    {id:'U3A1-06-c1', type:'mc', q:'Whether a delay is "unreasonable" depends mainly on:', options:['The circumstances, such as the complexity of the case','A fixed time limit in the Constitution','The wishes of the victim','The accused\'s age'], answer:0, explain:'Circumstances, such as complexity.'},
    {id:'U3A1-06-c2', type:'mc', q:'Luke\'s case is simple, with one accused and no complex evidence. Which right is most relevant to him having it heard quickly?', options:['The right to be tried without unreasonable delay','The right to trial by jury','The right to give evidence using alternative arrangements','The right to be informed of the offender\'s release date'], answer:0, src:'2024 Sec B Q1a', explain:'Unreasonable delay. (Note: trial by jury is wrong — the Magistrates\' Court has no jury.)'},
    {id:'U3A1-06-c3', type:'tf', q:'A complex trial taking longer to prepare will automatically breach the right.', answer:false, explain:'False — complexity can make a delay reasonable.'},
    {id:'U3A1-06-c4', type:'mc', q:'Which of these helps uphold the right to be tried without unreasonable delay?', options:['Resolving cases through plea negotiations','Increasing the number of jurors','Abolishing the right to silence','Raising the standard of proof'], answer:0, explain:'Plea negotiations reduce the number of trials.'},
    {id:'U3A1-06-c5', type:'mc', q:'Which is <b>not</b> a reason delay is a problem?', options:['It changes the standard of proof','Witnesses\' memories fade','An accused on remand stays in custody','Stress for accused and victims'], answer:0, explain:'Delay doesn\'t change the standard of proof.'}
  ]
},

/* ============================================================ 7 */
{ id:'U3A1-07', area:'Unit 3 AOS 1 · Criminal justice system', title:'The right to silence',
  kk:'Rights of an accused: the right to silence',
  pretrain:[
    {term:'Right to silence', def:'The accused\'s right <span class="key">not to answer questions</span> or give evidence that might help prove their guilt.'},
    {term:'Adverse inference', def:'Concluding that silence <span class="key">suggests guilt</span>. This is not allowed.'},
    {term:'Self-incrimination', def:'Providing evidence of your own guilt.'}
  ],
  teach:[
    {type:'rule', title:'The rule', html:`
      <p>An accused has the right:</p>
      <p>① <b>not to answer police questions</b> during an investigation, and</p>
      <p>② <b>not to give evidence</b> or call witnesses at trial.</p>
      <p>Silence <b>cannot be used to infer guilt</b> — this is protected by the <i>Evidence Act 2008</i> (Vic). The judge may direct the jury not to draw that inference.</p>
      <p><b>Limit:</b> a person must generally give their <b>name and address</b> to police in certain circumstances (e.g. if police reasonably believe they have committed an offence).</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Emma, after an official police caution, declines to answer questions.', why:'Exercising the right to silence. (2025 exam scenario.)'},
        {text:'At trial, the accused chooses not to give evidence; the judge tells the jury not to treat this as a sign of guilt.'}],
      nonexamples:[
        {text:'"The jury may conclude the accused is guilty because she refused to give evidence."', why:'Wrong — no adverse inference.'},
        {text:'"Once arrested, the accused must answer all police questions."', why:'Wrong — that is exactly what the right protects.'},
        {text:'"The right to silence lets a person refuse to give their name and address in all circumstances."', why:'Wrong — there are circumstances where name and address must be given.'}]},
    {type:'rule', title:'Link to the presumption of innocence', html:`<p>The right to silence keeps the <b>burden on the prosecution</b>. The accused isn't forced to help prove their own guilt, so they are treated as innocent unless the prosecution proves guilt beyond reasonable doubt. Expect exam questions that ask you to make this link.</p>`}
  ],
  worked:[
    {title:'Explaining the right', prompt:'Explain what is meant by the right to silence. (2025 exam, Section B Q1a — first part)',
     steps:['Name the two parts: no obligation to answer police questions; no obligation to give evidence at trial.','Add the protection: silence cannot be used to infer guilt.','Optional precision: the limit on name and address.'],
     answer:'The accused need not answer police questions or give evidence at trial, and their <b>silence cannot be treated as evidence of guilt</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Tom refuses to answer police questions. At trial the prosecutor tells the jury, "An innocent man would have explained himself."',
     given:['Tom exercised his right to silence.','The prosecutor is inviting the jury to treat silence as a sign of guilt.'],
     item:{id:'U3A1-07-f1', type:'mc', q:'Is this allowed?', options:['No — silence cannot be used to infer guilt','Yes — silence is evidence','Yes — but only in the Supreme Court','No — because Tom must prove his innocence'], answer:0, explain:'No adverse inference may be drawn from silence.', hint:'What is an "adverse inference"?'}}
  ],
  practice:[
    {id:'U3A1-07-p1', type:'mc', q:'Which best describes the right to silence?', options:['The accused need not answer police questions or give evidence at trial','The accused must stay silent in court','The accused can refuse to give any information in any circumstance','The judge must stay silent until the verdict'], answer:0, explain:'No obligation to answer questions or testify.'},
    {id:'U3A1-07-p2', type:'tf', q:'A jury may treat an accused\'s silence as evidence of guilt.', answer:false, explain:'False — no adverse inference.'},
    {id:'U3A1-07-p3', type:'mc', q:'Which Victorian Act prevents silence being used to infer guilt?', options:['Evidence Act 2008','Juries Act 2000','Sentencing Act 1991','Victims\' Charter Act 2006'], answer:0, explain:'Evidence Act 2008 (Vic).'},
    {id:'U3A1-07-p4', type:'tf', q:'In certain circumstances, a person must give police their name and address.', answer:true, explain:'True — a limit on the right to silence.'},
    {id:'U3A1-07-p5', type:'text', q:'Concluding that silence suggests guilt is called an ______ inference.', accept:['adverse'], explain:'Adverse inference.'},
    {id:'U3A1-07-p6', type:'mc', q:'How does the right to silence uphold the presumption of innocence?', options:['It keeps the burden on the prosecution to prove guilt without the accused\'s help','It means the accused is innocent','It lowers the standard of proof','It gives the accused a jury'], answer:0, explain:'Burden stays on the prosecution.'}
  ],
  check:[
    {id:'U3A1-07-c1', type:'mc', q:'Emma declines to answer police questions after a caution. Which right is she exercising?', options:['The right to silence','The right to trial by jury','The right to be tried without unreasonable delay','The right to be informed about proceedings'], answer:0, src:'2025 Sec B Q1a', explain:'Right to silence.'},
    {id:'U3A1-07-c2', type:'tf', q:'Once arrested, an accused must answer all police questions.', answer:false, explain:'False.'},
    {id:'U3A1-07-c3', type:'mc', q:'At trial, the accused chooses not to give evidence. What should the jury do?', options:['Not treat this as a sign of guilt','Treat it as a sign of guilt','Ask the accused to explain','Find the accused guilty'], answer:0, explain:'No adverse inference.'},
    {id:'U3A1-07-c4', type:'text', q:'The right to silence keeps the ______ of proof on the prosecution.', accept:['burden'], explain:'Burden.'},
    {id:'U3A1-07-c5', type:'mc', q:'Which is a limit on the right to silence?', options:['A person may have to give their name and address to police','The accused must give evidence at trial','The accused must answer questions about prior convictions','The accused must call witnesses'], answer:0, explain:'Name and address in certain circumstances.'}
  ]
},

/* ============================================================ 8 */
{ id:'U3A1-08', area:'Unit 3 AOS 1 · Criminal justice system', title:'The right to trial by jury',
  kk:'Rights of an accused: the right to trial by jury',
  pretrain:[
    {term:'Jury', def:'A group of <span class="key">12</span> randomly selected members of the community who decide the verdict in a criminal trial.'},
    {term:'Verdict', def:'The decision: <span class="key">guilty</span> or <span class="key">not guilty</span>.'},
    {term:'Section 80', def:'Section of the Australian Constitution guaranteeing trial by jury for <span class="key">Commonwealth</span> indictable offences.'}
  ],
  teach:[
    {type:'rule', title:'The rule', html:`
      <p>An accused charged with an <b>indictable offence</b> who <b>pleads not guilty</b> has the right to be tried by a jury in the <b>County or Supreme Court</b>.</p>
      <p>For Commonwealth indictable offences, the right is protected by <b>section 80</b> of the Australian Constitution (you will meet this again in Unit 4).</p>
      <p>Division of labour: the <b>jury</b> decides the facts and the verdict; the <b>judge</b> decides questions of law and, if guilty, the sentence.</p>`},
    {type:'contrast', title:'When there is NO jury',
      rule:'Three conditions all have to hold for a jury: indictable offence + not guilty plea + heard in the County or Supreme Court. Take any one away and there is no jury.',
      examples:[
        {text:'Sam pleads not guilty to armed robbery in the County Court.', why:'Indictable + not guilty + County Court → jury.'}],
      nonexamples:[
        {text:'A summary offence in the Magistrates\' Court.', why:'No jury in the Magistrates\' Court.'},
        {text:'Luke\'s indictable offence heard summarily in the Magistrates\' Court.', why:'No jury. In the 2024 exam, answers claiming Luke had a right to trial by jury were marked incorrect.'},
        {text:'An accused who pleads guilty to murder.', why:'No trial, so no jury — the judge moves to sentencing.'}]}
  ],
  worked:[
    {title:'Does this accused get a jury?', prompt:'Nina is charged with culpable driving causing death and pleads not guilty. Does she have a right to trial by jury?',
     steps:['Indictable? Culpable driving causing death is serious → yes.','Not guilty plea? Yes.','Court? Serious indictable → County Court.','All three conditions hold.'],
     answer:'<b>Yes</b> — indictable offence, not guilty plea, County Court.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Leo is charged with offensive behaviour in a public place and pleads not guilty.',
     given:['Indictable? Offensive behaviour is less serious → summary.','Court? Magistrates\' Court.'],
     item:{id:'U3A1-08-f1', type:'tf', q:'So Leo has a right to trial by jury.', answer:false, explain:'False — summary offence, Magistrates\' Court, no jury.', hint:'Is there a jury in the Magistrates\' Court?'}}
  ],
  practice:[
    {id:'U3A1-08-p1', type:'text', q:'How many jurors sit on a criminal jury in Victoria?', accept:['12','twelve'], explain:'12.'},
    {id:'U3A1-08-p2', type:'tf', q:'There is a jury in the Magistrates\' Court.', answer:false, explain:'False.'},
    {id:'U3A1-08-p3', type:'mc', q:'Who decides the verdict in a jury trial?', options:['The jury','The judge','The prosecution','The victim'], answer:0, explain:'The jury decides the verdict; the judge decides the sentence.'},
    {id:'U3A1-08-p4', type:'mc', q:'Which section of the Australian Constitution guarantees trial by jury for Commonwealth indictable offences?', options:['Section 80','Section 109','Section 128','Section 51'], answer:0, explain:'Section 80.'},
    {id:'U3A1-08-p5', type:'mc', q:'Which accused has a right to trial by jury?', options:['Charged with armed robbery, pleads not guilty','Charged with careless driving, pleads not guilty','Charged with murder, pleads guilty','Charged with an indictable offence heard summarily'], answer:0, explain:'Indictable + not guilty + County/Supreme Court.'},
    {id:'U3A1-08-p6', type:'tf', q:'If an accused pleads guilty to an indictable offence, a jury decides the sentence.', answer:false, explain:'False — no jury; the judge sentences.'}
  ],
  check:[
    {id:'U3A1-08-c1', type:'mc', q:'Luke\'s indictable offence is heard summarily in the Magistrates\' Court. Does he have a right to trial by jury?', options:['No — there is no jury in the Magistrates\' Court','Yes — it is an indictable offence','Yes — all accused have a jury','Only if he pleads guilty'], answer:0, src:'2024 Sec B Q1a', explain:'No jury in the Magistrates\' Court.'},
    {id:'U3A1-08-c2', type:'mc', q:'Which role belongs to the judge, not the jury?', options:['Deciding the sentence','Deciding the verdict','Deciding which facts are proven','Deliberating in private'], answer:0, explain:'Judge sentences.'},
    {id:'U3A1-08-c3', type:'text', q:'Which section of the Australian Constitution protects jury trials for Commonwealth indictable offences? (number only)', accept:['80','section 80','s80','s 80'], explain:'Section 80.'},
    {id:'U3A1-08-c4', type:'tf', q:'An accused charged with an indictable offence who pleads not guilty has a right to trial by jury.', answer:true, explain:'True.'},
    {id:'U3A1-08-c5', type:'mc', q:'Which situation involves a jury?', options:['A not guilty plea to murder in the Supreme Court','A guilty plea to murder','A summary offence in the Magistrates\' Court','An indictable offence heard summarily'], answer:0, explain:'Indictable + not guilty + Supreme Court.'}
  ]
},

/* ============================================================ 9 */
{ id:'U3A1-09', area:'Unit 3 AOS 1 · Criminal justice system', title:'Rights of victims',
  kk:'Rights of victims: alternative arrangements; being informed about proceedings; being informed of likely release date',
  pretrain:[
    {term:'Victim', def:'A person who has suffered harm as a result of a crime. A victim is <span class="key">not a party</span> to the criminal case — the parties are the prosecution and the accused.'},
    {term:'Alternative arrangements', def:'Ways for a witness to <span class="key">give evidence without facing the accused</span> in open court.'},
    {term:'Victims\' Charter Act 2006 (Vic)', def:'Victorian Act setting out how victims should be treated, including being kept informed.'},
    {term:'Victims Register', def:'A register victims can join to be told about an offender\'s <span class="key">release</span>.'}
  ],
  teach:[
    {type:'rule', title:'Three rights in the study design', html:`
      <table class="mini"><tr><th>Right</th><th>What it looks like</th></tr>
      <tr><td><b>① Give evidence using alternative arrangements</b></td><td>Giving evidence from another room by video link (remote witness facility); a screen blocking the view of the accused; a support person nearby; closing the court to the public. Especially used for complainants in sexual offence and family violence cases.</td></tr>
      <tr><td><b>② Be informed about the proceedings</b></td><td>Being told about the charges laid, decisions to change or drop charges, bail, the trial and its outcome (<i>Victims' Charter Act</i>).</td></tr>
      <tr><td><b>③ Be informed of the likely release date of the offender</b></td><td>By joining the <b>Victims Register</b>, the victim can be told when the offender is likely to be released.</td></tr></table>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'A complainant in a sexual offence trial gives evidence by video link from another room.', why:'Right ①.'},
        {text:'The prosecution tells a victim that a charge has been dropped in plea negotiations.', why:'Right ②.'},
        {text:'A victim on the Victims Register is told the offender is due for release next month.', why:'Right ③.'}],
      nonexamples:[
        {text:'"Victims decide whether the accused is charged."', why:'No — police and prosecution decide. Victims have a right to be informed.'},
        {text:'"Victims are a party to the criminal case."', why:'No — the parties are the prosecution and the accused.'},
        {text:'"Victims decide the sentence."', why:'No — the judge decides. A victim impact statement is one factor the judge considers.'}]}
  ],
  worked:[
    {title:'Identifying the right', prompt:'Georgia, a victim of attempted murder, is terrified of seeing Jai in court. What right could help her? (Based on 2024 exam scenario)',
     steps:['What is her problem? Facing the accused while giving evidence.','Which right addresses giving evidence without facing the accused? Alternative arrangements.','Give an example: video link from a remote witness room, or a screen.'],
     answer:'The right to give evidence using <b>alternative arrangements</b>, e.g. by video link from another room.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Agu and Kim, victims of Emma\'s offending, want to know what is happening in the criminal case against her. (2025 exam scenario)',
     given:['What is their need? Information about the case.'],
     item:{id:'U3A1-09-f1', type:'mc', q:'So which victims\' right is most relevant?', options:['The right to be informed about the proceedings','The right to give evidence using alternative arrangements','The right to silence','The right to trial by jury'], answer:0, explain:'They want information → right to be informed about proceedings.', hint:'Which right is about information during the case?'}}
  ],
  practice:[
    {id:'U3A1-09-p1', type:'mc', q:'A victim gives evidence from a separate room via video link. Which right is this?', options:['Giving evidence using alternative arrangements','Being informed about the proceedings','Being informed of the offender\'s release date','Trial by jury'], answer:0, explain:'Alternative arrangements.'},
    {id:'U3A1-09-p2', type:'tf', q:'Victims are one of the parties in a criminal case.', answer:false, explain:'False — prosecution and accused are the parties.'},
    {id:'U3A1-09-p3', type:'text', q:'Victims can join the Victims ______ to be told about an offender\'s release.', accept:['register','victims register'], explain:'Victims Register.'},
    {id:'U3A1-09-p4', type:'mc', q:'Which Act sets out victims\' right to be informed about proceedings?', options:['Victims\' Charter Act 2006','Evidence Act 2008','Juries Act 2000','Australian Constitution'], answer:0, explain:'Victims\' Charter Act 2006 (Vic).'},
    {id:'U3A1-09-p5', type:'mc', q:'Which is <b>not</b> a right of victims?', options:['To decide the offender\'s sentence','To be informed about the proceedings','To give evidence using alternative arrangements','To be informed of the likely release date of the offender'], answer:0, explain:'The judge decides the sentence.'},
    {id:'U3A1-09-p6', type:'mc', q:'Which is an example of an alternative arrangement?', options:['A screen blocking the witness\'s view of the accused','The victim choosing the jury','The victim cross-examining the accused','The trial being moved to the High Court'], answer:0, explain:'Screens are an alternative arrangement.'}
  ],
  check:[
    {id:'U3A1-09-c1', type:'mc', q:'The prosecution tells a victim that bail has been granted to the accused. Which right is upheld?', options:['Being informed about the proceedings','Alternative arrangements','Release date information','Trial by jury'], answer:0, explain:'Informed about proceedings.'},
    {id:'U3A1-09-c2', type:'mc', q:'A victim is told the offender is likely to be released in March. How would the victim usually receive this?', options:['By being on the Victims Register','From the jury','From a community legal centre','Through the High Court'], answer:0, explain:'Victims Register.'},
    {id:'U3A1-09-c3', type:'tf', q:'Victims decide whether the police lay charges.', answer:false, explain:'False — victims have a right to be informed, not to decide.'},
    {id:'U3A1-09-c4', type:'text', q:'Giving evidence by video link from another room is an example of an ______ arrangement.', accept:['alternative'], explain:'Alternative arrangement.'},
    {id:'U3A1-09-c5', type:'mc', q:'Who are the parties in a criminal case?', options:['The prosecution and the accused','The victim and the accused','The judge and the jury','The plaintiff and the defendant'], answer:0, explain:'Prosecution and accused.'}
  ]
},

/* ============================================================ 10 */
{ id:'U3A1-10', area:'Unit 3 AOS 1 · Criminal justice system', title:'Victoria Legal Aid and community legal centres',
  kk:'The role of Victoria Legal Aid and Victorian community legal centres in assisting an accused and victims of crime',
  pretrain:[
    {term:'Victoria Legal Aid (VLA)', def:'A <span class="key">government-funded</span> body that provides legal information, advice and representation.'},
    {term:'Community legal centre (CLC)', def:'An <span class="key">independent, not-for-profit</span> organisation that provides free legal information and advice.'},
    {term:'Grant of legal aid', def:'VLA <span class="key">funding a lawyer</span> to represent someone — subject to eligibility tests.'},
    {term:'Means test', def:'A test of a person\'s <span class="key">income and assets</span> to decide eligibility for legal aid.'},
    {term:'Duty lawyer', def:'A lawyer at court who helps people appearing <span class="key">that day</span> without a lawyer.'}
  ],
  teach:[
    {type:'rule', title:'Two bodies, different roles', html:`
      <table class="mini"><tr><th></th><th>Victoria Legal Aid</th><th>Community legal centres</th></tr>
      <tr><td>What is it?</td><td>Government-funded statutory body</td><td>Independent, not-for-profit community organisations</td></tr>
      <tr><td>Information &amp; advice</td><td>Free legal information (website, phone); free advice in some matters</td><td>Free legal information and advice</td></tr>
      <tr><td>Representation</td><td>Duty lawyers; <b>grants of legal aid</b> for a lawyer — subject to a <b>means test</b> and other eligibility guidelines</td><td>Some casework for less serious matters; rarely represent in serious trials</td></tr>
      <tr><td>Types</td><td>One statewide body</td><td><b>Generalist</b> (serve a local area) or <b>specialist</b> (a particular group or area of law)</td></tr>
      <tr><td>Main limitation</td><td>Strict eligibility; limited funding</td><td>Limited funding and high demand</td></tr></table>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'An accused with low income charged with armed robbery receives a grant of legal aid for a barrister.', why:'VLA.'},
        {text:'Victims of crime get free advice from a CLC on their rights in the criminal case.', why:'CLC. (2025 exam scenario.)'}],
      nonexamples:[
        {text:'"Consumer Affairs Victoria gives free legal representation to accused people."', why:'No — CAV is a civil dispute resolution body. The 2025 assessors noted students confusing CLCs with VLA and CAV.'},
        {text:'"Anyone can get a grant of legal aid."', why:'No — means test and eligibility guidelines apply.'},
        {text:'"CLCs are government departments."', why:'No — they are independent, not-for-profit organisations (though they may receive government funding).'}]}
  ],
  worked:[
    {title:'Matching need to body', prompt:'Dev is charged with a serious indictable offence, has a low income, and needs a lawyer for his County Court trial. Who is most likely to help?',
     steps:['What does Dev need? Representation in a serious trial.','Who provides funded representation? VLA, through grants of legal aid.','Eligibility: low income → likely to pass the means test.','CLCs rarely represent in serious trials.'],
     answer:'<b>Victoria Legal Aid</b>, through a grant of legal aid.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Agu and Kim, victims of crime, want free general advice on their rights and on a possible civil claim. (2025 exam scenario)',
     given:['What do they need? Information and advice, not representation in a criminal trial.','Which body provides free advice and serves victims too?'],
     item:{id:'U3A1-10-f1', type:'mc', q:'So which body is most appropriate?', options:['A community legal centre','Consumer Affairs Victoria','The High Court','The jury'], answer:0, explain:'CLCs provide free legal advice, including to victims.', hint:'Independent, not-for-profit, free advice.'}}
  ],
  practice:[
    {id:'U3A1-10-p1', type:'mc', q:'What is a grant of legal aid?', options:['VLA funding a lawyer to represent someone','A fine paid to the victim','A payment from the court to the jury','A loan from a bank'], answer:0, explain:'VLA funding representation.'},
    {id:'U3A1-10-p2', type:'text', q:'The test of income and assets used to decide eligibility for legal aid is called the ______ test.', accept:['means'], explain:'Means test.'},
    {id:'U3A1-10-p3', type:'mc', q:'Which best describes community legal centres?', options:['Independent, not-for-profit organisations giving free legal information and advice','Government courts','Private law firms charging full fees','Tribunals that resolve civil disputes'], answer:0, explain:'Independent, not-for-profit.'},
    {id:'U3A1-10-p4', type:'mc', q:'A CLC that only helps young people is an example of a:', options:['Specialist CLC','Generalist CLC','Duty lawyer','Tribunal'], answer:0, explain:'Specialist — a particular group.'},
    {id:'U3A1-10-p5', type:'tf', q:'Anyone charged with an offence is entitled to a grant of legal aid.', answer:false, explain:'False — eligibility tests apply.'},
    {id:'U3A1-10-p6', type:'mc', q:'A lawyer at the Magistrates\' Court helping people who have no lawyer that day is a:', options:['Duty lawyer','Barrister funded by a CLC','Judge\'s associate','Prosecutor'], answer:0, explain:'Duty lawyer (a VLA service).'}
  ],
  check:[
    {id:'U3A1-10-c1', type:'mc', q:'Which body provides grants of legal aid?', options:['Victoria Legal Aid','Community legal centres','Consumer Affairs Victoria','The Magistrates\' Court'], answer:0, explain:'VLA.'},
    {id:'U3A1-10-c2', type:'mc', q:'A key limitation shared by VLA and CLCs is:', options:['Limited funding','They cannot give advice','They only help the wealthy','They charge high fees'], answer:0, explain:'Limited funding.'},
    {id:'U3A1-10-c3', type:'tf', q:'Consumer Affairs Victoria is a legal aid provider for accused people.', answer:false, src:'2025 Sec B Q1b', explain:'False — CAV deals with consumer disputes.'},
    {id:'U3A1-10-c4', type:'text', q:'A CLC that serves everyone in a local area (rather than a particular group) is called a ______ CLC.', accept:['generalist','general'], explain:'Generalist.'},
    {id:'U3A1-10-c5', type:'mc', q:'Which situation best suits a community legal centre?', options:['Free advice for a victim about their rights','Representation in a complex murder trial','Deciding a civil dispute','Sentencing an offender'], answer:0, explain:'Free advice — CLC.'}
  ]
},

/* ============================================================ 11 */
{ id:'U3A1-11', area:'Unit 3 AOS 1 · Criminal justice system', title:'Plea negotiations',
  kk:'The purposes and appropriateness of plea negotiations',
  pretrain:[
    {term:'Plea negotiations', def:'Pre-trial discussions between the <span class="key">prosecution</span> and the <span class="key">accused</span> (usually through their lawyer) to agree on the charges the accused will plead guilty to.'},
    {term:'Charge', def:'The formal accusation of a specific offence.'},
    {term:'Lesser charge', def:'A less serious offence than the one originally charged — e.g. assault instead of aggravated assault.'},
    {term:'Office of Public Prosecutions (OPP)', def:'The body that prosecutes serious (indictable) offences in Victoria on behalf of the state.'}
  ],
  teach:[
    {type:'rule', title:'What happens in a plea negotiation', html:`
      <p>The accused agrees to <b>plead guilty</b>. In exchange, the prosecution agrees to:</p>
      <p>① <b>withdraw</b> some charges, and/or ② <b>replace</b> a charge with a <b>lesser</b> one, and/or ③ agree on the <b>summary of facts</b> put to the court.</p>
      <p>Who is involved: the <b>prosecution and the accused</b>. The <span class="key">judge is not involved</span>, and the negotiation does <b>not</b> fix the sentence — the judge still decides the sentence.</p>
      <p>Victims must be <b>consulted</b> (their views sought) — but victims do not have a veto.</p>`},
    {type:'rule', title:'Purposes', html:`
      <table class="mini"><tr><th>Purpose</th><th>Why it matters</th></tr>
      <tr><td><b>Saves time and cost</b></td><td>A settled negotiation <b>removes the need for a trial</b>, freeing court time and reducing delays for other cases.</td></tr>
      <tr><td><b>Certainty of outcome</b></td><td>The prosecution secures a conviction; the accused knows what they are pleading to.</td></tr>
      <tr><td><b>Reduces trauma and stress</b></td><td>Victims and witnesses don't have to give evidence at a trial.</td></tr></table>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Grant agrees to plead guilty to one count of aggravated assault; the prosecution withdraws the charge of threatening to harm Maya.', why:'Withdrawal of a charge in exchange for a guilty plea. (2025 exam scenario.)'},
        {text:'An accused pleads guilty to assault after the prosecution replaces aggravated assault with the lesser charge.', why:'Lesser charge.'}],
      nonexamples:[
        {text:'"The judge and the accused agree on a sentence of 2 years."', why:'Judges are not involved, and plea negotiations don\'t set the sentence. The examiners specifically flagged this.'},
        {text:'"Plea negotiations shorten the trial."', why:'A settled negotiation removes the need for a trial altogether — not shortens one.'},
        {text:'"The victim decides whether to accept the deal."', why:'Victims are consulted, but the prosecution decides.'}]},
    {type:'rule', title:'Appropriateness — both sides', html:`
      <p><b>When appropriate:</b> the prosecution case has weaknesses; the victim would be traumatised by a trial; the accused is genuinely willing to accept responsibility; the outcome still reflects the seriousness of the offending.</p>
      <p><b>Concerns:</b> they happen in <b>private</b> (lack of openness → fairness); the community or victim may feel the outcome is too <b>lenient</b>; an accused may feel <b>pressure</b> to plead guilty even if they might have been acquitted.</p>`}
  ],
  worked:[
    {title:'Explaining a purpose', prompt:'Explain one purpose of plea negotiations in Grant\'s case. (2025 exam, Section A Q2a)',
     steps:['Name one purpose only: reducing trauma and stress for victims.','Explain how: a settled plea negotiation means no trial, so Andy and Maya would not have to give evidence.','Link to the scenario: Andy has ongoing physical and mental health issues — giving evidence could retraumatise him.'],
     answer:'Purpose: <b>to reduce trauma for victims</b>. Because no trial is needed, Andy and Maya avoid giving evidence — important given Andy\'s ongoing mental health issues.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Nadia is charged with armed robbery and theft. Her lawyer proposes she plead guilty to theft if the armed robbery charge is replaced with robbery (without a weapon).',
     given:['Who negotiates? Nadia\'s lawyer and the prosecution.','What is offered? A guilty plea in exchange for a lesser charge.'],
     item:{id:'U3A1-11-f1', type:'mc', q:'If agreed, who decides Nadia\'s sentence?', options:['The judge','The prosecution','The victim','Nadia\'s lawyer'], answer:0, explain:'Plea negotiations don\'t fix the sentence — the judge sentences.', hint:'Who is NOT part of plea negotiations?'}}
  ],
  practice:[
    {id:'U3A1-11-p1', type:'mc', q:'Who takes part in plea negotiations?', options:['The prosecution and the accused','The judge and the accused','The jury and the prosecution','The victim and the judge'], answer:0, explain:'Prosecution and accused (via lawyers).'},
    {id:'U3A1-11-p2', type:'tf', q:'Plea negotiations automatically reduce the sentence the accused receives.', answer:false, explain:'False. They change the charges; the judge sets the sentence.'},
    {id:'U3A1-11-p3', type:'mc', q:'Which is a purpose of plea negotiations?', options:['Removing the need for a trial, saving time and cost','Allowing the jury to decide the sentence','Shifting the burden of proof to the accused','Letting the victim choose the charges'], answer:0, explain:'Saves time and cost.'},
    {id:'U3A1-11-p4', type:'mc', q:'Which is a criticism of plea negotiations linked to <b>fairness</b>?', options:['They happen in private, not in open court','They are too fast','They involve a jury','They are free'], answer:0, explain:'Lack of openness.'},
    {id:'U3A1-11-p5', type:'tf', q:'Victims\' views must be sought in plea negotiations, but they cannot veto the agreement.', answer:true, explain:'True.'},
    {id:'U3A1-11-p6', type:'text', q:'In a plea negotiation, the accused agrees to plead ______.', accept:['guilty'], explain:'Guilty.'}
  ],
  check:[
    {id:'U3A1-11-c1', type:'mc', q:'Grant pleads guilty to aggravated assault and the prosecution withdraws the threat charge. What is this?', options:['A plea negotiation','A committal hearing','An appeal','A sentencing hearing'], answer:0, src:'2025 Sec A Q2a', explain:'Plea negotiation.'},
    {id:'U3A1-11-c2', type:'tf', q:'The judge is involved in plea negotiations.', answer:false, explain:'False.'},
    {id:'U3A1-11-c3', type:'mc', q:'How do plea negotiations save time?', options:['A settled negotiation removes the need for a trial','They shorten the trial','They reduce the number of jurors','They speed up appeals'], answer:0, explain:'No trial needed.'},
    {id:'U3A1-11-c4', type:'mc', q:'Which situation makes a plea negotiation most appropriate?', options:['A vulnerable victim would be traumatised by giving evidence','The accused insists they are innocent','The judge wants a shorter list','The jury is tired'], answer:0, explain:'Sparing a vulnerable victim.'},
    {id:'U3A1-11-c5', type:'mc', q:'Which is a risk for the accused?', options:['Pressure to plead guilty even if they might have been acquitted','Losing the right to a lawyer','Being tried twice','Having to give a victim impact statement'], answer:0, explain:'Pressure to plead guilty.'}
  ]
},

/* ============================================================ 12 */
{ id:'U3A1-12', area:'Unit 3 AOS 1 · Criminal justice system', title:'The court hierarchy: specialisation and appeals',
  kk:'The reasons for the Victorian court hierarchy in determining criminal cases, including specialisation and appeals',
  pretrain:[
    {term:'Court hierarchy', def:'The ranking of courts from <span class="key">lowest to highest</span>, according to the seriousness and complexity of the cases they hear.'},
    {term:'Jurisdiction', def:'The <span class="key">power</span> of a court to hear and decide a type of case.'},
    {term:'Specialisation', def:'Courts <span class="key">developing expertise</span> in particular types of cases.'},
    {term:'Appeal', def:'Asking a <span class="key">higher court</span> to <span class="key">review</span> a decision of a lower court.'}
  ],
  teach:[
    {type:'diagram', title:'Who hears what', svg:SVG_COURTS, caption:'Magistrates\': summary offences, indictable offences heard summarily, committal hearings, bail. County: most indictable offences. Supreme Court (Trial Division): the most serious — murder, attempted murder, treason. Court of Appeal: appeals.'},
    {type:'rule', title:'Reason 1 — Specialisation', html:`
      <p>Because each court hears certain types of case, its judges and staff develop <b>expertise</b> in them. E.g. Supreme Court judges are experienced in murder trials; the Magistrates' Court handles a huge volume of summary offences quickly.</p>
      <p>Specialist courts and lists also exist — e.g. the <b>Koori Court</b> and the <b>Drug Court</b> — with expertise in particular offenders.</p>
      <p><b>Why it matters:</b> better, more consistent decisions; procedures suited to the case.</p>`},
    {type:'rule', title:'Reason 2 — Appeals', html:`
      <p>A hierarchy means there is a <b>higher court</b> to which a dissatisfied party can appeal. Grounds include an <b>error of law</b>, an unreasonable <b>conviction</b>, or a <b>sentence</b> that is too harsh (or too lenient — the prosecution can appeal against sentence).</p>
      <p><span class="key">An appeal is a review of the original decision, not a new trial</span> (except in specific circumstances).</p>
      <p><b>Why it matters:</b> errors can be corrected by more experienced judges → <b>fairness</b>.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Luke believes the magistrate made an error of law and appeals to the Supreme Court.', why:'Appeals. (2024 exam scenario.)'},
        {text:'A murder trial is heard by an experienced Supreme Court judge.', why:'Specialisation.'}],
      nonexamples:[
        {text:'"An appeal means the whole trial is run again with a new jury."', why:'Generally no — an appeal is a review of the decision.'},
        {text:'"Anyone can appeal for any reason."', why:'There must be grounds, e.g. an error of law.'},
        {text:'"Appeals are always accessible to everyone."', why:'Cost can prevent people appealing — a limit on fairness and access.'}]}
  ],
  worked:[
    {title:'Linking appeals to fairness', prompt:'To what extent do appeals promote fairness in Luke\'s case? (2024 exam, Section B Q1b — outline)',
     steps:['Strength: Luke can participate further by asking an impartial, more experienced judge to review an alleged error → fairness.','Strength: if there was an error of law, it can be corrected → impartial outcome.','Limitation: if Luke can\'t afford an appeal, the error may stand.','Conclusion: appeals promote fairness to a large extent, limited by cost.'],
     answer:'Appeals promote fairness through <b>participation</b> and <b>impartial review</b>, but <b>cost</b> may limit Luke\'s ability to use them.'}
  ],
  faded:[
    {title:'Your turn', prompt:'The Magistrates\' Court hears tens of thousands of minor traffic matters each year and has streamlined procedures for them.',
     given:['What is the court doing? Handling one type of case in high volume.','So its magistrates develop expertise and efficient procedures.'],
     item:{id:'U3A1-12-f1', type:'text', q:'Which reason for the court hierarchy does this show? (one word)', accept:['specialisation','specialization'], explain:'Specialisation.', hint:'Expertise in particular cases.'}}
  ],
  practice:[
    {id:'U3A1-12-p1', type:'mc', q:'Which court hears murder trials?', options:['Supreme Court (Trial Division)','County Court','Magistrates\' Court','Court of Appeal'], answer:0, explain:'Supreme Court Trial Division.'},
    {id:'U3A1-12-p2', type:'mc', q:'Which court hears most indictable offences?', options:['County Court','Magistrates\' Court','High Court','Court of Appeal'], answer:0, explain:'County Court.'},
    {id:'U3A1-12-p3', type:'tf', q:'An appeal is generally a review of the decision, not a new trial.', answer:true, explain:'True — the examiners stressed this.'},
    {id:'U3A1-12-p4', type:'mc', q:'Which principle of justice do appeals most directly support?', options:['Fairness','Efficiency','Speed','None'], answer:0, explain:'Fairness — correcting errors via impartial review.'},
    {id:'U3A1-12-p5', type:'text', q:'The power of a court to hear a type of case is its ______.', accept:['jurisdiction'], explain:'Jurisdiction.'},
    {id:'U3A1-12-p6', type:'mc', q:'Which is a limitation on appeals?', options:['The cost of appealing','Appeals are heard by less experienced judges','Appeals cannot correct errors','Appeals are always new trials'], answer:0, explain:'Cost.'}
  ],
  check:[
    {id:'U3A1-12-c1', type:'mc', q:'Two reasons for the court hierarchy named in the study design for criminal cases are:', options:['Specialisation and appeals','Speed and cost','Juries and judges','Bail and remand'], answer:0, explain:'Specialisation and appeals.'},
    {id:'U3A1-12-c2', type:'mc', q:'Luke thinks the magistrate made an error in applying the law. What can he do?', options:['Appeal to a higher court','Ask for a jury','Request a plea negotiation','Nothing'], answer:0, src:'2024 Sec B Q1b', explain:'Appeal.'},
    {id:'U3A1-12-c3', type:'tf', q:'Only the accused can appeal; the prosecution can never appeal against a sentence.', answer:false, explain:'False — the prosecution can appeal against sentence.'},
    {id:'U3A1-12-c4', type:'mc', q:'Which is an example of specialisation?', options:['The Koori Court','A jury of 12','An appeal on a point of law','Legal aid'], answer:0, explain:'Koori Court.'},
    {id:'U3A1-12-c5', type:'mc', q:'Which court hears appeals from the County Court in criminal cases?', options:['Court of Appeal','Magistrates\' Court','VCAT','Koori Court'], answer:0, explain:'Court of Appeal.'}
  ]
},

/* ============================================================ 13 */
{ id:'U3A1-13', area:'Unit 3 AOS 1 · Criminal justice system', title:'Role of the judge or magistrate',
  kk:'The roles of key personnel in a criminal case: the judge or magistrate',
  pretrain:[
    {term:'Judge', def:'Presides over trials in the <span class="key">County and Supreme Courts</span>.'},
    {term:'Magistrate', def:'Presides over hearings in the <span class="key">Magistrates\' Court</span> — there is no jury.'},
    {term:'Admissibility', def:'Whether a piece of evidence is <span class="key">allowed</span> to be used.'},
    {term:'Jury directions', def:'Instructions from the judge to the jury about the law and how to approach evidence.'}
  ],
  teach:[
    {type:'rule', title:'Roles of the judge in a jury trial', html:`
      <p>① <b>Act as an impartial umpire</b> — ensure the trial is fair and procedures are followed.</p>
      <p>② <b>Decide questions of law</b>, including the <b>admissibility of evidence</b>.</p>
      <p>③ <b>Give directions</b> to the jury and <b>sum up</b> the case.</p>
      <p>④ <b>Sentence</b> the offender if found or pleads guilty.</p>
      <p>⑤ <b>Assist self-represented accused</b> with procedure — without becoming their advocate.</p>`},
    {type:'contrast', title:'Judge vs magistrate', rule:'A magistrate does everything a judge does <b>plus</b> the jury\'s job, because there is no jury in the Magistrates\' Court.',
      examples:[
        {text:'A magistrate decides that Luke is guilty, then fines him.', why:'Magistrate decides guilt and sentence. (2024 scenario.)'},
        {text:'A County Court judge rules that a piece of evidence was illegally obtained and cannot be used.', why:'Question of law — admissibility.'}],
      nonexamples:[
        {text:'"In a County Court jury trial, the judge decides whether the accused is guilty."', why:'No — the jury decides the verdict.'},
        {text:'"The judge questions witnesses to find out the truth."', why:'No — in the adversary system the parties question witnesses; the judge is an umpire.'},
        {text:'"The judge helps the self-represented accused win."', why:'No — help with procedure only, staying impartial.'}]}
  ],
  worked:[
    {title:'Who does what?', prompt:'In Emma\'s County Court trial, who (a) decided she was guilty and (b) will sentence her? (2025 exam scenario)',
     steps:['County Court + not guilty plea → jury trial.','The jury decides the verdict.','The judge decides the sentence.'],
     answer:'(a) the <b>jury</b>; (b) the <b>judge</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'During a Supreme Court trial, defence counsel objects that a witness\'s statement is hearsay.',
     given:['This is a question about whether evidence can be used.','Questions of law are for the judge.'],
     item:{id:'U3A1-13-f1', type:'mc', q:'So who decides the objection?', options:['The judge','The jury','The prosecution','The witness'], answer:0, explain:'Admissibility is a question of law → judge.', hint:'Question of law or fact?'}}
  ],
  practice:[
    {id:'U3A1-13-p1', type:'mc', q:'Which is a role of the judge in a jury trial?', options:['Decide the admissibility of evidence','Decide the verdict','Present the prosecution\'s case','Choose the jurors\' verdict'], answer:0, explain:'Admissibility.'},
    {id:'U3A1-13-p2', type:'tf', q:'A magistrate decides both guilt and sentence.', answer:true, explain:'True — no jury.'},
    {id:'U3A1-13-p3', type:'mc', q:'Why is the judge described as an "umpire"?', options:['They stay impartial and ensure rules are followed','They score the lawyers','They decide who wins in every case','They question witnesses'], answer:0, explain:'Impartial umpire.'},
    {id:'U3A1-13-p4', type:'text', q:'Whether evidence is allowed to be used is called its ______.', accept:['admissibility'], explain:'Admissibility.'},
    {id:'U3A1-13-p5', type:'mc', q:'How may a judge assist a self-represented accused?', options:['Explain court procedure','Argue their case','Choose their witnesses','Decide the verdict for them'], answer:0, explain:'Procedure only.'},
    {id:'U3A1-13-p6', type:'tf', q:'The judge explains the law to the jury through directions.', answer:true, explain:'True.'}
  ],
  check:[
    {id:'U3A1-13-c1', type:'mc', q:'Who sentences an offender after a jury verdict of guilty?', options:['The judge','The jury','The prosecution','The victim'], answer:0, explain:'Judge.'},
    {id:'U3A1-13-c2', type:'mc', q:'Which role belongs to a magistrate but NOT to a County Court judge in a jury trial?', options:['Deciding guilt','Deciding admissibility','Sentencing','Ensuring a fair hearing'], answer:0, explain:'Magistrates decide guilt; in a jury trial the jury does.'},
    {id:'U3A1-13-c3', type:'tf', q:'The judge cross-examines witnesses in a criminal trial.', answer:false, explain:'False — the parties do.'},
    {id:'U3A1-13-c4', type:'mc', q:'The judge\'s summing up and directions help the jury to:', options:['Understand the law and the evidence','Decide the sentence','Choose witnesses','Negotiate a plea'], answer:0, explain:'Understand law and evidence.'},
    {id:'U3A1-13-c5', type:'text', q:'Who presides over hearings in the Magistrates\' Court?', accept:['magistrate','a magistrate','the magistrate','magistrates'], explain:'Magistrate.'}
  ]
},

/* ============================================================ 14 */
{ id:'U3A1-14', area:'Unit 3 AOS 1 · Criminal justice system', title:'Role of the jury',
  kk:'The roles of key personnel in a criminal case: the jury',
  pretrain:[
    {term:'Deliberate', def:'To <span class="key">discuss</span> the evidence in private in order to reach a verdict.'},
    {term:'Unanimous verdict', def:'All 12 jurors agree.'},
    {term:'Majority verdict', def:'11 of 12 jurors agree — allowed for most offences, but not murder or treason.'},
    {term:'Hung jury', def:'A jury that <span class="key">cannot reach</span> a verdict. It is discharged and a retrial may be held.'}
  ],
  teach:[
    {type:'rule', title:'Roles of the jury', html:`
      <p>① <b>Be objective and impartial</b> — put aside preconceptions; have no connection to the parties.</p>
      <p>② <b>Listen to and remember the evidence</b> — jurors can take notes.</p>
      <p>③ <b>Understand the judge's directions</b> — and <b>ask the judge</b> if unsure about a legal point.</p>
      <p>④ <b>Decide on evidence presented in court only</b> — no independent research.</p>
      <p>⑤ <b>Deliberate and deliver a verdict</b> — guilty only if satisfied beyond reasonable doubt.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'A juror unsure what "recklessness" means sends a note asking the judge to explain.', why:'Seeking clarification of directions.'},
        {text:'Jurors discuss the evidence privately in the jury room and agree a verdict.', why:'Deliberating.'}],
      nonexamples:[
        {text:'Luke researches legal terms online during the trial.', why:'Breaches the duty to decide on the evidence only — the jury was discharged. (2024 scenario.)'},
        {text:'"The jury decides the sentence."', why:'The judge sentences.'},
        {text:'"The jury questions the accused."', why:'Parties question witnesses; jurors listen.'}]},
    {type:'rule', title:'Exam technique from the 2024 report', html:`<p>"Analyse two roles" questions rewarded linking each role to <b>what happened in the case</b> — e.g. Luke's research → the jury was discharged → no verdict. Don't just list roles.</p>`}
  ],
  worked:[
    {title:'Analysing a role', prompt:'Analyse the jury\'s role of delivering a verdict in the trial where Luke was a juror. (2024 Section B Q1d)',
     steps:['State the role: deliberate and deliver a verdict, based solely on evidence presented in court.','Link to the scenario: Luke\'s outside research introduced external material.','Impact: this could bias deliberations, so the jury was discharged and no verdict was reached.'],
     answer:'Luke\'s research <b>compromised</b> the role of delivering a verdict on the evidence alone, leading to the jury\'s <b>discharge</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'After 8 hours of deliberation in an armed robbery trial, 11 jurors believe the accused is guilty and one does not.',
     given:['A unanimous verdict isn\'t possible.','The offence is armed robbery — not murder or treason.'],
     item:{id:'U3A1-14-f1', type:'mc', q:'So what verdict is possible?', options:['A majority verdict of guilty','No verdict is ever possible','The judge decides instead','The one juror must change their mind'], answer:0, explain:'11:1 majority verdicts are allowed for most offences after enough deliberation.', hint:'Majority verdicts aren\'t allowed for which offences?'}}
  ],
  practice:[
    {id:'U3A1-14-p1', type:'tf', q:'Jurors may research the accused online if it helps them reach the right verdict.', answer:false, explain:'False — evidence in court only.'},
    {id:'U3A1-14-p2', type:'mc', q:'A majority verdict is NOT allowed for:', options:['Murder','Armed robbery','Culpable driving','Theft'], answer:0, explain:'Murder (and treason).'},
    {id:'U3A1-14-p3', type:'text', q:'A jury that cannot agree on a verdict is called a ______ jury.', accept:['hung'], explain:'Hung.'},
    {id:'U3A1-14-p4', type:'mc', q:'What should a juror do if they don\'t understand a legal term?', options:['Ask the judge','Look it up online','Ask a friend','Guess'], answer:0, explain:'Ask the judge.'},
    {id:'U3A1-14-p5', type:'mc', q:'What standard must the jury apply to find the accused guilty?', options:['Beyond reasonable doubt','Balance of probabilities','Majority opinion','Any doubt'], answer:0, explain:'BRD.'},
    {id:'U3A1-14-p6', type:'mc', q:'How are jurors selected?', options:['Randomly from the electoral roll','By the judge','By the accused','By the victim'], answer:0, explain:'Random from the electoral roll.'}
  ],
  check:[
    {id:'U3A1-14-c1', type:'mc', q:'Luke\'s research during the trial most directly breached which role?', options:['Deciding only on evidence presented in court','Sentencing','Presenting the prosecution case','Representing the accused'], answer:0, src:'2024 Sec B Q1d', explain:'Evidence in court only.'},
    {id:'U3A1-14-c2', type:'text', q:'How many jurors must agree for a majority verdict in Victoria?', accept:['11','eleven','11 of 12','eleven of twelve'], explain:'11 of 12.'},
    {id:'U3A1-14-c3', type:'tf', q:'Jurors may take notes during the trial.', answer:true, explain:'True.'},
    {id:'U3A1-14-c4', type:'mc', q:'What happens with a hung jury?', options:['The jury is discharged and a retrial may be ordered','The accused is automatically guilty','The judge decides the verdict','The accused is automatically acquitted forever'], answer:0, explain:'Discharge; retrial possible.'},
    {id:'U3A1-14-c5', type:'mc', q:'Which is NOT a role of the jury?', options:['Ruling on admissibility of evidence','Deliberating','Delivering a verdict','Listening to evidence'], answer:0, explain:'Admissibility is for the judge.'}
  ]
},

/* ============================================================ 15 */
{ id:'U3A1-15', area:'Unit 3 AOS 1 · Criminal justice system', title:'The parties and legal practitioners',
  kk:'The roles of the parties; the need for legal practitioners in a criminal case',
  pretrain:[
    {term:'Disclosure', def:'The prosecution\'s duty to give the accused the <span class="key">evidence</span> it holds, including evidence that may help the accused.'},
    {term:'Examination-in-chief', def:'Questioning your <span class="key">own</span> witness.'},
    {term:'Cross-examination', def:'Questioning the <span class="key">other party\'s</span> witness.'},
    {term:'Solicitor / barrister', def:'Solicitors advise and prepare cases; barristers specialise in arguing cases in court.'}
  ],
  teach:[
    {type:'rule', title:'Roles of the parties', html:`
      <table class="mini"><tr><th>Prosecution</th><th>Accused (defence)</th></tr>
      <tr><td>Represents the <b>state</b>; brings the case</td><td>Responds to the charges</td></tr>
      <tr><td>Bears the <b>burden of proof</b> — must prove guilt beyond reasonable doubt</td><td>Does not have to prove anything</td></tr>
      <tr><td><b>Disclosure</b> obligations — must hand over relevant evidence</td><td>May choose whether to give evidence (right to silence)</td></tr>
      <tr><td>Must act <b>fairly</b> — not seek a conviction at all costs</td><td>May present a defence, call witnesses</td></tr>
      <tr><td colspan="2">Both: opening and closing addresses; examination-in-chief and cross-examination of witnesses</td></tr></table>
      <p class="muted">The 2025 examiners noted few students mentioned disclosure obligations — easy marks.</p>`},
    {type:'rule', title:'Why legal practitioners are needed', html:`
      <p>① <b>Complex procedures and rules of evidence</b> — lawyers know them.</p>
      <p>② <b>Objectivity</b> — the accused is emotionally involved; a lawyer is detached.</p>
      <p>③ <b>Presenting the case effectively</b> — e.g. skilled cross-examination.</p>
      <p>④ <b>Equality</b> — the prosecution is always legally trained; an unrepresented accused is at a disadvantage.</p>
      <p><b>Dietrich v The Queen (1992):</b> the High Court held that a trial for a serious offence may be <b>adjourned</b> if the accused cannot get a lawyer through no fault of their own.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'The prosecution gives Grant\'s lawyer a witness statement that partly supports Grant.', why:'Disclosure.'},
        {text:'A self-represented accused fails to object to inadmissible evidence because he doesn\'t know the rules.', why:'Shows the need for legal practitioners.'}],
      nonexamples:[
        {text:'"The prosecution\'s job is to win at any cost."', why:'No — it must act fairly.'},
        {text:'"Dietrich gives every accused a right to a free lawyer."', why:'No — it allows a serious trial to be adjourned (stayed); it is not a right to a lawyer.'}]}
  ],
  worked:[
    {title:'Comparing roles', prompt:'Compare the roles of the prosecution in Grant\'s criminal case and the plaintiff (Andy) in his civil case. (2025 Section A Q2b — outline)',
     steps:['Similarity: both bring the case and bear the burden of proof.','Similarity: both have disclosure obligations and examine/cross-examine witnesses.','Difference: different standards — beyond reasonable doubt vs balance of probabilities.','Difference: purpose — prosecution seeks a conviction for the state; Andy seeks compensation for himself.'],
     answer:'Similar in <b>burden</b>, <b>disclosure</b> and <b>presenting the case</b>; different in <b>standard</b> and <b>purpose</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Sam faces a serious armed robbery charge. He can\'t afford a lawyer and has been refused legal aid.',
     given:['Serious offence + unrepresented through no fault of his own.','The High Court addressed this situation in 1992.'],
     item:{id:'U3A1-15-f1', type:'text', q:'Name the case (one word is enough).', accept:['Dietrich','dietrich v the queen','dietrich v r'], explain:'Dietrich v The Queen (1992).', hint:'D…'}}
  ],
  practice:[
    {id:'U3A1-15-p1', type:'mc', q:'Who does the prosecution represent?', options:['The state / community','The victim','The judge','The police only'], answer:0, explain:'The state.'},
    {id:'U3A1-15-p2', type:'text', q:'Questioning the other party\'s witness is called ______.', accept:['cross-examination','cross examination','crossexamination','cross-examining'], explain:'Cross-examination.'},
    {id:'U3A1-15-p3', type:'tf', q:'The prosecution must give the accused relevant evidence, even if it helps the accused.', answer:true, explain:'True — disclosure.'},
    {id:'U3A1-15-p4', type:'mc', q:'Which is a reason legal practitioners are needed?', options:['Complex rules of evidence and procedure','Judges cannot speak to accused people','Juries only listen to lawyers','Courts charge less with a lawyer'], answer:0, explain:'Complexity.'},
    {id:'U3A1-15-p5', type:'mc', q:'Dietrich v The Queen held that:', options:['A serious trial may be adjourned if the accused is unrepresented through no fault of their own','Every accused gets a free lawyer','Accused people must represent themselves','Juries can ask questions'], answer:0, explain:'Adjournment/stay.'},
    {id:'U3A1-15-p6', type:'mc', q:'An unrepresented accused facing a trained prosecutor most affects which principle?', options:['Equality','Openness','Efficiency','Speed'], answer:0, explain:'Equality (disadvantage).'}
  ],
  check:[
    {id:'U3A1-15-c1', type:'mc', q:'A similarity between the prosecution and a civil plaintiff is that both:', options:['Bear the burden of proof','Must prove beyond reasonable doubt','Seek compensation','Represent the state'], answer:0, src:'2025 Sec A Q2b', explain:'Burden of proof.'},
    {id:'U3A1-15-c2', type:'text', q:'The prosecution\'s duty to hand over relevant evidence is called ______.', accept:['disclosure'], explain:'Disclosure.'},
    {id:'U3A1-15-c3', type:'tf', q:'The accused must give evidence at trial.', answer:false, explain:'False — right to silence.'},
    {id:'U3A1-15-c4', type:'mc', q:'Which lawyer specialises in arguing cases in court?', options:['Barrister','Solicitor','Magistrate','Associate'], answer:0, explain:'Barrister.'},
    {id:'U3A1-15-c5', type:'mc', q:'Why is objectivity a reason for legal representation?', options:['The accused is emotionally involved; a lawyer is detached','Lawyers decide the verdict','Lawyers are on the jury','Judges prefer lawyers'], answer:0, explain:'Detachment.'}
  ]
},

/* ============================================================ 16 */
{ id:'U3A1-16', area:'Unit 3 AOS 1 · Criminal justice system', title:'Costs, time and cultural differences',
  kk:'The impact of costs, time and cultural differences on the achievement of the principles of justice',
  pretrain:[
    {term:'Costs', def:'Legal fees, expert reports, and other expenses of a case.'},
    {term:'Time', def:'Delays before and during a case.'},
    {term:'Cultural differences', def:'Differences in <span class="key">language, beliefs and experiences</span> that can make the system hard to understand or use.'},
    {term:'Koori Court', def:'A sentencing court for <span class="key">First Nations</span> offenders who plead guilty, involving <span class="key">Elders or Respected Persons</span>.'}
  ],
  teach:[
    {type:'rule', title:'The method: factor → principle → why', html:`
      <p>Every answer in this topic follows one pattern: name the <b>factor</b>, link it to a specific <b>principle</b> (and its part), and explain <b>why</b>.</p>
      <table class="mini"><tr><th>Factor</th><th>Typical impact</th></tr>
      <tr><td><b>Costs</b></td><td>Accused who can't afford a lawyer and aren't eligible for legal aid → <b>equality</b> (disadvantage against a trained prosecutor) and <b>access</b>.</td></tr>
      <tr><td><b>Time</b></td><td>Delays → accused on remand while presumed innocent; evidence deteriorates → <b>fairness</b>; stress for victims.</td></tr>
      <tr><td><b>Cultural differences</b></td><td>Language barriers, unfamiliarity with processes, distrust of the system → <b>access</b> and <b>equality</b>.</td></tr></table>`},
    {type:'contrast', title:'Responses that reduce the impact',
      rule:'Strong answers also say what the system does about each factor — and whether it is enough.',
      examples:[
        {text:'VLA grants of legal aid and duty lawyers.', why:'Reduce the impact of costs (but strict eligibility).'},
        {text:'Plea negotiations and committal procedures that resolve cases earlier.', why:'Reduce delay.'},
        {text:'Free interpreters for accused people who need them; the Koori Court.', why:'Reduce the impact of cultural differences.'}],
      nonexamples:[
        {text:'"Costs affect efficiency."', why:'Efficiency is not a principle of justice. Link to fairness, equality or access.'},
        {text:'"The Koori Court decides whether First Nations accused are guilty."', why:'No — it sentences offenders who have pleaded guilty.'}]}
  ],
  worked:[
    {title:'Factor → principle → why', prompt:'Explain how time can affect fairness for an accused on remand.',
     steps:['Factor: delay before trial.','Principle: fairness (and the presumption of innocence).','Why: the accused may spend months in custody while still presumed innocent; witnesses\' memories fade, affecting a fair trial.'],
     answer:'Delay can undermine <b>fairness</b>: custody while presumed innocent and <b>deteriorating evidence</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Ali recently arrived in Australia, speaks limited English and is charged with a summary offence.',
     given:['Factor: cultural differences (language).','Without help, he can\'t understand the charges or the process.'],
     item:{id:'U3A1-16-f1', type:'mc', q:'Which principle is most at risk, and what helps?', options:['Access — a free interpreter','Efficiency — a faster hearing','Openness — a public hearing','None — language doesn\'t matter'], answer:0, explain:'Access (engaging on an informed basis); interpreters help.', hint:'Informed basis…'}}
  ],
  practice:[
    {id:'U3A1-16-p1', type:'mc', q:'An accused who can\'t afford a lawyer and isn\'t eligible for legal aid most affects:', options:['Equality','Efficiency','Openness only','Nothing'], answer:0, explain:'Equality (and access).'},
    {id:'U3A1-16-p2', type:'tf', q:'The Koori Court is a sentencing court for First Nations offenders who plead guilty.', answer:true, explain:'True.'},
    {id:'U3A1-16-p3', type:'mc', q:'Which response helps with the impact of costs?', options:['Grants of legal aid','Majority verdicts','Victim impact statements','Jury directions'], answer:0, explain:'Legal aid.'},
    {id:'U3A1-16-p4', type:'mc', q:'Which is a way delay harms fairness?', options:['Witnesses\' memories fade','Jurors get paid more','Judges become biased','The burden of proof shifts'], answer:0, explain:'Memories fade.'},
    {id:'U3A1-16-p5', type:'text', q:'Who sits with the magistrate or judge in the Koori Court? Elders or Respected ______.', accept:['persons','people'], explain:'Elders or Respected Persons.'},
    {id:'U3A1-16-p6', type:'tf', q:'"Costs affect efficiency" is a strong link to a principle of justice.', answer:false, explain:'False — efficiency isn\'t a principle.'}
  ],
  check:[
    {id:'U3A1-16-c1', type:'mc', q:'Which three factors does the study design name as affecting the principles of justice in criminal cases?', options:['Costs, time and cultural differences','Juries, judges and lawyers','Bail, remand and appeals','Fines, CCOs and imprisonment'], answer:0, explain:'Costs, time, cultural differences.'},
    {id:'U3A1-16-c2', type:'mc', q:'Language barriers most directly affect:', options:['Access','Efficiency','Specialisation','Deterrence'], answer:0, explain:'Access.'},
    {id:'U3A1-16-c3', type:'tf', q:'The Koori Court decides guilt.', answer:false, explain:'False — sentencing after a guilty plea.'},
    {id:'U3A1-16-c4', type:'mc', q:'Which response reduces delay?', options:['Plea negotiations','Victim impact statements','Majority verdicts in murder trials','Longer trials'], answer:0, explain:'Plea negotiations.'},
    {id:'U3A1-16-c5', type:'mc', q:'Which is the best structure for an answer about these factors?', options:['Factor → specific principle → why','List all factors','Define each principle only','Describe the courts'], answer:0, explain:'Factor → principle → why.'}
  ]
},

/* ============================================================ 17 */
{ id:'U3A1-17', area:'Unit 3 AOS 1 · Sentencing', title:'Purposes of sanctions',
  kk:'The purposes of sanctions: rehabilitation, punishment, deterrence (general and specific), denunciation and protection',
  pretrain:[
    {term:'Sanction', def:'A <span class="key">penalty</span> imposed by a court on an offender.'},
    {term:'Sentencing Act 1991 (Vic)', def:'The Act that sets out the purposes of sentencing and the sanctions courts can use.'}
  ],
  teach:[
    {type:'rule', title:'Five purposes (deterrence has two kinds)', html:`
      <table class="mini"><tr><th>Purpose</th><th>Meaning</th><th>Aimed at</th></tr>
      <tr><td><b>Rehabilitation</b></td><td>Address the <b>underlying cause</b> of offending so the offender changes</td><td>Offender</td></tr>
      <tr><td><b>Punishment</b></td><td>Penalise the offender in a way that is <b>just</b> in the circumstances</td><td>Offender</td></tr>
      <tr><td><b>Specific deterrence</b></td><td>Discourage <b>this offender</b> from reoffending</td><td>Offender</td></tr>
      <tr><td><b>General deterrence</b></td><td>Discourage <b>others in society</b> from offending</td><td>Society</td></tr>
      <tr><td><b>Denunciation</b></td><td>Show the community's <b>disapproval</b> of the offending</td><td>Society</td></tr>
      <tr><td><b>Protection</b></td><td>Protect the <b>community</b> from the offender</td><td>Society</td></tr></table>`},
    {type:'contrast', title:'Specific vs general deterrence',
      examples:[
        {text:'Luke\'s $23,000 fine makes him unlikely to research a case again if he\'s ever on a jury.', why:'Specific deterrence. (2024 scenario.)'},
        {text:'Media coverage of Luke\'s fine discourages other jurors from researching.', why:'General deterrence.'}],
      nonexamples:[
        {text:'"Denunciation means discouraging others."', why:'That is general deterrence. Denunciation is expressing disapproval.'},
        {text:'"Protection means protecting the offender."', why:'No — protecting the community.'},
        {text:'"Punishment and deterrence are the same."', why:'Punishment is a just penalty for the offence; deterrence is about preventing future offending.'}]}
  ],
  worked:[
    {title:'Analysing deterrence', prompt:'Analyse the ability of a fine to achieve general deterrence in Luke\'s case. (2024 Section B Q1e — part)',
     steps:['Define: general deterrence discourages others from offending.','Link: Luke received the maximum fine — 120 penalty units, about $23,000.','Condition: it only deters others if the public knows about it — media coverage helps.','Limit: low awareness of such cases weakens it.'],
     answer:'The large maximum fine can deter others <b>if the public is aware of it</b>; limited publicity weakens general deterrence.'}
  ],
  faded:[
    {title:'Your turn', prompt:'An offender with a drug addiction is ordered to undertake drug treatment as part of their sentence.',
     given:['What is the treatment targeting? The cause of the offending — addiction.'],
     item:{id:'U3A1-17-f1', type:'text', q:'So which purpose is this? (one word)', accept:['rehabilitation','rehabilitate'], explain:'Rehabilitation.', hint:'Addressing the underlying cause.'}}
  ],
  practice:[
    {id:'U3A1-17-p1', type:'mc', q:'Which purpose aims to discourage <b>others</b> from committing similar offences?', options:['General deterrence','Specific deterrence','Rehabilitation','Protection'], answer:0, explain:'General deterrence.'},
    {id:'U3A1-17-p2', type:'mc', q:'Which purpose expresses the community\'s disapproval?', options:['Denunciation','Protection','Rehabilitation','Specific deterrence'], answer:0, explain:'Denunciation.'},
    {id:'U3A1-17-p3', type:'text', q:'Which purpose aims to keep the community safe from the offender?', accept:['protection','protect'], explain:'Protection.'},
    {id:'U3A1-17-p4', type:'mc', q:'Specific deterrence is aimed at:', options:['The offender','Society in general','The victim','The judge'], answer:0, explain:'The offender.'},
    {id:'U3A1-17-p5', type:'tf', q:'Rehabilitation aims to address the underlying cause of the offending.', answer:true, explain:'True.'},
    {id:'U3A1-17-p6', type:'mc', q:'Which Act sets out the purposes of sentencing in Victoria?', options:['Sentencing Act 1991','Juries Act 2000','Evidence Act 2008','Victims\' Charter Act 2006'], answer:0, explain:'Sentencing Act 1991.'}
  ],
  check:[
    {id:'U3A1-17-c1', type:'mc', q:'Luke\'s fine discourages <b>him</b> from repeating the conduct. Which purpose?', options:['Specific deterrence','General deterrence','Denunciation','Protection'], answer:0, src:'2024 Sec B Q1e', explain:'Specific.'},
    {id:'U3A1-17-c2', type:'tf', q:'General deterrence depends partly on public awareness of the sentence.', answer:true, explain:'True.'},
    {id:'U3A1-17-c3', type:'mc', q:'Which is NOT a purpose of sanctions in the study design?', options:['Compensation','Rehabilitation','Denunciation','Protection'], answer:0, explain:'Compensation is a civil remedy purpose.'},
    {id:'U3A1-17-c4', type:'mc', q:'A judge says, "The community condemns violence against police." Which purpose?', options:['Denunciation','Rehabilitation','Specific deterrence','Protection'], answer:0, explain:'Denunciation.'},
    {id:'U3A1-17-c5', type:'text', q:'Which purpose penalises the offender in a way that is just in all the circumstances?', accept:['punishment','punish'], explain:'Punishment.'}
  ]
},

/* ============================================================ 18 */
{ id:'U3A1-18', area:'Unit 3 AOS 1 · Sentencing', title:'Fines, CCOs and imprisonment',
  kk:'Fines, community correction orders and imprisonment, and their specific purposes',
  pretrain:[
    {term:'Fine', def:'A sanction requiring the offender to <span class="key">pay money</span> to the state. Often expressed in <span class="key">penalty units</span>.'},
    {term:'Community correction order (CCO)', def:'A <span class="key">non-custodial</span> sanction served in the community, with conditions.'},
    {term:'Imprisonment', def:'Removing the offender from the community and placing them in <span class="key">prison</span>.'},
    {term:'Non-parole period', def:'The minimum time an offender must serve before being eligible for parole.'}
  ],
  teach:[
    {type:'diagram', title:'The ladder of severity', svg:SVG_SANCTIONS, caption:'Imprisonment is the sanction of last resort.'},
    {type:'rule', title:'Each sanction and its purposes', html:`
      <table class="mini"><tr><th>Sanction</th><th>Key features</th><th>Main purposes</th></tr>
      <tr><td><b>Fine</b></td><td>Amount in penalty units; court considers the offender's <b>financial circumstances</b></td><td>Punishment, deterrence, denunciation</td></tr>
      <tr><td><b>CCO</b></td><td><b>Mandatory conditions</b> (e.g. not reoffend, report to community corrections) plus <b>at least one optional condition</b> (e.g. unpaid community work up to 600 hours, treatment, curfew, supervision)</td><td>Rehabilitation (main); also punishment, protection</td></tr>
      <tr><td><b>Imprisonment</b></td><td>Most severe; <b>last resort</b> — only if no other sanction can achieve the purposes; may have a non-parole period</td><td>Protection, punishment, denunciation, deterrence; rehabilitation through prison programs</td></tr></table>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Emma, convicted of category 2 drug offences, will be sentenced to imprisonment.', why:'For category 2 offences, imprisonment is required unless exceptions apply (e.g. impaired mental functioning, assisting authorities). (2025 scenario.)'},
        {text:'An offender with an alcohol problem gets a CCO with a treatment condition and 200 hours of unpaid work.'}],
      nonexamples:[
        {text:'"Fines are good at rehabilitation."', why:'Fines don\'t address causes of offending.'},
        {text:'"A CCO is served in prison."', why:'It is served in the community.'},
        {text:'"Imprisonment should be the first option considered."', why:'It is the last resort.'}]}
  ],
  worked:[
    {title:'Explaining a sanction', prompt:'Explain the sanction the judge will impose on Emma. (2025 Section B Q1c — part)',
     steps:['Identify: imprisonment — category 2 offences require it unless exceptions apply.','Check exceptions: no evidence she was under 18, has impaired mental functioning or assisted authorities.','Explain what it is: deprivation of liberty, removal from the community, regimented life. The examiners noted many students forgot this step.'],
     answer:'<b>Imprisonment</b> — required for category 2 offences with no exception apparent; it removes Emma\'s liberty and separates her from the community.'}
  ],
  faded:[
    {title:'Your turn', prompt:'A wealthy company director is fined $500 for a minor offence.',
     given:['Purpose to test: specific deterrence.','Consider the offender\'s circumstances: very wealthy.'],
     item:{id:'U3A1-18-f1', type:'mc', q:'So how well does the fine achieve specific deterrence?', options:['Poorly — the amount is trivial for him','Very well — all fines deter','Perfectly — it rehabilitates him','It protects the community'], answer:0, explain:'A small fine has little impact on a wealthy offender.', hint:'Would he notice $500?'}}
  ],
  practice:[
    {id:'U3A1-18-p1', type:'mc', q:'Which sanction is the "last resort"?', options:['Imprisonment','Fine','CCO','None'], answer:0, explain:'Imprisonment.'},
    {id:'U3A1-18-p2', type:'text', q:'Fines in Victoria are often expressed in ______ units.', accept:['penalty'], explain:'Penalty units.'},
    {id:'U3A1-18-p3', type:'mc', q:'The main purpose of a CCO is usually:', options:['Rehabilitation','Protection by imprisonment','Compensation','Denunciation only'], answer:0, explain:'Rehabilitation.'},
    {id:'U3A1-18-p4', type:'tf', q:'A CCO must include at least one optional condition.', answer:true, explain:'True.'},
    {id:'U3A1-18-p5', type:'mc', q:'The maximum unpaid community work under a CCO is:', options:['600 hours','60 hours','6000 hours','No limit'], answer:0, explain:'600 hours.'},
    {id:'U3A1-18-p6', type:'mc', q:'Which purpose is imprisonment best at?', options:['Protection','Rehabilitation','Compensation','Reconciliation'], answer:0, explain:'Protection.'}
  ],
  check:[
    {id:'U3A1-18-c1', type:'mc', q:'Emma committed category 2 offences with no exceptions. Which sanction?', options:['Imprisonment','A fine','A CCO','No sanction'], answer:0, src:'2025 Sec B Q1c', explain:'Imprisonment.'},
    {id:'U3A1-18-c2', type:'tf', q:'Courts must consider an offender\'s financial circumstances when setting a fine.', answer:true, explain:'True.'},
    {id:'U3A1-18-c3', type:'text', q:'The minimum time to be served before parole eligibility is the non-______ period.', accept:['parole'], explain:'Non-parole period.'},
    {id:'U3A1-18-c4', type:'mc', q:'Which is a mandatory CCO condition?', options:['Not committing an offence punishable by imprisonment during the order','Curfew','Alcohol treatment','Unpaid community work'], answer:0, explain:'The others are optional.'},
    {id:'U3A1-18-c5', type:'mc', q:'Which is a weakness of fines?', options:['Less impact on wealthy offenders','They always rehabilitate','They remove liberty','They last for years'], answer:0, explain:'Less impact on the wealthy.'}
  ]
},

/* ============================================================ 19 */
{ id:'U3A1-19', area:'Unit 3 AOS 1 · Sentencing', title:'Aggravating and mitigating factors',
  kk:'Factors considered in sentencing: aggravating factors and mitigating factors',
  pretrain:[
    {term:'Aggravating factor', def:'A circumstance that makes the offence <span class="key">more serious</span> → may <span class="key">increase</span> the sentence.'},
    {term:'Mitigating factor', def:'A circumstance that <span class="key">reduces culpability</span> → may <span class="key">decrease</span> the sentence.'},
    {term:'Culpability', def:'How blameworthy the offender is.'}
  ],
  teach:[
    {type:'contrast', title:'Aggravating factors', rule:'Ask: does this make the offending <b>worse</b>?',
      examples:[
        {text:'A weapon was used.'},{text:'The victim was vulnerable (e.g. elderly, a child).'},{text:'The offence was planned.'},
        {text:'The offender acted in company (with others).'},{text:'The offender has relevant prior convictions.'},{text:'The offence was motivated by hatred of a group.'}],
      nonexamples:[
        {text:'Emma pleaded not guilty.', why:'Not aggravating. An accused can\'t be penalised for making the prosecution prove its case. The 2025 examiners rejected this.'},
        {text:'The offender showed genuine remorse.', why:'Mitigating, not aggravating.'}]},
    {type:'contrast', title:'Mitigating factors', rule:'Ask: does this make the offender <b>less blameworthy</b> or show good prospects?',
      examples:[
        {text:'Genuine remorse.'},{text:'No prior convictions / good character.'},{text:'Youth.'},{text:'Good prospects of rehabilitation.'},
        {text:'Mental impairment or a difficult background linked to the offending.'},{text:'Cooperating with police.'}],
      nonexamples:[
        {text:'"The offender is famous."', why:'Not mitigating in itself.'},
        {text:'"The victim was vulnerable."', why:'Aggravating.'}]}
  ],
  worked:[
    {title:'Classify and explain', prompt:'Jai, convicted of attempted murder, planned the attack for weeks and has two prior convictions for violence. (Based on 2024 scenario)',
     steps:['Planning → the offending is more deliberate → aggravating.','Prior violence convictions → aggravating.','Effect: both may lead the judge to impose a longer term of imprisonment.'],
     answer:'Both <b>planning</b> and <b>prior convictions</b> are <b>aggravating</b> — likely to increase Jai\'s sentence.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Ruby, 19, has no prior convictions, apologised to the victim and has started counselling.',
     given:['Youth → reduces culpability.','No priors and remorse → good character, remorse.'],
     item:{id:'U3A1-19-f1', type:'mc', q:'So these are…', options:['Mitigating factors','Aggravating factors','Neither','Purposes of sanctions'], answer:0, explain:'Mitigating.', hint:'Do they make the sentence lighter or heavier?'}}
  ],
  practice:[
    {id:'U3A1-19-p1', type:'mc', q:'Using a weapon is a(n):', options:['Aggravating factor','Mitigating factor','Purpose of sanctions','Type of sanction'], answer:0, explain:'Aggravating.'},
    {id:'U3A1-19-p2', type:'mc', q:'Genuine remorse is a(n):', options:['Mitigating factor','Aggravating factor','Sanction','Right'], answer:0, explain:'Mitigating.'},
    {id:'U3A1-19-p3', type:'tf', q:'Pleading not guilty is an aggravating factor.', answer:false, explain:'False — can\'t be penalised for going to trial.'},
    {id:'U3A1-19-p4', type:'text', q:'A factor that may decrease a sentence is a ______ factor.', accept:['mitigating','mitigation'], explain:'Mitigating.'},
    {id:'U3A1-19-p5', type:'mc', q:'Which is aggravating?', options:['The victim was a young child','The offender is 18','The offender cooperated with police','The offender has no priors'], answer:0, explain:'Vulnerable victim.'},
    {id:'U3A1-19-p6', type:'mc', q:'Which is mitigating?', options:['Good prospects of rehabilitation','Acting in company','Planning','Motivated by hatred'], answer:0, explain:'Rehabilitation prospects.'}
  ],
  check:[
    {id:'U3A1-19-c1', type:'mc', q:'Emma pleaded not guilty and was convicted. How does her not guilty plea affect her sentence?', options:['It is not an aggravating factor','It increases her sentence','It is mitigating','It makes imprisonment impossible'], answer:0, src:'2025 Sec B Q1c', explain:'She can\'t be penalised for exercising her rights.'},
    {id:'U3A1-19-c2', type:'text', q:'A factor that may increase a sentence is an ______ factor.', accept:['aggravating','aggravation'], explain:'Aggravating.'},
    {id:'U3A1-19-c3', type:'mc', q:'Which pair is correctly classified?', options:['Prior convictions — aggravating; youth — mitigating','Prior convictions — mitigating; youth — aggravating','Both aggravating','Both mitigating'], answer:0, explain:'Correct.'},
    {id:'U3A1-19-c4', type:'tf', q:'Cooperating with police can be a mitigating factor.', answer:true, explain:'True.'},
    {id:'U3A1-19-c5', type:'mc', q:'Acting in company means:', options:['Offending with others','Offending at work','Offending alone','Offending online'], answer:0, explain:'With others — aggravating.'}
  ]
},

/* ============================================================ 20 */
{ id:'U3A1-20', area:'Unit 3 AOS 1 · Sentencing', title:'Guilty pleas and victim impact statements',
  kk:'Factors considered in sentencing: guilty pleas and victim impact statements',
  pretrain:[
    {term:'Guilty plea', def:'The accused formally admits the offence. Courts must consider it, and it may <span class="key">reduce</span> the sentence.'},
    {term:'Victim impact statement (VIS)', def:'A written or oral statement to the court by the victim (or their family) describing the <span class="key">impact</span> of the offence on them.'}
  ],
  teach:[
    {type:'rule', title:'Guilty pleas', html:`
      <p>A guilty plea may <b>reduce</b> the sentence — especially an <b>early</b> plea — because it:</p>
      <p>① saves <b>time and cost</b>, ② spares victims and witnesses from giving evidence, ③ may show <b>remorse</b>.</p>
      <p>The judge must <b>state</b> the sentence they would have imposed without the guilty plea — making the discount <b>transparent</b>.</p>`},
    {type:'rule', title:'Victim impact statements', html:`
      <p>Made by the victim (or family), in writing or read aloud, at <b>sentencing</b>. Describes the <b>emotional, physical and financial</b> impact of the crime. It is one factor the judge <b>considers</b>.</p>
      <p><span class="key">Precision point (2024 report):</span> the VIS itself is not an aggravating or mitigating factor — the <b>harm it describes</b> may aggravate. A VIS could also express forgiveness.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Georgia describes her ongoing trauma and physical disability after Jai\'s attack; the judge takes this into account.', why:'VIS. (2024 scenario.)'},
        {text:'An offender pleads guilty at the first opportunity and receives a reduced sentence.', why:'Early guilty plea.'}],
      nonexamples:[
        {text:'"The victim tells the court how many years the offender should get, and the judge must follow it."', why:'The judge decides; the VIS describes impact.'},
        {text:'"A VIS is used to decide guilt."', why:'It is used at sentencing — after guilt is established.'},
        {text:'"A guilty plea always halves the sentence."', why:'No fixed discount; the judge decides.'}]}
  ],
  worked:[
    {title:'Explaining a VIS', prompt:'Explain what a victim impact statement is and how it may be considered when sentencing Jai. (2024 Section A Q2)',
     steps:['Define: a statement by the victim (Georgia) or family describing the impact of the crime.','When: at sentencing, after Jai\'s conviction.','How considered: helps the judge understand the harm; serious, lasting harm may lead to a harsher sentence.'],
     answer:'A VIS lets Georgia describe the impact of Jai\'s offending. The judge <b>considers</b> the harm it describes, which may increase the sentence.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Tom pleads guilty on the morning his trial was due to start, after witnesses had already been prepared.',
     given:['A guilty plea can reduce a sentence.','The timing matters — earlier pleas save more.'],
     item:{id:'U3A1-20-f1', type:'mc', q:'Compared with an early plea, Tom\'s late plea is likely to bring:', options:['A smaller reduction','A larger reduction','No consideration at all','An increased sentence'], answer:0, explain:'Less time and stress saved → smaller discount.', hint:'What does an early plea save?'}}
  ],
  practice:[
    {id:'U3A1-20-p1', type:'mc', q:'When is a VIS used?', options:['At sentencing','At committal','During jury deliberations','Before charges are laid'], answer:0, explain:'Sentencing.'},
    {id:'U3A1-20-p2', type:'tf', q:'A VIS can be made by a victim\'s family.', answer:true, explain:'True.'},
    {id:'U3A1-20-p3', type:'mc', q:'Why may a guilty plea reduce a sentence?', options:['It saves time and spares victims from giving evidence','It proves the offender is innocent','It allows the jury to go home','It is required by the Constitution'], answer:0, explain:'Saves time; spares victims.'},
    {id:'U3A1-20-p4', type:'tf', q:'The judge must state what sentence would have been imposed without the guilty plea.', answer:true, explain:'True — transparency.'},
    {id:'U3A1-20-p5', type:'mc', q:'A VIS describes:', options:['The impact of the offence on the victim','The evidence of guilt','The offender\'s prior convictions','The jury\'s verdict'], answer:0, explain:'Impact.'},
    {id:'U3A1-20-p6', type:'tf', q:'The judge must impose the sentence the victim asks for.', answer:false, explain:'False.'}
  ],
  check:[
    {id:'U3A1-20-c1', type:'mc', q:'Georgia gives a VIS at Jai\'s sentencing. What is its role?', options:['A factor the judge considers in sentencing','It decides Jai\'s guilt','It sets the maximum penalty','It replaces the judge\'s decision'], answer:0, src:'2024 Sec A Q2', explain:'Considered at sentencing.'},
    {id:'U3A1-20-c2', type:'tf', q:'An early guilty plea generally attracts a greater reduction than a late one.', answer:true, explain:'True.'},
    {id:'U3A1-20-c3', type:'mc', q:'Strictly, what may be aggravating in relation to a VIS?', options:['The harm it describes','The fact that a statement was made','The victim\'s handwriting','Nothing'], answer:0, explain:'The harm — not the statement itself.'},
    {id:'U3A1-20-c4', type:'text', q:'VIS stands for victim ______ statement.', accept:['impact'], explain:'Impact.'},
    {id:'U3A1-20-c5', type:'mc', q:'Which is a reason a guilty plea may show remorse?', options:['The offender accepts responsibility','The offender saves money','The jury is discharged','The victim is absent'], answer:0, explain:'Accepting responsibility.'}
  ]
},

/* ============================================================ U3A2-01 */
{ id:'U3A2-01', area:'Unit 3 AOS 2 · Civil justice system', title:'Civil disputes: key concepts',
  kk:'Key principles in the Victorian civil justice system, including the burden of proof and the standard of proof',
  pretrain:[
    {term:'Civil dispute', def:'A disagreement between <span class="key">individuals or groups</span> in which one party claims the other has <span class="key">infringed their rights</span>.'},
    {term:'Plaintiff', def:'The party who <span class="key">brings</span> the civil claim (sues).'},
    {term:'Defendant', def:'The party being <span class="key">sued</span>.'},
    {term:'Liability', def:'Legal responsibility. In a civil case the defendant is found <span class="key">liable</span> or <span class="key">not liable</span> — not "guilty".'},
    {term:'Remedy', def:'An order designed to <span class="key">address the harm</span> to the plaintiff — e.g. damages (money).'}
  ],
  teach:[
    {type:'rule', title:'Civil vs criminal — side by side', html:`
      <table class="mini"><tr><th></th><th>Criminal</th><th>Civil</th></tr>
      <tr><td>Who brings it?</td><td>Prosecution (the state)</td><td><b>Plaintiff</b> (the wronged party)</td></tr>
      <tr><td>Against whom?</td><td>Accused</td><td><b>Defendant</b></td></tr>
      <tr><td>Burden of proof</td><td>Prosecution</td><td><b>Plaintiff</b></td></tr>
      <tr><td>Standard of proof</td><td>Beyond reasonable doubt</td><td><b>On the balance of probabilities</b></td></tr>
      <tr><td>Outcome</td><td>Guilty / not guilty</td><td><b>Liable / not liable</b></td></tr>
      <tr><td>Result</td><td>Sanction (e.g. fine, prison)</td><td><b>Remedy</b> (e.g. damages)</td></tr></table>
      <p>Main aim of the civil system: to <b>restore the plaintiff</b> as far as possible to the position they were in before the wrong.</p>`},
    {type:'contrast', title:'Use the right vocabulary',
      rule:'Examiners penalise criminal words in civil answers.',
      examples:[
        {text:'"Grant was found liable and ordered to pay Andy damages."', why:'Correct civil terms. (2025 scenario.)'},
        {text:'"Louise\'s clients, as plaintiffs, must prove their claim on the balance of probabilities."', why:'Correct party, burden and standard. (2024 scenario.)'}],
      nonexamples:[
        {text:'"The defendant was found guilty of negligence."', why:'Civil: liable, not guilty.'},
        {text:'"The plaintiff received a sanction."', why:'Sanctions are criminal. The plaintiff seeks a remedy.'},
        {text:'"The accused was sued."', why:'In a civil case, the person sued is the defendant.'}]}
  ],
  worked:[
    {title:'Translating a scenario', prompt:'Agu and Kim are considering suing Emma for the cost of rebuilding their property. Identify the parties, who has the burden, and the standard. (2025 scenario)',
     steps:['Who would bring the claim? Agu and Kim → plaintiffs.','Who would be sued? Emma → defendant.','Burden: the party who brings the case → Agu and Kim.','Standard: civil → on the balance of probabilities.'],
     answer:'Plaintiffs <b>Agu and Kim</b> would bear the burden and must prove the claim <b>on the balance of probabilities</b> against defendant <b>Emma</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'A court decides that a builder did not breach her contract with a homeowner.',
     given:['This is a civil case: homeowner (plaintiff) v builder (defendant).','The court found in the builder\'s favour.'],
     item:{id:'U3A2-01-f1', type:'mc', q:'So the correct way to describe the outcome is:', options:['The builder was found not liable','The builder was found not guilty','The builder was acquitted','The builder was sentenced'], answer:0, explain:'Civil outcomes: liable / not liable.', hint:'Civil word for "responsible".'}}
  ],
  practice:[
    {id:'U3A2-01-p1', type:'text', q:'The party who brings a civil claim is the ______.', accept:['plaintiff','plaintiffs'], explain:'Plaintiff.'},
    {id:'U3A2-01-p2', type:'text', q:'The party being sued is the ______.', accept:['defendant','defendants'], explain:'Defendant.'},
    {id:'U3A2-01-p3', type:'mc', q:'In a civil case, the defendant may be found:', options:['Liable or not liable','Guilty or not guilty','Convicted or acquitted','Sentenced or released'], answer:0, explain:'Liable / not liable.'},
    {id:'U3A2-01-p4', type:'mc', q:'What is the main aim of a civil remedy?', options:['To restore the plaintiff to their original position as far as possible','To punish the defendant','To deter the community','To protect the community from the defendant'], answer:0, explain:'Restoration.'},
    {id:'U3A2-01-p5', type:'tf', q:'The standard of proof in a civil case is on the balance of probabilities.', answer:true, explain:'True.'},
    {id:'U3A2-01-p6', type:'tf', q:'In a civil case the plaintiff receives a sanction.', answer:false, explain:'False — sanctions are criminal; the plaintiff seeks a remedy.'}
  ],
  check:[
    {id:'U3A2-01-c1', type:'mc', q:'Which sentence uses civil terms correctly?', options:['The defendant was found liable and ordered to pay damages','The defendant was found guilty and fined','The accused was found liable','The plaintiff was convicted'], answer:0, explain:'Liable + damages.'},
    {id:'U3A2-01-c2', type:'mc', q:'Andy sues Grant for pain and suffering. Who has the burden of proof?', options:['Andy, the plaintiff','Grant, the defendant','The prosecution','The judge'], answer:0, explain:'The plaintiff.'},
    {id:'U3A2-01-c3', type:'text', q:'An order designed to address the harm suffered by the plaintiff is called a ______.', accept:['remedy','remedies'], explain:'Remedy.'},
    {id:'U3A2-01-c4', type:'tf', q:'"Liability" means legal responsibility.', answer:true, explain:'True.'},
    {id:'U3A2-01-c5', type:'mc', q:'Which pair belongs to the civil justice system?', options:['Plaintiff and defendant','Prosecution and accused','Prosecution and defendant','Plaintiff and accused'], answer:0, explain:'Plaintiff and defendant.'}
  ]
},

/* ============================================================ U3A2-02 */
{ id:'U3A2-02', area:'Unit 3 AOS 2 · Civil justice system', title:'Before suing: costs, limitation of actions, enforcement',
  kk:'Factors to consider before initiating a civil claim, including costs, limitation of actions and enforcement issues',
  pretrain:[
    {term:'Limitation of actions', def:'The <span class="key">time limit</span> within which a civil claim must be started.'},
    {term:'Enforcement issues', def:'Whether the plaintiff will actually be able to <span class="key">obtain the remedy</span> if they win — e.g. whether the defendant can pay.'},
    {term:'Costs', def:'Lawyers\' fees, court fees, expert reports — and the risk of paying the <span class="key">other side\'s costs</span> if you lose.'}
  ],
  teach:[
    {type:'rule', title:'Three questions to ask before suing', html:`
      <p>The study design names <b>three</b> factors. Learn exactly these three.</p>
      <table class="mini"><tr><th>Factor</th><th>The question</th><th>Why it matters</th></tr>
      <tr><td><b>Costs</b></td><td>Can I afford it — and the risk of losing?</td><td>Generally the <b>losing party pays</b> much of the winner's legal costs. Costs may outweigh the amount claimed.</td></tr>
      <tr><td><b>Limitation of actions</b></td><td>Am I still within time?</td><td>If the time limit has passed, the claim may be <b>barred</b>. Set by the <i>Limitation of Actions Act 1958</i> (Vic).</td></tr>
      <tr><td><b>Enforcement issues</b></td><td>If I win, will I actually get the remedy?</td><td>A defendant with no money or assets may be unable to pay — the win may be worthless.</td></tr></table>
      <p class="muted">Exam note (2025 report): when a question asks about <b>enforcement issues</b>, answers about cost, time or limitation of actions earned little or nothing. Answer the factor you are asked about.</p>`},
    {type:'rule', title:'Limitation periods (common examples)', html:`
      <p>Generally <b>6 years</b> for breach of contract and most torts (e.g. property damage).</p>
      <p>Personal injury: generally <b>3 years</b> from when the injury was discovered.</p>
      <p>Defamation: generally <b>1 year</b> from publication.</p>
      <p><b>Why have time limits?</b> Evidence deteriorates and memories fade; defendants shouldn't face a claim hanging over them forever. Courts may extend some periods in limited circumstances.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Agu and Kim consider whether Emma, now in prison, has any assets to pay for their rebuilding.', why:'Enforcement issues. (2025 scenario.)'},
        {text:'Vanderstock and Davies had to weigh legal fees, High Court filing fees and the risk of an adverse costs order before suing Victoria.', why:'Costs — partly offset because the Commonwealth supported them. (2024 exam scenario.)'}],
      nonexamples:[
        {text:'"Limitation of actions means the court limits how much compensation can be awarded."', why:'No — it is a time limit on starting a claim.'},
        {text:'"Enforcement issues means police enforce the judgment."', why:'No — it is about whether the plaintiff can practically recover the remedy.'},
        {text:'"Negotiation is one of the study design\'s factors to consider before initiating a claim."', why:'No — the study design lists costs, limitation of actions and enforcement issues. Negotiation is a sensible step, but not one of the three.'}]}
  ],
  worked:[
    {title:'Applying a factor', prompt:'Explain one factor Agu and Kim should consider before suing Emma. (2025 scenario)',
     steps:['Pick one factor: enforcement issues (2025 Section B Q1d).','Explain it: even if they win, they need Emma to be able to pay the damages.','Apply the sources: all of Emma\'s assets were seized as proceeds of crime, and her category 2 offences mean imprisonment — so no income either.','Consequence: they may pay hefty legal fees and recover nothing.'],
     answer:'<b>Enforcement issues</b>: with her assets seized and no income in prison, Emma is unlikely to be able to pay, so a successful claim may bring Agu and Kim no actual compensation.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Liam was injured at a gym in 2019. He discovered the injury straight away. It is now 2026 and he wants to sue.',
     given:['Factor to check: the time limit for personal injury.','Personal injury is generally 3 years from discovery; about 7 years have passed.'],
     item:{id:'U3A2-02-f1', type:'mc', q:'So which factor is the main obstacle?', options:['Limitation of actions','Enforcement issues','Costs','Class actions'], answer:0, explain:'The time limit has likely expired.', hint:'Time limit.'}}
  ],
  practice:[
    {id:'U3A2-02-p1', type:'mc', q:'Which factor asks whether the defendant can actually pay if the plaintiff wins?', options:['Enforcement issues','Limitation of actions','Costs','Mediation'], answer:0, explain:'Enforcement issues.'},
    {id:'U3A2-02-p2', type:'text', q:'The time limit within which a civil claim must be started is called the limitation of ______.', accept:['actions','action'], explain:'Limitation of actions.'},
    {id:'U3A2-02-p3', type:'mc', q:'Generally, the limitation period for breach of contract in Victoria is:', options:['6 years','1 year','3 months','No limit'], answer:0, explain:'6 years.'},
    {id:'U3A2-02-p4', type:'tf', q:'In civil cases, the losing party is often ordered to pay much of the winning party\'s legal costs.', answer:true, explain:'True — a major cost risk.'},
    {id:'U3A2-02-p5', type:'mc', q:'Which is NOT one of the three factors to consider before initiating a civil claim in the study design?', options:['Negotiation','Costs','Limitation of actions','Enforcement issues'], answer:0, explain:'The three are costs, limitation of actions and enforcement issues.'},
    {id:'U3A2-02-p6', type:'mc', q:'Why do limitation periods exist?', options:['Evidence deteriorates over time','To raise court revenue','To stop defendants appealing','To give juries less work'], answer:0, explain:'Evidence and fairness to defendants.'}
  ],
  check:[
    {id:'U3A2-02-c1', type:'mc', q:'Which list contains the three factors in the study design?', options:['Costs, limitation of actions, enforcement issues','Mediation, conciliation, arbitration, VCAT','Damages, injunctions, costs, time','Burden, standard, liability, remedy'], answer:0, explain:'Costs, limitation of actions, enforcement issues.'},
    {id:'U3A2-02-c2', type:'mc', q:'Agu and Kim worry Emma has no assets. Which factor?', options:['Enforcement issues','Limitation of actions','Costs','Class actions'], answer:0, src:'2025 Sec B Q1d', explain:'Enforcement.'},
    {id:'U3A2-02-c3', type:'tf', q:'An adverse costs order means the losing party may have to pay some or all of the winning party\'s legal costs.', answer:true, src:'2024 Sec B Q2e', explain:'True — a key part of the costs factor.'},
    {id:'U3A2-02-c4', type:'text', q:'Which Victorian Act sets limitation periods? The Limitation of Actions Act ______ (year).', accept:['1958'], explain:'1958.'},
    {id:'U3A2-02-c5', type:'mc', q:'Which is the best description of the "costs" factor?', options:['Legal fees plus the risk of paying the other side\'s costs if you lose','The amount of damages claimed','The fine imposed on the defendant','The cost of imprisonment'], answer:0, explain:'Fees + adverse costs risk.'}
  ]
},

/* ============================================================ U3A2-03 */
{ id:'U3A2-03', area:'Unit 3 AOS 2 · Civil justice system', title:'Mediation, conciliation and arbitration',
  kk:'The purposes and appropriateness of dispute resolution methods: mediation, conciliation and arbitration',
  pretrain:[
    {term:'Mediation', def:'An independent third party (mediator) <span class="key">helps the parties reach their own resolution</span>. The mediator does <span class="key">not</span> make suggestions or decisions.'},
    {term:'Conciliation', def:'An independent third party (conciliator) helps the parties reach a resolution and <span class="key">can make suggestions</span> — but does not decide.'},
    {term:'Arbitration', def:'An independent third party (arbitrator) <span class="key">makes a binding decision</span> (an arbitral award) after hearing both sides.'}
  ],
  teach:[
    {type:'diagram', title:'How much power does the third party have?', svg:SVG_ADR, caption:'Moving right, the third party has more control and the parties have less.'},
    {type:'rule', title:'Purposes and when each is appropriate', html:`
      <table class="mini"><tr><th>Method</th><th>Purpose</th><th>Appropriate when…</th><th>Not appropriate when…</th></tr>
      <tr><td><b>Mediation</b></td><td>Help the parties find their <b>own</b> solution</td><td>Parties want to preserve a relationship; willing to compromise</td><td>Power imbalance; family violence; one party won't cooperate</td></tr>
      <tr><td><b>Conciliation</b></td><td>Help the parties resolve it, using the conciliator's <b>expertise</b></td><td>Parties need guidance from someone who knows the area</td><td>Power imbalance; parties want a binding decision</td></tr>
      <tr><td><b>Arbitration</b></td><td>Give a <b>binding</b>, final decision, usually faster and more private than court</td><td>Parties can't agree but want a decision without a full trial</td><td>Complex legal questions; parties want to appeal on the merits</td></tr></table>
      <p>Mediated and conciliated outcomes are generally binding <b>only if the parties sign a settlement agreement</b>.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'A mediator listens to two neighbours about a fence and helps them agree to share the cost.', why:'Mediation — they decide.'},
        {text:'A conciliator at CAV suggests a retailer offer a partial refund.', why:'Conciliation — suggestions allowed.'},
        {text:'A Magistrates\' Court arbitrator hears a $6,000 claim and makes an award.', why:'Arbitration — a binding decision.'}],
      nonexamples:[
        {text:'"The mediator decided the landlord must pay $2,000."', why:'Mediators don\'t decide.'},
        {text:'"Conciliation produces a binding decision imposed by the conciliator."', why:'Conciliators only suggest.'},
        {text:'"Negotiation is a form of arbitration."', why:'Negotiation has no third party at all.'}]}
  ],
  worked:[
    {title:'Choosing a method', prompt:'Two business partners want to keep working together but disagree about profit sharing. Which method is most appropriate?',
     steps:['Key fact: they want to preserve the relationship.','Methods where parties keep control → mediation or conciliation.','Neither needs specialist advice → mediation fits.','Arbitration would impose a decision and may harm the relationship.'],
     answer:'<b>Mediation</b> — the parties stay in control and can preserve their working relationship.'}
  ],
  faded:[
    {title:'Your turn', prompt:'A consumer and a car dealer can\'t agree after several meetings. Both want someone to make a final, binding decision without a full court trial.',
     given:['They have already tried to reach agreement and failed.','They want a binding decision from a third party.'],
     item:{id:'U3A2-03-f1', type:'text', q:'So which method fits? (one word)', accept:['arbitration','arbitrate'], explain:'Arbitration gives a binding decision.', hint:'Third party decides.'}}
  ],
  practice:[
    {id:'U3A2-03-p1', type:'mc', q:'In which method does the third party make a binding decision?', options:['Arbitration','Mediation','Conciliation','Negotiation'], answer:0, explain:'Arbitration.'},
    {id:'U3A2-03-p2', type:'mc', q:'Which third party can make suggestions but not decide?', options:['Conciliator','Mediator','Arbitrator','Judge'], answer:0, explain:'Conciliator.'},
    {id:'U3A2-03-p3', type:'tf', q:'A mediator can tell the parties what the outcome should be.', answer:false, explain:'False — mediators facilitate only.'},
    {id:'U3A2-03-p4', type:'mc', q:'When is mediation least appropriate?', options:['Where there is a significant power imbalance between the parties','Where parties want to preserve a relationship','Where parties are willing to compromise','Where the dispute is simple'], answer:0, explain:'Power imbalance.'},
    {id:'U3A2-03-p5', type:'text', q:'The decision made by an arbitrator is called an arbitral ______.', accept:['award'], explain:'Award.'},
    {id:'U3A2-03-p6', type:'mc', q:'Which method gives the parties the MOST control over the outcome?', options:['Mediation','Arbitration','Conciliation','A court hearing'], answer:0, explain:'Mediation (of those with a third party).'}
  ],
  check:[
    {id:'U3A2-03-c1', type:'mc', q:'Which correctly matches method and third-party role?', options:['Mediation — facilitates; conciliation — suggests; arbitration — decides','Mediation — decides; conciliation — facilitates; arbitration — suggests','All three decide','None of them involve a third party'], answer:0, explain:'Facilitate / suggest / decide.'},
    {id:'U3A2-03-c2', type:'mc', q:'A Magistrates\' Court hears a small claim using an arbitrator who makes a binding award. This is:', options:['Arbitration','Mediation','Conciliation','Negotiation'], answer:0, explain:'Arbitration.'},
    {id:'U3A2-03-c3', type:'tf', q:'Mediated agreements are generally binding only if the parties sign a settlement agreement.', answer:true, explain:'True.'},
    {id:'U3A2-03-c4', type:'text', q:'Which method uses a third party with expertise who can suggest solutions? (one word)', accept:['conciliation','conciliate'], explain:'Conciliation.'},
    {id:'U3A2-03-c5', type:'mc', q:'Which situation is LEAST suited to mediation?', options:['A dispute involving family violence','Neighbours arguing about a tree','Business partners disagreeing about profits','Siblings arguing about a car'], answer:0, explain:'Power imbalance and safety concerns.'}
  ]
},

/* ============================================================ U3A2-04 */
{ id:'U3A2-04', area:'Unit 3 AOS 2 · Civil justice system', title:'Consumer Affairs Victoria',
  kk:'The role of Consumer Affairs Victoria in resolving civil disputes',
  pretrain:[
    {term:'Consumer Affairs Victoria (CAV)', def:'A Victorian government body that provides <span class="key">free</span> information, advice and dispute resolution for <span class="key">consumer and tenancy</span> disputes.'},
    {term:'Consumer', def:'A person who buys goods or services for personal use.'},
    {term:'Australian Consumer Law', def:'National law setting out consumer rights — e.g. goods must be of acceptable quality.'}
  ],
  teach:[
    {type:'rule', title:'What CAV does', html:`
      <p>① <b>Information and advice</b> — about consumer and tenancy rights (website, phone).</p>
      <p>② <b>Dispute resolution</b> — CAV can help resolve eligible disputes between consumers and traders, and between tenants and landlords, mainly through <b>conciliation</b> (by phone or in writing).</p>
      <p>③ CAV <b>cannot force</b> a party to take part, and <b>cannot make a binding decision</b> or award compensation.</p>
      <p>If CAV can't resolve it, the dispute may go to <b>VCAT</b>.</p>`},
    {type:'rule', title:'Strengths and weaknesses', html:`
      <table class="mini"><tr><th>Strengths</th><th>Weaknesses</th></tr>
      <tr><td><b>Free</b> → access, equality</td><td><b>Can't compel</b> a trader to participate</td></tr>
      <tr><td>Informal, no lawyers needed</td><td><b>No binding decision</b> — may need VCAT anyway</td></tr>
      <tr><td>Quick for simple disputes</td><td>Limited to certain kinds of disputes; may not handle complex claims</td></tr>
      <tr><td>Information helps people engage on an informed basis → <b>access</b></td><td>Many people don't know CAV exists</td></tr></table>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'A consumer whose new laptop failed after a month phones CAV, which contacts the retailer and helps negotiate a replacement.', why:'CAV dispute assistance.'},
        {text:'A tenant reads CAV\'s guide on bond refunds.', why:'Information → access.'}],
      nonexamples:[
        {text:'"CAV ordered the retailer to pay $3,000 compensation."', why:'CAV cannot make binding orders.'},
        {text:'"CAV provides legal representation to accused people."', why:'No — that is VLA. The 2025 examiners noted students confusing these bodies.'},
        {text:'"CAV hears personal injury claims."', why:'No — consumer and tenancy disputes.'}]}
  ],
  worked:[
    {title:'Evaluating CAV', prompt:'Ava\'s new fridge broke. The retailer refuses to help. Evaluate CAV as a way for Ava to resolve this.',
     steps:['Strength: free and informal → Ava doesn\'t need a lawyer (access).','Strength: CAV conciliators know consumer law and can suggest a fair outcome.','Weakness: if the retailer refuses to participate, CAV can\'t force it.','Weakness: no binding decision — Ava may still need to go to VCAT.'],
     answer:'CAV is a <b>free, accessible first step</b>, but its lack of <b>compulsion</b> and <b>binding power</b> means Ava may need VCAT.'}
  ],
  faded:[
    {title:'Your turn', prompt:'A trader ignores all of CAV\'s attempts to contact them about a customer\'s complaint.',
     given:['CAV relies on voluntary participation.'],
     item:{id:'U3A2-04-f1', type:'mc', q:'What is the customer\'s most likely next step?', options:['Apply to VCAT','Ask CAV to fine the trader','Ask CAV for a binding order','Report it to the jury'], answer:0, explain:'VCAT can make binding orders.', hint:'Which body can make binding decisions in consumer disputes?'}}
  ],
  practice:[
    {id:'U3A2-04-p1', type:'tf', q:'CAV\'s dispute assistance is free.', answer:true, explain:'True.'},
    {id:'U3A2-04-p2', type:'tf', q:'CAV can make binding orders requiring a trader to pay compensation.', answer:false, explain:'False.'},
    {id:'U3A2-04-p3', type:'mc', q:'Which types of disputes does CAV mainly help with?', options:['Consumer and tenancy disputes','Criminal trials','Personal injury claims','Defamation'], answer:0, explain:'Consumer and tenancy.'},
    {id:'U3A2-04-p4', type:'mc', q:'Which method does CAV mainly use?', options:['Conciliation','Arbitration','Jury trial','Mediation by a judge'], answer:0, explain:'Conciliation.'},
    {id:'U3A2-04-p5', type:'mc', q:'A key weakness of CAV is that it:', options:['Cannot compel a party to participate','Is very expensive','Requires lawyers','Only hears criminal cases'], answer:0, explain:'No compulsion.'},
    {id:'U3A2-04-p6', type:'mc', q:'CAV\'s free information most directly supports:', options:['Access','Specialisation','Deterrence','Openness'], answer:0, explain:'Informed basis → access.'}
  ],
  check:[
    {id:'U3A2-04-c1', type:'mc', q:'Which statement about CAV is correct?', options:['It provides free information and dispute assistance but cannot make binding decisions','It is a court that hears consumer cases','It provides grants of legal aid','It awards damages'], answer:0, explain:'Correct.'},
    {id:'U3A2-04-c2', type:'text', q:'CAV stands for Consumer ______ Victoria.', accept:['affairs'], explain:'Affairs.'},
    {id:'U3A2-04-c3', type:'mc', q:'If CAV cannot resolve a consumer dispute, where may it go next?', options:['VCAT','The Court of Appeal','The High Court','The Koori Court'], answer:0, explain:'VCAT.'},
    {id:'U3A2-04-c4', type:'tf', q:'CAV and Victoria Legal Aid are the same body.', answer:false, explain:'False.'},
    {id:'U3A2-04-c5', type:'mc', q:'Which is a strength of CAV in terms of the principles of justice?', options:['Being free supports equality and access','It guarantees impartial binding decisions','It provides a jury','It hears appeals'], answer:0, explain:'Free → access, equality.'}
  ]
},

/* ============================================================ U3A2-05 */
{ id:'U3A2-05', area:'Unit 3 AOS 2 · Civil justice system', title:'VCAT',
  kk:'The role of the Victorian Civil and Administrative Tribunal in resolving civil disputes',
  pretrain:[
    {term:'Tribunal', def:'A dispute resolution body that is <span class="key">less formal</span> than a court.'},
    {term:'VCAT', def:'The <span class="key">Victorian Civil and Administrative Tribunal</span>. It resolves a wide range of civil disputes in <span class="key">lists</span> (e.g. Civil Claims, Residential Tenancies).'},
    {term:'Member', def:'The person who hears and decides a VCAT case.'},
    {term:'Binding order', def:'A decision the parties <span class="key">must</span> follow; it can be enforced.'}
  ],
  teach:[
    {type:'rule', title:'How VCAT works', html:`
      <p>① <b>Informal and quick</b> — simpler procedures than courts; rules of evidence don't strictly apply.</p>
      <p>② Parties generally <b>represent themselves</b> — lawyers usually need permission.</p>
      <p>③ VCAT can use <b>mediation</b> and <b>compulsory conferences</b> to try to settle the dispute first.</p>
      <p>④ If not settled, a <b>hearing</b>: the member makes a <b>binding, enforceable order</b>.</p>
      <p>⑤ <b>Appeals</b> are limited: to the Supreme Court, on a <b>question of law</b> only, and with permission.</p>
      <p>⑥ Fees are low compared with courts (and depend on the claim).</p>`},
    {type:'contrast', title:'VCAT compared with CAV and courts',
      examples:[
        {text:'A tenant applies to VCAT\'s Residential Tenancies List for return of her bond; the member orders the landlord to pay.', why:'Binding order — something CAV can\'t do.'},
        {text:'Parties in a building dispute attend a VCAT compulsory conference and settle.', why:'VCAT using dispute resolution before a hearing.'}],
      nonexamples:[
        {text:'"VCAT decisions can be appealed on any ground."', why:'Only on a question of law, with permission.'},
        {text:'"VCAT has a jury."', why:'No — a member decides.'},
        {text:'"VCAT is a court."', why:'It is a tribunal — less formal than a court.'}]},
    {type:'rule', title:'Strengths and weaknesses', html:`
      <table class="mini"><tr><th>Strengths</th><th>Weaknesses</th></tr>
      <tr><td>Low cost; no lawyers needed → <b>access</b></td><td>Unrepresented parties may face a better-resourced opponent → <b>equality</b></td></tr>
      <tr><td>Binding orders → disputes are actually resolved</td><td>Limited appeal rights</td></tr>
      <tr><td>Members have expertise in their list → specialisation</td><td>Delays in some lists (e.g. high-volume lists)</td></tr>
      <tr><td>Hearings generally public → <b>fairness</b> (openness)</td><td>Enforcing an order may require going to a court</td></tr></table>`}
  ],
  worked:[
    {title:'Choosing between CAV and VCAT', prompt:'Ava tried CAV but the retailer still refuses to replace her fridge. Why might VCAT be appropriate?',
     steps:['Problem with CAV: no binding decision.','VCAT can make a binding, enforceable order.','VCAT is low cost and informal → Ava doesn\'t need a lawyer.','VCAT may first try mediation; if that fails, a member decides.'],
     answer:'VCAT is appropriate because it can make a <b>binding order</b> at <b>low cost</b>, without lawyers.'}
  ],
  faded:[
    {title:'Your turn', prompt:'After a VCAT hearing, a landlord is unhappy with the member\'s decision and wants to appeal because he thinks the member weighed the evidence wrongly.',
     given:['VCAT appeals go to the Supreme Court.','They are only allowed on a question of law, with permission.'],
     item:{id:'U3A2-05-f1', type:'tf', q:'So the landlord can appeal simply because he disagrees with how the evidence was weighed.', answer:false, explain:'False — he needs an error of law.', hint:'What ground is required?'}}
  ],
  practice:[
    {id:'U3A2-05-p1', type:'text', q:'The person who hears and decides a VCAT case is a ______.', accept:['member','vcat member','tribunal member'], explain:'Member.'},
    {id:'U3A2-05-p2', type:'tf', q:'VCAT can make binding orders.', answer:true, explain:'True.'},
    {id:'U3A2-05-p3', type:'mc', q:'Appeals from VCAT are generally:', options:['To the Supreme Court on a question of law, with permission','To CAV on any ground','To the County Court on the facts','Not possible at all'], answer:0, explain:'Question of law, Supreme Court, permission.'},
    {id:'U3A2-05-p4', type:'mc', q:'Which is a strength of VCAT?', options:['Low cost and informal procedures','Jury trials','Unlimited appeals','Lawyers are always provided free'], answer:0, explain:'Low cost, informal.'},
    {id:'U3A2-05-p5', type:'tf', q:'At VCAT, parties generally represent themselves.', answer:true, explain:'True — lawyers usually need permission.'},
    {id:'U3A2-05-p6', type:'mc', q:'VCAT organises disputes into:', options:['Lists','Divisions of the High Court','Juries','Circuits'], answer:0, explain:'Lists.'}
  ],
  check:[
    {id:'U3A2-05-c1', type:'mc', q:'The key difference between CAV and VCAT is that VCAT:', options:['Can make binding decisions','Is free','Uses a jury','Only gives information'], answer:0, explain:'Binding decisions.'},
    {id:'U3A2-05-c2', type:'text', q:'VCAT is a ______, not a court. (one word)', accept:['tribunal'], explain:'Tribunal.'},
    {id:'U3A2-05-c3', type:'tf', q:'VCAT may use mediation before holding a hearing.', answer:true, explain:'True.'},
    {id:'U3A2-05-c4', type:'mc', q:'Which is a weakness of VCAT linked to equality?', options:['A self-represented party may face a better-resourced opponent','It is too expensive','It always uses juries','It has no expertise'], answer:0, explain:'Imbalance of resources.'},
    {id:'U3A2-05-c5', type:'mc', q:'Which dispute is most suited to VCAT?', options:['A tenant seeking return of a bond','A murder trial','A class action against a bank by thousands of people','An appeal from the County Court'], answer:0, explain:'Tenancy dispute.'}
  ]
},

/* ============================================================ U3A2-06 */
{ id:'U3A2-06', area:'Unit 3 AOS 2 · Civil justice system', title:'The courts in civil cases',
  kk:'The reasons for the Victorian court hierarchy in determining civil disputes, including administrative convenience and appeals; the appropriateness of the courts',
  pretrain:[
    {term:'Original jurisdiction', def:'The power to hear a case <span class="key">for the first time</span>.'},
    {term:'Appellate jurisdiction', def:'The power to hear an <span class="key">appeal</span>.'},
    {term:'Administrative convenience', def:'Allocating cases to courts by <span class="key">size and complexity</span>, so each court\'s workload, resources and procedures match the cases it hears.'},
    {term:'Mediation (court-ordered)', def:'Courts often <span class="key">order</span> the parties to attend mediation before a trial.'}
  ],
  teach:[
    {type:'diagram', title:'Civil jurisdiction', svg:SVG_CIVIL_COURTS, caption:'The more money claimed or the more complex the case, the higher the court.'},
    {type:'rule', title:'Why a hierarchy? Administrative convenience and appeals', html:`
      <p><span class="key">Watch the switch:</span> for <b>criminal</b> cases the study design says <b>specialisation and appeals</b>; for <b>civil</b> disputes it says <b>administrative convenience and appeals</b>.</p>
      <p><b>Administrative convenience:</b> cases are spread across courts by size and complexity — small claims in the Magistrates' Court, large or complex ones in the County or Supreme Court. This spreads the workload, uses resources sensibly (judges' time, court fees, procedures matched to the case) and reduces delay.</p>
      <p><b>Appeals:</b> a dissatisfied party can ask a higher court to review a decision (e.g. on an error of law) → errors corrected → <b>fairness</b>.</p>
      <p><b>Also:</b> higher courts' decisions become precedents that lower courts must follow (Unit 4 link).</p>`},
    {type:'rule', title:'When is a court appropriate?', html:`
      <p><b>Appropriate:</b> large or complex claims; legal precedent needed; the other party won't cooperate; a <b>binding, enforceable</b> decision with full appeal rights is needed; class actions (Supreme Court).</p>
      <p><b>Less appropriate:</b> small claims (costs may exceed the claim); parties want privacy or to preserve a relationship; the dispute suits CAV or VCAT.</p>
      <p>Courts can also order <b>mediation</b> — most civil cases settle before trial.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Thousands of small debt claims are dealt with quickly in the Magistrates\' Court, leaving County and Supreme Court judges free for large, complex disputes.', why:'Administrative convenience.'},
        {text:'A defendant appeals a County Court civil decision to the Court of Appeal on an error of law.', why:'Appeals.'}],
      nonexamples:[
        {text:'"A $20,000 claim must go to the Supreme Court."', why:'It can be heard in the Magistrates\' Court (up to $100,000).'},
        {text:'"Courts are always the best way to resolve civil disputes."', why:'Not for small claims or where relationships matter.'},
        {text:'"The reasons for the civil court hierarchy are specialisation and appeals."', why:'That is the criminal pairing. For civil disputes: administrative convenience and appeals.'}]}
  ],
  worked:[
    {title:'Picking a court', prompt:'Sophie claims $60,000 from a builder for defective work. Which court has jurisdiction, and is a court appropriate?',
     steps:['Amount: $60,000 → within the Magistrates\' Court limit ($100,000).','Alternatives: VCAT also hears building disputes, often more cheaply.','Court appropriate if: the builder won\'t cooperate and Sophie wants full appeal rights.','Less appropriate if: cost and speed matter most → VCAT.'],
     answer:'<b>Magistrates\' Court</b> has jurisdiction; VCAT may be a cheaper alternative.'}
  ],
  faded:[
    {title:'Your turn', prompt:'A company claims $5 million from another company over a complex contract.',
     given:['Amount: far above $100,000.','Complex commercial dispute.'],
     item:{id:'U3A2-06-f1', type:'mc', q:'So which court is most suitable?', options:['Supreme Court (or County Court)','Magistrates\' Court','VCAT Civil Claims List','CAV'], answer:0, explain:'Unlimited jurisdiction; complex commercial expertise.', hint:'Unlimited jurisdiction.'}}
  ],
  practice:[
    {id:'U3A2-06-p1', type:'mc', q:'The Magistrates\' Court can hear civil claims up to:', options:['$100,000','$10,000','$1 million','Unlimited'], answer:0, explain:'$100,000.'},
    {id:'U3A2-06-p2', type:'mc', q:'Which courts have unlimited civil jurisdiction?', options:['County Court and Supreme Court','Magistrates\' Court only','VCAT and CAV','Koori Court'], answer:0, explain:'County and Supreme.'},
    {id:'U3A2-06-p3', type:'text', q:'The power to hear a case for the first time is called ______ jurisdiction.', accept:['original'], explain:'Original.'},
    {id:'U3A2-06-p4', type:'mc', q:'Small claims go to the Magistrates\' Court and complex claims to higher courts, so each court\'s workload and resources suit its cases. This reason for the hierarchy is:', options:['Administrative convenience','Appeals','Specialisation of juries','Precedent'], answer:0, explain:'Administrative convenience.'},
    {id:'U3A2-06-p5', type:'mc', q:'Which is a reason a court may NOT be appropriate?', options:['The cost may exceed the amount claimed','It gives a binding decision','There are appeal rights','Judges are experts'], answer:0, explain:'Cost.'},
    {id:'U3A2-06-p6', type:'mc', q:'Which court hears appeals from the County Court in civil cases?', options:['Court of Appeal','Magistrates\' Court','VCAT','CAV'], answer:0, explain:'Court of Appeal.'}
  ],
  check:[
    {id:'U3A2-06-c1', type:'mc', q:'The study design names two reasons for the court hierarchy in determining CIVIL disputes. They are:', options:['Administrative convenience and appeals','Specialisation and appeals','Juries and sanctions','Mediation and negotiation'], answer:0, explain:'Administrative convenience and appeals. (Specialisation and appeals is the criminal pairing.)'},
    {id:'U3A2-06-c2', type:'text', q:'The power to hear an appeal is called ______ jurisdiction.', accept:['appellate'], explain:'Appellate.'},
    {id:'U3A2-06-c3', type:'mc', q:'A $40,000 debt claim could be heard first in the:', options:['Magistrates\' Court','Court of Appeal','High Court','Koori Court'], answer:0, explain:'Within $100,000.'},
    {id:'U3A2-06-c4', type:'tf', q:'Courts can order parties to attend mediation.', answer:true, explain:'True.'},
    {id:'U3A2-06-c5', type:'mc', q:'When is a court most appropriate?', options:['A complex, high-value dispute where a binding, appealable decision is needed','A small dispute between friends who want to stay friends','A dispute the parties want kept private','A $300 refund'], answer:0, explain:'Complex, high value.'}
  ]
},

/* ============================================================ U3A2-07 */
{ id:'U3A2-07', area:'Unit 3 AOS 2 · Civil justice system', title:'Judge or magistrate, and the jury, in a civil dispute',
  kk:'The roles of key personnel in a civil dispute, including the judge or magistrate (including the role of case management) and the jury',
  pretrain:[
    {term:'Civil jury', def:'<span class="key">Six</span> jurors, available in the County and Supreme Courts if a party <span class="key">requests and pays</span> for one.'},
    {term:'Case management', def:'The judge\'s active control of a case — setting timetables and giving <span class="key">directions</span> — so it runs efficiently.'},
    {term:'Liability', def:'Whether the defendant is legally responsible.'}
  ],
  teach:[
    {type:'rule', title:'The judge', html:`
      <p>① <b>Case management</b> — give directions, set timetables, order mediation, keep the case moving (<i>Civil Procedure Act 2010</i>).</p>
      <p>② <b>Impartial umpire</b> — ensure fair procedures are followed.</p>
      <p>③ <b>Decide questions of law</b>, including admissibility of evidence.</p>
      <p>④ If there is a jury: <b>give directions</b> and sum up.</p>
      <p>⑤ If there is <b>no jury</b> (most civil cases): decide <b>liability</b> and the <b>remedy</b>.</p>
      <p>A <b>magistrate</b> in the Magistrates' Court has the same roles, including case management, but there is never a civil jury in that court.</p>`},
    {type:'rule', title:'The civil jury', html:`
      <table class="mini"><tr><th></th><th>Criminal jury</th><th>Civil jury</th></tr>
      <tr><td>Size</td><td>12</td><td><b>6</b></td></tr>
      <tr><td>When?</td><td>Indictable offence + not guilty plea</td><td>A party <b>requests and pays</b> (County/Supreme only)</td></tr>
      <tr><td>Decides</td><td>Guilty / not guilty</td><td><b>Liable / not liable</b>, and may decide <b>damages</b> if asked</td></tr>
      <tr><td>Standard</td><td>Beyond reasonable doubt</td><td>Balance of probabilities</td></tr>
      <tr><td>Majority</td><td>11 of 12</td><td><b>5 of 6</b> (after at least 3 hours)</td></tr></table>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Andy requests a jury for his civil claim against Grant in the County Court and pays the fee.', why:'Civil jury of six. (2025 scenario.)'},
        {text:'A Supreme Court judge orders the parties to attend mediation before trial.', why:'Case management.'}],
      nonexamples:[
        {text:'"Every civil case has a jury."', why:'No — only if requested and paid for; most civil cases have no jury.'},
        {text:'"The civil jury decides guilt."', why:'Civil juries decide liability.'},
        {text:'"There are civil juries in the Magistrates\' Court."', why:'No — County and Supreme only.'}]}
  ],
  worked:[
    {title:'Who decides?', prompt:'In Andy\'s County Court claim against Grant, no jury is requested. Who decides liability and damages?',
     steps:['No jury requested → judge alone.','Judge decides liability on the balance of probabilities.','If liable, the judge decides the remedy (damages).'],
     answer:'The <b>judge</b> decides both <b>liability</b> and <b>damages</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'A civil jury has deliberated for 4 hours. Five jurors think the defendant is liable; one does not.',
     given:['Civil juries have 6 members.','Majority verdicts are allowed after a certain period.'],
     item:{id:'U3A2-07-f1', type:'mc', q:'So can the jury deliver a verdict?', options:['Yes — a 5:1 majority verdict','No — it must be unanimous','No — the judge must decide instead','Yes — but only a "guilty" verdict'], answer:0, explain:'5 of 6 after at least 3 hours.', hint:'How many of 6?'}}
  ],
  practice:[
    {id:'U3A2-07-p1', type:'text', q:'How many jurors sit on a civil jury in Victoria?', accept:['6','six'], explain:'Six.'},
    {id:'U3A2-07-p2', type:'tf', q:'Most civil cases are decided by a judge without a jury.', answer:true, explain:'True.'},
    {id:'U3A2-07-p3', type:'mc', q:'Which is a civil judge\'s case management role?', options:['Setting timetables and ordering mediation','Deciding guilt','Choosing the plaintiff\'s lawyer','Imposing a sanction'], answer:0, explain:'Case management.'},
    {id:'U3A2-07-p4', type:'mc', q:'A civil jury decides:', options:['Whether the defendant is liable (and may assess damages)','Whether the accused is guilty','The sentence','Questions of law'], answer:0, explain:'Liability.'},
    {id:'U3A2-07-p5', type:'mc', q:'Who pays for a civil jury?', options:['The party who requests it','The state','The judge','The jurors'], answer:0, explain:'Requesting party.'},
    {id:'U3A2-07-p6', type:'tf', q:'Civil juries are available in the Magistrates\' Court.', answer:false, explain:'False.'}
  ],
  check:[
    {id:'U3A2-07-c1', type:'mc', q:'Which correctly compares criminal and civil juries?', options:['Criminal 12, civil 6','Criminal 6, civil 12','Both 12','Both 6'], answer:0, explain:'12 vs 6.'},
    {id:'U3A2-07-c2', type:'text', q:'A civil majority verdict needs ___ of 6 jurors. (number)', accept:['5','five'], explain:'5 of 6.'},
    {id:'U3A2-07-c3', type:'mc', q:'Which Act gives civil judges case management powers and sets the overarching purpose?', options:['Civil Procedure Act 2010','Sentencing Act 1991','Juries Act 2000 only','Victims\' Charter Act 2006'], answer:0, explain:'Civil Procedure Act 2010.'},
    {id:'U3A2-07-c4', type:'tf', q:'If there is no jury, the judge decides liability and the remedy.', answer:true, explain:'True.'},
    {id:'U3A2-07-c5', type:'mc', q:'Which is NOT a role of the judge in a civil trial?', options:['Deciding liability when a jury has been empanelled','Case management','Deciding admissibility of evidence','Giving directions to the jury'], answer:0, explain:'With a jury, the jury decides liability.'}
  ]
},

/* ============================================================ U3A2-08 */
{ id:'U3A2-08', area:'Unit 3 AOS 2 · Civil justice system', title:'The parties and legal practitioners',
  kk:'The roles of key personnel in a civil case: the parties and legal practitioners',
  pretrain:[
    {term:'Pleadings', def:'Documents that set out each party\'s <span class="key">claims and defences</span> — e.g. the statement of claim and the defence.'},
    {term:'Discovery', def:'Each party must <span class="key">disclose relevant documents</span> to the other.'},
    {term:'Overarching obligations', def:'Duties under the <i>Civil Procedure Act 2010</i> — e.g. act <span class="key">honestly</span>, cooperate, don\'t mislead, keep costs proportionate.'}
  ],
  teach:[
    {type:'rule', title:'Roles of the parties', html:`
      <table class="mini"><tr><th>Plaintiff</th><th>Defendant</th></tr>
      <tr><td>Starts the claim (statement of claim)</td><td>Responds (defence; may counterclaim)</td></tr>
      <tr><td>Bears the <b>burden of proof</b> — must prove the claim on the balance of probabilities</td><td>Doesn't have to prove anything, but may present evidence to rebut</td></tr>
      <tr><td colspan="2"><b>Both:</b> comply with <b>overarching obligations</b>; take part in <b>discovery</b>; present evidence and question witnesses; may <b>settle</b> at any time</td></tr></table>`},
    {type:'rule', title:'Why legal practitioners are needed', html:`
      <p>① <b>Complex procedures</b> — pleadings, discovery, rules of evidence.</p>
      <p>② <b>Objectivity</b> — parties are emotionally involved.</p>
      <p>③ <b>Effective presentation</b> — skilled questioning and argument.</p>
      <p>④ <b>Equality</b> — a self-represented party may be disadvantaged against an opponent with a lawyer.</p>
      <p>⑤ <b>Advice on settlement</b> — lawyers can judge whether an offer is reasonable.</p>
      <p>Unlike the criminal system, there is <b>no Dietrich-type protection</b> in civil cases, and legal aid for civil matters is very limited.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Louise\'s clients\' lawyer requests discovery of Louise\'s financial records.', why:'Discovery. (2024 scenario.)'},
        {text:'A self-represented plaintiff misses a filing deadline and her claim is delayed.', why:'Shows need for legal practitioners.'}],
      nonexamples:[
        {text:'"The defendant must prove they are not liable."', why:'No — the plaintiff bears the burden.'},
        {text:'"Parties can hide unhelpful documents."', why:'No — discovery obligations.'},
        {text:'"Civil cases are adjourned if a party can\'t afford a lawyer (Dietrich)."', why:'Dietrich applies to serious criminal trials, not civil cases.'}]}
  ],
  worked:[
    {title:'Explaining a role', prompt:'Explain one role of the plaintiff in Andy\'s civil claim against Grant. (2025 scenario)',
     steps:['Name the role: bearing the burden of proof.','Explain: Andy must prove his claim.','Add the standard: on the balance of probabilities.','Link: Andy must show it is more probable than not that Grant caused his injuries and loss.'],
     answer:'Andy bears the <b>burden of proof</b> and must prove his claim <b>on the balance of probabilities</b>.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Before trial, the defendant hands the plaintiff all emails relevant to the dispute — including ones that hurt the defendant\'s case.',
     given:['Each party must disclose relevant documents.'],
     item:{id:'U3A2-08-f1', type:'text', q:'This process is called ______.', accept:['discovery','disclosure'], explain:'Discovery.', hint:'D…'}}
  ],
  practice:[
    {id:'U3A2-08-p1', type:'mc', q:'Which party bears the burden of proof in a civil case?', options:['Plaintiff','Defendant','Both equally','The judge'], answer:0, explain:'Plaintiff.'},
    {id:'U3A2-08-p2', type:'text', q:'Documents setting out each party\'s claims and defences are called ______.', accept:['pleadings','pleading'], explain:'Pleadings.'},
    {id:'U3A2-08-p3', type:'mc', q:'Which is an overarching obligation under the Civil Procedure Act 2010?', options:['Act honestly','Always use a jury','Always go to trial','Never settle'], answer:0, explain:'Act honestly.'},
    {id:'U3A2-08-p4', type:'tf', q:'Parties to a civil dispute can settle at any time before judgment.', answer:true, explain:'True.'},
    {id:'U3A2-08-p5', type:'mc', q:'Which is a reason legal practitioners are needed in civil cases?', options:['Complex procedures such as pleadings and discovery','Judges refuse to hear self-represented parties','Juries only listen to lawyers','Lawyers decide liability'], answer:0, explain:'Complexity.'},
    {id:'U3A2-08-p6', type:'tf', q:'Dietrich v The Queen protects unrepresented parties in civil cases.', answer:false, explain:'False — it applies to serious criminal trials.'}
  ],
  check:[
    {id:'U3A2-08-c1', type:'mc', q:'Which is a role of both parties in a civil case?', options:['Complying with discovery obligations','Proving beyond reasonable doubt','Deciding the remedy','Sentencing'], answer:0, explain:'Discovery.'},
    {id:'U3A2-08-c2', type:'text', q:'The document that starts the plaintiff\'s claim is the statement of ______.', accept:['claim'], explain:'Statement of claim.'},
    {id:'U3A2-08-c3', type:'mc', q:'A self-represented defendant faces a large company with a legal team. Which principle is most at risk?', options:['Equality','Openness','Specialisation','Deterrence'], answer:0, explain:'Equality.'},
    {id:'U3A2-08-c4', type:'tf', q:'The defendant must prove they are not liable.', answer:false, explain:'False.'},
    {id:'U3A2-08-c5', type:'mc', q:'Which Act sets out overarching obligations for parties and lawyers in civil cases?', options:['Civil Procedure Act 2010','Evidence Act 2008','Sentencing Act 1991','Limitation of Actions Act 1958'], answer:0, explain:'Civil Procedure Act 2010.'}
  ]
},

/* ============================================================ U3A2-09 */
{ id:'U3A2-09', area:'Unit 3 AOS 2 · Civil justice system', title:'Class actions',
  kk:'The use of class actions to resolve civil disputes',
  pretrain:[
    {term:'Class action', def:'A single proceeding brought by <span class="key">one person on behalf of a group</span> with similar claims against the same defendant. Also called a <span class="key">group proceeding</span>.'},
    {term:'Lead plaintiff', def:'The person who brings the class action on behalf of the group.'},
    {term:'Group members', def:'The other people with claims, who usually don\'t take an active part.'},
    {term:'Litigation funder', def:'A company that <span class="key">pays the costs</span> of a class action in return for a <span class="key">share</span> of any money recovered.'}
  ],
  teach:[
    {type:'rule', title:'Requirements (Supreme Court Act 1986 (Vic), Part 4A)', html:`
      <p>① <b>Seven or more</b> people have claims against the same defendant.</p>
      <p>② The claims arise out of the <b>same, similar or related circumstances</b>.</p>
      <p>③ The claims give rise to at least one <b>substantial common question</b> of law or fact.</p>
      <p>Group members are usually included automatically unless they <b>opt out</b>.</p>
      <p><b>Which court?</b> The <b>Supreme Court</b> (or the Federal Court) — <span class="key">not the County Court</span>, which the 2024 examiners noted has no jurisdiction to hear a class action.</p>`},
    {type:'rule', title:'Purposes', html:`
      <table class="mini"><tr><th>Purpose</th><th>How</th><th>Principle</th></tr>
      <tr><td>Improve <b>access</b></td><td>People with small claims who couldn't afford to sue alone can join</td><td>Access</td></tr>
      <tr><td><b>Efficiency</b></td><td>One case instead of many; one set of evidence and witnesses</td><td>(reduces cost and delay)</td></tr>
      <tr><td><b>Consistency</b></td><td>All group members get the same outcome on the common issues</td><td>Equality</td></tr>
      <tr><td><b>Equalise power</b></td><td>A group can take on a large, well-resourced defendant</td><td>Equality</td></tr></table>
      <p><b>Limitations:</b> lengthy; litigation funders and lawyers may take a significant share of the money; the lead plaintiff carries a costs risk; group members have little control.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'Thousands of car owners sue a manufacturer over faulty airbags in one proceeding.', why:'Class action.'},
        {text:'Seven investors misled by the same financial adviser bring one claim together.', why:'Meets the minimum number.'}],
      nonexamples:[
        {text:'"Three neighbours with different complaints against different builders bring a class action."', why:'Fewer than seven, different defendants, different circumstances.'},
        {text:'"Group members must all appear in court."', why:'No — the lead plaintiff runs the case.'},
        {text:'"A class action is a criminal prosecution of a company."', why:'It is a civil proceeding.'}]}
  ],
  worked:[
    {title:'Is a class action possible?', prompt:'Louise\'s 22 clients each lost money through the same investment scheme Louise ran. Could they bring a class action? (Based on 2024 scenario)',
     steps:['Number: 22 → seven or more.','Same defendant: Louise; same or related circumstances: the same non-existent gold mine.','Common question: e.g. whether Louise misled her clients.','Now weigh appropriateness, not just eligibility: court, lead plaintiff, funding.'],
     answer:'<b>Largely appropriate</b> — all three requirements appear met. But (2024 report): they planned to sue in the County Court, which can\'t hear class actions, so they\'d need the Supreme or Federal Court; someone must be willing to be lead plaintiff; and a $220,000 total claim may be too small to attract a litigation funder.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Each of 500 phone customers was overcharged about $40 by the same company.',
     given:['Requirements look satisfied: many people, same defendant, same conduct.','Each claim alone is very small.'],
     item:{id:'U3A2-09-f1', type:'mc', q:'Which purpose of class actions is most relevant here?', options:['Access — small claims that wouldn\'t be worth suing alone','Punishment of the company','Deterrence of the jury','Specialisation of the court'], answer:0, explain:'Access.', hint:'Would anyone sue for $40 alone?'}}
  ],
  practice:[
    {id:'U3A2-09-p1', type:'text', q:'How many people (minimum) must have claims for a class action in Victoria? (number)', accept:['7','seven'], explain:'Seven.'},
    {id:'U3A2-09-p2', type:'mc', q:'The person who runs a class action on behalf of the group is the:', options:['Lead plaintiff','Litigation funder','Defendant','Judge'], answer:0, explain:'Lead plaintiff.'},
    {id:'U3A2-09-p3', type:'mc', q:'A litigation funder:', options:['Pays the costs in return for a share of any money recovered','Decides the case','Represents the defendant','Is a type of juror'], answer:0, explain:'Funds for a share.'},
    {id:'U3A2-09-p4', type:'tf', q:'Group members are usually included unless they opt out.', answer:true, explain:'True.'},
    {id:'U3A2-09-p5', type:'mc', q:'Which is a limitation of class actions?', options:['Funders and lawyers may take a large share of the money','They are always quick','They only help defendants','Group members must each hire a lawyer'], answer:0, explain:'Share of recovery.'},
    {id:'U3A2-09-p6', type:'mc', q:'Which is a purpose of class actions?', options:['Efficiency — one case instead of many','Punishing the defendant','Imprisoning company directors','Avoiding the courts'], answer:0, explain:'Efficiency.'}
  ],
  check:[
    {id:'U3A2-09-c1', type:'mc', q:'Which is a requirement for a class action?', options:['At least one substantial common question of law or fact','The defendant must agree','All members must live in Melbourne','A jury must be requested'], answer:0, explain:'Common question.'},
    {id:'U3A2-09-c2', type:'mc', q:'How do class actions promote equality?', options:['A group can take on a well-resourced defendant','They remove the need for evidence','They guarantee a win','They avoid all costs'], answer:0, explain:'Balancing power.'},
    {id:'U3A2-09-c3', type:'tf', q:'Three people with claims against different defendants can bring a class action.', answer:false, explain:'False.'},
    {id:'U3A2-09-c4', type:'text', q:'Another name for a class action is a ______ proceeding.', accept:['group','representative'], explain:'Group proceeding.'},
    {id:'U3A2-09-c5', type:'mc', q:'Louise\'s clients planned to sue in the County Court. Why might that be a problem for a class action?', options:['The County Court cannot hear class actions — it must go to the Supreme Court (or Federal Court)','The County Court has no civil jurisdiction','Class actions must be heard at VCAT','Class actions need a jury of 12'], answer:0, src:'2024 Sec A Q1b', explain:'Per the 2024 examiners\' report.'}
  ]
},

/* ============================================================ U3A2-10 */
{ id:'U3A2-10', area:'Unit 3 AOS 2 · Remedies', title:'Remedies: damages and injunctions',
  kk:'Damages and injunctions, and their specific purposes',
  pretrain:[
    {term:'Damages', def:'A remedy requiring the defendant to <span class="key">pay money</span> to the plaintiff.'},
    {term:'Injunction', def:'A court order requiring a party to <span class="key">do</span> something or <span class="key">stop</span> doing something.'}
  ],
  teach:[
    {type:'rule', title:'Purposes of remedies', html:`
      <p>The main purpose of civil remedies is to <b>restore</b> the plaintiff, as far as possible, to the position they were in before the wrong. Some remedies also <b>punish</b> or <b>deter</b> the defendant (exemplary damages), or <b>prevent</b> future harm (injunctions).</p>`},
    {type:'rule', title:'Types of damages', html:`
      <table class="mini"><tr><th>Type</th><th>Purpose</th><th>Example</th></tr>
      <tr><td><b>Compensatory</b></td><td>Compensate for actual loss: <b>specific</b> (calculable, e.g. medical bills, lost wages) and <b>general</b> (e.g. pain and suffering)</td><td>Andy\'s medical costs and pain</td></tr>
      <tr><td><b>Nominal</b></td><td>A <b>small</b> sum recognising the plaintiff\'s rights were infringed, though little loss was suffered</td><td>$1 for a trespass causing no damage</td></tr>
      <tr><td><b>Exemplary</b> (punitive)</td><td><b>Punish</b> the defendant and <b>deter</b> others for outrageous conduct</td><td>Deliberate, malicious behaviour</td></tr>
      <tr><td><b>Contemptuous</b></td><td>A tiny sum showing the court thinks the case <b>should not have been brought</b>, even though the plaintiff technically won</td><td>1 cent in a trivial defamation case</td></tr></table>`},
    {type:'rule', title:'Types of injunctions', html:`
      <p><b>Restrictive</b> (prohibitory): orders a party to <b>stop</b> or not do something — e.g. stop building over a boundary.</p>
      <p><b>Mandatory</b>: orders a party to <b>do</b> something — e.g. remove a structure.</p>
      <p>Injunctions can be <b>interlocutory</b> (temporary, until trial) or <b>permanent</b>.</p>`},
    {type:'contrast', title:'Examples and non-examples',
      examples:[
        {text:'A neighbour is ordered to stop playing loud music after 10 pm.', why:'Restrictive injunction.'},
        {text:'A company is ordered to pay $500,000 on top of compensation because it deliberately ignored safety warnings.', why:'Exemplary damages.'}],
      nonexamples:[
        {text:'"Nominal damages and contemptuous damages are the same."', why:'Nominal recognises a real infringement; contemptuous shows the court\'s disapproval of the claim being brought.'},
        {text:'"Compensatory damages are designed to punish."', why:'They compensate; exemplary damages punish.'},
        {text:'"An injunction is a payment of money."', why:'An injunction is an order to do or not do something.'}]}
  ],
  worked:[
    {title:'Choosing a remedy', prompt:'Andy suffered serious injuries in Grant\'s attack: medical bills, lost wages and ongoing pain. Which damages are appropriate? (2025 scenario)',
     steps:['Goal: restore Andy as far as possible.','Calculable losses (bills, wages) → specific compensatory damages.','Pain and suffering → general compensatory damages.','If the conduct was outrageous, exemplary damages may be sought too.'],
     answer:'<b>Compensatory damages</b> — specific (bills, wages) and general (pain and suffering) — possibly with exemplary damages.'}
  ],
  faded:[
    {title:'Your turn', prompt:'A developer\'s crane keeps swinging over a homeowner\'s roof. The homeowner wants it stopped.',
     given:['The homeowner wants conduct to stop, not money.','So the remedy is an injunction.'],
     item:{id:'U3A2-10-f1', type:'text', q:'Which type of injunction? (one word)', accept:['restrictive','prohibitory','restraining'], explain:'Restrictive (prohibitory).', hint:'Stops something.'}}
  ],
  practice:[
    {id:'U3A2-10-p1', type:'mc', q:'Which damages compensate for medical bills and lost wages?', options:['Compensatory (specific)','Nominal','Contemptuous','Exemplary'], answer:0, explain:'Specific compensatory.'},
    {id:'U3A2-10-p2', type:'mc', q:'Which damages are designed to punish the defendant?', options:['Exemplary','Nominal','Compensatory','Contemptuous'], answer:0, explain:'Exemplary.'},
    {id:'U3A2-10-p3', type:'text', q:'An injunction ordering a party to DO something is a ______ injunction.', accept:['mandatory'], explain:'Mandatory.'},
    {id:'U3A2-10-p4', type:'mc', q:'Which damages show the court thinks the case should not have been brought?', options:['Contemptuous','Nominal','Exemplary','Compensatory'], answer:0, explain:'Contemptuous.'},
    {id:'U3A2-10-p5', type:'tf', q:'The main purpose of civil remedies is to restore the plaintiff to their original position as far as possible.', answer:true, explain:'True.'},
    {id:'U3A2-10-p6', type:'mc', q:'Pain and suffering is compensated by:', options:['General compensatory damages','Specific compensatory damages','Nominal damages','A restrictive injunction'], answer:0, explain:'General.'}
  ],
  check:[
    {id:'U3A2-10-c1', type:'mc', q:'A trespasser walked across a farm without causing damage. The farmer receives $10. These are:', options:['Nominal damages','Exemplary damages','Contemptuous damages','Specific damages'], answer:0, explain:'Nominal — recognising the infringement.'},
    {id:'U3A2-10-c2', type:'mc', q:'Which remedy best fits a plaintiff who wants a neighbour to stop building over the boundary?', options:['Restrictive injunction','Mandatory injunction','Nominal damages','Contemptuous damages'], answer:0, explain:'Restrictive.'},
    {id:'U3A2-10-c3', type:'text', q:'A court order to do or not do something is called an ______.', accept:['injunction'], explain:'Injunction.'},
    {id:'U3A2-10-c4', type:'tf', q:'Exemplary damages are also known as punitive damages.', answer:true, explain:'True.'},
    {id:'U3A2-10-c5', type:'mc', q:'Which correctly matches type and purpose?', options:['Compensatory — restore; exemplary — punish','Nominal — punish; contemptuous — restore','Exemplary — restore; compensatory — punish','Contemptuous — compensate fully'], answer:0, explain:'Correct.'}
  ]
},

/* ============================================================ U3A2-11 */
{ id:'U3A2-11', area:'Unit 3 AOS 2 · Civil justice system', title:'Costs and time in civil disputes',
  kk:'The impact of costs and time on the ability of the civil justice system to achieve the principles of justice during a civil dispute',
  pretrain:[
    {term:'Adverse costs order', def:'An order that the <span class="key">losing party pays</span> some or all of the winning party\'s legal costs.'},
    {term:'Delay', def:'Time taken before a dispute is resolved — waiting for a hearing, pre-trial procedures, and the hearing itself.'},
    {term:'Case management', def:'The judge or magistrate\'s active control of a case — timetables, directions, ordering mediation — to keep costs and delay down.'}
  ],
  teach:[
    {type:'rule', title:'The method: factor → principle → why (same as the criminal topic)', html:`
      <p>Note the difference: for <b>criminal</b> cases the study design names costs, time <b>and cultural differences</b>; for <b>civil</b> disputes it names only <b>costs and time</b>.</p>
      <table class="mini"><tr><th>Factor</th><th>How it can undermine justice</th><th>Principle</th></tr>
      <tr><td><b>Costs</b></td><td>Legal fees, court fees, expert reports and the risk of an adverse costs order may stop people bringing a valid claim</td><td><b>Access</b></td></tr>
      <tr><td><b>Costs</b></td><td>A party who can't afford a lawyer faces a well-resourced opponent (e.g. a company or government)</td><td><b>Equality</b></td></tr>
      <tr><td><b>Costs</b></td><td>A party who can't afford to appeal can't have an error corrected</td><td><b>Fairness</b> (participation)</td></tr>
      <tr><td><b>Time</b></td><td>Long delays → evidence deteriorates, witnesses forget; stress; parties settle for less just to end it</td><td><b>Fairness</b></td></tr>
      <tr><td><b>Time</b></td><td>Delay deters people from pursuing claims at all</td><td><b>Access</b></td></tr></table>`},
    {type:'contrast', title:'Responses that reduce the impact — and their limits',
      rule:'Strong answers say what the system does about costs and time, and whether it is enough.',
      examples:[
        {text:'CAV conciliation is free; VCAT fees are low and lawyers usually aren\'t needed.', why:'Reduce costs → access. Limit: CAV can\'t make binding decisions.'},
        {text:'Judges use case management and order mediation before trial.', why:'Reduce time and cost. Limit: mediation may fail and add a step.'},
        {text:'Class actions let many small claims proceed together; litigation funders pay costs.', why:'Reduce costs → access. Limit: funders take a share of the money.'},
        {text:'"No win, no fee" arrangements.', why:'Reduce upfront cost. Limit: only for claims a lawyer thinks will win.'}],
      nonexamples:[
        {text:'"Costs affect efficiency."', why:'Efficiency is not a principle of justice. Link to fairness, equality or access.'},
        {text:'"Cultural differences are one of the two factors in the civil study design."', why:'No — civil is costs and time only. Cultural differences are in the criminal list.'},
        {text:'"Victoria Legal Aid funds most civil cases."', why:'Legal aid for civil matters is very limited.'}]}
  ],
  worked:[
    {title:'Analysing costs before suing', prompt:'Analyse the importance of costs as a factor for Vanderstock and Davies before they sued the State of Victoria in the High Court. (2024 Section B Q2e — outline)',
     steps:['Factor: costs — complex constitutional case needs experienced barristers and solicitors; High Court filing and hearing fees.','Risk: an adverse costs order if they lose, against a defendant (Victoria) with large resources.','Effect: this could deter them → access.','Twist from the source: the Commonwealth supported them financially, which reduced the importance of costs.'],
     answer:'Costs were a <b>major potential deterrent</b> (fees + adverse costs risk), but <b>Commonwealth backing</b> greatly reduced their significance.'}
  ],
  faded:[
    {title:'Your turn', prompt:'Mia\'s building dispute waits 18 months for a hearing. Her key witness, a site foreman, has since moved overseas and can\'t remember details clearly.',
     given:['Factor: time (delay).','Effect: evidence has deteriorated, so Mia can\'t present her case fully.'],
     item:{id:'U3A2-11-f1', type:'mc', q:'So which principle is most directly affected?', options:['Fairness — Mia can\'t fully participate with good evidence','Efficiency','Specialisation','Denunciation'], answer:0, explain:'Delay weakens evidence → fair hearing.', hint:'Participation is part of which principle?'}}
  ],
  practice:[
    {id:'U3A2-11-p1', type:'mc', q:'Which two factors does the study design name as affecting the principles of justice in CIVIL disputes?', options:['Costs and time','Costs, time and cultural differences','Juries and judges','Negotiation and mediation'], answer:0, explain:'Costs and time.'},
    {id:'U3A2-11-p2', type:'mc', q:'The risk of having to pay the other side\'s legal costs if you lose most directly affects:', options:['Access','Openness','Specialisation','Deterrence'], answer:0, explain:'It can stop people bringing claims → access.'},
    {id:'U3A2-11-p3', type:'mc', q:'A self-represented tenant faces a property company with a legal team. Which principle is most at risk?', options:['Equality','Openness','Efficiency','Specialisation'], answer:0, explain:'Equality.'},
    {id:'U3A2-11-p4', type:'mc', q:'Which response reduces delay in civil cases?', options:['Case management by judges','Adverse costs orders','Majority verdicts in murder trials','Victim impact statements'], answer:0, explain:'Case management.'},
    {id:'U3A2-11-p5', type:'tf', q:'Cultural differences are one of the factors named for civil disputes in the study design.', answer:false, explain:'False — civil: costs and time.'},
    {id:'U3A2-11-p6', type:'text', q:'An order that the losing party pays the winner\'s legal costs is an ______ costs order.', accept:['adverse'], explain:'Adverse.'}
  ],
  check:[
    {id:'U3A2-11-c1', type:'mc', q:'Which is the best way to structure an answer about costs or time?', options:['Factor → specific principle → why, plus responses and their limits','List the courts','Define all three principles only','Describe the jury'], answer:0, explain:'Factor → principle → why.'},
    {id:'U3A2-11-c2', type:'mc', q:'In Vanderstock v Victoria, what reduced the importance of costs for the plaintiffs?', options:['The Commonwealth supported them financially','The High Court charges no fees','Victoria paid their lawyers','There was no risk of losing'], answer:0, src:'2024 Sec B Q2e', explain:'Commonwealth backing.'},
    {id:'U3A2-11-c3', type:'tf', q:'Long delays can cause evidence to deteriorate, affecting fairness.', answer:true, explain:'True.'},
    {id:'U3A2-11-c4', type:'mc', q:'Which body\'s FREE service most directly reduces the impact of costs on access?', options:['Consumer Affairs Victoria','The Supreme Court','The Court of Appeal','A litigation funder'], answer:0, explain:'CAV is free.'},
    {id:'U3A2-11-c5', type:'mc', q:'"Costs make the civil system less efficient." Why would examiners give this little credit?', options:['Efficiency is not a principle of justice','Costs don\'t matter in civil cases','It should say criminal','It is too long'], answer:0, explain:'Link to fairness, equality or access.'}
  ]
}

];
