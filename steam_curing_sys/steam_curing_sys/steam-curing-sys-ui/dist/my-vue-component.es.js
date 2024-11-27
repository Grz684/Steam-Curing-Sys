import It, { ref as J, onMounted as ft, provide as yt, readonly as bt, inject as wt, watch as rt, openBlock as _e, createElementBlock as Se, createElementVNode as E, toDisplayString as Pe, Fragment as ot, renderList as it, normalizeClass as ct, createCommentVNode as ut, reactive as mt, createVNode as Ge, withDirectives as lt, vModelRadio as _t, createTextVNode as dt, vModelText as vt, onUnmounted as xt, computed as ht, normalizeStyle as Ot, vModelCheckbox as Nt, defineComponent as Bt, unref as Rt } from "vue";
const jt = Symbol(), Et = Symbol(), Ct = Symbol();
function $t(be, ee) {
  be && be.messageSignal ? be.messageSignal.connect((X) => {
    try {
      const a = JSON.parse(X);
      ee.value = a, console.log("Received message from PyQt:", a);
    } catch (a) {
      console.error("Failed to parse message:", a), ee.value = { type: "unknown", content: X };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Ut() {
  const be = J(null), ee = J(null), X = J("");
  function a() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      be.value = d, ee.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), $t(ee.value, X), ee.value && typeof ee.value.vueReady == "function" ? ee.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ft(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? a() : document.addEventListener("DOMContentLoaded", a);
  }), yt(jt, bt(be)), yt(Et, bt(ee)), yt(Ct, bt(X));
}
function Je() {
  const be = wt(jt), ee = wt(Et), X = wt(Ct);
  return (!be || !ee || !X) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: be,
    bridge: ee,
    message: X,
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
const st = (be, ee) => {
  const X = be.__vccOpts || be;
  for (const [a, d] of ee)
    X[a] = d;
  return X;
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
    const X = be, a = ee, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = J("");
    rt(() => X.showKeyboard, (r) => {
      r && (e.value = X.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (_e(), Se("div", Mt, [
      E("div", Dt, [
        E("div", Ft, Pe(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (u) => (_e(), Se("button", {
            key: u,
            onClick: (s) => n(u),
            class: ct({ "function-key": u === "清除" || u === "确定" })
          }, Pe(u), 11, Vt))), 128))
        ]))), 128))
      ])
    ])) : ut("", !0);
  }
}, Tt = /* @__PURE__ */ st(Wt, [["__scopeId", "data-v-541feda2"]]), qt = { class: "settings-container" }, zt = { class: "setting-group" }, Kt = { class: "setting-item" }, Qt = { class: "setting-controls" }, Ht = ["value"], Gt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Yt = ["value"], Xt = { class: "setting-group" }, Zt = { class: "setting-item" }, en = { class: "setting-controls" }, tn = ["value"], nn = { class: "setting-item" }, rn = { class: "setting-controls" }, on = ["value"], an = {
  __name: "SensorSettings",
  setup(be) {
    const { sendToPyQt: ee } = Je(), X = mt({
      isPyQtWebEngine: !1
    }), a = J(35), d = J(25), e = J(95), n = J(90), r = J(!1), o = J(null), t = J("");
    ft(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: h } = Je();
        rt(h, (v) => {
          if (v && v.type === "update_limit_settings")
            try {
              const m = JSON.parse(v.content);
              a.value = m.temp_upper, d.value = m.temp_lower, e.value = m.humidity_upper, n.value = m.humidity_lower, console.log("Sensor Settings updated:", m);
            } catch (m) {
              console.error("Failed to parse sensor settings data:", m);
            }
          else if (v && v.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), l();
          else if (v && v.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", v.content);
            const p = JSON.parse(v.content).args;
            a.value = p.temp_upper, d.value = p.temp_lower, e.value = p.humidity_upper, n.value = p.humidity_lower, l();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (h, v) => {
      const m = h === "tempUpper" ? a : h === "tempLower" ? d : h === "humidityUpper" ? e : n;
      m.value = (m.value || 0) + v, h.startsWith("temp") ? s(h === "tempUpper" ? "upper" : "lower") : i(h === "humidityUpper" ? "upper" : "lower");
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
        console.log("设置已更新:", h), X.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ee("updateLimitSettings", h)) : console.log("在普通网页环境中执行更新设置");
      }
    }, c = (h) => {
      o.value = h, r.value = !0, t.value = h.startsWith("temp") ? h === "tempUpper" ? a.value : d.value : h === "humidityUpper" ? e.value : n.value;
    }, f = (h) => {
      const v = parseFloat(h);
      isNaN(v) || (o.value === "tempUpper" ? (a.value = v, s("upper")) : o.value === "tempLower" ? (d.value = v, s("lower")) : o.value === "humidityUpper" ? (e.value = v, i("upper")) : o.value === "humidityLower" && (n.value = v, i("lower"))), o.value = null;
    };
    return (h, v) => (_e(), Se("div", qt, [
      E("div", zt, [
        v[15] || (v[15] = E("h2", null, "温度设置 (°C)", -1)),
        E("div", Kt, [
          v[13] || (v[13] = E("span", { class: "setting-label" }, "上限：", -1)),
          E("div", Qt, [
            E("button", {
              onClick: v[0] || (v[0] = (m) => u("tempUpper", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: a.value,
              onFocus: v[1] || (v[1] = (m) => c("tempUpper")),
              readonly: ""
            }, null, 40, Ht),
            E("button", {
              onClick: v[2] || (v[2] = (m) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        E("div", Gt, [
          v[14] || (v[14] = E("span", { class: "setting-label" }, "下限：", -1)),
          E("div", Jt, [
            E("button", {
              onClick: v[3] || (v[3] = (m) => u("tempLower", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: d.value,
              onFocus: v[4] || (v[4] = (m) => c("tempLower")),
              readonly: ""
            }, null, 40, Yt),
            E("button", {
              onClick: v[5] || (v[5] = (m) => u("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      E("div", Xt, [
        v[18] || (v[18] = E("h2", null, "湿度设置 (%)", -1)),
        E("div", Zt, [
          v[16] || (v[16] = E("span", { class: "setting-label" }, "上限：", -1)),
          E("div", en, [
            E("button", {
              onClick: v[6] || (v[6] = (m) => u("humidityUpper", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: e.value,
              onFocus: v[7] || (v[7] = (m) => c("humidityUpper")),
              readonly: ""
            }, null, 40, tn),
            E("button", {
              onClick: v[8] || (v[8] = (m) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        E("div", nn, [
          v[17] || (v[17] = E("span", { class: "setting-label" }, "下限：", -1)),
          E("div", rn, [
            E("button", {
              onClick: v[9] || (v[9] = (m) => u("humidityLower", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: n.value,
              onFocus: v[10] || (v[10] = (m) => c("humidityLower")),
              readonly: ""
            }, null, 40, on),
            E("button", {
              onClick: v[11] || (v[11] = (m) => u("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Ge(Tt, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": v[12] || (v[12] = (m) => r.value = m)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, un = /* @__PURE__ */ st(an, [["__scopeId", "data-v-c66c99de"]]), sn = {
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
    const X = be, a = ee, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = J("");
    rt(() => X.showKeyboard, (r) => {
      r && (e.value = X.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", parseFloat(e.value) || 0), a("update:showKeyboard", !1)) : r === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : r === "." && e.value.includes(".") || (e.value += r);
    };
    return (r, o) => be.showKeyboard ? (_e(), Se("div", sn, [
      E("div", cn, [
        E("div", ln, Pe(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (u) => (_e(), Se("button", {
            key: u,
            onClick: (s) => n(u),
            class: ct({
              "function-key": ["清除", "确定"].includes(u),
              "operator-key": u === "-"
            })
          }, Pe(u), 11, dn))), 128))
        ]))), 128))
      ])
    ])) : ut("", !0);
  }
}, pn = /* @__PURE__ */ st(fn, [["__scopeId", "data-v-3e928534"]]), vn = { class: "sensor-data-group" }, hn = { class: "sensor-section" }, mn = { class: "sensor-container" }, gn = { class: "sensor-grid" }, yn = ["onClick"], bn = { class: "sensor-title" }, wn = { class: "sensor-value" }, xn = { class: "sensor-section" }, kn = { class: "sensor-container" }, _n = { class: "sensor-grid" }, Sn = ["onClick"], On = { class: "sensor-title" }, jn = { class: "sensor-value" }, En = {
  key: 0,
  class: "dialog-overlay"
}, Cn = { class: "dialog" }, Tn = { class: "dialog-content" }, Ln = { class: "radio-group" }, An = { class: "input-group" }, Pn = ["placeholder"], In = { class: "dialog-actions" }, Nn = {
  __name: "SensorDisplay",
  setup(be) {
    const ee = J({ temperature: {}, humidity: {} }), X = J({
      temperature: {},
      humidity: {}
    }), a = J(null), d = J(!1), e = J("offset"), n = J(""), r = J(!1), { sendToPyQt: o } = Je();
    ft(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: c } = Je();
        rt(c, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              ee.value = JSON.parse(f.content);
            } catch (h) {
              console.error("Failed to parse sensor data:", h);
            }
          else if (f && f.type === "update_adjust_settings")
            try {
              const h = JSON.parse(f.content);
              X.value.temperature = h.temperature, X.value.humidity = h.humidity;
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
      const h = X.value[c][f];
      h ? (e.value = h.type, s.value = String(h.value)) : (e.value = "offset", s.value = ""), d.value = !0, u.value = !1;
    }, l = async () => {
      try {
        const c = {
          sensorType: n.value,
          sensorId: a.value,
          adjustmentType: e.value,
          value: parseFloat(s.value) || 0
        };
        X.value[n.value] || (X.value[n.value] = {}), X.value[n.value][a.value] = {
          type: e.value,
          value: parseFloat(s.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && o("adjust_sensor", c), d.value = !1, s.value = "", u.value = !1;
      } catch (c) {
        console.error("Error applying adjustment:", c);
      }
    };
    return (c, f) => (_e(), Se("div", vn, [
      E("div", hn, [
        f[7] || (f[7] = E("h2", null, "温度传感器", -1)),
        E("div", mn, [
          E("div", gn, [
            (_e(!0), Se(ot, null, it(ee.value.temperature, (h, v) => (_e(), Se("div", {
              key: v,
              class: "sensor-card",
              onClick: (m) => r.value ? i("temperature", v) : null
            }, [
              E("div", bn, Pe(v), 1),
              E("div", wn, Pe(h), 1)
            ], 8, yn))), 128))
          ])
        ])
      ]),
      E("div", xn, [
        f[8] || (f[8] = E("h2", null, "湿度传感器", -1)),
        E("div", kn, [
          E("div", _n, [
            (_e(!0), Se(ot, null, it(ee.value.humidity, (h, v) => (_e(), Se("div", {
              key: v,
              class: "sensor-card",
              onClick: (m) => r.value ? i("humidity", v) : null
            }, [
              E("div", On, Pe(v), 1),
              E("div", jn, Pe(h), 1)
            ], 8, Sn))), 128))
          ])
        ])
      ]),
      d.value ? (_e(), Se("div", En, [
        E("div", Cn, [
          E("h3", null, "调整传感器: " + Pe(a.value), 1),
          E("div", Tn, [
            E("div", Ln, [
              E("label", null, [
                lt(E("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (h) => e.value = h),
                  value: "offset"
                }, null, 512), [
                  [_t, e.value]
                ]),
                f[9] || (f[9] = dt(" 调整偏移值 "))
              ]),
              E("label", null, [
                lt(E("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (h) => e.value = h),
                  value: "value"
                }, null, 512), [
                  [_t, e.value]
                ]),
                f[10] || (f[10] = dt(" 直接设置值 "))
              ])
            ]),
            E("div", An, [
              lt(E("input", {
                type: "text",
                "onUpdate:modelValue": f[2] || (f[2] = (h) => s.value = h),
                readonly: "",
                onClick: f[3] || (f[3] = (h) => u.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Pn), [
                [vt, s.value]
              ])
            ])
          ]),
          E("div", In, [
            E("button", {
              onClick: f[4] || (f[4] = (h) => d.value = !1)
            }, "取消"),
            E("button", {
              onClick: l,
              class: "primary"
            }, "确定")
          ])
        ]),
        Ge(pn, {
          modelValue: s.value,
          "onUpdate:modelValue": f[5] || (f[5] = (h) => s.value = h),
          showKeyboard: u.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (h) => u.value = h)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : ut("", !0)
    ]));
  }
}, Bn = /* @__PURE__ */ st(Nn, [["__scopeId", "data-v-74245031"]]), Rn = { class: "integrated-control-system" }, $n = { class: "mode-controls" }, Un = ["disabled"], Mn = ["disabled"], Dn = { class: "systems-container" }, Fn = { class: "steam-engine-control left-box" }, Vn = { class: "steam_engine" }, Wn = ["disabled"], qn = { class: "sprinkler-system middle-box" }, zn = { class: "spray-container" }, Kn = { class: "control-row" }, Qn = { class: "sprinkler-section" }, Hn = { class: "visualization" }, Gn = ["onClick"], Jn = { class: "ato_engine" }, Yn = ["disabled"], Xn = { class: "text_status" }, Zn = { class: "time-control right-box" }, er = { class: "controls" }, tr = { class: "input-group" }, nr = ["value"], rr = { class: "input-group" }, or = ["value"], ir = { class: "input-group" }, ar = ["value"], ur = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(be) {
    const ee = J(!1), X = J(!1), a = J(10), d = J(0), e = J(10), n = J(a.value), r = J(d.value), o = J(e.value), t = J(a.value), u = J(d.value), s = J(e.value), i = J(0), l = J(""), c = J(Array(12).fill(0)), f = J(0), h = J(!0), v = J(!1), m = J(!1), p = J(null), g = J(""), b = J(!1), j = J(15), C = J(""), x = J(""), _ = J(0), { sendToPyQt: y } = Je(), O = J(0), S = mt({
      isPyQtWebEngine: !1
    }), T = J([]);
    let k, D, F;
    const Y = be;
    rt(() => Y.message, (G) => {
      G != null && G.content && (h.value ? A("manual") : A("auto"));
    }), ft(() => {
      if (S.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, S.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: G } = Je();
        rt(G, (N) => {
          if (N && N.type === "update_left_steam_status")
            ee.value = N.content;
          else if (N && N.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), W();
          else if (N && N.type === "update_right_steam_status")
            X.value = N.content;
          else if (N && N.type === "update_sprinkler_settings")
            try {
              const re = JSON.parse(N.content);
              t.value = re.sprinkler_single_run_time, u.value = re.sprinkler_run_interval_time, s.value = re.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = s.value, console.log("Sprinkler Settings updated:", re);
            } catch (re) {
              console.error("Failed to parse sprinkler settings data:", re);
            }
          else if (N && N.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", N.content);
            const ke = JSON.parse(N.content).args;
            t.value = ke.sprinkler_single_run_time, u.value = ke.sprinkler_run_interval_time, s.value = ke.sprinkler_loop_interval, r.value = u.value, n.value = t.value, o.value = s.value, Ee();
          } else if (N && N.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", N.content);
            const re = JSON.parse(N.content);
            re.method === "startSystem" ? Fe() : re.method === "stopSystem" ? Qe() : re.method === "setMode" ? A(re.args.mode) : re.method === "click_toggleEngine" ? U() : re.method === "click_toggleSteamEngine" ? xe() : re.method === "toggleManualSprinkler" && ce(re.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), xt(() => {
      clearInterval(F), clearInterval(D), H();
    });
    const ae = (G) => {
      G !== void 0 && clearTimeout(G);
    }, H = () => {
      T.value.forEach((G) => {
        ae(G);
      }), T.value = [];
    }, W = () => {
      const G = {
        leftEngineOn: ee.value,
        rightEngineOn: X.value,
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
        isRunning: v.value,
        isSwitching: b.value,
        switchingTime: j.value,
        switchingMessage: C.value,
        switchPhase: x.value,
        phaseStartTime: O.value,
        chose_n: _.value
      };
      y("IntegratedControlSystem_init_response", G);
    }, V = ht(() => b.value ? `${C.value}，还需${j.value}秒` : h.value ? v.value ? l.value === "run" ? `喷头 ${i.value} 正在运行，剩余 ${f.value + 1} 秒` : l.value === "interval" ? `运行间隔中，剩余 ${f.value + 1} 秒` : l.value === "loop" ? `循环间隔中，剩余 ${f.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    async function L(G, N) {
      return x.value = N, b.value = !0, j.value = 15, O.value = Date.now(), C.value = G ? "正在切换到喷淋管" : "正在切换到喷雾机", y("controlSprinkler", { target: "switchToSprinkler", state: G }), F = setInterval(() => {
        j.value--, j.value <= 0 && (clearInterval(F), b.value = !1);
      }, 1e3), new Promise((re) => {
        k = setTimeout(() => {
          b.value = !1, re();
        }, j.value * 1e3), T.value.push(k);
      });
    }
    async function A(G) {
      const N = h.value;
      if (h.value = G === "auto", N !== h.value)
        if (S.isPyQtWebEngine && (y("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: G } }), y("controlSprinkler", { target: "setMode", mode: h.value ? "auto" : "manual" })), h.value) {
          clearInterval(F), H(), b.value = !1, ee.value && await Q(), X.value && await ne();
          const re = c.value.findIndex((ke) => ke === 100);
          re !== -1 && (c.value[re] = 0, S.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: re + 1, state: 0 })), y("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await Qe();
    }
    async function Q() {
      S.isPyQtWebEngine && (y("setEngineState", { engine: "left", state: !ee.value }), ee.value = !ee.value);
    }
    async function ne() {
      S.isPyQtWebEngine && (y("setEngineState", { engine: "right", state: !X.value }), X.value = !X.value);
    }
    async function U() {
      const G = c.value.findIndex((N) => N === 100);
      S.isPyQtWebEngine && G === -1 && (y("IntegratedControlSystem_set_response", { method: "click_toggleEngine", args: {} }), ee.value ? y("controlSprinkler", { target: "tankWork", state: 0 }) : (await L(0, "click_toggleEngine"), y("controlSprinkler", { target: "tankWork", state: 1 })), y("setEngineState", { engine: "left", state: !ee.value }), ee.value = !ee.value);
    }
    async function xe() {
      S.isPyQtWebEngine && (y("IntegratedControlSystem_set_response", { method: "click_toggleSteamEngine", args: {} }), y("setEngineState", { engine: "right", state: !X.value }), X.value = !X.value);
    }
    function ve(G) {
      p.value = G, m.value = !0, g.value = G === "singleRunTime" ? t.value.toString() : G === "runIntervalTime" ? u.value.toString() : s.value.toString();
    }
    function Ie(G) {
      const N = parseInt(G);
      isNaN(N) || (p.value === "singleRunTime" ? (t.value = N, Be()) : p.value === "runIntervalTime" ? (u.value = N, Re()) : p.value === "loopInterval" && (s.value = N, Te())), p.value = null;
    }
    function Be() {
      t.value = Math.max(1, t.value), n.value = t.value, Ee();
    }
    function Re() {
      u.value = Math.max(0, u.value), r.value = u.value, Ee();
    }
    function Te() {
      s.value = Math.max(0, s.value), o.value = s.value, Ee();
    }
    function Ee() {
      if (S.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const G = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        y("controlSprinkler", { target: "settings", settings: JSON.stringify(G) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function Fe() {
      y("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(v.value || !h.value) && (v.value = !0, c.value = Array(12).fill(0), await R());
    }
    async function Qe() {
      y("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), S.isPyQtWebEngine && (i.value > 0 && y("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), y("controlSprinkler", { target: "setState", state: !1 })), ee.value && await Q(), X.value && await ne(), B(), y("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function B() {
      v.value = !1, b.value = !1, clearInterval(F), clearInterval(D), H(), i.value = 0, l.value = "", c.value = Array(12).fill(0), f.value = 0;
    }
    async function R() {
      await L(1, "runCycle"), i.value = 1, y("controlSprinkler", { target: "tankWork", state: 1 }), te();
    }
    async function Z() {
      i.value = 1, te();
    }
    function M() {
      !v.value || !h.value || (f.value--, f.value > 0 && (k = setTimeout(M, 1e3), T.value.push(k)));
    }
    function te() {
      if (!v.value || !h.value) return;
      l.value = "run", a.value = n.value, f.value = a.value, O.value = Date.now(), M();
      let G = Date.now();
      y("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 1 }), D = setInterval(() => {
        let N = Date.now() - G, re = Math.min(N / (a.value * 1e3), 1);
        c.value[i.value - 1] = re * 100;
      }, 100), k = setTimeout(async () => {
        clearInterval(D), i.value < 12 ? (c.value[i.value - 1] = 0, y("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), ie()) : (c.value[i.value - 1] = 0, y("controlSprinkler", { target: "auto_control_sprayer", index: i.value, state: 0 }), we());
      }, a.value * 1e3), T.value.push(k);
    }
    function ie() {
      !v.value || !h.value || (d.value = r.value, f.value = d.value, O.value = Date.now(), f.value > 0 && (l.value = "interval"), M(), k = setTimeout(() => {
        i.value++, te();
      }, d.value * 1e3), T.value.push(k));
    }
    async function we() {
      !v.value || !h.value || (e.value = o.value, f.value = e.value, f.value > 0 ? (y("controlSprinkler", { target: "tankWork", state: 0 }), await L(0, "runLoopInterval"), y("controlSprinkler", { target: "setState", state: !0 }), O.value = Date.now(), l.value = "loop", M(), i.value = 0, k = setTimeout(async () => {
        c.value = Array(12).fill(0), y("controlSprinkler", { target: "setState", state: !1 }), ee.value && await Q(), y("controlSprinkler", { target: "tankWork", state: 0 }), await R();
      }, e.value * 1e3), T.value.push(k)) : (i.value = 0, c.value = Array(12).fill(0), await Z()));
    }
    function ge(G) {
      return c.value[G - 1];
    }
    async function ce(G) {
      if (h.value) return;
      y("IntegratedControlSystem_set_response", { method: "toggleManualSprinkler", args: { n: G } });
      const N = c.value.findIndex((re) => re === 100);
      c.value[G - 1] > 0 ? (c.value[G - 1] = 0, S.isPyQtWebEngine && (y("controlSprinkler", { target: "manual_control_sprayer", index: G, state: 0 }), y("controlSprinkler", { target: "tankWork", state: 0 }))) : N !== -1 ? (c.value[N] = 0, S.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: N + 1, state: 0 }), c.value[G - 1] = 100, S.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: G, state: 1 })) : (_.value = G, await L(1, "toggleManualSprinkler"), y("controlSprinkler", { target: "tankWork", state: 1 }), c.value[G - 1] = 100, S.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: G, state: 1 }));
    }
    return (G, N) => (_e(), Se("div", Rn, [
      N[16] || (N[16] = E("h2", null, "集成控制系统", -1)),
      N[17] || (N[17] = E("div", { class: "label-box" }, [
        E("label", null, "支持自动/手动两种模式，自动模式下蒸汽机启停受温度上下限控制，"),
        E("br"),
        E("label", null, "喷淋/喷雾系统沿喷淋->喷雾->喷淋循环运行，喷淋/喷雾时间由设置决定，其中在喷雾时间内雾化机启停受湿度上下限控制；"),
        E("br"),
        E("label", null, "手动模式下可手动控制蒸汽机/喷淋头/雾化机的启停，注意喷淋头和雾化机同时只能工作一个")
      ], -1)),
      E("div", $n, [
        E("button", {
          onClick: N[0] || (N[0] = (re) => A("auto")),
          class: ct([{ active: h.value }, "mode-btn"])
        }, "自动模式", 2),
        E("button", {
          onClick: N[1] || (N[1] = (re) => A("manual")),
          class: ct([{ active: !h.value }, "mode-btn"])
        }, "手动模式", 2),
        E("button", {
          onClick: Fe,
          disabled: v.value || !h.value,
          class: "control-btn"
        }, "开始", 8, Un),
        E("button", {
          onClick: Qe,
          disabled: !v.value || !h.value,
          class: "control-btn"
        }, "停止", 8, Mn)
      ]),
      E("div", Dn, [
        E("div", Fn, [
          N[7] || (N[7] = E("h3", null, "蒸汽机", -1)),
          E("div", Vn, [
            E("div", {
              class: ct(["status", { on: X.value }])
            }, [
              N[6] || (N[6] = E("div", { class: "status-indicator" }, null, -1)),
              dt(" " + Pe(X.value ? "开" : "关"), 1)
            ], 2),
            E("button", {
              onClick: xe,
              disabled: h.value,
              class: "control-btn"
            }, Pe(X.value ? "关闭" : "开启"), 9, Wn)
          ])
        ]),
        E("div", qn, [
          N[11] || (N[11] = E("h3", null, "喷淋/喷雾系统", -1)),
          E("div", zn, [
            E("div", Kn, [
              E("div", Qn, [
                N[8] || (N[8] = E("h4", null, "喷淋头", -1)),
                E("div", Hn, [
                  (_e(), Se(ot, null, it(12, (re) => E("div", {
                    key: re,
                    class: ct(["sprinkler", { active: h.value ? i.value === re : c.value[re - 1] > 0 }]),
                    onClick: (ke) => !b.value && !h.value && !ee.value && ce(re)
                  }, [
                    E("div", {
                      class: "water",
                      style: Ot({ height: ge(re) + "%" })
                    }, null, 4),
                    E("span", null, Pe(re), 1)
                  ], 10, Gn)), 64))
                ])
              ]),
              E("div", Jn, [
                N[10] || (N[10] = E("h4", null, "雾化机", -1)),
                E("div", {
                  class: ct(["status", { on: ee.value }])
                }, [
                  N[9] || (N[9] = E("div", { class: "status-indicator" }, null, -1)),
                  dt(" " + Pe(ee.value ? "开" : "关"), 1)
                ], 2),
                E("button", {
                  onClick: U,
                  disabled: h.value || b.value,
                  class: "control-btn"
                }, Pe(ee.value ? "关闭" : "开启"), 9, Yn)
              ])
            ])
          ]),
          E("div", Xn, Pe(V.value), 1)
        ]),
        E("div", Zn, [
          N[15] || (N[15] = E("h3", null, "喷淋/喷雾系统时间设置", -1)),
          E("div", er, [
            E("div", tr, [
              N[12] || (N[12] = E("label", null, "单个喷淋头工作时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: t.value,
                onFocus: N[2] || (N[2] = (re) => ve("singleRunTime")),
                readonly: ""
              }, null, 40, nr)
            ]),
            E("div", rr, [
              N[13] || (N[13] = E("label", null, "喷淋头-喷淋头运行间隔时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: u.value,
                disabled: "",
                onFocus: N[3] || (N[3] = (re) => ve("runIntervalTime")),
                readonly: ""
              }, null, 40, or)
            ]),
            E("div", ir, [
              N[14] || (N[14] = E("label", null, "喷雾时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: s.value,
                onFocus: N[4] || (N[4] = (re) => ve("loopInterval")),
                readonly: ""
              }, null, 40, ar)
            ])
          ])
        ])
      ]),
      Ge(Tt, {
        modelValue: g.value,
        showKeyboard: m.value,
        "onUpdate:modelValue": Ie,
        "onUpdate:showKeyboard": N[5] || (N[5] = (re) => m.value = re)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, sr = /* @__PURE__ */ st(ur, [["__scopeId", "data-v-4e18b647"]]), cr = { class: "data-actions" }, lr = {
  key: 0,
  class: "modal-overlay"
}, dr = { class: "modal-content settings-modal" }, fr = { class: "setting-group" }, pr = { class: "setting-item" }, vr = { class: "toggle-switch" }, hr = {
  key: 1,
  class: "modal-overlay"
}, mr = {
  key: 2,
  class: "modal-overlay"
}, gr = { class: "modal-content" }, yr = {
  __name: "DataExport",
  setup(be) {
    const { sendToPyQt: ee } = Je(), X = mt({
      isPyQtWebEngine: !1
    }), a = J(!1), d = J(!1), e = J(""), n = J(!1), r = J(!1), o = J(!1), t = () => {
      o.value = r.value, n.value = !0, document.body.style.overflow = "hidden";
    }, u = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto";
    }, s = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto", X.isPyQtWebEngine && ee("saveDebugSettings", { debug_mode: r.value });
    };
    ft(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: m } = Je();
        rt(m, (p) => {
          if (p && p.type === "update_debug_mode")
            try {
              const g = JSON.parse(p.content);
              r.value = g.debug_mode, o.value = g.debug_mode;
            } catch (g) {
              console.error("Failed to parse debug settings:", g);
            }
          else if (p && p.type === "DataExport_init") {
            const g = {
              debugMode: r.value
            };
            console.log("Sending initial DataExport state:", g), ee("DataExport_init_response", g);
          } else p && p.type === "clearData" && (ee("exportData", !1), ee("clearData_response", ""));
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const i = () => {
      X.isPyQtWebEngine && (console.log("导出数据"), ee("exportData", !0));
    }, l = () => {
      a.value = !0, document.body.style.overflow = "hidden";
    }, c = () => {
      a.value = !1, document.body.style.overflow = "auto";
    }, f = () => {
      console.log("清空数据"), a.value = !1, h("所有数据已清空！"), document.body.style.overflow = "auto", X.isPyQtWebEngine && ee("exportData", !1);
    }, h = (m) => {
      e.value = m, d.value = !0;
    }, v = () => {
      d.value = !1;
    };
    return (m, p) => (_e(), Se("div", cr, [
      E("div", { class: "action-buttons" }, [
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: i,
            class: "export-btn"
          }, "导出数据")
        ]),
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: l,
            class: "clear-btn"
          }, "清空数据")
        ]),
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: t,
            class: "settings-btn"
          }, "传感器设置")
        ])
      ]),
      n.value ? (_e(), Se("div", lr, [
        E("div", dr, [
          E("div", fr, [
            p[3] || (p[3] = E("h2", null, "传感器调试模式", -1)),
            E("div", pr, [
              p[2] || (p[2] = E("span", { class: "setting-label" }, "调试模式：", -1)),
              E("div", vr, [
                lt(E("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": p[0] || (p[0] = (g) => o.value = g)
                }, null, 512), [
                  [Nt, o.value]
                ]),
                p[1] || (p[1] = E("label", { for: "debug-toggle" }, null, -1))
              ])
            ]),
            E("div", { class: "modal-buttons" }, [
              E("button", {
                onClick: s,
                class: "confirm-btn"
              }, "保存"),
              E("button", {
                onClick: u,
                class: "cancel-btn"
              }, "取消")
            ])
          ])
        ])
      ])) : ut("", !0),
      a.value ? (_e(), Se("div", hr, [
        E("div", { class: "modal-content" }, [
          p[4] || (p[4] = E("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          E("div", { class: "modal-buttons" }, [
            E("button", {
              onClick: f,
              class: "confirm-btn"
            }, "确定"),
            E("button", {
              onClick: c,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ut("", !0),
      d.value ? (_e(), Se("div", mr, [
        E("div", gr, [
          E("h2", null, Pe(e.value), 1),
          E("div", { class: "modal-buttons" }, [
            E("button", {
              onClick: v,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ut("", !0)
    ]));
  }
}, br = /* @__PURE__ */ st(yr, [["__scopeId", "data-v-2cbcc479"]]);
var wr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function xr(be) {
  return be && be.__esModule && Object.prototype.hasOwnProperty.call(be, "default") ? be.default : be;
}
var Lt = { exports: {} };
(function(be, ee) {
  (function(X, a) {
    be.exports = a(It);
  })(typeof self < "u" ? self : wr, function(X) {
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
        var v = l + s.length, m = c.length, p = u;
        return f !== void 0 && (f = n(f), p = t), o.call(h, p, function(g, b) {
          var j;
          switch (b.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return s;
            case "`":
              return i.slice(0, l);
            case "'":
              return i.slice(v);
            case "<":
              j = f[b.slice(1, -1)];
              break;
            default:
              var C = +b;
              if (C === 0) return g;
              if (C > m) {
                var x = r(C / 10);
                return x === 0 ? g : x <= m ? c[x - 1] === void 0 ? b.charAt(1) : c[x - 1] + b.charAt(1) : g;
              }
              j = c[C - 1];
          }
          return j === void 0 ? "" : j;
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
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), s = e("8aa5"), i = e("50c4"), l = e("14c3"), c = e("9263"), f = e("d039"), h = [].push, v = Math.min, m = 4294967295, p = !f(function() {
        return !RegExp(m, "y");
      });
      n("split", 2, function(g, b, j) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(x, _) {
          var y = String(t(this)), O = _ === void 0 ? m : _ >>> 0;
          if (O === 0) return [];
          if (x === void 0) return [y];
          if (!r(x)) return b.call(y, x, O);
          for (var S, T, k, D = [], F = (x.ignoreCase ? "i" : "") + (x.multiline ? "m" : "") + (x.unicode ? "u" : "") + (x.sticky ? "y" : ""), Y = 0, ae = new RegExp(x.source, F + "g"); (S = c.call(ae, y)) && (T = ae.lastIndex, !(T > Y && (D.push(y.slice(Y, S.index)), S.length > 1 && S.index < y.length && h.apply(D, S.slice(1)), k = S[0].length, Y = T, D.length >= O))); )
            ae.lastIndex === S.index && ae.lastIndex++;
          return Y === y.length ? !k && ae.test("") || D.push("") : D.push(y.slice(Y)), D.length > O ? D.slice(0, O) : D;
        } : "0".split(void 0, 0).length ? function(x, _) {
          return x === void 0 && _ === 0 ? [] : b.call(this, x, _);
        } : b, [function(x, _) {
          var y = t(this), O = x == null ? void 0 : x[g];
          return O !== void 0 ? O.call(x, y, _) : C.call(String(y), x, _);
        }, function(x, _) {
          var y = j(C, x, this, _, C !== b);
          if (y.done) return y.value;
          var O = o(x), S = String(this), T = u(O, RegExp), k = O.unicode, D = (O.ignoreCase ? "i" : "") + (O.multiline ? "m" : "") + (O.unicode ? "u" : "") + (p ? "y" : "g"), F = new T(p ? O : "^(?:" + O.source + ")", D), Y = _ === void 0 ? m : _ >>> 0;
          if (Y === 0) return [];
          if (S.length === 0) return l(F, S) === null ? [S] : [];
          for (var ae = 0, H = 0, W = []; H < S.length; ) {
            F.lastIndex = p ? H : 0;
            var V, L = l(F, p ? S : S.slice(H));
            if (L === null || (V = v(i(F.lastIndex + (p ? 0 : H)), S.length)) === ae) H = s(S, H, k);
            else {
              if (W.push(S.slice(ae, H)), W.length === Y) return W;
              for (var A = 1; A <= L.length - 1; A++) if (W.push(L[A]), W.length === Y) return W;
              H = ae = V;
            }
          }
          return W.push(S.slice(ae)), W;
        }];
      }, !p);
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
            (function(Z, M) {
              B.exports = M();
            })(0, function() {
              function Z(ce) {
                var G = ce && typeof ce == "object";
                return G && Object.prototype.toString.call(ce) !== "[object RegExp]" && Object.prototype.toString.call(ce) !== "[object Date]";
              }
              function M(ce) {
                return Array.isArray(ce) ? [] : {};
              }
              function te(ce, G) {
                var N = G && G.clone === !0;
                return N && Z(ce) ? ge(M(ce), ce, G) : ce;
              }
              function ie(ce, G, N) {
                var re = ce.slice();
                return G.forEach(function(ke, We) {
                  typeof re[We] > "u" ? re[We] = te(ke, N) : Z(ke) ? re[We] = ge(ce[We], ke, N) : ce.indexOf(ke) === -1 && re.push(te(ke, N));
                }), re;
              }
              function we(ce, G, N) {
                var re = {};
                return Z(ce) && Object.keys(ce).forEach(function(ke) {
                  re[ke] = te(ce[ke], N);
                }), Object.keys(G).forEach(function(ke) {
                  Z(G[ke]) && ce[ke] ? re[ke] = ge(ce[ke], G[ke], N) : re[ke] = te(G[ke], N);
                }), re;
              }
              function ge(ce, G, N) {
                var re = Array.isArray(G), ke = N || { arrayMerge: ie }, We = ke.arrayMerge || ie;
                return re ? Array.isArray(ce) ? We(ce, G, N) : te(G, N) : we(ce, G, N);
              }
              return ge.all = function(ce, G) {
                if (!Array.isArray(ce) || ce.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ce.reduce(function(N, re) {
                  return ge(N, re, G);
                });
              }, ge;
            });
          });
          function t(B) {
            return B = B || /* @__PURE__ */ Object.create(null), { on: function(R, Z) {
              (B[R] || (B[R] = [])).push(Z);
            }, off: function(R, Z) {
              B[R] && B[R].splice(B[R].indexOf(Z) >>> 0, 1);
            }, emit: function(R, Z) {
              (B[R] || []).map(function(M) {
                M(Z);
              }), (B["*"] || []).map(function(M) {
                M(R, Z);
              });
            } };
          }
          var u = r(function(B, R) {
            var Z = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            R.default = Z, B.exports = R.default;
          }), s = function(B) {
            return Object.keys(B).map(function(R) {
              var Z = B[R].toString().replace(/"/g, "&quot;");
              return R + '="' + Z + '"';
            }).join(" ");
          }, i = u.svg, l = u.xlink, c = {};
          c[i.name] = i.uri, c[l.name] = l.uri;
          var f, h = function(B, R) {
            B === void 0 && (B = "");
            var Z = o(c, R || {}), M = s(Z);
            return "<svg " + M + ">" + B + "</svg>";
          }, v = u.svg, m = u.xlink, p = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[v.name] = v.uri, f[m.name] = m.uri, f) }, g = function(B) {
            this.config = o(p, B || {}), this.symbols = [];
          };
          g.prototype.add = function(B) {
            var R = this, Z = R.symbols, M = this.find(B.id);
            return M ? (Z[Z.indexOf(M)] = B, !1) : (Z.push(B), !0);
          }, g.prototype.remove = function(B) {
            var R = this, Z = R.symbols, M = this.find(B);
            return !!M && (Z.splice(Z.indexOf(M), 1), M.destroy(), !0);
          }, g.prototype.find = function(B) {
            return this.symbols.filter(function(R) {
              return R.id === B;
            })[0] || null;
          }, g.prototype.has = function(B) {
            return this.find(B) !== null;
          }, g.prototype.stringify = function() {
            var B = this.config, R = B.attrs, Z = this.symbols.map(function(M) {
              return M.stringify();
            }).join("");
            return h(Z, R);
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            this.symbols.forEach(function(B) {
              return B.destroy();
            });
          };
          var b = function(B) {
            var R = B.id, Z = B.viewBox, M = B.content;
            this.id = R, this.viewBox = Z, this.content = M;
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
          var j = function(B) {
            var R = !!document.importNode, Z = new DOMParser().parseFromString(B, "image/svg+xml").documentElement;
            return R ? document.importNode(Z, !0) : Z;
          }, C = function(B) {
            function R() {
              B.apply(this, arguments);
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var Z = { isMounted: {} };
            return Z.isMounted.get = function() {
              return !!this.node;
            }, R.createFromExistingNode = function(M) {
              return new R({ id: M.getAttribute("id"), viewBox: M.getAttribute("viewBox"), content: M.outerHTML });
            }, R.prototype.destroy = function() {
              this.isMounted && this.unmount(), B.prototype.destroy.call(this);
            }, R.prototype.mount = function(M) {
              if (this.isMounted) return this.node;
              var te = typeof M == "string" ? document.querySelector(M) : M, ie = this.render();
              return this.node = ie, te.appendChild(ie), ie;
            }, R.prototype.render = function() {
              var M = this.stringify();
              return j(h(M)).childNodes[0];
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(R.prototype, Z), R;
          }(b), x = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, _ = function(B) {
            return Array.prototype.slice.call(B, 0);
          }, y = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, O = function(B, R) {
            var Z = document.createEvent("CustomEvent");
            Z.initCustomEvent(B, !1, !1, R), window.dispatchEvent(Z);
          }, S = function(B) {
            var R = [];
            return _(B.querySelectorAll("style")).forEach(function(Z) {
              Z.textContent += "", R.push(Z);
            }), R;
          }, T = function(B) {
            return (B || window.location.href).split("#")[0];
          }, k = function(B) {
            angular.module("ng").run(["$rootScope", function(R) {
              R.$on("$locationChangeSuccess", function(Z, M, te) {
                O(B, { oldUrl: te, newUrl: M });
              });
            }]);
          }, D = "linearGradient, radialGradient, pattern, mask, clipPath", F = function(B, R) {
            return R === void 0 && (R = D), _(B.querySelectorAll("symbol")).forEach(function(Z) {
              _(Z.querySelectorAll(R)).forEach(function(M) {
                Z.parentNode.insertBefore(M, Z);
              });
            }), B;
          };
          function Y(B, R) {
            var Z = _(B).reduce(function(M, te) {
              if (!te.attributes) return M;
              var ie = _(te.attributes), we = R ? ie.filter(R) : ie;
              return M.concat(we);
            }, []);
            return Z;
          }
          var ae = u.xlink.uri, H = "xlink:href", W = /[{}|\\\^\[\]`"<>]/g;
          function V(B) {
            return B.replace(W, function(R) {
              return "%" + R[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L(B) {
            return B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function A(B, R, Z) {
            return _(B).forEach(function(M) {
              var te = M.getAttribute(H);
              if (te && te.indexOf(R) === 0) {
                var ie = te.replace(R, Z);
                M.setAttributeNS(ae, H, ie);
              }
            }), B;
          }
          var Q, ne = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], U = ne.map(function(B) {
            return "[" + B + "]";
          }).join(","), xe = function(B, R, Z, M) {
            var te = V(Z), ie = V(M), we = B.querySelectorAll(U), ge = Y(we, function(ce) {
              var G = ce.localName, N = ce.value;
              return ne.indexOf(G) !== -1 && N.indexOf("url(" + te) !== -1;
            });
            ge.forEach(function(ce) {
              return ce.value = ce.value.replace(new RegExp(L(te), "g"), ie);
            }), A(R, te, ie);
          }, ve = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ie = function(B) {
            function R(M) {
              var te = this;
              M === void 0 && (M = {}), B.call(this, o(x, M));
              var ie = t();
              this._emitter = ie, this.node = null;
              var we = this, ge = we.config;
              if (ge.autoConfigure && this._autoConfigure(M), ge.syncUrlsWithBaseTag) {
                var ce = document.getElementsByTagName("base")[0].getAttribute("href");
                ie.on(ve.MOUNT, function() {
                  return te.updateUrls("#", ce);
                });
              }
              var G = this._handleLocationChange.bind(this);
              this._handleLocationChange = G, ge.listenLocationChangeEvent && window.addEventListener(ge.locationChangeEvent, G), ge.locationChangeAngularEmitter && k(ge.locationChangeEvent), ie.on(ve.MOUNT, function(N) {
                ge.moveGradientsOutsideSymbol && F(N);
              }), ie.on(ve.SYMBOL_MOUNT, function(N) {
                ge.moveGradientsOutsideSymbol && F(N.parentNode), (y.isIE() || y.isEdge()) && S(N);
              });
            }
            B && (R.__proto__ = B), R.prototype = Object.create(B && B.prototype), R.prototype.constructor = R;
            var Z = { isMounted: {} };
            return Z.isMounted.get = function() {
              return !!this.node;
            }, R.prototype._autoConfigure = function(M) {
              var te = this, ie = te.config;
              typeof M.syncUrlsWithBaseTag > "u" && (ie.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof M.locationChangeAngularEmitter > "u" && (ie.locationChangeAngularEmitter = typeof window.angular < "u"), typeof M.moveGradientsOutsideSymbol > "u" && (ie.moveGradientsOutsideSymbol = y.isFirefox());
            }, R.prototype._handleLocationChange = function(M) {
              var te = M.detail, ie = te.oldUrl, we = te.newUrl;
              this.updateUrls(ie, we);
            }, R.prototype.add = function(M) {
              var te = this, ie = B.prototype.add.call(this, M);
              return this.isMounted && ie && (M.mount(te.node), this._emitter.emit(ve.SYMBOL_MOUNT, M.node)), ie;
            }, R.prototype.attach = function(M) {
              var te = this, ie = this;
              if (ie.isMounted) return ie.node;
              var we = typeof M == "string" ? document.querySelector(M) : M;
              return ie.node = we, this.symbols.forEach(function(ge) {
                ge.mount(ie.node), te._emitter.emit(ve.SYMBOL_MOUNT, ge.node);
              }), _(we.querySelectorAll("symbol")).forEach(function(ge) {
                var ce = C.createFromExistingNode(ge);
                ce.node = ge, ie.add(ce);
              }), this._emitter.emit(ve.MOUNT, we), we;
            }, R.prototype.destroy = function() {
              var M = this, te = M.config, ie = M.symbols, we = M._emitter;
              ie.forEach(function(ge) {
                return ge.destroy();
              }), we.off("*"), window.removeEventListener(te.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, R.prototype.mount = function(M, te) {
              M === void 0 && (M = this.config.mountTo), te === void 0 && (te = !1);
              var ie = this;
              if (ie.isMounted) return ie.node;
              var we = typeof M == "string" ? document.querySelector(M) : M, ge = ie.render();
              return this.node = ge, te && we.childNodes[0] ? we.insertBefore(ge, we.childNodes[0]) : we.appendChild(ge), this._emitter.emit(ve.MOUNT, ge), ge;
            }, R.prototype.render = function() {
              return j(this.stringify());
            }, R.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, R.prototype.updateUrls = function(M, te) {
              if (!this.isMounted) return !1;
              var ie = document.querySelectorAll(this.config.usagesToUpdate);
              return xe(this.node, ie, T(M) + "#", T(te) + "#"), !0;
            }, Object.defineProperties(R.prototype, Z), R;
          }(g), Be = r(function(B) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(R, Z) {
              B.exports = Z();
            })(0, function() {
              var R, Z = [], M = document, te = M.documentElement.doScroll, ie = "DOMContentLoaded", we = (te ? /^loaded|^c/ : /^loaded|^i|^c/).test(M.readyState);
              return we || M.addEventListener(ie, R = function() {
                for (M.removeEventListener(ie, R), we = 1; R = Z.shift(); ) R();
              }), function(ge) {
                we ? setTimeout(ge, 0) : Z.push(ge);
              };
            });
          }), Re = "__SVG_SPRITE_NODE__", Te = "__SVG_SPRITE__", Ee = !!window[Te];
          Ee ? Q = window[Te] : (Q = new Ie({ attrs: { id: Re, "aria-hidden": "true" } }), window[Te] = Q);
          var Fe = function() {
            var B = document.getElementById(Re);
            B ? Q.attach(B) : Q.mount(document.body, !0);
          };
          document.body ? Fe() : Be(Fe);
          var Qe = Q;
          return Qe;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(a, d, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), s = e("2a62"), i = function(l, c) {
        this.stopped = l, this.result = c;
      };
      a.exports = function(l, c, f) {
        var h, v, m, p, g, b, j, C = f && f.that, x = !(!f || !f.AS_ENTRIES), _ = !(!f || !f.IS_ITERATOR), y = !(!f || !f.INTERRUPTED), O = t(c, C, 1 + x + y), S = function(k) {
          return h && s(h), new i(!0, k);
        }, T = function(k) {
          return x ? (n(k), y ? O(k[0], k[1], S) : O(k[0], k[1])) : y ? O(k, S) : O(k);
        };
        if (_) h = l;
        else {
          if (v = u(l), typeof v != "function") throw TypeError("Target is not iterable");
          if (r(v)) {
            for (m = 0, p = o(l.length); p > m; m++) if (g = T(l[m]), g && g instanceof i) return g;
            return new i(!1);
          }
          h = v.call(l);
        }
        for (b = h.next; !(j = b.call(h)).done; ) {
          try {
            g = T(j.value);
          } catch (k) {
            throw s(h), k;
          }
          if (typeof g == "object" && g && g instanceof i) return g;
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
        var f, h, v, m, p, g, b = l.target, j = l.global, C = l.stat;
        if (h = j ? n : C ? n[b] || u(b, {}) : (n[b] || {}).prototype, h) for (v in c) {
          if (p = c[v], l.noTargetGet ? (g = r(h, v), m = g && g.value) : m = h[v], f = i(j ? v : b + (C ? "." : "#") + v, l.forced), !f && m !== void 0) {
            if (typeof p == typeof m) continue;
            s(p, m);
          }
          (l.sham || m && m.sham) && o(p, "sham", !0), t(h, v, p, l);
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
        var f = r(this), h = String(f.source), v = f.flags, m = String(v === void 0 && f instanceof RegExp && !("flags" in s) ? t.call(f) : v);
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
      var n, r, o, t = e("da84"), u = e("d039"), s = e("0366"), i = e("1be4"), l = e("cc12"), c = e("1cdc"), f = e("605d"), h = t.location, v = t.setImmediate, m = t.clearImmediate, p = t.process, g = t.MessageChannel, b = t.Dispatch, j = 0, C = {}, x = "onreadystatechange", _ = function(T) {
        if (C.hasOwnProperty(T)) {
          var k = C[T];
          delete C[T], k();
        }
      }, y = function(T) {
        return function() {
          _(T);
        };
      }, O = function(T) {
        _(T.data);
      }, S = function(T) {
        t.postMessage(T + "", h.protocol + "//" + h.host);
      };
      v && m || (v = function(T) {
        for (var k = [], D = 1; arguments.length > D; ) k.push(arguments[D++]);
        return C[++j] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, k);
        }, n(j), j;
      }, m = function(T) {
        delete C[T];
      }, f ? n = function(T) {
        p.nextTick(y(T));
      } : b && b.now ? n = function(T) {
        b.now(y(T));
      } : g && !c ? (r = new g(), o = r.port2, r.port1.onmessage = O, n = s(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && h && h.protocol !== "file:" && !u(S) ? (n = S, t.addEventListener("message", O, !1)) : n = x in l("script") ? function(T) {
        i.appendChild(l("script"))[x] = function() {
          i.removeChild(this), _(T);
        };
      } : function(T) {
        setTimeout(y(T), 0);
      }), a.exports = { set: v, clear: m };
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
          var h = t(this), v = f == null ? void 0 : f[i];
          return v !== void 0 ? v.call(f, h) : new RegExp(f)[i](String(h));
        }, function(f) {
          var h = c(l, f, this);
          if (h.done) return h.value;
          var v = r(f), m = String(this);
          if (!v.global) return s(v, m);
          var p = v.unicode;
          v.lastIndex = 0;
          for (var g, b = [], j = 0; (g = s(v, m)) !== null; ) {
            var C = String(g[0]);
            b[j] = C, C === "" && (v.lastIndex = u(m, o(v.lastIndex), p)), j++;
          }
          return j === 0 ? null : b;
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
        function c(m, p) {
          return n.isPlainObject(m) && n.isPlainObject(p) ? n.merge(m, p) : n.isPlainObject(p) ? n.merge({}, p) : n.isArray(p) ? p.slice() : p;
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
        var h = u.concat(s).concat(i).concat(l), v = Object.keys(r).concat(Object.keys(o)).filter(function(m) {
          return h.indexOf(m) === -1;
        });
        return n.forEach(v, f), t;
      };
    }, "4d63": function(a, d, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, s = e("241c").f, i = e("44e7"), l = e("ad6d"), c = e("9f7f"), f = e("6eeb"), h = e("d039"), v = e("69f3").set, m = e("2626"), p = e("b622"), g = p("match"), b = r.RegExp, j = b.prototype, C = /a/g, x = /a/g, _ = new b(C) !== C, y = c.UNSUPPORTED_Y, O = n && o("RegExp", !_ || y || h(function() {
        return x[g] = !1, b(C) != C || b(x) == x || b(C, "i") != "/a/i";
      }));
      if (O) {
        for (var S = function(F, Y) {
          var ae, H = this instanceof S, W = i(F), V = Y === void 0;
          if (!H && W && F.constructor === S && V) return F;
          _ ? W && !V && (F = F.source) : F instanceof S && (V && (Y = l.call(F)), F = F.source), y && (ae = !!Y && Y.indexOf("y") > -1, ae && (Y = Y.replace(/y/g, "")));
          var L = t(_ ? new b(F, Y) : b(F, Y), H ? this : j, S);
          return y && ae && v(L, { sticky: ae }), L;
        }, T = function(F) {
          F in S || u(S, F, { configurable: !0, get: function() {
            return b[F];
          }, set: function(Y) {
            b[F] = Y;
          } });
        }, k = s(b), D = 0; k.length > D; ) T(k[D++]);
        j.constructor = S, S.prototype = j, f(r, "RegExp", S);
      }
      m("RegExp");
    }, "4d64": function(a, d, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(s, i, l) {
          var c, f = n(s), h = r(f.length), v = o(l, h);
          if (u && i != i) {
            for (; h > v; ) if (c = f[v++], c != c) return !0;
          } else for (; h > v; v++) if ((u || v in f) && f[v] === i) return u || v || 0;
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
        var c, f, h, v, m, p, g = r(l), b = typeof this == "function" ? this : Array, j = arguments.length, C = j > 1 ? arguments[1] : void 0, x = C !== void 0, _ = i(g), y = 0;
        if (x && (C = n(C, j > 2 ? arguments[2] : void 0, 2)), _ == null || b == Array && t(_)) for (c = u(g.length), f = new b(c); c > y; y++) p = x ? C(g[y], y) : g[y], s(f, y, p);
        else for (v = _.call(g), m = v.next, f = new b(); !(h = m.call(v)).done; y++) p = x ? o(v, C, [h.value, y], !0) : h.value, s(f, y, p);
        return f.length = y, f;
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
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), s = e("8aa5"), i = e("0cb2"), l = e("14c3"), c = Math.max, f = Math.min, h = function(v) {
        return v === void 0 ? v : String(v);
      };
      n("replace", 2, function(v, m, p, g) {
        var b = g.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, j = g.REPLACE_KEEPS_$0, C = b ? "$" : "$0";
        return [function(x, _) {
          var y = u(this), O = x == null ? void 0 : x[v];
          return O !== void 0 ? O.call(x, y, _) : m.call(String(y), x, _);
        }, function(x, _) {
          if (!b && j || typeof _ == "string" && _.indexOf(C) === -1) {
            var y = p(m, x, this, _);
            if (y.done) return y.value;
          }
          var O = r(x), S = String(this), T = typeof _ == "function";
          T || (_ = String(_));
          var k = O.global;
          if (k) {
            var D = O.unicode;
            O.lastIndex = 0;
          }
          for (var F = []; ; ) {
            var Y = l(O, S);
            if (Y === null || (F.push(Y), !k)) break;
            var ae = String(Y[0]);
            ae === "" && (O.lastIndex = s(S, o(O.lastIndex), D));
          }
          for (var H = "", W = 0, V = 0; V < F.length; V++) {
            Y = F[V];
            for (var L = String(Y[0]), A = c(f(t(Y.index), S.length), 0), Q = [], ne = 1; ne < Y.length; ne++) Q.push(h(Y[ne]));
            var U = Y.groups;
            if (T) {
              var xe = [L].concat(Q, A, S);
              U !== void 0 && xe.push(U);
              var ve = String(_.apply(void 0, xe));
            } else ve = i(L, S, A, Q, U, _);
            A >= W && (H += S.slice(W, A) + ve, W = A + L.length);
          }
          return H + S.slice(W);
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
            var v = h.match(/initial\-dpr=([\d\.]+)/), m = h.match(/maximum\-dpr=([\d\.]+)/);
            v && (i = parseFloat(v[1]), l = parseFloat((1 / i).toFixed(2))), m && (i = parseFloat(m[1]), l = parseFloat((1 / i).toFixed(2)));
          }
        }
        if (!i && !l) {
          n.navigator.appVersion.match(/android/gi);
          var p = n.navigator.appVersion.match(/iphone/gi), g = n.devicePixelRatio;
          i = p ? g >= 3 && (!i || i >= 3) ? 3 : g >= 2 && (!i || i >= 2) ? 2 : 1 : 1, l = 1 / i;
        }
        if (t.setAttribute("data-dpr", i), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + l + ", maximum-scale=" + l + ", minimum-scale=" + l + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var b = o.createElement("div");
          b.appendChild(u), o.write(b.innerHTML);
        }
        function j() {
          var C = t.getBoundingClientRect().width, x = C / 10;
          t.style.fontSize = x + "px", c.rem = n.rem = x;
        }
        n.addEventListener("resize", function() {
          j();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && j();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * i + "px" : o.addEventListener("DOMContentLoaded", function(C) {
          o.body.style.fontSize = 10 * i + "px";
        }, !1), j(), c.dpr = n.dpr = i, c.refreshRem = j, c.rem2px = function(C) {
          var x = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (x += "px"), x;
        }, c.px2rem = function(C) {
          var x = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (x += "rem"), x;
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
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), s = e("2266"), i = e("7dd0"), l = e("2626"), c = e("83ab"), f = e("f183").fastKey, h = e("69f3"), v = h.set, m = h.getterFor;
      a.exports = { getConstructor: function(p, g, b, j) {
        var C = p(function(O, S) {
          u(O, C, g), v(O, { type: g, index: r(null), first: void 0, last: void 0, size: 0 }), c || (O.size = 0), S != null && s(S, O[j], { that: O, AS_ENTRIES: b });
        }), x = m(g), _ = function(O, S, T) {
          var k, D, F = x(O), Y = y(O, S);
          return Y ? Y.value = T : (F.last = Y = { index: D = f(S, !0), key: S, value: T, previous: k = F.last, next: void 0, removed: !1 }, F.first || (F.first = Y), k && (k.next = Y), c ? F.size++ : O.size++, D !== "F" && (F.index[D] = Y)), O;
        }, y = function(O, S) {
          var T, k = x(O), D = f(S);
          if (D !== "F") return k.index[D];
          for (T = k.first; T; T = T.next) if (T.key == S) return T;
        };
        return o(C.prototype, { clear: function() {
          for (var O = this, S = x(O), T = S.index, k = S.first; k; ) k.removed = !0, k.previous && (k.previous = k.previous.next = void 0), delete T[k.index], k = k.next;
          S.first = S.last = void 0, c ? S.size = 0 : O.size = 0;
        }, delete: function(O) {
          var S = this, T = x(S), k = y(S, O);
          if (k) {
            var D = k.next, F = k.previous;
            delete T.index[k.index], k.removed = !0, F && (F.next = D), D && (D.previous = F), T.first == k && (T.first = D), T.last == k && (T.last = F), c ? T.size-- : S.size--;
          }
          return !!k;
        }, forEach: function(O) {
          for (var S, T = x(this), k = t(O, arguments.length > 1 ? arguments[1] : void 0, 3); S = S ? S.next : T.first; )
            for (k(S.value, S.key, this); S && S.removed; ) S = S.previous;
        }, has: function(O) {
          return !!y(this, O);
        } }), o(C.prototype, b ? { get: function(O) {
          var S = y(this, O);
          return S && S.value;
        }, set: function(O, S) {
          return _(this, O === 0 ? 0 : O, S);
        } } : { add: function(O) {
          return _(this, O = O === 0 ? 0 : O, O);
        } }), c && n(C.prototype, "size", { get: function() {
          return x(this).size;
        } }), C;
      }, setStrong: function(p, g, b) {
        var j = g + " Iterator", C = m(g), x = m(j);
        i(p, g, function(_, y) {
          v(this, { type: j, target: _, state: C(_), kind: y, last: void 0 });
        }, function() {
          for (var _ = x(this), y = _.kind, O = _.last; O && O.removed; ) O = O.previous;
          return _.target && (_.last = O = O ? O.next : _.state.first) ? y == "keys" ? { value: O.key, done: !1 } : y == "values" ? { value: O.value, done: !1 } : { value: [O.key, O.value], done: !1 } : (_.target = void 0, { value: void 0, done: !0 });
        }, b ? "entries" : "values", !b, !0), l(g);
      } };
    }, "65f0": function(a, d, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      a.exports = function(u, s) {
        var i;
        return r(u) && (i = u.constructor, typeof i != "function" || i !== Array && !r(i.prototype) ? n(i) && (i = i[t], i === null && (i = void 0)) : i = void 0), new (i === void 0 ? Array : i)(s === 0 ? 0 : s);
      };
    }, "69f3": function(a, d, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), s = e("861d"), i = e("9112"), l = e("5135"), c = e("c6cd"), f = e("f772"), h = e("d012"), v = u.WeakMap, m = function(_) {
        return o(_) ? r(_) : n(_, {});
      }, p = function(_) {
        return function(y) {
          var O;
          if (!s(y) || (O = r(y)).type !== _) throw TypeError("Incompatible receiver, " + _ + " required");
          return O;
        };
      };
      if (t) {
        var g = c.state || (c.state = new v()), b = g.get, j = g.has, C = g.set;
        n = function(_, y) {
          return y.facade = _, C.call(g, _, y), y;
        }, r = function(_) {
          return b.call(g, _) || {};
        }, o = function(_) {
          return j.call(g, _);
        };
      } else {
        var x = f("state");
        h[x] = !0, n = function(_, y) {
          return y.facade = _, i(_, x, y), y;
        }, r = function(_) {
          return l(_, x) ? _[x] : {};
        }, o = function(_) {
          return l(_, x);
        };
      }
      a.exports = { set: n, get: r, has: o, enforce: m, getterFor: p };
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
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), s = e("2266"), i = e("19aa"), l = e("861d"), c = e("d039"), f = e("1c7e"), h = e("d44e"), v = e("7156");
      a.exports = function(m, p, g) {
        var b = m.indexOf("Map") !== -1, j = m.indexOf("Weak") !== -1, C = b ? "set" : "add", x = r[m], _ = x && x.prototype, y = x, O = {}, S = function(H) {
          var W = _[H];
          t(_, H, H == "add" ? function(V) {
            return W.call(this, V === 0 ? 0 : V), this;
          } : H == "delete" ? function(V) {
            return !(j && !l(V)) && W.call(this, V === 0 ? 0 : V);
          } : H == "get" ? function(V) {
            return j && !l(V) ? void 0 : W.call(this, V === 0 ? 0 : V);
          } : H == "has" ? function(V) {
            return !(j && !l(V)) && W.call(this, V === 0 ? 0 : V);
          } : function(V, L) {
            return W.call(this, V === 0 ? 0 : V, L), this;
          });
        }, T = o(m, typeof x != "function" || !(j || _.forEach && !c(function() {
          new x().entries().next();
        })));
        if (T) y = g.getConstructor(p, m, b, C), u.REQUIRED = !0;
        else if (o(m, !0)) {
          var k = new y(), D = k[C](j ? {} : -0, 1) != k, F = c(function() {
            k.has(1);
          }), Y = f(function(H) {
            new x(H);
          }), ae = !j && c(function() {
            for (var H = new x(), W = 5; W--; ) H[C](W, W);
            return !H.has(-0);
          });
          Y || (y = p(function(H, W) {
            i(H, y, m);
            var V = v(new x(), H, y);
            return W != null && s(W, V[C], { that: V, AS_ENTRIES: b }), V;
          }), y.prototype = _, _.constructor = y), (F || ae) && (S("delete"), S("has"), b && S("get")), (ae || D) && S(C), j && _.clear && delete _.clear;
        }
        return O[m] = y, n({ global: !0, forced: y != x }, O), h(y, m), j || g.setStrong(y, m, b), y;
      };
    }, "6eeb": function(a, d, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), s = e("69f3"), i = s.get, l = s.enforce, c = String(String).split("String");
      (a.exports = function(f, h, v, m) {
        var p, g = !!m && !!m.unsafe, b = !!m && !!m.enumerable, j = !!m && !!m.noTargetGet;
        typeof v == "function" && (typeof h != "string" || o(v, "name") || r(v, "name", h), p = l(v), p.source || (p.source = c.join(typeof h == "string" ? h : ""))), f !== n ? (g ? !j && f[h] && (b = !0) : delete f[h], b ? f[h] = v : r(f, h, v)) : b ? f[h] = v : t(h, v);
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
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), s = e("1be4"), i = e("cc12"), l = e("f772"), c = ">", f = "<", h = "prototype", v = "script", m = l("IE_PROTO"), p = function() {
      }, g = function(x) {
        return f + v + c + x + f + "/" + v + c;
      }, b = function(x) {
        x.write(g("")), x.close();
        var _ = x.parentWindow.Object;
        return x = null, _;
      }, j = function() {
        var x, _ = i("iframe"), y = "java" + v + ":";
        return _.style.display = "none", s.appendChild(_), _.src = String(y), x = _.contentWindow.document, x.open(), x.write(g("document.F=Object")), x.close(), x.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? b(n) : j();
        for (var x = t.length; x--; ) delete C[h][t[x]];
        return C();
      };
      u[m] = !0, a.exports = Object.create || function(x, _) {
        var y;
        return x !== null ? (p[h] = r(x), y = new p(), p[h] = null, y[m] = x) : y = C(), _ === void 0 ? y : o(y, _);
      };
    }, "7db0": function(a, d, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(s) {
        return r(this, s, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(a, d, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), s = e("9112"), i = e("6eeb"), l = e("b622"), c = e("c430"), f = e("3f8c"), h = e("ae93"), v = h.IteratorPrototype, m = h.BUGGY_SAFARI_ITERATORS, p = l("iterator"), g = "keys", b = "values", j = "entries", C = function() {
        return this;
      };
      a.exports = function(x, _, y, O, S, T, k) {
        r(y, _, O);
        var D, F, Y, ae = function(ne) {
          if (ne === S && A) return A;
          if (!m && ne in V) return V[ne];
          switch (ne) {
            case g:
              return function() {
                return new y(this, ne);
              };
            case b:
              return function() {
                return new y(this, ne);
              };
            case j:
              return function() {
                return new y(this, ne);
              };
          }
          return function() {
            return new y(this);
          };
        }, H = _ + " Iterator", W = !1, V = x.prototype, L = V[p] || V["@@iterator"] || S && V[S], A = !m && L || ae(S), Q = _ == "Array" && V.entries || L;
        if (Q && (D = o(Q.call(new x())), v !== Object.prototype && D.next && (c || o(D) === v || (t ? t(D, v) : typeof D[p] != "function" && s(D, p, C)), u(D, H, !0, !0), c && (f[H] = C))), S == b && L && L.name !== b && (W = !0, A = function() {
          return L.call(this);
        }), c && !k || V[p] === A || s(V, p, A), f[_] = A, S) if (F = { values: ae(b), keys: T ? A : ae(g), entries: ae(j) }, k) for (Y in F) (m || W || !(Y in V)) && i(V, Y, F[Y]);
        else n({ target: _, proto: !0, forced: m || W }, F);
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
          } catch (j) {
            var s, i, l, c = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, h = c.exec(j.stack) || f.exec(j.stack), v = h && h[1] || !1, m = h && h[2] || !1, p = document.location.href.replace(document.location.hash, ""), g = document.getElementsByTagName("script");
            v === p && (s = document.documentElement.outerHTML, i = new RegExp("(?:[^\\n]+?\\n){0," + (m - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), l = s.replace(i, "$1").trim());
            for (var b = 0; b < g.length; b++)
              if (g[b].readyState === "interactive" || g[b].src === v || v === p && g[b].innerHTML && g[b].innerHTML.trim() === l) return g[b];
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
      a.exports = X;
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
        var h, v, m, p, g = this, b = i && g.sticky, j = n.call(g), C = g.source, x = 0, _ = f;
        return b && (j = j.replace("y", ""), j.indexOf("g") === -1 && (j += "g"), _ = String(f).slice(g.lastIndex), g.lastIndex > 0 && (!g.multiline || g.multiline && f[g.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", _ = " " + _, x++), v = new RegExp("^(?:" + C + ")", j)), l && (v = new RegExp("^" + C + "$(?!\\s)", j)), s && (h = g.lastIndex), m = o.call(b ? v : g, _), b ? m ? (m.input = m.input.slice(x), m[0] = m[0].slice(x), m.index = g.lastIndex, g.lastIndex += m[0].length) : g.lastIndex = 0 : s && m && (g.lastIndex = g.global ? m.index + m[0].length : h), l && m && m.length > 1 && t.call(m[0], v, function() {
          for (p = 1; p < arguments.length - 2; p++) arguments[p] === void 0 && (m[p] = void 0);
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
          c = e.regeneratorRuntime = l ? a.exports : {}, c.wrap = x;
          var f = "suspendedStart", h = "suspendedYield", v = "executing", m = "completed", p = {}, g = {};
          g[u] = function() {
            return this;
          };
          var b = Object.getPrototypeOf, j = b && b(b(W([])));
          j && j !== r && o.call(j, u) && (g = j);
          var C = S.prototype = y.prototype = Object.create(g);
          O.prototype = C.constructor = S, S.constructor = O, S[i] = O.displayName = "GeneratorFunction", c.isGeneratorFunction = function(L) {
            var A = typeof L == "function" && L.constructor;
            return !!A && (A === O || (A.displayName || A.name) === "GeneratorFunction");
          }, c.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, S) : (L.__proto__ = S, i in L || (L[i] = "GeneratorFunction")), L.prototype = Object.create(C), L;
          }, c.awrap = function(L) {
            return { __await: L };
          }, T(k.prototype), k.prototype[s] = function() {
            return this;
          }, c.AsyncIterator = k, c.async = function(L, A, Q, ne) {
            var U = new k(x(L, A, Q, ne));
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
          }, c.values = W, H.prototype = { constructor: H, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ae), !L) for (var A in this) A.charAt(0) === "t" && o.call(this, A) && !isNaN(+A.slice(1)) && (this[A] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], A = L.completion;
            if (A.type === "throw") throw A.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var A = this;
            function Q(Be, Re) {
              return xe.type = "throw", xe.arg = L, A.next = Be, Re && (A.method = "next", A.arg = n), !!Re;
            }
            for (var ne = this.tryEntries.length - 1; ne >= 0; --ne) {
              var U = this.tryEntries[ne], xe = U.completion;
              if (U.tryLoc === "root") return Q("end");
              if (U.tryLoc <= this.prev) {
                var ve = o.call(U, "catchLoc"), Ie = o.call(U, "finallyLoc");
                if (ve && Ie) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                } else if (ve) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                } else {
                  if (!Ie) throw new Error("try statement without catch or finally");
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
            return xe.type = L, xe.arg = A, U ? (this.method = "next", this.next = U.finallyLoc, p) : this.complete(xe);
          }, complete: function(L, A) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && A && (this.next = A), p;
          }, finish: function(L) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var Q = this.tryEntries[A];
              if (Q.finallyLoc === L) return this.complete(Q.completion, Q.afterLoc), ae(Q), p;
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
            return this.delegate = { iterator: W(L), resultName: A, nextLoc: Q }, this.method === "next" && (this.arg = n), p;
          } };
        }
        function x(L, A, Q, ne) {
          var U = A && A.prototype instanceof y ? A : y, xe = Object.create(U.prototype), ve = new H(ne || []);
          return xe._invoke = D(L, Q, ve), xe;
        }
        function _(L, A, Q) {
          try {
            return { type: "normal", arg: L.call(A, Q) };
          } catch (ne) {
            return { type: "throw", arg: ne };
          }
        }
        function y() {
        }
        function O() {
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
        function k(L) {
          function A(U, xe, ve, Ie) {
            var Be = _(L[U], L, xe);
            if (Be.type !== "throw") {
              var Re = Be.arg, Te = Re.value;
              return Te && typeof Te == "object" && o.call(Te, "__await") ? Promise.resolve(Te.__await).then(function(Ee) {
                A("next", Ee, ve, Ie);
              }, function(Ee) {
                A("throw", Ee, ve, Ie);
              }) : Promise.resolve(Te).then(function(Ee) {
                Re.value = Ee, ve(Re);
              }, Ie);
            }
            Ie(Be.arg);
          }
          var Q;
          function ne(U, xe) {
            function ve() {
              return new Promise(function(Ie, Be) {
                A(U, xe, Ie, Be);
              });
            }
            return Q = Q ? Q.then(ve, ve) : ve();
          }
          this._invoke = ne;
        }
        function D(L, A, Q) {
          var ne = f;
          return function(U, xe) {
            if (ne === v) throw new Error("Generator is already running");
            if (ne === m) {
              if (U === "throw") throw xe;
              return V();
            }
            for (Q.method = U, Q.arg = xe; ; ) {
              var ve = Q.delegate;
              if (ve) {
                var Ie = F(ve, Q);
                if (Ie) {
                  if (Ie === p) continue;
                  return Ie;
                }
              }
              if (Q.method === "next") Q.sent = Q._sent = Q.arg;
              else if (Q.method === "throw") {
                if (ne === f) throw ne = m, Q.arg;
                Q.dispatchException(Q.arg);
              } else Q.method === "return" && Q.abrupt("return", Q.arg);
              ne = v;
              var Be = _(L, A, Q);
              if (Be.type === "normal") {
                if (ne = Q.done ? m : h, Be.arg === p) continue;
                return { value: Be.arg, done: Q.done };
              }
              Be.type === "throw" && (ne = m, Q.method = "throw", Q.arg = Be.arg);
            }
          };
        }
        function F(L, A) {
          var Q = L.iterator[A.method];
          if (Q === n) {
            if (A.delegate = null, A.method === "throw") {
              if (L.iterator.return && (A.method = "return", A.arg = n, F(L, A), A.method === "throw")) return p;
              A.method = "throw", A.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return p;
          }
          var ne = _(Q, L.iterator, A.arg);
          if (ne.type === "throw") return A.method = "throw", A.arg = ne.arg, A.delegate = null, p;
          var U = ne.arg;
          return U ? U.done ? (A[L.resultName] = U.value, A.next = L.nextLoc, A.method !== "return" && (A.method = "next", A.arg = n), A.delegate = null, p) : U : (A.method = "throw", A.arg = new TypeError("iterator result is not an object"), A.delegate = null, p);
        }
        function Y(L) {
          var A = { tryLoc: L[0] };
          1 in L && (A.catchLoc = L[1]), 2 in L && (A.finallyLoc = L[2], A.afterLoc = L[3]), this.tryEntries.push(A);
        }
        function ae(L) {
          var A = L.completion || {};
          A.type = "normal", delete A.arg, L.completion = A;
        }
        function H(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(Y, this), this.reset(!0);
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
          return { next: V };
        }
        function V() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(a, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), s = e("50c4"), i = e("8418"), l = e("65f0"), c = e("1dde"), f = e("b622"), h = e("2d00"), v = f("isConcatSpreadable"), m = 9007199254740991, p = "Maximum allowed index exceeded", g = h >= 51 || !r(function() {
        var x = [];
        return x[v] = !1, x.concat()[0] !== x;
      }), b = c("concat"), j = function(x) {
        if (!t(x)) return !1;
        var _ = x[v];
        return _ !== void 0 ? !!_ : o(x);
      }, C = !g || !b;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(x) {
        var _, y, O, S, T, k = u(this), D = l(k, 0), F = 0;
        for (_ = -1, O = arguments.length; _ < O; _++) if (T = _ === -1 ? k : arguments[_], j(T)) {
          if (S = s(T.length), F + S > m) throw TypeError(p);
          for (y = 0; y < S; y++, F++) y in T && i(D, F, T[y]);
        } else {
          if (F >= m) throw TypeError(p);
          i(D, F++, T);
        }
        return D.length = F, D;
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
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), s = e("65f0"), i = e("8418"), l = e("1dde"), c = l("splice"), f = Math.max, h = Math.min, v = 9007199254740991, m = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !c }, { splice: function(p, g) {
        var b, j, C, x, _, y, O = u(this), S = t(O.length), T = r(p, S), k = arguments.length;
        if (k === 0 ? b = j = 0 : k === 1 ? (b = 0, j = S - T) : (b = k - 2, j = h(f(o(g), 0), S - T)), S + b - j > v) throw TypeError(m);
        for (C = s(O, j), x = 0; x < j; x++) _ = T + x, _ in O && i(C, x, O[_]);
        if (C.length = j, b < j) {
          for (x = T; x < S - j; x++) _ = x + j, y = x + b, _ in O ? O[y] = O[_] : delete O[y];
          for (x = S; x > S - j + b; x--) delete O[x - 1];
        } else if (b > j) for (x = S - j; x > T; x--) _ = x + j - 1, y = x + b - 1, _ in O ? O[y] = O[_] : delete O[y];
        for (x = 0; x < b; x++) O[x + T] = arguments[x + 2];
        return O.length = S - j + b, C;
      } });
    }, a4b4: function(a, d, e) {
      var n = e("342f");
      a.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(a, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), s = e("4930"), i = e("fdbf"), l = e("d039"), c = e("5135"), f = e("e8b5"), h = e("861d"), v = e("825a"), m = e("7b0b"), p = e("fc6a"), g = e("c04e"), b = e("5c6c"), j = e("7c73"), C = e("df75"), x = e("241c"), _ = e("057f"), y = e("7418"), O = e("06cf"), S = e("9bf2"), T = e("d1e7"), k = e("9112"), D = e("6eeb"), F = e("5692"), Y = e("f772"), ae = e("d012"), H = e("90e3"), W = e("b622"), V = e("e538"), L = e("746f"), A = e("d44e"), Q = e("69f3"), ne = e("b727").forEach, U = Y("hidden"), xe = "Symbol", ve = "prototype", Ie = W("toPrimitive"), Be = Q.set, Re = Q.getterFor(xe), Te = Object[ve], Ee = r.Symbol, Fe = o("JSON", "stringify"), Qe = O.f, B = S.f, R = _.f, Z = T.f, M = F("symbols"), te = F("op-symbols"), ie = F("string-to-symbol-registry"), we = F("symbol-to-string-registry"), ge = F("wks"), ce = r.QObject, G = !ce || !ce[ve] || !ce[ve].findChild, N = u && l(function() {
        return j(B({}, "a", { get: function() {
          return B(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, oe, le) {
        var me = Qe(Te, oe);
        me && delete Te[oe], B(q, oe, le), me && q !== Te && B(Te, oe, me);
      } : B, re = function(q, oe) {
        var le = M[q] = j(Ee[ve]);
        return Be(le, { type: xe, tag: q, description: oe }), u || (le.description = oe), le;
      }, ke = i ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Ee;
      }, We = function(q, oe, le) {
        q === Te && We(te, oe, le), v(q);
        var me = g(oe, !0);
        return v(le), c(M, me) ? (le.enumerable ? (c(q, U) && q[U][me] && (q[U][me] = !1), le = j(le, { enumerable: b(0, !1) })) : (c(q, U) || B(q, U, b(1, {})), q[U][me] = !0), N(q, me, le)) : B(q, me, le);
      }, Ye = function(q, oe) {
        v(q);
        var le = p(oe), me = C(le).concat(fe(le));
        return ne(me, function(Ue) {
          u && !at.call(le, Ue) || We(q, Ue, le[Ue]);
        }), q;
      }, Ze = function(q, oe) {
        return oe === void 0 ? j(q) : Ye(j(q), oe);
      }, at = function(q) {
        var oe = g(q, !0), le = Z.call(this, oe);
        return !(this === Te && c(M, oe) && !c(te, oe)) && (!(le || !c(this, oe) || !c(M, oe) || c(this, U) && this[U][oe]) || le);
      }, z = function(q, oe) {
        var le = p(q), me = g(oe, !0);
        if (le !== Te || !c(M, me) || c(te, me)) {
          var Ue = Qe(le, me);
          return !Ue || !c(M, me) || c(le, U) && le[U][me] || (Ue.enumerable = !0), Ue;
        }
      }, ue = function(q) {
        var oe = R(p(q)), le = [];
        return ne(oe, function(me) {
          c(M, me) || c(ae, me) || le.push(me);
        }), le;
      }, fe = function(q) {
        var oe = q === Te, le = R(oe ? te : p(q)), me = [];
        return ne(le, function(Ue) {
          !c(M, Ue) || oe && !c(Te, Ue) || me.push(M[Ue]);
        }), me;
      };
      if (s || (Ee = function() {
        if (this instanceof Ee) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, oe = H(q), le = function(me) {
          this === Te && le.call(te, me), c(this, U) && c(this[U], oe) && (this[U][oe] = !1), N(this, oe, b(1, me));
        };
        return u && G && N(Te, oe, { configurable: !0, set: le }), re(oe, q);
      }, D(Ee[ve], "toString", function() {
        return Re(this).tag;
      }), D(Ee, "withoutSetter", function(q) {
        return re(H(q), q);
      }), T.f = at, S.f = We, O.f = z, x.f = _.f = ue, y.f = fe, V.f = function(q) {
        return re(W(q), q);
      }, u && (B(Ee[ve], "description", { configurable: !0, get: function() {
        return Re(this).description;
      } }), t || D(Te, "propertyIsEnumerable", at, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !s, sham: !s }, { Symbol: Ee }), ne(C(ge), function(q) {
        L(q);
      }), n({ target: xe, stat: !0, forced: !s }, { for: function(q) {
        var oe = String(q);
        if (c(ie, oe)) return ie[oe];
        var le = Ee(oe);
        return ie[oe] = le, we[le] = oe, le;
      }, keyFor: function(q) {
        if (!ke(q)) throw TypeError(q + " is not a symbol");
        if (c(we, q)) return we[q];
      }, useSetter: function() {
        G = !0;
      }, useSimple: function() {
        G = !1;
      } }), n({ target: "Object", stat: !0, forced: !s, sham: !u }, { create: Ze, defineProperty: We, defineProperties: Ye, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !s }, { getOwnPropertyNames: ue, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: l(function() {
        y.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return y.f(m(q));
      } }), Fe) {
        var he = !s || l(function() {
          var q = Ee();
          return Fe([q]) != "[null]" || Fe({ a: q }) != "{}" || Fe(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: he }, { stringify: function(q, oe, le) {
          for (var me, Ue = [q], qe = 1; arguments.length > qe; ) Ue.push(arguments[qe++]);
          if (me = oe, (h(oe) || q !== void 0) && !ke(q)) return f(oe) || (oe = function(et, Oe) {
            if (typeof me == "function" && (Oe = me.call(this, et, Oe)), !ke(Oe)) return Oe;
          }), Ue[1] = oe, Fe.apply(null, Ue);
        } });
      }
      Ee[ve][Ie] || k(Ee[ve], Ie, Ee[ve].valueOf), A(Ee, xe), ae[U] = !0;
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
      var n, r, o, t = e("d039"), u = e("e163"), s = e("9112"), i = e("5135"), l = e("b622"), c = e("c430"), f = l("iterator"), h = !1, v = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : h = !0);
      var m = n == null || t(function() {
        var p = {};
        return n[f].call(p) !== p;
      });
      m && (n = {}), c && !m || i(n, f) || s(n, f, v), a.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: h };
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
          var v = c.data, m = c.headers;
          n.isFormData(v) && delete m["Content-Type"];
          var p = new XMLHttpRequest();
          if (c.auth) {
            var g = c.auth.username || "", b = c.auth.password ? unescape(encodeURIComponent(c.auth.password)) : "";
            m.Authorization = "Basic " + btoa(g + ":" + b);
          }
          var j = u(c.baseURL, c.url);
          if (p.open(c.method.toUpperCase(), t(j, c.params, c.paramsSerializer), !0), p.timeout = c.timeout, p.onreadystatechange = function() {
            if (p && p.readyState === 4 && (p.status !== 0 || p.responseURL && p.responseURL.indexOf("file:") === 0)) {
              var x = "getAllResponseHeaders" in p ? s(p.getAllResponseHeaders()) : null, _ = c.responseType && c.responseType !== "text" ? p.response : p.responseText, y = { data: _, status: p.status, statusText: p.statusText, headers: x, config: c, request: p };
              r(f, h, y), p = null;
            }
          }, p.onabort = function() {
            p && (h(l("Request aborted", c, "ECONNABORTED", p)), p = null);
          }, p.onerror = function() {
            h(l("Network Error", c, null, p)), p = null;
          }, p.ontimeout = function() {
            var x = "timeout of " + c.timeout + "ms exceeded";
            c.timeoutErrorMessage && (x = c.timeoutErrorMessage), h(l(x, c, "ECONNABORTED", p)), p = null;
          }, n.isStandardBrowserEnv()) {
            var C = (c.withCredentials || i(j)) && c.xsrfCookieName ? o.read(c.xsrfCookieName) : void 0;
            C && (m[c.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in p && n.forEach(m, function(x, _) {
            typeof v > "u" && _.toLowerCase() === "content-type" ? delete m[_] : p.setRequestHeader(_, x);
          }), n.isUndefined(c.withCredentials) || (p.withCredentials = !!c.withCredentials), c.responseType) try {
            p.responseType = c.responseType;
          } catch (x) {
            if (c.responseType !== "json") throw x;
          }
          typeof c.onDownloadProgress == "function" && p.addEventListener("progress", c.onDownloadProgress), typeof c.onUploadProgress == "function" && p.upload && p.upload.addEventListener("progress", c.onUploadProgress), c.cancelToken && c.cancelToken.promise.then(function(x) {
            p && (p.abort(), h(x), p = null);
          }), v || (v = null), p.send(v);
        });
      };
    }, b575: function(a, d, e) {
      var n, r, o, t, u, s, i, l, c = e("da84"), f = e("06cf").f, h = e("2cf4").set, v = e("1cdc"), m = e("a4b4"), p = e("605d"), g = c.MutationObserver || c.WebKitMutationObserver, b = c.document, j = c.process, C = c.Promise, x = f(c, "queueMicrotask"), _ = x && x.value;
      _ || (n = function() {
        var y, O;
        for (p && (y = j.domain) && y.exit(); r; ) {
          O = r.fn, r = r.next;
          try {
            O();
          } catch (S) {
            throw r ? t() : o = void 0, S;
          }
        }
        o = void 0, y && y.enter();
      }, v || p || m || !g || !b ? C && C.resolve ? (i = C.resolve(void 0), l = i.then, t = function() {
        l.call(i, n);
      }) : t = p ? function() {
        j.nextTick(n);
      } : function() {
        h.call(c, n);
      } : (u = !0, s = b.createTextNode(""), new g(n).observe(s, { characterData: !0 }), t = function() {
        s.data = u = !u;
      })), a.exports = _ || function(y) {
        var O = { fn: y, next: void 0 };
        o && (o.next = O), r || (r = O, t()), o = O;
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
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), s = 1 .toFixed, i = Math.floor, l = function(p, g, b) {
        return g === 0 ? b : g % 2 === 1 ? l(p, g - 1, b * p) : l(p * p, g / 2, b);
      }, c = function(p) {
        for (var g = 0, b = p; b >= 4096; ) g += 12, b /= 4096;
        for (; b >= 2; ) g += 1, b /= 2;
        return g;
      }, f = function(p, g, b) {
        for (var j = -1, C = b; ++j < 6; ) C += g * p[j], p[j] = C % 1e7, C = i(C / 1e7);
      }, h = function(p, g) {
        for (var b = 6, j = 0; --b >= 0; ) j += p[b], p[b] = i(j / g), j = j % g * 1e7;
      }, v = function(p) {
        for (var g = 6, b = ""; --g >= 0; ) if (b !== "" || g === 0 || p[g] !== 0) {
          var j = String(p[g]);
          b = b === "" ? j : b + t.call("0", 7 - j.length) + j;
        }
        return b;
      }, m = s && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        s.call({});
      });
      n({ target: "Number", proto: !0, forced: m }, { toFixed: function(p) {
        var g, b, j, C, x = o(this), _ = r(p), y = [0, 0, 0, 0, 0, 0], O = "", S = "0";
        if (_ < 0 || _ > 20) throw RangeError("Incorrect fraction digits");
        if (x != x) return "NaN";
        if (x <= -1e21 || x >= 1e21) return String(x);
        if (x < 0 && (O = "-", x = -x), x > 1e-21) if (g = c(x * l(2, 69, 1)) - 69, b = g < 0 ? x * l(2, -g, 1) : x / l(2, g, 1), b *= 4503599627370496, g = 52 - g, g > 0) {
          for (f(y, 0, b), j = _; j >= 7; ) f(y, 1e7, 0), j -= 7;
          for (f(y, l(10, j, 1), 0), j = g - 1; j >= 23; ) h(y, 1 << 23), j -= 23;
          h(y, 1 << j), f(y, 1, 1), h(y, 2), S = v(y);
        } else f(y, 0, b), f(y, 1 << -g, 0), S = v(y) + t.call("0", _);
        return _ > 0 ? (C = S.length, S = O + (C <= _ ? "0." + t.call("0", _ - C) + S : S.slice(0, C - _) + "." + S.slice(C - _))) : S = O + S, S;
      } });
    }, b727: function(a, d, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), s = [].push, i = function(l) {
        var c = l == 1, f = l == 2, h = l == 3, v = l == 4, m = l == 6, p = l == 7, g = l == 5 || m;
        return function(b, j, C, x) {
          for (var _, y, O = o(b), S = r(O), T = n(j, C, 3), k = t(S.length), D = 0, F = x || u, Y = c ? F(b, k) : f || p ? F(b, 0) : void 0; k > D; D++) if ((g || D in S) && (_ = S[D], y = T(_, D, O), l)) if (c) Y[D] = y;
          else if (y) switch (l) {
            case 3:
              return !0;
            case 5:
              return _;
            case 6:
              return D;
            case 2:
              s.call(Y, _);
          }
          else switch (l) {
            case 4:
              return !1;
            case 7:
              s.call(Y, _);
          }
          return m ? -1 : h || v ? v : Y;
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
      function o(k) {
        return r.call(k) === "[object Array]";
      }
      function t(k) {
        return typeof k > "u";
      }
      function u(k) {
        return k !== null && !t(k) && k.constructor !== null && !t(k.constructor) && typeof k.constructor.isBuffer == "function" && k.constructor.isBuffer(k);
      }
      function s(k) {
        return r.call(k) === "[object ArrayBuffer]";
      }
      function i(k) {
        return typeof FormData < "u" && k instanceof FormData;
      }
      function l(k) {
        var D;
        return D = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(k) : k && k.buffer && k.buffer instanceof ArrayBuffer, D;
      }
      function c(k) {
        return typeof k == "string";
      }
      function f(k) {
        return typeof k == "number";
      }
      function h(k) {
        return k !== null && typeof k == "object";
      }
      function v(k) {
        if (r.call(k) !== "[object Object]") return !1;
        var D = Object.getPrototypeOf(k);
        return D === null || D === Object.prototype;
      }
      function m(k) {
        return r.call(k) === "[object Date]";
      }
      function p(k) {
        return r.call(k) === "[object File]";
      }
      function g(k) {
        return r.call(k) === "[object Blob]";
      }
      function b(k) {
        return r.call(k) === "[object Function]";
      }
      function j(k) {
        return h(k) && b(k.pipe);
      }
      function C(k) {
        return typeof URLSearchParams < "u" && k instanceof URLSearchParams;
      }
      function x(k) {
        return k.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function _() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function y(k, D) {
        if (k !== null && typeof k < "u") if (typeof k != "object" && (k = [k]), o(k)) for (var F = 0, Y = k.length; F < Y; F++) D.call(null, k[F], F, k);
        else for (var ae in k) Object.prototype.hasOwnProperty.call(k, ae) && D.call(null, k[ae], ae, k);
      }
      function O() {
        var k = {};
        function D(ae, H) {
          v(k[H]) && v(ae) ? k[H] = O(k[H], ae) : v(ae) ? k[H] = O({}, ae) : o(ae) ? k[H] = ae.slice() : k[H] = ae;
        }
        for (var F = 0, Y = arguments.length; F < Y; F++) y(arguments[F], D);
        return k;
      }
      function S(k, D, F) {
        return y(D, function(Y, ae) {
          k[ae] = F && typeof Y == "function" ? n(Y, F) : Y;
        }), k;
      }
      function T(k) {
        return k.charCodeAt(0) === 65279 && (k = k.slice(1)), k;
      }
      a.exports = { isArray: o, isArrayBuffer: s, isBuffer: u, isFormData: i, isArrayBufferView: l, isString: c, isNumber: f, isObject: h, isPlainObject: v, isUndefined: t, isDate: m, isFile: p, isBlob: g, isFunction: b, isStream: j, isURLSearchParams: C, isStandardBrowserEnv: _, forEach: y, merge: O, extend: S, trim: x, stripBOM: T };
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
          var h = r(i), v = o(h), m = t(h.length), p = s ? m - 1 : 0, g = s ? -1 : 1;
          if (c < 2) for (; ; ) {
            if (p in v) {
              f = v[p], p += g;
              break;
            }
            if (p += g, s ? p < 0 : m <= p) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; s ? p >= 0 : m > p; p += g) p in v && (f = l(f, v[p], p, h));
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
        var v = /./;
        return v.exec = function() {
          var m = [];
          return m.groups = { a: "7" }, m;
        }, "".replace(v, "$<a>") !== "7";
      }), l = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), c = o("replace"), f = function() {
        return !!/./[c] && /./[c]("a", "$0") === "";
      }(), h = !r(function() {
        var v = /(?:)/, m = v.exec;
        v.exec = function() {
          return m.apply(this, arguments);
        };
        var p = "ab".split(v);
        return p.length !== 2 || p[0] !== "a" || p[1] !== "b";
      });
      a.exports = function(v, m, p, g) {
        var b = o(v), j = !r(function() {
          var S = {};
          return S[b] = function() {
            return 7;
          }, ""[v](S) != 7;
        }), C = j && !r(function() {
          var S = !1, T = /a/;
          return v === "split" && (T = {}, T.constructor = {}, T.constructor[s] = function() {
            return T;
          }, T.flags = "", T[b] = /./[b]), T.exec = function() {
            return S = !0, null;
          }, T[b](""), !S;
        });
        if (!j || !C || v === "replace" && (!i || !l || f) || v === "split" && !h) {
          var x = /./[b], _ = p(b, ""[v], function(S, T, k, D, F) {
            return T.exec === t ? j && !F ? { done: !0, value: x.call(T, k, D) } : { done: !0, value: S.call(k, T, D) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: l, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), y = _[0], O = _[1];
          n(String.prototype, v, y), n(RegExp.prototype, b, m == 2 ? function(S, T) {
            return O.call(S, this, T);
          } : function(S) {
            return O.call(S, this);
          });
        }
        g && u(RegExp.prototype[b], "sham", !0);
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
        for (var l, c, f = t(i), h = u.f, v = o(f), m = {}, p = 0; v.length > p; ) c = h(f, l = v[p++]), c !== void 0 && s(m, l, c);
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
            for (var v in o) if (h[v] !== o[v]) try {
              t(h, v, o[v]);
            } catch {
              h[v] = o[v];
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
          function l(g) {
            for (var b = 0; b < g.length && g[b] === ""; b++) ;
            for (var j = g.length - 1; j >= 0 && g[j] === ""; j--) ;
            return b > j ? [] : g.slice(b, j - b + 1);
          }
          s = d.resolve(s).substr(1), i = d.resolve(i).substr(1);
          for (var c = l(s.split("/")), f = l(i.split("/")), h = Math.min(c.length, f.length), v = h, m = 0; m < h; m++) if (c[m] !== f[m]) {
            v = m;
            break;
          }
          var p = [];
          for (m = v; m < c.length; m++) p.push("..");
          return p = p.concat(f.slice(v)), p.join("/");
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
          for (var i = -1, l = 0, c = -1, f = !0, h = 0, v = s.length - 1; v >= 0; --v) {
            var m = s.charCodeAt(v);
            if (m !== 47) c === -1 && (f = !1, c = v + 1), m === 46 ? i === -1 ? i = v : h !== 1 && (h = 1) : i !== -1 && (h = -1);
            else if (!f) {
              l = v + 1;
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
            var p = m.id, g = m.viewBox, b = m.content;
            this.id = p, this.viewBox = g, this.content = b;
          };
          r.prototype.stringify = function() {
            return this.content;
          }, r.prototype.toString = function() {
            return this.stringify();
          }, r.prototype.destroy = function() {
            var m = this;
            ["id", "viewBox", "content"].forEach(function(p) {
              return delete m[p];
            });
          };
          var o = function(m) {
            var p = !!document.importNode, g = new DOMParser().parseFromString(m, "image/svg+xml").documentElement;
            return p ? document.importNode(g, !0) : g;
          };
          function t(m, p) {
            return p = { exports: {} }, m(p, p.exports), p.exports;
          }
          var u = t(function(m, p) {
            (function(g, b) {
              m.exports = b();
            })(0, function() {
              function g(y) {
                var O = y && typeof y == "object";
                return O && Object.prototype.toString.call(y) !== "[object RegExp]" && Object.prototype.toString.call(y) !== "[object Date]";
              }
              function b(y) {
                return Array.isArray(y) ? [] : {};
              }
              function j(y, O) {
                var S = O && O.clone === !0;
                return S && g(y) ? _(b(y), y, O) : y;
              }
              function C(y, O, S) {
                var T = y.slice();
                return O.forEach(function(k, D) {
                  typeof T[D] > "u" ? T[D] = j(k, S) : g(k) ? T[D] = _(y[D], k, S) : y.indexOf(k) === -1 && T.push(j(k, S));
                }), T;
              }
              function x(y, O, S) {
                var T = {};
                return g(y) && Object.keys(y).forEach(function(k) {
                  T[k] = j(y[k], S);
                }), Object.keys(O).forEach(function(k) {
                  g(O[k]) && y[k] ? T[k] = _(y[k], O[k], S) : T[k] = j(O[k], S);
                }), T;
              }
              function _(y, O, S) {
                var T = Array.isArray(O), k = S || { arrayMerge: C }, D = k.arrayMerge || C;
                return T ? Array.isArray(y) ? D(y, O, S) : j(O, S) : x(y, O, S);
              }
              return _.all = function(y, O) {
                if (!Array.isArray(y) || y.length < 2) throw new Error("first argument should be an array with at least two elements");
                return y.reduce(function(S, T) {
                  return _(S, T, O);
                });
              }, _;
            });
          }), s = t(function(m, p) {
            var g = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            p.default = g, m.exports = p.default;
          }), i = function(m) {
            return Object.keys(m).map(function(p) {
              var g = m[p].toString().replace(/"/g, "&quot;");
              return p + '="' + g + '"';
            }).join(" ");
          }, l = s.svg, c = s.xlink, f = {};
          f[l.name] = l.uri, f[c.name] = c.uri;
          var h = function(m, p) {
            m === void 0 && (m = "");
            var g = u(f, {}), b = i(g);
            return "<svg " + b + ">" + m + "</svg>";
          }, v = function(m) {
            function p() {
              m.apply(this, arguments);
            }
            m && (p.__proto__ = m), p.prototype = Object.create(m && m.prototype), p.prototype.constructor = p;
            var g = { isMounted: {} };
            return g.isMounted.get = function() {
              return !!this.node;
            }, p.createFromExistingNode = function(b) {
              return new p({ id: b.getAttribute("id"), viewBox: b.getAttribute("viewBox"), content: b.outerHTML });
            }, p.prototype.destroy = function() {
              this.isMounted && this.unmount(), m.prototype.destroy.call(this);
            }, p.prototype.mount = function(b) {
              if (this.isMounted) return this.node;
              var j = typeof b == "string" ? document.querySelector(b) : b, C = this.render();
              return this.node = C, j.appendChild(C), C;
            }, p.prototype.render = function() {
              var b = this.stringify();
              return o(h(b)).childNodes[0];
            }, p.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(p.prototype, g), p;
          }(r);
          return v;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(a, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), s = e("9bf2").f, i = e("e893"), l = o.Symbol;
      if (r && typeof l == "function" && (!("description" in l.prototype) || l().description !== void 0)) {
        var c = {}, f = function() {
          var g = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), b = this instanceof f ? new l(g) : g === void 0 ? l() : l(g);
          return g === "" && (c[b] = !0), b;
        };
        i(f, l);
        var h = f.prototype = l.prototype;
        h.constructor = f;
        var v = h.toString, m = String(l("test")) == "Symbol(test)", p = /^Symbol\((.*)\)[^)]+$/;
        s(h, "description", { configurable: !0, get: function() {
          var g = u(this) ? this.valueOf() : this, b = v.call(g);
          if (t(c, g)) return "";
          var j = m ? b.slice(7, -1) : b.replace(p, "$1");
          return j === "" ? void 0 : j;
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
        var c = l(this), f = c.target, h = c.kind, v = c.index++;
        return !f || v >= f.length ? (c.target = void 0, { value: void 0, done: !0 }) : h == "keys" ? { value: v, done: !1 } : h == "values" ? { value: f[v], done: !1 } : { value: [v, f[v]], done: !1 };
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
      var n, r, o, t, u = e("23e7"), s = e("c430"), i = e("da84"), l = e("d066"), c = e("fea9"), f = e("6eeb"), h = e("e2cc"), v = e("d44e"), m = e("2626"), p = e("861d"), g = e("1c0b"), b = e("19aa"), j = e("8925"), C = e("2266"), x = e("1c7e"), _ = e("4840"), y = e("2cf4").set, O = e("b575"), S = e("cdf9"), T = e("44de"), k = e("f069"), D = e("e667"), F = e("69f3"), Y = e("94ca"), ae = e("b622"), H = e("605d"), W = e("2d00"), V = ae("species"), L = "Promise", A = F.get, Q = F.set, ne = F.getterFor(L), U = c, xe = i.TypeError, ve = i.document, Ie = i.process, Be = l("fetch"), Re = k.f, Te = Re, Ee = !!(ve && ve.createEvent && i.dispatchEvent), Fe = typeof PromiseRejectionEvent == "function", Qe = "unhandledrejection", B = "rejectionhandled", R = 0, Z = 1, M = 2, te = 1, ie = 2, we = Y(L, function() {
        var z = j(U) !== String(U);
        if (!z && (W === 66 || !H && !Fe) || s && !U.prototype.finally) return !0;
        if (W >= 51 && /native code/.test(U)) return !1;
        var ue = U.resolve(1), fe = function(q) {
          q(function() {
          }, function() {
          });
        }, he = ue.constructor = {};
        return he[V] = fe, !(ue.then(function() {
        }) instanceof fe);
      }), ge = we || !x(function(z) {
        U.all(z).catch(function() {
        });
      }), ce = function(z) {
        var ue;
        return !(!p(z) || typeof (ue = z.then) != "function") && ue;
      }, G = function(z, ue) {
        if (!z.notified) {
          z.notified = !0;
          var fe = z.reactions;
          O(function() {
            for (var he = z.value, q = z.state == Z, oe = 0; fe.length > oe; ) {
              var le, me, Ue, qe = fe[oe++], et = q ? qe.ok : qe.fail, Oe = qe.resolve, tt = qe.reject, He = qe.domain;
              try {
                et ? (q || (z.rejection === ie && We(z), z.rejection = te), et === !0 ? le = he : (He && He.enter(), le = et(he), He && (He.exit(), Ue = !0)), le === qe.promise ? tt(xe("Promise-chain cycle")) : (me = ce(le)) ? me.call(le, Oe, tt) : Oe(le)) : tt(he);
              } catch (gt) {
                He && !Ue && He.exit(), tt(gt);
              }
            }
            z.reactions = [], z.notified = !1, ue && !z.rejection && re(z);
          });
        }
      }, N = function(z, ue, fe) {
        var he, q;
        Ee ? (he = ve.createEvent("Event"), he.promise = ue, he.reason = fe, he.initEvent(z, !1, !0), i.dispatchEvent(he)) : he = { promise: ue, reason: fe }, !Fe && (q = i["on" + z]) ? q(he) : z === Qe && T("Unhandled promise rejection", fe);
      }, re = function(z) {
        y.call(i, function() {
          var ue, fe = z.facade, he = z.value, q = ke(z);
          if (q && (ue = D(function() {
            H ? Ie.emit("unhandledRejection", he, fe) : N(Qe, fe, he);
          }), z.rejection = H || ke(z) ? ie : te, ue.error)) throw ue.value;
        });
      }, ke = function(z) {
        return z.rejection !== te && !z.parent;
      }, We = function(z) {
        y.call(i, function() {
          var ue = z.facade;
          H ? Ie.emit("rejectionHandled", ue) : N(B, ue, z.value);
        });
      }, Ye = function(z, ue, fe) {
        return function(he) {
          z(ue, he, fe);
        };
      }, Ze = function(z, ue, fe) {
        z.done || (z.done = !0, fe && (z = fe), z.value = ue, z.state = M, G(z, !0));
      }, at = function(z, ue, fe) {
        if (!z.done) {
          z.done = !0, fe && (z = fe);
          try {
            if (z.facade === ue) throw xe("Promise can't be resolved itself");
            var he = ce(ue);
            he ? O(function() {
              var q = { done: !1 };
              try {
                he.call(ue, Ye(at, q, z), Ye(Ze, q, z));
              } catch (oe) {
                Ze(q, oe, z);
              }
            }) : (z.value = ue, z.state = Z, G(z, !1));
          } catch (q) {
            Ze({ done: !1 }, q, z);
          }
        }
      };
      we && (U = function(z) {
        b(this, U, L), g(z), n.call(this);
        var ue = A(this);
        try {
          z(Ye(at, ue), Ye(Ze, ue));
        } catch (fe) {
          Ze(ue, fe);
        }
      }, n = function(z) {
        Q(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: R, value: void 0 });
      }, n.prototype = h(U.prototype, { then: function(z, ue) {
        var fe = ne(this), he = Re(_(this, U));
        return he.ok = typeof z != "function" || z, he.fail = typeof ue == "function" && ue, he.domain = H ? Ie.domain : void 0, fe.parent = !0, fe.reactions.push(he), fe.state != R && G(fe, !1), he.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), r = function() {
        var z = new n(), ue = A(z);
        this.promise = z, this.resolve = Ye(at, ue), this.reject = Ye(Ze, ue);
      }, k.f = Re = function(z) {
        return z === U || z === o ? new r(z) : Te(z);
      }, s || typeof c != "function" || (t = c.prototype.then, f(c.prototype, "then", function(z, ue) {
        var fe = this;
        return new U(function(he, q) {
          t.call(fe, he, q);
        }).then(z, ue);
      }, { unsafe: !0 }), typeof Be == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return S(U, Be.apply(i, arguments));
      } }))), u({ global: !0, wrap: !0, forced: we }, { Promise: U }), v(U, L, !1, !0), m(L), o = l(L), u({ target: L, stat: !0, forced: we }, { reject: function(z) {
        var ue = Re(this);
        return ue.reject.call(void 0, z), ue.promise;
      } }), u({ target: L, stat: !0, forced: s || we }, { resolve: function(z) {
        return S(s && this === o ? U : this, z);
      } }), u({ target: L, stat: !0, forced: ge }, { all: function(z) {
        var ue = this, fe = Re(ue), he = fe.resolve, q = fe.reject, oe = D(function() {
          var le = g(ue.resolve), me = [], Ue = 0, qe = 1;
          C(z, function(et) {
            var Oe = Ue++, tt = !1;
            me.push(void 0), qe++, le.call(ue, et).then(function(He) {
              tt || (tt = !0, me[Oe] = He, --qe || he(me));
            }, q);
          }), --qe || he(me);
        });
        return oe.error && q(oe.value), fe.promise;
      }, race: function(z) {
        var ue = this, fe = Re(ue), he = fe.reject, q = D(function() {
          var oe = g(ue.resolve);
          C(z, function(le) {
            oe.call(ue, le).then(fe.resolve, he);
          });
        });
        return q.error && he(q.value), fe.promise;
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
      }, f = function(g) {
        t(g, i, { value: { objectID: "O" + ++l, weakData: {} } });
      }, h = function(g, b) {
        if (!r(g)) return typeof g == "symbol" ? g : (typeof g == "string" ? "S" : "P") + g;
        if (!o(g, i)) {
          if (!c(g)) return "F";
          if (!b) return "E";
          f(g);
        }
        return g[i].objectID;
      }, v = function(g, b) {
        if (!o(g, i)) {
          if (!c(g)) return !0;
          if (!b) return !1;
          f(g);
        }
        return g[i].weakData;
      }, m = function(g) {
        return s && p.REQUIRED && c(g) && !o(g, i) && f(g), g;
      }, p = a.exports = { REQUIRED: !1, fastKey: h, getWeakData: v, onFreeze: m };
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
      function i(w, $, I, P, K, se) {
        var pe = Object(t.resolveComponent)("Result"), de = Object(t.resolveComponent)("DefaultBoard"), ye = Object(t.resolveComponent)("HandBoard"), $e = Object(t.resolveComponent)("svg-icon"), Me = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: w.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [w.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: $[1] || ($[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(pe, { data: w.resultVal, onChange: w.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", s, [w.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, ref: "defaultBoardRef", onTrigger: w.trigger, onChange: w.change, onTranslate: w.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), w.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ye, { key: 1, onTrigger: w.trigger, onChange: w.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), w.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: w.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(w.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)($e, { "icon-class": "drag" })], 4)), [[Me]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function l(w, $, I) {
        return $ in w ? Object.defineProperty(w, $, { value: I, enumerable: !0, configurable: !0, writable: !0 }) : w[$] = I, w;
      }
      function c(w, $) {
        var I = Object.keys(w);
        if (Object.getOwnPropertySymbols) {
          var P = Object.getOwnPropertySymbols(w);
          $ && (P = P.filter(function(K) {
            return Object.getOwnPropertyDescriptor(w, K).enumerable;
          })), I.push.apply(I, P);
        }
        return I;
      }
      function f(w) {
        for (var $ = 1; $ < arguments.length; $++) {
          var I = arguments[$] != null ? arguments[$] : {};
          $ % 2 ? c(Object(I), !0).forEach(function(P) {
            l(w, P, I[P]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(w, Object.getOwnPropertyDescriptors(I)) : c(Object(I)).forEach(function(P) {
            Object.defineProperty(w, P, Object.getOwnPropertyDescriptor(I, P));
          });
        }
        return w;
      }
      function h(w, $) {
        ($ == null || $ > w.length) && ($ = w.length);
        for (var I = 0, P = new Array($); I < $; I++) P[I] = w[I];
        return P;
      }
      function v(w) {
        if (Array.isArray(w)) return h(w);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function m(w) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(w)) return Array.from(w);
      }
      e("fb6a");
      function p(w, $) {
        if (w) {
          if (typeof w == "string") return h(w, $);
          var I = Object.prototype.toString.call(w).slice(8, -1);
          return I === "Object" && w.constructor && (I = w.constructor.name), I === "Map" || I === "Set" ? Array.from(w) : I === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(I) ? h(w, $) : void 0;
        }
      }
      function g() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function b(w) {
        return v(w) || m(w) || p(w) || g();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function j(w, $) {
        if (!(w instanceof $)) throw new TypeError("Cannot call a class as a function");
      }
      function C(w, $) {
        for (var I = 0; I < $.length; I++) {
          var P = $[I];
          P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(w, P.key, P);
        }
      }
      function x(w, $, I) {
        return $ && C(w.prototype, $), w;
      }
      var _ = function() {
        function w() {
          j(this, w), this.listeners = {};
        }
        return x(w, [{ key: "on", value: function($, I) {
          var P = this, K = this.listeners[$];
          return K || (K = []), K.push(I), this.listeners[$] = K, function() {
            P.remove($, I);
          };
        } }, { key: "emit", value: function($) {
          var I = this.listeners[$];
          if (Array.isArray(I)) {
            for (var P = arguments.length, K = new Array(P > 1 ? P - 1 : 0), se = 1; se < P; se++) K[se - 1] = arguments[se];
            for (var pe = 0; pe < I.length; pe++) {
              var de = I[pe];
              typeof de == "function" && de.apply(void 0, K);
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
        } }]), w;
      }(), y = new _(), O = { mounted: function(w, $, I) {
        var P = w.parentNode;
        w.onmousedown = function(K) {
          var se = K.clientX - P.offsetLeft, pe = K.clientY - P.offsetTop;
          document.onmousemove = function(de) {
            var ye = de.clientX - se, $e = de.clientY - pe;
            P.style.left = ye + "px", P.style.top = $e + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, w.ontouchstart = function(K) {
          var se = K.touches[0].pageX, pe = K.touches[0].pageY, de = se - P.offsetLeft, ye = pe - P.offsetTop;
          document.ontouchmove = function($e) {
            var Me = $e.touches[0].pageX, Ve = $e.touches[0].pageY, ze = Me - de, pt = Ve - ye;
            P.style.left = ze + "px", P.style.top = pt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, S = O, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var k = { key: 0, class: "key-board-code-show" }, D = { class: "key-board-result-show" }, F = { class: "key-board-result-show-container" }, Y = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ae = T(function(w, $, I, P, K, se) {
        return w.status === "CN" || w.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: w.color } }, [w.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", k, Object(t.toDisplayString)(w.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", D, [Object(t.createVNode)("div", F, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.showList[w.showIndex], function(pe, de) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: de, onClick: function(ye) {
            return w.selectWord(pe);
          } }, Object(t.toDisplayString)(de + 1) + "." + Object(t.toDisplayString)(pe), 9, ["onClick"]);
        }), 128))]), w.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", Y, [Object(t.createVNode)("span", { style: w.getStyle, onClick: $[1] || ($[1] = function() {
          return w.upper && w.upper.apply(w, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: w.getStyle, onClick: $[2] || ($[2] = function() {
          return w.lower && w.lower.apply(w, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), H = (e("1276"), e("6062"), e("5319"), function(w, $) {
        for (var I = 0, P = []; I < w.length; ) P.push(w.slice(I, I += $));
        return P;
      }), W = Symbol("KEYBOARD_CONTEXT"), V = function(w) {
        Object(t.provide)(W, w);
      }, L = function() {
        return Object(t.inject)(W);
      }, A = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(w, $) {
        var I = $.emit, P = L(), K = Object(t.computed)(function() {
          return { borderTopColor: P == null ? void 0 : P.color };
        }), se = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function pe() {
          se.showIndex !== 0 && (se.showIndex -= 1);
        }
        function de() {
          se.showIndex !== se.showList.length - 1 && (se.showIndex += 1);
        }
        function ye() {
          se.showIndex = 0, se.showList = [], se.valueList = [], y.emit("resultReset");
        }
        function $e(Me) {
          ye(), I("change", Me);
        }
        return Object(t.watch)(function() {
          return w.data;
        }, function(Me) {
          var Ve;
          se.showIndex = 0, se.valueList = (Me == null || (Ve = Me.value) === null || Ve === void 0 ? void 0 : Ve.split("")) || [], se.valueList.length !== 0 ? se.showList = H(se.valueList, 11) : se.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          y.on("keyBoardChange", function(Me) {
            y.emit("updateBound"), se.status = Me, ye();
          }), y.on("getWordsFromServer", function(Me) {
            var Ve = Array.from(new Set(Me.replace(/\s+/g, "").split("")));
            se.valueList = Ve, se.showList = H(Ve, 11);
          });
        }), Object(t.onUnmounted)(function() {
          y.remove("keyBoardChange"), y.remove("getWordsFromServer");
        }), f({ color: P == null ? void 0 : P.color, upper: pe, lower: de, getStyle: K, selectWord: $e }, Object(t.toRefs)(se));
      } });
      e("e66c"), A.render = ae, A.__scopeId = "data-v-02e63132";
      var Q = A, ne = e("bc3a"), U = e.n(ne), xe = 15e3, ve = function(w) {
        U.a.defaults.baseURL = w, U.a.defaults.timeout = xe, U.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ie(w, $, I, P, K, se) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: w.color } }, [Object(t.createVNode)("use", { "xlink:href": w.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Be = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(w) {
        var $ = L(), I = Object(t.computed)(function() {
          return "#icon-".concat(w.iconClass);
        });
        return { color: $ == null ? void 0 : $.color, iconName: I };
      } });
      e("38cd"), Be.render = Ie;
      var Re = Be, Te = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Ee = { class: "hand-write-board" }, Fe = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Qe = Te(function(w, $, I, P, K, se) {
        var pe = Object(t.resolveComponent)("PaintBoard"), de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ee, [Object(t.createVNode)(pe, { lib: w.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Fe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.handBoardOperList, function(ye) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: ye.type, type: ye.type, data: ye.data, isCn: w.isCn, onClick: w.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), B = { class: "paint-board" };
      function R(w, $, I, P, K, se) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", B, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: w.width, height: w.height, onTouchstart: $[1] || ($[1] = function() {
          return w.down && w.down.apply(w, arguments);
        }), onTouchmove: $[2] || ($[2] = function() {
          return w.move && w.move.apply(w, arguments);
        }), onTouchend: $[3] || ($[3] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }), onMousedown: $[4] || ($[4] = function() {
          return w.down && w.down.apply(w, arguments);
        }), onMousemove: $[5] || ($[5] = function() {
          return w.move && w.move.apply(w, arguments);
        }), onMouseup: $[6] || ($[6] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }), onMouseleave: $[7] || ($[7] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function Z(w, $, I, P, K, se, pe) {
        try {
          var de = w[se](pe), ye = de.value;
        } catch ($e) {
          return void I($e);
        }
        de.done ? $(ye) : Promise.resolve(ye).then(P, K);
      }
      function M(w) {
        return function() {
          var $ = this, I = arguments;
          return new Promise(function(P, K) {
            var se = w.apply($, I);
            function pe(ye) {
              Z(se, P, K, pe, de, "next", ye);
            }
            function de(ye) {
              Z(se, P, K, pe, de, "throw", ye);
            }
            pe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var te, ie, we = function() {
        var w = M(regeneratorRuntime.mark(function $(I, P, K, se) {
          return regeneratorRuntime.wrap(function(pe) {
            for (; ; ) switch (pe.prev = pe.next) {
              case 0:
                return pe.next = 2, U.a.post("", { lib: se, lpXis: I, lpYis: P, lpCis: K });
              case 2:
                return pe.abrupt("return", pe.sent);
              case 3:
              case "end":
                return pe.stop();
            }
          }, $);
        }));
        return function($, I, P, K) {
          return w.apply(this, arguments);
        };
      }(), ge = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(w) {
        var $ = L(), I = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), P = Object(t.ref)(null);
        function K() {
          return se.apply(this, arguments);
        }
        function se() {
          return se = M(regeneratorRuntime.mark(function Le() {
            var Ke, De;
            return regeneratorRuntime.wrap(function(Xe) {
              for (; ; ) switch (Xe.prev = Xe.next) {
                case 0:
                  return Xe.next = 2, we(I.clickX, I.clickY, I.clickC, w.lib);
                case 2:
                  Ke = Xe.sent, De = Ke.data, y.emit("getWordsFromServer", (De == null ? void 0 : De.v) || "");
                case 5:
                case "end":
                  return Xe.stop();
              }
            }, Le);
          })), se.apply(this, arguments);
        }
        function pe() {
          P.value && te && (I.clickX = [], I.clickY = [], I.clickC = [], te.clearRect(0, 0, I.width, I.height));
        }
        function de(Le) {
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
        function ye(Le) {
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
          if (te) {
            I.isMouseDown = !0;
            var Ke = de(Le), De = ye(Le);
            clearTimeout(ie), I.oldX = Ke, I.oldY = De, te.beginPath();
          }
        }
        function Me(Le) {
          if (te && (Le.preventDefault(), I.isMouseDown)) {
            var Ke = de(Le), De = ye(Le);
            I.clickX.push(Ke), I.clickY.push(De), I.clickC.push(0), te.strokeStyle = $ == null ? void 0 : $.color, te.fillStyle = $ == null ? void 0 : $.color, te.lineWidth = 4, te.lineCap = "round", te.moveTo(I.oldX, I.oldY), te.lineTo(Ke, De), te.stroke(), I.oldX = Ke, I.oldY = De;
          }
        }
        function Ve() {
          I.isMouseDown && (I.isMouseDown = !1, ie = setTimeout(function() {
            pe();
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
        function pt() {
          var Le;
          te = (Le = P.value) === null || Le === void 0 ? void 0 : Le.getContext("2d"), pe(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          pt(), y.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), y.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(I)), {}, { move: Me, down: $e, mouseup: Ve, canvasRef: P });
      } });
      ge.render = R;
      var ce = ge;
      function G(w, $, I, P, K, se) {
        var pe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(w.type), { "key-board-button-active": w.isUpper && w.type === "upper" || w.isNum && w.type === "change2num" || w.isSymbol && w.type === "#+=" }], style: w.getStyle, onClick: $[1] || ($[1] = function() {
          return w.click && w.click.apply(w, arguments);
        }), onMouseenter: $[2] || ($[2] = function(de) {
          return w.isHoverStatus = !0;
        }), onMouseleave: $[3] || ($[3] = function(de) {
          return w.isHoverStatus = !1;
        }) }, [w.type === "upper" || w.type === "delete" || w.type === "handwrite" || w.type === "close" || w.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(pe, { key: 0, "icon-class": w.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: w.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var N = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Re }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(w, $) {
        var I = $.emit, P = L(), K = Object(t.ref)(!1), se = Object(t.computed)(function() {
          return w.type === "change2lang" ? w.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : w.isUpper ? w.data.toUpperCase() : w.data;
        }), pe = Object(t.computed)(function() {
          return w.isUpper && w.type === "upper" || w.isNum && w.type === "change2num" || w.isSymbol && w.type === "#+=" || K.value ? { color: "#f5f5f5", background: P == null ? void 0 : P.color } : { color: P == null ? void 0 : P.color, background: "#f5f5f5" };
        });
        function de(ye) {
          ye.preventDefault(), I("click", { data: w.isUpper ? w.data.toUpperCase() : w.data, type: w.type });
        }
        return { isHoverStatus: K, getStyle: pe, getCode: se, click: de };
      } });
      e("de23"), N.render = G;
      var re = N, ke = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ce, KeyCodeButton: re }, setup: function(w, $) {
        var I = $.emit, P = L(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function se(pe) {
          var de = pe.data, ye = pe.type;
          switch (ye) {
            case "close":
              P == null || P.closeKeyBoard();
              break;
            case "back":
              P == null || P.changeDefaultBoard(), y.emit("resultReset"), y.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              I("trigger", { data: de, type: ye });
              break;
          }
        }
        return f({ click: se }, Object(t.toRefs)(K));
      } });
      e("9aaf"), ke.render = Qe, ke.__scopeId = "data-v-1b5e0983";
      var We = ke, Ye = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Ze = { class: "default-key-board" }, at = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Ye(function(w, $, I, P, K, se) {
        var pe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ze, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.lineList, function(de, ye) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ye + 1)], key: ye }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(de, function($e) {
            return Object(t.openBlock)(), Object(t.createBlock)(pe, { isUpper: w.isUpper, key: $e, type: $e, data: $e, isSymbol: w.isSymbol, onClick: w.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", at, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.line4, function(de) {
          return Object(t.openBlock)(), Object(t.createBlock)(pe, { key: de.type, type: de.type, data: de.data, isCn: w.isCn, isNum: w.isNum, onClick: w.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ue = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, he = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], oe = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: re }, emits: ["translate", "trigger", "change"], setup: function(w, $) {
        var I = $.emit, P = L(), K = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function se() {
          var de;
          K.line4 = JSON.parse(JSON.stringify(q)), P != null && (de = P.modeList) !== null && de !== void 0 && de.find(function(ye) {
            return ye === "handwrite";
          }) && P !== null && P !== void 0 && P.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function pe(de) {
          var ye = de.data, $e = de.type;
          switch ($e) {
            case "close":
              K.oldVal = "", P == null || P.closeKeyBoard();
              break;
            case "upper":
              K.oldVal = "", K.isUpper = !K.isUpper;
              break;
            case "change2lang":
              K.isCn = !K.isCn, K.isNum || K.isSymbol || y.emit("keyBoardChange", K.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (K.isNum = !K.isNum, K.isSymbol = !1, K.isNum) {
                var Me;
                y.emit("keyBoardChange", "number");
                var Ve = JSON.parse(JSON.stringify(he.line3));
                P != null && (Me = P.modeList) !== null && Me !== void 0 && Me.find(function(ze) {
                  return ze === "symbol";
                }) || (Ve.shift(), Ve.unshift("+")), K.lineList = [he.line1, he.line2, Ve];
              } else y.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (y.emit("keyBoardChange", "symbol"), K.lineList = [ue.line1, ue.line2, ue.line3]) : (y.emit("keyBoardChange", "number"), K.lineList = [he.line1, he.line2, he.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && $e === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), I("translate", K.oldVal)) : ($e === "handwrite" && y.emit("keyBoardChange", "handwrite"), I("trigger", { data: ye, type: $e }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? I("change", ye) : (I("translate", K.oldVal + ye), K.oldVal = K.oldVal + ye);
              break;
          }
        }
        return se(), Object(t.onMounted)(function() {
          y.on("resultReset", function() {
            K.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(K)), {}, { click: pe });
      } });
      e("f8b0"), oe.render = z, oe.__scopeId = "data-v-4b78e5a1";
      var le = oe, me = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ue = e("ec57"), qe = function(w) {
        return w.keys().map(w);
      };
      qe(Ue);
      var et = [], Oe = null, tt = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: S }, components: { Result: Q, SvgIcon: Re, HandBoard: We, DefaultBoard: le }, setup: function(w, $) {
        var I = $.emit, P = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function se(je) {
          var Ce, Ae;
          switch (Object(t.nextTick)(function() {
            y.emit("keyBoardChange", "CN");
          }), je) {
            case "en":
              P.showMode = "default", Object(t.nextTick)(function() {
                var Ne;
                (Ne = K.value) === null || Ne === void 0 || Ne.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              P.showMode = "default", Object(t.nextTick)(function() {
                var Ne;
                (Ne = K.value) === null || Ne === void 0 || Ne.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Ce = w.modeList) !== null && Ce !== void 0 && Ce.find(function(Ne) {
                return Ne === "handwrite";
              }) && w.handApi ? (P.showMode = "handwrite", Object(t.nextTick)(function() {
                y.emit("keyBoardChange", "handwrite");
              })) : P.showMode = "default";
              break;
            case "symbol":
              P.showMode = "default", (Ae = w.modeList) !== null && Ae !== void 0 && Ae.find(function(Ne) {
                return Ne === "symbol";
              }) && Object(t.nextTick)(function() {
                var Ne, nt;
                (Ne = K.value) === null || Ne === void 0 || Ne.click({ data: ".?123", type: "change2num" }), (nt = K.value) === null || nt === void 0 || nt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              P.showMode = "default";
              break;
          }
        }
        function pe(je) {
          if (P.visible = !0, Oe = je.target, se(Oe.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Ce = document.querySelector(".key-board-modal");
            Ce.style.display = "block";
          }
        }
        function de() {
          if (Oe && Oe.blur(), Oe = null, P.visible = !1, I("closed"), P.showMode = "default", P.resultVal = {}, document.querySelector(".key-board-modal")) {
            var je = document.querySelector(".key-board-modal");
            je.style.display = "none";
          }
        }
        function ye() {
          w.closeOnClickModal && de(), I("modalClick");
        }
        function $e() {
          var je;
          if (document.querySelector(".key-board-modal")) {
            var Ce;
            (Ce = document.querySelector(".key-board-modal")) === null || Ce === void 0 || Ce.addEventListener("click", ye);
          } else {
            var Ae = document.createElement("div");
            Ae.className = "key-board-modal", Ae.style.display = "none", (je = document.querySelector("body")) === null || je === void 0 || je.appendChild(Ae), Ae.addEventListener("click", ye);
          }
        }
        function Me() {
          w.handApi && ve(w.handApi), [].concat(b(document.querySelectorAll("input")), b(document.querySelectorAll("textarea"))).forEach(function(je) {
            je.getAttribute("data-mode") !== null && (et.push(je), je.addEventListener("focus", pe), w.blurHide && je.addEventListener("blur", de));
          });
        }
        function Ve(je) {
          if (!Oe) return "";
          var Ce = Oe, Ae = Ce.selectionStart, Ne = Ce.selectionEnd;
          if (!Ae || !Ne) return "";
          var nt = je.substring(0, Ae - 1) + je.substring(Ne);
          return Ce.value = nt, Ce.focus(), Ce.selectionStart = Ae - 1, Ce.selectionEnd = Ae - 1, nt;
        }
        function ze(je) {
          var Ce = je.type;
          switch (Ce) {
            case "handwrite":
              P.showMode = "handwrite";
              break;
            case "delete":
              if (!Oe) return;
              var Ae = Ve(Oe.value);
              Oe.value = Ae, I("change", Ae, Oe.getAttribute("data-prop") || Oe);
              break;
          }
        }
        function pt(je, Ce) {
          if (!Oe) return "";
          var Ae = Oe, Ne = Ae.selectionStart || 0, nt = Ae.selectionEnd || 0, kt = je.substring(0, Ne) + Ce + je.substring(nt);
          return Ae.value = kt, Ae.focus(), Ae.selectionStart = Ne + Ce.length, Ae.selectionEnd = Ne + Ce.length, kt;
        }
        function Le(je) {
          if (Oe) {
            var Ce = pt(Oe.value, je);
            Oe.value = Ce, I("change", Ce, Oe.getAttribute("data-prop") || Oe), I("keyChange", je, Oe.getAttribute("data-prop") || Oe);
          }
        }
        function Ke(je) {
          var Ce = new RegExp("^".concat(je, "\\w*")), Ae = Object.keys(me).filter(function(Ne) {
            return Ce.test(Ne);
          }).sort();
          P.resultVal = { code: je, value: je ? Ae.length > 1 ? Ae.reduce(function(Ne, nt) {
            return Ne + me[nt];
          }, "") : me[Ae[0]] : "" }, Oe && I("keyChange", je, Oe.getAttribute("data-prop") || Oe);
        }
        function De() {
          Me();
        }
        function Xe() {
          return Oe;
        }
        return Object(t.onMounted)(function() {
          w.modal && $e(), Me(), y.on("resultReset", function() {
            P.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var je;
          (je = document.querySelector(".key-board-modal")) === null || je === void 0 || je.removeEventListener("click", ye), et.forEach(function(Ce) {
            Ce.removeEventListener("focus", pe), Ce.removeEventListener("blur", de);
          });
        }), V(Object(t.reactive)({ color: w.color, modeList: w.modeList, handApi: w.handApi, closeKeyBoard: function() {
          de();
        }, changeDefaultBoard: function() {
          P.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(P)), {}, { defaultBoardRef: K, getCurrentInput: Xe, translate: Ke, reSignUp: De, trigger: ze, change: Le });
      } });
      tt.render = i;
      var He = tt;
      He.install = function(w) {
        w.component(He.name, He);
      };
      var gt = He, Pt = gt;
      d.default = Pt;
    }, fb6a: function(a, d, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), s = e("fc6a"), i = e("8418"), l = e("b622"), c = e("1dde"), f = c("slice"), h = l("species"), v = [].slice, m = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(p, g) {
        var b, j, C, x = s(this), _ = u(x.length), y = t(p, _), O = t(g === void 0 ? _ : g, _);
        if (o(x) && (b = x.constructor, typeof b != "function" || b !== Array && !o(b.prototype) ? r(b) && (b = b[h], b === null && (b = void 0)) : b = void 0, b === Array || b === void 0)) return v.call(x, y, O);
        for (j = new (b === void 0 ? Array : b)(m(O - y, 0)), C = 0; y < O; y++, C++) y in x && i(j, C, x[y]);
        return j.length = C, j;
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
var kr = Lt.exports;
const At = /* @__PURE__ */ xr(kr);
Bt({
  components: { KeyBoard: At },
  setup() {
    function be(ee, X) {
      console.log("change value ---->", ee), console.log("change input dom ---->", X);
    }
    return {
      change: be
    };
  }
});
const _r = { class: "wifi-component" }, Sr = { class: "row" }, Or = { class: "column" }, jr = { class: "column" }, Er = { class: "status" }, Cr = { class: "row" }, Tr = { class: "column" }, Lr = {
  key: 0,
  class: "wifi-modal"
}, Ar = { class: "wifi-modal-content" }, Pr = { class: "wifi-list" }, Ir = {
  key: 0,
  class: "no-wifi"
}, Nr = ["onClick"], Br = { class: "wifi-ssid" }, Rr = { class: "signal-strength" }, $r = {
  __name: "WiFi",
  setup(be) {
    const { sendToPyQt: ee } = Je(), X = J("未连接"), a = J("无网络"), d = J("未知"), e = J(""), n = J(""), r = J(!1), o = J([]), t = J(null), u = () => {
      ee("check_wifi_status", {});
    }, s = () => {
      t.value = setInterval(u, 5e3);
    }, i = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    ft(() => {
      s();
      const { message: p } = Je();
      rt(p, (g) => {
        if (g && g.type === "wifi_list") {
          const b = JSON.parse(g.content);
          o.value = b;
        } else if (g && g.type === "wifi_status") {
          const b = JSON.parse(g.content);
          X.value = b.wifi_name, a.value = b.internet_status, d.value = b.zerotier_ip;
        }
      });
    }), xt(() => {
      i();
    });
    const l = async () => {
      r.value = !0, o.value = [], document.body.style.overflow = "hidden", c();
    }, c = () => {
      o.value = [], ee("search_wifi", {});
    }, f = () => {
      r.value = !1, document.body.style.overflow = "auto";
    }, h = (p) => {
      e.value = p.ssid, f();
    }, v = () => {
      ee("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, m = (p, g) => {
      g.placeholder === "WiFi 名称" ? e.value = p : g.placeholder === "WiFi 密码" && (n.value = p);
    };
    return (p, g) => (_e(), Se("div", _r, [
      E("div", Sr, [
        E("div", Or, [
          lt(E("input", {
            "onUpdate:modelValue": g[0] || (g[0] = (b) => e.value = b),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, e.value]
          ])
        ]),
        E("div", jr, [
          E("div", Er, [
            dt(" WiFi: " + Pe(X.value) + " | 网络: " + Pe(a.value) + " ", 1),
            g[2] || (g[2] = E("br", null, null, -1)),
            dt(" zerotier ip地址: " + Pe(d.value), 1)
          ])
        ])
      ]),
      E("div", Cr, [
        E("div", Tr, [
          lt(E("input", {
            "onUpdate:modelValue": g[1] || (g[1] = (b) => n.value = b),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, n.value]
          ])
        ]),
        E("div", { class: "column" }, [
          E("div", { class: "button-group" }, [
            E("button", { onClick: l }, "搜索可用 WiFi"),
            E("button", { onClick: v }, "连接 WiFi")
          ])
        ])
      ]),
      Ge(Rt(At), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: m,
        class: "scaled-keyboard"
      }),
      r.value ? (_e(), Se("div", Lr, [
        E("div", Ar, [
          g[4] || (g[4] = E("h2", null, "可用的WiFi网络", -1)),
          E("div", Pr, [
            o.value.length === 0 ? (_e(), Se("div", Ir, g[3] || (g[3] = [
              E("div", { class: "loading-spinner" }, null, -1),
              E("div", null, "搜索中...", -1)
            ]))) : (_e(!0), Se(ot, { key: 1 }, it(o.value, (b) => (_e(), Se("div", {
              key: b.ssid,
              class: "wifi-item",
              onClick: (j) => h(b)
            }, [
              E("span", Br, Pe(b.ssid), 1),
              E("span", Rr, "信号强度: " + Pe(b.signal), 1)
            ], 8, Nr))), 128))
          ]),
          E("div", { class: "modal-buttons" }, [
            E("button", { onClick: c }, "重新搜索"),
            E("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : ut("", !0)
    ]));
  }
}, Ur = /* @__PURE__ */ st($r, [["__scopeId", "data-v-e6b1dc64"]]), Mr = {
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
    const X = be, a = ee, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = J("");
    rt(() => X.showKeyboard, (r) => {
      r && (e.value = X.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (a("update:modelValue", e.value), a("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (_e(), Se("div", Mr, [
      E("div", Dr, [
        E("div", Fr, Pe(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (u) => (_e(), Se("button", {
            key: u,
            onClick: (s) => n(u),
            class: ct({ "function-key": u === "清除" || u === "确定" })
          }, Pe(u), 11, Vr))), 128))
        ]))), 128))
      ])
    ])) : ut("", !0);
  }
}, St = /* @__PURE__ */ st(Wr, [["__scopeId", "data-v-2ccc1cb7"]]), qr = { class: "container" }, zr = { class: "column" }, Kr = { class: "status-bar" }, Qr = ["disabled"], Hr = { class: "column" }, Gr = {
  key: 0,
  class: "modal"
}, Jr = { class: "modal-content" }, Yr = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(be, { emit: ee }) {
    const { sendToPyQt: X } = Je(), a = mt({
      isPyQtWebEngine: !1
    }), d = J("未激活"), e = J(0), n = J(""), r = J(""), o = J(!1), t = J(7776e3);
    let u, s;
    const i = J(0), l = J(1), c = J(null), f = J(!1), h = J(!1), v = ht(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${l.value} 次锁定 - 剩余时间: ${m.value}`), m = ht(() => {
      const H = Math.floor(e.value / 86400), W = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), V = Math.floor(e.value % (60 * 60) / 60), L = e.value % 60;
      return `${H}天 ${W.toString().padStart(2, "0")}:${V.toString().padStart(2, "0")}:${L.toString().padStart(2, "0")}`;
    }), p = ht(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function g(H) {
      d.value === "未激活" && (H.target.setPointerCapture(H.pointerId), i.value = 0, s = setInterval(() => {
        i.value += 2, i.value >= 100 && (clearInterval(s), C());
      }, 30));
    }
    function b(H) {
      H.target.releasePointerCapture(H.pointerId), j();
    }
    function j() {
      clearInterval(s), i.value = 0;
    }
    function C() {
      X("activate_device", {});
    }
    function x(H, W) {
      X("Lock_set_response", { method: "activateDevice", args: { randomCode: H, time: W } }), d.value = "已激活", n.value = H, c.value = W, _();
    }
    function _() {
      y(), u = setInterval(() => {
        e.value > 0 ? y() : O();
      }, 1e3);
    }
    function y() {
      const H = Date.now(), W = c.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((W - H) / 1e3));
    }
    function O() {
      o.value = !0, document.body.style.overflow = "hidden", clearInterval(u), ae();
    }
    function S() {
      T(r.value);
    }
    function T(H) {
      X("check_lock_password", {
        target: "attemptUnlock",
        password: H,
        lockCount: l.value,
        deviceRandomCode: n.value
      }), r.value = "";
    }
    function k() {
      d.value = "永久激活", o.value = !1, document.body.style.overflow = "auto", clearInterval(u);
    }
    function D() {
      o.value = !1, document.body.style.overflow = "auto", l.value++, u && clearInterval(u), _();
    }
    xt(() => {
      clearInterval(u), clearInterval(s);
    }), ft(() => {
      if (a.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, a.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = Je();
        rt(H, (W) => {
          if (W && W.type === "confirm_lock_password")
            try {
              const V = JSON.parse(W.content);
              V.target === "attemptUnlock" && (V.result === "success" ? (o.value ? c.value = Date.now() : c.value = c.value + t.value * 1e3, X("update_baseTime", c.value), D(), X("Lock_set_response", { method: "extendLockTime", args: { baseTime: c.value } })) : V.result === "forever_success" ? (k(), X("Lock_set_response", { method: "permanentUnlock", args: {} })) : X("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (V) {
              console.error("Failed to parse confirm lock password :", V);
            }
          else if (W && W.type === "device_activated")
            try {
              const V = JSON.parse(W.content);
              x(V.device_random_code, V.device_base_time);
            } catch (V) {
              console.error("Failed to parse device activation result:", V);
            }
          else if (W && W.type === "device_info")
            try {
              const V = JSON.parse(W.content);
              d.value = V.device_status, n.value = V.device_random_code, l.value = V.device_lock_count, c.value = V.device_base_time, V.device_status === "已激活" ? _() : V.device_status === "永久激活" && k();
            } catch (V) {
              console.error("Failed to parse device status:", V);
            }
          else if (W && W.type === "Lock_init")
            F();
          else if (W && W.type === "Lock_set") {
            console.log("Lock_set:", W.content);
            const V = JSON.parse(W.content);
            V.method === "requestActivation" ? C() : V.method === "attemptUnlock" && T(V.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const F = () => {
      const H = {
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
      console.log("Sending Lock initial state:", H), X("Lock_init_response", H);
    }, Y = ee, ae = () => {
      Y("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (H, W) => (_e(), Se("div", qr, [
      E("div", zr, [
        E("div", Kr, Pe(v.value), 1),
        E("button", {
          class: "activation-button",
          onPointerdown: g,
          onPointerup: b,
          onPointercancel: j,
          onPointerleave: j,
          disabled: d.value !== "未激活"
        }, [
          dt(Pe(p.value) + " ", 1),
          E("div", {
            class: "progress-bar",
            style: Ot({ width: i.value + "%" })
          }, null, 4)
        ], 40, Qr)
      ]),
      E("div", Hr, [
        lt(E("input", {
          "onUpdate:modelValue": W[0] || (W[0] = (V) => r.value = V),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: W[1] || (W[1] = (V) => f.value = !0)
        }, null, 544), [
          [vt, r.value]
        ]),
        E("button", {
          class: "unlock-button",
          onClick: S
        }, "解锁")
      ]),
      o.value ? (_e(), Se("div", Gr, [
        E("div", Jr, [
          W[8] || (W[8] = E("h3", null, "设备已锁定", -1)),
          E("h3", null, "第 " + Pe(l.value) + " 次锁定", 1),
          E("h3", null, "设备随机码: " + Pe(n.value), 1),
          lt(E("input", {
            "onUpdate:modelValue": W[2] || (W[2] = (V) => r.value = V),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: W[3] || (W[3] = (V) => h.value = !0)
          }, null, 544), [
            [vt, r.value]
          ]),
          E("button", {
            class: "unlock-button",
            onClick: S
          }, "解锁")
        ])
      ])) : ut("", !0),
      Ge(St, {
        modelValue: r.value,
        "onUpdate:modelValue": W[4] || (W[4] = (V) => r.value = V),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": W[5] || (W[5] = (V) => f.value = V)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Ge(St, {
        modelValue: r.value,
        "onUpdate:modelValue": W[6] || (W[6] = (V) => r.value = V),
        showKeyboard: h.value,
        "onUpdate:showKeyboard": W[7] || (W[7] = (V) => h.value = V)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Xr = /* @__PURE__ */ st(Yr, [["__scopeId", "data-v-3d3fd364"]]), Zr = { class: "app-container" }, to = {
  __name: "App",
  setup(be) {
    Ut();
    const ee = J(""), X = (a) => {
      ee.value = a;
    };
    return (a, d) => (_e(), Se("div", Zr, [
      d[0] || (d[0] = E("h1", null, "涪特智能养护台车控制系统", -1)),
      Ge(Bn),
      Ge(br),
      Ge(un),
      Ge(sr, { message: ee.value }, null, 8, ["message"]),
      Ge(Ur),
      Ge(Xr, { onMessageFromA: X })
    ]));
  }
};
export {
  to as default
};
