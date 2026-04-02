import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui'
import { config } from '@my/config'

export function Provider({
  children,
  defaultTheme = 'light',
  ...rest
}: Omit<TamaguiProviderProps, 'config' | 'defaultTheme'> & { defaultTheme?: string }) {
  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme} {...rest}>
      {children}
    </TamaguiProvider>
  )
}
