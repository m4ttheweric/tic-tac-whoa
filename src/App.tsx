import {
   ChakraProvider,
   Flex,
   HStack,
   Text,
   theme,
   VStack
} from '@chakra-ui/react';
import * as React from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { GameBoard } from './components/game-board';
import { PlayerColors } from './components/game-square';

export const App = () => (
   <ChakraProvider theme={theme}>
      <Flex maxW={1800} m='auto' direction='column' p={{ base: 4, md: 10 }}>
         <ColorModeSwitcher alignSelf={'flex-end'} />
         <VStack spacing={{ base: 2, md: 8 }}>
            <HStack>
               <Text color={PlayerColors.X} fontSize={'6xl'}>
                  Tic
               </Text>
               <Text color={PlayerColors.O} fontSize={'6xl'}>
                  Tac
               </Text>
               <Text color={'red.400'} fontSize={'6xl'}>
                  WHOA
               </Text>
            </HStack>

            <GameBoard />
         </VStack>
      </Flex>
   </ChakraProvider>
);
