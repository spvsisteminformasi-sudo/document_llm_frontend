'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ConfigContextType {
    config: {
        hideFooter?: boolean
    }
    setConfig: (config: any) => void
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState({})

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfig = () => {
    const context = useContext(ConfigContext)
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider')
    }
    return context
}
