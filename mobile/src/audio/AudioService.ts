import { Audio, AVPlaybackStatus } from 'expo-av';
import { getSoundModule, SOUND_SPECS, type SoundKey } from './sounds';

let configured = false;

async function ensureAudioMode() {
  if (configured) return;
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });
  configured = true;
}

class AudioService {
  private sounds = new Map<SoundKey, Audio.Sound>();
  private musicKey: SoundKey | null = null;

  async play(key: SoundKey): Promise<void> {
    await ensureAudioMode();
    const spec = SOUND_SPECS[key];
    const moduleId = getSoundModule(key);
    if (moduleId == null) {
      if (__DEV__) {
        console.info(`[Audio] Platzhalter — fehlende Datei: ${spec.filename}`);
      }
      return;
    }

    try {
      const existing = this.sounds.get(key);
      if (existing) {
        await existing.replayAsync();
        return;
      }
      const { sound } = await Audio.Sound.createAsync(moduleId, {
        volume: spec.volume,
        isLooping: !!spec.loop,
      });
      this.sounds.set(key, sound);
      if (spec.loop) this.musicKey = key;
      await sound.playAsync();
    } catch (e) {
      if (__DEV__) console.warn(`[Audio] ${key}:`, e);
    }
  }

  async playCombat(): Promise<void> {
    await this.play('combatDiamondHit');
    setTimeout(() => void this.play('combatExplosion'), 120);
  }

  async stopMusic(): Promise<void> {
    if (!this.musicKey) return;
    const sound = this.sounds.get(this.musicKey);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      this.sounds.delete(this.musicKey);
    }
    this.musicKey = null;
  }

  async unloadAll(): Promise<void> {
    for (const [, sound] of this.sounds) {
      try {
        await sound.unloadAsync();
      } catch {
        /* ignore */
      }
    }
    this.sounds.clear();
    this.musicKey = null;
  }
}

export const audioService = new AudioService();

export type { AVPlaybackStatus };
