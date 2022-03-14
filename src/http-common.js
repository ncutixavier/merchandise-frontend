import axios from "axios";
import cookie from "js-cookie";

const http = axios.create({
  baseURL: "https://nx-merchandise.herokuapp.com/api/v1",
  // baseURL:"http://localhost:4000/api/v1",
  headers: {
    Authorization: cookie.get("token"),
  },
});

const requestHandler = (request) => {
  request.headers.Authorization = cookie.get("token");
  return request;
};

const responseHandler = (response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return response;
};

const errorHandler = (error) => {
  if (error.response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

http.interceptors.request.use(
  (request) => requestHandler(request),
  (error) => errorHandler(error)
);

http.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

export default http;
