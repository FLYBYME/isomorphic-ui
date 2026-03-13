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
        if (!this.element) return;
        
        this.element.classList.add('mesh-button');
        if (props.variant) this.element.classList.add(`mesh-button--${props.variant}`);
        
        // Event delegation note: 
        // For a single button, we use direct listener, but for lists we'd use delegation.
    }

    public build(): ComponentChild | ComponentChild[] {
        return (this.props as any).children || (this.props as any).text || 'Button';
    }
}
