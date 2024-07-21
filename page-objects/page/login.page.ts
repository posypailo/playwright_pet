import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage{
    private pageTitle: string;
    private pageUrl: string;
    private inputUsername: Locator;
    private inputPassword: Locator;
    private buttonLogin: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = 'Login Page'
        this.pageUrl = '/login'
        this.inputUsername = this.page.locator('#username');
        this.inputPassword = this.page.locator('#password');
        this.buttonLogin = this.page.locator('#login-submit');
    }

    public async visit() {
       await super.visit(this.pageUrl, this.inputUsername, this.pageTitle)
    }

    public async logIn(): Promise<void> {
        await this.inputUsername.clear();
        await this.inputUsername.fill(process.env.USERNAME);
        await this.buttonLogin.click();
        await this.inputPassword.clear();
        await this.inputPassword.fill(process.env.PASSWORD);
        await this.buttonLogin.click();
        await this.waitForPageIsLoaded();
    }
}