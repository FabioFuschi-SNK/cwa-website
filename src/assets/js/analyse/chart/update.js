import ApexCharts from 'apexcharts'
import _get from 'lodash/get';
import _set from 'lodash/set';

import lock from '../lock.js';
import translate from '../translate.js';

import { checkLegendReset, renderLegend } from './legend.js';
import chartConfig from './config.js';

export default function({
		barthreshold, 
		categories,
		data, 
		date, 
		keys, 
		mode, 
		range, 
		reallabels, 
		switchId, 
		tabs1, 
		tabs2, 
		tooltipDate,
		updated
	},
	i
 )
{
	const id = `chart${i}`;
	lock.set(id);
	
	let chartConfigObj = _get(chartConfig, [id, switchId], []);
	if(Array.isArray(chartConfigObj)){
		chartConfigObj = _get(chartConfigObj, [(id == "chart1")? tabs1: (id == "chart2")? tabs2: []], []);
	}

	const chartType = _get(chartConfigObj, ["type"], "line");
	const type = (chartType == "bar")? (barthreshold)? chartType: "line": chartType;

	
	let opt = {
		chart: {
			id,
			type,
			stacked: _get(chartConfigObj, ["stacked"], false)
		},
		seriesall: _get(chartConfigObj, ["series"], []).map(obj => {
			return {
				ghost: obj.ghost,
				color: (obj.color)? obj.color: undefined,
				type: (obj.type)? (barthreshold)? obj.type: "line": type,
				name: (obj.name)? translate(obj.name): translate(obj.data),
				data: data.map(m => m[keys.indexOf(obj.data)]),
				key: obj.data
			}
		})
	};

	// add only if needed
	if(updated){
		opt = Object.assign(opt, {mode, reallabels, tooltipDate, xaxis: {categories}})
	}

	// set series without the ghots
	_set(opt, ["series"], opt.seriesall.filter(e => !e.ghost));

	// set dasharray for legend and switch 4
	_set(opt, ["stroke", "dashArray"], (switchId == 4)? opt.seriesall.filter(e => !e.ghost).map(obj => (!!~obj.key.indexOf("_daily"))? 5: 0): new Array(opt.series.length).fill(0));

	//Only reset series if necessary
	checkLegendReset(opt, () => {
		ApexCharts.exec(id, "resetSeries", true, false);
	});

	// update chart options
	ApexCharts.exec(id, "updateOptions", opt, true, false, false);

	// render custom legend
	renderLegend(opt);

	console.log("chart update", id, opt);
};