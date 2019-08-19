import {
  TwitchStream,
  TwitchPagination,
} from './';

export interface TwitchStreams {
  _total: number;
  streams: TwitchStream[];
}
