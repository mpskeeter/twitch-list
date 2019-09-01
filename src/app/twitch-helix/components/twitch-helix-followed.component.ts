import { Component, OnInit } from '@angular/core';
import { TwitchHelixApiService } from '../services';
import { TwitchLocalStorageService } from '../../twitch-shared/services';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-followed',
  templateUrl: 'twitch-helix-followed.component.html',
  styleUrls: ['./twitch-helix-followed.component.scss'],
})
export class TwitchHelixFollowedComponent implements OnInit {
  constructor(public service: TwitchHelixApiService, private storage: TwitchLocalStorageService) {}

  async ngOnInit() {
    await this.service.getUsersFollowsInitial();
  }
}
