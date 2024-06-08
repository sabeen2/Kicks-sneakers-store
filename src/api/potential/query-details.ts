import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const author = {
  fetchCustomers: {
    controllerName: `potential-customers/get-potential-customers`,
    queryKeyName: `FETCH_CUSTOMERS`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  addCustomers: {
    controllerName: `potential-customers`,
    queryKeyName: `ADD_CUSTOMERS`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },
};

export default author;
