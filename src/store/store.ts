import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IStopwatch {
    isTimerStarted: boolean,
    isReset: boolean,
    time: { minutes: number, seconds: number }
    startTimer: () => void,
    stopTimer: () => void,
    resetTimer: () => void,
}

export const useStopwatchStore = create<IStopwatch>()
    (devtools
        (immer((setState) => (
            {
                isTimerStarted: false,
                isReset: false,
                time: { hours: 0, minutes: 0, seconds: 0 },
                startTimer: () => setState(store => { store.isTimerStarted = true }),
                stopTimer: () => setState(store => { store.isTimerStarted = false }),
                resetTimer: () => setState(store => { store.isReset = !store.isReset })
            }
        )))
    )


interface IGame {
    isGameFailed: boolean,
    setIsGameFailed: (value: boolean) => void,
}


export const useGameStore = create<IGame>()
    (devtools
        (immer((setState) => (
            {
                isGameFailed: false,
                setIsGameFailed: (value) => setState(store => { store.isGameFailed = value }),
            }
        )))
    )