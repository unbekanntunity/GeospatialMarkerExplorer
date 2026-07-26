import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSectionSectionsPost,
  deleteSectionSectionsIdDelete,
  getMarkerMarkersIdGet,
  getSectionsSectionsGet,
  updateSectionSectionsIdPut
} from "../api/generated/sdk.gen";
import {
  CreateSectionRequest,
  UpdateSectionRequest
} from "../api/generated/types.gen";

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: CreateSectionRequest) => {
      const response = await createSectionSectionsPost({
        body: section
      });

      if (response.error) {
        throw {
          name: response.response?.status,
          detail: response.error.detail ?? response.error
        };
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sections"]
      });
    }
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      section
    }: {
      id: string;
      section: UpdateSectionRequest;
    }) => {
      const response = await updateSectionSectionsIdPut({
        body: section,
        path: { id }
      });

      if (response.error) {
        throw {
          name: response.response?.status,
          detail: response.error.detail ?? response.error
        };
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sections"]
      });
    }
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteSectionSectionsIdDelete({ path: { id } });

      if (response.error) {
        throw {
          name: response.response?.status,
          detail: response.error.detail ?? response.error
        };
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sections"]
      });
    }
  });
};

export const useSections = () => {
  return useQuery({
    queryKey: ["sections"],
    queryFn: async () => {
      const response = await getSectionsSectionsGet();

      if (response.error) {
        throw {
          name: response.response?.status,
          detail: response.error
        };
      }

      return response.data;
    }
  });
};

export const useSection = (id: string) => {
  return useQuery({
    queryKey: ["sections", id],
    queryFn: async () => {
      const response = await getMarkerMarkersIdGet({ path: { id } });

      if (response.error) {
        throw {
          name: response.response?.status,
          detail: response.error.detail ?? response.error
        };
      }

      return response.data;
    }
  });
};
