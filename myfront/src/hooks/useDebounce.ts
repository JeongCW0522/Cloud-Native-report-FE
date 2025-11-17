import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounceValue(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  // 잠시 기다린 후에 값을 반환
  return debouncedValue;
}

export default useDebounce;
