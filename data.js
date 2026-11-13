/* DIEL_ARY — local, offline data.
   Values are typical textbook, handbook and manufacturer figures for a first-year
   physics project. Real components vary with grade, frequency, temperature and test
   geometry. Each record lists its own conditions; always compare like with like. */

const POLY = "Polymers";
const CRY = "Crystals";
const MIN = "Minerals";
const CER = "Ceramics/Insulators";
const LIQ = "Liquids";
const GAS = "Gases";

const CATS = [POLY, CRY, MIN, LIQ, GAS];

const REFS = [
  {id:"r1",a:"Kittel, C.",t:"Introduction to Solid State Physics",ed:"8th ed.",y:2004,pub:"John Wiley & Sons",isbn:"978-0-471-41526-8",u:"",s:"Crystal structure, polarization, quartz and mica"},
  {id:"r2",a:"Haynes, W. M. (ed.)",t:"CRC Handbook of Chemistry and Physics",ed:"97th ed.",y:2016,pub:"CRC Press",isbn:"978-1-4987-5429-3",u:"",s:"Permittivity of liquids and gases; reference data"},
  {id:"r3",a:"von Hippel, A. R.",t:"Dielectric Materials and Applications",ed:"",y:1954,pub:"MIT Press / John Wiley; Artech House reprint 1995",isbn:"978-1-58053-123-0",u:"",s:"Solid dielectrics, loss tangent and frequency dependence"},
  {id:"r4",a:"Griffiths, D. J.",t:"Introduction to Electrodynamics",ed:"4th ed.",y:2013,pub:"Pearson",isbn:"978-0-321-85656-2",u:"",s:"Capacitance, polarization, electric displacement and energy"},
  {id:"r5",a:"Shackelford, J. F.",t:"Introduction to Materials Science for Engineers",ed:"8th ed.",y:2015,pub:"Pearson",isbn:"978-0-13-382360-9",u:"",s:"Polymers, ceramics and glasses: typical properties"},
  {id:"r6",a:"Kasap, S. O.",t:"Principles of Electronic Materials and Devices",ed:"4th ed.",y:2018,pub:"McGraw-Hill",isbn:"978-0-07-802818-2",u:"",s:"Dielectric materials, polarization mechanisms and loss"},
  {id:"r7",a:"Callister, W. D.; Rethwisch, D. G.",t:"Materials Science and Engineering: An Introduction",ed:"10th ed.",y:2018,pub:"Wiley",isbn:"978-1-119-40549-8",u:"",s:"Polymer and ceramic dielectric behaviour"},
  {id:"r8",a:"ASTM International",t:"ASTM D150-18: Standard Test Methods for AC Loss Characteristics and Permittivity of Solid Electrical Insulation",ed:"",y:2018,pub:"ASTM International",isbn:"",u:"https://www.astm.org/d0150-18.html",s:"How εr and tan δ are measured on solids"},
  {id:"r9",a:"International Electrotechnical Commission",t:"IEC 60243-1:2013 — Electric strength of insulating materials: Test methods",ed:"",y:2013,pub:"IEC",isbn:"",u:"",s:"Dielectric breakdown strength and specimen geometry"},
  {id:"r10",a:"Kaye, G. W. C.; Laby, T. H.",t:"Tables of Physical and Chemical Constants",ed:"16th ed.",y:1995,pub:"Longman / National Physical Laboratory",isbn:"978-0-582-22605-4",u:"https://www.npl.co.uk/kaye-and-laby",s:"Physical constants and material property tables"},
  {id:"r11",a:"National Institute of Standards and Technology",t:"NIST Chemistry WebBook, SRD 69",ed:"",y:2026,pub:"NIST",isbn:"",u:"https://webbook.nist.gov/chemistry/",s:"Thermophysical data and gas properties"}
];

const ATM = "1 atm (ambient)";
const GAS_P = "1 atm";
const rec = (l, er, tan, f, t, p, note) => ({l, er, tan, f, t, p, note: note || ""});

const fr = (a,b) => '<span class="fr"><span>'+a+'</span><span>'+b+'</span></span>';
const E_D = '<i>D</i> = <i>ε</i><sub>0</sub><i>E</i> + <i>P</i>';
const E_P = '<i>P</i> = <i>N</i><i>α</i><i>E</i><sub>loc</sub>';
const E_R = '<i>ε</i><sub>r</sub> = '+fr('<i>ε</i>','<i>ε</i><sub>0</sub>');
const E_LOSS = '<i>ε</i>* = <i>ε</i>′ − j<i>ε</i>″<br>tan <i>δ</i> = '+fr('<i>ε</i>″','<i>ε</i>′')+'<br><i>Q</i> = '+fr('1','tan <i>δ</i>');
const E_C = '<i>C</i> = '+fr('<i>ε</i><sub>0</sub><i>ε</i><sub>r</sub><i>A</i>','<i>d</i>');
const E_ENERGY = '<i>U</i> = ½<i>C</i><i>V</i>² = ½<i>ε</i><sub>0</sub><i>ε</i><sub>r</sub><i>E</i>² × volume';
const E_DEBYE = '<i>ε</i>* = <i>ε</i><sub>∞</sub> + '+fr('<i>ε</i><sub>s</sub> − <i>ε</i><sub>∞</sub>','1 + j<i>ωτ</i>');
const E_BREAK = '<i>E</i><sub>b</sub> = '+fr('<i>V</i><sub>b</sub>','<i>d</i>');

