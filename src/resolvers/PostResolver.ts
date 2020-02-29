import {
  Resolver,
  Query,
  Arg,
  FieldResolver,
  Root,
  Mutation,
  Args,
  Authorized,
  Ctx
} from "type-graphql";
import Post, { CreatePostInput } from "../models/Post";
import { Repository, In } from "typeorm";
import User from "../models/User";
import { InjectRepository } from "typeorm-typedi-extensions";
import Context from "../types/Context";

@Resolver(of => Post)
export default class PostResolver {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Post)
  private postRepository: Repository<Post>;

  @Authorized()
  @Query(returns => [Post])
  async posts() {
    return this.postRepository.find();
  }

  @Authorized()
  @Query(returns => Post)
  async post(@Arg("id") id: number) {
    return this.postRepository.findOneOrFail(id);
  }

  @Authorized()
  @Mutation(returns => Post)
  async createPost(
    @Arg("data") { content }: CreatePostInput,
    @Ctx() { user }: Context
  ) {
    const author = await this.userRepository.findOneOrFail(user.id);
    const post = this.postRepository.create({ content, author });
    return this.postRepository.save(post);
  }

  @FieldResolver()
  async author(@Root() post: Post) {
    return this.userRepository.findOneOrFail({ where: { posts: In([post]) } });
  }
}
