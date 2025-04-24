import {
    SET_TOTAL,
    SET_ERROR,
    SET_IMAGES,
    NEW_SEARCH,
    SET_WINDOW_DIMENSIONS,
    INCREMENT_PAGE,
    SET_COLUMNS,
    LAST_PAGE_FETCHED,
    SELECTED_IMAGE,
    IMAGE_IDS,
  } from "./actions";

  import { IItem } from "@/types/types";

  export interface IState {
    total: number,
    images: IItem[],
    error: string,
    width: number,
    height: number,
    page: number,
    columns: number,
    lastPageFetched: number,
    selectedImage: IItem | null,
    imageIds: Record<string, string>
  }
  
  const initialState: IState = {
    total: 0,
    images: [],
    error: "",
    width: 0,
    height: 0,
    page: 1,
    columns: 1,
    lastPageFetched: 0,
    selectedImage: null,
    imageIds: {},
  };
  
  // reducer:
  
  export default function reducer(state: IState = initialState, action: any): IState {
    switch (action.type) {
      case SET_TOTAL:
        return {
          ...state,
          total: action.total,
        };
      case SET_ERROR:
        return {
          ...state,
          error: action.message,
        };
      case SET_IMAGES:
        return {
          ...state,
          images: [...state.images, ...action.images],
        };
      case NEW_SEARCH:
        return {
          ...state, ...initialState
        };
      case SET_WINDOW_DIMENSIONS:
        return {
          ...state,
          width: action.dimensions.width,
          height: action.dimensions.height,
        };
      case INCREMENT_PAGE:
        return {
          ...state,
          page: state.page + 1,
        };
      case SET_COLUMNS:
        return {
          ...state,
          columns: action.columns,
        };
      case LAST_PAGE_FETCHED:
        return {
          ...state,
          lastPageFetched: action.lastPageFetched,
        };
      case SELECTED_IMAGE:
        return {
          ...state,
          selectedImage: action.selectedImage,
        };
      case IMAGE_IDS:
        return {
          ...state,
          imageIds: { ...state.imageIds, ...action.imageIds }
        };
      default:
        return state;
    }
  }