import { ContactService } from './contact.service.js';
import { CreateContactRequestDto } from './dto/create-contact-request.dto.js';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    findAll(): Promise<import("../database/database.types.js").ContactRequest[]>;
    create(dto: CreateContactRequestDto): Promise<import("../database/database.types.js").ContactRequest>;
    updateStatus(id: number, status: 'PENDING' | 'CONTACTED' | 'COMPLETED'): Promise<import("../database/database.types.js").ContactRequest>;
}
