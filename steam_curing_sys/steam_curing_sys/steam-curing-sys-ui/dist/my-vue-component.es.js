import Pt, { ref as oe, onMounted as st, provide as mt, readonly as yt, inject as bt, watch as at, openBlock as Ie, createElementBlock as Ne, createElementVNode as A, toDisplayString as Fe, Fragment as ut, renderList as ct, normalizeClass as it, createCommentVNode as ft, reactive as ht, createVNode as Xe, onUnmounted as St, computed as dt, createTextVNode as wt, normalizeStyle as _t, defineComponent as It, withDirectives as pt, vModelText as vt, unref as Nt } from "vue";
const Ot = Symbol(), jt = Symbol(), Et = Symbol();
function Bt(be, ne) {
  be && be.messageSignal ? be.messageSignal.connect((te) => {
    try {
      const a = JSON.parse(te);
      ne.value = a, console.log("Received message from PyQt:", a);
    } catch (a) {
      console.error("Failed to parse message:", a), ne.value = { type: "unknown", content: te };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const be = oe(null), ne = oe(null), te = oe("");
  function a() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (f) => {
      be.value = f, ne.value = f.objects.bridge, console.log("QWebChannel initialized", f, f.objects.bridge), Bt(ne.value, te), ne.value && typeof ne.value.vueReady == "function" ? ne.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  st(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? a() : document.addEventListener("DOMContentLoaded", a);
  }), mt(Ot, yt(be)), mt(jt, yt(ne)), mt(Et, yt(te));
}
function rt() {
  const be = bt(Ot), ne = bt(jt), te = bt(Et);
  return (!be || !ne || !te) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: be,
    bridge: ne,
    message: te,
    sendToPyQt: (f, e) => {
      if (console.log(`Attempting to call ${f} with args:`, e), ne && ne.value)
        if (typeof ne.value.sendToPyQt == "function")
          try {
            ne.value.sendToPyQt(f, JSON.stringify(e));
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
const ot = (be, ne) => {
  const te = be.__vccOpts || be;
  for (const [a, f] of ne)
    te[a] = f;
  return te;
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
  setup(be, { emit: ne }) {
    const te = be, a = ne, f = oe([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = oe("");
    at(() => te.showKeyboard, (r) => {
      r && (e.value = te.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (Ie(), Ne("div", Mt, [
      A("div", Ut, [
        A("div", $t, Fe(e.value), 1),
        (Ie(!0), Ne(ut, null, ct(f.value, (t) => (Ie(), Ne("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ie(!0), Ne(ut, null, ct(t, (u) => (Ie(), Ne("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, Fe(u), 11, Ft))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, Ct = /* @__PURE__ */ ot(Dt, [["__scopeId", "data-v-541feda2"]]), Vt = { class: "settings-container" }, Wt = { class: "setting-group" }, qt = { class: "setting-item" }, zt = { class: "setting-controls" }, Kt = ["value"], Qt = { class: "setting-item" }, Ht = { class: "setting-controls" }, Gt = ["value"], Yt = { class: "setting-group" }, Xt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Zt = ["value"], en = { class: "setting-item" }, tn = { class: "setting-controls" }, nn = ["value"], rn = {
  __name: "SensorSettings",
  setup(be) {
    const { sendToPyQt: ne } = rt(), te = ht({
      isPyQtWebEngine: !1
    }), a = oe(30), f = oe(10), e = oe(80), n = oe(20), r = oe(!1), o = oe(null), t = oe("");
    st(() => {
      if (te.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, te.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: m } = rt();
        at(m, (p) => {
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
            const g = JSON.parse(p.content).args;
            a.value = g.temp_upper, f.value = g.temp_lower, e.value = g.humidity_upper, n.value = g.humidity_lower, s();
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
        console.log("设置已更新:", m), te.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ne("updateLimitSettings", m)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (m) => {
      o.value = m, r.value = !0, t.value = m.startsWith("temp") ? m === "tempUpper" ? a.value : f.value : m === "humidityUpper" ? e.value : n.value;
    }, d = (m) => {
      const p = parseFloat(m);
      isNaN(p) || (o.value === "tempUpper" ? (a.value = p, c("upper")) : o.value === "tempLower" ? (f.value = p, c("lower")) : o.value === "humidityUpper" ? (e.value = p, i("upper")) : o.value === "humidityLower" && (n.value = p, i("lower"))), o.value = null;
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
              value: a.value,
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
    const ne = oe({ temperature: {}, humidity: {} }), { sendToPyQt: te } = rt();
    st(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: f } = rt();
        at(f, (e) => {
          if (e && e.type === "update_sensor_data")
            try {
              ne.value = JSON.parse(e.content);
            } catch (n) {
              console.error("Failed to parse sensor data:", n);
            }
          else e && e.type === "get_sensor_data" && te("update_remote_sensor_data", ne.value);
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
        ne.value = e;
      } catch (f) {
        console.error("Error fetching sensor data:", f);
      }
    };
    return (f, e) => (Ie(), Ne("div", an, [
      A("div", un, [
        e[0] || (e[0] = A("h2", null, "温度传感器", -1)),
        A("div", cn, [
          A("div", sn, [
            (Ie(!0), Ne(ut, null, ct(ne.value.temperature, (n, r) => (Ie(), Ne("div", {
              key: r,
              class: "sensor-card"
            }, [
              A("div", ln, Fe(r), 1),
              A("div", fn, Fe(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      A("div", dn, [
        e[1] || (e[1] = A("h2", null, "湿度传感器", -1)),
        A("div", pn, [
          A("div", vn, [
            (Ie(!0), Ne(ut, null, ct(ne.value.humidity, (n, r) => (Ie(), Ne("div", {
              key: r,
              class: "sensor-card"
            }, [
              A("div", hn, Fe(r), 1),
              A("div", gn, Fe(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ ot(mn, [["__scopeId", "data-v-4d55ddc2"]]), bn = { class: "integrated-control-system" }, wn = { class: "mode-controls" }, xn = ["disabled"], kn = ["disabled"], Sn = { class: "systems-container" }, _n = { class: "steam-engine-control" }, On = { class: "control-panel" }, jn = { class: "engine-status" }, En = { class: "engine left" }, Cn = ["disabled"], Tn = { class: "engine right" }, Ln = ["disabled"], An = { class: "sprinkler-system" }, Pn = { class: "controls" }, In = { class: "input-group" }, Nn = ["value"], Bn = { class: "input-group" }, Rn = ["value"], Mn = { class: "input-group" }, Un = ["value"], $n = { class: "visualization" }, Fn = ["onClick"], Dn = { class: "status" }, Vn = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(be) {
    const ne = oe(!1), te = oe(!1), a = oe(5), f = oe(2), e = oe(10), n = oe(a.value), r = oe(f.value), o = oe(e.value), t = oe(a.value), u = oe(f.value), c = oe(e.value), i = oe(0), s = oe(""), l = oe(Array(12).fill(0)), d = oe(0), m = oe(!0), p = oe(!1), v = oe(!1), g = oe(null), b = oe(""), y = oe(!1), j = oe(15), E = oe(""), x = oe(""), S = oe(0), { sendToPyQt: h } = rt(), O = oe(0), _ = ht({
      isPyQtWebEngine: !1
    }), C = oe([]);
    let k, $, F;
    const J = be;
    at(() => J.message, (H) => {
      H != null && H.content && (m.value ? L("manual") : L("auto"));
    }), st(() => {
      if (_.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, _.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = rt();
        at(H, (P) => {
          if (P && P.type === "update_left_steam_status")
            ne.value = P.content;
          else if (P && P.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), W();
          else if (P && P.type === "update_right_steam_status")
            te.value = P.content;
          else if (P && P.type === "update_sprinkler_settings")
            try {
              const Y = JSON.parse(P.content);
              t.value = Y.sprinkler_single_run_time, u.value = Y.sprinkler_run_interval_time, c.value = Y.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, console.log("Sprinkler Settings updated:", Y);
            } catch (Y) {
              console.error("Failed to parse sprinkler settings data:", Y);
            }
          else if (P && P.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", P.content);
            const ye = JSON.parse(P.content).args;
            t.value = ye.sprinkler_single_run_time, u.value = ye.sprinkler_run_interval_time, c.value = ye.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = c.value, Ee();
          } else if (P && P.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", P.content);
            const Y = JSON.parse(P.content);
            Y.method === "startSystem" ? Oe() : Y.method === "stopSystem" ? Se() : Y.method === "setMode" ? L(Y.args.mode) : Y.method === "click_toggleEngine" ? Z() : Y.method === "toggleManualSprinkler" && me(Y.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), St(() => {
      clearInterval(F), clearInterval($), G();
    });
    const ae = (H) => {
      H !== void 0 && clearTimeout(H);
    }, G = () => {
      C.value.forEach((H) => {
        ae(H);
      }), C.value = [];
    }, W = () => {
      const H = {
        leftEngineOn: ne.value,
        rightEngineOn: te.value,
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
        isSwitching: y.value,
        switchingTime: j.value,
        switchingMessage: E.value,
        switchPhase: x.value,
        phaseStartTime: O.value,
        chose_n: S.value
      };
      h("IntegratedControlSystem_init_response", H);
    }, D = dt(() => y.value ? `${E.value}，还需${j.value}秒` : m.value ? p.value ? s.value === "run" ? `喷头 ${i.value} 正在运行，剩余 ${d.value + 1} 秒` : s.value === "interval" ? `运行间隔中，剩余 ${d.value + 1} 秒` : s.value === "loop" ? `循环间隔中，剩余 ${d.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    async function T(H, P) {
      return x.value = P, y.value = !0, j.value = 15, O.value = Date.now(), E.value = H ? "正在切换到喷淋管" : "正在切换到喷雾机", h("controlSprinkler", { target: "switchToSprinkler", state: H }), F = setInterval(() => {
        j.value--, j.value <= 0 && (clearInterval(F), y.value = !1);
      }, 1e3), new Promise((Y) => {
        k = setTimeout(() => {
          y.value = !1, Y();
        }, j.value * 1e3), C.value.push(k);
      });
    }
    async function L(H) {
      const P = m.value;
      if (m.value = H === "auto", P !== m.value)
        if (_.isPyQtWebEngine && (h("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: H } }), h("controlSprinkler", { target: "setMode", mode: m.value ? "auto" : "manual" })), m.value) {
          clearInterval(F), G(), y.value = !1, ne.value && await Q();
          const Y = l.value.findIndex((ye) => ye === 100);
          Y !== -1 && (l.value[Y] = 0, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: Y + 1, state: 0 })), h("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await Se();
    }
    async function Q() {
      _.isPyQtWebEngine && (h("setEngineState", { engine: "left", state: !ne.value }), h("setEngineState", { engine: "right", state: !te.value }), ne.value = !ne.value, te.value = !te.value);
    }
    async function Z() {
      const H = l.value.findIndex((P) => P === 100);
      _.isPyQtWebEngine && H === -1 && (h("IntegratedControlSystem_set_response", { method: "click_toggleEngine", args: {} }), ne.value ? h("controlSprinkler", { target: "tankWork", state: 0 }) : (await T(0, "click_toggleEngine"), h("controlSprinkler", { target: "tankWork", state: 1 })), h("setEngineState", { engine: "left", state: !ne.value }), h("setEngineState", { engine: "right", state: !te.value }), ne.value = !ne.value, te.value = !te.value);
    }
    function U(H) {
      g.value = H, v.value = !0, b.value = H === "singleRunTime" ? t.value.toString() : H === "runIntervalTime" ? u.value.toString() : c.value.toString();
    }
    function we(H) {
      const P = parseInt(H);
      isNaN(P) || (g.value === "singleRunTime" ? (t.value = P, pe()) : g.value === "runIntervalTime" ? (u.value = P, Le()) : g.value === "loopInterval" && (c.value = P, Pe())), g.value = null;
    }
    function pe() {
      t.value = Math.max(1, t.value), n.value = t.value, Ee();
    }
    function Le() {
      u.value = Math.max(0, u.value), r.value = u.value, Ee();
    }
    function Pe() {
      c.value = Math.max(0, c.value), o.value = c.value, Ee();
    }
    function Ee() {
      if (_.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const H = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        h("controlSprinkler", { target: "settings", settings: JSON.stringify(H) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function Oe() {
      h("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(p.value || !m.value) && (p.value = !0, l.value = Array(12).fill(0), await He());
    }
    async function Se() {
      h("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), _.isPyQtWebEngine && (i.value > 0 && h("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), h("controlSprinkler", { target: "setState", state: !1 })), ne.value && await Q(), Ve(), h("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function Ve() {
      p.value = !1, y.value = !1, clearInterval(F), clearInterval($), G(), i.value = 0, s.value = "", l.value = Array(12).fill(0), d.value = 0;
    }
    async function He() {
      await T(1, "runCycle"), i.value = 1, h("controlSprinkler", { target: "tankWork", state: 1 }), X();
    }
    async function B() {
      i.value = 1, X();
    }
    function R() {
      !p.value || !m.value || (d.value--, d.value > 0 && (k = setTimeout(R, 1e3), C.value.push(k)));
    }
    function X() {
      if (!p.value || !m.value) return;
      s.value = "run", a.value = n.value, d.value = a.value, O.value = Date.now(), R();
      let H = Date.now();
      h("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 1 }), $ = setInterval(() => {
        let P = Date.now() - H, Y = Math.min(P / (a.value * 1e3), 1);
        l.value[i.value - 1] = Y * 100;
      }, 100), k = setTimeout(async () => {
        clearInterval($), i.value < 12 ? (l.value[i.value - 1] = 0, h("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), V()) : (l.value[i.value - 1] = 0, h("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), ee());
      }, a.value * 1e3), C.value.push(k);
    }
    function V() {
      !p.value || !m.value || (f.value = r.value, d.value = f.value, O.value = Date.now(), d.value > 0 && (s.value = "interval"), R(), k = setTimeout(() => {
        i.value++, X();
      }, f.value * 1e3), C.value.push(k));
    }
    async function ee() {
      !p.value || !m.value || (e.value = o.value, d.value = e.value, d.value > 0 ? (h("controlSprinkler", { target: "tankWork", state: 0 }), await T(0, "runLoopInterval"), h("controlSprinkler", { target: "setState", state: !0 }), O.value = Date.now(), s.value = "loop", R(), i.value = 0, k = setTimeout(async () => {
        l.value = Array(12).fill(0), h("controlSprinkler", { target: "setState", state: !1 }), ne.value && await Q(), h("controlSprinkler", { target: "tankWork", state: 0 }), await He();
      }, e.value * 1e3), C.value.push(k)) : (i.value = 0, l.value = Array(12).fill(0), await B()));
    }
    function ie(H) {
      return l.value[H - 1];
    }
    async function me(H) {
      if (m.value) return;
      h("IntegratedControlSystem_set_response", { method: "toggleManualSprinkler", args: { n: H } });
      const P = l.value.findIndex((Y) => Y === 100);
      l.value[H - 1] > 0 ? (l.value[H - 1] = 0, _.isPyQtWebEngine && (h("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 0 }), h("controlSprinkler", { target: "tankWork", state: 0 }))) : P !== -1 ? (l.value[P] = 0, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: P + 1, state: 0 }), l.value[H - 1] = 100, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 1 })) : (S.value = H, await T(1, "toggleManualSprinkler"), h("controlSprinkler", { target: "tankWork", state: 1 }), l.value[H - 1] = 100, _.isPyQtWebEngine && h("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 1 }));
    }
    return (H, P) => (Ie(), Ne("div", bn, [
      P[15] || (P[15] = A("h2", null, "集成控制系统", -1)),
      A("div", wn, [
        A("button", {
          onClick: P[0] || (P[0] = (Y) => L("auto")),
          class: it([{ active: m.value }, "mode-btn"])
        }, "自动模式", 2),
        A("button", {
          onClick: P[1] || (P[1] = (Y) => L("manual")),
          class: it([{ active: !m.value }, "mode-btn"])
        }, "手动模式", 2),
        A("button", {
          onClick: Oe,
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
          P[10] || (P[10] = A("h3", null, "雾化机控制系统", -1)),
          A("div", On, [
            A("div", jn, [
              A("div", En, [
                P[7] || (P[7] = A("h4", null, "左雾化机", -1)),
                A("div", {
                  class: it(["status", { on: ne.value }])
                }, [
                  P[6] || (P[6] = A("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + Fe(ne.value ? "开" : "关"), 1)
                ], 2),
                A("button", {
                  onClick: Z,
                  disabled: m.value || y.value,
                  class: "control-btn"
                }, Fe(ne.value ? "关闭" : "开启"), 9, Cn)
              ]),
              A("div", Tn, [
                P[9] || (P[9] = A("h4", null, "右雾化机", -1)),
                A("div", {
                  class: it(["status", { on: te.value }])
                }, [
                  P[8] || (P[8] = A("div", { class: "status-indicator" }, null, -1)),
                  wt(" " + Fe(te.value ? "开" : "关"), 1)
                ], 2),
                A("button", {
                  onClick: Z,
                  disabled: m.value || y.value,
                  class: "control-btn"
                }, Fe(te.value ? "关闭" : "开启"), 9, Ln)
              ])
            ])
          ])
        ]),
        A("div", An, [
          P[14] || (P[14] = A("h3", null, "喷淋系统", -1)),
          A("div", Pn, [
            A("div", In, [
              P[11] || (P[11] = A("label", null, "单次运行时间 (秒):", -1)),
              A("input", {
                type: "text",
                value: t.value,
                onFocus: P[2] || (P[2] = (Y) => U("singleRunTime")),
                readonly: ""
              }, null, 40, Nn)
            ]),
            A("div", Bn, [
              P[12] || (P[12] = A("label", null, "运行时间间隔 (秒):", -1)),
              A("input", {
                type: "text",
                value: u.value,
                onFocus: P[3] || (P[3] = (Y) => U("runIntervalTime")),
                readonly: ""
              }, null, 40, Rn)
            ]),
            A("div", Mn, [
              P[13] || (P[13] = A("label", null, "循环时间间隔 (秒):", -1)),
              A("input", {
                type: "text",
                value: c.value,
                onFocus: P[4] || (P[4] = (Y) => U("loopInterval")),
                readonly: ""
              }, null, 40, Un)
            ])
          ]),
          A("div", $n, [
            (Ie(), Ne(ut, null, ct(12, (Y) => A("div", {
              key: Y,
              class: it(["sprinkler", { active: m.value ? i.value === Y : l.value[Y - 1] > 0 }]),
              onClick: (ye) => !y.value && !m.value && !ne.value && me(Y)
            }, [
              A("div", {
                class: "water",
                style: _t({ height: ie(Y) + "%" })
              }, null, 4),
              A("span", null, Fe(Y), 1)
            ], 10, Fn)), 64))
          ]),
          A("div", Dn, Fe(D.value), 1)
        ])
      ]),
      Xe(Ct, {
        modelValue: b.value,
        showKeyboard: v.value,
        "onUpdate:modelValue": we,
        "onUpdate:showKeyboard": P[5] || (P[5] = (Y) => v.value = Y)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Wn = /* @__PURE__ */ ot(Vn, [["__scopeId", "data-v-b82898d6"]]), qn = { class: "data-actions" }, zn = {
  key: 0,
  class: "modal-overlay"
}, Kn = {
  key: 1,
  class: "modal-overlay"
}, Qn = { class: "modal-content" }, Hn = {
  __name: "DataExport",
  setup(be) {
    const { sendToPyQt: ne } = rt(), te = ht({
      isPyQtWebEngine: !1
    }), a = oe(!1), f = oe(!1), e = oe("");
    st(() => {
      te.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, te.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const n = () => {
      te.isPyQtWebEngine && (console.log("导出数据"), ne("exportData", !0));
    }, r = () => {
      a.value = !0;
    }, o = () => {
      a.value = !1;
    }, t = () => {
      console.log("清空数据"), a.value = !1, u("所有数据已清空！"), te.isPyQtWebEngine && ne("exportData", !1);
    }, u = (i) => {
      e.value = i, f.value = !0;
    }, c = () => {
      f.value = !1;
    };
    return (i, s) => (Ie(), Ne("div", qn, [
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
      a.value ? (Ie(), Ne("div", zn, [
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
          A("p", null, Fe(e.value), 1),
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
(function(be, ne) {
  (function(te, a) {
    be.exports = a(Pt);
  })(typeof self < "u" ? self : Yn, function(te) {
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
        var p = s + c.length, v = l.length, g = u;
        return d !== void 0 && (d = n(d), g = t), o.call(m, g, function(b, y) {
          var j;
          switch (y.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return i.slice(0, s);
            case "'":
              return i.slice(p);
            case "<":
              j = d[y.slice(1, -1)];
              break;
            default:
              var E = +y;
              if (E === 0) return b;
              if (E > v) {
                var x = r(E / 10);
                return x === 0 ? b : x <= v ? l[x - 1] === void 0 ? y.charAt(1) : l[x - 1] + y.charAt(1) : b;
              }
              j = l[E - 1];
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
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), c = e("8aa5"), i = e("50c4"), s = e("14c3"), l = e("9263"), d = e("d039"), m = [].push, p = Math.min, v = 4294967295, g = !d(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(b, y, j) {
        var E;
        return E = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(x, S) {
          var h = String(t(this)), O = S === void 0 ? v : S >>> 0;
          if (O === 0) return [];
          if (x === void 0) return [h];
          if (!r(x)) return y.call(h, x, O);
          for (var _, C, k, $ = [], F = (x.ignoreCase ? "i" : "") + (x.multiline ? "m" : "") + (x.unicode ? "u" : "") + (x.sticky ? "y" : ""), J = 0, ae = new RegExp(x.source, F + "g"); (_ = l.call(ae, h)) && (C = ae.lastIndex, !(C > J && ($.push(h.slice(J, _.index)), _.length > 1 && _.index < h.length && m.apply($, _.slice(1)), k = _[0].length, J = C, $.length >= O))); )
            ae.lastIndex === _.index && ae.lastIndex++;
          return J === h.length ? !k && ae.test("") || $.push("") : $.push(h.slice(J)), $.length > O ? $.slice(0, O) : $;
        } : "0".split(void 0, 0).length ? function(x, S) {
          return x === void 0 && S === 0 ? [] : y.call(this, x, S);
        } : y, [function(x, S) {
          var h = t(this), O = x == null ? void 0 : x[b];
          return O !== void 0 ? O.call(x, h, S) : E.call(String(h), x, S);
        }, function(x, S) {
          var h = j(E, x, this, S, E !== y);
          if (h.done) return h.value;
          var O = o(x), _ = String(this), C = u(O, RegExp), k = O.unicode, $ = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (g ? "y" : "g"), F = new C(g ? O : "^(?:" + O.source + ")", $), J = S === void 0 ? v : S >>> 0;
          if (J === 0) return [];
          if (_.length === 0) return s(F, _) === null ? [_] : [];
          for (var ae = 0, G = 0, W = []; G < _.length; ) {
            F.lastIndex = g ? G : 0;
            var D, T = s(F, g ? _ : _.slice(G));
            if (T === null || (D = p(i(F.lastIndex + (g ? 0 : G)), _.length)) === ae) G = c(_, G, k);
            else {
              if (W.push(_.slice(ae, G)), W.length === J) return W;
              for (var L = 1; L <= T.length - 1; L++) if (W.push(T[L]), W.length === J) return W;
              G = ae = D;
            }
          }
          return W.push(_.slice(ae)), W;
        }];
      }, !g);
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
          function r(B, R) {
            return R = { exports: {} }, B(R, R.exports), R.exports;
          }
          var o = r(function(B, R) {
            (function(X, V) {
              B.exports = V();
            })(0, function() {
              function X(P) {
                var Y = P && typeof P == "object";
                return Y && Object.prototype.toString.call(P) !== "[object RegExp]" && Object.prototype.toString.call(P) !== "[object Date]";
              }
              function V(P) {
                return Array.isArray(P) ? [] : {};
              }
              function ee(P, Y) {
                var ye = Y && Y.clone === !0;
                return ye && X(P) ? H(V(P), P, Y) : P;
              }
              function ie(P, Y, ye) {
                var Be = P.slice();
                return Y.forEach(function(je, We) {
                  typeof Be[We] > "u" ? Be[We] = ee(je, ye) : X(je) ? Be[We] = H(P[We], je, ye) : P.indexOf(je) === -1 && Be.push(ee(je, ye));
                }), Be;
              }
              function me(P, Y, ye) {
                var Be = {};
                return X(P) && Object.keys(P).forEach(function(je) {
                  Be[je] = ee(P[je], ye);
                }), Object.keys(Y).forEach(function(je) {
                  X(Y[je]) && P[je] ? Be[je] = H(P[je], Y[je], ye) : Be[je] = ee(Y[je], ye);
                }), Be;
              }
              function H(P, Y, ye) {
                var Be = Array.isArray(Y), je = ye || { arrayMerge: ie }, We = je.arrayMerge || ie;
                return Be ? Array.isArray(P) ? We(P, Y, ye) : ee(Y, ye) : me(P, Y, ye);
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
            return B = B || /* @__PURE__ */ Object.create(null), { on: function(R, X) {
              (B[R] || (B[R] = [])).push(X);
            }, off: function(R, X) {
              B[R] && B[R].splice(B[R].indexOf(X) >>> 0, 1);
            }, emit: function(R, X) {
              (B[R] || []).map(function(V) {
                V(X);
              }), (B["*"] || []).map(function(V) {
                V(R, X);
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
          }, i = u.svg, s = u.xlink, l = {};
          l[i.name] = i.uri, l[s.name] = s.uri;
          var d, m = function(B, R) {
            B === void 0 && (B = "");
            var X = o(l, R || {}), V = c(X);
            return "<svg " + V + ">" + B + "</svg>";
          }, p = u.svg, v = u.xlink, g = { attrs: (d = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, d[p.name] = p.uri, d[v.name] = v.uri, d) }, b = function(B) {
            this.config = o(g, B || {}), this.symbols = [];
          };
          b.prototype.add = function(B) {
            var R = this, X = R.symbols, V = this.find(B.id);
            return V ? (X[X.indexOf(V)] = B, !1) : (X.push(B), !0);
          }, b.prototype.remove = function(B) {
            var R = this, X = R.symbols, V = this.find(B);
            return !!V && (X.splice(X.indexOf(V), 1), V.destroy(), !0);
          }, b.prototype.find = function(B) {
            return this.symbols.filter(function(R) {
              return R.id === B;
            })[0] || null;
          }, b.prototype.has = function(B) {
            return this.find(B) !== null;
          }, b.prototype.stringify = function() {
            var B = this.config, R = B.attrs, X = this.symbols.map(function(V) {
              return V.stringify();
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
            var R = B.id, X = B.viewBox, V = B.content;
            this.id = R, this.viewBox = X, this.content = V;
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
              return j(m(V)).childNodes[0];
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(R.prototype, X), R;
          }(y), x = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, S = function(B) {
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
              R.$on("$locationChangeSuccess", function(X, V, ee) {
                O(B, { oldUrl: ee, newUrl: V });
              });
            }]);
          }, $ = "linearGradient, radialGradient, pattern, mask, clipPath", F = function(B, R) {
            return R === void 0 && (R = $), S(B.querySelectorAll("symbol")).forEach(function(X) {
              S(X.querySelectorAll(R)).forEach(function(V) {
                X.parentNode.insertBefore(V, X);
              });
            }), B;
          };
          function J(B, R) {
            var X = S(B).reduce(function(V, ee) {
              if (!ee.attributes) return V;
              var ie = S(ee.attributes), me = R ? ie.filter(R) : ie;
              return V.concat(me);
            }, []);
            return X;
          }
          var ae = u.xlink.uri, G = "xlink:href", W = /[{}|\\\^\[\]`"<>]/g;
          function D(B) {
            return B.replace(W, function(R) {
              return "%" + R[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function T(B) {
            return B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function L(B, R, X) {
            return S(B).forEach(function(V) {
              var ee = V.getAttribute(G);
              if (ee && ee.indexOf(R) === 0) {
                var ie = ee.replace(R, X);
                V.setAttributeNS(ae, G, ie);
              }
            }), B;
          }
          var Q, Z = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], U = Z.map(function(B) {
            return "[" + B + "]";
          }).join(","), we = function(B, R, X, V) {
            var ee = D(X), ie = D(V), me = B.querySelectorAll(U), H = J(me, function(P) {
              var Y = P.localName, ye = P.value;
              return Z.indexOf(Y) !== -1 && ye.indexOf("url(" + ee) !== -1;
            });
            H.forEach(function(P) {
              return P.value = P.value.replace(new RegExp(T(ee), "g"), ie);
            }), L(R, ee, ie);
          }, pe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Le = function(B) {
            function R(V) {
              var ee = this;
              V === void 0 && (V = {}), B.call(this, o(x, V));
              var ie = t();
              this._emitter = ie, this.node = null;
              var me = this, H = me.config;
              if (H.autoConfigure && this._autoConfigure(V), H.syncUrlsWithBaseTag) {
                var P = document.getElementsByTagName("base")[0].getAttribute("href");
                ie.on(pe.MOUNT, function() {
                  return ee.updateUrls("#", P);
                });
              }
              var Y = this._handleLocationChange.bind(this);
              this._handleLocationChange = Y, H.listenLocationChangeEvent && window.addEventListener(H.locationChangeEvent, Y), H.locationChangeAngularEmitter && k(H.locationChangeEvent), ie.on(pe.MOUNT, function(ye) {
                H.moveGradientsOutsideSymbol && F(ye);
              }), ie.on(pe.SYMBOL_MOUNT, function(ye) {
                H.moveGradientsOutsideSymbol && F(ye.parentNode), (h.isIE() || h.isEdge()) && _(ye);
              });
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, R.prototype._autoConfigure = function(V) {
              var ee = this, ie = ee.config;
              typeof V.syncUrlsWithBaseTag > "u" && (ie.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof V.locationChangeAngularEmitter > "u" && (ie.locationChangeAngularEmitter = typeof window.angular < "u"), typeof V.moveGradientsOutsideSymbol > "u" && (ie.moveGradientsOutsideSymbol = h.isFirefox());
            }, R.prototype._handleLocationChange = function(V) {
              var ee = V.detail, ie = ee.oldUrl, me = ee.newUrl;
              this.updateUrls(ie, me);
            }, R.prototype.add = function(V) {
              var ee = this, ie = B.prototype.add.call(this, V);
              return this.isMounted && ie && (V.mount(ee.node), this._emitter.emit(pe.SYMBOL_MOUNT, V.node)), ie;
            }, R.prototype.attach = function(V) {
              var ee = this, ie = this;
              if (ie.isMounted) return ie.node;
              var me = typeof V == "string" ? document.querySelector(V) : V;
              return ie.node = me, this.symbols.forEach(function(H) {
                H.mount(ie.node), ee._emitter.emit(pe.SYMBOL_MOUNT, H.node);
              }), S(me.querySelectorAll("symbol")).forEach(function(H) {
                var P = E.createFromExistingNode(H);
                P.node = H, ie.add(P);
              }), this._emitter.emit(pe.MOUNT, me), me;
            }, R.prototype.destroy = function() {
              var V = this, ee = V.config, ie = V.symbols, me = V._emitter;
              ie.forEach(function(H) {
                return H.destroy();
              }), me.off("*"), window.removeEventListener(ee.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, R.prototype.mount = function(V, ee) {
              V === void 0 && (V = this.config.mountTo), ee === void 0 && (ee = !1);
              var ie = this;
              if (ie.isMounted) return ie.node;
              var me = typeof V == "string" ? document.querySelector(V) : V, H = ie.render();
              return this.node = H, ee && me.childNodes[0] ? me.insertBefore(H, me.childNodes[0]) : me.appendChild(H), this._emitter.emit(pe.MOUNT, H), H;
            }, R.prototype.render = function() {
              return j(this.stringify());
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, R.prototype.updateUrls = function(V, ee) {
              if (!this.isMounted) return !1;
              var ie = document.querySelectorAll(this.config.usagesToUpdate);
              return we(this.node, ie, C(V) + "#", C(ee) + "#"), !0;
            }, Object.defineProperties(R.prototype, X), R;
          }(b), Pe = r(function(B) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(R, X) {
              B.exports = X();
            })(0, function() {
              var R, X = [], V = document, ee = V.documentElement.doScroll, ie = "DOMContentLoaded", me = (ee ? /^loaded|^c/ : /^loaded|^i|^c/).test(V.readyState);
              return me || V.addEventListener(ie, R = function() {
                for (V.removeEventListener(ie, R), me = 1; R = X.shift(); ) R();
              }), function(H) {
                me ? setTimeout(H, 0) : X.push(H);
              };
            });
          }), Ee = "__SVG_SPRITE_NODE__", Oe = "__SVG_SPRITE__", Se = !!window[Oe];
          Se ? Q = window[Oe] : (Q = new Le({ attrs: { id: Ee, "aria-hidden": "true" } }), window[Oe] = Q);
          var Ve = function() {
            var B = document.getElementById(Ee);
            B ? Q.attach(B) : Q.mount(document.body, !0);
          };
          document.body ? Ve() : Pe(Ve);
          var He = Q;
          return He;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(a, f, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), c = e("2a62"), i = function(s, l) {
        this.stopped = s, this.result = l;
      };
      a.exports = function(s, l, d) {
        var m, p, v, g, b, y, j, E = d && d.that, x = !(!d || !d.AS_ENTRIES), S = !(!d || !d.IS_ITERATOR), h = !(!d || !d.INTERRUPTED), O = t(l, E, 1 + x + h), _ = function(k) {
          return m && c(m), new i(!0, k);
        }, C = function(k) {
          return x ? (n(k), h ? O(k[0], k[1], _) : O(k[0], k[1])) : h ? O(k, _) : O(k);
        };
        if (S) m = s;
        else {
          if (p = u(s), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, g = o(s.length); g > v; v++) if (b = C(s[v]), b && b instanceof i) return b;
            return new i(!1);
          }
          m = p.call(s);
        }
        for (y = m.next; !(j = y.call(m)).done; ) {
          try {
            b = C(j.value);
          } catch (k) {
            throw c(m), k;
          }
          if (typeof b == "object" && b && b instanceof i) return b;
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
        var d, m, p, v, g, b, y = s.target, j = s.global, E = s.stat;
        if (m = j ? n : E ? n[y] || u(y, {}) : (n[y] || {}).prototype, m) for (p in l) {
          if (g = l[p], s.noTargetGet ? (b = r(m, p), v = b && b.value) : v = m[p], d = i(j ? p : y + (E ? "." : "#") + p, s.forced), !d && v !== void 0) {
            if (typeof g == typeof v) continue;
            c(g, v);
          }
          (s.sham || v && v.sham) && o(g, "sham", !0), t(m, p, g, s);
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
      var n, r, o, t = e("da84"), u = e("d039"), c = e("0366"), i = e("1be4"), s = e("cc12"), l = e("1cdc"), d = e("605d"), m = t.location, p = t.setImmediate, v = t.clearImmediate, g = t.process, b = t.MessageChannel, y = t.Dispatch, j = 0, E = {}, x = "onreadystatechange", S = function(C) {
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
        for (var k = [], $ = 1; arguments.length > $; ) k.push(arguments[$++]);
        return E[++j] = function() {
          (typeof C == "function" ? C : Function(C)).apply(void 0, k);
        }, n(j), j;
      }, v = function(C) {
        delete E[C];
      }, d ? n = function(C) {
        g.nextTick(h(C));
      } : y && y.now ? n = function(C) {
        y.now(h(C));
      } : b && !l ? (r = new b(), o = r.port2, r.port1.onmessage = O, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && m && m.protocol !== "file:" && !u(_) ? (n = _, t.addEventListener("message", O, !1)) : n = x in s("script") ? function(C) {
        i.appendChild(s("script"))[x] = function() {
          i.removeChild(this), S(C);
        };
      } : function(C) {
        setTimeout(h(C), 0);
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
          var g = p.unicode;
          p.lastIndex = 0;
          for (var b, y = [], j = 0; (b = c(p, v)) !== null; ) {
            var E = String(b[0]);
            y[j] = E, E === "" && (p.lastIndex = u(v, o(p.lastIndex), g)), j++;
          }
          return j === 0 ? null : y;
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
        function l(v, g) {
          return n.isPlainObject(v) && n.isPlainObject(g) ? n.merge(v, g) : n.isPlainObject(g) ? n.merge({}, g) : n.isArray(g) ? g.slice() : g;
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
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, c = e("241c").f, i = e("44e7"), s = e("ad6d"), l = e("9f7f"), d = e("6eeb"), m = e("d039"), p = e("69f3").set, v = e("2626"), g = e("b622"), b = g("match"), y = r.RegExp, j = y.prototype, E = /a/g, x = /a/g, S = new y(E) !== E, h = l.UNSUPPORTED_Y, O = n && o("RegExp", !S || h || m(function() {
        return x[b] = !1, y(E) != E || y(x) == x || y(E, "i") != "/a/i";
      }));
      if (O) {
        for (var _ = function(F, J) {
          var ae, G = this instanceof _, W = i(F), D = J === void 0;
          if (!G && W && F.constructor === _ && D) return F;
          S ? W && !D && (F = F.source) : F instanceof _ && (D && (J = s.call(F)), F = F.source), h && (ae = !!J && J.indexOf("y") > -1, ae && (J = J.replace(/y/g, "")));
          var T = t(S ? new y(F, J) : y(F, J), G ? this : j, _);
          return h && ae && p(T, { sticky: ae }), T;
        }, C = function(F) {
          F in _ || u(_, F, { configurable: !0, get: function() {
            return y[F];
          }, set: function(J) {
            y[F] = J;
          } });
        }, k = c(y), $ = 0; k.length > $; ) C(k[$++]);
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
        var l, d, m, p, v, g, b = r(s), y = typeof this == "function" ? this : Array, j = arguments.length, E = j > 1 ? arguments[1] : void 0, x = E !== void 0, S = i(b), h = 0;
        if (x && (E = n(E, j > 2 ? arguments[2] : void 0, 2)), S == null || y == Array && t(S)) for (l = u(b.length), d = new y(l); l > h; h++) g = x ? E(b[h], h) : b[h], c(d, h, g);
        else for (p = S.call(b), v = p.next, d = new y(); !(m = v.call(p)).done; h++) g = x ? o(p, E, [m.value, h], !0) : m.value, c(d, h, g);
        return d.length = h, d;
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
      n("replace", 2, function(p, v, g, b) {
        var y = b.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, j = b.REPLACE_KEEPS_$0, E = y ? "$" : "$0";
        return [function(x, S) {
          var h = u(this), O = x == null ? void 0 : x[p];
          return O !== void 0 ? O.call(x, h, S) : v.call(String(h), x, S);
        }, function(x, S) {
          if (!y && j || typeof S == "string" && S.indexOf(E) === -1) {
            var h = g(v, x, this, S);
            if (h.done) return h.value;
          }
          var O = r(x), _ = String(this), C = typeof S == "function";
          C || (S = String(S));
          var k = O.global;
          if (k) {
            var $ = O.unicode;
            O.lastIndex = 0;
          }
          for (var F = []; ; ) {
            var J = s(O, _);
            if (J === null || (F.push(J), !k)) break;
            var ae = String(J[0]);
            ae === "" && (O.lastIndex = c(_, o(O.lastIndex), $));
          }
          for (var G = "", W = 0, D = 0; D < F.length; D++) {
            J = F[D];
            for (var T = String(J[0]), L = l(d(t(J.index), _.length), 0), Q = [], Z = 1; Z < J.length; Z++) Q.push(m(J[Z]));
            var U = J.groups;
            if (C) {
              var we = [T].concat(Q, L, _);
              U !== void 0 && we.push(U);
              var pe = String(S.apply(void 0, we));
            } else pe = i(T, _, L, Q, U, S);
            L >= W && (G += _.slice(W, L) + pe, W = L + T.length);
          }
          return G + _.slice(W);
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
          var g = n.navigator.appVersion.match(/iphone/gi), b = n.devicePixelRatio;
          i = g ? b >= 3 && (!i || i >= 3) ? 3 : b >= 2 && (!i || i >= 2) ? 2 : 1 : 1, s = 1 / i;
        }
        if (t.setAttribute("data-dpr", i), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + s + ", maximum-scale=" + s + ", minimum-scale=" + s + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var y = o.createElement("div");
          y.appendChild(u), o.write(y.innerHTML);
        }
        function j() {
          var E = t.getBoundingClientRect().width, x = E / 10;
          t.style.fontSize = x + "px", l.rem = n.rem = x;
        }
        n.addEventListener("resize", function() {
          j();
        }, !1), n.addEventListener("pageshow", function(E) {
          E.persisted && j();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * i + "px" : o.addEventListener("DOMContentLoaded", function(E) {
          o.body.style.fontSize = 10 * i + "px";
        }, !1), j(), l.dpr = n.dpr = i, l.refreshRem = j, l.rem2px = function(E) {
          var x = parseFloat(E) * this.rem;
          return typeof E == "string" && E.match(/rem$/) && (x += "px"), x;
        }, l.px2rem = function(E) {
          var x = parseFloat(E) / this.rem;
          return typeof E == "string" && E.match(/px$/) && (x += "rem"), x;
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
      a.exports = { getConstructor: function(g, b, y, j) {
        var E = g(function(O, _) {
          u(O, E, b), p(O, { type: b, index: r(null), first: void 0, last: void 0, size: 0 }), l || (O.size = 0), _ != null && c(_, O[j], { that: O, AS_ENTRIES: y });
        }), x = v(b), S = function(O, _, C) {
          var k, $, F = x(O), J = h(O, _);
          return J ? J.value = C : (F.last = J = { index: $ = d(_, !0), key: _, value: C, previous: k = F.last, next: void 0, removed: !1 }, F.first || (F.first = J), k && (k.next = J), l ? F.size++ : O.size++, $ !== "F" && (F.index[$] = J)), O;
        }, h = function(O, _) {
          var C, k = x(O), $ = d(_);
          if ($ !== "F") return k.index[$];
          for (C = k.first; C; C = C.next) if (C.key == _) return C;
        };
        return o(E.prototype, { clear: function() {
          for (var O = this, _ = x(O), C = _.index, k = _.first; k; ) k.removed = !0, k.previous && (k.previous = k.previous.next = void 0), delete C[k.index], k = k.next;
          _.first = _.last = void 0, l ? _.size = 0 : O.size = 0;
        }, delete: function(O) {
          var _ = this, C = x(_), k = h(_, O);
          if (k) {
            var $ = k.next, F = k.previous;
            delete C.index[k.index], k.removed = !0, F && (F.next = $), $ && ($.previous = F), C.first == k && (C.first = $), C.last == k && (C.last = F), l ? C.size-- : _.size--;
          }
          return !!k;
        }, forEach: function(O) {
          for (var _, C = x(this), k = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); _ = _ ? _.next : C.first; )
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
          return x(this).size;
        } }), E;
      }, setStrong: function(g, b, y) {
        var j = b + " Iterator", E = v(b), x = v(j);
        i(g, b, function(S, h) {
          p(this, { type: j, target: S, state: E(S), kind: h, last: void 0 });
        }, function() {
          for (var S = x(this), h = S.kind, O = S.last; O && O.removed; ) O = O.previous;
          return S.target && (S.last = O = O ? O.next : S.state.first) ? h == "keys" ? { value: O.key, done: !1 } : h == "values" ? { value: O.value, done: !1 } : { value: [O.key, O.value], done: !1 } : (S.target = void 0, { value: void 0, done: !0 });
        }, y ? "entries" : "values", !y, !0), s(b);
      } };
    }, "65f0": function(a, f, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      a.exports = function(u, c) {
        var i;
        return r(u) && (i = u.constructor, typeof i != "function" || i !== Array && !r(i.prototype) ? n(i) && (i = i[t], i === null && (i = void 0)) : i = void 0), new (i === void 0 ? Array : i)(c === 0 ? 0 : c);
      };
    }, "69f3": function(a, f, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), c = e("861d"), i = e("9112"), s = e("5135"), l = e("c6cd"), d = e("f772"), m = e("d012"), p = u.WeakMap, v = function(S) {
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
        var x = d("state");
        m[x] = !0, n = function(S, h) {
          return h.facade = S, i(S, x, h), h;
        }, r = function(S) {
          return s(S, x) ? S[x] : {};
        }, o = function(S) {
          return s(S, x);
        };
      }
      a.exports = { set: n, get: r, has: o, enforce: v, getterFor: g };
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
      a.exports = function(v, g, b) {
        var y = v.indexOf("Map") !== -1, j = v.indexOf("Weak") !== -1, E = y ? "set" : "add", x = r[v], S = x && x.prototype, h = x, O = {}, _ = function(G) {
          var W = S[G];
          t(S, G, G == "add" ? function(D) {
            return W.call(this, D === 0 ? 0 : D), this;
          } : G == "delete" ? function(D) {
            return !(j && !s(D)) && W.call(this, D === 0 ? 0 : D);
          } : G == "get" ? function(D) {
            return j && !s(D) ? void 0 : W.call(this, D === 0 ? 0 : D);
          } : G == "has" ? function(D) {
            return !(j && !s(D)) && W.call(this, D === 0 ? 0 : D);
          } : function(D, T) {
            return W.call(this, D === 0 ? 0 : D, T), this;
          });
        }, C = o(v, typeof x != "function" || !(j || S.forEach && !l(function() {
          new x().entries().next();
        })));
        if (C) h = b.getConstructor(g, v, y, E), u.REQUIRED = !0;
        else if (o(v, !0)) {
          var k = new h(), $ = k[E](j ? {} : -0, 1) != k, F = l(function() {
            k.has(1);
          }), J = d(function(G) {
            new x(G);
          }), ae = !j && l(function() {
            for (var G = new x(), W = 5; W--; ) G[E](W, W);
            return !G.has(-0);
          });
          J || (h = g(function(G, W) {
            i(G, h, v);
            var D = p(new x(), G, h);
            return W != null && c(W, D[E], { that: D, AS_ENTRIES: y }), D;
          }), h.prototype = S, S.constructor = h), (F || ae) && (_("delete"), _("has"), y && _("get")), (ae || $) && _(E), j && S.clear && delete S.clear;
        }
        return O[v] = h, n({ global: !0, forced: h != x }, O), m(h, v), j || b.setStrong(h, v, y), h;
      };
    }, "6eeb": function(a, f, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), c = e("69f3"), i = c.get, s = c.enforce, l = String(String).split("String");
      (a.exports = function(d, m, p, v) {
        var g, b = !!v && !!v.unsafe, y = !!v && !!v.enumerable, j = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof m != "string" || o(p, "name") || r(p, "name", m), g = s(p), g.source || (g.source = l.join(typeof m == "string" ? m : ""))), d !== n ? (b ? !j && d[m] && (y = !0) : delete d[m], y ? d[m] = p : r(d, m, p)) : y ? d[m] = p : t(m, p);
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
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), c = e("1be4"), i = e("cc12"), s = e("f772"), l = ">", d = "<", m = "prototype", p = "script", v = s("IE_PROTO"), g = function() {
      }, b = function(x) {
        return d + p + l + x + d + "/" + p + l;
      }, y = function(x) {
        x.write(b("")), x.close();
        var S = x.parentWindow.Object;
        return x = null, S;
      }, j = function() {
        var x, S = i("iframe"), h = "java" + p + ":";
        return S.style.display = "none", c.appendChild(S), S.src = String(h), x = S.contentWindow.document, x.open(), x.write(b("document.F=Object")), x.close(), x.F;
      }, E = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        E = n ? y(n) : j();
        for (var x = t.length; x--; ) delete E[m][t[x]];
        return E();
      };
      u[v] = !0, a.exports = Object.create || function(x, S) {
        var h;
        return x !== null ? (g[m] = r(x), h = new g(), g[m] = null, h[v] = x) : h = E(), S === void 0 ? h : o(h, S);
      };
    }, "7db0": function(a, f, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(a, f, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), c = e("9112"), i = e("6eeb"), s = e("b622"), l = e("c430"), d = e("3f8c"), m = e("ae93"), p = m.IteratorPrototype, v = m.BUGGY_SAFARI_ITERATORS, g = s("iterator"), b = "keys", y = "values", j = "entries", E = function() {
        return this;
      };
      a.exports = function(x, S, h, O, _, C, k) {
        r(h, S, O);
        var $, F, J, ae = function(Z) {
          if (Z === _ && L) return L;
          if (!v && Z in D) return D[Z];
          switch (Z) {
            case b:
              return function() {
                return new h(this, Z);
              };
            case y:
              return function() {
                return new h(this, Z);
              };
            case j:
              return function() {
                return new h(this, Z);
              };
          }
          return function() {
            return new h(this);
          };
        }, G = S + " Iterator", W = !1, D = x.prototype, T = D[g] || D["@@iterator"] || _ && D[_], L = !v && T || ae(_), Q = S == "Array" && D.entries || T;
        if (Q && ($ = o(Q.call(new x())), p !== Object.prototype && $.next && (l || o($) === p || (t ? t($, p) : typeof $[g] != "function" && c($, g, E)), u($, G, !0, !0), l && (d[G] = E))), _ == y && T && T.name !== y && (W = !0, L = function() {
          return T.call(this);
        }), l && !k || D[g] === L || c(D, g, L), d[S] = L, _) if (F = { values: ae(y), keys: C ? L : ae(b), entries: ae(j) }, k) for (J in F) (v || W || !(J in D)) && i(D, J, F[J]);
        else n({ target: S, proto: !0, forced: v || W }, F);
        return F;
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
            var c, i, s, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, d = /@([^@]*):(\d+):(\d+)\s*$/gi, m = l.exec(j.stack) || d.exec(j.stack), p = m && m[1] || !1, v = m && m[2] || !1, g = document.location.href.replace(document.location.hash, ""), b = document.getElementsByTagName("script");
            p === g && (c = document.documentElement.outerHTML, i = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), s = c.replace(i, "$1").trim());
            for (var y = 0; y < b.length; y++)
              if (b[y].readyState === "interactive" || b[y].src === p || p === g && b[y].innerHTML && b[y].innerHTML.trim() === s) return b[y];
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
      a.exports = te;
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
        var m, p, v, g, b = this, y = i && b.sticky, j = n.call(b), E = b.source, x = 0, S = d;
        return y && (j = j.replace("y", ""), j.indexOf("g") === -1 && (j += "g"), S = String(d).slice(b.lastIndex), b.lastIndex > 0 && (!b.multiline || b.multiline && d[b.lastIndex - 1] !== `
`) && (E = "(?: " + E + ")", S = " " + S, x++), p = new RegExp("^(?:" + E + ")", j)), s && (p = new RegExp("^" + E + "$(?!\\s)", j)), c && (m = b.lastIndex), v = o.call(y ? p : b, S), y ? v ? (v.input = v.input.slice(x), v[0] = v[0].slice(x), v.index = b.lastIndex, b.lastIndex += v[0].length) : b.lastIndex = 0 : c && v && (b.lastIndex = b.global ? v.index + v[0].length : m), s && v && v.length > 1 && t.call(v[0], p, function() {
          for (g = 1; g < arguments.length - 2; g++) arguments[g] === void 0 && (v[g] = void 0);
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
          var d = "suspendedStart", m = "suspendedYield", p = "executing", v = "completed", g = {}, b = {};
          b[u] = function() {
            return this;
          };
          var y = Object.getPrototypeOf, j = y && y(y(W([])));
          j && j !== r && o.call(j, u) && (b = j);
          var E = _.prototype = h.prototype = Object.create(b);
          O.prototype = E.constructor = _, _.constructor = O, _[i] = O.displayName = "GeneratorFunction", l.isGeneratorFunction = function(T) {
            var L = typeof T == "function" && T.constructor;
            return !!L && (L === O || (L.displayName || L.name) === "GeneratorFunction");
          }, l.mark = function(T) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(T, _) : (T.__proto__ = _, i in T || (T[i] = "GeneratorFunction")), T.prototype = Object.create(E), T;
          }, l.awrap = function(T) {
            return { __await: T };
          }, C(k.prototype), k.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = k, l.async = function(T, L, Q, Z) {
            var U = new k(x(T, L, Q, Z));
            return l.isGeneratorFunction(L) ? U : U.next().then(function(we) {
              return we.done ? we.value : U.next();
            });
          }, C(E), E[i] = "Generator", E[u] = function() {
            return this;
          }, E.toString = function() {
            return "[object Generator]";
          }, l.keys = function(T) {
            var L = [];
            for (var Q in T) L.push(Q);
            return L.reverse(), function Z() {
              for (; L.length; ) {
                var U = L.pop();
                if (U in T) return Z.value = U, Z.done = !1, Z;
              }
              return Z.done = !0, Z;
            };
          }, l.values = W, G.prototype = { constructor: G, reset: function(T) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ae), !T) for (var L in this) L.charAt(0) === "t" && o.call(this, L) && !isNaN(+L.slice(1)) && (this[L] = n);
          }, stop: function() {
            this.done = !0;
            var T = this.tryEntries[0], L = T.completion;
            if (L.type === "throw") throw L.arg;
            return this.rval;
          }, dispatchException: function(T) {
            if (this.done) throw T;
            var L = this;
            function Q(Pe, Ee) {
              return we.type = "throw", we.arg = T, L.next = Pe, Ee && (L.method = "next", L.arg = n), !!Ee;
            }
            for (var Z = this.tryEntries.length - 1; Z >= 0; --Z) {
              var U = this.tryEntries[Z], we = U.completion;
              if (U.tryLoc === "root") return Q("end");
              if (U.tryLoc <= this.prev) {
                var pe = o.call(U, "catchLoc"), Le = o.call(U, "finallyLoc");
                if (pe && Le) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                } else if (pe) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                } else {
                  if (!Le) throw new Error("try statement without catch or finally");
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                }
              }
            }
          }, abrupt: function(T, L) {
            for (var Q = this.tryEntries.length - 1; Q >= 0; --Q) {
              var Z = this.tryEntries[Q];
              if (Z.tryLoc <= this.prev && o.call(Z, "finallyLoc") && this.prev < Z.finallyLoc) {
                var U = Z;
                break;
              }
            }
            U && (T === "break" || T === "continue") && U.tryLoc <= L && L <= U.finallyLoc && (U = null);
            var we = U ? U.completion : {};
            return we.type = T, we.arg = L, U ? (this.method = "next", this.next = U.finallyLoc, g) : this.complete(we);
          }, complete: function(T, L) {
            if (T.type === "throw") throw T.arg;
            return T.type === "break" || T.type === "continue" ? this.next = T.arg : T.type === "return" ? (this.rval = this.arg = T.arg, this.method = "return", this.next = "end") : T.type === "normal" && L && (this.next = L), g;
          }, finish: function(T) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var Q = this.tryEntries[L];
              if (Q.finallyLoc === T) return this.complete(Q.completion, Q.afterLoc), ae(Q), g;
            }
          }, catch: function(T) {
            for (var L = this.tryEntries.length - 1; L >= 0; --L) {
              var Q = this.tryEntries[L];
              if (Q.tryLoc === T) {
                var Z = Q.completion;
                if (Z.type === "throw") {
                  var U = Z.arg;
                  ae(Q);
                }
                return U;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(T, L, Q) {
            return this.delegate = { iterator: W(T), resultName: L, nextLoc: Q }, this.method === "next" && (this.arg = n), g;
          } };
        }
        function x(T, L, Q, Z) {
          var U = L && L.prototype instanceof h ? L : h, we = Object.create(U.prototype), pe = new G(Z || []);
          return we._invoke = $(T, Q, pe), we;
        }
        function S(T, L, Q) {
          try {
            return { type: "normal", arg: T.call(L, Q) };
          } catch (Z) {
            return { type: "throw", arg: Z };
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
            T[L] = function(Q) {
              return this._invoke(L, Q);
            };
          });
        }
        function k(T) {
          function L(U, we, pe, Le) {
            var Pe = S(T[U], T, we);
            if (Pe.type !== "throw") {
              var Ee = Pe.arg, Oe = Ee.value;
              return Oe && typeof Oe == "object" && o.call(Oe, "__await") ? Promise.resolve(Oe.__await).then(function(Se) {
                L("next", Se, pe, Le);
              }, function(Se) {
                L("throw", Se, pe, Le);
              }) : Promise.resolve(Oe).then(function(Se) {
                Ee.value = Se, pe(Ee);
              }, Le);
            }
            Le(Pe.arg);
          }
          var Q;
          function Z(U, we) {
            function pe() {
              return new Promise(function(Le, Pe) {
                L(U, we, Le, Pe);
              });
            }
            return Q = Q ? Q.then(pe, pe) : pe();
          }
          this._invoke = Z;
        }
        function $(T, L, Q) {
          var Z = d;
          return function(U, we) {
            if (Z === p) throw new Error("Generator is already running");
            if (Z === v) {
              if (U === "throw") throw we;
              return D();
            }
            for (Q.method = U, Q.arg = we; ; ) {
              var pe = Q.delegate;
              if (pe) {
                var Le = F(pe, Q);
                if (Le) {
                  if (Le === g) continue;
                  return Le;
                }
              }
              if (Q.method === "next") Q.sent = Q._sent = Q.arg;
              else if (Q.method === "throw") {
                if (Z === d) throw Z = v, Q.arg;
                Q.dispatchException(Q.arg);
              } else Q.method === "return" && Q.abrupt("return", Q.arg);
              Z = p;
              var Pe = S(T, L, Q);
              if (Pe.type === "normal") {
                if (Z = Q.done ? v : m, Pe.arg === g) continue;
                return { value: Pe.arg, done: Q.done };
              }
              Pe.type === "throw" && (Z = v, Q.method = "throw", Q.arg = Pe.arg);
            }
          };
        }
        function F(T, L) {
          var Q = T.iterator[L.method];
          if (Q === n) {
            if (L.delegate = null, L.method === "throw") {
              if (T.iterator.return && (L.method = "return", L.arg = n, F(T, L), L.method === "throw")) return g;
              L.method = "throw", L.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return g;
          }
          var Z = S(Q, T.iterator, L.arg);
          if (Z.type === "throw") return L.method = "throw", L.arg = Z.arg, L.delegate = null, g;
          var U = Z.arg;
          return U ? U.done ? (L[T.resultName] = U.value, L.next = T.nextLoc, L.method !== "return" && (L.method = "next", L.arg = n), L.delegate = null, g) : U : (L.method = "throw", L.arg = new TypeError("iterator result is not an object"), L.delegate = null, g);
        }
        function J(T) {
          var L = { tryLoc: T[0] };
          1 in T && (L.catchLoc = T[1]), 2 in T && (L.finallyLoc = T[2], L.afterLoc = T[3]), this.tryEntries.push(L);
        }
        function ae(T) {
          var L = T.completion || {};
          L.type = "normal", delete L.arg, T.completion = L;
        }
        function G(T) {
          this.tryEntries = [{ tryLoc: "root" }], T.forEach(J, this), this.reset(!0);
        }
        function W(T) {
          if (T) {
            var L = T[u];
            if (L) return L.call(T);
            if (typeof T.next == "function") return T;
            if (!isNaN(T.length)) {
              var Q = -1, Z = function U() {
                for (; ++Q < T.length; ) if (o.call(T, Q)) return U.value = T[Q], U.done = !1, U;
                return U.value = n, U.done = !0, U;
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
    }, "99af": function(a, f, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), c = e("50c4"), i = e("8418"), s = e("65f0"), l = e("1dde"), d = e("b622"), m = e("2d00"), p = d("isConcatSpreadable"), v = 9007199254740991, g = "Maximum allowed index exceeded", b = m >= 51 || !r(function() {
        var x = [];
        return x[p] = !1, x.concat()[0] !== x;
      }), y = l("concat"), j = function(x) {
        if (!t(x)) return !1;
        var S = x[p];
        return S !== void 0 ? !!S : o(x);
      }, E = !b || !y;
      n({ target: "Array", proto: !0, forced: E }, { concat: function(x) {
        var S, h, O, _, C, k = u(this), $ = s(k, 0), F = 0;
        for (S = -1, O = arguments.length; S < O; S++) if (C = S === -1 ? k : arguments[S], j(C)) {
          if (_ = c(C.length), F + _ > v) throw TypeError(g);
          for (h = 0; h < _; h++, F++) h in C && i($, F, C[h]);
        } else {
          if (F >= v) throw TypeError(g);
          i($, F++, C);
        }
        return $.length = F, $;
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
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(g, b) {
        var y, j, E, x, S, h, O = u(this), _ = t(O.length), C = r(g, _), k = arguments.length;
        if (k === 0 ? y = j = 0 : k === 1 ? (y = 0, j = _ - C) : (y = k - 2, j = m(d(o(b), 0), _ - C)), _ + y - j > p) throw TypeError(v);
        for (E = c(O, j), x = 0; x < j; x++) S = C + x, S in O && i(E, x, O[S]);
        if (E.length = j, y < j) {
          for (x = C; x < _ - j; x++) S = x + j, h = x + y, S in O ? O[h] = O[S] : delete O[h];
          for (x = _; x > _ - j + y; x--) delete O[x - 1];
        } else if (y > j) for (x = _ - j; x > C; x--) S = x + j - 1, h = x + y - 1, S in O ? O[h] = O[S] : delete O[h];
        for (x = 0; x < y; x++) O[x + C] = arguments[x + 2];
        return O.length = _ - j + y, E;
      } });
    }, a4b4: function(a, f, e) {
      var n = e("342f");
      a.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(a, f, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), c = e("4930"), i = e("fdbf"), s = e("d039"), l = e("5135"), d = e("e8b5"), m = e("861d"), p = e("825a"), v = e("7b0b"), g = e("fc6a"), b = e("c04e"), y = e("5c6c"), j = e("7c73"), E = e("df75"), x = e("241c"), S = e("057f"), h = e("7418"), O = e("06cf"), _ = e("9bf2"), C = e("d1e7"), k = e("9112"), $ = e("6eeb"), F = e("5692"), J = e("f772"), ae = e("d012"), G = e("90e3"), W = e("b622"), D = e("e538"), T = e("746f"), L = e("d44e"), Q = e("69f3"), Z = e("b727").forEach, U = J("hidden"), we = "Symbol", pe = "prototype", Le = W("toPrimitive"), Pe = Q.set, Ee = Q.getterFor(we), Oe = Object[pe], Se = r.Symbol, Ve = o("JSON", "stringify"), He = O.f, B = _.f, R = S.f, X = C.f, V = F("symbols"), ee = F("op-symbols"), ie = F("string-to-symbol-registry"), me = F("symbol-to-string-registry"), H = F("wks"), P = r.QObject, Y = !P || !P[pe] || !P[pe].findChild, ye = u && s(function() {
        return j(B({}, "a", { get: function() {
          return B(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, re, se) {
        var he = He(Oe, re);
        he && delete Oe[re], B(q, re, se), he && q !== Oe && B(Oe, re, he);
      } : B, Be = function(q, re) {
        var se = V[q] = j(Se[pe]);
        return Pe(se, { type: we, tag: q, description: re }), u || (se.description = re), se;
      }, je = i ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Se;
      }, We = function(q, re, se) {
        q === Oe && We(ee, re, se), p(q);
        var he = b(re, !0);
        return p(se), l(V, he) ? (se.enumerable ? (l(q, U) && q[U][he] && (q[U][he] = !1), se = j(se, { enumerable: y(0, !1) })) : (l(q, U) || B(q, U, y(1, {})), q[U][he] = !0), ye(q, he, se)) : B(q, he, se);
      }, Ge = function(q, re) {
        p(q);
        var se = g(re), he = E(se).concat(fe(se));
        return Z(he, function(Me) {
          u && !nt.call(se, Me) || We(q, Me, se[Me]);
        }), q;
      }, Je = function(q, re) {
        return re === void 0 ? j(q) : Ge(j(q), re);
      }, nt = function(q) {
        var re = b(q, !0), se = X.call(this, re);
        return !(this === Oe && l(V, re) && !l(ee, re)) && (!(se || !l(this, re) || !l(V, re) || l(this, U) && this[U][re]) || se);
      }, z = function(q, re) {
        var se = g(q), he = b(re, !0);
        if (se !== Oe || !l(V, he) || l(ee, he)) {
          var Me = He(se, he);
          return !Me || !l(V, he) || l(se, U) && se[U][he] || (Me.enumerable = !0), Me;
        }
      }, ue = function(q) {
        var re = R(g(q)), se = [];
        return Z(re, function(he) {
          l(V, he) || l(ae, he) || se.push(he);
        }), se;
      }, fe = function(q) {
        var re = q === Oe, se = R(re ? ee : g(q)), he = [];
        return Z(se, function(Me) {
          !l(V, Me) || re && !l(Oe, Me) || he.push(V[Me]);
        }), he;
      };
      if (c || (Se = function() {
        if (this instanceof Se) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, re = G(q), se = function(he) {
          this === Oe && se.call(ee, he), l(this, U) && l(this[U], re) && (this[U][re] = !1), ye(this, re, y(1, he));
        };
        return u && Y && ye(Oe, re, { configurable: !0, set: se }), Be(re, q);
      }, $(Se[pe], "toString", function() {
        return Ee(this).tag;
      }), $(Se, "withoutSetter", function(q) {
        return Be(G(q), q);
      }), C.f = nt, _.f = We, O.f = z, x.f = S.f = ue, h.f = fe, D.f = function(q) {
        return Be(W(q), q);
      }, u && (B(Se[pe], "description", { configurable: !0, get: function() {
        return Ee(this).description;
      } }), t || $(Oe, "propertyIsEnumerable", nt, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Se }), Z(E(H), function(q) {
        T(q);
      }), n({ target: we, stat: !0, forced: !c }, { for: function(q) {
        var re = String(q);
        if (l(ie, re)) return ie[re];
        var se = Se(re);
        return ie[re] = se, me[se] = re, se;
      }, keyFor: function(q) {
        if (!je(q)) throw TypeError(q + " is not a symbol");
        if (l(me, q)) return me[q];
      }, useSetter: function() {
        Y = !0;
      }, useSimple: function() {
        Y = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !u }, { create: Je, defineProperty: We, defineProperties: Ge, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: ue, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: s(function() {
        h.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return h.f(v(q));
      } }), Ve) {
        var ve = !c || s(function() {
          var q = Se();
          return Ve([q]) != "[null]" || Ve({ a: q }) != "{}" || Ve(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: ve }, { stringify: function(q, re, se) {
          for (var he, Me = [q], qe = 1; arguments.length > qe; ) Me.push(arguments[qe++]);
          if (he = re, (m(re) || q !== void 0) && !je(q)) return d(re) || (re = function(Ze, xe) {
            if (typeof he == "function" && (xe = he.call(this, Ze, xe)), !je(xe)) return xe;
          }), Me[1] = re, Ve.apply(null, Me);
        } });
      }
      Se[pe][Le] || k(Se[pe], Le, Se[pe].valueOf), L(Se, we), ae[U] = !0;
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
        var g = {};
        return n[d].call(g) !== g;
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
          var g = new XMLHttpRequest();
          if (l.auth) {
            var b = l.auth.username || "", y = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            v.Authorization = "Basic " + btoa(b + ":" + y);
          }
          var j = u(l.baseURL, l.url);
          if (g.open(l.method.toUpperCase(), t(j, l.params, l.paramsSerializer), !0), g.timeout = l.timeout, g.onreadystatechange = function() {
            if (g && g.readyState === 4 && (g.status !== 0 || g.responseURL && g.responseURL.indexOf("file:") === 0)) {
              var x = "getAllResponseHeaders" in g ? c(g.getAllResponseHeaders()) : null, S = l.responseType && l.responseType !== "text" ? g.response : g.responseText, h = { data: S, status: g.status, statusText: g.statusText, headers: x, config: l, request: g };
              r(d, m, h), g = null;
            }
          }, g.onabort = function() {
            g && (m(s("Request aborted", l, "ECONNABORTED", g)), g = null);
          }, g.onerror = function() {
            m(s("Network Error", l, null, g)), g = null;
          }, g.ontimeout = function() {
            var x = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (x = l.timeoutErrorMessage), m(s(x, l, "ECONNABORTED", g)), g = null;
          }, n.isStandardBrowserEnv()) {
            var E = (l.withCredentials || i(j)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            E && (v[l.xsrfHeaderName] = E);
          }
          if ("setRequestHeader" in g && n.forEach(v, function(x, S) {
            typeof p > "u" && S.toLowerCase() === "content-type" ? delete v[S] : g.setRequestHeader(S, x);
          }), n.isUndefined(l.withCredentials) || (g.withCredentials = !!l.withCredentials), l.responseType) try {
            g.responseType = l.responseType;
          } catch (x) {
            if (l.responseType !== "json") throw x;
          }
          typeof l.onDownloadProgress == "function" && g.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && g.upload && g.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(x) {
            g && (g.abort(), m(x), g = null);
          }), p || (p = null), g.send(p);
        });
      };
    }, b575: function(a, f, e) {
      var n, r, o, t, u, c, i, s, l = e("da84"), d = e("06cf").f, m = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), g = e("605d"), b = l.MutationObserver || l.WebKitMutationObserver, y = l.document, j = l.process, E = l.Promise, x = d(l, "queueMicrotask"), S = x && x.value;
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
      }, p || g || v || !b || !y ? E && E.resolve ? (i = E.resolve(void 0), s = i.then, t = function() {
        s.call(i, n);
      }) : t = g ? function() {
        j.nextTick(n);
      } : function() {
        m.call(l, n);
      } : (u = !0, c = y.createTextNode(""), new b(n).observe(c, { characterData: !0 }), t = function() {
        c.data = u = !u;
      })), a.exports = S || function(h) {
        var O = { fn: h, next: void 0 };
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
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), c = 1 .toFixed, i = Math.floor, s = function(g, b, y) {
        return b === 0 ? y : b % 2 === 1 ? s(g, b - 1, y * g) : s(g * g, b / 2, y);
      }, l = function(g) {
        for (var b = 0, y = g; y >= 4096; ) b += 12, y /= 4096;
        for (; y >= 2; ) b += 1, y /= 2;
        return b;
      }, d = function(g, b, y) {
        for (var j = -1, E = y; ++j < 6; ) E += b * g[j], g[j] = E % 1e7, E = i(E / 1e7);
      }, m = function(g, b) {
        for (var y = 6, j = 0; --y >= 0; ) j += g[y], g[y] = i(j / b), j = j % b * 1e7;
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
        var b, y, j, E, x = o(this), S = r(g), h = [0, 0, 0, 0, 0, 0], O = "", _ = "0";
        if (S < 0 || S > 20) throw RangeError("Incorrect fraction digits");
        if (x != x) return "NaN";
        if (x <= -1e21 || x >= 1e21) return String(x);
        if (x < 0 && (O = "-", x = -x), x > 1e-21) if (b = l(x * s(2, 69, 1)) - 69, y = b < 0 ? x * s(2, -b, 1) : x / s(2, b, 1), y *= 4503599627370496, b = 52 - b, b > 0) {
          for (d(h, 0, y), j = S; j >= 7; ) d(h, 1e7, 0), j -= 7;
          for (d(h, s(10, j, 1), 0), j = b - 1; j >= 23; ) m(h, 1 << 23), j -= 23;
          m(h, 1 << j), d(h, 1, 1), m(h, 2), _ = p(h);
        } else d(h, 0, y), d(h, 1 << -b, 0), _ = p(h) + t.call("0", S);
        return S > 0 ? (E = _.length, _ = O + (E <= S ? "0." + t.call("0", S - E) + _ : _.slice(0, E - S) + "." + _.slice(E - S))) : _ = O + _, _;
      } });
    }, b727: function(a, f, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), c = [].push, i = function(s) {
        var l = s == 1, d = s == 2, m = s == 3, p = s == 4, v = s == 6, g = s == 7, b = s == 5 || v;
        return function(y, j, E, x) {
          for (var S, h, O = o(y), _ = r(O), C = n(j, E, 3), k = t(_.length), $ = 0, F = x || u, J = l ? F(y, k) : d || g ? F(y, 0) : void 0; k > $; $++) if ((b || $ in _) && (S = _[$], h = C(S, $, O), s)) if (l) J[$] = h;
          else if (h) switch (s) {
            case 3:
              return !0;
            case 5:
              return S;
            case 6:
              return $;
            case 2:
              c.call(J, S);
          }
          else switch (s) {
            case 4:
              return !1;
            case 7:
              c.call(J, S);
          }
          return v ? -1 : m || p ? p : J;
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
      function i(k) {
        return typeof FormData < "u" && k instanceof FormData;
      }
      function s(k) {
        var $;
        return $ = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(k) : k && k.buffer && k.buffer instanceof ArrayBuffer, $;
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
        var $ = Object.getPrototypeOf(k);
        return $ === null || $ === Object.prototype;
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
      function x(k) {
        return k.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function S() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function h(k, $) {
        if (k !== null && typeof k < "u") if (typeof k != "object" && (k = [k]), o(k)) for (var F = 0, J = k.length; F < J; F++) $.call(null, k[F], F, k);
        else for (var ae in k) Object.prototype.hasOwnProperty.call(k, ae) && $.call(null, k[ae], ae, k);
      }
      function O() {
        var k = {};
        function $(ae, G) {
          p(k[G]) && p(ae) ? k[G] = O(k[G], ae) : p(ae) ? k[G] = O({}, ae) : o(ae) ? k[G] = ae.slice() : k[G] = ae;
        }
        for (var F = 0, J = arguments.length; F < J; F++) h(arguments[F], $);
        return k;
      }
      function _(k, $, F) {
        return h($, function(J, ae) {
          k[ae] = F && typeof J == "function" ? n(J, F) : J;
        }), k;
      }
      function C(k) {
        return k.charCodeAt(0) === 65279 && (k = k.slice(1)), k;
      }
      a.exports = { isArray: o, isArrayBuffer: c, isBuffer: u, isFormData: i, isArrayBufferView: s, isString: l, isNumber: d, isObject: m, isPlainObject: p, isUndefined: t, isDate: v, isFile: g, isBlob: b, isFunction: y, isStream: j, isURLSearchParams: E, isStandardBrowserEnv: S, forEach: h, merge: O, extend: _, trim: x, stripBOM: C };
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
          var m = r(i), p = o(m), v = t(m.length), g = c ? v - 1 : 0, b = c ? -1 : 1;
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
        var g = "ab".split(p);
        return g.length !== 2 || g[0] !== "a" || g[1] !== "b";
      });
      a.exports = function(p, v, g, b) {
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
        if (!j || !E || p === "replace" && (!i || !s || d) || p === "split" && !m) {
          var x = /./[y], S = g(y, ""[p], function(_, C, k, $, F) {
            return C.exec === t ? j && !F ? { done: !0, value: x.call(C, k, $) } : { done: !0, value: _.call(k, C, $) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: s, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: d }), h = S[0], O = S[1];
          n(String.prototype, p, h), n(RegExp.prototype, y, v == 2 ? function(_, C) {
            return O.call(_, this, C);
          } : function(_) {
            return O.call(_, this);
          });
        }
        b && u(RegExp.prototype[y], "sham", !0);
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
        for (var s, l, d = t(i), m = u.f, p = o(d), v = {}, g = 0; p.length > g; ) l = m(d, s = p[g++]), l !== void 0 && c(v, s, l);
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
          function s(b) {
            for (var y = 0; y < b.length && b[y] === ""; y++) ;
            for (var j = b.length - 1; j >= 0 && b[j] === ""; j--) ;
            return y > j ? [] : b.slice(y, j - y + 1);
          }
          c = f.resolve(c).substr(1), i = f.resolve(i).substr(1);
          for (var l = s(c.split("/")), d = s(i.split("/")), m = Math.min(l.length, d.length), p = m, v = 0; v < m; v++) if (l[v] !== d[v]) {
            p = v;
            break;
          }
          var g = [];
          for (v = p; v < l.length; v++) g.push("..");
          return g = g.concat(d.slice(p)), g.join("/");
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
                return O.forEach(function(k, $) {
                  typeof C[$] > "u" ? C[$] = j(k, _) : b(k) ? C[$] = S(h[$], k, _) : h.indexOf(k) === -1 && C.push(j(k, _));
                }), C;
              }
              function x(h, O, _) {
                var C = {};
                return b(h) && Object.keys(h).forEach(function(k) {
                  C[k] = j(h[k], _);
                }), Object.keys(O).forEach(function(k) {
                  b(O[k]) && h[k] ? C[k] = S(h[k], O[k], _) : C[k] = j(O[k], _);
                }), C;
              }
              function S(h, O, _) {
                var C = Array.isArray(O), k = _ || { arrayMerge: E }, $ = k.arrayMerge || E;
                return C ? Array.isArray(h) ? $(h, O, _) : j(O, _) : x(h, O, _);
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
          }), i = function(v) {
            return Object.keys(v).map(function(g) {
              var b = v[g].toString().replace(/"/g, "&quot;");
              return g + '="' + b + '"';
            }).join(" ");
          }, s = c.svg, l = c.xlink, d = {};
          d[s.name] = s.uri, d[l.name] = l.uri;
          var m = function(v, g) {
            v === void 0 && (v = "");
            var b = u(d, {}), y = i(b);
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
    }, e01a: function(a, f, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), c = e("9bf2").f, i = e("e893"), s = o.Symbol;
      if (r && typeof s == "function" && (!("description" in s.prototype) || s().description !== void 0)) {
        var l = {}, d = function() {
          var b = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), y = this instanceof d ? new s(b) : b === void 0 ? s() : s(b);
          return b === "" && (l[y] = !0), y;
        };
        i(d, s);
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
      var n, r, o, t, u = e("23e7"), c = e("c430"), i = e("da84"), s = e("d066"), l = e("fea9"), d = e("6eeb"), m = e("e2cc"), p = e("d44e"), v = e("2626"), g = e("861d"), b = e("1c0b"), y = e("19aa"), j = e("8925"), E = e("2266"), x = e("1c7e"), S = e("4840"), h = e("2cf4").set, O = e("b575"), _ = e("cdf9"), C = e("44de"), k = e("f069"), $ = e("e667"), F = e("69f3"), J = e("94ca"), ae = e("b622"), G = e("605d"), W = e("2d00"), D = ae("species"), T = "Promise", L = F.get, Q = F.set, Z = F.getterFor(T), U = l, we = i.TypeError, pe = i.document, Le = i.process, Pe = s("fetch"), Ee = k.f, Oe = Ee, Se = !!(pe && pe.createEvent && i.dispatchEvent), Ve = typeof PromiseRejectionEvent == "function", He = "unhandledrejection", B = "rejectionhandled", R = 0, X = 1, V = 2, ee = 1, ie = 2, me = J(T, function() {
        var z = j(U) !== String(U);
        if (!z && (W === 66 || !G && !Ve) || c && !U.prototype.finally) return !0;
        if (W >= 51 && /native code/.test(U)) return !1;
        var ue = U.resolve(1), fe = function(q) {
          q(function() {
          }, function() {
          });
        }, ve = ue.constructor = {};
        return ve[D] = fe, !(ue.then(function() {
        }) instanceof fe);
      }), H = me || !x(function(z) {
        U.all(z).catch(function() {
        });
      }), P = function(z) {
        var ue;
        return !(!g(z) || typeof (ue = z.then) != "function") && ue;
      }, Y = function(z, ue) {
        if (!z.notified) {
          z.notified = !0;
          var fe = z.reactions;
          O(function() {
            for (var ve = z.value, q = z.state == X, re = 0; fe.length > re; ) {
              var se, he, Me, qe = fe[re++], Ze = q ? qe.ok : qe.fail, xe = qe.resolve, et = qe.reject, Qe = qe.domain;
              try {
                Ze ? (q || (z.rejection === ie && We(z), z.rejection = ee), Ze === !0 ? se = ve : (Qe && Qe.enter(), se = Ze(ve), Qe && (Qe.exit(), Me = !0)), se === qe.promise ? et(we("Promise-chain cycle")) : (he = P(se)) ? he.call(se, xe, et) : xe(se)) : et(ve);
              } catch (gt) {
                Qe && !Me && Qe.exit(), et(gt);
              }
            }
            z.reactions = [], z.notified = !1, ue && !z.rejection && Be(z);
          });
        }
      }, ye = function(z, ue, fe) {
        var ve, q;
        Se ? (ve = pe.createEvent("Event"), ve.promise = ue, ve.reason = fe, ve.initEvent(z, !1, !0), i.dispatchEvent(ve)) : ve = { promise: ue, reason: fe }, !Ve && (q = i["on" + z]) ? q(ve) : z === He && C("Unhandled promise rejection", fe);
      }, Be = function(z) {
        h.call(i, function() {
          var ue, fe = z.facade, ve = z.value, q = je(z);
          if (q && (ue = $(function() {
            G ? Le.emit("unhandledRejection", ve, fe) : ye(He, fe, ve);
          }), z.rejection = G || je(z) ? ie : ee, ue.error)) throw ue.value;
        });
      }, je = function(z) {
        return z.rejection !== ee && !z.parent;
      }, We = function(z) {
        h.call(i, function() {
          var ue = z.facade;
          G ? Le.emit("rejectionHandled", ue) : ye(B, ue, z.value);
        });
      }, Ge = function(z, ue, fe) {
        return function(ve) {
          z(ue, ve, fe);
        };
      }, Je = function(z, ue, fe) {
        z.done || (z.done = !0, fe && (z = fe), z.value = ue, z.state = V, Y(z, !0));
      }, nt = function(z, ue, fe) {
        if (!z.done) {
          z.done = !0, fe && (z = fe);
          try {
            if (z.facade === ue) throw we("Promise can't be resolved itself");
            var ve = P(ue);
            ve ? O(function() {
              var q = { done: !1 };
              try {
                ve.call(ue, Ge(nt, q, z), Ge(Je, q, z));
              } catch (re) {
                Je(q, re, z);
              }
            }) : (z.value = ue, z.state = X, Y(z, !1));
          } catch (q) {
            Je({ done: !1 }, q, z);
          }
        }
      };
      me && (U = function(z) {
        y(this, U, T), b(z), n.call(this);
        var ue = L(this);
        try {
          z(Ge(nt, ue), Ge(Je, ue));
        } catch (fe) {
          Je(ue, fe);
        }
      }, n = function(z) {
        Q(this, { type: T, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: R, value: void 0 });
      }, n.prototype = m(U.prototype, { then: function(z, ue) {
        var fe = Z(this), ve = Ee(S(this, U));
        return ve.ok = typeof z != "function" || z, ve.fail = typeof ue == "function" && ue, ve.domain = G ? Le.domain : void 0, fe.parent = !0, fe.reactions.push(ve), fe.state != R && Y(fe, !1), ve.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), r = function() {
        var z = new n(), ue = L(z);
        this.promise = z, this.resolve = Ge(nt, ue), this.reject = Ge(Je, ue);
      }, k.f = Ee = function(z) {
        return z === U || z === o ? new r(z) : Oe(z);
      }, c || typeof l != "function" || (t = l.prototype.then, d(l.prototype, "then", function(z, ue) {
        var fe = this;
        return new U(function(ve, q) {
          t.call(fe, ve, q);
        }).then(z, ue);
      }, { unsafe: !0 }), typeof Pe == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return _(U, Pe.apply(i, arguments));
      } }))), u({ global: !0, wrap: !0, forced: me }, { Promise: U }), p(U, T, !1, !0), v(T), o = s(T), u({ target: T, stat: !0, forced: me }, { reject: function(z) {
        var ue = Ee(this);
        return ue.reject.call(void 0, z), ue.promise;
      } }), u({ target: T, stat: !0, forced: c || me }, { resolve: function(z) {
        return _(c && this === o ? U : this, z);
      } }), u({ target: T, stat: !0, forced: H }, { all: function(z) {
        var ue = this, fe = Ee(ue), ve = fe.resolve, q = fe.reject, re = $(function() {
          var se = b(ue.resolve), he = [], Me = 0, qe = 1;
          E(z, function(Ze) {
            var xe = Me++, et = !1;
            he.push(void 0), qe++, se.call(ue, Ze).then(function(Qe) {
              et || (et = !0, he[xe] = Qe, --qe || ve(he));
            }, q);
          }), --qe || ve(he);
        });
        return re.error && q(re.value), fe.promise;
      }, race: function(z) {
        var ue = this, fe = Ee(ue), ve = fe.reject, q = $(function() {
          var re = b(ue.resolve);
          E(z, function(se) {
            re.call(ue, se).then(fe.resolve, ve);
          });
        });
        return q.error && ve(q.value), fe.promise;
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
      }, d = function(b) {
        t(b, i, { value: { objectID: "O" + ++s, weakData: {} } });
      }, m = function(b, y) {
        if (!r(b)) return typeof b == "symbol" ? b : (typeof b == "string" ? "S" : "P") + b;
        if (!o(b, i)) {
          if (!l(b)) return "F";
          if (!y) return "E";
          d(b);
        }
        return b[i].objectID;
      }, p = function(b, y) {
        if (!o(b, i)) {
          if (!l(b)) return !0;
          if (!y) return !1;
          d(b);
        }
        return b[i].weakData;
      }, v = function(b) {
        return c && g.REQUIRED && l(b) && !o(b, i) && d(b), b;
      }, g = a.exports = { REQUIRED: !1, fastKey: m, getWeakData: p, onFreeze: v };
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
      function i(w, M, N, I, K, ce) {
        var de = Object(t.resolveComponent)("Result"), le = Object(t.resolveComponent)("DefaultBoard"), ge = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Ue = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: w.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [w.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: M[1] || (M[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(de, { data: w.resultVal, onChange: w.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [w.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, ref: "defaultBoardRef", onTrigger: w.trigger, onChange: w.change, onTranslate: w.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), w.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ge, { key: 1, onTrigger: w.trigger, onChange: w.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), w.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: w.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(w.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Ue]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function s(w, M, N) {
        return M in w ? Object.defineProperty(w, M, { value: N, enumerable: !0, configurable: !0, writable: !0 }) : w[M] = N, w;
      }
      function l(w, M) {
        var N = Object.keys(w);
        if (Object.getOwnPropertySymbols) {
          var I = Object.getOwnPropertySymbols(w);
          M && (I = I.filter(function(K) {
            return Object.getOwnPropertyDescriptor(w, K).enumerable;
          })), N.push.apply(N, I);
        }
        return N;
      }
      function d(w) {
        for (var M = 1; M < arguments.length; M++) {
          var N = arguments[M] != null ? arguments[M] : {};
          M % 2 ? l(Object(N), !0).forEach(function(I) {
            s(w, I, N[I]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(w, Object.getOwnPropertyDescriptors(N)) : l(Object(N)).forEach(function(I) {
            Object.defineProperty(w, I, Object.getOwnPropertyDescriptor(N, I));
          });
        }
        return w;
      }
      function m(w, M) {
        (M == null || M > w.length) && (M = w.length);
        for (var N = 0, I = new Array(M); N < M; N++) I[N] = w[N];
        return I;
      }
      function p(w) {
        if (Array.isArray(w)) return m(w);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(w) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(w)) return Array.from(w);
      }
      e("fb6a");
      function g(w, M) {
        if (w) {
          if (typeof w == "string") return m(w, M);
          var N = Object.prototype.toString.call(w).slice(8, -1);
          return N === "Object" && w.constructor && (N = w.constructor.name), N === "Map" || N === "Set" ? Array.from(w) : N === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(N) ? m(w, M) : void 0;
        }
      }
      function b() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function y(w) {
        return p(w) || v(w) || g(w) || b();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function j(w, M) {
        if (!(w instanceof M)) throw new TypeError("Cannot call a class as a function");
      }
      function E(w, M) {
        for (var N = 0; N < M.length; N++) {
          var I = M[N];
          I.enumerable = I.enumerable || !1, I.configurable = !0, "value" in I && (I.writable = !0), Object.defineProperty(w, I.key, I);
        }
      }
      function x(w, M, N) {
        return M && E(w.prototype, M), w;
      }
      var S = function() {
        function w() {
          j(this, w), this.listeners = {};
        }
        return x(w, [{ key: "on", value: function(M, N) {
          var I = this, K = this.listeners[M];
          return K || (K = []), K.push(N), this.listeners[M] = K, function() {
            I.remove(M, N);
          };
        } }, { key: "emit", value: function(M) {
          var N = this.listeners[M];
          if (Array.isArray(N)) {
            for (var I = arguments.length, K = new Array(I > 1 ? I - 1 : 0), ce = 1; ce < I; ce++) K[ce - 1] = arguments[ce];
            for (var de = 0; de < N.length; de++) {
              var le = N[de];
              typeof le == "function" && le.apply(void 0, K);
            }
          }
        } }, { key: "remove", value: function(M, N) {
          if (N) {
            var I = this.listeners[M];
            if (!I) return;
            I = I.filter(function(K) {
              return K !== N;
            }), this.listeners[M] = I;
          } else this.listeners[M] = null, delete this.listeners[M];
        } }]), w;
      }(), h = new S(), O = { mounted: function(w, M, N) {
        var I = w.parentNode;
        w.onmousedown = function(K) {
          var ce = K.clientX - I.offsetLeft, de = K.clientY - I.offsetTop;
          document.onmousemove = function(le) {
            var ge = le.clientX - ce, Re = le.clientY - de;
            I.style.left = ge + "px", I.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              h.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, w.ontouchstart = function(K) {
          var ce = K.touches[0].pageX, de = K.touches[0].pageY, le = ce - I.offsetLeft, ge = de - I.offsetTop;
          document.ontouchmove = function(Re) {
            var Ue = Re.touches[0].pageX, De = Re.touches[0].pageY, ze = Ue - le, lt = De - ge;
            I.style.left = ze + "px", I.style.top = lt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              h.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, _ = O, C = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var k = { key: 0, class: "key-board-code-show" }, $ = { class: "key-board-result-show" }, F = { class: "key-board-result-show-container" }, J = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ae = C(function(w, M, N, I, K, ce) {
        return w.status === "CN" || w.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: w.color } }, [w.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", k, Object(t.toDisplayString)(w.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", $, [Object(t.createVNode)("div", F, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.showList[w.showIndex], function(de, le) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: le, onClick: function(ge) {
            return w.selectWord(de);
          } }, Object(t.toDisplayString)(le + 1) + "." + Object(t.toDisplayString)(de), 9, ["onClick"]);
        }), 128))]), w.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", J, [Object(t.createVNode)("span", { style: w.getStyle, onClick: M[1] || (M[1] = function() {
          return w.upper && w.upper.apply(w, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: w.getStyle, onClick: M[2] || (M[2] = function() {
          return w.lower && w.lower.apply(w, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), G = (e("1276"), e("6062"), e("5319"), function(w, M) {
        for (var N = 0, I = []; N < w.length; ) I.push(w.slice(N, N += M));
        return I;
      }), W = Symbol("KEYBOARD_CONTEXT"), D = function(w) {
        Object(t.provide)(W, w);
      }, T = function() {
        return Object(t.inject)(W);
      }, L = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(w, M) {
        var N = M.emit, I = T(), K = Object(t.computed)(function() {
          return { borderTopColor: I == null ? void 0 : I.color };
        }), ce = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function de() {
          ce.showIndex !== 0 && (ce.showIndex -= 1);
        }
        function le() {
          ce.showIndex !== ce.showList.length - 1 && (ce.showIndex += 1);
        }
        function ge() {
          ce.showIndex = 0, ce.showList = [], ce.valueList = [], h.emit("resultReset");
        }
        function Re(Ue) {
          ge(), N("change", Ue);
        }
        return Object(t.watch)(function() {
          return w.data;
        }, function(Ue) {
          var De;
          ce.showIndex = 0, ce.valueList = (Ue == null || (De = Ue.value) === null || De === void 0 ? void 0 : De.split("")) || [], ce.valueList.length !== 0 ? ce.showList = G(ce.valueList, 11) : ce.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          h.on("keyBoardChange", function(Ue) {
            h.emit("updateBound"), ce.status = Ue, ge();
          }), h.on("getWordsFromServer", function(Ue) {
            var De = Array.from(new Set(Ue.replace(/\s+/g, "").split("")));
            ce.valueList = De, ce.showList = G(De, 11);
          });
        }), Object(t.onUnmounted)(function() {
          h.remove("keyBoardChange"), h.remove("getWordsFromServer");
        }), d({ color: I == null ? void 0 : I.color, upper: de, lower: le, getStyle: K, selectWord: Re }, Object(t.toRefs)(ce));
      } });
      e("e66c"), L.render = ae, L.__scopeId = "data-v-02e63132";
      var Q = L, Z = e("bc3a"), U = e.n(Z), we = 15e3, pe = function(w) {
        U.a.defaults.baseURL = w, U.a.defaults.timeout = we, U.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Le(w, M, N, I, K, ce) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: w.color } }, [Object(t.createVNode)("use", { "xlink:href": w.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Pe = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(w) {
        var M = T(), N = Object(t.computed)(function() {
          return "#icon-".concat(w.iconClass);
        });
        return { color: M == null ? void 0 : M.color, iconName: N };
      } });
      e("38cd"), Pe.render = Le;
      var Ee = Pe, Oe = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Se = { class: "hand-write-board" }, Ve = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var He = Oe(function(w, M, N, I, K, ce) {
        var de = Object(t.resolveComponent)("PaintBoard"), le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Se, [Object(t.createVNode)(de, { lib: w.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Ve, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.handBoardOperList, function(ge) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ge.type, type: ge.type, data: ge.data, isCn: w.isCn, onClick: w.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), B = { class: "paint-board" };
      function R(w, M, N, I, K, ce) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", B, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: w.width, height: w.height, onTouchstart: M[1] || (M[1] = function() {
          return w.down && w.down.apply(w, arguments);
        }), onTouchmove: M[2] || (M[2] = function() {
          return w.move && w.move.apply(w, arguments);
        }), onTouchend: M[3] || (M[3] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }), onMousedown: M[4] || (M[4] = function() {
          return w.down && w.down.apply(w, arguments);
        }), onMousemove: M[5] || (M[5] = function() {
          return w.move && w.move.apply(w, arguments);
        }), onMouseup: M[6] || (M[6] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }), onMouseleave: M[7] || (M[7] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function X(w, M, N, I, K, ce, de) {
        try {
          var le = w[ce](de), ge = le.value;
        } catch (Re) {
          return void N(Re);
        }
        le.done ? M(ge) : Promise.resolve(ge).then(I, K);
      }
      function V(w) {
        return function() {
          var M = this, N = arguments;
          return new Promise(function(I, K) {
            var ce = w.apply(M, N);
            function de(ge) {
              X(ce, I, K, de, le, "next", ge);
            }
            function le(ge) {
              X(ce, I, K, de, le, "throw", ge);
            }
            de(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var ee, ie, me = function() {
        var w = V(regeneratorRuntime.mark(function M(N, I, K, ce) {
          return regeneratorRuntime.wrap(function(de) {
            for (; ; ) switch (de.prev = de.next) {
              case 0:
                return de.next = 2, U.a.post("", { lib: ce, lpXis: N, lpYis: I, lpCis: K });
              case 2:
                return de.abrupt("return", de.sent);
              case 3:
              case "end":
                return de.stop();
            }
          }, M);
        }));
        return function(M, N, I, K) {
          return w.apply(this, arguments);
        };
      }(), H = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(w) {
        var M = T(), N = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), I = Object(t.ref)(null);
        function K() {
          return ce.apply(this, arguments);
        }
        function ce() {
          return ce = V(regeneratorRuntime.mark(function Ce() {
            var Ke, $e;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, me(N.clickX, N.clickY, N.clickC, w.lib);
                case 2:
                  Ke = Ye.sent, $e = Ke.data, h.emit("getWordsFromServer", ($e == null ? void 0 : $e.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ce);
          })), ce.apply(this, arguments);
        }
        function de() {
          I.value && ee && (N.clickX = [], N.clickY = [], N.clickC = [], ee.clearRect(0, 0, N.width, N.height));
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
            N.clickX.push(Ke), N.clickY.push($e), N.clickC.push(0), ee.strokeStyle = M == null ? void 0 : M.color, ee.fillStyle = M == null ? void 0 : M.color, ee.lineWidth = 4, ee.lineCap = "round", ee.moveTo(N.oldX, N.oldY), ee.lineTo(Ke, $e), ee.stroke(), N.oldX = Ke, N.oldY = $e;
          }
        }
        function De() {
          N.isMouseDown && (N.isMouseDown = !1, ie = setTimeout(function() {
            de();
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
        function lt() {
          var Ce;
          ee = (Ce = I.value) === null || Ce === void 0 ? void 0 : Ce.getContext("2d"), de(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          lt(), h.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), h.remove("updateBound");
        }), d(d({}, Object(t.toRefs)(N)), {}, { move: Ue, down: Re, mouseup: De, canvasRef: I });
      } });
      H.render = R;
      var P = H;
      function Y(w, M, N, I, K, ce) {
        var de = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(w.type), { "key-board-button-active": w.isUpper && w.type === "upper" || w.isNum && w.type === "change2num" || w.isSymbol && w.type === "#+=" }], style: w.getStyle, onClick: M[1] || (M[1] = function() {
          return w.click && w.click.apply(w, arguments);
        }), onMouseenter: M[2] || (M[2] = function(le) {
          return w.isHoverStatus = !0;
        }), onMouseleave: M[3] || (M[3] = function(le) {
          return w.isHoverStatus = !1;
        }) }, [w.type === "upper" || w.type === "delete" || w.type === "handwrite" || w.type === "close" || w.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, "icon-class": w.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: w.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ye = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Ee }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(w, M) {
        var N = M.emit, I = T(), K = Object(t.ref)(!1), ce = Object(t.computed)(function() {
          return w.type === "change2lang" ? w.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : w.isUpper ? w.data.toUpperCase() : w.data;
        }), de = Object(t.computed)(function() {
          return w.isUpper && w.type === "upper" || w.isNum && w.type === "change2num" || w.isSymbol && w.type === "#+=" || K.value ? { color: "#f5f5f5", background: I == null ? void 0 : I.color } : { color: I == null ? void 0 : I.color, background: "#f5f5f5" };
        });
        function le(ge) {
          ge.preventDefault(), N("click", { data: w.isUpper ? w.data.toUpperCase() : w.data, type: w.type });
        }
        return { isHoverStatus: K, getStyle: de, getCode: ce, click: le };
      } });
      e("de23"), ye.render = Y;
      var Be = ye, je = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: P, KeyCodeButton: Be }, setup: function(w, M) {
        var N = M.emit, I = T(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ce(de) {
          var le = de.data, ge = de.type;
          switch (ge) {
            case "close":
              I == null || I.closeKeyBoard();
              break;
            case "back":
              I == null || I.changeDefaultBoard(), h.emit("resultReset"), h.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              N("trigger", { data: le, type: ge });
              break;
          }
        }
        return d({ click: ce }, Object(t.toRefs)(K));
      } });
      e("9aaf"), je.render = He, je.__scopeId = "data-v-1b5e0983";
      var We = je, Ge = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Je = { class: "default-key-board" }, nt = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Ge(function(w, M, N, I, K, ce) {
        var de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Je, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.lineList, function(le, ge) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ge + 1)], key: ge }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(le, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(de, { isUpper: w.isUpper, key: Re, type: Re, data: Re, isSymbol: w.isSymbol, onClick: w.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", nt, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.line4, function(le) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: le.type, type: le.type, data: le.data, isCn: w.isCn, isNum: w.isNum, onClick: w.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ue = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, ve = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], re = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Be }, emits: ["translate", "trigger", "change"], setup: function(w, M) {
        var N = M.emit, I = T(), K = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ce() {
          var le;
          K.line4 = JSON.parse(JSON.stringify(q)), I != null && (le = I.modeList) !== null && le !== void 0 && le.find(function(ge) {
            return ge === "handwrite";
          }) && I !== null && I !== void 0 && I.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function de(le) {
          var ge = le.data, Re = le.type;
          switch (Re) {
            case "close":
              K.oldVal = "", I == null || I.closeKeyBoard();
              break;
            case "upper":
              K.oldVal = "", K.isUpper = !K.isUpper;
              break;
            case "change2lang":
              K.isCn = !K.isCn, K.isNum || K.isSymbol || h.emit("keyBoardChange", K.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (K.isNum = !K.isNum, K.isSymbol = !1, K.isNum) {
                var Ue;
                h.emit("keyBoardChange", "number");
                var De = JSON.parse(JSON.stringify(ve.line3));
                I != null && (Ue = I.modeList) !== null && Ue !== void 0 && Ue.find(function(ze) {
                  return ze === "symbol";
                }) || (De.shift(), De.unshift("+")), K.lineList = [ve.line1, ve.line2, De];
              } else h.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (h.emit("keyBoardChange", "symbol"), K.lineList = [ue.line1, ue.line2, ue.line3]) : (h.emit("keyBoardChange", "number"), K.lineList = [ve.line1, ve.line2, ve.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && Re === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), N("translate", K.oldVal)) : (Re === "handwrite" && h.emit("keyBoardChange", "handwrite"), N("trigger", { data: ge, type: Re }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? N("change", ge) : (N("translate", K.oldVal + ge), K.oldVal = K.oldVal + ge);
              break;
          }
        }
        return ce(), Object(t.onMounted)(function() {
          h.on("resultReset", function() {
            K.oldVal = "";
          });
        }), d(d({}, Object(t.toRefs)(K)), {}, { click: de });
      } });
      e("f8b0"), re.render = z, re.__scopeId = "data-v-4b78e5a1";
      var se = re, he = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Me = e("ec57"), qe = function(w) {
        return w.keys().map(w);
      };
      qe(Me);
      var Ze = [], xe = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: _ }, components: { Result: Q, SvgIcon: Ee, HandBoard: We, DefaultBoard: se }, setup: function(w, M) {
        var N = M.emit, I = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function ce(ke) {
          var _e, Te;
          switch (Object(t.nextTick)(function() {
            h.emit("keyBoardChange", "CN");
          }), ke) {
            case "en":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Ae;
                (Ae = K.value) === null || Ae === void 0 || Ae.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Ae;
                (Ae = K.value) === null || Ae === void 0 || Ae.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (_e = w.modeList) !== null && _e !== void 0 && _e.find(function(Ae) {
                return Ae === "handwrite";
              }) && w.handApi ? (I.showMode = "handwrite", Object(t.nextTick)(function() {
                h.emit("keyBoardChange", "handwrite");
              })) : I.showMode = "default";
              break;
            case "symbol":
              I.showMode = "default", (Te = w.modeList) !== null && Te !== void 0 && Te.find(function(Ae) {
                return Ae === "symbol";
              }) && Object(t.nextTick)(function() {
                var Ae, tt;
                (Ae = K.value) === null || Ae === void 0 || Ae.click({ data: ".?123", type: "change2num" }), (tt = K.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              I.showMode = "default";
              break;
          }
        }
        function de(ke) {
          if (I.visible = !0, xe = ke.target, ce(xe.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
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
        function ge() {
          w.closeOnClickModal && le(), N("modalClick");
        }
        function Re() {
          var ke;
          if (document.querySelector(".key-board-modal")) {
            var _e;
            (_e = document.querySelector(".key-board-modal")) === null || _e === void 0 || _e.addEventListener("click", ge);
          } else {
            var Te = document.createElement("div");
            Te.className = "key-board-modal", Te.style.display = "none", (ke = document.querySelector("body")) === null || ke === void 0 || ke.appendChild(Te), Te.addEventListener("click", ge);
          }
        }
        function Ue() {
          w.handApi && pe(w.handApi), [].concat(y(document.querySelectorAll("input")), y(document.querySelectorAll("textarea"))).forEach(function(ke) {
            ke.getAttribute("data-mode") !== null && (Ze.push(ke), ke.addEventListener("focus", de), w.blurHide && ke.addEventListener("blur", le));
          });
        }
        function De(ke) {
          if (!xe) return "";
          var _e = xe, Te = _e.selectionStart, Ae = _e.selectionEnd;
          if (!Te || !Ae) return "";
          var tt = ke.substring(0, Te - 1) + ke.substring(Ae);
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
        function lt(ke, _e) {
          if (!xe) return "";
          var Te = xe, Ae = Te.selectionStart || 0, tt = Te.selectionEnd || 0, xt = ke.substring(0, Ae) + _e + ke.substring(tt);
          return Te.value = xt, Te.focus(), Te.selectionStart = Ae + _e.length, Te.selectionEnd = Ae + _e.length, xt;
        }
        function Ce(ke) {
          if (xe) {
            var _e = lt(xe.value, ke);
            xe.value = _e, N("change", _e, xe.getAttribute("data-prop") || xe), N("keyChange", ke, xe.getAttribute("data-prop") || xe);
          }
        }
        function Ke(ke) {
          var _e = new RegExp("^".concat(ke, "\\w*")), Te = Object.keys(he).filter(function(Ae) {
            return _e.test(Ae);
          }).sort();
          I.resultVal = { code: ke, value: ke ? Te.length > 1 ? Te.reduce(function(Ae, tt) {
            return Ae + he[tt];
          }, "") : he[Te[0]] : "" }, xe && N("keyChange", ke, xe.getAttribute("data-prop") || xe);
        }
        function $e() {
          Ue();
        }
        function Ye() {
          return xe;
        }
        return Object(t.onMounted)(function() {
          w.modal && Re(), Ue(), h.on("resultReset", function() {
            I.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var ke;
          (ke = document.querySelector(".key-board-modal")) === null || ke === void 0 || ke.removeEventListener("click", ge), Ze.forEach(function(_e) {
            _e.removeEventListener("focus", de), _e.removeEventListener("blur", le);
          });
        }), D(Object(t.reactive)({ color: w.color, modeList: w.modeList, handApi: w.handApi, closeKeyBoard: function() {
          le();
        }, changeDefaultBoard: function() {
          I.showMode = "default";
        } })), d(d({}, Object(t.toRefs)(I)), {}, { defaultBoardRef: K, getCurrentInput: Ye, translate: Ke, reSignUp: $e, trigger: ze, change: Ce });
      } });
      et.render = i;
      var Qe = et;
      Qe.install = function(w) {
        w.component(Qe.name, Qe);
      };
      var gt = Qe, At = gt;
      f.default = At;
    }, fb6a: function(a, f, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), c = e("fc6a"), i = e("8418"), s = e("b622"), l = e("1dde"), d = l("slice"), m = s("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !d }, { slice: function(g, b) {
        var y, j, E, x = c(this), S = u(x.length), h = t(g, S), O = t(b === void 0 ? S : b, S);
        if (o(x) && (y = x.constructor, typeof y != "function" || y !== Array && !o(y.prototype) ? r(y) && (y = y[m], y === null && (y = void 0)) : y = void 0, y === Array || y === void 0)) return p.call(x, h, O);
        for (j = new (y === void 0 ? Array : y)(v(O - h, 0)), E = 0; h < O; h++, E++) h in x && i(j, E, x[h]);
        return j.length = E, j;
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
})(Tt);
var Jn = Tt.exports;
const Lt = /* @__PURE__ */ Xn(Jn);
It({
  components: { KeyBoard: Lt },
  setup() {
    function be(ne, te) {
      console.log("change value ---->", ne), console.log("change input dom ---->", te);
    }
    return {
      change: be
    };
  }
});
const Zn = { class: "wifi-component" }, er = { class: "row" }, tr = { class: "column" }, nr = { class: "column" }, rr = { class: "status" }, or = { class: "row" }, ir = { class: "column" }, ar = {
  __name: "WiFi",
  setup(be) {
    const ne = oe("未连接"), te = oe(""), a = oe(""), f = () => {
      alert("验证 WiFi: " + te.value);
    }, e = () => {
      alert("连接到 WiFi: " + te.value), ne.value = "已连接到 " + te.value;
    }, n = (r, o) => {
      o.placeholder === "WiFi 名称" ? te.value = r : o.placeholder === "WiFi 密码" && (a.value = r);
    };
    return (r, o) => (Ie(), Ne("div", Zn, [
      A("div", er, [
        A("div", tr, [
          pt(A("input", {
            "onUpdate:modelValue": o[0] || (o[0] = (t) => te.value = t),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, te.value]
          ])
        ]),
        A("div", nr, [
          A("div", rr, " WiFi 状态: " + Fe(ne.value), 1)
        ])
      ]),
      A("div", or, [
        A("div", ir, [
          pt(A("input", {
            "onUpdate:modelValue": o[1] || (o[1] = (t) => a.value = t),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, a.value]
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
  setup(be, { emit: ne }) {
    const te = be, a = ne, f = oe([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = oe("");
    at(() => te.showKeyboard, (r) => {
      r && (e.value = te.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", e.value), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (Ie(), Ne("div", cr, [
      A("div", sr, [
        A("div", lr, Fe(e.value), 1),
        (Ie(!0), Ne(ut, null, ct(f.value, (t) => (Ie(), Ne("div", {
          key: t.join(),
          class: "row"
        }, [
          (Ie(!0), Ne(ut, null, ct(t, (u) => (Ie(), Ne("button", {
            key: u,
            onClick: (c) => n(u),
            class: it({ "function-key": u === "清除" || u === "确定" })
          }, Fe(u), 11, fr))), 128))
        ]))), 128))
      ])
    ])) : ft("", !0);
  }
}, kt = /* @__PURE__ */ ot(dr, [["__scopeId", "data-v-2ccc1cb7"]]), pr = { class: "container" }, vr = { class: "column" }, hr = { class: "status-bar" }, gr = ["disabled"], mr = { class: "column" }, yr = {
  key: 0,
  class: "modal"
}, br = { class: "modal-content" }, wr = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(be, { emit: ne }) {
    const { sendToPyQt: te } = rt(), a = ht({
      isPyQtWebEngine: !1
    }), f = oe("未激活"), e = oe(0), n = oe(""), r = oe(""), o = oe(!1), t = oe(60);
    let u, c;
    const i = oe(0), s = oe(1), l = oe(null), d = oe(!1), m = oe(!1), p = dt(() => f.value === "未激活" ? "设备状态: 未激活" : f.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${s.value} 次锁定 - 剩余时间: ${v.value}`), v = dt(() => {
      const G = Math.floor(e.value / 86400), W = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), D = Math.floor(e.value % (60 * 60) / 60), T = e.value % 60;
      return `${G}天 ${W.toString().padStart(2, "0")}:${D.toString().padStart(2, "0")}:${T.toString().padStart(2, "0")}`;
    }), g = dt(() => f.value === "未激活" ? "按住以激活设备" : n.value);
    function b(G) {
      f.value === "未激活" && (G.target.setPointerCapture(G.pointerId), i.value = 0, c = setInterval(() => {
        i.value += 2, i.value >= 100 && (clearInterval(c), E());
      }, 30));
    }
    function y(G) {
      G.target.releasePointerCapture(G.pointerId), j();
    }
    function j() {
      clearInterval(c), i.value = 0;
    }
    function E() {
      te("activate_device", {});
    }
    function x(G, W) {
      te("Lock_set_response", { method: "activateDevice", args: { randomCode: G, time: W } }), f.value = "已激活", n.value = G, l.value = W, S();
    }
    function S() {
      h(), u = setInterval(() => {
        e.value > 0 ? h() : O();
      }, 1e3);
    }
    function h() {
      const G = Date.now(), W = l.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((W - G) / 1e3));
    }
    function O() {
      o.value = !0, clearInterval(u), ae();
    }
    function _() {
      C(r.value);
    }
    function C(G) {
      te("check_lock_password", {
        target: "attemptUnlock",
        password: G,
        lockCount: s.value,
        deviceRandomCode: n.value
      }), r.value = "";
    }
    function k() {
      f.value = "永久激活", o.value = !1, clearInterval(u);
    }
    function $() {
      o.value = !1, s.value++, u && clearInterval(u), S();
    }
    St(() => {
      clearInterval(u), clearInterval(c);
    }), st(() => {
      if (a.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, a.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: G } = rt();
        at(G, (W) => {
          if (W && W.type === "confirm_lock_password")
            try {
              const D = JSON.parse(W.content);
              D.target === "attemptUnlock" && (D.result === "success" ? (o.value ? l.value = Date.now() : l.value = l.value + t.value * 1e3, te("update_baseTime", l.value), $(), te("Lock_set_response", { method: "extendLockTime", args: { baseTime: l.value } })) : D.result === "forever_success" ? (k(), te("Lock_set_response", { method: "permanentUnlock", args: {} })) : te("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (D) {
              console.error("Failed to parse confirm lock password :", D);
            }
          else if (W && W.type === "device_activated")
            try {
              const D = JSON.parse(W.content);
              x(D.device_random_code, D.device_base_time);
            } catch (D) {
              console.error("Failed to parse device activation result:", D);
            }
          else if (W && W.type === "device_info")
            try {
              const D = JSON.parse(W.content);
              f.value = D.device_status, n.value = D.device_random_code, s.value = D.device_lock_count, l.value = D.device_base_time, D.device_status === "已激活" ? S() : D.device_status === "永久激活" && k();
            } catch (D) {
              console.error("Failed to parse device status:", D);
            }
          else if (W && W.type === "Lock_init")
            F();
          else if (W && W.type === "Lock_set") {
            console.log("Lock_set:", W.content);
            const D = JSON.parse(W.content);
            D.method === "requestActivation" ? E() : D.method === "attemptUnlock" && C(D.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const F = () => {
      const G = {
        deviceStatus: f.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: r.value,
        isLocked: o.value,
        lockInterval: t.value,
        lockCount: s.value,
        baseTime: l.value,
        progressWidth: i.value,
        showUnlockKeyboard: d.value,
        showModalUnlockKeyboard: m.value
      };
      console.log("Sending Lock initial state:", G), te("Lock_init_response", G);
    }, J = ne, ae = () => {
      J("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (G, W) => (Ie(), Ne("div", pr, [
      A("div", vr, [
        A("div", hr, Fe(p.value), 1),
        A("button", {
          class: "activation-button",
          onPointerdown: b,
          onPointerup: y,
          onPointercancel: j,
          onPointerleave: j,
          disabled: f.value !== "未激活"
        }, [
          wt(Fe(g.value) + " ", 1),
          A("div", {
            class: "progress-bar",
            style: _t({ width: i.value + "%" })
          }, null, 4)
        ], 40, gr)
      ]),
      A("div", mr, [
        pt(A("input", {
          "onUpdate:modelValue": W[0] || (W[0] = (D) => r.value = D),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: W[1] || (W[1] = (D) => d.value = !0)
        }, null, 544), [
          [vt, r.value]
        ]),
        A("button", {
          class: "unlock-button",
          onClick: _
        }, "解锁")
      ]),
      o.value ? (Ie(), Ne("div", yr, [
        A("div", br, [
          W[8] || (W[8] = A("h3", null, "设备已锁定", -1)),
          A("h3", null, "第 " + Fe(s.value) + " 次锁定", 1),
          A("h3", null, "设备随机码: " + Fe(n.value), 1),
          pt(A("input", {
            "onUpdate:modelValue": W[2] || (W[2] = (D) => r.value = D),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: W[3] || (W[3] = (D) => m.value = !0)
          }, null, 544), [
            [vt, r.value]
          ]),
          A("button", {
            class: "unlock-button",
            onClick: _
          }, "解锁")
        ])
      ])) : ft("", !0),
      Xe(kt, {
        modelValue: r.value,
        "onUpdate:modelValue": W[4] || (W[4] = (D) => r.value = D),
        showKeyboard: d.value,
        "onUpdate:showKeyboard": W[5] || (W[5] = (D) => d.value = D)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Xe(kt, {
        modelValue: r.value,
        "onUpdate:modelValue": W[6] || (W[6] = (D) => r.value = D),
        showKeyboard: m.value,
        "onUpdate:showKeyboard": W[7] || (W[7] = (D) => m.value = D)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, xr = /* @__PURE__ */ ot(wr, [["__scopeId", "data-v-db2d397c"]]), kr = { class: "app-container" }, _r = {
  __name: "App",
  setup(be) {
    Rt();
    const ne = oe(""), te = (a) => {
      ne.value = a;
    };
    return (a, f) => (Ie(), Ne("div", kr, [
      f[0] || (f[0] = A("h1", null, "涪特智能养护台车控制系统", -1)),
      Xe(yn),
      Xe(Gn),
      Xe(on),
      Xe(Wn, { message: ne.value }, null, 8, ["message"]),
      Xe(ur),
      Xe(xr, { onMessageFromA: te })
    ]));
  }
};
export {
  _r as default
};
