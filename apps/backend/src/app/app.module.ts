import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CollaboratorModule } from './collaboration/collaboration.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:'.env',
    }),
    UserModule,
    CollaboratorModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
