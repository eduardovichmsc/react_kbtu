import { DatabaseService } from '../database/database.service.js';
import type { ContactRequest } from '../database/database.types.js';
import { CreateContactRequestDto } from './dto/create-contact-request.dto.js';
export declare class ContactService {
    private readonly db;
    constructor(db: DatabaseService);
    findAll(): Promise<ContactRequest[]>;
    create(dto: CreateContactRequestDto): Promise<ContactRequest>;
    updateStatus(id: number, status: 'PENDING' | 'CONTACTED' | 'COMPLETED'): Promise<ContactRequest>;
}
