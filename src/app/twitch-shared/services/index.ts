import { TwitchAuthService } from './twitch-auth.service';
import { TwitchBaseService } from './twitch-base.service';
import { TwitchLocalStorageService } from './twitch-local-storage.service';

export const Services = [
  TwitchBaseService,
  TwitchAuthService,
  TwitchLocalStorageService,
];

export * from './twitch-auth.service';
export * from './twitch-base.service';
export * from './twitch-local-storage.service';
