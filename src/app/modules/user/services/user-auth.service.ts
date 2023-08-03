import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Blog, Details, Login, Trainer, User } from '../store/user';
import { environment } from '../../../../environments/environment'
import { EmailReturn, Register, RegisterReturn, DetailsReturn, LoginReturn, ProfileDetails, UpdateDetails, Workout, PaymentData } from './user.interface';
import { activity } from './user.enum';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private apiUrl: string = environment.apiURL
  constructor(private http: HttpClient) { }

  registerUser(userData: Register): Observable<RegisterReturn> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  sendMail(id: string): Observable<EmailReturn> {
    return this.http.post<EmailReturn>(`${this.apiUrl}/mail/`, { id });
  }

  fetchUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user?id=${id}`)
  }

  verifyOTP(details: { id: string, access: boolean }): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/verify-otp`, details)
  }

  uploadDetails(details: Details): Observable<DetailsReturn> {
    return this.http.post<DetailsReturn>(`${this.apiUrl}/user-details`, details)
  }

  verifyLogin(details: Login): Observable<LoginReturn> {
    return this.http.post<LoginReturn>(`${this.apiUrl}/`+activity.Login, details)
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

  payment(stripeToken: PaymentData, trainerId: string, userId: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/payment`, { stripeToken, trainerId, userId })
  }
}
