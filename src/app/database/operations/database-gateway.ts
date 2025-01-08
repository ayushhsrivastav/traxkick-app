// Dependencies
import {
  DeleteResult,
  Document,
  FindOptions,
  InsertManyResult,
  InsertOneResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';

// Local import
import database from '../connection';
import {
  Aggregate,
  Count,
  DeleteOne,
  FindOneAndUpdate,
  FindOneOptions,
  FindQueryOptions,
  InsertMany,
  InsertOne,
  UpdateManyOptions,
} from './database-gateway.interface';

class DatabaseGateway<T extends Document> {
  collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  count = async ({ query }: Count<T>): Promise<number> => {
    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.countDocuments(query);
  };

  findOne = async ({
    query,
    projection,
    sort,
  }: FindOneOptions<T>): Promise<WithId<T> | null> => {
    const options: FindOptions<Document> = {
      projection: projection,
      sort: sort,
    };

    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.findOne(query, options);
  };

  find = async ({
    query,
    projection,
    sort,
    skip,
    limit,
  }: FindQueryOptions<T>): Promise<WithId<T>[]> => {
    const options: FindOptions<Document> = {
      projection: projection,
      sort: sort,
      skip: skip,
      limit: limit,
    };
    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.find(query, options).toArray();
  };

  insertOne = async ({
    record,
  }: InsertOne<T>): Promise<InsertOneResult | ObjectId | null> => {
    const collection = database.fetchCollection<T>(this.collectionName);
    const response = await collection.insertOne(record);
    if (response.acknowledged && response.insertedId)
      return response.insertedId;
    else return response;
  };

  insertMany = async ({
    records,
  }: InsertMany<T>): Promise<InsertManyResult<T> | null> => {
    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.insertMany(records);
  };

  findOneAndUpdate = async ({
    query,
    update,
    options,
  }: FindOneAndUpdate<T>): Promise<WithId<T> | null> => {
    const queryOptions = options || { returnDocument: 'after' };
    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.findOneAndUpdate(query, update, queryOptions);
  };

  updateMany = async ({
    query,
    update,
    options,
  }: UpdateManyOptions<T>): Promise<UpdateResult<Document> | null> => {
    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.updateMany(query, update, options);
  };

  deleteOne = async ({ query }: DeleteOne<T>): Promise<DeleteResult> => {
    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.deleteOne(query);
  };

  aggregate = async ({
    pipleline,
    options,
  }: Aggregate<T>): Promise<Document[]> => {
    const collection = database.fetchCollection<T>(this.collectionName);
    return await collection.aggregate(pipleline, options).toArray();
  };
}

export default DatabaseGateway;
