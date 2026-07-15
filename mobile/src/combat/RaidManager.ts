import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ResourceBundle } from '../types/resources';

export type RaidStatus = 'active' | 'won' | 'lost';

export type RaidState = {
  status: RaidStatus;
  hqHp: number;
  hqMaxHp: number;
};

export type RaidRewards = {
  resources: Pick<ResourceBundle, 'gold' | 'wood' | 'stone'>;
  victoryPoints: number;
  galaxyMapIntel: number;
};

type DeployedUnit = { id: string; hp: number; maxHp: number };

export class RaidManager {
  private state: RaidState;
  private units: DeployedUnit[];

  constructor(
    private enemyHqLevel: number,
    private rewards: RaidRewards,
    private deployment: { unitId: string; count: number; arsenalLevel: number },
  ) {
    const hqMax = 1200 + enemyHqLevel * 400;
    this.state = { status: 'active', hqHp: hqMax, hqMaxHp: hqMax };
    this.units = Array.from({ length: deployment.count }, (_, i) => ({
      id: `${deployment.unitId}-${i}`,
      hp: 150 + deployment.arsenalLevel * 20,
      maxHp: 150 + deployment.arsenalLevel * 20,
    }));
  }

  getState(): RaidState {
    return this.state;
  }

  getUnits(): DeployedUnit[] {
    return this.units;
  }

  getMovementSpeed(): number {
    return 1 + this.deployment.arsenalLevel * 0.1;
  }

  getTroopDamage(scale: number, target: 'hq' | 'defense'): number {
    const base = target === 'defense' ? 85 : 110;
    return Math.round(base * scale * (1 + this.deployment.arsenalLevel * 0.08));
  }

  damageHq(amount: number): RaidState {
    const hqHp = Math.max(0, this.state.hqHp - amount);
    this.state = {
      ...this.state,
      hqHp,
      status: hqHp <= 0 ? 'won' : 'active',
    };
    return this.state;
  }

  damageUnits(amount: number): number {
    this.units = this.units.map((u) => ({ ...u, hp: Math.max(0, u.hp - amount) }));
    const total = this.units.reduce((s, u) => s + u.maxHp, 0);
    const current = this.units.reduce((s, u) => s + u.hp, 0);
    return total === 0 ? 0 : Math.round((current / total) * 100);
  }

  healUnits(percent: number): number {
    this.units = this.units.map((u) => ({
      ...u,
      hp: Math.min(u.maxHp, u.hp + Math.round(u.maxHp * (percent / 100))),
    }));
    const total = this.units.reduce((s, u) => s + u.maxHp, 0);
    const current = this.units.reduce((s, u) => s + u.hp, 0);
    return total === 0 ? 0 : Math.round((current / total) * 100);
  }

  lose(): RaidState {
    this.state = { ...this.state, status: 'lost' };
    return this.state;
  }
}

const VICTORY_KEY = 'canaboom_raid_victories';

export async function storeRaidVictory(rewards: RaidRewards): Promise<void> {
  const raw = (await AsyncStorage.getItem(VICTORY_KEY)) ?? '0';
  const count = Number.parseInt(raw, 10) + 1;
  await AsyncStorage.setItem(VICTORY_KEY, String(count));
  await AsyncStorage.setItem(`${VICTORY_KEY}_last`, JSON.stringify(rewards));
}
