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
    selectedProduct: Product | null; // OR SEARCHED
    // searchedProducts: Product[] | null;
    selectedCategory : string;
    loading : boolean;
}

const initialState: ProductsState = {
    products: null,
    selectedProduct: null,
    // searchedProducts: null,
    selectedCategory: '',
    loading: false,
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
        FetchCategoryProducts: rxMethod<string>(
            pipe(
                tap(() => {
                    patchState(store, { loading: true });
                }),
                //All subsequent login requests are ignored until the current request finishes due to exhaustMap.
                exhaustMap((category : string) =>
                    httpClient.getCategoryProducts(category).pipe(
                        tap((products: Product[]) => {
                            patchState(store, { products: products, selectedCategory: category, loading: false  });
                        },
                           
                        )
                    )
                )
            )
        ),

        SearchForAProduct : rxMethod<number | string> (
            pipe(
                tap(() => {
                    patchState(store, { loading: true });
                }),
                // switchMap ensures that only the latest emission (input id) is processed by canceling any ongoing operations for previous emissions.
                switchMap(( id : number | string) => {
                    const itemInStore = store.products()?.find( product => product.id === id);
                    if(itemInStore) {
                        return of(patchState( store , {loading: false , selectedProduct : itemInStore}));
                    }
                    else {
                        return httpClient.getProduct(id).pipe(
                            tap((product: Product) => {
                                console.log("yes from store");
                                
                                console.log(product);
                                
                                patchState(store, { selectedProduct: product, loading: false  });
                            },
                               
                            ) 
                        )
                    }
                })
            )
        ),



    }))

);
