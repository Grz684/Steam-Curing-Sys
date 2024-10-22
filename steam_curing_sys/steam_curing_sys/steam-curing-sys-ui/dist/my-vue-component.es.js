import Lt, { ref as ne, onMounted as ct, provide as mt, readonly as yt, inject as bt, watch as st, openBlock as Ne, createElementBlock as Be, createElementVNode as N, toDisplayString as De, Fragment as at, renderList as ut, normalizeClass as it, createCommentVNode as ft, reactive as ht, createVNode as Xe, computed as dt, createTextVNode as wt, normalizeStyle as St, defineComponent as Pt, withDirectives as pt, vModelText as vt, unref as Nt, onUnmounted as Bt } from "vue";
const Ot = Symbol(), _t = Symbol(), jt = Symbol();
function It(ye, Y) {
  ye && ye.messageSignal ? ye.messageSignal.connect((ee) => {
    try {
      const i = JSON.parse(ee);
      Y.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), Y.value = { type: "unknown", content: ee };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const ye = ne(null), Y = ne(null), ee = ne("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      ye.value = f, Y.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), It(Y.value, ee), Y.value && typeof Y.value.vueReady == "function" ? Y.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ct(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), mt(Ot, yt(ye)), mt(_t, yt(Y)), mt(jt, yt(ee));
}
function rt() {
  const ye = bt(Ot), Y = bt(_t), ee = bt(jt);
  return (!ye || !Y || !ee) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: ye,
    bridge: Y,
    message: ee,
    sendToPyQt: (f, e) => {
      if (console.log(`Attempting to call ${f} with args:`, e), Y && Y.value)
        if (typeof Y.value.sendToPyQt == "function")
          try {
            Y.value.sendToPyQt(f, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(Y.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const ot = (ye, Y) => {
  const ee = ye.__vccOpts || ye;
  for (const [i, f] of Y)
    ee[i] = f;
  return ee;
}, Mt = {
  key: 0,
  class: "numeric-keyboard"
}, Ut = { class: "keyboard" }, $t = { class: "current-value" }, Dt = ["onClick"], Ft = {
  __name: "NumericKeyboard",
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    showKeyboard: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue", "update:showKeyboard"],
  setup(ye, { emit: Y }) {
    const ee = ye, i = Y, f = ne([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = ne("");
    st(() => ee.showKeyboard, (r) => {
      r && (e.value = ee.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => ye.showKeyboard ? (Ne(), Be("div", Mt, [
      N("div", Ut, [
        N("div", $t, De(e.value), 1),
        (Ne(!0), Be(at, null, ut(f.value, (t) => (Ne(), Be("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ne(!0), Be(at, null, ut(t, (u) => (Ne(), Be("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, De(u), 11, Dt))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, Et = /* @__PURE__ */ ot(Ft, [["__scopeId", "data-v-541feda2"]]), Vt = { class: "settings-container" }, Wt = { class: "setting-group" }, qt = { class: "setting-item" }, zt = { class: "setting-controls" }, Qt = ["value"], Kt = { class: "setting-item" }, Ht = { class: "setting-controls" }, Gt = ["value"], Yt = { class: "setting-group" }, Xt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Zt = ["value"], en = { class: "setting-item" }, tn = { class: "setting-controls" }, nn = ["value"], rn = {
  __name: "SensorSettings",
  setup(ye) {
    const { sendToPyQt: Y } = rt(), ee = ht({
      isPyQtWebEngine: !1
    }), i = ne(30), f = ne(10), e = ne(80), n = ne(20), r = ne(!1), o = ne(null), t = ne("");
    ct(() => {
      if (ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: m } = rt();
        st(m, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const v = JSON.parse(p.content);
              i.value = v.temp_upper, f.value = v.temp_lower, e.value = v.humidity_upper, n.value = v.humidity_lower, console.log("Sensor Settings updated:", v);
            } catch (v) {
              console.error("Failed to parse sensor settings data:", v);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), s();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const h = JSON.parse(p.content).args;
            i.value = h.temp_upper, f.value = h.temp_lower, e.value = h.humidity_upper, n.value = h.humidity_lower, s();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (m, p) => {
      const v = m === "tempUpper" ? i : m === "tempLower" ? f : m === "humidityUpper" ? e : n;
      v.value = (v.value || 0) + p, m.startsWith("temp") ? c(m === "tempUpper" ? "upper" : "lower") : a(m === "humidityUpper" ? "upper" : "lower");
    }, c = (m) => {
      i.value === "" && (i.value = f.value + 1), f.value === "" && (f.value = i.value - 1), m === "upper" ? i.value = Math.max(f.value + 1, i.value) : f.value = Math.min(i.value - 1, f.value), s();
    }, a = (m) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), m === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), s();
    }, s = () => {
      if (i.value !== "" && f.value !== "" && e.value !== "" && n.value !== "") {
        const m = {
          temp_upper: i.value,
          temp_lower: f.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", m), ee.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), Y("updateLimitSettings", m)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (m) => {
      o.value = m, r.value = !0, t.value = m.startsWith("temp") ? m === "tempUpper" ? i.value : f.value : m === "humidityUpper" ? e.value : n.value;
    }, d = (m) => {
      const p = parseFloat(m);
      isNaN(p) || (o.value === "tempUpper" ? (i.value = p, c("upper")) : o.value === "tempLower" ? (f.value = p, c("lower")) : o.value === "humidityUpper" ? (e.value = p, a("upper")) : o.value === "humidityLower" && (n.value = p, a("lower"))), o.value = null;
    };
    return (m, p) => (Ne(), Be("div", Vt, [
      N("div", Wt, [
        p[15] || (p[15] = N("h2", null, "温度设置 (°C)", -1)),
        N("div", qt, [
          p[13] || (p[13] = N("span", { class: "setting-label" }, "上限：", -1)),
          N("div", zt, [
            N("button", {
              onClick: p[0] || (p[0] = (v) => u("tempUpper", -1))
            }, "-"),
            N("input", {
              type: "text",
              value: i.value,
              onFocus: p[1] || (p[1] = (v) => l("tempUpper")),
              readonly: ""
            }, null, 40, Qt),
            N("button", {
              onClick: p[2] || (p[2] = (v) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        N("div", Kt, [
          p[14] || (p[14] = N("span", { class: "setting-label" }, "下限：", -1)),
          N("div", Ht, [
            N("button", {
              onClick: p[3] || (p[3] = (v) => u("tempLower", -1))
            }, "-"),
            N("input", {
              type: "text",
              value: f.value,
              onFocus: p[4] || (p[4] = (v) => l("tempLower")),
              readonly: ""
            }, null, 40, Gt),
            N("button", {
              onClick: p[5] || (p[5] = (v) => u("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      N("div", Yt, [
        p[18] || (p[18] = N("h2", null, "湿度设置 (%)", -1)),
        N("div", Xt, [
          p[16] || (p[16] = N("span", { class: "setting-label" }, "上限：", -1)),
          N("div", Jt, [
            N("button", {
              onClick: p[6] || (p[6] = (v) => u("humidityUpper", -1))
            }, "-"),
            N("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => l("humidityUpper")),
              readonly: ""
            }, null, 40, Zt),
            N("button", {
              onClick: p[8] || (p[8] = (v) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        N("div", en, [
          p[17] || (p[17] = N("span", { class: "setting-label" }, "下限：", -1)),
          N("div", tn, [
            N("button", {
              onClick: p[9] || (p[9] = (v) => u("humidityLower", -1))
            }, "-"),
            N("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => l("humidityLower")),
              readonly: ""
            }, null, 40, nn),
            N("button", {
              onClick: p[11] || (p[11] = (v) => u("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Xe(Et, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": d,
        "onUpdate:showKeyboard": p[12] || (p[12] = (v) => r.value = v)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, on = /* @__PURE__ */ ot(rn, [["__scopeId", "data-v-19eef055"]]), an = { class: "sensor-data-group" }, un = { class: "sensor-section" }, cn = { class: "sensor-container" }, sn = { class: "sensor-grid" }, ln = { class: "sensor-title" }, fn = { class: "sensor-value" }, dn = { class: "sensor-section" }, pn = { class: "sensor-container" }, vn = { class: "sensor-grid" }, hn = { class: "sensor-title" }, gn = { class: "sensor-value" }, mn = {
  __name: "SensorDisplay",
  setup(ye) {
    const Y = ne({ temperature: {}, humidity: {} }), { sendToPyQt: ee } = rt();
    ct(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: f } = rt();
        st(f, (e) => {
          if (e && e.type === "update_sensor_data")
            try {
              Y.value = JSON.parse(e.content);
            } catch (n) {
              console.error("Failed to parse sensor data:", n);
            }
          else e && e.type === "get_sensor_data" && ee("update_remote_sensor_data", Y.value);
        });
      } else
        console.log("在普通网页环境中执行"), i(), setInterval(i, 5e3);
    });
    const i = async () => {
      try {
        const f = await fetch("http://localhost:8000/api/sensor-data/");
        if (!f.ok)
          throw new Error(`HTTP error! status: ${f.status}`);
        const e = await f.json();
        Y.value = e;
      } catch (f) {
        console.error("Error fetching sensor data:", f);
      }
    };
    return (f, e) => (Ne(), Be("div", an, [
      N("div", un, [
        e[0] || (e[0] = N("h2", null, "温度传感器", -1)),
        N("div", cn, [
          N("div", sn, [
            (Ne(!0), Be(at, null, ut(Y.value.temperature, (n, r) => (Ne(), Be("div", {
              key: r,
              class: "sensor-card"
            }, [
              N("div", ln, De(r), 1),
              N("div", fn, De(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      N("div", dn, [
        e[1] || (e[1] = N("h2", null, "湿度传感器", -1)),
        N("div", pn, [
          N("div", vn, [
            (Ne(!0), Be(at, null, ut(Y.value.humidity, (n, r) => (Ne(), Be("div", {
              key: r,
              class: "sensor-card"
            }, [
              N("div", hn, De(r), 1),
              N("div", gn, De(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ ot(mn, [["__scopeId", "data-v-4d55ddc2"]]), bn = { class: "integrated-control-system" }, wn = { class: "mode-controls" }, xn = ["disabled"], kn = ["disabled"], Sn = ["disabled"], On = ["disabled"], _n = { class: "systems-container" }, jn = { class: "steam-engine-control" }, En = { class: "control-panel" }, Cn = { class: "engine-status" }, Tn = { class: "engine left" }, An = ["disabled"], Ln = { class: "engine right" }, Pn = ["disabled"], Nn = { class: "sprinkler-system" }, Bn = { class: "controls" }, In = { class: "input-group" }, Rn = ["value"], Mn = { class: "input-group" }, Un = ["value"], $n = { class: "input-group" }, Dn = ["value"], Fn = { class: "visualization" }, Vn = ["onClick"], Wn = { class: "status" }, qn = {
  __name: "IntegratedControlSystem",
  setup(ye) {
    const Y = ne(!1), ee = ne(!1), i = ne(5), f = ne(2), e = ne(10), n = ne(i.value), r = ne(f.value), o = ne(e.value), t = ne(i.value), u = ne(f.value), c = ne(e.value), a = ne(0), s = ne(""), l = ne(Array(12).fill(0)), d = ne(0), m = ne(!0), p = ne(!1), v = ne(!1), h = ne(null), b = ne(""), g = ne(!1), j = ne(15), E = ne(""), { sendToPyQt: y } = rt(), k = ne(0), w = ne(0), O = ht({
      isPyQtWebEngine: !1
    });
    ct(() => {
      if (O.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: L } = rt();
        st(L, (P) => {
          if (P && P.type === "update_left_steam_status")
            Y.value = P.content;
          else if (P && P.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), S();
          else if (P && P.type === "update_right_steam_status")
            ee.value = P.content;
          else if (P && P.type === "update_sprinkler_settings")
            try {
              const Q = JSON.parse(P.content);
              t.value = Q.sprinkler_single_run_time, u.value = Q.sprinkler_run_interval_time, c.value = Q.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, console.log("Sprinkler Settings updated:", Q);
            } catch (Q) {
              console.error("Failed to parse sprinkler settings data:", Q);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    function _() {
      if (!p.value) return 0;
      const L = Date.now();
      return Math.floor((L - k.value) / 1e3);
    }
    function C() {
      return p.value ? w.value : 0;
    }
    const S = () => {
      const L = {
        leftEngineOn: Y.value,
        rightEngineOn: ee.value,
        currentSingleRunTime: i.value,
        currentRunIntervalTime: f.value,
        currentLoopInterval: e.value,
        nextSingleRunTime: n.value,
        nextRunIntervalTime: r.value,
        nextLoopInterval: o.value,
        tempSingleRunTime: t.value,
        tempRunIntervalTime: u.value,
        tempLoopInterval: c.value,
        activeSprinkler: a.value,
        currentPhase: s.value,
        waterLevels: l.value,
        remainingTime: d.value,
        isAutoMode: m.value,
        isRunning: p.value,
        isSwitching: g.value,
        switchingTime: j.value,
        switchingMessage: E.value,
        elapsedTime: _(),
        totalTime: C()
      };
      y("IntegratedControlSystem_init_response", L);
    }, U = dt(() => g.value ? `${E.value}，还需${j.value}秒` : m.value ? p.value ? s.value === "run" ? `喷头 ${a.value} 正在运行，剩余 ${d.value + 1} 秒` : s.value === "interval" ? `运行间隔中，剩余 ${d.value + 1} 秒` : s.value === "loop" ? `循环间隔中，剩余 ${d.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    let T, R;
    async function Z(L) {
      g.value = !0, j.value = 15, E.value = L ? "正在切换到喷淋管" : "正在切换到喷雾机", y("controlSprinkler", { target: "switchToSprinkler", state: L });
      const P = setInterval(() => {
        j.value--, j.value <= 0 && (clearInterval(P), g.value = !1);
      }, 1e3);
      return new Promise((Q) => {
        setTimeout(() => {
          g.value = !1, Q();
        }, j.value * 1e3);
      });
    }
    async function X(L) {
      const P = m.value;
      if (m.value = L === "auto", P !== m.value)
        if (O.isPyQtWebEngine && y("controlSprinkler", { target: "setMode", mode: m.value ? "auto" : "manual" }), m.value) {
          Y.value && await ie();
          const Q = l.value.findIndex((ge) => ge === 100);
          Q !== -1 && (l.value[Q] = 0, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: Q + 1, state: 0 })), y("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await Ee();
    }
    async function ie() {
      O.isPyQtWebEngine && (y("setEngineState", { engine: "left", state: !Y.value }), y("setEngineState", { engine: "right", state: !ee.value }), Y.value = !Y.value, ee.value = !ee.value);
    }
    async function te() {
      const L = l.value.findIndex((P) => P === 100);
      O.isPyQtWebEngine && L === -1 && (Y.value ? y("controlSprinkler", { target: "tankWork", state: 0 }) : (await Z(0), y("controlSprinkler", { target: "tankWork", state: 1 })), y("setEngineState", { engine: "left", state: !Y.value }), y("setEngineState", { engine: "right", state: !ee.value }), Y.value = !Y.value, ee.value = !ee.value);
    }
    function A(L) {
      h.value = L, v.value = !0, b.value = L === "singleRunTime" ? t.value.toString() : L === "runIntervalTime" ? u.value.toString() : c.value.toString();
    }
    function B(L) {
      const P = parseInt(L);
      isNaN(P) || (h.value === "singleRunTime" ? (t.value = P, K()) : h.value === "runIntervalTime" ? (u.value = P, G()) : h.value === "loopInterval" && (c.value = P, V())), h.value = null;
    }
    function K() {
      t.value = Math.max(1, t.value), n.value = t.value, me();
    }
    function G() {
      u.value = Math.max(0, u.value), r.value = u.value, me();
    }
    function V() {
      c.value = Math.max(0, c.value), o.value = c.value, me();
    }
    function me() {
      if (O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const L = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        y("controlSprinkler", { target: "settings", settings: JSON.stringify(L) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function fe() {
      p.value || !m.value || (p.value = !0, l.value = Array(12).fill(0), await Pe());
    }
    async function Ee() {
      O.isPyQtWebEngine && (a.value > 0 && y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), y("controlSprinkler", { target: "setState", state: !1 })), Y.value && await ie(), Le(), y("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function Le() {
      p.value = !1, clearTimeout(T), clearInterval(R), a.value = 0, s.value = "", l.value = Array(12).fill(0), d.value = 0;
    }
    async function Pe() {
      a.value = 1, await Z(1), y("controlSprinkler", { target: "tankWork", state: 1 }), Fe();
    }
    async function je() {
      a.value = 1, Fe();
    }
    function Se() {
      !p.value || !m.value || (d.value--, d.value > 0 && setTimeout(Se, 1e3));
    }
    function Fe() {
      if (!p.value || !m.value) return;
      s.value = "run", i.value = n.value, d.value = i.value, k.value = Date.now(), w.value = i.value, Se();
      let L = Date.now();
      y("controlSprinkler", { target: "manual", index: a.value, state: 1 }), R = setInterval(() => {
        let P = Date.now() - L, Q = Math.min(P / (i.value * 1e3), 1);
        l.value[a.value - 1] = Q * 100;
      }, 100), T = setTimeout(async () => {
        clearInterval(R), a.value < 12 ? (l.value[a.value - 1] = 0, y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), He()) : (l.value[a.value - 1] = 0, y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), $());
      }, i.value * 1e3);
    }
    function He() {
      !p.value || !m.value || (f.value = r.value, d.value = f.value, k.value = Date.now(), w.value = f.value, d.value > 0 && (s.value = "interval"), Se(), T = setTimeout(() => {
        a.value++, Fe();
      }, f.value * 1e3));
    }
    async function $() {
      !p.value || !m.value || (e.value = o.value, d.value = e.value, k.value = Date.now(), w.value = e.value, d.value > 0 ? (y("controlSprinkler", { target: "tankWork", state: 0 }), await Z(0), y("controlSprinkler", { target: "setState", state: !0 }), s.value = "loop", Se(), a.value = 0, T = setTimeout(async () => {
        l.value = Array(12).fill(0), y("controlSprinkler", { target: "setState", state: !1 }), Y.value && await ie(), y("controlSprinkler", { target: "tankWork", state: 0 }), await Pe();
      }, e.value * 1e3)) : (a.value = 0, l.value = Array(12).fill(0), await je()));
    }
    function D(L) {
      return l.value[L - 1];
    }
    async function H(L) {
      if (m.value) return;
      const P = l.value.findIndex((Q) => Q === 100);
      l.value[L - 1] > 0 ? (l.value[L - 1] = 0, O.isPyQtWebEngine && (y("controlSprinkler", { target: "manual", index: L, state: 0 }), y("controlSprinkler", { target: "tankWork", state: 0 }))) : P !== -1 ? (l.value[P] = 0, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: P + 1, state: 0 }), l.value[L - 1] = 100, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: L, state: 1 })) : (await Z(1), y("controlSprinkler", { target: "tankWork", state: 1 }), l.value[L - 1] = 100, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: L, state: 1 }));
    }
    return (L, P) => (Ne(), Be("div", bn, [
      P[15] || (P[15] = N("h2", null, "集成控制系统", -1)),
      N("div", wn, [
        N("button", {
          onClick: P[0] || (P[0] = (Q) => X("auto")),
          disabled: g.value,
          class: it([{ active: m.value }, "mode-btn"])
        }, "自动模式", 10, xn),
        N("button", {
          onClick: P[1] || (P[1] = (Q) => X("manual")),
          disabled: g.value,
          class: it([{ active: !m.value }, "mode-btn"])
        }, "手动模式", 10, kn),
        N("button", {
          onClick: fe,
          disabled: p.value || !m.value || g.value,
          class: "control-btn"
        }, "开始", 8, Sn),
        N("button", {
          onClick: Ee,
          disabled: !p.value || !m.value || g.value,
          class: "control-btn"
        }, "停止", 8, On)
      ]),
      N("div", _n, [
        N("div", jn, [
          P[10] || (P[10] = N("h3", null, "雾化机控制系统", -1)),
          N("div", En, [
            N("div", Cn, [
              N("div", Tn, [
                P[7] || (P[7] = N("h4", null, "左雾化机", -1)),
                N("div", {
                  class: it(["status", { on: Y.value }])
                }, [
                  P[6] || (P[6] = N("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + De(Y.value ? "开" : "关"), 1)
                ], 2),
                N("button", {
                  onClick: te,
                  disabled: m.value || g.value,
                  class: "control-btn"
                }, De(Y.value ? "关闭" : "开启"), 9, An)
              ]),
              N("div", Ln, [
                P[9] || (P[9] = N("h4", null, "右雾化机", -1)),
                N("div", {
                  class: it(["status", { on: ee.value }])
                }, [
                  P[8] || (P[8] = N("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + De(ee.value ? "开" : "关"), 1)
                ], 2),
                N("button", {
                  onClick: te,
                  disabled: m.value || g.value,
                  class: "control-btn"
                }, De(ee.value ? "关闭" : "开启"), 9, Pn)
              ])
            ])
          ])
        ]),
        N("div", Nn, [
          P[14] || (P[14] = N("h3", null, "喷淋系统", -1)),
          N("div", Bn, [
            N("div", In, [
              P[11] || (P[11] = N("label", null, "单次运行时间 (秒):", -1)),
              N("input", {
                type: "text",
                value: t.value,
                onFocus: P[2] || (P[2] = (Q) => A("singleRunTime")),
                readonly: ""
              }, null, 40, Rn)
            ]),
            N("div", Mn, [
              P[12] || (P[12] = N("label", null, "运行时间间隔 (秒):", -1)),
              N("input", {
                type: "text",
                value: u.value,
                onFocus: P[3] || (P[3] = (Q) => A("runIntervalTime")),
                readonly: ""
              }, null, 40, Un)
            ]),
            N("div", $n, [
              P[13] || (P[13] = N("label", null, "循环时间间隔 (秒):", -1)),
              N("input", {
                type: "text",
                value: c.value,
                onFocus: P[4] || (P[4] = (Q) => A("loopInterval")),
                readonly: ""
              }, null, 40, Dn)
            ])
          ]),
          N("div", Fn, [
            (Ne(), Be(at, null, ut(12, (Q) => N("div", {
              key: Q,
              class: it(["sprinkler", { active: m.value ? a.value === Q : l.value[Q - 1] > 0 }]),
              onClick: (ge) => !g.value && !m.value && !Y.value && H(Q)
            }, [
              N("div", {
                class: "water",
                style: St({ height: D(Q) + "%" })
              }, null, 4),
              N("span", null, De(Q), 1)
            ], 10, Vn)), 64))
          ]),
          N("div", Wn, De(U.value), 1)
        ])
      ]),
      Xe(Et, {
        modelValue: b.value,
        showKeyboard: v.value,
        "onUpdate:modelValue": B,
        "onUpdate:showKeyboard": P[5] || (P[5] = (Q) => v.value = Q)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, zn = /* @__PURE__ */ ot(qn, [["__scopeId", "data-v-d7df481a"]]), Qn = { class: "data-actions" }, Kn = {
  key: 0,
  class: "modal-overlay"
}, Hn = {
  key: 1,
  class: "modal-overlay"
}, Gn = { class: "modal-content" }, Yn = {
  __name: "DataExport",
  setup(ye) {
    const { sendToPyQt: Y } = rt(), ee = ht({
      isPyQtWebEngine: !1
    }), i = ne(!1), f = ne(!1), e = ne("");
    ct(() => {
      ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      ee.isPyQtWebEngine && (console.log("导出数据"), Y("exportData", !0));
    }, r = () => {
      i.value = !0;
    }, o = () => {
      i.value = !1;
    }, t = () => {
      console.log("清空数据"), i.value = !1, u("所有数据已清空！"), ee.isPyQtWebEngine && Y("exportData", !1);
    }, u = (a) => {
      e.value = a, f.value = !0;
    }, c = () => {
      f.value = !1;
    };
    return (a, s) => (Ne(), Be("div", Qn, [
      N("div", { class: "action-buttons" }, [
        N("div", { class: "button-group" }, [
          s[0] || (s[0] = N("i", { class: "fas fa-file-excel" }, null, -1)),
          N("button", {
            onClick: n,
            class: "export-btn"
          }, "导出数据")
        ]),
        N("div", { class: "button-group" }, [
          s[1] || (s[1] = N("i", { class: "fas fa-trash-alt" }, null, -1)),
          N("button", {
            onClick: r,
            class: "clear-btn"
          }, "清空数据")
        ])
      ]),
      i.value ? (Ne(), Be("div", Kn, [
        N("div", { class: "modal-content" }, [
          s[2] || (s[2] = N("p", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          N("div", { class: "modal-buttons" }, [
            N("button", {
              onClick: t,
              class: "confirm-btn"
            }, "确定"),
            N("button", {
              onClick: o,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ft("", !0),
      f.value ? (Ne(), Be("div", Hn, [
        N("div", Gn, [
          N("p", null, De(e.value), 1),
          N("div", { class: "modal-buttons" }, [
            N("button", {
              onClick: c,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ft("", !0)
    ]));
  }
}, Xn = /* @__PURE__ */ ot(Yn, [["__scopeId", "data-v-86824edf"]]);
var Jn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Zn(ye) {
  return ye && ye.__esModule && Object.prototype.hasOwnProperty.call(ye, "default") ? ye.default : ye;
}
var Ct = { exports: {} };
(function(ye, Y) {
  (function(ee, i) {
    ye.exports = i(Lt);
  })(typeof self < "u" ? self : Jn, function(ee) {
    return function(i) {
      var f = {};
      function e(n) {
        if (f[n]) return f[n].exports;
        var r = f[n] = { i: n, l: !1, exports: {} };
        return i[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports;
      }
      return e.m = i, e.c = f, e.d = function(n, r, o) {
        e.o(n, r) || Object.defineProperty(n, r, { enumerable: !0, get: o });
      }, e.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, e.t = function(n, r) {
        if (1 & r && (n = e(n)), 8 & r || 4 & r && typeof n == "object" && n && n.__esModule) return n;
        var o = /* @__PURE__ */ Object.create(null);
        if (e.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: n }), 2 & r && typeof n != "string") for (var t in n) e.d(o, t, (function(u) {
          return n[u];
        }).bind(null, t));
        return o;
      }, e.n = function(n) {
        var r = n && n.__esModule ? function() {
          return n.default;
        } : function() {
          return n;
        };
        return e.d(r, "a", r), r;
      }, e.o = function(n, r) {
        return Object.prototype.hasOwnProperty.call(n, r);
      }, e.p = "", e(e.s = "fb15");
    }({ "00ee": function(i, f, e) {
      var n = e("b622"), r = n("toStringTag"), o = {};
      o[r] = "z", i.exports = String(o) === "[object z]";
    }, "0366": function(i, f, e) {
      var n = e("1c0b");
      i.exports = function(r, o, t) {
        if (n(r), o === void 0) return r;
        switch (t) {
          case 0:
            return function() {
              return r.call(o);
            };
          case 1:
            return function(u) {
              return r.call(o, u);
            };
          case 2:
            return function(u, c) {
              return r.call(o, u, c);
            };
          case 3:
            return function(u, c, a) {
              return r.call(o, u, c, a);
            };
        }
        return function() {
          return r.apply(o, arguments);
        };
      };
    }, "057f": function(i, f, e) {
      var n = e("fc6a"), r = e("241c").f, o = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], u = function(c) {
        try {
          return r(c);
        } catch {
          return t.slice();
        }
      };
      i.exports.f = function(c) {
        return t && o.call(c) == "[object Window]" ? u(c) : r(n(c));
      };
    }, "06cf": function(i, f, e) {
      var n = e("83ab"), r = e("d1e7"), o = e("5c6c"), t = e("fc6a"), u = e("c04e"), c = e("5135"), a = e("0cfb"), s = Object.getOwnPropertyDescriptor;
      f.f = n ? s : function(l, d) {
        if (l = t(l), d = u(d, !0), a) try {
          return s(l, d);
        } catch {
        }
        if (c(l, d)) return o(!r.f.call(l, d), l[d]);
      };
    }, "0a06": function(i, f, e) {
      var n = e("c532"), r = e("30b5"), o = e("f6b4"), t = e("5270"), u = e("4a7b");
      function c(a) {
        this.defaults = a, this.interceptors = { request: new o(), response: new o() };
      }
      c.prototype.request = function(a) {
        typeof a == "string" ? (a = arguments[1] || {}, a.url = arguments[0]) : a = a || {}, a = u(this.defaults, a), a.method ? a.method = a.method.toLowerCase() : this.defaults.method ? a.method = this.defaults.method.toLowerCase() : a.method = "get";
        var s = [t, void 0], l = Promise.resolve(a);
        for (this.interceptors.request.forEach(function(d) {
          s.unshift(d.fulfilled, d.rejected);
        }), this.interceptors.response.forEach(function(d) {
          s.push(d.fulfilled, d.rejected);
        }); s.length; ) l = l.then(s.shift(), s.shift());
        return l;
      }, c.prototype.getUri = function(a) {
        return a = u(this.defaults, a), r(a.url, a.params, a.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(a) {
        c.prototype[a] = function(s, l) {
          return this.request(u(l || {}, { method: a, url: s, data: (l || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(a) {
        c.prototype[a] = function(s, l, d) {
          return this.request(u(d || {}, { method: a, url: s, data: l }));
        };
      }), i.exports = c;
    }, "0cb2": function(i, f, e) {
      var n = e("7b0b"), r = Math.floor, o = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, u = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(c, a, s, l, d, m) {
        var p = s + c.length, v = l.length, h = u;
        return d !== void 0 && (d = n(d), h = t), o.call(m, h, function(b, g) {
          var j;
          switch (g.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return a.slice(0, s);
            case "'":
              return a.slice(p);
            case "<":
              j = d[g.slice(1, -1)];
              break;
            default:
              var E = +g;
              if (E === 0) return b;
              if (E > v) {
                var y = r(E / 10);
                return y === 0 ? b : y <= v ? l[y - 1] === void 0 ? g.charAt(1) : l[y - 1] + g.charAt(1) : b;
              }
              j = l[E - 1];
          }
          return j === void 0 ? "" : j;
        });
      };
    }, "0cfb": function(i, f, e) {
      var n = e("83ab"), r = e("d039"), o = e("cc12");
      i.exports = !n && !r(function() {
        return Object.defineProperty(o("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(i, f, e) {
      i.exports = function(n) {
        return function(r) {
          return n.apply(null, r);
        };
      };
    }, 1148: function(i, f, e) {
      var n = e("a691"), r = e("1d80");
      i.exports = "".repeat || function(o) {
        var t = String(r(this)), u = "", c = n(o);
        if (c < 0 || c == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; c > 0; (c >>>= 1) && (t += t)) 1 & c && (u += t);
        return u;
      };
    }, 1276: function(i, f, e) {
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), c = e("8aa5"), a = e("50c4"), s = e("14c3"), l = e("9263"), d = e("d039"), m = [].push, p = Math.min, v = 4294967295, h = !d(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(b, g, j) {
        var E;
        return E = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(y, k) {
          var w = String(t(this)), O = k === void 0 ? v : k >>> 0;
          if (O === 0) return [];
          if (y === void 0) return [w];
          if (!r(y)) return g.call(w, y, O);
          for (var _, C, S, U = [], T = (y.ignoreCase ? "i" : "") + (y.multiline ? "m" : "") + (y.unicode ? "u" : "") + (y.sticky ? "y" : ""), R = 0, Z = new RegExp(y.source, T + "g"); (_ = l.call(Z, w)) && (C = Z.lastIndex, !(C > R && (U.push(w.slice(R, _.index)), _.length > 1 && _.index < w.length && m.apply(U, _.slice(1)), S = _[0].length, R = C, U.length >= O))); )
            Z.lastIndex === _.index && Z.lastIndex++;
          return R === w.length ? !S && Z.test("") || U.push("") : U.push(w.slice(R)), U.length > O ? U.slice(0, O) : U;
        } : "0".split(void 0, 0).length ? function(y, k) {
          return y === void 0 && k === 0 ? [] : g.call(this, y, k);
        } : g, [function(y, k) {
          var w = t(this), O = y == null ? void 0 : y[b];
          return O !== void 0 ? O.call(y, w, k) : E.call(String(w), y, k);
        }, function(y, k) {
          var w = j(E, y, this, k, E !== g);
          if (w.done) return w.value;
          var O = o(y), _ = String(this), C = u(O, RegExp), S = O.unicode, U = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (h ? "y" : "g"), T = new C(h ? O : "^(?:" + O.source + ")", U), R = k === void 0 ? v : k >>> 0;
          if (R === 0) return [];
          if (_.length === 0) return s(T, _) === null ? [_] : [];
          for (var Z = 0, X = 0, ie = []; X < _.length; ) {
            T.lastIndex = h ? X : 0;
            var te, A = s(T, h ? _ : _.slice(X));
            if (A === null || (te = p(a(T.lastIndex + (h ? 0 : X)), _.length)) === Z) X = c(_, X, S);
            else {
              if (ie.push(_.slice(Z, X)), ie.length === R) return ie;
              for (var B = 1; B <= A.length - 1; B++) if (ie.push(A[B]), ie.length === R) return ie;
              X = Z = te;
            }
          }
          return ie.push(_.slice(Z)), ie;
        }];
      }, !h);
    }, "13d5": function(i, f, e) {
      var n = e("23e7"), r = e("d58f").left, o = e("a640"), t = e("2d00"), u = e("605d"), c = o("reduce"), a = !u && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !c || a }, { reduce: function(s) {
        return r(this, s, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(i, f, e) {
      var n = e("c6b6"), r = e("9263");
      i.exports = function(o, t) {
        var u = o.exec;
        if (typeof u == "function") {
          var c = u.call(o, t);
          if (typeof c != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return c;
        }
        if (n(o) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return r.call(o, t);
      };
    }, "159b": function(i, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("17c2"), t = e("9112");
      for (var u in r) {
        var c = n[u], a = c && c.prototype;
        if (a && a.forEach !== o) try {
          t(a, "forEach", o);
        } catch {
          a.forEach = o;
        }
      }
    }, "17c2": function(i, f, e) {
      var n = e("b727").forEach, r = e("a640"), o = r("forEach");
      i.exports = o ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(i, f) {
      i.exports = function(e, n, r) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
        return e;
      };
    }, "1be4": function(i, f, e) {
      var n = e("d066");
      i.exports = n("document", "documentElement");
    }, "1c0b": function(i, f) {
      i.exports = function(e) {
        if (typeof e != "function") throw TypeError(String(e) + " is not a function");
        return e;
      };
    }, "1c7e": function(i, f, e) {
      var n = e("b622"), r = n("iterator"), o = !1;
      try {
        var t = 0, u = { next: function() {
          return { done: !!t++ };
        }, return: function() {
          o = !0;
        } };
        u[r] = function() {
          return this;
        }, Array.from(u, function() {
          throw 2;
        });
      } catch {
      }
      i.exports = function(c, a) {
        if (!a && !o) return !1;
        var s = !1;
        try {
          var l = {};
          l[r] = function() {
            return { next: function() {
              return { done: s = !0 };
            } };
          }, c(l);
        } catch {
        }
        return s;
      };
    }, "1cdc": function(i, f, e) {
      var n = e("342f");
      i.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(i, f, e) {
      i.exports = function(n, r) {
        return function() {
          for (var o = new Array(arguments.length), t = 0; t < o.length; t++) o[t] = arguments[t];
          return n.apply(r, o);
        };
      };
    }, "1d80": function(i, f) {
      i.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(i, f, e) {
      var n = e("d039"), r = e("b622"), o = e("2d00"), t = r("species");
      i.exports = function(u) {
        return o >= 51 || !n(function() {
          var c = [], a = c.constructor = {};
          return a[t] = function() {
            return { foo: 1 };
          }, c[u](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(i, f, e) {
      (function(n) {
        (function(r, o) {
          i.exports = o();
        })(0, function() {
          function r($, D) {
            return D = { exports: {} }, $(D, D.exports), D.exports;
          }
          var o = r(function($, D) {
            (function(H, L) {
              $.exports = L();
            })(0, function() {
              function H(ue) {
                var we = ue && typeof ue == "object";
                return we && Object.prototype.toString.call(ue) !== "[object RegExp]" && Object.prototype.toString.call(ue) !== "[object Date]";
              }
              function L(ue) {
                return Array.isArray(ue) ? [] : {};
              }
              function P(ue, we) {
                var ke = we && we.clone === !0;
                return ke && H(ue) ? he(L(ue), ue, we) : ue;
              }
              function Q(ue, we, ke) {
                var Ie = ue.slice();
                return we.forEach(function(_e, We) {
                  typeof Ie[We] > "u" ? Ie[We] = P(_e, ke) : H(_e) ? Ie[We] = he(ue[We], _e, ke) : ue.indexOf(_e) === -1 && Ie.push(P(_e, ke));
                }), Ie;
              }
              function ge(ue, we, ke) {
                var Ie = {};
                return H(ue) && Object.keys(ue).forEach(function(_e) {
                  Ie[_e] = P(ue[_e], ke);
                }), Object.keys(we).forEach(function(_e) {
                  H(we[_e]) && ue[_e] ? Ie[_e] = he(ue[_e], we[_e], ke) : Ie[_e] = P(we[_e], ke);
                }), Ie;
              }
              function he(ue, we, ke) {
                var Ie = Array.isArray(we), _e = ke || { arrayMerge: Q }, We = _e.arrayMerge || Q;
                return Ie ? Array.isArray(ue) ? We(ue, we, ke) : P(we, ke) : ge(ue, we, ke);
              }
              return he.all = function(ue, we) {
                if (!Array.isArray(ue) || ue.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ue.reduce(function(ke, Ie) {
                  return he(ke, Ie, we);
                });
              }, he;
            });
          });
          function t($) {
            return $ = $ || /* @__PURE__ */ Object.create(null), { on: function(D, H) {
              ($[D] || ($[D] = [])).push(H);
            }, off: function(D, H) {
              $[D] && $[D].splice($[D].indexOf(H) >>> 0, 1);
            }, emit: function(D, H) {
              ($[D] || []).map(function(L) {
                L(H);
              }), ($["*"] || []).map(function(L) {
                L(D, H);
              });
            } };
          }
          var u = r(function($, D) {
            var H = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            D.default = H, $.exports = D.default;
          }), c = function($) {
            return Object.keys($).map(function(D) {
              var H = $[D].toString().replace(/"/g, "&quot;");
              return D + '="' + H + '"';
            }).join(" ");
          }, a = u.svg, s = u.xlink, l = {};
          l[a.name] = a.uri, l[s.name] = s.uri;
          var d, m = function($, D) {
            $ === void 0 && ($ = "");
            var H = o(l, D || {}), L = c(H);
            return "<svg " + L + ">" + $ + "</svg>";
          }, p = u.svg, v = u.xlink, h = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[p.name] = p.uri, d[v.name] = v.uri, d) }, b = function($) {
            this.config = o(h, $ || {}), this.symbols = [];
          };
          b.prototype.add = function($) {
            var D = this, H = D.symbols, L = this.find($.id);
            return L ? (H[H.indexOf(L)] = $, !1) : (H.push($), !0);
          }, b.prototype.remove = function($) {
            var D = this, H = D.symbols, L = this.find($);
            return !!L && (H.splice(H.indexOf(L), 1), L.destroy(), !0);
          }, b.prototype.find = function($) {
            return this.symbols.filter(function(D) {
              return D.id === $;
            })[0] || null;
          }, b.prototype.has = function($) {
            return this.find($) !== null;
          }, b.prototype.stringify = function() {
            var $ = this.config, D = $.attrs, H = this.symbols.map(function(L) {
              return L.stringify();
            }).join("");
            return m(H, D);
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            this.symbols.forEach(function($) {
              return $.destroy();
            });
          };
          var g = function($) {
            var D = $.id, H = $.viewBox, L = $.content;
            this.id = D, this.viewBox = H, this.content = L;
          };
          g.prototype.stringify = function() {
            return this.content;
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            var $ = this;
            ["id", "viewBox", "content"].forEach(function(D) {
              return delete $[D];
            });
          };
          var j = function($) {
            var D = !!document.importNode, H = new DOMParser().parseFromString($, "image/svg+xml").documentElement;
            return D ? document.importNode(H, !0) : H;
          }, E = function($) {
            function D() {
              $.apply(this, arguments);
            }
            $ && (D.__proto__ = $), D.prototype = Object.create($ && $.prototype), D.prototype.constructor = D;
            var H = { isMounted: {} };
            return H.isMounted.get = function() {
              return !!this.node;
            }, D.createFromExistingNode = function(L) {
              return new D({ id: L.getAttribute("id"), viewBox: L.getAttribute("viewBox"), content: L.outerHTML });
            }, D.prototype.destroy = function() {
              this.isMounted && this.unmount(), $.prototype.destroy.call(this);
            }, D.prototype.mount = function(L) {
              if (this.isMounted) return this.node;
              var P = typeof L == "string" ? document.querySelector(L) : L, Q = this.render();
              return this.node = Q, P.appendChild(Q), Q;
            }, D.prototype.render = function() {
              var L = this.stringify();
              return j(m(L)).childNodes[0];
            }, D.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(D.prototype, H), D;
          }(g), y = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, k = function($) {
            return Array.prototype.slice.call($, 0);
          }, w = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, O = function($, D) {
            var H = document.createEvent("CustomEvent");
            H.initCustomEvent($, !1, !1, D), window.dispatchEvent(H);
          }, _ = function($) {
            var D = [];
            return k($.querySelectorAll("style")).forEach(function(H) {
              H.textContent += "", D.push(H);
            }), D;
          }, C = function($) {
            return ($ || window.location.href).split("#")[0];
          }, S = function($) {
            angular.module("ng").run(["$rootScope", function(D) {
              D.$on("$locationChangeSuccess", function(H, L, P) {
                O($, { oldUrl: P, newUrl: L });
              });
            }]);
          }, U = "linearGradient, radialGradient, pattern, mask, clipPath", T = function($, D) {
            return D === void 0 && (D = U), k($.querySelectorAll("symbol")).forEach(function(H) {
              k(H.querySelectorAll(D)).forEach(function(L) {
                H.parentNode.insertBefore(L, H);
              });
            }), $;
          };
          function R($, D) {
            var H = k($).reduce(function(L, P) {
              if (!P.attributes) return L;
              var Q = k(P.attributes), ge = D ? Q.filter(D) : Q;
              return L.concat(ge);
            }, []);
            return H;
          }
          var Z = u.xlink.uri, X = "xlink:href", ie = /[{}|\\\^\[\]`"<>]/g;
          function te($) {
            return $.replace(ie, function(D) {
              return "%" + D[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function A($) {
            return $.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function B($, D, H) {
            return k($).forEach(function(L) {
              var P = L.getAttribute(X);
              if (P && P.indexOf(D) === 0) {
                var Q = P.replace(D, H);
                L.setAttributeNS(Z, X, Q);
              }
            }), $;
          }
          var K, G = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], V = G.map(function($) {
            return "[" + $ + "]";
          }).join(","), me = function($, D, H, L) {
            var P = te(H), Q = te(L), ge = $.querySelectorAll(V), he = R(ge, function(ue) {
              var we = ue.localName, ke = ue.value;
              return G.indexOf(we) !== -1 && ke.indexOf("url(" + P) !== -1;
            });
            he.forEach(function(ue) {
              return ue.value = ue.value.replace(new RegExp(A(P), "g"), Q);
            }), B(D, P, Q);
          }, fe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ee = function($) {
            function D(L) {
              var P = this;
              L === void 0 && (L = {}), $.call(this, o(y, L));
              var Q = t();
              this._emitter = Q, this.node = null;
              var ge = this, he = ge.config;
              if (he.autoConfigure && this._autoConfigure(L), he.syncUrlsWithBaseTag) {
                var ue = document.getElementsByTagName("base")[0].getAttribute("href");
                Q.on(fe.MOUNT, function() {
                  return P.updateUrls("#", ue);
                });
              }
              var we = this._handleLocationChange.bind(this);
              this._handleLocationChange = we, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, we), he.locationChangeAngularEmitter && S(he.locationChangeEvent), Q.on(fe.MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && T(ke);
              }), Q.on(fe.SYMBOL_MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && T(ke.parentNode), (w.isIE() || w.isEdge()) && _(ke);
              });
            }
            $ && (D.__proto__ = $), D.prototype = Object.create($ && $.prototype), D.prototype.constructor = D;
            var H = { isMounted: {} };
            return H.isMounted.get = function() {
              return !!this.node;
            }, D.prototype._autoConfigure = function(L) {
              var P = this, Q = P.config;
              typeof L.syncUrlsWithBaseTag > "u" && (Q.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof L.locationChangeAngularEmitter > "u" && (Q.locationChangeAngularEmitter = typeof window.angular < "u"), typeof L.moveGradientsOutsideSymbol > "u" && (Q.moveGradientsOutsideSymbol = w.isFirefox());
            }, D.prototype._handleLocationChange = function(L) {
              var P = L.detail, Q = P.oldUrl, ge = P.newUrl;
              this.updateUrls(Q, ge);
            }, D.prototype.add = function(L) {
              var P = this, Q = $.prototype.add.call(this, L);
              return this.isMounted && Q && (L.mount(P.node), this._emitter.emit(fe.SYMBOL_MOUNT, L.node)), Q;
            }, D.prototype.attach = function(L) {
              var P = this, Q = this;
              if (Q.isMounted) return Q.node;
              var ge = typeof L == "string" ? document.querySelector(L) : L;
              return Q.node = ge, this.symbols.forEach(function(he) {
                he.mount(Q.node), P._emitter.emit(fe.SYMBOL_MOUNT, he.node);
              }), k(ge.querySelectorAll("symbol")).forEach(function(he) {
                var ue = E.createFromExistingNode(he);
                ue.node = he, Q.add(ue);
              }), this._emitter.emit(fe.MOUNT, ge), ge;
            }, D.prototype.destroy = function() {
              var L = this, P = L.config, Q = L.symbols, ge = L._emitter;
              Q.forEach(function(he) {
                return he.destroy();
              }), ge.off("*"), window.removeEventListener(P.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, D.prototype.mount = function(L, P) {
              L === void 0 && (L = this.config.mountTo), P === void 0 && (P = !1);
              var Q = this;
              if (Q.isMounted) return Q.node;
              var ge = typeof L == "string" ? document.querySelector(L) : L, he = Q.render();
              return this.node = he, P && ge.childNodes[0] ? ge.insertBefore(he, ge.childNodes[0]) : ge.appendChild(he), this._emitter.emit(fe.MOUNT, he), he;
            }, D.prototype.render = function() {
              return j(this.stringify());
            }, D.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, D.prototype.updateUrls = function(L, P) {
              if (!this.isMounted) return !1;
              var Q = document.querySelectorAll(this.config.usagesToUpdate);
              return me(this.node, Q, C(L) + "#", C(P) + "#"), !0;
            }, Object.defineProperties(D.prototype, H), D;
          }(b), Le = r(function($) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(D, H) {
              $.exports = H();
            })(0, function() {
              var D, H = [], L = document, P = L.documentElement.doScroll, Q = "DOMContentLoaded", ge = (P ? /^loaded|^c/ : /^loaded|^i|^c/).test(L.readyState);
              return ge || L.addEventListener(Q, D = function() {
                for (L.removeEventListener(Q, D), ge = 1; D = H.shift(); ) D();
              }), function(he) {
                ge ? setTimeout(he, 0) : H.push(he);
              };
            });
          }), Pe = "__SVG_SPRITE_NODE__", je = "__SVG_SPRITE__", Se = !!window[je];
          Se ? K = window[je] : (K = new Ee({ attrs: { id: Pe, "aria-hidden": "true" } }), window[je] = K);
          var Fe = function() {
            var $ = document.getElementById(Pe);
            $ ? K.attach($) : K.mount(document.body, !0);
          };
          document.body ? Fe() : Le(Fe);
          var He = K;
          return He;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), c = e("2a62"), a = function(s, l) {
        this.stopped = s, this.result = l;
      };
      i.exports = function(s, l, d) {
        var m, p, v, h, b, g, j, E = d && d.that, y = !(!d || !d.AS_ENTRIES), k = !(!d || !d.IS_ITERATOR), w = !(!d || !d.INTERRUPTED), O = t(l, E, 1 + y + w), _ = function(S) {
          return m && c(m), new a(!0, S);
        }, C = function(S) {
          return y ? (n(S), w ? O(S[0], S[1], _) : O(S[0], S[1])) : w ? O(S, _) : O(S);
        };
        if (k) m = s;
        else {
          if (p = u(s), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, h = o(s.length); h > v; v++) if (b = C(s[v]), b && b instanceof a) return b;
            return new a(!1);
          }
          m = p.call(s);
        }
        for (g = m.next; !(j = g.call(m)).done; ) {
          try {
            b = C(j.value);
          } catch (S) {
            throw c(m), S;
          }
          if (typeof b == "object" && b && b instanceof a) return b;
        }
        return new a(!1);
      };
    }, "23cb": function(i, f, e) {
      var n = e("a691"), r = Math.max, o = Math.min;
      i.exports = function(t, u) {
        var c = n(t);
        return c < 0 ? r(c + u, 0) : o(c, u);
      };
    }, "23e7": function(i, f, e) {
      var n = e("da84"), r = e("06cf").f, o = e("9112"), t = e("6eeb"), u = e("ce4e"), c = e("e893"), a = e("94ca");
      i.exports = function(s, l) {
        var d, m, p, v, h, b, g = s.target, j = s.global, E = s.stat;
        if (m = j ? n : E ? n[g] || u(g, {}) : (n[g] || {}).prototype, m) for (p in l) {
          if (h = l[p], s.noTargetGet ? (b = r(m, p), v = b && b.value) : v = m[p], d = a(j ? p : g + (E ? "." : "#") + p, s.forced), !d && v !== void 0) {
            if (typeof h == typeof v) continue;
            c(h, v);
          }
          (s.sham || v && v.sham) && o(h, "sham", !0), t(m, p, h, s);
        }
      };
    }, "241c": function(i, f, e) {
      var n = e("ca84"), r = e("7839"), o = r.concat("length", "prototype");
      f.f = Object.getOwnPropertyNames || function(t) {
        return n(t, o);
      };
    }, 2444: function(i, f, e) {
      (function(n) {
        var r = e("c532"), o = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function u(s, l) {
          !r.isUndefined(s) && r.isUndefined(s["Content-Type"]) && (s["Content-Type"] = l);
        }
        function c() {
          var s;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (s = e("b50d")), s;
        }
        var a = { adapter: c(), transformRequest: [function(s, l) {
          return o(l, "Accept"), o(l, "Content-Type"), r.isFormData(s) || r.isArrayBuffer(s) || r.isBuffer(s) || r.isStream(s) || r.isFile(s) || r.isBlob(s) ? s : r.isArrayBufferView(s) ? s.buffer : r.isURLSearchParams(s) ? (u(l, "application/x-www-form-urlencoded;charset=utf-8"), s.toString()) : r.isObject(s) ? (u(l, "application/json;charset=utf-8"), JSON.stringify(s)) : s;
        }], transformResponse: [function(s) {
          if (typeof s == "string") try {
            s = JSON.parse(s);
          } catch {
          }
          return s;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(s) {
          return s >= 200 && s < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        r.forEach(["delete", "get", "head"], function(s) {
          a.headers[s] = {};
        }), r.forEach(["post", "put", "patch"], function(s) {
          a.headers[s] = r.merge(t);
        }), i.exports = a;
      }).call(this, e("4362"));
    }, 2532: function(i, f, e) {
      var n = e("23e7"), r = e("5a34"), o = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(u) {
        return !!~String(o(this)).indexOf(r(u), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, f, e) {
      var n = e("6eeb"), r = e("825a"), o = e("d039"), t = e("ad6d"), u = "toString", c = RegExp.prototype, a = c[u], s = o(function() {
        return a.call({ source: "a", flags: "b" }) != "/a/b";
      }), l = a.name != u;
      (s || l) && n(RegExp.prototype, u, function() {
        var d = r(this), m = String(d.source), p = d.flags, v = String(p === void 0 && d instanceof RegExp && !("flags" in c) ? t.call(d) : p);
        return "/" + m + "/" + v;
      }, { unsafe: !0 });
    }, 2626: function(i, f, e) {
      var n = e("d066"), r = e("9bf2"), o = e("b622"), t = e("83ab"), u = o("species");
      i.exports = function(c) {
        var a = n(c), s = r.f;
        t && a && !a[u] && s(a, u, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(i, f, e) {
      var n = e("825a");
      i.exports = function(r) {
        var o = r.return;
        if (o !== void 0) return n(o.call(r)).value;
      };
    }, "2cf4": function(i, f, e) {
      var n, r, o, t = e("da84"), u = e("d039"), c = e("0366"), a = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), m = t.location, p = t.setImmediate, v = t.clearImmediate, h = t.process, b = t.MessageChannel, g = t.Dispatch, j = 0, E = {}, y = "onreadystatechange", k = function(C) {
        if (E.hasOwnProperty(C)) {
          var S = E[C];
          delete E[C], S();
        }
      }, w = function(C) {
        return function() {
          k(C);
        };
      }, O = function(C) {
        k(C.data);
      }, _ = function(C) {
        t.postMessage(C + "", m.protocol + "//" + m.host);
      };
      p && v || (p = function(C) {
        for (var S = [], U = 1; arguments.length > U; ) S.push(arguments[U++]);
        return E[++j] = function() {
          (typeof C == "function" ? C : Function(C)).apply(void 0, S);
        }, n(j), j;
      }, v = function(C) {
        delete E[C];
      }, d ? n = function(C) {
        h.nextTick(w(C));
      } : g && g.now ? n = function(C) {
        g.now(w(C));
      } : b && !l ? (r = new b(), o = r.port2, r.port1.onmessage = O, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && m && m.protocol !== "file:" && !u(_) ? (n = _, t.addEventListener("message", O, !1)) : n = y in s("script") ? function(C) {
        a.appendChild(s("script"))[y] = function() {
          a.removeChild(this), k(C);
        };
      } : function(C) {
        setTimeout(w(C), 0);
      }), i.exports = { set: p, clear: v };
    }, "2d00": function(i, f, e) {
      var n, r, o = e("da84"), t = e("342f"), u = o.process, c = u && u.versions, a = c && c.v8;
      a ? (n = a.split("."), r = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (r = n[1]))), i.exports = r && +r;
    }, "2d83": function(i, f, e) {
      var n = e("387f");
      i.exports = function(r, o, t, u, c) {
        var a = new Error(r);
        return n(a, o, t, u, c);
      };
    }, "2e67": function(i, f, e) {
      i.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(i, f, e) {
      var n = e("c532");
      function r(o) {
        return encodeURIComponent(o).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      i.exports = function(o, t, u) {
        if (!t) return o;
        var c;
        if (u) c = u(t);
        else if (n.isURLSearchParams(t)) c = t.toString();
        else {
          var a = [];
          n.forEach(t, function(l, d) {
            l !== null && typeof l < "u" && (n.isArray(l) ? d += "[]" : l = [l], n.forEach(l, function(m) {
              n.isDate(m) ? m = m.toISOString() : n.isObject(m) && (m = JSON.stringify(m)), a.push(r(d) + "=" + r(m));
            }));
          }), c = a.join("&");
        }
        if (c) {
          var s = o.indexOf("#");
          s !== -1 && (o = o.slice(0, s)), o += (o.indexOf("?") === -1 ? "?" : "&") + c;
        }
        return o;
      };
    }, "342f": function(i, f, e) {
      var n = e("d066");
      i.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(i, f, e) {
      var n = e("f5df"), r = e("3f8c"), o = e("b622"), t = o("iterator");
      i.exports = function(u) {
        if (u != null) return u[t] || u["@@iterator"] || r[n(u)];
      };
    }, "37e8": function(i, f, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("825a"), t = e("df75");
      i.exports = n ? Object.defineProperties : function(u, c) {
        o(u);
        for (var a, s = t(c), l = s.length, d = 0; l > d; ) r.f(u, a = s[d++], c[a]);
        return u;
      };
    }, "387f": function(i, f, e) {
      i.exports = function(n, r, o, t, u) {
        return n.config = r, o && (n.code = o), n.request = t, n.response = u, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(i, f, e) {
      e("acce");
    }, 3934: function(i, f, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? function() {
        var r, o = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function u(c) {
          var a = c;
          return o && (t.setAttribute("href", a), a = t.href), t.setAttribute("href", a), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return r = u(window.location.href), function(c) {
          var a = n.isString(c) ? u(c) : c;
          return a.protocol === r.protocol && a.host === r.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(i, f, e) {
      var n = e("861d");
      i.exports = function(r) {
        if (!n(r) && r !== null) throw TypeError("Can't set " + String(r) + " as a prototype");
        return r;
      };
    }, "3ca3": function(i, f, e) {
      var n = e("6547").charAt, r = e("69f3"), o = e("7dd0"), t = "String Iterator", u = r.set, c = r.getterFor(t);
      o(String, "String", function(a) {
        u(this, { type: t, string: String(a), index: 0 });
      }, function() {
        var a, s = c(this), l = s.string, d = s.index;
        return d >= l.length ? { value: void 0, done: !0 } : (a = n(l, d), s.index += a.length, { value: a, done: !1 });
      });
    }, "3f8c": function(i, f) {
      i.exports = {};
    }, "408a": function(i, f, e) {
      var n = e("c6b6");
      i.exports = function(r) {
        if (typeof r != "number" && n(r) != "Number") throw TypeError("Incorrect invocation");
        return +r;
      };
    }, "428f": function(i, f, e) {
      var n = e("da84");
      i.exports = n;
    }, 4362: function(i, f, e) {
      f.nextTick = function(n) {
        var r = Array.prototype.slice.call(arguments);
        r.shift(), setTimeout(function() {
          n.apply(null, r);
        }, 0);
      }, f.platform = f.arch = f.execPath = f.title = "browser", f.pid = 1, f.browser = !0, f.env = {}, f.argv = [], f.binding = function(n) {
        throw new Error("No such module. (Possibly not yet loaded)");
      }, function() {
        var n, r = "/";
        f.cwd = function() {
          return r;
        }, f.chdir = function(o) {
          n || (n = e("df7c")), r = n.resolve(o, r);
        };
      }(), f.exit = f.kill = f.umask = f.dlopen = f.uptime = f.memoryUsage = f.uvCounters = function() {
      }, f.features = {};
    }, "44ad": function(i, f, e) {
      var n = e("d039"), r = e("c6b6"), o = "".split;
      i.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return r(t) == "String" ? o.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(i, f, e) {
      var n = e("b622"), r = e("7c73"), o = e("9bf2"), t = n("unscopables"), u = Array.prototype;
      u[t] == null && o.f(u, t, { configurable: !0, value: r(null) }), i.exports = function(c) {
        u[t][c] = !0;
      };
    }, "44de": function(i, f, e) {
      var n = e("da84");
      i.exports = function(r, o) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(r) : t.error(r, o));
      };
    }, "44e7": function(i, f, e) {
      var n = e("861d"), r = e("c6b6"), o = e("b622"), t = o("match");
      i.exports = function(u) {
        var c;
        return n(u) && ((c = u[t]) !== void 0 ? !!c : r(u) == "RegExp");
      };
    }, "466d": function(i, f, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("1d80"), u = e("8aa5"), c = e("14c3");
      n("match", 1, function(a, s, l) {
        return [function(d) {
          var m = t(this), p = d == null ? void 0 : d[a];
          return p !== void 0 ? p.call(d, m) : new RegExp(d)[a](String(m));
        }, function(d) {
          var m = l(s, d, this);
          if (m.done) return m.value;
          var p = r(d), v = String(this);
          if (!p.global) return c(p, v);
          var h = p.unicode;
          p.lastIndex = 0;
          for (var b, g = [], j = 0; (b = c(p, v)) !== null; ) {
            var E = String(b[0]);
            g[j] = E, E === "" && (p.lastIndex = u(v, o(p.lastIndex), h)), j++;
          }
          return j === 0 ? null : g;
        }];
      });
    }, "467f": function(i, f, e) {
      var n = e("2d83");
      i.exports = function(r, o, t) {
        var u = t.config.validateStatus;
        t.status && u && !u(t.status) ? o(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : r(t);
      };
    }, 4840: function(i, f, e) {
      var n = e("825a"), r = e("1c0b"), o = e("b622"), t = o("species");
      i.exports = function(u, c) {
        var a, s = n(u).constructor;
        return s === void 0 || (a = n(s)[t]) == null ? c : r(a);
      };
    }, 4930: function(i, f, e) {
      var n = e("605d"), r = e("2d00"), o = e("d039");
      i.exports = !!Object.getOwnPropertySymbols && !o(function() {
        return !Symbol.sham && (n ? r === 38 : r > 37 && r < 41);
      });
    }, "4a7b": function(i, f, e) {
      var n = e("c532");
      i.exports = function(r, o) {
        o = o || {};
        var t = {}, u = ["url", "method", "data"], c = ["headers", "auth", "proxy", "params"], a = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], s = ["validateStatus"];
        function l(v, h) {
          return n.isPlainObject(v) && n.isPlainObject(h) ? n.merge(v, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function d(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = l(void 0, r[v])) : t[v] = l(r[v], o[v]);
        }
        n.forEach(u, function(v) {
          n.isUndefined(o[v]) || (t[v] = l(void 0, o[v]));
        }), n.forEach(c, d), n.forEach(a, function(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = l(void 0, r[v])) : t[v] = l(void 0, o[v]);
        }), n.forEach(s, function(v) {
          v in o ? t[v] = l(r[v], o[v]) : v in r && (t[v] = l(void 0, r[v]));
        });
        var m = u.concat(c).concat(a).concat(s), p = Object.keys(r).concat(Object.keys(o)).filter(function(v) {
          return m.indexOf(v) === -1;
        });
        return n.forEach(p, d), t;
      };
    }, "4d63": function(i, f, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, c = e("241c").f, a = e("44e7"), s = e("ad6d"), l = e("9f7f"), d = e("6eeb"), m = e("d039"), p = e("69f3").set, v = e("2626"), h = e("b622"), b = h("match"), g = r.RegExp, j = g.prototype, E = /a/g, y = /a/g, k = new g(E) !== E, w = l.UNSUPPORTED_Y, O = n && o("RegExp", !k || w || m(function() {
        return y[b] = !1, g(E) != E || g(y) == y || g(E, "i") != "/a/i";
      }));
      if (O) {
        for (var _ = function(T, R) {
          var Z, X = this instanceof _, ie = a(T), te = R === void 0;
          if (!X && ie && T.constructor === _ && te) return T;
          k ? ie && !te && (T = T.source) : T instanceof _ && (te && (R = s.call(T)), T = T.source), w && (Z = !!R && R.indexOf("y") > -1, Z && (R = R.replace(/y/g, "")));
          var A = t(k ? new g(T, R) : g(T, R), X ? this : j, _);
          return w && Z && p(A, { sticky: Z }), A;
        }, C = function(T) {
          T in _ || u(_, T, { configurable: !0, get: function() {
            return g[T];
          }, set: function(R) {
            g[T] = R;
          } });
        }, S = c(g), U = 0; S.length > U; ) C(S[U++]);
        j.constructor = _, _.prototype = j, d(r, "RegExp", _);
      }
      v("RegExp");
    }, "4d64": function(i, f, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(c, a, s) {
          var l, d = n(c), m = r(d.length), p = o(s, m);
          if (u && a != a) {
            for (; m > p; ) if (l = d[p++], l != l) return !0;
          } else for (; m > p; p++) if ((u || p in d) && d[p] === a) return u || p || 0;
          return !u && -1;
        };
      };
      i.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(i, f, e) {
      var n = e("23e7"), r = e("b727").filter, o = e("1dde"), t = o("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(i, f, e) {
      var n = e("0366"), r = e("7b0b"), o = e("9bdd"), t = e("e95a"), u = e("50c4"), c = e("8418"), a = e("35a1");
      i.exports = function(s) {
        var l, d, m, p, v, h, b = r(s), g = typeof this == "function" ? this : Array, j = arguments.length, E = j > 1 ? arguments[1] : void 0, y = E !== void 0, k = a(b), w = 0;
        if (y && (E = n(E, j > 2 ? arguments[2] : void 0, 2)), k == null || g == Array && t(k)) for (l = u(b.length), d = new g(l); l > w; w++) h = y ? E(b[w], w) : b[w], c(d, w, h);
        else for (p = k.call(b), v = p.next, d = new g(); !(m = v.call(p)).done; w++) h = y ? o(p, E, [m.value, w], !0) : m.value, c(d, w, h);
        return d.length = w, d;
      };
    }, "4f43": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-close", use: "icon-close-usage", viewBox: "0 0 50 35.93", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35.93" id="icon-close">\r
	<defs>\r
		<style>\r
			#icon-close .cls-2,#icon-close .cls-3,#icon-close .cls-4{stroke-width:2px;}#icon-close .cls-3,#icon-close .cls-4{stroke-linecap:round;}#icon-close .cls-3{stroke-dasharray:3 4;}#icon-close .cls-5,#icon-close .cls-6{stroke-miterlimit:10;}#icon-close .cls-5{stroke-width:2.2px;}#icon-close .cls-6{stroke-width:3.39px;}\r
		</style>\r
	</defs>\r
	<g id="icon-close_图层_2" data-name="图层 2">\r
		<g id="icon-close_图层_1-2" data-name="图层 1">\r
			<g id="icon-close_组_98" data-name="组 98">\r
				<g id="icon-close_矩形_60" data-name="矩形 60">\r
					<rect class="cls-1" width="50" height="27" rx="5" />\r
					<rect class="cls-2" x="1" y="1" width="48" height="25" rx="4" />\r
				</g>\r
				<g id="icon-close_组_97" data-name="组 97">\r
					<path id="icon-close_路径_85" data-name="路径 85" class="cls-3" d="M9.5,8H40.18" />\r
					<path id="icon-close_路径_86" data-name="路径 86" class="cls-3" d="M9.5,13.5H40.18" />\r
					<path id="icon-close_路径_87" data-name="路径 87" class="cls-3" d="M9.5,19h3.17" />\r
					<path id="icon-close_路径_89" data-name="路径 89" class="cls-4" d="M16.5,19h17" />\r
					<path id="icon-close_路径_88" data-name="路径 88" class="cls-3" d="M37.5,19h2.68" />\r
				</g>\r
			</g>\r
			<path class="cls-5" d="M25.18,34.82l5.32-4.25a.07.07,0,0,0,0-.12H19.83a.07.07,0,0,0,0,.12l5.31,4.25A.06.06,0,0,0,25.18,34.82Z" />\r
			<circle class="cls-6" cx="25.14" cy="32.58" r="1" />\r
		</g>\r
	</g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, "50c4": function(i, f, e) {
      var n = e("a691"), r = Math.min;
      i.exports = function(o) {
        return o > 0 ? r(n(o), 9007199254740991) : 0;
      };
    }, 5135: function(i, f) {
      var e = {}.hasOwnProperty;
      i.exports = function(n, r) {
        return e.call(n, r);
      };
    }, 5270: function(i, f, e) {
      var n = e("c532"), r = e("c401"), o = e("2e67"), t = e("2444");
      function u(c) {
        c.cancelToken && c.cancelToken.throwIfRequested();
      }
      i.exports = function(c) {
        u(c), c.headers = c.headers || {}, c.data = r(c.data, c.headers, c.transformRequest), c.headers = n.merge(c.headers.common || {}, c.headers[c.method] || {}, c.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(s) {
          delete c.headers[s];
        });
        var a = c.adapter || t.adapter;
        return a(c).then(function(s) {
          return u(c), s.data = r(s.data, s.headers, c.transformResponse), s;
        }, function(s) {
          return o(s) || (u(c), s && s.response && (s.response.data = r(s.response.data, s.response.headers, c.transformResponse))), Promise.reject(s);
        });
      };
    }, 5319: function(i, f, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), c = e("8aa5"), a = e("0cb2"), s = e("14c3"), l = Math.max, d = Math.min, m = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, v, h, b) {
        var g = b.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, j = b.REPLACE_KEEPS_$0, E = g ? "$" : "$0";
        return [function(y, k) {
          var w = u(this), O = y == null ? void 0 : y[p];
          return O !== void 0 ? O.call(y, w, k) : v.call(String(w), y, k);
        }, function(y, k) {
          if (!g && j || typeof k == "string" && k.indexOf(E) === -1) {
            var w = h(v, y, this, k);
            if (w.done) return w.value;
          }
          var O = r(y), _ = String(this), C = typeof k == "function";
          C || (k = String(k));
          var S = O.global;
          if (S) {
            var U = O.unicode;
            O.lastIndex = 0;
          }
          for (var T = []; ; ) {
            var R = s(O, _);
            if (R === null || (T.push(R), !S)) break;
            var Z = String(R[0]);
            Z === "" && (O.lastIndex = c(_, o(O.lastIndex), U));
          }
          for (var X = "", ie = 0, te = 0; te < T.length; te++) {
            R = T[te];
            for (var A = String(R[0]), B = l(d(t(R.index), _.length), 0), K = [], G = 1; G < R.length; G++) K.push(m(R[G]));
            var V = R.groups;
            if (C) {
              var me = [A].concat(K, B, _);
              V !== void 0 && me.push(V);
              var fe = String(k.apply(void 0, me));
            } else fe = a(A, _, B, K, V, k);
            B >= ie && (X += _.slice(ie, B) + fe, ie = B + A.length);
          }
          return X + _.slice(ie);
        }];
      });
    }, "545a": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, 5530: function(i, f, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, r) {
        var o = n.document, t = o.documentElement, u = o.querySelector('meta[name="viewport"]'), c = o.querySelector('meta[name="flexible"]'), a = 0, s = 0, l = r.flexible || (r.flexible = {});
        if (u) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var d = u.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          d && (s = parseFloat(d[1]), a = parseInt(1 / s));
        } else if (c) {
          var m = c.getAttribute("content");
          if (m) {
            var p = m.match(/initial\-dpr=([\d\.]+)/), v = m.match(/maximum\-dpr=([\d\.]+)/);
            p && (a = parseFloat(p[1]), s = parseFloat((1 / a).toFixed(2))), v && (a = parseFloat(v[1]), s = parseFloat((1 / a).toFixed(2)));
          }
        }
        if (!a && !s) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), b = n.devicePixelRatio;
          a = h ? b >= 3 && (!a || a >= 3) ? 3 : b >= 2 && (!a || a >= 2) ? 2 : 1 : 1, s = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var g = o.createElement("div");
          g.appendChild(u), o.write(g.innerHTML);
        }
        function j() {
          var E = t.getBoundingClientRect().width, y = E / 10;
          t.style.fontSize = y + "px", l.rem = n.rem = y;
        }
        n.addEventListener("resize", function() {
          j();
        }, !1), n.addEventListener("pageshow", function(E) {
          E.persisted && j();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * a + "px" : o.addEventListener("DOMContentLoaded", function(E) {
          o.body.style.fontSize = 10 * a + "px";
        }, !1), j(), l.dpr = n.dpr = a, l.refreshRem = j, l.rem2px = function(E) {
          var y = parseFloat(E) * this.rem;
          return typeof E == "string" && E.match(/rem$/) && (y += "px"), y;
        }, l.px2rem = function(E) {
          var y = parseFloat(E) / this.rem;
          return typeof E == "string" && E.match(/px$/) && (y += "rem"), y;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(i, f, e) {
      var n = e("c430"), r = e("c6cd");
      (i.exports = function(o, t) {
        return r[o] || (r[o] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(i, f, e) {
      var n = e("d066"), r = e("241c"), o = e("7418"), t = e("825a");
      i.exports = n("Reflect", "ownKeys") || function(u) {
        var c = r.f(t(u)), a = o.f;
        return a ? c.concat(a(u)) : c;
      };
    }, "5a34": function(i, f, e) {
      var n = e("44e7");
      i.exports = function(r) {
        if (n(r)) throw TypeError("The method doesn't accept regular expressions");
        return r;
      };
    }, "5c6c": function(i, f) {
      i.exports = function(e, n) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n };
      };
    }, "5f02": function(i, f, e) {
      i.exports = function(n) {
        return typeof n == "object" && n.isAxiosError === !0;
      };
    }, "605d": function(i, f, e) {
      var n = e("c6b6"), r = e("da84");
      i.exports = n(r.process) == "process";
    }, 6062: function(i, f, e) {
      var n = e("6d61"), r = e("6566");
      i.exports = n("Set", function(o) {
        return function() {
          return o(this, arguments.length ? arguments[0] : void 0);
        };
      }, r);
    }, 6547: function(i, f, e) {
      var n = e("a691"), r = e("1d80"), o = function(t) {
        return function(u, c) {
          var a, s, l = String(r(u)), d = n(c), m = l.length;
          return d < 0 || d >= m ? t ? "" : void 0 : (a = l.charCodeAt(d), a < 55296 || a > 56319 || d + 1 === m || (s = l.charCodeAt(d + 1)) < 56320 || s > 57343 ? t ? l.charAt(d) : a : t ? l.slice(d, d + 2) : s - 56320 + (a - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(i, f, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), c = e("2266"), a = e("7dd0"), s = e("2626"), l = e("83ab"), d = e("f183").fastKey, m = e("69f3"), p = m.set, v = m.getterFor;
      i.exports = { getConstructor: function(h, b, g, j) {
        var E = h(function(O, _) {
          u(O, E, b), p(O, { type: b, index: r(null), first: void 0, last: void 0, size: 0 }), l || (O.size = 0), _ != null && c(_, O[j], { that: O, AS_ENTRIES: g });
        }), y = v(b), k = function(O, _, C) {
          var S, U, T = y(O), R = w(O, _);
          return R ? R.value = C : (T.last = R = { index: U = d(_, !0), key: _, value: C, previous: S = T.last, next: void 0, removed: !1 }, T.first || (T.first = R), S && (S.next = R), l ? T.size++ : O.size++, U !== "F" && (T.index[U] = R)), O;
        }, w = function(O, _) {
          var C, S = y(O), U = d(_);
          if (U !== "F") return S.index[U];
          for (C = S.first; C; C = C.next) if (C.key == _) return C;
        };
        return o(E.prototype, { clear: function() {
          for (var O = this, _ = y(O), C = _.index, S = _.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete C[S.index], S = S.next;
          _.first = _.last = void 0, l ? _.size = 0 : O.size = 0;
        }, delete: function(O) {
          var _ = this, C = y(_), S = w(_, O);
          if (S) {
            var U = S.next, T = S.previous;
            delete C.index[S.index], S.removed = !0, T && (T.next = U), U && (U.previous = T), C.first == S && (C.first = U), C.last == S && (C.last = T), l ? C.size-- : _.size--;
          }
          return !!S;
        }, forEach: function(O) {
          for (var _, C = y(this), S = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); _ = _ ? _.next : C.first; )
            for (S(_.value, _.key, this); _ && _.removed; ) _ = _.previous;
        }, has: function(O) {
          return !!w(this, O);
        } }), o(E.prototype, g ? { get: function(O) {
          var _ = w(this, O);
          return _ && _.value;
        }, set: function(O, _) {
          return k(this, O === 0 ? 0 : O, _);
        } } : { add: function(O) {
          return k(this, O = O === 0 ? 0 : O, O);
        } }), l && n(E.prototype, "size", { get: function() {
          return y(this).size;
        } }), E;
      }, setStrong: function(h, b, g) {
        var j = b + " Iterator", E = v(b), y = v(j);
        a(h, b, function(k, w) {
          p(this, { type: j, target: k, state: E(k), kind: w, last: void 0 });
        }, function() {
          for (var k = y(this), w = k.kind, O = k.last; O && O.removed; ) O = O.previous;
          return k.target && (k.last = O = O ? O.next : k.state.first) ? w == "keys" ? { value: O.key, done: !1 } : w == "values" ? { value: O.value, done: !1 } : { value: [O.key, O.value], done: !1 } : (k.target = void 0, { value: void 0, done: !0 });
        }, g ? "entries" : "values", !g, !0), s(b);
      } };
    }, "65f0": function(i, f, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      i.exports = function(u, c) {
        var a;
        return r(u) && (a = u.constructor, typeof a != "function" || a !== Array && !r(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(c === 0 ? 0 : c);
      };
    }, "69f3": function(i, f, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), c = e("861d"), a = e("9112"), s = e("5135"), l = e("c6cd"), d = e("f772"), m = e("d012"), p = u.WeakMap, v = function(k) {
        return o(k) ? r(k) : n(k, {});
      }, h = function(k) {
        return function(w) {
          var O;
          if (!c(w) || (O = r(w)).type !== k) throw TypeError("Incompatible receiver, " + k + " required");
          return O;
        };
      };
      if (t) {
        var b = l.state || (l.state = new p()), g = b.get, j = b.has, E = b.set;
        n = function(k, w) {
          return w.facade = k, E.call(b, k, w), w;
        }, r = function(k) {
          return g.call(b, k) || {};
        }, o = function(k) {
          return j.call(b, k);
        };
      } else {
        var y = d("state");
        m[y] = !0, n = function(k, w) {
          return w.facade = k, a(k, y, w), w;
        }, r = function(k) {
          return s(k, y) ? k[y] : {};
        }, o = function(k) {
          return s(k, y);
        };
      }
      i.exports = { set: n, get: r, has: o, enforce: v, getterFor: h };
    }, "6d55": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, "6d61": function(i, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), c = e("2266"), a = e("19aa"), s = e("861d"), l = e("d039"), d = e("1c7e"), m = e("d44e"), p = e("7156");
      i.exports = function(v, h, b) {
        var g = v.indexOf("Map") !== -1, j = v.indexOf("Weak") !== -1, E = g ? "set" : "add", y = r[v], k = y && y.prototype, w = y, O = {}, _ = function(X) {
          var ie = k[X];
          t(k, X, X == "add" ? function(te) {
            return ie.call(this, te === 0 ? 0 : te), this;
          } : X == "delete" ? function(te) {
            return !(j && !s(te)) && ie.call(this, te === 0 ? 0 : te);
          } : X == "get" ? function(te) {
            return j && !s(te) ? void 0 : ie.call(this, te === 0 ? 0 : te);
          } : X == "has" ? function(te) {
            return !(j && !s(te)) && ie.call(this, te === 0 ? 0 : te);
          } : function(te, A) {
            return ie.call(this, te === 0 ? 0 : te, A), this;
          });
        }, C = o(v, typeof y != "function" || !(j || k.forEach && !l(function() {
          new y().entries().next();
        })));
        if (C) w = b.getConstructor(h, v, g, E), u.REQUIRED = !0;
        else if (o(v, !0)) {
          var S = new w(), U = S[E](j ? {} : -0, 1) != S, T = l(function() {
            S.has(1);
          }), R = d(function(X) {
            new y(X);
          }), Z = !j && l(function() {
            for (var X = new y(), ie = 5; ie--; ) X[E](ie, ie);
            return !X.has(-0);
          });
          R || (w = h(function(X, ie) {
            a(X, w, v);
            var te = p(new y(), X, w);
            return ie != null && c(ie, te[E], { that: te, AS_ENTRIES: g }), te;
          }), w.prototype = k, k.constructor = w), (T || Z) && (_("delete"), _("has"), g && _("get")), (Z || U) && _(E), j && k.clear && delete k.clear;
        }
        return O[v] = w, n({ global: !0, forced: w != y }, O), m(w, v), j || b.setStrong(w, v, g), w;
      };
    }, "6eeb": function(i, f, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), c = e("69f3"), a = c.get, s = c.enforce, l = String(String).split("String");
      (i.exports = function(d, m, p, v) {
        var h, b = !!v && !!v.unsafe, g = !!v && !!v.enumerable, j = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof m != "string" || o(p, "name") || r(p, "name", m), h = s(p), h.source || (h.source = l.join(typeof m == "string" ? m : ""))), d !== n ? (b ? !j && d[m] && (g = !0) : delete d[m], g ? d[m] = p : r(d, m, p)) : g ? d[m] = p : t(m, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && a(this).source || u(this);
      });
    }, "70d3": function(i, f, e) {
    }, 7156: function(i, f, e) {
      var n = e("861d"), r = e("d2bb");
      i.exports = function(o, t, u) {
        var c, a;
        return r && typeof (c = t.constructor) == "function" && c !== u && n(a = c.prototype) && a !== u.prototype && r(o, a), o;
      };
    }, 7305: function(i, f, e) {
    }, 7320: function(i, f, e) {
    }, 7418: function(i, f) {
      f.f = Object.getOwnPropertySymbols;
    }, "746f": function(i, f, e) {
      var n = e("428f"), r = e("5135"), o = e("e538"), t = e("9bf2").f;
      i.exports = function(u) {
        var c = n.Symbol || (n.Symbol = {});
        r(c, u) || t(c, u, { value: o.f(u) });
      };
    }, 7839: function(i, f) {
      i.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(i, f, e) {
      function n(r) {
        this.message = r;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, i.exports = n;
    }, "7aac": function(i, f, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(r, o, t, u, c, a) {
          var s = [];
          s.push(r + "=" + encodeURIComponent(o)), n.isNumber(t) && s.push("expires=" + new Date(t).toGMTString()), n.isString(u) && s.push("path=" + u), n.isString(c) && s.push("domain=" + c), a === !0 && s.push("secure"), document.cookie = s.join("; ");
        }, read: function(r) {
          var o = document.cookie.match(new RegExp("(^|;\\s*)(" + r + ")=([^;]*)"));
          return o ? decodeURIComponent(o[3]) : null;
        }, remove: function(r) {
          this.write(r, "", Date.now() - 864e5);
        } };
      }() : /* @__PURE__ */ function() {
        return { write: function() {
        }, read: function() {
          return null;
        }, remove: function() {
        } };
      }();
    }, "7b0b": function(i, f, e) {
      var n = e("1d80");
      i.exports = function(r) {
        return Object(n(r));
      };
    }, "7c73": function(i, f, e) {
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), c = e("1be4"), a = e("cc12"), s = e("f772"), l = ">", d = "<", m = "prototype", p = "script", v = s("IE_PROTO"), h = function() {
      }, b = function(y) {
        return d + p + l + y + d + "/" + p + l;
      }, g = function(y) {
        y.write(b("")), y.close();
        var k = y.parentWindow.Object;
        return y = null, k;
      }, j = function() {
        var y, k = a("iframe"), w = "java" + p + ":";
        return k.style.display = "none", c.appendChild(k), k.src = String(w), y = k.contentWindow.document, y.open(), y.write(b("document.F=Object")), y.close(), y.F;
      }, E = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        E = n ? g(n) : j();
        for (var y = t.length; y--; ) delete E[m][t[y]];
        return E();
      };
      u[v] = !0, i.exports = Object.create || function(y, k) {
        var w;
        return y !== null ? (h[m] = r(y), w = new h(), h[m] = null, w[v] = y) : w = E(), k === void 0 ? w : o(w, k);
      };
    }, "7db0": function(i, f, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(i, f, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), c = e("9112"), a = e("6eeb"), s = e("b622"), l = e("c430"), d = e("3f8c"), m = e("ae93"), p = m.IteratorPrototype, v = m.BUGGY_SAFARI_ITERATORS, h = s("iterator"), b = "keys", g = "values", j = "entries", E = function() {
        return this;
      };
      i.exports = function(y, k, w, O, _, C, S) {
        r(w, k, O);
        var U, T, R, Z = function(G) {
          if (G === _ && B) return B;
          if (!v && G in te) return te[G];
          switch (G) {
            case b:
              return function() {
                return new w(this, G);
              };
            case g:
              return function() {
                return new w(this, G);
              };
            case j:
              return function() {
                return new w(this, G);
              };
          }
          return function() {
            return new w(this);
          };
        }, X = k + " Iterator", ie = !1, te = y.prototype, A = te[h] || te["@@iterator"] || _ && te[_], B = !v && A || Z(_), K = k == "Array" && te.entries || A;
        if (K && (U = o(K.call(new y())), p !== Object.prototype && U.next && (l || o(U) === p || (t ? t(U, p) : typeof U[h] != "function" && c(U, h, E)), u(U, X, !0, !0), l && (d[X] = E))), _ == g && A && A.name !== g && (ie = !0, B = function() {
          return A.call(this);
        }), l && !S || te[h] === B || c(te, h, B), d[k] = B, _) if (T = { values: Z(g), keys: C ? B : Z(b), entries: Z(j) }, S) for (R in T) (v || ie || !(R in te)) && a(te, R, T[R]);
        else n({ target: k, proto: !0, forced: v || ie }, T);
        return T;
      };
    }, "7eb5": function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-drag", use: "icon-drag-usage", viewBox: "0 0 28 29.526", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 29.526" id="icon-drag">\r
  <g id="icon-drag_drag" transform="translate(-1623.5 -915.5)">\r
    <line id="icon-drag_直线_5" data-name="直线 5" y2="22.015" transform="translate(1637.049 919.566)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <line id="icon-drag_直线_6" data-name="直线 6" x1="22.015" transform="translate(1626.041 930.574)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <path id="icon-drag_路径_15" data-name="路径 15" d="M728.456,559.625l3.888-3.887,3.885,3.885" transform="translate(904.603 361.262)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_16" data-name="路径 16" d="M736.229,568.465l-3.888,3.888-3.885-3.885" transform="translate(904.603 371.172)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_17" data-name="路径 17" d="M735.8,561.184l3.888,3.888-3.885,3.885" transform="translate(910.317 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_18" data-name="路径 18" d="M727.813,568.957l-3.888-3.888,3.885-3.885" transform="translate(901.075 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
  </g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, "7f9a": function(i, f, e) {
      var n = e("da84"), r = e("8925"), o = n.WeakMap;
      i.exports = typeof o == "function" && /native code/.test(r(o));
    }, "825a": function(i, f, e) {
      var n = e("861d");
      i.exports = function(r) {
        if (!n(r)) throw TypeError(String(r) + " is not an object");
        return r;
      };
    }, "83ab": function(i, f, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(i, f, e) {
      var n = e("d925"), r = e("e683");
      i.exports = function(o, t) {
        return o && !n(t) ? r(o, t) : t;
      };
    }, 8418: function(i, f, e) {
      var n = e("c04e"), r = e("9bf2"), o = e("5c6c");
      i.exports = function(t, u, c) {
        var a = n(u);
        a in t ? r.f(t, a, o(0, c)) : t[a] = c;
      };
    }, "861d": function(i, f) {
      i.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(i, f, e) {
      var n, r, o;
      (function(t, u) {
        r = [], n = u, o = typeof n == "function" ? n.apply(f, r) : n, o === void 0 || (i.exports = o);
      })(typeof self < "u" && self, function() {
        function t() {
          var u = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!u && "currentScript" in document && document.currentScript || u && u.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (j) {
            var c, a, s, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, d = /@([^@]*):(\d+):(\d+)\s*$/gi, m = l.exec(j.stack) || d.exec(j.stack), p = m && m[1] || !1, v = m && m[2] || !1, h = document.location.href.replace(document.location.hash, ""), b = document.getElementsByTagName("script");
            p === h && (c = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), s = c.replace(a, "$1").trim());
            for (var g = 0; g < b.length; g++)
              if (b[g].readyState === "interactive" || b[g].src === p || p === h && b[g].innerHTML && b[g].innerHTML.trim() === s) return b[g];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(i, f, e) {
      var n = e("c6cd"), r = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(o) {
        return r.call(o);
      }), i.exports = n.inspectSource;
    }, "8aa5": function(i, f, e) {
      var n = e("6547").charAt;
      i.exports = function(r, o, t) {
        return o + (t ? n(r, o).length : 1);
      };
    }, "8bbf": function(i, f) {
      i.exports = ee;
    }, "8df4": function(i, f, e) {
      var n = e("7a77");
      function r(o) {
        if (typeof o != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(c) {
          t = c;
        });
        var u = this;
        o(function(c) {
          u.reason || (u.reason = new n(c), t(u.reason));
        });
      }
      r.prototype.throwIfRequested = function() {
        if (this.reason) throw this.reason;
      }, r.source = function() {
        var o, t = new r(function(u) {
          o = u;
        });
        return { token: t, cancel: o };
      }, i.exports = r;
    }, "90e3": function(i, f) {
      var e = 0, n = Math.random();
      i.exports = function(r) {
        return "Symbol(" + String(r === void 0 ? "" : r) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(i, f, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("5c6c");
      i.exports = n ? function(t, u, c) {
        return r.f(t, u, o(1, c));
      } : function(t, u, c) {
        return t[u] = c, t;
      };
    }, 9263: function(i, f, e) {
      var n = e("ad6d"), r = e("9f7f"), o = RegExp.prototype.exec, t = String.prototype.replace, u = o, c = function() {
        var d = /a/, m = /b*/g;
        return o.call(d, "a"), o.call(m, "a"), d.lastIndex !== 0 || m.lastIndex !== 0;
      }(), a = r.UNSUPPORTED_Y || r.BROKEN_CARET, s = /()??/.exec("")[1] !== void 0, l = c || s || a;
      l && (u = function(d) {
        var m, p, v, h, b = this, g = a && b.sticky, j = n.call(b), E = b.source, y = 0, k = d;
        return g && (j = j.replace("y", ""), j.indexOf("g") === -1 && (j += "g"), k = String(d).slice(b.lastIndex), b.lastIndex > 0 && (!b.multiline || b.multiline && d[b.lastIndex - 1] !== `
`) && (E = "(?: " + E + ")", k = " " + k, y++), p = new RegExp("^(?:" + E + ")", j)), s && (p = new RegExp("^" + E + "$(?!\\s)", j)), c && (m = b.lastIndex), v = o.call(g ? p : b, k), g ? v ? (v.input = v.input.slice(y), v[0] = v[0].slice(y), v.index = b.lastIndex, b.lastIndex += v[0].length) : b.lastIndex = 0 : c && v && (b.lastIndex = b.global ? v.index + v[0].length : m), s && v && v.length > 1 && t.call(v[0], p, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (v[h] = void 0);
        }), v;
      }), i.exports = u;
    }, "94ca": function(i, f, e) {
      var n = e("d039"), r = /#|\.prototype\./, o = function(s, l) {
        var d = u[t(s)];
        return d == a || d != c && (typeof l == "function" ? n(l) : !!l);
      }, t = o.normalize = function(s) {
        return String(s).replace(r, ".").toLowerCase();
      }, u = o.data = {}, c = o.NATIVE = "N", a = o.POLYFILL = "P";
      i.exports = o;
    }, "95d9": function(i, f, e) {
    }, "96cf": function(i, f) {
      (function(e) {
        var n, r = Object.prototype, o = r.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, u = t.iterator || "@@iterator", c = t.asyncIterator || "@@asyncIterator", a = t.toStringTag || "@@toStringTag", s = typeof i == "object", l = e.regeneratorRuntime;
        if (l) s && (i.exports = l);
        else {
          l = e.regeneratorRuntime = s ? i.exports : {}, l.wrap = y;
          var d = "suspendedStart", m = "suspendedYield", p = "executing", v = "completed", h = {}, b = {};
          b[u] = function() {
            return this;
          };
          var g = Object.getPrototypeOf, j = g && g(g(ie([])));
          j && j !== r && o.call(j, u) && (b = j);
          var E = _.prototype = w.prototype = Object.create(b);
          O.prototype = E.constructor = _, _.constructor = O, _[a] = O.displayName = "GeneratorFunction", l.isGeneratorFunction = function(A) {
            var B = typeof A == "function" && A.constructor;
            return !!B && (B === O || (B.displayName || B.name) === "GeneratorFunction");
          }, l.mark = function(A) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(A, _) : (A.__proto__ = _, a in A || (A[a] = "GeneratorFunction")), A.prototype = Object.create(E), A;
          }, l.awrap = function(A) {
            return { __await: A };
          }, C(S.prototype), S.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = S, l.async = function(A, B, K, G) {
            var V = new S(y(A, B, K, G));
            return l.isGeneratorFunction(B) ? V : V.next().then(function(me) {
              return me.done ? me.value : V.next();
            });
          }, C(E), E[a] = "Generator", E[u] = function() {
            return this;
          }, E.toString = function() {
            return "[object Generator]";
          }, l.keys = function(A) {
            var B = [];
            for (var K in A) B.push(K);
            return B.reverse(), function G() {
              for (; B.length; ) {
                var V = B.pop();
                if (V in A) return G.value = V, G.done = !1, G;
              }
              return G.done = !0, G;
            };
          }, l.values = ie, X.prototype = { constructor: X, reset: function(A) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(Z), !A) for (var B in this) B.charAt(0) === "t" && o.call(this, B) && !isNaN(+B.slice(1)) && (this[B] = n);
          }, stop: function() {
            this.done = !0;
            var A = this.tryEntries[0], B = A.completion;
            if (B.type === "throw") throw B.arg;
            return this.rval;
          }, dispatchException: function(A) {
            if (this.done) throw A;
            var B = this;
            function K(Le, Pe) {
              return me.type = "throw", me.arg = A, B.next = Le, Pe && (B.method = "next", B.arg = n), !!Pe;
            }
            for (var G = this.tryEntries.length - 1; G >= 0; --G) {
              var V = this.tryEntries[G], me = V.completion;
              if (V.tryLoc === "root") return K("end");
              if (V.tryLoc <= this.prev) {
                var fe = o.call(V, "catchLoc"), Ee = o.call(V, "finallyLoc");
                if (fe && Ee) {
                  if (this.prev < V.catchLoc) return K(V.catchLoc, !0);
                  if (this.prev < V.finallyLoc) return K(V.finallyLoc);
                } else if (fe) {
                  if (this.prev < V.catchLoc) return K(V.catchLoc, !0);
                } else {
                  if (!Ee) throw new Error("try statement without catch or finally");
                  if (this.prev < V.finallyLoc) return K(V.finallyLoc);
                }
              }
            }
          }, abrupt: function(A, B) {
            for (var K = this.tryEntries.length - 1; K >= 0; --K) {
              var G = this.tryEntries[K];
              if (G.tryLoc <= this.prev && o.call(G, "finallyLoc") && this.prev < G.finallyLoc) {
                var V = G;
                break;
              }
            }
            V && (A === "break" || A === "continue") && V.tryLoc <= B && B <= V.finallyLoc && (V = null);
            var me = V ? V.completion : {};
            return me.type = A, me.arg = B, V ? (this.method = "next", this.next = V.finallyLoc, h) : this.complete(me);
          }, complete: function(A, B) {
            if (A.type === "throw") throw A.arg;
            return A.type === "break" || A.type === "continue" ? this.next = A.arg : A.type === "return" ? (this.rval = this.arg = A.arg, this.method = "return", this.next = "end") : A.type === "normal" && B && (this.next = B), h;
          }, finish: function(A) {
            for (var B = this.tryEntries.length - 1; B >= 0; --B) {
              var K = this.tryEntries[B];
              if (K.finallyLoc === A) return this.complete(K.completion, K.afterLoc), Z(K), h;
            }
          }, catch: function(A) {
            for (var B = this.tryEntries.length - 1; B >= 0; --B) {
              var K = this.tryEntries[B];
              if (K.tryLoc === A) {
                var G = K.completion;
                if (G.type === "throw") {
                  var V = G.arg;
                  Z(K);
                }
                return V;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(A, B, K) {
            return this.delegate = { iterator: ie(A), resultName: B, nextLoc: K }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function y(A, B, K, G) {
          var V = B && B.prototype instanceof w ? B : w, me = Object.create(V.prototype), fe = new X(G || []);
          return me._invoke = U(A, K, fe), me;
        }
        function k(A, B, K) {
          try {
            return { type: "normal", arg: A.call(B, K) };
          } catch (G) {
            return { type: "throw", arg: G };
          }
        }
        function w() {
        }
        function O() {
        }
        function _() {
        }
        function C(A) {
          ["next", "throw", "return"].forEach(function(B) {
            A[B] = function(K) {
              return this._invoke(B, K);
            };
          });
        }
        function S(A) {
          function B(V, me, fe, Ee) {
            var Le = k(A[V], A, me);
            if (Le.type !== "throw") {
              var Pe = Le.arg, je = Pe.value;
              return je && typeof je == "object" && o.call(je, "__await") ? Promise.resolve(je.__await).then(function(Se) {
                B("next", Se, fe, Ee);
              }, function(Se) {
                B("throw", Se, fe, Ee);
              }) : Promise.resolve(je).then(function(Se) {
                Pe.value = Se, fe(Pe);
              }, Ee);
            }
            Ee(Le.arg);
          }
          var K;
          function G(V, me) {
            function fe() {
              return new Promise(function(Ee, Le) {
                B(V, me, Ee, Le);
              });
            }
            return K = K ? K.then(fe, fe) : fe();
          }
          this._invoke = G;
        }
        function U(A, B, K) {
          var G = d;
          return function(V, me) {
            if (G === p) throw new Error("Generator is already running");
            if (G === v) {
              if (V === "throw") throw me;
              return te();
            }
            for (K.method = V, K.arg = me; ; ) {
              var fe = K.delegate;
              if (fe) {
                var Ee = T(fe, K);
                if (Ee) {
                  if (Ee === h) continue;
                  return Ee;
                }
              }
              if (K.method === "next") K.sent = K._sent = K.arg;
              else if (K.method === "throw") {
                if (G === d) throw G = v, K.arg;
                K.dispatchException(K.arg);
              } else K.method === "return" && K.abrupt("return", K.arg);
              G = p;
              var Le = k(A, B, K);
              if (Le.type === "normal") {
                if (G = K.done ? v : m, Le.arg === h) continue;
                return { value: Le.arg, done: K.done };
              }
              Le.type === "throw" && (G = v, K.method = "throw", K.arg = Le.arg);
            }
          };
        }
        function T(A, B) {
          var K = A.iterator[B.method];
          if (K === n) {
            if (B.delegate = null, B.method === "throw") {
              if (A.iterator.return && (B.method = "return", B.arg = n, T(A, B), B.method === "throw")) return h;
              B.method = "throw", B.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var G = k(K, A.iterator, B.arg);
          if (G.type === "throw") return B.method = "throw", B.arg = G.arg, B.delegate = null, h;
          var V = G.arg;
          return V ? V.done ? (B[A.resultName] = V.value, B.next = A.nextLoc, B.method !== "return" && (B.method = "next", B.arg = n), B.delegate = null, h) : V : (B.method = "throw", B.arg = new TypeError("iterator result is not an object"), B.delegate = null, h);
        }
        function R(A) {
          var B = { tryLoc: A[0] };
          1 in A && (B.catchLoc = A[1]), 2 in A && (B.finallyLoc = A[2], B.afterLoc = A[3]), this.tryEntries.push(B);
        }
        function Z(A) {
          var B = A.completion || {};
          B.type = "normal", delete B.arg, A.completion = B;
        }
        function X(A) {
          this.tryEntries = [{ tryLoc: "root" }], A.forEach(R, this), this.reset(!0);
        }
        function ie(A) {
          if (A) {
            var B = A[u];
            if (B) return B.call(A);
            if (typeof A.next == "function") return A;
            if (!isNaN(A.length)) {
              var K = -1, G = function V() {
                for (; ++K < A.length; ) if (o.call(A, K)) return V.value = A[K], V.done = !1, V;
                return V.value = n, V.done = !0, V;
              };
              return G.next = G;
            }
          }
          return { next: te };
        }
        function te() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), c = e("50c4"), a = e("8418"), s = e("65f0"), l = e("1dde"), d = e("b622"), m = e("2d00"), p = d("isConcatSpreadable"), v = 9007199254740991, h = "Maximum allowed index exceeded", b = m >= 51 || !r(function() {
        var y = [];
        return y[p] = !1, y.concat()[0] !== y;
      }), g = l("concat"), j = function(y) {
        if (!t(y)) return !1;
        var k = y[p];
        return k !== void 0 ? !!k : o(y);
      }, E = !b || !g;
      n({ target: "Array", proto: !0, forced: E }, { concat: function(y) {
        var k, w, O, _, C, S = u(this), U = s(S, 0), T = 0;
        for (k = -1, O = arguments.length; k < O; k++) if (C = k === -1 ? S : arguments[k], j(C)) {
          if (_ = c(C.length), T + _ > v) throw TypeError(h);
          for (w = 0; w < _; w++, T++) w in C && a(U, T, C[w]);
        } else {
          if (T >= v) throw TypeError(h);
          a(U, T++, C);
        }
        return U.length = T, U;
      } });
    }, "9aaf": function(i, f, e) {
      e("70d3");
    }, "9bdd": function(i, f, e) {
      var n = e("825a"), r = e("2a62");
      i.exports = function(o, t, u, c) {
        try {
          return c ? t(n(u)[0], u[1]) : t(u);
        } catch (a) {
          throw r(o), a;
        }
      };
    }, "9bf2": function(i, f, e) {
      var n = e("83ab"), r = e("0cfb"), o = e("825a"), t = e("c04e"), u = Object.defineProperty;
      f.f = n ? u : function(c, a, s) {
        if (o(c), a = t(a, !0), o(s), r) try {
          return u(c, a, s);
        } catch {
        }
        if ("get" in s || "set" in s) throw TypeError("Accessors not supported");
        return "value" in s && (c[a] = s.value), c;
      };
    }, "9ed3": function(i, f, e) {
      var n = e("ae93").IteratorPrototype, r = e("7c73"), o = e("5c6c"), t = e("d44e"), u = e("3f8c"), c = function() {
        return this;
      };
      i.exports = function(a, s, l) {
        var d = s + " Iterator";
        return a.prototype = r(n, { next: o(1, l) }), t(a, d, !1, !0), u[d] = c, a;
      };
    }, "9f7f": function(i, f, e) {
      var n = e("d039");
      function r(o, t) {
        return RegExp(o, t);
      }
      f.UNSUPPORTED_Y = n(function() {
        var o = r("a", "y");
        return o.lastIndex = 2, o.exec("abcd") != null;
      }), f.BROKEN_CARET = n(function() {
        var o = r("^r", "gy");
        return o.lastIndex = 2, o.exec("str") != null;
      });
    }, a434: function(i, f, e) {
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), c = e("65f0"), a = e("8418"), s = e("1dde"), l = s("splice"), d = Math.max, m = Math.min, p = 9007199254740991, v = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, b) {
        var g, j, E, y, k, w, O = u(this), _ = t(O.length), C = r(h, _), S = arguments.length;
        if (S === 0 ? g = j = 0 : S === 1 ? (g = 0, j = _ - C) : (g = S - 2, j = m(d(o(b), 0), _ - C)), _ + g - j > p) throw TypeError(v);
        for (E = c(O, j), y = 0; y < j; y++) k = C + y, k in O && a(E, y, O[k]);
        if (E.length = j, g < j) {
          for (y = C; y < _ - j; y++) k = y + j, w = y + g, k in O ? O[w] = O[k] : delete O[w];
          for (y = _; y > _ - j + g; y--) delete O[y - 1];
        } else if (g > j) for (y = _ - j; y > C; y--) k = y + j - 1, w = y + g - 1, k in O ? O[w] = O[k] : delete O[w];
        for (y = 0; y < g; y++) O[y + C] = arguments[y + 2];
        return O.length = _ - j + g, E;
      } });
    }, a4b4: function(i, f, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), c = e("4930"), a = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), m = e("861d"), p = e("825a"), v = e("7b0b"), h = e("fc6a"), b = e("c04e"), g = e("5c6c"), j = e("7c73"), E = e("df75"), y = e("241c"), k = e("057f"), w = e("7418"), O = e("06cf"), _ = e("9bf2"), C = e("d1e7"), S = e("9112"), U = e("6eeb"), T = e("5692"), R = e("f772"), Z = e("d012"), X = e("90e3"), ie = e("b622"), te = e("e538"), A = e("746f"), B = e("d44e"), K = e("69f3"), G = e("b727").forEach, V = R("hidden"), me = "Symbol", fe = "prototype", Ee = ie("toPrimitive"), Le = K.set, Pe = K.getterFor(me), je = Object[fe], Se = r.Symbol, Fe = o("JSON", "stringify"), He = O.f, $ = _.f, D = k.f, H = C.f, L = T("symbols"), P = T("op-symbols"), Q = T("string-to-symbol-registry"), ge = T("symbol-to-string-registry"), he = T("wks"), ue = r.QObject, we = !ue || !ue[fe] || !ue[fe].findChild, ke = u && s(function() {
        return j($({}, "a", { get: function() {
          return $(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(W, J, ae) {
        var pe = He(je, J);
        pe && delete je[J], $(W, J, ae), pe && W !== je && $(je, J, pe);
      } : $, Ie = function(W, J) {
        var ae = L[W] = j(Se[fe]);
        return Le(ae, { type: me, tag: W, description: J }), u || (ae.description = J), ae;
      }, _e = a ? function(W) {
        return typeof W == "symbol";
      } : function(W) {
        return Object(W) instanceof Se;
      }, We = function(W, J, ae) {
        W === je && We(P, J, ae), p(W);
        var pe = b(J, !0);
        return p(ae), l(L, pe) ? (ae.enumerable ? (l(W, V) && W[V][pe] && (W[V][pe] = !1), ae = j(ae, { enumerable: g(0, !1) })) : (l(W, V) || $(W, V, g(1, {})), W[V][pe] = !0), ke(W, pe, ae)) : $(W, pe, ae);
      }, Ge = function(W, J) {
        p(W);
        var ae = h(J), pe = E(ae).concat(se(ae));
        return G(pe, function(Me) {
          u && !nt.call(ae, Me) || We(W, Me, ae[Me]);
        }), W;
      }, Je = function(W, J) {
        return J === void 0 ? j(W) : Ge(j(W), J);
      }, nt = function(W) {
        var J = b(W, !0), ae = H.call(this, J);
        return !(this === je && l(L, J) && !l(P, J)) && (!(ae || !l(this, J) || !l(L, J) || l(this, V) && this[V][J]) || ae);
      }, q = function(W, J) {
        var ae = h(W), pe = b(J, !0);
        if (ae !== je || !l(L, pe) || l(P, pe)) {
          var Me = He(ae, pe);
          return !Me || !l(L, pe) || l(ae, V) && ae[V][pe] || (Me.enumerable = !0), Me;
        }
      }, re = function(W) {
        var J = D(h(W)), ae = [];
        return G(J, function(pe) {
          l(L, pe) || l(Z, pe) || ae.push(pe);
        }), ae;
      }, se = function(W) {
        var J = W === je, ae = D(J ? P : h(W)), pe = [];
        return G(ae, function(Me) {
          !l(L, Me) || J && !l(je, Me) || pe.push(L[Me]);
        }), pe;
      };
      if (c || (Se = function() {
        if (this instanceof Se) throw TypeError("Symbol is not a constructor");
        var W = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, J = X(W), ae = function(pe) {
          this === je && ae.call(P, pe), l(this, V) && l(this[V], J) && (this[V][J] = !1), ke(this, J, g(1, pe));
        };
        return u && we && ke(je, J, { configurable: !0, set: ae }), Ie(J, W);
      }, U(Se[fe], "toString", function() {
        return Pe(this).tag;
      }), U(Se, "withoutSetter", function(W) {
        return Ie(X(W), W);
      }), C.f = nt, _.f = We, O.f = q, y.f = k.f = re, w.f = se, te.f = function(W) {
        return Ie(ie(W), W);
      }, u && ($(Se[fe], "description", { configurable: !0, get: function() {
        return Pe(this).description;
      } }), t || U(je, "propertyIsEnumerable", nt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Se }), G(E(he), function(W) {
        A(W);
      }), n({ target: me, stat: !0, forced: !c }, { for: function(W) {
        var J = String(W);
        if (l(Q, J)) return Q[J];
        var ae = Se(J);
        return Q[J] = ae, ge[ae] = J, ae;
      }, keyFor: function(W) {
        if (!_e(W)) throw TypeError(W + " is not a symbol");
        if (l(ge, W)) return ge[W];
      }, useSetter: function() {
        we = !0;
      }, useSimple: function() {
        we = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !u }, { create: Je, defineProperty: We, defineProperties: Ge, getOwnPropertyDescriptor: q }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: re, getOwnPropertySymbols: se }), n({ target: "Object", stat: !0, forced: s(function() {
        w.f(1);
      }) }, { getOwnPropertySymbols: function(W) {
        return w.f(v(W));
      } }), Fe) {
        var de = !c || s(function() {
          var W = Se();
          return Fe([W]) != "[null]" || Fe({ a: W }) != "{}" || Fe(Object(W)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: de }, { stringify: function(W, J, ae) {
          for (var pe, Me = [W], qe = 1; arguments.length > qe; ) Me.push(arguments[qe++]);
          if (pe = J, (m(J) || W !== void 0) && !_e(W)) return d(J) || (J = function(Ze, be) {
            if (typeof pe == "function" && (be = pe.call(this, Ze, be)), !_e(be)) return be;
          }), Me[1] = J, Fe.apply(null, Me);
        } });
      }
      Se[fe][Ee] || S(Se[fe], Ee, Se[fe].valueOf), B(Se, me), Z[V] = !0;
    }, a630: function(i, f, e) {
      var n = e("23e7"), r = e("4df4"), o = e("1c7e"), t = !o(function(u) {
        Array.from(u);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: r });
    }, a640: function(i, f, e) {
      var n = e("d039");
      i.exports = function(r, o) {
        var t = [][r];
        return !!t && n(function() {
          t.call(null, o || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(i, f) {
      var e = Math.ceil, n = Math.floor;
      i.exports = function(r) {
        return isNaN(r = +r) ? 0 : (r > 0 ? n : e)(r);
      };
    }, ab13: function(i, f, e) {
      var n = e("b622"), r = n("match");
      i.exports = function(o) {
        var t = /./;
        try {
          "/./"[o](t);
        } catch {
          try {
            return t[r] = !1, "/./"[o](t);
          } catch {
          }
        }
        return !1;
      };
    }, ac1f: function(i, f, e) {
      var n = e("23e7"), r = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== r }, { exec: r });
    }, acce: function(i, f, e) {
    }, ad6d: function(i, f, e) {
      var n = e("825a");
      i.exports = function() {
        var r = n(this), o = "";
        return r.global && (o += "g"), r.ignoreCase && (o += "i"), r.multiline && (o += "m"), r.dotAll && (o += "s"), r.unicode && (o += "u"), r.sticky && (o += "y"), o;
      };
    }, ae93: function(i, f, e) {
      var n, r, o, t = e("d039"), u = e("e163"), c = e("9112"), a = e("5135"), s = e("b622"), l = e("c430"), d = s("iterator"), m = !1, p = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : m = !0);
      var v = n == null || t(function() {
        var h = {};
        return n[d].call(h) !== h;
      });
      v && (n = {}), l && !v || a(n, d) || c(n, d, p), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: m };
    }, b041: function(i, f, e) {
      var n = e("00ee"), r = e("f5df");
      i.exports = n ? {}.toString : function() {
        return "[object " + r(this) + "]";
      };
    }, b0c0: function(i, f, e) {
      var n = e("83ab"), r = e("9bf2").f, o = Function.prototype, t = o.toString, u = /^\s*function ([^ (]*)/, c = "name";
      n && !(c in o) && r(o, c, { configurable: !0, get: function() {
        try {
          return t.call(this).match(u)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(i, f, e) {
      var n = e("c532"), r = e("467f"), o = e("7aac"), t = e("30b5"), u = e("83b9"), c = e("c345"), a = e("3934"), s = e("2d83");
      i.exports = function(l) {
        return new Promise(function(d, m) {
          var p = l.data, v = l.headers;
          n.isFormData(p) && delete v["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var b = l.auth.username || "", g = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            v.Authorization = "Basic " + btoa(b + ":" + g);
          }
          var j = u(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(j, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var y = "getAllResponseHeaders" in h ? c(h.getAllResponseHeaders()) : null, k = l.responseType && l.responseType !== "text" ? h.response : h.responseText, w = { data: k, status: h.status, statusText: h.statusText, headers: y, config: l, request: h };
              r(d, m, w), h = null;
            }
          }, h.onabort = function() {
            h && (m(s("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            m(s("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var y = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (y = l.timeoutErrorMessage), m(s(y, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var E = (l.withCredentials || a(j)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            E && (v[l.xsrfHeaderName] = E);
          }
          if ("setRequestHeader" in h && n.forEach(v, function(y, k) {
            typeof p > "u" && k.toLowerCase() === "content-type" ? delete v[k] : h.setRequestHeader(k, y);
          }), n.isUndefined(l.withCredentials) || (h.withCredentials = !!l.withCredentials), l.responseType) try {
            h.responseType = l.responseType;
          } catch (y) {
            if (l.responseType !== "json") throw y;
          }
          typeof l.onDownloadProgress == "function" && h.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(y) {
            h && (h.abort(), m(y), h = null);
          }), p || (p = null), h.send(p);
        });
      };
    }, b575: function(i, f, e) {
      var n, r, o, t, u, c, a, s, l = e("da84"), d = e("06cf").f, m = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), h = e("605d"), b = l.MutationObserver || l.WebKitMutationObserver, g = l.document, j = l.process, E = l.Promise, y = d(l, "queueMicrotask"), k = y && y.value;
      k || (n = function() {
        var w, O;
        for (h && (w = j.domain) && w.exit(); r; ) {
          O = r.fn, r = r.next;
          try {
            O();
          } catch (_) {
            throw r ? t() : o = void 0, _;
          }
        }
        o = void 0, w && w.enter();
      }, p || h || v || !b || !g ? E && E.resolve ? (a = E.resolve(void 0), s = a.then, t = function() {
        s.call(a, n);
      }) : t = h ? function() {
        j.nextTick(n);
      } : function() {
        m.call(l, n);
      } : (u = !0, c = g.createTextNode(""), new b(n).observe(c, { characterData: !0 }), t = function() {
        c.data = u = !u;
      })), i.exports = k || function(w) {
        var O = { fn: w, next: void 0 };
        o && (o.next = O), r || (r = O, t()), o = O;
      };
    }, b622: function(i, f, e) {
      var n = e("da84"), r = e("5692"), o = e("5135"), t = e("90e3"), u = e("4930"), c = e("fdbf"), a = r("wks"), s = n.Symbol, l = c ? s : s && s.withoutSetter || t;
      i.exports = function(d) {
        return o(a, d) && (u || typeof a[d] == "string") || (u && o(s, d) ? a[d] = s[d] : a[d] = l("Symbol." + d)), a[d];
      };
    }, b64b: function(i, f, e) {
      var n = e("23e7"), r = e("7b0b"), o = e("df75"), t = e("d039"), u = t(function() {
        o(1);
      });
      n({ target: "Object", stat: !0, forced: u }, { keys: function(c) {
        return o(r(c));
      } });
    }, b680: function(i, f, e) {
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), c = 1 .toFixed, a = Math.floor, s = function(h, b, g) {
        return b === 0 ? g : b % 2 === 1 ? s(h, b - 1, g * h) : s(h * h, b / 2, g);
      }, l = function(h) {
        for (var b = 0, g = h; g >= 4096; ) b += 12, g /= 4096;
        for (; g >= 2; ) b += 1, g /= 2;
        return b;
      }, d = function(h, b, g) {
        for (var j = -1, E = g; ++j < 6; ) E += b * h[j], h[j] = E % 1e7, E = a(E / 1e7);
      }, m = function(h, b) {
        for (var g = 6, j = 0; --g >= 0; ) j += h[g], h[g] = a(j / b), j = j % b * 1e7;
      }, p = function(h) {
        for (var b = 6, g = ""; --b >= 0; ) if (g !== "" || b === 0 || h[b] !== 0) {
          var j = String(h[b]);
          g = g === "" ? j : g + t.call("0", 7 - j.length) + j;
        }
        return g;
      }, v = c && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        c.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(h) {
        var b, g, j, E, y = o(this), k = r(h), w = [0, 0, 0, 0, 0, 0], O = "", _ = "0";
        if (k < 0 || k > 20) throw RangeError("Incorrect fraction digits");
        if (y != y) return "NaN";
        if (y <= -1e21 || y >= 1e21) return String(y);
        if (y < 0 && (O = "-", y = -y), y > 1e-21) if (b = l(y * s(2, 69, 1)) - 69, g = b < 0 ? y * s(2, -b, 1) : y / s(2, b, 1), g *= 4503599627370496, b = 52 - b, b > 0) {
          for (d(w, 0, g), j = k; j >= 7; ) d(w, 1e7, 0), j -= 7;
          for (d(w, s(10, j, 1), 0), j = b - 1; j >= 23; ) m(w, 1 << 23), j -= 23;
          m(w, 1 << j), d(w, 1, 1), m(w, 2), _ = p(w);
        } else d(w, 0, g), d(w, 1 << -b, 0), _ = p(w) + t.call("0", k);
        return k > 0 ? (E = _.length, _ = O + (E <= k ? "0." + t.call("0", k - E) + _ : _.slice(0, E - k) + "." + _.slice(E - k))) : _ = O + _, _;
      } });
    }, b727: function(i, f, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), c = [].push, a = function(s) {
        var l = s == 1, d = s == 2, m = s == 3, p = s == 4, v = s == 6, h = s == 7, b = s == 5 || v;
        return function(g, j, E, y) {
          for (var k, w, O = o(g), _ = r(O), C = n(j, E, 3), S = t(_.length), U = 0, T = y || u, R = l ? T(g, S) : d || h ? T(g, 0) : void 0; S > U; U++) if ((b || U in _) && (k = _[U], w = C(k, U, O), s)) if (l) R[U] = w;
          else if (w) switch (s) {
            case 3:
              return !0;
            case 5:
              return k;
            case 6:
              return U;
            case 2:
              c.call(R, k);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              c.call(R, k);
          }
          return v ? -1 : m || p ? p : R;
        };
      };
      i.exports = { forEach: a(0), map: a(1), filter: a(2), some: a(3), every: a(4), find: a(5), findIndex: a(6), filterOut: a(7) };
    }, b8d6: function(i, f, e) {
    }, bb2f: function(i, f, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.isExtensible(Object.preventExtensions({}));
      });
    }, bc3a: function(i, f, e) {
      i.exports = e("cee4");
    }, c04e: function(i, f, e) {
      var n = e("861d");
      i.exports = function(r, o) {
        if (!n(r)) return r;
        var t, u;
        if (o && typeof (t = r.toString) == "function" && !n(u = t.call(r)) || typeof (t = r.valueOf) == "function" && !n(u = t.call(r)) || !o && typeof (t = r.toString) == "function" && !n(u = t.call(r))) return u;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(i, f, e) {
      var n = e("c532"), r = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      i.exports = function(o) {
        var t, u, c, a = {};
        return o && n.forEach(o.split(`
`), function(s) {
          if (c = s.indexOf(":"), t = n.trim(s.substr(0, c)).toLowerCase(), u = n.trim(s.substr(c + 1)), t) {
            if (a[t] && r.indexOf(t) >= 0) return;
            a[t] = t === "set-cookie" ? (a[t] ? a[t] : []).concat([u]) : a[t] ? a[t] + ", " + u : u;
          }
        }), a;
      };
    }, c401: function(i, f, e) {
      var n = e("c532");
      i.exports = function(r, o, t) {
        return n.forEach(t, function(u) {
          r = u(r, o);
        }), r;
      };
    }, c430: function(i, f) {
      i.exports = !1;
    }, c532: function(i, f, e) {
      var n = e("1d2b"), r = Object.prototype.toString;
      function o(S) {
        return r.call(S) === "[object Array]";
      }
      function t(S) {
        return typeof S > "u";
      }
      function u(S) {
        return S !== null && !t(S) && S.constructor !== null && !t(S.constructor) && typeof S.constructor.isBuffer == "function" && S.constructor.isBuffer(S);
      }
      function c(S) {
        return r.call(S) === "[object ArrayBuffer]";
      }
      function a(S) {
        return typeof FormData < "u" && S instanceof FormData;
      }
      function s(S) {
        var U;
        return U = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(S) : S && S.buffer && S.buffer instanceof ArrayBuffer, U;
      }
      function l(S) {
        return typeof S == "string";
      }
      function d(S) {
        return typeof S == "number";
      }
      function m(S) {
        return S !== null && typeof S == "object";
      }
      function p(S) {
        if (r.call(S) !== "[object Object]") return !1;
        var U = Object.getPrototypeOf(S);
        return U === null || U === Object.prototype;
      }
      function v(S) {
        return r.call(S) === "[object Date]";
      }
      function h(S) {
        return r.call(S) === "[object File]";
      }
      function b(S) {
        return r.call(S) === "[object Blob]";
      }
      function g(S) {
        return r.call(S) === "[object Function]";
      }
      function j(S) {
        return m(S) && g(S.pipe);
      }
      function E(S) {
        return typeof URLSearchParams < "u" && S instanceof URLSearchParams;
      }
      function y(S) {
        return S.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function k() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function w(S, U) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), o(S)) for (var T = 0, R = S.length; T < R; T++) U.call(null, S[T], T, S);
        else for (var Z in S) Object.prototype.hasOwnProperty.call(S, Z) && U.call(null, S[Z], Z, S);
      }
      function O() {
        var S = {};
        function U(Z, X) {
          p(S[X]) && p(Z) ? S[X] = O(S[X], Z) : p(Z) ? S[X] = O({}, Z) : o(Z) ? S[X] = Z.slice() : S[X] = Z;
        }
        for (var T = 0, R = arguments.length; T < R; T++) w(arguments[T], U);
        return S;
      }
      function _(S, U, T) {
        return w(U, function(R, Z) {
          S[Z] = T && typeof R == "function" ? n(R, T) : R;
        }), S;
      }
      function C(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      i.exports = { isArray: o, isArrayBuffer: c, isBuffer: u, isFormData: a, isArrayBufferView: s, isString: l, isNumber: d, isObject: m, isPlainObject: p, isUndefined: t, isDate: v, isFile: h, isBlob: b, isFunction: g, isStream: j, isURLSearchParams: E, isStandardBrowserEnv: k, forEach: w, merge: O, extend: _, trim: y, stripBOM: C };
    }, c6b6: function(i, f) {
      var e = {}.toString;
      i.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(i, f, e) {
      var n = e("da84"), r = e("ce4e"), o = "__core-js_shared__", t = n[o] || r(o, {});
      i.exports = t;
    }, c8af: function(i, f, e) {
      var n = e("c532");
      i.exports = function(r, o) {
        n.forEach(r, function(t, u) {
          u !== o && u.toUpperCase() === o.toUpperCase() && (r[o] = t, delete r[u]);
        });
      };
    }, c8ba: function(i, f) {
      var e;
      e = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        e = e || new Function("return this")();
      } catch {
        typeof window == "object" && (e = window);
      }
      i.exports = e;
    }, ca84: function(i, f, e) {
      var n = e("5135"), r = e("fc6a"), o = e("4d64").indexOf, t = e("d012");
      i.exports = function(u, c) {
        var a, s = r(u), l = 0, d = [];
        for (a in s) !n(t, a) && n(s, a) && d.push(a);
        for (; c.length > l; ) n(s, a = c[l++]) && (~o(d, a) || d.push(a));
        return d;
      };
    }, caad: function(i, f, e) {
      var n = e("23e7"), r = e("4d64").includes, o = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return r(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), o("includes");
    }, cc12: function(i, f, e) {
      var n = e("da84"), r = e("861d"), o = n.document, t = r(o) && r(o.createElement);
      i.exports = function(u) {
        return t ? o.createElement(u) : {};
      };
    }, cdf9: function(i, f, e) {
      var n = e("825a"), r = e("861d"), o = e("f069");
      i.exports = function(t, u) {
        if (n(t), r(u) && u.constructor === t) return u;
        var c = o.f(t), a = c.resolve;
        return a(u), c.promise;
      };
    }, ce4e: function(i, f, e) {
      var n = e("da84"), r = e("9112");
      i.exports = function(o, t) {
        try {
          r(n, o, t);
        } catch {
          n[o] = t;
        }
        return t;
      };
    }, cee4: function(i, f, e) {
      var n = e("c532"), r = e("1d2b"), o = e("0a06"), t = e("4a7b"), u = e("2444");
      function c(s) {
        var l = new o(s), d = r(o.prototype.request, l);
        return n.extend(d, o.prototype, l), n.extend(d, l), d;
      }
      var a = c(u);
      a.Axios = o, a.create = function(s) {
        return c(t(a.defaults, s));
      }, a.Cancel = e("7a77"), a.CancelToken = e("8df4"), a.isCancel = e("2e67"), a.all = function(s) {
        return Promise.all(s);
      }, a.spread = e("0df6"), a.isAxiosError = e("5f02"), i.exports = a, i.exports.default = a;
    }, d012: function(i, f) {
      i.exports = {};
    }, d039: function(i, f) {
      i.exports = function(e) {
        try {
          return !!e();
        } catch {
          return !0;
        }
      };
    }, d066: function(i, f, e) {
      var n = e("428f"), r = e("da84"), o = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      i.exports = function(t, u) {
        return arguments.length < 2 ? o(n[t]) || o(r[t]) : n[t] && n[t][u] || r[t] && r[t][u];
      };
    }, d1e7: function(i, f, e) {
      var n = {}.propertyIsEnumerable, r = Object.getOwnPropertyDescriptor, o = r && !n.call({ 1: 2 }, 1);
      f.f = o ? function(t) {
        var u = r(this, t);
        return !!u && u.enumerable;
      } : n;
    }, d28b: function(i, f, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(i, f, e) {
      var n = e("825a"), r = e("3bbe");
      i.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var o, t = !1, u = {};
        try {
          o = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, o.call(u, []), t = u instanceof Array;
        } catch {
        }
        return function(c, a) {
          return n(c), r(a), t ? o.call(c, a) : c.__proto__ = a, c;
        };
      }() : void 0);
    }, d3b7: function(i, f, e) {
      var n = e("00ee"), r = e("6eeb"), o = e("b041");
      n || r(Object.prototype, "toString", o, { unsafe: !0 });
    }, d40d: function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-back", use: "icon-back-usage", viewBox: "0 0 58.6 35.1", content: `<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.6 35.1" id="icon-back">\r
<style type="text/css">\r
	#icon-back .st0{stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;}\r
	#icon-back .st1{stroke-width:2.1499;stroke-miterlimit:10;}\r
	#icon-back .st2{stroke-width:3.2571;stroke-miterlimit:10;}\r
</style>\r
<g>\r
	<path class="st0" d="M8.4,8.8h37.1c6.7,0,12.2,5.4,12.2,12.2l0,0c0,7.2-5.8,13.1-13.1,13.1c0,0,0,0,0,0h-24" />\r
	<g>\r
		<path class="st1" d="M3,9.1l8.6,6.9c0.1,0.1,0.3,0,0.3-0.1V2c0-0.2-0.2-0.2-0.3-0.1L3,8.8C2.9,8.9,2.9,9,3,9.1z" />\r
		<path class="st2" d="M10.4,4.8c0,0-5.4,4.1-5.4,4s5.6,3.8,5.6,3.8L10.4,4.8z" />\r
	</g>\r
</g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, d44e: function(i, f, e) {
      var n = e("9bf2").f, r = e("5135"), o = e("b622"), t = o("toStringTag");
      i.exports = function(u, c, a) {
        u && !r(u = a ? u : u.prototype, t) && n(u, t, { configurable: !0, value: c });
      };
    }, d58f: function(i, f, e) {
      var n = e("1c0b"), r = e("7b0b"), o = e("44ad"), t = e("50c4"), u = function(c) {
        return function(a, s, l, d) {
          n(s);
          var m = r(a), p = o(m), v = t(m.length), h = c ? v - 1 : 0, b = c ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in p) {
              d = p[h], h += b;
              break;
            }
            if (h += b, c ? h < 0 : v <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; c ? h >= 0 : v > h; h += b) h in p && (d = s(d, p[h], h, m));
          return d;
        };
      };
      i.exports = { left: u(!1), right: u(!0) };
    }, d69c: function(i, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, d784: function(i, f, e) {
      e("ac1f");
      var n = e("6eeb"), r = e("d039"), o = e("b622"), t = e("9263"), u = e("9112"), c = o("species"), a = !r(function() {
        var p = /./;
        return p.exec = function() {
          var v = [];
          return v.groups = { a: "7" }, v;
        }, "".replace(p, "$<a>") !== "7";
      }), s = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), l = o("replace"), d = function() {
        return !!/./[l] && /./[l]("a", "$0") === "";
      }(), m = !r(function() {
        var p = /(?:)/, v = p.exec;
        p.exec = function() {
          return v.apply(this, arguments);
        };
        var h = "ab".split(p);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      i.exports = function(p, v, h, b) {
        var g = o(p), j = !r(function() {
          var _ = {};
          return _[g] = function() {
            return 7;
          }, ""[p](_) != 7;
        }), E = j && !r(function() {
          var _ = !1, C = /a/;
          return p === "split" && (C = {}, C.constructor = {}, C.constructor[c] = function() {
            return C;
          }, C.flags = "", C[g] = /./[g]), C.exec = function() {
            return _ = !0, null;
          }, C[g](""), !_;
        });
        if (!j || !E || p === "replace" && (!a || !s || d) || p === "split" && !m) {
          var y = /./[g], k = h(g, ""[p], function(_, C, S, U, T) {
            return C.exec === t ? j && !T ? { done: !0, value: y.call(C, S, U) } : { done: !0, value: _.call(S, C, U) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), w = k[0], O = k[1];
          n(String.prototype, p, w), n(RegExp.prototype, g, v == 2 ? function(_, C) {
            return O.call(_, this, C);
          } : function(_) {
            return O.call(_, this);
          });
        }
        b && u(RegExp.prototype[g], "sham", !0);
      };
    }, d81d: function(i, f, e) {
      var n = e("23e7"), r = e("b727").map, o = e("1dde"), t = o("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(i, f, e) {
      i.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(i, f, e) {
      (function(n) {
        var r = function(o) {
          return o && o.Math == Math && o;
        };
        i.exports = r(typeof globalThis == "object" && globalThis) || r(typeof window == "object" && window) || r(typeof self == "object" && self) || r(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(i, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("56ef"), t = e("fc6a"), u = e("06cf"), c = e("8418");
      n({ target: "Object", stat: !0, sham: !r }, { getOwnPropertyDescriptors: function(a) {
        for (var s, l, d = t(a), m = u.f, p = o(d), v = {}, h = 0; p.length > h; ) l = m(d, s = p[h++]), l !== void 0 && c(v, s, l);
        return v;
      } });
    }, ddb0: function(i, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), u = e("b622"), c = u("iterator"), a = u("toStringTag"), s = o.values;
      for (var l in r) {
        var d = n[l], m = d && d.prototype;
        if (m) {
          if (m[c] !== s) try {
            t(m, c, s);
          } catch {
            m[c] = s;
          }
          if (m[a] || t(m, a, l), r[l]) {
            for (var p in o) if (m[p] !== o[p]) try {
              t(m, p, o[p]);
            } catch {
              m[p] = o[p];
            }
          }
        }
      }
    }, de23: function(i, f, e) {
      e("7305");
    }, df75: function(i, f, e) {
      var n = e("ca84"), r = e("7839");
      i.exports = Object.keys || function(o) {
        return n(o, r);
      };
    }, df7c: function(i, f, e) {
      (function(n) {
        function r(c, a) {
          for (var s = 0, l = c.length - 1; l >= 0; l--) {
            var d = c[l];
            d === "." ? c.splice(l, 1) : d === ".." ? (c.splice(l, 1), s++) : s && (c.splice(l, 1), s--);
          }
          if (a) for (; s--; s) c.unshift("..");
          return c;
        }
        function o(c) {
          typeof c != "string" && (c += "");
          var a, s = 0, l = -1, d = !0;
          for (a = c.length - 1; a >= 0; --a) if (c.charCodeAt(a) === 47) {
            if (!d) {
              s = a + 1;
              break;
            }
          } else l === -1 && (d = !1, l = a + 1);
          return l === -1 ? "" : c.slice(s, l);
        }
        function t(c, a) {
          if (c.filter) return c.filter(a);
          for (var s = [], l = 0; l < c.length; l++) a(c[l], l, c) && s.push(c[l]);
          return s;
        }
        f.resolve = function() {
          for (var c = "", a = !1, s = arguments.length - 1; s >= -1 && !a; s--) {
            var l = s >= 0 ? arguments[s] : n.cwd();
            if (typeof l != "string") throw new TypeError("Arguments to path.resolve must be strings");
            l && (c = l + "/" + c, a = l.charAt(0) === "/");
          }
          return c = r(t(c.split("/"), function(d) {
            return !!d;
          }), !a).join("/"), (a ? "/" : "") + c || ".";
        }, f.normalize = function(c) {
          var a = f.isAbsolute(c), s = u(c, -1) === "/";
          return c = r(t(c.split("/"), function(l) {
            return !!l;
          }), !a).join("/"), c || a || (c = "."), c && s && (c += "/"), (a ? "/" : "") + c;
        }, f.isAbsolute = function(c) {
          return c.charAt(0) === "/";
        }, f.join = function() {
          var c = Array.prototype.slice.call(arguments, 0);
          return f.normalize(t(c, function(a, s) {
            if (typeof a != "string") throw new TypeError("Arguments to path.join must be strings");
            return a;
          }).join("/"));
        }, f.relative = function(c, a) {
          function s(b) {
            for (var g = 0; g < b.length && b[g] === ""; g++) ;
            for (var j = b.length - 1; j >= 0 && b[j] === ""; j--) ;
            return g > j ? [] : b.slice(g, j - g + 1);
          }
          c = f.resolve(c).substr(1), a = f.resolve(a).substr(1);
          for (var l = s(c.split("/")), d = s(a.split("/")), m = Math.min(l.length, d.length), p = m, v = 0; v < m; v++) if (l[v] !== d[v]) {
            p = v;
            break;
          }
          var h = [];
          for (v = p; v < l.length; v++) h.push("..");
          return h = h.concat(d.slice(p)), h.join("/");
        }, f.sep = "/", f.delimiter = ":", f.dirname = function(c) {
          if (typeof c != "string" && (c += ""), c.length === 0) return ".";
          for (var a = c.charCodeAt(0), s = a === 47, l = -1, d = !0, m = c.length - 1; m >= 1; --m) if (a = c.charCodeAt(m), a === 47) {
            if (!d) {
              l = m;
              break;
            }
          } else d = !1;
          return l === -1 ? s ? "/" : "." : s && l === 1 ? "/" : c.slice(0, l);
        }, f.basename = function(c, a) {
          var s = o(c);
          return a && s.substr(-1 * a.length) === a && (s = s.substr(0, s.length - a.length)), s;
        }, f.extname = function(c) {
          typeof c != "string" && (c += "");
          for (var a = -1, s = 0, l = -1, d = !0, m = 0, p = c.length - 1; p >= 0; --p) {
            var v = c.charCodeAt(p);
            if (v !== 47) l === -1 && (d = !1, l = p + 1), v === 46 ? a === -1 ? a = p : m !== 1 && (m = 1) : a !== -1 && (m = -1);
            else if (!d) {
              s = p + 1;
              break;
            }
          }
          return a === -1 || l === -1 || m === 0 || m === 1 && a === l - 1 && a === s + 1 ? "" : c.slice(a, l);
        };
        var u = "ab".substr(-1) === "b" ? function(c, a, s) {
          return c.substr(a, s);
        } : function(c, a, s) {
          return a < 0 && (a = c.length + a), c.substr(a, s);
        };
      }).call(this, e("4362"));
    }, e017: function(i, f, e) {
      (function(n) {
        (function(r, o) {
          i.exports = o();
        })(0, function() {
          var r = function(v) {
            var h = v.id, b = v.viewBox, g = v.content;
            this.id = h, this.viewBox = b, this.content = g;
          };
          r.prototype.stringify = function() {
            return this.content;
          }, r.prototype.toString = function() {
            return this.stringify();
          }, r.prototype.destroy = function() {
            var v = this;
            ["id", "viewBox", "content"].forEach(function(h) {
              return delete v[h];
            });
          };
          var o = function(v) {
            var h = !!document.importNode, b = new DOMParser().parseFromString(v, "image/svg+xml").documentElement;
            return h ? document.importNode(b, !0) : b;
          };
          function t(v, h) {
            return h = { exports: {} }, v(h, h.exports), h.exports;
          }
          var u = t(function(v, h) {
            (function(b, g) {
              v.exports = g();
            })(0, function() {
              function b(w) {
                var O = w && typeof w == "object";
                return O && Object.prototype.toString.call(w) !== "[object RegExp]" && Object.prototype.toString.call(w) !== "[object Date]";
              }
              function g(w) {
                return Array.isArray(w) ? [] : {};
              }
              function j(w, O) {
                var _ = O && O.clone === !0;
                return _ && b(w) ? k(g(w), w, O) : w;
              }
              function E(w, O, _) {
                var C = w.slice();
                return O.forEach(function(S, U) {
                  typeof C[U] > "u" ? C[U] = j(S, _) : b(S) ? C[U] = k(w[U], S, _) : w.indexOf(S) === -1 && C.push(j(S, _));
                }), C;
              }
              function y(w, O, _) {
                var C = {};
                return b(w) && Object.keys(w).forEach(function(S) {
                  C[S] = j(w[S], _);
                }), Object.keys(O).forEach(function(S) {
                  b(O[S]) && w[S] ? C[S] = k(w[S], O[S], _) : C[S] = j(O[S], _);
                }), C;
              }
              function k(w, O, _) {
                var C = Array.isArray(O), S = _ || { arrayMerge: E }, U = S.arrayMerge || E;
                return C ? Array.isArray(w) ? U(w, O, _) : j(O, _) : y(w, O, _);
              }
              return k.all = function(w, O) {
                if (!Array.isArray(w) || w.length < 2) throw new Error("first argument should be an array with at least two elements");
                return w.reduce(function(_, C) {
                  return k(_, C, O);
                });
              }, k;
            });
          }), c = t(function(v, h) {
            var b = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = b, v.exports = h.default;
          }), a = function(v) {
            return Object.keys(v).map(function(h) {
              var b = v[h].toString().replace(/"/g, "&quot;");
              return h + '="' + b + '"';
            }).join(" ");
          }, s = c.svg, l = c.xlink, d = {};
          d[s.name] = s.uri, d[l.name] = l.uri;
          var m = function(v, h) {
            v === void 0 && (v = "");
            var b = u(d, {}), g = a(b);
            return "<svg " + g + ">" + v + "</svg>";
          }, p = function(v) {
            function h() {
              v.apply(this, arguments);
            }
            v && (h.__proto__ = v), h.prototype = Object.create(v && v.prototype), h.prototype.constructor = h;
            var b = { isMounted: {} };
            return b.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(g) {
              return new h({ id: g.getAttribute("id"), viewBox: g.getAttribute("viewBox"), content: g.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), v.prototype.destroy.call(this);
            }, h.prototype.mount = function(g) {
              if (this.isMounted) return this.node;
              var j = typeof g == "string" ? document.querySelector(g) : g, E = this.render();
              return this.node = E, j.appendChild(E), E;
            }, h.prototype.render = function() {
              var g = this.stringify();
              return o(m(g)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, b), h;
          }(r);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), c = e("9bf2").f, a = e("e893"), s = o.Symbol;
      if (r && typeof s == "function" && (!("description" in s.prototype) || s().description !== void 0)) {
        var l = {}, d = function() {
          var b = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), g = this instanceof d ? new s(b) : b === void 0 ? s() : s(b);
          return b === "" && (l[g] = !0), g;
        };
        a(d, s);
        var m = d.prototype = s.prototype;
        m.constructor = d;
        var p = m.toString, v = String(s("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        c(m, "description", { configurable: !0, get: function() {
          var b = u(this) ? this.valueOf() : this, g = p.call(b);
          if (t(l, b)) return "";
          var j = v ? g.slice(7, -1) : g.replace(h, "$1");
          return j === "" ? void 0 : j;
        } }), n({ global: !0, forced: !0 }, { Symbol: d });
      }
    }, e163: function(i, f, e) {
      var n = e("5135"), r = e("7b0b"), o = e("f772"), t = e("e177"), u = o("IE_PROTO"), c = Object.prototype;
      i.exports = t ? Object.getPrototypeOf : function(a) {
        return a = r(a), n(a, u) ? a[u] : typeof a.constructor == "function" && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? c : null;
      };
    }, e177: function(i, f, e) {
      var n = e("d039");
      i.exports = !n(function() {
        function r() {
        }
        return r.prototype.constructor = null, Object.getPrototypeOf(new r()) !== r.prototype;
      });
    }, e260: function(i, f, e) {
      var n = e("fc6a"), r = e("44d2"), o = e("3f8c"), t = e("69f3"), u = e("7dd0"), c = "Array Iterator", a = t.set, s = t.getterFor(c);
      i.exports = u(Array, "Array", function(l, d) {
        a(this, { type: c, target: n(l), index: 0, kind: d });
      }, function() {
        var l = s(this), d = l.target, m = l.kind, p = l.index++;
        return !d || p >= d.length ? (l.target = void 0, { value: void 0, done: !0 }) : m == "keys" ? { value: p, done: !1 } : m == "values" ? { value: d[p], done: !1 } : { value: [p, d[p]], done: !1 };
      }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries");
    }, e2cc: function(i, f, e) {
      var n = e("6eeb");
      i.exports = function(r, o, t) {
        for (var u in o) n(r, u, o[u], t);
        return r;
      };
    }, e439: function(i, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("fc6a"), t = e("06cf").f, u = e("83ab"), c = r(function() {
        t(1);
      }), a = !u || c;
      n({ target: "Object", stat: !0, forced: a, sham: !u }, { getOwnPropertyDescriptor: function(s, l) {
        return t(o(s), l);
      } });
    }, e538: function(i, f, e) {
      var n = e("b622");
      f.f = n;
    }, e667: function(i, f) {
      i.exports = function(e) {
        try {
          return { error: !1, value: e() };
        } catch (n) {
          return { error: !0, value: n };
        }
      };
    }, e66c: function(i, f, e) {
      e("95d9");
    }, e683: function(i, f, e) {
      i.exports = function(n, r) {
        return r ? n.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(i, f, e) {
      var n, r, o, t, u = e("23e7"), c = e("c430"), a = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), m = e("e2cc"), p = e("d44e"), v = e("2626"), h = e("861d"), b = e("1c0b"), g = e("19aa"), j = e("8925"), E = e("2266"), y = e("1c7e"), k = e("4840"), w = e("2cf4").set, O = e("b575"), _ = e("cdf9"), C = e("44de"), S = e("f069"), U = e("e667"), T = e("69f3"), R = e("94ca"), Z = e("b622"), X = e("605d"), ie = e("2d00"), te = Z("species"), A = "Promise", B = T.get, K = T.set, G = T.getterFor(A), V = l, me = a.TypeError, fe = a.document, Ee = a.process, Le = s("fetch"), Pe = S.f, je = Pe, Se = !!(fe && fe.createEvent && a.dispatchEvent), Fe = typeof PromiseRejectionEvent == "function", He = "unhandledrejection", $ = "rejectionhandled", D = 0, H = 1, L = 2, P = 1, Q = 2, ge = R(A, function() {
        var q = j(V) !== String(V);
        if (!q && (ie === 66 || !X && !Fe) || c && !V.prototype.finally) return !0;
        if (ie >= 51 && /native code/.test(V)) return !1;
        var re = V.resolve(1), se = function(W) {
          W(function() {
          }, function() {
          });
        }, de = re.constructor = {};
        return de[te] = se, !(re.then(function() {
        }) instanceof se);
      }), he = ge || !y(function(q) {
        V.all(q).catch(function() {
        });
      }), ue = function(q) {
        var re;
        return !(!h(q) || typeof (re = q.then) != "function") && re;
      }, we = function(q, re) {
        if (!q.notified) {
          q.notified = !0;
          var se = q.reactions;
          O(function() {
            for (var de = q.value, W = q.state == H, J = 0; se.length > J; ) {
              var ae, pe, Me, qe = se[J++], Ze = W ? qe.ok : qe.fail, be = qe.resolve, et = qe.reject, Ke = qe.domain;
              try {
                Ze ? (W || (q.rejection === Q && We(q), q.rejection = P), Ze === !0 ? ae = de : (Ke && Ke.enter(), ae = Ze(de), Ke && (Ke.exit(), Me = !0)), ae === qe.promise ? et(me("Promise-chain cycle")) : (pe = ue(ae)) ? pe.call(ae, be, et) : be(ae)) : et(de);
              } catch (gt) {
                Ke && !Me && Ke.exit(), et(gt);
              }
            }
            q.reactions = [], q.notified = !1, re && !q.rejection && Ie(q);
          });
        }
      }, ke = function(q, re, se) {
        var de, W;
        Se ? (de = fe.createEvent("Event"), de.promise = re, de.reason = se, de.initEvent(q, !1, !0), a.dispatchEvent(de)) : de = { promise: re, reason: se }, !Fe && (W = a["on" + q]) ? W(de) : q === He && C("Unhandled promise rejection", se);
      }, Ie = function(q) {
        w.call(a, function() {
          var re, se = q.facade, de = q.value, W = _e(q);
          if (W && (re = U(function() {
            X ? Ee.emit("unhandledRejection", de, se) : ke(He, se, de);
          }), q.rejection = X || _e(q) ? Q : P, re.error)) throw re.value;
        });
      }, _e = function(q) {
        return q.rejection !== P && !q.parent;
      }, We = function(q) {
        w.call(a, function() {
          var re = q.facade;
          X ? Ee.emit("rejectionHandled", re) : ke($, re, q.value);
        });
      }, Ge = function(q, re, se) {
        return function(de) {
          q(re, de, se);
        };
      }, Je = function(q, re, se) {
        q.done || (q.done = !0, se && (q = se), q.value = re, q.state = L, we(q, !0));
      }, nt = function(q, re, se) {
        if (!q.done) {
          q.done = !0, se && (q = se);
          try {
            if (q.facade === re) throw me("Promise can't be resolved itself");
            var de = ue(re);
            de ? O(function() {
              var W = { done: !1 };
              try {
                de.call(re, Ge(nt, W, q), Ge(Je, W, q));
              } catch (J) {
                Je(W, J, q);
              }
            }) : (q.value = re, q.state = H, we(q, !1));
          } catch (W) {
            Je({ done: !1 }, W, q);
          }
        }
      };
      ge && (V = function(q) {
        g(this, V, A), b(q), n.call(this);
        var re = B(this);
        try {
          q(Ge(nt, re), Ge(Je, re));
        } catch (se) {
          Je(re, se);
        }
      }, n = function(q) {
        K(this, { type: A, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: D, value: void 0 });
      }, n.prototype = m(V.prototype, { then: function(q, re) {
        var se = G(this), de = Pe(k(this, V));
        return de.ok = typeof q != "function" || q, de.fail = typeof re == "function" && re, de.domain = X ? Ee.domain : void 0, se.parent = !0, se.reactions.push(de), se.state != D && we(se, !1), de.promise;
      }, catch: function(q) {
        return this.then(void 0, q);
      } }), r = function() {
        var q = new n(), re = B(q);
        this.promise = q, this.resolve = Ge(nt, re), this.reject = Ge(Je, re);
      }, S.f = Pe = function(q) {
        return q === V || q === o ? new r(q) : je(q);
      }, c || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(q, re) {
        var se = this;
        return new V(function(de, W) {
          t.call(se, de, W);
        }).then(q, re);
      }, { unsafe: !0 }), typeof Le == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(q) {
        return _(V, Le.apply(a, arguments));
      } }))), u({ global: !0, wrap: !0, forced: ge }, { Promise: V }), p(V, A, !1, !0), v(A), o = s(A), u({ target: A, stat: !0, forced: ge }, { reject: function(q) {
        var re = Pe(this);
        return re.reject.call(void 0, q), re.promise;
      } }), u({ target: A, stat: !0, forced: c || ge }, { resolve: function(q) {
        return _(c && this === o ? V : this, q);
      } }), u({ target: A, stat: !0, forced: he }, { all: function(q) {
        var re = this, se = Pe(re), de = se.resolve, W = se.reject, J = U(function() {
          var ae = b(re.resolve), pe = [], Me = 0, qe = 1;
          E(q, function(Ze) {
            var be = Me++, et = !1;
            pe.push(void 0), qe++, ae.call(re, Ze).then(function(Ke) {
              et || (et = !0, pe[be] = Ke, --qe || de(pe));
            }, W);
          }), --qe || de(pe);
        });
        return J.error && W(J.value), se.promise;
      }, race: function(q) {
        var re = this, se = Pe(re), de = se.reject, W = U(function() {
          var J = b(re.resolve);
          E(q, function(ae) {
            J.call(re, ae).then(se.resolve, de);
          });
        });
        return W.error && de(W.value), se.promise;
      } });
    }, e893: function(i, f, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      i.exports = function(u, c) {
        for (var a = r(c), s = t.f, l = o.f, d = 0; d < a.length; d++) {
          var m = a[d];
          n(u, m) || s(u, m, l(c, m));
        }
      };
    }, e8b5: function(i, f, e) {
      var n = e("c6b6");
      i.exports = Array.isArray || function(r) {
        return n(r) == "Array";
      };
    }, e95a: function(i, f, e) {
      var n = e("b622"), r = e("3f8c"), o = n("iterator"), t = Array.prototype;
      i.exports = function(u) {
        return u !== void 0 && (r.Array === u || t[o] === u);
      };
    }, ec57: function(i, f, e) {
      var n = { "./back.svg": "d40d", "./close.svg": "4f43", "./delete.svg": "d69c", "./drag.svg": "7eb5", "./handwrite.svg": "545a", "./upper.svg": "6d55" };
      function r(t) {
        var u = o(t);
        return e(u);
      }
      function o(t) {
        if (!e.o(n, t)) {
          var u = new Error("Cannot find module '" + t + "'");
          throw u.code = "MODULE_NOT_FOUND", u;
        }
        return n[t];
      }
      r.keys = function() {
        return Object.keys(n);
      }, r.resolve = o, i.exports = r, r.id = "ec57";
    }, f069: function(i, f, e) {
      var n = e("1c0b"), r = function(o) {
        var t, u;
        this.promise = new o(function(c, a) {
          if (t !== void 0 || u !== void 0) throw TypeError("Bad Promise constructor");
          t = c, u = a;
        }), this.resolve = n(t), this.reject = n(u);
      };
      i.exports.f = function(o) {
        return new r(o);
      };
    }, f183: function(i, f, e) {
      var n = e("d012"), r = e("861d"), o = e("5135"), t = e("9bf2").f, u = e("90e3"), c = e("bb2f"), a = u("meta"), s = 0, l = Object.isExtensible || function() {
        return !0;
      }, d = function(b) {
        t(b, a, { value: { objectID: "O" + ++s, weakData: {} } });
      }, m = function(b, g) {
        if (!r(b)) return typeof b == "symbol" ? b : (typeof b == "string" ? "S" : "P") + b;
        if (!o(b, a)) {
          if (!l(b)) return "F";
          if (!g) return "E";
          d(b);
        }
        return b[a].objectID;
      }, p = function(b, g) {
        if (!o(b, a)) {
          if (!l(b)) return !0;
          if (!g) return !1;
          d(b);
        }
        return b[a].weakData;
      }, v = function(b) {
        return c && h.REQUIRED && l(b) && !o(b, a) && d(b), b;
      }, h = i.exports = { REQUIRED: !1, fastKey: m, getWeakData: p, onFreeze: v };
      n[a] = !0;
    }, f5df: function(i, f, e) {
      var n = e("00ee"), r = e("c6b6"), o = e("b622"), t = o("toStringTag"), u = r(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", c = function(a, s) {
        try {
          return a[s];
        } catch {
        }
      };
      i.exports = n ? r : function(a) {
        var s, l, d;
        return a === void 0 ? "Undefined" : a === null ? "Null" : typeof (l = c(s = Object(a), t)) == "string" ? l : u ? r(s) : (d = r(s)) == "Object" && typeof s.callee == "function" ? "Arguments" : d;
      };
    }, f6b4: function(i, f, e) {
      var n = e("c532");
      function r() {
        this.handlers = [];
      }
      r.prototype.use = function(o, t) {
        return this.handlers.push({ fulfilled: o, rejected: t }), this.handlers.length - 1;
      }, r.prototype.eject = function(o) {
        this.handlers[o] && (this.handlers[o] = null);
      }, r.prototype.forEach = function(o) {
        n.forEach(this.handlers, function(t) {
          t !== null && o(t);
        });
      }, i.exports = r;
    }, f772: function(i, f, e) {
      var n = e("5692"), r = e("90e3"), o = n("keys");
      i.exports = function(t) {
        return o[t] || (o[t] = r(t));
      };
    }, f8b0: function(i, f, e) {
      e("b8d6");
    }, fb15: function(i, f, e) {
      if (e.r(f), typeof window < "u") {
        var n = window.document.currentScript, r = e("8875");
        n = r(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: r });
        var o = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        o && (e.p = o[1]);
      }
      e("b0c0");
      var t = e("8bbf"), u = { class: "key-board-container" }, c = { class: "key-board-area" };
      function a(x, F, M, I, z, oe) {
        var le = Object(t.resolveComponent)("Result"), ce = Object(t.resolveComponent)("DefaultBoard"), ve = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Ue = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: F[1] || (F[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(le, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ce, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ve, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Ue]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(x, F, M) {
        return F in x ? Object.defineProperty(x, F, { value: M, enumerable: !0, configurable: !0, writable: !0 }) : x[F] = M, x;
      }
      function l(x, F) {
        var M = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var I = Object.getOwnPropertySymbols(x);
          F && (I = I.filter(function(z) {
            return Object.getOwnPropertyDescriptor(x, z).enumerable;
          })), M.push.apply(M, I);
        }
        return M;
      }
      function d(x) {
        for (var F = 1; F < arguments.length; F++) {
          var M = arguments[F] != null ? arguments[F] : {};
          F % 2 ? l(Object(M), !0).forEach(function(I) {
            s(x, I, M[I]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(M)) : l(Object(M)).forEach(function(I) {
            Object.defineProperty(x, I, Object.getOwnPropertyDescriptor(M, I));
          });
        }
        return x;
      }
      function m(x, F) {
        (F == null || F > x.length) && (F = x.length);
        for (var M = 0, I = new Array(F); M < F; M++) I[M] = x[M];
        return I;
      }
      function p(x) {
        if (Array.isArray(x)) return m(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function h(x, F) {
        if (x) {
          if (typeof x == "string") return m(x, F);
          var M = Object.prototype.toString.call(x).slice(8, -1);
          return M === "Object" && x.constructor && (M = x.constructor.name), M === "Map" || M === "Set" ? Array.from(x) : M === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(M) ? m(x, F) : void 0;
        }
      }
      function b() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function g(x) {
        return p(x) || v(x) || h(x) || b();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function j(x, F) {
        if (!(x instanceof F)) throw new TypeError("Cannot call a class as a function");
      }
      function E(x, F) {
        for (var M = 0; M < F.length; M++) {
          var I = F[M];
          I.enumerable = I.enumerable || !1, I.configurable = !0, "value" in I && (I.writable = !0), Object.defineProperty(x, I.key, I);
        }
      }
      function y(x, F, M) {
        return F && E(x.prototype, F), x;
      }
      var k = function() {
        function x() {
          j(this, x), this.listeners = {};
        }
        return y(x, [{ key: "on", value: function(F, M) {
          var I = this, z = this.listeners[F];
          return z || (z = []), z.push(M), this.listeners[F] = z, function() {
            I.remove(F, M);
          };
        } }, { key: "emit", value: function(F) {
          var M = this.listeners[F];
          if (Array.isArray(M)) {
            for (var I = arguments.length, z = new Array(I > 1 ? I - 1 : 0), oe = 1; oe < I; oe++) z[oe - 1] = arguments[oe];
            for (var le = 0; le < M.length; le++) {
              var ce = M[le];
              typeof ce == "function" && ce.apply(void 0, z);
            }
          }
        } }, { key: "remove", value: function(F, M) {
          if (M) {
            var I = this.listeners[F];
            if (!I) return;
            I = I.filter(function(z) {
              return z !== M;
            }), this.listeners[F] = I;
          } else this.listeners[F] = null, delete this.listeners[F];
        } }]), x;
      }(), w = new k(), O = { mounted: function(x, F, M) {
        var I = x.parentNode;
        x.onmousedown = function(z) {
          var oe = z.clientX - I.offsetLeft, le = z.clientY - I.offsetTop;
          document.onmousemove = function(ce) {
            var ve = ce.clientX - oe, Re = ce.clientY - le;
            I.style.left = ve + "px", I.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(z) {
          var oe = z.touches[0].pageX, le = z.touches[0].pageY, ce = oe - I.offsetLeft, ve = le - I.offsetTop;
          document.ontouchmove = function(Re) {
            var Ue = Re.touches[0].pageX, Ve = Re.touches[0].pageY, ze = Ue - ce, lt = Ve - ve;
            I.style.left = ze + "px", I.style.top = lt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, _ = O, C = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, U = { class: "key-board-result-show" }, T = { class: "key-board-result-show-container" }, R = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var Z = C(function(x, F, M, I, z, oe) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", U, [Object(t.createVNode)("div", T, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(le, ce) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ce, onClick: function(ve) {
            return x.selectWord(le);
          } }, Object(t.toDisplayString)(ce + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", R, [Object(t.createVNode)("span", { style: x.getStyle, onClick: F[1] || (F[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: F[2] || (F[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), X = (e("1276"), e("6062"), e("5319"), function(x, F) {
        for (var M = 0, I = []; M < x.length; ) I.push(x.slice(M, M += F));
        return I;
      }), ie = Symbol("KEYBOARD_CONTEXT"), te = function(x) {
        Object(t.provide)(ie, x);
      }, A = function() {
        return Object(t.inject)(ie);
      }, B = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, F) {
        var M = F.emit, I = A(), z = Object(t.computed)(function() {
          return { borderTopColor: I == null ? void 0 : I.color };
        }), oe = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          oe.showIndex !== 0 && (oe.showIndex -= 1);
        }
        function ce() {
          oe.showIndex !== oe.showList.length - 1 && (oe.showIndex += 1);
        }
        function ve() {
          oe.showIndex = 0, oe.showList = [], oe.valueList = [], w.emit("resultReset");
        }
        function Re(Ue) {
          ve(), M("change", Ue);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Ue) {
          var Ve;
          oe.showIndex = 0, oe.valueList = (Ue == null || (Ve = Ue.value) === null || Ve === void 0 ? void 0 : Ve.split("")) || [], oe.valueList.length !== 0 ? oe.showList = X(oe.valueList, 11) : oe.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          w.on("keyBoardChange", function(Ue) {
            w.emit("updateBound"), oe.status = Ue, ve();
          }), w.on("getWordsFromServer", function(Ue) {
            var Ve = Array.from(new Set(Ue.replace(/\s+/g, "").split("")));
            oe.valueList = Ve, oe.showList = X(Ve, 11);
          });
        }), Object(t.onUnmounted)(function() {
          w.remove("keyBoardChange"), w.remove("getWordsFromServer");
        }), d({ color: I == null ? void 0 : I.color, upper: le, lower: ce, getStyle: z, selectWord: Re }, Object(t.toRefs)(oe));
      } });
      e("e66c"), B.render = Z, B.__scopeId = "data-v-02e63132";
      var K = B, G = e("bc3a"), V = e.n(G), me = 15e3, fe = function(x) {
        V.a.defaults.baseURL = x, V.a.defaults.timeout = me, V.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ee(x, F, M, I, z, oe) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Le = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var F = A(), M = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: F == null ? void 0 : F.color, iconName: M };
      } });
      e("38cd"), Le.render = Ee;
      var Pe = Le, je = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Se = { class: "hand-write-board" }, Fe = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var He = je(function(x, F, M, I, z, oe) {
        var le = Object(t.resolveComponent)("PaintBoard"), ce = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Se, [Object(t.createVNode)(le, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Fe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(ve) {
          return Object(t.openBlock)(), Object(t.createBlock)(ce, { key: ve.type, type: ve.type, data: ve.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), $ = { class: "paint-board" };
      function D(x, F, M, I, z, oe) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", $, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: F[1] || (F[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: F[2] || (F[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: F[3] || (F[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: F[4] || (F[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: F[5] || (F[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: F[6] || (F[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: F[7] || (F[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function H(x, F, M, I, z, oe, le) {
        try {
          var ce = x[oe](le), ve = ce.value;
        } catch (Re) {
          return void M(Re);
        }
        ce.done ? F(ve) : Promise.resolve(ve).then(I, z);
      }
      function L(x) {
        return function() {
          var F = this, M = arguments;
          return new Promise(function(I, z) {
            var oe = x.apply(F, M);
            function le(ve) {
              H(oe, I, z, le, ce, "next", ve);
            }
            function ce(ve) {
              H(oe, I, z, le, ce, "throw", ve);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var P, Q, ge = function() {
        var x = L(regeneratorRuntime.mark(function F(M, I, z, oe) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, V.a.post("", { lib: oe, lpXis: M, lpYis: I, lpCis: z });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, F);
        }));
        return function(F, M, I, z) {
          return x.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var F = A(), M = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), I = Object(t.ref)(null);
        function z() {
          return oe.apply(this, arguments);
        }
        function oe() {
          return oe = L(regeneratorRuntime.mark(function Ce() {
            var Qe, $e;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, ge(M.clickX, M.clickY, M.clickC, x.lib);
                case 2:
                  Qe = Ye.sent, $e = Qe.data, w.emit("getWordsFromServer", ($e == null ? void 0 : $e.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ce);
          })), oe.apply(this, arguments);
        }
        function le() {
          I.value && P && (M.clickX = [], M.clickY = [], M.clickC = [], P.clearRect(0, 0, M.width, M.height));
        }
        function ce(Ce) {
          if (Ce.type.includes("mouse")) {
            var Qe = Ce;
            return Math.floor(Qe.clientX - M.x);
          }
          if (Ce.type.includes("touch")) {
            var $e, Ye = Ce;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientX) - M.x);
          }
          return 0;
        }
        function ve(Ce) {
          if (Ce.type.includes("mouse")) {
            var Qe = Ce;
            return Math.floor(Qe.clientY - M.y);
          }
          if (Ce.type.includes("touch")) {
            var $e, Ye = Ce;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientY) - M.y);
          }
          return 0;
        }
        function Re(Ce) {
          if (P) {
            M.isMouseDown = !0;
            var Qe = ce(Ce), $e = ve(Ce);
            clearTimeout(Q), M.oldX = Qe, M.oldY = $e, P.beginPath();
          }
        }
        function Ue(Ce) {
          if (P && (Ce.preventDefault(), M.isMouseDown)) {
            var Qe = ce(Ce), $e = ve(Ce);
            M.clickX.push(Qe), M.clickY.push($e), M.clickC.push(0), P.strokeStyle = F == null ? void 0 : F.color, P.fillStyle = F == null ? void 0 : F.color, P.lineWidth = 4, P.lineCap = "round", P.moveTo(M.oldX, M.oldY), P.lineTo(Qe, $e), P.stroke(), M.oldX = Qe, M.oldY = $e;
          }
        }
        function Ve() {
          M.isMouseDown && (M.isMouseDown = !1, Q = setTimeout(function() {
            le();
          }, 1500), M.clickC.pop(), M.clickC.push(1), z());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ce = document.querySelector(".paint-board").getBoundingClientRect();
              M.x = Ce.x, M.y = Ce.y, M.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), M.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function lt() {
          var Ce;
          P = (Ce = I.value) === null || Ce === void 0 ? void 0 : Ce.getContext("2d"), le(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          lt(), w.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), w.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(M)), {}, { move: Ue, down: Re, mouseup: Ve, canvasRef: I });
      } });
      he.render = D;
      var ue = he;
      function we(x, F, M, I, z, oe) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: F[1] || (F[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: F[2] || (F[2] = function(ce) {
          return x.isHoverStatus = !0;
        }), onMouseleave: F[3] || (F[3] = function(ce) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ke = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Pe }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, F) {
        var M = F.emit, I = A(), z = Object(t.ref)(!1), oe = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), le = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || z.value ? { color: "#f5f5f5", background: I == null ? void 0 : I.color } : { color: I == null ? void 0 : I.color, background: "#f5f5f5" };
        });
        function ce(ve) {
          ve.preventDefault(), M("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: z, getStyle: le, getCode: oe, click: ce };
      } });
      e("de23"), ke.render = we;
      var Ie = ke, _e = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ue, KeyCodeButton: Ie }, setup: function(x, F) {
        var M = F.emit, I = A(), z = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function oe(le) {
          var ce = le.data, ve = le.type;
          switch (ve) {
            case "close":
              I == null || I.closeKeyBoard();
              break;
            case "back":
              I == null || I.changeDefaultBoard(), w.emit("resultReset"), w.emit("keyBoardChange", z.isCn && "CN");
              break;
            case "change2lang":
              z.isCn = !z.isCn;
              break;
            case "delete":
              M("trigger", { data: ce, type: ve });
              break;
          }
        }
        return d({ click: oe }, Object(t.toRefs)(z));
      } });
      e("9aaf"), _e.render = He, _e.__scopeId = "data-v-1b5e0983";
      var We = _e, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Je = { class: "default-key-board" }, nt = { class: "line line4" };
      Object(t.popScopeId)();
      var q = Ge(function(x, F, M, I, z, oe) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Je, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(ce, ve) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ve + 1)], key: ve }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ce, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: x.isUpper, key: Re, type: Re, data: Re, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", nt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(ce) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ce.type, type: ce.type, data: ce.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), re = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), se = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, de = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, W = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], J = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Ie }, emits: ["translate", "trigger", "change"], setup: function(x, F) {
        var M = F.emit, I = A(), z = Object(t.reactive)({ lineList: [se.line1, se.line2, se.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function oe() {
          var ce;
          z.line4 = JSON.parse(JSON.stringify(W)), I != null && (ce = I.modeList) !== null && ce !== void 0 && ce.find(function(ve) {
            return ve === "handwrite";
          }) && I !== null && I !== void 0 && I.handApi && z.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ce) {
          var ve = ce.data, Re = ce.type;
          switch (Re) {
            case "close":
              z.oldVal = "", I == null || I.closeKeyBoard();
              break;
            case "upper":
              z.oldVal = "", z.isUpper = !z.isUpper;
              break;
            case "change2lang":
              z.isCn = !z.isCn, z.isNum || z.isSymbol || w.emit("keyBoardChange", z.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (z.isNum = !z.isNum, z.isSymbol = !1, z.isNum) {
                var Ue;
                w.emit("keyBoardChange", "number");
                var Ve = JSON.parse(JSON.stringify(de.line3));
                I != null && (Ue = I.modeList) !== null && Ue !== void 0 && Ue.find(function(ze) {
                  return ze === "symbol";
                }) || (Ve.shift(), Ve.unshift("+")), z.lineList = [de.line1, de.line2, Ve];
              } else w.emit("keyBoardChange", z.isCn ? "CN" : "EN"), z.lineList = [se.line1, se.line2, se.line3];
              break;
            case "#+=":
              z.isSymbol = !z.isSymbol, z.isSymbol ? (w.emit("keyBoardChange", "symbol"), z.lineList = [re.line1, re.line2, re.line3]) : (w.emit("keyBoardChange", "number"), z.lineList = [de.line1, de.line2, de.line3]);
              break;
            case "handwrite":
            case "delete":
              z.isCn && Re === "delete" && z.oldVal ? (z.oldVal = z.oldVal.substr(0, z.oldVal.length - 1), M("translate", z.oldVal)) : (Re === "handwrite" && w.emit("keyBoardChange", "handwrite"), M("trigger", { data: ve, type: Re }));
              break;
            default:
              !z.isCn || z.isNum || z.isSymbol ? M("change", ve) : (M("translate", z.oldVal + ve), z.oldVal = z.oldVal + ve);
              break;
          }
        }
        return oe(), Object(t.onMounted)(function() {
          w.on("resultReset", function() {
            z.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(z)), {}, { click: le });
      } });
      e("f8b0"), J.render = q, J.__scopeId = "data-v-4b78e5a1";
      var ae = J, pe = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Me = e("ec57"), qe = function(x) {
        return x.keys().map(x);
      };
      qe(Me);
      var Ze = [], be = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: _ }, components: { Result: K, SvgIcon: Pe, HandBoard: We, DefaultBoard: ae }, setup: function(x, F) {
        var M = F.emit, I = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), z = Object(t.ref)(null);
        function oe(xe) {
          var Oe, Te;
          switch (Object(t.nextTick)(function() {
            w.emit("keyBoardChange", "CN");
          }), xe) {
            case "en":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Ae;
                (Ae = z.value) === null || Ae === void 0 || Ae.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Ae;
                (Ae = z.value) === null || Ae === void 0 || Ae.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Oe = x.modeList) !== null && Oe !== void 0 && Oe.find(function(Ae) {
                return Ae === "handwrite";
              }) && x.handApi ? (I.showMode = "handwrite", Object(t.nextTick)(function() {
                w.emit("keyBoardChange", "handwrite");
              })) : I.showMode = "default";
              break;
            case "symbol":
              I.showMode = "default", (Te = x.modeList) !== null && Te !== void 0 && Te.find(function(Ae) {
                return Ae === "symbol";
              }) && Object(t.nextTick)(function() {
                var Ae, tt;
                (Ae = z.value) === null || Ae === void 0 || Ae.click({ data: ".?123", type: "change2num" }), (tt = z.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              I.showMode = "default";
              break;
          }
        }
        function le(xe) {
          if (I.visible = !0, be = xe.target, oe(be.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Oe = document.querySelector(".key-board-modal");
            Oe.style.display = "block";
          }
        }
        function ce() {
          if (be && be.blur(), be = null, I.visible = !1, M("closed"), I.showMode = "default", I.resultVal = {}, document.querySelector(".key-board-modal")) {
            var xe = document.querySelector(".key-board-modal");
            xe.style.display = "none";
          }
        }
        function ve() {
          x.closeOnClickModal && ce(), M("modalClick");
        }
        function Re() {
          var xe;
          if (document.querySelector(".key-board-modal")) {
            var Oe;
            (Oe = document.querySelector(".key-board-modal")) === null || Oe === void 0 || Oe.addEventListener("click", ve);
          } else {
            var Te = document.createElement("div");
            Te.className = "key-board-modal", Te.style.display = "none", (xe = document.querySelector("body")) === null || xe === void 0 || xe.appendChild(Te), Te.addEventListener("click", ve);
          }
        }
        function Ue() {
          x.handApi && fe(x.handApi), [].concat(g(document.querySelectorAll("input")), g(document.querySelectorAll("textarea"))).forEach(function(xe) {
            xe.getAttribute("data-mode") !== null && (Ze.push(xe), xe.addEventListener("focus", le), x.blurHide && xe.addEventListener("blur", ce));
          });
        }
        function Ve(xe) {
          if (!be) return "";
          var Oe = be, Te = Oe.selectionStart, Ae = Oe.selectionEnd;
          if (!Te || !Ae) return "";
          var tt = xe.substring(0, Te - 1) + xe.substring(Ae);
          return Oe.value = tt, Oe.focus(), Oe.selectionStart = Te - 1, Oe.selectionEnd = Te - 1, tt;
        }
        function ze(xe) {
          var Oe = xe.type;
          switch (Oe) {
            case "handwrite":
              I.showMode = "handwrite";
              break;
            case "delete":
              if (!be) return;
              var Te = Ve(be.value);
              be.value = Te, M("change", Te, be.getAttribute("data-prop") || be);
              break;
          }
        }
        function lt(xe, Oe) {
          if (!be) return "";
          var Te = be, Ae = Te.selectionStart || 0, tt = Te.selectionEnd || 0, xt = xe.substring(0, Ae) + Oe + xe.substring(tt);
          return Te.value = xt, Te.focus(), Te.selectionStart = Ae + Oe.length, Te.selectionEnd = Ae + Oe.length, xt;
        }
        function Ce(xe) {
          if (be) {
            var Oe = lt(be.value, xe);
            be.value = Oe, M("change", Oe, be.getAttribute("data-prop") || be), M("keyChange", xe, be.getAttribute("data-prop") || be);
          }
        }
        function Qe(xe) {
          var Oe = new RegExp("^".concat(xe, "\\w*")), Te = Object.keys(pe).filter(function(Ae) {
            return Oe.test(Ae);
          }).sort();
          I.resultVal = { code: xe, value: xe ? Te.length > 1 ? Te.reduce(function(Ae, tt) {
            return Ae + pe[tt];
          }, "") : pe[Te[0]] : "" }, be && M("keyChange", xe, be.getAttribute("data-prop") || be);
        }
        function $e() {
          Ue();
        }
        function Ye() {
          return be;
        }
        return Object(t.onMounted)(function() {
          x.modal && Re(), Ue(), w.on("resultReset", function() {
            I.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var xe;
          (xe = document.querySelector(".key-board-modal")) === null || xe === void 0 || xe.removeEventListener("click", ve), Ze.forEach(function(Oe) {
            Oe.removeEventListener("focus", le), Oe.removeEventListener("blur", ce);
          });
        }), te(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          ce();
        }, changeDefaultBoard: function() {
          I.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(I)), {}, { defaultBoardRef: z, getCurrentInput: Ye, translate: Qe, reSignUp: $e, trigger: ze, change: Ce });
      } });
      et.render = a;
      var Ke = et;
      Ke.install = function(x) {
        x.component(Ke.name, Ke);
      };
      var gt = Ke, At = gt;
      f.default = At;
    }, fb6a: function(i, f, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), c = e("fc6a"), a = e("8418"), s = e("b622"), l = e("1dde"), d = l("slice"), m = s("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !d }, { slice: function(h, b) {
        var g, j, E, y = c(this), k = u(y.length), w = t(h, k), O = t(b === void 0 ? k : b, k);
        if (o(y) && (g = y.constructor, typeof g != "function" || g !== Array && !o(g.prototype) ? r(g) && (g = g[m], g === null && (g = void 0)) : g = void 0, g === Array || g === void 0)) return p.call(y, w, O);
        for (j = new (g === void 0 ? Array : g)(v(O - w, 0)), E = 0; w < O; w++, E++) w in y && a(j, E, y[w]);
        return j.length = E, j;
      } });
    }, fc6a: function(i, f, e) {
      var n = e("44ad"), r = e("1d80");
      i.exports = function(o) {
        return n(r(o));
      };
    }, fdbc: function(i, f) {
      i.exports = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
    }, fdbf: function(i, f, e) {
      var n = e("4930");
      i.exports = n && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }, fea9: function(i, f, e) {
      var n = e("da84");
      i.exports = n.Promise;
    } });
  });
})(Ct);
var er = Ct.exports;
const Tt = /* @__PURE__ */ Zn(er);
Pt({
  components: { KeyBoard: Tt },
  setup() {
    function ye(Y, ee) {
      console.log("change value ---->", Y), console.log("change input dom ---->", ee);
    }
    return {
      change: ye
    };
  }
});
const tr = { class: "wifi-component" }, nr = { class: "row" }, rr = { class: "column" }, or = { class: "column" }, ir = { class: "status" }, ar = { class: "row" }, ur = { class: "column" }, cr = {
  __name: "WiFi",
  setup(ye) {
    const Y = ne("未连接"), ee = ne(""), i = ne(""), f = () => {
      alert("验证 WiFi: " + ee.value);
    }, e = () => {
      alert("连接到 WiFi: " + ee.value), Y.value = "已连接到 " + ee.value;
    }, n = (r, o) => {
      o.placeholder === "WiFi 名称" ? ee.value = r : o.placeholder === "WiFi 密码" && (i.value = r);
    };
    return (r, o) => (Ne(), Be("div", tr, [
      N("div", nr, [
        N("div", rr, [
          pt(N("input", {
            "onUpdate:modelValue": o[0] || (o[0] = (t) => ee.value = t),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, ee.value]
          ])
        ]),
        N("div", or, [
          N("div", ir, " WiFi 状态: " + De(Y.value), 1)
        ])
      ]),
      N("div", ar, [
        N("div", ur, [
          pt(N("input", {
            "onUpdate:modelValue": o[1] || (o[1] = (t) => i.value = t),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, i.value]
          ])
        ]),
        N("div", { class: "column" }, [
          N("div", { class: "button-group" }, [
            N("button", { onClick: f }, "验证 WiFi"),
            N("button", { onClick: e }, "连接 WiFi")
          ])
        ])
      ]),
      Xe(Nt(Tt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: n,
        class: "scaled-keyboard"
      })
    ]));
  }
}, sr = /* @__PURE__ */ ot(cr, [["__scopeId", "data-v-38505ad0"]]), lr = {
  key: 0,
  class: "numeric-keyboard"
}, fr = { class: "keyboard" }, dr = { class: "current-value" }, pr = ["onClick"], vr = {
  __name: "StrNumericKeyboard",
  props: {
    modelValue: {
      type: [String, Number],
      default: ""
    },
    showKeyboard: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["update:modelValue", "update:showKeyboard"],
  setup(ye, { emit: Y }) {
    const ee = ye, i = Y, f = ne([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = ne("");
    st(() => ee.showKeyboard, (r) => {
      r && (e.value = ee.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => ye.showKeyboard ? (Ne(), Be("div", lr, [
      N("div", fr, [
        N("div", dr, De(e.value), 1),
        (Ne(!0), Be(at, null, ut(f.value, (t) => (Ne(), Be("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ne(!0), Be(at, null, ut(t, (u) => (Ne(), Be("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, De(u), 11, pr))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, kt = /* @__PURE__ */ ot(vr, [["__scopeId", "data-v-2ccc1cb7"]]), hr = { class: "container" }, gr = { class: "column" }, mr = { class: "status-bar" }, yr = ["disabled"], br = { class: "column" }, wr = {
  key: 0,
  class: "modal"
}, xr = { class: "modal-content" }, kr = 60, Sr = {
  __name: "Lock",
  setup(ye) {
    const { sendToPyQt: Y } = rt(), ee = ht({
      isPyQtWebEngine: !1
    }), i = ne("未激活"), f = ne(0), e = ne(""), n = ne(""), r = ne(""), o = ne(!1);
    let t, u;
    const c = ne(0), a = ne(1), s = ne(null), l = ne(!1), d = ne(!1), m = dt(() => i.value === "未激活" ? "设备状态: 未激活" : i.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${a.value} 次锁定 - 剩余时间: ${p.value}`), p = dt(() => {
      const U = Math.floor(f.value / 86400), T = Math.floor(f.value % (24 * 60 * 60) / (60 * 60)), R = Math.floor(f.value % (60 * 60) / 60), Z = f.value % 60;
      return `${U}天 ${T.toString().padStart(2, "0")}:${R.toString().padStart(2, "0")}:${Z.toString().padStart(2, "0")}`;
    }), v = dt(() => i.value === "未激活" ? "按住以激活设备" : e.value);
    function h(U) {
      i.value === "未激活" && (U.target.setPointerCapture(U.pointerId), c.value = 0, u = setInterval(() => {
        c.value += 2, c.value >= 100 && (clearInterval(u), j());
      }, 30));
    }
    function b(U) {
      U.target.releasePointerCapture(U.pointerId), g();
    }
    function g() {
      clearInterval(u), c.value = 0;
    }
    function j() {
      Y("activate_device", {});
    }
    function E(U, T) {
      i.value = "已激活", e.value = U, s.value = new Date(T), y();
    }
    function y() {
      k(), t = setInterval(() => {
        f.value > 0 ? f.value-- : w();
      }, 1e3);
    }
    function k() {
      const U = /* @__PURE__ */ new Date(), T = new Date(s.value.getTime() + a.value * kr * 1e3);
      f.value = Math.max(0, Math.floor((T - U) / 1e3));
    }
    function w() {
      o.value = !0, clearInterval(t);
    }
    function O() {
      Y("check_lock_password", {
        target: "attemptUnlock",
        password: n.value,
        lockCount: a.value,
        deviceRandomCode: e.value
      }), n.value = "";
    }
    function _() {
      Y("check_lock_password", {
        target: "attemptModalUnlock",
        password: r.value,
        lockCount: a.value,
        deviceRandomCode: e.value
      }), r.value = "";
    }
    function C() {
      i.value = "永久激活", o.value = !1, clearInterval(t);
    }
    function S() {
      a.value++, t && clearInterval(t), y();
    }
    return Bt(() => {
      clearInterval(t), clearInterval(u);
    }), ct(() => {
      if (ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: U } = rt();
        st(U, (T) => {
          if (T && T.type === "confirm_lock_password")
            try {
              const R = JSON.parse(T.content);
              R.target === "attemptUnlock" ? R.result === "success" ? S() : R.result === "forever_success" ? C() : alert("密钥错误") : R.target === "attemptModalUnlock" && (R.result === "success" ? (o.value = !1, S()) : R.result === "forever_success" ? C() : R.result === "fail" && alert("密钥错误"));
            } catch (R) {
              console.error("Failed to parse confirm lock password :", R);
            }
          else if (T && T.type === "device_activated")
            try {
              const R = JSON.parse(T.content);
              E(R.device_random_code, R.device_base_time);
            } catch (R) {
              console.error("Failed to parse device activation result:", R);
            }
          else if (T && T.type === "device_info")
            try {
              const R = JSON.parse(T.content);
              i.value = R.device_status, e.value = R.device_random_code, a.value = R.device_lock_count, s.value = new Date(R.device_base_time), R.device_status === "已激活" ? y() : R.device_status === "永久激活" && C();
            } catch (R) {
              console.error("Failed to parse device status:", R);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    }), (U, T) => (Ne(), Be("div", hr, [
      N("div", gr, [
        N("div", mr, De(m.value), 1),
        N("button", {
          class: "activation-button",
          onPointerdown: h,
          onPointerup: b,
          onPointercancel: g,
          onPointerleave: g,
          disabled: i.value !== "未激活"
        }, [
          wt(De(v.value) + " ", 1),
          N("div", {
            class: "progress-bar",
            style: St({ width: c.value + "%" })
          }, null, 4)
        ], 40, yr)
      ]),
      N("div", br, [
        pt(N("input", {
          "onUpdate:modelValue": T[0] || (T[0] = (R) => n.value = R),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: T[1] || (T[1] = (R) => l.value = !0)
        }, null, 544), [
          [vt, n.value]
        ]),
        N("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      o.value ? (Ne(), Be("div", wr, [
        N("div", xr, [
          T[8] || (T[8] = N("h3", null, "设备已锁定", -1)),
          N("h3", null, "第 " + De(a.value) + " 次锁定", 1),
          N("h3", null, "设备随机码: " + De(e.value), 1),
          pt(N("input", {
            "onUpdate:modelValue": T[2] || (T[2] = (R) => r.value = R),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: T[3] || (T[3] = (R) => d.value = !0)
          }, null, 544), [
            [vt, r.value]
          ]),
          N("button", {
            class: "unlock-button",
            onClick: _
          }, "解锁")
        ])
      ])) : ft("", !0),
      Xe(kt, {
        modelValue: n.value,
        "onUpdate:modelValue": T[4] || (T[4] = (R) => n.value = R),
        showKeyboard: l.value,
        "onUpdate:showKeyboard": T[5] || (T[5] = (R) => l.value = R)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Xe(kt, {
        modelValue: r.value,
        "onUpdate:modelValue": T[6] || (T[6] = (R) => r.value = R),
        showKeyboard: d.value,
        "onUpdate:showKeyboard": T[7] || (T[7] = (R) => d.value = R)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Or = /* @__PURE__ */ ot(Sr, [["__scopeId", "data-v-28624ff1"]]), _r = { class: "app-container" }, Er = {
  __name: "App",
  setup(ye) {
    return Rt(), (Y, ee) => (Ne(), Be("div", _r, [
      ee[0] || (ee[0] = N("h1", null, "涪特智能养护台车控制系统", -1)),
      Xe(yn),
      Xe(Xn),
      Xe(on),
      Xe(zn),
      Xe(sr),
      Xe(Or)
    ]));
  }
};
export {
  Er as default
};
