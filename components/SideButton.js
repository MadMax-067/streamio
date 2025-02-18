"use client"
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const SideButton = ({ actionName, iconName, isCollapsed }) => {
    const href = actionName.toLowerCase().replace(' ', '-')
    
    return (
        <Link 
            href={`/${href === 'home' ? '' : href}`}
            className={`w-full transition-all duration-300 ${
                isCollapsed ? 'px-4' : 'px-6'
            } py-2 hover:bg-gray-800/50 rounded-lg`}
        >
            <div className="flex items-center gap-3">
                <FontAwesomeIcon 
                    icon={iconName} 
                    className={`w-5 h-5 text-gray-400 transition-colors`}
                />
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span 
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            className="text-gray-400 whitespace-nowrap"
                        >
                            {actionName}
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        </Link>
    )
}

export default SideButton
