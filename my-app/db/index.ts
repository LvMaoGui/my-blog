import 'reflect-metadata';
import { DataSource } from 'typeorm';
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { UserAuth, User, Article, Comment, Tag } from './entity'

const type = process.env.DATABASE_TYPE as MysqlConnectionOptions["type"];
const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

export const AppDataSource = new DataSource({
  type, // 使用的数据库类型
  host, //ip 本地为localhost
  port, // 数据库使用的端口
  username, //数据库用户名
  password, // 数据库用户密码
  database, //使用的数据库名字
  synchronize: true, // 是否同步，如果为true，新建的实体会更新建表或更新字段
  logging: true, // 是否开启日志 为true 为打印执行的sql
  entities: [UserAuth,User,Comment,Article,Tag], // 加载entity目录下的ts文件为model
}).initialize();
