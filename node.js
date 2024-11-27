const express = require('express');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

if (!process.env.TOKEN) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 18,
  message: 'Too many requests, please try again in a minute!',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

function isBrowser(userAgent) {
  const browserRegex = /Mozilla\/5\.0.*(Chrome|CriOS|Firefox|FxiOS|Safari|Opera|OPR|Edg|Edge|SamsungBrowser|DuckDuckGo|Brave|Vivaldi|Yandex|QQBrowser|Puffin|Sleipnir|Webkit|Silk|Maxthon|UCBrowser|Baidu|KAIOS)/i;
  return browserRegex.test(userAgent);
}

app.get('/get-key', async (req, res) => {
  const referrer = req.get('referer') || '';
  const userAgent = req.headers['user-agent'] || '';
  const token = req.query.t;

  // Log everything for debugging
  console.log('Debugging Start:');
  console.log('Referrer:', referrer || 'No referrer provided');
  console.log('User-Agent:', userAgent || 'No User-Agent provided');
  console.log('Token provided:', token || 'No token provided');
  console.log('Token in environment:', process.env.TOKEN);
  console.log('Debugging End');

  // Validate browser
  if (!isBrowser(userAgent)) {
    console.log('Browser not detected.');
    return res.status(403).json({ status: 'error', message: 'Forbidden: Browser not detected!' });
  }

  // Validate referrer
  const validReferrers = [
    'linkvertise.com',
    'pastebin.com',
    'paste-drop.com',
  ];

  const isValidReferrer = !referrer || validReferrers.some((validReferrer) => referrer.includes(validReferrer));
  if (!isValidReferrer) {
    console.log('Invalid referrer detected:', referrer);
    return res.redirect('https://paste-drop.com/paste/qeo2rxi76n'); // Wrong link
  }

  // Validate token
  if (token !== process.env.TOKEN) {
    console.log('Invalid token detected:', token);
    return res.redirect('https://paste-drop.com/paste/qeo2rxi76n'); // Wrong link
  }

  // Success case
  console.log('All validations passed. Redirecting to correct link.');
  return res.redirect('https://paste-drop.com/paste/KalitorKey'); // Correct link
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
