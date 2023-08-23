import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AllChat, Chat, ChatShow, Connections } from 'src/app/modules/user/services/user.interface';
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
  allUsers = new Set<ChatShow>();
  trainer!: ChatShow;
  user!: ChatShow;
  addedUsers = new Map();
  connectionId!: string;
  trainerId!: string;
  userId!: string;

  constructor(private _trainerService: TrainerAuthService) { }

  ngOnInit() { 
    this.getAllConnections()
    this._trainerService.getNewMessage().subscribe(() => {
      this.selectChat(this.userId)
    })
  }

  getAllConnections() {
    let connections: string[] = []
    this.trainerId = <string>localStorage.getItem('trainerId')
    this._trainerService.fetchAllConnections(this.trainerId).subscribe(
      (datas) => {
        for (let value of datas) {
          connections.push(value._id)
        }
        this._trainerService.getAllConnections(connections).subscribe(
          (res: AllChat[]) => {
            for (let value of res) {
              if (value.sender !== this.trainerId) {
                this.usersIdentify(datas, value.sender)
              } else {
                this.usersIdentify(datas, value.sender)
              }
            }
          })
      }
    )
  }

  usersIdentify(datas: any, value: any) {
    const foundData = datas.find((data: any) => data.connections.user._id === value);
    if (foundData) {
      if (this.allUsers.has(foundData.connections.user)) {
        this.allUsers.delete(foundData.connections.user)
      }
      this.allUsers.add(foundData.connections.user)
    }
    const reversedArray = Array.from(this.allUsers).reverse();
    this.users = new Set(reversedArray);
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
