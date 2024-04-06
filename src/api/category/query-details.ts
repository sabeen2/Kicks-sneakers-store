import {
  RequestAuthType,
  RequestMethodEnum,
  ResponseType,
} from "../../schema/http.schema";

const category = {
  fetchCategory: {
    controllerName: `lib/category/get-all-category`,
    queryKeyName: `FETCH_CATEGORY`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  addCategory: {
    controllerName: `lib/category/add-category`,
    queryKeyName: `ADD_CATEGORY`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  deleteCategory: {
    controllerName: `lib/category/delete-category`,
    queryKeyName: `DELETE_CATEGORY`,
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  updateCategory: {
    controllerName: `lib/category/update-category`,
    queryKeyName: `UPDATE_CATEGORY`,
    requestMethod: RequestMethodEnum.PUT,
    requestAuthType: RequestAuthType.AUTH,
  },

  findCategoryById: {
    controllerName: `lib/category/get-by-id`,
    queryKeyName: `FIND_CATEGORY`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  downloadCategoryDetails: {
    controllerName: `lib/category/download-category`,
    queryKeyName: `DOWNLOAD_CATEGORY`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
    responseType: ResponseType.BLOB,
  },

  handleCategoryDataUpload: {
    controllerName: `lib/category/export-to-db-category`,
    queryKeyName: `UPLOAD_CATEGORY`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },
};

export default category;
