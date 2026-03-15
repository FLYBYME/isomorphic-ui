import { ReactiveState } from 'isomorphic-core';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';
import { UIPlugin } from '../plugins/UIPlugin';

/**
 * BrokerComponent — The modern UI base with "Magic Sauce" auto-subscription.
 */
export abstract class BrokerComponent {
    public element: HTMLElement | null = null;
    public readonly tagName: string;
    public props: IBaseUIProps;
    
    // Static flag for the "Magic Sauce" Track mechanism
    public static currentSubscriber: BrokerComponent | null = null;

    private isDirty = false;
    protected unsubscribes: (() => void)[] = [];
    protected plugins: UIPlugin[] = [];
    private oldTree: ComponentChild[] = [];

    protected static RESERVED_PROPS = new Set([
        'children', 'style', 'className', 'tagName', 'variant', 'size', 
        'isDisabled', 'isLoading', 'flex', 'direction', 'gap', 'align', 
        'justify', 'wrap', 'span', 'padding', 'onClick', 'onChange', 
        'onInput', 'onKeyDown', 'onSubmit', 'type', 'placeholder', 
        'value', 'disabled', 'href'
    ]);

    constructor(tagName: string = 'div', props: IBaseUIProps = {}) {
        this.tagName = props.tagName || tagName;
        this.props = props;
    }

    /**
     * Injects a plugin into this component's lifecycle.
     */
    public usePlugin(plugin: UIPlugin): void {
        this.plugins.push(plugin);
    }

    /**
     * The structural definition of the component.
     */
    public abstract build(): ComponentChild | ComponentChild[];

    /**
     * Queues a rendering microtask.
     */
    public update(): void {
        if (this.isDirty || !this.element) return;
        this.isDirty = true;
        
        queueMicrotask(() => {
            if (this.isDirty) {
                this.performUpdate();
                this.isDirty = false;
            }
        });
    }

    /**
     * The rendering loop implementing the "Magic Sauce" logic.
     */
    protected performUpdate(): void {
        if (!this.element) return;

        // 1. Clear previous auto-subscriptions
        this.unsubscribeAll();

        // 2. THE MAGIC SAUCE: Capture dependencies during build()
        const previousSubscriber = BrokerComponent.currentSubscriber;
        BrokerComponent.currentSubscriber = this;
        ReactiveState.currentSubscriber = this;
        
        let buildResult: ComponentChild | ComponentChild[];
        try {
            buildResult = this.build();
        } finally {
            BrokerComponent.currentSubscriber = previousSubscriber;
            ReactiveState.currentSubscriber = previousSubscriber;
        }

        const newTree = Array.isArray(buildResult) ? buildResult : [buildResult];

        // 3. Granular Patching
        this.reconcile(this.oldTree, newTree, this.element);
        this.oldTree = newTree;

        // 4. Update Attributes & Props
        this.applyDOMProps(this.props);

        // 5. Lifecycle hook for plugins
        for (const plugin of this.plugins) {
            plugin.onUpdated?.(this);
        }
    }

    protected unsubscribeAll(): void {
        for (const unsub of this.unsubscribes) unsub();
        this.unsubscribes = [];
    }

