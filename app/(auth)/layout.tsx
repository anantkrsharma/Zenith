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
      </div>
      <div className="auth-form">{children}</div>
    </div>
  );
}

export default layout;
