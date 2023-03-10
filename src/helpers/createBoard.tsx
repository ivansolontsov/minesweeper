export const Bomb: number = -1;
export const amountOfMines: number = 40;

export const createBoard = (size: number, noBombThere?: { x: number, y: number }): number[] => {
    const field: number[] = new Array(size * size).fill(0)
   
    function inc(x: number, y: number) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] === Bomb) return;
            field[y * size + x] += 1;
        }
    }

    for (let index = 0; index < amountOfMines;) {
        const x = Math.floor(Math.random() * size)
        const y = Math.floor(Math.random() * size)

        if (noBombThere) {
            if (x === noBombThere.x && y === noBombThere.y) continue
        }

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
