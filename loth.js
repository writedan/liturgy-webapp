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