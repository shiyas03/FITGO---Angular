import { Component, ElementRef, OnInit, ViewChild, AfterViewChecked, OnDestroy, HostListener } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { NgForm } from '@angular/forms';
import { AllChat, Chat, ChatShow, Details } from '../../services/user.interface';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {


  @ViewChild('form') form!: NgForm
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  chat$!: AllChat[]
  allChat$!: AllChat[]
  trainers = new Set<ChatShow>();
  allTrainers = new Set<ChatShow>();
  filteredTrainers: ChatShow[] = [];
  trainer!: ChatShow;
  user!: ChatShow;
  addedTrainers = new Map();
  trainerId!: string;
  userId!: string;
  showList: boolean = false;
  connections!: Details
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile!: File | null;
  isLoading: boolean = false;
  inputValue: string = ''
  openEmoji: boolean = false
  isImageOverlayOpen = false;
  viewImage: string = ''

  subscription1!: Subscription
  subscription2!: Subscription

  constructor(private _userService: UserAuthService, private storage: AngularFireStorage) { }

  ngOnInit() {
    this.userId = <string>localStorage.getItem('userId')
    this.getConnections()
    this._userService.getNewMessage().subscribe(() => {
      this.selectChat(this.trainerId)
      this.getConnections()
    })
  }

  getConnections() {
    this.allTrainers.clear()
    let connections: string[] = []
    this.subscription1 = this._userService.fetchAllConnections(this.userId).subscribe(
      (data) => {
        for (let value of data) {
          connections.push(value._id)
        }
        this.subscription2 = this._userService.getAllChats(connections).subscribe(
          (res) => {
            this.chat$ = res
            for (let value of res) {
              if (value.sender !== this.userId) {
                this.trainerDetails(data, value.sender)
              } else {
                this.trainerDetails(data, value.reciever)
              }
            }
            const reverse = Array.from(this.allTrainers).reverse()
            this.trainers = new Set(reverse)
            this.notifications()
          })
      }
    )
  }

  trainerDetails(details: any, id: string) {
    const foundData = details.find((data: any) => data.connections.trainer._id == id)
    if (foundData) {
      if (this.allTrainers.has(foundData.connections.trainer)) {
        this.allTrainers.delete(foundData.connections.trainer)
      }
      this.allTrainers.add(foundData.connections.trainer)
    }
  }

  selectChat(trainerId: string): void {
    this.trainerId = trainerId
    const connection = Array.from(this.chat$).find(data => data.sender === trainerId)
    this._userService.updateMessageSeen(trainerId, connection?.connection).subscribe()
    const trainer = Array.from(this.trainers).find(data => data._id === trainerId)
    if (trainer) {
      trainer.notification = 0
      this.trainer = trainer
    }
  }

  filterTrainers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement)?.value || '';
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    if (lowercaseSearchTerm === '') {
      this.filteredTrainers = [];
    } else {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      this.filteredTrainers = Array.from(this.trainers).filter(
        (trainer) => trainer.name.toLowerCase().includes(lowercaseSearchTerm)
      );
    }
    this.showList = true
  }

  async onSubmit(trainerId: string) {
    this.isLoading = true
    const userId = <string>localStorage.getItem('userId')
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
      sender: userId,
      reciever: trainerId,
      content: content
    }
    this._userService.sendMessage(data)
    this.form.reset()
    this.selectChat(this.trainerId)
    this.selectedFile = null
    this.openEmoji = false
  }


  isList(change: boolean): void {
    setTimeout(() => {
      this.showList = change
    }, 100)
  }

  hideListOnMouseLeave(): void {
    this.showList = false;
  }

  openFileInput(): void {
    this.fileInput.nativeElement.click();
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

  handleFileInput(event: any): void {
    this.selectedFile = event.target.files[0];
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
    this._userService.closePicker()
  }

  back() {
    this.trainerId = ''
    this.closeEmojiPicker()
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

  isSelected(trainerId: string): boolean {
    return this.trainerId === trainerId;
  }

  notifications() {
    for (let value of this.chat$) {
      if (value.seen === false) {
        const find = Array.from(this.trainers).find(data => data._id === value.sender)
        if (find) find.notification++

      }
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
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
  }
}