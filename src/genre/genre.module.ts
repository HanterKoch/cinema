import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import {GenreModel} from './genre.model'
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
          typegooseClass: GenreModel,
          schemaOptions: {
              collection: 'Genre'
          }
      }
  ]),
  ],
  controllers: [GenreController],
  providers: [GenreService]
})
export class GenreModule {}
