export class AnswerDto {
  readonly questionId: string;
  readonly answerList: Array<{
    companyId: string;
    value: string[];
  }>;
}
