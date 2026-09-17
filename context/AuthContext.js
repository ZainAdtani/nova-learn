import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// undefined = still checking, null = signed out (guest), object = signed in
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const isLoading = session === undefined;

  return (
    <AuthContext.Provider value={{ session: isLoading ? null : session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
