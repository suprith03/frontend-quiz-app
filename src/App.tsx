import React, { useEffect, useMemo, useRef, useState } from "react";
import { questions } from "./questions";
import type { Question } from "./questions";
import { motion, AnimatePresence } from "framer-motion";
import PawSticker from "./assets/best-of-luck.gif";

type View = "quiz" | "score";
const TOTAL_QUESTIONS = questions.length;

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(TOTAL_QUESTIONS).fill(null)
  );
  const [view, setView] = useState<View>("quiz");
  const [scorePercent, setScorePercent] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const currentQuestion: Question = useMemo(
    () => questions[currentIndex],
    [currentIndex]
  );

  const hasAnswer = answers[currentIndex] !== null;
  const isLast = currentIndex === TOTAL_QUESTIONS - 1;

  useEffect(() => {
    if (view === "quiz" && questionHeadingRef.current) {
      questionHeadingRef.current.focus();
    }
  }, [currentIndex, view]);

  const handleSelect = (i: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = i;
      return next;
    });
  };

  const handleNext = () => {
    if (hasAnswer && !isLast) setCurrentIndex((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((p) => p - 1);
  };

  const handleSubmit = () => {
    if (!hasAnswer) return;
    let score = 0;
    answers.forEach((ans, i) => {
      if (ans === questions[i].correctIndex) score++;
    });
    setScorePercent(Math.round((score / TOTAL_QUESTIONS) * 100));
    setView("score");
  };

  const handleRestart = () => {
    setAnswers(Array(TOTAL_QUESTIONS).fill(null));
    setCurrentIndex(0);
    setScorePercent(0);
    setAnimatedScore(0);
    setView("quiz");
  };

  useEffect(() => {
    if (view === "score") {
      let start = 0;
      const end = scorePercent;
      const duration = 1000;
      const step = end / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setAnimatedScore(Math.round(start));
      }, 16);
      return () => clearInterval(timer);
    }
  }, [view, scorePercent]);

  if (view === "score") {
    return (
      <main className="min-h-screen flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl bg-white/80 rounded-[32px] px-16 py-20 flex flex-col items-center shadow-xl"
        >
          <p className="text-3xl text-quizPrimary font-display mb-4">
            Your Final Score Is
          </p>

          <motion.p
            key={animatedScore}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="text-[72px] font-display text-quizPrimary"
          >
            {animatedScore}
            <span className="text-3xl ml-1">%</span>
          </motion.p>

          <button
            onClick={handleRestart}
            className="mt-12 px-10 py-3 rounded-full bg-sky-200 text-quizPrimary shadow hover:bg-sky-300 transition"
          >
            Start Again
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative">
      <button
        onClick={handleRestart}
        className="fixed bottom-6 right-6 px-6 py-3 rounded-full bg-white shadow text-slate-700 hover:text-quizPrimary hover:shadow-md transition z-50"
      >
        Restart quiz
      </button>

      <div className="relative w-full max-w-5xl bg-white/50 rounded-[32px] shadow-lg p-6 overflow-visible">
        <div className="w-full max-w-4xl mx-auto bg-quizCard/95 rounded-[28px] shadow-quiz border border-white/70 overflow-hidden relative">

          {currentIndex === 0 && (
            <>
              <motion.div
                className="absolute left-4 bottom-16 z-40 pointer-events-none"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  fontFamily: '"Patrick Hand", cursive',
                  transform: "rotate(-3deg)"
                }}
              >
                <div className="px-5 py-2 rounded-2xl shadow bg-white border border-sky-300 text-[18px]">
                  Best of Luck!
                </div>
              </motion.div>

              <motion.img
                src={PawSticker}
                className="absolute left-6 bottom-0 w-20 z-40 select-none pointer-events-none"
                initial={{ y: 2 }}
                animate={{ y: [2, -2, 2] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}

          <div className="px-10 py-6 border-b border-white/40">
            <header className="text-center">
              <h1
                ref={questionHeadingRef}
                tabIndex={-1}
                className="font-display text-[44px] text-quizPrimary mb-2 italic tracking-tight font-bold"
              >
                Test Your Knowledge
              </h1>

              <p className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white text-[13px] text-slate-500 shadow-sm mb-4">
                Answer all questions to see your results
              </p>

              <div className="flex items-center justify-center gap-3">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-[3px] w-20 rounded-full ${
                      idx <= currentIndex ? "bg-quizPrimary" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </header>
          </div>

          <div className="relative px-10 py-8 border-b border-white/40 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 flex flex-col items-center"
              >
                <p className="text-sm text-slate-500 font-medium">
                  Question {currentIndex + 1} of {TOTAL_QUESTIONS}
                </p>

                <div className="w-full rounded-2xl bg-gradient-to-r from-sky-100 to-sky-200 px-6 py-4 text-[16px] font-medium text-slate-800 border border-sky-100 shadow-sm text-center">
                  <span className="mr-2 font-semibold">{currentIndex + 1}.</span>
                  {currentQuestion.text}
                </div>

                <div className="space-y-2 w-full">
                  {currentQuestion.options.map((option, idx) => {
                    const selected = answers[currentIndex] === idx;
                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(idx)}
                        className={`w-full text-center px-6 py-4 rounded-2xl border bg-gradient-to-r from-sky-50 to-sky-100 shadow-sm text-[16px] font-medium ${
                          selected
                            ? "border-sky-400 ring-2 ring-sky-300"
                            : "border-sky-100"
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="px-10 py-6 flex items-center justify-end gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`h-12 w-12 rounded-full border text-lg shadow-sm ${
                currentIndex === 0
                  ? "bg-slate-100 text-slate-300 border-slate-200"
                  : "bg-white text-quizPrimary border-slate-200 hover:bg-sky-50"
              }`}
            >
              ←
            </button>

            {!isLast ? (
              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className={`h-12 w-12 rounded-full border text-lg shadow-sm ${
                  !hasAnswer
                    ? "bg-slate-100 text-slate-300 border-slate-200"
                    : "bg-white text-quizPrimary border-slate-200 hover:bg-sky-50"
                }`}
              >
                →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!hasAnswer}
                className={`px-8 py-2 rounded-full text-sm font-semibold shadow-sm border ${
                  !hasAnswer
                    ? "bg-slate-100 text-slate-300 border-slate-200"
                    : "bg-sky-200 text-quizPrimary border-sky-300 hover:bg-sky-300"
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
