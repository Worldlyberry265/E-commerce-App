import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/Product';
import { ProductStore } from './product.store';

type UserItemsState = {
    cartItems: Product[],
    savedItems: Product[],
    removedItemId: number, // To toggle the item icons from the dialog preview,
    selectedItemIcon: {
        Id: number,
        type: 'heart' | 'cart'
    }
}

const initialState: UserItemsState = {
    cartItems: [],
    savedItems: [],
    removedItemId: 0,
    selectedItemIcon: {
        Id: -1,
        type: 'heart'
    }
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
        // function ToggleItemIcon(productId: number) {
        //     patchState(store, { removedItemId: productId });
        // }

        function updateCart(products: Product[]) {
            patchState(store, { cartItems: products });
        }
        function updateSavedItems(products: Product[]) {
            patchState(store, { savedItems: products });
        }
        function selectItem({ Id, type }: { Id: number, type: 'heart' | 'cart' }) {
            patchState(store, { selectedItemIcon: { Id: Id, type: type } });
        }
        function ItemInCart(productId: number) {
            return store.cartItems().find(product => product.id === productId) === undefined ? false : true;
        }

        return { SaveItem, AddItemToCart, RemoveSavedItem, RemoveItemFromCart, updateCart, updateSavedItems, selectItem, ItemInCart };
    })

);
