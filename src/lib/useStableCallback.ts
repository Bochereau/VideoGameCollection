import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * Renvoie une fonction dont l'identité ne change jamais mais qui appelle
 * toujours la dernière version de `fn`. Permet de passer des gestionnaires
 * aux cartes mémoïsées sans les faire toutes se redessiner à chaque rendu.
 */
export function useStableCallback<Args extends unknown[], R>(
  fn: (...args: Args) => R,
): (...args: Args) => R {
  const ref = useRef(fn)
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args: Args) => ref.current(...args), [])
}
