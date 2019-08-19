import { Component, Input } from '@angular/core';
import { TwitchStream, TwitchChannel } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-kraken-stream',
  templateUrl: 'twitch-kraken-stream.component.html',
  styleUrls: ['./twitch-kraken-stream.component.scss'],
})
export class TwitchKrakenStreamComponent {
  @Input() channel: TwitchChannel;
}
