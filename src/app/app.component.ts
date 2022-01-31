import {Component, OnInit} from '@angular/core';
import {NetWorkService} from './services/network.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public title = 'Scratchy';
  public network;


  constructor(private _networkService: NetWorkService) {
  }

  async ngOnInit(): Promise<void> {
    this.network = await this._networkService.getName();
  }

}
