import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trainer } from '../../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchTrainersData } from '../../../store/user.action';
import { singleTrainerData } from '../../../store/user.selector';
import { Observable, Subscription } from 'rxjs';
import { UserAuthService } from '../../../services/user-auth.service';
import { Payment, PaymentData } from '../../../services/user.interface';
import { environment } from 'src/environments/environment';
import { swal, swalError } from 'src/app/common/swal.popup';

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
  subscription1!: Subscription
  subscription2!: Subscription

  @ViewChild('carouselItems') carouselItems!: ElementRef;
  paymentHandler!: string;

  constructor(private _route: ActivatedRoute,
    private _store: Store<Trainer>,
    private _userService: UserAuthService,) { }

  ngOnInit(): void {
    this.paymentStatus()
    this._route.paramMap.subscribe(() => {
      if (history.state) {
        let id = history.state.id
        if (!id) {
          id = this._route.snapshot.queryParams['trainer_id']
        }
        this._store.dispatch(fetchTrainersData())
        this.trainer$ = this._store.pipe(select(singleTrainerData(id)))
      }
    })
    this.startAutoSlide();
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
      if(this.subscription1) this.subscription1.unsubscribe()
      if(this.subscription2) this.subscription2.unsubscribe()
  }

}
