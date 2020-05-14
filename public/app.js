const form = document.getElementById('login');

form.onchange = (e) => {
	console.log(e);
	startTime(2);
};

function startTime(minutes) {
	const count = new Date().getTime() + 1000 * 60 * minutes;
	const interval = setInterval(() => {
		const now = new Date().getTime();
		var distance = count - now;
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		document.getElementById('timer').innerHTML = `${minutes}:${seconds}`;
		if (distance < 0) {
			clearInterval(interval);
			document.getElementById('timer').innerHTML = 'EXPIRED';
		}
	}, 1000);
}
