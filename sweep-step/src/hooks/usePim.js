import { useMemo, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { calcPimStage } from '../utils/pimStage';
import { getPimTapMessage, getDustLevel } from '../data/pimMessages';
import { daysSince } from '../utils/dates';

export function usePim() {
  const { store, setStore } = useAppStore();
  const stage = useMemo(() => calcPimStage(store.inventories), [store.inventories]);
  const daysSinceAction = useMemo(() => {
    if (!store.pim.lastInteraction) return 0;
    return daysSince(store.pim.lastInteraction);
  }, [store.pim.lastInteraction]);
  const dustLevel = useMemo(() => getDustLevel(daysSinceAction), [daysSinceAction]);
  const tapMessage = useMemo(() => getPimTapMessage(daysSinceAction), [daysSinceAction]);
  const recordAction = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setStore((prev) => ({
      ...prev,
      pim: { ...prev.pim, stage, lastInteraction: today, dustLevel: 0 },
    }));
  }, [setStore, stage]);
  return { stage, dustLevel, tapMessage, recordAction };
}
