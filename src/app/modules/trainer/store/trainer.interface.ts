export interface Blog {
  _id: string;
  title: string;
  category: string;
  blog: Blog;
  template: string;
  trainerId: string;
}

export interface Profile {
  _id: string
  name: string;
  email: string;
  phone: number;
  about: string;
  experience: string;
  specialized: string;
  joinDate: Date;
  imageUrl: string;
  services: string[];
  payments: [{
    _id: string;
    amount: number;
    date: Date
  }]
}

export interface InitailProfile {
  trainer: Profile | null;
}

export interface Udpate {
  name: string;
  phone: string;
  about: string;
}