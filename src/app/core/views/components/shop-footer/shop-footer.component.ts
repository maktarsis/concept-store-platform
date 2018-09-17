import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material';

import {
  Subject,
  fromEvent
} from 'rxjs';
import {
  takeUntil,
  distinctUntilChanged,
  map,
  pairwise,
  debounceTime
} from 'rxjs/operators';

import { OrdersComponent } from '@shared/dialogs/orders/orders.component';
import {
  returnPolicy,
  shippingHandling
} from '@shared/constants/shop-rules.constants';
import { Direction } from '@core/shared/enums/direction.enum';
import { VisibilityState } from '@core/shared/enums/visibility-state.enum';
import { footerAnimation } from '@app/core/shared/animations/footer.animation';

@Component({
  selector: 'shop-footer',
  templateUrl: './shop-footer.component.html',
  styleUrls: ['./shop-footer.component.scss'],
  animations: [footerAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopFooterComponent implements AfterViewInit, OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isVisible: boolean;

  @HostBinding('@toggleFooter')
  get toggle(): VisibilityState {
    return this.isVisible ? VisibilityState.Visible : VisibilityState.Hidden;
  }

  constructor(
      private cdr: ChangeDetectorRef,
      private dialog: MatDialog
  ) {
  }

  public ngAfterViewInit(): void {
    const scroll$ = fromEvent(window, 'scroll').pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(5),
        map(() => window.pageYOffset),
        pairwise(),
        map(([y1, y2]): Direction => y1 === y2 ? null :
            y1 > y2 ? Direction.Up : Direction.Down),
        distinctUntilChanged()
    );

    scroll$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((direction: Direction) => {
          switch (direction) {
            case Direction.Up:
              this.isVisible = false;
              this.cdr.markForCheck();
              break;
            case Direction.Down:
              this.isVisible = true;
              this.cdr.markForCheck();
              break;
            default:
              return;
          }
        });
  }

  public ngOnInit(): void {
    this.isVisible = false;
  }

  public openShippingHandling(): void {
    this.dialog.open(OrdersComponent, {
      height: '500px',
      width: '600px',
      data: shippingHandling
    });
  }

  public openReturnPolicy(): void {
    this.dialog.open(OrdersComponent, {
      height: '500px',
      width: '600px',
      data: returnPolicy
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
