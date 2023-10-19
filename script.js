document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const status = document.getElementById('game-status');
    const resetButton = document.getElementById('reset-button');
    const audioVictory = document.getElementById('victory-sound');
    const audioDefeat = document.getElementById('defeat-sound');
    const batImage = document.getElementById('bat-image');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const images = {
        'X': 'img/ghost.gif',
        'O': 'img/bat.gif',
    };

    const checkWinner = (board) => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (!board.includes('')) {
            return 'T';
        }

        return null;
    };

    const playTurn = (index, player) => {
        if (gameBoard[index] || !gameActive) {
            return;
        }

        gameBoard[index] = player;
        renderBoard();

        const winner = checkWinner(gameBoard);
        if (winner) {
            endGame(winner);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = currentPlayer === 'X' ? 'Sua Vez' : '';

            if (currentPlayer === 'O') {
                setTimeout(makeMoveAI, 100);
            }
        }
    };

    const makeMoveAI = () => {
        const emptyCells = gameBoard.reduce((acc, cell, index) => {
            if (!cell) {
                acc.push(index);
            }
            return acc;
        }, []);

        for (const index of emptyCells) {
            const tempBoard = [...gameBoard];
            tempBoard[index] = 'O';
            if (checkWinner(tempBoard) === 'O') {
                playTurn(index, 'O');
                return;
            }
        }

        for (const index of emptyCells) {
            const tempBoard = [...gameBoard];
            tempBoard[index] = 'X';
            if (checkWinner(tempBoard) === 'X') {
                playTurn(index, 'O');
                return;
            }
        }

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMove = emptyCells[randomIndex];

        playTurn(aiMove, 'O');
    };

    const renderBoard = () => {
        board.innerHTML = '';
        gameBoard.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.style.backgroundImage = `url('${images[cell]}')`;
            cellElement.style.backgroundSize = 'cover';
            cellElement.style.width = '100px';
            cellElement.style.height = '100px';
            cellElement.addEventListener('click', () => playTurn(index, currentPlayer));
            board.appendChild(cellElement);
        });
    };

    const endGame = (result) => {
        gameActive = false;
        if (result === 'T') {
            status.textContent = 'Jogo empatado!';
        } else {
            status.textContent = result === 'O' ? 'Você Perdeu!' : 'Você Venceu!';
            if (result === 'O') {
                batImage.style.display = 'block';
                setTimeout(() => {
                    batImage.style.display = 'none';
                }, 5000);
                audioDefeat.play();
            } else {
                audioVictory.play();
            }
        }
    };

    const resetGame = () => {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        status.textContent = 'Sua Vez';
        renderBoard();

        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', () => playTurn(index, currentPlayer));
        });

        audioVictory.pause();
        audioVictory.currentTime = 0;

        if (currentPlayer === 'O') {
            makeMoveAI();
        }
    };

    resetButton.addEventListener('click', () => {
        resetGame();
        audioVictory.pause();
        audioVictory.currentTime = 0;
    });

    resetGame();
});
