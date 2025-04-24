export interface IItem {
    id: number
    previewURL: string
    largeImageURL: string
    user: string
    tags: string
    imageWidth: number
    imageHeight: number
}

export interface IResponseData {
    total: number
    totalHits: number
    hits: IItem[]
}

export const initialResponseData = {
    total: 0,
    totalHits: 0,
    hits: [],
}

export interface IDimensions {
    width: number
    height: number
}