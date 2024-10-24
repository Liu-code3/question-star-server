import { Injectable } from '@nestjs/common';
import { QuestionService } from '../question/question.service';
import { AnswerService } from '../answer/answer.service';

@Injectable()
export class StatService {
  constructor(
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
  ) {}

  // 获取单个组件的统计数据
  async getComponentStat(questionId: number, componentFeId: string) {
    if (!questionId || !componentFeId) return [];

    // 获取问卷
    const q = await this.questionService.findOne(questionId); // 问卷
    if (!q) return [];

    // 获取组件
    const { componentList = [] } = q;
    const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
    if (!comp) return [];

    const { type, props } = comp;
    if (type !== 'questionRadio' && type !== 'questionCheckbox') {
      // 单组件, 只统计单选和多选. 其他不统计
      return [];
    }

    // 获取答卷列表
    const total = await this.answerService.count(questionId);
    if (!total) return []; // 答卷总数量
    const answers = await this.answerService.findAll(questionId, {
      page: 1,
      pageSize: total, //  获取所有的 不分页
    });
    // 累计各个 value 数量
    const countInfo = {};
    answers.forEach((a) => {
      const { answerList = [] } = a;
      answerList.forEach((a: any) => {
        if (a.componentFeId !== componentFeId) return;
        a.value.split(',').forEach((v) => {
          if (!countInfo[v]) countInfo[v] = 0;
          countInfo[v]++;
        });
      });
    });

    // 整理数据
    const list = [];
    for (const val in countInfo) {
      // 根据 val 计算 text
      let text = '';
      if (type === 'questionRadio') {
        text = this._getRadioText(val, props);
      }
      if (type === 'questionCheckbox') {
        text = this._getCheckboxText(val, props);
      }

      list.push({ name: text, count: countInfo[val] });
    }

    return list;
  }

  private _getRadioText(val, props) {
    const { options = [] } = props;
    return options.filter((o) => o.value === val)?.[0]?.label || '';
  }

  private _getCheckboxText(val, props) {
    const { list = [] } = props;
    return list
      .filter((o) => val.indexOf(o.value) > -1)
      .map((o) => o.label)
      .join('、');
  }

  /**
   * 生成答案信息, 格式如 { componentFeId1: value1, componentFeId2: value2 }
   * @param {Object} question question info
   * @param {Array} answerList answer list
   * @private
   */
  private _genAnswerInfo(question, answerList = []) {
    const res = {};

    const { componentList = [] } = question;

    answerList.forEach((a) => {
      const { componentFeId, value } = a;

      // 获取组件信息
      const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
      const { type, props = {} } = comp;
      if (type === 'questionRadio') {
        // 单选
        res[componentFeId] = value
          .split(',')
          .map((v) => this._getRadioText(v, props))
          .toString();
      } else if (type === 'questionCheckbox') {
        // 多选
        res[componentFeId] = value
          .split(',')
          .map((v) => this._getCheckboxText(v, props))
          .toString();
      } else {
        res[componentFeId] = value.toString();
      }
    });

    return res;
  }

  // 获取单个问卷的案卷列表(分页)和数量
  async getQuestionStatListAndCount(
    questionId: number,
    opt: { page: number; pageSize: number },
  ) {
    const noData = { list: [], total: 0 };
    if (!questionId) return noData;

    const q = await this.questionService.findOne(questionId);
    if (!q) return noData;

    const total = await this.answerService.count(questionId);
    if (total === 0) return noData;

    const answer = await this.answerService.findAll(questionId, opt);

    return {
      list: answer.map((a) => ({
        _id: a._id,
        ...this._genAnswerInfo(q, a.answerList),
      })),
      total,
    };
  }
}
