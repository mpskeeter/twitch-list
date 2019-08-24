import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { TwitchHelixModule } from './twitch-helix/twitch-helix.module';
import { TwitchHelixFollowedComponent } from './twitch-helix/components';
import { twitchRoutes } from './twitch-helix/twitch-helix-routing.module';

const routes: Route[] = [
  // { path: 'twitch', component: TwitchHelixFollowedComponent },
  // { path: 'twitch', component: TwitchHelixModule },
  {
    path: 'twitch',
    // component: TwitchHelixFollowedComponent,
    children: twitchRoutes
  },
  { path: '', redirectTo: 'twitch', pathMatch: 'full' },
  { path: '**', redirectTo: 'twitch', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
