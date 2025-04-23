import axios from "axios";
import apiKey from "@/secrets";
import { initialResponseData, IResponseData } from "../types/types";

export const callApi = async (input: string, page: number, perPage: number): Promise<IResponseData> => {
  ;
  try {
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
  return initialResponseData;
};