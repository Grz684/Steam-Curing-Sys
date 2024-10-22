import Lt, { ref as ne, onMounted as ct, provide as mt, readonly as yt, inject as bt, watch as st, openBlock as Pe, createElementBlock as Ne, createElementVNode as P, toDisplayString as De, Fragment as at, renderList as ut, normalizeClass as it, createCommentVNode as ft, reactive as ht, createVNode as Xe, computed as dt, createTextVNode as wt, normalizeStyle as St, defineComponent as Pt, withDirectives as pt, vModelText as vt, unref as Nt, onUnmounted as Bt } from "vue";
const Ot = Symbol(), _t = Symbol(), jt = Symbol();
function It(ye, G) {
  ye && ye.messageSignal ? ye.messageSignal.connect((ee) => {
    try {
      const a = JSON.parse(ee);
      G.value = a, console.log("Received message from PyQt:", a);
    } catch (a) {
      console.error("Failed to parse message:", a), G.value = { type: "unknown", content: ee };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const ye = ne(null), G = ne(null), ee = ne("");
  function a() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      ye.value = f, G.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), It(G.value, ee), G.value && typeof G.value.vueReady == "function" ? G.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ct(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? a() : document.addEventListener("DOMContentLoaded", a);
  }), mt(Ot, yt(ye)), mt(_t, yt(G)), mt(jt, yt(ee));
}
function rt() {
  const ye = bt(Ot), G = bt(_t), ee = bt(jt);
  return (!ye || !G || !ee) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: ye,
    bridge: G,
    message: ee,
    sendToPyQt: (f, e) => {
      if (console.log(`Attempting to call ${f} with args:`, e), G && G.value)
        if (typeof G.value.sendToPyQt == "function")
          try {
            G.value.sendToPyQt(f, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(G.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const ot = (ye, G) => {
  const ee = ye.__vccOpts || ye;
  for (const [a, f] of G)
    ee[a] = f;
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
  setup(ye, { emit: G }) {
    const ee = ye, a = G, f = ne([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = ne("");
    st(() => ee.showKeyboard, (r) => {
      r && (e.value = ee.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => ye.showKeyboard ? (Pe(), Ne("div", Mt, [
      P("div", Ut, [
        P("div", $t, De(e.value), 1),
        (Pe(!0), Ne(at, null, ut(f.value, (t) => (Pe(), Ne("div", {
          key: t.join(),
          class: "row"
        }, [
          (Pe(!0), Ne(at, null, ut(t, (u) => (Pe(), Ne("button", {
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
    const { sendToPyQt: G } = rt(), ee = ht({
      isPyQtWebEngine: !1
    }), a = ne(30), f = ne(10), e = ne(80), n = ne(20), r = ne(!1), o = ne(null), t = ne("");
    ct(() => {
      if (ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: m } = rt();
        st(m, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const v = JSON.parse(p.content);
              a.value = v.temp_upper, f.value = v.temp_lower, e.value = v.humidity_upper, n.value = v.humidity_lower, console.log("Sensor Settings updated:", v);
            } catch (v) {
              console.error("Failed to parse sensor settings data:", v);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), s();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const h = JSON.parse(p.content).args;
            a.value = h.temp_upper, f.value = h.temp_lower, e.value = h.humidity_upper, n.value = h.humidity_lower, s();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (m, p) => {
      const v = m === "tempUpper" ? a : m === "tempLower" ? f : m === "humidityUpper" ? e : n;
      v.value = (v.value || 0) + p, m.startsWith("temp") ? c(m === "tempUpper" ? "upper" : "lower") : i(m === "humidityUpper" ? "upper" : "lower");
    }, c = (m) => {
      a.value === "" && (a.value = f.value + 1), f.value === "" && (f.value = a.value - 1), m === "upper" ? a.value = Math.max(f.value + 1, a.value) : f.value = Math.min(a.value - 1, f.value), s();
    }, i = (m) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), m === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), s();
    }, s = () => {
      if (a.value !== "" && f.value !== "" && e.value !== "" && n.value !== "") {
        const m = {
          temp_upper: a.value,
          temp_lower: f.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", m), ee.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), G("updateLimitSettings", m)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (m) => {
      o.value = m, r.value = !0, t.value = m.startsWith("temp") ? m === "tempUpper" ? a.value : f.value : m === "humidityUpper" ? e.value : n.value;
    }, d = (m) => {
      const p = parseFloat(m);
      isNaN(p) || (o.value === "tempUpper" ? (a.value = p, c("upper")) : o.value === "tempLower" ? (f.value = p, c("lower")) : o.value === "humidityUpper" ? (e.value = p, i("upper")) : o.value === "humidityLower" && (n.value = p, i("lower"))), o.value = null;
    };
    return (m, p) => (Pe(), Ne("div", Vt, [
      P("div", Wt, [
        p[15] || (p[15] = P("h2", null, "温度设置 (°C)", -1)),
        P("div", qt, [
          p[13] || (p[13] = P("span", { class: "setting-label" }, "上限：", -1)),
          P("div", zt, [
            P("button", {
              onClick: p[0] || (p[0] = (v) => u("tempUpper", -1))
            }, "-"),
            P("input", {
              type: "text",
              value: a.value,
              onFocus: p[1] || (p[1] = (v) => l("tempUpper")),
              readonly: ""
            }, null, 40, Qt),
            P("button", {
              onClick: p[2] || (p[2] = (v) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        P("div", Kt, [
          p[14] || (p[14] = P("span", { class: "setting-label" }, "下限：", -1)),
          P("div", Ht, [
            P("button", {
              onClick: p[3] || (p[3] = (v) => u("tempLower", -1))
            }, "-"),
            P("input", {
              type: "text",
              value: f.value,
              onFocus: p[4] || (p[4] = (v) => l("tempLower")),
              readonly: ""
            }, null, 40, Gt),
            P("button", {
              onClick: p[5] || (p[5] = (v) => u("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      P("div", Yt, [
        p[18] || (p[18] = P("h2", null, "湿度设置 (%)", -1)),
        P("div", Xt, [
          p[16] || (p[16] = P("span", { class: "setting-label" }, "上限：", -1)),
          P("div", Jt, [
            P("button", {
              onClick: p[6] || (p[6] = (v) => u("humidityUpper", -1))
            }, "-"),
            P("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => l("humidityUpper")),
              readonly: ""
            }, null, 40, Zt),
            P("button", {
              onClick: p[8] || (p[8] = (v) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        P("div", en, [
          p[17] || (p[17] = P("span", { class: "setting-label" }, "下限：", -1)),
          P("div", tn, [
            P("button", {
              onClick: p[9] || (p[9] = (v) => u("humidityLower", -1))
            }, "-"),
            P("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => l("humidityLower")),
              readonly: ""
            }, null, 40, nn),
            P("button", {
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
    const G = ne({ temperature: {}, humidity: {} }), { sendToPyQt: ee } = rt();
    ct(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: f } = rt();
        st(f, (e) => {
          if (e && e.type === "update_sensor_data")
            try {
              G.value = JSON.parse(e.content);
            } catch (n) {
              console.error("Failed to parse sensor data:", n);
            }
          else e && e.type === "get_sensor_data" && ee("update_remote_sensor_data", G.value);
        });
      } else
        console.log("在普通网页环境中执行"), a(), setInterval(a, 5e3);
    });
    const a = async () => {
      try {
        const f = await fetch("http://localhost:8000/api/sensor-data/");
        if (!f.ok)
          throw new Error(`HTTP error! status: ${f.status}`);
        const e = await f.json();
        G.value = e;
      } catch (f) {
        console.error("Error fetching sensor data:", f);
      }
    };
    return (f, e) => (Pe(), Ne("div", an, [
      P("div", un, [
        e[0] || (e[0] = P("h2", null, "温度传感器", -1)),
        P("div", cn, [
          P("div", sn, [
            (Pe(!0), Ne(at, null, ut(G.value.temperature, (n, r) => (Pe(), Ne("div", {
              key: r,
              class: "sensor-card"
            }, [
              P("div", ln, De(r), 1),
              P("div", fn, De(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      P("div", dn, [
        e[1] || (e[1] = P("h2", null, "湿度传感器", -1)),
        P("div", pn, [
          P("div", vn, [
            (Pe(!0), Ne(at, null, ut(G.value.humidity, (n, r) => (Pe(), Ne("div", {
              key: r,
              class: "sensor-card"
            }, [
              P("div", hn, De(r), 1),
              P("div", gn, De(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ ot(mn, [["__scopeId", "data-v-4d55ddc2"]]), bn = { class: "integrated-control-system" }, wn = { class: "mode-controls" }, xn = ["disabled"], kn = ["disabled"], Sn = ["disabled"], On = ["disabled"], _n = { class: "systems-container" }, jn = { class: "steam-engine-control" }, En = { class: "control-panel" }, Cn = { class: "engine-status" }, Tn = { class: "engine left" }, An = ["disabled"], Ln = { class: "engine right" }, Pn = ["disabled"], Nn = { class: "sprinkler-system" }, Bn = { class: "controls" }, In = { class: "input-group" }, Rn = ["value"], Mn = { class: "input-group" }, Un = ["value"], $n = { class: "input-group" }, Dn = ["value"], Fn = { class: "visualization" }, Vn = ["onClick"], Wn = { class: "status" }, qn = {
  __name: "IntegratedControlSystem",
  setup(ye) {
    const G = ne(!1), ee = ne(!1), a = ne(5), f = ne(2), e = ne(10), n = ne(a.value), r = ne(f.value), o = ne(e.value), t = ne(a.value), u = ne(f.value), c = ne(e.value), i = ne(0), s = ne(""), l = ne(Array(12).fill(0)), d = ne(0), m = ne(!0), p = ne(!1), v = ne(!1), h = ne(null), y = ne(""), g = ne(!1), j = ne(15), C = ne(""), x = ne(""), { sendToPyQt: w } = rt(), b = ne(0), O = ht({
      isPyQtWebEngine: !1
    });
    ct(() => {
      if (O.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: F } = rt();
        st(F, (E) => {
          if (E && E.type === "update_left_steam_status")
            G.value = E.content;
          else if (E && E.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), T();
          else if (E && E.type === "update_right_steam_status")
            ee.value = E.content;
          else if (E && E.type === "update_sprinkler_settings")
            try {
              const W = JSON.parse(E.content);
              t.value = W.sprinkler_single_run_time, u.value = W.sprinkler_run_interval_time, c.value = W.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, console.log("Sprinkler Settings updated:", W);
            } catch (W) {
              console.error("Failed to parse sprinkler settings data:", W);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    function _() {
      const F = Date.now();
      return Math.floor((F - b.value) / 1e3);
    }
    const T = () => {
      const F = {
        leftEngineOn: G.value,
        rightEngineOn: ee.value,
        currentSingleRunTime: a.value,
        currentRunIntervalTime: f.value,
        currentLoopInterval: e.value,
        nextSingleRunTime: n.value,
        nextRunIntervalTime: r.value,
        nextLoopInterval: o.value,
        tempSingleRunTime: t.value,
        tempRunIntervalTime: u.value,
        tempLoopInterval: c.value,
        activeSprinkler: i.value,
        currentPhase: s.value,
        waterLevels: l.value,
        remainingTime: d.value,
        isAutoMode: m.value,
        isRunning: p.value,
        isSwitching: g.value,
        switchingTime: j.value,
        switchingMessage: C.value,
        switchPhase: x.value,
        elapsedTime: _()
      };
      w("IntegratedControlSystem_init_response", F);
    }, S = dt(() => g.value ? `${C.value}，还需${j.value}秒` : m.value ? p.value ? s.value === "run" ? `喷头 ${i.value} 正在运行，剩余 ${d.value + 1} 秒` : s.value === "interval" ? `运行间隔中，剩余 ${d.value + 1} 秒` : s.value === "loop" ? `循环间隔中，剩余 ${d.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    let M, A;
    async function B(F, E) {
      x.value = E, g.value = !0, j.value = 15, b.value = Date.now(), C.value = F ? "正在切换到喷淋管" : "正在切换到喷雾机", w("controlSprinkler", { target: "switchToSprinkler", state: F });
      const W = setInterval(() => {
        j.value--, j.value <= 0 && (clearInterval(W), g.value = !1);
      }, 1e3);
      return new Promise((J) => {
        setTimeout(() => {
          g.value = !1, J();
        }, j.value * 1e3);
      });
    }
    async function te(F) {
      const E = m.value;
      if (m.value = F === "auto", E !== m.value)
        if (O.isPyQtWebEngine && w("controlSprinkler", { target: "setMode", mode: m.value ? "auto" : "manual" }), m.value) {
          G.value && await Y();
          const W = l.value.findIndex((J) => J === 100);
          W !== -1 && (l.value[W] = 0, O.isPyQtWebEngine && w("controlSprinkler", { target: "manual", index: W + 1, state: 0 })), w("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await fe();
    }
    async function Y() {
      O.isPyQtWebEngine && (w("setEngineState", { engine: "left", state: !G.value }), w("setEngineState", { engine: "right", state: !ee.value }), G.value = !G.value, ee.value = !ee.value);
    }
    async function ae() {
      const F = l.value.findIndex((E) => E === 100);
      O.isPyQtWebEngine && F === -1 && (G.value ? w("controlSprinkler", { target: "tankWork", state: 0 }) : (await B(0, "click_toggleEngine"), w("controlSprinkler", { target: "tankWork", state: 1 })), w("setEngineState", { engine: "left", state: !G.value }), w("setEngineState", { engine: "right", state: !ee.value }), G.value = !G.value, ee.value = !ee.value);
    }
    function Z(F) {
      h.value = F, v.value = !0, y.value = F === "singleRunTime" ? t.value.toString() : F === "runIntervalTime" ? u.value.toString() : c.value.toString();
    }
    function L(F) {
      const E = parseInt(F);
      isNaN(E) || (h.value === "singleRunTime" ? (t.value = E, N()) : h.value === "runIntervalTime" ? (u.value = E, K()) : h.value === "loopInterval" && (c.value = E, H())), h.value = null;
    }
    function N() {
      t.value = Math.max(1, t.value), n.value = t.value, V();
    }
    function K() {
      u.value = Math.max(0, u.value), r.value = u.value, V();
    }
    function H() {
      c.value = Math.max(0, c.value), o.value = c.value, V();
    }
    function V() {
      if (O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const F = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        w("controlSprinkler", { target: "settings", settings: JSON.stringify(F) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function me() {
      p.value || !m.value || (p.value = !0, l.value = Array(12).fill(0), await Ae());
    }
    async function fe() {
      O.isPyQtWebEngine && (i.value > 0 && w("controlSprinkler", { target: "manual", index: i.value, state: 0 }), w("controlSprinkler", { target: "setState", state: !1 })), G.value && await Y(), Te(), w("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function Te() {
      p.value = !1, clearTimeout(M), clearInterval(A), i.value = 0, s.value = "", l.value = Array(12).fill(0), d.value = 0;
    }
    async function Ae() {
      i.value = 1, await B(1, "runCycle"), w("controlSprinkler", { target: "tankWork", state: 1 }), Oe();
    }
    async function Be() {
      i.value = 1, Oe();
    }
    function Se() {
      !p.value || !m.value || (d.value--, d.value > 0 && setTimeout(Se, 1e3));
    }
    function Oe() {
      if (!p.value || !m.value) return;
      s.value = "run", a.value = n.value, d.value = a.value, b.value = Date.now(), Se();
      let F = Date.now();
      w("controlSprinkler", { target: "manual", index: i.value, state: 1 }), A = setInterval(() => {
        let E = Date.now() - F, W = Math.min(E / (a.value * 1e3), 1);
        l.value[i.value - 1] = W * 100;
      }, 100), M = setTimeout(async () => {
        clearInterval(A), i.value < 12 ? (l.value[i.value - 1] = 0, w("controlSprinkler", { target: "manual", index: i.value, state: 0 }), Ve()) : (l.value[i.value - 1] = 0, w("controlSprinkler", { target: "manual", index: i.value, state: 0 }), He());
      }, a.value * 1e3);
    }
    function Ve() {
      !p.value || !m.value || (f.value = r.value, d.value = f.value, b.value = Date.now(), d.value > 0 && (s.value = "interval"), Se(), M = setTimeout(() => {
        i.value++, Oe();
      }, f.value * 1e3));
    }
    async function He() {
      !p.value || !m.value || (e.value = o.value, d.value = e.value, d.value > 0 ? (w("controlSprinkler", { target: "tankWork", state: 0 }), await B(0, "runLoopInterval"), w("controlSprinkler", { target: "setState", state: !0 }), b.value = Date.now(), s.value = "loop", Se(), i.value = 0, M = setTimeout(async () => {
        l.value = Array(12).fill(0), w("controlSprinkler", { target: "setState", state: !1 }), G.value && await Y(), w("controlSprinkler", { target: "tankWork", state: 0 }), await Ae();
      }, e.value * 1e3)) : (i.value = 0, l.value = Array(12).fill(0), await Be()));
    }
    function U(F) {
      return l.value[F - 1];
    }
    async function $(F) {
      if (m.value) return;
      const E = l.value.findIndex((W) => W === 100);
      l.value[F - 1] > 0 ? (l.value[F - 1] = 0, O.isPyQtWebEngine && (w("controlSprinkler", { target: "manual", index: F, state: 0 }), w("controlSprinkler", { target: "tankWork", state: 0 }))) : E !== -1 ? (l.value[E] = 0, O.isPyQtWebEngine && w("controlSprinkler", { target: "manual", index: E + 1, state: 0 }), l.value[F - 1] = 100, O.isPyQtWebEngine && w("controlSprinkler", { target: "manual", index: F, state: 1 })) : (await B(1, "toggleManualSprinkler"), w("controlSprinkler", { target: "tankWork", state: 1 }), l.value[F - 1] = 100, O.isPyQtWebEngine && w("controlSprinkler", { target: "manual", index: F, state: 1 }));
    }
    return (F, E) => (Pe(), Ne("div", bn, [
      E[15] || (E[15] = P("h2", null, "集成控制系统", -1)),
      P("div", wn, [
        P("button", {
          onClick: E[0] || (E[0] = (W) => te("auto")),
          disabled: g.value,
          class: it([{ active: m.value }, "mode-btn"])
        }, "自动模式", 10, xn),
        P("button", {
          onClick: E[1] || (E[1] = (W) => te("manual")),
          disabled: g.value,
          class: it([{ active: !m.value }, "mode-btn"])
        }, "手动模式", 10, kn),
        P("button", {
          onClick: me,
          disabled: p.value || !m.value || g.value,
          class: "control-btn"
        }, "开始", 8, Sn),
        P("button", {
          onClick: fe,
          disabled: !p.value || !m.value || g.value,
          class: "control-btn"
        }, "停止", 8, On)
      ]),
      P("div", _n, [
        P("div", jn, [
          E[10] || (E[10] = P("h3", null, "雾化机控制系统", -1)),
          P("div", En, [
            P("div", Cn, [
              P("div", Tn, [
                E[7] || (E[7] = P("h4", null, "左雾化机", -1)),
                P("div", {
                  class: it(["status", { on: G.value }])
                }, [
                  E[6] || (E[6] = P("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + De(G.value ? "开" : "关"), 1)
                ], 2),
                P("button", {
                  onClick: ae,
                  disabled: m.value || g.value,
                  class: "control-btn"
                }, De(G.value ? "关闭" : "开启"), 9, An)
              ]),
              P("div", Ln, [
                E[9] || (E[9] = P("h4", null, "右雾化机", -1)),
                P("div", {
                  class: it(["status", { on: ee.value }])
                }, [
                  E[8] || (E[8] = P("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + De(ee.value ? "开" : "关"), 1)
                ], 2),
                P("button", {
                  onClick: ae,
                  disabled: m.value || g.value,
                  class: "control-btn"
                }, De(ee.value ? "关闭" : "开启"), 9, Pn)
              ])
            ])
          ])
        ]),
        P("div", Nn, [
          E[14] || (E[14] = P("h3", null, "喷淋系统", -1)),
          P("div", Bn, [
            P("div", In, [
              E[11] || (E[11] = P("label", null, "单次运行时间 (秒):", -1)),
              P("input", {
                type: "text",
                value: t.value,
                onFocus: E[2] || (E[2] = (W) => Z("singleRunTime")),
                readonly: ""
              }, null, 40, Rn)
            ]),
            P("div", Mn, [
              E[12] || (E[12] = P("label", null, "运行时间间隔 (秒):", -1)),
              P("input", {
                type: "text",
                value: u.value,
                onFocus: E[3] || (E[3] = (W) => Z("runIntervalTime")),
                readonly: ""
              }, null, 40, Un)
            ]),
            P("div", $n, [
              E[13] || (E[13] = P("label", null, "循环时间间隔 (秒):", -1)),
              P("input", {
                type: "text",
                value: c.value,
                onFocus: E[4] || (E[4] = (W) => Z("loopInterval")),
                readonly: ""
              }, null, 40, Dn)
            ])
          ]),
          P("div", Fn, [
            (Pe(), Ne(at, null, ut(12, (W) => P("div", {
              key: W,
              class: it(["sprinkler", { active: m.value ? i.value === W : l.value[W - 1] > 0 }]),
              onClick: (J) => !g.value && !m.value && !G.value && $(W)
            }, [
              P("div", {
                class: "water",
                style: St({ height: U(W) + "%" })
              }, null, 4),
              P("span", null, De(W), 1)
            ], 10, Vn)), 64))
          ]),
          P("div", Wn, De(S.value), 1)
        ])
      ]),
      Xe(Et, {
        modelValue: y.value,
        showKeyboard: v.value,
        "onUpdate:modelValue": L,
        "onUpdate:showKeyboard": E[5] || (E[5] = (W) => v.value = W)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, zn = /* @__PURE__ */ ot(qn, [["__scopeId", "data-v-27527e6a"]]), Qn = { class: "data-actions" }, Kn = {
  key: 0,
  class: "modal-overlay"
}, Hn = {
  key: 1,
  class: "modal-overlay"
}, Gn = { class: "modal-content" }, Yn = {
  __name: "DataExport",
  setup(ye) {
    const { sendToPyQt: G } = rt(), ee = ht({
      isPyQtWebEngine: !1
    }), a = ne(!1), f = ne(!1), e = ne("");
    ct(() => {
      ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      ee.isPyQtWebEngine && (console.log("导出数据"), G("exportData", !0));
    }, r = () => {
      a.value = !0;
    }, o = () => {
      a.value = !1;
    }, t = () => {
      console.log("清空数据"), a.value = !1, u("所有数据已清空！"), ee.isPyQtWebEngine && G("exportData", !1);
    }, u = (i) => {
      e.value = i, f.value = !0;
    }, c = () => {
      f.value = !1;
    };
    return (i, s) => (Pe(), Ne("div", Qn, [
      P("div", { class: "action-buttons" }, [
        P("div", { class: "button-group" }, [
          s[0] || (s[0] = P("i", { class: "fas fa-file-excel" }, null, -1)),
          P("button", {
            onClick: n,
            class: "export-btn"
          }, "导出数据")
        ]),
        P("div", { class: "button-group" }, [
          s[1] || (s[1] = P("i", { class: "fas fa-trash-alt" }, null, -1)),
          P("button", {
            onClick: r,
            class: "clear-btn"
          }, "清空数据")
        ])
      ]),
      a.value ? (Pe(), Ne("div", Kn, [
        P("div", { class: "modal-content" }, [
          s[2] || (s[2] = P("p", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          P("div", { class: "modal-buttons" }, [
            P("button", {
              onClick: t,
              class: "confirm-btn"
            }, "确定"),
            P("button", {
              onClick: o,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ft("", !0),
      f.value ? (Pe(), Ne("div", Hn, [
        P("div", Gn, [
          P("p", null, De(e.value), 1),
          P("div", { class: "modal-buttons" }, [
            P("button", {
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
(function(ye, G) {
  (function(ee, a) {
    ye.exports = a(Lt);
  })(typeof self < "u" ? self : Jn, function(ee) {
    return function(a) {
      var f = {};
      function e(n) {
        if (f[n]) return f[n].exports;
        var r = f[n] = { i: n, l: !1, exports: {} };
        return a[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports;
      }
      return e.m = a, e.c = f, e.d = function(n, r, o) {
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
    }({ "00ee": function(a, f, e) {
      var n = e("b622"), r = n("toStringTag"), o = {};
      o[r] = "z", a.exports = String(o) === "[object z]";
    }, "0366": function(a, f, e) {
      var n = e("1c0b");
      a.exports = function(r, o, t) {
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
            return function(u, c, i) {
              return r.call(o, u, c, i);
            };
        }
        return function() {
          return r.apply(o, arguments);
        };
      };
    }, "057f": function(a, f, e) {
      var n = e("fc6a"), r = e("241c").f, o = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], u = function(c) {
        try {
          return r(c);
        } catch {
          return t.slice();
        }
      };
      a.exports.f = function(c) {
        return t && o.call(c) == "[object Window]" ? u(c) : r(n(c));
      };
    }, "06cf": function(a, f, e) {
      var n = e("83ab"), r = e("d1e7"), o = e("5c6c"), t = e("fc6a"), u = e("c04e"), c = e("5135"), i = e("0cfb"), s = Object.getOwnPropertyDescriptor;
      f.f = n ? s : function(l, d) {
        if (l = t(l), d = u(d, !0), i) try {
          return s(l, d);
        } catch {
        }
        if (c(l, d)) return o(!r.f.call(l, d), l[d]);
      };
    }, "0a06": function(a, f, e) {
      var n = e("c532"), r = e("30b5"), o = e("f6b4"), t = e("5270"), u = e("4a7b");
      function c(i) {
        this.defaults = i, this.interceptors = { request: new o(), response: new o() };
      }
      c.prototype.request = function(i) {
        typeof i == "string" ? (i = arguments[1] || {}, i.url = arguments[0]) : i = i || {}, i = u(this.defaults, i), i.method ? i.method = i.method.toLowerCase() : this.defaults.method ? i.method = this.defaults.method.toLowerCase() : i.method = "get";
        var s = [t, void 0], l = Promise.resolve(i);
        for (this.interceptors.request.forEach(function(d) {
          s.unshift(d.fulfilled, d.rejected);
        }), this.interceptors.response.forEach(function(d) {
          s.push(d.fulfilled, d.rejected);
        }); s.length; ) l = l.then(s.shift(), s.shift());
        return l;
      }, c.prototype.getUri = function(i) {
        return i = u(this.defaults, i), r(i.url, i.params, i.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(i) {
        c.prototype[i] = function(s, l) {
          return this.request(u(l || {}, { method: i, url: s, data: (l || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(i) {
        c.prototype[i] = function(s, l, d) {
          return this.request(u(d || {}, { method: i, url: s, data: l }));
        };
      }), a.exports = c;
    }, "0cb2": function(a, f, e) {
      var n = e("7b0b"), r = Math.floor, o = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, u = /\$([$&'`]|\d{1,2})/g;
      a.exports = function(c, i, s, l, d, m) {
        var p = s + c.length, v = l.length, h = u;
        return d !== void 0 && (d = n(d), h = t), o.call(m, h, function(y, g) {
          var j;
          switch (g.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return i.slice(0, s);
            case "'":
              return i.slice(p);
            case "<":
              j = d[g.slice(1, -1)];
              break;
            default:
              var C = +g;
              if (C === 0) return y;
              if (C > v) {
                var x = r(C / 10);
                return x === 0 ? y : x <= v ? l[x - 1] === void 0 ? g.charAt(1) : l[x - 1] + g.charAt(1) : y;
              }
              j = l[C - 1];
          }
          return j === void 0 ? "" : j;
        });
      };
    }, "0cfb": function(a, f, e) {
      var n = e("83ab"), r = e("d039"), o = e("cc12");
      a.exports = !n && !r(function() {
        return Object.defineProperty(o("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(a, f, e) {
      a.exports = function(n) {
        return function(r) {
          return n.apply(null, r);
        };
      };
    }, 1148: function(a, f, e) {
      var n = e("a691"), r = e("1d80");
      a.exports = "".repeat || function(o) {
        var t = String(r(this)), u = "", c = n(o);
        if (c < 0 || c == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; c > 0; (c >>>= 1) && (t += t)) 1 & c && (u += t);
        return u;
      };
    }, 1276: function(a, f, e) {
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), c = e("8aa5"), i = e("50c4"), s = e("14c3"), l = e("9263"), d = e("d039"), m = [].push, p = Math.min, v = 4294967295, h = !d(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(y, g, j) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(x, w) {
          var b = String(t(this)), O = w === void 0 ? v : w >>> 0;
          if (O === 0) return [];
          if (x === void 0) return [b];
          if (!r(x)) return g.call(b, x, O);
          for (var _, T, S, M = [], A = (x.ignoreCase ? "i" : "") + (x.multiline ? "m" : "") + (x.unicode ? "u" : "") + (x.sticky ? "y" : ""), B = 0, te = new RegExp(x.source, A + "g"); (_ = l.call(te, b)) && (T = te.lastIndex, !(T > B && (M.push(b.slice(B, _.index)), _.length > 1 && _.index < b.length && m.apply(M, _.slice(1)), S = _[0].length, B = T, M.length >= O))); )
            te.lastIndex === _.index && te.lastIndex++;
          return B === b.length ? !S && te.test("") || M.push("") : M.push(b.slice(B)), M.length > O ? M.slice(0, O) : M;
        } : "0".split(void 0, 0).length ? function(x, w) {
          return x === void 0 && w === 0 ? [] : g.call(this, x, w);
        } : g, [function(x, w) {
          var b = t(this), O = x == null ? void 0 : x[y];
          return O !== void 0 ? O.call(x, b, w) : C.call(String(b), x, w);
        }, function(x, w) {
          var b = j(C, x, this, w, C !== g);
          if (b.done) return b.value;
          var O = o(x), _ = String(this), T = u(O, RegExp), S = O.unicode, M = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (h ? "y" : "g"), A = new T(h ? O : "^(?:" + O.source + ")", M), B = w === void 0 ? v : w >>> 0;
          if (B === 0) return [];
          if (_.length === 0) return s(A, _) === null ? [_] : [];
          for (var te = 0, Y = 0, ae = []; Y < _.length; ) {
            A.lastIndex = h ? Y : 0;
            var Z, L = s(A, h ? _ : _.slice(Y));
            if (L === null || (Z = p(i(A.lastIndex + (h ? 0 : Y)), _.length)) === te) Y = c(_, Y, S);
            else {
              if (ae.push(_.slice(te, Y)), ae.length === B) return ae;
              for (var N = 1; N <= L.length - 1; N++) if (ae.push(L[N]), ae.length === B) return ae;
              Y = te = Z;
            }
          }
          return ae.push(_.slice(te)), ae;
        }];
      }, !h);
    }, "13d5": function(a, f, e) {
      var n = e("23e7"), r = e("d58f").left, o = e("a640"), t = e("2d00"), u = e("605d"), c = o("reduce"), i = !u && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !c || i }, { reduce: function(s) {
        return r(this, s, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(a, f, e) {
      var n = e("c6b6"), r = e("9263");
      a.exports = function(o, t) {
        var u = o.exec;
        if (typeof u == "function") {
          var c = u.call(o, t);
          if (typeof c != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return c;
        }
        if (n(o) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return r.call(o, t);
      };
    }, "159b": function(a, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("17c2"), t = e("9112");
      for (var u in r) {
        var c = n[u], i = c && c.prototype;
        if (i && i.forEach !== o) try {
          t(i, "forEach", o);
        } catch {
          i.forEach = o;
        }
      }
    }, "17c2": function(a, f, e) {
      var n = e("b727").forEach, r = e("a640"), o = r("forEach");
      a.exports = o ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(a, f) {
      a.exports = function(e, n, r) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
        return e;
      };
    }, "1be4": function(a, f, e) {
      var n = e("d066");
      a.exports = n("document", "documentElement");
    }, "1c0b": function(a, f) {
      a.exports = function(e) {
        if (typeof e != "function") throw TypeError(String(e) + " is not a function");
        return e;
      };
    }, "1c7e": function(a, f, e) {
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
      a.exports = function(c, i) {
        if (!i && !o) return !1;
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
    }, "1cdc": function(a, f, e) {
      var n = e("342f");
      a.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(a, f, e) {
      a.exports = function(n, r) {
        return function() {
          for (var o = new Array(arguments.length), t = 0; t < o.length; t++) o[t] = arguments[t];
          return n.apply(r, o);
        };
      };
    }, "1d80": function(a, f) {
      a.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(a, f, e) {
      var n = e("d039"), r = e("b622"), o = e("2d00"), t = r("species");
      a.exports = function(u) {
        return o >= 51 || !n(function() {
          var c = [], i = c.constructor = {};
          return i[t] = function() {
            return { foo: 1 };
          }, c[u](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(a, f, e) {
      (function(n) {
        (function(r, o) {
          a.exports = o();
        })(0, function() {
          function r(U, $) {
            return $ = { exports: {} }, U($, $.exports), $.exports;
          }
          var o = r(function(U, $) {
            (function(F, E) {
              U.exports = E();
            })(0, function() {
              function F(ue) {
                var we = ue && typeof ue == "object";
                return we && Object.prototype.toString.call(ue) !== "[object RegExp]" && Object.prototype.toString.call(ue) !== "[object Date]";
              }
              function E(ue) {
                return Array.isArray(ue) ? [] : {};
              }
              function W(ue, we) {
                var ke = we && we.clone === !0;
                return ke && F(ue) ? he(E(ue), ue, we) : ue;
              }
              function J(ue, we, ke) {
                var Ie = ue.slice();
                return we.forEach(function(je, We) {
                  typeof Ie[We] > "u" ? Ie[We] = W(je, ke) : F(je) ? Ie[We] = he(ue[We], je, ke) : ue.indexOf(je) === -1 && Ie.push(W(je, ke));
                }), Ie;
              }
              function ge(ue, we, ke) {
                var Ie = {};
                return F(ue) && Object.keys(ue).forEach(function(je) {
                  Ie[je] = W(ue[je], ke);
                }), Object.keys(we).forEach(function(je) {
                  F(we[je]) && ue[je] ? Ie[je] = he(ue[je], we[je], ke) : Ie[je] = W(we[je], ke);
                }), Ie;
              }
              function he(ue, we, ke) {
                var Ie = Array.isArray(we), je = ke || { arrayMerge: J }, We = je.arrayMerge || J;
                return Ie ? Array.isArray(ue) ? We(ue, we, ke) : W(we, ke) : ge(ue, we, ke);
              }
              return he.all = function(ue, we) {
                if (!Array.isArray(ue) || ue.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ue.reduce(function(ke, Ie) {
                  return he(ke, Ie, we);
                });
              }, he;
            });
          });
          function t(U) {
            return U = U || /* @__PURE__ */ Object.create(null), { on: function($, F) {
              (U[$] || (U[$] = [])).push(F);
            }, off: function($, F) {
              U[$] && U[$].splice(U[$].indexOf(F) >>> 0, 1);
            }, emit: function($, F) {
              (U[$] || []).map(function(E) {
                E(F);
              }), (U["*"] || []).map(function(E) {
                E($, F);
              });
            } };
          }
          var u = r(function(U, $) {
            var F = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            $.default = F, U.exports = $.default;
          }), c = function(U) {
            return Object.keys(U).map(function($) {
              var F = U[$].toString().replace(/"/g, "&quot;");
              return $ + '="' + F + '"';
            }).join(" ");
          }, i = u.svg, s = u.xlink, l = {};
          l[i.name] = i.uri, l[s.name] = s.uri;
          var d, m = function(U, $) {
            U === void 0 && (U = "");
            var F = o(l, $ || {}), E = c(F);
            return "<svg " + E + ">" + U + "</svg>";
          }, p = u.svg, v = u.xlink, h = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[p.name] = p.uri, d[v.name] = v.uri, d) }, y = function(U) {
            this.config = o(h, U || {}), this.symbols = [];
          };
          y.prototype.add = function(U) {
            var $ = this, F = $.symbols, E = this.find(U.id);
            return E ? (F[F.indexOf(E)] = U, !1) : (F.push(U), !0);
          }, y.prototype.remove = function(U) {
            var $ = this, F = $.symbols, E = this.find(U);
            return !!E && (F.splice(F.indexOf(E), 1), E.destroy(), !0);
          }, y.prototype.find = function(U) {
            return this.symbols.filter(function($) {
              return $.id === U;
            })[0] || null;
          }, y.prototype.has = function(U) {
            return this.find(U) !== null;
          }, y.prototype.stringify = function() {
            var U = this.config, $ = U.attrs, F = this.symbols.map(function(E) {
              return E.stringify();
            }).join("");
            return m(F, $);
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            this.symbols.forEach(function(U) {
              return U.destroy();
            });
          };
          var g = function(U) {
            var $ = U.id, F = U.viewBox, E = U.content;
            this.id = $, this.viewBox = F, this.content = E;
          };
          g.prototype.stringify = function() {
            return this.content;
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            var U = this;
            ["id", "viewBox", "content"].forEach(function($) {
              return delete U[$];
            });
          };
          var j = function(U) {
            var $ = !!document.importNode, F = new DOMParser().parseFromString(U, "image/svg+xml").documentElement;
            return $ ? document.importNode(F, !0) : F;
          }, C = function(U) {
            function $() {
              U.apply(this, arguments);
            }
            U && ($.__proto__ = U), $.prototype = Object.create(U && U.prototype), $.prototype.constructor = $;
            var F = { isMounted: {} };
            return F.isMounted.get = function() {
              return !!this.node;
            }, $.createFromExistingNode = function(E) {
              return new $({ id: E.getAttribute("id"), viewBox: E.getAttribute("viewBox"), content: E.outerHTML });
            }, $.prototype.destroy = function() {
              this.isMounted && this.unmount(), U.prototype.destroy.call(this);
            }, $.prototype.mount = function(E) {
              if (this.isMounted) return this.node;
              var W = typeof E == "string" ? document.querySelector(E) : E, J = this.render();
              return this.node = J, W.appendChild(J), J;
            }, $.prototype.render = function() {
              var E = this.stringify();
              return j(m(E)).childNodes[0];
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties($.prototype, F), $;
          }(g), x = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, w = function(U) {
            return Array.prototype.slice.call(U, 0);
          }, b = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, O = function(U, $) {
            var F = document.createEvent("CustomEvent");
            F.initCustomEvent(U, !1, !1, $), window.dispatchEvent(F);
          }, _ = function(U) {
            var $ = [];
            return w(U.querySelectorAll("style")).forEach(function(F) {
              F.textContent += "", $.push(F);
            }), $;
          }, T = function(U) {
            return (U || window.location.href).split("#")[0];
          }, S = function(U) {
            angular.module("ng").run(["$rootScope", function($) {
              $.$on("$locationChangeSuccess", function(F, E, W) {
                O(U, { oldUrl: W, newUrl: E });
              });
            }]);
          }, M = "linearGradient, radialGradient, pattern, mask, clipPath", A = function(U, $) {
            return $ === void 0 && ($ = M), w(U.querySelectorAll("symbol")).forEach(function(F) {
              w(F.querySelectorAll($)).forEach(function(E) {
                F.parentNode.insertBefore(E, F);
              });
            }), U;
          };
          function B(U, $) {
            var F = w(U).reduce(function(E, W) {
              if (!W.attributes) return E;
              var J = w(W.attributes), ge = $ ? J.filter($) : J;
              return E.concat(ge);
            }, []);
            return F;
          }
          var te = u.xlink.uri, Y = "xlink:href", ae = /[{}|\\\^\[\]`"<>]/g;
          function Z(U) {
            return U.replace(ae, function($) {
              return "%" + $[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L(U) {
            return U.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function N(U, $, F) {
            return w(U).forEach(function(E) {
              var W = E.getAttribute(Y);
              if (W && W.indexOf($) === 0) {
                var J = W.replace($, F);
                E.setAttributeNS(te, Y, J);
              }
            }), U;
          }
          var K, H = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], V = H.map(function(U) {
            return "[" + U + "]";
          }).join(","), me = function(U, $, F, E) {
            var W = Z(F), J = Z(E), ge = U.querySelectorAll(V), he = B(ge, function(ue) {
              var we = ue.localName, ke = ue.value;
              return H.indexOf(we) !== -1 && ke.indexOf("url(" + W) !== -1;
            });
            he.forEach(function(ue) {
              return ue.value = ue.value.replace(new RegExp(L(W), "g"), J);
            }), N($, W, J);
          }, fe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Te = function(U) {
            function $(E) {
              var W = this;
              E === void 0 && (E = {}), U.call(this, o(x, E));
              var J = t();
              this._emitter = J, this.node = null;
              var ge = this, he = ge.config;
              if (he.autoConfigure && this._autoConfigure(E), he.syncUrlsWithBaseTag) {
                var ue = document.getElementsByTagName("base")[0].getAttribute("href");
                J.on(fe.MOUNT, function() {
                  return W.updateUrls("#", ue);
                });
              }
              var we = this._handleLocationChange.bind(this);
              this._handleLocationChange = we, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, we), he.locationChangeAngularEmitter && S(he.locationChangeEvent), J.on(fe.MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && A(ke);
              }), J.on(fe.SYMBOL_MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && A(ke.parentNode), (b.isIE() || b.isEdge()) && _(ke);
              });
            }
            U && ($.__proto__ = U), $.prototype = Object.create(U && U.prototype), $.prototype.constructor = $;
            var F = { isMounted: {} };
            return F.isMounted.get = function() {
              return !!this.node;
            }, $.prototype._autoConfigure = function(E) {
              var W = this, J = W.config;
              typeof E.syncUrlsWithBaseTag > "u" && (J.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof E.locationChangeAngularEmitter > "u" && (J.locationChangeAngularEmitter = typeof window.angular < "u"), typeof E.moveGradientsOutsideSymbol > "u" && (J.moveGradientsOutsideSymbol = b.isFirefox());
            }, $.prototype._handleLocationChange = function(E) {
              var W = E.detail, J = W.oldUrl, ge = W.newUrl;
              this.updateUrls(J, ge);
            }, $.prototype.add = function(E) {
              var W = this, J = U.prototype.add.call(this, E);
              return this.isMounted && J && (E.mount(W.node), this._emitter.emit(fe.SYMBOL_MOUNT, E.node)), J;
            }, $.prototype.attach = function(E) {
              var W = this, J = this;
              if (J.isMounted) return J.node;
              var ge = typeof E == "string" ? document.querySelector(E) : E;
              return J.node = ge, this.symbols.forEach(function(he) {
                he.mount(J.node), W._emitter.emit(fe.SYMBOL_MOUNT, he.node);
              }), w(ge.querySelectorAll("symbol")).forEach(function(he) {
                var ue = C.createFromExistingNode(he);
                ue.node = he, J.add(ue);
              }), this._emitter.emit(fe.MOUNT, ge), ge;
            }, $.prototype.destroy = function() {
              var E = this, W = E.config, J = E.symbols, ge = E._emitter;
              J.forEach(function(he) {
                return he.destroy();
              }), ge.off("*"), window.removeEventListener(W.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, $.prototype.mount = function(E, W) {
              E === void 0 && (E = this.config.mountTo), W === void 0 && (W = !1);
              var J = this;
              if (J.isMounted) return J.node;
              var ge = typeof E == "string" ? document.querySelector(E) : E, he = J.render();
              return this.node = he, W && ge.childNodes[0] ? ge.insertBefore(he, ge.childNodes[0]) : ge.appendChild(he), this._emitter.emit(fe.MOUNT, he), he;
            }, $.prototype.render = function() {
              return j(this.stringify());
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, $.prototype.updateUrls = function(E, W) {
              if (!this.isMounted) return !1;
              var J = document.querySelectorAll(this.config.usagesToUpdate);
              return me(this.node, J, T(E) + "#", T(W) + "#"), !0;
            }, Object.defineProperties($.prototype, F), $;
          }(y), Ae = r(function(U) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function($, F) {
              U.exports = F();
            })(0, function() {
              var $, F = [], E = document, W = E.documentElement.doScroll, J = "DOMContentLoaded", ge = (W ? /^loaded|^c/ : /^loaded|^i|^c/).test(E.readyState);
              return ge || E.addEventListener(J, $ = function() {
                for (E.removeEventListener(J, $), ge = 1; $ = F.shift(); ) $();
              }), function(he) {
                ge ? setTimeout(he, 0) : F.push(he);
              };
            });
          }), Be = "__SVG_SPRITE_NODE__", Se = "__SVG_SPRITE__", Oe = !!window[Se];
          Oe ? K = window[Se] : (K = new Te({ attrs: { id: Be, "aria-hidden": "true" } }), window[Se] = K);
          var Ve = function() {
            var U = document.getElementById(Be);
            U ? K.attach(U) : K.mount(document.body, !0);
          };
          document.body ? Ve() : Ae(Ve);
          var He = K;
          return He;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(a, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), c = e("2a62"), i = function(s, l) {
        this.stopped = s, this.result = l;
      };
      a.exports = function(s, l, d) {
        var m, p, v, h, y, g, j, C = d && d.that, x = !(!d || !d.AS_ENTRIES), w = !(!d || !d.IS_ITERATOR), b = !(!d || !d.INTERRUPTED), O = t(l, C, 1 + x + b), _ = function(S) {
          return m && c(m), new i(!0, S);
        }, T = function(S) {
          return x ? (n(S), b ? O(S[0], S[1], _) : O(S[0], S[1])) : b ? O(S, _) : O(S);
        };
        if (w) m = s;
        else {
          if (p = u(s), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, h = o(s.length); h > v; v++) if (y = T(s[v]), y && y instanceof i) return y;
            return new i(!1);
          }
          m = p.call(s);
        }
        for (g = m.next; !(j = g.call(m)).done; ) {
          try {
            y = T(j.value);
          } catch (S) {
            throw c(m), S;
          }
          if (typeof y == "object" && y && y instanceof i) return y;
        }
        return new i(!1);
      };
    }, "23cb": function(a, f, e) {
      var n = e("a691"), r = Math.max, o = Math.min;
      a.exports = function(t, u) {
        var c = n(t);
        return c < 0 ? r(c + u, 0) : o(c, u);
      };
    }, "23e7": function(a, f, e) {
      var n = e("da84"), r = e("06cf").f, o = e("9112"), t = e("6eeb"), u = e("ce4e"), c = e("e893"), i = e("94ca");
      a.exports = function(s, l) {
        var d, m, p, v, h, y, g = s.target, j = s.global, C = s.stat;
        if (m = j ? n : C ? n[g] || u(g, {}) : (n[g] || {}).prototype, m) for (p in l) {
          if (h = l[p], s.noTargetGet ? (y = r(m, p), v = y && y.value) : v = m[p], d = i(j ? p : g + (C ? "." : "#") + p, s.forced), !d && v !== void 0) {
            if (typeof h == typeof v) continue;
            c(h, v);
          }
          (s.sham || v && v.sham) && o(h, "sham", !0), t(m, p, h, s);
        }
      };
    }, "241c": function(a, f, e) {
      var n = e("ca84"), r = e("7839"), o = r.concat("length", "prototype");
      f.f = Object.getOwnPropertyNames || function(t) {
        return n(t, o);
      };
    }, 2444: function(a, f, e) {
      (function(n) {
        var r = e("c532"), o = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function u(s, l) {
          !r.isUndefined(s) && r.isUndefined(s["Content-Type"]) && (s["Content-Type"] = l);
        }
        function c() {
          var s;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (s = e("b50d")), s;
        }
        var i = { adapter: c(), transformRequest: [function(s, l) {
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
          i.headers[s] = {};
        }), r.forEach(["post", "put", "patch"], function(s) {
          i.headers[s] = r.merge(t);
        }), a.exports = i;
      }).call(this, e("4362"));
    }, 2532: function(a, f, e) {
      var n = e("23e7"), r = e("5a34"), o = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(u) {
        return !!~String(o(this)).indexOf(r(u), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(a, f, e) {
      var n = e("6eeb"), r = e("825a"), o = e("d039"), t = e("ad6d"), u = "toString", c = RegExp.prototype, i = c[u], s = o(function() {
        return i.call({ source: "a", flags: "b" }) != "/a/b";
      }), l = i.name != u;
      (s || l) && n(RegExp.prototype, u, function() {
        var d = r(this), m = String(d.source), p = d.flags, v = String(p === void 0 && d instanceof RegExp && !("flags" in c) ? t.call(d) : p);
        return "/" + m + "/" + v;
      }, { unsafe: !0 });
    }, 2626: function(a, f, e) {
      var n = e("d066"), r = e("9bf2"), o = e("b622"), t = e("83ab"), u = o("species");
      a.exports = function(c) {
        var i = n(c), s = r.f;
        t && i && !i[u] && s(i, u, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(a, f, e) {
      var n = e("825a");
      a.exports = function(r) {
        var o = r.return;
        if (o !== void 0) return n(o.call(r)).value;
      };
    }, "2cf4": function(a, f, e) {
      var n, r, o, t = e("da84"), u = e("d039"), c = e("0366"), i = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), m = t.location, p = t.setImmediate, v = t.clearImmediate, h = t.process, y = t.MessageChannel, g = t.Dispatch, j = 0, C = {}, x = "onreadystatechange", w = function(T) {
        if (C.hasOwnProperty(T)) {
          var S = C[T];
          delete C[T], S();
        }
      }, b = function(T) {
        return function() {
          w(T);
        };
      }, O = function(T) {
        w(T.data);
      }, _ = function(T) {
        t.postMessage(T + "", m.protocol + "//" + m.host);
      };
      p && v || (p = function(T) {
        for (var S = [], M = 1; arguments.length > M; ) S.push(arguments[M++]);
        return C[++j] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, S);
        }, n(j), j;
      }, v = function(T) {
        delete C[T];
      }, d ? n = function(T) {
        h.nextTick(b(T));
      } : g && g.now ? n = function(T) {
        g.now(b(T));
      } : y && !l ? (r = new y(), o = r.port2, r.port1.onmessage = O, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && m && m.protocol !== "file:" && !u(_) ? (n = _, t.addEventListener("message", O, !1)) : n = x in s("script") ? function(T) {
        i.appendChild(s("script"))[x] = function() {
          i.removeChild(this), w(T);
        };
      } : function(T) {
        setTimeout(b(T), 0);
      }), a.exports = { set: p, clear: v };
    }, "2d00": function(a, f, e) {
      var n, r, o = e("da84"), t = e("342f"), u = o.process, c = u && u.versions, i = c && c.v8;
      i ? (n = i.split("."), r = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (r = n[1]))), a.exports = r && +r;
    }, "2d83": function(a, f, e) {
      var n = e("387f");
      a.exports = function(r, o, t, u, c) {
        var i = new Error(r);
        return n(i, o, t, u, c);
      };
    }, "2e67": function(a, f, e) {
      a.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(a, f, e) {
      var n = e("c532");
      function r(o) {
        return encodeURIComponent(o).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      a.exports = function(o, t, u) {
        if (!t) return o;
        var c;
        if (u) c = u(t);
        else if (n.isURLSearchParams(t)) c = t.toString();
        else {
          var i = [];
          n.forEach(t, function(l, d) {
            l !== null && typeof l < "u" && (n.isArray(l) ? d += "[]" : l = [l], n.forEach(l, function(m) {
              n.isDate(m) ? m = m.toISOString() : n.isObject(m) && (m = JSON.stringify(m)), i.push(r(d) + "=" + r(m));
            }));
          }), c = i.join("&");
        }
        if (c) {
          var s = o.indexOf("#");
          s !== -1 && (o = o.slice(0, s)), o += (o.indexOf("?") === -1 ? "?" : "&") + c;
        }
        return o;
      };
    }, "342f": function(a, f, e) {
      var n = e("d066");
      a.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(a, f, e) {
      var n = e("f5df"), r = e("3f8c"), o = e("b622"), t = o("iterator");
      a.exports = function(u) {
        if (u != null) return u[t] || u["@@iterator"] || r[n(u)];
      };
    }, "37e8": function(a, f, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("825a"), t = e("df75");
      a.exports = n ? Object.defineProperties : function(u, c) {
        o(u);
        for (var i, s = t(c), l = s.length, d = 0; l > d; ) r.f(u, i = s[d++], c[i]);
        return u;
      };
    }, "387f": function(a, f, e) {
      a.exports = function(n, r, o, t, u) {
        return n.config = r, o && (n.code = o), n.request = t, n.response = u, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(a, f, e) {
      e("acce");
    }, 3934: function(a, f, e) {
      var n = e("c532");
      a.exports = n.isStandardBrowserEnv() ? function() {
        var r, o = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function u(c) {
          var i = c;
          return o && (t.setAttribute("href", i), i = t.href), t.setAttribute("href", i), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return r = u(window.location.href), function(c) {
          var i = n.isString(c) ? u(c) : c;
          return i.protocol === r.protocol && i.host === r.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(a, f, e) {
      var n = e("861d");
      a.exports = function(r) {
        if (!n(r) && r !== null) throw TypeError("Can't set " + String(r) + " as a prototype");
        return r;
      };
    }, "3ca3": function(a, f, e) {
      var n = e("6547").charAt, r = e("69f3"), o = e("7dd0"), t = "String Iterator", u = r.set, c = r.getterFor(t);
      o(String, "String", function(i) {
        u(this, { type: t, string: String(i), index: 0 });
      }, function() {
        var i, s = c(this), l = s.string, d = s.index;
        return d >= l.length ? { value: void 0, done: !0 } : (i = n(l, d), s.index += i.length, { value: i, done: !1 });
      });
    }, "3f8c": function(a, f) {
      a.exports = {};
    }, "408a": function(a, f, e) {
      var n = e("c6b6");
      a.exports = function(r) {
        if (typeof r != "number" && n(r) != "Number") throw TypeError("Incorrect invocation");
        return +r;
      };
    }, "428f": function(a, f, e) {
      var n = e("da84");
      a.exports = n;
    }, 4362: function(a, f, e) {
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
    }, "44ad": function(a, f, e) {
      var n = e("d039"), r = e("c6b6"), o = "".split;
      a.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return r(t) == "String" ? o.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(a, f, e) {
      var n = e("b622"), r = e("7c73"), o = e("9bf2"), t = n("unscopables"), u = Array.prototype;
      u[t] == null && o.f(u, t, { configurable: !0, value: r(null) }), a.exports = function(c) {
        u[t][c] = !0;
      };
    }, "44de": function(a, f, e) {
      var n = e("da84");
      a.exports = function(r, o) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(r) : t.error(r, o));
      };
    }, "44e7": function(a, f, e) {
      var n = e("861d"), r = e("c6b6"), o = e("b622"), t = o("match");
      a.exports = function(u) {
        var c;
        return n(u) && ((c = u[t]) !== void 0 ? !!c : r(u) == "RegExp");
      };
    }, "466d": function(a, f, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("1d80"), u = e("8aa5"), c = e("14c3");
      n("match", 1, function(i, s, l) {
        return [function(d) {
          var m = t(this), p = d == null ? void 0 : d[i];
          return p !== void 0 ? p.call(d, m) : new RegExp(d)[i](String(m));
        }, function(d) {
          var m = l(s, d, this);
          if (m.done) return m.value;
          var p = r(d), v = String(this);
          if (!p.global) return c(p, v);
          var h = p.unicode;
          p.lastIndex = 0;
          for (var y, g = [], j = 0; (y = c(p, v)) !== null; ) {
            var C = String(y[0]);
            g[j] = C, C === "" && (p.lastIndex = u(v, o(p.lastIndex), h)), j++;
          }
          return j === 0 ? null : g;
        }];
      });
    }, "467f": function(a, f, e) {
      var n = e("2d83");
      a.exports = function(r, o, t) {
        var u = t.config.validateStatus;
        t.status && u && !u(t.status) ? o(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : r(t);
      };
    }, 4840: function(a, f, e) {
      var n = e("825a"), r = e("1c0b"), o = e("b622"), t = o("species");
      a.exports = function(u, c) {
        var i, s = n(u).constructor;
        return s === void 0 || (i = n(s)[t]) == null ? c : r(i);
      };
    }, 4930: function(a, f, e) {
      var n = e("605d"), r = e("2d00"), o = e("d039");
      a.exports = !!Object.getOwnPropertySymbols && !o(function() {
        return !Symbol.sham && (n ? r === 38 : r > 37 && r < 41);
      });
    }, "4a7b": function(a, f, e) {
      var n = e("c532");
      a.exports = function(r, o) {
        o = o || {};
        var t = {}, u = ["url", "method", "data"], c = ["headers", "auth", "proxy", "params"], i = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], s = ["validateStatus"];
        function l(v, h) {
          return n.isPlainObject(v) && n.isPlainObject(h) ? n.merge(v, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function d(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = l(void 0, r[v])) : t[v] = l(r[v], o[v]);
        }
        n.forEach(u, function(v) {
          n.isUndefined(o[v]) || (t[v] = l(void 0, o[v]));
        }), n.forEach(c, d), n.forEach(i, function(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = l(void 0, r[v])) : t[v] = l(void 0, o[v]);
        }), n.forEach(s, function(v) {
          v in o ? t[v] = l(r[v], o[v]) : v in r && (t[v] = l(void 0, r[v]));
        });
        var m = u.concat(c).concat(i).concat(s), p = Object.keys(r).concat(Object.keys(o)).filter(function(v) {
          return m.indexOf(v) === -1;
        });
        return n.forEach(p, d), t;
      };
    }, "4d63": function(a, f, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, c = e("241c").f, i = e("44e7"), s = e("ad6d"), l = e("9f7f"), d = e("6eeb"), m = e("d039"), p = e("69f3").set, v = e("2626"), h = e("b622"), y = h("match"), g = r.RegExp, j = g.prototype, C = /a/g, x = /a/g, w = new g(C) !== C, b = l.UNSUPPORTED_Y, O = n && o("RegExp", !w || b || m(function() {
        return x[y] = !1, g(C) != C || g(x) == x || g(C, "i") != "/a/i";
      }));
      if (O) {
        for (var _ = function(A, B) {
          var te, Y = this instanceof _, ae = i(A), Z = B === void 0;
          if (!Y && ae && A.constructor === _ && Z) return A;
          w ? ae && !Z && (A = A.source) : A instanceof _ && (Z && (B = s.call(A)), A = A.source), b && (te = !!B && B.indexOf("y") > -1, te && (B = B.replace(/y/g, "")));
          var L = t(w ? new g(A, B) : g(A, B), Y ? this : j, _);
          return b && te && p(L, { sticky: te }), L;
        }, T = function(A) {
          A in _ || u(_, A, { configurable: !0, get: function() {
            return g[A];
          }, set: function(B) {
            g[A] = B;
          } });
        }, S = c(g), M = 0; S.length > M; ) T(S[M++]);
        j.constructor = _, _.prototype = j, d(r, "RegExp", _);
      }
      v("RegExp");
    }, "4d64": function(a, f, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(c, i, s) {
          var l, d = n(c), m = r(d.length), p = o(s, m);
          if (u && i != i) {
            for (; m > p; ) if (l = d[p++], l != l) return !0;
          } else for (; m > p; p++) if ((u || p in d) && d[p] === i) return u || p || 0;
          return !u && -1;
        };
      };
      a.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(a, f, e) {
      var n = e("23e7"), r = e("b727").filter, o = e("1dde"), t = o("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(a, f, e) {
      var n = e("0366"), r = e("7b0b"), o = e("9bdd"), t = e("e95a"), u = e("50c4"), c = e("8418"), i = e("35a1");
      a.exports = function(s) {
        var l, d, m, p, v, h, y = r(s), g = typeof this == "function" ? this : Array, j = arguments.length, C = j > 1 ? arguments[1] : void 0, x = C !== void 0, w = i(y), b = 0;
        if (x && (C = n(C, j > 2 ? arguments[2] : void 0, 2)), w == null || g == Array && t(w)) for (l = u(y.length), d = new g(l); l > b; b++) h = x ? C(y[b], b) : y[b], c(d, b, h);
        else for (p = w.call(y), v = p.next, d = new g(); !(m = v.call(p)).done; b++) h = x ? o(p, C, [m.value, b], !0) : m.value, c(d, b, h);
        return d.length = b, d;
      };
    }, "4f43": function(a, f, e) {
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
    }, "50c4": function(a, f, e) {
      var n = e("a691"), r = Math.min;
      a.exports = function(o) {
        return o > 0 ? r(n(o), 9007199254740991) : 0;
      };
    }, 5135: function(a, f) {
      var e = {}.hasOwnProperty;
      a.exports = function(n, r) {
        return e.call(n, r);
      };
    }, 5270: function(a, f, e) {
      var n = e("c532"), r = e("c401"), o = e("2e67"), t = e("2444");
      function u(c) {
        c.cancelToken && c.cancelToken.throwIfRequested();
      }
      a.exports = function(c) {
        u(c), c.headers = c.headers || {}, c.data = r(c.data, c.headers, c.transformRequest), c.headers = n.merge(c.headers.common || {}, c.headers[c.method] || {}, c.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(s) {
          delete c.headers[s];
        });
        var i = c.adapter || t.adapter;
        return i(c).then(function(s) {
          return u(c), s.data = r(s.data, s.headers, c.transformResponse), s;
        }, function(s) {
          return o(s) || (u(c), s && s.response && (s.response.data = r(s.response.data, s.response.headers, c.transformResponse))), Promise.reject(s);
        });
      };
    }, 5319: function(a, f, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), c = e("8aa5"), i = e("0cb2"), s = e("14c3"), l = Math.max, d = Math.min, m = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, v, h, y) {
        var g = y.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, j = y.REPLACE_KEEPS_$0, C = g ? "$" : "$0";
        return [function(x, w) {
          var b = u(this), O = x == null ? void 0 : x[p];
          return O !== void 0 ? O.call(x, b, w) : v.call(String(b), x, w);
        }, function(x, w) {
          if (!g && j || typeof w == "string" && w.indexOf(C) === -1) {
            var b = h(v, x, this, w);
            if (b.done) return b.value;
          }
          var O = r(x), _ = String(this), T = typeof w == "function";
          T || (w = String(w));
          var S = O.global;
          if (S) {
            var M = O.unicode;
            O.lastIndex = 0;
          }
          for (var A = []; ; ) {
            var B = s(O, _);
            if (B === null || (A.push(B), !S)) break;
            var te = String(B[0]);
            te === "" && (O.lastIndex = c(_, o(O.lastIndex), M));
          }
          for (var Y = "", ae = 0, Z = 0; Z < A.length; Z++) {
            B = A[Z];
            for (var L = String(B[0]), N = l(d(t(B.index), _.length), 0), K = [], H = 1; H < B.length; H++) K.push(m(B[H]));
            var V = B.groups;
            if (T) {
              var me = [L].concat(K, N, _);
              V !== void 0 && me.push(V);
              var fe = String(w.apply(void 0, me));
            } else fe = i(L, _, N, K, V, w);
            N >= ae && (Y += _.slice(ae, N) + fe, ae = N + L.length);
          }
          return Y + _.slice(ae);
        }];
      });
    }, "545a": function(a, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, 5530: function(a, f, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, r) {
        var o = n.document, t = o.documentElement, u = o.querySelector('meta[name="viewport"]'), c = o.querySelector('meta[name="flexible"]'), i = 0, s = 0, l = r.flexible || (r.flexible = {});
        if (u) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var d = u.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          d && (s = parseFloat(d[1]), i = parseInt(1 / s));
        } else if (c) {
          var m = c.getAttribute("content");
          if (m) {
            var p = m.match(/initial\-dpr=([\d\.]+)/), v = m.match(/maximum\-dpr=([\d\.]+)/);
            p && (i = parseFloat(p[1]), s = parseFloat((1 / i).toFixed(2))), v && (i = parseFloat(v[1]), s = parseFloat((1 / i).toFixed(2)));
          }
        }
        if (!i && !s) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), y = n.devicePixelRatio;
          i = h ? y >= 3 && (!i || i >= 3) ? 3 : y >= 2 && (!i || i >= 2) ? 2 : 1 : 1, s = 1 / i;
        }
        if (t.setAttribute("data-dpr", i), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var g = o.createElement("div");
          g.appendChild(u), o.write(g.innerHTML);
        }
        function j() {
          var C = t.getBoundingClientRect().width, x = C / 10;
          t.style.fontSize = x + "px", l.rem = n.rem = x;
        }
        n.addEventListener("resize", function() {
          j();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && j();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * i + "px" : o.addEventListener("DOMContentLoaded", function(C) {
          o.body.style.fontSize = 10 * i + "px";
        }, !1), j(), l.dpr = n.dpr = i, l.refreshRem = j, l.rem2px = function(C) {
          var x = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (x += "px"), x;
        }, l.px2rem = function(C) {
          var x = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (x += "rem"), x;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(a, f, e) {
      var n = e("c430"), r = e("c6cd");
      (a.exports = function(o, t) {
        return r[o] || (r[o] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(a, f, e) {
      var n = e("d066"), r = e("241c"), o = e("7418"), t = e("825a");
      a.exports = n("Reflect", "ownKeys") || function(u) {
        var c = r.f(t(u)), i = o.f;
        return i ? c.concat(i(u)) : c;
      };
    }, "5a34": function(a, f, e) {
      var n = e("44e7");
      a.exports = function(r) {
        if (n(r)) throw TypeError("The method doesn't accept regular expressions");
        return r;
      };
    }, "5c6c": function(a, f) {
      a.exports = function(e, n) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n };
      };
    }, "5f02": function(a, f, e) {
      a.exports = function(n) {
        return typeof n == "object" && n.isAxiosError === !0;
      };
    }, "605d": function(a, f, e) {
      var n = e("c6b6"), r = e("da84");
      a.exports = n(r.process) == "process";
    }, 6062: function(a, f, e) {
      var n = e("6d61"), r = e("6566");
      a.exports = n("Set", function(o) {
        return function() {
          return o(this, arguments.length ? arguments[0] : void 0);
        };
      }, r);
    }, 6547: function(a, f, e) {
      var n = e("a691"), r = e("1d80"), o = function(t) {
        return function(u, c) {
          var i, s, l = String(r(u)), d = n(c), m = l.length;
          return d < 0 || d >= m ? t ? "" : void 0 : (i = l.charCodeAt(d), i < 55296 || i > 56319 || d + 1 === m || (s = l.charCodeAt(d + 1)) < 56320 || s > 57343 ? t ? l.charAt(d) : i : t ? l.slice(d, d + 2) : s - 56320 + (i - 55296 << 10) + 65536);
        };
      };
      a.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(a, f, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), c = e("2266"), i = e("7dd0"), s = e("2626"), l = e("83ab"), d = e("f183").fastKey, m = e("69f3"), p = m.set, v = m.getterFor;
      a.exports = { getConstructor: function(h, y, g, j) {
        var C = h(function(O, _) {
          u(O, C, y), p(O, { type: y, index: r(null), first: void 0, last: void 0, size: 0 }), l || (O.size = 0), _ != null && c(_, O[j], { that: O, AS_ENTRIES: g });
        }), x = v(y), w = function(O, _, T) {
          var S, M, A = x(O), B = b(O, _);
          return B ? B.value = T : (A.last = B = { index: M = d(_, !0), key: _, value: T, previous: S = A.last, next: void 0, removed: !1 }, A.first || (A.first = B), S && (S.next = B), l ? A.size++ : O.size++, M !== "F" && (A.index[M] = B)), O;
        }, b = function(O, _) {
          var T, S = x(O), M = d(_);
          if (M !== "F") return S.index[M];
          for (T = S.first; T; T = T.next) if (T.key == _) return T;
        };
        return o(C.prototype, { clear: function() {
          for (var O = this, _ = x(O), T = _.index, S = _.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete T[S.index], S = S.next;
          _.first = _.last = void 0, l ? _.size = 0 : O.size = 0;
        }, delete: function(O) {
          var _ = this, T = x(_), S = b(_, O);
          if (S) {
            var M = S.next, A = S.previous;
            delete T.index[S.index], S.removed = !0, A && (A.next = M), M && (M.previous = A), T.first == S && (T.first = M), T.last == S && (T.last = A), l ? T.size-- : _.size--;
          }
          return !!S;
        }, forEach: function(O) {
          for (var _, T = x(this), S = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); _ = _ ? _.next : T.first; )
            for (S(_.value, _.key, this); _ && _.removed; ) _ = _.previous;
        }, has: function(O) {
          return !!b(this, O);
        } }), o(C.prototype, g ? { get: function(O) {
          var _ = b(this, O);
          return _ && _.value;
        }, set: function(O, _) {
          return w(this, O === 0 ? 0 : O, _);
        } } : { add: function(O) {
          return w(this, O = O === 0 ? 0 : O, O);
        } }), l && n(C.prototype, "size", { get: function() {
          return x(this).size;
        } }), C;
      }, setStrong: function(h, y, g) {
        var j = y + " Iterator", C = v(y), x = v(j);
        i(h, y, function(w, b) {
          p(this, { type: j, target: w, state: C(w), kind: b, last: void 0 });
        }, function() {
          for (var w = x(this), b = w.kind, O = w.last; O && O.removed; ) O = O.previous;
          return w.target && (w.last = O = O ? O.next : w.state.first) ? b == "keys" ? { value: O.key, done: !1 } : b == "values" ? { value: O.value, done: !1 } : { value: [O.key, O.value], done: !1 } : (w.target = void 0, { value: void 0, done: !0 });
        }, g ? "entries" : "values", !g, !0), s(y);
      } };
    }, "65f0": function(a, f, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      a.exports = function(u, c) {
        var i;
        return r(u) && (i = u.constructor, typeof i != "function" || i !== Array && !r(i.prototype) ? n(i) && (i = i[t], i === null && (i = void 0)) : i = void 0), new (i === void 0 ? Array : i)(c === 0 ? 0 : c);
      };
    }, "69f3": function(a, f, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), c = e("861d"), i = e("9112"), s = e("5135"), l = e("c6cd"), d = e("f772"), m = e("d012"), p = u.WeakMap, v = function(w) {
        return o(w) ? r(w) : n(w, {});
      }, h = function(w) {
        return function(b) {
          var O;
          if (!c(b) || (O = r(b)).type !== w) throw TypeError("Incompatible receiver, " + w + " required");
          return O;
        };
      };
      if (t) {
        var y = l.state || (l.state = new p()), g = y.get, j = y.has, C = y.set;
        n = function(w, b) {
          return b.facade = w, C.call(y, w, b), b;
        }, r = function(w) {
          return g.call(y, w) || {};
        }, o = function(w) {
          return j.call(y, w);
        };
      } else {
        var x = d("state");
        m[x] = !0, n = function(w, b) {
          return b.facade = w, i(w, x, b), b;
        }, r = function(w) {
          return s(w, x) ? w[x] : {};
        }, o = function(w) {
          return s(w, x);
        };
      }
      a.exports = { set: n, get: r, has: o, enforce: v, getterFor: h };
    }, "6d55": function(a, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, "6d61": function(a, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), c = e("2266"), i = e("19aa"), s = e("861d"), l = e("d039"), d = e("1c7e"), m = e("d44e"), p = e("7156");
      a.exports = function(v, h, y) {
        var g = v.indexOf("Map") !== -1, j = v.indexOf("Weak") !== -1, C = g ? "set" : "add", x = r[v], w = x && x.prototype, b = x, O = {}, _ = function(Y) {
          var ae = w[Y];
          t(w, Y, Y == "add" ? function(Z) {
            return ae.call(this, Z === 0 ? 0 : Z), this;
          } : Y == "delete" ? function(Z) {
            return !(j && !s(Z)) && ae.call(this, Z === 0 ? 0 : Z);
          } : Y == "get" ? function(Z) {
            return j && !s(Z) ? void 0 : ae.call(this, Z === 0 ? 0 : Z);
          } : Y == "has" ? function(Z) {
            return !(j && !s(Z)) && ae.call(this, Z === 0 ? 0 : Z);
          } : function(Z, L) {
            return ae.call(this, Z === 0 ? 0 : Z, L), this;
          });
        }, T = o(v, typeof x != "function" || !(j || w.forEach && !l(function() {
          new x().entries().next();
        })));
        if (T) b = y.getConstructor(h, v, g, C), u.REQUIRED = !0;
        else if (o(v, !0)) {
          var S = new b(), M = S[C](j ? {} : -0, 1) != S, A = l(function() {
            S.has(1);
          }), B = d(function(Y) {
            new x(Y);
          }), te = !j && l(function() {
            for (var Y = new x(), ae = 5; ae--; ) Y[C](ae, ae);
            return !Y.has(-0);
          });
          B || (b = h(function(Y, ae) {
            i(Y, b, v);
            var Z = p(new x(), Y, b);
            return ae != null && c(ae, Z[C], { that: Z, AS_ENTRIES: g }), Z;
          }), b.prototype = w, w.constructor = b), (A || te) && (_("delete"), _("has"), g && _("get")), (te || M) && _(C), j && w.clear && delete w.clear;
        }
        return O[v] = b, n({ global: !0, forced: b != x }, O), m(b, v), j || y.setStrong(b, v, g), b;
      };
    }, "6eeb": function(a, f, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), c = e("69f3"), i = c.get, s = c.enforce, l = String(String).split("String");
      (a.exports = function(d, m, p, v) {
        var h, y = !!v && !!v.unsafe, g = !!v && !!v.enumerable, j = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof m != "string" || o(p, "name") || r(p, "name", m), h = s(p), h.source || (h.source = l.join(typeof m == "string" ? m : ""))), d !== n ? (y ? !j && d[m] && (g = !0) : delete d[m], g ? d[m] = p : r(d, m, p)) : g ? d[m] = p : t(m, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && i(this).source || u(this);
      });
    }, "70d3": function(a, f, e) {
    }, 7156: function(a, f, e) {
      var n = e("861d"), r = e("d2bb");
      a.exports = function(o, t, u) {
        var c, i;
        return r && typeof (c = t.constructor) == "function" && c !== u && n(i = c.prototype) && i !== u.prototype && r(o, i), o;
      };
    }, 7305: function(a, f, e) {
    }, 7320: function(a, f, e) {
    }, 7418: function(a, f) {
      f.f = Object.getOwnPropertySymbols;
    }, "746f": function(a, f, e) {
      var n = e("428f"), r = e("5135"), o = e("e538"), t = e("9bf2").f;
      a.exports = function(u) {
        var c = n.Symbol || (n.Symbol = {});
        r(c, u) || t(c, u, { value: o.f(u) });
      };
    }, 7839: function(a, f) {
      a.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(a, f, e) {
      function n(r) {
        this.message = r;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, a.exports = n;
    }, "7aac": function(a, f, e) {
      var n = e("c532");
      a.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(r, o, t, u, c, i) {
          var s = [];
          s.push(r + "=" + encodeURIComponent(o)), n.isNumber(t) && s.push("expires=" + new Date(t).toGMTString()), n.isString(u) && s.push("path=" + u), n.isString(c) && s.push("domain=" + c), i === !0 && s.push("secure"), document.cookie = s.join("; ");
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
    }, "7b0b": function(a, f, e) {
      var n = e("1d80");
      a.exports = function(r) {
        return Object(n(r));
      };
    }, "7c73": function(a, f, e) {
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), c = e("1be4"), i = e("cc12"), s = e("f772"), l = ">", d = "<", m = "prototype", p = "script", v = s("IE_PROTO"), h = function() {
      }, y = function(x) {
        return d + p + l + x + d + "/" + p + l;
      }, g = function(x) {
        x.write(y("")), x.close();
        var w = x.parentWindow.Object;
        return x = null, w;
      }, j = function() {
        var x, w = i("iframe"), b = "java" + p + ":";
        return w.style.display = "none", c.appendChild(w), w.src = String(b), x = w.contentWindow.document, x.open(), x.write(y("document.F=Object")), x.close(), x.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? g(n) : j();
        for (var x = t.length; x--; ) delete C[m][t[x]];
        return C();
      };
      u[v] = !0, a.exports = Object.create || function(x, w) {
        var b;
        return x !== null ? (h[m] = r(x), b = new h(), h[m] = null, b[v] = x) : b = C(), w === void 0 ? b : o(b, w);
      };
    }, "7db0": function(a, f, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(a, f, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), c = e("9112"), i = e("6eeb"), s = e("b622"), l = e("c430"), d = e("3f8c"), m = e("ae93"), p = m.IteratorPrototype, v = m.BUGGY_SAFARI_ITERATORS, h = s("iterator"), y = "keys", g = "values", j = "entries", C = function() {
        return this;
      };
      a.exports = function(x, w, b, O, _, T, S) {
        r(b, w, O);
        var M, A, B, te = function(H) {
          if (H === _ && N) return N;
          if (!v && H in Z) return Z[H];
          switch (H) {
            case y:
              return function() {
                return new b(this, H);
              };
            case g:
              return function() {
                return new b(this, H);
              };
            case j:
              return function() {
                return new b(this, H);
              };
          }
          return function() {
            return new b(this);
          };
        }, Y = w + " Iterator", ae = !1, Z = x.prototype, L = Z[h] || Z["@@iterator"] || _ && Z[_], N = !v && L || te(_), K = w == "Array" && Z.entries || L;
        if (K && (M = o(K.call(new x())), p !== Object.prototype && M.next && (l || o(M) === p || (t ? t(M, p) : typeof M[h] != "function" && c(M, h, C)), u(M, Y, !0, !0), l && (d[Y] = C))), _ == g && L && L.name !== g && (ae = !0, N = function() {
          return L.call(this);
        }), l && !S || Z[h] === N || c(Z, h, N), d[w] = N, _) if (A = { values: te(g), keys: T ? N : te(y), entries: te(j) }, S) for (B in A) (v || ae || !(B in Z)) && i(Z, B, A[B]);
        else n({ target: w, proto: !0, forced: v || ae }, A);
        return A;
      };
    }, "7eb5": function(a, f, e) {
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
    }, "7f9a": function(a, f, e) {
      var n = e("da84"), r = e("8925"), o = n.WeakMap;
      a.exports = typeof o == "function" && /native code/.test(r(o));
    }, "825a": function(a, f, e) {
      var n = e("861d");
      a.exports = function(r) {
        if (!n(r)) throw TypeError(String(r) + " is not an object");
        return r;
      };
    }, "83ab": function(a, f, e) {
      var n = e("d039");
      a.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(a, f, e) {
      var n = e("d925"), r = e("e683");
      a.exports = function(o, t) {
        return o && !n(t) ? r(o, t) : t;
      };
    }, 8418: function(a, f, e) {
      var n = e("c04e"), r = e("9bf2"), o = e("5c6c");
      a.exports = function(t, u, c) {
        var i = n(u);
        i in t ? r.f(t, i, o(0, c)) : t[i] = c;
      };
    }, "861d": function(a, f) {
      a.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(a, f, e) {
      var n, r, o;
      (function(t, u) {
        r = [], n = u, o = typeof n == "function" ? n.apply(f, r) : n, o === void 0 || (a.exports = o);
      })(typeof self < "u" && self, function() {
        function t() {
          var u = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!u && "currentScript" in document && document.currentScript || u && u.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (j) {
            var c, i, s, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, d = /@([^@]*):(\d+):(\d+)\s*$/gi, m = l.exec(j.stack) || d.exec(j.stack), p = m && m[1] || !1, v = m && m[2] || !1, h = document.location.href.replace(document.location.hash, ""), y = document.getElementsByTagName("script");
            p === h && (c = document.documentElement.outerHTML, i = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), s = c.replace(i, "$1").trim());
            for (var g = 0; g < y.length; g++)
              if (y[g].readyState === "interactive" || y[g].src === p || p === h && y[g].innerHTML && y[g].innerHTML.trim() === s) return y[g];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(a, f, e) {
      var n = e("c6cd"), r = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(o) {
        return r.call(o);
      }), a.exports = n.inspectSource;
    }, "8aa5": function(a, f, e) {
      var n = e("6547").charAt;
      a.exports = function(r, o, t) {
        return o + (t ? n(r, o).length : 1);
      };
    }, "8bbf": function(a, f) {
      a.exports = ee;
    }, "8df4": function(a, f, e) {
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
      }, a.exports = r;
    }, "90e3": function(a, f) {
      var e = 0, n = Math.random();
      a.exports = function(r) {
        return "Symbol(" + String(r === void 0 ? "" : r) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(a, f, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("5c6c");
      a.exports = n ? function(t, u, c) {
        return r.f(t, u, o(1, c));
      } : function(t, u, c) {
        return t[u] = c, t;
      };
    }, 9263: function(a, f, e) {
      var n = e("ad6d"), r = e("9f7f"), o = RegExp.prototype.exec, t = String.prototype.replace, u = o, c = function() {
        var d = /a/, m = /b*/g;
        return o.call(d, "a"), o.call(m, "a"), d.lastIndex !== 0 || m.lastIndex !== 0;
      }(), i = r.UNSUPPORTED_Y || r.BROKEN_CARET, s = /()??/.exec("")[1] !== void 0, l = c || s || i;
      l && (u = function(d) {
        var m, p, v, h, y = this, g = i && y.sticky, j = n.call(y), C = y.source, x = 0, w = d;
        return g && (j = j.replace("y", ""), j.indexOf("g") === -1 && (j += "g"), w = String(d).slice(y.lastIndex), y.lastIndex > 0 && (!y.multiline || y.multiline && d[y.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", w = " " + w, x++), p = new RegExp("^(?:" + C + ")", j)), s && (p = new RegExp("^" + C + "$(?!\\s)", j)), c && (m = y.lastIndex), v = o.call(g ? p : y, w), g ? v ? (v.input = v.input.slice(x), v[0] = v[0].slice(x), v.index = y.lastIndex, y.lastIndex += v[0].length) : y.lastIndex = 0 : c && v && (y.lastIndex = y.global ? v.index + v[0].length : m), s && v && v.length > 1 && t.call(v[0], p, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (v[h] = void 0);
        }), v;
      }), a.exports = u;
    }, "94ca": function(a, f, e) {
      var n = e("d039"), r = /#|\.prototype\./, o = function(s, l) {
        var d = u[t(s)];
        return d == i || d != c && (typeof l == "function" ? n(l) : !!l);
      }, t = o.normalize = function(s) {
        return String(s).replace(r, ".").toLowerCase();
      }, u = o.data = {}, c = o.NATIVE = "N", i = o.POLYFILL = "P";
      a.exports = o;
    }, "95d9": function(a, f, e) {
    }, "96cf": function(a, f) {
      (function(e) {
        var n, r = Object.prototype, o = r.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, u = t.iterator || "@@iterator", c = t.asyncIterator || "@@asyncIterator", i = t.toStringTag || "@@toStringTag", s = typeof a == "object", l = e.regeneratorRuntime;
        if (l) s && (a.exports = l);
        else {
          l = e.regeneratorRuntime = s ? a.exports : {}, l.wrap = x;
          var d = "suspendedStart", m = "suspendedYield", p = "executing", v = "completed", h = {}, y = {};
          y[u] = function() {
            return this;
          };
          var g = Object.getPrototypeOf, j = g && g(g(ae([])));
          j && j !== r && o.call(j, u) && (y = j);
          var C = _.prototype = b.prototype = Object.create(y);
          O.prototype = C.constructor = _, _.constructor = O, _[i] = O.displayName = "GeneratorFunction", l.isGeneratorFunction = function(L) {
            var N = typeof L == "function" && L.constructor;
            return !!N && (N === O || (N.displayName || N.name) === "GeneratorFunction");
          }, l.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, _) : (L.__proto__ = _, i in L || (L[i] = "GeneratorFunction")), L.prototype = Object.create(C), L;
          }, l.awrap = function(L) {
            return { __await: L };
          }, T(S.prototype), S.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = S, l.async = function(L, N, K, H) {
            var V = new S(x(L, N, K, H));
            return l.isGeneratorFunction(N) ? V : V.next().then(function(me) {
              return me.done ? me.value : V.next();
            });
          }, T(C), C[i] = "Generator", C[u] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, l.keys = function(L) {
            var N = [];
            for (var K in L) N.push(K);
            return N.reverse(), function H() {
              for (; N.length; ) {
                var V = N.pop();
                if (V in L) return H.value = V, H.done = !1, H;
              }
              return H.done = !0, H;
            };
          }, l.values = ae, Y.prototype = { constructor: Y, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(te), !L) for (var N in this) N.charAt(0) === "t" && o.call(this, N) && !isNaN(+N.slice(1)) && (this[N] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], N = L.completion;
            if (N.type === "throw") throw N.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var N = this;
            function K(Ae, Be) {
              return me.type = "throw", me.arg = L, N.next = Ae, Be && (N.method = "next", N.arg = n), !!Be;
            }
            for (var H = this.tryEntries.length - 1; H >= 0; --H) {
              var V = this.tryEntries[H], me = V.completion;
              if (V.tryLoc === "root") return K("end");
              if (V.tryLoc <= this.prev) {
                var fe = o.call(V, "catchLoc"), Te = o.call(V, "finallyLoc");
                if (fe && Te) {
                  if (this.prev < V.catchLoc) return K(V.catchLoc, !0);
                  if (this.prev < V.finallyLoc) return K(V.finallyLoc);
                } else if (fe) {
                  if (this.prev < V.catchLoc) return K(V.catchLoc, !0);
                } else {
                  if (!Te) throw new Error("try statement without catch or finally");
                  if (this.prev < V.finallyLoc) return K(V.finallyLoc);
                }
              }
            }
          }, abrupt: function(L, N) {
            for (var K = this.tryEntries.length - 1; K >= 0; --K) {
              var H = this.tryEntries[K];
              if (H.tryLoc <= this.prev && o.call(H, "finallyLoc") && this.prev < H.finallyLoc) {
                var V = H;
                break;
              }
            }
            V && (L === "break" || L === "continue") && V.tryLoc <= N && N <= V.finallyLoc && (V = null);
            var me = V ? V.completion : {};
            return me.type = L, me.arg = N, V ? (this.method = "next", this.next = V.finallyLoc, h) : this.complete(me);
          }, complete: function(L, N) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && N && (this.next = N), h;
          }, finish: function(L) {
            for (var N = this.tryEntries.length - 1; N >= 0; --N) {
              var K = this.tryEntries[N];
              if (K.finallyLoc === L) return this.complete(K.completion, K.afterLoc), te(K), h;
            }
          }, catch: function(L) {
            for (var N = this.tryEntries.length - 1; N >= 0; --N) {
              var K = this.tryEntries[N];
              if (K.tryLoc === L) {
                var H = K.completion;
                if (H.type === "throw") {
                  var V = H.arg;
                  te(K);
                }
                return V;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(L, N, K) {
            return this.delegate = { iterator: ae(L), resultName: N, nextLoc: K }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function x(L, N, K, H) {
          var V = N && N.prototype instanceof b ? N : b, me = Object.create(V.prototype), fe = new Y(H || []);
          return me._invoke = M(L, K, fe), me;
        }
        function w(L, N, K) {
          try {
            return { type: "normal", arg: L.call(N, K) };
          } catch (H) {
            return { type: "throw", arg: H };
          }
        }
        function b() {
        }
        function O() {
        }
        function _() {
        }
        function T(L) {
          ["next", "throw", "return"].forEach(function(N) {
            L[N] = function(K) {
              return this._invoke(N, K);
            };
          });
        }
        function S(L) {
          function N(V, me, fe, Te) {
            var Ae = w(L[V], L, me);
            if (Ae.type !== "throw") {
              var Be = Ae.arg, Se = Be.value;
              return Se && typeof Se == "object" && o.call(Se, "__await") ? Promise.resolve(Se.__await).then(function(Oe) {
                N("next", Oe, fe, Te);
              }, function(Oe) {
                N("throw", Oe, fe, Te);
              }) : Promise.resolve(Se).then(function(Oe) {
                Be.value = Oe, fe(Be);
              }, Te);
            }
            Te(Ae.arg);
          }
          var K;
          function H(V, me) {
            function fe() {
              return new Promise(function(Te, Ae) {
                N(V, me, Te, Ae);
              });
            }
            return K = K ? K.then(fe, fe) : fe();
          }
          this._invoke = H;
        }
        function M(L, N, K) {
          var H = d;
          return function(V, me) {
            if (H === p) throw new Error("Generator is already running");
            if (H === v) {
              if (V === "throw") throw me;
              return Z();
            }
            for (K.method = V, K.arg = me; ; ) {
              var fe = K.delegate;
              if (fe) {
                var Te = A(fe, K);
                if (Te) {
                  if (Te === h) continue;
                  return Te;
                }
              }
              if (K.method === "next") K.sent = K._sent = K.arg;
              else if (K.method === "throw") {
                if (H === d) throw H = v, K.arg;
                K.dispatchException(K.arg);
              } else K.method === "return" && K.abrupt("return", K.arg);
              H = p;
              var Ae = w(L, N, K);
              if (Ae.type === "normal") {
                if (H = K.done ? v : m, Ae.arg === h) continue;
                return { value: Ae.arg, done: K.done };
              }
              Ae.type === "throw" && (H = v, K.method = "throw", K.arg = Ae.arg);
            }
          };
        }
        function A(L, N) {
          var K = L.iterator[N.method];
          if (K === n) {
            if (N.delegate = null, N.method === "throw") {
              if (L.iterator.return && (N.method = "return", N.arg = n, A(L, N), N.method === "throw")) return h;
              N.method = "throw", N.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var H = w(K, L.iterator, N.arg);
          if (H.type === "throw") return N.method = "throw", N.arg = H.arg, N.delegate = null, h;
          var V = H.arg;
          return V ? V.done ? (N[L.resultName] = V.value, N.next = L.nextLoc, N.method !== "return" && (N.method = "next", N.arg = n), N.delegate = null, h) : V : (N.method = "throw", N.arg = new TypeError("iterator result is not an object"), N.delegate = null, h);
        }
        function B(L) {
          var N = { tryLoc: L[0] };
          1 in L && (N.catchLoc = L[1]), 2 in L && (N.finallyLoc = L[2], N.afterLoc = L[3]), this.tryEntries.push(N);
        }
        function te(L) {
          var N = L.completion || {};
          N.type = "normal", delete N.arg, L.completion = N;
        }
        function Y(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(B, this), this.reset(!0);
        }
        function ae(L) {
          if (L) {
            var N = L[u];
            if (N) return N.call(L);
            if (typeof L.next == "function") return L;
            if (!isNaN(L.length)) {
              var K = -1, H = function V() {
                for (; ++K < L.length; ) if (o.call(L, K)) return V.value = L[K], V.done = !1, V;
                return V.value = n, V.done = !0, V;
              };
              return H.next = H;
            }
          }
          return { next: Z };
        }
        function Z() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(a, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), c = e("50c4"), i = e("8418"), s = e("65f0"), l = e("1dde"), d = e("b622"), m = e("2d00"), p = d("isConcatSpreadable"), v = 9007199254740991, h = "Maximum allowed index exceeded", y = m >= 51 || !r(function() {
        var x = [];
        return x[p] = !1, x.concat()[0] !== x;
      }), g = l("concat"), j = function(x) {
        if (!t(x)) return !1;
        var w = x[p];
        return w !== void 0 ? !!w : o(x);
      }, C = !y || !g;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(x) {
        var w, b, O, _, T, S = u(this), M = s(S, 0), A = 0;
        for (w = -1, O = arguments.length; w < O; w++) if (T = w === -1 ? S : arguments[w], j(T)) {
          if (_ = c(T.length), A + _ > v) throw TypeError(h);
          for (b = 0; b < _; b++, A++) b in T && i(M, A, T[b]);
        } else {
          if (A >= v) throw TypeError(h);
          i(M, A++, T);
        }
        return M.length = A, M;
      } });
    }, "9aaf": function(a, f, e) {
      e("70d3");
    }, "9bdd": function(a, f, e) {
      var n = e("825a"), r = e("2a62");
      a.exports = function(o, t, u, c) {
        try {
          return c ? t(n(u)[0], u[1]) : t(u);
        } catch (i) {
          throw r(o), i;
        }
      };
    }, "9bf2": function(a, f, e) {
      var n = e("83ab"), r = e("0cfb"), o = e("825a"), t = e("c04e"), u = Object.defineProperty;
      f.f = n ? u : function(c, i, s) {
        if (o(c), i = t(i, !0), o(s), r) try {
          return u(c, i, s);
        } catch {
        }
        if ("get" in s || "set" in s) throw TypeError("Accessors not supported");
        return "value" in s && (c[i] = s.value), c;
      };
    }, "9ed3": function(a, f, e) {
      var n = e("ae93").IteratorPrototype, r = e("7c73"), o = e("5c6c"), t = e("d44e"), u = e("3f8c"), c = function() {
        return this;
      };
      a.exports = function(i, s, l) {
        var d = s + " Iterator";
        return i.prototype = r(n, { next: o(1, l) }), t(i, d, !1, !0), u[d] = c, i;
      };
    }, "9f7f": function(a, f, e) {
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
    }, a434: function(a, f, e) {
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), c = e("65f0"), i = e("8418"), s = e("1dde"), l = s("splice"), d = Math.max, m = Math.min, p = 9007199254740991, v = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, y) {
        var g, j, C, x, w, b, O = u(this), _ = t(O.length), T = r(h, _), S = arguments.length;
        if (S === 0 ? g = j = 0 : S === 1 ? (g = 0, j = _ - T) : (g = S - 2, j = m(d(o(y), 0), _ - T)), _ + g - j > p) throw TypeError(v);
        for (C = c(O, j), x = 0; x < j; x++) w = T + x, w in O && i(C, x, O[w]);
        if (C.length = j, g < j) {
          for (x = T; x < _ - j; x++) w = x + j, b = x + g, w in O ? O[b] = O[w] : delete O[b];
          for (x = _; x > _ - j + g; x--) delete O[x - 1];
        } else if (g > j) for (x = _ - j; x > T; x--) w = x + j - 1, b = x + g - 1, w in O ? O[b] = O[w] : delete O[b];
        for (x = 0; x < g; x++) O[x + T] = arguments[x + 2];
        return O.length = _ - j + g, C;
      } });
    }, a4b4: function(a, f, e) {
      var n = e("342f");
      a.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(a, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), c = e("4930"), i = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), m = e("861d"), p = e("825a"), v = e("7b0b"), h = e("fc6a"), y = e("c04e"), g = e("5c6c"), j = e("7c73"), C = e("df75"), x = e("241c"), w = e("057f"), b = e("7418"), O = e("06cf"), _ = e("9bf2"), T = e("d1e7"), S = e("9112"), M = e("6eeb"), A = e("5692"), B = e("f772"), te = e("d012"), Y = e("90e3"), ae = e("b622"), Z = e("e538"), L = e("746f"), N = e("d44e"), K = e("69f3"), H = e("b727").forEach, V = B("hidden"), me = "Symbol", fe = "prototype", Te = ae("toPrimitive"), Ae = K.set, Be = K.getterFor(me), Se = Object[fe], Oe = r.Symbol, Ve = o("JSON", "stringify"), He = O.f, U = _.f, $ = w.f, F = T.f, E = A("symbols"), W = A("op-symbols"), J = A("string-to-symbol-registry"), ge = A("symbol-to-string-registry"), he = A("wks"), ue = r.QObject, we = !ue || !ue[fe] || !ue[fe].findChild, ke = u && s(function() {
        return j(U({}, "a", { get: function() {
          return U(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, X, ie) {
        var pe = He(Se, X);
        pe && delete Se[X], U(q, X, ie), pe && q !== Se && U(Se, X, pe);
      } : U, Ie = function(q, X) {
        var ie = E[q] = j(Oe[fe]);
        return Ae(ie, { type: me, tag: q, description: X }), u || (ie.description = X), ie;
      }, je = i ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Oe;
      }, We = function(q, X, ie) {
        q === Se && We(W, X, ie), p(q);
        var pe = y(X, !0);
        return p(ie), l(E, pe) ? (ie.enumerable ? (l(q, V) && q[V][pe] && (q[V][pe] = !1), ie = j(ie, { enumerable: g(0, !1) })) : (l(q, V) || U(q, V, g(1, {})), q[V][pe] = !0), ke(q, pe, ie)) : U(q, pe, ie);
      }, Ge = function(q, X) {
        p(q);
        var ie = h(X), pe = C(ie).concat(se(ie));
        return H(pe, function(Me) {
          u && !nt.call(ie, Me) || We(q, Me, ie[Me]);
        }), q;
      }, Je = function(q, X) {
        return X === void 0 ? j(q) : Ge(j(q), X);
      }, nt = function(q) {
        var X = y(q, !0), ie = F.call(this, X);
        return !(this === Se && l(E, X) && !l(W, X)) && (!(ie || !l(this, X) || !l(E, X) || l(this, V) && this[V][X]) || ie);
      }, z = function(q, X) {
        var ie = h(q), pe = y(X, !0);
        if (ie !== Se || !l(E, pe) || l(W, pe)) {
          var Me = He(ie, pe);
          return !Me || !l(E, pe) || l(ie, V) && ie[V][pe] || (Me.enumerable = !0), Me;
        }
      }, re = function(q) {
        var X = $(h(q)), ie = [];
        return H(X, function(pe) {
          l(E, pe) || l(te, pe) || ie.push(pe);
        }), ie;
      }, se = function(q) {
        var X = q === Se, ie = $(X ? W : h(q)), pe = [];
        return H(ie, function(Me) {
          !l(E, Me) || X && !l(Se, Me) || pe.push(E[Me]);
        }), pe;
      };
      if (c || (Oe = function() {
        if (this instanceof Oe) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, X = Y(q), ie = function(pe) {
          this === Se && ie.call(W, pe), l(this, V) && l(this[V], X) && (this[V][X] = !1), ke(this, X, g(1, pe));
        };
        return u && we && ke(Se, X, { configurable: !0, set: ie }), Ie(X, q);
      }, M(Oe[fe], "toString", function() {
        return Be(this).tag;
      }), M(Oe, "withoutSetter", function(q) {
        return Ie(Y(q), q);
      }), T.f = nt, _.f = We, O.f = z, x.f = w.f = re, b.f = se, Z.f = function(q) {
        return Ie(ae(q), q);
      }, u && (U(Oe[fe], "description", { configurable: !0, get: function() {
        return Be(this).description;
      } }), t || M(Se, "propertyIsEnumerable", nt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Oe }), H(C(he), function(q) {
        L(q);
      }), n({ target: me, stat: !0, forced: !c }, { for: function(q) {
        var X = String(q);
        if (l(J, X)) return J[X];
        var ie = Oe(X);
        return J[X] = ie, ge[ie] = X, ie;
      }, keyFor: function(q) {
        if (!je(q)) throw TypeError(q + " is not a symbol");
        if (l(ge, q)) return ge[q];
      }, useSetter: function() {
        we = !0;
      }, useSimple: function() {
        we = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !u }, { create: Je, defineProperty: We, defineProperties: Ge, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: re, getOwnPropertySymbols: se }), n({ target: "Object", stat: !0, forced: s(function() {
        b.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return b.f(v(q));
      } }), Ve) {
        var de = !c || s(function() {
          var q = Oe();
          return Ve([q]) != "[null]" || Ve({ a: q }) != "{}" || Ve(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: de }, { stringify: function(q, X, ie) {
          for (var pe, Me = [q], qe = 1; arguments.length > qe; ) Me.push(arguments[qe++]);
          if (pe = X, (m(X) || q !== void 0) && !je(q)) return d(X) || (X = function(Ze, be) {
            if (typeof pe == "function" && (be = pe.call(this, Ze, be)), !je(be)) return be;
          }), Me[1] = X, Ve.apply(null, Me);
        } });
      }
      Oe[fe][Te] || S(Oe[fe], Te, Oe[fe].valueOf), N(Oe, me), te[V] = !0;
    }, a630: function(a, f, e) {
      var n = e("23e7"), r = e("4df4"), o = e("1c7e"), t = !o(function(u) {
        Array.from(u);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: r });
    }, a640: function(a, f, e) {
      var n = e("d039");
      a.exports = function(r, o) {
        var t = [][r];
        return !!t && n(function() {
          t.call(null, o || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(a, f) {
      var e = Math.ceil, n = Math.floor;
      a.exports = function(r) {
        return isNaN(r = +r) ? 0 : (r > 0 ? n : e)(r);
      };
    }, ab13: function(a, f, e) {
      var n = e("b622"), r = n("match");
      a.exports = function(o) {
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
    }, ac1f: function(a, f, e) {
      var n = e("23e7"), r = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== r }, { exec: r });
    }, acce: function(a, f, e) {
    }, ad6d: function(a, f, e) {
      var n = e("825a");
      a.exports = function() {
        var r = n(this), o = "";
        return r.global && (o += "g"), r.ignoreCase && (o += "i"), r.multiline && (o += "m"), r.dotAll && (o += "s"), r.unicode && (o += "u"), r.sticky && (o += "y"), o;
      };
    }, ae93: function(a, f, e) {
      var n, r, o, t = e("d039"), u = e("e163"), c = e("9112"), i = e("5135"), s = e("b622"), l = e("c430"), d = s("iterator"), m = !1, p = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : m = !0);
      var v = n == null || t(function() {
        var h = {};
        return n[d].call(h) !== h;
      });
      v && (n = {}), l && !v || i(n, d) || c(n, d, p), a.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: m };
    }, b041: function(a, f, e) {
      var n = e("00ee"), r = e("f5df");
      a.exports = n ? {}.toString : function() {
        return "[object " + r(this) + "]";
      };
    }, b0c0: function(a, f, e) {
      var n = e("83ab"), r = e("9bf2").f, o = Function.prototype, t = o.toString, u = /^\s*function ([^ (]*)/, c = "name";
      n && !(c in o) && r(o, c, { configurable: !0, get: function() {
        try {
          return t.call(this).match(u)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(a, f, e) {
      var n = e("c532"), r = e("467f"), o = e("7aac"), t = e("30b5"), u = e("83b9"), c = e("c345"), i = e("3934"), s = e("2d83");
      a.exports = function(l) {
        return new Promise(function(d, m) {
          var p = l.data, v = l.headers;
          n.isFormData(p) && delete v["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var y = l.auth.username || "", g = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            v.Authorization = "Basic " + btoa(y + ":" + g);
          }
          var j = u(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(j, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var x = "getAllResponseHeaders" in h ? c(h.getAllResponseHeaders()) : null, w = l.responseType && l.responseType !== "text" ? h.response : h.responseText, b = { data: w, status: h.status, statusText: h.statusText, headers: x, config: l, request: h };
              r(d, m, b), h = null;
            }
          }, h.onabort = function() {
            h && (m(s("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            m(s("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var x = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (x = l.timeoutErrorMessage), m(s(x, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var C = (l.withCredentials || i(j)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            C && (v[l.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in h && n.forEach(v, function(x, w) {
            typeof p > "u" && w.toLowerCase() === "content-type" ? delete v[w] : h.setRequestHeader(w, x);
          }), n.isUndefined(l.withCredentials) || (h.withCredentials = !!l.withCredentials), l.responseType) try {
            h.responseType = l.responseType;
          } catch (x) {
            if (l.responseType !== "json") throw x;
          }
          typeof l.onDownloadProgress == "function" && h.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(x) {
            h && (h.abort(), m(x), h = null);
          }), p || (p = null), h.send(p);
        });
      };
    }, b575: function(a, f, e) {
      var n, r, o, t, u, c, i, s, l = e("da84"), d = e("06cf").f, m = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), h = e("605d"), y = l.MutationObserver || l.WebKitMutationObserver, g = l.document, j = l.process, C = l.Promise, x = d(l, "queueMicrotask"), w = x && x.value;
      w || (n = function() {
        var b, O;
        for (h && (b = j.domain) && b.exit(); r; ) {
          O = r.fn, r = r.next;
          try {
            O();
          } catch (_) {
            throw r ? t() : o = void 0, _;
          }
        }
        o = void 0, b && b.enter();
      }, p || h || v || !y || !g ? C && C.resolve ? (i = C.resolve(void 0), s = i.then, t = function() {
        s.call(i, n);
      }) : t = h ? function() {
        j.nextTick(n);
      } : function() {
        m.call(l, n);
      } : (u = !0, c = g.createTextNode(""), new y(n).observe(c, { characterData: !0 }), t = function() {
        c.data = u = !u;
      })), a.exports = w || function(b) {
        var O = { fn: b, next: void 0 };
        o && (o.next = O), r || (r = O, t()), o = O;
      };
    }, b622: function(a, f, e) {
      var n = e("da84"), r = e("5692"), o = e("5135"), t = e("90e3"), u = e("4930"), c = e("fdbf"), i = r("wks"), s = n.Symbol, l = c ? s : s && s.withoutSetter || t;
      a.exports = function(d) {
        return o(i, d) && (u || typeof i[d] == "string") || (u && o(s, d) ? i[d] = s[d] : i[d] = l("Symbol." + d)), i[d];
      };
    }, b64b: function(a, f, e) {
      var n = e("23e7"), r = e("7b0b"), o = e("df75"), t = e("d039"), u = t(function() {
        o(1);
      });
      n({ target: "Object", stat: !0, forced: u }, { keys: function(c) {
        return o(r(c));
      } });
    }, b680: function(a, f, e) {
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), c = 1 .toFixed, i = Math.floor, s = function(h, y, g) {
        return y === 0 ? g : y % 2 === 1 ? s(h, y - 1, g * h) : s(h * h, y / 2, g);
      }, l = function(h) {
        for (var y = 0, g = h; g >= 4096; ) y += 12, g /= 4096;
        for (; g >= 2; ) y += 1, g /= 2;
        return y;
      }, d = function(h, y, g) {
        for (var j = -1, C = g; ++j < 6; ) C += y * h[j], h[j] = C % 1e7, C = i(C / 1e7);
      }, m = function(h, y) {
        for (var g = 6, j = 0; --g >= 0; ) j += h[g], h[g] = i(j / y), j = j % y * 1e7;
      }, p = function(h) {
        for (var y = 6, g = ""; --y >= 0; ) if (g !== "" || y === 0 || h[y] !== 0) {
          var j = String(h[y]);
          g = g === "" ? j : g + t.call("0", 7 - j.length) + j;
        }
        return g;
      }, v = c && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        c.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(h) {
        var y, g, j, C, x = o(this), w = r(h), b = [0, 0, 0, 0, 0, 0], O = "", _ = "0";
        if (w < 0 || w > 20) throw RangeError("Incorrect fraction digits");
        if (x != x) return "NaN";
        if (x <= -1e21 || x >= 1e21) return String(x);
        if (x < 0 && (O = "-", x = -x), x > 1e-21) if (y = l(x * s(2, 69, 1)) - 69, g = y < 0 ? x * s(2, -y, 1) : x / s(2, y, 1), g *= 4503599627370496, y = 52 - y, y > 0) {
          for (d(b, 0, g), j = w; j >= 7; ) d(b, 1e7, 0), j -= 7;
          for (d(b, s(10, j, 1), 0), j = y - 1; j >= 23; ) m(b, 1 << 23), j -= 23;
          m(b, 1 << j), d(b, 1, 1), m(b, 2), _ = p(b);
        } else d(b, 0, g), d(b, 1 << -y, 0), _ = p(b) + t.call("0", w);
        return w > 0 ? (C = _.length, _ = O + (C <= w ? "0." + t.call("0", w - C) + _ : _.slice(0, C - w) + "." + _.slice(C - w))) : _ = O + _, _;
      } });
    }, b727: function(a, f, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), c = [].push, i = function(s) {
        var l = s == 1, d = s == 2, m = s == 3, p = s == 4, v = s == 6, h = s == 7, y = s == 5 || v;
        return function(g, j, C, x) {
          for (var w, b, O = o(g), _ = r(O), T = n(j, C, 3), S = t(_.length), M = 0, A = x || u, B = l ? A(g, S) : d || h ? A(g, 0) : void 0; S > M; M++) if ((y || M in _) && (w = _[M], b = T(w, M, O), s)) if (l) B[M] = b;
          else if (b) switch (s) {
            case 3:
              return !0;
            case 5:
              return w;
            case 6:
              return M;
            case 2:
              c.call(B, w);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              c.call(B, w);
          }
          return v ? -1 : m || p ? p : B;
        };
      };
      a.exports = { forEach: i(0), map: i(1), filter: i(2), some: i(3), every: i(4), find: i(5), findIndex: i(6), filterOut: i(7) };
    }, b8d6: function(a, f, e) {
    }, bb2f: function(a, f, e) {
      var n = e("d039");
      a.exports = !n(function() {
        return Object.isExtensible(Object.preventExtensions({}));
      });
    }, bc3a: function(a, f, e) {
      a.exports = e("cee4");
    }, c04e: function(a, f, e) {
      var n = e("861d");
      a.exports = function(r, o) {
        if (!n(r)) return r;
        var t, u;
        if (o && typeof (t = r.toString) == "function" && !n(u = t.call(r)) || typeof (t = r.valueOf) == "function" && !n(u = t.call(r)) || !o && typeof (t = r.toString) == "function" && !n(u = t.call(r))) return u;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(a, f, e) {
      var n = e("c532"), r = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      a.exports = function(o) {
        var t, u, c, i = {};
        return o && n.forEach(o.split(`
`), function(s) {
          if (c = s.indexOf(":"), t = n.trim(s.substr(0, c)).toLowerCase(), u = n.trim(s.substr(c + 1)), t) {
            if (i[t] && r.indexOf(t) >= 0) return;
            i[t] = t === "set-cookie" ? (i[t] ? i[t] : []).concat([u]) : i[t] ? i[t] + ", " + u : u;
          }
        }), i;
      };
    }, c401: function(a, f, e) {
      var n = e("c532");
      a.exports = function(r, o, t) {
        return n.forEach(t, function(u) {
          r = u(r, o);
        }), r;
      };
    }, c430: function(a, f) {
      a.exports = !1;
    }, c532: function(a, f, e) {
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
      function i(S) {
        return typeof FormData < "u" && S instanceof FormData;
      }
      function s(S) {
        var M;
        return M = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(S) : S && S.buffer && S.buffer instanceof ArrayBuffer, M;
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
        var M = Object.getPrototypeOf(S);
        return M === null || M === Object.prototype;
      }
      function v(S) {
        return r.call(S) === "[object Date]";
      }
      function h(S) {
        return r.call(S) === "[object File]";
      }
      function y(S) {
        return r.call(S) === "[object Blob]";
      }
      function g(S) {
        return r.call(S) === "[object Function]";
      }
      function j(S) {
        return m(S) && g(S.pipe);
      }
      function C(S) {
        return typeof URLSearchParams < "u" && S instanceof URLSearchParams;
      }
      function x(S) {
        return S.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function w() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function b(S, M) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), o(S)) for (var A = 0, B = S.length; A < B; A++) M.call(null, S[A], A, S);
        else for (var te in S) Object.prototype.hasOwnProperty.call(S, te) && M.call(null, S[te], te, S);
      }
      function O() {
        var S = {};
        function M(te, Y) {
          p(S[Y]) && p(te) ? S[Y] = O(S[Y], te) : p(te) ? S[Y] = O({}, te) : o(te) ? S[Y] = te.slice() : S[Y] = te;
        }
        for (var A = 0, B = arguments.length; A < B; A++) b(arguments[A], M);
        return S;
      }
      function _(S, M, A) {
        return b(M, function(B, te) {
          S[te] = A && typeof B == "function" ? n(B, A) : B;
        }), S;
      }
      function T(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      a.exports = { isArray: o, isArrayBuffer: c, isBuffer: u, isFormData: i, isArrayBufferView: s, isString: l, isNumber: d, isObject: m, isPlainObject: p, isUndefined: t, isDate: v, isFile: h, isBlob: y, isFunction: g, isStream: j, isURLSearchParams: C, isStandardBrowserEnv: w, forEach: b, merge: O, extend: _, trim: x, stripBOM: T };
    }, c6b6: function(a, f) {
      var e = {}.toString;
      a.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(a, f, e) {
      var n = e("da84"), r = e("ce4e"), o = "__core-js_shared__", t = n[o] || r(o, {});
      a.exports = t;
    }, c8af: function(a, f, e) {
      var n = e("c532");
      a.exports = function(r, o) {
        n.forEach(r, function(t, u) {
          u !== o && u.toUpperCase() === o.toUpperCase() && (r[o] = t, delete r[u]);
        });
      };
    }, c8ba: function(a, f) {
      var e;
      e = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        e = e || new Function("return this")();
      } catch {
        typeof window == "object" && (e = window);
      }
      a.exports = e;
    }, ca84: function(a, f, e) {
      var n = e("5135"), r = e("fc6a"), o = e("4d64").indexOf, t = e("d012");
      a.exports = function(u, c) {
        var i, s = r(u), l = 0, d = [];
        for (i in s) !n(t, i) && n(s, i) && d.push(i);
        for (; c.length > l; ) n(s, i = c[l++]) && (~o(d, i) || d.push(i));
        return d;
      };
    }, caad: function(a, f, e) {
      var n = e("23e7"), r = e("4d64").includes, o = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return r(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), o("includes");
    }, cc12: function(a, f, e) {
      var n = e("da84"), r = e("861d"), o = n.document, t = r(o) && r(o.createElement);
      a.exports = function(u) {
        return t ? o.createElement(u) : {};
      };
    }, cdf9: function(a, f, e) {
      var n = e("825a"), r = e("861d"), o = e("f069");
      a.exports = function(t, u) {
        if (n(t), r(u) && u.constructor === t) return u;
        var c = o.f(t), i = c.resolve;
        return i(u), c.promise;
      };
    }, ce4e: function(a, f, e) {
      var n = e("da84"), r = e("9112");
      a.exports = function(o, t) {
        try {
          r(n, o, t);
        } catch {
          n[o] = t;
        }
        return t;
      };
    }, cee4: function(a, f, e) {
      var n = e("c532"), r = e("1d2b"), o = e("0a06"), t = e("4a7b"), u = e("2444");
      function c(s) {
        var l = new o(s), d = r(o.prototype.request, l);
        return n.extend(d, o.prototype, l), n.extend(d, l), d;
      }
      var i = c(u);
      i.Axios = o, i.create = function(s) {
        return c(t(i.defaults, s));
      }, i.Cancel = e("7a77"), i.CancelToken = e("8df4"), i.isCancel = e("2e67"), i.all = function(s) {
        return Promise.all(s);
      }, i.spread = e("0df6"), i.isAxiosError = e("5f02"), a.exports = i, a.exports.default = i;
    }, d012: function(a, f) {
      a.exports = {};
    }, d039: function(a, f) {
      a.exports = function(e) {
        try {
          return !!e();
        } catch {
          return !0;
        }
      };
    }, d066: function(a, f, e) {
      var n = e("428f"), r = e("da84"), o = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      a.exports = function(t, u) {
        return arguments.length < 2 ? o(n[t]) || o(r[t]) : n[t] && n[t][u] || r[t] && r[t][u];
      };
    }, d1e7: function(a, f, e) {
      var n = {}.propertyIsEnumerable, r = Object.getOwnPropertyDescriptor, o = r && !n.call({ 1: 2 }, 1);
      f.f = o ? function(t) {
        var u = r(this, t);
        return !!u && u.enumerable;
      } : n;
    }, d28b: function(a, f, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(a, f, e) {
      var n = e("825a"), r = e("3bbe");
      a.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var o, t = !1, u = {};
        try {
          o = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, o.call(u, []), t = u instanceof Array;
        } catch {
        }
        return function(c, i) {
          return n(c), r(i), t ? o.call(c, i) : c.__proto__ = i, c;
        };
      }() : void 0);
    }, d3b7: function(a, f, e) {
      var n = e("00ee"), r = e("6eeb"), o = e("b041");
      n || r(Object.prototype, "toString", o, { unsafe: !0 });
    }, d40d: function(a, f, e) {
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
    }, d44e: function(a, f, e) {
      var n = e("9bf2").f, r = e("5135"), o = e("b622"), t = o("toStringTag");
      a.exports = function(u, c, i) {
        u && !r(u = i ? u : u.prototype, t) && n(u, t, { configurable: !0, value: c });
      };
    }, d58f: function(a, f, e) {
      var n = e("1c0b"), r = e("7b0b"), o = e("44ad"), t = e("50c4"), u = function(c) {
        return function(i, s, l, d) {
          n(s);
          var m = r(i), p = o(m), v = t(m.length), h = c ? v - 1 : 0, y = c ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in p) {
              d = p[h], h += y;
              break;
            }
            if (h += y, c ? h < 0 : v <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; c ? h >= 0 : v > h; h += y) h in p && (d = s(d, p[h], h, m));
          return d;
        };
      };
      a.exports = { left: u(!1), right: u(!0) };
    }, d69c: function(a, f, e) {
      e.r(f);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), f.default = u;
    }, d784: function(a, f, e) {
      e("ac1f");
      var n = e("6eeb"), r = e("d039"), o = e("b622"), t = e("9263"), u = e("9112"), c = o("species"), i = !r(function() {
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
      a.exports = function(p, v, h, y) {
        var g = o(p), j = !r(function() {
          var _ = {};
          return _[g] = function() {
            return 7;
          }, ""[p](_) != 7;
        }), C = j && !r(function() {
          var _ = !1, T = /a/;
          return p === "split" && (T = {}, T.constructor = {}, T.constructor[c] = function() {
            return T;
          }, T.flags = "", T[g] = /./[g]), T.exec = function() {
            return _ = !0, null;
          }, T[g](""), !_;
        });
        if (!j || !C || p === "replace" && (!i || !s || d) || p === "split" && !m) {
          var x = /./[g], w = h(g, ""[p], function(_, T, S, M, A) {
            return T.exec === t ? j && !A ? { done: !0, value: x.call(T, S, M) } : { done: !0, value: _.call(S, T, M) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), b = w[0], O = w[1];
          n(String.prototype, p, b), n(RegExp.prototype, g, v == 2 ? function(_, T) {
            return O.call(_, this, T);
          } : function(_) {
            return O.call(_, this);
          });
        }
        y && u(RegExp.prototype[g], "sham", !0);
      };
    }, d81d: function(a, f, e) {
      var n = e("23e7"), r = e("b727").map, o = e("1dde"), t = o("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(a, f, e) {
      a.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(a, f, e) {
      (function(n) {
        var r = function(o) {
          return o && o.Math == Math && o;
        };
        a.exports = r(typeof globalThis == "object" && globalThis) || r(typeof window == "object" && window) || r(typeof self == "object" && self) || r(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(a, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("56ef"), t = e("fc6a"), u = e("06cf"), c = e("8418");
      n({ target: "Object", stat: !0, sham: !r }, { getOwnPropertyDescriptors: function(i) {
        for (var s, l, d = t(i), m = u.f, p = o(d), v = {}, h = 0; p.length > h; ) l = m(d, s = p[h++]), l !== void 0 && c(v, s, l);
        return v;
      } });
    }, ddb0: function(a, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), u = e("b622"), c = u("iterator"), i = u("toStringTag"), s = o.values;
      for (var l in r) {
        var d = n[l], m = d && d.prototype;
        if (m) {
          if (m[c] !== s) try {
            t(m, c, s);
          } catch {
            m[c] = s;
          }
          if (m[i] || t(m, i, l), r[l]) {
            for (var p in o) if (m[p] !== o[p]) try {
              t(m, p, o[p]);
            } catch {
              m[p] = o[p];
            }
          }
        }
      }
    }, de23: function(a, f, e) {
      e("7305");
    }, df75: function(a, f, e) {
      var n = e("ca84"), r = e("7839");
      a.exports = Object.keys || function(o) {
        return n(o, r);
      };
    }, df7c: function(a, f, e) {
      (function(n) {
        function r(c, i) {
          for (var s = 0, l = c.length - 1; l >= 0; l--) {
            var d = c[l];
            d === "." ? c.splice(l, 1) : d === ".." ? (c.splice(l, 1), s++) : s && (c.splice(l, 1), s--);
          }
          if (i) for (; s--; s) c.unshift("..");
          return c;
        }
        function o(c) {
          typeof c != "string" && (c += "");
          var i, s = 0, l = -1, d = !0;
          for (i = c.length - 1; i >= 0; --i) if (c.charCodeAt(i) === 47) {
            if (!d) {
              s = i + 1;
              break;
            }
          } else l === -1 && (d = !1, l = i + 1);
          return l === -1 ? "" : c.slice(s, l);
        }
        function t(c, i) {
          if (c.filter) return c.filter(i);
          for (var s = [], l = 0; l < c.length; l++) i(c[l], l, c) && s.push(c[l]);
          return s;
        }
        f.resolve = function() {
          for (var c = "", i = !1, s = arguments.length - 1; s >= -1 && !i; s--) {
            var l = s >= 0 ? arguments[s] : n.cwd();
            if (typeof l != "string") throw new TypeError("Arguments to path.resolve must be strings");
            l && (c = l + "/" + c, i = l.charAt(0) === "/");
          }
          return c = r(t(c.split("/"), function(d) {
            return !!d;
          }), !i).join("/"), (i ? "/" : "") + c || ".";
        }, f.normalize = function(c) {
          var i = f.isAbsolute(c), s = u(c, -1) === "/";
          return c = r(t(c.split("/"), function(l) {
            return !!l;
          }), !i).join("/"), c || i || (c = "."), c && s && (c += "/"), (i ? "/" : "") + c;
        }, f.isAbsolute = function(c) {
          return c.charAt(0) === "/";
        }, f.join = function() {
          var c = Array.prototype.slice.call(arguments, 0);
          return f.normalize(t(c, function(i, s) {
            if (typeof i != "string") throw new TypeError("Arguments to path.join must be strings");
            return i;
          }).join("/"));
        }, f.relative = function(c, i) {
          function s(y) {
            for (var g = 0; g < y.length && y[g] === ""; g++) ;
            for (var j = y.length - 1; j >= 0 && y[j] === ""; j--) ;
            return g > j ? [] : y.slice(g, j - g + 1);
          }
          c = f.resolve(c).substr(1), i = f.resolve(i).substr(1);
          for (var l = s(c.split("/")), d = s(i.split("/")), m = Math.min(l.length, d.length), p = m, v = 0; v < m; v++) if (l[v] !== d[v]) {
            p = v;
            break;
          }
          var h = [];
          for (v = p; v < l.length; v++) h.push("..");
          return h = h.concat(d.slice(p)), h.join("/");
        }, f.sep = "/", f.delimiter = ":", f.dirname = function(c) {
          if (typeof c != "string" && (c += ""), c.length === 0) return ".";
          for (var i = c.charCodeAt(0), s = i === 47, l = -1, d = !0, m = c.length - 1; m >= 1; --m) if (i = c.charCodeAt(m), i === 47) {
            if (!d) {
              l = m;
              break;
            }
          } else d = !1;
          return l === -1 ? s ? "/" : "." : s && l === 1 ? "/" : c.slice(0, l);
        }, f.basename = function(c, i) {
          var s = o(c);
          return i && s.substr(-1 * i.length) === i && (s = s.substr(0, s.length - i.length)), s;
        }, f.extname = function(c) {
          typeof c != "string" && (c += "");
          for (var i = -1, s = 0, l = -1, d = !0, m = 0, p = c.length - 1; p >= 0; --p) {
            var v = c.charCodeAt(p);
            if (v !== 47) l === -1 && (d = !1, l = p + 1), v === 46 ? i === -1 ? i = p : m !== 1 && (m = 1) : i !== -1 && (m = -1);
            else if (!d) {
              s = p + 1;
              break;
            }
          }
          return i === -1 || l === -1 || m === 0 || m === 1 && i === l - 1 && i === s + 1 ? "" : c.slice(i, l);
        };
        var u = "ab".substr(-1) === "b" ? function(c, i, s) {
          return c.substr(i, s);
        } : function(c, i, s) {
          return i < 0 && (i = c.length + i), c.substr(i, s);
        };
      }).call(this, e("4362"));
    }, e017: function(a, f, e) {
      (function(n) {
        (function(r, o) {
          a.exports = o();
        })(0, function() {
          var r = function(v) {
            var h = v.id, y = v.viewBox, g = v.content;
            this.id = h, this.viewBox = y, this.content = g;
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
            var h = !!document.importNode, y = new DOMParser().parseFromString(v, "image/svg+xml").documentElement;
            return h ? document.importNode(y, !0) : y;
          };
          function t(v, h) {
            return h = { exports: {} }, v(h, h.exports), h.exports;
          }
          var u = t(function(v, h) {
            (function(y, g) {
              v.exports = g();
            })(0, function() {
              function y(b) {
                var O = b && typeof b == "object";
                return O && Object.prototype.toString.call(b) !== "[object RegExp]" && Object.prototype.toString.call(b) !== "[object Date]";
              }
              function g(b) {
                return Array.isArray(b) ? [] : {};
              }
              function j(b, O) {
                var _ = O && O.clone === !0;
                return _ && y(b) ? w(g(b), b, O) : b;
              }
              function C(b, O, _) {
                var T = b.slice();
                return O.forEach(function(S, M) {
                  typeof T[M] > "u" ? T[M] = j(S, _) : y(S) ? T[M] = w(b[M], S, _) : b.indexOf(S) === -1 && T.push(j(S, _));
                }), T;
              }
              function x(b, O, _) {
                var T = {};
                return y(b) && Object.keys(b).forEach(function(S) {
                  T[S] = j(b[S], _);
                }), Object.keys(O).forEach(function(S) {
                  y(O[S]) && b[S] ? T[S] = w(b[S], O[S], _) : T[S] = j(O[S], _);
                }), T;
              }
              function w(b, O, _) {
                var T = Array.isArray(O), S = _ || { arrayMerge: C }, M = S.arrayMerge || C;
                return T ? Array.isArray(b) ? M(b, O, _) : j(O, _) : x(b, O, _);
              }
              return w.all = function(b, O) {
                if (!Array.isArray(b) || b.length < 2) throw new Error("first argument should be an array with at least two elements");
                return b.reduce(function(_, T) {
                  return w(_, T, O);
                });
              }, w;
            });
          }), c = t(function(v, h) {
            var y = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = y, v.exports = h.default;
          }), i = function(v) {
            return Object.keys(v).map(function(h) {
              var y = v[h].toString().replace(/"/g, "&quot;");
              return h + '="' + y + '"';
            }).join(" ");
          }, s = c.svg, l = c.xlink, d = {};
          d[s.name] = s.uri, d[l.name] = l.uri;
          var m = function(v, h) {
            v === void 0 && (v = "");
            var y = u(d, {}), g = i(y);
            return "<svg " + g + ">" + v + "</svg>";
          }, p = function(v) {
            function h() {
              v.apply(this, arguments);
            }
            v && (h.__proto__ = v), h.prototype = Object.create(v && v.prototype), h.prototype.constructor = h;
            var y = { isMounted: {} };
            return y.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(g) {
              return new h({ id: g.getAttribute("id"), viewBox: g.getAttribute("viewBox"), content: g.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), v.prototype.destroy.call(this);
            }, h.prototype.mount = function(g) {
              if (this.isMounted) return this.node;
              var j = typeof g == "string" ? document.querySelector(g) : g, C = this.render();
              return this.node = C, j.appendChild(C), C;
            }, h.prototype.render = function() {
              var g = this.stringify();
              return o(m(g)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, y), h;
          }(r);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(a, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), c = e("9bf2").f, i = e("e893"), s = o.Symbol;
      if (r && typeof s == "function" && (!("description" in s.prototype) || s().description !== void 0)) {
        var l = {}, d = function() {
          var y = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), g = this instanceof d ? new s(y) : y === void 0 ? s() : s(y);
          return y === "" && (l[g] = !0), g;
        };
        i(d, s);
        var m = d.prototype = s.prototype;
        m.constructor = d;
        var p = m.toString, v = String(s("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        c(m, "description", { configurable: !0, get: function() {
          var y = u(this) ? this.valueOf() : this, g = p.call(y);
          if (t(l, y)) return "";
          var j = v ? g.slice(7, -1) : g.replace(h, "$1");
          return j === "" ? void 0 : j;
        } }), n({ global: !0, forced: !0 }, { Symbol: d });
      }
    }, e163: function(a, f, e) {
      var n = e("5135"), r = e("7b0b"), o = e("f772"), t = e("e177"), u = o("IE_PROTO"), c = Object.prototype;
      a.exports = t ? Object.getPrototypeOf : function(i) {
        return i = r(i), n(i, u) ? i[u] : typeof i.constructor == "function" && i instanceof i.constructor ? i.constructor.prototype : i instanceof Object ? c : null;
      };
    }, e177: function(a, f, e) {
      var n = e("d039");
      a.exports = !n(function() {
        function r() {
        }
        return r.prototype.constructor = null, Object.getPrototypeOf(new r()) !== r.prototype;
      });
    }, e260: function(a, f, e) {
      var n = e("fc6a"), r = e("44d2"), o = e("3f8c"), t = e("69f3"), u = e("7dd0"), c = "Array Iterator", i = t.set, s = t.getterFor(c);
      a.exports = u(Array, "Array", function(l, d) {
        i(this, { type: c, target: n(l), index: 0, kind: d });
      }, function() {
        var l = s(this), d = l.target, m = l.kind, p = l.index++;
        return !d || p >= d.length ? (l.target = void 0, { value: void 0, done: !0 }) : m == "keys" ? { value: p, done: !1 } : m == "values" ? { value: d[p], done: !1 } : { value: [p, d[p]], done: !1 };
      }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries");
    }, e2cc: function(a, f, e) {
      var n = e("6eeb");
      a.exports = function(r, o, t) {
        for (var u in o) n(r, u, o[u], t);
        return r;
      };
    }, e439: function(a, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("fc6a"), t = e("06cf").f, u = e("83ab"), c = r(function() {
        t(1);
      }), i = !u || c;
      n({ target: "Object", stat: !0, forced: i, sham: !u }, { getOwnPropertyDescriptor: function(s, l) {
        return t(o(s), l);
      } });
    }, e538: function(a, f, e) {
      var n = e("b622");
      f.f = n;
    }, e667: function(a, f) {
      a.exports = function(e) {
        try {
          return { error: !1, value: e() };
        } catch (n) {
          return { error: !0, value: n };
        }
      };
    }, e66c: function(a, f, e) {
      e("95d9");
    }, e683: function(a, f, e) {
      a.exports = function(n, r) {
        return r ? n.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(a, f, e) {
      var n, r, o, t, u = e("23e7"), c = e("c430"), i = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), m = e("e2cc"), p = e("d44e"), v = e("2626"), h = e("861d"), y = e("1c0b"), g = e("19aa"), j = e("8925"), C = e("2266"), x = e("1c7e"), w = e("4840"), b = e("2cf4").set, O = e("b575"), _ = e("cdf9"), T = e("44de"), S = e("f069"), M = e("e667"), A = e("69f3"), B = e("94ca"), te = e("b622"), Y = e("605d"), ae = e("2d00"), Z = te("species"), L = "Promise", N = A.get, K = A.set, H = A.getterFor(L), V = l, me = i.TypeError, fe = i.document, Te = i.process, Ae = s("fetch"), Be = S.f, Se = Be, Oe = !!(fe && fe.createEvent && i.dispatchEvent), Ve = typeof PromiseRejectionEvent == "function", He = "unhandledrejection", U = "rejectionhandled", $ = 0, F = 1, E = 2, W = 1, J = 2, ge = B(L, function() {
        var z = j(V) !== String(V);
        if (!z && (ae === 66 || !Y && !Ve) || c && !V.prototype.finally) return !0;
        if (ae >= 51 && /native code/.test(V)) return !1;
        var re = V.resolve(1), se = function(q) {
          q(function() {
          }, function() {
          });
        }, de = re.constructor = {};
        return de[Z] = se, !(re.then(function() {
        }) instanceof se);
      }), he = ge || !x(function(z) {
        V.all(z).catch(function() {
        });
      }), ue = function(z) {
        var re;
        return !(!h(z) || typeof (re = z.then) != "function") && re;
      }, we = function(z, re) {
        if (!z.notified) {
          z.notified = !0;
          var se = z.reactions;
          O(function() {
            for (var de = z.value, q = z.state == F, X = 0; se.length > X; ) {
              var ie, pe, Me, qe = se[X++], Ze = q ? qe.ok : qe.fail, be = qe.resolve, et = qe.reject, Ke = qe.domain;
              try {
                Ze ? (q || (z.rejection === J && We(z), z.rejection = W), Ze === !0 ? ie = de : (Ke && Ke.enter(), ie = Ze(de), Ke && (Ke.exit(), Me = !0)), ie === qe.promise ? et(me("Promise-chain cycle")) : (pe = ue(ie)) ? pe.call(ie, be, et) : be(ie)) : et(de);
              } catch (gt) {
                Ke && !Me && Ke.exit(), et(gt);
              }
            }
            z.reactions = [], z.notified = !1, re && !z.rejection && Ie(z);
          });
        }
      }, ke = function(z, re, se) {
        var de, q;
        Oe ? (de = fe.createEvent("Event"), de.promise = re, de.reason = se, de.initEvent(z, !1, !0), i.dispatchEvent(de)) : de = { promise: re, reason: se }, !Ve && (q = i["on" + z]) ? q(de) : z === He && T("Unhandled promise rejection", se);
      }, Ie = function(z) {
        b.call(i, function() {
          var re, se = z.facade, de = z.value, q = je(z);
          if (q && (re = M(function() {
            Y ? Te.emit("unhandledRejection", de, se) : ke(He, se, de);
          }), z.rejection = Y || je(z) ? J : W, re.error)) throw re.value;
        });
      }, je = function(z) {
        return z.rejection !== W && !z.parent;
      }, We = function(z) {
        b.call(i, function() {
          var re = z.facade;
          Y ? Te.emit("rejectionHandled", re) : ke(U, re, z.value);
        });
      }, Ge = function(z, re, se) {
        return function(de) {
          z(re, de, se);
        };
      }, Je = function(z, re, se) {
        z.done || (z.done = !0, se && (z = se), z.value = re, z.state = E, we(z, !0));
      }, nt = function(z, re, se) {
        if (!z.done) {
          z.done = !0, se && (z = se);
          try {
            if (z.facade === re) throw me("Promise can't be resolved itself");
            var de = ue(re);
            de ? O(function() {
              var q = { done: !1 };
              try {
                de.call(re, Ge(nt, q, z), Ge(Je, q, z));
              } catch (X) {
                Je(q, X, z);
              }
            }) : (z.value = re, z.state = F, we(z, !1));
          } catch (q) {
            Je({ done: !1 }, q, z);
          }
        }
      };
      ge && (V = function(z) {
        g(this, V, L), y(z), n.call(this);
        var re = N(this);
        try {
          z(Ge(nt, re), Ge(Je, re));
        } catch (se) {
          Je(re, se);
        }
      }, n = function(z) {
        K(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: $, value: void 0 });
      }, n.prototype = m(V.prototype, { then: function(z, re) {
        var se = H(this), de = Be(w(this, V));
        return de.ok = typeof z != "function" || z, de.fail = typeof re == "function" && re, de.domain = Y ? Te.domain : void 0, se.parent = !0, se.reactions.push(de), se.state != $ && we(se, !1), de.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), r = function() {
        var z = new n(), re = N(z);
        this.promise = z, this.resolve = Ge(nt, re), this.reject = Ge(Je, re);
      }, S.f = Be = function(z) {
        return z === V || z === o ? new r(z) : Se(z);
      }, c || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(z, re) {
        var se = this;
        return new V(function(de, q) {
          t.call(se, de, q);
        }).then(z, re);
      }, { unsafe: !0 }), typeof Ae == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return _(V, Ae.apply(i, arguments));
      } }))), u({ global: !0, wrap: !0, forced: ge }, { Promise: V }), p(V, L, !1, !0), v(L), o = s(L), u({ target: L, stat: !0, forced: ge }, { reject: function(z) {
        var re = Be(this);
        return re.reject.call(void 0, z), re.promise;
      } }), u({ target: L, stat: !0, forced: c || ge }, { resolve: function(z) {
        return _(c && this === o ? V : this, z);
      } }), u({ target: L, stat: !0, forced: he }, { all: function(z) {
        var re = this, se = Be(re), de = se.resolve, q = se.reject, X = M(function() {
          var ie = y(re.resolve), pe = [], Me = 0, qe = 1;
          C(z, function(Ze) {
            var be = Me++, et = !1;
            pe.push(void 0), qe++, ie.call(re, Ze).then(function(Ke) {
              et || (et = !0, pe[be] = Ke, --qe || de(pe));
            }, q);
          }), --qe || de(pe);
        });
        return X.error && q(X.value), se.promise;
      }, race: function(z) {
        var re = this, se = Be(re), de = se.reject, q = M(function() {
          var X = y(re.resolve);
          C(z, function(ie) {
            X.call(re, ie).then(se.resolve, de);
          });
        });
        return q.error && de(q.value), se.promise;
      } });
    }, e893: function(a, f, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      a.exports = function(u, c) {
        for (var i = r(c), s = t.f, l = o.f, d = 0; d < i.length; d++) {
          var m = i[d];
          n(u, m) || s(u, m, l(c, m));
        }
      };
    }, e8b5: function(a, f, e) {
      var n = e("c6b6");
      a.exports = Array.isArray || function(r) {
        return n(r) == "Array";
      };
    }, e95a: function(a, f, e) {
      var n = e("b622"), r = e("3f8c"), o = n("iterator"), t = Array.prototype;
      a.exports = function(u) {
        return u !== void 0 && (r.Array === u || t[o] === u);
      };
    }, ec57: function(a, f, e) {
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
      }, r.resolve = o, a.exports = r, r.id = "ec57";
    }, f069: function(a, f, e) {
      var n = e("1c0b"), r = function(o) {
        var t, u;
        this.promise = new o(function(c, i) {
          if (t !== void 0 || u !== void 0) throw TypeError("Bad Promise constructor");
          t = c, u = i;
        }), this.resolve = n(t), this.reject = n(u);
      };
      a.exports.f = function(o) {
        return new r(o);
      };
    }, f183: function(a, f, e) {
      var n = e("d012"), r = e("861d"), o = e("5135"), t = e("9bf2").f, u = e("90e3"), c = e("bb2f"), i = u("meta"), s = 0, l = Object.isExtensible || function() {
        return !0;
      }, d = function(y) {
        t(y, i, { value: { objectID: "O" + ++s, weakData: {} } });
      }, m = function(y, g) {
        if (!r(y)) return typeof y == "symbol" ? y : (typeof y == "string" ? "S" : "P") + y;
        if (!o(y, i)) {
          if (!l(y)) return "F";
          if (!g) return "E";
          d(y);
        }
        return y[i].objectID;
      }, p = function(y, g) {
        if (!o(y, i)) {
          if (!l(y)) return !0;
          if (!g) return !1;
          d(y);
        }
        return y[i].weakData;
      }, v = function(y) {
        return c && h.REQUIRED && l(y) && !o(y, i) && d(y), y;
      }, h = a.exports = { REQUIRED: !1, fastKey: m, getWeakData: p, onFreeze: v };
      n[i] = !0;
    }, f5df: function(a, f, e) {
      var n = e("00ee"), r = e("c6b6"), o = e("b622"), t = o("toStringTag"), u = r(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", c = function(i, s) {
        try {
          return i[s];
        } catch {
        }
      };
      a.exports = n ? r : function(i) {
        var s, l, d;
        return i === void 0 ? "Undefined" : i === null ? "Null" : typeof (l = c(s = Object(i), t)) == "string" ? l : u ? r(s) : (d = r(s)) == "Object" && typeof s.callee == "function" ? "Arguments" : d;
      };
    }, f6b4: function(a, f, e) {
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
      }, a.exports = r;
    }, f772: function(a, f, e) {
      var n = e("5692"), r = e("90e3"), o = n("keys");
      a.exports = function(t) {
        return o[t] || (o[t] = r(t));
      };
    }, f8b0: function(a, f, e) {
      e("b8d6");
    }, fb15: function(a, f, e) {
      if (e.r(f), typeof window < "u") {
        var n = window.document.currentScript, r = e("8875");
        n = r(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: r });
        var o = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        o && (e.p = o[1]);
      }
      e("b0c0");
      var t = e("8bbf"), u = { class: "key-board-container" }, c = { class: "key-board-area" };
      function i(k, D, R, I, Q, oe) {
        var le = Object(t.resolveComponent)("Result"), ce = Object(t.resolveComponent)("DefaultBoard"), ve = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Ue = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: k.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [k.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: D[1] || (D[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(le, { data: k.resultVal, onChange: k.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [k.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ce, { key: 0, ref: "defaultBoardRef", onTrigger: k.trigger, onChange: k.change, onTranslate: k.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), k.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ve, { key: 1, onTrigger: k.trigger, onChange: k.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), k.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: k.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(k.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Ue]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(k, D, R) {
        return D in k ? Object.defineProperty(k, D, { value: R, enumerable: !0, configurable: !0, writable: !0 }) : k[D] = R, k;
      }
      function l(k, D) {
        var R = Object.keys(k);
        if (Object.getOwnPropertySymbols) {
          var I = Object.getOwnPropertySymbols(k);
          D && (I = I.filter(function(Q) {
            return Object.getOwnPropertyDescriptor(k, Q).enumerable;
          })), R.push.apply(R, I);
        }
        return R;
      }
      function d(k) {
        for (var D = 1; D < arguments.length; D++) {
          var R = arguments[D] != null ? arguments[D] : {};
          D % 2 ? l(Object(R), !0).forEach(function(I) {
            s(k, I, R[I]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(k, Object.getOwnPropertyDescriptors(R)) : l(Object(R)).forEach(function(I) {
            Object.defineProperty(k, I, Object.getOwnPropertyDescriptor(R, I));
          });
        }
        return k;
      }
      function m(k, D) {
        (D == null || D > k.length) && (D = k.length);
        for (var R = 0, I = new Array(D); R < D; R++) I[R] = k[R];
        return I;
      }
      function p(k) {
        if (Array.isArray(k)) return m(k);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(k) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(k)) return Array.from(k);
      }
      e("fb6a");
      function h(k, D) {
        if (k) {
          if (typeof k == "string") return m(k, D);
          var R = Object.prototype.toString.call(k).slice(8, -1);
          return R === "Object" && k.constructor && (R = k.constructor.name), R === "Map" || R === "Set" ? Array.from(k) : R === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(R) ? m(k, D) : void 0;
        }
      }
      function y() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function g(k) {
        return p(k) || v(k) || h(k) || y();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function j(k, D) {
        if (!(k instanceof D)) throw new TypeError("Cannot call a class as a function");
      }
      function C(k, D) {
        for (var R = 0; R < D.length; R++) {
          var I = D[R];
          I.enumerable = I.enumerable || !1, I.configurable = !0, "value" in I && (I.writable = !0), Object.defineProperty(k, I.key, I);
        }
      }
      function x(k, D, R) {
        return D && C(k.prototype, D), k;
      }
      var w = function() {
        function k() {
          j(this, k), this.listeners = {};
        }
        return x(k, [{ key: "on", value: function(D, R) {
          var I = this, Q = this.listeners[D];
          return Q || (Q = []), Q.push(R), this.listeners[D] = Q, function() {
            I.remove(D, R);
          };
        } }, { key: "emit", value: function(D) {
          var R = this.listeners[D];
          if (Array.isArray(R)) {
            for (var I = arguments.length, Q = new Array(I > 1 ? I - 1 : 0), oe = 1; oe < I; oe++) Q[oe - 1] = arguments[oe];
            for (var le = 0; le < R.length; le++) {
              var ce = R[le];
              typeof ce == "function" && ce.apply(void 0, Q);
            }
          }
        } }, { key: "remove", value: function(D, R) {
          if (R) {
            var I = this.listeners[D];
            if (!I) return;
            I = I.filter(function(Q) {
              return Q !== R;
            }), this.listeners[D] = I;
          } else this.listeners[D] = null, delete this.listeners[D];
        } }]), k;
      }(), b = new w(), O = { mounted: function(k, D, R) {
        var I = k.parentNode;
        k.onmousedown = function(Q) {
          var oe = Q.clientX - I.offsetLeft, le = Q.clientY - I.offsetTop;
          document.onmousemove = function(ce) {
            var ve = ce.clientX - oe, Re = ce.clientY - le;
            I.style.left = ve + "px", I.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, k.ontouchstart = function(Q) {
          var oe = Q.touches[0].pageX, le = Q.touches[0].pageY, ce = oe - I.offsetLeft, ve = le - I.offsetTop;
          document.ontouchmove = function(Re) {
            var Ue = Re.touches[0].pageX, Fe = Re.touches[0].pageY, ze = Ue - ce, lt = Fe - ve;
            I.style.left = ze + "px", I.style.top = lt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, _ = O, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, M = { class: "key-board-result-show" }, A = { class: "key-board-result-show-container" }, B = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var te = T(function(k, D, R, I, Q, oe) {
        return k.status === "CN" || k.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: k.color } }, [k.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(k.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", M, [Object(t.createVNode)("div", A, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.showList[k.showIndex], function(le, ce) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ce, onClick: function(ve) {
            return k.selectWord(le);
          } }, Object(t.toDisplayString)(ce + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), k.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", B, [Object(t.createVNode)("span", { style: k.getStyle, onClick: D[1] || (D[1] = function() {
          return k.upper && k.upper.apply(k, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: k.getStyle, onClick: D[2] || (D[2] = function() {
          return k.lower && k.lower.apply(k, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), Y = (e("1276"), e("6062"), e("5319"), function(k, D) {
        for (var R = 0, I = []; R < k.length; ) I.push(k.slice(R, R += D));
        return I;
      }), ae = Symbol("KEYBOARD_CONTEXT"), Z = function(k) {
        Object(t.provide)(ae, k);
      }, L = function() {
        return Object(t.inject)(ae);
      }, N = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(k, D) {
        var R = D.emit, I = L(), Q = Object(t.computed)(function() {
          return { borderTopColor: I == null ? void 0 : I.color };
        }), oe = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          oe.showIndex !== 0 && (oe.showIndex -= 1);
        }
        function ce() {
          oe.showIndex !== oe.showList.length - 1 && (oe.showIndex += 1);
        }
        function ve() {
          oe.showIndex = 0, oe.showList = [], oe.valueList = [], b.emit("resultReset");
        }
        function Re(Ue) {
          ve(), R("change", Ue);
        }
        return Object(t.watch)(function() {
          return k.data;
        }, function(Ue) {
          var Fe;
          oe.showIndex = 0, oe.valueList = (Ue == null || (Fe = Ue.value) === null || Fe === void 0 ? void 0 : Fe.split("")) || [], oe.valueList.length !== 0 ? oe.showList = Y(oe.valueList, 11) : oe.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          b.on("keyBoardChange", function(Ue) {
            b.emit("updateBound"), oe.status = Ue, ve();
          }), b.on("getWordsFromServer", function(Ue) {
            var Fe = Array.from(new Set(Ue.replace(/\s+/g, "").split("")));
            oe.valueList = Fe, oe.showList = Y(Fe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          b.remove("keyBoardChange"), b.remove("getWordsFromServer");
        }), d({ color: I == null ? void 0 : I.color, upper: le, lower: ce, getStyle: Q, selectWord: Re }, Object(t.toRefs)(oe));
      } });
      e("e66c"), N.render = te, N.__scopeId = "data-v-02e63132";
      var K = N, H = e("bc3a"), V = e.n(H), me = 15e3, fe = function(k) {
        V.a.defaults.baseURL = k, V.a.defaults.timeout = me, V.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Te(k, D, R, I, Q, oe) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: k.color } }, [Object(t.createVNode)("use", { "xlink:href": k.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Ae = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(k) {
        var D = L(), R = Object(t.computed)(function() {
          return "#icon-".concat(k.iconClass);
        });
        return { color: D == null ? void 0 : D.color, iconName: R };
      } });
      e("38cd"), Ae.render = Te;
      var Be = Ae, Se = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Oe = { class: "hand-write-board" }, Ve = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var He = Se(function(k, D, R, I, Q, oe) {
        var le = Object(t.resolveComponent)("PaintBoard"), ce = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Oe, [Object(t.createVNode)(le, { lib: k.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Ve, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.handBoardOperList, function(ve) {
          return Object(t.openBlock)(), Object(t.createBlock)(ce, { key: ve.type, type: ve.type, data: ve.data, isCn: k.isCn, onClick: k.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), U = { class: "paint-board" };
      function $(k, D, R, I, Q, oe) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", U, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: k.width, height: k.height, onTouchstart: D[1] || (D[1] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onTouchmove: D[2] || (D[2] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onTouchend: D[3] || (D[3] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMousedown: D[4] || (D[4] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onMousemove: D[5] || (D[5] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onMouseup: D[6] || (D[6] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMouseleave: D[7] || (D[7] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function F(k, D, R, I, Q, oe, le) {
        try {
          var ce = k[oe](le), ve = ce.value;
        } catch (Re) {
          return void R(Re);
        }
        ce.done ? D(ve) : Promise.resolve(ve).then(I, Q);
      }
      function E(k) {
        return function() {
          var D = this, R = arguments;
          return new Promise(function(I, Q) {
            var oe = k.apply(D, R);
            function le(ve) {
              F(oe, I, Q, le, ce, "next", ve);
            }
            function ce(ve) {
              F(oe, I, Q, le, ce, "throw", ve);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var W, J, ge = function() {
        var k = E(regeneratorRuntime.mark(function D(R, I, Q, oe) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, V.a.post("", { lib: oe, lpXis: R, lpYis: I, lpCis: Q });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, D);
        }));
        return function(D, R, I, Q) {
          return k.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(k) {
        var D = L(), R = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), I = Object(t.ref)(null);
        function Q() {
          return oe.apply(this, arguments);
        }
        function oe() {
          return oe = E(regeneratorRuntime.mark(function Ee() {
            var Qe, $e;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, ge(R.clickX, R.clickY, R.clickC, k.lib);
                case 2:
                  Qe = Ye.sent, $e = Qe.data, b.emit("getWordsFromServer", ($e == null ? void 0 : $e.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ee);
          })), oe.apply(this, arguments);
        }
        function le() {
          I.value && W && (R.clickX = [], R.clickY = [], R.clickC = [], W.clearRect(0, 0, R.width, R.height));
        }
        function ce(Ee) {
          if (Ee.type.includes("mouse")) {
            var Qe = Ee;
            return Math.floor(Qe.clientX - R.x);
          }
          if (Ee.type.includes("touch")) {
            var $e, Ye = Ee;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientX) - R.x);
          }
          return 0;
        }
        function ve(Ee) {
          if (Ee.type.includes("mouse")) {
            var Qe = Ee;
            return Math.floor(Qe.clientY - R.y);
          }
          if (Ee.type.includes("touch")) {
            var $e, Ye = Ee;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientY) - R.y);
          }
          return 0;
        }
        function Re(Ee) {
          if (W) {
            R.isMouseDown = !0;
            var Qe = ce(Ee), $e = ve(Ee);
            clearTimeout(J), R.oldX = Qe, R.oldY = $e, W.beginPath();
          }
        }
        function Ue(Ee) {
          if (W && (Ee.preventDefault(), R.isMouseDown)) {
            var Qe = ce(Ee), $e = ve(Ee);
            R.clickX.push(Qe), R.clickY.push($e), R.clickC.push(0), W.strokeStyle = D == null ? void 0 : D.color, W.fillStyle = D == null ? void 0 : D.color, W.lineWidth = 4, W.lineCap = "round", W.moveTo(R.oldX, R.oldY), W.lineTo(Qe, $e), W.stroke(), R.oldX = Qe, R.oldY = $e;
          }
        }
        function Fe() {
          R.isMouseDown && (R.isMouseDown = !1, J = setTimeout(function() {
            le();
          }, 1500), R.clickC.pop(), R.clickC.push(1), Q());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ee = document.querySelector(".paint-board").getBoundingClientRect();
              R.x = Ee.x, R.y = Ee.y, R.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), R.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function lt() {
          var Ee;
          W = (Ee = I.value) === null || Ee === void 0 ? void 0 : Ee.getContext("2d"), le(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          lt(), b.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), b.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(R)), {}, { move: Ue, down: Re, mouseup: Fe, canvasRef: I });
      } });
      he.render = $;
      var ue = he;
      function we(k, D, R, I, Q, oe) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(k.type), { "key-board-button-active": k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" }], style: k.getStyle, onClick: D[1] || (D[1] = function() {
          return k.click && k.click.apply(k, arguments);
        }), onMouseenter: D[2] || (D[2] = function(ce) {
          return k.isHoverStatus = !0;
        }), onMouseleave: D[3] || (D[3] = function(ce) {
          return k.isHoverStatus = !1;
        }) }, [k.type === "upper" || k.type === "delete" || k.type === "handwrite" || k.type === "close" || k.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": k.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: k.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ke = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Be }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(k, D) {
        var R = D.emit, I = L(), Q = Object(t.ref)(!1), oe = Object(t.computed)(function() {
          return k.type === "change2lang" ? k.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : k.isUpper ? k.data.toUpperCase() : k.data;
        }), le = Object(t.computed)(function() {
          return k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" || Q.value ? { color: "#f5f5f5", background: I == null ? void 0 : I.color } : { color: I == null ? void 0 : I.color, background: "#f5f5f5" };
        });
        function ce(ve) {
          ve.preventDefault(), R("click", { data: k.isUpper ? k.data.toUpperCase() : k.data, type: k.type });
        }
        return { isHoverStatus: Q, getStyle: le, getCode: oe, click: ce };
      } });
      e("de23"), ke.render = we;
      var Ie = ke, je = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ue, KeyCodeButton: Ie }, setup: function(k, D) {
        var R = D.emit, I = L(), Q = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function oe(le) {
          var ce = le.data, ve = le.type;
          switch (ve) {
            case "close":
              I == null || I.closeKeyBoard();
              break;
            case "back":
              I == null || I.changeDefaultBoard(), b.emit("resultReset"), b.emit("keyBoardChange", Q.isCn && "CN");
              break;
            case "change2lang":
              Q.isCn = !Q.isCn;
              break;
            case "delete":
              R("trigger", { data: ce, type: ve });
              break;
          }
        }
        return d({ click: oe }, Object(t.toRefs)(Q));
      } });
      e("9aaf"), je.render = He, je.__scopeId = "data-v-1b5e0983";
      var We = je, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Je = { class: "default-key-board" }, nt = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Ge(function(k, D, R, I, Q, oe) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Je, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.lineList, function(ce, ve) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ve + 1)], key: ve }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ce, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: k.isUpper, key: Re, type: Re, data: Re, isSymbol: k.isSymbol, onClick: k.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", nt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.line4, function(ce) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ce.type, type: ce.type, data: ce.data, isCn: k.isCn, isNum: k.isNum, onClick: k.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), re = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), se = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, de = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], X = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Ie }, emits: ["translate", "trigger", "change"], setup: function(k, D) {
        var R = D.emit, I = L(), Q = Object(t.reactive)({ lineList: [se.line1, se.line2, se.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function oe() {
          var ce;
          Q.line4 = JSON.parse(JSON.stringify(q)), I != null && (ce = I.modeList) !== null && ce !== void 0 && ce.find(function(ve) {
            return ve === "handwrite";
          }) && I !== null && I !== void 0 && I.handApi && Q.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ce) {
          var ve = ce.data, Re = ce.type;
          switch (Re) {
            case "close":
              Q.oldVal = "", I == null || I.closeKeyBoard();
              break;
            case "upper":
              Q.oldVal = "", Q.isUpper = !Q.isUpper;
              break;
            case "change2lang":
              Q.isCn = !Q.isCn, Q.isNum || Q.isSymbol || b.emit("keyBoardChange", Q.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (Q.isNum = !Q.isNum, Q.isSymbol = !1, Q.isNum) {
                var Ue;
                b.emit("keyBoardChange", "number");
                var Fe = JSON.parse(JSON.stringify(de.line3));
                I != null && (Ue = I.modeList) !== null && Ue !== void 0 && Ue.find(function(ze) {
                  return ze === "symbol";
                }) || (Fe.shift(), Fe.unshift("+")), Q.lineList = [de.line1, de.line2, Fe];
              } else b.emit("keyBoardChange", Q.isCn ? "CN" : "EN"), Q.lineList = [se.line1, se.line2, se.line3];
              break;
            case "#+=":
              Q.isSymbol = !Q.isSymbol, Q.isSymbol ? (b.emit("keyBoardChange", "symbol"), Q.lineList = [re.line1, re.line2, re.line3]) : (b.emit("keyBoardChange", "number"), Q.lineList = [de.line1, de.line2, de.line3]);
              break;
            case "handwrite":
            case "delete":
              Q.isCn && Re === "delete" && Q.oldVal ? (Q.oldVal = Q.oldVal.substr(0, Q.oldVal.length - 1), R("translate", Q.oldVal)) : (Re === "handwrite" && b.emit("keyBoardChange", "handwrite"), R("trigger", { data: ve, type: Re }));
              break;
            default:
              !Q.isCn || Q.isNum || Q.isSymbol ? R("change", ve) : (R("translate", Q.oldVal + ve), Q.oldVal = Q.oldVal + ve);
              break;
          }
        }
        return oe(), Object(t.onMounted)(function() {
          b.on("resultReset", function() {
            Q.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(Q)), {}, { click: le });
      } });
      e("f8b0"), X.render = z, X.__scopeId = "data-v-4b78e5a1";
      var ie = X, pe = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Me = e("ec57"), qe = function(k) {
        return k.keys().map(k);
      };
      qe(Me);
      var Ze = [], be = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: _ }, components: { Result: K, SvgIcon: Be, HandBoard: We, DefaultBoard: ie }, setup: function(k, D) {
        var R = D.emit, I = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), Q = Object(t.ref)(null);
        function oe(xe) {
          var _e, Ce;
          switch (Object(t.nextTick)(function() {
            b.emit("keyBoardChange", "CN");
          }), xe) {
            case "en":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Le;
                (Le = Q.value) === null || Le === void 0 || Le.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Le;
                (Le = Q.value) === null || Le === void 0 || Le.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (_e = k.modeList) !== null && _e !== void 0 && _e.find(function(Le) {
                return Le === "handwrite";
              }) && k.handApi ? (I.showMode = "handwrite", Object(t.nextTick)(function() {
                b.emit("keyBoardChange", "handwrite");
              })) : I.showMode = "default";
              break;
            case "symbol":
              I.showMode = "default", (Ce = k.modeList) !== null && Ce !== void 0 && Ce.find(function(Le) {
                return Le === "symbol";
              }) && Object(t.nextTick)(function() {
                var Le, tt;
                (Le = Q.value) === null || Le === void 0 || Le.click({ data: ".?123", type: "change2num" }), (tt = Q.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              I.showMode = "default";
              break;
          }
        }
        function le(xe) {
          if (I.visible = !0, be = xe.target, oe(be.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var _e = document.querySelector(".key-board-modal");
            _e.style.display = "block";
          }
        }
        function ce() {
          if (be && be.blur(), be = null, I.visible = !1, R("closed"), I.showMode = "default", I.resultVal = {}, document.querySelector(".key-board-modal")) {
            var xe = document.querySelector(".key-board-modal");
            xe.style.display = "none";
          }
        }
        function ve() {
          k.closeOnClickModal && ce(), R("modalClick");
        }
        function Re() {
          var xe;
          if (document.querySelector(".key-board-modal")) {
            var _e;
            (_e = document.querySelector(".key-board-modal")) === null || _e === void 0 || _e.addEventListener("click", ve);
          } else {
            var Ce = document.createElement("div");
            Ce.className = "key-board-modal", Ce.style.display = "none", (xe = document.querySelector("body")) === null || xe === void 0 || xe.appendChild(Ce), Ce.addEventListener("click", ve);
          }
        }
        function Ue() {
          k.handApi && fe(k.handApi), [].concat(g(document.querySelectorAll("input")), g(document.querySelectorAll("textarea"))).forEach(function(xe) {
            xe.getAttribute("data-mode") !== null && (Ze.push(xe), xe.addEventListener("focus", le), k.blurHide && xe.addEventListener("blur", ce));
          });
        }
        function Fe(xe) {
          if (!be) return "";
          var _e = be, Ce = _e.selectionStart, Le = _e.selectionEnd;
          if (!Ce || !Le) return "";
          var tt = xe.substring(0, Ce - 1) + xe.substring(Le);
          return _e.value = tt, _e.focus(), _e.selectionStart = Ce - 1, _e.selectionEnd = Ce - 1, tt;
        }
        function ze(xe) {
          var _e = xe.type;
          switch (_e) {
            case "handwrite":
              I.showMode = "handwrite";
              break;
            case "delete":
              if (!be) return;
              var Ce = Fe(be.value);
              be.value = Ce, R("change", Ce, be.getAttribute("data-prop") || be);
              break;
          }
        }
        function lt(xe, _e) {
          if (!be) return "";
          var Ce = be, Le = Ce.selectionStart || 0, tt = Ce.selectionEnd || 0, xt = xe.substring(0, Le) + _e + xe.substring(tt);
          return Ce.value = xt, Ce.focus(), Ce.selectionStart = Le + _e.length, Ce.selectionEnd = Le + _e.length, xt;
        }
        function Ee(xe) {
          if (be) {
            var _e = lt(be.value, xe);
            be.value = _e, R("change", _e, be.getAttribute("data-prop") || be), R("keyChange", xe, be.getAttribute("data-prop") || be);
          }
        }
        function Qe(xe) {
          var _e = new RegExp("^".concat(xe, "\\w*")), Ce = Object.keys(pe).filter(function(Le) {
            return _e.test(Le);
          }).sort();
          I.resultVal = { code: xe, value: xe ? Ce.length > 1 ? Ce.reduce(function(Le, tt) {
            return Le + pe[tt];
          }, "") : pe[Ce[0]] : "" }, be && R("keyChange", xe, be.getAttribute("data-prop") || be);
        }
        function $e() {
          Ue();
        }
        function Ye() {
          return be;
        }
        return Object(t.onMounted)(function() {
          k.modal && Re(), Ue(), b.on("resultReset", function() {
            I.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var xe;
          (xe = document.querySelector(".key-board-modal")) === null || xe === void 0 || xe.removeEventListener("click", ve), Ze.forEach(function(_e) {
            _e.removeEventListener("focus", le), _e.removeEventListener("blur", ce);
          });
        }), Z(Object(t.reactive)({ color: k.color, modeList: k.modeList, handApi: k.handApi, closeKeyBoard: function() {
          ce();
        }, changeDefaultBoard: function() {
          I.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(I)), {}, { defaultBoardRef: Q, getCurrentInput: Ye, translate: Qe, reSignUp: $e, trigger: ze, change: Ee });
      } });
      et.render = i;
      var Ke = et;
      Ke.install = function(k) {
        k.component(Ke.name, Ke);
      };
      var gt = Ke, At = gt;
      f.default = At;
    }, fb6a: function(a, f, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), c = e("fc6a"), i = e("8418"), s = e("b622"), l = e("1dde"), d = l("slice"), m = s("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !d }, { slice: function(h, y) {
        var g, j, C, x = c(this), w = u(x.length), b = t(h, w), O = t(y === void 0 ? w : y, w);
        if (o(x) && (g = x.constructor, typeof g != "function" || g !== Array && !o(g.prototype) ? r(g) && (g = g[m], g === null && (g = void 0)) : g = void 0, g === Array || g === void 0)) return p.call(x, b, O);
        for (j = new (g === void 0 ? Array : g)(v(O - b, 0)), C = 0; b < O; b++, C++) b in x && i(j, C, x[b]);
        return j.length = C, j;
      } });
    }, fc6a: function(a, f, e) {
      var n = e("44ad"), r = e("1d80");
      a.exports = function(o) {
        return n(r(o));
      };
    }, fdbc: function(a, f) {
      a.exports = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
    }, fdbf: function(a, f, e) {
      var n = e("4930");
      a.exports = n && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }, fea9: function(a, f, e) {
      var n = e("da84");
      a.exports = n.Promise;
    } });
  });
})(Ct);
var er = Ct.exports;
const Tt = /* @__PURE__ */ Zn(er);
Pt({
  components: { KeyBoard: Tt },
  setup() {
    function ye(G, ee) {
      console.log("change value ---->", G), console.log("change input dom ---->", ee);
    }
    return {
      change: ye
    };
  }
});
const tr = { class: "wifi-component" }, nr = { class: "row" }, rr = { class: "column" }, or = { class: "column" }, ir = { class: "status" }, ar = { class: "row" }, ur = { class: "column" }, cr = {
  __name: "WiFi",
  setup(ye) {
    const G = ne("未连接"), ee = ne(""), a = ne(""), f = () => {
      alert("验证 WiFi: " + ee.value);
    }, e = () => {
      alert("连接到 WiFi: " + ee.value), G.value = "已连接到 " + ee.value;
    }, n = (r, o) => {
      o.placeholder === "WiFi 名称" ? ee.value = r : o.placeholder === "WiFi 密码" && (a.value = r);
    };
    return (r, o) => (Pe(), Ne("div", tr, [
      P("div", nr, [
        P("div", rr, [
          pt(P("input", {
            "onUpdate:modelValue": o[0] || (o[0] = (t) => ee.value = t),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, ee.value]
          ])
        ]),
        P("div", or, [
          P("div", ir, " WiFi 状态: " + De(G.value), 1)
        ])
      ]),
      P("div", ar, [
        P("div", ur, [
          pt(P("input", {
            "onUpdate:modelValue": o[1] || (o[1] = (t) => a.value = t),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, a.value]
          ])
        ]),
        P("div", { class: "column" }, [
          P("div", { class: "button-group" }, [
            P("button", { onClick: f }, "验证 WiFi"),
            P("button", { onClick: e }, "连接 WiFi")
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
  setup(ye, { emit: G }) {
    const ee = ye, a = G, f = ne([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = ne("");
    st(() => ee.showKeyboard, (r) => {
      r && (e.value = ee.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", e.value), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => ye.showKeyboard ? (Pe(), Ne("div", lr, [
      P("div", fr, [
        P("div", dr, De(e.value), 1),
        (Pe(!0), Ne(at, null, ut(f.value, (t) => (Pe(), Ne("div", {
          key: t.join(),
          class: "row"
        }, [
          (Pe(!0), Ne(at, null, ut(t, (u) => (Pe(), Ne("button", {
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
    const { sendToPyQt: G } = rt(), ee = ht({
      isPyQtWebEngine: !1
    }), a = ne("未激活"), f = ne(0), e = ne(""), n = ne(""), r = ne(""), o = ne(!1);
    let t, u;
    const c = ne(0), i = ne(1), s = ne(null), l = ne(!1), d = ne(!1), m = dt(() => a.value === "未激活" ? "设备状态: 未激活" : a.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${i.value} 次锁定 - 剩余时间: ${p.value}`), p = dt(() => {
      const M = Math.floor(f.value / 86400), A = Math.floor(f.value % (24 * 60 * 60) / (60 * 60)), B = Math.floor(f.value % (60 * 60) / 60), te = f.value % 60;
      return `${M}天 ${A.toString().padStart(2, "0")}:${B.toString().padStart(2, "0")}:${te.toString().padStart(2, "0")}`;
    }), v = dt(() => a.value === "未激活" ? "按住以激活设备" : e.value);
    function h(M) {
      a.value === "未激活" && (M.target.setPointerCapture(M.pointerId), c.value = 0, u = setInterval(() => {
        c.value += 2, c.value >= 100 && (clearInterval(u), j());
      }, 30));
    }
    function y(M) {
      M.target.releasePointerCapture(M.pointerId), g();
    }
    function g() {
      clearInterval(u), c.value = 0;
    }
    function j() {
      G("activate_device", {});
    }
    function C(M, A) {
      a.value = "已激活", e.value = M, s.value = new Date(A), x();
    }
    function x() {
      w(), t = setInterval(() => {
        f.value > 0 ? f.value-- : b();
      }, 1e3);
    }
    function w() {
      const M = /* @__PURE__ */ new Date(), A = new Date(s.value.getTime() + i.value * kr * 1e3);
      f.value = Math.max(0, Math.floor((A - M) / 1e3));
    }
    function b() {
      o.value = !0, clearInterval(t);
    }
    function O() {
      G("check_lock_password", {
        target: "attemptUnlock",
        password: n.value,
        lockCount: i.value,
        deviceRandomCode: e.value
      }), n.value = "";
    }
    function _() {
      G("check_lock_password", {
        target: "attemptModalUnlock",
        password: r.value,
        lockCount: i.value,
        deviceRandomCode: e.value
      }), r.value = "";
    }
    function T() {
      a.value = "永久激活", o.value = !1, clearInterval(t);
    }
    function S() {
      i.value++, t && clearInterval(t), x();
    }
    return Bt(() => {
      clearInterval(t), clearInterval(u);
    }), ct(() => {
      if (ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: M } = rt();
        st(M, (A) => {
          if (A && A.type === "confirm_lock_password")
            try {
              const B = JSON.parse(A.content);
              B.target === "attemptUnlock" ? B.result === "success" ? S() : B.result === "forever_success" ? T() : alert("密钥错误") : B.target === "attemptModalUnlock" && (B.result === "success" ? (o.value = !1, S()) : B.result === "forever_success" ? T() : B.result === "fail" && alert("密钥错误"));
            } catch (B) {
              console.error("Failed to parse confirm lock password :", B);
            }
          else if (A && A.type === "device_activated")
            try {
              const B = JSON.parse(A.content);
              C(B.device_random_code, B.device_base_time);
            } catch (B) {
              console.error("Failed to parse device activation result:", B);
            }
          else if (A && A.type === "device_info")
            try {
              const B = JSON.parse(A.content);
              a.value = B.device_status, e.value = B.device_random_code, i.value = B.device_lock_count, s.value = new Date(B.device_base_time), B.device_status === "已激活" ? x() : B.device_status === "永久激活" && T();
            } catch (B) {
              console.error("Failed to parse device status:", B);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    }), (M, A) => (Pe(), Ne("div", hr, [
      P("div", gr, [
        P("div", mr, De(m.value), 1),
        P("button", {
          class: "activation-button",
          onPointerdown: h,
          onPointerup: y,
          onPointercancel: g,
          onPointerleave: g,
          disabled: a.value !== "未激活"
        }, [
          wt(De(v.value) + " ", 1),
          P("div", {
            class: "progress-bar",
            style: St({ width: c.value + "%" })
          }, null, 4)
        ], 40, yr)
      ]),
      P("div", br, [
        pt(P("input", {
          "onUpdate:modelValue": A[0] || (A[0] = (B) => n.value = B),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: A[1] || (A[1] = (B) => l.value = !0)
        }, null, 544), [
          [vt, n.value]
        ]),
        P("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      o.value ? (Pe(), Ne("div", wr, [
        P("div", xr, [
          A[8] || (A[8] = P("h3", null, "设备已锁定", -1)),
          P("h3", null, "第 " + De(i.value) + " 次锁定", 1),
          P("h3", null, "设备随机码: " + De(e.value), 1),
          pt(P("input", {
            "onUpdate:modelValue": A[2] || (A[2] = (B) => r.value = B),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: A[3] || (A[3] = (B) => d.value = !0)
          }, null, 544), [
            [vt, r.value]
          ]),
          P("button", {
            class: "unlock-button",
            onClick: _
          }, "解锁")
        ])
      ])) : ft("", !0),
      Xe(kt, {
        modelValue: n.value,
        "onUpdate:modelValue": A[4] || (A[4] = (B) => n.value = B),
        showKeyboard: l.value,
        "onUpdate:showKeyboard": A[5] || (A[5] = (B) => l.value = B)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Xe(kt, {
        modelValue: r.value,
        "onUpdate:modelValue": A[6] || (A[6] = (B) => r.value = B),
        showKeyboard: d.value,
        "onUpdate:showKeyboard": A[7] || (A[7] = (B) => d.value = B)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Or = /* @__PURE__ */ ot(Sr, [["__scopeId", "data-v-28624ff1"]]), _r = { class: "app-container" }, Er = {
  __name: "App",
  setup(ye) {
    return Rt(), (G, ee) => (Pe(), Ne("div", _r, [
      ee[0] || (ee[0] = P("h1", null, "涪特智能养护台车控制系统", -1)),
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
