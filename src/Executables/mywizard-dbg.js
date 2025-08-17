#!/usr/bin/env node
const { resolve } = require("path")
const ExecuteDebugMode = require("cli-script-loader/src/ExecuteDebugMode")

const args = process.argv.slice(2)
const executablesDirPath = resolve(__dirname, "..", "Executables", "mywizard.js")
ExecuteDebugMode(executablesDirPath, args)