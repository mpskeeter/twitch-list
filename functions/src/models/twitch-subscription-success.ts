import { TwitchChannel } from './twitch-channel';

// tslint:disable: variable-name
export interface TwitchSubscriptionSuccess {
  _id: string;
  sub_plan: string;
  sub_plan_name: string;
  channel: TwitchChannel;
  created_at: Date;
}
// tslint:enable: variable-name
