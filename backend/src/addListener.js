function addListener (contractInstance, event, callback) {
  const subscription = contractInstance[event]({})
  subscription.on('data', callback)
  return subscription
}

export default addListener
