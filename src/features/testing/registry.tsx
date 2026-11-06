import type { ComponentType } from 'react';



type TypeOfTest = 'features' | 'ui' | 'api';

const FEATURES_TESTS: Record<string, ComponentType> = {};
const UI_TESTS: Record<string, ComponentType> = {};
const API_TESTS: Record<string, ComponentType> = {};



function registerFeatureTest(name: string, component: ComponentType) { FEATURES_TESTS[name] = component; }
function registerUiTest(name: string, component: ComponentType) { UI_TESTS[name] = component; }
function registerApiTest(name: string, component: ComponentType) { API_TESTS[name] = component; }



function getRegistry(type: TypeOfTest): Record<string, ComponentType>
{
	switch (type)
	{
		case 'features': return FEATURES_TESTS;
		case 'ui': return UI_TESTS;
		case 'api': return API_TESTS;
		
		default: throw new Error(`Unknown test type: ${type}`);
	}
}



export type { TypeOfTest };

export { registerFeatureTest, registerUiTest, registerApiTest };
export { getRegistry };