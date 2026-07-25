import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  BodyUploadFileImagesPost,
  getFilesImagesGet,
  uploadFileImagesPost
} from "../api/generated";

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: BodyUploadFileImagesPost) => {
      const response = await uploadFileImagesPost({ body });

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
        queryKey: ["images"]
      });
    }
  });
};

export const useImages = () => {
  return useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const response = await getFilesImagesGet();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  });
};
