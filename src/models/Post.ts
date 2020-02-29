import BaseModel from "./BaseModel";
import { Entity, Column, ManyToOne } from "typeorm";
import User from "./User";
import { ObjectType, Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@Entity()
@ObjectType({implements: BaseModel})
export default class Post extends BaseModel {
    
    @Column()
    @Field()
    content: string;
    
    @ManyToOne(type => User, user => user.posts)
    @Field(type => User)
    author: User;
}

@InputType()
export class CreatePostInput {
    @Field()
    @Length(1, 140)
    content: string;
}