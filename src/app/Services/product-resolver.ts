import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { ProductStore } from "../store/product.store";

export const productResolver : ResolveFn<void> = (route: ActivatedRouteSnapshot) => {
    const productStore = inject(ProductStore);
    return productStore.SelectProduct(+route.params['id']).unsubscribe();
};