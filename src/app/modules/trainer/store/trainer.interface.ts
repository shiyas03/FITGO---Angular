export interface Blog {
  _id: string;
  title: string;
  category: string;
  blog: Blog;
  template: string;
  trainerId: string;
}

export interface Profile {
  name: string;
  email: string;
  phone:number;
  about: string;
  experience: string;
  specialized:string;
  joinDate: Date;
  imageUrl:string;
}

export interface InitailProfile {
  trainer: Profile | null;
}
