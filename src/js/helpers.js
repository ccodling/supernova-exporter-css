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
    const segments = [...tokenGroup.path];
    //const namespace = ""
    if (!tokenGroup.isRoot) {
        //segments.push(tokenGroup.name)
    }
    // if (prefix && prefix.length > 0) {
    //   segments.unshift(prefix);
    // }
    segments.push(token.name);
    //segments.unshift(namespace);
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
    console.log("---> " + sentence);
    return sentence;
});
function findAliases(token, allTokens) {
    let aliases = allTokens.filter(t => t.value.referencedToken && t.value.referencedToken.id === token.id);
    for (const t of aliases) {
        aliases = aliases.concat(findAliases(t, allTokens));
    }
    return aliases;
}
Pulsar.registerFunction("findAliases", findAliases);
Pulsar.registerFunction("gradientAngle", function (from, to) {
    var deltaY = (to.y - from.y);
    var deltaX = (to.x - from.x);
    var radians = Math.atan2(deltaY, deltaX);
    var result = radians * 180 / Math.PI;
    result = result + 90;
    return ((result < 0) ? (360 + result) : result) % 360;
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
        connectedShadow = shadowToken.shadowLayers.reverse().map((shadow) => {
            return shadowTokenValue(shadow);
        }).join(", ");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbURBQW1ELEVBQUUsUUFBUSxHQUFHLFFBQVEsR0FBRyxXQUFXLEdBQUcsYUFBYSxHQUFHLHlDQUF5QztBQUNoSztBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsTUFBTTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixhQUFhLEdBQUcsYUFBYSxHQUFHLGFBQWE7QUFDbkU7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGFBQWEsR0FBRyxhQUFhLEdBQUcsYUFBYSxHQUFHLFFBQVE7QUFDL0U7QUFDQSIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIvKipcclxuICogQ29udmVydCBncm91cCBuYW1lLCB0b2tlbiBuYW1lIGFuZCBwb3NzaWJsZSBwcmVmaXggaW50byBjYW1lbENhc2VkIHN0cmluZywgam9pbmluZyBldmVyeXRoaW5nIHRvZ2V0aGVyXHJcbiAqL1xyXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcInJlYWRhYmxlVmFyaWFibGVOYW1lXCIsIGZ1bmN0aW9uICh0b2tlbiwgdG9rZW5Hcm91cCwgcHJlZml4KSB7XHJcbiAgICAvLyBDcmVhdGUgYXJyYXkgd2l0aCBhbGwgcGF0aCBzZWdtZW50cyBhbmQgdG9rZW4gbmFtZSBhdCB0aGUgZW5kXHJcbiAgICBjb25zdCBzZWdtZW50cyA9IFsuLi50b2tlbkdyb3VwLnBhdGhdO1xyXG4gICAgLy9jb25zdCBuYW1lc3BhY2UgPSBcIlwiXHJcbiAgICBpZiAoIXRva2VuR3JvdXAuaXNSb290KSB7XHJcbiAgICAgICAgLy9zZWdtZW50cy5wdXNoKHRva2VuR3JvdXAubmFtZSlcclxuICAgIH1cclxuICAgIC8vIGlmIChwcmVmaXggJiYgcHJlZml4Lmxlbmd0aCA+IDApIHtcclxuICAgIC8vICAgc2VnbWVudHMudW5zaGlmdChwcmVmaXgpO1xyXG4gICAgLy8gfVxyXG4gICAgc2VnbWVudHMucHVzaCh0b2tlbi5uYW1lKTtcclxuICAgIC8vc2VnbWVudHMudW5zaGlmdChuYW1lc3BhY2UpO1xyXG4gICAgLy8gQ3JlYXRlIFwic2VudGVuY2VcIiBzZXBhcmF0ZWQgYnkgc3BhY2VzXHJcbiAgICBsZXQgc2VudGVuY2UgPSBzZWdtZW50cy5qb2luKFwiIFwiKTtcclxuICAgIC8vIHN0cmluZyBmcm9tIGFsbCBzZWdtZW50c1xyXG4gICAgc2VudGVuY2UgPSBzZW50ZW5jZVxyXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgLnJlcGxhY2UoL1teYS16QS1aMC05XSsoLikvZywgKG0sIGNocikgPT4gXCItXCIgKyBjaHIpO1xyXG4gICAgLy8gb25seSBhbGxvdyBsZXR0ZXJzLCBkaWdpdHMsIHVuZGVyc2NvcmUgYW5kIGh5cGhlblxyXG4gICAgc2VudGVuY2UgPSBzZW50ZW5jZS5yZXBsYWNlKC9bXmEtekEtWjAtOV8tXS9nLCAnXycpO1xyXG4gICAgLy8gcHJlcGVuZCB1bmRlcnNjb3JlIGlmIGl0IHN0YXJ0cyB3aXRoIGRpZ2l0IFxyXG4gICAgaWYgKC9eXFxkLy50ZXN0KHNlbnRlbmNlKSkge1xyXG4gICAgICAgIHNlbnRlbmNlID0gJ18nICsgc2VudGVuY2U7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcIi0tLT4gXCIgKyBzZW50ZW5jZSk7XHJcbiAgICByZXR1cm4gc2VudGVuY2U7XHJcbn0pO1xyXG5mdW5jdGlvbiBmaW5kQWxpYXNlcyh0b2tlbiwgYWxsVG9rZW5zKSB7XHJcbiAgICBsZXQgYWxpYXNlcyA9IGFsbFRva2Vucy5maWx0ZXIodCA9PiB0LnZhbHVlLnJlZmVyZW5jZWRUb2tlbiAmJiB0LnZhbHVlLnJlZmVyZW5jZWRUb2tlbi5pZCA9PT0gdG9rZW4uaWQpO1xyXG4gICAgZm9yIChjb25zdCB0IG9mIGFsaWFzZXMpIHtcclxuICAgICAgICBhbGlhc2VzID0gYWxpYXNlcy5jb25jYXQoZmluZEFsaWFzZXModCwgYWxsVG9rZW5zKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWxpYXNlcztcclxufVxyXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcImZpbmRBbGlhc2VzXCIsIGZpbmRBbGlhc2VzKTtcclxuUHVsc2FyLnJlZ2lzdGVyRnVuY3Rpb24oXCJncmFkaWVudEFuZ2xlXCIsIGZ1bmN0aW9uIChmcm9tLCB0bykge1xyXG4gICAgdmFyIGRlbHRhWSA9ICh0by55IC0gZnJvbS55KTtcclxuICAgIHZhciBkZWx0YVggPSAodG8ueCAtIGZyb20ueCk7XHJcbiAgICB2YXIgcmFkaWFucyA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpO1xyXG4gICAgdmFyIHJlc3VsdCA9IHJhZGlhbnMgKiAxODAgLyBNYXRoLlBJO1xyXG4gICAgcmVzdWx0ID0gcmVzdWx0ICsgOTA7XHJcbiAgICByZXR1cm4gKChyZXN1bHQgPCAwKSA/ICgzNjAgKyByZXN1bHQpIDogcmVzdWx0KSAlIDM2MDtcclxufSk7XHJcbi8qKlxyXG4gKiBCZWhhdmlvciBjb25maWd1cmF0aW9uIG9mIHRoZSBleHBvcnRlclxyXG4gKiBQcmVmaXhlczogQWRkIHByZWZpeCBmb3IgZWFjaCBjYXRlZ29yeSBvZiB0aGUgdG9rZW5zLiBGb3IgZXhhbXBsZSwgYWxsIGNvbG9ycyBjYW4gc3RhcnQgd2l0aCBcImNvbG9yLCBpZiBuZWVkZWRcIlxyXG4gKi9cclxuUHVsc2FyLnJlZ2lzdGVyUGF5bG9hZChcImJlaGF2aW9yXCIsIHtcclxuICAgIGNvbG9yVG9rZW5QcmVmaXg6IFwiY29sb3JcIixcclxuICAgIGJvcmRlclRva2VuUHJlZml4OiBcImJvcmRlclwiLFxyXG4gICAgZ3JhZGllbnRUb2tlblByZWZpeDogXCJncmFkaWVudFwiLFxyXG4gICAgbWVhc3VyZVRva2VuUHJlZml4OiBcIm1lYXN1cmVcIixcclxuICAgIHNoYWRvd1Rva2VuUHJlZml4OiBcInNoYWRvd1wiLFxyXG4gICAgdHlwb2dyYXBoeVRva2VuUHJlZml4OiBcInR5cG9ncmFwaHlcIixcclxufSk7XHJcbi8qKiBEZXNjcmliZSBjb21wbGV4IHNoYWRvdyB0b2tlbiAqL1xyXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcInNoYWRvd0Rlc2NyaXB0aW9uXCIsIGZ1bmN0aW9uIChzaGFkb3dUb2tlbikge1xyXG4gICAgbGV0IGNvbm5lY3RlZFNoYWRvdyA9IFwidHJhbnNwYXJlbnRcIjtcclxuICAgIGlmIChzaGFkb3dUb2tlbi5zaGFkb3dMYXllcnMpIHtcclxuICAgICAgICBjb25uZWN0ZWRTaGFkb3cgPSBzaGFkb3dUb2tlbi5zaGFkb3dMYXllcnMucmV2ZXJzZSgpLm1hcCgoc2hhZG93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkb3dUb2tlblZhbHVlKHNoYWRvdyk7XHJcbiAgICAgICAgfSkuam9pbihcIiwgXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHNoYWRvd1Rva2VuVmFsdWUoc2hhZG93VG9rZW4pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbm5lY3RlZFNoYWRvdyAhPT0gbnVsbCAmJiBjb25uZWN0ZWRTaGFkb3cgIT09IHZvaWQgMCA/IGNvbm5lY3RlZFNoYWRvdyA6IFwiXCI7XHJcbn0pO1xyXG4vKiogQ29udmVydCBjb21wbGV4IHNoYWRvdyB2YWx1ZSB0byBDU1MgcmVwcmVzZW50YXRpb24gKi9cclxuZnVuY3Rpb24gc2hhZG93VG9rZW5WYWx1ZShzaGFkb3dUb2tlbikge1xyXG4gICAgdmFyIGJsdXJSYWRpdXMgPSBnZXRWYWx1ZVdpdGhDb3JyZWN0VW5pdChub25OZWdhdGl2ZVZhbHVlKHNoYWRvd1Rva2VuLnZhbHVlLnJhZGl1cy5tZWFzdXJlKSk7XHJcbiAgICB2YXIgb2Zmc2V0WCA9IGdldFZhbHVlV2l0aENvcnJlY3RVbml0KHNoYWRvd1Rva2VuLnZhbHVlLngubWVhc3VyZSk7XHJcbiAgICB2YXIgb2Zmc2V0WSA9IGdldFZhbHVlV2l0aENvcnJlY3RVbml0KHNoYWRvd1Rva2VuLnZhbHVlLnkubWVhc3VyZSk7XHJcbiAgICB2YXIgc3ByZWFkUmFkaXVzID0gZ2V0VmFsdWVXaXRoQ29ycmVjdFVuaXQoc2hhZG93VG9rZW4udmFsdWUuc3ByZWFkLm1lYXN1cmUpO1xyXG4gICAgcmV0dXJuIGAke3NoYWRvd1Rva2VuLnZhbHVlLnR5cGUgPT09IFwiSW5uZXJcIiA/IFwiaW5zZXQgXCIgOiBcIlwifSR7b2Zmc2V0WH0gJHtvZmZzZXRZfSAke2JsdXJSYWRpdXN9ICR7c3ByZWFkUmFkaXVzfSAke2dldEZvcm1hdHRlZFJHQihzaGFkb3dUb2tlbi52YWx1ZS5jb2xvcil9YDtcclxufVxyXG5mdW5jdGlvbiBnZXRWYWx1ZVdpdGhDb3JyZWN0VW5pdCh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3ZhbHVlfWA7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyB0b2RvOiBhZGQgc3VwcG9ydCBmb3Igb3RoZXIgdW5pdHMgKHB4LCByZW0sIGVtLCBldGMuKVxyXG4gICAgICAgIHJldHVybiBgJHt2YWx1ZX1weGA7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbm9uTmVnYXRpdmVWYWx1ZShudW0pIHtcclxuICAgIGlmIChudW0gPD0gMCkge1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG51bTtcclxuICAgIH1cclxufVxyXG4vKiogQ29udmVydCB0eXBlIHRvIENTUyB1bml0ICovXHJcbmZ1bmN0aW9uIG1lYXN1cmVUeXBlSW50b1JlYWRhYmxlVW5pdCh0eXBlKSB7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICBjYXNlIFwiUG9pbnRzXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcInB0XCI7XHJcbiAgICAgICAgY2FzZSBcIlBpeGVsc1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gXCJweFwiO1xyXG4gICAgICAgIGNhc2UgXCJQZXJjZW50XCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcIiVcIjtcclxuICAgICAgICBjYXNlIFwiRW1zXCI6XHJcbiAgICAgICAgICAgIHJldHVybiBcImVtXCI7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkUkdCKGNvbG9yVmFsdWUpIHtcclxuICAgIGlmIChjb2xvclZhbHVlLmEgPT09IDApIHtcclxuICAgICAgICByZXR1cm4gYHJnYigke2NvbG9yVmFsdWUucn0sJHtjb2xvclZhbHVlLmd9LCR7Y29sb3JWYWx1ZS5ifSlgO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3Qgb3BhY2l0eSA9IE1hdGgucm91bmQoKGNvbG9yVmFsdWUuYSAvIDI1NSkgKiAxMDApIC8gMTAwO1xyXG4gICAgICAgIHJldHVybiBgcmdiYSgke2NvbG9yVmFsdWUucn0sJHtjb2xvclZhbHVlLmd9LCR7Y29sb3JWYWx1ZS5ifSwke29wYWNpdHl9KWA7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==