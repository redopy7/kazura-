const express = require('express');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

if (!process.env.TOKEN) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'web')));

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

function isBypassService(referrer) {
  const bypassServices = [
    'bypass.city',
    'thebypasser.com',
    'bypassunlock.com',
    'bypass.vip',
  ];
  return bypassServices.some(service => referrer.includes(service));
}

app.get('/get-key', async (req, res) => {
  const referrer = req.get('referer') || '';
  const userAgent = req.headers['user-agent'] || '';
  const token = req.query.t;

  if (isBypassService(referrer)) {
    return res.redirect('https://paste-drop.com/paste/qeo2rxi76n');
  }

  if (!isBrowser(userAgent)) {
    return res.status(403).json({ status: 'error', message: 'Forbidden: Browser not detected!' });
  }

  const validReferrers = [
    'linkvertise.com',
    'loot-link.com',
    'lootdest.org',
    'lootlabs.gg',
    'paste-drop.com',
    'kazura.vercel.app',
  ];

  const isValidReferrer = validReferrers.some((validReferrer) => referrer.includes(validReferrer));
  if (!isValidReferrer) {
    return res.redirect('https://paste-drop.com/paste/qeo2rxi76n');
  }

  if (token !== process.env.TOKEN) {
    return res.redirect('https://paste-drop.com/paste/qeo2rxi76n');
  }

  return res.redirect('https://paste-drop.com/paste/KalitorKey');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.get('/tutorial', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'Tutorial.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
