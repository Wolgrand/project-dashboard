import axios, { AxiosError } from 'axios'
import { sign } from 'jsonwebtoken';
import { rejects } from 'node:assert';
import { resolve } from 'node:path';
import {parseCookies, setCookie} from 'nookies'
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false;
let failedRequestsQueue = [];

export function setupApiClient(ctx = undefined){
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: '/api',
    headers: {
      Authorization: `Bearer ${cookies['project-dash.token']}`
    }
  });
  
  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if(error.response.status === 401) {
      if(error.response?.data.code === 'token.expired'){
        cookies = parseCookies(ctx);
  
        const { 'project-dash.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config
        
        if(!isRefreshing){
          isRefreshing = true
  
          api.post('refresh', {
            refreshToken,
          }).then(response => {
            const { token } = response.data

              
            setCookie(ctx, 'project-dash.token', token, {
              maxAge: 60 * 60 * 24 * 30, //30 days
              path:'/'
            })
            setCookie(ctx, 'project-dash.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, //30 days
              path:'/'
            })
  
            api.defaults.headers['Authorization'] = `Bearer ${token}`
  
            failedRequestsQueue.forEach(request => request.onSucess(token))
            failedRequestsQueue = [];
          }).catch(err => {
            failedRequestsQueue.forEach(request => request.onFailure(err))
            failedRequestsQueue = [];
  
            if (process.browser) {
              signOut()
            }
          }).finally(()=> {
            isRefreshing = false
          })
        }
  
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSucess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`
  
              resolve(api(originalConfig))
            } ,
            onFailure: (err: AxiosError) => {
              reject(err)
            }
          })
        });
      } else {
        if (process.browser) {
          signOut()
        }else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }
    return Promise.reject(error);
  });

  return api;
}