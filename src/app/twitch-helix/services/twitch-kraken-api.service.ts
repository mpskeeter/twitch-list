import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { TwitchSubscriptionError, TwitchSubscriptionSuccess, TwitchClips } from '../models';

import { environment } from '../../../environments/environment';
import { TwitchLocalStorageService } from 'src/app/twitch-shared/services';

interface Parameters {
  param: string;
  value: string[] | string;
}

@Injectable()
export class TwitchKrakenApiService {
  private subscribed = new BehaviorSubject<TwitchSubscriptionError | TwitchSubscriptionSuccess>(null);
  subscribed$ = this.subscribed.asObservable();

  private clips = new BehaviorSubject<TwitchClips>(null);
  clips$ = this.clips.asObservable();

  userAccessToken: string = this.storage.getAccessToken();

  private baseUrl = 'https://api.twitch.tv/';
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private storage: TwitchLocalStorageService) {
    this.initializeHeaders();
  }

  initializeHeaders = (apiVersion: string = 'kraken') => {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    switch (apiVersion) {
      case 'helix':
        if (environment.accessToken) {
          this.headers = this.headers.append('Authorization', `Bearer ${this.userAccessToken}`);
        }
        break;
      case 'kraken':
        this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');
        if (environment.authToken) {
          this.headers = this.headers.append('Authorization', `OAuth ${this.userAccessToken}`);
        }
        break;
    }
  };

  BuildAPIParams = (params: any[]): string => {
    return (
      '?' +
      params
        .map((param) => {
          if (!param) {
            return '';
          } else if (typeof param.value === 'string') {
            return `${param.param}=${param.value}`;
          } else if (Array.isArray(param.value)) {
            return param.value.map((value) => `${param.param}=${value}`).join('&');
          }
        })
        .join('&')
    );
  };

  buildFullBaseUrl = (url: string, apiVersion: string = 'kraken') => {
    this.initializeHeaders(apiVersion);
    return `${this.baseUrl}${apiVersion}${url}`;
  };

  buildUrl = (url: string, params: any[] = [], apiVersion: string = 'kraken') => {
    return `${this.buildFullBaseUrl(url, apiVersion)}${this.BuildAPIParams(params)}`;
  };

  getClips = (params: Parameters | Parameters[]) => {
    this.initializeHeaders();
    const url = '/clips';

    if (!Array.isArray(params)) {
      params = [params];
    }
    params.push({ param: 'limit', value: '100' });
    const apiUrl = this.buildUrl(url, params, 'helix');

    this.http
      .get<TwitchClips>(`${apiUrl}`, { headers: this.headers })
      .subscribe((data) => this.clips.next(data), (err) => {});
  };

  getSubscription = (channelId: string) => {
    this.initializeHeaders('kraken');

    const url = `/users/${environment.userId}/subscriptions/${channelId}`;
    const apiUrl = this.buildFullBaseUrl(url);
    this.http
      .get<TwitchSubscriptionError | TwitchSubscriptionSuccess>(apiUrl, { headers: this.headers })
      .subscribe((data) => this.subscribed.next(data), (err) => this.subscribed.next(err.error));

    this.getClips({ param: 'broadcaster_id', value: channelId });
  };
}
