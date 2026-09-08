"use client";
import { useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { IndustryInsight } from "@prisma/client";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
  location?: string;
};
const salaryColors = {
  min: "#68757b",
  median: "#edf2f3",
  max: "#70b7c2",
} as const;
const nextSteps = [
  {
    label: "Understand the market",
    title: "Find the skills worth your attention.",
    text: "Start with the skills and trends below. Use your industry's outlook to choose what to explore next.",
    href: "#market-skills",
    action: "Explore the signals",
  },
  {
    label: "Test my knowledge",
    title: "Turn what you know into confidence.",
    text: "Take a personalized assessment, review each answer, and identify where a little practice could make a difference.",
    href: "/interview",
    action: "Open interview prep",
  },
  {
    label: "Prepare my application",
    title: "Put your experience into words.",
    text: "Build a focused resume, then pair it with a cover letter that connects your experience to the opportunity.",
    href: "/resume",
    action: "Open resume studio",
  },
];
export const DashboardView = ({ insights }: { insights: IndustryInsight }) => {
  const [focus, setFocus] = useState(0);
  const mobile = useMediaQuery("(max-width: 768px)");
  const ranges = insights.salaryRanges as SalaryRange[];
  const salaryData = ranges.map((r) => ({
    name: r.role,
    min: r.min / 1000,
    median: r.median / 1000,
    max: r.max / 1000,
  }));
  const industry = insights.industry
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
  const OutlookIcon =
    insights.marketOutlook === "POSITIVE"
      ? TrendingUp
      : insights.marketOutlook === "NEGATIVE"
        ? TrendingDown
        : Minus;
  return (
    <div className="career-dashboard">
      <section
        className="career-orientation"
        aria-labelledby="career-focus-title"
      >
        <div className="orientation-context">
          <span className="eyebrow">YOUR CURRENT LANDSCAPE</span>
          <h2>{industry}</h2>
          <p>Choose what you want to move forward today.</p>
        </div>
        <div className="orientation-action">
          <div
            className="focus-options"
            role="group"
            aria-label="Choose your next step"
          >
            {nextSteps.map((step, i) => (
              <button
                key={step.label}
                type="button"
                aria-pressed={focus === i}
                onClick={() => setFocus(i)}
              >
                {step.label}
              </button>
            ))}
          </div>
          <div className="focus-content" aria-live="polite">
            <h3 id="career-focus-title">{nextSteps[focus].title}</h3>
            <p>{nextSteps[focus].text}</p>
            <Button asChild>
              <Link href={nextSteps[focus].href}>
                {nextSteps[focus].action}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="data-section-heading">
        <div>
          <p className="eyebrow">01 / YOUR INDUSTRY IN PERSPECTIVE</p>
          <h2>Read the signals.</h2>
        </div>
        <span>
          Updated {format(new Date(insights.lastUpdated), "dd MMM yyyy")}
        </span>
      </div>
      <section className="market-overview" aria-label="Industry overview">
        <div className="market-primary">
          <p>MARKET OUTLOOK</p>
          <div>
            <strong className="capitalize">
              {insights.marketOutlook.toLowerCase()}
            </strong>
            <OutlookIcon size={24} aria-hidden="true" />
          </div>
          <span>
            Next refresh{" "}
            {formatDistanceToNow(new Date(insights.nextUpdate), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="market-stat">
          <p>INDUSTRY GROWTH</p>
          <strong>
            {insights.growthRate.toFixed(1)}
            <span>%</span>
          </strong>
          <span>Estimated annual growth</span>
        </div>
        <div className="market-stat">
          <p>HIRING DEMAND</p>
          <strong>{insights.demandLevel}</strong>
          <div className="demand-scale" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                data-active={
                  i < { Low: 1, Medium: 2, High: 3 }[insights.demandLevel]
                }
              />
            ))}
          </div>
          <span>Industry demand level</span>
        </div>
      </section>
      <p className="data-note">
        AI-generated estimates, refreshed weekly. Use these as a starting point
        for your own market research.
      </p>

      <section id="market-skills" className="market-skills-section">
        <div>
          <div className="data-section-heading">
            <div>
              <p className="eyebrow">02 / SKILLS & OPPORTUNITY</p>
              <h2>What matters in your field.</h2>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-7 mb-6">
            Explore the connections between today’s in-demand skills and areas
            to develop next.
          </p>
        </div>
        <div className="skill-landscape">
          <div className="skill-column">
            <h3>
              In demand now <span>{insights.topSkills.length} skills</span>
            </h3>
            <div className="skill-tags">
              {insights.topSkills.map((skill, i) => (
                <span key={i}>{skill}</span>
              ))}
            </div>
          </div>
          <div className="skill-bridge" aria-hidden="true">
            <ArrowRight />
          </div>
          <div className="skill-column skill-future">
            <h3>
              Worth exploring{" "}
              <span>{insights.recommendedSkills.length} skills</span>
            </h3>
            <div className="skill-tags">
              {insights.recommendedSkills.map((skill, i) => (
                <span key={i}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
        <Link href="/interview" className="text-link mt-6">
          See where your knowledge stands
        </Link>
      </section>

      <section className="salary-section">
        <div className="data-section-heading">
          <div>
            <p className="eyebrow">03 / UNDERSTAND YOUR POSSIBILITIES</p>
            <h2>Salary, in context.</h2>
          </div>
          <span>Annual salary · USD, thousands</span>
        </div>
        <div className="chart-legend">
          <span>
            <i style={{ background: salaryColors.min }} /> Minimum
          </span>
          <span>
            <i style={{ background: salaryColors.median }} /> Median
          </span>
          <span>
            <i style={{ background: salaryColors.max }} /> Maximum
          </span>
        </div>
        {salaryData.length ? (
          <div
            className="salary-chart"
            style={{
              height: Math.max(250, salaryData.length * (mobile ? 68 : 58)),
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salaryData}
                layout="vertical"
                margin={{ left: 0, right: 15, top: 15, bottom: 15 }}
                barCategoryGap="22%"
              >
                <CartesianGrid horizontal={false} strokeDasharray="3 5" />
                <XAxis type="number" tickFormatter={(v) => "$" + v + "k"} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={mobile ? 100 : 175}
                  tick={{ fontSize: mobile ? 10 : 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#70b7c208" }}
                  content={({ active, payload, label }) =>
                    active && payload?.length ? (
                      <div className="chart-tooltip">
                        <strong>{label}</strong>
                        {payload.map((p) => (
                          <p key={String(p.dataKey)}>
                            {p.name}: ${Number(p.value).toLocaleString("en-US")}
                            k
                          </p>
                        ))}
                      </div>
                    ) : null
                  }
                />
                <Bar
                  isAnimationActive={false}
                  dataKey="min"
                  name="Minimum"
                  fill={salaryColors.min}
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  isAnimationActive={false}
                  dataKey="median"
                  name="Median"
                  fill={salaryColors.median}
                  radius={[0, 2, 2, 0]}
                />
                <Bar
                  isAnimationActive={false}
                  dataKey="max"
                  name="Maximum"
                  fill={salaryColors.max}
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="empty-note">No salary ranges are available yet.</p>
        )}
        <details className="data-table-disclosure">
          <summary>View all salary figures and locations</summary>
          <div className="table-scroll">
            <table>
              <caption className="sr-only">
                Annual salary estimates in US dollars
              </caption>
              <thead>
                <tr>
                  <th scope="col">Role</th>
                  <th scope="col">Minimum</th>
                  <th scope="col">Median</th>
                  <th scope="col">Maximum</th>
                  <th scope="col">Location</th>
                </tr>
              </thead>
              <tbody>
                {ranges.map((r, i) => (
                  <tr key={i}>
                    <th scope="row">{r.role}</th>
                    <td>${r.min.toLocaleString("en-US")}</td>
                    <td>${r.median.toLocaleString("en-US")}</td>
                    <td>${r.max.toLocaleString("en-US")}</td>
                    <td>{r.location || "Not specified"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <section className="industry-trends">
        <div className="data-section-heading">
          <div>
            <p className="eyebrow">04 / THE BIGGER PICTURE</p>
            <h2>What’s shaping your industry.</h2>
          </div>
        </div>
        <ol>
          {insights.keyTrends.map((trend, i) => (
            <li key={i}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{trend}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="workspace-next">
        <div>
          <p className="eyebrow">KNOW THE LANDSCAPE. TAKE THE NEXT STEP.</p>
          <h3>Make your experience count.</h3>
        </div>
        <Button asChild variant="outline">
          <Link href="/resume">Build your resume</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/ai-cover-letter">Tailor your introduction</Link>
        </Button>
      </div>
    </div>
  );
};
