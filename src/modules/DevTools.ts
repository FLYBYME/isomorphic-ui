import { IMeshModule, IMeshApp } from 'isomorphic-core';
import { BrokerComponent } from '../core/BrokerComponent';
import { Box } from '../primitives/Box';
import { Typography } from '../primitives/Typography';
import { Stack } from '../primitives/Stack';

/**
 * DevTools UI Component.
 */
class DevToolsPanel extends BrokerComponent {
    constructor(private app: IMeshApp) {
        super('div', {
            style: `
                position: fixed; bottom: 20px; right: 20px; 
                width: 300px; max-height: 400px; overflow-y: auto;
                background: #1e1e1e; color: #fff; border-radius: 8px;
                padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                z-index: 10000; font-family: monospace; font-size: 12px;
            `
        });
    }

    public build() {
        const broker = this.app.getProvider<any>('broker');
        
        return new Stack({ gap: 'md' }, [
            new Typography({ variant: 'heading', style: 'color: #3b82f6', children: 'Mesh DevTools' }),
            new Box({ style: 'border-top: 1px solid #333; padding-top: 8px' }, [
                new Typography({ style: 'color: #aaa', children: 'Node: ' + this.app.nodeID }),
                new Typography({ style: 'color: #aaa', children: 'Pending Calls: ' + (broker?.pendingCalls || 0) })
            ]),
            new Box({ children: [
                new Typography({ variant: 'body', style: 'margin-bottom: 4px; color: #4ade80', children: 'Modules:' }),
                ...(this.app as any).modules.map((m: any) => 
                    new Typography({ style: 'margin-left: 8px; color: #ddd', children: `• ${m.name}` })
                )
            ]})
        ]);
    }
}

/**
 * DevToolsModule — Injects the developer panel into the DOM.
 */
export class DevToolsModule implements IMeshModule {
    public readonly name = 'devtools';
    
    onReady(app: IMeshApp): void {
        if (typeof document === 'undefined') return;

        const container = document.createElement('div');
        container.id = 'mesh-devtools-root';
        document.body.appendChild(container);

        const panel = new DevToolsPanel(app);
        panel.mount(container);
    }
}
