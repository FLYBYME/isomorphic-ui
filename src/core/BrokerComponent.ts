import { ReactiveState } from './ReactiveState';
import { IBaseUIProps, ComponentChild } from '../types/ui.types';
import { UIPlugin } from '../plugins/UIPlugin';

/**
 * BrokerComponent — The modern UI base with "Magic Sauce" auto-subscription.
 */
export abstract class BrokerComponent {
    public element: HTMLElement | DocumentFragment | null = null;
    public readonly tagName: string;
    public props: IBaseUIProps;
    
    // Static flag for the "Magic Sauce" Track mechanism
    public static currentSubscriber: BrokerComponent | null = null;

    private isDirty = false;
    protected unsubscribes: (() => void)[] = [];
    protected plugins: UIPlugin[] = [];
    protected isFragment: boolean = false;
    protected oldTree: ComponentChild[] = [];
    protected app?: any;

    public onMount(): void {}
    public onUnmount(): void {}

    protected performUpdate(): void {
        this.render();
    }

    protected static RESERVED_PROPS = new Set([
        'children', 'style', 'className', 'tagName', 'variant', 'size', 
        'isDisabled', 'isLoading', 'flex', 'direction', 'gap', 'align', 
        'justify', 'wrap', 'span', 'padding', 'onClick', 'onChange', 
        'onInput', 'onKeyDown', 'onKeyUp', 'onSubmit', 'type', 'placeholder', 
        'value', 'disabled', 'href', 'as', 'key'
    ]);

    constructor(tagName: string = 'div', props: IBaseUIProps = {}) {
        this.tagName = (props.as as string) || (props.tagName as string) || tagName;
        this.isFragment = this.tagName === 'fragment' || this.tagName === '';
        this.props = props;
    }

    /**
     * Injects a plugin into this component's lifecycle.
     */
    public usePlugin(plugin: UIPlugin): void {
        this.plugins.push(plugin);
    }

    /**
     * The main template method. Components must implement this.
     */
    public abstract build(): ComponentChild;

    /**
     * Internal render logic with differential DOM updates.
     */
    public render(): HTMLElement | DocumentFragment {
        const prevSubscriber = BrokerComponent.currentSubscriber;
        BrokerComponent.currentSubscriber = this;
        (globalThis as any).MeshMagicSauce = { currentSubscriber: this };

        try {
            if (!this.element) {
                this.element = this.createElement();
                this.applyDOMProps(this.props);
            }

            const newTree = this.normalizeTree(this.build());
            this.reconcile(this.element, this.oldTree, newTree);
            this.oldTree = newTree;

            return this.element as any;
        } finally {
            BrokerComponent.currentSubscriber = prevSubscriber;
            (globalThis as any).MeshMagicSauce = { currentSubscriber: prevSubscriber };
        }
    }

    private createElement(): HTMLElement | DocumentFragment {
        if (this.isFragment) return document.createDocumentFragment();
        return document.createElement(this.tagName);
    }

    protected applyDOMProps(props: IBaseUIProps): void {
        if (!this.element || this.isFragment) return;
        const el = this.element as HTMLElement;

        if (props.className) el.className = props.className;
        if (props.style) Object.assign(el.style, props.style);

        // Events
        if (props.onClick) el.onclick = (e: MouseEvent) => props.onClick!(e);
        if (props.onChange) el.onchange = (e: Event) => props.onChange!(e);
        if (props.onInput) el.oninput = (e: Event) => props.onInput!(e);
        if (props.onKeyDown) el.onkeydown = (e: KeyboardEvent) => props.onKeyDown!(e);

        // Attributes
        for (const [key, value] of Object.entries(props)) {
            if (BrokerComponent.RESERVED_PROPS.has(key)) continue;
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                el.setAttribute(key, String(value));
            }
        }
    }

    private normalizeTree(child: ComponentChild): ComponentChild[] {
        if (Array.isArray(child)) return child.flat();
        if (child === null || child === undefined || child === false) return [];
        return [child];
    }

    private reconcile(parent: HTMLElement | DocumentFragment, oldTree: ComponentChild[], newTree: ComponentChild[]): void {
        const maxLength = Math.max(oldTree.length, newTree.length);
        for (let i = 0; i < maxLength; i++) {
            this.updateChild(parent, oldTree[i], newTree[i], i);
        }
    }

    private updateChild(parent: HTMLElement | DocumentFragment, oldChild: ComponentChild, newChild: ComponentChild, index: number): void {
        const currentDOM = parent.childNodes[index];

        // 1. Remove
        if (newChild === undefined) {
            if (currentDOM) parent.removeChild(currentDOM);
            return;
        }

        // 2. Add
        if (oldChild === undefined) {
            parent.appendChild(this.renderChild(newChild));
            return;
        }

        // 3. Replace or Update
        if (this.hasChanged(oldChild, newChild)) {
            parent.replaceChild(this.renderChild(newChild), currentDOM);
        } else if (newChild instanceof BrokerComponent) {
            newChild.render();
        }
    }

    private hasChanged(a: ComponentChild, b: ComponentChild): boolean {
        if (typeof a !== typeof b) return true;
        if (typeof a === 'string' || typeof a === 'number') return a !== b;
        if (a instanceof BrokerComponent && b instanceof BrokerComponent) {
            return a.constructor !== b.constructor;
        }
        return true;
    }

    private renderChild(child: ComponentChild): Node {
        if (child instanceof BrokerComponent) return child.render();
        return document.createTextNode(String(child));
    }

    /**
     * Magic Sauce: The Track mechanism for auto-reactive UI.
     */
    protected track<T extends object>(state: ReactiveState<T>): T {
        if (BrokerComponent.currentSubscriber === this) return state.data;
        
        const unsub = state.subscribeGlobal(() => this.invalidate());
        this.unsubscribes.push(unsub);
        return state.data;
    }

    public invalidate(): void {
        if (this.isDirty) return;
        this.isDirty = true;
        
        // Batch updates to next macro-task
        setTimeout(() => {
            this.performUpdate();
            this.isDirty = false;
        }, 0);
    }

    public mount(parent: HTMLElement | DocumentFragment, app?: any): HTMLElement | DocumentFragment {
        if (app) this.app = app;
        const el = this.render();
        parent.appendChild(el);
        this.onMount();
        return el;
    }

    public unmount(): void {
        this.onUnmount();
        this.destroy();
    }

    public destroy(): void {
        this.unsubscribes.forEach(u => u());
        this.unsubscribes = [];
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
