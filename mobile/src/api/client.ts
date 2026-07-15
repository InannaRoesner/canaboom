import { API_URL } from '../constants/config';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export type AiLine = { speaker: string; line: string; source?: string; step?: number };
export type CombatResult = {
  damage: number;
  weapon: string;
  target_building: string;
  fire: { particles: ParticleData[]; burn_duration_ms: number; intensity: number };
};
export type ParticleData = {
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  life: number; size: number; color: string;
};
export type MatchResult = {
  opponent_name: string;
  opponent_power: number;
  player_power: number;
  fair_play: boolean;
  note: string;
};
export const api = {
  health: () => request<{ status: string; ai_engine: boolean }>('/health'),
  world: () => request<Record<string, unknown>>('/api/v1/world'),
  aiDialog: (trigger: string, context = '') =>
    request<AiLine>('/api/v1/ai/dialog', {
      method: 'POST',
      body: JSON.stringify({ trigger, context }),
    }),
  aiTutorial: (name = 'Commander') =>
    request<AiLine[]>(`/api/v1/ai/tutorial?player_name=${encodeURIComponent(name)}`),
  combatAttack: (weapon: string, building: string, x: number, z: number) =>
    request<CombatResult>('/api/v1/combat/attack', {
      method: 'POST',
      body: JSON.stringify({ weapon, target_building: building, target_x: x, target_z: z }),
    }),
  matchFind: () =>
    request<MatchResult>('/api/v1/matchmaking/find', {
      method: 'POST',
      body: JSON.stringify({ hq_level: 3, troop_count: 12, building_count: 5, planet_id: 'earth' }),
    }),
};
