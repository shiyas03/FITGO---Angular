import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  islogged: boolean = false
  userName!: string | null

  constructor() {
  }

  ngOnInit(): void {
    if (localStorage.getItem('userToken')) {
      this.islogged = true;
    }

  }
}
