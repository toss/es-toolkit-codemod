#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

function showHelp() {
  console.log(`
🔧 es-toolkit codemod for lodash migration

Usage:
  npx @es-toolkit/codemod <path>

Options:
  <path>         Path to files or directory to transform
  --dry          Dry run (preview changes without applying)
  --help, -h     Show this help message

Examples:
  npx @es-toolkit/codemod src/
  npx @es-toolkit/codemod src/components/ --dry
  npx @es-toolkit/codemod src/utils/helpers.ts

Description:
  This codemod automatically transforms your lodash imports to es-toolkit/compat imports:
  
  • import _ from 'lodash' → import * as _ from 'es-toolkit/compat'
  • import { map } from 'lodash' → import { map } from 'es-toolkit/compat'  
  • import debounce from 'lodash/debounce' → import debounce from 'es-toolkit/compat/debounce'
  • import { map } from 'lodash-es' → import { map } from 'es-toolkit/compat'

Repository: https://github.com/toss/es-toolkit-codemod
  `);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    showHelp();
    return;
  }

  const targetPath = args[0];
  const isDryRun = args.includes("--dry");

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Error: Path "${targetPath}" does not exist.`);
    process.exit(1);
  }

  const transformPath = path.join(__dirname, "../dist/index.js");

  if (!fs.existsSync(transformPath)) {
    console.error(`❌ Error: Transform file not found at ${transformPath}`);
    console.log("💡 Try running: npm run build");
    process.exit(1);
  }

  console.log(`🚀 Running lodash → es-toolkit/compat codemod...`);
  console.log(`📁 Target: ${targetPath}`);
  console.log(
    `🔄 Mode: ${isDryRun ? "Dry run (preview only)" : "Apply changes"}`
  );
  console.log("");

  try {
    // using jscodeshift Runner for performance
    const Runner = require("jscodeshift/src/Runner");

    const options = {
      dry: isDryRun,
      print: isDryRun, // print result in dry run
      silent: true,
      verbose: 2,
      babel: false, // transform using ast-grep, disable babel parsing
      extensions: "ts,tsx,js,jsx",
      failOnError: false,
    };

    console.log("🔍 Discovering and processing files...");

    const result = await Runner.run(transformPath, [targetPath], options);

    console.log("\n" + "─".repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   • Files changed: ${result.ok || 0}`);
    console.log(`   • Files unchanged: ${result.nochange || 0}`);
    console.log(`   • Errors: ${result.error || 0}`);
    console.log(`   • Skipped: ${result.skip || 0}`);
    console.log(`   • Duration: ${result.timeElapsed}ms`);

    if (isDryRun && result.ok > 0) {
      console.log(
        "\n💡 To apply these changes, run the command without --dry flag"
      );
    } else if (!isDryRun && result.ok > 0) {
      console.log("\n✅ Transformation completed successfully!");
      console.log("📝 Please review the changes and test your application.");
      console.log(
        "🔗 Learn more about es-toolkit: https://es-toolkit.slash.page"
      );
    } else if (result.ok === 0) {
      console.log("\nℹ️  No lodash imports found to transform.");
    }

    if (result.error > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error running codemod:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
