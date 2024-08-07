import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurações do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Cadastro de Pessoa Física')
    .setDescription('Documentação da API de Cadastro de Pessoa Física')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Inicia o aplicativo na porta 3000
  await app.listen(3000);
}
bootstrap();
