import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 't_answer', // 数据表名
})
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column({ nullable: false })
  questionId: string; // 对应 问卷 的 _id

  @Column('json')
  answerList: Array<{
    componentFeId: string; // 对应组件的 fe_id
    value: string[];
  }>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
