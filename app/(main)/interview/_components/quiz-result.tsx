"use client";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowUpRight, CornerDownRight } from "lucide-react";
export interface QuestionType {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
}
export interface SubmitResultType {
  id: string;
  quizScore: number;
  questions: QuestionType[];
  category: string;
  improvementTip: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
interface QuizResultProps {
  submitResult: SubmitResultType;
  startNewQuizFn?: () => void;
  showNewQuizBtn?: boolean;
  previousScore?: number;
}
export default function QuizResult({
  submitResult,
  startNewQuizFn,
  showNewQuizBtn = true,
  previousScore,
}: QuizResultProps) {
  const [filter, setFilter] = useState("all");
  const id = useId();
  const correct = submitResult.questions.filter((q) => q.isCorrect).length;
  const delta =
    previousScore === undefined ? null : submitResult.quizScore - previousScore;
  return (
    <div className="assessment-results">
      <p className="eyebrow">
        ANOTHER STEP FORWARD / {submitResult.category.toUpperCase()}
      </p>
      <div className="result-summary">
        <div className="result-score">
          <strong>
            {submitResult.quizScore.toFixed(1)}
            <span>%</span>
          </strong>
          <p>Your assessment score</p>
        </div>
        <div>
          <h2>A little more clarity.</h2>
          <p>
            <strong>{correct}</strong> answers correct.
            <br />
            <strong>{submitResult.questions.length - correct}</strong>{" "}
            {submitResult.questions.length - correct === 1
              ? "opportunity"
              : "opportunities"}{" "}
            to learn.
          </p>
          {delta !== null && (
            <p className="result-change">
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)} percentage points from the previous assessment
            </p>
          )}
        </div>
      </div>
      <div className="result-topology" aria-label="Answer results">
        {submitResult.questions.map((q, i) => (
          <a
            key={i}
            href={"#" + id + "-q-" + i}
            className={q.isCorrect ? "correct" : "revisit"}
            aria-label={
              "Question " +
              (i + 1) +
              ": " +
              (q.isCorrect ? "correct" : "review recommended")
            }
            onClick={() => setFilter("all")}
          >
            {String(i + 1).padStart(2, "0")}
          </a>
        ))}
      </div>
      <div className="result-legend">
        <span>
          <i /> Answered correctly
        </span>
        <span>
          <i /> Worth revisiting
        </span>
      </div>
      {submitResult.improvementTip && (
        <div className="improvement-direction">
          <CornerDownRight size={24} />
          <div>
            <p className="eyebrow">YOUR NEXT PRACTICE FOCUS</p>
            <p>{submitResult.improvementTip}</p>
          </div>
        </div>
      )}
      <div className="review-heading">
        <h3>Learn from every answer.</h3>
        <div
          className="result-filters"
          role="group"
          aria-label="Filter answer review"
        >
          {[
            ["all", "All answers"],
            ["correct", "Correct"],
            ["revisit", "Revisit"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="answer-review-list">
        {submitResult.questions
          .map((q, i) => ({ q, i }))
          .filter(
            ({ q }) =>
              filter === "all" ||
              (filter === "correct" ? q.isCorrect : !q.isCorrect),
          )
          .map(({ q, i }) => (
            <article key={i} id={id + "-q-" + i} className="answer-review">
              <div className="answer-review-title">
                <span>Q{String(i + 1).padStart(2, "0")}</span>
                <h4>{q.question}</h4>
                <span
                  className={
                    q.isCorrect
                      ? "answer-status correct"
                      : "answer-status revisit"
                  }
                >
                  {q.isCorrect ? (
                    <>
                      <Check size={13} /> Correct
                    </>
                  ) : (
                    "Revisit"
                  )}
                </span>
              </div>
              <p className="review-your-answer">
                Your answer: <span>{q.userAnswer}</span>
              </p>
              {!q.isCorrect && (
                <p className="review-correct-answer">
                  Correct answer: {q.correctAnswer}
                </p>
              )}
              <details>
                <summary>Understand the reasoning</summary>
                <p>{q.explanation}</p>
              </details>
            </article>
          ))}
      </div>
      {((filter === "correct" && correct === 0) ||
        (filter === "revisit" &&
          correct === submitResult.questions.length)) && (
        <p className="empty-note">
          {filter === "revisit"
            ? "Every answer was correct. Explore the reasoning to keep learning."
            : "No correct answers in this attempt. Review the explanations to prepare for your next session."}
        </p>
      )}
      {showNewQuizBtn && (
        <div className="result-footer">
          <p>Keep the momentum going.</p>
          <Button onClick={startNewQuizFn}>
            Start New Quiz <ArrowUpRight />
          </Button>
        </div>
      )}
    </div>
  );
}
