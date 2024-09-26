const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shizu'
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export { MONGO_URI, JWT_SECRET };
