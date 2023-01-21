const { execSync } = require("child_process");
const path = require("path");

const ENV_PASSWORD = "test";

const options = {
  stdio: "inherit",
  env: {
    ...process.env,
    DATA_ROOT: "data_test",
    SECRET: "salt",
    PASSWORD: ENV_PASSWORD,
    CYPRESS_PASSWORD: ENV_PASSWORD,
  },
};

try {
  execSync("npm run migrate", options);
  execSync("npm run build", options);

  // Use explicit IP to work around:
  // https://github.com/bahmutov/start-server-and-test/issues/348
  execSync(
    [
      "npx",
      "start-server-and-test",
      "start",
      "http://127.0.0.1:3000",
      "cypress:test",
    ].join(" "),
    options,
  );
} finally {
  execSync(`node ${path.join("scripts", "destroy")}`, options);
}
