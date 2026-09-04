import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown, ArrowRight, BriefcaseBusiness, Calculator, Check, ChevronDown,
  CircleHelp, Clock3, Compass, ExternalLink, Gauge, GraduationCap, Info,
  Landmark, Layers3, Menu, Route, ShieldCheck, Sparkles, Target, X, Zap
} from "lucide-react";
import "./styles.css";

const trackA = [
  {
    id:"gds",
    index:"00",
    role:"Gramin Dak Sevak",
    short:"GDS",
    level:"Starting point",
    route:"Starting point",
    service:"Starting point",
    body:"The common starting point. From here, multiple departmental routes can open depending on eligibility, vacancies and the applicable examination rules.",
    tone:"origin"
  },
  {
    id:"pa",
    index:"01",
    role:"Postal Assistant / Sorting Assistant",
    short:"PA / SA",
    level:"Pay Level 4",
    route:"LGO / Competitive Examination",
    service:"Direct GDS route: 8 years regular GDS service under the applicable rules",
    body:"The main destination for the feeder routes below. PA/SA opens the route toward Inspector Posts and the executive/administrative line.",
    tone:"red"
  },
  {
    id:"ip",
    index:"02",
    role:"Inspector Posts",
    short:"IP",
    level:"Pay Level 7 · Group B",
    route:"Inspector Posts competitive exam (LDCE)",
    service:"Qualifying regular PA/SA service under the applicable recruitment rules",
    body:"Commands a Postal Sub-Division — inspecting, auditing and enforcing discipline across a cluster of Branch and Sub Offices.",
    tone:"gold"
  },
  {
    id:"asp",
    index:"03",
    role:"Assistant Superintendent of Posts",
    short:"ASP",
    level:"Pay Level 8 · Group B",
    route:"Seniority + Departmental Promotion Committee (DPC)",
    service:"Applicable IP service requirement",
    body:"Sub-divisional administration; second-in-command for divisional operations.",
    tone:"gold"
  },
  {
    id:"spo",
    index:"04",
    role:"Superintendent of Post Offices / SSRM",
    short:"SPO / SSRM",
    level:"Pay Level 9 · Group B · Gazetted",
    route:"PS Group 'B' departmental exam (LDCE)",
    service:"Applicable cumulative IP + ASP service requirement",
    body:"Divisional Head — full operational, financial and disciplinary authority over an entire postal division.",
    tone:"red",
    featured:true
  },
  {
    id:"ipos",
    index:"05",
    role:"IPoS Group A",
    short:"IPoS",
    level:"Group A",
    route:"Selection / induction pathway",
    service:"Selection-based induction",
    body:"Regional and senior leadership pathway, including Director Postal Services and Postmaster General trajectories.",
    tone:"violet",
    final:true
  }
];

const trackB = [
  {id:"b-pa", index:"01", role:"Postal Assistant (PA)", level:"Entry point", service:"Entry point", body:"The common starting point for the general operational seniority line."},
  {id:"lsg", index:"02", role:"Lower Selection Grade", level:"Pay Level 5", service:"After 5 years as PA", body:"A single unified supervisory grade — no sub-levels."},
  {id:"hsg2", index:"03", role:"Higher Selection Grade II", level:"Pay Level 6", service:"After 6 years in LSG", body:'Promotion depends on a "Fit" declaration from the circle’s DPC.'},
  {id:"hsg1", index:"04", role:"Higher Selection Grade I", level:"Pay Level 7", service:"After 5 years in HSG-II", body:"Chief/Head Postmaster of a major urban Head Post Office. No written exam or LDCE required."},
  {id:"nfg", index:"05", role:"HSG-I Non-Functional Grade", level:"Pay Level 8", service:"Automatically after 2 years in HSG-I", body:"A higher non-functional grade on the operational seniority line."}
];

