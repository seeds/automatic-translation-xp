const dateFns = require('/lib/external/date-fns/date-fns')

/* Extend original dateFns module */

// Storing original functions
dateFns._parse = dateFns._parse || dateFns.parse
dateFns._format = dateFns._format || dateFns.format

dateFns.parse = tryParse
dateFns.format = tryFormat

const invalidDate = 'Invalid Date'

/**
 * Parsing with validation
 * @param {String} datetimeString
 */
function tryParse (datetimeString) {
	const parsed = dateFns._parse(datetimeString)
	if (isNaN(parsed)) {
		throw Error(invalidDate + ': "' + datetimeString + '"')
	}
	return parsed
}

/**
 * Formatting with validation
 * @param {Date} datetime
 * @param {String} formatStr
 * @param {} options
 */
function tryFormat (datetime, formatStr, options) {
	let formatted
	if (!datetime) {
		formatted = invalidDate
	} else {
		try {
			formatted = dateFns._format(datetime, formatStr, options)
		} catch (e) {
			formatted = invalidDate
		}
	}

	return formatted
}

function isDateValue(dateStr) {
	return dateFns.format(dateStr) !== invalidDate
}

/** Re-export the new dateFns */

module.exports = {
	/* Original functions */
	addDays: dateFns.addDays,
	addHours: dateFns.addHours,
	addISOYears: dateFns.addISOYears,
	addMilliseconds: dateFns.addMilliseconds,
	addMinutes: dateFns.addMinutes,
	addMonths: dateFns.addMonths,
	addQuarters: dateFns.addQuarters,
	addSeconds: dateFns.addSeconds,
	addWeeks: dateFns.addWeeks,
	addYears: dateFns.addYears,
	areRangesOverlapping: dateFns.areRangesOverlapping,
	buildFormattingTokensRegExp: dateFns.buildFormattingTokensRegExp,
	closestIndexTo: dateFns.closestIndexTo,
	closestTo: dateFns.closestTo,
	compareAsc: dateFns.compareAsc,
	compareDesc: dateFns.compareDesc,
	differenceInCalendarDays: dateFns.differenceInCalendarDays,
	differenceInCalendarISOWeeks: dateFns.differenceInCalendarISOWeeks,
	differenceInCalendarISOYears: dateFns.differenceInCalendarISOYears,
	differenceInCalendarMonths: dateFns.differenceInCalendarMonths,
	differenceInCalendarQuarters: dateFns.differenceInCalendarQuarters,
	differenceInCalendarWeeks: dateFns.differenceInCalendarWeeks,
	differenceInCalendarYears: dateFns.differenceInCalendarYears,
	differenceInDays: dateFns.differenceInDays,
	differenceInHours: dateFns.differenceInHours,
	differenceInISOYears: dateFns.differenceInISOYears,
	differenceInMilliseconds: dateFns.differenceInMilliseconds,
	differenceInMinutes: dateFns.differenceInMinutes,
	differenceInMonths: dateFns.differenceInMonths,
	differenceInQuarters: dateFns.differenceInQuarters,
	differenceInSeconds: dateFns.differenceInSeconds,
	differenceInWeeks: dateFns.differenceInWeeks,
	differenceInYears: dateFns.differenceInYears,
	distanceInWords: dateFns.distanceInWords,
	distanceInWordsStrict: dateFns.distanceInWordsStrict,
	distanceInWordsToNow: dateFns.distanceInWordsToNow,
	eachDay: dateFns.eachDay,
	endOfDay: dateFns.endOfDay,
	endOfHour: dateFns.endOfHour,
	endOfISOWeek: dateFns.endOfISOWeek,
	endOfISOYear: dateFns.endOfISOYear,
	endOfMinute: dateFns.endOfMinute,
	endOfMonth: dateFns.endOfMonth,
	endOfQuarter: dateFns.endOfQuarter,
	endOfSecond: dateFns.endOfSecond,
	endOfToday: dateFns.endOfToday,
	endOfTomorrow: dateFns.endOfTomorrow,
	endOfWeek: dateFns.endOfWeek,
	endOfYear: dateFns.endOfYear,
	endOfYesterday: dateFns.endOfYesterday,
	format: dateFns.format,
	getDate: dateFns.getDate,
	getDay: dateFns.getDay,
	getDayOfYear: dateFns.getDayOfYear,
	getDaysInMonth: dateFns.getDaysInMonth,
	getDaysInYear: dateFns.getDaysInYear,
	getHours: dateFns.getHours,
	getISODay: dateFns.getISODay,
	getISOWeek: dateFns.getISOWeek,
	getISOWeeksInYear: dateFns.getISOWeeksInYear,
	getISOYear: dateFns.getISOYear,
	getMilliseconds: dateFns.getMilliseconds,
	getMinutes: dateFns.getMinutes,
	getMonth: dateFns.getMonth,
	getOverlappingDaysInRanges: dateFns.getOverlappingDaysInRanges,
	getQuarter: dateFns.getQuarter,
	getSeconds: dateFns.getSeconds,
	getTime: dateFns.getTime,
	getYear: dateFns.getYear,
	isAfter: dateFns.isAfter,
	isBefore: dateFns.isBefore,
	isDate: dateFns.isDate,
	isEqual: dateFns.isEqual,
	isFirstDayOfMonth: dateFns.isFirstDayOfMonth,
	isFriday: dateFns.isFriday,
	isFuture: dateFns.isFuture,
	isLastDayOfMonth: dateFns.isLastDayOfMonth,
	isLeapYear: dateFns.isLeapYear,
	isMonday: dateFns.isMonday,
	isPast: dateFns.isPast,
	isSameDay: dateFns.isSameDay,
	isSameHour: dateFns.isSameHour,
	isSameISOWeek: dateFns.isSameISOWeek,
	isSameISOYear: dateFns.isSameISOYear,
	isSameMinute: dateFns.isSameMinute,
	isSameMonth: dateFns.isSameMonth,
	isSameQuarter: dateFns.isSameQuarter,
	isSameSecond: dateFns.isSameSecond,
	isSameWeek: dateFns.isSameWeek,
	isSameYear: dateFns.isSameYear,
	isSaturday: dateFns.isSaturday,
	isSunday: dateFns.isSunday,
	isThisHour: dateFns.isThisHour,
	isThisISOWeek: dateFns.isThisISOWeek,
	isThisISOYear: dateFns.isThisISOYear,
	isThisMinute: dateFns.isThisMinute,
	isThisMonth: dateFns.isThisMonth,
	isThisQuarter: dateFns.isThisQuarter,
	isThisSecond: dateFns.isThisSecond,
	isThisWeek: dateFns.isThisWeek,
	isThisYear: dateFns.isThisYear,
	isThursday: dateFns.isThursday,
	isToday: dateFns.isToday,
	isTomorrow: dateFns.isTomorrow,
	isTuesday: dateFns.isTuesday,
	isValid: dateFns.isValid,
	isWednesday: dateFns.isWednesday,
	isWeekend: dateFns.isWeekend,
	isWithinRange: dateFns.isWithinRange,
	isYesterday: dateFns.isYesterday,
	lastDayOfISOWeek: dateFns.lastDayOfISOWeek,
	lastDayOfISOYear: dateFns.lastDayOfISOYear,
	lastDayOfMonth: dateFns.lastDayOfMonth,
	lastDayOfQuarter: dateFns.lastDayOfQuarter,
	lastDayOfWeek: dateFns.lastDayOfWeek,
	lastDayOfYear: dateFns.lastDayOfYear,
	max: dateFns.max,
	min: dateFns.min,
	parse: dateFns.parse,
	setDate: dateFns.setDate,
	setDay: dateFns.setDay,
	setDayOfYear: dateFns.setDayOfYear,
	setHours: dateFns.setHours,
	setISODay: dateFns.setISODay,
	setISOWeek: dateFns.setISOWeek,
	setISOYear: dateFns.setISOYear,
	setMilliseconds: dateFns.setMilliseconds,
	setMinutes: dateFns.setMinutes,
	setMonth: dateFns.setMonth,
	setQuarter: dateFns.setQuarter,
	setSeconds: dateFns.setSeconds,
	setYear: dateFns.setYear,
	startOfDay: dateFns.startOfDay,
	startOfHour: dateFns.startOfHour,
	startOfISOWeek: dateFns.startOfISOWeek,
	startOfISOYear: dateFns.startOfISOYear,
	startOfMinute: dateFns.startOfMinute,
	startOfMonth: dateFns.startOfMonth,
	startOfQuarter: dateFns.startOfQuarter,
	startOfSecond: dateFns.startOfSecond,
	startOfToday: dateFns.startOfToday,
	startOfTomorrow: dateFns.startOfTomorrow,
	startOfWeek: dateFns.startOfWeek,
	startOfYear: dateFns.startOfYear,
	startOfYesterday: dateFns.startOfYesterday,
	subDays: dateFns.subDays,
	subHours: dateFns.subHours,
	subISOYears: dateFns.subISOYears,
	subMilliseconds: dateFns.subMilliseconds,
	subMinutes: dateFns.subMinutes,
	subMonths: dateFns.subMonths,
	subQuarters: dateFns.subQuarters,
	subSeconds: dateFns.subSeconds,
	subWeeks: dateFns.subWeeks,
	subYears: dateFns.subYears,
	/* New functions */
	isDateValue: isDateValue
}
