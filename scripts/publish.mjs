import { execSync } from "child_process";

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", shell: true });
}

function getOutput(command) {
  return execSync(command, { encoding: "utf8", shell: true }).trim();
}

try {
  console.log("Preparing site...");

  run("npm run copy");
  run("npm run generate");

  console.log("\nBuilding site...");
  run("npx quartz build");

  console.log("\nChecking git status...");

  const status = getOutput("git status --porcelain");

  if (!status) {
    console.log("No changes to publish.");
    process.exit(0);
  }

  run("git add content scripts package.json quartz/styles/custom.scss");

  const staged = getOutput("git diff --cached --name-only");

  if (!staged) {
    console.log("No staged changes.");
    process.exit(0);
  }

  run('git commit -m "Update site"');
  run("git push");

  console.log("\nPublish complete.");
} catch (error) {
  console.error("\nPublish failed.");
  process.exit(1);
}