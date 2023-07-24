import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileDetails } from '../../../store/user';

@Component({
  selector: 'app-user-status',
  templateUrl: './user-status.component.html',
  styleUrls: ['./user-status.component.css']
})
export class UserStatusComponent {
  @Input() userData$!: Observable<ProfileDetails | null>
}
