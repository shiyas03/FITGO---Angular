import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin, Auth, Blog, Trainers, Users } from './admin-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  apiUrl: string = environment.apiURL;
  constructor(private http: HttpClient) { }

  adminLogin(adminData: Admin): Observable<Auth> {
    return this.http.post<Auth>(`${this.apiUrl}/admin/login`, adminData)
  }

  fetchUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.apiUrl}/admin/users`)
  }

  userAccess(id: string, access: boolean): Observable<Auth> {
    return this.http.patch<Auth>(`${this.apiUrl}/admin/user-access`, { id, access })
  }

  fetchTrainers(): Observable<Trainers[]> {
    return this.http.get<Trainers[]>(`${this.apiUrl}/admin/trainers`)
  }

  approveTrainer(id: string, approve: boolean): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/admin/trainer-approve`, { id, approve })
  }

  trainerAccess(id: string, access: boolean): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/admin/trainer-access`, { id, access })
  }

  fetchBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs/fetch`)
  }

  publishBlog(id: string, action: boolean): Observable<{ success: true }> {
    return this.http.patch<{ success: true }>(`${this.apiUrl}/blogs/publish?id=${id}`, { action })
  }
}


