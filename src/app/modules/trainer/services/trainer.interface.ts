export interface Trainer {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  phone:number;
  password: string;
}

export interface Details {
  about: string;
  cv: File;
  certificate: File;
}

export interface Verify {
  token?: string;
  message: string
}

export interface Registeration {
  email?: boolean;
  id: string
}

export interface DeailsReturn {
  success: boolean;
  email?: string
}

export interface Blog {
  _id: string
  title: string
  category: string
  blog: string
  template: string
  trainerId: Trainers
}

export interface EventData {
  isTrusted: boolean;
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: EventTarget | null;
  defaultPrevented: boolean;
  eventPhase: number;
  returnValue: boolean;
  srcElement: EventTarget | null;
  target?: {
    files : File[]
  }
  timeStamp: number;
  type: string;
}

export interface Token{
  name: string;
  email:string;
  id:string
}

export interface Workout{
  _id:string
  title:string;
  muscle:string;
  level:string;
  reps:string;
  sets:string
  interval:string
  duration:string
  overview:string;
  thumbnail:string
  video:string
  trainerId:{
    _id:string;
    name:string
  }
  publish:boolean;
}

export interface Trainers {
  _id: string;
  name: string;
  email: string;
  about: string;
  cv: string;
  certificate: string[];
  access: boolean;
  approve: boolean;
  imageUrl: string;
}

export interface Users {
  _id: string;
  name: string;
  email: string;
  access: boolean;
  imageUrl: string
}

export interface Payment{
  _id:string
  amount: number;
  paidDate: Date;
  expiryDate: Date;
  paymentId: string;
  packageId: string;
  sessionId: string;
  userId: UserFull;
  trainerId: Trainers;
  status: string;
  trainer_status: boolean;
}

export interface UserFull {
    access: boolean;
    activity: string;
    age: number;
    caloriesBurn: number;
    caloriesNeed: number;
    email: string;
    gender: string;
    goal: string;
    goalWeight: number;
    height: number;
    isUpload: boolean;
    joinDate: string;
    months: number;
    name: string;
    password: string;
    phone: number;
    weight: number;
    __v: number;
    _id: string;
}