import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import Link from 'next/link'

const SideButton = ({ actionName, iconName, isCollapsed }) => {
    const href = actionName.toLowerCase().replace(' ', '-')

    return (
        <Link 
            href={`/${href === 'home' ? '' : href}`}
            className={`w-[90%] group transition-colors ${
                isCollapsed ? 'justify-center' : 'justify-start pl-4'
            } flex items-center gap-3 py-2 rounded-lg hover:bg-gray-800`}
        >
            <FontAwesomeIcon 
                icon={iconName} 
                className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" 
            />
            {!isCollapsed && (
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 group-hover:text-white transition-colors"
                >
                    {actionName}
                </motion.span>
            )}
        </Link>
    )
}

export default SideButton
