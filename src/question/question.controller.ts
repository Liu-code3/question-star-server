import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';
import { QuestionEntity } from './entity/question.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  // @Get()
  // test() {
  //   throw new HttpException('获取数据失败', HttpStatus.BAD_REQUEST);
  // }

  @Get()
  findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ): Promise<{ records: QuestionEntity[]; total: number }> {
    return this.questionService.findAll({ keyword, page, pageSize });
  }

  @Get(':id')
  findOne(@Param('id') _id: number): Promise<QuestionEntity> {
    return this.questionService.findOne(_id);
  }

  @Post()
  async create(
    @Body() createQuestionDto: QuestionDto,
  ): Promise<QuestionEntity> {
    return await this.questionService.create(createQuestionDto);
  }

  // @Get()
  // findOne(
  //   @Query('keyword') keyword: string,
  //   @Query('page') page: number,
  //   @Query('pageSize') size: number,
  // ) {
  //   return {
  //     name: 'pangkun',
  //     keyword,
  //     page,
  //     size,
  //   };
  // }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateQuestionDto: QuestionDto,
  ) {
    const { affected } = await this.questionService.update(
      id,
      updateQuestionDto,
    );
    return affected > 0 ? '更新成功' : '更新失败';
  }
}
