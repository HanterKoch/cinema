import { Body, Controller, Get, HttpCode, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService){}

    @Get('profile')
    @Auth()
    async getProfile(@User('_id') _id:string){
        return this.userService.byId(_id)
    }

    @UsePipes(new ValidationPipe())
    @Put('profile')
    @HttpCode(200)
    @Auth()
    async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto){
        return this.userService.updateProfile(_id, dto)
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async updateUser(@User('_id') _id: string, @Body() dto: UpdateUserDto){
        return this.userService.updateProfile(_id, dto)
    }
}
