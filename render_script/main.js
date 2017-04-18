function RenderClass(element) {
  var _private = this;

  _private.el = null;

  this.update = function (data) {
    if (_private.el === null) { return; }

    for (var container of data) {
      var isChecked = (container.state === 'Up')
      var newLine = document.getElementById('template').cloneNode(true);
      var lineIfExist = document.getElementById('container-' + container.name)
      
      newLine.innerHTML = newLine.innerHTML
          .replace(/{{name}}/g, container.name)
          .replace(/{{path}}/g, container.path)
          .replace(/{{ischecked}}/g, isChecked ? 'checked' : '')

      if (lineIfExist && lineIfExist.querySelector('input').checked !== isChecked) {
        lineIfExist.querySelector('input').checked = !lineIfExist.querySelector('input').checked
      } else if (!lineIfExist) {
        _private.el.insertAdjacentHTML('beforeend', newLine.innerHTML)
        _private.bindSwitch('container-' + container.name)
      }
    }
  }

  _private.bindSwitch = function (container_id) {
    var container = document.getElementById(container_id)
    var label = container.querySelector('.state-switch')
    var input = container.querySelector('input')

    label.onclick = function () {
      var name = this.getAttribute('for').replace(/state-/, '')
      ipc.send('switch-state', {
        name: name,
        value: !input.checked
      })
      return false
    }
  }

  _private.init = function (el) {
    _private.el = el;
  }

  _private.init(element);
}