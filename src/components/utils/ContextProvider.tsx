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

interface RequestsMailsType {
  pendingQuoteData: number
  pendingCustomizeData: number
  setPendingQuoteData: Dispatch<SetStateAction<number>>
  setPendingCustomizeData: Dispatch<SetStateAction<number>>
}

// Props for the Provider
interface PlanTripProviderProps {
  children: ReactNode
}

// Create Context
export const PlanTripContext = createContext<PlanTripContextType | null>(null)
export const RequestsMailsContext = createContext<RequestsMailsType | null>(
  null
)

// first context
const PlanTripProvider: FC<PlanTripProviderProps> = ({ children }) => {
  const [pendingData, setPendingData] = useState<number>(0)

  return (
    <PlanTripContext.Provider value={{ pendingData, setPendingData }}>
      {children}
    </PlanTripContext.Provider>
  )
}

//second context
const RequestsMailsProvider: FC<PlanTripProviderProps> = ({ children }) => {
  const [pendingQuoteData, setPendingQuoteData] = useState<number>(0)
  const [pendingCustomizeData, setPendingCustomizeData] = useState<number>(0)

  return (
    <RequestsMailsContext.Provider
      value={{
        pendingQuoteData,
        pendingCustomizeData,
        setPendingQuoteData,
        setPendingCustomizeData,
      }}
    >
      {children}
    </RequestsMailsContext.Provider>
  )
}
export { PlanTripProvider, RequestsMailsProvider }
