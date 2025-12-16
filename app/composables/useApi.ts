import { useLoadingStore } from "~/store/useLoadingStore"

export const useApi = async <T>(url:string, options: any) => {
  const loadingStore = useLoadingStore();

  loadingStore.startLoading()

  try {
    const {data, error} = await useFetch<T>(url, {
      ...options,
      onRequest({request, response}) {
        console.log(request)
      },
      onResponseError({response}) {
        console.error('api error', response.status)
      }
    });
    if (error.value) {throw error.value;};

    return data.value
  } catch (error) {
    console.error('Request Failed:', error);
    throw error;
  } finally {
    loadingStore.finishLoading();
  }

}
