
import React, { useState } from 'react'
import { useFinance } from '../App'

const Goals = () => {
  const { goals, setGoals } = useFinance()
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
  })

  const addGoal = (e) => {
    e.preventDefault()
    if (newGoal.name && newGoal.targetAmount) {
      const goal = {
        id: Date.now().toString(),
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0
      }
      setGoals(prev => [...prev, goal])
      setNewGoal({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: ''
      })
    }
  }

  const updateGoalProgress = (goalId, amount) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: parseFloat(amount) || 0 }
        : goal
    ))
  }

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Financial Goals
        </h1>
      </div>

      {/* Add Goal Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create New Goal</h2>
        </div>
        <form onSubmit={addGoal} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <input
            type="text"
            placeholder="Goal Name"
            value={newGoal.name}
            onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
            required
          />
          
          <input
            type="number"
            step="0.01"
            placeholder="Target Amount"
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
            required
          />
          
          <input
            type="number"
            step="0.01"
            placeholder="Current Amount"
            value={newGoal.currentAmount}
            onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
          />
          
          <input
            type="date"
            placeholder="Deadline"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
          />
          
          <button 
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Add Goal
          </button>
        </form>
      </div>

      {/* Goals List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Goals</h2>
          </div>
        </div>
        
        {goals.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <div className="text-8xl mb-6">🎯</div>
            <p className="text-xl font-semibold mb-2">No goals set yet</p>
            <p className="text-gray-400">Create your first financial goal above to start tracking your progress</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {goals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100
              const isCompleted = progress >= 100
              const daysUntilDeadline = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
              
              return (
                <div key={goal.id} className={`bg-gradient-to-br rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                  isCompleted 
                    ? 'from-emerald-50 to-teal-50 border-emerald-200' 
                    : 'from-orange-50 to-yellow-50 border-orange-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{goal.name}</h3>
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-3xl font-bold text-orange-600">
                        ${goal.currentAmount.toFixed(2)}
                      </span>
                      <span className="text-lg text-gray-600 font-medium">
                        / ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className={`text-sm font-bold ${isCompleted ? 'text-emerald-600' : 'text-orange-600'}`}>
                          {progress.toFixed(1)}% {isCompleted && '🎉'}
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-600' 
                              : 'bg-gradient-to-r from-orange-400 to-yellow-600'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {goal.deadline && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Deadline:</span>
                        <span className={`text-sm font-medium ${
                          daysUntilDeadline < 0 ? 'text-red-600' : 
                          daysUntilDeadline < 30 ? 'text-orange-600' : 'text-gray-700'
                        }`}>
                          {new Date(goal.deadline).toLocaleDateString()}
                          {daysUntilDeadline !== null && (
                            <span className="ml-1">
                              ({daysUntilDeadline < 0 ? 'Overdue' : `${daysUntilDeadline} days left`})
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Update Progress
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          step="0.01"
                          value={goal.currentAmount}
                          onChange={(e) => updateGoalProgress(goal.id, e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                        />
                        <div className="flex items-center px-2 text-sm text-gray-500">
                          / ${goal.targetAmount.toFixed(2)}
                        </div>
                      </div>
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

export default Goals
