const { createCanvas } = require("canvas");
const fs = require("fs");
import path from "path";

const colours = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#95a5a6",
  "#f39c12",
  "#d35400",
  "#c0392b",
  "#bdc3c7",
  "#7f8c8d",
];

export function drawImage(
  id: number | string,
  firstName: string,
  lastName?: string
) {
  if (!firstName) firstName = "AD";
  let initials = firstName[0].toUpperCase();
  let secondChar = firstName.length > 1 ? firstName[1] : "";
  initials +=
    lastName && lastName.length ? lastName[0].toUpperCase() : secondChar;

  const canvasCssWidth = 200,
    canvasCssHeight = 200;

  // let charIndex = initials.charCodeAt(0) - 65,
  //   colourIndex = charIndex % 19;

  let fullName: string = `${firstName} ${lastName}`;
  const canvass = createCanvas(200, 200);
  const context = canvass.getContext("2d");
  context.fillStyle = stringToHslColor(fullName, 40, 60); //colours[colourIndex]
  context.fillRect(0, 0, canvass.width, canvass.height);
  context.font = "100px Lato";
  context.textAlign = "center";
  context.fillStyle = "#FFF";
  context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);
  const buffer = canvass.toBuffer("image/png");
  let fileName = `${id}-${Date.now()}.png`;
  let pathToImage = path.resolve(process.env.Image_Path, fileName);
  fs.writeFileSync(pathToImage, buffer);
  return fileName;
}

export const stringToHslColor = (str: string, s: number, l: number) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var h = hash % 360;
  return "hsl(" + h + ", " + s + "%, " + l + "%)";
};
