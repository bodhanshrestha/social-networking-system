import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserDto } from './user.dto';
import { FindOptions } from 'src/shared/interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findAll() {
    return this.userModel.find();
  }

  async findOneById(id: string, options?: FindOptions): Promise<User | null> {
    return await this.userModel
      .findById(id)
      .select(options?.select || {})
      .lean();
  }
  async findOne(id: string, options?: FindOptions): Promise<User | null> {
    return await this.userModel
      .findById(id)
      .select(options?.select || {})
      .lean();
  }

  async findByIds(ids: string[], options?: FindOptions): Promise<User[]> {
    return await this.userModel
      .find({ _id: { $in: ids } })
      .select(options?.select || {})
      .sort(options?.sort || {})
      .lean();
  }

  async findMany(query: any, options?: FindOptions): Promise<User[]> {
    return await this.userModel
      .find(query)
      .select(options?.select || {})
      .sort(options?.sort || {})
      .lean();
  }

  async create(user: CreateUserDto) {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).lean();
  }
}
