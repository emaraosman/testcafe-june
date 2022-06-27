// Bake the `prodperfect_test` cookie if not already present.
document.cookie
  .split("; ")
  .find(function isP2Cookie(row){ return row.startsWith("prodperfect_test="); })
  || (function bakeCookie(testCafeInnards = {}, prodPerfectInnards = {}) {
    const { testName, testRunId } = testCafeInnards;
    const {
      version,
      cliCommand,
      testSuite,
      testSuiteRunId
    } = prodPerfectInnards;

    const cookieValue = {
      // NOTE(dabrady) Converting to snake_case here to match consumer expectations.
      test_run_data: {
        test_script: testName,
        test_script_run_id: testRunId,
        version,
        cli_command: cliCommand,
        test_suite: testSuite,
        test_suite_run_id: testSuiteRunId 
      }
    };

    const cookie = JSON.stringify(cookieValue);
    document.cookie = `prodperfect_test=${cookie}; path=/`;
  })(
    // NOTE(dabrady) This is the only way I've found to get access to the
    // test run data we bake into our cookie.
    // @see https://github.com/ProdPerfect/testcafe/blob/35a9a41d954b23f38b4daaf4008bc6765ebccc95/src/client/test-run/index.js.mustache#L45-L48
    // @see https://github.com/ProdPerfect/testcafe/blob/35a9a41d954b23f38b4daaf4008bc6765ebccc95/src/client/driver/driver.js#L119
    window['%testCafeDriverInstance%'],

    // NOTE(dabrady) This is expected to be set prior to this script's injection.
    window.ProdPerfectTestData
  );
