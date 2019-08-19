import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { TwitchKrakenFollowedComponent, TwitchKrakenFollowedStreamComponent } from './components';
import { TwitchKrakenFollowedComponent } from './components';

const twitchRoutes: Routes = [
  { path: 'twitch',  component: TwitchKrakenFollowedComponent,
    // children: [
    //   { path: 'streams',  component: TwitchKrakenFollowedStreamComponent },
    // ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(twitchRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TwitchKrakenRoutingModule { }
