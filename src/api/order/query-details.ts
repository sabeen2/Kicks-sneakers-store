import {
  RequestAuthType,
  RequestMethodEnum,
  ResponseType,
} from "../../schema/http.schema";

const transaction = {
  fetchAllTransaction: {
    controllerName: `orders/get-orders-history`,
    queryKeyName: `FETCH_ALL`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  fetchActiveTransaction: {
    controllerName: `orders/get-orders`,
    queryKeyName: `FETCH_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  fetchBestSellers: {
    controllerName: `orders/get-best-sellers`,
    queryKeyName: `FETCH_SALESREPORT`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  sendMail: {
    controllerName: `mail/send-mail`,
    queryKeyName: `SEND_MAIL`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  fetchSalesReport: {
    controllerName: `orders/get-sales-report`,
    queryKeyName: `FETCH_BEST`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  addTransaction: {
    controllerName: `orders/add-order`,
    queryKeyName: `ADD_TRANSACTION`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  deleteTransaction: {
    controllerName: `orders/dispatch-orders`,
    queryKeyName: `DELETE_TRANSACTION`,
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  getBill: {
    controllerName: `orders/get-bill`,
    queryKeyName: `UPDATE_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  findTransactionById: {
    controllerName: `lib/transactions/get-by-id`,
    queryKeyName: `FIND_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  downloadTransactionDetails: {
    controllerName: `orders/download-history`,
    queryKeyName: `DOWNLOAD_TRANSACTION`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
    responseType: ResponseType.BLOB,
  },

  handleTransactionDataUpload: {
    controllerName: `lib/transactions/export-to-db`,
    queryKeyName: `UPLOAD_TRANSACTION`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  mailDueTransaction: {
    controllerName: `lib/transactions/send-due-date-mail`,
    queryKeyName: `MAIL_DUE`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  fetchPageCount: {
    controllerName: `lib/transactions/get-transactionCount`,
    queryKeyName: `FETCH_COUNT`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },
};

export default transaction;
