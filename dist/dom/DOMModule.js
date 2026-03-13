"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMModule = void 0;
/**
 * DOMModule — Mounts the Virtual DOM to the browser's document and manages root rendering.
 */
class DOMModule {
    constructor(options = {}) {
        this.name = 'dom';
        this.rootElement = null;
        this.options = {};
        this.options = options;
    }
    onInit(app) {
        this.app = app;
    }
    async onBind() {
        if (typeof document === 'undefined')
            return;
        const rootID = this.options.rootID || this.app?.config['rootID'] || 'app';
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
    render(component) {
        if (!this.rootElement) {
            throw new Error('[DOMModule] Cannot render: root element not found.');
        }
        component.mount(this.rootElement);
    }
}
exports.DOMModule = DOMModule;
