import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: UserDto) {
    return await this.userRepository.save(userData);
  }

  async findOne(username: string, password: string) {
    return await this.userRepository.findOne({
      where: { username, password },
    });
  }
}
