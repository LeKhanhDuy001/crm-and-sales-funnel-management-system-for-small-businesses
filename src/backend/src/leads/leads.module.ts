import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadsRepository } from './repositories/leads.repository';
import { LeadAssignmentsController } from './lead-assignments.controller';
import { LeadAssignmentsService } from './lead-assignments.service';
import { LeadAssignmentsRepository } from './repositories/lead-assignments.repository';

@Module({
  controllers: [LeadsController, LeadAssignmentsController],
  providers: [
    LeadsService,
    LeadsRepository,
    LeadAssignmentsService,
    LeadAssignmentsRepository,
  ],
  exports: [LeadsService],
})
export class LeadsModule {}
