import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN);
  }
  return null;
};

async function createAdminModule() {
  const { AdminModule } = await import('@adminjs/nestjs');
  const { AdminJS } = await import('adminjs');
  const AdminJSTypeorm = await import('@adminjs/typeorm');

  AdminJS.registerAdapter({
    Resource: AdminJSTypeorm.Resource,
    Database: AdminJSTypeorm.Database,
  });

  return AdminModule.createAdminAsync({
    useFactory: () => ({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [UserEntity],
      },
      auth: {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: 'secret',
      },
      sessionOptions: {
        resave: true,
        saveUninitialized: true,
        secret: 'secret',
      },
    }),
  });
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nest-beginner',
      entities: [UserEntity],
      synchronize: true,
    }),
    // Call the createAdminModule function here
    createAdminModule(),
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
