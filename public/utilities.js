const cleanText = (text) => {
  //remove parenthesis and text inside
  text = text.toLowerCase();
  text = text.replace(/ *\([^)]*\) */g, "");
  text = text.replace(/ *\[[^\]]*]/, "");
  text = text.replace(/\d{2}[']{2}|\d{3}[']{2}/gm, "");
  text = text.replace(/\d{2}["]{2}|\d{3}["]{2}/gm, "");
  text = text.replace("mix", "");
  text = text.replace("extended", "");
  text = text.replace("remastered", "");
  text = text.replace("official", "");
  text = text.replace("video", "");
  text = text.replace("hd", "");
  text = text.replace("original", "");
  text = text.replace("1080", "");
  text = text.replace("with lyrics", "");
  text = text.replace("lyrics", "");
  text = text.replace(".mp3", "");

  let tempText = text;

  if (tempText.split(" ft. ")[0].length !== 0) text = text.split(" ft. ")[0];
  if (tempText.split(" ft ")[0].length !== 0) text = text.split(" ft. ")[0];
  if (tempText.split(" w\\ ")[0].length !== 0) text = text.split(" ft. ")[0];
  return text;
};

module.exports = { cleanText };
