/**
 * Mixes Custom Non-CRUD Adapter Methods into the prototype.
 */

module.exports = function() {
  var self = this,
      adapters = [];

  Object.keys(this.connections).forEach(function(conn) {
    adapters.push(self.connections[conn]._adapter);
  });

  // For each adapter, add any functions that are exposed onto the prototype
  adapters.forEach(function(adapter) {
    adapter = adapter || {};
    Object.keys(adapter).forEach(function(key) {

      // Ignore the Identity Property
      if(key === 'identity') return;

      // Don't override keys that already exists
      if(self[key]) return;

      // Apply the Function with passed in args and set this.identity as
      // the first argument
      self[key] = function() {

        // Concat self.identity with args (must massage arguments into a proper array)
        // Use a normalized _tableName set in the core module.
        var args = [self.identity].concat(Array.prototype.slice.call(arguments));
        adapter[key].apply(self, args);
      };
    });
  });
};
