import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewBlogComponent } from './new-blog/new-blog.component';
import { TrainerAuthService } from '../../services/trainer-auth.service';
import { Blog } from '../../services/trainer.interface';
import { Store, select } from '@ngrx/store';
import { fetchBlogData } from '../../store/trainer.action';
import { blogSelectorData } from '../../store/trainer.selector';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { swalError } from 'src/app/common/swal.popup';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EditBlogComponent } from './edit-blog/edit-blog.component';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit, OnDestroy, AfterViewInit {

  private subscription!: Subscription;

  dataSource$ = new MatTableDataSource<Blog>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'thumbnail', 'title', 'category','trainer', 'action'];
  trainerId!: string

  constructor(
    private _dialog: MatDialog,
    private _trainerService: TrainerAuthService,
    private _store: Store<Blog[]>,
  ) { }

  ngOnInit(): void {
    this.fetchData();
    this.trainerId = <string>localStorage.getItem('trainerId');
  }

  showForm() {
    const dialogRef: MatDialogRef<NewBlogComponent> = this._dialog.open(
      NewBlogComponent,
      {
        width: '500px',
      },
    );
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const id = <string>localStorage.getItem('trainerId');
        this.subscription = this._trainerService.uploadBlog(data, id).subscribe(
          (res) => {
            if (res.success == true) {
              this.fetchData();
              Swal.fire('Details uploaded successfully');
            }
          },
          (error) => {
            swalError(error);
          },
        );
      }
    });
  }

  showBlog(id: string) {
    const dialogRef: MatDialogRef<ViewBlogComponent> = this._dialog.open(
      ViewBlogComponent,
      {
        width: '600px',
        height: '700px',
        data: { id: id },
      },
    );
    dialogRef.afterClosed().subscribe();
  }

  editBlog(id: string) {
    const dialogRef: MatDialogRef<EditBlogComponent> = this._dialog.open(
      EditBlogComponent,
      {
        width: '600px',
        data: { id: id },
      },
    )
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.fetchData();
        Swal.fire('Details updated successfully');
      }
    });
  }

  fetchData() {
    this._store.dispatch(fetchBlogData());
    this._store.pipe(select(blogSelectorData)).subscribe(data => {
      this.dataSource$.data = data
    })
  }

  ngAfterViewInit(): void {
    this.dataSource$.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
