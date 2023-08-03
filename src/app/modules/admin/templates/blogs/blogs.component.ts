import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Blog } from '../../services/admin-interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { fetchBlogData } from '../../store/admin.action';
import { blogSelectorData } from '../../store/admin.selector';
import { AdminAuthService } from '../../services/admin-auth.service';
import { showError, swal, swalConfirm } from 'src/app/helpers/swal.popup';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnDestroy,AfterViewInit {

  blogs$!: Observable<Blog[]>;
  private subscription!: Subscription;

  dataSource$ = new MatTableDataSource<Blog>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['position', 'thumbnail', 'title', 'category', 'trainer', 'action'];

  constructor(
    private dialog: MatDialog,
    private store: Store<Blog[]>,
    private adminService: AdminAuthService,
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  showBlog(id: string) {
    const dialogRef: MatDialogRef<ViewBlogComponent> = this.dialog.open(
      ViewBlogComponent,
      {
        width: '600px',
        height: '700px',
        data: { id: id },
      },
    );
    dialogRef.afterClosed().subscribe();
  }

  publishChange(id: string, approve: boolean) {
    swalConfirm().then((res) => {
      if (res.isConfirmed) {
        this.subscription = this.adminService.publishBlog(id, approve).subscribe(
          (res) => {
            if (res.success == true) {
              this.fetchData();
            } else {
              swal('error', "could't update publish")
            }
          }, (error) => {
            showError(error)
          });
      }
    })
  }

  fetchData() {
    this.store.dispatch(fetchBlogData());
    this.store.pipe(select(blogSelectorData)).subscribe(data=>{
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
