import { AxiosError } from "axios";

export const handleError = (e: unknown) => {
  if (e instanceof AxiosError) {
    console.log(e.message);
  }
};
