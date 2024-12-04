"use client"
import React, {
  createContext,
  useState,
  ReactNode,
  FC,
  Dispatch,
  SetStateAction,
} from "react"

// Context Type
interface PlanTripContextType {
  pendingData: number
  setPendingData: Dispatch<SetStateAction<number>>
}

// Props for the Provider
interface PlanTripProviderProps {
  children: ReactNode
}

// Create Context
export const PlanTripContext = createContext<PlanTripContextType | null>(null)

// Context Provider Component
const PlanTripProvider: FC<PlanTripProviderProps> = ({ children }) => {
  const [pendingData, setPendingData] = useState<number>(0)

  return (
    <PlanTripContext.Provider value={{ pendingData, setPendingData }}>
      {children}
    </PlanTripContext.Provider>
  )
}

export default PlanTripProvider
