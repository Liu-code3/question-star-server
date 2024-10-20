import path from 'node:path';
import * as fs from 'node:fs';
import { Logger } from 'typeorm';

// 创建日志文件的路径
const logFilePath = path.join(process.cwd(), 'src', 'logs', 'custom.log');

if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

export class CustomLogger implements Logger {
  //  日志写入函数
  private writeLog(log: string) {
    const timestamp = this.formatDate(new Date());
    const logMessage = `${timestamp} -${log}\n`;
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to write log to file', err);
      }
    });
  }

  // 捕获查询日志
  // logQuery(query: string, parameters?: any[]) {
  //   const message = `Query: ${query} Parameters: ${JSON.stringify(parameters)}`;
  //   this.writeLog(message);
  // }
  logQuery() {}

  // 捕获错误日志
  logQueryError(error: string, query: string, parameters?: any[]) {
    const message = `Query Error: ${error} - Query: ${query} - Parameters: ${JSON.stringify(parameters)}`;
    this.writeLog(message);
  }

  // 捕获查询慢日志
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const message = `Slow Query: ${query} - Execution time: ${time}ms - Parameters: ${JSON.stringify(parameters)}`;
    this.writeLog(message);
  }

  // 捕获 Schema 相关日志
  logSchemaBuild(message: string) {
    this.writeLog(`Schema Build: ${message}`);
  }

  // 捕获普通日志
  // logMigration(message: string) {
  //   this.writeLog(`Migration: ${message}`);
  // }

  logMigration() {}

  log(level: 'log' | 'info' | 'warn', message: any) {
    this.writeLog(`${level.toUpperCase()}: ${message}`);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
