import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
    @Query('isDeleted') isDeleted = false,
    @Query('isStar') isStar: boolean,
    @Req() req,
  ): Promise<{ list: QuestionEntity[]; total: number }> {
    const { username } = req.user;
    return this.questionService.findAll({
      keyword,
      page,
      pageSize,
      isDeleted,
      isStar,
      author: username,
    });
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

  @Patch(':id')
  async updateOne(
    @Param('id') id: number,
    @Body() updateQuestionDto: QuestionDto,
    @Req() req,
  ) {
    const { username } = req;
    const { affected } = await this.questionService.updateOne(
      id,
      updateQuestionDto,
      username,
    );
    return affected > 0 ? '更新成功' : '更新失败';
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number, @Req() req) {
    return this.questionService.delete(id, req.user.username);
  }

  @Delete()
  deleteMany(@Body() body: { ids: number[] }, @Req() req) {
    const { ids } = body;
    const { username } = req.user;
    return this.questionService.deleteMany(ids, username);
  }

  @Post('duplicate/:id')
  duplicate(@Param('id') id: number, @Req() req) {
    const { username } = req.user;
    return this.questionService.duplicate(id, username);
  }
}
