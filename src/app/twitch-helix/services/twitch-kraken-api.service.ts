import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { TwitchSubscriptionError, TwitchSubscriptionSuccess } from '../models';

import { environment } from '../../../environments/environment';

@Injectable()
export class TwitchKrakenApiService {
  private subscribed = new BehaviorSubject<
    TwitchSubscriptionError | TwitchSubscriptionSuccess
  >(null);
  subscribed$ = this.subscribed.asObservable();

  private baseUrl = 'https://api.twitch.tv/';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.initializeHeaders();
  }

  initializeHeaders = () => {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    this.headers = this.headers.append(
      'Accept',
      'application/vnd.twitchtv.v5+json'
    );
    if (environment.authToken) {
      this.headers = this.headers.append(
        'Authorization',
        `OAuth ${environment.authToken}`
      );
    }
  }

  BuildAPIParams = (params: any[]): string => {
    return (
      '?' +
      params
        .map(param => {
          if (!param) {
            return '';
          } else if (typeof param.value === 'string') {
            return `${param.param}=${param.value}`;
          } else if (Array.isArray(param.value)) {
            return param.value
              .map(value => `${param.param}=${value}`)
              .join('&');
          }
        })
        .join('&')
    );
  }

  buildFullBaseUrl = (url: string, apiVersion: string = 'kraken') => {
    this.initializeHeaders();
    return `${this.baseUrl}${apiVersion}${url}`;
  }

  buildUrl = (
    url: string,
    params: any[] = [],
    apiVersion: string = 'kraken'
  ) => {
    return `${this.buildFullBaseUrl(url, apiVersion)}${this.BuildAPIParams(
      params
    )}`;
  }

  getSubscription = (channelId: string) => {
    this.initializeHeaders();

    const url = `/users/${environment.userId}/subscriptions/${channelId}`;

    const apiUrl = this.buildFullBaseUrl(url);
    // this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');

    // console.log('headers: ', this.headers);

    this.http
      .get<TwitchSubscriptionError | TwitchSubscriptionSuccess>(
        // (`https://cors-anywhere.herokuapp.com/${apiUrl}`, { headers: this.headers })
        apiUrl,
        { headers: this.headers }
      )
      .subscribe(
        data => {
          console.log('getSubscription: data: ', data);
          // if (data instanceof TwitchSubscriptionSuccess) {
          //   this.subscription.next(data);
          // }
          this.subscribed.next(data);
        },
        err => this.subscribed.next(err.error)
        // err => this.snacker.sendErrorMessage(err.error)
        // err => console.log('getSubscription: error: ', err),
      );
  }
}
