import { Component, OnInit, OnDestroy } from '@angular/core';
import { TwitchHelixApiService, TwitchKrakenApiService } from '../services';
// import { DynamicScriptLoaderService } from '../services';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { TwitchUser } from '../models';
import { map } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'twitch-helix-view-clip',
  templateUrl: 'twitch-helix-view-clip.component.html',
  styleUrls: ['./twitch-helix-view-clip.component.scss'],
  providers: [TwitchKrakenApiService],
})
export class TwitchHelixViewClipComponent implements OnInit, OnDestroy {
  clipId: string[] | string;
  routeSub: Subscription;

  // users: TwitchUser[];

  users = new BehaviorSubject<TwitchUser[]>(null);
  users$ = this.users.asObservable();

  width = 400;
  height = 400;

  constructor(
    // public service: TwitchHelixApiService,
    public serviceKraken: TwitchKrakenApiService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    // this.scriptLoader.loadScript('twitch-embed');
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(async (param: ParamMap) => {
      if (param.has('id')) {
        this.clipId = param.get('id').split(',');
        console.log('clipId: ', this.clipId);

        await this.serviceKraken.getClips({ param: 'id', value: this.clipId });
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
