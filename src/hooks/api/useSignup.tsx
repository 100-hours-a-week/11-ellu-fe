import { useMutation } from "@tanstack/react-query";
import { postSignup } from "@/api/user";

export const useSignup = () => {
  return useMutation({
    mutationFn: postSignup,
  });
};
