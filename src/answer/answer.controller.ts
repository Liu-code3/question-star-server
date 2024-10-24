import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerDto } from './dto/answer.dto';
import { Public } from '../auth/decorators/public.decorators';
import { QuestionDto } from '../question/dto/question.dto';
import { QuestionService } from '../question/question.service';

@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}

  @Public()
  @Post()
  async create(@Body() body: AnswerDto) {
    return await this.answerService.create(body);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.questionService.findOne(id);
  }

  @Public()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: QuestionDto) {
    return await this.questionService.updateOne(id, body, '');
  }
}
