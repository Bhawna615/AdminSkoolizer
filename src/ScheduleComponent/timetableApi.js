import axios from "axios";

const API = "http://localhost/kkblossom/api.php/Adminapi/TimeTable";

/* ===============================
   GET CLASSES
================================ */
export const getClasses = () =>
  axios.get(`${API}/getClasses`);


/* ===============================
   GET TEACHERS  ✅ NEW
================================ */
export const getTeachers = () =>
  axios.get(`${API}/getTeachers`);


/* ===============================
   GET TIMETABLE
================================ */
export const getTimeTable = (data) =>
  axios.post(`${API}/getTimeTable`, data);


/* ===============================
   INSERT NEW PERIOD ✅ NEW
================================ */
export const insertPeriod = (data) =>
  axios.post(`${API}/insert`, data);


/* ===============================
   DELETE PERIOD
================================ */
export const deletePeriod = (id) =>
  axios.get(`${API}/delete/${id}`);