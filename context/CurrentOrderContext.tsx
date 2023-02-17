import { createContext, useContext, useState, ReactNode } from 'react'
import { Order } from '../types'

type CurrentOrderContext = {
  currentOrder: Order | null
  setCurrentOrder: (order: Order | null) => void
}

const CurrentOrderContext = createContext<CurrentOrderContext>({
  currentOrder: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentOrder: () => {}
})

export const CurrentOrderContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

  return (
    <CurrentOrderContext.Provider
      value={{
        currentOrder,
        setCurrentOrder
      }}>
      {children}
    </CurrentOrderContext.Provider>
  )
}

export const useCurrentOrderContext = () => {
  return useContext(CurrentOrderContext)
}
