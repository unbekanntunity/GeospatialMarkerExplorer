import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategoryCategoriesPost,
  deleteCategoryCategoriesIdDelete,
  getCategoriesCategoriesGet,
  updateCategoryCategoriesIdPut
} from "../api/generated/sdk.gen";
import {
  CreateCategoryRequest,
  GetCategoriesCategoriesGetData,
  UpdateCategoryRequest
} from "../api/generated/types.gen";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: CreateCategoryRequest) => {
      const response = await createCategoryCategoriesPost({
        body: category
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });
    }
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      category
    }: {
      id: string;
      category: UpdateCategoryRequest;
    }) => {
      const response = await updateCategoryCategoriesIdPut({
        body: category,
        path: { id }
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });

      queryClient.invalidateQueries({
        queryKey: ["markers"]
      });
    }
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCategoryCategoriesIdDelete({ path: { id } });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });

      queryClient.invalidateQueries({
        queryKey: ["markers"]
      });
    }
  });
};

type CategoryQuery = NonNullable<GetCategoriesCategoriesGetData["query"]>;

export const useCategories = (query: CategoryQuery) => {
  return useQuery({
    queryKey: ["categories", query.name],
    queryFn: async () => {
      const response = await getCategoriesCategoriesGet({ query });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  });
};
