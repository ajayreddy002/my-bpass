/**
 * @param {Number} value  value in sq.yards
 */
const convertToSqMeters = value => {
  return parseFloat(value / 1.196).toFixed(2);
};

/**
 * @param {Number} value  value in sq.meters
 */
const convertToSqYards = value => {
  if (value) return parseFloat(value * 1.196).toFixed(2);
  return 0;
};

const convertStringToFloat = floatValue => {
  let value = parseFloat(floatValue);
  if (isNaN(value)) return 0;
  return value;
};

const convertDateToDMY = (dateString) => {
  var date = new Date(dateString);
  var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var d = date.getDate();
  var m = strArray[date.getMonth()];
  var y = date.getFullYear();
  return '' + (d <= 9 ? '0' + d : d) + ' ' + m + ' ' + y;
}

export { convertStringToFloat, convertToSqMeters, convertToSqYards, convertDateToDMY };
