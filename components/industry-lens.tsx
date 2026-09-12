"use client";

import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { ArrowUpRight, Pause, Play, Sparkles, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAmbientPlayback } from "@/components/use-ambient-playback";

const views = ["outlook", "salary", "skills"] as const;
const viewDuration = 6000;
const sectors = [
  {
    name: "Healthcare",
    ink: "#c9edf0",
    dash: "",
    path: "M10 175 C75 179 82 140 120 147 S190 117 222 126 S282 71 330 82 S410 48 500 29",
  },
  {
    name: "Finance",
    ink: "#85bac6",
    dash: "7 5",
    path: "M10 193 C60 177 91 187 130 169 S203 165 248 142 S313 155 350 121 S430 129 500 89",
  },
  {
    name: "Education",
    ink: "#698e9b",
    dash: "2 5",
    path: "M10 156 C73 148 87 160 135 148 S211 149 255 129 S334 131 382 116 S452 118 500 108",
  },
  {
    name: "Manufacturing",
    ink: "#a0ccd2",
    dash: "12 5 2 5",
    path: "M10 207 C75 191 99 209 147 185 S210 196 263 166 S335 173 380 143 S446 147 500 127",
  },
];

function OutlookPreview() {
  return (
    <>
      <div className="zen-lens-title">
        <div>
          <h3>See where work is moving.</h3>
        </div>
      </div>
      <p className="zen-range-intro">
        Hiring trends and market outlooks, shaped around the industry you work
        in.
      </p>
      <div className="zen-market-plot">
        <div className="zen-chart-label">
          <span className="zen-status" /> Hiring momentum{" "}
          <span>ILLUSTRATIVE TRENDS</span>
        </div>
        <svg
          viewBox="0 0 520 240"
          role="img"
          aria-label="Illustrative hiring trends for healthcare, finance, education, and manufacturing. These demonstrate industry coverage, not live market data."
        >
          <defs>
            <linearGradient id="zen-sector-fill" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#a9dce4" stopOpacity=".14" />
              <stop offset="1" stopColor="#70b7c2" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 90, 140, 190].map((y) => (
            <line
              key={y}
              x1="10"
              y1={y}
              x2="500"
              y2={y}
              stroke="#29434b"
              strokeDasharray="2 6"
            />
          ))}
          {[10, 108, 206, 304, 402, 500].map((x) => (
            <line
              key={x}
              x1={x}
              y1="15"
              x2={x}
              y2="210"
              stroke="#29434b"
              opacity=".3"
            />
          ))}
          <path
            d={sectors[0].path + " L500 212 L10 212 Z"}
            fill="url(#zen-sector-fill)"
          />
          {sectors.map((sector) => (
            <g key={sector.name}>
              <path
                d={sector.path}
                fill="none"
                stroke={sector.ink}
                strokeWidth="2"
                strokeDasharray={sector.dash}
              />
              <circle
                cx="500"
                cy={
                  sector.name === "Healthcare"
                    ? 29
                    : sector.name === "Finance"
                      ? 89
                      : sector.name === "Education"
                        ? 108
                        : 127
                }
                r="3"
                fill={sector.ink}
              />
            </g>
          ))}
          {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((month, i) => (
            <text
              key={month}
              x={i * 96 + 10}
              y="235"
              fill="#7f989f"
              fontSize="10"
              fontFamily="Inter"
            >
              {month}
            </text>
          ))}
        </svg>
      </div>
      <div className="zen-sector-legend">
        {sectors.map((sector) => (
          <span key={sector.name}>
            <svg viewBox="0 0 28 6" aria-hidden="true">
              <path
                d="M0 3 H28"
                stroke={sector.ink}
                strokeWidth="2"
                strokeDasharray={sector.dash}
              />
            </svg>
            {sector.name}
          </span>
        ))}
      </div>
      <p className="zen-demo-note">
        From healthcare and education to technology, retail, and beyond. Start
        with your field.
      </p>
    </>
  );
}

function SalaryPreview() {
  return (
    <>
      <div className="zen-lens-title">
        <div>
          <h3>Put a range to your potential.</h3>
        </div>
      </div>
      <p className="zen-range-intro">
        Explore salary estimates for the roles that matter to you, across
        professional fields.
      </p>
      <div className="zen-salary-demo zen-cross-industry-salaries">
        {[
          {
            role: "Registered nurse",
            sector: "Healthcare",
            low: 65,
            mid: 85,
            high: 115,
          },
          {
            role: "Financial analyst",
            sector: "Finance",
            low: 60,
            mid: 85,
            high: 120,
          },
          {
            role: "Mechanical engineer",
            sector: "Engineering",
            low: 65,
            mid: 90,
            high: 125,
          },
          {
            role: "Graphic designer",
            sector: "Creative & media",
            low: 40,
            mid: 60,
            high: 85,
          },
        ].map((row) => (
          <div key={row.role}>
            <div>
              <span>
                {row.role}
                <small>{row.sector}</small>
              </span>
              <strong>
                ${row.low}–{row.high}k
              </strong>
            </div>
            <div className="zen-salary-track">
              <span
                style={{
                  left: (row.low - 30) / 1.2 + "%",
                  width: (row.high - row.low) / 1.2 + "%",
                }}
              />
              <i style={{ left: (row.mid - 30) / 1.2 + "%" }} />
            </div>
          </div>
        ))}
      </div>
      <div className="zen-range-key">
        <span>
          <i /> Range
        </span>
        <span>
          <b /> Median
        </span>
        <span>USD / YEAR</span>
      </div>
      <p className="zen-demo-note">
        Sample figures for demonstration. Your workspace generates estimates for
        your selected industry.
      </p>
    </>
  );
}

