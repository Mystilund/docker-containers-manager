function RenderClass(element, filter) {
  var _private = this;

  _private.el = null;
  _private.filter = null;

  /**
   * [PUBLIC]
   * Update the rows representing the containers
   * @param  {object} data What is sent by the core
   */
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
        lineIfExist.querySelector('#circular_spinner').style.display = 'none'
      } else if (!lineIfExist) {
        _private.el.insertAdjacentHTML('beforeend', newLine.innerHTML)
        _private.bindSwitch('container-' + container.name)
      }
      _private.filter.updateRows()
    }
  }

  /**
   * [PRIVATE]
   * Bind the switch to shutdown or mount a container
   * @param  {string} container_id The container DOM identifier
   */
  _private.bindSwitch = function (container_id) {
    var container = document.getElementById(container_id)
    var label = container.querySelector('.state-switch')
    var input = container.querySelector('input')
    var spinner = container.querySelector('#circular_spinner')

    label.onclick = function () {
      var name = this.getAttribute('for').replace(/state-/, '')
      spinner.style.display = 'inline-block'
      ipc.send('switch-state', {
        name: name,
        value: !input.checked
      })
      return false
    }
  }

  /**
   * [PRIVATE]
   * The contructor
   * @param  {HTML tag}     el      The content element
   * @param  {FilterClass}  filter  The filters top bar
   */
  _private.init = function (el, filter) {
    _private.el = el;
    _private.filter = filter;
  }

  _private.init(element, filter);
}