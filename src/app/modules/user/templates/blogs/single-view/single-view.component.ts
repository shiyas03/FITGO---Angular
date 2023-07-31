import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Blog } from '../../../store/user';
import { blogSelectorData, singleBlogSelector } from '../../../store/user.selector';
import { Observable } from 'rxjs';
import { fetchBlogData } from '../../../store/user.action';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.css'],
})
export class SingleViewComponent implements OnInit {
  blog$!: Observable<Blog | undefined>;
  blogs:string[] = []

  constructor(private route: ActivatedRoute, private store: Store<Blog>) {}

  ngOnInit(): void {
    this.fetchBlogs()
    this.route.paramMap.subscribe(() => {
      if (history.state) {
        const id = history.state.id;
        this.blog$ = this.store.pipe(select(singleBlogSelector(id)));
        this.blog$.subscribe((data)=>{
          if(data){
            this.blogs = data.blog.split('.')
          }
        })
      }
    });
  }

  fetchBlogs(){
    this.store.dispatch(fetchBlogData());
    this.store.pipe(select(blogSelectorData));
  }
}
