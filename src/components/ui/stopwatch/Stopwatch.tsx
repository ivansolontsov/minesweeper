import React, { useState, useRef, useEffect } from "react";
import { useGameStore, useStopwatchStore } from "../../../store/store";
import Number from '../Number/Number'
import './Stopwatch.css'

interface Time {
    seconds: number;
}

const Stopwatch = () => {

    const isGameBegining = useStopwatchStore((state) => state.isTimerStarted)
    const isResetCalled = useStopwatchStore((state) => state.isReset)
    const isGameFailed = useGameStore((state) => state.isGameFailed)

    const [time, setTime] = useState<Time>({ seconds: 0 });
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (timerRef.current === null) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => {
                    let { seconds } = prevTime;
                    seconds++;
                    return { seconds };
                });
            }, 1000);
        }
    }

    const stopTimer = () => {
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    if (isGameBegining) {
        startTimer()
    }
    if (isGameFailed || !isGameBegining) {
        stopTimer()
    }

    useEffect(() => {
        setTime({ seconds: 0 })
    }, [isResetCalled])

    let formattedTime = time.seconds.toString().padStart(3, '0')

    return (
        <span className={`stopwatch`}>
            <Number digit={formattedTime.split('')[0]} />
            <Number digit={formattedTime.split('')[1]} />
            <Number digit={formattedTime.split('')[2]} />
        </span>
    );
}

export default Stopwatch;