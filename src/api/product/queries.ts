import { useMutation, useQuery } from "react-query";

import author from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import {
  AuthorUpdateRequest,
  AuthorUploadRequest,
} from "../../schema/author.schema";
import { makeExcelRequest } from "../../utils/http/make-excel-download";

const {
  fetchAuthor,
  addProduct,
  deleteAuthor,
  updateAuthor,
  findAuthorById,
  downloadAuthorDetails,
  handleAuthorDataUpload,
} = author;

export const useFetchAuthor = () => {
  return useQuery([fetchAuthor.queryKeyName], () => {
    return makeHttpRequest(fetchAuthor);
  });
};

export const useAddProduct = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(addProduct, {
      requestData,
    });
  });
};

export const useDeleteAuthor = () => {
  return useMutation((authorID: number) => {
    return makeHttpRequest(deleteAuthor, {
      params: {
        id: authorID,
      },
    });
  });
};

export const useupdateAuthor = () => {
  return useMutation((requestData: AuthorUpdateRequest) => {
    return makeHttpRequest(updateAuthor, {
      requestData,
    });
  });
};

export const useFindAuthorById = (searchedAuthorId: any) => {
  return useQuery(
    [findAuthorById.queryKeyName],
    () => {
      return makeHttpRequest(findAuthorById, {
        params: {
          id: searchedAuthorId,
        },
      });
    },
    {
      enabled: searchedAuthorId ? true : false,
    }
  );
};

export const useDownloadAuthorDetails = () => {
  return useMutation(() => {
    return makeExcelRequest(downloadAuthorDetails);
  });
};

export const useUploadAuthorDetails = () => {
  return useMutation((requestData: AuthorUploadRequest) => {
    return makeExcelRequest(handleAuthorDataUpload, {
      requestData,
    });
  });
};
