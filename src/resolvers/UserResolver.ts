import {
  Resolver,
  Arg,
  Query,
  Mutation,
  FieldResolver,
  Root
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import User, { CreateUserInput } from "../models/User";
import Post from "../models/Post";

@Resolver(of => User)
export default class UserResolver {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Post)
  private postRepository: Repository<Post>;

  @Query(returns => [User])
  async users() {
    return this.userRepository.find();
  }

  @Query(returns => User)
  async user(@Arg("username") username: string) {
    return this.userRepository.findOneOrFail({ where: { username } });
  }

  @Mutation(returns => User)
  async createUser(@Arg("data") { username, password }: CreateUserInput) {
    const hashedPass = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashedPass });
    return this.userRepository.save(user);
  }

  @FieldResolver()
  async posts(@Root() user: User) {
    return this.postRepository.find({ where: { author: { id: user.id } } });
  }
}
