import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export const AuthProvider = (props) => {

    const setIsAuthenticated = (isAuthenticated) => {
        setState({ ...state, isAuthenticated: isAuthenticated })
    }

    const initState = {
        isAuthenticated: false,
        setIsAuthenticated: setIsAuthenticated
    }

    const [state, setState] = useState(initState)

    return (
        <useAuth.Provider value={state}>
            {props.children}
        </useAuth.Provider>
    )
}