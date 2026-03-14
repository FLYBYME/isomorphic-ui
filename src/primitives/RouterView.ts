import { BrokerComponent } from '../core/BrokerComponent';
import { ComponentChild } from '../types/ui.types';
import { ReactiveState } from '../core/ReactiveState';

/**
 * <RouterView> — Subscribes to $router.current and renders the matched component.
 */
export class RouterView extends BrokerComponent {
    private currentComponent: BrokerComponent | null = null;

    constructor() {
        super('fragment');
    }

    public build(): ComponentChild | ComponentChild[] {
        const app = (this as any).app;
        if (!app) return [];

        const state = app.getProvider(ReactiveState);
        const routerState = state.data.$router?.current;

        if (!routerState || !routerState.component) {
            return [];
        }

        // Cleanup outgoing component
        if (this.currentComponent) {
            this.currentComponent.unmount();
        }

        // Instantiate new component
        const ComponentClass = routerState.component;
        this.currentComponent = new ComponentClass({ 
            params: routerState.params,
            key: routerState.path // Ensure keyed reconciliation
        });

        return this.currentComponent;
    }
}
