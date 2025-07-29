
import React from 'react'

const Alerts = ({ alerts }) => {
  if (alerts.length === 0) return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
      <h3 className="text-yellow-800 font-semibold mb-3">⚠️ Budget Alerts</h3>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div key={index} className="bg-yellow-100 p-3 rounded-lg text-yellow-800">
            {alert}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Alerts
