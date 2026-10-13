import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import type { ContactRequest } from '../database/database.types.js';
import { CreateContactRequestDto } from './dto/create-contact-request.dto.js';

@Injectable()
export class ContactService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<ContactRequest[]> {
    return this.db.getContactRequests();
  }

  async create(dto: CreateContactRequestDto): Promise<ContactRequest> {
    return this.db.createContactRequest({
      type: dto.type,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      message: dto.message,
      productId: dto.productId,
      productName: dto.productName,
      packageName: dto.packageName,
    });
  }

  async updateStatus(
    id: number,
    status: 'PENDING' | 'CONTACTED' | 'COMPLETED',
  ): Promise<ContactRequest> {
    const updated = await this.db.updateContactRequestStatus(id, status);
    if (!updated) {
      throw new NotFoundException(`Заявка с ID ${id} не найдена`);
    }
    return updated;
  }
}
