
import React, { useState, useEffect } from 'react'
import { useFinance } from '../App'

const CATEGORIES = {
  expense: ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Other']
}

const Budgets = () => {
  const { budgets, setBudgets, transactions } = useFinance()
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  })
  const [categorySpending, setCategorySpending] = useState({})

  useEffect(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const spending = {}
    transactions
      .filter(t => {
        const transactionDate = new Date(t.date)
        return t.type === 'expense' && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear
      })
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount
      })

    setCategorySpending(spending)
  }, [transactions])

  const addBudget = (e) => {
    e.preventDefault()
    if (newBudget.category && newBudget.amount) {
      setBudgets(prev => ({
        ...prev,
        [newBudget.category]: {
          amount: parseFloat(newBudget.amount),
          period: newBudget.period
        }
      }))
      setNewBudget({
        category: '',
        amount: '',
        period: 'monthly'
      })
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍽️', 'Transportation': '🚗', 'Housing': '🏠', 'Entertainment': '🎬',
      'Healthcare': '🏥', 'Shopping': '🛍️', 'Utilities': '⚡', 'Other': '📦'
    }
    return icons[category] || '💳'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Budget Management
        </h1>
      </div>

      {/* Set Budget Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">🎯</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Set New Budget</h2>
        </div>
        <form onSubmit={addBudget} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <select
            value={newBudget.category}
            onChange={(e) => setNewBudget({...newBudget, category: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.expense.map(cat => (
              <option key={cat} value={cat}>
                {getCategoryIcon(cat)} {cat}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            step="0.01"
            placeholder="Budget Amount"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({...newBudget, amount: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
            required
          />
          
          <select
            value={newBudget.period}
            onChange={(e) => setNewBudget({...newBudget, period: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
          >
            <option value="monthly">📅 Monthly</option>
            <option value="yearly">🗓️ Yearly</option>
          </select>
          
          <button 
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Set Budget
          </button>
        </form>
      </div>

      {/* Current Budgets */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Current Budgets</h2>
          </div>
        </div>
        
        {Object.keys(budgets).length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <div className="text-8xl mb-6">🎯</div>
            <p className="text-xl font-semibold mb-2">No budgets set yet</p>
            <p className="text-gray-400">Create your first budget above to start tracking your spending</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {Object.entries(budgets).map(([category, budget]) => {
              const spent = categorySpending[category] || 0
              const remaining = budget.amount - spent
              const percentage = (spent / budget.amount) * 100
              
              return (
                <div key={category} className="p-6 hover:bg-gray-50 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl border-2 border-purple-200">
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{category}</h3>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{budget.period} budget</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ${remaining.toFixed(2)} left
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-gray-600 text-sm font-medium">Budget Amount</span>
                      <p className="text-lg font-bold text-gray-800">${budget.amount.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-gray-600 text-sm font-medium">Amount Spent</span>
                      <p className="text-lg font-bold text-gray-800">${spent.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <span className="text-gray-600 text-sm font-medium">Percentage Used</span>
                      <p className={`text-lg font-bold ${
                        percentage > 100 ? 'text-red-600' : percentage > 80 ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Progress</span>
                      <span className={`text-sm font-semibold ${
                        percentage > 100 ? 'text-red-600' : percentage > 80 ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                        {percentage > 100 ? `${(percentage - 100).toFixed(1)}% over budget` : `${(100 - percentage).toFixed(1)}% remaining`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          percentage > 100 ? 'bg-gradient-to-r from-red-400 to-red-600' :
                          percentage > 80 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                          'bg-gradient-to-r from-emerald-400 to-emerald-600'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Budgets
