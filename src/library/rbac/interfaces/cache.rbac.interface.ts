export interface ICacheRBAC {
  KEY: string;
  TTL: number;

  get(): any | null;

  /**
   *
   * @param value
   */
  set(value: any): void;

  del(): void;
}
