#!/usr/bin/env node
const path = require('path');
const glob = require('glob');
let converted = false;

const argv = require('yargs') // Reference -> https://github.com/yargs/yargs
    .option('components', {
        alias: 'c',
        describe: 'Processes the components. Provide a glob in quotes.',
    })
    .option('services', {
        alias: 's',
        describe: 'Processes the services. Provide a glob in quotes.',
    })
    .option('serviceSpecs', {
        describe: 'Processes the non component spec files',
    })
    .option('templates', {
        alias: 't',
        describe: 'Processes the templates. Provide a glob in quote.',
    })
    .help('h').argv;

/* Process Components */
if (argv.components) {
    const globPath = path.join(process.cwd(), argv.components);
    processComponents(globPath);
    converted = true;
}

/* Process Services */
if (argv.services) {
    const globPath = path.join(process.cwd(), argv.services);
    processServices(globPath);
    converted = true;
}

/* Process Non Component Spec Files */
if (argv.serviceSpecs) {
    const globPath = path.join(process.cwd(), argv.serviceSpecs);
    processServiceSpecs(globPath);
    converted = true;
}

/* Process Templates */
if (argv.templates) {
    const globPath = path.join(process.cwd(), argv.templates);
    processTemplates(globPath);
    converted = true;
}

if (converted) {
    console.log('Conversion completed');
    process.exit(0);
} else {
    console.log('No arguments provided, nothing converted');
    process.exit(1);
}

function processComponents(globPath) {
    const tool = require('./tools/process-components');
    const files = glob.sync(globPath);
    tool(files);
}

function processServices(globPath) {
    const tool = require('./tools/process-services');
    const files = glob.sync(globPath);
    tool(files);
}

function processServiceSpecs(globPath) {
    const tool = require('./tools/process-service-specs');
    const files = glob.sync(globPath);
    tool(files);
}

function processTemplates(globPath) {
    const tool = require('./tools/process-templates');
    const files = glob.sync(globPath);
    tool(files);
}
