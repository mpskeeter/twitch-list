import { FullLayoutComponents } from './full-layout';
import { NavbarComponent } from './navbar/navbar.component';
import { CallbackComponent } from './callback/callback.component';
import { ExternalLoginComponent } from './external-login/external-login.component';

export const Components = [[...FullLayoutComponents], NavbarComponent, CallbackComponent, ExternalLoginComponent];

export * from './full-layout';
export * from './navbar/navbar.component';
export * from './callback/callback.component';
export * from './external-login/external-login.component';
