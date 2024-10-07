import jt, { ref as me, onMounted as ct, provide as dt, readonly as pt, inject as vt, watch as lt, openBlock as De, createElementBlock as Fe, createElementVNode as I, toDisplayString as Ke, Fragment as at, renderList as ut, normalizeClass as nt, createCommentVNode as ht, reactive as gt, createVNode as rt, computed as Et, createTextVNode as yt, normalizeStyle as _t, defineComponent as Ct } from "vue";
const bt = Symbol(), wt = Symbol(), xt = Symbol();
function Tt(Oe, oe) {
  Oe && Oe.messageSignal ? Oe.messageSignal.connect((fe) => {
    try {
      const a = JSON.parse(fe);
      oe.value = a, console.log("Received message from PyQt:", a);
    } catch (a) {
      console.error("Failed to parse message:", a), oe.value = { type: "unknown", content: fe };
    }
  }) : console.error("messageSignal not found on bridge");
}
function At() {
  const Oe = me(null), oe = me(null), fe = me("");
  function a() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      Oe.value = f, oe.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), Tt(oe.value, fe), oe.value && typeof oe.value.vueReady == "function" ? oe.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ct(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? a() : document.addEventListener("DOMContentLoaded", a);
  }), dt(bt, pt(Oe)), dt(wt, pt(oe)), dt(xt, pt(fe));
}
function ot() {
  const Oe = vt(bt), oe = vt(wt), fe = vt(xt);
  return (!Oe || !oe || !fe) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: Oe,
    bridge: oe,
    message: fe,
    sendToPyQt: (f, e) => {
      if (console.log(`Attempting to call ${f} with args:`, e), oe && oe.value)
        if (typeof oe.value.sendToPyQt == "function")
          try {
            oe.value.sendToPyQt(f, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(oe.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const st = (Oe, oe) => {
  const fe = Oe.__vccOpts || Oe;
  for (const [a, f] of oe)
    fe[a] = f;
  return fe;
}, Lt = {
  key: 0,
  class: "numeric-keyboard"
}, Bt = { class: "keyboard" }, Pt = { class: "current-value" }, Nt = ["onClick"], Mt = {
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
  setup(Oe, { emit: oe }) {
    const fe = Oe, a = oe, f = me([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = me("");
    lt(() => fe.showKeyboard, (r) => {
      r && (e.value = fe.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => Oe.showKeyboard ? (De(), Fe("div", Lt, [
      I("div", Bt, [
        I("div", Pt, Ke(e.value), 1),
        (De(!0), Fe(at, null, ut(f.value, (t) => (De(), Fe("div", {
          key: t.join(),
          class: "row"
        }, [
          (De(!0), Fe(at, null, ut(t, (u) => (De(), Fe("button", {
            key: u,
            onClick: (c) => n(u),
            class: nt({ "function-key": u === "清除" || u === "确定" })
          }, Ke(u), 11, Nt))), 128))
        ]))), 128))
      ])
    ])) : ht("", !0);
  }
}, kt = /* @__PURE__ */ st(Mt, [["__scopeId", "data-v-541feda2"]]), Rt = { class: "settings-container" }, It = { class: "setting-group" }, Ut = { class: "setting-item" }, $t = { class: "setting-controls" }, Dt = ["value"], Ft = { class: "setting-item" }, Vt = { class: "setting-controls" }, qt = ["value"], zt = { class: "setting-group" }, Wt = { class: "setting-item" }, Qt = { class: "setting-controls" }, Ht = ["value"], Kt = { class: "setting-item" }, Gt = { class: "setting-controls" }, Yt = ["value"], Xt = {
  __name: "SensorSettings",
  setup(Oe) {
    const { sendToPyQt: oe } = ot(), fe = gt({
      isPyQtWebEngine: !1
    }), a = me(30), f = me(10), e = me(80), n = me(20), r = me(!1), o = me(null), t = me("");
    ct(() => {
      if (fe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, fe.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = ot();
        lt(g, (v) => {
          if (v && v.type === "update_limit_settings")
            try {
              const p = JSON.parse(v.content);
              a.value = p.temp_upper, f.value = p.temp_lower, e.value = p.humidity_upper, n.value = p.humidity_lower, console.log("Sensor Settings updated:", p);
            } catch (p) {
              console.error("Failed to parse sensor settings data:", p);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (g, v) => {
      const p = g === "tempUpper" ? a : g === "tempLower" ? f : g === "humidityUpper" ? e : n;
      p.value = (p.value || 0) + v, g.startsWith("temp") ? c(g === "tempUpper" ? "upper" : "lower") : i(g === "humidityUpper" ? "upper" : "lower");
    }, c = (g) => {
      a.value === "" && (a.value = f.value + 1), f.value === "" && (f.value = a.value - 1), g === "upper" ? a.value = Math.max(f.value + 1, a.value) : f.value = Math.min(a.value - 1, f.value), s();
    }, i = (g) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), g === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), s();
    }, s = () => {
      if (a.value !== "" && f.value !== "" && e.value !== "" && n.value !== "") {
        const g = {
          temp_upper: a.value,
          temp_lower: f.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", g), fe.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), oe("updateLimitSettings", g)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (g) => {
      o.value = g, r.value = !0, t.value = g.startsWith("temp") ? g === "tempUpper" ? a.value : f.value : g === "humidityUpper" ? e.value : n.value;
    }, d = (g) => {
      const v = parseFloat(g);
      isNaN(v) || (o.value === "tempUpper" ? (a.value = v, c("upper")) : o.value === "tempLower" ? (f.value = v, c("lower")) : o.value === "humidityUpper" ? (e.value = v, i("upper")) : o.value === "humidityLower" && (n.value = v, i("lower"))), o.value = null;
    };
    return (g, v) => (De(), Fe("div", Rt, [
      I("div", It, [
        v[15] || (v[15] = I("h2", null, "温度设置 (°C)", -1)),
        I("div", Ut, [
          v[13] || (v[13] = I("span", { class: "setting-label" }, "上限：", -1)),
          I("div", $t, [
            I("button", {
              onClick: v[0] || (v[0] = (p) => u("tempUpper", -1))
            }, "-"),
            I("input", {
              type: "text",
              value: a.value,
              onFocus: v[1] || (v[1] = (p) => l("tempUpper")),
              readonly: ""
            }, null, 40, Dt),
            I("button", {
              onClick: v[2] || (v[2] = (p) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        I("div", Ft, [
          v[14] || (v[14] = I("span", { class: "setting-label" }, "下限：", -1)),
          I("div", Vt, [
            I("button", {
              onClick: v[3] || (v[3] = (p) => u("tempLower", -1))
            }, "-"),
            I("input", {
              type: "text",
              value: f.value,
              onFocus: v[4] || (v[4] = (p) => l("tempLower")),
              readonly: ""
            }, null, 40, qt),
            I("button", {
              onClick: v[5] || (v[5] = (p) => u("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      I("div", zt, [
        v[18] || (v[18] = I("h2", null, "湿度设置 (%)", -1)),
        I("div", Wt, [
          v[16] || (v[16] = I("span", { class: "setting-label" }, "上限：", -1)),
          I("div", Qt, [
            I("button", {
              onClick: v[6] || (v[6] = (p) => u("humidityUpper", -1))
            }, "-"),
            I("input", {
              type: "text",
              value: e.value,
              onFocus: v[7] || (v[7] = (p) => l("humidityUpper")),
              readonly: ""
            }, null, 40, Ht),
            I("button", {
              onClick: v[8] || (v[8] = (p) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        I("div", Kt, [
          v[17] || (v[17] = I("span", { class: "setting-label" }, "下限：", -1)),
          I("div", Gt, [
            I("button", {
              onClick: v[9] || (v[9] = (p) => u("humidityLower", -1))
            }, "-"),
            I("input", {
              type: "text",
              value: n.value,
              onFocus: v[10] || (v[10] = (p) => l("humidityLower")),
              readonly: ""
            }, null, 40, Yt),
            I("button", {
              onClick: v[11] || (v[11] = (p) => u("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      rt(kt, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": d,
        "onUpdate:showKeyboard": v[12] || (v[12] = (p) => r.value = p)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Jt = /* @__PURE__ */ st(Xt, [["__scopeId", "data-v-22394ea0"]]), Zt = { class: "sensor-data-group" }, en = { class: "sensor-section" }, tn = { class: "sensor-container" }, nn = { class: "sensor-grid" }, rn = { class: "sensor-title" }, on = { class: "sensor-value" }, an = { class: "sensor-section" }, un = { class: "sensor-container" }, cn = { class: "sensor-grid" }, sn = { class: "sensor-title" }, ln = { class: "sensor-value" }, fn = {
  __name: "SensorDisplay",
  setup(Oe) {
    const oe = me({ temperature: {}, humidity: {} });
    ct(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: a } = ot();
        lt(a, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              oe.value = JSON.parse(f.content);
            } catch (e) {
              console.error("Failed to parse sensor data:", e);
            }
        });
      } else
        console.log("在普通网页环境中执行"), fe(), setInterval(fe, 5e3);
    });
    const fe = async () => {
      try {
        const a = await fetch("http://localhost:8000/api/sensor-data/");
        if (!a.ok)
          throw new Error(`HTTP error! status: ${a.status}`);
        const f = await a.json();
        oe.value = f;
      } catch (a) {
        console.error("Error fetching sensor data:", a);
      }
    };
    return (a, f) => (De(), Fe("div", Zt, [
      I("div", en, [
        f[0] || (f[0] = I("h2", null, "温度传感器", -1)),
        I("div", tn, [
          I("div", nn, [
            (De(!0), Fe(at, null, ut(oe.value.temperature, (e, n) => (De(), Fe("div", {
              key: n,
              class: "sensor-card"
            }, [
              I("div", rn, Ke(n), 1),
              I("div", on, Ke(e), 1)
            ]))), 128))
          ])
        ])
      ]),
      I("div", an, [
        f[1] || (f[1] = I("h2", null, "湿度传感器", -1)),
        I("div", un, [
          I("div", cn, [
            (De(!0), Fe(at, null, ut(oe.value.humidity, (e, n) => (De(), Fe("div", {
              key: n,
              class: "sensor-card"
            }, [
              I("div", sn, Ke(n), 1),
              I("div", ln, Ke(e), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, dn = /* @__PURE__ */ st(fn, [["__scopeId", "data-v-4414d3ef"]]), pn = { class: "integrated-control-system" }, vn = { class: "mode-controls" }, hn = ["disabled"], gn = ["disabled"], mn = ["disabled"], yn = ["disabled"], bn = { class: "systems-container" }, wn = { class: "steam-engine-control" }, xn = { class: "control-panel" }, kn = { class: "engine-status" }, Sn = { class: "engine left" }, On = ["disabled"], jn = { class: "engine right" }, En = ["disabled"], _n = { class: "sprinkler-system" }, Cn = { class: "controls" }, Tn = { class: "input-group" }, An = ["value"], Ln = { class: "input-group" }, Bn = ["value"], Pn = { class: "input-group" }, Nn = ["value"], Mn = { class: "visualization" }, Rn = ["onClick"], In = { class: "status" }, Un = {
  __name: "IntegratedControlSystem",
  setup(Oe) {
    const oe = me(!1), fe = me(!1), a = me(5), f = me(2), e = me(10), n = me(a.value), r = me(f.value), o = me(e.value), t = me(a.value), u = me(f.value), c = me(e.value), i = me(0), s = me(""), l = me(Array(12).fill(0)), d = me(0), g = me(!0), v = me(!1), p = me(!1), h = me(null), y = me(""), m = me(!1), E = me(5), _ = me(""), { sendToPyQt: b } = ot(), k = gt({
      isPyQtWebEngine: !1
    });
    ct(() => {
      if (k.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, k.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: ve } = ot();
        lt(ve, (Q) => {
          if (Q && Q.type === "update_left_steam_status")
            oe.value = Q.content;
          else if (Q && Q.type === "update_right_steam_status")
            fe.value = Q.content;
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
    const w = Et(() => m.value ? `${_.value}，还需${E.value}秒` : g.value ? v.value ? s.value === "run" ? `喷头 ${i.value} 正在运行，剩余 ${d.value + 1} 秒` : s.value === "interval" ? `运行间隔中，剩余 ${d.value + 1} 秒` : s.value === "loop" ? `循环间隔中，剩余 ${d.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    let O, j;
    async function T(ve) {
      m.value = !0, E.value = 5, _.value = ve ? "正在切换到喷淋管" : "正在切换到喷雾机", b("controlSprinkler", { target: "switchToSprinkler", state: ve });
      const Q = setInterval(() => {
        E.value--, E.value <= 0 && (clearInterval(Q), m.value = !1);
      }, 1e3);
      return new Promise((C) => {
        setTimeout(() => {
          m.value = !1, C();
        }, E.value * 1e3);
      });
    }
    async function S(ve) {
      const Q = g.value;
      if (g.value = ve === "auto", Q !== g.value)
        if (k.isPyQtWebEngine && b("controlSprinkler", { target: "setMode", mode: g.value ? "auto" : "manual" }), g.value) {
          oe.value && await U();
          const C = l.value.findIndex((N) => N === 100);
          C !== -1 && (l.value[C] = 0, k.isPyQtWebEngine && b("controlSprinkler", { target: "manual", index: C + 1, state: 0 })), b("controlSprinkler", { target: "tankWork", state: 0 }), await T(0);
        } else
          await z();
    }
    async function U() {
      k.isPyQtWebEngine && (b("setEngineState", { engine: "left", state: !oe.value }), b("setEngineState", { engine: "right", state: !fe.value }), oe.value = !oe.value, fe.value = !fe.value);
    }
    async function D() {
      const ve = l.value.findIndex((Q) => Q === 100);
      k.isPyQtWebEngine && ve === -1 && (oe.value ? b("controlSprinkler", { target: "tankWork", state: 0 }) : b("controlSprinkler", { target: "tankWork", state: 1 }), b("setEngineState", { engine: "left", state: !oe.value }), b("setEngineState", { engine: "right", state: !fe.value }), oe.value = !oe.value, fe.value = !fe.value);
    }
    function W(ve) {
      h.value = ve, p.value = !0, y.value = ve === "singleRunTime" ? t.value.toString() : ve === "runIntervalTime" ? u.value.toString() : c.value.toString();
    }
    function te(ve) {
      const Q = parseInt(ve);
      isNaN(Q) || (h.value === "singleRunTime" ? (t.value = Q, X()) : h.value === "runIntervalTime" ? (u.value = Q, ie()) : h.value === "loopInterval" && (c.value = Q, J())), h.value = null;
    }
    function X() {
      t.value = Math.max(1, t.value), n.value = t.value, A();
    }
    function ie() {
      u.value = Math.max(0, u.value), r.value = u.value, A();
    }
    function J() {
      c.value = Math.max(0, c.value), o.value = c.value, A();
    }
    function A() {
      if (k.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const ve = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        b("controlSprinkler", { target: "settings", settings: JSON.stringify(ve) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function L() {
      v.value || !g.value || (v.value = !0, l.value = Array(12).fill(0), await R());
    }
    async function z() {
      k.isPyQtWebEngine && (i.value > 0 && b("controlSprinkler", { target: "manual", index: i.value, state: 0 }), b("controlSprinkler", { target: "setState", state: !1 })), oe.value && await U(), K(), b("controlSprinkler", { target: "tankWork", state: 0 }), await T(0);
    }
    function K() {
      v.value = !1, clearTimeout(O), clearInterval(j), i.value = 0, s.value = "", l.value = Array(12).fill(0), d.value = 0;
    }
    async function R() {
      i.value = 1, await T(1), b("controlSprinkler", { target: "tankWork", state: 1 }), _e();
    }
    async function be() {
      i.value = 1, _e();
    }
    function se() {
      !v.value || !g.value || (d.value--, d.value > 0 && setTimeout(se, 1e3));
    }
    function _e() {
      if (!v.value || !g.value) return;
      s.value = "run", a.value = n.value, d.value = a.value, se();
      let ve = Date.now();
      b("controlSprinkler", { target: "manual", index: i.value, state: 1 }), j = setInterval(() => {
        let Q = Date.now() - ve, C = Math.min(Q / (a.value * 1e3), 1);
        l.value[i.value - 1] = C * 100;
      }, 100), O = setTimeout(async () => {
        clearInterval(j), i.value < 12 ? (b("controlSprinkler", { target: "manual", index: i.value, state: 0 }), Pe()) : (b("controlSprinkler", { target: "manual", index: i.value, state: 0 }), Ne());
      }, a.value * 1e3);
    }
    function Pe() {
      !v.value || !g.value || (f.value = r.value, d.value = f.value, d.value > 0 && (s.value = "interval"), se(), O = setTimeout(() => {
        i.value++, _e();
      }, f.value * 1e3));
    }
    async function Ne() {
      !v.value || !g.value || (e.value = o.value, d.value = e.value, d.value > 0 ? (b("controlSprinkler", { target: "tankWork", state: 0 }), await T(0), b("controlSprinkler", { target: "setState", state: !0 }), s.value = "loop", se(), i.value = 0, O = setTimeout(async () => {
        l.value = Array(12).fill(0), b("controlSprinkler", { target: "setState", state: !1 }), oe.value && await U(), b("controlSprinkler", { target: "tankWork", state: 0 }), await R();
      }, e.value * 1e3)) : (i.value = 0, l.value = Array(12).fill(0), await be()));
    }
    function Ce(ve) {
      return l.value[ve - 1];
    }
    async function Te(ve) {
      if (g.value) return;
      const Q = l.value.findIndex((C) => C === 100);
      l.value[ve - 1] > 0 ? (l.value[ve - 1] = 0, k.isPyQtWebEngine && (b("controlSprinkler", { target: "manual", index: ve, state: 0 }), b("controlSprinkler", { target: "tankWork", state: 0 }), await T(0))) : Q !== -1 ? (l.value[Q] = 0, k.isPyQtWebEngine && b("controlSprinkler", { target: "manual", index: Q + 1, state: 0 }), l.value[ve - 1] = 100, k.isPyQtWebEngine && b("controlSprinkler", { target: "manual", index: ve, state: 1 })) : (await T(1), b("controlSprinkler", { target: "tankWork", state: 1 }), l.value[ve - 1] = 100, k.isPyQtWebEngine && b("controlSprinkler", { target: "manual", index: ve, state: 1 }));
    }
    return (ve, Q) => (De(), Fe("div", pn, [
      Q[15] || (Q[15] = I("h2", null, "集成控制系统", -1)),
      I("div", vn, [
        I("button", {
          onClick: Q[0] || (Q[0] = (C) => S("auto")),
          disabled: m.value,
          class: nt([{ active: g.value }, "mode-btn"])
        }, "自动模式", 10, hn),
        I("button", {
          onClick: Q[1] || (Q[1] = (C) => S("manual")),
          disabled: m.value,
          class: nt([{ active: !g.value }, "mode-btn"])
        }, "手动模式", 10, gn),
        I("button", {
          onClick: L,
          disabled: v.value || !g.value || m.value,
          class: "control-btn"
        }, "开始", 8, mn),
        I("button", {
          onClick: z,
          disabled: !v.value || !g.value || m.value,
          class: "control-btn"
        }, "停止", 8, yn)
      ]),
      I("div", bn, [
        I("div", wn, [
          Q[10] || (Q[10] = I("h3", null, "雾化机控制系统", -1)),
          I("div", xn, [
            I("div", kn, [
              I("div", Sn, [
                Q[7] || (Q[7] = I("h4", null, "左雾化机", -1)),
                I("div", {
                  class: nt(["status", { on: oe.value }])
                }, [
                  Q[6] || (Q[6] = I("div", { class: "status-indicator" }, null, -1)),
                  yt(" " + Ke(oe.value ? "开" : "关"), 1)
                ], 2),
                I("button", {
                  onClick: D,
                  disabled: g.value || m.value,
                  class: "control-btn"
                }, Ke(oe.value ? "关闭" : "开启"), 9, On)
              ]),
              I("div", jn, [
                Q[9] || (Q[9] = I("h4", null, "右雾化机", -1)),
                I("div", {
                  class: nt(["status", { on: fe.value }])
                }, [
                  Q[8] || (Q[8] = I("div", { class: "status-indicator" }, null, -1)),
                  yt(" " + Ke(fe.value ? "开" : "关"), 1)
                ], 2),
                I("button", {
                  onClick: D,
                  disabled: g.value || m.value,
                  class: "control-btn"
                }, Ke(fe.value ? "关闭" : "开启"), 9, En)
              ])
            ])
          ])
        ]),
        I("div", _n, [
          Q[14] || (Q[14] = I("h3", null, "喷淋系统", -1)),
          I("div", Cn, [
            I("div", Tn, [
              Q[11] || (Q[11] = I("label", null, "单次运行时间 (秒):", -1)),
              I("input", {
                type: "text",
                value: t.value,
                onFocus: Q[2] || (Q[2] = (C) => W("singleRunTime")),
                readonly: ""
              }, null, 40, An)
            ]),
            I("div", Ln, [
              Q[12] || (Q[12] = I("label", null, "运行时间间隔 (秒):", -1)),
              I("input", {
                type: "text",
                value: u.value,
                onFocus: Q[3] || (Q[3] = (C) => W("runIntervalTime")),
                readonly: ""
              }, null, 40, Bn)
            ]),
            I("div", Pn, [
              Q[13] || (Q[13] = I("label", null, "循环时间间隔 (秒):", -1)),
              I("input", {
                type: "text",
                value: c.value,
                onFocus: Q[4] || (Q[4] = (C) => W("loopInterval")),
                readonly: ""
              }, null, 40, Nn)
            ])
          ]),
          I("div", Mn, [
            (De(), Fe(at, null, ut(12, (C) => I("div", {
              key: C,
              class: nt(["sprinkler", { active: g.value ? i.value === C : l.value[C - 1] > 0 }]),
              onClick: (N) => !m.value && !g.value && !oe.value && Te(C)
            }, [
              I("div", {
                class: "water",
                style: _t({ height: Ce(C) + "%" })
              }, null, 4),
              I("span", null, Ke(C), 1)
            ], 10, Rn)), 64))
          ]),
          I("div", In, Ke(w.value), 1)
        ])
      ]),
      rt(kt, {
        modelValue: y.value,
        showKeyboard: p.value,
        "onUpdate:modelValue": te,
        "onUpdate:showKeyboard": Q[5] || (Q[5] = (C) => p.value = C)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, $n = /* @__PURE__ */ st(Un, [["__scopeId", "data-v-93a1065e"]]), Dn = { class: "data-actions" }, Fn = {
  key: 0,
  class: "modal-overlay"
}, Vn = {
  key: 1,
  class: "modal-overlay"
}, qn = { class: "modal-content" }, zn = {
  __name: "DataExport",
  setup(Oe) {
    const { sendToPyQt: oe } = ot(), fe = gt({
      isPyQtWebEngine: !1
    }), a = me(!1), f = me(!1), e = me("");
    ct(() => {
      fe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, fe.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      fe.isPyQtWebEngine && (console.log("导出数据"), oe("exportData", !0));
    }, r = () => {
      a.value = !0;
    }, o = () => {
      a.value = !1;
    }, t = () => {
      console.log("清空数据"), a.value = !1, u("所有数据已清空！"), fe.isPyQtWebEngine && oe("exportData", !1);
    }, u = (i) => {
      e.value = i, f.value = !0;
    }, c = () => {
      f.value = !1;
    };
    return (i, s) => (De(), Fe("div", Dn, [
      I("div", { class: "action-buttons" }, [
        I("div", { class: "button-group" }, [
          s[0] || (s[0] = I("i", { class: "fas fa-file-excel" }, null, -1)),
          I("button", {
            onClick: n,
            class: "export-btn"
          }, "导出数据")
        ]),
        I("div", { class: "button-group" }, [
          s[1] || (s[1] = I("i", { class: "fas fa-trash-alt" }, null, -1)),
          I("button", {
            onClick: r,
            class: "clear-btn"
          }, "清空数据")
        ])
      ]),
      a.value ? (De(), Fe("div", Fn, [
        I("div", { class: "modal-content" }, [
          s[2] || (s[2] = I("p", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          I("div", { class: "modal-buttons" }, [
            I("button", {
              onClick: t,
              class: "confirm-btn"
            }, "确定"),
            I("button", {
              onClick: o,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ht("", !0),
      f.value ? (De(), Fe("div", Vn, [
        I("div", qn, [
          I("p", null, Ke(e.value), 1),
          I("div", { class: "modal-buttons" }, [
            I("button", {
              onClick: c,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ht("", !0)
    ]));
  }
}, Wn = /* @__PURE__ */ st(zn, [["__scopeId", "data-v-86824edf"]]);
var Qn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Hn(Oe) {
  return Oe && Oe.__esModule && Object.prototype.hasOwnProperty.call(Oe, "default") ? Oe.default : Oe;
}
var St = { exports: {} };
(function(Oe, oe) {
  (function(fe, a) {
    Oe.exports = a(jt);
  })(typeof self < "u" ? self : Qn, function(fe) {
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
      a.exports = function(c, i, s, l, d, g) {
        var v = s + c.length, p = l.length, h = u;
        return d !== void 0 && (d = n(d), h = t), o.call(g, h, function(y, m) {
          var E;
          switch (m.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return i.slice(0, s);
            case "'":
              return i.slice(v);
            case "<":
              E = d[m.slice(1, -1)];
              break;
            default:
              var _ = +m;
              if (_ === 0) return y;
              if (_ > p) {
                var b = r(_ / 10);
                return b === 0 ? y : b <= p ? l[b - 1] === void 0 ? m.charAt(1) : l[b - 1] + m.charAt(1) : y;
              }
              E = l[_ - 1];
          }
          return E === void 0 ? "" : E;
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
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), c = e("8aa5"), i = e("50c4"), s = e("14c3"), l = e("9263"), d = e("d039"), g = [].push, v = Math.min, p = 4294967295, h = !d(function() {
        return !RegExp(p, "y");
      });
      n("split", 2, function(y, m, E) {
        var _;
        return _ = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(b, k) {
          var w = String(t(this)), O = k === void 0 ? p : k >>> 0;
          if (O === 0) return [];
          if (b === void 0) return [w];
          if (!r(b)) return m.call(w, b, O);
          for (var j, T, S, U = [], D = (b.ignoreCase ? "i" : "") + (b.multiline ? "m" : "") + (b.unicode ? "u" : "") + (b.sticky ? "y" : ""), W = 0, te = new RegExp(b.source, D + "g"); (j = l.call(te, w)) && (T = te.lastIndex, !(T > W && (U.push(w.slice(W, j.index)), j.length > 1 && j.index < w.length && g.apply(U, j.slice(1)), S = j[0].length, W = T, U.length >= O))); )
            te.lastIndex === j.index && te.lastIndex++;
          return W === w.length ? !S && te.test("") || U.push("") : U.push(w.slice(W)), U.length > O ? U.slice(0, O) : U;
        } : "0".split(void 0, 0).length ? function(b, k) {
          return b === void 0 && k === 0 ? [] : m.call(this, b, k);
        } : m, [function(b, k) {
          var w = t(this), O = b == null ? void 0 : b[y];
          return O !== void 0 ? O.call(b, w, k) : _.call(String(w), b, k);
        }, function(b, k) {
          var w = E(_, b, this, k, _ !== m);
          if (w.done) return w.value;
          var O = o(b), j = String(this), T = u(O, RegExp), S = O.unicode, U = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (h ? "y" : "g"), D = new T(h ? O : "^(?:" + O.source + ")", U), W = k === void 0 ? p : k >>> 0;
          if (W === 0) return [];
          if (j.length === 0) return s(D, j) === null ? [j] : [];
          for (var te = 0, X = 0, ie = []; X < j.length; ) {
            D.lastIndex = h ? X : 0;
            var J, A = s(D, h ? j : j.slice(X));
            if (A === null || (J = v(i(D.lastIndex + (h ? 0 : X)), j.length)) === te) X = c(j, X, S);
            else {
              if (ie.push(j.slice(te, X)), ie.length === W) return ie;
              for (var L = 1; L <= A.length - 1; L++) if (ie.push(A[L]), ie.length === W) return ie;
              X = te = J;
            }
          }
          return ie.push(j.slice(te)), ie;
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
          function r(C, N) {
            return N = { exports: {} }, C(N, N.exports), N.exports;
          }
          var o = r(function(C, N) {
            (function(H, $) {
              C.exports = $();
            })(0, function() {
              function H(ae) {
                var xe = ae && typeof ae == "object";
                return xe && Object.prototype.toString.call(ae) !== "[object RegExp]" && Object.prototype.toString.call(ae) !== "[object Date]";
              }
              function $(ae) {
                return Array.isArray(ae) ? [] : {};
              }
              function G(ae, xe) {
                var Se = xe && xe.clone === !0;
                return Se && H(ae) ? ge($(ae), ae, xe) : ae;
              }
              function ee(ae, xe, Se) {
                var Me = ae.slice();
                return xe.forEach(function(Ee, qe) {
                  typeof Me[qe] > "u" ? Me[qe] = G(Ee, Se) : H(Ee) ? Me[qe] = ge(ae[qe], Ee, Se) : ae.indexOf(Ee) === -1 && Me.push(G(Ee, Se));
                }), Me;
              }
              function ye(ae, xe, Se) {
                var Me = {};
                return H(ae) && Object.keys(ae).forEach(function(Ee) {
                  Me[Ee] = G(ae[Ee], Se);
                }), Object.keys(xe).forEach(function(Ee) {
                  H(xe[Ee]) && ae[Ee] ? Me[Ee] = ge(ae[Ee], xe[Ee], Se) : Me[Ee] = G(xe[Ee], Se);
                }), Me;
              }
              function ge(ae, xe, Se) {
                var Me = Array.isArray(xe), Ee = Se || { arrayMerge: ee }, qe = Ee.arrayMerge || ee;
                return Me ? Array.isArray(ae) ? qe(ae, xe, Se) : G(xe, Se) : ye(ae, xe, Se);
              }
              return ge.all = function(ae, xe) {
                if (!Array.isArray(ae) || ae.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ae.reduce(function(Se, Me) {
                  return ge(Se, Me, xe);
                });
              }, ge;
            });
          });
          function t(C) {
            return C = C || /* @__PURE__ */ Object.create(null), { on: function(N, H) {
              (C[N] || (C[N] = [])).push(H);
            }, off: function(N, H) {
              C[N] && C[N].splice(C[N].indexOf(H) >>> 0, 1);
            }, emit: function(N, H) {
              (C[N] || []).map(function($) {
                $(H);
              }), (C["*"] || []).map(function($) {
                $(N, H);
              });
            } };
          }
          var u = r(function(C, N) {
            var H = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            N.default = H, C.exports = N.default;
          }), c = function(C) {
            return Object.keys(C).map(function(N) {
              var H = C[N].toString().replace(/"/g, "&quot;");
              return N + '="' + H + '"';
            }).join(" ");
          }, i = u.svg, s = u.xlink, l = {};
          l[i.name] = i.uri, l[s.name] = s.uri;
          var d, g = function(C, N) {
            C === void 0 && (C = "");
            var H = o(l, N || {}), $ = c(H);
            return "<svg " + $ + ">" + C + "</svg>";
          }, v = u.svg, p = u.xlink, h = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[v.name] = v.uri, d[p.name] = p.uri, d) }, y = function(C) {
            this.config = o(h, C || {}), this.symbols = [];
          };
          y.prototype.add = function(C) {
            var N = this, H = N.symbols, $ = this.find(C.id);
            return $ ? (H[H.indexOf($)] = C, !1) : (H.push(C), !0);
          }, y.prototype.remove = function(C) {
            var N = this, H = N.symbols, $ = this.find(C);
            return !!$ && (H.splice(H.indexOf($), 1), $.destroy(), !0);
          }, y.prototype.find = function(C) {
            return this.symbols.filter(function(N) {
              return N.id === C;
            })[0] || null;
          }, y.prototype.has = function(C) {
            return this.find(C) !== null;
          }, y.prototype.stringify = function() {
            var C = this.config, N = C.attrs, H = this.symbols.map(function($) {
              return $.stringify();
            }).join("");
            return g(H, N);
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            this.symbols.forEach(function(C) {
              return C.destroy();
            });
          };
          var m = function(C) {
            var N = C.id, H = C.viewBox, $ = C.content;
            this.id = N, this.viewBox = H, this.content = $;
          };
          m.prototype.stringify = function() {
            return this.content;
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            var C = this;
            ["id", "viewBox", "content"].forEach(function(N) {
              return delete C[N];
            });
          };
          var E = function(C) {
            var N = !!document.importNode, H = new DOMParser().parseFromString(C, "image/svg+xml").documentElement;
            return N ? document.importNode(H, !0) : H;
          }, _ = function(C) {
            function N() {
              C.apply(this, arguments);
            }
            C && (N.__proto__ = C), N.prototype = Object.create(C && C.prototype), N.prototype.constructor = N;
            var H = { isMounted: {} };
            return H.isMounted.get = function() {
              return !!this.node;
            }, N.createFromExistingNode = function($) {
              return new N({ id: $.getAttribute("id"), viewBox: $.getAttribute("viewBox"), content: $.outerHTML });
            }, N.prototype.destroy = function() {
              this.isMounted && this.unmount(), C.prototype.destroy.call(this);
            }, N.prototype.mount = function($) {
              if (this.isMounted) return this.node;
              var G = typeof $ == "string" ? document.querySelector($) : $, ee = this.render();
              return this.node = ee, G.appendChild(ee), ee;
            }, N.prototype.render = function() {
              var $ = this.stringify();
              return E(g($)).childNodes[0];
            }, N.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(N.prototype, H), N;
          }(m), b = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, k = function(C) {
            return Array.prototype.slice.call(C, 0);
          }, w = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, O = function(C, N) {
            var H = document.createEvent("CustomEvent");
            H.initCustomEvent(C, !1, !1, N), window.dispatchEvent(H);
          }, j = function(C) {
            var N = [];
            return k(C.querySelectorAll("style")).forEach(function(H) {
              H.textContent += "", N.push(H);
            }), N;
          }, T = function(C) {
            return (C || window.location.href).split("#")[0];
          }, S = function(C) {
            angular.module("ng").run(["$rootScope", function(N) {
              N.$on("$locationChangeSuccess", function(H, $, G) {
                O(C, { oldUrl: G, newUrl: $ });
              });
            }]);
          }, U = "linearGradient, radialGradient, pattern, mask, clipPath", D = function(C, N) {
            return N === void 0 && (N = U), k(C.querySelectorAll("symbol")).forEach(function(H) {
              k(H.querySelectorAll(N)).forEach(function($) {
                H.parentNode.insertBefore($, H);
              });
            }), C;
          };
          function W(C, N) {
            var H = k(C).reduce(function($, G) {
              if (!G.attributes) return $;
              var ee = k(G.attributes), ye = N ? ee.filter(N) : ee;
              return $.concat(ye);
            }, []);
            return H;
          }
          var te = u.xlink.uri, X = "xlink:href", ie = /[{}|\\\^\[\]`"<>]/g;
          function J(C) {
            return C.replace(ie, function(N) {
              return "%" + N[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function A(C) {
            return C.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function L(C, N, H) {
            return k(C).forEach(function($) {
              var G = $.getAttribute(X);
              if (G && G.indexOf(N) === 0) {
                var ee = G.replace(N, H);
                $.setAttributeNS(te, X, ee);
              }
            }), C;
          }
          var z, K = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], R = K.map(function(C) {
            return "[" + C + "]";
          }).join(","), be = function(C, N, H, $) {
            var G = J(H), ee = J($), ye = C.querySelectorAll(R), ge = W(ye, function(ae) {
              var xe = ae.localName, Se = ae.value;
              return K.indexOf(xe) !== -1 && Se.indexOf("url(" + G) !== -1;
            });
            ge.forEach(function(ae) {
              return ae.value = ae.value.replace(new RegExp(A(G), "g"), ee);
            }), L(N, G, ee);
          }, se = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, _e = function(C) {
            function N($) {
              var G = this;
              $ === void 0 && ($ = {}), C.call(this, o(b, $));
              var ee = t();
              this._emitter = ee, this.node = null;
              var ye = this, ge = ye.config;
              if (ge.autoConfigure && this._autoConfigure($), ge.syncUrlsWithBaseTag) {
                var ae = document.getElementsByTagName("base")[0].getAttribute("href");
                ee.on(se.MOUNT, function() {
                  return G.updateUrls("#", ae);
                });
              }
              var xe = this._handleLocationChange.bind(this);
              this._handleLocationChange = xe, ge.listenLocationChangeEvent && window.addEventListener(ge.locationChangeEvent, xe), ge.locationChangeAngularEmitter && S(ge.locationChangeEvent), ee.on(se.MOUNT, function(Se) {
                ge.moveGradientsOutsideSymbol && D(Se);
              }), ee.on(se.SYMBOL_MOUNT, function(Se) {
                ge.moveGradientsOutsideSymbol && D(Se.parentNode), (w.isIE() || w.isEdge()) && j(Se);
              });
            }
            C && (N.__proto__ = C), N.prototype = Object.create(C && C.prototype), N.prototype.constructor = N;
            var H = { isMounted: {} };
            return H.isMounted.get = function() {
              return !!this.node;
            }, N.prototype._autoConfigure = function($) {
              var G = this, ee = G.config;
              typeof $.syncUrlsWithBaseTag > "u" && (ee.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof $.locationChangeAngularEmitter > "u" && (ee.locationChangeAngularEmitter = typeof window.angular < "u"), typeof $.moveGradientsOutsideSymbol > "u" && (ee.moveGradientsOutsideSymbol = w.isFirefox());
            }, N.prototype._handleLocationChange = function($) {
              var G = $.detail, ee = G.oldUrl, ye = G.newUrl;
              this.updateUrls(ee, ye);
            }, N.prototype.add = function($) {
              var G = this, ee = C.prototype.add.call(this, $);
              return this.isMounted && ee && ($.mount(G.node), this._emitter.emit(se.SYMBOL_MOUNT, $.node)), ee;
            }, N.prototype.attach = function($) {
              var G = this, ee = this;
              if (ee.isMounted) return ee.node;
              var ye = typeof $ == "string" ? document.querySelector($) : $;
              return ee.node = ye, this.symbols.forEach(function(ge) {
                ge.mount(ee.node), G._emitter.emit(se.SYMBOL_MOUNT, ge.node);
              }), k(ye.querySelectorAll("symbol")).forEach(function(ge) {
                var ae = _.createFromExistingNode(ge);
                ae.node = ge, ee.add(ae);
              }), this._emitter.emit(se.MOUNT, ye), ye;
            }, N.prototype.destroy = function() {
              var $ = this, G = $.config, ee = $.symbols, ye = $._emitter;
              ee.forEach(function(ge) {
                return ge.destroy();
              }), ye.off("*"), window.removeEventListener(G.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, N.prototype.mount = function($, G) {
              $ === void 0 && ($ = this.config.mountTo), G === void 0 && (G = !1);
              var ee = this;
              if (ee.isMounted) return ee.node;
              var ye = typeof $ == "string" ? document.querySelector($) : $, ge = ee.render();
              return this.node = ge, G && ye.childNodes[0] ? ye.insertBefore(ge, ye.childNodes[0]) : ye.appendChild(ge), this._emitter.emit(se.MOUNT, ge), ge;
            }, N.prototype.render = function() {
              return E(this.stringify());
            }, N.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, N.prototype.updateUrls = function($, G) {
              if (!this.isMounted) return !1;
              var ee = document.querySelectorAll(this.config.usagesToUpdate);
              return be(this.node, ee, T($) + "#", T(G) + "#"), !0;
            }, Object.defineProperties(N.prototype, H), N;
          }(y), Pe = r(function(C) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(N, H) {
              C.exports = H();
            })(0, function() {
              var N, H = [], $ = document, G = $.documentElement.doScroll, ee = "DOMContentLoaded", ye = (G ? /^loaded|^c/ : /^loaded|^i|^c/).test($.readyState);
              return ye || $.addEventListener(ee, N = function() {
                for ($.removeEventListener(ee, N), ye = 1; N = H.shift(); ) N();
              }), function(ge) {
                ye ? setTimeout(ge, 0) : H.push(ge);
              };
            });
          }), Ne = "__SVG_SPRITE_NODE__", Ce = "__SVG_SPRITE__", Te = !!window[Ce];
          Te ? z = window[Ce] : (z = new _e({ attrs: { id: Ne, "aria-hidden": "true" } }), window[Ce] = z);
          var ve = function() {
            var C = document.getElementById(Ne);
            C ? z.attach(C) : z.mount(document.body, !0);
          };
          document.body ? ve() : Pe(ve);
          var Q = z;
          return Q;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(a, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), c = e("2a62"), i = function(s, l) {
        this.stopped = s, this.result = l;
      };
      a.exports = function(s, l, d) {
        var g, v, p, h, y, m, E, _ = d && d.that, b = !(!d || !d.AS_ENTRIES), k = !(!d || !d.IS_ITERATOR), w = !(!d || !d.INTERRUPTED), O = t(l, _, 1 + b + w), j = function(S) {
          return g && c(g), new i(!0, S);
        }, T = function(S) {
          return b ? (n(S), w ? O(S[0], S[1], j) : O(S[0], S[1])) : w ? O(S, j) : O(S);
        };
        if (k) g = s;
        else {
          if (v = u(s), typeof v != "function") throw TypeError("Target is not iterable");
          if (r(v)) {
            for (p = 0, h = o(s.length); h > p; p++) if (y = T(s[p]), y && y instanceof i) return y;
            return new i(!1);
          }
          g = v.call(s);
        }
        for (m = g.next; !(E = m.call(g)).done; ) {
          try {
            y = T(E.value);
          } catch (S) {
            throw c(g), S;
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
        var d, g, v, p, h, y, m = s.target, E = s.global, _ = s.stat;
        if (g = E ? n : _ ? n[m] || u(m, {}) : (n[m] || {}).prototype, g) for (v in l) {
          if (h = l[v], s.noTargetGet ? (y = r(g, v), p = y && y.value) : p = g[v], d = i(E ? v : m + (_ ? "." : "#") + v, s.forced), !d && p !== void 0) {
            if (typeof h == typeof p) continue;
            c(h, p);
          }
          (s.sham || p && p.sham) && o(h, "sham", !0), t(g, v, h, s);
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
        var d = r(this), g = String(d.source), v = d.flags, p = String(v === void 0 && d instanceof RegExp && !("flags" in c) ? t.call(d) : v);
        return "/" + g + "/" + p;
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
      var n, r, o, t = e("da84"), u = e("d039"), c = e("0366"), i = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), g = t.location, v = t.setImmediate, p = t.clearImmediate, h = t.process, y = t.MessageChannel, m = t.Dispatch, E = 0, _ = {}, b = "onreadystatechange", k = function(T) {
        if (_.hasOwnProperty(T)) {
          var S = _[T];
          delete _[T], S();
        }
      }, w = function(T) {
        return function() {
          k(T);
        };
      }, O = function(T) {
        k(T.data);
      }, j = function(T) {
        t.postMessage(T + "", g.protocol + "//" + g.host);
      };
      v && p || (v = function(T) {
        for (var S = [], U = 1; arguments.length > U; ) S.push(arguments[U++]);
        return _[++E] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, S);
        }, n(E), E;
      }, p = function(T) {
        delete _[T];
      }, d ? n = function(T) {
        h.nextTick(w(T));
      } : m && m.now ? n = function(T) {
        m.now(w(T));
      } : y && !l ? (r = new y(), o = r.port2, r.port1.onmessage = O, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && g && g.protocol !== "file:" && !u(j) ? (n = j, t.addEventListener("message", O, !1)) : n = b in s("script") ? function(T) {
        i.appendChild(s("script"))[b] = function() {
          i.removeChild(this), k(T);
        };
      } : function(T) {
        setTimeout(w(T), 0);
      }), a.exports = { set: v, clear: p };
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
            l !== null && typeof l < "u" && (n.isArray(l) ? d += "[]" : l = [l], n.forEach(l, function(g) {
              n.isDate(g) ? g = g.toISOString() : n.isObject(g) && (g = JSON.stringify(g)), i.push(r(d) + "=" + r(g));
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
          var g = t(this), v = d == null ? void 0 : d[i];
          return v !== void 0 ? v.call(d, g) : new RegExp(d)[i](String(g));
        }, function(d) {
          var g = l(s, d, this);
          if (g.done) return g.value;
          var v = r(d), p = String(this);
          if (!v.global) return c(v, p);
          var h = v.unicode;
          v.lastIndex = 0;
          for (var y, m = [], E = 0; (y = c(v, p)) !== null; ) {
            var _ = String(y[0]);
            m[E] = _, _ === "" && (v.lastIndex = u(p, o(v.lastIndex), h)), E++;
          }
          return E === 0 ? null : m;
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
        function l(p, h) {
          return n.isPlainObject(p) && n.isPlainObject(h) ? n.merge(p, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function d(p) {
          n.isUndefined(o[p]) ? n.isUndefined(r[p]) || (t[p] = l(void 0, r[p])) : t[p] = l(r[p], o[p]);
        }
        n.forEach(u, function(p) {
          n.isUndefined(o[p]) || (t[p] = l(void 0, o[p]));
        }), n.forEach(c, d), n.forEach(i, function(p) {
          n.isUndefined(o[p]) ? n.isUndefined(r[p]) || (t[p] = l(void 0, r[p])) : t[p] = l(void 0, o[p]);
        }), n.forEach(s, function(p) {
          p in o ? t[p] = l(r[p], o[p]) : p in r && (t[p] = l(void 0, r[p]));
        });
        var g = u.concat(c).concat(i).concat(s), v = Object.keys(r).concat(Object.keys(o)).filter(function(p) {
          return g.indexOf(p) === -1;
        });
        return n.forEach(v, d), t;
      };
    }, "4d63": function(a, f, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, c = e("241c").f, i = e("44e7"), s = e("ad6d"), l = e("9f7f"), d = e("6eeb"), g = e("d039"), v = e("69f3").set, p = e("2626"), h = e("b622"), y = h("match"), m = r.RegExp, E = m.prototype, _ = /a/g, b = /a/g, k = new m(_) !== _, w = l.UNSUPPORTED_Y, O = n && o("RegExp", !k || w || g(function() {
        return b[y] = !1, m(_) != _ || m(b) == b || m(_, "i") != "/a/i";
      }));
      if (O) {
        for (var j = function(D, W) {
          var te, X = this instanceof j, ie = i(D), J = W === void 0;
          if (!X && ie && D.constructor === j && J) return D;
          k ? ie && !J && (D = D.source) : D instanceof j && (J && (W = s.call(D)), D = D.source), w && (te = !!W && W.indexOf("y") > -1, te && (W = W.replace(/y/g, "")));
          var A = t(k ? new m(D, W) : m(D, W), X ? this : E, j);
          return w && te && v(A, { sticky: te }), A;
        }, T = function(D) {
          D in j || u(j, D, { configurable: !0, get: function() {
            return m[D];
          }, set: function(W) {
            m[D] = W;
          } });
        }, S = c(m), U = 0; S.length > U; ) T(S[U++]);
        E.constructor = j, j.prototype = E, d(r, "RegExp", j);
      }
      p("RegExp");
    }, "4d64": function(a, f, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(c, i, s) {
          var l, d = n(c), g = r(d.length), v = o(s, g);
          if (u && i != i) {
            for (; g > v; ) if (l = d[v++], l != l) return !0;
          } else for (; g > v; v++) if ((u || v in d) && d[v] === i) return u || v || 0;
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
        var l, d, g, v, p, h, y = r(s), m = typeof this == "function" ? this : Array, E = arguments.length, _ = E > 1 ? arguments[1] : void 0, b = _ !== void 0, k = i(y), w = 0;
        if (b && (_ = n(_, E > 2 ? arguments[2] : void 0, 2)), k == null || m == Array && t(k)) for (l = u(y.length), d = new m(l); l > w; w++) h = b ? _(y[w], w) : y[w], c(d, w, h);
        else for (v = k.call(y), p = v.next, d = new m(); !(g = p.call(v)).done; w++) h = b ? o(v, _, [g.value, w], !0) : g.value, c(d, w, h);
        return d.length = w, d;
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
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), c = e("8aa5"), i = e("0cb2"), s = e("14c3"), l = Math.max, d = Math.min, g = function(v) {
        return v === void 0 ? v : String(v);
      };
      n("replace", 2, function(v, p, h, y) {
        var m = y.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, E = y.REPLACE_KEEPS_$0, _ = m ? "$" : "$0";
        return [function(b, k) {
          var w = u(this), O = b == null ? void 0 : b[v];
          return O !== void 0 ? O.call(b, w, k) : p.call(String(w), b, k);
        }, function(b, k) {
          if (!m && E || typeof k == "string" && k.indexOf(_) === -1) {
            var w = h(p, b, this, k);
            if (w.done) return w.value;
          }
          var O = r(b), j = String(this), T = typeof k == "function";
          T || (k = String(k));
          var S = O.global;
          if (S) {
            var U = O.unicode;
            O.lastIndex = 0;
          }
          for (var D = []; ; ) {
            var W = s(O, j);
            if (W === null || (D.push(W), !S)) break;
            var te = String(W[0]);
            te === "" && (O.lastIndex = c(j, o(O.lastIndex), U));
          }
          for (var X = "", ie = 0, J = 0; J < D.length; J++) {
            W = D[J];
            for (var A = String(W[0]), L = l(d(t(W.index), j.length), 0), z = [], K = 1; K < W.length; K++) z.push(g(W[K]));
            var R = W.groups;
            if (T) {
              var be = [A].concat(z, L, j);
              R !== void 0 && be.push(R);
              var se = String(k.apply(void 0, be));
            } else se = i(A, j, L, z, R, k);
            L >= ie && (X += j.slice(ie, L) + se, ie = L + A.length);
          }
          return X + j.slice(ie);
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
          var g = c.getAttribute("content");
          if (g) {
            var v = g.match(/initial\-dpr=([\d\.]+)/), p = g.match(/maximum\-dpr=([\d\.]+)/);
            v && (i = parseFloat(v[1]), s = parseFloat((1 / i).toFixed(2))), p && (i = parseFloat(p[1]), s = parseFloat((1 / i).toFixed(2)));
          }
        }
        if (!i && !s) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), y = n.devicePixelRatio;
          i = h ? y >= 3 && (!i || i >= 3) ? 3 : y >= 2 && (!i || i >= 2) ? 2 : 1 : 1, s = 1 / i;
        }
        if (t.setAttribute("data-dpr", i), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var m = o.createElement("div");
          m.appendChild(u), o.write(m.innerHTML);
        }
        function E() {
          var _ = t.getBoundingClientRect().width, b = _ / 10;
          t.style.fontSize = b + "px", l.rem = n.rem = b;
        }
        n.addEventListener("resize", function() {
          E();
        }, !1), n.addEventListener("pageshow", function(_) {
          _.persisted && E();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * i + "px" : o.addEventListener("DOMContentLoaded", function(_) {
          o.body.style.fontSize = 10 * i + "px";
        }, !1), E(), l.dpr = n.dpr = i, l.refreshRem = E, l.rem2px = function(_) {
          var b = parseFloat(_) * this.rem;
          return typeof _ == "string" && _.match(/rem$/) && (b += "px"), b;
        }, l.px2rem = function(_) {
          var b = parseFloat(_) / this.rem;
          return typeof _ == "string" && _.match(/px$/) && (b += "rem"), b;
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
          var i, s, l = String(r(u)), d = n(c), g = l.length;
          return d < 0 || d >= g ? t ? "" : void 0 : (i = l.charCodeAt(d), i < 55296 || i > 56319 || d + 1 === g || (s = l.charCodeAt(d + 1)) < 56320 || s > 57343 ? t ? l.charAt(d) : i : t ? l.slice(d, d + 2) : s - 56320 + (i - 55296 << 10) + 65536);
        };
      };
      a.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(a, f, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), c = e("2266"), i = e("7dd0"), s = e("2626"), l = e("83ab"), d = e("f183").fastKey, g = e("69f3"), v = g.set, p = g.getterFor;
      a.exports = { getConstructor: function(h, y, m, E) {
        var _ = h(function(O, j) {
          u(O, _, y), v(O, { type: y, index: r(null), first: void 0, last: void 0, size: 0 }), l || (O.size = 0), j != null && c(j, O[E], { that: O, AS_ENTRIES: m });
        }), b = p(y), k = function(O, j, T) {
          var S, U, D = b(O), W = w(O, j);
          return W ? W.value = T : (D.last = W = { index: U = d(j, !0), key: j, value: T, previous: S = D.last, next: void 0, removed: !1 }, D.first || (D.first = W), S && (S.next = W), l ? D.size++ : O.size++, U !== "F" && (D.index[U] = W)), O;
        }, w = function(O, j) {
          var T, S = b(O), U = d(j);
          if (U !== "F") return S.index[U];
          for (T = S.first; T; T = T.next) if (T.key == j) return T;
        };
        return o(_.prototype, { clear: function() {
          for (var O = this, j = b(O), T = j.index, S = j.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete T[S.index], S = S.next;
          j.first = j.last = void 0, l ? j.size = 0 : O.size = 0;
        }, delete: function(O) {
          var j = this, T = b(j), S = w(j, O);
          if (S) {
            var U = S.next, D = S.previous;
            delete T.index[S.index], S.removed = !0, D && (D.next = U), U && (U.previous = D), T.first == S && (T.first = U), T.last == S && (T.last = D), l ? T.size-- : j.size--;
          }
          return !!S;
        }, forEach: function(O) {
          for (var j, T = b(this), S = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); j = j ? j.next : T.first; )
            for (S(j.value, j.key, this); j && j.removed; ) j = j.previous;
        }, has: function(O) {
          return !!w(this, O);
        } }), o(_.prototype, m ? { get: function(O) {
          var j = w(this, O);
          return j && j.value;
        }, set: function(O, j) {
          return k(this, O === 0 ? 0 : O, j);
        } } : { add: function(O) {
          return k(this, O = O === 0 ? 0 : O, O);
        } }), l && n(_.prototype, "size", { get: function() {
          return b(this).size;
        } }), _;
      }, setStrong: function(h, y, m) {
        var E = y + " Iterator", _ = p(y), b = p(E);
        i(h, y, function(k, w) {
          v(this, { type: E, target: k, state: _(k), kind: w, last: void 0 });
        }, function() {
          for (var k = b(this), w = k.kind, O = k.last; O && O.removed; ) O = O.previous;
          return k.target && (k.last = O = O ? O.next : k.state.first) ? w == "keys" ? { value: O.key, done: !1 } : w == "values" ? { value: O.value, done: !1 } : { value: [O.key, O.value], done: !1 } : (k.target = void 0, { value: void 0, done: !0 });
        }, m ? "entries" : "values", !m, !0), s(y);
      } };
    }, "65f0": function(a, f, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      a.exports = function(u, c) {
        var i;
        return r(u) && (i = u.constructor, typeof i != "function" || i !== Array && !r(i.prototype) ? n(i) && (i = i[t], i === null && (i = void 0)) : i = void 0), new (i === void 0 ? Array : i)(c === 0 ? 0 : c);
      };
    }, "69f3": function(a, f, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), c = e("861d"), i = e("9112"), s = e("5135"), l = e("c6cd"), d = e("f772"), g = e("d012"), v = u.WeakMap, p = function(k) {
        return o(k) ? r(k) : n(k, {});
      }, h = function(k) {
        return function(w) {
          var O;
          if (!c(w) || (O = r(w)).type !== k) throw TypeError("Incompatible receiver, " + k + " required");
          return O;
        };
      };
      if (t) {
        var y = l.state || (l.state = new v()), m = y.get, E = y.has, _ = y.set;
        n = function(k, w) {
          return w.facade = k, _.call(y, k, w), w;
        }, r = function(k) {
          return m.call(y, k) || {};
        }, o = function(k) {
          return E.call(y, k);
        };
      } else {
        var b = d("state");
        g[b] = !0, n = function(k, w) {
          return w.facade = k, i(k, b, w), w;
        }, r = function(k) {
          return s(k, b) ? k[b] : {};
        }, o = function(k) {
          return s(k, b);
        };
      }
      a.exports = { set: n, get: r, has: o, enforce: p, getterFor: h };
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
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), c = e("2266"), i = e("19aa"), s = e("861d"), l = e("d039"), d = e("1c7e"), g = e("d44e"), v = e("7156");
      a.exports = function(p, h, y) {
        var m = p.indexOf("Map") !== -1, E = p.indexOf("Weak") !== -1, _ = m ? "set" : "add", b = r[p], k = b && b.prototype, w = b, O = {}, j = function(X) {
          var ie = k[X];
          t(k, X, X == "add" ? function(J) {
            return ie.call(this, J === 0 ? 0 : J), this;
          } : X == "delete" ? function(J) {
            return !(E && !s(J)) && ie.call(this, J === 0 ? 0 : J);
          } : X == "get" ? function(J) {
            return E && !s(J) ? void 0 : ie.call(this, J === 0 ? 0 : J);
          } : X == "has" ? function(J) {
            return !(E && !s(J)) && ie.call(this, J === 0 ? 0 : J);
          } : function(J, A) {
            return ie.call(this, J === 0 ? 0 : J, A), this;
          });
        }, T = o(p, typeof b != "function" || !(E || k.forEach && !l(function() {
          new b().entries().next();
        })));
        if (T) w = y.getConstructor(h, p, m, _), u.REQUIRED = !0;
        else if (o(p, !0)) {
          var S = new w(), U = S[_](E ? {} : -0, 1) != S, D = l(function() {
            S.has(1);
          }), W = d(function(X) {
            new b(X);
          }), te = !E && l(function() {
            for (var X = new b(), ie = 5; ie--; ) X[_](ie, ie);
            return !X.has(-0);
          });
          W || (w = h(function(X, ie) {
            i(X, w, p);
            var J = v(new b(), X, w);
            return ie != null && c(ie, J[_], { that: J, AS_ENTRIES: m }), J;
          }), w.prototype = k, k.constructor = w), (D || te) && (j("delete"), j("has"), m && j("get")), (te || U) && j(_), E && k.clear && delete k.clear;
        }
        return O[p] = w, n({ global: !0, forced: w != b }, O), g(w, p), E || y.setStrong(w, p, m), w;
      };
    }, "6eeb": function(a, f, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), c = e("69f3"), i = c.get, s = c.enforce, l = String(String).split("String");
      (a.exports = function(d, g, v, p) {
        var h, y = !!p && !!p.unsafe, m = !!p && !!p.enumerable, E = !!p && !!p.noTargetGet;
        typeof v == "function" && (typeof g != "string" || o(v, "name") || r(v, "name", g), h = s(v), h.source || (h.source = l.join(typeof g == "string" ? g : ""))), d !== n ? (y ? !E && d[g] && (m = !0) : delete d[g], m ? d[g] = v : r(d, g, v)) : m ? d[g] = v : t(g, v);
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
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), c = e("1be4"), i = e("cc12"), s = e("f772"), l = ">", d = "<", g = "prototype", v = "script", p = s("IE_PROTO"), h = function() {
      }, y = function(b) {
        return d + v + l + b + d + "/" + v + l;
      }, m = function(b) {
        b.write(y("")), b.close();
        var k = b.parentWindow.Object;
        return b = null, k;
      }, E = function() {
        var b, k = i("iframe"), w = "java" + v + ":";
        return k.style.display = "none", c.appendChild(k), k.src = String(w), b = k.contentWindow.document, b.open(), b.write(y("document.F=Object")), b.close(), b.F;
      }, _ = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        _ = n ? m(n) : E();
        for (var b = t.length; b--; ) delete _[g][t[b]];
        return _();
      };
      u[p] = !0, a.exports = Object.create || function(b, k) {
        var w;
        return b !== null ? (h[g] = r(b), w = new h(), h[g] = null, w[p] = b) : w = _(), k === void 0 ? w : o(w, k);
      };
    }, "7db0": function(a, f, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(a, f, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), c = e("9112"), i = e("6eeb"), s = e("b622"), l = e("c430"), d = e("3f8c"), g = e("ae93"), v = g.IteratorPrototype, p = g.BUGGY_SAFARI_ITERATORS, h = s("iterator"), y = "keys", m = "values", E = "entries", _ = function() {
        return this;
      };
      a.exports = function(b, k, w, O, j, T, S) {
        r(w, k, O);
        var U, D, W, te = function(K) {
          if (K === j && L) return L;
          if (!p && K in J) return J[K];
          switch (K) {
            case y:
              return function() {
                return new w(this, K);
              };
            case m:
              return function() {
                return new w(this, K);
              };
            case E:
              return function() {
                return new w(this, K);
              };
          }
          return function() {
            return new w(this);
          };
        }, X = k + " Iterator", ie = !1, J = b.prototype, A = J[h] || J["@@iterator"] || j && J[j], L = !p && A || te(j), z = k == "Array" && J.entries || A;
        if (z && (U = o(z.call(new b())), v !== Object.prototype && U.next && (l || o(U) === v || (t ? t(U, v) : typeof U[h] != "function" && c(U, h, _)), u(U, X, !0, !0), l && (d[X] = _))), j == m && A && A.name !== m && (ie = !0, L = function() {
          return A.call(this);
        }), l && !S || J[h] === L || c(J, h, L), d[k] = L, j) if (D = { values: te(m), keys: T ? L : te(y), entries: te(E) }, S) for (W in D) (p || ie || !(W in J)) && i(J, W, D[W]);
        else n({ target: k, proto: !0, forced: p || ie }, D);
        return D;
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
          } catch (E) {
            var c, i, s, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, d = /@([^@]*):(\d+):(\d+)\s*$/gi, g = l.exec(E.stack) || d.exec(E.stack), v = g && g[1] || !1, p = g && g[2] || !1, h = document.location.href.replace(document.location.hash, ""), y = document.getElementsByTagName("script");
            v === h && (c = document.documentElement.outerHTML, i = new RegExp("(?:[^\\n]+?\\n){0," + (p - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), s = c.replace(i, "$1").trim());
            for (var m = 0; m < y.length; m++)
              if (y[m].readyState === "interactive" || y[m].src === v || v === h && y[m].innerHTML && y[m].innerHTML.trim() === s) return y[m];
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
      a.exports = fe;
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
        var d = /a/, g = /b*/g;
        return o.call(d, "a"), o.call(g, "a"), d.lastIndex !== 0 || g.lastIndex !== 0;
      }(), i = r.UNSUPPORTED_Y || r.BROKEN_CARET, s = /()??/.exec("")[1] !== void 0, l = c || s || i;
      l && (u = function(d) {
        var g, v, p, h, y = this, m = i && y.sticky, E = n.call(y), _ = y.source, b = 0, k = d;
        return m && (E = E.replace("y", ""), E.indexOf("g") === -1 && (E += "g"), k = String(d).slice(y.lastIndex), y.lastIndex > 0 && (!y.multiline || y.multiline && d[y.lastIndex - 1] !== `
`) && (_ = "(?: " + _ + ")", k = " " + k, b++), v = new RegExp("^(?:" + _ + ")", E)), s && (v = new RegExp("^" + _ + "$(?!\\s)", E)), c && (g = y.lastIndex), p = o.call(m ? v : y, k), m ? p ? (p.input = p.input.slice(b), p[0] = p[0].slice(b), p.index = y.lastIndex, y.lastIndex += p[0].length) : y.lastIndex = 0 : c && p && (y.lastIndex = y.global ? p.index + p[0].length : g), s && p && p.length > 1 && t.call(p[0], v, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (p[h] = void 0);
        }), p;
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
          l = e.regeneratorRuntime = s ? a.exports : {}, l.wrap = b;
          var d = "suspendedStart", g = "suspendedYield", v = "executing", p = "completed", h = {}, y = {};
          y[u] = function() {
            return this;
          };
          var m = Object.getPrototypeOf, E = m && m(m(ie([])));
          E && E !== r && o.call(E, u) && (y = E);
          var _ = j.prototype = w.prototype = Object.create(y);
          O.prototype = _.constructor = j, j.constructor = O, j[i] = O.displayName = "GeneratorFunction", l.isGeneratorFunction = function(A) {
            var L = typeof A == "function" && A.constructor;
            return !!L && (L === O || (L.displayName || L.name) === "GeneratorFunction");
          }, l.mark = function(A) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(A, j) : (A.__proto__ = j, i in A || (A[i] = "GeneratorFunction")), A.prototype = Object.create(_), A;
          }, l.awrap = function(A) {
            return { __await: A };
          }, T(S.prototype), S.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = S, l.async = function(A, L, z, K) {
            var R = new S(b(A, L, z, K));
            return l.isGeneratorFunction(L) ? R : R.next().then(function(be) {
              return be.done ? be.value : R.next();
            });
          }, T(_), _[i] = "Generator", _[u] = function() {
            return this;
          }, _.toString = function() {
            return "[object Generator]";
          }, l.keys = function(A) {
            var L = [];
            for (var z in A) L.push(z);
            return L.reverse(), function K() {
              for (; L.length; ) {
                var R = L.pop();
                if (R in A) return K.value = R, K.done = !1, K;
              }
              return K.done = !0, K;
            };
          }, l.values = ie, X.prototype = { constructor: X, reset: function(A) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(te), !A) for (var L in this) L.charAt(0) === "t" && o.call(this, L) && !isNaN(+L.slice(1)) && (this[L] = n);
          }, stop: function() {
            this.done = !0;
            var A = this.tryEntries[0], L = A.completion;
            if (L.type === "throw") throw L.arg;
            return this.rval;
          }, dispatchException: function(A) {
            if (this.done) throw A;
            var L = this;
            function z(Pe, Ne) {
              return be.type = "throw", be.arg = A, L.next = Pe, Ne && (L.method = "next", L.arg = n), !!Ne;
            }
            for (var K = this.tryEntries.length - 1; K >= 0; --K) {
              var R = this.tryEntries[K], be = R.completion;
              if (R.tryLoc === "root") return z("end");
              if (R.tryLoc <= this.prev) {
                var se = o.call(R, "catchLoc"), _e = o.call(R, "finallyLoc");
                if (se && _e) {
                  if (this.prev < R.catchLoc) return z(R.catchLoc, !0);
                  if (this.prev < R.finallyLoc) return z(R.finallyLoc);
                } else if (se) {
                  if (this.prev < R.catchLoc) return z(R.catchLoc, !0);
                } else {
                  if (!_e) throw new Error("try statement without catch or finally");
                  if (this.prev < R.finallyLoc) return z(R.finallyLoc);
                }
              }
            }
          }, abrupt: function(A, L) {
            for (var z = this.tryEntries.length - 1; z >= 0; --z) {
              var K = this.tryEntries[z];
              if (K.tryLoc <= this.prev && o.call(K, "finallyLoc") && this.prev < K.finallyLoc) {
                var R = K;
                break;
              }
            }
            R && (A === "break" || A === "continue") && R.tryLoc <= L && L <= R.finallyLoc && (R = null);
            var be = R ? R.completion : {};
            return be.type = A, be.arg = L, R ? (this.method = "next", this.next = R.finallyLoc, h) : this.complete(be);
          }, complete: function(A, L) {
            if (A.type === "throw") throw A.arg;
            return A.type === "break" || A.type === "continue" ? this.next = A.arg : A.type === "return" ? (this.rval = this.arg = A.arg, this.method = "return", this.next = "end") : A.type === "normal" && L && (this.next = L), h;
          }, finish: function(A) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var z = this.tryEntries[L];
              if (z.finallyLoc === A) return this.complete(z.completion, z.afterLoc), te(z), h;
            }
          }, catch: function(A) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var z = this.tryEntries[L];
              if (z.tryLoc === A) {
                var K = z.completion;
                if (K.type === "throw") {
                  var R = K.arg;
                  te(z);
                }
                return R;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(A, L, z) {
            return this.delegate = { iterator: ie(A), resultName: L, nextLoc: z }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function b(A, L, z, K) {
          var R = L && L.prototype instanceof w ? L : w, be = Object.create(R.prototype), se = new X(K || []);
          return be._invoke = U(A, z, se), be;
        }
        function k(A, L, z) {
          try {
            return { type: "normal", arg: A.call(L, z) };
          } catch (K) {
            return { type: "throw", arg: K };
          }
        }
        function w() {
        }
        function O() {
        }
        function j() {
        }
        function T(A) {
          ["next", "throw", "return"].forEach(function(L) {
            A[L] = function(z) {
              return this._invoke(L, z);
            };
          });
        }
        function S(A) {
          function L(R, be, se, _e) {
            var Pe = k(A[R], A, be);
            if (Pe.type !== "throw") {
              var Ne = Pe.arg, Ce = Ne.value;
              return Ce && typeof Ce == "object" && o.call(Ce, "__await") ? Promise.resolve(Ce.__await).then(function(Te) {
                L("next", Te, se, _e);
              }, function(Te) {
                L("throw", Te, se, _e);
              }) : Promise.resolve(Ce).then(function(Te) {
                Ne.value = Te, se(Ne);
              }, _e);
            }
            _e(Pe.arg);
          }
          var z;
          function K(R, be) {
            function se() {
              return new Promise(function(_e, Pe) {
                L(R, be, _e, Pe);
              });
            }
            return z = z ? z.then(se, se) : se();
          }
          this._invoke = K;
        }
        function U(A, L, z) {
          var K = d;
          return function(R, be) {
            if (K === v) throw new Error("Generator is already running");
            if (K === p) {
              if (R === "throw") throw be;
              return J();
            }
            for (z.method = R, z.arg = be; ; ) {
              var se = z.delegate;
              if (se) {
                var _e = D(se, z);
                if (_e) {
                  if (_e === h) continue;
                  return _e;
                }
              }
              if (z.method === "next") z.sent = z._sent = z.arg;
              else if (z.method === "throw") {
                if (K === d) throw K = p, z.arg;
                z.dispatchException(z.arg);
              } else z.method === "return" && z.abrupt("return", z.arg);
              K = v;
              var Pe = k(A, L, z);
              if (Pe.type === "normal") {
                if (K = z.done ? p : g, Pe.arg === h) continue;
                return { value: Pe.arg, done: z.done };
              }
              Pe.type === "throw" && (K = p, z.method = "throw", z.arg = Pe.arg);
            }
          };
        }
        function D(A, L) {
          var z = A.iterator[L.method];
          if (z === n) {
            if (L.delegate = null, L.method === "throw") {
              if (A.iterator.return && (L.method = "return", L.arg = n, D(A, L), L.method === "throw")) return h;
              L.method = "throw", L.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var K = k(z, A.iterator, L.arg);
          if (K.type === "throw") return L.method = "throw", L.arg = K.arg, L.delegate = null, h;
          var R = K.arg;
          return R ? R.done ? (L[A.resultName] = R.value, L.next = A.nextLoc, L.method !== "return" && (L.method = "next", L.arg = n), L.delegate = null, h) : R : (L.method = "throw", L.arg = new TypeError("iterator result is not an object"), L.delegate = null, h);
        }
        function W(A) {
          var L = { tryLoc: A[0] };
          1 in A && (L.catchLoc = A[1]), 2 in A && (L.finallyLoc = A[2], L.afterLoc = A[3]), this.tryEntries.push(L);
        }
        function te(A) {
          var L = A.completion || {};
          L.type = "normal", delete L.arg, A.completion = L;
        }
        function X(A) {
          this.tryEntries = [{ tryLoc: "root" }], A.forEach(W, this), this.reset(!0);
        }
        function ie(A) {
          if (A) {
            var L = A[u];
            if (L) return L.call(A);
            if (typeof A.next == "function") return A;
            if (!isNaN(A.length)) {
              var z = -1, K = function R() {
                for (; ++z < A.length; ) if (o.call(A, z)) return R.value = A[z], R.done = !1, R;
                return R.value = n, R.done = !0, R;
              };
              return K.next = K;
            }
          }
          return { next: J };
        }
        function J() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(a, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), c = e("50c4"), i = e("8418"), s = e("65f0"), l = e("1dde"), d = e("b622"), g = e("2d00"), v = d("isConcatSpreadable"), p = 9007199254740991, h = "Maximum allowed index exceeded", y = g >= 51 || !r(function() {
        var b = [];
        return b[v] = !1, b.concat()[0] !== b;
      }), m = l("concat"), E = function(b) {
        if (!t(b)) return !1;
        var k = b[v];
        return k !== void 0 ? !!k : o(b);
      }, _ = !y || !m;
      n({ target: "Array", proto: !0, forced: _ }, { concat: function(b) {
        var k, w, O, j, T, S = u(this), U = s(S, 0), D = 0;
        for (k = -1, O = arguments.length; k < O; k++) if (T = k === -1 ? S : arguments[k], E(T)) {
          if (j = c(T.length), D + j > p) throw TypeError(h);
          for (w = 0; w < j; w++, D++) w in T && i(U, D, T[w]);
        } else {
          if (D >= p) throw TypeError(h);
          i(U, D++, T);
        }
        return U.length = D, U;
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
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), c = e("65f0"), i = e("8418"), s = e("1dde"), l = s("splice"), d = Math.max, g = Math.min, v = 9007199254740991, p = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, y) {
        var m, E, _, b, k, w, O = u(this), j = t(O.length), T = r(h, j), S = arguments.length;
        if (S === 0 ? m = E = 0 : S === 1 ? (m = 0, E = j - T) : (m = S - 2, E = g(d(o(y), 0), j - T)), j + m - E > v) throw TypeError(p);
        for (_ = c(O, E), b = 0; b < E; b++) k = T + b, k in O && i(_, b, O[k]);
        if (_.length = E, m < E) {
          for (b = T; b < j - E; b++) k = b + E, w = b + m, k in O ? O[w] = O[k] : delete O[w];
          for (b = j; b > j - E + m; b--) delete O[b - 1];
        } else if (m > E) for (b = j - E; b > T; b--) k = b + E - 1, w = b + m - 1, k in O ? O[w] = O[k] : delete O[w];
        for (b = 0; b < m; b++) O[b + T] = arguments[b + 2];
        return O.length = j - E + m, _;
      } });
    }, a4b4: function(a, f, e) {
      var n = e("342f");
      a.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(a, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), c = e("4930"), i = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), g = e("861d"), v = e("825a"), p = e("7b0b"), h = e("fc6a"), y = e("c04e"), m = e("5c6c"), E = e("7c73"), _ = e("df75"), b = e("241c"), k = e("057f"), w = e("7418"), O = e("06cf"), j = e("9bf2"), T = e("d1e7"), S = e("9112"), U = e("6eeb"), D = e("5692"), W = e("f772"), te = e("d012"), X = e("90e3"), ie = e("b622"), J = e("e538"), A = e("746f"), L = e("d44e"), z = e("69f3"), K = e("b727").forEach, R = W("hidden"), be = "Symbol", se = "prototype", _e = ie("toPrimitive"), Pe = z.set, Ne = z.getterFor(be), Ce = Object[se], Te = r.Symbol, ve = o("JSON", "stringify"), Q = O.f, C = j.f, N = k.f, H = T.f, $ = D("symbols"), G = D("op-symbols"), ee = D("string-to-symbol-registry"), ye = D("symbol-to-string-registry"), ge = D("wks"), ae = r.QObject, xe = !ae || !ae[se] || !ae[se].findChild, Se = u && s(function() {
        return E(C({}, "a", { get: function() {
          return C(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(F, Y, re) {
        var pe = Q(Ce, Y);
        pe && delete Ce[Y], C(F, Y, re), pe && F !== Ce && C(Ce, Y, pe);
      } : C, Me = function(F, Y) {
        var re = $[F] = E(Te[se]);
        return Pe(re, { type: be, tag: F, description: Y }), u || (re.description = Y), re;
      }, Ee = i ? function(F) {
        return typeof F == "symbol";
      } : function(F) {
        return Object(F) instanceof Te;
      }, qe = function(F, Y, re) {
        F === Ce && qe(G, Y, re), v(F);
        var pe = y(Y, !0);
        return v(re), l($, pe) ? (re.enumerable ? (l(F, R) && F[R][pe] && (F[R][pe] = !1), re = E(re, { enumerable: m(0, !1) })) : (l(F, R) || C(F, R, m(1, {})), F[R][pe] = !0), Se(F, pe, re)) : C(F, pe, re);
      }, Ge = function(F, Y) {
        v(F);
        var re = h(Y), pe = _(re).concat(ce(re));
        return K(pe, function(Ie) {
          u && !tt.call(re, Ie) || qe(F, Ie, re[Ie]);
        }), F;
      }, Xe = function(F, Y) {
        return Y === void 0 ? E(F) : Ge(E(F), Y);
      }, tt = function(F) {
        var Y = y(F, !0), re = H.call(this, Y);
        return !(this === Ce && l($, Y) && !l(G, Y)) && (!(re || !l(this, Y) || !l($, Y) || l(this, R) && this[R][Y]) || re);
      }, V = function(F, Y) {
        var re = h(F), pe = y(Y, !0);
        if (re !== Ce || !l($, pe) || l(G, pe)) {
          var Ie = Q(re, pe);
          return !Ie || !l($, pe) || l(re, R) && re[R][pe] || (Ie.enumerable = !0), Ie;
        }
      }, Z = function(F) {
        var Y = N(h(F)), re = [];
        return K(Y, function(pe) {
          l($, pe) || l(te, pe) || re.push(pe);
        }), re;
      }, ce = function(F) {
        var Y = F === Ce, re = N(Y ? G : h(F)), pe = [];
        return K(re, function(Ie) {
          !l($, Ie) || Y && !l(Ce, Ie) || pe.push($[Ie]);
        }), pe;
      };
      if (c || (Te = function() {
        if (this instanceof Te) throw TypeError("Symbol is not a constructor");
        var F = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, Y = X(F), re = function(pe) {
          this === Ce && re.call(G, pe), l(this, R) && l(this[R], Y) && (this[R][Y] = !1), Se(this, Y, m(1, pe));
        };
        return u && xe && Se(Ce, Y, { configurable: !0, set: re }), Me(Y, F);
      }, U(Te[se], "toString", function() {
        return Ne(this).tag;
      }), U(Te, "withoutSetter", function(F) {
        return Me(X(F), F);
      }), T.f = tt, j.f = qe, O.f = V, b.f = k.f = Z, w.f = ce, J.f = function(F) {
        return Me(ie(F), F);
      }, u && (C(Te[se], "description", { configurable: !0, get: function() {
        return Ne(this).description;
      } }), t || U(Ce, "propertyIsEnumerable", tt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Te }), K(_(ge), function(F) {
        A(F);
      }), n({ target: be, stat: !0, forced: !c }, { for: function(F) {
        var Y = String(F);
        if (l(ee, Y)) return ee[Y];
        var re = Te(Y);
        return ee[Y] = re, ye[re] = Y, re;
      }, keyFor: function(F) {
        if (!Ee(F)) throw TypeError(F + " is not a symbol");
        if (l(ye, F)) return ye[F];
      }, useSetter: function() {
        xe = !0;
      }, useSimple: function() {
        xe = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !u }, { create: Xe, defineProperty: qe, defineProperties: Ge, getOwnPropertyDescriptor: V }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: Z, getOwnPropertySymbols: ce }), n({ target: "Object", stat: !0, forced: s(function() {
        w.f(1);
      }) }, { getOwnPropertySymbols: function(F) {
        return w.f(p(F));
      } }), ve) {
        var de = !c || s(function() {
          var F = Te();
          return ve([F]) != "[null]" || ve({ a: F }) != "{}" || ve(Object(F)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: de }, { stringify: function(F, Y, re) {
          for (var pe, Ie = [F], ze = 1; arguments.length > ze; ) Ie.push(arguments[ze++]);
          if (pe = Y, (g(Y) || F !== void 0) && !Ee(F)) return d(Y) || (Y = function(Je, we) {
            if (typeof pe == "function" && (we = pe.call(this, Je, we)), !Ee(we)) return we;
          }), Ie[1] = Y, ve.apply(null, Ie);
        } });
      }
      Te[se][_e] || S(Te[se], _e, Te[se].valueOf), L(Te, be), te[R] = !0;
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
      var n, r, o, t = e("d039"), u = e("e163"), c = e("9112"), i = e("5135"), s = e("b622"), l = e("c430"), d = s("iterator"), g = !1, v = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : g = !0);
      var p = n == null || t(function() {
        var h = {};
        return n[d].call(h) !== h;
      });
      p && (n = {}), l && !p || i(n, d) || c(n, d, v), a.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: g };
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
        return new Promise(function(d, g) {
          var v = l.data, p = l.headers;
          n.isFormData(v) && delete p["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var y = l.auth.username || "", m = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            p.Authorization = "Basic " + btoa(y + ":" + m);
          }
          var E = u(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(E, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var b = "getAllResponseHeaders" in h ? c(h.getAllResponseHeaders()) : null, k = l.responseType && l.responseType !== "text" ? h.response : h.responseText, w = { data: k, status: h.status, statusText: h.statusText, headers: b, config: l, request: h };
              r(d, g, w), h = null;
            }
          }, h.onabort = function() {
            h && (g(s("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            g(s("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var b = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (b = l.timeoutErrorMessage), g(s(b, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var _ = (l.withCredentials || i(E)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            _ && (p[l.xsrfHeaderName] = _);
          }
          if ("setRequestHeader" in h && n.forEach(p, function(b, k) {
            typeof v > "u" && k.toLowerCase() === "content-type" ? delete p[k] : h.setRequestHeader(k, b);
          }), n.isUndefined(l.withCredentials) || (h.withCredentials = !!l.withCredentials), l.responseType) try {
            h.responseType = l.responseType;
          } catch (b) {
            if (l.responseType !== "json") throw b;
          }
          typeof l.onDownloadProgress == "function" && h.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(b) {
            h && (h.abort(), g(b), h = null);
          }), v || (v = null), h.send(v);
        });
      };
    }, b575: function(a, f, e) {
      var n, r, o, t, u, c, i, s, l = e("da84"), d = e("06cf").f, g = e("2cf4").set, v = e("1cdc"), p = e("a4b4"), h = e("605d"), y = l.MutationObserver || l.WebKitMutationObserver, m = l.document, E = l.process, _ = l.Promise, b = d(l, "queueMicrotask"), k = b && b.value;
      k || (n = function() {
        var w, O;
        for (h && (w = E.domain) && w.exit(); r; ) {
          O = r.fn, r = r.next;
          try {
            O();
          } catch (j) {
            throw r ? t() : o = void 0, j;
          }
        }
        o = void 0, w && w.enter();
      }, v || h || p || !y || !m ? _ && _.resolve ? (i = _.resolve(void 0), s = i.then, t = function() {
        s.call(i, n);
      }) : t = h ? function() {
        E.nextTick(n);
      } : function() {
        g.call(l, n);
      } : (u = !0, c = m.createTextNode(""), new y(n).observe(c, { characterData: !0 }), t = function() {
        c.data = u = !u;
      })), a.exports = k || function(w) {
        var O = { fn: w, next: void 0 };
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
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), c = 1 .toFixed, i = Math.floor, s = function(h, y, m) {
        return y === 0 ? m : y % 2 === 1 ? s(h, y - 1, m * h) : s(h * h, y / 2, m);
      }, l = function(h) {
        for (var y = 0, m = h; m >= 4096; ) y += 12, m /= 4096;
        for (; m >= 2; ) y += 1, m /= 2;
        return y;
      }, d = function(h, y, m) {
        for (var E = -1, _ = m; ++E < 6; ) _ += y * h[E], h[E] = _ % 1e7, _ = i(_ / 1e7);
      }, g = function(h, y) {
        for (var m = 6, E = 0; --m >= 0; ) E += h[m], h[m] = i(E / y), E = E % y * 1e7;
      }, v = function(h) {
        for (var y = 6, m = ""; --y >= 0; ) if (m !== "" || y === 0 || h[y] !== 0) {
          var E = String(h[y]);
          m = m === "" ? E : m + t.call("0", 7 - E.length) + E;
        }
        return m;
      }, p = c && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        c.call({});
      });
      n({ target: "Number", proto: !0, forced: p }, { toFixed: function(h) {
        var y, m, E, _, b = o(this), k = r(h), w = [0, 0, 0, 0, 0, 0], O = "", j = "0";
        if (k < 0 || k > 20) throw RangeError("Incorrect fraction digits");
        if (b != b) return "NaN";
        if (b <= -1e21 || b >= 1e21) return String(b);
        if (b < 0 && (O = "-", b = -b), b > 1e-21) if (y = l(b * s(2, 69, 1)) - 69, m = y < 0 ? b * s(2, -y, 1) : b / s(2, y, 1), m *= 4503599627370496, y = 52 - y, y > 0) {
          for (d(w, 0, m), E = k; E >= 7; ) d(w, 1e7, 0), E -= 7;
          for (d(w, s(10, E, 1), 0), E = y - 1; E >= 23; ) g(w, 1 << 23), E -= 23;
          g(w, 1 << E), d(w, 1, 1), g(w, 2), j = v(w);
        } else d(w, 0, m), d(w, 1 << -y, 0), j = v(w) + t.call("0", k);
        return k > 0 ? (_ = j.length, j = O + (_ <= k ? "0." + t.call("0", k - _) + j : j.slice(0, _ - k) + "." + j.slice(_ - k))) : j = O + j, j;
      } });
    }, b727: function(a, f, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), c = [].push, i = function(s) {
        var l = s == 1, d = s == 2, g = s == 3, v = s == 4, p = s == 6, h = s == 7, y = s == 5 || p;
        return function(m, E, _, b) {
          for (var k, w, O = o(m), j = r(O), T = n(E, _, 3), S = t(j.length), U = 0, D = b || u, W = l ? D(m, S) : d || h ? D(m, 0) : void 0; S > U; U++) if ((y || U in j) && (k = j[U], w = T(k, U, O), s)) if (l) W[U] = w;
          else if (w) switch (s) {
            case 3:
              return !0;
            case 5:
              return k;
            case 6:
              return U;
            case 2:
              c.call(W, k);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              c.call(W, k);
          }
          return p ? -1 : g || v ? v : W;
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
        var U;
        return U = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(S) : S && S.buffer && S.buffer instanceof ArrayBuffer, U;
      }
      function l(S) {
        return typeof S == "string";
      }
      function d(S) {
        return typeof S == "number";
      }
      function g(S) {
        return S !== null && typeof S == "object";
      }
      function v(S) {
        if (r.call(S) !== "[object Object]") return !1;
        var U = Object.getPrototypeOf(S);
        return U === null || U === Object.prototype;
      }
      function p(S) {
        return r.call(S) === "[object Date]";
      }
      function h(S) {
        return r.call(S) === "[object File]";
      }
      function y(S) {
        return r.call(S) === "[object Blob]";
      }
      function m(S) {
        return r.call(S) === "[object Function]";
      }
      function E(S) {
        return g(S) && m(S.pipe);
      }
      function _(S) {
        return typeof URLSearchParams < "u" && S instanceof URLSearchParams;
      }
      function b(S) {
        return S.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function k() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function w(S, U) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), o(S)) for (var D = 0, W = S.length; D < W; D++) U.call(null, S[D], D, S);
        else for (var te in S) Object.prototype.hasOwnProperty.call(S, te) && U.call(null, S[te], te, S);
      }
      function O() {
        var S = {};
        function U(te, X) {
          v(S[X]) && v(te) ? S[X] = O(S[X], te) : v(te) ? S[X] = O({}, te) : o(te) ? S[X] = te.slice() : S[X] = te;
        }
        for (var D = 0, W = arguments.length; D < W; D++) w(arguments[D], U);
        return S;
      }
      function j(S, U, D) {
        return w(U, function(W, te) {
          S[te] = D && typeof W == "function" ? n(W, D) : W;
        }), S;
      }
      function T(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      a.exports = { isArray: o, isArrayBuffer: c, isBuffer: u, isFormData: i, isArrayBufferView: s, isString: l, isNumber: d, isObject: g, isPlainObject: v, isUndefined: t, isDate: p, isFile: h, isBlob: y, isFunction: m, isStream: E, isURLSearchParams: _, isStandardBrowserEnv: k, forEach: w, merge: O, extend: j, trim: b, stripBOM: T };
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
          var g = r(i), v = o(g), p = t(g.length), h = c ? p - 1 : 0, y = c ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in v) {
              d = v[h], h += y;
              break;
            }
            if (h += y, c ? h < 0 : p <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; c ? h >= 0 : p > h; h += y) h in v && (d = s(d, v[h], h, g));
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
        var v = /./;
        return v.exec = function() {
          var p = [];
          return p.groups = { a: "7" }, p;
        }, "".replace(v, "$<a>") !== "7";
      }), s = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), l = o("replace"), d = function() {
        return !!/./[l] && /./[l]("a", "$0") === "";
      }(), g = !r(function() {
        var v = /(?:)/, p = v.exec;
        v.exec = function() {
          return p.apply(this, arguments);
        };
        var h = "ab".split(v);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      a.exports = function(v, p, h, y) {
        var m = o(v), E = !r(function() {
          var j = {};
          return j[m] = function() {
            return 7;
          }, ""[v](j) != 7;
        }), _ = E && !r(function() {
          var j = !1, T = /a/;
          return v === "split" && (T = {}, T.constructor = {}, T.constructor[c] = function() {
            return T;
          }, T.flags = "", T[m] = /./[m]), T.exec = function() {
            return j = !0, null;
          }, T[m](""), !j;
        });
        if (!E || !_ || v === "replace" && (!i || !s || d) || v === "split" && !g) {
          var b = /./[m], k = h(m, ""[v], function(j, T, S, U, D) {
            return T.exec === t ? E && !D ? { done: !0, value: b.call(T, S, U) } : { done: !0, value: j.call(S, T, U) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), w = k[0], O = k[1];
          n(String.prototype, v, w), n(RegExp.prototype, m, p == 2 ? function(j, T) {
            return O.call(j, this, T);
          } : function(j) {
            return O.call(j, this);
          });
        }
        y && u(RegExp.prototype[m], "sham", !0);
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
        for (var s, l, d = t(i), g = u.f, v = o(d), p = {}, h = 0; v.length > h; ) l = g(d, s = v[h++]), l !== void 0 && c(p, s, l);
        return p;
      } });
    }, ddb0: function(a, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), u = e("b622"), c = u("iterator"), i = u("toStringTag"), s = o.values;
      for (var l in r) {
        var d = n[l], g = d && d.prototype;
        if (g) {
          if (g[c] !== s) try {
            t(g, c, s);
          } catch {
            g[c] = s;
          }
          if (g[i] || t(g, i, l), r[l]) {
            for (var v in o) if (g[v] !== o[v]) try {
              t(g, v, o[v]);
            } catch {
              g[v] = o[v];
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
            for (var m = 0; m < y.length && y[m] === ""; m++) ;
            for (var E = y.length - 1; E >= 0 && y[E] === ""; E--) ;
            return m > E ? [] : y.slice(m, E - m + 1);
          }
          c = f.resolve(c).substr(1), i = f.resolve(i).substr(1);
          for (var l = s(c.split("/")), d = s(i.split("/")), g = Math.min(l.length, d.length), v = g, p = 0; p < g; p++) if (l[p] !== d[p]) {
            v = p;
            break;
          }
          var h = [];
          for (p = v; p < l.length; p++) h.push("..");
          return h = h.concat(d.slice(v)), h.join("/");
        }, f.sep = "/", f.delimiter = ":", f.dirname = function(c) {
          if (typeof c != "string" && (c += ""), c.length === 0) return ".";
          for (var i = c.charCodeAt(0), s = i === 47, l = -1, d = !0, g = c.length - 1; g >= 1; --g) if (i = c.charCodeAt(g), i === 47) {
            if (!d) {
              l = g;
              break;
            }
          } else d = !1;
          return l === -1 ? s ? "/" : "." : s && l === 1 ? "/" : c.slice(0, l);
        }, f.basename = function(c, i) {
          var s = o(c);
          return i && s.substr(-1 * i.length) === i && (s = s.substr(0, s.length - i.length)), s;
        }, f.extname = function(c) {
          typeof c != "string" && (c += "");
          for (var i = -1, s = 0, l = -1, d = !0, g = 0, v = c.length - 1; v >= 0; --v) {
            var p = c.charCodeAt(v);
            if (p !== 47) l === -1 && (d = !1, l = v + 1), p === 46 ? i === -1 ? i = v : g !== 1 && (g = 1) : i !== -1 && (g = -1);
            else if (!d) {
              s = v + 1;
              break;
            }
          }
          return i === -1 || l === -1 || g === 0 || g === 1 && i === l - 1 && i === s + 1 ? "" : c.slice(i, l);
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
          var r = function(p) {
            var h = p.id, y = p.viewBox, m = p.content;
            this.id = h, this.viewBox = y, this.content = m;
          };
          r.prototype.stringify = function() {
            return this.content;
          }, r.prototype.toString = function() {
            return this.stringify();
          }, r.prototype.destroy = function() {
            var p = this;
            ["id", "viewBox", "content"].forEach(function(h) {
              return delete p[h];
            });
          };
          var o = function(p) {
            var h = !!document.importNode, y = new DOMParser().parseFromString(p, "image/svg+xml").documentElement;
            return h ? document.importNode(y, !0) : y;
          };
          function t(p, h) {
            return h = { exports: {} }, p(h, h.exports), h.exports;
          }
          var u = t(function(p, h) {
            (function(y, m) {
              p.exports = m();
            })(0, function() {
              function y(w) {
                var O = w && typeof w == "object";
                return O && Object.prototype.toString.call(w) !== "[object RegExp]" && Object.prototype.toString.call(w) !== "[object Date]";
              }
              function m(w) {
                return Array.isArray(w) ? [] : {};
              }
              function E(w, O) {
                var j = O && O.clone === !0;
                return j && y(w) ? k(m(w), w, O) : w;
              }
              function _(w, O, j) {
                var T = w.slice();
                return O.forEach(function(S, U) {
                  typeof T[U] > "u" ? T[U] = E(S, j) : y(S) ? T[U] = k(w[U], S, j) : w.indexOf(S) === -1 && T.push(E(S, j));
                }), T;
              }
              function b(w, O, j) {
                var T = {};
                return y(w) && Object.keys(w).forEach(function(S) {
                  T[S] = E(w[S], j);
                }), Object.keys(O).forEach(function(S) {
                  y(O[S]) && w[S] ? T[S] = k(w[S], O[S], j) : T[S] = E(O[S], j);
                }), T;
              }
              function k(w, O, j) {
                var T = Array.isArray(O), S = j || { arrayMerge: _ }, U = S.arrayMerge || _;
                return T ? Array.isArray(w) ? U(w, O, j) : E(O, j) : b(w, O, j);
              }
              return k.all = function(w, O) {
                if (!Array.isArray(w) || w.length < 2) throw new Error("first argument should be an array with at least two elements");
                return w.reduce(function(j, T) {
                  return k(j, T, O);
                });
              }, k;
            });
          }), c = t(function(p, h) {
            var y = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = y, p.exports = h.default;
          }), i = function(p) {
            return Object.keys(p).map(function(h) {
              var y = p[h].toString().replace(/"/g, "&quot;");
              return h + '="' + y + '"';
            }).join(" ");
          }, s = c.svg, l = c.xlink, d = {};
          d[s.name] = s.uri, d[l.name] = l.uri;
          var g = function(p, h) {
            p === void 0 && (p = "");
            var y = u(d, {}), m = i(y);
            return "<svg " + m + ">" + p + "</svg>";
          }, v = function(p) {
            function h() {
              p.apply(this, arguments);
            }
            p && (h.__proto__ = p), h.prototype = Object.create(p && p.prototype), h.prototype.constructor = h;
            var y = { isMounted: {} };
            return y.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(m) {
              return new h({ id: m.getAttribute("id"), viewBox: m.getAttribute("viewBox"), content: m.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), p.prototype.destroy.call(this);
            }, h.prototype.mount = function(m) {
              if (this.isMounted) return this.node;
              var E = typeof m == "string" ? document.querySelector(m) : m, _ = this.render();
              return this.node = _, E.appendChild(_), _;
            }, h.prototype.render = function() {
              var m = this.stringify();
              return o(g(m)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, y), h;
          }(r);
          return v;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(a, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), c = e("9bf2").f, i = e("e893"), s = o.Symbol;
      if (r && typeof s == "function" && (!("description" in s.prototype) || s().description !== void 0)) {
        var l = {}, d = function() {
          var y = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), m = this instanceof d ? new s(y) : y === void 0 ? s() : s(y);
          return y === "" && (l[m] = !0), m;
        };
        i(d, s);
        var g = d.prototype = s.prototype;
        g.constructor = d;
        var v = g.toString, p = String(s("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        c(g, "description", { configurable: !0, get: function() {
          var y = u(this) ? this.valueOf() : this, m = v.call(y);
          if (t(l, y)) return "";
          var E = p ? m.slice(7, -1) : m.replace(h, "$1");
          return E === "" ? void 0 : E;
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
        var l = s(this), d = l.target, g = l.kind, v = l.index++;
        return !d || v >= d.length ? (l.target = void 0, { value: void 0, done: !0 }) : g == "keys" ? { value: v, done: !1 } : g == "values" ? { value: d[v], done: !1 } : { value: [v, d[v]], done: !1 };
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
      var n, r, o, t, u = e("23e7"), c = e("c430"), i = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), g = e("e2cc"), v = e("d44e"), p = e("2626"), h = e("861d"), y = e("1c0b"), m = e("19aa"), E = e("8925"), _ = e("2266"), b = e("1c7e"), k = e("4840"), w = e("2cf4").set, O = e("b575"), j = e("cdf9"), T = e("44de"), S = e("f069"), U = e("e667"), D = e("69f3"), W = e("94ca"), te = e("b622"), X = e("605d"), ie = e("2d00"), J = te("species"), A = "Promise", L = D.get, z = D.set, K = D.getterFor(A), R = l, be = i.TypeError, se = i.document, _e = i.process, Pe = s("fetch"), Ne = S.f, Ce = Ne, Te = !!(se && se.createEvent && i.dispatchEvent), ve = typeof PromiseRejectionEvent == "function", Q = "unhandledrejection", C = "rejectionhandled", N = 0, H = 1, $ = 2, G = 1, ee = 2, ye = W(A, function() {
        var V = E(R) !== String(R);
        if (!V && (ie === 66 || !X && !ve) || c && !R.prototype.finally) return !0;
        if (ie >= 51 && /native code/.test(R)) return !1;
        var Z = R.resolve(1), ce = function(F) {
          F(function() {
          }, function() {
          });
        }, de = Z.constructor = {};
        return de[J] = ce, !(Z.then(function() {
        }) instanceof ce);
      }), ge = ye || !b(function(V) {
        R.all(V).catch(function() {
        });
      }), ae = function(V) {
        var Z;
        return !(!h(V) || typeof (Z = V.then) != "function") && Z;
      }, xe = function(V, Z) {
        if (!V.notified) {
          V.notified = !0;
          var ce = V.reactions;
          O(function() {
            for (var de = V.value, F = V.state == H, Y = 0; ce.length > Y; ) {
              var re, pe, Ie, ze = ce[Y++], Je = F ? ze.ok : ze.fail, we = ze.resolve, Ze = ze.reject, He = ze.domain;
              try {
                Je ? (F || (V.rejection === ee && qe(V), V.rejection = G), Je === !0 ? re = de : (He && He.enter(), re = Je(de), He && (He.exit(), Ie = !0)), re === ze.promise ? Ze(be("Promise-chain cycle")) : (pe = ae(re)) ? pe.call(re, we, Ze) : we(re)) : Ze(de);
              } catch (ft) {
                He && !Ie && He.exit(), Ze(ft);
              }
            }
            V.reactions = [], V.notified = !1, Z && !V.rejection && Me(V);
          });
        }
      }, Se = function(V, Z, ce) {
        var de, F;
        Te ? (de = se.createEvent("Event"), de.promise = Z, de.reason = ce, de.initEvent(V, !1, !0), i.dispatchEvent(de)) : de = { promise: Z, reason: ce }, !ve && (F = i["on" + V]) ? F(de) : V === Q && T("Unhandled promise rejection", ce);
      }, Me = function(V) {
        w.call(i, function() {
          var Z, ce = V.facade, de = V.value, F = Ee(V);
          if (F && (Z = U(function() {
            X ? _e.emit("unhandledRejection", de, ce) : Se(Q, ce, de);
          }), V.rejection = X || Ee(V) ? ee : G, Z.error)) throw Z.value;
        });
      }, Ee = function(V) {
        return V.rejection !== G && !V.parent;
      }, qe = function(V) {
        w.call(i, function() {
          var Z = V.facade;
          X ? _e.emit("rejectionHandled", Z) : Se(C, Z, V.value);
        });
      }, Ge = function(V, Z, ce) {
        return function(de) {
          V(Z, de, ce);
        };
      }, Xe = function(V, Z, ce) {
        V.done || (V.done = !0, ce && (V = ce), V.value = Z, V.state = $, xe(V, !0));
      }, tt = function(V, Z, ce) {
        if (!V.done) {
          V.done = !0, ce && (V = ce);
          try {
            if (V.facade === Z) throw be("Promise can't be resolved itself");
            var de = ae(Z);
            de ? O(function() {
              var F = { done: !1 };
              try {
                de.call(Z, Ge(tt, F, V), Ge(Xe, F, V));
              } catch (Y) {
                Xe(F, Y, V);
              }
            }) : (V.value = Z, V.state = H, xe(V, !1));
          } catch (F) {
            Xe({ done: !1 }, F, V);
          }
        }
      };
      ye && (R = function(V) {
        m(this, R, A), y(V), n.call(this);
        var Z = L(this);
        try {
          V(Ge(tt, Z), Ge(Xe, Z));
        } catch (ce) {
          Xe(Z, ce);
        }
      }, n = function(V) {
        z(this, { type: A, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: N, value: void 0 });
      }, n.prototype = g(R.prototype, { then: function(V, Z) {
        var ce = K(this), de = Ne(k(this, R));
        return de.ok = typeof V != "function" || V, de.fail = typeof Z == "function" && Z, de.domain = X ? _e.domain : void 0, ce.parent = !0, ce.reactions.push(de), ce.state != N && xe(ce, !1), de.promise;
      }, catch: function(V) {
        return this.then(void 0, V);
      } }), r = function() {
        var V = new n(), Z = L(V);
        this.promise = V, this.resolve = Ge(tt, Z), this.reject = Ge(Xe, Z);
      }, S.f = Ne = function(V) {
        return V === R || V === o ? new r(V) : Ce(V);
      }, c || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(V, Z) {
        var ce = this;
        return new R(function(de, F) {
          t.call(ce, de, F);
        }).then(V, Z);
      }, { unsafe: !0 }), typeof Pe == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(V) {
        return j(R, Pe.apply(i, arguments));
      } }))), u({ global: !0, wrap: !0, forced: ye }, { Promise: R }), v(R, A, !1, !0), p(A), o = s(A), u({ target: A, stat: !0, forced: ye }, { reject: function(V) {
        var Z = Ne(this);
        return Z.reject.call(void 0, V), Z.promise;
      } }), u({ target: A, stat: !0, forced: c || ye }, { resolve: function(V) {
        return j(c && this === o ? R : this, V);
      } }), u({ target: A, stat: !0, forced: ge }, { all: function(V) {
        var Z = this, ce = Ne(Z), de = ce.resolve, F = ce.reject, Y = U(function() {
          var re = y(Z.resolve), pe = [], Ie = 0, ze = 1;
          _(V, function(Je) {
            var we = Ie++, Ze = !1;
            pe.push(void 0), ze++, re.call(Z, Je).then(function(He) {
              Ze || (Ze = !0, pe[we] = He, --ze || de(pe));
            }, F);
          }), --ze || de(pe);
        });
        return Y.error && F(Y.value), ce.promise;
      }, race: function(V) {
        var Z = this, ce = Ne(Z), de = ce.reject, F = U(function() {
          var Y = y(Z.resolve);
          _(V, function(re) {
            Y.call(Z, re).then(ce.resolve, de);
          });
        });
        return F.error && de(F.value), ce.promise;
      } });
    }, e893: function(a, f, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      a.exports = function(u, c) {
        for (var i = r(c), s = t.f, l = o.f, d = 0; d < i.length; d++) {
          var g = i[d];
          n(u, g) || s(u, g, l(c, g));
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
      }, g = function(y, m) {
        if (!r(y)) return typeof y == "symbol" ? y : (typeof y == "string" ? "S" : "P") + y;
        if (!o(y, i)) {
          if (!l(y)) return "F";
          if (!m) return "E";
          d(y);
        }
        return y[i].objectID;
      }, v = function(y, m) {
        if (!o(y, i)) {
          if (!l(y)) return !0;
          if (!m) return !1;
          d(y);
        }
        return y[i].weakData;
      }, p = function(y) {
        return c && h.REQUIRED && l(y) && !o(y, i) && d(y), y;
      }, h = a.exports = { REQUIRED: !1, fastKey: g, getWeakData: v, onFreeze: p };
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
      function i(x, M, P, B, q, ne) {
        var le = Object(t.resolveComponent)("Result"), ue = Object(t.resolveComponent)("DefaultBoard"), he = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Ue = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: M[1] || (M[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(le, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ue, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(he, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Ue]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(x, M, P) {
        return M in x ? Object.defineProperty(x, M, { value: P, enumerable: !0, configurable: !0, writable: !0 }) : x[M] = P, x;
      }
      function l(x, M) {
        var P = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var B = Object.getOwnPropertySymbols(x);
          M && (B = B.filter(function(q) {
            return Object.getOwnPropertyDescriptor(x, q).enumerable;
          })), P.push.apply(P, B);
        }
        return P;
      }
      function d(x) {
        for (var M = 1; M < arguments.length; M++) {
          var P = arguments[M] != null ? arguments[M] : {};
          M % 2 ? l(Object(P), !0).forEach(function(B) {
            s(x, B, P[B]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(P)) : l(Object(P)).forEach(function(B) {
            Object.defineProperty(x, B, Object.getOwnPropertyDescriptor(P, B));
          });
        }
        return x;
      }
      function g(x, M) {
        (M == null || M > x.length) && (M = x.length);
        for (var P = 0, B = new Array(M); P < M; P++) B[P] = x[P];
        return B;
      }
      function v(x) {
        if (Array.isArray(x)) return g(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function p(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function h(x, M) {
        if (x) {
          if (typeof x == "string") return g(x, M);
          var P = Object.prototype.toString.call(x).slice(8, -1);
          return P === "Object" && x.constructor && (P = x.constructor.name), P === "Map" || P === "Set" ? Array.from(x) : P === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(P) ? g(x, M) : void 0;
        }
      }
      function y() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function m(x) {
        return v(x) || p(x) || h(x) || y();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function E(x, M) {
        if (!(x instanceof M)) throw new TypeError("Cannot call a class as a function");
      }
      function _(x, M) {
        for (var P = 0; P < M.length; P++) {
          var B = M[P];
          B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(x, B.key, B);
        }
      }
      function b(x, M, P) {
        return M && _(x.prototype, M), x;
      }
      var k = function() {
        function x() {
          E(this, x), this.listeners = {};
        }
        return b(x, [{ key: "on", value: function(M, P) {
          var B = this, q = this.listeners[M];
          return q || (q = []), q.push(P), this.listeners[M] = q, function() {
            B.remove(M, P);
          };
        } }, { key: "emit", value: function(M) {
          var P = this.listeners[M];
          if (Array.isArray(P)) {
            for (var B = arguments.length, q = new Array(B > 1 ? B - 1 : 0), ne = 1; ne < B; ne++) q[ne - 1] = arguments[ne];
            for (var le = 0; le < P.length; le++) {
              var ue = P[le];
              typeof ue == "function" && ue.apply(void 0, q);
            }
          }
        } }, { key: "remove", value: function(M, P) {
          if (P) {
            var B = this.listeners[M];
            if (!B) return;
            B = B.filter(function(q) {
              return q !== P;
            }), this.listeners[M] = B;
          } else this.listeners[M] = null, delete this.listeners[M];
        } }]), x;
      }(), w = new k(), O = { mounted: function(x, M, P) {
        var B = x.parentNode;
        x.onmousedown = function(q) {
          var ne = q.clientX - B.offsetLeft, le = q.clientY - B.offsetTop;
          document.onmousemove = function(ue) {
            var he = ue.clientX - ne, Re = ue.clientY - le;
            B.style.left = he + "px", B.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(q) {
          var ne = q.touches[0].pageX, le = q.touches[0].pageY, ue = ne - B.offsetLeft, he = le - B.offsetTop;
          document.ontouchmove = function(Re) {
            var Ue = Re.touches[0].pageX, Ve = Re.touches[0].pageY, We = Ue - ue, it = Ve - he;
            B.style.left = We + "px", B.style.top = it + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, j = O, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, U = { class: "key-board-result-show" }, D = { class: "key-board-result-show-container" }, W = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var te = T(function(x, M, P, B, q, ne) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", U, [Object(t.createVNode)("div", D, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(le, ue) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ue, onClick: function(he) {
            return x.selectWord(le);
          } }, Object(t.toDisplayString)(ue + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", W, [Object(t.createVNode)("span", { style: x.getStyle, onClick: M[1] || (M[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: M[2] || (M[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), X = (e("1276"), e("6062"), e("5319"), function(x, M) {
        for (var P = 0, B = []; P < x.length; ) B.push(x.slice(P, P += M));
        return B;
      }), ie = Symbol("KEYBOARD_CONTEXT"), J = function(x) {
        Object(t.provide)(ie, x);
      }, A = function() {
        return Object(t.inject)(ie);
      }, L = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, M) {
        var P = M.emit, B = A(), q = Object(t.computed)(function() {
          return { borderTopColor: B == null ? void 0 : B.color };
        }), ne = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          ne.showIndex !== 0 && (ne.showIndex -= 1);
        }
        function ue() {
          ne.showIndex !== ne.showList.length - 1 && (ne.showIndex += 1);
        }
        function he() {
          ne.showIndex = 0, ne.showList = [], ne.valueList = [], w.emit("resultReset");
        }
        function Re(Ue) {
          he(), P("change", Ue);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Ue) {
          var Ve;
          ne.showIndex = 0, ne.valueList = (Ue == null || (Ve = Ue.value) === null || Ve === void 0 ? void 0 : Ve.split("")) || [], ne.valueList.length !== 0 ? ne.showList = X(ne.valueList, 11) : ne.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          w.on("keyBoardChange", function(Ue) {
            w.emit("updateBound"), ne.status = Ue, he();
          }), w.on("getWordsFromServer", function(Ue) {
            var Ve = Array.from(new Set(Ue.replace(/\s+/g, "").split("")));
            ne.valueList = Ve, ne.showList = X(Ve, 11);
          });
        }), Object(t.onUnmounted)(function() {
          w.remove("keyBoardChange"), w.remove("getWordsFromServer");
        }), d({ color: B == null ? void 0 : B.color, upper: le, lower: ue, getStyle: q, selectWord: Re }, Object(t.toRefs)(ne));
      } });
      e("e66c"), L.render = te, L.__scopeId = "data-v-02e63132";
      var z = L, K = e("bc3a"), R = e.n(K), be = 15e3, se = function(x) {
        R.a.defaults.baseURL = x, R.a.defaults.timeout = be, R.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function _e(x, M, P, B, q, ne) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Pe = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var M = A(), P = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: M == null ? void 0 : M.color, iconName: P };
      } });
      e("38cd"), Pe.render = _e;
      var Ne = Pe, Ce = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Te = { class: "hand-write-board" }, ve = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Q = Ce(function(x, M, P, B, q, ne) {
        var le = Object(t.resolveComponent)("PaintBoard"), ue = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Te, [Object(t.createVNode)(le, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", ve, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(he) {
          return Object(t.openBlock)(), Object(t.createBlock)(ue, { key: he.type, type: he.type, data: he.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), C = { class: "paint-board" };
      function N(x, M, P, B, q, ne) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", C, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: M[1] || (M[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: M[2] || (M[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: M[3] || (M[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: M[4] || (M[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: M[5] || (M[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: M[6] || (M[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: M[7] || (M[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function H(x, M, P, B, q, ne, le) {
        try {
          var ue = x[ne](le), he = ue.value;
        } catch (Re) {
          return void P(Re);
        }
        ue.done ? M(he) : Promise.resolve(he).then(B, q);
      }
      function $(x) {
        return function() {
          var M = this, P = arguments;
          return new Promise(function(B, q) {
            var ne = x.apply(M, P);
            function le(he) {
              H(ne, B, q, le, ue, "next", he);
            }
            function ue(he) {
              H(ne, B, q, le, ue, "throw", he);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var G, ee, ye = function() {
        var x = $(regeneratorRuntime.mark(function M(P, B, q, ne) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, R.a.post("", { lib: ne, lpXis: P, lpYis: B, lpCis: q });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, M);
        }));
        return function(M, P, B, q) {
          return x.apply(this, arguments);
        };
      }(), ge = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var M = A(), P = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), B = Object(t.ref)(null);
        function q() {
          return ne.apply(this, arguments);
        }
        function ne() {
          return ne = $(regeneratorRuntime.mark(function Ae() {
            var Qe, $e;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, ye(P.clickX, P.clickY, P.clickC, x.lib);
                case 2:
                  Qe = Ye.sent, $e = Qe.data, w.emit("getWordsFromServer", ($e == null ? void 0 : $e.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ae);
          })), ne.apply(this, arguments);
        }
        function le() {
          B.value && G && (P.clickX = [], P.clickY = [], P.clickC = [], G.clearRect(0, 0, P.width, P.height));
        }
        function ue(Ae) {
          if (Ae.type.includes("mouse")) {
            var Qe = Ae;
            return Math.floor(Qe.clientX - P.x);
          }
          if (Ae.type.includes("touch")) {
            var $e, Ye = Ae;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientX) - P.x);
          }
          return 0;
        }
        function he(Ae) {
          if (Ae.type.includes("mouse")) {
            var Qe = Ae;
            return Math.floor(Qe.clientY - P.y);
          }
          if (Ae.type.includes("touch")) {
            var $e, Ye = Ae;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientY) - P.y);
          }
          return 0;
        }
        function Re(Ae) {
          if (G) {
            P.isMouseDown = !0;
            var Qe = ue(Ae), $e = he(Ae);
            clearTimeout(ee), P.oldX = Qe, P.oldY = $e, G.beginPath();
          }
        }
        function Ue(Ae) {
          if (G && (Ae.preventDefault(), P.isMouseDown)) {
            var Qe = ue(Ae), $e = he(Ae);
            P.clickX.push(Qe), P.clickY.push($e), P.clickC.push(0), G.strokeStyle = M == null ? void 0 : M.color, G.fillStyle = M == null ? void 0 : M.color, G.lineWidth = 4, G.lineCap = "round", G.moveTo(P.oldX, P.oldY), G.lineTo(Qe, $e), G.stroke(), P.oldX = Qe, P.oldY = $e;
          }
        }
        function Ve() {
          P.isMouseDown && (P.isMouseDown = !1, ee = setTimeout(function() {
            le();
          }, 1500), P.clickC.pop(), P.clickC.push(1), q());
        }
        function We() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ae = document.querySelector(".paint-board").getBoundingClientRect();
              P.x = Ae.x, P.y = Ae.y, P.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), P.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function it() {
          var Ae;
          G = (Ae = B.value) === null || Ae === void 0 ? void 0 : Ae.getContext("2d"), le(), We(), window.addEventListener("animationend", We), window.addEventListener("resize", We), window.addEventListener("scroll", We);
        }
        return Object(t.onMounted)(function() {
          it(), w.on("updateBound", function() {
            We();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", We), window.removeEventListener("resize", We), window.removeEventListener("scroll", We), w.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(P)), {}, { move: Ue, down: Re, mouseup: Ve, canvasRef: B });
      } });
      ge.render = N;
      var ae = ge;
      function xe(x, M, P, B, q, ne) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: M[1] || (M[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: M[2] || (M[2] = function(ue) {
          return x.isHoverStatus = !0;
        }), onMouseleave: M[3] || (M[3] = function(ue) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Se = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Ne }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, M) {
        var P = M.emit, B = A(), q = Object(t.ref)(!1), ne = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), le = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || q.value ? { color: "#f5f5f5", background: B == null ? void 0 : B.color } : { color: B == null ? void 0 : B.color, background: "#f5f5f5" };
        });
        function ue(he) {
          he.preventDefault(), P("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: q, getStyle: le, getCode: ne, click: ue };
      } });
      e("de23"), Se.render = xe;
      var Me = Se, Ee = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ae, KeyCodeButton: Me }, setup: function(x, M) {
        var P = M.emit, B = A(), q = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ne(le) {
          var ue = le.data, he = le.type;
          switch (he) {
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
              P("trigger", { data: ue, type: he });
              break;
          }
        }
        return d({ click: ne }, Object(t.toRefs)(q));
      } });
      e("9aaf"), Ee.render = Q, Ee.__scopeId = "data-v-1b5e0983";
      var qe = Ee, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Xe = { class: "default-key-board" }, tt = { class: "line line4" };
      Object(t.popScopeId)();
      var V = Ge(function(x, M, P, B, q, ne) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Xe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(ue, he) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(he + 1)], key: he }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ue, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: x.isUpper, key: Re, type: Re, data: Re, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", tt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(ue) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ue.type, type: ue.type, data: ue.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), Z = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), ce = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, de = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, F = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], Y = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Me }, emits: ["translate", "trigger", "change"], setup: function(x, M) {
        var P = M.emit, B = A(), q = Object(t.reactive)({ lineList: [ce.line1, ce.line2, ce.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ne() {
          var ue;
          q.line4 = JSON.parse(JSON.stringify(F)), B != null && (ue = B.modeList) !== null && ue !== void 0 && ue.find(function(he) {
            return he === "handwrite";
          }) && B !== null && B !== void 0 && B.handApi && q.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ue) {
          var he = ue.data, Re = ue.type;
          switch (Re) {
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
                var Ue;
                w.emit("keyBoardChange", "number");
                var Ve = JSON.parse(JSON.stringify(de.line3));
                B != null && (Ue = B.modeList) !== null && Ue !== void 0 && Ue.find(function(We) {
                  return We === "symbol";
                }) || (Ve.shift(), Ve.unshift("+")), q.lineList = [de.line1, de.line2, Ve];
              } else w.emit("keyBoardChange", q.isCn ? "CN" : "EN"), q.lineList = [ce.line1, ce.line2, ce.line3];
              break;
            case "#+=":
              q.isSymbol = !q.isSymbol, q.isSymbol ? (w.emit("keyBoardChange", "symbol"), q.lineList = [Z.line1, Z.line2, Z.line3]) : (w.emit("keyBoardChange", "number"), q.lineList = [de.line1, de.line2, de.line3]);
              break;
            case "handwrite":
            case "delete":
              q.isCn && Re === "delete" && q.oldVal ? (q.oldVal = q.oldVal.substr(0, q.oldVal.length - 1), P("translate", q.oldVal)) : (Re === "handwrite" && w.emit("keyBoardChange", "handwrite"), P("trigger", { data: he, type: Re }));
              break;
            default:
              !q.isCn || q.isNum || q.isSymbol ? P("change", he) : (P("translate", q.oldVal + he), q.oldVal = q.oldVal + he);
              break;
          }
        }
        return ne(), Object(t.onMounted)(function() {
          w.on("resultReset", function() {
            q.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(q)), {}, { click: le });
      } });
      e("f8b0"), Y.render = V, Y.__scopeId = "data-v-4b78e5a1";
      var re = Y, pe = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ie = e("ec57"), ze = function(x) {
        return x.keys().map(x);
      };
      ze(Ie);
      var Je = [], we = null, Ze = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: j }, components: { Result: z, SvgIcon: Ne, HandBoard: qe, DefaultBoard: re }, setup: function(x, M) {
        var P = M.emit, B = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), q = Object(t.ref)(null);
        function ne(ke) {
          var je, Le;
          switch (Object(t.nextTick)(function() {
            w.emit("keyBoardChange", "CN");
          }), ke) {
            case "en":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Be;
                (Be = q.value) === null || Be === void 0 || Be.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Be;
                (Be = q.value) === null || Be === void 0 || Be.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (je = x.modeList) !== null && je !== void 0 && je.find(function(Be) {
                return Be === "handwrite";
              }) && x.handApi ? (B.showMode = "handwrite", Object(t.nextTick)(function() {
                w.emit("keyBoardChange", "handwrite");
              })) : B.showMode = "default";
              break;
            case "symbol":
              B.showMode = "default", (Le = x.modeList) !== null && Le !== void 0 && Le.find(function(Be) {
                return Be === "symbol";
              }) && Object(t.nextTick)(function() {
                var Be, et;
                (Be = q.value) === null || Be === void 0 || Be.click({ data: ".?123", type: "change2num" }), (et = q.value) === null || et === void 0 || et.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              B.showMode = "default";
              break;
          }
        }
        function le(ke) {
          if (B.visible = !0, we = ke.target, ne(we.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var je = document.querySelector(".key-board-modal");
            je.style.display = "block";
          }
        }
        function ue() {
          if (we && we.blur(), we = null, B.visible = !1, P("closed"), B.showMode = "default", B.resultVal = {}, document.querySelector(".key-board-modal")) {
            var ke = document.querySelector(".key-board-modal");
            ke.style.display = "none";
          }
        }
        function he() {
          x.closeOnClickModal && ue(), P("modalClick");
        }
        function Re() {
          var ke;
          if (document.querySelector(".key-board-modal")) {
            var je;
            (je = document.querySelector(".key-board-modal")) === null || je === void 0 || je.addEventListener("click", he);
          } else {
            var Le = document.createElement("div");
            Le.className = "key-board-modal", Le.style.display = "none", (ke = document.querySelector("body")) === null || ke === void 0 || ke.appendChild(Le), Le.addEventListener("click", he);
          }
        }
        function Ue() {
          x.handApi && se(x.handApi), [].concat(m(document.querySelectorAll("input")), m(document.querySelectorAll("textarea"))).forEach(function(ke) {
            ke.getAttribute("data-mode") !== null && (Je.push(ke), ke.addEventListener("focus", le), x.blurHide && ke.addEventListener("blur", ue));
          });
        }
        function Ve(ke) {
          if (!we) return "";
          var je = we, Le = je.selectionStart, Be = je.selectionEnd;
          if (!Le || !Be) return "";
          var et = ke.substring(0, Le - 1) + ke.substring(Be);
          return je.value = et, je.focus(), je.selectionStart = Le - 1, je.selectionEnd = Le - 1, et;
        }
        function We(ke) {
          var je = ke.type;
          switch (je) {
            case "handwrite":
              B.showMode = "handwrite";
              break;
            case "delete":
              if (!we) return;
              var Le = Ve(we.value);
              we.value = Le, P("change", Le, we.getAttribute("data-prop") || we);
              break;
          }
        }
        function it(ke, je) {
          if (!we) return "";
          var Le = we, Be = Le.selectionStart || 0, et = Le.selectionEnd || 0, mt = ke.substring(0, Be) + je + ke.substring(et);
          return Le.value = mt, Le.focus(), Le.selectionStart = Be + je.length, Le.selectionEnd = Be + je.length, mt;
        }
        function Ae(ke) {
          if (we) {
            var je = it(we.value, ke);
            we.value = je, P("change", je, we.getAttribute("data-prop") || we), P("keyChange", ke, we.getAttribute("data-prop") || we);
          }
        }
        function Qe(ke) {
          var je = new RegExp("^".concat(ke, "\\w*")), Le = Object.keys(pe).filter(function(Be) {
            return je.test(Be);
          }).sort();
          B.resultVal = { code: ke, value: ke ? Le.length > 1 ? Le.reduce(function(Be, et) {
            return Be + pe[et];
          }, "") : pe[Le[0]] : "" }, we && P("keyChange", ke, we.getAttribute("data-prop") || we);
        }
        function $e() {
          Ue();
        }
        function Ye() {
          return we;
        }
        return Object(t.onMounted)(function() {
          x.modal && Re(), Ue(), w.on("resultReset", function() {
            B.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var ke;
          (ke = document.querySelector(".key-board-modal")) === null || ke === void 0 || ke.removeEventListener("click", he), Je.forEach(function(je) {
            je.removeEventListener("focus", le), je.removeEventListener("blur", ue);
          });
        }), J(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          ue();
        }, changeDefaultBoard: function() {
          B.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(B)), {}, { defaultBoardRef: q, getCurrentInput: Ye, translate: Qe, reSignUp: $e, trigger: We, change: Ae });
      } });
      Ze.render = i;
      var He = Ze;
      He.install = function(x) {
        x.component(He.name, He);
      };
      var ft = He, Ot = ft;
      f.default = Ot;
    }, fb6a: function(a, f, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), c = e("fc6a"), i = e("8418"), s = e("b622"), l = e("1dde"), d = l("slice"), g = s("species"), v = [].slice, p = Math.max;
      n({ target: "Array", proto: !0, forced: !d }, { slice: function(h, y) {
        var m, E, _, b = c(this), k = u(b.length), w = t(h, k), O = t(y === void 0 ? k : y, k);
        if (o(b) && (m = b.constructor, typeof m != "function" || m !== Array && !o(m.prototype) ? r(m) && (m = m[g], m === null && (m = void 0)) : m = void 0, m === Array || m === void 0)) return v.call(b, w, O);
        for (E = new (m === void 0 ? Array : m)(p(O - w, 0)), _ = 0; w < O; w++, _++) w in b && i(E, _, b[w]);
        return E.length = _, E;
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
})(St);
var Kn = St.exports;
const Gn = /* @__PURE__ */ Hn(Kn);
Ct({
  components: { KeyBoard: Gn },
  setup() {
    function Oe(oe, fe) {
      console.log("change value ---->", oe), console.log("change input dom ---->", fe);
    }
    return {
      change: Oe
    };
  }
});
const Yn = { class: "app-container" }, Jn = {
  __name: "App",
  setup(Oe) {
    return At(), (oe, fe) => (De(), Fe("div", Yn, [
      fe[0] || (fe[0] = I("h1", null, "涪特智能养护台车控制系统", -1)),
      rt(dn),
      rt(Wn),
      rt(Jt),
      rt($n)
    ]));
  }
};
export {
  Jn as default
};
