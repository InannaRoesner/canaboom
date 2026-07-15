export function useCombatAudio() {
  return {
    playCombat: () => {},
    playLaunch: () => {},
    playVictory: () => {},
  };
}

export function useHomeAudio() {
  return {
    playAmbient: () => {},
    playLaunch: () => {},
  };
}

export function useTutorialAudio() {
  return { playDialogue: () => {}, playBlip: () => {} };
}
