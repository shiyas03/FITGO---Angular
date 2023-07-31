import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { decodeToken } from 'src/app/helpers/token.decode';
import { Token } from '../../services/trainer.interface';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.css'],
})
export class SidebarLayoutComponent implements OnInit {
  showToggle: boolean = false;
  trainer!:Token

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = <string>localStorage.getItem('trainerToken');
    this.trainer = decodeToken(token)
  }

  toggle() {
    this.showToggle = !this.showToggle;
  }

  singOut() {
    localStorage.removeItem('trainerToken');
    localStorage.removeItem("trainerId")
    this.router.navigate(['/trainer/login']);
  }
}
