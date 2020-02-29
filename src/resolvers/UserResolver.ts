import {
  Resolver,
  Arg,
  Query,
  Mutation,
  FieldResolver,
  Root,
  Authorized
} from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import User, {
  CreateUserInput,
  LoginResponse,
  LoginInput
} from "../models/User";
import Post from "../models/Post";

@Resolver(of => User)
export default class UserResolver {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Post)
  private postRepository: Repository<Post>;

  @Authorized()
  @Query(returns => [User])
  async users() {
    return this.userRepository.find();
  }

  @Authorized()
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

  @Mutation(returns => LoginResponse)
  async login(@Arg("data") { username, password }: LoginInput) {
    const user = await this.userRepository.findOneOrFail({
      where: { username },
      select: ["id", "username", "password"]
    });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Password not correct");
    }

    const { password: userPassword, ...filteredUser } = user;
    const token = jwt.sign(filteredUser, "secret");

    return { token, user: filteredUser };
  }

  @FieldResolver()
  async posts(@Root() user: User) {
    return this.postRepository.find({ where: { author: { id: user.id } } });
  }
}
