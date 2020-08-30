import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  config: SwiperConfigInterface = {
    a11y: true,
    direction: 'horizontal',
    slidesPerView: 1,
    slideToClickedSlide: true,
    mousewheel: true,
    scrollbar: false,
    watchSlidesProgress: true,
    navigation: true,
    keyboard: true,
    pagination: false,
    centeredSlides: true,
    loop: true,
    roundLengths: true,
    autoplay: true,

    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1
      }
    }
  };
  constructor() { }

  ngOnInit(): void {
  }

  onIndexChange(e): void {
    console.log(e);

  }

}
