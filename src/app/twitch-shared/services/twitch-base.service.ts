import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { TwitchLocalStorageService } from './twitch-local-storage.service';
import { TwitchUser, TwitchUsers } from '../../twitch-helix/models';

import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';

export interface Parameter {
  param: string;
  value: string[] | string;
}

@Injectable()
export class TwitchBaseService {
  private user = new BehaviorSubject<TwitchUser>(null);
  public user$ = this.user.asObservable();

  protected headers: HttpHeaders;
  protected AccessToken: string;

  constructor(
    public http: HttpClient,
    public storage: TwitchLocalStorageService
  ) {
    this.AccessToken = this.storage.getAccessToken();
  }

  protected initializeHeaders() {
    this.headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.headers = this.headers.append('Client-ID', environment.twitchClientId);
    this.headers = this.headers.append('Accept', 'application/vnd.twitchtv.v5+json');
    this.headers = this.headers.append('dataType', 'jsonp');
  }

  BuildAPIParams = (params: Parameter[]): string => {
    let retValue = params
      .map((param) => {
        if (!param) {
          return '';
        } else if (typeof param.value === 'string') {
          return `${param.param}=${param.value}`;
        } else if (Array.isArray(param.value)) {
          return param.value.map((value: string) => `${param.param}=${value}`).join('&');
        }
      })
      .join('&');

    if (retValue !== ([] || '')) {
      retValue = '?' + retValue;
    }

    return retValue;
  };

  getUser = () => {
    const accessToken = this.storage.getAccessToken();
    if (accessToken) {
      const url = 'https://api.twitch.tv/helix/users';

      this.initializeHeaders();
      this.headers = this.headers.delete('dataType');
      this.headers = this.headers.delete('Accept');
      this.headers = this.headers.append('Authorization', `Bearer ${accessToken}`);

      console.log('headers: ', this.headers);

      this.http
        .get<TwitchUsers>(url, { headers: this.headers })
        .pipe(
          tap((users: TwitchUsers) => console.log(users)),
          map((users: TwitchUsers) => users.data[0]),
        )
        .subscribe(
          (data: TwitchUser) => this.user.next(data),
          (error) => console.log('getUser: error: ', error)
        );
    }
  };
}
