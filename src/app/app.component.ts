import { Component, OnInit } from '@angular/core';
import { Carousel, Dropdown, initTE } from 'tw-elements';
import { AngularFireStorage } from '@angular/fire/compat/storage'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private storage: AngularFireStorage) { }
  ngOnInit() {
    initTE({ Carousel, Dropdown });
  }

  async onFileSelected(event: Event) {
    const file = <File>(event.target as HTMLInputElement)?.files?.[0]
    if (file) {
      const path = `workouts/${file.name}`
      const uploadTask = await this.storage.upload(path, file)
      const url = await uploadTask.ref.getDownloadURL()
    }
  }
}
