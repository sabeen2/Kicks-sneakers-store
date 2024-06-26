import { useMutation, useQuery } from "react-query";

import author from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import { AuthorUpdateRequest } from "../../schema/author.schema";
import { makeExcelRequest } from "../../utils/http/make-excel-download";

const {
  fetchAuthor,
  addProduct,
  fetchProuctsWithPagination,
  updateAuthor,
  findAuthorById,
  downloadAuthorDetails,
  getImage,
  getImageBase,
  dispatchProduct,
  fetchOutOfStock,
} = author;

// export const useFetchAuthor = () => {
//   return useMutation((requestData: any) => {
//     return makeHttpRequest(fetchAuthor, {
//       requestData,
//     });
//   });
// };

export const useFetchAuthor = (requestData: any) => {
  return useQuery(
    [fetchAuthor.queryKeyName, requestData],
    () =>
      makeHttpRequest(fetchAuthor, {
        requestData,
      }),
    {
      staleTime: 0,
      enabled: !!(requestData.page && requestData.row),
    }
  );
};

export const useGetAllProducts = () => {
  return useQuery([fetchProuctsWithPagination.queryKeyName], () => {
    return makeHttpRequest(fetchProuctsWithPagination);
  });
};

export const useOutOfStockProducts = () => {
  return useQuery([fetchOutOfStock.queryKeyName], () => {
    return makeHttpRequest(fetchOutOfStock);
  });
};

export const useAddProduct = () => {
  return useMutation((requestData: any) => {
    return makeHttpRequest(addProduct, {
      requestData,
    });
  });
};

export const useDeleteProducts = () => {
  return useMutation((productId: number) => {
    return makeHttpRequest(dispatchProduct, {
      params: {
        id: productId,
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

export const useFetchImage = (myprodId: any) => {
  return useQuery([getImage.queryKeyName, myprodId], () => {
    return makeExcelRequest(getImage, {
      params: {
        id: myprodId,
      },
    });
  });
};

export const useFetchImageBase = (prodId: any) => {
  return useQuery([getImageBase.queryKeyName, prodId], () => {
    return makeExcelRequest(getImageBase, {
      params: {
        id: prodId,
      },
    });
  });
};
