import { Component, OnInit } from '@angular/core';
import { TwitchHelixApiService } from '../services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-followed',
  templateUrl: 'twitch-helix-followed.component.html',
  styleUrls: ['./twitch-helix-followed.component.scss']
})
export class TwitchHelixFollowedComponent implements OnInit {
  constructor(public service: TwitchHelixApiService) {}

  async ngOnInit() {
    await this.service.getUsersFollowsInitial();
  }
}
