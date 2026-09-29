import { Page, Locator } from '@playwright/test';
import { LocatorHealer } from '@core/locator.healer';

export abstract class SelfHealBasePage {
    private readonly locatorHealer = new LocatorHealer();

    constructor(protected readonly page: Page) { }

    async getLocator(selector: string): Promise<Locator> {

        const element = this.page.locator(selector);

        try {
            await element.waitFor({ state: 'visible', timeout: 3000 });
            return element;

        } catch (error) {
            if (!(error instanceof Error) || error.name !== 'TimeoutError') {
                throw error;
            }
        }

        const { newSelector } = await this.locatorHealer.findLocator(this.page, selector);
        return this.page.locator(newSelector);
    }

    async click(selector: string): Promise<void> {
        const element = await this.getLocator(selector);
        await element.click();
    }

    async fill(selector: string, value: string): Promise<void> {
        const element = await this.getLocator(selector);
        await element.fill(value);
    }
}