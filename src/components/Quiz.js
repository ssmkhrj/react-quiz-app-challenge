import { memo, useEffect, useRef, useState } from "react";
import { generateQuestion } from "../utils/utils";
import { usePreferences } from "../hooks/usePreferences";
import Result from "./Result";
import { useCountdown } from "../hooks/useCountdown";
import { useLocalStorageReducer } from "../hooks/useLocalStorageReducer";

const TIMER = 20;

function quizReducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        ...(action.payload.hasOwnProperty("question") && {
          questions: state.questions.concat(action.payload.question),
        }),
        ...(action.payload.hasOwnProperty("answer") && {
          answers: state.answers.concat(action.payload.answer),
        }),
        ...(action.payload.hasOwnProperty("score") && {
          score: action.payload.score,
        }),
      };
    case "RESET_QUIZ":
      return { questions: [], answers: [], score: 0 };
    default:
      throw new Error(`Unrecognized action type: ${action.type}`);
  }
}

function Quiz({ lsKey, setStats }) {
  const [{ questions, answers, score }, dispatch] = useLocalStorageReducer(
    lsKey,
    quizReducer,
    {
      questions: [],
      answers: [],
      score: 0,
    }
  );
  const [answerInput, setAnswerInput] = useState("");

  const preferences = usePreferences()[0];
  const preferencesRef = useRef(preferences);
  // Update preferences if quiz is not active
  if (!questions.length) {
    preferencesRef.current = preferences;
  }
  const { noOfQuestions, rangeOfOperands, operators } = preferencesRef.current;

  const handleNext = () => {
    const payload = {};
    // If there already exists a question
    if (questions.length && answers.length < noOfQuestions) {
      stopCountdown();
      const answer = answerInput ? Number(answerInput) : null;
      const isAnsCorrect = answer === questions.at(-1).answer;
      payload.answer = answer;
      payload.score = score + (isAnsCorrect ? 1 : 0);

      // Update global stats
      if (!answerInput) {
        setStats((stats) => ({
          ...stats,
          skippedAnswers: stats.skippedAnswers + 1,
        }));
      } else if (isAnsCorrect) {
        setStats((stats) => ({
          ...stats,
          correctAnswers: stats.correctAnswers + 1,
        }));
      } else {
        setStats((stats) => ({
          ...stats,
          incorrectAnswers: stats.incorrectAnswers + 1,
        }));
      }
    }
    if (questions.length < noOfQuestions) {
      startCountdown();
      const [minOperand, maxOperand] = rangeOfOperands.split("-").map(Number);
      payload.question = generateQuestion(minOperand, maxOperand, operators);
    }

    dispatch({ type: "NEXT", payload });
    setAnswerInput("");
  };

  const handleReset = () => {
    dispatch({ type: "RESET_QUIZ" });
    stopCountdown();
    preferencesRef.current = preferences;
  };

  const { remainingTicks, startCountdown, stopCountdown } = useCountdown(
    lsKey,
    TIMER,
    1000,
    null,
    handleNext
  );

  useEffect(() => {
    // stop countdown on reset
    // if (!questions.length) {
    //   stopCountdown();
    // }
    // restart countdown on new question
    if (questions.length && questions.length < noOfQuestions) {
      // stopCountdown();
      startCountdown();
    }
    // stop countdown on submit
    // if (answers.length === noOfQuestions) {
    //   stopCountdown();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!questions.length) {
    return (
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-[700] mb-4">Instructions:</h2>
        <ul className="text-lg space-y-2 mb-8">
          <li>
            You will be presented with {noOfQuestions} mathematical questions
          </li>
          <li>For each question you will get {TIMER} seconds</li>
          <li>You cannot navigate back to previous questions</li>
        </ul>
        <button
          onClick={handleNext}
          className="w-full py-2 px-4 rounded-full font-[600] text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
        >
          Start Quiz
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white p-8 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={handleReset}
          className="font-[600] text-base hover:underline underline-offset-2 text-blue-500 hover:text-blue-600 active:text-blue-700"
        >
          Reset Quiz
        </button>
        {answers.length < noOfQuestions && (
          <p
            className={`text-xl font-[700] ${
              remainingTicks <= 3 && "text-red-500"
            }`}
          >
            {remainingTicks}
          </p>
        )}
      </div>
      <div className="text-gray-400 font-[600] text-2xl mb-6 flex justify-between items-center">
        <span>
          {answers.length < noOfQuestions &&
            `${questions.length}/${noOfQuestions}`}
        </span>
        <span className="text-2xl">Score: {score}</span>
      </div>
      {answers.length < noOfQuestions ? (
        <div>
          <div className="flex gap-6 mb-8 items-center text-6xl font-[700]">
            <div className="shrink-0">{questions.at(-1).question} =</div>
            <input
              type="number"
              placeholder="?"
              autoFocus
              value={answerInput}
              onChange={({ target }) => setAnswerInput(target.value)}
              className="bg-gray-100 text-center rounded-md px-4 py-2 focus:outline-none focus:ring-0 focus:bg-gray-200 border-0 text-6xl w-full placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleNext}
            className="w-full py-2 px-4 rounded-full font-[600] text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
          >
            {!questions.length
              ? "Start Quiz"
              : questions.length < noOfQuestions
              ? "Next Question"
              : "Submit"}
          </button>
        </div>
      ) : (
        <Result
          questions={questions}
          answers={answers}
          score={score}
          handleReset={handleReset}
        />
      )}
    </section>
  );
}

export default memo(Quiz);
