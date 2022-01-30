import { AxiosRequestConfig } from "axios";

type AuthDataDB = {
    token: string,
    userId: string,
    sessionId: string
}

let authData: AuthDataDB;
let axiosConfig: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_API_URL
}

export function setAuthDataDB(data: AuthDataDB){
    authData = data;
    axiosConfig = {
        ...axiosConfig,
        headers: {
            "X-CSRF-TOKEN": authData.token,
            "X-CLIENT-ID": authData.sessionId
        }
    };
}

export function getDefaultAxiosConfig(): Readonly<AxiosRequestConfig> {
    return axiosConfig;
}

