import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from './entity/answer.entity';
import { Repository } from 'typeorm';
import { AnswerDto } from './dto/answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly answerRepository: Repository<AnswerEntity>,
  ) {}

  async create(answerData: AnswerDto) {
    if (!answerData.questionId) {
      throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST);
    }

    return this.answerRepository.save(answerData);
  }

  async count(questionId: number) {
    if (!questionId) return 0;

    return await this.answerRepository.countBy({
      questionId: String(questionId),
    });
  }

  async findAll(questionId: number, opt: { page: number; pageSize: number }) {
    if (!questionId) return [];

    return await this.answerRepository.find({
      where: { questionId: String(questionId) },
      skip: (opt.page - 1) * opt.pageSize,
      take: opt.pageSize,
    });
  }
}
