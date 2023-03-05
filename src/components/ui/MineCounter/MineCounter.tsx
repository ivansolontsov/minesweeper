import React from 'react'
import './MineCounter.css'
import Number from '../Number/Number'

type Props = {
    digit: number,
}

const MineCounter = ({ digit }: Props) => {
    const formattedDigits = digit.toString().padStart(3, '0')
    return (
        <span className='minecounter'>
            <Number digit={formattedDigits.split('')[0]} />
            <Number digit={formattedDigits.split('')[1]} />
            <Number digit={formattedDigits.split('')[2]} />
        </span>
    )
}

export default MineCounter