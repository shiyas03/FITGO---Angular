import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainerAuthService } from 'src/app/modules/trainer/services/trainer-auth.service';
import { UserAuthService } from 'src/app/modules/user/services/user-auth.service';

@Component({
  selector: 'app-emoji-picker',
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.css']
})
export class EmojiPickerComponent implements OnDestroy {

  @Output() emitEmoji = new EventEmitter();

  constructor(private _traineService: TrainerAuthService, private _userService: UserAuthService) { }

  addEmoji(event: { emoji: { native: string } }) {
    this.emitEmoji.emit(event.emoji.native);
  }

  ngOnDestroy(): void {
    this._traineService.closePicker()
    this._userService.closePicker()
  }
}
