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
  UseGuards,
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
import { UserOutput } from '@/user/application/dtos/user-output';
import {
  UserCollectionPresenter,
  UserPresenter,
} from '@/user/infrastructure/presenters/user.presenter';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { LogInUserPresenter } from '@/user/infrastructure/presenters/log-in-user.presenter';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('user')
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

  @Inject(AuthService)
  private authService: AuthService;

  static userToResponse(output: UserOutput): UserPresenter {
    return new UserPresenter(output);
  }

  static listUserToResponse(
    output: ListUsersUsecase.Output,
  ): UserCollectionPresenter {
    return new UserCollectionPresenter(output);
  }

  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    const output = await this.signUpUseCase.execute(signUpDto);

    return UserController.userToResponse(output);
  }

  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @HttpCode(200)
  @Post('login')
  async login(@Body() signIn: SignInDto) {
    const output = await this.singInUseCase.execute(signIn);
    const token = await this.authService.generateJwt(output.id);

    return new LogInUserPresenter(output, token.accessToken);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            itemCount: { type: 'number' },
            itemsPerPage: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(UserPresenter) },
        },
      },
    },
  })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const result = await this.listUsersUseCase.execute(searchParams);

    return UserController.listUserToResponse(result);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });

    return UserController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });

    return UserController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard)
  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const output = await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    });

    return UserController.userToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
