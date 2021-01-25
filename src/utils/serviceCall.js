import axios from "axios";

const postRequest = (path, data) => {
  const absolutePath = process.env.REACT_APP_BACKEND_URL + path;
  return axios.post(absolutePath, data);
};

const getRequest = (path) => {
  const absolutePath = process.env.REACT_APP_BACKEND_URL + path;
  return axios.get(absolutePath);
};

export { postRequest, getRequest };
