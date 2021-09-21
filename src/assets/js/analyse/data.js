import { of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { share, switchMap, catchError, tap } from 'rxjs/operators';
import chartConfig from './chart/config.js';
import _get from 'lodash/get';

let url;

if(window.location.hostname == "localhost"){
	url = "http://localhost:8000/data.json";
}else{
	url = "https://obs.eu-de.otc.t-systems.com/obs-public-dashboard/json/v1/nested_cwa_public_dashboard_data.json";
}



const data$ = fromFetch(url).pipe(
	switchMap(response => {
		if (response.ok){
			// OK return data
			return response.json()
		}else{
			// Server is returning a status requiring the client to try something else.
			return of({ error: true, message: `Error ${response.status}` });
		}
	}),
	catchError(err => {
			// Network or other error, handle appropriately
			console.error(err);
			return of({ error: true, message: err.message })
		}
	),
	tap(e => {getAry(e[0])}),
	share()
);



function getAry(data){

	let keyAryDaily = [];
	let keyAryWeekly = [];

	Object.keys(chartConfig).map( a => {
		Object.keys(chartConfig[a]).map( b => {
			if(_get(chartConfig, [a, b, "series"])){
				_get(chartConfig, [a, b, "series"]).map( o=> {
					if(b == 3){
						keyAryWeekly.push(_get(o,["data"]))
					}else{
						keyAryDaily.push(_get(o,["data"]))
					}
				})
			}else{
				_get(chartConfig, [a, b]).map( o => {
					o["series"].map( i => {
						if(b == 3){
							keyAryWeekly.push(_get(i,["data"]))
						}else{
							keyAryDaily.push(_get(i,["data"]))
						}
					})
				})
			}
		})
	})

	let missDaily = [];

	keyAryDaily.map(w => {
		if((data.keys.daily.indexOf(w) == -1 )){
			missDaily.push(w)
		}
		return w;
	})

	let missWeekly = [];

	keyAryWeekly.map(w => {
		if((data.keys.weekly.indexOf(w) == -1 )){
			missWeekly.push(w)
		}
		return w;
	})

	// unique array
	missDaily = missDaily.filter((v, i, a) => a.indexOf(v) === i);
	missWeekly = missWeekly.filter((v, i, a) => a.indexOf(v) === i);

	if( missDaily.length > 0){
		console.error("Missing data keys daily: ", missDaily.join(", "));
	}

	if( missWeekly.length > 0){
		console.error("Missing data keys weekly: ", missWeekly.join(", "));
	}

}

export default data$;