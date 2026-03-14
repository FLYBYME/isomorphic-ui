import { IMeshModule, IMeshApp } from 'isomorphic-core';
import { BrokerComponent } from '../core/BrokerComponent';
import { Box } from '../primitives/Box';
import { Typography } from '../primitives/Typography';
import { Stack } from '../primitives/Stack';

/**
 * DevTools UI Component.
 */
class DevToolsPanel extends BrokerComponent {
    constructor(app: IMeshApp) {
        super('div', {
            style: {
                position: 'fixed' as any, bottom: '20px', right: '20px', 
                width: '300px', maxHeight: '400px', overflowY: 'auto' as any,
                background: '#1e1e1e', color: '#fff', borderRadius: '8px',
                padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                zIndex: '10000', fontFamily: 'monospace', fontSize: '12px'
            }
        });
        this.app = app;
    }

    public build() {
        const broker = (this.app as any).getProvider('broker');
        
        return new Stack({ 
            gap: 'md', 
            children: [
                new Typography({ variant: 'h3', style: { color: '#3b82f6' }, children: 'Mesh DevTools' }),
                new Box({ style: { borderTop: '1px solid #333', paddingTop: '8px' }, children: [
                    new Typography({ style: { color: '#aaa' }, children: 'Node: ' + this.app.nodeID }),
                    new Typography({ style: { color: '#aaa' }, children: 'Pending Calls: ' + (broker?.pendingCalls || 0) })
                ]}),
                new Box({ children: [
                    new Typography({ variant: 'body', style: { marginBottom: '4px', color: '#4ade80' }, children: 'Modules:' }),
                    ...(this.app as any).modules.map((m: any) => 
                        new Typography({ style: { marginLeft: '8px', color: '#ddd' }, children: `• ${m.name}` })
                    )
                ]})
            ]
        });
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
        container.appendChild(panel.render());
    }
}
