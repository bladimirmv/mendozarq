import { types } from "util";

export type Roles = 'administrador' | 'arquitecto' | 'cliente' | 'vendedor';
export interface User {
  docid?: string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  name: string;
  lastName: string;
  phone?: string;
  address?: string;
  email?: string;
  password?: string;
  role: Roles;
}
