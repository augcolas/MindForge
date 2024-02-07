import { Db } from "mongodb";
import { Room } from "../model";

export class GameService {
  db : Db;

  constructor(db:Db) {
    this.db = db;
  }

  public async create(room: Room, deck: any): Promise<void> {
    await this.db.collection('game').insertOne({
        ...room,
        deck: deck
    });
  }
}