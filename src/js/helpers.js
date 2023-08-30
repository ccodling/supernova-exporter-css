/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert group name, token name and possible prefix into camelCased string, joining everything together
 */
Pulsar.registerFunction("readableVariableName", function (token, tokenGroup, prefix) {
    // Create array with all path segments and token name at the end
    const segments = [""];
    const namespace = "ncds";
    if (!tokenGroup.isRoot || !tokenGroup.isNonVirtualRoot) {
        //segments.push(tokenGroup.name)
    }
    if (prefix && prefix.length > 0) {
        //segments.unshift(prefix);
    }
    segments.push(token.name);
    segments.unshift(namespace);
    // Create "sentence" separated by spaces
    let sentence = segments.join(" ");
    // string from all segments
    sentence = sentence
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => "-" + chr);
    // only allow letters, digits, underscore and hyphen
    sentence = sentence.replace(/[^a-zA-Z0-9_-]/g, '_');
    // prepend underscore if it starts with digit 
    if (/^\d/.test(sentence)) {
        sentence = '_' + sentence;
    }
    console.log(" ----> " + sentence);
    return sentence;
});
function findAliases(token, allTokens) {
    let aliases = allTokens.filter((t) => t.value.referencedToken && t.value.referencedToken.id === token.id);
    for (const t of aliases) {
        aliases = aliases.concat(findAliases(t, allTokens));
    }
    return aliases;
}
Pulsar.registerFunction("findAliases", findAliases);
Pulsar.registerFunction("gradientAngle", function (from, to) {
    var deltaY = to.y - from.y;
    var deltaX = to.x - from.x;
    var radians = Math.atan2(deltaY, deltaX);
    var result = (radians * 180) / Math.PI;
    result = result + 90;
    return (result < 0 ? 360 + result : result) % 360;
});
/**
 * Behavior configuration of the exporter
 * Prefixes: Add prefix for each category of the tokens. For example, all colors can start with "color, if needed"
 */
