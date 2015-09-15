var roboto = require('roboto');
var nodemailer = require('nodemailer');

var env = process.env;
var crawlUrl = env.CRAWL_URL;
var sendTo = env.SEND_TO;

var transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PW
  }
});

var crawler = new roboto.Crawler({
  startUrls: [crawlUrl],
  constrainToRootDomains: true,
  allowedContentTypes: [
    // these are defaults
    'text/html',
    'application/xhtml+xml',
    'application/xml',

    // probably want these too?
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
});

var deadLinks = [];
crawler.on('httpError', function(statusCode, href, referrer) {
  if (statusCode === 404) {
    deadLinks.push({
      href: href,
      referrer: referrer
    });
  }
});

crawler.on('finish', function() {
  var msg = '';
  deadLinks.forEach(function(link) {
    var m = `Dead link: ${link.href}  found on page: ${link.referrer}`;
    console.log(m);
    msg+= `\n\n${m}`;
  });
  if (msg.length) {
    transporter.sendMail({
      from: sendTo,
      to: sendTo,
      subject: `Dead links on ${crawlUrl}`,
      text: msg
    }, function(err, info) {
      if (err) {
        return console.log(err);
      }
      console.log(`Message sent: ${info.response}`);
    });
  } else {
    console.log('No dead links!');
  }
});

crawler.crawl();
