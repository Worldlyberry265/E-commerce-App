import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LogComponent } from './authentication/log/log.component';
import { ProductPageComponent } from './products/product-page/product-page.component';

export const routes: Routes = [ 
    {path: 'homepage' , component: LandingPageComponent},
    {path: 'register' , component: LogComponent},
    {path: 'login' , component: LogComponent},
    {path: 'resetpassword' , component: LogComponent},
    {path: 'product/:id' , component: ProductPageComponent},
    {path: '**' , redirectTo: 'homepage'}
];
