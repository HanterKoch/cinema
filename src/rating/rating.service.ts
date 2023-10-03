import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { RatingModel } from './rating.model';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class RatingService {
    constructor(@InjectModel(RatingModel) private readonly RatingModel: ModelType<RatingModel>, private readonly movieService: MovieService){}
}
