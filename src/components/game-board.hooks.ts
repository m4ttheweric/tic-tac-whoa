import { useDisclosure } from '@chakra-ui/react';
import { useMemo, useRef, useState } from 'react';
import { BoardValue, Player, WinState } from '../types/game-types';
import { findWinner } from '../utils/find-winner';

export const MAX_BOARD_SIZE = 15;
export const MIN_BOARD_SIZE = 3;

const INITIAL_GAME_STATE: WinState = {
   isWinner: false,
   winningPlayer: null,
   winningIndexes: [],
   catsGame: false
};

function isBoardSizeValid(val: string) {
   const size = parseInt(val, 10);
   return !(!size || size > MAX_BOARD_SIZE || size < MIN_BOARD_SIZE);
}

function buildBoardState(boardSize: number) {
   return Array(boardSize * boardSize).fill('');
}

export function useGame() {
   //player names
   const [xPlayer, setXPlayer] = useState<string>('Player 1');
   const [oPlayer, setOPlayer] = useState<string>('Player 2');

   //board state and size
   const [boardSize, setBoardSize] = useState(3);
   const [boardSizeInputVal, setBoardSizeInputVal] = useState('3');
   const [boardState, setBoardState] = useState<BoardValue[]>(
      buildBoardState(boardSize)
   );

   //current player
   const [player, setPlayer] = useState<Player>('X');

   const [winState, setWinState] = useState<WinState>({
      ...INITIAL_GAME_STATE
   });

   const gameIsInProgress = useMemo(
      () => boardState.some(v => v === 'X' || v === 'O'),
      [boardState]
   );

   //shows on buttons for restarting game
   const newGameText = useMemo(
      () =>
         winState.isWinner || winState.catsGame ? 'New Game' : 'Restart Game',
      [winState.isWinner, winState.catsGame]
   );

   //error states
   const [resizeError, setResizeError] = useState(false);
   const [boardSizeInvalid, setBoardSizeInvalid] = useState(false);

   const resetGame = (newBoardSize: number = null) => {
      setResizeError(false);
      setBoardSizeInvalid(false);
      setBoardState(buildBoardState(newBoardSize || boardSize));
      setWinState({ ...INITIAL_GAME_STATE });
      setPlayer('X');
   };

   //EVENT HANDLERS....
   const handleSquareClick = (index: number) => {
      if (winState.isWinner || winState.catsGame) return;

      setResizeError(false);
      const updateBoardState = [...boardState];
      if (updateBoardState[index] !== '') {
         return;
      }
      updateBoardState[index] = updateBoardState[index] = player;

      setBoardState(updateBoardState);

      const result = findWinner(updateBoardState, boardSize);

      if (result.isWinner || result.catsGame) {
         setWinState(result);
      }

      setPlayer(player === 'X' ? 'O' : 'X');
   };

   const handleChangeBoardSize = (value: string) => {
      const newBoardSize = parseInt(value, 10);
      setBoardSizeInputVal(value);

      const isValid = isBoardSizeValid(value);

      setBoardSizeInvalid(!isValid);

      if (isValid) {
         if (gameIsInProgress) {
            setResizeError(true);
         } else {
            setBoardSize(newBoardSize);
            resetGame(newBoardSize);
         }
      }
   };

   const handleNewGameClick = () => {
      if (winState.isWinner || winState.catsGame) {
         resetGame();
      } else if (gameIsInProgress) {
         onShowGameWarning();
      } else {
         resetGame();
      }
   };

   const handleGameSizeInputClick = () => {
      if (gameIsInProgress) {
         setResizeError(true);
      }
   };

   const handlePlayerNameChange = (player: Player, value: string) => {
      if (player === 'X') {
         setXPlayer(value);
      } else {
         setOPlayer(value);
      }
   };

   //alert dialog helper state
   const {
      isOpen: showGameWarning,
      onOpen: onShowGameWarning,
      onClose: onCloseGameWarning
   } = useDisclosure();

   const cancelGameWarningRef = useRef();

   return {
      //state
      xPlayer,
      oPlayer,
      boardSize,
      boardSizeInputVal,
      boardState,
      player,
      winState,
      gameIsInProgress,
      newGameText,
      resizeError,
      boardSizeInvalid,

      //helper fns
      resetGame,

      //handlers
      handleSquareClick,
      handleChangeBoardSize,
      handleNewGameClick,
      handleGameSizeInputClick,
      handlePlayerNameChange,

      //alert stuff:
      onCloseGameWarning,
      showGameWarning,
      cancelGameWarningRef
   };
}