const TOPICS = [
  {
    t:"What is a dielectric?",
    sub:"A dielectric is an insulator that responds to an electric field and can store energy.",
    img:"topic-intro.svg",
    alt:"Cross-section of a parallel-plate capacitor with a teal dielectric slab, electric field lines and bound charges",
    cap:"Figure 1. The electric field shifts bound charges inside the dielectric. This creates surface charges, weakens the field within the material and stores energy there.",
    body:[
      "A dielectric is an electrical insulator: its charges cannot move freely through the material to make a current. Apply an electric field, though, and the positive and negative charges shift slightly in opposite directions. That small shift is called polarization, and it lets the material store electrical energy.",
      "You can see this at work in a capacitor. Place a dielectric between its metal plates and the field nudges charge inside the material, creating bound charges at its surfaces. These charges partly oppose the field inside the dielectric. The material therefore changes how much charge the capacitor can hold, and energy is stored in the polarized material as well as in the field.",
      "Zoom in to the atoms: the positively charged nucleus shifts a little one way while its electron cloud shifts the other. Across many atoms, these tiny shifts add up to a dipole moment per unit volume, written P. The electric displacement D accounts for both the field and the material's response: D = ε0E + P."
    ],
    eq:E_D,
    eqNote:    "Here, D and P are measured in C/m², E in V/m, and ε0 = 8.854 × 10⁻¹² F/m.",
    points:[
      "A dielectric blocks steady current because its charges are bound rather than free to travel through it.",
      "The material's polarization changes the electric field inside a capacitor.",
      "Capacitors, cable insulation, circuit boards and sensor crystals all make use of this response.",
      "There is a limit to how much field an insulator can take. Beyond it, the material can break down and conduct."
    ],
    table:null
  },
  {
    t:"Polarization and its four mechanisms",
    sub:"Four kinds of charge movement help explain how materials respond to changing electric fields.",
    img:"topic-polarization.svg",
    alt:"Four panels showing electronic, ionic, orientation and space-charge polarization mechanisms",
    cap:"Figure 2. Polarization mechanisms respond at different speeds. As the field changes faster, the slowest mechanisms stop keeping up first.",
    body:[
      "Polarization describes how the charges in a material shift or line up when an electric field is applied. Several kinds can happen at once. Because each takes a different amount of time, they cannot all follow a field that changes very quickly.",
      "There are four common mechanisms. In electronic polarization, an atom's electron cloud shifts slightly around its nucleus. In ionic polarization, positive and negative ions move in opposite directions, as they do in crystals such as salt. In orientation polarization, molecules with permanent dipoles turn to line up with the field. Space-charge polarization happens when charges gather at boundaries, defects or electrodes; it is usually the slowest response.",
      "At a slow frequency, all four mechanisms may contribute to a material's permittivity. As the frequency rises, the slower ones drop out, until at optical frequencies electronic polarization is usually the main response. That's why a material's relative permittivity can change with frequency rather than having just one fixed value."
    ],
    eq:E_P,
    eqNote:    "P is polarization (C/m²), N is the number of dipoles per unit volume, α is polarizability, and E_loc is the field acting locally on a dipole. In dense materials, that local field can differ from the average field.",
    points:[
      "Every material has electronic polarization, which can respond even at optical frequencies.",
      "Ionic polarization matters in ionic crystals and ceramics, but not in non-polar polymers.",
      "Orientation polarization needs molecules with permanent dipoles and changes with temperature.",
      "Space-charge effects are slow and can be especially noticeable in uneven or contaminated materials."
    ],
    table:{
      head:["Mechanism","What moves","Typical range","Example"],
      rows:[
        ["Electronic","Electron cloud relative to the nucleus","Up to ~10¹⁵ Hz (optical)","All atoms"],
        ["Ionic","Positive and negative ions in opposite directions","Up to ~10¹³ Hz (infrared)","NaCl, alumina, titanates"],
        ["Orientation","Permanent molecular dipoles rotate","Hz–GHz","Water, glycerol, epoxy"],
        ["Space charge","Free charges pile up at interfaces","Hz–kHz (slowest)","Grain boundaries, electrodes"]
      ]
    }
  },
  {
    t:"Relative permittivity",
    sub:"Relative permittivity tells you how a material changes a capacitor's ability to store charge.",
    img:"topic-permittivity.svg",
    alt:"Two capacitors at the same voltage, one with vacuum and one with a dielectric, showing C equals epsilon-r times C-zero",
    cap:"Figure 3. With the same voltage and geometry, a dielectric-filled capacitor stores εr times the charge of one with a vacuum gap.",
    body:[
      "Relative permittivity, often called the dielectric constant, compares a material's permittivity with that of empty space: εr = ε/ε0. It has no units. A vacuum has εr = 1 exactly, while dry air is only slightly higher—about 1.00059 at room temperature and normal atmospheric pressure.",
      "Put a dielectric into a capacitor and, if its shape stays the same, the capacitance increases by a factor of εr. The voltage doesn't increase; instead, the capacitor can hold more charge at that voltage. That's useful when designing compact capacitors, although a high εr isn't necessarily what you want in cable insulation.",
      "Think of εr as a value with conditions, not a permanent label for a material. It can change with frequency, temperature, moisture, field strength and the material's structure. For example, barium titanate can have a very high εr, while PTFE is close to 2.1. Always check how and when a value was measured."
    ],
    eq:E_R,
    eqNote:    "ε is absolute permittivity (F/m), ε0 = 8.854 × 10⁻¹² F/m, and εr has no units. For the same capacitor, C = εr C0.",
    points:[
      "Vacuum has εr = 1; gases at ordinary pressure are usually very close to 1.",
      "A high εr can help a capacitor store more charge per volt, but may come with greater loss or sensitivity to temperature.",
      "Complex permittivity, ε* = ε′ − jε″, describes both energy storage and energy loss.",
      "A material may have different εr values at 50 Hz, 1 MHz and 10 GHz."
    ],
    table:{
      head:["Material","Typical εr","Condition"],
      rows:[
        ["Vacuum","1","exactly, by definition"],
        ["Dry air","1.00059","20 °C, 1 atm"],
        ["PTFE","2.1","1 MHz, 23 °C"],
        ["Water","78.4","25 °C, low frequency"],
        ["BaTiO3 ceramic","1000–5000","1 kHz, near room temperature"]
      ]
    }
  },
  {
    t:"Dielectric loss",
    sub:"In an alternating field, some of the electrical energy becomes heat inside the material.",
    img:"topic-loss.svg",
    alt:"Phasor diagram showing the loss angle delta and a graph of loss tangent versus frequency",
    cap:"Figure 4. Because the material responds with a slight delay, some current flows in step with the voltage. That part represents energy lost as heat.",
    body:[
      "An alternating electric field keeps changing direction. The material's polarization tries to follow, but dipoles need time to turn, ions need time to shift, and charges need time to gather at interfaces. This delay means a little electrical energy is converted to heat during every cycle.",
      "Complex permittivity helps describe this: ε′ represents the energy-storing response, while ε″ represents the lossy response. Their ratio, tan δ = ε″/ε′, is called the loss tangent. A smaller tan δ generally means less energy is lost as heat; a larger one means the material may heat up more in an AC field. The quality factor Q is the reciprocal of tan δ.",
      "Loss can come from several sources. Small amounts of ions or electrons can carry current; dipoles can lag behind the changing field; and, at much higher frequencies, atoms and molecules can absorb energy as they vibrate. Moisture and contamination often make these losses worse."
    ],
    eq:E_LOSS,
    eqNote:    "ε′ describes the energy-storing part, ε″ the loss part, δ the loss angle, and Q the quality factor.",
    points:[
      "A tan δ of 0.0002 is very low and useful for RF insulation; 0.02 may work for some capacitors but would be lossy for a cable.",
      "Loss often rises when a polarization mechanism is struggling to keep up with the changing field.",
      "In contaminated materials, electrical conduction can be a major source of loss, especially at low frequencies and high temperatures.",
      "If heating increases the loss, the material may heat even more. This feedback needs careful attention in high-power equipment."
    ],
    table:{
      head:["Loss route","Cause","Where it dominates"],
      rows:[
        ["Conduction","Residual free ions or electrons drift","Low frequency, high temperature, contamination"],
        ["Relaxation","Dipoles lag behind the alternating field","Around each polarization cutoff"],
        ["Resonance","Lattice or molecular vibrations absorb energy","Infrared and optical frequencies"]
      ]
    }
  },
  {
    t:"The parallel-plate capacitor",
    sub:"Plate size, spacing and the dielectric together determine how much charge a capacitor can store.",
    img:"topic-capacitor.svg",
    alt:"A parallel-plate capacitor with labelled plate area A, plate separation d and a dielectric slab",
    cap:"Figure 5. A larger plate area or higher permittivity increases capacitance. Moving the plates farther apart decreases it.",
    body:[
      "A simple capacitor has two conducting plates with an insulating dielectric between them. Its capacitance depends on the plate area A, the gap d and the dielectric's relative permittivity εr: C = ε0εrA/d. In plain terms, broad plates and a high-εr dielectric increase capacitance, while a wider gap reduces it.",
      "A capacitor stores energy according to U = ½CV². The energy stored in each unit of volume also depends on the electric field inside the dielectric. So, for energy storage, a high εr is helpful—but so is a high breakdown field. Capacitance alone doesn't tell the whole story.",
      "Real components aren't perfect. They have some resistance, inductance and leakage, and their leads and plate layout become especially important at high frequencies. At high voltages, breakdown may begin at a local weak spot, such as a sharp edge, a tiny air pocket or an impurity."
    ],
    eq:E_C + '<br>' + E_ENERGY,
    eqNote:    "C is capacitance (F), A is plate area (m²), d is plate spacing (m), V is voltage (V), and E is electric field (V/m). The breakdown field is E_b = V_b/d.",
    points:[
      "Double the plate area and capacitance doubles; double the spacing and it halves.",
      "At the same voltage and geometry, doubling εr doubles the charge the capacitor can hold.",
      "Good energy storage depends on both permittivity and breakdown strength.",
      "Breakdown can start at one weak spot, so edges, air pockets and contamination matter."
    ],
    table:null
  },
  {
    t:"Frequency and temperature dependence",
    sub:"A dielectric's properties change with the speed of the field and with temperature.",
    img:"topic-frequency.svg",
    alt:"Graph showing relative permittivity stepping down and loss tangent peaking as frequency increases",
    cap:"Figure 6. At higher frequencies, slower polarization mechanisms can no longer keep up. Relative permittivity falls, while loss rises near each transition.",
    body:[
      "At a low frequency, most polarization mechanisms have time to follow the field, so the relative permittivity is often close to its low-frequency value. Increase the frequency and the slowest mechanisms start to fall behind. As they drop out, εr falls too. Around each transition, the material can absorb extra energy, creating a peak in dielectric loss.",
      "Temperature changes how quickly the material responds as well. Heating usually makes molecules move faster, which can shift a polarization response to a higher frequency. In some materials, temperature also changes the crystal structure. For example, barium titanate's electrical behaviour changes sharply near its Curie temperature.",
      "That's why a number like \"εr = 3\" is missing important information. A more useful report says where and how it was measured—for example, at a stated frequency, temperature and humidity. Field strength and measurement method may matter too."
    ],
    eq:E_DEBYE,
    eqNote:    "εs is the low-frequency permittivity, ε∞ the high-frequency limit, τ the relaxation time, and ω = 2πf. In the Debye model, one relaxation produces a step in ε′ and a peak in ε″.",
    points:[
      "As frequency rises, space-charge response usually drops out first, followed by orientation, ionic and then electronic response.",
      "Water's relative permittivity falls from about 78 at low frequency to about 5 in the optical range.",
      "For a Debye relaxation, the loss peak occurs near ωτ ≈ 1.",
      "Temperature can shift a material's response and, in ferroelectrics, may change its crystal phase."
    ],
    table:{
      head:["Change","Effect on a dielectric"],
      rows:[
        ["Frequency increases","Slower mechanisms drop out; εr steps down; loss peaks at relaxations"],
        ["Temperature increases","Molecular motion speeds up; relaxation shifts; conduction loss rises"],
        ["Moisture increases","εr rises, loss rises and breakdown strength falls"],
        ["Field increases","Ferroelectrics become non-linear; loss and heating rise"]
      ]
    }
  },
  {
    t:"Choosing a dielectric for an application",
    sub:"Choose a dielectric by balancing the electrical, practical and environmental needs of the job.",
    img:"topic-applications.svg",
    alt:"Six application tiles for capacitors, cables, RF boards, sensors, power equipment and insulation",
    cap:"Figure 7. A property that helps in one application may be a drawback in another, so material choice is always a balancing act.",
    body:[
      "There isn't one dielectric that is best for every job. A capacitor often benefits from high εr, strong resistance to breakdown and low loss. High-frequency cables and circuit boards usually need a low, stable εr and low loss so signals can travel with less distortion. Power insulation needs to resist electrical breakdown, heat, moisture and aging.",
      "The material also has to work in the real world. Can it be shaped and manufactured reliably? Will it stay compatible with the conductors and survive the expected temperature, humidity and operating cycles? Cost and recyclability matter too. A material can be excellent on paper and still be the wrong choice for a product.",
      "These trade-offs explain common choices: PTFE is popular for RF applications; polyethylene is widely used in cables; polypropylene films are used in capacitors; epoxy protects circuits; alumina and porcelain are used in high-voltage insulation; transformer oil helps insulate and cool power equipment; quartz is useful in timing and sensors; and barium-titanate ceramics help make compact, high-capacitance components."
    ],
    eq:E_ENERGY,
    eqNote:    "For energy storage, both permittivity and breakdown strength matter. A material with very high εr may store less usable energy if it breaks down at a low field.",
    points:[
      "RF and microwave parts need low, stable εr and low tan δ.",
      "Power capacitors benefit from high εr, high breakdown strength and low loss.",
      "Cable insulation must be tough, flexible and resistant to breakdown and aging.",
      "Quartz helps provide stable timing and sensing; high-permittivity ceramics help shrink capacitors."
    ],
    table:{
      head:["Application","Key property","Typical materials"],
      rows:[
        ["Energy-storage capacitors","High εr and high breakdown strength","BaTiO3, TiO2, metallized polypropylene"],
        ["RF and microwave","Low, stable εr and low tan δ","PTFE, fused silica, sapphire"],
        ["Power cables","High breakdown, flexibility, low loss","XLPE, EPR, paper/oil"],
        ["High-voltage equipment","High resistivity and breakdown strength","Transformer oil, epoxy, porcelain"],
        ["Sensors and timing","Piezoelectric stability and low loss","Quartz, PZT"]
      ]
    }
  }
];

