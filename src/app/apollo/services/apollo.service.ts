import { Injectable } from '@angular/core';
import { MyApolloModule } from '../apollo.module';

import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Order } from '../../shared/interfaces/order.interface';
import { Apparel } from '../../shop/shared/apparel.interface';
import {
  Access,
  CatchPhraseConfig,
  User
} from '../../auth/interfaces/user.interface';
import {
  allApparel,
  addOrder,
  allOrders,
  signIn,
  signUp,
  setCatchPhrase,
  user
} from '../queries';

@Injectable({ providedIn: MyApolloModule })
export class ApolloService {
  constructor(private apollo: Apollo) {
  }

  public getAllApparel(): Observable<Apparel[]> {
    return this.apollo
        .watchQuery({
          pollInterval: 500,
          query: allApparel
        })
        .valueChanges
        .pipe(map((res: any) => res.data.allApparel));
  }

  public getAllOrders(): Observable<Order[]> {
    return this.apollo
        .watchQuery({
          pollInterval: 500,
          query: allOrders
        })
        .valueChanges
        .pipe(map((res: any) => res.data.allOrders));
  }

  public addOrder({ name, phone, address }: Order): Observable<Order> {
    return this.apollo
        .mutate({
          mutation: addOrder,
          variables: {
            name,
            phone,
            address
          }
        })
        .pipe(map((res: any) => res.data.addOrder));
  }

  public signUp({ email, password }: Access): Observable<User> {
    return this.apollo
        .mutate({
          mutation: signUp,
          variables: {
            email,
            password
          }
        })
        .pipe(map((res: any) => res.data.signUp));
  }

  public setCatchPhrase({ id, catchPhrase }: CatchPhraseConfig): Observable<User> {
    return this.apollo
        .mutate({
          mutation: setCatchPhrase,
          variables: {
            id,
            catchPhrase
          }
        })
        .pipe(map((res: any) => res.data.setCatchPhrase));
  }

  public signIn({ email, password }: Access): Observable<User> {
    return this.apollo
        .query({
          query: signIn,
          variables: {
            email,
            password
          }
        })
        .pipe(map((res: any) => res.data.signIn));
  }

  public fetchUser(id: string): Observable<User> {
    return this.apollo
        .query({
          query: user,
          variables: {
            id
          }
        })
        .pipe(map((res: any) => res.data.user));
  }
}