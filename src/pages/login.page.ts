import { Locator, Page } from "@playwright/test";
import { SelfHealBasePage } from "./selfheal.base.page";

export class LoginPage extends SelfHealBasePage {
    private readonly userNameField: string;
    private readonly passwordField: string;
    private readonly loginButton: string;

    constructor(page: Page) {
        super(page);
        this.userNameField = '#username';
        this.passwordField = '#wrong-password';
        this.loginButton = '#submit-login';
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
        await this.fill(this.userNameField, userName);
    }


    async fillPassword(password: string): Promise<void> {
        await this.fill(this.passwordField, password);
    }


    async clickLogin(): Promise<void> {
        await this.click(this.loginButton);
    }


    async login(userName: string, password: string): Promise<void> {
        await this.fillUserName(userName);
        await this.fillPassword(password);
        await this.clickLogin();
    }

}