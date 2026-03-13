import { BrokerComponent } from '../core/BrokerComponent';
import { Context } from 'isomorphic-core';

/**
 * RouteConfig — Definition for a single application route.
 */
export interface RouteConfig {
    path: string | RegExp;
    component: new (props?: any) => BrokerComponent;
    guards?: Array<(ctx: Context<any>) => boolean | Promise<boolean>>;
}

/**
 * RouterState — The reactive state shape for the router.
 */
export interface RouterState {
    current: {
        path: string;
        component: (new (props?: any) => BrokerComponent) | null;
        params: Record<string, string>;
    };
}
