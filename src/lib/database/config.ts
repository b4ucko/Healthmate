
// Browser-compatible mock implementation
// In a real application, configuration would be handled on the server

// MySQL Configuration - mock for browser
export const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'healthmate',
};

// MongoDB Configuration - mock for browser
export const mongoConfig = {
  uri: 'mongodb://localhost:27017/healthmate',
};

// Mock pool for browser environment
export const mysqlPool = {
  getConnection: () => {
    console.log('Mock: Getting MySQL connection');
    return {
      execute: async () => {
        console.log('Mock: Executing MySQL query');
        return [[], {}];
      },
      release: () => {
        console.log('Mock: Releasing MySQL connection');
      },
      beginTransaction: () => {
        console.log('Mock: Beginning MySQL transaction');
      },
      commit: () => {
        console.log('Mock: Committing MySQL transaction');
      },
      rollback: () => {
        console.log('Mock: Rolling back MySQL transaction');
      }
    };
  },
  execute: async () => {
    console.log('Mock: Executing MySQL query from pool');
    return [[], {}];
  }
};

// Initialize MySQL tables - mock for browser
export const initializeMySQL = async (): Promise<void> => {
  console.log('Mock: This would initialize MySQL tables on a server');
};

// Initialize MongoDB connection - mock for browser
export const connectMongoDB = async (): Promise<void> => {
  console.log('Mock: This would connect to MongoDB on a server');
};

// Test both database connections - mock for browser
export const testDatabaseConnections = async (): Promise<{ mysql: boolean; mongodb: boolean }> => {
  console.log('Mock: Testing database connections');
  // Always return success in browser environment
  return { mysql: true, mongodb: true };
};
