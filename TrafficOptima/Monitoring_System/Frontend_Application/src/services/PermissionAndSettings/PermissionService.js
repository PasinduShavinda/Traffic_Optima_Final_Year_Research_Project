import axios from "axios";
const base_url = "http://127.0.0.1:5000";
export async function addNewUsers(data) {
  return await axios.post("http://127.0.0.1:5000/new-user", data);
}
export async function getAllUsers(id) {
  return await axios.get("http://127.0.0.1:5000/organization/" + id);
}
export async function updatePermission(id, data) {
  return await axios.put(
    "http://127.0.0.1:5000/update-permissions/" + id,
    data
  );
}
export async function removeUser(id) {
  console.log("idsss", id);
  return await axios.delete("http://127.0.0.1:5000/" + id);
}
export async function getUserById(id) {
  return await axios.get("http://127.0.0.1:5000/user/" + id);
}
