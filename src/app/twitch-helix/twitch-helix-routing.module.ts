import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

import {
  TwitchHelixFollowedComponent,
  TwitchHelixFollowedStreamComponent,
  TwitchHelixUserClipsComponent,
  TwitchHelixViewClipComponent,
  TwitchHelixViewStreamComponent,
} from './components';

export const twitchRoutes: Route[] = [
  { path: '', component: TwitchHelixFollowedComponent },
  { path: 'viewstream/:id', component: TwitchHelixViewStreamComponent },
  { path: 'viewclips/:id', component: TwitchHelixUserClipsComponent },
  { path: 'viewclip/:id', component: TwitchHelixViewClipComponent },
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
  exports: [RouterModule],
})
export class TwitchHelixRoutingModule {}
