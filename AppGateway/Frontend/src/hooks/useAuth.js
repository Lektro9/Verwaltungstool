import { createContext } from 'react'

const AuthObj = {
    accessToken: "",
    setAccessToken: () => { }
}

export const useAuth = createContext(AuthObj);
