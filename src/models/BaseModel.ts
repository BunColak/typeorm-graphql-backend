import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'
import { InterfaceType, Field } from 'type-graphql';

@InterfaceType()
export default class BaseModel extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @CreateDateColumn()
    @Field(type => Date)
    createdAt: Date;

    @UpdateDateColumn()
    @Field(type => Date)
    updatedAt: Date;
}