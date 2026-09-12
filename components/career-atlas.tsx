"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useAmbientPlayback } from "@/components/use-ambient-playback";

// Traced in the source artwork's 1536 × 1024 coordinates. The moving light,
// its trail, and the image share one coordinate system without rasterizing
// the image and labels into a transformed 3D layer.
const pathway =
  "M240 730 C256 715 325 707 386 690 C450 673 478 635 518 606 C551 581 593 577 631 552 C662 532 677 510 693 481 C718 444 757 421 795 421 C844 406 882 423 941 424 C999 427 1047 410 1067 391 C1087 370 1061 355 1054 342 C1043 319 1080 313 1114 303 C1153 291 1194 277 1208 256 C1223 235 1186 225 1194 205 C1198 188 1226 176 1235 161 C1246 145 1227 133 1236 121";
const ascentDuration = 18000;
const cycleDuration = 22000;

const stages = [
  {
    name: "Understand",
    title: "Understand your industry.",
    text: "Explore market trends, salary ranges, and skills relevant to your field.",
    location: "Your starting point",
    x: 240,
    y: 702,
    lightX: 300,
    lightY: 700,
  },
  {
    name: "Develop",
    title: "Prepare with purpose.",
    text: "Practice interview questions and turn feedback into stronger answers.",
    location: "Your next step",
    x: 795,
    y: 398,
    lightX: 795,
    lightY: 440,
  },
  {
    name: "Become",
    title: "Put your experience forward.",
    text: "Build your resume and tailor a cover letter to your next opportunity.",
    location: "Your next level",
    x: 1238,
    y: 94,
    lightX: 1230,
    lightY: 210,
  },
];

export function CareerAtlas() {
  const { ref, canPlay, reducedMotion } = useAmbientPlayback();
  const [paused, setPaused] = useState(false);
  const [stage, setStage] = useState(0);
  const currentStage = useRef(0);
  const elapsed = useRef(0);
  const pathRef = useRef<SVGPathElement>(null);
  const pathLength = useRef(0);
  const lightX = useMotionValue(240);
  const lightY = useMotionValue(730);
  const trailOffset = useMotionValue(0.055);
  const lightOpacity = useMotionValue(0);

  useAnimationFrame((_, delta) => {
    if (!canPlay || paused || !pathRef.current) return;
    elapsed.current = (elapsed.current + Math.min(delta, 100)) % cycleDuration;
    const time = elapsed.current;
    // A short introduction, an 18-second ascent, and a summit dwell.
    // Reset only after the travelling light has faded out.
    const progress = Math.min(1, Math.max(0, (time - 700) / ascentDuration));
    pathLength.current ||= pathRef.current.getTotalLength();
    const point = pathRef.current.getPointAtLength(
      progress * pathLength.current,
    );
    lightX.set(point.x);
    lightY.set(point.y);
    trailOffset.set(0.055 - progress);
    lightOpacity.set(Math.min(1, time / 500, (cycleDuration - time) / 1200));
    // The middle beacon sits 48.8% along this traced path's arc length.
    const nextStage = progress < 0.48813 ? 0 : progress < 1 ? 1 : 2;
    if (nextStage !== currentStage.current) {
      currentStage.current = nextStage;
      setStage(nextStage);
    }
  });

  return (
    <div
      className="zen-atlas"
      ref={ref}
      data-stage={stage}
      data-static={reducedMotion}
    >
      <div className="zen-terrain">
        <Image
          src="/art/career-landscape.png"
          width={1536}
          height={1024}
          sizes="(max-width: 560px) calc(118vw - 47.2px), (max-width: 850px) min(651px, calc(105vw - 67.2px)), (max-width: 1100px) calc(62.5vw - 40px), min(836px, calc(68.46vw - 65.72px))"
          quality={100}
          preload
          alt="A luminous career path climbs a teal landscape from understanding your industry, through interview preparation, to your next opportunity."
          className="zen-terrain-image"
        />
        <svg
          className="zen-terrain-path"
          viewBox="0 0 1536 1024"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="zen-milestone-light">
              <stop stopColor="#a9eaf1" stopOpacity=".22" />
              <stop offset=".5" stopColor="#70b7c2" stopOpacity=".07" />
              <stop offset="1" stopColor="#70b7c2" stopOpacity="0" />
            </radialGradient>
            <filter
              id="zen-path-bloom"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
            >
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter
              id="zen-light-bloom"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          {stages.map((item, index) => (
            <ellipse
              key={item.name}
              cx={item.lightX}
              cy={item.lightY}
              rx="300"
              ry="230"
              fill="url(#zen-milestone-light)"
              className="zen-milestone-light"
              data-active={reducedMotion || stage === index}
            />
          ))}
          <path ref={pathRef} d={pathway} fill="none" stroke="none" />
          <motion.g style={{ opacity: reducedMotion ? 0 : lightOpacity }}>
            <motion.path
              d={pathway}
              pathLength="1"
              fill="none"
              stroke="#a1e4ed"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="0.055 1"
              style={{ strokeDashoffset: trailOffset }}
              filter="url(#zen-path-bloom)"
            />
            <motion.path
              d={pathway}
              pathLength="1"
              fill="none"
              stroke="#e0fcff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="0.055 1"
              style={{ strokeDashoffset: trailOffset }}
            />
            <motion.circle
              cx={lightX}
              cy={lightY}
              r="15"
              fill="#aceef7"
              filter="url(#zen-light-bloom)"
            />
            <motion.circle cx={lightX} cy={lightY} r="4" fill="#f0feff" />
          </motion.g>
        </svg>
        {stages.map((item, index) => (
          <div
            key={item.name}
            className="zen-terrain-beacon"
            data-active={reducedMotion || stage === index}
            data-milestone={index}
            style={{
              left: (item.x / 1536) * 100 + "%",
              top: (item.y / 1024) * 100 + "%",
            }}
          >
            <span className="zen-beacon-ring" />
            <span className="zen-beacon-label">
              <small>0{index + 1}</small>
              {item.location}
            </span>
          </div>
        ))}
      </div>
      <div className="zen-atlas-console">
        <div className="zen-atlas-stage-row">
          <div className="zen-atlas-stages" aria-label="Your career journey">
            {stages.map((item, index) => (
              <span
                key={item.name}
                className="zen-atlas-stage"
                data-active={reducedMotion || stage === index}
              >
                <span>0{index + 1}</span>
                {item.name}
                <span className="zen-stage-indicator" />
              </span>
            ))}
          </div>
          {!reducedMotion && (
            <button
              type="button"
              className="zen-motion-control"
              onClick={() => setPaused(!paused)}
              aria-label={
                paused
                  ? "Play career path animation"
                  : "Pause career path animation"
              }
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          )}
        </div>
        <div className="zen-atlas-description">
          {stages.map((item, index) => (
            <div
              key={item.name}
              className="zen-atlas-caption"
              data-active={stage === index}
              aria-hidden={stage !== index}
            >
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
