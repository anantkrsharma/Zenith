"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Plus,
  MoveUpRight,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/faqs";

const sampleSkills = [
  { name: "React", score: 85, prior: 60 },
  { name: "JavaScript", score: 75, prior: 50 },
  { name: "System design", score: 45, prior: 30 },
  { name: "Communication", score: 70, prior: 65 },
];

export default function Landing() {
  const [latest, setLatest] = useState(true);
  return (
    <div className="landing-stories">
      <section
        id="workspace"
        className="site-container narrative-intro section-space"
      >
        <Reveal>
          <p className="eyebrow">A LITTLE CLARITY CHANGES EVERYTHING</p>
          <h2>
            Your career is more
            <br />
            than a <span className="muted-word">resume.</span>
          </h2>
        </Reveal>
        <Reveal className="intro-aside">
          <p>
            It’s what you know. What you’ve done.
            <br />
            And everything you haven’t become yet.
          </p>
          <p>
            Zenith connects the pieces, so your next step feels a little less
            like a leap.
          </p>
          <a href="#industry" className="text-link">
            See the bigger picture <ArrowRight size={16} />
          </a>
        </Reveal>
      </section>
      <section id="industry" className="story-section story-market">
        <div className="site-container story-grid">
          <Reveal className="story-copy">
            <p className="eyebrow">
              <span className="chapter-number">01</span> READ THE LANDSCAPE
            </p>
            <h2>
              The world moves.
              <br />
              <span className="muted-word">Find your direction.</span>
            </h2>
            <p>
              Make sense of your industry’s momentum. Discover in-demand skills,
              explore salary ranges, and see where your experience could take
              you.
            </p>
            <Link href="/dashboard" className="text-link">
              Explore industry insights <ArrowUpRight size={17} />
            </Link>
            <div className="story-detail">
              <span className="status-dot" /> Industry outlook · Salary
              benchmarks · Skills to develop
            </div>
          </Reveal>
          <Reveal className="signal-field">
            <div className="visual-heading">
              <span>
                <ScanLine size={15} /> INDUSTRY SIGNALS
              </span>
              <span>01 — 03</span>
            </div>
            <div className="signal-lines" aria-hidden="true">
              <svg viewBox="0 0 560 320">
                <defs>
                  <linearGradient id="signal-fade">
                    <stop stopColor="#c5e895" stopOpacity="0" />
                    <stop offset=".5" stopColor="#c5e895" />
                    <stop offset="1" stopColor="#c5e895" stopOpacity=".2" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <path
                    key={i}
                    d={
                      "M0 " +
                      (225 + i * 12) +
                      " C180 " +
                      (290 - i * 8) +
                      " 270 " +
                      (35 + i * 20) +
                      " 560 " +
                      (45 + i * 23)
                    }
                    stroke="url(#signal-fade)"
                    fill="none"
                    strokeWidth={i === 3 ? 2 : 0.7}
                  />
                ))}
              </svg>
            </div>
            <div className="signal-item signal-first">
              <span className="signal-index">01</span>
              <div>
                <small>UNDERSTAND THE MOMENTUM</small>
                <strong>Industry outlook</strong>
              </div>
              <MoveUpRight size={23} />
            </div>
            <div className="signal-item signal-second">
              <span className="signal-index">02</span>
              <div>
                <small>KNOW YOUR LANDSCAPE</small>
                <strong>Salary benchmarks</strong>
              </div>
              <span className="signal-mini-bars" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="signal-item signal-third">
              <span className="signal-index">03</span>
              <div>
                <small>LOOK A LITTLE FURTHER</small>
                <strong>Recommended skills</strong>
              </div>
              <Plus size={23} />
            </div>
            <p className="illustration-caption">
              AI-generated market estimates, refreshed weekly.
            </p>
          </Reveal>
        </div>
      </section>
      <section className="story-section site-container story-grid story-practice">
        <Reveal className="practice-visual">
          <div className="visual-heading">
            <span>SMALL STEPS. VISIBLE PROGRESS.</span>
            <span>↗</span>
          </div>
          <div className="practice-top">
            <div>
              <small>YOUR NEXT LEVEL</small>
              <h3>
                Built, answer
                <br />
                by answer.
              </h3>
            </div>
            <span className="practice-glyph" aria-hidden="true">
              ↗
            </span>
          </div>
          <div
            className="skill-comparison"
            aria-label="Illustrative skill development"
          >
            {sampleSkills.map((skill) => (
              <div className="skill-comparison-row" key={skill.name}>
                <span>{skill.name}</span>
                <div>
                  <i
                    style={{
                      width: (latest ? skill.score : skill.prior) + "%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            className="comparison-controls"
            role="group"
            aria-label="Compare illustrative progress"
          >
            <button
              type="button"
              aria-pressed={!latest}
              onClick={() => setLatest(false)}
            >
              Earlier
            </button>
            <ArrowRight size={14} />
            <button
              type="button"
              aria-pressed={latest}
              onClick={() => setLatest(true)}
            >
              With practice
            </button>
          </div>
          <p className="illustration-caption">
            Illustration of skill development. Assessments track overall scores
            and answer feedback.
          </p>
        </Reveal>
        <Reveal className="story-copy">
          <p className="eyebrow">
            <span className="chapter-number">02</span> TURN KNOWLEDGE INTO
            CONFIDENCE
          </p>
          <h2>
            Don’t just wonder
            <br />
            if you’re <span className="muted-word">ready.</span>
          </h2>
          <p>
            Find out. Practice with questions shaped around your industry and
            skills. Learn the reasoning behind each answer, then watch your
            performance evolve.
          </p>
          <Link href="/interview" className="text-link">
            Find your strengths <ArrowUpRight size={17} />
          </Link>
          <div className="story-detail">
            Personalized questions. Useful feedback. Every attempt saved.
          </div>
        </Reveal>
      </section>
      <section className="story-documents">
        <div className="site-container story-grid">
          <Reveal className="story-copy">
            <p className="eyebrow">
              <span className="chapter-number">03</span> MAKE YOUR EXPERIENCE
              COUNT
            </p>
            <h2>
              You’ve done the work.
              <br />
              <span>Let it speak.</span>
            </h2>
            <p>
              Turn your experience into a clear, considered resume. Then connect
              your story to the role you want with a tailored cover letter.
            </p>
            <div className="document-tool-link">
              <div>
                <small>YOUR PROFESSIONAL STORY</small>
                <Link href="/resume">
                  The resume studio <ArrowUpRight />
                </Link>
              </div>
              <span>01</span>
            </div>
            <div className="document-tool-link">
              <div>
                <small>YOUR NEXT INTRODUCTION</small>
                <Link href="/ai-cover-letter">
                  The cover letter studio <ArrowUpRight />
                </Link>
              </div>
              <span>02</span>
            </div>
          </Reveal>
          <Reveal className="document-composition">
            <div className="document-context">
              <span>YOUR EXPERIENCE</span>
              <Plus size={13} />
              <span>YOUR AMBITION</span>
              <ArrowRight size={16} />
            </div>
            <div className="story-letter">
              <small>A CONSIDERED INTRODUCTION</small>
              <p>Dear future team,</p>
              <div className="paper-lines">
                <i />
                <i />
                <i />
                <i />
              </div>
              <p>Let’s build what’s next.</p>
              <span>Your name</span>
            </div>
            <div className="story-resume">
              <div className="paper-topline">
                <span>YOUR NEXT CHAPTER</span>
                <span>↗</span>
              </div>
              <h3>
                Your name.
                <br />
                Your experience.
              </h3>
              <div className="paper-rule" />
              <small>THE WORK THAT DEFINES YOU</small>
              <p>
                Ideas brought to life.
                <br />
                Problems made simpler.
                <br />A difference you can point to.
              </p>
              <div className="paper-rule" />
              <div className="paper-lines">
                <i />
                <i />
                <i />
              </div>
              <div className="paper-bottom">
                <Check size={14} /> Ready to make an impression.
              </div>
            </div>
            <p className="illustration-caption">
              Your story, thoughtfully presented. Illustrative documents.
            </p>
          </Reveal>
        </div>
      </section>
      <section
        id="how-it-works"
        className="site-container section-space journey-section"
      >
        <Reveal className="journey-heading">
          <p className="eyebrow">PROGRESS IS A PRACTICE</p>
          <h2>
            A direction.
            <br />
            Then a <span className="muted-word">next step.</span>
          </h2>
          <p>
            You don’t need to have it all figured out.
            <br />
            Start with what you know about yourself.
          </p>
        </Reveal>
        <div className="journey-steps">
          {[
            [
              "01",
              "Bring your starting point.",
              "Your industry, experience, and skills. A few details help Zenith understand your professional world.",
            ],
            [
              "02",
              "Find your focus.",
              "Explore the market. Test your knowledge. See what deserves your attention next.",
            ],
            [
              "03",
              "Put yourself forward.",
              "Refine your resume, tailor your introduction, and take the next step with more confidence.",
            ],
          ].map(([n, title, text]) => (
            <Reveal className="journey-step" key={n}>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <ArrowUpRight size={20} />
            </Reveal>
          ))}
        </div>
      </section>
      <section id="faq" className="site-container section-space faq-grid">
        <Reveal>
          <p className="eyebrow">A FEW THINGS, MADE CLEAR</p>
          <h2>
            Good questions.
            <br />
            <span className="muted-word">Straight answers.</span>
          </h2>
        </Reveal>
        <Reveal>
          <Accordion type="single" collapsible className="faq-list">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={"faq-" + index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
      <section className="closing-cta">
        <div className="site-container">
          <p className="eyebrow">THERE’S MORE AHEAD OF YOU.</p>
          <h2>
            Your next level
            <br />
            is <span>within reach.</span>
          </h2>
          <Button asChild size="lg">
            <Link href="/dashboard">
              Let’s find your direction <ArrowUpRight />
            </Link>
          </Button>
          <div className="closing-path" aria-hidden="true">
            <span />
            <span />
            <span />
            <ArrowUpRight />
          </div>
        </div>
      </section>
    </div>
  );
}
