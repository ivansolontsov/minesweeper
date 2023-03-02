import React from 'react'
import './NumberCell.css'

type Props = {
    number: number;
}

const NumberCell = ({ number }: Props) => {
    return (
        <span className={`ui__number ui__number_${number}`} />
    )
}

export default NumberCell