export interface CategoryAddRequest {
  name: string;
  discription: string;
}
export interface CategoryUpdateRequest {
  id: number;
  name: string;
  discription: string;
}

export interface CategoryUploadRequest {
  file: any;
}
