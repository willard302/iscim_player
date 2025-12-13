import type { Database } from "./database.types";

type User = Database['public']['Tables']['users'];
export type UserRow = User['Row'];
export type UserInsert = User['Insert'];
export type UserUpdate = User['Update'];