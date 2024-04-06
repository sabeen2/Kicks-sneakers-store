import { useMutation, useQuery } from "react-query";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import user from "./query-details";
import { LoginRequest } from "../../schema/login.schema";

const { login, getUsers , addUser,deactivateUser, changePassword, resetPassword,generateOtp} = user;

export const useLogin = () => {
  return useMutation((requestData: LoginRequest) => {
    return makeHttpRequest(login, {
      requestData,
    });
  }); 
};

export const useFetchAllUsers = () => {
  return useQuery([getUsers.queryKeyName], () => {
    return makeHttpRequest(getUsers);
  });
};


export const useAddUser = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(addUser, {
      requestData,
    });
  });
};

export const useDeactivateUser = () => {
  return useMutation((userId: number) => {
    return makeHttpRequest(deactivateUser, {
      params: {
        id: userId,
      },
    });
  }); 
};

export const useGenerateOtp = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(generateOtp, {
      requestData,
    });
  });
};

export const useChangePassword = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(changePassword, {
      requestData,
    });
  });
};


export const useResetPassword = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(resetPassword, {
      requestData,
    });
  });
};







// export const useReactivateUser = () => {
//   return useMutation((userId: number) => {
//     return makeHttpRequest(reactivateUser, {
//       params: {
//         id: userId,
//       },
//     });
//   });
// };






// export const useSetRefreshToken = () => {
//   return useMutation((requestData: TokenRequest) => {
//     return makeHttpRequest(setRefreshToken, {
//       requestData,
//     });
//   });
// };
