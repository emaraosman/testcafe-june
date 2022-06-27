const { Selector } = require("testcafe");
const {
	setupFixture,
	setTestContext,
	faker,
	wrapTest,
} = require("./utilities/main_utils");


const MailBox = require("prodperfect-mailsac").default;

setupFixture();

const meta = {
	id: "f2642a8f-fe7a-4e66-9f81-85e8b4092cf2",
	steps: [
		'Click on Join Now button',
		'Enter first name, lastName, jobTitle, email and password',
		'Click on Agree & Join button',
		'ASSERTIONS: assert verification modal appears',
		'Enter Verification Code in the field- retrieved from mailsac',
		'Click on verify',
		'ASSERTIONS: assert successfull toast alert',
		'Enter company name',
		'Enter Total Funds Raised amount',
		'Select industry',
		'Enter Headquarters location',
		'Click on Submit',
		'ASSERTION: New company page appears',
		'Click on Add Employee Manually button',
		'ASSERTION: Assert url /company/d+/onboard-employees page',
		'Enter department name as "Engineering"',
		'Assetion: Go To Dashboard is disabled',
		'Enter full name as "David Jackson"',
		'Enter job title as "Sales Engineer"',
		'Select benchmark role as "Sales engineer" from dropdown',
		'Select any level',
		'Enter salary as "90,000"',
		'Assertion:Go To dashboard is enabled',
		'Click Go To dashboard',
		'Click Start Exploring',
		'Click on Scenario dropdown',
		'Select first Scenario',
		'Assertion:user is on Market Analysis tab',
		'Assertion: Assert "Engineering" department',
		'Assertion: Assert Employee name is "Jim Smith"',
		'Assertion: Assert job title "Software Engineer"',
		'Assertion: Assert benchmark role "software engineer"',
		'Assertion: Assert level',
		'Assertion: Assert salary as "$150,000',
	],
	nodes: [
		'd9cd9bd26f2fb840d314d75465915ef7', '87432ba1293483f849a1d20f7555c5cc', 'e2cf40f8c5c09e82d3fbaa715f70e1c6', '2e2710a5205eba0075f86fd6f263c755', '8ae592b4a48e886d4109df2b35570ae3', '418899b86451a95faca0eb34f6a94ac7',
		'20b3b6b47e10551e968003de800d1fa0', '02aa774ff114ba471ac9fcb8b5cd3a02', 'a9a5c5fd9bb41f576ee27f337e97e1c1', '4457ff87ff92c577866a024ae2083ec6', '2ba0f2b438e9b26e6e4ec6b9bf298a44', 'e4973ffdb62295ab9dbc6298dba560e9',
		'50968f4c45fe8a01ba3d2a97850a5108', 'dd6f321046af51f692e934e776d6b81e', '9722662d581d63c81667f777e0657e31', '7a8d9aada5f464df40b6e49cfaa66fd9', '02fb492dfd20e2a854aea9b041fdf1e2', '8806356cd890af14803cc37879c34d00',
		'ba482e96d37ad07e3b7f39609227e4cb', 'a92eb813a35b8d39fa46735520810d68', '58e41b1841ecc30ed7a04391636e5bb1', '20b7125b18246520fbe74289554a8729', 'c492119f7182696e7378d4c4282503c4', 'bc5965af3232714934d1d25bb29ce5dd',
		'78eb28ad8d0b81eac187f0e2187f5806', '5a0f86750255ae864a058794ad7ebbb1', '454469004525df82fde211ffb117bcd7', '29a2306f12de9bd1cd50a61e752c04b5'
	],
	proposedTestcaseIds: ["d328f064475bf8acd72ba10d9666bac0", "d27d1c8fe02b2dbfdc207a7be42e7b98"],
};

