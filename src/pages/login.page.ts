import { Locator, Page } from "@playwright/test";

export class LoginPage {
    private readonly page: Page;
    private readonly userNameField: Locator;
    private readonly passwordField: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userNameField = this.page.getByTestId('username');
        this.passwordField = this.page.getByTestId('password');
        this.loginButton = this.page.getByTestId('submit-login');
    }

    async goTo(): Promise<LoginPage> {
        await this.page.goto('login',
            { waitUntil: 'domcontentloaded' });
        return this;
    }

    async getUrl(): Promise<string> {
        return this.page.url();
    }

    async fillUserName(userName: string): Promise<void> {
        await this.userNameField.fill(userName);
    }


    async fillPassword(password: string): Promise<void> {
        await this.passwordField.fill(password);
    }


    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }


    async login(userName: string, password: string): Promise<void> {
        await this.fillUserName(userName);
        await this.fillPassword(password);
        await this.clickLogin();
    }

}