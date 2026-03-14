
import {
    IMeshApp,
    IMeshModule,
    AppConfig,
    ProviderToken,
    IServiceBroker,
    MeshActionRegistry,
    MeshEventRegistry,
    MeshApp, // Import the headless MeshApp
    ILogger // Import ILogger for explicit typing
} from 'isomorphic-core';
import { ReactiveState } from './ReactiveState'; // Import the moved ReactiveState

/**
 * MeshClientApp — Specialized shell for frontend/browser environments.
 * It composes the headless MeshApp and integrates browser-specific reactivity.
 */
export class MeshClientApp implements IMeshApp {
    private readonly meshApp: MeshApp;
    public readonly reactiveState: ReactiveState<any>; // Expose ReactiveState for UI use

    // Expose properties from the composed MeshApp instance
    public get nodeID(): string { return this.meshApp.nodeID; }
    public get namespace(): string { return this.meshApp.namespace; }
    public get config(): AppConfig { return this.meshApp.config; }
    public get logger(): ILogger { return this.meshApp.logger; }

    constructor(config: AppConfig) {
        // Initialize the headless MeshApp
        this.meshApp = new MeshApp(config);

        // Initialize ReactiveState for UI reactivity.
        // You might want to pass an initial state from config or elsewhere.
        this.reactiveState = new ReactiveState<any>({}); 

        // Register ReactiveState as a provider if it needs to be accessed by services
        // You might want to use a specific token for reactiveState, e.g., 'reactiveState'
        this.meshApp.registerProvider('reactiveState', this.reactiveState);
        
        // If the original MeshClientApp had specific providers or services to register,
        // they should be registered on this.meshApp here. For example:
        // this.meshApp.registerProvider('someToken', someProvider);
    }

    // Delegate core IMeshApp methods to the internal MeshApp instance
    public use(moduleOrMiddleware: IMeshModule | ((ctx: any, next: () => Promise<any>) => Promise<any>)): this {
        this.meshApp.use(moduleOrMiddleware);
        return this;
    }

    public registerService(service: unknown): this {
        this.meshApp.registerService(service);
        return this;
    }

    public registerProvider<T>(token: ProviderToken<T>, provider: T): void {
        this.meshApp.registerProvider(token, provider);
    }

    public getProvider<T>(token: ProviderToken<T>): T {
        return this.meshApp.getProvider(token);
    }

    public async call<TAction extends keyof MeshActionRegistry, TParams extends MeshActionRegistry[TAction] extends { params: infer P } ? P : any, TReturn extends MeshActionRegistry[TAction] extends { returns: infer R } ? R : any>(action: TAction, params: TParams): Promise<TReturn> {
        return this.meshApp.call(action, params);
    }

    public emit<TEvent extends keyof MeshEventRegistry, TPayload extends MeshEventRegistry[TEvent]>(event: TEvent, payload: TPayload): void {
        this.meshApp.emit(event, payload);
    }

    public async start(): Promise<void> {
        // Any UI-specific startup logic can be placed here, before or after meshApp.start()
        this.logger.info('🚀 MeshClientApp (UI): Starting boot sequence...');
        await this.meshApp.start();
        // After MeshApp starts, other UI components can be initialized or rendered.
        this.logger.info('✅ MeshClientApp (UI): Ready.');
    }

    public async stop(): Promise<void> {
        this.logger.info('🛑 MeshClientApp (UI): Stopping...');
        await this.meshApp.stop();
        this.logger.info('✅ MeshClientApp (UI): Stopped.');
    }
}
