import { Component, OnInit } from '@angular/core';
import { TwitchApiService } from '../services';
import { combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TwitchFollowsDataInterface, TwitchFollows, TwitchStream } from '../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-followed',
  templateUrl: 'twitch-followed.component.html',
  styleUrls: ['./twitch-followed.component.scss'],
})
export class TwitchFollowedComponent implements OnInit {
  constructor(
    public service: TwitchApiService,
  ) { }

  async ngOnInit() {
    this.service.getFollowersInitial();
  }
}
