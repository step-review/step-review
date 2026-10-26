import runCli from "./runCli.ts";

const result = await runCli(process.argv.slice(2), process.cwd());
process.stdout.write(`${result.output}\n`);
process.exitCode = result.exitCode;
