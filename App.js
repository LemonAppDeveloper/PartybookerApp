import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Navigators/navigationContainer';
import thunk from 'redux-thunk';
import storageMiddleware, { actions as storageActions } from './src/AppState/middleware/storageMiddleware';
import rootReducer from '../PartyBooker/src/AppState/reducers/index';
import Loader from './src/Components/Loader';
import usePushNotification from '../PartyBooker/src/util/usePushNotification';
import { navigationRef, isReadyRef } from './src/Navigators/RootNavigation';
import { SQIPCore, } from 'react-native-square-in-app-payments';

const middleware = applyMiddleware(thunk, storageMiddleware); // logger

export const appStore = createStore(rootReducer, middleware);
appStore.dispatch(storageActions.appLoad());

function App() {
  // Push Notification Start 
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(
    async () => {
      await SQIPCore.setSquareApplicationId('sandbox-sq0idb-NTOBxaCL7jJjvFNdIJ3P7Q');
    })

  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);
  // Push notification ends

  return (
    <Provider store={appStore}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
      >
        <AppNavigator />
      </NavigationContainer>
      <Loader></Loader>
    </Provider>
  );
}

export default App;