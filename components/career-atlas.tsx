"use client";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

const stages = [
  {
    name: "Find your bearings",
    text: "Connect your experience to the skills and signals around you.",
    node: "Your starting point",
    destination: "A clearer perspective",
  },
  {
    name: "Build your momentum",
    text: "Test what you know. Turn feedback into your next step forward.",
    node: "Practice with purpose",
    destination: "Room to grow",
  },
  {
    name: "Make your next move",
    text: "Bring your experience into focus with a resume and a tailored introduction.",
    node: "Your professional story",
    destination: "Your next opportunity",
  },
];
export function CareerAtlas() {
  const [stage, setStage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0),
    pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 80, damping: 25 });
  const rotateX = useSpring(pointerY, { stiffness: 80, damping: 25 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 20]);
  return (
    <div className="atlas" ref={ref}>
      <div className="atlas-coordinate">
        THE CAREER ATLAS <span>YOUR POSSIBILITIES, CONNECTED</span>
      </div>
      <motion.div
        className={`atlas-scene atlas-stage-${stage}`}
        style={reduced ? undefined : { rotateX, rotateY, y }}
        onPointerMove={(event) => {
          if (reduced || event.pointerType !== "mouse") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          pointerX.set(
            ((event.clientX - bounds.left) / bounds.width - 0.5) * 4,
          );
          pointerY.set(
            ((event.clientY - bounds.top) / bounds.height - 0.5) * -3,
          );
        }}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        <div
          className="atlas-mobile-map"
          aria-label="The three stages of your career journey"
        >
          {[
            ["Your starting point", "Experience, skills, and ambition"],
            ["Your next step", "A clearer focus. Room to grow."],
            ["Your next level", "Ready to put yourself forward"],
          ].map(([title, description], index) => (
            <div
              key={title}
              className="mobile-map-level"
              data-active={stage === index}
            >
              <span>0{index + 1}</span>
              <div>
                <strong>{title}</strong>
                <small>{description}</small>
              </div>
            </div>
          ))}
        </div>
        <svg
          className="atlas-drawing"
          viewBox="0 0 700 620"
          role="img"
          aria-label="A career path rises through connected skills, practice, and professional identity toward a new opportunity."
        >
          <g
            className="atlas-grid"
            fill="none"
            stroke="#1d2b30"
            strokeWidth=".7"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <path
                key={i}
                d={`M ${20 + i * 49} ${403 - i * 24} l 230 116 M ${20 + i * 49} ${403 + i * 13} l 490 -245`}
              />
            ))}
          </g>
          <g className="atlas-level atlas-level-back">
            <path
              d="M278 177 L475 78 L653 168 L456 267Z"
              fill="#13242a"
              stroke="#6b838d"
            />
            <path
              d="M278 177 L456 267 L653 168 L653 180 L456 279 L278 189Z"
              fill="#131e22"
              stroke="#35474f"
            />
            <path d="M456 267 L653 168" stroke="#3f6f79" strokeWidth="2" />
            <path
              d="M316 178 L475 99 L614 169 L456 248Z"
              fill="none"
              stroke="#6b838d"
              strokeDasharray="3 6"
            />
          </g>
          <g className="atlas-level atlas-level-middle">
            <path
              d="M127 306 L345 196 L552 299 L333 410Z"
              fill="#13242a"
              stroke="#35474f"
            />
            <path
              d="M127 306 L333 410 L552 299 L552 311 L333 422 L127 318Z"
              fill="#131e22"
              stroke="#35474f"
            />
            <path
              d="M127 306 L333 410 L552 299"
              fill="none"
              stroke="#3f6f79"
              strokeWidth="2"
            />
            <g fill="none" stroke="#6b838d">
              <path d="M212 306 L305 259 L410 309 L333 355Z M212 306 L333 355 M305 259 L333 355 M305 259 L410 309" />
            </g>
            {[
              [212, 306],
              [305, 259],
              [410, 309],
              [333, 355],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i === stage ? 5 : 3}
                fill={i === stage ? "#b4c2c8" : "#91a5ad"}
              />
            ))}
          </g>
          <g className="atlas-level atlas-level-front">
            <path
              d="M37 450 L221 357 L414 453 L229 547Z"
              fill="#13242a"
              stroke="#35474f"
            />
            <path
              d="M37 450 L229 547 L414 453 L414 466 L229 560 L37 463Z"
              fill="#131e22"
              stroke="#35474f"
            />
            <path
              d="M37 450 L229 547 L414 453"
              fill="none"
              stroke="#3f6f79"
              strokeWidth="2"
            />
            <path
              d="M104 451 L200 403 L325 465 M200 403 L222 493 M104 451 L222 493 L325 465"
              fill="none"
              stroke="#6b838d"
            />
            {[
              [104, 451],
              [200, 403],
              [222, 493],
              [325, 465],
            ].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="4" fill="#b4c2c8" />
            ))}
          </g>
          <path
            className="atlas-route"
            d="M140 463 C224 474 263 461 272 391 C279 329 356 360 385 287 S459 260 479 196 C488 164 510 150 549 139"
            fill="none"
            stroke="#70b7c2"
            strokeWidth="3"
            pathLength="1"
          />
          <g fill="#b4c2c8" stroke="#131e22" strokeWidth="5">
            <circle cx="140" cy="463" r="9" />
            <circle cx="335" cy="340" r="9" />
            <circle cx="549" cy="139" r="10" />
          </g>
          <g stroke="#6b838d" strokeDasharray="3 5" fill="none">
            <path d="M549 139 V65 H570 M140 463 V523 H83" />
          </g>
          <g fontSize="12" fill="#91a5ad" letterSpacing="2">
            <text x="577" y="68">
              NEXT
            </text>
            <text x="40" y="535">
              NOW
            </text>
          </g>
        </svg>
        <div className="atlas-label atlas-label-top">
          <span>{stages[stage].destination}</span>
        </div>
        <div className="atlas-label atlas-label-middle">
          <div>
            <small>
              {
                ["SKILL CONNECTION", "YOUR NEXT STEP", "APPLICATION TOOLS"][
                  stage
                ]
              }
            </small>
            <strong>
              {
                [
                  "Experience meets possibility",
                  "Feedback becomes progress",
                  "Experience becomes a story",
                ][stage]
              }
            </strong>
          </div>
        </div>
        <div className="atlas-label atlas-label-bottom">
          <div>
            <small>BUILT AROUND YOU</small>
            <strong>{stages[stage].node}</strong>
          </div>
        </div>
      </motion.div>
      <div
        className="atlas-controls"
        role="group"
        aria-label="Explore career stages"
      >
        {stages.map((item, index) => (
          <button
            type="button"
            key={item.name}
            aria-pressed={index === stage}
            aria-label={item.name}
            onClick={() => setStage(index)}
          >
            <span>0{index + 1}</span>
            {["Understand", "Develop", "Become"][index]}
          </button>
        ))}
      </div>
      <p className="atlas-stage-description" aria-live="polite">
        {stages[stage].text}
      </p>
      <p className="illustration-caption">
        A conceptual career journey. Your workspace uses your own data.
      </p>
    </div>
  );
}
