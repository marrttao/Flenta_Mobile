import { registerFeatureTest } from './registry';
import { registerUiTest } from './registry';
import { registerApiTest } from './registry';



import { ExampleFeatureTest } from './test/ExampleFeatureTest';
import { LocalizationTest } from '../localization/test/LocalizationTest'
import { StorageTest } from '../../storage/test/StorageTest';
import { CurrencyTest } from '../currency/test/CurrencyTest';
import { ThemeTest } from '../theme/test/ThemeTest';

import { LoaderTest } from '../../components/ui/Loader/test/LoaderTest';
import { BasicModalTest } from '../../components/ui/Modal/test/BasicModalTest';
import { ConfirmModalTest } from '../../components/ui/Modal/test/ConfirmModalTest';
import { ToastTest } from '../../components/ui/Toast/test/ToastTest';

import { CurrencyApiTest } from '../currency/test/CurrencyApiTest';



registerFeatureTest('example-test', ExampleFeatureTest);
registerFeatureTest('localization', LocalizationTest)
registerFeatureTest('storage', StorageTest);
registerFeatureTest('currency', CurrencyTest);
registerFeatureTest('theme', ThemeTest);

registerUiTest('loader', LoaderTest);
registerUiTest('basic-modal', BasicModalTest);
registerUiTest('confirm-modal', ConfirmModalTest);
registerUiTest('toast', ToastTest);

registerApiTest('currency', CurrencyApiTest)