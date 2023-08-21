const colorList = [
  { name: "Aqua", hex: "#1ABC9C" },
  { name: "DarkAqua", hex: "#11806A" },
  { name: "Green", hex: "#57F287" },
  { name: "DarkGreen", hex: "#1F8B4C" },
  { name: "Blue", hex: "#3498DB" },
  { name: "DarkBlue", hex: "#206694" },
  { name: "Purple", hex: "#9B59B6" },
  { name: "DarkPurple", hex: "#71368A" },
  { name: "LuminousVividPink", hex: "#E91E63" },
  { name: "DarkVividPink", hex: "#AD1457" },
  { name: "Gold", hex: "#F1C40F" },
  { name: "DarkGold", hex: "#C27C0E" },
  { name: "Orange", hex: "#E67E22" },
  { name: "DarkOrange", hex: "#A84300" },
  { name: "Red", hex: "#ED4245" },
  { name: "DarkRed", hex: "#992D22" },
  { name: "Grey", hex: "#95A5A6" },
  { name: "DarkGrey", hex: "#979C9F" },
  { name: "DarkerGrey", hex: "#7F8C8D" },
  { name: "LightGrey", hex: "#BCC0C0" },
  { name: "Navy", hex: "#34495E" },
  { name: "DarkNavy", hex: "#2C3E50" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Greyple", hex: "#99AAb5" },
  { name: "Black", hex: "#23272A" },
  { name: "Blurple", hex: "#5865F2" },
  { name: "Fuchsia", hex: "#EB459E" },
];
function getColorHexByName(colorName) {
  const color = colorList.find(color => color.name === colorName);
  return color ? color.hex : null;
}

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colorList.length);
  return colorList[randomIndex];
}
module.exports = { getColorHexByName, getRandomColor };

