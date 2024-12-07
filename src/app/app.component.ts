import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { MobileNavigationComponent } from './components/mobile-navigation/mobile-navigation.component';
import { AuthStore } from './store/auth.store';
import { UserItemsStore } from './store/user-items.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, MobileNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly authStore = inject(AuthStore);
  private readonly userItemsStore = inject(UserItemsStore);

  ngOnInit(): void {
    this.authStore.FetchJwtFromLocalStorage();
    this.userItemsStore.GetCart();
  }
}
