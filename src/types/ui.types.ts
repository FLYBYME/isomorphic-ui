export type LayoutDirection = 'row' | 'col' | 'column' | 'row-reverse' | 'col-reverse' | 'horizontal' | 'vertical';
export type LayoutGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LayoutAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type LayoutJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type LayoutPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type GridSpan = number | string;
export type ComponentChild = any; // Will be refined to BrokerComponent | string | number | null | undefined

export interface IBaseUIProps {
    id?: string;
    key?: string | number;
    className?: string;
    tagName?: string;
    variant?: string;
    size?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    style?: Partial<CSSStyleDeclaration>;
    role?: string;
    aria?: Record<string, string | boolean | number>;
    
    // Layout Props
    flex?: boolean;
    direction?: LayoutDirection;
    gap?: LayoutGap;
    align?: LayoutAlign;
    justify?: LayoutJustify;
    wrap?: boolean | 'reverse';
    span?: GridSpan;
    padding?: LayoutPadding;

    // Event Handlers
    onClick?: (e: MouseEvent) => void;
    onChange?: (payload: unknown) => void;
    onInput?: (e: Event) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    onSubmit?: (e: Event) => void;

    // Common Attributes
    type?: string;
    placeholder?: string;
    value?: string | number | boolean;
    disabled?: boolean;
    href?: string;

    [key: string]: unknown;
}
