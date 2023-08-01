import { Component, OnInit } from '@angular/core';
import { Trainer } from '../../store/user';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fetchTrainersData } from '../../store/user.action';
import { trainerSelectorData } from '../../store/user.selector';
import { UserAuthService } from '../../services/user-auth.service';
import { PaymentData } from '../../services/user.interface';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {

  trainers$! :Observable<Trainer[]>
  paymentHandler!:any

  constructor(private store:Store<Trainer[]>, private userService:UserAuthService){}
  ngOnInit(): void {
    this.invokeStripe();
      this.store.dispatch(fetchTrainersData())
      this.trainers$ = this.store.pipe(select(trainerSelectorData))
  }

  payNow() {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51NaG9bSJ8tM5mOcsZou1BVfXjEUnWh6cwrT4Hty2Xvko2tAbP0cpSRnDr6CLy3NipiR0UFAEzInJW7sgtz2M22Oj00Dcu63Td3',
      locale: 'auto',
      token: (stripeToken: PaymentData) => {
        console.log(stripeToken);
        this.userService.payment()
      },
    });

    paymentHandler.open({
      name: 'FitGo',
      description: '',
      amount: 1000 * 100,
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
