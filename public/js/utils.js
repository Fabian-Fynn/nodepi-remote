function componentToHex(c) {
  var hex = parseInt(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
  return componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

