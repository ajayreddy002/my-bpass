import axios from 'axios';
const BASE_URL = 'http://hyno-external-rails-new-1912107687.ap-southeast-1.elb.amazonaws.com/api/';
export const _HttpServices = {
    postData,
    getData,
    putData,
    deleteData
}



const tokenSetup = () => {
    axios.defaults.headers['Authorization'] = 'Bearer bvz9UEimakcpcd-cNsNUGcnH3srDwJXfzJoRfg9Wpds'
    const loggedInUserData = JSON.parse(localStorage.getItem('userData') );
//     if (loggedInUserData) {
//         if(loggedInUserData.Token){
//             axios.defaults.headers['Authorization'] = loggedInUserData.token;
//     }
// }
}


function postData(url, payLoad) {
    tokenSetup()
    return axios.post(`${BASE_URL}${url}`, payLoad);
}

function getData(url) {
    tokenSetup()
    return axios.get(`${BASE_URL}${url}`);
}

function putData(url, payLoad) {
    tokenSetup()
    return axios.put(`${BASE_URL}${url}`, payLoad);
}

function deleteData(url) {
    tokenSetup()
    return axios.delete(`${BASE_URL}${url}`);
}
