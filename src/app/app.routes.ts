import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LogComponent } from './authentication/log/log.component';

export const routes: Routes = [ 
    {path: 'homepage' , component: LandingPageComponent},
    {path: 'register' , component: LogComponent},
    {path: 'login' , component: LogComponent},
    {path: 'resetpassword' , component: LogComponent},
    {path: '**' , redirectTo: 'homepage'}
];
