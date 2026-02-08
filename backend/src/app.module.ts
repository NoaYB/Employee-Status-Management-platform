import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/employee.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbUrl = config.get<string>('DATABASE_URL');
        if (dbUrl) {
          return {
            type: 'postgres',
            url: dbUrl,
            ssl: { rejectUnauthorized: false },
            entities: [Employee],
            synchronize: true,
          };
        }

        const dbHost = config.get<string>('DB_HOST');
        if (dbHost) {
          return {
            type: 'postgres',
            host: dbHost,
            port: parseInt(config.get<string>('DB_PORT') || '5432', 10),
            username: config.get<string>('DB_USER'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_NAME'),
            ssl: config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
            entities: [Employee],
            synchronize: true,
          };
        }

        throw new Error('Database configuration missing. Please check your .env file.');
      },
    }),
    EmployeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
