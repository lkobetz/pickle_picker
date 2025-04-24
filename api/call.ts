import { useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import apiKey from "@/secrets";
import { incrementPage, setLastPageFetched } from "@/store/actions";
import store from "@/store/index";
import { initialResponseData } from "@/types/types";


export const useCallAPI = () => {
  const dispatch = useDispatch();

  const callAPI = useCallback(async (input: string, perPage: number = 50) => {
    const page = store.getState().page;
    const lastPageFetched = store.getState().lastPageFetched;
      if (lastPageFetched < page) {
        try {
          console.log('fetching page:', page);
          dispatch(setLastPageFetched(page));
          dispatch(incrementPage());
          const results = await axios.get(
            `https://pixabay.com/api/?key=${apiKey}&q=${input}&image_type=photo&page=${page}&per_page=${perPage}`
          );
          return results?.data;
        } catch (err: any) {
          if (err?.request) {
            console.log(err.request.response);
          } else {
            console.log(err);
          }
        }
      }
      return initialResponseData
    }, []);

  return { callAPI };
};