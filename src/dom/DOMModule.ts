import { IMeshModule, IMeshApp } from 'isomorphic-core';
import { BrokerComponent } from '../core/BrokerComponent';

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
    }

    /**
     * Renders the root component and initiates the mount lifecycle.
     */
    public render(component: BrokerComponent): void {
        if (!this.rootElement) {
            throw new Error('[DOMModule] Cannot render: root element not found.');
        }
        
        component.mount(this.rootElement);
    }
}
