import { fromEvent } from 'rxjs';
import { map, startWith, takeWhile } from 'rxjs/operators';
import lock from './lock.js';

const $ = window.jQuery;

const switchId$ = fromEvent(document.querySelectorAll(".analyseSwitch-item"), 'click')
	.pipe(
	    startWith({
			target: document.querySelector(".analyseSwitch-item.first")
		}),
		takeWhile(val => lock.state)
	);

switchId$.subscribe(e => {
	const $e = $(e.target);
	const switchId = $e.data("id");
	
	$e
		.addClass("active")
		.siblings()
		.removeClass("active");

	$(".analyseSwitch-bg")
		.css("left", $e.position().left)
		.css("width", $e.outerWidth());

	$(".analyseBoard-title").each(function(){
		const title = $(this).data("title");
		$(this).html(title[switchId])
	})
});

export default switchId$.pipe(map(e => $(e.target).data("id")));