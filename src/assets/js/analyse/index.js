import $ from 'jquery';
import { combineLatestWith } from 'rxjs';
import _mapValues from 'lodash/mapValues';
import _cloneDeep from 'lodash/cloneDeep';
import _get from 'lodash/get';
import { DateTime } from 'luxon';


import chart from './chart.js';
import fullscreen from './fullscreen.js';
import modal from './modal.js';
import totalValues from './totalValues.js';


import data$ from './data.js';
import date$ from './date.js';
import switchId$ from './switch.js';
import tabs$ from './tabs.js';

window.$ = window.jQuery;


let cacheData;
let checkArray;


setTimeout(function(){
	$(".analyseBoards-loading-btn").show();
},2000)

$(document).on("click",".analyseBoards-loading-btn", function(e){
	window.location.reload()
});


data$
	.pipe(
	    combineLatestWith(
			switchId$, 
			date$, 
			...tabs$,
		)
	)
	.subscribe(([data, switchId, date, tabs1, tabs2]) => {
		console.group("update")
		// return on fetch error (data$)
		if(data[0].error) return;

		console.time('cachedata')

		// create the object
		const obj = {data: data[0], switchId, date, tabs1, tabs2};

		// get array of values
		let array = Object.values(obj);
		// remove first item
		array.shift();

		let charts = chart;

		if(Array.isArray(checkArray)){
			// compare values with chached version
			if(JSON.stringify(array) === JSON.stringify(checkArray)){
				//no change
				console.timeEnd('cachedata');
				console.groupEnd("update");
		  		return;
	  		}else{
	  			charts = (checkArray[2] != array[2])? [chart[1]]: (checkArray[3] != array[3])? [chart[2]]: chart;
	  		}

		}else{
			$(".analyseBoards").removeClass("loading");
			totalValues(obj.data);
		}

		// detect mode
		const mode = (switchId == 3)? "weekly": "daily";

		// filter data only on range change 
		obj.data = (
			Array.isArray(checkArray) 
			&& 
			(
				JSON.stringify(array[1]) == JSON.stringify(checkArray[1]) 
				&
				( 
					array[0] != 3 
					&&
					checkArray[0] != 3 
				)
			)
		)? 
			cacheData: 
			filterData(obj.data, obj.date, mode);

		const updated = (obj.data !== cacheData)
		
		charts.forEach((s,i) => s.next(Object.assign({}, obj, {mode, updated}, obj.data)));
		
		// fill cache  vars
		cacheData = obj.data;
		checkArray = array;

		console.timeEnd('cachedata')
		console.groupEnd("update")
	});




const barThreshold = {
	"daily": (window.matchMedia("(max-width: 992px)").matches)? 30: 90,
	"weekly": (window.matchMedia("(max-width: 992px)").matches)? 100: 400
};


function filterData(dataOrg, date, mode){
	console.time('filterData')

	dataOrg = _cloneDeep(dataOrg);
	let out = {};
	out.keys = _get(dataOrg,["keys", mode], []);
	out.data = _get(dataOrg,["data", mode], []).filter(o => (date[0] <= o[0] && date[1] >= o[0]));

	if(mode == "weekly"){
		out.data = out.data.map(e => {e[0] = DateTime.fromISO(e[0]).startOf('week').toISODate(); return e});
	};	

	out.reallabels = out.data.map(o => o[0]);
	out.range = out.reallabels.length;
	out.barthreshold = (out.range <= barThreshold[mode]);
	out.categories = out.reallabels.map(e => {
		let d = DateTime.fromISO(e);
		d = (mode == "daily")? d.toLocaleString((out.range <= 28 )? { day: "2-digit", month: 'short' }: { month: 'short', year: '2-digit' }): d.toFormat((documentLang == "de")? "'KW' W": "'CW' W"); 
		return  `__${d}__`;
	});
	out.tooltipDate = out.reallabels.map(o => (mode == "weekly")? DateTime.fromISO(o).toFormat((documentLang == "de")? "'KW' W": "'CW' W") + " - " + DateTime.fromISO(o).toLocaleString(DateTime.DATE_HUGE): DateTime.fromISO(o).toLocaleString(DateTime.DATE_HUGE));

	console.timeEnd('filterData');
	return out;
}


