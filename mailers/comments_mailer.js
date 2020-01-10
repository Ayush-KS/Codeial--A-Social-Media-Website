const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    var mail = {
        from: 'ad',
        to: comment.user.email,
        subject: "hello world!",
        text: "Hello!",
        html: htmlString
    }
    console.log("allaa")

    nodeMailer.transporter.sendMail(mail, (err, info) => {
        console.log("allalalala")
        if (err){
            console.log('Error in sending mail', err);
            return;
        }
        

        console.log('Message sent', info);
        return;
    });
}