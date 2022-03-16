const validStaticRoutes = [
  '/',
  '/campaign/add'
]

const validDynamicRoutes = [
  /[/]user[/].+$/,
  /[/]campaign[/].+[/]info$/
]

const explicitInvalidRoutes = [
  {
    pathRegex: /[/]campaign[/]{0,1}$/,
    targetPath: '/campaign/add'
  },
  {
    pathRegex: /[/]campaign[/].+[/]{0,1}$/,
    targetPath: '/campaign/:campaignAddress/info'
  }
]

export default function ({ route, redirect, from }) {
  const isValid = validatePath(route.path)

  if (!isValid) {
    const finaPath = decideInvalidRedirectPath(route.path)
    return redirect(finaPath)
  }
}

function validatePath (routePath) {
  if (validStaticRoutes.find(path => path === routePath)) {
    return true
  }

  for (let i = 0; i < validDynamicRoutes.length; i++) {
    if (validDynamicRoutes[i].test(routePath)) {
      return true
    }
  }

  return false
}

function decideInvalidRedirectPath (routePath) {
  // Default redirect path for all other invalid paths
  let finalPath = '/'
  if (explicitInvalidRoutes[0].pathRegex.test(routePath)) {
    finalPath = explicitInvalidRoutes[0].targetPath
  } else if (explicitInvalidRoutes[1].pathRegex.test(routePath)) {
    const routeSplit = routePath.split('/').filter(i => i)
    const campaignAddress = routeSplit[routeSplit.length - 1]
    finalPath = explicitInvalidRoutes[1]
      .targetPath
      .replace(':campaignAddress', campaignAddress)
  }

  return finalPath
}
