"use client"
import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from '../utils/db/authUser';

const authUserContext = createContext({
  authUser: null,
  loading: true,
});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);