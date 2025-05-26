import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI as string;
    if (!mongoUri) throw new Error('MONGO_URI没有定义');
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`MongoDB 连接: ${conn.connection.host}`);
  } catch (error) {
    if(error instanceof Error) {
      console.error(`错误: ${error.message}`);
      
    } else {
      console.log('未知错误')
    }
    process.exit(1);
  }
};

export default connectDB;