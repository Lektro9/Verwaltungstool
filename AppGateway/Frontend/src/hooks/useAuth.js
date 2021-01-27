import { createContext } from 'react'

const AuthObj = {
    isAuthenticated: false,
    setIsAuthenticated: () => { }
}

export const useAuth = createContext(AuthObj);
