'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface SidebarContextType {
    isOpen: boolean
    toggle: () => void
    isHydrated: boolean
}

const SIDEBAR_STATE_KEY = 'untangle-sidebar-state'
const MOBILE_BREAKPOINT = 1024 // lg breakpoint

export const SidebarContext = createContext<SidebarContextType>({
    isOpen: true,
    isHydrated: false,
    toggle: () => { },
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true)
    const [isHydrated, setIsHydrated] = useState(false)

    // Handle initial hydration
    useEffect(() => {
        const savedState = localStorage.getItem(SIDEBAR_STATE_KEY)
        if (savedState !== null) {
            setIsOpen(JSON.parse(savedState))
        }
        setIsHydrated(true)

        // Handle initial mobile state
        if (window.innerWidth < MOBILE_BREAKPOINT) {
            setIsOpen(false)
        }

        // Handle window resize
        const handleResize = () => {
            if (window.innerWidth < MOBILE_BREAKPOINT) {
                setIsOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Persist state changes to localStorage
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isOpen))
        }
    }, [isOpen, isHydrated])

    const toggle = () => {
        console.log("toggle clicked, current isOpen:", isOpen)
        setIsOpen(prev => {
            const newValue = !prev
            console.log("setting isOpen to:", newValue)
            return newValue
        })
    }

    // Only render children when hydrated to prevent hydration mismatch
    if (!isHydrated) {
        return null
    }

    return (
        <SidebarContext.Provider value={{ isOpen: Boolean(isOpen), isHydrated, toggle }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}