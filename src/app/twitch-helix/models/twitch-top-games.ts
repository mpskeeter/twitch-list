import { TwitchTopGame, TwitchPagination } from '.';

export interface TwitchTopGames {
  data: TwitchTopGame[];
  pagination: TwitchPagination;
}
