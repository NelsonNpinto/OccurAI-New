// src/pages/auth/RegisterScreen.js
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import {useAuth} from '../../context/AuthContext';
import {appStyles, colors} from '../../styles/styles';

const RegisterScreen = ({navigation}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {register, isLoading, error, clearError} = useAuth();

  // Refs for input navigation
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const ageRef = useRef(null);

  useEffect(() => {
    clearError();
  }, []); // Remove clearError from dependency array

  // Optimize input change handler with useCallback
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (error) clearError();
  }, [error, clearError]);

  // Optimize form validation with useCallback
  const validateForm = useCallback(() => {
    if (!formData.username.trim()) {
      Alert.alert('Validation Error', 'Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Validation Error', 'Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Validation Error', 'Password is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 6 characters long',
      );
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    if (
      formData.age &&
      (isNaN(formData.age) ||
        parseInt(formData.age) < 1 ||
        parseInt(formData.age) > 120)
    ) {
      Alert.alert('Validation Error', 'Please enter a valid age (1-120)');
      return false;
    }
    return true;
  }, [formData]);

  // Optimize register handler with useCallback
  const handleRegister = useCallback(async () => {
    if (!validateForm()) return;

    const userData = {
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
    };

    try {
      const result = await register(userData);

      if (!result.success) {
        Alert.alert('Registration Failed', result.error);
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    }
  }, [formData, register, validateForm]);

  // Optimize password toggles with useCallback
  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  // Optimize navigation handler with useCallback
  const navigateToLogin = useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  // Optimize input focus handlers with useCallback
  const focusEmail = useCallback(() => emailRef.current?.focus(), []);
  const focusPassword = useCallback(() => passwordRef.current?.focus(), []);
  const focusConfirmPassword = useCallback(() => confirmPasswordRef.current?.focus(), []);
  const focusAge = useCallback(() => ageRef.current?.focus(), []);

  // Memoize the AppContainer to prevent re-renders
  const AppContainer = useMemo(() => React.memo(({children}) => {
    return (
      <View style={[appStyles.container, {backgroundColor: '#000000'}]}>
        <View style={StyleSheet.absoluteFill}>
          <View
            style={{
              position: 'absolute',
              top: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: -170,
              left: '50%',
              marginLeft: -300,
              width: 600,
              height: 600,
              borderRadius: 600,
              backgroundColor: 'transparent',
            }}>
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -75,
                marginLeft: -75,
                width: 150,
                height: 150,
                borderRadius: 150,
                backgroundColor: '#FFDF9E',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -150,
                marginLeft: -150,
                width: 300,
                height: 300,
                borderRadius: 300,
                backgroundColor: '#E4C67F99',
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.8,
                shadowRadius: 50,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 600,
                backgroundColor: '#E4C67F33',
                shadowColor: '#E4C67F',
                shadowOffset: {width: 0, height: 0},
                shadowOpacity: 0.95,
                shadowRadius: 900,
              }}
            />
          </View>

          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
          />
        </View>

        <SafeAreaView
          style={[
            appStyles.safeArea,
            {paddingTop: StatusBar.currentHeight || 0},
          ]}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          {children}
        </SafeAreaView>
      </View>
    );
  }), []);

  return (
    <AppContainer>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={false}
          scrollEnabled={true}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
            style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us to start your wellness journey
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  placeholder="Choose a username"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={focusEmail}
                  autoFocus={false}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={focusPassword}
                  autoFocus={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={passwordRef}
                    style={[styles.input, styles.passwordInput]}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    placeholder="Create a password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={focusConfirmPassword}
                    autoFocus={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={togglePassword}
                    activeOpacity={0.7}>
                    <Text style={styles.eyeButtonText}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={confirmPasswordRef}
                    style={[styles.input, styles.passwordInput]}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    placeholder="Confirm your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={focusAge}
                    autoFocus={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={toggleConfirmPassword}
                    activeOpacity={0.7}>
                    <Text style={styles.eyeButtonText}>
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Age Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age (Optional)</Text>
                <TextInput
                  ref={ageRef}
                  style={styles.input}
                  value={formData.age}
                  onChangeText={(value) => handleInputChange('age', value)}
                  placeholder="Enter your age"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="numeric"
                  returnKeyType="done"
                  blurOnSubmit={false}
                  onSubmitEditing={handleRegister}
                  autoFocus={false}
                />
              </View>

              {/* Gender Selection */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender (Optional)</Text>
                <View style={styles.genderContainer}>
                  {['male', 'female', 'other'].map(gender => (
                    <TouchableOpacity
                      key={gender}
                      style={[
                        styles.genderButton,
                        formData.gender === gender &&
                          styles.genderButtonSelected,
                      ]}
                      onPress={() => handleInputChange('gender', gender)}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.genderButtonText,
                          formData.gender === gender &&
                            styles.genderButtonTextSelected,
                        ]}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Error Display */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Register Button */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isLoading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}>
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity 
                  onPress={navigateToLogin}
                  activeOpacity={0.7}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    borderRadius: 32,
    padding: 24,
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    fontFamily: 'Urbanist',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '400',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(94, 94, 94, 0.18)',
    borderRadius: 16,
    padding: 16,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist',
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.2)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(94, 94, 94, 0.18)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(228, 198, 127, 0.2)',
  },
  genderButtonSelected: {
    backgroundColor: 'rgba(228, 198, 127, 0.3)',
    borderColor: colors.primary,
  },
  genderButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '500',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '400',
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default React.memo(RegisterScreen);