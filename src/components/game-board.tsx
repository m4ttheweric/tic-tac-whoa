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
   NumberDecrementStepper,
   NumberIncrementStepper,
   NumberInput,
   NumberInputField,
   NumberInputStepper,
   SimpleGrid,
   Stack,
   Text,
   VStack
} from '@chakra-ui/react';
import React from 'react';
import { MAX_BOARD_SIZE, MIN_BOARD_SIZE, useGame } from './game-board.hooks';
import { GameSquare, PlayerColors } from './game-square';

export const GameBoard = () => {
   const {
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
      onShowGameWarning,
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

   const gameSizeInput = () => (
      <InputGroup alignSelf='center'>
         <InputLeftAddon children={'Board Size'} />
         <NumberInput
            maxW={32}
            min={MIN_BOARD_SIZE}
            max={MAX_BOARD_SIZE}
            value={boardSizeInputVal}
            onChange={v => handleChangeBoardSize(v)}
            placeholder='Game Size'
            isDisabled={gameIsInProgress}
            onClick={handleGameSizeInputClick}
         >
            <NumberInputField
               sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            />
            <NumberInputStepper>
               <NumberIncrementStepper />
               <NumberDecrementStepper />
            </NumberInputStepper>
         </NumberInput>
      </InputGroup>
   );

   const gameControls = () => (
      <Stack direction={{ sm: 'column', md: 'row' }}>
         <VStack justify={'center'}>
            {gameSizeInput()}
            {resizeError && (
               <Text maxW={220} fontSize={'sm'} color={'red.500'}>
                  You cannot resize the board while a game is in progress.
               </Text>
            )}
            {boardSizeInvalid && (
               <Text color={'red.500'}>
                  {`Enter an integer between ${MIN_BOARD_SIZE} and ${MAX_BOARD_SIZE}`}
               </Text>
            )}
         </VStack>

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
      <Stack direction={{ sm: 'column', md: 'row' }}>
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
            <Text color={PlayerColors[player]} fontSize='xl'>{`${
               player === 'X' ? xPlayer : oPlayer
            }'s turn...`}</Text>
         )}
         {winState.isWinner && (
            <HStack>
               <Text
                  fontSize={'3xl'}
                  color={PlayerColors[winState.winningPlayer]}
               >
                  {`${winState.winningPlayer === 'X' ? xPlayer : oPlayer}`}
               </Text>
               <Text fontSize={'3xl'}>is the winner! 🚀 🎉</Text>
            </HStack>
         )}
         {winState.catsGame && <Text fontSize={'3xl'}>😿 Cat's Game 😿</Text>}
      </>
   );
   return (
      <VStack spacing={8}>
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
