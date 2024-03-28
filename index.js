/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { onAppBeginLaunch } from './src/route/launch-profiler';
onAppBeginLaunch()

AppRegistry.registerComponent(appName, () => App);
