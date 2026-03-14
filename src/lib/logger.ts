/**
 * Production-safe logger that outputs structured logs
 * In production, these go to Vercel logs (viewable in dashboard)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  reportId?: string;
  url?: string;
  duration?: number;
  error?: any;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private log(level: LogLevel, message: string, data?: LogContext) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...this.context,
      ...data,
    };

    // In production, this goes to Vercel logs
    // In development, it's more readable
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logData));
    } else {
      const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
      const contextStr = Object.keys(logData)
        .filter((k) => !['timestamp', 'level', 'message'].includes(k))
        .map((k) => `${k}=${JSON.stringify((logData as any)[k])}`)
        .join(' ');

      console.log(`${prefix} ${message}${contextStr ? ' ' + contextStr : ''}`);
    }
  }

  debug(message: string, data?: LogContext) {
    this.log('debug', message, data);
  }

  info(message: string, data?: LogContext) {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogContext) {
    this.log('warn', message, data);
  }

  error(message: string, error?: any, data?: LogContext) {
    this.log('error', message, {
      ...data,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    });
  }

  // Performance tracking
  startTimer() {
    return Date.now();
  }

  endTimer(startTime: number, label: string, data?: LogContext) {
    const duration = Date.now() - startTime;
    this.info(`${label} completed`, { ...data, duration });
    return duration;
  }
}

export const logger = new Logger();
