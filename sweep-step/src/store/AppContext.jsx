import { createContext, useState, useCallback } from 'react';
import { loadStore, saveStore } from './schema';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [store, setStoreState] = useState(() => loadStore());

  const setStore = useCallback((updater) => {
    setStoreState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveStore(next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ store, setStore }}>
      {children}
    </AppContext.Provider>
  );
}
