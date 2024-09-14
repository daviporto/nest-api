import {
  PaginationPresenter,
  PaginationPresenterProps,
} from '@/shared/infrastructure/presenters/pagination.presenter';
import { Exclude, Expose } from 'class-transformer';

export abstract class CollectionPresenter {
  @Exclude()
  protected paginationPresenter: PaginationPresenter;

  constructor(props: PaginationPresenterProps) {
    this.paginationPresenter = new PaginationPresenter(props);
  }

  @Expose({ name: 'meta' })
  get meta() {
    return this.paginationPresenter;
  }

  abstract get data(): any;
}
