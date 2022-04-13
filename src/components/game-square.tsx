import { Flex, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { BoardValue, Player, WinState } from '../types/game-types';

interface SquareProps {
   value: BoardValue;
   index: number;
   boardSize: number;
   winState: WinState;
   onClick: () => void;
}

export const PlayerColors: Record<Player, string> = {
   X: 'cyan.500',
   O: 'purple.500'
};

export const GameSquare: React.FC<SquareProps> = ({
   value,
   index,
   boardSize,
   winState,
   onClick
}) => {
   const { colorMode } = useColorMode();
   const boardBigness =
      boardSize < 6 ? 'small' : boardSize < 9 ? 'medium' : 'big';

   const mobileStyles = {
      small: { dim: 16, font: '4xl' },
      medium: { dim: 12, font: '2xl' },
      big: { dim: 6, font: 'md' }
   };
   return (
      <Flex
         borderRight={(index + 1) % boardSize !== 0 ? '2px' : 'none'}
         borderBottom={
            index >= boardSize * boardSize - boardSize ? 'none' : '2px'
         }
         w={{ base: mobileStyles[boardBigness].dim, md: 14, lg: 16 }}
         h={{ base: mobileStyles[boardBigness].dim, md: 14, lg: 16 }}
         onClick={onClick}
         justify='center'
         alignItems='center'
         sx={{ transition: 'all 100ms ease' }}
         _active={{
            backgroundColor: colorMode === 'light' ? '#eee' : '#171923'
         }}
         background={
            winState.isWinner &&
            winState.winningIndexes.includes(index) &&
            (colorMode === 'light' ? 'green.200' : 'green.200')
         }
      >
         <Text
            color={value === '' ? '' : PlayerColors[value]}
            fontSize={{
               base: mobileStyles[boardBigness].font,
               md: '4xl',
               lg: '4xl'
            }}
         >
            {value}
         </Text>
      </Flex>
   );
};
