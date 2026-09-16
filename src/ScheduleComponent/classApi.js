import axios from "axios";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/ScheduleClass";

export const getClasses = () => axios.get(API);

export const addClass = (data) =>
  axios.post(`${API}/insert`, data);

export const deleteClass = (id) =>
  axios.delete(`${API}/delete/${id}`);