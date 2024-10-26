import Pt, { ref as te, onMounted as lt, provide as gt, readonly as yt, inject as bt, watch as ot, openBlock as Pe, createElementBlock as Ie, createElementVNode as C, toDisplayString as Ue, Fragment as ut, renderList as st, normalizeClass as at, createCommentVNode as ct, reactive as ht, createVNode as Je, onUnmounted as St, computed as ft, createTextVNode as wt, normalizeStyle as _t, defineComponent as It, withDirectives as pt, vModelText as vt, unref as Nt } from "vue";
const Ot = Symbol(), jt = Symbol(), Et = Symbol();
function Bt(be, ne) {
  be && be.messageSignal ? be.messageSignal.connect((re) => {
    try {
      const a = JSON.parse(re);
      ne.value = a, console.log("Received message from PyQt:", a);
    } catch (a) {
      console.error("Failed to parse message:", a), ne.value = { type: "unknown", content: re };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const be = te(null), ne = te(null), re = te("");
  function a() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      be.value = d, ne.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), Bt(ne.value, re), ne.value && typeof ne.value.vueReady == "function" ? ne.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  lt(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? a() : document.addEventListener("DOMContentLoaded", a);
  }), gt(Ot, yt(be)), gt(jt, yt(ne)), gt(Et, yt(re));
}
function nt() {
  const be = bt(Ot), ne = bt(jt), re = bt(Et);
  return (!be || !ne || !re) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: be,
    bridge: ne,
    message: re,
    sendToPyQt: (d, e) => {
      if (console.log(`Attempting to call ${d} with args:`, e), ne && ne.value)
        if (typeof ne.value.sendToPyQt == "function")
          try {
            ne.value.sendToPyQt(d, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(ne.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const it = (be, ne) => {
  const re = be.__vccOpts || be;
  for (const [a, d] of ne)
    re[a] = d;
  return re;
}, $t = {
  key: 0,
  class: "numeric-keyboard"
}, Mt = { class: "keyboard" }, Ut = { class: "current-value" }, Ft = ["onClick"], Dt = {
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
  setup(be, { emit: ne }) {
    const re = be, a = ne, d = te([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = te("");
    ot(() => re.showKeyboard, (r) => {
      r && (e.value = re.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (Pe(), Ie("div", $t, [
      C("div", Mt, [
        C("div", Ut, Ue(e.value), 1),
        (Pe(!0), Ie(ut, null, st(d.value, (t) => (Pe(), Ie("div", {
          key: t.join(),
          class: "row"
        }, [
          (Pe(!0), Ie(ut, null, st(t, (u) => (Pe(), Ie("button", {
            key: u,
            onClick: (s) => n(u),
            class: at({ "function-key": u === "清除" || u === "确定" })
          }, Ue(u), 11, Ft))), 128))
        ]))), 128))
      ])
    ])) : ct("", !0);
  }
}, Ct = /* @__PURE__ */ it(Dt, [["__scopeId", "data-v-541feda2"]]), Vt = { class: "settings-container" }, Wt = { class: "setting-group" }, qt = { class: "setting-item" }, zt = { class: "setting-controls" }, Kt = ["value"], Qt = { class: "setting-item" }, Ht = { class: "setting-controls" }, Gt = ["value"], Yt = { class: "setting-group" }, Jt = { class: "setting-item" }, Xt = { class: "setting-controls" }, Zt = ["value"], en = { class: "setting-item" }, tn = { class: "setting-controls" }, nn = ["value"], rn = {
  __name: "SensorSettings",
  setup(be) {
    const { sendToPyQt: ne } = nt(), re = ht({
      isPyQtWebEngine: !1
    }), a = te(30), d = te(10), e = te(80), n = te(20), r = te(!1), o = te(null), t = te("");
    lt(() => {
      if (re.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, re.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = nt();
        ot(g, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const v = JSON.parse(p.content);
              a.value = v.temp_upper, d.value = v.temp_lower, e.value = v.humidity_upper, n.value = v.humidity_lower, console.log("Sensor Settings updated:", v);
            } catch (v) {
              console.error("Failed to parse sensor settings data:", v);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), l();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const h = JSON.parse(p.content).args;
            a.value = h.temp_upper, d.value = h.temp_lower, e.value = h.humidity_upper, n.value = h.humidity_lower, l();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (g, p) => {
      const v = g === "tempUpper" ? a : g === "tempLower" ? d : g === "humidityUpper" ? e : n;
      v.value = (v.value || 0) + p, g.startsWith("temp") ? s(g === "tempUpper" ? "upper" : "lower") : i(g === "humidityUpper" ? "upper" : "lower");
    }, s = (g) => {
      a.value === "" && (a.value = d.value + 1), d.value === "" && (d.value = a.value - 1), g === "upper" ? a.value = Math.max(d.value + 1, a.value) : d.value = Math.min(a.value - 1, d.value), l();
    }, i = (g) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), g === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), l();
    }, l = () => {
      if (a.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const g = {
          temp_upper: a.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", g), re.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ne("updateLimitSettings", g)) : console.log("在普通网页环境中执行更新设置");
      }
    }, c = (g) => {
      o.value = g, r.value = !0, t.value = g.startsWith("temp") ? g === "tempUpper" ? a.value : d.value : g === "humidityUpper" ? e.value : n.value;
    }, f = (g) => {
      const p = parseFloat(g);
      isNaN(p) || (o.value === "tempUpper" ? (a.value = p, s("upper")) : o.value === "tempLower" ? (d.value = p, s("lower")) : o.value === "humidityUpper" ? (e.value = p, i("upper")) : o.value === "humidityLower" && (n.value = p, i("lower"))), o.value = null;
    };
    return (g, p) => (Pe(), Ie("div", Vt, [
      C("div", Wt, [
        p[15] || (p[15] = C("h2", null, "温度设置 (°C)", -1)),
        C("div", qt, [
          p[13] || (p[13] = C("span", { class: "setting-label" }, "上限：", -1)),
          C("div", zt, [
            C("button", {
              onClick: p[0] || (p[0] = (v) => u("tempUpper", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: a.value,
              onFocus: p[1] || (p[1] = (v) => c("tempUpper")),
              readonly: ""
            }, null, 40, Kt),
            C("button", {
              onClick: p[2] || (p[2] = (v) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        C("div", Qt, [
          p[14] || (p[14] = C("span", { class: "setting-label" }, "下限：", -1)),
          C("div", Ht, [
            C("button", {
              onClick: p[3] || (p[3] = (v) => u("tempLower", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (v) => c("tempLower")),
              readonly: ""
            }, null, 40, Gt),
            C("button", {
              onClick: p[5] || (p[5] = (v) => u("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      C("div", Yt, [
        p[18] || (p[18] = C("h2", null, "湿度设置 (%)", -1)),
        C("div", Jt, [
          p[16] || (p[16] = C("span", { class: "setting-label" }, "上限：", -1)),
          C("div", Xt, [
            C("button", {
              onClick: p[6] || (p[6] = (v) => u("humidityUpper", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => c("humidityUpper")),
              readonly: ""
            }, null, 40, Zt),
            C("button", {
              onClick: p[8] || (p[8] = (v) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        C("div", en, [
          p[17] || (p[17] = C("span", { class: "setting-label" }, "下限：", -1)),
          C("div", tn, [
            C("button", {
              onClick: p[9] || (p[9] = (v) => u("humidityLower", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => c("humidityLower")),
              readonly: ""
            }, null, 40, nn),
            C("button", {
              onClick: p[11] || (p[11] = (v) => u("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Je(Ct, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": p[12] || (p[12] = (v) => r.value = v)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, on = /* @__PURE__ */ it(rn, [["__scopeId", "data-v-19eef055"]]), an = { class: "sensor-data-group" }, un = { class: "sensor-section" }, sn = { class: "sensor-container" }, cn = { class: "sensor-grid" }, ln = { class: "sensor-title" }, dn = { class: "sensor-value" }, fn = { class: "sensor-section" }, pn = { class: "sensor-container" }, vn = { class: "sensor-grid" }, hn = { class: "sensor-title" }, mn = { class: "sensor-value" }, gn = {
  __name: "SensorDisplay",
  setup(be) {
    const ne = te({ temperature: {}, humidity: {} }), { sendToPyQt: re } = nt();
    lt(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: d } = nt();
        ot(d, (e) => {
          if (e && e.type === "update_sensor_data")
            try {
              ne.value = JSON.parse(e.content);
            } catch (n) {
              console.error("Failed to parse sensor data:", n);
            }
          else e && e.type === "get_sensor_data" && re("update_remote_sensor_data", ne.value);
        });
      } else
        console.log("在普通网页环境中执行"), a(), setInterval(a, 5e3);
    });
    const a = async () => {
      try {
        const d = await fetch("http://localhost:8000/api/sensor-data/");
        if (!d.ok)
          throw new Error(`HTTP error! status: ${d.status}`);
        const e = await d.json();
        ne.value = e;
      } catch (d) {
        console.error("Error fetching sensor data:", d);
      }
    };
    return (d, e) => (Pe(), Ie("div", an, [
      C("div", un, [
        e[0] || (e[0] = C("h2", null, "温度传感器", -1)),
        C("div", sn, [
          C("div", cn, [
            (Pe(!0), Ie(ut, null, st(ne.value.temperature, (n, r) => (Pe(), Ie("div", {
              key: r,
              class: "sensor-card"
            }, [
              C("div", ln, Ue(r), 1),
              C("div", dn, Ue(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      C("div", fn, [
        e[1] || (e[1] = C("h2", null, "湿度传感器", -1)),
        C("div", pn, [
          C("div", vn, [
            (Pe(!0), Ie(ut, null, st(ne.value.humidity, (n, r) => (Pe(), Ie("div", {
              key: r,
              class: "sensor-card"
            }, [
              C("div", hn, Ue(r), 1),
              C("div", mn, Ue(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ it(gn, [["__scopeId", "data-v-4d55ddc2"]]), bn = { class: "integrated-control-system" }, wn = { class: "mode-controls" }, xn = ["disabled"], kn = ["disabled"], Sn = { class: "systems-container" }, _n = { class: "steam-engine-control" }, On = { class: "control-panel" }, jn = { class: "engine-status" }, En = { class: "engine left" }, Cn = ["disabled"], Tn = { class: "engine right" }, An = ["disabled"], Ln = { class: "sprinkler-system" }, Pn = { class: "controls" }, In = { class: "input-group" }, Nn = ["value"], Bn = { class: "input-group" }, Rn = ["value"], $n = { class: "input-group" }, Mn = ["value"], Un = { class: "visualization" }, Fn = ["onClick"], Dn = { class: "status" }, Vn = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(be) {
    const ne = te(!1), re = te(!1), a = te(5), d = te(2), e = te(10), n = te(a.value), r = te(d.value), o = te(e.value), t = te(a.value), u = te(d.value), s = te(e.value), i = te(0), l = te(""), c = te(Array(12).fill(0)), f = te(0), g = te(!0), p = te(!1), v = te(!1), h = te(null), b = te(""), y = te(!1), w = te(15), E = te(""), k = te(""), _ = te(0), { sendToPyQt: m } = nt(), j = te(0), O = ht({
      isPyQtWebEngine: !1
    }), T = te([]);
    let S, U, F;
    const X = be;
    ot(() => X.message, (H) => {
      H != null && H.content && (g.value ? L("manual") : L("auto"));
    }), lt(() => {
      if (O.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = nt();
        ot(H, (P) => {
          if (P && P.type === "update_left_steam_status")
            ne.value = P.content;
          else if (P && P.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), W();
          else if (P && P.type === "update_right_steam_status")
            re.value = P.content;
          else if (P && P.type === "update_sprinkler_settings")
            try {
              const Y = JSON.parse(P.content);
              t.value = Y.sprinkler_single_run_time, u.value = Y.sprinkler_run_interval_time, s.value = Y.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = s.value, console.log("Sprinkler Settings updated:", Y);
            } catch (Y) {
              console.error("Failed to parse sprinkler settings data:", Y);
            }
          else if (P && P.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", P.content);
            const ye = JSON.parse(P.content).args;
            t.value = ye.sprinkler_single_run_time, u.value = ye.sprinkler_run_interval_time, s.value = ye.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = s.value, Ee();
          } else if (P && P.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", P.content);
            const Y = JSON.parse(P.content);
            Y.method === "startSystem" ? Oe() : Y.method === "stopSystem" ? Se() : Y.method === "setMode" ? L(Y.args.mode) : Y.method === "click_toggleEngine" ? Z() : Y.method === "toggleManualSprinkler" && ge(Y.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), St(() => {
      clearInterval(F), clearInterval(U), G();
    });
    const ae = (H) => {
      H !== void 0 && clearTimeout(H);
    }, G = () => {
      T.value.forEach((H) => {
        ae(H);
      }), T.value = [];
    }, W = () => {
      const H = {
        leftEngineOn: ne.value,
        rightEngineOn: re.value,
        currentSingleRunTime: a.value,
        currentRunIntervalTime: d.value,
        currentLoopInterval: e.value,
        nextSingleRunTime: n.value,
        nextRunIntervalTime: r.value,
        nextLoopInterval: o.value,
        tempSingleRunTime: t.value,
        tempRunIntervalTime: u.value,
        tempLoopInterval: s.value,
        activeSprinkler: i.value,
        currentPhase: l.value,
        waterLevels: c.value,
        remainingTime: f.value,
        isAutoMode: g.value,
        isRunning: p.value,
        isSwitching: y.value,
        switchingTime: w.value,
        switchingMessage: E.value,
        switchPhase: k.value,
        phaseStartTime: j.value,
        chose_n: _.value
      };
      m("IntegratedControlSystem_init_response", H);
    }, D = ft(() => y.value ? `${E.value}，还需${w.value}秒` : g.value ? p.value ? l.value === "run" ? `喷头 ${i.value} 正在运行，剩余 ${f.value + 1} 秒` : l.value === "interval" ? `运行间隔中，剩余 ${f.value + 1} 秒` : l.value === "loop" ? `循环间隔中，剩余 ${f.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    async function A(H, P) {
      return k.value = P, y.value = !0, w.value = 15, j.value = Date.now(), E.value = H ? "正在切换到喷淋管" : "正在切换到喷雾机", m("controlSprinkler", { target: "switchToSprinkler", state: H }), F = setInterval(() => {
        w.value--, w.value <= 0 && (clearInterval(F), y.value = !1);
      }, 1e3), new Promise((Y) => {
        S = setTimeout(() => {
          y.value = !1, Y();
        }, w.value * 1e3), T.value.push(S);
      });
    }
    async function L(H) {
      const P = g.value;
      if (g.value = H === "auto", P !== g.value)
        if (O.isPyQtWebEngine && (m("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: H } }), m("controlSprinkler", { target: "setMode", mode: g.value ? "auto" : "manual" })), g.value) {
          clearInterval(F), G(), y.value = !1, ne.value && await Q();
          const Y = c.value.findIndex((ye) => ye === 100);
          Y !== -1 && (c.value[Y] = 0, O.isPyQtWebEngine && m("controlSprinkler", { target: "manual_control_sprayer", index: Y + 1, state: 0 })), m("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await Se();
    }
    async function Q() {
      O.isPyQtWebEngine && (m("setEngineState", { engine: "left", state: !ne.value }), m("setEngineState", { engine: "right", state: !re.value }), ne.value = !ne.value, re.value = !re.value);
    }
    async function Z() {
      const H = c.value.findIndex((P) => P === 100);
      O.isPyQtWebEngine && H === -1 && (m("IntegratedControlSystem_set_response", { method: "click_toggleEngine", args: {} }), ne.value ? m("controlSprinkler", { target: "tankWork", state: 0 }) : (await A(0, "click_toggleEngine"), m("controlSprinkler", { target: "tankWork", state: 1 })), m("setEngineState", { engine: "left", state: !ne.value }), m("setEngineState", { engine: "right", state: !re.value }), ne.value = !ne.value, re.value = !re.value);
    }
    function M(H) {
      h.value = H, v.value = !0, b.value = H === "singleRunTime" ? t.value.toString() : H === "runIntervalTime" ? u.value.toString() : s.value.toString();
    }
    function we(H) {
      const P = parseInt(H);
      isNaN(P) || (h.value === "singleRunTime" ? (t.value = P, pe()) : h.value === "runIntervalTime" ? (u.value = P, Ae()) : h.value === "loopInterval" && (s.value = P, Ne())), h.value = null;
    }
    function pe() {
      t.value = Math.max(1, t.value), n.value = t.value, Ee();
    }
    function Ae() {
      u.value = Math.max(0, u.value), r.value = u.value, Ee();
    }
    function Ne() {
      s.value = Math.max(0, s.value), o.value = s.value, Ee();
    }
    function Ee() {
      if (O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const H = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        m("controlSprinkler", { target: "settings", settings: JSON.stringify(H) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function Oe() {
      m("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(p.value || !g.value) && (p.value = !0, c.value = Array(12).fill(0), await He());
    }
    async function Se() {
      m("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), O.isPyQtWebEngine && (i.value > 0 && m("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), m("controlSprinkler", { target: "setState", state: !1 })), ne.value && await Q(), Ve(), m("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function Ve() {
      p.value = !1, y.value = !1, clearInterval(F), clearInterval(U), G(), i.value = 0, l.value = "", c.value = Array(12).fill(0), f.value = 0;
    }
    async function He() {
      await A(1, "runCycle"), i.value = 1, m("controlSprinkler", { target: "tankWork", state: 1 }), J();
    }
    async function B() {
      i.value = 1, J();
    }
    function R() {
      !p.value || !g.value || (f.value--, f.value > 0 && (S = setTimeout(R, 1e3), T.value.push(S)));
    }
    function J() {
      if (!p.value || !g.value) return;
      l.value = "run", a.value = n.value, f.value = a.value, j.value = Date.now(), R();
      let H = Date.now();
      m("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 1 }), U = setInterval(() => {
        let P = Date.now() - H, Y = Math.min(P / (a.value * 1e3), 1);
        c.value[i.value - 1] = Y * 100;
      }, 100), S = setTimeout(async () => {
        clearInterval(U), i.value < 12 ? (c.value[i.value - 1] = 0, m("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), V()) : (c.value[i.value - 1] = 0, m("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), ee());
      }, a.value * 1e3), T.value.push(S);
    }
    function V() {
      !p.value || !g.value || (d.value = r.value, f.value = d.value, j.value = Date.now(), f.value > 0 && (l.value = "interval"), R(), S = setTimeout(() => {
        i.value++, J();
      }, d.value * 1e3), T.value.push(S));
    }
    async function ee() {
      !p.value || !g.value || (e.value = o.value, f.value = e.value, f.value > 0 ? (m("controlSprinkler", { target: "tankWork", state: 0 }), await A(0, "runLoopInterval"), m("controlSprinkler", { target: "setState", state: !0 }), j.value = Date.now(), l.value = "loop", R(), i.value = 0, S = setTimeout(async () => {
        c.value = Array(12).fill(0), m("controlSprinkler", { target: "setState", state: !1 }), ne.value && await Q(), m("controlSprinkler", { target: "tankWork", state: 0 }), await He();
      }, e.value * 1e3), T.value.push(S)) : (i.value = 0, c.value = Array(12).fill(0), await B()));
    }
    function ie(H) {
      return c.value[H - 1];
    }
    async function ge(H) {
      if (g.value) return;
      m("IntegratedControlSystem_set_response", { method: "toggleManualSprinkler", args: { n: H } });
      const P = c.value.findIndex((Y) => Y === 100);
      c.value[H - 1] > 0 ? (c.value[H - 1] = 0, O.isPyQtWebEngine && (m("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 0 }), m("controlSprinkler", { target: "tankWork", state: 0 }))) : P !== -1 ? (c.value[P] = 0, O.isPyQtWebEngine && m("controlSprinkler", { target: "manual_control_sprayer", index: P + 1, state: 0 }), c.value[H - 1] = 100, O.isPyQtWebEngine && m("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 1 })) : (_.value = H, await A(1, "toggleManualSprinkler"), m("controlSprinkler", { target: "tankWork", state: 1 }), c.value[H - 1] = 100, O.isPyQtWebEngine && m("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 1 }));
    }
    return (H, P) => (Pe(), Ie("div", bn, [
      P[15] || (P[15] = C("h2", null, "集成控制系统", -1)),
      C("div", wn, [
        C("button", {
          onClick: P[0] || (P[0] = (Y) => L("auto")),
          class: at([{ active: g.value }, "mode-btn"])
        }, "自动模式", 2),
        C("button", {
          onClick: P[1] || (P[1] = (Y) => L("manual")),
          class: at([{ active: !g.value }, "mode-btn"])
        }, "手动模式", 2),
        C("button", {
          onClick: Oe,
          disabled: p.value || !g.value,
          class: "control-btn"
        }, "开始", 8, xn),
        C("button", {
          onClick: Se,
          disabled: !p.value || !g.value,
          class: "control-btn"
        }, "停止", 8, kn)
      ]),
      C("div", Sn, [
        C("div", _n, [
          P[10] || (P[10] = C("h3", null, "雾化机控制系统", -1)),
          C("div", On, [
            C("div", jn, [
              C("div", En, [
                P[7] || (P[7] = C("h4", null, "左雾化机", -1)),
                C("div", {
                  class: at(["status", { on: ne.value }])
                }, [
                  P[6] || (P[6] = C("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + Ue(ne.value ? "开" : "关"), 1)
                ], 2),
                C("button", {
                  onClick: Z,
                  disabled: g.value || y.value,
                  class: "control-btn"
                }, Ue(ne.value ? "关闭" : "开启"), 9, Cn)
              ]),
              C("div", Tn, [
                P[9] || (P[9] = C("h4", null, "右雾化机", -1)),
                C("div", {
                  class: at(["status", { on: re.value }])
                }, [
                  P[8] || (P[8] = C("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + Ue(re.value ? "开" : "关"), 1)
                ], 2),
                C("button", {
                  onClick: Z,
                  disabled: g.value || y.value,
                  class: "control-btn"
                }, Ue(re.value ? "关闭" : "开启"), 9, An)
              ])
            ])
          ])
        ]),
        C("div", Ln, [
          P[14] || (P[14] = C("h3", null, "喷淋系统", -1)),
          C("div", Pn, [
            C("div", In, [
              P[11] || (P[11] = C("label", null, "单次运行时间 (秒):", -1)),
              C("input", {
                type: "text",
                value: t.value,
                onFocus: P[2] || (P[2] = (Y) => M("singleRunTime")),
                readonly: ""
              }, null, 40, Nn)
            ]),
            C("div", Bn, [
              P[12] || (P[12] = C("label", null, "运行时间间隔 (秒):", -1)),
              C("input", {
                type: "text",
                value: u.value,
                onFocus: P[3] || (P[3] = (Y) => M("runIntervalTime")),
                readonly: ""
              }, null, 40, Rn)
            ]),
            C("div", $n, [
              P[13] || (P[13] = C("label", null, "循环时间间隔 (秒):", -1)),
              C("input", {
                type: "text",
                value: s.value,
                onFocus: P[4] || (P[4] = (Y) => M("loopInterval")),
                readonly: ""
              }, null, 40, Mn)
            ])
          ]),
          C("div", Un, [
            (Pe(), Ie(ut, null, st(12, (Y) => C("div", {
              key: Y,
              class: at(["sprinkler", { active: g.value ? i.value === Y : c.value[Y - 1] > 0 }]),
              onClick: (ye) => !y.value && !g.value && !ne.value && ge(Y)
            }, [
              C("div", {
                class: "water",
                style: _t({ height: ie(Y) + "%" })
              }, null, 4),
              C("span", null, Ue(Y), 1)
            ], 10, Fn)), 64))
          ]),
          C("div", Dn, Ue(D.value), 1)
        ])
      ]),
      Je(Ct, {
        modelValue: b.value,
        showKeyboard: v.value,
        "onUpdate:modelValue": we,
        "onUpdate:showKeyboard": P[5] || (P[5] = (Y) => v.value = Y)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Wn = /* @__PURE__ */ it(Vn, [["__scopeId", "data-v-b82898d6"]]), qn = { class: "data-actions" }, zn = {
  key: 0,
  class: "modal-overlay"
}, Kn = { class: "modal-content settings-modal" }, Qn = { class: "setting-group" }, Hn = { class: "setting-item" }, Gn = { class: "setting-controls" }, Yn = { class: "value-display" }, Jn = { class: "setting-item" }, Xn = { class: "setting-controls" }, Zn = { class: "value-display" }, er = {
  key: 1,
  class: "modal-overlay"
}, tr = {
  key: 2,
  class: "modal-overlay"
}, nr = { class: "modal-content" }, rr = {
  __name: "DataExport",
  setup(be) {
    const { sendToPyQt: ne } = nt(), re = ht({
      isPyQtWebEngine: !1
    }), a = te(!1), d = te(!1), e = te(""), n = te(!1), r = te(0), o = te(0), t = te(0), u = te(0), s = () => {
      t.value = r.value, u.value = o.value, n.value = !0;
    }, i = () => {
      u.value = o.value, t.value = r.value, n.value = !1;
    }, l = () => {
      r.value = t.value, o.value = u.value, n.value = !1, ne("saveAdjustSettings", { temp_adjust: r.value, humidity_adjust: o.value });
    }, c = (y, w) => {
      y === "tempAdjust" ? t.value = t.value + w : y === "humidityAdjust" && (u.value = u.value + w);
    };
    lt(() => {
      if (re.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, re.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: y } = nt();
        ot(y, (w) => {
          if (w && w.type === "update_adjust_settings")
            try {
              const E = JSON.parse(w.content);
              r.value = E.temp_adjust, o.value = E.humidity_adjust;
            } catch (E) {
              console.error("Failed to parse adjust settings:", E);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const f = () => {
      re.isPyQtWebEngine && (console.log("导出数据"), ne("exportData", !0));
    }, g = () => {
      a.value = !0;
    }, p = () => {
      a.value = !1;
    }, v = () => {
      console.log("清空数据"), a.value = !1, h("所有数据已清空！"), re.isPyQtWebEngine && ne("exportData", !1);
    }, h = (y) => {
      e.value = y, d.value = !0;
    }, b = () => {
      d.value = !1;
    };
    return (y, w) => (Pe(), Ie("div", qn, [
      C("div", { class: "action-buttons" }, [
        C("div", { class: "button-group" }, [
          w[4] || (w[4] = C("i", { class: "fas fa-file-excel" }, null, -1)),
          C("button", {
            onClick: f,
            class: "export-btn"
          }, "导出数据")
        ]),
        C("div", { class: "button-group" }, [
          w[5] || (w[5] = C("i", { class: "fas fa-trash-alt" }, null, -1)),
          C("button", {
            onClick: g,
            class: "clear-btn"
          }, "清空数据")
        ]),
        C("div", { class: "button-group" }, [
          w[6] || (w[6] = C("i", { class: "fas fa-cog" }, null, -1)),
          C("button", {
            onClick: s,
            class: "settings-btn"
          }, "传感器设置")
        ])
      ]),
      n.value ? (Pe(), Ie("div", zn, [
        C("div", Kn, [
          C("div", Qn, [
            w[9] || (w[9] = C("h2", null, "传感器数据设置（设为正/负数使数据整体上/下调）", -1)),
            C("div", Hn, [
              w[7] || (w[7] = C("span", { class: "setting-label" }, "温度数据设置：", -1)),
              C("div", Gn, [
                C("button", {
                  onClick: w[0] || (w[0] = (E) => c("tempAdjust", -1))
                }, "-"),
                C("span", Yn, Ue(t.value), 1),
                C("button", {
                  onClick: w[1] || (w[1] = (E) => c("tempAdjust", 1))
                }, "+")
              ])
            ]),
            C("div", Jn, [
              w[8] || (w[8] = C("span", { class: "setting-label" }, "湿度数据设置：", -1)),
              C("div", Xn, [
                C("button", {
                  onClick: w[2] || (w[2] = (E) => c("humidityAdjust", -1))
                }, "-"),
                C("span", Zn, Ue(u.value), 1),
                C("button", {
                  onClick: w[3] || (w[3] = (E) => c("humidityAdjust", 1))
                }, "+")
              ])
            ])
          ]),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: l,
              class: "confirm-btn"
            }, "保存"),
            C("button", {
              onClick: i,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ct("", !0),
      a.value ? (Pe(), Ie("div", er, [
        C("div", { class: "modal-content" }, [
          w[10] || (w[10] = C("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: v,
              class: "confirm-btn"
            }, "确定"),
            C("button", {
              onClick: p,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ct("", !0),
      d.value ? (Pe(), Ie("div", tr, [
        C("div", nr, [
          C("p", null, Ue(e.value), 1),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: b,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ct("", !0)
    ]));
  }
}, or = /* @__PURE__ */ it(rr, [["__scopeId", "data-v-b126fc61"]]);
var ir = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ar(be) {
  return be && be.__esModule && Object.prototype.hasOwnProperty.call(be, "default") ? be.default : be;
}
var Tt = { exports: {} };
(function(be, ne) {
  (function(re, a) {
    be.exports = a(Pt);
  })(typeof self < "u" ? self : ir, function(re) {
    return function(a) {
      var d = {};
      function e(n) {
        if (d[n]) return d[n].exports;
        var r = d[n] = { i: n, l: !1, exports: {} };
        return a[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports;
      }
      return e.m = a, e.c = d, e.d = function(n, r, o) {
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
    }({ "00ee": function(a, d, e) {
      var n = e("b622"), r = n("toStringTag"), o = {};
      o[r] = "z", a.exports = String(o) === "[object z]";
    }, "0366": function(a, d, e) {
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
            return function(u, s) {
              return r.call(o, u, s);
            };
          case 3:
            return function(u, s, i) {
              return r.call(o, u, s, i);
            };
        }
        return function() {
          return r.apply(o, arguments);
        };
      };
    }, "057f": function(a, d, e) {
      var n = e("fc6a"), r = e("241c").f, o = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], u = function(s) {
        try {
          return r(s);
        } catch {
          return t.slice();
        }
      };
      a.exports.f = function(s) {
        return t && o.call(s) == "[object Window]" ? u(s) : r(n(s));
      };
    }, "06cf": function(a, d, e) {
      var n = e("83ab"), r = e("d1e7"), o = e("5c6c"), t = e("fc6a"), u = e("c04e"), s = e("5135"), i = e("0cfb"), l = Object.getOwnPropertyDescriptor;
      d.f = n ? l : function(c, f) {
        if (c = t(c), f = u(f, !0), i) try {
          return l(c, f);
        } catch {
        }
        if (s(c, f)) return o(!r.f.call(c, f), c[f]);
      };
    }, "0a06": function(a, d, e) {
      var n = e("c532"), r = e("30b5"), o = e("f6b4"), t = e("5270"), u = e("4a7b");
      function s(i) {
        this.defaults = i, this.interceptors = { request: new o(), response: new o() };
      }
      s.prototype.request = function(i) {
        typeof i == "string" ? (i = arguments[1] || {}, i.url = arguments[0]) : i = i || {}, i = u(this.defaults, i), i.method ? i.method = i.method.toLowerCase() : this.defaults.method ? i.method = this.defaults.method.toLowerCase() : i.method = "get";
        var l = [t, void 0], c = Promise.resolve(i);
        for (this.interceptors.request.forEach(function(f) {
          l.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          l.push(f.fulfilled, f.rejected);
        }); l.length; ) c = c.then(l.shift(), l.shift());
        return c;
      }, s.prototype.getUri = function(i) {
        return i = u(this.defaults, i), r(i.url, i.params, i.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(i) {
        s.prototype[i] = function(l, c) {
          return this.request(u(c || {}, { method: i, url: l, data: (c || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(i) {
        s.prototype[i] = function(l, c, f) {
          return this.request(u(f || {}, { method: i, url: l, data: c }));
        };
      }), a.exports = s;
    }, "0cb2": function(a, d, e) {
      var n = e("7b0b"), r = Math.floor, o = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, u = /\$([$&'`]|\d{1,2})/g;
      a.exports = function(s, i, l, c, f, g) {
        var p = l + s.length, v = c.length, h = u;
        return f !== void 0 && (f = n(f), h = t), o.call(g, h, function(b, y) {
          var w;
          switch (y.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return s;
            case "`":
              return i.slice(0, l);
            case "'":
              return i.slice(p);
            case "<":
              w = f[y.slice(1, -1)];
              break;
            default:
              var E = +y;
              if (E === 0) return b;
              if (E > v) {
                var k = r(E / 10);
                return k === 0 ? b : k <= v ? c[k - 1] === void 0 ? y.charAt(1) : c[k - 1] + y.charAt(1) : b;
              }
              w = c[E - 1];
          }
          return w === void 0 ? "" : w;
        });
      };
    }, "0cfb": function(a, d, e) {
      var n = e("83ab"), r = e("d039"), o = e("cc12");
      a.exports = !n && !r(function() {
        return Object.defineProperty(o("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(a, d, e) {
      a.exports = function(n) {
        return function(r) {
          return n.apply(null, r);
        };
      };
    }, 1148: function(a, d, e) {
      var n = e("a691"), r = e("1d80");
      a.exports = "".repeat || function(o) {
        var t = String(r(this)), u = "", s = n(o);
        if (s < 0 || s == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; s > 0; (s >>>= 1) && (t += t)) 1 & s && (u += t);
        return u;
      };
    }, 1276: function(a, d, e) {
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), s = e("8aa5"), i = e("50c4"), l = e("14c3"), c = e("9263"), f = e("d039"), g = [].push, p = Math.min, v = 4294967295, h = !f(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(b, y, w) {
        var E;
        return E = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(k, _) {
          var m = String(t(this)), j = _ === void 0 ? v : _ >>> 0;
          if (j === 0) return [];
          if (k === void 0) return [m];
          if (!r(k)) return y.call(m, k, j);
          for (var O, T, S, U = [], F = (k.ignoreCase ? "i" : "") + (k.multiline ? "m" : "") + (k.unicode ? "u" : "") + (k.sticky ? "y" : ""), X = 0, ae = new RegExp(k.source, F + "g"); (O = c.call(ae, m)) && (T = ae.lastIndex, !(T > X && (U.push(m.slice(X, O.index)), O.length > 1 && O.index < m.length && g.apply(U, O.slice(1)), S = O[0].length, X = T, U.length >= j))); )
            ae.lastIndex === O.index && ae.lastIndex++;
          return X === m.length ? !S && ae.test("") || U.push("") : U.push(m.slice(X)), U.length > j ? U.slice(0, j) : U;
        } : "0".split(void 0, 0).length ? function(k, _) {
          return k === void 0 && _ === 0 ? [] : y.call(this, k, _);
        } : y, [function(k, _) {
          var m = t(this), j = k == null ? void 0 : k[b];
          return j !== void 0 ? j.call(k, m, _) : E.call(String(m), k, _);
        }, function(k, _) {
          var m = w(E, k, this, _, E !== y);
          if (m.done) return m.value;
          var j = o(k), O = String(this), T = u(j, RegExp), S = j.unicode, U = (j.ignoreCase ? "i" : "") + (j.multiline ? "m" : "") + (j.unicode ? "u" : "") + (h ? "y" : "g"), F = new T(h ? j : "^(?:" + j.source + ")", U), X = _ === void 0 ? v : _ >>> 0;
          if (X === 0) return [];
          if (O.length === 0) return l(F, O) === null ? [O] : [];
          for (var ae = 0, G = 0, W = []; G < O.length; ) {
            F.lastIndex = h ? G : 0;
            var D, A = l(F, h ? O : O.slice(G));
            if (A === null || (D = p(i(F.lastIndex + (h ? 0 : G)), O.length)) === ae) G = s(O, G, S);
            else {
              if (W.push(O.slice(ae, G)), W.length === X) return W;
              for (var L = 1; L <= A.length - 1; L++) if (W.push(A[L]), W.length === X) return W;
              G = ae = D;
            }
          }
          return W.push(O.slice(ae)), W;
        }];
      }, !h);
    }, "13d5": function(a, d, e) {
      var n = e("23e7"), r = e("d58f").left, o = e("a640"), t = e("2d00"), u = e("605d"), s = o("reduce"), i = !u && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !s || i }, { reduce: function(l) {
        return r(this, l, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(a, d, e) {
      var n = e("c6b6"), r = e("9263");
      a.exports = function(o, t) {
        var u = o.exec;
        if (typeof u == "function") {
          var s = u.call(o, t);
          if (typeof s != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return s;
        }
        if (n(o) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return r.call(o, t);
      };
    }, "159b": function(a, d, e) {
      var n = e("da84"), r = e("fdbc"), o = e("17c2"), t = e("9112");
      for (var u in r) {
        var s = n[u], i = s && s.prototype;
        if (i && i.forEach !== o) try {
          t(i, "forEach", o);
        } catch {
          i.forEach = o;
        }
      }
    }, "17c2": function(a, d, e) {
      var n = e("b727").forEach, r = e("a640"), o = r("forEach");
      a.exports = o ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(a, d) {
      a.exports = function(e, n, r) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
        return e;
      };
    }, "1be4": function(a, d, e) {
      var n = e("d066");
      a.exports = n("document", "documentElement");
    }, "1c0b": function(a, d) {
      a.exports = function(e) {
        if (typeof e != "function") throw TypeError(String(e) + " is not a function");
        return e;
      };
    }, "1c7e": function(a, d, e) {
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
      a.exports = function(s, i) {
        if (!i && !o) return !1;
        var l = !1;
        try {
          var c = {};
          c[r] = function() {
            return { next: function() {
              return { done: l = !0 };
            } };
          }, s(c);
        } catch {
        }
        return l;
      };
    }, "1cdc": function(a, d, e) {
      var n = e("342f");
      a.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(a, d, e) {
      a.exports = function(n, r) {
        return function() {
          for (var o = new Array(arguments.length), t = 0; t < o.length; t++) o[t] = arguments[t];
          return n.apply(r, o);
        };
      };
    }, "1d80": function(a, d) {
      a.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(a, d, e) {
      var n = e("d039"), r = e("b622"), o = e("2d00"), t = r("species");
      a.exports = function(u) {
        return o >= 51 || !n(function() {
          var s = [], i = s.constructor = {};
          return i[t] = function() {
            return { foo: 1 };
          }, s[u](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(a, d, e) {
      (function(n) {
        (function(r, o) {
          a.exports = o();
        })(0, function() {
          function r(B, R) {
            return R = { exports: {} }, B(R, R.exports), R.exports;
          }
          var o = r(function(B, R) {
            (function(J, V) {
              B.exports = V();
            })(0, function() {
              function J(P) {
                var Y = P && typeof P == "object";
                return Y && Object.prototype.toString.call(P) !== "[object RegExp]" && Object.prototype.toString.call(P) !== "[object Date]";
              }
              function V(P) {
                return Array.isArray(P) ? [] : {};
              }
              function ee(P, Y) {
                var ye = Y && Y.clone === !0;
                return ye && J(P) ? H(V(P), P, Y) : P;
              }
              function ie(P, Y, ye) {
                var Be = P.slice();
                return Y.forEach(function(je, We) {
                  typeof Be[We] > "u" ? Be[We] = ee(je, ye) : J(je) ? Be[We] = H(P[We], je, ye) : P.indexOf(je) === -1 && Be.push(ee(je, ye));
                }), Be;
              }
              function ge(P, Y, ye) {
                var Be = {};
                return J(P) && Object.keys(P).forEach(function(je) {
                  Be[je] = ee(P[je], ye);
                }), Object.keys(Y).forEach(function(je) {
                  J(Y[je]) && P[je] ? Be[je] = H(P[je], Y[je], ye) : Be[je] = ee(Y[je], ye);
                }), Be;
              }
              function H(P, Y, ye) {
                var Be = Array.isArray(Y), je = ye || { arrayMerge: ie }, We = je.arrayMerge || ie;
                return Be ? Array.isArray(P) ? We(P, Y, ye) : ee(Y, ye) : ge(P, Y, ye);
              }
              return H.all = function(P, Y) {
                if (!Array.isArray(P) || P.length < 2) throw new Error("first argument should be an array with at least two elements");
                return P.reduce(function(ye, Be) {
                  return H(ye, Be, Y);
                });
              }, H;
            });
          });
          function t(B) {
            return B = B || /* @__PURE__ */ Object.create(null), { on: function(R, J) {
              (B[R] || (B[R] = [])).push(J);
            }, off: function(R, J) {
              B[R] && B[R].splice(B[R].indexOf(J) >>> 0, 1);
            }, emit: function(R, J) {
              (B[R] || []).map(function(V) {
                V(J);
              }), (B["*"] || []).map(function(V) {
                V(R, J);
              });
            } };
          }
          var u = r(function(B, R) {
            var J = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            R.default = J, B.exports = R.default;
          }), s = function(B) {
            return Object.keys(B).map(function(R) {
              var J = B[R].toString().replace(/"/g, "&quot;");
              return R + '="' + J + '"';
            }).join(" ");
          }, i = u.svg, l = u.xlink, c = {};
          c[i.name] = i.uri, c[l.name] = l.uri;
          var f, g = function(B, R) {
            B === void 0 && (B = "");
            var J = o(c, R || {}), V = s(J);
            return "<svg " + V + ">" + B + "</svg>";
          }, p = u.svg, v = u.xlink, h = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[v.name] = v.uri, f) }, b = function(B) {
            this.config = o(h, B || {}), this.symbols = [];
          };
          b.prototype.add = function(B) {
            var R = this, J = R.symbols, V = this.find(B.id);
            return V ? (J[J.indexOf(V)] = B, !1) : (J.push(B), !0);
          }, b.prototype.remove = function(B) {
            var R = this, J = R.symbols, V = this.find(B);
            return !!V && (J.splice(J.indexOf(V), 1), V.destroy(), !0);
          }, b.prototype.find = function(B) {
            return this.symbols.filter(function(R) {
              return R.id === B;
            })[0] || null;
          }, b.prototype.has = function(B) {
            return this.find(B) !== null;
          }, b.prototype.stringify = function() {
            var B = this.config, R = B.attrs, J = this.symbols.map(function(V) {
              return V.stringify();
            }).join("");
            return g(J, R);
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            this.symbols.forEach(function(B) {
              return B.destroy();
            });
          };
          var y = function(B) {
            var R = B.id, J = B.viewBox, V = B.content;
            this.id = R, this.viewBox = J, this.content = V;
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
          var w = function(B) {
            var R = !!document.importNode, J = new DOMParser().parseFromString(B, "image/svg+xml").documentElement;
            return R ? document.importNode(J, !0) : J;
          }, E = function(B) {
            function R() {
              B.apply(this, arguments);
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var J = { isMounted: {} };
            return J.isMounted.get = function() {
              return !!this.node;
            }, R.createFromExistingNode = function(V) {
              return new R({ id: V.getAttribute("id"), viewBox: V.getAttribute("viewBox"), content: V.outerHTML });
            }, R.prototype.destroy = function() {
              this.isMounted && this.unmount(), B.prototype.destroy.call(this);
            }, R.prototype.mount = function(V) {
              if (this.isMounted) return this.node;
              var ee = typeof V == "string" ? document.querySelector(V) : V, ie = this.render();
              return this.node = ie, ee.appendChild(ie), ie;
            }, R.prototype.render = function() {
              var V = this.stringify();
              return w(g(V)).childNodes[0];
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(R.prototype, J), R;
          }(y), k = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, _ = function(B) {
            return Array.prototype.slice.call(B, 0);
          }, m = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, j = function(B, R) {
            var J = document.createEvent("CustomEvent");
            J.initCustomEvent(B, !1, !1, R), window.dispatchEvent(J);
          }, O = function(B) {
            var R = [];
            return _(B.querySelectorAll("style")).forEach(function(J) {
              J.textContent += "", R.push(J);
            }), R;
          }, T = function(B) {
            return (B || window.location.href).split("#")[0];
          }, S = function(B) {
            angular.module("ng").run(["$rootScope", function(R) {
              R.$on("$locationChangeSuccess", function(J, V, ee) {
                j(B, { oldUrl: ee, newUrl: V });
              });
            }]);
          }, U = "linearGradient, radialGradient, pattern, mask, clipPath", F = function(B, R) {
            return R === void 0 && (R = U), _(B.querySelectorAll("symbol")).forEach(function(J) {
              _(J.querySelectorAll(R)).forEach(function(V) {
                J.parentNode.insertBefore(V, J);
              });
            }), B;
          };
          function X(B, R) {
            var J = _(B).reduce(function(V, ee) {
              if (!ee.attributes) return V;
              var ie = _(ee.attributes), ge = R ? ie.filter(R) : ie;
              return V.concat(ge);
            }, []);
            return J;
          }
          var ae = u.xlink.uri, G = "xlink:href", W = /[{}|\\\^\[\]`"<>]/g;
          function D(B) {
            return B.replace(W, function(R) {
              return "%" + R[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function A(B) {
            return B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function L(B, R, J) {
            return _(B).forEach(function(V) {
              var ee = V.getAttribute(G);
              if (ee && ee.indexOf(R) === 0) {
                var ie = ee.replace(R, J);
                V.setAttributeNS(ae, G, ie);
              }
            }), B;
          }
          var Q, Z = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], M = Z.map(function(B) {
            return "[" + B + "]";
          }).join(","), we = function(B, R, J, V) {
            var ee = D(J), ie = D(V), ge = B.querySelectorAll(M), H = X(ge, function(P) {
              var Y = P.localName, ye = P.value;
              return Z.indexOf(Y) !== -1 && ye.indexOf("url(" + ee) !== -1;
            });
            H.forEach(function(P) {
              return P.value = P.value.replace(new RegExp(A(ee), "g"), ie);
            }), L(R, ee, ie);
          }, pe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ae = function(B) {
            function R(V) {
              var ee = this;
              V === void 0 && (V = {}), B.call(this, o(k, V));
              var ie = t();
              this._emitter = ie, this.node = null;
              var ge = this, H = ge.config;
              if (H.autoConfigure && this._autoConfigure(V), H.syncUrlsWithBaseTag) {
                var P = document.getElementsByTagName("base")[0].getAttribute("href");
                ie.on(pe.MOUNT, function() {
                  return ee.updateUrls("#", P);
                });
              }
              var Y = this._handleLocationChange.bind(this);
              this._handleLocationChange = Y, H.listenLocationChangeEvent && window.addEventListener(H.locationChangeEvent, Y), H.locationChangeAngularEmitter && S(H.locationChangeEvent), ie.on(pe.MOUNT, function(ye) {
                H.moveGradientsOutsideSymbol && F(ye);
              }), ie.on(pe.SYMBOL_MOUNT, function(ye) {
                H.moveGradientsOutsideSymbol && F(ye.parentNode), (m.isIE() || m.isEdge()) && O(ye);
              });
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var J = { isMounted: {} };
            return J.isMounted.get = function() {
              return !!this.node;
            }, R.prototype._autoConfigure = function(V) {
              var ee = this, ie = ee.config;
              typeof V.syncUrlsWithBaseTag > "u" && (ie.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof V.locationChangeAngularEmitter > "u" && (ie.locationChangeAngularEmitter = typeof window.angular < "u"), typeof V.moveGradientsOutsideSymbol > "u" && (ie.moveGradientsOutsideSymbol = m.isFirefox());
            }, R.prototype._handleLocationChange = function(V) {
              var ee = V.detail, ie = ee.oldUrl, ge = ee.newUrl;
              this.updateUrls(ie, ge);
            }, R.prototype.add = function(V) {
              var ee = this, ie = B.prototype.add.call(this, V);
              return this.isMounted && ie && (V.mount(ee.node), this._emitter.emit(pe.SYMBOL_MOUNT, V.node)), ie;
            }, R.prototype.attach = function(V) {
              var ee = this, ie = this;
              if (ie.isMounted) return ie.node;
              var ge = typeof V == "string" ? document.querySelector(V) : V;
              return ie.node = ge, this.symbols.forEach(function(H) {
                H.mount(ie.node), ee._emitter.emit(pe.SYMBOL_MOUNT, H.node);
              }), _(ge.querySelectorAll("symbol")).forEach(function(H) {
                var P = E.createFromExistingNode(H);
                P.node = H, ie.add(P);
              }), this._emitter.emit(pe.MOUNT, ge), ge;
            }, R.prototype.destroy = function() {
              var V = this, ee = V.config, ie = V.symbols, ge = V._emitter;
              ie.forEach(function(H) {
                return H.destroy();
              }), ge.off("*"), window.removeEventListener(ee.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, R.prototype.mount = function(V, ee) {
              V === void 0 && (V = this.config.mountTo), ee === void 0 && (ee = !1);
              var ie = this;
              if (ie.isMounted) return ie.node;
              var ge = typeof V == "string" ? document.querySelector(V) : V, H = ie.render();
              return this.node = H, ee && ge.childNodes[0] ? ge.insertBefore(H, ge.childNodes[0]) : ge.appendChild(H), this._emitter.emit(pe.MOUNT, H), H;
            }, R.prototype.render = function() {
              return w(this.stringify());
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, R.prototype.updateUrls = function(V, ee) {
              if (!this.isMounted) return !1;
              var ie = document.querySelectorAll(this.config.usagesToUpdate);
              return we(this.node, ie, T(V) + "#", T(ee) + "#"), !0;
            }, Object.defineProperties(R.prototype, J), R;
          }(b), Ne = r(function(B) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(R, J) {
              B.exports = J();
            })(0, function() {
              var R, J = [], V = document, ee = V.documentElement.doScroll, ie = "DOMContentLoaded", ge = (ee ? /^loaded|^c/ : /^loaded|^i|^c/).test(V.readyState);
              return ge || V.addEventListener(ie, R = function() {
                for (V.removeEventListener(ie, R), ge = 1; R = J.shift(); ) R();
              }), function(H) {
                ge ? setTimeout(H, 0) : J.push(H);
              };
            });
          }), Ee = "__SVG_SPRITE_NODE__", Oe = "__SVG_SPRITE__", Se = !!window[Oe];
          Se ? Q = window[Oe] : (Q = new Ae({ attrs: { id: Ee, "aria-hidden": "true" } }), window[Oe] = Q);
          var Ve = function() {
            var B = document.getElementById(Ee);
            B ? Q.attach(B) : Q.mount(document.body, !0);
          };
          document.body ? Ve() : Ne(Ve);
          var He = Q;
          return He;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(a, d, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), s = e("2a62"), i = function(l, c) {
        this.stopped = l, this.result = c;
      };
      a.exports = function(l, c, f) {
        var g, p, v, h, b, y, w, E = f && f.that, k = !(!f || !f.AS_ENTRIES), _ = !(!f || !f.IS_ITERATOR), m = !(!f || !f.INTERRUPTED), j = t(c, E, 1 + k + m), O = function(S) {
          return g && s(g), new i(!0, S);
        }, T = function(S) {
          return k ? (n(S), m ? j(S[0], S[1], O) : j(S[0], S[1])) : m ? j(S, O) : j(S);
        };
        if (_) g = l;
        else {
          if (p = u(l), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, h = o(l.length); h > v; v++) if (b = T(l[v]), b && b instanceof i) return b;
            return new i(!1);
          }
          g = p.call(l);
        }
        for (y = g.next; !(w = y.call(g)).done; ) {
          try {
            b = T(w.value);
          } catch (S) {
            throw s(g), S;
          }
          if (typeof b == "object" && b && b instanceof i) return b;
        }
        return new i(!1);
      };
    }, "23cb": function(a, d, e) {
      var n = e("a691"), r = Math.max, o = Math.min;
      a.exports = function(t, u) {
        var s = n(t);
        return s < 0 ? r(s + u, 0) : o(s, u);
      };
    }, "23e7": function(a, d, e) {
      var n = e("da84"), r = e("06cf").f, o = e("9112"), t = e("6eeb"), u = e("ce4e"), s = e("e893"), i = e("94ca");
      a.exports = function(l, c) {
        var f, g, p, v, h, b, y = l.target, w = l.global, E = l.stat;
        if (g = w ? n : E ? n[y] || u(y, {}) : (n[y] || {}).prototype, g) for (p in c) {
          if (h = c[p], l.noTargetGet ? (b = r(g, p), v = b && b.value) : v = g[p], f = i(w ? p : y + (E ? "." : "#") + p, l.forced), !f && v !== void 0) {
            if (typeof h == typeof v) continue;
            s(h, v);
          }
          (l.sham || v && v.sham) && o(h, "sham", !0), t(g, p, h, l);
        }
      };
    }, "241c": function(a, d, e) {
      var n = e("ca84"), r = e("7839"), o = r.concat("length", "prototype");
      d.f = Object.getOwnPropertyNames || function(t) {
        return n(t, o);
      };
    }, 2444: function(a, d, e) {
      (function(n) {
        var r = e("c532"), o = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function u(l, c) {
          !r.isUndefined(l) && r.isUndefined(l["Content-Type"]) && (l["Content-Type"] = c);
        }
        function s() {
          var l;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (l = e("b50d")), l;
        }
        var i = { adapter: s(), transformRequest: [function(l, c) {
          return o(c, "Accept"), o(c, "Content-Type"), r.isFormData(l) || r.isArrayBuffer(l) || r.isBuffer(l) || r.isStream(l) || r.isFile(l) || r.isBlob(l) ? l : r.isArrayBufferView(l) ? l.buffer : r.isURLSearchParams(l) ? (u(c, "application/x-www-form-urlencoded;charset=utf-8"), l.toString()) : r.isObject(l) ? (u(c, "application/json;charset=utf-8"), JSON.stringify(l)) : l;
        }], transformResponse: [function(l) {
          if (typeof l == "string") try {
            l = JSON.parse(l);
          } catch {
          }
          return l;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(l) {
          return l >= 200 && l < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        r.forEach(["delete", "get", "head"], function(l) {
          i.headers[l] = {};
        }), r.forEach(["post", "put", "patch"], function(l) {
          i.headers[l] = r.merge(t);
        }), a.exports = i;
      }).call(this, e("4362"));
    }, 2532: function(a, d, e) {
      var n = e("23e7"), r = e("5a34"), o = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(u) {
        return !!~String(o(this)).indexOf(r(u), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(a, d, e) {
      var n = e("6eeb"), r = e("825a"), o = e("d039"), t = e("ad6d"), u = "toString", s = RegExp.prototype, i = s[u], l = o(function() {
        return i.call({ source: "a", flags: "b" }) != "/a/b";
      }), c = i.name != u;
      (l || c) && n(RegExp.prototype, u, function() {
        var f = r(this), g = String(f.source), p = f.flags, v = String(p === void 0 && f instanceof RegExp && !("flags" in s) ? t.call(f) : p);
        return "/" + g + "/" + v;
      }, { unsafe: !0 });
    }, 2626: function(a, d, e) {
      var n = e("d066"), r = e("9bf2"), o = e("b622"), t = e("83ab"), u = o("species");
      a.exports = function(s) {
        var i = n(s), l = r.f;
        t && i && !i[u] && l(i, u, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(a, d, e) {
      var n = e("825a");
      a.exports = function(r) {
        var o = r.return;
        if (o !== void 0) return n(o.call(r)).value;
      };
    }, "2cf4": function(a, d, e) {
      var n, r, o, t = e("da84"), u = e("d039"), s = e("0366"), i = e("1be4"), l = e("cc12"), c = e("1cdc"), f = e("605d"), g = t.location, p = t.setImmediate, v = t.clearImmediate, h = t.process, b = t.MessageChannel, y = t.Dispatch, w = 0, E = {}, k = "onreadystatechange", _ = function(T) {
        if (E.hasOwnProperty(T)) {
          var S = E[T];
          delete E[T], S();
        }
      }, m = function(T) {
        return function() {
          _(T);
        };
      }, j = function(T) {
        _(T.data);
      }, O = function(T) {
        t.postMessage(T + "", g.protocol + "//" + g.host);
      };
      p && v || (p = function(T) {
        for (var S = [], U = 1; arguments.length > U; ) S.push(arguments[U++]);
        return E[++w] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, S);
        }, n(w), w;
      }, v = function(T) {
        delete E[T];
      }, f ? n = function(T) {
        h.nextTick(m(T));
      } : y && y.now ? n = function(T) {
        y.now(m(T));
      } : b && !c ? (r = new b(), o = r.port2, r.port1.onmessage = j, n = s(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && g && g.protocol !== "file:" && !u(O) ? (n = O, t.addEventListener("message", j, !1)) : n = k in l("script") ? function(T) {
        i.appendChild(l("script"))[k] = function() {
          i.removeChild(this), _(T);
        };
      } : function(T) {
        setTimeout(m(T), 0);
      }), a.exports = { set: p, clear: v };
    }, "2d00": function(a, d, e) {
      var n, r, o = e("da84"), t = e("342f"), u = o.process, s = u && u.versions, i = s && s.v8;
      i ? (n = i.split("."), r = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (r = n[1]))), a.exports = r && +r;
    }, "2d83": function(a, d, e) {
      var n = e("387f");
      a.exports = function(r, o, t, u, s) {
        var i = new Error(r);
        return n(i, o, t, u, s);
      };
    }, "2e67": function(a, d, e) {
      a.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(a, d, e) {
      var n = e("c532");
      function r(o) {
        return encodeURIComponent(o).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      a.exports = function(o, t, u) {
        if (!t) return o;
        var s;
        if (u) s = u(t);
        else if (n.isURLSearchParams(t)) s = t.toString();
        else {
          var i = [];
          n.forEach(t, function(c, f) {
            c !== null && typeof c < "u" && (n.isArray(c) ? f += "[]" : c = [c], n.forEach(c, function(g) {
              n.isDate(g) ? g = g.toISOString() : n.isObject(g) && (g = JSON.stringify(g)), i.push(r(f) + "=" + r(g));
            }));
          }), s = i.join("&");
        }
        if (s) {
          var l = o.indexOf("#");
          l !== -1 && (o = o.slice(0, l)), o += (o.indexOf("?") === -1 ? "?" : "&") + s;
        }
        return o;
      };
    }, "342f": function(a, d, e) {
      var n = e("d066");
      a.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(a, d, e) {
      var n = e("f5df"), r = e("3f8c"), o = e("b622"), t = o("iterator");
      a.exports = function(u) {
        if (u != null) return u[t] || u["@@iterator"] || r[n(u)];
      };
    }, "37e8": function(a, d, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("825a"), t = e("df75");
      a.exports = n ? Object.defineProperties : function(u, s) {
        o(u);
        for (var i, l = t(s), c = l.length, f = 0; c > f; ) r.f(u, i = l[f++], s[i]);
        return u;
      };
    }, "387f": function(a, d, e) {
      a.exports = function(n, r, o, t, u) {
        return n.config = r, o && (n.code = o), n.request = t, n.response = u, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(a, d, e) {
      e("acce");
    }, 3934: function(a, d, e) {
      var n = e("c532");
      a.exports = n.isStandardBrowserEnv() ? function() {
        var r, o = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function u(s) {
          var i = s;
          return o && (t.setAttribute("href", i), i = t.href), t.setAttribute("href", i), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return r = u(window.location.href), function(s) {
          var i = n.isString(s) ? u(s) : s;
          return i.protocol === r.protocol && i.host === r.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(a, d, e) {
      var n = e("861d");
      a.exports = function(r) {
        if (!n(r) && r !== null) throw TypeError("Can't set " + String(r) + " as a prototype");
        return r;
      };
    }, "3ca3": function(a, d, e) {
      var n = e("6547").charAt, r = e("69f3"), o = e("7dd0"), t = "String Iterator", u = r.set, s = r.getterFor(t);
      o(String, "String", function(i) {
        u(this, { type: t, string: String(i), index: 0 });
      }, function() {
        var i, l = s(this), c = l.string, f = l.index;
        return f >= c.length ? { value: void 0, done: !0 } : (i = n(c, f), l.index += i.length, { value: i, done: !1 });
      });
    }, "3f8c": function(a, d) {
      a.exports = {};
    }, "408a": function(a, d, e) {
      var n = e("c6b6");
      a.exports = function(r) {
        if (typeof r != "number" && n(r) != "Number") throw TypeError("Incorrect invocation");
        return +r;
      };
    }, "428f": function(a, d, e) {
      var n = e("da84");
      a.exports = n;
    }, 4362: function(a, d, e) {
      d.nextTick = function(n) {
        var r = Array.prototype.slice.call(arguments);
        r.shift(), setTimeout(function() {
          n.apply(null, r);
        }, 0);
      }, d.platform = d.arch = d.execPath = d.title = "browser", d.pid = 1, d.browser = !0, d.env = {}, d.argv = [], d.binding = function(n) {
        throw new Error("No such module. (Possibly not yet loaded)");
      }, function() {
        var n, r = "/";
        d.cwd = function() {
          return r;
        }, d.chdir = function(o) {
          n || (n = e("df7c")), r = n.resolve(o, r);
        };
      }(), d.exit = d.kill = d.umask = d.dlopen = d.uptime = d.memoryUsage = d.uvCounters = function() {
      }, d.features = {};
    }, "44ad": function(a, d, e) {
      var n = e("d039"), r = e("c6b6"), o = "".split;
      a.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return r(t) == "String" ? o.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(a, d, e) {
      var n = e("b622"), r = e("7c73"), o = e("9bf2"), t = n("unscopables"), u = Array.prototype;
      u[t] == null && o.f(u, t, { configurable: !0, value: r(null) }), a.exports = function(s) {
        u[t][s] = !0;
      };
    }, "44de": function(a, d, e) {
      var n = e("da84");
      a.exports = function(r, o) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(r) : t.error(r, o));
      };
    }, "44e7": function(a, d, e) {
      var n = e("861d"), r = e("c6b6"), o = e("b622"), t = o("match");
      a.exports = function(u) {
        var s;
        return n(u) && ((s = u[t]) !== void 0 ? !!s : r(u) == "RegExp");
      };
    }, "466d": function(a, d, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("1d80"), u = e("8aa5"), s = e("14c3");
      n("match", 1, function(i, l, c) {
        return [function(f) {
          var g = t(this), p = f == null ? void 0 : f[i];
          return p !== void 0 ? p.call(f, g) : new RegExp(f)[i](String(g));
        }, function(f) {
          var g = c(l, f, this);
          if (g.done) return g.value;
          var p = r(f), v = String(this);
          if (!p.global) return s(p, v);
          var h = p.unicode;
          p.lastIndex = 0;
          for (var b, y = [], w = 0; (b = s(p, v)) !== null; ) {
            var E = String(b[0]);
            y[w] = E, E === "" && (p.lastIndex = u(v, o(p.lastIndex), h)), w++;
          }
          return w === 0 ? null : y;
        }];
      });
    }, "467f": function(a, d, e) {
      var n = e("2d83");
      a.exports = function(r, o, t) {
        var u = t.config.validateStatus;
        t.status && u && !u(t.status) ? o(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : r(t);
      };
    }, 4840: function(a, d, e) {
      var n = e("825a"), r = e("1c0b"), o = e("b622"), t = o("species");
      a.exports = function(u, s) {
        var i, l = n(u).constructor;
        return l === void 0 || (i = n(l)[t]) == null ? s : r(i);
      };
    }, 4930: function(a, d, e) {
      var n = e("605d"), r = e("2d00"), o = e("d039");
      a.exports = !!Object.getOwnPropertySymbols && !o(function() {
        return !Symbol.sham && (n ? r === 38 : r > 37 && r < 41);
      });
    }, "4a7b": function(a, d, e) {
      var n = e("c532");
      a.exports = function(r, o) {
        o = o || {};
        var t = {}, u = ["url", "method", "data"], s = ["headers", "auth", "proxy", "params"], i = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], l = ["validateStatus"];
        function c(v, h) {
          return n.isPlainObject(v) && n.isPlainObject(h) ? n.merge(v, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function f(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = c(void 0, r[v])) : t[v] = c(r[v], o[v]);
        }
        n.forEach(u, function(v) {
          n.isUndefined(o[v]) || (t[v] = c(void 0, o[v]));
        }), n.forEach(s, f), n.forEach(i, function(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = c(void 0, r[v])) : t[v] = c(void 0, o[v]);
        }), n.forEach(l, function(v) {
          v in o ? t[v] = c(r[v], o[v]) : v in r && (t[v] = c(void 0, r[v]));
        });
        var g = u.concat(s).concat(i).concat(l), p = Object.keys(r).concat(Object.keys(o)).filter(function(v) {
          return g.indexOf(v) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(a, d, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, s = e("241c").f, i = e("44e7"), l = e("ad6d"), c = e("9f7f"), f = e("6eeb"), g = e("d039"), p = e("69f3").set, v = e("2626"), h = e("b622"), b = h("match"), y = r.RegExp, w = y.prototype, E = /a/g, k = /a/g, _ = new y(E) !== E, m = c.UNSUPPORTED_Y, j = n && o("RegExp", !_ || m || g(function() {
        return k[b] = !1, y(E) != E || y(k) == k || y(E, "i") != "/a/i";
      }));
      if (j) {
        for (var O = function(F, X) {
          var ae, G = this instanceof O, W = i(F), D = X === void 0;
          if (!G && W && F.constructor === O && D) return F;
          _ ? W && !D && (F = F.source) : F instanceof O && (D && (X = l.call(F)), F = F.source), m && (ae = !!X && X.indexOf("y") > -1, ae && (X = X.replace(/y/g, "")));
          var A = t(_ ? new y(F, X) : y(F, X), G ? this : w, O);
          return m && ae && p(A, { sticky: ae }), A;
        }, T = function(F) {
          F in O || u(O, F, { configurable: !0, get: function() {
            return y[F];
          }, set: function(X) {
            y[F] = X;
          } });
        }, S = s(y), U = 0; S.length > U; ) T(S[U++]);
        w.constructor = O, O.prototype = w, f(r, "RegExp", O);
      }
      v("RegExp");
    }, "4d64": function(a, d, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(s, i, l) {
          var c, f = n(s), g = r(f.length), p = o(l, g);
          if (u && i != i) {
            for (; g > p; ) if (c = f[p++], c != c) return !0;
          } else for (; g > p; p++) if ((u || p in f) && f[p] === i) return u || p || 0;
          return !u && -1;
        };
      };
      a.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(a, d, e) {
      var n = e("23e7"), r = e("b727").filter, o = e("1dde"), t = o("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(a, d, e) {
      var n = e("0366"), r = e("7b0b"), o = e("9bdd"), t = e("e95a"), u = e("50c4"), s = e("8418"), i = e("35a1");
      a.exports = function(l) {
        var c, f, g, p, v, h, b = r(l), y = typeof this == "function" ? this : Array, w = arguments.length, E = w > 1 ? arguments[1] : void 0, k = E !== void 0, _ = i(b), m = 0;
        if (k && (E = n(E, w > 2 ? arguments[2] : void 0, 2)), _ == null || y == Array && t(_)) for (c = u(b.length), f = new y(c); c > m; m++) h = k ? E(b[m], m) : b[m], s(f, m, h);
        else for (p = _.call(b), v = p.next, f = new y(); !(g = v.call(p)).done; m++) h = k ? o(p, E, [g.value, m], !0) : g.value, s(f, m, h);
        return f.length = m, f;
      };
    }, "4f43": function(a, d, e) {
      e.r(d);
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
      t.a.add(u), d.default = u;
    }, "50c4": function(a, d, e) {
      var n = e("a691"), r = Math.min;
      a.exports = function(o) {
        return o > 0 ? r(n(o), 9007199254740991) : 0;
      };
    }, 5135: function(a, d) {
      var e = {}.hasOwnProperty;
      a.exports = function(n, r) {
        return e.call(n, r);
      };
    }, 5270: function(a, d, e) {
      var n = e("c532"), r = e("c401"), o = e("2e67"), t = e("2444");
      function u(s) {
        s.cancelToken && s.cancelToken.throwIfRequested();
      }
      a.exports = function(s) {
        u(s), s.headers = s.headers || {}, s.data = r(s.data, s.headers, s.transformRequest), s.headers = n.merge(s.headers.common || {}, s.headers[s.method] || {}, s.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(l) {
          delete s.headers[l];
        });
        var i = s.adapter || t.adapter;
        return i(s).then(function(l) {
          return u(s), l.data = r(l.data, l.headers, s.transformResponse), l;
        }, function(l) {
          return o(l) || (u(s), l && l.response && (l.response.data = r(l.response.data, l.response.headers, s.transformResponse))), Promise.reject(l);
        });
      };
    }, 5319: function(a, d, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), s = e("8aa5"), i = e("0cb2"), l = e("14c3"), c = Math.max, f = Math.min, g = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, v, h, b) {
        var y = b.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, w = b.REPLACE_KEEPS_$0, E = y ? "$" : "$0";
        return [function(k, _) {
          var m = u(this), j = k == null ? void 0 : k[p];
          return j !== void 0 ? j.call(k, m, _) : v.call(String(m), k, _);
        }, function(k, _) {
          if (!y && w || typeof _ == "string" && _.indexOf(E) === -1) {
            var m = h(v, k, this, _);
            if (m.done) return m.value;
          }
          var j = r(k), O = String(this), T = typeof _ == "function";
          T || (_ = String(_));
          var S = j.global;
          if (S) {
            var U = j.unicode;
            j.lastIndex = 0;
          }
          for (var F = []; ; ) {
            var X = l(j, O);
            if (X === null || (F.push(X), !S)) break;
            var ae = String(X[0]);
            ae === "" && (j.lastIndex = s(O, o(j.lastIndex), U));
          }
          for (var G = "", W = 0, D = 0; D < F.length; D++) {
            X = F[D];
            for (var A = String(X[0]), L = c(f(t(X.index), O.length), 0), Q = [], Z = 1; Z < X.length; Z++) Q.push(g(X[Z]));
            var M = X.groups;
            if (T) {
              var we = [A].concat(Q, L, O);
              M !== void 0 && we.push(M);
              var pe = String(_.apply(void 0, we));
            } else pe = i(A, O, L, Q, M, _);
            L >= W && (G += O.slice(W, L) + pe, W = L + A.length);
          }
          return G + O.slice(W);
        }];
      });
    }, "545a": function(a, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), d.default = u;
    }, 5530: function(a, d, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, r) {
        var o = n.document, t = o.documentElement, u = o.querySelector('meta[name="viewport"]'), s = o.querySelector('meta[name="flexible"]'), i = 0, l = 0, c = r.flexible || (r.flexible = {});
        if (u) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = u.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (l = parseFloat(f[1]), i = parseInt(1 / l));
        } else if (s) {
          var g = s.getAttribute("content");
          if (g) {
            var p = g.match(/initial\-dpr=([\d\.]+)/), v = g.match(/maximum\-dpr=([\d\.]+)/);
            p && (i = parseFloat(p[1]), l = parseFloat((1 / i).toFixed(2))), v && (i = parseFloat(v[1]), l = parseFloat((1 / i).toFixed(2)));
          }
        }
        if (!i && !l) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), b = n.devicePixelRatio;
          i = h ? b >= 3 && (!i || i >= 3) ? 3 : b >= 2 && (!i || i >= 2) ? 2 : 1 : 1, l = 1 / i;
        }
        if (t.setAttribute("data-dpr", i), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + l + ", maximum-scale=" + l + ", minimum-scale=" + l + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var y = o.createElement("div");
          y.appendChild(u), o.write(y.innerHTML);
        }
        function w() {
          var E = t.getBoundingClientRect().width, k = E / 10;
          t.style.fontSize = k + "px", c.rem = n.rem = k;
        }
        n.addEventListener("resize", function() {
          w();
        }, !1), n.addEventListener("pageshow", function(E) {
          E.persisted && w();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * i + "px" : o.addEventListener("DOMContentLoaded", function(E) {
          o.body.style.fontSize = 10 * i + "px";
        }, !1), w(), c.dpr = n.dpr = i, c.refreshRem = w, c.rem2px = function(E) {
          var k = parseFloat(E) * this.rem;
          return typeof E == "string" && E.match(/rem$/) && (k += "px"), k;
        }, c.px2rem = function(E) {
          var k = parseFloat(E) / this.rem;
          return typeof E == "string" && E.match(/px$/) && (k += "rem"), k;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(a, d, e) {
      var n = e("c430"), r = e("c6cd");
      (a.exports = function(o, t) {
        return r[o] || (r[o] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(a, d, e) {
      var n = e("d066"), r = e("241c"), o = e("7418"), t = e("825a");
      a.exports = n("Reflect", "ownKeys") || function(u) {
        var s = r.f(t(u)), i = o.f;
        return i ? s.concat(i(u)) : s;
      };
    }, "5a34": function(a, d, e) {
      var n = e("44e7");
      a.exports = function(r) {
        if (n(r)) throw TypeError("The method doesn't accept regular expressions");
        return r;
      };
    }, "5c6c": function(a, d) {
      a.exports = function(e, n) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n };
      };
    }, "5f02": function(a, d, e) {
      a.exports = function(n) {
        return typeof n == "object" && n.isAxiosError === !0;
      };
    }, "605d": function(a, d, e) {
      var n = e("c6b6"), r = e("da84");
      a.exports = n(r.process) == "process";
    }, 6062: function(a, d, e) {
      var n = e("6d61"), r = e("6566");
      a.exports = n("Set", function(o) {
        return function() {
          return o(this, arguments.length ? arguments[0] : void 0);
        };
      }, r);
    }, 6547: function(a, d, e) {
      var n = e("a691"), r = e("1d80"), o = function(t) {
        return function(u, s) {
          var i, l, c = String(r(u)), f = n(s), g = c.length;
          return f < 0 || f >= g ? t ? "" : void 0 : (i = c.charCodeAt(f), i < 55296 || i > 56319 || f + 1 === g || (l = c.charCodeAt(f + 1)) < 56320 || l > 57343 ? t ? c.charAt(f) : i : t ? c.slice(f, f + 2) : l - 56320 + (i - 55296 << 10) + 65536);
        };
      };
      a.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(a, d, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), s = e("2266"), i = e("7dd0"), l = e("2626"), c = e("83ab"), f = e("f183").fastKey, g = e("69f3"), p = g.set, v = g.getterFor;
      a.exports = { getConstructor: function(h, b, y, w) {
        var E = h(function(j, O) {
          u(j, E, b), p(j, { type: b, index: r(null), first: void 0, last: void 0, size: 0 }), c || (j.size = 0), O != null && s(O, j[w], { that: j, AS_ENTRIES: y });
        }), k = v(b), _ = function(j, O, T) {
          var S, U, F = k(j), X = m(j, O);
          return X ? X.value = T : (F.last = X = { index: U = f(O, !0), key: O, value: T, previous: S = F.last, next: void 0, removed: !1 }, F.first || (F.first = X), S && (S.next = X), c ? F.size++ : j.size++, U !== "F" && (F.index[U] = X)), j;
        }, m = function(j, O) {
          var T, S = k(j), U = f(O);
          if (U !== "F") return S.index[U];
          for (T = S.first; T; T = T.next) if (T.key == O) return T;
        };
        return o(E.prototype, { clear: function() {
          for (var j = this, O = k(j), T = O.index, S = O.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete T[S.index], S = S.next;
          O.first = O.last = void 0, c ? O.size = 0 : j.size = 0;
        }, delete: function(j) {
          var O = this, T = k(O), S = m(O, j);
          if (S) {
            var U = S.next, F = S.previous;
            delete T.index[S.index], S.removed = !0, F && (F.next = U), U && (U.previous = F), T.first == S && (T.first = U), T.last == S && (T.last = F), c ? T.size-- : O.size--;
          }
          return !!S;
        }, forEach: function(j) {
          for (var O, T = k(this), S = t(j, arguments.length > 1 ? arguments[1] : void 0, 3); O = O ? O.next : T.first; )
            for (S(O.value, O.key, this); O && O.removed; ) O = O.previous;
        }, has: function(j) {
          return !!m(this, j);
        } }), o(E.prototype, y ? { get: function(j) {
          var O = m(this, j);
          return O && O.value;
        }, set: function(j, O) {
          return _(this, j === 0 ? 0 : j, O);
        } } : { add: function(j) {
          return _(this, j = j === 0 ? 0 : j, j);
        } }), c && n(E.prototype, "size", { get: function() {
          return k(this).size;
        } }), E;
      }, setStrong: function(h, b, y) {
        var w = b + " Iterator", E = v(b), k = v(w);
        i(h, b, function(_, m) {
          p(this, { type: w, target: _, state: E(_), kind: m, last: void 0 });
        }, function() {
          for (var _ = k(this), m = _.kind, j = _.last; j && j.removed; ) j = j.previous;
          return _.target && (_.last = j = j ? j.next : _.state.first) ? m == "keys" ? { value: j.key, done: !1 } : m == "values" ? { value: j.value, done: !1 } : { value: [j.key, j.value], done: !1 } : (_.target = void 0, { value: void 0, done: !0 });
        }, y ? "entries" : "values", !y, !0), l(b);
      } };
    }, "65f0": function(a, d, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      a.exports = function(u, s) {
        var i;
        return r(u) && (i = u.constructor, typeof i != "function" || i !== Array && !r(i.prototype) ? n(i) && (i = i[t], i === null && (i = void 0)) : i = void 0), new (i === void 0 ? Array : i)(s === 0 ? 0 : s);
      };
    }, "69f3": function(a, d, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), s = e("861d"), i = e("9112"), l = e("5135"), c = e("c6cd"), f = e("f772"), g = e("d012"), p = u.WeakMap, v = function(_) {
        return o(_) ? r(_) : n(_, {});
      }, h = function(_) {
        return function(m) {
          var j;
          if (!s(m) || (j = r(m)).type !== _) throw TypeError("Incompatible receiver, " + _ + " required");
          return j;
        };
      };
      if (t) {
        var b = c.state || (c.state = new p()), y = b.get, w = b.has, E = b.set;
        n = function(_, m) {
          return m.facade = _, E.call(b, _, m), m;
        }, r = function(_) {
          return y.call(b, _) || {};
        }, o = function(_) {
          return w.call(b, _);
        };
      } else {
        var k = f("state");
        g[k] = !0, n = function(_, m) {
          return m.facade = _, i(_, k, m), m;
        }, r = function(_) {
          return l(_, k) ? _[k] : {};
        }, o = function(_) {
          return l(_, k);
        };
      }
      a.exports = { set: n, get: r, has: o, enforce: v, getterFor: h };
    }, "6d55": function(a, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), d.default = u;
    }, "6d61": function(a, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), s = e("2266"), i = e("19aa"), l = e("861d"), c = e("d039"), f = e("1c7e"), g = e("d44e"), p = e("7156");
      a.exports = function(v, h, b) {
        var y = v.indexOf("Map") !== -1, w = v.indexOf("Weak") !== -1, E = y ? "set" : "add", k = r[v], _ = k && k.prototype, m = k, j = {}, O = function(G) {
          var W = _[G];
          t(_, G, G == "add" ? function(D) {
            return W.call(this, D === 0 ? 0 : D), this;
          } : G == "delete" ? function(D) {
            return !(w && !l(D)) && W.call(this, D === 0 ? 0 : D);
          } : G == "get" ? function(D) {
            return w && !l(D) ? void 0 : W.call(this, D === 0 ? 0 : D);
          } : G == "has" ? function(D) {
            return !(w && !l(D)) && W.call(this, D === 0 ? 0 : D);
          } : function(D, A) {
            return W.call(this, D === 0 ? 0 : D, A), this;
          });
        }, T = o(v, typeof k != "function" || !(w || _.forEach && !c(function() {
          new k().entries().next();
        })));
        if (T) m = b.getConstructor(h, v, y, E), u.REQUIRED = !0;
        else if (o(v, !0)) {
          var S = new m(), U = S[E](w ? {} : -0, 1) != S, F = c(function() {
            S.has(1);
          }), X = f(function(G) {
            new k(G);
          }), ae = !w && c(function() {
            for (var G = new k(), W = 5; W--; ) G[E](W, W);
            return !G.has(-0);
          });
          X || (m = h(function(G, W) {
            i(G, m, v);
            var D = p(new k(), G, m);
            return W != null && s(W, D[E], { that: D, AS_ENTRIES: y }), D;
          }), m.prototype = _, _.constructor = m), (F || ae) && (O("delete"), O("has"), y && O("get")), (ae || U) && O(E), w && _.clear && delete _.clear;
        }
        return j[v] = m, n({ global: !0, forced: m != k }, j), g(m, v), w || b.setStrong(m, v, y), m;
      };
    }, "6eeb": function(a, d, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), s = e("69f3"), i = s.get, l = s.enforce, c = String(String).split("String");
      (a.exports = function(f, g, p, v) {
        var h, b = !!v && !!v.unsafe, y = !!v && !!v.enumerable, w = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof g != "string" || o(p, "name") || r(p, "name", g), h = l(p), h.source || (h.source = c.join(typeof g == "string" ? g : ""))), f !== n ? (b ? !w && f[g] && (y = !0) : delete f[g], y ? f[g] = p : r(f, g, p)) : y ? f[g] = p : t(g, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && i(this).source || u(this);
      });
    }, "70d3": function(a, d, e) {
    }, 7156: function(a, d, e) {
      var n = e("861d"), r = e("d2bb");
      a.exports = function(o, t, u) {
        var s, i;
        return r && typeof (s = t.constructor) == "function" && s !== u && n(i = s.prototype) && i !== u.prototype && r(o, i), o;
      };
    }, 7305: function(a, d, e) {
    }, 7320: function(a, d, e) {
    }, 7418: function(a, d) {
      d.f = Object.getOwnPropertySymbols;
    }, "746f": function(a, d, e) {
      var n = e("428f"), r = e("5135"), o = e("e538"), t = e("9bf2").f;
      a.exports = function(u) {
        var s = n.Symbol || (n.Symbol = {});
        r(s, u) || t(s, u, { value: o.f(u) });
      };
    }, 7839: function(a, d) {
      a.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(a, d, e) {
      function n(r) {
        this.message = r;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, a.exports = n;
    }, "7aac": function(a, d, e) {
      var n = e("c532");
      a.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(r, o, t, u, s, i) {
          var l = [];
          l.push(r + "=" + encodeURIComponent(o)), n.isNumber(t) && l.push("expires=" + new Date(t).toGMTString()), n.isString(u) && l.push("path=" + u), n.isString(s) && l.push("domain=" + s), i === !0 && l.push("secure"), document.cookie = l.join("; ");
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
    }, "7b0b": function(a, d, e) {
      var n = e("1d80");
      a.exports = function(r) {
        return Object(n(r));
      };
    }, "7c73": function(a, d, e) {
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), s = e("1be4"), i = e("cc12"), l = e("f772"), c = ">", f = "<", g = "prototype", p = "script", v = l("IE_PROTO"), h = function() {
      }, b = function(k) {
        return f + p + c + k + f + "/" + p + c;
      }, y = function(k) {
        k.write(b("")), k.close();
        var _ = k.parentWindow.Object;
        return k = null, _;
      }, w = function() {
        var k, _ = i("iframe"), m = "java" + p + ":";
        return _.style.display = "none", s.appendChild(_), _.src = String(m), k = _.contentWindow.document, k.open(), k.write(b("document.F=Object")), k.close(), k.F;
      }, E = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        E = n ? y(n) : w();
        for (var k = t.length; k--; ) delete E[g][t[k]];
        return E();
      };
      u[v] = !0, a.exports = Object.create || function(k, _) {
        var m;
        return k !== null ? (h[g] = r(k), m = new h(), h[g] = null, m[v] = k) : m = E(), _ === void 0 ? m : o(m, _);
      };
    }, "7db0": function(a, d, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(s) {
        return r(this, s, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(a, d, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), s = e("9112"), i = e("6eeb"), l = e("b622"), c = e("c430"), f = e("3f8c"), g = e("ae93"), p = g.IteratorPrototype, v = g.BUGGY_SAFARI_ITERATORS, h = l("iterator"), b = "keys", y = "values", w = "entries", E = function() {
        return this;
      };
      a.exports = function(k, _, m, j, O, T, S) {
        r(m, _, j);
        var U, F, X, ae = function(Z) {
          if (Z === O && L) return L;
          if (!v && Z in D) return D[Z];
          switch (Z) {
            case b:
              return function() {
                return new m(this, Z);
              };
            case y:
              return function() {
                return new m(this, Z);
              };
            case w:
              return function() {
                return new m(this, Z);
              };
          }
          return function() {
            return new m(this);
          };
        }, G = _ + " Iterator", W = !1, D = k.prototype, A = D[h] || D["@@iterator"] || O && D[O], L = !v && A || ae(O), Q = _ == "Array" && D.entries || A;
        if (Q && (U = o(Q.call(new k())), p !== Object.prototype && U.next && (c || o(U) === p || (t ? t(U, p) : typeof U[h] != "function" && s(U, h, E)), u(U, G, !0, !0), c && (f[G] = E))), O == y && A && A.name !== y && (W = !0, L = function() {
          return A.call(this);
        }), c && !S || D[h] === L || s(D, h, L), f[_] = L, O) if (F = { values: ae(y), keys: T ? L : ae(b), entries: ae(w) }, S) for (X in F) (v || W || !(X in D)) && i(D, X, F[X]);
        else n({ target: _, proto: !0, forced: v || W }, F);
        return F;
      };
    }, "7eb5": function(a, d, e) {
      e.r(d);
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
      t.a.add(u), d.default = u;
    }, "7f9a": function(a, d, e) {
      var n = e("da84"), r = e("8925"), o = n.WeakMap;
      a.exports = typeof o == "function" && /native code/.test(r(o));
    }, "825a": function(a, d, e) {
      var n = e("861d");
      a.exports = function(r) {
        if (!n(r)) throw TypeError(String(r) + " is not an object");
        return r;
      };
    }, "83ab": function(a, d, e) {
      var n = e("d039");
      a.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(a, d, e) {
      var n = e("d925"), r = e("e683");
      a.exports = function(o, t) {
        return o && !n(t) ? r(o, t) : t;
      };
    }, 8418: function(a, d, e) {
      var n = e("c04e"), r = e("9bf2"), o = e("5c6c");
      a.exports = function(t, u, s) {
        var i = n(u);
        i in t ? r.f(t, i, o(0, s)) : t[i] = s;
      };
    }, "861d": function(a, d) {
      a.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(a, d, e) {
      var n, r, o;
      (function(t, u) {
        r = [], n = u, o = typeof n == "function" ? n.apply(d, r) : n, o === void 0 || (a.exports = o);
      })(typeof self < "u" && self, function() {
        function t() {
          var u = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!u && "currentScript" in document && document.currentScript || u && u.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (w) {
            var s, i, l, c = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, g = c.exec(w.stack) || f.exec(w.stack), p = g && g[1] || !1, v = g && g[2] || !1, h = document.location.href.replace(document.location.hash, ""), b = document.getElementsByTagName("script");
            p === h && (s = document.documentElement.outerHTML, i = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), l = s.replace(i, "$1").trim());
            for (var y = 0; y < b.length; y++)
              if (b[y].readyState === "interactive" || b[y].src === p || p === h && b[y].innerHTML && b[y].innerHTML.trim() === l) return b[y];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(a, d, e) {
      var n = e("c6cd"), r = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(o) {
        return r.call(o);
      }), a.exports = n.inspectSource;
    }, "8aa5": function(a, d, e) {
      var n = e("6547").charAt;
      a.exports = function(r, o, t) {
        return o + (t ? n(r, o).length : 1);
      };
    }, "8bbf": function(a, d) {
      a.exports = re;
    }, "8df4": function(a, d, e) {
      var n = e("7a77");
      function r(o) {
        if (typeof o != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(s) {
          t = s;
        });
        var u = this;
        o(function(s) {
          u.reason || (u.reason = new n(s), t(u.reason));
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
    }, "90e3": function(a, d) {
      var e = 0, n = Math.random();
      a.exports = function(r) {
        return "Symbol(" + String(r === void 0 ? "" : r) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(a, d, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("5c6c");
      a.exports = n ? function(t, u, s) {
        return r.f(t, u, o(1, s));
      } : function(t, u, s) {
        return t[u] = s, t;
      };
    }, 9263: function(a, d, e) {
      var n = e("ad6d"), r = e("9f7f"), o = RegExp.prototype.exec, t = String.prototype.replace, u = o, s = function() {
        var f = /a/, g = /b*/g;
        return o.call(f, "a"), o.call(g, "a"), f.lastIndex !== 0 || g.lastIndex !== 0;
      }(), i = r.UNSUPPORTED_Y || r.BROKEN_CARET, l = /()??/.exec("")[1] !== void 0, c = s || l || i;
      c && (u = function(f) {
        var g, p, v, h, b = this, y = i && b.sticky, w = n.call(b), E = b.source, k = 0, _ = f;
        return y && (w = w.replace("y", ""), w.indexOf("g") === -1 && (w += "g"), _ = String(f).slice(b.lastIndex), b.lastIndex > 0 && (!b.multiline || b.multiline && f[b.lastIndex - 1] !== `
`) && (E = "(?: " + E + ")", _ = " " + _, k++), p = new RegExp("^(?:" + E + ")", w)), l && (p = new RegExp("^" + E + "$(?!\\s)", w)), s && (g = b.lastIndex), v = o.call(y ? p : b, _), y ? v ? (v.input = v.input.slice(k), v[0] = v[0].slice(k), v.index = b.lastIndex, b.lastIndex += v[0].length) : b.lastIndex = 0 : s && v && (b.lastIndex = b.global ? v.index + v[0].length : g), l && v && v.length > 1 && t.call(v[0], p, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (v[h] = void 0);
        }), v;
      }), a.exports = u;
    }, "94ca": function(a, d, e) {
      var n = e("d039"), r = /#|\.prototype\./, o = function(l, c) {
        var f = u[t(l)];
        return f == i || f != s && (typeof c == "function" ? n(c) : !!c);
      }, t = o.normalize = function(l) {
        return String(l).replace(r, ".").toLowerCase();
      }, u = o.data = {}, s = o.NATIVE = "N", i = o.POLYFILL = "P";
      a.exports = o;
    }, "95d9": function(a, d, e) {
    }, "96cf": function(a, d) {
      (function(e) {
        var n, r = Object.prototype, o = r.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, u = t.iterator || "@@iterator", s = t.asyncIterator || "@@asyncIterator", i = t.toStringTag || "@@toStringTag", l = typeof a == "object", c = e.regeneratorRuntime;
        if (c) l && (a.exports = c);
        else {
          c = e.regeneratorRuntime = l ? a.exports : {}, c.wrap = k;
          var f = "suspendedStart", g = "suspendedYield", p = "executing", v = "completed", h = {}, b = {};
          b[u] = function() {
            return this;
          };
          var y = Object.getPrototypeOf, w = y && y(y(W([])));
          w && w !== r && o.call(w, u) && (b = w);
          var E = O.prototype = m.prototype = Object.create(b);
          j.prototype = E.constructor = O, O.constructor = j, O[i] = j.displayName = "GeneratorFunction", c.isGeneratorFunction = function(A) {
            var L = typeof A == "function" && A.constructor;
            return !!L && (L === j || (L.displayName || L.name) === "GeneratorFunction");
          }, c.mark = function(A) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(A, O) : (A.__proto__ = O, i in A || (A[i] = "GeneratorFunction")), A.prototype = Object.create(E), A;
          }, c.awrap = function(A) {
            return { __await: A };
          }, T(S.prototype), S.prototype[s] = function() {
            return this;
          }, c.AsyncIterator = S, c.async = function(A, L, Q, Z) {
            var M = new S(k(A, L, Q, Z));
            return c.isGeneratorFunction(L) ? M : M.next().then(function(we) {
              return we.done ? we.value : M.next();
            });
          }, T(E), E[i] = "Generator", E[u] = function() {
            return this;
          }, E.toString = function() {
            return "[object Generator]";
          }, c.keys = function(A) {
            var L = [];
            for (var Q in A) L.push(Q);
            return L.reverse(), function Z() {
              for (; L.length; ) {
                var M = L.pop();
                if (M in A) return Z.value = M, Z.done = !1, Z;
              }
              return Z.done = !0, Z;
            };
          }, c.values = W, G.prototype = { constructor: G, reset: function(A) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ae), !A) for (var L in this) L.charAt(0) === "t" && o.call(this, L) && !isNaN(+L.slice(1)) && (this[L] = n);
          }, stop: function() {
            this.done = !0;
            var A = this.tryEntries[0], L = A.completion;
            if (L.type === "throw") throw L.arg;
            return this.rval;
          }, dispatchException: function(A) {
            if (this.done) throw A;
            var L = this;
            function Q(Ne, Ee) {
              return we.type = "throw", we.arg = A, L.next = Ne, Ee && (L.method = "next", L.arg = n), !!Ee;
            }
            for (var Z = this.tryEntries.length - 1; Z >= 0; --Z) {
              var M = this.tryEntries[Z], we = M.completion;
              if (M.tryLoc === "root") return Q("end");
              if (M.tryLoc <= this.prev) {
                var pe = o.call(M, "catchLoc"), Ae = o.call(M, "finallyLoc");
                if (pe && Ae) {
                  if (this.prev < M.catchLoc) return Q(M.catchLoc, !0);
                  if (this.prev < M.finallyLoc) return Q(M.finallyLoc);
                } else if (pe) {
                  if (this.prev < M.catchLoc) return Q(M.catchLoc, !0);
                } else {
                  if (!Ae) throw new Error("try statement without catch or finally");
                  if (this.prev < M.finallyLoc) return Q(M.finallyLoc);
                }
              }
            }
          }, abrupt: function(A, L) {
            for (var Q = this.tryEntries.length - 1; Q >= 0; --Q) {
              var Z = this.tryEntries[Q];
              if (Z.tryLoc <= this.prev && o.call(Z, "finallyLoc") && this.prev < Z.finallyLoc) {
                var M = Z;
                break;
              }
            }
            M && (A === "break" || A === "continue") && M.tryLoc <= L && L <= M.finallyLoc && (M = null);
            var we = M ? M.completion : {};
            return we.type = A, we.arg = L, M ? (this.method = "next", this.next = M.finallyLoc, h) : this.complete(we);
          }, complete: function(A, L) {
            if (A.type === "throw") throw A.arg;
            return A.type === "break" || A.type === "continue" ? this.next = A.arg : A.type === "return" ? (this.rval = this.arg = A.arg, this.method = "return", this.next = "end") : A.type === "normal" && L && (this.next = L), h;
          }, finish: function(A) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var Q = this.tryEntries[L];
              if (Q.finallyLoc === A) return this.complete(Q.completion, Q.afterLoc), ae(Q), h;
            }
          }, catch: function(A) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var Q = this.tryEntries[L];
              if (Q.tryLoc === A) {
                var Z = Q.completion;
                if (Z.type === "throw") {
                  var M = Z.arg;
                  ae(Q);
                }
                return M;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(A, L, Q) {
            return this.delegate = { iterator: W(A), resultName: L, nextLoc: Q }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function k(A, L, Q, Z) {
          var M = L && L.prototype instanceof m ? L : m, we = Object.create(M.prototype), pe = new G(Z || []);
          return we._invoke = U(A, Q, pe), we;
        }
        function _(A, L, Q) {
          try {
            return { type: "normal", arg: A.call(L, Q) };
          } catch (Z) {
            return { type: "throw", arg: Z };
          }
        }
        function m() {
        }
        function j() {
        }
        function O() {
        }
        function T(A) {
          ["next", "throw", "return"].forEach(function(L) {
            A[L] = function(Q) {
              return this._invoke(L, Q);
            };
          });
        }
        function S(A) {
          function L(M, we, pe, Ae) {
            var Ne = _(A[M], A, we);
            if (Ne.type !== "throw") {
              var Ee = Ne.arg, Oe = Ee.value;
              return Oe && typeof Oe == "object" && o.call(Oe, "__await") ? Promise.resolve(Oe.__await).then(function(Se) {
                L("next", Se, pe, Ae);
              }, function(Se) {
                L("throw", Se, pe, Ae);
              }) : Promise.resolve(Oe).then(function(Se) {
                Ee.value = Se, pe(Ee);
              }, Ae);
            }
            Ae(Ne.arg);
          }
          var Q;
          function Z(M, we) {
            function pe() {
              return new Promise(function(Ae, Ne) {
                L(M, we, Ae, Ne);
              });
            }
            return Q = Q ? Q.then(pe, pe) : pe();
          }
          this._invoke = Z;
        }
        function U(A, L, Q) {
          var Z = f;
          return function(M, we) {
            if (Z === p) throw new Error("Generator is already running");
            if (Z === v) {
              if (M === "throw") throw we;
              return D();
            }
            for (Q.method = M, Q.arg = we; ; ) {
              var pe = Q.delegate;
              if (pe) {
                var Ae = F(pe, Q);
                if (Ae) {
                  if (Ae === h) continue;
                  return Ae;
                }
              }
              if (Q.method === "next") Q.sent = Q._sent = Q.arg;
              else if (Q.method === "throw") {
                if (Z === f) throw Z = v, Q.arg;
                Q.dispatchException(Q.arg);
              } else Q.method === "return" && Q.abrupt("return", Q.arg);
              Z = p;
              var Ne = _(A, L, Q);
              if (Ne.type === "normal") {
                if (Z = Q.done ? v : g, Ne.arg === h) continue;
                return { value: Ne.arg, done: Q.done };
              }
              Ne.type === "throw" && (Z = v, Q.method = "throw", Q.arg = Ne.arg);
            }
          };
        }
        function F(A, L) {
          var Q = A.iterator[L.method];
          if (Q === n) {
            if (L.delegate = null, L.method === "throw") {
              if (A.iterator.return && (L.method = "return", L.arg = n, F(A, L), L.method === "throw")) return h;
              L.method = "throw", L.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var Z = _(Q, A.iterator, L.arg);
          if (Z.type === "throw") return L.method = "throw", L.arg = Z.arg, L.delegate = null, h;
          var M = Z.arg;
          return M ? M.done ? (L[A.resultName] = M.value, L.next = A.nextLoc, L.method !== "return" && (L.method = "next", L.arg = n), L.delegate = null, h) : M : (L.method = "throw", L.arg = new TypeError("iterator result is not an object"), L.delegate = null, h);
        }
        function X(A) {
          var L = { tryLoc: A[0] };
          1 in A && (L.catchLoc = A[1]), 2 in A && (L.finallyLoc = A[2], L.afterLoc = A[3]), this.tryEntries.push(L);
        }
        function ae(A) {
          var L = A.completion || {};
          L.type = "normal", delete L.arg, A.completion = L;
        }
        function G(A) {
          this.tryEntries = [{ tryLoc: "root" }], A.forEach(X, this), this.reset(!0);
        }
        function W(A) {
          if (A) {
            var L = A[u];
            if (L) return L.call(A);
            if (typeof A.next == "function") return A;
            if (!isNaN(A.length)) {
              var Q = -1, Z = function M() {
                for (; ++Q < A.length; ) if (o.call(A, Q)) return M.value = A[Q], M.done = !1, M;
                return M.value = n, M.done = !0, M;
              };
              return Z.next = Z;
            }
          }
          return { next: D };
        }
        function D() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(a, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), s = e("50c4"), i = e("8418"), l = e("65f0"), c = e("1dde"), f = e("b622"), g = e("2d00"), p = f("isConcatSpreadable"), v = 9007199254740991, h = "Maximum allowed index exceeded", b = g >= 51 || !r(function() {
        var k = [];
        return k[p] = !1, k.concat()[0] !== k;
      }), y = c("concat"), w = function(k) {
        if (!t(k)) return !1;
        var _ = k[p];
        return _ !== void 0 ? !!_ : o(k);
      }, E = !b || !y;
      n({ target: "Array", proto: !0, forced: E }, { concat: function(k) {
        var _, m, j, O, T, S = u(this), U = l(S, 0), F = 0;
        for (_ = -1, j = arguments.length; _ < j; _++) if (T = _ === -1 ? S : arguments[_], w(T)) {
          if (O = s(T.length), F + O > v) throw TypeError(h);
          for (m = 0; m < O; m++, F++) m in T && i(U, F, T[m]);
        } else {
          if (F >= v) throw TypeError(h);
          i(U, F++, T);
        }
        return U.length = F, U;
      } });
    }, "9aaf": function(a, d, e) {
      e("70d3");
    }, "9bdd": function(a, d, e) {
      var n = e("825a"), r = e("2a62");
      a.exports = function(o, t, u, s) {
        try {
          return s ? t(n(u)[0], u[1]) : t(u);
        } catch (i) {
          throw r(o), i;
        }
      };
    }, "9bf2": function(a, d, e) {
      var n = e("83ab"), r = e("0cfb"), o = e("825a"), t = e("c04e"), u = Object.defineProperty;
      d.f = n ? u : function(s, i, l) {
        if (o(s), i = t(i, !0), o(l), r) try {
          return u(s, i, l);
        } catch {
        }
        if ("get" in l || "set" in l) throw TypeError("Accessors not supported");
        return "value" in l && (s[i] = l.value), s;
      };
    }, "9ed3": function(a, d, e) {
      var n = e("ae93").IteratorPrototype, r = e("7c73"), o = e("5c6c"), t = e("d44e"), u = e("3f8c"), s = function() {
        return this;
      };
      a.exports = function(i, l, c) {
        var f = l + " Iterator";
        return i.prototype = r(n, { next: o(1, c) }), t(i, f, !1, !0), u[f] = s, i;
      };
    }, "9f7f": function(a, d, e) {
      var n = e("d039");
      function r(o, t) {
        return RegExp(o, t);
      }
      d.UNSUPPORTED_Y = n(function() {
        var o = r("a", "y");
        return o.lastIndex = 2, o.exec("abcd") != null;
      }), d.BROKEN_CARET = n(function() {
        var o = r("^r", "gy");
        return o.lastIndex = 2, o.exec("str") != null;
      });
    }, a434: function(a, d, e) {
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), s = e("65f0"), i = e("8418"), l = e("1dde"), c = l("splice"), f = Math.max, g = Math.min, p = 9007199254740991, v = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !c }, { splice: function(h, b) {
        var y, w, E, k, _, m, j = u(this), O = t(j.length), T = r(h, O), S = arguments.length;
        if (S === 0 ? y = w = 0 : S === 1 ? (y = 0, w = O - T) : (y = S - 2, w = g(f(o(b), 0), O - T)), O + y - w > p) throw TypeError(v);
        for (E = s(j, w), k = 0; k < w; k++) _ = T + k, _ in j && i(E, k, j[_]);
        if (E.length = w, y < w) {
          for (k = T; k < O - w; k++) _ = k + w, m = k + y, _ in j ? j[m] = j[_] : delete j[m];
          for (k = O; k > O - w + y; k--) delete j[k - 1];
        } else if (y > w) for (k = O - w; k > T; k--) _ = k + w - 1, m = k + y - 1, _ in j ? j[m] = j[_] : delete j[m];
        for (k = 0; k < y; k++) j[k + T] = arguments[k + 2];
        return j.length = O - w + y, E;
      } });
    }, a4b4: function(a, d, e) {
      var n = e("342f");
      a.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(a, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), s = e("4930"), i = e("fdbf"), l = e("d039"), c = e("5135"), f = e("e8b5"), g = e("861d"), p = e("825a"), v = e("7b0b"), h = e("fc6a"), b = e("c04e"), y = e("5c6c"), w = e("7c73"), E = e("df75"), k = e("241c"), _ = e("057f"), m = e("7418"), j = e("06cf"), O = e("9bf2"), T = e("d1e7"), S = e("9112"), U = e("6eeb"), F = e("5692"), X = e("f772"), ae = e("d012"), G = e("90e3"), W = e("b622"), D = e("e538"), A = e("746f"), L = e("d44e"), Q = e("69f3"), Z = e("b727").forEach, M = X("hidden"), we = "Symbol", pe = "prototype", Ae = W("toPrimitive"), Ne = Q.set, Ee = Q.getterFor(we), Oe = Object[pe], Se = r.Symbol, Ve = o("JSON", "stringify"), He = j.f, B = O.f, R = _.f, J = T.f, V = F("symbols"), ee = F("op-symbols"), ie = F("string-to-symbol-registry"), ge = F("symbol-to-string-registry"), H = F("wks"), P = r.QObject, Y = !P || !P[pe] || !P[pe].findChild, ye = u && l(function() {
        return w(B({}, "a", { get: function() {
          return B(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, oe, ce) {
        var he = He(Oe, oe);
        he && delete Oe[oe], B(q, oe, ce), he && q !== Oe && B(Oe, oe, he);
      } : B, Be = function(q, oe) {
        var ce = V[q] = w(Se[pe]);
        return Ne(ce, { type: we, tag: q, description: oe }), u || (ce.description = oe), ce;
      }, je = i ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Se;
      }, We = function(q, oe, ce) {
        q === Oe && We(ee, oe, ce), p(q);
        var he = b(oe, !0);
        return p(ce), c(V, he) ? (ce.enumerable ? (c(q, M) && q[M][he] && (q[M][he] = !1), ce = w(ce, { enumerable: y(0, !1) })) : (c(q, M) || B(q, M, y(1, {})), q[M][he] = !0), ye(q, he, ce)) : B(q, he, ce);
      }, Ge = function(q, oe) {
        p(q);
        var ce = h(oe), he = E(ce).concat(de(ce));
        return Z(he, function($e) {
          u && !rt.call(ce, $e) || We(q, $e, ce[$e]);
        }), q;
      }, Xe = function(q, oe) {
        return oe === void 0 ? w(q) : Ge(w(q), oe);
      }, rt = function(q) {
        var oe = b(q, !0), ce = J.call(this, oe);
        return !(this === Oe && c(V, oe) && !c(ee, oe)) && (!(ce || !c(this, oe) || !c(V, oe) || c(this, M) && this[M][oe]) || ce);
      }, z = function(q, oe) {
        var ce = h(q), he = b(oe, !0);
        if (ce !== Oe || !c(V, he) || c(ee, he)) {
          var $e = He(ce, he);
          return !$e || !c(V, he) || c(ce, M) && ce[M][he] || ($e.enumerable = !0), $e;
        }
      }, ue = function(q) {
        var oe = R(h(q)), ce = [];
        return Z(oe, function(he) {
          c(V, he) || c(ae, he) || ce.push(he);
        }), ce;
      }, de = function(q) {
        var oe = q === Oe, ce = R(oe ? ee : h(q)), he = [];
        return Z(ce, function($e) {
          !c(V, $e) || oe && !c(Oe, $e) || he.push(V[$e]);
        }), he;
      };
      if (s || (Se = function() {
        if (this instanceof Se) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, oe = G(q), ce = function(he) {
          this === Oe && ce.call(ee, he), c(this, M) && c(this[M], oe) && (this[M][oe] = !1), ye(this, oe, y(1, he));
        };
        return u && Y && ye(Oe, oe, { configurable: !0, set: ce }), Be(oe, q);
      }, U(Se[pe], "toString", function() {
        return Ee(this).tag;
      }), U(Se, "withoutSetter", function(q) {
        return Be(G(q), q);
      }), T.f = rt, O.f = We, j.f = z, k.f = _.f = ue, m.f = de, D.f = function(q) {
        return Be(W(q), q);
      }, u && (B(Se[pe], "description", { configurable: !0, get: function() {
        return Ee(this).description;
      } }), t || U(Oe, "propertyIsEnumerable", rt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !s, sham: !s }, { Symbol: Se }), Z(E(H), function(q) {
        A(q);
      }), n({ target: we, stat: !0, forced: !s }, { for: function(q) {
        var oe = String(q);
        if (c(ie, oe)) return ie[oe];
        var ce = Se(oe);
        return ie[oe] = ce, ge[ce] = oe, ce;
      }, keyFor: function(q) {
        if (!je(q)) throw TypeError(q + " is not a symbol");
        if (c(ge, q)) return ge[q];
      }, useSetter: function() {
        Y = !0;
      }, useSimple: function() {
        Y = !1;
      } }), n({ target: "Object", stat: !0, forced: !s, sham: !u }, { create: Xe, defineProperty: We, defineProperties: Ge, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !s }, { getOwnPropertyNames: ue, getOwnPropertySymbols: de }), n({ target: "Object", stat: !0, forced: l(function() {
        m.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return m.f(v(q));
      } }), Ve) {
        var ve = !s || l(function() {
          var q = Se();
          return Ve([q]) != "[null]" || Ve({ a: q }) != "{}" || Ve(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: ve }, { stringify: function(q, oe, ce) {
          for (var he, $e = [q], qe = 1; arguments.length > qe; ) $e.push(arguments[qe++]);
          if (he = oe, (g(oe) || q !== void 0) && !je(q)) return f(oe) || (oe = function(Ze, xe) {
            if (typeof he == "function" && (xe = he.call(this, Ze, xe)), !je(xe)) return xe;
          }), $e[1] = oe, Ve.apply(null, $e);
        } });
      }
      Se[pe][Ae] || S(Se[pe], Ae, Se[pe].valueOf), L(Se, we), ae[M] = !0;
    }, a630: function(a, d, e) {
      var n = e("23e7"), r = e("4df4"), o = e("1c7e"), t = !o(function(u) {
        Array.from(u);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: r });
    }, a640: function(a, d, e) {
      var n = e("d039");
      a.exports = function(r, o) {
        var t = [][r];
        return !!t && n(function() {
          t.call(null, o || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(a, d) {
      var e = Math.ceil, n = Math.floor;
      a.exports = function(r) {
        return isNaN(r = +r) ? 0 : (r > 0 ? n : e)(r);
      };
    }, ab13: function(a, d, e) {
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
    }, ac1f: function(a, d, e) {
      var n = e("23e7"), r = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== r }, { exec: r });
    }, acce: function(a, d, e) {
    }, ad6d: function(a, d, e) {
      var n = e("825a");
      a.exports = function() {
        var r = n(this), o = "";
        return r.global && (o += "g"), r.ignoreCase && (o += "i"), r.multiline && (o += "m"), r.dotAll && (o += "s"), r.unicode && (o += "u"), r.sticky && (o += "y"), o;
      };
    }, ae93: function(a, d, e) {
      var n, r, o, t = e("d039"), u = e("e163"), s = e("9112"), i = e("5135"), l = e("b622"), c = e("c430"), f = l("iterator"), g = !1, p = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : g = !0);
      var v = n == null || t(function() {
        var h = {};
        return n[f].call(h) !== h;
      });
      v && (n = {}), c && !v || i(n, f) || s(n, f, p), a.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: g };
    }, b041: function(a, d, e) {
      var n = e("00ee"), r = e("f5df");
      a.exports = n ? {}.toString : function() {
        return "[object " + r(this) + "]";
      };
    }, b0c0: function(a, d, e) {
      var n = e("83ab"), r = e("9bf2").f, o = Function.prototype, t = o.toString, u = /^\s*function ([^ (]*)/, s = "name";
      n && !(s in o) && r(o, s, { configurable: !0, get: function() {
        try {
          return t.call(this).match(u)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(a, d, e) {
      var n = e("c532"), r = e("467f"), o = e("7aac"), t = e("30b5"), u = e("83b9"), s = e("c345"), i = e("3934"), l = e("2d83");
      a.exports = function(c) {
        return new Promise(function(f, g) {
          var p = c.data, v = c.headers;
          n.isFormData(p) && delete v["Content-Type"];
          var h = new XMLHttpRequest();
          if (c.auth) {
            var b = c.auth.username || "", y = c.auth.password ? unescape(encodeURIComponent(c.auth.password)) : "";
            v.Authorization = "Basic " + btoa(b + ":" + y);
          }
          var w = u(c.baseURL, c.url);
          if (h.open(c.method.toUpperCase(), t(w, c.params, c.paramsSerializer), !0), h.timeout = c.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var k = "getAllResponseHeaders" in h ? s(h.getAllResponseHeaders()) : null, _ = c.responseType && c.responseType !== "text" ? h.response : h.responseText, m = { data: _, status: h.status, statusText: h.statusText, headers: k, config: c, request: h };
              r(f, g, m), h = null;
            }
          }, h.onabort = function() {
            h && (g(l("Request aborted", c, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            g(l("Network Error", c, null, h)), h = null;
          }, h.ontimeout = function() {
            var k = "timeout of " + c.timeout + "ms exceeded";
            c.timeoutErrorMessage && (k = c.timeoutErrorMessage), g(l(k, c, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var E = (c.withCredentials || i(w)) && c.xsrfCookieName ? o.read(c.xsrfCookieName) : void 0;
            E && (v[c.xsrfHeaderName] = E);
          }
          if ("setRequestHeader" in h && n.forEach(v, function(k, _) {
            typeof p > "u" && _.toLowerCase() === "content-type" ? delete v[_] : h.setRequestHeader(_, k);
          }), n.isUndefined(c.withCredentials) || (h.withCredentials = !!c.withCredentials), c.responseType) try {
            h.responseType = c.responseType;
          } catch (k) {
            if (c.responseType !== "json") throw k;
          }
          typeof c.onDownloadProgress == "function" && h.addEventListener("progress", c.onDownloadProgress), typeof c.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", c.onUploadProgress), c.cancelToken && c.cancelToken.promise.then(function(k) {
            h && (h.abort(), g(k), h = null);
          }), p || (p = null), h.send(p);
        });
      };
    }, b575: function(a, d, e) {
      var n, r, o, t, u, s, i, l, c = e("da84"), f = e("06cf").f, g = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), h = e("605d"), b = c.MutationObserver || c.WebKitMutationObserver, y = c.document, w = c.process, E = c.Promise, k = f(c, "queueMicrotask"), _ = k && k.value;
      _ || (n = function() {
        var m, j;
        for (h && (m = w.domain) && m.exit(); r; ) {
          j = r.fn, r = r.next;
          try {
            j();
          } catch (O) {
            throw r ? t() : o = void 0, O;
          }
        }
        o = void 0, m && m.enter();
      }, p || h || v || !b || !y ? E && E.resolve ? (i = E.resolve(void 0), l = i.then, t = function() {
        l.call(i, n);
      }) : t = h ? function() {
        w.nextTick(n);
      } : function() {
        g.call(c, n);
      } : (u = !0, s = y.createTextNode(""), new b(n).observe(s, { characterData: !0 }), t = function() {
        s.data = u = !u;
      })), a.exports = _ || function(m) {
        var j = { fn: m, next: void 0 };
        o && (o.next = j), r || (r = j, t()), o = j;
      };
    }, b622: function(a, d, e) {
      var n = e("da84"), r = e("5692"), o = e("5135"), t = e("90e3"), u = e("4930"), s = e("fdbf"), i = r("wks"), l = n.Symbol, c = s ? l : l && l.withoutSetter || t;
      a.exports = function(f) {
        return o(i, f) && (u || typeof i[f] == "string") || (u && o(l, f) ? i[f] = l[f] : i[f] = c("Symbol." + f)), i[f];
      };
    }, b64b: function(a, d, e) {
      var n = e("23e7"), r = e("7b0b"), o = e("df75"), t = e("d039"), u = t(function() {
        o(1);
      });
      n({ target: "Object", stat: !0, forced: u }, { keys: function(s) {
        return o(r(s));
      } });
    }, b680: function(a, d, e) {
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), s = 1 .toFixed, i = Math.floor, l = function(h, b, y) {
        return b === 0 ? y : b % 2 === 1 ? l(h, b - 1, y * h) : l(h * h, b / 2, y);
      }, c = function(h) {
        for (var b = 0, y = h; y >= 4096; ) b += 12, y /= 4096;
        for (; y >= 2; ) b += 1, y /= 2;
        return b;
      }, f = function(h, b, y) {
        for (var w = -1, E = y; ++w < 6; ) E += b * h[w], h[w] = E % 1e7, E = i(E / 1e7);
      }, g = function(h, b) {
        for (var y = 6, w = 0; --y >= 0; ) w += h[y], h[y] = i(w / b), w = w % b * 1e7;
      }, p = function(h) {
        for (var b = 6, y = ""; --b >= 0; ) if (y !== "" || b === 0 || h[b] !== 0) {
          var w = String(h[b]);
          y = y === "" ? w : y + t.call("0", 7 - w.length) + w;
        }
        return y;
      }, v = s && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        s.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(h) {
        var b, y, w, E, k = o(this), _ = r(h), m = [0, 0, 0, 0, 0, 0], j = "", O = "0";
        if (_ < 0 || _ > 20) throw RangeError("Incorrect fraction digits");
        if (k != k) return "NaN";
        if (k <= -1e21 || k >= 1e21) return String(k);
        if (k < 0 && (j = "-", k = -k), k > 1e-21) if (b = c(k * l(2, 69, 1)) - 69, y = b < 0 ? k * l(2, -b, 1) : k / l(2, b, 1), y *= 4503599627370496, b = 52 - b, b > 0) {
          for (f(m, 0, y), w = _; w >= 7; ) f(m, 1e7, 0), w -= 7;
          for (f(m, l(10, w, 1), 0), w = b - 1; w >= 23; ) g(m, 1 << 23), w -= 23;
          g(m, 1 << w), f(m, 1, 1), g(m, 2), O = p(m);
        } else f(m, 0, y), f(m, 1 << -b, 0), O = p(m) + t.call("0", _);
        return _ > 0 ? (E = O.length, O = j + (E <= _ ? "0." + t.call("0", _ - E) + O : O.slice(0, E - _) + "." + O.slice(E - _))) : O = j + O, O;
      } });
    }, b727: function(a, d, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), s = [].push, i = function(l) {
        var c = l == 1, f = l == 2, g = l == 3, p = l == 4, v = l == 6, h = l == 7, b = l == 5 || v;
        return function(y, w, E, k) {
          for (var _, m, j = o(y), O = r(j), T = n(w, E, 3), S = t(O.length), U = 0, F = k || u, X = c ? F(y, S) : f || h ? F(y, 0) : void 0; S > U; U++) if ((b || U in O) && (_ = O[U], m = T(_, U, j), l)) if (c) X[U] = m;
          else if (m) switch (l) {
            case 3:
              return !0;
            case 5:
              return _;
            case 6:
              return U;
            case 2:
              s.call(X, _);
          }
          else switch (l) {
            case 4:
              return !1;
            case 7:
              s.call(X, _);
          }
          return v ? -1 : g || p ? p : X;
        };
      };
      a.exports = { forEach: i(0), map: i(1), filter: i(2), some: i(3), every: i(4), find: i(5), findIndex: i(6), filterOut: i(7) };
    }, b8d6: function(a, d, e) {
    }, bb2f: function(a, d, e) {
      var n = e("d039");
      a.exports = !n(function() {
        return Object.isExtensible(Object.preventExtensions({}));
      });
    }, bc3a: function(a, d, e) {
      a.exports = e("cee4");
    }, c04e: function(a, d, e) {
      var n = e("861d");
      a.exports = function(r, o) {
        if (!n(r)) return r;
        var t, u;
        if (o && typeof (t = r.toString) == "function" && !n(u = t.call(r)) || typeof (t = r.valueOf) == "function" && !n(u = t.call(r)) || !o && typeof (t = r.toString) == "function" && !n(u = t.call(r))) return u;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(a, d, e) {
      var n = e("c532"), r = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      a.exports = function(o) {
        var t, u, s, i = {};
        return o && n.forEach(o.split(`
`), function(l) {
          if (s = l.indexOf(":"), t = n.trim(l.substr(0, s)).toLowerCase(), u = n.trim(l.substr(s + 1)), t) {
            if (i[t] && r.indexOf(t) >= 0) return;
            i[t] = t === "set-cookie" ? (i[t] ? i[t] : []).concat([u]) : i[t] ? i[t] + ", " + u : u;
          }
        }), i;
      };
    }, c401: function(a, d, e) {
      var n = e("c532");
      a.exports = function(r, o, t) {
        return n.forEach(t, function(u) {
          r = u(r, o);
        }), r;
      };
    }, c430: function(a, d) {
      a.exports = !1;
    }, c532: function(a, d, e) {
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
      function s(S) {
        return r.call(S) === "[object ArrayBuffer]";
      }
      function i(S) {
        return typeof FormData < "u" && S instanceof FormData;
      }
      function l(S) {
        var U;
        return U = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(S) : S && S.buffer && S.buffer instanceof ArrayBuffer, U;
      }
      function c(S) {
        return typeof S == "string";
      }
      function f(S) {
        return typeof S == "number";
      }
      function g(S) {
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
      function y(S) {
        return r.call(S) === "[object Function]";
      }
      function w(S) {
        return g(S) && y(S.pipe);
      }
      function E(S) {
        return typeof URLSearchParams < "u" && S instanceof URLSearchParams;
      }
      function k(S) {
        return S.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function _() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function m(S, U) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), o(S)) for (var F = 0, X = S.length; F < X; F++) U.call(null, S[F], F, S);
        else for (var ae in S) Object.prototype.hasOwnProperty.call(S, ae) && U.call(null, S[ae], ae, S);
      }
      function j() {
        var S = {};
        function U(ae, G) {
          p(S[G]) && p(ae) ? S[G] = j(S[G], ae) : p(ae) ? S[G] = j({}, ae) : o(ae) ? S[G] = ae.slice() : S[G] = ae;
        }
        for (var F = 0, X = arguments.length; F < X; F++) m(arguments[F], U);
        return S;
      }
      function O(S, U, F) {
        return m(U, function(X, ae) {
          S[ae] = F && typeof X == "function" ? n(X, F) : X;
        }), S;
      }
      function T(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      a.exports = { isArray: o, isArrayBuffer: s, isBuffer: u, isFormData: i, isArrayBufferView: l, isString: c, isNumber: f, isObject: g, isPlainObject: p, isUndefined: t, isDate: v, isFile: h, isBlob: b, isFunction: y, isStream: w, isURLSearchParams: E, isStandardBrowserEnv: _, forEach: m, merge: j, extend: O, trim: k, stripBOM: T };
    }, c6b6: function(a, d) {
      var e = {}.toString;
      a.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(a, d, e) {
      var n = e("da84"), r = e("ce4e"), o = "__core-js_shared__", t = n[o] || r(o, {});
      a.exports = t;
    }, c8af: function(a, d, e) {
      var n = e("c532");
      a.exports = function(r, o) {
        n.forEach(r, function(t, u) {
          u !== o && u.toUpperCase() === o.toUpperCase() && (r[o] = t, delete r[u]);
        });
      };
    }, c8ba: function(a, d) {
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
    }, ca84: function(a, d, e) {
      var n = e("5135"), r = e("fc6a"), o = e("4d64").indexOf, t = e("d012");
      a.exports = function(u, s) {
        var i, l = r(u), c = 0, f = [];
        for (i in l) !n(t, i) && n(l, i) && f.push(i);
        for (; s.length > c; ) n(l, i = s[c++]) && (~o(f, i) || f.push(i));
        return f;
      };
    }, caad: function(a, d, e) {
      var n = e("23e7"), r = e("4d64").includes, o = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return r(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), o("includes");
    }, cc12: function(a, d, e) {
      var n = e("da84"), r = e("861d"), o = n.document, t = r(o) && r(o.createElement);
      a.exports = function(u) {
        return t ? o.createElement(u) : {};
      };
    }, cdf9: function(a, d, e) {
      var n = e("825a"), r = e("861d"), o = e("f069");
      a.exports = function(t, u) {
        if (n(t), r(u) && u.constructor === t) return u;
        var s = o.f(t), i = s.resolve;
        return i(u), s.promise;
      };
    }, ce4e: function(a, d, e) {
      var n = e("da84"), r = e("9112");
      a.exports = function(o, t) {
        try {
          r(n, o, t);
        } catch {
          n[o] = t;
        }
        return t;
      };
    }, cee4: function(a, d, e) {
      var n = e("c532"), r = e("1d2b"), o = e("0a06"), t = e("4a7b"), u = e("2444");
      function s(l) {
        var c = new o(l), f = r(o.prototype.request, c);
        return n.extend(f, o.prototype, c), n.extend(f, c), f;
      }
      var i = s(u);
      i.Axios = o, i.create = function(l) {
        return s(t(i.defaults, l));
      }, i.Cancel = e("7a77"), i.CancelToken = e("8df4"), i.isCancel = e("2e67"), i.all = function(l) {
        return Promise.all(l);
      }, i.spread = e("0df6"), i.isAxiosError = e("5f02"), a.exports = i, a.exports.default = i;
    }, d012: function(a, d) {
      a.exports = {};
    }, d039: function(a, d) {
      a.exports = function(e) {
        try {
          return !!e();
        } catch {
          return !0;
        }
      };
    }, d066: function(a, d, e) {
      var n = e("428f"), r = e("da84"), o = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      a.exports = function(t, u) {
        return arguments.length < 2 ? o(n[t]) || o(r[t]) : n[t] && n[t][u] || r[t] && r[t][u];
      };
    }, d1e7: function(a, d, e) {
      var n = {}.propertyIsEnumerable, r = Object.getOwnPropertyDescriptor, o = r && !n.call({ 1: 2 }, 1);
      d.f = o ? function(t) {
        var u = r(this, t);
        return !!u && u.enumerable;
      } : n;
    }, d28b: function(a, d, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(a, d, e) {
      var n = e("825a"), r = e("3bbe");
      a.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var o, t = !1, u = {};
        try {
          o = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, o.call(u, []), t = u instanceof Array;
        } catch {
        }
        return function(s, i) {
          return n(s), r(i), t ? o.call(s, i) : s.__proto__ = i, s;
        };
      }() : void 0);
    }, d3b7: function(a, d, e) {
      var n = e("00ee"), r = e("6eeb"), o = e("b041");
      n || r(Object.prototype, "toString", o, { unsafe: !0 });
    }, d40d: function(a, d, e) {
      e.r(d);
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
      t.a.add(u), d.default = u;
    }, d44e: function(a, d, e) {
      var n = e("9bf2").f, r = e("5135"), o = e("b622"), t = o("toStringTag");
      a.exports = function(u, s, i) {
        u && !r(u = i ? u : u.prototype, t) && n(u, t, { configurable: !0, value: s });
      };
    }, d58f: function(a, d, e) {
      var n = e("1c0b"), r = e("7b0b"), o = e("44ad"), t = e("50c4"), u = function(s) {
        return function(i, l, c, f) {
          n(l);
          var g = r(i), p = o(g), v = t(g.length), h = s ? v - 1 : 0, b = s ? -1 : 1;
          if (c < 2) for (; ; ) {
            if (h in p) {
              f = p[h], h += b;
              break;
            }
            if (h += b, s ? h < 0 : v <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; s ? h >= 0 : v > h; h += b) h in p && (f = l(f, p[h], h, g));
          return f;
        };
      };
      a.exports = { left: u(!1), right: u(!0) };
    }, d69c: function(a, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), d.default = u;
    }, d784: function(a, d, e) {
      e("ac1f");
      var n = e("6eeb"), r = e("d039"), o = e("b622"), t = e("9263"), u = e("9112"), s = o("species"), i = !r(function() {
        var p = /./;
        return p.exec = function() {
          var v = [];
          return v.groups = { a: "7" }, v;
        }, "".replace(p, "$<a>") !== "7";
      }), l = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), c = o("replace"), f = function() {
        return !!/./[c] && /./[c]("a", "$0") === "";
      }(), g = !r(function() {
        var p = /(?:)/, v = p.exec;
        p.exec = function() {
          return v.apply(this, arguments);
        };
        var h = "ab".split(p);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      a.exports = function(p, v, h, b) {
        var y = o(p), w = !r(function() {
          var O = {};
          return O[y] = function() {
            return 7;
          }, ""[p](O) != 7;
        }), E = w && !r(function() {
          var O = !1, T = /a/;
          return p === "split" && (T = {}, T.constructor = {}, T.constructor[s] = function() {
            return T;
          }, T.flags = "", T[y] = /./[y]), T.exec = function() {
            return O = !0, null;
          }, T[y](""), !O;
        });
        if (!w || !E || p === "replace" && (!i || !l || f) || p === "split" && !g) {
          var k = /./[y], _ = h(y, ""[p], function(O, T, S, U, F) {
            return T.exec === t ? w && !F ? { done: !0, value: k.call(T, S, U) } : { done: !0, value: O.call(S, T, U) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: l, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), m = _[0], j = _[1];
          n(String.prototype, p, m), n(RegExp.prototype, y, v == 2 ? function(O, T) {
            return j.call(O, this, T);
          } : function(O) {
            return j.call(O, this);
          });
        }
        b && u(RegExp.prototype[y], "sham", !0);
      };
    }, d81d: function(a, d, e) {
      var n = e("23e7"), r = e("b727").map, o = e("1dde"), t = o("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(a, d, e) {
      a.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(a, d, e) {
      (function(n) {
        var r = function(o) {
          return o && o.Math == Math && o;
        };
        a.exports = r(typeof globalThis == "object" && globalThis) || r(typeof window == "object" && window) || r(typeof self == "object" && self) || r(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(a, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("56ef"), t = e("fc6a"), u = e("06cf"), s = e("8418");
      n({ target: "Object", stat: !0, sham: !r }, { getOwnPropertyDescriptors: function(i) {
        for (var l, c, f = t(i), g = u.f, p = o(f), v = {}, h = 0; p.length > h; ) c = g(f, l = p[h++]), c !== void 0 && s(v, l, c);
        return v;
      } });
    }, ddb0: function(a, d, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), u = e("b622"), s = u("iterator"), i = u("toStringTag"), l = o.values;
      for (var c in r) {
        var f = n[c], g = f && f.prototype;
        if (g) {
          if (g[s] !== l) try {
            t(g, s, l);
          } catch {
            g[s] = l;
          }
          if (g[i] || t(g, i, c), r[c]) {
            for (var p in o) if (g[p] !== o[p]) try {
              t(g, p, o[p]);
            } catch {
              g[p] = o[p];
            }
          }
        }
      }
    }, de23: function(a, d, e) {
      e("7305");
    }, df75: function(a, d, e) {
      var n = e("ca84"), r = e("7839");
      a.exports = Object.keys || function(o) {
        return n(o, r);
      };
    }, df7c: function(a, d, e) {
      (function(n) {
        function r(s, i) {
          for (var l = 0, c = s.length - 1; c >= 0; c--) {
            var f = s[c];
            f === "." ? s.splice(c, 1) : f === ".." ? (s.splice(c, 1), l++) : l && (s.splice(c, 1), l--);
          }
          if (i) for (; l--; l) s.unshift("..");
          return s;
        }
        function o(s) {
          typeof s != "string" && (s += "");
          var i, l = 0, c = -1, f = !0;
          for (i = s.length - 1; i >= 0; --i) if (s.charCodeAt(i) === 47) {
            if (!f) {
              l = i + 1;
              break;
            }
          } else c === -1 && (f = !1, c = i + 1);
          return c === -1 ? "" : s.slice(l, c);
        }
        function t(s, i) {
          if (s.filter) return s.filter(i);
          for (var l = [], c = 0; c < s.length; c++) i(s[c], c, s) && l.push(s[c]);
          return l;
        }
        d.resolve = function() {
          for (var s = "", i = !1, l = arguments.length - 1; l >= -1 && !i; l--) {
            var c = l >= 0 ? arguments[l] : n.cwd();
            if (typeof c != "string") throw new TypeError("Arguments to path.resolve must be strings");
            c && (s = c + "/" + s, i = c.charAt(0) === "/");
          }
          return s = r(t(s.split("/"), function(f) {
            return !!f;
          }), !i).join("/"), (i ? "/" : "") + s || ".";
        }, d.normalize = function(s) {
          var i = d.isAbsolute(s), l = u(s, -1) === "/";
          return s = r(t(s.split("/"), function(c) {
            return !!c;
          }), !i).join("/"), s || i || (s = "."), s && l && (s += "/"), (i ? "/" : "") + s;
        }, d.isAbsolute = function(s) {
          return s.charAt(0) === "/";
        }, d.join = function() {
          var s = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(s, function(i, l) {
            if (typeof i != "string") throw new TypeError("Arguments to path.join must be strings");
            return i;
          }).join("/"));
        }, d.relative = function(s, i) {
          function l(b) {
            for (var y = 0; y < b.length && b[y] === ""; y++) ;
            for (var w = b.length - 1; w >= 0 && b[w] === ""; w--) ;
            return y > w ? [] : b.slice(y, w - y + 1);
          }
          s = d.resolve(s).substr(1), i = d.resolve(i).substr(1);
          for (var c = l(s.split("/")), f = l(i.split("/")), g = Math.min(c.length, f.length), p = g, v = 0; v < g; v++) if (c[v] !== f[v]) {
            p = v;
            break;
          }
          var h = [];
          for (v = p; v < c.length; v++) h.push("..");
          return h = h.concat(f.slice(p)), h.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(s) {
          if (typeof s != "string" && (s += ""), s.length === 0) return ".";
          for (var i = s.charCodeAt(0), l = i === 47, c = -1, f = !0, g = s.length - 1; g >= 1; --g) if (i = s.charCodeAt(g), i === 47) {
            if (!f) {
              c = g;
              break;
            }
          } else f = !1;
          return c === -1 ? l ? "/" : "." : l && c === 1 ? "/" : s.slice(0, c);
        }, d.basename = function(s, i) {
          var l = o(s);
          return i && l.substr(-1 * i.length) === i && (l = l.substr(0, l.length - i.length)), l;
        }, d.extname = function(s) {
          typeof s != "string" && (s += "");
          for (var i = -1, l = 0, c = -1, f = !0, g = 0, p = s.length - 1; p >= 0; --p) {
            var v = s.charCodeAt(p);
            if (v !== 47) c === -1 && (f = !1, c = p + 1), v === 46 ? i === -1 ? i = p : g !== 1 && (g = 1) : i !== -1 && (g = -1);
            else if (!f) {
              l = p + 1;
              break;
            }
          }
          return i === -1 || c === -1 || g === 0 || g === 1 && i === c - 1 && i === l + 1 ? "" : s.slice(i, c);
        };
        var u = "ab".substr(-1) === "b" ? function(s, i, l) {
          return s.substr(i, l);
        } : function(s, i, l) {
          return i < 0 && (i = s.length + i), s.substr(i, l);
        };
      }).call(this, e("4362"));
    }, e017: function(a, d, e) {
      (function(n) {
        (function(r, o) {
          a.exports = o();
        })(0, function() {
          var r = function(v) {
            var h = v.id, b = v.viewBox, y = v.content;
            this.id = h, this.viewBox = b, this.content = y;
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
            (function(b, y) {
              v.exports = y();
            })(0, function() {
              function b(m) {
                var j = m && typeof m == "object";
                return j && Object.prototype.toString.call(m) !== "[object RegExp]" && Object.prototype.toString.call(m) !== "[object Date]";
              }
              function y(m) {
                return Array.isArray(m) ? [] : {};
              }
              function w(m, j) {
                var O = j && j.clone === !0;
                return O && b(m) ? _(y(m), m, j) : m;
              }
              function E(m, j, O) {
                var T = m.slice();
                return j.forEach(function(S, U) {
                  typeof T[U] > "u" ? T[U] = w(S, O) : b(S) ? T[U] = _(m[U], S, O) : m.indexOf(S) === -1 && T.push(w(S, O));
                }), T;
              }
              function k(m, j, O) {
                var T = {};
                return b(m) && Object.keys(m).forEach(function(S) {
                  T[S] = w(m[S], O);
                }), Object.keys(j).forEach(function(S) {
                  b(j[S]) && m[S] ? T[S] = _(m[S], j[S], O) : T[S] = w(j[S], O);
                }), T;
              }
              function _(m, j, O) {
                var T = Array.isArray(j), S = O || { arrayMerge: E }, U = S.arrayMerge || E;
                return T ? Array.isArray(m) ? U(m, j, O) : w(j, O) : k(m, j, O);
              }
              return _.all = function(m, j) {
                if (!Array.isArray(m) || m.length < 2) throw new Error("first argument should be an array with at least two elements");
                return m.reduce(function(O, T) {
                  return _(O, T, j);
                });
              }, _;
            });
          }), s = t(function(v, h) {
            var b = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = b, v.exports = h.default;
          }), i = function(v) {
            return Object.keys(v).map(function(h) {
              var b = v[h].toString().replace(/"/g, "&quot;");
              return h + '="' + b + '"';
            }).join(" ");
          }, l = s.svg, c = s.xlink, f = {};
          f[l.name] = l.uri, f[c.name] = c.uri;
          var g = function(v, h) {
            v === void 0 && (v = "");
            var b = u(f, {}), y = i(b);
            return "<svg " + y + ">" + v + "</svg>";
          }, p = function(v) {
            function h() {
              v.apply(this, arguments);
            }
            v && (h.__proto__ = v), h.prototype = Object.create(v && v.prototype), h.prototype.constructor = h;
            var b = { isMounted: {} };
            return b.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(y) {
              return new h({ id: y.getAttribute("id"), viewBox: y.getAttribute("viewBox"), content: y.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), v.prototype.destroy.call(this);
            }, h.prototype.mount = function(y) {
              if (this.isMounted) return this.node;
              var w = typeof y == "string" ? document.querySelector(y) : y, E = this.render();
              return this.node = E, w.appendChild(E), E;
            }, h.prototype.render = function() {
              var y = this.stringify();
              return o(g(y)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, b), h;
          }(r);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(a, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), s = e("9bf2").f, i = e("e893"), l = o.Symbol;
      if (r && typeof l == "function" && (!("description" in l.prototype) || l().description !== void 0)) {
        var c = {}, f = function() {
          var b = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), y = this instanceof f ? new l(b) : b === void 0 ? l() : l(b);
          return b === "" && (c[y] = !0), y;
        };
        i(f, l);
        var g = f.prototype = l.prototype;
        g.constructor = f;
        var p = g.toString, v = String(l("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        s(g, "description", { configurable: !0, get: function() {
          var b = u(this) ? this.valueOf() : this, y = p.call(b);
          if (t(c, b)) return "";
          var w = v ? y.slice(7, -1) : y.replace(h, "$1");
          return w === "" ? void 0 : w;
        } }), n({ global: !0, forced: !0 }, { Symbol: f });
      }
    }, e163: function(a, d, e) {
      var n = e("5135"), r = e("7b0b"), o = e("f772"), t = e("e177"), u = o("IE_PROTO"), s = Object.prototype;
      a.exports = t ? Object.getPrototypeOf : function(i) {
        return i = r(i), n(i, u) ? i[u] : typeof i.constructor == "function" && i instanceof i.constructor ? i.constructor.prototype : i instanceof Object ? s : null;
      };
    }, e177: function(a, d, e) {
      var n = e("d039");
      a.exports = !n(function() {
        function r() {
        }
        return r.prototype.constructor = null, Object.getPrototypeOf(new r()) !== r.prototype;
      });
    }, e260: function(a, d, e) {
      var n = e("fc6a"), r = e("44d2"), o = e("3f8c"), t = e("69f3"), u = e("7dd0"), s = "Array Iterator", i = t.set, l = t.getterFor(s);
      a.exports = u(Array, "Array", function(c, f) {
        i(this, { type: s, target: n(c), index: 0, kind: f });
      }, function() {
        var c = l(this), f = c.target, g = c.kind, p = c.index++;
        return !f || p >= f.length ? (c.target = void 0, { value: void 0, done: !0 }) : g == "keys" ? { value: p, done: !1 } : g == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
      }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries");
    }, e2cc: function(a, d, e) {
      var n = e("6eeb");
      a.exports = function(r, o, t) {
        for (var u in o) n(r, u, o[u], t);
        return r;
      };
    }, e439: function(a, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("fc6a"), t = e("06cf").f, u = e("83ab"), s = r(function() {
        t(1);
      }), i = !u || s;
      n({ target: "Object", stat: !0, forced: i, sham: !u }, { getOwnPropertyDescriptor: function(l, c) {
        return t(o(l), c);
      } });
    }, e538: function(a, d, e) {
      var n = e("b622");
      d.f = n;
    }, e667: function(a, d) {
      a.exports = function(e) {
        try {
          return { error: !1, value: e() };
        } catch (n) {
          return { error: !0, value: n };
        }
      };
    }, e66c: function(a, d, e) {
      e("95d9");
    }, e683: function(a, d, e) {
      a.exports = function(n, r) {
        return r ? n.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(a, d, e) {
      var n, r, o, t, u = e("23e7"), s = e("c430"), i = e("da84"), l = e("d066"), c = e("fea9"), f = e("6eeb"), g = e("e2cc"), p = e("d44e"), v = e("2626"), h = e("861d"), b = e("1c0b"), y = e("19aa"), w = e("8925"), E = e("2266"), k = e("1c7e"), _ = e("4840"), m = e("2cf4").set, j = e("b575"), O = e("cdf9"), T = e("44de"), S = e("f069"), U = e("e667"), F = e("69f3"), X = e("94ca"), ae = e("b622"), G = e("605d"), W = e("2d00"), D = ae("species"), A = "Promise", L = F.get, Q = F.set, Z = F.getterFor(A), M = c, we = i.TypeError, pe = i.document, Ae = i.process, Ne = l("fetch"), Ee = S.f, Oe = Ee, Se = !!(pe && pe.createEvent && i.dispatchEvent), Ve = typeof PromiseRejectionEvent == "function", He = "unhandledrejection", B = "rejectionhandled", R = 0, J = 1, V = 2, ee = 1, ie = 2, ge = X(A, function() {
        var z = w(M) !== String(M);
        if (!z && (W === 66 || !G && !Ve) || s && !M.prototype.finally) return !0;
        if (W >= 51 && /native code/.test(M)) return !1;
        var ue = M.resolve(1), de = function(q) {
          q(function() {
          }, function() {
          });
        }, ve = ue.constructor = {};
        return ve[D] = de, !(ue.then(function() {
        }) instanceof de);
      }), H = ge || !k(function(z) {
        M.all(z).catch(function() {
        });
      }), P = function(z) {
        var ue;
        return !(!h(z) || typeof (ue = z.then) != "function") && ue;
      }, Y = function(z, ue) {
        if (!z.notified) {
          z.notified = !0;
          var de = z.reactions;
          j(function() {
            for (var ve = z.value, q = z.state == J, oe = 0; de.length > oe; ) {
              var ce, he, $e, qe = de[oe++], Ze = q ? qe.ok : qe.fail, xe = qe.resolve, et = qe.reject, Qe = qe.domain;
              try {
                Ze ? (q || (z.rejection === ie && We(z), z.rejection = ee), Ze === !0 ? ce = ve : (Qe && Qe.enter(), ce = Ze(ve), Qe && (Qe.exit(), $e = !0)), ce === qe.promise ? et(we("Promise-chain cycle")) : (he = P(ce)) ? he.call(ce, xe, et) : xe(ce)) : et(ve);
              } catch (mt) {
                Qe && !$e && Qe.exit(), et(mt);
              }
            }
            z.reactions = [], z.notified = !1, ue && !z.rejection && Be(z);
          });
        }
      }, ye = function(z, ue, de) {
        var ve, q;
        Se ? (ve = pe.createEvent("Event"), ve.promise = ue, ve.reason = de, ve.initEvent(z, !1, !0), i.dispatchEvent(ve)) : ve = { promise: ue, reason: de }, !Ve && (q = i["on" + z]) ? q(ve) : z === He && T("Unhandled promise rejection", de);
      }, Be = function(z) {
        m.call(i, function() {
          var ue, de = z.facade, ve = z.value, q = je(z);
          if (q && (ue = U(function() {
            G ? Ae.emit("unhandledRejection", ve, de) : ye(He, de, ve);
          }), z.rejection = G || je(z) ? ie : ee, ue.error)) throw ue.value;
        });
      }, je = function(z) {
        return z.rejection !== ee && !z.parent;
      }, We = function(z) {
        m.call(i, function() {
          var ue = z.facade;
          G ? Ae.emit("rejectionHandled", ue) : ye(B, ue, z.value);
        });
      }, Ge = function(z, ue, de) {
        return function(ve) {
          z(ue, ve, de);
        };
      }, Xe = function(z, ue, de) {
        z.done || (z.done = !0, de && (z = de), z.value = ue, z.state = V, Y(z, !0));
      }, rt = function(z, ue, de) {
        if (!z.done) {
          z.done = !0, de && (z = de);
          try {
            if (z.facade === ue) throw we("Promise can't be resolved itself");
            var ve = P(ue);
            ve ? j(function() {
              var q = { done: !1 };
              try {
                ve.call(ue, Ge(rt, q, z), Ge(Xe, q, z));
              } catch (oe) {
                Xe(q, oe, z);
              }
            }) : (z.value = ue, z.state = J, Y(z, !1));
          } catch (q) {
            Xe({ done: !1 }, q, z);
          }
        }
      };
      ge && (M = function(z) {
        y(this, M, A), b(z), n.call(this);
        var ue = L(this);
        try {
          z(Ge(rt, ue), Ge(Xe, ue));
        } catch (de) {
          Xe(ue, de);
        }
      }, n = function(z) {
        Q(this, { type: A, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: R, value: void 0 });
      }, n.prototype = g(M.prototype, { then: function(z, ue) {
        var de = Z(this), ve = Ee(_(this, M));
        return ve.ok = typeof z != "function" || z, ve.fail = typeof ue == "function" && ue, ve.domain = G ? Ae.domain : void 0, de.parent = !0, de.reactions.push(ve), de.state != R && Y(de, !1), ve.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), r = function() {
        var z = new n(), ue = L(z);
        this.promise = z, this.resolve = Ge(rt, ue), this.reject = Ge(Xe, ue);
      }, S.f = Ee = function(z) {
        return z === M || z === o ? new r(z) : Oe(z);
      }, s || typeof c != "function" || (t = c.prototype.then, f(c.prototype, "then", function(z, ue) {
        var de = this;
        return new M(function(ve, q) {
          t.call(de, ve, q);
        }).then(z, ue);
      }, { unsafe: !0 }), typeof Ne == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return O(M, Ne.apply(i, arguments));
      } }))), u({ global: !0, wrap: !0, forced: ge }, { Promise: M }), p(M, A, !1, !0), v(A), o = l(A), u({ target: A, stat: !0, forced: ge }, { reject: function(z) {
        var ue = Ee(this);
        return ue.reject.call(void 0, z), ue.promise;
      } }), u({ target: A, stat: !0, forced: s || ge }, { resolve: function(z) {
        return O(s && this === o ? M : this, z);
      } }), u({ target: A, stat: !0, forced: H }, { all: function(z) {
        var ue = this, de = Ee(ue), ve = de.resolve, q = de.reject, oe = U(function() {
          var ce = b(ue.resolve), he = [], $e = 0, qe = 1;
          E(z, function(Ze) {
            var xe = $e++, et = !1;
            he.push(void 0), qe++, ce.call(ue, Ze).then(function(Qe) {
              et || (et = !0, he[xe] = Qe, --qe || ve(he));
            }, q);
          }), --qe || ve(he);
        });
        return oe.error && q(oe.value), de.promise;
      }, race: function(z) {
        var ue = this, de = Ee(ue), ve = de.reject, q = U(function() {
          var oe = b(ue.resolve);
          E(z, function(ce) {
            oe.call(ue, ce).then(de.resolve, ve);
          });
        });
        return q.error && ve(q.value), de.promise;
      } });
    }, e893: function(a, d, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      a.exports = function(u, s) {
        for (var i = r(s), l = t.f, c = o.f, f = 0; f < i.length; f++) {
          var g = i[f];
          n(u, g) || l(u, g, c(s, g));
        }
      };
    }, e8b5: function(a, d, e) {
      var n = e("c6b6");
      a.exports = Array.isArray || function(r) {
        return n(r) == "Array";
      };
    }, e95a: function(a, d, e) {
      var n = e("b622"), r = e("3f8c"), o = n("iterator"), t = Array.prototype;
      a.exports = function(u) {
        return u !== void 0 && (r.Array === u || t[o] === u);
      };
    }, ec57: function(a, d, e) {
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
    }, f069: function(a, d, e) {
      var n = e("1c0b"), r = function(o) {
        var t, u;
        this.promise = new o(function(s, i) {
          if (t !== void 0 || u !== void 0) throw TypeError("Bad Promise constructor");
          t = s, u = i;
        }), this.resolve = n(t), this.reject = n(u);
      };
      a.exports.f = function(o) {
        return new r(o);
      };
    }, f183: function(a, d, e) {
      var n = e("d012"), r = e("861d"), o = e("5135"), t = e("9bf2").f, u = e("90e3"), s = e("bb2f"), i = u("meta"), l = 0, c = Object.isExtensible || function() {
        return !0;
      }, f = function(b) {
        t(b, i, { value: { objectID: "O" + ++l, weakData: {} } });
      }, g = function(b, y) {
        if (!r(b)) return typeof b == "symbol" ? b : (typeof b == "string" ? "S" : "P") + b;
        if (!o(b, i)) {
          if (!c(b)) return "F";
          if (!y) return "E";
          f(b);
        }
        return b[i].objectID;
      }, p = function(b, y) {
        if (!o(b, i)) {
          if (!c(b)) return !0;
          if (!y) return !1;
          f(b);
        }
        return b[i].weakData;
      }, v = function(b) {
        return s && h.REQUIRED && c(b) && !o(b, i) && f(b), b;
      }, h = a.exports = { REQUIRED: !1, fastKey: g, getWeakData: p, onFreeze: v };
      n[i] = !0;
    }, f5df: function(a, d, e) {
      var n = e("00ee"), r = e("c6b6"), o = e("b622"), t = o("toStringTag"), u = r(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", s = function(i, l) {
        try {
          return i[l];
        } catch {
        }
      };
      a.exports = n ? r : function(i) {
        var l, c, f;
        return i === void 0 ? "Undefined" : i === null ? "Null" : typeof (c = s(l = Object(i), t)) == "string" ? c : u ? r(l) : (f = r(l)) == "Object" && typeof l.callee == "function" ? "Arguments" : f;
      };
    }, f6b4: function(a, d, e) {
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
    }, f772: function(a, d, e) {
      var n = e("5692"), r = e("90e3"), o = n("keys");
      a.exports = function(t) {
        return o[t] || (o[t] = r(t));
      };
    }, f8b0: function(a, d, e) {
      e("b8d6");
    }, fb15: function(a, d, e) {
      if (e.r(d), typeof window < "u") {
        var n = window.document.currentScript, r = e("8875");
        n = r(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: r });
        var o = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        o && (e.p = o[1]);
      }
      e("b0c0");
      var t = e("8bbf"), u = { class: "key-board-container" }, s = { class: "key-board-area" };
      function i(x, $, N, I, K, se) {
        var fe = Object(t.resolveComponent)("Result"), le = Object(t.resolveComponent)("DefaultBoard"), me = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Me = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: $[1] || ($[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(fe, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", s, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(me, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Me]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function l(x, $, N) {
        return $ in x ? Object.defineProperty(x, $, { value: N, enumerable: !0, configurable: !0, writable: !0 }) : x[$] = N, x;
      }
      function c(x, $) {
        var N = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var I = Object.getOwnPropertySymbols(x);
          $ && (I = I.filter(function(K) {
            return Object.getOwnPropertyDescriptor(x, K).enumerable;
          })), N.push.apply(N, I);
        }
        return N;
      }
      function f(x) {
        for (var $ = 1; $ < arguments.length; $++) {
          var N = arguments[$] != null ? arguments[$] : {};
          $ % 2 ? c(Object(N), !0).forEach(function(I) {
            l(x, I, N[I]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(N)) : c(Object(N)).forEach(function(I) {
            Object.defineProperty(x, I, Object.getOwnPropertyDescriptor(N, I));
          });
        }
        return x;
      }
      function g(x, $) {
        ($ == null || $ > x.length) && ($ = x.length);
        for (var N = 0, I = new Array($); N < $; N++) I[N] = x[N];
        return I;
      }
      function p(x) {
        if (Array.isArray(x)) return g(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function h(x, $) {
        if (x) {
          if (typeof x == "string") return g(x, $);
          var N = Object.prototype.toString.call(x).slice(8, -1);
          return N === "Object" && x.constructor && (N = x.constructor.name), N === "Map" || N === "Set" ? Array.from(x) : N === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(N) ? g(x, $) : void 0;
        }
      }
      function b() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function y(x) {
        return p(x) || v(x) || h(x) || b();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function w(x, $) {
        if (!(x instanceof $)) throw new TypeError("Cannot call a class as a function");
      }
      function E(x, $) {
        for (var N = 0; N < $.length; N++) {
          var I = $[N];
          I.enumerable = I.enumerable || !1, I.configurable = !0, "value" in I && (I.writable = !0), Object.defineProperty(x, I.key, I);
        }
      }
      function k(x, $, N) {
        return $ && E(x.prototype, $), x;
      }
      var _ = function() {
        function x() {
          w(this, x), this.listeners = {};
        }
        return k(x, [{ key: "on", value: function($, N) {
          var I = this, K = this.listeners[$];
          return K || (K = []), K.push(N), this.listeners[$] = K, function() {
            I.remove($, N);
          };
        } }, { key: "emit", value: function($) {
          var N = this.listeners[$];
          if (Array.isArray(N)) {
            for (var I = arguments.length, K = new Array(I > 1 ? I - 1 : 0), se = 1; se < I; se++) K[se - 1] = arguments[se];
            for (var fe = 0; fe < N.length; fe++) {
              var le = N[fe];
              typeof le == "function" && le.apply(void 0, K);
            }
          }
        } }, { key: "remove", value: function($, N) {
          if (N) {
            var I = this.listeners[$];
            if (!I) return;
            I = I.filter(function(K) {
              return K !== N;
            }), this.listeners[$] = I;
          } else this.listeners[$] = null, delete this.listeners[$];
        } }]), x;
      }(), m = new _(), j = { mounted: function(x, $, N) {
        var I = x.parentNode;
        x.onmousedown = function(K) {
          var se = K.clientX - I.offsetLeft, fe = K.clientY - I.offsetTop;
          document.onmousemove = function(le) {
            var me = le.clientX - se, Re = le.clientY - fe;
            I.style.left = me + "px", I.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              m.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(K) {
          var se = K.touches[0].pageX, fe = K.touches[0].pageY, le = se - I.offsetLeft, me = fe - I.offsetTop;
          document.ontouchmove = function(Re) {
            var Me = Re.touches[0].pageX, De = Re.touches[0].pageY, ze = Me - le, dt = De - me;
            I.style.left = ze + "px", I.style.top = dt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              m.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, O = j, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, U = { class: "key-board-result-show" }, F = { class: "key-board-result-show-container" }, X = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ae = T(function(x, $, N, I, K, se) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", U, [Object(t.createVNode)("div", F, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(fe, le) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: le, onClick: function(me) {
            return x.selectWord(fe);
          } }, Object(t.toDisplayString)(le + 1) + "." + Object(t.toDisplayString)(fe), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", X, [Object(t.createVNode)("span", { style: x.getStyle, onClick: $[1] || ($[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: $[2] || ($[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), G = (e("1276"), e("6062"), e("5319"), function(x, $) {
        for (var N = 0, I = []; N < x.length; ) I.push(x.slice(N, N += $));
        return I;
      }), W = Symbol("KEYBOARD_CONTEXT"), D = function(x) {
        Object(t.provide)(W, x);
      }, A = function() {
        return Object(t.inject)(W);
      }, L = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, $) {
        var N = $.emit, I = A(), K = Object(t.computed)(function() {
          return { borderTopColor: I == null ? void 0 : I.color };
        }), se = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function fe() {
          se.showIndex !== 0 && (se.showIndex -= 1);
        }
        function le() {
          se.showIndex !== se.showList.length - 1 && (se.showIndex += 1);
        }
        function me() {
          se.showIndex = 0, se.showList = [], se.valueList = [], m.emit("resultReset");
        }
        function Re(Me) {
          me(), N("change", Me);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Me) {
          var De;
          se.showIndex = 0, se.valueList = (Me == null || (De = Me.value) === null || De === void 0 ? void 0 : De.split("")) || [], se.valueList.length !== 0 ? se.showList = G(se.valueList, 11) : se.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          m.on("keyBoardChange", function(Me) {
            m.emit("updateBound"), se.status = Me, me();
          }), m.on("getWordsFromServer", function(Me) {
            var De = Array.from(new Set(Me.replace(/\s+/g, "").split("")));
            se.valueList = De, se.showList = G(De, 11);
          });
        }), Object(t.onUnmounted)(function() {
          m.remove("keyBoardChange"), m.remove("getWordsFromServer");
        }), f({ color: I == null ? void 0 : I.color, upper: fe, lower: le, getStyle: K, selectWord: Re }, Object(t.toRefs)(se));
      } });
      e("e66c"), L.render = ae, L.__scopeId = "data-v-02e63132";
      var Q = L, Z = e("bc3a"), M = e.n(Z), we = 15e3, pe = function(x) {
        M.a.defaults.baseURL = x, M.a.defaults.timeout = we, M.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ae(x, $, N, I, K, se) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Ne = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var $ = A(), N = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: $ == null ? void 0 : $.color, iconName: N };
      } });
      e("38cd"), Ne.render = Ae;
      var Ee = Ne, Oe = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Se = { class: "hand-write-board" }, Ve = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var He = Oe(function(x, $, N, I, K, se) {
        var fe = Object(t.resolveComponent)("PaintBoard"), le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Se, [Object(t.createVNode)(fe, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Ve, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(me) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: me.type, type: me.type, data: me.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), B = { class: "paint-board" };
      function R(x, $, N, I, K, se) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", B, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: $[1] || ($[1] = function() {
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
      function J(x, $, N, I, K, se, fe) {
        try {
          var le = x[se](fe), me = le.value;
        } catch (Re) {
          return void N(Re);
        }
        le.done ? $(me) : Promise.resolve(me).then(I, K);
      }
      function V(x) {
        return function() {
          var $ = this, N = arguments;
          return new Promise(function(I, K) {
            var se = x.apply($, N);
            function fe(me) {
              J(se, I, K, fe, le, "next", me);
            }
            function le(me) {
              J(se, I, K, fe, le, "throw", me);
            }
            fe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var ee, ie, ge = function() {
        var x = V(regeneratorRuntime.mark(function $(N, I, K, se) {
          return regeneratorRuntime.wrap(function(fe) {
            for (; ; ) switch (fe.prev = fe.next) {
              case 0:
                return fe.next = 2, M.a.post("", { lib: se, lpXis: N, lpYis: I, lpCis: K });
              case 2:
                return fe.abrupt("return", fe.sent);
              case 3:
              case "end":
                return fe.stop();
            }
          }, $);
        }));
        return function($, N, I, K) {
          return x.apply(this, arguments);
        };
      }(), H = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var $ = A(), N = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), I = Object(t.ref)(null);
        function K() {
          return se.apply(this, arguments);
        }
        function se() {
          return se = V(regeneratorRuntime.mark(function Ce() {
            var Ke, Fe;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, ge(N.clickX, N.clickY, N.clickC, x.lib);
                case 2:
                  Ke = Ye.sent, Fe = Ke.data, m.emit("getWordsFromServer", (Fe == null ? void 0 : Fe.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ce);
          })), se.apply(this, arguments);
        }
        function fe() {
          I.value && ee && (N.clickX = [], N.clickY = [], N.clickC = [], ee.clearRect(0, 0, N.width, N.height));
        }
        function le(Ce) {
          if (Ce.type.includes("mouse")) {
            var Ke = Ce;
            return Math.floor(Ke.clientX - N.x);
          }
          if (Ce.type.includes("touch")) {
            var Fe, Ye = Ce;
            return Math.floor(((Fe = Ye.targetTouches[0]) === null || Fe === void 0 ? void 0 : Fe.clientX) - N.x);
          }
          return 0;
        }
        function me(Ce) {
          if (Ce.type.includes("mouse")) {
            var Ke = Ce;
            return Math.floor(Ke.clientY - N.y);
          }
          if (Ce.type.includes("touch")) {
            var Fe, Ye = Ce;
            return Math.floor(((Fe = Ye.targetTouches[0]) === null || Fe === void 0 ? void 0 : Fe.clientY) - N.y);
          }
          return 0;
        }
        function Re(Ce) {
          if (ee) {
            N.isMouseDown = !0;
            var Ke = le(Ce), Fe = me(Ce);
            clearTimeout(ie), N.oldX = Ke, N.oldY = Fe, ee.beginPath();
          }
        }
        function Me(Ce) {
          if (ee && (Ce.preventDefault(), N.isMouseDown)) {
            var Ke = le(Ce), Fe = me(Ce);
            N.clickX.push(Ke), N.clickY.push(Fe), N.clickC.push(0), ee.strokeStyle = $ == null ? void 0 : $.color, ee.fillStyle = $ == null ? void 0 : $.color, ee.lineWidth = 4, ee.lineCap = "round", ee.moveTo(N.oldX, N.oldY), ee.lineTo(Ke, Fe), ee.stroke(), N.oldX = Ke, N.oldY = Fe;
          }
        }
        function De() {
          N.isMouseDown && (N.isMouseDown = !1, ie = setTimeout(function() {
            fe();
          }, 1500), N.clickC.pop(), N.clickC.push(1), K());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ce = document.querySelector(".paint-board").getBoundingClientRect();
              N.x = Ce.x, N.y = Ce.y, N.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), N.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function dt() {
          var Ce;
          ee = (Ce = I.value) === null || Ce === void 0 ? void 0 : Ce.getContext("2d"), fe(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          dt(), m.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), m.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(N)), {}, { move: Me, down: Re, mouseup: De, canvasRef: I });
      } });
      H.render = R;
      var P = H;
      function Y(x, $, N, I, K, se) {
        var fe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: $[1] || ($[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: $[2] || ($[2] = function(le) {
          return x.isHoverStatus = !0;
        }), onMouseleave: $[3] || ($[3] = function(le) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(fe, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ye = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Ee }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, $) {
        var N = $.emit, I = A(), K = Object(t.ref)(!1), se = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), fe = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || K.value ? { color: "#f5f5f5", background: I == null ? void 0 : I.color } : { color: I == null ? void 0 : I.color, background: "#f5f5f5" };
        });
        function le(me) {
          me.preventDefault(), N("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: K, getStyle: fe, getCode: se, click: le };
      } });
      e("de23"), ye.render = Y;
      var Be = ye, je = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: P, KeyCodeButton: Be }, setup: function(x, $) {
        var N = $.emit, I = A(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function se(fe) {
          var le = fe.data, me = fe.type;
          switch (me) {
            case "close":
              I == null || I.closeKeyBoard();
              break;
            case "back":
              I == null || I.changeDefaultBoard(), m.emit("resultReset"), m.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              N("trigger", { data: le, type: me });
              break;
          }
        }
        return f({ click: se }, Object(t.toRefs)(K));
      } });
      e("9aaf"), je.render = He, je.__scopeId = "data-v-1b5e0983";
      var We = je, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Xe = { class: "default-key-board" }, rt = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Ge(function(x, $, N, I, K, se) {
        var fe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Xe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(le, me) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(me + 1)], key: me }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(le, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(fe, { isUpper: x.isUpper, key: Re, type: Re, data: Re, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", rt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(le) {
          return Object(t.openBlock)(), Object(t.createBlock)(fe, { key: le.type, type: le.type, data: le.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ue = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), de = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, ve = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], oe = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Be }, emits: ["translate", "trigger", "change"], setup: function(x, $) {
        var N = $.emit, I = A(), K = Object(t.reactive)({ lineList: [de.line1, de.line2, de.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function se() {
          var le;
          K.line4 = JSON.parse(JSON.stringify(q)), I != null && (le = I.modeList) !== null && le !== void 0 && le.find(function(me) {
            return me === "handwrite";
          }) && I !== null && I !== void 0 && I.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function fe(le) {
          var me = le.data, Re = le.type;
          switch (Re) {
            case "close":
              K.oldVal = "", I == null || I.closeKeyBoard();
              break;
            case "upper":
              K.oldVal = "", K.isUpper = !K.isUpper;
              break;
            case "change2lang":
              K.isCn = !K.isCn, K.isNum || K.isSymbol || m.emit("keyBoardChange", K.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (K.isNum = !K.isNum, K.isSymbol = !1, K.isNum) {
                var Me;
                m.emit("keyBoardChange", "number");
                var De = JSON.parse(JSON.stringify(ve.line3));
                I != null && (Me = I.modeList) !== null && Me !== void 0 && Me.find(function(ze) {
                  return ze === "symbol";
                }) || (De.shift(), De.unshift("+")), K.lineList = [ve.line1, ve.line2, De];
              } else m.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [de.line1, de.line2, de.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (m.emit("keyBoardChange", "symbol"), K.lineList = [ue.line1, ue.line2, ue.line3]) : (m.emit("keyBoardChange", "number"), K.lineList = [ve.line1, ve.line2, ve.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && Re === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), N("translate", K.oldVal)) : (Re === "handwrite" && m.emit("keyBoardChange", "handwrite"), N("trigger", { data: me, type: Re }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? N("change", me) : (N("translate", K.oldVal + me), K.oldVal = K.oldVal + me);
              break;
          }
        }
        return se(), Object(t.onMounted)(function() {
          m.on("resultReset", function() {
            K.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(K)), {}, { click: fe });
      } });
      e("f8b0"), oe.render = z, oe.__scopeId = "data-v-4b78e5a1";
      var ce = oe, he = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, $e = e("ec57"), qe = function(x) {
        return x.keys().map(x);
      };
      qe($e);
      var Ze = [], xe = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: O }, components: { Result: Q, SvgIcon: Ee, HandBoard: We, DefaultBoard: ce }, setup: function(x, $) {
        var N = $.emit, I = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function se(ke) {
          var _e, Te;
          switch (Object(t.nextTick)(function() {
            m.emit("keyBoardChange", "CN");
          }), ke) {
            case "en":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Le;
                (Le = K.value) === null || Le === void 0 || Le.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Le;
                (Le = K.value) === null || Le === void 0 || Le.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (_e = x.modeList) !== null && _e !== void 0 && _e.find(function(Le) {
                return Le === "handwrite";
              }) && x.handApi ? (I.showMode = "handwrite", Object(t.nextTick)(function() {
                m.emit("keyBoardChange", "handwrite");
              })) : I.showMode = "default";
              break;
            case "symbol":
              I.showMode = "default", (Te = x.modeList) !== null && Te !== void 0 && Te.find(function(Le) {
                return Le === "symbol";
              }) && Object(t.nextTick)(function() {
                var Le, tt;
                (Le = K.value) === null || Le === void 0 || Le.click({ data: ".?123", type: "change2num" }), (tt = K.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              I.showMode = "default";
              break;
          }
        }
        function fe(ke) {
          if (I.visible = !0, xe = ke.target, se(xe.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var _e = document.querySelector(".key-board-modal");
            _e.style.display = "block";
          }
        }
        function le() {
          if (xe && xe.blur(), xe = null, I.visible = !1, N("closed"), I.showMode = "default", I.resultVal = {}, document.querySelector(".key-board-modal")) {
            var ke = document.querySelector(".key-board-modal");
            ke.style.display = "none";
          }
        }
        function me() {
          x.closeOnClickModal && le(), N("modalClick");
        }
        function Re() {
          var ke;
          if (document.querySelector(".key-board-modal")) {
            var _e;
            (_e = document.querySelector(".key-board-modal")) === null || _e === void 0 || _e.addEventListener("click", me);
          } else {
            var Te = document.createElement("div");
            Te.className = "key-board-modal", Te.style.display = "none", (ke = document.querySelector("body")) === null || ke === void 0 || ke.appendChild(Te), Te.addEventListener("click", me);
          }
        }
        function Me() {
          x.handApi && pe(x.handApi), [].concat(y(document.querySelectorAll("input")), y(document.querySelectorAll("textarea"))).forEach(function(ke) {
            ke.getAttribute("data-mode") !== null && (Ze.push(ke), ke.addEventListener("focus", fe), x.blurHide && ke.addEventListener("blur", le));
          });
        }
        function De(ke) {
          if (!xe) return "";
          var _e = xe, Te = _e.selectionStart, Le = _e.selectionEnd;
          if (!Te || !Le) return "";
          var tt = ke.substring(0, Te - 1) + ke.substring(Le);
          return _e.value = tt, _e.focus(), _e.selectionStart = Te - 1, _e.selectionEnd = Te - 1, tt;
        }
        function ze(ke) {
          var _e = ke.type;
          switch (_e) {
            case "handwrite":
              I.showMode = "handwrite";
              break;
            case "delete":
              if (!xe) return;
              var Te = De(xe.value);
              xe.value = Te, N("change", Te, xe.getAttribute("data-prop") || xe);
              break;
          }
        }
        function dt(ke, _e) {
          if (!xe) return "";
          var Te = xe, Le = Te.selectionStart || 0, tt = Te.selectionEnd || 0, xt = ke.substring(0, Le) + _e + ke.substring(tt);
          return Te.value = xt, Te.focus(), Te.selectionStart = Le + _e.length, Te.selectionEnd = Le + _e.length, xt;
        }
        function Ce(ke) {
          if (xe) {
            var _e = dt(xe.value, ke);
            xe.value = _e, N("change", _e, xe.getAttribute("data-prop") || xe), N("keyChange", ke, xe.getAttribute("data-prop") || xe);
          }
        }
        function Ke(ke) {
          var _e = new RegExp("^".concat(ke, "\\w*")), Te = Object.keys(he).filter(function(Le) {
            return _e.test(Le);
          }).sort();
          I.resultVal = { code: ke, value: ke ? Te.length > 1 ? Te.reduce(function(Le, tt) {
            return Le + he[tt];
          }, "") : he[Te[0]] : "" }, xe && N("keyChange", ke, xe.getAttribute("data-prop") || xe);
        }
        function Fe() {
          Me();
        }
        function Ye() {
          return xe;
        }
        return Object(t.onMounted)(function() {
          x.modal && Re(), Me(), m.on("resultReset", function() {
            I.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var ke;
          (ke = document.querySelector(".key-board-modal")) === null || ke === void 0 || ke.removeEventListener("click", me), Ze.forEach(function(_e) {
            _e.removeEventListener("focus", fe), _e.removeEventListener("blur", le);
          });
        }), D(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          le();
        }, changeDefaultBoard: function() {
          I.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(I)), {}, { defaultBoardRef: K, getCurrentInput: Ye, translate: Ke, reSignUp: Fe, trigger: ze, change: Ce });
      } });
      et.render = i;
      var Qe = et;
      Qe.install = function(x) {
        x.component(Qe.name, Qe);
      };
      var mt = Qe, Lt = mt;
      d.default = Lt;
    }, fb6a: function(a, d, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), s = e("fc6a"), i = e("8418"), l = e("b622"), c = e("1dde"), f = c("slice"), g = l("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(h, b) {
        var y, w, E, k = s(this), _ = u(k.length), m = t(h, _), j = t(b === void 0 ? _ : b, _);
        if (o(k) && (y = k.constructor, typeof y != "function" || y !== Array && !o(y.prototype) ? r(y) && (y = y[g], y === null && (y = void 0)) : y = void 0, y === Array || y === void 0)) return p.call(k, m, j);
        for (w = new (y === void 0 ? Array : y)(v(j - m, 0)), E = 0; m < j; m++, E++) m in k && i(w, E, k[m]);
        return w.length = E, w;
      } });
    }, fc6a: function(a, d, e) {
      var n = e("44ad"), r = e("1d80");
      a.exports = function(o) {
        return n(r(o));
      };
    }, fdbc: function(a, d) {
      a.exports = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
    }, fdbf: function(a, d, e) {
      var n = e("4930");
      a.exports = n && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }, fea9: function(a, d, e) {
      var n = e("da84");
      a.exports = n.Promise;
    } });
  });
})(Tt);
var ur = Tt.exports;
const At = /* @__PURE__ */ ar(ur);
It({
  components: { KeyBoard: At },
  setup() {
    function be(ne, re) {
      console.log("change value ---->", ne), console.log("change input dom ---->", re);
    }
    return {
      change: be
    };
  }
});
const sr = { class: "wifi-component" }, cr = { class: "row" }, lr = { class: "column" }, dr = { class: "column" }, fr = { class: "status" }, pr = { class: "row" }, vr = { class: "column" }, hr = {
  __name: "WiFi",
  setup(be) {
    const ne = te("未连接"), re = te(""), a = te(""), d = () => {
      alert("验证 WiFi: " + re.value);
    }, e = () => {
      alert("连接到 WiFi: " + re.value), ne.value = "已连接到 " + re.value;
    }, n = (r, o) => {
      o.placeholder === "WiFi 名称" ? re.value = r : o.placeholder === "WiFi 密码" && (a.value = r);
    };
    return (r, o) => (Pe(), Ie("div", sr, [
      C("div", cr, [
        C("div", lr, [
          pt(C("input", {
            "onUpdate:modelValue": o[0] || (o[0] = (t) => re.value = t),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, re.value]
          ])
        ]),
        C("div", dr, [
          C("div", fr, " WiFi 状态: " + Ue(ne.value), 1)
        ])
      ]),
      C("div", pr, [
        C("div", vr, [
          pt(C("input", {
            "onUpdate:modelValue": o[1] || (o[1] = (t) => a.value = t),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, a.value]
          ])
        ]),
        C("div", { class: "column" }, [
          C("div", { class: "button-group" }, [
            C("button", { onClick: d }, "验证 WiFi"),
            C("button", { onClick: e }, "连接 WiFi")
          ])
        ])
      ]),
      Je(Nt(At), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: n,
        class: "scaled-keyboard"
      })
    ]));
  }
}, mr = /* @__PURE__ */ it(hr, [["__scopeId", "data-v-38505ad0"]]), gr = {
  key: 0,
  class: "numeric-keyboard"
}, yr = { class: "keyboard" }, br = { class: "current-value" }, wr = ["onClick"], xr = {
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
  setup(be, { emit: ne }) {
    const re = be, a = ne, d = te([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = te("");
    ot(() => re.showKeyboard, (r) => {
      r && (e.value = re.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", e.value), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (Pe(), Ie("div", gr, [
      C("div", yr, [
        C("div", br, Ue(e.value), 1),
        (Pe(!0), Ie(ut, null, st(d.value, (t) => (Pe(), Ie("div", {
          key: t.join(),
          class: "row"
        }, [
          (Pe(!0), Ie(ut, null, st(t, (u) => (Pe(), Ie("button", {
            key: u,
            onClick: (s) => n(u),
            class: at({ "function-key": u === "清除" || u === "确定" })
          }, Ue(u), 11, wr))), 128))
        ]))), 128))
      ])
    ])) : ct("", !0);
  }
}, kt = /* @__PURE__ */ it(xr, [["__scopeId", "data-v-2ccc1cb7"]]), kr = { class: "container" }, Sr = { class: "column" }, _r = { class: "status-bar" }, Or = ["disabled"], jr = { class: "column" }, Er = {
  key: 0,
  class: "modal"
}, Cr = { class: "modal-content" }, Tr = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(be, { emit: ne }) {
    const { sendToPyQt: re } = nt(), a = ht({
      isPyQtWebEngine: !1
    }), d = te("未激活"), e = te(0), n = te(""), r = te(""), o = te(!1), t = te(60);
    let u, s;
    const i = te(0), l = te(1), c = te(null), f = te(!1), g = te(!1), p = ft(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${l.value} 次锁定 - 剩余时间: ${v.value}`), v = ft(() => {
      const G = Math.floor(e.value / 86400), W = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), D = Math.floor(e.value % (60 * 60) / 60), A = e.value % 60;
      return `${G}天 ${W.toString().padStart(2, "0")}:${D.toString().padStart(2, "0")}:${A.toString().padStart(2, "0")}`;
    }), h = ft(() => d.value === "未激活" ? "按住以激活设备" : n.value);
    function b(G) {
      d.value === "未激活" && (G.target.setPointerCapture(G.pointerId), i.value = 0, s = setInterval(() => {
        i.value += 2, i.value >= 100 && (clearInterval(s), E());
      }, 30));
    }
    function y(G) {
      G.target.releasePointerCapture(G.pointerId), w();
    }
    function w() {
      clearInterval(s), i.value = 0;
    }
    function E() {
      re("activate_device", {});
    }
    function k(G, W) {
      re("Lock_set_response", { method: "activateDevice", args: { randomCode: G, time: W } }), d.value = "已激活", n.value = G, c.value = W, _();
    }
    function _() {
      m(), u = setInterval(() => {
        e.value > 0 ? m() : j();
      }, 1e3);
    }
    function m() {
      const G = Date.now(), W = c.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((W - G) / 1e3));
    }
    function j() {
      o.value = !0, clearInterval(u), ae();
    }
    function O() {
      T(r.value);
    }
    function T(G) {
      re("check_lock_password", {
        target: "attemptUnlock",
        password: G,
        lockCount: l.value,
        deviceRandomCode: n.value
      }), r.value = "";
    }
    function S() {
      d.value = "永久激活", o.value = !1, clearInterval(u);
    }
    function U() {
      o.value = !1, l.value++, u && clearInterval(u), _();
    }
    St(() => {
      clearInterval(u), clearInterval(s);
    }), lt(() => {
      if (a.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, a.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: G } = nt();
        ot(G, (W) => {
          if (W && W.type === "confirm_lock_password")
            try {
              const D = JSON.parse(W.content);
              D.target === "attemptUnlock" && (D.result === "success" ? (o.value ? c.value = Date.now() : c.value = c.value + t.value * 1e3, re("update_baseTime", c.value), U(), re("Lock_set_response", { method: "extendLockTime", args: { baseTime: c.value } })) : D.result === "forever_success" ? (S(), re("Lock_set_response", { method: "permanentUnlock", args: {} })) : re("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (D) {
              console.error("Failed to parse confirm lock password :", D);
            }
          else if (W && W.type === "device_activated")
            try {
              const D = JSON.parse(W.content);
              k(D.device_random_code, D.device_base_time);
            } catch (D) {
              console.error("Failed to parse device activation result:", D);
            }
          else if (W && W.type === "device_info")
            try {
              const D = JSON.parse(W.content);
              d.value = D.device_status, n.value = D.device_random_code, l.value = D.device_lock_count, c.value = D.device_base_time, D.device_status === "已激活" ? _() : D.device_status === "永久激活" && S();
            } catch (D) {
              console.error("Failed to parse device status:", D);
            }
          else if (W && W.type === "Lock_init")
            F();
          else if (W && W.type === "Lock_set") {
            console.log("Lock_set:", W.content);
            const D = JSON.parse(W.content);
            D.method === "requestActivation" ? E() : D.method === "attemptUnlock" && T(D.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const F = () => {
      const G = {
        deviceStatus: d.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: r.value,
        isLocked: o.value,
        lockInterval: t.value,
        lockCount: l.value,
        baseTime: c.value,
        progressWidth: i.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: g.value
      };
      console.log("Sending Lock initial state:", G), re("Lock_init_response", G);
    }, X = ne, ae = () => {
      X("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (G, W) => (Pe(), Ie("div", kr, [
      C("div", Sr, [
        C("div", _r, Ue(p.value), 1),
        C("button", {
          class: "activation-button",
          onPointerdown: b,
          onPointerup: y,
          onPointercancel: w,
          onPointerleave: w,
          disabled: d.value !== "未激活"
        }, [
          wt(Ue(h.value) + " ", 1),
          C("div", {
            class: "progress-bar",
            style: _t({ width: i.value + "%" })
          }, null, 4)
        ], 40, Or)
      ]),
      C("div", jr, [
        pt(C("input", {
          "onUpdate:modelValue": W[0] || (W[0] = (D) => r.value = D),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: W[1] || (W[1] = (D) => f.value = !0)
        }, null, 544), [
          [vt, r.value]
        ]),
        C("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      o.value ? (Pe(), Ie("div", Er, [
        C("div", Cr, [
          W[8] || (W[8] = C("h3", null, "设备已锁定", -1)),
          C("h3", null, "第 " + Ue(l.value) + " 次锁定", 1),
          C("h3", null, "设备随机码: " + Ue(n.value), 1),
          pt(C("input", {
            "onUpdate:modelValue": W[2] || (W[2] = (D) => r.value = D),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: W[3] || (W[3] = (D) => g.value = !0)
          }, null, 544), [
            [vt, r.value]
          ]),
          C("button", {
            class: "unlock-button",
            onClick: O
          }, "解锁")
        ])
      ])) : ct("", !0),
      Je(kt, {
        modelValue: r.value,
        "onUpdate:modelValue": W[4] || (W[4] = (D) => r.value = D),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": W[5] || (W[5] = (D) => f.value = D)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Je(kt, {
        modelValue: r.value,
        "onUpdate:modelValue": W[6] || (W[6] = (D) => r.value = D),
        showKeyboard: g.value,
        "onUpdate:showKeyboard": W[7] || (W[7] = (D) => g.value = D)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Ar = /* @__PURE__ */ it(Tr, [["__scopeId", "data-v-db2d397c"]]), Lr = { class: "app-container" }, Ir = {
  __name: "App",
  setup(be) {
    Rt();
    const ne = te(""), re = (a) => {
      ne.value = a;
    };
    return (a, d) => (Pe(), Ie("div", Lr, [
      d[0] || (d[0] = C("h1", null, "涪特智能养护台车控制系统", -1)),
      Je(yn),
      Je(or),
      Je(on),
      Je(Wn, { message: ne.value }, null, 8, ["message"]),
      Je(mr),
      Je(Ar, { onMessageFromA: re })
    ]));
  }
};
export {
  Ir as default
};
