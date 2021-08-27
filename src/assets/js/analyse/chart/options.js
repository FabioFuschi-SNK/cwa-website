const documentLang = document.documentElement.lang;
const lang = (documentLang == "de")? 'de-DE': 'en-US';


export default {
	stroke: {
		width: 2
	},
	colors: ["#bd3a63", "#d4eaf7", "#e8d0cd"],
	series: [],
	chart: {
		id:"chart",
		height: 215,
		width: "100%",
		type: 'line',
		toolbar: {
			autoSelected: 'pan',
			show: false,
			zoom: false
		},
		zoom: {
        	enabled: false
      	}
	},
	grid: {
		// show: true,
	    borderColor: '#CFD4D9',
	 //    strokeDashArray: 0,
	 //    position: 'back',
	    xaxis: {
	        lines: {
	            show: false
	        }
	    },   
	    yaxis: {
	        lines: {
	            show: true
	        }
	    },  
	 //    row: {
	 //        colors: undefined,
	 //        opacity: 0.5
	 //    },  
	 //    column: {
	 //        colors: undefined,
	 //        opacity: 0.5
	 //    },
	},
	yaxis: {
		show: true,
		forceNiceScale: true,
		labels: {
			minWidth: 50,
			formatter: value => {
				return new Intl.NumberFormat(lang).format(value)
			},
			style:{
				colors: ["#898B8B"],
				fontFamily: 'Roboto, serif',
				fontSize: '11px',
			}
		},
		axisTicks: {
			show: false
		}
	 },
	xaxis: {
	    type: "datetime",
		axisBorder: {
          show: true,
          color: 'currentColor',
      	},
		labels: {
			style:{
				colors: ["#898B8B"],
				fontFamily: 'Roboto, serif',
				fontSize: '11px',
			},
			datetimeFormatter: {
				year: 'yyyy',
				month: "MMM",
				day: 'dd MMM',
				hour: 'HH:mm',
			},
			formatter: undefined
		},
		axisTicks: {
			show: false
		}
	},
	legend: {
		show: true,
		showForSingleSeries: true,
		horizontalAlign: 'right', 
		fontSize: '11px',
		fontFamily: 'Roboto, sans-serif',
		fontWeight: 400,
		offsetX: -100,
		markers: {
			width: 8,
			height: 8,
			radius: 0,
      	},
		itemMargin: {
			horizontal: 12
		},


	},
	noData: {
		text: 'No Data to display'
	},
	plotOptions: {
      	bar: {

      	}
  	}
};