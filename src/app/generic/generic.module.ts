import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';


@NgModule({
  declarations: [EmojiPickerComponent],
  imports: [
    CommonModule,
    PickerComponent
  ],
  exports: [EmojiPickerComponent],
})
export class GenericModule { }
