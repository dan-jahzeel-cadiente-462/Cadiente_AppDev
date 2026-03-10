import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Text, View, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';

import { ROUTES } from '../../utils';

const LoginScreen = () => {
  const [emailAdd, setEmailAdd] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Image source={require('../../assets/brand-logo.png')} style={{ width: 150, height: 150, marginBottom: 20 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Login</Text>
      <CustomTextInput
        label={'Email Address'}
        placeholder={'Enter your email'}
        value={emailAdd}
        onChangeText={setEmailAdd}
        containerStyle={{
          padding: 10,
          width: '80%',
        }}
      />

      <CustomTextInput
        label={'Password'}
        placeholder={'Enter your password'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        containerStyle={{
          padding: 10,
          width: '80%',
        }}
      />

      <CustomButton
        label={'Login'}
        onPress={() => {
          if (emailAdd !== '123' || password !== '123') {
            Alert.alert('Incorrect credentials', 'Please try again');
            return;
          }
          navigation.navigate(ROUTES.HOME);
        }}
      />
    </View>
  );
};

export default LoginScreen;
