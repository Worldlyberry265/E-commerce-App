import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/Product';
import { ProductStore } from './product.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, forkJoin, from, of, pipe, tap } from 'rxjs';
import { HttpClientService } from '../services/http.client';
import { tapResponse } from '@ngrx/operators';

type WeatherState = {
    weatherCodes: number[],
    menFramedProduct: Product | null,
    womenFramedProduct: Product | null,
}

const initialState: WeatherState = {
    weatherCodes: [],
    menFramedProduct: null,
    womenFramedProduct: null
};

export const WeatherStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, httpClient = inject(HttpClientService), productStore = inject(ProductStore)) => {

        const GetWeatherCodes = rxMethod<void>(
            pipe(
                tap(() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            RequestWeatherCodes({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                        },
                        (error) => {
                            alert(error.message);
                        }

                    );
                })
            )
        );

        const RequestWeatherCodes = rxMethod<{ latitude: number, longitude: number }>(
            pipe(
                exhaustMap((coordinates: { latitude: number, longitude: number }) => {
                    return httpClient.getWeatherCodes(coordinates).pipe(
                        tapResponse({

                            next: (weatherCodes: any) => {
                                patchState(store, { weatherCodes: weatherCodes.daily.weather_code })
                            },
                            error: () => {

                            }
                        })
                    )

                })
            )
        );

        const GetFramedProducts = rxMethod<{ menProducId: number, womenProductId: number }>(
            pipe(
                exhaustMap(({ menProducId, womenProductId }) => {
                    // forkJoin allows both requests to run in parallel and ensures the state is updated when both are complete.
                    return forkJoin([
                        httpClient.getProduct(menProducId).pipe(
                            tap((product: Product) => {
                                patchState(store, { menFramedProduct: product });
                            })
                        ),
                        httpClient.getProduct(womenProductId).pipe(
                            tap((product: Product) => {
                                patchState(store, { womenFramedProduct: product });
                            })
                        ),
                    ]);
                })
            )
        );





        return { GetWeatherCodes, GetFramedProducts }

    }),

);
