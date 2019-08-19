import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { TwitchModule } from './twitch/twitch.module';

const routes: Route[] = [
  { path: 'twitch', component: TwitchModule },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
