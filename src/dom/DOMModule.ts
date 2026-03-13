import { IMeshModule, IMeshApp } from '@mesh-app/core';
import { BrokerComponent } from '../core/BrokerComponent';
import { RouterView } from '../primitives/RouterView';

/**
 * DOMModule — Mounts the Virtual DOM to the browser's document and manages root rendering.
 */
export class DOMModule implements IMeshModule {
    public readonly name = 'dom';
    private app?: IMeshApp;
    private rootElement: HTMLElement | null = null;
    private options: { rootID?: string } = {};

    constructor(options: { rootID?: string } = {}) {
        this.options = options;
    }

    onInit(app: IMeshApp): void {
        this.app = app;
    }

    async onBind(): Promise<void> {
        if (typeof document === 'undefined') return;

        const rootID = this.options.rootID || (this.app?.config['rootID'] as string) || 'app';
        this.rootElement = document.getElementById(rootID);

        if (!this.rootElement) {
            console.warn(`[DOMModule] Root element #${rootID} not found. Creating it...`);
            this.rootElement = document.createElement('div');
            this.rootElement.id = rootID;
            document.body.appendChild(this.rootElement);
        }

        this.injectGlobalStyles();
        this.initLoadingBar();
    }

    private injectGlobalStyles(): void {
        const theme = this.app?.getProvider<any>('theme:tokens');
        if (!theme) return;

        const style = document.createElement('style');
        style.id = 'mesh-dom-styles';
        let css = `
            :root {
                ${Object.entries(theme.colors || {}).map(([k, v]) => `--color-${k}: ${v};`).join('\n')}
                ${Object.entries(theme.spacing || {}).map(([k, v]) => `--spacing-${k}: ${v};`).join('\n')}
            }
            #mesh-loading-bar {
                position: fixed; top: 0; left: 0; height: 3px; background: var(--color-primary, #3b82f6);
                width: 0%; transition: width 0.2s; z-index: 9999;
            }
        `;
        style.textContent = css;
        document.head.appendChild(style);
    }

    private initLoadingBar(): void {
        const bar = document.createElement('div');
        bar.id = 'mesh-loading-bar';
        document.body.appendChild(bar);

        const broker = this.app?.getProvider<any>('broker');
        setInterval(() => {
            if (broker && broker.pendingCalls > 0) {
                bar.style.width = '70%';
                bar.style.opacity = '1';
            } else {
                bar.style.width = '100%';
                bar.style.opacity = '0';
                setTimeout(() => { bar.style.width = '0%'; }, 200);
            }
        }, 100);
    }

    async onReady(app: IMeshApp): Promise<void> {
        if (typeof document === 'undefined') return;

        // Task 2: Auto-mount RouterView
        const view = new RouterView();
        this.render(view);
        console.log('[DOMModule] RouterView auto-mounted.');
    }

    /**
     * Renders the root component and initiates the mount lifecycle.
     */
    public render(component: BrokerComponent): void {
        if (!this.rootElement) {
            throw new Error('[DOMModule] Cannot render: root element not found.');
        }
        
        component.mount(this.rootElement, this.app);
    }
}
