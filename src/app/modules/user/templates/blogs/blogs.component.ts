import { Component, OnInit } from '@angular/core';
import { Blog } from '../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchBlogData } from '../../store/user.action';
import { blogSelectorData } from '../../store/user.selector';
import { Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  blogs$!: Observable<Blog[]>;
  show: boolean = false;

  constructor(private store: Store<Blog>, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(fetchBlogData());
    this.blogs$ = this.store.pipe(select(blogSelectorData));
  }

  showBlog(id: string) {
    const data = { id: id };
    const navigationExtras: NavigationExtras = {
      state: data,
    };
    this.router.navigate(['blogs/view'], navigationExtras);
  }
}
