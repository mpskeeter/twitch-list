import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { TwitchSharedModule } from './twitch-shared/twitch-shared.module';
// import { TwitchAuthModule } from './twitch-auth/twitch-auth.module';
import { TwitchHelixModule } from './twitch-helix/twitch-helix.module';
// import { TwitchKrakenModule } from './twitch-kraken/twitch-kraken.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    TwitchSharedModule,
    // TwitchAuthModule,
    TwitchHelixModule,
    // TwitchKrakenModule,

    // Keep routing module loaded last
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
