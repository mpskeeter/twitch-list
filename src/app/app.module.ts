import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Routes } from './routes';
import { RouterModule } from '@angular/router';
import { TwitchHelixModule } from './twitch-helix/twitch-helix.module';
import { MaterialModule } from './material.module';
// import { TwitchKrakenModule } from './twitch-kraken/twitch-kraken.module';

@NgModule({
  declarations: [
    AppComponent,
    // [...RouteComponents],
  ],
  imports: [
    RouterModule.forRoot(Routes),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    TwitchHelixModule,
    // TwitchKrakenModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
