export type UserFormValues = {
  firstName: string;
  lastName: string;
  age: string;
}

export type ExistingUser = {
  firstName: string;
  lastName: string;
  age: number;
} 

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string;
  createdAt: string;
}