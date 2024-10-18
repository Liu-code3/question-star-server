import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from './entity/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async create({ title, desc }) {
    return await this.questionRepository.save({
      title,
      desc,
    });
  }

  async delete(id: number) {
    return await this.questionRepository.delete({ _id: id });
  }

  async findOne(id: number) {
    return await this.questionRepository.findOne({
      where: { _id: id },
    });
  }

  async update(id: number, { title, desc }) {
    return await this.questionRepository.update(id, {
      title,
      desc,
    });
  }

  async findAll({ keyword = '', page = 1, pageSize = 10 }) {
    const records = await this.questionRepository
      .createQueryBuilder('question') // 创建查询构建器
      .where('question.title like :keyword', { keyword: `%${keyword}%` }) // 通过 where 方法添加条件，筛选标题包含关键词的问题。
      .orderBy('question._id', 'DESC') // 按_id降序排序
      .skip((page - 1) * pageSize) // 分页
      .take(pageSize) // 限制查询结果的数量为 pageSiz
      .getMany();
    const total = await this.questionRepository.count();
    return {
      page,
      pageSize,
      records,
      total,
    };
  }
}
