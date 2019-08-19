import {
  TwitchStream,
  TwitchPagination,
} from './';

export interface TwitchStreams {
  data: TwitchStream[];
  pagination: TwitchPagination;
}
