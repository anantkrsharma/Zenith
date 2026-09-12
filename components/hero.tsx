import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CareerAtlas } from "@/components/career-atlas";

export default function HeroSection() {
  return (
    <section className="zen-hero" aria-labelledby="hero-title">
      <div className="zen-hero-grid zen-container">
        <div className="zen-hero-copy">
          <h1 id="hero-title">
            Your personal
            <br />
            <span>AI career coach.</span>
          </h1>
          <p className="zen-hero-description">
            Understand your industry, prepare for interviews, and create resumes
            and cover letters tailored to your experience. Zenith brings your
            next career move into focus, whatever your field.
          </p>
          <div className="zen-hero-actions">
            <Button asChild size="lg" className="zen-button">
              <Link href="/dashboard">
                Get started with Zenith <ArrowUpRight size={18} />
              </Link>
            </Button>
            <Link className="zen-subtle-link" href="#workspace">
              Explore Zenith <ArrowDown size={15} />
            </Link>
          </div>
        </div>
        <CareerAtlas />
      </div>
      <div className="zen-hero-index zen-container">
        <a href="#industry">
          <span>01</span>
          <div>
            Read the landscape<small>Industry insights</small>
          </div>
          <MoveUpRight size={19} />
        </a>
        <a href="#practice">
          <span>02</span>
          <div>
            Build your confidence<small>Interview preparation</small>
          </div>
          <MoveUpRight size={19} />
        </a>
        <a href="#documents">
          <span>03</span>
          <div>
            Make your next move<small>Resume & cover letters</small>
          </div>
          <MoveUpRight size={19} />
        </a>
      </div>
    </section>
  );
}
