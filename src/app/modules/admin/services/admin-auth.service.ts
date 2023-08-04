import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin, Auth, Blog, Trainers, Users, Workout } from './admin-interface';
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
    return this.http.get<Trainers[]>(`${this.apiUrl}/trainer/fetchAll`)
  }

  approveTrainer(id: string, approve: boolean): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/trainer/approve`, { id, approve })
  }

  trainerAccess(id: string, access: boolean): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/trainer/access`, { id, access })
  }

  fetchBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs/fetch`)
  }

  publishBlog(id: string, action: boolean): Observable<{ success: true }> {
    return this.http.patch<{ success: true }>(`${this.apiUrl}/blogs/publish?id=${id}`, { action })
  }

  getPdfFileUrl(filename: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trainer/documents/${filename}`, { responseType: 'arraybuffer' });
  }

  fetchWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.apiUrl}/workouts/fetch`)
  }

  publishWorkout(id: string, change: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/workouts/publish?id=${id}`, { change })
  }
}


