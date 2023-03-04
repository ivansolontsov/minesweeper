import React from 'react'
import './MineCounter.css'
import Number from '../Number/Number'

type Props = {
    digit: number,
}

const MineCounter = ({ digit }: Props) => {
    let formattedDigits: string = '0' + digit.toString();
    if (digit < 10) {
        formattedDigits = '00' + digit.toString();
    }
    return (
        <span className='minecounter'>
            <Number digit={formattedDigits.split('')[0]} />
            <Number digit={formattedDigits.split('')[1]} />
            <Number digit={formattedDigits.split('')[2]} />
        </span>
    )
}

export default MineCounter