import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutputLogsService {
  private _logs = '';
  private logsSubject: Subject<string> = new Subject<string>();
  logs: Observable<string> = this.logsSubject.asObservable();

  constructor() {
  }

  add(log: string): void {
    this._logs += log;
    this.triggerUpdate();
  }

  clear(): void {
    this._logs = '';
    this.triggerUpdate();
  }

  requestCurrentLogs() {
    this.triggerUpdate();
  }

  private triggerUpdate() {
    this.logsSubject.next(this._logs);
  }
}
