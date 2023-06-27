"use strict";

const globals = ["opener"];

module.exports = {
  // https://eslint.org/docs/latest/extend/plugins#metadata-in-plugins
  meta: {
    type: "suggestion",
    docs: {
        description: "Description of the rule",
    },
    fixable: "code",
    schema: [] // no options
  },
  create: function (context) {
    const restrictedGlobalMessages = [
      ...windowGlobal,
      ...webGlobal,
      ...browserCustomGlobal,
    ].reduce((memo, property) => {
      memo[property] = `禁止使用${property}`;
      return memo;
    }, {});

    function reportReference(reference) {
      const name = reference.identifier.name;
      const message = restrictedGlobalMessages[name];

      context.report({
        node: reference.identifier,
        message,
      });
    }

    function isRestricted(name) {
      return Object.prototype.hasOwnProperty.call(
        restrictedGlobalMessages,
        name
      );
    }

    return {
      Program() {
        const scope = context.getScope();
        scope.variables.forEach((variable) => {
          if (!variable.defs.length && isRestricted(variable.name)) {
            variable.references.forEach(reportReference);
          }
        });
        scope.through.forEach((reference) => {
          if (isRestricted(reference.identifier.name)) {
            reportReference(reference);
          }
        });
      },
    };
  },
};
