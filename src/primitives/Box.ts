import { z } from 'zod';
import { BrokerComponent } from '../core/BrokerComponent';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';

export const BoxSchema = z.object({
    fill: z.boolean().optional(),
    children: z.any().optional(),
});

export type BoxProps = IBaseUIProps & z.infer<typeof BoxSchema>;

/**
 * Box Primitive — The foundational layout atomic.
 */
export class Box extends BrokerComponent {
    constructor(props: BoxProps) {
        // Validate specific Box props, pass rest to base
        const validated = BoxSchema.parse(props);
        super((props.as as string) || props.tagName || 'div', props);
    }

    protected applyDOMProps(props: BoxProps): void {
        super.applyDOMProps(props);
        if (!(this.element instanceof HTMLElement)) return;
        
        if (props.fill) {
            this.element.classList.add('mesh-box--fill');
        }
        if (!this.element.classList.contains('mesh-box')) {
            this.element.classList.add('mesh-box');
        }
    }

    public build(): ComponentChild | ComponentChild[] {
        return (this.props as BoxProps).children || [];
    }
}
