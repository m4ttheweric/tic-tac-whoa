import { BoardValue, WinState } from '../types/game-types';

export function findWinner(board: BoardValue[], boardSize: number): WinState {
   let rows: string[][] = [...new Array(boardSize)].map(() =>
      new Array(boardSize).fill('')
   );

   for (let index = 0; index < board.length; index++) {
      const value = board[index];

      const currentRow = Math.floor(index / boardSize);
      const rowIndex = index % boardSize;

      //set the rows array value
      rows[currentRow][rowIndex] = value;

      if (value === '') continue;

      //check for horizontal win
      if (
         rowIndex > 1 &&
         rows[currentRow][rowIndex - 1] === value &&
         rows[currentRow][rowIndex - 2] === value
      ) {
         return {
            isWinner: true,
            winningPlayer: value,
            winningIndexes: [index - 2, index - 1, index],
            catsGame: false
         };
      }

      //check for vertical win
      if (
         currentRow > 1 &&
         rows[currentRow - 1][rowIndex] === value &&
         rows[currentRow - 2][rowIndex] === value
      ) {
         return {
            isWinner: true,
            winningPlayer: value,
            winningIndexes: [index, index - boardSize, index - boardSize * 2],
            catsGame: false
         };
      }

      //left diagonal win
      if (
         currentRow > 1 &&
         rows[currentRow - 1][rowIndex - 1] === value &&
         rows[currentRow - 2][rowIndex - 2] === value
      ) {
         return {
            isWinner: true,
            winningPlayer: value,
            winningIndexes: [
               index,
               index - boardSize - 1,
               index - boardSize * 2 - 2
            ],
            catsGame: false
         };
      }
      //right diagonal win
      if (
         currentRow > 1 &&
         rows[currentRow - 1][rowIndex + 1] === value &&
         rows[currentRow - 2][rowIndex + 2] === value
      ) {
         return {
            isWinner: true,
            winningPlayer: value,
            winningIndexes: [
               index,
               index - boardSize + 1,
               index - boardSize * 2 + 2
            ],
            catsGame: false
         };
      }
   }

   return {
      isWinner: false,
      winningPlayer: null,
      winningIndexes: null,
      catsGame: !board.some(v => v === '')
   };
}
