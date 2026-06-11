
// Re-export database configuration
import { 
  mysqlConfig, 
  mongoConfig, 
  mysqlPool,
  initializeMySQL,
  connectMongoDB,
  testDatabaseConnections
} from './config';

// Re-export MySQL service functions
import * as mysqlQueries from './mysql/queries';

// Re-export MongoDB service functions
import * as mongoServices from './mongodb/services';

// Export all MySQL functions individually to avoid naming conflicts
export const {
  createUser: mysqlCreateUser,
  createWholesaler: mysqlCreateWholesaler,
  getUserByEmail: mysqlGetUserByEmail,
  createAppointment: mysqlCreateAppointment,
  getAppointmentsByUserId,
  saveDeliveryDetails: mysqlSaveDeliveryDetails
} = mysqlQueries;

// Export all MongoDB functions individually to avoid naming conflicts
export const {
  createUser: mongoCreateUser,
  createWholesaler: mongoCreateWholesaler,
  getUserByEmail: mongoGetUserByEmail,
  createAppointment: mongoCreateAppointment,
  getAppointmentsByPatientId,
  createMedicalRecord,
  getMedicalRecordsByPatientId,
  saveDeliveryDetails: mongoSaveDeliveryDetails,
  getDeliveryDetailsByUserId
} = mongoServices;

// Export configuration
export {
  mysqlConfig,
  mongoConfig,
  mysqlPool,
  initializeMySQL,
  connectMongoDB,
  testDatabaseConnections
};
