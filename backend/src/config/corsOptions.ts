const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
