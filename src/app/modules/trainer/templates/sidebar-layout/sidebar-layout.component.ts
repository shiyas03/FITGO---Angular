import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent {

  constructor(private router:Router){}

  singOut(){
    localStorage.removeItem('trainerToken')
    this.router.navigate(['/trainer/login'])
  }

}
