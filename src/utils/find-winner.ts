import { BoardValue, Player, WinState } from '../types/game-types';

type WinPattern = 'horizontal' | 'vertical' | 'leftDiag' | 'rightDiag';

type FindWinResult = {
   winner: boolean;
   winningIndexes: number[];
   winningPlayer: Player;
};

const isWinPossible = (
   pattern: WinPattern,
   value: BoardValue,
   index: number,
   boardSize: number,
   winLength: number
) => {
   if (value === '') return false;

   const currentRow = Math.floor(index / boardSize);
   const rowIndex = index % boardSize;
   const colPosition = rowIndex + 1;
   const rowPosition = currentRow + 1;

   switch (pattern) {
      case 'horizontal':
         return colPosition >= winLength;
      case 'vertical':
         return rowPosition >= winLength;
      case 'leftDiag':
         return colPosition >= winLength && rowPosition >= winLength;
      case 'rightDiag':
         return (
            rowPosition >= winLength && colPosition + winLength - 1 <= boardSize
         );
   }
};

//as you're looping back to find winning patterns, this will get the next index in the seek
const getNextSeekIndexByWinPattern = (
   pattern: WinPattern,
   boardIndex: number,
   seekIndex: number,
   boardSize: number
) => {
   switch (pattern) {
      case 'horizontal':
         return boardIndex - seekIndex;
      case 'vertical':
         return boardIndex - boardSize * seekIndex;
      case 'leftDiag':
         return boardIndex - boardSize * seekIndex - seekIndex;
      case 'rightDiag':
         return boardIndex - boardSize * seekIndex + seekIndex;
   }
};

const findWinByPattern = (
   pattern: WinPattern,
   board: BoardValue[],
   boardIndex: number,
   boardSize: number,
   winLength: number
): FindWinResult => {
   const value = board[boardIndex];

   if (!isWinPossible(pattern, value, boardIndex, boardSize, winLength))
      return { winner: false, winningIndexes: [], winningPlayer: null };

   let winner = true;
   const winningIndexes = [boardIndex];

   //seek backward through the board for winning patterns
   for (let seekIndex = 1; seekIndex < winLength; seekIndex++) {
      const nextWinPatternIndex = getNextSeekIndexByWinPattern(
         pattern,
         boardIndex,
         seekIndex,
         boardSize
      );
      winningIndexes.push(nextWinPatternIndex);

      if (board[nextWinPatternIndex] !== value) {
         winner = false;
         break;
      }
   }

   return { winner, winningIndexes, winningPlayer: value as Player };
};

const WIN_ITERATOR: readonly WinPattern[] = Object.freeze([
   'horizontal',
   'vertical',
   'leftDiag',
   'rightDiag'
]);

export function findWinner(
   board: BoardValue[],
   boardSize: number,
   winLength: number = 3
): WinState {
   for (
      //we can skip over the first n indexes since no wins are possible until we get past that point
      let boardIndex = winLength - 1;
      boardIndex < board.length;
      boardIndex++
   ) {
      for (let i = 0; i < WIN_ITERATOR.length; i++) {
         const pattern = WIN_ITERATOR[i];

         const { winner, winningIndexes, winningPlayer } = findWinByPattern(
            pattern,
            board,
            boardIndex,
            boardSize,
            winLength
         );

         if (winner) {
            return {
               isWinner: true,
               winningPlayer,
               winningIndexes,
               catsGame: false
            };
         }
      }
   }

   return {
      isWinner: false,
      winningPlayer: null,
      winningIndexes: null,
      catsGame: !board.some(v => v === '')
   };
}
