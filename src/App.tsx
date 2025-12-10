import React, { useEffect, useMemo, useRef, useState } from 'react';
import { questions } from './questions';
import type { Question } from './questions';


type View = 'quiz' | 'score';

const TOTAL_QUESTIONS = questions.length;

const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(TOTAL_QUESTIONS).fill(null)
  );
  const [view, setView] = useState<View>('quiz');
  const [scorePercent, setScorePercent] = useState(0);

  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);

  const currentQuestion: Question = useMemo(
    () => questions[currentIndex],
    [currentIndex]
  );

  const hasAnswerForCurrent = answers[currentIndex] !== null;
  const isLastQuestion = currentIndex === TOTAL_QUESTIONS - 1;

  // Move focus to heading when question changes 
  useEffect(() => {
    if (view === 'quiz' && questionHeadingRef.current) {
      questionHeadingRef.current.focus();
    }
  }, [currentIndex, view]);

  const handleSelectOption = (optionIndex: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (!hasAnswerForCurrent) return;
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!hasAnswerForCurrent) return;

    let correctCount = 0;
    answers.forEach((answerIndex, idx) => {
      if (answerIndex === questions[idx].correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);
    setScorePercent(percent);
    setView('score');
  };

  const handleRestart = () => {
    setAnswers(Array(TOTAL_QUESTIONS).fill(null));
    setCurrentIndex(0);
    setScorePercent(0);
    setView('quiz');
  };

  if (view === 'score') {
    return (
      <main className="min-h-screen flex items-center justify-center px-8">
        <div className="w-full max-w-4xl bg-quizCard/90 shadow-quiz rounded-[32px] px-16 py-20 flex flex-col items-center">
          <button
            className="px-6 py-2 mb-12 rounded-full bg-white/70 text-sm font-medium text-quizPrimary tracking-wide shadow-sm transition hover:shadow-md focus-visible:outline-none"
            type="button"
          >
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
            className="mt-4 px-10 py-3 rounded-full bg-sky-200 font-medium text-quizPrimary shadow-sm hover:shadow-md hover:bg-sky-300 transition text-base focus-visible:outline-none"
          >
            Start Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <section
        aria-label="Quiz: Test your knowledge"
        className="relative w-full max-w-4xl bg-quizCard/90 rounded-[32px] shadow-quiz border border-white/70 px-10 py-12 overflow-hidden"
      >
        {/* Decorative left sticker approximation */}
        <div className="hidden lg:flex flex-col gap-3 absolute left-[-32px] bottom-10 items-center rotate-[-6deg]">
          <div className="bg-white shadow-md px-4 py-2 rounded-2xl text-xs font-semibold text-quizPrimary">
            Best of Luck!
          </div>
        </div>

        {/* Header */}
        <header className="text-center mb-10">
          <h1
            ref={questionHeadingRef}
            tabIndex={-1}
            className="font-display text-[40px] leading-tight text-quizPrimary mb-3"
          >
            Test Your Knowledge
          </h1>
          <p className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-white/90 text-[13px] text-slate-500 shadow-sm">
            Answer all questions to see your results
          </p>

          {/* Progress lines */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={[
                  'h-[3px] w-20 rounded-full transition-all duration-300',
                  idx <= currentIndex
                    ? 'bg-quizPrimary'
                    : 'bg-slate-200',
                ].join(' ')}
                aria-hidden="true"
              />
            ))}
          </div>
        </header>

        {/* Question & options */}
        <div className="space-y-5">
          <p className="text-sm text-slate-500 font-medium">
            Question {currentIndex + 1} of {TOTAL_QUESTIONS}
          </p>

          <div className="rounded-2xl bg-gradient-to-r from-sky-100 via-sky-100 to-sky-200 px-6 py-4 text-[15px] font-medium text-slate-700 shadow-sm border border-sky-100">
            <span className="mr-2 font-semibold">
              {currentIndex + 1}.
            </span>
            {currentQuestion.text}
          </div>

          <div className="space-y-3 mt-4" role="list">
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
                    'w-full text-left px-6 py-4 rounded-2xl border',
                    'bg-gradient-to-r from-sky-50 via-sky-50 to-sky-100',
                    'transition shadow-sm text-[15px] font-medium',
                    'hover:shadow-md hover:-translate-y-[1px]',
                    isSelected
                      ? 'border-sky-400 ring-2 ring-sky-300'
                      : 'border-sky-100',
                  ].join(' ')}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="mt-10 flex items-center justify-between">
          {/* Restart on quiz View */}
          <button
            type="button"
            onClick={handleRestart}
            className="text-xs font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-quizPrimary hover:decoration-quizPrimary transition"
          >
            Restart quiz
          </button>

          <div className="flex items-center gap-3">
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-disabled={currentIndex === 0}
              className={[
                'inline-flex items-center justify-center h-10 w-10 rounded-full border text-sm font-medium',
                'transition shadow-sm focus-visible:outline-none',
                currentIndex === 0
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-quizPrimary border-slate-200 hover:bg-sky-50 hover:shadow-md',
              ].join(' ')}
            >
              ←
              <span className="sr-only">Previous question</span>
            </button>

            {/* Submit */}
            {!isLastQuestion ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!hasAnswerForCurrent}
                aria-disabled={!hasAnswerForCurrent}
                className={[
                  'inline-flex items-center justify-center h-10 w-10 rounded-full border text-sm font-medium',
                  'transition shadow-sm focus-visible:outline-none',
                  !hasAnswerForCurrent
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-quizPrimary border-slate-200 hover:bg-sky-50 hover:shadow-md',
                ].join(' ')}
              >
                →
                <span className="sr-only">Next question</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasAnswerForCurrent}
                aria-disabled={!hasAnswerForCurrent}
                className={[
                  'px-8 py-2 rounded-full text-sm font-semibold transition shadow-sm border',
                  !hasAnswerForCurrent
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-sky-200 text-quizPrimary border-sky-300 hover:bg-sky-300 hover:shadow-md',
                ].join(' ')}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
