const { Selector } = require("testcafe");
const { credentials } = require("./credentials");
const moment = require("moment");

const setupCustomUtilities = (t, getLocation) => {
  const login = async (t, email, password) => {
    await t
      .setTestSpeed(0.5)
      .typeText(Selector("#email", { boundTestRun: t }), email, {
        paste: true,
      })
      .typeText(Selector("#password", { boundTestRun: t }), password, {
        paste: true,
      })
      .click(Selector('div[class*="title"]'))
      .hover(Selector("button[type='submit']", { speed: 0.01 }))
      .click(Selector("button[type='submit']", { speed: 0.01, boundTestRun: t }));

    await t
      .expect(getLocation()).match(/.*\/companies|scenarios\/\d+/, { timeout: 80000 });

  };

  const logout = async (t) => {
    await t
      .click(Selector('div[class*="UserAvatar"]'))
      .hover(Selector('a').withText(/Sign Out/i), { speed: 0.01 })
      .click(Selector('a').withText(/Sign Out/i))
      .expect(getLocation()).match(/.*\/login/)
      .expect(Selector('button[type="submit"]').withText(/Log in/i).visible).ok();
  };

  const changeCompany = async (t, companyName) => {
    await t
      .maximizeWindow()
      .click(Selector('button[class*="UserDropDown_toggle"]', { boundTestRun: t, speed: 0.01 }));

    const companyDropdownSelector = Selector('button[class*="CompanyDropdown_toggle"]', { boundTestRun: t });

    if (await companyDropdownSelector.exists) {
      await t
        .click(companyDropdownSelector)
        .typeText(Selector('div[class*="CompanyDropdown_menu"] input', { boundTestRun: t }), companyName, { replace: true })
        .click(Selector('a[class*="CompanyDropdown_item"] div[class*="CompanyDropdown_companyName"]', { boundTestRun: t }).withText(companyName))
        .expect(Selector('div[class*="ScenarioNavBar"]', { boundTestRun: t }).exists).ok("", { timeout: 60000 });
    } else {
      await t
        .click(
          Selector('button[class*="UserDropDown_toggle"]', { boundTestRun: t, speed: 0.01 }));
    }
  };

  // to use this method, test needs to be at '/companies' page.
  const deleteEmployee = async (t, employeeName) => {
    await t
      .click(Selector('div[class*="EmployeeInfo_info"]>div', { boundTestRun: t }).withText(employeeName))
      .expect(getLocation()).contains('/employees');

    await t
      .click(Selector('button[class*="DeleteButton"]', { boundTestRun: t }))
      .click(Selector('button', { boundTestRun: t }).withText(/I'm sure/i))
      .expect(getLocation()).contains('/scenarios');
  };

  const deleteSomething = async (t) => {
    return {};
  };

  const createNewCompany = async (t, company) => {
    await t
      .maximizeWindow()
      .click(Selector('button[class*="UserDropDown_toggle"]', { boundTestRun: t }))
      .click(Selector('button[class*="CompanyDropdown_toggle"]', { boundTestRun: t }))
      .click(Selector('div[class*="CompanyDropdown_menu"] input[placeholder="Search"]', { boundTestRun: t }))
      .typeText(Selector('div[class*="CompanyDropdown_menu"] input[placeholder="Search"]', { boundTestRun: t }), "New Company", { replace: true, paste: true })
      .click(Selector('a[class*="CompanyDropdown_new"]', { boundTestRun: t }))
      .expect(getLocation()).match(/.*\/companies\/new/, { timeout: 15000 });

    await t
      .typeText(Selector('input[name="companyName"]', { boundTestRun: t }), company.name, { replace: true })
      .typeText(Selector('input[name="location"]', { boundTestRun: t }), company.location, { replace: true })
      .click(Selector('[id="industrySectorId"]', { boundTestRun: t }))
      .pressKey('down down enter')
      .typeText(Selector('input[name="fundsRaised"]', { boundTestRun: t }), company.fundsRaised, { replace: true })
      .click(Selector('button', { boundTestRun: t }).withText(/Continue/i));

    if (await Selector('div[class*="HrisContainer_footer"] a', { boundTestRun: t }).withText(/Add manually/i, { timeout: 20000 }).visible) {
      await t
        .click(Selector('div[class*="HrisContainer_footer"] a', { boundTestRun: t }).withText(/Add manually/i));
    }

    await t
      .expect(getLocation()).match(/.*\/companies\/\d+\/onboard-employees/)
      .wait(3000);//page load time

    if (await Selector('button[class*="GoToDashboard"][disabled]', { boundTestRun: t }).exists) {
      await t
        .click(Selector('input[placeholder = "Department name"]', { boundTestRun: t }))
        .typeText(Selector('input[placeholder = "Department name"]', { boundTestRun: t }),
          "Accounting",
          { replace: true, paste: true })
        // .click(Selector('button[class*="CollapseContainer"]', { boundTestRun: t }).nth(0))
        .click(Selector('input[placeholder = "Full name"]', { boundTestRun: t }))
        .typeText(Selector('input[placeholder = "Full name"]', { boundTestRun: t }),
          "John Kline",
          { replace: true, paste: true })
        .click(Selector('input[placeholder = "Job title"]', { boundTestRun: t }))
        .typeText(Selector('input[placeholder = "Job title"]', { boundTestRun: t }),
          "Accounting",
          { replace: true, paste: true })
        .expect(Selector('button[class*="GoToDashboard"][disabled]', { boundTestRun: t }).exists).notOk();
    }

    await t
      .click(Selector('button[class*="GoToDashboard"]', { boundTestRun: t }))
      .expect(getLocation()).match(/.*\/scenarios|companies\/\d+/, { timeout: 20000 });

    if (await Selector('div[class*="WelcomeModal_modalDialog"]', { boundTestRun: t }).visible) {
      await t
        .click(Selector('div[class*="WelcomeModal_modalDialog"] button[class*="WelcomeModal_startBtn"]', { boundTestRun: t }));
    }
  };

  const deleteCompany = async (t) => {
    await t
      .click(Selector('button[class*="UserDropDown_toggle"]', { speed: 0.01 }, { boundTestRun: t }))
      .click(Selector('.dropdown-menu a', { boundTestRun: t }).withText(/Admin Console/))
      .expect(getLocation()).match(/.*\/companies\/[0-9]+\/edit/, { timeout: 30000 })
      .click(Selector('span[class*="DeleteButton"]', { boundTestRun: t }))
      .click(Selector('.modal-body button[class*="ConfirmPopup_confirmBtn"]', { boundTestRun: t }))
      .expect(getLocation()).match(/.*\/scenarios|companies\/[0-9]+/, { timeout: 60000 });
  };

  const deleteAllCompanies = async (t) => {
    await t
      .click(Selector('div[title="Test ProdPerfect"]', { boundTestRun: t }))
      .click(Selector('button.dropdown-toggle', { boundTestRun: t }).withText('Change Company'));

    let companiesCount = await Selector('div[class*="CompanyDropdown_companyName"]', { boundTestRun: t }).count;

    await t
      .click(Selector('div[title="Test ProdPerfect"]', { boundTestRun: t }));

    // delete company
    while (companiesCount > 1) {
      await t
        .click(Selector('div[title="Test ProdPerfect"]', { boundTestRun: t }))
        .click(Selector('.dropdown-menu a', { boundTestRun: t }).withText(/Company Settings/))
        .expect(getLocation()).match(/.*\/companies\/[0-9]+\/edit/, { timeout: 15000 })
        .click(Selector('button', { boundTestRun: t }).withText(/Delete/))
        .click(Selector('.modal-body button[class*="ConfirmPopup_confirmBtn"]', { boundTestRun: t }))
        .expect(getLocation()).match(/.*\/scenarios\/[0-9]+/, { timeout: 15000 });

      companiesCount = companiesCount - 1;
    }
  };

  const navigateToGeoStrategy = async (t, scenario = credentials.geoScenarioName) => {
    const currentScenarioName = await Selector('span[class*="ScenarioDropdown_scenarioName"]', { boundTestRun: t }).innerText;

    if (currentScenarioName !== scenario) {
      await t
        .click(
          Selector(
            'button[class*="ScenarioDropdown_toggle"] img', { boundTestRun: t }))
        .typeText(
          Selector('div[class*="ScenarioDropdown_menu"] input', { boundTestRun: t }), scenario, { replace: true })
        .click(
          Selector(
            'a[class*="ScenarioDropdown_item"] span', { boundTestRun: t }
          ).withText(scenario))
        .expect(getLocation()).match(/.*\/scenarios\/\d+/, { timeout: 60000 });
    }

    await t
      .click(
        Selector('a[class*="ScenarioDropdown_settings"]', { boundTestRun: t }))
      .expect(
        getLocation()).match(/.*\/scenarios\/\d+\/edit/, { timeout: 20000 })
      .click(
        Selector('div[class*="SideBar_title"]', { boundTestRun: t }).withText(/Geo Strategy/))
      .expect(
        Selector('div[class*="Section_header', { boundTestRun: t }).
          withText(/Geo Strategy/).exists
      ).ok();
  };

  const changeCashDisplay = async (t, cashDisplay = 'Base Salary') => {
    await t
      .click(
        Selector('div[class*="DashboardSettings_dropdown"] >button', { boundTestRun: t })
          .nth(0))
      .click(
        Selector('.dropdown-menu a', { boundTestRun: t })
          .withText(cashDisplay));
  };

  const changeEquityDisplay = async (t, equityDisplay = 'Number of Shares') => {
    await t
      .click(
        Selector('div[class*="DashboardSettings_dropdown"] >button', { boundTestRun: t })
          .nth(1))
      .click(
        Selector('.dropdown-menu a', { boundTestRun: t })
          .withText(equityDisplay));
  };

  const confirmCookies = async (t) => {
    if (await Selector('div[id*="cookie-confirmation"]', { boundTestRun: t }).visible) {
      await t.click(Selector('a', { boundTestRun: t })
        .withText(/Allow cookies/i));
    }
  };

  const createNewScenario = async (t,
    {
      employeeFile,
      name = 'Scenario',
      prepopulate = 'None (Start Fresh)',
      fundsRaised = '$10-25 million',
      fundingStage = 'Series A',
      outstandingShares = '50,000,000',
      optionPool = '7,500,000',
      equityType = 'Options',
      equityDisplay = 'Number of Shares',
      cashDisplay = 'Salary / OTE',
      benchmark = '2022Q1'
    }, useDefault = true, importEmployees = true) => {
    await t
      .click(
        Selector('button img[class*="ScenarioDropdown_menuIcon"]', { boundTestRun: t }))
      .click(
        Selector('div[class*="ScenarioDropdown_menu"] >a[href*=new]', { boundTestRun: t }))
      .expect(getLocation()).match(/.*\/companies\/\d+\/scenarios\/new/, { timeout: 20000 })
      .click(
        Selector('form[class*="ScenarioEntry_form"] input[id="name"]', { boundTestRun: t }))
      .typeText(
        Selector('form[class*="ScenarioEntry_form"] input[id="name"]', { boundTestRun: t }), name, { replace: true })
      .click(
        Selector('button[aria-label*="Pre-populate with data"]', { boundTestRun: t }))
      .click(
        Selector('.dropdown-menu button', { boundTestRun: t })
          .withText(prepopulate))
      .click(Selector('button[aria-label*="Total Funds Raised"]', { boundTestRun: t }))
      .click(
        Selector('.dropdown-menu button', { boundTestRun: t })
          .withText(fundsRaised))
      .click(
        Selector('button[aria-label*="Funding Stage"]', { boundTestRun: t }))
      .click(
        Selector('.dropdown-menu button', { boundTestRun: t })
          .withText(fundingStage));

    if (!useDefault) {
      await t
        .typeText(
          Selector('input[name="outstandingShares"]', { boundTestRun: t }),
          outstandingShares, { replace: true })
        .typeText(
          Selector('input[name="optionPool"]', { boundTestRun: t }),
          optionPool, { replace: true })
        .click(
          Selector('button[aria-label*="Equity Type"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(equityType))
        .click(
          Selector('button[aria-label*="Default Equity Display"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(equityDisplay))
        .click(
          Selector('button[aria-label*="Default Cash Display"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(cashDisplay));
    }

    if (importEmployees) {
      await t
        .click(
          Selector('span[class*="FileInput_uploadBtn"]', { boundTestRun: t }).withText(/Select file/))
        .setFilesToUpload('input[id="importFile"]', employeeFile);
    }

    await t
      .click(
        Selector('button[aria-label*="Benchmark"]', { boundTestRun: t }))
      .click(
        Selector('.dropdown-menu button', { boundTestRun: t })
          .withText(benchmark))
      .click(Selector('button', { boundTestRun: t }).withText(/Save/))
      .expect(getLocation()).match(/.*\/scenarios\/\d+/, { timeout: 20000 });
  };

  /**
   * @summary creates "User Permissions ProdPerf" scenario (if not present) and 
   * and sends invite to "opencomp-team-leader@prodp.msdc.co"
   */
  const setupTeamLeaderAccountDependencies = async (t) => {
    const scenarioName = 'User Permissions ProdPerf';
    const employeeName = 'Xander White';

    await login(t, credentials.username1, credentials.password1);
    await confirmCookies(t);

    await t
      .click(
        Selector('button img[class*="ScenarioDropdown_menuIcon"]', { boundTestRun: t }))
      .typeText(
        Selector('input[class*="SearchBox_input"]', { boundTestRun: t }), scenarioName, { replace: true });

    if (
      !(await Selector('span[class*="ScenarioDropdown_itemScenarioName"]').withText(scenarioName).exists)
    ) {
      await t
        .click(
          Selector('div[class*="ScenarioDropdown_menu"] >a[href*=new]', { boundTestRun: t }))
        .expect(getLocation()).match(/.*\/companies\/\d+\/scenarios\/new/, { timeout: 20000 })
        .typeText(
          Selector('form[class*="ScenarioEntry_form"] input[id="name"]', { boundTestRun: t }), scenarioName, { replace: true, paste: true })
        .click(Selector('button[aria-label*="Total Funds Raised"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText('$10-25 million'))
        .click(
          Selector('button[aria-label*="Funding Stage"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(/Series A/))
        .typeText(
          Selector('input[name="outstandingShares"]', { boundTestRun: t }),
          '50,000,000', { replace: true })
        .typeText(
          Selector('input[name="optionPool"]', { boundTestRun: t }),
          '7,500,000', { replace: true })
        .click(
          Selector('button[aria-label*="Equity Type"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(/Options/))
        .click(
          Selector('button[aria-label*="Default Equity Display"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(/Number of Shares/))
        .click(
          Selector('button[aria-label*="Default Cash Display"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(/Salary \/ OTE/))
        .click(
          Selector('span[class*="FileInput_uploadBtn"]', { boundTestRun: t }).withText(/Select file/))
        .setFilesToUpload('input[id="importFile"]', '../Files/7785-User-Permissions-ProdPerf.csv')
        .click(
          Selector('button[aria-label*="Benchmark"]', { boundTestRun: t }))
        .click(
          Selector('.dropdown-menu button', { boundTestRun: t })
            .withText(/2022Q1/))
        .click(Selector('button', { boundTestRun: t }).withText(/Save/))
        .expect(getLocation()).match(/.*\/scenarios\/\d+/, { timeout: 20000 });

      await t
        .click(
          Selector('h3[class*="EmployeeGroupName_name"]', { boundTestRun: t })
            .withText(/Product & Engineering/).parent(3).prevSibling())
        .click(Selector('div[class*="name_name"] div[class*="cell_main"]', { boundTestRun: t }).withText(employeeName))
        .click(
          Selector('div[class*="EmployeeFields_collapseContainer"] div[class*="CollapseContainer_headerContent"]', { boundTestRun: t })
            .withText(/Employee Information/)
            .prevSibling())
        .typeText(
          Selector('div[class*="EmployeeFields_collapseContent"] label', { boundTestRun: t }).withText(/Primary Email/).parent(1).find('input'), credentials.teamLeader, { replace: true })
        .click(Selector('button', { boundTestRun: t }).withText(/Save/))
        .click(Selector('button[aria-label="Close"]', { boundTestRun: t }));

      // invite user
      await t
        .click(Selector('div[class*="UserAvatar"]', { boundTestRun: t }))
        .click(Selector('div[class*="UserDropDown_settings"] a', { boundTestRun: t }).withText(/Admin Console/))
        .expect(getLocation()).match(/.*\/companies\/\d+\/edit/, { timeout: 20000 })
        .click(
          Selector('a[class*="SideBar_item"] div', { boundTestRun: t }).withText(/User Permissions/))
        .click(Selector('button').withText(/Invite user/))
        .typeText(Selector('.modal-body input[name="email"]', { boundTestRun: t }), credentials.teamLeader, { replace: true })
        .click(
          Selector('.modal-body button[class*="dropdown-toggle"]', { boundTestRun: t }))
        .click(Selector('.modal-body .dropdown-menu button', { boundTestRun: t }).withText(/Team Leader/))
        .click(Selector('.modal-body button', { boundTestRun: t }).withText(/Add to scenario/))
        .click(Selector('.modal-body div[class*="ScenariosField_scenarioRow"] button', { boundTestRun: t }))
        .click(Selector('.modal-body .dropdown-menu button', { boundTestRun: t }).withText(scenarioName))
        .click(Selector('.modal-body button', { boundTestRun: t }).withText(/Search for employee/))
        .typeText(
          Selector('.modal-body div[class*="EmployeeMatchSuggest_searchBox"] input[placeholder="Search for employee"]', { boundTestRun: t }), employeeName, { replace: true })
        .click(
          Selector('.modal-body div[class*="EmployeeSelect_input"] .dropdown-menu button', { boundTestRun: t }).nth(0))
        .click(Selector('.modal-body button', { boundTestRun: t }).withText(/Invite/));
      if (await Selector("button[class*='cancelButton']").exists)//if close button exists
      {
        await t
          .click(Selector('button[class*="cancelButton"]'))
          .expect(Selector('div[class*="modal-content"]').exists).notOk();
      }
      await t
        .expect(Selector('div[role="alert"]', { boundTestRun: t }).visible).ok("", { timeout: 20000 })
        .hover(
          Selector('div[class*="UserBasicInfo_name"]', { boundTestRun: t }).withText(/Team Leader/))
        .click(Selector('button', { boundTestRun: t }).withText(/Edit user/).filterVisible())
        .expect(Selector('div[class*="Profile_name"]', { boundTestRun: t }).withText(/Team Leader/).exists).ok()
        .expect(Selector('input[name="email"]', { boundTestRun: t }).value).eql(credentials.teamLeader)
        .expect(
          Selector('div', { boundTestRun: t })
            .withText(/User Permissions ProdPerf/)
            .parent(1).find('button').withText(/Has Access/).exists
        ).ok();
    }

    // get company name
    await t
      .click(Selector('div[class*="UserAvatar"]', { boundTestRun: t }))
      .click(
        Selector('div[class*="UserDropDown_settings"] a', { boundTestRun: t })
          .withText(/Admin Console/))
      .expect(
        getLocation()).match(/.*\/companies\/\d+\/edit/, { timeout: 20000 });

    const companyName = await Selector('input[name="companyName"]', { boundTestRun: t }).value;

    await logout(t);

    return companyName;
  };

  const selectScenario = async (t, scenarioName) => {
    await t
      .click(
        Selector('button img[class*="ScenarioDropdown_menuIcon"]', { boundTestRun: t }))
      .typeText(
        Selector('input[class*="SearchBox_input"]', { boundTestRun: t }), scenarioName, { replace: true })
      .click(
        Selector('span[class*="ScenarioDropdown_itemScenarioName"]', { boundTestRun: t })
          .withText(scenarioName));
  };

  const closeChatPopup = async (t) => {
    if (
      await Selector('#hubspot-messages-iframe-container', { boundTestRun: t, timeout: 60000 }).exists
    ) {
      await t
        // .switchToIframe(Selector('#drift-frame-chat .drift-frame-chat', { timeout: 60000 }))
        .switchToIframe(Selector('#hubspot-messages-iframe-container iframe', { boundTestRun: t, timeout: 30000 }))
        .click(Selector('span[data-test-id="chat-widget-launcher"] button[aria-label="Close live chat"]', { boundTestRun: t }))
        .switchToMainWindow();
    }
  };

  const createGenScenario = async (t, testnumber, employeeFile, importEmployees = true) => {

    // delete data build up // delete if more than 1 scenario is already present
    const checkDataBuildUp = async (t, testnumber) => {
      await t
        .click(Selector('button img[class*="ScenarioDropdown_menuIcon"]', { boundTestRun: t }));
      const buildupName = `Scenario ${testnumber}`;
      const scenarioNameRegex = new RegExp(buildupName, 'i');
      const scenarioCount = await Selector('div[class*="ScenarioDropdown_items"] a span', { boundTestRun: t }).withText(scenarioNameRegex).count;

      if (scenarioCount > 1) {
        for (let i = 0; i < scenarioCount - 1; i++) {
          await t
            .click(Selector('div[class*="ScenarioDropdown_container"]', { boundTestRun: t }), { speed: 0.01 })
            .click(Selector('div[class*="ScenarioDropdown_container"] input', { boundTestRun: t }))
            .typeText(Selector('div[class*="ScenarioDropdown_container"] input', { boundTestRun: t }), buildupName, { replace: true, speed: 0.1 })
            .click(Selector('div[class*="ScenarioDropdown_items"] a span', { boundTestRun: t }).withText(scenarioNameRegex))
            .click(Selector("a[class*='ScenarioDropdown_settings']", { boundTestRun: t }))
            .click(Selector('button[class*="DeleteButton"]', { boundTestRun: t }))
            .click(Selector('button', { boundTestRun: t }).withText(/I'm sure/i))
            .expect(getLocation()).match(/scenarios\/\d+/);
        }
      }
    };

    await checkDataBuildUp(t, testnumber);
    const currenttime = moment().utcOffset("+05:30").format("HH:mm:ss");
    const scenarioName = `Scenario ${testnumber} - ${currenttime}`;

    const prepopulate = 'None (Start Fresh)';
    const fundsRaised = '$10-25 million';
    const fundingStage = 'Series A';
    const benchmark = '2022Q1';
    await t
      .click(Selector('button img[class*="ScenarioDropdown_menuIcon"]', { boundTestRun: t }))
      .click(Selector('div[class*="ScenarioDropdown_menu"] >a[href*=new]', { boundTestRun: t }))
      .expect(getLocation()).match(/.*\/companies\/\d+\/scenarios\/new/, { timeout: 20000 })
      .click(Selector('form[class*="ScenarioEntry_form"] input[id="name"]', { boundTestRun: t }))
      .typeText(Selector('form[class*="ScenarioEntry_form"] input[id="name"]', { boundTestRun: t }), scenarioName, { replace: true })
      .click(Selector('button[aria-label*="Pre-populate with data"]', { boundTestRun: t }))
      .click(Selector('.dropdown-menu button', { boundTestRun: t }).withText(prepopulate))
      .click(Selector('button[aria-label*="Total Funds Raised"]', { boundTestRun: t }))
      .click(Selector('.dropdown-menu button', { boundTestRun: t }).withText(fundsRaised))
      .click(Selector('button[aria-label*="Funding Stage"]', { boundTestRun: t }))
      .click(Selector('.dropdown-menu button', { boundTestRun: t }).withText(fundingStage));

    if (importEmployees) {
      await t
        .click(Selector('span[class*="FileInput_uploadBtn"]', { boundTestRun: t }).withText(/Select file/))
        .setFilesToUpload('input[id="importFile"]', employeeFile);
    }

    await t
      .click(Selector('button[aria-label*="Benchmark"]', { boundTestRun: t }))
      .click(Selector('.dropdown-menu button', { boundTestRun: t }).withText(benchmark))
      .click(Selector('button', { boundTestRun: t }).withText(/Save/))
      .expect(getLocation()).match(/.*\/scenarios\/\d+/, { timeout: 20000 });
    return scenarioName;
  };

  const deleteGenScenario = async (t, scenarioName) => {
    await t
      .click(Selector('div[class*="ScenarioDropdown_container"]', { boundTestRun: t }), { speed: 0.01 })
      .click(Selector('div[class*="ScenarioDropdown_container"] input', { boundTestRun: t }))
      .typeText(Selector('div[class*="ScenarioDropdown_container"] input', { boundTestRun: t }), scenarioName, { replace: true, speed: 0.1 })
      .click(Selector('div[class*="ScenarioDropdown_items"] a span', { boundTestRun: t }).withText(scenarioName))
      .click(Selector("a[class*='ScenarioDropdown_settings']", { boundTestRun: t }))
      .click(Selector('button[class*="DeleteButton"]', { boundTestRun: t }))
      .click(Selector('button', { boundTestRun: t }).withText(/I'm sure/i))
      .expect(getLocation()).match(/scenarios\/\d+/)
      .click(Selector('div[class*="ScenarioDropdown_container"]', { boundTestRun: t }), { speed: 0.01 })
      .expect(Selector('div[class*="ScenarioDropdown_items"] a span', { boundTestRun: t }).withText(scenarioName).exist).notOk();
  };

  // Select all options except excluded options
  const updateExcludeEmployeesSetting = async (t, optionsToExclude = ['International']) => {
    await t
      .click(Selector('a[class*="ScenarioDropdown_settings"]', { boundTestRun: t }))
      .click(Selector('div[class*="ExcludeEmployees_dropdown"] button', { boundTestRun: t }));

    const excludeEmployeeOptionsCount = await Selector('a[class*="RawMultiSelect_option"]', { boundTestRun: t }).count;

    for (let index = 0; index < excludeEmployeeOptionsCount; index++) {
      const currentOption = Selector('a[class*="RawMultiSelect_option"]', { boundTestRun: t }).nth(index);
      const elementClassNames = await currentOption.getAttribute('class');
      const currentOptionText = (await currentOption.innerText).trim();

      if (optionsToExclude.includes(currentOptionText)) { continue; }

      if ((elementClassNames.indexOf('RawMultiSelect_selected') < 0)) {
        await t.click(currentOption);
      }
    }

    await t
      .click(Selector('div[class*="ExcludeEmployees_dropdown"] button', { boundTestRun: t }))
      .click(Selector('div[class*="SettingComponent_body"] form button[class*="EditForm_saveBtn"]', { boundTestRun: t }).withText(/Save/))
      .expect(getLocation()).match(/.*\/scenarios\/\d+/);
  };

  return {
    login,
    logout,
    deleteEmployee,
    deleteSomething,
    deleteCompany,
    deleteAllCompanies,
    createNewCompany,
    changeCompany,
    navigateToGeoStrategy,
    changeCashDisplay,
    changeEquityDisplay,
    setupTeamLeaderAccountDependencies,
    confirmCookies,
    createNewScenario,
    selectScenario,
    closeChatPopup,
    createGenScenario,
    deleteGenScenario,
    updateExcludeEmployeesSetting
  };
};

module.exports.setupCustomUtilities = setupCustomUtilities;
