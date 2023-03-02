import React from 'react'
import './Cell.css'

type Props = {
    type?: 'flagged' | 'question'
}

const Cell = ({ type }: Props) => {
    if (type === 'flagged') {
        return (
            <span className={`ui__cell_flagged`} />
        )
    }
    if (type === 'question') {
        return (
            <span className={`ui__cell_question`} />
        )
    }
    return (
        <span className={`ui__cell`} />
    )
}

export default Cell