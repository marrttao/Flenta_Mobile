import { registerFeatureTest } from './registry';
import { registerUiTest } from './registry';
import { registerApiTest } from './registry';



import { ExampleFeatureTest } from './test/ExampleFeatureTest';
import { LocalizationTest } from '../localization/test/LocalizationTest'


registerFeatureTest('example-test', ExampleFeatureTest);
registerFeatureTest('localization', LocalizationTest)