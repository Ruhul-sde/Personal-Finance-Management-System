
import React, { useState } from 'react'
import { useFinance } from '../App'

const Reports = () => {
  const { transactions, budgets } = useFinance()
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  const generateInsights = () => {
    const insights = []
    
    // Spending pattern analysis
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyExpenses = transactions
      .filter(t => {
        const date = new Date(t.date)
        return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const avgDailySpending = monthlyExpenses / new Date().getDate()
    
    insights.push({
      type: 'spending',
      icon: '📊',
      title: 'Daily Spending Average',
      value: `$${avgDailySpending.toFixed(2)}`,
      description: 'Your average daily spending this month'
    })

    // Top spending category
    const categoryTotals = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      })

    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
    if (topCategory) {
      insights.push({
        type: 'category',
        icon: '🏆',
        title: 'Top Spending Category',
        value: topCategory[0],
        description: `$${topCategory[1].toFixed(2)} total spent`
      })
    }

    // Savings rate
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const savingsRate = totalIncome > 0 ? ((totalIncome - monthlyExpenses) / totalIncome) * 100 : 0
    
    insights.push({
      type: 'savings',
      icon: '💡',
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      description: savingsRate >= 20 ? 'Great job! You\'re saving well' : 'Consider reducing expenses'
    })

    return insights
  }

  const getMonthlyTrend = () => {
    const monthlyData = {}
    
    transactions.forEach(t => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 }
      }
      
      if (t.type === 'income') {
        monthlyData[monthKey].income += t.amount
      } else {
        monthlyData[monthKey].expenses += t.amount
      }
    })
    
    return Object.entries(monthlyData)
      .sort()
      .slice(-6)
      .map(([month, data]) => ({
        month: new Date(month.split('-')[0], month.split('-')[1]).toLocaleDateString('en-US', { month: 'short' }),
        ...data,
        net: data.income - data.expenses
      }))
  }

  const insights = generateInsights()
  const monthlyTrend = getMonthlyTrend()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Financial Reports
        </h1>
        <div className="flex space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
          >
            <option value="monthly">📅 Monthly</option>
            <option value="quarterly">📊 Quarterly</option>
            <option value="yearly">🗓️ Yearly</option>
          </select>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div 
            key={insight.title}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:scale-105 transform transition-all duration-300"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">{insight.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{insight.title}</h3>
              <p className="text-3xl font-bold text-purple-600 mb-2">{insight.value}</p>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">📈</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">6-Month Trend</h2>
          </div>
        </div>
        <div className="p-6">
          {monthlyTrend.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm">Add some transactions to see your trends</p>
            </div>
          ) : (
            <div className="space-y-6">
              {monthlyTrend.map((month, index) => {
                const maxAmount = Math.max(...monthlyTrend.map(m => Math.max(m.income, m.expenses)))
                return (
                  <div key={month.month} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-16 text-sm font-bold text-gray-700">{month.month}</div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                          <span className="text-gray-600 font-medium">Income: ${month.income.toFixed(0)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600 font-medium">Expenses: ${month.expenses.toFixed(0)}</span>
                        </div>
                        <div className={`font-bold text-lg ${month.net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {month.net >= 0 ? '+' : ''}${month.net.toFixed(0)}
                        </div>
                      </div>
                    </div>
                    <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl transition-all duration-1000 ease-out opacity-80"
                        style={{ width: `${(month.income / maxAmount) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute bottom-0 left-0 h-full bg-gradient-to-r from-red-400 to-red-600 rounded-xl transition-all duration-1000 ease-out opacity-80"
                        style={{ width: `${(month.expenses / maxAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">🏷️</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Category Breakdown</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(
                transactions
                  .filter(t => t.type === 'expense')
                  .reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + t.amount
                    return acc
                  }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, amount]) => {
                  const total = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0)
                  const percentage = total > 0 ? (amount / total) * 100 : 0
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-700">{category}</span>
                        <span className="text-sm text-gray-600 font-medium">
                          ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                        </span>
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
              {Object.keys(transactions.filter(t => t.type === 'expense')).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">No expenses recorded</p>
                  <p className="text-sm">Add some transactions to see your breakdown</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Budget Performance</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(budgets).map(([category, budget]) => {
                const spent = transactions
                  .filter(t => {
                    const date = new Date(t.date)
                    return t.type === 'expense' && 
                           t.category === category && 
                           date.getMonth() === new Date().getMonth()
                  })
                  .reduce((sum, t) => sum + t.amount, 0)
                
                const percentage = (spent / budget.amount) * 100
                
                return (
                  <div key={category} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700">{category}</span>
                      <span className={`text-sm font-bold ${
                        percentage > 100 ? 'text-red-600' : percentage > 80 ? 'text-yellow-600' : 'text-emerald-600'
                      }`}>
                        ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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
                )
              })}
              {Object.keys(budgets).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-medium">No budgets set</p>
                  <p className="text-sm">Set some budgets to track your performance</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
