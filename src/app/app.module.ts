import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TwitchHelixModule } from './twitch-helix/twitch-helix.module';
import { MaterialModule } from './material.module';
// import { TwitchKrakenModule } from './twitch-kraken/twitch-kraken.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    TwitchHelixModule,
    // TwitchKrakenModule,

    // Keep routin module loaded last
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
