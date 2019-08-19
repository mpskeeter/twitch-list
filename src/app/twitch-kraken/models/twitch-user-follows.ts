import { TwitchChannel } from '.';

export interface TwitchUserFollows {
  created_at: Date;
  notifications: boolean;
  channel: TwitchChannel;
}
