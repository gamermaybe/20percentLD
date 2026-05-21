// Run setup after the DOM content has loaded so all elements are available
window.addEventListener('DOMContentLoaded', () => {
    // Cache frequently used DOM elements for the game UI
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    // Internal game state
    // `board` stores the current symbol at each cell ('' when empty)
    let board = ['', '', '', '', '', '', '', '', ''];
    // `currentPlayer` is either 'X' or 'O'
    let currentPlayer = 'X';
    // `isGameActive` disables clicks after a win/tie until reset
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';


    /*
        Indexes within the board
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

    // All possible winning index combinations for a 3x3 board
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Check the board for a win or tie after each move
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            // if any of the three positions is empty, this can't be a winning line
            if (a === '' || b === '' || c === '') {
                continue;
            }
            // if all three are equal and non-empty, current player wins
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            // Announce the winner and deactivate the board
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        // If there are no empty cells left and no winner, it's a tie
        if (!board.includes(''))
            announce(TIE);
    }

    // Display the game result (win or tie) in the announcer element
    const announce = (type) => {
        switch(type){
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    // Return true if the clicked tile is empty (valid move)
    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O'){
            return false;
        }

        return true;
    };

    // Update internal `board` array for the given cell index
    const updateBoard =  (index) => {
        board[index] = currentPlayer;
    }

    // Toggle the active player and update the UI indicator
    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    // Called when the user clicks a tile: perform move, check result, switch player
    const userAction = (tile, index) => {
        if(isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }
    
    // Reset the game state and clear the UI to start a new match
    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        // Ensure the player display shows 'X' as the starting player
        if (currentPlayer === 'O') {
            changePlayer();
        }

        // Clear each tile's text and player-specific CSS classes
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    // Wire up click handlers for each tile and the reset button
    tiles.forEach( (tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});