wrapTest(meta)("test_02_signup_new_user_d27d1c8fe02b2dbfdc207a7be42e7b98", async (t) => {

	const { getLocation } = setTestContext(t);

	const newMailBox = new MailBox();
	const emailAddress = await newMailBox.createEmailAddress("opencomp");
	const pwd = `1aA_${faker.internet.password()}`;
	console.log(emailAddress);
	console.log(pwd);

	await t
		.click(Selector('a[href*="/signup"]'))
		.expect(getLocation()).contains('app.opencomp.co/signup');

	await t
		.typeText('[id="firstName"]', faker.name.firstName(), { replace: true })
		.typeText('[id="lastName"]', faker.name.lastName(), { replace: true })
		.typeText('[id="jobTitle"]', "Engineer", { replace: true })
		.typeText('[id="email"]', emailAddress, { replace: true })
		.typeText('[id="password"]', pwd, { replace: true })
		.click(Selector('button').withText(/Agree and Join/i))
		.expect(Selector('div').withText(/Verification/i).exists).ok();

	// get inbox message
	const inboxMessage = await newMailBox.getInbox("Your OpenComp sign-up code", t, emailAddress);
	// get mail content
	const inboxMessageContent = await newMailBox.getMail(inboxMessage._id, true, emailAddress);
	// retrieve token
	const signupCode = inboxMessageContent.match(/[0-9]{6}/)[0];
	console.log(signupCode);

	await t
		.typeText(Selector('[id="code"]'), signupCode, { replace: true })
		.click(Selector('button').withText(/Verify/i))
		.expect(Selector('div[class*="NewCompany_welcomeText"]').withText(/Hi/i).exists).ok({ timeout: 10000 });

	await t
		.click(Selector('#companyName'))
		.typeText(Selector('#companyName'), 'prodperfect', { replace: true, paste: true })
		.click(Selector('#fundsRaised'))
		.typeText(Selector('#fundsRaised'), '1000000', { replace: true, paste: true })
		.click(Selector('[id*="industrySectorId"]'))
		.click(Selector('[id*="industrySectorId"] [class*="dropdown-menu show"] button').nth(3))
		.click(Selector('#location'))
		.typeText(Selector('#location'), 'New york,USA', { replace: true, paste: true })
		.click(Selector('button').withText(/Continue/i));

	await t
		.expect(Selector('div[class*="HrisContainer_title"]')
			.withText(/Get immediate insights/i).exists).ok({ timeout: 18000 })
		.expect(Selector('div[class*="HrisContainer_footer"]')
			.withText(/Here for just your team/i).exists).ok({ timeout: 18000 })
		.doubleClick(Selector('div[class*="HrisContainer_footer"] a')
			.withText(/Add manually/i, { timeout: 12000 }))
		.expect(getLocation()).match(/\/companies\/\d+\/onboard-employees/);

	const departName = 'Engineering';
	const name = 'Jim Smith';
	const jobTitle = 'Software Engineer';
	const salary = '150,000';

	await t
		.click(Selector('div[class*="DepartmentInput_nameInput"] input'))
		.typeText(Selector('div[class*="DepartmentInput_nameInput"] input'), departName, { replace: true, paste: true })
		.expect(Selector('button[disabled]').withText(/Go to dashboard/i).exists).ok()
		.setTestSpeed(0.01);
	if (await Selector('[class*="CollapseContainer_collapsed"]').visible) {
		await t
			.click(Selector('img[class*="CollapseContainer" i]'));
	}
	await t
		.click(Selector('input[placeholder="Full name"]'))
		.typeText(Selector('input[placeholder="Full name"]'), name, { replace: true, paste: true })
		.click(Selector('input[placeholder="Job title"]'))
		.typeText(Selector('input[placeholder="Job title"]'), jobTitle, { replace: true, paste: true })
		.click(Selector('input[placeholder="Benchmark role"]', { speed: 0.01 }))
		.typeText(Selector('input[placeholder="Benchmark role"]'), 'software engineer', { replace: true, paste: true })
		.hover(Selector('ul[role="listbox"] li div div').nth(0), { speed: 0.01 });

	const benchmarkRole = await Selector('ul[role="listbox"] li div div').nth(0).innerText;

	await t
		.click(Selector('ul[role="listbox"] li').nth(0))
		.click(Selector('button[class*="changeLevelBtn"] img[alt="increase level"]'))
		.click(Selector('button[class*="changeLevelBtn"] img[alt="increase level"]'));

	const level = await Selector('div[class*="Level_levelText"]').nth(0).innerText;
	console.log(level);
	console.log(benchmarkRole);

	await t
		.click(Selector('input[placeholder="Base salary"]'))
		.typeText(Selector('input[placeholder="Base salary"]'), salary, { replace: true, paste: true })
		.setTestSpeed(1)
		.expect(Selector('button[disabled]').withText(/Go to dashboard/i).exists).notOk()
		.click(Selector('button').withText(/Go to dashboard/i))
		.click(Selector('button').withText(/Start Exploring/i));

	await t
		.expect(Selector('a[class*="NavigationMenu_selected"] span')
			.withText(/Market Analysis/i).exists).ok({ timeout: 120000 })
		.click(Selector('div[class*="ScenarioDropdown_container"]'), { speed: 0.01 })
		.click(Selector('a[class*="ScenarioDropdown_item"]>div').nth(0))
		.expect(Selector('h3[class*="EmployeeGroupName_name"]').innerText).eql(departName);
	if (await Selector('[class*="CollapseContainer_collapsed"]').visible) {
		await t
			.click(Selector('img[class*="CollapseContainer" i]'));
	}
	await t
		.expect(Selector('div[class*="cell_main" i]').nth(0).innerText).eql(name)
		.expect(Selector('div[class*="cell_main" i]').nth(1).innerText).eql(jobTitle);
	if (await Selector('span[class*="job-role_subInfoRole" i]').visible) {
		await t
			.expect(Selector('span[class*="job-role_subInfoRole" i]').innerText).eql(benchmarkRole);
	}
	await t
		.expect(Selector('div[class*="Level_levelText" i] span').innerText).eql(level)
		.expect(Selector('div[data-testid="salaryOte-value" i] span span').innerText).eql('$' + salary);

});
