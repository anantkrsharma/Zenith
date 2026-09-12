"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FlowLines() {
  return (
    <div className="zen-flow" aria-hidden="true">
      <svg viewBox="0 0 1600 700" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="zen-flow-ink">
            <stop stopColor="#70b7c2" stopOpacity=".24" />
            <stop offset=".35" stopColor="#70b7c2" stopOpacity=".08" />
            <stop offset=".75" stopColor="#70b7c2" stopOpacity=".35" />
            <stop offset="1" stopColor="#70b7c2" stopOpacity=".18" />
          </linearGradient>
        </defs>
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d={
              "M-40 " +
              (440 + i * 13) +
              " C400 " +
              (650 + i * 4) +
              " 640 " +
              (575 + i * 3) +
              " 920 " +
              (395 + i * 8) +
              " S1360 " +
              (215 + i * 16) +
              " 1640 " +
              (255 + i * 17)
            }
            fill="none"
            stroke="url(#zen-flow-ink)"
            strokeWidth={i === 5 ? 1.5 : 0.6}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}

const practiceQuestions = [
  {
    question: "What makes a project example stand out in an interview?",
    answers: [
      "Listing every tool you used.",
      "Connecting a problem, your action, and a result.",
      "Describing your team’s responsibilities.",
    ],
    correct: 1,
    explanation:
      "A specific problem, your contribution, and a concrete result help an interviewer understand how you think and the difference you made.",
  },
  {
    question: "How should you describe a disagreement with a teammate?",
    answers: [
      "Explain how you listened and reached a decision.",
      "Focus on why your approach was better.",
      "Avoid mentioning that disagreements happen.",
    ],
    correct: 0,
    explanation:
      "Explain the different perspectives, how you listened, and how you reached a decision. Show collaboration without assigning blame.",
  },
  {
    question: "What’s a useful first step when a question is unfamiliar?",
    answers: [
      "Give an answer immediately.",
      "Change the subject to a familiar project.",
      "Clarify the problem and explain your reasoning.",
    ],
    correct: 2,
    explanation:
      "Clarify what’s being asked, state your assumptions, and walk through your reasoning. It’s okay to acknowledge what you don’t yet know.",
  },
];

