import { IMeshModule, IMeshApp } from '@mesh-app/core';
import { BrokerComponent } from '../core/BrokerComponent';
/**
 * DOMModule — Mounts the Virtual DOM to the browser's document and manages root rendering.
 */
export declare class DOMModule implements IMeshModule {
    readonly name = "dom";
    private app?;
    private rootElement;
    private options;
    constructor(options?: {
        rootID?: string;
    });
    onInit(app: IMeshApp): void;
    onBind(): Promise<void>;
    /**
     * Renders the root component and initiates the mount lifecycle.
     */
    render(component: BrokerComponent): void;
}
