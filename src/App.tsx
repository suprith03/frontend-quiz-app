import React, { useEffect, useMemo, useRef, useState } from "react";
import { questions } from "./questions";
import type { Question } from "./questions";
import { motion, AnimatePresence } from "framer-motion";
import BestOfLuckSticker from "./assets/best-of-luck.png";

type View = "quiz" | "score";
const TOTAL_QUESTIONS = questions.length;

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(TOTAL_QUESTIONS).fill(null)
  );
  const [view, setView] = useState<View>("quiz");
  const [scorePercent, setScorePercent] = useState(0);

  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const currentQuestion: Question = useMemo(
    () => questions[currentIndex],
    [currentIndex]
  );

  const hasAnswerForCurrent = answers[currentIndex] !== null;
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

  useEffect(() => {
    if (view === "quiz" && questionHeadingRef.current) {
      questionHeadingRef.current.focus();
    }
  }, [currentIndex, view]);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (!hasAnswerForCurrent) return;
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!hasAnswerForCurrent) return;

    let correctCount = 0;
    answers.forEach((answerIdx, i) => {
      if (answerIdx === questions[i].correctIndex) correctCount += 1;
    });

    const percent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    setScorePercent(percent);
    setView("score");
  };

  const handleRestart = () => {
    setAnswers(Array(TOTAL_QUESTIONS).fill(null));
    setCurrentIndex(0);
    setScorePercent(0);
    setView("quiz");
  };

  if (view === "score") {
    return (
      <main className="min-h-screen flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-4xl bg-quizCard/90 shadow-quiz rounded-[32px] px-16 py-20 flex flex-col items-center"
        >
          <button className="px-6 py-2 mb-12 rounded-full bg-white/70 text-sm font-medium text-quizPrimary tracking-wide shadow-sm hover:shadow-md">
            Keep Learning!
          </button>

          <p className="text-2xl md:text-3xl text-quizPrimary font-display mb-4 text-center">
            Your Final score is
          </p>

          <p className="text-[72px] leading-none font-display text-quizPrimary mb-8">
            {scorePercent}
            <span className="text-3xl align-super ml-1">%</span>
          </p>

          <button
            type="button"
            onClick={handleRestart}
            className="mt-4 px-10 py-3 rounded-full bg-sky-200 font-medium text-quizPrimary shadow-sm hover:bg-sky-300 hover:shadow-md transition text-base"
          >
            Start Again
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-8 py-4">
      <div className="w-full max-w-4xl bg-quizCard/90 rounded-[32px] shadow-quiz border border-white/70 overflow-hidden">
        <div className="px-10 py-6 border-b border-white/40">
          <header className="text-center">
            <h1
              ref={questionHeadingRef}
              tabIndex={-1}
              className="font-display text-[48px] leading-tight text-quizPrimary mb-2 italic tracking-tight"
            >
              Test Your Knowledge
            </h1>

            <p className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white/90 text-[13px] text-slate-500 shadow-sm mb-4">
              Answer all questions to see your results
            </p>

            <div className="flex items-center justify-center gap-3">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[3px] w-20 rounded-full transition-all duration-300 ${
                    idx <= currentIndex ? "bg-quizPrimary" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </header>
        </div>

        <div className="relative px-10 py-6 pb-24 border-b border-white/40 overflow-visible min-h-[330px]">
          <img
            src={BestOfLuckSticker}
            alt="Good Luck Cat"
            className="absolute left-6 bottom-6 w-24 h-auto pointer-events-none select-none z-10"
            draggable="false"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-3"
            >
              <p className="text-sm text-slate-500 font-medium">
                Question {currentIndex + 1} of {TOTAL_QUESTIONS}
              </p>

              <div className="rounded-2xl bg-gradient-to-r from-sky-100 via-sky-100 to-sky-200 px-6 py-4 text-[16px] font-medium text-slate-800 shadow-sm border border-sky-100 font-sans">
                <span className="mr-2 font-semibold">{currentIndex + 1}.</span>
                {currentQuestion.text}
              </div>

              <div className="space-y-2" role="list">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentIndex] === idx;

                  return (
                    <button
                      key={option}
                      type="button"
                      role="listitem"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectOption(idx)}
                      className={[
                        "w-full text-left px-6 py-4 rounded-2xl border",
                        "bg-gradient-to-r from-sky-50 via-sky-50 to-sky-100",
                        "transition shadow-sm text-[16px] font-medium text-slate-700 font-sans",
                        "hover:shadow-md hover:-translate-y-[1px]",
                        isSelected
                          ? "border-sky-400 ring-2 ring-sky-300"
                          : "border-sky-100",
                      ].join(" ")}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative px-10 py-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleRestart}
            className="text-base font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-quizPrimary transition"
          >
            Restart quiz
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`inline-flex items-center justify-center h-12 w-12 rounded-full border text-lg shadow-sm transition ${
                currentIndex === 0
                  ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                  : "bg-white text-quizPrimary border-slate-200 hover:bg-sky-50 hover:shadow-md"
              }`}
            >
              ←
            </button>

            {!isLastQuestion ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasAnswerForCurrent}
                className={`inline-flex items-center justify-center h-12 w-12 rounded-full border text-lg shadow-sm transition ${
                  !hasAnswerForCurrent
                    ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                    : "bg-white text-quizPrimary border-slate-200 hover:bg-sky-50 hover:shadow-md"
                }`}
              >
                →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasAnswerForCurrent}
                className={`px-8 py-2 rounded-full text-sm font-semibold transition shadow-sm border ${
                  !hasAnswerForCurrent
                    ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
                    : "bg-sky-200 text-quizPrimary border-sky-300 hover:bg-sky-300 hover:shadow-md"
                }`}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
