import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SideButton = ({ actionName, iconName }) => {
    return (
        <button className='group border border-secondary/10 focus:border-transparent flex items-center gap-3 px-3 hover:bg-secondary/10 focus:bg-secondary/10 md:h-9 2xl:h-10 w-[85%] rounded-lg' >
            <span tabIndex={0} className='group-focus:text-primary' >
                <FontAwesomeIcon icon={iconName} />
            </span>
            <div>{actionName}</div>
        </button>
    )
}

export default SideButton
