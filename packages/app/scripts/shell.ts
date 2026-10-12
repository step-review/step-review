import { $ } from "zx";

export default $({
  quiet: true,
  env: {
    ...process.env,
    CI: "true",
    NO_COLOR: "1",
    WRANGLER_SEND_METRICS: "false",
    WRANGLER_WRITE_LOGS: "false",
    WRANGLER_LOG_SANITIZE: "true",
  },
});
