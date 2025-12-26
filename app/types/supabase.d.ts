import type { Database } from "./database.types";

type User = Database['public']['Tables']['users'];
export type UserRow = User['Row'];
export type UserInsert = User['Insert'];
export type UserUpdate = User['Update'];

type Set = Database['public']['Tables']['music_sets'];
export type SetRow = Omit<Set['Row'], 'content' | 'chakras'> & {
  content: MusicRow[];
  chakras: number[];
};
export type SetInsert = Omit<Set['Insert'], 'content' | 'chakras'> & {
  content: MusicInsert[];
  chakras: number[];
};
export type SetUpdate = Set['Update'];

type Music = Database['public']['Tables']['music_library'];
export type MusicRow = Music['Row'];
export type MusicInsert = Music['Insert'];
export type MusicUpdate = Music['Update'];