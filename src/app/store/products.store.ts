import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { HttpClientService } from '../services/http.client';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../models/Product';


type ProductsState = {
    products: Product[] | null;
    selectedProduct: Product | null;
}

const initialState: ProductsState = {
    products: null,
    selectedProduct: null
};

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, httpClient = inject(HttpClientService),) => ({

        FetchAllProducts: rxMethod<void>(
            pipe(
                // When the rxMethod executes, switchMap creates an inner observable.
                // If FetchAllProducts is triggered again before the previous observable completes, 
                // it unsubscribes from the previous one and subscribes to the new inner observable.
                switchMap(() =>
                    httpClient.getAllProducts().pipe(
                        tap((products: Product[]) => {
                            patchState(store, { products: products });
                        },
                           
                        )
                    )
                )
            )
        ),

    }))

);
