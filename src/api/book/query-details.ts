import {
  RequestAuthType,
  RequestMethodEnum,
  ResponseType,
} from "../../schema/http.schema";

const book = {
  fetchBook: {
    controllerName: `lib/books/get-all-books`,
    queryKeyName: `FETCH_BOOK`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  addBook: {
    controllerName: `lib/books/add-book`,
    queryKeyName: `ADD_BOOK`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  deleteBook: {
    controllerName: `lib/books/delete-book`,
    queryKeyName: `DELETE_BOOK`,
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  updateBook: {
    controllerName: `lib/books/update-book`,
    queryKeyName: `UPDATE_BOOK`,
    requestMethod: RequestMethodEnum.PUT,
    requestAuthType: RequestAuthType.AUTH,
  },

  findBookById: {
    controllerName: `lib/books/get-by-id`,
    queryKeyName: `FIND_BOOK`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  getBookImageById: {
    controllerName: `lib/books/get-image-by-id`,
    queryKeyName: `FIND_BOOKIMAGE`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
    responseType: ResponseType.BLOB,
  },
};

export default book;
