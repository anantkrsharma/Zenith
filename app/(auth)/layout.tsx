import React from "react";

function layout({ children }: { children: React.ReactNode }): React.ReactNode {
  return (
    <div className="auth-shell">
      <div className="auth-intro">
        <p className="eyebrow">A NEW CHAPTER, WITH ZENITH</p>
        <h1>
          Your ambition.
          <br />A clearer <span className="text-primary">direction.</span>
        </h1>
        <p>
          Bring your experience. Find your focus. Build the confidence to take
          your next step.
        </p>
        <svg
          className="auth-trajectory"
          viewBox="0 0 420 145"
          aria-hidden="true"
        >
          <path
            d="M10 116 C85 115 100 80 170 83 S300 28 405 22"
            fill="none"
            stroke="#c5e895"
            strokeWidth="2"
          />
          <path
            d="M10 130 H410 M10 95 H410 M10 60 H410"
            stroke="#34402c"
            strokeDasharray="2 6"
          />
          <g fill="#c5e895">
            <circle cx="10" cy="116" r="4" />
            <circle cx="170" cy="83" r="4" />
            <circle cx="405" cy="22" r="5" />
          </g>
        </svg>
      </div>
      <div className="auth-form">{children}</div>
    </div>
  );
}

export default layout;
