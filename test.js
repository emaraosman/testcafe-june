const { Selector } = require("testcafe");
const {
  setupFixture,
  setTestContext,
  wrapTest,
} = require("./utilities/main_utils");
const { setupCustomUtilities } = require("./utilities/opencomp_utils");
const { credentials } = require("./utilities/credentials");
setupFixture();
console.log('Mike Test Comment 1');
const meta = {
  // id: "6fac2d3a-f34b-4328-a13c-00edc5ee1c6e",
  id: "",
  steps: [
    'Log in as basic user',
    'Click on Form-Select dropdown from top navbar',
    'ASSERTION : Assert the scenario has Total funds raised as $10-25 million',
    'Click on Equity Details tab',
    'ASSERTION : Assert that scenario has Total Shares Outstanding: 50,000,000',
    'ASSERTION : Assert the scenario has Employee Stock Pool Size: 7,500,000',
    'Click on close button',
    'ASSERTION : Assert the /scenario detail url path',
    'Click on the Engineering department',
    'ASSERTION : base salary should have values "$121,600"',
    'ASSERTION : Equity should have values "24,993"',
    'Click on employee to edit the employee level',
    'Change Level 2 to Level 3',
    'ASSERTION : Assert the level',
    'Save details',
    'ASSERTION : base salary should have values "$144,400"',
    'ASSERTION : Equity should have values "29,310"',
    'Click on edit Department',
    'Click on the forward arrow on the “Base Salary” target column',
    'Click on the forward arrow on the “Total Cash” target column',
    'Click on the forward arrow on the “Equity” target column',
    'Click on Submit Button',
    'ASSERTION : base salary should have values "$150,100"',
    'ASSERTION : Equity should have values "34,795"',
    'Click on employee to edit the employee level',
    'Change Level 3 to Level 2',
    'ASSERTION : Assert the level',
    'Save details',
    'Click on edit Department',
    'Click on the backward arrow on the “Base Salary” target column',
    'Click on the backward arrow on the “Total Cash” target column',
    'Click on the backward arrow on the “Equity” target column',
    'Click on Submit Button',
    'ASSERTION : Assert the level',
    'ASSERTION : Assert the Target 50% in the title for column next to base salary',
    'ASSERTION : Assert the Target 50% in the title for column next to equity',
    'ASSERTION : base salary should have values "$121,600"',
    'ASSERTION : Equity should have values "24,993"',
    'Click on edit button',
    'Click on OptionMenu',
    'Click on Full Screen',
    'ASSERTION : Assert again for "Base salary" value "$121,600"',
    'ASSERTION : Assert again that "Total Cash" value "$122,550"',
    'ASSERTION : Assert again for "Equity" value "24,993"',
  ],
  nodes: [
    '57822ff56b952ccd2436a612bc5791df', '57822ff56b952ccd2436a612bc5791df', '57822ff56b952ccd2436a612bc5791df', 'e11e1dc7f263cb0442d2701d90afd162', 'e11e1dc7f263cb0442d2701d90afd162', '46b5c6b5d97aad09679b90092c9c4f70', '46b5c6b5d97aad09679b90092c9c4f70', '46b5c6b5d97aad09679b90092c9c4f70',
    '7f1cb2deb2fca3b42e5bb6c4324afa97', '57822ff56b952ccd2436a612bc5791df', '57822ff56b952ccd2436a612bc5791df', '57822ff56b952ccd2436a612bc5791df', '6787b2e9470b9dfb97bb6d3261287946', '6787b2e9470b9dfb97bb6d3261287946', '46b5c6b5d97aad09679b90092c9c4f70', '46b5c6b5d97aad09679b90092c9c4f70', '46b5c6b5d97aad09679b90092c9c4f70', '57822ff56b952ccd2436a612bc5791df', '57822ff56b952ccd2436a612bc5791df', '57822ff56b952ccd2436a612bc5791df', 'e11e1dc7f263cb0442d2701d90afd162'
  ],
  proposedTestcaseIds: ["faf4db914aa5aec56440038470af2b78", "da66cfca01cc5ab75aedb092cc76547e"],
};
wrapTest(meta)(
  "test_01_change_level_and_target_faf4db914aa5aec56440038470af2b78",
  async (t) => {
    const { getLocation } =
      setTestContext(t);
    const { login, createGenScenario, deleteGenScenario } = setupCustomUtilities(t, getLocation);
    await login(t, credentials.username1, credentials.password1);
    //cookie popup
    if (await Selector('div[id*="cookie-confirmation-button"] a', { timeout: 90000 }).withText('Allow cookies').visible) {
      await t
        .click(Selector('div[id*="cookie-confirmation-button"] a').withText('Allow cookies'))
        .expect(Selector('div[id*="cookie-confirmation-button"] a').withText('Allow cookies').visible).notOk();
    }
    await t
      .maximizeWindow()
      .click(Selector('button[class*="UserDropDown_toggle"]'), { speed: 0.01 })
      .click(Selector('button[class*="CompanyDropdown_toggle"]'))
      .click(
        Selector('div[class*="CompanyDropdown_companyName"]').withText(/ProdPerfect Analyst Company/i)
      )
      .expect(
        Selector('div[class*="ScenarioDropdown_container"]').visible
      ).ok("", { timeout: 60000 }) //assertion
      // switch to baseline scenario
      .click(Selector('div[class*="ScenarioDropdown_container"]'), { speed: 0.01 });
    const scenarioName = await createGenScenario(t, "01", './Files/Test_01.csv', true);
    //check scenario data values
    await t
      .click(Selector('a[class*="ScenarioDropdown_settings"]'))
      .click(Selector('div[class*="SideBar_sideBar"] a[href*="scenarios"]').nth(0))
      .click(Selector('div#cutId'))
      .click(Selector('div#cutId [class*="SingleSelect"] button>span').withText(/10-25 million/i))
      .click(Selector('button').withText(/Save/i))
      .click(Selector('a[class*="ScenarioDropdown_settings"]'))
      .click(Selector('div[class*="SideBar_sideBar"] a[href*="scenarios"]').nth(0))
      .expect(
        Selector('div#cutId>button>span').withText(/10-25 million/i).exists
      ).ok()
      .click(
        Selector('div[class*="SideBar_sideBar"] a[href*="scenarios"]').nth(1));
    const outstandingShares = await Selector('input#outstandingShares').getAttribute('value');
    const stockPool = await Selector('input#optionPool').getAttribute('value');
    if (outstandingShares != '50,000,000' || stockPool != '7,500,000') {
      await t
        .click(Selector('input#outstandingShares'))
        .typeText(Selector('input#outstandingShares'), '50,000,000', { replace: true })
        .click(Selector('input#optionPool'))
        .typeText(Selector('input#optionPool'), '7,500,000', { replace: true })
        .expect(
          Selector('input#outstandingShares').withAttribute('value', '50,000,000').exists
        ).ok()
        .expect(
          Selector('input#optionPool').withAttribute('value', '7,500,000').exists
        ).ok()
        .click(
          Selector('button[class*="EditForm_saveBtn"]')
            .withText(/Save/i));
    }
    else {
      await t
        .expect(
          Selector('input#outstandingShares').withAttribute('value', '50,000,000').exists
        ).ok()
        .expect(
          Selector('input#optionPool').withAttribute('value', '7,500,000').exists
        ).ok()
        .click(Selector('span').withText(/Back/i));
      if (! await Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i).visible) {
        await t
          .click(Selector('span').withText(/Back/i));
      }
    }
    await t
      .expect(Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i).visible).ok()
      .click(
        Selector('h3[class*="EmployeeGroupName_name"]')
          .withText(/Engineering/i)
          .parent('div[class*="CollapseContainer_headerContent"]')
          .sibling('div[class*="CollapseContainer_collapseBtn"]')
          .find('img'))//open engineering department
      .expect(
        Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i)
          .parent('div[class*="CollapseContainer_header"]')
          .sibling('div[class*="Collapse_collapse"]')
          .find('div[class*="name_name" i]>div[class*="cell_main"]')
          .withText(/Jack Ryan/i).exists).ok({ timeout: 50000 });
    if (!await Selector('span[class*="NavigationMenu_label"]').withText(/Market Analysis/i).exists) {
      await t
        .click(Selector('span[class*="NavigationMenu_label"]').withText(/Market/i))
        .expect(Selector('div[class*="StickyHeader_title"]').withText(/Market Analysis/i).exists).ok();
    }
    await t
      .expect(Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
        .parent('div[class*="summary_employeeWrapper"]')
        .find('div[class*="compensation_displayValue" i] span span').nth(0).innerText).match(/^\$\d+(,\d+)*$/)
      .expect(Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
        .parent('div[class*="summary_employeeWrapper"]')
        .find('div[class*="compensation_displayValue" i] span span').nth(2).innerText).match(/^\d+(,\d+)*$/);
    await t
      .setTestSpeed(0.3)
      .click(Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i)
        .parent('div[class*="CollapseContainer_header"]')
        .sibling('div[class*="Collapse_collapse"]')
        .find('div[class*="name_name" i]>div[class*="cell_main"]')
        .withText(/Jack Ryan/i))
      .click(Selector('button[class*="EmployeeLevel_option"]').withText(/3/i))
      .expect(Selector('button[class*="EmployeeLevel_selected"]').innerText).eql('L3', { timeout: 20000 })
      .click(Selector('div#useMarketData'))
      .click(Selector('div#useMarketData button>span').withText(/Use Market Data/i))
      .click(Selector('div[class*="ActionsHeader_container"] button').withText(/Save/i))
      .click(Selector('button[class*="EmployeeShelf_closeBtn"]'))
      .expect(Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
        .parent('div[class*="summary_employeeWrapper"]')
        .find('div[class*="compensation_displayValue" i] span span').nth(0).innerText).match(/^\$\d+(,\d+)*$/)
      .expect(Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
        .parent('div[class*="summary_employeeWrapper"]')
        .find('div[class*="compensation_displayValue" i] span span').nth(2).innerText).match(/^\d+(,\d+)*$/)
      .hover(Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i))
      .click(Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i)
        .parent('div[class*="Department_deptInfo" i]')
        .find('img[class*="EditDepartment"]'))
      .click(Selector('input[id="salary"]').nextSibling('button'))
      .click(Selector('input[id="totalCash"]').nextSibling('button'))
      .click(Selector('input[id="equity"] ').nextSibling('button'))
      .click(Selector('button[class*="DepartmentForm_submitBtn"]'));
    if (
      !(await Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i)
        .parent('div[class*="FlexRow_row"]')
        .parent('div')
        .find('div[class*="compPercentile"]').withText(/55th/i).visible)
    ) {
      await t.eval(() => location.reload(true));
      await t
        .expect(
          Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i)
            .parent('div[class*="FlexRow_row"]')
            .parent('div')
            .find('div[class*="compPercentile"]').withText(/55th/i).visible
        ).ok("", { timeout: 20000 })
        .click(
          Selector('h3[class*="EmployeeGroupName_name"]')
            .withText(/Engineering/i)
            .parent('div[class*="CollapseContainer_headerContent"]')
            .sibling('div[class*="CollapseContainer_collapseBtn"]')
            .find('img'));//open engineering department
    }
    await t
      .expect(Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
        .parent('div[class*="summary_employeeWrapper"]')
        .find('div[class*="compensation_displayValue" i] span span').nth(0).innerText).match(/^\$\d+(,\d+)*$/)
      .expect(Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
        .parent('div[class*="summary_employeeWrapper"]')
        .find('div[class*="compensation_displayValue" i] span span').nth(2).innerText).match(/^\d+(,\d+)*$/)
      .click(Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i)
        .parent('div[class*="CollapseContainer_header"]')
        .sibling('div[class*="Collapse_collapse"]')
        .find('div[class*="name_name" i]>div[class*="cell_main"]')
        .withText(/Jack Ryan/i))
      .click(
        Selector('button[class*="EmployeeLevel_option"]').withText(/2/i))
      .expect(
        Selector('button[class*="EmployeeLevel_selected"]').innerText
      ).eql('L2', { timeout: 20000 })
      .click(
        Selector('div[class*="EmployeeShelf"] div[class*="ActionsHeader"] button').withText(/Save/i))
      .click(Selector('button[class*="EmployeeShelf_closeBtn"]'))
      .hover(
        Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i))
      .click(
        Selector('h3[class*="EmployeeGroupName_name"]')
          .withText(/Engineering/i)
          .parent('div[class*="Department_deptInfo" i]')
          .find('img[class*="EditDepartment"]'))
      .click(Selector('input[id="salary"]').prevSibling('button'))
      .click(Selector('input[id="totalCash"]').prevSibling('button'))
      .click(Selector('input[id="equity"] ').prevSibling('button'))
      .click(Selector('button[class*="DepartmentForm_submitBtn"]'));
    await t
      .expect(
        Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
          .parent('div[class*="summary_employeeWrapper"]')
          .find('div[class*="level_level" i] span').innerText
      ).eql('Level 2', { timeout: 20000 })
      .expect(
        Selector('div[class*="PerformanceValue_mid"]').nth(-2).innerText
      ).match(/^5\d?th$/, { timeout: 20000 })
      .expect(
        Selector('div[class*="PerformanceValue_mid"]').nth(-1).innerText
      ).match(/^5\d?th$/, { timeout: 20000 })
      .expect(
        Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
          .parent('div[class*="summary_employeeWrapper"]')
          .find('div[class*="compensation_displayValue" i] span span').nth(0).innerText
      ).match(/^\$\d+(,\d+)*$/)
      .expect(
        Selector('div[class*="name_name" i]>div[class*="cell_main"]').withText(/Jack Ryan/)
          .parent('div[class*="summary_employeeWrapper"]')
          .find('div[class*="compensation_displayValue" i] span span').nth(2).innerText
      ).match(/^\d+(,\d+)$/)
      .click(
        Selector('h3[class*="EmployeeGroupName_name"]').withText(/Engineering/i)
          .parent('div[class*="CollapseContainer_header"]')
          .sibling('div[class*="Collapse_collapse"]')
          .find('div[class*="name_name" i]>div[class*="cell_main"]')
          .withText(/Jack Ryan/i)
      )
      .click(Selector('[class*="ContextMenu_dropdown"] button[class*="dropdown-toggle btn" i]  img'))
      .click(Selector('span').withText(/Full Screen/i))
      .expect(
        Selector('text[class*="recharts-text PerformanceValue_mid" i] tspan').nth(0).textContent
      ).match(/^\$\d+(,\d+)*$/, { timeout: 20000 })
      .expect(
        Selector('text[class*="recharts-text PerformanceValue_mid" i] tspan').nth(1).textContent
      ).match(/^\$\d+(,\d+)*$/, { timeout: 20000 })
      .expect(
        Selector('text[class*="recharts-text PerformanceValue_mid" i] tspan').nth(2).textContent
      ).match(/^\d+(,\d+)$/, { timeout: 20000 });
    await deleteGenScenario(t, scenarioName);
    
  }
);