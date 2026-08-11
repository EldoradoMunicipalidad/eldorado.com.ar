(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/react/cjs/react.development.js
  var require_react_development = __commonJS({
    "node_modules/react/cjs/react.development.js"(exports, module) {
      "use strict";
      (function() {
        function defineDeprecationWarning(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              console.warn(
                "%s(...) is deprecated in plain JavaScript React classes. %s",
                info[0],
                info[1]
              );
            }
          });
        }
        function getIteratorFn(maybeIterable) {
          if (null === maybeIterable || "object" !== typeof maybeIterable)
            return null;
          maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
          return "function" === typeof maybeIterable ? maybeIterable : null;
        }
        function warnNoop(publicInstance, callerName) {
          publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
          var warningKey = publicInstance + "." + callerName;
          didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
            "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
            callerName,
            publicInstance
          ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
        }
        function Component(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function ComponentDummy() {
        }
        function PureComponent(props, context, updater) {
          this.props = props;
          this.context = context;
          this.refs = emptyObject;
          this.updater = updater || ReactNoopUpdateQueue;
        }
        function noop() {
        }
        function testStringCoercion(value) {
          return "" + value;
        }
        function checkKeyStringCoercion(value) {
          try {
            testStringCoercion(value);
            var JSCompiler_inline_result = false;
          } catch (e) {
            JSCompiler_inline_result = true;
          }
          if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(
              JSCompiler_inline_result,
              "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
              JSCompiler_inline_result$jscomp$0
            );
            return testStringCoercion(value);
          }
        }
        function getComponentNameFromType(type) {
          if (null == type) return null;
          if ("function" === typeof type)
            return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
          if ("string" === typeof type) return type;
          switch (type) {
            case REACT_FRAGMENT_TYPE:
              return "Fragment";
            case REACT_PROFILER_TYPE:
              return "Profiler";
            case REACT_STRICT_MODE_TYPE:
              return "StrictMode";
            case REACT_SUSPENSE_TYPE:
              return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
              return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
              return "Activity";
          }
          if ("object" === typeof type)
            switch ("number" === typeof type.tag && console.error(
              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
            ), type.$$typeof) {
              case REACT_PORTAL_TYPE:
                return "Portal";
              case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
              case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
              case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
              case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
              case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                  return getComponentNameFromType(type(innerType));
                } catch (x) {
                }
            }
          return null;
        }
        function getTaskName(type) {
          if (type === REACT_FRAGMENT_TYPE) return "<>";
          if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
            return "<...>";
          try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
          } catch (x) {
            return "<...>";
          }
        }
        function getOwner() {
          var dispatcher = ReactSharedInternals.A;
          return null === dispatcher ? null : dispatcher.getOwner();
        }
        function UnknownOwner() {
          return Error("react-stack-top-frame");
        }
        function hasValidKey(config) {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return false;
          }
          return void 0 !== config.key;
        }
        function defineKeyPropWarningGetter(props, displayName) {
          function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
              "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
              displayName
            ));
          }
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
        function elementRefGetterWithDeprecationWarning() {
          var componentName = getComponentNameFromType(this.type);
          didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
            "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
          ));
          componentName = this.props.ref;
          return void 0 !== componentName ? componentName : null;
        }
        function ReactElement(type, key, props, owner, debugStack, debugTask) {
          var refProp = props.ref;
          type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type,
            key,
            props,
            _owner: owner
          };
          null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: false,
            get: elementRefGetterWithDeprecationWarning
          }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
          type._store = {};
          Object.defineProperty(type._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: 0
          });
          Object.defineProperty(type, "_debugInfo", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: null
          });
          Object.defineProperty(type, "_debugStack", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugStack
          });
          Object.defineProperty(type, "_debugTask", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: debugTask
          });
          Object.freeze && (Object.freeze(type.props), Object.freeze(type));
          return type;
        }
        function cloneAndReplaceKey(oldElement, newKey) {
          newKey = ReactElement(
            oldElement.type,
            newKey,
            oldElement.props,
            oldElement._owner,
            oldElement._debugStack,
            oldElement._debugTask
          );
          oldElement._store && (newKey._store.validated = oldElement._store.validated);
          return newKey;
        }
        function validateChildKeys(node) {
          isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
        }
        function isValidElement(object) {
          return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
        }
        function escape(key) {
          var escaperLookup = { "=": "=0", ":": "=2" };
          return "$" + key.replace(/[=:]/g, function(match) {
            return escaperLookup[match];
          });
        }
        function getElementKey(element, index) {
          return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
        }
        function resolveThenable(thenable) {
          switch (thenable.status) {
            case "fulfilled":
              return thenable.value;
            case "rejected":
              throw thenable.reason;
            default:
              switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
                function(fulfilledValue) {
                  "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
                },
                function(error) {
                  "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              )), thenable.status) {
                case "fulfilled":
                  return thenable.value;
                case "rejected":
                  throw thenable.reason;
              }
          }
          throw thenable;
        }
        function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
          var type = typeof children;
          if ("undefined" === type || "boolean" === type) children = null;
          var invokeCallback = false;
          if (null === children) invokeCallback = true;
          else
            switch (type) {
              case "bigint":
              case "string":
              case "number":
                invokeCallback = true;
                break;
              case "object":
                switch (children.$$typeof) {
                  case REACT_ELEMENT_TYPE:
                  case REACT_PORTAL_TYPE:
                    invokeCallback = true;
                    break;
                  case REACT_LAZY_TYPE:
                    return invokeCallback = children._init, mapIntoArray(
                      invokeCallback(children._payload),
                      array,
                      escapedPrefix,
                      nameSoFar,
                      callback
                    );
                }
            }
          if (invokeCallback) {
            invokeCallback = children;
            callback = callback(invokeCallback);
            var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
            isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
              return c;
            })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
              callback,
              escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
                userProvidedKeyEscapeRegex,
                "$&/"
              ) + "/") + childKey
            ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
            return 1;
          }
          invokeCallback = 0;
          childKey = "" === nameSoFar ? "." : nameSoFar + ":";
          if (isArrayImpl(children))
            for (var i = 0; i < children.length; i++)
              nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if (i = getIteratorFn(children), "function" === typeof i)
            for (i === children.entries && (didWarnAboutMaps || console.warn(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
              nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
                nameSoFar,
                array,
                escapedPrefix,
                type,
                callback
              );
          else if ("object" === type) {
            if ("function" === typeof children.then)
              return mapIntoArray(
                resolveThenable(children),
                array,
                escapedPrefix,
                nameSoFar,
                callback
              );
            array = String(children);
            throw Error(
              "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
            );
          }
          return invokeCallback;
        }
        function mapChildren(children, func, context) {
          if (null == children) return children;
          var result = [], count = 0;
          mapIntoArray(children, result, "", "", function(child) {
            return func.call(context, child, count++);
          });
          return result;
        }
        function lazyInitializer(payload) {
          if (-1 === payload._status) {
            var ioInfo = payload._ioInfo;
            null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
            ioInfo = payload._result;
            var thenable = ioInfo();
            thenable.then(
              function(moduleObject) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 1;
                  payload._result = moduleObject;
                  var _ioInfo = payload._ioInfo;
                  null != _ioInfo && (_ioInfo.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
                }
              },
              function(error) {
                if (0 === payload._status || -1 === payload._status) {
                  payload._status = 2;
                  payload._result = error;
                  var _ioInfo2 = payload._ioInfo;
                  null != _ioInfo2 && (_ioInfo2.end = performance.now());
                  void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
                }
              }
            );
            ioInfo = payload._ioInfo;
            if (null != ioInfo) {
              ioInfo.value = thenable;
              var displayName = thenable.displayName;
              "string" === typeof displayName && (ioInfo.name = displayName);
            }
            -1 === payload._status && (payload._status = 0, payload._result = thenable);
          }
          if (1 === payload._status)
            return ioInfo = payload._result, void 0 === ioInfo && console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
              ioInfo
            ), "default" in ioInfo || console.error(
              "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
              ioInfo
            ), ioInfo.default;
          throw payload._result;
        }
        function resolveDispatcher() {
          var dispatcher = ReactSharedInternals.H;
          null === dispatcher && console.error(
            "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
          );
          return dispatcher;
        }
        function releaseAsyncTransition() {
          ReactSharedInternals.asyncTransitions--;
        }
        function enqueueTask(task) {
          if (null === enqueueTaskImpl)
            try {
              var requireString = ("require" + Math.random()).slice(0, 7);
              enqueueTaskImpl = (module && module[requireString]).call(
                module,
                "timers"
              ).setImmediate;
            } catch (_err) {
              enqueueTaskImpl = function(callback) {
                false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                  "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
                ));
                var channel = new MessageChannel();
                channel.port1.onmessage = callback;
                channel.port2.postMessage(void 0);
              };
            }
          return enqueueTaskImpl(task);
        }
        function aggregateErrors(errors) {
          return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
        }
        function popActScope(prevActQueue, prevActScopeDepth) {
          prevActScopeDepth !== actScopeDepth - 1 && console.error(
            "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
          );
          actScopeDepth = prevActScopeDepth;
        }
        function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
          var queue = ReactSharedInternals.actQueue;
          if (null !== queue)
            if (0 !== queue.length)
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
                return;
              } catch (error) {
                ReactSharedInternals.thrownErrors.push(error);
              }
            else ReactSharedInternals.actQueue = null;
          0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
        }
        function flushActQueue(queue) {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (; i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactSharedInternals.didUsePromise = false;
                  var continuation = callback(false);
                  if (null !== continuation) {
                    if (ReactSharedInternals.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else break;
                } while (1);
              }
              queue.length = 0;
            } catch (error) {
              queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
            } finally {
              isFlushing = false;
            }
          }
        }
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
        var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
          isMounted: function() {
            return false;
          },
          enqueueForceUpdate: function(publicInstance) {
            warnNoop(publicInstance, "forceUpdate");
          },
          enqueueReplaceState: function(publicInstance) {
            warnNoop(publicInstance, "replaceState");
          },
          enqueueSetState: function(publicInstance) {
            warnNoop(publicInstance, "setState");
          }
        }, assign = Object.assign, emptyObject = {};
        Object.freeze(emptyObject);
        Component.prototype.isReactComponent = {};
        Component.prototype.setState = function(partialState, callback) {
          if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, partialState, callback, "setState");
        };
        Component.prototype.forceUpdate = function(callback) {
          this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
        };
        var deprecatedAPIs = {
          isMounted: [
            "isMounted",
            "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
          ],
          replaceState: [
            "replaceState",
            "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
          ]
        };
        for (fnName in deprecatedAPIs)
          deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        ComponentDummy.prototype = Component.prototype;
        deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
        deprecatedAPIs.constructor = PureComponent;
        assign(deprecatedAPIs, Component.prototype);
        deprecatedAPIs.isPureReactComponent = true;
        var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
          H: null,
          A: null,
          T: null,
          S: null,
          actQueue: null,
          asyncTransitions: 0,
          isBatchingLegacy: false,
          didScheduleLegacyUpdate: false,
          didUsePromise: false,
          thrownErrors: [],
          getCurrentStack: null,
          recentlyCreatedOwnerStacks: 0
        }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
          return null;
        };
        deprecatedAPIs = {
          react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
          }
        };
        var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
        var didWarnAboutElementRef = {};
        var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
          deprecatedAPIs,
          UnknownOwner
        )();
        var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
        var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
          if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
            var event = new window.ErrorEvent("error", {
              bubbles: true,
              cancelable: true,
              message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
              error
            });
            if (!window.dispatchEvent(event)) return;
          } else if ("object" === typeof process && "function" === typeof process.emit) {
            process.emit("uncaughtException", error);
            return;
          }
          console.error(error);
        }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
          queueMicrotask(function() {
            return queueMicrotask(callback);
          });
        } : enqueueTask;
        deprecatedAPIs = Object.freeze({
          __proto__: null,
          c: function(size) {
            return resolveDispatcher().useMemoCache(size);
          }
        });
        var fnName = {
          map: mapChildren,
          forEach: function(children, forEachFunc, forEachContext) {
            mapChildren(
              children,
              function() {
                forEachFunc.apply(this, arguments);
              },
              forEachContext
            );
          },
          count: function(children) {
            var n = 0;
            mapChildren(children, function() {
              n++;
            });
            return n;
          },
          toArray: function(children) {
            return mapChildren(children, function(child) {
              return child;
            }) || [];
          },
          only: function(children) {
            if (!isValidElement(children))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return children;
          }
        };
        exports.Activity = REACT_ACTIVITY_TYPE;
        exports.Children = fnName;
        exports.Component = Component;
        exports.Fragment = REACT_FRAGMENT_TYPE;
        exports.Profiler = REACT_PROFILER_TYPE;
        exports.PureComponent = PureComponent;
        exports.StrictMode = REACT_STRICT_MODE_TYPE;
        exports.Suspense = REACT_SUSPENSE_TYPE;
        exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
        exports.__COMPILER_RUNTIME = deprecatedAPIs;
        exports.act = function(callback) {
          var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
          try {
            var result = callback();
          } catch (error) {
            ReactSharedInternals.thrownErrors.push(error);
          }
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          if (null !== result && "object" === typeof result && "function" === typeof result.then) {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
                "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
              ));
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(
                  function(returnValue) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    if (0 === prevActScopeDepth) {
                      try {
                        flushActQueue(queue), enqueueTask(function() {
                          return recursivelyFlushAsyncActWork(
                            returnValue,
                            resolve,
                            reject
                          );
                        });
                      } catch (error$0) {
                        ReactSharedInternals.thrownErrors.push(error$0);
                      }
                      if (0 < ReactSharedInternals.thrownErrors.length) {
                        var _thrownError = aggregateErrors(
                          ReactSharedInternals.thrownErrors
                        );
                        ReactSharedInternals.thrownErrors.length = 0;
                        reject(_thrownError);
                      }
                    } else resolve(returnValue);
                  },
                  function(error) {
                    popActScope(prevActQueue, prevActScopeDepth);
                    0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                      ReactSharedInternals.thrownErrors
                    ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                  }
                );
              }
            };
          }
          var returnValue$jscomp$0 = result;
          popActScope(prevActQueue, prevActScopeDepth);
          0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
            ));
          }), ReactSharedInternals.actQueue = null);
          if (0 < ReactSharedInternals.thrownErrors.length)
            throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
                return recursivelyFlushAsyncActWork(
                  returnValue$jscomp$0,
                  resolve,
                  reject
                );
              })) : resolve(returnValue$jscomp$0);
            }
          };
        };
        exports.cache = function(fn) {
          return function() {
            return fn.apply(null, arguments);
          };
        };
        exports.cacheSignal = function() {
          return null;
        };
        exports.captureOwnerStack = function() {
          var getCurrentStack = ReactSharedInternals.getCurrentStack;
          return null === getCurrentStack ? null : getCurrentStack();
        };
        exports.cloneElement = function(element, config, children) {
          if (null === element || void 0 === element)
            throw Error(
              "The argument must be a React element, but you passed " + element + "."
            );
          var props = assign({}, element.props), key = element.key, owner = element._owner;
          if (null != config) {
            var JSCompiler_inline_result;
            a: {
              if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
                config,
                "ref"
              ).get) && JSCompiler_inline_result.isReactWarning) {
                JSCompiler_inline_result = false;
                break a;
              }
              JSCompiler_inline_result = void 0 !== config.ref;
            }
            JSCompiler_inline_result && (owner = getOwner());
            hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
            for (propName in config)
              !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
          }
          var propName = arguments.length - 2;
          if (1 === propName) props.children = children;
          else if (1 < propName) {
            JSCompiler_inline_result = Array(propName);
            for (var i = 0; i < propName; i++)
              JSCompiler_inline_result[i] = arguments[i + 2];
            props.children = JSCompiler_inline_result;
          }
          props = ReactElement(
            element.type,
            key,
            props,
            owner,
            element._debugStack,
            element._debugTask
          );
          for (key = 2; key < arguments.length; key++)
            validateChildKeys(arguments[key]);
          return props;
        };
        exports.createContext = function(defaultValue) {
          defaultValue = {
            $$typeof: REACT_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null
          };
          defaultValue.Provider = defaultValue;
          defaultValue.Consumer = {
            $$typeof: REACT_CONSUMER_TYPE,
            _context: defaultValue
          };
          defaultValue._currentRenderer = null;
          defaultValue._currentRenderer2 = null;
          return defaultValue;
        };
        exports.createElement = function(type, config, children) {
          for (var i = 2; i < arguments.length; i++)
            validateChildKeys(arguments[i]);
          i = {};
          var key = null;
          if (null != config)
            for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
              "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
            )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
              hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
          var childrenLength = arguments.length - 2;
          if (1 === childrenLength) i.children = children;
          else if (1 < childrenLength) {
            for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
              childArray[_i] = arguments[_i + 2];
            Object.freeze && Object.freeze(childArray);
            i.children = childArray;
          }
          if (type && type.defaultProps)
            for (propName in childrenLength = type.defaultProps, childrenLength)
              void 0 === i[propName] && (i[propName] = childrenLength[propName]);
          key && defineKeyPropWarningGetter(
            i,
            "function" === typeof type ? type.displayName || type.name || "Unknown" : type
          );
          var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
          return ReactElement(
            type,
            key,
            i,
            getOwner(),
            propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack,
            propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
          );
        };
        exports.createRef = function() {
          var refObject = { current: null };
          Object.seal(refObject);
          return refObject;
        };
        exports.forwardRef = function(render) {
          null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
            "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
          ) : "function" !== typeof render ? console.error(
            "forwardRef requires a render function but was given %s.",
            null === render ? "null" : typeof render
          ) : 0 !== render.length && 2 !== render.length && console.error(
            "forwardRef render functions accept exactly two parameters: props and ref. %s",
            1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
          );
          null != render && null != render.defaultProps && console.error(
            "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
          );
          var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
            }
          });
          return elementType;
        };
        exports.isValidElement = isValidElement;
        exports.lazy = function(ctor) {
          ctor = { _status: -1, _result: ctor };
          var lazyType = {
            $$typeof: REACT_LAZY_TYPE,
            _payload: ctor,
            _init: lazyInitializer
          }, ioInfo = {
            name: "lazy",
            start: -1,
            end: -1,
            value: null,
            owner: null,
            debugStack: Error("react-stack-top-frame"),
            debugTask: console.createTask ? console.createTask("lazy()") : null
          };
          ctor._ioInfo = ioInfo;
          lazyType._debugInfo = [{ awaited: ioInfo }];
          return lazyType;
        };
        exports.memo = function(type, compare) {
          null == type && console.error(
            "memo: The first argument must be a component. Instead received: %s",
            null === type ? "null" : typeof type
          );
          compare = {
            $$typeof: REACT_MEMO_TYPE,
            type,
            compare: void 0 === compare ? null : compare
          };
          var ownName;
          Object.defineProperty(compare, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
            }
          });
          return compare;
        };
        exports.startTransition = function(scope) {
          var prevTransition = ReactSharedInternals.T, currentTransition = {};
          currentTransition._updatedFibers = /* @__PURE__ */ new Set();
          ReactSharedInternals.T = currentTransition;
          try {
            var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
            null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
            "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
          } catch (error) {
            reportGlobalError(error);
          } finally {
            null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
              "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
            )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
              "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
            ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
          }
        };
        exports.unstable_useCacheRefresh = function() {
          return resolveDispatcher().useCacheRefresh();
        };
        exports.use = function(usable) {
          return resolveDispatcher().use(usable);
        };
        exports.useActionState = function(action, initialState, permalink) {
          return resolveDispatcher().useActionState(
            action,
            initialState,
            permalink
          );
        };
        exports.useCallback = function(callback, deps) {
          return resolveDispatcher().useCallback(callback, deps);
        };
        exports.useContext = function(Context) {
          var dispatcher = resolveDispatcher();
          Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
            "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
          );
          return dispatcher.useContext(Context);
        };
        exports.useDebugValue = function(value, formatterFn) {
          return resolveDispatcher().useDebugValue(value, formatterFn);
        };
        exports.useDeferredValue = function(value, initialValue) {
          return resolveDispatcher().useDeferredValue(value, initialValue);
        };
        exports.useEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useEffect(create, deps);
        };
        exports.useEffectEvent = function(callback) {
          return resolveDispatcher().useEffectEvent(callback);
        };
        exports.useId = function() {
          return resolveDispatcher().useId();
        };
        exports.useImperativeHandle = function(ref, create, deps) {
          return resolveDispatcher().useImperativeHandle(ref, create, deps);
        };
        exports.useInsertionEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useInsertionEffect(create, deps);
        };
        exports.useLayoutEffect = function(create, deps) {
          null == create && console.warn(
            "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
          );
          return resolveDispatcher().useLayoutEffect(create, deps);
        };
        exports.useMemo = function(create, deps) {
          return resolveDispatcher().useMemo(create, deps);
        };
        exports.useOptimistic = function(passthrough, reducer) {
          return resolveDispatcher().useOptimistic(passthrough, reducer);
        };
        exports.useReducer = function(reducer, initialArg, init) {
          return resolveDispatcher().useReducer(reducer, initialArg, init);
        };
        exports.useRef = function(initialValue) {
          return resolveDispatcher().useRef(initialValue);
        };
        exports.useState = function(initialState) {
          return resolveDispatcher().useState(initialState);
        };
        exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
          return resolveDispatcher().useSyncExternalStore(
            subscribe,
            getSnapshot,
            getServerSnapshot
          );
        };
        exports.useTransition = function() {
          return resolveDispatcher().useTransition();
        };
        exports.version = "19.2.3";
        "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
      })();
    }
  });

  // node_modules/react/index.js
  var require_react = __commonJS({
    "node_modules/react/index.js"(exports, module) {
      "use strict";
      if (false) {
        module.exports = null;
      } else {
        module.exports = require_react_development();
      }
    }
  });

  // src/pages/CiudadanoDigital/PreinscripcionComercialPage.jsx
  var import_react4 = __toESM(require_react(), 1);

  // src/assets/components/SectionLayout.jsx
  var import_react = __toESM(require_react(), 1);
  var SectionLayout = ({ title, highlight, description, children }) => {
    return /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-slate-50 text-slate-900 font-sans" }, /* @__PURE__ */ import_react.default.createElement("main", { className: "max-w-7xl mx-auto px-6 py-10 md:py-16" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12 md:mb-20" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h1", { className: "text-3xl md:text-5xl font-light text-sky-500 leading-tight" }, title, " ", /* @__PURE__ */ import_react.default.createElement("br", null), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-4xl md:text-6xl text-sky-500 font-semibold" }, highlight))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-lg md:text-slate-600 pl-6" }, description))), /* @__PURE__ */ import_react.default.createElement("div", { className: "space-y-16" }, children)));
  };
  var SectionLayout_default = SectionLayout;

  // src/assets/components/Section.jsx
  var Section = ({ children }) => {
    return /* @__PURE__ */ React.createElement("section", { className: "px-4 py-8 md:px-16 md:py-12 max-w-7xl mx-auto" }, children);
  };

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var import_react3 = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/shared/src/utils.js
  var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  var toCamelCase = (string) => string.replace(
    /^([A-Z])|[\s-_]+(\w)/g,
    (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
  );
  var toPascalCase = (string) => {
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };
  var mergeClasses = (...classes) => classes.filter((className, index, array) => {
    return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
  }).join(" ").trim();
  var hasA11yProp = (props) => {
    for (const prop in props) {
      if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
        return true;
      }
    }
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var import_react2 = __toESM(require_react());

  // node_modules/lucide-react/dist/esm/defaultAttributes.js
  var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  // node_modules/lucide-react/dist/esm/Icon.js
  var Icon = (0, import_react2.forwardRef)(
    ({
      color = "currentColor",
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      className = "",
      children,
      iconNode,
      ...rest
    }, ref) => (0, import_react2.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react2.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    )
  );

  // node_modules/lucide-react/dist/esm/createLucideIcon.js
  var createLucideIcon = (iconName, iconNode) => {
    const Component = (0, import_react3.forwardRef)(
      ({ className, ...props }, ref) => (0, import_react3.createElement)(Icon, {
        ref,
        iconNode,
        className: mergeClasses(
          `lucide-${toKebabCase(toPascalCase(iconName))}`,
          `lucide-${iconName}`,
          className
        ),
        ...props
      })
    );
    Component.displayName = toPascalCase(iconName);
    return Component;
  };

  // node_modules/lucide-react/dist/esm/icons/arrow-left.js
  var __iconNode = [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }]
  ];
  var ArrowLeft = createLucideIcon("arrow-left", __iconNode);

  // node_modules/lucide-react/dist/esm/icons/briefcase.js
  var __iconNode2 = [
    ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
    ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
  ];
  var Briefcase = createLucideIcon("briefcase", __iconNode2);

  // node_modules/lucide-react/dist/esm/icons/building-2.js
  var __iconNode3 = [
    ["path", { d: "M10 12h4", key: "a56b0p" }],
    ["path", { d: "M10 8h4", key: "1sr2af" }],
    ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3", key: "1rgiei" }],
    [
      "path",
      {
        d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
        key: "secmi2"
      }
    ],
    ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16", key: "16ra0t" }]
  ];
  var Building2 = createLucideIcon("building-2", __iconNode3);

  // node_modules/lucide-react/dist/esm/icons/check.js
  var __iconNode4 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
  var Check = createLucideIcon("check", __iconNode4);

  // node_modules/lucide-react/dist/esm/icons/chevron-left.js
  var __iconNode5 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
  var ChevronLeft = createLucideIcon("chevron-left", __iconNode5);

  // node_modules/lucide-react/dist/esm/icons/chevron-right.js
  var __iconNode6 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
  var ChevronRight = createLucideIcon("chevron-right", __iconNode6);

  // node_modules/lucide-react/dist/esm/icons/circle-alert.js
  var __iconNode7 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
  ];
  var CircleAlert = createLucideIcon("circle-alert", __iconNode7);

  // node_modules/lucide-react/dist/esm/icons/circle-check.js
  var __iconNode8 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
  ];
  var CircleCheck = createLucideIcon("circle-check", __iconNode8);

  // node_modules/lucide-react/dist/esm/icons/file.js
  var __iconNode9 = [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }]
  ];
  var File = createLucideIcon("file", __iconNode9);

  // node_modules/lucide-react/dist/esm/icons/info.js
  var __iconNode10 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }]
  ];
  var Info = createLucideIcon("info", __iconNode10);

  // node_modules/lucide-react/dist/esm/icons/loader-circle.js
  var __iconNode11 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
  var LoaderCircle = createLucideIcon("loader-circle", __iconNode11);

  // node_modules/lucide-react/dist/esm/icons/map-pin.js
  var __iconNode12 = [
    [
      "path",
      {
        d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        key: "1r0f0z"
      }
    ],
    ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
  ];
  var MapPin = createLucideIcon("map-pin", __iconNode12);

  // node_modules/lucide-react/dist/esm/icons/upload.js
  var __iconNode13 = [
    ["path", { d: "M12 3v12", key: "1x0j5s" }],
    ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
  ];
  var Upload = createLucideIcon("upload", __iconNode13);

  // node_modules/lucide-react/dist/esm/icons/user.js
  var __iconNode14 = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
    ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
  ];
  var User = createLucideIcon("user", __iconNode14);

  // node_modules/lucide-react/dist/esm/icons/x.js
  var __iconNode15 = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ];
  var X = createLucideIcon("x", __iconNode15);

  // src/data/preinscripcionFieldsConfig.jsx
  var DEFAULT_FIELDS_CONFIG = {
    // ─── PASO 1: Datos Personales ───
    tipo_persona: {
      step: 1,
      label: "Tipo de Persona",
      type: "select",
      required: true,
      visible: true,
      options: [
        { value: "", label: "Seleccionar..." },
        { value: "fisica", label: "Persona F\xEDsica" },
        { value: "juridica", label: "Persona Jur\xEDdica" }
      ],
      placeholder: null,
      showIf: null
      // condicion para mostrar (null = siempre)
    },
    dni: {
      step: 1,
      label: "DNI",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Ej: 12345678",
      showIf: { field: "tipo_persona", value: "fisica" }
      // solo para persona física
    },
    cuit_cuil: {
      step: 1,
      label: "CUIT / CUIL",
      type: "text",
      required: true,
      visible: true,
      options: null,
      placeholder: "Ej: 20-12345678-5",
      showIf: null
    },
    apellido_nombre: {
      step: 1,
      label: "Apellido y Nombre",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Apellido, Nombre",
      showIf: { field: "tipo_persona", value: "fisica" }
    },
    razon_social: {
      step: 1,
      label: "Raz\xF3n Social",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Nombre de la empresa S.A.",
      showIf: { field: "tipo_persona", value: "juridica" }
    },
    domicilio_real: {
      step: 1,
      label: "Domicilio Real",
      type: "text",
      required: true,
      visible: true,
      options: null,
      placeholder: "Calle y n\xFAmero",
      showIf: null
    },
    email: {
      step: 1,
      label: "Email",
      type: "email",
      required: true,
      visible: true,
      options: null,
      placeholder: "correo@ejemplo.com",
      showIf: null
    },
    telefono: {
      step: 1,
      label: "Tel\xE9fono",
      type: "tel",
      required: true,
      visible: true,
      options: null,
      placeholder: "Ej: 3755-123456",
      showIf: null
    },
    // Archivos paso 1
    dni_frente_file: {
      step: 1,
      label: "Copia del DNI - Frente",
      type: "file",
      required: false,
      visible: true,
      options: null,
      showIf: { field: "tipo_persona", value: "fisica" },
      multiple: false
    },
    dni_dorso_file: {
      step: 1,
      label: "Copia del DNI - Dorso",
      type: "file",
      required: false,
      visible: true,
      options: null,
      showIf: { field: "tipo_persona", value: "fisica" },
      multiple: false
    },
    estatuto_file: {
      step: 1,
      label: "Estatuto (file upload)",
      type: "file",
      required: false,
      visible: false,
      options: null,
      showIf: { field: "tipo_persona", value: "juridica" }
    },
    acta_designacion_file: {
      step: 1,
      label: "Acta de Designaci\xF3n (file upload)",
      type: "file",
      required: false,
      visible: false,
      options: null,
      showIf: { field: "tipo_persona", value: "juridica" }
    },
    // ─── PASO 2: Ubicación del Local ───
    seccion: {
      step: 2,
      label: "Secci\xF3n",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Ej: A",
      showIf: null
    },
    manzana: {
      step: 2,
      label: "Manzana",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Ej: 12",
      showIf: null
    },
    parcela: {
      step: 2,
      label: "Parcela",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Ej: 3",
      showIf: null
    },
    direccion_completa: {
      step: 2,
      label: "Direcci\xF3n Completa",
      type: "text",
      required: true,
      visible: true,
      options: null,
      placeholder: "Calle y n\xFAmero",
      showIf: null
    },
    propietario_local: {
      step: 2,
      label: "Propietario del Local",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Nombre del propietario",
      showIf: null
    },
    barrio: {
      step: 2,
      label: "Barrio",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Nombre del barrio",
      showIf: null
    },
    documento_propiedad_file: {
      step: 2,
      label: "Documento de Propiedad (t\xEDtulo, contrato de alquiler)",
      type: "file",
      required: false,
      visible: true,
      options: null,
      showIf: null,
      multiple: true
    },
    superficie_cubierta: {
      step: 2,
      label: "Superficie Cubierta (m\xB2)",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Ej: 120",
      showIf: null
    },
    superficie_semicubierta: {
      step: 2,
      label: "Superficie Semicubierta (m\xB2)",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Ej: 30",
      showIf: null
    },
    superficie_total: {
      step: 2,
      label: "Superficie Total (m\xB2)",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Ej: 150",
      showIf: null
    },
    georeferenciacion: {
      step: 2,
      label: "Georreferenciaci\xF3n",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Coordenadas",
      showIf: null
    },
    // ─── PASO 3: Actividad Comercial ───
    tipo_tramite: {
      step: 3,
      label: "Tipo de Tr\xE1mite",
      type: "select",
      required: true,
      visible: true,
      options: [
        { value: "", label: "Seleccionar..." },
        { value: "habilitacion", label: "Habilitaci\xF3n" },
        { value: "anexo", label: "Anexo" },
        { value: "traslado", label: "Traslado" },
        { value: "cambio_titular", label: "Cambio de Titular" },
        { value: "cambio_rubro", label: "Cambio de Rubro" }
      ],
      placeholder: null,
      showIf: null
    },
    categoria: {
      step: 3,
      label: "Categor\xEDa",
      type: "select",
      required: true,
      visible: true,
      options: [
        { value: "", label: "Seleccionar..." },
        { value: "servicio", label: "Servicio" },
        { value: "comercial", label: "Comercial" },
        { value: "industrial", label: "Industrial" }
      ],
      placeholder: null,
      showIf: null
    },
    actividad_principal: {
      step: 3,
      label: "Actividad Principal",
      type: "text",
      required: true,
      visible: true,
      options: null,
      placeholder: "Descripci\xF3n de la actividad",
      showIf: null
    },
    actividad_secundaria: {
      step: 3,
      label: "Actividad Secundaria",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Otra actividad (opcional)",
      showIf: null
    },
    otra_actividad: {
      step: 3,
      label: "Otra Actividad",
      type: "text",
      required: false,
      visible: true,
      options: null,
      placeholder: "Otra actividad (opcional)",
      showIf: null
    },
    constancia_arca_file: {
      step: 3,
      label: "Constancia ARCA/ATM",
      type: "file",
      required: false,
      visible: true,
      options: null,
      showIf: null,
      multiple: true
    }
  };
  function loadFieldsConfig() {
    try {
      const saved = localStorage.getItem("preinscripcion_fields_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_FIELDS_CONFIG, ...parsed };
      }
    } catch (e) {
      console.warn("Error loading fields config:", e);
    }
    return { ...DEFAULT_FIELDS_CONFIG };
  }
  function getVisibleFieldsForStep(step, config, formData = {}) {
    return Object.entries(config).filter(([key, field]) => {
      if (field.step !== step) return false;
      if (!field.visible) return false;
      if (field.showIf) {
        const { field: condField, value } = field.showIf;
        if (formData[condField] !== value) return false;
      }
      return true;
    }).map(([key, field]) => ({ key, ...field }));
  }

  // src/pages/CiudadanoDigital/PreinscripcionComercialPage.jsx
  var MAX_FILE_SIZE = 10 * 1024 * 1024;
  var ALLOWED_EXTENSIONS = /\.(pdf|jpg|jpeg|png|gif|webp)$/i;
  var INITIAL_FORM_DATA = {
    // Paso 1
    tipo_persona: "",
    dni: "",
    cuit_cuil: "",
    apellido_nombre: "",
    razon_social: "",
    domicilio_real: "",
    email: "",
    telefono: "",
    // Archivos paso 1
    dni_frente_file: null,
    dni_dorso_file: null,
    estatuto_file: null,
    acta_designacion_file: null,
    // Paso 2
    seccion: "",
    manzana: "",
    parcela: "",
    direccion_completa: "",
    propietario_local: "",
    barrio: "",
    documento_propiedad_file: [],
    // Superficie (Paso 2)
    superficie_cubierta: "",
    superficie_semicubierta: "",
    superficie_total: "",
    georeferenciacion: "",
    // Paso 3
    tipo_tramite: "",
    categoria: "",
    actividad_principal: "",
    actividad_secundaria: "",
    otra_actividad: "",
    constancia_arca_file: []
  };
  function PreinscripcionComercialPage() {
    const [currentStep, setCurrentStep] = (0, import_react4.useState)(1);
    const [formData, setFormData] = (0, import_react4.useState)(INITIAL_FORM_DATA);
    const [errors, setErrors] = (0, import_react4.useState)({});
    const [isSubmitting, setIsSubmitting] = (0, import_react4.useState)(false);
    const [isSuccess, setIsSuccess] = (0, import_react4.useState)(false);
    const [uploadProgress, setUploadProgress] = (0, import_react4.useState)({});
    const [uploadedFiles, setUploadedFiles] = (0, import_react4.useState)({});
    const uploadedFilesRef = import_react4.default.useRef({});
    import_react4.default.useEffect(() => {
      uploadedFilesRef.current = uploadedFiles;
    }, [uploadedFiles]);
    const [submitError, setSubmitError] = (0, import_react4.useState)("");
    const [uploadError, setUploadError] = (0, import_react4.useState)("");
    const [fileErrors, setFileErrors] = (0, import_react4.useState)({});
    const [fieldsConfig, setFieldsConfig] = (0, import_react4.useState)(null);
    (0, import_react4.useEffect)(() => {
      const config = loadFieldsConfig();
      setFieldsConfig(config);
    }, []);
    const getFieldConfig = (fieldKey) => {
      return fieldsConfig ? fieldsConfig[fieldKey] : null;
    };
    const renderTextField = (fieldKey, className = "") => {
      const config = getFieldConfig(fieldKey);
      if (!config || config.type === "file") return null;
      const label = config.label || fieldKey;
      const placeholder = config.placeholder || "";
      const required = config.required;
      return /* @__PURE__ */ import_react4.default.createElement("div", { className }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label, " ", required && /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ import_react4.default.createElement(
        "input",
        {
          type: config.type || "text",
          value: formData[fieldKey],
          onChange: (e) => updateField(fieldKey, e.target.value),
          className: `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${errors[fieldKey] ? "border-red-300 bg-red-50" : "border-gray-200"}`,
          placeholder
        }
      ), errors[fieldKey] && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, errors[fieldKey]));
    };
    const renderSelectField = (fieldKey, className = "") => {
      const config = getFieldConfig(fieldKey);
      if (!config || !config.options) return null;
      const label = config.label || fieldKey;
      const required = config.required;
      return /* @__PURE__ */ import_react4.default.createElement("div", { className }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label, " ", required && /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ import_react4.default.createElement(
        "select",
        {
          value: formData[fieldKey],
          onChange: (e) => updateField(fieldKey, e.target.value),
          className: `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all bg-white ${errors[fieldKey] ? "border-red-300 bg-red-50" : "border-gray-200"}`
        },
        config.options.map((opt) => /* @__PURE__ */ import_react4.default.createElement("option", { key: opt.value, value: opt.value }, opt.label))
      ), errors[fieldKey] && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, errors[fieldKey]));
    };
    const renderTextareaField = (fieldKey, rows = 2, className = "") => {
      const config = getFieldConfig(fieldKey);
      if (!config) return null;
      const label = config.label || fieldKey;
      const placeholder = config.placeholder || "";
      const required = config.required;
      return /* @__PURE__ */ import_react4.default.createElement("div", { className }, /* @__PURE__ */ import_react4.default.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label, " ", required && /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ import_react4.default.createElement(
        "textarea",
        {
          value: formData[fieldKey],
          onChange: (e) => updateField(fieldKey, e.target.value),
          rows,
          className: `w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all resize-none ${errors[fieldKey] ? "border-red-300 bg-red-50" : "border-gray-200"}`,
          placeholder
        }
      ), errors[fieldKey] && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, errors[fieldKey]));
    };
    const validateFile = (file) => {
      if (!ALLOWED_EXTENSIONS.test(file.name)) {
        return { ok: false, message: `Tipo no permitido: ${file.name}. Solo PDF, JPG, PNG, GIF o WEBP.` };
      }
      if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        return { ok: false, message: `${file.name} pesa ${sizeMB} MB. M\xE1ximo permitido: 10 MB.` };
      }
      return { ok: true };
    };
    const updateField = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };
    const updateFile = (field, file) => {
      setFormData((prev) => ({ ...prev, [field]: file }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    };
    const removeFile = (field) => {
      setFormData((prev) => ({ ...prev, [field]: null }));
      setUploadedFiles((prev) => {
        const next = { ...prev };
        delete next[field];
        uploadedFilesRef.current = next;
        return next;
      });
      setUploadProgress((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };
    const addFileToArray = (field, file) => {
      const newIndex = (formData[field] || []).length;
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field] || [], file]
      }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
      return newIndex;
    };
    const removeFileFromArray = (field, index) => {
      setFormData((prev) => ({
        ...prev,
        [field]: (prev[field] || []).filter((_, i) => i !== index)
      }));
      setUploadedFiles((prev) => {
        const arr = [...prev[field] || []];
        arr.splice(index, 1);
        const next = { ...prev, [field]: arr };
        uploadedFilesRef.current = next;
        return next;
      });
    };
    const validateStep = (step) => {
      if (!fieldsConfig) return {};
      const errs = {};
      const visibleFields = getVisibleFieldsForStep(step, fieldsConfig, formData);
      visibleFields.forEach((field) => {
        if (field.type === "file") return;
        if (field.key === "tipo_persona") return;
        if (field.required) {
          const value = formData[field.key];
          if (!value || typeof value === "string" && !value.trim()) {
            errs[field.key] = `${field.label} es obligatorio`;
          }
        }
      });
      if (step === 1) {
        if (!formData.tipo_persona) {
          errs.tipo_persona = "Seleccion\xE1 el tipo de persona";
        }
      }
      return errs;
    };
    const handleNext = () => {
      const errs = validateStep(currentStep);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    };
    const handlePrev = () => {
      setErrors({});
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    };
    const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("No se pudo leer el archivo localmente."));
      reader.readAsDataURL(file);
    });
    const uploadOneFile = async (file) => {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("field", file._fieldHint || "archivo");
      try {
        const res = await fetch("/api/habilitaciones/upload", {
          method: "POST",
          body: formDataUpload
        });
        if (res.ok) {
          const data = await res.json();
          return { url: data.url, name: file.name, source: "server" };
        }
        throw new Error("Server respondi\xF3 " + res.status);
      } catch (serverErr) {
        try {
          const dataUrl = await readFileAsDataURL(file);
          return { url: dataUrl, name: file.name, source: "base64" };
        } catch (readErr) {
          throw new Error(
            `No se pudo subir "${file.name}". El servidor no responde y la lectura local fall\xF3. Verific\xE1 tu conexi\xF3n y reintent\xE1.`
          );
        }
      }
    };
    const simulateUpload = async (file, fieldName, isArray = false, arrayIndex = null) => {
      if (!file) return null;
      setUploadProgress((prev) => {
        const next = { ...prev };
        if (isArray && arrayIndex !== null) {
          const arr = [...next[fieldName] || []];
          arr[arrayIndex] = 0;
          next[fieldName] = arr;
        } else {
          next[fieldName] = 0;
        }
        return next;
      });
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const next = { ...prev };
          if (isArray && arrayIndex !== null) {
            const arr = [...next[fieldName] || []];
            const current = arr[arrayIndex] || 0;
            const v = Math.min(current + Math.random() * 25, 95);
            arr[arrayIndex] = Math.round(v);
            next[fieldName] = arr;
          } else {
            const current = next[fieldName] || 0;
            next[fieldName] = Math.round(Math.min(current + Math.random() * 25, 95));
          }
          return next;
        });
      }, 300);
      try {
        const result = await uploadOneFile(file);
        clearInterval(interval);
        setUploadProgress((prev) => {
          const next = { ...prev };
          if (isArray && arrayIndex !== null) {
            const arr = [...next[fieldName] || []];
            arr[arrayIndex] = 100;
            next[fieldName] = arr;
          } else {
            next[fieldName] = 100;
          }
          return next;
        });
        setUploadedFiles((prev) => {
          const next = { ...prev };
          if (isArray && arrayIndex !== null) {
            const arr = [...next[fieldName] || []];
            arr[arrayIndex] = result;
            next[fieldName] = arr;
          } else {
            next[fieldName] = result;
          }
          uploadedFilesRef.current = next;
          return next;
        });
        return result;
      } catch (err) {
        clearInterval(interval);
        setUploadProgress((prev) => {
          const next = { ...prev };
          if (isArray && arrayIndex !== null) {
            const arr = [...next[fieldName] || []];
            arr[arrayIndex] = -1;
            next[fieldName] = arr;
          } else {
            next[fieldName] = -1;
          }
          return next;
        });
        setUploadError(err.message);
        throw err;
      }
    };
    const ensureUploaded = async (file, fieldName, arrayIndex) => {
      const existing = uploadedFilesRef.current[fieldName];
      if (Array.isArray(existing) && existing[arrayIndex] && existing[arrayIndex].name === file.name) {
        return existing[arrayIndex];
      }
      return await simulateUpload(file, fieldName, true, arrayIndex);
    };
    const handleSubmit = async () => {
      const errs = validateStep(3);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setErrors({});
      setIsSubmitting(true);
      setSubmitError("");
      setUploadError("");
      try {
        const uploadedRef = uploadedFilesRef.current;
        const pending = [];
        if (formData.dni_frente_file && !uploadedRef.dni_frente_file) {
          pending.push(simulateUpload(formData.dni_frente_file, "dni_frente_file"));
        }
        if (formData.dni_dorso_file && !uploadedRef.dni_dorso_file) {
          pending.push(simulateUpload(formData.dni_dorso_file, "dni_dorso_file"));
        }
        if (formData.estatuto_file && !uploadedRef.estatuto_file) {
          pending.push(simulateUpload(formData.estatuto_file, "estatuto_file"));
        }
        if (formData.acta_designacion_file && !uploadedRef.acta_designacion_file) {
          pending.push(simulateUpload(formData.acta_designacion_file, "acta_designacion_file"));
        }
        (formData.documento_propiedad_file || []).forEach((file, idx) => {
          pending.push(ensureUploaded(file, "documento_propiedad_file", idx));
        });
        (formData.constancia_arca_file || []).forEach((file, idx) => {
          pending.push(ensureUploaded(file, "constancia_arca_file", idx));
        });
        if (pending.length > 0) {
          await Promise.all(pending);
        }
        const anyError = Object.values(uploadProgress).some(
          (p) => Array.isArray(p) ? p.includes(-1) : p === -1
        );
        if (anyError) {
          throw new Error(uploadError || "Uno o m\xE1s archivos no se pudieron subir.");
        }
        const uploadedFilesSnapshot = uploadedFilesRef.current;
        const archivos = [];
        if (uploadedFilesSnapshot.dni_frente_file) archivos.push({ nombre: "DNI Frente", url: uploadedFilesSnapshot.dni_frente_file.url });
        if (uploadedFilesSnapshot.dni_dorso_file) archivos.push({ nombre: "DNI Dorso", url: uploadedFilesSnapshot.dni_dorso_file.url });
        if (uploadedFilesSnapshot.estatuto_file) archivos.push({ nombre: "Estatuto", url: uploadedFilesSnapshot.estatuto_file.url });
        if (uploadedFilesSnapshot.acta_designacion_file) archivos.push({ nombre: "Acta Designaci\xF3n", url: uploadedFilesSnapshot.acta_designacion_file.url });
        (uploadedFilesSnapshot.documento_propiedad_file || []).forEach(
          (f, i) => archivos.push({ nombre: `Documento Propiedad ${i + 1}`, url: f.url })
        );
        (uploadedFilesSnapshot.constancia_arca_file || []).forEach(
          (f, i) => archivos.push({ nombre: `Constancia ARCA/ATM ${i + 1}`, url: f.url })
        );
        const payload = {
          tipo_persona: formData.tipo_persona,
          dni: formData.dni,
          cuit: formData.cuit_cuil,
          apellido: formData.apellido_nombre || formData.razon_social,
          nombre: "",
          domicilio: formData.domicilio_real,
          email: formData.email,
          telefono: formData.telefono,
          seccion: formData.seccion,
          manzana: formData.manzana,
          parcela: formData.parcela,
          direccion: formData.direccion_completa,
          local_oficina: formData.propietario_local,
          barrio: formData.barrio,
          superficie_cubierta: formData.superficie_cubierta,
          superficie_semicubierta: formData.superficie_semicubierta,
          superficie_total: formData.superficie_total,
          georeferenciacion: formData.georeferenciacion,
          categoria: formData.categoria,
          sub_categoria: formData.tipo_tramite,
          actividad_principal: formData.actividad_principal,
          actividad_secundaria: formData.actividad_secundaria,
          otra_actividad: formData.otra_actividad,
          archivos,
          status: "pendiente",
          notas: ""
        };
        const response = await fetch("/api/habilitaciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error("Error al enviar el formulario");
        }
        setIsSuccess(true);
      } catch (error) {
        setSubmitError(error.message || "Ocurri\xF3 un error al enviar el formulario. Intent\xE1 de nuevo.");
      } finally {
        setIsSubmitting(false);
      }
    };
    if (isSuccess) {
      return /* @__PURE__ */ import_react4.default.createElement("div", { className: "bg-slate-50 text-slate-900 font-sans min-h-screen" }, /* @__PURE__ */ import_react4.default.createElement(
        SectionLayout_default,
        {
          title: "Preinscripci\xF3n",
          highlight: "Comercial",
          description: "Complet\xE1 el formulario para iniciar tu habilitaci\xF3n comercial"
        }
      ), /* @__PURE__ */ import_react4.default.createElement(Section, null, /* @__PURE__ */ import_react4.default.createElement("div", { className: "max-w-2xl mx-auto text-center py-12" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 p-12" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6" }, /* @__PURE__ */ import_react4.default.createElement(CircleCheck, { className: "w-10 h-10 text-emerald-600" })), /* @__PURE__ */ import_react4.default.createElement("h2", { className: "text-3xl font-bold text-slate-800 mb-4" }, "\xA1Solicitud Enviada!"), /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-lg text-slate-600 mb-8" }, "Tu preinscripci\xF3n comercial fue recibida correctamente. Te contactaremos a la brevedad."), /* @__PURE__ */ import_react4.default.createElement("div", { className: "bg-sky-50 border border-sky-200 rounded-xl p-4 text-sm text-sky-700 text-left mb-8" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-start gap-2" }, /* @__PURE__ */ import_react4.default.createElement(Info, { className: "w-5 h-5 shrink-0 mt-0.5" }), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("p", { className: "font-semibold mb-1" }, "Pr\xF3ximos pasos:"), /* @__PURE__ */ import_react4.default.createElement("ul", { className: "list-disc list-inside space-y-1" }, /* @__PURE__ */ import_react4.default.createElement("li", null, "Recibir\xE1s un email de confirmaci\xF3n"), /* @__PURE__ */ import_react4.default.createElement("li", null, "Un agente municipal revisar\xE1 tu solicitud"), /* @__PURE__ */ import_react4.default.createElement("li", null, "Te contactaremos para coordinar la visita al local"))))), /* @__PURE__ */ import_react4.default.createElement(
        "a",
        {
          href: "/ciudadano-digital",
          className: "inline-flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
        },
        /* @__PURE__ */ import_react4.default.createElement(ArrowLeft, { className: "w-5 h-5" }),
        "Volver a Ciudadano Digital"
      )))));
    }
    return /* @__PURE__ */ import_react4.default.createElement("div", { className: "bg-slate-50 text-slate-900 font-sans min-h-screen" }, /* @__PURE__ */ import_react4.default.createElement(
      SectionLayout_default,
      {
        title: "Preinscripci\xF3n",
        highlight: "Comercial",
        description: "Complet\xE1 el formulario para iniciar tu habilitaci\xF3n comercial"
      }
    ), /* @__PURE__ */ import_react4.default.createElement(Section, null, /* @__PURE__ */ import_react4.default.createElement("div", { className: "max-w-4xl mx-auto" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "mb-8" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center justify-between" }, [
      { step: 1, label: "Datos Personales", icon: User },
      { step: 2, label: "Ubicaci\xF3n", icon: MapPin },
      { step: 3, label: "Actividad", icon: Briefcase }
    ].map(({ step, label, icon: StepIcon }) => /* @__PURE__ */ import_react4.default.createElement("div", { key: step, className: "flex flex-col items-center" }, /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: `w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep === step ? "bg-sky-500 text-white shadow-lg shadow-sky-200" : currentStep > step ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"}`
      },
      currentStep > step ? /* @__PURE__ */ import_react4.default.createElement(Check, { className: "w-5 h-5" }) : /* @__PURE__ */ import_react4.default.createElement(StepIcon, { className: "w-5 h-5" })
    ), /* @__PURE__ */ import_react4.default.createElement(
      "span",
      {
        className: `text-xs mt-2 font-medium ${currentStep === step ? "text-sky-600" : "text-gray-400"}`
      },
      label
    )))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "relative mt-2" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "absolute top-0 left-0 h-1 bg-gray-200 rounded-full w-full" }), /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: "absolute top-0 left-0 h-1 bg-sky-500 rounded-full transition-all duration-500",
        style: { width: `${(currentStep - 1) / 2 * 100}%` }
      }
    ))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-4" }, /* @__PURE__ */ import_react4.default.createElement("h2", { className: "text-white text-lg font-semibold flex items-center gap-2" }, currentStep === 1 && /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(User, { className: "w-5 h-5" }), " Datos Personales"), currentStep === 2 && /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(MapPin, { className: "w-5 h-5" }), " Ubicaci\xF3n del Local"), currentStep === 3 && /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(Briefcase, { className: "w-5 h-5" }), " Actividad Comercial"))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "p-6 md:p-8" }, Object.keys(errors).length > 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3" }, /* @__PURE__ */ import_react4.default.createElement(CircleAlert, { className: "w-5 h-5 text-red-500 shrink-0 mt-0.5" }), /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-sm font-semibold text-red-700" }, "Correg\xED los siguientes errores:"), /* @__PURE__ */ import_react4.default.createElement("ul", { className: "text-sm text-red-600 list-disc list-inside mt-1" }, Object.values(errors).map((err, i) => /* @__PURE__ */ import_react4.default.createElement("li", { key: i }, err))))), submitError && /* @__PURE__ */ import_react4.default.createElement("div", { className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3" }, /* @__PURE__ */ import_react4.default.createElement(CircleAlert, { className: "w-5 h-5 text-red-500 shrink-0 mt-0.5" }), /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-sm text-red-700" }, submitError)), currentStep === 1 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, "Tipo de Persona ", /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-red-500" }, "*")), /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3" }, /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          updateField("tipo_persona", "fisica");
          updateField("dni", "");
          updateField("apellido_nombre", "");
          updateField("razon_social", "");
          updateFile("dni_frente_file", null);
          updateFile("dni_dorso_file", null);
          updateFile("estatuto_file", null);
          updateFile("acta_designacion_file", null);
        },
        className: `flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${formData.tipo_persona === "fisica" ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-sky-200"}`
      },
      /* @__PURE__ */ import_react4.default.createElement(User, { className: `w-5 h-5 ${formData.tipo_persona === "fisica" ? "text-sky-500" : "text-gray-400"}` }),
      /* @__PURE__ */ import_react4.default.createElement("span", { className: `font-medium ${formData.tipo_persona === "fisica" ? "text-sky-700" : "text-slate-600"}` }, "Persona F\xEDsica")
    ), /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        onClick: () => {
          updateField("tipo_persona", "juridica");
          updateField("dni", "");
          updateField("apellido_nombre", "");
          updateField("razon_social", "");
          updateFile("dni_frente_file", null);
          updateFile("dni_dorso_file", null);
          updateFile("estatuto_file", null);
          updateFile("acta_designacion_file", null);
        },
        className: `flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${formData.tipo_persona === "juridica" ? "border-sky-500 bg-sky-50" : "border-gray-200 hover:border-sky-200"}`
      },
      /* @__PURE__ */ import_react4.default.createElement(Building2, { className: `w-5 h-5 ${formData.tipo_persona === "juridica" ? "text-sky-500" : "text-gray-400"}` }),
      /* @__PURE__ */ import_react4.default.createElement("span", { className: `font-medium ${formData.tipo_persona === "juridica" ? "text-sky-700" : "text-slate-600"}` }, "Persona Jur\xEDdica")
    )), errors.tipo_persona && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, errors.tipo_persona)), /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, formData.tipo_persona === "fisica" && /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, renderTextField("dni", ""), renderTextField("apellido_nombre", "")), formData.tipo_persona === "juridica" && /* @__PURE__ */ import_react4.default.createElement("div", { className: "md:col-span-2" }, renderTextField("razon_social", "")), renderTextField("cuit_cuil", ""), renderTextField("domicilio_real", ""), renderTextField("email", ""), renderTextField("telefono", "")), formData.tipo_persona === "fisica" && /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ import_react4.default.createElement(
      FileUploadField,
      {
        label: "Copia del DNI - Frente",
        field: "dni_frente_file",
        accept: "image/*,.pdf",
        error: errors.dni_frente_file,
        fileError: fileErrors.dni_frente_file,
        file: formData.dni_frente_file,
        progress: uploadProgress.dni_frente_file,
        uploaded: uploadedFiles.dni_frente_file,
        onFileSelect: (f) => {
          const validation = validateFile(f);
          if (!validation.ok) {
            setFileErrors((prev) => ({ ...prev, dni_frente_file: validation.message }));
            return;
          }
          setFileErrors((prev) => {
            const n = { ...prev };
            delete n.dni_frente_file;
            return n;
          });
          updateFile("dni_frente_file", f);
          simulateUpload(f, "dni_frente_file");
        },
        onRemove: () => removeFile("dni_frente_file")
      }
    ), /* @__PURE__ */ import_react4.default.createElement(
      FileUploadField,
      {
        label: "Copia del DNI - Dorso",
        field: "dni_dorso_file",
        accept: "image/*,.pdf",
        error: errors.dni_dorso_file,
        fileError: fileErrors.dni_dorso_file,
        file: formData.dni_dorso_file,
        progress: uploadProgress.dni_dorso_file,
        uploaded: uploadedFiles.dni_dorso_file,
        onFileSelect: (f) => {
          const validation = validateFile(f);
          if (!validation.ok) {
            setFileErrors((prev) => ({ ...prev, dni_dorso_file: validation.message }));
            return;
          }
          setFileErrors((prev) => {
            const n = { ...prev };
            delete n.dni_dorso_file;
            return n;
          });
          updateFile("dni_dorso_file", f);
          simulateUpload(f, "dni_dorso_file");
        },
        onRemove: () => removeFile("dni_dorso_file")
      }
    )), formData.tipo_persona === "juridica" && /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(
      FileUploadField,
      {
        label: "Estatuto Social",
        field: "estatuto_file",
        accept: ".pdf",
        error: errors.estatuto_file,
        fileError: fileErrors.estatuto_file,
        file: formData.estatuto_file,
        progress: uploadProgress.estatuto_file,
        uploaded: uploadedFiles.estatuto_file,
        onFileSelect: (f) => {
          const validation = validateFile(f);
          if (!validation.ok) {
            setFileErrors((prev) => ({ ...prev, estatuto_file: validation.message }));
            return;
          }
          setFileErrors((prev) => {
            const n = { ...prev };
            delete n.estatuto_file;
            return n;
          });
          updateFile("estatuto_file", f);
          simulateUpload(f, "estatuto_file");
        },
        onRemove: () => removeFile("estatuto_file")
      }
    ), /* @__PURE__ */ import_react4.default.createElement(
      FileUploadField,
      {
        label: "Acta de Designaci\xF3n de Autoridades",
        field: "acta_designacion_file",
        accept: ".pdf",
        error: errors.acta_designacion_file,
        fileError: fileErrors.acta_designacion_file,
        file: formData.acta_designacion_file,
        progress: uploadProgress.acta_designacion_file,
        uploaded: uploadedFiles.acta_designacion_file,
        onFileSelect: (f) => {
          const validation = validateFile(f);
          if (!validation.ok) {
            setFileErrors((prev) => ({ ...prev, acta_designacion_file: validation.message }));
            return;
          }
          setFileErrors((prev) => {
            const n = { ...prev };
            delete n.acta_designacion_file;
            return n;
          });
          updateFile("acta_designacion_file", f);
          simulateUpload(f, "acta_designacion_file");
        },
        onRemove: () => removeFile("acta_designacion_file")
      }
    ))), currentStep === 2 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, renderTextField("seccion", ""), renderTextField("manzana", ""), renderTextField("parcela", "")), renderTextField("direccion_completa", ""), /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, renderTextField("propietario_local", ""), renderTextField("barrio", "")), /* @__PURE__ */ import_react4.default.createElement(
      MultiFileUploadField,
      {
        label: "Documento de Propiedad (t\xEDtulo, contrato de alquiler)",
        field: "documento_propiedad_file",
        accept: ".pdf,image/*",
        error: errors.documento_propiedad_file,
        fileError: fileErrors.documento_propiedad_file,
        files: formData.documento_propiedad_file || [],
        uploaded: uploadedFiles.documento_propiedad_file || [],
        progress: uploadProgress.documento_propiedad_file,
        onFileSelect: (f) => {
          const validation = validateFile(f);
          if (!validation.ok) {
            setFileErrors((prev) => ({ ...prev, documento_propiedad_file: validation.message }));
            return;
          }
          setFileErrors((prev) => {
            const n = { ...prev };
            delete n.documento_propiedad_file;
            return n;
          });
          const idx = addFileToArray("documento_propiedad_file", f);
          simulateUpload(f, "documento_propiedad_file", true, idx);
        },
        onRemove: (idx) => removeFileFromArray("documento_propiedad_file", idx)
      }
    ), /* @__PURE__ */ import_react4.default.createElement("div", { className: "border border-gray-100 bg-slate-50 rounded-xl p-4" }, /* @__PURE__ */ import_react4.default.createElement("h4", { className: "text-sm font-semibold text-slate-600 mb-3" }, "Superficie del Local"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4" }, renderTextField("superficie_cubierta", ""), renderTextField("superficie_semicubierta", ""), renderTextField("superficie_total", ""), renderTextField("georeferenciacion", "")))), currentStep === 3 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, renderSelectField("tipo_tramite", ""), renderSelectField("categoria", "")), renderTextareaField("actividad_principal", 2, ""), /* @__PURE__ */ import_react4.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" }, renderTextField("actividad_secundaria", ""), renderTextField("otra_actividad", "")), /* @__PURE__ */ import_react4.default.createElement(
      MultiFileUploadField,
      {
        label: "Constancia ARCA/ATM",
        field: "constancia_arca_file",
        accept: ".pdf",
        error: errors.constancia_arca_file,
        fileError: fileErrors.constancia_arca_file,
        files: formData.constancia_arca_file || [],
        uploaded: uploadedFiles.constancia_arca_file || [],
        progress: uploadProgress.constancia_arca_file,
        onFileSelect: (f) => {
          const validation = validateFile(f);
          if (!validation.ok) {
            setFileErrors((prev) => ({ ...prev, constancia_arca_file: validation.message }));
            return;
          }
          setFileErrors((prev) => {
            const n = { ...prev };
            delete n.constancia_arca_file;
            return n;
          });
          const idx = addFileToArray("constancia_arca_file", f);
          simulateUpload(f, "constancia_arca_file", true, idx);
        },
        onRemove: (idx) => removeFileFromArray("constancia_arca_file", idx)
      }
    )), /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center justify-between mt-8 pt-6 border-t border-gray-100" }, /* @__PURE__ */ import_react4.default.createElement("div", null, currentStep > 1 && /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        onClick: handlePrev,
        className: "flex items-center gap-2 px-5 py-2.5 border border-sky-200 text-sky-600 rounded-xl font-semibold text-sm hover:bg-sky-50 transition-colors"
      },
      /* @__PURE__ */ import_react4.default.createElement(ChevronLeft, { className: "w-4 h-4" }),
      "Anterior"
    )), /* @__PURE__ */ import_react4.default.createElement("div", null, currentStep < 3 ? /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        onClick: handleNext,
        className: "flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white rounded-xl font-semibold text-sm hover:bg-sky-600 transition-colors"
      },
      "Siguiente",
      /* @__PURE__ */ import_react4.default.createElement(ChevronRight, { className: "w-4 h-4" })
    ) : /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        onClick: handleSubmit,
        disabled: isSubmitting,
        className: "flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      },
      isSubmitting ? /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(LoaderCircle, { className: "w-4 h-4 animate-spin" }), "Enviando...") : /* @__PURE__ */ import_react4.default.createElement(import_react4.default.Fragment, null, /* @__PURE__ */ import_react4.default.createElement(CircleCheck, { className: "w-4 h-4" }), "Enviar Solicitud")
    ))))), /* @__PURE__ */ import_react4.default.createElement("div", { className: "mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-start gap-2" }, /* @__PURE__ */ import_react4.default.createElement(Info, { className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ import_react4.default.createElement("div", { className: "text-sm text-amber-700" }, /* @__PURE__ */ import_react4.default.createElement("p", { className: "font-semibold mb-1" }, "Importante:"), /* @__PURE__ */ import_react4.default.createElement("p", null, "Complet\xE1 todos los campos obligatorios marcados con ", /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-red-500" }, "*"), ". Los documentos subidos ser\xE1n verificados por el \xE1rea de Habilitaciones Comerciales.")))))));
  }
  function FileUploadField({
    label,
    field,
    accept,
    error,
    file,
    progress,
    uploaded,
    fileError,
    onFileSelect,
    onRemove
  }) {
    const [isDragOver, setIsDragOver] = (0, import_react4.useState)(false);
    const inputRef = import_react4.default.useRef(null);
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) onFileSelect(droppedFile);
    };
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };
    const handleDragLeave = () => {
      setIsDragOver(false);
    };
    const handleClick = () => {
      inputRef.current?.click();
    };
    const handleChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) onFileSelect(selectedFile);
      e.target.value = "";
    };
    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };
    return /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label), !file && /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: handleClick,
        className: `border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragOver ? "border-sky-400 bg-sky-50" : error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-sky-300 hover:bg-sky-50/50"}`
      },
      /* @__PURE__ */ import_react4.default.createElement(Upload, { className: "w-8 h-8 mx-auto mb-2 text-gray-400" }),
      /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-sm text-gray-500" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-sky-600 font-medium" }, "Hac\xE9 clic"), " o arrastr\xE1 el archivo aqu\xED"),
      /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-xs text-gray-400 mt-1" }, accept?.replace(/,/g, ", ") || "Todos los formatos")
    ), /* @__PURE__ */ import_react4.default.createElement(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept,
        onChange: handleChange,
        className: "hidden"
      }
    ), file && /* @__PURE__ */ import_react4.default.createElement("div", { className: "border border-gray-200 rounded-xl p-4" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center gap-3 min-w-0" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center shrink-0" }, /* @__PURE__ */ import_react4.default.createElement(File, { className: "w-5 h-5 text-sky-500" })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-sm font-medium text-slate-700 truncate" }, file.name), /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-xs text-gray-400" }, formatFileSize(file.size)))), /* @__PURE__ */ import_react4.default.createElement(
      "button",
      {
        type: "button",
        onClick: onRemove,
        className: "p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0"
      },
      /* @__PURE__ */ import_react4.default.createElement(X, { className: "w-4 h-4" })
    )), progress !== void 0 && progress < 100 && progress >= 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "mt-3" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "w-full bg-gray-100 rounded-full h-2" }, /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        className: "bg-sky-500 h-2 rounded-full transition-all duration-300",
        style: { width: `${progress}%` }
      }
    )), /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-xs text-gray-400 mt-1" }, "Subiendo... ", progress, "%")), progress === -1 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "mt-2 flex items-center gap-1 text-xs text-red-600" }, /* @__PURE__ */ import_react4.default.createElement(CircleAlert, { className: "w-3 h-3" }), "Error al subir. Quitalo y reintent\xE1."), uploaded && progress === 100 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "mt-2 flex items-center gap-1 text-xs text-emerald-600" }, /* @__PURE__ */ import_react4.default.createElement(Check, { className: "w-3 h-3" }), "Archivo subido correctamente")), error && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, error), fileError && !file && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, fileError));
  }
  function MultiFileUploadField({
    label,
    field,
    accept,
    error,
    files,
    uploaded,
    progress,
    fileError,
    onFileSelect,
    onRemove
  }) {
    const [isDragOver, setIsDragOver] = (0, import_react4.useState)(false);
    const inputRef = import_react4.default.useRef(null);
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) onFileSelect(droppedFile);
    };
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragOver(true);
    };
    const handleDragLeave = () => {
      setIsDragOver(false);
    };
    const handleClick = () => {
      inputRef.current?.click();
    };
    const handleChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) onFileSelect(selectedFile);
      e.target.value = "";
    };
    const formatFileSize = (bytes) => {
      if (bytes < 1024) return bytes + " B";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };
    return /* @__PURE__ */ import_react4.default.createElement("div", null, /* @__PURE__ */ import_react4.default.createElement("label", { className: "block text-sm font-medium text-slate-700 mb-1.5" }, label), files.length > 0 && /* @__PURE__ */ import_react4.default.createElement("div", { className: "space-y-2 mb-3" }, files.map((file, idx) => {
      const fileUploaded = uploaded && uploaded[idx];
      const fileProgress = progress && progress[idx];
      const hasError = fileProgress === -1;
      const isUploading = fileProgress !== void 0 && fileProgress >= 0 && fileProgress < 100;
      const isDone = fileUploaded && fileProgress === 100;
      return /* @__PURE__ */ import_react4.default.createElement("div", { key: idx, className: "border border-gray-200 rounded-xl p-3" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "flex items-center gap-3 min-w-0" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center shrink-0" }, /* @__PURE__ */ import_react4.default.createElement(File, { className: "w-5 h-5 text-sky-500" })), /* @__PURE__ */ import_react4.default.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-sm font-medium text-slate-700 truncate" }, file.name), /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-xs text-gray-400" }, formatFileSize(file.size), hasError && /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-red-600 ml-2" }, "\xB7 Error al subir"), isDone && /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-emerald-600 ml-2" }, "\xB7 Subido")))), /* @__PURE__ */ import_react4.default.createElement(
        "button",
        {
          type: "button",
          onClick: () => onRemove(idx),
          className: "p-1.5 text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2"
        },
        /* @__PURE__ */ import_react4.default.createElement(X, { className: "w-4 h-4" })
      )), isUploading && /* @__PURE__ */ import_react4.default.createElement("div", { className: "mt-2" }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "w-full bg-gray-100 rounded-full h-1.5" }, /* @__PURE__ */ import_react4.default.createElement(
        "div",
        {
          className: "bg-sky-500 h-1.5 rounded-full transition-all duration-300",
          style: { width: `${fileProgress}%` }
        }
      ))));
    })), /* @__PURE__ */ import_react4.default.createElement(
      "div",
      {
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onClick: handleClick,
        className: `border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${isDragOver ? "border-sky-400 bg-sky-50" : error ? "border-red-300 bg-red-50" : "border-gray-200 hover:border-sky-300 hover:bg-sky-50/50"}`
      },
      /* @__PURE__ */ import_react4.default.createElement(Upload, { className: "w-6 h-6 mx-auto mb-2 text-gray-400" }),
      /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-sm text-gray-500" }, /* @__PURE__ */ import_react4.default.createElement("span", { className: "text-sky-600 font-medium" }, "Hac\xE9 clic"), " o arrastr\xE1 ", files.length > 0 ? "otro " : "el ", "archivo aqu\xED"),
      /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-xs text-gray-400 mt-1" }, accept?.replace(/,/g, ", ") || "Todos los formatos")
    ), /* @__PURE__ */ import_react4.default.createElement(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept,
        onChange: handleChange,
        className: "hidden"
      }
    ), error && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, error), fileError && /* @__PURE__ */ import_react4.default.createElement("p", { className: "text-red-500 text-xs mt-1" }, fileError));
  }
})();
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

lucide-react/dist/esm/shared/src/utils.js:
lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/Icon.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/arrow-left.js:
lucide-react/dist/esm/icons/briefcase.js:
lucide-react/dist/esm/icons/building-2.js:
lucide-react/dist/esm/icons/check.js:
lucide-react/dist/esm/icons/chevron-left.js:
lucide-react/dist/esm/icons/chevron-right.js:
lucide-react/dist/esm/icons/circle-alert.js:
lucide-react/dist/esm/icons/circle-check.js:
lucide-react/dist/esm/icons/file.js:
lucide-react/dist/esm/icons/info.js:
lucide-react/dist/esm/icons/loader-circle.js:
lucide-react/dist/esm/icons/map-pin.js:
lucide-react/dist/esm/icons/upload.js:
lucide-react/dist/esm/icons/user.js:
lucide-react/dist/esm/icons/x.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.562.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
