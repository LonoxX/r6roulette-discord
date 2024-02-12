const fs = require("fs");
const excludeKeys = ["EmbedColor", "Website", "SupportServer", "Vote", "Donate"];
const specificValueKeys = {
  OwnersID: ["Owner_ID", "Owner_ID"],
};

function replaceValues(obj) {
  for (let key in obj) {
    if (excludeKeys.includes(key)) {
      continue;
    }
    if (key in specificValueKeys) {
      obj[key] = specificValueKeys[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      replaceValues(obj[key]);
    } else {
      obj[key] = key;
    }
  }
}

fs.readFile("config.json", "utf8", function (err, data) {
  if (err) {
    console.error(err);
    return;
  }
  let config = JSON.parse(data);
  replaceValues(config);
  fs.writeFile("example_config.json", JSON.stringify(config, null, 2), "utf8", function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("example_config.json wurde erfolgreich erstellt.");
    }
  });
});
