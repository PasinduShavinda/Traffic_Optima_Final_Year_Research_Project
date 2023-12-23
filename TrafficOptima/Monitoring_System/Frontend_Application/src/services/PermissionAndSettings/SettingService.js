import axios from "axios";
const base_url = "http://127.0.0.1:5000";
export async function addNewSettings(data) {
  return await axios.post("http://127.0.0.1:5000/new-setting", data);
}
export async function runBackendSettings(data) {
  return await axios.post("http://127.0.0.1:5000/settings", data);
}
export async function getSettingByUserId(id) {
  return await axios.get("http://127.0.0.1:5000/settings/" + id);
}
