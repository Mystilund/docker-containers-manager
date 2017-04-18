const config = require('../config.json')
const process_engine = require('./process')

let docker_list;
let interval;
let window_reference;

/**
 * The entrypoint
 * @param  {object} La fenetre de jeu
 */
module.exports = {
  start: (win) => {
    window_reference = win
    docker_list = JSON.parse(JSON.stringify(config))
    getDockerInformation()
    bindUserInputs()
  }
}


/**
 * Call the "docker ps". In a set interval
 * Success : Update informations
 * Error   : Notify the error and clear the interval
 */
function dockerLoop () {
  process_engine.createProcess(
    'docker',
    ['ps'],
    (data) => { },
    (data) => {
      parseDocker(data)
      setDockerInformation()
    },
    (data) => { },
    (data) => {
      if (data.length) {
        window_reference.webContents.send('error-on-ps')
        clearInterval(interval)
      }
    }
  )
}

/**
 * Send the docker informations
 */
function setDockerInformation () {
  window_reference.webContents.send('docker_data', docker_list);
}

/**
 * Initialize the states of the containers and create the loop of "docker ps"
 */
function getDockerInformation () {
  for (var docker_item in docker_list) {
    docker_item.state = 'Down'
  }

  interval = setInterval(dockerLoop, 2000)
  dockerLoop()
}

/**
 * Use the return of docker ps to get informations
 */
function parseDocker (data) {
  var lines = data
  lines = lines.split("\n")
  lines.shift()
  lines.pop()

  for (var docker_item of docker_list) {
    docker_item.state = 'Down'
  }

  for (var line of lines) {
    var ps_cut = line.split(' ')
    var container_name = ps_cut.pop()
    var state = 'progress'

    for (var cell of ps_cut) {
      if (cell === 'Up') {
        state = 'Up'
        break
      }
    }

    for (var docker_item of docker_list) {
      if (docker_item.name === container_name) {
        docker_item.state = state
      }
    }
  }
}

/**
 * Check if the state is different than before
 * @param  {string} item  The current state
 * @param  {value}  value The state received by the core
 * @return {[Boolean]}
 */
function notSameState (item, value) {
  return (item === 'Up' && !value) || (item === 'Down' && value)
}


/**
 * Bind a switch to send data to the core
 * @return {[Boolean]}
 */
function bindUserInputs () {
  var ipc = require('electron').ipcMain

  ipc.on('switch-state', function (event, data) {
    for (var docker_item of docker_list) {
      if (docker_item.name === data.name && notSameState(docker_item.state, data.value)) {
        clearInterval(interval)

        var args = ['-f', docker_item.path, data.value ? 'up' : 'down']
        if (data.value) {
          args.push('-d')
        }

        process_engine.createProcess(
          'docker-compose' + (process.platform === 'win32' ? '.exe' : ''),
          args,
          (data) => { },
          (data) => { },
          (data) => { },
          (data) => {
            if (data.indexOf('ERROR') != -1) {
              window_reference.webContents.send('error-on-compose')
            }
          }
        )

        interval = setInterval(dockerLoop, 2000)
        break
      }
    }
  })
}