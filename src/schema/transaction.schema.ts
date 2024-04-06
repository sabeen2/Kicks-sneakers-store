export interface TransactionAddRequest {
  code: any;
  bookId: any;
  fromDate: any;
  toDate: any;
  rentType: any;
  Fk_member_id: any;
}

export interface TransactionUpdateRequest {
  id: any;
  code: any;
  bookId: any;
  fromDate: any;
  toDate: any;
  rentType: any;
  Fk_member_id: any;
}

export interface TransactionUploadRequest {
  file: any;
}
