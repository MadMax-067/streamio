import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BottomButton = ({ iconName, label }) => {
  return (
    <div className="flex flex-col items-center gap-1 p-2">
      <FontAwesomeIcon 
        icon={iconName} 
        className="w-6 h-6 text-gray-400" 
      />
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  )
}

export default BottomButton
