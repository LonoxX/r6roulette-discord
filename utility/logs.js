function pawlog(level, color, log) {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  console.log(`[\x1b[34m${hours}:${minutes}:${seconds}\x1b[0m => \x1b[${color}${level}\x1b[0m] - ${log}`);
}

const log = (log) => pawlog("LOG", "32m", log);
const warn = (log) => pawlog("WARN", "2;33m", log);
const info = (log) => pawlog("INFO", "32m", log);
const error = (log) => pawlog("ERROR", "31m", log);
const debug = (log) => pawlog("DEBUG", "90m", log);
const ready = (log) => pawlog("READY", "34m", log);
const database = (log) => pawlog("DATABASE", "36m", log);
const event = (log) => pawlog("EVENT", "33m", log);
const utility = (log) => pawlog("UTILITY", "33m", log);
const heartbeat = (log) => pawlog("HEARTBEAT", "35m", log);
const shard = (log) => pawlog("SHARD", "32m", log);
const cluster = (log) => pawlog("CLUSTER", "90m", log);
const command = (log) => pawlog("COMMAND", "36m", log);
const notice = (log) => pawlog("NOTICE", "36m", log);
const critical = (log) => pawlog("CRITICAL", "31m", log);
const trace = (log) => pawlog("TRACE", "34m", log);

module.exports = {
  warn,
  log,
  info,
  error,
  debug,
  ready,
  database,
  event,
  utility,
  heartbeat,
  shard,
  cluster,
  command,
  notice,
  critical,
  trace,
};
