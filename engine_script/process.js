const spawn = require('child_process').spawn

module.exports = {
  createProcess: (exe, arguments, outData, outEnd, errData, errEnd) => {
    var output = ''
    var err_output = ''

    ps = spawn(exe, arguments);

    ps.stdout.setEncoding('utf8')
    ps.stderr.setEncoding('utf8')

    ps.stdout.on('data', (data_chunk) => {
      output += data_chunk
      outData(data_chunk)
    });
    ps.stdout.on('end', () => {
      outEnd(output)
    });
    ps.stderr.on('data', (data_chunk) => {
      err_output += data_chunk
      errData(data_chunk)
    });
    ps.stderr.on('data', () => {
      errData(err_output)
    });
  }
}