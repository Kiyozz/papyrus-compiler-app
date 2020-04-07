export const buildProps = <P>(componentProps: P): (partial?: Partial<P>) => P => {
  return partial => ({
    ...componentProps,
    ...partial
  })
}
