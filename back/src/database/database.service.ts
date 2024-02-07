import {Db, MongoClient} from "mongodb";
import {Room} from "../model";
import {ConfigService} from "@nestjs/config";
import {Injectable, OnModuleInit} from "@nestjs/common";


@Injectable()
export class DatabaseService implements OnModuleInit {

    constructor(private configService: ConfigService) {
    }

    private _db: Db;

    onModuleInit(): any {
        const dbUrl: string = this.configService.get<string>('database.url')!;
        const dbName: string = this.configService.get<string>('database.name')!;
        this._db = new MongoClient(dbUrl).db(dbName);
    }

    get db() {
        return this._db;
    }


}