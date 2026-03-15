import {
    IMeshApp,
    IMeshModule,
    AppConfig,
    IProviderToken,
    IServiceActionRegistry as MeshActionRegistry,
    IServiceEventRegistry as MeshEventRegistry,
    MeshApp,
    ILogger
} from 'isomorphic-core';
import { ReactiveState } from './ReactiveState';
import { Context, ServiceSchema } from 'isomorphic-registry';

/**
 * MeshClientApp — Specialized shell for frontend/browser environments.
 * It composes the headless MeshApp and integrates browser-specific reactivity.
 * * @template TState - The shape of the application's reactive state.
 */
export class MeshClientApp<TState extends Record<string, unknown> = Record<string, unknown>> implements IMeshApp {
    private readonly meshApp: MeshApp;
    public readonly reactiveState: ReactiveState<TState>;

    // Expose properties from the composed MeshApp instance
    public get nodeID(): string { return this.meshApp.nodeID; }
    public get namespace(): string { return this.meshApp.namespace; }
    public get config(): AppConfig { return this.meshApp.config; }
    public get logger(): ILogger { return this.meshApp.logger; }

    constructor(config: AppConfig, initialState?: TState) {
        // Initialize the headless MeshApp
        this.meshApp = new MeshApp(config);

        // Initialize ReactiveState using the provided generic state type
        this.reactiveState = new ReactiveState<TState>(initialState ?? ({} as TState));

        // Register ReactiveState as a provider
        this.meshApp.registerProvider('reactiveState', this.reactiveState);
    }

    // Delegate core IMeshApp methods to the internal MeshApp instance, strictly typed
    public use<TContextData = unknown>(
        moduleOrMiddleware: IMeshModule | ((ctx: Context<TContextData>, next: () => Promise<unknown>) => Promise<unknown>)
    ): this {
        this.meshApp.use(moduleOrMiddleware);
        return this;
    }

    public registerService(service: ServiceSchema): this {
        this.meshApp.registerService(service);
        return this;
    }

    public registerProvider<T>(token: IProviderToken<T>, provider: T): void {
        this.meshApp.registerProvider(token, provider);
    }

    public getProvider<T>(token: IProviderToken<T>): T {
        return this.meshApp.getProvider(token);
    }

    // Strictly infers parameter and return types based on the Action Registry, using `never` and `unknown` instead of `any`
    public async call<
        TAction extends keyof MeshActionRegistry,
        TParams extends (MeshActionRegistry[TAction] extends { params: infer P } ? P : never),
        TReturn extends (MeshActionRegistry[TAction] extends { returns: infer R } ? R : unknown)
    >(action: TAction, params: TParams): Promise<TReturn> {
        return this.meshApp.call(action as string, params) as Promise<TReturn>;
    }

    public emit<
        TEvent extends keyof MeshEventRegistry,
        TPayload extends MeshEventRegistry[TEvent]
    >(event: TEvent, payload: TPayload): void {
        this.meshApp.emit(event, payload);
    }

    public async start(): Promise<void> {
        this.logger.info('🚀 MeshClientApp (UI): Starting boot sequence...');
        await this.meshApp.start();
        this.logger.info('✅ MeshClientApp (UI): Ready.');
    }

    public async stop(): Promise<void> {
        this.logger.info('🛑 MeshClientApp (UI): Stopping...');
        await this.meshApp.stop();
        this.logger.info('✅ MeshClientApp (UI): Stopped.');
    }
}