import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_RESOURCES, type ResourceBundle } from '../types/resources';

export type PlayerResources = ResourceBundle;

type ResourceContextValue = {
  resources: ResourceBundle;
  /** Legacy alias used by PlanetMapScreen */
  spend: (cost: Partial<ResourceBundle>) => boolean;
  addResources: (delta: Partial<ResourceBundle>) => void;
  spendResources: (cost: Partial<ResourceBundle>) => boolean;
  canAfford: (cost: Partial<ResourceBundle>) => boolean;
};

const STORAGE_KEY = 'canaboom_resources_v1';
const ResourceContext = createContext<ResourceContextValue | null>(null);

export function ResourceProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<ResourceBundle>(DEFAULT_RESOURCES);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setResources(JSON.parse(raw) as ResourceBundle);
    });
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  }, [resources]);

  const addResources = useCallback((delta: Partial<ResourceBundle>) => {
    setResources((prev) => ({
      gold: prev.gold + (delta.gold ?? 0),
      wood: prev.wood + (delta.wood ?? 0),
      stone: prev.stone + (delta.stone ?? 0),
      diamonds: prev.diamonds + (delta.diamonds ?? 0),
    }));
  }, []);

  const canAfford = useCallback(
    (cost: Partial<ResourceBundle>) =>
      (cost.gold ?? 0) <= resources.gold &&
      (cost.wood ?? 0) <= resources.wood &&
      (cost.stone ?? 0) <= resources.stone &&
      (cost.diamonds ?? 0) <= resources.diamonds,
    [resources],
  );

  const spendResources = useCallback(
    (cost: Partial<ResourceBundle>) => {
      if (!canAfford(cost)) return false;
      setResources((prev) => ({
        gold: prev.gold - (cost.gold ?? 0),
        wood: prev.wood - (cost.wood ?? 0),
        stone: prev.stone - (cost.stone ?? 0),
        diamonds: prev.diamonds - (cost.diamonds ?? 0),
      }));
      return true;
    },
    [canAfford],
  );

  const value = useMemo(
    () => ({
      resources,
      spend: spendResources,
      addResources,
      spendResources,
      canAfford,
    }),
    [addResources, canAfford, resources, spendResources],
  );

  return <ResourceContext.Provider value={value}>{children}</ResourceContext.Provider>;
}

export function useResources() {
  const ctx = useContext(ResourceContext);
  if (!ctx) throw new Error('useResources outside provider');
  return ctx;
}
