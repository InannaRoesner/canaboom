/**
 * Audio-Asset-Manifest für CanaBoom.
 * Dateien liegen unter assets/audio/ — siehe README dort.
 * Setze AUDIO_ASSETS_READY auf true, sobald die MP3-Dateien vorliegen.
 */
export const AUDIO_ASSETS_READY = false;

export type SoundKey =
  | 'rocketLaunch'
  | 'spaceMusic'
  | 'combatDiamondHit'
  | 'combatExplosion'
  | 'tutorialAlienBlip'
  | 'npcGiftCollect';

export type SoundSpec = {
  key: SoundKey;
  filename: string;
  loop?: boolean;
  volume: number;
};

export const SOUND_SPECS: Record<SoundKey, SoundSpec> = {
  rocketLaunch: { key: 'rocketLaunch', filename: 'rocket_launch.mp3', volume: 0.9 },
  spaceMusic: { key: 'spaceMusic', filename: 'space_ambient_loop.mp3', loop: true, volume: 0.45 },
  combatDiamondHit: { key: 'combatDiamondHit', filename: 'combat_diamond_hit.mp3', volume: 0.75 },
  combatExplosion: { key: 'combatExplosion', filename: 'combat_explosion.mp3', volume: 0.8 },
  tutorialAlienBlip: { key: 'tutorialAlienBlip', filename: 'tutorial_alien_blip.mp3', volume: 0.7 },
  npcGiftCollect: { key: 'npcGiftCollect', filename: 'npc_gift_collect.mp3', volume: 0.85 },
};

/** Optional: require()-Map — aktivieren wenn AUDIO_ASSETS_READY === true */
export function getSoundModule(_key: SoundKey): number | null {
  if (!AUDIO_ASSETS_READY) return null;
  // Beispiel nach Asset-Import:
  // return { rocketLaunch: require('../../assets/audio/rocket_launch.mp3'), ... }[key];
  return null;
}
