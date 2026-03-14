import { Box, BoxProps } from './Box';

export interface StackProps extends BoxProps {
    isDivided?: boolean;
}

/**
 * Stack Primitive — Vertical layout helper.
 */
export class Stack extends Box {
    constructor(props: StackProps) {
        super({
            direction: 'col',
            gap: 'md',
            ...props
        });
    }

    protected applyDOMProps(props: StackProps): void {
        super.applyDOMProps(props);
        if (props.isDivided && this.element instanceof HTMLElement) {
            this.element.classList.add('mesh-stack--divided');
        }
    }
}
