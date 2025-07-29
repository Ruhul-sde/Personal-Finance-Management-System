
import React from 'react'

const GoalsSection = ({ goals }) => {
  if (goals.length === 0) return null

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">Financial Goals Progress</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map(goal => {
          const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
          return (
            <div key={goal.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-600">
              <h4 className="font-semibold text-gray-800 mb-2">{goal.name}</h4>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  ${goal.currentAmount} / ${goal.targetAmount}
                </div>
                {goal.deadline && (
                  <p className="text-xs text-gray-500">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GoalsSection
