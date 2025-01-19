import { useState, useEffect } from "react";

/**
 * Custom hook similar to useState, but initializes state only on the client side.
 * @param initialValue - Initial state value or function to generate the initial value.
 * @returns A tuple with the state and a function to update it.
 */
export function useClientState<T>(
  initialValue: T | (() => T)
): [T | undefined, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (state === undefined) {
      setState(
        initialValue instanceof Function ? initialValue() : initialValue
      );
    }
  }, []);

  return [state, setState as React.Dispatch<React.SetStateAction<T>>];
}
