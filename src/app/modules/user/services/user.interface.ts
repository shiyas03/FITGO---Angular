
export interface Register {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface RegisterReturn {
    emailError?: boolean;
    phoneError?: boolean;
    id?: string,
    success?: boolean
}

export interface EmailReturn {
    success: boolean,
    otp: string
}

export interface DetailsReturn {
    success: boolean,
    token: string,
    id: string
}

export interface LoginReturn {
    error: string
    token: string,
    id: string
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
    imageUrl: string
}

export interface UpdateDetails{
    name: string;
    phone: number;
    age: number;
    height: number;
    weight: number;
}