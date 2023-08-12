import { Trainer, User } from "../store/user";

export interface Register {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface RegisterReturn {
    success: boolean
    message: string;
}

export interface EmailReturn {
    success: boolean,
    otp: string
}

export interface LoginReturn {
    error: string
    token: string,
    message: string
}

export interface ProfileDetails {
    _id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    height: number;
    weight: number;
    goal: string;
    goalWeight: number;
    months: number;
    gender: string;
    activity: string;
    caloriesBurn: number;
    caloriesNeed: number;
    imageUrl: string;
    isUpload?: boolean;
    joinDate?: Date;
}

export interface UpdateDetails {
    name: string;
    phone: number;
    age: number;
    height: number;
    weight: number;
}

export interface Error {
    statusText: string;
    status: number;
    error: {}
}

export interface PaymentData {
    id: string;
    object: string;
    client_ip: string;
    created: number;
    email: string;
    livemode: boolean;
    type: string;
    used: boolean;
    amount: number;
    specialized: string;
    card: {
        exp_month: number;
        exp_year: number;
        funding: string;
        id: string;
        last4: string;
        name: string;
        object: string;
    }
}

export interface Payment {
    amount: number;
    userId: string;
    trainerId: string;
    packageId: string;
}

export interface Workout {
    _id: string
    title: string;
    muscle: string;
    level: string;
    reps: string;
    sets: string
    interval: string
    duration: string
    overview: string;
    thumbnail: string
    video: string
    trainerId: {
        name: string;
        imageUrl: string;
        experience: string;
        specialized: string;
    }
    publish: boolean;
}

export interface PaymentDetails {
    amount: number;
    paidDate: Date;
    expiryDate: Date;
    paymentId: string;
    packageId: string;
    sessionId: string;
    userId: User;
    trainerId: Trainer;
}