/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
	semi: false,
	useTabs: true,
	singleQuote: true,
	jsxSingleQuote: true,
	trailingComma: 'none',
	bracketSameLine: true,
	printWidth: 100,
	singleAttributePerLine: true,
	organizeImportsSkipDestructiveCodeActions: true,
	plugins: [
		'prettier-plugin-package',
		'prettier-plugin-organize-imports',
		'prettier-plugin-tailwindcss'
	]
}
export default config
