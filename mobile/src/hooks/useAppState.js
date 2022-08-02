import { useEffect } from 'react';
import { AppState } from 'react-native';

export function useAppState(onChange) {
  useEffect(() => {
    const listener = AppState.addEventListener('change', onChange);
    return () => {
      return listener.remove();
    };
  }, [onChange]);
}
