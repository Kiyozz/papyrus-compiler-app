import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { InitializationService } from './common/services/initialization.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  initialized: Observable<boolean>

  constructor(private initializationService: InitializationService) {}

  ngOnInit() {
    this.initialized = this.initializationService.whenInitializationChanges()
  }
}
