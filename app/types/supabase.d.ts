import type { Database as OriginalDatabase } from "./database.types";

type User = Database['public']['Tables']['users'];
export type UserRow = User['Row'];
export type UserInsert = User['Insert'];
export type UserUpdate = User['Update'];

type OriginalSet = OriginalDatabase['public']['Tables']['music_sets'];
export type SetRow = Omit<OriginalSet['Row'], 'content' | 'chakras'> & {
  content: MusicRow[]
  chakras: number[]
};
export type SetInsert = Omit<OriginalSet['Insert'], 'content' | 'chakras'> & {
  content: MusicRow[]
  chakras?: number[]
};
export type SetUpdate = Omit<OriginalSet['Update'], 'content' | 'chakras'> & {
  content?: MusicRow[]
  chakras?: number[]
};

type OriginalMusic = Database['public']['Tables']['music_library'];
export type MusicRow = OriginalMusic['Row'];
export type MusicLocal = Omit<MusicRow, 'checked' | 'sort_order'> & {
  checked?: boolean
  sort_order?: number
}
export type MusicInsert = OriginalMusic['Insert'];
export type MusicUpdate = OriginalMusic['Update'];

export type ModifiedDatabase = Omit<OriginalDatabase, 'public'> & {
  public: Omit<OriginalDatabase['public'], 'Tables'> & {
    Tables: Omit<OriginalDatabase['public']['Tables'], 'music_sets'> & {
      music_sets: {
        Row: SetRow;
        Insert: SetInsert;
        Update: SetUpdate;
        Relationships: OriginalSet['Relationships'];
      };
    };
  };
};