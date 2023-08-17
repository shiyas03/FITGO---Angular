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
import { Chat, PaymentDetails } from '../../../services/user.interface';

@Component({
  selector: 'app-trainer-view',
  templateUrl: './trainer-view.component.html',
  styleUrls: ['./trainer-view.component.css']
})
export class TrainerViewComponent implements OnInit, OnDestroy {

  formData: { review: string } = { review: '' }
  currentIndex = 0;
  one_month_id: string = environment.stripKey.ONE_MONTH_PRICE_ID
  six_month_id: string = environment.stripKey.SIX_MONTH_PRICE_ID
  one_year_id: string = environment.stripKey.ONE_YEAR_PRICE_ID

  trainer$!: Observable<Trainer | undefined>
  expired: boolean = true
  submit: boolean = false
  isReview: boolean = false
  myReview$: string = ''
  totalReview: number = 0
  trainerId!: string;
  subscription1!: Subscription
  subscription2!: Subscription
  subscription3!: Subscription

  uniqueUsers = new Set<string>();
  @ViewChild('carouselItems') carouselItems!: ElementRef;
  paymentHandler!: string;

  constructor(private _route: ActivatedRoute,
    private _store: Store<Trainer>, private __store: Store<PaymentDetails[]>,
    private _userService: UserAuthService, private _router: Router) { }

  ngOnInit(): void {
    this.fetchData()
    this.paymentStatus()
    this.checkReview()
    this.paymentgDetails()
  }

  fetchData() {
    this._route.paramMap.subscribe(() => {
      if (history.state) {
        this.trainerId = history.state.id
        if (!this.trainerId) {
          this.trainerId = this._route.snapshot.queryParams['trainer_id']
          const data = { id: this.trainerId };
          const navigationExtras: NavigationExtras = {
            state: data,
          };
          this._router.navigate(['trainers/view'], navigationExtras);
        }
        this._store.dispatch(fetchTrainersData())
        this.trainer$ = this._store.pipe(select(singleTrainerData(this.trainerId)))
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
          this.expired = false
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
    this._userService.fetchTrainerPayments(this.trainerId).subscribe(
      (res) => {
        for (let value of res) {
          if (value.trainerId._id === this.trainerId) {
            this.uniqueUsers.add(value.userId._id);
          }
        }
      })
    this.__store.dispatch(fetchPaymentData({ userId: userId }))
    this.__store.pipe(select(paymentSelectorData)).subscribe((data) => {
      const date: Date = new Date()
      for (let { expiryDate, trainerId } of data) {
        const expiry = new Date(expiryDate)
        if (this.trainerId === trainerId._id) {
          if (date < expiry) {
            this.expired = false
          }
        }
      }
    })
  }

  onSubmit(trainerId: string) {
    const userId = <string>localStorage.getItem('userId');
    const data = {
      review: this.formData.review,
      userId: userId
    }
    this.subscription3 = this._userService.uploadReview(data, trainerId).subscribe(
      (res) => {
        if (res == true) {
          this.fetchData()
          swal('success', 'Review successfully added')
        } else {
          swalError('Error occurred')
        }
      }, (error) => {
        swalError(error)
      }
    )
  }

  checkReview() {
    this.trainer$.subscribe(data => {
      if (data) {
        for (let { review, userId } of data.reviews) {
          this.totalReview++
          const id = <string>localStorage.getItem('userId')
          if (userId._id.toString() === id) {
            this.isReview = true
            this.myReview$ = review
          } else {
            this.isReview = false
          }
        }
        if (this.totalReview > 1) this.startAutoSlide()
      }
    })
  }

  chatWith(trainerId: string) {
    const userId = <string>localStorage.getItem('userId')
    const data = {
      user: userId,
      trainer: trainerId,
    }
    this._userService.createConnection(data).subscribe((res) => {
      if (res) {
        this._router.navigate(['chat']);
      }
    })
  }

  startAutoSlide(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.totalReview;
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
    if (this.subscription3) this.subscription3.unsubscribe()
  }

}
