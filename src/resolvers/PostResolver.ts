import {
  Resolver,
  Query,
  Arg,
  FieldResolver,
  Root,
  Mutation,
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
    return this.postRepository.find({ relations: ["likedBy"] });
  }

  @Authorized()
  @Query(returns => Post)
  async post(@Arg("id") id: number) {
    return this.postRepository.findOneOrFail(id, { relations: ["likedBy"] });
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

  @Authorized()
  @Mutation(returns => Post)
  async likePost(@Arg("id") id: number, @Ctx() { user }: Context) {
    const likingUser = await this.userRepository.findOneOrFail(user.id);
    const post = await this.postRepository.findOneOrFail(id, {
      relations: ["likedBy"]
    });
    
    const alreadyLiked = post.likedBy.some(liking => liking.id === user.id)
    
    if (!alreadyLiked)
      post.likedBy.push(likingUser);
    return this.postRepository.save(post);
  }

  @Authorized()
  @Mutation(returns => Post)
  async unlikePost(@Arg("id") id: number, @Ctx() { user }: Context) {
    const post = await this.postRepository.findOneOrFail(id, {
      relations: ["likedBy"]
    });
    post.likedBy = post.likedBy.filter(likedUser => likedUser.id !== user.id);
    return this.postRepository.save(post);
  }

  @FieldResolver()
  async author(@Root() post: Post) {
    return this.userRepository.findOneOrFail({ where: { posts: In([post]) } });
  }
}
