import { BadRequestException, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import {hash, getSalt, compare, genSalt} from 'bcryptjs'

@Injectable()
export class AuthService {

    constructor( @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {
    }

    async register(dto: AuthDto){
        const oldUser = await this.UserModel.findOne({email: dto.email})
        if(oldUser)
            throw new BadRequestException('User with this email is already in the system')

        const salt = await genSalt(10)

        const newUser = new this.UserModel({
            email: dto.email,
            password: await hash(dto.password, salt)
        }
        )
        return newUser.save()
    }
}
