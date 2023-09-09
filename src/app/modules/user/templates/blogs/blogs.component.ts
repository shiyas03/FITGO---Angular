import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Blog } from '../../store/user';
import { Store, select } from '@ngrx/store';
import { fetchBlogData } from '../../store/user.action';
import { blogSelectorData } from '../../store/user.selector';
import { Observable, map } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit, AfterViewInit {

  blogs$!: Observable<Blog[]>;
  blogs: Blog[] = []
  show: boolean = false;
  notFound: boolean = true;
  searchQuery: string = '';
  selectedBlog: string = 'all';

  constructor(private store: Store<Blog>, private router: Router, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.store.dispatch(fetchBlogData());
    this.blogs$ = this.store.pipe(select(blogSelectorData));
    this.approvedBlogs()
  }

  approvedBlogs(){
    this.blogs$.subscribe(data => {
      this.blogs = []
      for (let value of data) {
        if (value.approve == true) {
          this.notFound = false
          this.blogs.push(value)
        }
      }
    })
  }

  applySearchFilter() {
    const trimmedQuery = this.searchQuery.trim();
    if (trimmedQuery === '') {
      this.blogs$ = this.store.pipe(select(blogSelectorData));
    } else {
      this.blogs$ = this.blogs$.pipe(
        map(blogs =>
          blogs.filter(blog =>
            blog.title.toLowerCase().includes(this.searchQuery.toLowerCase())
          )
        )
      );
    }
    this.approvedBlogs()
  }

  applyCategoryFilter() {
    if (this.selectedBlog === 'all') {
      this.blogs$ = this.store.pipe(select(blogSelectorData));
    } else {
      this.blogs$ = this.blogs$.pipe(
        map(blogs =>
          blogs.filter(blog =>
            blog.category === this.selectedBlog
          )
        )
      );
    }
    this.approvedBlogs()
  }

  ngAfterViewInit(): void {
    this.scrollToTop()
  }

  private scrollToTop(): void {
    const element = this.elementRef.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  showBlog(id: string) {
    const data = { id: id };
    const navigationExtras: NavigationExtras = {
      state: data,
    };
    this.router.navigate(['blogs/view'], navigationExtras);
  }
}
