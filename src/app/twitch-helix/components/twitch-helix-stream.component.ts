import { Component, Input, OnInit } from '@angular/core';
import { TwitchStream } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-stream',
  templateUrl: 'twitch-helix-stream.component.html',
  styleUrls: ['./twitch-helix-stream.component.scss'],
})
export class TwitchHelixStreamComponent implements OnInit {
  @Input() stream: TwitchStream;

  ngOnInit() {
    // console.log('stream: ', this.stream);
  }
}
