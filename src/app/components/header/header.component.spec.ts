import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter, Router } from '@angular/router';
import { AuthStore } from '../../store/auth.store';
import { ProductStore } from '../../store/product.store';
import { UserItemsStore } from '../../store/user-items.store';
import { ComponentRef } from '@angular/core';
import { HttpClientService } from '../../services/http.client';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let componentRef: ComponentRef<HeaderComponent>;

    let mockUserItemsStore: InstanceType<typeof UserItemsStore>;
    let mockAuthStore: InstanceType<typeof AuthStore>;
    let mockProductStore: InstanceType<typeof ProductStore>;

    let matDialogSpy: jasmine.SpyObj<MatDialog>;
    let router: Router;

    let httpClientServiceMock: jasmine.SpyObj<HttpClientService>;


    beforeEach(() => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        httpClientServiceMock = {} as jasmine.SpyObj<HttpClientService>;

        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: HttpClientService, useValue: httpClientServiceMock },
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        componentRef = fixture.componentRef;

        router = TestBed.inject(Router);

        mockAuthStore = TestBed.inject(AuthStore);
        mockUserItemsStore = TestBed.inject(UserItemsStore);
        mockProductStore = TestBed.inject(ProductStore);

        componentRef.setInput('appHeader', true); // Set input

        fixture.detectChanges();
    });

    it('should create the component and get the input', () => {
        expect(component).toBeTruthy();
        expect(component.displaySearchInput()).toBeTrue();
    });

    it('should sign out the user when onSignOut is called', () => {
        spyOn(mockAuthStore, 'SignOut');
        component.onSignOut();
        expect(mockAuthStore.SignOut).toHaveBeenCalled();
    });

    it('should save the current route when onSaveRoute is called', () => {
        component.onSaveRoute();
        expect(mockAuthStore.lastRoute()).toEqual(router.url);
    });

    describe('onSearchForProduct', () => {

        it('should not search for products when input is invalid', () => {
            const event = { target: { value: '--Invalid!' } } as unknown as Event;
            spyOn(mockProductStore, 'SearchForProducts');

            component.onSearchForProduct(event);

            expect(mockProductStore.SearchForProducts).not.toHaveBeenCalled();
        });

        it('should search for products by id when input is a valid number', () => {
            const event = { target: { value: '123' } } as unknown as Event;
            spyOn(mockProductStore, 'SearchForProducts');

            component.onSearchForProduct(event);

            expect(mockProductStore.SearchForProducts).toHaveBeenCalledWith(123);
        });

        it('should search for products by name when input is a valid string', () => {
            const event = { target: { value: 'Test Product' } } as unknown as Event;
            spyOn(mockProductStore, 'SearchForProducts');

            component.onSearchForProduct(event);
            expect(mockProductStore.SearchForProducts).toHaveBeenCalledWith('Test Product');
        });

        it('should emit navigateToProducts event with valid input', () => {
            const event = { target: { value: '1' } } as unknown as Event;

            spyOn(component.navigateToProducts, 'emit');
            spyOn(mockProductStore, 'SearchForProducts');

            component.onSearchForProduct(event);
            expect(mockProductStore.SearchForProducts).toHaveBeenCalledWith(1);
            expect(component.navigateToProducts.emit).toHaveBeenCalledWith('1');
        });
    });

});
