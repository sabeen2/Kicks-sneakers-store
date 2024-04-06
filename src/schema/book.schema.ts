export interface BookAddRequest {
  name: string;
  rating: any;
  stock: any;
  publishedDate: any;
  photo: any;
  isbn: any;
  pages: any;
  authorId: any;
  categoryId: any;
  file: any;
}

export interface BookUpdateRequest {
  id: any;
  name: string;
  rating: any;
  stock: any;
  publishedDate: any;
  photo: any;
  isbn: any;
  pages: any;
  authorId: any;
  categoryId: any;
  file: any;
}

export interface BookUploadRequest {
  file: any;
}
