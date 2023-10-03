import { prop } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"

export interface ActorModule extends Base{}

export class ActorModel extends TimeStamps{
    @prop()
    _id
    @prop()
    name: string
    @prop({unique: true})
    slug: string
    @prop()
    photo: string
}