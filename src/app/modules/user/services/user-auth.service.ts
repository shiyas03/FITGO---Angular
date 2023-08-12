import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Blog, Details, Login, Trainer, User } from '../store/user';
import { environment } from '../../../../environments/environment'
import { EmailReturn, Register, RegisterReturn, LoginReturn, ProfileDetails, UpdateDetails, Workout, PaymentData, Payment } from './user.interface';
import { activity } from './user.enum';
import { decodeToken } from 'src/app/common/token.decode';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private apiUrl: string = environment.apiURL
  constructor(private http: HttpClient) { }

  getTokenData() {
    const token = <string>localStorage.getItem('userToken')
    return decodeToken(token)
  }

  registerUser(userData: Register): Observable<RegisterReturn> {
    return this.http.post<RegisterReturn>(`${this.apiUrl}/register`, userData);
  }

  sendMail(email: string): Observable<EmailReturn> {
    return this.http.post<EmailReturn>(`${this.apiUrl}/mail/`, { email });
  }

  fetchUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user?id=${id}`)
  }

  verify(userData: Register): Observable<{ success: boolean, token: string }> {
    return this.http.post<{ success: boolean, token: string }>(`${this.apiUrl}/verify`, userData)
  }

  uploadDetails(details: Details): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/user-details`, details)
  }

  verifyLogin(details: Login): Observable<LoginReturn> {
    return this.http.post<LoginReturn>(`${this.apiUrl}/` + activity.Login, details)
  }

  fetchProfileDetails(id: string): Observable<ProfileDetails> {
    return this.http.get<ProfileDetails>(`${this.apiUrl}/profile/${id}`)
  }

  profileUpload(profile: FormData, id: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/profileImage?id=${id}`, profile)
  }

  removeImage(id: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(`${this.apiUrl}/image-remove`, { id })
  }

  updateDetails(details: UpdateDetails, id: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/update-details?id=${id}`, details)
  }

  fetchBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs/fetch`)
  }

  fetchTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${this.apiUrl}/trainer/fetchAll`)
  }

  fetchWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.apiUrl}/workouts/fetch`)
  }

  payment(data: Payment): Observable<{ id: string, url: string }> {
    return this.http.post<{ id: string, url: string }>(`${this.apiUrl}/payment`, data)
  }

  paymentStatus(session_id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/payment/status/${session_id}`)
  }

}
