/**
* These functions handle conversions of dates and days and other assorted necessities.
*/


/**
* Wherever occurs the name "day", it is an array of [month, day, year] each indexed with 1.
* Year in such context refers always to the liturgical year.
*/

function dayToDate(day) { // Convert days to dates
	return new Date(day[2], day[0] - 1, day[1], 0, 0, 0, 0);
}

function dateToDay(date) { // Converts dates to days
	return [date.getMonth() + 1, date.getDate(), date.getFullYear()];
}

function moveDayForwardDays(day, number) { // moves the DAY forward the specified number of days
	let n = dayToDate(day);
	n.setDate(n.getDate() + number);
	return dateToDay(n);
}

function moveDateForwardDays(date, number) { // moves the DATE forward the specified number of days
	let n = new Date(date);
	n.setDate(date.getDate() + number);
	return n;
}

function getDateAtStartOfWeek(date) {
	let n = new Date(date);
	while (n.getDay() != 0) n = moveDateForwardDays(n, -1);
	return n;
}

function dateToNextSunday(date) {
	let n = new Date(date);
	while (n.getDay() != 0) n = moveDateForwardDays(n, 1);
	return n;
}

/**
* These functions are more related to the liturgical year.
* All these functions accept days or years and always return days
*/

/**
* THE MOVEABLE FEASTS
		HOLY FAMILY (FIRST SUNDAY AFTER CHRISTMAS)
		EPIPHANY (SECOND SUNDAY AFTER CHRISTMAS)
		BAPTISM (THIRD SUNDAY AFTER CHRISTMAS)
		{ Ordinary Time Begins }
		ASH WEDNESDAY { Lent Begins }
		EASTER { Pashcaltude begins }
		ASCENSION (SEVENTH SUNDAY OF EASTER)
		PENTECOST
		TRINITY SUNDAY (FIRST SUNDAY AFTER PENTECOST)
		MARY MOTHER OF THE CHURCH (MODAY AFTER TRINITY)
		CORPUS CHRISTI (SECOND SUNDAY AFTER PENTECOST)
		SACRED HEART (THIRD FRIDAY AFTER PENTECOST)
		IMMACULATE HEART (SUNDAY AFTER SACRED HEART)
		CHRIST THE KING (LAST SUNDAY BEFORE ADVENT)
*/

function getAdventSunday(year) { // gets DAY of advent sunday
	let n = dayToDate(getChristmas(year));
	if (n.getDay() == 0) n = moveDateForwardDays(n, -7);
	n = getDateAtStartOfWeek(n);
	return dateToDay(moveDateForwardDays(n, -7 * 3));
}

function getChristmas(year) {
	return [12, 25, year - 1]; // The year is substracted since Christmas falls after Advent Sunday, thus the next liturgical year has begun. Thus the date of Christmas in liturgical year 2021 is actually 25 December 2020.
}

function getHolyFamily(year) {
	let n = dayToDate(getChristmas(year));
	if (n.getDay()==0) return dateToDay(moveDateForwardDays(n, 7)); // but will be preceded by the Solemnity of Mary
	while (n.getDay() != 0) n = moveDateForwardDays(n, 1);
	return dateToDay(n);
}

function getEpiphany(year) {
	return moveDayForwardDays(getHolyFamily(year), 7);
}

function getBaptism(year) {
	return moveDayForwardDays(getEpiphany(year), 7);
}

function getAshWednesday(year) {
		return moveDayForwardDays(getEaster(year), -46);
}

function getEaster(year) {
	var f = Math.floor,
	G = year % 19,
	C = f(year / 100),
	H = (C - f(C / 4) - f((8 * C + 13)/25) + 19 * G + 15) % 30,
	I = H - f(H/28) * (1 - f(29/(H + 1)) * f((21-G)/11)),
	J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
	L = I - J,
	month = 3 + f((L + 40)/44),
	day = L + 28 - 31 * f(month / 4);
	return [month, day, year];
} // Kyrie, eleison.

function getAscension(year) {
	return moveDayForwardDays(getPentecost(year), -7);
}

function getPentecost(year) {
		return moveDayForwardDays(getEaster(year), 49);
}

function getTrinity(year) {
	return moveDayForwardDays(getPentecost(year), 7);
}

function getMaryMotherOfChurch(year) {
	return moveDayForwardDays(getPentecost(year), 1);
}

function getCorpusChristi(year) {
	return moveDayForwardDays(getTrinity(year), 7);
}

function getSacredHeart(year) {
	return moveDayForwardDays(getPentecost(year), 7 * 3 - 2);
}

function getImmaculateHeart(year) {
	return moveDayForwardDays(getSacredHeart(year), 1);
}

function getChristKing(year) {
	return moveDayForwardDays(getAdventSunday(year + 1), -7);
}

// For universal use
var UUID = '12';

function loadYaml(url, callback) {
	jQuery.get(url + '.yml?' + UUID, function onGetYaml(data) {
		function doLogAndCallback(data){
			console.log('-----' + url + '------');
			console.log(data);
			callback(data);
			console.log('-----' + url + '------')
		};

		doLogAndCallback(YAML.parse(data));
	});
}


// ugly counting functions
function ordinalInWord( cardinal ) {
    var ordinals = [ 'zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth' ];
    var tens = {
        20: 'twenty-',
		30: 'thirty-'
    };
    var ordinalTens = {
		20: 'twentieth',
        30: 'thirtieth'
    };

    if( cardinal <= 20 ) {
		var n = ordinals[ cardinal ];
		return n.charAt(0).toUpperCase() + n.slice(1);
    }

    if( cardinal % 10 === 0 ) {
        var n = ordinalTens[ cardinal ];
		return n.charAt(0).toUpperCase() + n.slice(1);
    }

    var n = (tens[ cardinal - ( cardinal % 10 ) ] + ordinals[ cardinal % 10 ]);
	return n.charAt(0).toUpperCase() + n.slice(1);
}


// rank functions
function convertRankToWeight(rank) {
	var mainRank = rank, minorRank;
	if (Array.isArray(rank)) {
		mainRank = rank[0];
		minorRank = rank[1];
	}

	switch (mainRank) {
		case 'holyday': return 1.0;
		case 'solemnity':
			switch (minorRank) {
				case 'lord': return 2.1;
				case 'bvm': return 2.2;
				case 'saint': return 2.3;
				case 'patron': return 2.4;
				case 'dedication': return 2.5;
				case 'title': return 2.6;
			}
		case 'feast':
			switch (minorRank) {
				case 'lord': return 3.1;
				case 'sunday': return 3.2;
				case 'bvm': return 3.3;
				case 'saint': return 3.4;
				case 'patron_diocese': return 3.5;
				case 'dedication': return 3.6;
				case 'patron_region': return 3.7;
				case 'title': return 3.8;
				case 'parish': return 3.9;
				case 'diocese': return 3.91;
			}
		case 'strong_feria': return 4;
		case 'memorial': return 5;
		case 'secondary':
			switch (minorRank) {
				case 'patron': return 6.1;
				case 'memorial': return 6.2;
			}
		case 'weak': return 7;
		default:
			console.log('----unkown rank----');
			console.log(rank);
			console.log('---unknown rank----');
	}

	alert('malformed rank: ' + rank);
	return false;
}
