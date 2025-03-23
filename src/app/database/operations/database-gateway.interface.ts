import {
  AggregateOptions,
  Filter,
  FindOneAndUpdateOptions,
  OptionalUnlessRequiredId,
  Sort,
  UpdateFilter,
  UpdateOptions,
  Document,
} from 'mongodb';

export interface Count<T extends Document> {
  query: Filter<T>;
}

export interface FindOneOptions<T extends Document> {
  query: Filter<T>;
  projection?: Document;
  sort?: Sort;
}

export interface FindQueryOptions<T extends Document> {
  query: Filter<T>;
  projection?: Document;
  sort?: Sort;
  skip?: number;
  limit?: number;
}

export interface InsertOne<T extends Document> {
  record: OptionalUnlessRequiredId<T>;
}

export interface InsertMany<T extends Document> {
  records: ReadonlyArray<OptionalUnlessRequiredId<T>>;
}

export interface FindOneAndUpdate<T extends Document> {
  query: Filter<T>;
  update: UpdateFilter<T>;
  options: FindOneAndUpdateOptions;
}

export interface UpdateManyOptions<T extends Document> {
  query: Filter<T>;
  update: UpdateFilter<T> | Document[];
  options: UpdateOptions;
}

export interface DeleteOne<T extends Document> {
  query: Filter<T>;
}

export interface Aggregate<T extends Document> {
  pipleline: T[];
  options?: AggregateOptions;
}
