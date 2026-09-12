import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Compass,
  Fingerprint,
  ScanLine,
  MessageSquare,
  FileText,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FlowLines,
  PracticeLab,
  DocumentStudio,
  JourneyLine,
} from "@/components/landing-visuals";
import { IndustryLens } from "@/components/industry-lens";
import { faqs } from "@/data/faqs";

export default function Landing() {
  return (
    <div className="zen-landing">
      <section id="workspace" className="zen-intro zen-container">
        <Reveal>
          <h2>
            Your career isn’t
            <br />a straight line.
            <br />
            <span>Connect the pieces.</span>
          </h2>
        </Reveal>
        <Reveal className="zen-intro-aside">
          <p>
            What you know. What you’ve done. Where you want to go. Zenith brings
            it together, so your next step feels a little less like a leap.
          </p>
          <div className="zen-tool-list">
            <Link href="/dashboard">
              <ScanLine size={18} strokeWidth={1.4} />
              <span>Understand your industry</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/interview">
              <MessageSquare size={18} strokeWidth={1.4} />
              <span>Practice with purpose</span>
              <ArrowUpRight size={15} />
            </Link>
            <Link href="/resume">
              <FileText size={18} strokeWidth={1.4} />
              <span>Put your experience into words</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
      <section id="industry" className="zen-story zen-market">
        <div className="zen-container zen-story-grid">
          <div className="zen-market-copy">
            <FlowLines />
            <Reveal className="zen-story-copy">
              <h2>
                The world moves.
                <br />
                <span>Find your direction.</span>
              </h2>
              <p>
                See where your industry is heading, which skills matter, and how
                roles compare. A wider perspective for your next decision.
              </p>
              <Link href="/dashboard" className="zen-feature-link">
                Explore industry insights <ArrowUpRight size={18} />
              </Link>
              <div className="zen-feature-notes">
                <span>Industry outlook</span>
                <span>Salary benchmarks</span>
                <span>Skills to develop</span>
              </div>
            </Reveal>
          </div>
          <Reveal>
            <IndustryLens />
          </Reveal>
        </div>
      </section>
      <section id="practice" className="zen-story zen-practice">
        <div className="zen-container zen-story-grid">
          <Reveal className="zen-practice-art">
            <PracticeLab />
          </Reveal>
          <Reveal className="zen-story-copy">
            <h2>
              Don’t just hope
              <br />
              you’re ready.
              <br />
              <span>Know you are.</span>
            </h2>
            <p>
              Practice with questions shaped around your industry and skills.
              Understand the reasoning, learn from each attempt, and walk in
              with something better than a script.
            </p>
            <Link href="/interview" className="zen-feature-link">
              Find your strengths <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
      <section id="documents" className="zen-story zen-documents">
        <div className="zen-container zen-story-grid">
          <Reveal className="zen-story-copy">
            <h2>
              You’ve done
              <br />
              the work.
              <br />
              <span>Let it speak.</span>
            </h2>
            <p>
              Good experience deserves a clear story. Build a considered resume,
              then connect your strengths to the opportunity with a tailored
              cover letter.
            </p>
            <div className="zen-document-links">
              <Link href="/resume">
                <span>
                  <small>YOUR PROFESSIONAL STORY</small>The resume studio
                </span>
                <ArrowUpRight size={22} />
              </Link>
              <Link href="/ai-cover-letter">
                <span>
                  <small>YOUR NEXT INTRODUCTION</small>The cover letter studio
                </span>
                <ArrowUpRight size={22} />
              </Link>
            </div>
          </Reveal>
          <Reveal>
            <DocumentStudio />
          </Reveal>
        </div>
      </section>
      <section id="how-it-works" className="zen-journey zen-container">
        <Reveal className="zen-journey-heading">
          <h2>
            A little perspective.
            <br />
            <span>A way forward.</span>
          </h2>
        </Reveal>
        <div className="zen-journey-steps">
          <JourneyLine />
          {[
            {
              n: "01",
              Icon: Fingerprint,
              title: "Bring your starting point.",
              text: "Your industry, experience, and skills. A few details help Zenith understand your professional world.",
              detail: "YOUR EXPERIENCE",
            },
            {
              n: "02",
              Icon: Compass,
              title: "Find your focus.",
              text: "Read the market. Test your knowledge. See what deserves your attention next.",
              detail: "YOUR DIRECTION",
            },
            {
              n: "03",
              Icon: Route,
              title: "Take your next step.",
              text: "Refine your resume, shape your introduction, and put yourself forward with more confidence.",
              detail: "YOUR NEXT CHAPTER",
            },
          ].map(({ n, Icon, title, text, detail }) => (
            <Reveal key={n} className="zen-journey-step">
              <div className="zen-journey-icon">
                <Icon size={26} strokeWidth={1.15} />
                <span>{n}</span>
              </div>
              <small>{detail}</small>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section id="faq" className="zen-faq zen-container">
        <Reveal>
          <h2>
            Good questions.
            <br />
            <span>Straight answers.</span>
          </h2>
          <p>A little clarity before you begin.</p>
          <Link href="/dashboard" className="zen-subtle-link">
            Explore your workspace <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Reveal>
          <Accordion type="single" collapsible className="zen-faq-list">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={"faq-" + index}>
                <AccordionTrigger>
                  <span className="zen-faq-number">0{index + 1}</span>
                  <span>{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>
      <section className="zen-closing">
        <div className="zen-closing-contours" aria-hidden="true">
          <svg viewBox="0 0 1440 600" preserveAspectRatio="none">
            {Array.from({ length: 24 }, (_, i) => (
              <path
                key={i}
                d={
                  "M-100 " +
                  (470 + i * 12) +
                  " C300 " +
                  (490 - i * 9) +
                  " 430 " +
                  (160 - i * 3) +
                  " 760 " +
                  (280 - i * 5) +
                  " S1150 " +
                  (620 - i * 14) +
                  " 1550 " +
                  (170 + i * 5)
                }
                fill="none"
                stroke="#70b7c2"
                strokeOpacity={0.07 + i * 0.007}
                strokeWidth=".7"
              />
            ))}
          </svg>
        </div>
        <Reveal className="zen-closing-content">
          <h2>
            Your next chapter.
            <br />
            <span>Make it yours.</span>
          </h2>
          <p>A clearer perspective. A more confident next step.</p>
          <Button asChild size="lg" className="zen-button">
            <Link href="/dashboard">
              Let’s find your direction <ArrowUpRight size={18} />
            </Link>
          </Button>
        </Reveal>
      </section>
    </div>
  );
}
