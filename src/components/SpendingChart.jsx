
import React from 'react'

const SpendingChart = ({ categorySpending }) => {
  const maxAmount = Math.max(...Object.values(categorySpending))

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
      <div className="space-y-3">
        {Object.entries(categorySpending).map(([category, amount]) => (
          <div key={category} className="flex items-center gap-4">
            <span className="w-24 text-sm font-medium text-gray-700">{category}</span>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${(amount / maxAmount) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600 w-20 text-right">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpendingChart
