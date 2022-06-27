const { Selector } = require("testcafe");
const { setupFixture, setTestContext, wrapTest, } = require("./utilities/main_utils");
const { setupCustomUtilities } = require("./utilities/opencomp_utils");
const { credentials } = require("./utilities/credentials");

const meta = {
  id: "660e7170-0ae3-11ec-9a03-0242ac130003",
  steps: [
    'Login',
		'Create a new scenario (name: "Scenario {test_number} - (HH:mm:ss)")',
		'Set Total Funds to "$10-25 million" ,Funding Stage to "Series A",BenchMark as "2022Q1"',
		'Import 51 employees file',
		'Click save',
    'ASSERTIONS: assert url',
    'ASSERTION: "Upgrade" button exists in banner',
    'ASSERTION: Upgrade on navbar exists',
    'Click "Upgrade" on navbar',
    'Click "Learn More" link',
    'ASSERTION: url matches "\/companies\/[0-9]+\/upgrade/"',
    'ASSERTION: "Team Plan" exists',
    'ASSERTION: "Your Current Plan" exists',
    'ASSERTION: selected dropdown value in Professional plan is "75 employees $12,600".',
    'Click "Purchase" under Professional Plan',
    'ASSERTION: url matches "/https:\/\/checkout.stripe.com\/pay\/"',
    'Fill card details',
    'Click "Subscribe"',
    'ASSERTION: url matches https://app.opencomp.co/scenarios/{scenario id}?action=subscribe',
    'ASSERTION: banner text is not displayed',
    'ASSERTION: "Hey there {first name}! Congrats on upgrading your subscription! Would you like to schedule a meeting with our Customer Success Team to learn more?" exists in pop up window',
    'Close pop up',
    'Click "Diversity, Equity & inclusion" tab',
    'ASSERTION : Assert for the page title : Diversity, Equity & Inclusion',
    'Click "By Gender" dropdown',
    'Select "By Ethnicity" option',
    'ASSERTION : Assert for any Ethnicity text adjacent to the chart',
    'ASSERTION : Assert for Employee group stats',
    'Delete scenario',
		'Logout'

  ],
  nodes: [
    'a0fb4808ecfc736599f5b0731d11e952', 'c0f91efccc1935f6abe013c33b9452b3', 'a0fb4808ecfc736599f5b0731d11e952', 'a0fb4808ecfc736599f5b0731d11e952', 'c0f91efccc1935f6abe013c33b9452b3', 'a0fb4808ecfc736599f5b0731d11e952', '5a4f08c221810ed1fd8dd1997b084631', '6df4b7b71d4fc91d88ac7790c116f7c8', '5a4f08c221810ed1fd8dd1997b084631', 'a2e08752de59d2f775291c476d3e370f', '9792e67715d918d9b27956e9d6d76c11', '9792e67715d918d9b27956e9d6d76c11', '714adc404cc78e8b72f70b69a2f80fcd', 'da0729433d6c07a064ade81c5957792c', '9792e67715d918d9b27956e9d6d76c11', '9792e67715d918d9b27956e9d6d76c11', '9792e67715d918d9b27956e9d6d76c11', '714adc404cc78e8b72f70b69a2f80fcd', 'da0729433d6c07a064ade81c5957792c', '9792e67715d918d9b27956e9d6d76c11', '9792e67715d918d9b27956e9d6d76c11', '9792e67715d918d9b27956e9d6d76c11'
  ],
  proposedTestcaseIds: ['6f7636853dd93cac79f63e4f2b44b5ca', 'c3a6227a3465391971fe3d1f40d86109'],
};

  async (t) => {
    const { getLocation } = setTestContext(t);
    const { login, changeCompany, confirmCookies, logout, createGenScenario, deleteGenScenario} = setupCustomUtilities(t, getLocation);
    
    await login(t, credentials.username1, credentials.password1);
    await confirmCookies(t);

    const ethnicities = [
      "None Specified",
      "Hispanic / Latinx",
      "Southeast Asian",
      "White",
      "East Asian",
      "African-American / Black / African",
      "Two or more groups",
      "Native American / Alaska Native / First Nations"
    ];
    const eth = ethnicities.toString().split(/[,/]/).join("|");
    var regex = new RegExp(eth, 'g');

    await changeCompany(t, 'ProdPerfect Analyst Company');
		const scenarioName = await createGenScenario(t,"12",'./Files/51-employees-in-department.csv');

    await t
      .expect(getLocation()).match(/.*\/scenarios\/[0-9]+/, { timeout: 30000 });

    if (await Selector('nav button').withText(/Upgrade/).exists) {
      await t
        .expect(Selector('div[class*="Banner_buttonGroup"] button').withText(/Upgrade/).exists).ok()
        .expect(Selector('nav button').withText(/Upgrade/).visible).ok()
        .click(Selector('nav button').withText(/Upgrade/))
        .expect(getLocation()).match(/.*\/companies\/[0-9]+\/upgrade/, { timeout: 30000 })
        .expect(Selector('div').withText(/Team Plan/).exists).ok()
        .expect(Selector('div').withText(/Professional Plan/).parent().sibling('div[class*="Purchase_purchaseWrapper"]').find('span[class*="Purchase_size"]').innerText).eql('75 employees')
        .expect(Selector('div').withText(/Professional Plan/).parent().sibling('div[class*="Purchase_purchaseWrapper"]').find('span[class*="Purchase_price"]').innerText).eql('$12,600')
        .click(Selector('div').withText(/Professional Plan/).parent().sibling('div[class*="Purchase_purchaseWrapper"]').find('button').withText(/Purchase/))
        .expect(getLocation()).match(/https:\/\/checkout.stripe.com\/pay\//, { timeout: 50000 });

      await t
        .expect(Selector('input[name="cardNumber"]').exists).ok("", { timeout: 30000 })
        .typeText(Selector('input[name="cardNumber"]'), '4242424242424242', { replace: true })
        .typeText(Selector('input[name="cardExpiry"]'), '1222', { replace: true })
        .typeText(Selector('input[name="cardCvc"]'), '564', { replace: true })
        .typeText(Selector('input[name="billingName"]'), 'Test Prodperfect', { replace: true })
        .click(Selector('select[name="billingCountry"]'))
        .click(Selector('select[name="billingCountry"] option').withText(/United States/))
        .typeText(Selector('input[name="billingPostalCode"]'), '94108', { replace: true })
        .click(Selector('button[data-testid="hosted-payment-submit-button"]'))
        .expect(getLocation()).match(/.*\/scenarios\/[0-9]+\?(product_id=[0-9]+\&)?(action=subscribe)/, { timeout: 30000 })
        .expect(Selector('div[class*="Banner_textGroup"] p').withText(/Your company's baseline scenario is limited to 50 employees. Upgrade to view all. /).exists).notOk('', { timeout: 30000 })
        .expect(Selector('nav button').withText(/Upgrade/).exists).notOk();

      let popupSelector = Selector('.drift-widget-power', { timeout: 60000 });
      let popupExists = await popupSelector.exists;

      if (popupExists) {
        await t
          .switchToIframe(Selector('.drift-widget-power', { timeout: 60000 }))
          .expect(Selector('.drift-widget-chat-wrapper').exists).ok('', { timeout: 60000 })
          .expect(Selector('.drift-widget-message--box p').withText(/Hey there .*/i).exists).ok('', { timeout: 60000 })
          .expect(Selector('.drift-widget-message--box p').withText(/Congrats on upgrading your subscription!/i).exists).ok('', { timeout: 80000 })
          .expect(Selector('.drift-widget-message--box p').withText(/Would you like to schedule a meeting with our Customer Success Team to learn more?/i).exists).ok('', { timeout: 60000 })
          .switchToMainWindow()
          .switchToIframe(Selector('#drift-frame-controller .drift-frame-controller', { timeout: 30000 }))
          .click(Selector('.drift-widget-controller'));
      }

      await t
        .switchToMainWindow();
    }

    await t
      .click(Selector('a[class*="NavigationMenu_tab"]').withText(/Diversity, Equity & Inclusion/i).nth(0))
      .expect(Selector('span[class*="NavigationMenu_label"]').withText(/Diversity, Equity & Inclusion/i).exists).ok()
      .click(Selector('div[data-testid="group-by"]'))
      .click(Selector('div[data-testid="group-by"]>div>a').withText(/By ethnicity/i))
      .expect(Selector('div[class*="CustomLegend_name"]').innerText).match(regex)
      .expect(Selector('div[class*="GroupStats_groupStats"]').exists).ok();

    await deleteGenScenario(t,scenarioName);

    await logout(t);
  }
