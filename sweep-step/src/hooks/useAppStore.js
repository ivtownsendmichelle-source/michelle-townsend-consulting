import { useContext } from 'react';
import { AppContext } from '../store/AppContext';

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
