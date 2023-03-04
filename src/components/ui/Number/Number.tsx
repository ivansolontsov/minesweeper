import React from 'react'
import './Number.css'

type Props = {
    digit: string,
}

const Number = ({ digit }: Props) => {
    return (
        <span
            className={`ui__digits ui__digits_${digit}`}
        />
    )
}

export default Number