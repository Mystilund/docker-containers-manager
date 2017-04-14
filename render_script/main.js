function RenderClass(element) {
  var _private = this;

  _private.el = null;

  this.update = function (data) {
    if (_private.el === null) { return; }

    for (var container of data) {
      newLine = document.getElementById('template').cloneNode(true);

      newLine.innerHTML = newLine.innerHTML
          .replace(/{{name}}/g, container.name)
          .replace(/{{path}}/g, container.path)
          .replace(/{{ischecked}}/g, container.state === 'Up' ? 'checked' : '')
      if (document.getElementById('container-' + container.name)) {
        var toDelete = document.getElementById('container-' + container.name)
        toDelete.insertAdjacentHTML('afterend', newLine.innerHTML)
        toDelete.parentElement.removeChild(toDelete)
      } else {
        _private.el.insertAdjacentHTML('afterend', newLine.innerHTML)
      }
      _private.bindSwitchs()
    }
  }

  _private.bindSwitchs = function () {
    var switchs = _private.el.querySelectorAll('#content .switch')

    for (var state_switch of switchs) {
      var label = state_switch.querySelector('.state-switch')
      var input = state_switch.querySelector('input')

      label.onclick = function () {
        var name = label.getAttribute('for').replace(/state-/, '')
        ipc.send('switch-state', {
          name: name,
          value: !input.checked
        })
        return false
      }
    }
  }

  _private.init = function (el) {
    _private.el = el;
  }

  _private.init(element);
}