    /**
     * Refined VDOM Reconciliation (Granular Patching)
     */
    private reconcile(oldTree: ComponentChild[], newTree: ComponentChild[], parent: HTMLElement): void {
        const max = Math.max(oldTree.length, newTree.length);
        let domIndex = 0;

        for (let i = 0; i < max; i++) {
            const oldItem = oldTree[i];
            const newItem = newTree[i];
            let domNode = parent.childNodes[domIndex];

            // Addition
            if (oldItem == null && newItem != null) {
                const newNode = this.createNode(newItem);
                parent.appendChild(newNode);
                domIndex++;
            }
            // Removal
            else if (oldItem != null && newItem == null) {
                if (domNode) {
                    parent.removeChild(domNode);
                    if (oldItem instanceof BrokerComponent) oldItem.unmount();
                }
            }
            // Mutation or Replacement
            else if (oldItem != null && newItem != null) {
                if (oldItem instanceof BrokerComponent && newItem instanceof BrokerComponent) {
                    if (oldItem.constructor === newItem.constructor) {
                        // Adopt existing component's element
                        newItem.element = oldItem.element;
                        newItem.oldTree = oldItem.oldTree;
                        oldItem.unmount(false); // Silent unmount (don't detach)
                        newItem.performUpdate();
                    } else {
                        const newNode = this.createNode(newItem);
                        parent.replaceChild(newNode, domNode);
                        oldItem.unmount();
                    }
                } else if (typeof oldItem !== 'object' && typeof newItem !== 'object') {
                    // Text node patching
                    const newText = String(newItem);
                    if (domNode && domNode.nodeType === 3) {
                        if (domNode.nodeValue !== newText) domNode.nodeValue = newText;
                    } else {
                        parent.replaceChild(document.createTextNode(newText), domNode);
                    }
                } else {
                    // Mismatched types: Re-create
                    const newNode = this.createNode(newItem);
                    parent.replaceChild(newNode, domNode);
                    if (oldItem instanceof BrokerComponent) oldItem.unmount();
                }
                domIndex++;
            }
        }
    }

    private createNode(item: ComponentChild): Node {
        if (item instanceof BrokerComponent) {
            if (!item.element) item.mount(document.createElement('div')); // Temporary parent
            return item.element!;
        }
        return document.createTextNode(String(item ?? ''));
    }

    public mount(parent: HTMLElement): void {
        // Plugin: onBeforeMount
        for (const plugin of this.plugins) plugin.onBeforeMount?.(this);

        if (!this.element) {
            this.element = document.createElement(this.tagName);
        }
        parent.appendChild(this.element);
        this.performUpdate();
        
        this.onMount();
        
        // Plugin: onMounted (Fires AFTER component onMount)
        for (const plugin of this.plugins) plugin.onMounted?.(this);
    }

    public unmount(detach: boolean = true): void {
        this.unsubscribeAll();
        for (const plugin of this.plugins) plugin.onUnmount?.(this);
        
        if (detach && this.element && this.element.parentElement) {
            this.element.parentElement.removeChild(this.element);
        }
        
        this.onUnmount();
    }

    public onMount(): void {}
    public onUnmount(): void {}

    /**
     * Maps props to CSS Variables / Utilities & DOM Attributes.
     */
    protected applyDOMProps(props: IBaseUIProps): void {
        if (!this.element) return;

        // 1. Class Orchestration
        const classes = new Set<string>();
        if (props.className) classes.add(props.className);
        if (props.flex) classes.add('flex');
        if (props.direction) {
            const dir = props.direction === 'col' ? 'column' : props.direction;
            classes.add(`flex-${dir}`);
        }
        if (props.gap && props.gap !== 'none') classes.add(`gap-${props.gap}`);
        if (props.padding && props.padding !== 'none') classes.add(`p-${props.padding}`);
        if (props.align) classes.add(`items-${props.align}`);
        if (props.justify) classes.add(`justify-${props.justify}`);
        
        this.element.className = Array.from(classes).join(' ');

        // 2. Normalized Event Handling
        if (props.onClick) this.element.onclick = props.onClick as any;
        
        // 3. Attribute Pass-through
        if (props.id) this.element.id = props.id;
        if (props.role) this.element.setAttribute('role', props.role);
        
        // Form properties
        const input = this.element as HTMLInputElement;
        if (props.value !== undefined && input.value !== String(props.value)) {
            input.value = String(props.value);
        }

        // Custom pass-through
        for (const [key, val] of Object.entries(props)) {
            if (!BrokerComponent.RESERVED_PROPS.has(key) && typeof val !== 'function') {
                this.element.setAttribute(key.toLowerCase(), String(val));
            }
        }
    }

    /**
     * Allow ReactiveState to record this component as a listener.
     */
    public addSubscription(unsubscribe: () => void): void {
        this.unsubscribes.push(unsubscribe);
    }
}
