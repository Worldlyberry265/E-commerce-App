import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../header/header.component';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { AddDecimalPipe } from '../products/reviews/add-decimal-pipe/add-decimal.pipe';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [MatCardModule, HeaderComponent, MatButtonModule, ProductCardComponent, AddDecimalPipe],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements AfterViewInit {

  Weather = 1;


  // CREATE PRODUCT FRAME COMPONENT
  ngAfterViewInit(): void {
    const toggleSvg1 = document.getElementById('toggle-svg1');
    const toggleSvg2 = document.getElementById('toggle-svg2');
    const toggleSvg3 = document.getElementById('toggle-svg3');
    const toggleSvg4 = document.getElementById('toggle-svg4');

    if (toggleSvg1) {
      toggleSvg1.addEventListener('click', function () {
        this.classList.toggle('active'); // Toggle the active class
      });
    }
    if (toggleSvg2) {
      toggleSvg2.addEventListener('click', function () {
        this.classList.toggle('active'); // Toggle the active class
      });
    }
    if (toggleSvg3) {
      toggleSvg3.addEventListener('click', function () {
        this.classList.toggle('active'); // Toggle the active class
      });
    }
    if (toggleSvg4) {
      toggleSvg4.addEventListener('click', function () {
        this.classList.toggle('active'); // Toggle the active class
      });
    }


    // document.addEventListener("DOMContentLoaded", function () {
    //   const header = document.querySelector(".header") as HTMLElement;
    //   const introductionSection = document.querySelector(".section-introduction") as HTMLElement;

    //   // Get the offset position of the introduction section
    //   // const stickyPoint = introductionSection!.offsetTop + introductionSection.offsetHeight;

    //   // Add scroll event listener
    //   window.addEventListener("scroll", function () {
    //     if (window.scrollY > window.innerHeight ) {
    //       header!.classList.add("header-sticky");
    //     } else {
    //       header!.classList.remove("header-sticky");
    //     }
    //   });
    // });


    const video = document.getElementById('landing-video') as HTMLVideoElement;
    video.playbackRate = 0.5;


    // Use this bcz if we have only 1 product the user wont be able to scroll
    // if (this.products.length > 6) {
    const scrollContainer = document.querySelector('.product-cards__container') as HTMLElement;
    scrollContainer!.addEventListener('wheel', (event) => {
      event.preventDefault(); // Prevent the default vertical scroll
      scrollContainer!.scrollLeft += event.deltaY * 10; // Scroll horizontally
    });
  // }

  }
}

