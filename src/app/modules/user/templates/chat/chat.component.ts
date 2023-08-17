import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { NgForm } from '@angular/forms';
import { AllChat, Chat, Messages } from '../../services/user.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  @ViewChild('form') form!: NgForm
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  chat$!: AllChat[]
  trainers = new Set<{ name: string, _id: string, imageUrl: string }>();
  trainer!: { name: string, _id: string, imageUrl: string };
  user!: { name: string, _id: string, imageUrl: string };
  addedTrainers = new Map();
  connectionId!: string;
  trainerId!: string;
  userId!: string;
  connections!: { _id: string, connections: { user: { name: string, _id: string, imageUrl: string }, trainer: { name: string, _id: string, imageUrl: string } } }

  constructor(private _userService: UserAuthService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = <string>localStorage.getItem('userId')
    this._userService.fetchAllConnections(this.userId).subscribe(
      (datas) => {
        if (datas) {
          this._userService.fetchTrainersConnections(this.userId).subscribe((res) => {
            if (res) {
              for (let value of res) {
                if (!this.addedTrainers.has(value.reciever)) {
                  const foundData = datas.find(data => data.connections.trainer._id === value.reciever);
                  if (foundData) {
                    this.trainers.add(foundData.connections.trainer);
                  }
                  this.addedTrainers.set(value.reciever, true);
                }
              }
              this.user = datas[0].connections.user
            }
          })
        }
      }
    )

    this._userService.getNewMessage().subscribe(() => {
      this.selectChat(this.trainerId)
    })

  }

  selectChat(trainerId: string) {
    this.trainerId = trainerId
    const data = {
      trainerId: trainerId,
      userId: this.userId
    }
    this._userService.getAllMessage(data).subscribe((res: AllChat[]) => {
      if (res) {
        for (let value of this.trainers) {
          if (value._id == trainerId) {
            this.trainer = value
          }
        }
        this.chat$ = res
      }
    })
  }

  onSubmit(trainerId: string) {
    const userId = <string>localStorage.getItem('userId')
    const { message } = this.form.value
    const data: Chat = {
      sender: userId,
      reciever: trainerId,
      content: message
    }
    this._userService.sendMessage(data)
    this.form.reset()
    this.selectChat(this.trainerId)
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
