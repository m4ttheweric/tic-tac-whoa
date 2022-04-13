export type Player = 'X' | 'O';

export type BoardValue = Player | '';

export interface WinState {
   isWinner: boolean;
   catsGame: boolean;
   winningPlayer: Player;
   winningIndexes: number[];
}
