import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCategoryCategoriesPost,
  deleteCategoryCategoriesIdDelete,
  getMarkersMarkersGet,
  updateCategoryCategoriesIdPut
} from "../api/generated/sdk.gen";
import {
  CreateCategoryRequest,
  GetCategoryCategoriesGetData,
  UpdateCategoryRequest
} from "../api/generated/types.gen";

export function useCreateCategory() {
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
}

export function useUpdateCategory() {
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
}

export function useDeleteCategory() {
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
}

type CategoryQuery = NonNullable<GetCategoryCategoriesGetData["query"]>;

export function useMarkers(query: CategoryQuery) {
  return useQuery({
    queryKey: ["categories", query.name],
    queryFn: async () => {
      const response = await getMarkersMarkersGet({ query });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  });
}
