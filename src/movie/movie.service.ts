import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { CreateMovieDto } from './create-movie.dto'
import { MovieModel } from './movie.model'
import { NOTFOUND } from 'dns'
import { type } from 'os'
import { types } from '@typegoose/typegoose'
import { exec } from 'child_process'

@Injectable()
export class MovieService {
    telegramService: any
	constructor(
		@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>
	) {}

	async getAll(searchTerm?: string): Promise<DocumentType<MovieModel>[]> {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i'),
					},
				],
			}
		}

		return this.movieModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('genres actors')
			.exec()
	}

	async bySlug(slug: string): Promise<DocumentType<MovieModel>> {
		return this.movieModel.findOne({ slug }).populate('genres actors').exec()
	}

	async byActor(actorId: Types.ObjectId): Promise<DocumentType<MovieModel>[]> {
		return this.movieModel.find({ actors: actorId }).exec()
	}

    async updateRating(id: Types.ObjectId, newRating: number) {
        return this.movieModel.findByIdAndUpdate(id, {
            rating: newRating
        },
        {
            new: true
        }).exec()
    }

	async byGenres(
		genreIds: Types.ObjectId[]
	): Promise<DocumentType<MovieModel>[]> {
		return this.movieModel.find({ genres: { $in: genreIds } }).exec()
	}

	async updateCountOpened(slug: string) {
		return this.movieModel
			.findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } })
			.exec()
	}

	async byId(id: string): Promise<DocumentType<MovieModel>> {
		return this.movieModel.findById(id).exec()
	}

	async create(): Promise<Types.ObjectId> {
		const defaultValue: CreateMovieDto = {
            bigPoster: '',
            actors: [],
            genres: [],
            poster: '',
            title: '',
            videoUrl: '',
            slug: '',
            isSendTelegram: false
        }
		const movie = await this.movieModel.create(defaultValue)
		return movie._id
	}

	async delete(id: string): Promise<DocumentType<MovieModel> | null> {
		return this.movieModel.findByIdAndDelete(id).exec()
	}

	async getMostPopular(): Promise<DocumentType<MovieModel>[]> {
		return this.movieModel
			.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

    async update(_id: string, dto: CreateMovieDto) {
        const updateDoc = await this.movieModel.findByIdAndUpdate(_id, dto, {
            new: true,
        })
        if (!updateDoc) throw new NotFoundException('Movie not found')
        return updateDoc
    }

    async sendNotification(dto: CreateMovieDto) {
        if(process.env.NODE_ENV !== 'developmenst')
            await this.telegramService.sendPhoto(dto.poster)
        const msg = `<b>${dto.title}<b>\n\n`
        await this.telegramService.sendMessage(msg, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            url: '',
                            text: 'Go to watch'
                        }
                    ]
                ]
            }
        })
    }
}
