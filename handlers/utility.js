const { readdirSync } = require("fs");
const { join } = require("path");
const pawlog = require("../utility/logs.js")
module.exports = (client) => {
    const load = () => {
        const utilityFiles = readdirSync("./utility").filter(file => file.endsWith(".js"));
        for (const file of utilityFiles) {
            const filePath = join(__dirname, "../utility", file);
            const evt = require(filePath);
            const eName = file.split(".")[0];
            pawlog.utility('Loaded' + eName + '.');
        }
    };
    load();
};
