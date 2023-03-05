import React, { useState, useRef, useEffect } from "react";
import { useGameStore, useStopwatchStore } from "../../../store/store";
import Number from '../Number/Number'
import './Stopwatch.css'
interface Time {
    minutes: number;
    seconds: number;
}

interface Props {
    setGameFailed: () => void,
}

const Stopwatch = ({ setGameFailed }: Props) => {

    const isGameBegining = useStopwatchStore((state) => state.isTimerStarted)
    const isResetCalled = useStopwatchStore((state) => state.isReset)
    const isGameFailed = useGameStore((state) => state.isGameFailed)

    const [time, setTime] = useState<Time>({ minutes: 0, seconds: 0 });
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (timerRef.current === null) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => {
                    let { minutes, seconds } = prevTime;
                    seconds++;
                    if (seconds === 60) {
                        seconds = 0;
                        minutes++;
                    }
                    if (minutes === 60) {
                        minutes = 0;
                    }
                    if (minutes >= 40) {
                        setGameFailed()
                    }
                    return { minutes, seconds };
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
        setTime({ minutes: 0, seconds: 0 })
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