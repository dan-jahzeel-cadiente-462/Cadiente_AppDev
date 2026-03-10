import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// screens
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/main/HomeScreen';

// utils
import { ROUTES } from '../utils';

const AuthNav = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.LOGIN}>
      <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthNav;
