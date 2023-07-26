import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Blog } from '../../services/admin-interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { fetchBlogData } from '../../store/admin.action';
import { blogSelectorData } from '../../store/admin.selector';
import { AdminAuthService } from '../../services/admin-auth.service';
import { showError, swal, swalConfirm } from 'src/app/helpers/swal.popup';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnDestroy {
  blogs$!: Observable<Blog[]>;
  private subscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private store: Store<Blog[]>,
    private adminService: AdminAuthService,
  ) {}

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
    swalConfirm().then((res)=>{
      if(res.isConfirmed){
        this.subscription = this.adminService.publishBlog(id, approve).subscribe(
          (res) => {
            if (res.success == true) {
              this.fetchData();
            }else{
              swal('error',"could't update publish")
            }
          },(error)=>{
            showError(error)
          });
      }
    })
  }

  fetchData() {
    this.store.dispatch(fetchBlogData());
    this.blogs$ = this.store.pipe(select(blogSelectorData));
  }

  ngOnDestroy(): void {
    if(this.subscription) this.subscription.unsubscribe();
  }
}
 