function SkillsPreview() {
  return (
    <>
      <div className="zen-lens-title">
        <div>
          <h3>Find the skills for your next step.</h3>
        </div>
      </div>
      <p className="zen-range-intro">
        Recommendations connect your experience to the needs of your industry.
      </p>
      <div
        className="zen-skill-network zen-industry-network"
        role="img"
        aria-label="Examples of skills in different fields: patient care in healthcare, instruction in education, leadership in business, and visual storytelling in creative work. Your recommendations depend on your profile."
      >
        <svg viewBox="0 0 520 270" aria-hidden="true">
          <defs>
            <radialGradient id="zen-network-light">
              <stop stopColor="#70b7c2" stopOpacity=".18" />
              <stop offset="1" stopColor="#70b7c2" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse
            cx="260"
            cy="135"
            rx="235"
            ry="135"
            fill="url(#zen-network-light)"
          />
          <g fill="none" stroke="#6495a1" strokeWidth=".8">
            <path d="M260 135 Q180 45 95 55 M260 135 Q335 35 425 55 M260 135 Q135 135 95 225 M260 135 Q385 135 425 225" />
            <ellipse
              cx="260"
              cy="135"
              rx="178"
              ry="95"
              strokeDasharray="2 7"
              opacity=".4"
            />
            <circle cx="260" cy="135" r="66" opacity=".25" />
          </g>
        </svg>
        <span className="zen-skill-core">
          Your profile<small>YOUR INDUSTRY + EXPERIENCE</small>
        </span>
        <span className="zen-skill-node zen-skill-a">
          <small>HEALTHCARE</small>Patient care
        </span>
        <span className="zen-skill-node zen-skill-b">
          <small>EDUCATION</small>Instruction
        </span>
        <span className="zen-skill-node zen-skill-c">
          <small>BUSINESS</small>Leadership
        </span>
        <span className="zen-skill-node zen-skill-d">
          <small>CREATIVE</small>Visual storytelling
        </span>
      </div>
      <p className="zen-demo-note">
        A few examples from a much wider landscape. Your workspace recommends
        skills for your own professional path.
      </p>
    </>
  );
}

export function IndustryLens() {
  const { ref, canPlay, reducedMotion } = useAmbientPlayback();
  const [view, setView] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const elapsed = useRef(0);
  const progress = useMotionValue(0);
  const playing = canPlay && !paused && !hovered;

  useAnimationFrame((_, delta) => {
    if (!playing) return;
    elapsed.current += Math.min(delta, 100);
    if (elapsed.current >= viewDuration) {
      elapsed.current = 0;
      setView((current) => (current + 1) % views.length);
    }
    progress.set(elapsed.current / viewDuration);
  });

  return (
    <div
      className="zen-lens zen-industry-carousel"
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest(".zen-motion-control"))
          setPaused(true);
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Explore career insights across industries"
    >
      <Tabs
        value={views[view]}
        onValueChange={(value) => {
          setView(views.indexOf(value as (typeof views)[number]));
          setPaused(true);
          elapsed.current = 0;
          progress.set(0);
        }}
        className="zen-instrument-tabs"
      >
        <div className="zen-lens-controls">
          <TabsList className="zen-tabs" aria-label="Explore industry insights">
            {views.map((value, index) => (
              <TabsTrigger key={value} value={value}>
                {["Outlook", "Pay ranges", "Skills"][index]}
                {view === index && !reducedMotion && (
                  <motion.span
                    className="zen-preview-progress"
                    style={{ scaleX: progress }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {!reducedMotion && (
            <button
              type="button"
              className="zen-motion-control"
              onClick={() => setPaused(!paused)}
              aria-label={
                paused ? "Play industry previews" : "Pause industry previews"
              }
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          )}
        </div>
        <div
          className="zen-industry-panels"
          aria-live={paused ? "polite" : "off"}
        >
          {views.map((value, index) => (
            <TabsContent
              key={value}
              value={value}
              forceMount
              className="zen-lens-panel"
              aria-hidden={view !== index}
              inert={view !== index}
              tabIndex={view === index ? 0 : -1}
            >
              {index === 0 ? (
                <OutlookPreview />
              ) : index === 1 ? (
                <SalaryPreview />
              ) : (
                <SkillsPreview />
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
      <div className="zen-instrument-footer">
        <span>ILLUSTRATIVE PREVIEW · PERSONALIZED IN YOUR WORKSPACE</span>
        <span>0{view + 1} / 03</span>
      </div>
    </div>
  );
}
