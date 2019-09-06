import {
  TwitchPagination,
  TwitchUsersFollowsData,
} from './';

export interface TwitchUsersFollows {
  data: TwitchUsersFollowsData[];
  pagination: TwitchPagination;
  total: number;
}


