import Pt, { ref as J, onMounted as ft, provide as yt, readonly as bt, inject as wt, watch as ot, openBlock as we, createElementBlock as ke, createElementVNode as E, toDisplayString as Ne, Fragment as it, renderList as at, normalizeClass as lt, createCommentVNode as rt, reactive as mt, createVNode as He, withDirectives as st, vModelRadio as St, createTextVNode as dt, vModelText as pt, onUnmounted as kt, computed as ht, normalizeStyle as jt, vModelCheckbox as It, defineComponent as Bt, unref as Rt } from "vue";
const Et = Symbol(), Ct = Symbol(), Tt = Symbol();
function $t(be, ee) {
  be && be.messageSignal ? be.messageSignal.connect((te) => {
    try {
      const a = JSON.parse(te);
      ee.value = a, console.log("Received message from PyQt:", a);
    } catch (a) {
      console.error("Failed to parse message:", a), ee.value = { type: "unknown", content: te };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Ut() {
  const be = J(null), ee = J(null), te = J("");
  function a() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      be.value = d, ee.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), $t(ee.value, te), ee.value && typeof ee.value.vueReady == "function" ? ee.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ft(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? a() : document.addEventListener("DOMContentLoaded", a);
  }), yt(Et, bt(be)), yt(Ct, bt(ee)), yt(Tt, bt(te));
}
function Je() {
  const be = wt(Et), ee = wt(Ct), te = wt(Tt);
  return (!be || !ee || !te) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: be,
    bridge: ee,
    message: te,
    sendToPyQt: (d, e) => {
      if (console.log(`Attempting to call ${d} with args:`, e), ee && ee.value)
        if (typeof ee.value.sendToPyQt == "function")
          try {
            ee.value.sendToPyQt(d, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(ee.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const ct = (be, ee) => {
  const te = be.__vccOpts || be;
  for (const [a, d] of ee)
    te[a] = d;
  return te;
}, Mt = {
  key: 0,
  class: "numeric-keyboard"
}, Dt = { class: "keyboard" }, Ft = { class: "current-value" }, Vt = ["onClick"], Wt = {
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
  setup(be, { emit: ee }) {
    const te = be, a = ee, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = J("");
    ot(() => te.showKeyboard, (r) => {
      r && (e.value = te.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (we(), ke("div", Mt, [
      E("div", Dt, [
        E("div", Ft, Ne(e.value), 1),
        (we(!0), ke(it, null, at(d.value, (t) => (we(), ke("div", {
          key: t.join(),
          class: "row"
        }, [
          (we(!0), ke(it, null, at(t, (u) => (we(), ke("button", {
            key: u,
            onClick: (s) => n(u),
            class: lt({ "function-key": u === "清除" || u === "确定" })
          }, Ne(u), 11, Vt))), 128))
        ]))), 128))
      ])
    ])) : rt("", !0);
  }
}, xt = /* @__PURE__ */ ct(Wt, [["__scopeId", "data-v-541feda2"]]), qt = { class: "settings-container" }, zt = { class: "setting-group" }, Kt = { class: "setting-item" }, Qt = { class: "setting-controls" }, Ht = ["value"], Gt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Yt = ["value"], Xt = { class: "setting-group" }, Zt = { class: "setting-item" }, en = { class: "setting-controls" }, tn = ["value"], nn = { class: "setting-item" }, rn = { class: "setting-controls" }, on = ["value"], an = {
  __name: "SensorSettings",
  setup(be) {
    const { sendToPyQt: ee } = Je(), te = mt({
      isPyQtWebEngine: !1
    }), a = J(35), d = J(25), e = J(95), n = J(90), r = J(!1), o = J(null), t = J("");
    ft(() => {
      if (te.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, te.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: h } = Je();
        ot(h, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const m = JSON.parse(p.content);
              a.value = m.temp_upper, d.value = m.temp_lower, e.value = m.humidity_upper, n.value = m.humidity_lower, console.log("Sensor Settings updated:", m);
            } catch (m) {
              console.error("Failed to parse sensor settings data:", m);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), l();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const g = JSON.parse(p.content).args;
            a.value = g.temp_upper, d.value = g.temp_lower, e.value = g.humidity_upper, n.value = g.humidity_lower, l();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (h, p) => {
      const m = h === "tempUpper" ? a : h === "tempLower" ? d : h === "humidityUpper" ? e : n;
      m.value = (m.value || 0) + p, h.startsWith("temp") ? s(h === "tempUpper" ? "upper" : "lower") : i(h === "humidityUpper" ? "upper" : "lower");
    }, s = (h) => {
      a.value === "" && (a.value = d.value + 1), d.value === "" && (d.value = a.value - 1), h === "upper" ? a.value = Math.max(d.value + 1, a.value) : d.value = Math.min(a.value - 1, d.value), l();
    }, i = (h) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), h === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), l();
    }, l = () => {
      if (a.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const h = {
          temp_upper: a.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", h), te.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ee("updateLimitSettings", h)) : console.log("在普通网页环境中执行更新设置");
      }
    }, c = (h) => {
      o.value = h, r.value = !0, t.value = h.startsWith("temp") ? h === "tempUpper" ? a.value : d.value : h === "humidityUpper" ? e.value : n.value;
    }, f = (h) => {
      const p = parseFloat(h);
      isNaN(p) || (o.value === "tempUpper" ? (a.value = p, s("upper")) : o.value === "tempLower" ? (d.value = p, s("lower")) : o.value === "humidityUpper" ? (e.value = p, i("upper")) : o.value === "humidityLower" && (n.value = p, i("lower"))), o.value = null;
    };
    return (h, p) => (we(), ke("div", qt, [
      E("div", zt, [
        p[15] || (p[15] = E("h2", null, "温度设置 (°C)", -1)),
        E("div", Kt, [
          p[13] || (p[13] = E("span", { class: "setting-label" }, "上限：", -1)),
          E("div", Qt, [
            E("button", {
              onClick: p[0] || (p[0] = (m) => u("tempUpper", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: a.value,
              onFocus: p[1] || (p[1] = (m) => c("tempUpper")),
              readonly: ""
            }, null, 40, Ht),
            E("button", {
              onClick: p[2] || (p[2] = (m) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        E("div", Gt, [
          p[14] || (p[14] = E("span", { class: "setting-label" }, "下限：", -1)),
          E("div", Jt, [
            E("button", {
              onClick: p[3] || (p[3] = (m) => u("tempLower", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (m) => c("tempLower")),
              readonly: ""
            }, null, 40, Yt),
            E("button", {
              onClick: p[5] || (p[5] = (m) => u("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      E("div", Xt, [
        p[18] || (p[18] = E("h2", null, "湿度设置 (%)", -1)),
        E("div", Zt, [
          p[16] || (p[16] = E("span", { class: "setting-label" }, "上限：", -1)),
          E("div", en, [
            E("button", {
              onClick: p[6] || (p[6] = (m) => u("humidityUpper", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (m) => c("humidityUpper")),
              readonly: ""
            }, null, 40, tn),
            E("button", {
              onClick: p[8] || (p[8] = (m) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        E("div", nn, [
          p[17] || (p[17] = E("span", { class: "setting-label" }, "下限：", -1)),
          E("div", rn, [
            E("button", {
              onClick: p[9] || (p[9] = (m) => u("humidityLower", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (m) => c("humidityLower")),
              readonly: ""
            }, null, 40, on),
            E("button", {
              onClick: p[11] || (p[11] = (m) => u("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      He(xt, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": p[12] || (p[12] = (m) => r.value = m)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, un = /* @__PURE__ */ ct(an, [["__scopeId", "data-v-c66c99de"]]), sn = {
  key: 0,
  class: "numeric-keyboard"
}, cn = { class: "keyboard" }, ln = { class: "current-value" }, dn = ["onClick"], fn = {
  __name: "NumericKeyboardWithNeg",
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
  setup(be, { emit: ee }) {
    const te = be, a = ee, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = J("");
    ot(() => te.showKeyboard, (r) => {
      r && (e.value = te.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : r === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : r === "." && e.value.includes(".") || (e.value += r);
    };
    return (r, o) => be.showKeyboard ? (we(), ke("div", sn, [
      E("div", cn, [
        E("div", ln, Ne(e.value), 1),
        (we(!0), ke(it, null, at(d.value, (t) => (we(), ke("div", {
          key: t.join(),
          class: "row"
        }, [
          (we(!0), ke(it, null, at(t, (u) => (we(), ke("button", {
            key: u,
            onClick: (s) => n(u),
            class: lt({
              "function-key": ["清除", "确定"].includes(u),
              "operator-key": u === "-"
            })
          }, Ne(u), 11, dn))), 128))
        ]))), 128))
      ])
    ])) : rt("", !0);
  }
}, pn = /* @__PURE__ */ ct(fn, [["__scopeId", "data-v-3f49a3dc"]]), vn = { class: "sensor-data-group" }, hn = { class: "sensor-section" }, mn = { class: "sensor-container" }, gn = { class: "sensor-grid" }, yn = ["onClick"], bn = { class: "sensor-title" }, wn = { class: "sensor-value" }, kn = { class: "sensor-section" }, xn = { class: "sensor-container" }, _n = { class: "sensor-grid" }, Sn = ["onClick"], On = { class: "sensor-title" }, jn = { class: "sensor-value" }, En = {
  key: 0,
  class: "dialog-overlay"
}, Cn = { class: "dialog" }, Tn = { class: "dialog-content" }, Ln = { class: "radio-group" }, An = { class: "input-group" }, Nn = ["placeholder"], Pn = { class: "dialog-actions" }, In = {
  __name: "SensorDisplay",
  setup(be) {
    const ee = J({ temperature: {}, humidity: {} }), te = J({
      temperature: {},
      humidity: {}
    }), a = J(null), d = J(!1), e = J("offset"), n = J(""), r = J(!1), { sendToPyQt: o } = Je();
    ft(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: c } = Je();
        ot(c, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              ee.value = JSON.parse(f.content);
            } catch (h) {
              console.error("Failed to parse sensor data:", h);
            }
          else if (f && f.type === "update_adjust_settings")
            try {
              const h = JSON.parse(f.content);
              te.value.temperature = h.temperature, te.value.humidity = h.humidity;
            } catch (h) {
              console.error("Failed to parse adjustments data:", h);
            }
          else f && f.type === "get_sensor_data" ? o("update_remote_sensor_data", ee.value) : f && f.type === "sensor_debug_mode" && (r.value = JSON.parse(f.content));
        });
      } else
        console.log("在普通网页环境中执行"), t(), setInterval(t, 5e3);
    });
    const t = async () => {
      try {
        const c = await fetch("http://localhost:8000/api/sensor-data/");
        if (!c.ok)
          throw new Error(`HTTP error! status: ${c.status}`);
        const f = await c.json();
        ee.value = f;
      } catch (c) {
        console.error("Error fetching sensor data:", c);
      }
    }, u = J(!1), s = J(""), i = (c, f) => {
      a.value = f, n.value = c;
      const h = te.value[c][f];
      h ? (e.value = h.type, s.value = String(h.value)) : (e.value = "offset", s.value = ""), d.value = !0, u.value = !1;
    }, l = async () => {
      try {
        const c = {
          sensorType: n.value,
          sensorId: a.value,
          adjustmentType: e.value,
          value: parseFloat(s.value) || 0
        };
        te.value[n.value] || (te.value[n.value] = {}), te.value[n.value][a.value] = {
          type: e.value,
          value: parseFloat(s.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && o("adjust_sensor", c), d.value = !1, s.value = "", u.value = !1;
      } catch (c) {
        console.error("Error applying adjustment:", c);
      }
    };
    return (c, f) => (we(), ke("div", vn, [
      E("div", hn, [
        f[7] || (f[7] = E("h2", null, "温度传感器", -1)),
        E("div", mn, [
          E("div", gn, [
            (we(!0), ke(it, null, at(ee.value.temperature, (h, p) => (we(), ke("div", {
              key: p,
              class: "sensor-card",
              onClick: (m) => r.value ? i("temperature", p) : null
            }, [
              E("div", bn, Ne(p), 1),
              E("div", wn, Ne(h), 1)
            ], 8, yn))), 128))
          ])
        ])
      ]),
      E("div", kn, [
        f[8] || (f[8] = E("h2", null, "湿度传感器", -1)),
        E("div", xn, [
          E("div", _n, [
            (we(!0), ke(it, null, at(ee.value.humidity, (h, p) => (we(), ke("div", {
              key: p,
              class: "sensor-card",
              onClick: (m) => r.value ? i("humidity", p) : null
            }, [
              E("div", On, Ne(p), 1),
              E("div", jn, Ne(h), 1)
            ], 8, Sn))), 128))
          ])
        ])
      ]),
      d.value ? (we(), ke("div", En, [
        E("div", Cn, [
          E("h3", null, "调整传感器: " + Ne(a.value), 1),
          E("div", Tn, [
            E("div", Ln, [
              E("label", null, [
                st(E("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (h) => e.value = h),
                  value: "offset"
                }, null, 512), [
                  [St, e.value]
                ]),
                f[9] || (f[9] = dt(" 调整偏移值 "))
              ]),
              E("label", null, [
                st(E("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (h) => e.value = h),
                  value: "value"
                }, null, 512), [
                  [St, e.value]
                ]),
                f[10] || (f[10] = dt(" 直接设置值 "))
              ])
            ]),
            E("div", An, [
              st(E("input", {
                type: "text",
                "onUpdate:modelValue": f[2] || (f[2] = (h) => s.value = h),
                readonly: "",
                onClick: f[3] || (f[3] = (h) => u.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Nn), [
                [pt, s.value]
              ])
            ])
          ]),
          E("div", Pn, [
            E("button", {
              onClick: f[4] || (f[4] = (h) => d.value = !1)
            }, "取消"),
            E("button", {
              onClick: l,
              class: "primary"
            }, "确定")
          ])
        ]),
        He(pn, {
          modelValue: s.value,
          "onUpdate:modelValue": f[5] || (f[5] = (h) => s.value = h),
          showKeyboard: u.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (h) => u.value = h)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : rt("", !0)
    ]));
  }
}, Bn = /* @__PURE__ */ ct(In, [["__scopeId", "data-v-6f1225eb"]]), Rn = { class: "integrated-control-system" }, $n = { class: "mode-controls" }, Un = ["disabled"], Mn = ["disabled"], Dn = { class: "systems-container" }, Fn = { class: "steam-engine-control" }, Vn = { class: "control-panel" }, Wn = { class: "engine-status" }, qn = { class: "engine left" }, zn = ["disabled"], Kn = { class: "engine right" }, Qn = ["disabled"], Hn = { class: "sprinkler-system" }, Gn = { class: "controls" }, Jn = { class: "input-group" }, Yn = ["value"], Xn = { class: "input-group" }, Zn = ["value"], er = { class: "input-group" }, tr = ["value"], nr = { class: "visualization" }, rr = ["onClick"], or = { class: "status" }, ir = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(be) {
    const ee = J(!1), te = J(!1), a = J(10), d = J(0), e = J(10), n = J(a.value), r = J(d.value), o = J(e.value), t = J(a.value), u = J(d.value), s = J(e.value), i = J(0), l = J(""), c = J(Array(12).fill(0)), f = J(0), h = J(!0), p = J(!1), m = J(!1), g = J(null), y = J(""), b = J(!1), O = J(15), C = J(""), k = J(""), w = J(0), { sendToPyQt: v } = Je(), j = J(0), S = mt({
      isPyQtWebEngine: !1
    }), T = J([]);
    let _, M, D;
    const Z = be;
    ot(() => Z.message, (H) => {
      H != null && H.content && (h.value ? A("manual") : A("auto"));
    }), ft(() => {
      if (S.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, S.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = Je();
        ot(H, (N) => {
          if (N && N.type === "update_left_steam_status")
            ee.value = N.content;
          else if (N && N.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), W();
          else if (N && N.type === "update_right_steam_status")
            te.value = N.content;
          else if (N && N.type === "update_sprinkler_settings")
            try {
              const Y = JSON.parse(N.content);
              t.value = Y.sprinkler_single_run_time, u.value = Y.sprinkler_run_interval_time, s.value = Y.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = s.value, console.log("Sprinkler Settings updated:", Y);
            } catch (Y) {
              console.error("Failed to parse sprinkler settings data:", Y);
            }
          else if (N && N.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", N.content);
            const ye = JSON.parse(N.content).args;
            t.value = ye.sprinkler_single_run_time, u.value = ye.sprinkler_run_interval_time, s.value = ye.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = s.value, Te();
          } else if (N && N.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", N.content);
            const Y = JSON.parse(N.content);
            Y.method === "startSystem" ? Ee() : Y.method === "stopSystem" ? Oe() : Y.method === "setMode" ? A(Y.args.mode) : Y.method === "click_toggleEngine" ? ne() : Y.method === "toggleManualSprinkler" && ge(Y.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), kt(() => {
      clearInterval(D), clearInterval(M), G();
    });
    const ae = (H) => {
      H !== void 0 && clearTimeout(H);
    }, G = () => {
      T.value.forEach((H) => {
        ae(H);
      }), T.value = [];
    }, W = () => {
      const H = {
        leftEngineOn: ee.value,
        rightEngineOn: te.value,
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
        isAutoMode: h.value,
        isRunning: p.value,
        isSwitching: b.value,
        switchingTime: O.value,
        switchingMessage: C.value,
        switchPhase: k.value,
        phaseStartTime: j.value,
        chose_n: w.value
      };
      v("IntegratedControlSystem_init_response", H);
    }, F = ht(() => b.value ? `${C.value}，还需${O.value}秒` : h.value ? p.value ? l.value === "run" ? `喷头 ${i.value} 正在运行，剩余 ${f.value + 1} 秒` : l.value === "interval" ? `运行间隔中，剩余 ${f.value + 1} 秒` : l.value === "loop" ? `喷雾时间，距下次喷淋系统工作剩余 ${f.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    async function L(H, N) {
      return k.value = N, b.value = !0, O.value = 15, j.value = Date.now(), C.value = H ? "正在切换到喷淋管" : "正在切换到喷雾机", v("controlSprinkler", { target: "switchToSprinkler", state: H }), D = setInterval(() => {
        O.value--, O.value <= 0 && (clearInterval(D), b.value = !1);
      }, 1e3), new Promise((Y) => {
        _ = setTimeout(() => {
          b.value = !1, Y();
        }, O.value * 1e3), T.value.push(_);
      });
    }
    async function A(H) {
      const N = h.value;
      if (h.value = H === "auto", N !== h.value)
        if (S.isPyQtWebEngine && (v("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: H } }), v("controlSprinkler", { target: "setMode", mode: h.value ? "auto" : "manual" })), h.value) {
          clearInterval(D), G(), b.value = !1, ee.value && await Q();
          const Y = c.value.findIndex((ye) => ye === 100);
          Y !== -1 && (c.value[Y] = 0, S.isPyQtWebEngine && v("controlSprinkler", { target: "manual_control_sprayer", index: Y + 1, state: 0 })), v("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await Oe();
    }
    async function Q() {
      S.isPyQtWebEngine && (v("setEngineState", { engine: "left", state: !ee.value }), v("setEngineState", { engine: "right", state: !te.value }), ee.value = !ee.value, te.value = !te.value);
    }
    async function ne() {
      const H = c.value.findIndex((N) => N === 100);
      S.isPyQtWebEngine && H === -1 && (v("IntegratedControlSystem_set_response", { method: "click_toggleEngine", args: {} }), ee.value ? v("controlSprinkler", { target: "tankWork", state: 0 }) : (await L(0, "click_toggleEngine"), v("controlSprinkler", { target: "tankWork", state: 1 })), v("setEngineState", { engine: "left", state: !ee.value }), v("setEngineState", { engine: "right", state: !te.value }), ee.value = !ee.value, te.value = !te.value);
    }
    function U(H) {
      g.value = H, m.value = !0, y.value = H === "singleRunTime" ? t.value.toString() : H === "runIntervalTime" ? u.value.toString() : s.value.toString();
    }
    function xe(H) {
      const N = parseInt(H);
      isNaN(N) || (g.value === "singleRunTime" ? (t.value = N, pe()) : g.value === "runIntervalTime" ? (u.value = N, Pe()) : g.value === "loopInterval" && (s.value = N, Be())), g.value = null;
    }
    function pe() {
      t.value = Math.max(1, t.value), n.value = t.value, Te();
    }
    function Pe() {
      u.value = Math.max(0, u.value), r.value = u.value, Te();
    }
    function Be() {
      s.value = Math.max(0, s.value), o.value = s.value, Te();
    }
    function Te() {
      if (S.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const H = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        v("controlSprinkler", { target: "settings", settings: JSON.stringify(H) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function Ee() {
      v("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(p.value || !h.value) && (p.value = !0, c.value = Array(12).fill(0), await Ge());
    }
    async function Oe() {
      v("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), S.isPyQtWebEngine && (i.value > 0 && v("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), v("controlSprinkler", { target: "setState", state: !1 })), ee.value && await Q(), Ve(), v("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function Ve() {
      p.value = !1, b.value = !1, clearInterval(D), clearInterval(M), G(), i.value = 0, l.value = "", c.value = Array(12).fill(0), f.value = 0;
    }
    async function Ge() {
      await L(1, "runCycle"), i.value = 1, v("controlSprinkler", { target: "tankWork", state: 1 }), X();
    }
    async function B() {
      i.value = 1, X();
    }
    function R() {
      !p.value || !h.value || (f.value--, f.value > 0 && (_ = setTimeout(R, 1e3), T.value.push(_)));
    }
    function X() {
      if (!p.value || !h.value) return;
      l.value = "run", a.value = n.value, f.value = a.value, j.value = Date.now(), R();
      let H = Date.now();
      v("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 1 }), M = setInterval(() => {
        let N = Date.now() - H, Y = Math.min(N / (a.value * 1e3), 1);
        c.value[i.value - 1] = Y * 100;
      }, 100), _ = setTimeout(async () => {
        clearInterval(M), i.value < 12 ? (c.value[i.value - 1] = 0, v("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), V()) : (c.value[i.value - 1] = 0, v("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), re());
      }, a.value * 1e3), T.value.push(_);
    }
    function V() {
      !p.value || !h.value || (d.value = r.value, f.value = d.value, j.value = Date.now(), f.value > 0 && (l.value = "interval"), R(), _ = setTimeout(() => {
        i.value++, X();
      }, d.value * 1e3), T.value.push(_));
    }
    async function re() {
      !p.value || !h.value || (e.value = o.value, f.value = e.value, f.value > 0 ? (v("controlSprinkler", { target: "tankWork", state: 0 }), await L(0, "runLoopInterval"), v("controlSprinkler", { target: "setState", state: !0 }), j.value = Date.now(), l.value = "loop", R(), i.value = 0, _ = setTimeout(async () => {
        c.value = Array(12).fill(0), v("controlSprinkler", { target: "setState", state: !1 }), ee.value && await Q(), v("controlSprinkler", { target: "tankWork", state: 0 }), await Ge();
      }, e.value * 1e3), T.value.push(_)) : (i.value = 0, c.value = Array(12).fill(0), await B()));
    }
    function ie(H) {
      return c.value[H - 1];
    }
    async function ge(H) {
      if (h.value) return;
      v("IntegratedControlSystem_set_response", { method: "toggleManualSprinkler", args: { n: H } });
      const N = c.value.findIndex((Y) => Y === 100);
      c.value[H - 1] > 0 ? (c.value[H - 1] = 0, S.isPyQtWebEngine && (v("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 0 }), v("controlSprinkler", { target: "tankWork", state: 0 }))) : N !== -1 ? (c.value[N] = 0, S.isPyQtWebEngine && v("controlSprinkler", { target: "manual_control_sprayer", index: N + 1, state: 0 }), c.value[H - 1] = 100, S.isPyQtWebEngine && v("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 1 })) : (w.value = H, await L(1, "toggleManualSprinkler"), v("controlSprinkler", { target: "tankWork", state: 1 }), c.value[H - 1] = 100, S.isPyQtWebEngine && v("controlSprinkler", { target: "manual_control_sprayer", index: H, state: 1 }));
    }
    return (H, N) => (we(), ke("div", Rn, [
      N[16] || (N[16] = E("h2", null, "集成控制系统（支持自动/手动两种模式，自动模式下喷淋->喷雾->喷淋循环运行）", -1)),
      E("div", $n, [
        E("button", {
          onClick: N[0] || (N[0] = (Y) => A("auto")),
          class: lt([{ active: h.value }, "mode-btn"])
        }, "自动模式", 2),
        E("button", {
          onClick: N[1] || (N[1] = (Y) => A("manual")),
          class: lt([{ active: !h.value }, "mode-btn"])
        }, "手动模式", 2),
        E("button", {
          onClick: Ee,
          disabled: p.value || !h.value,
          class: "control-btn"
        }, "开始", 8, Un),
        E("button", {
          onClick: Oe,
          disabled: !p.value || !h.value,
          class: "control-btn"
        }, "停止", 8, Mn)
      ]),
      E("div", Dn, [
        E("div", Fn, [
          N[10] || (N[10] = E("h3", null, "雾化机系统", -1)),
          N[11] || (N[11] = E("label", null, "自动模式喷雾时间里，若存在传感器湿度低于湿度下限，左右雾化机开启，若所有传感器湿度高于湿度上限，左右雾化机关闭", -1)),
          E("div", Vn, [
            E("div", Wn, [
              E("div", qn, [
                N[7] || (N[7] = E("h4", null, "左雾化机", -1)),
                E("div", {
                  class: lt(["status", { on: ee.value }])
                }, [
                  N[6] || (N[6] = E("div", { class: "status-indicator" }, null, -1)),
                  dt(" " + Ne(ee.value ? "开" : "关"), 1)
                ], 2),
                E("button", {
                  onClick: ne,
                  disabled: h.value || b.value,
                  class: "control-btn"
                }, Ne(ee.value ? "关闭" : "开启"), 9, zn)
              ]),
              E("div", Kn, [
                N[9] || (N[9] = E("h4", null, "右雾化机", -1)),
                E("div", {
                  class: lt(["status", { on: te.value }])
                }, [
                  N[8] || (N[8] = E("div", { class: "status-indicator" }, null, -1)),
                  dt(" " + Ne(te.value ? "开" : "关"), 1)
                ], 2),
                E("button", {
                  onClick: ne,
                  disabled: h.value || b.value,
                  class: "control-btn"
                }, Ne(te.value ? "关闭" : "开启"), 9, Qn)
              ])
            ])
          ])
        ]),
        E("div", Hn, [
          N[15] || (N[15] = E("h3", null, "喷淋系统", -1)),
          E("div", Gn, [
            E("div", Jn, [
              N[12] || (N[12] = E("label", null, "单个喷淋头工作时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: t.value,
                onFocus: N[2] || (N[2] = (Y) => U("singleRunTime")),
                readonly: ""
              }, null, 40, Yn)
            ]),
            E("div", Xn, [
              N[13] || (N[13] = E("label", null, "喷淋头-喷淋头运行间隔时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: u.value,
                disabled: "",
                onFocus: N[3] || (N[3] = (Y) => U("runIntervalTime")),
                readonly: ""
              }, null, 40, Zn)
            ]),
            E("div", er, [
              N[14] || (N[14] = E("label", null, "喷雾时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: s.value,
                onFocus: N[4] || (N[4] = (Y) => U("loopInterval")),
                readonly: ""
              }, null, 40, tr)
            ])
          ]),
          E("div", nr, [
            (we(), ke(it, null, at(12, (Y) => E("div", {
              key: Y,
              class: lt(["sprinkler", { active: h.value ? i.value === Y : c.value[Y - 1] > 0 }]),
              onClick: (ye) => !b.value && !h.value && !ee.value && ge(Y)
            }, [
              E("div", {
                class: "water",
                style: jt({ height: ie(Y) + "%" })
              }, null, 4),
              E("span", null, Ne(Y), 1)
            ], 10, rr)), 64))
          ]),
          E("div", or, Ne(F.value), 1)
        ])
      ]),
      He(xt, {
        modelValue: y.value,
        showKeyboard: m.value,
        "onUpdate:modelValue": xe,
        "onUpdate:showKeyboard": N[5] || (N[5] = (Y) => m.value = Y)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, ar = /* @__PURE__ */ ct(ir, [["__scopeId", "data-v-962d8b81"]]), ur = { class: "data-actions" }, sr = {
  key: 0,
  class: "modal-overlay"
}, cr = { class: "modal-content settings-modal" }, lr = { class: "setting-group" }, dr = { class: "setting-item" }, fr = { class: "toggle-switch" }, pr = {
  key: 1,
  class: "modal-overlay"
}, vr = {
  key: 2,
  class: "modal-overlay"
}, hr = { class: "modal-content update-modal" }, mr = {
  key: 3,
  class: "modal-overlay"
}, gr = { class: "modal-content" }, yr = {
  __name: "DataExport",
  setup(be) {
    const { sendToPyQt: ee } = Je(), te = mt({
      isPyQtWebEngine: !1
    }), a = J(!1), d = J(!1), e = J(""), n = J(!1), r = J(!1), o = J(!1), t = J(!1), u = J(""), s = J(!1), i = () => {
      t.value = !0, u.value = "", document.body.style.overflow = "hidden";
    }, l = () => {
      if (!u.value) {
        O("请输入更新版号！");
        return;
      }
      te.isPyQtWebEngine && ee("updateVersion", { version: u.value }), t.value = !1, u.value = "", document.body.style.overflow = "auto";
    }, c = () => {
      t.value = !1, u.value = "", document.body.style.overflow = "auto";
    }, f = () => {
      o.value = r.value, n.value = !0, document.body.style.overflow = "hidden";
    }, h = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto";
    }, p = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto", te.isPyQtWebEngine && ee("saveDebugSettings", { debug_mode: r.value });
    };
    ft(() => {
      if (te.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, te.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: k } = Je();
        ot(k, (w) => {
          if (w && w.type === "update_debug_mode")
            try {
              const v = JSON.parse(w.content);
              r.value = v.debug_mode, o.value = v.debug_mode;
            } catch (v) {
              console.error("Failed to parse debug settings:", v);
            }
          else if (w && w.type === "DataExport_init") {
            const v = {
              debugMode: r.value
            };
            console.log("Sending initial DataExport state:", v), ee("DataExport_init_response", v);
          } else if (w && w.type === "clearData")
            ee("exportData", !1), ee("clearData_response", "");
          else if (w && w.type === "updateVersion_response")
            try {
              const v = JSON.parse(w.content);
              v.status === "success" ? O(`${v.message}，系统即将重启...`) : O(v.message);
            } catch (v) {
              O("解析更新响应失败：" + v);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const m = () => {
      te.isPyQtWebEngine && (console.log("导出数据"), ee("exportData", !0));
    }, g = () => {
      a.value = !0, document.body.style.overflow = "hidden";
    }, y = () => {
      a.value = !1, document.body.style.overflow = "auto";
    }, b = () => {
      console.log("清空数据"), a.value = !1, O("所有数据已清空！"), document.body.style.overflow = "auto", te.isPyQtWebEngine && ee("exportData", !1);
    }, O = (k) => {
      e.value = k, d.value = !0;
    }, C = () => {
      d.value = !1;
    };
    return (k, w) => (we(), ke("div", ur, [
      E("div", { class: "action-buttons" }, [
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: m,
            class: "export-btn"
          }, "导出数据")
        ]),
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: g,
            class: "clear-btn"
          }, "清空数据")
        ]),
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: f,
            class: "settings-btn"
          }, "开发者模式")
        ]),
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: i,
            class: "update-btn"
          }, "更新")
        ])
      ]),
      n.value ? (we(), ke("div", sr, [
        E("div", cr, [
          E("div", lr, [
            w[7] || (w[7] = E("h2", null, "传感器调试模式【开发者测试用】", -1)),
            E("div", dr, [
              w[6] || (w[6] = E("span", { class: "setting-label" }, "调试模式：", -1)),
              E("div", fr, [
                st(E("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": w[0] || (w[0] = (v) => o.value = v)
                }, null, 512), [
                  [It, o.value]
                ]),
                w[5] || (w[5] = E("label", { for: "debug-toggle" }, null, -1))
              ])
            ]),
            E("div", { class: "modal-buttons" }, [
              E("button", {
                onClick: p,
                class: "confirm-btn"
              }, "保存"),
              E("button", {
                onClick: h,
                class: "cancel-btn"
              }, "取消")
            ])
          ])
        ])
      ])) : rt("", !0),
      a.value ? (we(), ke("div", pr, [
        E("div", { class: "modal-content" }, [
          w[8] || (w[8] = E("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          E("div", { class: "modal-buttons" }, [
            E("button", {
              onClick: b,
              class: "confirm-btn"
            }, "确定"),
            E("button", {
              onClick: y,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : rt("", !0),
      t.value ? (we(), ke("div", vr, [
        E("div", hr, [
          w[9] || (w[9] = E("h2", null, "更新版本", -1)),
          E("div", {
            class: "update-input",
            onClick: w[2] || (w[2] = (v) => s.value = !0)
          }, [
            st(E("input", {
              type: "text",
              "onUpdate:modelValue": w[1] || (w[1] = (v) => u.value = v),
              placeholder: "请输入更新版号",
              readonly: ""
            }, null, 512), [
              [pt, u.value]
            ])
          ]),
          E("div", { class: "modal-buttons" }, [
            E("button", {
              onClick: l,
              class: "confirm-btn"
            }, "更新"),
            E("button", {
              onClick: c,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : rt("", !0),
      He(xt, {
        modelValue: u.value,
        "onUpdate:modelValue": w[3] || (w[3] = (v) => u.value = v),
        "show-keyboard": s.value,
        "onUpdate:showKeyboard": w[4] || (w[4] = (v) => s.value = v)
      }, null, 8, ["modelValue", "show-keyboard"]),
      d.value ? (we(), ke("div", mr, [
        E("div", gr, [
          E("h2", null, Ne(e.value), 1),
          E("div", { class: "modal-buttons" }, [
            E("button", {
              onClick: C,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : rt("", !0)
    ]));
  }
}, br = /* @__PURE__ */ ct(yr, [["__scopeId", "data-v-d87ac98e"]]);
var wr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function kr(be) {
  return be && be.__esModule && Object.prototype.hasOwnProperty.call(be, "default") ? be.default : be;
}
var Lt = { exports: {} };
(function(be, ee) {
  (function(te, a) {
    be.exports = a(Pt);
  })(typeof self < "u" ? self : wr, function(te) {
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
      a.exports = function(s, i, l, c, f, h) {
        var p = l + s.length, m = c.length, g = u;
        return f !== void 0 && (f = n(f), g = t), o.call(h, g, function(y, b) {
          var O;
          switch (b.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return s;
            case "`":
              return i.slice(0, l);
            case "'":
              return i.slice(p);
            case "<":
              O = f[b.slice(1, -1)];
              break;
            default:
              var C = +b;
              if (C === 0) return y;
              if (C > m) {
                var k = r(C / 10);
                return k === 0 ? y : k <= m ? c[k - 1] === void 0 ? b.charAt(1) : c[k - 1] + b.charAt(1) : y;
              }
              O = c[C - 1];
          }
          return O === void 0 ? "" : O;
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
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), s = e("8aa5"), i = e("50c4"), l = e("14c3"), c = e("9263"), f = e("d039"), h = [].push, p = Math.min, m = 4294967295, g = !f(function() {
        return !RegExp(m, "y");
      });
      n("split", 2, function(y, b, O) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(k, w) {
          var v = String(t(this)), j = w === void 0 ? m : w >>> 0;
          if (j === 0) return [];
          if (k === void 0) return [v];
          if (!r(k)) return b.call(v, k, j);
          for (var S, T, _, M = [], D = (k.ignoreCase ? "i" : "") + (k.multiline ? "m" : "") + (k.unicode ? "u" : "") + (k.sticky ? "y" : ""), Z = 0, ae = new RegExp(k.source, D + "g"); (S = c.call(ae, v)) && (T = ae.lastIndex, !(T > Z && (M.push(v.slice(Z, S.index)), S.length > 1 && S.index < v.length && h.apply(M, S.slice(1)), _ = S[0].length, Z = T, M.length >= j))); )
            ae.lastIndex === S.index && ae.lastIndex++;
          return Z === v.length ? !_ && ae.test("") || M.push("") : M.push(v.slice(Z)), M.length > j ? M.slice(0, j) : M;
        } : "0".split(void 0, 0).length ? function(k, w) {
          return k === void 0 && w === 0 ? [] : b.call(this, k, w);
        } : b, [function(k, w) {
          var v = t(this), j = k == null ? void 0 : k[y];
          return j !== void 0 ? j.call(k, v, w) : C.call(String(v), k, w);
        }, function(k, w) {
          var v = O(C, k, this, w, C !== b);
          if (v.done) return v.value;
          var j = o(k), S = String(this), T = u(j, RegExp), _ = j.unicode, M = (j.ignoreCase ? "i" : "") + (j.multiline ? "m" : "") + (j.unicode ? "u" : "") + (g ? "y" : "g"), D = new T(g ? j : "^(?:" + j.source + ")", M), Z = w === void 0 ? m : w >>> 0;
          if (Z === 0) return [];
          if (S.length === 0) return l(D, S) === null ? [S] : [];
          for (var ae = 0, G = 0, W = []; G < S.length; ) {
            D.lastIndex = g ? G : 0;
            var F, L = l(D, g ? S : S.slice(G));
            if (L === null || (F = p(i(D.lastIndex + (g ? 0 : G)), S.length)) === ae) G = s(S, G, _);
            else {
              if (W.push(S.slice(ae, G)), W.length === Z) return W;
              for (var A = 1; A <= L.length - 1; A++) if (W.push(L[A]), W.length === Z) return W;
              G = ae = F;
            }
          }
          return W.push(S.slice(ae)), W;
        }];
      }, !g);
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
            (function(X, V) {
              B.exports = V();
            })(0, function() {
              function X(N) {
                var Y = N && typeof N == "object";
                return Y && Object.prototype.toString.call(N) !== "[object RegExp]" && Object.prototype.toString.call(N) !== "[object Date]";
              }
              function V(N) {
                return Array.isArray(N) ? [] : {};
              }
              function re(N, Y) {
                var ye = Y && Y.clone === !0;
                return ye && X(N) ? H(V(N), N, Y) : N;
              }
              function ie(N, Y, ye) {
                var Re = N.slice();
                return Y.forEach(function(Ce, We) {
                  typeof Re[We] > "u" ? Re[We] = re(Ce, ye) : X(Ce) ? Re[We] = H(N[We], Ce, ye) : N.indexOf(Ce) === -1 && Re.push(re(Ce, ye));
                }), Re;
              }
              function ge(N, Y, ye) {
                var Re = {};
                return X(N) && Object.keys(N).forEach(function(Ce) {
                  Re[Ce] = re(N[Ce], ye);
                }), Object.keys(Y).forEach(function(Ce) {
                  X(Y[Ce]) && N[Ce] ? Re[Ce] = H(N[Ce], Y[Ce], ye) : Re[Ce] = re(Y[Ce], ye);
                }), Re;
              }
              function H(N, Y, ye) {
                var Re = Array.isArray(Y), Ce = ye || { arrayMerge: ie }, We = Ce.arrayMerge || ie;
                return Re ? Array.isArray(N) ? We(N, Y, ye) : re(Y, ye) : ge(N, Y, ye);
              }
              return H.all = function(N, Y) {
                if (!Array.isArray(N) || N.length < 2) throw new Error("first argument should be an array with at least two elements");
                return N.reduce(function(ye, Re) {
                  return H(ye, Re, Y);
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
          }), s = function(B) {
            return Object.keys(B).map(function(R) {
              var X = B[R].toString().replace(/"/g, "&quot;");
              return R + '="' + X + '"';
            }).join(" ");
          }, i = u.svg, l = u.xlink, c = {};
          c[i.name] = i.uri, c[l.name] = l.uri;
          var f, h = function(B, R) {
            B === void 0 && (B = "");
            var X = o(c, R || {}), V = s(X);
            return "<svg " + V + ">" + B + "</svg>";
          }, p = u.svg, m = u.xlink, g = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[m.name] = m.uri, f) }, y = function(B) {
            this.config = o(g, B || {}), this.symbols = [];
          };
          y.prototype.add = function(B) {
            var R = this, X = R.symbols, V = this.find(B.id);
            return V ? (X[X.indexOf(V)] = B, !1) : (X.push(B), !0);
          }, y.prototype.remove = function(B) {
            var R = this, X = R.symbols, V = this.find(B);
            return !!V && (X.splice(X.indexOf(V), 1), V.destroy(), !0);
          }, y.prototype.find = function(B) {
            return this.symbols.filter(function(R) {
              return R.id === B;
            })[0] || null;
          }, y.prototype.has = function(B) {
            return this.find(B) !== null;
          }, y.prototype.stringify = function() {
            var B = this.config, R = B.attrs, X = this.symbols.map(function(V) {
              return V.stringify();
            }).join("");
            return h(X, R);
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            this.symbols.forEach(function(B) {
              return B.destroy();
            });
          };
          var b = function(B) {
            var R = B.id, X = B.viewBox, V = B.content;
            this.id = R, this.viewBox = X, this.content = V;
          };
          b.prototype.stringify = function() {
            return this.content;
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            var B = this;
            ["id", "viewBox", "content"].forEach(function(R) {
              return delete B[R];
            });
          };
          var O = function(B) {
            var R = !!document.importNode, X = new DOMParser().parseFromString(B, "image/svg+xml").documentElement;
            return R ? document.importNode(X, !0) : X;
          }, C = function(B) {
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
              var re = typeof V == "string" ? document.querySelector(V) : V, ie = this.render();
              return this.node = ie, re.appendChild(ie), ie;
            }, R.prototype.render = function() {
              var V = this.stringify();
              return O(h(V)).childNodes[0];
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(R.prototype, X), R;
          }(b), k = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, w = function(B) {
            return Array.prototype.slice.call(B, 0);
          }, v = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, j = function(B, R) {
            var X = document.createEvent("CustomEvent");
            X.initCustomEvent(B, !1, !1, R), window.dispatchEvent(X);
          }, S = function(B) {
            var R = [];
            return w(B.querySelectorAll("style")).forEach(function(X) {
              X.textContent += "", R.push(X);
            }), R;
          }, T = function(B) {
            return (B || window.location.href).split("#")[0];
          }, _ = function(B) {
            angular.module("ng").run(["$rootScope", function(R) {
              R.$on("$locationChangeSuccess", function(X, V, re) {
                j(B, { oldUrl: re, newUrl: V });
              });
            }]);
          }, M = "linearGradient, radialGradient, pattern, mask, clipPath", D = function(B, R) {
            return R === void 0 && (R = M), w(B.querySelectorAll("symbol")).forEach(function(X) {
              w(X.querySelectorAll(R)).forEach(function(V) {
                X.parentNode.insertBefore(V, X);
              });
            }), B;
          };
          function Z(B, R) {
            var X = w(B).reduce(function(V, re) {
              if (!re.attributes) return V;
              var ie = w(re.attributes), ge = R ? ie.filter(R) : ie;
              return V.concat(ge);
            }, []);
            return X;
          }
          var ae = u.xlink.uri, G = "xlink:href", W = /[{}|\\\^\[\]`"<>]/g;
          function F(B) {
            return B.replace(W, function(R) {
              return "%" + R[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L(B) {
            return B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function A(B, R, X) {
            return w(B).forEach(function(V) {
              var re = V.getAttribute(G);
              if (re && re.indexOf(R) === 0) {
                var ie = re.replace(R, X);
                V.setAttributeNS(ae, G, ie);
              }
            }), B;
          }
          var Q, ne = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], U = ne.map(function(B) {
            return "[" + B + "]";
          }).join(","), xe = function(B, R, X, V) {
            var re = F(X), ie = F(V), ge = B.querySelectorAll(U), H = Z(ge, function(N) {
              var Y = N.localName, ye = N.value;
              return ne.indexOf(Y) !== -1 && ye.indexOf("url(" + re) !== -1;
            });
            H.forEach(function(N) {
              return N.value = N.value.replace(new RegExp(L(re), "g"), ie);
            }), A(R, re, ie);
          }, pe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Pe = function(B) {
            function R(V) {
              var re = this;
              V === void 0 && (V = {}), B.call(this, o(k, V));
              var ie = t();
              this._emitter = ie, this.node = null;
              var ge = this, H = ge.config;
              if (H.autoConfigure && this._autoConfigure(V), H.syncUrlsWithBaseTag) {
                var N = document.getElementsByTagName("base")[0].getAttribute("href");
                ie.on(pe.MOUNT, function() {
                  return re.updateUrls("#", N);
                });
              }
              var Y = this._handleLocationChange.bind(this);
              this._handleLocationChange = Y, H.listenLocationChangeEvent && window.addEventListener(H.locationChangeEvent, Y), H.locationChangeAngularEmitter && _(H.locationChangeEvent), ie.on(pe.MOUNT, function(ye) {
                H.moveGradientsOutsideSymbol && D(ye);
              }), ie.on(pe.SYMBOL_MOUNT, function(ye) {
                H.moveGradientsOutsideSymbol && D(ye.parentNode), (v.isIE() || v.isEdge()) && S(ye);
              });
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, R.prototype._autoConfigure = function(V) {
              var re = this, ie = re.config;
              typeof V.syncUrlsWithBaseTag > "u" && (ie.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof V.locationChangeAngularEmitter > "u" && (ie.locationChangeAngularEmitter = typeof window.angular < "u"), typeof V.moveGradientsOutsideSymbol > "u" && (ie.moveGradientsOutsideSymbol = v.isFirefox());
            }, R.prototype._handleLocationChange = function(V) {
              var re = V.detail, ie = re.oldUrl, ge = re.newUrl;
              this.updateUrls(ie, ge);
            }, R.prototype.add = function(V) {
              var re = this, ie = B.prototype.add.call(this, V);
              return this.isMounted && ie && (V.mount(re.node), this._emitter.emit(pe.SYMBOL_MOUNT, V.node)), ie;
            }, R.prototype.attach = function(V) {
              var re = this, ie = this;
              if (ie.isMounted) return ie.node;
              var ge = typeof V == "string" ? document.querySelector(V) : V;
              return ie.node = ge, this.symbols.forEach(function(H) {
                H.mount(ie.node), re._emitter.emit(pe.SYMBOL_MOUNT, H.node);
              }), w(ge.querySelectorAll("symbol")).forEach(function(H) {
                var N = C.createFromExistingNode(H);
                N.node = H, ie.add(N);
              }), this._emitter.emit(pe.MOUNT, ge), ge;
            }, R.prototype.destroy = function() {
              var V = this, re = V.config, ie = V.symbols, ge = V._emitter;
              ie.forEach(function(H) {
                return H.destroy();
              }), ge.off("*"), window.removeEventListener(re.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, R.prototype.mount = function(V, re) {
              V === void 0 && (V = this.config.mountTo), re === void 0 && (re = !1);
              var ie = this;
              if (ie.isMounted) return ie.node;
              var ge = typeof V == "string" ? document.querySelector(V) : V, H = ie.render();
              return this.node = H, re && ge.childNodes[0] ? ge.insertBefore(H, ge.childNodes[0]) : ge.appendChild(H), this._emitter.emit(pe.MOUNT, H), H;
            }, R.prototype.render = function() {
              return O(this.stringify());
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, R.prototype.updateUrls = function(V, re) {
              if (!this.isMounted) return !1;
              var ie = document.querySelectorAll(this.config.usagesToUpdate);
              return xe(this.node, ie, T(V) + "#", T(re) + "#"), !0;
            }, Object.defineProperties(R.prototype, X), R;
          }(y), Be = r(function(B) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(R, X) {
              B.exports = X();
            })(0, function() {
              var R, X = [], V = document, re = V.documentElement.doScroll, ie = "DOMContentLoaded", ge = (re ? /^loaded|^c/ : /^loaded|^i|^c/).test(V.readyState);
              return ge || V.addEventListener(ie, R = function() {
                for (V.removeEventListener(ie, R), ge = 1; R = X.shift(); ) R();
              }), function(H) {
                ge ? setTimeout(H, 0) : X.push(H);
              };
            });
          }), Te = "__SVG_SPRITE_NODE__", Ee = "__SVG_SPRITE__", Oe = !!window[Ee];
          Oe ? Q = window[Ee] : (Q = new Pe({ attrs: { id: Te, "aria-hidden": "true" } }), window[Ee] = Q);
          var Ve = function() {
            var B = document.getElementById(Te);
            B ? Q.attach(B) : Q.mount(document.body, !0);
          };
          document.body ? Ve() : Be(Ve);
          var Ge = Q;
          return Ge;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(a, d, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), s = e("2a62"), i = function(l, c) {
        this.stopped = l, this.result = c;
      };
      a.exports = function(l, c, f) {
        var h, p, m, g, y, b, O, C = f && f.that, k = !(!f || !f.AS_ENTRIES), w = !(!f || !f.IS_ITERATOR), v = !(!f || !f.INTERRUPTED), j = t(c, C, 1 + k + v), S = function(_) {
          return h && s(h), new i(!0, _);
        }, T = function(_) {
          return k ? (n(_), v ? j(_[0], _[1], S) : j(_[0], _[1])) : v ? j(_, S) : j(_);
        };
        if (w) h = l;
        else {
          if (p = u(l), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (m = 0, g = o(l.length); g > m; m++) if (y = T(l[m]), y && y instanceof i) return y;
            return new i(!1);
          }
          h = p.call(l);
        }
        for (b = h.next; !(O = b.call(h)).done; ) {
          try {
            y = T(O.value);
          } catch (_) {
            throw s(h), _;
          }
          if (typeof y == "object" && y && y instanceof i) return y;
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
        var f, h, p, m, g, y, b = l.target, O = l.global, C = l.stat;
        if (h = O ? n : C ? n[b] || u(b, {}) : (n[b] || {}).prototype, h) for (p in c) {
          if (g = c[p], l.noTargetGet ? (y = r(h, p), m = y && y.value) : m = h[p], f = i(O ? p : b + (C ? "." : "#") + p, l.forced), !f && m !== void 0) {
            if (typeof g == typeof m) continue;
            s(g, m);
          }
          (l.sham || m && m.sham) && o(g, "sham", !0), t(h, p, g, l);
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
        var f = r(this), h = String(f.source), p = f.flags, m = String(p === void 0 && f instanceof RegExp && !("flags" in s) ? t.call(f) : p);
        return "/" + h + "/" + m;
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
      var n, r, o, t = e("da84"), u = e("d039"), s = e("0366"), i = e("1be4"), l = e("cc12"), c = e("1cdc"), f = e("605d"), h = t.location, p = t.setImmediate, m = t.clearImmediate, g = t.process, y = t.MessageChannel, b = t.Dispatch, O = 0, C = {}, k = "onreadystatechange", w = function(T) {
        if (C.hasOwnProperty(T)) {
          var _ = C[T];
          delete C[T], _();
        }
      }, v = function(T) {
        return function() {
          w(T);
        };
      }, j = function(T) {
        w(T.data);
      }, S = function(T) {
        t.postMessage(T + "", h.protocol + "//" + h.host);
      };
      p && m || (p = function(T) {
        for (var _ = [], M = 1; arguments.length > M; ) _.push(arguments[M++]);
        return C[++O] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, _);
        }, n(O), O;
      }, m = function(T) {
        delete C[T];
      }, f ? n = function(T) {
        g.nextTick(v(T));
      } : b && b.now ? n = function(T) {
        b.now(v(T));
      } : y && !c ? (r = new y(), o = r.port2, r.port1.onmessage = j, n = s(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && h && h.protocol !== "file:" && !u(S) ? (n = S, t.addEventListener("message", j, !1)) : n = k in l("script") ? function(T) {
        i.appendChild(l("script"))[k] = function() {
          i.removeChild(this), w(T);
        };
      } : function(T) {
        setTimeout(v(T), 0);
      }), a.exports = { set: p, clear: m };
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
            c !== null && typeof c < "u" && (n.isArray(c) ? f += "[]" : c = [c], n.forEach(c, function(h) {
              n.isDate(h) ? h = h.toISOString() : n.isObject(h) && (h = JSON.stringify(h)), i.push(r(f) + "=" + r(h));
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
          var h = t(this), p = f == null ? void 0 : f[i];
          return p !== void 0 ? p.call(f, h) : new RegExp(f)[i](String(h));
        }, function(f) {
          var h = c(l, f, this);
          if (h.done) return h.value;
          var p = r(f), m = String(this);
          if (!p.global) return s(p, m);
          var g = p.unicode;
          p.lastIndex = 0;
          for (var y, b = [], O = 0; (y = s(p, m)) !== null; ) {
            var C = String(y[0]);
            b[O] = C, C === "" && (p.lastIndex = u(m, o(p.lastIndex), g)), O++;
          }
          return O === 0 ? null : b;
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
        function c(m, g) {
          return n.isPlainObject(m) && n.isPlainObject(g) ? n.merge(m, g) : n.isPlainObject(g) ? n.merge({}, g) : n.isArray(g) ? g.slice() : g;
        }
        function f(m) {
          n.isUndefined(o[m]) ? n.isUndefined(r[m]) || (t[m] = c(void 0, r[m])) : t[m] = c(r[m], o[m]);
        }
        n.forEach(u, function(m) {
          n.isUndefined(o[m]) || (t[m] = c(void 0, o[m]));
        }), n.forEach(s, f), n.forEach(i, function(m) {
          n.isUndefined(o[m]) ? n.isUndefined(r[m]) || (t[m] = c(void 0, r[m])) : t[m] = c(void 0, o[m]);
        }), n.forEach(l, function(m) {
          m in o ? t[m] = c(r[m], o[m]) : m in r && (t[m] = c(void 0, r[m]));
        });
        var h = u.concat(s).concat(i).concat(l), p = Object.keys(r).concat(Object.keys(o)).filter(function(m) {
          return h.indexOf(m) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(a, d, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, s = e("241c").f, i = e("44e7"), l = e("ad6d"), c = e("9f7f"), f = e("6eeb"), h = e("d039"), p = e("69f3").set, m = e("2626"), g = e("b622"), y = g("match"), b = r.RegExp, O = b.prototype, C = /a/g, k = /a/g, w = new b(C) !== C, v = c.UNSUPPORTED_Y, j = n && o("RegExp", !w || v || h(function() {
        return k[y] = !1, b(C) != C || b(k) == k || b(C, "i") != "/a/i";
      }));
      if (j) {
        for (var S = function(D, Z) {
          var ae, G = this instanceof S, W = i(D), F = Z === void 0;
          if (!G && W && D.constructor === S && F) return D;
          w ? W && !F && (D = D.source) : D instanceof S && (F && (Z = l.call(D)), D = D.source), v && (ae = !!Z && Z.indexOf("y") > -1, ae && (Z = Z.replace(/y/g, "")));
          var L = t(w ? new b(D, Z) : b(D, Z), G ? this : O, S);
          return v && ae && p(L, { sticky: ae }), L;
        }, T = function(D) {
          D in S || u(S, D, { configurable: !0, get: function() {
            return b[D];
          }, set: function(Z) {
            b[D] = Z;
          } });
        }, _ = s(b), M = 0; _.length > M; ) T(_[M++]);
        O.constructor = S, S.prototype = O, f(r, "RegExp", S);
      }
      m("RegExp");
    }, "4d64": function(a, d, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(s, i, l) {
          var c, f = n(s), h = r(f.length), p = o(l, h);
          if (u && i != i) {
            for (; h > p; ) if (c = f[p++], c != c) return !0;
          } else for (; h > p; p++) if ((u || p in f) && f[p] === i) return u || p || 0;
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
        var c, f, h, p, m, g, y = r(l), b = typeof this == "function" ? this : Array, O = arguments.length, C = O > 1 ? arguments[1] : void 0, k = C !== void 0, w = i(y), v = 0;
        if (k && (C = n(C, O > 2 ? arguments[2] : void 0, 2)), w == null || b == Array && t(w)) for (c = u(y.length), f = new b(c); c > v; v++) g = k ? C(y[v], v) : y[v], s(f, v, g);
        else for (p = w.call(y), m = p.next, f = new b(); !(h = m.call(p)).done; v++) g = k ? o(p, C, [h.value, v], !0) : h.value, s(f, v, g);
        return f.length = v, f;
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
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), s = e("8aa5"), i = e("0cb2"), l = e("14c3"), c = Math.max, f = Math.min, h = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, m, g, y) {
        var b = y.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, O = y.REPLACE_KEEPS_$0, C = b ? "$" : "$0";
        return [function(k, w) {
          var v = u(this), j = k == null ? void 0 : k[p];
          return j !== void 0 ? j.call(k, v, w) : m.call(String(v), k, w);
        }, function(k, w) {
          if (!b && O || typeof w == "string" && w.indexOf(C) === -1) {
            var v = g(m, k, this, w);
            if (v.done) return v.value;
          }
          var j = r(k), S = String(this), T = typeof w == "function";
          T || (w = String(w));
          var _ = j.global;
          if (_) {
            var M = j.unicode;
            j.lastIndex = 0;
          }
          for (var D = []; ; ) {
            var Z = l(j, S);
            if (Z === null || (D.push(Z), !_)) break;
            var ae = String(Z[0]);
            ae === "" && (j.lastIndex = s(S, o(j.lastIndex), M));
          }
          for (var G = "", W = 0, F = 0; F < D.length; F++) {
            Z = D[F];
            for (var L = String(Z[0]), A = c(f(t(Z.index), S.length), 0), Q = [], ne = 1; ne < Z.length; ne++) Q.push(h(Z[ne]));
            var U = Z.groups;
            if (T) {
              var xe = [L].concat(Q, A, S);
              U !== void 0 && xe.push(U);
              var pe = String(w.apply(void 0, xe));
            } else pe = i(L, S, A, Q, U, w);
            A >= W && (G += S.slice(W, A) + pe, W = A + L.length);
          }
          return G + S.slice(W);
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
          var h = s.getAttribute("content");
          if (h) {
            var p = h.match(/initial\-dpr=([\d\.]+)/), m = h.match(/maximum\-dpr=([\d\.]+)/);
            p && (i = parseFloat(p[1]), l = parseFloat((1 / i).toFixed(2))), m && (i = parseFloat(m[1]), l = parseFloat((1 / i).toFixed(2)));
          }
        }
        if (!i && !l) {
          n.navigator.appVersion.match(/android/gi);
          var g = n.navigator.appVersion.match(/iphone/gi), y = n.devicePixelRatio;
          i = g ? y >= 3 && (!i || i >= 3) ? 3 : y >= 2 && (!i || i >= 2) ? 2 : 1 : 1, l = 1 / i;
        }
        if (t.setAttribute("data-dpr", i), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + l + ", maximum-scale=" + l + ", minimum-scale=" + l + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var b = o.createElement("div");
          b.appendChild(u), o.write(b.innerHTML);
        }
        function O() {
          var C = t.getBoundingClientRect().width, k = C / 10;
          t.style.fontSize = k + "px", c.rem = n.rem = k;
        }
        n.addEventListener("resize", function() {
          O();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && O();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * i + "px" : o.addEventListener("DOMContentLoaded", function(C) {
          o.body.style.fontSize = 10 * i + "px";
        }, !1), O(), c.dpr = n.dpr = i, c.refreshRem = O, c.rem2px = function(C) {
          var k = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (k += "px"), k;
        }, c.px2rem = function(C) {
          var k = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (k += "rem"), k;
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
          var i, l, c = String(r(u)), f = n(s), h = c.length;
          return f < 0 || f >= h ? t ? "" : void 0 : (i = c.charCodeAt(f), i < 55296 || i > 56319 || f + 1 === h || (l = c.charCodeAt(f + 1)) < 56320 || l > 57343 ? t ? c.charAt(f) : i : t ? c.slice(f, f + 2) : l - 56320 + (i - 55296 << 10) + 65536);
        };
      };
      a.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(a, d, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), s = e("2266"), i = e("7dd0"), l = e("2626"), c = e("83ab"), f = e("f183").fastKey, h = e("69f3"), p = h.set, m = h.getterFor;
      a.exports = { getConstructor: function(g, y, b, O) {
        var C = g(function(j, S) {
          u(j, C, y), p(j, { type: y, index: r(null), first: void 0, last: void 0, size: 0 }), c || (j.size = 0), S != null && s(S, j[O], { that: j, AS_ENTRIES: b });
        }), k = m(y), w = function(j, S, T) {
          var _, M, D = k(j), Z = v(j, S);
          return Z ? Z.value = T : (D.last = Z = { index: M = f(S, !0), key: S, value: T, previous: _ = D.last, next: void 0, removed: !1 }, D.first || (D.first = Z), _ && (_.next = Z), c ? D.size++ : j.size++, M !== "F" && (D.index[M] = Z)), j;
        }, v = function(j, S) {
          var T, _ = k(j), M = f(S);
          if (M !== "F") return _.index[M];
          for (T = _.first; T; T = T.next) if (T.key == S) return T;
        };
        return o(C.prototype, { clear: function() {
          for (var j = this, S = k(j), T = S.index, _ = S.first; _; ) _.removed = !0, _.previous && (_.previous = _.previous.next = void 0), delete T[_.index], _ = _.next;
          S.first = S.last = void 0, c ? S.size = 0 : j.size = 0;
        }, delete: function(j) {
          var S = this, T = k(S), _ = v(S, j);
          if (_) {
            var M = _.next, D = _.previous;
            delete T.index[_.index], _.removed = !0, D && (D.next = M), M && (M.previous = D), T.first == _ && (T.first = M), T.last == _ && (T.last = D), c ? T.size-- : S.size--;
          }
          return !!_;
        }, forEach: function(j) {
          for (var S, T = k(this), _ = t(j, arguments.length > 1 ? arguments[1] : void 0, 3); S = S ? S.next : T.first; )
            for (_(S.value, S.key, this); S && S.removed; ) S = S.previous;
        }, has: function(j) {
          return !!v(this, j);
        } }), o(C.prototype, b ? { get: function(j) {
          var S = v(this, j);
          return S && S.value;
        }, set: function(j, S) {
          return w(this, j === 0 ? 0 : j, S);
        } } : { add: function(j) {
          return w(this, j = j === 0 ? 0 : j, j);
        } }), c && n(C.prototype, "size", { get: function() {
          return k(this).size;
        } }), C;
      }, setStrong: function(g, y, b) {
        var O = y + " Iterator", C = m(y), k = m(O);
        i(g, y, function(w, v) {
          p(this, { type: O, target: w, state: C(w), kind: v, last: void 0 });
        }, function() {
          for (var w = k(this), v = w.kind, j = w.last; j && j.removed; ) j = j.previous;
          return w.target && (w.last = j = j ? j.next : w.state.first) ? v == "keys" ? { value: j.key, done: !1 } : v == "values" ? { value: j.value, done: !1 } : { value: [j.key, j.value], done: !1 } : (w.target = void 0, { value: void 0, done: !0 });
        }, b ? "entries" : "values", !b, !0), l(y);
      } };
    }, "65f0": function(a, d, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      a.exports = function(u, s) {
        var i;
        return r(u) && (i = u.constructor, typeof i != "function" || i !== Array && !r(i.prototype) ? n(i) && (i = i[t], i === null && (i = void 0)) : i = void 0), new (i === void 0 ? Array : i)(s === 0 ? 0 : s);
      };
    }, "69f3": function(a, d, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), s = e("861d"), i = e("9112"), l = e("5135"), c = e("c6cd"), f = e("f772"), h = e("d012"), p = u.WeakMap, m = function(w) {
        return o(w) ? r(w) : n(w, {});
      }, g = function(w) {
        return function(v) {
          var j;
          if (!s(v) || (j = r(v)).type !== w) throw TypeError("Incompatible receiver, " + w + " required");
          return j;
        };
      };
      if (t) {
        var y = c.state || (c.state = new p()), b = y.get, O = y.has, C = y.set;
        n = function(w, v) {
          return v.facade = w, C.call(y, w, v), v;
        }, r = function(w) {
          return b.call(y, w) || {};
        }, o = function(w) {
          return O.call(y, w);
        };
      } else {
        var k = f("state");
        h[k] = !0, n = function(w, v) {
          return v.facade = w, i(w, k, v), v;
        }, r = function(w) {
          return l(w, k) ? w[k] : {};
        }, o = function(w) {
          return l(w, k);
        };
      }
      a.exports = { set: n, get: r, has: o, enforce: m, getterFor: g };
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
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), s = e("2266"), i = e("19aa"), l = e("861d"), c = e("d039"), f = e("1c7e"), h = e("d44e"), p = e("7156");
      a.exports = function(m, g, y) {
        var b = m.indexOf("Map") !== -1, O = m.indexOf("Weak") !== -1, C = b ? "set" : "add", k = r[m], w = k && k.prototype, v = k, j = {}, S = function(G) {
          var W = w[G];
          t(w, G, G == "add" ? function(F) {
            return W.call(this, F === 0 ? 0 : F), this;
          } : G == "delete" ? function(F) {
            return !(O && !l(F)) && W.call(this, F === 0 ? 0 : F);
          } : G == "get" ? function(F) {
            return O && !l(F) ? void 0 : W.call(this, F === 0 ? 0 : F);
          } : G == "has" ? function(F) {
            return !(O && !l(F)) && W.call(this, F === 0 ? 0 : F);
          } : function(F, L) {
            return W.call(this, F === 0 ? 0 : F, L), this;
          });
        }, T = o(m, typeof k != "function" || !(O || w.forEach && !c(function() {
          new k().entries().next();
        })));
        if (T) v = y.getConstructor(g, m, b, C), u.REQUIRED = !0;
        else if (o(m, !0)) {
          var _ = new v(), M = _[C](O ? {} : -0, 1) != _, D = c(function() {
            _.has(1);
          }), Z = f(function(G) {
            new k(G);
          }), ae = !O && c(function() {
            for (var G = new k(), W = 5; W--; ) G[C](W, W);
            return !G.has(-0);
          });
          Z || (v = g(function(G, W) {
            i(G, v, m);
            var F = p(new k(), G, v);
            return W != null && s(W, F[C], { that: F, AS_ENTRIES: b }), F;
          }), v.prototype = w, w.constructor = v), (D || ae) && (S("delete"), S("has"), b && S("get")), (ae || M) && S(C), O && w.clear && delete w.clear;
        }
        return j[m] = v, n({ global: !0, forced: v != k }, j), h(v, m), O || y.setStrong(v, m, b), v;
      };
    }, "6eeb": function(a, d, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), s = e("69f3"), i = s.get, l = s.enforce, c = String(String).split("String");
      (a.exports = function(f, h, p, m) {
        var g, y = !!m && !!m.unsafe, b = !!m && !!m.enumerable, O = !!m && !!m.noTargetGet;
        typeof p == "function" && (typeof h != "string" || o(p, "name") || r(p, "name", h), g = l(p), g.source || (g.source = c.join(typeof h == "string" ? h : ""))), f !== n ? (y ? !O && f[h] && (b = !0) : delete f[h], b ? f[h] = p : r(f, h, p)) : b ? f[h] = p : t(h, p);
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
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), s = e("1be4"), i = e("cc12"), l = e("f772"), c = ">", f = "<", h = "prototype", p = "script", m = l("IE_PROTO"), g = function() {
      }, y = function(k) {
        return f + p + c + k + f + "/" + p + c;
      }, b = function(k) {
        k.write(y("")), k.close();
        var w = k.parentWindow.Object;
        return k = null, w;
      }, O = function() {
        var k, w = i("iframe"), v = "java" + p + ":";
        return w.style.display = "none", s.appendChild(w), w.src = String(v), k = w.contentWindow.document, k.open(), k.write(y("document.F=Object")), k.close(), k.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? b(n) : O();
        for (var k = t.length; k--; ) delete C[h][t[k]];
        return C();
      };
      u[m] = !0, a.exports = Object.create || function(k, w) {
        var v;
        return k !== null ? (g[h] = r(k), v = new g(), g[h] = null, v[m] = k) : v = C(), w === void 0 ? v : o(v, w);
      };
    }, "7db0": function(a, d, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(s) {
        return r(this, s, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(a, d, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), s = e("9112"), i = e("6eeb"), l = e("b622"), c = e("c430"), f = e("3f8c"), h = e("ae93"), p = h.IteratorPrototype, m = h.BUGGY_SAFARI_ITERATORS, g = l("iterator"), y = "keys", b = "values", O = "entries", C = function() {
        return this;
      };
      a.exports = function(k, w, v, j, S, T, _) {
        r(v, w, j);
        var M, D, Z, ae = function(ne) {
          if (ne === S && A) return A;
          if (!m && ne in F) return F[ne];
          switch (ne) {
            case y:
              return function() {
                return new v(this, ne);
              };
            case b:
              return function() {
                return new v(this, ne);
              };
            case O:
              return function() {
                return new v(this, ne);
              };
          }
          return function() {
            return new v(this);
          };
        }, G = w + " Iterator", W = !1, F = k.prototype, L = F[g] || F["@@iterator"] || S && F[S], A = !m && L || ae(S), Q = w == "Array" && F.entries || L;
        if (Q && (M = o(Q.call(new k())), p !== Object.prototype && M.next && (c || o(M) === p || (t ? t(M, p) : typeof M[g] != "function" && s(M, g, C)), u(M, G, !0, !0), c && (f[G] = C))), S == b && L && L.name !== b && (W = !0, A = function() {
          return L.call(this);
        }), c && !_ || F[g] === A || s(F, g, A), f[w] = A, S) if (D = { values: ae(b), keys: T ? A : ae(y), entries: ae(O) }, _) for (Z in D) (m || W || !(Z in F)) && i(F, Z, D[Z]);
        else n({ target: w, proto: !0, forced: m || W }, D);
        return D;
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
          } catch (O) {
            var s, i, l, c = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, h = c.exec(O.stack) || f.exec(O.stack), p = h && h[1] || !1, m = h && h[2] || !1, g = document.location.href.replace(document.location.hash, ""), y = document.getElementsByTagName("script");
            p === g && (s = document.documentElement.outerHTML, i = new RegExp("(?:[^\\n]+?\\n){0," + (m - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), l = s.replace(i, "$1").trim());
            for (var b = 0; b < y.length; b++)
              if (y[b].readyState === "interactive" || y[b].src === p || p === g && y[b].innerHTML && y[b].innerHTML.trim() === l) return y[b];
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
      a.exports = te;
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
        var f = /a/, h = /b*/g;
        return o.call(f, "a"), o.call(h, "a"), f.lastIndex !== 0 || h.lastIndex !== 0;
      }(), i = r.UNSUPPORTED_Y || r.BROKEN_CARET, l = /()??/.exec("")[1] !== void 0, c = s || l || i;
      c && (u = function(f) {
        var h, p, m, g, y = this, b = i && y.sticky, O = n.call(y), C = y.source, k = 0, w = f;
        return b && (O = O.replace("y", ""), O.indexOf("g") === -1 && (O += "g"), w = String(f).slice(y.lastIndex), y.lastIndex > 0 && (!y.multiline || y.multiline && f[y.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", w = " " + w, k++), p = new RegExp("^(?:" + C + ")", O)), l && (p = new RegExp("^" + C + "$(?!\\s)", O)), s && (h = y.lastIndex), m = o.call(b ? p : y, w), b ? m ? (m.input = m.input.slice(k), m[0] = m[0].slice(k), m.index = y.lastIndex, y.lastIndex += m[0].length) : y.lastIndex = 0 : s && m && (y.lastIndex = y.global ? m.index + m[0].length : h), l && m && m.length > 1 && t.call(m[0], p, function() {
          for (g = 1; g < arguments.length - 2; g++) arguments[g] === void 0 && (m[g] = void 0);
        }), m;
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
          var f = "suspendedStart", h = "suspendedYield", p = "executing", m = "completed", g = {}, y = {};
          y[u] = function() {
            return this;
          };
          var b = Object.getPrototypeOf, O = b && b(b(W([])));
          O && O !== r && o.call(O, u) && (y = O);
          var C = S.prototype = v.prototype = Object.create(y);
          j.prototype = C.constructor = S, S.constructor = j, S[i] = j.displayName = "GeneratorFunction", c.isGeneratorFunction = function(L) {
            var A = typeof L == "function" && L.constructor;
            return !!A && (A === j || (A.displayName || A.name) === "GeneratorFunction");
          }, c.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, S) : (L.__proto__ = S, i in L || (L[i] = "GeneratorFunction")), L.prototype = Object.create(C), L;
          }, c.awrap = function(L) {
            return { __await: L };
          }, T(_.prototype), _.prototype[s] = function() {
            return this;
          }, c.AsyncIterator = _, c.async = function(L, A, Q, ne) {
            var U = new _(k(L, A, Q, ne));
            return c.isGeneratorFunction(A) ? U : U.next().then(function(xe) {
              return xe.done ? xe.value : U.next();
            });
          }, T(C), C[i] = "Generator", C[u] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, c.keys = function(L) {
            var A = [];
            for (var Q in L) A.push(Q);
            return A.reverse(), function ne() {
              for (; A.length; ) {
                var U = A.pop();
                if (U in L) return ne.value = U, ne.done = !1, ne;
              }
              return ne.done = !0, ne;
            };
          }, c.values = W, G.prototype = { constructor: G, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ae), !L) for (var A in this) A.charAt(0) === "t" && o.call(this, A) && !isNaN(+A.slice(1)) && (this[A] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], A = L.completion;
            if (A.type === "throw") throw A.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var A = this;
            function Q(Be, Te) {
              return xe.type = "throw", xe.arg = L, A.next = Be, Te && (A.method = "next", A.arg = n), !!Te;
            }
            for (var ne = this.tryEntries.length - 1; ne >= 0; --ne) {
              var U = this.tryEntries[ne], xe = U.completion;
              if (U.tryLoc === "root") return Q("end");
              if (U.tryLoc <= this.prev) {
                var pe = o.call(U, "catchLoc"), Pe = o.call(U, "finallyLoc");
                if (pe && Pe) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                } else if (pe) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                } else {
                  if (!Pe) throw new Error("try statement without catch or finally");
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                }
              }
            }
          }, abrupt: function(L, A) {
            for (var Q = this.tryEntries.length - 1; Q >= 0; --Q) {
              var ne = this.tryEntries[Q];
              if (ne.tryLoc <= this.prev && o.call(ne, "finallyLoc") && this.prev < ne.finallyLoc) {
                var U = ne;
                break;
              }
            }
            U && (L === "break" || L === "continue") && U.tryLoc <= A && A <= U.finallyLoc && (U = null);
            var xe = U ? U.completion : {};
            return xe.type = L, xe.arg = A, U ? (this.method = "next", this.next = U.finallyLoc, g) : this.complete(xe);
          }, complete: function(L, A) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && A && (this.next = A), g;
          }, finish: function(L) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var Q = this.tryEntries[A];
              if (Q.finallyLoc === L) return this.complete(Q.completion, Q.afterLoc), ae(Q), g;
            }
          }, catch: function(L) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var Q = this.tryEntries[A];
              if (Q.tryLoc === L) {
                var ne = Q.completion;
                if (ne.type === "throw") {
                  var U = ne.arg;
                  ae(Q);
                }
                return U;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(L, A, Q) {
            return this.delegate = { iterator: W(L), resultName: A, nextLoc: Q }, this.method === "next" && (this.arg = n), g;
          } };
        }
        function k(L, A, Q, ne) {
          var U = A && A.prototype instanceof v ? A : v, xe = Object.create(U.prototype), pe = new G(ne || []);
          return xe._invoke = M(L, Q, pe), xe;
        }
        function w(L, A, Q) {
          try {
            return { type: "normal", arg: L.call(A, Q) };
          } catch (ne) {
            return { type: "throw", arg: ne };
          }
        }
        function v() {
        }
        function j() {
        }
        function S() {
        }
        function T(L) {
          ["next", "throw", "return"].forEach(function(A) {
            L[A] = function(Q) {
              return this._invoke(A, Q);
            };
          });
        }
        function _(L) {
          function A(U, xe, pe, Pe) {
            var Be = w(L[U], L, xe);
            if (Be.type !== "throw") {
              var Te = Be.arg, Ee = Te.value;
              return Ee && typeof Ee == "object" && o.call(Ee, "__await") ? Promise.resolve(Ee.__await).then(function(Oe) {
                A("next", Oe, pe, Pe);
              }, function(Oe) {
                A("throw", Oe, pe, Pe);
              }) : Promise.resolve(Ee).then(function(Oe) {
                Te.value = Oe, pe(Te);
              }, Pe);
            }
            Pe(Be.arg);
          }
          var Q;
          function ne(U, xe) {
            function pe() {
              return new Promise(function(Pe, Be) {
                A(U, xe, Pe, Be);
              });
            }
            return Q = Q ? Q.then(pe, pe) : pe();
          }
          this._invoke = ne;
        }
        function M(L, A, Q) {
          var ne = f;
          return function(U, xe) {
            if (ne === p) throw new Error("Generator is already running");
            if (ne === m) {
              if (U === "throw") throw xe;
              return F();
            }
            for (Q.method = U, Q.arg = xe; ; ) {
              var pe = Q.delegate;
              if (pe) {
                var Pe = D(pe, Q);
                if (Pe) {
                  if (Pe === g) continue;
                  return Pe;
                }
              }
              if (Q.method === "next") Q.sent = Q._sent = Q.arg;
              else if (Q.method === "throw") {
                if (ne === f) throw ne = m, Q.arg;
                Q.dispatchException(Q.arg);
              } else Q.method === "return" && Q.abrupt("return", Q.arg);
              ne = p;
              var Be = w(L, A, Q);
              if (Be.type === "normal") {
                if (ne = Q.done ? m : h, Be.arg === g) continue;
                return { value: Be.arg, done: Q.done };
              }
              Be.type === "throw" && (ne = m, Q.method = "throw", Q.arg = Be.arg);
            }
          };
        }
        function D(L, A) {
          var Q = L.iterator[A.method];
          if (Q === n) {
            if (A.delegate = null, A.method === "throw") {
              if (L.iterator.return && (A.method = "return", A.arg = n, D(L, A), A.method === "throw")) return g;
              A.method = "throw", A.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return g;
          }
          var ne = w(Q, L.iterator, A.arg);
          if (ne.type === "throw") return A.method = "throw", A.arg = ne.arg, A.delegate = null, g;
          var U = ne.arg;
          return U ? U.done ? (A[L.resultName] = U.value, A.next = L.nextLoc, A.method !== "return" && (A.method = "next", A.arg = n), A.delegate = null, g) : U : (A.method = "throw", A.arg = new TypeError("iterator result is not an object"), A.delegate = null, g);
        }
        function Z(L) {
          var A = { tryLoc: L[0] };
          1 in L && (A.catchLoc = L[1]), 2 in L && (A.finallyLoc = L[2], A.afterLoc = L[3]), this.tryEntries.push(A);
        }
        function ae(L) {
          var A = L.completion || {};
          A.type = "normal", delete A.arg, L.completion = A;
        }
        function G(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(Z, this), this.reset(!0);
        }
        function W(L) {
          if (L) {
            var A = L[u];
            if (A) return A.call(L);
            if (typeof L.next == "function") return L;
            if (!isNaN(L.length)) {
              var Q = -1, ne = function U() {
                for (; ++Q < L.length; ) if (o.call(L, Q)) return U.value = L[Q], U.done = !1, U;
                return U.value = n, U.done = !0, U;
              };
              return ne.next = ne;
            }
          }
          return { next: F };
        }
        function F() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(a, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), s = e("50c4"), i = e("8418"), l = e("65f0"), c = e("1dde"), f = e("b622"), h = e("2d00"), p = f("isConcatSpreadable"), m = 9007199254740991, g = "Maximum allowed index exceeded", y = h >= 51 || !r(function() {
        var k = [];
        return k[p] = !1, k.concat()[0] !== k;
      }), b = c("concat"), O = function(k) {
        if (!t(k)) return !1;
        var w = k[p];
        return w !== void 0 ? !!w : o(k);
      }, C = !y || !b;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(k) {
        var w, v, j, S, T, _ = u(this), M = l(_, 0), D = 0;
        for (w = -1, j = arguments.length; w < j; w++) if (T = w === -1 ? _ : arguments[w], O(T)) {
          if (S = s(T.length), D + S > m) throw TypeError(g);
          for (v = 0; v < S; v++, D++) v in T && i(M, D, T[v]);
        } else {
          if (D >= m) throw TypeError(g);
          i(M, D++, T);
        }
        return M.length = D, M;
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
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), s = e("65f0"), i = e("8418"), l = e("1dde"), c = l("splice"), f = Math.max, h = Math.min, p = 9007199254740991, m = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !c }, { splice: function(g, y) {
        var b, O, C, k, w, v, j = u(this), S = t(j.length), T = r(g, S), _ = arguments.length;
        if (_ === 0 ? b = O = 0 : _ === 1 ? (b = 0, O = S - T) : (b = _ - 2, O = h(f(o(y), 0), S - T)), S + b - O > p) throw TypeError(m);
        for (C = s(j, O), k = 0; k < O; k++) w = T + k, w in j && i(C, k, j[w]);
        if (C.length = O, b < O) {
          for (k = T; k < S - O; k++) w = k + O, v = k + b, w in j ? j[v] = j[w] : delete j[v];
          for (k = S; k > S - O + b; k--) delete j[k - 1];
        } else if (b > O) for (k = S - O; k > T; k--) w = k + O - 1, v = k + b - 1, w in j ? j[v] = j[w] : delete j[v];
        for (k = 0; k < b; k++) j[k + T] = arguments[k + 2];
        return j.length = S - O + b, C;
      } });
    }, a4b4: function(a, d, e) {
      var n = e("342f");
      a.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(a, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), s = e("4930"), i = e("fdbf"), l = e("d039"), c = e("5135"), f = e("e8b5"), h = e("861d"), p = e("825a"), m = e("7b0b"), g = e("fc6a"), y = e("c04e"), b = e("5c6c"), O = e("7c73"), C = e("df75"), k = e("241c"), w = e("057f"), v = e("7418"), j = e("06cf"), S = e("9bf2"), T = e("d1e7"), _ = e("9112"), M = e("6eeb"), D = e("5692"), Z = e("f772"), ae = e("d012"), G = e("90e3"), W = e("b622"), F = e("e538"), L = e("746f"), A = e("d44e"), Q = e("69f3"), ne = e("b727").forEach, U = Z("hidden"), xe = "Symbol", pe = "prototype", Pe = W("toPrimitive"), Be = Q.set, Te = Q.getterFor(xe), Ee = Object[pe], Oe = r.Symbol, Ve = o("JSON", "stringify"), Ge = j.f, B = S.f, R = w.f, X = T.f, V = D("symbols"), re = D("op-symbols"), ie = D("string-to-symbol-registry"), ge = D("symbol-to-string-registry"), H = D("wks"), N = r.QObject, Y = !N || !N[pe] || !N[pe].findChild, ye = u && l(function() {
        return O(B({}, "a", { get: function() {
          return B(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, oe, ce) {
        var he = Ge(Ee, oe);
        he && delete Ee[oe], B(q, oe, ce), he && q !== Ee && B(Ee, oe, he);
      } : B, Re = function(q, oe) {
        var ce = V[q] = O(Oe[pe]);
        return Be(ce, { type: xe, tag: q, description: oe }), u || (ce.description = oe), ce;
      }, Ce = i ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Oe;
      }, We = function(q, oe, ce) {
        q === Ee && We(re, oe, ce), p(q);
        var he = y(oe, !0);
        return p(ce), c(V, he) ? (ce.enumerable ? (c(q, U) && q[U][he] && (q[U][he] = !1), ce = O(ce, { enumerable: b(0, !1) })) : (c(q, U) || B(q, U, b(1, {})), q[U][he] = !0), ye(q, he, ce)) : B(q, he, ce);
      }, Ye = function(q, oe) {
        p(q);
        var ce = g(oe), he = C(ce).concat(de(ce));
        return ne(he, function(Ue) {
          u && !ut.call(ce, Ue) || We(q, Ue, ce[Ue]);
        }), q;
      }, Ze = function(q, oe) {
        return oe === void 0 ? O(q) : Ye(O(q), oe);
      }, ut = function(q) {
        var oe = y(q, !0), ce = X.call(this, oe);
        return !(this === Ee && c(V, oe) && !c(re, oe)) && (!(ce || !c(this, oe) || !c(V, oe) || c(this, U) && this[U][oe]) || ce);
      }, z = function(q, oe) {
        var ce = g(q), he = y(oe, !0);
        if (ce !== Ee || !c(V, he) || c(re, he)) {
          var Ue = Ge(ce, he);
          return !Ue || !c(V, he) || c(ce, U) && ce[U][he] || (Ue.enumerable = !0), Ue;
        }
      }, ue = function(q) {
        var oe = R(g(q)), ce = [];
        return ne(oe, function(he) {
          c(V, he) || c(ae, he) || ce.push(he);
        }), ce;
      }, de = function(q) {
        var oe = q === Ee, ce = R(oe ? re : g(q)), he = [];
        return ne(ce, function(Ue) {
          !c(V, Ue) || oe && !c(Ee, Ue) || he.push(V[Ue]);
        }), he;
      };
      if (s || (Oe = function() {
        if (this instanceof Oe) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, oe = G(q), ce = function(he) {
          this === Ee && ce.call(re, he), c(this, U) && c(this[U], oe) && (this[U][oe] = !1), ye(this, oe, b(1, he));
        };
        return u && Y && ye(Ee, oe, { configurable: !0, set: ce }), Re(oe, q);
      }, M(Oe[pe], "toString", function() {
        return Te(this).tag;
      }), M(Oe, "withoutSetter", function(q) {
        return Re(G(q), q);
      }), T.f = ut, S.f = We, j.f = z, k.f = w.f = ue, v.f = de, F.f = function(q) {
        return Re(W(q), q);
      }, u && (B(Oe[pe], "description", { configurable: !0, get: function() {
        return Te(this).description;
      } }), t || M(Ee, "propertyIsEnumerable", ut, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !s, sham: !s }, { Symbol: Oe }), ne(C(H), function(q) {
        L(q);
      }), n({ target: xe, stat: !0, forced: !s }, { for: function(q) {
        var oe = String(q);
        if (c(ie, oe)) return ie[oe];
        var ce = Oe(oe);
        return ie[oe] = ce, ge[ce] = oe, ce;
      }, keyFor: function(q) {
        if (!Ce(q)) throw TypeError(q + " is not a symbol");
        if (c(ge, q)) return ge[q];
      }, useSetter: function() {
        Y = !0;
      }, useSimple: function() {
        Y = !1;
      } }), n({ target: "Object", stat: !0, forced: !s, sham: !u }, { create: Ze, defineProperty: We, defineProperties: Ye, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !s }, { getOwnPropertyNames: ue, getOwnPropertySymbols: de }), n({ target: "Object", stat: !0, forced: l(function() {
        v.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return v.f(m(q));
      } }), Ve) {
        var ve = !s || l(function() {
          var q = Oe();
          return Ve([q]) != "[null]" || Ve({ a: q }) != "{}" || Ve(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: ve }, { stringify: function(q, oe, ce) {
          for (var he, Ue = [q], qe = 1; arguments.length > qe; ) Ue.push(arguments[qe++]);
          if (he = oe, (h(oe) || q !== void 0) && !Ce(q)) return f(oe) || (oe = function(et, _e) {
            if (typeof he == "function" && (_e = he.call(this, et, _e)), !Ce(_e)) return _e;
          }), Ue[1] = oe, Ve.apply(null, Ue);
        } });
      }
      Oe[pe][Pe] || _(Oe[pe], Pe, Oe[pe].valueOf), A(Oe, xe), ae[U] = !0;
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
      var n, r, o, t = e("d039"), u = e("e163"), s = e("9112"), i = e("5135"), l = e("b622"), c = e("c430"), f = l("iterator"), h = !1, p = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : h = !0);
      var m = n == null || t(function() {
        var g = {};
        return n[f].call(g) !== g;
      });
      m && (n = {}), c && !m || i(n, f) || s(n, f, p), a.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: h };
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
        return new Promise(function(f, h) {
          var p = c.data, m = c.headers;
          n.isFormData(p) && delete m["Content-Type"];
          var g = new XMLHttpRequest();
          if (c.auth) {
            var y = c.auth.username || "", b = c.auth.password ? unescape(encodeURIComponent(c.auth.password)) : "";
            m.Authorization = "Basic " + btoa(y + ":" + b);
          }
          var O = u(c.baseURL, c.url);
          if (g.open(c.method.toUpperCase(), t(O, c.params, c.paramsSerializer), !0), g.timeout = c.timeout, g.onreadystatechange = function() {
            if (g && g.readyState === 4 && (g.status !== 0 || g.responseURL && g.responseURL.indexOf("file:") === 0)) {
              var k = "getAllResponseHeaders" in g ? s(g.getAllResponseHeaders()) : null, w = c.responseType && c.responseType !== "text" ? g.response : g.responseText, v = { data: w, status: g.status, statusText: g.statusText, headers: k, config: c, request: g };
              r(f, h, v), g = null;
            }
          }, g.onabort = function() {
            g && (h(l("Request aborted", c, "ECONNABORTED", g)), g = null);
          }, g.onerror = function() {
            h(l("Network Error", c, null, g)), g = null;
          }, g.ontimeout = function() {
            var k = "timeout of " + c.timeout + "ms exceeded";
            c.timeoutErrorMessage && (k = c.timeoutErrorMessage), h(l(k, c, "ECONNABORTED", g)), g = null;
          }, n.isStandardBrowserEnv()) {
            var C = (c.withCredentials || i(O)) && c.xsrfCookieName ? o.read(c.xsrfCookieName) : void 0;
            C && (m[c.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in g && n.forEach(m, function(k, w) {
            typeof p > "u" && w.toLowerCase() === "content-type" ? delete m[w] : g.setRequestHeader(w, k);
          }), n.isUndefined(c.withCredentials) || (g.withCredentials = !!c.withCredentials), c.responseType) try {
            g.responseType = c.responseType;
          } catch (k) {
            if (c.responseType !== "json") throw k;
          }
          typeof c.onDownloadProgress == "function" && g.addEventListener("progress", c.onDownloadProgress), typeof c.onUploadProgress == "function" && g.upload && g.upload.addEventListener("progress", c.onUploadProgress), c.cancelToken && c.cancelToken.promise.then(function(k) {
            g && (g.abort(), h(k), g = null);
          }), p || (p = null), g.send(p);
        });
      };
    }, b575: function(a, d, e) {
      var n, r, o, t, u, s, i, l, c = e("da84"), f = e("06cf").f, h = e("2cf4").set, p = e("1cdc"), m = e("a4b4"), g = e("605d"), y = c.MutationObserver || c.WebKitMutationObserver, b = c.document, O = c.process, C = c.Promise, k = f(c, "queueMicrotask"), w = k && k.value;
      w || (n = function() {
        var v, j;
        for (g && (v = O.domain) && v.exit(); r; ) {
          j = r.fn, r = r.next;
          try {
            j();
          } catch (S) {
            throw r ? t() : o = void 0, S;
          }
        }
        o = void 0, v && v.enter();
      }, p || g || m || !y || !b ? C && C.resolve ? (i = C.resolve(void 0), l = i.then, t = function() {
        l.call(i, n);
      }) : t = g ? function() {
        O.nextTick(n);
      } : function() {
        h.call(c, n);
      } : (u = !0, s = b.createTextNode(""), new y(n).observe(s, { characterData: !0 }), t = function() {
        s.data = u = !u;
      })), a.exports = w || function(v) {
        var j = { fn: v, next: void 0 };
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
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), s = 1 .toFixed, i = Math.floor, l = function(g, y, b) {
        return y === 0 ? b : y % 2 === 1 ? l(g, y - 1, b * g) : l(g * g, y / 2, b);
      }, c = function(g) {
        for (var y = 0, b = g; b >= 4096; ) y += 12, b /= 4096;
        for (; b >= 2; ) y += 1, b /= 2;
        return y;
      }, f = function(g, y, b) {
        for (var O = -1, C = b; ++O < 6; ) C += y * g[O], g[O] = C % 1e7, C = i(C / 1e7);
      }, h = function(g, y) {
        for (var b = 6, O = 0; --b >= 0; ) O += g[b], g[b] = i(O / y), O = O % y * 1e7;
      }, p = function(g) {
        for (var y = 6, b = ""; --y >= 0; ) if (b !== "" || y === 0 || g[y] !== 0) {
          var O = String(g[y]);
          b = b === "" ? O : b + t.call("0", 7 - O.length) + O;
        }
        return b;
      }, m = s && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        s.call({});
      });
      n({ target: "Number", proto: !0, forced: m }, { toFixed: function(g) {
        var y, b, O, C, k = o(this), w = r(g), v = [0, 0, 0, 0, 0, 0], j = "", S = "0";
        if (w < 0 || w > 20) throw RangeError("Incorrect fraction digits");
        if (k != k) return "NaN";
        if (k <= -1e21 || k >= 1e21) return String(k);
        if (k < 0 && (j = "-", k = -k), k > 1e-21) if (y = c(k * l(2, 69, 1)) - 69, b = y < 0 ? k * l(2, -y, 1) : k / l(2, y, 1), b *= 4503599627370496, y = 52 - y, y > 0) {
          for (f(v, 0, b), O = w; O >= 7; ) f(v, 1e7, 0), O -= 7;
          for (f(v, l(10, O, 1), 0), O = y - 1; O >= 23; ) h(v, 1 << 23), O -= 23;
          h(v, 1 << O), f(v, 1, 1), h(v, 2), S = p(v);
        } else f(v, 0, b), f(v, 1 << -y, 0), S = p(v) + t.call("0", w);
        return w > 0 ? (C = S.length, S = j + (C <= w ? "0." + t.call("0", w - C) + S : S.slice(0, C - w) + "." + S.slice(C - w))) : S = j + S, S;
      } });
    }, b727: function(a, d, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), s = [].push, i = function(l) {
        var c = l == 1, f = l == 2, h = l == 3, p = l == 4, m = l == 6, g = l == 7, y = l == 5 || m;
        return function(b, O, C, k) {
          for (var w, v, j = o(b), S = r(j), T = n(O, C, 3), _ = t(S.length), M = 0, D = k || u, Z = c ? D(b, _) : f || g ? D(b, 0) : void 0; _ > M; M++) if ((y || M in S) && (w = S[M], v = T(w, M, j), l)) if (c) Z[M] = v;
          else if (v) switch (l) {
            case 3:
              return !0;
            case 5:
              return w;
            case 6:
              return M;
            case 2:
              s.call(Z, w);
          }
          else switch (l) {
            case 4:
              return !1;
            case 7:
              s.call(Z, w);
          }
          return m ? -1 : h || p ? p : Z;
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
      function o(_) {
        return r.call(_) === "[object Array]";
      }
      function t(_) {
        return typeof _ > "u";
      }
      function u(_) {
        return _ !== null && !t(_) && _.constructor !== null && !t(_.constructor) && typeof _.constructor.isBuffer == "function" && _.constructor.isBuffer(_);
      }
      function s(_) {
        return r.call(_) === "[object ArrayBuffer]";
      }
      function i(_) {
        return typeof FormData < "u" && _ instanceof FormData;
      }
      function l(_) {
        var M;
        return M = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(_) : _ && _.buffer && _.buffer instanceof ArrayBuffer, M;
      }
      function c(_) {
        return typeof _ == "string";
      }
      function f(_) {
        return typeof _ == "number";
      }
      function h(_) {
        return _ !== null && typeof _ == "object";
      }
      function p(_) {
        if (r.call(_) !== "[object Object]") return !1;
        var M = Object.getPrototypeOf(_);
        return M === null || M === Object.prototype;
      }
      function m(_) {
        return r.call(_) === "[object Date]";
      }
      function g(_) {
        return r.call(_) === "[object File]";
      }
      function y(_) {
        return r.call(_) === "[object Blob]";
      }
      function b(_) {
        return r.call(_) === "[object Function]";
      }
      function O(_) {
        return h(_) && b(_.pipe);
      }
      function C(_) {
        return typeof URLSearchParams < "u" && _ instanceof URLSearchParams;
      }
      function k(_) {
        return _.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function w() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function v(_, M) {
        if (_ !== null && typeof _ < "u") if (typeof _ != "object" && (_ = [_]), o(_)) for (var D = 0, Z = _.length; D < Z; D++) M.call(null, _[D], D, _);
        else for (var ae in _) Object.prototype.hasOwnProperty.call(_, ae) && M.call(null, _[ae], ae, _);
      }
      function j() {
        var _ = {};
        function M(ae, G) {
          p(_[G]) && p(ae) ? _[G] = j(_[G], ae) : p(ae) ? _[G] = j({}, ae) : o(ae) ? _[G] = ae.slice() : _[G] = ae;
        }
        for (var D = 0, Z = arguments.length; D < Z; D++) v(arguments[D], M);
        return _;
      }
      function S(_, M, D) {
        return v(M, function(Z, ae) {
          _[ae] = D && typeof Z == "function" ? n(Z, D) : Z;
        }), _;
      }
      function T(_) {
        return _.charCodeAt(0) === 65279 && (_ = _.slice(1)), _;
      }
      a.exports = { isArray: o, isArrayBuffer: s, isBuffer: u, isFormData: i, isArrayBufferView: l, isString: c, isNumber: f, isObject: h, isPlainObject: p, isUndefined: t, isDate: m, isFile: g, isBlob: y, isFunction: b, isStream: O, isURLSearchParams: C, isStandardBrowserEnv: w, forEach: v, merge: j, extend: S, trim: k, stripBOM: T };
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
          var h = r(i), p = o(h), m = t(h.length), g = s ? m - 1 : 0, y = s ? -1 : 1;
          if (c < 2) for (; ; ) {
            if (g in p) {
              f = p[g], g += y;
              break;
            }
            if (g += y, s ? g < 0 : m <= g) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; s ? g >= 0 : m > g; g += y) g in p && (f = l(f, p[g], g, h));
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
          var m = [];
          return m.groups = { a: "7" }, m;
        }, "".replace(p, "$<a>") !== "7";
      }), l = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), c = o("replace"), f = function() {
        return !!/./[c] && /./[c]("a", "$0") === "";
      }(), h = !r(function() {
        var p = /(?:)/, m = p.exec;
        p.exec = function() {
          return m.apply(this, arguments);
        };
        var g = "ab".split(p);
        return g.length !== 2 || g[0] !== "a" || g[1] !== "b";
      });
      a.exports = function(p, m, g, y) {
        var b = o(p), O = !r(function() {
          var S = {};
          return S[b] = function() {
            return 7;
          }, ""[p](S) != 7;
        }), C = O && !r(function() {
          var S = !1, T = /a/;
          return p === "split" && (T = {}, T.constructor = {}, T.constructor[s] = function() {
            return T;
          }, T.flags = "", T[b] = /./[b]), T.exec = function() {
            return S = !0, null;
          }, T[b](""), !S;
        });
        if (!O || !C || p === "replace" && (!i || !l || f) || p === "split" && !h) {
          var k = /./[b], w = g(b, ""[p], function(S, T, _, M, D) {
            return T.exec === t ? O && !D ? { done: !0, value: k.call(T, _, M) } : { done: !0, value: S.call(_, T, M) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: l, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), v = w[0], j = w[1];
          n(String.prototype, p, v), n(RegExp.prototype, b, m == 2 ? function(S, T) {
            return j.call(S, this, T);
          } : function(S) {
            return j.call(S, this);
          });
        }
        y && u(RegExp.prototype[b], "sham", !0);
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
        for (var l, c, f = t(i), h = u.f, p = o(f), m = {}, g = 0; p.length > g; ) c = h(f, l = p[g++]), c !== void 0 && s(m, l, c);
        return m;
      } });
    }, ddb0: function(a, d, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), u = e("b622"), s = u("iterator"), i = u("toStringTag"), l = o.values;
      for (var c in r) {
        var f = n[c], h = f && f.prototype;
        if (h) {
          if (h[s] !== l) try {
            t(h, s, l);
          } catch {
            h[s] = l;
          }
          if (h[i] || t(h, i, c), r[c]) {
            for (var p in o) if (h[p] !== o[p]) try {
              t(h, p, o[p]);
            } catch {
              h[p] = o[p];
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
          function l(y) {
            for (var b = 0; b < y.length && y[b] === ""; b++) ;
            for (var O = y.length - 1; O >= 0 && y[O] === ""; O--) ;
            return b > O ? [] : y.slice(b, O - b + 1);
          }
          s = d.resolve(s).substr(1), i = d.resolve(i).substr(1);
          for (var c = l(s.split("/")), f = l(i.split("/")), h = Math.min(c.length, f.length), p = h, m = 0; m < h; m++) if (c[m] !== f[m]) {
            p = m;
            break;
          }
          var g = [];
          for (m = p; m < c.length; m++) g.push("..");
          return g = g.concat(f.slice(p)), g.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(s) {
          if (typeof s != "string" && (s += ""), s.length === 0) return ".";
          for (var i = s.charCodeAt(0), l = i === 47, c = -1, f = !0, h = s.length - 1; h >= 1; --h) if (i = s.charCodeAt(h), i === 47) {
            if (!f) {
              c = h;
              break;
            }
          } else f = !1;
          return c === -1 ? l ? "/" : "." : l && c === 1 ? "/" : s.slice(0, c);
        }, d.basename = function(s, i) {
          var l = o(s);
          return i && l.substr(-1 * i.length) === i && (l = l.substr(0, l.length - i.length)), l;
        }, d.extname = function(s) {
          typeof s != "string" && (s += "");
          for (var i = -1, l = 0, c = -1, f = !0, h = 0, p = s.length - 1; p >= 0; --p) {
            var m = s.charCodeAt(p);
            if (m !== 47) c === -1 && (f = !1, c = p + 1), m === 46 ? i === -1 ? i = p : h !== 1 && (h = 1) : i !== -1 && (h = -1);
            else if (!f) {
              l = p + 1;
              break;
            }
          }
          return i === -1 || c === -1 || h === 0 || h === 1 && i === c - 1 && i === l + 1 ? "" : s.slice(i, c);
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
          var r = function(m) {
            var g = m.id, y = m.viewBox, b = m.content;
            this.id = g, this.viewBox = y, this.content = b;
          };
          r.prototype.stringify = function() {
            return this.content;
          }, r.prototype.toString = function() {
            return this.stringify();
          }, r.prototype.destroy = function() {
            var m = this;
            ["id", "viewBox", "content"].forEach(function(g) {
              return delete m[g];
            });
          };
          var o = function(m) {
            var g = !!document.importNode, y = new DOMParser().parseFromString(m, "image/svg+xml").documentElement;
            return g ? document.importNode(y, !0) : y;
          };
          function t(m, g) {
            return g = { exports: {} }, m(g, g.exports), g.exports;
          }
          var u = t(function(m, g) {
            (function(y, b) {
              m.exports = b();
            })(0, function() {
              function y(v) {
                var j = v && typeof v == "object";
                return j && Object.prototype.toString.call(v) !== "[object RegExp]" && Object.prototype.toString.call(v) !== "[object Date]";
              }
              function b(v) {
                return Array.isArray(v) ? [] : {};
              }
              function O(v, j) {
                var S = j && j.clone === !0;
                return S && y(v) ? w(b(v), v, j) : v;
              }
              function C(v, j, S) {
                var T = v.slice();
                return j.forEach(function(_, M) {
                  typeof T[M] > "u" ? T[M] = O(_, S) : y(_) ? T[M] = w(v[M], _, S) : v.indexOf(_) === -1 && T.push(O(_, S));
                }), T;
              }
              function k(v, j, S) {
                var T = {};
                return y(v) && Object.keys(v).forEach(function(_) {
                  T[_] = O(v[_], S);
                }), Object.keys(j).forEach(function(_) {
                  y(j[_]) && v[_] ? T[_] = w(v[_], j[_], S) : T[_] = O(j[_], S);
                }), T;
              }
              function w(v, j, S) {
                var T = Array.isArray(j), _ = S || { arrayMerge: C }, M = _.arrayMerge || C;
                return T ? Array.isArray(v) ? M(v, j, S) : O(j, S) : k(v, j, S);
              }
              return w.all = function(v, j) {
                if (!Array.isArray(v) || v.length < 2) throw new Error("first argument should be an array with at least two elements");
                return v.reduce(function(S, T) {
                  return w(S, T, j);
                });
              }, w;
            });
          }), s = t(function(m, g) {
            var y = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            g.default = y, m.exports = g.default;
          }), i = function(m) {
            return Object.keys(m).map(function(g) {
              var y = m[g].toString().replace(/"/g, "&quot;");
              return g + '="' + y + '"';
            }).join(" ");
          }, l = s.svg, c = s.xlink, f = {};
          f[l.name] = l.uri, f[c.name] = c.uri;
          var h = function(m, g) {
            m === void 0 && (m = "");
            var y = u(f, {}), b = i(y);
            return "<svg " + b + ">" + m + "</svg>";
          }, p = function(m) {
            function g() {
              m.apply(this, arguments);
            }
            m && (g.__proto__ = m), g.prototype = Object.create(m && m.prototype), g.prototype.constructor = g;
            var y = { isMounted: {} };
            return y.isMounted.get = function() {
              return !!this.node;
            }, g.createFromExistingNode = function(b) {
              return new g({ id: b.getAttribute("id"), viewBox: b.getAttribute("viewBox"), content: b.outerHTML });
            }, g.prototype.destroy = function() {
              this.isMounted && this.unmount(), m.prototype.destroy.call(this);
            }, g.prototype.mount = function(b) {
              if (this.isMounted) return this.node;
              var O = typeof b == "string" ? document.querySelector(b) : b, C = this.render();
              return this.node = C, O.appendChild(C), C;
            }, g.prototype.render = function() {
              var b = this.stringify();
              return o(h(b)).childNodes[0];
            }, g.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(g.prototype, y), g;
          }(r);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(a, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), s = e("9bf2").f, i = e("e893"), l = o.Symbol;
      if (r && typeof l == "function" && (!("description" in l.prototype) || l().description !== void 0)) {
        var c = {}, f = function() {
          var y = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), b = this instanceof f ? new l(y) : y === void 0 ? l() : l(y);
          return y === "" && (c[b] = !0), b;
        };
        i(f, l);
        var h = f.prototype = l.prototype;
        h.constructor = f;
        var p = h.toString, m = String(l("test")) == "Symbol(test)", g = /^Symbol\((.*)\)[^)]+$/;
        s(h, "description", { configurable: !0, get: function() {
          var y = u(this) ? this.valueOf() : this, b = p.call(y);
          if (t(c, y)) return "";
          var O = m ? b.slice(7, -1) : b.replace(g, "$1");
          return O === "" ? void 0 : O;
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
        var c = l(this), f = c.target, h = c.kind, p = c.index++;
        return !f || p >= f.length ? (c.target = void 0, { value: void 0, done: !0 }) : h == "keys" ? { value: p, done: !1 } : h == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
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
      var n, r, o, t, u = e("23e7"), s = e("c430"), i = e("da84"), l = e("d066"), c = e("fea9"), f = e("6eeb"), h = e("e2cc"), p = e("d44e"), m = e("2626"), g = e("861d"), y = e("1c0b"), b = e("19aa"), O = e("8925"), C = e("2266"), k = e("1c7e"), w = e("4840"), v = e("2cf4").set, j = e("b575"), S = e("cdf9"), T = e("44de"), _ = e("f069"), M = e("e667"), D = e("69f3"), Z = e("94ca"), ae = e("b622"), G = e("605d"), W = e("2d00"), F = ae("species"), L = "Promise", A = D.get, Q = D.set, ne = D.getterFor(L), U = c, xe = i.TypeError, pe = i.document, Pe = i.process, Be = l("fetch"), Te = _.f, Ee = Te, Oe = !!(pe && pe.createEvent && i.dispatchEvent), Ve = typeof PromiseRejectionEvent == "function", Ge = "unhandledrejection", B = "rejectionhandled", R = 0, X = 1, V = 2, re = 1, ie = 2, ge = Z(L, function() {
        var z = O(U) !== String(U);
        if (!z && (W === 66 || !G && !Ve) || s && !U.prototype.finally) return !0;
        if (W >= 51 && /native code/.test(U)) return !1;
        var ue = U.resolve(1), de = function(q) {
          q(function() {
          }, function() {
          });
        }, ve = ue.constructor = {};
        return ve[F] = de, !(ue.then(function() {
        }) instanceof de);
      }), H = ge || !k(function(z) {
        U.all(z).catch(function() {
        });
      }), N = function(z) {
        var ue;
        return !(!g(z) || typeof (ue = z.then) != "function") && ue;
      }, Y = function(z, ue) {
        if (!z.notified) {
          z.notified = !0;
          var de = z.reactions;
          j(function() {
            for (var ve = z.value, q = z.state == X, oe = 0; de.length > oe; ) {
              var ce, he, Ue, qe = de[oe++], et = q ? qe.ok : qe.fail, _e = qe.resolve, tt = qe.reject, Qe = qe.domain;
              try {
                et ? (q || (z.rejection === ie && We(z), z.rejection = re), et === !0 ? ce = ve : (Qe && Qe.enter(), ce = et(ve), Qe && (Qe.exit(), Ue = !0)), ce === qe.promise ? tt(xe("Promise-chain cycle")) : (he = N(ce)) ? he.call(ce, _e, tt) : _e(ce)) : tt(ve);
              } catch (gt) {
                Qe && !Ue && Qe.exit(), tt(gt);
              }
            }
            z.reactions = [], z.notified = !1, ue && !z.rejection && Re(z);
          });
        }
      }, ye = function(z, ue, de) {
        var ve, q;
        Oe ? (ve = pe.createEvent("Event"), ve.promise = ue, ve.reason = de, ve.initEvent(z, !1, !0), i.dispatchEvent(ve)) : ve = { promise: ue, reason: de }, !Ve && (q = i["on" + z]) ? q(ve) : z === Ge && T("Unhandled promise rejection", de);
      }, Re = function(z) {
        v.call(i, function() {
          var ue, de = z.facade, ve = z.value, q = Ce(z);
          if (q && (ue = M(function() {
            G ? Pe.emit("unhandledRejection", ve, de) : ye(Ge, de, ve);
          }), z.rejection = G || Ce(z) ? ie : re, ue.error)) throw ue.value;
        });
      }, Ce = function(z) {
        return z.rejection !== re && !z.parent;
      }, We = function(z) {
        v.call(i, function() {
          var ue = z.facade;
          G ? Pe.emit("rejectionHandled", ue) : ye(B, ue, z.value);
        });
      }, Ye = function(z, ue, de) {
        return function(ve) {
          z(ue, ve, de);
        };
      }, Ze = function(z, ue, de) {
        z.done || (z.done = !0, de && (z = de), z.value = ue, z.state = V, Y(z, !0));
      }, ut = function(z, ue, de) {
        if (!z.done) {
          z.done = !0, de && (z = de);
          try {
            if (z.facade === ue) throw xe("Promise can't be resolved itself");
            var ve = N(ue);
            ve ? j(function() {
              var q = { done: !1 };
              try {
                ve.call(ue, Ye(ut, q, z), Ye(Ze, q, z));
              } catch (oe) {
                Ze(q, oe, z);
              }
            }) : (z.value = ue, z.state = X, Y(z, !1));
          } catch (q) {
            Ze({ done: !1 }, q, z);
          }
        }
      };
      ge && (U = function(z) {
        b(this, U, L), y(z), n.call(this);
        var ue = A(this);
        try {
          z(Ye(ut, ue), Ye(Ze, ue));
        } catch (de) {
          Ze(ue, de);
        }
      }, n = function(z) {
        Q(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: R, value: void 0 });
      }, n.prototype = h(U.prototype, { then: function(z, ue) {
        var de = ne(this), ve = Te(w(this, U));
        return ve.ok = typeof z != "function" || z, ve.fail = typeof ue == "function" && ue, ve.domain = G ? Pe.domain : void 0, de.parent = !0, de.reactions.push(ve), de.state != R && Y(de, !1), ve.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), r = function() {
        var z = new n(), ue = A(z);
        this.promise = z, this.resolve = Ye(ut, ue), this.reject = Ye(Ze, ue);
      }, _.f = Te = function(z) {
        return z === U || z === o ? new r(z) : Ee(z);
      }, s || typeof c != "function" || (t = c.prototype.then, f(c.prototype, "then", function(z, ue) {
        var de = this;
        return new U(function(ve, q) {
          t.call(de, ve, q);
        }).then(z, ue);
      }, { unsafe: !0 }), typeof Be == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return S(U, Be.apply(i, arguments));
      } }))), u({ global: !0, wrap: !0, forced: ge }, { Promise: U }), p(U, L, !1, !0), m(L), o = l(L), u({ target: L, stat: !0, forced: ge }, { reject: function(z) {
        var ue = Te(this);
        return ue.reject.call(void 0, z), ue.promise;
      } }), u({ target: L, stat: !0, forced: s || ge }, { resolve: function(z) {
        return S(s && this === o ? U : this, z);
      } }), u({ target: L, stat: !0, forced: H }, { all: function(z) {
        var ue = this, de = Te(ue), ve = de.resolve, q = de.reject, oe = M(function() {
          var ce = y(ue.resolve), he = [], Ue = 0, qe = 1;
          C(z, function(et) {
            var _e = Ue++, tt = !1;
            he.push(void 0), qe++, ce.call(ue, et).then(function(Qe) {
              tt || (tt = !0, he[_e] = Qe, --qe || ve(he));
            }, q);
          }), --qe || ve(he);
        });
        return oe.error && q(oe.value), de.promise;
      }, race: function(z) {
        var ue = this, de = Te(ue), ve = de.reject, q = M(function() {
          var oe = y(ue.resolve);
          C(z, function(ce) {
            oe.call(ue, ce).then(de.resolve, ve);
          });
        });
        return q.error && ve(q.value), de.promise;
      } });
    }, e893: function(a, d, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      a.exports = function(u, s) {
        for (var i = r(s), l = t.f, c = o.f, f = 0; f < i.length; f++) {
          var h = i[f];
          n(u, h) || l(u, h, c(s, h));
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
      }, f = function(y) {
        t(y, i, { value: { objectID: "O" + ++l, weakData: {} } });
      }, h = function(y, b) {
        if (!r(y)) return typeof y == "symbol" ? y : (typeof y == "string" ? "S" : "P") + y;
        if (!o(y, i)) {
          if (!c(y)) return "F";
          if (!b) return "E";
          f(y);
        }
        return y[i].objectID;
      }, p = function(y, b) {
        if (!o(y, i)) {
          if (!c(y)) return !0;
          if (!b) return !1;
          f(y);
        }
        return y[i].weakData;
      }, m = function(y) {
        return s && g.REQUIRED && c(y) && !o(y, i) && f(y), y;
      }, g = a.exports = { REQUIRED: !1, fastKey: h, getWeakData: p, onFreeze: m };
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
      function i(x, $, I, P, K, se) {
        var fe = Object(t.resolveComponent)("Result"), le = Object(t.resolveComponent)("DefaultBoard"), me = Object(t.resolveComponent)("HandBoard"), $e = Object(t.resolveComponent)("svg-icon"), Me = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: $[1] || ($[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(fe, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", s, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(me, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)($e, { "icon-class": "drag" })], 4)), [[Me]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function l(x, $, I) {
        return $ in x ? Object.defineProperty(x, $, { value: I, enumerable: !0, configurable: !0, writable: !0 }) : x[$] = I, x;
      }
      function c(x, $) {
        var I = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var P = Object.getOwnPropertySymbols(x);
          $ && (P = P.filter(function(K) {
            return Object.getOwnPropertyDescriptor(x, K).enumerable;
          })), I.push.apply(I, P);
        }
        return I;
      }
      function f(x) {
        for (var $ = 1; $ < arguments.length; $++) {
          var I = arguments[$] != null ? arguments[$] : {};
          $ % 2 ? c(Object(I), !0).forEach(function(P) {
            l(x, P, I[P]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(I)) : c(Object(I)).forEach(function(P) {
            Object.defineProperty(x, P, Object.getOwnPropertyDescriptor(I, P));
          });
        }
        return x;
      }
      function h(x, $) {
        ($ == null || $ > x.length) && ($ = x.length);
        for (var I = 0, P = new Array($); I < $; I++) P[I] = x[I];
        return P;
      }
      function p(x) {
        if (Array.isArray(x)) return h(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function m(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function g(x, $) {
        if (x) {
          if (typeof x == "string") return h(x, $);
          var I = Object.prototype.toString.call(x).slice(8, -1);
          return I === "Object" && x.constructor && (I = x.constructor.name), I === "Map" || I === "Set" ? Array.from(x) : I === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(I) ? h(x, $) : void 0;
        }
      }
      function y() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function b(x) {
        return p(x) || m(x) || g(x) || y();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function O(x, $) {
        if (!(x instanceof $)) throw new TypeError("Cannot call a class as a function");
      }
      function C(x, $) {
        for (var I = 0; I < $.length; I++) {
          var P = $[I];
          P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(x, P.key, P);
        }
      }
      function k(x, $, I) {
        return $ && C(x.prototype, $), x;
      }
      var w = function() {
        function x() {
          O(this, x), this.listeners = {};
        }
        return k(x, [{ key: "on", value: function($, I) {
          var P = this, K = this.listeners[$];
          return K || (K = []), K.push(I), this.listeners[$] = K, function() {
            P.remove($, I);
          };
        } }, { key: "emit", value: function($) {
          var I = this.listeners[$];
          if (Array.isArray(I)) {
            for (var P = arguments.length, K = new Array(P > 1 ? P - 1 : 0), se = 1; se < P; se++) K[se - 1] = arguments[se];
            for (var fe = 0; fe < I.length; fe++) {
              var le = I[fe];
              typeof le == "function" && le.apply(void 0, K);
            }
          }
        } }, { key: "remove", value: function($, I) {
          if (I) {
            var P = this.listeners[$];
            if (!P) return;
            P = P.filter(function(K) {
              return K !== I;
            }), this.listeners[$] = P;
          } else this.listeners[$] = null, delete this.listeners[$];
        } }]), x;
      }(), v = new w(), j = { mounted: function(x, $, I) {
        var P = x.parentNode;
        x.onmousedown = function(K) {
          var se = K.clientX - P.offsetLeft, fe = K.clientY - P.offsetTop;
          document.onmousemove = function(le) {
            var me = le.clientX - se, $e = le.clientY - fe;
            P.style.left = me + "px", P.style.top = $e + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              v.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(K) {
          var se = K.touches[0].pageX, fe = K.touches[0].pageY, le = se - P.offsetLeft, me = fe - P.offsetTop;
          document.ontouchmove = function($e) {
            var Me = $e.touches[0].pageX, Fe = $e.touches[0].pageY, ze = Me - le, vt = Fe - me;
            P.style.left = ze + "px", P.style.top = vt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              v.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, S = j, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var _ = { key: 0, class: "key-board-code-show" }, M = { class: "key-board-result-show" }, D = { class: "key-board-result-show-container" }, Z = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ae = T(function(x, $, I, P, K, se) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", _, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", M, [Object(t.createVNode)("div", D, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(fe, le) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: le, onClick: function(me) {
            return x.selectWord(fe);
          } }, Object(t.toDisplayString)(le + 1) + "." + Object(t.toDisplayString)(fe), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", Z, [Object(t.createVNode)("span", { style: x.getStyle, onClick: $[1] || ($[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: $[2] || ($[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), G = (e("1276"), e("6062"), e("5319"), function(x, $) {
        for (var I = 0, P = []; I < x.length; ) P.push(x.slice(I, I += $));
        return P;
      }), W = Symbol("KEYBOARD_CONTEXT"), F = function(x) {
        Object(t.provide)(W, x);
      }, L = function() {
        return Object(t.inject)(W);
      }, A = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, $) {
        var I = $.emit, P = L(), K = Object(t.computed)(function() {
          return { borderTopColor: P == null ? void 0 : P.color };
        }), se = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function fe() {
          se.showIndex !== 0 && (se.showIndex -= 1);
        }
        function le() {
          se.showIndex !== se.showList.length - 1 && (se.showIndex += 1);
        }
        function me() {
          se.showIndex = 0, se.showList = [], se.valueList = [], v.emit("resultReset");
        }
        function $e(Me) {
          me(), I("change", Me);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(Me) {
          var Fe;
          se.showIndex = 0, se.valueList = (Me == null || (Fe = Me.value) === null || Fe === void 0 ? void 0 : Fe.split("")) || [], se.valueList.length !== 0 ? se.showList = G(se.valueList, 11) : se.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          v.on("keyBoardChange", function(Me) {
            v.emit("updateBound"), se.status = Me, me();
          }), v.on("getWordsFromServer", function(Me) {
            var Fe = Array.from(new Set(Me.replace(/\s+/g, "").split("")));
            se.valueList = Fe, se.showList = G(Fe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          v.remove("keyBoardChange"), v.remove("getWordsFromServer");
        }), f({ color: P == null ? void 0 : P.color, upper: fe, lower: le, getStyle: K, selectWord: $e }, Object(t.toRefs)(se));
      } });
      e("e66c"), A.render = ae, A.__scopeId = "data-v-02e63132";
      var Q = A, ne = e("bc3a"), U = e.n(ne), xe = 15e3, pe = function(x) {
        U.a.defaults.baseURL = x, U.a.defaults.timeout = xe, U.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Pe(x, $, I, P, K, se) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Be = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var $ = L(), I = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: $ == null ? void 0 : $.color, iconName: I };
      } });
      e("38cd"), Be.render = Pe;
      var Te = Be, Ee = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Oe = { class: "hand-write-board" }, Ve = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Ge = Ee(function(x, $, I, P, K, se) {
        var fe = Object(t.resolveComponent)("PaintBoard"), le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Oe, [Object(t.createVNode)(fe, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Ve, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(me) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: me.type, type: me.type, data: me.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), B = { class: "paint-board" };
      function R(x, $, I, P, K, se) {
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
      function X(x, $, I, P, K, se, fe) {
        try {
          var le = x[se](fe), me = le.value;
        } catch ($e) {
          return void I($e);
        }
        le.done ? $(me) : Promise.resolve(me).then(P, K);
      }
      function V(x) {
        return function() {
          var $ = this, I = arguments;
          return new Promise(function(P, K) {
            var se = x.apply($, I);
            function fe(me) {
              X(se, P, K, fe, le, "next", me);
            }
            function le(me) {
              X(se, P, K, fe, le, "throw", me);
            }
            fe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var re, ie, ge = function() {
        var x = V(regeneratorRuntime.mark(function $(I, P, K, se) {
          return regeneratorRuntime.wrap(function(fe) {
            for (; ; ) switch (fe.prev = fe.next) {
              case 0:
                return fe.next = 2, U.a.post("", { lib: se, lpXis: I, lpYis: P, lpCis: K });
              case 2:
                return fe.abrupt("return", fe.sent);
              case 3:
              case "end":
                return fe.stop();
            }
          }, $);
        }));
        return function($, I, P, K) {
          return x.apply(this, arguments);
        };
      }(), H = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var $ = L(), I = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), P = Object(t.ref)(null);
        function K() {
          return se.apply(this, arguments);
        }
        function se() {
          return se = V(regeneratorRuntime.mark(function Le() {
            var Ke, De;
            return regeneratorRuntime.wrap(function(Xe) {
              for (; ; ) switch (Xe.prev = Xe.next) {
                case 0:
                  return Xe.next = 2, ge(I.clickX, I.clickY, I.clickC, x.lib);
                case 2:
                  Ke = Xe.sent, De = Ke.data, v.emit("getWordsFromServer", (De == null ? void 0 : De.v) || "");
                case 5:
                case "end":
                  return Xe.stop();
              }
            }, Le);
          })), se.apply(this, arguments);
        }
        function fe() {
          P.value && re && (I.clickX = [], I.clickY = [], I.clickC = [], re.clearRect(0, 0, I.width, I.height));
        }
        function le(Le) {
          if (Le.type.includes("mouse")) {
            var Ke = Le;
            return Math.floor(Ke.clientX - I.x);
          }
          if (Le.type.includes("touch")) {
            var De, Xe = Le;
            return Math.floor(((De = Xe.targetTouches[0]) === null || De === void 0 ? void 0 : De.clientX) - I.x);
          }
          return 0;
        }
        function me(Le) {
          if (Le.type.includes("mouse")) {
            var Ke = Le;
            return Math.floor(Ke.clientY - I.y);
          }
          if (Le.type.includes("touch")) {
            var De, Xe = Le;
            return Math.floor(((De = Xe.targetTouches[0]) === null || De === void 0 ? void 0 : De.clientY) - I.y);
          }
          return 0;
        }
        function $e(Le) {
          if (re) {
            I.isMouseDown = !0;
            var Ke = le(Le), De = me(Le);
            clearTimeout(ie), I.oldX = Ke, I.oldY = De, re.beginPath();
          }
        }
        function Me(Le) {
          if (re && (Le.preventDefault(), I.isMouseDown)) {
            var Ke = le(Le), De = me(Le);
            I.clickX.push(Ke), I.clickY.push(De), I.clickC.push(0), re.strokeStyle = $ == null ? void 0 : $.color, re.fillStyle = $ == null ? void 0 : $.color, re.lineWidth = 4, re.lineCap = "round", re.moveTo(I.oldX, I.oldY), re.lineTo(Ke, De), re.stroke(), I.oldX = Ke, I.oldY = De;
          }
        }
        function Fe() {
          I.isMouseDown && (I.isMouseDown = !1, ie = setTimeout(function() {
            fe();
          }, 1500), I.clickC.pop(), I.clickC.push(1), K());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Le = document.querySelector(".paint-board").getBoundingClientRect();
              I.x = Le.x, I.y = Le.y, I.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), I.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function vt() {
          var Le;
          re = (Le = P.value) === null || Le === void 0 ? void 0 : Le.getContext("2d"), fe(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          vt(), v.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), v.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(I)), {}, { move: Me, down: $e, mouseup: Fe, canvasRef: P });
      } });
      H.render = R;
      var N = H;
      function Y(x, $, I, P, K, se) {
        var fe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: $[1] || ($[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: $[2] || ($[2] = function(le) {
          return x.isHoverStatus = !0;
        }), onMouseleave: $[3] || ($[3] = function(le) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(fe, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ye = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Te }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, $) {
        var I = $.emit, P = L(), K = Object(t.ref)(!1), se = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), fe = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || K.value ? { color: "#f5f5f5", background: P == null ? void 0 : P.color } : { color: P == null ? void 0 : P.color, background: "#f5f5f5" };
        });
        function le(me) {
          me.preventDefault(), I("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: K, getStyle: fe, getCode: se, click: le };
      } });
      e("de23"), ye.render = Y;
      var Re = ye, Ce = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: N, KeyCodeButton: Re }, setup: function(x, $) {
        var I = $.emit, P = L(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function se(fe) {
          var le = fe.data, me = fe.type;
          switch (me) {
            case "close":
              P == null || P.closeKeyBoard();
              break;
            case "back":
              P == null || P.changeDefaultBoard(), v.emit("resultReset"), v.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              I("trigger", { data: le, type: me });
              break;
          }
        }
        return f({ click: se }, Object(t.toRefs)(K));
      } });
      e("9aaf"), Ce.render = Ge, Ce.__scopeId = "data-v-1b5e0983";
      var We = Ce, Ye = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Ze = { class: "default-key-board" }, ut = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Ye(function(x, $, I, P, K, se) {
        var fe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ze, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(le, me) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(me + 1)], key: me }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(le, function($e) {
            return Object(t.openBlock)(), Object(t.createBlock)(fe, { isUpper: x.isUpper, key: $e, type: $e, data: $e, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", ut, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(le) {
          return Object(t.openBlock)(), Object(t.createBlock)(fe, { key: le.type, type: le.type, data: le.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ue = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), de = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, ve = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], oe = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Re }, emits: ["translate", "trigger", "change"], setup: function(x, $) {
        var I = $.emit, P = L(), K = Object(t.reactive)({ lineList: [de.line1, de.line2, de.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function se() {
          var le;
          K.line4 = JSON.parse(JSON.stringify(q)), P != null && (le = P.modeList) !== null && le !== void 0 && le.find(function(me) {
            return me === "handwrite";
          }) && P !== null && P !== void 0 && P.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function fe(le) {
          var me = le.data, $e = le.type;
          switch ($e) {
            case "close":
              K.oldVal = "", P == null || P.closeKeyBoard();
              break;
            case "upper":
              K.oldVal = "", K.isUpper = !K.isUpper;
              break;
            case "change2lang":
              K.isCn = !K.isCn, K.isNum || K.isSymbol || v.emit("keyBoardChange", K.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (K.isNum = !K.isNum, K.isSymbol = !1, K.isNum) {
                var Me;
                v.emit("keyBoardChange", "number");
                var Fe = JSON.parse(JSON.stringify(ve.line3));
                P != null && (Me = P.modeList) !== null && Me !== void 0 && Me.find(function(ze) {
                  return ze === "symbol";
                }) || (Fe.shift(), Fe.unshift("+")), K.lineList = [ve.line1, ve.line2, Fe];
              } else v.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [de.line1, de.line2, de.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (v.emit("keyBoardChange", "symbol"), K.lineList = [ue.line1, ue.line2, ue.line3]) : (v.emit("keyBoardChange", "number"), K.lineList = [ve.line1, ve.line2, ve.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && $e === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), I("translate", K.oldVal)) : ($e === "handwrite" && v.emit("keyBoardChange", "handwrite"), I("trigger", { data: me, type: $e }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? I("change", me) : (I("translate", K.oldVal + me), K.oldVal = K.oldVal + me);
              break;
          }
        }
        return se(), Object(t.onMounted)(function() {
          v.on("resultReset", function() {
            K.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(K)), {}, { click: fe });
      } });
      e("f8b0"), oe.render = z, oe.__scopeId = "data-v-4b78e5a1";
      var ce = oe, he = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ue = e("ec57"), qe = function(x) {
        return x.keys().map(x);
      };
      qe(Ue);
      var et = [], _e = null, tt = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: S }, components: { Result: Q, SvgIcon: Te, HandBoard: We, DefaultBoard: ce }, setup: function(x, $) {
        var I = $.emit, P = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function se(Se) {
          var je, Ae;
          switch (Object(t.nextTick)(function() {
            v.emit("keyBoardChange", "CN");
          }), Se) {
            case "en":
              P.showMode = "default", Object(t.nextTick)(function() {
                var Ie;
                (Ie = K.value) === null || Ie === void 0 || Ie.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              P.showMode = "default", Object(t.nextTick)(function() {
                var Ie;
                (Ie = K.value) === null || Ie === void 0 || Ie.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (je = x.modeList) !== null && je !== void 0 && je.find(function(Ie) {
                return Ie === "handwrite";
              }) && x.handApi ? (P.showMode = "handwrite", Object(t.nextTick)(function() {
                v.emit("keyBoardChange", "handwrite");
              })) : P.showMode = "default";
              break;
            case "symbol":
              P.showMode = "default", (Ae = x.modeList) !== null && Ae !== void 0 && Ae.find(function(Ie) {
                return Ie === "symbol";
              }) && Object(t.nextTick)(function() {
                var Ie, nt;
                (Ie = K.value) === null || Ie === void 0 || Ie.click({ data: ".?123", type: "change2num" }), (nt = K.value) === null || nt === void 0 || nt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              P.showMode = "default";
              break;
          }
        }
        function fe(Se) {
          if (P.visible = !0, _e = Se.target, se(_e.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var je = document.querySelector(".key-board-modal");
            je.style.display = "block";
          }
        }
        function le() {
          if (_e && _e.blur(), _e = null, P.visible = !1, I("closed"), P.showMode = "default", P.resultVal = {}, document.querySelector(".key-board-modal")) {
            var Se = document.querySelector(".key-board-modal");
            Se.style.display = "none";
          }
        }
        function me() {
          x.closeOnClickModal && le(), I("modalClick");
        }
        function $e() {
          var Se;
          if (document.querySelector(".key-board-modal")) {
            var je;
            (je = document.querySelector(".key-board-modal")) === null || je === void 0 || je.addEventListener("click", me);
          } else {
            var Ae = document.createElement("div");
            Ae.className = "key-board-modal", Ae.style.display = "none", (Se = document.querySelector("body")) === null || Se === void 0 || Se.appendChild(Ae), Ae.addEventListener("click", me);
          }
        }
        function Me() {
          x.handApi && pe(x.handApi), [].concat(b(document.querySelectorAll("input")), b(document.querySelectorAll("textarea"))).forEach(function(Se) {
            Se.getAttribute("data-mode") !== null && (et.push(Se), Se.addEventListener("focus", fe), x.blurHide && Se.addEventListener("blur", le));
          });
        }
        function Fe(Se) {
          if (!_e) return "";
          var je = _e, Ae = je.selectionStart, Ie = je.selectionEnd;
          if (!Ae || !Ie) return "";
          var nt = Se.substring(0, Ae - 1) + Se.substring(Ie);
          return je.value = nt, je.focus(), je.selectionStart = Ae - 1, je.selectionEnd = Ae - 1, nt;
        }
        function ze(Se) {
          var je = Se.type;
          switch (je) {
            case "handwrite":
              P.showMode = "handwrite";
              break;
            case "delete":
              if (!_e) return;
              var Ae = Fe(_e.value);
              _e.value = Ae, I("change", Ae, _e.getAttribute("data-prop") || _e);
              break;
          }
        }
        function vt(Se, je) {
          if (!_e) return "";
          var Ae = _e, Ie = Ae.selectionStart || 0, nt = Ae.selectionEnd || 0, _t = Se.substring(0, Ie) + je + Se.substring(nt);
          return Ae.value = _t, Ae.focus(), Ae.selectionStart = Ie + je.length, Ae.selectionEnd = Ie + je.length, _t;
        }
        function Le(Se) {
          if (_e) {
            var je = vt(_e.value, Se);
            _e.value = je, I("change", je, _e.getAttribute("data-prop") || _e), I("keyChange", Se, _e.getAttribute("data-prop") || _e);
          }
        }
        function Ke(Se) {
          var je = new RegExp("^".concat(Se, "\\w*")), Ae = Object.keys(he).filter(function(Ie) {
            return je.test(Ie);
          }).sort();
          P.resultVal = { code: Se, value: Se ? Ae.length > 1 ? Ae.reduce(function(Ie, nt) {
            return Ie + he[nt];
          }, "") : he[Ae[0]] : "" }, _e && I("keyChange", Se, _e.getAttribute("data-prop") || _e);
        }
        function De() {
          Me();
        }
        function Xe() {
          return _e;
        }
        return Object(t.onMounted)(function() {
          x.modal && $e(), Me(), v.on("resultReset", function() {
            P.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var Se;
          (Se = document.querySelector(".key-board-modal")) === null || Se === void 0 || Se.removeEventListener("click", me), et.forEach(function(je) {
            je.removeEventListener("focus", fe), je.removeEventListener("blur", le);
          });
        }), F(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          le();
        }, changeDefaultBoard: function() {
          P.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(P)), {}, { defaultBoardRef: K, getCurrentInput: Xe, translate: Ke, reSignUp: De, trigger: ze, change: Le });
      } });
      tt.render = i;
      var Qe = tt;
      Qe.install = function(x) {
        x.component(Qe.name, Qe);
      };
      var gt = Qe, Nt = gt;
      d.default = Nt;
    }, fb6a: function(a, d, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), s = e("fc6a"), i = e("8418"), l = e("b622"), c = e("1dde"), f = c("slice"), h = l("species"), p = [].slice, m = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(g, y) {
        var b, O, C, k = s(this), w = u(k.length), v = t(g, w), j = t(y === void 0 ? w : y, w);
        if (o(k) && (b = k.constructor, typeof b != "function" || b !== Array && !o(b.prototype) ? r(b) && (b = b[h], b === null && (b = void 0)) : b = void 0, b === Array || b === void 0)) return p.call(k, v, j);
        for (O = new (b === void 0 ? Array : b)(m(j - v, 0)), C = 0; v < j; v++, C++) v in k && i(O, C, k[v]);
        return O.length = C, O;
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
})(Lt);
var xr = Lt.exports;
const At = /* @__PURE__ */ kr(xr);
Bt({
  components: { KeyBoard: At },
  setup() {
    function be(ee, te) {
      console.log("change value ---->", ee), console.log("change input dom ---->", te);
    }
    return {
      change: be
    };
  }
});
const _r = { class: "wifi-component" }, Sr = { class: "row" }, Or = { class: "column" }, jr = { class: "column" }, Er = { class: "status" }, Cr = { class: "row" }, Tr = { class: "column" }, Lr = {
  key: 0,
  class: "wifi-modal"
}, Ar = { class: "wifi-modal-content" }, Nr = { class: "wifi-list" }, Pr = {
  key: 0,
  class: "no-wifi"
}, Ir = ["onClick"], Br = { class: "wifi-ssid" }, Rr = { class: "signal-strength" }, $r = {
  __name: "WiFi",
  setup(be) {
    const { sendToPyQt: ee } = Je(), te = J("未连接"), a = J("无网络"), d = J("未知"), e = J(""), n = J(""), r = J(!1), o = J([]), t = J(null), u = () => {
      ee("check_wifi_status", {});
    }, s = () => {
      t.value = setInterval(u, 5e3);
    }, i = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    ft(() => {
      s();
      const { message: g } = Je();
      ot(g, (y) => {
        if (y && y.type === "wifi_list") {
          const b = JSON.parse(y.content);
          o.value = b;
        } else if (y && y.type === "wifi_status") {
          const b = JSON.parse(y.content);
          te.value = b.wifi_name, a.value = b.internet_status, d.value = b.zerotier_ip;
        }
      });
    }), kt(() => {
      i();
    });
    const l = async () => {
      r.value = !0, o.value = [], document.body.style.overflow = "hidden", c();
    }, c = () => {
      o.value = [], ee("search_wifi", {});
    }, f = () => {
      r.value = !1, document.body.style.overflow = "auto";
    }, h = (g) => {
      e.value = g.ssid, f();
    }, p = () => {
      ee("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, m = (g, y) => {
      y.placeholder === "WiFi 名称" ? e.value = g : y.placeholder === "WiFi 密码" && (n.value = g);
    };
    return (g, y) => (we(), ke("div", _r, [
      E("div", Sr, [
        E("div", Or, [
          st(E("input", {
            "onUpdate:modelValue": y[0] || (y[0] = (b) => e.value = b),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [pt, e.value]
          ])
        ]),
        E("div", jr, [
          E("div", Er, [
            dt(" WiFi: " + Ne(te.value) + " | 网络: " + Ne(a.value) + " ", 1),
            y[2] || (y[2] = E("br", null, null, -1)),
            dt(" zerotier ip地址: " + Ne(d.value), 1)
          ])
        ])
      ]),
      E("div", Cr, [
        E("div", Tr, [
          st(E("input", {
            "onUpdate:modelValue": y[1] || (y[1] = (b) => n.value = b),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [pt, n.value]
          ])
        ]),
        E("div", { class: "column" }, [
          E("div", { class: "button-group" }, [
            E("button", { onClick: l }, "搜索可用 WiFi"),
            E("button", { onClick: p }, "连接 WiFi")
          ])
        ])
      ]),
      He(Rt(At), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: m,
        class: "scaled-keyboard"
      }),
      r.value ? (we(), ke("div", Lr, [
        E("div", Ar, [
          y[4] || (y[4] = E("h2", null, "可用的WiFi网络", -1)),
          E("div", Nr, [
            o.value.length === 0 ? (we(), ke("div", Pr, y[3] || (y[3] = [
              E("div", { class: "loading-spinner" }, null, -1),
              E("div", null, "搜索中...", -1)
            ]))) : (we(!0), ke(it, { key: 1 }, at(o.value, (b) => (we(), ke("div", {
              key: b.ssid,
              class: "wifi-item",
              onClick: (O) => h(b)
            }, [
              E("span", Br, Ne(b.ssid), 1),
              E("span", Rr, "信号强度: " + Ne(b.signal), 1)
            ], 8, Ir))), 128))
          ]),
          E("div", { class: "modal-buttons" }, [
            E("button", { onClick: c }, "重新搜索"),
            E("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : rt("", !0)
    ]));
  }
}, Ur = /* @__PURE__ */ ct($r, [["__scopeId", "data-v-e6b1dc64"]]), Mr = {
  key: 0,
  class: "numeric-keyboard"
}, Dr = { class: "keyboard" }, Fr = { class: "current-value" }, Vr = ["onClick"], Wr = {
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
  setup(be, { emit: ee }) {
    const te = be, a = ee, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = J("");
    ot(() => te.showKeyboard, (r) => {
      r && (e.value = te.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", e.value), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (we(), ke("div", Mr, [
      E("div", Dr, [
        E("div", Fr, Ne(e.value), 1),
        (we(!0), ke(it, null, at(d.value, (t) => (we(), ke("div", {
          key: t.join(),
          class: "row"
        }, [
          (we(!0), ke(it, null, at(t, (u) => (we(), ke("button", {
            key: u,
            onClick: (s) => n(u),
            class: lt({ "function-key": u === "清除" || u === "确定" })
          }, Ne(u), 11, Vr))), 128))
        ]))), 128))
      ])
    ])) : rt("", !0);
  }
}, Ot = /* @__PURE__ */ ct(Wr, [["__scopeId", "data-v-2ccc1cb7"]]), qr = { class: "container" }, zr = { class: "column" }, Kr = { class: "status-bar" }, Qr = ["disabled"], Hr = { class: "column" }, Gr = {
  key: 0,
  class: "modal"
}, Jr = { class: "modal-content" }, Yr = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(be, { emit: ee }) {
    const { sendToPyQt: te } = Je(), a = mt({
      isPyQtWebEngine: !1
    }), d = J("未激活"), e = J(0), n = J(""), r = J(""), o = J(!1), t = J(7776e3);
    let u, s;
    const i = J(0), l = J(1), c = J(null), f = J(!1), h = J(!1), p = ht(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${l.value} 次锁定 - 剩余时间: ${m.value}`), m = ht(() => {
      const G = Math.floor(e.value / 86400), W = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), F = Math.floor(e.value % (60 * 60) / 60), L = e.value % 60;
      return `${G}天 ${W.toString().padStart(2, "0")}:${F.toString().padStart(2, "0")}:${L.toString().padStart(2, "0")}`;
    }), g = ht(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function y(G) {
      d.value === "未激活" && (G.target.setPointerCapture(G.pointerId), i.value = 0, s = setInterval(() => {
        i.value += 2, i.value >= 100 && (clearInterval(s), C());
      }, 30));
    }
    function b(G) {
      G.target.releasePointerCapture(G.pointerId), O();
    }
    function O() {
      clearInterval(s), i.value = 0;
    }
    function C() {
      te("activate_device", {});
    }
    function k(G, W) {
      te("Lock_set_response", { method: "activateDevice", args: { randomCode: G, time: W } }), d.value = "已激活", n.value = G, c.value = W, w();
    }
    function w() {
      v(), u = setInterval(() => {
        e.value > 0 ? v() : j();
      }, 1e3);
    }
    function v() {
      const G = Date.now(), W = c.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((W - G) / 1e3));
    }
    function j() {
      o.value = !0, document.body.style.overflow = "hidden", clearInterval(u), ae();
    }
    function S() {
      T(r.value);
    }
    function T(G) {
      te("check_lock_password", {
        target: "attemptUnlock",
        password: G,
        lockCount: l.value,
        deviceRandomCode: n.value
      }), r.value = "";
    }
    function _() {
      d.value = "永久激活", o.value = !1, document.body.style.overflow = "auto", clearInterval(u);
    }
    function M() {
      o.value = !1, document.body.style.overflow = "auto", l.value++, u && clearInterval(u), w();
    }
    kt(() => {
      clearInterval(u), clearInterval(s);
    }), ft(() => {
      if (a.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, a.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: G } = Je();
        ot(G, (W) => {
          if (W && W.type === "confirm_lock_password")
            try {
              const F = JSON.parse(W.content);
              F.target === "attemptUnlock" && (F.result === "success" ? (o.value ? c.value = Date.now() : c.value = c.value + t.value * 1e3, te("update_baseTime", c.value), M(), te("Lock_set_response", { method: "extendLockTime", args: { baseTime: c.value } })) : F.result === "forever_success" ? (_(), te("Lock_set_response", { method: "permanentUnlock", args: {} })) : te("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (F) {
              console.error("Failed to parse confirm lock password :", F);
            }
          else if (W && W.type === "device_activated")
            try {
              const F = JSON.parse(W.content);
              k(F.device_random_code, F.device_base_time);
            } catch (F) {
              console.error("Failed to parse device activation result:", F);
            }
          else if (W && W.type === "device_info")
            try {
              const F = JSON.parse(W.content);
              d.value = F.device_status, n.value = F.device_random_code, l.value = F.device_lock_count, c.value = F.device_base_time, F.device_status === "已激活" ? w() : F.device_status === "永久激活" && _();
            } catch (F) {
              console.error("Failed to parse device status:", F);
            }
          else if (W && W.type === "Lock_init")
            D();
          else if (W && W.type === "Lock_set") {
            console.log("Lock_set:", W.content);
            const F = JSON.parse(W.content);
            F.method === "requestActivation" ? C() : F.method === "attemptUnlock" && T(F.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const D = () => {
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
        showModalUnlockKeyboard: h.value
      };
      console.log("Sending Lock initial state:", G), te("Lock_init_response", G);
    }, Z = ee, ae = () => {
      Z("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (G, W) => (we(), ke("div", qr, [
      E("div", zr, [
        E("div", Kr, Ne(p.value), 1),
        E("button", {
          class: "activation-button",
          onPointerdown: y,
          onPointerup: b,
          onPointercancel: O,
          onPointerleave: O,
          disabled: d.value !== "未激活"
        }, [
          dt(Ne(g.value) + " ", 1),
          E("div", {
            class: "progress-bar",
            style: jt({ width: i.value + "%" })
          }, null, 4)
        ], 40, Qr)
      ]),
      E("div", Hr, [
        st(E("input", {
          "onUpdate:modelValue": W[0] || (W[0] = (F) => r.value = F),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: W[1] || (W[1] = (F) => f.value = !0)
        }, null, 544), [
          [pt, r.value]
        ]),
        E("button", {
          class: "unlock-button",
          onClick: S
        }, "解锁")
      ]),
      o.value ? (we(), ke("div", Gr, [
        E("div", Jr, [
          W[8] || (W[8] = E("h3", null, "设备已锁定", -1)),
          E("h3", null, "第 " + Ne(l.value) + " 次锁定", 1),
          E("h3", null, "设备随机码: " + Ne(n.value), 1),
          st(E("input", {
            "onUpdate:modelValue": W[2] || (W[2] = (F) => r.value = F),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: W[3] || (W[3] = (F) => h.value = !0)
          }, null, 544), [
            [pt, r.value]
          ]),
          E("button", {
            class: "unlock-button",
            onClick: S
          }, "解锁")
        ])
      ])) : rt("", !0),
      He(Ot, {
        modelValue: r.value,
        "onUpdate:modelValue": W[4] || (W[4] = (F) => r.value = F),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": W[5] || (W[5] = (F) => f.value = F)
      }, null, 8, ["modelValue", "showKeyboard"]),
      He(Ot, {
        modelValue: r.value,
        "onUpdate:modelValue": W[6] || (W[6] = (F) => r.value = F),
        showKeyboard: h.value,
        "onUpdate:showKeyboard": W[7] || (W[7] = (F) => h.value = F)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Xr = /* @__PURE__ */ ct(Yr, [["__scopeId", "data-v-3d3fd364"]]), Zr = { class: "app-container" }, to = {
  __name: "App",
  setup(be) {
    Ut();
    const ee = J(""), te = (a) => {
      ee.value = a;
    };
    return (a, d) => (we(), ke("div", Zr, [
      d[0] || (d[0] = E("h1", null, "涪特智能养护台车控制系统", -1)),
      He(Bn),
      He(br),
      He(un),
      He(ar, { message: ee.value }, null, 8, ["message"]),
      He(Ur),
      He(Xr, { onMessageFromA: te })
    ]));
  }
};
export {
  to as default
};
