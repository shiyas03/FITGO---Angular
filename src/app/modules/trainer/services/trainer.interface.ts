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
  trainerId: string
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