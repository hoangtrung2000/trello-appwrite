import { useEffect } from "react";

const useDebounce = <T,>(value: T, setValue: (value: T) => void) => {
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(value);

      setValue(value);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [value, setValue]);
  return {
    value,
  };
};

export default useDebounce;
