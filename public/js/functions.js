function shuffle(array) {
	let counter = array.length;
	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);
		counter--;
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function getstorage(x) {
	return JSON.parse(window.localStorage.getItem(x));
}
function setstorage(x, v) {
	if (!v) {
		window.localStorage.removeItem(x);
	} else {
		window.localStorage.setItem(x, JSON.stringify(v));
	}
}

function sounddes() {
	return issound ? "☐" : "♫";
}

function clamp(v, v1, v2) {
	if (v < v1) return v1;
	if (v > v2) return v2;
	return v;
}

function elapsed(d1, d2) {
	function pad(n, d) {
		n = n + '';
		return n.length >= d ? n : new Array(d - n.length + 1).join('0') + n;
	}
	var td;
	if (d2) {
		td = d2 - d1;
		td = td / 1000;
	} else {
		td = d1;
	}
	if (!td) return "";
	var s = Math.round(td % 60);
	td = Math.floor(td / 60);
	var m = Math.round(td % 60);
	td = Math.floor(td / 60);
	var h = td
	var tm = "";
	if (h) tm = h + "h ";
	if (m || h) tm = tm + pad(m, 2) + '\' '
	tm = tm + pad(s, 2) + '"';
	return tm;
}

function ligthen(c, v) {
	var r = {};
	r.r = min(255, max(0, c.r + v * 255))
	r.g = min(255, max(0, c.g + v * 255))
	r.b = min(255, max(0, c.b + v * 255))
	return r;
}


function post(url, data) {
	return new Promise((resolve, reject) => {
		if (!data) data = {};
		fetch(url, {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			redirect: "follow",
			referrer: "no-referrer",
			body: JSON.stringify(data),
		})
			.then(response => {
				return response.json()
			})
			.then(d => {
				if (d) {
					if (d.err)
						reject(d.err);
					else
						resolve(d.data);
				} else {
					reject('not a valid response')
				}
			})
			.catch(e => {
				reject(e.message)
			})
	});
}

