import type { UploaderFileListItem } from "vant";
export const useStorage = () => {

  const client = useSupabaseClient();
  
  const uploadFile = async(
    files: UploaderFileListItem | UploaderFileListItem[], 
    bucketName: string 
  ): Promise<string[]> => {
    if (!files) throw new Error("No file selected");

    const fileArray = Array.isArray(files) ? files : [files];

    const results = await Promise.all(
      fileArray.map(async(fileItem) => {
        const file = fileItem.file;
        if (!file) throw new Error("File is undefined");

        const fileExt = file.name.split('.').pop()?.toLowerCase() || "png";

        const fileName = `${Date.now()}-${Math.floor(Math.random() * 100000)}.${fileExt}`;

        const filePath = fileName;

        const { error, data } = await client.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error("Supabase Upload Error: ", error);
          throw new Error(`Upload error: ${error.message}`);
        };

        const { data: publicUrlData } = client.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        console.log(publicUrlData)

        return publicUrlData?.publicUrl ?? "";
      })
    );

    return results.filter(url => url !== "");
  };

  const deleteFile = async(
    files: string[],
    bucketName: string
  ) => {
    const filesToDelete = files.map(file => decodeURIComponent(file.split('/').pop() as string));
    const { data, error } = await client
      .storage
      .from(bucketName)
      .remove(filesToDelete);
    if (error) throw `Delete error: ${error.message}`;
    console.log(`Deleted files: `, data);
  }

  return {
    uploadFile,
    deleteFile
  }
}
