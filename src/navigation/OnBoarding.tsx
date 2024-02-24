import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoardingHome from '../screens/onboarding/OnBoardingHome';
import CreateWallet from '../screens/onboarding/CreateWallet';
import {SCREEN_NAMES} from './screenNames';
import ConfirmSeed from '../screens/onboarding/ConfirmSeed';

const Stack = createNativeStackNavigator();

function OnBoardingNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{headerShown: false}}
        name={SCREEN_NAMES.OnboardingHome}
        component={OnBoardingHome}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={SCREEN_NAMES.CreateWallet}
        component={CreateWallet}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={SCREEN_NAMES.ConfirmSeed}
        component={ConfirmSeed}
      />
    </Stack.Navigator>
  );
}

export default OnBoardingNavigation;
