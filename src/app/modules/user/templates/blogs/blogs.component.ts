import { Component, ElementRef, OnInit,AfterViewInit } from '@angular/core';
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
export class BlogsComponent implements OnInit,AfterViewInit {
  blogs$!: Observable<Blog[]>;
  show: boolean = false;
  notFound:boolean = true;

  constructor(private store: Store<Blog>, private router: Router,private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.store.dispatch(fetchBlogData());
    this.blogs$ = this.store.pipe(select(blogSelectorData));
    this.blogs$.subscribe(data=>{
      for(let value of data){
        if(value.approve == true){
          this.notFound = false
        } 
      }
    })
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
