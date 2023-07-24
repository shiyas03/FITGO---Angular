import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent {
  
  showToggle: boolean = false

  constructor(private router:Router){
    this.showToggle = false
  }

  toggle(){
    this.showToggle = !this.showToggle
  }

  singOut(){
    localStorage.removeItem('adminToken')
    this.router.navigate(['/admin/login'])
  }

}
