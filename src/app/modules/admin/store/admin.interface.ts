export interface Users {
  _id: string;
  name: string;
  email: string;
  access: boolean;
  imageUrl: string;
  joinDate: string
}

export interface Trainers {
  _id: string;
  name: string;
  email: string;
  about: string;
  cv: string;
  certificate: string[];
  access: boolean;
  approve: boolean
  imageUrl: string;
  joinDate: Date
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
  };
  approve: boolean;
}
