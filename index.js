const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let current_player = CROSS;
let turn = 0;
let field_size = prompt('Введите размер поля');
let max_turn_count = field_size * field_size;
let field = createSquareArray(field_size);

startGame();
addResetListener();

function createSquareArray(size) {
    arr = []
    for (i = 0; i < size; i++) {
        arr[i] = [];
        for (j = 0; j < size; j++) {
            arr[i][j] = EMPTY;
        }
    }
    return arr;
}

function startGame () {
    renderGrid(field_size);
}

function renderGrid (dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = field[i][j];
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    if (field[row][col] !== EMPTY || turn >= max_turn_count) {
            return;
        }
    renderSymbolInCell(current_player, row, col);
    field[row][col] = current_player;
    console.log(`Clicked on cell: ${row}, ${col}`);
    turn++;

    if (turn === max_turn_count) {
        alert("Победила дружба");
    }

    if (checkWinner(current_player, field)) {
        turn = max_turn_count;
    }
    
    if (turn > max_turn_count / 2) {
        expandField();
    }

    current_player = current_player === CROSS ? ZERO : CROSS;

    if (current_player === ZERO) {
        aiTurn();
    }
}

function aiTurn() {
    for (let i = 0; i < field_size; i++) {
        for (let j = 0; j < field_size; j++) {
            if (field[i][j] !== EMPTY) {
                continue;
            }
            let new_field = JSON.parse(JSON.stringify(field));
            new_field[i][j] = ZERO;
            console.log(new_field);
            console.log(field);
            if (checkWinner(ZERO, new_field)) {
                cellClickHandler(i, j);
                return;
            }
        }
    }
    aiRandomTurn();
}

function aiRandomTurn() {
    let row = random(field_size);
    let col = random(field_size);
    do {
        row = random(field_size);
        col = random(field_size);
    }
    while (field[row][col] !== EMPTY);

    cellClickHandler(row, col);
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    field = createSquareArray(field_size);
    turn = 0;
    current_player = CROSS;
    renderGrid(field_size);
}

function checkWinner (player, field) {
    let hor = checkWinnerHorizontal(player, field);
    if (hor !== -1) {
        for (let i = 0; i < field_size; i++) {
            renderSymbolInCell(player, hor, i, '#FF0000');
        }
        return true;
    }

    let vert = checkWinnerVertical(player, field);
    if (vert !== -1) {
        for (let i = 0; i < field_size; i++) {
            renderSymbolInCell(player, i, vert, '#FF0000');
        }
        return true;
    }

    let diag = checkWinnerDiagonal(player, field);
    if (diag === 1) {
        for (let i = 0; i < field_size; i++) {
            renderSymbolInCell(player, i, i, '#FF0000');
        }
        return true;
    }
    if (diag === 2) {
        for (let i = 0; i < field_size; i++) {
            renderSymbolInCell(player, i, field_size - 1 - i, '#FF0000');
        }
        return true;
    }
    return false;
}

function checkWinnerHorizontal(player, field) {
    for (let i = 0; i < field_size; i++) {
        for (let j = 0; j < field_size; j++) {
            if (field[i][j] !== player) {
                break;
            }
            if (field[i][j] === player && j === field_size - 1) {
                return i;
            }
        }
    }
    return -1;
}

function checkWinnerVertical(player, field) {
    for (let i = 0; i < field_size; i++) {
        for (let j = 0; j < field_size; j++) {
            if (field[j][i] !== player) {
                break;
            }
            if (field[j][i] === player && j === field_size - 1) {
                return i;
            }
        }
    }
    return -1;
}

function checkWinnerDiagonal(player, field) {
    for (let i = 0; i < field_size; i++) {
        if (field[i][i] !== player)
            break;
        if (field[i][i] === player && i === field_size - 1)
            return 1; 
    }
    for (let i = 0; i < field_size; i++) {
        if (field[i][field_size - 1 - i] !== player)
            break;
        if (field[i][field_size - 1 - i] === player && i === field_size - 1)
            return 2; 
    }
    return -1
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function expandField() {
    let new_field = createSquareArray(field_size + 1);
    for (let i = 0; i < field_size; i++) {
        for (let j = 0; j < field_size; j++) {
            new_field[i][j] = field[i][j]
        }
    }
    field_size++;
    field = new_field;
    renderGrid(field_size);
    max_turn_count = field_size * field_size;
}

/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
