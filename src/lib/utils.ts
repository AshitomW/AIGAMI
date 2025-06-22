import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleError(error: unknown) {
  if (error instanceof Error) {
    return { errorMessage: error.message };
  } else {
    console.log(error);
    return { errorMessage: "An Unknown Error Occured" };
  }
}
