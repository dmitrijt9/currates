import Vue from 'nativescript-vue';
const httpModule = require("tns-core-modules/http");

Vue.prototype.$http = httpModule;

export default httpModule
