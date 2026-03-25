/**
 * EasySave Mobile App
 * Authentication system with Redux and Redux-Saga
 */

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import createStore from './src/app/reducers';
import rootSaga from './src/app/saga';
import RootNavigations from './src/navigations';

// Create store with persistence
const { store, persistor, runSaga } = createStore();

// Run Root Saga
runSaga(rootSaga);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <RootNavigations />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
