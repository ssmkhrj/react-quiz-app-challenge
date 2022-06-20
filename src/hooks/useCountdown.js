import { useCallback, useEffect, useRef } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

function useCountdown(lsKey, totalTicks, interval, onChange, onEnd) {
  const [remainingTicks, setRemainingTicks] = useLocalStorageState(
    `${lsKey}/remainingtime`,
    totalTicks
  );
  const onChangeRef = useRef(onChange);
  const onEndRef = useRef(onEnd);
  const intervalIdRef = useRef(null);

  const startCountdown = useCallback(() => {
    intervalIdRef.current = setInterval(() => {
      console.log("Ticking...");
      onChangeRef.current?.();
      setRemainingTicks((remainingTicks) => remainingTicks - 1);
    }, interval);
  }, [interval, setRemainingTicks]);

  const stopCountdown = useCallback(() => {
    clearInterval(intervalIdRef.current);
    setRemainingTicks(totalTicks);
  }, [setRemainingTicks, totalTicks]);

  useEffect(() => {
    onEndRef.current = onEnd;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (remainingTicks === 0) {
      stopCountdown();
      onEndRef.current?.();
    }
  }, [remainingTicks, stopCountdown]);

  return { remainingTicks, startCountdown, stopCountdown };
}

export { useCountdown };
