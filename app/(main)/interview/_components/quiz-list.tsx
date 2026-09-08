"use client";
import { useState } from "react";
import Link from "next/link";
import { Assessment } from "@prisma/client";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult, { QuestionType } from "./quiz-result";
export default function QuizList({
  assessments,
}: {
  assessments: Assessment[];
}) {
  const [selectedQuiz, setSelectedQuiz] = useState<Assessment | null>(null);
  const selectedIndex = assessments.findIndex((a) => a.id === selectedQuiz?.id);
  return (
    <>
      <section className="assessment-history">
        <div className="data-section-heading">
          <div>
            <p className="eyebrow">YOUR PROGRESS, RECORDED</p>
            <h2>Every attempt counts.</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/interview/mock">Start New Quiz</Link>
          </Button>
        </div>
        {!assessments.length && (
          <div className="empty-note">
            <h3>Your first checkpoint is ahead.</h3>
            <p>
              Complete a practice session to see your score, answer review, and
              personalized feedback here.
            </p>
          </div>
        )}
        <div className="history-list">
          {assessments.map((assessment, index) => (
            <button
              type="button"
              className="history-row"
              key={assessment.id}
              onClick={() => setSelectedQuiz(assessment)}
            >
              <span className="history-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <strong>{assessment.category} assessment</strong>
                <span>
                  {format(
                    new Date(assessment.createdAt),
                    "dd MMM yyyy · HH:mm",
                  )}{" "}
                  · {assessment.questions.length} questions
                </span>
              </div>
              <span className="history-score">
                {assessment.quizScore.toFixed(1)}
                <small>%</small>
              </span>
              <span className="history-review">
                Review <ArrowRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>
      <Dialog
        open={!!selectedQuiz}
        onOpenChange={(open) => {
          if (!open) setSelectedQuiz(null);
        }}
      >
        <DialogContent
          aria-describedby={undefined}
          className="assessment-review-dialog w-[calc(100%-2rem)] sm:max-w-4xl max-h-[88vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Assessment review</DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <QuizResult
              key={selectedQuiz.id}
              submitResult={{
                ...selectedQuiz,
                questions: selectedQuiz.questions as unknown as QuestionType[],
              }}
              showNewQuizBtn={false}
              previousScore={
                selectedIndex > 0
                  ? assessments[selectedIndex - 1].quizScore
                  : undefined
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
