import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { AuthEffects } from './auth/store/auth.effects';
import { provideEffects } from '@ngrx/effects';
import * as fromApp from './store/app.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled', // lets the user go back to where he left
    })),
    provideAnimationsAsync(),
    provideStore(fromApp.appReducer),
    provideEffects([AuthEffects])
]
};
