import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { UsersBanList } from '../entity/userBanList.entity';
import { AuthSession } from '../../../auth/domain/entity/authSession.entity';

@EventSubscriber()
export class BanUserSubscriber implements EntitySubscriberInterface<UsersBanList> {
  listenTo() {
    return UsersBanList;
  }

  async afterInsert(event: InsertEvent<UsersBanList>): Promise<void> {
    await event.manager
      .getRepository(AuthSession)
      .createQueryBuilder()
      .delete()
      .from(AuthSession)
      .where('userId = :userId', { userId: event.entity.userId })
      .execute();
  }
}
