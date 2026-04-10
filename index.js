import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// 根页面说明
app.get('/', (req, res) => {
  res.send(`
    <h1>🌐 zhk1996.lol 中转代理 已启动</h1>
    <p>使用示例：</p>
    <ul>
      <li><a href="/https://www.google.com">https://zhk1996.lol/https://www.google.com</a></li>
      <li>https://zhk1996.lol/google.com</li>
      <li>https://zhk1996.lol/example.com/search?q=test</li>
    </ul>
  `);
});

// 动态反向代理
app.use('/', createProxyMiddleware({
  router: (req) => {
    let target = req.originalUrl.slice(1); // 去掉开头的 /
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    return target;
  },
  changeOrigin: true,
  secure: true,
  followRedirects: true,
  on: {
    proxyReq: (proxyReq) => {
      proxyReq.removeHeader('host');
    },
    proxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['x-frame-options'];
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});