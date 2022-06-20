import { useContext } from "react";
import { PreferencesContext } from "../contexts/Preferences";

function usePreferences() {
  const preferencesState = useContext(PreferencesContext);

  if (!preferencesState) {
    throw new Error(
      "usePreferences hook should be used within a PreferencesProvider"
    );
  }

  return preferencesState;
}

export { usePreferences };
