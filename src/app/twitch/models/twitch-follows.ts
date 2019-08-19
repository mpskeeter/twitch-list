import { TwitchPagination } from './';

// {
//   "from_id":"123362174",
//   "from_name":"mpskeeter",
//   "to_id":"125911061",
//   "to_name":"s_cray_cray",
//   "followed_at":"2019-07-05T02:50:14Z"
// }

export interface TwitchFollowsDataInterface {
  from_id: string;
  from_name: string;
  to_id: string;
  to_name: string;
  followed_at: Date;
}

export interface TwitchFollows {
  data: TwitchFollowsDataInterface[];
  pagination: TwitchPagination;
  total: number;
}


