import winston from "winston";

const isDevelopment = process.env.NODE_ENV === "development";

const logger = winston.createLogger({
  level: "debug",
  transports: isDevelopment
    ? [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.printf(
              ({ timestamp, level, message }) =>
                `${timestamp} [${level}]: ${message}`
            )
          ),
        }),
      ]
    : [],
});

export default logger;