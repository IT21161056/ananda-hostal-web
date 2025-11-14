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
  { value: "6-Mahasen", label: "6-Mahasen" },
  { value: "7-Thissa", label: "7-Thissa" },
  { value: "8-Perakum", label: "8-Perakum" },
  { value: "9-Gajaba", label: "9-Gajaba" },
  { value: "10-Gemunu", label: "10-Gemunu" },
  { value: "11-Wijaya", label: "11-Wijaya" },
];

export const API_URL =
  "https://ananda-hostal-api-4bd6e03768d8.herokuapp.com/api/v1";

export const SOCKET_URL =
  "https://ananda-hostal-api-4bd6e03768d8.herokuapp.com";

export const SOCKET_URL_LOCAL = "http://localhost:5001";
export const API_URL_LOCAL = "http://localhost:5001/api/v1";
