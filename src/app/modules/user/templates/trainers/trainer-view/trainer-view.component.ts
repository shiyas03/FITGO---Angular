import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Trainer } from '../../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchTrainersData } from '../../../store/user.action';
import { singleTrainerData } from '../../../store/user.selector';
import { Observable } from 'rxjs';
import { UserAuthService } from '../../../services/user-auth.service';
import { PaymentData } from '../../../services/user.interface';

@Component({
  selector: 'app-trainer-view',
  templateUrl: './trainer-view.component.html',
  styleUrls: ['./trainer-view.component.css']
})
export class TrainerViewComponent implements OnInit {

  trainer$!: Observable<Trainer | undefined>
  images: string[] = [
    'assets/images/avatar.png',
    'assets/images/Banner.png',
    'assets/images/Banner.png',
  ];

  currentIndex = 0;

  @ViewChild('carouselItems') carouselItems!: ElementRef;
  paymentHandler!: string;

  constructor(private route: ActivatedRoute, private store: Store<Trainer>, private router: Router, private userService: UserAuthService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      if (history.state) {
        const id = history.state.id
        this.store.dispatch(fetchTrainersData())
        this.trainer$ = this.store.pipe(select(singleTrainerData(id)))
      }
    })
    this.startAutoSlide();
  }

  startAutoSlide(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      this.slideToCurrentIndex();
    }, 3000);
  }

  slideToCurrentIndex(): void {
    const carouselWidth = this.carouselItems.nativeElement.offsetWidth;
    const targetTranslateX = -1 * this.currentIndex * carouselWidth;
    this.carouselItems.nativeElement.style.transform = `translateX(${targetTranslateX}px)`;
  }

  payNow(trainerId: string, specialized: string) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51NaG9bSJ8tM5mOcsZou1BVfXjEUnWh6cwrT4Hty2Xvko2tAbP0cpSRnDr6CLy3NipiR0UFAEzInJW7sgtz2M22Oj00Dcu63Td3',
      locale: 'auto',
      token: (stripeToken: PaymentData) => {
        const userId = <string>localStorage.getItem('userId');
        stripeToken.amount = 499
        stripeToken.specialized = specialized
        this.userService.payment(stripeToken, trainerId, userId).subscribe()
      },
    });

    paymentHandler.open({
      name: 'FitGo',
      description: '',
      amount: 499 * 100,
      currency: 'INR',
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51NUXPzSDeABFhKBXLo7ny9iBaxUCetBFRxUoHCCzg0NgEKrh5BJCh8UkZI2ysCEN8paCpIDDW3ehf27lCcheypKs00CpowOYEv',
          locale: 'auto',
          token: function (stripeToken: PaymentData) {
            console.log(stripeToken);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
