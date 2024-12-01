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

        function getCart() {
            const cart = localStorage.getItem('products-cart');
            if (cart) {
                patchState(store, { cartItems: JSON.parse(cart) })
            }
        }
        function SaveItem(product: Product) {
            patchState(store, (state) => ({ savedItems: [...state.savedItems, product] }));
            // I wont also put the saved items in the localStorage, because that should be stored in the backend database instead
        }
        function AddItemToCart(product: Product) {
            patchState(store, (state) => ({ cartItems: [...state.cartItems, product] }));
            localStorage.setItem('products-cart', JSON.stringify(store.cartItems()));
        }
        function RemoveSavedItem(product: Product) {
            patchState(store, (state) =>
                ({ savedItems: state.savedItems.filter(productItem => productItem.id != product.id) }));
        }
        function RemoveItemFromCart(product: Product) {
            patchState(store, (state) =>
                ({ cartItems: state.cartItems.filter(productItem => productItem.id != product.id) }));
            localStorage.setItem('products-cart', JSON.stringify(store.cartItems()));
        }
        function updateCart(products: Product[]) {
            patchState(store, { cartItems: products });
            localStorage.setItem('products-cart', JSON.stringify(store.cartItems()));
        }
        function IsItemInCart(productId: number) {
            return store.cartItems().find(product => product.id === productId) === undefined ? false : true;
        }
        function IsItemSaved(productId: number) {
            return store.savedItems().find(product => product.id === productId) === undefined ? false : true;
        }

        return { SaveItem, AddItemToCart, RemoveSavedItem, RemoveItemFromCart, updateCart, IsItemInCart, getCart, IsItemSaved };
    })

);
