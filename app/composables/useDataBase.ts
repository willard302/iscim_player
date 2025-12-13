import type { Database } from "~/types/database.types";
import type { UserInsert, UserUpdate } from "~/types/supabase";

export const useDataBase = () => {

  const client = useSupabaseClient<Database>();
  
  const handleError = (error: any, context: string) => {
    if (error) {
      console.error(`${context}:${error}`);
      throw new Error(`${context}:${error.message || error}`)
    }
  }

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

  return {
    getUser,
    insertUser,
    updateUser
  }

}
