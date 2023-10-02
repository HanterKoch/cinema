import { Prop, prop } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"

export interface UserModule extends Base{}

export class UserModel extends TimeStamps{
    @Prop()
    _id: string
    @prop({unique: true})
    email: string
    @prop()
    password: string
    @prop({default: false})
    isAdmin: boolean
    @prop({default: []})
    favorites?: []
}