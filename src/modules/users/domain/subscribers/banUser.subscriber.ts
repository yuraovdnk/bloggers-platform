import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { BanList } from '../entity/banList.entity';
import { AuthSession } from '../../../auth/domain/entity/authSession.entity';

@EventSubscriber()
export class BanUserSubscriber implements EntitySubscriberInterface<BanList> {
  listenTo() {
    return BanList;
  }

  async afterInsert(event: InsertEvent<BanList>): Promise<void> {
    await event.manager
      .getRepository(AuthSession)
      .createQueryBuilder()
      .delete()
      .from(AuthSession)
      .where('userId = :userId', { userId: event.entity.userId })
      .execute();
  }
}
