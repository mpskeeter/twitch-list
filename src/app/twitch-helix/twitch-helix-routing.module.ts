import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import {
  TwitchHelixFollowedComponent,
  TwitchHelixFollowedStreamComponent,
  TwitchHelixViewStreamComponent
} from './components';

export const twitchRoutes: Route[] = [
  { path: '', component: TwitchHelixFollowedComponent },
  { path: 'viewstream/:id', component: TwitchHelixViewStreamComponent }
];

// export const twitchRoutes: Route[] = [
//   { path: '',  component: TwitchHelixFollowedComponent,
//     children: [
//       {
//         path: 'viewstream/:id',
//         component: TwitchHelixViewStreamComponent,
//       },
//     ],
//   },
// ];

@NgModule({
  imports: [RouterModule.forChild(twitchRoutes)],
  exports: [RouterModule]
})
export class TwitchHelixRoutingModule {}
