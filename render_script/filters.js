function FiltersClass() {
  var _private = this;

  _private.el = null;
  _private.activeFilter = 'all';
  _private.oldSelectedElement = null;

  /**
   * [PUBLIC]
   * Update the visibility of row tags
   */
  this.updateRows = function () {
    var rows = document.getElementById('content').querySelectorAll('.row')

    for  (var row of rows) {
      if (_private.activeFilter === 'all') {
        row.style.display = 'block'
      } else {
        if ((row.querySelector('input').checked && _private.activeFilter === 'active')
          || (!row.querySelector('input').checked && _private.activeFilter === 'inactive')) {
          row.style.display = 'block'
        } else {
          row.style.display = 'none'
        }
      }
    }
  }

  /**
   * [PUBLIC]
   * The constructor
   * It binds the buttons
   */
  _private.init = function () {
    _private.el = document.getElementById('filters');
    var filters = _private.el.querySelectorAll('button')
    _private.oldSelectedElement = filters[0]

    for (var filter of filters) {
      filter.onclick = function () {
        _private.activeFilter = this.dataset.value
        this.classList.add('primary')
        this.classList.remove('secondary')

        if (_private.oldSelectedElement) {
          _private.oldSelectedElement.classList.remove('primary')
          _private.oldSelectedElement.classList.add('secondary')
        }

        _private.oldSelectedElement = this
        _private.updateRows()
      }
    }
  }

  _private.init();
}