import React from 'react'
import './Smile.css'

type Props = {
    state?: 'fear' | 'dead' | 'default' | 'pressed' | 'win',
    onClick: () => void,
    onMouseDown: () => void,
    onMouseLeave: () => void,
}

const Smile = ({ state, onClick, onMouseDown, onMouseLeave }: Props) => {
    return (
        <span
            className={`ui__smile ui__smile_${state}`}
            onClick={() => onClick()}
            onMouseDown={() => onMouseDown()}
            onMouseLeave={() => onMouseLeave()}
        />
    )
}

export default Smile