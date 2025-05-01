import { useMutation } from "@tanstack/react-query";
import { postSignup } from "@/api/user";
import { AxiosError } from "axios";

export const useSignup = () => {
  return useMutation<void, AxiosError<{ message: string }>, string>({
    mutationFn: postSignup,
  });
};
