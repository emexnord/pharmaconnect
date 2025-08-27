import { AxiosInstance } from "@/app/utils/axiosInstance";
import axios from "axios";

export async function login(phone: string, password: string) {
  try {
    const response = await AxiosInstance.post("/pharmacy/login", {
      phone,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("Invalid phone number or password.");
      }
    }
    throw new Error("Something went wrong. Please try again later.");
  }
}
