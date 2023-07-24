import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileDetails } from '../../../store/user';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {
  @Input() userData$!: Observable<ProfileDetails | null>;
}
