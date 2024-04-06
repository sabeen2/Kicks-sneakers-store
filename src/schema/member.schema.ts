export interface MemberAddRequest {
  name: string;
  email: string;
  mobileNo: string;
  address: string;
}

export interface MemberUpdateRequest {
  memberid: number;
  name: string;
  email: string;
  mobileNo: string;
  address: string;
}

export interface MemberUploadRequest {
  file: any;
}
