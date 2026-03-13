import { IBaseUIProps, ComponentChild } from '../types/ui.types';
import { UIPlugin } from '../plugins/UIPlugin';
/**
 * BrokerComponent — The modern UI base with "Magic Sauce" auto-subscription.
 */
export declare abstract class BrokerComponent {
    element: HTMLElement | null;
    readonly tagName: string;
    props: IBaseUIProps;
    static currentSubscriber: BrokerComponent | null;
    private isDirty;
    protected unsubscribes: (() => void)[];
    protected plugins: UIPlugin[];
    private oldTree;
    protected static RESERVED_PROPS: Set<string>;
    constructor(tagName?: string, props?: IBaseUIProps);
    /**
     * Injects a plugin into this component's lifecycle.
     */
    usePlugin(plugin: UIPlugin): void;
    /**
     * The structural definition of the component.
     */
    abstract build(): ComponentChild | ComponentChild[];
    /**
     * Queues a rendering microtask.
     */
    update(): void;
    /**
     * The rendering loop implementing the "Magic Sauce" logic.
     */
    protected performUpdate(): void;
    protected unsubscribeAll(): void;
    /**
     * Refined VDOM Reconciliation (Granular Patching)
     */
    private reconcile;
    private createNode;
    mount(parent: HTMLElement): void;
    unmount(detach?: boolean): void;
    onMount(): void;
    onUnmount(): void;
    /**
     * Maps props to CSS Variables / Utilities & DOM Attributes.
     */
    protected applyDOMProps(props: IBaseUIProps): void;
    /**
     * Allow ReactiveState to record this component as a listener.
     */
    addSubscription(unsubscribe: () => void): void;
}
