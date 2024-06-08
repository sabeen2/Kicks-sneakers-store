import { useMutation, useQuery } from "react-query";

import author from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";

const { fetchCustomers, addCustomers } = author;

// export const useFetchAuthor = () => {
//   return useMutation((requestData: any) => {
//     return makeHttpRequest(fetchAuthor, {
//       requestData,
//     });
//   });
// };

export const usePotentialCustomers = () => {
  return useQuery([fetchCustomers.queryKeyName], () => {
    return makeHttpRequest(fetchCustomers);
  });
};

export const useAddPotentialCustomer = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(addCustomers, {
      requestData,
    });
  });
};
