import { useMutation, useQuery } from "react-query";

import { MemberAddRequest } from "../../schema/member.schema";
import member from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import { MemberUpdateRequest } from "../../schema/member.schema";
import { makeExcelRequest } from "../../utils/http/make-excel-download";
import { CategoryUploadRequest } from "../../schema/category.schema";

const {
  fetchMember,
  addMember,
  deleteMember,
  updateMember,
  findMemberById,
  downloadMemberDetails,
  handleMemberDataUpload,
} = member;

export const useFetchMember = () => {
  return useQuery([fetchMember.queryKeyName], () => {
    return makeHttpRequest(fetchMember);
  });
};

export const useAddMember = () => {
  return useMutation((requestData: MemberAddRequest) => {
    return makeHttpRequest(addMember, {
      requestData,
    });
  });
};

export const useDeleteMember = () => {
  return useMutation((memberID: number) => {
    return makeHttpRequest(deleteMember, {
      params: {
        id: memberID,
      },
    });
  });
};

export const useupdateMember = () => {
  return useMutation((requestData: MemberUpdateRequest) => {
    return makeHttpRequest(updateMember, {
      requestData,
    });
  });
};

export const useFindMemberById = (searchedMemberId: number) => {
  return useQuery(
    [findMemberById.queryKeyName],
    () => {
      return makeHttpRequest(findMemberById, {
        params: {
          id: searchedMemberId,
        },
      });
    },
    {
      enabled: searchedMemberId ? true : false,
    }
  );
};

export const useDownloadMemberDetails = () => {
  return useMutation(() => {
    return makeExcelRequest(downloadMemberDetails);
  });
};

export const useUploadMemberDetails = () => {
  return useMutation((requestData: CategoryUploadRequest) => {
    return makeExcelRequest(handleMemberDataUpload, {
      requestData,
    });
  });
};
