import React, { useState } from 'react'
import NumberCell from './ui/NumberCell/NumberCell';
import BombCell from './ui/BombCell/BombCell';
import Cell from './ui/Cell/Cell';
import Smile from './ui/Smile/Smile';
import { Bomb, amountOfMines, createBoard } from '../helpers/createBoard';
import Stopwatch from './ui/stopwatch/Stopwatch';
import { useGameStore, useStopwatchStore } from '../store/store';
import MineCounter from './ui/MineCounter/MineCounter';

type Props = {}

enum Mask {
    Opened,
    Closed,
    Flagged,
    BombFlagged,
    BombDefault,
    BombClicked,
    Question,
}

enum SmileEmotion {
    Fear = 'fear',
    Dead = 'dead',
    Default = 'default',
    Pressed = 'pressed',
    Win = 'win',
}

const cellMasks: Record<Mask, React.ReactNode> = {
    [Mask.Opened]: null,
    [Mask.Closed]: <Cell />,
    [Mask.Flagged]: <Cell type='flagged' />,
    [Mask.Question]: <Cell type='question' />,
    [Mask.BombFlagged]: <BombCell state={'flagged'} />,
    [Mask.BombDefault]: <BombCell state={'default'} />,
    [Mask.BombClicked]: <BombCell state={'clicked'} />,
}

