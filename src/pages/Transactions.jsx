
import React, { useState } from 'react'
import { useFinance } from '../App'

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Other Income'],
  expense: ['Food', 'Transportation', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Utilities', 'Other']
}

const Transactions = () => {
  const { transactions, setTransactions } = useFinance()
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const addTransaction = (e) => {
    e.preventDefault()
    if (newTransaction.amount && newTransaction.category) {
      const transaction = {
        id: Date.now().toString(),
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      }
      setTransactions(prev => [...prev, transaction])
      setNewTransaction({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }

  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || t.type === filterType
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory
      return matchesSearch && matchesType && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'date':
        default:
          comparison = new Date(a.date) - new Date(b.date)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const getCategoryIcon = (category) => {
    const icons = {
      'Salary': '💼', 'Freelance': '🎯', 'Investment': '📈', 'Other Income': '💰',
      'Food': '🍽️', 'Transportation': '🚗', 'Housing': '🏠', 'Entertainment': '🎬',
      'Healthcare': '🏥', 'Shopping': '🛍️', 'Utilities': '⚡', 'Other': '📦'
    }
    return icons[category] || '💳'
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Transactions
        </h1>
        <div className="bg-white rounded-xl px-4 py-2 shadow-lg border border-gray-200">
          <span className="text-sm text-gray-500 font-medium">
            {filteredTransactions.length} of {transactions.length} transactions
          </span>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">+</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Transaction</h2>
        </div>
        <form onSubmit={addTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <select
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value, category: ''})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
            required
          >
            <option value="expense">💸 Expense</option>
            <option value="income">💰 Income</option>
          </select>
          
          <input
            type="number"
            step="0.01"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
            required
          />
          
          <select
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES[newTransaction.type].map(category => (
              <option key={category} value={category}>
                {getCategoryIcon(category)} {category}
              </option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
          />
          
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
            required
          />
          
          <button 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Add Transaction
          </button>
        </form>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="🔍 Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
          >
            <option value="all">All Types</option>
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expenses</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
          >
            <option value="all">All Categories</option>
            {[...CATEGORIES.income, ...CATEGORIES.expense].map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">📋</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-16 text-center text-gray-500">
              <div className="text-8xl mb-6">📭</div>
              <p className="text-xl font-semibold mb-2">No transactions found</p>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="p-6 hover:bg-gray-50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 ${
                      transaction.type === 'income' 
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200' 
                        : 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200'
                    }`}>
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-bold text-gray-800 text-lg">{transaction.category}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold uppercase tracking-wide ${
                          transaction.type === 'income' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500 font-medium">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-3xl font-bold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Transactions
