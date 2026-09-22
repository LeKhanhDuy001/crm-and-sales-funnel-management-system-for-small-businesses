import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuotesService } from './quotes.service';
import { Int32IdPipe } from '../common/pipes/int32-id.pipe';

@ApiTags('Quotes')
@ApiBearerAuth('access-token')
@Controller('quotes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SALES)
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  findAll(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.quotesService.findAll(request.user);
  }

  @Get('meta')
  getMeta(
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.quotesService.getMeta(request.user);
  }

  @Get(':id')
  findOne(
    @Param('id', Int32IdPipe)
    quoteId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.quotesService.findOne(quoteId, request.user);
  }

  @Post()
  create(
    @Body()
    dto: CreateQuoteDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.quotesService.create(dto, request.user, request.ip);
  }

  @Patch(':id')
  update(
    @Param('id', Int32IdPipe)
    quoteId: number,
    @Body()
    dto: UpdateQuoteDto,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.quotesService.update(quoteId, dto, request.user, request.ip);
  }

  @Patch(':id/confirm')
  confirm(
    @Param('id', Int32IdPipe)
    quoteId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.quotesService.confirm(quoteId, request.user, request.ip);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id', Int32IdPipe)
    quoteId: number,
    @Req()
    request: AuthenticatedRequest,
  ) {
    return this.quotesService.cancel(quoteId, request.user, request.ip);
  }
}
