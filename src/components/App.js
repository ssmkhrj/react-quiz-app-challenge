import { Dialog } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/solid";
import Quiz from "./Quiz";
import SettingsForm from "./SettingsForm";
import { PreferencesProvider } from "../contexts/Preferences";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

function App() {
  const [showSettings, setShowSettings] = useLocalStorageState(
    "settings-open",
    false
  );
  const [{ correctAnswers, incorrectAnswers, skippedAnswers }, setStats] =
    useLocalStorageState("user-stats", {
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedAnswers: 0,
    });

  return (
    <PreferencesProvider
      defaultPreferences={{
        noOfQuestions: 20,
        rangeOfOperands: "0-9",
        operators: ["+", "-", "×", "÷"],
      }}
    >
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="p-6 bg-white shadow-md rounded-md max-w-lg mx-auto">
            <div className="mb-6 text-2xl font-[700] text-center">Settings</div>
            <SettingsForm close={() => setShowSettings(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className="max-w-6xl mx-auto my-8 px-4">
        <header className="flex items-center justify-between mb-8 rounded-md">
          <ul className="text-lg flex gap-4">
            <li className="rounded-md flex gap-1">
              <div>Correct: </div>
              <div className="font-[600]">{correctAnswers}</div>
            </li>
            <li className="rounded-md flex gap-1">
              <div>Incorrect: </div>
              <div className="font-[600]">{incorrectAnswers}</div>
            </li>
            <li className="rounded-md flex gap-1">
              <div>Skipped: </div>
              <div className="font-[600]">{skippedAnswers}</div>
            </li>
          </ul>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-blue-500 hover:text-blue-600 active:text-blue-700 hover:rotate-45 transition-transform"
          >
            <CogIcon className="w-8 h-8" />
          </button>
        </header>
        <main className="grid grid-cols-[repeat(auto-fit,minmax(26rem,1fr))] gap-4 items-start">
          <Quiz lsKey="quiz-1" setStats={setStats} />
          <Quiz lsKey="quiz-2" setStats={setStats} />
        </main>
      </div>
    </PreferencesProvider>
  );
}

export default App;
