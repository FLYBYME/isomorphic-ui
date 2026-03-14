import { MeshClientApp } from './MeshClientApp';
import { StateModule } from '../modules/StateModule';
import { BrokerModule } from 'isomorphic-core';
import { ClientNetworkModule } from '../modules/ClientNetworkModule';
import { DOMModule } from '../dom/DOMModule';
import { RouterModule } from '../modules/RouterModule';
import { RouteConfig } from '../types/router.types';

export interface MeshClientConfig {
    targetUri: string;
    rootElement: string;
    routes: RouteConfig[];
    nodeID?: string;
    namespace?: string;
}

/**
 * createMeshApp — The Client "Motherboard" Factory.
 * Bootstraps the entire frontend mesh stack.
 */
export function createMeshApp(config: MeshClientConfig): MeshClientApp {
    const app = new MeshClientApp({
        nodeID: config.nodeID || `client_${Math.random().toString(36).substring(2, 11)}`,
        namespace: config.namespace,
        rootID: config.rootElement
    });

    // Task 3: Precise Registration Order
    // 1. State (Reactivity First)
    app.use(new StateModule());
    
    // 2. Network (Establishing Transports)
    app.use(new ClientNetworkModule({ url: config.targetUri }));
    
    // 3. Broker (Binding Network and State)
    app.use(new BrokerModule());
    
    // 4. Router (Parsing the URL)
    app.use(new RouterModule(config.routes));
    
    // 5. DOM (Rendering the UI)
    app.use(new DOMModule({ rootID: config.rootElement }));

    return app;
}
