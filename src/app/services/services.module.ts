import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Services } from '.';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    [...Services]
  ]
})
export class ServicesModule {
  constructor(@Optional() @SkipSelf() parentModule: ServicesModule) {
    if (parentModule) {
        throw new Error(
            'ServicesModule is already loaded. Import it in the AppModule only');
    }
  }
}
