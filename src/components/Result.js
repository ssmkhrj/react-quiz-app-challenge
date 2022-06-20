import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

function Result({ questions, answers, handleReset }) {
  return (
    <div>
      <ul className="space-y-6 mb-8">
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.answer;
          return (
            <li
              key={i}
              className={`bg-gray-100 rounded-md p-4 font-[700] text-xl`}
            >
              <div className="mb-2 font-[600] text-lg text-gray-400 flex items-center justify-between">
                <span>{i + 1}.</span>
                {isCorrect ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="">
                {`${q.question} = `}
                {answers[i] !== null ? (
                  answers[i]
                ) : (
                  <span className="text-gray-400 font-[600]">skipped</span>
                )}
              </div>
              {!isCorrect && (
                <div className="text-right mt-2 text-lg">
                  <span className="font-[400]">Correct answer: </span>
                  <span>{q.answer}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button
        onClick={handleReset}
        className="w-full py-2 px-4 rounded-full font-[600] text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
      >
        Reset
      </button>
    </div>
  );
}

export default Result;
