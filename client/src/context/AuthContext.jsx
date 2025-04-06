import { createContext } from 'react';

// Alap authentikációs kontextus
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});