const M_ALL = [
  {
    id:1, n:"PTFE (Teflon)", c:POLY,
    tagline:"The benchmark low-loss fluoropolymer.",
    d:"Polytetrafluoroethylene is a fully fluorinated, non-polar thermoplastic. Its symmetric C–F bonds cancel electrically, giving one of the lowest permittivities and loss tangents of any solid dielectric. It is chemically inert and stable over a wide temperature range.",
    ap:"Coaxial and RF cables, microwave PCB substrates, high-voltage wire insulation, laboratory tubing and seals.",
    b:"Non-polar chains polarize almost entirely by electron-cloud displacement. εr stays near 2.1 and tan δ near 2 × 10⁻⁴ over a broad frequency range; loss rises only at very high frequency or after contamination.",
    comp:"Pure, unfilled, sintered PTFE",
    me:"Typical values from standard dielectric tests and manufacturer data (ASTM D150)",
    polar:"Non-polar", pol:"Electronic",
    bd:"20–60 kV/mm (thickness dependent)",
    rho:">10¹⁸ Ω·cm",
    tmax:"260 °C continuous",
    dens:"2.14–2.20 g/cm³",
    wa:"<0.01%",
    adv:["Lowest practical εr and tan δ among common solids","Chemically inert and hydrophobic","Wide service temperature range","Excellent arc and tracking resistance"],
    lim:["Cold flow under sustained load","Expensive and difficult to bond","Low stiffness compared with engineering plastics","Poor radiation resistance in some grades"],
    r:["r3","r5","r7"],
    rel:[2,3,5],
    m:[
      rec("1 kHz, 23 °C","2.1","0.0002","1 kHz","23 °C",ATM,"typical unfilled PTFE"),
      rec("1 MHz, 23 °C","2.1","0.0002","1 MHz","23 °C",ATM,"standard RF grade"),
      rec("10 GHz, 23 °C","2.08","0.0003","10 GHz","23 °C",ATM,"microwave data; grade dependent")
    ]
  },
  {
    id:2, n:"Polyethylene (PE)", c:POLY,
    tagline:"Affordable non-polar cable insulation.",
    d:"Polyethylene is a non-polar hydrocarbon thermoplastic available in low-density, linear low-density and high-density grades. Its low dielectric loss makes it the workhorse of power and coaxial cable insulation. Cross-linked polyethylene (XLPE) is used where higher temperature ratings are needed.",
    ap:"Power cable insulation (XLPE), coaxial cables, capacitor films, packaging and laboratory ware.",
    b:"Electronic polarization dominates. εr is about 2.3 and tan δ about 2 × 10⁻⁴ at 1 MHz. XLPE trades some flexibility for a higher continuous temperature rating.",
    comp:"Unfilled PE; XLPE is cross-linked by peroxide or silane",
    me:"Typical values for unfilled resin (ASTM D150)",
    polar:"Non-polar", pol:"Electronic",
    bd:"20–40 kV/mm (short-time; thickness dependent)",
    rho:">10¹⁶ Ω·cm",
    tmax:"80–90 °C (PE); 105–125 °C (XLPE)",
    dens:"0.91–0.96 g/cm³",
    wa:"<0.01%",
    adv:["Very low dielectric loss","Excellent chemical resistance and flexibility","Low cost and easy processing","High breakdown strength in thin insulation"],
    lim:["Low melting point in unstabilised grades","Susceptible to environmental stress cracking","XLPE is difficult to recycle","Space-charge accumulation under high DC fields"],
    r:["r3","r5","r7"],
    rel:[1,3,8],
    m:[
      rec("50 Hz, 23 °C","2.3","0.0002","50 Hz","23 °C",ATM,"unfilled LDPE"),
      rec("1 MHz, 23 °C","2.3","0.0002","1 MHz","23 °C",ATM,"typical PE"),
      rec("1 GHz, 23 °C","2.3","0.0003","1 GHz","23 °C",ATM,"low-loss cable grade")
    ]
  },
  {
    id:3, n:"Polystyrene (PS)", c:POLY,
    tagline:"Rigid, low-loss and dimensionally stable.",
    d:"General-purpose polystyrene is an amorphous, non-polar thermoplastic. It offers very low dielectric loss and good dimensional stability, making it a classic laboratory and RF insulator. Its brittleness limits use in demanding mechanical applications.",
    ap:"Film capacitors, RF insulation, laboratory ware, high-frequency coil formers and display components.",
    b:"Non-polar aromatic chains polarize electronically. εr is about 2.55 and tan δ about 2 × 10⁻⁴ at 1 MHz. Loss stays low over a wide frequency range, but the material is brittle.",
    comp:"General-purpose, unfilled polystyrene",
    me:"Typical handbook values (1 MHz)",
    polar:"Non-polar", pol:"Electronic",
    bd:"20–30 kV/mm",
    rho:">10¹⁶ Ω·cm",
    tmax:"70–80 °C continuous",
    dens:"1.04–1.06 g/cm³",
    wa:"0.01–0.03%",
    adv:["Very low loss and stable εr","Clear, rigid and easy to mould","Low cost","Good dimensional stability"],
    lim:["Brittle and prone to stress cracking","Low heat resistance","Attacked by many organic solvents","Poor impact strength"],
    r:["r3","r5","r7"],
    rel:[1,2,5],
    m:[
      rec("1 kHz, 23 °C","2.55","0.0002","1 kHz","23 °C",ATM,"general-purpose grade"),
      rec("1 MHz, 23 °C","2.55","0.0002","1 MHz","23 °C",ATM,"typical data"),
      rec("100 MHz, 23 °C","2.54","0.0003","100 MHz","23 °C",ATM,"RF insulation grade")
    ]
  },
  {
    id:4, n:"Polypropylene (PP)", c:POLY,
    tagline:"The capacitor-film standard.",
    d:"Polypropylene is a semi-crystalline, non-polar polyolefin. Biaxially oriented PP (BOPP) film is the dominant dielectric in film capacitors because of its low loss, high breakdown strength and self-healing behaviour when metallized.",
    ap:"Film capacitors, power cable insulation, battery separators and packaging.",
    b:"Non-polar chains give electronic polarization only. εr is about 2.2 and tan δ is 2–5 × 10⁻⁴. Low water uptake keeps the properties stable, and thin BOPP films withstand very high fields.",
    comp:"Isotactic homopolymer, unfilled; BOPP for capacitor film",
    me:"Typical BOPP film data and standard dielectric tests",
    polar:"Non-polar", pol:"Electronic",
    bd:"20–30 kV/mm (bulk); 150–300 kV/mm (thin BOPP film)",
    rho:">10¹⁶ Ω·cm",
    tmax:"100–105 °C continuous",
    dens:"0.90–0.91 g/cm³",
    wa:"<0.01%",
    adv:["Low loss and high breakdown strength in thin film","Cheap and widely available","Metallized film can self-heal after a local breakdown","Low water uptake"],
    lim:["Low melting point and poor creep resistance","Oxidises under UV unless stabilised","Lower stiffness than engineering plastics","Capacitance changes with temperature and aging"],
    r:["r3","r5","r7"],
    rel:[1,2,9],
    m:[
      rec("50 Hz, 23 °C","2.2","0.0002","50 Hz","23 °C",ATM,"BOPP capacitor film"),
      rec("1 kHz, 23 °C","2.2","0.0003","1 kHz","23 °C",ATM,"typical film"),
      rec("1 MHz, 23 °C","2.2","0.0005","1 MHz","23 °C",ATM,"frequency-dependent loss")
    ]
  },
  {
    id:5, n:"Polycarbonate (PC)", c:POLY,
    tagline:"Tough engineering dielectric.",
    d:"Polycarbonate is an amorphous engineering thermoplastic with high impact strength and good optical clarity. It is moderately polar, so its loss is higher than polyolefins, but its toughness and heat resistance are valuable in electrical hardware.",
    ap:"Capacitor films, insulating housings, connectors and transparent safety parts.",
    b:"Ester and carbonate groups give weak dipolar polarization. εr is 2.9–3.0 and tan δ rises with frequency and temperature. The material is tough but more lossy than polypropylene.",
    comp:"Unfilled bisphenol-A polycarbonate",
    me:"Typical values from manufacturer data and ASTM D150 tests",
    polar:"Weakly polar", pol:"Electronic + dipolar",
    bd:"15–30 kV/mm",
    rho:"10¹⁵–10¹⁶ Ω·cm",
    tmax:"115–130 °C",
    dens:"1.20–1.22 g/cm³",
    wa:"0.15–0.35%",
    adv:["High impact strength and toughness","Good optical clarity","Useful heat resistance","Dimensionally stable"],
    lim:["Higher loss than polyolefins","Susceptible to hydrolysis and some solvents","Higher water absorption","Not the first choice for RF"],
    r:["r5","r7","r8"],
    rel:[1,6,8],
    m:[
      rec("50 Hz, 23 °C","3.0","0.001","50 Hz","23 °C",ATM,"unfilled resin"),
      rec("1 kHz, 23 °C","3.0","0.002","1 kHz","23 °C",ATM,"typical data"),
      rec("1 MHz, 23 °C","2.9","0.01","1 MHz","23 °C",ATM,"loss rises with frequency")
    ]
  },
  {
    id:6, n:"Epoxy resin", c:POLY,
    tagline:"Thermoset encapsulation and PCB dielectric.",
    d:"A cured thermosetting polymer made from epoxide prepolymers and hardeners. Cross-linking creates a rigid, infusible network used to encapsulate, bond and insulate electrical components. Formulation and cure schedule strongly affect the final properties.",
    ap:"PCB laminates (FR-4), potting, transformer insulation, high-voltage bushings and adhesives.",
    b:"Polar hydroxyl and ether groups give moderate εr and loss. εr falls slowly with frequency while tan δ rises. Fillers such as silica reduce thermal expansion and can lower loss; moisture increases both εr and loss.",
    comp:"Cured bisphenol-A epoxy, unfilled (typical); FR-4 contains glass fabric and filler",
    me:"Typical cured-resin values; filler type and cure affect results",
    polar:"Polar", pol:"Electronic + dipolar",
    bd:"15–25 kV/mm",
    rho:"10¹⁴–10¹⁶ Ω·cm",
    tmax:"130–150 °C (standard grades; high-Tg grades higher)",
    dens:"1.10–1.30 g/cm³",
    wa:"0.1–0.5%",
    adv:["Excellent adhesion to many surfaces","Low shrinkage and good dimensional stability","Properties can be tuned with fillers and hardeners","Good chemical resistance"],
    lim:["Unfilled resin is brittle","Cure and formulation strongly affect performance","Moisture uptake raises loss","Difficult to recycle"],
    r:["r3","r5","r8"],
    rel:[1,5,8],
    m:[
      rec("50 Hz, 23 °C","3.8","0.01","50 Hz","23 °C",ATM,"unfilled cured resin"),
      rec("1 kHz, 23 °C","3.6","0.02","1 kHz","23 °C",ATM,"typical cast resin"),
      rec("1 MHz, 23 °C","3.4","0.03","1 MHz","23 °C",ATM,"loss rises with frequency")
    ]
  },
  {
    id:7, n:"Polyimide (Kapton)", c:POLY,
    tagline:"High-temperature flexible dielectric.",
    d:"Polyimide is a family of aromatic polymers containing imide rings. Aromatic polyimide film combines high thermal stability, good electrical strength and flexibility, making it important in aerospace, flexible circuits and high-temperature insulation.",
    ap:"Flexible printed circuits, motor slot liners, aerospace wire insulation and high-temperature capacitors.",
    b:"Polar imide groups give εr about 3.4–3.5 and tan δ about 0.002 at 1 kHz. Properties remain usable from cryogenic temperatures to above 250 °C. Absorbed moisture increases both εr and loss.",
    comp:"Aromatic polyimide film, unfilled",
    me:"Typical film data (1 kHz, 23 °C, dry)",
    polar:"Polar", pol:"Electronic + dipolar",
    bd:"150–300 kV/mm (thin film)",
    rho:">10¹⁶ Ω·cm",
    tmax:"260 °C continuous (short excursions higher)",
    dens:"1.42–1.43 g/cm³",
    wa:"1–2%",
    adv:["High thermal stability","Flexible and mechanically strong","Good radiation resistance","Thin films have very high breakdown strength"],
    lim:["Hygroscopic; properties depend on moisture","Higher loss than PTFE or polypropylene","Expensive","Can degrade hydrolytically at high temperature and humidity"],
    r:["r3","r5","r8"],
    rel:[5,6,9],
    m:[
      rec("1 kHz, 23 °C","3.5","0.002","1 kHz","23 °C",ATM,"dry film"),
      rec("1 MHz, 23 °C","3.4","0.004","1 MHz","23 °C",ATM,"typical film"),
      rec("1 kHz, 23 °C (50% RH)","3.8","0.006","1 kHz","23 °C",ATM,"moisture raises both values")
    ]
  },
  {
    id:8, n:"Natural rubber", c:POLY,
    tagline:"Elastomer for flexible insulation.",
    d:"Natural rubber is cis-1,4-polyisoprene obtained from Hevea latex. Unfilled gum rubber is a low-loss dielectric; vulcanization and fillers modify both mechanical and electrical properties. Carbon-black fillers raise permittivity and loss.",
    ap:"Cable insulation, gloves, gaskets, flexible high-voltage insulation and vibration mounts.",
    b:"The non-polar hydrocarbon backbone polarizes electronically. Gum rubber has εr about 2.4; carbon-black-filled compounds can reach 4–10 and become much lossier. Ageing and moisture reduce insulation resistance.",
    comp:"Gum (unfilled) natural rubber; compounds contain sulphur, accelerators and fillers",
    me:"Typical values; strongly formulation dependent",
    polar:"Non-polar (gum)", pol:"Electronic",
    bd:"20–30 kV/mm (gum); lower for filled compounds",
    rho:"10¹⁴–10¹⁵ Ω·cm (gum)",
    tmax:"70–80 °C continuous",
    dens:"0.92–1.00 g/cm³ (gum); higher when filled",
    wa:"0.5–2%",
    adv:["Excellent flexibility and elastic recovery","Low cost and good tear strength","Gum rubber has low dielectric loss","Easy to formulate for specific properties"],
    lim:["Ozone and UV ageing","Properties depend strongly on formulation","Fillers increase loss","Limited temperature range"],
    r:["r3","r5","r7"],
    rel:[2,6,5],
    m:[
      rec("1 kHz, 23 °C","2.4","0.002","1 kHz","23 °C",ATM,"unfilled gum rubber"),
      rec("1 MHz, 23 °C","2.4","0.003","1 MHz","23 °C",ATM,"gum rubber"),
      rec("1 kHz, 23 °C","6.0","0.05","1 kHz","23 °C",ATM,"carbon-black-filled compound; formulation dependent")
    ]
  },
  {
    id:9, n:"PET film (Mylar)", c:POLY,
    tagline:"Strong, clear capacitor film.",
    d:"Polyethylene terephthalate is a semi-crystalline polyester. Biaxially oriented PET film has high tensile strength, good dielectric strength and moderate loss, making it a common general-purpose capacitor and flexible-circuit dielectric.",
    ap:"Film capacitors, flexible circuits, motor insulation, magnetic tape and packaging.",
    b:"Polar ester groups produce εr about 3.2 and tan δ about 0.002 at 1 kHz. Loss rises at high frequency and temperature. PET absorbs some moisture, so drying matters in precision applications.",
    comp:"Biaxially oriented, unfilled PET film",
    me:"Typical film data; grade and orientation affect results",
    polar:"Polar", pol:"Electronic + dipolar",
    bd:"150–300 kV/mm (thin film)",
    rho:">10¹⁶ Ω·cm",
    tmax:"120–150 °C (grade dependent)",
    dens:"1.33–1.40 g/cm³",
    wa:"0.2–0.5%",
    adv:["High tensile strength and toughness","Good dielectric strength in thin film","Low cost and widely available","Metallized film can self-heal"],
    lim:["Hygroscopic compared with polyolefins","Higher loss than polypropylene","Hydrolytic degradation at high temperature and humidity","Limited high-frequency performance"],
    r:["r3","r5","r7"],
    rel:[4,5,7],
    m:[
      rec("1 kHz, 23 °C","3.2","0.002","1 kHz","23 °C",ATM,"BOPET film"),
      rec("1 MHz, 23 °C","3.0","0.005","1 MHz","23 °C",ATM,"typical film"),
      rec("1 kHz, 23 °C (50% RH)","3.3","0.004","1 kHz","23 °C",ATM,"moisture effect")
    ]
  },
  {
    id:10, n:"Quartz", c:CRY,
    tagline:"Piezoelectric crystal with exceptional stability.",
    d:"Alpha-quartz is a crystalline form of silicon dioxide. Its ordered SiO4 tetrahedral lattice is piezoelectric, and its very low loss and temperature stability make it essential in frequency control and precision sensors. It is different from amorphous fused silica.",
    ap:"Crystal oscillators and filters, piezoelectric sensors, optical components and precision capacitors.",
    b:"Anisotropic: εr is about 4.4 perpendicular and 4.6 parallel to the optic (c) axis. Electronic and ionic polarization contribute, with tan δ below 10⁻⁴. The piezoelectric effect couples mechanical strain to charge.",
    comp:"Single-crystal α-SiO2",
    me:"Standard crystal data; crystallographic orientation must be specified",
    polar:"Non-polar crystal (piezoelectric)", pol:"Electronic + ionic",
    bd:"10–25 kV/mm (bulk; defects matter)",
    rho:">10¹⁸ Ω·cm",
    tmax:"≈500 °C practical; α→β transition at 573 °C",
    dens:"2.65 g/cm³",
    wa:"0% (non-porous)",
    adv:["Extremely stable frequency reference","Very low loss","Piezoelectric and optically useful","Hard and chemically inert"],
    lim:["Brittle and difficult to grow","Properties are anisotropic","Expensive for large pieces","Limited by the α→β phase transition near 573 °C"],
    r:["r1","r3","r6"],
    rel:[11,1,19],
    m:[
      rec("1 kHz, 25 °C, ⊥ c-axis","4.4","0.0001","1 kHz","25 °C",ATM,"perpendicular to optic axis"),
      rec("1 kHz, 25 °C, ∥ c-axis","4.6","0.0001","1 kHz","25 °C",ATM,"parallel to optic axis"),
      rec("1 MHz, 25 °C, ⊥ c-axis","4.4","0.00005","1 MHz","25 °C",ATM,"low-loss crystal")
    ]
  },
  {
    id:11, n:"Mica (muscovite)", c:MIN,
    tagline:"Layered mineral for high-temperature capacitors.",
    d:"Mica is a group of layered silicate minerals. Muscovite is the most common electrical grade; it can be cleaved into thin, flexible, uniform sheets with excellent dielectric strength and thermal stability.",
    ap:"Mica capacitors, commutator insulation, heating-element supports and vacuum-tube spacers.",
    b:"The layered structure gives εr of 5–7 depending on direction and mica type. Loss is low and stable over a wide temperature range. Natural variability and air inclusions can reduce breakdown strength.",
    comp:"Muscovite, KAl2(AlSi3O10)(OH)2 (typical electrical mica)",
    me:"Typical electrical-grade mica data; direction and sheet thickness matter",
    polar:"Non-polar layered silicate", pol:"Electronic + ionic",
    bd:"60–200 kV/mm (thin sheets)",
    rho:"10¹⁵–10¹⁷ Ω·cm",
    tmax:"≈500 °C for muscovite; phlogopite grades higher",
    dens:"2.7–3.0 g/cm³",
    wa:"0.1–0.5%",
    adv:["Excellent high-temperature stability","Low loss and high breakdown strength","Can be cleaved into flexible thin sheets","Chemically and thermally robust"],
    lim:["Anisotropic and naturally variable","Air inclusions and impurities weaken sheets","Not suitable for complex moulded shapes","Supply quality varies"],
    r:["r1","r3","r6"],
    rel:[10,1,2],
    m:[
      rec("1 kHz, 25 °C, in-plane","6.5","0.0002","1 kHz","25 °C",ATM,"muscovite sheet"),
      rec("1 MHz, 25 °C, in-plane","6.0","0.0003","1 MHz","25 °C",ATM,"typical electrical grade"),
      rec("1 kHz, 25 °C, perpendicular","5.5","0.0005","1 kHz","25 °C",ATM,"direction-dependent")
    ]
  },
  {
    id:12, n:"Diamond", c:CRY,
    tagline:"The ultimate thermal conductor among dielectrics.",
    d:"Diamond is a wide-band-gap covalent crystal. Its rigid sp³ lattice gives very high dielectric strength, low loss and the highest thermal conductivity of any bulk solid. High-quality single crystal and CVD diamond are used in extreme electronics and optics.",
    ap:"High-power RF windows, radiation detectors, heat spreaders and precision optical components.",
    b:"Electronic polarization dominates. εr is about 5.7 and tan δ is below 10⁻⁵ in high-quality material. Defects, grain boundaries and doping reduce breakdown strength and increase loss.",
    comp:"Single-crystal or polycrystalline CVD diamond; type IIa for best electrical properties",
    me:"Typical high-quality single-crystal data; defects and thickness matter",
    polar:"Non-polar covalent crystal", pol:"Electronic",
    bd:"Very high; ≈1000–2000 kV/mm for high-quality single crystal (thickness dependent)",
    rho:">10¹⁶ Ω·cm (type IIa)",
    tmax:"≈1000 °C in inert or vacuum; oxidises in air above ~600 °C",
    dens:"3.51 g/cm³",
    wa:"0%",
    adv:["Highest thermal conductivity of any bulk solid","Extreme breakdown strength","Very low dielectric loss","Radiation hard and chemically inert"],
    lim:["Very expensive and limited in area","Brittle and difficult to shape","Difficult to dope and contact","Oxidises in air at high temperature"],
    r:["r1","r3","r6"],
    rel:[13,10,17],
    m:[
      rec("1 kHz, 25 °C","5.7","0.00001","1 kHz","25 °C",ATM,"high-quality single crystal"),
      rec("1 MHz, 25 °C","5.7","0.00002","1 MHz","25 °C",ATM,"type IIa"),
      rec("10 GHz, 25 °C","5.6","0.00003","10 GHz","25 °C",ATM,"low microwave loss")
    ]
  },
  {
    id:13, n:"Sapphire (Al2O3 crystal)", c:CRY,
    tagline:"Hard, low-loss crystal for RF and optics.",
    d:"Sapphire is single-crystal aluminium oxide. It is chemically inert, extremely hard and has very low dielectric loss, making it useful as an RF substrate, insulating window and precision mechanical component.",
    ap:"RF and microwave substrates, high-voltage insulating windows, optical components and wear parts.",
    b:"Anisotropic εr: about 9.3 perpendicular and 11.5 parallel to the c-axis. Electronic and ionic polarization contribute; loss is very low at microwave frequencies. The material is an excellent thermal conductor for a dielectric.",
    comp:"Single-crystal α-Al2O3",
    me:"Typical optical-grade sapphire data; orientation matters",
    polar:"Non-polar crystal", pol:"Electronic + ionic",
    bd:"Very high; >100 kV/mm for thin polished specimens (thickness dependent)",
    rho:">10¹⁶ Ω·cm",
    tmax:"≈1000 °C in air; higher in inert atmosphere",
    dens:"3.98 g/cm³",
    wa:"0%",
    adv:["Very low microwave loss","High hardness and wear resistance","Chemically inert","Good thermal conductivity"],
    lim:["Expensive and brittle","Anisotropic properties","Difficult to machine","Higher εr than polymers"],
    r:["r1","r3","r6"],
    rel:[10,12,17],
    m:[
      rec("1 kHz, 25 °C, ⊥ c-axis","9.3","0.00005","1 kHz","25 °C",ATM,"optical-grade sapphire"),
      rec("1 kHz, 25 °C, ∥ c-axis","11.5","0.00005","1 kHz","25 °C",ATM,"orientation effect"),
      rec("10 GHz, 25 °C","9.4","0.00002","10 GHz","25 °C",ATM,"RF substrate data")
    ]
  },
  {
    id:14, n:"Alumina (96% Al2O3)", c:CER,
    tagline:"Workhorse technical ceramic.",
    d:"Alumina ceramics are sintered aluminium oxide. The 96% grade balances cost, strength and electrical insulation and is widely used for substrates, feedthroughs and high-voltage insulators. The remaining glass phase affects loss and breakdown.",
    ap:"IC substrates, high-voltage insulators, spark plugs, vacuum feedthroughs and wear parts.",
    b:"Electronic and ionic polarization give εr about 9–10. Loss is low and stable. Glassy grain-boundary phases in 96% material slightly increase loss; high-purity alumina has lower loss but higher cost.",
    comp:"96% Al2O3 with a silicate glass phase (typical)",
    me:"Typical 96% alumina data; purity and porosity affect results",
    polar:"Non-polar ceramic", pol:"Electronic + ionic",
    bd:"10–20 kV/mm (thickness dependent)",
    rho:">10¹⁴ Ω·cm",
    tmax:"≈1500 °C",
    dens:"3.7–3.9 g/cm³",
    wa:"<0.01%",
    adv:["Hard, wear-resistant and high-temperature","Good electrical insulation","Low cost for a technical ceramic","Chemically stable"],
    lim:["Brittle and sensitive to thermal shock","Higher εr than polymers","Glass phase can increase loss","Machining requires diamond tooling"],
    r:["r3","r5","r6"],
    rel:[15,18,16],
    m:[
      rec("1 kHz, 25 °C","9.5","0.0005","1 kHz","25 °C",ATM,"96% dense alumina"),
      rec("1 MHz, 25 °C","9.2","0.0008","1 MHz","25 °C",ATM,"typical substrate"),
      rec("10 GHz, 25 °C","9.0","0.0002","10 GHz","25 °C",ATM,"microwave substrate")
    ]
  },
  {
    id:15, n:"Barium titanate (BaTiO3)", c:CER,
    tagline:"High-permittivity ferroelectric ceramic.",
    d:"Barium titanate is a ferroelectric perovskite ceramic with very high permittivity near room temperature. It is the basis of many class-II multilayer ceramic capacitors and is also piezoelectric and nonlinear.",
    ap:"Multilayer ceramic capacitors (MLCCs), PTC thermistors, piezoelectric transducers and memory elements.",
    b:"Ferroelectric domains and the cubic–tetragonal transition near 120–130 °C produce εr of 1000–5000 at 1 kHz. The value depends strongly on field, temperature, grain size and doping. Loss is higher than in class-I ceramics.",
    comp:"Polycrystalline BaTiO3, usually doped or formulated with additives",
    me:"Typical undoped ceramic values; capacitor grades are heavily engineered",
    polar:"Ferroelectric (polar)", pol:"Electronic + ionic + domain wall",
    bd:"5–10 kV/mm (dense ceramic, thickness dependent)",
    rho:"10¹⁰–10¹² Ω·cm (undoped, room temperature)",
    tmax:"≈120 °C (Curie point; capacitance drops above)",
    dens:"5.8–6.0 g/cm³",
    wa:"<0.1%",
    adv:["Very high capacitance density","Mature, low-cost MLCC technology","Properties tunable by doping and processing","Piezoelectric and nonlinear effects are useful"],
    lim:["Strong temperature and voltage dependence","Higher loss than class-I ceramics","Aging and fatigue under field","Limited temperature range around the Curie point"],
    r:["r1","r3","r6"],
    rel:[18,14,13],
    m:[
      rec("1 kHz, 25 °C","1800","0.02","1 kHz","25 °C",ATM,"undoped dense ceramic"),
      rec("1 kHz, 125 °C","6000","0.03","1 kHz","125 °C",ATM,"near the Curie peak"),
      rec("1 MHz, 25 °C","1200","0.04","1 MHz","25 °C",ATM,"frequency dependence")
    ]
  },
  {
    id:16, n:"Borosilicate glass", c:CER,
    tagline:"Low-expansion insulating glass.",
    d:"Borosilicate glass contains silica and boron oxide. Its low thermal expansion and good chemical durability make it a common laboratory and electrical insulator. Alkali content affects loss and conductivity.",
    ap:"Laboratory glassware, insulators, vacuum envelopes, capacitors and display substrates.",
    b:"The amorphous network polarizes electronically and ionically. εr is about 4.6–5.0 and tan δ about 0.001–0.005 at 1 MHz. Ionic conduction rises at high temperature, especially in alkali-containing glasses.",
    comp:"Borosilicate glass (typically ~81% SiO2, ~13% B2O3, ~4% Na2O/K2O)",
    me:"Typical borosilicate glass data (1 MHz, 25 °C)",
    polar:"Polar (ionic)", pol:"Electronic + ionic",
    bd:"10–30 kV/mm (thickness dependent)",
    rho:">10¹⁵ Ω·cm",
    tmax:"≈500 °C continuous; softening above 800 °C",
    dens:"2.23–2.25 g/cm³",
    wa:"0% (non-porous)",
    adv:["Transparent and chemically durable","Low thermal expansion","Low cost and easy to form","Good electrical insulation at room temperature"],
    lim:["Brittle and sensitive to thermal shock","Ionic conduction at high temperature","Loss higher than fused silica","Limited dielectric strength in thick sections"],
    r:["r3","r5","r6"],
    rel:[17,14,18],
    m:[
      rec("1 kHz, 25 °C","5.0","0.002","1 kHz","25 °C",ATM,"typical borosilicate"),
      rec("1 MHz, 25 °C","4.8","0.004","1 MHz","25 °C",ATM,"alkali content matters"),
      rec("1 kHz, 150 °C","5.2","0.01","1 kHz","150 °C",ATM,"ionic conduction rises")
    ]
  },
  {
    id:17, n:"Fused silica", c:CER,
    tagline:"Ultra-pure glass with outstanding stability.",
    d:"Fused silica is amorphous SiO2 made by melting high-purity quartz. It combines very low loss, high breakdown strength and excellent thermal shock resistance. It is used in optics, semiconductor equipment and high-voltage insulation.",
    ap:"Optical fibers, UV optics, high-voltage insulators, semiconductor parts and RF windows.",
    b:"Amorphous silica has electronic and ionic polarization. εr is about 3.8 and tan δ about 10⁻⁴ at 1 MHz, with a very low temperature coefficient. Purity controls loss and breakdown strength.",
    comp:"Synthetic or natural fused SiO2, high purity",
    me:"Typical high-purity fused silica data",
    polar:"Non-polar glass", pol:"Electronic + ionic",
    bd:"10–25 kV/mm (bulk; thickness dependent)",
    rho:">10¹⁸ Ω·cm",
    tmax:"≈1000 °C continuous; softening ≈1600 °C",
    dens:"2.20 g/cm³",
    wa:"0%",
    adv:["Very low loss and high resistivity","Excellent thermal shock resistance","Transparent from UV to infrared","Chemically pure and stable"],
    lim:["Brittle and expensive","Difficult to fabricate","Lower εr than alumina or titanates","Devitrification at very high temperature"],
    r:["r1","r3","r6"],
    rel:[10,16,14],
    m:[
      rec("1 kHz, 25 °C","3.8","0.0001","1 kHz","25 °C",ATM,"high-purity fused silica"),
      rec("1 MHz, 25 °C","3.8","0.0001","1 MHz","25 °C",ATM,"typical optical grade"),
      rec("10 GHz, 25 °C","3.8","0.0002","10 GHz","25 °C",ATM,"RF window grade")
    ]
  },
  {
    id:18, n:"Titanium dioxide (TiO2) ceramic", c:CER,
    tagline:"High-permittivity ceramic for capacitors and resonators.",
    d:"Titanium dioxide in the rutile phase is a high-permittivity ceramic. Its high εr and low microwave loss make it useful in class-I capacitors, dielectric resonators and filters. Stoichiometry and additives control the temperature coefficient.",
    ap:"Class-I ceramic capacitors, dielectric resonators, filters and microwave substrates.",
    b:"Ionic polarization of TiO6 octahedra gives εr of about 80–100. Single crystals are anisotropic. tan δ is low at microwave frequencies, but defects and impurities increase loss. Additives tune the temperature coefficient.",
    comp:"Polycrystalline TiO2 (rutile), high purity",
    me:"Typical rutile ceramic data; purity and microstructure matter",
    polar:"Polar ceramic", pol:"Electronic + ionic",
    bd:"5–10 kV/mm",
    rho:">10¹² Ω·cm",
    tmax:"≈1000 °C",
    dens:"4.2–4.3 g/cm³",
    wa:"<0.1%",
    adv:["High εr for compact capacitors","Low microwave loss in good material","Good temperature stability with additives","Chemically stable"],
    lim:["Brittle and difficult to machine","Loss sensitive to defects and stoichiometry","High εr can cause impedance mismatch","Not suitable for high-voltage insulation"],
    r:["r1","r3","r6"],
    rel:[15,14,13],
    m:[
      rec("1 kHz, 25 °C","90","0.002","1 kHz","25 °C",ATM,"rutile ceramic"),
      rec("1 MHz, 25 °C","85","0.001","1 MHz","25 °C",ATM,"typical data"),
      rec("10 GHz, 25 °C","100","0.0002","10 GHz","25 °C",ATM,"resonator grade")
    ]
  },
  {
    id:19, n:"Deionized water", c:LIQ,
    tagline:"Polar liquid with exceptionally high permittivity.",
    d:"Pure water is a strongly polar, hydrogen-bonded liquid. Its large dipole moment gives εr around 78 at room temperature. Dissolved ions make ordinary water conductive, so only ultra-pure deionized water is used in dielectric studies and pulsed-power research.",
    ap:"Pulsed-power capacitors, dielectric spectroscopy reference, cooling and research on water structure.",
    b:"Orientation polarization of water molecules gives εr ≈ 78 at low frequency. A Debye relaxation near 17–20 GHz drops εr to about 5 in the optical limit. Conductivity, not bulk polarization, limits its use as an insulator.",
    comp:"Ultra-pure deionized water (18.2 MΩ·cm at 25 °C)",
    me:"Static and low-frequency values; purity and temperature dependent",
    polar:"Polar", pol:"Orientation (dipolar)",
    bd:"10–20 kV/mm (very short gaps, deionized; geometry dependent)",
    rho:"≈1.8 × 10⁷ Ω·cm (18.2 MΩ·cm at 25 °C)",
    tmax:"100 °C at 1 atm",
    dens:"0.997 g/cm³ at 25 °C",
    wa:"— (it is the liquid)",
    adv:["Very high permittivity","Non-toxic, non-flammable and cheap","High heat capacity","Useful model liquid for dielectric relaxation"],
    lim:["Freezes at 0 °C and boils at 100 °C","Conductivity rises quickly with dissolved ions","High loss at microwave frequencies","Corrosive and electrolytic in practical cells"],
    r:["r2","r3","r10"],
    rel:[20,10,1],
    m:[
      rec("1 kHz, 25 °C","78.4","0.001","1 kHz","25 °C",ATM,"ultra-pure; conductivity-limited"),
      rec("1 MHz, 25 °C","78.4","0.0013","1 MHz","25 °C",ATM,"18.2 MΩ·cm water"),
      rec("10 GHz, 25 °C","≈63","≈0.5","10 GHz","25 °C",ATM,"Debye relaxation region")
    ]
  },
  {
    id:20, n:"Glycerol", c:LIQ,
    tagline:"Viscous polar liquid for relaxation studies.",
    d:"Glycerol (propane-1,2,3-triol) is a hydrogen-bonded, highly viscous polar liquid. Its slow molecular reorientation makes it a classic model system for dielectric relaxation and a useful high-permittivity liquid filler.",
    ap:"Dielectric relaxation research, humectant, lubricant and pharmaceutical solvent.",
    b:"Static εr is about 42.5 at 25 °C. Strong hydrogen bonding and high viscosity shift its α-relaxation to around 100 MHz at room temperature. Absorbed water dramatically changes both εr and loss.",
    comp:"Pure glycerol (≥99.5%), water content <0.5%",
    me:"Static and low-frequency values; strongly water-content dependent",
    polar:"Polar", pol:"Orientation (dipolar)",
    bd:"10–20 kV/mm (dry, short gap; purity dependent)",
    rho:"≈10⁷ Ω·cm (dry, 25 °C)",
    tmax:"≈150 °C practical; boiling ≈290 °C with decomposition",
    dens:"1.26 g/cm³",
    wa:"Very hygroscopic; absorbs water from air",
    adv:["High static permittivity","Excellent model liquid for relaxation studies","Low toxicity and high boiling point","Compatible with many polymers"],
    lim:["Absorbs water rapidly and properties change","High viscosity complicates handling","Loss is very high near the relaxation","Not a practical high-voltage insulator"],
    r:["r2","r3","r10"],
    rel:[19,10,1],
    m:[
      rec("1 kHz, 25 °C","42.5","0.01","1 kHz","25 °C",ATM,"dry glycerol; static plateau"),
      rec("100 MHz, 25 °C","≈22","≈0.9","100 MHz","25 °C",ATM,"α-relaxation region"),
      rec("1 kHz, 25 °C, 10% water","≈38","0.03","1 kHz","25 °C",ATM,"water significantly raises loss")
    ]
  },
  {
    id:21, n:"Transformer oil (mineral)", c:LIQ,
    tagline:"Liquid insulation for power equipment.",
    d:"Mineral transformer oil is a refined petroleum fraction used to insulate and cool transformers and switchgear. Its low viscosity allows convection cooling, while its high breakdown strength protects the winding insulation.",
    ap:"Oil-filled transformers, reactors, circuit breakers and bushings.",
    b:"Non-polar hydrocarbon oil with εr about 2.2. Loss is very low when dry and clean. Moisture, particles and ageing products sharply reduce breakdown strength, so service oil is routinely tested.",
    comp:"Naphthenic or paraffinic mineral oil with antioxidants (IEC 60296 type)",
    me:"New, dry oil values; service condition must be tested",
    polar:"Non-polar", pol:"Electronic",
    bd:"30–60 kV across a 2.5 mm gap (≈12–24 kV/mm) for new oil; lower in service",
    rho:">10¹² Ω·cm (new, dry)",
    tmax:"90–100 °C top-oil continuous",
    dens:"0.86–0.90 g/cm³ at 20 °C",
    wa:"Very low solubility; moisture measured in ppm",
    adv:["Excellent cooling and insulation in one fluid","High breakdown strength when dry","Compatible with cellulose insulation","Low cost and well understood"],
    lim:["Flammable","Moisture and particles reduce breakdown strength","Oxidation forms sludge","Environmental and fire risks"],
    r:["r2","r3","r9"],
    rel:[22,19,16],
    m:[
      rec("50 Hz, 25 °C","2.2","0.0005","50 Hz","25 °C",ATM,"new, dry oil"),
      rec("1 MHz, 25 °C","2.2","0.001","1 MHz","25 °C",ATM,"low-loss hydrocarbon"),
      rec("50 Hz, 25 °C, wet","2.2","0.01","50 Hz","25 °C",ATM,"moisture increases loss and lowers breakdown")
    ]
  },
  {
    id:22, n:"Silicone oil (PDMS)", c:LIQ,
    tagline:"Stable, water-repellent liquid dielectric.",
    d:"Silicone oil is a polydimethylsiloxane (PDMS) liquid. Its Si–O backbone gives high thermal stability, low volatility and strong water repellency. Viscosity grade changes flow behaviour but has little effect on permittivity.",
    ap:"Transformer and capacitor impregnation, damping fluids, coatings and medical devices.",
    b:"Non-polar methyl groups give εr about 2.7 and very low loss. Properties change little with temperature. Silicone oil is not miscible with mineral oil and has lower breakdown strength.",
    comp:"Polydimethylsiloxane (PDMS), low-volatility electrical grade",
    me:"Typical dry oil data; viscosity grade has little effect on εr",
    polar:"Non-polar (weakly polar siloxane)", pol:"Electronic + weak dipolar",
    bd:"10–15 kV/mm (typical; gap and purity dependent)",
    rho:">10¹⁴ Ω·cm",
    tmax:"150–200 °C continuous (special grades to 250 °C)",
    dens:"0.96–0.98 g/cm³",
    wa:"Very low; water-repellent",
    adv:["Wide temperature range","Low volatility and low flammability compared with mineral oil","Water repellent","Chemically stable"],
    lim:["More expensive than mineral oil","Lower breakdown strength than new mineral oil","Not miscible with mineral oil","Poor biodegradability"],
    r:["r2","r3","r9"],
    rel:[21,19,1],
    m:[
      rec("50 Hz, 25 °C","2.7","0.0002","50 Hz","25 °C",ATM,"dry PDMS"),
      rec("1 MHz, 25 °C","2.7","0.0005","1 MHz","25 °C",ATM,"typical electrical grade"),
      rec("1 kHz, 150 °C","2.7","0.001","1 kHz","150 °C",ATM,"stable with temperature")
    ]
  },
  {
    id:23, n:"Air (dry)", c:GAS,
    tagline:"The everyday reference gas dielectric.",
    d:"Dry air is a mixture of nitrogen, oxygen, argon and trace gases. It is a weak dielectric but an excellent self-healing insulator at atmospheric pressure, and it is the reference against which other gases are compared.",
    ap:"Air capacitors, overhead lines, circuit breakers and general insulation.",
    b:"Only electronic polarization contributes. εr is 1.00059 at 1 atm and 20 °C. Breakdown follows Paschen's law and is about 3 kV/mm at 1 atm in a uniform field. Humidity and electrode shape matter.",
    comp:"Dry air (≈78% N2, 21% O2, ~1% Ar)",
    me:"Standard reference conditions; humidity and pressure specified",
    polar:"Non-polar", pol:"Electronic",
    bd:"≈3 kV/mm at 1 atm, 20 °C (uniform field; gap dependent)",
    rho:"Not applicable (gas); breakdown field is the relevant limit",
    tmax:"Not applicable; density falls on heating",
    dens:"1.205 kg/m³ at 20 °C, 1 atm",
    wa:"Humidity affects breakdown and loss",
    adv:["Abundant, free and non-toxic","Self-healing after a spark","Simple and well understood","No liquid cleanup or fire risk"],
    lim:["Low breakdown strength at 1 atm","Humidity-sensitive","Requires large clearances","Discharges can form ozone and nitrogen oxides"],
    r:["r2","r10","r11"],
    rel:[24,25,27],
    m:[
      rec("1 atm, 20 °C","1.00059","<10⁻⁸","1 MHz","20 °C",GAS_P,"dry air"),
      rec("10 atm, 20 °C","1.0059","<10⁻⁸","1 MHz","20 °C","10 atm","compressed air; density scaling")
    ]
  },
  {
    id:24, n:"Nitrogen", c:GAS,
    tagline:"Inert gas for dry insulation.",
    d:"Nitrogen is a diatomic, non-polar gas. It is used as a dry, inert dielectric and as a pressurising gas in high-voltage equipment. Its breakdown strength is similar to air at the same pressure but it avoids oxidation.",
    ap:"Gas-insulated lines and mixtures, dry transformers, cable pressurisation and inert atmospheres.",
    b:"Electronic polarization only. εr is 1.00058 at 1 atm and 20 °C. Breakdown is similar to air at 1 atm and increases with pressure. Dry nitrogen avoids the moisture and oxidation issues of air.",
    comp:"High-purity N2 (≥99.999%)",
    me:"Standard reference conditions; pressure specified",
    polar:"Non-polar", pol:"Electronic",
    bd:"≈3 kV/mm at 1 atm (similar to air); increases with pressure",
    rho:"Not applicable (gas); breakdown field is the relevant limit",
    tmax:"Not applicable; density falls on heating",
    dens:"1.165 kg/m³ at 20 °C, 1 atm",
    wa:"Dry gas; trace moisture affects discharge",
    adv:["Inert and non-oxidising","Cheap and readily available","Similar breakdown to air at 1 atm","Non-flammable"],
    lim:["Low breakdown strength at 1 atm","Requires pressure vessels for high voltage","Asphyxiation risk in confined spaces","Not as strong as SF6"],
    r:["r2","r10","r11"],
    rel:[23,25,27],
    m:[
      rec("1 atm, 20 °C","1.00058","<10⁻⁸","1 MHz","20 °C",GAS_P,"dry nitrogen"),
      rec("10 atm, 20 °C","1.0058","<10⁻⁸","1 MHz","20 °C","10 atm","compressed nitrogen")
    ]
  },
  {
    id:25, n:"Argon", c:GAS,
    tagline:"Heavy noble gas for controlled atmospheres.",
    d:"Argon is a monatomic noble gas. Its closed-shell atoms polarize only slightly, giving a permittivity barely above unity. It is used where an inert, heavy atmosphere is needed, but it is not a strong insulating gas.",
    ap:"Welding shields, inert atmospheres, gas-filled detectors and some insulation mixtures.",
    b:"Electronic polarization only. εr is 1.000517 at 1 atm and 20 °C. Its breakdown strength at 1 atm is lower than air's, so it is not a primary insulating gas. Pressure increases both density and strength.",
    comp:"High-purity Ar (≥99.999%)",
    me:"Standard reference conditions; pressure specified",
    polar:"Non-polar", pol:"Electronic",
    bd:"≈0.5–1 kV/mm at 1 atm (uniform field; lower than air)",
    rho:"Not applicable (gas); breakdown field is the relevant limit",
    tmax:"Not applicable; density falls on heating",
    dens:"1.66 kg/m³ at 20 °C, 1 atm",
    wa:"Dry gas",
    adv:["Chemically inert","Heavier than air, useful for shielding","Readily available","Good for gas-filled detectors"],
    lim:["Lower breakdown strength than air","More expensive than nitrogen","Asphyxiation risk","Not a practical HV insulating gas at 1 atm"],
    r:["r2","r10","r11"],
    rel:[26,1],
    m:[
      rec("1 atm, 20 °C","1.000517","<10⁻⁸","1 MHz","20 °C",GAS_P,"high-purity argon"),
      rec("10 atm, 20 °C","1.00517","<10⁻⁸","1 MHz","20 °C","10 atm","compressed argon")
    ]
  },
  {
    id:26, n:"Helium", c:GAS,
    tagline:"Lightest noble gas with the lowest permittivity.",
    d:"Helium is the lightest noble gas and has the smallest atomic polarizability of any stable element. Its permittivity is the closest to vacuum among common gases. It is used in cryogenics, leak detection and superconducting magnet cooling.",
    ap:"Cryogenics, leak detection, cooling of superconducting magnets and dielectric studies.",
    b:"Electronic polarization only. εr is 1.000065 at 1 atm and 20 °C. Breakdown strength is very low; helium is useful where inertness and low permittivity matter, not where high voltage must be held.",
    comp:"High-purity He (≥99.999%)",
    me:"Standard reference conditions; pressure specified",
    polar:"Non-polar", pol:"Electronic",
    bd:"≈0.2–0.5 kV/mm at 1 atm (uniform field; very low)",
    rho:"Not applicable (gas); breakdown field is the relevant limit",
    tmax:"Not applicable; density falls on heating",
    dens:"0.166 kg/m³ at 20 °C, 1 atm",
    wa:"Very low; the small atom leaks easily through seals",
    adv:["Lowest εr among common gases","Inert and non-flammable","Excellent heat transfer","Very low boiling point"],
    lim:["Scarce and expensive","Very low breakdown strength","Leaks through small gaps","Asphyxiation risk"],
    r:["r2","r10","r11"],
    rel:[25,1],
    m:[
      rec("1 atm, 20 °C","1.000065","<10⁻⁸","1 MHz","20 °C",GAS_P,"high-purity helium"),
      rec("10 atm, 20 °C","1.00065","<10⁻⁸","1 MHz","20 °C","10 atm","compressed helium")
    ]
  },
  {
    id:27, n:"Sulfur hexafluoride (SF6)", c:GAS,
    tagline:"High-strength insulating gas for switchgear.",
    d:"SF6 is a heavy, electronegative gas. Its molecules capture free electrons to form negative ions, giving a dielectric strength about three times that of air at the same pressure. It is the standard insulation for high-voltage switchgear and gas-insulated lines.",
    ap:"Gas-insulated switchgear (GIS), circuit breakers, transformers and particle accelerators.",
    b:"Electronic and weak ionic polarization give εr about 1.002 at 1 atm. Strong electron attachment suppresses discharges, so breakdown strength is very high. Moisture and decomposition products are serious operational concerns.",
    comp:"High-purity SF6 (≥99.9%)",
    me:"Standard reference conditions; pressure and purity specified",
    polar:"Non-polar", pol:"Electronic",
    bd:"≈8–9 kV/mm at 1 atm (≈3 × air); higher with pressure",
    rho:"Not applicable (gas); breakdown field is the relevant limit",
    tmax:"Stable to ≈500 °C; decomposition products are toxic and corrosive",
    dens:"6.16 kg/m³ at 20 °C, 1 atm",
    wa:"Dry gas; moisture promotes corrosive decomposition",
    adv:["Very high dielectric strength","Self-healing after a spark","Non-flammable","Excellent arc-quenching behaviour"],
    lim:["Extremely high global warming potential (GWP ≈ 23,500)","Expensive","Toxic and corrosive decomposition products","Requires specialised gas handling and recycling"],
    r:["r2","r3","r11"],
    rel:[25,1],
    m:[
      rec("1 atm, 20 °C","1.00205","<10⁻⁸","1 MHz","20 °C",GAS_P,"high-purity SF6"),
      rec("5 atm, 20 °C","1.0103","<10⁻⁸","1 MHz","20 °C","5 atm","compressed SF6; density scaling")
    ]
  }
];

/* The app is working from the curated 12-material assignment list. Records for
   the other materials remain in M_ALL so a longer library can be restored later
   without retyping the dataset. */
const VISIBLE_IDS = [1, 2, 3, 5, 6, 8, 10, 11, 19, 20, 25, 26];
const M = M_ALL.filter(m => VISIBLE_IDS.includes(m.id));
