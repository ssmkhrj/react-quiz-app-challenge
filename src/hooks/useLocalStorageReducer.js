import { useReducer, useRef, useEffect } from "react";

function useLocalStorageReducer(
  key,
  reducer,
  initVal = "",
  initializer,
  { serialize = JSON.stringify, deserialize = JSON.parse } = {}
) {
  const [state, dispatch] = useReducer(reducer, initVal, () => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage);
    }
    return initializer === undefined ? initVal : initializer(initVal);
  });

  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, dispatch];
}

export { useLocalStorageReducer };
