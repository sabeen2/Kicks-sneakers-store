export interface AuthorAddRequest {
  name: string;
  discription: string;
}

export interface AuthorUpdateRequest {
  id: any;
  name: string;
  discription: string;
}

export interface AuthorUploadRequest {
  file: any;
}
