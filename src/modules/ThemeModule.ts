import { IMeshModule, IMeshApp } from 'isomorphic-core';

export type ThemeTokens = {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    typography: Record<string, { size: string, weight: string }>;
};

/**
 * ThemeModule — Manages Design Tokens and Style Injection.
 */
export class ThemeModule implements IMeshModule {
    public readonly name = 'theme';
    private tokens: ThemeTokens;

    constructor(tokens?: Partial<ThemeTokens>) {
        this.tokens = {
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
                background: '#ffffff',
                text: '#1e293b',
                ...tokens?.colors
            },
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                ...tokens?.spacing
            },
            typography: {
                body: { size: '1rem', weight: '400' },
                heading: { size: '1.5rem', weight: '700' },
                ...tokens?.typography
            }
        };
    }

    onInit(app: IMeshApp): void {
        app.registerProvider('theme:tokens', this.tokens);
        this.injectGlobalStyles();
    }

    private injectGlobalStyles(): void {
        const style = document.createElement('style');
        style.id = 'mesh-theme-tokens';
        
        let css = ':root {\n';
        for (const [key, val] of Object.entries(this.tokens.colors)) {
            css += `  --color-${key}: ${val};\n`;
        }
        for (const [key, val] of Object.entries(this.tokens.spacing)) {
            css += `  --spacing-${key}: ${val};\n`;
        }
        css += '}\n';

        style.textContent = css;
        document.head.appendChild(style);
    }

    public getToken(path: string): string | undefined {
        const [category, key] = path.split('.');
        return (this.tokens as any)[category]?.[key];
    }
}
