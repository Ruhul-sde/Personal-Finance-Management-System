
import { useFinance } from '../App'
import SummaryCards from '../components/SummaryCards'
import { useEffect, useState } from 'react'

const Dashboard = () => {
  const { transactions, budgets, goals, alerts } = useFinance()
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    categorySpending: {},
    recentTransactions: []
  })

  useEffect(() => {
    const calculateData = () => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear
      })

      const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const totalExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const categorySpending = {}
      monthlyTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
        })

      const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

      setDashboardData({
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        categorySpending,
        recentTransactions
      })
    }

    calculateData()
  }, [transactions])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
            <p className="text-purple-100 text-lg">Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-6xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards 
        totalIncome={dashboardData.totalIncome}
        totalExpenses={dashboardData.totalExpenses}
        netIncome={dashboardData.netIncome}
      />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-400 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <h3 className="text-lg font-semibold text-orange-800">Budget Alerts</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <p key={index} className="text-orange-700 bg-white/50 rounded-lg p-3">
                {alert}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Spending */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Category Spending</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(dashboardData.categorySpending).map(([category, amount]) => {
              const percentage = (amount / dashboardData.totalExpenses) * 100 || 0
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{category}</span>
                    <span className="font-bold text-gray-900">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
            {Object.keys(dashboardData.categorySpending).length === 0 && (
              <p className="text-gray-500 text-center py-8">No expenses recorded this month</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">💳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Recent Transactions</h3>
          </div>
          <div className="space-y-3">
            {dashboardData.recentTransactions.map((transaction, index) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description || transaction.category}</p>
                    <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-bold ${
                  transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
            {dashboardData.recentTransactions.length === 0 && (
              <p className="text-gray-500 text-center py-8">No transactions recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Goals Progress */}
      {goals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Goals Progress</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.slice(0, 3).map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              return (
                <div key={goal.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="font-semibold text-gray-800 mb-2">{goal.name}</h4>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-orange-600">
                      ${goal.currentAmount.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-600">
                      / ${goal.targetAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{progress.toFixed(1)}% complete</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
