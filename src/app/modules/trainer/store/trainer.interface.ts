export interface Blog {
    _id: string
    title: string;
    category: string;
    blog: Blog;
    template: string;
    trainerId: string;
}