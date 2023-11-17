function getLogger(level, color, log) {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  console.log(`[\x1b[34m${hours}:${minutes}:${seconds}\x1b[0m => \x1b[${color}${level}\x1b[0m] - ${log}`);
}

const log = (log) => getLogger("LOG", "32m", log);
const warn = (log) => getLogger("WARN", "2;33m", log);
const info = (log) => getLogger("INFO", "32m", log);
const error = (log) => getLogger("ERROR", "31m", log);
const debug = (log) => getLogger("DEBUG", "90m", log);
const ready = (log) => getLogger("READY", "34m", log);
const event = (log) => getLogger("EVENT", "33m", log);
const utility = (log) => getLogger("UTILITY", "33m", log);
const heartbeat = (log) => getLogger("HEARTBEAT", "35m", log);
const shard = (log) => getLogger("SHARD", "32m", log);
const cluster = (log) => getLogger("CLUSTER", "90m", log);
const command = (log) => getLogger("COMMAND", "36m", log);
const notice = (log) => getLogger("NOTICE", "36m", log);
const critical = (log) => getLogger("CRITICAL", "31m", log);
const trace = (log) => getLogger("TRACE", "34m", log);

module.exports = {
  warn,
  log,
  info,
  error,
  debug,
  ready,
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
