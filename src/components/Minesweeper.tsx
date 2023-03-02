import React, { useEffect, useState } from 'react'
import NumberCell from './ui/NumberCell/NumberCell';
import BombCell from './ui/BombCell/BombCell';
import Cell from './ui/Cell/Cell';
import Smile from './ui/Smile/Smile';

type Props = {}

const Bomb: number = -1;

function renderField(size: number): number[] {
    const field: number[] = new Array(size * size).fill(0)
    const amountOfMines: number = size;

    function inc(x: number, y: number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] === Bomb) return;
            field[y * size + x] += 1;
        }
    }

    for (let index = 0; index < amountOfMines;) {
        const x = Math.floor(Math.random() * size)
        const y = Math.floor(Math.random() * size)

        if (field[y * size + x] === Bomb) continue;
        field[y * size + x] = Bomb

        index += 1

        inc(x + 1, y)
        inc(x - 1, y)
        inc(x, y + 1)
        inc(x, y - 1)
        inc(x + 1, y + 1)
        inc(x - 1, y - 1)
        inc(x + 1, y - 1)
        inc(x - 1, y + 1)
    }

    return field
}

enum Mask {
    Opened,
    Closed,
    Flagged,
    BombFlagged,
    Question,
}

enum SmileEmotion {
    Fear = 'fear',
    Dead = 'dead',
    Default = 'default',
    Pressed = 'pressed',
    Win = 'win',
}

const mapMaskToUi: Record<Mask, React.ReactNode> = {
    [Mask.Opened]: null,
    [Mask.Closed]: <Cell />,
    [Mask.Flagged]: <Cell type='flagged' />,
    [Mask.Question]: <Cell type='question' />,
    [Mask.BombFlagged]: <BombCell state={'flagged'} />
}


const Minesweeper = (props: Props) => {
    const size = 16;
    const dimension = new Array(size).fill(0)

    const [smile, setSmile] = useState<SmileEmotion>(SmileEmotion.Default)
    const [field, setField] = useState<number[]>(renderField(size))
    const [mask, setMask] = useState<Mask[]>(new Array(size * size).fill(Mask.Closed))
    const [isGameFailed, setIsGameFailed] = useState<boolean>(false);

    const resetGame = () => {
        setSmile(SmileEmotion.Default)
        setField(renderField(size))
        setMask(new Array(size * size).fill(Mask.Closed))
        setIsGameFailed(false);
    }

    const cellLeftClickHandler = (x: number, y: number, e: React.MouseEvent) => {
        if (isGameFailed) return
        setSmile(SmileEmotion.Default)
        if (mask[y * size + x] === Mask.Opened) return;

        const whatWeNeedToClear: [number, number][] = []

        const cleaner = (x: number, y: number) => {
            if (x >= 0 && x < size && y >= 0 && y < size) {
                if (mask[y * size + x] === Mask.Opened) return
                whatWeNeedToClear.push([x, y])
            }
        }

        cleaner(x, y)

        while (whatWeNeedToClear.length) {
            const [x, y] = whatWeNeedToClear.pop()!!
            mask[y * size + x] = Mask.Opened
            if (field[y * size + x] !== 0) continue;
            cleaner(x + 1, y)
            cleaner(x - 1, y)
            cleaner(x, y + 1)
            cleaner(x, y - 1)
        }

        if (field[y * size + x] === Bomb) {
            setIsGameFailed(true)
            setSmile(SmileEmotion.Dead)
            mask.forEach((_, i) => {
                if (field[i] === Bomb) {
                    if (mask[i] === Mask.Flagged) {
                        return mask[i] = Mask.BombFlagged
                    }
                    return mask[i] = Mask.Opened
                }
            })
        }

        setMask(prev => [...prev])
    }

    const cellRightClickHandler = (x: number, y: number, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isGameFailed) return
        setSmile(SmileEmotion.Default)

        switch (mask[y * size + x]) {
            case Mask.Opened:
                break;
            case Mask.Closed:
                mask[y * size + x] = Mask.Flagged
                break;
            case Mask.Flagged:
                mask[y * size + x] = Mask.Question
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


    return (
        <section className="minesweeper">
            <div className="minesweeper__window">
                <div className="minesweeper__panel">
                    <div className="minesweeper__panel-items">
                        <Smile
                            state={smile}
                            onClick={() => smileClickHandler()}
                            onMouseDown={() => setSmile(SmileEmotion.Pressed)}
                            onMouseLeave={() => setSmile(SmileEmotion.Default)}
                        />
                    </div>
                </div>
                <div className='minesweeper__wrapper'>
                    <div className="minesweeper__field-wrapper">
                        <div className='minesweeper__board'>
                            {dimension.map((_, y) => ( // отрисовываем строку
                                <div className='minesweeper__field-row' key={y}>
                                    {dimension.map((_, x) => ( // отрисовываем ячейки в строке
                                        <div
                                            onMouseDown={() => setSmile(SmileEmotion.Fear)}
                                            onClick={(e) => cellLeftClickHandler(x, y, e)}
                                            onContextMenu={(e) => cellRightClickHandler(x, y, e)}
                                            onMouseLeave={() => setSmile(SmileEmotion.Default)}
                                            className='minesweeper__field-cell'
                                            key={x}
                                        >
                                            {mask[y * size + x] !== Mask.Opened
                                                ? mapMaskToUi[mask[y * size + x]]
                                                : field[y * size + x] === Bomb
                                                    ? (<BombCell state={isGameFailed ? 'clicked' : 'default'} />)
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

// {dimension.map((_, x) => ( // отрисовываем ячейки в строке
//                             <div className='minesweeper__field-cell' key={x}>
//                                 {mask[y * size + x] === Mask.Fill && (<Cell />)}
//                                 {mask[y * size + x] === Mask.Transparent &&
//                                     (
//                                         <>
//                                             {
//                                                 field[y * size + x] === Bomb
//                                                     ? (<BombCell state={'default'} />)
//                                                     : (<NumberCell number={field[y * size + x]} />)
//                                             }
//                                         </>
//                                     )
//                                 }
//                             </div>
//                         ))}

export default Minesweeper