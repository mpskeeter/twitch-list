import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TwitchHelixFollowedComponent, TwitchHelixFollowedStreamComponent } from './components';

const twitchRoutes: Routes = [
  { path: 'twitch',  component: TwitchHelixFollowedComponent,
    children: [
      { path: 'streams',  component: TwitchHelixFollowedStreamComponent },
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
export class TwitchHelixRoutingModule { }
