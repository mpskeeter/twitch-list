import { LocalStorageService } from 'ngx-localstorage';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TwitchLocalStorageService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  accessToken = new BehaviorSubject<string>(null);
  accessToken$ = this.accessToken.asObservable();

  state = new BehaviorSubject<string>(null);
  state$ = this.state.asObservable();

  originalState = new BehaviorSubject<string>(null);
  originalState$ = this.originalState.asObservable();

  refreshToken = new BehaviorSubject<string>(null);
  refreshToken$ = this.refreshToken.asObservable();

  expiresIn = new BehaviorSubject<string>(null);
  expiresIn$ = this.expiresIn.asObservable();

  accessTokenKey = 'user-access-token';
  stateKey = 'user-access-token-state';
  originalStateKey = 'original-state';
  refreshTokenKey = 'user-refresh-token';
  expiresInKey = 'user-expires-in';
  userIdKey = 'user-user-id';

  constructor(private storage: LocalStorageService) {
    this.storage
      .asPromisable()
      .get(this.accessTokenKey)
      .then((value: string) => this.isLoggedIn.next(value !== null));
  }

  logout = (): void => {
    this.storage.clear();
    this.storage
      .asPromisable()
      .get(this.accessTokenKey)
      .then((value: string) => this.isLoggedIn.next(value !== null));
  };

  getOriginalState = (): string => {
    return this.storage.get(this.originalStateKey);
  };

  setOriginalState = (state: string) => {
    this.storage.set(this.originalStateKey, state);
  };

  deleteOriginalState = (): void => {
    this.storage.remove(this.originalStateKey);
  };

  getAccessToken = (): string => {
    this.storage
      .asPromisable()
      .get(this.accessTokenKey)
      .then((value: string) => this.isLoggedIn.next(value !== null));

    return this.storage.get(this.accessTokenKey);
  };

  setAccessToken = (token: string) => {
    this.isLoggedIn.next(token !== null);
    this.storage.set(this.accessTokenKey, token);
  };

  getAccessState = (): string => {
    return this.storage.get(this.stateKey);
  };

  setAccessState = (state: string) => {
    this.storage.set(this.stateKey, state);
  };

  getRefreshToken = (): string => {
    return this.storage.get(this.refreshTokenKey);
  };

  setRefreshToken = (token: string) => {
    this.storage.set(this.refreshTokenKey, token);
  };

  getExpiresIn = (): number => {
    return parseInt(this.storage.get(this.expiresInKey), 10);
  };

  setExpiresIn = (time: number) => {
    this.storage.set(this.expiresInKey, time.toString());
  };

  getUserId = (): string => {
    return this.storage.get(this.userIdKey);
  };

  setUserId = (userId: string) => {
    this.storage.set(this.userIdKey, userId);
  };
}
