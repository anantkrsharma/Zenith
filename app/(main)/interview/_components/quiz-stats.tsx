import { Assessment } from "@prisma/client";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
export default function QuizStats({
  assessments,
}: {
  assessments: Assessment[];
}) {
  const latest = assessments.at(-1);
  const previous = assessments.at(-2);
  const average = assessments.length
    ? assessments.reduce((sum, a) => sum + a.quizScore, 0) / assessments.length
    : null;
  const questions = assessments.reduce((sum, a) => sum + a.questions.length, 0);
  const difference =
    latest && previous ? latest.quizScore - previous.quizScore : null;
  const Direction =
    difference === null || difference === 0
      ? Minus
      : difference > 0
        ? ArrowUpRight
        : ArrowDownRight;
  return (
    <div className="assessment-stats">
      <div className="latest-assessment-stat">
        <p className="eyebrow">YOUR LATEST CHECKPOINT</p>
        <strong>
          {latest ? latest.quizScore.toFixed(1) : "—"}
          {latest && <span>%</span>}
        </strong>
        <p>
          {latest
            ? "Most recent assessment"
            : "Your first assessment sets your starting point."}
        </p>
        {difference !== null && (
          <span className="score-delta">
            <Direction size={16} />
            {difference > 0 ? "+" : ""}
            {difference.toFixed(1)} percentage points from the previous attempt
          </span>
        )}
      </div>
      <div>
        <p>AVERAGE SCORE</p>
        <strong>{average === null ? "—" : average.toFixed(1) + "%"}</strong>
        <span>Across {assessments.length} assessments</span>
      </div>
      <div>
        <p>QUESTIONS PRACTICED</p>
        <strong>{questions}</strong>
        <span>One answer at a time.</span>
      </div>
    </div>
  );
}
