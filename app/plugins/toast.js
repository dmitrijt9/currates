import Vue from 'nativescript-vue';
const Toast = require("nativescript-toast");
Toast.duration = 5000
Vue.prototype.$toast = Toast;

export default Toast
