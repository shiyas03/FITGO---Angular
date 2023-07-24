import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog, DeailsReturn, Register, Registeration, Trainer, Verify } from './trainer.interface';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TrainerAuthService {

  apiUrl: string = environment.apiURL

  constructor(private http: HttpClient) { }

  trainerLogin(trainerData: Trainer): Observable<Verify> {
    return this.http.post<Verify>(`${this.apiUrl}/trainer/login`, trainerData)
  }

  registration(details: Register): Observable<Registeration> {
    return this.http.post<Registeration>(`${this.apiUrl}/trainer/register`, details)
  }

  detailsUpload(details: FormData, id: string): Observable<DeailsReturn> {
    return this.http.post<DeailsReturn>(`${this.apiUrl}/trainer/details/${id}`, details)
  }

  uploadBlog(data: FormData, id: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/blogs/blog-upload?id=${id}`, data)
  }

  fetchBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs/fetch`)
  }
}


