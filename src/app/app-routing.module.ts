import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { twitchRoutes } from './twitch-helix/twitch-helix-routing.module';
import { AppComponent } from './app.component';
import { ExternalLoginComponent, CallbackComponent } from './twitch-shared/components';
import { AuthGuard } from './twitch-shared/guards';

const routes: Routes = [
  { path: 'callback', component: CallbackComponent },
  { path: 'externalLogin', component: ExternalLoginComponent },
  { path: 'home', component: AppComponent },
  { path: 'twitch', children: twitchRoutes, canActivate: [AuthGuard] },
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: '**', redirectTo: 'twitch', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
