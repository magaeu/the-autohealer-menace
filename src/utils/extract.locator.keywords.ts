const SELECTOR_PART =
    /#([\w-]+)|\.([\w-]+)|\[\s*(?:id|data-testid|name|aria-label)\s*=\s*["']([^"']+)["']\s*\]/gi;
const FIRST_MATCH = 1;
const SECOND_MATCH = 2;
const THIRD_MATCH = 3;
const MIN_KEYWORD_LENGTH = 1;

export function extractLocatorKeywords(selector: string): string[] {
    const values: string[] = [];

    for (const match of selector.matchAll(SELECTOR_PART)) {
        const value = match[FIRST_MATCH] ?? match[SECOND_MATCH] ?? match[THIRD_MATCH];
        if (value) {
            values.push(value);
        }
    }

    return [...new Set(
        values
            .flatMap(value => value.split(/[\s_-]+/))
            .map(value => value.trim().toLowerCase())
            .filter(value => value.length > MIN_KEYWORD_LENGTH),
    )];
}
