import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [ 
    {path: 'homepage' , component: LandingPageComponent},
    {path: '**' , redirectTo: 'homepage'}
];
