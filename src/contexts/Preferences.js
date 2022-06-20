import { createContext, useMemo } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

export const PreferencesContext = createContext(null);
PreferencesContext.displayName = "PreferencesContext";

export function PreferencesProvider({ defaultPreferences, children }) {
  const [preferences, setPreferences] = useLocalStorageState(
    "user-preferences",
    { ...defaultPreferences }
  );

  const value = useMemo(
    () => [preferences, setPreferences],
    [preferences, setPreferences]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}
