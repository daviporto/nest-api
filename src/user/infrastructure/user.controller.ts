import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SignUpDto } from '@/user/infrastructure/dtos/sign-up.dto';
import { SignupUsecase } from '@/user/application/usecases/sign-up.usecase';
import { SignInUsecase } from '@/user/application/usecases/sign-in.usecase';
import { UpdateUserUsecase } from '@/user/application/usecases/update-user.usecase';
import { UpdatePasswordUsecase } from '@/user/application/usecases/update-password.usecase';
import { GetUserUsecase } from '@/user/application/usecases/get-user.usecase';
import { ListUsersUsecase } from '@/user/application/usecases/list-users.usecase';
import { DeleteUserUsecase } from '@/user/application/usecases/delete-user.usecase';
import { SignInDto } from '@/user/infrastructure/dtos/sign-in.dto';
import { ListUsersDto } from '@/user/infrastructure/dtos/list-users.dto';
import { UpdateUserDto } from '@/user/infrastructure/dtos/update-user.dto';
import { UpdatePasswordDto } from '@/user/infrastructure/dtos/update-password.dto';

@Controller('user')
export class UserController {
  @Inject(SignupUsecase.UseCase)
  private signUpUseCase: SignupUsecase.UseCase;

  @Inject(SignInUsecase.UseCase)
  private singInUseCase: SignInUsecase.UseCase;

  @Inject(UpdateUserUsecase.UseCase)
  private updateUserUseCase: UpdateUserUsecase.UseCase;

  @Inject(UpdatePasswordUsecase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUsecase.UseCase;

  @Inject(GetUserUsecase.UseCase)
  private getUserUseCase: GetUserUsecase.UseCase;

  @Inject(ListUsersUsecase.UseCase)
  private listUsersUseCase: ListUsersUsecase.UseCase;

  @Inject(DeleteUserUsecase.UseCase)
  private deleteUserUseCase: DeleteUserUsecase.UseCase;

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    return this.signUpUseCase.execute(signUpDto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signIn: SignInDto) {
    return this.singInUseCase.execute(signIn);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return this.listUsersUseCase.execute(searchParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.updatePasswordUseCase.execute({ id, ...updatePasswordDto });
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
