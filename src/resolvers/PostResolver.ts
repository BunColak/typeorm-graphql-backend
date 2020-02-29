import { Resolver, Query, Arg, FieldResolver, Root, Mutation, Args } from "type-graphql";
import Post, { CreatePostInput } from "../models/Post";
import { Repository, In } from "typeorm";
import User from "../models/User";
import { InjectRepository } from "typeorm-typedi-extensions";

@Resolver(of => Post)
export default class PostResolver {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Post)
  private postRepository: Repository<Post>;

  @Query(returns => [Post])
  async posts() {
    return this.postRepository.find();
  }

  @Query(returns => Post)
  async post(@Arg("id") id: number) {
    return this.postRepository.findOneOrFail(id);
  }

  @Mutation(returns => Post)
  async createPost(@Arg('data') {content}: CreatePostInput) {
    // TODO get user from auth  
    const user = await this.userRepository.find()
    const post = this.postRepository.create({content, author: user[0]})
    return this.postRepository.save(post)
  }

  @FieldResolver()
  async author(@Root() post: Post) {
    return this.userRepository.findOneOrFail({ where: { posts: In([post]) } });
  }
}
