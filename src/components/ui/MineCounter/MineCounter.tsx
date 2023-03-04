import React from 'react'
import './MineCounter.css'
import Number from '../Number/Number'

type Props = {
    digit: number,
}

const MineCounter = ({ digit }: Props) => {
    return (
        <span className='minecounter'>
            <Number digit={digit.toString().split('')[0]} />
            <Number digit={digit.toString().split('')[1]} />
        </span>
    )
}

export default MineCounter