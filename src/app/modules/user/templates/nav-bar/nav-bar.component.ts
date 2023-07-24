import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { fetchUserData } from '../../store/user.action';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../store/user';
import { userSelectorData } from '../../store/user.selector';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  islogged: boolean = false
  showToggle: boolean = false
  isDropdownOpen: boolean = false
  user$!: Observable<User | null>
  private subscription!: Subscription

  constructor(private router: Router, private store: Store<{ userData: User }>) {
    this.showToggle = false
    this.isDropdownOpen = false
  }

  ngOnInit(): void {
    if (localStorage.getItem('userToken')) {
      this.islogged = true;
    }
    const id = <string>localStorage.getItem('id')
    if (id.trim() !== '') {
      this.store.dispatch(fetchUserData({ id }))
      this.user$ = this.store.pipe(select(userSelectorData))
      this.subscription = this.user$.subscribe((res) => {
        if (res?.access == false) {
          this.islogged = false
        } else {
          this.islogged = true
        }
      })
    }
  }

  toggle() {
    this.showToggle = !this.showToggle
    this.isDropdownOpen = false
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen
    this.showToggle = false
  }

  signOut() {
    localStorage.removeItem('userToken')
    localStorage.removeItem('id')
    this.router.navigate(['/'])
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe()
  }
}
