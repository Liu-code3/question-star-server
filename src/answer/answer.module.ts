import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerEntity } from './entity/answer.entity';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerEntity]), QuestionModule],
  exports: [AnswerService],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
