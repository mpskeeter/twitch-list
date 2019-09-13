import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TwitchUser, TwitchClip, TwitchSubscriptionSuccess } from '../../models';

@Component({
  selector: 'twitch-stream-card',
  templateUrl: './twitch-stream-card.component.html',
  styleUrls: ['./twitch-stream-card.component.scss']
})
export class TwitchStreamCardComponent {
  @Input() user: TwitchUser;
  @Input() clip: TwitchClip;
  @Input() enableViewClips = true;

  constructor(
    public router: Router,
  ) { }

  isSubscriptionSuccess = (object: any): object is TwitchSubscriptionSuccess => '_id' in object;

  isSubscribed = () => this.isSubscriptionSuccess(this.user.subscription);

  viewStream = (userName: string) => {
    this.router.navigate(['/twitch', 'viewstream', userName]);
  };

  viewClips = (userName: string) => {
    this.router.navigate(['/twitch', 'viewclips', userName]);
  };
}
