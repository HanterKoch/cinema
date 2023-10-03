import { Ref } from "@typegoose/typegoose";
import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from "class-validator";
import { ActorModel } from "src/actor/actor.model";

export class Parameters {
    @IsNumber()
    year: number
    @IsNumber()
    duration: number
    @IsString()
    country: string
}

export class CreateMovieDto {
    @IsString()
    poster: string
    @IsString()
    bigPoster: string
    @IsString()
    title: string
    @IsObject()
    parameters?: Parameters
    @IsString()
    slug: string
    @IsString()
    videoUrl: string
    @IsArray()
    @IsString({each: true})
    genres: string[]
    @IsArray()
    @IsString({each: true})
    actors: Ref<ActorModel>[]

    isSendTelegram: boolean

}