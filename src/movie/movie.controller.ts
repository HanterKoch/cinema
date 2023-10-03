import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateMovieDto } from './create-movie.dto';
import { MovieService } from './movie.service';
import { Types } from 'mongoose';

@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService){}

    @Get('by-slug/:slug')
    @Auth()
    async bySlug(@Param('slug') slug: string){
        return this.movieService.bySlug(slug)
    }

    @Get('by-actor/:actorId')
    async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId){
        return this.movieService.byActor(actorId)
    }

    @Post('by-genres/')
    @HttpCode(200)
    async byGenres(@Body('genresId') genresId: Types.ObjectId[]){
        return this.movieService.byGenres(genresId)
    }

    @Get()
    async getAll(@Query('searchTerm') searchTerm?:string){
        return this.movieService.getAll(searchTerm)
    }

    @Get('most-populear')
    async getMostPopular(){
        return this.movieService.getMostPopular()
    }

    @Post('update-count-opened')
    @HttpCode(200)
    @Auth('admin')
    async updateCountOpened(@Body('slug') slug: string){
        return this.movieService.updateCountOpened(slug)
    }

    @Get(':id')
    @Auth('admin')
    async get(@Param('id', IdValidationPipe) id: string){
        return this.movieService.byId(id)
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async update(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateMovieDto){
        return this.movieService.update(id, dto)
    }

    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async delete(@Param('id', IdValidationPipe) id: string){
        return this.movieService.delete(id)
    }

    @UsePipes(new ValidationPipe())
    @Post(':id')
    @HttpCode(200)
    @Auth('admin')
    async create(){
        return this.movieService.create()
    }
}
