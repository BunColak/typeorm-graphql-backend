import BaseModel from "./BaseModel";
import { Entity, Column } from "typeorm";
import { MinLength, IsNotEmpty  } from 'class-validator'
import { ObjectType, Field, InputType } from "type-graphql";

@Entity()
@ObjectType({implements: BaseModel})
export default class User extends BaseModel {
    
    @Column({unique: true})
    @Field()
    username: string;
    
    @Column()
    @MinLength(6, {message: "Password cannot be shorter than 6"})
    password: string;
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