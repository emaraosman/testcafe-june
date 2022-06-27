/**
 *
 * WARNING! This file is managed by Terraform. Changes will be over-written.
 *
 *
 **/

const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const minimist = require('minimist');
const faker = require('faker');
const { ClientFunction } = require('testcafe');
const { credentials } = require('./credentials');

const args = minimist(process.argv.slice(2));
const origin = args.origin || credentials.origin;
const testSuiteRunId = process.env.TEST_RUN_ID || v4();
console.log(`Test Suite Run ID => ${testSuiteRunId}`);

// NOTE(dabrady) Need to capture these values from the process environment if we want to send them client-side.
// TODO(dabrady) These `npm_*` variables are consistently undefined for some reason. Do we need them?
const envDataToReport = {
  // Ensure we properly quote defined values.
  version: process.env.npm_package_version && `'${process.env.npm_package_version}'`,
  cliCommand: process.env.npm_lifecycle_script && `'${process.env.npm_lifecycle_script}'`,
  testSuite: process.env.npm_package_name && `'${process.env.npm_package_name}'`,
  testSuiteRunId: `'${testSuiteRunId}'`,
};

// const readSkipConfig = (relativePath = "../../skip.json") => {
//   try {
//     return require(relativePath).skipTestIds;
//   } catch (err) {
//     console.warn("WARNING: No skip config found. Running all tests.");
//     console.log(`Expected skip.json file in the root directory of the test suite`);
//     console.log(`Details: { ${err.message} }\n`);
//     return [];
//   }
// };

// const skipTestIds = readSkipConfig();

const setupFixture = () => {
  return fixture(`${credentials.customerName} regression tests\nOrigin: ${origin}`)
    .page(origin)
    .meta({ origin })
    .clientScripts(
      {
        content: `
          /**
           * Our test tracking requires knowledge about the tests being tracked. Since TestCafe
           * doesn't let us inject dependencies into the scripts we inject, we are forced to
           * make use of the global state here.
           **/
          window.ProdPerfectTestData ||= {};
          Object.assign(window.ProdPerfectTestData, {
            version: ${ envDataToReport.version },
            cliCommand: ${ envDataToReport.cliCommand },
            testSuite: ${ envDataToReport.testSuite },
            testSuiteRunId: ${ envDataToReport.testSuiteRunId },
          });
        `
      },
      /** Bake the tracking cookie as needed (they persist across page loads) **/
      {
        path: path.join(__dirname, 'setTestDataCookie.js')
      },
      /** Inject the tracking snippet (doesn't persist across page loads) **/
      // TODO(dabrady) How do we block the test until this is ready, each time we inject?
      {
        path: path.join(__dirname, '../../tracking.js')
      }
    );
};

/**
 * Returns TestCafe `test` function with chained meta object and (if necessary) skip method
 * Always run the test in interactive (debug/edit) mode even if it's skipped
 * @param {object} meta - The test metadata object
 * @param {string} meta.id - The test id
 * @returns {function} Returns a TestCafe `test` function with chained meta object and (if necessary) skip method
 */

const setTestContext = (t) => {
  const getLocation = ClientFunction(() => document.location.href).with({boundTestRun: t});
  const forcePageReload = ClientFunction(() => location.reload()).with({boundTestRun: t});
  const goBack = ClientFunction(() => window.history.back()).with({boundTestRun: t});
  const scrollToTop = ClientFunction(() => window.scrollTo(top)).with({boundTestRun: t});
  const scrollToBottom = ClientFunction(() => window.scrollTo(0, document.body.scrollHeight)).with({boundTestRun: t});
  const isPageLoaded = ClientFunction(() => window.document.readyState).with({boundTestRun: t});
  const getURLPathname = ClientFunction(() => (new URL(document.location.href).pathname)).with({boundTestRun: t});

  const manualClick = ClientFunction((selector) => {
    const element = document.querySelector(selector);
    element.click();
  }).with({boundTestRun: t});

  return {
    /**
     * NOTE(dabrady) These are no longer needed, but we're not ready to remove them yet.
     * TODO(dabrady) Rip these out.
     */
    setProdPerfectTracking: async function noop(){},
    // NOTE(dabrady) This used to reload the page at the end; maintaining that behavior
    // for backwards compatibility.
    // TODO(dabrady) Identify the tests that rely on this (by removing it), and fix them.
    setProdPerfectCookie: ClientFunction(function reload(){ location.reload(); }).with({boundTestRun: t}),
    /****/
    getLocation,
    forcePageReload,
    goBack,
    scrollToTop,
    scrollToBottom,
    isPageLoaded,
    manualClick,
    getURLPathname
  };
};

module.exports.faker = faker;
module.exports.origin = origin;
module.exports.setupFixture = setupFixture;
module.exports.setTestContext = setTestContext;
module.exports.testSuiteRunId = testSuiteRunId;
module.exports.v4 = v4;
