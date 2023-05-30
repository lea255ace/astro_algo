const HORIZON_ANGLE = 90.833;

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
module.exports = {
  calculateEqTimeMinutes,
  calculateDeclinationRadians,
  calculateSunriseHourAngleDegrees,
}