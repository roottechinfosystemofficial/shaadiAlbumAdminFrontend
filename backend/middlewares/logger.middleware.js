import logger from '../config/logger.js';

let requestCount = 0;
const userRequestCounts = new Map();

const requestLogger = (req, res, next) => {
  const { method, url, headers } = req;
  const userAgent = headers['user-agent'];
  const userIp = req.ip;
  const start = Date.now();

  requestCount++;

  userRequestCounts.set(userIp, (userRequestCounts.get(userIp) || 0) + 1);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `Request Count: ${requestCount}, User Requests: ${userRequestCounts.get(userIp)}, IP: ${userIp}, User-Agent: ${userAgent}, Method: ${method}, Route: ${url}, Response Time: ${duration} ms, Status: ${res.statusCode}`;

    logger.info(logMessage);
  });

  next();
};

export default requestLogger;
