import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'question',
})
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column()
  js: string;

  @Column()
  css: string;

  @Column({ type: 'tinyint', width: 1 })
  isPublished: boolean;

  @Column({ type: 'tinyint', width: 1 })
  isStar: boolean;

  @Column({ type: 'tinyint', width: 1 })
  isDelete: boolean;

  @Column({ nullable: true })
  author: string;

  @Column('json') //  可以使用 json 类型来存储复杂对象数组
  componentList: Array<{
    fe_id: string; // 组件 fe_id  需要前端控制, 前端生成的
    type: string;
    title: string;
    isHidden: boolean;
    isLocked: boolean;
    props: object;
  }>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
