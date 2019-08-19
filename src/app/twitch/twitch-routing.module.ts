import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TwitchFollowedComponent, TwitchFollowedStreamComponent } from './components';

const twitchRoutes: Routes = [
  { path: 'twitch',  component: TwitchFollowedComponent,
    children: [
      { path: 'streams',  component: TwitchFollowedStreamComponent },
    ]
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
export class TwitchRoutingModule { }
