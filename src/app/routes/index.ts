import { Route } from '@angular/router';
// import { UserComponents, RedirectedComponent } from './user';
import { TwitchModule } from '../twitch/twitch.module';

export const RouteComponents = [
  // [...UserComponents],
];

export const Routes: Route[] = [
  // { path: 'redirected', component: RedirectedComponent },
  { path: 'twitch', component: TwitchModule },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
