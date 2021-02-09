export function template(temp = "") {
  function parseFromString(str) {
    return new DOMParser().parseFromString(str, "text/html");
  }
  return {
    with(state) {
      let memory = { ...state };
      function bt(tmp) {
        let scopeTest = [];
        for (let memKey in memory) {
          scopeTest.push(
            `var ${memKey}=${
              typeof memory[memKey] === "string"
                ? `"${memory[memKey]}"`
                : memory[memKey]
            };`
          );
        }
        let split_temp = tmp
          .replace(/{{/g, "_{[")
          .replace(/}}/g, "]}_")
          .split(/(_{|}_)/)
          .filter((e) => !e.match(/(_{|}_)/));
        let bind_temp = split_temp.map((part) => {
          if (part.startsWith("[") && part.endsWith("]")) {
            let pt = part.substring(1, part.length - 1);
            try {
              return eval(`(()=>{
                ${scopeTest.join("")}
                return ${pt}
              })()`);
            } catch (err) {}
          } else return part;
        });
        return bind_temp.join("");
      }
      let m = parseFromString(bt(temp)).body.firstChild;
      for (let memoryKey in memory) {
        let inCapsLock = memoryKey
          .split("")
          .map((e, i) => (i === 0 ? e.toUpperCase() : e))
          .join("");
        state[`set${inCapsLock}`] = function (val) {
          if (typeof val === "function") {
            memory[memoryKey] = val(memory[memoryKey]);
          } else {
            memory[memoryKey] = val;
          }
          if (memory[memoryKey] !== state[memoryKey]) {
            console.log(memoryKey, " has changed");
            state[memoryKey] = memory[memoryKey];
            let u = parseFromString(bt(temp)).body;
            m.innerHTML = u.innerHTML;
          }
        };
      }
      return m;
    },
  };
}

export function state(state) {
  for (let objectKey in state) {
    let inCapsLock = objectKey
      .split("")
      .map((e, i) => (i === 0 ? e.toUpperCase() : e))
      .join("");
    state[`set${inCapsLock}`] = function (callback) {
      if (typeof callback !== "function") {
        state[objectKey] = callback;
      } else {
        state[objectKey] = callback(state[objectKey]);
      }
      return state[objectKey];
    };
  }

  return state;
}

export function render(component, target) {
  document.querySelector(target).appendChild(component);
}
const lib = {
  template,
  state,
  render,
};
export default lib;
