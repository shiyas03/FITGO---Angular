import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Blog } from '../../../services/trainer.interface';
import { Observable } from 'rxjs';
import { fetchBlogData } from '../../../store/trainer.action';
import { Store, select } from '@ngrx/store';
import { blogFilterData, blogSelectorData } from '../../../store/trainer.selector';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit {

  blogs$!: Observable<Blog[] | null>
  blog$!: Observable<Blog | undefined>

  constructor(private store: Store<Blog[] | Blog>, @Inject(MAT_DIALOG_DATA) public id: string, public dialogRef: MatDialogRef<ViewBlogComponent>) { }

  ngOnInit(): void {
    this.store.dispatch(fetchBlogData())
    this.blogs$ = this.store.pipe(select(blogSelectorData))
    this.blog$ = this.store.pipe(select(blogFilterData(this.id)))
  }

  close() {
    this.dialogRef.close()
  }
}
