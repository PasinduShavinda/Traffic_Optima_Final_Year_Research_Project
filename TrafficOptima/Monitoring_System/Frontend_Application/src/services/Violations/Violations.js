// import http from "../httpService";
import axios from "axios";

export async function loadViolationRecords() {
  console.log("___________________________________");
  return await axios.get("/recorded-violations");
}
