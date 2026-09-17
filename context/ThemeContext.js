import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_COLORS, LIGHT_COLORS } from '../constants/theme';

const PREFERENCE_KEY = 'themePreference'; // 'system' | 'light' | 'dark'

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [preference, setPreferenceState] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem(PREFERENCE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setPreferenceState(saved);
      }
    });
  }, []);

  const setPreference = useCallback((value) => {
    setPreferenceState(value);
    AsyncStorage.setItem(PREFERENCE_KEY, value);
  }, []);

  const scheme = preference === 'system' ? systemScheme ?? 'dark' : preference;
  const colors = scheme === 'light' ? LIGHT_COLORS : DARK_COLORS;

  return (
    <ThemeContext.Provider value={{ colors, scheme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
