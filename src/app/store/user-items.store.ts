import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/Product';
import { ProductStore } from './product.store';

type UserItemsState = {
    cartItems: Product[],
    savedItems: Product[],
    removedItemId: number, // To toggle the item icons from the dialog preview
}

const initialState: UserItemsState = {
    cartItems: [],
    savedItems: [],
    removedItemId: 0
};

export const UserItemsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => {

        function SaveItem(product: Product) {
            patchState(store, (state) => ({ savedItems: [...state.savedItems, product] }));
        }
        function AddItemToCart(product: Product) {
            patchState(store, (state) => ({ cartItems: [...state.cartItems, product] }));
        }
        function RemoveSavedItem(product: Product) {
            patchState(store, (state) =>
                ({ savedItems: state.savedItems.filter(productItem => productItem.id != product.id) }));
        }
        function RemoveItemFromCart(product: Product) {
            patchState(store, (state) =>
                ({ cartItems: state.cartItems.filter(productItem => productItem.id != product.id) }));
        }
        function ToggleItemIcon(productId: number) {
            patchState(store, { removedItemId: productId });
        }

        return { SaveItem, AddItemToCart, RemoveSavedItem, RemoveItemFromCart };
    })

);
