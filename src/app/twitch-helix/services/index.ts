import { TwitchHelixApiService } from './twitch-helix-api.service';
import { TwitchKrakenApiService } from './twitch-kraken-api.service';
import { DynamicScriptLoaderService } from './dynamic-script-loader.service';

export const Services = [TwitchHelixApiService, TwitchKrakenApiService, DynamicScriptLoaderService];

export * from './twitch-helix-api.service';
export * from './twitch-kraken-api.service';
export * from './dynamic-script-loader.service';
