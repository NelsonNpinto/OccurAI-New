// src/pages/auth/LoginScreen.js
import React, {useState, useEffect, useCallback, useMemo} from 'react';
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

const LoginScreen = ({navigation}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const {login, isLoading, error, clearError} = useAuth();

  useEffect(() => {
    clearError();
  }, []); // Remove clearError from dependency array

  // Optimize input change handler with useCallback
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (error) clearError();
  }, [error, clearError]);

  // Optimize login handler with useCallback
  const handleLogin = useCallback(async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      const result = await login(formData.username.trim(), formData.password);

      if (!result || result.success === false) {
        Alert.alert('Login Failed', result?.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Error', 'Unexpected error occurred.');
    }
  }, [formData.username, formData.password, login]);

  // Optimize password toggle with useCallback
  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Optimize navigation handler with useCallback
  const navigateToRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

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
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={false}
          scrollEnabled={false}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.10)', 'rgba(0, 0, 0, 0)']}
            style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your wellness journey
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  autoFocus={false}
                  caretHidden={false}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    blurOnSubmit={false}
                    autoFocus={false}
                    caretHidden={false}
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

              {/* Error Display */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}>
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={navigateToRegister}
                  activeOpacity={0.7}>
                  <Text style={styles.registerLink}>Sign Up</Text>
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
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '400',
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Urbanist',
    fontWeight: '600',
  },
});

export default React.memo(LoginScreen);