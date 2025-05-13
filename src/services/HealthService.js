// src/services/UnifiedHealthService.js
import { Platform } from 'react-native';
import HealthKitService from './HealthKitService';
import HealthConnectService from './HealthConnectService';

const HealthService = Platform.OS === 'ios' ? HealthKitService : HealthConnectService;

export default HealthService;
