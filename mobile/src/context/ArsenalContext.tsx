import React, { createContext, useContext, useMemo, useState } from 'react';

type ArsenalContextValue = {
  level: number;
  setLevel: (n: number) => void;
};

const ArsenalContext = createContext<ArsenalContextValue | null>(null);

export function ArsenalProvider({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState(1);
  const value = useMemo(() => ({ level, setLevel }), [level]);
  return <ArsenalContext.Provider value={value}>{children}</ArsenalContext.Provider>;
}

export function useArsenal() {
  const ctx = useContext(ArsenalContext);
  if (!ctx) throw new Error('useArsenal outside provider');
  return ctx;
}
