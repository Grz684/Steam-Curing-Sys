import Pt, { ref as re, onMounted as ct, provide as mt, readonly as yt, inject as bt, watch as st, openBlock as Ie, createElementBlock as Ne, createElementVNode as A, toDisplayString as De, Fragment as at, renderList as ut, normalizeClass as it, createCommentVNode as ft, reactive as ht, createVNode as Xe, onUnmounted as St, computed as dt, createTextVNode as wt, normalizeStyle as _t, defineComponent as It, withDirectives as pt, vModelText as vt, unref as Nt } from "vue";
const Ot = Symbol(), jt = Symbol(), Et = Symbol();
function Bt(be, Z) {
  be && be.messageSignal ? be.messageSignal.connect((oe) => {
    try {
      const i = JSON.parse(oe);
      Z.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), Z.value = { type: "unknown", content: oe };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const be = re(null), Z = re(null), oe = re("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      be.value = f, Z.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), Bt(Z.value, oe), Z.value && typeof Z.value.vueReady == "function" ? Z.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ct(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), mt(Ot, yt(be)), mt(jt, yt(Z)), mt(Et, yt(oe));
}
function rt() {
  const be = bt(Ot), Z = bt(jt), oe = bt(Et);
  return (!be || !Z || !oe) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: be,
    bridge: Z,
    message: oe,
    sendToPyQt: (f, e) => {
      if (console.log(`Attempting to call ${f} with args:`, e), Z && Z.value)
        if (typeof Z.value.sendToPyQt == "function")
          try {
            Z.value.sendToPyQt(f, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(Z.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const ot = (be, Z) => {
  const oe = be.__vccOpts || be;
  for (const [i, f] of Z)
    oe[i] = f;
  return oe;
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
  setup(be, { emit: Z }) {
    const oe = be, i = Z, f = re([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = re("");
    st(() => oe.showKeyboard, (r) => {
      r && (e.value = oe.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (Ie(), Ne("div", Mt, [
      A("div", Ut, [
        A("div", $t, De(e.value), 1),
        (Ie(!0), Ne(at, null, ut(f.value, (t) => (Ie(), Ne("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ie(!0), Ne(at, null, ut(t, (u) => (Ie(), Ne("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, De(u), 11, Dt))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, Ct = /* @__PURE__ */ ot(Ft, [["__scopeId", "data-v-541feda2"]]), Vt = { class: "settings-container" }, Wt = { class: "setting-group" }, qt = { class: "setting-item" }, zt = { class: "setting-controls" }, Kt = ["value"], Qt = { class: "setting-item" }, Ht = { class: "setting-controls" }, Gt = ["value"], Yt = { class: "setting-group" }, Xt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Zt = ["value"], en = { class: "setting-item" }, tn = { class: "setting-controls" }, nn = ["value"], rn = {
  __name: "SensorSettings",
  setup(be) {
    const { sendToPyQt: Z } = rt(), oe = ht({
      isPyQtWebEngine: !1
    }), i = re(30), f = re(10), e = re(80), n = re(20), r = re(!1), o = re(null), t = re("");
    ct(() => {
      if (oe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, oe.isPyQtWebEngine) {
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
            const g = JSON.parse(p.content).args;
            i.value = g.temp_upper, f.value = g.temp_lower, e.value = g.humidity_upper, n.value = g.humidity_lower, s();
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
        console.log("设置已更新:", m), oe.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), Z("updateLimitSettings", m)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (m) => {
      o.value = m, r.value = !0, t.value = m.startsWith("temp") ? m === "tempUpper" ? i.value : f.value : m === "humidityUpper" ? e.value : n.value;
    }, d = (m) => {
      const p = parseFloat(m);
      isNaN(p) || (o.value === "tempUpper" ? (i.value = p, c("upper")) : o.value === "tempLower" ? (f.value = p, c("lower")) : o.value === "humidityUpper" ? (e.value = p, a("upper")) : o.value === "humidityLower" && (n.value = p, a("lower"))), o.value = null;
    };
    return (m, p) => (Ie(), Ne("div", Vt, [
      A("div", Wt, [
        p[15] || (p[15] = A("h2", null, "温度设置 (°C)", -1)),
        A("div", qt, [
          p[13] || (p[13] = A("span", { class: "setting-label" }, "上限：", -1)),
          A("div", zt, [
            A("button", {
              onClick: p[0] || (p[0] = (v) => u("tempUpper", -1))
            }, "-"),
            A("input", {
              type: "text",
              value: i.value,
              onFocus: p[1] || (p[1] = (v) => l("tempUpper")),
              readonly: ""
            }, null, 40, Kt),
            A("button", {
              onClick: p[2] || (p[2] = (v) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        A("div", Qt, [
          p[14] || (p[14] = A("span", { class: "setting-label" }, "下限：", -1)),
          A("div", Ht, [
            A("button", {
              onClick: p[3] || (p[3] = (v) => u("tempLower", -1))
            }, "-"),
            A("input", {
              type: "text",
              value: f.value,
              onFocus: p[4] || (p[4] = (v) => l("tempLower")),
              readonly: ""
            }, null, 40, Gt),
            A("button", {
              onClick: p[5] || (p[5] = (v) => u("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      A("div", Yt, [
        p[18] || (p[18] = A("h2", null, "湿度设置 (%)", -1)),
        A("div", Xt, [
          p[16] || (p[16] = A("span", { class: "setting-label" }, "上限：", -1)),
          A("div", Jt, [
            A("button", {
              onClick: p[6] || (p[6] = (v) => u("humidityUpper", -1))
            }, "-"),
            A("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => l("humidityUpper")),
              readonly: ""
            }, null, 40, Zt),
            A("button", {
              onClick: p[8] || (p[8] = (v) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        A("div", en, [
          p[17] || (p[17] = A("span", { class: "setting-label" }, "下限：", -1)),
          A("div", tn, [
            A("button", {
              onClick: p[9] || (p[9] = (v) => u("humidityLower", -1))
            }, "-"),
            A("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => l("humidityLower")),
              readonly: ""
            }, null, 40, nn),
            A("button", {
              onClick: p[11] || (p[11] = (v) => u("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Xe(Ct, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": d,
        "onUpdate:showKeyboard": p[12] || (p[12] = (v) => r.value = v)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, on = /* @__PURE__ */ ot(rn, [["__scopeId", "data-v-19eef055"]]), an = { class: "sensor-data-group" }, un = { class: "sensor-section" }, cn = { class: "sensor-container" }, sn = { class: "sensor-grid" }, ln = { class: "sensor-title" }, fn = { class: "sensor-value" }, dn = { class: "sensor-section" }, pn = { class: "sensor-container" }, vn = { class: "sensor-grid" }, hn = { class: "sensor-title" }, gn = { class: "sensor-value" }, mn = {
  __name: "SensorDisplay",
  setup(be) {
    const Z = re({ temperature: {}, humidity: {} }), { sendToPyQt: oe } = rt();
    ct(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: f } = rt();
        st(f, (e) => {
          if (e && e.type === "update_sensor_data")
            try {
              Z.value = JSON.parse(e.content);
            } catch (n) {
              console.error("Failed to parse sensor data:", n);
            }
          else e && e.type === "get_sensor_data" && oe("update_remote_sensor_data", Z.value);
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
        Z.value = e;
      } catch (f) {
        console.error("Error fetching sensor data:", f);
      }
    };
    return (f, e) => (Ie(), Ne("div", an, [
      A("div", un, [
        e[0] || (e[0] = A("h2", null, "温度传感器", -1)),
        A("div", cn, [
          A("div", sn, [
            (Ie(!0), Ne(at, null, ut(Z.value.temperature, (n, r) => (Ie(), Ne("div", {
              key: r,
              class: "sensor-card"
            }, [
              A("div", ln, De(r), 1),
              A("div", fn, De(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      A("div", dn, [
        e[1] || (e[1] = A("h2", null, "湿度传感器", -1)),
        A("div", pn, [
          A("div", vn, [
            (Ie(!0), Ne(at, null, ut(Z.value.humidity, (n, r) => (Ie(), Ne("div", {
              key: r,
              class: "sensor-card"
            }, [
              A("div", hn, De(r), 1),
              A("div", gn, De(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ ot(mn, [["__scopeId", "data-v-4d55ddc2"]]), bn = { class: "integrated-control-system" }, wn = { class: "mode-controls" }, xn = ["disabled"], kn = ["disabled"], Sn = { class: "systems-container" }, _n = { class: "steam-engine-control" }, On = { class: "control-panel" }, jn = { class: "engine-status" }, En = { class: "engine left" }, Cn = ["disabled"], Tn = { class: "engine right" }, Ln = ["disabled"], An = { class: "sprinkler-system" }, Pn = { class: "controls" }, In = { class: "input-group" }, Nn = ["value"], Bn = { class: "input-group" }, Rn = ["value"], Mn = { class: "input-group" }, Un = ["value"], $n = { class: "visualization" }, Dn = ["onClick"], Fn = { class: "status" }, Vn = {
  __name: "IntegratedControlSystem",
  setup(be) {
    const Z = re(!1), oe = re(!1), i = re(5), f = re(2), e = re(10), n = re(i.value), r = re(f.value), o = re(e.value), t = re(i.value), u = re(f.value), c = re(e.value), a = re(0), s = re(""), l = re(Array(12).fill(0)), d = re(0), m = re(!0), p = re(!1), v = re(!1), g = re(null), b = re(""), y = re(!1), j = re(15), E = re(""), w = re(""), S = re(0), { sendToPyQt: h } = rt(), O = re(0), _ = ht({
      isPyQtWebEngine: !1
    }), C = re([]);
    let k, D, F;
    ct(() => {
      if (_.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, _.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: Y } = rt();
        st(Y, (I) => {
          if (I && I.type === "update_left_steam_status")
            Z.value = I.content;
          else if (I && I.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), $();
          else if (I && I.type === "update_right_steam_status")
            oe.value = I.content;
          else if (I && I.type === "update_sprinkler_settings")
            try {
              const K = JSON.parse(I.content);
              t.value = K.sprinkler_single_run_time, u.value = K.sprinkler_run_interval_time, c.value = K.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, console.log("Sprinkler Settings updated:", K);
            } catch (K) {
              console.error("Failed to parse sprinkler settings data:", K);
            }
          else if (I && I.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", I.content);
            const me = JSON.parse(I.content).args;
            t.value = me.sprinkler_single_run_time, u.value = me.sprinkler_run_interval_time, c.value = me.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, je();
          } else if (I && I.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", I.content);
            const K = JSON.parse(I.content);
            K.method === "startSystem" ? Pe() : K.method === "stopSystem" ? Se() : K.method === "setMode" ? T(K.args.mode) : K.method === "click_toggleEngine" ? G() : K.method === "toggleManualSprinkler" && ie(K.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), St(() => {
      clearInterval(F), clearInterval(D), M();
    });
    const q = (Y) => {
      Y !== void 0 && clearTimeout(Y);
    }, M = () => {
      C.value.forEach((Y) => {
        q(Y);
      }), C.value = [];
    }, $ = () => {
      const Y = {
        leftEngineOn: Z.value,
        rightEngineOn: oe.value,
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
        isSwitching: y.value,
        switchingTime: j.value,
        switchingMessage: E.value,
        switchPhase: w.value,
        phaseStartTime: O.value,
        chose_n: S.value
      };
      h("IntegratedControlSystem_init_response", Y);
    }, ce = dt(() => y.value ? `${E.value}，还需${j.value}秒` : m.value ? p.value ? s.value === "run" ? `喷头 ${a.value} 正在运行，剩余 ${d.value + 1} 秒` : s.value === "interval" ? `运行间隔中，剩余 ${d.value + 1} 秒` : s.value === "loop" ? `循环间隔中，剩余 ${d.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    async function ne(Y, I) {
      return w.value = I, y.value = !0, j.value = 15, O.value = Date.now(), E.value = Y ? "正在切换到喷淋管" : "正在切换到喷雾机", h("controlSprinkler", { target: "switchToSprinkler", state: Y }), F = setInterval(() => {
        j.value--, j.value <= 0 && (clearInterval(F), y.value = !1);
      }, 1e3), new Promise((K) => {
        k = setTimeout(() => {
          y.value = !1, K();
        }, j.value * 1e3), C.value.push(k);
      });
    }
    async function T(Y) {
      const I = m.value;
      if (m.value = Y === "auto", I !== m.value)
        if (_.isPyQtWebEngine && (h("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: Y } }), h("controlSprinkler", { target: "setMode", mode: m.value ? "auto" : "manual" })), m.value) {
          clearInterval(F), M(), y.value = !1, Z.value && await L();
          const K = l.value.findIndex((me) => me === 100);
          K !== -1 && (l.value[K] = 0, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: K + 1, state: 0 })), h("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await Se();
    }
    async function L() {
      _.isPyQtWebEngine && (h("setEngineState", { engine: "left", state: !Z.value }), h("setEngineState", { engine: "right", state: !oe.value }), Z.value = !Z.value, oe.value = !oe.value);
    }
    async function G() {
      const Y = l.value.findIndex((I) => I === 100);
      _.isPyQtWebEngine && Y === -1 && (h("IntegratedControlSystem_set_response", { method: "click_toggleEngine", args: {} }), Z.value ? h("controlSprinkler", { target: "tankWork", state: 0 }) : (await ne(0, "click_toggleEngine"), h("controlSprinkler", { target: "tankWork", state: 1 })), h("setEngineState", { engine: "left", state: !Z.value }), h("setEngineState", { engine: "right", state: !oe.value }), Z.value = !Z.value, oe.value = !oe.value);
    }
    function J(Y) {
      g.value = Y, v.value = !0, b.value = Y === "singleRunTime" ? t.value.toString() : Y === "runIntervalTime" ? u.value.toString() : c.value.toString();
    }
    function V(Y) {
      const I = parseInt(Y);
      isNaN(I) || (g.value === "singleRunTime" ? (t.value = I, ye()) : g.value === "runIntervalTime" ? (u.value = I, pe()) : g.value === "loopInterval" && (c.value = I, Le())), g.value = null;
    }
    function ye() {
      t.value = Math.max(1, t.value), n.value = t.value, je();
    }
    function pe() {
      u.value = Math.max(0, u.value), r.value = u.value, je();
    }
    function Le() {
      c.value = Math.max(0, c.value), o.value = c.value, je();
    }
    function je() {
      if (_.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const Y = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        h("controlSprinkler", { target: "settings", settings: JSON.stringify(Y) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function Pe() {
      h("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(p.value || !m.value) && (p.value = !0, l.value = Array(12).fill(0), await Fe());
    }
    async function Se() {
      h("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), _.isPyQtWebEngine && (a.value > 0 && h("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 0 }), h("controlSprinkler", { target: "setState", state: !1 })), Z.value && await L(), Ee(), h("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function Ee() {
      p.value = !1, y.value = !1, clearInterval(F), clearInterval(D), M(), a.value = 0, s.value = "", l.value = Array(12).fill(0), d.value = 0;
    }
    async function Fe() {
      await ne(1, "runCycle"), a.value = 1, h("controlSprinkler", { target: "tankWork", state: 1 }), R();
    }
    async function He() {
      a.value = 1, R();
    }
    function B() {
      !p.value || !m.value || (d.value--, d.value > 0 && (k = setTimeout(B, 1e3), C.value.push(k)));
    }
    function R() {
      if (!p.value || !m.value) return;
      s.value = "run", i.value = n.value, d.value = i.value, O.value = Date.now(), B();
      let Y = Date.now();
      h("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 1 }), D = setInterval(() => {
        let I = Date.now() - Y, K = Math.min(I / (i.value * 1e3), 1);
        l.value[a.value - 1] = K * 100;
      }, 100), k = setTimeout(async () => {
        clearInterval(D), a.value < 12 ? (l.value[a.value - 1] = 0, h("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 0 }), X()) : (l.value[a.value - 1] = 0, h("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 0 }), W());
      }, i.value * 1e3), C.value.push(k);
    }
    function X() {
      !p.value || !m.value || (f.value = r.value, d.value = f.value, O.value = Date.now(), d.value > 0 && (s.value = "interval"), B(), k = setTimeout(() => {
        a.value++, R();
      }, f.value * 1e3), C.value.push(k));
    }
    async function W() {
      !p.value || !m.value || (e.value = o.value, d.value = e.value, d.value > 0 ? (h("controlSprinkler", { target: "tankWork", state: 0 }), await ne(0, "runLoopInterval"), h("controlSprinkler", { target: "setState", state: !0 }), O.value = Date.now(), s.value = "loop", B(), a.value = 0, k = setTimeout(async () => {
        l.value = Array(12).fill(0), h("controlSprinkler", { target: "setState", state: !1 }), Z.value && await L(), h("controlSprinkler", { target: "tankWork", state: 0 }), await Fe();
      }, e.value * 1e3), C.value.push(k)) : (a.value = 0, l.value = Array(12).fill(0), await He()));
    }
    function ee(Y) {
      return l.value[Y - 1];
    }
    async function ie(Y) {
      if (m.value) return;
      h("IntegratedControlSystem_set_response", { method: "toggleManualSprinkler", args: { n: Y } });
      const I = l.value.findIndex((K) => K === 100);
      l.value[Y - 1] > 0 ? (l.value[Y - 1] = 0, _.isPyQtWebEngine && (h("controlSprinkler", { target: "manual_control_sprayer", index: Y, state: 0 }), h("controlSprinkler", { target: "tankWork", state: 0 }))) : I !== -1 ? (l.value[I] = 0, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: I + 1, state: 0 }), l.value[Y - 1] = 100, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: Y, state: 1 })) : (S.value = Y, await ne(1, "toggleManualSprinkler"), h("controlSprinkler", { target: "tankWork", state: 1 }), l.value[Y - 1] = 100, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: Y, state: 1 }));
    }
    return (Y, I) => (Ie(), Ne("div", bn, [
      I[15] || (I[15] = A("h2", null, "集成控制系统", -1)),
      A("div", wn, [
        A("button", {
          onClick: I[0] || (I[0] = (K) => T("auto")),
          class: it([{ active: m.value }, "mode-btn"])
        }, "自动模式", 2),
        A("button", {
          onClick: I[1] || (I[1] = (K) => T("manual")),
          class: it([{ active: !m.value }, "mode-btn"])
        }, "手动模式", 2),
        A("button", {
          onClick: Pe,
          disabled: p.value || !m.value,
          class: "control-btn"
        }, "开始", 8, xn),
        A("button", {
          onClick: Se,
          disabled: !p.value || !m.value,
          class: "control-btn"
        }, "停止", 8, kn)
      ]),
      A("div", Sn, [
        A("div", _n, [
          I[10] || (I[10] = A("h3", null, "雾化机控制系统", -1)),
          A("div", On, [
            A("div", jn, [
              A("div", En, [
                I[7] || (I[7] = A("h4", null, "左雾化机", -1)),
                A("div", {
                  class: it(["status", { on: Z.value }])
                }, [
                  I[6] || (I[6] = A("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + De(Z.value ? "开" : "关"), 1)
                ], 2),
                A("button", {
                  onClick: G,
                  disabled: m.value || y.value,
                  class: "control-btn"
                }, De(Z.value ? "关闭" : "开启"), 9, Cn)
              ]),
              A("div", Tn, [
                I[9] || (I[9] = A("h4", null, "右雾化机", -1)),
                A("div", {
                  class: it(["status", { on: oe.value }])
                }, [
                  I[8] || (I[8] = A("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + De(oe.value ? "开" : "关"), 1)
                ], 2),
                A("button", {
                  onClick: G,
                  disabled: m.value || y.value,
                  class: "control-btn"
                }, De(oe.value ? "关闭" : "开启"), 9, Ln)
              ])
            ])
          ])
        ]),
        A("div", An, [
          I[14] || (I[14] = A("h3", null, "喷淋系统", -1)),
          A("div", Pn, [
            A("div", In, [
              I[11] || (I[11] = A("label", null, "单次运行时间 (秒):", -1)),
              A("input", {
                type: "text",
                value: t.value,
                onFocus: I[2] || (I[2] = (K) => J("singleRunTime")),
                readonly: ""
              }, null, 40, Nn)
            ]),
            A("div", Bn, [
              I[12] || (I[12] = A("label", null, "运行时间间隔 (秒):", -1)),
              A("input", {
                type: "text",
                value: u.value,
                onFocus: I[3] || (I[3] = (K) => J("runIntervalTime")),
                readonly: ""
              }, null, 40, Rn)
            ]),
            A("div", Mn, [
              I[13] || (I[13] = A("label", null, "循环时间间隔 (秒):", -1)),
              A("input", {
                type: "text",
                value: c.value,
                onFocus: I[4] || (I[4] = (K) => J("loopInterval")),
                readonly: ""
              }, null, 40, Un)
            ])
          ]),
          A("div", $n, [
            (Ie(), Ne(at, null, ut(12, (K) => A("div", {
              key: K,
              class: it(["sprinkler", { active: m.value ? a.value === K : l.value[K - 1] > 0 }]),
              onClick: (me) => !y.value && !m.value && !Z.value && ie(K)
            }, [
              A("div", {
                class: "water",
                style: _t({ height: ee(K) + "%" })
              }, null, 4),
              A("span", null, De(K), 1)
            ], 10, Dn)), 64))
          ]),
          A("div", Fn, De(ce.value), 1)
        ])
      ]),
      Xe(Ct, {
        modelValue: b.value,
        showKeyboard: v.value,
        "onUpdate:modelValue": V,
        "onUpdate:showKeyboard": I[5] || (I[5] = (K) => v.value = K)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Wn = /* @__PURE__ */ ot(Vn, [["__scopeId", "data-v-2cf866a3"]]), qn = { class: "data-actions" }, zn = {
  key: 0,
  class: "modal-overlay"
}, Kn = {
  key: 1,
  class: "modal-overlay"
}, Qn = { class: "modal-content" }, Hn = {
  __name: "DataExport",
  setup(be) {
    const { sendToPyQt: Z } = rt(), oe = ht({
      isPyQtWebEngine: !1
    }), i = re(!1), f = re(!1), e = re("");
    ct(() => {
      oe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, oe.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      oe.isPyQtWebEngine && (console.log("导出数据"), Z("exportData", !0));
    }, r = () => {
      i.value = !0;
    }, o = () => {
      i.value = !1;
    }, t = () => {
      console.log("清空数据"), i.value = !1, u("所有数据已清空！"), oe.isPyQtWebEngine && Z("exportData", !1);
    }, u = (a) => {
      e.value = a, f.value = !0;
    }, c = () => {
      f.value = !1;
    };
    return (a, s) => (Ie(), Ne("div", qn, [
      A("div", { class: "action-buttons" }, [
        A("div", { class: "button-group" }, [
          s[0] || (s[0] = A("i", { class: "fas fa-file-excel" }, null, -1)),
          A("button", {
            onClick: n,
            class: "export-btn"
          }, "导出数据")
        ]),
        A("div", { class: "button-group" }, [
          s[1] || (s[1] = A("i", { class: "fas fa-trash-alt" }, null, -1)),
          A("button", {
            onClick: r,
            class: "clear-btn"
          }, "清空数据")
        ])
      ]),
      i.value ? (Ie(), Ne("div", zn, [
        A("div", { class: "modal-content" }, [
          s[2] || (s[2] = A("p", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          A("div", { class: "modal-buttons" }, [
            A("button", {
              onClick: t,
              class: "confirm-btn"
            }, "确定"),
            A("button", {
              onClick: o,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ft("", !0),
      f.value ? (Ie(), Ne("div", Kn, [
        A("div", Qn, [
          A("p", null, De(e.value), 1),
          A("div", { class: "modal-buttons" }, [
            A("button", {
              onClick: c,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ft("", !0)
    ]));
  }
}, Gn = /* @__PURE__ */ ot(Hn, [["__scopeId", "data-v-86824edf"]]);
var Yn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Xn(be) {
  return be && be.__esModule && Object.prototype.hasOwnProperty.call(be, "default") ? be.default : be;
}
var Tt = { exports: {} };
(function(be, Z) {
  (function(oe, i) {
    be.exports = i(Pt);
  })(typeof self < "u" ? self : Yn, function(oe) {
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
        var p = s + c.length, v = l.length, g = u;
        return d !== void 0 && (d = n(d), g = t), o.call(m, g, function(b, y) {
          var j;
          switch (y.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return a.slice(0, s);
            case "'":
              return a.slice(p);
            case "<":
              j = d[y.slice(1, -1)];
              break;
            default:
              var E = +y;
              if (E === 0) return b;
              if (E > v) {
                var w = r(E / 10);
                return w === 0 ? b : w <= v ? l[w - 1] === void 0 ? y.charAt(1) : l[w - 1] + y.charAt(1) : b;
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
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), c = e("8aa5"), a = e("50c4"), s = e("14c3"), l = e("9263"), d = e("d039"), m = [].push, p = Math.min, v = 4294967295, g = !d(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(b, y, j) {
        var E;
        return E = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(w, S) {
          var h = String(t(this)), O = S === void 0 ? v : S >>> 0;
          if (O === 0) return [];
          if (w === void 0) return [h];
          if (!r(w)) return y.call(h, w, O);
          for (var _, C, k, D = [], F = (w.ignoreCase ? "i" : "") + (w.multiline ? "m" : "") + (w.unicode ? "u" : "") + (w.sticky ? "y" : ""), q = 0, M = new RegExp(w.source, F + "g"); (_ = l.call(M, h)) && (C = M.lastIndex, !(C > q && (D.push(h.slice(q, _.index)), _.length > 1 && _.index < h.length && m.apply(D, _.slice(1)), k = _[0].length, q = C, D.length >= O))); )
            M.lastIndex === _.index && M.lastIndex++;
          return q === h.length ? !k && M.test("") || D.push("") : D.push(h.slice(q)), D.length > O ? D.slice(0, O) : D;
        } : "0".split(void 0, 0).length ? function(w, S) {
          return w === void 0 && S === 0 ? [] : y.call(this, w, S);
        } : y, [function(w, S) {
          var h = t(this), O = w == null ? void 0 : w[b];
          return O !== void 0 ? O.call(w, h, S) : E.call(String(h), w, S);
        }, function(w, S) {
          var h = j(E, w, this, S, E !== y);
          if (h.done) return h.value;
          var O = o(w), _ = String(this), C = u(O, RegExp), k = O.unicode, D = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (g ? "y" : "g"), F = new C(g ? O : "^(?:" + O.source + ")", D), q = S === void 0 ? v : S >>> 0;
          if (q === 0) return [];
          if (_.length === 0) return s(F, _) === null ? [_] : [];
          for (var M = 0, $ = 0, ce = []; $ < _.length; ) {
            F.lastIndex = g ? $ : 0;
            var ne, T = s(F, g ? _ : _.slice($));
            if (T === null || (ne = p(a(F.lastIndex + (g ? 0 : $)), _.length)) === M) $ = c(_, $, k);
            else {
              if (ce.push(_.slice(M, $)), ce.length === q) return ce;
              for (var L = 1; L <= T.length - 1; L++) if (ce.push(T[L]), ce.length === q) return ce;
              $ = M = ne;
            }
          }
          return ce.push(_.slice(M)), ce;
        }];
      }, !g);
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
          function r(B, R) {
            return R = { exports: {} }, B(R, R.exports), R.exports;
          }
          var o = r(function(B, R) {
            (function(X, W) {
              B.exports = W();
            })(0, function() {
              function X(K) {
                var me = K && typeof K == "object";
                return me && Object.prototype.toString.call(K) !== "[object RegExp]" && Object.prototype.toString.call(K) !== "[object Date]";
              }
              function W(K) {
                return Array.isArray(K) ? [] : {};
              }
              function ee(K, me) {
                var ke = me && me.clone === !0;
                return ke && X(K) ? I(W(K), K, me) : K;
              }
              function ie(K, me, ke) {
                var Be = K.slice();
                return me.forEach(function(Oe, We) {
                  typeof Be[We] > "u" ? Be[We] = ee(Oe, ke) : X(Oe) ? Be[We] = I(K[We], Oe, ke) : K.indexOf(Oe) === -1 && Be.push(ee(Oe, ke));
                }), Be;
              }
              function Y(K, me, ke) {
                var Be = {};
                return X(K) && Object.keys(K).forEach(function(Oe) {
                  Be[Oe] = ee(K[Oe], ke);
                }), Object.keys(me).forEach(function(Oe) {
                  X(me[Oe]) && K[Oe] ? Be[Oe] = I(K[Oe], me[Oe], ke) : Be[Oe] = ee(me[Oe], ke);
                }), Be;
              }
              function I(K, me, ke) {
                var Be = Array.isArray(me), Oe = ke || { arrayMerge: ie }, We = Oe.arrayMerge || ie;
                return Be ? Array.isArray(K) ? We(K, me, ke) : ee(me, ke) : Y(K, me, ke);
              }
              return I.all = function(K, me) {
                if (!Array.isArray(K) || K.length < 2) throw new Error("first argument should be an array with at least two elements");
                return K.reduce(function(ke, Be) {
                  return I(ke, Be, me);
                });
              }, I;
            });
          });
          function t(B) {
            return B = B || /* @__PURE__ */ Object.create(null), { on: function(R, X) {
              (B[R] || (B[R] = [])).push(X);
            }, off: function(R, X) {
              B[R] && B[R].splice(B[R].indexOf(X) >>> 0, 1);
            }, emit: function(R, X) {
              (B[R] || []).map(function(W) {
                W(X);
              }), (B["*"] || []).map(function(W) {
                W(R, X);
              });
            } };
          }
          var u = r(function(B, R) {
            var X = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            R.default = X, B.exports = R.default;
          }), c = function(B) {
            return Object.keys(B).map(function(R) {
              var X = B[R].toString().replace(/"/g, "&quot;");
              return R + '="' + X + '"';
            }).join(" ");
          }, a = u.svg, s = u.xlink, l = {};
          l[a.name] = a.uri, l[s.name] = s.uri;
          var d, m = function(B, R) {
            B === void 0 && (B = "");
            var X = o(l, R || {}), W = c(X);
            return "<svg " + W + ">" + B + "</svg>";
          }, p = u.svg, v = u.xlink, g = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[p.name] = p.uri, d[v.name] = v.uri, d) }, b = function(B) {
            this.config = o(g, B || {}), this.symbols = [];
          };
          b.prototype.add = function(B) {
            var R = this, X = R.symbols, W = this.find(B.id);
            return W ? (X[X.indexOf(W)] = B, !1) : (X.push(B), !0);
          }, b.prototype.remove = function(B) {
            var R = this, X = R.symbols, W = this.find(B);
            return !!W && (X.splice(X.indexOf(W), 1), W.destroy(), !0);
          }, b.prototype.find = function(B) {
            return this.symbols.filter(function(R) {
              return R.id === B;
            })[0] || null;
          }, b.prototype.has = function(B) {
            return this.find(B) !== null;
          }, b.prototype.stringify = function() {
            var B = this.config, R = B.attrs, X = this.symbols.map(function(W) {
              return W.stringify();
            }).join("");
            return m(X, R);
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            this.symbols.forEach(function(B) {
              return B.destroy();
            });
          };
          var y = function(B) {
            var R = B.id, X = B.viewBox, W = B.content;
            this.id = R, this.viewBox = X, this.content = W;
          };
          y.prototype.stringify = function() {
            return this.content;
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            var B = this;
            ["id", "viewBox", "content"].forEach(function(R) {
              return delete B[R];
            });
          };
          var j = function(B) {
            var R = !!document.importNode, X = new DOMParser().parseFromString(B, "image/svg+xml").documentElement;
            return R ? document.importNode(X, !0) : X;
          }, E = function(B) {
            function R() {
              B.apply(this, arguments);
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, R.createFromExistingNode = function(W) {
              return new R({ id: W.getAttribute("id"), viewBox: W.getAttribute("viewBox"), content: W.outerHTML });
            }, R.prototype.destroy = function() {
              this.isMounted && this.unmount(), B.prototype.destroy.call(this);
            }, R.prototype.mount = function(W) {
              if (this.isMounted) return this.node;
              var ee = typeof W == "string" ? document.querySelector(W) : W, ie = this.render();
              return this.node = ie, ee.appendChild(ie), ie;
            }, R.prototype.render = function() {
              var W = this.stringify();
              return j(m(W)).childNodes[0];
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(R.prototype, X), R;
          }(y), w = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, S = function(B) {
            return Array.prototype.slice.call(B, 0);
          }, h = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, O = function(B, R) {
            var X = document.createEvent("CustomEvent");
            X.initCustomEvent(B, !1, !1, R), window.dispatchEvent(X);
          }, _ = function(B) {
            var R = [];
            return S(B.querySelectorAll("style")).forEach(function(X) {
              X.textContent += "", R.push(X);
            }), R;
          }, C = function(B) {
            return (B || window.location.href).split("#")[0];
          }, k = function(B) {
            angular.module("ng").run(["$rootScope", function(R) {
              R.$on("$locationChangeSuccess", function(X, W, ee) {
                O(B, { oldUrl: ee, newUrl: W });
              });
            }]);
          }, D = "linearGradient, radialGradient, pattern, mask, clipPath", F = function(B, R) {
            return R === void 0 && (R = D), S(B.querySelectorAll("symbol")).forEach(function(X) {
              S(X.querySelectorAll(R)).forEach(function(W) {
                X.parentNode.insertBefore(W, X);
              });
            }), B;
          };
          function q(B, R) {
            var X = S(B).reduce(function(W, ee) {
              if (!ee.attributes) return W;
              var ie = S(ee.attributes), Y = R ? ie.filter(R) : ie;
              return W.concat(Y);
            }, []);
            return X;
          }
          var M = u.xlink.uri, $ = "xlink:href", ce = /[{}|\\\^\[\]`"<>]/g;
          function ne(B) {
            return B.replace(ce, function(R) {
              return "%" + R[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function T(B) {
            return B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function L(B, R, X) {
            return S(B).forEach(function(W) {
              var ee = W.getAttribute($);
              if (ee && ee.indexOf(R) === 0) {
                var ie = ee.replace(R, X);
                W.setAttributeNS(M, $, ie);
              }
            }), B;
          }
          var G, J = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], V = J.map(function(B) {
            return "[" + B + "]";
          }).join(","), ye = function(B, R, X, W) {
            var ee = ne(X), ie = ne(W), Y = B.querySelectorAll(V), I = q(Y, function(K) {
              var me = K.localName, ke = K.value;
              return J.indexOf(me) !== -1 && ke.indexOf("url(" + ee) !== -1;
            });
            I.forEach(function(K) {
              return K.value = K.value.replace(new RegExp(T(ee), "g"), ie);
            }), L(R, ee, ie);
          }, pe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Le = function(B) {
            function R(W) {
              var ee = this;
              W === void 0 && (W = {}), B.call(this, o(w, W));
              var ie = t();
              this._emitter = ie, this.node = null;
              var Y = this, I = Y.config;
              if (I.autoConfigure && this._autoConfigure(W), I.syncUrlsWithBaseTag) {
                var K = document.getElementsByTagName("base")[0].getAttribute("href");
                ie.on(pe.MOUNT, function() {
                  return ee.updateUrls("#", K);
                });
              }
              var me = this._handleLocationChange.bind(this);
              this._handleLocationChange = me, I.listenLocationChangeEvent && window.addEventListener(I.locationChangeEvent, me), I.locationChangeAngularEmitter && k(I.locationChangeEvent), ie.on(pe.MOUNT, function(ke) {
                I.moveGradientsOutsideSymbol && F(ke);
              }), ie.on(pe.SYMBOL_MOUNT, function(ke) {
                I.moveGradientsOutsideSymbol && F(ke.parentNode), (h.isIE() || h.isEdge()) && _(ke);
              });
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, R.prototype._autoConfigure = function(W) {
              var ee = this, ie = ee.config;
              typeof W.syncUrlsWithBaseTag > "u" && (ie.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof W.locationChangeAngularEmitter > "u" && (ie.locationChangeAngularEmitter = typeof window.angular < "u"), typeof W.moveGradientsOutsideSymbol > "u" && (ie.moveGradientsOutsideSymbol = h.isFirefox());
            }, R.prototype._handleLocationChange = function(W) {
              var ee = W.detail, ie = ee.oldUrl, Y = ee.newUrl;
              this.updateUrls(ie, Y);
            }, R.prototype.add = function(W) {
              var ee = this, ie = B.prototype.add.call(this, W);
              return this.isMounted && ie && (W.mount(ee.node), this._emitter.emit(pe.SYMBOL_MOUNT, W.node)), ie;
            }, R.prototype.attach = function(W) {
              var ee = this, ie = this;
              if (ie.isMounted) return ie.node;
              var Y = typeof W == "string" ? document.querySelector(W) : W;
              return ie.node = Y, this.symbols.forEach(function(I) {
                I.mount(ie.node), ee._emitter.emit(pe.SYMBOL_MOUNT, I.node);
              }), S(Y.querySelectorAll("symbol")).forEach(function(I) {
                var K = E.createFromExistingNode(I);
                K.node = I, ie.add(K);
              }), this._emitter.emit(pe.MOUNT, Y), Y;
            }, R.prototype.destroy = function() {
              var W = this, ee = W.config, ie = W.symbols, Y = W._emitter;
              ie.forEach(function(I) {
                return I.destroy();
              }), Y.off("*"), window.removeEventListener(ee.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, R.prototype.mount = function(W, ee) {
              W === void 0 && (W = this.config.mountTo), ee === void 0 && (ee = !1);
              var ie = this;
              if (ie.isMounted) return ie.node;
              var Y = typeof W == "string" ? document.querySelector(W) : W, I = ie.render();
              return this.node = I, ee && Y.childNodes[0] ? Y.insertBefore(I, Y.childNodes[0]) : Y.appendChild(I), this._emitter.emit(pe.MOUNT, I), I;
            }, R.prototype.render = function() {
              return j(this.stringify());
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, R.prototype.updateUrls = function(W, ee) {
              if (!this.isMounted) return !1;
              var ie = document.querySelectorAll(this.config.usagesToUpdate);
              return ye(this.node, ie, C(W) + "#", C(ee) + "#"), !0;
            }, Object.defineProperties(R.prototype, X), R;
          }(b), je = r(function(B) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(R, X) {
              B.exports = X();
            })(0, function() {
              var R, X = [], W = document, ee = W.documentElement.doScroll, ie = "DOMContentLoaded", Y = (ee ? /^loaded|^c/ : /^loaded|^i|^c/).test(W.readyState);
              return Y || W.addEventListener(ie, R = function() {
                for (W.removeEventListener(ie, R), Y = 1; R = X.shift(); ) R();
              }), function(I) {
                Y ? setTimeout(I, 0) : X.push(I);
              };
            });
          }), Pe = "__SVG_SPRITE_NODE__", Se = "__SVG_SPRITE__", Ee = !!window[Se];
          Ee ? G = window[Se] : (G = new Le({ attrs: { id: Pe, "aria-hidden": "true" } }), window[Se] = G);
          var Fe = function() {
            var B = document.getElementById(Pe);
            B ? G.attach(B) : G.mount(document.body, !0);
          };
          document.body ? Fe() : je(Fe);
          var He = G;
          return He;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), c = e("2a62"), a = function(s, l) {
        this.stopped = s, this.result = l;
      };
      i.exports = function(s, l, d) {
        var m, p, v, g, b, y, j, E = d && d.that, w = !(!d || !d.AS_ENTRIES), S = !(!d || !d.IS_ITERATOR), h = !(!d || !d.INTERRUPTED), O = t(l, E, 1 + w + h), _ = function(k) {
          return m && c(m), new a(!0, k);
        }, C = function(k) {
          return w ? (n(k), h ? O(k[0], k[1], _) : O(k[0], k[1])) : h ? O(k, _) : O(k);
        };
        if (S) m = s;
        else {
          if (p = u(s), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, g = o(s.length); g > v; v++) if (b = C(s[v]), b && b instanceof a) return b;
            return new a(!1);
          }
          m = p.call(s);
        }
        for (y = m.next; !(j = y.call(m)).done; ) {
          try {
            b = C(j.value);
          } catch (k) {
            throw c(m), k;
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
        var d, m, p, v, g, b, y = s.target, j = s.global, E = s.stat;
        if (m = j ? n : E ? n[y] || u(y, {}) : (n[y] || {}).prototype, m) for (p in l) {
          if (g = l[p], s.noTargetGet ? (b = r(m, p), v = b && b.value) : v = m[p], d = a(j ? p : y + (E ? "." : "#") + p, s.forced), !d && v !== void 0) {
            if (typeof g == typeof v) continue;
            c(g, v);
          }
          (s.sham || v && v.sham) && o(g, "sham", !0), t(m, p, g, s);
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
      var n, r, o, t = e("da84"), u = e("d039"), c = e("0366"), a = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), m = t.location, p = t.setImmediate, v = t.clearImmediate, g = t.process, b = t.MessageChannel, y = t.Dispatch, j = 0, E = {}, w = "onreadystatechange", S = function(C) {
        if (E.hasOwnProperty(C)) {
          var k = E[C];
          delete E[C], k();
        }
      }, h = function(C) {
        return function() {
          S(C);
        };
      }, O = function(C) {
        S(C.data);
      }, _ = function(C) {
        t.postMessage(C + "", m.protocol + "//" + m.host);
      };
      p && v || (p = function(C) {
        for (var k = [], D = 1; arguments.length > D; ) k.push(arguments[D++]);
        return E[++j] = function() {
          (typeof C == "function" ? C : Function(C)).apply(void 0, k);
        }, n(j), j;
      }, v = function(C) {
        delete E[C];
      }, d ? n = function(C) {
        g.nextTick(h(C));
      } : y && y.now ? n = function(C) {
        y.now(h(C));
      } : b && !l ? (r = new b(), o = r.port2, r.port1.onmessage = O, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && m && m.protocol !== "file:" && !u(_) ? (n = _, t.addEventListener("message", O, !1)) : n = w in s("script") ? function(C) {
        a.appendChild(s("script"))[w] = function() {
          a.removeChild(this), S(C);
        };
      } : function(C) {
        setTimeout(h(C), 0);
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
          var g = p.unicode;
          p.lastIndex = 0;
          for (var b, y = [], j = 0; (b = c(p, v)) !== null; ) {
            var E = String(b[0]);
            y[j] = E, E === "" && (p.lastIndex = u(v, o(p.lastIndex), g)), j++;
          }
          return j === 0 ? null : y;
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
        function l(v, g) {
          return n.isPlainObject(v) && n.isPlainObject(g) ? n.merge(v, g) : n.isPlainObject(g) ? n.merge({}, g) : n.isArray(g) ? g.slice() : g;
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
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, c = e("241c").f, a = e("44e7"), s = e("ad6d"), l = e("9f7f"), d = e("6eeb"), m = e("d039"), p = e("69f3").set, v = e("2626"), g = e("b622"), b = g("match"), y = r.RegExp, j = y.prototype, E = /a/g, w = /a/g, S = new y(E) !== E, h = l.UNSUPPORTED_Y, O = n && o("RegExp", !S || h || m(function() {
        return w[b] = !1, y(E) != E || y(w) == w || y(E, "i") != "/a/i";
      }));
      if (O) {
        for (var _ = function(F, q) {
          var M, $ = this instanceof _, ce = a(F), ne = q === void 0;
          if (!$ && ce && F.constructor === _ && ne) return F;
          S ? ce && !ne && (F = F.source) : F instanceof _ && (ne && (q = s.call(F)), F = F.source), h && (M = !!q && q.indexOf("y") > -1, M && (q = q.replace(/y/g, "")));
          var T = t(S ? new y(F, q) : y(F, q), $ ? this : j, _);
          return h && M && p(T, { sticky: M }), T;
        }, C = function(F) {
          F in _ || u(_, F, { configurable: !0, get: function() {
            return y[F];
          }, set: function(q) {
            y[F] = q;
          } });
        }, k = c(y), D = 0; k.length > D; ) C(k[D++]);
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
        var l, d, m, p, v, g, b = r(s), y = typeof this == "function" ? this : Array, j = arguments.length, E = j > 1 ? arguments[1] : void 0, w = E !== void 0, S = a(b), h = 0;
        if (w && (E = n(E, j > 2 ? arguments[2] : void 0, 2)), S == null || y == Array && t(S)) for (l = u(b.length), d = new y(l); l > h; h++) g = w ? E(b[h], h) : b[h], c(d, h, g);
        else for (p = S.call(b), v = p.next, d = new y(); !(m = v.call(p)).done; h++) g = w ? o(p, E, [m.value, h], !0) : m.value, c(d, h, g);
        return d.length = h, d;
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
      n("replace", 2, function(p, v, g, b) {
        var y = b.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, j = b.REPLACE_KEEPS_$0, E = y ? "$" : "$0";
        return [function(w, S) {
          var h = u(this), O = w == null ? void 0 : w[p];
          return O !== void 0 ? O.call(w, h, S) : v.call(String(h), w, S);
        }, function(w, S) {
          if (!y && j || typeof S == "string" && S.indexOf(E) === -1) {
            var h = g(v, w, this, S);
            if (h.done) return h.value;
          }
          var O = r(w), _ = String(this), C = typeof S == "function";
          C || (S = String(S));
          var k = O.global;
          if (k) {
            var D = O.unicode;
            O.lastIndex = 0;
          }
          for (var F = []; ; ) {
            var q = s(O, _);
            if (q === null || (F.push(q), !k)) break;
            var M = String(q[0]);
            M === "" && (O.lastIndex = c(_, o(O.lastIndex), D));
          }
          for (var $ = "", ce = 0, ne = 0; ne < F.length; ne++) {
            q = F[ne];
            for (var T = String(q[0]), L = l(d(t(q.index), _.length), 0), G = [], J = 1; J < q.length; J++) G.push(m(q[J]));
            var V = q.groups;
            if (C) {
              var ye = [T].concat(G, L, _);
              V !== void 0 && ye.push(V);
              var pe = String(S.apply(void 0, ye));
            } else pe = a(T, _, L, G, V, S);
            L >= ce && ($ += _.slice(ce, L) + pe, ce = L + T.length);
          }
          return $ + _.slice(ce);
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
          var g = n.navigator.appVersion.match(/iphone/gi), b = n.devicePixelRatio;
          a = g ? b >= 3 && (!a || a >= 3) ? 3 : b >= 2 && (!a || a >= 2) ? 2 : 1 : 1, s = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var y = o.createElement("div");
          y.appendChild(u), o.write(y.innerHTML);
        }
        function j() {
          var E = t.getBoundingClientRect().width, w = E / 10;
          t.style.fontSize = w + "px", l.rem = n.rem = w;
        }
        n.addEventListener("resize", function() {
          j();
        }, !1), n.addEventListener("pageshow", function(E) {
          E.persisted && j();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * a + "px" : o.addEventListener("DOMContentLoaded", function(E) {
          o.body.style.fontSize = 10 * a + "px";
        }, !1), j(), l.dpr = n.dpr = a, l.refreshRem = j, l.rem2px = function(E) {
          var w = parseFloat(E) * this.rem;
          return typeof E == "string" && E.match(/rem$/) && (w += "px"), w;
        }, l.px2rem = function(E) {
          var w = parseFloat(E) / this.rem;
          return typeof E == "string" && E.match(/px$/) && (w += "rem"), w;
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
      i.exports = { getConstructor: function(g, b, y, j) {
        var E = g(function(O, _) {
          u(O, E, b), p(O, { type: b, index: r(null), first: void 0, last: void 0, size: 0 }), l || (O.size = 0), _ != null && c(_, O[j], { that: O, AS_ENTRIES: y });
        }), w = v(b), S = function(O, _, C) {
          var k, D, F = w(O), q = h(O, _);
          return q ? q.value = C : (F.last = q = { index: D = d(_, !0), key: _, value: C, previous: k = F.last, next: void 0, removed: !1 }, F.first || (F.first = q), k && (k.next = q), l ? F.size++ : O.size++, D !== "F" && (F.index[D] = q)), O;
        }, h = function(O, _) {
          var C, k = w(O), D = d(_);
          if (D !== "F") return k.index[D];
          for (C = k.first; C; C = C.next) if (C.key == _) return C;
        };
        return o(E.prototype, { clear: function() {
          for (var O = this, _ = w(O), C = _.index, k = _.first; k; ) k.removed = !0, k.previous && (k.previous = k.previous.next = void 0), delete C[k.index], k = k.next;
          _.first = _.last = void 0, l ? _.size = 0 : O.size = 0;
        }, delete: function(O) {
          var _ = this, C = w(_), k = h(_, O);
          if (k) {
            var D = k.next, F = k.previous;
            delete C.index[k.index], k.removed = !0, F && (F.next = D), D && (D.previous = F), C.first == k && (C.first = D), C.last == k && (C.last = F), l ? C.size-- : _.size--;
          }
          return !!k;
        }, forEach: function(O) {
          for (var _, C = w(this), k = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); _ = _ ? _.next : C.first; )
            for (k(_.value, _.key, this); _ && _.removed; ) _ = _.previous;
        }, has: function(O) {
          return !!h(this, O);
        } }), o(E.prototype, y ? { get: function(O) {
          var _ = h(this, O);
          return _ && _.value;
        }, set: function(O, _) {
          return S(this, O === 0 ? 0 : O, _);
        } } : { add: function(O) {
          return S(this, O = O === 0 ? 0 : O, O);
        } }), l && n(E.prototype, "size", { get: function() {
          return w(this).size;
        } }), E;
      }, setStrong: function(g, b, y) {
        var j = b + " Iterator", E = v(b), w = v(j);
        a(g, b, function(S, h) {
          p(this, { type: j, target: S, state: E(S), kind: h, last: void 0 });
        }, function() {
          for (var S = w(this), h = S.kind, O = S.last; O && O.removed; ) O = O.previous;
          return S.target && (S.last = O = O ? O.next : S.state.first) ? h == "keys" ? { value: O.key, done: !1 } : h == "values" ? { value: O.value, done: !1 } : { value: [O.key, O.value], done: !1 } : (S.target = void 0, { value: void 0, done: !0 });
        }, y ? "entries" : "values", !y, !0), s(b);
      } };
    }, "65f0": function(i, f, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      i.exports = function(u, c) {
        var a;
        return r(u) && (a = u.constructor, typeof a != "function" || a !== Array && !r(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(c === 0 ? 0 : c);
      };
    }, "69f3": function(i, f, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), c = e("861d"), a = e("9112"), s = e("5135"), l = e("c6cd"), d = e("f772"), m = e("d012"), p = u.WeakMap, v = function(S) {
        return o(S) ? r(S) : n(S, {});
      }, g = function(S) {
        return function(h) {
          var O;
          if (!c(h) || (O = r(h)).type !== S) throw TypeError("Incompatible receiver, " + S + " required");
          return O;
        };
      };
      if (t) {
        var b = l.state || (l.state = new p()), y = b.get, j = b.has, E = b.set;
        n = function(S, h) {
          return h.facade = S, E.call(b, S, h), h;
        }, r = function(S) {
          return y.call(b, S) || {};
        }, o = function(S) {
          return j.call(b, S);
        };
      } else {
        var w = d("state");
        m[w] = !0, n = function(S, h) {
          return h.facade = S, a(S, w, h), h;
        }, r = function(S) {
          return s(S, w) ? S[w] : {};
        }, o = function(S) {
          return s(S, w);
        };
      }
      i.exports = { set: n, get: r, has: o, enforce: v, getterFor: g };
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
      i.exports = function(v, g, b) {
        var y = v.indexOf("Map") !== -1, j = v.indexOf("Weak") !== -1, E = y ? "set" : "add", w = r[v], S = w && w.prototype, h = w, O = {}, _ = function($) {
          var ce = S[$];
          t(S, $, $ == "add" ? function(ne) {
            return ce.call(this, ne === 0 ? 0 : ne), this;
          } : $ == "delete" ? function(ne) {
            return !(j && !s(ne)) && ce.call(this, ne === 0 ? 0 : ne);
          } : $ == "get" ? function(ne) {
            return j && !s(ne) ? void 0 : ce.call(this, ne === 0 ? 0 : ne);
          } : $ == "has" ? function(ne) {
            return !(j && !s(ne)) && ce.call(this, ne === 0 ? 0 : ne);
          } : function(ne, T) {
            return ce.call(this, ne === 0 ? 0 : ne, T), this;
          });
        }, C = o(v, typeof w != "function" || !(j || S.forEach && !l(function() {
          new w().entries().next();
        })));
        if (C) h = b.getConstructor(g, v, y, E), u.REQUIRED = !0;
        else if (o(v, !0)) {
          var k = new h(), D = k[E](j ? {} : -0, 1) != k, F = l(function() {
            k.has(1);
          }), q = d(function($) {
            new w($);
          }), M = !j && l(function() {
            for (var $ = new w(), ce = 5; ce--; ) $[E](ce, ce);
            return !$.has(-0);
          });
          q || (h = g(function($, ce) {
            a($, h, v);
            var ne = p(new w(), $, h);
            return ce != null && c(ce, ne[E], { that: ne, AS_ENTRIES: y }), ne;
          }), h.prototype = S, S.constructor = h), (F || M) && (_("delete"), _("has"), y && _("get")), (M || D) && _(E), j && S.clear && delete S.clear;
        }
        return O[v] = h, n({ global: !0, forced: h != w }, O), m(h, v), j || b.setStrong(h, v, y), h;
      };
    }, "6eeb": function(i, f, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), c = e("69f3"), a = c.get, s = c.enforce, l = String(String).split("String");
      (i.exports = function(d, m, p, v) {
        var g, b = !!v && !!v.unsafe, y = !!v && !!v.enumerable, j = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof m != "string" || o(p, "name") || r(p, "name", m), g = s(p), g.source || (g.source = l.join(typeof m == "string" ? m : ""))), d !== n ? (b ? !j && d[m] && (y = !0) : delete d[m], y ? d[m] = p : r(d, m, p)) : y ? d[m] = p : t(m, p);
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
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), c = e("1be4"), a = e("cc12"), s = e("f772"), l = ">", d = "<", m = "prototype", p = "script", v = s("IE_PROTO"), g = function() {
      }, b = function(w) {
        return d + p + l + w + d + "/" + p + l;
      }, y = function(w) {
        w.write(b("")), w.close();
        var S = w.parentWindow.Object;
        return w = null, S;
      }, j = function() {
        var w, S = a("iframe"), h = "java" + p + ":";
        return S.style.display = "none", c.appendChild(S), S.src = String(h), w = S.contentWindow.document, w.open(), w.write(b("document.F=Object")), w.close(), w.F;
      }, E = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        E = n ? y(n) : j();
        for (var w = t.length; w--; ) delete E[m][t[w]];
        return E();
      };
      u[v] = !0, i.exports = Object.create || function(w, S) {
        var h;
        return w !== null ? (g[m] = r(w), h = new g(), g[m] = null, h[v] = w) : h = E(), S === void 0 ? h : o(h, S);
      };
    }, "7db0": function(i, f, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(i, f, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), c = e("9112"), a = e("6eeb"), s = e("b622"), l = e("c430"), d = e("3f8c"), m = e("ae93"), p = m.IteratorPrototype, v = m.BUGGY_SAFARI_ITERATORS, g = s("iterator"), b = "keys", y = "values", j = "entries", E = function() {
        return this;
      };
      i.exports = function(w, S, h, O, _, C, k) {
        r(h, S, O);
        var D, F, q, M = function(J) {
          if (J === _ && L) return L;
          if (!v && J in ne) return ne[J];
          switch (J) {
            case b:
              return function() {
                return new h(this, J);
              };
            case y:
              return function() {
                return new h(this, J);
              };
            case j:
              return function() {
                return new h(this, J);
              };
          }
          return function() {
            return new h(this);
          };
        }, $ = S + " Iterator", ce = !1, ne = w.prototype, T = ne[g] || ne["@@iterator"] || _ && ne[_], L = !v && T || M(_), G = S == "Array" && ne.entries || T;
        if (G && (D = o(G.call(new w())), p !== Object.prototype && D.next && (l || o(D) === p || (t ? t(D, p) : typeof D[g] != "function" && c(D, g, E)), u(D, $, !0, !0), l && (d[$] = E))), _ == y && T && T.name !== y && (ce = !0, L = function() {
          return T.call(this);
        }), l && !k || ne[g] === L || c(ne, g, L), d[S] = L, _) if (F = { values: M(y), keys: C ? L : M(b), entries: M(j) }, k) for (q in F) (v || ce || !(q in ne)) && a(ne, q, F[q]);
        else n({ target: S, proto: !0, forced: v || ce }, F);
        return F;
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
            var c, a, s, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, d = /@([^@]*):(\d+):(\d+)\s*$/gi, m = l.exec(j.stack) || d.exec(j.stack), p = m && m[1] || !1, v = m && m[2] || !1, g = document.location.href.replace(document.location.hash, ""), b = document.getElementsByTagName("script");
            p === g && (c = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), s = c.replace(a, "$1").trim());
            for (var y = 0; y < b.length; y++)
              if (b[y].readyState === "interactive" || b[y].src === p || p === g && b[y].innerHTML && b[y].innerHTML.trim() === s) return b[y];
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
      i.exports = oe;
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
        var m, p, v, g, b = this, y = a && b.sticky, j = n.call(b), E = b.source, w = 0, S = d;
        return y && (j = j.replace("y", ""), j.indexOf("g") === -1 && (j += "g"), S = String(d).slice(b.lastIndex), b.lastIndex > 0 && (!b.multiline || b.multiline && d[b.lastIndex - 1] !== `
`) && (E = "(?: " + E + ")", S = " " + S, w++), p = new RegExp("^(?:" + E + ")", j)), s && (p = new RegExp("^" + E + "$(?!\\s)", j)), c && (m = b.lastIndex), v = o.call(y ? p : b, S), y ? v ? (v.input = v.input.slice(w), v[0] = v[0].slice(w), v.index = b.lastIndex, b.lastIndex += v[0].length) : b.lastIndex = 0 : c && v && (b.lastIndex = b.global ? v.index + v[0].length : m), s && v && v.length > 1 && t.call(v[0], p, function() {
          for (g = 1; g < arguments.length - 2; g++) arguments[g] === void 0 && (v[g] = void 0);
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
          l = e.regeneratorRuntime = s ? i.exports : {}, l.wrap = w;
          var d = "suspendedStart", m = "suspendedYield", p = "executing", v = "completed", g = {}, b = {};
          b[u] = function() {
            return this;
          };
          var y = Object.getPrototypeOf, j = y && y(y(ce([])));
          j && j !== r && o.call(j, u) && (b = j);
          var E = _.prototype = h.prototype = Object.create(b);
          O.prototype = E.constructor = _, _.constructor = O, _[a] = O.displayName = "GeneratorFunction", l.isGeneratorFunction = function(T) {
            var L = typeof T == "function" && T.constructor;
            return !!L && (L === O || (L.displayName || L.name) === "GeneratorFunction");
          }, l.mark = function(T) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(T, _) : (T.__proto__ = _, a in T || (T[a] = "GeneratorFunction")), T.prototype = Object.create(E), T;
          }, l.awrap = function(T) {
            return { __await: T };
          }, C(k.prototype), k.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = k, l.async = function(T, L, G, J) {
            var V = new k(w(T, L, G, J));
            return l.isGeneratorFunction(L) ? V : V.next().then(function(ye) {
              return ye.done ? ye.value : V.next();
            });
          }, C(E), E[a] = "Generator", E[u] = function() {
            return this;
          }, E.toString = function() {
            return "[object Generator]";
          }, l.keys = function(T) {
            var L = [];
            for (var G in T) L.push(G);
            return L.reverse(), function J() {
              for (; L.length; ) {
                var V = L.pop();
                if (V in T) return J.value = V, J.done = !1, J;
              }
              return J.done = !0, J;
            };
          }, l.values = ce, $.prototype = { constructor: $, reset: function(T) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(M), !T) for (var L in this) L.charAt(0) === "t" && o.call(this, L) && !isNaN(+L.slice(1)) && (this[L] = n);
          }, stop: function() {
            this.done = !0;
            var T = this.tryEntries[0], L = T.completion;
            if (L.type === "throw") throw L.arg;
            return this.rval;
          }, dispatchException: function(T) {
            if (this.done) throw T;
            var L = this;
            function G(je, Pe) {
              return ye.type = "throw", ye.arg = T, L.next = je, Pe && (L.method = "next", L.arg = n), !!Pe;
            }
            for (var J = this.tryEntries.length - 1; J >= 0; --J) {
              var V = this.tryEntries[J], ye = V.completion;
              if (V.tryLoc === "root") return G("end");
              if (V.tryLoc <= this.prev) {
                var pe = o.call(V, "catchLoc"), Le = o.call(V, "finallyLoc");
                if (pe && Le) {
                  if (this.prev < V.catchLoc) return G(V.catchLoc, !0);
                  if (this.prev < V.finallyLoc) return G(V.finallyLoc);
                } else if (pe) {
                  if (this.prev < V.catchLoc) return G(V.catchLoc, !0);
                } else {
                  if (!Le) throw new Error("try statement without catch or finally");
                  if (this.prev < V.finallyLoc) return G(V.finallyLoc);
                }
              }
            }
          }, abrupt: function(T, L) {
            for (var G = this.tryEntries.length - 1; G >= 0; --G) {
              var J = this.tryEntries[G];
              if (J.tryLoc <= this.prev && o.call(J, "finallyLoc") && this.prev < J.finallyLoc) {
                var V = J;
                break;
              }
            }
            V && (T === "break" || T === "continue") && V.tryLoc <= L && L <= V.finallyLoc && (V = null);
            var ye = V ? V.completion : {};
            return ye.type = T, ye.arg = L, V ? (this.method = "next", this.next = V.finallyLoc, g) : this.complete(ye);
          }, complete: function(T, L) {
            if (T.type === "throw") throw T.arg;
            return T.type === "break" || T.type === "continue" ? this.next = T.arg : T.type === "return" ? (this.rval = this.arg = T.arg, this.method = "return", this.next = "end") : T.type === "normal" && L && (this.next = L), g;
          }, finish: function(T) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var G = this.tryEntries[L];
              if (G.finallyLoc === T) return this.complete(G.completion, G.afterLoc), M(G), g;
            }
          }, catch: function(T) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var G = this.tryEntries[L];
              if (G.tryLoc === T) {
                var J = G.completion;
                if (J.type === "throw") {
                  var V = J.arg;
                  M(G);
                }
                return V;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(T, L, G) {
            return this.delegate = { iterator: ce(T), resultName: L, nextLoc: G }, this.method === "next" && (this.arg = n), g;
          } };
        }
        function w(T, L, G, J) {
          var V = L && L.prototype instanceof h ? L : h, ye = Object.create(V.prototype), pe = new $(J || []);
          return ye._invoke = D(T, G, pe), ye;
        }
        function S(T, L, G) {
          try {
            return { type: "normal", arg: T.call(L, G) };
          } catch (J) {
            return { type: "throw", arg: J };
          }
        }
        function h() {
        }
        function O() {
        }
        function _() {
        }
        function C(T) {
          ["next", "throw", "return"].forEach(function(L) {
            T[L] = function(G) {
              return this._invoke(L, G);
            };
          });
        }
        function k(T) {
          function L(V, ye, pe, Le) {
            var je = S(T[V], T, ye);
            if (je.type !== "throw") {
              var Pe = je.arg, Se = Pe.value;
              return Se && typeof Se == "object" && o.call(Se, "__await") ? Promise.resolve(Se.__await).then(function(Ee) {
                L("next", Ee, pe, Le);
              }, function(Ee) {
                L("throw", Ee, pe, Le);
              }) : Promise.resolve(Se).then(function(Ee) {
                Pe.value = Ee, pe(Pe);
              }, Le);
            }
            Le(je.arg);
          }
          var G;
          function J(V, ye) {
            function pe() {
              return new Promise(function(Le, je) {
                L(V, ye, Le, je);
              });
            }
            return G = G ? G.then(pe, pe) : pe();
          }
          this._invoke = J;
        }
        function D(T, L, G) {
          var J = d;
          return function(V, ye) {
            if (J === p) throw new Error("Generator is already running");
            if (J === v) {
              if (V === "throw") throw ye;
              return ne();
            }
            for (G.method = V, G.arg = ye; ; ) {
              var pe = G.delegate;
              if (pe) {
                var Le = F(pe, G);
                if (Le) {
                  if (Le === g) continue;
                  return Le;
                }
              }
              if (G.method === "next") G.sent = G._sent = G.arg;
              else if (G.method === "throw") {
                if (J === d) throw J = v, G.arg;
                G.dispatchException(G.arg);
              } else G.method === "return" && G.abrupt("return", G.arg);
              J = p;
              var je = S(T, L, G);
              if (je.type === "normal") {
                if (J = G.done ? v : m, je.arg === g) continue;
                return { value: je.arg, done: G.done };
              }
              je.type === "throw" && (J = v, G.method = "throw", G.arg = je.arg);
            }
          };
        }
        function F(T, L) {
          var G = T.iterator[L.method];
          if (G === n) {
            if (L.delegate = null, L.method === "throw") {
              if (T.iterator.return && (L.method = "return", L.arg = n, F(T, L), L.method === "throw")) return g;
              L.method = "throw", L.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return g;
          }
          var J = S(G, T.iterator, L.arg);
          if (J.type === "throw") return L.method = "throw", L.arg = J.arg, L.delegate = null, g;
          var V = J.arg;
          return V ? V.done ? (L[T.resultName] = V.value, L.next = T.nextLoc, L.method !== "return" && (L.method = "next", L.arg = n), L.delegate = null, g) : V : (L.method = "throw", L.arg = new TypeError("iterator result is not an object"), L.delegate = null, g);
        }
        function q(T) {
          var L = { tryLoc: T[0] };
          1 in T && (L.catchLoc = T[1]), 2 in T && (L.finallyLoc = T[2], L.afterLoc = T[3]), this.tryEntries.push(L);
        }
        function M(T) {
          var L = T.completion || {};
          L.type = "normal", delete L.arg, T.completion = L;
        }
        function $(T) {
          this.tryEntries = [{ tryLoc: "root" }], T.forEach(q, this), this.reset(!0);
        }
        function ce(T) {
          if (T) {
            var L = T[u];
            if (L) return L.call(T);
            if (typeof T.next == "function") return T;
            if (!isNaN(T.length)) {
              var G = -1, J = function V() {
                for (; ++G < T.length; ) if (o.call(T, G)) return V.value = T[G], V.done = !1, V;
                return V.value = n, V.done = !0, V;
              };
              return J.next = J;
            }
          }
          return { next: ne };
        }
        function ne() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), c = e("50c4"), a = e("8418"), s = e("65f0"), l = e("1dde"), d = e("b622"), m = e("2d00"), p = d("isConcatSpreadable"), v = 9007199254740991, g = "Maximum allowed index exceeded", b = m >= 51 || !r(function() {
        var w = [];
        return w[p] = !1, w.concat()[0] !== w;
      }), y = l("concat"), j = function(w) {
        if (!t(w)) return !1;
        var S = w[p];
        return S !== void 0 ? !!S : o(w);
      }, E = !b || !y;
      n({ target: "Array", proto: !0, forced: E }, { concat: function(w) {
        var S, h, O, _, C, k = u(this), D = s(k, 0), F = 0;
        for (S = -1, O = arguments.length; S < O; S++) if (C = S === -1 ? k : arguments[S], j(C)) {
          if (_ = c(C.length), F + _ > v) throw TypeError(g);
          for (h = 0; h < _; h++, F++) h in C && a(D, F, C[h]);
        } else {
          if (F >= v) throw TypeError(g);
          a(D, F++, C);
        }
        return D.length = F, D;
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
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(g, b) {
        var y, j, E, w, S, h, O = u(this), _ = t(O.length), C = r(g, _), k = arguments.length;
        if (k === 0 ? y = j = 0 : k === 1 ? (y = 0, j = _ - C) : (y = k - 2, j = m(d(o(b), 0), _ - C)), _ + y - j > p) throw TypeError(v);
        for (E = c(O, j), w = 0; w < j; w++) S = C + w, S in O && a(E, w, O[S]);
        if (E.length = j, y < j) {
          for (w = C; w < _ - j; w++) S = w + j, h = w + y, S in O ? O[h] = O[S] : delete O[h];
          for (w = _; w > _ - j + y; w--) delete O[w - 1];
        } else if (y > j) for (w = _ - j; w > C; w--) S = w + j - 1, h = w + y - 1, S in O ? O[h] = O[S] : delete O[h];
        for (w = 0; w < y; w++) O[w + C] = arguments[w + 2];
        return O.length = _ - j + y, E;
      } });
    }, a4b4: function(i, f, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), c = e("4930"), a = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), m = e("861d"), p = e("825a"), v = e("7b0b"), g = e("fc6a"), b = e("c04e"), y = e("5c6c"), j = e("7c73"), E = e("df75"), w = e("241c"), S = e("057f"), h = e("7418"), O = e("06cf"), _ = e("9bf2"), C = e("d1e7"), k = e("9112"), D = e("6eeb"), F = e("5692"), q = e("f772"), M = e("d012"), $ = e("90e3"), ce = e("b622"), ne = e("e538"), T = e("746f"), L = e("d44e"), G = e("69f3"), J = e("b727").forEach, V = q("hidden"), ye = "Symbol", pe = "prototype", Le = ce("toPrimitive"), je = G.set, Pe = G.getterFor(ye), Se = Object[pe], Ee = r.Symbol, Fe = o("JSON", "stringify"), He = O.f, B = _.f, R = S.f, X = C.f, W = F("symbols"), ee = F("op-symbols"), ie = F("string-to-symbol-registry"), Y = F("symbol-to-string-registry"), I = F("wks"), K = r.QObject, me = !K || !K[pe] || !K[pe].findChild, ke = u && s(function() {
        return j(B({}, "a", { get: function() {
          return B(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(z, te, se) {
        var he = He(Se, te);
        he && delete Se[te], B(z, te, se), he && z !== Se && B(Se, te, he);
      } : B, Be = function(z, te) {
        var se = W[z] = j(Ee[pe]);
        return je(se, { type: ye, tag: z, description: te }), u || (se.description = te), se;
      }, Oe = a ? function(z) {
        return typeof z == "symbol";
      } : function(z) {
        return Object(z) instanceof Ee;
      }, We = function(z, te, se) {
        z === Se && We(ee, te, se), p(z);
        var he = b(te, !0);
        return p(se), l(W, he) ? (se.enumerable ? (l(z, V) && z[V][he] && (z[V][he] = !1), se = j(se, { enumerable: y(0, !1) })) : (l(z, V) || B(z, V, y(1, {})), z[V][he] = !0), ke(z, he, se)) : B(z, he, se);
      }, Ge = function(z, te) {
        p(z);
        var se = g(te), he = E(se).concat(fe(se));
        return J(he, function(Me) {
          u && !nt.call(se, Me) || We(z, Me, se[Me]);
        }), z;
      }, Je = function(z, te) {
        return te === void 0 ? j(z) : Ge(j(z), te);
      }, nt = function(z) {
        var te = b(z, !0), se = X.call(this, te);
        return !(this === Se && l(W, te) && !l(ee, te)) && (!(se || !l(this, te) || !l(W, te) || l(this, V) && this[V][te]) || se);
      }, Q = function(z, te) {
        var se = g(z), he = b(te, !0);
        if (se !== Se || !l(W, he) || l(ee, he)) {
          var Me = He(se, he);
          return !Me || !l(W, he) || l(se, V) && se[V][he] || (Me.enumerable = !0), Me;
        }
      }, ae = function(z) {
        var te = R(g(z)), se = [];
        return J(te, function(he) {
          l(W, he) || l(M, he) || se.push(he);
        }), se;
      }, fe = function(z) {
        var te = z === Se, se = R(te ? ee : g(z)), he = [];
        return J(se, function(Me) {
          !l(W, Me) || te && !l(Se, Me) || he.push(W[Me]);
        }), he;
      };
      if (c || (Ee = function() {
        if (this instanceof Ee) throw TypeError("Symbol is not a constructor");
        var z = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, te = $(z), se = function(he) {
          this === Se && se.call(ee, he), l(this, V) && l(this[V], te) && (this[V][te] = !1), ke(this, te, y(1, he));
        };
        return u && me && ke(Se, te, { configurable: !0, set: se }), Be(te, z);
      }, D(Ee[pe], "toString", function() {
        return Pe(this).tag;
      }), D(Ee, "withoutSetter", function(z) {
        return Be($(z), z);
      }), C.f = nt, _.f = We, O.f = Q, w.f = S.f = ae, h.f = fe, ne.f = function(z) {
        return Be(ce(z), z);
      }, u && (B(Ee[pe], "description", { configurable: !0, get: function() {
        return Pe(this).description;
      } }), t || D(Se, "propertyIsEnumerable", nt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Ee }), J(E(I), function(z) {
        T(z);
      }), n({ target: ye, stat: !0, forced: !c }, { for: function(z) {
        var te = String(z);
        if (l(ie, te)) return ie[te];
        var se = Ee(te);
        return ie[te] = se, Y[se] = te, se;
      }, keyFor: function(z) {
        if (!Oe(z)) throw TypeError(z + " is not a symbol");
        if (l(Y, z)) return Y[z];
      }, useSetter: function() {
        me = !0;
      }, useSimple: function() {
        me = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !u }, { create: Je, defineProperty: We, defineProperties: Ge, getOwnPropertyDescriptor: Q }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: ae, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: s(function() {
        h.f(1);
      }) }, { getOwnPropertySymbols: function(z) {
        return h.f(v(z));
      } }), Fe) {
        var ve = !c || s(function() {
          var z = Ee();
          return Fe([z]) != "[null]" || Fe({ a: z }) != "{}" || Fe(Object(z)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: ve }, { stringify: function(z, te, se) {
          for (var he, Me = [z], qe = 1; arguments.length > qe; ) Me.push(arguments[qe++]);
          if (he = te, (m(te) || z !== void 0) && !Oe(z)) return d(te) || (te = function(Ze, we) {
            if (typeof he == "function" && (we = he.call(this, Ze, we)), !Oe(we)) return we;
          }), Me[1] = te, Fe.apply(null, Me);
        } });
      }
      Ee[pe][Le] || k(Ee[pe], Le, Ee[pe].valueOf), L(Ee, ye), M[V] = !0;
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
        var g = {};
        return n[d].call(g) !== g;
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
          var g = new XMLHttpRequest();
          if (l.auth) {
            var b = l.auth.username || "", y = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            v.Authorization = "Basic " + btoa(b + ":" + y);
          }
          var j = u(l.baseURL, l.url);
          if (g.open(l.method.toUpperCase(), t(j, l.params, l.paramsSerializer), !0), g.timeout = l.timeout, g.onreadystatechange = function() {
            if (g && g.readyState === 4 && (g.status !== 0 || g.responseURL && g.responseURL.indexOf("file:") === 0)) {
              var w = "getAllResponseHeaders" in g ? c(g.getAllResponseHeaders()) : null, S = l.responseType && l.responseType !== "text" ? g.response : g.responseText, h = { data: S, status: g.status, statusText: g.statusText, headers: w, config: l, request: g };
              r(d, m, h), g = null;
            }
          }, g.onabort = function() {
            g && (m(s("Request aborted", l, "ECONNABORTED", g)), g = null);
          }, g.onerror = function() {
            m(s("Network Error", l, null, g)), g = null;
          }, g.ontimeout = function() {
            var w = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (w = l.timeoutErrorMessage), m(s(w, l, "ECONNABORTED", g)), g = null;
          }, n.isStandardBrowserEnv()) {
            var E = (l.withCredentials || a(j)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            E && (v[l.xsrfHeaderName] = E);
          }
          if ("setRequestHeader" in g && n.forEach(v, function(w, S) {
            typeof p > "u" && S.toLowerCase() === "content-type" ? delete v[S] : g.setRequestHeader(S, w);
          }), n.isUndefined(l.withCredentials) || (g.withCredentials = !!l.withCredentials), l.responseType) try {
            g.responseType = l.responseType;
          } catch (w) {
            if (l.responseType !== "json") throw w;
          }
          typeof l.onDownloadProgress == "function" && g.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && g.upload && g.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(w) {
            g && (g.abort(), m(w), g = null);
          }), p || (p = null), g.send(p);
        });
      };
    }, b575: function(i, f, e) {
      var n, r, o, t, u, c, a, s, l = e("da84"), d = e("06cf").f, m = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), g = e("605d"), b = l.MutationObserver || l.WebKitMutationObserver, y = l.document, j = l.process, E = l.Promise, w = d(l, "queueMicrotask"), S = w && w.value;
      S || (n = function() {
        var h, O;
        for (g && (h = j.domain) && h.exit(); r; ) {
          O = r.fn, r = r.next;
          try {
            O();
          } catch (_) {
            throw r ? t() : o = void 0, _;
          }
        }
        o = void 0, h && h.enter();
      }, p || g || v || !b || !y ? E && E.resolve ? (a = E.resolve(void 0), s = a.then, t = function() {
        s.call(a, n);
      }) : t = g ? function() {
        j.nextTick(n);
      } : function() {
        m.call(l, n);
      } : (u = !0, c = y.createTextNode(""), new b(n).observe(c, { characterData: !0 }), t = function() {
        c.data = u = !u;
      })), i.exports = S || function(h) {
        var O = { fn: h, next: void 0 };
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
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), c = 1 .toFixed, a = Math.floor, s = function(g, b, y) {
        return b === 0 ? y : b % 2 === 1 ? s(g, b - 1, y * g) : s(g * g, b / 2, y);
      }, l = function(g) {
        for (var b = 0, y = g; y >= 4096; ) b += 12, y /= 4096;
        for (; y >= 2; ) b += 1, y /= 2;
        return b;
      }, d = function(g, b, y) {
        for (var j = -1, E = y; ++j < 6; ) E += b * g[j], g[j] = E % 1e7, E = a(E / 1e7);
      }, m = function(g, b) {
        for (var y = 6, j = 0; --y >= 0; ) j += g[y], g[y] = a(j / b), j = j % b * 1e7;
      }, p = function(g) {
        for (var b = 6, y = ""; --b >= 0; ) if (y !== "" || b === 0 || g[b] !== 0) {
          var j = String(g[b]);
          y = y === "" ? j : y + t.call("0", 7 - j.length) + j;
        }
        return y;
      }, v = c && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        c.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(g) {
        var b, y, j, E, w = o(this), S = r(g), h = [0, 0, 0, 0, 0, 0], O = "", _ = "0";
        if (S < 0 || S > 20) throw RangeError("Incorrect fraction digits");
        if (w != w) return "NaN";
        if (w <= -1e21 || w >= 1e21) return String(w);
        if (w < 0 && (O = "-", w = -w), w > 1e-21) if (b = l(w * s(2, 69, 1)) - 69, y = b < 0 ? w * s(2, -b, 1) : w / s(2, b, 1), y *= 4503599627370496, b = 52 - b, b > 0) {
          for (d(h, 0, y), j = S; j >= 7; ) d(h, 1e7, 0), j -= 7;
          for (d(h, s(10, j, 1), 0), j = b - 1; j >= 23; ) m(h, 1 << 23), j -= 23;
          m(h, 1 << j), d(h, 1, 1), m(h, 2), _ = p(h);
        } else d(h, 0, y), d(h, 1 << -b, 0), _ = p(h) + t.call("0", S);
        return S > 0 ? (E = _.length, _ = O + (E <= S ? "0." + t.call("0", S - E) + _ : _.slice(0, E - S) + "." + _.slice(E - S))) : _ = O + _, _;
      } });
    }, b727: function(i, f, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), c = [].push, a = function(s) {
        var l = s == 1, d = s == 2, m = s == 3, p = s == 4, v = s == 6, g = s == 7, b = s == 5 || v;
        return function(y, j, E, w) {
          for (var S, h, O = o(y), _ = r(O), C = n(j, E, 3), k = t(_.length), D = 0, F = w || u, q = l ? F(y, k) : d || g ? F(y, 0) : void 0; k > D; D++) if ((b || D in _) && (S = _[D], h = C(S, D, O), s)) if (l) q[D] = h;
          else if (h) switch (s) {
            case 3:
              return !0;
            case 5:
              return S;
            case 6:
              return D;
            case 2:
              c.call(q, S);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              c.call(q, S);
          }
          return v ? -1 : m || p ? p : q;
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
      function o(k) {
        return r.call(k) === "[object Array]";
      }
      function t(k) {
        return typeof k > "u";
      }
      function u(k) {
        return k !== null && !t(k) && k.constructor !== null && !t(k.constructor) && typeof k.constructor.isBuffer == "function" && k.constructor.isBuffer(k);
      }
      function c(k) {
        return r.call(k) === "[object ArrayBuffer]";
      }
      function a(k) {
        return typeof FormData < "u" && k instanceof FormData;
      }
      function s(k) {
        var D;
        return D = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(k) : k && k.buffer && k.buffer instanceof ArrayBuffer, D;
      }
      function l(k) {
        return typeof k == "string";
      }
      function d(k) {
        return typeof k == "number";
      }
      function m(k) {
        return k !== null && typeof k == "object";
      }
      function p(k) {
        if (r.call(k) !== "[object Object]") return !1;
        var D = Object.getPrototypeOf(k);
        return D === null || D === Object.prototype;
      }
      function v(k) {
        return r.call(k) === "[object Date]";
      }
      function g(k) {
        return r.call(k) === "[object File]";
      }
      function b(k) {
        return r.call(k) === "[object Blob]";
      }
      function y(k) {
        return r.call(k) === "[object Function]";
      }
      function j(k) {
        return m(k) && y(k.pipe);
      }
      function E(k) {
        return typeof URLSearchParams < "u" && k instanceof URLSearchParams;
      }
      function w(k) {
        return k.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function S() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function h(k, D) {
        if (k !== null && typeof k < "u") if (typeof k != "object" && (k = [k]), o(k)) for (var F = 0, q = k.length; F < q; F++) D.call(null, k[F], F, k);
        else for (var M in k) Object.prototype.hasOwnProperty.call(k, M) && D.call(null, k[M], M, k);
      }
      function O() {
        var k = {};
        function D(M, $) {
          p(k[$]) && p(M) ? k[$] = O(k[$], M) : p(M) ? k[$] = O({}, M) : o(M) ? k[$] = M.slice() : k[$] = M;
        }
        for (var F = 0, q = arguments.length; F < q; F++) h(arguments[F], D);
        return k;
      }
      function _(k, D, F) {
        return h(D, function(q, M) {
          k[M] = F && typeof q == "function" ? n(q, F) : q;
        }), k;
      }
      function C(k) {
        return k.charCodeAt(0) === 65279 && (k = k.slice(1)), k;
      }
      i.exports = { isArray: o, isArrayBuffer: c, isBuffer: u, isFormData: a, isArrayBufferView: s, isString: l, isNumber: d, isObject: m, isPlainObject: p, isUndefined: t, isDate: v, isFile: g, isBlob: b, isFunction: y, isStream: j, isURLSearchParams: E, isStandardBrowserEnv: S, forEach: h, merge: O, extend: _, trim: w, stripBOM: C };
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
          var m = r(a), p = o(m), v = t(m.length), g = c ? v - 1 : 0, b = c ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (g in p) {
              d = p[g], g += b;
              break;
            }
            if (g += b, c ? g < 0 : v <= g) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; c ? g >= 0 : v > g; g += b) g in p && (d = s(d, p[g], g, m));
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
        var g = "ab".split(p);
        return g.length !== 2 || g[0] !== "a" || g[1] !== "b";
      });
      i.exports = function(p, v, g, b) {
        var y = o(p), j = !r(function() {
          var _ = {};
          return _[y] = function() {
            return 7;
          }, ""[p](_) != 7;
        }), E = j && !r(function() {
          var _ = !1, C = /a/;
          return p === "split" && (C = {}, C.constructor = {}, C.constructor[c] = function() {
            return C;
          }, C.flags = "", C[y] = /./[y]), C.exec = function() {
            return _ = !0, null;
          }, C[y](""), !_;
        });
        if (!j || !E || p === "replace" && (!a || !s || d) || p === "split" && !m) {
          var w = /./[y], S = g(y, ""[p], function(_, C, k, D, F) {
            return C.exec === t ? j && !F ? { done: !0, value: w.call(C, k, D) } : { done: !0, value: _.call(k, C, D) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), h = S[0], O = S[1];
          n(String.prototype, p, h), n(RegExp.prototype, y, v == 2 ? function(_, C) {
            return O.call(_, this, C);
          } : function(_) {
            return O.call(_, this);
          });
        }
        b && u(RegExp.prototype[y], "sham", !0);
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
        for (var s, l, d = t(a), m = u.f, p = o(d), v = {}, g = 0; p.length > g; ) l = m(d, s = p[g++]), l !== void 0 && c(v, s, l);
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
            for (var y = 0; y < b.length && b[y] === ""; y++) ;
            for (var j = b.length - 1; j >= 0 && b[j] === ""; j--) ;
            return y > j ? [] : b.slice(y, j - y + 1);
          }
          c = f.resolve(c).substr(1), a = f.resolve(a).substr(1);
          for (var l = s(c.split("/")), d = s(a.split("/")), m = Math.min(l.length, d.length), p = m, v = 0; v < m; v++) if (l[v] !== d[v]) {
            p = v;
            break;
          }
          var g = [];
          for (v = p; v < l.length; v++) g.push("..");
          return g = g.concat(d.slice(p)), g.join("/");
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
            var g = v.id, b = v.viewBox, y = v.content;
            this.id = g, this.viewBox = b, this.content = y;
          };
          r.prototype.stringify = function() {
            return this.content;
          }, r.prototype.toString = function() {
            return this.stringify();
          }, r.prototype.destroy = function() {
            var v = this;
            ["id", "viewBox", "content"].forEach(function(g) {
              return delete v[g];
            });
          };
          var o = function(v) {
            var g = !!document.importNode, b = new DOMParser().parseFromString(v, "image/svg+xml").documentElement;
            return g ? document.importNode(b, !0) : b;
          };
          function t(v, g) {
            return g = { exports: {} }, v(g, g.exports), g.exports;
          }
          var u = t(function(v, g) {
            (function(b, y) {
              v.exports = y();
            })(0, function() {
              function b(h) {
                var O = h && typeof h == "object";
                return O && Object.prototype.toString.call(h) !== "[object RegExp]" && Object.prototype.toString.call(h) !== "[object Date]";
              }
              function y(h) {
                return Array.isArray(h) ? [] : {};
              }
              function j(h, O) {
                var _ = O && O.clone === !0;
                return _ && b(h) ? S(y(h), h, O) : h;
              }
              function E(h, O, _) {
                var C = h.slice();
                return O.forEach(function(k, D) {
                  typeof C[D] > "u" ? C[D] = j(k, _) : b(k) ? C[D] = S(h[D], k, _) : h.indexOf(k) === -1 && C.push(j(k, _));
                }), C;
              }
              function w(h, O, _) {
                var C = {};
                return b(h) && Object.keys(h).forEach(function(k) {
                  C[k] = j(h[k], _);
                }), Object.keys(O).forEach(function(k) {
                  b(O[k]) && h[k] ? C[k] = S(h[k], O[k], _) : C[k] = j(O[k], _);
                }), C;
              }
              function S(h, O, _) {
                var C = Array.isArray(O), k = _ || { arrayMerge: E }, D = k.arrayMerge || E;
                return C ? Array.isArray(h) ? D(h, O, _) : j(O, _) : w(h, O, _);
              }
              return S.all = function(h, O) {
                if (!Array.isArray(h) || h.length < 2) throw new Error("first argument should be an array with at least two elements");
                return h.reduce(function(_, C) {
                  return S(_, C, O);
                });
              }, S;
            });
          }), c = t(function(v, g) {
            var b = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            g.default = b, v.exports = g.default;
          }), a = function(v) {
            return Object.keys(v).map(function(g) {
              var b = v[g].toString().replace(/"/g, "&quot;");
              return g + '="' + b + '"';
            }).join(" ");
          }, s = c.svg, l = c.xlink, d = {};
          d[s.name] = s.uri, d[l.name] = l.uri;
          var m = function(v, g) {
            v === void 0 && (v = "");
            var b = u(d, {}), y = a(b);
            return "<svg " + y + ">" + v + "</svg>";
          }, p = function(v) {
            function g() {
              v.apply(this, arguments);
            }
            v && (g.__proto__ = v), g.prototype = Object.create(v && v.prototype), g.prototype.constructor = g;
            var b = { isMounted: {} };
            return b.isMounted.get = function() {
              return !!this.node;
            }, g.createFromExistingNode = function(y) {
              return new g({ id: y.getAttribute("id"), viewBox: y.getAttribute("viewBox"), content: y.outerHTML });
            }, g.prototype.destroy = function() {
              this.isMounted && this.unmount(), v.prototype.destroy.call(this);
            }, g.prototype.mount = function(y) {
              if (this.isMounted) return this.node;
              var j = typeof y == "string" ? document.querySelector(y) : y, E = this.render();
              return this.node = E, j.appendChild(E), E;
            }, g.prototype.render = function() {
              var y = this.stringify();
              return o(m(y)).childNodes[0];
            }, g.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(g.prototype, b), g;
          }(r);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), c = e("9bf2").f, a = e("e893"), s = o.Symbol;
      if (r && typeof s == "function" && (!("description" in s.prototype) || s().description !== void 0)) {
        var l = {}, d = function() {
          var b = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), y = this instanceof d ? new s(b) : b === void 0 ? s() : s(b);
          return b === "" && (l[y] = !0), y;
        };
        a(d, s);
        var m = d.prototype = s.prototype;
        m.constructor = d;
        var p = m.toString, v = String(s("test")) == "Symbol(test)", g = /^Symbol\((.*)\)[^)]+$/;
        c(m, "description", { configurable: !0, get: function() {
          var b = u(this) ? this.valueOf() : this, y = p.call(b);
          if (t(l, b)) return "";
          var j = v ? y.slice(7, -1) : y.replace(g, "$1");
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
      var n, r, o, t, u = e("23e7"), c = e("c430"), a = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), m = e("e2cc"), p = e("d44e"), v = e("2626"), g = e("861d"), b = e("1c0b"), y = e("19aa"), j = e("8925"), E = e("2266"), w = e("1c7e"), S = e("4840"), h = e("2cf4").set, O = e("b575"), _ = e("cdf9"), C = e("44de"), k = e("f069"), D = e("e667"), F = e("69f3"), q = e("94ca"), M = e("b622"), $ = e("605d"), ce = e("2d00"), ne = M("species"), T = "Promise", L = F.get, G = F.set, J = F.getterFor(T), V = l, ye = a.TypeError, pe = a.document, Le = a.process, je = s("fetch"), Pe = k.f, Se = Pe, Ee = !!(pe && pe.createEvent && a.dispatchEvent), Fe = typeof PromiseRejectionEvent == "function", He = "unhandledrejection", B = "rejectionhandled", R = 0, X = 1, W = 2, ee = 1, ie = 2, Y = q(T, function() {
        var Q = j(V) !== String(V);
        if (!Q && (ce === 66 || !$ && !Fe) || c && !V.prototype.finally) return !0;
        if (ce >= 51 && /native code/.test(V)) return !1;
        var ae = V.resolve(1), fe = function(z) {
          z(function() {
          }, function() {
          });
        }, ve = ae.constructor = {};
        return ve[ne] = fe, !(ae.then(function() {
        }) instanceof fe);
      }), I = Y || !w(function(Q) {
        V.all(Q).catch(function() {
        });
      }), K = function(Q) {
        var ae;
        return !(!g(Q) || typeof (ae = Q.then) != "function") && ae;
      }, me = function(Q, ae) {
        if (!Q.notified) {
          Q.notified = !0;
          var fe = Q.reactions;
          O(function() {
            for (var ve = Q.value, z = Q.state == X, te = 0; fe.length > te; ) {
              var se, he, Me, qe = fe[te++], Ze = z ? qe.ok : qe.fail, we = qe.resolve, et = qe.reject, Qe = qe.domain;
              try {
                Ze ? (z || (Q.rejection === ie && We(Q), Q.rejection = ee), Ze === !0 ? se = ve : (Qe && Qe.enter(), se = Ze(ve), Qe && (Qe.exit(), Me = !0)), se === qe.promise ? et(ye("Promise-chain cycle")) : (he = K(se)) ? he.call(se, we, et) : we(se)) : et(ve);
              } catch (gt) {
                Qe && !Me && Qe.exit(), et(gt);
              }
            }
            Q.reactions = [], Q.notified = !1, ae && !Q.rejection && Be(Q);
          });
        }
      }, ke = function(Q, ae, fe) {
        var ve, z;
        Ee ? (ve = pe.createEvent("Event"), ve.promise = ae, ve.reason = fe, ve.initEvent(Q, !1, !0), a.dispatchEvent(ve)) : ve = { promise: ae, reason: fe }, !Fe && (z = a["on" + Q]) ? z(ve) : Q === He && C("Unhandled promise rejection", fe);
      }, Be = function(Q) {
        h.call(a, function() {
          var ae, fe = Q.facade, ve = Q.value, z = Oe(Q);
          if (z && (ae = D(function() {
            $ ? Le.emit("unhandledRejection", ve, fe) : ke(He, fe, ve);
          }), Q.rejection = $ || Oe(Q) ? ie : ee, ae.error)) throw ae.value;
        });
      }, Oe = function(Q) {
        return Q.rejection !== ee && !Q.parent;
      }, We = function(Q) {
        h.call(a, function() {
          var ae = Q.facade;
          $ ? Le.emit("rejectionHandled", ae) : ke(B, ae, Q.value);
        });
      }, Ge = function(Q, ae, fe) {
        return function(ve) {
          Q(ae, ve, fe);
        };
      }, Je = function(Q, ae, fe) {
        Q.done || (Q.done = !0, fe && (Q = fe), Q.value = ae, Q.state = W, me(Q, !0));
      }, nt = function(Q, ae, fe) {
        if (!Q.done) {
          Q.done = !0, fe && (Q = fe);
          try {
            if (Q.facade === ae) throw ye("Promise can't be resolved itself");
            var ve = K(ae);
            ve ? O(function() {
              var z = { done: !1 };
              try {
                ve.call(ae, Ge(nt, z, Q), Ge(Je, z, Q));
              } catch (te) {
                Je(z, te, Q);
              }
            }) : (Q.value = ae, Q.state = X, me(Q, !1));
          } catch (z) {
            Je({ done: !1 }, z, Q);
          }
        }
      };
      Y && (V = function(Q) {
        y(this, V, T), b(Q), n.call(this);
        var ae = L(this);
        try {
          Q(Ge(nt, ae), Ge(Je, ae));
        } catch (fe) {
          Je(ae, fe);
        }
      }, n = function(Q) {
        G(this, { type: T, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: R, value: void 0 });
      }, n.prototype = m(V.prototype, { then: function(Q, ae) {
        var fe = J(this), ve = Pe(S(this, V));
        return ve.ok = typeof Q != "function" || Q, ve.fail = typeof ae == "function" && ae, ve.domain = $ ? Le.domain : void 0, fe.parent = !0, fe.reactions.push(ve), fe.state != R && me(fe, !1), ve.promise;
      }, catch: function(Q) {
        return this.then(void 0, Q);
      } }), r = function() {
        var Q = new n(), ae = L(Q);
        this.promise = Q, this.resolve = Ge(nt, ae), this.reject = Ge(Je, ae);
      }, k.f = Pe = function(Q) {
        return Q === V || Q === o ? new r(Q) : Se(Q);
      }, c || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(Q, ae) {
        var fe = this;
        return new V(function(ve, z) {
          t.call(fe, ve, z);
        }).then(Q, ae);
      }, { unsafe: !0 }), typeof je == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(Q) {
        return _(V, je.apply(a, arguments));
      } }))), u({ global: !0, wrap: !0, forced: Y }, { Promise: V }), p(V, T, !1, !0), v(T), o = s(T), u({ target: T, stat: !0, forced: Y }, { reject: function(Q) {
        var ae = Pe(this);
        return ae.reject.call(void 0, Q), ae.promise;
      } }), u({ target: T, stat: !0, forced: c || Y }, { resolve: function(Q) {
        return _(c && this === o ? V : this, Q);
      } }), u({ target: T, stat: !0, forced: I }, { all: function(Q) {
        var ae = this, fe = Pe(ae), ve = fe.resolve, z = fe.reject, te = D(function() {
          var se = b(ae.resolve), he = [], Me = 0, qe = 1;
          E(Q, function(Ze) {
            var we = Me++, et = !1;
            he.push(void 0), qe++, se.call(ae, Ze).then(function(Qe) {
              et || (et = !0, he[we] = Qe, --qe || ve(he));
            }, z);
          }), --qe || ve(he);
        });
        return te.error && z(te.value), fe.promise;
      }, race: function(Q) {
        var ae = this, fe = Pe(ae), ve = fe.reject, z = D(function() {
          var te = b(ae.resolve);
          E(Q, function(se) {
            te.call(ae, se).then(fe.resolve, ve);
          });
        });
        return z.error && ve(z.value), fe.promise;
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
      }, m = function(b, y) {
        if (!r(b)) return typeof b == "symbol" ? b : (typeof b == "string" ? "S" : "P") + b;
        if (!o(b, a)) {
          if (!l(b)) return "F";
          if (!y) return "E";
          d(b);
        }
        return b[a].objectID;
      }, p = function(b, y) {
        if (!o(b, a)) {
          if (!l(b)) return !0;
          if (!y) return !1;
          d(b);
        }
        return b[a].weakData;
      }, v = function(b) {
        return c && g.REQUIRED && l(b) && !o(b, a) && d(b), b;
      }, g = i.exports = { REQUIRED: !1, fastKey: m, getWeakData: p, onFreeze: v };
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
      function a(x, U, N, P, H, ue) {
        var de = Object(t.resolveComponent)("Result"), le = Object(t.resolveComponent)("DefaultBoard"), ge = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Ue = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: U[1] || (U[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(de, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ge, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Ue]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(x, U, N) {
        return U in x ? Object.defineProperty(x, U, { value: N, enumerable: !0, configurable: !0, writable: !0 }) : x[U] = N, x;
      }
      function l(x, U) {
        var N = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var P = Object.getOwnPropertySymbols(x);
          U && (P = P.filter(function(H) {
            return Object.getOwnPropertyDescriptor(x, H).enumerable;
          })), N.push.apply(N, P);
        }
        return N;
      }
      function d(x) {
        for (var U = 1; U < arguments.length; U++) {
          var N = arguments[U] != null ? arguments[U] : {};
          U % 2 ? l(Object(N), !0).forEach(function(P) {
            s(x, P, N[P]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(N)) : l(Object(N)).forEach(function(P) {
            Object.defineProperty(x, P, Object.getOwnPropertyDescriptor(N, P));
          });
        }
        return x;
      }
      function m(x, U) {
        (U == null || U > x.length) && (U = x.length);
        for (var N = 0, P = new Array(U); N < U; N++) P[N] = x[N];
        return P;
      }
      function p(x) {
        if (Array.isArray(x)) return m(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function g(x, U) {
        if (x) {
          if (typeof x == "string") return m(x, U);
          var N = Object.prototype.toString.call(x).slice(8, -1);
          return N === "Object" && x.constructor && (N = x.constructor.name), N === "Map" || N === "Set" ? Array.from(x) : N === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(N) ? m(x, U) : void 0;
        }
      }
      function b() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function y(x) {
        return p(x) || v(x) || g(x) || b();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function j(x, U) {
        if (!(x instanceof U)) throw new TypeError("Cannot call a class as a function");
      }
      function E(x, U) {
        for (var N = 0; N < U.length; N++) {
          var P = U[N];
          P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(x, P.key, P);
        }
      }
      function w(x, U, N) {
        return U && E(x.prototype, U), x;
      }
      var S = function() {
        function x() {
          j(this, x), this.listeners = {};
        }
        return w(x, [{ key: "on", value: function(U, N) {
          var P = this, H = this.listeners[U];
          return H || (H = []), H.push(N), this.listeners[U] = H, function() {
            P.remove(U, N);
          };
        } }, { key: "emit", value: function(U) {
          var N = this.listeners[U];
          if (Array.isArray(N)) {
            for (var P = arguments.length, H = new Array(P > 1 ? P - 1 : 0), ue = 1; ue < P; ue++) H[ue - 1] = arguments[ue];
            for (var de = 0; de < N.length; de++) {
              var le = N[de];
              typeof le == "function" && le.apply(void 0, H);
            }
          }
        } }, { key: "remove", value: function(U, N) {
          if (N) {
            var P = this.listeners[U];
            if (!P) return;
            P = P.filter(function(H) {
              return H !== N;
            }), this.listeners[U] = P;
          } else this.listeners[U] = null, delete this.listeners[U];
        } }]), x;
      }(), h = new S(), O = { mounted: function(x, U, N) {
        var P = x.parentNode;
        x.onmousedown = function(H) {
          var ue = H.clientX - P.offsetLeft, de = H.clientY - P.offsetTop;
          document.onmousemove = function(le) {
            var ge = le.clientX - ue, Re = le.clientY - de;
            P.style.left = ge + "px", P.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              h.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(H) {
          var ue = H.touches[0].pageX, de = H.touches[0].pageY, le = ue - P.offsetLeft, ge = de - P.offsetTop;
          document.ontouchmove = function(Re) {
            var Ue = Re.touches[0].pageX, Ve = Re.touches[0].pageY, ze = Ue - le, lt = Ve - ge;
            P.style.left = ze + "px", P.style.top = lt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              h.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, _ = O, C = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var k = { key: 0, class: "key-board-code-show" }, D = { class: "key-board-result-show" }, F = { class: "key-board-result-show-container" }, q = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var M = C(function(x, U, N, P, H, ue) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", k, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", D, [Object(t.createVNode)("div", F, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(de, le) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: le, onClick: function(ge) {
            return x.selectWord(de);
          } }, Object(t.toDisplayString)(le + 1) + "." + Object(t.toDisplayString)(de), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", q, [Object(t.createVNode)("span", { style: x.getStyle, onClick: U[1] || (U[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: U[2] || (U[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), $ = (e("1276"), e("6062"), e("5319"), function(x, U) {
        for (var N = 0, P = []; N < x.length; ) P.push(x.slice(N, N += U));
        return P;
      }), ce = Symbol("KEYBOARD_CONTEXT"), ne = function(x) {
        Object(t.provide)(ce, x);
      }, T = function() {
        return Object(t.inject)(ce);
      }, L = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, U) {
        var N = U.emit, P = T(), H = Object(t.computed)(function() {
          return { borderTopColor: P == null ? void 0 : P.color };
        }), ue = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function de() {
          ue.showIndex !== 0 && (ue.showIndex -= 1);
        }
        function le() {
          ue.showIndex !== ue.showList.length - 1 && (ue.showIndex += 1);
        }
        function ge() {
          ue.showIndex = 0, ue.showList = [], ue.valueList = [], h.emit("resultReset");
        }
        function Re(Ue) {
          ge(), N("change", Ue);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Ue) {
          var Ve;
          ue.showIndex = 0, ue.valueList = (Ue == null || (Ve = Ue.value) === null || Ve === void 0 ? void 0 : Ve.split("")) || [], ue.valueList.length !== 0 ? ue.showList = $(ue.valueList, 11) : ue.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          h.on("keyBoardChange", function(Ue) {
            h.emit("updateBound"), ue.status = Ue, ge();
          }), h.on("getWordsFromServer", function(Ue) {
            var Ve = Array.from(new Set(Ue.replace(/\s+/g, "").split("")));
            ue.valueList = Ve, ue.showList = $(Ve, 11);
          });
        }), Object(t.onUnmounted)(function() {
          h.remove("keyBoardChange"), h.remove("getWordsFromServer");
        }), d({ color: P == null ? void 0 : P.color, upper: de, lower: le, getStyle: H, selectWord: Re }, Object(t.toRefs)(ue));
      } });
      e("e66c"), L.render = M, L.__scopeId = "data-v-02e63132";
      var G = L, J = e("bc3a"), V = e.n(J), ye = 15e3, pe = function(x) {
        V.a.defaults.baseURL = x, V.a.defaults.timeout = ye, V.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Le(x, U, N, P, H, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var je = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var U = T(), N = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: U == null ? void 0 : U.color, iconName: N };
      } });
      e("38cd"), je.render = Le;
      var Pe = je, Se = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Ee = { class: "hand-write-board" }, Fe = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var He = Se(function(x, U, N, P, H, ue) {
        var de = Object(t.resolveComponent)("PaintBoard"), le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ee, [Object(t.createVNode)(de, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Fe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(ge) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ge.type, type: ge.type, data: ge.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), B = { class: "paint-board" };
      function R(x, U, N, P, H, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", B, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: U[1] || (U[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: U[2] || (U[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: U[3] || (U[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: U[4] || (U[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: U[5] || (U[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: U[6] || (U[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: U[7] || (U[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function X(x, U, N, P, H, ue, de) {
        try {
          var le = x[ue](de), ge = le.value;
        } catch (Re) {
          return void N(Re);
        }
        le.done ? U(ge) : Promise.resolve(ge).then(P, H);
      }
      function W(x) {
        return function() {
          var U = this, N = arguments;
          return new Promise(function(P, H) {
            var ue = x.apply(U, N);
            function de(ge) {
              X(ue, P, H, de, le, "next", ge);
            }
            function le(ge) {
              X(ue, P, H, de, le, "throw", ge);
            }
            de(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var ee, ie, Y = function() {
        var x = W(regeneratorRuntime.mark(function U(N, P, H, ue) {
          return regeneratorRuntime.wrap(function(de) {
            for (; ; ) switch (de.prev = de.next) {
              case 0:
                return de.next = 2, V.a.post("", { lib: ue, lpXis: N, lpYis: P, lpCis: H });
              case 2:
                return de.abrupt("return", de.sent);
              case 3:
              case "end":
                return de.stop();
            }
          }, U);
        }));
        return function(U, N, P, H) {
          return x.apply(this, arguments);
        };
      }(), I = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var U = T(), N = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), P = Object(t.ref)(null);
        function H() {
          return ue.apply(this, arguments);
        }
        function ue() {
          return ue = W(regeneratorRuntime.mark(function Ce() {
            var Ke, $e;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, Y(N.clickX, N.clickY, N.clickC, x.lib);
                case 2:
                  Ke = Ye.sent, $e = Ke.data, h.emit("getWordsFromServer", ($e == null ? void 0 : $e.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ce);
          })), ue.apply(this, arguments);
        }
        function de() {
          P.value && ee && (N.clickX = [], N.clickY = [], N.clickC = [], ee.clearRect(0, 0, N.width, N.height));
        }
        function le(Ce) {
          if (Ce.type.includes("mouse")) {
            var Ke = Ce;
            return Math.floor(Ke.clientX - N.x);
          }
          if (Ce.type.includes("touch")) {
            var $e, Ye = Ce;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientX) - N.x);
          }
          return 0;
        }
        function ge(Ce) {
          if (Ce.type.includes("mouse")) {
            var Ke = Ce;
            return Math.floor(Ke.clientY - N.y);
          }
          if (Ce.type.includes("touch")) {
            var $e, Ye = Ce;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientY) - N.y);
          }
          return 0;
        }
        function Re(Ce) {
          if (ee) {
            N.isMouseDown = !0;
            var Ke = le(Ce), $e = ge(Ce);
            clearTimeout(ie), N.oldX = Ke, N.oldY = $e, ee.beginPath();
          }
        }
        function Ue(Ce) {
          if (ee && (Ce.preventDefault(), N.isMouseDown)) {
            var Ke = le(Ce), $e = ge(Ce);
            N.clickX.push(Ke), N.clickY.push($e), N.clickC.push(0), ee.strokeStyle = U == null ? void 0 : U.color, ee.fillStyle = U == null ? void 0 : U.color, ee.lineWidth = 4, ee.lineCap = "round", ee.moveTo(N.oldX, N.oldY), ee.lineTo(Ke, $e), ee.stroke(), N.oldX = Ke, N.oldY = $e;
          }
        }
        function Ve() {
          N.isMouseDown && (N.isMouseDown = !1, ie = setTimeout(function() {
            de();
          }, 1500), N.clickC.pop(), N.clickC.push(1), H());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ce = document.querySelector(".paint-board").getBoundingClientRect();
              N.x = Ce.x, N.y = Ce.y, N.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), N.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function lt() {
          var Ce;
          ee = (Ce = P.value) === null || Ce === void 0 ? void 0 : Ce.getContext("2d"), de(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          lt(), h.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), h.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(N)), {}, { move: Ue, down: Re, mouseup: Ve, canvasRef: P });
      } });
      I.render = R;
      var K = I;
      function me(x, U, N, P, H, ue) {
        var de = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: U[1] || (U[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: U[2] || (U[2] = function(le) {
          return x.isHoverStatus = !0;
        }), onMouseleave: U[3] || (U[3] = function(le) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ke = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Pe }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, U) {
        var N = U.emit, P = T(), H = Object(t.ref)(!1), ue = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), de = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || H.value ? { color: "#f5f5f5", background: P == null ? void 0 : P.color } : { color: P == null ? void 0 : P.color, background: "#f5f5f5" };
        });
        function le(ge) {
          ge.preventDefault(), N("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: H, getStyle: de, getCode: ue, click: le };
      } });
      e("de23"), ke.render = me;
      var Be = ke, Oe = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: K, KeyCodeButton: Be }, setup: function(x, U) {
        var N = U.emit, P = T(), H = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ue(de) {
          var le = de.data, ge = de.type;
          switch (ge) {
            case "close":
              P == null || P.closeKeyBoard();
              break;
            case "back":
              P == null || P.changeDefaultBoard(), h.emit("resultReset"), h.emit("keyBoardChange", H.isCn && "CN");
              break;
            case "change2lang":
              H.isCn = !H.isCn;
              break;
            case "delete":
              N("trigger", { data: le, type: ge });
              break;
          }
        }
        return d({ click: ue }, Object(t.toRefs)(H));
      } });
      e("9aaf"), Oe.render = He, Oe.__scopeId = "data-v-1b5e0983";
      var We = Oe, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Je = { class: "default-key-board" }, nt = { class: "line line4" };
      Object(t.popScopeId)();
      var Q = Ge(function(x, U, N, P, H, ue) {
        var de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Je, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(le, ge) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ge + 1)], key: ge }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(le, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(de, { isUpper: x.isUpper, key: Re, type: Re, data: Re, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", nt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(le) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: le.type, type: le.type, data: le.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ae = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, ve = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, z = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], te = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Be }, emits: ["translate", "trigger", "change"], setup: function(x, U) {
        var N = U.emit, P = T(), H = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ue() {
          var le;
          H.line4 = JSON.parse(JSON.stringify(z)), P != null && (le = P.modeList) !== null && le !== void 0 && le.find(function(ge) {
            return ge === "handwrite";
          }) && P !== null && P !== void 0 && P.handApi && H.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function de(le) {
          var ge = le.data, Re = le.type;
          switch (Re) {
            case "close":
              H.oldVal = "", P == null || P.closeKeyBoard();
              break;
            case "upper":
              H.oldVal = "", H.isUpper = !H.isUpper;
              break;
            case "change2lang":
              H.isCn = !H.isCn, H.isNum || H.isSymbol || h.emit("keyBoardChange", H.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (H.isNum = !H.isNum, H.isSymbol = !1, H.isNum) {
                var Ue;
                h.emit("keyBoardChange", "number");
                var Ve = JSON.parse(JSON.stringify(ve.line3));
                P != null && (Ue = P.modeList) !== null && Ue !== void 0 && Ue.find(function(ze) {
                  return ze === "symbol";
                }) || (Ve.shift(), Ve.unshift("+")), H.lineList = [ve.line1, ve.line2, Ve];
              } else h.emit("keyBoardChange", H.isCn ? "CN" : "EN"), H.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              H.isSymbol = !H.isSymbol, H.isSymbol ? (h.emit("keyBoardChange", "symbol"), H.lineList = [ae.line1, ae.line2, ae.line3]) : (h.emit("keyBoardChange", "number"), H.lineList = [ve.line1, ve.line2, ve.line3]);
              break;
            case "handwrite":
            case "delete":
              H.isCn && Re === "delete" && H.oldVal ? (H.oldVal = H.oldVal.substr(0, H.oldVal.length - 1), N("translate", H.oldVal)) : (Re === "handwrite" && h.emit("keyBoardChange", "handwrite"), N("trigger", { data: ge, type: Re }));
              break;
            default:
              !H.isCn || H.isNum || H.isSymbol ? N("change", ge) : (N("translate", H.oldVal + ge), H.oldVal = H.oldVal + ge);
              break;
          }
        }
        return ue(), Object(t.onMounted)(function() {
          h.on("resultReset", function() {
            H.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(H)), {}, { click: de });
      } });
      e("f8b0"), te.render = Q, te.__scopeId = "data-v-4b78e5a1";
      var se = te, he = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Me = e("ec57"), qe = function(x) {
        return x.keys().map(x);
      };
      qe(Me);
      var Ze = [], we = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: _ }, components: { Result: G, SvgIcon: Pe, HandBoard: We, DefaultBoard: se }, setup: function(x, U) {
        var N = U.emit, P = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), H = Object(t.ref)(null);
        function ue(xe) {
          var _e, Te;
          switch (Object(t.nextTick)(function() {
            h.emit("keyBoardChange", "CN");
          }), xe) {
            case "en":
              P.showMode = "default", Object(t.nextTick)(function() {
                var Ae;
                (Ae = H.value) === null || Ae === void 0 || Ae.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              P.showMode = "default", Object(t.nextTick)(function() {
                var Ae;
                (Ae = H.value) === null || Ae === void 0 || Ae.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (_e = x.modeList) !== null && _e !== void 0 && _e.find(function(Ae) {
                return Ae === "handwrite";
              }) && x.handApi ? (P.showMode = "handwrite", Object(t.nextTick)(function() {
                h.emit("keyBoardChange", "handwrite");
              })) : P.showMode = "default";
              break;
            case "symbol":
              P.showMode = "default", (Te = x.modeList) !== null && Te !== void 0 && Te.find(function(Ae) {
                return Ae === "symbol";
              }) && Object(t.nextTick)(function() {
                var Ae, tt;
                (Ae = H.value) === null || Ae === void 0 || Ae.click({ data: ".?123", type: "change2num" }), (tt = H.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              P.showMode = "default";
              break;
          }
        }
        function de(xe) {
          if (P.visible = !0, we = xe.target, ue(we.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var _e = document.querySelector(".key-board-modal");
            _e.style.display = "block";
          }
        }
        function le() {
          if (we && we.blur(), we = null, P.visible = !1, N("closed"), P.showMode = "default", P.resultVal = {}, document.querySelector(".key-board-modal")) {
            var xe = document.querySelector(".key-board-modal");
            xe.style.display = "none";
          }
        }
        function ge() {
          x.closeOnClickModal && le(), N("modalClick");
        }
        function Re() {
          var xe;
          if (document.querySelector(".key-board-modal")) {
            var _e;
            (_e = document.querySelector(".key-board-modal")) === null || _e === void 0 || _e.addEventListener("click", ge);
          } else {
            var Te = document.createElement("div");
            Te.className = "key-board-modal", Te.style.display = "none", (xe = document.querySelector("body")) === null || xe === void 0 || xe.appendChild(Te), Te.addEventListener("click", ge);
          }
        }
        function Ue() {
          x.handApi && pe(x.handApi), [].concat(y(document.querySelectorAll("input")), y(document.querySelectorAll("textarea"))).forEach(function(xe) {
            xe.getAttribute("data-mode") !== null && (Ze.push(xe), xe.addEventListener("focus", de), x.blurHide && xe.addEventListener("blur", le));
          });
        }
        function Ve(xe) {
          if (!we) return "";
          var _e = we, Te = _e.selectionStart, Ae = _e.selectionEnd;
          if (!Te || !Ae) return "";
          var tt = xe.substring(0, Te - 1) + xe.substring(Ae);
          return _e.value = tt, _e.focus(), _e.selectionStart = Te - 1, _e.selectionEnd = Te - 1, tt;
        }
        function ze(xe) {
          var _e = xe.type;
          switch (_e) {
            case "handwrite":
              P.showMode = "handwrite";
              break;
            case "delete":
              if (!we) return;
              var Te = Ve(we.value);
              we.value = Te, N("change", Te, we.getAttribute("data-prop") || we);
              break;
          }
        }
        function lt(xe, _e) {
          if (!we) return "";
          var Te = we, Ae = Te.selectionStart || 0, tt = Te.selectionEnd || 0, xt = xe.substring(0, Ae) + _e + xe.substring(tt);
          return Te.value = xt, Te.focus(), Te.selectionStart = Ae + _e.length, Te.selectionEnd = Ae + _e.length, xt;
        }
        function Ce(xe) {
          if (we) {
            var _e = lt(we.value, xe);
            we.value = _e, N("change", _e, we.getAttribute("data-prop") || we), N("keyChange", xe, we.getAttribute("data-prop") || we);
          }
        }
        function Ke(xe) {
          var _e = new RegExp("^".concat(xe, "\\w*")), Te = Object.keys(he).filter(function(Ae) {
            return _e.test(Ae);
          }).sort();
          P.resultVal = { code: xe, value: xe ? Te.length > 1 ? Te.reduce(function(Ae, tt) {
            return Ae + he[tt];
          }, "") : he[Te[0]] : "" }, we && N("keyChange", xe, we.getAttribute("data-prop") || we);
        }
        function $e() {
          Ue();
        }
        function Ye() {
          return we;
        }
        return Object(t.onMounted)(function() {
          x.modal && Re(), Ue(), h.on("resultReset", function() {
            P.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var xe;
          (xe = document.querySelector(".key-board-modal")) === null || xe === void 0 || xe.removeEventListener("click", ge), Ze.forEach(function(_e) {
            _e.removeEventListener("focus", de), _e.removeEventListener("blur", le);
          });
        }), ne(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          le();
        }, changeDefaultBoard: function() {
          P.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(P)), {}, { defaultBoardRef: H, getCurrentInput: Ye, translate: Ke, reSignUp: $e, trigger: ze, change: Ce });
      } });
      et.render = a;
      var Qe = et;
      Qe.install = function(x) {
        x.component(Qe.name, Qe);
      };
      var gt = Qe, At = gt;
      f.default = At;
    }, fb6a: function(i, f, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), c = e("fc6a"), a = e("8418"), s = e("b622"), l = e("1dde"), d = l("slice"), m = s("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !d }, { slice: function(g, b) {
        var y, j, E, w = c(this), S = u(w.length), h = t(g, S), O = t(b === void 0 ? S : b, S);
        if (o(w) && (y = w.constructor, typeof y != "function" || y !== Array && !o(y.prototype) ? r(y) && (y = y[m], y === null && (y = void 0)) : y = void 0, y === Array || y === void 0)) return p.call(w, h, O);
        for (j = new (y === void 0 ? Array : y)(v(O - h, 0)), E = 0; h < O; h++, E++) h in w && a(j, E, w[h]);
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
})(Tt);
var Jn = Tt.exports;
const Lt = /* @__PURE__ */ Xn(Jn);
It({
  components: { KeyBoard: Lt },
  setup() {
    function be(Z, oe) {
      console.log("change value ---->", Z), console.log("change input dom ---->", oe);
    }
    return {
      change: be
    };
  }
});
const Zn = { class: "wifi-component" }, er = { class: "row" }, tr = { class: "column" }, nr = { class: "column" }, rr = { class: "status" }, or = { class: "row" }, ir = { class: "column" }, ar = {
  __name: "WiFi",
  setup(be) {
    const Z = re("未连接"), oe = re(""), i = re(""), f = () => {
      alert("验证 WiFi: " + oe.value);
    }, e = () => {
      alert("连接到 WiFi: " + oe.value), Z.value = "已连接到 " + oe.value;
    }, n = (r, o) => {
      o.placeholder === "WiFi 名称" ? oe.value = r : o.placeholder === "WiFi 密码" && (i.value = r);
    };
    return (r, o) => (Ie(), Ne("div", Zn, [
      A("div", er, [
        A("div", tr, [
          pt(A("input", {
            "onUpdate:modelValue": o[0] || (o[0] = (t) => oe.value = t),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, oe.value]
          ])
        ]),
        A("div", nr, [
          A("div", rr, " WiFi 状态: " + De(Z.value), 1)
        ])
      ]),
      A("div", or, [
        A("div", ir, [
          pt(A("input", {
            "onUpdate:modelValue": o[1] || (o[1] = (t) => i.value = t),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, i.value]
          ])
        ]),
        A("div", { class: "column" }, [
          A("div", { class: "button-group" }, [
            A("button", { onClick: f }, "验证 WiFi"),
            A("button", { onClick: e }, "连接 WiFi")
          ])
        ])
      ]),
      Xe(Nt(Lt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: n,
        class: "scaled-keyboard"
      })
    ]));
  }
}, ur = /* @__PURE__ */ ot(ar, [["__scopeId", "data-v-38505ad0"]]), cr = {
  key: 0,
  class: "numeric-keyboard"
}, sr = { class: "keyboard" }, lr = { class: "current-value" }, fr = ["onClick"], dr = {
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
  setup(be, { emit: Z }) {
    const oe = be, i = Z, f = re([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = re("");
    st(() => oe.showKeyboard, (r) => {
      r && (e.value = oe.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (Ie(), Ne("div", cr, [
      A("div", sr, [
        A("div", lr, De(e.value), 1),
        (Ie(!0), Ne(at, null, ut(f.value, (t) => (Ie(), Ne("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ie(!0), Ne(at, null, ut(t, (u) => (Ie(), Ne("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, De(u), 11, fr))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, kt = /* @__PURE__ */ ot(dr, [["__scopeId", "data-v-2ccc1cb7"]]), pr = { class: "container" }, vr = { class: "column" }, hr = { class: "status-bar" }, gr = ["disabled"], mr = { class: "column" }, yr = {
  key: 0,
  class: "modal"
}, br = { class: "modal-content" }, wr = {
  __name: "Lock",
  setup(be) {
    const { sendToPyQt: Z } = rt(), oe = ht({
      isPyQtWebEngine: !1
    }), i = re("未激活"), f = re(0), e = re(""), n = re(""), r = re(!1), o = re(60);
    let t, u;
    const c = re(0), a = re(1), s = re(null), l = re(!1), d = re(!1), m = dt(() => i.value === "未激活" ? "设备状态: 未激活" : i.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${a.value} 次锁定 - 剩余时间: ${p.value}`), p = dt(() => {
      const q = Math.floor(f.value / 86400), M = Math.floor(f.value % (24 * 60 * 60) / (60 * 60)), $ = Math.floor(f.value % (60 * 60) / 60), ce = f.value % 60;
      return `${q}天 ${M.toString().padStart(2, "0")}:${$.toString().padStart(2, "0")}:${ce.toString().padStart(2, "0")}`;
    }), v = dt(() => i.value === "未激活" ? "按住以激活设备" : e.value);
    function g(q) {
      i.value === "未激活" && (q.target.setPointerCapture(q.pointerId), c.value = 0, u = setInterval(() => {
        c.value += 2, c.value >= 100 && (clearInterval(u), j());
      }, 30));
    }
    function b(q) {
      q.target.releasePointerCapture(q.pointerId), y();
    }
    function y() {
      clearInterval(u), c.value = 0;
    }
    function j() {
      Z("activate_device", {});
    }
    function E(q, M) {
      Z("Lock_set_response", { method: "activateDevice", args: { randomCode: q, time: M } }), i.value = "已激活", e.value = q, s.value = M, w();
    }
    function w() {
      S(), t = setInterval(() => {
        f.value > 0 ? S() : h();
      }, 1e3);
    }
    function S() {
      const q = Date.now(), M = s.value + o.value * 1e3;
      f.value = Math.max(0, Math.floor((M - q) / 1e3));
    }
    function h() {
      r.value = !0, clearInterval(t);
    }
    function O() {
      _(n.value);
    }
    function _(q) {
      Z("check_lock_password", {
        target: "attemptUnlock",
        password: q,
        lockCount: a.value,
        deviceRandomCode: e.value
      }), n.value = "";
    }
    function C() {
      i.value = "永久激活", r.value = !1, clearInterval(t);
    }
    function k() {
      r.value = !1, a.value++, t && clearInterval(t), w();
    }
    St(() => {
      clearInterval(t), clearInterval(u);
    }), ct(() => {
      if (oe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, oe.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: q } = rt();
        st(q, (M) => {
          if (M && M.type === "confirm_lock_password")
            try {
              const $ = JSON.parse(M.content);
              $.target === "attemptUnlock" && ($.result === "success" ? (r.value ? s.value = Date.now() : s.value = s.value + o.value * 1e3, Z("update_baseTime", s.value), k(), Z("Lock_set_response", { method: "extendLockTime", args: { baseTime: s.value } })) : $.result === "forever_success" ? (C(), Z("Lock_set_response", { method: "permanentUnlock", args: {} })) : (F("密钥错误"), Z("Lock_set_response", { method: "unlockFailed", args: {} })));
            } catch ($) {
              console.error("Failed to parse confirm lock password :", $);
            }
          else if (M && M.type === "device_activated")
            try {
              const $ = JSON.parse(M.content);
              E($.device_random_code, $.device_base_time);
            } catch ($) {
              console.error("Failed to parse device activation result:", $);
            }
          else if (M && M.type === "device_info")
            try {
              const $ = JSON.parse(M.content);
              i.value = $.device_status, e.value = $.device_random_code, a.value = $.device_lock_count, s.value = $.device_base_time, $.device_status === "已激活" ? w() : $.device_status === "永久激活" && C();
            } catch ($) {
              console.error("Failed to parse device status:", $);
            }
          else if (M && M.type === "Lock_init")
            D();
          else if (M && M.type === "Lock_set") {
            console.log("Lock_set:", M.content);
            const $ = JSON.parse(M.content);
            $.method === "requestActivation" ? j() : $.method === "attemptUnlock" && _($.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const D = () => {
      const q = {
        deviceStatus: i.value,
        timeToNextLock: f.value,
        deviceRandomCode: e.value,
        unlockKey: n.value,
        isLocked: r.value,
        lockInterval: o.value,
        lockCount: a.value,
        baseTime: s.value,
        progressWidth: c.value,
        showUnlockKeyboard: l.value,
        showModalUnlockKeyboard: d.value
      };
      console.log("Sending Lock initial state:", q), Z("Lock_init_response", q);
    };
    function F(q) {
      const M = document.createElement("div");
      M.className = "custom-toast", M.textContent = q, document.body.appendChild(M), setTimeout(() => {
        document.body.removeChild(M);
      }, 3e3);
    }
    return (q, M) => (Ie(), Ne("div", pr, [
      A("div", vr, [
        A("div", hr, De(m.value), 1),
        A("button", {
          class: "activation-button",
          onPointerdown: g,
          onPointerup: b,
          onPointercancel: y,
          onPointerleave: y,
          disabled: i.value !== "未激活"
        }, [
          wt(De(v.value) + " ", 1),
          A("div", {
            class: "progress-bar",
            style: _t({ width: c.value + "%" })
          }, null, 4)
        ], 40, gr)
      ]),
      A("div", mr, [
        pt(A("input", {
          "onUpdate:modelValue": M[0] || (M[0] = ($) => n.value = $),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: M[1] || (M[1] = ($) => l.value = !0)
        }, null, 544), [
          [vt, n.value]
        ]),
        A("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      r.value ? (Ie(), Ne("div", yr, [
        A("div", br, [
          M[8] || (M[8] = A("h3", null, "设备已锁定", -1)),
          A("h3", null, "第 " + De(a.value) + " 次锁定", 1),
          A("h3", null, "设备随机码: " + De(e.value), 1),
          pt(A("input", {
            "onUpdate:modelValue": M[2] || (M[2] = ($) => n.value = $),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: M[3] || (M[3] = ($) => d.value = !0)
          }, null, 544), [
            [vt, n.value]
          ]),
          A("button", {
            class: "unlock-button",
            onClick: O
          }, "解锁")
        ])
      ])) : ft("", !0),
      Xe(kt, {
        modelValue: n.value,
        "onUpdate:modelValue": M[4] || (M[4] = ($) => n.value = $),
        showKeyboard: l.value,
        "onUpdate:showKeyboard": M[5] || (M[5] = ($) => l.value = $)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Xe(kt, {
        modelValue: n.value,
        "onUpdate:modelValue": M[6] || (M[6] = ($) => n.value = $),
        showKeyboard: d.value,
        "onUpdate:showKeyboard": M[7] || (M[7] = ($) => d.value = $)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, xr = /* @__PURE__ */ ot(wr, [["__scopeId", "data-v-4fe75cf8"]]), kr = { class: "app-container" }, _r = {
  __name: "App",
  setup(be) {
    return Rt(), (Z, oe) => (Ie(), Ne("div", kr, [
      oe[0] || (oe[0] = A("h1", null, "涪特智能养护台车控制系统", -1)),
      Xe(yn),
      Xe(Gn),
      Xe(on),
      Xe(Wn),
      Xe(ur),
      Xe(xr)
    ]));
  }
};
export {
  _r as default
};
