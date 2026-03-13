declare module '@mesh-app/core' {
  export interface IMeshModule {
    name: string;
    onInit?(app: IMeshApp): void | Promise<void>;
    onBind?(): void | Promise<void>;
  }
  export interface IMeshApp {
    config: Record<string, unknown>;
  }
  export class ReactiveState {
    constructor(initialState: any);
  }
}
