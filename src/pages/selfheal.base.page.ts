import { Page, Locator } from '@playwright/test';
import { LocatorContext } from '@types/locator.context';

export abstract class SelfHealBasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private buildPrioritySelector(attribute: string, value: string): string {
        switch (attribute) {
            case 'id':
                return `#${value}`;
            case 'data-testid':
                return `[data-testid="${value}"]`;
            case 'name':
                return `[name="${value}"]`;
            case 'aria-label':
                return `[aria-label="${value}"]`;
            default:
                return '';
        }
    }

    private async resolveByPriority(locator: string): Promise<{
        oldLocator: string;
        newLocator: string;
        strategy: 'id' | 'data-testid' | 'name' | 'aria-label';
    } | null> {
        const keywords = locator
            .replace(/[#.\[\]"'=*^$]/g, ' ')
            .split(/[\s\-_]+/)
            .map(value => value.trim().toLowerCase())
            .filter(value => value.length > 1);

        if (!keywords.length) {
            return null;
        }

        const strategies: Array<{
            key: 'id' | 'data-testid' | 'name' | 'aria-label';
            selector: (value: string) => string;
        }> = [
                { key: 'id', selector: value => `#${value}` },
                { key: 'data-testid', selector: value => `[data-testid="${value}"]` },
                { key: 'name', selector: value => `[name="${value}"]` },
                { key: 'aria-label', selector: value => `[aria-label="${value}"]` },
            ];

        for (const strategy of strategies) {
            for (const keyword of keywords) {
                const candidate = strategy.selector(keyword);
                const candidateLocator = this.page.locator(candidate);

                if ((await candidateLocator.count()) > 0) {
                    return {
                        oldLocator: locator,
                        newLocator: candidate,
                        strategy: strategy.key,
                    };
                }
            }
        }

        return null;
    }

    async findLocator(locator: string, hint?: Partial<LocatorContext>): Promise<Locator> {
        const element = this.page.locator(locator);

        try {
            await element.waitFor({ state: 'visible', timeout: 3000 });
            return element;

        } catch {
            console.warn(`[SelfHealing] Locator failed: "${locator}". Trying priority-based fallback...`);

            const healed = await this.resolveByPriority(locator);

            if (!healed) {
                throw new Error(`[SelfHealing] Could not locate "${locator}" with any priority strategy.`);
            }

            console.log(
                `[SelfHealing] Replaced old locator: "${healed.oldLocator}" ` +
                `with new locator: "${healed.newLocator}" using strategy: "${healed.strategy}"`
            );

            return this.page.locator(healed.newLocator);
        }
    }

    async click(locator: string) {
        const element = await this.findLocator(locator);
        await element.click();
    }

    async fill(locator: string, value: string) {
        const element = await this.findLocator(locator);
        await element.fill(value);
    }
}