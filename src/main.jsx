import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Calculator,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  Copy,
  Download,
  ExternalLink,
  Gauge,
  Github,
  GraduationCap,
  Info,
  Landmark,
  Layers3,
  Mail,
  Menu,
  Route,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";
import html2canvas from "html2canvas";

const trackA = [
  {
    id: "gds",
    index: "00",
    role: "Gramin Dak Sevak",
    short: "GDS",
    level: "Starting point",
    route: "Starting point",
    service: "Starting point",
    body: "The common starting point. From here, multiple departmental routes can open depending on eligibility, vacancies and the applicable examination rules.",
    tone: "origin",
  },
  {
    id: "pa",
    index: "01",
    role: "Postal Assistant / Sorting Assistant",
    short: "PA / SA",
    level: "Pay Level 4",
    route: "LGO / Competitive Examination",
    service:
      "Direct GDS route: 8 years regular GDS service under the applicable rules",
    body: "The main destination for the feeder routes below. PA/SA opens the route toward Inspector Posts and the executive/administrative line.",
    tone: "red",
  },
  {
    id: "ip",
    index: "02",
    role: "Inspector Posts",
    short: "IP",
    level: "Pay Level 7 · Group B",
    route: "Inspector Posts competitive exam (LDCE)",
    service:
      "Qualifying regular PA/SA service under the applicable recruitment rules",
    body: "Commands a Postal Sub-Division — inspecting, auditing and enforcing discipline across a cluster of Branch and Sub Offices.",
    tone: "gold",
  },
  {
    id: "asp",
    index: "03",
    role: "Assistant Superintendent of Posts",
    short: "ASP",
    level: "Pay Level 8 · Group B",
    route: "Seniority + Departmental Promotion Committee (DPC)",
    service: "Applicable IP service requirement",
    body: "Sub-divisional administration; second-in-command for divisional operations.",
    tone: "gold",
  },
  {
    id: "spo",
    index: "04",
    role: "Superintendent of Post Offices / SSRM",
    short: "SPO / SSRM",
    level: "Pay Level 9 · Group B · Gazetted",
    route: "PS Group 'B' departmental exam (LDCE)",
    service: "Applicable cumulative IP + ASP service requirement",
    body: "Divisional Head — full operational, financial and disciplinary authority over an entire postal division.",
    tone: "red",
    featured: true,
  },
  {
    id: "ipos",
    index: "05",
    role: "IPoS Group A",
    short: "IPoS",
    level: "Group A",
    route: "Selection / induction pathway",
    service: "Selection-based induction",
    body: "Regional and senior leadership pathway, including Director Postal Services and Postmaster General trajectories.",
    tone: "violet",
    final: true,
  },
];

const trackB = [
  {
    id: "b-pa",
    index: "01",
    role: "Postal Assistant (PA)",
    level: "Entry point",
    service: "Entry point",
    body: "The common starting point for the general operational seniority line.",
  },
  {
    id: "lsg",
    index: "02",
    role: "Lower Selection Grade",
    level: "Pay Level 5",
    service: "After 5 years as PA",
    body: "A single unified supervisory grade — no sub-levels.",
  },
  {
    id: "hsg2",
    index: "03",
    role: "Higher Selection Grade II",
    level: "Pay Level 6",
    service: "After 6 years in LSG",
    body: 'Promotion depends on a "Fit" declaration from the circle’s DPC.',
  },
  {
    id: "hsg1",
    index: "04",
    role: "Higher Selection Grade I",
    level: "Pay Level 7",
    service: "After 5 years in HSG-II",
    body: "Chief/Head Postmaster of a major urban Head Post Office. No written exam or LDCE required.",
  },
  {
    id: "nfg",
    index: "05",
    role: "HSG-I Non-Functional Grade",
    level: "Pay Level 8",
    service: "Automatically after 2 years in HSG-I",
    body: "A higher non-functional grade on the operational seniority line.",
  },
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
        description: "Starting point",
      },
      {
        role: "PA / SA",
        time: "Year 8",
        description:
          "Competitive / departmental route subject to applicable rules",
      },
    ],
    summary:
      "The straightest GDS-to-PA route: remain in GDS and become eligible for PA/SA after the applicable qualifying service.",
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
        description: "Starting point",
      },
      {
        role: "MTS",
        time: "Year 3",
        description: "GDS → MTS examination / recruitment route",
      },
      {
        role: "PA / SA",
        time: "Year 8*",
        description: "MTS → PA/SA route",
      },
    ],
    summary:
      "Move into MTS first, then progress toward PA/SA. The exact eligibility calculation depends on the service counted under the applicable recruitment rules.",
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
        description: "Starting point",
      },
      {
        role: "Postman",
        time: "Year 5",
        description: "GDS → Postman / Mail Guard examination route",
      },
      {
        role: "PA / SA",
        time: "Year 8*",
        description: "Postman → PA/SA route",
      },
    ],
    summary:
      "Move from GDS into Postman first, then become eligible for the PA/SA route after the applicable service requirement.",
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
        description: "Starting point",
      },
      {
        role: "MTS",
        time: "Year 3",
        description: "GDS → MTS",
      },
      {
        role: "Postman",
        time: "Year 6",
        description: "MTS → Postman",
      },
      {
        role: "PA / SA",
        time: "Year 9*",
        description: "Postman → PA/SA",
      },
    ],
    summary:
      "A longer feeder route where an official moves through both MTS and Postman before entering PA/SA.",
  },
];

