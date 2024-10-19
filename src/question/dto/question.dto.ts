export class QuestionDto {
  readonly title: string;
  readonly desc: string;
  readonly js?: string;
  readonly css?: string;
  readonly isPublished?: boolean;
  readonly isStar?: boolean;
  readonly isDeleted?: boolean;
  readonly componentList: Array<{
    fe_id: string; // 组件 fe_id  需要前端控制, 前端生成的
    type: string;
    title: string;
    isHidden: boolean;
    isLocked: boolean;
    props: object;
  }>;
}