const feederRoutes = [
  {
    id: "direct-pa",
    title: "Direct GDS → PA / SA",
    badge: "8 YEARS",
    color: "red",
    steps: [
      {
        role: "GDS",
        time: "Year 0",
        description: "Starting point"
      },
      {
        role: "PA / SA",
        time: "Year 8",
        description: "Competitive / departmental route subject to applicable rules"
      }
    ],
    summary: "The straightest GDS-to-PA route: remain in GDS and become eligible for PA/SA after the applicable qualifying service."
  },
  {
    id: "gds-mts-pa",
    title: "GDS → MTS → PA / SA",
    badge: "3 + 5 YEARS",
    color: "gold",
    steps: [
      {
        role: "GDS",
        time: "Year 0",
        description: "Starting point"
      },
      {
        role: "MTS",
        time: "Year 3",
        description: "GDS → MTS examination / recruitment route"
      },
      {
        role: "PA / SA",
        time: "Year 8*",
        description: "MTS → PA/SA route"
      }
    ],
    summary: "Move into MTS first, then progress toward PA/SA. The exact eligibility calculation depends on the service counted under the applicable recruitment rules."
  },
  {
    id: "gds-postman-pa",
    title: "GDS → Postman → PA / SA",
    badge: "5 + 3 YEARS",
    color: "red",
    steps: [
      {
        role: "GDS",
        time: "Year 0",
        description: "Starting point"
      },
      {
        role: "Postman",
        time: "Year 5",
        description: "GDS → Postman / Mail Guard examination route"
      },
      {
        role: "PA / SA",
        time: "Year 8*",
        description: "Postman → PA/SA route"
      }
    ],
    summary: "Move from GDS into Postman first, then become eligible for the PA/SA route after the applicable service requirement."
  },
  {
    id: "gds-mts-postman-pa",
    title: "GDS → MTS → Postman → PA / SA",
    badge: "3 + 3 + 3 YEARS",
    color: "violet",
    steps: [
      {
        role: "GDS",
        time: "Year 0",
        description: "Starting point"
      },
      {
        role: "MTS",
        time: "Year 3",
        description: "GDS → MTS"
      },
      {
        role: "Postman",
        time: "Year 6",
        description: "MTS → Postman"
      },
      {
        role: "PA / SA",
        time: "Year 9*",
        description: "Postman → PA/SA"
      }
    ],
    summary: "A longer feeder route where an official moves through both MTS and Postman before entering PA/SA."
  }
];

const rules = [
  {
    title:"The “Bypass Cadres” Rule",
    icon:Zap,
    body:"A GDS can jump directly to PA via the LGO exam after a qualifying period of service, skipping the intermediate MTS and Postman cadres. Unfilled PA vacancies go first to existing MTS/Postmen who cleared the same exam. Alternative early exits from GDS: the MTS exam (eligible after 3 years) or the Postman exam (eligible after 5 years)."
  },
  {
    title:"Seniority-cum-Fitness",
    icon:ShieldCheck,
    body:'This governs exam-free promotions (LSG → HSG-II → HSG-I). Three gates: an actual sanctioned vacancy, the past 5 years of APAR ratings clearing the benchmark (“Good”/“Very Good”), and a clean vigilance record. DPCs may occasionally relax wait-times during staffing shortages.'
  },
  {
    title:"SPM vs BPM",
    icon:Landmark,
    body:"Branch Postmaster (BPM) heads a rural Branch Office; part-time, extra-departmental, hired on 10th-grade merit. Sub Postmaster (SPM) heads an urban Sub-Post Office; full-time, permanent, typically assigned 3–5 years into the PA cadre."
  }
];

const strategy = [
  ["01","Technical leverage","India Post is scaling IPPB, parcel tracking, cybersecurity and data systems; technical capability can help with infrastructure-oriented assignments."],
  ["02","Build the base","Treat the GDS-to-PA window as a dedicated study block for Postal Manuals Vols. I–VIII and financial handbooks."],
  ["03","First-attempt LGO","A first-attempt LGO clear is the highest-leverage early milestone for the roadmap."],
  ["04","The pivot","The Inspector Posts exam is the key pivot from routine operations into the executive/administrative line."]
];


function Preloader() {
  const [visible, setVisible] = React.useState(true);
  const [exiting, setExiting] = React.useState(false);

  React.useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 2200);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 2900);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`preloader ${exiting ? "preloader-exit" : ""}`}>

      <div className="preloader-grid"></div>

      <div className="preloader-content">

        {/* BRAND */}
        <div className="preloader-brand">
          <span className="preloader-logo">
            <Route size={20} />
          </span>

          <span>
            Post<span>Path</span>
          </span>
        </div>


        {/* SCENE */}
        <div className="postal-scene">

          <div className="scene-glow"></div>

          {/* CLOCK */}
          <div className="loading-clock">

            <div className="clock-ring"></div>

            <div className="clock-face">

              <span className="clock-mark mark-12"></span>
              <span className="clock-mark mark-3"></span>
              <span className="clock-mark mark-6"></span>
              <span className="clock-mark mark-9"></span>

              <span className="clock-hand hour-hand"></span>
              <span className="clock-hand minute-hand"></span>

              <span className="clock-center"></span>

            </div>

            <div className="clock-label">
              YOUR JOURNEY
            </div>

          </div>


          {/* ROAD */}
          <div className="postal-road">

            <div className="road-track"></div>

            <div className="road-dashes"></div>

          </div>


          {/* POSTMAN BICYCLE */}
          <div className="courier">

            <div className="courier-shadow"></div>

            <div className="courier-body">

              {/* MAIL BAG */}
              <div className="mail-bag">
                <span></span>
              </div>

              {/* HEAD */}
              <div className="courier-head">
                <div className="courier-hat"></div>
              </div>

              {/* BODY */}
              <div className="courier-torso"></div>

              {/* ARMS */}
              <div className="courier-arm arm-front"></div>
              <div className="courier-arm arm-back"></div>

              {/* LEGS */}
              <div className="courier-leg leg-front"></div>
              <div className="courier-leg leg-back"></div>

            </div>


            {/* BICYCLE */}
            <div className="bicycle">

              <div className="wheel wheel-front">
                <div className="wheel-inner"></div>
              </div>

              <div className="wheel wheel-back">
                <div className="wheel-inner"></div>
              </div>

              <div className="bike-frame"></div>
              <div className="bike-frame bike-frame-2"></div>

              <div className="bike-handle"></div>
              <div className="bike-seat"></div>
              <div className="bike-pedal"></div>

            </div>


            {/* LETTERS FLYING */}
            <div className="mail-trail">

              <span className="mail mail-1">✉</span>
              <span className="mail mail-2">✉</span>
              <span className="mail mail-3">✉</span>

            </div>

          </div>

        </div>


        {/* TEXT */}
        <div className="loader-copy">

          <div className="loader-status">
            <span className="status-pulse"></span>
            ROUTING YOUR CAREER MAP
          </div>

          <h1>
            Delivering your
            <span> career route.</span>
          </h1>

          <p>
            Mapping the journey from GDS to the next milestone.
          </p>

        </div>


        {/* PROGRESS */}
        <div className="loader-progress">

          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>

          <div className="progress-meta">
            <span>POSTPATH SYSTEM</span>
            <span>LOADING <b>...</b></span>
          </div>

        </div>

      </div>

    </div>
  );
}

