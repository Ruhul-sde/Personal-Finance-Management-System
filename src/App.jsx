import { useState, useEffect, createContext, useContext } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Goals from './pages/Goals'
import Reports from './pages/Reports'

const FinanceContext = createContext()

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState({})
  const [goals, setGoals] = useState([])
  const [currentView, setCurrentView] = useState('dashboard')
  const [alerts, setAlerts] = useState([])

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTransactions = localStorage.getItem('transactions')
        const savedBudgets = localStorage.getItem('budgets')
        const savedGoals = localStorage.getItem('goals')

        if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
        if (savedBudgets) setBudgets(JSON.parse(savedBudgets))
        if (savedGoals) setGoals(JSON.parse(savedGoals))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  const contextValue = {
    transactions,
    setTransactions,
    budgets,
    setBudgets,
    goals,
    setGoals,
    alerts,
    setAlerts,
    currentView,
    setCurrentView
  }

  const renderCurrentView = () => {
    const views = {
      dashboard: Dashboard,
      transactions: Transactions,
      budgets: Budgets,
      goals: Goals,
      reports: Reports
    }

    const Component = views[currentView]
    return Component ? <Component /> : null
  }

  return (
    <FinanceContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Layout>
          {renderCurrentView()}
        </Layout>
      </div>
    </FinanceContext.Provider>
  )
}