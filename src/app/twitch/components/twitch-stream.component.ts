import { Component, Input } from '@angular/core';
import { TwitchStream } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-stream',
  templateUrl: 'twitch-stream.component.html',
  styleUrls: ['./twitch-stream.component.scss'],
})
export class TwitchStreamComponent {
  @Input() stream: TwitchStream;


}
