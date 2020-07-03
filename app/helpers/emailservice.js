const mailer = require("nodemailer");

class EmailService{
  constructor(user, pass){
    this.t = mailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {user, pass}
    })
  }
  
  get transporter(){
    return this.t
  }
  
  set transporter(t){
    this.t =  mailer.createTransport(t);
  }
  
  static async sendEmail(user, message, emailsTo){
    const service = new EmailService(user.email, user.password);
    
    const info = await service.transporter.sendMail({
      from: `"${user.name}" <${user.email}>`,
      to: `${emailsTo}`,
      subject: message.subject,
      text: message.body,
      html: `<p style="text-align:center;padding:0.5em;">${message.body}</p>`
    })
    
    return info;
  }
}

module.exports = EmailService;