const validStaticRoutes = [
  '/',
  '/campaign/add'
]

const validDynamicRoutes = [
  /[/]user[/].+$/,
  /[/]campaign[/].+[/]info$/
]

export default function ({ route, redirect, from }) {
  console.log(route)
  const isValid = validatePath(route.path)

  if (!isValid) {
    const finaPath = decideInvalidRedirectPath(route.path, route.params)
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

function decideInvalidRedirectPath (routePath, routeParams) {
  if (/[/]campaign[/]{0,1}$/.test(routePath)) {
    return '/campaign/add'
  } else if (/[/]campaign[/].+[/]{0,1}$/.test(routePath)) {
    return '/campaign/' + routeParams.campaignAddress + '/info'
  } else {
    return '/'
  }
}
