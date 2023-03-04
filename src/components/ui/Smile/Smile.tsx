import React from 'react'
import './Smile.css'

type Props = {
    state?: 'fear' | 'dead' | 'default' | 'pressed' | 'win',
    onClick: () => void,
    onMouseDown: () => void,
    onMouseUp: () => void,
}

const Smile = ({ state, onClick, onMouseDown, onMouseUp }: Props) => {
    return (
        <span
            className={`ui__smile ui__smile_${state}`}
            onClick={() => onClick()}
            onMouseDown={() => onMouseDown()}
            onMouseUp={() => onMouseUp()}
        />
    )
}

export default Smile