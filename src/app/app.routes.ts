import { Routes } from '@angular/router';
import { LandingPageComponent } from './Pages/landing-page/landing-page.component';
import { LogComponent } from './Pages/log-page/log.component';
import { ProductPageComponent } from './Pages/product-page/product-page.component';

export const routes: Routes = [ 
    {path: 'homepage' , component: LandingPageComponent},
    {path: 'register' , component: LogComponent},
    {path: 'login' , component: LogComponent},
    {path: 'resetpassword' , component: LogComponent},
    {path: 'product/:id' , component: ProductPageComponent},
    {path: '**' , redirectTo: 'homepage'}
];
