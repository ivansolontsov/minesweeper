import React from 'react'
import './MineCounter.css'
import Number from '../Number/Number'

type Props = {
    digit: number,
}

const MineCounter = ({ digit }: Props) => {
    let formattedDigits: string = digit.toString();
    if (digit < 10) {
        formattedDigits = '0' + digit.toString();
    }
    return (
        <span className='minecounter'>
            <Number digit={formattedDigits.split('')[0]} />
            <Number digit={formattedDigits.split('')[1]} />
        </span>
    )
}

export default MineCounter