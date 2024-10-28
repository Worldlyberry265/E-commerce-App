import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements AfterViewInit  {

  Weather = 1;

  ngAfterViewInit(): void {
    const toggleSvg1 = document.getElementById('toggle-svg1');
    const toggleSvg2 = document.getElementById('toggle-svg2');
    const toggleSvg3 = document.getElementById('toggle-svg3');
    const toggleSvg4 = document.getElementById('toggle-svg4');
    
    if (toggleSvg1) {
      toggleSvg1.addEventListener('click', function() {
        this.classList.toggle('active'); // Toggle the active class
      });
    } 
    if (toggleSvg2) {
      toggleSvg2.addEventListener('click', function() {
        this.classList.toggle('active'); // Toggle the active class
      });
    } 
    if (toggleSvg3) {
      toggleSvg3.addEventListener('click', function() {
        this.classList.toggle('active'); // Toggle the active class
      });
    } 
    if (toggleSvg4) {
      toggleSvg4.addEventListener('click', function() {
        this.classList.toggle('active'); // Toggle the active class
      });
    } 
  }
}

