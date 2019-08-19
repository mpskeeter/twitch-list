import { Component, OnInit } from '@angular/core';
import { TwitchKrakenApiService } from '../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-kraken-followed',
  templateUrl: 'twitch-kraken-followed.component.html',
  styleUrls: ['./twitch-kraken-followed.component.scss'],
})
export class TwitchKrakenFollowedComponent implements OnInit {
  constructor(
    public service: TwitchKrakenApiService,
  ) { }

  async ngOnInit() {
    this.service.getUserFollows();
  }
}
