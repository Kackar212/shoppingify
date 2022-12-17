import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ShoppingListModule } from './shopping-list/shopping-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const { auth, host, port, from, templatesDir } = configService.get('mail');

        return {
          transport: {
            host,
            port,
            auth,
          },
          defaults: {
            from,
          },
          template: {
            dir: templatesDir,
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    AuthModule,
    UserModule,
    ProductsModule,
    CategoriesModule,
    ShoppingListModule,
  ],
})
export class AppModule {}