const rules = [
  {
    title: "The “Bypass Cadres” Rule",
    icon: Zap,
    body: "A GDS can jump directly to PA via the LGO exam after a qualifying period of service, skipping the intermediate MTS and Postman cadres. Unfilled PA vacancies go first to existing MTS/Postmen who cleared the same exam. Alternative early exits from GDS: the MTS exam (eligible after 3 years) or the Postman exam (eligible after 5 years).",
  },
  {
    title: "Seniority-cum-Fitness",
    icon: ShieldCheck,
    body: "This governs exam-free promotions (LSG → HSG-II → HSG-I). Three gates: an actual sanctioned vacancy, the past 5 years of APAR ratings clearing the benchmark (“Good”/“Very Good”), and a clean vigilance record. DPCs may occasionally relax wait-times during staffing shortages.",
  },
  {
    title: "SPM vs BPM",
    icon: Landmark,
    body: "Branch Postmaster (BPM) heads a rural Branch Office; part-time, extra-departmental, hired on 10th-grade merit. Sub Postmaster (SPM) heads an urban Sub-Post Office; full-time, permanent, typically assigned 3–5 years into the PA cadre.",
  },
];

const strategy = [
  [
    "01",
    "Technical leverage",
    "India Post is scaling IPPB, parcel tracking, cybersecurity and data systems; technical capability can help with infrastructure-oriented assignments.",
  ],
  [
    "02",
    "Build the base",
    "Treat the GDS-to-PA window as a dedicated study block for Postal Manuals Vols. I–VIII and financial handbooks.",
  ],
  [
    "03",
    "First-attempt LGO",
    "A first-attempt LGO clear is the highest-leverage early milestone for the roadmap.",
  ],
  [
    "04",
    "The pivot",
    "The Inspector Posts exam is the key pivot from routine operations into the executive/administrative line.",
  ],
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

            <div className="clock-label">YOUR JOURNEY</div>
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

          <p>Mapping the journey from GDS to the next milestone.</p>
        </div>

        {/* PROGRESS */}
        <div className="loader-progress">
          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>

          <div className="progress-meta">
            <span>POSTPATH SYSTEM</span>
            <span>
              LOADING <b>...</b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${show ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function FeederRoutes() {
  const [active, setActive] = useState("direct-pa");

  return (
    <Reveal className="feeder-section">
      <div className="feeder-header">
        <div>
          <div className="section-kicker">
            <Route size={16} />
            BEFORE PA / SA
          </div>

          <h2>
            The <span>feeder routes.</span>
          </h2>

          <p>
            GDS does not have to follow only one route into PA/SA. These are the
            major progression patterns to keep visible.
          </p>
        </div>
      </div>

      <div className="feeder-grid">
        <div className="feeder-tabs">
          {feederRoutes.map((route) => (
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
            .filter((route) => route.id === active)
            .map((route) => (
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
                          <span className="feeder-connector" />
                        )}
                      </div>

                      <div className="feeder-step-content">
                        <div>
                          <span className="feeder-time">{step.time}</span>

                          <h4>{step.role}</h4>

                          <p>{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="feeder-note">
                  <Info size={16} />
                  <span>{route.summary}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="feeder-footnote">
        * Service eligibility and examination conditions can change by vacancy
        year, recruitment rules and Department of Posts orders. The 2026
        Postman/Mail Guard vacancy year has a one-year relaxation, so the
        displayed years should be treated as roadmap examples, not permanent
        eligibility guarantees.
      </div>
    </Reveal>
  );
}

function StageCard({ item, open, onOpen }) {
  return (
    <Reveal
      className={`stage-wrap ${item.featured ? "featured" : ""} ${item.final ? "final" : ""}`}
    >
      <div className="route-dot">
        <span>{item.index}</span>
      </div>
      <button
        className={`stage-card ${open ? "open" : ""}`}
        onClick={onOpen}
        aria-expanded={open}
      >
        <div className="stage-top">
          <div>
            <div className="eyebrow">{item.short}</div>
            <h3>{item.role}</h3>
          </div>
          <div className={`level ${item.tone}`}>{item.level}</div>
        </div>
        <div className="stage-meta">
          <div>
            <Route size={15} />
            <span>{item.route}</span>
          </div>
          <div>
            <Clock3 size={15} />
            <span>{item.service}</span>
          </div>
        </div>
        <div className={`stage-detail ${open ? "show" : ""}`}>
          <div className="detail-line"></div>
          <p>{item.body}</p>
        </div>
        <div className="expand">
          {open ? <X size={17} /> : <ChevronDown size={17} />}{" "}
          {open ? "Close" : "Explore stage"}
        </div>
      </button>
    </Reveal>
  );
}

function App() {
  const [track, setTrack] = useState("A");
  const [open, setOpen] = useState("pa");
  const [mobileNav, setMobileNav] = useState(false);
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [mode, setMode] = useState("age");
  const [calculatorRoute, setCalculatorRoute] = useState("direct-pa");
  const [shareMessage, setShareMessage] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const shareCardRef = useRef(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const sharedMode = params.get("mode");
    const sharedAge = params.get("age");
    const sharedYear = params.get("year");
    const sharedRoute = params.get("route");
    const sharedName = params.get("name");

    if (sharedMode === "age" || sharedMode === "year") {
      setMode(sharedMode);
    }

    if (sharedAge) {
      setAge(sharedAge);
    }

    if (sharedYear) {
      setYear(sharedYear);
    }

    if (sharedRoute && feederCalculatorRoutes[sharedRoute]) {
      setCalculatorRoute(sharedRoute);
    }

    if (sharedName) {
      setUserName(sharedName);
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    params.set("mode", mode);
    params.set("age", age);
    params.set("year", year);
    params.set("route", calculatorRoute);
    params.set("name", userName.trim());

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }, [mode, age, year, calculatorRoute, userName]);
  const feederCalculatorRoutes = {
    "direct-pa": {
      name: "Direct GDS → PA / SA",

      feeder: [
        { role: "GDS", offset: 0, type: "feeder" },
        { role: "PA / SA", offset: 8, type: "entry" },
      ],

      seniority: [
        { role: "PA / SA", offset: 8, type: "entry" },
        { role: "LSG", offset: null, type: "seniority" },
        { role: "HSG-II", offset: null, type: "seniority" },
        { role: "HSG-I", offset: null, type: "seniority" },
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
        { role: "PA / SA", offset: 8, type: "entry" },
      ],

      seniority: [
        { role: "PA / SA", offset: 8, type: "entry" },
        { role: "LSG", offset: null, type: "seniority" },
        { role: "HSG-II", offset: null, type: "seniority" },
        { role: "HSG-I", offset: null, type: "seniority" },
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
        { role: "PA / SA", offset: 8, type: "entry" },
      ],

      seniority: [
        { role: "PA / SA", offset: 8, type: "entry" },
        { role: "LSG", offset: null, type: "seniority" },
        { role: "HSG-II", offset: null, type: "seniority" },
        { role: "HSG-I", offset: null, type: "seniority" },
      ],

      executive: [
        {
          role: "Inspector Posts (IP)",
          serviceAfterPA: 8,
          type: "executive",
          note: "8 years qualifying service benchmark",
        },
        {
          role: "Assistant Superintendent of Posts (ASP)",
          serviceAfterIP: 5,
          type: "executive",
          note: "5 years regular service benchmark",
        },
        {
          role: "Postal Service Group 'B'",
          serviceAfterASP: 3,
          type: "executive",
          note: "Route and eligibility dependent",
        },
        {
          role: "JTS — Indian Postal Service Group A",
          serviceAfterPSB: 5,
          type: "senior",
          note: "5 years regular service benchmark",
        },
      ],
    },

    "gds-mts-postman-pa": {
      name: "GDS → MTS → Postman → PA / SA",

      feeder: [
        { role: "GDS", offset: 0, type: "feeder" },
        { role: "MTS", offset: 3, type: "feeder" },
        { role: "Postman", offset: 6, type: "feeder" },
        { role: "PA / SA", offset: 9, type: "entry" },
      ],

      seniority: [
        { role: "PA / SA", offset: 9, type: "entry" },
        { role: "LSG", offset: null, type: "seniority" },
        { role: "HSG-II", offset: null, type: "seniority" },
        { role: "HSG-I", offset: null, type: "seniority" },
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
  };

  const executiveCareerTrack = [
    {
      role: "Inspector Posts (IP)",
      type: "executive",
      serviceAfterPA: 8,
      note: "8-year qualifying-service benchmark — actual appointment depends on the applicable examination / selection process.",
    },

    {
      role: "Assistant Superintendent of Posts (ASP)",
      type: "executive",
      serviceAfterIP: 5,
      note: "5 years regular-service benchmark in IP — actual promotion depends on applicable rules, vacancies and DPC.",
    },

    {
      role: "Superintendent of Post Offices (SPO) / PS Group 'B'",
      type: "senior",
      dependent: true,
      note: "Promotion / entry into this grade depends on the applicable route, seniority, vacancies and DPC / LDCE conditions.",
    },

    {
      role: "JTS — Indian Postal Service Group 'A'",
      type: "senior",
      dependent: true,
      note: "Qualifying-service benchmark applies after entry into PS Group 'B'; the benchmark is not an automatic promotion date.",
    },

    {
      role: "STS — Indian Postal Service Group 'A'",
      type: "senior",
      dependent: true,
      note: "Consideration depends on the applicable Recruitment Rules and DPC after the required regular service in JTS.",
    },

    {
      role: "JAG / DPS-level posting",
      type: "senior",
      dependent: true,
      note: "Further advancement depends on the applicable Group 'A' rules, DPC, vacancies and cadre requirements.",
    },
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
            : base + stage.offset,
      }));

    const paStage = route.feeder.find((stage) => stage.role === "PA / SA");

    const paBase = paStage?.offset ?? 0;

    const calculateExecutive = () => {
      const ipOffset = paBase + 8;

      const aspOffset = ipOffset + 5;

      return executiveCareerTrack.map((stage) => {
        let offset = null;

        if (stage.role.includes("Inspector Posts")) {
          offset = ipOffset;
        } else if (stage.role.includes("Assistant Superintendent")) {
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
                : base + offset,
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
            ? mode === "age"
              ? Math.round((base + stage.offset) * 10) / 10
              : base + stage.offset
            : null,
      })),

      executive: calculateExecutive(),
    };
  }, [age, year, mode, calculatorRoute]);
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  };

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const copied = document.execCommand("copy");

      document.body.removeChild(textarea);

      return copied;
    } catch (error) {
      console.error("Copy failed:", error);
      return false;
    }
  };

  const handleCareerShare = async () => {
    if (!shareCardRef.current || !calc) return;

    try {
      setShareMessage("Preparing your career card...");

      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(shareCardRef.current, {
        scale: Math.min(window.devicePixelRatio || 2, 2),
        backgroundColor: "#fffdfa",
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
      });

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error("PNG creation failed"));
          },
          "image/png",
          1,
        );
      });

      const file = new File([blob], "my-postpath-career-map.png", {
        type: "image/png",
      });

      const shareData = {
        files: [file],
        title: "My PostPath Career Map",
        text: `My PostPath career map — ${calc.routeName}.`,
      };

      /* =========================================
       ACTUAL IMAGE SHARE
    ========================================= */

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share(shareData);

        setShareMessage("Career card shared.");
        setTimeout(() => setShareMessage(""), 2200);

        return;
      }

      /* =========================================
       FALLBACK
       If browser cannot share files
    ========================================= */

      const copied = await copyText(window.location.href);

      if (copied) {
        setShareMessage(
          "Image sharing isn't supported here — career link copied.",
        );
      } else {
        setShareMessage("Image sharing isn't supported in this browser.");
      }

      setTimeout(() => setShareMessage(""), 3000);
    } catch (error) {
      /* User closed native share sheet */
      if (error?.name === "AbortError") {
        setShareMessage("");
        return;
      }

      console.error("Image share failed:", error);

      setShareMessage("Could not share the career card. Try Download instead.");

      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  const handleCopyCareerLink = async () => {
    const copied = await copyText(window.location.href);

    setShareMessage(
      copied ? "Personalized roadmap link copied." : "Could not copy the link.",
    );

    setTimeout(() => setShareMessage(""), 2200);
  };

  const handleDownloadCareerCard = async () => {
    if (!shareCardRef.current) {
      setShareMessage("Career card is not ready.");
      setTimeout(() => setShareMessage(""), 2200);
      return;
    }

    try {
      setShareMessage("Preparing your career card...");

      // Give the browser one paint cycle before capturing.
      await new Promise((resolve) => requestAnimationFrame(() => resolve()));

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(shareCardRef.current, {
        scale: Math.min(window.devicePixelRatio || 2, 2),
        backgroundColor: "#fffdfa",
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 15000,
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          setShareMessage("Could not create the image.");
          setTimeout(() => setShareMessage(""), 2200);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "my-postpath-career-map.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);

        setShareMessage("Career card downloaded.");

        setTimeout(() => setShareMessage(""), 2200);
      }, "image/png");
    } catch (error) {
      console.error("Career card download failed:", error);

      setShareMessage("Could not create the career card. Please try again.");

      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  return (
    <>
      <Preloader />
      <div className="app">
        <div className="grain"></div>
        <header className="nav">
          <div className="nav-inner">
            <button className="brand" onClick={() => scrollTo("top")}>
              <span className="brand-mark">
                <Route size={19} />
              </span>
              <span>
                Post<span>Path</span>
              </span>
            </button>
            <nav className={mobileNav ? "nav-links show" : "nav-links"}>
              <button onClick={() => scrollTo("roadmap")}>Roadmap</button>
              <button onClick={() => scrollTo("rules")}>Rules</button>
              <button onClick={() => scrollTo("strategy")}>Strategy</button>
              <button onClick={() => scrollTo("calculator")}>Timeline</button>
            </nav>
            <button
              className="menu-btn"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label="Toggle navigation"
            >
              {mobileNav ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        <main id="top">
          <section className="hero">
            <div className="hero-orbit orbit-a"></div>
            <div className="hero-orbit orbit-b"></div>
            <div className="hero-grid"></div>
            <Reveal className="hero-copy">
              <div className="pill">
                <Sparkles size={14} /> CAREER INTELLIGENCE · DEPARTMENT OF POSTS
              </div>
              <h1>
                From <em>GDS</em> to
                <br />
                <span>Group A.</span>
              </h1>
              <p className="hero-sub">
                A visual career map for navigating the executive, administrative
                and seniority pathways inside India’s Department of Posts.
              </p>
              <div className="hero-actions">
                <button className="primary" onClick={() => scrollTo("roadmap")}>
                  Explore the roadmap <ArrowDown size={18} />
                </button>
                <button
                  className="ghost"
                  onClick={() => scrollTo("calculator")}
                >
                  <Calculator size={17} /> Plot my timeline
                </button>
              </div>
              <div className="hero-proof">
                <div>
                  <strong>2</strong>
                  <span>career tracks</span>
                </div>
                <i></i>
                <div>
                  <strong>6</strong>
                  <span>executive stages</span>
                </div>
                <i></i>
                <div>
                  <strong>∞</strong>
                  <span>possibilities</span>
                </div>
              </div>
            </Reveal>
            <div className="hero-map" aria-hidden="true">
              <div className="map-label top">EXECUTIVE LINE</div>
              <div className="map-line">
                {trackA.map((x, i) => (
                  <div className="map-node" key={x.id} style={{ "--i": i }}>
                    <span>{x.index}</span>
                    <small>{x.short}</small>
                  </div>
                ))}
              </div>
              <div className="map-arrow">
                <ArrowRight size={18} />
              </div>
            </div>
          </section>

          <section className="section roadmap-section" id="roadmap">
            <Reveal>
              <div className="section-kicker">
                <Compass size={16} /> THE MASTER MAP
              </div>
              <div className="section-heading">
                <div>
                  <h2>
                    Choose your <span>line.</span>
                  </h2>
                  <p>
                    Two routes. One starting point. Very different destinations.
                  </p>
                </div>
                <div className="track-switch">
                  <button
                    className={track === "A" ? "active" : ""}
                    onClick={() => setTrack("A")}
                  >
                    Track A <small>Executive</small>
                  </button>
                  <button
                    className={track === "B" ? "active" : ""}
                    onClick={() => setTrack("B")}
                  >
                    Track B <small>Seniority</small>
                  </button>
                </div>
              </div>
            </Reveal>

            <div className={`track-banner ${track === "B" ? "track-b" : ""}`}>
              <div>
                <span className="banner-num">{track === "A" ? "A" : "B"}</span>
                <div>
                  <strong>
                    {track === "A"
                      ? "Executive & Administrative Fast-Track"
                      : "General Operational Seniority Line"}
                  </strong>
                  <p>
                    {track === "A"
                      ? "The route that opens progressively broader administrative authority."
                      : "The steadier seniority path — flatter progression, with a ceiling below the executive line."}
                  </p>
                </div>
              </div>
              <span className="banner-status">
                <Gauge size={15} />{" "}
                {track === "A" ? "HIGH LEVERAGE" : "STEADY PACE"}
              </span>
            </div>
            {track === "A" && <FeederRoutes />}
            {track === "A" ? (
              <div className="roadmap">
                {trackA.map((item) => (
                  <StageCard
                    key={item.id}
                    item={item}
                    open={open === item.id}
                    onOpen={() => setOpen(open === item.id ? "" : item.id)}
                  />
                ))}
                <Reveal className="destination">
                  <div className="destination-card">
                    <div className="destination-glow"></div>
                    <GraduationCap size={25} />
                    <div>
                      <span>REGIONAL LEADERSHIP</span>
                      <strong>
                        DPS · Pay Level 12 &nbsp;→&nbsp; PMG · Pay Level 14
                      </strong>
                      <p>Senior IPoS Group A trajectory</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            ) : (
              <div className="seniority-roadmap">
                <div className="seniority-road-line"></div>

                {trackB.map((stage, index) => (
                  <Reveal key={stage.id}>
                    <div
                      className="seniority-stage"
                      style={{
                        animationDelay: `${index * 140}ms`,
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

                          <div className="seniority-pay">{stage.level}</div>
                        </div>

                        <p>{stage.body}</p>

                        <div className="seniority-service">
                          <Clock3 size={14} />

                          <span>{stage.service}</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}

                <Reveal>
                  <div className="seniority-ceiling">
                    <div className="ceiling-icon">
                      <Info size={16} />
                    </div>

                    <div>
                      <strong>Operational Seniority Ceiling</strong>

                      <p>
                        This line progresses through operational seniority
                        grades and does not itself provide the district-level or
                        regional administrative route represented by Track A.
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            )}
          </section>

          <section className="section rules-section" id="rules">
            <Reveal>
              <div className="section-kicker">
                <Layers3 size={16} /> INSTITUTIONAL RULES
              </div>
              <div className="section-heading">
                <div>
                  <h2>
                    The rules behind
                    <br />
                    the <span>route.</span>
                  </h2>
                  <p>
                    Reference cards for the details that can change how the map
                    plays out.
                  </p>
                </div>
              </div>
            </Reveal>
            <div className="rules-grid">
              {rules.map((r, i) => {
                const Icon = r.icon;
                return (
                  <Reveal key={r.title} className="rule-card">
                    <div className="rule-num">0{i + 1}</div>
                    <Icon size={22} />
                    <h3>{r.title}</h3>
                    <p>{r.body}</p>
                    <button onClick={() => setOpen(r.title)}>
                      Read context <ArrowRight size={15} />
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </section>

          <section className="section strategy-section" id="strategy">
            <Reveal>
              <div className="strategy-head">
                <div>
                  <div className="section-kicker">
                    <Target size={16} /> STRATEGY NOTES
                  </div>
                  <h2>Play the long game.</h2>
                </div>
                <span>Four principles to keep the roadmap moving.</span>
              </div>
            </Reveal>
            <div className="strategy-grid">
              {strategy.map((s) => (
                <Reveal key={s[0]}>
                  <div className="strategy-card">
                    <span>{s[0]}</span>
                    <h3>{s[1]}</h3>
                    <p>{s[2]}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          <section className="calculator-section" id="calculator">
            <div className="calc-glow"></div>
            <Reveal>
              <div className="section-kicker">
                <Calculator size={16} /> PLOT YOUR OWN TIMELINE
              </div>
              <div className="calc-layout">
                <div className="calculator-left">
                  <h2>
                    Turn the map
                    <br />
                    into <span>your timeline.</span>
                  </h2>
                  <p>
                    Enter your GDS joining age or year. PostPath separates
                    qualifying-service benchmarks from actual promotion
                    outcomes, so the projection is useful for planning without
                    presenting a guaranteed promotion date.
                  </p>
                  <div className="input-tabs">
                    <button
                      className={mode === "age" ? "active" : ""}
                      onClick={() => setMode("age")}
                    >
                      Joining age
                    </button>
                    <button
                      className={mode === "year" ? "active" : ""}
                      onClick={() => setMode("year")}
                    >
                      Joining year
                    </button>
                  </div>
                  <div className="calculator-route-selector">
                    <label>CHOOSE YOUR FEEDER ROUTE</label>

                    <select
                      value={calculatorRoute}
                      onChange={(e) => setCalculatorRoute(e.target.value)}
                    >
                      <option value="direct-pa">GDS → PA / SA</option>

                      <option value="gds-mts-pa">GDS → MTS → PA / SA</option>

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
                        This calculator provides a rough career-path projection
                        from GDS to PA/SA and beyond. Executive and senior
                        promotions are not guaranteed on a fixed timeline and
                        may depend on qualifying service, vacancies, seniority,
                        examinations, DPC decisions and the recruitment
                        rules/orders applicable at that time.
                      </p>

                      <span>
                        ⚠ Rules and eligibility may change. Always verify the
                        latest Department of Posts notification before making a
                        career decision.
                      </span>
                    </div>
                  </div>
                  <div className="eligibility-guide">
                    <div className="eligibility-guide-title">
                      <ShieldCheck size={16} />
                      <span>READ THE TIMELINE CORRECTLY</span>
                    </div>

                    <div className="eligibility-guide-grid">
                      <div className="eligibility-item">
                        <span className="eligibility-dot benchmark"></span>
                        <div>
                          <strong>Eligibility benchmark</strong>
                          <small>
                            Qualifying-service threshold used for consideration.
                          </small>
                        </div>
                      </div>

                      <div className="eligibility-item">
                        <span className="eligibility-dot promotion"></span>
                        <div>
                          <strong>Actual promotion</strong>
                          <small>
                            Depends on vacancy, seniority, examination, DPC and
                            applicable Recruitment Rules.
                          </small>
                        </div>
                      </div>

                      <div className="eligibility-item">
                        <span className="eligibility-dot dependent"></span>
                        <div>
                          <strong>Rule-dependent</strong>
                          <small>
                            No fixed age is shown where a defensible universal
                            promotion interval is unavailable.
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="input-wrap name-input-wrap">
                    <span>NAME</span>

                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Anubhav Mishra"
                      maxLength={40}
                    />
                  </div>
                  <div className="input-wrap">
                    <span>{mode === "age" ? "AGE" : "YEAR"}</span>
                    <input
                      type="number"
                      min="1"
                      value={mode === "age" ? age : year}
                      onChange={(e) =>
                        mode === "age"
                          ? setAge(e.target.value)
                          : setYear(e.target.value)
                      }
                      placeholder={mode === "age" ? "e.g. 24" : "e.g. 2026"}
                    />
                  </div>
                  {calc && (
                    <div className="career-snapshot">
                      <div className="snapshot-top">
                        <div>
                          <span className="snapshot-kicker">YOUR POSTPATH</span>

                          <h3>Career Snapshot</h3>
                        </div>

                        <div className="snapshot-icon">
                          <Route size={17} />
                        </div>
                      </div>

                      <div className="snapshot-route">
                        <span>SELECTED ROUTE</span>

                        <strong>{calc.routeName}</strong>
                      </div>

                      <div className="snapshot-grid">
                        <div className="snapshot-stat">
                          <span>
                            STARTING {mode === "age" ? "AGE" : "YEAR"}
                          </span>

                          <strong>
                            {mode === "age" ? `${age} yrs` : year}
                          </strong>
                        </div>

                        <div className="snapshot-stat">
                          <span>PA / SA</span>

                          <strong>
                            {calc.feeder.find(
                              (stage) => stage.role === "PA / SA",
                            )?.value ?? "—"}
                          </strong>
                        </div>
                      </div>

                      <div className="snapshot-divider"></div>

                      <div className="snapshot-next">
                        <div>
                          <span>NEXT EXECUTIVE MILESTONE</span>

                          <strong>Inspector Posts (IP)</strong>
                        </div>

                        <span className="snapshot-arrow">→</span>
                      </div>

                      <button
                        className="snapshot-share-btn"
                        onClick={() => setShareModalOpen(true)}
                      >
                        <Share2 size={16} />
                        <span>Share Career Card</span>
                      </button>
                    </div>
                  )}
                  <div className="mobile-results">
                    {!calc ? (
                      <div className="results-empty premium-results-empty">
                        <div className="empty-route-icon">
                          <Route size={23} />
                        </div>

                        <span className="empty-kicker">YOUR CAREER MAP</span>

                        <h3>
                          Your timeline
                          <br />
                          <span>starts here.</span>
                        </h3>

                        <p>
                          Enter your starting age or year to reveal your
                          projected PostPath career journey.
                        </p>

                        <div className="empty-route-line">
                          <span></span>
                          <i></i>
                          <span></span>
                        </div>

                        <small>
                          Select a starting point to plot your milestones
                        </small>
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
                                  animationDelay: `${index * 120}ms`,
                                }}
                              >
                                <div className="career-node">
                                  <div className="node-pulse" />

                                  <span>
                                    {stage.value !== null
                                      ? mode === "age"
                                        ? `≈ ${stage.value} yrs`
                                        : stage.value
                                      : "RULE-DEPENDENT"}
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
                              <strong>
                                Seniority / Non-Executive Progression
                              </strong>

                              <small>PA / SA → LSG → HSG-II → HSG-I</small>
                            </div>
                          </div>

                          <div className="career-nodes">
                            {calc.seniority.map((stage, index) => (
                              <div
                                className="career-node-wrap seniority-node-wrap"
                                key={`seniority-${stage.role}`}
                                style={{
                                  animationDelay: `${index * 140}ms`,
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
                              Seniority-based progression can vary with cadre
                              strength, vacancy position, qualifying service and
                              applicable Department of Posts rules.
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
                                  animationDelay: `${index * 180}ms`,
                                }}
                              >
                                <div className="executive-node-column">
                                  <div className="executive-node">
                                    <div className="executive-node-glow" />

                                    <span>
                                      {stage.value !== null
                                        ? mode === "age"
                                          ? `≈ ${stage.value}`
                                          : stage.value
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
                                    {stage.note ||
                                      "Subject to applicable rules"}
                                  </p>

                                  <div className="executive-age">
                                    <span>
                                      {stage.value !== null
                                        ? mode === "age"
                                          ? "ELIGIBILITY BENCHMARK AGE"
                                          : "ELIGIBILITY BENCHMARK YEAR"
                                        : "ACTUAL PROMOTION TIMING"}
                                    </span>

                                    <strong>
                                      {stage.value !== null
                                        ? mode === "age"
                                          ? `${stage.value} yrs`
                                          : stage.value
                                        : "RULE-DEPENDENT"}
                                    </strong>
                                    <div className="promotion-status">
                                      <span
                                        className={
                                          stage.value !== null
                                            ? "promotion-status-badge benchmark-status"
                                            : "promotion-status-badge dependent-status"
                                        }
                                      >
                                        {stage.value !== null
                                          ? "ELIGIBILITY ≠ PROMOTION"
                                          : "PROMOTION DEPENDENT"}
                                      </span>
                                    </div>
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

                          <strong>Indicative · Rules may change</strong>

                          <p>
                            Projection is for planning purposes only. Verify the
                            latest Department of Posts notification, recruitment
                            rules and orders before relying on any eligibility
                            or promotion timeline.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {calc && (
                    <div className="mobile-share">
                      <button
                        type="button"
                        onClick={() => setShareModalOpen(true)}
                      >
                        <Share2 size={16} />
                        Share Career Plan
                      </button>
                    </div>
                  )}

                  <div className="career-journey-animation postpath-mini-animation">
                    <div className="mini-sky">
                      <span className="mini-sun"></span>
                      <span className="mini-cloud cloud-a"></span>
                      <span className="mini-cloud cloud-b"></span>
                    </div>

                    <div className="mini-hill hill-1"></div>
                    <div className="mini-hill hill-2"></div>

                    <div className="mini-tree">
                      <span className="tree-crown"></span>
                      <span className="tree-trunk"></span>
                    </div>

                    <div className="mini-house">
                      <span className="house-roof"></span>
                      <span className="house-wall"></span>
                      <span className="house-door"></span>
                      <span className="house-window"></span>
                    </div>

                    <div className="mini-ground">
                      <span className="mini-path"></span>
                    </div>

                    <div className="mini-postman">
                      <span className="mini-head">
                        <i></i>
                      </span>
                      <span className="mini-cap"></span>

                      <span className="mini-body">
                        <b>POST</b>
                      </span>

                      <span className="mini-arm arm-back"></span>
                      <span className="mini-arm arm-front"></span>

                      <span className="mini-leg leg-left"></span>
                      <span className="mini-leg leg-right"></span>

                      <span className="mini-bag">
                        <b>✉</b>
                      </span>
                    </div>

                    <div className="mini-letter">
                      <span>POST</span>
                    </div>

                    <div className="mini-mailbox">
                      <span></span>
                    </div>

                    <div className="mini-glow"></div>

                    <div className="mini-caption">
                      <span>POSTPATH JOURNEY</span>
                      <strong>Every journey begins with a step.</strong>
                    </div>
                  </div>
                </div>

                <div className="results">
                  {!calc ? (
                    <div className="results-empty premium-results-empty">
                      <div className="empty-route-icon">
                        <Route size={23} />
                      </div>

                      <span className="empty-kicker">YOUR CAREER MAP</span>

                      <h3>
                        Your timeline
                        <br />
                        <span>starts here.</span>
                      </h3>

                      <p>
                        Enter your starting age or year to reveal your projected
                        PostPath career journey.
                      </p>

                      <div className="empty-route-line">
                        <span></span>
                        <i></i>
                        <span></span>
                      </div>

                      <small>
                        Select a starting point to plot your milestones
                      </small>
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
                                animationDelay: `${index * 120}ms`,
                              }}
                            >
                              <div className="career-node">
                                <div className="node-pulse" />

                                <span>
                                  {stage.value !== null
                                    ? mode === "age"
                                      ? `≈ ${stage.value} yrs`
                                      : stage.value
                                    : "RULE-DEPENDENT"}
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
                            <strong>
                              Seniority / Non-Executive Progression
                            </strong>

                            <small>PA / SA → LSG → HSG-II → HSG-I</small>
                          </div>
                        </div>

                        <div className="career-nodes">
                          {calc.seniority.map((stage, index) => (
                            <div
                              className="career-node-wrap seniority-node-wrap"
                              key={`seniority-${stage.role}`}
                              style={{
                                animationDelay: `${index * 140}ms`,
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
                            Seniority-based progression can vary with cadre
                            strength, vacancy position, qualifying service and
                            applicable Department of Posts rules.
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

                            <small>PA / SA → IP → ASP → SPO / SSRM → DPS</small>

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
                                animationDelay: `${index * 180}ms`,
                              }}
                            >
                              <div className="executive-node-column">
                                <div className="executive-node">
                                  <div className="executive-node-glow" />

                                  <span>
                                    {stage.value !== null
                                      ? mode === "age"
                                        ? `≈ ${stage.value}`
                                        : stage.value
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
                                    {stage.value !== null
                                      ? mode === "age"
                                        ? "ELIGIBILITY BENCHMARK AGE"
                                        : "ELIGIBILITY BENCHMARK YEAR"
                                      : "ACTUAL PROMOTION TIMING"}
                                  </span>

                                  <strong>
                                    {stage.value !== null
                                      ? mode === "age"
                                        ? `${stage.value} yrs`
                                        : stage.value
                                      : "RULE-DEPENDENT"}
                                  </strong>
                                  <div className="promotion-status">
                                    <span
                                      className={
                                        stage.value !== null
                                          ? "promotion-status-badge benchmark-status"
                                          : "promotion-status-badge dependent-status"
                                      }
                                    >
                                      {stage.value !== null
                                        ? "ELIGIBILITY ≠ PROMOTION"
                                        : "PROMOTION DEPENDENT"}
                                    </span>
                                  </div>
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

                        <strong>Indicative · Rules may change</strong>

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
              </div>
            </Reveal>
          </section>

          <footer className="footer">
            <div className="footer-route-line">
              <span></span>
            </div>

            <div className="footer-main">
              {/* BRAND */}
              <div className="footer-brand-block">
                <button
                  className="footer-brand"
                  onClick={() => scrollTo("top")}
                  aria-label="Back to PostPath home"
                >
                  <span className="brand-mark">
                    <Route size={18} />
                  </span>

                  <span>
                    Post<span>Path</span>
                  </span>
                </button>

                <p className="footer-tagline">Your career. A clearer path.</p>

                <p className="footer-intro">
                  An interactive career-roadmap and timeline tool for
                  understanding GDS, PA/SA, executive and seniority pathways
                  across the Department of Posts.
                </p>
              </div>

              {/* NAVIGATION */}
              <div className="footer-column">
                <span className="footer-heading">EXPLORE</span>

                <button onClick={() => scrollTo("roadmap")}>Roadmap</button>

                <button onClick={() => scrollTo("rules")}>
                  Institutional Rules
                </button>

                <button onClick={() => scrollTo("strategy")}>
                  Strategy Notes
                </button>

                <button onClick={() => scrollTo("calculator")}>
                  Career Timeline
                </button>
              </div>

              {/* CONNECT */}
              <div className="footer-column">
                <span className="footer-heading">CONNECT</span>

                <a
                  href="https://github.com/Anubhav-developr/postpath"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={14} />
                  GitHub
                </a>

                <a href="mailto:anubhavm1234@gmail.com">
                  <Mail size={14} />
                  Contact
                </a>

                <a href="https://postpath.in" target="_blank" rel="noreferrer">
                  <ExternalLink size={14} />
                  postpath.in
                </a>
              </div>

              {/* STATUS */}
              <div className="footer-column footer-status-column">
                <span className="footer-heading">DATA STATUS</span>

                <div className="footer-status">
                  <span className="footer-status-dot"></span>

                  <div>
                    <strong>Indicative reference tool</strong>

                    <small>Rules & eligibility may change</small>
                  </div>
                </div>

                <p className="footer-status-note">
                  Always verify the latest Department of Posts notifications,
                  recruitment rules and official orders before making a career
                  decision.
                </p>
              </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="footer-bottom">
              <div>© {new Date().getFullYear()} PostPath</div>

              <div className="footer-bottom-center">
                Built for clarity, not certainty.
              </div>

              <button className="back-top" onClick={() => scrollTo("top")}>
                Back to top
                <ArrowDown size={13} />
              </button>
            </div>
          </footer>
        </main>
        {shareModalOpen && (
          <div
            className="share-modal-overlay"
            onClick={() => setShareModalOpen(false)}
          >
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <div className="share-modal-header">
                <div>
                  <span className="share-modal-eyebrow">
                    INDIA POST CAREER ANALYTICS
                  </span>

                  <h3>Your Career Card</h3>

                  <p>
                    Preview your personalized career journey before sharing.
                  </p>
                </div>

                <button
                  className="share-modal-close"
                  onClick={() => setShareModalOpen(false)}
                  aria-label="Close share preview"
                >
                  <X size={18} />
                </button>
              </div>

              <div ref={shareCardRef} className="share-preview">
                <div className="share-preview-top">
                  <div className="share-preview-brand">
                    <span className="brand-mark">
                      <Route size={16} />
                    </span>

                    <strong>
                      Post<span>Path</span>
                    </strong>
                  </div>

                  <span>CAREER MAP</span>
                </div>

                <div className="share-preview-person">
                  <span>CAREER PROFILE</span>

                  <strong>{userName.trim() || "Your Career Map"}</strong>
                </div>
                <div className="share-profile-stats">
                  <div>
                    <span>STARTING AGE</span>
                    <strong>{mode === "age" ? `${age} yrs` : "—"}</strong>
                  </div>

                  <div>
                    <span>STARTING YEAR</span>
                    <strong>{mode === "year" ? year : "—"}</strong>
                  </div>

                  <div>
                    <span>STARTING POST</span>
                    <strong>GDS</strong>
                  </div>
                </div>
                <div className="share-preview-route">{calc.routeName}</div>
                <div className="share-career-line">
                  <div className="share-line-track"></div>

                  {calc.feeder.map((stage, index) => (
                    <div
                      className="share-line-node"
                      key={`line-feeder-${stage.role}`}
                    >
                      <span>{index + 1}</span>

                      <small>{stage.role}</small>
                    </div>
                  ))}

                  <div className="share-line-break">EXECUTIVE PATH</div>

                  {calc.executive.map((stage, index) => (
                    <div
                      className="share-line-node executive"
                      key={`line-executive-${stage.role}`}
                    >
                      <span>{calc.executive.length > 0 ? index + 1 : ""}</span>

                      <small>
                        {stage.role
                          .replace("Assistant Superintendent of Posts", "ASP")
                          .replace("Inspector Posts", "IP")
                          .replace(
                            "Indian Postal Service Group 'A'",
                            "IPoS Group A",
                          )}
                      </small>
                    </div>
                  ))}
                </div>

                <div className="share-preview-start">
                  <span>STARTING {mode === "age" ? "AGE" : "YEAR"}</span>

                  <strong>{mode === "age" ? `${age} yrs` : year}</strong>
                </div>

                <div className="share-preview-milestones">
                  {calc.feeder.map((stage) => (
                    <div
                      className="share-mini-stage"
                      key={`share-feeder-${stage.role}`}
                    >
                      <span>{stage.role}</span>

                      <strong>
                        {mode === "age" ? `${stage.value} yrs` : stage.value}
                      </strong>

                      <small>FEEDER</small>
                    </div>
                  ))}

                  {calc.executive.map((stage) => (
                    <div
                      className="share-mini-stage"
                      key={`share-executive-${stage.role}`}
                    >
                      <span>{stage.role}</span>

                      <strong>
                        {stage.value !== null
                          ? mode === "age"
                            ? `≈ ${stage.value} yrs`
                            : stage.value
                          : "RULE-DEPENDENT"}
                      </strong>

                      <small>
                        {stage.value !== null
                          ? "ELIGIBILITY BENCHMARK"
                          : "ACTUAL TIMING DEPENDENT"}
                      </small>
                    </div>
                  ))}
                </div>

                <div className="share-preview-footer">
                  <span>INDICATIVE · RULES MAY CHANGE</span>

                  <strong>postpath.in</strong>
                </div>
              </div>

              <div className="share-modal-actions">
                <button
                  type="button"
                  className="share-action primary-share"
                  onClick={handleCareerShare}
                >
                  <Share2 size={15} />
                  Share
                </button>

                <button
                  type="button"
                  className="share-action"
                  onClick={handleDownloadCareerCard}
                >
                  <Download size={15} />
                  Download
                </button>

                <button
                  className="share-action"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setShareMessage("Career map link copied.");
                    setTimeout(() => setShareMessage(""), 2200);
                  }}
                >
                  <Copy size={15} />
                  Copy Link
                </button>
              </div>

              {shareMessage && (
                <div className="share-modal-message">{shareMessage}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
