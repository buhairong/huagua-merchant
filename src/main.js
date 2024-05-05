import Vue from "vue";
import App from "./App";
import { url, getRequest, getFileUpload, getFileUpload1, requestPayment, goHtml, getUserProfile } from "./utils/util.js";

import Router from './router';
import uView from "uview-ui";
// import store from '../store';

Vue.prototype.$url = url;
Vue.prototype.$goHtml = goHtml;
Vue.prototype.$getUserProfile = getUserProfile;
Vue.prototype.$getRequest = getRequest;
Vue.prototype.$getFileUpload = getFileUpload;
Vue.prototype.$getFileUpload1 = getFileUpload1;
Vue.prototype.$requestPayment = requestPayment;
// Vue.prototype.$store = store

Vue.prototype.$router = new Router();
Vue.filter("$transformTimeStr", (time) => {
    return `${time}`.length === 1
        ? `0${time}`
        : `${time}`;
});
Vue.filter("$numToSeparator", (num, unit="元/月", symbol) => {
    if (num != undefined) {
        let numStr = num.toFixed();
        numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + unit;
        return symbol ? (symbol + numStr) : numStr;
    }
});
Vue.filter("$transformNum", (num) => {
    if (num != undefined) {
        // const numStr = (num / 10000).toFixed(2);
        let tnumStr = (num / 10000).toFixed(3);
        const numStr = tnumStr.substring(0, tnumStr.length - 1)
        return `${numStr}万`;
    } else {
      return '-'
    }
});
Vue.filter("$getTypeDataName", (val, field, map) => {
    const list = map[field] || []
    return (list.find(item => item.id === val) || { name: "" }).name
});
Vue.filter("$numFormat", (num) => {
    if (num != undefined) {
        const numStr = num.toFixed();
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return '-'
    }
});
Vue.filter("$numFormat1", (num) => {
    if (num != undefined) {
			const arr = (num+'').split('.')
			let numStr = arr[0]
			const floatNum = arr[1]
			numStr = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			if (floatNum) {
				numStr = numStr + '.' +floatNum
			}
			
			return numStr
    } else {
      return '-'
    }
});

Vue.use(uView);
App.mpType = "app";

Vue.config.productionTip = false;
const app = new Vue({
    ...App,
	// store
});
app.$mount();