Pulsar.registerPayload("behavior", {
    colorTokenPrefix: "color",
    borderTokenPrefix: "border",
    gradientTokenPrefix: "gradient",
    measureTokenPrefix: "measure",
    shadowTokenPrefix: "shadow",
    typographyTokenPrefix: "typography",
});
/** Describe complex shadow token */
Pulsar.registerFunction("shadowDescription", function (shadowToken) {
    let connectedShadow = "transparent";
    if (shadowToken.shadowLayers) {
        connectedShadow = shadowToken.shadowLayers
            .reverse()
            .map((shadow) => {
            return shadowTokenValue(shadow);
        })
            .join(", ");
    }
    else {
        return shadowTokenValue(shadowToken);
    }
    return connectedShadow !== null && connectedShadow !== void 0 ? connectedShadow : "";
});
/** Convert complex shadow value to CSS representation */
function shadowTokenValue(shadowToken) {
    var blurRadius = getValueWithCorrectUnit(nonNegativeValue(shadowToken.value.radius.measure));
    var offsetX = getValueWithCorrectUnit(shadowToken.value.x.measure);
    var offsetY = getValueWithCorrectUnit(shadowToken.value.y.measure);
    var spreadRadius = getValueWithCorrectUnit(shadowToken.value.spread.measure);
    return `${shadowToken.value.type === "Inner" ? "inset " : ""}${offsetX} ${offsetY} ${blurRadius} ${spreadRadius} ${getFormattedRGB(shadowToken.value.color)}`;
}
function getValueWithCorrectUnit(value) {
    if (value === 0) {
        return `${value}`;
    }
    else {
        // todo: add support for other units (px, rem, em, etc.)
        return `${value}px`;
    }
}
function nonNegativeValue(num) {
    if (num <= 0) {
        return 0;
    }
    else {
        return num;
    }
}
/** Convert type to CSS unit */
function measureTypeIntoReadableUnit(type) {
    switch (type) {
        case "Points":
            return "pt";
        case "Pixels":
            return "px";
        case "Percent":
            return "%";
        case "Rems":
            return "rem";
        case "Ems":
            return "em";
    }
}
function getFormattedRGB(colorValue) {
    if (colorValue.a === 0) {
        return `rgb(${colorValue.r},${colorValue.g},${colorValue.b})`;
    }
    else {
        const opacity = Math.round((colorValue.a / 255) * 100) / 100;
        return `rgba(${colorValue.r},${colorValue.g},${colorValue.b},${opacity})`;
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbURBQW1ELEVBQUUsUUFBUSxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsYUFBYSxHQUFHLHlDQUF5QztBQUNoSztBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsYUFBYSxHQUFHLGFBQWEsR0FBRyxhQUFhO0FBQ25FO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixhQUFhLEdBQUcsYUFBYSxHQUFHLGFBQWEsR0FBRyxRQUFRO0FBQy9FO0FBQ0EiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiLyoqXHJcbiAqIENvbnZlcnQgZ3JvdXAgbmFtZSwgdG9rZW4gbmFtZSBhbmQgcG9zc2libGUgcHJlZml4IGludG8gY2FtZWxDYXNlZCBzdHJpbmcsIGpvaW5pbmcgZXZlcnl0aGluZyB0b2dldGhlclxyXG4gKi9cclxuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJyZWFkYWJsZVZhcmlhYmxlTmFtZVwiLCBmdW5jdGlvbiAodG9rZW4sIHRva2VuR3JvdXAsIHByZWZpeCkge1xyXG4gICAgLy8gQ3JlYXRlIGFycmF5IHdpdGggYWxsIHBhdGggc2VnbWVudHMgYW5kIHRva2VuIG5hbWUgYXQgdGhlIGVuZFxyXG4gICAgY29uc3Qgc2VnbWVudHMgPSBbXCJcIl07XHJcbiAgICBjb25zdCBuYW1lc3BhY2UgPSBcIm5jZHNcIjtcclxuICAgIGlmICghdG9rZW5Hcm91cC5pc1Jvb3QgfHwgIXRva2VuR3JvdXAuaXNOb25WaXJ0dWFsUm9vdCkge1xyXG4gICAgICAgIC8vc2VnbWVudHMucHVzaCh0b2tlbkdyb3VwLm5hbWUpXHJcbiAgICB9XHJcbiAgICBpZiAocHJlZml4ICYmIHByZWZpeC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgLy9zZWdtZW50cy51bnNoaWZ0KHByZWZpeCk7XHJcbiAgICB9XHJcbiAgICBzZWdtZW50cy5wdXNoKHRva2VuLm5hbWUpO1xyXG4gICAgc2VnbWVudHMudW5zaGlmdChuYW1lc3BhY2UpO1xyXG4gICAgLy8gQ3JlYXRlIFwic2VudGVuY2VcIiBzZXBhcmF0ZWQgYnkgc3BhY2VzXHJcbiAgICBsZXQgc2VudGVuY2UgPSBzZWdtZW50cy5qb2luKFwiIFwiKTtcclxuICAgIC8vIHN0cmluZyBmcm9tIGFsbCBzZWdtZW50c1xyXG4gICAgc2VudGVuY2UgPSBzZW50ZW5jZVxyXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgLnJlcGxhY2UoL1teYS16QS1aMC05XSsoLikvZywgKG0sIGNocikgPT4gXCItXCIgKyBjaHIpO1xyXG4gICAgLy8gb25seSBhbGxvdyBsZXR0ZXJzLCBkaWdpdHMsIHVuZGVyc2NvcmUgYW5kIGh5cGhlblxyXG4gICAgc2VudGVuY2UgPSBzZW50ZW5jZS5yZXBsYWNlKC9bXmEtekEtWjAtOV8tXS9nLCAnXycpO1xyXG4gICAgLy8gcHJlcGVuZCB1bmRlcnNjb3JlIGlmIGl0IHN0YXJ0cyB3aXRoIGRpZ2l0IFxyXG4gICAgaWYgKC9eXFxkLy50ZXN0KHNlbnRlbmNlKSkge1xyXG4gICAgICAgIHNlbnRlbmNlID0gJ18nICsgc2VudGVuY2U7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcIiAtLS0tPiBcIiArIHNlbnRlbmNlKTtcclxuICAgIHJldHVybiBzZW50ZW5jZTtcclxufSk7XHJcbmZ1bmN0aW9uIGZpbmRBbGlhc2VzKHRva2VuLCBhbGxUb2tlbnMpIHtcclxuICAgIGxldCBhbGlhc2VzID0gYWxsVG9rZW5zLmZpbHRlcigodCkgPT4gdC52YWx1ZS5yZWZlcmVuY2VkVG9rZW4gJiYgdC52YWx1ZS5yZWZlcmVuY2VkVG9rZW4uaWQgPT09IHRva2VuLmlkKTtcclxuICAgIGZvciAoY29uc3QgdCBvZiBhbGlhc2VzKSB7XHJcbiAgICAgICAgYWxpYXNlcyA9IGFsaWFzZXMuY29uY2F0KGZpbmRBbGlhc2VzKHQsIGFsbFRva2VucykpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFsaWFzZXM7XHJcbn1cclxuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJmaW5kQWxpYXNlc1wiLCBmaW5kQWxpYXNlcyk7XHJcblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwiZ3JhZGllbnRBbmdsZVwiLCBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcclxuICAgIHZhciBkZWx0YVkgPSB0by55IC0gZnJvbS55O1xyXG4gICAgdmFyIGRlbHRhWCA9IHRvLnggLSBmcm9tLng7XHJcbiAgICB2YXIgcmFkaWFucyA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpO1xyXG4gICAgdmFyIHJlc3VsdCA9IChyYWRpYW5zICogMTgwKSAvIE1hdGguUEk7XHJcbiAgICByZXN1bHQgPSByZXN1bHQgKyA5MDtcclxuICAgIHJldHVybiAocmVzdWx0IDwgMCA/IDM2MCArIHJlc3VsdCA6IHJlc3VsdCkgJSAzNjA7XHJcbn0pO1xyXG4vKipcclxuICogQmVoYXZpb3IgY29uZmlndXJhdGlvbiBvZiB0aGUgZXhwb3J0ZXJcclxuICogUHJlZml4ZXM6IEFkZCBwcmVmaXggZm9yIGVhY2ggY2F0ZWdvcnkgb2YgdGhlIHRva2Vucy4gRm9yIGV4YW1wbGUsIGFsbCBjb2xvcnMgY2FuIHN0YXJ0IHdpdGggXCJjb2xvciwgaWYgbmVlZGVkXCJcclxuICovXHJcblB1bHNhci5yZWdpc3RlclBheWxvYWQoXCJiZWhhdmlvclwiLCB7XHJcbiAgICBjb2xvclRva2VuUHJlZml4OiBcImNvbG9yXCIsXHJcbiAgICBib3JkZXJUb2tlblByZWZpeDogXCJib3JkZXJcIixcclxuICAgIGdyYWRpZW50VG9rZW5QcmVmaXg6IFwiZ3JhZGllbnRcIixcclxuICAgIG1lYXN1cmVUb2tlblByZWZpeDogXCJtZWFzdXJlXCIsXHJcbiAgICBzaGFkb3dUb2tlblByZWZpeDogXCJzaGFkb3dcIixcclxuICAgIHR5cG9ncmFwaHlUb2tlblByZWZpeDogXCJ0eXBvZ3JhcGh5XCIsXHJcbn0pO1xyXG4vKiogRGVzY3JpYmUgY29tcGxleCBzaGFkb3cgdG9rZW4gKi9cclxuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJzaGFkb3dEZXNjcmlwdGlvblwiLCBmdW5jdGlvbiAoc2hhZG93VG9rZW4pIHtcclxuICAgIGxldCBjb25uZWN0ZWRTaGFkb3cgPSBcInRyYW5zcGFyZW50XCI7XHJcbiAgICBpZiAoc2hhZG93VG9rZW4uc2hhZG93TGF5ZXJzKSB7XHJcbiAgICAgICAgY29ubmVjdGVkU2hhZG93ID0gc2hhZG93VG9rZW4uc2hhZG93TGF5ZXJzXHJcbiAgICAgICAgICAgIC5yZXZlcnNlKClcclxuICAgICAgICAgICAgLm1hcCgoc2hhZG93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkb3dUb2tlblZhbHVlKHNoYWRvdyk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAgICAgLmpvaW4oXCIsIFwiKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBzaGFkb3dUb2tlblZhbHVlKHNoYWRvd1Rva2VuKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb25uZWN0ZWRTaGFkb3cgIT09IG51bGwgJiYgY29ubmVjdGVkU2hhZG93ICE9PSB2b2lkIDAgPyBjb25uZWN0ZWRTaGFkb3cgOiBcIlwiO1xyXG59KTtcclxuLyoqIENvbnZlcnQgY29tcGxleCBzaGFkb3cgdmFsdWUgdG8gQ1NTIHJlcHJlc2VudGF0aW9uICovXHJcbmZ1bmN0aW9uIHNoYWRvd1Rva2VuVmFsdWUoc2hhZG93VG9rZW4pIHtcclxuICAgIHZhciBibHVyUmFkaXVzID0gZ2V0VmFsdWVXaXRoQ29ycmVjdFVuaXQobm9uTmVnYXRpdmVWYWx1ZShzaGFkb3dUb2tlbi52YWx1ZS5yYWRpdXMubWVhc3VyZSkpO1xyXG4gICAgdmFyIG9mZnNldFggPSBnZXRWYWx1ZVdpdGhDb3JyZWN0VW5pdChzaGFkb3dUb2tlbi52YWx1ZS54Lm1lYXN1cmUpO1xyXG4gICAgdmFyIG9mZnNldFkgPSBnZXRWYWx1ZVdpdGhDb3JyZWN0VW5pdChzaGFkb3dUb2tlbi52YWx1ZS55Lm1lYXN1cmUpO1xyXG4gICAgdmFyIHNwcmVhZFJhZGl1cyA9IGdldFZhbHVlV2l0aENvcnJlY3RVbml0KHNoYWRvd1Rva2VuLnZhbHVlLnNwcmVhZC5tZWFzdXJlKTtcclxuICAgIHJldHVybiBgJHtzaGFkb3dUb2tlbi52YWx1ZS50eXBlID09PSBcIklubmVyXCIgPyBcImluc2V0IFwiIDogXCJcIn0ke29mZnNldFh9ICR7b2Zmc2V0WX0gJHtibHVyUmFkaXVzfSAke3NwcmVhZFJhZGl1c30gJHtnZXRGb3JtYXR0ZWRSR0Ioc2hhZG93VG9rZW4udmFsdWUuY29sb3IpfWA7XHJcbn1cclxuZnVuY3Rpb24gZ2V0VmFsdWVXaXRoQ29ycmVjdFVuaXQodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiBgJHt2YWx1ZX1gO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gdG9kbzogYWRkIHN1cHBvcnQgZm9yIG90aGVyIHVuaXRzIChweCwgcmVtLCBlbSwgZXRjLilcclxuICAgICAgICByZXR1cm4gYCR7dmFsdWV9cHhgO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG5vbk5lZ2F0aXZlVmFsdWUobnVtKSB7XHJcbiAgICBpZiAobnVtIDw9IDApIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudW07XHJcbiAgICB9XHJcbn1cclxuLyoqIENvbnZlcnQgdHlwZSB0byBDU1MgdW5pdCAqL1xyXG5mdW5jdGlvbiBtZWFzdXJlVHlwZUludG9SZWFkYWJsZVVuaXQodHlwZSkge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgY2FzZSBcIlBvaW50c1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJwdFwiO1xyXG4gICAgICAgIGNhc2UgXCJQaXhlbHNcIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwicHhcIjtcclxuICAgICAgICBjYXNlIFwiUGVyY2VudFwiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCIlXCI7XHJcbiAgICAgICAgY2FzZSBcIlJlbXNcIjpcclxuICAgICAgICAgICAgcmV0dXJuIFwicmVtXCI7XHJcbiAgICAgICAgY2FzZSBcIkVtc1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJlbVwiO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldEZvcm1hdHRlZFJHQihjb2xvclZhbHVlKSB7XHJcbiAgICBpZiAoY29sb3JWYWx1ZS5hID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGByZ2IoJHtjb2xvclZhbHVlLnJ9LCR7Y29sb3JWYWx1ZS5nfSwke2NvbG9yVmFsdWUuYn0pYDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG9wYWNpdHkgPSBNYXRoLnJvdW5kKChjb2xvclZhbHVlLmEgLyAyNTUpICogMTAwKSAvIDEwMDtcclxuICAgICAgICByZXR1cm4gYHJnYmEoJHtjb2xvclZhbHVlLnJ9LCR7Y29sb3JWYWx1ZS5nfSwke2NvbG9yVmFsdWUuYn0sJHtvcGFjaXR5fSlgO1xyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=