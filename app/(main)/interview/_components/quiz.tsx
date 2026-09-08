"use client";
import {
  generateInterviewQuestions,
  saveInterviewAssessment,
} from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useFetch from "@/hooks/use-fetch";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  Lightbulb,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import QuizResult from "./quiz-result";
export const Quiz = () => {
  const [currentQues, setCurrentQues] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [disableQuizOptn, setDisableQuizOptn] = useState<boolean>(false);

  //question generation hook
  const {
    data: questionsData,
    setData: setQuestionsData,
    loading: questionsLoading,
    fn: questionsFn,
  } = useFetch<Awaited<ReturnType<typeof generateInterviewQuestions>>>();

  //quiz submission hook
  const {
    data: submitData,
    setData: setSubmitData,
    loading: submitLoading,
    fn: submitFn,
  } = useFetch<Awaited<ReturnType<typeof saveInterviewAssessment>>>();

  //generate question (hook fn)
  const handleGenerateQuiz = async () => {
    try {
      const questions = await questionsFn(generateInterviewQuestions);
      if (questions) {
        setUserAnswers(new Array(questions.length).fill(null));
        toast.success("Your practice session is ready");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error("Error while generating quiz questions");
      } else {
        toast.error("An unknown error occured while quiz questions");
      }
    }
  };

  const handleChange = (val: string) => {
    //fn to fill the radio component option selected by the user in the userAnswer array
    const userAnswersNew = [...userAnswers];
    userAnswersNew[currentQues] = val;
    setUserAnswers(userAnswersNew);
  };

  //submit quiz (hook fn)
  const handleSubmit = async () => {
    if (!questionsData || userAnswers.some((answer) => answer === null)) {
      toast.error("Attempt each question in the quiz");
      return;
    }
    try {
      let score = 0;
      userAnswers.forEach((userAns, index) => {
        if (userAns === questionsData[index].correctAnswer) score++;
      });
      const scorePercentage = (score / questionsData.length) * 100;

      const result = await submitFn(
        saveInterviewAssessment,
        questionsData,
        userAnswers.filter((answer): answer is string => answer !== null),
        scorePercentage,
      );
      if (result) toast.success("Assessment saved successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        toast.error("Error while submitting the quiz");
      } else {
        toast.error("An unknown error occured while submitting the quiz");
      }
    }
  };

  const startNewQuiz = async () => {
    //function to clear all state variables, or to set them to null. Called when the user clicks to start a new quiz
    setCurrentQues(0);
    setUserAnswers([]);
    setQuestionsData(null);
    setShowExplanation(false);
    setDisableQuizOptn(false);
    setSubmitData(null);
    //new quiz questions
    await handleGenerateQuiz();
  };

  const reduced = useReducedMotion();
  return (
    <div
      className="assessment-session"
      aria-busy={questionsLoading || submitLoading}
    >
      <AnimatePresence mode="wait">
        {submitData ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <QuizResult
              submitResult={submitData}
              startNewQuizFn={startNewQuiz}
            />
          </motion.div>
        ) : questionsLoading ? (
          <div className="assessment-loading" key="loading" role="status">
            <Loader2 className="animate-spin" size={25} />
            <h2>Building your practice session.</h2>
            <p>Preparing questions around your industry and skills.</p>
          </div>
        ) : !questionsData ? (
          <div className="assessment-start" key="start">
            <p className="eyebrow">A SMALL INVESTMENT IN YOUR NEXT CHAPTER</p>
            <h2>
              Find out what
              <br />
              you’re ready for.
            </h2>
            <p>
              20 questions, shaped around your industry and skills. Take your
              time, choose your answer, and learn from the explanation.
            </p>
            <div className="session-facts">
              <span>
                <strong>20</strong> tailored questions
              </span>
              <span>
                <strong>Your pace</strong> no time limit
              </span>
              <span>
                <strong>Clear feedback</strong> after every answer
              </span>
            </div>
            <Button
              size="lg"
              onClick={handleGenerateQuiz}
              disabled={questionsLoading}
            >
              Start the Quiz
            </Button>
          </div>
        ) : (
          <motion.div
            key={"question-" + currentQues}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="question-header">
              <span className="eyebrow">YOUR PRACTICE SESSION</span>
              <span aria-live="polite">
                Question <strong>{currentQues + 1}</strong> /{" "}
                {questionsData.length}
              </span>
            </div>
            <div
              className="question-trajectory"
              role="progressbar"
              aria-label="Questions answered"
              aria-valuenow={userAnswers.filter(Boolean).length}
              aria-valuemin={0}
              aria-valuemax={questionsData.length}
            >
              {questionsData.map((_, i) => (
                <span
                  key={i}
                  data-answered={userAnswers[i] !== null}
                  data-current={i === currentQues}
                />
              ))}
            </div>
            <div className="question-surface">
              <p className="question-number">
                QUESTION {String(currentQues + 1).padStart(2, "0")}
              </p>
              <h2 id="current-question">
                {questionsData[currentQues].question}
              </h2>
              <RadioGroup
                aria-labelledby="current-question"
                onValueChange={handleChange}
                value={userAnswers[currentQues]}
                className="question-options"
              >
                {questionsData[currentQues].options.map((option, index) => (
                  <div key={index} className="question-option">
                    <span className="answer-letter" aria-hidden="true">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <RadioGroupItem
                      value={option}
                      id={"option-" + index}
                      disabled={disableQuizOptn || submitLoading}
                    />
                    <Label htmlFor={"option-" + index}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="question-help">
                <span>
                  Choose one answer. Use arrow keys to move between options.
                </span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (showExplanation) setShowExplanation(false);
                    else {
                      setShowExplanation(true);
                      setDisableQuizOptn(true);
                    }
                  }}
                  disabled={userAnswers[currentQues] == null || submitLoading}
                >
                  <Lightbulb />
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </Button>
              </div>
              {showExplanation && (
                <div
                  className="answer-explanation"
                  role="region"
                  aria-label="Answer explanation"
                >
                  <p className="eyebrow">THE REASONING</p>
                  <p>{questionsData[currentQues].explanation}</p>
                </div>
              )}
            </div>
            <div className="question-footer">
              <span>
                {userAnswers.filter(Boolean).length} of {questionsData.length}{" "}
                answered
              </span>
              <div>
                {currentQues > 0 && (
                  <Button
                    variant="outline"
                    disabled={submitLoading}
                    onClick={() => {
                      setCurrentQues((prev) => prev - 1);
                      setShowExplanation(false);
                      setDisableQuizOptn(true);
                    }}
                  >
                    <ChevronLeft /> Back
                  </Button>
                )}
                {currentQues < questionsData.length - 1 ? (
                  <Button
                    onClick={() => {
                      setCurrentQues((prev) => prev + 1);
                      setShowExplanation(false);
                      setDisableQuizOptn(false);
                    }}
                    disabled={userAnswers[currentQues] == null}
                  >
                    Next <ChevronRight />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitLoading}>
                    {submitLoading ? (
                      <>
                        <Loader2 className="animate-spin" /> Saving your
                        results…
                      </>
                    ) : (
                      <>
                        Submit Quiz <CircleCheckBig />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
