
import { useFinance } from '../App'

const Layout = ({ children }) => {
  const { currentView, setCurrentView } = useFinance()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'from-blue-500 to-indigo-600' },
    { id: 'transactions', label: 'Transactions', icon: '💳', color: 'from-emerald-500 to-teal-600' },
    { id: 'budgets', label: 'Budgets', icon: '🎯', color: 'from-purple-500 to-violet-600' },
    { id: 'goals', label: 'Goals', icon: '🚀', color: 'from-orange-500 to-red-600' },
    { id: 'reports', label: 'Reports', icon: '📈', color: 'from-pink-500 to-rose-600' }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">💰</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">FinanceHub</h1>
              <p className="text-sm text-gray-500">Personal Finance Manager</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                currentView === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {currentView === item.id && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">💡</span>
              <span className="font-semibold">Pro Tip</span>
            </div>
            <p className="text-sm opacity-90">
              Track your expenses daily to build better financial habits!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
