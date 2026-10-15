import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ContactService } from './contact.service.js';
import { CreateContactRequestDto } from './dto/create-contact-request.dto.js';

@ApiTags('Заявки и контакты (Contact & Orders)')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех полученных заявок' })
  @ApiResponse({ status: 200, description: 'Список заявок' })
  findAll() {
    return this.contactService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Отправить новую заявку на расчет сметы, консультацию или покупку товара' })
  @ApiResponse({ status: 201, description: 'Заявка успешно зарегистрирована' })
  create(@Body() dto: CreateContactRequestDto) {
    return this.contactService.create(dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус заявки (PENDING, CONTACTED, COMPLETED)' })
  @ApiParam({ name: 'id', description: 'ID заявки', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['PENDING', 'CONTACTED', 'COMPLETED'] },
      },
    },
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'PENDING' | 'CONTACTED' | 'COMPLETED',
  ) {
    return this.contactService.updateStatus(id, status);
  }
}
