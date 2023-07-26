import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { blogFilterData } from '../../../store/admin.selector';
import { Blog } from '../../../store/admin.interface';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit {

  @Input() blogs$!: Observable<Blog[] | null>
  blog$!: Observable<Blog | undefined>

  constructor(private store: Store<Blog[] | Blog>,
    public dialogRef: MatDialogRef<ViewBlogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string) { }

  ngOnInit(): void {
    this.blog$ = this.store.pipe(select(blogFilterData(this.id)))
  }

  close() {
    this.dialogRef.close()
  }
}
