const { Selector } = require("testcafe");
const { setTestContext} = require("./utilities/main_utils");
const { setupCustomUtilities } = require("./utilities/opencomp_utils");
const { credentials } = require("./utilities/credentials");

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
