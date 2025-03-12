  //Axios Nedir?
//Axios, HTTP istekleri yapmak için kullanılan bir JavaScript kütüphanesidir.Genellikle API'lere veri almak (GET), veri göndermek (POST), güncellemek (PUT/PATCH) ve silmek (DELETE) işlemler için kullanlır

import axios from "axios"

export const axiosInstance = axios.create({
  baseURL :"http://localhost:5001/api",
  withCredentials:true
});