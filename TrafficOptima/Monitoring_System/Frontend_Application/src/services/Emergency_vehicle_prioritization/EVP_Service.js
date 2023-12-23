import Cookies from "js-cookie";
import http from "../httpService";

export async function send_file_path(path) {

  return await http.post(
    "/emergency/evp_select_intersection",
    {
      intersection: path,
    },
    {
      headers: {
        Accept: "application/json",
        Authorization: Cookies.get("token"),
      },
    }
  ); 
}