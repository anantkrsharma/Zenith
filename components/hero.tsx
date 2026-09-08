"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CareerAtlas } from "@/components/career-atlas";
export default function HeroSection() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="site-container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h1 id="hero-title">
            You have <br />
            potential.
            <br />
            <span>Give it direction.</span>
          </h1>
          <p className="hero-description">
            A clearer view of where you stand. The tools to move you forward.
            Your career, with Zenith.
          </p>
          <div className="hero-actions">
            <Button asChild size="lg">
              <Link href="/dashboard">Find your next level</Link>
            </Button>
            <Link className="text-link" href="#workspace">
              Explore the journey
            </Link>
          </div>
          <p className="hero-footnote">AI career guidance. Built around you.</p>
        </div>
        <CareerAtlas />
      </div>
      <div className="site-container hero-bottom">
        <span>AMBITION, MEET DIRECTION.</span>
        <div>
          <span>Understand</span>
          <span>Develop</span>
          <span>Become</span>
        </div>
        <a href="#workspace" aria-label="Discover the Zenith workspace">
          Explore Zenith
        </a>
      </div>
    </section>
  );
}
