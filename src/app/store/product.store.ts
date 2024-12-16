import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { HttpClientService } from '../services/http.client';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, of, pipe, switchMap, tap } from 'rxjs';
import { Product } from '../models/Product';


type ProductsState = {
    products: Product[] | null; // The normal/standard products
    searchedProducts: Product[] | null; // For the searched products using id or product name
    selectedProduct: Product | null; // For the single selected product for product page
    selectedCategory: string;
    relatedProducts: Product[] | null; // The related products for the product page
    loading: boolean;
}

const initialState: ProductsState = {
    products: null,
    searchedProducts: null,
    selectedProduct: null,
    selectedCategory: '',
    relatedProducts: null,
    loading: false,
};

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, httpClient = inject(HttpClientService),) => ({

        FetchAllProducts: rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(store, { loading: true });
                }),
                // When the rxMethod executes, switchMap creates an inner observable.
                // If FetchAllProducts is triggered again before the previous observable completes, 
                // it unsubscribes from the previous one and subscribes to the new inner observable.
                switchMap(() =>
                    httpClient.getAllProducts().pipe(
                        tap((products: Product[]) => {
                            patchState(store, { products: products, relatedProducts: products, searchedProducts: null, selectedCategory: '', loading: false });
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
                exhaustMap((category: string) =>
                    httpClient.getCategoryProducts(category.toLowerCase()).pipe(
                        tap((products: Product[]) => {
                            patchState(store, { products: products, selectedCategory: category.toLowerCase(), searchedProducts: null, loading: false });
                        },

                        )
                    )
                )
            )
        ),

        SearchForProducts: rxMethod<number | string>(
            pipe(
                tap(() => {
                    patchState(store, { loading: true });
                }),
                // switchMap ensures that only the latest emission (input id) is processed by canceling any ongoing operations for previous emissions.
                switchMap((productInfo: number | string) => {
                    // To return displaying the normal products (not the searched ones)
                    if (productInfo == '') {
                        return of(patchState(store, { loading: false, searchedProducts: null }));
                    }

                    if (typeof (productInfo) === 'string') {
                        // Im trying to do something similar to LIKE clause in Sql to some extent.
                        // We are searching for any match that is already in our database since its a productName not an Id (since its a string)
                        // We aren't sending an http request since fakestoreapi doesnt support searching by productName , only by product Id
                        const itemsInStore = store.products()?.filter(product => product.title.toLowerCase().includes(productInfo.toLowerCase()));
                        if (itemsInStore) {
                            return of(patchState(store, { loading: false, searchedProducts: itemsInStore }));
                        }
                        else {
                            return of(patchState(store, { loading: false }));
                        }
                    }
                    if (typeof (productInfo) === 'number') {
                        // We see if the product is in store, if not we send http request
                        const itemInStore = store.products()?.find(product => product.id == productInfo);
                        if (itemInStore) {
                            return of(patchState(store, { loading: false, searchedProducts: [itemInStore] }));
                        } else {
                            return httpClient.getProduct(+productInfo).pipe(
                                tap((product: any) => {
                                    // Im using an if statement instead of an error inside tapResponse bcz the fakestoreapi just doesn't return anything 
                                    // if the product wasn't found, hence null
                                    if (product === null) {
                                        patchState(store, { searchedProducts: null, loading: false, selectedProduct: null });
                                    } else {
                                        const validProduct: Product = { ...product, quantity: 1 }
                                        patchState(store, { searchedProducts: [product], loading: false, selectedProduct: validProduct });
                                    }
                                },

                                )
                            )
                        }
                    } else {
                        return of(patchState(store, { loading: false }));
                    }
                })
            )
        ),

        TESTER_METHOD_Populate_Products(products: Product[]) {
            patchState(store, { products: products });
        },
    }),

    ),
);
