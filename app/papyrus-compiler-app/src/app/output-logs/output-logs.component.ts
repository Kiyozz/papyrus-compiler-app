import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CompilationService } from '../compilation.service';
import { Subscription } from 'rxjs';
import { OutputLogsService } from '../output-logs.service';

@Component({
  selector: 'app-output-logs',
  templateUrl: './output-logs.component.html',
  styleUrls: ['./output-logs.component.scss']
})
export class OutputLogsComponent implements OnInit, OnDestroy {
  logs: string;
  showLogs = false;
  private logsSubscription: Subscription;

  constructor(private compilationService: CompilationService,
              private logsService: OutputLogsService) {
  }

  ngOnInit() {
    this.logsSubscription = this.logsService.logs.subscribe(logs => {
      this.logs = logs;
    });
    if (!this.logs) {
      this.logsService.requestCurrentLogs();
    }
  }

  ngOnDestroy(): void {
    this.logsSubscription.unsubscribe();
  }

  onClickShowLogs(e: MouseEvent): void {
    e.preventDefault();
    this.showLogs = true;
  }

  onClickClearLogs(e: MouseEvent): void {
    e.preventDefault();

    this.logsService.clear();
    this.showLogs = false;
  }

  @HostListener('document:keydown.escape')
  onKeyboardEsc(): void {
    if (this.showLogs) {
      this.showLogs = false;
    }
  }

}
