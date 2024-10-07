import jt, { ref as be, onMounted as ct, provide as dt, readonly as pt, inject as vt, watch as lt, openBlock as De, createElementBlock as Fe, createElementVNode as I, toDisplayString as Ke, Fragment as at, renderList as ut, normalizeClass as nt, createCommentVNode as ht, reactive as gt, createVNode as rt, computed as Et, createTextVNode as yt, normalizeStyle as _t, defineComponent as Ct } from "vue";
const bt = Symbol(), wt = Symbol(), xt = Symbol();
function Tt(je, ie) {
  je && je.messageSignal ? je.messageSignal.connect((fe) => {
    try {
      const i = JSON.parse(fe);
      ie.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), ie.value = { type: "unknown", content: fe };
    }
  }) : console.error("messageSignal not found on bridge");
}
function At() {
  const je = be(null), ie = be(null), fe = be("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      je.value = f, ie.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), Tt(ie.value, fe), ie.value && typeof ie.value.vueReady == "function" ? ie.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ct(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), dt(bt, pt(je)), dt(wt, pt(ie)), dt(xt, pt(fe));
}
function ot() {
  const je = vt(bt), ie = vt(wt), fe = vt(xt);
  return (!je || !ie || !fe) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: je,
    bridge: ie,
    message: fe,
    sendToPyQt: (f, e) => {
      if (console.log(`Attempting to call ${f} with args:`, e), ie && ie.value)
        if (typeof ie.value.sendToPyQt == "function")
          try {
            ie.value.sendToPyQt(f, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(ie.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const st = (je, ie) => {
  const fe = je.__vccOpts || je;
  for (const [i, f] of ie)
    fe[i] = f;
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
  setup(je, { emit: ie }) {
    const fe = je, i = ie, f = be([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = be("");
    lt(() => fe.showKeyboard, (r) => {
      r && (e.value = fe.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => je.showKeyboard ? (De(), Fe("div", Lt, [
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
  setup(je) {
    const { sendToPyQt: ie } = ot(), fe = gt({
      isPyQtWebEngine: !1
    }), i = be(30), f = be(10), e = be(80), n = be(20), r = be(!1), o = be(null), t = be("");
    ct(() => {
      if (fe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, fe.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = ot();
        lt(g, (v) => {
          if (v && v.type === "update_limit_settings")
            try {
              const p = JSON.parse(v.content);
              i.value = p.temp_upper, f.value = p.temp_lower, e.value = p.humidity_upper, n.value = p.humidity_lower, console.log("Sensor Settings updated:", p);
            } catch (p) {
              console.error("Failed to parse sensor settings data:", p);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (g, v) => {
      const p = g === "tempUpper" ? i : g === "tempLower" ? f : g === "humidityUpper" ? e : n;
      p.value = (p.value || 0) + v, g.startsWith("temp") ? c(g === "tempUpper" ? "upper" : "lower") : a(g === "humidityUpper" ? "upper" : "lower");
    }, c = (g) => {
      i.value === "" && (i.value = f.value + 1), f.value === "" && (f.value = i.value - 1), g === "upper" ? i.value = Math.max(f.value + 1, i.value) : f.value = Math.min(i.value - 1, f.value), s();
    }, a = (g) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), g === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), s();
    }, s = () => {
      if (i.value !== "" && f.value !== "" && e.value !== "" && n.value !== "") {
        const g = {
          temp_upper: i.value,
          temp_lower: f.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", g), fe.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ie("updateLimitSettings", g)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (g) => {
      o.value = g, r.value = !0, t.value = g.startsWith("temp") ? g === "tempUpper" ? i.value : f.value : g === "humidityUpper" ? e.value : n.value;
    }, d = (g) => {
      const v = parseFloat(g);
      isNaN(v) || (o.value === "tempUpper" ? (i.value = v, c("upper")) : o.value === "tempLower" ? (f.value = v, c("lower")) : o.value === "humidityUpper" ? (e.value = v, a("upper")) : o.value === "humidityLower" && (n.value = v, a("lower"))), o.value = null;
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
              value: i.value,
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
  setup(je) {
    const ie = be({ temperature: {}, humidity: {} });
    ct(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: i } = ot();
        lt(i, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              ie.value = JSON.parse(f.content);
            } catch (e) {
              console.error("Failed to parse sensor data:", e);
            }
        });
      } else
        console.log("在普通网页环境中执行"), fe(), setInterval(fe, 5e3);
    });
    const fe = async () => {
      try {
        const i = await fetch("http://localhost:8000/api/sensor-data/");
        if (!i.ok)
          throw new Error(`HTTP error! status: ${i.status}`);
        const f = await i.json();
        ie.value = f;
      } catch (i) {
        console.error("Error fetching sensor data:", i);
      }
    };
    return (i, f) => (De(), Fe("div", Zt, [
      I("div", en, [
        f[0] || (f[0] = I("h2", null, "温度传感器", -1)),
        I("div", tn, [
          I("div", nn, [
            (De(!0), Fe(at, null, ut(ie.value.temperature, (e, n) => (De(), Fe("div", {
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
            (De(!0), Fe(at, null, ut(ie.value.humidity, (e, n) => (De(), Fe("div", {
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
}, dn = /* @__PURE__ */ st(fn, [["__scopeId", "data-v-4414d3ef"]]), pn = { class: "integrated-control-system" }, vn = { class: "mode-controls" }, hn = ["disabled"], gn = ["disabled"], mn = { class: "systems-container" }, yn = { class: "steam-engine-control" }, bn = { class: "control-panel" }, wn = { class: "engine-status" }, xn = { class: "engine left" }, kn = ["disabled"], Sn = { class: "engine right" }, On = ["disabled"], jn = { class: "sprinkler-system" }, En = { class: "controls" }, _n = { class: "input-group" }, Cn = ["value"], Tn = { class: "input-group" }, An = ["value"], Ln = { class: "input-group" }, Bn = ["value"], Pn = { class: "visualization" }, Nn = ["onClick"], Mn = { class: "status" }, Rn = {
  __name: "IntegratedControlSystem",
  setup(je) {
    const ie = be(!1), fe = be(!1), i = be(5), f = be(2), e = be(10), n = be(i.value), r = be(f.value), o = be(e.value), t = be(i.value), u = be(f.value), c = be(e.value), a = be(0), s = be(""), l = be(Array(12).fill(0)), d = be(0), g = be(!0), v = be(!1), p = be(!1), h = be(null), m = be(""), b = be(!1), E = be(5), _ = be(""), { sendToPyQt: y } = ot(), k = gt({
      isPyQtWebEngine: !1
    });
    ct(() => {
      if (k.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, k.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: Z } = ot();
        lt(Z, (W) => {
          if (W && W.type === "update_left_steam_status")
            ie.value = W.content;
          else if (W && W.type === "update_right_steam_status")
            fe.value = W.content;
          else if (W && W.type === "update_sprinkler_settings")
            try {
              const me = JSON.parse(W.content);
              t.value = me.sprinkler_single_run_time, u.value = me.sprinkler_run_interval_time, c.value = me.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, console.log("Sprinkler Settings updated:", me);
            } catch (me) {
              console.error("Failed to parse sprinkler settings data:", me);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const w = Et(() => b.value ? `${_.value}，还需${E.value}秒` : g.value ? v.value ? s.value === "run" ? `喷头 ${a.value} 正在运行，剩余 ${d.value + 1} 秒` : s.value === "interval" ? `运行间隔中，剩余 ${d.value + 1} 秒` : s.value === "loop" ? `循环间隔中，剩余 ${d.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    let O, j;
    async function C(Z) {
      b.value = !0, E.value = 5, _.value = Z ? "正在切换到喷淋管" : "正在切换到喷雾机", y("controlSprinkler", { target: "switchToSprinkler", state: Z });
      const W = setInterval(() => {
        E.value--, E.value <= 0 && (clearInterval(W), b.value = !1);
      }, 1e3);
      return new Promise((me) => {
        setTimeout(() => {
          b.value = !1, me();
        }, E.value * 1e3);
      });
    }
    async function S(Z) {
      const W = g.value;
      if (g.value = Z === "auto", W !== g.value)
        if (k.isPyQtWebEngine && y("controlSprinkler", { target: "setMode", mode: g.value ? "auto" : "manual" }), g.value) {
          ie.value && await U();
          const me = l.value.findIndex((P) => P === 100);
          me !== -1 && (l.value[me] = 0, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: me + 1, state: 0 })), y("controlSprinkler", { target: "tankWork", state: 0 }), await C(0);
        } else
          await z();
    }
    async function U() {
      k.isPyQtWebEngine && (y("setEngineState", { engine: "left", state: !ie.value }), y("setEngineState", { engine: "right", state: !fe.value }), ie.value = !ie.value, fe.value = !fe.value);
    }
    async function D() {
      const Z = l.value.findIndex((W) => W === 100);
      k.isPyQtWebEngine && Z === -1 && (ie.value ? y("controlSprinkler", { target: "tankWork", state: 0 }) : y("controlSprinkler", { target: "tankWork", state: 1 }), y("setEngineState", { engine: "left", state: !ie.value }), y("setEngineState", { engine: "right", state: !fe.value }), ie.value = !ie.value, fe.value = !fe.value);
    }
    function Q(Z) {
      h.value = Z, p.value = !0, m.value = Z === "singleRunTime" ? t.value.toString() : Z === "runIntervalTime" ? u.value.toString() : c.value.toString();
    }
    function ne(Z) {
      const W = parseInt(Z);
      isNaN(W) || (h.value === "singleRunTime" ? (t.value = W, X()) : h.value === "runIntervalTime" ? (u.value = W, ae()) : h.value === "loopInterval" && (c.value = W, J())), h.value = null;
    }
    function X() {
      t.value = Math.max(1, t.value), n.value = t.value, T();
    }
    function ae() {
      u.value = Math.max(0, u.value), r.value = u.value, T();
    }
    function J() {
      c.value = Math.max(0, c.value), o.value = c.value, T();
    }
    function T() {
      if (k.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const Z = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        y("controlSprinkler", { target: "settings", settings: JSON.stringify(Z) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function A() {
      v.value || !g.value || (v.value = !0, l.value = Array(12).fill(0), await R());
    }
    async function z() {
      k.isPyQtWebEngine && (a.value > 0 && y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), y("controlSprinkler", { target: "setState", state: !1 })), ie.value && await U(), K(), y("controlSprinkler", { target: "tankWork", state: 0 }), await C(0);
    }
    function K() {
      v.value = !1, clearTimeout(O), clearInterval(j), a.value = 0, s.value = "", l.value = Array(12).fill(0), d.value = 0;
    }
    async function R() {
      a.value = 1, await C(1), y("controlSprinkler", { target: "tankWork", state: 1 }), de();
    }
    function ye() {
      !v.value || !g.value || (d.value--, d.value > 0 && setTimeout(ye, 1e3));
    }
    function de() {
      if (!v.value || !g.value) return;
      s.value = "run", i.value = n.value, d.value = i.value, ye();
      let Z = Date.now();
      y("controlSprinkler", { target: "manual", index: a.value, state: 1 }), j = setInterval(() => {
        let W = Date.now() - Z, me = Math.min(W / (i.value * 1e3), 1);
        l.value[a.value - 1] = me * 100;
      }, 100), O = setTimeout(async () => {
        clearInterval(j), a.value < 12 ? (y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), Le()) : (y("controlSprinkler", { target: "manual", index: a.value, state: 0 }), y("controlSprinkler", { target: "tankWork", state: 0 }), await C(0), y("controlSprinkler", { target: "setState", state: !0 }), Pe());
      }, i.value * 1e3);
    }
    function Le() {
      !v.value || !g.value || (s.value = "interval", f.value = r.value, d.value = f.value, ye(), O = setTimeout(() => {
        a.value++, de();
      }, f.value * 1e3));
    }
    async function Pe() {
      !v.value || !g.value || (s.value = "loop", e.value = o.value, d.value = e.value, ye(), a.value = 0, O = setTimeout(async () => {
        l.value = Array(12).fill(0), y("controlSprinkler", { target: "setState", state: !1 }), ie.value && await U(), y("controlSprinkler", { target: "tankWork", state: 0 }), await R();
      }, e.value * 1e3));
    }
    function Ne(Z) {
      return l.value[Z - 1];
    }
    async function Ce(Z) {
      if (g.value) return;
      const W = l.value.findIndex((me) => me === 100);
      l.value[Z - 1] > 0 ? (l.value[Z - 1] = 0, k.isPyQtWebEngine && (y("controlSprinkler", { target: "tankWork", state: 0 }), await C(0), y("controlSprinkler", { target: "manual", index: Z, state: 0 }))) : W !== -1 ? (l.value[W] = 0, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: W + 1, state: 0 }), l.value[Z - 1] = 100, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: Z, state: 1 })) : (await C(1), y("controlSprinkler", { target: "tankWork", state: 1 }), l.value[Z - 1] = 100, k.isPyQtWebEngine && y("controlSprinkler", { target: "manual", index: Z, state: 1 }));
    }
    return (Z, W) => (De(), Fe("div", pn, [
      W[15] || (W[15] = I("h2", null, "集成控制系统", -1)),
      I("div", vn, [
        I("button", {
          onClick: W[0] || (W[0] = (me) => S("auto")),
          class: nt([{ active: g.value }, "mode-btn"])
        }, "自动模式", 2),
        I("button", {
          onClick: W[1] || (W[1] = (me) => S("manual")),
          class: nt([{ active: !g.value }, "mode-btn"])
        }, "手动模式", 2),
        I("button", {
          onClick: A,
          disabled: v.value || !g.value,
          class: "control-btn"
        }, "开始", 8, hn),
        I("button", {
          onClick: z,
          disabled: !v.value || !g.value,
          class: "control-btn"
        }, "停止", 8, gn)
      ]),
      I("div", mn, [
        I("div", yn, [
          W[10] || (W[10] = I("h3", null, "雾化机控制系统", -1)),
          I("div", bn, [
            I("div", wn, [
              I("div", xn, [
                W[7] || (W[7] = I("h4", null, "左雾化机", -1)),
                I("div", {
                  class: nt(["status", { on: ie.value }])
                }, [
                  W[6] || (W[6] = I("div", { class: "status-indicator" }, null, -1)),
                  yt(" " + Ke(ie.value ? "开" : "关"), 1)
                ], 2),
                I("button", {
                  onClick: D,
                  disabled: g.value,
                  class: "control-btn"
                }, Ke(ie.value ? "关闭" : "开启"), 9, kn)
              ]),
              I("div", Sn, [
                W[9] || (W[9] = I("h4", null, "右雾化机", -1)),
                I("div", {
                  class: nt(["status", { on: fe.value }])
                }, [
                  W[8] || (W[8] = I("div", { class: "status-indicator" }, null, -1)),
                  yt(" " + Ke(fe.value ? "开" : "关"), 1)
                ], 2),
                I("button", {
                  onClick: D,
                  disabled: g.value,
                  class: "control-btn"
                }, Ke(fe.value ? "关闭" : "开启"), 9, On)
              ])
            ])
          ])
        ]),
        I("div", jn, [
          W[14] || (W[14] = I("h3", null, "喷淋系统", -1)),
          I("div", En, [
            I("div", _n, [
              W[11] || (W[11] = I("label", null, "单次运行时间 (秒):", -1)),
              I("input", {
                type: "text",
                value: t.value,
                onFocus: W[2] || (W[2] = (me) => Q("singleRunTime")),
                readonly: ""
              }, null, 40, Cn)
            ]),
            I("div", Tn, [
              W[12] || (W[12] = I("label", null, "运行时间间隔 (秒):", -1)),
              I("input", {
                type: "text",
                value: u.value,
                onFocus: W[3] || (W[3] = (me) => Q("runIntervalTime")),
                readonly: ""
              }, null, 40, An)
            ]),
            I("div", Ln, [
              W[13] || (W[13] = I("label", null, "循环时间间隔 (秒):", -1)),
              I("input", {
                type: "text",
                value: c.value,
                onFocus: W[4] || (W[4] = (me) => Q("loopInterval")),
                readonly: ""
              }, null, 40, Bn)
            ])
          ]),
          I("div", Pn, [
            (De(), Fe(at, null, ut(12, (me) => I("div", {
              key: me,
              class: nt(["sprinkler", { active: g.value ? a.value === me : l.value[me - 1] > 0 }]),
              onClick: (P) => !g.value && !ie.value && Ce(me)
            }, [
              I("div", {
                class: "water",
                style: _t({ height: Ne(me) + "%" })
              }, null, 4),
              I("span", null, Ke(me), 1)
            ], 10, Nn)), 64))
          ]),
          I("div", Mn, Ke(w.value), 1)
        ])
      ]),
      rt(kt, {
        modelValue: m.value,
        showKeyboard: p.value,
        "onUpdate:modelValue": ne,
        "onUpdate:showKeyboard": W[5] || (W[5] = (me) => p.value = me)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, In = /* @__PURE__ */ st(Rn, [["__scopeId", "data-v-dbe499cb"]]), Un = { class: "data-actions" }, $n = {
  key: 0,
  class: "modal-overlay"
}, Dn = {
  key: 1,
  class: "modal-overlay"
}, Fn = { class: "modal-content" }, Vn = {
  __name: "DataExport",
  setup(je) {
    const { sendToPyQt: ie } = ot(), fe = gt({
      isPyQtWebEngine: !1
    }), i = be(!1), f = be(!1), e = be("");
    ct(() => {
      fe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, fe.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      fe.isPyQtWebEngine && (console.log("导出数据"), ie("exportData", !0));
    }, r = () => {
      i.value = !0;
    }, o = () => {
      i.value = !1;
    }, t = () => {
      console.log("清空数据"), i.value = !1, u("所有数据已清空！"), fe.isPyQtWebEngine && ie("exportData", !1);
    }, u = (a) => {
      e.value = a, f.value = !0;
    }, c = () => {
      f.value = !1;
    };
    return (a, s) => (De(), Fe("div", Un, [
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
      i.value ? (De(), Fe("div", $n, [
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
      f.value ? (De(), Fe("div", Dn, [
        I("div", Fn, [
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
}, qn = /* @__PURE__ */ st(Vn, [["__scopeId", "data-v-86824edf"]]);
var zn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Wn(je) {
  return je && je.__esModule && Object.prototype.hasOwnProperty.call(je, "default") ? je.default : je;
}
var St = { exports: {} };
(function(je, ie) {
  (function(fe, i) {
    je.exports = i(jt);
  })(typeof self < "u" ? self : zn, function(fe) {
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
      i.exports = function(c, a, s, l, d, g) {
        var v = s + c.length, p = l.length, h = u;
        return d !== void 0 && (d = n(d), h = t), o.call(g, h, function(m, b) {
          var E;
          switch (b.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return a.slice(0, s);
            case "'":
              return a.slice(v);
            case "<":
              E = d[b.slice(1, -1)];
              break;
            default:
              var _ = +b;
              if (_ === 0) return m;
              if (_ > p) {
                var y = r(_ / 10);
                return y === 0 ? m : y <= p ? l[y - 1] === void 0 ? b.charAt(1) : l[y - 1] + b.charAt(1) : m;
              }
              E = l[_ - 1];
          }
          return E === void 0 ? "" : E;
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
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), c = e("8aa5"), a = e("50c4"), s = e("14c3"), l = e("9263"), d = e("d039"), g = [].push, v = Math.min, p = 4294967295, h = !d(function() {
        return !RegExp(p, "y");
      });
      n("split", 2, function(m, b, E) {
        var _;
        return _ = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(y, k) {
          var w = String(t(this)), O = k === void 0 ? p : k >>> 0;
          if (O === 0) return [];
          if (y === void 0) return [w];
          if (!r(y)) return b.call(w, y, O);
          for (var j, C, S, U = [], D = (y.ignoreCase ? "i" : "") + (y.multiline ? "m" : "") + (y.unicode ? "u" : "") + (y.sticky ? "y" : ""), Q = 0, ne = new RegExp(y.source, D + "g"); (j = l.call(ne, w)) && (C = ne.lastIndex, !(C > Q && (U.push(w.slice(Q, j.index)), j.length > 1 && j.index < w.length && g.apply(U, j.slice(1)), S = j[0].length, Q = C, U.length >= O))); )
            ne.lastIndex === j.index && ne.lastIndex++;
          return Q === w.length ? !S && ne.test("") || U.push("") : U.push(w.slice(Q)), U.length > O ? U.slice(0, O) : U;
        } : "0".split(void 0, 0).length ? function(y, k) {
          return y === void 0 && k === 0 ? [] : b.call(this, y, k);
        } : b, [function(y, k) {
          var w = t(this), O = y == null ? void 0 : y[m];
          return O !== void 0 ? O.call(y, w, k) : _.call(String(w), y, k);
        }, function(y, k) {
          var w = E(_, y, this, k, _ !== b);
          if (w.done) return w.value;
          var O = o(y), j = String(this), C = u(O, RegExp), S = O.unicode, U = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (h ? "y" : "g"), D = new C(h ? O : "^(?:" + O.source + ")", U), Q = k === void 0 ? p : k >>> 0;
          if (Q === 0) return [];
          if (j.length === 0) return s(D, j) === null ? [j] : [];
          for (var ne = 0, X = 0, ae = []; X < j.length; ) {
            D.lastIndex = h ? X : 0;
            var J, T = s(D, h ? j : j.slice(X));
            if (T === null || (J = v(a(D.lastIndex + (h ? 0 : X)), j.length)) === ne) X = c(j, X, S);
            else {
              if (ae.push(j.slice(ne, X)), ae.length === Q) return ae;
              for (var A = 1; A <= T.length - 1; A++) if (ae.push(T[A]), ae.length === Q) return ae;
              X = ne = J;
            }
          }
          return ae.push(j.slice(ne)), ae;
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
          function r(P, M) {
            return M = { exports: {} }, P(M, M.exports), M.exports;
          }
          var o = r(function(P, M) {
            (function(H, $) {
              P.exports = $();
            })(0, function() {
              function H(ue) {
                var ke = ue && typeof ue == "object";
                return ke && Object.prototype.toString.call(ue) !== "[object RegExp]" && Object.prototype.toString.call(ue) !== "[object Date]";
              }
              function $(ue) {
                return Array.isArray(ue) ? [] : {};
              }
              function G(ue, ke) {
                var Oe = ke && ke.clone === !0;
                return Oe && H(ue) ? ge($(ue), ue, ke) : ue;
              }
              function te(ue, ke, Oe) {
                var Me = ue.slice();
                return ke.forEach(function(_e, qe) {
                  typeof Me[qe] > "u" ? Me[qe] = G(_e, Oe) : H(_e) ? Me[qe] = ge(ue[qe], _e, Oe) : ue.indexOf(_e) === -1 && Me.push(G(_e, Oe));
                }), Me;
              }
              function we(ue, ke, Oe) {
                var Me = {};
                return H(ue) && Object.keys(ue).forEach(function(_e) {
                  Me[_e] = G(ue[_e], Oe);
                }), Object.keys(ke).forEach(function(_e) {
                  H(ke[_e]) && ue[_e] ? Me[_e] = ge(ue[_e], ke[_e], Oe) : Me[_e] = G(ke[_e], Oe);
                }), Me;
              }
              function ge(ue, ke, Oe) {
                var Me = Array.isArray(ke), _e = Oe || { arrayMerge: te }, qe = _e.arrayMerge || te;
                return Me ? Array.isArray(ue) ? qe(ue, ke, Oe) : G(ke, Oe) : we(ue, ke, Oe);
              }
              return ge.all = function(ue, ke) {
                if (!Array.isArray(ue) || ue.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ue.reduce(function(Oe, Me) {
                  return ge(Oe, Me, ke);
                });
              }, ge;
            });
          });
          function t(P) {
            return P = P || /* @__PURE__ */ Object.create(null), { on: function(M, H) {
              (P[M] || (P[M] = [])).push(H);
            }, off: function(M, H) {
              P[M] && P[M].splice(P[M].indexOf(H) >>> 0, 1);
            }, emit: function(M, H) {
              (P[M] || []).map(function($) {
                $(H);
              }), (P["*"] || []).map(function($) {
                $(M, H);
              });
            } };
          }
          var u = r(function(P, M) {
            var H = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            M.default = H, P.exports = M.default;
          }), c = function(P) {
            return Object.keys(P).map(function(M) {
              var H = P[M].toString().replace(/"/g, "&quot;");
              return M + '="' + H + '"';
            }).join(" ");
          }, a = u.svg, s = u.xlink, l = {};
          l[a.name] = a.uri, l[s.name] = s.uri;
          var d, g = function(P, M) {
            P === void 0 && (P = "");
            var H = o(l, M || {}), $ = c(H);
            return "<svg " + $ + ">" + P + "</svg>";
          }, v = u.svg, p = u.xlink, h = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[v.name] = v.uri, d[p.name] = p.uri, d) }, m = function(P) {
            this.config = o(h, P || {}), this.symbols = [];
          };
          m.prototype.add = function(P) {
            var M = this, H = M.symbols, $ = this.find(P.id);
            return $ ? (H[H.indexOf($)] = P, !1) : (H.push(P), !0);
          }, m.prototype.remove = function(P) {
            var M = this, H = M.symbols, $ = this.find(P);
            return !!$ && (H.splice(H.indexOf($), 1), $.destroy(), !0);
          }, m.prototype.find = function(P) {
            return this.symbols.filter(function(M) {
              return M.id === P;
            })[0] || null;
          }, m.prototype.has = function(P) {
            return this.find(P) !== null;
          }, m.prototype.stringify = function() {
            var P = this.config, M = P.attrs, H = this.symbols.map(function($) {
              return $.stringify();
            }).join("");
            return g(H, M);
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            this.symbols.forEach(function(P) {
              return P.destroy();
            });
          };
          var b = function(P) {
            var M = P.id, H = P.viewBox, $ = P.content;
            this.id = M, this.viewBox = H, this.content = $;
          };
          b.prototype.stringify = function() {
            return this.content;
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            var P = this;
            ["id", "viewBox", "content"].forEach(function(M) {
              return delete P[M];
            });
          };
          var E = function(P) {
            var M = !!document.importNode, H = new DOMParser().parseFromString(P, "image/svg+xml").documentElement;
            return M ? document.importNode(H, !0) : H;
          }, _ = function(P) {
            function M() {
              P.apply(this, arguments);
            }
            P && (M.__proto__ = P), M.prototype = Object.create(P && P.prototype), M.prototype.constructor = M;
            var H = { isMounted: {} };
            return H.isMounted.get = function() {
              return !!this.node;
            }, M.createFromExistingNode = function($) {
              return new M({ id: $.getAttribute("id"), viewBox: $.getAttribute("viewBox"), content: $.outerHTML });
            }, M.prototype.destroy = function() {
              this.isMounted && this.unmount(), P.prototype.destroy.call(this);
            }, M.prototype.mount = function($) {
              if (this.isMounted) return this.node;
              var G = typeof $ == "string" ? document.querySelector($) : $, te = this.render();
              return this.node = te, G.appendChild(te), te;
            }, M.prototype.render = function() {
              var $ = this.stringify();
              return E(g($)).childNodes[0];
            }, M.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(M.prototype, H), M;
          }(b), y = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, k = function(P) {
            return Array.prototype.slice.call(P, 0);
          }, w = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, O = function(P, M) {
            var H = document.createEvent("CustomEvent");
            H.initCustomEvent(P, !1, !1, M), window.dispatchEvent(H);
          }, j = function(P) {
            var M = [];
            return k(P.querySelectorAll("style")).forEach(function(H) {
              H.textContent += "", M.push(H);
            }), M;
          }, C = function(P) {
            return (P || window.location.href).split("#")[0];
          }, S = function(P) {
            angular.module("ng").run(["$rootScope", function(M) {
              M.$on("$locationChangeSuccess", function(H, $, G) {
                O(P, { oldUrl: G, newUrl: $ });
              });
            }]);
          }, U = "linearGradient, radialGradient, pattern, mask, clipPath", D = function(P, M) {
            return M === void 0 && (M = U), k(P.querySelectorAll("symbol")).forEach(function(H) {
              k(H.querySelectorAll(M)).forEach(function($) {
                H.parentNode.insertBefore($, H);
              });
            }), P;
          };
          function Q(P, M) {
            var H = k(P).reduce(function($, G) {
              if (!G.attributes) return $;
              var te = k(G.attributes), we = M ? te.filter(M) : te;
              return $.concat(we);
            }, []);
            return H;
          }
          var ne = u.xlink.uri, X = "xlink:href", ae = /[{}|\\\^\[\]`"<>]/g;
          function J(P) {
            return P.replace(ae, function(M) {
              return "%" + M[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function T(P) {
            return P.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function A(P, M, H) {
            return k(P).forEach(function($) {
              var G = $.getAttribute(X);
              if (G && G.indexOf(M) === 0) {
                var te = G.replace(M, H);
                $.setAttributeNS(ne, X, te);
              }
            }), P;
          }
          var z, K = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], R = K.map(function(P) {
            return "[" + P + "]";
          }).join(","), ye = function(P, M, H, $) {
            var G = J(H), te = J($), we = P.querySelectorAll(R), ge = Q(we, function(ue) {
              var ke = ue.localName, Oe = ue.value;
              return K.indexOf(ke) !== -1 && Oe.indexOf("url(" + G) !== -1;
            });
            ge.forEach(function(ue) {
              return ue.value = ue.value.replace(new RegExp(T(G), "g"), te);
            }), A(M, G, te);
          }, de = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Le = function(P) {
            function M($) {
              var G = this;
              $ === void 0 && ($ = {}), P.call(this, o(y, $));
              var te = t();
              this._emitter = te, this.node = null;
              var we = this, ge = we.config;
              if (ge.autoConfigure && this._autoConfigure($), ge.syncUrlsWithBaseTag) {
                var ue = document.getElementsByTagName("base")[0].getAttribute("href");
                te.on(de.MOUNT, function() {
                  return G.updateUrls("#", ue);
                });
              }
              var ke = this._handleLocationChange.bind(this);
              this._handleLocationChange = ke, ge.listenLocationChangeEvent && window.addEventListener(ge.locationChangeEvent, ke), ge.locationChangeAngularEmitter && S(ge.locationChangeEvent), te.on(de.MOUNT, function(Oe) {
                ge.moveGradientsOutsideSymbol && D(Oe);
              }), te.on(de.SYMBOL_MOUNT, function(Oe) {
                ge.moveGradientsOutsideSymbol && D(Oe.parentNode), (w.isIE() || w.isEdge()) && j(Oe);
              });
            }
            P && (M.__proto__ = P), M.prototype = Object.create(P && P.prototype), M.prototype.constructor = M;
            var H = { isMounted: {} };
            return H.isMounted.get = function() {
              return !!this.node;
            }, M.prototype._autoConfigure = function($) {
              var G = this, te = G.config;
              typeof $.syncUrlsWithBaseTag > "u" && (te.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof $.locationChangeAngularEmitter > "u" && (te.locationChangeAngularEmitter = typeof window.angular < "u"), typeof $.moveGradientsOutsideSymbol > "u" && (te.moveGradientsOutsideSymbol = w.isFirefox());
            }, M.prototype._handleLocationChange = function($) {
              var G = $.detail, te = G.oldUrl, we = G.newUrl;
              this.updateUrls(te, we);
            }, M.prototype.add = function($) {
              var G = this, te = P.prototype.add.call(this, $);
              return this.isMounted && te && ($.mount(G.node), this._emitter.emit(de.SYMBOL_MOUNT, $.node)), te;
            }, M.prototype.attach = function($) {
              var G = this, te = this;
              if (te.isMounted) return te.node;
              var we = typeof $ == "string" ? document.querySelector($) : $;
              return te.node = we, this.symbols.forEach(function(ge) {
                ge.mount(te.node), G._emitter.emit(de.SYMBOL_MOUNT, ge.node);
              }), k(we.querySelectorAll("symbol")).forEach(function(ge) {
                var ue = _.createFromExistingNode(ge);
                ue.node = ge, te.add(ue);
              }), this._emitter.emit(de.MOUNT, we), we;
            }, M.prototype.destroy = function() {
              var $ = this, G = $.config, te = $.symbols, we = $._emitter;
              te.forEach(function(ge) {
                return ge.destroy();
              }), we.off("*"), window.removeEventListener(G.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, M.prototype.mount = function($, G) {
              $ === void 0 && ($ = this.config.mountTo), G === void 0 && (G = !1);
              var te = this;
              if (te.isMounted) return te.node;
              var we = typeof $ == "string" ? document.querySelector($) : $, ge = te.render();
              return this.node = ge, G && we.childNodes[0] ? we.insertBefore(ge, we.childNodes[0]) : we.appendChild(ge), this._emitter.emit(de.MOUNT, ge), ge;
            }, M.prototype.render = function() {
              return E(this.stringify());
            }, M.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, M.prototype.updateUrls = function($, G) {
              if (!this.isMounted) return !1;
              var te = document.querySelectorAll(this.config.usagesToUpdate);
              return ye(this.node, te, C($) + "#", C(G) + "#"), !0;
            }, Object.defineProperties(M.prototype, H), M;
          }(m), Pe = r(function(P) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(M, H) {
              P.exports = H();
            })(0, function() {
              var M, H = [], $ = document, G = $.documentElement.doScroll, te = "DOMContentLoaded", we = (G ? /^loaded|^c/ : /^loaded|^i|^c/).test($.readyState);
              return we || $.addEventListener(te, M = function() {
                for ($.removeEventListener(te, M), we = 1; M = H.shift(); ) M();
              }), function(ge) {
                we ? setTimeout(ge, 0) : H.push(ge);
              };
            });
          }), Ne = "__SVG_SPRITE_NODE__", Ce = "__SVG_SPRITE__", Z = !!window[Ce];
          Z ? z = window[Ce] : (z = new Le({ attrs: { id: Ne, "aria-hidden": "true" } }), window[Ce] = z);
          var W = function() {
            var P = document.getElementById(Ne);
            P ? z.attach(P) : z.mount(document.body, !0);
          };
          document.body ? W() : Pe(W);
          var me = z;
          return me;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), c = e("2a62"), a = function(s, l) {
        this.stopped = s, this.result = l;
      };
      i.exports = function(s, l, d) {
        var g, v, p, h, m, b, E, _ = d && d.that, y = !(!d || !d.AS_ENTRIES), k = !(!d || !d.IS_ITERATOR), w = !(!d || !d.INTERRUPTED), O = t(l, _, 1 + y + w), j = function(S) {
          return g && c(g), new a(!0, S);
        }, C = function(S) {
          return y ? (n(S), w ? O(S[0], S[1], j) : O(S[0], S[1])) : w ? O(S, j) : O(S);
        };
        if (k) g = s;
        else {
          if (v = u(s), typeof v != "function") throw TypeError("Target is not iterable");
          if (r(v)) {
            for (p = 0, h = o(s.length); h > p; p++) if (m = C(s[p]), m && m instanceof a) return m;
            return new a(!1);
          }
          g = v.call(s);
        }
        for (b = g.next; !(E = b.call(g)).done; ) {
          try {
            m = C(E.value);
          } catch (S) {
            throw c(g), S;
          }
          if (typeof m == "object" && m && m instanceof a) return m;
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
        var d, g, v, p, h, m, b = s.target, E = s.global, _ = s.stat;
        if (g = E ? n : _ ? n[b] || u(b, {}) : (n[b] || {}).prototype, g) for (v in l) {
          if (h = l[v], s.noTargetGet ? (m = r(g, v), p = m && m.value) : p = g[v], d = a(E ? v : b + (_ ? "." : "#") + v, s.forced), !d && p !== void 0) {
            if (typeof h == typeof p) continue;
            c(h, p);
          }
          (s.sham || p && p.sham) && o(h, "sham", !0), t(g, v, h, s);
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
        var d = r(this), g = String(d.source), v = d.flags, p = String(v === void 0 && d instanceof RegExp && !("flags" in c) ? t.call(d) : v);
        return "/" + g + "/" + p;
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
      var n, r, o, t = e("da84"), u = e("d039"), c = e("0366"), a = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), g = t.location, v = t.setImmediate, p = t.clearImmediate, h = t.process, m = t.MessageChannel, b = t.Dispatch, E = 0, _ = {}, y = "onreadystatechange", k = function(C) {
        if (_.hasOwnProperty(C)) {
          var S = _[C];
          delete _[C], S();
        }
      }, w = function(C) {
        return function() {
          k(C);
        };
      }, O = function(C) {
        k(C.data);
      }, j = function(C) {
        t.postMessage(C + "", g.protocol + "//" + g.host);
      };
      v && p || (v = function(C) {
        for (var S = [], U = 1; arguments.length > U; ) S.push(arguments[U++]);
        return _[++E] = function() {
          (typeof C == "function" ? C : Function(C)).apply(void 0, S);
        }, n(E), E;
      }, p = function(C) {
        delete _[C];
      }, d ? n = function(C) {
        h.nextTick(w(C));
      } : b && b.now ? n = function(C) {
        b.now(w(C));
      } : m && !l ? (r = new m(), o = r.port2, r.port1.onmessage = O, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && g && g.protocol !== "file:" && !u(j) ? (n = j, t.addEventListener("message", O, !1)) : n = y in s("script") ? function(C) {
        a.appendChild(s("script"))[y] = function() {
          a.removeChild(this), k(C);
        };
      } : function(C) {
        setTimeout(w(C), 0);
      }), i.exports = { set: v, clear: p };
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
            l !== null && typeof l < "u" && (n.isArray(l) ? d += "[]" : l = [l], n.forEach(l, function(g) {
              n.isDate(g) ? g = g.toISOString() : n.isObject(g) && (g = JSON.stringify(g)), a.push(r(d) + "=" + r(g));
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
          var g = t(this), v = d == null ? void 0 : d[a];
          return v !== void 0 ? v.call(d, g) : new RegExp(d)[a](String(g));
        }, function(d) {
          var g = l(s, d, this);
          if (g.done) return g.value;
          var v = r(d), p = String(this);
          if (!v.global) return c(v, p);
          var h = v.unicode;
          v.lastIndex = 0;
          for (var m, b = [], E = 0; (m = c(v, p)) !== null; ) {
            var _ = String(m[0]);
            b[E] = _, _ === "" && (v.lastIndex = u(p, o(v.lastIndex), h)), E++;
          }
          return E === 0 ? null : b;
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
        function l(p, h) {
          return n.isPlainObject(p) && n.isPlainObject(h) ? n.merge(p, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function d(p) {
          n.isUndefined(o[p]) ? n.isUndefined(r[p]) || (t[p] = l(void 0, r[p])) : t[p] = l(r[p], o[p]);
        }
        n.forEach(u, function(p) {
          n.isUndefined(o[p]) || (t[p] = l(void 0, o[p]));
        }), n.forEach(c, d), n.forEach(a, function(p) {
          n.isUndefined(o[p]) ? n.isUndefined(r[p]) || (t[p] = l(void 0, r[p])) : t[p] = l(void 0, o[p]);
        }), n.forEach(s, function(p) {
          p in o ? t[p] = l(r[p], o[p]) : p in r && (t[p] = l(void 0, r[p]));
        });
        var g = u.concat(c).concat(a).concat(s), v = Object.keys(r).concat(Object.keys(o)).filter(function(p) {
          return g.indexOf(p) === -1;
        });
        return n.forEach(v, d), t;
      };
    }, "4d63": function(i, f, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, c = e("241c").f, a = e("44e7"), s = e("ad6d"), l = e("9f7f"), d = e("6eeb"), g = e("d039"), v = e("69f3").set, p = e("2626"), h = e("b622"), m = h("match"), b = r.RegExp, E = b.prototype, _ = /a/g, y = /a/g, k = new b(_) !== _, w = l.UNSUPPORTED_Y, O = n && o("RegExp", !k || w || g(function() {
        return y[m] = !1, b(_) != _ || b(y) == y || b(_, "i") != "/a/i";
      }));
      if (O) {
        for (var j = function(D, Q) {
          var ne, X = this instanceof j, ae = a(D), J = Q === void 0;
          if (!X && ae && D.constructor === j && J) return D;
          k ? ae && !J && (D = D.source) : D instanceof j && (J && (Q = s.call(D)), D = D.source), w && (ne = !!Q && Q.indexOf("y") > -1, ne && (Q = Q.replace(/y/g, "")));
          var T = t(k ? new b(D, Q) : b(D, Q), X ? this : E, j);
          return w && ne && v(T, { sticky: ne }), T;
        }, C = function(D) {
          D in j || u(j, D, { configurable: !0, get: function() {
            return b[D];
          }, set: function(Q) {
            b[D] = Q;
          } });
        }, S = c(b), U = 0; S.length > U; ) C(S[U++]);
        E.constructor = j, j.prototype = E, d(r, "RegExp", j);
      }
      p("RegExp");
    }, "4d64": function(i, f, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(c, a, s) {
          var l, d = n(c), g = r(d.length), v = o(s, g);
          if (u && a != a) {
            for (; g > v; ) if (l = d[v++], l != l) return !0;
          } else for (; g > v; v++) if ((u || v in d) && d[v] === a) return u || v || 0;
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
        var l, d, g, v, p, h, m = r(s), b = typeof this == "function" ? this : Array, E = arguments.length, _ = E > 1 ? arguments[1] : void 0, y = _ !== void 0, k = a(m), w = 0;
        if (y && (_ = n(_, E > 2 ? arguments[2] : void 0, 2)), k == null || b == Array && t(k)) for (l = u(m.length), d = new b(l); l > w; w++) h = y ? _(m[w], w) : m[w], c(d, w, h);
        else for (v = k.call(m), p = v.next, d = new b(); !(g = p.call(v)).done; w++) h = y ? o(v, _, [g.value, w], !0) : g.value, c(d, w, h);
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
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), c = e("8aa5"), a = e("0cb2"), s = e("14c3"), l = Math.max, d = Math.min, g = function(v) {
        return v === void 0 ? v : String(v);
      };
      n("replace", 2, function(v, p, h, m) {
        var b = m.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, E = m.REPLACE_KEEPS_$0, _ = b ? "$" : "$0";
        return [function(y, k) {
          var w = u(this), O = y == null ? void 0 : y[v];
          return O !== void 0 ? O.call(y, w, k) : p.call(String(w), y, k);
        }, function(y, k) {
          if (!b && E || typeof k == "string" && k.indexOf(_) === -1) {
            var w = h(p, y, this, k);
            if (w.done) return w.value;
          }
          var O = r(y), j = String(this), C = typeof k == "function";
          C || (k = String(k));
          var S = O.global;
          if (S) {
            var U = O.unicode;
            O.lastIndex = 0;
          }
          for (var D = []; ; ) {
            var Q = s(O, j);
            if (Q === null || (D.push(Q), !S)) break;
            var ne = String(Q[0]);
            ne === "" && (O.lastIndex = c(j, o(O.lastIndex), U));
          }
          for (var X = "", ae = 0, J = 0; J < D.length; J++) {
            Q = D[J];
            for (var T = String(Q[0]), A = l(d(t(Q.index), j.length), 0), z = [], K = 1; K < Q.length; K++) z.push(g(Q[K]));
            var R = Q.groups;
            if (C) {
              var ye = [T].concat(z, A, j);
              R !== void 0 && ye.push(R);
              var de = String(k.apply(void 0, ye));
            } else de = a(T, j, A, z, R, k);
            A >= ae && (X += j.slice(ae, A) + de, ae = A + T.length);
          }
          return X + j.slice(ae);
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
          var g = c.getAttribute("content");
          if (g) {
            var v = g.match(/initial\-dpr=([\d\.]+)/), p = g.match(/maximum\-dpr=([\d\.]+)/);
            v && (a = parseFloat(v[1]), s = parseFloat((1 / a).toFixed(2))), p && (a = parseFloat(p[1]), s = parseFloat((1 / a).toFixed(2)));
          }
        }
        if (!a && !s) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), m = n.devicePixelRatio;
          a = h ? m >= 3 && (!a || a >= 3) ? 3 : m >= 2 && (!a || a >= 2) ? 2 : 1 : 1, s = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var b = o.createElement("div");
          b.appendChild(u), o.write(b.innerHTML);
        }
        function E() {
          var _ = t.getBoundingClientRect().width, y = _ / 10;
          t.style.fontSize = y + "px", l.rem = n.rem = y;
        }
        n.addEventListener("resize", function() {
          E();
        }, !1), n.addEventListener("pageshow", function(_) {
          _.persisted && E();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * a + "px" : o.addEventListener("DOMContentLoaded", function(_) {
          o.body.style.fontSize = 10 * a + "px";
        }, !1), E(), l.dpr = n.dpr = a, l.refreshRem = E, l.rem2px = function(_) {
          var y = parseFloat(_) * this.rem;
          return typeof _ == "string" && _.match(/rem$/) && (y += "px"), y;
        }, l.px2rem = function(_) {
          var y = parseFloat(_) / this.rem;
          return typeof _ == "string" && _.match(/px$/) && (y += "rem"), y;
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
          var a, s, l = String(r(u)), d = n(c), g = l.length;
          return d < 0 || d >= g ? t ? "" : void 0 : (a = l.charCodeAt(d), a < 55296 || a > 56319 || d + 1 === g || (s = l.charCodeAt(d + 1)) < 56320 || s > 57343 ? t ? l.charAt(d) : a : t ? l.slice(d, d + 2) : s - 56320 + (a - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(i, f, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), c = e("2266"), a = e("7dd0"), s = e("2626"), l = e("83ab"), d = e("f183").fastKey, g = e("69f3"), v = g.set, p = g.getterFor;
      i.exports = { getConstructor: function(h, m, b, E) {
        var _ = h(function(O, j) {
          u(O, _, m), v(O, { type: m, index: r(null), first: void 0, last: void 0, size: 0 }), l || (O.size = 0), j != null && c(j, O[E], { that: O, AS_ENTRIES: b });
        }), y = p(m), k = function(O, j, C) {
          var S, U, D = y(O), Q = w(O, j);
          return Q ? Q.value = C : (D.last = Q = { index: U = d(j, !0), key: j, value: C, previous: S = D.last, next: void 0, removed: !1 }, D.first || (D.first = Q), S && (S.next = Q), l ? D.size++ : O.size++, U !== "F" && (D.index[U] = Q)), O;
        }, w = function(O, j) {
          var C, S = y(O), U = d(j);
          if (U !== "F") return S.index[U];
          for (C = S.first; C; C = C.next) if (C.key == j) return C;
        };
        return o(_.prototype, { clear: function() {
          for (var O = this, j = y(O), C = j.index, S = j.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete C[S.index], S = S.next;
          j.first = j.last = void 0, l ? j.size = 0 : O.size = 0;
        }, delete: function(O) {
          var j = this, C = y(j), S = w(j, O);
          if (S) {
            var U = S.next, D = S.previous;
            delete C.index[S.index], S.removed = !0, D && (D.next = U), U && (U.previous = D), C.first == S && (C.first = U), C.last == S && (C.last = D), l ? C.size-- : j.size--;
          }
          return !!S;
        }, forEach: function(O) {
          for (var j, C = y(this), S = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); j = j ? j.next : C.first; )
            for (S(j.value, j.key, this); j && j.removed; ) j = j.previous;
        }, has: function(O) {
          return !!w(this, O);
        } }), o(_.prototype, b ? { get: function(O) {
          var j = w(this, O);
          return j && j.value;
        }, set: function(O, j) {
          return k(this, O === 0 ? 0 : O, j);
        } } : { add: function(O) {
          return k(this, O = O === 0 ? 0 : O, O);
        } }), l && n(_.prototype, "size", { get: function() {
          return y(this).size;
        } }), _;
      }, setStrong: function(h, m, b) {
        var E = m + " Iterator", _ = p(m), y = p(E);
        a(h, m, function(k, w) {
          v(this, { type: E, target: k, state: _(k), kind: w, last: void 0 });
        }, function() {
          for (var k = y(this), w = k.kind, O = k.last; O && O.removed; ) O = O.previous;
          return k.target && (k.last = O = O ? O.next : k.state.first) ? w == "keys" ? { value: O.key, done: !1 } : w == "values" ? { value: O.value, done: !1 } : { value: [O.key, O.value], done: !1 } : (k.target = void 0, { value: void 0, done: !0 });
        }, b ? "entries" : "values", !b, !0), s(m);
      } };
    }, "65f0": function(i, f, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      i.exports = function(u, c) {
        var a;
        return r(u) && (a = u.constructor, typeof a != "function" || a !== Array && !r(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(c === 0 ? 0 : c);
      };
    }, "69f3": function(i, f, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), c = e("861d"), a = e("9112"), s = e("5135"), l = e("c6cd"), d = e("f772"), g = e("d012"), v = u.WeakMap, p = function(k) {
        return o(k) ? r(k) : n(k, {});
      }, h = function(k) {
        return function(w) {
          var O;
          if (!c(w) || (O = r(w)).type !== k) throw TypeError("Incompatible receiver, " + k + " required");
          return O;
        };
      };
      if (t) {
        var m = l.state || (l.state = new v()), b = m.get, E = m.has, _ = m.set;
        n = function(k, w) {
          return w.facade = k, _.call(m, k, w), w;
        }, r = function(k) {
          return b.call(m, k) || {};
        }, o = function(k) {
          return E.call(m, k);
        };
      } else {
        var y = d("state");
        g[y] = !0, n = function(k, w) {
          return w.facade = k, a(k, y, w), w;
        }, r = function(k) {
          return s(k, y) ? k[y] : {};
        }, o = function(k) {
          return s(k, y);
        };
      }
      i.exports = { set: n, get: r, has: o, enforce: p, getterFor: h };
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
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), c = e("2266"), a = e("19aa"), s = e("861d"), l = e("d039"), d = e("1c7e"), g = e("d44e"), v = e("7156");
      i.exports = function(p, h, m) {
        var b = p.indexOf("Map") !== -1, E = p.indexOf("Weak") !== -1, _ = b ? "set" : "add", y = r[p], k = y && y.prototype, w = y, O = {}, j = function(X) {
          var ae = k[X];
          t(k, X, X == "add" ? function(J) {
            return ae.call(this, J === 0 ? 0 : J), this;
          } : X == "delete" ? function(J) {
            return !(E && !s(J)) && ae.call(this, J === 0 ? 0 : J);
          } : X == "get" ? function(J) {
            return E && !s(J) ? void 0 : ae.call(this, J === 0 ? 0 : J);
          } : X == "has" ? function(J) {
            return !(E && !s(J)) && ae.call(this, J === 0 ? 0 : J);
          } : function(J, T) {
            return ae.call(this, J === 0 ? 0 : J, T), this;
          });
        }, C = o(p, typeof y != "function" || !(E || k.forEach && !l(function() {
          new y().entries().next();
        })));
        if (C) w = m.getConstructor(h, p, b, _), u.REQUIRED = !0;
        else if (o(p, !0)) {
          var S = new w(), U = S[_](E ? {} : -0, 1) != S, D = l(function() {
            S.has(1);
          }), Q = d(function(X) {
            new y(X);
          }), ne = !E && l(function() {
            for (var X = new y(), ae = 5; ae--; ) X[_](ae, ae);
            return !X.has(-0);
          });
          Q || (w = h(function(X, ae) {
            a(X, w, p);
            var J = v(new y(), X, w);
            return ae != null && c(ae, J[_], { that: J, AS_ENTRIES: b }), J;
          }), w.prototype = k, k.constructor = w), (D || ne) && (j("delete"), j("has"), b && j("get")), (ne || U) && j(_), E && k.clear && delete k.clear;
        }
        return O[p] = w, n({ global: !0, forced: w != y }, O), g(w, p), E || m.setStrong(w, p, b), w;
      };
    }, "6eeb": function(i, f, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), c = e("69f3"), a = c.get, s = c.enforce, l = String(String).split("String");
      (i.exports = function(d, g, v, p) {
        var h, m = !!p && !!p.unsafe, b = !!p && !!p.enumerable, E = !!p && !!p.noTargetGet;
        typeof v == "function" && (typeof g != "string" || o(v, "name") || r(v, "name", g), h = s(v), h.source || (h.source = l.join(typeof g == "string" ? g : ""))), d !== n ? (m ? !E && d[g] && (b = !0) : delete d[g], b ? d[g] = v : r(d, g, v)) : b ? d[g] = v : t(g, v);
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
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), c = e("1be4"), a = e("cc12"), s = e("f772"), l = ">", d = "<", g = "prototype", v = "script", p = s("IE_PROTO"), h = function() {
      }, m = function(y) {
        return d + v + l + y + d + "/" + v + l;
      }, b = function(y) {
        y.write(m("")), y.close();
        var k = y.parentWindow.Object;
        return y = null, k;
      }, E = function() {
        var y, k = a("iframe"), w = "java" + v + ":";
        return k.style.display = "none", c.appendChild(k), k.src = String(w), y = k.contentWindow.document, y.open(), y.write(m("document.F=Object")), y.close(), y.F;
      }, _ = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        _ = n ? b(n) : E();
        for (var y = t.length; y--; ) delete _[g][t[y]];
        return _();
      };
      u[p] = !0, i.exports = Object.create || function(y, k) {
        var w;
        return y !== null ? (h[g] = r(y), w = new h(), h[g] = null, w[p] = y) : w = _(), k === void 0 ? w : o(w, k);
      };
    }, "7db0": function(i, f, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(i, f, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), c = e("9112"), a = e("6eeb"), s = e("b622"), l = e("c430"), d = e("3f8c"), g = e("ae93"), v = g.IteratorPrototype, p = g.BUGGY_SAFARI_ITERATORS, h = s("iterator"), m = "keys", b = "values", E = "entries", _ = function() {
        return this;
      };
      i.exports = function(y, k, w, O, j, C, S) {
        r(w, k, O);
        var U, D, Q, ne = function(K) {
          if (K === j && A) return A;
          if (!p && K in J) return J[K];
          switch (K) {
            case m:
              return function() {
                return new w(this, K);
              };
            case b:
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
        }, X = k + " Iterator", ae = !1, J = y.prototype, T = J[h] || J["@@iterator"] || j && J[j], A = !p && T || ne(j), z = k == "Array" && J.entries || T;
        if (z && (U = o(z.call(new y())), v !== Object.prototype && U.next && (l || o(U) === v || (t ? t(U, v) : typeof U[h] != "function" && c(U, h, _)), u(U, X, !0, !0), l && (d[X] = _))), j == b && T && T.name !== b && (ae = !0, A = function() {
          return T.call(this);
        }), l && !S || J[h] === A || c(J, h, A), d[k] = A, j) if (D = { values: ne(b), keys: C ? A : ne(m), entries: ne(E) }, S) for (Q in D) (p || ae || !(Q in J)) && a(J, Q, D[Q]);
        else n({ target: k, proto: !0, forced: p || ae }, D);
        return D;
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
          } catch (E) {
            var c, a, s, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, d = /@([^@]*):(\d+):(\d+)\s*$/gi, g = l.exec(E.stack) || d.exec(E.stack), v = g && g[1] || !1, p = g && g[2] || !1, h = document.location.href.replace(document.location.hash, ""), m = document.getElementsByTagName("script");
            v === h && (c = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (p - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), s = c.replace(a, "$1").trim());
            for (var b = 0; b < m.length; b++)
              if (m[b].readyState === "interactive" || m[b].src === v || v === h && m[b].innerHTML && m[b].innerHTML.trim() === s) return m[b];
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
      i.exports = fe;
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
        var d = /a/, g = /b*/g;
        return o.call(d, "a"), o.call(g, "a"), d.lastIndex !== 0 || g.lastIndex !== 0;
      }(), a = r.UNSUPPORTED_Y || r.BROKEN_CARET, s = /()??/.exec("")[1] !== void 0, l = c || s || a;
      l && (u = function(d) {
        var g, v, p, h, m = this, b = a && m.sticky, E = n.call(m), _ = m.source, y = 0, k = d;
        return b && (E = E.replace("y", ""), E.indexOf("g") === -1 && (E += "g"), k = String(d).slice(m.lastIndex), m.lastIndex > 0 && (!m.multiline || m.multiline && d[m.lastIndex - 1] !== `
`) && (_ = "(?: " + _ + ")", k = " " + k, y++), v = new RegExp("^(?:" + _ + ")", E)), s && (v = new RegExp("^" + _ + "$(?!\\s)", E)), c && (g = m.lastIndex), p = o.call(b ? v : m, k), b ? p ? (p.input = p.input.slice(y), p[0] = p[0].slice(y), p.index = m.lastIndex, m.lastIndex += p[0].length) : m.lastIndex = 0 : c && p && (m.lastIndex = m.global ? p.index + p[0].length : g), s && p && p.length > 1 && t.call(p[0], v, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (p[h] = void 0);
        }), p;
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
          var d = "suspendedStart", g = "suspendedYield", v = "executing", p = "completed", h = {}, m = {};
          m[u] = function() {
            return this;
          };
          var b = Object.getPrototypeOf, E = b && b(b(ae([])));
          E && E !== r && o.call(E, u) && (m = E);
          var _ = j.prototype = w.prototype = Object.create(m);
          O.prototype = _.constructor = j, j.constructor = O, j[a] = O.displayName = "GeneratorFunction", l.isGeneratorFunction = function(T) {
            var A = typeof T == "function" && T.constructor;
            return !!A && (A === O || (A.displayName || A.name) === "GeneratorFunction");
          }, l.mark = function(T) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(T, j) : (T.__proto__ = j, a in T || (T[a] = "GeneratorFunction")), T.prototype = Object.create(_), T;
          }, l.awrap = function(T) {
            return { __await: T };
          }, C(S.prototype), S.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = S, l.async = function(T, A, z, K) {
            var R = new S(y(T, A, z, K));
            return l.isGeneratorFunction(A) ? R : R.next().then(function(ye) {
              return ye.done ? ye.value : R.next();
            });
          }, C(_), _[a] = "Generator", _[u] = function() {
            return this;
          }, _.toString = function() {
            return "[object Generator]";
          }, l.keys = function(T) {
            var A = [];
            for (var z in T) A.push(z);
            return A.reverse(), function K() {
              for (; A.length; ) {
                var R = A.pop();
                if (R in T) return K.value = R, K.done = !1, K;
              }
              return K.done = !0, K;
            };
          }, l.values = ae, X.prototype = { constructor: X, reset: function(T) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ne), !T) for (var A in this) A.charAt(0) === "t" && o.call(this, A) && !isNaN(+A.slice(1)) && (this[A] = n);
          }, stop: function() {
            this.done = !0;
            var T = this.tryEntries[0], A = T.completion;
            if (A.type === "throw") throw A.arg;
            return this.rval;
          }, dispatchException: function(T) {
            if (this.done) throw T;
            var A = this;
            function z(Pe, Ne) {
              return ye.type = "throw", ye.arg = T, A.next = Pe, Ne && (A.method = "next", A.arg = n), !!Ne;
            }
            for (var K = this.tryEntries.length - 1; K >= 0; --K) {
              var R = this.tryEntries[K], ye = R.completion;
              if (R.tryLoc === "root") return z("end");
              if (R.tryLoc <= this.prev) {
                var de = o.call(R, "catchLoc"), Le = o.call(R, "finallyLoc");
                if (de && Le) {
                  if (this.prev < R.catchLoc) return z(R.catchLoc, !0);
                  if (this.prev < R.finallyLoc) return z(R.finallyLoc);
                } else if (de) {
                  if (this.prev < R.catchLoc) return z(R.catchLoc, !0);
                } else {
                  if (!Le) throw new Error("try statement without catch or finally");
                  if (this.prev < R.finallyLoc) return z(R.finallyLoc);
                }
              }
            }
          }, abrupt: function(T, A) {
            for (var z = this.tryEntries.length - 1; z >= 0; --z) {
              var K = this.tryEntries[z];
              if (K.tryLoc <= this.prev && o.call(K, "finallyLoc") && this.prev < K.finallyLoc) {
                var R = K;
                break;
              }
            }
            R && (T === "break" || T === "continue") && R.tryLoc <= A && A <= R.finallyLoc && (R = null);
            var ye = R ? R.completion : {};
            return ye.type = T, ye.arg = A, R ? (this.method = "next", this.next = R.finallyLoc, h) : this.complete(ye);
          }, complete: function(T, A) {
            if (T.type === "throw") throw T.arg;
            return T.type === "break" || T.type === "continue" ? this.next = T.arg : T.type === "return" ? (this.rval = this.arg = T.arg, this.method = "return", this.next = "end") : T.type === "normal" && A && (this.next = A), h;
          }, finish: function(T) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var z = this.tryEntries[A];
              if (z.finallyLoc === T) return this.complete(z.completion, z.afterLoc), ne(z), h;
            }
          }, catch: function(T) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var z = this.tryEntries[A];
              if (z.tryLoc === T) {
                var K = z.completion;
                if (K.type === "throw") {
                  var R = K.arg;
                  ne(z);
                }
                return R;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(T, A, z) {
            return this.delegate = { iterator: ae(T), resultName: A, nextLoc: z }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function y(T, A, z, K) {
          var R = A && A.prototype instanceof w ? A : w, ye = Object.create(R.prototype), de = new X(K || []);
          return ye._invoke = U(T, z, de), ye;
        }
        function k(T, A, z) {
          try {
            return { type: "normal", arg: T.call(A, z) };
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
        function C(T) {
          ["next", "throw", "return"].forEach(function(A) {
            T[A] = function(z) {
              return this._invoke(A, z);
            };
          });
        }
        function S(T) {
          function A(R, ye, de, Le) {
            var Pe = k(T[R], T, ye);
            if (Pe.type !== "throw") {
              var Ne = Pe.arg, Ce = Ne.value;
              return Ce && typeof Ce == "object" && o.call(Ce, "__await") ? Promise.resolve(Ce.__await).then(function(Z) {
                A("next", Z, de, Le);
              }, function(Z) {
                A("throw", Z, de, Le);
              }) : Promise.resolve(Ce).then(function(Z) {
                Ne.value = Z, de(Ne);
              }, Le);
            }
            Le(Pe.arg);
          }
          var z;
          function K(R, ye) {
            function de() {
              return new Promise(function(Le, Pe) {
                A(R, ye, Le, Pe);
              });
            }
            return z = z ? z.then(de, de) : de();
          }
          this._invoke = K;
        }
        function U(T, A, z) {
          var K = d;
          return function(R, ye) {
            if (K === v) throw new Error("Generator is already running");
            if (K === p) {
              if (R === "throw") throw ye;
              return J();
            }
            for (z.method = R, z.arg = ye; ; ) {
              var de = z.delegate;
              if (de) {
                var Le = D(de, z);
                if (Le) {
                  if (Le === h) continue;
                  return Le;
                }
              }
              if (z.method === "next") z.sent = z._sent = z.arg;
              else if (z.method === "throw") {
                if (K === d) throw K = p, z.arg;
                z.dispatchException(z.arg);
              } else z.method === "return" && z.abrupt("return", z.arg);
              K = v;
              var Pe = k(T, A, z);
              if (Pe.type === "normal") {
                if (K = z.done ? p : g, Pe.arg === h) continue;
                return { value: Pe.arg, done: z.done };
              }
              Pe.type === "throw" && (K = p, z.method = "throw", z.arg = Pe.arg);
            }
          };
        }
        function D(T, A) {
          var z = T.iterator[A.method];
          if (z === n) {
            if (A.delegate = null, A.method === "throw") {
              if (T.iterator.return && (A.method = "return", A.arg = n, D(T, A), A.method === "throw")) return h;
              A.method = "throw", A.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var K = k(z, T.iterator, A.arg);
          if (K.type === "throw") return A.method = "throw", A.arg = K.arg, A.delegate = null, h;
          var R = K.arg;
          return R ? R.done ? (A[T.resultName] = R.value, A.next = T.nextLoc, A.method !== "return" && (A.method = "next", A.arg = n), A.delegate = null, h) : R : (A.method = "throw", A.arg = new TypeError("iterator result is not an object"), A.delegate = null, h);
        }
        function Q(T) {
          var A = { tryLoc: T[0] };
          1 in T && (A.catchLoc = T[1]), 2 in T && (A.finallyLoc = T[2], A.afterLoc = T[3]), this.tryEntries.push(A);
        }
        function ne(T) {
          var A = T.completion || {};
          A.type = "normal", delete A.arg, T.completion = A;
        }
        function X(T) {
          this.tryEntries = [{ tryLoc: "root" }], T.forEach(Q, this), this.reset(!0);
        }
        function ae(T) {
          if (T) {
            var A = T[u];
            if (A) return A.call(T);
            if (typeof T.next == "function") return T;
            if (!isNaN(T.length)) {
              var z = -1, K = function R() {
                for (; ++z < T.length; ) if (o.call(T, z)) return R.value = T[z], R.done = !1, R;
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
    }, "99af": function(i, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), c = e("50c4"), a = e("8418"), s = e("65f0"), l = e("1dde"), d = e("b622"), g = e("2d00"), v = d("isConcatSpreadable"), p = 9007199254740991, h = "Maximum allowed index exceeded", m = g >= 51 || !r(function() {
        var y = [];
        return y[v] = !1, y.concat()[0] !== y;
      }), b = l("concat"), E = function(y) {
        if (!t(y)) return !1;
        var k = y[v];
        return k !== void 0 ? !!k : o(y);
      }, _ = !m || !b;
      n({ target: "Array", proto: !0, forced: _ }, { concat: function(y) {
        var k, w, O, j, C, S = u(this), U = s(S, 0), D = 0;
        for (k = -1, O = arguments.length; k < O; k++) if (C = k === -1 ? S : arguments[k], E(C)) {
          if (j = c(C.length), D + j > p) throw TypeError(h);
          for (w = 0; w < j; w++, D++) w in C && a(U, D, C[w]);
        } else {
          if (D >= p) throw TypeError(h);
          a(U, D++, C);
        }
        return U.length = D, U;
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
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), c = e("65f0"), a = e("8418"), s = e("1dde"), l = s("splice"), d = Math.max, g = Math.min, v = 9007199254740991, p = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, m) {
        var b, E, _, y, k, w, O = u(this), j = t(O.length), C = r(h, j), S = arguments.length;
        if (S === 0 ? b = E = 0 : S === 1 ? (b = 0, E = j - C) : (b = S - 2, E = g(d(o(m), 0), j - C)), j + b - E > v) throw TypeError(p);
        for (_ = c(O, E), y = 0; y < E; y++) k = C + y, k in O && a(_, y, O[k]);
        if (_.length = E, b < E) {
          for (y = C; y < j - E; y++) k = y + E, w = y + b, k in O ? O[w] = O[k] : delete O[w];
          for (y = j; y > j - E + b; y--) delete O[y - 1];
        } else if (b > E) for (y = j - E; y > C; y--) k = y + E - 1, w = y + b - 1, k in O ? O[w] = O[k] : delete O[w];
        for (y = 0; y < b; y++) O[y + C] = arguments[y + 2];
        return O.length = j - E + b, _;
      } });
    }, a4b4: function(i, f, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), c = e("4930"), a = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), g = e("861d"), v = e("825a"), p = e("7b0b"), h = e("fc6a"), m = e("c04e"), b = e("5c6c"), E = e("7c73"), _ = e("df75"), y = e("241c"), k = e("057f"), w = e("7418"), O = e("06cf"), j = e("9bf2"), C = e("d1e7"), S = e("9112"), U = e("6eeb"), D = e("5692"), Q = e("f772"), ne = e("d012"), X = e("90e3"), ae = e("b622"), J = e("e538"), T = e("746f"), A = e("d44e"), z = e("69f3"), K = e("b727").forEach, R = Q("hidden"), ye = "Symbol", de = "prototype", Le = ae("toPrimitive"), Pe = z.set, Ne = z.getterFor(ye), Ce = Object[de], Z = r.Symbol, W = o("JSON", "stringify"), me = O.f, P = j.f, M = k.f, H = C.f, $ = D("symbols"), G = D("op-symbols"), te = D("string-to-symbol-registry"), we = D("symbol-to-string-registry"), ge = D("wks"), ue = r.QObject, ke = !ue || !ue[de] || !ue[de].findChild, Oe = u && s(function() {
        return E(P({}, "a", { get: function() {
          return P(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(F, Y, oe) {
        var ve = me(Ce, Y);
        ve && delete Ce[Y], P(F, Y, oe), ve && F !== Ce && P(Ce, Y, ve);
      } : P, Me = function(F, Y) {
        var oe = $[F] = E(Z[de]);
        return Pe(oe, { type: ye, tag: F, description: Y }), u || (oe.description = Y), oe;
      }, _e = a ? function(F) {
        return typeof F == "symbol";
      } : function(F) {
        return Object(F) instanceof Z;
      }, qe = function(F, Y, oe) {
        F === Ce && qe(G, Y, oe), v(F);
        var ve = m(Y, !0);
        return v(oe), l($, ve) ? (oe.enumerable ? (l(F, R) && F[R][ve] && (F[R][ve] = !1), oe = E(oe, { enumerable: b(0, !1) })) : (l(F, R) || P(F, R, b(1, {})), F[R][ve] = !0), Oe(F, ve, oe)) : P(F, ve, oe);
      }, Ge = function(F, Y) {
        v(F);
        var oe = h(Y), ve = _(oe).concat(se(oe));
        return K(ve, function(Ie) {
          u && !tt.call(oe, Ie) || qe(F, Ie, oe[Ie]);
        }), F;
      }, Xe = function(F, Y) {
        return Y === void 0 ? E(F) : Ge(E(F), Y);
      }, tt = function(F) {
        var Y = m(F, !0), oe = H.call(this, Y);
        return !(this === Ce && l($, Y) && !l(G, Y)) && (!(oe || !l(this, Y) || !l($, Y) || l(this, R) && this[R][Y]) || oe);
      }, V = function(F, Y) {
        var oe = h(F), ve = m(Y, !0);
        if (oe !== Ce || !l($, ve) || l(G, ve)) {
          var Ie = me(oe, ve);
          return !Ie || !l($, ve) || l(oe, R) && oe[R][ve] || (Ie.enumerable = !0), Ie;
        }
      }, ee = function(F) {
        var Y = M(h(F)), oe = [];
        return K(Y, function(ve) {
          l($, ve) || l(ne, ve) || oe.push(ve);
        }), oe;
      }, se = function(F) {
        var Y = F === Ce, oe = M(Y ? G : h(F)), ve = [];
        return K(oe, function(Ie) {
          !l($, Ie) || Y && !l(Ce, Ie) || ve.push($[Ie]);
        }), ve;
      };
      if (c || (Z = function() {
        if (this instanceof Z) throw TypeError("Symbol is not a constructor");
        var F = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, Y = X(F), oe = function(ve) {
          this === Ce && oe.call(G, ve), l(this, R) && l(this[R], Y) && (this[R][Y] = !1), Oe(this, Y, b(1, ve));
        };
        return u && ke && Oe(Ce, Y, { configurable: !0, set: oe }), Me(Y, F);
      }, U(Z[de], "toString", function() {
        return Ne(this).tag;
      }), U(Z, "withoutSetter", function(F) {
        return Me(X(F), F);
      }), C.f = tt, j.f = qe, O.f = V, y.f = k.f = ee, w.f = se, J.f = function(F) {
        return Me(ae(F), F);
      }, u && (P(Z[de], "description", { configurable: !0, get: function() {
        return Ne(this).description;
      } }), t || U(Ce, "propertyIsEnumerable", tt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Z }), K(_(ge), function(F) {
        T(F);
      }), n({ target: ye, stat: !0, forced: !c }, { for: function(F) {
        var Y = String(F);
        if (l(te, Y)) return te[Y];
        var oe = Z(Y);
        return te[Y] = oe, we[oe] = Y, oe;
      }, keyFor: function(F) {
        if (!_e(F)) throw TypeError(F + " is not a symbol");
        if (l(we, F)) return we[F];
      }, useSetter: function() {
        ke = !0;
      }, useSimple: function() {
        ke = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !u }, { create: Xe, defineProperty: qe, defineProperties: Ge, getOwnPropertyDescriptor: V }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: ee, getOwnPropertySymbols: se }), n({ target: "Object", stat: !0, forced: s(function() {
        w.f(1);
      }) }, { getOwnPropertySymbols: function(F) {
        return w.f(p(F));
      } }), W) {
        var pe = !c || s(function() {
          var F = Z();
          return W([F]) != "[null]" || W({ a: F }) != "{}" || W(Object(F)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: pe }, { stringify: function(F, Y, oe) {
          for (var ve, Ie = [F], ze = 1; arguments.length > ze; ) Ie.push(arguments[ze++]);
          if (ve = Y, (g(Y) || F !== void 0) && !_e(F)) return d(Y) || (Y = function(Je, xe) {
            if (typeof ve == "function" && (xe = ve.call(this, Je, xe)), !_e(xe)) return xe;
          }), Ie[1] = Y, W.apply(null, Ie);
        } });
      }
      Z[de][Le] || S(Z[de], Le, Z[de].valueOf), A(Z, ye), ne[R] = !0;
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
      var n, r, o, t = e("d039"), u = e("e163"), c = e("9112"), a = e("5135"), s = e("b622"), l = e("c430"), d = s("iterator"), g = !1, v = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : g = !0);
      var p = n == null || t(function() {
        var h = {};
        return n[d].call(h) !== h;
      });
      p && (n = {}), l && !p || a(n, d) || c(n, d, v), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: g };
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
        return new Promise(function(d, g) {
          var v = l.data, p = l.headers;
          n.isFormData(v) && delete p["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var m = l.auth.username || "", b = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            p.Authorization = "Basic " + btoa(m + ":" + b);
          }
          var E = u(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(E, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var y = "getAllResponseHeaders" in h ? c(h.getAllResponseHeaders()) : null, k = l.responseType && l.responseType !== "text" ? h.response : h.responseText, w = { data: k, status: h.status, statusText: h.statusText, headers: y, config: l, request: h };
              r(d, g, w), h = null;
            }
          }, h.onabort = function() {
            h && (g(s("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            g(s("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var y = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (y = l.timeoutErrorMessage), g(s(y, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var _ = (l.withCredentials || a(E)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            _ && (p[l.xsrfHeaderName] = _);
          }
          if ("setRequestHeader" in h && n.forEach(p, function(y, k) {
            typeof v > "u" && k.toLowerCase() === "content-type" ? delete p[k] : h.setRequestHeader(k, y);
          }), n.isUndefined(l.withCredentials) || (h.withCredentials = !!l.withCredentials), l.responseType) try {
            h.responseType = l.responseType;
          } catch (y) {
            if (l.responseType !== "json") throw y;
          }
          typeof l.onDownloadProgress == "function" && h.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(y) {
            h && (h.abort(), g(y), h = null);
          }), v || (v = null), h.send(v);
        });
      };
    }, b575: function(i, f, e) {
      var n, r, o, t, u, c, a, s, l = e("da84"), d = e("06cf").f, g = e("2cf4").set, v = e("1cdc"), p = e("a4b4"), h = e("605d"), m = l.MutationObserver || l.WebKitMutationObserver, b = l.document, E = l.process, _ = l.Promise, y = d(l, "queueMicrotask"), k = y && y.value;
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
      }, v || h || p || !m || !b ? _ && _.resolve ? (a = _.resolve(void 0), s = a.then, t = function() {
        s.call(a, n);
      }) : t = h ? function() {
        E.nextTick(n);
      } : function() {
        g.call(l, n);
      } : (u = !0, c = b.createTextNode(""), new m(n).observe(c, { characterData: !0 }), t = function() {
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
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), c = 1 .toFixed, a = Math.floor, s = function(h, m, b) {
        return m === 0 ? b : m % 2 === 1 ? s(h, m - 1, b * h) : s(h * h, m / 2, b);
      }, l = function(h) {
        for (var m = 0, b = h; b >= 4096; ) m += 12, b /= 4096;
        for (; b >= 2; ) m += 1, b /= 2;
        return m;
      }, d = function(h, m, b) {
        for (var E = -1, _ = b; ++E < 6; ) _ += m * h[E], h[E] = _ % 1e7, _ = a(_ / 1e7);
      }, g = function(h, m) {
        for (var b = 6, E = 0; --b >= 0; ) E += h[b], h[b] = a(E / m), E = E % m * 1e7;
      }, v = function(h) {
        for (var m = 6, b = ""; --m >= 0; ) if (b !== "" || m === 0 || h[m] !== 0) {
          var E = String(h[m]);
          b = b === "" ? E : b + t.call("0", 7 - E.length) + E;
        }
        return b;
      }, p = c && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        c.call({});
      });
      n({ target: "Number", proto: !0, forced: p }, { toFixed: function(h) {
        var m, b, E, _, y = o(this), k = r(h), w = [0, 0, 0, 0, 0, 0], O = "", j = "0";
        if (k < 0 || k > 20) throw RangeError("Incorrect fraction digits");
        if (y != y) return "NaN";
        if (y <= -1e21 || y >= 1e21) return String(y);
        if (y < 0 && (O = "-", y = -y), y > 1e-21) if (m = l(y * s(2, 69, 1)) - 69, b = m < 0 ? y * s(2, -m, 1) : y / s(2, m, 1), b *= 4503599627370496, m = 52 - m, m > 0) {
          for (d(w, 0, b), E = k; E >= 7; ) d(w, 1e7, 0), E -= 7;
          for (d(w, s(10, E, 1), 0), E = m - 1; E >= 23; ) g(w, 1 << 23), E -= 23;
          g(w, 1 << E), d(w, 1, 1), g(w, 2), j = v(w);
        } else d(w, 0, b), d(w, 1 << -m, 0), j = v(w) + t.call("0", k);
        return k > 0 ? (_ = j.length, j = O + (_ <= k ? "0." + t.call("0", k - _) + j : j.slice(0, _ - k) + "." + j.slice(_ - k))) : j = O + j, j;
      } });
    }, b727: function(i, f, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), c = [].push, a = function(s) {
        var l = s == 1, d = s == 2, g = s == 3, v = s == 4, p = s == 6, h = s == 7, m = s == 5 || p;
        return function(b, E, _, y) {
          for (var k, w, O = o(b), j = r(O), C = n(E, _, 3), S = t(j.length), U = 0, D = y || u, Q = l ? D(b, S) : d || h ? D(b, 0) : void 0; S > U; U++) if ((m || U in j) && (k = j[U], w = C(k, U, O), s)) if (l) Q[U] = w;
          else if (w) switch (s) {
            case 3:
              return !0;
            case 5:
              return k;
            case 6:
              return U;
            case 2:
              c.call(Q, k);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              c.call(Q, k);
          }
          return p ? -1 : g || v ? v : Q;
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
      function m(S) {
        return r.call(S) === "[object Blob]";
      }
      function b(S) {
        return r.call(S) === "[object Function]";
      }
      function E(S) {
        return g(S) && b(S.pipe);
      }
      function _(S) {
        return typeof URLSearchParams < "u" && S instanceof URLSearchParams;
      }
      function y(S) {
        return S.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function k() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function w(S, U) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), o(S)) for (var D = 0, Q = S.length; D < Q; D++) U.call(null, S[D], D, S);
        else for (var ne in S) Object.prototype.hasOwnProperty.call(S, ne) && U.call(null, S[ne], ne, S);
      }
      function O() {
        var S = {};
        function U(ne, X) {
          v(S[X]) && v(ne) ? S[X] = O(S[X], ne) : v(ne) ? S[X] = O({}, ne) : o(ne) ? S[X] = ne.slice() : S[X] = ne;
        }
        for (var D = 0, Q = arguments.length; D < Q; D++) w(arguments[D], U);
        return S;
      }
      function j(S, U, D) {
        return w(U, function(Q, ne) {
          S[ne] = D && typeof Q == "function" ? n(Q, D) : Q;
        }), S;
      }
      function C(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      i.exports = { isArray: o, isArrayBuffer: c, isBuffer: u, isFormData: a, isArrayBufferView: s, isString: l, isNumber: d, isObject: g, isPlainObject: v, isUndefined: t, isDate: p, isFile: h, isBlob: m, isFunction: b, isStream: E, isURLSearchParams: _, isStandardBrowserEnv: k, forEach: w, merge: O, extend: j, trim: y, stripBOM: C };
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
          var g = r(a), v = o(g), p = t(g.length), h = c ? p - 1 : 0, m = c ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in v) {
              d = v[h], h += m;
              break;
            }
            if (h += m, c ? h < 0 : p <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; c ? h >= 0 : p > h; h += m) h in v && (d = s(d, v[h], h, g));
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
      i.exports = function(v, p, h, m) {
        var b = o(v), E = !r(function() {
          var j = {};
          return j[b] = function() {
            return 7;
          }, ""[v](j) != 7;
        }), _ = E && !r(function() {
          var j = !1, C = /a/;
          return v === "split" && (C = {}, C.constructor = {}, C.constructor[c] = function() {
            return C;
          }, C.flags = "", C[b] = /./[b]), C.exec = function() {
            return j = !0, null;
          }, C[b](""), !j;
        });
        if (!E || !_ || v === "replace" && (!a || !s || d) || v === "split" && !g) {
          var y = /./[b], k = h(b, ""[v], function(j, C, S, U, D) {
            return C.exec === t ? E && !D ? { done: !0, value: y.call(C, S, U) } : { done: !0, value: j.call(S, C, U) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), w = k[0], O = k[1];
          n(String.prototype, v, w), n(RegExp.prototype, b, p == 2 ? function(j, C) {
            return O.call(j, this, C);
          } : function(j) {
            return O.call(j, this);
          });
        }
        m && u(RegExp.prototype[b], "sham", !0);
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
        for (var s, l, d = t(a), g = u.f, v = o(d), p = {}, h = 0; v.length > h; ) l = g(d, s = v[h++]), l !== void 0 && c(p, s, l);
        return p;
      } });
    }, ddb0: function(i, f, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), u = e("b622"), c = u("iterator"), a = u("toStringTag"), s = o.values;
      for (var l in r) {
        var d = n[l], g = d && d.prototype;
        if (g) {
          if (g[c] !== s) try {
            t(g, c, s);
          } catch {
            g[c] = s;
          }
          if (g[a] || t(g, a, l), r[l]) {
            for (var v in o) if (g[v] !== o[v]) try {
              t(g, v, o[v]);
            } catch {
              g[v] = o[v];
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
          function s(m) {
            for (var b = 0; b < m.length && m[b] === ""; b++) ;
            for (var E = m.length - 1; E >= 0 && m[E] === ""; E--) ;
            return b > E ? [] : m.slice(b, E - b + 1);
          }
          c = f.resolve(c).substr(1), a = f.resolve(a).substr(1);
          for (var l = s(c.split("/")), d = s(a.split("/")), g = Math.min(l.length, d.length), v = g, p = 0; p < g; p++) if (l[p] !== d[p]) {
            v = p;
            break;
          }
          var h = [];
          for (p = v; p < l.length; p++) h.push("..");
          return h = h.concat(d.slice(v)), h.join("/");
        }, f.sep = "/", f.delimiter = ":", f.dirname = function(c) {
          if (typeof c != "string" && (c += ""), c.length === 0) return ".";
          for (var a = c.charCodeAt(0), s = a === 47, l = -1, d = !0, g = c.length - 1; g >= 1; --g) if (a = c.charCodeAt(g), a === 47) {
            if (!d) {
              l = g;
              break;
            }
          } else d = !1;
          return l === -1 ? s ? "/" : "." : s && l === 1 ? "/" : c.slice(0, l);
        }, f.basename = function(c, a) {
          var s = o(c);
          return a && s.substr(-1 * a.length) === a && (s = s.substr(0, s.length - a.length)), s;
        }, f.extname = function(c) {
          typeof c != "string" && (c += "");
          for (var a = -1, s = 0, l = -1, d = !0, g = 0, v = c.length - 1; v >= 0; --v) {
            var p = c.charCodeAt(v);
            if (p !== 47) l === -1 && (d = !1, l = v + 1), p === 46 ? a === -1 ? a = v : g !== 1 && (g = 1) : a !== -1 && (g = -1);
            else if (!d) {
              s = v + 1;
              break;
            }
          }
          return a === -1 || l === -1 || g === 0 || g === 1 && a === l - 1 && a === s + 1 ? "" : c.slice(a, l);
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
          var r = function(p) {
            var h = p.id, m = p.viewBox, b = p.content;
            this.id = h, this.viewBox = m, this.content = b;
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
            var h = !!document.importNode, m = new DOMParser().parseFromString(p, "image/svg+xml").documentElement;
            return h ? document.importNode(m, !0) : m;
          };
          function t(p, h) {
            return h = { exports: {} }, p(h, h.exports), h.exports;
          }
          var u = t(function(p, h) {
            (function(m, b) {
              p.exports = b();
            })(0, function() {
              function m(w) {
                var O = w && typeof w == "object";
                return O && Object.prototype.toString.call(w) !== "[object RegExp]" && Object.prototype.toString.call(w) !== "[object Date]";
              }
              function b(w) {
                return Array.isArray(w) ? [] : {};
              }
              function E(w, O) {
                var j = O && O.clone === !0;
                return j && m(w) ? k(b(w), w, O) : w;
              }
              function _(w, O, j) {
                var C = w.slice();
                return O.forEach(function(S, U) {
                  typeof C[U] > "u" ? C[U] = E(S, j) : m(S) ? C[U] = k(w[U], S, j) : w.indexOf(S) === -1 && C.push(E(S, j));
                }), C;
              }
              function y(w, O, j) {
                var C = {};
                return m(w) && Object.keys(w).forEach(function(S) {
                  C[S] = E(w[S], j);
                }), Object.keys(O).forEach(function(S) {
                  m(O[S]) && w[S] ? C[S] = k(w[S], O[S], j) : C[S] = E(O[S], j);
                }), C;
              }
              function k(w, O, j) {
                var C = Array.isArray(O), S = j || { arrayMerge: _ }, U = S.arrayMerge || _;
                return C ? Array.isArray(w) ? U(w, O, j) : E(O, j) : y(w, O, j);
              }
              return k.all = function(w, O) {
                if (!Array.isArray(w) || w.length < 2) throw new Error("first argument should be an array with at least two elements");
                return w.reduce(function(j, C) {
                  return k(j, C, O);
                });
              }, k;
            });
          }), c = t(function(p, h) {
            var m = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = m, p.exports = h.default;
          }), a = function(p) {
            return Object.keys(p).map(function(h) {
              var m = p[h].toString().replace(/"/g, "&quot;");
              return h + '="' + m + '"';
            }).join(" ");
          }, s = c.svg, l = c.xlink, d = {};
          d[s.name] = s.uri, d[l.name] = l.uri;
          var g = function(p, h) {
            p === void 0 && (p = "");
            var m = u(d, {}), b = a(m);
            return "<svg " + b + ">" + p + "</svg>";
          }, v = function(p) {
            function h() {
              p.apply(this, arguments);
            }
            p && (h.__proto__ = p), h.prototype = Object.create(p && p.prototype), h.prototype.constructor = h;
            var m = { isMounted: {} };
            return m.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(b) {
              return new h({ id: b.getAttribute("id"), viewBox: b.getAttribute("viewBox"), content: b.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), p.prototype.destroy.call(this);
            }, h.prototype.mount = function(b) {
              if (this.isMounted) return this.node;
              var E = typeof b == "string" ? document.querySelector(b) : b, _ = this.render();
              return this.node = _, E.appendChild(_), _;
            }, h.prototype.render = function() {
              var b = this.stringify();
              return o(g(b)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, m), h;
          }(r);
          return v;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), c = e("9bf2").f, a = e("e893"), s = o.Symbol;
      if (r && typeof s == "function" && (!("description" in s.prototype) || s().description !== void 0)) {
        var l = {}, d = function() {
          var m = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), b = this instanceof d ? new s(m) : m === void 0 ? s() : s(m);
          return m === "" && (l[b] = !0), b;
        };
        a(d, s);
        var g = d.prototype = s.prototype;
        g.constructor = d;
        var v = g.toString, p = String(s("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        c(g, "description", { configurable: !0, get: function() {
          var m = u(this) ? this.valueOf() : this, b = v.call(m);
          if (t(l, m)) return "";
          var E = p ? b.slice(7, -1) : b.replace(h, "$1");
          return E === "" ? void 0 : E;
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
        var l = s(this), d = l.target, g = l.kind, v = l.index++;
        return !d || v >= d.length ? (l.target = void 0, { value: void 0, done: !0 }) : g == "keys" ? { value: v, done: !1 } : g == "values" ? { value: d[v], done: !1 } : { value: [v, d[v]], done: !1 };
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
      var n, r, o, t, u = e("23e7"), c = e("c430"), a = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), g = e("e2cc"), v = e("d44e"), p = e("2626"), h = e("861d"), m = e("1c0b"), b = e("19aa"), E = e("8925"), _ = e("2266"), y = e("1c7e"), k = e("4840"), w = e("2cf4").set, O = e("b575"), j = e("cdf9"), C = e("44de"), S = e("f069"), U = e("e667"), D = e("69f3"), Q = e("94ca"), ne = e("b622"), X = e("605d"), ae = e("2d00"), J = ne("species"), T = "Promise", A = D.get, z = D.set, K = D.getterFor(T), R = l, ye = a.TypeError, de = a.document, Le = a.process, Pe = s("fetch"), Ne = S.f, Ce = Ne, Z = !!(de && de.createEvent && a.dispatchEvent), W = typeof PromiseRejectionEvent == "function", me = "unhandledrejection", P = "rejectionhandled", M = 0, H = 1, $ = 2, G = 1, te = 2, we = Q(T, function() {
        var V = E(R) !== String(R);
        if (!V && (ae === 66 || !X && !W) || c && !R.prototype.finally) return !0;
        if (ae >= 51 && /native code/.test(R)) return !1;
        var ee = R.resolve(1), se = function(F) {
          F(function() {
          }, function() {
          });
        }, pe = ee.constructor = {};
        return pe[J] = se, !(ee.then(function() {
        }) instanceof se);
      }), ge = we || !y(function(V) {
        R.all(V).catch(function() {
        });
      }), ue = function(V) {
        var ee;
        return !(!h(V) || typeof (ee = V.then) != "function") && ee;
      }, ke = function(V, ee) {
        if (!V.notified) {
          V.notified = !0;
          var se = V.reactions;
          O(function() {
            for (var pe = V.value, F = V.state == H, Y = 0; se.length > Y; ) {
              var oe, ve, Ie, ze = se[Y++], Je = F ? ze.ok : ze.fail, xe = ze.resolve, Ze = ze.reject, He = ze.domain;
              try {
                Je ? (F || (V.rejection === te && qe(V), V.rejection = G), Je === !0 ? oe = pe : (He && He.enter(), oe = Je(pe), He && (He.exit(), Ie = !0)), oe === ze.promise ? Ze(ye("Promise-chain cycle")) : (ve = ue(oe)) ? ve.call(oe, xe, Ze) : xe(oe)) : Ze(pe);
              } catch (ft) {
                He && !Ie && He.exit(), Ze(ft);
              }
            }
            V.reactions = [], V.notified = !1, ee && !V.rejection && Me(V);
          });
        }
      }, Oe = function(V, ee, se) {
        var pe, F;
        Z ? (pe = de.createEvent("Event"), pe.promise = ee, pe.reason = se, pe.initEvent(V, !1, !0), a.dispatchEvent(pe)) : pe = { promise: ee, reason: se }, !W && (F = a["on" + V]) ? F(pe) : V === me && C("Unhandled promise rejection", se);
      }, Me = function(V) {
        w.call(a, function() {
          var ee, se = V.facade, pe = V.value, F = _e(V);
          if (F && (ee = U(function() {
            X ? Le.emit("unhandledRejection", pe, se) : Oe(me, se, pe);
          }), V.rejection = X || _e(V) ? te : G, ee.error)) throw ee.value;
        });
      }, _e = function(V) {
        return V.rejection !== G && !V.parent;
      }, qe = function(V) {
        w.call(a, function() {
          var ee = V.facade;
          X ? Le.emit("rejectionHandled", ee) : Oe(P, ee, V.value);
        });
      }, Ge = function(V, ee, se) {
        return function(pe) {
          V(ee, pe, se);
        };
      }, Xe = function(V, ee, se) {
        V.done || (V.done = !0, se && (V = se), V.value = ee, V.state = $, ke(V, !0));
      }, tt = function(V, ee, se) {
        if (!V.done) {
          V.done = !0, se && (V = se);
          try {
            if (V.facade === ee) throw ye("Promise can't be resolved itself");
            var pe = ue(ee);
            pe ? O(function() {
              var F = { done: !1 };
              try {
                pe.call(ee, Ge(tt, F, V), Ge(Xe, F, V));
              } catch (Y) {
                Xe(F, Y, V);
              }
            }) : (V.value = ee, V.state = H, ke(V, !1));
          } catch (F) {
            Xe({ done: !1 }, F, V);
          }
        }
      };
      we && (R = function(V) {
        b(this, R, T), m(V), n.call(this);
        var ee = A(this);
        try {
          V(Ge(tt, ee), Ge(Xe, ee));
        } catch (se) {
          Xe(ee, se);
        }
      }, n = function(V) {
        z(this, { type: T, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: M, value: void 0 });
      }, n.prototype = g(R.prototype, { then: function(V, ee) {
        var se = K(this), pe = Ne(k(this, R));
        return pe.ok = typeof V != "function" || V, pe.fail = typeof ee == "function" && ee, pe.domain = X ? Le.domain : void 0, se.parent = !0, se.reactions.push(pe), se.state != M && ke(se, !1), pe.promise;
      }, catch: function(V) {
        return this.then(void 0, V);
      } }), r = function() {
        var V = new n(), ee = A(V);
        this.promise = V, this.resolve = Ge(tt, ee), this.reject = Ge(Xe, ee);
      }, S.f = Ne = function(V) {
        return V === R || V === o ? new r(V) : Ce(V);
      }, c || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(V, ee) {
        var se = this;
        return new R(function(pe, F) {
          t.call(se, pe, F);
        }).then(V, ee);
      }, { unsafe: !0 }), typeof Pe == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(V) {
        return j(R, Pe.apply(a, arguments));
      } }))), u({ global: !0, wrap: !0, forced: we }, { Promise: R }), v(R, T, !1, !0), p(T), o = s(T), u({ target: T, stat: !0, forced: we }, { reject: function(V) {
        var ee = Ne(this);
        return ee.reject.call(void 0, V), ee.promise;
      } }), u({ target: T, stat: !0, forced: c || we }, { resolve: function(V) {
        return j(c && this === o ? R : this, V);
      } }), u({ target: T, stat: !0, forced: ge }, { all: function(V) {
        var ee = this, se = Ne(ee), pe = se.resolve, F = se.reject, Y = U(function() {
          var oe = m(ee.resolve), ve = [], Ie = 0, ze = 1;
          _(V, function(Je) {
            var xe = Ie++, Ze = !1;
            ve.push(void 0), ze++, oe.call(ee, Je).then(function(He) {
              Ze || (Ze = !0, ve[xe] = He, --ze || pe(ve));
            }, F);
          }), --ze || pe(ve);
        });
        return Y.error && F(Y.value), se.promise;
      }, race: function(V) {
        var ee = this, se = Ne(ee), pe = se.reject, F = U(function() {
          var Y = m(ee.resolve);
          _(V, function(oe) {
            Y.call(ee, oe).then(se.resolve, pe);
          });
        });
        return F.error && pe(F.value), se.promise;
      } });
    }, e893: function(i, f, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      i.exports = function(u, c) {
        for (var a = r(c), s = t.f, l = o.f, d = 0; d < a.length; d++) {
          var g = a[d];
          n(u, g) || s(u, g, l(c, g));
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
      }, d = function(m) {
        t(m, a, { value: { objectID: "O" + ++s, weakData: {} } });
      }, g = function(m, b) {
        if (!r(m)) return typeof m == "symbol" ? m : (typeof m == "string" ? "S" : "P") + m;
        if (!o(m, a)) {
          if (!l(m)) return "F";
          if (!b) return "E";
          d(m);
        }
        return m[a].objectID;
      }, v = function(m, b) {
        if (!o(m, a)) {
          if (!l(m)) return !0;
          if (!b) return !1;
          d(m);
        }
        return m[a].weakData;
      }, p = function(m) {
        return c && h.REQUIRED && l(m) && !o(m, a) && d(m), m;
      }, h = i.exports = { REQUIRED: !1, fastKey: g, getWeakData: v, onFreeze: p };
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
      function a(x, N, B, L, q, re) {
        var le = Object(t.resolveComponent)("Result"), ce = Object(t.resolveComponent)("DefaultBoard"), he = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Ue = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: N[1] || (N[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(le, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ce, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(he, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Ue]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(x, N, B) {
        return N in x ? Object.defineProperty(x, N, { value: B, enumerable: !0, configurable: !0, writable: !0 }) : x[N] = B, x;
      }
      function l(x, N) {
        var B = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var L = Object.getOwnPropertySymbols(x);
          N && (L = L.filter(function(q) {
            return Object.getOwnPropertyDescriptor(x, q).enumerable;
          })), B.push.apply(B, L);
        }
        return B;
      }
      function d(x) {
        for (var N = 1; N < arguments.length; N++) {
          var B = arguments[N] != null ? arguments[N] : {};
          N % 2 ? l(Object(B), !0).forEach(function(L) {
            s(x, L, B[L]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(B)) : l(Object(B)).forEach(function(L) {
            Object.defineProperty(x, L, Object.getOwnPropertyDescriptor(B, L));
          });
        }
        return x;
      }
      function g(x, N) {
        (N == null || N > x.length) && (N = x.length);
        for (var B = 0, L = new Array(N); B < N; B++) L[B] = x[B];
        return L;
      }
      function v(x) {
        if (Array.isArray(x)) return g(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function p(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function h(x, N) {
        if (x) {
          if (typeof x == "string") return g(x, N);
          var B = Object.prototype.toString.call(x).slice(8, -1);
          return B === "Object" && x.constructor && (B = x.constructor.name), B === "Map" || B === "Set" ? Array.from(x) : B === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(B) ? g(x, N) : void 0;
        }
      }
      function m() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function b(x) {
        return v(x) || p(x) || h(x) || m();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function E(x, N) {
        if (!(x instanceof N)) throw new TypeError("Cannot call a class as a function");
      }
      function _(x, N) {
        for (var B = 0; B < N.length; B++) {
          var L = N[B];
          L.enumerable = L.enumerable || !1, L.configurable = !0, "value" in L && (L.writable = !0), Object.defineProperty(x, L.key, L);
        }
      }
      function y(x, N, B) {
        return N && _(x.prototype, N), x;
      }
      var k = function() {
        function x() {
          E(this, x), this.listeners = {};
        }
        return y(x, [{ key: "on", value: function(N, B) {
          var L = this, q = this.listeners[N];
          return q || (q = []), q.push(B), this.listeners[N] = q, function() {
            L.remove(N, B);
          };
        } }, { key: "emit", value: function(N) {
          var B = this.listeners[N];
          if (Array.isArray(B)) {
            for (var L = arguments.length, q = new Array(L > 1 ? L - 1 : 0), re = 1; re < L; re++) q[re - 1] = arguments[re];
            for (var le = 0; le < B.length; le++) {
              var ce = B[le];
              typeof ce == "function" && ce.apply(void 0, q);
            }
          }
        } }, { key: "remove", value: function(N, B) {
          if (B) {
            var L = this.listeners[N];
            if (!L) return;
            L = L.filter(function(q) {
              return q !== B;
            }), this.listeners[N] = L;
          } else this.listeners[N] = null, delete this.listeners[N];
        } }]), x;
      }(), w = new k(), O = { mounted: function(x, N, B) {
        var L = x.parentNode;
        x.onmousedown = function(q) {
          var re = q.clientX - L.offsetLeft, le = q.clientY - L.offsetTop;
          document.onmousemove = function(ce) {
            var he = ce.clientX - re, Re = ce.clientY - le;
            L.style.left = he + "px", L.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(q) {
          var re = q.touches[0].pageX, le = q.touches[0].pageY, ce = re - L.offsetLeft, he = le - L.offsetTop;
          document.ontouchmove = function(Re) {
            var Ue = Re.touches[0].pageX, Ve = Re.touches[0].pageY, We = Ue - ce, it = Ve - he;
            L.style.left = We + "px", L.style.top = it + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              w.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, j = O, C = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, U = { class: "key-board-result-show" }, D = { class: "key-board-result-show-container" }, Q = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ne = C(function(x, N, B, L, q, re) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", U, [Object(t.createVNode)("div", D, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(le, ce) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ce, onClick: function(he) {
            return x.selectWord(le);
          } }, Object(t.toDisplayString)(ce + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", Q, [Object(t.createVNode)("span", { style: x.getStyle, onClick: N[1] || (N[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: N[2] || (N[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), X = (e("1276"), e("6062"), e("5319"), function(x, N) {
        for (var B = 0, L = []; B < x.length; ) L.push(x.slice(B, B += N));
        return L;
      }), ae = Symbol("KEYBOARD_CONTEXT"), J = function(x) {
        Object(t.provide)(ae, x);
      }, T = function() {
        return Object(t.inject)(ae);
      }, A = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, N) {
        var B = N.emit, L = T(), q = Object(t.computed)(function() {
          return { borderTopColor: L == null ? void 0 : L.color };
        }), re = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          re.showIndex !== 0 && (re.showIndex -= 1);
        }
        function ce() {
          re.showIndex !== re.showList.length - 1 && (re.showIndex += 1);
        }
        function he() {
          re.showIndex = 0, re.showList = [], re.valueList = [], w.emit("resultReset");
        }
        function Re(Ue) {
          he(), B("change", Ue);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Ue) {
          var Ve;
          re.showIndex = 0, re.valueList = (Ue == null || (Ve = Ue.value) === null || Ve === void 0 ? void 0 : Ve.split("")) || [], re.valueList.length !== 0 ? re.showList = X(re.valueList, 11) : re.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          w.on("keyBoardChange", function(Ue) {
            w.emit("updateBound"), re.status = Ue, he();
          }), w.on("getWordsFromServer", function(Ue) {
            var Ve = Array.from(new Set(Ue.replace(/\s+/g, "").split("")));
            re.valueList = Ve, re.showList = X(Ve, 11);
          });
        }), Object(t.onUnmounted)(function() {
          w.remove("keyBoardChange"), w.remove("getWordsFromServer");
        }), d({ color: L == null ? void 0 : L.color, upper: le, lower: ce, getStyle: q, selectWord: Re }, Object(t.toRefs)(re));
      } });
      e("e66c"), A.render = ne, A.__scopeId = "data-v-02e63132";
      var z = A, K = e("bc3a"), R = e.n(K), ye = 15e3, de = function(x) {
        R.a.defaults.baseURL = x, R.a.defaults.timeout = ye, R.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Le(x, N, B, L, q, re) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Pe = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var N = T(), B = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: N == null ? void 0 : N.color, iconName: B };
      } });
      e("38cd"), Pe.render = Le;
      var Ne = Pe, Ce = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Z = { class: "hand-write-board" }, W = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var me = Ce(function(x, N, B, L, q, re) {
        var le = Object(t.resolveComponent)("PaintBoard"), ce = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Z, [Object(t.createVNode)(le, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", W, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(he) {
          return Object(t.openBlock)(), Object(t.createBlock)(ce, { key: he.type, type: he.type, data: he.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), P = { class: "paint-board" };
      function M(x, N, B, L, q, re) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", P, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: N[1] || (N[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: N[2] || (N[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: N[3] || (N[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: N[4] || (N[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: N[5] || (N[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: N[6] || (N[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: N[7] || (N[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function H(x, N, B, L, q, re, le) {
        try {
          var ce = x[re](le), he = ce.value;
        } catch (Re) {
          return void B(Re);
        }
        ce.done ? N(he) : Promise.resolve(he).then(L, q);
      }
      function $(x) {
        return function() {
          var N = this, B = arguments;
          return new Promise(function(L, q) {
            var re = x.apply(N, B);
            function le(he) {
              H(re, L, q, le, ce, "next", he);
            }
            function ce(he) {
              H(re, L, q, le, ce, "throw", he);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var G, te, we = function() {
        var x = $(regeneratorRuntime.mark(function N(B, L, q, re) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, R.a.post("", { lib: re, lpXis: B, lpYis: L, lpCis: q });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, N);
        }));
        return function(N, B, L, q) {
          return x.apply(this, arguments);
        };
      }(), ge = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var N = T(), B = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), L = Object(t.ref)(null);
        function q() {
          return re.apply(this, arguments);
        }
        function re() {
          return re = $(regeneratorRuntime.mark(function Te() {
            var Qe, $e;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, we(B.clickX, B.clickY, B.clickC, x.lib);
                case 2:
                  Qe = Ye.sent, $e = Qe.data, w.emit("getWordsFromServer", ($e == null ? void 0 : $e.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Te);
          })), re.apply(this, arguments);
        }
        function le() {
          L.value && G && (B.clickX = [], B.clickY = [], B.clickC = [], G.clearRect(0, 0, B.width, B.height));
        }
        function ce(Te) {
          if (Te.type.includes("mouse")) {
            var Qe = Te;
            return Math.floor(Qe.clientX - B.x);
          }
          if (Te.type.includes("touch")) {
            var $e, Ye = Te;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientX) - B.x);
          }
          return 0;
        }
        function he(Te) {
          if (Te.type.includes("mouse")) {
            var Qe = Te;
            return Math.floor(Qe.clientY - B.y);
          }
          if (Te.type.includes("touch")) {
            var $e, Ye = Te;
            return Math.floor((($e = Ye.targetTouches[0]) === null || $e === void 0 ? void 0 : $e.clientY) - B.y);
          }
          return 0;
        }
        function Re(Te) {
          if (G) {
            B.isMouseDown = !0;
            var Qe = ce(Te), $e = he(Te);
            clearTimeout(te), B.oldX = Qe, B.oldY = $e, G.beginPath();
          }
        }
        function Ue(Te) {
          if (G && (Te.preventDefault(), B.isMouseDown)) {
            var Qe = ce(Te), $e = he(Te);
            B.clickX.push(Qe), B.clickY.push($e), B.clickC.push(0), G.strokeStyle = N == null ? void 0 : N.color, G.fillStyle = N == null ? void 0 : N.color, G.lineWidth = 4, G.lineCap = "round", G.moveTo(B.oldX, B.oldY), G.lineTo(Qe, $e), G.stroke(), B.oldX = Qe, B.oldY = $e;
          }
        }
        function Ve() {
          B.isMouseDown && (B.isMouseDown = !1, te = setTimeout(function() {
            le();
          }, 1500), B.clickC.pop(), B.clickC.push(1), q());
        }
        function We() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Te = document.querySelector(".paint-board").getBoundingClientRect();
              B.x = Te.x, B.y = Te.y, B.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), B.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function it() {
          var Te;
          G = (Te = L.value) === null || Te === void 0 ? void 0 : Te.getContext("2d"), le(), We(), window.addEventListener("animationend", We), window.addEventListener("resize", We), window.addEventListener("scroll", We);
        }
        return Object(t.onMounted)(function() {
          it(), w.on("updateBound", function() {
            We();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", We), window.removeEventListener("resize", We), window.removeEventListener("scroll", We), w.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(B)), {}, { move: Ue, down: Re, mouseup: Ve, canvasRef: L });
      } });
      ge.render = M;
      var ue = ge;
      function ke(x, N, B, L, q, re) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: N[1] || (N[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: N[2] || (N[2] = function(ce) {
          return x.isHoverStatus = !0;
        }), onMouseleave: N[3] || (N[3] = function(ce) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Oe = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Ne }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, N) {
        var B = N.emit, L = T(), q = Object(t.ref)(!1), re = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), le = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || q.value ? { color: "#f5f5f5", background: L == null ? void 0 : L.color } : { color: L == null ? void 0 : L.color, background: "#f5f5f5" };
        });
        function ce(he) {
          he.preventDefault(), B("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: q, getStyle: le, getCode: re, click: ce };
      } });
      e("de23"), Oe.render = ke;
      var Me = Oe, _e = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ue, KeyCodeButton: Me }, setup: function(x, N) {
        var B = N.emit, L = T(), q = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function re(le) {
          var ce = le.data, he = le.type;
          switch (he) {
            case "close":
              L == null || L.closeKeyBoard();
              break;
            case "back":
              L == null || L.changeDefaultBoard(), w.emit("resultReset"), w.emit("keyBoardChange", q.isCn && "CN");
              break;
            case "change2lang":
              q.isCn = !q.isCn;
              break;
            case "delete":
              B("trigger", { data: ce, type: he });
              break;
          }
        }
        return d({ click: re }, Object(t.toRefs)(q));
      } });
      e("9aaf"), _e.render = me, _e.__scopeId = "data-v-1b5e0983";
      var qe = _e, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Xe = { class: "default-key-board" }, tt = { class: "line line4" };
      Object(t.popScopeId)();
      var V = Ge(function(x, N, B, L, q, re) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Xe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(ce, he) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(he + 1)], key: he }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ce, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: x.isUpper, key: Re, type: Re, data: Re, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", tt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(ce) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ce.type, type: ce.type, data: ce.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ee = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), se = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, pe = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, F = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], Y = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Me }, emits: ["translate", "trigger", "change"], setup: function(x, N) {
        var B = N.emit, L = T(), q = Object(t.reactive)({ lineList: [se.line1, se.line2, se.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function re() {
          var ce;
          q.line4 = JSON.parse(JSON.stringify(F)), L != null && (ce = L.modeList) !== null && ce !== void 0 && ce.find(function(he) {
            return he === "handwrite";
          }) && L !== null && L !== void 0 && L.handApi && q.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ce) {
          var he = ce.data, Re = ce.type;
          switch (Re) {
            case "close":
              q.oldVal = "", L == null || L.closeKeyBoard();
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
                var Ve = JSON.parse(JSON.stringify(pe.line3));
                L != null && (Ue = L.modeList) !== null && Ue !== void 0 && Ue.find(function(We) {
                  return We === "symbol";
                }) || (Ve.shift(), Ve.unshift("+")), q.lineList = [pe.line1, pe.line2, Ve];
              } else w.emit("keyBoardChange", q.isCn ? "CN" : "EN"), q.lineList = [se.line1, se.line2, se.line3];
              break;
            case "#+=":
              q.isSymbol = !q.isSymbol, q.isSymbol ? (w.emit("keyBoardChange", "symbol"), q.lineList = [ee.line1, ee.line2, ee.line3]) : (w.emit("keyBoardChange", "number"), q.lineList = [pe.line1, pe.line2, pe.line3]);
              break;
            case "handwrite":
            case "delete":
              q.isCn && Re === "delete" && q.oldVal ? (q.oldVal = q.oldVal.substr(0, q.oldVal.length - 1), B("translate", q.oldVal)) : (Re === "handwrite" && w.emit("keyBoardChange", "handwrite"), B("trigger", { data: he, type: Re }));
              break;
            default:
              !q.isCn || q.isNum || q.isSymbol ? B("change", he) : (B("translate", q.oldVal + he), q.oldVal = q.oldVal + he);
              break;
          }
        }
        return re(), Object(t.onMounted)(function() {
          w.on("resultReset", function() {
            q.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(q)), {}, { click: le });
      } });
      e("f8b0"), Y.render = V, Y.__scopeId = "data-v-4b78e5a1";
      var oe = Y, ve = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ie = e("ec57"), ze = function(x) {
        return x.keys().map(x);
      };
      ze(Ie);
      var Je = [], xe = null, Ze = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: j }, components: { Result: z, SvgIcon: Ne, HandBoard: qe, DefaultBoard: oe }, setup: function(x, N) {
        var B = N.emit, L = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), q = Object(t.ref)(null);
        function re(Se) {
          var Ee, Ae;
          switch (Object(t.nextTick)(function() {
            w.emit("keyBoardChange", "CN");
          }), Se) {
            case "en":
              L.showMode = "default", Object(t.nextTick)(function() {
                var Be;
                (Be = q.value) === null || Be === void 0 || Be.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              L.showMode = "default", Object(t.nextTick)(function() {
                var Be;
                (Be = q.value) === null || Be === void 0 || Be.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Ee = x.modeList) !== null && Ee !== void 0 && Ee.find(function(Be) {
                return Be === "handwrite";
              }) && x.handApi ? (L.showMode = "handwrite", Object(t.nextTick)(function() {
                w.emit("keyBoardChange", "handwrite");
              })) : L.showMode = "default";
              break;
            case "symbol":
              L.showMode = "default", (Ae = x.modeList) !== null && Ae !== void 0 && Ae.find(function(Be) {
                return Be === "symbol";
              }) && Object(t.nextTick)(function() {
                var Be, et;
                (Be = q.value) === null || Be === void 0 || Be.click({ data: ".?123", type: "change2num" }), (et = q.value) === null || et === void 0 || et.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              L.showMode = "default";
              break;
          }
        }
        function le(Se) {
          if (L.visible = !0, xe = Se.target, re(xe.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Ee = document.querySelector(".key-board-modal");
            Ee.style.display = "block";
          }
        }
        function ce() {
          if (xe && xe.blur(), xe = null, L.visible = !1, B("closed"), L.showMode = "default", L.resultVal = {}, document.querySelector(".key-board-modal")) {
            var Se = document.querySelector(".key-board-modal");
            Se.style.display = "none";
          }
        }
        function he() {
          x.closeOnClickModal && ce(), B("modalClick");
        }
        function Re() {
          var Se;
          if (document.querySelector(".key-board-modal")) {
            var Ee;
            (Ee = document.querySelector(".key-board-modal")) === null || Ee === void 0 || Ee.addEventListener("click", he);
          } else {
            var Ae = document.createElement("div");
            Ae.className = "key-board-modal", Ae.style.display = "none", (Se = document.querySelector("body")) === null || Se === void 0 || Se.appendChild(Ae), Ae.addEventListener("click", he);
          }
        }
        function Ue() {
          x.handApi && de(x.handApi), [].concat(b(document.querySelectorAll("input")), b(document.querySelectorAll("textarea"))).forEach(function(Se) {
            Se.getAttribute("data-mode") !== null && (Je.push(Se), Se.addEventListener("focus", le), x.blurHide && Se.addEventListener("blur", ce));
          });
        }
        function Ve(Se) {
          if (!xe) return "";
          var Ee = xe, Ae = Ee.selectionStart, Be = Ee.selectionEnd;
          if (!Ae || !Be) return "";
          var et = Se.substring(0, Ae - 1) + Se.substring(Be);
          return Ee.value = et, Ee.focus(), Ee.selectionStart = Ae - 1, Ee.selectionEnd = Ae - 1, et;
        }
        function We(Se) {
          var Ee = Se.type;
          switch (Ee) {
            case "handwrite":
              L.showMode = "handwrite";
              break;
            case "delete":
              if (!xe) return;
              var Ae = Ve(xe.value);
              xe.value = Ae, B("change", Ae, xe.getAttribute("data-prop") || xe);
              break;
          }
        }
        function it(Se, Ee) {
          if (!xe) return "";
          var Ae = xe, Be = Ae.selectionStart || 0, et = Ae.selectionEnd || 0, mt = Se.substring(0, Be) + Ee + Se.substring(et);
          return Ae.value = mt, Ae.focus(), Ae.selectionStart = Be + Ee.length, Ae.selectionEnd = Be + Ee.length, mt;
        }
        function Te(Se) {
          if (xe) {
            var Ee = it(xe.value, Se);
            xe.value = Ee, B("change", Ee, xe.getAttribute("data-prop") || xe), B("keyChange", Se, xe.getAttribute("data-prop") || xe);
          }
        }
        function Qe(Se) {
          var Ee = new RegExp("^".concat(Se, "\\w*")), Ae = Object.keys(ve).filter(function(Be) {
            return Ee.test(Be);
          }).sort();
          L.resultVal = { code: Se, value: Se ? Ae.length > 1 ? Ae.reduce(function(Be, et) {
            return Be + ve[et];
          }, "") : ve[Ae[0]] : "" }, xe && B("keyChange", Se, xe.getAttribute("data-prop") || xe);
        }
        function $e() {
          Ue();
        }
        function Ye() {
          return xe;
        }
        return Object(t.onMounted)(function() {
          x.modal && Re(), Ue(), w.on("resultReset", function() {
            L.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var Se;
          (Se = document.querySelector(".key-board-modal")) === null || Se === void 0 || Se.removeEventListener("click", he), Je.forEach(function(Ee) {
            Ee.removeEventListener("focus", le), Ee.removeEventListener("blur", ce);
          });
        }), J(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          ce();
        }, changeDefaultBoard: function() {
          L.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(L)), {}, { defaultBoardRef: q, getCurrentInput: Ye, translate: Qe, reSignUp: $e, trigger: We, change: Te });
      } });
      Ze.render = a;
      var He = Ze;
      He.install = function(x) {
        x.component(He.name, He);
      };
      var ft = He, Ot = ft;
      f.default = Ot;
    }, fb6a: function(i, f, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), c = e("fc6a"), a = e("8418"), s = e("b622"), l = e("1dde"), d = l("slice"), g = s("species"), v = [].slice, p = Math.max;
      n({ target: "Array", proto: !0, forced: !d }, { slice: function(h, m) {
        var b, E, _, y = c(this), k = u(y.length), w = t(h, k), O = t(m === void 0 ? k : m, k);
        if (o(y) && (b = y.constructor, typeof b != "function" || b !== Array && !o(b.prototype) ? r(b) && (b = b[g], b === null && (b = void 0)) : b = void 0, b === Array || b === void 0)) return v.call(y, w, O);
        for (E = new (b === void 0 ? Array : b)(p(O - w, 0)), _ = 0; w < O; w++, _++) w in y && a(E, _, y[w]);
        return E.length = _, E;
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
})(St);
var Qn = St.exports;
const Hn = /* @__PURE__ */ Wn(Qn);
Ct({
  components: { KeyBoard: Hn },
  setup() {
    function je(ie, fe) {
      console.log("change value ---->", ie), console.log("change input dom ---->", fe);
    }
    return {
      change: je
    };
  }
});
const Kn = { class: "app-container" }, Yn = {
  __name: "App",
  setup(je) {
    return At(), (ie, fe) => (De(), Fe("div", Kn, [
      fe[0] || (fe[0] = I("h1", null, "涪特智能养护台车控制系统", -1)),
      rt(dn),
      rt(qn),
      rt(Jt),
      rt(In)
    ]));
  }
};
export {
  Yn as default
};
