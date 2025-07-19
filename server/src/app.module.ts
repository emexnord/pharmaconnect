import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './modules/event/event.module';
import { NotesModule } from './modules/notes/notes.module';
import { RequestModule } from './modules/request/request.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';

@Module({
  imports: [EventModule, NotesModule, RequestModule, PharmacyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
