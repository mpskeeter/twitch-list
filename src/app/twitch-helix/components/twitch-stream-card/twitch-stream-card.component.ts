import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TwitchUser, TwitchClip } from '../../models';

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

  viewStream = (userName: string) => {
    this.router.navigate(['/twitch', 'viewstream', userName]);
  };

  viewClips = (userName: string) => {
    this.router.navigate(['/twitch', 'viewclips', userName]);
  };
}
