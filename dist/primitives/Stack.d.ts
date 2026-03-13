import { Box, BoxProps } from './Box';
export interface StackProps extends BoxProps {
    isDivided?: boolean;
}
/**
 * Stack Primitive — Vertical layout helper.
 */
export declare class Stack extends Box {
    constructor(props: StackProps);
    protected applyDOMProps(props: StackProps): void;
}
