const HORIZON_ANGLE = 90.833;

const QuarterDays = {
  VernalEquinox: "vernalEquinox",
  SummerSolstice: "summerSolstice",
  AutumnalEquinox: "autumnalEquinox",
  WinterSolstice: "winterSolstice",
};

//TODO(MW): This should account for leap years.
function calculateFractionalYear(date) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const hour = date.getHours() + (date.getMinutes() / 60);

  return (2 * Math.PI) * (dayOfYear - 1 + (hour - 12)/24) / 365;
}

function calculateEqTimeMinutes(date) {
  const fractionalYear = calculateFractionalYear(date);
  return 229.18 * (0.000075 + 0.001868 * Math.cos(fractionalYear) - 0.032077 * Math.sin(fractionalYear)
                            - 0.014615 * Math.cos(2 * fractionalYear) - 0.040849 * Math.sin(2 * fractionalYear));
}

function calculateDeclinationRadians(date) {
  const fractionalYear = calculateFractionalYear(date);
  return 0.006918 - 0.399912 * Math.cos(fractionalYear) + 0.070257 * Math.sin(fractionalYear)
                  - 0.006758 * Math.cos(2 * fractionalYear) + 0.000907 * Math.sin(2 * fractionalYear)
                  - 0.002697 * Math.cos(3 * fractionalYear) + 0.00148 * Math.sin (3 * fractionalYear);

}

function calculateSunriseHourAngleDegrees(latitudeDegrees, declinationRadians) {
  const solarZenithRadians = HORIZON_ANGLE * 2 * Math.PI / 360;
  const latitudeRadians = latitudeDegrees * 2 * Math.PI / 360;
  const hourAngleRadians =  Math.acos( Math.cos(solarZenithRadians) / (Math.cos(latitudeRadians) * Math.cos(declinationRadians)) - Math.tan(latitudeRadians) * Math.tan(declinationRadians) );
  return hourAngleRadians * 360 / (2 * Math.PI);
}

function calculateCalendarDayFromJD(jd) {
  const Z = Math.trunc(jd + 0.5);
  const F = (jd + 0.5) - Z;
  const alpha = Math.trunc((Z - 1867216.25) / 36524.25);
  const A = (Z < 2299161) ? Z : (Z + 1 + alpha - Math.trunc(alpha / 4));
  const B = A + 1524;
  const C = Math.trunc((B - 122.1) / 365.25);
  const D = Math.trunc(365.25 * C)
  const E = Math.trunc((B - D) / 30.6001);
  const day = B - D - Math.trunc(30.6001 * E) + F;
  const month = (E < 14) ? E - 1 : E - 13;
  const year = ( month > 2) ? C - 4716 : C - 4715;
  const hour = (day - Math.trunc(day)) * 24
  const minute = (hour - Math.trunc(hour)) * 60
  const second = (minute - Math.trunc(minute)) * 60
  const ms = (second - Math.trunc(second)) * 1000
  return new Date(year, month - 1, day, hour, minute, second, ms);
}

//TODO(MW): This is a first-order approximation, and should use the more refined calculation.
function calculateQuarterDayForYear(quarterDay, year) {
  const y = (year - 2000) / 1000;
  var jde0;
  switch(quarterDay) {
    case QuarterDays.VernalEquinox:
      jde0 = 2451623.80984 + 365242.37404 * y + 0.05169 * Math.pow(y, 2) - 0.00411 * Math.pow(y, 3) - 0.00057 * Math.pow(y, 4);
      break;
    case QuarterDays.SummerSolstice:
      jde0 = 2451716.56767 + 365241.62603 * y + 0.00325 * Math.pow(y, 2) + 0.00888 * Math.pow(y, 3) - 0.00030 * Math.pow(y, 4);
      break;
    case QuarterDays.AutumnalEquinox:
      jde0 = 2451810.21715 + 365242.01767 * y - 0.11575 * Math.pow(y, 2) + 0.00337 * Math.pow(y, 3) + 0.00078 * Math.pow(y, 4);
      break;
    case QuarterDays.WinterSolstice:
      jde0 = 2451900.05952 + 365242.74049 * y - 0.06223 * Math.pow(y, 2) - 0.00823 * Math.pow(y, 3) + 0.00032 * Math.pow(y, 4);
      break;
    default:
      throw new Error('quarterDay parameter is invalid!');
  }

  return calculateCalendarDayFromJD(jde0);
}

module.exports = {
  QuarterDays,
  calculateEqTimeMinutes,
  calculateDeclinationRadians,
  calculateSunriseHourAngleDegrees,
  calculateQuarterDayForYear,
}