import { useRef, useState } from "react";
import { usePreferences } from "../hooks/usePreferences";

function SettingsForm({ close }) {
  const [errorInput, setErrorInput] = useState(null);
  const formRef = useRef(null);
  const [preferences, setPreferences] = usePreferences();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorInput(null);

    const formData = new FormData(formRef.current);
    const noOfQuestions = Number(formData.get("no-of-questions"));
    const rangeOfOperands = formData.get("range-of-operands");
    const operators = formData.getAll("operators");

    if (noOfQuestions <= 1) {
      setErrorInput({
        name: "no-of-questions",
        msg: "Please fill a number greater than or equal to 1",
      });
    } else if (!rangeOfOperands) {
      setErrorInput({
        name: "range-of-operands",
        msg: "Please select an operand range",
      });
    } else if (!operators.length) {
      setErrorInput({
        name: "operators",
        msg: "Please select atleast one operator",
      });
    } else {
      setPreferences({
        noOfQuestions,
        rangeOfOperands,
        operators,
      });
      formRef.current.reset();
      close();
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block font-[600]">Number of questions:</label>
        <input
          type="number"
          defaultValue={preferences.noOfQuestions}
          name="no-of-questions"
          className="w-full rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errorInput?.name === "no-of-questions" && (
          <div className="text-red-500 font-[600]">{errorInput.msg}</div>
        )}
      </div>
      <fieldset className="space-y-2">
        <legend className="font-[600]">Allowed operands range:</legend>
        <div className="flex gap-4">
          {["0-9", "0-19", "0-29", "0-39", "0-49", "0-59"].map((range) => (
            <div className="flex items-center gap-1.5" key={range}>
              <input
                type="radio"
                name="range-of-operands"
                value={range}
                defaultChecked={preferences.rangeOfOperands === range}
                id={range}
                className="focus:ring-blue-500 focus:ring-offset-1 text-blue-500"
              />
              <label htmlFor={range}>{range}</label>
            </div>
          ))}
        </div>
        {errorInput?.name === "range-of-operands" && (
          <div className="text-red-500 font-[600]">{errorInput.msg}</div>
        )}
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="font-[600]">Allowed operators:</legend>
        <div className="flex gap-4">
          {[
            { label: "Addition", value: "+" },
            { label: "Subtraction", value: "-" },
            { label: "Multiplication", value: "×" },
            { label: "Division", value: "÷" },
          ].map(({ label, value }) => (
            <div className="flex items-center gap-1.5" key={value}>
              <input
                type="checkbox"
                name="operators"
                value={value}
                id={value}
                defaultChecked={preferences.operators.includes(value)}
                className="focus:ring-blue-500 focus:ring-offset-1 text-blue-500 rounded-sm"
              />
              <label htmlFor={value} className="">
                {label}
              </label>
            </div>
          ))}
        </div>
        {errorInput?.name === "operators" && (
          <div className="text-red-500 font-[600]">{errorInput.msg}</div>
        )}
      </fieldset>
      <button
        type="submit"
        onClick={() => {}}
        className="w-full py-2 px-4 rounded-full font-[600] text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
      >
        Update Settings
      </button>
    </form>
  );
}

export default SettingsForm;
