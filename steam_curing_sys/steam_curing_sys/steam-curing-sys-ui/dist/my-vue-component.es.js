import Lt, { ref as oe, onMounted as ct, provide as mt, readonly as yt, inject as bt, watch as st, openBlock as Be, createElementBlock as Ie, createElementVNode as P, toDisplayString as Ve, Fragment as at, renderList as ut, normalizeClass as it, createCommentVNode as ft, reactive as ht, createVNode as Xe, computed as dt, createTextVNode as wt, normalizeStyle as St, defineComponent as Pt, withDirectives as pt, vModelText as vt, unref as Nt, onUnmounted as Bt } from "vue";
const Ot = Symbol(), _t = Symbol(), jt = Symbol();
function It(we, Y) {
  we && we.messageSignal ? we.messageSignal.connect((Z) => {
    try {
      const i = JSON.parse(Z);
      Y.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), Y.value = { type: "unknown", content: Z };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const we = oe(null), Y = oe(null), Z = oe("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      we.value = f, Y.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), It(Y.value, Z), Y.value && typeof Y.value.vueReady == "function" ? Y.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ct(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), mt(Ot, yt(we)), mt(_t, yt(Y)), mt(jt, yt(Z));
}
function rt() {
  const we = bt(Ot), Y = bt(_t), Z = bt(jt);
  return (!we || !Y || !Z) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: we,
    bridge: Y,
    message: Z,
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
const ot = (we, Y) => {
  const Z = we.__vccOpts || we;
  for (const [i, f] of Y)
    Z[i] = f;
  return Z;
}, Mt = {
  key: 0,
  class: "numeric-keyboard"
}, Ut = { class: "keyboard" }, $t = { class: "current-value" }, Ft = ["onClick"], Dt = {
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
  setup(we, { emit: Y }) {
    const Z = we, i = Y, f = oe([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = oe("");
    st(() => Z.showKeyboard, (r) => {
      r && (e.value = Z.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => we.showKeyboard ? (Be(), Ie("div", Mt, [
      P("div", Ut, [
        P("div", $t, Ve(e.value), 1),
        (Be(!0), Ie(at, null, ut(f.value, (t) => (Be(), Ie("div", {
          key: t.join(),
          class: "row"
        }, [
          (Be(!0), Ie(at, null, ut(t, (u) => (Be(), Ie("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, Ve(u), 11, Ft))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, Et = /* @__PURE__ */ ot(Dt, [["__scopeId", "data-v-541feda2"]]), Vt = { class: "settings-container" }, Wt = { class: "setting-group" }, qt = { class: "setting-item" }, zt = { class: "setting-controls" }, Qt = ["value"], Kt = { class: "setting-item" }, Ht = { class: "setting-controls" }, Gt = ["value"], Yt = { class: "setting-group" }, Xt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Zt = ["value"], en = { class: "setting-item" }, tn = { class: "setting-controls" }, nn = ["value"], rn = {
  __name: "SensorSettings",
  setup(we) {
    const { sendToPyQt: Y } = rt(), Z = ht({
      isPyQtWebEngine: !1
    }), i = oe(30), f = oe(10), e = oe(80), n = oe(20), r = oe(!1), o = oe(null), t = oe("");
    ct(() => {
      if (Z.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, Z.isPyQtWebEngine) {
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
        console.log("设置已更新:", m), Z.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), Y("updateLimitSettings", m)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (m) => {
      o.value = m, r.value = !0, t.value = m.startsWith("temp") ? m === "tempUpper" ? i.value : f.value : m === "humidityUpper" ? e.value : n.value;
    }, d = (m) => {
      const p = parseFloat(m);
      isNaN(p) || (o.value === "tempUpper" ? (i.value = p, c("upper")) : o.value === "tempLower" ? (f.value = p, c("lower")) : o.value === "humidityUpper" ? (e.value = p, a("upper")) : o.value === "humidityLower" && (n.value = p, a("lower"))), o.value = null;
    };
    return (m, p) => (Be(), Ie("div", Vt, [
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
              value: i.value,
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
  setup(we) {
    const Y = oe({ temperature: {}, humidity: {} }), { sendToPyQt: Z } = rt();
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
          else e && e.type === "get_sensor_data" && Z("update_remote_sensor_data", Y.value);
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
    return (f, e) => (Be(), Ie("div", an, [
      P("div", un, [
        e[0] || (e[0] = P("h2", null, "温度传感器", -1)),
        P("div", cn, [
          P("div", sn, [
            (Be(!0), Ie(at, null, ut(Y.value.temperature, (n, r) => (Be(), Ie("div", {
              key: r,
              class: "sensor-card"
            }, [
              P("div", ln, Ve(r), 1),
              P("div", fn, Ve(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      P("div", dn, [
        e[1] || (e[1] = P("h2", null, "湿度传感器", -1)),
        P("div", pn, [
          P("div", vn, [
            (Be(!0), Ie(at, null, ut(Y.value.humidity, (n, r) => (Be(), Ie("div", {
              key: r,
              class: "sensor-card"
            }, [
              P("div", hn, Ve(r), 1),
              P("div", gn, Ve(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ ot(mn, [["__scopeId", "data-v-4d55ddc2"]]), bn = { class: "integrated-control-system" }, wn = { class: "mode-controls" }, xn = ["disabled"], kn = ["disabled"], Sn = ["disabled"], On = ["disabled"], _n = { class: "systems-container" }, jn = { class: "steam-engine-control" }, En = { class: "control-panel" }, Cn = { class: "engine-status" }, Tn = { class: "engine left" }, An = ["disabled"], Ln = { class: "engine right" }, Pn = ["disabled"], Nn = { class: "sprinkler-system" }, Bn = { class: "controls" }, In = { class: "input-group" }, Rn = ["value"], Mn = { class: "input-group" }, Un = ["value"], $n = { class: "input-group" }, Fn = ["value"], Dn = { class: "visualization" }, Vn = ["onClick"], Wn = { class: "status" }, qn = {
  __name: "IntegratedControlSystem",
  setup(we) {
    const Y = oe(!1), Z = oe(!1), i = oe(5), f = oe(2), e = oe(10), n = oe(i.value), r = oe(f.value), o = oe(e.value), t = oe(i.value), u = oe(f.value), c = oe(e.value), a = oe(0), s = oe(""), l = oe(Array(12).fill(0)), d = oe(0), m = oe(!0), p = oe(!1), v = oe(!1), h = oe(null), b = oe(""), g = oe(!1), j = oe(15), E = oe(""), { sendToPyQt: y } = rt(), k = ht({
      isPyQtWebEngine: !1
    });
    ct(() => {
      if (k.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, k.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: he } = rt();
        st(he, (Q) => {
          if (Q && Q.type === "update_left_steam_status")
            Y.value = Q.content;
          else if (Q && Q.type === "update_right_steam_status")
            Z.value = Q.content;
          else if (Q && Q.type === "update_sprinkler_settings")
            try {
              const C = JSON.parse(Q.content);
              t.value = C.sprinkler_single_run_time, u.value = C.sprinkler_run_interval_time, c.value = C.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, console.log("Sprinkler Settings updated:", C);
            } catch (C) {
              console.error("Failed to parse sprinkler settings data:", C);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const w = dt(() => g.value ? `${E.value}，还需${j.value}秒` : m.value ? p.value ? s.value === "run" ? `喷头 ${a.value} 正在运行，剩余 ${d.value + 1} 秒` : s.value === "interval" ? `运行间隔中，剩余 ${d.value + 1} 秒` : s.value === "loop" ? `循环间隔中，剩余 ${d.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    let O, _;
    async function T(he) {
      g.value = !0, j.value = 15, E.value = he ? "正在切换到喷淋管" : "正在切换到喷雾机", y("controlSprinkler", { target: "switchToSprinkler", state: he });
      const Q = setInterval(() => {
        j.value--, j.value <= 0 && (clearInterval(Q), g.value = !1);
      }, 1e3);
      return new Promise((C) => {
        setTimeout(() => {
          g.value = !1, C();
        }, j.value * 1e3);
      });
    }
    async function S(he) {
      const Q = m.value;
      if (m.value = he === "auto", Q !== m.value)
        if (k.isPyQtWebEngine && y("controlSprinkler", { target: "setMode", mode: m.value ? "auto" : "manual" }), m.value) {
          Y.value && await M();
          const C = l.value.findIndex((U) => U === 100);
          C !== -1 && (l.value[C] = 0, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: C + 1, state: 0 })), y("controlSprinkler", { target: "tankWork", state: 0 }), await T(0);
        } else
          await z();
    }
    async function M() {
      k.isPyQtWebEngine && (y("setEngineState", { engine: "left", state: !Y.value }), y("setEngineState", { engine: "right", state: !Z.value }), Y.value = !Y.value, Z.value = !Z.value);
    }
    async function A() {
      const he = l.value.findIndex((Q) => Q === 100);
      k.isPyQtWebEngine && he === -1 && (Y.value ? y("controlSprinkler", { target: "tankWork", state: 0 }) : y("controlSprinkler", { target: "tankWork", state: 1 }), y("setEngineState", { engine: "left", state: !Y.value }), y("setEngineState", { engine: "right", state: !Z.value }), Y.value = !Y.value, Z.value = !Z.value);
    }
    function I(he) {
      h.value = he, v.value = !0, b.value = he === "singleRunTime" ? t.value.toString() : he === "runIntervalTime" ? u.value.toString() : c.value.toString();
    }
    function te(he) {
      const Q = parseInt(he);
      isNaN(Q) || (h.value === "singleRunTime" ? (t.value = Q, J()) : h.value === "runIntervalTime" ? (u.value = Q, ue()) : h.value === "loopInterval" && (c.value = Q, ee())), h.value = null;
    }
    function J() {
      t.value = Math.max(1, t.value), n.value = t.value, L();
    }
    function ue() {
      u.value = Math.max(0, u.value), r.value = u.value, L();
    }
    function ee() {
      c.value = Math.max(0, c.value), o.value = c.value, L();
    }
    function L() {
      if (k.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const he = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        y("controlSprinkler", { target: "settings", settings: JSON.stringify(he) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function N() {
      p.value || !m.value || (p.value = !0, l.value = Array(12).fill(0), await F());
    }
    async function z() {
      k.isPyQtWebEngine && (a.value > 0 && y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), y("controlSprinkler", { target: "setState", state: !1 })), Y.value && await M(), H(), y("controlSprinkler", { target: "tankWork", state: 0 }), await T(0);
    }
    function H() {
      p.value = !1, clearTimeout(O), clearInterval(_), a.value = 0, s.value = "", l.value = Array(12).fill(0), d.value = 0;
    }
    async function F() {
      a.value = 1, await T(1), y("controlSprinkler", { target: "tankWork", state: 1 }), Ee();
    }
    async function be() {
      a.value = 1, Ee();
    }
    function fe() {
      !p.value || !m.value || (d.value--, d.value > 0 && setTimeout(fe, 1e3));
    }
    function Ee() {
      if (!p.value || !m.value) return;
      s.value = "run", i.value = n.value, d.value = i.value, fe();
      let he = Date.now();
      y("controlSprinkler", { target: "manual", index: a.value, state: 1 }), _ = setInterval(() => {
        let Q = Date.now() - he, C = Math.min(Q / (i.value * 1e3), 1);
        l.value[a.value - 1] = C * 100;
      }, 100), O = setTimeout(async () => {
        clearInterval(_), a.value < 12 ? (y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), Ne()) : (y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), Re());
      }, i.value * 1e3);
    }
    function Ne() {
      !p.value || !m.value || (f.value = r.value, d.value = f.value, d.value > 0 && (s.value = "interval"), fe(), O = setTimeout(() => {
        a.value++, Ee();
      }, f.value * 1e3));
    }
    async function Re() {
      !p.value || !m.value || (e.value = o.value, d.value = e.value, d.value > 0 ? (y("controlSprinkler", { target: "tankWork", state: 0 }), await T(0), y("controlSprinkler", { target: "setState", state: !0 }), s.value = "loop", fe(), a.value = 0, O = setTimeout(async () => {
        l.value = Array(12).fill(0), y("controlSprinkler", { target: "setState", state: !1 }), Y.value && await M(), y("controlSprinkler", { target: "tankWork", state: 0 }), await F();
      }, e.value * 1e3)) : (a.value = 0, l.value = Array(12).fill(0), await be()));
    }
    function Ce(he) {
      return l.value[he - 1];
    }
    async function Te(he) {
      if (m.value) return;
      const Q = l.value.findIndex((C) => C === 100);
      l.value[he - 1] > 0 ? (l.value[he - 1] = 0, k.isPyQtWebEngine && (y("controlSprinkler", { target: "manual", index: he, state: 0 }), y("controlSprinkler", { target: "tankWork", state: 0 }), await T(0))) : Q !== -1 ? (l.value[Q] = 0, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: Q + 1, state: 0 }), l.value[he - 1] = 100, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: he, state: 1 })) : (await T(1), y("controlSprinkler", { target: "tankWork", state: 1 }), l.value[he - 1] = 100, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: he, state: 1 }));
    }
    return (he, Q) => (Be(), Ie("div", bn, [
      Q[15] || (Q[15] = P("h2", null, "集成控制系统", -1)),
      P("div", wn, [
        P("button", {
          onClick: Q[0] || (Q[0] = (C) => S("auto")),
          disabled: g.value,
          class: it([{ active: m.value }, "mode-btn"])
        }, "自动模式", 10, xn),
        P("button", {
          onClick: Q[1] || (Q[1] = (C) => S("manual")),
          disabled: g.value,
          class: it([{ active: !m.value }, "mode-btn"])
        }, "手动模式", 10, kn),
        P("button", {
          onClick: N,
          disabled: p.value || !m.value || g.value,
          class: "control-btn"
        }, "开始", 8, Sn),
        P("button", {
          onClick: z,
          disabled: !p.value || !m.value || g.value,
          class: "control-btn"
        }, "停止", 8, On)
      ]),
      P("div", _n, [
        P("div", jn, [
          Q[10] || (Q[10] = P("h3", null, "雾化机控制系统", -1)),
          P("div", En, [
            P("div", Cn, [
              P("div", Tn, [
                Q[7] || (Q[7] = P("h4", null, "左雾化机", -1)),
                P("div", {
                  class: it(["status", { on: Y.value }])
                }, [
                  Q[6] || (Q[6] = P("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + Ve(Y.value ? "开" : "关"), 1)
                ], 2),
                P("button", {
                  onClick: A,
                  disabled: m.value || g.value,
                  class: "control-btn"
                }, Ve(Y.value ? "关闭" : "开启"), 9, An)
              ]),
              P("div", Ln, [
                Q[9] || (Q[9] = P("h4", null, "右雾化机", -1)),
                P("div", {
                  class: it(["status", { on: Z.value }])
                }, [
                  Q[8] || (Q[8] = P("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + Ve(Z.value ? "开" : "关"), 1)
                ], 2),
                P("button", {
                  onClick: A,
                  disabled: m.value || g.value,
                  class: "control-btn"
                }, Ve(Z.value ? "关闭" : "开启"), 9, Pn)
              ])
            ])
          ])
        ]),
        P("div", Nn, [
          Q[14] || (Q[14] = P("h3", null, "喷淋系统", -1)),
          P("div", Bn, [
            P("div", In, [
              Q[11] || (Q[11] = P("label", null, "单次运行时间 (秒):", -1)),
              P("input", {
                type: "text",
                value: t.value,
                onFocus: Q[2] || (Q[2] = (C) => I("singleRunTime")),
                readonly: ""
              }, null, 40, Rn)
            ]),
            P("div", Mn, [
              Q[12] || (Q[12] = P("label", null, "运行时间间隔 (秒):", -1)),
              P("input", {
                type: "text",
                value: u.value,
                onFocus: Q[3] || (Q[3] = (C) => I("runIntervalTime")),
                readonly: ""
              }, null, 40, Un)
            ]),
            P("div", $n, [
              Q[13] || (Q[13] = P("label", null, "循环时间间隔 (秒):", -1)),
              P("input", {
                type: "text",
                value: c.value,
                onFocus: Q[4] || (Q[4] = (C) => I("loopInterval")),
                readonly: ""
              }, null, 40, Fn)
            ])
          ]),
          P("div", Dn, [
            (Be(), Ie(at, null, ut(12, (C) => P("div", {
              key: C,
              class: it(["sprinkler", { active: m.value ? a.value === C : l.value[C - 1] > 0 }]),
              onClick: (U) => !g.value && !m.value && !Y.value && Te(C)
            }, [
              P("div", {
                class: "water",
                style: St({ height: Ce(C) + "%" })
              }, null, 4),
              P("span", null, Ve(C), 1)
            ], 10, Vn)), 64))
          ]),
          P("div", Wn, Ve(w.value), 1)
        ])
      ]),
      Xe(Et, {
        modelValue: b.value,
        showKeyboard: v.value,
        "onUpdate:modelValue": te,
        "onUpdate:showKeyboard": Q[5] || (Q[5] = (C) => v.value = C)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, zn = /* @__PURE__ */ ot(qn, [["__scopeId", "data-v-bb337f88"]]), Qn = { class: "data-actions" }, Kn = {
  key: 0,
  class: "modal-overlay"
}, Hn = {
  key: 1,
  class: "modal-overlay"
}, Gn = { class: "modal-content" }, Yn = {
  __name: "DataExport",
  setup(we) {
    const { sendToPyQt: Y } = rt(), Z = ht({
      isPyQtWebEngine: !1
    }), i = oe(!1), f = oe(!1), e = oe("");
    ct(() => {
      Z.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, Z.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      Z.isPyQtWebEngine && (console.log("导出数据"), Y("exportData", !0));
    }, r = () => {
      i.value = !0;
    }, o = () => {
      i.value = !1;
    }, t = () => {
      console.log("清空数据"), i.value = !1, u("所有数据已清空！"), Z.isPyQtWebEngine && Y("exportData", !1);
    }, u = (a) => {
      e.value = a, f.value = !0;
    }, c = () => {
      f.value = !1;
    };
    return (a, s) => (Be(), Ie("div", Qn, [
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
      i.value ? (Be(), Ie("div", Kn, [
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
      f.value ? (Be(), Ie("div", Hn, [
        P("div", Gn, [
          P("p", null, Ve(e.value), 1),
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
function Zn(we) {
  return we && we.__esModule && Object.prototype.hasOwnProperty.call(we, "default") ? we.default : we;
}
var Ct = { exports: {} };
(function(we, Y) {
  (function(Z, i) {
    we.exports = i(Lt);
  })(typeof self < "u" ? self : Jn, function(Z) {
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
          for (var _, T, S, M = [], A = (y.ignoreCase ? "i" : "") + (y.multiline ? "m" : "") + (y.unicode ? "u" : "") + (y.sticky ? "y" : ""), I = 0, te = new RegExp(y.source, A + "g"); (_ = l.call(te, w)) && (T = te.lastIndex, !(T > I && (M.push(w.slice(I, _.index)), _.length > 1 && _.index < w.length && m.apply(M, _.slice(1)), S = _[0].length, I = T, M.length >= O))); )
            te.lastIndex === _.index && te.lastIndex++;
          return I === w.length ? !S && te.test("") || M.push("") : M.push(w.slice(I)), M.length > O ? M.slice(0, O) : M;
        } : "0".split(void 0, 0).length ? function(y, k) {
          return y === void 0 && k === 0 ? [] : g.call(this, y, k);
        } : g, [function(y, k) {
          var w = t(this), O = y == null ? void 0 : y[b];
          return O !== void 0 ? O.call(y, w, k) : E.call(String(w), y, k);
        }, function(y, k) {
          var w = j(E, y, this, k, E !== g);
          if (w.done) return w.value;
          var O = o(y), _ = String(this), T = u(O, RegExp), S = O.unicode, M = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (h ? "y" : "g"), A = new T(h ? O : "^(?:" + O.source + ")", M), I = k === void 0 ? v : k >>> 0;
          if (I === 0) return [];
          if (_.length === 0) return s(A, _) === null ? [_] : [];
          for (var te = 0, J = 0, ue = []; J < _.length; ) {
            A.lastIndex = h ? J : 0;
            var ee, L = s(A, h ? _ : _.slice(J));
            if (L === null || (ee = p(a(A.lastIndex + (h ? 0 : J)), _.length)) === te) J = c(_, J, S);
            else {
              if (ue.push(_.slice(te, J)), ue.length === I) return ue;
              for (var N = 1; N <= L.length - 1; N++) if (ue.push(L[N]), ue.length === I) return ue;
              J = te = ee;
            }
          }
          return ue.push(_.slice(te)), ue;
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
          function r(C, U) {
            return U = { exports: {} }, C(U, U.exports), U.exports;
          }
          var o = r(function(C, U) {
            (function(K, D) {
              C.exports = D();
            })(0, function() {
              function K(ce) {
                var ke = ce && typeof ce == "object";
                return ke && Object.prototype.toString.call(ce) !== "[object RegExp]" && Object.prototype.toString.call(ce) !== "[object Date]";
              }
              function D(ce) {
                return Array.isArray(ce) ? [] : {};
              }
              function G(ce, ke) {
                var Oe = ke && ke.clone === !0;
                return Oe && K(ce) ? me(D(ce), ce, ke) : ce;
              }
              function re(ce, ke, Oe) {
                var Me = ce.slice();
                return ke.forEach(function(je, qe) {
                  typeof Me[qe] > "u" ? Me[qe] = G(je, Oe) : K(je) ? Me[qe] = me(ce[qe], je, Oe) : ce.indexOf(je) === -1 && Me.push(G(je, Oe));
                }), Me;
              }
              function ye(ce, ke, Oe) {
                var Me = {};
                return K(ce) && Object.keys(ce).forEach(function(je) {
                  Me[je] = G(ce[je], Oe);
                }), Object.keys(ke).forEach(function(je) {
                  K(ke[je]) && ce[je] ? Me[je] = me(ce[je], ke[je], Oe) : Me[je] = G(ke[je], Oe);
                }), Me;
              }
              function me(ce, ke, Oe) {
                var Me = Array.isArray(ke), je = Oe || { arrayMerge: re }, qe = je.arrayMerge || re;
                return Me ? Array.isArray(ce) ? qe(ce, ke, Oe) : G(ke, Oe) : ye(ce, ke, Oe);
              }
              return me.all = function(ce, ke) {
                if (!Array.isArray(ce) || ce.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ce.reduce(function(Oe, Me) {
                  return me(Oe, Me, ke);
                });
              }, me;
            });
          });
          function t(C) {
            return C = C || /* @__PURE__ */ Object.create(null), { on: function(U, K) {
              (C[U] || (C[U] = [])).push(K);
            }, off: function(U, K) {
              C[U] && C[U].splice(C[U].indexOf(K) >>> 0, 1);
            }, emit: function(U, K) {
              (C[U] || []).map(function(D) {
                D(K);
              }), (C["*"] || []).map(function(D) {
                D(U, K);
              });
            } };
          }
          var u = r(function(C, U) {
            var K = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            U.default = K, C.exports = U.default;
          }), c = function(C) {
            return Object.keys(C).map(function(U) {
              var K = C[U].toString().replace(/"/g, "&quot;");
              return U + '="' + K + '"';
            }).join(" ");
          }, a = u.svg, s = u.xlink, l = {};
          l[a.name] = a.uri, l[s.name] = s.uri;
          var d, m = function(C, U) {
            C === void 0 && (C = "");
            var K = o(l, U || {}), D = c(K);
            return "<svg " + D + ">" + C + "</svg>";
          }, p = u.svg, v = u.xlink, h = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[p.name] = p.uri, d[v.name] = v.uri, d) }, b = function(C) {
            this.config = o(h, C || {}), this.symbols = [];
          };
          b.prototype.add = function(C) {
            var U = this, K = U.symbols, D = this.find(C.id);
            return D ? (K[K.indexOf(D)] = C, !1) : (K.push(C), !0);
          }, b.prototype.remove = function(C) {
            var U = this, K = U.symbols, D = this.find(C);
            return !!D && (K.splice(K.indexOf(D), 1), D.destroy(), !0);
          }, b.prototype.find = function(C) {
            return this.symbols.filter(function(U) {
              return U.id === C;
            })[0] || null;
          }, b.prototype.has = function(C) {
            return this.find(C) !== null;
          }, b.prototype.stringify = function() {
            var C = this.config, U = C.attrs, K = this.symbols.map(function(D) {
              return D.stringify();
            }).join("");
            return m(K, U);
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            this.symbols.forEach(function(C) {
              return C.destroy();
            });
          };
          var g = function(C) {
            var U = C.id, K = C.viewBox, D = C.content;
            this.id = U, this.viewBox = K, this.content = D;
          };
          g.prototype.stringify = function() {
            return this.content;
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            var C = this;
            ["id", "viewBox", "content"].forEach(function(U) {
              return delete C[U];
            });
          };
          var j = function(C) {
            var U = !!document.importNode, K = new DOMParser().parseFromString(C, "image/svg+xml").documentElement;
            return U ? document.importNode(K, !0) : K;
          }, E = function(C) {
            function U() {
              C.apply(this, arguments);
            }
            C && (U.__proto__ = C), U.prototype = Object.create(C && C.prototype), U.prototype.constructor = U;
            var K = { isMounted: {} };
            return K.isMounted.get = function() {
              return !!this.node;
            }, U.createFromExistingNode = function(D) {
              return new U({ id: D.getAttribute("id"), viewBox: D.getAttribute("viewBox"), content: D.outerHTML });
            }, U.prototype.destroy = function() {
              this.isMounted && this.unmount(), C.prototype.destroy.call(this);
            }, U.prototype.mount = function(D) {
              if (this.isMounted) return this.node;
              var G = typeof D == "string" ? document.querySelector(D) : D, re = this.render();
              return this.node = re, G.appendChild(re), re;
            }, U.prototype.render = function() {
              var D = this.stringify();
              return j(m(D)).childNodes[0];
            }, U.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(U.prototype, K), U;
          }(g), y = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, k = function(C) {
            return Array.prototype.slice.call(C, 0);
          }, w = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, O = function(C, U) {
            var K = document.createEvent("CustomEvent");
            K.initCustomEvent(C, !1, !1, U), window.dispatchEvent(K);
          }, _ = function(C) {
            var U = [];
            return k(C.querySelectorAll("style")).forEach(function(K) {
              K.textContent += "", U.push(K);
            }), U;
          }, T = function(C) {
            return (C || window.location.href).split("#")[0];
          }, S = function(C) {
            angular.module("ng").run(["$rootScope", function(U) {
              U.$on("$locationChangeSuccess", function(K, D, G) {
                O(C, { oldUrl: G, newUrl: D });
              });
            }]);
          }, M = "linearGradient, radialGradient, pattern, mask, clipPath", A = function(C, U) {
            return U === void 0 && (U = M), k(C.querySelectorAll("symbol")).forEach(function(K) {
              k(K.querySelectorAll(U)).forEach(function(D) {
                K.parentNode.insertBefore(D, K);
              });
            }), C;
          };
          function I(C, U) {
            var K = k(C).reduce(function(D, G) {
              if (!G.attributes) return D;
              var re = k(G.attributes), ye = U ? re.filter(U) : re;
              return D.concat(ye);
            }, []);
            return K;
          }
          var te = u.xlink.uri, J = "xlink:href", ue = /[{}|\\\^\[\]`"<>]/g;
          function ee(C) {
            return C.replace(ue, function(U) {
              return "%" + U[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L(C) {
            return C.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function N(C, U, K) {
            return k(C).forEach(function(D) {
              var G = D.getAttribute(J);
              if (G && G.indexOf(U) === 0) {
                var re = G.replace(U, K);
                D.setAttributeNS(te, J, re);
              }
            }), C;
          }
          var z, H = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], F = H.map(function(C) {
            return "[" + C + "]";
          }).join(","), be = function(C, U, K, D) {
            var G = ee(K), re = ee(D), ye = C.querySelectorAll(F), me = I(ye, function(ce) {
              var ke = ce.localName, Oe = ce.value;
              return H.indexOf(ke) !== -1 && Oe.indexOf("url(" + G) !== -1;
            });
            me.forEach(function(ce) {
              return ce.value = ce.value.replace(new RegExp(L(G), "g"), re);
            }), N(U, G, re);
          }, fe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ee = function(C) {
            function U(D) {
              var G = this;
              D === void 0 && (D = {}), C.call(this, o(y, D));
              var re = t();
              this._emitter = re, this.node = null;
              var ye = this, me = ye.config;
              if (me.autoConfigure && this._autoConfigure(D), me.syncUrlsWithBaseTag) {
                var ce = document.getElementsByTagName("base")[0].getAttribute("href");
                re.on(fe.MOUNT, function() {
                  return G.updateUrls("#", ce);
                });
              }
              var ke = this._handleLocationChange.bind(this);
              this._handleLocationChange = ke, me.listenLocationChangeEvent && window.addEventListener(me.locationChangeEvent, ke), me.locationChangeAngularEmitter && S(me.locationChangeEvent), re.on(fe.MOUNT, function(Oe) {
                me.moveGradientsOutsideSymbol && A(Oe);
              }), re.on(fe.SYMBOL_MOUNT, function(Oe) {
                me.moveGradientsOutsideSymbol && A(Oe.parentNode), (w.isIE() || w.isEdge()) && _(Oe);
              });
            }
            C && (U.__proto__ = C), U.prototype = Object.create(C && C.prototype), U.prototype.constructor = U;
            var K = { isMounted: {} };
            return K.isMounted.get = function() {
              return !!this.node;
            }, U.prototype._autoConfigure = function(D) {
              var G = this, re = G.config;
              typeof D.syncUrlsWithBaseTag > "u" && (re.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof D.locationChangeAngularEmitter > "u" && (re.locationChangeAngularEmitter = typeof window.angular < "u"), typeof D.moveGradientsOutsideSymbol > "u" && (re.moveGradientsOutsideSymbol = w.isFirefox());
            }, U.prototype._handleLocationChange = function(D) {
              var G = D.detail, re = G.oldUrl, ye = G.newUrl;
              this.updateUrls(re, ye);
            }, U.prototype.add = function(D) {
              var G = this, re = C.prototype.add.call(this, D);
              return this.isMounted && re && (D.mount(G.node), this._emitter.emit(fe.SYMBOL_MOUNT, D.node)), re;
            }, U.prototype.attach = function(D) {
              var G = this, re = this;
              if (re.isMounted) return re.node;
              var ye = typeof D == "string" ? document.querySelector(D) : D;
              return re.node = ye, this.symbols.forEach(function(me) {
                me.mount(re.node), G._emitter.emit(fe.SYMBOL_MOUNT, me.node);
              }), k(ye.querySelectorAll("symbol")).forEach(function(me) {
                var ce = E.createFromExistingNode(me);
                ce.node = me, re.add(ce);
              }), this._emitter.emit(fe.MOUNT, ye), ye;
            }, U.prototype.destroy = function() {
              var D = this, G = D.config, re = D.symbols, ye = D._emitter;
              re.forEach(function(me) {
                return me.destroy();
              }), ye.off("*"), window.removeEventListener(G.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, U.prototype.mount = function(D, G) {
              D === void 0 && (D = this.config.mountTo), G === void 0 && (G = !1);
              var re = this;
              if (re.isMounted) return re.node;
              var ye = typeof D == "string" ? document.querySelector(D) : D, me = re.render();
              return this.node = me, G && ye.childNodes[0] ? ye.insertBefore(me, ye.childNodes[0]) : ye.appendChild(me), this._emitter.emit(fe.MOUNT, me), me;
            }, U.prototype.render = function() {
              return j(this.stringify());
            }, U.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, U.prototype.updateUrls = function(D, G) {
              if (!this.isMounted) return !1;
              var re = document.querySelectorAll(this.config.usagesToUpdate);
              return be(this.node, re, T(D) + "#", T(G) + "#"), !0;
            }, Object.defineProperties(U.prototype, K), U;
          }(b), Ne = r(function(C) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(U, K) {
              C.exports = K();
            })(0, function() {
              var U, K = [], D = document, G = D.documentElement.doScroll, re = "DOMContentLoaded", ye = (G ? /^loaded|^c/ : /^loaded|^i|^c/).test(D.readyState);
              return ye || D.addEventListener(re, U = function() {
                for (D.removeEventListener(re, U), ye = 1; U = K.shift(); ) U();
              }), function(me) {
                ye ? setTimeout(me, 0) : K.push(me);
              };
            });
          }), Re = "__SVG_SPRITE_NODE__", Ce = "__SVG_SPRITE__", Te = !!window[Ce];
          Te ? z = window[Ce] : (z = new Ee({ attrs: { id: Re, "aria-hidden": "true" } }), window[Ce] = z);
          var he = function() {
            var C = document.getElementById(Re);
            C ? z.attach(C) : z.mount(document.body, !0);
          };
          document.body ? he() : Ne(he);
          var Q = z;
          return Q;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), c = e("2a62"), a = function(s, l) {
        this.stopped = s, this.result = l;
      };
      i.exports = function(s, l, d) {
        var m, p, v, h, b, g, j, E = d && d.that, y = !(!d || !d.AS_ENTRIES), k = !(!d || !d.IS_ITERATOR), w = !(!d || !d.INTERRUPTED), O = t(l, E, 1 + y + w), _ = function(S) {
          return m && c(m), new a(!0, S);
        }, T = function(S) {
          return y ? (n(S), w ? O(S[0], S[1], _) : O(S[0], S[1])) : w ? O(S, _) : O(S);
        };
        if (k) m = s;
        else {
          if (p = u(s), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, h = o(s.length); h > v; v++) if (b = T(s[v]), b && b instanceof a) return b;
            return new a(!1);
          }
          m = p.call(s);
        }
        for (g = m.next; !(j = g.call(m)).done; ) {
          try {
            b = T(j.value);
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
      var n, r, o, t = e("da84"), u = e("d039"), c = e("0366"), a = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), m = t.location, p = t.setImmediate, v = t.clearImmediate, h = t.process, b = t.MessageChannel, g = t.Dispatch, j = 0, E = {}, y = "onreadystatechange", k = function(T) {
        if (E.hasOwnProperty(T)) {
          var S = E[T];
          delete E[T], S();
        }
      }, w = function(T) {
        return function() {
          k(T);
        };
      }, O = function(T) {
        k(T.data);
      }, _ = function(T) {
        t.postMessage(T + "", m.protocol + "//" + m.host);
      };
      p && v || (p = function(T) {
        for (var S = [], M = 1; arguments.length > M; ) S.push(arguments[M++]);
        return E[++j] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, S);
        }, n(j), j;
      }, v = function(T) {
        delete E[T];
      }, d ? n = function(T) {
        h.nextTick(w(T));
      } : g && g.now ? n = function(T) {
        g.now(w(T));
      } : b && !l ? (r = new b(), o = r.port2, r.port1.onmessage = O, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && m && m.protocol !== "file:" && !u(_) ? (n = _, t.addEventListener("message", O, !1)) : n = y in s("script") ? function(T) {
        a.appendChild(s("script"))[y] = function() {
          a.removeChild(this), k(T);
        };
      } : function(T) {
        setTimeout(w(T), 0);
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
        for (var _ = function(A, I) {
          var te, J = this instanceof _, ue = a(A), ee = I === void 0;
          if (!J && ue && A.constructor === _ && ee) return A;
          k ? ue && !ee && (A = A.source) : A instanceof _ && (ee && (I = s.call(A)), A = A.source), w && (te = !!I && I.indexOf("y") > -1, te && (I = I.replace(/y/g, "")));
          var L = t(k ? new g(A, I) : g(A, I), J ? this : j, _);
          return w && te && p(L, { sticky: te }), L;
        }, T = function(A) {
          A in _ || u(_, A, { configurable: !0, get: function() {
            return g[A];
          }, set: function(I) {
            g[A] = I;
          } });
        }, S = c(g), M = 0; S.length > M; ) T(S[M++]);
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
          var O = r(y), _ = String(this), T = typeof k == "function";
          T || (k = String(k));
          var S = O.global;
          if (S) {
            var M = O.unicode;
            O.lastIndex = 0;
          }
          for (var A = []; ; ) {
            var I = s(O, _);
            if (I === null || (A.push(I), !S)) break;
            var te = String(I[0]);
            te === "" && (O.lastIndex = c(_, o(O.lastIndex), M));
          }
          for (var J = "", ue = 0, ee = 0; ee < A.length; ee++) {
            I = A[ee];
            for (var L = String(I[0]), N = l(d(t(I.index), _.length), 0), z = [], H = 1; H < I.length; H++) z.push(m(I[H]));
            var F = I.groups;
            if (T) {
              var be = [L].concat(z, N, _);
              F !== void 0 && be.push(F);
              var fe = String(k.apply(void 0, be));
            } else fe = a(L, _, N, z, F, k);
            N >= ue && (J += _.slice(ue, N) + fe, ue = N + L.length);
          }
          return J + _.slice(ue);
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
        }), y = v(b), k = function(O, _, T) {
          var S, M, A = y(O), I = w(O, _);
          return I ? I.value = T : (A.last = I = { index: M = d(_, !0), key: _, value: T, previous: S = A.last, next: void 0, removed: !1 }, A.first || (A.first = I), S && (S.next = I), l ? A.size++ : O.size++, M !== "F" && (A.index[M] = I)), O;
        }, w = function(O, _) {
          var T, S = y(O), M = d(_);
          if (M !== "F") return S.index[M];
          for (T = S.first; T; T = T.next) if (T.key == _) return T;
        };
        return o(E.prototype, { clear: function() {
          for (var O = this, _ = y(O), T = _.index, S = _.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete T[S.index], S = S.next;
          _.first = _.last = void 0, l ? _.size = 0 : O.size = 0;
        }, delete: function(O) {
          var _ = this, T = y(_), S = w(_, O);
          if (S) {
            var M = S.next, A = S.previous;
            delete T.index[S.index], S.removed = !0, A && (A.next = M), M && (M.previous = A), T.first == S && (T.first = M), T.last == S && (T.last = A), l ? T.size-- : _.size--;
          }
          return !!S;
        }, forEach: function(O) {
          for (var _, T = y(this), S = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); _ = _ ? _.next : T.first; )
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
        var g = v.indexOf("Map") !== -1, j = v.indexOf("Weak") !== -1, E = g ? "set" : "add", y = r[v], k = y && y.prototype, w = y, O = {}, _ = function(J) {
          var ue = k[J];
          t(k, J, J == "add" ? function(ee) {
            return ue.call(this, ee === 0 ? 0 : ee), this;
          } : J == "delete" ? function(ee) {
            return !(j && !s(ee)) && ue.call(this, ee === 0 ? 0 : ee);
          } : J == "get" ? function(ee) {
            return j && !s(ee) ? void 0 : ue.call(this, ee === 0 ? 0 : ee);
          } : J == "has" ? function(ee) {
            return !(j && !s(ee)) && ue.call(this, ee === 0 ? 0 : ee);
          } : function(ee, L) {
            return ue.call(this, ee === 0 ? 0 : ee, L), this;
          });
        }, T = o(v, typeof y != "function" || !(j || k.forEach && !l(function() {
          new y().entries().next();
        })));
        if (T) w = b.getConstructor(h, v, g, E), u.REQUIRED = !0;
        else if (o(v, !0)) {
          var S = new w(), M = S[E](j ? {} : -0, 1) != S, A = l(function() {
            S.has(1);
          }), I = d(function(J) {
            new y(J);
          }), te = !j && l(function() {
            for (var J = new y(), ue = 5; ue--; ) J[E](ue, ue);
            return !J.has(-0);
          });
          I || (w = h(function(J, ue) {
            a(J, w, v);
            var ee = p(new y(), J, w);
            return ue != null && c(ue, ee[E], { that: ee, AS_ENTRIES: g }), ee;
          }), w.prototype = k, k.constructor = w), (A || te) && (_("delete"), _("has"), g && _("get")), (te || M) && _(E), j && k.clear && delete k.clear;
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
      i.exports = function(y, k, w, O, _, T, S) {
        r(w, k, O);
        var M, A, I, te = function(H) {
          if (H === _ && N) return N;
          if (!v && H in ee) return ee[H];
          switch (H) {
            case b:
              return function() {
                return new w(this, H);
              };
            case g:
              return function() {
                return new w(this, H);
              };
            case j:
              return function() {
                return new w(this, H);
              };
          }
          return function() {
            return new w(this);
          };
        }, J = k + " Iterator", ue = !1, ee = y.prototype, L = ee[h] || ee["@@iterator"] || _ && ee[_], N = !v && L || te(_), z = k == "Array" && ee.entries || L;
        if (z && (M = o(z.call(new y())), p !== Object.prototype && M.next && (l || o(M) === p || (t ? t(M, p) : typeof M[h] != "function" && c(M, h, E)), u(M, J, !0, !0), l && (d[J] = E))), _ == g && L && L.name !== g && (ue = !0, N = function() {
          return L.call(this);
        }), l && !S || ee[h] === N || c(ee, h, N), d[k] = N, _) if (A = { values: te(g), keys: T ? N : te(b), entries: te(j) }, S) for (I in A) (v || ue || !(I in ee)) && a(ee, I, A[I]);
        else n({ target: k, proto: !0, forced: v || ue }, A);
        return A;
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
      i.exports = Z;
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
          var g = Object.getPrototypeOf, j = g && g(g(ue([])));
          j && j !== r && o.call(j, u) && (b = j);
          var E = _.prototype = w.prototype = Object.create(b);
          O.prototype = E.constructor = _, _.constructor = O, _[a] = O.displayName = "GeneratorFunction", l.isGeneratorFunction = function(L) {
            var N = typeof L == "function" && L.constructor;
            return !!N && (N === O || (N.displayName || N.name) === "GeneratorFunction");
          }, l.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, _) : (L.__proto__ = _, a in L || (L[a] = "GeneratorFunction")), L.prototype = Object.create(E), L;
          }, l.awrap = function(L) {
            return { __await: L };
          }, T(S.prototype), S.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = S, l.async = function(L, N, z, H) {
            var F = new S(y(L, N, z, H));
            return l.isGeneratorFunction(N) ? F : F.next().then(function(be) {
              return be.done ? be.value : F.next();
            });
          }, T(E), E[a] = "Generator", E[u] = function() {
            return this;
          }, E.toString = function() {
            return "[object Generator]";
          }, l.keys = function(L) {
            var N = [];
            for (var z in L) N.push(z);
            return N.reverse(), function H() {
              for (; N.length; ) {
                var F = N.pop();
                if (F in L) return H.value = F, H.done = !1, H;
              }
              return H.done = !0, H;
            };
          }, l.values = ue, J.prototype = { constructor: J, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(te), !L) for (var N in this) N.charAt(0) === "t" && o.call(this, N) && !isNaN(+N.slice(1)) && (this[N] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], N = L.completion;
            if (N.type === "throw") throw N.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var N = this;
            function z(Ne, Re) {
              return be.type = "throw", be.arg = L, N.next = Ne, Re && (N.method = "next", N.arg = n), !!Re;
            }
            for (var H = this.tryEntries.length - 1; H >= 0; --H) {
              var F = this.tryEntries[H], be = F.completion;
              if (F.tryLoc === "root") return z("end");
              if (F.tryLoc <= this.prev) {
                var fe = o.call(F, "catchLoc"), Ee = o.call(F, "finallyLoc");
                if (fe && Ee) {
                  if (this.prev < F.catchLoc) return z(F.catchLoc, !0);
                  if (this.prev < F.finallyLoc) return z(F.finallyLoc);
                } else if (fe) {
                  if (this.prev < F.catchLoc) return z(F.catchLoc, !0);
                } else {
                  if (!Ee) throw new Error("try statement without catch or finally");
                  if (this.prev < F.finallyLoc) return z(F.finallyLoc);
                }
              }
            }
          }, abrupt: function(L, N) {
            for (var z = this.tryEntries.length - 1; z >= 0; --z) {
              var H = this.tryEntries[z];
              if (H.tryLoc <= this.prev && o.call(H, "finallyLoc") && this.prev < H.finallyLoc) {
                var F = H;
                break;
              }
            }
            F && (L === "break" || L === "continue") && F.tryLoc <= N && N <= F.finallyLoc && (F = null);
            var be = F ? F.completion : {};
            return be.type = L, be.arg = N, F ? (this.method = "next", this.next = F.finallyLoc, h) : this.complete(be);
          }, complete: function(L, N) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && N && (this.next = N), h;
          }, finish: function(L) {
            for (var N = this.tryEntries.length - 1; N >= 0; --N) {
              var z = this.tryEntries[N];
              if (z.finallyLoc === L) return this.complete(z.completion, z.afterLoc), te(z), h;
            }
          }, catch: function(L) {
            for (var N = this.tryEntries.length - 1; N >= 0; --N) {
              var z = this.tryEntries[N];
              if (z.tryLoc === L) {
                var H = z.completion;
                if (H.type === "throw") {
                  var F = H.arg;
                  te(z);
                }
                return F;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(L, N, z) {
            return this.delegate = { iterator: ue(L), resultName: N, nextLoc: z }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function y(L, N, z, H) {
          var F = N && N.prototype instanceof w ? N : w, be = Object.create(F.prototype), fe = new J(H || []);
          return be._invoke = M(L, z, fe), be;
        }
        function k(L, N, z) {
          try {
            return { type: "normal", arg: L.call(N, z) };
          } catch (H) {
            return { type: "throw", arg: H };
          }
        }
        function w() {
        }
        function O() {
        }
        function _() {
        }
        function T(L) {
          ["next", "throw", "return"].forEach(function(N) {
            L[N] = function(z) {
              return this._invoke(N, z);
            };
          });
        }
        function S(L) {
          function N(F, be, fe, Ee) {
            var Ne = k(L[F], L, be);
            if (Ne.type !== "throw") {
              var Re = Ne.arg, Ce = Re.value;
              return Ce && typeof Ce == "object" && o.call(Ce, "__await") ? Promise.resolve(Ce.__await).then(function(Te) {
                N("next", Te, fe, Ee);
              }, function(Te) {
                N("throw", Te, fe, Ee);
              }) : Promise.resolve(Ce).then(function(Te) {
                Re.value = Te, fe(Re);
              }, Ee);
            }
            Ee(Ne.arg);
          }
          var z;
          function H(F, be) {
            function fe() {
              return new Promise(function(Ee, Ne) {
                N(F, be, Ee, Ne);
              });
            }
            return z = z ? z.then(fe, fe) : fe();
          }
          this._invoke = H;
        }
        function M(L, N, z) {
          var H = d;
          return function(F, be) {
            if (H === p) throw new Error("Generator is already running");
            if (H === v) {
              if (F === "throw") throw be;
              return ee();
            }
            for (z.method = F, z.arg = be; ; ) {
              var fe = z.delegate;
              if (fe) {
                var Ee = A(fe, z);
                if (Ee) {
                  if (Ee === h) continue;
                  return Ee;
                }
              }
              if (z.method === "next") z.sent = z._sent = z.arg;
              else if (z.method === "throw") {
                if (H === d) throw H = v, z.arg;
                z.dispatchException(z.arg);
              } else z.method === "return" && z.abrupt("return", z.arg);
              H = p;
              var Ne = k(L, N, z);
              if (Ne.type === "normal") {
                if (H = z.done ? v : m, Ne.arg === h) continue;
                return { value: Ne.arg, done: z.done };
              }
              Ne.type === "throw" && (H = v, z.method = "throw", z.arg = Ne.arg);
            }
          };
        }
        function A(L, N) {
          var z = L.iterator[N.method];
          if (z === n) {
            if (N.delegate = null, N.method === "throw") {
              if (L.iterator.return && (N.method = "return", N.arg = n, A(L, N), N.method === "throw")) return h;
              N.method = "throw", N.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var H = k(z, L.iterator, N.arg);
          if (H.type === "throw") return N.method = "throw", N.arg = H.arg, N.delegate = null, h;
          var F = H.arg;
          return F ? F.done ? (N[L.resultName] = F.value, N.next = L.nextLoc, N.method !== "return" && (N.method = "next", N.arg = n), N.delegate = null, h) : F : (N.method = "throw", N.arg = new TypeError("iterator result is not an object"), N.delegate = null, h);
        }
        function I(L) {
          var N = { tryLoc: L[0] };
          1 in L && (N.catchLoc = L[1]), 2 in L && (N.finallyLoc = L[2], N.afterLoc = L[3]), this.tryEntries.push(N);
        }
        function te(L) {
          var N = L.completion || {};
          N.type = "normal", delete N.arg, L.completion = N;
        }
        function J(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(I, this), this.reset(!0);
        }
        function ue(L) {
          if (L) {
            var N = L[u];
            if (N) return N.call(L);
            if (typeof L.next == "function") return L;
            if (!isNaN(L.length)) {
              var z = -1, H = function F() {
                for (; ++z < L.length; ) if (o.call(L, z)) return F.value = L[z], F.done = !1, F;
                return F.value = n, F.done = !0, F;
              };
              return H.next = H;
            }
          }
          return { next: ee };
        }
        function ee() {
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
        var k, w, O, _, T, S = u(this), M = s(S, 0), A = 0;
        for (k = -1, O = arguments.length; k < O; k++) if (T = k === -1 ? S : arguments[k], j(T)) {
          if (_ = c(T.length), A + _ > v) throw TypeError(h);
          for (w = 0; w < _; w++, A++) w in T && a(M, A, T[w]);
        } else {
          if (A >= v) throw TypeError(h);
          a(M, A++, T);
        }
        return M.length = A, M;
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
        var g, j, E, y, k, w, O = u(this), _ = t(O.length), T = r(h, _), S = arguments.length;
        if (S === 0 ? g = j = 0 : S === 1 ? (g = 0, j = _ - T) : (g = S - 2, j = m(d(o(b), 0), _ - T)), _ + g - j > p) throw TypeError(v);
        for (E = c(O, j), y = 0; y < j; y++) k = T + y, k in O && a(E, y, O[k]);
        if (E.length = j, g < j) {
          for (y = T; y < _ - j; y++) k = y + j, w = y + g, k in O ? O[w] = O[k] : delete O[w];
          for (y = _; y > _ - j + g; y--) delete O[y - 1];
        } else if (g > j) for (y = _ - j; y > T; y--) k = y + j - 1, w = y + g - 1, k in O ? O[w] = O[k] : delete O[w];
        for (y = 0; y < g; y++) O[y + T] = arguments[y + 2];
        return O.length = _ - j + g, E;
      } });
    }, a4b4: function(i, f, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), c = e("4930"), a = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), m = e("861d"), p = e("825a"), v = e("7b0b"), h = e("fc6a"), b = e("c04e"), g = e("5c6c"), j = e("7c73"), E = e("df75"), y = e("241c"), k = e("057f"), w = e("7418"), O = e("06cf"), _ = e("9bf2"), T = e("d1e7"), S = e("9112"), M = e("6eeb"), A = e("5692"), I = e("f772"), te = e("d012"), J = e("90e3"), ue = e("b622"), ee = e("e538"), L = e("746f"), N = e("d44e"), z = e("69f3"), H = e("b727").forEach, F = I("hidden"), be = "Symbol", fe = "prototype", Ee = ue("toPrimitive"), Ne = z.set, Re = z.getterFor(be), Ce = Object[fe], Te = r.Symbol, he = o("JSON", "stringify"), Q = O.f, C = _.f, U = k.f, K = T.f, D = A("symbols"), G = A("op-symbols"), re = A("string-to-symbol-registry"), ye = A("symbol-to-string-registry"), me = A("wks"), ce = r.QObject, ke = !ce || !ce[fe] || !ce[fe].findChild, Oe = u && s(function() {
        return j(C({}, "a", { get: function() {
          return C(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(V, X, ae) {
        var ve = Q(Ce, X);
        ve && delete Ce[X], C(V, X, ae), ve && V !== Ce && C(Ce, X, ve);
      } : C, Me = function(V, X) {
        var ae = D[V] = j(Te[fe]);
        return Ne(ae, { type: be, tag: V, description: X }), u || (ae.description = X), ae;
      }, je = a ? function(V) {
        return typeof V == "symbol";
      } : function(V) {
        return Object(V) instanceof Te;
      }, qe = function(V, X, ae) {
        V === Ce && qe(G, X, ae), p(V);
        var ve = b(X, !0);
        return p(ae), l(D, ve) ? (ae.enumerable ? (l(V, F) && V[F][ve] && (V[F][ve] = !1), ae = j(ae, { enumerable: g(0, !1) })) : (l(V, F) || C(V, F, g(1, {})), V[F][ve] = !0), Oe(V, ve, ae)) : C(V, ve, ae);
      }, Ge = function(V, X) {
        p(V);
        var ae = h(X), ve = E(ae).concat(le(ae));
        return H(ve, function($e) {
          u && !nt.call(ae, $e) || qe(V, $e, ae[$e]);
        }), V;
      }, Je = function(V, X) {
        return X === void 0 ? j(V) : Ge(j(V), X);
      }, nt = function(V) {
        var X = b(V, !0), ae = K.call(this, X);
        return !(this === Ce && l(D, X) && !l(G, X)) && (!(ae || !l(this, X) || !l(D, X) || l(this, F) && this[F][X]) || ae);
      }, W = function(V, X) {
        var ae = h(V), ve = b(X, !0);
        if (ae !== Ce || !l(D, ve) || l(G, ve)) {
          var $e = Q(ae, ve);
          return !$e || !l(D, ve) || l(ae, F) && ae[F][ve] || ($e.enumerable = !0), $e;
        }
      }, ne = function(V) {
        var X = U(h(V)), ae = [];
        return H(X, function(ve) {
          l(D, ve) || l(te, ve) || ae.push(ve);
        }), ae;
      }, le = function(V) {
        var X = V === Ce, ae = U(X ? G : h(V)), ve = [];
        return H(ae, function($e) {
          !l(D, $e) || X && !l(Ce, $e) || ve.push(D[$e]);
        }), ve;
      };
      if (c || (Te = function() {
        if (this instanceof Te) throw TypeError("Symbol is not a constructor");
        var V = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, X = J(V), ae = function(ve) {
          this === Ce && ae.call(G, ve), l(this, F) && l(this[F], X) && (this[F][X] = !1), Oe(this, X, g(1, ve));
        };
        return u && ke && Oe(Ce, X, { configurable: !0, set: ae }), Me(X, V);
      }, M(Te[fe], "toString", function() {
        return Re(this).tag;
      }), M(Te, "withoutSetter", function(V) {
        return Me(J(V), V);
      }), T.f = nt, _.f = qe, O.f = W, y.f = k.f = ne, w.f = le, ee.f = function(V) {
        return Me(ue(V), V);
      }, u && (C(Te[fe], "description", { configurable: !0, get: function() {
        return Re(this).description;
      } }), t || M(Ce, "propertyIsEnumerable", nt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Te }), H(E(me), function(V) {
        L(V);
      }), n({ target: be, stat: !0, forced: !c }, { for: function(V) {
        var X = String(V);
        if (l(re, X)) return re[X];
        var ae = Te(X);
        return re[X] = ae, ye[ae] = X, ae;
      }, keyFor: function(V) {
        if (!je(V)) throw TypeError(V + " is not a symbol");
        if (l(ye, V)) return ye[V];
      }, useSetter: function() {
        ke = !0;
      }, useSimple: function() {
        ke = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !u }, { create: Je, defineProperty: qe, defineProperties: Ge, getOwnPropertyDescriptor: W }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: ne, getOwnPropertySymbols: le }), n({ target: "Object", stat: !0, forced: s(function() {
        w.f(1);
      }) }, { getOwnPropertySymbols: function(V) {
        return w.f(v(V));
      } }), he) {
        var pe = !c || s(function() {
          var V = Te();
          return he([V]) != "[null]" || he({ a: V }) != "{}" || he(Object(V)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: pe }, { stringify: function(V, X, ae) {
          for (var ve, $e = [V], ze = 1; arguments.length > ze; ) $e.push(arguments[ze++]);
          if (ve = X, (m(X) || V !== void 0) && !je(V)) return d(X) || (X = function(Ze, xe) {
            if (typeof ve == "function" && (xe = ve.call(this, Ze, xe)), !je(xe)) return xe;
          }), $e[1] = X, he.apply(null, $e);
        } });
      }
      Te[fe][Ee] || S(Te[fe], Ee, Te[fe].valueOf), N(Te, be), te[F] = !0;
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
          for (var k, w, O = o(g), _ = r(O), T = n(j, E, 3), S = t(_.length), M = 0, A = y || u, I = l ? A(g, S) : d || h ? A(g, 0) : void 0; S > M; M++) if ((b || M in _) && (k = _[M], w = T(k, M, O), s)) if (l) I[M] = w;
          else if (w) switch (s) {
            case 3:
              return !0;
            case 5:
              return k;
            case 6:
              return M;
            case 2:
              c.call(I, k);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              c.call(I, k);
          }
          return v ? -1 : m || p ? p : I;
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
      function w(S, M) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), o(S)) for (var A = 0, I = S.length; A < I; A++) M.call(null, S[A], A, S);
        else for (var te in S) Object.prototype.hasOwnProperty.call(S, te) && M.call(null, S[te], te, S);
      }
      function O() {
        var S = {};
        function M(te, J) {
          p(S[J]) && p(te) ? S[J] = O(S[J], te) : p(te) ? S[J] = O({}, te) : o(te) ? S[J] = te.slice() : S[J] = te;
        }
        for (var A = 0, I = arguments.length; A < I; A++) w(arguments[A], M);
        return S;
      }
      function _(S, M, A) {
        return w(M, function(I, te) {
          S[te] = A && typeof I == "function" ? n(I, A) : I;
        }), S;
      }
      function T(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      i.exports = { isArray: o, isArrayBuffer: c, isBuffer: u, isFormData: a, isArrayBufferView: s, isString: l, isNumber: d, isObject: m, isPlainObject: p, isUndefined: t, isDate: v, isFile: h, isBlob: b, isFunction: g, isStream: j, isURLSearchParams: E, isStandardBrowserEnv: k, forEach: w, merge: O, extend: _, trim: y, stripBOM: T };
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
          var _ = !1, T = /a/;
          return p === "split" && (T = {}, T.constructor = {}, T.constructor[c] = function() {
            return T;
          }, T.flags = "", T[g] = /./[g]), T.exec = function() {
            return _ = !0, null;
          }, T[g](""), !_;
        });
        if (!j || !E || p === "replace" && (!a || !s || d) || p === "split" && !m) {
          var y = /./[g], k = h(g, ""[p], function(_, T, S, M, A) {
            return T.exec === t ? j && !A ? { done: !0, value: y.call(T, S, M) } : { done: !0, value: _.call(S, T, M) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), w = k[0], O = k[1];
          n(String.prototype, p, w), n(RegExp.prototype, g, v == 2 ? function(_, T) {
            return O.call(_, this, T);
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
                var T = w.slice();
                return O.forEach(function(S, M) {
                  typeof T[M] > "u" ? T[M] = j(S, _) : b(S) ? T[M] = k(w[M], S, _) : w.indexOf(S) === -1 && T.push(j(S, _));
                }), T;
              }
              function y(w, O, _) {
                var T = {};
                return b(w) && Object.keys(w).forEach(function(S) {
                  T[S] = j(w[S], _);
                }), Object.keys(O).forEach(function(S) {
                  b(O[S]) && w[S] ? T[S] = k(w[S], O[S], _) : T[S] = j(O[S], _);
                }), T;
              }
              function k(w, O, _) {
                var T = Array.isArray(O), S = _ || { arrayMerge: E }, M = S.arrayMerge || E;
                return T ? Array.isArray(w) ? M(w, O, _) : j(O, _) : y(w, O, _);
              }
              return k.all = function(w, O) {
                if (!Array.isArray(w) || w.length < 2) throw new Error("first argument should be an array with at least two elements");
                return w.reduce(function(_, T) {
                  return k(_, T, O);
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
      var n, r, o, t, u = e("23e7"), c = e("c430"), a = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), m = e("e2cc"), p = e("d44e"), v = e("2626"), h = e("861d"), b = e("1c0b"), g = e("19aa"), j = e("8925"), E = e("2266"), y = e("1c7e"), k = e("4840"), w = e("2cf4").set, O = e("b575"), _ = e("cdf9"), T = e("44de"), S = e("f069"), M = e("e667"), A = e("69f3"), I = e("94ca"), te = e("b622"), J = e("605d"), ue = e("2d00"), ee = te("species"), L = "Promise", N = A.get, z = A.set, H = A.getterFor(L), F = l, be = a.TypeError, fe = a.document, Ee = a.process, Ne = s("fetch"), Re = S.f, Ce = Re, Te = !!(fe && fe.createEvent && a.dispatchEvent), he = typeof PromiseRejectionEvent == "function", Q = "unhandledrejection", C = "rejectionhandled", U = 0, K = 1, D = 2, G = 1, re = 2, ye = I(L, function() {
        var W = j(F) !== String(F);
        if (!W && (ue === 66 || !J && !he) || c && !F.prototype.finally) return !0;
        if (ue >= 51 && /native code/.test(F)) return !1;
        var ne = F.resolve(1), le = function(V) {
          V(function() {
          }, function() {
          });
        }, pe = ne.constructor = {};
        return pe[ee] = le, !(ne.then(function() {
        }) instanceof le);
      }), me = ye || !y(function(W) {
        F.all(W).catch(function() {
        });
      }), ce = function(W) {
        var ne;
        return !(!h(W) || typeof (ne = W.then) != "function") && ne;
      }, ke = function(W, ne) {
        if (!W.notified) {
          W.notified = !0;
          var le = W.reactions;
          O(function() {
            for (var pe = W.value, V = W.state == K, X = 0; le.length > X; ) {
              var ae, ve, $e, ze = le[X++], Ze = V ? ze.ok : ze.fail, xe = ze.resolve, et = ze.reject, He = ze.domain;
              try {
                Ze ? (V || (W.rejection === re && qe(W), W.rejection = G), Ze === !0 ? ae = pe : (He && He.enter(), ae = Ze(pe), He && (He.exit(), $e = !0)), ae === ze.promise ? et(be("Promise-chain cycle")) : (ve = ce(ae)) ? ve.call(ae, xe, et) : xe(ae)) : et(pe);
              } catch (gt) {
                He && !$e && He.exit(), et(gt);
              }
            }
            W.reactions = [], W.notified = !1, ne && !W.rejection && Me(W);
          });
        }
      }, Oe = function(W, ne, le) {
        var pe, V;
        Te ? (pe = fe.createEvent("Event"), pe.promise = ne, pe.reason = le, pe.initEvent(W, !1, !0), a.dispatchEvent(pe)) : pe = { promise: ne, reason: le }, !he && (V = a["on" + W]) ? V(pe) : W === Q && T("Unhandled promise rejection", le);
      }, Me = function(W) {
        w.call(a, function() {
          var ne, le = W.facade, pe = W.value, V = je(W);
          if (V && (ne = M(function() {
            J ? Ee.emit("unhandledRejection", pe, le) : Oe(Q, le, pe);
          }), W.rejection = J || je(W) ? re : G, ne.error)) throw ne.value;
        });
      }, je = function(W) {
        return W.rejection !== G && !W.parent;
      }, qe = function(W) {
        w.call(a, function() {
          var ne = W.facade;
          J ? Ee.emit("rejectionHandled", ne) : Oe(C, ne, W.value);
        });
      }, Ge = function(W, ne, le) {
        return function(pe) {
          W(ne, pe, le);
        };
      }, Je = function(W, ne, le) {
        W.done || (W.done = !0, le && (W = le), W.value = ne, W.state = D, ke(W, !0));
      }, nt = function(W, ne, le) {
        if (!W.done) {
          W.done = !0, le && (W = le);
          try {
            if (W.facade === ne) throw be("Promise can't be resolved itself");
            var pe = ce(ne);
            pe ? O(function() {
              var V = { done: !1 };
              try {
                pe.call(ne, Ge(nt, V, W), Ge(Je, V, W));
              } catch (X) {
                Je(V, X, W);
              }
            }) : (W.value = ne, W.state = K, ke(W, !1));
          } catch (V) {
            Je({ done: !1 }, V, W);
          }
        }
      };
      ye && (F = function(W) {
        g(this, F, L), b(W), n.call(this);
        var ne = N(this);
        try {
          W(Ge(nt, ne), Ge(Je, ne));
        } catch (le) {
          Je(ne, le);
        }
      }, n = function(W) {
        z(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: U, value: void 0 });
      }, n.prototype = m(F.prototype, { then: function(W, ne) {
        var le = H(this), pe = Re(k(this, F));
        return pe.ok = typeof W != "function" || W, pe.fail = typeof ne == "function" && ne, pe.domain = J ? Ee.domain : void 0, le.parent = !0, le.reactions.push(pe), le.state != U && ke(le, !1), pe.promise;
      }, catch: function(W) {
        return this.then(void 0, W);
      } }), r = function() {
        var W = new n(), ne = N(W);
        this.promise = W, this.resolve = Ge(nt, ne), this.reject = Ge(Je, ne);
      }, S.f = Re = function(W) {
        return W === F || W === o ? new r(W) : Ce(W);
      }, c || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(W, ne) {
        var le = this;
        return new F(function(pe, V) {
          t.call(le, pe, V);
        }).then(W, ne);
      }, { unsafe: !0 }), typeof Ne == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(W) {
        return _(F, Ne.apply(a, arguments));
      } }))), u({ global: !0, wrap: !0, forced: ye }, { Promise: F }), p(F, L, !1, !0), v(L), o = s(L), u({ target: L, stat: !0, forced: ye }, { reject: function(W) {
        var ne = Re(this);
        return ne.reject.call(void 0, W), ne.promise;
      } }), u({ target: L, stat: !0, forced: c || ye }, { resolve: function(W) {
        return _(c && this === o ? F : this, W);
      } }), u({ target: L, stat: !0, forced: me }, { all: function(W) {
        var ne = this, le = Re(ne), pe = le.resolve, V = le.reject, X = M(function() {
          var ae = b(ne.resolve), ve = [], $e = 0, ze = 1;
          E(W, function(Ze) {
            var xe = $e++, et = !1;
            ve.push(void 0), ze++, ae.call(ne, Ze).then(function(He) {
              et || (et = !0, ve[xe] = He, --ze || pe(ve));
            }, V);
          }), --ze || pe(ve);
        });
        return X.error && V(X.value), le.promise;
      }, race: function(W) {
        var ne = this, le = Re(ne), pe = le.reject, V = M(function() {
          var X = b(ne.resolve);
          E(W, function(ae) {
            X.call(ne, ae).then(le.resolve, pe);
          });
        });
        return V.error && pe(V.value), le.promise;
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
      function a(x, $, R, B, q, ie) {
        var de = Object(t.resolveComponent)("Result"), se = Object(t.resolveComponent)("DefaultBoard"), ge = Object(t.resolveComponent)("HandBoard"), Ue = Object(t.resolveComponent)("svg-icon"), Fe = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: $[1] || ($[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(de, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(se, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ge, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Ue, { "icon-class": "drag" })], 4)), [[Fe]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(x, $, R) {
        return $ in x ? Object.defineProperty(x, $, { value: R, enumerable: !0, configurable: !0, writable: !0 }) : x[$] = R, x;
      }
      function l(x, $) {
        var R = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var B = Object.getOwnPropertySymbols(x);
          $ && (B = B.filter(function(q) {
            return Object.getOwnPropertyDescriptor(x, q).enumerable;
          })), R.push.apply(R, B);
        }
        return R;
      }
      function d(x) {
        for (var $ = 1; $ < arguments.length; $++) {
          var R = arguments[$] != null ? arguments[$] : {};
          $ % 2 ? l(Object(R), !0).forEach(function(B) {
            s(x, B, R[B]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(R)) : l(Object(R)).forEach(function(B) {
            Object.defineProperty(x, B, Object.getOwnPropertyDescriptor(R, B));
          });
        }
        return x;
      }
      function m(x, $) {
        ($ == null || $ > x.length) && ($ = x.length);
        for (var R = 0, B = new Array($); R < $; R++) B[R] = x[R];
        return B;
      }
      function p(x) {
        if (Array.isArray(x)) return m(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function h(x, $) {
        if (x) {
          if (typeof x == "string") return m(x, $);
          var R = Object.prototype.toString.call(x).slice(8, -1);
          return R === "Object" && x.constructor && (R = x.constructor.name), R === "Map" || R === "Set" ? Array.from(x) : R === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(R) ? m(x, $) : void 0;
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
      function j(x, $) {
        if (!(x instanceof $)) throw new TypeError("Cannot call a class as a function");
      }
      function E(x, $) {
        for (var R = 0; R < $.length; R++) {
          var B = $[R];
          B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(x, B.key, B);
        }
      }
      function y(x, $, R) {
        return $ && E(x.prototype, $), x;
      }
      var k = function() {
        function x() {
          j(this, x), this.listeners = {};
        }
        return y(x, [{ key: "on", value: function($, R) {
          var B = this, q = this.listeners[$];
          return q || (q = []), q.push(R), this.listeners[$] = q, function() {
            B.remove($, R);
          };
        } }, { key: "emit", value: function($) {
          var R = this.listeners[$];
          if (Array.isArray(R)) {
            for (var B = arguments.length, q = new Array(B > 1 ? B - 1 : 0), ie = 1; ie < B; ie++) q[ie - 1] = arguments[ie];
            for (var de = 0; de < R.length; de++) {
              var se = R[de];
              typeof se == "function" && se.apply(void 0, q);
            }
          }
        } }, { key: "remove", value: function($, R) {
          if (R) {
            var B = this.listeners[$];
            if (!B) return;
            B = B.filter(function(q) {
              return q !== R;
            }), this.listeners[$] = B;
          } else this.listeners[$] = null, delete this.listeners[$];
        } }]), x;
      }(), w = new k(), O = { mounted: function(x, $, R) {
        var B = x.parentNode;
        x.onmousedown = function(q) {
          var ie = q.clientX - B.offsetLeft, de = q.clientY - B.offsetTop;
          document.onmousemove = function(se) {
            var ge = se.clientX - ie, Ue = se.clientY - de;
            B.style.left = ge + "px", B.style.top = Ue + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(q) {
          var ie = q.touches[0].pageX, de = q.touches[0].pageY, se = ie - B.offsetLeft, ge = de - B.offsetTop;
          document.ontouchmove = function(Ue) {
            var Fe = Ue.touches[0].pageX, We = Ue.touches[0].pageY, Qe = Fe - se, lt = We - ge;
            B.style.left = Qe + "px", B.style.top = lt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, _ = O, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, M = { class: "key-board-result-show" }, A = { class: "key-board-result-show-container" }, I = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var te = T(function(x, $, R, B, q, ie) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", M, [Object(t.createVNode)("div", A, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(de, se) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: se, onClick: function(ge) {
            return x.selectWord(de);
          } }, Object(t.toDisplayString)(se + 1) + "." + Object(t.toDisplayString)(de), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", I, [Object(t.createVNode)("span", { style: x.getStyle, onClick: $[1] || ($[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: $[2] || ($[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), J = (e("1276"), e("6062"), e("5319"), function(x, $) {
        for (var R = 0, B = []; R < x.length; ) B.push(x.slice(R, R += $));
        return B;
      }), ue = Symbol("KEYBOARD_CONTEXT"), ee = function(x) {
        Object(t.provide)(ue, x);
      }, L = function() {
        return Object(t.inject)(ue);
      }, N = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, $) {
        var R = $.emit, B = L(), q = Object(t.computed)(function() {
          return { borderTopColor: B == null ? void 0 : B.color };
        }), ie = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function de() {
          ie.showIndex !== 0 && (ie.showIndex -= 1);
        }
        function se() {
          ie.showIndex !== ie.showList.length - 1 && (ie.showIndex += 1);
        }
        function ge() {
          ie.showIndex = 0, ie.showList = [], ie.valueList = [], w.emit("resultReset");
        }
        function Ue(Fe) {
          ge(), R("change", Fe);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Fe) {
          var We;
          ie.showIndex = 0, ie.valueList = (Fe == null || (We = Fe.value) === null || We === void 0 ? void 0 : We.split("")) || [], ie.valueList.length !== 0 ? ie.showList = J(ie.valueList, 11) : ie.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          w.on("keyBoardChange", function(Fe) {
            w.emit("updateBound"), ie.status = Fe, ge();
          }), w.on("getWordsFromServer", function(Fe) {
            var We = Array.from(new Set(Fe.replace(/\s+/g, "").split("")));
            ie.valueList = We, ie.showList = J(We, 11);
          });
        }), Object(t.onUnmounted)(function() {
          w.remove("keyBoardChange"), w.remove("getWordsFromServer");
        }), d({ color: B == null ? void 0 : B.color, upper: de, lower: se, getStyle: q, selectWord: Ue }, Object(t.toRefs)(ie));
      } });
      e("e66c"), N.render = te, N.__scopeId = "data-v-02e63132";
      var z = N, H = e("bc3a"), F = e.n(H), be = 15e3, fe = function(x) {
        F.a.defaults.baseURL = x, F.a.defaults.timeout = be, F.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ee(x, $, R, B, q, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Ne = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var $ = L(), R = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: $ == null ? void 0 : $.color, iconName: R };
      } });
      e("38cd"), Ne.render = Ee;
      var Re = Ne, Ce = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Te = { class: "hand-write-board" }, he = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Q = Ce(function(x, $, R, B, q, ie) {
        var de = Object(t.resolveComponent)("PaintBoard"), se = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Te, [Object(t.createVNode)(de, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", he, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(ge) {
          return Object(t.openBlock)(), Object(t.createBlock)(se, { key: ge.type, type: ge.type, data: ge.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), C = { class: "paint-board" };
      function U(x, $, R, B, q, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", C, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: $[1] || ($[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: $[2] || ($[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: $[3] || ($[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: $[4] || ($[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: $[5] || ($[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: $[6] || ($[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: $[7] || ($[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function K(x, $, R, B, q, ie, de) {
        try {
          var se = x[ie](de), ge = se.value;
        } catch (Ue) {
          return void R(Ue);
        }
        se.done ? $(ge) : Promise.resolve(ge).then(B, q);
      }
      function D(x) {
        return function() {
          var $ = this, R = arguments;
          return new Promise(function(B, q) {
            var ie = x.apply($, R);
            function de(ge) {
              K(ie, B, q, de, se, "next", ge);
            }
            function se(ge) {
              K(ie, B, q, de, se, "throw", ge);
            }
            de(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var G, re, ye = function() {
        var x = D(regeneratorRuntime.mark(function $(R, B, q, ie) {
          return regeneratorRuntime.wrap(function(de) {
            for (; ; ) switch (de.prev = de.next) {
              case 0:
                return de.next = 2, F.a.post("", { lib: ie, lpXis: R, lpYis: B, lpCis: q });
              case 2:
                return de.abrupt("return", de.sent);
              case 3:
              case "end":
                return de.stop();
            }
          }, $);
        }));
        return function($, R, B, q) {
          return x.apply(this, arguments);
        };
      }(), me = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var $ = L(), R = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), B = Object(t.ref)(null);
        function q() {
          return ie.apply(this, arguments);
        }
        function ie() {
          return ie = D(regeneratorRuntime.mark(function Ae() {
            var Ke, De;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, ye(R.clickX, R.clickY, R.clickC, x.lib);
                case 2:
                  Ke = Ye.sent, De = Ke.data, w.emit("getWordsFromServer", (De == null ? void 0 : De.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ae);
          })), ie.apply(this, arguments);
        }
        function de() {
          B.value && G && (R.clickX = [], R.clickY = [], R.clickC = [], G.clearRect(0, 0, R.width, R.height));
        }
        function se(Ae) {
          if (Ae.type.includes("mouse")) {
            var Ke = Ae;
            return Math.floor(Ke.clientX - R.x);
          }
          if (Ae.type.includes("touch")) {
            var De, Ye = Ae;
            return Math.floor(((De = Ye.targetTouches[0]) === null || De === void 0 ? void 0 : De.clientX) - R.x);
          }
          return 0;
        }
        function ge(Ae) {
          if (Ae.type.includes("mouse")) {
            var Ke = Ae;
            return Math.floor(Ke.clientY - R.y);
          }
          if (Ae.type.includes("touch")) {
            var De, Ye = Ae;
            return Math.floor(((De = Ye.targetTouches[0]) === null || De === void 0 ? void 0 : De.clientY) - R.y);
          }
          return 0;
        }
        function Ue(Ae) {
          if (G) {
            R.isMouseDown = !0;
            var Ke = se(Ae), De = ge(Ae);
            clearTimeout(re), R.oldX = Ke, R.oldY = De, G.beginPath();
          }
        }
        function Fe(Ae) {
          if (G && (Ae.preventDefault(), R.isMouseDown)) {
            var Ke = se(Ae), De = ge(Ae);
            R.clickX.push(Ke), R.clickY.push(De), R.clickC.push(0), G.strokeStyle = $ == null ? void 0 : $.color, G.fillStyle = $ == null ? void 0 : $.color, G.lineWidth = 4, G.lineCap = "round", G.moveTo(R.oldX, R.oldY), G.lineTo(Ke, De), G.stroke(), R.oldX = Ke, R.oldY = De;
          }
        }
        function We() {
          R.isMouseDown && (R.isMouseDown = !1, re = setTimeout(function() {
            de();
          }, 1500), R.clickC.pop(), R.clickC.push(1), q());
        }
        function Qe() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ae = document.querySelector(".paint-board").getBoundingClientRect();
              R.x = Ae.x, R.y = Ae.y, R.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), R.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function lt() {
          var Ae;
          G = (Ae = B.value) === null || Ae === void 0 ? void 0 : Ae.getContext("2d"), de(), Qe(), window.addEventListener("animationend", Qe), window.addEventListener("resize", Qe), window.addEventListener("scroll", Qe);
        }
        return Object(t.onMounted)(function() {
          lt(), w.on("updateBound", function() {
            Qe();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", Qe), window.removeEventListener("resize", Qe), window.removeEventListener("scroll", Qe), w.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(R)), {}, { move: Fe, down: Ue, mouseup: We, canvasRef: B });
      } });
      me.render = U;
      var ce = me;
      function ke(x, $, R, B, q, ie) {
        var de = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: $[1] || ($[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: $[2] || ($[2] = function(se) {
          return x.isHoverStatus = !0;
        }), onMouseleave: $[3] || ($[3] = function(se) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Oe = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Re }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, $) {
        var R = $.emit, B = L(), q = Object(t.ref)(!1), ie = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), de = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || q.value ? { color: "#f5f5f5", background: B == null ? void 0 : B.color } : { color: B == null ? void 0 : B.color, background: "#f5f5f5" };
        });
        function se(ge) {
          ge.preventDefault(), R("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: q, getStyle: de, getCode: ie, click: se };
      } });
      e("de23"), Oe.render = ke;
      var Me = Oe, je = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ce, KeyCodeButton: Me }, setup: function(x, $) {
        var R = $.emit, B = L(), q = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ie(de) {
          var se = de.data, ge = de.type;
          switch (ge) {
            case "close":
              B == null || B.closeKeyBoard();
              break;
            case "back":
              B == null || B.changeDefaultBoard(), w.emit("resultReset"), w.emit("keyBoardChange", q.isCn && "CN");
              break;
            case "change2lang":
              q.isCn = !q.isCn;
              break;
            case "delete":
              R("trigger", { data: se, type: ge });
              break;
          }
        }
        return d({ click: ie }, Object(t.toRefs)(q));
      } });
      e("9aaf"), je.render = Q, je.__scopeId = "data-v-1b5e0983";
      var qe = je, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Je = { class: "default-key-board" }, nt = { class: "line line4" };
      Object(t.popScopeId)();
      var W = Ge(function(x, $, R, B, q, ie) {
        var de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Je, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(se, ge) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ge + 1)], key: ge }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(se, function(Ue) {
            return Object(t.openBlock)(), Object(t.createBlock)(de, { isUpper: x.isUpper, key: Ue, type: Ue, data: Ue, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", nt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(se) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: se.type, type: se.type, data: se.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ne = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), le = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, pe = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, V = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], X = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Me }, emits: ["translate", "trigger", "change"], setup: function(x, $) {
        var R = $.emit, B = L(), q = Object(t.reactive)({ lineList: [le.line1, le.line2, le.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ie() {
          var se;
          q.line4 = JSON.parse(JSON.stringify(V)), B != null && (se = B.modeList) !== null && se !== void 0 && se.find(function(ge) {
            return ge === "handwrite";
          }) && B !== null && B !== void 0 && B.handApi && q.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function de(se) {
          var ge = se.data, Ue = se.type;
          switch (Ue) {
            case "close":
              q.oldVal = "", B == null || B.closeKeyBoard();
              break;
            case "upper":
              q.oldVal = "", q.isUpper = !q.isUpper;
              break;
            case "change2lang":
              q.isCn = !q.isCn, q.isNum || q.isSymbol || w.emit("keyBoardChange", q.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (q.isNum = !q.isNum, q.isSymbol = !1, q.isNum) {
                var Fe;
                w.emit("keyBoardChange", "number");
                var We = JSON.parse(JSON.stringify(pe.line3));
                B != null && (Fe = B.modeList) !== null && Fe !== void 0 && Fe.find(function(Qe) {
                  return Qe === "symbol";
                }) || (We.shift(), We.unshift("+")), q.lineList = [pe.line1, pe.line2, We];
              } else w.emit("keyBoardChange", q.isCn ? "CN" : "EN"), q.lineList = [le.line1, le.line2, le.line3];
              break;
            case "#+=":
              q.isSymbol = !q.isSymbol, q.isSymbol ? (w.emit("keyBoardChange", "symbol"), q.lineList = [ne.line1, ne.line2, ne.line3]) : (w.emit("keyBoardChange", "number"), q.lineList = [pe.line1, pe.line2, pe.line3]);
              break;
            case "handwrite":
            case "delete":
              q.isCn && Ue === "delete" && q.oldVal ? (q.oldVal = q.oldVal.substr(0, q.oldVal.length - 1), R("translate", q.oldVal)) : (Ue === "handwrite" && w.emit("keyBoardChange", "handwrite"), R("trigger", { data: ge, type: Ue }));
              break;
            default:
              !q.isCn || q.isNum || q.isSymbol ? R("change", ge) : (R("translate", q.oldVal + ge), q.oldVal = q.oldVal + ge);
              break;
          }
        }
        return ie(), Object(t.onMounted)(function() {
          w.on("resultReset", function() {
            q.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(q)), {}, { click: de });
      } });
      e("f8b0"), X.render = W, X.__scopeId = "data-v-4b78e5a1";
      var ae = X, ve = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, $e = e("ec57"), ze = function(x) {
        return x.keys().map(x);
      };
      ze($e);
      var Ze = [], xe = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: _ }, components: { Result: z, SvgIcon: Re, HandBoard: qe, DefaultBoard: ae }, setup: function(x, $) {
        var R = $.emit, B = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), q = Object(t.ref)(null);
        function ie(Se) {
          var _e, Le;
          switch (Object(t.nextTick)(function() {
            w.emit("keyBoardChange", "CN");
          }), Se) {
            case "en":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Pe;
                (Pe = q.value) === null || Pe === void 0 || Pe.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Pe;
                (Pe = q.value) === null || Pe === void 0 || Pe.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (_e = x.modeList) !== null && _e !== void 0 && _e.find(function(Pe) {
                return Pe === "handwrite";
              }) && x.handApi ? (B.showMode = "handwrite", Object(t.nextTick)(function() {
                w.emit("keyBoardChange", "handwrite");
              })) : B.showMode = "default";
              break;
            case "symbol":
              B.showMode = "default", (Le = x.modeList) !== null && Le !== void 0 && Le.find(function(Pe) {
                return Pe === "symbol";
              }) && Object(t.nextTick)(function() {
                var Pe, tt;
                (Pe = q.value) === null || Pe === void 0 || Pe.click({ data: ".?123", type: "change2num" }), (tt = q.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              B.showMode = "default";
              break;
          }
        }
        function de(Se) {
          if (B.visible = !0, xe = Se.target, ie(xe.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var _e = document.querySelector(".key-board-modal");
            _e.style.display = "block";
          }
        }
        function se() {
          if (xe && xe.blur(), xe = null, B.visible = !1, R("closed"), B.showMode = "default", B.resultVal = {}, document.querySelector(".key-board-modal")) {
            var Se = document.querySelector(".key-board-modal");
            Se.style.display = "none";
          }
        }
        function ge() {
          x.closeOnClickModal && se(), R("modalClick");
        }
        function Ue() {
          var Se;
          if (document.querySelector(".key-board-modal")) {
            var _e;
            (_e = document.querySelector(".key-board-modal")) === null || _e === void 0 || _e.addEventListener("click", ge);
          } else {
            var Le = document.createElement("div");
            Le.className = "key-board-modal", Le.style.display = "none", (Se = document.querySelector("body")) === null || Se === void 0 || Se.appendChild(Le), Le.addEventListener("click", ge);
          }
        }
        function Fe() {
          x.handApi && fe(x.handApi), [].concat(g(document.querySelectorAll("input")), g(document.querySelectorAll("textarea"))).forEach(function(Se) {
            Se.getAttribute("data-mode") !== null && (Ze.push(Se), Se.addEventListener("focus", de), x.blurHide && Se.addEventListener("blur", se));
          });
        }
        function We(Se) {
          if (!xe) return "";
          var _e = xe, Le = _e.selectionStart, Pe = _e.selectionEnd;
          if (!Le || !Pe) return "";
          var tt = Se.substring(0, Le - 1) + Se.substring(Pe);
          return _e.value = tt, _e.focus(), _e.selectionStart = Le - 1, _e.selectionEnd = Le - 1, tt;
        }
        function Qe(Se) {
          var _e = Se.type;
          switch (_e) {
            case "handwrite":
              B.showMode = "handwrite";
              break;
            case "delete":
              if (!xe) return;
              var Le = We(xe.value);
              xe.value = Le, R("change", Le, xe.getAttribute("data-prop") || xe);
              break;
          }
        }
        function lt(Se, _e) {
          if (!xe) return "";
          var Le = xe, Pe = Le.selectionStart || 0, tt = Le.selectionEnd || 0, xt = Se.substring(0, Pe) + _e + Se.substring(tt);
          return Le.value = xt, Le.focus(), Le.selectionStart = Pe + _e.length, Le.selectionEnd = Pe + _e.length, xt;
        }
        function Ae(Se) {
          if (xe) {
            var _e = lt(xe.value, Se);
            xe.value = _e, R("change", _e, xe.getAttribute("data-prop") || xe), R("keyChange", Se, xe.getAttribute("data-prop") || xe);
          }
        }
        function Ke(Se) {
          var _e = new RegExp("^".concat(Se, "\\w*")), Le = Object.keys(ve).filter(function(Pe) {
            return _e.test(Pe);
          }).sort();
          B.resultVal = { code: Se, value: Se ? Le.length > 1 ? Le.reduce(function(Pe, tt) {
            return Pe + ve[tt];
          }, "") : ve[Le[0]] : "" }, xe && R("keyChange", Se, xe.getAttribute("data-prop") || xe);
        }
        function De() {
          Fe();
        }
        function Ye() {
          return xe;
        }
        return Object(t.onMounted)(function() {
          x.modal && Ue(), Fe(), w.on("resultReset", function() {
            B.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var Se;
          (Se = document.querySelector(".key-board-modal")) === null || Se === void 0 || Se.removeEventListener("click", ge), Ze.forEach(function(_e) {
            _e.removeEventListener("focus", de), _e.removeEventListener("blur", se);
          });
        }), ee(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          se();
        }, changeDefaultBoard: function() {
          B.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(B)), {}, { defaultBoardRef: q, getCurrentInput: Ye, translate: Ke, reSignUp: De, trigger: Qe, change: Ae });
      } });
      et.render = a;
      var He = et;
      He.install = function(x) {
        x.component(He.name, He);
      };
      var gt = He, At = gt;
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
    function we(Y, Z) {
      console.log("change value ---->", Y), console.log("change input dom ---->", Z);
    }
    return {
      change: we
    };
  }
});
const tr = { class: "wifi-component" }, nr = { class: "row" }, rr = { class: "column" }, or = { class: "column" }, ir = { class: "status" }, ar = { class: "row" }, ur = { class: "column" }, cr = {
  __name: "WiFi",
  setup(we) {
    const Y = oe("未连接"), Z = oe(""), i = oe(""), f = () => {
      alert("验证 WiFi: " + Z.value);
    }, e = () => {
      alert("连接到 WiFi: " + Z.value), Y.value = "已连接到 " + Z.value;
    }, n = (r, o) => {
      o.placeholder === "WiFi 名称" ? Z.value = r : o.placeholder === "WiFi 密码" && (i.value = r);
    };
    return (r, o) => (Be(), Ie("div", tr, [
      P("div", nr, [
        P("div", rr, [
          pt(P("input", {
            "onUpdate:modelValue": o[0] || (o[0] = (t) => Z.value = t),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, Z.value]
          ])
        ]),
        P("div", or, [
          P("div", ir, " WiFi 状态: " + Ve(Y.value), 1)
        ])
      ]),
      P("div", ar, [
        P("div", ur, [
          pt(P("input", {
            "onUpdate:modelValue": o[1] || (o[1] = (t) => i.value = t),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, i.value]
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
  setup(we, { emit: Y }) {
    const Z = we, i = Y, f = oe([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = oe("");
    st(() => Z.showKeyboard, (r) => {
      r && (e.value = Z.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => we.showKeyboard ? (Be(), Ie("div", lr, [
      P("div", fr, [
        P("div", dr, Ve(e.value), 1),
        (Be(!0), Ie(at, null, ut(f.value, (t) => (Be(), Ie("div", {
          key: t.join(),
          class: "row"
        }, [
          (Be(!0), Ie(at, null, ut(t, (u) => (Be(), Ie("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, Ve(u), 11, pr))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, kt = /* @__PURE__ */ ot(vr, [["__scopeId", "data-v-2ccc1cb7"]]), hr = { class: "container" }, gr = { class: "column" }, mr = { class: "status-bar" }, yr = ["disabled"], br = { class: "column" }, wr = {
  key: 0,
  class: "modal"
}, xr = { class: "modal-content" }, kr = 60, Sr = {
  __name: "Lock",
  setup(we) {
    const { sendToPyQt: Y } = rt(), Z = ht({
      isPyQtWebEngine: !1
    }), i = oe("未激活"), f = oe(0), e = oe(""), n = oe(""), r = oe(""), o = oe(!1);
    let t, u;
    const c = oe(0), a = oe(1), s = oe(null), l = oe(!1), d = oe(!1), m = dt(() => i.value === "未激活" ? "设备状态: 未激活" : i.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${a.value} 次锁定 - 剩余时间: ${p.value}`), p = dt(() => {
      const M = Math.floor(f.value / 86400), A = Math.floor(f.value % (24 * 60 * 60) / (60 * 60)), I = Math.floor(f.value % (60 * 60) / 60), te = f.value % 60;
      return `${M}天 ${A.toString().padStart(2, "0")}:${I.toString().padStart(2, "0")}:${te.toString().padStart(2, "0")}`;
    }), v = dt(() => i.value === "未激活" ? "按住以激活设备" : e.value);
    function h(M) {
      i.value === "未激活" && (M.target.setPointerCapture(M.pointerId), c.value = 0, u = setInterval(() => {
        c.value += 2, c.value >= 100 && (clearInterval(u), j());
      }, 30));
    }
    function b(M) {
      M.target.releasePointerCapture(M.pointerId), g();
    }
    function g() {
      clearInterval(u), c.value = 0;
    }
    function j() {
      Y("activate_device", {});
    }
    function E(M, A) {
      i.value = "已激活", e.value = M, s.value = new Date(A), y();
    }
    function y() {
      k(), t = setInterval(() => {
        f.value > 0 ? f.value-- : w();
      }, 1e3);
    }
    function k() {
      const M = /* @__PURE__ */ new Date(), A = new Date(s.value.getTime() + a.value * kr * 1e3);
      f.value = Math.max(0, Math.floor((A - M) / 1e3));
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
    function T() {
      i.value = "永久激活", o.value = !1, clearInterval(t);
    }
    function S() {
      a.value++, t && clearInterval(t), y();
    }
    return Bt(() => {
      clearInterval(t), clearInterval(u);
    }), ct(() => {
      if (Z.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, Z.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: M } = rt();
        st(M, (A) => {
          if (A && A.type === "confirm_lock_password")
            try {
              const I = JSON.parse(A.content);
              I.target === "attemptUnlock" ? I.result === "success" ? S() : I.result === "forever_success" ? T() : alert("密钥错误") : I.target === "attemptModalUnlock" && (I.result === "success" ? (o.value = !1, S()) : I.result === "forever_success" ? T() : I.result === "fail" && alert("密钥错误"));
            } catch (I) {
              console.error("Failed to parse confirm lock password :", I);
            }
          else if (A && A.type === "device_activated")
            try {
              const I = JSON.parse(A.content);
              E(I.device_random_code, I.device_base_time);
            } catch (I) {
              console.error("Failed to parse device activation result:", I);
            }
          else if (A && A.type === "device_info")
            try {
              const I = JSON.parse(A.content);
              i.value = I.device_status, e.value = I.device_random_code, a.value = I.device_lock_count, s.value = new Date(I.device_base_time), I.device_status === "已激活" ? y() : I.device_status === "永久激活" && T();
            } catch (I) {
              console.error("Failed to parse device status:", I);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    }), (M, A) => (Be(), Ie("div", hr, [
      P("div", gr, [
        P("div", mr, Ve(m.value), 1),
        P("button", {
          class: "activation-button",
          onPointerdown: h,
          onPointerup: b,
          onPointercancel: g,
          onPointerleave: g,
          disabled: i.value !== "未激活"
        }, [
          wt(Ve(v.value) + " ", 1),
          P("div", {
            class: "progress-bar",
            style: St({ width: c.value + "%" })
          }, null, 4)
        ], 40, yr)
      ]),
      P("div", br, [
        pt(P("input", {
          "onUpdate:modelValue": A[0] || (A[0] = (I) => n.value = I),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: A[1] || (A[1] = (I) => l.value = !0)
        }, null, 544), [
          [vt, n.value]
        ]),
        P("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      o.value ? (Be(), Ie("div", wr, [
        P("div", xr, [
          A[8] || (A[8] = P("h3", null, "设备已锁定", -1)),
          P("h3", null, "第 " + Ve(a.value) + " 次锁定", 1),
          P("h3", null, "设备随机码: " + Ve(e.value), 1),
          pt(P("input", {
            "onUpdate:modelValue": A[2] || (A[2] = (I) => r.value = I),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: A[3] || (A[3] = (I) => d.value = !0)
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
        "onUpdate:modelValue": A[4] || (A[4] = (I) => n.value = I),
        showKeyboard: l.value,
        "onUpdate:showKeyboard": A[5] || (A[5] = (I) => l.value = I)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Xe(kt, {
        modelValue: r.value,
        "onUpdate:modelValue": A[6] || (A[6] = (I) => r.value = I),
        showKeyboard: d.value,
        "onUpdate:showKeyboard": A[7] || (A[7] = (I) => d.value = I)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Or = /* @__PURE__ */ ot(Sr, [["__scopeId", "data-v-28624ff1"]]), _r = { class: "app-container" }, Er = {
  __name: "App",
  setup(we) {
    return Rt(), (Y, Z) => (Be(), Ie("div", _r, [
      Z[0] || (Z[0] = P("h1", null, "涪特智能养护台车控制系统", -1)),
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
