import type { ModifiedDatabase } from '@/types/supabase.d';

export const useTypedSupabase = () => {
  return useSupabaseClient<ModifiedDatabase>();
};