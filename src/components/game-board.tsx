import {
   AlertDialog,
   AlertDialogBody,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogOverlay,
   Button,
   HStack,
   Input,
   InputGroup,
   InputLeftAddon,
   SimpleGrid,
   Stack,
   Text,
   VStack
} from '@chakra-ui/react';
import React from 'react';
import { MAX_BOARD_SIZE, MIN_BOARD_SIZE, useGame } from './game-board.hooks';
import { GameSquare, PlayerColors } from './game-square';
import { NumericInput } from './numeric-input';

export const GameBoard = () => {
   const {
      //state
      xPlayer,
      oPlayer,
      boardSize,

      boardState,
      player,
      winState,
      gameIsInProgress,
      newGameText,
      resetCounter,

      //helper fns
      resetGame,

      //handlers
      handleSquareClick,
      handleChangeBoardSize,
      handleChangeWinLength,
      handleNewGameClick,
      handlePlayerNameChange,

      //alert stuff:
      onCloseGameWarning,
      showGameWarning,
      cancelGameWarningRef
   } = useGame();

   const restartDialog = () => (
      <AlertDialog
         isOpen={showGameWarning}
         leastDestructiveRef={cancelGameWarningRef}
         onClose={onCloseGameWarning}
      >
         <AlertDialogOverlay>
            <AlertDialogContent>
               <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Start New Game
               </AlertDialogHeader>

               <AlertDialogBody>
                  Are you sure? This will clear the current game.
               </AlertDialogBody>

               <AlertDialogFooter>
                  <Button
                     ref={cancelGameWarningRef}
                     onClick={onCloseGameWarning}
                  >
                     Cancel
                  </Button>
                  <Button
                     colorScheme='red'
                     onClick={() => {
                        resetGame();
                        onCloseGameWarning();
                     }}
                     ml={3}
                  >
                     {newGameText}
                  </Button>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialogOverlay>
      </AlertDialog>
   );

   const gameControls = () => (
      <Stack
         direction={{ base: 'column', md: 'row' }}
         spacing={{ base: 4, md: 4 }}
      >
         <NumericInput
            initialValue={MIN_BOARD_SIZE.toString()}
            min={MIN_BOARD_SIZE}
            max={MAX_BOARD_SIZE}
            placeholder='Board Size'
            changeProhibited={gameIsInProgress}
            prohibitedErrorMessage='You cannot resize the board while a game is in progress.'
            resetCounter={resetCounter}
            onChange={handleChangeBoardSize}
         />
         <NumericInput
            initialValue={MIN_BOARD_SIZE.toString()}
            min={MIN_BOARD_SIZE}
            max={boardSize}
            placeholder='Win Length'
            changeProhibited={gameIsInProgress}
            prohibitedErrorMessage='You cannot change win length while a game is in progress.'
            resetCounter={resetCounter}
            onChange={handleChangeWinLength}
         />
         <Button
            onClick={handleNewGameClick}
            disabled={!gameIsInProgress}
            alignSelf='center'
            size={'md'}
            colorScheme={
               winState.isWinner || winState.catsGame ? 'green' : 'gray'
            }
         >
            {newGameText}
         </Button>
      </Stack>
   );

   const playerNames = () => (
      <Stack direction={{ base: 'column', md: 'row' }}>
         <InputGroup>
            <InputLeftAddon
               children={`X's`}
               backgroundColor={PlayerColors.X}
               color={'white'}
            />
            <Input
               type='text'
               placeholder='X Player'
               value={xPlayer}
               onChange={e => {
                  handlePlayerNameChange('X', e.target.value);
               }}
            />
         </InputGroup>

         <InputGroup>
            <InputLeftAddon
               children={`O's`}
               backgroundColor={PlayerColors.O}
               color={'white'}
            />
            <Input
               type='text'
               placeholder='O Player'
               value={oPlayer}
               onChange={e => {
                  handlePlayerNameChange('O', e.target.value);
               }}
            />
         </InputGroup>
      </Stack>
   );

   const gameStateMessages = () => (
      <>
         {!winState.isWinner && !winState.catsGame && (
            <Text
               noOfLines={1}
               color={PlayerColors[player]}
               fontSize={{ base: '2xl', md: '3xl' }}
            >{`${player === 'X' ? xPlayer : oPlayer}'s turn...`}</Text>
         )}
         {winState.isWinner && (
            <HStack>
               <Text
                  noOfLines={1}
                  fontSize={{ base: '2xl', md: '3xl' }}
                  color={PlayerColors[winState.winningPlayer]}
               >
                  {`${winState.winningPlayer === 'X' ? xPlayer : oPlayer}`}
               </Text>
               <Text noOfLines={1} fontSize={{ base: '2xl', md: '3xl' }}>
                  is the winner! 🚀 🎉
               </Text>
            </HStack>
         )}
         {winState.catsGame && <Text fontSize={'3xl'}>😿 Cat's Game 😿</Text>}
      </>
   );
   return (
      <VStack spacing={4}>
         {gameControls()}
         {playerNames()}
         {gameStateMessages()}
         <SimpleGrid columns={boardSize}>
            {boardState.map((value, index) => (
               <GameSquare
                  key={index}
                  value={value}
                  index={index}
                  boardSize={boardSize}
                  winState={winState}
                  onClick={() => handleSquareClick(index)}
               />
            ))}
         </SimpleGrid>
         {restartDialog()}
      </VStack>
   );
};
