export interface IOutput {
  flush(): Promise<void>;
  supportsAnsiEscapes(): boolean;
  write(text: string): void;
}
