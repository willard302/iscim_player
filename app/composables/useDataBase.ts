import type { Database } from "~/types/database.types";
import type { SetInsert, SetUpdate, UserInsert, UserUpdate } from "~/types/supabase";

export const useDataBase = () => {

  const client = useTypedSupabase();
  
  const handleError = (error: any, context: string, shouldThrow = true) => {
    if (!error) return;
    console.error(`[DB Error]${context}: ${error}`);
    if (!shouldThrow) return;
    throw new Error(`${context}:${error.message || error}`)
  };

  const getUser = async(userId: string) => {
    const {data, error} = await client
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle()
    
    handleError(error, "Error fetching user")
    return data;
  };
  const insertUser = async(userInfo: UserInsert) => {
    const {data, error} = await client
      .from("users")
      .upsert(userInfo, {onConflict: 'id'})
      .select("*")
      .single();

    handleError(error, `Error inserting user.`);
    return data;
  };
  const updateUser = async(userId: string, updateData: UserUpdate) => {
    const {data, error} = await client
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    handleError(error, `Error updating user.`);
    return data;
  };

  const getMusics = async(category?: string) => {

    let query = client
      .from("music_library")
      .select("*");

    if (category) {
      query = query.eq("category", category);
    };

    const {data, error} = await query;

    handleError(error, "Error fetching musics");
    return data ?? []
  };

  interface MusicQueryOptions {
    category?: string
    is_pro?: boolean
  };

  const getSets = async(options: MusicQueryOptions = {}) => {
    const {category, is_pro} = options;

    let query = client.from("music_sets").select("*");

    if (category) query = query.eq("category", category);
    if (is_pro !== undefined) query = query.eq("is_pro", is_pro);

    query = query.order("created_at", {ascending: false});

    const {data, error} = await query;
    handleError(error, "Error fetching sets");
    return data as SetInsert[];
  };
  const insertSet = async(setInfo: SetInsert) => {
    if (!setInfo) return;
    const { data, error } = await client
      .from("music_sets")
      .upsert(setInfo, {onConflict: 'id'})
      .select("*")
      .single();

    handleError(error, `Error inserting set.`);
    return data;
  };
  const updateSetToDb = async(setId: string, updateData: SetUpdate) => {
    const {data, error} = await client
      .from('music_sets')
      .update(updateData)
      .eq('id', setId)
      .select()
      .single()

    handleError(error, `Error updating set.`);
    return data;
  };
  const removeSetFromDb = async(setId: string) => {
    if (!setId) return;
    const { error, status } = await client
      .from("music_sets")
      .delete()
      .eq("id", setId)

    handleError(error, `Error deleting memberTracker`)
    return status;
  };

  return {
    getUser,
    insertUser,
    updateUser,
    getMusics,
    getSets,
    insertSet,
    updateSetToDb,
    removeSetFromDb
  }

}
