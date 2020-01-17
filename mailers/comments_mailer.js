const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    var mail = {
        from: 'astroash13.1@gmail.com',
        to: comment.user.email,
        subject: "hello world!",
        text: "Hello!",
        html: htmlString
    }

    nodeMailer.transporter.sendMail(mail, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }
        

        console.log('Message sent', info);
        return;
    });
}