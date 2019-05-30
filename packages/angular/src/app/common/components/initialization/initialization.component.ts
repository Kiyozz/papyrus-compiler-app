import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs'

@Component({
  selector: 'app-initialization',
  templateUrl: './initialization.component.html',
  styleUrls: ['./initialization.component.scss']
})
export class InitializationComponent implements OnInit {
  stuckMessage: string

  constructor() { }

  ngOnInit() {
    timer(10000)
      .subscribe(() => {
        this.stuckMessage = 'The application seems stuck. Try restart the application.'
      })
  }

}
