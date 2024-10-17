import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // 路由全局前缀

  app.useGlobalInterceptors(new TransformInterceptor()); // 全局拦截器

  await app.listen(3005);
}
bootstrap();
