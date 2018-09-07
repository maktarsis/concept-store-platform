import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { Stocklist } from '@shared/interfaces/stocklist.interface';
import { stocklist } from '@shared/constants/stocklist.constant';

@Component({
  selector: 'location-stocklist',
  templateUrl: './location-stocklist.component.html',
  styleUrls: ['./location-stocklist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationStocklistComponent implements OnInit {
  public stocklist: Stocklist[];

  public ngOnInit(): void {
    this.stocklist = stocklist;
  }

  public identify(index: number, item: any): number {
    return index;
  }
}