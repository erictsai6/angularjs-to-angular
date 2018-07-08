#!/usr/bin/env node
const path = require('path');
const glob = require('glob');

const argv = require('yargs') // Reference -> https://github.com/yargs/yargs
    .option('components', {
        alias: 'c',
        describe: 'Processes the components. Provide a glob in quotes.'
    })
    .option('services', {
        alias: 's',
        describe: 'Processes the services. Provide a glob in quotes.'
    })
    .option('serviceSpecs', {
        describe: 'Processes the non component spec files'
    })
    .option('templates', {
        alias: 't',
        describe: 'Processes the templates. Provide a glob in quote.'
    })
    .help('h')
    .argv;


/* Process Components */
if (argv.components) {
    const globPath = path.join(process.cwd(), argv.components);
    processComponents(globPath);
    process.exit(0);
}

/* Process Services */
if (argv.services) {
    const globPath = path.join(process.cwd(), argv.services);
    processServices(globPath);
    process.exit(0);
}

/* Process Non Component Spec Files */
if(argv.serviceSpecs) {
    const globPath = path.join(process.cwd(), argv.serviceSpecs);
    processServiceSpecs(globPath);
    process.exit(0);
}

/* Process Templates */
if (argv.templates) {
    const globPath = path.join(process.cwd(), argv.templates);
    processTemplates(globPath);
    process.exit(0);
}

console.log('No arguments provided, nothing converted');
process.exit(0);

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
