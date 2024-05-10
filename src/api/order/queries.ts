import { useMutation, useQuery } from "react-query";

import transaction from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import { makeExcelRequest } from "../../utils/http/make-excel-download";
import { CategoryUploadRequest } from "../../schema/category.schema";

const {
  fetchAllTransaction,
  fetchActiveTransaction,
  addTransaction,
  deleteTransaction,
  getBill,
  findTransactionById,
  mailDueTransaction,
  downloadTransactionDetails,
  handleTransactionDataUpload,
} = transaction;

export const useFetchAllTransaction = (
  pageNumber: number,
  pageSize: number,
  fromDate: string,
  toDate: string
) => {
  return useQuery(
    [fetchAllTransaction.queryKeyName, pageNumber, pageSize, fromDate, toDate],
    () => {
      return makeHttpRequest(fetchAllTransaction, {
        params: {
          page: pageNumber,
          pageSize,
          fromDate,
          toDate,
        },
      });
    }
  );
};

export const useFetchTransaction = () => {
  return useQuery([fetchActiveTransaction.queryKeyName], () => {
    return makeHttpRequest(fetchActiveTransaction);
  });
};

export const useAddTransaction = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(addTransaction, {
      requestData,
    });
  });
};

export const useDeleteTransaction = () => {
  return useMutation((transactionID: number) => {
    return makeHttpRequest(deleteTransaction, {
      params: {
        id: transactionID,
      },
    });
  });
};

export const useGetBill = () => {
  return useMutation((orderID: any) => {
    return makeHttpRequest(getBill, {
      params: {
        id: orderID,
      },
    });
  });
};

export const useFindTransactionById = (searchedTransactionId: number) => {
  return useQuery(
    [findTransactionById.queryKeyName],
    () => {
      return makeHttpRequest(findTransactionById, {
        params: {
          id: searchedTransactionId,
        },
      });
    },
    {
      enabled: searchedTransactionId ? true : false,
    }
  );
};

export const useDownloadTransactionDetails = () => {
  return useMutation([downloadTransactionDetails.queryKeyName], () => {
    return makeExcelRequest(downloadTransactionDetails);
  });
};

export const useUploadTransactionDetails = () => {
  return useMutation((requestData: CategoryUploadRequest) => {
    return makeExcelRequest(handleTransactionDataUpload, {
      requestData,
    });
  });
};

export const useMailDueTransaction = () => {
  return useMutation(() => {
    return makeHttpRequest(mailDueTransaction);
  });
};
