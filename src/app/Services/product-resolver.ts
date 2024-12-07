import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { ProductStore } from "../store/product.store";
import { of } from "rxjs";

export const productResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot) => {
    const productStore = inject(ProductStore);
    // we dont need to return anything and fetch from the resolver as we will fetch from the store, we only dispatch from here
    productStore.SearchForProducts(+route.params['id']);
};