import { Couchbase } from 'nativescript-couchbase-plugin';
import Vue from "nativescript-vue";

const database = new Couchbase('currates-db');
Vue.prototype.$database = database;

export default database
