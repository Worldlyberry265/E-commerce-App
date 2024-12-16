import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/Product';

type UserItemsState = {
    cartItems: Product[],
    savedItems: Product[],
    isPreviewDisplayed: boolean,
}

const initialState: UserItemsState = {
    cartItems: [],
    savedItems: [],
    isPreviewDisplayed: false,
};

export const UserItemsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => {

        function GetCart() {
            const cart = localStorage.getItem('products-cart');
            if (cart) {
                patchState(store, { cartItems: JSON.parse(cart) })
            }
        };
        function SaveItem(product: Product) {
            patchState(store, (state) => ({ savedItems: [...state.savedItems, product] }));
            // I wont also put the saved items in the localStorage, because that should be stored in the backend database instead
        };
        function AddItemToCart(product: Product) {
            patchState(store, (state) => ({ cartItems: [...state.cartItems, product] }));
            localStorage.setItem('products-cart', JSON.stringify(store.cartItems()));
        };
        function RemoveSavedItem(product: Product) {
            patchState(store, (state) =>
                ({ savedItems: state.savedItems.filter(productItem => productItem.id != product.id) }));
        };
        function RemoveItemFromCart(product: Product) {
            patchState(store, (state) =>
                ({ cartItems: state.cartItems.filter(productItem => productItem.id != product.id) }));
            localStorage.setItem('products-cart', JSON.stringify(store.cartItems()));
        };
        function UpdateCart(products: Product[]) {
            patchState(store, { cartItems: products });
            localStorage.setItem('products-cart', JSON.stringify(store.cartItems()));
        };
        function UpdateItemInCart(product: Product) {
            const newCart = store.cartItems().filter(cartProduct => product.id != cartProduct.id);
            newCart.push(product);
            UpdateCart(newCart);
        };
        function DeleteSavedItems() {
            patchState(store, { savedItems: [] });
        };
        function IsItemInCart(productId: number) {
            return store.cartItems().find(product => product.id === productId) === undefined ? false : true;
        };
        function IsItemSaved(productId: number) {
            return store.savedItems().find(product => product.id === productId) === undefined ? false : true;
        };
        //  METHODS FOR MOBILE DISPLAY ONLY
        function CloseMobileNavigation() {
            patchState(store, { isPreviewDisplayed: true });
        };
        function OpenMobileNavigation() {
            patchState(store, { isPreviewDisplayed: false });
        };
        // METHODS FOR MOBILE DISPLAY ONLY 

        function TESTER_METHOD_Populate_CartItems(products: Product[]) {
            patchState(store, { cartItems: products });
        };

        function TESTER_METHOD_Populate_SavedItems(products: Product[]) {
            patchState(store, { savedItems: products });
        };
        function TESTER_METHOD_Toggle_IsPreviewDisplayed() {
            patchState(store, state => ({ isPreviewDisplayed: !state.isPreviewDisplayed }));
        };

        return {
            SaveItem, AddItemToCart, RemoveSavedItem, RemoveItemFromCart, UpdateCart, DeleteSavedItems, IsItemInCart,
            GetCart, IsItemSaved, CloseMobileNavigation, OpenMobileNavigation, TESTER_METHOD_Populate_CartItems,
            TESTER_METHOD_Populate_SavedItems, TESTER_METHOD_Toggle_IsPreviewDisplayed, UpdateItemInCart
        };
    })

);
