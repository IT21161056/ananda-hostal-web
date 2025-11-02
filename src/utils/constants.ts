export const bloodGroups = [
  { value: "", label: "Select Blood Group" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export enum student_status {
  all = "",
  Active = "active",
  Inactive = "inactive",
}

export const dorms = [
  { value: "", label: "all" },
  { value: "mahasen", label: "6-Mahasen" },
  { value: "thissa", label: "7-Thissa" },
  { value: "parakum", label: "8-Parakum" },
  { value: "gajaba", label: "9-Gajaba" },
  { value: "gamunu", label: "10-Gamunu" },
  { value: "11-Wijaya", label: "11-Wijaya" },
];

export const API_URL =
  "https://ananda-hostal-api-4bd6e03768d8.herokuapp.com/api/v1";

export const SOCKET_URL =
  "https://ananda-hostal-api-4bd6e03768d8.herokuapp.com";

export const SOCKET_URL_LOCAL = "http://localhost:5001";
export const API_URL_LOCAL = "http://localhost:5001/api/v1";
