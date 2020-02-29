import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'
import { InterfaceType, Field } from 'type-graphql';

@InterfaceType()
export default class BaseModel extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @CreateDateColumn()
    @Field()
    createdAt: number;

    @UpdateDateColumn()
    @Field()
    updatedAt: number;
}