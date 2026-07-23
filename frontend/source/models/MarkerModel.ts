import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMarkerMarkersPost,
  deleteMarkerMarkersIdDelete,
  getMarkerMarkersIdGet,
  getMarkersMarkersGet,
  updateMarkerMarkersIdPut
} from "../api/generated/sdk.gen";
import {
  CreateMarkerRequest,
  GetMarkersMarkersGetData,
  UpdateMarkerRequest
} from "../api/generated/types.gen";

export function useCreateMarker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (marker: CreateMarkerRequest) => {
      const response = await createMarkerMarkersPost({
        body: marker
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markers"]
      });
    }
  });
}

export function useUpdateMarker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      marker
    }: {
      id: string;
      marker: UpdateMarkerRequest;
    }) => {
      const response = await updateMarkerMarkersIdPut({
        body: marker,
        path: { id }
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markers"]
      });
    }
  });
}

export function useDeleteMarker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteMarkerMarkersIdDelete({ path: { id } });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["markers"]
      });
    }
  });
}

type MarkerQuery = NonNullable<GetMarkersMarkersGetData["query"]>;

export function useMarkers(query: MarkerQuery) {
  return useQuery({
    queryKey: ["markers", query.name],
    queryFn: async () => {
      const response = await getMarkersMarkersGet({ query });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  });
}

export function useMarker(id: string) {
  return useQuery({
    queryKey: ["marker", id],
    queryFn: async () => {
      const response = await getMarkerMarkersIdGet({ path: { id } });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  });
}
