import React from 'react'
import './BombCell.css'

type Props = {
    state: 'default' | 'clicked' | 'flagged'
}

const BombCell = ({ state }: Props) => {
    return (
        <span className={`ui__bomb ui__bomb_${state}`} />
    )
}

export default BombCell