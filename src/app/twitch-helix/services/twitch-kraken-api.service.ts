import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { TwitchSubscriptionError, TwitchSubscriptionSuccess, TwitchClips } from '../models';
import { TwitchLocalStorageService, TwitchBaseService, Parameter } from '../../twitch-shared/services';

@Injectable()
export class TwitchKrakenApiService extends TwitchBaseService {
  private subscribed = new BehaviorSubject<TwitchSubscriptionError | TwitchSubscriptionSuccess>(null);
  subscribed$ = this.subscribed.asObservable();

  private clips = new BehaviorSubject<TwitchClips>(null);
  clips$ = this.clips.asObservable();

  private baseUrl = 'https://api.twitch.tv/';

  constructor(
    public http: HttpClient,
    public storage: TwitchLocalStorageService
  ) {
    super(http, storage);
    this.initializeHeaders();
  }

  initializeHeaders = (apiVersion: string = 'kraken') => {
    super.initializeHeaders();
    if (apiVersion === 'helix') {
      this.headers = this.headers.delete('Accept');
      this.headers = this.headers.delete('dataType');
    }
    if (this.AccessToken) {
      this.headers = this.headers.append('Authorization', `${apiVersion === 'helix' ? 'Bearer' : 'OAuth'} ${this.AccessToken}`);
    }
  };

  buildFullBaseUrl = (url: string, apiVersion: string = 'kraken') => {
    this.initializeHeaders(apiVersion);
    return `${this.baseUrl}${apiVersion}${url}`;
  };

  buildUrl = (url: string, params: any[] = [], apiVersion: string = 'kraken') => {
    return `${this.buildFullBaseUrl(url, apiVersion)}${this.BuildAPIParams(params)}`;
  };

  getClips = (params: Parameter | Parameter[]) => {
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

    const url = `/users/${this.storage.getUserId()}/subscriptions/${channelId}`;
    const apiUrl = this.buildFullBaseUrl(url);
    this.http
      .get<TwitchSubscriptionError | TwitchSubscriptionSuccess>(apiUrl, { headers: this.headers })
      .subscribe((data) => this.subscribed.next(data), (err) => this.subscribed.next(err.error));

    this.getClips({ param: 'broadcaster_id', value: channelId });
  };
}
