const { Selector } = require("testcafe");
const {
	setTestContext,
	faker,
	wrapTest,
} = require("./utilities/main_utils");

const MailBox = require("prodperfect-mailsac").default;

const meta = {
	id: "87c3a328-f006-4a51-b645-c3de6d93784b",
	steps: [
		'Click on Join Now link on the login page',
		'ASSERTIONS: assert url',
		'Scroll down to the bottom and Click Sign In link',
		'ASSERTIONS: assert url',
		'Enter Email',
		'Enter wrong Password',
		'Click on Login',
		'ASSERTIONS: assert toast message',
		'Click on "Forget Password"',
		'ASSERTIONS: assert url',
		'Click on Email Input Field',
		'Enter Email',
		'Click on Continue Button',
		'ASSERTIONS: assert toast message',
		'Open Mailsac Inbox for "opencomp022@prodp.msdc.co"',
		'Get security code through mailsac',
		'ASSSERTION: "Create new password" heading exists',
		'Enter Security Code',
		'Click on New Password Input Field',
		'Enter text in New Password Input Field',
		'Click on Submit Button',
		'ASSERTIONS: assert toast message',
		'ASSERTIONS: assert url //app.opencomp.co/scenarios/[scenario_id]',
	],
	nodes: [
		'dd6f321046af51f692e934e776d6b81e', '4211ff23aa9a896d5ae5f9308e480c83', '868bb22eac69d949c466c8b7af284cd2', 'bfb171241096686e8399fad4bb67a4dd', 'cfefee8f905f53afde55a5184fc9988d', '1173e410a0e4af2212b8987c523d0544', '2c92fd1d8302b490232c96517a69a07b', '180073412c65893789a2fa00c6587773', 'f5537e8a8b1c2131645337175aaddc02', '5f0d09398f70ea5697182f42397ac93c', '28ea86622ab337763536ed767e9b7d01', '2c92fd1d8302b490232c96517a69a07b'
	],
	proposedTestcaseIds: ["ec463632d5e02a3d585bc71720ef88cd"],
};

wrapTest(meta)(
	"test_13_login_attempt_with_wrong_password_and_create_new_password_ec463632d5e02a3d585bc71720ef88cd",
	async (t) => {

		const { getLocation } = setTestContext(t);
		const newMailBox = new MailBox();

		await t
			.click(Selector('a[id="join-now"]'))
			.expect(getLocation()).match(/.*app\.opencomp\.co\/signup/);

		await t
			.click(Selector('[href*="/login"]'))
			.expect(getLocation()).match(/.*app\.opencomp\.co\/login/);

		const resetPasswordEmail = 'opencomp-forgot-password@prodp.msdc.co';
		const wrongPassword = `1aA_${faker.internet.password()}`;
		await t
			.click(Selector('#email'))
			.typeText(Selector('#email'), resetPasswordEmail, { replace: true })
			.click(Selector('#password'))
			.typeText(Selector('#password'), wrongPassword, { replace: true })
			.click(Selector('.btn-primary'))
			.expect(Selector('div.Toastify__toast-body > div').withText(/Incorrect username or password/i).exists).ok({ timeout: 20000 })
			.click(Selector('button > svg > path'));

		await t
			.click(Selector('a[href*="forgot-password"]'))
			.expect(getLocation()).match(/.*app\.opencomp\.co\/forgot-password/);

		await t
			.click(Selector('#email'))
			.typeText(Selector('#email'), resetPasswordEmail, { replace: true })
			.click(Selector('.btn-primary'))
			.expect(Selector('div.Toastify__toast-body > div').withText(/Please check your email/i).exists).ok()
			.click(Selector('button > svg > path'))
			.expect(Selector('div').withText(/Create new password/i).exists).ok();

		//retrieve security code from mailsac
		const passwordResetEmail = await newMailBox.getInbox("Your OpenComp account recovery code", t, resetPasswordEmail);
		const passwordResetEmailContent = await newMailBox.getMail(passwordResetEmail._id, true, resetPasswordEmail);
		const resetCode = passwordResetEmailContent.match(/[0-9]{6}/)[0];

		//create new password
		const newPassword = 'ProdPerfect#123';
		await t
			.click(Selector('#verificationcode'))
			.typeText(Selector('#verificationcode'), resetCode)
			.click(Selector('#newpassword'))
			.typeText(Selector('#newpassword'), newPassword)
			.click(Selector('.btn-primary'))
			.expect(Selector('div.Toastify__toast-body > div').withText(/Thanks, your password has been changed/i).exists).ok()
			.wait(3000)	// wait for 
			.expect(getLocation()).match(/.*app\.opencomp\.co\/companies\/\d+/, { timeout: 90000 });
	}
);
