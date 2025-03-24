import { Module } from "@nestjs/common";
import { MongooseModule as NestMongooseModule } from "@nestjs/mongoose";


@Module({
  imports: [
    NestMongooseModule.forRoot(process.env.MONGO_URI ?? '', {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('✔️  ✔️  💽   MongoDB is connected   💽  ✔️  ✔️');

        });
        connection.on('disconnected', () => {
          console.log('❌  ❌  ❌   Mongodb disconnected   ❌  ❌  ❌');
        });
        connection.on('error', (error) => {
          console.log('Mongodb connection failed! for error: ', error);
        });
        connection._events.connected();
        return connection;
      }
    }),
  ],
})
export class MongooseModule { }