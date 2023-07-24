import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewBlogComponent } from './new-blog/new-blog.component';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Blog } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchBlogData } from '../../store/trainer.action';
import { blogSelectorData } from '../../store/trainer.selector';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ViewBlogComponent } from './view-blog/view-blog.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  blogs$!: Observable<Blog[]>

  constructor(private dialog: MatDialog, private trainerService: TrainerAuthService,
    private store: Store<Blog[]>) { }

  ngOnInit(): void {
    this.fetchData()
  }

  showForm() {
    const dialogRef: MatDialogRef<NewBlogComponent> = this.dialog.open(NewBlogComponent, {
      width: '500px',
    })
    const id = <string>localStorage.getItem('trainerId')
    dialogRef.afterClosed().subscribe((data) => {
      this.trainerService.uploadBlog(data, id).subscribe((res) => {
        if (res.success == true) {
          this.fetchData()
          Swal.fire('Details uploaded successfully')
        }
      })
    })
  }

  showBlog(id: string) {
    const dialogRef: MatDialogRef<ViewBlogComponent> = this.dialog.open(ViewBlogComponent, {
      width: '600px',
      height:'700px',
      data: { id: id }
    })
    dialogRef.afterClosed().subscribe()
  }

  fetchData(){
    this.store.dispatch(fetchBlogData())
    this.blogs$ = this.store.pipe(select(blogSelectorData))
  }
}