const Minesweeper = (props: Props) => {
    const size = 16;
    const dimension = new Array(size).fill(0) // массив для отрисовки поля, чтобы понимать размер

    const isGameFailed = useGameStore((state) => state.isGameFailed)
    const setIsGameFailed = useGameStore((state) => state.setIsGameFailed)
    const startTimer = useStopwatchStore((state) => state.startTimer)
    const stopTimer = useStopwatchStore((state) => state.stopTimer)
    const resetTimer = useStopwatchStore((state) => state.resetTimer)

    const [clicks, setCliks] = useState(0)
    const [field, setField] = useState<number[]>([])
    const [mask, setMask] = useState<Mask[]>(new Array(size * size).fill(Mask.Closed))
    const [smile, setSmile] = useState<SmileEmotion>(SmileEmotion.Default)
    const [minesAmount, setMinesAmount] = useState<number>(amountOfMines)
    const [win, setWin] = useState<boolean>(false)

    const resetGame = () => {
        setSmile(SmileEmotion.Default)
        setField(createBoard(size))
        setMinesAmount(amountOfMines)
        setMask(new Array(size * size).fill(Mask.Closed))
        setIsGameFailed(false);
        stopTimer()
        resetTimer()
        setWin(false)
        setCliks(0)
    }

    const winGame = () => {
        setWin(true);
        setSmile(SmileEmotion.Win)
        showMineMap(true)
        stopTimer()
    }

    const loseGame = () => {
        setIsGameFailed(true)
        setSmile(SmileEmotion.Dead)
        showMineMap(false)
        stopTimer()
    }

    const showMineMap = (gameStatus: boolean) => {
        // показываем пользователю карту мин
        // true - показываем карту при выйгрыше
        // false - показываем карту при проигрыше
        mask.forEach((_, i) => {
            if (field[i] === Bomb) {
                if (mask[i] === Mask.Flagged) {
                    return mask[i] = Mask.BombFlagged
                }
                return mask[i] = gameStatus ? Mask.BombDefault : Mask.BombClicked;
            }
        })
    }


    const cellLeftClickHandler = (x: number, y: number, field: number[]) => {
        let newField: number[] = field;
        if (clicks === 0) {
            newField = createBoard(size, { x: x, y: y })
            setMinesAmount(newField.filter((e) => e === Bomb).length)
            setField(newField)
        }

        leftCellClick(x, y, newField)

        function leftCellClick(x: number, y: number, field: number[]) {
            if (isGameFailed || win) return
            setSmile(SmileEmotion.Default)
            if (mask[y * size + x] === Mask.Opened
                || mask[y * size + x] === Mask.Flagged
                || mask[y * size + x] === Mask.Question)
                return;

            const whatWeNeedToClear: [number, number][] = [] // в этот массив пушим координаты для очистки

            const addToCleaner = (x: number, y: number) => {
                if (x >= 0 && x < size && y >= 0 && y < size) {
                    if (mask[y * size + x] === Mask.Opened) return
                    whatWeNeedToClear.push([x, y])
                }
            }

            addToCleaner(x, y)

            while (whatWeNeedToClear.length) { // очищаем ячейки и накидываем в массив пока не дойдем до той у которой есть цифра
                const [x, y] = whatWeNeedToClear.pop()!!
                mask[y * size + x] = Mask.Opened
                if (field[y * size + x] !== 0) continue;
                addToCleaner(x + 1, y)
                addToCleaner(x - 1, y)
                addToCleaner(x, y + 1)
                addToCleaner(x, y - 1)
            }

            if (field[y * size + x] === Bomb && clicks !== 0) {
                loseGame()
            }
            if (clicks === 0) {
                startTimer()
            }

            setCliks(clicks + 1)
            setMinesAmount(amountOfMines - mask.filter((e) => e === Mask.Flagged).length - mask.filter((e) => e === Mask.BombFlagged).length)
            setMask(prev => [...prev])
        }
    }

    const cellRightClickHandler = (x: number, y: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isGameFailed || win) return
        setSmile(SmileEmotion.Default)

        switch (mask[y * size + x]) {
            case Mask.Opened:
                break;
            case Mask.Closed:
                if (minesAmount > 0) {
                    mask[y * size + x] = Mask.Flagged
                    setMinesAmount(minesAmount - 1)
                }
                break;
            case Mask.Flagged:
                mask[y * size + x] = Mask.Question
                setMinesAmount(minesAmount + 1)
                break;
            case Mask.Question:
                mask[y * size + x] = Mask.Closed
                break;
        }
        setMask(prev => [...prev])
    }

    const smileClickHandler = () => {
        resetGame()
    }

    if (mask.filter(i => i === Mask.Opened).length === field.length - field.filter((i) => i === Bomb).length && !win && !isGameFailed && clicks !== 0) {
        winGame()
    }

    return (
        <section className="minesweeper">
            <div className="minesweeper__window">
                <div className="minesweeper__panel">
                    <div className="minesweeper__panel-items">
                        <MineCounter digit={minesAmount} />
                        <Smile
                            state={smile}
                            onClick={() => smileClickHandler()}
                            onMouseDown={() => setSmile(SmileEmotion.Pressed)}
                            onMouseUp={() => setSmile(SmileEmotion.Default)}
                        />
                        <Stopwatch />
                    </div>
                </div>
                <div className='minesweeper__wrapper'>
                    <div className="minesweeper__field-wrapper">
                        <div className='minesweeper__board'>
                            {dimension.map((_, y) => ( // отрисовываем строку
                                <div className='minesweeper__field-row' key={y}>
                                    {dimension.map((_, x) => ( // отрисовываем ячейки в строке
                                        <div
                                            onMouseDown={() => {
                                                if (isGameFailed || win) return;
                                                if (
                                                    mask[y * size + x] !== Mask.Opened
                                                    && mask[y * size + x] !== Mask.Flagged
                                                    && mask[y * size + x] !== Mask.Question) {
                                                    setSmile(SmileEmotion.Fear)
                                                }
                                            }}
                                            onClick={(e) => cellLeftClickHandler(x, y, field)}
                                            onContextMenu={(e) => cellRightClickHandler(x, y, e)}
                                            className='minesweeper__field-cell'
                                            style={{ cursor: win ? 'default' : isGameFailed ? 'default' : 'pointer' }}
                                            key={x}
                                        >
                                            {mask[y * size + x] !== Mask.Opened
                                                ? cellMasks[mask[y * size + x]]
                                                : field[y * size + x] === Bomb
                                                    ? (<BombCell state={'default'} />)
                                                    : (<NumberCell number={field[y * size + x]} />)
                                            }
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Minesweeper