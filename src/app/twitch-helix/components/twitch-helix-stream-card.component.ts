import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  TwitchUser,
  TwitchSubscriptionSuccess,
  TwitchSubscriptionError
} from '../models';
import { TwitchKrakenApiService } from '../services';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-stream-card',
  templateUrl: 'twitch-helix-stream-card.component.html',
  styleUrls: ['./twitch-helix-stream-card.component.scss'],
  providers: [TwitchKrakenApiService]
})
export class TwitchHelixStreamCardComponent implements OnInit {
  // @Input() stream: TwitchStream;
  @Input() user: TwitchUser;
  @Output() view = new EventEmitter<any>();

  // tslint:disable-next-line: variable-name
  _user = new BehaviorSubject<TwitchUser>(null);
  user$ = this._user.asObservable();

  emptySubscription: TwitchSubscriptionSuccess;

  constructor(public service: TwitchKrakenApiService) {}

  async ngOnInit() {
    this._user.next(this.user);
    await this.service.getSubscription(this.user.id);
    combineLatest([this.user$, this.service.subscribed$])
      .pipe(
        map(([user, subscribed]) => {
          user.subscription = subscribed;
          return user;
        })
      )
      .subscribe(user => (this.user = user));
  }

  isSubscriptionSuccess = (object: any): object is TwitchSubscriptionSuccess =>
    '_id' in object

  isSubscribed = () => this.isSubscriptionSuccess(this.user.subscription);
}
