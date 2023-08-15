import { Component, OnInit, ViewChild } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('form') form!: NgForm

  messages: string[] = []
  newMessage$!: Observable<string>

  constructor(private _userService: UserAuthService) { }

  ngOnInit() {
    return this._userService.getNewMessage().subscribe((message) => {
      this.messages.push(message)
    })
  }

  onSubmit() {
    const{ message } = this.form.value
    if(!message) return 
    this._userService.sendMessage(message)
    this.form.reset()
  }
}
