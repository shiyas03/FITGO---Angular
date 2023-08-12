import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog, DeailsReturn, Register, Registeration, Trainer, Verify, Workout } from './trainer.interface';
import { environment } from '../../../../environments/environment'
import { Profile } from '../store/trainer.interface';
import { decodeToken } from 'src/app/common/token.decode';

@Injectable({
  providedIn: 'root'
})
export class TrainerAuthService {

  apiUrl: string = environment.apiURL

  constructor(private http: HttpClient) { }

  trainerId(){
    const token = <string>localStorage.getItem('trainerToken');
    const { id } = decodeToken(token);
    return id
  }

  trainerLogin(trainerData: Trainer): Observable<Verify> {
    return this.http.post<Verify>(`${this.apiUrl}/trainer/login`, trainerData)
  }

  registration(details: Register): Observable<Registeration> {
    return this.http.post<Registeration>(`${this.apiUrl}/trainer/register`, details)
  }

  detailsUpload(details: FormData, id: string): Observable<DeailsReturn> {
    return this.http.post<DeailsReturn>(`${this.apiUrl}/trainer/details?id=${id}`, details)
  }

  trainerAccess(id: string): Observable<{ access: boolean }> {
    return this.http.get<{ access: boolean }>(`${this.apiUrl}/trainer/access/${id}`)
  }

  uploadBlog(data: FormData, id: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/blogs/upload?id=${id}`, data)
  }

  fetchBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs/fetch`)
  }

  updateBlog(data: FormData, id: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/blogs/update?id=${id}`, data)
  }

  fetchProfileDetails(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/trainer/fetch/${id}`)
  }

  uploadProfileImage(profile: FormData, id: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/trainer/image?id=${id}`, profile)
  }

  uploadWorkouts(id: string, files: FormData): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/workouts/upload?id=${id}`, files)
  }

  updateWorkouts(id: string, files: FormData): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/workouts/update?id=${id}`, files)
  }

  fetchWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.apiUrl}/workouts/fetch`)
  }

  updateService(data: string, id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/trainer/service?id=${id}`, { data })
  }

  removeService(data: string, id: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/trainer/service_remove?id=${id}`, { data })
  }
}


