import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';

/**
 * Button Primitive — Interactive atomic.
 */
export class Button extends BrokerComponent {
    constructor(props: IBaseUIProps) {
        super('button', props);
    }

    protected applyDOMProps(props: IBaseUIProps): void {
        super.applyDOMProps(props);
        if (!(this.element instanceof HTMLElement)) return;
        
        this.element.classList.add('mesh-button');
        if (props.variant) this.element.classList.add(`mesh-button--${props.variant}`);
    }

    public build(): ComponentChild | ComponentChild[] {
        return (this.props as any).children || (this.props as any).text || 'Button';
    }
}
