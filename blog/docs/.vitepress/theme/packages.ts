export type PackageInfo = {
  name: string
  docs: string
  repo: string
  stack: 'Laravel' | 'Vue' | 'React' | 'Inertia'
  color: string
}

/**
 * Every package a post can be filed under, keyed by the `package` frontmatter value.
 */
export const packages: Record<string, PackageInfo> = {
  'laravel-disposable-email': {
    name: 'Laravel Disposable Email',
    docs: 'https://erag.in/laravel-disposable-email/',
    repo: 'https://github.com/eramitgupta/laravel-disposable-email',
    stack: 'Laravel',
    color: '#ff4a3d',
  },
  'laravel-inertia-toast': {
    name: 'Laravel Inertia Toast',
    docs: 'https://erag.in/laravel-inertia-toast/',
    repo: 'https://github.com/eramitgupta/laravel-inertia-toast',
    stack: 'Inertia',
    color: '#a996ff',
  },
  'laravel-lang-sync-inertia': {
    name: 'Laravel Lang Sync Inertia',
    docs: 'https://erag.in/laravel-lang-sync-inertia/',
    repo: 'https://github.com/eramitgupta/laravel-lang-sync-inertia',
    stack: 'Inertia',
    color: '#a996ff',
  },
  'laravel-inertia-forms': {
    name: 'Laravel Inertia Forms',
    docs: 'https://erag.in/laravel-inertia-forms/',
    repo: 'https://github.com/eramitgupta/laravel-Inertia-forms',
    stack: 'Inertia',
    color: '#a996ff',
  },
  'laravel-pwa': {
    name: 'Laravel PWA',
    docs: 'https://erag.in/laravel-pwa/',
    repo: 'https://github.com/eramitgupta/laravel-pwa',
    stack: 'Laravel',
    color: '#ff4a3d',
  },
  'phone-number-vue': {
    name: 'Phone Number Vue',
    docs: 'https://erag.in/phone-number-vue/',
    repo: 'https://github.com/eramitgupta/phone-number-vue',
    stack: 'Vue',
    color: '#42b883',
  },
  'phone-number-react': {
    name: 'Phone Number React',
    docs: 'https://erag.in/phone-number-react/',
    repo: 'https://github.com/eramitgupta/phone-number-react',
    stack: 'React',
    color: '#61dafb',
  },
  'vue-toastification': {
    name: 'Vue Toastification',
    docs: 'https://erag.in/vue-toastification/',
    repo: 'https://github.com/eramitgupta/vue-toastification',
    stack: 'Vue',
    color: '#42b883',
  },
  'text-editor-vue': {
    name: 'Text Editor Vue',
    docs: 'https://erag.in/text-editor-vue/',
    repo: 'https://github.com/eramitgupta/text-editor-vue',
    stack: 'Vue',
    color: '#42b883',
  },
  'text-editor-react': {
    name: 'Text Editor React',
    docs: 'https://erag.in/text-editor-react/',
    repo: 'https://github.com/erag-labs/text-editor-react',
    stack: 'React',
    color: '#61dafb',
  },
}
