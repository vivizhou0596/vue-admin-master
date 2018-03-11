import axios from 'axios';

//let base = 'http://197e68v051.iask.in';//上线模式
let base = '';//开发环境

export const requestLogin = params => { 
	return axios.post(`${base}/login/index`, params).then(res => res.data); 
};
 // export const requestLogin = params =>{
 // 	return axios({
 // 		method: 'post',
 // 		url: `${base}/login/index`,
 // 		headers:{'Content-type': 'application/x-www-form-urlencoded'},
 // 		params
 // 	}).then(
	// 	res => res.data
	// );
 // }   
//export const requestLogin = params => { return axios.get(`${base}/login/index`, { params: params }); };

//export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

//export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

//export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

//export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

//export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const getMerchantListPage = params => { return axios.get(`${base}/merchant/listpage`, { params: params }); };

export const changeState = params => { return axios.get(`${base}/merchant/changeState`, { params: params }); };

export const addMerchant = params => { return axios.get(`${base}/merchant/add`, { params: params }); };

export const editMerchant = params => { return axios.get(`${base}/merchant/edit`, { params: params }); };

export const getClassify= params => { return axios.get(`${base}/classify/list`, { params: params }); };

export const addClassify = params => { return axios.get(`${base}/classify/add`, { params: params }); };

export const editClassify = params => { return axios.get(`${base}/classify/edit`, { params: params }); };

export const removeClassify = params => { return axios.get(`${base}/classify/del`, { params: params }); };

export const getShopListPage = params => { return axios.get(`${base}/shops/query`, { params: params }); };



export const getClassfyOpt= params => { return axios.get(`${base}/shops/classfyOpt`, { params: params }); };

export const getCodeUrl = params =>{return axios.post(`${base}/getCodeUrl`, params).then(res => res.data); };