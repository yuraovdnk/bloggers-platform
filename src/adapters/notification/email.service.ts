import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { User } from '../../modules/users/domain/entity/user.entity';
@Injectable()
export class EmailService {
  async sendConfirmMail(user: User) {
    const transporter = await nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'yuraovdnk@gmail.com',
        pass: 'puoowkujaurxnden',
      },
    });
    const info = await transporter.sendMail({
      from: '"Yura" <yuraovdnk@gmail.com>',
      to: user.email,
      subject: 'Confrim Email',
      text: `https://somesite.com/confirm-email?code=${user.confirmCode}`,
    });
    return info;
  }

  async sendRecoveryCode(user: User) {
    const transporter = await nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'yuraovdnk@gmail.com',
        pass: 'puoowkujaurxnden',
      },
    });
    const info = await transporter.sendMail({
      from: '"Yura" <yuraovdnk@gmail.com>',
      to: user.email,
      subject: 'Passwrod recovery code',
      //text: `https://somesite.com/password-recovery?recoveryCode=${user.passwordRecoveryCode}`,
    });
    return info;
  }
}
