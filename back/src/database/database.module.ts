import {Module} from '@nestjs/common';
import {DatabaseService} from "./database.service";
import {GameService} from "./game.service";
import {RoomService} from "./room.service";

@Module({
    providers: [DatabaseService, GameService, RoomService],
    exports: [RoomService, GameService]
})
export class DatabaseModule {
}
