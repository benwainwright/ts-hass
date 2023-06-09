export interface Logger {
  info: (message: string) => void;
  debug: (message: string) => void;
  trace: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string | Error) => void;
}
