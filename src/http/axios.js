import axios from 'axios'

// http request 拦截器 
axios.interceptors.request.use(
  config => {
    let token = localStorage.getItem('userToken');
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.accessToken = token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器 
// axios.interceptors.response.use(
//   response => {
//     Indicator.close()
//     return response;
//   },
//   error => {
//     Indicator.close()
//   });
export default axios
