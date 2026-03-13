import { BrokerComponent } from '../src/core/BrokerComponent';
import { DOMModule } from '../src/dom/DOMModule';
import { Box } from '../src/primitives/Box';
import { Button } from '../src/primitives/Button';
import { Stack } from '../src/primitives/Stack';
import { Typography } from '../src/primitives/Typography';
import { IMeshApp } from 'isomorphic-core';

class TestComponent extends BrokerComponent {
    constructor(props = {}) {
        super('div', props);
    }
    public build() {
        return this.props.text || 'Test';
    }
}

class TestArrayComponent extends BrokerComponent {
    constructor(props = {}) {
        super('div', props);
    }
    public build() {
        return ['Test 1', 'Test 2'];
    }
}

class ParentComponent extends BrokerComponent {
    public childType = 'text';
    public build() {
        if (this.childType === 'text') return 'Text';
        if (this.childType === 'node') return new TestComponent({ text: 'Child' });
        if (this.childType === 'array') return [new TestComponent({ text: 'Child 1' }), new TestComponent({ text: 'Child 2' })];
        if (this.childType === 'null') return null;
        return undefined;
    }
}

describe('isomorphic-ui', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('BrokerComponent', () => {
        it('should mount to a parent element', () => {
            const parent = document.createElement('div');
            const comp = new TestComponent();
            comp.mount(parent);
            expect(comp.element).toBeTruthy();
            expect(parent.contains(comp.element)).toBe(true);
        });

        it('should perform plugin lifecycle hooks', () => {
            const plugin = {
                name: 'test',
                onBeforeMount: jest.fn(),
                onMounted: jest.fn(),
                onUpdated: jest.fn(),
                onUnmount: jest.fn(),
            };
            const parent = document.createElement('div');
            const comp = new TestComponent();
            comp.usePlugin(plugin);
            comp.mount(parent);

            expect(plugin.onBeforeMount).toHaveBeenCalledWith(comp);
            expect(plugin.onMounted).toHaveBeenCalledWith(comp);

            comp.update();
            jest.runAllTimers();
            expect(plugin.onUpdated).toHaveBeenCalledWith(comp);

            comp.unmount();
            expect(plugin.onUnmount).toHaveBeenCalledWith(comp);
        });

        it('should perform granular patching (reconcile) - additions, updates, removals', () => {
            const parent = document.createElement('div');
            const comp = new ParentComponent();
            comp.mount(parent);

            // Addition (text -> null -> node -> array)
            comp.childType = 'null';
            comp.update();
            jest.runAllTimers();
            expect(comp.element?.childNodes.length).toBe(0);

            comp.childType = 'node';
            comp.update();
            jest.runAllTimers();
            expect(comp.element?.childNodes.length).toBe(1);

            comp.childType = 'array';
            comp.update();
            jest.runAllTimers();
            expect(comp.element?.childNodes.length).toBe(2);

            comp.childType = 'text';
            comp.update();
            jest.runAllTimers();
            expect(comp.element?.childNodes.length).toBe(1);
        });

        it('should handle reconcile when component type changes', () => {
            const parent = document.createElement('div');
            const comp = new ParentComponent();
            comp.mount(parent);

            // Provide a custom component then replace it to test branch: oldItem.constructor !== newItem.constructor
            class CompA extends BrokerComponent { build() { return 'A'; } }
            class CompB extends BrokerComponent { build() { return 'B'; } }
            
            comp.build = () => new CompA();
            comp.update();
            jest.runAllTimers();

            comp.build = () => new CompB();
            comp.update();
            jest.runAllTimers();

            expect(comp.element?.textContent).toBe('B');
        });

        it('should apply DOM props', () => {
            const onClick = jest.fn();
            const comp = new TestComponent({
                id: 'my-id',
                className: 'my-class',
                role: 'button',
                flex: true,
                direction: 'col',
                gap: 'md',
                padding: 'lg',
                align: 'center',
                justify: 'center',
                onClick,
                value: '123',
                customAttr: 'custom'
            });
            const parent = document.createElement('div');
            comp.mount(parent);

            const el = comp.element as HTMLInputElement;
            expect(el.id).toBe('my-id');
            expect(el.getAttribute('role')).toBe('button');
            expect(el.className).toContain('my-class');
            expect(el.className).toContain('flex');
            expect(el.className).toContain('flex-column');
            expect(el.className).toContain('gap-md');
            expect(el.className).toContain('p-lg');
            expect(el.className).toContain('items-center');
            expect(el.className).toContain('justify-center');
            expect(el.getAttribute('customattr')).toBe('custom');
            expect(el.value).toBe('123');

            el.click();
            expect(onClick).toHaveBeenCalled();
        });

        it('should handle unmount without detaching if specified', () => {
            const parent = document.createElement('div');
            const comp = new TestComponent();
            comp.mount(parent);
            comp.unmount(false);
            expect(parent.contains(comp.element)).toBe(true);
        });

        it('should record subscriptions', () => {
            const comp = new TestComponent();
            const unsub = jest.fn();
            comp.addSubscription(unsub);
            comp.unmount();
            expect(unsub).toHaveBeenCalled();
        });
    });

    describe('DOMModule', () => {
        it('should mount with a given root ID', async () => {
            const domModule = new DOMModule({ rootID: 'custom-root' });
            await domModule.onBind();
            expect(document.getElementById('custom-root')).toBeTruthy();
        });

        it('should fallback to app config root ID', async () => {
            const domModule = new DOMModule();
            const app = { config: { rootID: 'app-root' } } as unknown as IMeshApp;
            domModule.onInit(app);
            await domModule.onBind();
            expect(document.getElementById('app-root')).toBeTruthy();
        });

        it('should use existing root element if available', async () => {
            const existingRoot = document.createElement('div');
            existingRoot.id = 'existing-root';
            document.body.appendChild(existingRoot);

            const domModule = new DOMModule({ rootID: 'existing-root' });
            await domModule.onBind();
            
            const roots = document.querySelectorAll('#existing-root');
            expect(roots.length).toBe(1);
        });

        it('should throw if render is called before bind', () => {
            const domModule = new DOMModule();
            expect(() => domModule.render(new TestComponent())).toThrow();
        });

        it('should render component to root', async () => {
            const domModule = new DOMModule({ rootID: 'render-root' });
            await domModule.onBind();
            domModule.render(new TestComponent());
            
            const root = document.getElementById('render-root');
            expect(root?.childNodes.length).toBe(1);
        });
        
        it('should return safely if document is undefined during bind', async () => {
            const domModule = new DOMModule();
            const originalDoc = global.document;
            (global as any).document = undefined;
            await domModule.onBind();
            (global as any).document = originalDoc;
            // No error should be thrown
        });
    });

    describe('Primitives', () => {
        describe('Box', () => {
            it('should render with default props', () => {
                const box = new Box({});
                box.mount(document.createElement('div'));
                expect(box.element?.tagName.toLowerCase()).toBe('div');
                expect(box.element?.classList.contains('mesh-box')).toBe(true);
            });

            it('should render fill and children correctly', () => {
                const child = new TestComponent();
                const box = new Box({ fill: true, children: [child] });
                box.mount(document.createElement('div'));
                expect(box.element?.classList.contains('mesh-box--fill')).toBe(true);
                expect(box.element?.childNodes.length).toBe(1);
            });
        });

        describe('Button', () => {
            it('should render button with text', () => {
                const btn = new Button({ text: 'Click me', variant: 'primary' });
                btn.mount(document.createElement('div'));
                expect(btn.element?.tagName.toLowerCase()).toBe('button');
                expect(btn.element?.classList.contains('mesh-button')).toBe(true);
                expect(btn.element?.classList.contains('mesh-button--primary')).toBe(true);
                expect(btn.element?.textContent).toBe('Click me');
            });
            it('should render button with children', () => {
                const btn = new Button({ children: ['Click me too'] });
                btn.mount(document.createElement('div'));
                expect(btn.element?.textContent).toBe('Click me too');
            });
        });

        describe('Stack', () => {
            it('should render stack with correct classes', () => {
                const stack = new Stack({ isDivided: true });
                stack.mount(document.createElement('div'));
                expect(stack.element?.classList.contains('mesh-box')).toBe(true);
                expect(stack.element?.classList.contains('flex-column')).toBe(true);
                expect(stack.element?.classList.contains('gap-md')).toBe(true);
                expect(stack.element?.classList.contains('mesh-stack--divided')).toBe(true);
            });
        });

        describe('Typography', () => {
            it('should render correct tags and classes for variants', () => {
                const p = new Typography({ variant: 'body', text: 'Text', textAlign: 'center', weight: 'bold' });
                p.mount(document.createElement('div'));
                expect(p.element?.tagName.toLowerCase()).toBe('p');
                expect(p.element?.classList.contains('mesh-text')).toBe(true);
                expect(p.element?.classList.contains('mesh-text--body')).toBe(true);
                expect(p.element?.style.textAlign).toBe('center');
                expect(p.element?.style.fontWeight).toBe('var(--mesh-font-weight-bold)');
            });

            it('should fallback to correct tags', () => {
                const h1 = new Typography({ variant: 'h1' });
                h1.mount(document.createElement('div'));
                expect(h1.element?.tagName.toLowerCase()).toBe('h1');
                
                const code = new Typography({ variant: 'code' });
                code.mount(document.createElement('div'));
                expect(code.element?.tagName.toLowerCase()).toBe('code');
            });
        });
    });
});
