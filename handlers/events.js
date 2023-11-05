const { readdirSync } = require("fs");
const getLogger = require("../utility/logs.js")
module.exports = (client) => {
    const load = dirs => {
        const events = readdirSync(`./events/${dirs}/`).filter(d => d.endsWith("js"));
        for (let file of events) {
            let evt = require(`../events/${dirs}/${file}`);
            let eName = file.split('.')[0];
            client.on(eName, evt.bind(null, client));
            getLogger.event('Loaded' + eName + '.');
        }
    };
    ["client", "guild"].forEach((x) => load(x));
};