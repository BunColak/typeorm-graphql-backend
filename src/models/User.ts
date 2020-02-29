import BaseModel from "./BaseModel";
import { Entity, Column, OneToMany } from "typeorm";
import { MinLength, IsNotEmpty  } from 'class-validator'
import { ObjectType, Field, InputType } from "type-graphql";
import Post from "./Post";

@Entity()
@ObjectType({implements: BaseModel})
export default class User extends BaseModel {
    
    @Column({unique: true})
    @Field()
    username: string;
    
    @Column({select: false})
    @MinLength(6, {message: "Password cannot be shorter than 6"})
    password: string;

    @OneToMany(type => Post, post => post.author)
    @Field(type => [Post])
    posts: Post[];
}

@ObjectType()
export class LoginResponse {

    @Field()
    token: string;
    
    @Field()
    user: User
}

@InputType()
export class CreateUserInput {
    
    @Field()
    @IsNotEmpty()
    username: string;
    
    @Field()
    @IsNotEmpty()
    @MinLength(6, {message: "Password cannot be shorter than 6"})
    password: string;
}

@InputType()
export class LoginInput {
    @Field()
    @IsNotEmpty()
    username: string;
    
    @Field()
    @IsNotEmpty()
    @MinLength(6, {message: "Password cannot be shorter than 6"})
    password: string;
}