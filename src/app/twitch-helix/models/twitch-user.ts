import {
  TwitchStream,
  TwitchSubscriptionError,
  TwitchSubscriptionSuccess
} from './';

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  stream?: TwitchStream;
  subscription?: TwitchSubscriptionError | TwitchSubscriptionSuccess;
}
