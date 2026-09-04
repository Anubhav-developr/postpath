import React, { useMemo, useState } from "react";
import { ArrowRight, GitCompareArrows, Route, Sparkles } from "lucide-react";
import "./whatIfSimulator.css";

const ROUTES = [
  {
    id: "direct-pa",
    label: "Direct GDS → PA / SA",
    milestones: [
      { role: "GDS", offset: 0 },
      { role: "PA / SA", offset: 8 },
    ],
  },
  {
    id: "gds-mts-pa",
    label: "GDS → MTS → PA / SA",
    milestones: [
      { role: "GDS", offset: 0 },
      { role: "MTS", offset: 3 },
      { role: "PA / SA", offset: 8 },
    ],
  },
  {
    id: "gds-postman-pa",
    label: "GDS → Postman → PA / SA",
    milestones: [
      { role: "GDS", offset: 0 },
      { role: "Postman", offset: 5 },
      { role: "PA / SA", offset: 8 },
    ],
  },
  {
    id: "gds-mts-postman-pa",
    label: "GDS → MTS → Postman → PA / SA",
    milestones: [
      { role: "GDS", offset: 0 },
      { role: "MTS", offset: 3 },
      { role: "Postman", offset: 6 },
      { role: "PA / SA", offset: 9 },
    ],
  },
];

function buildTimeline(route, startValue) {
  const start = Number(startValue);

  if (!Number.isFinite(start)) {
    return [];
  }

  return route.milestones.map((item) => ({
    ...item,
    projected: start + item.offset,
  }));
}

export default function WhatIfSimulator() {
  const [startValue, setStartValue] = useState(18);
  const [mode, setMode] = useState("age");
  const [routeA, setRouteA] = useState("direct-pa");
  const [routeB, setRouteB] = useState("gds-mts-pa");

  const selectedA = useMemo(
    () => ROUTES.find((route) => route.id === routeA),
    [routeA],
  );

  const selectedB = useMemo(
    () => ROUTES.find((route) => route.id === routeB),
    [routeB],
  );

  const timelineA = useMemo(
    () => buildTimeline(selectedA, startValue),
    [selectedA, startValue],
  );

  const timelineB = useMemo(
    () => buildTimeline(selectedB, startValue),
    [selectedB, startValue],
  );

  const renderProjectedValue = (value) => {
    return mode === "age"
      ? `Projected age: ${value}`
      : `Projected year: ${value}`;
  };

  return (
    <section className="what-if" id="what-if">
      <div className="what-if-heading">
        <div className="what-if-kicker">
          <Sparkles size={15} />
          What-If Career Simulator
        </div>

        <h2>Compare two career routes before you choose.</h2>

        <p>
          Use the same starting point and compare how each existing GDS route
          unfolds.
        </p>
      </div>

      <div className="what-if-controls">
        <div className="what-if-field">
          <label htmlFor="what-if-mode">Start with</label>

          <select
            id="what-if-mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="age">Joining age</option>
            <option value="year">Joining year</option>
          </select>
        </div>

        <div className="what-if-field">
          <label htmlFor="what-if-start">
            {mode === "age" ? "GDS joining age" : "GDS joining year"}
          </label>

          <input
            id="what-if-start"
            type="number"
            min={mode === "age" ? 1 : 1950}
            max={mode === "age" ? 100 : 2100}
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
          />
        </div>

        <div className="what-if-field">
          <label htmlFor="what-if-route-a">Route A</label>

          <select
            id="what-if-route-a"
            value={routeA}
            onChange={(e) => setRouteA(e.target.value)}
          >
            {ROUTES.map((route) => (
              <option key={route.id} value={route.id}>
                {route.label}
              </option>
            ))}
          </select>
        </div>

        <div className="what-if-field">
          <label htmlFor="what-if-route-b">Route B</label>

          <select
            id="what-if-route-b"
            value={routeB}
            onChange={(e) => setRouteB(e.target.value)}
          >
            {ROUTES.map((route) => (
              <option key={route.id} value={route.id}>
                {route.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="what-if-compare">
        {[
          {
            route: selectedA,
            timeline: timelineA,
            tag: "Route A",
          },
          {
            route: selectedB,
            timeline: timelineB,
            tag: "Route B",
          },
        ].map(({ route, timeline, tag }) => (
          <article className="what-if-card" key={tag}>
            <div className="what-if-card-head">
              <div>
                <span className="what-if-tag">
                  <Route size={13} />
                  {tag}
                </span>

                <h3>{route.label}</h3>
              </div>

              <GitCompareArrows size={19} />
            </div>

            <div className="what-if-timeline">
              {timeline.map((item, index) => (
                <div className="what-if-step" key={`${tag}-${item.role}`}>
                  <div className="what-if-line-wrap">
                    <span className="what-if-node">{index + 1}</span>

                    {index < timeline.length - 1 && (
                      <span className="what-if-line" />
                    )}
                  </div>

                  <div>
                    <strong>{item.role}</strong>

                    <span>{renderProjectedValue(item.projected)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="what-if-note">
        <ArrowRight size={16} />

        <span>
          Roadmap comparison uses the same timeline benchmarks already used by
          PostPath.
        </span>
      </div>
    </section>
  );
}
