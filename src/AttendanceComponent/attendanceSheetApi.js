import axios from "axios";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AttendanceSheet";

export const getClasses = () =>
  axios.get(`${API}/getClasses`);

export const getAttendanceByMonth = (data) =>
  axios.post(`${API}/getByMonth`, data);