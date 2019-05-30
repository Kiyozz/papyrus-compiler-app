import { Injectable } from '@angular/core'
import { BehaviorSubject, forkJoin, Observable, Subject, timer } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class InitializationService {
  private initialization$: Subject<boolean> = new BehaviorSubject<boolean>(false)
  private initializers: Observable<any>[] = []

  constructor() {
    timer(500)
      .pipe(
        switchMap(() => forkJoin(this.initializers))
      )
      .subscribe(() => {
        this.initialize()
      })
  }

  whenInitializationChanges(): Observable<boolean> {
    return this.initialization$.asObservable()
  }

  initialize() {
    this.initialization$.next(true)
  }

  register(obs: Observable<any>) {
    this.initializers = [...this.initializers, obs]
  }
}
