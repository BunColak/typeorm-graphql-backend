import BaseModel from "./BaseModel";
import { Entity, Column, ManyToOne, ManyToMany, JoinTable, RelationCount } from "typeorm";
import User from "./User";
import { ObjectType, Field, InputType } from "type-graphql";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
@ObjectType({implements: BaseModel})
export default class Post extends BaseModel {
    
    @Column()
    @Field()
    content: string;
    
    @ManyToOne(type => User, user => user.posts)
    @Field(type => User)
    author: User;

    @ManyToMany(type => User, user => user.liked)
    @JoinTable()
    @Field(type => [User])
    likedBy: User[];

    @RelationCount((post: Post) => post.likedBy)
    @Field()
    likedByCount: number;
}

@InputType()
export class CreatePostInput {
    @Field()
    @Length(1, 140)
    content: string;
}