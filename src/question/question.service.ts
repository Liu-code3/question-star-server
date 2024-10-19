import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from './entity/question.entity';
import { In, Like, Repository } from 'typeorm';
import { QuestionDto } from './dto/question.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async create(dto: QuestionDto) {
    return await this.questionRepository.save(dto);
  }

  async delete(id: number, author: string) {
    return await this.questionRepository.delete({ _id: id, author });
  }

  async deleteMany(ids: number[], author: string) {
    // TypeORM 需要使用 $in 操作符来匹配数组中的多个值。
    return await this.questionRepository.delete({ _id: In(ids), author });
  }

  async findOne(id: number) {
    return await this.questionRepository.findOne({
      where: { _id: id },
    });
  }

  async updateOne(id: number, dto: QuestionDto, author: string) {
    return await this.questionRepository.update({ _id: id, author }, dto);
  }

  async findAll({
    keyword = '',
    page = 1,
    pageSize = 10,
    isDeleted = false,
    isStar = false,
    author = '',
  }) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _self = this;
    const [list, total] = await this.questionRepository.findAndCount({
      where: {
        title: Like(`%${keyword}%`),
        isDeleted: _self.stringToBoolean(isDeleted),
        isStar: _self.stringToBoolean(isStar),
        author,
      },
      order: {
        _id: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { list, total };
  }

  async duplicate(id: number, author) {
    const question = await this.questionRepository.findOne({
      where: { _id: id, author },
    });

    const newQuestion = {
      ...question,
      _id: undefined, // 清除 ID，让数据库自动生成新的 ID
      createdAt: undefined,
      updatedAt: undefined,
      title: `${question.title} 副本`,
      author,
      componentList: question.componentList.map((item) => ({
        ...item,
        fe_id: nanoid(),
      })),
    };

    return await this.questionRepository.save(newQuestion);
  }

  private stringToBoolean<T extends boolean | string>(str: T): boolean {
    if (typeof str === 'boolean') {
      return str;
    }

    if (typeof str === 'string') {
      const lowerStr = str.trim().toLowerCase();
      if (lowerStr === 'true') {
        return true;
      } else if (lowerStr === 'false') {
        return false;
      } else {
        throw new Error('Invalid boolean string');
      }
    }

    // 如果传入的类型既不是 boolean 也不是 string，则抛出错误
    throw new TypeError('Input must be a string or boolean');
  }
}
