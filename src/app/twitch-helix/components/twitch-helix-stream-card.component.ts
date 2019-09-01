import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TwitchUser, TwitchSubscriptionSuccess, TwitchClip } from '../models';
import { TwitchKrakenApiService } from '../services';
import { map } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-stream-card',
  templateUrl: 'twitch-helix-stream-card.component.html',
  styleUrls: ['./twitch-helix-stream-card.component.scss'],
  providers: [TwitchKrakenApiService],
})
export class TwitchHelixStreamCardComponent implements OnInit {
  @Input() user: TwitchUser;
  @Input() clip: TwitchClip;
  @Input() enableViewClips = true;

  // tslint:disable-next-line: variable-name
  _user = new BehaviorSubject<TwitchUser>(null);
  user$ = this._user.asObservable();

  // tslint:disable-next-line: variable-name
  _clip = new BehaviorSubject<TwitchClip>(null);
  clip$ = this._clip.asObservable();

  constructor(public serviceKraken: TwitchKrakenApiService, public router: Router) {}

  async ngOnInit() {
    if (this.user) {
      this._user.next(this.user);
      await this.serviceKraken.getSubscription(this.user.id);

      combineLatest([this.user$, this.serviceKraken.subscribed$, this.serviceKraken.clips$])
        .pipe(
          map(([user, subscribed, clips]) => {
            user.subscription = subscribed;
            // console.log('userID: ', user.id);
            // console.log('user Clips: ', clips);
            user.clips = clips && clips.data ? clips.data : null;
            return user;
          }),
        )
        .subscribe((user) => (this.user = user));
    }

    if (this.clip) {
      this._clip.next(this.clip);
    }
  }

  isSubscriptionSuccess = (object: any): object is TwitchSubscriptionSuccess => '_id' in object;

  isSubscribed = () => this.isSubscriptionSuccess(this.user.subscription);

  viewStream = (userName: string) => {
    this.router.navigate(['/twitch', 'viewstream', userName]);
  };

  viewClips = (userName: string) => {
    this.router.navigate(['/twitch', 'viewclips', userName]);
  };
}