export function PracticeLab() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const question = practiceQuestions[questionIndex];
  return (
    <div className="zen-practice-scene">
      <div className="zen-practice-orbit" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} style={{ inset: i * 19 + "px" }} />
        ))}
      </div>
      <div className="zen-lab">
        <div className="zen-lab-progress">
          <span>0{questionIndex + 1} / 03</span>
          <div>
            {practiceQuestions.map((_, i) => (
              <i key={i} data-active={i <= questionIndex} />
            ))}
          </div>
        </div>
        <h3>{question.question}</h3>
        <div
          className="zen-demo-answers"
          role="group"
          aria-label="Choose an interview answer"
        >
          {question.answers.map((item, i) => (
            <button
              key={item}
              type="button"
              aria-pressed={answer === i}
              disabled={answer !== null}
              data-correct={answer !== null && i === question.correct}
              data-incorrect={answer === i && i !== question.correct}
              onClick={() => setAnswer(i)}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {item}
              {answer !== null && i === question.correct ? (
                <Check size={16} />
              ) : (
                <span className="zen-answer-circle" />
              )}
            </button>
          ))}
        </div>
        <div className="zen-lab-feedback" aria-live="polite">
          {answer === null ? (
            <p>
              A little practice changes how you show up.
            </p>
          ) : (
            <>
              <strong>
                {answer === question.correct
                  ? "That’s a strong approach."
                  : "Here’s a more useful approach."}
              </strong>
              <p>{question.explanation}</p>
              <button
                type="button"
                onClick={() => {
                  setQuestionIndex(
                    (questionIndex + 1) % practiceQuestions.length,
                  );
                  setAnswer(null);
                }}
              >
                {questionIndex === 2 ? "Start again" : "Try another question"}{" "}
                {questionIndex === 2 ? (
                  <RotateCcw size={14} />
                ) : (
                  <ArrowRight size={14} />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function DocumentStudio() {
  const [document, setDocument] = useState("resume");
  return (
    <div className="zen-document-scene">
      <div className="zen-document-source">
        <p>
          “I helped make onboarding
          <br />
          easier for new users.”
        </p>
        <div>
          <span>Clarity</span>
          <span>Impact</span>
          <span>Your voice</span>
        </div>
      </div>
      <div className="zen-document-connector" aria-hidden="true">
        <svg viewBox="0 0 220 95">
          <path
            d="M0 2 H70 Q85 2 85 18 V70 Q85 85 100 85 H210"
            fill="none"
            stroke="#6a9da8"
            strokeDasharray="3 5"
          />
          <circle cx="210" cy="85" r="3" fill="#a3d0d8" />
        </svg>
      </div>
      <Tabs
        value={document}
        onValueChange={setDocument}
        className="zen-document-view"
      >
        <TabsList
          className="zen-tabs zen-document-tabs"
          aria-label="Preview application documents"
        >
          <TabsTrigger value="resume">
            <FileText size={13} /> Resume
          </TabsTrigger>
          <TabsTrigger value="letter">
            Cover letter <ArrowUpRight size={13} />
          </TabsTrigger>
        </TabsList>
        <div className="zen-paper-stack">
          <div className="zen-paper-back" aria-hidden="true" />
          <TabsContent value="resume" className="zen-paper">
            <div className="zen-paper-meta">
              <span>PROFESSIONAL PROFILE</span>
              <span>01 / 01</span>
            </div>
            <h3>
              Maya Chen<span>Product Designer</span>
            </h3>
            <p className="zen-paper-contact">
              maya.chen@example.com · San Francisco, CA
            </p>
            <div className="zen-paper-rule" />
            <small>PROFILE</small>
            <p>
              Thoughtful product design. Clearer experiences.
              <br />A focus on the moments that matter.
            </p>
            <small>SELECTED EXPERIENCE</small>
            <div className="zen-paper-role">
              <strong>Product Designer</strong>
              <span>2023 — PRESENT</span>
            </div>
            <p className="zen-paper-highlight">
              Redesigned the onboarding experience, reducing first-run drop-off
              by 24% through user research and iterative testing.
            </p>
            <p>
              Partnered with engineering to turn complex workflows into simple,
              accessible interactions.
            </p>
            <small>CORE SKILLS</small>
            <div className="zen-paper-skills">
              <span>Product strategy</span>
              <span>Interaction design</span>
              <span>User research</span>
            </div>
            <div className="zen-paper-bottom">
              <span>YOUR EXPERIENCE, WITH INTENTION.</span>
              <span>↗</span>
            </div>
          </TabsContent>
          <TabsContent value="letter" className="zen-paper zen-letter-paper">
            <div className="zen-paper-meta">
              <span>A CONSIDERED INTRODUCTION</span>
              <span>01 / 01</span>
            </div>
            <h3>
              Maya Chen<span>Product Designer</span>
            </h3>
            <p className="zen-paper-contact">
              maya.chen@example.com · San Francisco, CA
            </p>
            <div className="zen-paper-rule" />
            <small>RE: PRODUCT DESIGNER</small>
            <p>Dear hiring team,</p>
            <p>
              I’m drawn to products that make complex work feel simple. Your
              focus on thoughtful, accessible experiences is the kind of
              challenge I want to help solve.
            </p>
            <p className="zen-paper-highlight">
              In my current role, I redesigned onboarding to reduce first-run
              drop-off by 24%, combining user research with close engineering
              collaboration.
            </p>
            <p>
              I’d welcome the opportunity to bring that same care to your team.
            </p>
            <p className="zen-paper-signature">Maya Chen</p>
            <div className="zen-paper-bottom">
              <span>YOUR STORY. THEIR OPPORTUNITY.</span>
              <span>↗</span>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      <div className="zen-document-caption">
        <Check size={13} /> A clearer story. Still yours.
        <span>ILLUSTRATIVE PROFILE</span>
      </div>
    </div>
  );
}

export function JourneyLine() {
  return (
    <svg
      className="zen-journey-line"
      viewBox="0 0 1200 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="zen-journey-gradient">
          <stop stopColor="#70b7c2" stopOpacity=".15" />
          <stop offset=".5" stopColor="#a6dbe3" />
          <stop offset="1" stopColor="#70b7c2" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <path
        d="M0 75 C200 75 220 35 400 35 S700 65 820 28 S1080 18 1200 10"
        stroke="url(#zen-journey-gradient)"
        fill="none"
      />
      <path
        d="M0 85 C200 85 220 45 400 45 S700 75 820 38 S1080 28 1200 20"
        stroke="#70b7c2"
        strokeOpacity=".13"
        fill="none"
      />
    </svg>
  );
}
