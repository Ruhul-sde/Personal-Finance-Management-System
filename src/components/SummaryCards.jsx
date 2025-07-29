import { useEffect, useState } from 'react'

const SummaryCards = ({ totalIncome, totalExpenses, netIncome }) => {
  const [animatedValues, setAnimatedValues] = useState({
    income: 0,
    expenses: 0,
    net: 0
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        income: totalIncome,
        expenses: totalExpenses,
        net: netIncome
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [totalIncome, totalExpenses, netIncome])

  const cards = [
    {
      title: 'Total Income',
      value: animatedValues.income,
      icon: '💰',
      bgGradient: 'from-emerald-50 to-teal-50',
      gradient: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-700',
      trend: '📈'
    },
    {
      title: 'Total Expenses',
      value: animatedValues.expenses,
      icon: '💸',
      bgGradient: 'from-red-50 to-pink-50',
      gradient: 'from-red-500 to-pink-600',
      textColor: 'text-red-700',
      trend: '📊'
    },
    {
      title: 'Net Income',
      value: animatedValues.net,
      icon: netIncome >= 0 ? '📊' : '📉',
      bgGradient: netIncome >= 0 ? 'from-blue-50 to-indigo-50' : 'from-orange-50 to-red-50',
      gradient: netIncome >= 0 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600',
      textColor: netIncome >= 0 ? 'text-blue-700' : 'text-red-700',
      trend: netIncome >= 0 ? '📈' : '📉'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div 
          key={card.title}
          className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 border border-white/50`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wide">{card.title}</h3>
                  <p className={`text-3xl font-bold ${card.textColor} mt-1`}>
                    ${Math.abs(card.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-1 text-sm font-semibold ${card.textColor}`}>
                  <span>{card.trend}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">This Month</span>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                card.title === 'Net Income' 
                  ? (netIncome >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800')
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {card.title === 'Net Income' && netIncome >= 0 ? '+ Profit' : ''}
                {card.title === 'Net Income' && netIncome < 0 ? '- Loss' : ''}
                {card.title !== 'Net Income' ? 'Active' : ''}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards