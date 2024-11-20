import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { MobileNavigationComponent } from './components/mobile-navigation/mobile-navigation.component';
import { AuthStore } from './store/auth.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, MobileNavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private readonly authStore = inject(AuthStore);

  ngOnInit(): void {
      this.authStore.FetchJwtFromLocalStorage();
  }
}
