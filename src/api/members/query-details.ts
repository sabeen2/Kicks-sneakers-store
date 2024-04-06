import {
  RequestAuthType,
  RequestMethodEnum,
  ResponseType,
} from "../../schema/http.schema";

const member = {
  fetchMember: {
    controllerName: `lib/members/all-members`,
    queryKeyName: `FETCH_MEMBER`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  addMember: {
    controllerName: `lib/members/add-member`,
    queryKeyName: `ADD_MEMBER`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },

  deleteMember: {
    controllerName: `lib/members/remove-member`,
    queryKeyName: `DELETE_MEMBER`,
    requestMethod: RequestMethodEnum.DELETE,
    requestAuthType: RequestAuthType.AUTH,
  },

  updateMember: {
    controllerName: `lib/members/update-members`,
    queryKeyName: `UPDATE_MEMBER`,
    requestMethod: RequestMethodEnum.PUT,
    requestAuthType: RequestAuthType.AUTH,
  },

  findMemberById: {
    controllerName: `lib/members/get-by-id`,
    queryKeyName: `FIND_MEMBER`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
  },

  downloadMemberDetails: {
    controllerName: `lib/members/download-members`,
    queryKeyName: `DOWNLOAD_MEMBER`,
    requestMethod: RequestMethodEnum.GET,
    requestAuthType: RequestAuthType.AUTH,
    responseType: ResponseType.BLOB,
  },

  handleMemberDataUpload: {
    controllerName: `lib/members/export-to-db-members`,
    queryKeyName: `UPLOAD_MEMBER`,
    requestMethod: RequestMethodEnum.POST,
    requestAuthType: RequestAuthType.AUTH,
  },
};

export default member;
