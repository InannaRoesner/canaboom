import React, { createContext, useContext, useMemo, useState } from 'react';

type AttackPreparationContextValue = {
  soldierCapacity: number;
  boatCount: number;
  selectedUnitId: string;
  loadedUnitCount: number;
  prepared: boolean;
  setSoldierCapacity: (n: number) => void;
  setBoatCount: (n: number) => void;
  setSelectedUnitId: (id: string) => void;
  setPrepared: (value: boolean) => void;
};

const AttackPreparationContext = createContext<AttackPreparationContextValue | null>(null);

export function AttackPreparationProvider({ children }: { children: React.ReactNode }) {
  const [soldierCapacity, setSoldierCapacity] = useState(12);
  const [boatCount, setBoatCount] = useState(3);
  const [selectedUnitId, setSelectedUnitId] = useState('robot_01');
  const [prepared, setPrepared] = useState(false);

  const value = useMemo(
    () => ({
      soldierCapacity,
      boatCount,
      selectedUnitId,
      loadedUnitCount: soldierCapacity,
      prepared,
      setSoldierCapacity,
      setBoatCount,
      setSelectedUnitId,
      setPrepared,
    }),
    [boatCount, prepared, selectedUnitId, soldierCapacity],
  );

  return (
    <AttackPreparationContext.Provider value={value}>{children}</AttackPreparationContext.Provider>
  );
}

export function useAttackPreparation() {
  const ctx = useContext(AttackPreparationContext);
  if (!ctx) throw new Error('useAttackPreparation outside provider');
  return ctx;
}
