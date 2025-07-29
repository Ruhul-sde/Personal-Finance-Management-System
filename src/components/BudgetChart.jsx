
import React from 'react'

const BudgetChart = ({ budgets, categorySpending }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Budget vs Spending</h3>
      <div className="space-y-4">
        {Object.entries(budgets).map(([category, budget]) => {
          const spent = categorySpending[category] || 0
          const percentage = Math.min((spent / budget.amount) * 100, 100)
          
          return (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-sm text-gray-600">
                  ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage >= 100 ? 'bg-red-500' : 
                    percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetChart
