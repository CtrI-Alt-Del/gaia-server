export interface CacheProvider {
  set(key: string, value: unknown): Promise<void>
  get<Data = string>(key: string): Promise<Data | null>
  clear(key: string): Promise<void>
}
