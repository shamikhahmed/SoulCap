import { Controller, Post, Get, Patch, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { SendMessageDto } from './dto/send-message.dto';

@Controller({ path: 'conversations', version: '1' })
export class ConversationController {
  constructor(private readonly conversations: ConversationService) {}

  @Post('threads')
  startThread(@CurrentUser() user: AuthenticatedUser, @Body() body: { title?: string }) {
    return this.conversations.startThread(user, body.title);
  }

  @Get('threads')
  listThreads(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.conversations.listThreads(user, limit, cursor);
  }

  @Get('threads/:threadId')
  getThread(@Param('threadId') threadId: string) {
    return this.conversations.getThread(threadId);
  }

  @Post('messages')
  sendMessage(@CurrentUser() user: AuthenticatedUser, @Body() dto: SendMessageDto) {
    return this.conversations.sendMessage(user, dto);
  }

  @Get('threads/:threadId/messages')
  getMessages(
    @Param('threadId') threadId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('before') before?: string,
  ) {
    return this.conversations.getMessages(threadId, limit, before);
  }

  @Post('threads/:threadId/close')
  closeThread(@Param('threadId') threadId: string) {
    return this.conversations.closeThread(threadId);
  }

  @Patch('threads/:threadId/archive')
  archiveThread(@Param('threadId') threadId: string) {
    return this.conversations.archiveThread(threadId);
  }
}
