import { RequestAuthType, RequestMethodEnum } from "../../schema/http.schema";

const user = {
  changePassword: {
    queryKeyName: "RESET_PASSWORD",
    controllerName: "admin/user/reset",
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  login: {
    queryKeyName: "LOGIN",
    controllerName: "admin/user/login",
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.NOAUTH,
  },

  addUser: {
    queryKeyName: "ADD_USER",
    controllerName: "admin/user/add-user",
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  getUsers: {
    queryKeyName: "GET_USERS",
    controllerName: "admin/user/get-user",
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  getUserByUsername: {
    queryKeyName: "GET_USER_BY_USERNAME",
    controllerName: "admin/user/get-user-by-username",
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  deactivateUser: {
    queryKeyName: "DEACTIVATE_USER",
    controllerName: "admin/user/deactivate",
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  generateOtp: {
        queryKeyName: "GENERATE_OTP",
        controllerName: "reset-password/generate-Otp",
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.NOAUTH,
      },
    
      resetPassword: {
        queryKeyName: "RESET_PASSWORD",
        controllerName: "reset-password/reset",
        requestMethod: RequestMethodEnum.POST,
        requestAuthType: RequestAuthType.NOAUTH,
      },
};

export default user;
