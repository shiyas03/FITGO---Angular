import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AllChat, Chat, ChatShow, Connections } from 'src/app/modules/user/services/user.interface';
import { NgForm } from '@angular/forms';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('form') form!: NgForm
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  chat$!: AllChat[]
  users = new Set<ChatShow>();
  filteredUsers: ChatShow[] = [];
  allUsers = new Set<ChatShow>();
  trainer!: ChatShow;
  user!: ChatShow;
  addedUsers = new Map();
  connectionId!: string;
  trainerId!: string;
  userId!: string;
  showList: boolean = false
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile!: File | null;
  isLoading: boolean = false;
  inputValue: string = ''
  openEmoji: boolean = false
  isImageOverlayOpen = false;
  viewImage: string = ''

  subscription1!: Subscription
  subscription2!: Subscription
  subscription3!: Subscription

  constructor(private _trainerService: TrainerAuthService, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.getAllConnections()
    this._trainerService.getNewMessage().subscribe(() => {
      this.selectChat(this.userId)
      this.getAllConnections()
    })
  }

  getAllConnections() {
    let connections: string[] = []
    this.allUsers.clear()
    this.trainerId = <string>localStorage.getItem('trainerId')
    this.subscription1 = this._trainerService.fetchAllConnections(this.trainerId).subscribe(
      (datas) => {
        for (let value of datas) {
          connections.push(value._id)
        }
        this.subscription2 = this._trainerService.getAllChats(connections).subscribe(
          (res) => {
            this.chat$ = res
            for (let value of res) {
              if (value.sender !== this.trainerId) {
                this.usersIdentify(datas, value.sender)
              } else {
                this.usersIdentify(datas, value.reciever)
              }
            }
            const reversedArray = Array.from(this.allUsers).reverse();
            this.users = new Set(reversedArray);
            this.notifications()
          })
      }
    )
  }

  usersIdentify(datas: Connections[], value: string) {
    const foundData = datas.find((data: Connections) => data.connections.user._id === value);
    if (foundData) {
      if (this.allUsers.has(foundData.connections.user)) {
        this.allUsers.delete(foundData.connections.user)
      }
      this.allUsers.add(foundData.connections.user)
    }
  }

  selectChat(userId: string) {
    this.userId = userId
    const connection = Array.from(this.chat$).find(data => data.sender === userId)
    this._trainerService.updateMessageSeen(userId,connection?.connection).subscribe()
    const user = Array.from(this.allUsers).find(data=> data._id === userId)
    if(user){
      user.notification = 0
      this.user = user
    }
  }

  filterUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement)?.value || '';
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    if (lowercaseSearchTerm === '') {
      this.filteredUsers = [];
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      this.filteredUsers = Array.from(this.users).filter(
        (user) => user.name.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    this.showList = true
  }

  async onSubmit(userId: string) {
    this.isLoading = true
    const trainerId = <string>localStorage.getItem('trainerId')
    let content: string;
    if (this.selectedFile) {
      const path = `chat/${this.selectedFile.name}`
      const uploadTask = await this.storage.upload(path, this.selectedFile)
      content = <string>await uploadTask.ref.getDownloadURL()
      this.isLoading = false
    } else {
      content = this.inputValue
    }
    const data: Chat = {
      sender: this.trainerId,
      reciever: userId,
      content: content,
    }
    this._trainerService.sendMessage(data)
    this.form.reset()
    this.selectChat(this.userId)
    this.selectedFile = null
    this.closeEmojiPicker()
  }

  isList(change: boolean) {
    setTimeout(() => {
      this.showList = change
    }, 100)
  }

  back() {
    this.userId = ''
    this.closeEmojiPicker()
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event): void {
    this.selectedFile = <File>(event.target as HTMLInputElement)?.files?.[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.selectedImage = e.target.result;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openImageOverlay(url: string): void {
    this.viewImage = url
    this.isImageOverlayOpen = true;
  }

  closeImageOverlay(): void {
    this.isImageOverlayOpen = false;
  }

  removeImage() {
    this.selectedFile = null
  }

  addEmoji(event: string) {
    this.inputValue += event
  }

  openEmojiPicker() {
    if (!this.selectedFile) {
      this.openEmoji = !this.openEmoji
    }
  }

  closeEmojiPicker() {
    this.openEmoji = false
    this._trainerService.closePicker()
  }

  isToday(timestamp: string): boolean {
    const today = new Date();
    const date = new Date(timestamp).toDateString()
    return date === today.toDateString();
  }

  isYesterday(timestamp: string): boolean {
    const today = new Date();
    const date = new Date(timestamp).toDateString()
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return date === yesterday.toDateString();
  }

  notifications() {
    for (let value of this.chat$) {
      if (value.seen === false) {
        const find = Array.from(this.users).find(data => data._id === value.sender)
        if (find) find.notification++
      }
    }
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  isSelected(userId: string): boolean {
    return this.userId === userId;
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription1) this.subscription1.unsubscribe()
    if (this.subscription2) this.subscription2.unsubscribe()
    if (this.subscription3) this.subscription3.unsubscribe()
  }
}
