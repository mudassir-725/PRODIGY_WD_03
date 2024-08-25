let cells = Array.from({ length: 9 }, () => null);
let turn = 'X';
let gameOver = false;
let aiLevel = null;
let isAI = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleClick(index) {
    if (cells[index] || gameOver) return;

    cells[index] = turn;
    document.getElementById(`b${index + 1}`).value = turn;

    if (checkWin()) {
        document.getElementById('print').innerHTML = `Player ${turn} won!`;
        gameOver = true;
        highlightWinningCells(checkWin());
    } else if (cells.every(cell => cell)) {
        document.getElementById('print').innerHTML = "It's a tie!";
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        if (isAI && turn === 'O') {
            setTimeout(aiMove, 500);
        }
    }
}

function checkWin() {
    return winningCombinations.find(combo =>
        combo.every(index => cells[index] === turn)
    );
}

function highlightWinningCells(combo) {
    combo.forEach(index => {
        document.getElementById(`b${index + 1}`).style.color = 'red';
    });
}

function resetGame() {
    cells.fill(null);
    turn = 'X';
    gameOver = false;
    document.getElementById('print').innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        document.getElementById(`b${i}`).value = '';
        document.getElementById(`b${i}`).style.color = 'black';
    }
}

function aiMove() {
    let move;
    if (aiLevel === 'easy') {
        move = getRandomMove();
    } else if (aiLevel === 'medium') {
        move = getMediumMove();
    } else if (aiLevel === 'hard') {
        move = getBestMove();
    }
    cells[move] = 'O';
    document.getElementById(`b${move + 1}`).value = 'O';
    if (checkWin()) {
        document.getElementById('print').innerHTML = "AI Won!";
        gameOver = true;
        highlightWinningCells(checkWin());
    } else if (cells.every(cell => cell)) {
        document.getElementById('print').innerHTML = "It's a tie!";
    } else {
        turn = 'X';
    }
}

function getRandomMove() {
    const emptyCells = cells.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function getMediumMove() {
    // Try to win
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (cells[a] === 'O' && cells[b] === 'O' && cells[c] === null) return c;
        if (cells[a] === 'O' && cells[c] === 'O' && cells[b] === null) return b;
        if (cells[b] === 'O' && cells[c] === 'O' && cells[a] === null) return a;
    }
    // Block player from winning
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (cells[a] === 'X' && cells[b] === 'X' && cells[c] === null) return c;
        if (cells[a] === 'X' && cells[c] === 'X' && cells[b] === null) return b;
        if (cells[b] === 'X' && cells[c] === 'X' && cells[a] === null) return a;
    }
    // Pick random
    return getRandomMove();
}

function getBestMove() {
    return minimax(cells, 'O').index;
}

function minimax(newCells, player) {
    const availableSpots = newCells.map((cell, index) => cell === null ? index : null).filter(index => index !== null);

    if (checkWinner(newCells, 'X')) return { score: -10 };
    if (checkWinner(newCells, 'O')) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let spot of availableSpots) {
        let move = {};
        move.index = spot;
        newCells[spot] = player;

        if (player === 'O') {
            move.score = minimax(newCells, 'X').score;
        } else {
            move.score = minimax(newCells, 'O').score;
        }
        newCells[spot] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

function checkWinner(board, player) {
    return winningCombinations.some(combo =>
        combo.every(index => board[index] === player)
    );
}

function selectAILevel(level) {
    aiLevel = level;
    isAI = true;
    let playAIButton = document.getElementById('play-ai');
    playAIButton.style.backgroundColor = level === 'easy' ? 'green' :
        level === 'medium' ? '#1bc3de' : 'red';
    playAIButton.style.color = 'white';
    playAIButton.style.borderColor = 'white';
    document.getElementById('play-friend').style.backgroundColor = 'white';
    document.getElementById('play-friend').style.color = 'blueviolet';
    document.getElementById('play-friend').style.borderColor = 'blueviolet';
}

function selectFriend() {
    isAI = false;
    document.getElementById('play-friend').style.backgroundColor = 'blueviolet';
    document.getElementById('play-friend').style.color = 'white';
    document.getElementById('play-friend').style.borderColor = 'white';
    document.getElementById('play-ai').style.backgroundColor = 'white';
    document.getElementById('play-ai').style.color = 'blueviolet';
    document.getElementById('play-ai').style.borderColor = 'blueviolet';
}
