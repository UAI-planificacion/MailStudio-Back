import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SendEmailsService } from './send-emails.service';
import { CreateSendEmailDto } from './dto/create-send-email.dto';
import { UpdateSendEmailDto } from './dto/update-send-email.dto';

@Controller('send-emails')
export class SendEmailsController {
  constructor(private readonly sendEmailsService: SendEmailsService) {}

  @Post()
  create(@Body() createSendEmailDto: CreateSendEmailDto) {
    return this.sendEmailsService.create(createSendEmailDto);
  }

  @Get()
  findAll() {
    return this.sendEmailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendEmailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSendEmailDto: UpdateSendEmailDto) {
    return this.sendEmailsService.update(+id, updateSendEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendEmailsService.remove(+id);
  }
}
