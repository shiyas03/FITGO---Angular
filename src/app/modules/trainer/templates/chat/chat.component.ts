import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AllChat, Chat, ChatShow} from 'src/app/modules/user/services/user.interface';
import { NgForm } from '@angular/forms';
import { TrainerAuthService } from '../../services/trainer-auth.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('form') form!: NgForm
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  chat$!: AllChat[]
  users = new Set<ChatShow>();
  trainer!: ChatShow;
  user!: ChatShow;
  addedUsers = new Map();
  connectionId!: string;
  trainerId!: string;
  userId!: string;

  constructor( private _trainerService: TrainerAuthService) { }

  ngOnInit() {
    this.trainerId = <string>localStorage.getItem('trainerId')
    this._trainerService.fetchAllConnections(this.trainerId).subscribe(
      (datas) => {
        if (datas) {
          this._trainerService.fetchUserConnections(this.trainerId).subscribe(
            (res) => {
              if (res) {
                for (let value of res) {
                  if (!this.addedUsers.has(value.reciever)) {
                    const foundData = datas.find(data => data.connections.user._id === value.reciever);
                    if (foundData) {
                      this.users.add(foundData.connections.user);
                    }
                    this.addedUsers.set(value.reciever, true);
                  }
                }
                this.trainer = datas[0].connections.trainer;
              }
            }
            
          )
        }
      }
    )
    this._trainerService.getNewMessage().subscribe(() => {
      this.selectChat(this.userId)
      this.ngOnInit()
    })
  }

  selectChat(userId: string) {
    this.userId = userId
    const data = {
      trainerId: this.trainerId,
      userId: userId
    }
    this._trainerService.getAllMessage(data).subscribe((res: AllChat[]) => {
      if (res) {
        for (let value of this.users) {
          if (value._id == this.userId) {
            this.user = value
          }
        }
        this.chat$ = res
      }
    })
  }

  onSubmit(userId: string) {
    const { message } = this.form.value
    const data: Chat = {
      sender: this.trainerId,
      reciever: userId,
      content: message,
    }
    this._trainerService.sendMessage(data)
    this.form.reset()
    this.selectChat(this.userId)
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
