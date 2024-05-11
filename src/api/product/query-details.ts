import {
  RequestAuthType,
  RequestMethodEnum,
  ResponseType,
} from "../../schema/http.schema";

const author = {
  fetchAuthor: {
    controllerName: `products/get-all-products`,
    queryKeyName: `FETCH_PRODUCT`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  addProduct: {
    controllerName: `products/add-product`,
    queryKeyName: `ADD_AUTHOR`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  deleteAuthor: {
    controllerName: `lib/authors/delete-author`,
    queryKeyName: `DELETE_AUTHOR`,
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  updateAuthor: {
    controllerName: `lib/authors/update-author`,
    queryKeyName: `UPDATE_AUTHOR`,
    requestMethod: RequestMethodEnum.PUT,
    requestAuthType: RequestAuthType.AUTH,
  },

  findAuthorById: {
    controllerName: `lib/authors/find-by-id`,
    queryKeyName: `FIND_AUTHOR`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  downloadAuthorDetails: {
    controllerName: `lib/authors/download-author`,
    queryKeyName: `DOWNLOAD_AUTHOR`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
    responseType: ResponseType.BLOB,
  },

  getImage: {
    controllerName: `products/get-image-by-id`,
    queryKeyName: `GET_IMAGE`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },
};

export default author;
