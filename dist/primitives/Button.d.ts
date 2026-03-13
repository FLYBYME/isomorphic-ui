import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';
/**
 * Button Primitive — Interactive atomic.
 */
export declare class Button extends BrokerComponent {
    constructor(props: IBaseUIProps);
    protected applyDOMProps(props: IBaseUIProps): void;
    build(): ComponentChild | ComponentChild[];
}
