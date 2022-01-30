import axios from "axios"

export async function login(){
    const res = await axios.post("auth/login", {
        username: "alissa@craft.io",
        password: "tg7Panvt&"
    }, {
        baseURL: process.env.REACT_APP_API_URL,
    })

    const {token, userInfo}  = res.data.data;
    return {token, userInfo};

    console.log(res);
}