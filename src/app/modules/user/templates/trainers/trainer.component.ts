import { Component, OnInit } from '@angular/core';
import { Trainer } from '../../store/user';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { fetchTrainersData } from '../../store/user.action';
import { trainerSelectorData } from '../../store/user.selector';
import { UserAuthService } from '../../services/user-auth.service';
import { PaymentData } from '../../services/user.interface';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {

  trainers$!: Observable<Trainer[]>
  paymentHandler!: any
  notFound: boolean = true

  constructor(private store: Store<Trainer[]>, private userService: UserAuthService, private router: Router) { }
  ngOnInit(): void {
    this.store.dispatch(fetchTrainersData())
    this.trainers$ = this.store.pipe(select(trainerSelectorData))
    this.available()
  }

  showTrainer(id: string) {
    const data = { id: id };
    const navigationExtras: NavigationExtras = {
      state: data,
    };
    this.router.navigate(['trainers/view'], navigationExtras);
  }

  available() {
    this.trainers$.subscribe(data => {
      for (let value of data) {
        if (value.access == true) {
          this.notFound = false
        }
      }
    })
  }


}
