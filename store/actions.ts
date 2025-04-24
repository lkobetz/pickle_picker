import { IDimensions, IItem } from '@/types/types'

export const SET_TOTAL = "SET_TOTAL";
export const SET_ERROR = "SET_ERROR";
export const SET_IMAGES = "SET_IMAGES";
export const NEW_SEARCH = "NEW_SEARCH";
export const SET_WINDOW_DIMENSIONS = "SET_WINDOW_DIMENSIONS";
export const INCREMENT_PAGE = "INCREMENT_PAGE";
export const SET_COLUMNS = "SET_COLUMNS";
export const LAST_PAGE_FETCHED = "LAST_PAGE_FETCHED"
export const SELECTED_IMAGE = "SELECTED_IMAGE";
export const IMAGE_IDS = "IMAGE_IDS";

export const setTotal = (total: number) => {
  return {
    type: SET_TOTAL,
    total,
  };
};

export const setError = (message: string) => {
  return {
    type: SET_ERROR,
    message,
  };
};

export const setImages = (images: IItem[]) => {
  return {
    type: SET_IMAGES,
    images,
  };
};

export const newSearch = () => {
  return {
    type: NEW_SEARCH,
  };
};

export const setWindowDimensions = (dimensions: IDimensions) => {
  return {
    type: SET_WINDOW_DIMENSIONS,
    dimensions,
  };
};

export const setColumns = (columns: number) => {
  return {
    type: SET_COLUMNS,
    columns,
  };
};

export const incrementPage = () => {
  return {
    type: INCREMENT_PAGE,
  };
};

export const setLastPageFetched = (lastPageFetched: number) => {
  return {
    type: LAST_PAGE_FETCHED,
    lastPageFetched,
  };
};

export const setSelectedImage = (selectedImage: IItem) => {
  return {
    type: SELECTED_IMAGE,
    selectedImage,
  };
};

export const addImageIds = (imageIds: Record<string, string>) => {
  return {
    type: IMAGE_IDS,
    imageIds,
  };
};