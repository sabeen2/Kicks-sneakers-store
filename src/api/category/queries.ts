import { useMutation, useQuery } from "react-query";

import {
  CategoryAddRequest,
  CategoryUploadRequest,
  CategoryUpdateRequest,
} from "../../schema/category.schema";
import category from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import { makeExcelRequest } from "../../utils/http/make-excel-download";

const {
  fetchCategory,
  addCategory,
  deleteCategory,
  updateCategory,
  findCategoryById,
  downloadCategoryDetails,
  handleCategoryDataUpload,
} = category;

export const useFetchCategory = () => {
  return useQuery([fetchCategory.queryKeyName], () => {
    return makeHttpRequest(fetchCategory);
  });
};

export const useAddCategory = () => {
  return useMutation((requestData: CategoryAddRequest) => {
    return makeHttpRequest(addCategory, {
      requestData,
    });
  });
};

export const useDeleteCategory = () => {
  return useMutation((categoryID: number) => {
    return makeHttpRequest(deleteCategory, {
      params: {
        id: categoryID,
      },
    });
  });
};

export const useupdateCategory = () => {
  return useMutation((requestData: CategoryUpdateRequest) => {
    return makeHttpRequest(updateCategory, {
      requestData,
    });
  });
};

export const useFindCategoryById = (searchedCategoryId: number) => {
  return useQuery(
    [findCategoryById.queryKeyName],
    () => {
      return makeHttpRequest(findCategoryById, {
        params: {
          id: searchedCategoryId,
        },
      });
    },
    {
      enabled: searchedCategoryId ? true : false,
    }
  );
};

export const useDownloadCategoryDetails = () => {
  return useMutation(() => {
    return makeExcelRequest(downloadCategoryDetails);
  });
};

export const useUploadCategoryDetails = () => {
  return useMutation((requestData: CategoryUploadRequest) => {
    return makeExcelRequest(handleCategoryDataUpload, {
      requestData,
    });
  });
};