function Reveal({children, className=""}) {
  const ref = useRef(null);
  const [show,setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if(entry.isIntersecting){setShow(true);io.disconnect();}}, {threshold:.12});
    io.observe(el); return () => io.disconnect();
  },[]);
  return <div ref={ref} className={`reveal ${show?"visible":""} ${className}`}>{children}</div>
}

function FeederRoutes() {
  const [active, setActive] = useState("direct-pa");

  return (
    <Reveal className="feeder-section">
      <div className="feeder-header">
        <div>
          <div className="section-kicker">
            <Route size={16}/>
            BEFORE PA / SA
          </div>

          <h2>
            The <span>feeder routes.</span>
          </h2>

          <p>
            GDS does not have to follow only one route into PA/SA.
            These are the major progression patterns to keep visible.
          </p>
        </div>
      </div>

      <div className="feeder-grid">
        <div className="feeder-tabs">
          {feederRoutes.map(route => (
            <button
              key={route.id}
              className={active === route.id ? "active" : ""}
              onClick={() => setActive(route.id)}
            >
              <span>{route.badge}</span>
              <strong>{route.title}</strong>
              <small>{route.summary}</small>
            </button>
          ))}
        </div>

        <div className="feeder-visual">
          {feederRoutes
            .filter(route => route.id === active)
            .map(route => (
              <div key={route.id} className="feeder-route-card">

                <div className="feeder-route-title">
                  <span className={`route-badge ${route.color}`}>
                    {route.badge}
                  </span>

                  <h3>{route.title}</h3>
                </div>

                <div className="feeder-timeline">
                  {route.steps.map((step, index) => (
                    <div
                      className="feeder-step"
                      key={`${route.id}-${step.role}`}
                    >
                      <div className="feeder-step-line">
                        <span className={`feeder-node ${route.color}`}>
                          {index + 1}
                        </span>

                        {index !== route.steps.length - 1 && (
                          <span className="feeder-connector"/>
                        )}
                      </div>

                      <div className="feeder-step-content">
                        <div>
                          <span className="feeder-time">
                            {step.time}
                          </span>

                          <h4>{step.role}</h4>

                          <p>{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="feeder-note">
                  <Info size={16}/>
                  <span>{route.summary}</span>
                </div>

              </div>
            ))}
        </div>
      </div>

      <div className="feeder-footnote">
        * Service eligibility and examination conditions can change by
        vacancy year, recruitment rules and Department of Posts orders.
        The 2026 Postman/Mail Guard vacancy year has a one-year relaxation,
        so the displayed years should be treated as roadmap examples,
        not permanent eligibility guarantees.
      </div>
    </Reveal>
  );
}

function StageCard({item, open, onOpen}) {
  return (
    <Reveal className={`stage-wrap ${item.featured?"featured":""} ${item.final?"final":""}`}>
      <div className="route-dot"><span>{item.index}</span></div>
      <button className={`stage-card ${open?"open":""}`} onClick={onOpen} aria-expanded={open}>
        <div className="stage-top">
          <div>
            <div className="eyebrow">{item.short}</div>
            <h3>{item.role}</h3>
          </div>
          <div className={`level ${item.tone}`}>{item.level}</div>
        </div>
        <div className="stage-meta">
          <div><Route size={15}/><span>{item.route}</span></div>
          <div><Clock3 size={15}/><span>{item.service}</span></div>
        </div>
        <div className={`stage-detail ${open?"show":""}`}>
          <div className="detail-line"></div>
          <p>{item.body}</p>
        </div>
        <div className="expand">{open ? <X size={17}/> : <ChevronDown size={17}/>} {open?"Close":"Explore stage"}</div>
      </button>
    </Reveal>
  )
}

function App(){
  const [track,setTrack] = useState("A");
  const [open,setOpen] = useState("pa");
  const [mobileNav,setMobileNav] = useState(false);
  const [age,setAge] = useState("");
  const [year,setYear] = useState("");
  const [mode,setMode] = useState("age");
  const [calculatorRoute, setCalculatorRoute] = useState("direct-pa");

const feederCalculatorRoutes = {
  "direct-pa": {
    name: "Direct GDS → PA / SA",

    feeder: [
      { role: "GDS", offset: 0, type: "feeder" },
      { role: "PA / SA", offset: 8, type: "entry" }
    ],

    seniority: [
      { role: "PA / SA", offset: 8, type: "entry" },
      { role: "LSG", offset: null, type: "seniority" },
      { role: "HSG-II", offset: null, type: "seniority" },
      { role: "HSG-I", offset: null, type: "seniority" }
    ],

    // executive: [
    //   {
    //     role: "Inspector Posts (IP)",
    //     serviceAfterPA: 8,
    //     type: "executive",
    //     note: "8 years qualifying service benchmark"
    //   },
    //   {
    //     role: "Assistant Superintendent of Posts (ASP)",
    //     serviceAfterIP: 5,
    //     type: "executive",
    //     note: "5 years regular service benchmark"
    //   },
    //   {
    //     role: "Postal Service Group 'B'",
    //     serviceAfterASP: 3,
    //     type: "executive",
    //     note: "Route and eligibility dependent"
    //   },
    //   {
    //     role: "JTS — Indian Postal Service Group A",
    //     serviceAfterPSB: 5,
    //     type: "senior",
    //     note: "5 years regular service benchmark"
    //   }
    // ]
  },

  "gds-mts-pa": {
    name: "GDS → MTS → PA / SA",

    feeder: [
      { role: "GDS", offset: 0, type: "feeder" },
      { role: "MTS", offset: 3, type: "feeder" },
      { role: "PA / SA", offset: 8, type: "entry" }
    ],

    seniority: [
      { role: "PA / SA", offset: 8, type: "entry" },
      { role: "LSG", offset: null, type: "seniority" },
      { role: "HSG-II", offset: null, type: "seniority" },
      { role: "HSG-I", offset: null, type: "seniority" }
    ],

    // executive: [
    //   {
    //     role: "Inspector Posts (IP)",
    //     serviceAfterPA: 8,
    //     type: "executive",
    //     note: "8 years qualifying service benchmark"
    //   },
    //   {
    //     role: "Assistant Superintendent of Posts (ASP)",
    //     serviceAfterIP: 5,
    //     type: "executive",
    //     note: "5 years regular service benchmark"
    //   },
    //   {
    //     role: "Postal Service Group 'B'",
    //     serviceAfterASP: 3,
    //     type: "executive",
    //     note: "Route and eligibility dependent"
    //   },
    //   {
    //     role: "JTS — Indian Postal Service Group A",
    //     serviceAfterPSB: 5,
    //     type: "senior",
    //     note: "5 years regular service benchmark"
    //   }
    // ]
  },

  "gds-postman-pa": {
    name: "GDS → Postman → PA / SA",

    feeder: [
      { role: "GDS", offset: 0, type: "feeder" },
      { role: "Postman", offset: 5, type: "feeder" },
      { role: "PA / SA", offset: 8, type: "entry" }
    ],

    seniority: [
      { role: "PA / SA", offset: 8, type: "entry" },
      { role: "LSG", offset: null, type: "seniority" },
      { role: "HSG-II", offset: null, type: "seniority" },
      { role: "HSG-I", offset: null, type: "seniority" }
    ],

    executive: [
      {
        role: "Inspector Posts (IP)",
        serviceAfterPA: 8,
        type: "executive",
        note: "8 years qualifying service benchmark"
      },
      {
        role: "Assistant Superintendent of Posts (ASP)",
        serviceAfterIP: 5,
        type: "executive",
        note: "5 years regular service benchmark"
      },
      {
        role: "Postal Service Group 'B'",
        serviceAfterASP: 3,
        type: "executive",
        note: "Route and eligibility dependent"
      },
      {
        role: "JTS — Indian Postal Service Group A",
        serviceAfterPSB: 5,
        type: "senior",
        note: "5 years regular service benchmark"
      }
    ]
  },

  "gds-mts-postman-pa": {
    name: "GDS → MTS → Postman → PA / SA",

    feeder: [
      { role: "GDS", offset: 0, type: "feeder" },
      { role: "MTS", offset: 3, type: "feeder" },
      { role: "Postman", offset: 6, type: "feeder" },
      { role: "PA / SA", offset: 9, type: "entry" }
    ],

    seniority: [
      { role: "PA / SA", offset: 9, type: "entry" },
      { role: "LSG", offset: null, type: "seniority" },
      { role: "HSG-II", offset: null, type: "seniority" },
      { role: "HSG-I", offset: null, type: "seniority" }
    ],

    // executive: [
    //   {
    //     role: "Inspector Posts (IP)",
    //     serviceAfterPA: 8,
    //     type: "executive",
    //     note: "8 years qualifying service benchmark"
    //   },
    //   {
    //     role: "Assistant Superintendent of Posts (ASP)",
    //     serviceAfterIP: 5,
    //     type: "executive",
    //     note: "5 years regular service benchmark"
    //   },
    //   {
    //     role: "Postal Service Group 'B'",
    //     serviceAfterASP: 3,
    //     type: "executive",
    //     note: "Route and eligibility dependent"
    //   },
    //   {
    //     role: "JTS — Indian Postal Service Group A",
    //     serviceAfterPSB: 5,
    //     type: "senior",
    //     note: "5 years regular service benchmark"
    //   }
    // ]
  }
};

const executiveCareerTrack = [
  {
    role: "Inspector Posts (IP)",
    type: "executive",
    serviceAfterPA: 8,
    note: "8-year qualifying-service benchmark"
  },

  {
    role: "Assistant Superintendent of Posts (ASP)",
    type: "executive",
    serviceAfterIP: 5,
    note: "5-year regular-service benchmark"
  },

  {
    role: "SPO / SSRM — Postal Service Group 'B'",
    type: "senior",
    dependent: true,
    note: "Entry depends on applicable PS Group 'B' promotion route, seniority, vacancy and DPC/LDCE conditions"
  },

  {
    role: "JTS — Indian Postal Service Group A",
    type: "senior",
    dependent: true,
    note: "Eligibility benchmark: 5 years regular service in Postal Service Group 'B'"
  }
];
const calc = useMemo(() => {
  const base = mode === "age" ? Number(age) : Number(year);

  if (!base || base < 1) return null;

  const route = feederCalculatorRoutes[calculatorRoute];

  if (!route) return null;

  const calculateFeeder = (stages) =>
    stages.map((stage) => ({
      ...stage,
      value:
        mode === "age"
          ? Math.round((base + stage.offset) * 10) / 10
          : base + stage.offset
    }));

  const paStage = route.feeder.find(
    (stage) => stage.role === "PA / SA"
  );

  const paBase = paStage?.offset ?? 0;

const calculateExecutive = () => {

  const ipOffset =
    paBase + 8;

  const aspOffset =
    ipOffset + 5;

  return executiveCareerTrack.map((stage) => {

    let offset = null;

    if (stage.role.includes("Inspector Posts")) {
      offset = ipOffset;
    }

    else if (stage.role.includes("Assistant Superintendent")) {
      offset = aspOffset;
    }

    return {
      ...stage,

      offset,

      value:
        offset === null
          ? null
          : mode === "age"
            ? Math.round((base + offset) * 10) / 10
            : base + offset
    };

  });
};

  return {
    routeName: route.name,

    feeder: calculateFeeder(route.feeder),

    seniority: route.seniority.map((stage) => ({
      ...stage,

      value:
        stage.offset !== null
          ? (
              mode === "age"
                ? Math.round((base + stage.offset) * 10) / 10
                : base + stage.offset
            )
          : null
    })),

    executive: calculateExecutive()
  };

}, [age, year, mode, calculatorRoute]);
  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setMobileNav(false);
  };

  return (
    <>
    <Preloader />
    <div className="app">
      <div className="grain"></div>
      <header className="nav">
        <div className="nav-inner">
          <button className="brand" onClick={()=>scrollTo("top")}><span className="brand-mark"><Route size={19}/></span><span>Post<span>Path</span></span></button>
          <nav className={mobileNav?"nav-links show":"nav-links"}>
            <button onClick={()=>scrollTo("roadmap")}>Roadmap</button>
            <button onClick={()=>scrollTo("rules")}>Rules</button>
            <button onClick={()=>scrollTo("strategy")}>Strategy</button>
            <button onClick={()=>scrollTo("calculator")}>Timeline</button>
          </nav>
          <button className="menu-btn" onClick={()=>setMobileNav(!mobileNav)} aria-label="Toggle navigation">{mobileNav?<X/>:<Menu/>}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-orbit orbit-a"></div><div className="hero-orbit orbit-b"></div>
          <div className="hero-grid"></div>
          <Reveal className="hero-copy">
            <div className="pill"><Sparkles size={14}/> CAREER INTELLIGENCE · DEPARTMENT OF POSTS</div>
            <h1>From <em>GDS</em> to<br/><span>Group A.</span></h1>
            <p className="hero-sub">A visual career map for navigating the executive, administrative and seniority pathways inside India’s Department of Posts.</p>
            <div className="hero-actions">
              <button className="primary" onClick={()=>scrollTo("roadmap")}>Explore the roadmap <ArrowDown size={18}/></button>
              <button className="ghost" onClick={()=>scrollTo("calculator")}><Calculator size={17}/> Plot my timeline</button>
            </div>
            <div className="hero-proof">
              <div><strong>2</strong><span>career tracks</span></div><i></i><div><strong>6</strong><span>executive stages</span></div><i></i><div><strong>∞</strong><span>possibilities</span></div>
            </div>
          </Reveal>
          <div className="hero-map" aria-hidden="true">
            <div className="map-label top">EXECUTIVE LINE</div>
            <div className="map-line">
              {trackA.map((x,i)=><div className="map-node" key={x.id} style={{"--i":i}}><span>{x.index}</span><small>{x.short}</small></div>)}
            </div>
            <div className="map-arrow"><ArrowRight size={18}/></div>
          </div>
        </section>

        <section className="section roadmap-section" id="roadmap">
          <Reveal><div className="section-kicker"><Compass size={16}/> THE MASTER MAP</div>
          <div className="section-heading"><div><h2>Choose your <span>line.</span></h2><p>Two routes. One starting point. Very different destinations.</p></div>
            <div className="track-switch"><button className={track==="A"?"active":""} onClick={()=>setTrack("A")}>Track A <small>Executive</small></button><button className={track==="B"?"active":""} onClick={()=>setTrack("B")}>Track B <small>Seniority</small></button></div>
          </div></Reveal>

          <div className={`track-banner ${track==="B"?"track-b":""}`}>
            <div><span className="banner-num">{track==="A"?"A":"B"}</span><div><strong>{track==="A"?"Executive & Administrative Fast-Track":"General Operational Seniority Line"}</strong><p>{track==="A"?"The route that opens progressively broader administrative authority.":"The steadier seniority path — flatter progression, with a ceiling below the executive line."}</p></div></div>
            <span className="banner-status"><Gauge size={15}/> {track==="A"?"HIGH LEVERAGE":"STEADY PACE"}</span>
          </div>
          {track==="A" && <FeederRoutes />}
          {track==="A" ? (
            <div className="roadmap">
              {trackA.map(item=><StageCard key={item.id} item={item} open={open===item.id} onOpen={()=>setOpen(open===item.id?"":item.id)}/>)}
              <Reveal className="destination"><div className="destination-card"><div className="destination-glow"></div><GraduationCap size={25}/><div><span>REGIONAL LEADERSHIP</span><strong>DPS · Pay Level 12 &nbsp;→&nbsp; PMG · Pay Level 14</strong><p>Senior IPoS Group A trajectory</p></div></div></Reveal>
            </div>
          ) : (
           <div className="seniority-roadmap">

  <div className="seniority-road-line"></div>

  {trackB.map((stage, index) => (

    <Reveal key={stage.id}>

      <div
        className="seniority-stage"
        style={{
          animationDelay: `${index * 140}ms`
        }}
      >

        <div className="seniority-marker">

          <span>{stage.index}</span>

        </div>

        <div className="seniority-stage-card">

          <div className="seniority-stage-top">

            <div>
              <span className="eyebrow">
                MILESTONE {stage.index}
              </span>

              <h3>{stage.role}</h3>
            </div>

            <div className="seniority-pay">
              {stage.level}
            </div>

          </div>

          <p>
            {stage.body}
          </p>

          <div className="seniority-service">

            <Clock3 size={14}/>

            <span>
              {stage.service}
            </span>

          </div>

        </div>

      </div>

    </Reveal>

  ))}


  <Reveal>

    <div className="seniority-ceiling">

      <div className="ceiling-icon">
        <Info size={16}/>
      </div>

      <div>

        <strong>
          Operational Seniority Ceiling
        </strong>

        <p>
          This line progresses through operational seniority
          grades and does not itself provide the district-level
          or regional administrative route represented by Track A.
        </p>

      </div>

    </div>

  </Reveal>

</div>  )}
        </section>

        <section className="section rules-section" id="rules">
          <Reveal><div className="section-kicker"><Layers3 size={16}/> INSTITUTIONAL RULES</div><div className="section-heading"><div><h2>The rules behind<br/>the <span>route.</span></h2><p>Reference cards for the details that can change how the map plays out.</p></div></div></Reveal>
          <div className="rules-grid">{rules.map((r,i)=>{const Icon=r.icon;return <Reveal key={r.title} className="rule-card"><div className="rule-num">0{i+1}</div><Icon size={22}/><h3>{r.title}</h3><p>{r.body}</p><button onClick={()=>setOpen(r.title)}>Read context <ArrowRight size={15}/></button></Reveal>})}</div>
        </section>

        <section className="section strategy-section" id="strategy">
          <Reveal><div className="strategy-head"><div><div className="section-kicker"><Target size={16}/> STRATEGY NOTES</div><h2>Play the long game.</h2></div><span>Four principles to keep the roadmap moving.</span></div></Reveal>
          <div className="strategy-grid">{strategy.map(s=><Reveal key={s[0]}><div className="strategy-card"><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p></div></Reveal>)}</div>
        </section>

        <section className="calculator-section" id="calculator">
          <div className="calc-glow"></div>
          <Reveal><div className="section-kicker"><Calculator size={16}/> PLOT YOUR OWN TIMELINE</div><div className="calc-layout">
            <div><h2>Turn the map<br/>into <span>your timeline.</span></h2><p>Enter your GDS joining age or year. The calculator projects milestone ages/years using the roadmap’s illustrative progression offsets.</p>
              <div className="input-tabs"><button className={mode==="age"?"active":""} onClick={()=>setMode("age")}>Joining age</button><button className={mode==="year"?"active":""} onClick={()=>setMode("year")}>Joining year</button></div>
              <div className="calculator-route-selector">
  <label>CHOOSE YOUR FEEDER ROUTE</label>

  <select
    value={calculatorRoute}
    onChange={(e) => setCalculatorRoute(e.target.value)}
  >
    <option value="direct-pa">
      GDS → PA / SA
    </option>

    <option value="gds-mts-pa">
      GDS → MTS → PA / SA
    </option>

    <option value="gds-postman-pa">
      GDS → Postman → PA / SA
    </option>

    <option value="gds-mts-postman-pa">
      GDS → MTS → Postman → PA / SA
    </option>
  </select>
</div>
<div className="calculator-disclaimer">
  <div className="disclaimer-icon">
    <Info size={16} />
  </div>

  <div>
    <strong>Indicative career projection</strong>

    <p>
      This calculator provides a rough career-path projection from
      GDS to PA/SA and beyond. Executive and senior promotions are
      not guaranteed on a fixed timeline and may depend on qualifying
      service, vacancies, seniority, examinations, DPC decisions and
      the recruitment rules/orders applicable at that time.
    </p>

    <span>
      ⚠ Rules and eligibility may change. Always verify the latest
      Department of Posts notification before making a career decision.
    </span>
  </div>
</div>
              <div className="input-wrap"><span>{mode==="age"?"AGE":"YEAR"}</span><input type="number" min="1" value={mode==="age"?age:year} onChange={e=>mode==="age"?setAge(e.target.value):setYear(e.target.value)} placeholder={mode==="age"?"e.g. 24":"e.g. 2026"}/></div>
            </div>
<div className="results">

  {!calc ? (
    <div className="empty-results">
      <CircleHelp size={22} />

      <strong>Your career projection appears here.</strong>

      <span>
        Enter your joining age or year to reveal your
        indicative career journey.
      </span>
    </div>
  ) : (

    <div className="career-projection">

      {/* =========================
          HEADER
      ========================= */}

      <div className="projection-header">

        <div>
          <span>YOUR PROJECTED CAREER PATH</span>

          <h3>{calc.routeName}</h3>
        </div>

        <div className="projection-live">
          <i />
          INDICATIVE
        </div>

      </div>


      {/* =========================
          FEEDER ROUTE
      ========================= */}

      <div className="career-track feeder-track">

        <div className="track-heading">
          <span className="track-number">01</span>

          <div>
            <strong>Feeder Route</strong>
            <small>GDS → PA / SA</small>
          </div>
        </div>

        <div className="career-nodes">

          {calc.feeder.map((stage, index) => (

            <div
              className="career-node-wrap"
              key={`feeder-${stage.role}`}
              style={{
                animationDelay: `${index * 120}ms`
              }}
            >

              <div className="career-node">

                <div className="node-pulse" />

                <span>
                {stage.value !== null ? (
  mode === "age"
    ? `≈ ${stage.value} yrs`
    : stage.value
) : (
  "RULE-DEPENDENT"
)}
                </span>

              </div>

              <div className="career-node-info">

                <strong>{stage.role}</strong>

                <small>
                  {stage.type === "entry"
                    ? "PA / SA entry"
                    : "Feeder stage"}
                </small>

              </div>

              {index < calc.feeder.length - 1 && (
                <div className="career-connector" />
              )}

            </div>

          ))}

        </div>

      </div>


      {/* =========================
          SENIORITY TRACK
      ========================= */}

      <div className="career-track seniority-track">

        <div className="track-heading">

          <span className="track-number">02</span>

          <div>
            <strong>Seniority / Non-Executive Progression</strong>

            <small>
              PA / SA → LSG → HSG-II → HSG-I
            </small>
          </div>

        </div>


        <div className="career-nodes">

          {calc.seniority.map((stage, index) => (

            <div
  className="career-node-wrap seniority-node-wrap"
  key={`seniority-${stage.role}`}
  style={{
    animationDelay: `${index * 140}ms`
  }}
>

  <div className="career-node seniority-node">

    <div className="node-pulse" />

    <span>
      {stage.value !== null
        ? `≈ ${stage.value}`
        : "—"}
    </span>

  </div>

  <div className="node-status-badge">
    {stage.value !== null
      ? "INDICATIVE"
      : "RULE-DEPENDENT"}
  </div>

  <div className="career-node-info">

    <strong>{stage.role}</strong>

    <small>
      {stage.value !== null
        ? "Indicative seniority milestone"
        : "Depends on applicable seniority, vacancy and rules"}
    </small>

  </div>

  {index < calc.seniority.length - 1 && (
    <div className="career-connector seniority-connector" />
  )}

</div>

          ))}

        </div>


        <div className="track-note">
          <Info size={15} />

          <span>
            Seniority-based progression can vary with cadre strength,
            vacancy position, qualifying service and applicable
            Department of Posts rules.
          </span>
        </div>

      </div>


      {/* =========================
          EXECUTIVE TRACK
      ========================= */}

      <div className="career-track executive-track">

        <div className="track-heading">

          <span className="track-number">03</span>

          <div>
           <strong>Executive / Leadership Track</strong>

<small>
  PA / SA → IP → ASP → SPO / SSRM → DPS
</small>

<div className="track-caption">
  The higher-responsibility route into inspection,
  administration and senior postal leadership.
</div>
          </div>

        </div>


        <div className="executive-timeline">

  <div className="executive-rail" />

  {calc.executive.map((stage, index) => (

    <div
      className={`executive-milestone executive-${stage.type}`}
      key={`executive-${stage.role}`}
      style={{
        animationDelay: `${index * 180}ms`
      }}
    >

      <div className="executive-node-column">

        <div className="executive-node">

          <div className="executive-node-glow" />

          <span>
            {stage.value !== null
  ? (
      mode === "age"
        ? `≈ ${stage.value}`
        : stage.value
    )
  : "—"}
          </span>

        </div>

      </div>

      <div className="executive-content">

        <div className="executive-topline">

          <span className="executive-step">
            0{index + 1}
          </span>

          <span className="executive-stage-type">
            {stage.type === "executive"
              ? "EXECUTIVE"
              : stage.type === "senior"
                ? "SENIOR LEADERSHIP"
                : "SELECTION / SENIORITY"}
          </span>

        </div>

        <h4>{stage.role}</h4>

        <p>
          {stage.note || "Subject to applicable rules"}
        </p>

        <div className="executive-age">

          <span>
            {mode === "age"
              ? "PROJECTED CAREER AGE"
              : "PROJECTED YEAR"}
          </span>

         <strong>
  {stage.value !== null
    ? (
        mode === "age"
          ? `${stage.value} yrs`
          : stage.value
      )
    : "RULE-DEPENDENT"}
</strong>

        </div>

      </div>

    </div>

  ))}

</div>

        <div className="track-note executive-note">
          <Info size={15} />

          <span>
            Executive promotions are not fixed-age milestones.
            Actual progression may depend on examination,
            qualifying service, seniority, vacancies, DPC and
            recruitment rules/orders applicable at that time.
          </span>
        </div>

      </div>


      {/* =========================
          DATA STATUS
      ========================= */}

      <div className="projection-footer">

        <div>
          <span className="status-dot" />
          DATA STATUS
        </div>

        <strong>
          Indicative · Rules may change
        </strong>

        <p>
          Projection is for planning purposes only. Verify the
          latest Department of Posts notification, recruitment
          rules and orders before relying on any eligibility or
          promotion timeline.
        </p>

      </div>

    </div>

  )}

</div>
          </div></Reveal>
        </section>

        <footer className="footer">
          <div className="footer-brand"><span className="brand-mark"><Route size={18}/></span><strong>PostPath</strong></div>
          <p>Reference tool · Not an official Department of Posts publication.</p>
          <p className="disclaimer">Promotion timelines depend on DPC decisions, circle-specific vacancies and official DoP notifications, all of which can change. Published years-of-service requirements for LGO and Inspector Posts exams may vary across sources/circulars. Verify current eligibility against official India Post circulars and Postal Manuals before personal planning.</p>
        </footer>
      </main>
    </div>
    </>
  )
}
createRoot(document.getElementById("root")).render(<App />);
