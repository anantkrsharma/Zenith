import React from "react";
import Image from "next/image";

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
        <div className="zen-auth-landscape">
          <Image
            src="/art/career-landscape.png"
            width={1536}
            height={1024}
            sizes="(max-width: 850px) 100vw, 45vw"
            alt="A luminous path rises through a teal landscape toward a summit."
          />
          <span>YOUR STARTING POINT. YOUR POSSIBILITIES.</span>
        </div>
      </div>
      <div className="auth-form">{children}</div>
    </div>
  );
}

export default layout;
