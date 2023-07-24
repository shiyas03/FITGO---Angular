import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { Blog } from '../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchBlogData } from '../../store/user.action';
import { blogSelectorData } from '../../store/user.selector';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  blogs$!: Observable<Blog[]>

  constructor(private userService: UserAuthService, private store: Store<Blog>) { }

  ngOnInit(): void {
    this.store.dispatch(fetchBlogData())
    this.blogs$ = this.store.pipe(select(blogSelectorData))
  }

}
