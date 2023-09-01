import { Workout } from "../services/user.interface";

export interface Register {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export interface RegisterInitial {
    register: Register | null
}

export interface User {
    _id: string;
    name: string;
    email: string;
    access: boolean
}

export interface UserInitail {
    user: User | null
}


export interface Details {
    id: string | null
    age: number;
    height: number;
    weight: number;
    goal: string;
    goalWeight: number;
    months: number;
    gender: string;
    activity: string;
    calorieBurn: number;
    calorieNeed: number;
}

export interface Login {
    email: string;
    password: string;
}

export interface works {
    _id: string
    workouts: Workout;
    date: Date
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
    workouts: works[]
}

export interface profileInital {
    details: ProfileDetails | null
}

export interface Blog {
    _id: string;
    title: string;
    category: string;
    blog: string;
    template: string;
    trainerId: {
        _id: string;
        name: string;
        experience: number,
        specialized: string,
        about: string;
        imageUrl: string;
    };
    approve: boolean;
    publishedDate: Date
}

export interface Trainer {
    _id: string;
    name: string;
    experience: number
    specialized: string
    about: string;
    imageUrl: string;
    joinDate: Date;
    access: boolean
    services: string[];
    reviews: [{
        review: string;
        userId: {
            _id: string;
            name: string;
            imageUrl: string;
        }
    }]
}