import rateLimit from 'express-rate-limit';
import { logger } from './logger.js';

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 login requests per window
  message: {
    message:
      'Too many login attempts from this IP, please try again after a 60 second pause',
  },
  handler: (req, res, _next, options) => {
    // Log the IP and original URL so you can identify attackers in logs
    logger.warn(
      `Too Many Requests: ${options.message.message}\t${req.ip}\t${req.method}\t${req.url}`,
    );

    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default loginLimiter;
