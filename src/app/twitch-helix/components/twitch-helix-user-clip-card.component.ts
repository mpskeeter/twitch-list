import { Component, Input } from '@angular/core';
import { TwitchUser, TwitchSubscriptionSuccess, TwitchClip } from '../models';
import { TwitchKrakenApiService } from '../services';
import { Router } from '@angular/router';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-user-clip-card',
  templateUrl: 'twitch-helix-user-clip-card.component.html',
  styleUrls: ['./twitch-helix-user-clip-card.component.scss'],
  providers: [TwitchKrakenApiService],
})
export class TwitchHelixUserClipCardComponent {
  @Input() user: TwitchUser;
  @Input() clip: TwitchClip;
  // @Output() viewStream = new EventEmitter<any>();
  // @Output() viewClips = new EventEmitter<any>();

  // tslint:disable-next-line: variable-name

  constructor(public router: Router) {}

  // async ngOnInit() {
  //   this._user.next(this.user);
  //   await this.serviceKraken.getSubscription(this.user.id);
  //   // followedStream
  //   // await this.service.getClips({ param: 'user_id', value: userIds });
  //   // clips
  //   // await this.serviceKraken.getClips({
  //   //   param: 'broadcaster_id',
  //   //   value: this.user.id,
  //   // });

  //   combineLatest([this.user$, this.serviceKraken.subscribed$, this.serviceKraken.clips$])
  //     .pipe(
  //       map(([user, subscribed, clips]) => {
  //         user.subscription = subscribed;
  //         // console.log('userID: ', user.id);
  //         // console.log('user Clips: ', clips);
  //         user.clips = clips && clips.data ? clips.data : null;
  //         return user;
  //       }),
  //     )
  //     .subscribe((user) => (this.user = user));
  // }

  isSubscriptionSuccess = (object: any): object is TwitchSubscriptionSuccess => '_id' in object;

  isSubscribed = () => this.isSubscriptionSuccess(this.user.subscription);

  viewClip = (id: string) => {
    this.router.navigate(['/twitch', 'viewclip', id]);
  };
}
