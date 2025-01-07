import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LogComponent } from './pages/log-page/log.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { productResolver } from './services/product-resolver';
import { JwtValidationGuard } from './services/auth/password-change-guard.service';


export const routes: Routes = [
    { path: 'homepage', component: LandingPageComponent },


    {
        path: 'register',
        loadComponent: () =>
            import('./pages/log-page/log.component').then((m) => m.LogComponent),
    },

    {
        path: 'login',
        loadComponent: () =>
            import('./pages/log-page/log.component').then((m) => m.LogComponent),
    },

    {
        path: 'password-change',
        loadComponent: () =>
            import('./pages/password-change/password-change.component').then((m) => m.PasswordChangeComponent),
        canActivate: [JwtValidationGuard]
    },

    // Didn't lazy load the product page because it won't display the loading spinner with lazy loading
    { path: 'product/:id', component: ProductPageComponent, resolve: { product: productResolver } },

    // {
    //     path: 'product/:id',
    //     loadComponent: () =>
    //         import('./pages/product-page/product-page.component').then((m) => m.ProductPageComponent),
    //     resolve: { product: productResolver },
    // },

    { path: '**', redirectTo: 'homepage' }
];
