import { useMutation } from "@tanstack/react-query";

import {
  BodyUploadFileImagesPost,
  uploadFileImagesPost
} from "../api/generated";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (body: BodyUploadFileImagesPost) => {
      const response = await uploadFileImagesPost({ body });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }
  });
}
