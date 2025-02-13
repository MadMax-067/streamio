export const prefetchAndNavigate = async (router, path, callback) => {
  await router.prefetch(path)
  router.push(path)
  callback?.()
}