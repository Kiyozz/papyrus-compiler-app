import { Component, OnInit } from '@angular/core';
import { CompilationService } from '../compilation.service';
import { OutputLogsService } from '../output-logs.service';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss']
})
export class OutputComponent implements OnInit {
  initialized = false;
  scripts: string[];
  successScripts: string[] = [];
  errorScripts: string[] = [];
  noScriptMessage = '';
  currentScriptInCompilation = '';
  compilationIsConfirmed = false;
  numberOfCompiledScripts = 0;
  maxNumberOfCompiledScripts = 0;

  constructor(private compilationService: CompilationService,
              private logsService: OutputLogsService) {
  }

  async ngOnInit() {
    const scripts = await this.compilationService.getAllScripts();
    this.scripts = scripts;

    if (scripts.length === 0) {
      this.scripts = [];
      this.noScriptMessage = 'Please provide scripts in "Compile" section.';
    }

    this.initialized = true;
  }

  async handleScripts(scripts: string[]) {
    this.logsService.clear();
    this.maxNumberOfCompiledScripts = scripts.length;

    for (const script of scripts) {
      this.currentScriptInCompilation = script;
      try {
        await this.compilationService.compile(script);
        this.successScripts = [...this.successScripts, script];
      } catch (e) {
        console.log(e);
        this.errorScripts = [...this.errorScripts, script];
      }
      this.numberOfCompiledScripts++;
    }

    this.currentScriptInCompilation = '';
  }

  onClickConfirm(e: MouseEvent) {
    e.preventDefault();

    this.compilationIsConfirmed = true;
    this.handleScripts(this.scripts);
  }

  onClickRetryErrors(e: MouseEvent): void {
    e.preventDefault();

    if (this.errorScripts && this.errorScripts.length > 0) {
      const scripts = this.errorScripts;
      this.errorScripts = [];
      this.handleScripts(scripts);
    }
  }

  get progress() {
    let progress = 0;

    if (this.maxNumberOfCompiledScripts === 0) {
      progress = 100;
    } else {
      progress = Math.round(this.numberOfCompiledScripts / this.maxNumberOfCompiledScripts * 100);

      if (progress > 100) {
        progress = 100;
      }
    }

    return progress;
  }

  isCompiling(script: string) {
    return this.currentScriptInCompilation === script;
  }

  isSuccess(script: string) {
    return this.successScripts.includes(script);
  }

  isError(script: string) {
    return this.errorScripts.includes(script);
  }

  get isCompilingAnyScript(): boolean {
    return this.currentScriptInCompilation !== '';
  }
}
