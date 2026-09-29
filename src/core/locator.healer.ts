import { Locator, Page } from '@playwright/test';
import { LocatorResult, LocatorStrategy } from '@types/locator.result';
import { extractLocatorKeywords } from '@utils/extract.locator.keywords';

interface CandidateStrategy {
    strategy: LocatorStrategy;
    buildSelector: (keyword: string) => string;
}

const PRIORITY: CandidateStrategy[] = [
    { strategy: 'id', buildSelector: value => `[id="${escapeCssString(value)}"]` },
    { strategy: 'data-testid', buildSelector: value => `[data-testid="${escapeCssString(value)}"]` },
    { strategy: 'name', buildSelector: value => `[name="${escapeCssString(value)}"]` },
    { strategy: 'aria-label', buildSelector: value => `[aria-label="${escapeCssString(value)}"]` },
];

function escapeCssString(value: string): string {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/[\n\r\f]/g, character =>
            `\\${character.charCodeAt(0).toString(16)} `,
        );
}

export class LocatorHealer {
    async findLocator(page: Page, originalSelector: string): Promise<LocatorResult> {
        const originalLocator = page.locator(originalSelector);

        const keywords = extractLocatorKeywords(originalSelector);

        for (const candidateStrategy of PRIORITY) {
            for (const keyword of keywords) {
                const newSelector = candidateStrategy.buildSelector(keyword);
                const newLocator = page.locator(newSelector);

                if (
                    await newLocator.count() === 1 &&
                    await newLocator.isVisible()
                ) {
                    return {
                        healed: true,
                        originalSelector,
                        newSelector,
                        strategyUsed: candidateStrategy.strategy,
                        timestamp: new Date().toISOString(),
                    };
                }
            }
        }

        throw new Error(
            `[SelfHealing] No unique visible match found for "${originalSelector}".`,
        );
    }
}