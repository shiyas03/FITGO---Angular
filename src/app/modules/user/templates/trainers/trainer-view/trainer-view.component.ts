import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Trainer } from '../../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchPaymentData, fetchTrainersData } from '../../../store/user.action';
import { paymentSelectorData, singleTrainerData } from '../../../store/user.selector';
import { Observable, Subscription } from 'rxjs';
import { UserAuthService } from '../../../services/user-auth.service';
import { environment } from 'src/environments/environment';
import { swal, swalError } from 'src/app/common/swal.popup';
import { PaymentDetails } from '../../../services/user.interface';

@Component({
  selector: 'app-trainer-view',
  templateUrl: './trainer-view.component.html',
  styleUrls: ['./trainer-view.component.css']
})
export class TrainerViewComponent implements OnInit, OnDestroy {

  images: string[] = [
    'assets/images/avatar.png',
    'assets/images/Banner.png',
    'assets/images/Banner.png',
  ];
  currentIndex = 0;
  one_month_id: string = environment.stripKey.ONE_MONTH_PRICE_ID
  six_month_id: string = environment.stripKey.SIX_MONTH_PRICE_ID
  one_year_id: string = environment.stripKey.ONE_YEAR_PRICE_ID

  trainer$!: Observable<Trainer | undefined>
  expired:boolean = false
  subscription1!: Subscription
  subscription2!: Subscription

  @ViewChild('carouselItems') carouselItems!: ElementRef;
  paymentHandler!: string;

  constructor(private _route: ActivatedRoute,
    private _store: Store<Trainer>, private __store: Store<PaymentDetails[]>,
    private _userService: UserAuthService, private _router: Router) { }

  ngOnInit(): void {
    this.paymentStatus()
    this.paymentgDetails()
    this.startAutoSlide()
    this._route.paramMap.subscribe(() => {
      if (history.state) {
        let id = history.state.id
        if (!id) {
          id = this._route.snapshot.queryParams['trainer_id']
          const data = { id: id };
          const navigationExtras: NavigationExtras = {
            state: data,
          };
          this._router.navigate(['trainers/view'], navigationExtras);
        }
        this._store.dispatch(fetchTrainersData())
        this.trainer$ = this._store.pipe(select(singleTrainerData(id)))
      }
    })
  }

  payNow(trainerId: string, packageId: string) {
    const userId = <string>localStorage.getItem('userId');
    const data = {
      amount: 599,
      userId: userId,
      trainerId: trainerId,
      packageId: packageId,
    }
    this.subscription1 = this._userService.payment(data).subscribe((res) => {
      if (res) {
        window.location.href = res.url;

      }
    })
  }

  paymentStatus() {
    const session_id = this._route.snapshot.queryParams['session_id']
    if (session_id) {
      this.subscription2 = this._userService.paymentStatus(session_id).subscribe((res) => {
        if (res == true) {
          swal('success', 'Payment success')
        } else {
          swal('error', 'Payment failed')
        }
      }, (error) => {
        swalError(error)
      })
    }
  }

  paymentgDetails() {
    const userId = <string>localStorage.getItem('userId')
    this.__store.dispatch(fetchPaymentData({ userId: userId }))
    this.__store.pipe(select(paymentSelectorData)).subscribe((data) => {
      const date : Date = new Date()
      const expiry = new Date(data[0].expiryDate)
      if(date > expiry){
        this.expired = true     
      }
    })
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

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe()
    if (this.subscription2) this.subscription2.unsubscribe()
  }

}
