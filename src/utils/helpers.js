// show the price in the correct format
export const formatPrice = (price, currency = 'USD') => {
  return price ? price.toLocaleString('en-US', {
    //style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) : price;
}

export const abbreviation = (n, decimalPlaces) => {
  let x = ('' + n).length;
  let d = Math.pow(10, decimalPlaces);
  x -= x % 3;
  return Math.round(n * d / Math.pow(10, x)) / d + " kMGTPE"[x / 3];
};
export const camelCaseToSentence = (str) => {
  let sentence = '';
  for (var i = 0; i < str.length; i++) {
    var char = str.charAt(i);
    if (char === char.toLowerCase()) {
      sentence += char;
    } else {
      sentence += ' ' + char.toLowerCase();
    }
  }
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

export const reOrder = (data, value) => {
  if (!value) return data
  const index = data.findIndex(item => item.name === value)
  const item = data.splice(index, 1)
  data.unshift(item[0])
  return data
}

export const hostUrl = () => {
  const host = window.location.host;
  const protocol = window.location.protocol;
  return `${protocol}//${host}/#`;
}
export const textCapitalize = (text) => {
  if (!text) return text;
  return text.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
}

export const getNameOfObject = (obj) => {

  switch (true) {
    case obj.hasOwnProperty('menuName'):
      return obj.menuName;
    case obj.hasOwnProperty('categoryName'):
      return obj.categoryName;
    case obj.hasOwnProperty('productName'):
      return obj.productName;
  }
}
