import { useState, useCallback } from 'react';
import { GAME_CONFIG } from '../utils/constants';

// Shared wrong-attempt counter + hint trigger for lesson/game screens.
// The consumer calls `registerAttempt(wasCorrect)` on every answer; after
// `GAME_CONFIG.HINT_AFTER_ATTEMPTS` consecutive wrong tries the hook flips
// `showHint` on. `reset()` clears state between questions.
export default function useAttemptCounter() {
  const [wrongCount, setWrongCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const registerAttempt = useCallback((wasCorrect) => {
    if (wasCorrect) {
      setWrongCount(0);
      setShowHint(false);
      return;
    }
    setWrongCount((prev) => {
      const next = prev + 1;
      if (next >= GAME_CONFIG.HINT_AFTER_ATTEMPTS) setShowHint(true);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setWrongCount(0);
    setShowHint(false);
  }, []);

  return { wrongCount, showHint, registerAttempt, reset };
}
