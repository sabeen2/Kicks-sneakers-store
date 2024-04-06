interface AuthorDataType {
  key: string;
  name: string;
  email: string;
  mobile_number: string;
}

export const AuthorData: AuthorDataType[] = [
  {
    key: "1",
    name: "Author 1",
    email: "john@example.com",
    mobile_number: "1234567890",
  },
  {
    key: "2",
    name: "Author 2",
    email: "jim@example.com",
    mobile_number: "9876543210",
  },
  {
    key: "3",
    name: "Author 3",
    email: "joe@example.com",
    mobile_number: "5678901234",
  },
];

interface CategoryDataType {
  key: string;
  name: string;
  description: string;
}

export const CategoryData: CategoryDataType[] = [
  {
    key: "1",
    name: "Category 1",
    description: "Some description for Category 1",
  },
  {
    key: "2",
    name: "Category 2",
    description: "Some description for Category 2",
  },
  {
    key: "3",
    name: "Category 3",
    description: "Some description for Category 3",
  },
];

interface MemberDataType {
  key: string;
  name: string;
  email: string;
  mobile_no: string;
  address: string;
}

export const MemberData: MemberDataType[] = [
  {
    key: "1",
    name: "Sabin",
    email: "sabin@gmail.com",
    mobile_no: "9813556699",
    address: "Balaju Bypass",
  },
  {
    key: "2",
    name: "Rishab",
    email: "rishab@gmail.com",
    mobile_no: "9813556611",
    address: "Balaju kalanki",
  },
  {
    key: "3",
    name: "CDexter",
    email: "xter@gmail.com",
    mobile_no: "9813551337",
    address: "Balaju California",
  },
];

interface BookDataType {
  key: string;
  name: string;
  isbn: string;
}

export const BookData: BookDataType[] = [
  {
    key: "1",
    name: "The Lord of the Rings",
    isbn: "9780547928227",
  },
  {
    key: "2",
    name: "The Hitchhiker's Guide to the Galaxy",
    isbn: "9780345391803",
  },
  {
    key: "3",
    name: "Harry Potter and the Philosopher's Stone",
    isbn: "9780747532699",
  },
];

interface RentDataType {
  key: string;
  name: string;
  code: string;
}

export const RentData: RentDataType[] = [
  {
    key: "1",
    name: "The Lord of the Rings",
    code: "968E2",
  },
  {
    key: "2",
    name: "Conjuring",
    code: "169C9",
  },
  {
    key: "3",
    name: "Game of Thrones",
    code: "56PL6",
  },
];

interface ReturnDataType {
  key: string;
  name: string;
  code: string;
}

export const ReturnData: ReturnDataType[] = [
  {
    key: "1",
    name: "The Lords",
    code: "CC11SS",
  },
  {
    key: "2",
    name: "Conjuring",
    code: "PP99RR",
  },
  {
    key: "3",
    name: "Hunger games",
    code: "LL55TT",
  },
];
