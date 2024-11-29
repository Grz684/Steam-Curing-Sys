import It, { ref as G, onMounted as ft, provide as yt, readonly as bt, inject as wt, watch as rt, openBlock as _e, createElementBlock as Se, createElementVNode as E, toDisplayString as Te, Fragment as ot, renderList as it, normalizeClass as ut, createCommentVNode as st, reactive as mt, createVNode as Je, withDirectives as lt, vModelRadio as _t, createTextVNode as dt, vModelText as vt, onUnmounted as xt, computed as ht, normalizeStyle as Ot, vModelCheckbox as Nt, defineComponent as Bt, unref as Rt } from "vue";
const jt = Symbol(), Et = Symbol(), Ct = Symbol();
function $t(we, ee) {
  we && we.messageSignal ? we.messageSignal.connect((Z) => {
    try {
      const i = JSON.parse(Z);
      ee.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), ee.value = { type: "unknown", content: Z };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Ut() {
  const we = G(null), ee = G(null), Z = G("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      we.value = d, ee.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), $t(ee.value, Z), ee.value && typeof ee.value.vueReady == "function" ? ee.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ft(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), yt(jt, bt(we)), yt(Et, bt(ee)), yt(Ct, bt(Z));
}
function Ye() {
  const we = wt(jt), ee = wt(Et), Z = wt(Ct);
  return (!we || !ee || !Z) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: we,
    bridge: ee,
    message: Z,
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
const ct = (we, ee) => {
  const Z = we.__vccOpts || we;
  for (const [i, d] of ee)
    Z[i] = d;
  return Z;
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
  setup(we, { emit: ee }) {
    const Z = we, i = ee, d = G([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = G("");
    rt(() => Z.showKeyboard, (r) => {
      r && (e.value = Z.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => we.showKeyboard ? (_e(), Se("div", Mt, [
      E("div", Dt, [
        E("div", Ft, Te(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (u) => (_e(), Se("button", {
            key: u,
            onClick: (s) => n(u),
            class: ut({ "function-key": u === "清除" || u === "确定" })
          }, Te(u), 11, Vt))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, Tt = /* @__PURE__ */ ct(Wt, [["__scopeId", "data-v-541feda2"]]), qt = { class: "settings-container" }, zt = { class: "setting-group" }, Kt = { class: "setting-item" }, Qt = { class: "setting-controls" }, Ht = ["value"], Gt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Yt = ["value"], Xt = { class: "setting-group" }, Zt = { class: "setting-item" }, en = { class: "setting-controls" }, tn = ["value"], nn = { class: "setting-item" }, rn = { class: "setting-controls" }, on = ["value"], an = {
  __name: "SensorSettings",
  setup(we) {
    const { sendToPyQt: ee } = Ye(), Z = mt({
      isPyQtWebEngine: !1
    }), i = G(35), d = G(25), e = G(95), n = G(90), r = G(!1), o = G(null), t = G("");
    ft(() => {
      if (Z.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, Z.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = Ye();
        rt(g, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const v = JSON.parse(p.content);
              i.value = v.temp_upper, d.value = v.temp_lower, e.value = v.humidity_upper, n.value = v.humidity_lower, console.log("Sensor Settings updated:", v);
            } catch (v) {
              console.error("Failed to parse sensor settings data:", v);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), c();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const h = JSON.parse(p.content).args;
            i.value = h.temp_upper, d.value = h.temp_lower, e.value = h.humidity_upper, n.value = h.humidity_lower, c();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const u = (g, p) => {
      const v = g === "tempUpper" ? i : g === "tempLower" ? d : g === "humidityUpper" ? e : n;
      v.value = (v.value || 0) + p, g.startsWith("temp") ? s(g === "tempUpper" ? "upper" : "lower") : a(g === "humidityUpper" ? "upper" : "lower");
    }, s = (g) => {
      i.value === "" && (i.value = d.value + 1), d.value === "" && (d.value = i.value - 1), g === "upper" ? i.value = Math.max(d.value + 1, i.value) : d.value = Math.min(i.value - 1, d.value), c();
    }, a = (g) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), g === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), c();
    }, c = () => {
      if (i.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const g = {
          temp_upper: i.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", g), Z.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ee("updateLimitSettings", g)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (g) => {
      o.value = g, r.value = !0, t.value = g.startsWith("temp") ? g === "tempUpper" ? i.value : d.value : g === "humidityUpper" ? e.value : n.value;
    }, f = (g) => {
      const p = parseFloat(g);
      isNaN(p) || (o.value === "tempUpper" ? (i.value = p, s("upper")) : o.value === "tempLower" ? (d.value = p, s("lower")) : o.value === "humidityUpper" ? (e.value = p, a("upper")) : o.value === "humidityLower" && (n.value = p, a("lower"))), o.value = null;
    };
    return (g, p) => (_e(), Se("div", qt, [
      E("div", zt, [
        p[15] || (p[15] = E("h2", null, "温度设置 (°C)", -1)),
        E("div", Kt, [
          p[13] || (p[13] = E("span", { class: "setting-label" }, "上限：", -1)),
          E("div", Qt, [
            E("button", {
              onClick: p[0] || (p[0] = (v) => u("tempUpper", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: i.value,
              onFocus: p[1] || (p[1] = (v) => l("tempUpper")),
              readonly: ""
            }, null, 40, Ht),
            E("button", {
              onClick: p[2] || (p[2] = (v) => u("tempUpper", 1))
            }, "+")
          ])
        ]),
        E("div", Gt, [
          p[14] || (p[14] = E("span", { class: "setting-label" }, "下限：", -1)),
          E("div", Jt, [
            E("button", {
              onClick: p[3] || (p[3] = (v) => u("tempLower", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (v) => l("tempLower")),
              readonly: ""
            }, null, 40, Yt),
            E("button", {
              onClick: p[5] || (p[5] = (v) => u("tempLower", 1))
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
              onClick: p[6] || (p[6] = (v) => u("humidityUpper", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => l("humidityUpper")),
              readonly: ""
            }, null, 40, tn),
            E("button", {
              onClick: p[8] || (p[8] = (v) => u("humidityUpper", 1))
            }, "+")
          ])
        ]),
        E("div", nn, [
          p[17] || (p[17] = E("span", { class: "setting-label" }, "下限：", -1)),
          E("div", rn, [
            E("button", {
              onClick: p[9] || (p[9] = (v) => u("humidityLower", -1))
            }, "-"),
            E("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => l("humidityLower")),
              readonly: ""
            }, null, 40, on),
            E("button", {
              onClick: p[11] || (p[11] = (v) => u("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Je(Tt, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": p[12] || (p[12] = (v) => r.value = v)
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
  setup(we, { emit: ee }) {
    const Z = we, i = ee, d = G([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = G("");
    rt(() => Z.showKeyboard, (r) => {
      r && (e.value = Z.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : r === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : r === "." && e.value.includes(".") || (e.value += r);
    };
    return (r, o) => we.showKeyboard ? (_e(), Se("div", sn, [
      E("div", cn, [
        E("div", ln, Te(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (u) => (_e(), Se("button", {
            key: u,
            onClick: (s) => n(u),
            class: ut({
              "function-key": ["清除", "确定"].includes(u),
              "operator-key": u === "-"
            })
          }, Te(u), 11, dn))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, pn = /* @__PURE__ */ ct(fn, [["__scopeId", "data-v-3e928534"]]), vn = { class: "sensor-data-group" }, hn = { class: "sensor-section" }, mn = { class: "sensor-container" }, gn = { class: "sensor-grid" }, yn = ["onClick"], bn = { class: "sensor-title" }, wn = { class: "sensor-value" }, xn = { class: "sensor-section" }, kn = { class: "sensor-container" }, _n = { class: "sensor-grid" }, Sn = ["onClick"], On = { class: "sensor-title" }, jn = { class: "sensor-value" }, En = {
  key: 0,
  class: "dialog-overlay"
}, Cn = { class: "dialog" }, Tn = { class: "dialog-content" }, Ln = { class: "radio-group" }, An = { class: "input-group" }, Pn = ["placeholder"], In = { class: "dialog-actions" }, Nn = {
  __name: "SensorDisplay",
  setup(we) {
    const ee = G({ temperature: {}, humidity: {} }), Z = G({
      temperature: {},
      humidity: {}
    }), i = G(null), d = G(!1), e = G("offset"), n = G(""), r = G(!1), { sendToPyQt: o } = Ye();
    ft(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: l } = Ye();
        rt(l, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              ee.value = JSON.parse(f.content);
            } catch (g) {
              console.error("Failed to parse sensor data:", g);
            }
          else if (f && f.type === "update_adjust_settings")
            try {
              const g = JSON.parse(f.content);
              Z.value.temperature = g.temperature, Z.value.humidity = g.humidity;
            } catch (g) {
              console.error("Failed to parse adjustments data:", g);
            }
          else f && f.type === "get_sensor_data" ? o("update_remote_sensor_data", ee.value) : f && f.type === "sensor_debug_mode" && (r.value = JSON.parse(f.content));
        });
      } else
        console.log("在普通网页环境中执行"), t(), setInterval(t, 5e3);
    });
    const t = async () => {
      try {
        const l = await fetch("http://localhost:8000/api/sensor-data/");
        if (!l.ok)
          throw new Error(`HTTP error! status: ${l.status}`);
        const f = await l.json();
        ee.value = f;
      } catch (l) {
        console.error("Error fetching sensor data:", l);
      }
    }, u = G(!1), s = G(""), a = (l, f) => {
      i.value = f, n.value = l;
      const g = Z.value[l][f];
      g ? (e.value = g.type, s.value = String(g.value)) : (e.value = "offset", s.value = ""), d.value = !0, u.value = !1;
    }, c = async () => {
      try {
        const l = {
          sensorType: n.value,
          sensorId: i.value,
          adjustmentType: e.value,
          value: parseFloat(s.value) || 0
        };
        Z.value[n.value] || (Z.value[n.value] = {}), Z.value[n.value][i.value] = {
          type: e.value,
          value: parseFloat(s.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && o("adjust_sensor", l), d.value = !1, s.value = "", u.value = !1;
      } catch (l) {
        console.error("Error applying adjustment:", l);
      }
    };
    return (l, f) => (_e(), Se("div", vn, [
      E("div", hn, [
        f[7] || (f[7] = E("h2", null, "温度传感器", -1)),
        E("div", mn, [
          E("div", gn, [
            (_e(!0), Se(ot, null, it(ee.value.temperature, (g, p) => (_e(), Se("div", {
              key: p,
              class: "sensor-card",
              onClick: (v) => r.value ? a("temperature", p) : null
            }, [
              E("div", bn, Te(p), 1),
              E("div", wn, Te(g), 1)
            ], 8, yn))), 128))
          ])
        ])
      ]),
      E("div", xn, [
        f[8] || (f[8] = E("h2", null, "湿度传感器", -1)),
        E("div", kn, [
          E("div", _n, [
            (_e(!0), Se(ot, null, it(ee.value.humidity, (g, p) => (_e(), Se("div", {
              key: p,
              class: "sensor-card",
              onClick: (v) => r.value ? a("humidity", p) : null
            }, [
              E("div", On, Te(p), 1),
              E("div", jn, Te(g), 1)
            ], 8, Sn))), 128))
          ])
        ])
      ]),
      d.value ? (_e(), Se("div", En, [
        E("div", Cn, [
          E("h3", null, "调整传感器: " + Te(i.value), 1),
          E("div", Tn, [
            E("div", Ln, [
              E("label", null, [
                lt(E("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (g) => e.value = g),
                  value: "offset"
                }, null, 512), [
                  [_t, e.value]
                ]),
                f[9] || (f[9] = dt(" 调整偏移值 "))
              ]),
              E("label", null, [
                lt(E("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (g) => e.value = g),
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
                "onUpdate:modelValue": f[2] || (f[2] = (g) => s.value = g),
                readonly: "",
                onClick: f[3] || (f[3] = (g) => u.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Pn), [
                [vt, s.value]
              ])
            ])
          ]),
          E("div", In, [
            E("button", {
              onClick: f[4] || (f[4] = (g) => d.value = !1)
            }, "取消"),
            E("button", {
              onClick: c,
              class: "primary"
            }, "确定")
          ])
        ]),
        Je(pn, {
          modelValue: s.value,
          "onUpdate:modelValue": f[5] || (f[5] = (g) => s.value = g),
          showKeyboard: u.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (g) => u.value = g)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : st("", !0)
    ]));
  }
}, Bn = /* @__PURE__ */ ct(Nn, [["__scopeId", "data-v-74245031"]]), Rn = { class: "integrated-control-system" }, $n = { class: "mode-controls" }, Un = ["disabled"], Mn = ["disabled"], Dn = { class: "systems-container" }, Fn = { class: "steam-engine-control left-box" }, Vn = { class: "steam_engine" }, Wn = ["disabled"], qn = { class: "steam_engine" }, zn = ["disabled"], Kn = { class: "sprinkler-system middle-box" }, Qn = { class: "spray-container" }, Hn = { class: "control-row" }, Gn = { class: "sprinkler-section" }, Jn = { class: "visualization" }, Yn = ["onClick"], Xn = { class: "ato_engine" }, Zn = ["disabled"], er = { class: "text_status" }, tr = { class: "time-control right-box" }, nr = { class: "controls" }, rr = { class: "input-group" }, or = ["value"], ir = { class: "input-group" }, ar = ["value"], ur = { class: "input-group" }, sr = ["value"], cr = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(we) {
    const ee = G(!1), Z = G(!1), i = G(!1), d = G(10), e = G(0), n = G(10), r = G(d.value), o = G(e.value), t = G(n.value), u = G(d.value), s = G(e.value), a = G(n.value), c = G(0), l = G(""), f = G(Array(12).fill(0)), g = G(0), p = G(!0), v = G(!1), h = G(!1), m = G(null), y = G(""), j = G(!1), C = G(15), x = G(""), S = G(""), b = G(0), { sendToPyQt: w } = Ye(), O = G(0), T = mt({
      isPyQtWebEngine: !1
    }), _ = G([]);
    let R, D, J;
    const ie = we;
    rt(() => ie.message, (Y) => {
      Y != null && Y.content && (p.value ? z("manual") : z("auto"));
    }), ft(() => {
      if (T.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, T.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: Y } = Ye();
        rt(Y, (W) => {
          if (W && W.type === "update_spray_engine_status")
            ee.value = W.content;
          else if (W && W.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), M();
          else if (W && W.type === "update_left_steam_status")
            Z.value = W.content;
          else if (W && W.type === "update_right_steam_status")
            i.value = W.content;
          else if (W && W.type === "update_sprinkler_settings")
            try {
              const se = JSON.parse(W.content);
              u.value = se.sprinkler_single_run_time, s.value = se.sprinkler_run_interval_time, a.value = se.sprinkler_loop_interval, o.value = s.value, r.value = u.value, t.value = a.value, console.log("Sprinkler Settings updated:", se);
            } catch (se) {
              console.error("Failed to parse sprinkler settings data:", se);
            }
          else if (W && W.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", W.content);
            const We = JSON.parse(W.content).args;
            u.value = We.sprinkler_single_run_time, s.value = We.sprinkler_run_interval_time, a.value = We.sprinkler_loop_interval, o.value = s.value, r.value = u.value, t.value = a.value, N();
          } else if (W && W.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", W.content);
            const se = JSON.parse(W.content);
            se.method === "startSystem" ? B() : se.method === "stopSystem" ? X() : se.method === "setMode" ? z(se.args.mode) : se.method === "click_toggleEngine" ? ve() : se.method === "click_toggleSteamEngine" ? Pe() : se.method === "toggleManualSprinkler" && Re(se.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), xt(() => {
      clearInterval(J), clearInterval(D), V();
    });
    const H = (Y) => {
      Y !== void 0 && clearTimeout(Y);
    }, V = () => {
      _.value.forEach((Y) => {
        H(Y);
      }), _.value = [];
    }, M = () => {
      const Y = {
        leftEngineOn: ee.value,
        rightEngineOn: Z.value,
        currentSingleRunTime: d.value,
        currentRunIntervalTime: e.value,
        currentLoopInterval: n.value,
        nextSingleRunTime: r.value,
        nextRunIntervalTime: o.value,
        nextLoopInterval: t.value,
        tempSingleRunTime: u.value,
        tempRunIntervalTime: s.value,
        tempLoopInterval: a.value,
        activeSprinkler: c.value,
        currentPhase: l.value,
        waterLevels: f.value,
        remainingTime: g.value,
        isAutoMode: p.value,
        isRunning: v.value,
        isSwitching: j.value,
        switchingTime: C.value,
        switchingMessage: x.value,
        switchPhase: S.value,
        phaseStartTime: O.value,
        chose_n: b.value
      };
      w("IntegratedControlSystem_init_response", Y);
    }, L = ht(() => j.value ? `${x.value}，还需${C.value}秒` : p.value ? v.value ? l.value === "run" ? `喷头 ${c.value} 正在运行，剩余 ${g.value + 1} 秒` : l.value === "interval" ? `运行间隔中，剩余 ${g.value + 1} 秒` : l.value === "loop" ? `循环间隔中，剩余 ${g.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    async function A(Y, W) {
      return S.value = W, j.value = !0, C.value = 15, O.value = Date.now(), x.value = Y ? "正在切换到喷淋管" : "正在切换到喷雾机", w("controlSprinkler", { target: "switchToSprinkler", state: Y }), J = setInterval(() => {
        C.value--, C.value <= 0 && (clearInterval(J), j.value = !1);
      }, 1e3), new Promise((se) => {
        R = setTimeout(() => {
          j.value = !1, se();
        }, C.value * 1e3), _.value.push(R);
      });
    }
    async function z(Y) {
      const W = p.value;
      if (p.value = Y === "auto", W !== p.value)
        if (T.isPyQtWebEngine && (w("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: Y } }), w("controlSprinkler", { target: "setMode", mode: p.value ? "auto" : "manual" })), p.value) {
          clearInterval(J), V(), j.value = !1, ee.value && await te(), Z.value && await U(), i.value && await xe();
          const se = f.value.findIndex((We) => We === 100);
          se !== -1 && (f.value[se] = 0, T.isPyQtWebEngine && w("controlSprinkler", { target: "manual_control_sprayer", index: se + 1, state: 0 })), w("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await X();
    }
    async function te() {
      T.isPyQtWebEngine && (w("setEngineState", { engine: "sprayEngine", state: !ee.value }), ee.value = !ee.value);
    }
    async function U() {
      T.isPyQtWebEngine && (w("setEngineState", { engine: "leftSteamEngine", state: !Z.value }), Z.value = !Z.value);
    }
    async function xe() {
      T.isPyQtWebEngine && (w("setEngineState", { engine: "rightSteamEngine", state: !i.value }), i.value = !i.value);
    }
    async function ve() {
      const Y = f.value.findIndex((W) => W === 100);
      T.isPyQtWebEngine && Y === -1 && (w("IntegratedControlSystem_set_response", { method: "click_toggleSprayEngine", args: {} }), ee.value ? w("controlSprinkler", { target: "tankWork", state: 0 }) : (await A(0, "click_toggleEngine"), w("controlSprinkler", { target: "tankWork", state: 1 })), w("setEngineState", { engine: "sprayEngine", state: !ee.value }), ee.value = !ee.value);
    }
    async function Pe() {
      T.isPyQtWebEngine && (w("IntegratedControlSystem_set_response", { method: "click_toggleLeftSteamEngine", args: {} }), w("setEngineState", { engine: "leftSteamEngine", state: !Z.value }), Z.value = !Z.value);
    }
    async function Ue() {
      T.isPyQtWebEngine && (w("IntegratedControlSystem_set_response", { method: "click_toggleRightSteamEngine", args: {} }), w("setEngineState", { engine: "rightSteamEngine", state: !i.value }), i.value = !i.value);
    }
    function Be(Y) {
      m.value = Y, h.value = !0, y.value = Y === "singleRunTime" ? u.value.toString() : Y === "runIntervalTime" ? s.value.toString() : a.value.toString();
    }
    function Le(Y) {
      const W = parseInt(Y);
      isNaN(W) || (m.value === "singleRunTime" ? (u.value = W, Ae()) : m.value === "runIntervalTime" ? (s.value = W, ze()) : m.value === "loopInterval" && (a.value = W, Xe())), m.value = null;
    }
    function Ae() {
      u.value = Math.max(1, u.value), r.value = u.value, N();
    }
    function ze() {
      s.value = Math.max(0, s.value), o.value = s.value, N();
    }
    function Xe() {
      a.value = Math.max(0, a.value), t.value = a.value, N();
    }
    function N() {
      if (T.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const Y = {
          sprinkler_single_run_time: r.value,
          sprinkler_run_interval_time: o.value,
          sprinkler_loop_interval: t.value
        };
        w("controlSprinkler", { target: "settings", settings: JSON.stringify(Y) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function B() {
      w("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(v.value || !p.value) && (v.value = !0, f.value = Array(12).fill(0), await ne());
    }
    async function X() {
      w("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), T.isPyQtWebEngine && (c.value > 0 && w("controlSprinkler", { target: "auto_control_sprayer", index: c.value, state: 0 }), w("controlSprinkler", { target: "setState", state: !1 })), ee.value && await te(), Z.value && await U(), i.value && await xe(), F(), w("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function F() {
      v.value = !1, j.value = !1, clearInterval(J), clearInterval(D), V(), c.value = 0, l.value = "", f.value = Array(12).fill(0), g.value = 0;
    }
    async function ne() {
      await A(1, "runCycle"), c.value = 1, w("controlSprinkler", { target: "tankWork", state: 1 }), he();
    }
    async function oe() {
      c.value = 1, he();
    }
    function ye() {
      !v.value || !p.value || (g.value--, g.value > 0 && (R = setTimeout(ye, 1e3), _.value.push(R)));
    }
    function he() {
      if (!v.value || !p.value) return;
      l.value = "run", d.value = r.value, g.value = d.value, O.value = Date.now(), ye();
      let Y = Date.now();
      w("controlSprinkler", { target: "auto_control_sprayer", index: c.value, state: 1 }), D = setInterval(() => {
        let W = Date.now() - Y, se = Math.min(W / (d.value * 1e3), 1);
        f.value[c.value - 1] = se * 100;
      }, 100), R = setTimeout(async () => {
        clearInterval(D), c.value < 12 ? (f.value[c.value - 1] = 0, w("controlSprinkler", { target: "auto_control_sprayer", index: c.value, state: 0 }), le()) : (f.value[c.value - 1] = 0, w("controlSprinkler", { target: "auto_control_sprayer", index: c.value, state: 0 }), ke());
      }, d.value * 1e3), _.value.push(R);
    }
    function le() {
      !v.value || !p.value || (e.value = o.value, g.value = e.value, O.value = Date.now(), g.value > 0 && (l.value = "interval"), ye(), R = setTimeout(() => {
        c.value++, he();
      }, e.value * 1e3), _.value.push(R));
    }
    async function ke() {
      !v.value || !p.value || (n.value = t.value, g.value = n.value, g.value > 0 ? (w("controlSprinkler", { target: "tankWork", state: 0 }), await A(0, "runLoopInterval"), w("controlSprinkler", { target: "setState", state: !0 }), O.value = Date.now(), l.value = "loop", ye(), c.value = 0, R = setTimeout(async () => {
        f.value = Array(12).fill(0), w("controlSprinkler", { target: "setState", state: !1 }), ee.value && await te(), Z.value && await U(), i.value && await xe(), w("controlSprinkler", { target: "tankWork", state: 0 }), await ne();
      }, n.value * 1e3), _.value.push(R)) : (c.value = 0, f.value = Array(12).fill(0), await oe()));
    }
    function Oe(Y) {
      return f.value[Y - 1];
    }
    async function Re(Y) {
      if (p.value) return;
      w("IntegratedControlSystem_set_response", { method: "toggleManualSprinkler", args: { n: Y } });
      const W = f.value.findIndex((se) => se === 100);
      f.value[Y - 1] > 0 ? (f.value[Y - 1] = 0, T.isPyQtWebEngine && (w("controlSprinkler", { target: "manual_control_sprayer", index: Y, state: 0 }), w("controlSprinkler", { target: "tankWork", state: 0 }))) : W !== -1 ? (f.value[W] = 0, T.isPyQtWebEngine && w("controlSprinkler", { target: "manual_control_sprayer", index: W + 1, state: 0 }), f.value[Y - 1] = 100, T.isPyQtWebEngine && w("controlSprinkler", { target: "manual_control_sprayer", index: Y, state: 1 })) : (b.value = Y, await A(1, "toggleManualSprinkler"), w("controlSprinkler", { target: "tankWork", state: 1 }), f.value[Y - 1] = 100, T.isPyQtWebEngine && w("controlSprinkler", { target: "manual_control_sprayer", index: Y, state: 1 }));
    }
    return (Y, W) => (_e(), Se("div", Rn, [
      W[17] || (W[17] = E("h2", null, "集成控制系统", -1)),
      W[18] || (W[18] = E("div", { class: "label-box" }, [
        E("label", null, "支持自动/手动两种模式，自动模式下蒸汽机启停受温度上下限控制，"),
        E("br"),
        E("label", null, "喷淋/喷雾系统沿喷淋->喷雾->喷淋循环运行，喷淋/喷雾时间由设置决定，其中在喷雾时间内雾化机启停受湿度上下限控制；"),
        E("br"),
        E("label", null, "手动模式下可手动控制蒸汽机/喷淋头/雾化机的启停，注意喷淋头和雾化机同时只能工作一个")
      ], -1)),
      E("div", $n, [
        E("button", {
          onClick: W[0] || (W[0] = (se) => z("auto")),
          class: ut([{ active: p.value }, "mode-btn"])
        }, "自动模式", 2),
        E("button", {
          onClick: W[1] || (W[1] = (se) => z("manual")),
          class: ut([{ active: !p.value }, "mode-btn"])
        }, "手动模式", 2),
        E("button", {
          onClick: B,
          disabled: v.value || !p.value,
          class: "control-btn"
        }, "开始", 8, Un),
        E("button", {
          onClick: X,
          disabled: !v.value || !p.value,
          class: "control-btn"
        }, "停止", 8, Mn)
      ]),
      E("div", Dn, [
        E("div", Fn, [
          W[8] || (W[8] = E("h3", null, "蒸汽机", -1)),
          E("div", Vn, [
            E("div", {
              class: ut(["status", { on: Z.value }])
            }, [
              W[6] || (W[6] = E("div", { class: "status-indicator" }, null, -1)),
              dt(" " + Te(Z.value ? "开" : "关"), 1)
            ], 2),
            E("button", {
              onClick: Pe,
              disabled: p.value,
              class: "control-btn"
            }, Te(Z.value ? "关闭" : "开启"), 9, Wn)
          ]),
          E("div", qn, [
            E("div", {
              class: ut(["status", { on: i.value }])
            }, [
              W[7] || (W[7] = E("div", { class: "status-indicator" }, null, -1)),
              dt(" " + Te(i.value ? "开" : "关"), 1)
            ], 2),
            E("button", {
              onClick: Ue,
              disabled: p.value,
              class: "control-btn"
            }, Te(i.value ? "关闭" : "开启"), 9, zn)
          ])
        ]),
        E("div", Kn, [
          W[12] || (W[12] = E("h3", null, "喷淋/喷雾系统", -1)),
          E("div", Qn, [
            E("div", Hn, [
              E("div", Gn, [
                W[9] || (W[9] = E("h4", null, "喷淋头", -1)),
                E("div", Jn, [
                  (_e(), Se(ot, null, it(12, (se) => E("div", {
                    key: se,
                    class: ut(["sprinkler", { active: p.value ? c.value === se : f.value[se - 1] > 0 }]),
                    onClick: (We) => !j.value && !p.value && !ee.value && Re(se)
                  }, [
                    E("div", {
                      class: "water",
                      style: Ot({ height: Oe(se) + "%" })
                    }, null, 4),
                    E("span", null, Te(se), 1)
                  ], 10, Yn)), 64))
                ])
              ]),
              E("div", Xn, [
                W[11] || (W[11] = E("h4", null, "雾化机", -1)),
                E("div", {
                  class: ut(["status", { on: ee.value }])
                }, [
                  W[10] || (W[10] = E("div", { class: "status-indicator" }, null, -1)),
                  dt(" " + Te(ee.value ? "开" : "关"), 1)
                ], 2),
                E("button", {
                  onClick: ve,
                  disabled: p.value || j.value,
                  class: "control-btn"
                }, Te(ee.value ? "关闭" : "开启"), 9, Zn)
              ])
            ])
          ]),
          E("div", er, Te(L.value), 1)
        ]),
        E("div", tr, [
          W[16] || (W[16] = E("h3", null, "喷淋/喷雾系统时间设置", -1)),
          E("div", nr, [
            E("div", rr, [
              W[13] || (W[13] = E("label", null, "单个喷淋头工作时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: u.value,
                onFocus: W[2] || (W[2] = (se) => Be("singleRunTime")),
                readonly: ""
              }, null, 40, or)
            ]),
            E("div", ir, [
              W[14] || (W[14] = E("label", null, "喷淋头-喷淋头运行间隔时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: s.value,
                disabled: "",
                onFocus: W[3] || (W[3] = (se) => Be("runIntervalTime")),
                readonly: ""
              }, null, 40, ar)
            ]),
            E("div", ur, [
              W[15] || (W[15] = E("label", null, "喷雾时间 (秒):", -1)),
              E("input", {
                type: "text",
                value: a.value,
                onFocus: W[4] || (W[4] = (se) => Be("loopInterval")),
                readonly: ""
              }, null, 40, sr)
            ])
          ])
        ])
      ]),
      Je(Tt, {
        modelValue: y.value,
        showKeyboard: h.value,
        "onUpdate:modelValue": Le,
        "onUpdate:showKeyboard": W[5] || (W[5] = (se) => h.value = se)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, lr = /* @__PURE__ */ ct(cr, [["__scopeId", "data-v-e4e95144"]]), dr = { class: "data-actions" }, fr = {
  key: 0,
  class: "modal-overlay"
}, pr = { class: "modal-content settings-modal" }, vr = { class: "setting-group" }, hr = { class: "setting-item" }, mr = { class: "toggle-switch" }, gr = {
  key: 1,
  class: "modal-overlay"
}, yr = {
  key: 2,
  class: "modal-overlay"
}, br = { class: "modal-content" }, wr = {
  __name: "DataExport",
  setup(we) {
    const { sendToPyQt: ee } = Ye(), Z = mt({
      isPyQtWebEngine: !1
    }), i = G(!1), d = G(!1), e = G(""), n = G(!1), r = G(!1), o = G(!1), t = () => {
      o.value = r.value, n.value = !0, document.body.style.overflow = "hidden";
    }, u = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto";
    }, s = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto", Z.isPyQtWebEngine && ee("saveDebugSettings", { debug_mode: r.value });
    };
    ft(() => {
      if (Z.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, Z.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: v } = Ye();
        rt(v, (h) => {
          if (h && h.type === "update_debug_mode")
            try {
              const m = JSON.parse(h.content);
              r.value = m.debug_mode, o.value = m.debug_mode;
            } catch (m) {
              console.error("Failed to parse debug settings:", m);
            }
          else if (h && h.type === "DataExport_init") {
            const m = {
              debugMode: r.value
            };
            console.log("Sending initial DataExport state:", m), ee("DataExport_init_response", m);
          } else h && h.type === "clearData" && (ee("exportData", !1), ee("clearData_response", ""));
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const a = () => {
      Z.isPyQtWebEngine && (console.log("导出数据"), ee("exportData", !0));
    }, c = () => {
      i.value = !0, document.body.style.overflow = "hidden";
    }, l = () => {
      i.value = !1, document.body.style.overflow = "auto";
    }, f = () => {
      console.log("清空数据"), i.value = !1, g("所有数据已清空！"), document.body.style.overflow = "auto", Z.isPyQtWebEngine && ee("exportData", !1);
    }, g = (v) => {
      e.value = v, d.value = !0;
    }, p = () => {
      d.value = !1;
    };
    return (v, h) => (_e(), Se("div", dr, [
      E("div", { class: "action-buttons" }, [
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: a,
            class: "export-btn"
          }, "导出数据")
        ]),
        E("div", { class: "button-group" }, [
          E("button", {
            onClick: c,
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
      n.value ? (_e(), Se("div", fr, [
        E("div", pr, [
          E("div", vr, [
            h[3] || (h[3] = E("h2", null, "传感器调试模式", -1)),
            E("div", hr, [
              h[2] || (h[2] = E("span", { class: "setting-label" }, "调试模式：", -1)),
              E("div", mr, [
                lt(E("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": h[0] || (h[0] = (m) => o.value = m)
                }, null, 512), [
                  [Nt, o.value]
                ]),
                h[1] || (h[1] = E("label", { for: "debug-toggle" }, null, -1))
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
      ])) : st("", !0),
      i.value ? (_e(), Se("div", gr, [
        E("div", { class: "modal-content" }, [
          h[4] || (h[4] = E("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          E("div", { class: "modal-buttons" }, [
            E("button", {
              onClick: f,
              class: "confirm-btn"
            }, "确定"),
            E("button", {
              onClick: l,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : st("", !0),
      d.value ? (_e(), Se("div", yr, [
        E("div", br, [
          E("h2", null, Te(e.value), 1),
          E("div", { class: "modal-buttons" }, [
            E("button", {
              onClick: p,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : st("", !0)
    ]));
  }
}, xr = /* @__PURE__ */ ct(wr, [["__scopeId", "data-v-2cbcc479"]]);
var kr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _r(we) {
  return we && we.__esModule && Object.prototype.hasOwnProperty.call(we, "default") ? we.default : we;
}
var Lt = { exports: {} };
(function(we, ee) {
  (function(Z, i) {
    we.exports = i(It);
  })(typeof self < "u" ? self : kr, function(Z) {
    return function(i) {
      var d = {};
      function e(n) {
        if (d[n]) return d[n].exports;
        var r = d[n] = { i: n, l: !1, exports: {} };
        return i[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports;
      }
      return e.m = i, e.c = d, e.d = function(n, r, o) {
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
    }({ "00ee": function(i, d, e) {
      var n = e("b622"), r = n("toStringTag"), o = {};
      o[r] = "z", i.exports = String(o) === "[object z]";
    }, "0366": function(i, d, e) {
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
            return function(u, s) {
              return r.call(o, u, s);
            };
          case 3:
            return function(u, s, a) {
              return r.call(o, u, s, a);
            };
        }
        return function() {
          return r.apply(o, arguments);
        };
      };
    }, "057f": function(i, d, e) {
      var n = e("fc6a"), r = e("241c").f, o = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], u = function(s) {
        try {
          return r(s);
        } catch {
          return t.slice();
        }
      };
      i.exports.f = function(s) {
        return t && o.call(s) == "[object Window]" ? u(s) : r(n(s));
      };
    }, "06cf": function(i, d, e) {
      var n = e("83ab"), r = e("d1e7"), o = e("5c6c"), t = e("fc6a"), u = e("c04e"), s = e("5135"), a = e("0cfb"), c = Object.getOwnPropertyDescriptor;
      d.f = n ? c : function(l, f) {
        if (l = t(l), f = u(f, !0), a) try {
          return c(l, f);
        } catch {
        }
        if (s(l, f)) return o(!r.f.call(l, f), l[f]);
      };
    }, "0a06": function(i, d, e) {
      var n = e("c532"), r = e("30b5"), o = e("f6b4"), t = e("5270"), u = e("4a7b");
      function s(a) {
        this.defaults = a, this.interceptors = { request: new o(), response: new o() };
      }
      s.prototype.request = function(a) {
        typeof a == "string" ? (a = arguments[1] || {}, a.url = arguments[0]) : a = a || {}, a = u(this.defaults, a), a.method ? a.method = a.method.toLowerCase() : this.defaults.method ? a.method = this.defaults.method.toLowerCase() : a.method = "get";
        var c = [t, void 0], l = Promise.resolve(a);
        for (this.interceptors.request.forEach(function(f) {
          c.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          c.push(f.fulfilled, f.rejected);
        }); c.length; ) l = l.then(c.shift(), c.shift());
        return l;
      }, s.prototype.getUri = function(a) {
        return a = u(this.defaults, a), r(a.url, a.params, a.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(a) {
        s.prototype[a] = function(c, l) {
          return this.request(u(l || {}, { method: a, url: c, data: (l || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(a) {
        s.prototype[a] = function(c, l, f) {
          return this.request(u(f || {}, { method: a, url: c, data: l }));
        };
      }), i.exports = s;
    }, "0cb2": function(i, d, e) {
      var n = e("7b0b"), r = Math.floor, o = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, u = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(s, a, c, l, f, g) {
        var p = c + s.length, v = l.length, h = u;
        return f !== void 0 && (f = n(f), h = t), o.call(g, h, function(m, y) {
          var j;
          switch (y.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return s;
            case "`":
              return a.slice(0, c);
            case "'":
              return a.slice(p);
            case "<":
              j = f[y.slice(1, -1)];
              break;
            default:
              var C = +y;
              if (C === 0) return m;
              if (C > v) {
                var x = r(C / 10);
                return x === 0 ? m : x <= v ? l[x - 1] === void 0 ? y.charAt(1) : l[x - 1] + y.charAt(1) : m;
              }
              j = l[C - 1];
          }
          return j === void 0 ? "" : j;
        });
      };
    }, "0cfb": function(i, d, e) {
      var n = e("83ab"), r = e("d039"), o = e("cc12");
      i.exports = !n && !r(function() {
        return Object.defineProperty(o("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(i, d, e) {
      i.exports = function(n) {
        return function(r) {
          return n.apply(null, r);
        };
      };
    }, 1148: function(i, d, e) {
      var n = e("a691"), r = e("1d80");
      i.exports = "".repeat || function(o) {
        var t = String(r(this)), u = "", s = n(o);
        if (s < 0 || s == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; s > 0; (s >>>= 1) && (t += t)) 1 & s && (u += t);
        return u;
      };
    }, 1276: function(i, d, e) {
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), u = e("4840"), s = e("8aa5"), a = e("50c4"), c = e("14c3"), l = e("9263"), f = e("d039"), g = [].push, p = Math.min, v = 4294967295, h = !f(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(m, y, j) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(x, S) {
          var b = String(t(this)), w = S === void 0 ? v : S >>> 0;
          if (w === 0) return [];
          if (x === void 0) return [b];
          if (!r(x)) return y.call(b, x, w);
          for (var O, T, _, R = [], D = (x.ignoreCase ? "i" : "") + (x.multiline ? "m" : "") + (x.unicode ? "u" : "") + (x.sticky ? "y" : ""), J = 0, ie = new RegExp(x.source, D + "g"); (O = l.call(ie, b)) && (T = ie.lastIndex, !(T > J && (R.push(b.slice(J, O.index)), O.length > 1 && O.index < b.length && g.apply(R, O.slice(1)), _ = O[0].length, J = T, R.length >= w))); )
            ie.lastIndex === O.index && ie.lastIndex++;
          return J === b.length ? !_ && ie.test("") || R.push("") : R.push(b.slice(J)), R.length > w ? R.slice(0, w) : R;
        } : "0".split(void 0, 0).length ? function(x, S) {
          return x === void 0 && S === 0 ? [] : y.call(this, x, S);
        } : y, [function(x, S) {
          var b = t(this), w = x == null ? void 0 : x[m];
          return w !== void 0 ? w.call(x, b, S) : C.call(String(b), x, S);
        }, function(x, S) {
          var b = j(C, x, this, S, C !== y);
          if (b.done) return b.value;
          var w = o(x), O = String(this), T = u(w, RegExp), _ = w.unicode, R = (w.ignoreCase ? "i" : "") + (w.multiline ? "m" : "") + (w.unicode ? "u" : "") + (h ? "y" : "g"), D = new T(h ? w : "^(?:" + w.source + ")", R), J = S === void 0 ? v : S >>> 0;
          if (J === 0) return [];
          if (O.length === 0) return c(D, O) === null ? [O] : [];
          for (var ie = 0, H = 0, V = []; H < O.length; ) {
            D.lastIndex = h ? H : 0;
            var M, L = c(D, h ? O : O.slice(H));
            if (L === null || (M = p(a(D.lastIndex + (h ? 0 : H)), O.length)) === ie) H = s(O, H, _);
            else {
              if (V.push(O.slice(ie, H)), V.length === J) return V;
              for (var A = 1; A <= L.length - 1; A++) if (V.push(L[A]), V.length === J) return V;
              H = ie = M;
            }
          }
          return V.push(O.slice(ie)), V;
        }];
      }, !h);
    }, "13d5": function(i, d, e) {
      var n = e("23e7"), r = e("d58f").left, o = e("a640"), t = e("2d00"), u = e("605d"), s = o("reduce"), a = !u && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !s || a }, { reduce: function(c) {
        return r(this, c, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(i, d, e) {
      var n = e("c6b6"), r = e("9263");
      i.exports = function(o, t) {
        var u = o.exec;
        if (typeof u == "function") {
          var s = u.call(o, t);
          if (typeof s != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return s;
        }
        if (n(o) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return r.call(o, t);
      };
    }, "159b": function(i, d, e) {
      var n = e("da84"), r = e("fdbc"), o = e("17c2"), t = e("9112");
      for (var u in r) {
        var s = n[u], a = s && s.prototype;
        if (a && a.forEach !== o) try {
          t(a, "forEach", o);
        } catch {
          a.forEach = o;
        }
      }
    }, "17c2": function(i, d, e) {
      var n = e("b727").forEach, r = e("a640"), o = r("forEach");
      i.exports = o ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(i, d) {
      i.exports = function(e, n, r) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
        return e;
      };
    }, "1be4": function(i, d, e) {
      var n = e("d066");
      i.exports = n("document", "documentElement");
    }, "1c0b": function(i, d) {
      i.exports = function(e) {
        if (typeof e != "function") throw TypeError(String(e) + " is not a function");
        return e;
      };
    }, "1c7e": function(i, d, e) {
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
      i.exports = function(s, a) {
        if (!a && !o) return !1;
        var c = !1;
        try {
          var l = {};
          l[r] = function() {
            return { next: function() {
              return { done: c = !0 };
            } };
          }, s(l);
        } catch {
        }
        return c;
      };
    }, "1cdc": function(i, d, e) {
      var n = e("342f");
      i.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(i, d, e) {
      i.exports = function(n, r) {
        return function() {
          for (var o = new Array(arguments.length), t = 0; t < o.length; t++) o[t] = arguments[t];
          return n.apply(r, o);
        };
      };
    }, "1d80": function(i, d) {
      i.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(i, d, e) {
      var n = e("d039"), r = e("b622"), o = e("2d00"), t = r("species");
      i.exports = function(u) {
        return o >= 51 || !n(function() {
          var s = [], a = s.constructor = {};
          return a[t] = function() {
            return { foo: 1 };
          }, s[u](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(i, d, e) {
      (function(n) {
        (function(r, o) {
          i.exports = o();
        })(0, function() {
          function r(N, B) {
            return B = { exports: {} }, N(B, B.exports), B.exports;
          }
          var o = r(function(N, B) {
            (function(X, F) {
              N.exports = F();
            })(0, function() {
              function X(le) {
                var ke = le && typeof le == "object";
                return ke && Object.prototype.toString.call(le) !== "[object RegExp]" && Object.prototype.toString.call(le) !== "[object Date]";
              }
              function F(le) {
                return Array.isArray(le) ? [] : {};
              }
              function ne(le, ke) {
                var Oe = ke && ke.clone === !0;
                return Oe && X(le) ? he(F(le), le, ke) : le;
              }
              function oe(le, ke, Oe) {
                var Re = le.slice();
                return ke.forEach(function(Y, W) {
                  typeof Re[W] > "u" ? Re[W] = ne(Y, Oe) : X(Y) ? Re[W] = he(le[W], Y, Oe) : le.indexOf(Y) === -1 && Re.push(ne(Y, Oe));
                }), Re;
              }
              function ye(le, ke, Oe) {
                var Re = {};
                return X(le) && Object.keys(le).forEach(function(Y) {
                  Re[Y] = ne(le[Y], Oe);
                }), Object.keys(ke).forEach(function(Y) {
                  X(ke[Y]) && le[Y] ? Re[Y] = he(le[Y], ke[Y], Oe) : Re[Y] = ne(ke[Y], Oe);
                }), Re;
              }
              function he(le, ke, Oe) {
                var Re = Array.isArray(ke), Y = Oe || { arrayMerge: oe }, W = Y.arrayMerge || oe;
                return Re ? Array.isArray(le) ? W(le, ke, Oe) : ne(ke, Oe) : ye(le, ke, Oe);
              }
              return he.all = function(le, ke) {
                if (!Array.isArray(le) || le.length < 2) throw new Error("first argument should be an array with at least two elements");
                return le.reduce(function(Oe, Re) {
                  return he(Oe, Re, ke);
                });
              }, he;
            });
          });
          function t(N) {
            return N = N || /* @__PURE__ */ Object.create(null), { on: function(B, X) {
              (N[B] || (N[B] = [])).push(X);
            }, off: function(B, X) {
              N[B] && N[B].splice(N[B].indexOf(X) >>> 0, 1);
            }, emit: function(B, X) {
              (N[B] || []).map(function(F) {
                F(X);
              }), (N["*"] || []).map(function(F) {
                F(B, X);
              });
            } };
          }
          var u = r(function(N, B) {
            var X = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            B.default = X, N.exports = B.default;
          }), s = function(N) {
            return Object.keys(N).map(function(B) {
              var X = N[B].toString().replace(/"/g, "&quot;");
              return B + '="' + X + '"';
            }).join(" ");
          }, a = u.svg, c = u.xlink, l = {};
          l[a.name] = a.uri, l[c.name] = c.uri;
          var f, g = function(N, B) {
            N === void 0 && (N = "");
            var X = o(l, B || {}), F = s(X);
            return "<svg " + F + ">" + N + "</svg>";
          }, p = u.svg, v = u.xlink, h = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[v.name] = v.uri, f) }, m = function(N) {
            this.config = o(h, N || {}), this.symbols = [];
          };
          m.prototype.add = function(N) {
            var B = this, X = B.symbols, F = this.find(N.id);
            return F ? (X[X.indexOf(F)] = N, !1) : (X.push(N), !0);
          }, m.prototype.remove = function(N) {
            var B = this, X = B.symbols, F = this.find(N);
            return !!F && (X.splice(X.indexOf(F), 1), F.destroy(), !0);
          }, m.prototype.find = function(N) {
            return this.symbols.filter(function(B) {
              return B.id === N;
            })[0] || null;
          }, m.prototype.has = function(N) {
            return this.find(N) !== null;
          }, m.prototype.stringify = function() {
            var N = this.config, B = N.attrs, X = this.symbols.map(function(F) {
              return F.stringify();
            }).join("");
            return g(X, B);
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            this.symbols.forEach(function(N) {
              return N.destroy();
            });
          };
          var y = function(N) {
            var B = N.id, X = N.viewBox, F = N.content;
            this.id = B, this.viewBox = X, this.content = F;
          };
          y.prototype.stringify = function() {
            return this.content;
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            var N = this;
            ["id", "viewBox", "content"].forEach(function(B) {
              return delete N[B];
            });
          };
          var j = function(N) {
            var B = !!document.importNode, X = new DOMParser().parseFromString(N, "image/svg+xml").documentElement;
            return B ? document.importNode(X, !0) : X;
          }, C = function(N) {
            function B() {
              N.apply(this, arguments);
            }
            N && (B.__proto__ = N), B.prototype = Object.create(N && N.prototype), B.prototype.constructor = B;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, B.createFromExistingNode = function(F) {
              return new B({ id: F.getAttribute("id"), viewBox: F.getAttribute("viewBox"), content: F.outerHTML });
            }, B.prototype.destroy = function() {
              this.isMounted && this.unmount(), N.prototype.destroy.call(this);
            }, B.prototype.mount = function(F) {
              if (this.isMounted) return this.node;
              var ne = typeof F == "string" ? document.querySelector(F) : F, oe = this.render();
              return this.node = oe, ne.appendChild(oe), oe;
            }, B.prototype.render = function() {
              var F = this.stringify();
              return j(g(F)).childNodes[0];
            }, B.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(B.prototype, X), B;
          }(y), x = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, S = function(N) {
            return Array.prototype.slice.call(N, 0);
          }, b = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, w = function(N, B) {
            var X = document.createEvent("CustomEvent");
            X.initCustomEvent(N, !1, !1, B), window.dispatchEvent(X);
          }, O = function(N) {
            var B = [];
            return S(N.querySelectorAll("style")).forEach(function(X) {
              X.textContent += "", B.push(X);
            }), B;
          }, T = function(N) {
            return (N || window.location.href).split("#")[0];
          }, _ = function(N) {
            angular.module("ng").run(["$rootScope", function(B) {
              B.$on("$locationChangeSuccess", function(X, F, ne) {
                w(N, { oldUrl: ne, newUrl: F });
              });
            }]);
          }, R = "linearGradient, radialGradient, pattern, mask, clipPath", D = function(N, B) {
            return B === void 0 && (B = R), S(N.querySelectorAll("symbol")).forEach(function(X) {
              S(X.querySelectorAll(B)).forEach(function(F) {
                X.parentNode.insertBefore(F, X);
              });
            }), N;
          };
          function J(N, B) {
            var X = S(N).reduce(function(F, ne) {
              if (!ne.attributes) return F;
              var oe = S(ne.attributes), ye = B ? oe.filter(B) : oe;
              return F.concat(ye);
            }, []);
            return X;
          }
          var ie = u.xlink.uri, H = "xlink:href", V = /[{}|\\\^\[\]`"<>]/g;
          function M(N) {
            return N.replace(V, function(B) {
              return "%" + B[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L(N) {
            return N.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function A(N, B, X) {
            return S(N).forEach(function(F) {
              var ne = F.getAttribute(H);
              if (ne && ne.indexOf(B) === 0) {
                var oe = ne.replace(B, X);
                F.setAttributeNS(ie, H, oe);
              }
            }), N;
          }
          var z, te = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], U = te.map(function(N) {
            return "[" + N + "]";
          }).join(","), xe = function(N, B, X, F) {
            var ne = M(X), oe = M(F), ye = N.querySelectorAll(U), he = J(ye, function(le) {
              var ke = le.localName, Oe = le.value;
              return te.indexOf(ke) !== -1 && Oe.indexOf("url(" + ne) !== -1;
            });
            he.forEach(function(le) {
              return le.value = le.value.replace(new RegExp(L(ne), "g"), oe);
            }), A(B, ne, oe);
          }, ve = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Pe = function(N) {
            function B(F) {
              var ne = this;
              F === void 0 && (F = {}), N.call(this, o(x, F));
              var oe = t();
              this._emitter = oe, this.node = null;
              var ye = this, he = ye.config;
              if (he.autoConfigure && this._autoConfigure(F), he.syncUrlsWithBaseTag) {
                var le = document.getElementsByTagName("base")[0].getAttribute("href");
                oe.on(ve.MOUNT, function() {
                  return ne.updateUrls("#", le);
                });
              }
              var ke = this._handleLocationChange.bind(this);
              this._handleLocationChange = ke, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, ke), he.locationChangeAngularEmitter && _(he.locationChangeEvent), oe.on(ve.MOUNT, function(Oe) {
                he.moveGradientsOutsideSymbol && D(Oe);
              }), oe.on(ve.SYMBOL_MOUNT, function(Oe) {
                he.moveGradientsOutsideSymbol && D(Oe.parentNode), (b.isIE() || b.isEdge()) && O(Oe);
              });
            }
            N && (B.__proto__ = N), B.prototype = Object.create(N && N.prototype), B.prototype.constructor = B;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, B.prototype._autoConfigure = function(F) {
              var ne = this, oe = ne.config;
              typeof F.syncUrlsWithBaseTag > "u" && (oe.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof F.locationChangeAngularEmitter > "u" && (oe.locationChangeAngularEmitter = typeof window.angular < "u"), typeof F.moveGradientsOutsideSymbol > "u" && (oe.moveGradientsOutsideSymbol = b.isFirefox());
            }, B.prototype._handleLocationChange = function(F) {
              var ne = F.detail, oe = ne.oldUrl, ye = ne.newUrl;
              this.updateUrls(oe, ye);
            }, B.prototype.add = function(F) {
              var ne = this, oe = N.prototype.add.call(this, F);
              return this.isMounted && oe && (F.mount(ne.node), this._emitter.emit(ve.SYMBOL_MOUNT, F.node)), oe;
            }, B.prototype.attach = function(F) {
              var ne = this, oe = this;
              if (oe.isMounted) return oe.node;
              var ye = typeof F == "string" ? document.querySelector(F) : F;
              return oe.node = ye, this.symbols.forEach(function(he) {
                he.mount(oe.node), ne._emitter.emit(ve.SYMBOL_MOUNT, he.node);
              }), S(ye.querySelectorAll("symbol")).forEach(function(he) {
                var le = C.createFromExistingNode(he);
                le.node = he, oe.add(le);
              }), this._emitter.emit(ve.MOUNT, ye), ye;
            }, B.prototype.destroy = function() {
              var F = this, ne = F.config, oe = F.symbols, ye = F._emitter;
              oe.forEach(function(he) {
                return he.destroy();
              }), ye.off("*"), window.removeEventListener(ne.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, B.prototype.mount = function(F, ne) {
              F === void 0 && (F = this.config.mountTo), ne === void 0 && (ne = !1);
              var oe = this;
              if (oe.isMounted) return oe.node;
              var ye = typeof F == "string" ? document.querySelector(F) : F, he = oe.render();
              return this.node = he, ne && ye.childNodes[0] ? ye.insertBefore(he, ye.childNodes[0]) : ye.appendChild(he), this._emitter.emit(ve.MOUNT, he), he;
            }, B.prototype.render = function() {
              return j(this.stringify());
            }, B.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, B.prototype.updateUrls = function(F, ne) {
              if (!this.isMounted) return !1;
              var oe = document.querySelectorAll(this.config.usagesToUpdate);
              return xe(this.node, oe, T(F) + "#", T(ne) + "#"), !0;
            }, Object.defineProperties(B.prototype, X), B;
          }(m), Ue = r(function(N) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(B, X) {
              N.exports = X();
            })(0, function() {
              var B, X = [], F = document, ne = F.documentElement.doScroll, oe = "DOMContentLoaded", ye = (ne ? /^loaded|^c/ : /^loaded|^i|^c/).test(F.readyState);
              return ye || F.addEventListener(oe, B = function() {
                for (F.removeEventListener(oe, B), ye = 1; B = X.shift(); ) B();
              }), function(he) {
                ye ? setTimeout(he, 0) : X.push(he);
              };
            });
          }), Be = "__SVG_SPRITE_NODE__", Le = "__SVG_SPRITE__", Ae = !!window[Le];
          Ae ? z = window[Le] : (z = new Pe({ attrs: { id: Be, "aria-hidden": "true" } }), window[Le] = z);
          var ze = function() {
            var N = document.getElementById(Be);
            N ? z.attach(N) : z.mount(document.body, !0);
          };
          document.body ? ze() : Ue(ze);
          var Xe = z;
          return Xe;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, d, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), u = e("35a1"), s = e("2a62"), a = function(c, l) {
        this.stopped = c, this.result = l;
      };
      i.exports = function(c, l, f) {
        var g, p, v, h, m, y, j, C = f && f.that, x = !(!f || !f.AS_ENTRIES), S = !(!f || !f.IS_ITERATOR), b = !(!f || !f.INTERRUPTED), w = t(l, C, 1 + x + b), O = function(_) {
          return g && s(g), new a(!0, _);
        }, T = function(_) {
          return x ? (n(_), b ? w(_[0], _[1], O) : w(_[0], _[1])) : b ? w(_, O) : w(_);
        };
        if (S) g = c;
        else {
          if (p = u(c), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, h = o(c.length); h > v; v++) if (m = T(c[v]), m && m instanceof a) return m;
            return new a(!1);
          }
          g = p.call(c);
        }
        for (y = g.next; !(j = y.call(g)).done; ) {
          try {
            m = T(j.value);
          } catch (_) {
            throw s(g), _;
          }
          if (typeof m == "object" && m && m instanceof a) return m;
        }
        return new a(!1);
      };
    }, "23cb": function(i, d, e) {
      var n = e("a691"), r = Math.max, o = Math.min;
      i.exports = function(t, u) {
        var s = n(t);
        return s < 0 ? r(s + u, 0) : o(s, u);
      };
    }, "23e7": function(i, d, e) {
      var n = e("da84"), r = e("06cf").f, o = e("9112"), t = e("6eeb"), u = e("ce4e"), s = e("e893"), a = e("94ca");
      i.exports = function(c, l) {
        var f, g, p, v, h, m, y = c.target, j = c.global, C = c.stat;
        if (g = j ? n : C ? n[y] || u(y, {}) : (n[y] || {}).prototype, g) for (p in l) {
          if (h = l[p], c.noTargetGet ? (m = r(g, p), v = m && m.value) : v = g[p], f = a(j ? p : y + (C ? "." : "#") + p, c.forced), !f && v !== void 0) {
            if (typeof h == typeof v) continue;
            s(h, v);
          }
          (c.sham || v && v.sham) && o(h, "sham", !0), t(g, p, h, c);
        }
      };
    }, "241c": function(i, d, e) {
      var n = e("ca84"), r = e("7839"), o = r.concat("length", "prototype");
      d.f = Object.getOwnPropertyNames || function(t) {
        return n(t, o);
      };
    }, 2444: function(i, d, e) {
      (function(n) {
        var r = e("c532"), o = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function u(c, l) {
          !r.isUndefined(c) && r.isUndefined(c["Content-Type"]) && (c["Content-Type"] = l);
        }
        function s() {
          var c;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (c = e("b50d")), c;
        }
        var a = { adapter: s(), transformRequest: [function(c, l) {
          return o(l, "Accept"), o(l, "Content-Type"), r.isFormData(c) || r.isArrayBuffer(c) || r.isBuffer(c) || r.isStream(c) || r.isFile(c) || r.isBlob(c) ? c : r.isArrayBufferView(c) ? c.buffer : r.isURLSearchParams(c) ? (u(l, "application/x-www-form-urlencoded;charset=utf-8"), c.toString()) : r.isObject(c) ? (u(l, "application/json;charset=utf-8"), JSON.stringify(c)) : c;
        }], transformResponse: [function(c) {
          if (typeof c == "string") try {
            c = JSON.parse(c);
          } catch {
          }
          return c;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(c) {
          return c >= 200 && c < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        r.forEach(["delete", "get", "head"], function(c) {
          a.headers[c] = {};
        }), r.forEach(["post", "put", "patch"], function(c) {
          a.headers[c] = r.merge(t);
        }), i.exports = a;
      }).call(this, e("4362"));
    }, 2532: function(i, d, e) {
      var n = e("23e7"), r = e("5a34"), o = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(u) {
        return !!~String(o(this)).indexOf(r(u), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, d, e) {
      var n = e("6eeb"), r = e("825a"), o = e("d039"), t = e("ad6d"), u = "toString", s = RegExp.prototype, a = s[u], c = o(function() {
        return a.call({ source: "a", flags: "b" }) != "/a/b";
      }), l = a.name != u;
      (c || l) && n(RegExp.prototype, u, function() {
        var f = r(this), g = String(f.source), p = f.flags, v = String(p === void 0 && f instanceof RegExp && !("flags" in s) ? t.call(f) : p);
        return "/" + g + "/" + v;
      }, { unsafe: !0 });
    }, 2626: function(i, d, e) {
      var n = e("d066"), r = e("9bf2"), o = e("b622"), t = e("83ab"), u = o("species");
      i.exports = function(s) {
        var a = n(s), c = r.f;
        t && a && !a[u] && c(a, u, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(i, d, e) {
      var n = e("825a");
      i.exports = function(r) {
        var o = r.return;
        if (o !== void 0) return n(o.call(r)).value;
      };
    }, "2cf4": function(i, d, e) {
      var n, r, o, t = e("da84"), u = e("d039"), s = e("0366"), a = e("1be4"), c = e("cc12"), l = e("1cdc"), f = e("605d"), g = t.location, p = t.setImmediate, v = t.clearImmediate, h = t.process, m = t.MessageChannel, y = t.Dispatch, j = 0, C = {}, x = "onreadystatechange", S = function(T) {
        if (C.hasOwnProperty(T)) {
          var _ = C[T];
          delete C[T], _();
        }
      }, b = function(T) {
        return function() {
          S(T);
        };
      }, w = function(T) {
        S(T.data);
      }, O = function(T) {
        t.postMessage(T + "", g.protocol + "//" + g.host);
      };
      p && v || (p = function(T) {
        for (var _ = [], R = 1; arguments.length > R; ) _.push(arguments[R++]);
        return C[++j] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, _);
        }, n(j), j;
      }, v = function(T) {
        delete C[T];
      }, f ? n = function(T) {
        h.nextTick(b(T));
      } : y && y.now ? n = function(T) {
        y.now(b(T));
      } : m && !l ? (r = new m(), o = r.port2, r.port1.onmessage = w, n = s(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && g && g.protocol !== "file:" && !u(O) ? (n = O, t.addEventListener("message", w, !1)) : n = x in c("script") ? function(T) {
        a.appendChild(c("script"))[x] = function() {
          a.removeChild(this), S(T);
        };
      } : function(T) {
        setTimeout(b(T), 0);
      }), i.exports = { set: p, clear: v };
    }, "2d00": function(i, d, e) {
      var n, r, o = e("da84"), t = e("342f"), u = o.process, s = u && u.versions, a = s && s.v8;
      a ? (n = a.split("."), r = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (r = n[1]))), i.exports = r && +r;
    }, "2d83": function(i, d, e) {
      var n = e("387f");
      i.exports = function(r, o, t, u, s) {
        var a = new Error(r);
        return n(a, o, t, u, s);
      };
    }, "2e67": function(i, d, e) {
      i.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(i, d, e) {
      var n = e("c532");
      function r(o) {
        return encodeURIComponent(o).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      i.exports = function(o, t, u) {
        if (!t) return o;
        var s;
        if (u) s = u(t);
        else if (n.isURLSearchParams(t)) s = t.toString();
        else {
          var a = [];
          n.forEach(t, function(l, f) {
            l !== null && typeof l < "u" && (n.isArray(l) ? f += "[]" : l = [l], n.forEach(l, function(g) {
              n.isDate(g) ? g = g.toISOString() : n.isObject(g) && (g = JSON.stringify(g)), a.push(r(f) + "=" + r(g));
            }));
          }), s = a.join("&");
        }
        if (s) {
          var c = o.indexOf("#");
          c !== -1 && (o = o.slice(0, c)), o += (o.indexOf("?") === -1 ? "?" : "&") + s;
        }
        return o;
      };
    }, "342f": function(i, d, e) {
      var n = e("d066");
      i.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(i, d, e) {
      var n = e("f5df"), r = e("3f8c"), o = e("b622"), t = o("iterator");
      i.exports = function(u) {
        if (u != null) return u[t] || u["@@iterator"] || r[n(u)];
      };
    }, "37e8": function(i, d, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("825a"), t = e("df75");
      i.exports = n ? Object.defineProperties : function(u, s) {
        o(u);
        for (var a, c = t(s), l = c.length, f = 0; l > f; ) r.f(u, a = c[f++], s[a]);
        return u;
      };
    }, "387f": function(i, d, e) {
      i.exports = function(n, r, o, t, u) {
        return n.config = r, o && (n.code = o), n.request = t, n.response = u, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(i, d, e) {
      e("acce");
    }, 3934: function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? function() {
        var r, o = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function u(s) {
          var a = s;
          return o && (t.setAttribute("href", a), a = t.href), t.setAttribute("href", a), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return r = u(window.location.href), function(s) {
          var a = n.isString(s) ? u(s) : s;
          return a.protocol === r.protocol && a.host === r.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(i, d, e) {
      var n = e("861d");
      i.exports = function(r) {
        if (!n(r) && r !== null) throw TypeError("Can't set " + String(r) + " as a prototype");
        return r;
      };
    }, "3ca3": function(i, d, e) {
      var n = e("6547").charAt, r = e("69f3"), o = e("7dd0"), t = "String Iterator", u = r.set, s = r.getterFor(t);
      o(String, "String", function(a) {
        u(this, { type: t, string: String(a), index: 0 });
      }, function() {
        var a, c = s(this), l = c.string, f = c.index;
        return f >= l.length ? { value: void 0, done: !0 } : (a = n(l, f), c.index += a.length, { value: a, done: !1 });
      });
    }, "3f8c": function(i, d) {
      i.exports = {};
    }, "408a": function(i, d, e) {
      var n = e("c6b6");
      i.exports = function(r) {
        if (typeof r != "number" && n(r) != "Number") throw TypeError("Incorrect invocation");
        return +r;
      };
    }, "428f": function(i, d, e) {
      var n = e("da84");
      i.exports = n;
    }, 4362: function(i, d, e) {
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
    }, "44ad": function(i, d, e) {
      var n = e("d039"), r = e("c6b6"), o = "".split;
      i.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return r(t) == "String" ? o.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(i, d, e) {
      var n = e("b622"), r = e("7c73"), o = e("9bf2"), t = n("unscopables"), u = Array.prototype;
      u[t] == null && o.f(u, t, { configurable: !0, value: r(null) }), i.exports = function(s) {
        u[t][s] = !0;
      };
    }, "44de": function(i, d, e) {
      var n = e("da84");
      i.exports = function(r, o) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(r) : t.error(r, o));
      };
    }, "44e7": function(i, d, e) {
      var n = e("861d"), r = e("c6b6"), o = e("b622"), t = o("match");
      i.exports = function(u) {
        var s;
        return n(u) && ((s = u[t]) !== void 0 ? !!s : r(u) == "RegExp");
      };
    }, "466d": function(i, d, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("1d80"), u = e("8aa5"), s = e("14c3");
      n("match", 1, function(a, c, l) {
        return [function(f) {
          var g = t(this), p = f == null ? void 0 : f[a];
          return p !== void 0 ? p.call(f, g) : new RegExp(f)[a](String(g));
        }, function(f) {
          var g = l(c, f, this);
          if (g.done) return g.value;
          var p = r(f), v = String(this);
          if (!p.global) return s(p, v);
          var h = p.unicode;
          p.lastIndex = 0;
          for (var m, y = [], j = 0; (m = s(p, v)) !== null; ) {
            var C = String(m[0]);
            y[j] = C, C === "" && (p.lastIndex = u(v, o(p.lastIndex), h)), j++;
          }
          return j === 0 ? null : y;
        }];
      });
    }, "467f": function(i, d, e) {
      var n = e("2d83");
      i.exports = function(r, o, t) {
        var u = t.config.validateStatus;
        t.status && u && !u(t.status) ? o(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : r(t);
      };
    }, 4840: function(i, d, e) {
      var n = e("825a"), r = e("1c0b"), o = e("b622"), t = o("species");
      i.exports = function(u, s) {
        var a, c = n(u).constructor;
        return c === void 0 || (a = n(c)[t]) == null ? s : r(a);
      };
    }, 4930: function(i, d, e) {
      var n = e("605d"), r = e("2d00"), o = e("d039");
      i.exports = !!Object.getOwnPropertySymbols && !o(function() {
        return !Symbol.sham && (n ? r === 38 : r > 37 && r < 41);
      });
    }, "4a7b": function(i, d, e) {
      var n = e("c532");
      i.exports = function(r, o) {
        o = o || {};
        var t = {}, u = ["url", "method", "data"], s = ["headers", "auth", "proxy", "params"], a = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], c = ["validateStatus"];
        function l(v, h) {
          return n.isPlainObject(v) && n.isPlainObject(h) ? n.merge(v, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function f(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = l(void 0, r[v])) : t[v] = l(r[v], o[v]);
        }
        n.forEach(u, function(v) {
          n.isUndefined(o[v]) || (t[v] = l(void 0, o[v]));
        }), n.forEach(s, f), n.forEach(a, function(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = l(void 0, r[v])) : t[v] = l(void 0, o[v]);
        }), n.forEach(c, function(v) {
          v in o ? t[v] = l(r[v], o[v]) : v in r && (t[v] = l(void 0, r[v]));
        });
        var g = u.concat(s).concat(a).concat(c), p = Object.keys(r).concat(Object.keys(o)).filter(function(v) {
          return g.indexOf(v) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(i, d, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), u = e("9bf2").f, s = e("241c").f, a = e("44e7"), c = e("ad6d"), l = e("9f7f"), f = e("6eeb"), g = e("d039"), p = e("69f3").set, v = e("2626"), h = e("b622"), m = h("match"), y = r.RegExp, j = y.prototype, C = /a/g, x = /a/g, S = new y(C) !== C, b = l.UNSUPPORTED_Y, w = n && o("RegExp", !S || b || g(function() {
        return x[m] = !1, y(C) != C || y(x) == x || y(C, "i") != "/a/i";
      }));
      if (w) {
        for (var O = function(D, J) {
          var ie, H = this instanceof O, V = a(D), M = J === void 0;
          if (!H && V && D.constructor === O && M) return D;
          S ? V && !M && (D = D.source) : D instanceof O && (M && (J = c.call(D)), D = D.source), b && (ie = !!J && J.indexOf("y") > -1, ie && (J = J.replace(/y/g, "")));
          var L = t(S ? new y(D, J) : y(D, J), H ? this : j, O);
          return b && ie && p(L, { sticky: ie }), L;
        }, T = function(D) {
          D in O || u(O, D, { configurable: !0, get: function() {
            return y[D];
          }, set: function(J) {
            y[D] = J;
          } });
        }, _ = s(y), R = 0; _.length > R; ) T(_[R++]);
        j.constructor = O, O.prototype = j, f(r, "RegExp", O);
      }
      v("RegExp");
    }, "4d64": function(i, d, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(u) {
        return function(s, a, c) {
          var l, f = n(s), g = r(f.length), p = o(c, g);
          if (u && a != a) {
            for (; g > p; ) if (l = f[p++], l != l) return !0;
          } else for (; g > p; p++) if ((u || p in f) && f[p] === a) return u || p || 0;
          return !u && -1;
        };
      };
      i.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(i, d, e) {
      var n = e("23e7"), r = e("b727").filter, o = e("1dde"), t = o("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(i, d, e) {
      var n = e("0366"), r = e("7b0b"), o = e("9bdd"), t = e("e95a"), u = e("50c4"), s = e("8418"), a = e("35a1");
      i.exports = function(c) {
        var l, f, g, p, v, h, m = r(c), y = typeof this == "function" ? this : Array, j = arguments.length, C = j > 1 ? arguments[1] : void 0, x = C !== void 0, S = a(m), b = 0;
        if (x && (C = n(C, j > 2 ? arguments[2] : void 0, 2)), S == null || y == Array && t(S)) for (l = u(m.length), f = new y(l); l > b; b++) h = x ? C(m[b], b) : m[b], s(f, b, h);
        else for (p = S.call(m), v = p.next, f = new y(); !(g = v.call(p)).done; b++) h = x ? o(p, C, [g.value, b], !0) : g.value, s(f, b, h);
        return f.length = b, f;
      };
    }, "4f43": function(i, d, e) {
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
    }, "50c4": function(i, d, e) {
      var n = e("a691"), r = Math.min;
      i.exports = function(o) {
        return o > 0 ? r(n(o), 9007199254740991) : 0;
      };
    }, 5135: function(i, d) {
      var e = {}.hasOwnProperty;
      i.exports = function(n, r) {
        return e.call(n, r);
      };
    }, 5270: function(i, d, e) {
      var n = e("c532"), r = e("c401"), o = e("2e67"), t = e("2444");
      function u(s) {
        s.cancelToken && s.cancelToken.throwIfRequested();
      }
      i.exports = function(s) {
        u(s), s.headers = s.headers || {}, s.data = r(s.data, s.headers, s.transformRequest), s.headers = n.merge(s.headers.common || {}, s.headers[s.method] || {}, s.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(c) {
          delete s.headers[c];
        });
        var a = s.adapter || t.adapter;
        return a(s).then(function(c) {
          return u(s), c.data = r(c.data, c.headers, s.transformResponse), c;
        }, function(c) {
          return o(c) || (u(s), c && c.response && (c.response.data = r(c.response.data, c.response.headers, s.transformResponse))), Promise.reject(c);
        });
      };
    }, 5319: function(i, d, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), u = e("1d80"), s = e("8aa5"), a = e("0cb2"), c = e("14c3"), l = Math.max, f = Math.min, g = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, v, h, m) {
        var y = m.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, j = m.REPLACE_KEEPS_$0, C = y ? "$" : "$0";
        return [function(x, S) {
          var b = u(this), w = x == null ? void 0 : x[p];
          return w !== void 0 ? w.call(x, b, S) : v.call(String(b), x, S);
        }, function(x, S) {
          if (!y && j || typeof S == "string" && S.indexOf(C) === -1) {
            var b = h(v, x, this, S);
            if (b.done) return b.value;
          }
          var w = r(x), O = String(this), T = typeof S == "function";
          T || (S = String(S));
          var _ = w.global;
          if (_) {
            var R = w.unicode;
            w.lastIndex = 0;
          }
          for (var D = []; ; ) {
            var J = c(w, O);
            if (J === null || (D.push(J), !_)) break;
            var ie = String(J[0]);
            ie === "" && (w.lastIndex = s(O, o(w.lastIndex), R));
          }
          for (var H = "", V = 0, M = 0; M < D.length; M++) {
            J = D[M];
            for (var L = String(J[0]), A = l(f(t(J.index), O.length), 0), z = [], te = 1; te < J.length; te++) z.push(g(J[te]));
            var U = J.groups;
            if (T) {
              var xe = [L].concat(z, A, O);
              U !== void 0 && xe.push(U);
              var ve = String(S.apply(void 0, xe));
            } else ve = a(L, O, A, z, U, S);
            A >= V && (H += O.slice(V, A) + ve, V = A + L.length);
          }
          return H + O.slice(V);
        }];
      });
    }, "545a": function(i, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), d.default = u;
    }, 5530: function(i, d, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, r) {
        var o = n.document, t = o.documentElement, u = o.querySelector('meta[name="viewport"]'), s = o.querySelector('meta[name="flexible"]'), a = 0, c = 0, l = r.flexible || (r.flexible = {});
        if (u) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = u.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (c = parseFloat(f[1]), a = parseInt(1 / c));
        } else if (s) {
          var g = s.getAttribute("content");
          if (g) {
            var p = g.match(/initial\-dpr=([\d\.]+)/), v = g.match(/maximum\-dpr=([\d\.]+)/);
            p && (a = parseFloat(p[1]), c = parseFloat((1 / a).toFixed(2))), v && (a = parseFloat(v[1]), c = parseFloat((1 / a).toFixed(2)));
          }
        }
        if (!a && !c) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), m = n.devicePixelRatio;
          a = h ? m >= 3 && (!a || a >= 3) ? 3 : m >= 2 && (!a || a >= 2) ? 2 : 1 : 1, c = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !u) if (u = o.createElement("meta"), u.setAttribute("name", "viewport"), u.setAttribute("content", "initial-scale=" + c + ", maximum-scale=" + c + ", minimum-scale=" + c + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(u);
        else {
          var y = o.createElement("div");
          y.appendChild(u), o.write(y.innerHTML);
        }
        function j() {
          var C = t.getBoundingClientRect().width, x = C / 10;
          t.style.fontSize = x + "px", l.rem = n.rem = x;
        }
        n.addEventListener("resize", function() {
          j();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && j();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * a + "px" : o.addEventListener("DOMContentLoaded", function(C) {
          o.body.style.fontSize = 10 * a + "px";
        }, !1), j(), l.dpr = n.dpr = a, l.refreshRem = j, l.rem2px = function(C) {
          var x = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (x += "px"), x;
        }, l.px2rem = function(C) {
          var x = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (x += "rem"), x;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(i, d, e) {
      var n = e("c430"), r = e("c6cd");
      (i.exports = function(o, t) {
        return r[o] || (r[o] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(i, d, e) {
      var n = e("d066"), r = e("241c"), o = e("7418"), t = e("825a");
      i.exports = n("Reflect", "ownKeys") || function(u) {
        var s = r.f(t(u)), a = o.f;
        return a ? s.concat(a(u)) : s;
      };
    }, "5a34": function(i, d, e) {
      var n = e("44e7");
      i.exports = function(r) {
        if (n(r)) throw TypeError("The method doesn't accept regular expressions");
        return r;
      };
    }, "5c6c": function(i, d) {
      i.exports = function(e, n) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n };
      };
    }, "5f02": function(i, d, e) {
      i.exports = function(n) {
        return typeof n == "object" && n.isAxiosError === !0;
      };
    }, "605d": function(i, d, e) {
      var n = e("c6b6"), r = e("da84");
      i.exports = n(r.process) == "process";
    }, 6062: function(i, d, e) {
      var n = e("6d61"), r = e("6566");
      i.exports = n("Set", function(o) {
        return function() {
          return o(this, arguments.length ? arguments[0] : void 0);
        };
      }, r);
    }, 6547: function(i, d, e) {
      var n = e("a691"), r = e("1d80"), o = function(t) {
        return function(u, s) {
          var a, c, l = String(r(u)), f = n(s), g = l.length;
          return f < 0 || f >= g ? t ? "" : void 0 : (a = l.charCodeAt(f), a < 55296 || a > 56319 || f + 1 === g || (c = l.charCodeAt(f + 1)) < 56320 || c > 57343 ? t ? l.charAt(f) : a : t ? l.slice(f, f + 2) : c - 56320 + (a - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(i, d, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), u = e("19aa"), s = e("2266"), a = e("7dd0"), c = e("2626"), l = e("83ab"), f = e("f183").fastKey, g = e("69f3"), p = g.set, v = g.getterFor;
      i.exports = { getConstructor: function(h, m, y, j) {
        var C = h(function(w, O) {
          u(w, C, m), p(w, { type: m, index: r(null), first: void 0, last: void 0, size: 0 }), l || (w.size = 0), O != null && s(O, w[j], { that: w, AS_ENTRIES: y });
        }), x = v(m), S = function(w, O, T) {
          var _, R, D = x(w), J = b(w, O);
          return J ? J.value = T : (D.last = J = { index: R = f(O, !0), key: O, value: T, previous: _ = D.last, next: void 0, removed: !1 }, D.first || (D.first = J), _ && (_.next = J), l ? D.size++ : w.size++, R !== "F" && (D.index[R] = J)), w;
        }, b = function(w, O) {
          var T, _ = x(w), R = f(O);
          if (R !== "F") return _.index[R];
          for (T = _.first; T; T = T.next) if (T.key == O) return T;
        };
        return o(C.prototype, { clear: function() {
          for (var w = this, O = x(w), T = O.index, _ = O.first; _; ) _.removed = !0, _.previous && (_.previous = _.previous.next = void 0), delete T[_.index], _ = _.next;
          O.first = O.last = void 0, l ? O.size = 0 : w.size = 0;
        }, delete: function(w) {
          var O = this, T = x(O), _ = b(O, w);
          if (_) {
            var R = _.next, D = _.previous;
            delete T.index[_.index], _.removed = !0, D && (D.next = R), R && (R.previous = D), T.first == _ && (T.first = R), T.last == _ && (T.last = D), l ? T.size-- : O.size--;
          }
          return !!_;
        }, forEach: function(w) {
          for (var O, T = x(this), _ = t(w, arguments.length > 1 ? arguments[1] : void 0, 3); O = O ? O.next : T.first; )
            for (_(O.value, O.key, this); O && O.removed; ) O = O.previous;
        }, has: function(w) {
          return !!b(this, w);
        } }), o(C.prototype, y ? { get: function(w) {
          var O = b(this, w);
          return O && O.value;
        }, set: function(w, O) {
          return S(this, w === 0 ? 0 : w, O);
        } } : { add: function(w) {
          return S(this, w = w === 0 ? 0 : w, w);
        } }), l && n(C.prototype, "size", { get: function() {
          return x(this).size;
        } }), C;
      }, setStrong: function(h, m, y) {
        var j = m + " Iterator", C = v(m), x = v(j);
        a(h, m, function(S, b) {
          p(this, { type: j, target: S, state: C(S), kind: b, last: void 0 });
        }, function() {
          for (var S = x(this), b = S.kind, w = S.last; w && w.removed; ) w = w.previous;
          return S.target && (S.last = w = w ? w.next : S.state.first) ? b == "keys" ? { value: w.key, done: !1 } : b == "values" ? { value: w.value, done: !1 } : { value: [w.key, w.value], done: !1 } : (S.target = void 0, { value: void 0, done: !0 });
        }, y ? "entries" : "values", !y, !0), c(m);
      } };
    }, "65f0": function(i, d, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      i.exports = function(u, s) {
        var a;
        return r(u) && (a = u.constructor, typeof a != "function" || a !== Array && !r(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(s === 0 ? 0 : s);
      };
    }, "69f3": function(i, d, e) {
      var n, r, o, t = e("7f9a"), u = e("da84"), s = e("861d"), a = e("9112"), c = e("5135"), l = e("c6cd"), f = e("f772"), g = e("d012"), p = u.WeakMap, v = function(S) {
        return o(S) ? r(S) : n(S, {});
      }, h = function(S) {
        return function(b) {
          var w;
          if (!s(b) || (w = r(b)).type !== S) throw TypeError("Incompatible receiver, " + S + " required");
          return w;
        };
      };
      if (t) {
        var m = l.state || (l.state = new p()), y = m.get, j = m.has, C = m.set;
        n = function(S, b) {
          return b.facade = S, C.call(m, S, b), b;
        }, r = function(S) {
          return y.call(m, S) || {};
        }, o = function(S) {
          return j.call(m, S);
        };
      } else {
        var x = f("state");
        g[x] = !0, n = function(S, b) {
          return b.facade = S, a(S, x, b), b;
        }, r = function(S) {
          return c(S, x) ? S[x] : {};
        }, o = function(S) {
          return c(S, x);
        };
      }
      i.exports = { set: n, get: r, has: o, enforce: v, getterFor: h };
    }, "6d55": function(i, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), d.default = u;
    }, "6d61": function(i, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), u = e("f183"), s = e("2266"), a = e("19aa"), c = e("861d"), l = e("d039"), f = e("1c7e"), g = e("d44e"), p = e("7156");
      i.exports = function(v, h, m) {
        var y = v.indexOf("Map") !== -1, j = v.indexOf("Weak") !== -1, C = y ? "set" : "add", x = r[v], S = x && x.prototype, b = x, w = {}, O = function(H) {
          var V = S[H];
          t(S, H, H == "add" ? function(M) {
            return V.call(this, M === 0 ? 0 : M), this;
          } : H == "delete" ? function(M) {
            return !(j && !c(M)) && V.call(this, M === 0 ? 0 : M);
          } : H == "get" ? function(M) {
            return j && !c(M) ? void 0 : V.call(this, M === 0 ? 0 : M);
          } : H == "has" ? function(M) {
            return !(j && !c(M)) && V.call(this, M === 0 ? 0 : M);
          } : function(M, L) {
            return V.call(this, M === 0 ? 0 : M, L), this;
          });
        }, T = o(v, typeof x != "function" || !(j || S.forEach && !l(function() {
          new x().entries().next();
        })));
        if (T) b = m.getConstructor(h, v, y, C), u.REQUIRED = !0;
        else if (o(v, !0)) {
          var _ = new b(), R = _[C](j ? {} : -0, 1) != _, D = l(function() {
            _.has(1);
          }), J = f(function(H) {
            new x(H);
          }), ie = !j && l(function() {
            for (var H = new x(), V = 5; V--; ) H[C](V, V);
            return !H.has(-0);
          });
          J || (b = h(function(H, V) {
            a(H, b, v);
            var M = p(new x(), H, b);
            return V != null && s(V, M[C], { that: M, AS_ENTRIES: y }), M;
          }), b.prototype = S, S.constructor = b), (D || ie) && (O("delete"), O("has"), y && O("get")), (ie || R) && O(C), j && S.clear && delete S.clear;
        }
        return w[v] = b, n({ global: !0, forced: b != x }, w), g(b, v), j || m.setStrong(b, v, y), b;
      };
    }, "6eeb": function(i, d, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), u = e("8925"), s = e("69f3"), a = s.get, c = s.enforce, l = String(String).split("String");
      (i.exports = function(f, g, p, v) {
        var h, m = !!v && !!v.unsafe, y = !!v && !!v.enumerable, j = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof g != "string" || o(p, "name") || r(p, "name", g), h = c(p), h.source || (h.source = l.join(typeof g == "string" ? g : ""))), f !== n ? (m ? !j && f[g] && (y = !0) : delete f[g], y ? f[g] = p : r(f, g, p)) : y ? f[g] = p : t(g, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && a(this).source || u(this);
      });
    }, "70d3": function(i, d, e) {
    }, 7156: function(i, d, e) {
      var n = e("861d"), r = e("d2bb");
      i.exports = function(o, t, u) {
        var s, a;
        return r && typeof (s = t.constructor) == "function" && s !== u && n(a = s.prototype) && a !== u.prototype && r(o, a), o;
      };
    }, 7305: function(i, d, e) {
    }, 7320: function(i, d, e) {
    }, 7418: function(i, d) {
      d.f = Object.getOwnPropertySymbols;
    }, "746f": function(i, d, e) {
      var n = e("428f"), r = e("5135"), o = e("e538"), t = e("9bf2").f;
      i.exports = function(u) {
        var s = n.Symbol || (n.Symbol = {});
        r(s, u) || t(s, u, { value: o.f(u) });
      };
    }, 7839: function(i, d) {
      i.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(i, d, e) {
      function n(r) {
        this.message = r;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, i.exports = n;
    }, "7aac": function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(r, o, t, u, s, a) {
          var c = [];
          c.push(r + "=" + encodeURIComponent(o)), n.isNumber(t) && c.push("expires=" + new Date(t).toGMTString()), n.isString(u) && c.push("path=" + u), n.isString(s) && c.push("domain=" + s), a === !0 && c.push("secure"), document.cookie = c.join("; ");
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
    }, "7b0b": function(i, d, e) {
      var n = e("1d80");
      i.exports = function(r) {
        return Object(n(r));
      };
    }, "7c73": function(i, d, e) {
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), u = e("d012"), s = e("1be4"), a = e("cc12"), c = e("f772"), l = ">", f = "<", g = "prototype", p = "script", v = c("IE_PROTO"), h = function() {
      }, m = function(x) {
        return f + p + l + x + f + "/" + p + l;
      }, y = function(x) {
        x.write(m("")), x.close();
        var S = x.parentWindow.Object;
        return x = null, S;
      }, j = function() {
        var x, S = a("iframe"), b = "java" + p + ":";
        return S.style.display = "none", s.appendChild(S), S.src = String(b), x = S.contentWindow.document, x.open(), x.write(m("document.F=Object")), x.close(), x.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? y(n) : j();
        for (var x = t.length; x--; ) delete C[g][t[x]];
        return C();
      };
      u[v] = !0, i.exports = Object.create || function(x, S) {
        var b;
        return x !== null ? (h[g] = r(x), b = new h(), h[g] = null, b[v] = x) : b = C(), S === void 0 ? b : o(b, S);
      };
    }, "7db0": function(i, d, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", u = !0;
      t in [] && Array(1)[t](function() {
        u = !1;
      }), n({ target: "Array", proto: !0, forced: u }, { find: function(s) {
        return r(this, s, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(i, d, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), u = e("d44e"), s = e("9112"), a = e("6eeb"), c = e("b622"), l = e("c430"), f = e("3f8c"), g = e("ae93"), p = g.IteratorPrototype, v = g.BUGGY_SAFARI_ITERATORS, h = c("iterator"), m = "keys", y = "values", j = "entries", C = function() {
        return this;
      };
      i.exports = function(x, S, b, w, O, T, _) {
        r(b, S, w);
        var R, D, J, ie = function(te) {
          if (te === O && A) return A;
          if (!v && te in M) return M[te];
          switch (te) {
            case m:
              return function() {
                return new b(this, te);
              };
            case y:
              return function() {
                return new b(this, te);
              };
            case j:
              return function() {
                return new b(this, te);
              };
          }
          return function() {
            return new b(this);
          };
        }, H = S + " Iterator", V = !1, M = x.prototype, L = M[h] || M["@@iterator"] || O && M[O], A = !v && L || ie(O), z = S == "Array" && M.entries || L;
        if (z && (R = o(z.call(new x())), p !== Object.prototype && R.next && (l || o(R) === p || (t ? t(R, p) : typeof R[h] != "function" && s(R, h, C)), u(R, H, !0, !0), l && (f[H] = C))), O == y && L && L.name !== y && (V = !0, A = function() {
          return L.call(this);
        }), l && !_ || M[h] === A || s(M, h, A), f[S] = A, O) if (D = { values: ie(y), keys: T ? A : ie(m), entries: ie(j) }, _) for (J in D) (v || V || !(J in M)) && a(M, J, D[J]);
        else n({ target: S, proto: !0, forced: v || V }, D);
        return D;
      };
    }, "7eb5": function(i, d, e) {
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
    }, "7f9a": function(i, d, e) {
      var n = e("da84"), r = e("8925"), o = n.WeakMap;
      i.exports = typeof o == "function" && /native code/.test(r(o));
    }, "825a": function(i, d, e) {
      var n = e("861d");
      i.exports = function(r) {
        if (!n(r)) throw TypeError(String(r) + " is not an object");
        return r;
      };
    }, "83ab": function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(i, d, e) {
      var n = e("d925"), r = e("e683");
      i.exports = function(o, t) {
        return o && !n(t) ? r(o, t) : t;
      };
    }, 8418: function(i, d, e) {
      var n = e("c04e"), r = e("9bf2"), o = e("5c6c");
      i.exports = function(t, u, s) {
        var a = n(u);
        a in t ? r.f(t, a, o(0, s)) : t[a] = s;
      };
    }, "861d": function(i, d) {
      i.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(i, d, e) {
      var n, r, o;
      (function(t, u) {
        r = [], n = u, o = typeof n == "function" ? n.apply(d, r) : n, o === void 0 || (i.exports = o);
      })(typeof self < "u" && self, function() {
        function t() {
          var u = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!u && "currentScript" in document && document.currentScript || u && u.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (j) {
            var s, a, c, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, g = l.exec(j.stack) || f.exec(j.stack), p = g && g[1] || !1, v = g && g[2] || !1, h = document.location.href.replace(document.location.hash, ""), m = document.getElementsByTagName("script");
            p === h && (s = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), c = s.replace(a, "$1").trim());
            for (var y = 0; y < m.length; y++)
              if (m[y].readyState === "interactive" || m[y].src === p || p === h && m[y].innerHTML && m[y].innerHTML.trim() === c) return m[y];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(i, d, e) {
      var n = e("c6cd"), r = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(o) {
        return r.call(o);
      }), i.exports = n.inspectSource;
    }, "8aa5": function(i, d, e) {
      var n = e("6547").charAt;
      i.exports = function(r, o, t) {
        return o + (t ? n(r, o).length : 1);
      };
    }, "8bbf": function(i, d) {
      i.exports = Z;
    }, "8df4": function(i, d, e) {
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
      }, i.exports = r;
    }, "90e3": function(i, d) {
      var e = 0, n = Math.random();
      i.exports = function(r) {
        return "Symbol(" + String(r === void 0 ? "" : r) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(i, d, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("5c6c");
      i.exports = n ? function(t, u, s) {
        return r.f(t, u, o(1, s));
      } : function(t, u, s) {
        return t[u] = s, t;
      };
    }, 9263: function(i, d, e) {
      var n = e("ad6d"), r = e("9f7f"), o = RegExp.prototype.exec, t = String.prototype.replace, u = o, s = function() {
        var f = /a/, g = /b*/g;
        return o.call(f, "a"), o.call(g, "a"), f.lastIndex !== 0 || g.lastIndex !== 0;
      }(), a = r.UNSUPPORTED_Y || r.BROKEN_CARET, c = /()??/.exec("")[1] !== void 0, l = s || c || a;
      l && (u = function(f) {
        var g, p, v, h, m = this, y = a && m.sticky, j = n.call(m), C = m.source, x = 0, S = f;
        return y && (j = j.replace("y", ""), j.indexOf("g") === -1 && (j += "g"), S = String(f).slice(m.lastIndex), m.lastIndex > 0 && (!m.multiline || m.multiline && f[m.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", S = " " + S, x++), p = new RegExp("^(?:" + C + ")", j)), c && (p = new RegExp("^" + C + "$(?!\\s)", j)), s && (g = m.lastIndex), v = o.call(y ? p : m, S), y ? v ? (v.input = v.input.slice(x), v[0] = v[0].slice(x), v.index = m.lastIndex, m.lastIndex += v[0].length) : m.lastIndex = 0 : s && v && (m.lastIndex = m.global ? v.index + v[0].length : g), c && v && v.length > 1 && t.call(v[0], p, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (v[h] = void 0);
        }), v;
      }), i.exports = u;
    }, "94ca": function(i, d, e) {
      var n = e("d039"), r = /#|\.prototype\./, o = function(c, l) {
        var f = u[t(c)];
        return f == a || f != s && (typeof l == "function" ? n(l) : !!l);
      }, t = o.normalize = function(c) {
        return String(c).replace(r, ".").toLowerCase();
      }, u = o.data = {}, s = o.NATIVE = "N", a = o.POLYFILL = "P";
      i.exports = o;
    }, "95d9": function(i, d, e) {
    }, "96cf": function(i, d) {
      (function(e) {
        var n, r = Object.prototype, o = r.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, u = t.iterator || "@@iterator", s = t.asyncIterator || "@@asyncIterator", a = t.toStringTag || "@@toStringTag", c = typeof i == "object", l = e.regeneratorRuntime;
        if (l) c && (i.exports = l);
        else {
          l = e.regeneratorRuntime = c ? i.exports : {}, l.wrap = x;
          var f = "suspendedStart", g = "suspendedYield", p = "executing", v = "completed", h = {}, m = {};
          m[u] = function() {
            return this;
          };
          var y = Object.getPrototypeOf, j = y && y(y(V([])));
          j && j !== r && o.call(j, u) && (m = j);
          var C = O.prototype = b.prototype = Object.create(m);
          w.prototype = C.constructor = O, O.constructor = w, O[a] = w.displayName = "GeneratorFunction", l.isGeneratorFunction = function(L) {
            var A = typeof L == "function" && L.constructor;
            return !!A && (A === w || (A.displayName || A.name) === "GeneratorFunction");
          }, l.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, O) : (L.__proto__ = O, a in L || (L[a] = "GeneratorFunction")), L.prototype = Object.create(C), L;
          }, l.awrap = function(L) {
            return { __await: L };
          }, T(_.prototype), _.prototype[s] = function() {
            return this;
          }, l.AsyncIterator = _, l.async = function(L, A, z, te) {
            var U = new _(x(L, A, z, te));
            return l.isGeneratorFunction(A) ? U : U.next().then(function(xe) {
              return xe.done ? xe.value : U.next();
            });
          }, T(C), C[a] = "Generator", C[u] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, l.keys = function(L) {
            var A = [];
            for (var z in L) A.push(z);
            return A.reverse(), function te() {
              for (; A.length; ) {
                var U = A.pop();
                if (U in L) return te.value = U, te.done = !1, te;
              }
              return te.done = !0, te;
            };
          }, l.values = V, H.prototype = { constructor: H, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ie), !L) for (var A in this) A.charAt(0) === "t" && o.call(this, A) && !isNaN(+A.slice(1)) && (this[A] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], A = L.completion;
            if (A.type === "throw") throw A.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var A = this;
            function z(Ue, Be) {
              return xe.type = "throw", xe.arg = L, A.next = Ue, Be && (A.method = "next", A.arg = n), !!Be;
            }
            for (var te = this.tryEntries.length - 1; te >= 0; --te) {
              var U = this.tryEntries[te], xe = U.completion;
              if (U.tryLoc === "root") return z("end");
              if (U.tryLoc <= this.prev) {
                var ve = o.call(U, "catchLoc"), Pe = o.call(U, "finallyLoc");
                if (ve && Pe) {
                  if (this.prev < U.catchLoc) return z(U.catchLoc, !0);
                  if (this.prev < U.finallyLoc) return z(U.finallyLoc);
                } else if (ve) {
                  if (this.prev < U.catchLoc) return z(U.catchLoc, !0);
                } else {
                  if (!Pe) throw new Error("try statement without catch or finally");
                  if (this.prev < U.finallyLoc) return z(U.finallyLoc);
                }
              }
            }
          }, abrupt: function(L, A) {
            for (var z = this.tryEntries.length - 1; z >= 0; --z) {
              var te = this.tryEntries[z];
              if (te.tryLoc <= this.prev && o.call(te, "finallyLoc") && this.prev < te.finallyLoc) {
                var U = te;
                break;
              }
            }
            U && (L === "break" || L === "continue") && U.tryLoc <= A && A <= U.finallyLoc && (U = null);
            var xe = U ? U.completion : {};
            return xe.type = L, xe.arg = A, U ? (this.method = "next", this.next = U.finallyLoc, h) : this.complete(xe);
          }, complete: function(L, A) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && A && (this.next = A), h;
          }, finish: function(L) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var z = this.tryEntries[A];
              if (z.finallyLoc === L) return this.complete(z.completion, z.afterLoc), ie(z), h;
            }
          }, catch: function(L) {
            for (var A = this.tryEntries.length - 1; A >= 0; --A) {
              var z = this.tryEntries[A];
              if (z.tryLoc === L) {
                var te = z.completion;
                if (te.type === "throw") {
                  var U = te.arg;
                  ie(z);
                }
                return U;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(L, A, z) {
            return this.delegate = { iterator: V(L), resultName: A, nextLoc: z }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function x(L, A, z, te) {
          var U = A && A.prototype instanceof b ? A : b, xe = Object.create(U.prototype), ve = new H(te || []);
          return xe._invoke = R(L, z, ve), xe;
        }
        function S(L, A, z) {
          try {
            return { type: "normal", arg: L.call(A, z) };
          } catch (te) {
            return { type: "throw", arg: te };
          }
        }
        function b() {
        }
        function w() {
        }
        function O() {
        }
        function T(L) {
          ["next", "throw", "return"].forEach(function(A) {
            L[A] = function(z) {
              return this._invoke(A, z);
            };
          });
        }
        function _(L) {
          function A(U, xe, ve, Pe) {
            var Ue = S(L[U], L, xe);
            if (Ue.type !== "throw") {
              var Be = Ue.arg, Le = Be.value;
              return Le && typeof Le == "object" && o.call(Le, "__await") ? Promise.resolve(Le.__await).then(function(Ae) {
                A("next", Ae, ve, Pe);
              }, function(Ae) {
                A("throw", Ae, ve, Pe);
              }) : Promise.resolve(Le).then(function(Ae) {
                Be.value = Ae, ve(Be);
              }, Pe);
            }
            Pe(Ue.arg);
          }
          var z;
          function te(U, xe) {
            function ve() {
              return new Promise(function(Pe, Ue) {
                A(U, xe, Pe, Ue);
              });
            }
            return z = z ? z.then(ve, ve) : ve();
          }
          this._invoke = te;
        }
        function R(L, A, z) {
          var te = f;
          return function(U, xe) {
            if (te === p) throw new Error("Generator is already running");
            if (te === v) {
              if (U === "throw") throw xe;
              return M();
            }
            for (z.method = U, z.arg = xe; ; ) {
              var ve = z.delegate;
              if (ve) {
                var Pe = D(ve, z);
                if (Pe) {
                  if (Pe === h) continue;
                  return Pe;
                }
              }
              if (z.method === "next") z.sent = z._sent = z.arg;
              else if (z.method === "throw") {
                if (te === f) throw te = v, z.arg;
                z.dispatchException(z.arg);
              } else z.method === "return" && z.abrupt("return", z.arg);
              te = p;
              var Ue = S(L, A, z);
              if (Ue.type === "normal") {
                if (te = z.done ? v : g, Ue.arg === h) continue;
                return { value: Ue.arg, done: z.done };
              }
              Ue.type === "throw" && (te = v, z.method = "throw", z.arg = Ue.arg);
            }
          };
        }
        function D(L, A) {
          var z = L.iterator[A.method];
          if (z === n) {
            if (A.delegate = null, A.method === "throw") {
              if (L.iterator.return && (A.method = "return", A.arg = n, D(L, A), A.method === "throw")) return h;
              A.method = "throw", A.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var te = S(z, L.iterator, A.arg);
          if (te.type === "throw") return A.method = "throw", A.arg = te.arg, A.delegate = null, h;
          var U = te.arg;
          return U ? U.done ? (A[L.resultName] = U.value, A.next = L.nextLoc, A.method !== "return" && (A.method = "next", A.arg = n), A.delegate = null, h) : U : (A.method = "throw", A.arg = new TypeError("iterator result is not an object"), A.delegate = null, h);
        }
        function J(L) {
          var A = { tryLoc: L[0] };
          1 in L && (A.catchLoc = L[1]), 2 in L && (A.finallyLoc = L[2], A.afterLoc = L[3]), this.tryEntries.push(A);
        }
        function ie(L) {
          var A = L.completion || {};
          A.type = "normal", delete A.arg, L.completion = A;
        }
        function H(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(J, this), this.reset(!0);
        }
        function V(L) {
          if (L) {
            var A = L[u];
            if (A) return A.call(L);
            if (typeof L.next == "function") return L;
            if (!isNaN(L.length)) {
              var z = -1, te = function U() {
                for (; ++z < L.length; ) if (o.call(L, z)) return U.value = L[z], U.done = !1, U;
                return U.value = n, U.done = !0, U;
              };
              return te.next = te;
            }
          }
          return { next: M };
        }
        function M() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), u = e("7b0b"), s = e("50c4"), a = e("8418"), c = e("65f0"), l = e("1dde"), f = e("b622"), g = e("2d00"), p = f("isConcatSpreadable"), v = 9007199254740991, h = "Maximum allowed index exceeded", m = g >= 51 || !r(function() {
        var x = [];
        return x[p] = !1, x.concat()[0] !== x;
      }), y = l("concat"), j = function(x) {
        if (!t(x)) return !1;
        var S = x[p];
        return S !== void 0 ? !!S : o(x);
      }, C = !m || !y;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(x) {
        var S, b, w, O, T, _ = u(this), R = c(_, 0), D = 0;
        for (S = -1, w = arguments.length; S < w; S++) if (T = S === -1 ? _ : arguments[S], j(T)) {
          if (O = s(T.length), D + O > v) throw TypeError(h);
          for (b = 0; b < O; b++, D++) b in T && a(R, D, T[b]);
        } else {
          if (D >= v) throw TypeError(h);
          a(R, D++, T);
        }
        return R.length = D, R;
      } });
    }, "9aaf": function(i, d, e) {
      e("70d3");
    }, "9bdd": function(i, d, e) {
      var n = e("825a"), r = e("2a62");
      i.exports = function(o, t, u, s) {
        try {
          return s ? t(n(u)[0], u[1]) : t(u);
        } catch (a) {
          throw r(o), a;
        }
      };
    }, "9bf2": function(i, d, e) {
      var n = e("83ab"), r = e("0cfb"), o = e("825a"), t = e("c04e"), u = Object.defineProperty;
      d.f = n ? u : function(s, a, c) {
        if (o(s), a = t(a, !0), o(c), r) try {
          return u(s, a, c);
        } catch {
        }
        if ("get" in c || "set" in c) throw TypeError("Accessors not supported");
        return "value" in c && (s[a] = c.value), s;
      };
    }, "9ed3": function(i, d, e) {
      var n = e("ae93").IteratorPrototype, r = e("7c73"), o = e("5c6c"), t = e("d44e"), u = e("3f8c"), s = function() {
        return this;
      };
      i.exports = function(a, c, l) {
        var f = c + " Iterator";
        return a.prototype = r(n, { next: o(1, l) }), t(a, f, !1, !0), u[f] = s, a;
      };
    }, "9f7f": function(i, d, e) {
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
    }, a434: function(i, d, e) {
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), u = e("7b0b"), s = e("65f0"), a = e("8418"), c = e("1dde"), l = c("splice"), f = Math.max, g = Math.min, p = 9007199254740991, v = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, m) {
        var y, j, C, x, S, b, w = u(this), O = t(w.length), T = r(h, O), _ = arguments.length;
        if (_ === 0 ? y = j = 0 : _ === 1 ? (y = 0, j = O - T) : (y = _ - 2, j = g(f(o(m), 0), O - T)), O + y - j > p) throw TypeError(v);
        for (C = s(w, j), x = 0; x < j; x++) S = T + x, S in w && a(C, x, w[S]);
        if (C.length = j, y < j) {
          for (x = T; x < O - j; x++) S = x + j, b = x + y, S in w ? w[b] = w[S] : delete w[b];
          for (x = O; x > O - j + y; x--) delete w[x - 1];
        } else if (y > j) for (x = O - j; x > T; x--) S = x + j - 1, b = x + y - 1, S in w ? w[b] = w[S] : delete w[b];
        for (x = 0; x < y; x++) w[x + T] = arguments[x + 2];
        return w.length = O - j + y, C;
      } });
    }, a4b4: function(i, d, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), u = e("83ab"), s = e("4930"), a = e("fdbf"), c = e("d039"), l = e("5135"), f = e("e8b5"), g = e("861d"), p = e("825a"), v = e("7b0b"), h = e("fc6a"), m = e("c04e"), y = e("5c6c"), j = e("7c73"), C = e("df75"), x = e("241c"), S = e("057f"), b = e("7418"), w = e("06cf"), O = e("9bf2"), T = e("d1e7"), _ = e("9112"), R = e("6eeb"), D = e("5692"), J = e("f772"), ie = e("d012"), H = e("90e3"), V = e("b622"), M = e("e538"), L = e("746f"), A = e("d44e"), z = e("69f3"), te = e("b727").forEach, U = J("hidden"), xe = "Symbol", ve = "prototype", Pe = V("toPrimitive"), Ue = z.set, Be = z.getterFor(xe), Le = Object[ve], Ae = r.Symbol, ze = o("JSON", "stringify"), Xe = w.f, N = O.f, B = S.f, X = T.f, F = D("symbols"), ne = D("op-symbols"), oe = D("string-to-symbol-registry"), ye = D("symbol-to-string-registry"), he = D("wks"), le = r.QObject, ke = !le || !le[ve] || !le[ve].findChild, Oe = u && c(function() {
        return j(N({}, "a", { get: function() {
          return N(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, re, ce) {
        var ge = Xe(Le, re);
        ge && delete Le[re], N(q, re, ce), ge && q !== Le && N(Le, re, ge);
      } : N, Re = function(q, re) {
        var ce = F[q] = j(Ae[ve]);
        return Ue(ce, { type: xe, tag: q, description: re }), u || (ce.description = re), ce;
      }, Y = a ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Ae;
      }, W = function(q, re, ce) {
        q === Le && W(ne, re, ce), p(q);
        var ge = m(re, !0);
        return p(ce), l(F, ge) ? (ce.enumerable ? (l(q, U) && q[U][ge] && (q[U][ge] = !1), ce = j(ce, { enumerable: y(0, !1) })) : (l(q, U) || N(q, U, y(1, {})), q[U][ge] = !0), Oe(q, ge, ce)) : N(q, ge, ce);
      }, se = function(q, re) {
        p(q);
        var ce = h(re), ge = C(ce).concat(fe(ce));
        return te(ge, function(De) {
          u && !at.call(ce, De) || W(q, De, ce[De]);
        }), q;
      }, We = function(q, re) {
        return re === void 0 ? j(q) : se(j(q), re);
      }, at = function(q) {
        var re = m(q, !0), ce = X.call(this, re);
        return !(this === Le && l(F, re) && !l(ne, re)) && (!(ce || !l(this, re) || !l(F, re) || l(this, U) && this[U][re]) || ce);
      }, K = function(q, re) {
        var ce = h(q), ge = m(re, !0);
        if (ce !== Le || !l(F, ge) || l(ne, ge)) {
          var De = Xe(ce, ge);
          return !De || !l(F, ge) || l(ce, U) && ce[U][ge] || (De.enumerable = !0), De;
        }
      }, ae = function(q) {
        var re = B(h(q)), ce = [];
        return te(re, function(ge) {
          l(F, ge) || l(ie, ge) || ce.push(ge);
        }), ce;
      }, fe = function(q) {
        var re = q === Le, ce = B(re ? ne : h(q)), ge = [];
        return te(ce, function(De) {
          !l(F, De) || re && !l(Le, De) || ge.push(F[De]);
        }), ge;
      };
      if (s || (Ae = function() {
        if (this instanceof Ae) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, re = H(q), ce = function(ge) {
          this === Le && ce.call(ne, ge), l(this, U) && l(this[U], re) && (this[U][re] = !1), Oe(this, re, y(1, ge));
        };
        return u && ke && Oe(Le, re, { configurable: !0, set: ce }), Re(re, q);
      }, R(Ae[ve], "toString", function() {
        return Be(this).tag;
      }), R(Ae, "withoutSetter", function(q) {
        return Re(H(q), q);
      }), T.f = at, O.f = W, w.f = K, x.f = S.f = ae, b.f = fe, M.f = function(q) {
        return Re(V(q), q);
      }, u && (N(Ae[ve], "description", { configurable: !0, get: function() {
        return Be(this).description;
      } }), t || R(Le, "propertyIsEnumerable", at, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !s, sham: !s }, { Symbol: Ae }), te(C(he), function(q) {
        L(q);
      }), n({ target: xe, stat: !0, forced: !s }, { for: function(q) {
        var re = String(q);
        if (l(oe, re)) return oe[re];
        var ce = Ae(re);
        return oe[re] = ce, ye[ce] = re, ce;
      }, keyFor: function(q) {
        if (!Y(q)) throw TypeError(q + " is not a symbol");
        if (l(ye, q)) return ye[q];
      }, useSetter: function() {
        ke = !0;
      }, useSimple: function() {
        ke = !1;
      } }), n({ target: "Object", stat: !0, forced: !s, sham: !u }, { create: We, defineProperty: W, defineProperties: se, getOwnPropertyDescriptor: K }), n({ target: "Object", stat: !0, forced: !s }, { getOwnPropertyNames: ae, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: c(function() {
        b.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return b.f(v(q));
      } }), ze) {
        var me = !s || c(function() {
          var q = Ae();
          return ze([q]) != "[null]" || ze({ a: q }) != "{}" || ze(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: me }, { stringify: function(q, re, ce) {
          for (var ge, De = [q], Ke = 1; arguments.length > Ke; ) De.push(arguments[Ke++]);
          if (ge = re, (g(re) || q !== void 0) && !Y(q)) return f(re) || (re = function(et, je) {
            if (typeof ge == "function" && (je = ge.call(this, et, je)), !Y(je)) return je;
          }), De[1] = re, ze.apply(null, De);
        } });
      }
      Ae[ve][Pe] || _(Ae[ve], Pe, Ae[ve].valueOf), A(Ae, xe), ie[U] = !0;
    }, a630: function(i, d, e) {
      var n = e("23e7"), r = e("4df4"), o = e("1c7e"), t = !o(function(u) {
        Array.from(u);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: r });
    }, a640: function(i, d, e) {
      var n = e("d039");
      i.exports = function(r, o) {
        var t = [][r];
        return !!t && n(function() {
          t.call(null, o || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(i, d) {
      var e = Math.ceil, n = Math.floor;
      i.exports = function(r) {
        return isNaN(r = +r) ? 0 : (r > 0 ? n : e)(r);
      };
    }, ab13: function(i, d, e) {
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
    }, ac1f: function(i, d, e) {
      var n = e("23e7"), r = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== r }, { exec: r });
    }, acce: function(i, d, e) {
    }, ad6d: function(i, d, e) {
      var n = e("825a");
      i.exports = function() {
        var r = n(this), o = "";
        return r.global && (o += "g"), r.ignoreCase && (o += "i"), r.multiline && (o += "m"), r.dotAll && (o += "s"), r.unicode && (o += "u"), r.sticky && (o += "y"), o;
      };
    }, ae93: function(i, d, e) {
      var n, r, o, t = e("d039"), u = e("e163"), s = e("9112"), a = e("5135"), c = e("b622"), l = e("c430"), f = c("iterator"), g = !1, p = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = u(u(o)), r !== Object.prototype && (n = r)) : g = !0);
      var v = n == null || t(function() {
        var h = {};
        return n[f].call(h) !== h;
      });
      v && (n = {}), l && !v || a(n, f) || s(n, f, p), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: g };
    }, b041: function(i, d, e) {
      var n = e("00ee"), r = e("f5df");
      i.exports = n ? {}.toString : function() {
        return "[object " + r(this) + "]";
      };
    }, b0c0: function(i, d, e) {
      var n = e("83ab"), r = e("9bf2").f, o = Function.prototype, t = o.toString, u = /^\s*function ([^ (]*)/, s = "name";
      n && !(s in o) && r(o, s, { configurable: !0, get: function() {
        try {
          return t.call(this).match(u)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(i, d, e) {
      var n = e("c532"), r = e("467f"), o = e("7aac"), t = e("30b5"), u = e("83b9"), s = e("c345"), a = e("3934"), c = e("2d83");
      i.exports = function(l) {
        return new Promise(function(f, g) {
          var p = l.data, v = l.headers;
          n.isFormData(p) && delete v["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var m = l.auth.username || "", y = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            v.Authorization = "Basic " + btoa(m + ":" + y);
          }
          var j = u(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(j, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var x = "getAllResponseHeaders" in h ? s(h.getAllResponseHeaders()) : null, S = l.responseType && l.responseType !== "text" ? h.response : h.responseText, b = { data: S, status: h.status, statusText: h.statusText, headers: x, config: l, request: h };
              r(f, g, b), h = null;
            }
          }, h.onabort = function() {
            h && (g(c("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            g(c("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var x = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (x = l.timeoutErrorMessage), g(c(x, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var C = (l.withCredentials || a(j)) && l.xsrfCookieName ? o.read(l.xsrfCookieName) : void 0;
            C && (v[l.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in h && n.forEach(v, function(x, S) {
            typeof p > "u" && S.toLowerCase() === "content-type" ? delete v[S] : h.setRequestHeader(S, x);
          }), n.isUndefined(l.withCredentials) || (h.withCredentials = !!l.withCredentials), l.responseType) try {
            h.responseType = l.responseType;
          } catch (x) {
            if (l.responseType !== "json") throw x;
          }
          typeof l.onDownloadProgress == "function" && h.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(x) {
            h && (h.abort(), g(x), h = null);
          }), p || (p = null), h.send(p);
        });
      };
    }, b575: function(i, d, e) {
      var n, r, o, t, u, s, a, c, l = e("da84"), f = e("06cf").f, g = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), h = e("605d"), m = l.MutationObserver || l.WebKitMutationObserver, y = l.document, j = l.process, C = l.Promise, x = f(l, "queueMicrotask"), S = x && x.value;
      S || (n = function() {
        var b, w;
        for (h && (b = j.domain) && b.exit(); r; ) {
          w = r.fn, r = r.next;
          try {
            w();
          } catch (O) {
            throw r ? t() : o = void 0, O;
          }
        }
        o = void 0, b && b.enter();
      }, p || h || v || !m || !y ? C && C.resolve ? (a = C.resolve(void 0), c = a.then, t = function() {
        c.call(a, n);
      }) : t = h ? function() {
        j.nextTick(n);
      } : function() {
        g.call(l, n);
      } : (u = !0, s = y.createTextNode(""), new m(n).observe(s, { characterData: !0 }), t = function() {
        s.data = u = !u;
      })), i.exports = S || function(b) {
        var w = { fn: b, next: void 0 };
        o && (o.next = w), r || (r = w, t()), o = w;
      };
    }, b622: function(i, d, e) {
      var n = e("da84"), r = e("5692"), o = e("5135"), t = e("90e3"), u = e("4930"), s = e("fdbf"), a = r("wks"), c = n.Symbol, l = s ? c : c && c.withoutSetter || t;
      i.exports = function(f) {
        return o(a, f) && (u || typeof a[f] == "string") || (u && o(c, f) ? a[f] = c[f] : a[f] = l("Symbol." + f)), a[f];
      };
    }, b64b: function(i, d, e) {
      var n = e("23e7"), r = e("7b0b"), o = e("df75"), t = e("d039"), u = t(function() {
        o(1);
      });
      n({ target: "Object", stat: !0, forced: u }, { keys: function(s) {
        return o(r(s));
      } });
    }, b680: function(i, d, e) {
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), u = e("d039"), s = 1 .toFixed, a = Math.floor, c = function(h, m, y) {
        return m === 0 ? y : m % 2 === 1 ? c(h, m - 1, y * h) : c(h * h, m / 2, y);
      }, l = function(h) {
        for (var m = 0, y = h; y >= 4096; ) m += 12, y /= 4096;
        for (; y >= 2; ) m += 1, y /= 2;
        return m;
      }, f = function(h, m, y) {
        for (var j = -1, C = y; ++j < 6; ) C += m * h[j], h[j] = C % 1e7, C = a(C / 1e7);
      }, g = function(h, m) {
        for (var y = 6, j = 0; --y >= 0; ) j += h[y], h[y] = a(j / m), j = j % m * 1e7;
      }, p = function(h) {
        for (var m = 6, y = ""; --m >= 0; ) if (y !== "" || m === 0 || h[m] !== 0) {
          var j = String(h[m]);
          y = y === "" ? j : y + t.call("0", 7 - j.length) + j;
        }
        return y;
      }, v = s && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !u(function() {
        s.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(h) {
        var m, y, j, C, x = o(this), S = r(h), b = [0, 0, 0, 0, 0, 0], w = "", O = "0";
        if (S < 0 || S > 20) throw RangeError("Incorrect fraction digits");
        if (x != x) return "NaN";
        if (x <= -1e21 || x >= 1e21) return String(x);
        if (x < 0 && (w = "-", x = -x), x > 1e-21) if (m = l(x * c(2, 69, 1)) - 69, y = m < 0 ? x * c(2, -m, 1) : x / c(2, m, 1), y *= 4503599627370496, m = 52 - m, m > 0) {
          for (f(b, 0, y), j = S; j >= 7; ) f(b, 1e7, 0), j -= 7;
          for (f(b, c(10, j, 1), 0), j = m - 1; j >= 23; ) g(b, 1 << 23), j -= 23;
          g(b, 1 << j), f(b, 1, 1), g(b, 2), O = p(b);
        } else f(b, 0, y), f(b, 1 << -m, 0), O = p(b) + t.call("0", S);
        return S > 0 ? (C = O.length, O = w + (C <= S ? "0." + t.call("0", S - C) + O : O.slice(0, C - S) + "." + O.slice(C - S))) : O = w + O, O;
      } });
    }, b727: function(i, d, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), u = e("65f0"), s = [].push, a = function(c) {
        var l = c == 1, f = c == 2, g = c == 3, p = c == 4, v = c == 6, h = c == 7, m = c == 5 || v;
        return function(y, j, C, x) {
          for (var S, b, w = o(y), O = r(w), T = n(j, C, 3), _ = t(O.length), R = 0, D = x || u, J = l ? D(y, _) : f || h ? D(y, 0) : void 0; _ > R; R++) if ((m || R in O) && (S = O[R], b = T(S, R, w), c)) if (l) J[R] = b;
          else if (b) switch (c) {
            case 3:
              return !0;
            case 5:
              return S;
            case 6:
              return R;
            case 2:
              s.call(J, S);
          }
          else switch (c) {
            case 4:
              return !1;
            case 7:
              s.call(J, S);
          }
          return v ? -1 : g || p ? p : J;
        };
      };
      i.exports = { forEach: a(0), map: a(1), filter: a(2), some: a(3), every: a(4), find: a(5), findIndex: a(6), filterOut: a(7) };
    }, b8d6: function(i, d, e) {
    }, bb2f: function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.isExtensible(Object.preventExtensions({}));
      });
    }, bc3a: function(i, d, e) {
      i.exports = e("cee4");
    }, c04e: function(i, d, e) {
      var n = e("861d");
      i.exports = function(r, o) {
        if (!n(r)) return r;
        var t, u;
        if (o && typeof (t = r.toString) == "function" && !n(u = t.call(r)) || typeof (t = r.valueOf) == "function" && !n(u = t.call(r)) || !o && typeof (t = r.toString) == "function" && !n(u = t.call(r))) return u;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(i, d, e) {
      var n = e("c532"), r = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      i.exports = function(o) {
        var t, u, s, a = {};
        return o && n.forEach(o.split(`
`), function(c) {
          if (s = c.indexOf(":"), t = n.trim(c.substr(0, s)).toLowerCase(), u = n.trim(c.substr(s + 1)), t) {
            if (a[t] && r.indexOf(t) >= 0) return;
            a[t] = t === "set-cookie" ? (a[t] ? a[t] : []).concat([u]) : a[t] ? a[t] + ", " + u : u;
          }
        }), a;
      };
    }, c401: function(i, d, e) {
      var n = e("c532");
      i.exports = function(r, o, t) {
        return n.forEach(t, function(u) {
          r = u(r, o);
        }), r;
      };
    }, c430: function(i, d) {
      i.exports = !1;
    }, c532: function(i, d, e) {
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
      function a(_) {
        return typeof FormData < "u" && _ instanceof FormData;
      }
      function c(_) {
        var R;
        return R = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(_) : _ && _.buffer && _.buffer instanceof ArrayBuffer, R;
      }
      function l(_) {
        return typeof _ == "string";
      }
      function f(_) {
        return typeof _ == "number";
      }
      function g(_) {
        return _ !== null && typeof _ == "object";
      }
      function p(_) {
        if (r.call(_) !== "[object Object]") return !1;
        var R = Object.getPrototypeOf(_);
        return R === null || R === Object.prototype;
      }
      function v(_) {
        return r.call(_) === "[object Date]";
      }
      function h(_) {
        return r.call(_) === "[object File]";
      }
      function m(_) {
        return r.call(_) === "[object Blob]";
      }
      function y(_) {
        return r.call(_) === "[object Function]";
      }
      function j(_) {
        return g(_) && y(_.pipe);
      }
      function C(_) {
        return typeof URLSearchParams < "u" && _ instanceof URLSearchParams;
      }
      function x(_) {
        return _.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function S() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function b(_, R) {
        if (_ !== null && typeof _ < "u") if (typeof _ != "object" && (_ = [_]), o(_)) for (var D = 0, J = _.length; D < J; D++) R.call(null, _[D], D, _);
        else for (var ie in _) Object.prototype.hasOwnProperty.call(_, ie) && R.call(null, _[ie], ie, _);
      }
      function w() {
        var _ = {};
        function R(ie, H) {
          p(_[H]) && p(ie) ? _[H] = w(_[H], ie) : p(ie) ? _[H] = w({}, ie) : o(ie) ? _[H] = ie.slice() : _[H] = ie;
        }
        for (var D = 0, J = arguments.length; D < J; D++) b(arguments[D], R);
        return _;
      }
      function O(_, R, D) {
        return b(R, function(J, ie) {
          _[ie] = D && typeof J == "function" ? n(J, D) : J;
        }), _;
      }
      function T(_) {
        return _.charCodeAt(0) === 65279 && (_ = _.slice(1)), _;
      }
      i.exports = { isArray: o, isArrayBuffer: s, isBuffer: u, isFormData: a, isArrayBufferView: c, isString: l, isNumber: f, isObject: g, isPlainObject: p, isUndefined: t, isDate: v, isFile: h, isBlob: m, isFunction: y, isStream: j, isURLSearchParams: C, isStandardBrowserEnv: S, forEach: b, merge: w, extend: O, trim: x, stripBOM: T };
    }, c6b6: function(i, d) {
      var e = {}.toString;
      i.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(i, d, e) {
      var n = e("da84"), r = e("ce4e"), o = "__core-js_shared__", t = n[o] || r(o, {});
      i.exports = t;
    }, c8af: function(i, d, e) {
      var n = e("c532");
      i.exports = function(r, o) {
        n.forEach(r, function(t, u) {
          u !== o && u.toUpperCase() === o.toUpperCase() && (r[o] = t, delete r[u]);
        });
      };
    }, c8ba: function(i, d) {
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
    }, ca84: function(i, d, e) {
      var n = e("5135"), r = e("fc6a"), o = e("4d64").indexOf, t = e("d012");
      i.exports = function(u, s) {
        var a, c = r(u), l = 0, f = [];
        for (a in c) !n(t, a) && n(c, a) && f.push(a);
        for (; s.length > l; ) n(c, a = s[l++]) && (~o(f, a) || f.push(a));
        return f;
      };
    }, caad: function(i, d, e) {
      var n = e("23e7"), r = e("4d64").includes, o = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return r(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), o("includes");
    }, cc12: function(i, d, e) {
      var n = e("da84"), r = e("861d"), o = n.document, t = r(o) && r(o.createElement);
      i.exports = function(u) {
        return t ? o.createElement(u) : {};
      };
    }, cdf9: function(i, d, e) {
      var n = e("825a"), r = e("861d"), o = e("f069");
      i.exports = function(t, u) {
        if (n(t), r(u) && u.constructor === t) return u;
        var s = o.f(t), a = s.resolve;
        return a(u), s.promise;
      };
    }, ce4e: function(i, d, e) {
      var n = e("da84"), r = e("9112");
      i.exports = function(o, t) {
        try {
          r(n, o, t);
        } catch {
          n[o] = t;
        }
        return t;
      };
    }, cee4: function(i, d, e) {
      var n = e("c532"), r = e("1d2b"), o = e("0a06"), t = e("4a7b"), u = e("2444");
      function s(c) {
        var l = new o(c), f = r(o.prototype.request, l);
        return n.extend(f, o.prototype, l), n.extend(f, l), f;
      }
      var a = s(u);
      a.Axios = o, a.create = function(c) {
        return s(t(a.defaults, c));
      }, a.Cancel = e("7a77"), a.CancelToken = e("8df4"), a.isCancel = e("2e67"), a.all = function(c) {
        return Promise.all(c);
      }, a.spread = e("0df6"), a.isAxiosError = e("5f02"), i.exports = a, i.exports.default = a;
    }, d012: function(i, d) {
      i.exports = {};
    }, d039: function(i, d) {
      i.exports = function(e) {
        try {
          return !!e();
        } catch {
          return !0;
        }
      };
    }, d066: function(i, d, e) {
      var n = e("428f"), r = e("da84"), o = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      i.exports = function(t, u) {
        return arguments.length < 2 ? o(n[t]) || o(r[t]) : n[t] && n[t][u] || r[t] && r[t][u];
      };
    }, d1e7: function(i, d, e) {
      var n = {}.propertyIsEnumerable, r = Object.getOwnPropertyDescriptor, o = r && !n.call({ 1: 2 }, 1);
      d.f = o ? function(t) {
        var u = r(this, t);
        return !!u && u.enumerable;
      } : n;
    }, d28b: function(i, d, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(i, d, e) {
      var n = e("825a"), r = e("3bbe");
      i.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var o, t = !1, u = {};
        try {
          o = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, o.call(u, []), t = u instanceof Array;
        } catch {
        }
        return function(s, a) {
          return n(s), r(a), t ? o.call(s, a) : s.__proto__ = a, s;
        };
      }() : void 0);
    }, d3b7: function(i, d, e) {
      var n = e("00ee"), r = e("6eeb"), o = e("b041");
      n || r(Object.prototype, "toString", o, { unsafe: !0 });
    }, d40d: function(i, d, e) {
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
    }, d44e: function(i, d, e) {
      var n = e("9bf2").f, r = e("5135"), o = e("b622"), t = o("toStringTag");
      i.exports = function(u, s, a) {
        u && !r(u = a ? u : u.prototype, t) && n(u, t, { configurable: !0, value: s });
      };
    }, d58f: function(i, d, e) {
      var n = e("1c0b"), r = e("7b0b"), o = e("44ad"), t = e("50c4"), u = function(s) {
        return function(a, c, l, f) {
          n(c);
          var g = r(a), p = o(g), v = t(g.length), h = s ? v - 1 : 0, m = s ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in p) {
              f = p[h], h += m;
              break;
            }
            if (h += m, s ? h < 0 : v <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; s ? h >= 0 : v > h; h += m) h in p && (f = c(f, p[h], h, g));
          return f;
        };
      };
      i.exports = { left: u(!1), right: u(!0) };
    }, d69c: function(i, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), u = new r.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(u), d.default = u;
    }, d784: function(i, d, e) {
      e("ac1f");
      var n = e("6eeb"), r = e("d039"), o = e("b622"), t = e("9263"), u = e("9112"), s = o("species"), a = !r(function() {
        var p = /./;
        return p.exec = function() {
          var v = [];
          return v.groups = { a: "7" }, v;
        }, "".replace(p, "$<a>") !== "7";
      }), c = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), l = o("replace"), f = function() {
        return !!/./[l] && /./[l]("a", "$0") === "";
      }(), g = !r(function() {
        var p = /(?:)/, v = p.exec;
        p.exec = function() {
          return v.apply(this, arguments);
        };
        var h = "ab".split(p);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      i.exports = function(p, v, h, m) {
        var y = o(p), j = !r(function() {
          var O = {};
          return O[y] = function() {
            return 7;
          }, ""[p](O) != 7;
        }), C = j && !r(function() {
          var O = !1, T = /a/;
          return p === "split" && (T = {}, T.constructor = {}, T.constructor[s] = function() {
            return T;
          }, T.flags = "", T[y] = /./[y]), T.exec = function() {
            return O = !0, null;
          }, T[y](""), !O;
        });
        if (!j || !C || p === "replace" && (!a || !c || f) || p === "split" && !g) {
          var x = /./[y], S = h(y, ""[p], function(O, T, _, R, D) {
            return T.exec === t ? j && !D ? { done: !0, value: x.call(T, _, R) } : { done: !0, value: O.call(_, T, R) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: c, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), b = S[0], w = S[1];
          n(String.prototype, p, b), n(RegExp.prototype, y, v == 2 ? function(O, T) {
            return w.call(O, this, T);
          } : function(O) {
            return w.call(O, this);
          });
        }
        m && u(RegExp.prototype[y], "sham", !0);
      };
    }, d81d: function(i, d, e) {
      var n = e("23e7"), r = e("b727").map, o = e("1dde"), t = o("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(u) {
        return r(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(i, d, e) {
      i.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(i, d, e) {
      (function(n) {
        var r = function(o) {
          return o && o.Math == Math && o;
        };
        i.exports = r(typeof globalThis == "object" && globalThis) || r(typeof window == "object" && window) || r(typeof self == "object" && self) || r(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(i, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("56ef"), t = e("fc6a"), u = e("06cf"), s = e("8418");
      n({ target: "Object", stat: !0, sham: !r }, { getOwnPropertyDescriptors: function(a) {
        for (var c, l, f = t(a), g = u.f, p = o(f), v = {}, h = 0; p.length > h; ) l = g(f, c = p[h++]), l !== void 0 && s(v, c, l);
        return v;
      } });
    }, ddb0: function(i, d, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), u = e("b622"), s = u("iterator"), a = u("toStringTag"), c = o.values;
      for (var l in r) {
        var f = n[l], g = f && f.prototype;
        if (g) {
          if (g[s] !== c) try {
            t(g, s, c);
          } catch {
            g[s] = c;
          }
          if (g[a] || t(g, a, l), r[l]) {
            for (var p in o) if (g[p] !== o[p]) try {
              t(g, p, o[p]);
            } catch {
              g[p] = o[p];
            }
          }
        }
      }
    }, de23: function(i, d, e) {
      e("7305");
    }, df75: function(i, d, e) {
      var n = e("ca84"), r = e("7839");
      i.exports = Object.keys || function(o) {
        return n(o, r);
      };
    }, df7c: function(i, d, e) {
      (function(n) {
        function r(s, a) {
          for (var c = 0, l = s.length - 1; l >= 0; l--) {
            var f = s[l];
            f === "." ? s.splice(l, 1) : f === ".." ? (s.splice(l, 1), c++) : c && (s.splice(l, 1), c--);
          }
          if (a) for (; c--; c) s.unshift("..");
          return s;
        }
        function o(s) {
          typeof s != "string" && (s += "");
          var a, c = 0, l = -1, f = !0;
          for (a = s.length - 1; a >= 0; --a) if (s.charCodeAt(a) === 47) {
            if (!f) {
              c = a + 1;
              break;
            }
          } else l === -1 && (f = !1, l = a + 1);
          return l === -1 ? "" : s.slice(c, l);
        }
        function t(s, a) {
          if (s.filter) return s.filter(a);
          for (var c = [], l = 0; l < s.length; l++) a(s[l], l, s) && c.push(s[l]);
          return c;
        }
        d.resolve = function() {
          for (var s = "", a = !1, c = arguments.length - 1; c >= -1 && !a; c--) {
            var l = c >= 0 ? arguments[c] : n.cwd();
            if (typeof l != "string") throw new TypeError("Arguments to path.resolve must be strings");
            l && (s = l + "/" + s, a = l.charAt(0) === "/");
          }
          return s = r(t(s.split("/"), function(f) {
            return !!f;
          }), !a).join("/"), (a ? "/" : "") + s || ".";
        }, d.normalize = function(s) {
          var a = d.isAbsolute(s), c = u(s, -1) === "/";
          return s = r(t(s.split("/"), function(l) {
            return !!l;
          }), !a).join("/"), s || a || (s = "."), s && c && (s += "/"), (a ? "/" : "") + s;
        }, d.isAbsolute = function(s) {
          return s.charAt(0) === "/";
        }, d.join = function() {
          var s = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(s, function(a, c) {
            if (typeof a != "string") throw new TypeError("Arguments to path.join must be strings");
            return a;
          }).join("/"));
        }, d.relative = function(s, a) {
          function c(m) {
            for (var y = 0; y < m.length && m[y] === ""; y++) ;
            for (var j = m.length - 1; j >= 0 && m[j] === ""; j--) ;
            return y > j ? [] : m.slice(y, j - y + 1);
          }
          s = d.resolve(s).substr(1), a = d.resolve(a).substr(1);
          for (var l = c(s.split("/")), f = c(a.split("/")), g = Math.min(l.length, f.length), p = g, v = 0; v < g; v++) if (l[v] !== f[v]) {
            p = v;
            break;
          }
          var h = [];
          for (v = p; v < l.length; v++) h.push("..");
          return h = h.concat(f.slice(p)), h.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(s) {
          if (typeof s != "string" && (s += ""), s.length === 0) return ".";
          for (var a = s.charCodeAt(0), c = a === 47, l = -1, f = !0, g = s.length - 1; g >= 1; --g) if (a = s.charCodeAt(g), a === 47) {
            if (!f) {
              l = g;
              break;
            }
          } else f = !1;
          return l === -1 ? c ? "/" : "." : c && l === 1 ? "/" : s.slice(0, l);
        }, d.basename = function(s, a) {
          var c = o(s);
          return a && c.substr(-1 * a.length) === a && (c = c.substr(0, c.length - a.length)), c;
        }, d.extname = function(s) {
          typeof s != "string" && (s += "");
          for (var a = -1, c = 0, l = -1, f = !0, g = 0, p = s.length - 1; p >= 0; --p) {
            var v = s.charCodeAt(p);
            if (v !== 47) l === -1 && (f = !1, l = p + 1), v === 46 ? a === -1 ? a = p : g !== 1 && (g = 1) : a !== -1 && (g = -1);
            else if (!f) {
              c = p + 1;
              break;
            }
          }
          return a === -1 || l === -1 || g === 0 || g === 1 && a === l - 1 && a === c + 1 ? "" : s.slice(a, l);
        };
        var u = "ab".substr(-1) === "b" ? function(s, a, c) {
          return s.substr(a, c);
        } : function(s, a, c) {
          return a < 0 && (a = s.length + a), s.substr(a, c);
        };
      }).call(this, e("4362"));
    }, e017: function(i, d, e) {
      (function(n) {
        (function(r, o) {
          i.exports = o();
        })(0, function() {
          var r = function(v) {
            var h = v.id, m = v.viewBox, y = v.content;
            this.id = h, this.viewBox = m, this.content = y;
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
            var h = !!document.importNode, m = new DOMParser().parseFromString(v, "image/svg+xml").documentElement;
            return h ? document.importNode(m, !0) : m;
          };
          function t(v, h) {
            return h = { exports: {} }, v(h, h.exports), h.exports;
          }
          var u = t(function(v, h) {
            (function(m, y) {
              v.exports = y();
            })(0, function() {
              function m(b) {
                var w = b && typeof b == "object";
                return w && Object.prototype.toString.call(b) !== "[object RegExp]" && Object.prototype.toString.call(b) !== "[object Date]";
              }
              function y(b) {
                return Array.isArray(b) ? [] : {};
              }
              function j(b, w) {
                var O = w && w.clone === !0;
                return O && m(b) ? S(y(b), b, w) : b;
              }
              function C(b, w, O) {
                var T = b.slice();
                return w.forEach(function(_, R) {
                  typeof T[R] > "u" ? T[R] = j(_, O) : m(_) ? T[R] = S(b[R], _, O) : b.indexOf(_) === -1 && T.push(j(_, O));
                }), T;
              }
              function x(b, w, O) {
                var T = {};
                return m(b) && Object.keys(b).forEach(function(_) {
                  T[_] = j(b[_], O);
                }), Object.keys(w).forEach(function(_) {
                  m(w[_]) && b[_] ? T[_] = S(b[_], w[_], O) : T[_] = j(w[_], O);
                }), T;
              }
              function S(b, w, O) {
                var T = Array.isArray(w), _ = O || { arrayMerge: C }, R = _.arrayMerge || C;
                return T ? Array.isArray(b) ? R(b, w, O) : j(w, O) : x(b, w, O);
              }
              return S.all = function(b, w) {
                if (!Array.isArray(b) || b.length < 2) throw new Error("first argument should be an array with at least two elements");
                return b.reduce(function(O, T) {
                  return S(O, T, w);
                });
              }, S;
            });
          }), s = t(function(v, h) {
            var m = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = m, v.exports = h.default;
          }), a = function(v) {
            return Object.keys(v).map(function(h) {
              var m = v[h].toString().replace(/"/g, "&quot;");
              return h + '="' + m + '"';
            }).join(" ");
          }, c = s.svg, l = s.xlink, f = {};
          f[c.name] = c.uri, f[l.name] = l.uri;
          var g = function(v, h) {
            v === void 0 && (v = "");
            var m = u(f, {}), y = a(m);
            return "<svg " + y + ">" + v + "</svg>";
          }, p = function(v) {
            function h() {
              v.apply(this, arguments);
            }
            v && (h.__proto__ = v), h.prototype = Object.create(v && v.prototype), h.prototype.constructor = h;
            var m = { isMounted: {} };
            return m.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(y) {
              return new h({ id: y.getAttribute("id"), viewBox: y.getAttribute("viewBox"), content: y.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), v.prototype.destroy.call(this);
            }, h.prototype.mount = function(y) {
              if (this.isMounted) return this.node;
              var j = typeof y == "string" ? document.querySelector(y) : y, C = this.render();
              return this.node = C, j.appendChild(C), C;
            }, h.prototype.render = function() {
              var y = this.stringify();
              return o(g(y)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, m), h;
          }(r);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), u = e("861d"), s = e("9bf2").f, a = e("e893"), c = o.Symbol;
      if (r && typeof c == "function" && (!("description" in c.prototype) || c().description !== void 0)) {
        var l = {}, f = function() {
          var m = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), y = this instanceof f ? new c(m) : m === void 0 ? c() : c(m);
          return m === "" && (l[y] = !0), y;
        };
        a(f, c);
        var g = f.prototype = c.prototype;
        g.constructor = f;
        var p = g.toString, v = String(c("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        s(g, "description", { configurable: !0, get: function() {
          var m = u(this) ? this.valueOf() : this, y = p.call(m);
          if (t(l, m)) return "";
          var j = v ? y.slice(7, -1) : y.replace(h, "$1");
          return j === "" ? void 0 : j;
        } }), n({ global: !0, forced: !0 }, { Symbol: f });
      }
    }, e163: function(i, d, e) {
      var n = e("5135"), r = e("7b0b"), o = e("f772"), t = e("e177"), u = o("IE_PROTO"), s = Object.prototype;
      i.exports = t ? Object.getPrototypeOf : function(a) {
        return a = r(a), n(a, u) ? a[u] : typeof a.constructor == "function" && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? s : null;
      };
    }, e177: function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        function r() {
        }
        return r.prototype.constructor = null, Object.getPrototypeOf(new r()) !== r.prototype;
      });
    }, e260: function(i, d, e) {
      var n = e("fc6a"), r = e("44d2"), o = e("3f8c"), t = e("69f3"), u = e("7dd0"), s = "Array Iterator", a = t.set, c = t.getterFor(s);
      i.exports = u(Array, "Array", function(l, f) {
        a(this, { type: s, target: n(l), index: 0, kind: f });
      }, function() {
        var l = c(this), f = l.target, g = l.kind, p = l.index++;
        return !f || p >= f.length ? (l.target = void 0, { value: void 0, done: !0 }) : g == "keys" ? { value: p, done: !1 } : g == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
      }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries");
    }, e2cc: function(i, d, e) {
      var n = e("6eeb");
      i.exports = function(r, o, t) {
        for (var u in o) n(r, u, o[u], t);
        return r;
      };
    }, e439: function(i, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("fc6a"), t = e("06cf").f, u = e("83ab"), s = r(function() {
        t(1);
      }), a = !u || s;
      n({ target: "Object", stat: !0, forced: a, sham: !u }, { getOwnPropertyDescriptor: function(c, l) {
        return t(o(c), l);
      } });
    }, e538: function(i, d, e) {
      var n = e("b622");
      d.f = n;
    }, e667: function(i, d) {
      i.exports = function(e) {
        try {
          return { error: !1, value: e() };
        } catch (n) {
          return { error: !0, value: n };
        }
      };
    }, e66c: function(i, d, e) {
      e("95d9");
    }, e683: function(i, d, e) {
      i.exports = function(n, r) {
        return r ? n.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(i, d, e) {
      var n, r, o, t, u = e("23e7"), s = e("c430"), a = e("da84"), c = e("d066"), l = e("fea9"), f = e("6eeb"), g = e("e2cc"), p = e("d44e"), v = e("2626"), h = e("861d"), m = e("1c0b"), y = e("19aa"), j = e("8925"), C = e("2266"), x = e("1c7e"), S = e("4840"), b = e("2cf4").set, w = e("b575"), O = e("cdf9"), T = e("44de"), _ = e("f069"), R = e("e667"), D = e("69f3"), J = e("94ca"), ie = e("b622"), H = e("605d"), V = e("2d00"), M = ie("species"), L = "Promise", A = D.get, z = D.set, te = D.getterFor(L), U = l, xe = a.TypeError, ve = a.document, Pe = a.process, Ue = c("fetch"), Be = _.f, Le = Be, Ae = !!(ve && ve.createEvent && a.dispatchEvent), ze = typeof PromiseRejectionEvent == "function", Xe = "unhandledrejection", N = "rejectionhandled", B = 0, X = 1, F = 2, ne = 1, oe = 2, ye = J(L, function() {
        var K = j(U) !== String(U);
        if (!K && (V === 66 || !H && !ze) || s && !U.prototype.finally) return !0;
        if (V >= 51 && /native code/.test(U)) return !1;
        var ae = U.resolve(1), fe = function(q) {
          q(function() {
          }, function() {
          });
        }, me = ae.constructor = {};
        return me[M] = fe, !(ae.then(function() {
        }) instanceof fe);
      }), he = ye || !x(function(K) {
        U.all(K).catch(function() {
        });
      }), le = function(K) {
        var ae;
        return !(!h(K) || typeof (ae = K.then) != "function") && ae;
      }, ke = function(K, ae) {
        if (!K.notified) {
          K.notified = !0;
          var fe = K.reactions;
          w(function() {
            for (var me = K.value, q = K.state == X, re = 0; fe.length > re; ) {
              var ce, ge, De, Ke = fe[re++], et = q ? Ke.ok : Ke.fail, je = Ke.resolve, tt = Ke.reject, Ge = Ke.domain;
              try {
                et ? (q || (K.rejection === oe && W(K), K.rejection = ne), et === !0 ? ce = me : (Ge && Ge.enter(), ce = et(me), Ge && (Ge.exit(), De = !0)), ce === Ke.promise ? tt(xe("Promise-chain cycle")) : (ge = le(ce)) ? ge.call(ce, je, tt) : je(ce)) : tt(me);
              } catch (gt) {
                Ge && !De && Ge.exit(), tt(gt);
              }
            }
            K.reactions = [], K.notified = !1, ae && !K.rejection && Re(K);
          });
        }
      }, Oe = function(K, ae, fe) {
        var me, q;
        Ae ? (me = ve.createEvent("Event"), me.promise = ae, me.reason = fe, me.initEvent(K, !1, !0), a.dispatchEvent(me)) : me = { promise: ae, reason: fe }, !ze && (q = a["on" + K]) ? q(me) : K === Xe && T("Unhandled promise rejection", fe);
      }, Re = function(K) {
        b.call(a, function() {
          var ae, fe = K.facade, me = K.value, q = Y(K);
          if (q && (ae = R(function() {
            H ? Pe.emit("unhandledRejection", me, fe) : Oe(Xe, fe, me);
          }), K.rejection = H || Y(K) ? oe : ne, ae.error)) throw ae.value;
        });
      }, Y = function(K) {
        return K.rejection !== ne && !K.parent;
      }, W = function(K) {
        b.call(a, function() {
          var ae = K.facade;
          H ? Pe.emit("rejectionHandled", ae) : Oe(N, ae, K.value);
        });
      }, se = function(K, ae, fe) {
        return function(me) {
          K(ae, me, fe);
        };
      }, We = function(K, ae, fe) {
        K.done || (K.done = !0, fe && (K = fe), K.value = ae, K.state = F, ke(K, !0));
      }, at = function(K, ae, fe) {
        if (!K.done) {
          K.done = !0, fe && (K = fe);
          try {
            if (K.facade === ae) throw xe("Promise can't be resolved itself");
            var me = le(ae);
            me ? w(function() {
              var q = { done: !1 };
              try {
                me.call(ae, se(at, q, K), se(We, q, K));
              } catch (re) {
                We(q, re, K);
              }
            }) : (K.value = ae, K.state = X, ke(K, !1));
          } catch (q) {
            We({ done: !1 }, q, K);
          }
        }
      };
      ye && (U = function(K) {
        y(this, U, L), m(K), n.call(this);
        var ae = A(this);
        try {
          K(se(at, ae), se(We, ae));
        } catch (fe) {
          We(ae, fe);
        }
      }, n = function(K) {
        z(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: B, value: void 0 });
      }, n.prototype = g(U.prototype, { then: function(K, ae) {
        var fe = te(this), me = Be(S(this, U));
        return me.ok = typeof K != "function" || K, me.fail = typeof ae == "function" && ae, me.domain = H ? Pe.domain : void 0, fe.parent = !0, fe.reactions.push(me), fe.state != B && ke(fe, !1), me.promise;
      }, catch: function(K) {
        return this.then(void 0, K);
      } }), r = function() {
        var K = new n(), ae = A(K);
        this.promise = K, this.resolve = se(at, ae), this.reject = se(We, ae);
      }, _.f = Be = function(K) {
        return K === U || K === o ? new r(K) : Le(K);
      }, s || typeof l != "function" || (t = l.prototype.then, f(l.prototype, "then", function(K, ae) {
        var fe = this;
        return new U(function(me, q) {
          t.call(fe, me, q);
        }).then(K, ae);
      }, { unsafe: !0 }), typeof Ue == "function" && u({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(K) {
        return O(U, Ue.apply(a, arguments));
      } }))), u({ global: !0, wrap: !0, forced: ye }, { Promise: U }), p(U, L, !1, !0), v(L), o = c(L), u({ target: L, stat: !0, forced: ye }, { reject: function(K) {
        var ae = Be(this);
        return ae.reject.call(void 0, K), ae.promise;
      } }), u({ target: L, stat: !0, forced: s || ye }, { resolve: function(K) {
        return O(s && this === o ? U : this, K);
      } }), u({ target: L, stat: !0, forced: he }, { all: function(K) {
        var ae = this, fe = Be(ae), me = fe.resolve, q = fe.reject, re = R(function() {
          var ce = m(ae.resolve), ge = [], De = 0, Ke = 1;
          C(K, function(et) {
            var je = De++, tt = !1;
            ge.push(void 0), Ke++, ce.call(ae, et).then(function(Ge) {
              tt || (tt = !0, ge[je] = Ge, --Ke || me(ge));
            }, q);
          }), --Ke || me(ge);
        });
        return re.error && q(re.value), fe.promise;
      }, race: function(K) {
        var ae = this, fe = Be(ae), me = fe.reject, q = R(function() {
          var re = m(ae.resolve);
          C(K, function(ce) {
            re.call(ae, ce).then(fe.resolve, me);
          });
        });
        return q.error && me(q.value), fe.promise;
      } });
    }, e893: function(i, d, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      i.exports = function(u, s) {
        for (var a = r(s), c = t.f, l = o.f, f = 0; f < a.length; f++) {
          var g = a[f];
          n(u, g) || c(u, g, l(s, g));
        }
      };
    }, e8b5: function(i, d, e) {
      var n = e("c6b6");
      i.exports = Array.isArray || function(r) {
        return n(r) == "Array";
      };
    }, e95a: function(i, d, e) {
      var n = e("b622"), r = e("3f8c"), o = n("iterator"), t = Array.prototype;
      i.exports = function(u) {
        return u !== void 0 && (r.Array === u || t[o] === u);
      };
    }, ec57: function(i, d, e) {
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
    }, f069: function(i, d, e) {
      var n = e("1c0b"), r = function(o) {
        var t, u;
        this.promise = new o(function(s, a) {
          if (t !== void 0 || u !== void 0) throw TypeError("Bad Promise constructor");
          t = s, u = a;
        }), this.resolve = n(t), this.reject = n(u);
      };
      i.exports.f = function(o) {
        return new r(o);
      };
    }, f183: function(i, d, e) {
      var n = e("d012"), r = e("861d"), o = e("5135"), t = e("9bf2").f, u = e("90e3"), s = e("bb2f"), a = u("meta"), c = 0, l = Object.isExtensible || function() {
        return !0;
      }, f = function(m) {
        t(m, a, { value: { objectID: "O" + ++c, weakData: {} } });
      }, g = function(m, y) {
        if (!r(m)) return typeof m == "symbol" ? m : (typeof m == "string" ? "S" : "P") + m;
        if (!o(m, a)) {
          if (!l(m)) return "F";
          if (!y) return "E";
          f(m);
        }
        return m[a].objectID;
      }, p = function(m, y) {
        if (!o(m, a)) {
          if (!l(m)) return !0;
          if (!y) return !1;
          f(m);
        }
        return m[a].weakData;
      }, v = function(m) {
        return s && h.REQUIRED && l(m) && !o(m, a) && f(m), m;
      }, h = i.exports = { REQUIRED: !1, fastKey: g, getWeakData: p, onFreeze: v };
      n[a] = !0;
    }, f5df: function(i, d, e) {
      var n = e("00ee"), r = e("c6b6"), o = e("b622"), t = o("toStringTag"), u = r(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", s = function(a, c) {
        try {
          return a[c];
        } catch {
        }
      };
      i.exports = n ? r : function(a) {
        var c, l, f;
        return a === void 0 ? "Undefined" : a === null ? "Null" : typeof (l = s(c = Object(a), t)) == "string" ? l : u ? r(c) : (f = r(c)) == "Object" && typeof c.callee == "function" ? "Arguments" : f;
      };
    }, f6b4: function(i, d, e) {
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
    }, f772: function(i, d, e) {
      var n = e("5692"), r = e("90e3"), o = n("keys");
      i.exports = function(t) {
        return o[t] || (o[t] = r(t));
      };
    }, f8b0: function(i, d, e) {
      e("b8d6");
    }, fb15: function(i, d, e) {
      if (e.r(d), typeof window < "u") {
        var n = window.document.currentScript, r = e("8875");
        n = r(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: r });
        var o = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        o && (e.p = o[1]);
      }
      e("b0c0");
      var t = e("8bbf"), u = { class: "key-board-container" }, s = { class: "key-board-area" };
      function a(k, $, I, P, Q, ue) {
        var pe = Object(t.resolveComponent)("Result"), de = Object(t.resolveComponent)("DefaultBoard"), be = Object(t.resolveComponent)("HandBoard"), Me = Object(t.resolveComponent)("svg-icon"), Fe = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: k.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [k.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: $[1] || ($[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", u, [Object(t.createVNode)(pe, { data: k.resultVal, onChange: k.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", s, [k.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, ref: "defaultBoardRef", onTrigger: k.trigger, onChange: k.change, onTranslate: k.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), k.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(be, { key: 1, onTrigger: k.trigger, onChange: k.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), k.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: k.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(k.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Me, { "icon-class": "drag" })], 4)), [[Fe]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function c(k, $, I) {
        return $ in k ? Object.defineProperty(k, $, { value: I, enumerable: !0, configurable: !0, writable: !0 }) : k[$] = I, k;
      }
      function l(k, $) {
        var I = Object.keys(k);
        if (Object.getOwnPropertySymbols) {
          var P = Object.getOwnPropertySymbols(k);
          $ && (P = P.filter(function(Q) {
            return Object.getOwnPropertyDescriptor(k, Q).enumerable;
          })), I.push.apply(I, P);
        }
        return I;
      }
      function f(k) {
        for (var $ = 1; $ < arguments.length; $++) {
          var I = arguments[$] != null ? arguments[$] : {};
          $ % 2 ? l(Object(I), !0).forEach(function(P) {
            c(k, P, I[P]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(k, Object.getOwnPropertyDescriptors(I)) : l(Object(I)).forEach(function(P) {
            Object.defineProperty(k, P, Object.getOwnPropertyDescriptor(I, P));
          });
        }
        return k;
      }
      function g(k, $) {
        ($ == null || $ > k.length) && ($ = k.length);
        for (var I = 0, P = new Array($); I < $; I++) P[I] = k[I];
        return P;
      }
      function p(k) {
        if (Array.isArray(k)) return g(k);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(k) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(k)) return Array.from(k);
      }
      e("fb6a");
      function h(k, $) {
        if (k) {
          if (typeof k == "string") return g(k, $);
          var I = Object.prototype.toString.call(k).slice(8, -1);
          return I === "Object" && k.constructor && (I = k.constructor.name), I === "Map" || I === "Set" ? Array.from(k) : I === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(I) ? g(k, $) : void 0;
        }
      }
      function m() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function y(k) {
        return p(k) || v(k) || h(k) || m();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function j(k, $) {
        if (!(k instanceof $)) throw new TypeError("Cannot call a class as a function");
      }
      function C(k, $) {
        for (var I = 0; I < $.length; I++) {
          var P = $[I];
          P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(k, P.key, P);
        }
      }
      function x(k, $, I) {
        return $ && C(k.prototype, $), k;
      }
      var S = function() {
        function k() {
          j(this, k), this.listeners = {};
        }
        return x(k, [{ key: "on", value: function($, I) {
          var P = this, Q = this.listeners[$];
          return Q || (Q = []), Q.push(I), this.listeners[$] = Q, function() {
            P.remove($, I);
          };
        } }, { key: "emit", value: function($) {
          var I = this.listeners[$];
          if (Array.isArray(I)) {
            for (var P = arguments.length, Q = new Array(P > 1 ? P - 1 : 0), ue = 1; ue < P; ue++) Q[ue - 1] = arguments[ue];
            for (var pe = 0; pe < I.length; pe++) {
              var de = I[pe];
              typeof de == "function" && de.apply(void 0, Q);
            }
          }
        } }, { key: "remove", value: function($, I) {
          if (I) {
            var P = this.listeners[$];
            if (!P) return;
            P = P.filter(function(Q) {
              return Q !== I;
            }), this.listeners[$] = P;
          } else this.listeners[$] = null, delete this.listeners[$];
        } }]), k;
      }(), b = new S(), w = { mounted: function(k, $, I) {
        var P = k.parentNode;
        k.onmousedown = function(Q) {
          var ue = Q.clientX - P.offsetLeft, pe = Q.clientY - P.offsetTop;
          document.onmousemove = function(de) {
            var be = de.clientX - ue, Me = de.clientY - pe;
            P.style.left = be + "px", P.style.top = Me + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, k.ontouchstart = function(Q) {
          var ue = Q.touches[0].pageX, pe = Q.touches[0].pageY, de = ue - P.offsetLeft, be = pe - P.offsetTop;
          document.ontouchmove = function(Me) {
            var Fe = Me.touches[0].pageX, qe = Me.touches[0].pageY, Qe = Fe - de, pt = qe - be;
            P.style.left = Qe + "px", P.style.top = pt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, O = w, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var _ = { key: 0, class: "key-board-code-show" }, R = { class: "key-board-result-show" }, D = { class: "key-board-result-show-container" }, J = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ie = T(function(k, $, I, P, Q, ue) {
        return k.status === "CN" || k.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: k.color } }, [k.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", _, Object(t.toDisplayString)(k.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", R, [Object(t.createVNode)("div", D, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.showList[k.showIndex], function(pe, de) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: de, onClick: function(be) {
            return k.selectWord(pe);
          } }, Object(t.toDisplayString)(de + 1) + "." + Object(t.toDisplayString)(pe), 9, ["onClick"]);
        }), 128))]), k.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", J, [Object(t.createVNode)("span", { style: k.getStyle, onClick: $[1] || ($[1] = function() {
          return k.upper && k.upper.apply(k, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: k.getStyle, onClick: $[2] || ($[2] = function() {
          return k.lower && k.lower.apply(k, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), H = (e("1276"), e("6062"), e("5319"), function(k, $) {
        for (var I = 0, P = []; I < k.length; ) P.push(k.slice(I, I += $));
        return P;
      }), V = Symbol("KEYBOARD_CONTEXT"), M = function(k) {
        Object(t.provide)(V, k);
      }, L = function() {
        return Object(t.inject)(V);
      }, A = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(k, $) {
        var I = $.emit, P = L(), Q = Object(t.computed)(function() {
          return { borderTopColor: P == null ? void 0 : P.color };
        }), ue = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function pe() {
          ue.showIndex !== 0 && (ue.showIndex -= 1);
        }
        function de() {
          ue.showIndex !== ue.showList.length - 1 && (ue.showIndex += 1);
        }
        function be() {
          ue.showIndex = 0, ue.showList = [], ue.valueList = [], b.emit("resultReset");
        }
        function Me(Fe) {
          be(), I("change", Fe);
        }
        return Object(t.watch)(function() {
          return k.data;
        }, function(Fe) {
          var qe;
          ue.showIndex = 0, ue.valueList = (Fe == null || (qe = Fe.value) === null || qe === void 0 ? void 0 : qe.split("")) || [], ue.valueList.length !== 0 ? ue.showList = H(ue.valueList, 11) : ue.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          b.on("keyBoardChange", function(Fe) {
            b.emit("updateBound"), ue.status = Fe, be();
          }), b.on("getWordsFromServer", function(Fe) {
            var qe = Array.from(new Set(Fe.replace(/\s+/g, "").split("")));
            ue.valueList = qe, ue.showList = H(qe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          b.remove("keyBoardChange"), b.remove("getWordsFromServer");
        }), f({ color: P == null ? void 0 : P.color, upper: pe, lower: de, getStyle: Q, selectWord: Me }, Object(t.toRefs)(ue));
      } });
      e("e66c"), A.render = ie, A.__scopeId = "data-v-02e63132";
      var z = A, te = e("bc3a"), U = e.n(te), xe = 15e3, ve = function(k) {
        U.a.defaults.baseURL = k, U.a.defaults.timeout = xe, U.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Pe(k, $, I, P, Q, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: k.color } }, [Object(t.createVNode)("use", { "xlink:href": k.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Ue = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(k) {
        var $ = L(), I = Object(t.computed)(function() {
          return "#icon-".concat(k.iconClass);
        });
        return { color: $ == null ? void 0 : $.color, iconName: I };
      } });
      e("38cd"), Ue.render = Pe;
      var Be = Ue, Le = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Ae = { class: "hand-write-board" }, ze = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Xe = Le(function(k, $, I, P, Q, ue) {
        var pe = Object(t.resolveComponent)("PaintBoard"), de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ae, [Object(t.createVNode)(pe, { lib: k.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", ze, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.handBoardOperList, function(be) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: be.type, type: be.type, data: be.data, isCn: k.isCn, onClick: k.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), N = { class: "paint-board" };
      function B(k, $, I, P, Q, ue) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", N, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: k.width, height: k.height, onTouchstart: $[1] || ($[1] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onTouchmove: $[2] || ($[2] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onTouchend: $[3] || ($[3] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMousedown: $[4] || ($[4] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onMousemove: $[5] || ($[5] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onMouseup: $[6] || ($[6] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMouseleave: $[7] || ($[7] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function X(k, $, I, P, Q, ue, pe) {
        try {
          var de = k[ue](pe), be = de.value;
        } catch (Me) {
          return void I(Me);
        }
        de.done ? $(be) : Promise.resolve(be).then(P, Q);
      }
      function F(k) {
        return function() {
          var $ = this, I = arguments;
          return new Promise(function(P, Q) {
            var ue = k.apply($, I);
            function pe(be) {
              X(ue, P, Q, pe, de, "next", be);
            }
            function de(be) {
              X(ue, P, Q, pe, de, "throw", be);
            }
            pe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var ne, oe, ye = function() {
        var k = F(regeneratorRuntime.mark(function $(I, P, Q, ue) {
          return regeneratorRuntime.wrap(function(pe) {
            for (; ; ) switch (pe.prev = pe.next) {
              case 0:
                return pe.next = 2, U.a.post("", { lib: ue, lpXis: I, lpYis: P, lpCis: Q });
              case 2:
                return pe.abrupt("return", pe.sent);
              case 3:
              case "end":
                return pe.stop();
            }
          }, $);
        }));
        return function($, I, P, Q) {
          return k.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(k) {
        var $ = L(), I = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), P = Object(t.ref)(null);
        function Q() {
          return ue.apply(this, arguments);
        }
        function ue() {
          return ue = F(regeneratorRuntime.mark(function Ie() {
            var He, Ve;
            return regeneratorRuntime.wrap(function(Ze) {
              for (; ; ) switch (Ze.prev = Ze.next) {
                case 0:
                  return Ze.next = 2, ye(I.clickX, I.clickY, I.clickC, k.lib);
                case 2:
                  He = Ze.sent, Ve = He.data, b.emit("getWordsFromServer", (Ve == null ? void 0 : Ve.v) || "");
                case 5:
                case "end":
                  return Ze.stop();
              }
            }, Ie);
          })), ue.apply(this, arguments);
        }
        function pe() {
          P.value && ne && (I.clickX = [], I.clickY = [], I.clickC = [], ne.clearRect(0, 0, I.width, I.height));
        }
        function de(Ie) {
          if (Ie.type.includes("mouse")) {
            var He = Ie;
            return Math.floor(He.clientX - I.x);
          }
          if (Ie.type.includes("touch")) {
            var Ve, Ze = Ie;
            return Math.floor(((Ve = Ze.targetTouches[0]) === null || Ve === void 0 ? void 0 : Ve.clientX) - I.x);
          }
          return 0;
        }
        function be(Ie) {
          if (Ie.type.includes("mouse")) {
            var He = Ie;
            return Math.floor(He.clientY - I.y);
          }
          if (Ie.type.includes("touch")) {
            var Ve, Ze = Ie;
            return Math.floor(((Ve = Ze.targetTouches[0]) === null || Ve === void 0 ? void 0 : Ve.clientY) - I.y);
          }
          return 0;
        }
        function Me(Ie) {
          if (ne) {
            I.isMouseDown = !0;
            var He = de(Ie), Ve = be(Ie);
            clearTimeout(oe), I.oldX = He, I.oldY = Ve, ne.beginPath();
          }
        }
        function Fe(Ie) {
          if (ne && (Ie.preventDefault(), I.isMouseDown)) {
            var He = de(Ie), Ve = be(Ie);
            I.clickX.push(He), I.clickY.push(Ve), I.clickC.push(0), ne.strokeStyle = $ == null ? void 0 : $.color, ne.fillStyle = $ == null ? void 0 : $.color, ne.lineWidth = 4, ne.lineCap = "round", ne.moveTo(I.oldX, I.oldY), ne.lineTo(He, Ve), ne.stroke(), I.oldX = He, I.oldY = Ve;
          }
        }
        function qe() {
          I.isMouseDown && (I.isMouseDown = !1, oe = setTimeout(function() {
            pe();
          }, 1500), I.clickC.pop(), I.clickC.push(1), Q());
        }
        function Qe() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ie = document.querySelector(".paint-board").getBoundingClientRect();
              I.x = Ie.x, I.y = Ie.y, I.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), I.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function pt() {
          var Ie;
          ne = (Ie = P.value) === null || Ie === void 0 ? void 0 : Ie.getContext("2d"), pe(), Qe(), window.addEventListener("animationend", Qe), window.addEventListener("resize", Qe), window.addEventListener("scroll", Qe);
        }
        return Object(t.onMounted)(function() {
          pt(), b.on("updateBound", function() {
            Qe();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", Qe), window.removeEventListener("resize", Qe), window.removeEventListener("scroll", Qe), b.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(I)), {}, { move: Fe, down: Me, mouseup: qe, canvasRef: P });
      } });
      he.render = B;
      var le = he;
      function ke(k, $, I, P, Q, ue) {
        var pe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(k.type), { "key-board-button-active": k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" }], style: k.getStyle, onClick: $[1] || ($[1] = function() {
          return k.click && k.click.apply(k, arguments);
        }), onMouseenter: $[2] || ($[2] = function(de) {
          return k.isHoverStatus = !0;
        }), onMouseleave: $[3] || ($[3] = function(de) {
          return k.isHoverStatus = !1;
        }) }, [k.type === "upper" || k.type === "delete" || k.type === "handwrite" || k.type === "close" || k.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(pe, { key: 0, "icon-class": k.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: k.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Oe = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Be }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(k, $) {
        var I = $.emit, P = L(), Q = Object(t.ref)(!1), ue = Object(t.computed)(function() {
          return k.type === "change2lang" ? k.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : k.isUpper ? k.data.toUpperCase() : k.data;
        }), pe = Object(t.computed)(function() {
          return k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" || Q.value ? { color: "#f5f5f5", background: P == null ? void 0 : P.color } : { color: P == null ? void 0 : P.color, background: "#f5f5f5" };
        });
        function de(be) {
          be.preventDefault(), I("click", { data: k.isUpper ? k.data.toUpperCase() : k.data, type: k.type });
        }
        return { isHoverStatus: Q, getStyle: pe, getCode: ue, click: de };
      } });
      e("de23"), Oe.render = ke;
      var Re = Oe, Y = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: le, KeyCodeButton: Re }, setup: function(k, $) {
        var I = $.emit, P = L(), Q = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ue(pe) {
          var de = pe.data, be = pe.type;
          switch (be) {
            case "close":
              P == null || P.closeKeyBoard();
              break;
            case "back":
              P == null || P.changeDefaultBoard(), b.emit("resultReset"), b.emit("keyBoardChange", Q.isCn && "CN");
              break;
            case "change2lang":
              Q.isCn = !Q.isCn;
              break;
            case "delete":
              I("trigger", { data: de, type: be });
              break;
          }
        }
        return f({ click: ue }, Object(t.toRefs)(Q));
      } });
      e("9aaf"), Y.render = Xe, Y.__scopeId = "data-v-1b5e0983";
      var W = Y, se = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var We = { class: "default-key-board" }, at = { class: "line line4" };
      Object(t.popScopeId)();
      var K = se(function(k, $, I, P, Q, ue) {
        var pe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", We, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.lineList, function(de, be) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(be + 1)], key: be }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(de, function(Me) {
            return Object(t.openBlock)(), Object(t.createBlock)(pe, { isUpper: k.isUpper, key: Me, type: Me, data: Me, isSymbol: k.isSymbol, onClick: k.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", at, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.line4, function(de) {
          return Object(t.openBlock)(), Object(t.createBlock)(pe, { key: de.type, type: de.type, data: de.data, isCn: k.isCn, isNum: k.isNum, onClick: k.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ae = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, me = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], re = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Re }, emits: ["translate", "trigger", "change"], setup: function(k, $) {
        var I = $.emit, P = L(), Q = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ue() {
          var de;
          Q.line4 = JSON.parse(JSON.stringify(q)), P != null && (de = P.modeList) !== null && de !== void 0 && de.find(function(be) {
            return be === "handwrite";
          }) && P !== null && P !== void 0 && P.handApi && Q.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function pe(de) {
          var be = de.data, Me = de.type;
          switch (Me) {
            case "close":
              Q.oldVal = "", P == null || P.closeKeyBoard();
              break;
            case "upper":
              Q.oldVal = "", Q.isUpper = !Q.isUpper;
              break;
            case "change2lang":
              Q.isCn = !Q.isCn, Q.isNum || Q.isSymbol || b.emit("keyBoardChange", Q.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (Q.isNum = !Q.isNum, Q.isSymbol = !1, Q.isNum) {
                var Fe;
                b.emit("keyBoardChange", "number");
                var qe = JSON.parse(JSON.stringify(me.line3));
                P != null && (Fe = P.modeList) !== null && Fe !== void 0 && Fe.find(function(Qe) {
                  return Qe === "symbol";
                }) || (qe.shift(), qe.unshift("+")), Q.lineList = [me.line1, me.line2, qe];
              } else b.emit("keyBoardChange", Q.isCn ? "CN" : "EN"), Q.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              Q.isSymbol = !Q.isSymbol, Q.isSymbol ? (b.emit("keyBoardChange", "symbol"), Q.lineList = [ae.line1, ae.line2, ae.line3]) : (b.emit("keyBoardChange", "number"), Q.lineList = [me.line1, me.line2, me.line3]);
              break;
            case "handwrite":
            case "delete":
              Q.isCn && Me === "delete" && Q.oldVal ? (Q.oldVal = Q.oldVal.substr(0, Q.oldVal.length - 1), I("translate", Q.oldVal)) : (Me === "handwrite" && b.emit("keyBoardChange", "handwrite"), I("trigger", { data: be, type: Me }));
              break;
            default:
              !Q.isCn || Q.isNum || Q.isSymbol ? I("change", be) : (I("translate", Q.oldVal + be), Q.oldVal = Q.oldVal + be);
              break;
          }
        }
        return ue(), Object(t.onMounted)(function() {
          b.on("resultReset", function() {
            Q.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(Q)), {}, { click: pe });
      } });
      e("f8b0"), re.render = K, re.__scopeId = "data-v-4b78e5a1";
      var ce = re, ge = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, De = e("ec57"), Ke = function(k) {
        return k.keys().map(k);
      };
      Ke(De);
      var et = [], je = null, tt = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: O }, components: { Result: z, SvgIcon: Be, HandBoard: W, DefaultBoard: ce }, setup: function(k, $) {
        var I = $.emit, P = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), Q = Object(t.ref)(null);
        function ue(Ee) {
          var Ce, Ne;
          switch (Object(t.nextTick)(function() {
            b.emit("keyBoardChange", "CN");
          }), Ee) {
            case "en":
              P.showMode = "default", Object(t.nextTick)(function() {
                var $e;
                ($e = Q.value) === null || $e === void 0 || $e.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              P.showMode = "default", Object(t.nextTick)(function() {
                var $e;
                ($e = Q.value) === null || $e === void 0 || $e.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Ce = k.modeList) !== null && Ce !== void 0 && Ce.find(function($e) {
                return $e === "handwrite";
              }) && k.handApi ? (P.showMode = "handwrite", Object(t.nextTick)(function() {
                b.emit("keyBoardChange", "handwrite");
              })) : P.showMode = "default";
              break;
            case "symbol":
              P.showMode = "default", (Ne = k.modeList) !== null && Ne !== void 0 && Ne.find(function($e) {
                return $e === "symbol";
              }) && Object(t.nextTick)(function() {
                var $e, nt;
                ($e = Q.value) === null || $e === void 0 || $e.click({ data: ".?123", type: "change2num" }), (nt = Q.value) === null || nt === void 0 || nt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              P.showMode = "default";
              break;
          }
        }
        function pe(Ee) {
          if (P.visible = !0, je = Ee.target, ue(je.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Ce = document.querySelector(".key-board-modal");
            Ce.style.display = "block";
          }
        }
        function de() {
          if (je && je.blur(), je = null, P.visible = !1, I("closed"), P.showMode = "default", P.resultVal = {}, document.querySelector(".key-board-modal")) {
            var Ee = document.querySelector(".key-board-modal");
            Ee.style.display = "none";
          }
        }
        function be() {
          k.closeOnClickModal && de(), I("modalClick");
        }
        function Me() {
          var Ee;
          if (document.querySelector(".key-board-modal")) {
            var Ce;
            (Ce = document.querySelector(".key-board-modal")) === null || Ce === void 0 || Ce.addEventListener("click", be);
          } else {
            var Ne = document.createElement("div");
            Ne.className = "key-board-modal", Ne.style.display = "none", (Ee = document.querySelector("body")) === null || Ee === void 0 || Ee.appendChild(Ne), Ne.addEventListener("click", be);
          }
        }
        function Fe() {
          k.handApi && ve(k.handApi), [].concat(y(document.querySelectorAll("input")), y(document.querySelectorAll("textarea"))).forEach(function(Ee) {
            Ee.getAttribute("data-mode") !== null && (et.push(Ee), Ee.addEventListener("focus", pe), k.blurHide && Ee.addEventListener("blur", de));
          });
        }
        function qe(Ee) {
          if (!je) return "";
          var Ce = je, Ne = Ce.selectionStart, $e = Ce.selectionEnd;
          if (!Ne || !$e) return "";
          var nt = Ee.substring(0, Ne - 1) + Ee.substring($e);
          return Ce.value = nt, Ce.focus(), Ce.selectionStart = Ne - 1, Ce.selectionEnd = Ne - 1, nt;
        }
        function Qe(Ee) {
          var Ce = Ee.type;
          switch (Ce) {
            case "handwrite":
              P.showMode = "handwrite";
              break;
            case "delete":
              if (!je) return;
              var Ne = qe(je.value);
              je.value = Ne, I("change", Ne, je.getAttribute("data-prop") || je);
              break;
          }
        }
        function pt(Ee, Ce) {
          if (!je) return "";
          var Ne = je, $e = Ne.selectionStart || 0, nt = Ne.selectionEnd || 0, kt = Ee.substring(0, $e) + Ce + Ee.substring(nt);
          return Ne.value = kt, Ne.focus(), Ne.selectionStart = $e + Ce.length, Ne.selectionEnd = $e + Ce.length, kt;
        }
        function Ie(Ee) {
          if (je) {
            var Ce = pt(je.value, Ee);
            je.value = Ce, I("change", Ce, je.getAttribute("data-prop") || je), I("keyChange", Ee, je.getAttribute("data-prop") || je);
          }
        }
        function He(Ee) {
          var Ce = new RegExp("^".concat(Ee, "\\w*")), Ne = Object.keys(ge).filter(function($e) {
            return Ce.test($e);
          }).sort();
          P.resultVal = { code: Ee, value: Ee ? Ne.length > 1 ? Ne.reduce(function($e, nt) {
            return $e + ge[nt];
          }, "") : ge[Ne[0]] : "" }, je && I("keyChange", Ee, je.getAttribute("data-prop") || je);
        }
        function Ve() {
          Fe();
        }
        function Ze() {
          return je;
        }
        return Object(t.onMounted)(function() {
          k.modal && Me(), Fe(), b.on("resultReset", function() {
            P.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var Ee;
          (Ee = document.querySelector(".key-board-modal")) === null || Ee === void 0 || Ee.removeEventListener("click", be), et.forEach(function(Ce) {
            Ce.removeEventListener("focus", pe), Ce.removeEventListener("blur", de);
          });
        }), M(Object(t.reactive)({ color: k.color, modeList: k.modeList, handApi: k.handApi, closeKeyBoard: function() {
          de();
        }, changeDefaultBoard: function() {
          P.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(P)), {}, { defaultBoardRef: Q, getCurrentInput: Ze, translate: He, reSignUp: Ve, trigger: Qe, change: Ie });
      } });
      tt.render = a;
      var Ge = tt;
      Ge.install = function(k) {
        k.component(Ge.name, Ge);
      };
      var gt = Ge, Pt = gt;
      d.default = Pt;
    }, fb6a: function(i, d, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), u = e("50c4"), s = e("fc6a"), a = e("8418"), c = e("b622"), l = e("1dde"), f = l("slice"), g = c("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(h, m) {
        var y, j, C, x = s(this), S = u(x.length), b = t(h, S), w = t(m === void 0 ? S : m, S);
        if (o(x) && (y = x.constructor, typeof y != "function" || y !== Array && !o(y.prototype) ? r(y) && (y = y[g], y === null && (y = void 0)) : y = void 0, y === Array || y === void 0)) return p.call(x, b, w);
        for (j = new (y === void 0 ? Array : y)(v(w - b, 0)), C = 0; b < w; b++, C++) b in x && a(j, C, x[b]);
        return j.length = C, j;
      } });
    }, fc6a: function(i, d, e) {
      var n = e("44ad"), r = e("1d80");
      i.exports = function(o) {
        return n(r(o));
      };
    }, fdbc: function(i, d) {
      i.exports = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
    }, fdbf: function(i, d, e) {
      var n = e("4930");
      i.exports = n && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }, fea9: function(i, d, e) {
      var n = e("da84");
      i.exports = n.Promise;
    } });
  });
})(Lt);
var Sr = Lt.exports;
const At = /* @__PURE__ */ _r(Sr);
Bt({
  components: { KeyBoard: At },
  setup() {
    function we(ee, Z) {
      console.log("change value ---->", ee), console.log("change input dom ---->", Z);
    }
    return {
      change: we
    };
  }
});
const Or = { class: "wifi-component" }, jr = { class: "row" }, Er = { class: "column" }, Cr = { class: "column" }, Tr = { class: "status" }, Lr = { class: "row" }, Ar = { class: "column" }, Pr = {
  key: 0,
  class: "wifi-modal"
}, Ir = { class: "wifi-modal-content" }, Nr = { class: "wifi-list" }, Br = {
  key: 0,
  class: "no-wifi"
}, Rr = ["onClick"], $r = { class: "wifi-ssid" }, Ur = { class: "signal-strength" }, Mr = {
  __name: "WiFi",
  setup(we) {
    const { sendToPyQt: ee } = Ye(), Z = G("未连接"), i = G("无网络"), d = G("未知"), e = G(""), n = G(""), r = G(!1), o = G([]), t = G(null), u = () => {
      ee("check_wifi_status", {});
    }, s = () => {
      t.value = setInterval(u, 5e3);
    }, a = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    ft(() => {
      s();
      const { message: h } = Ye();
      rt(h, (m) => {
        if (m && m.type === "wifi_list") {
          const y = JSON.parse(m.content);
          o.value = y;
        } else if (m && m.type === "wifi_status") {
          const y = JSON.parse(m.content);
          Z.value = y.wifi_name, i.value = y.internet_status, d.value = y.zerotier_ip;
        }
      });
    }), xt(() => {
      a();
    });
    const c = async () => {
      r.value = !0, o.value = [], document.body.style.overflow = "hidden", l();
    }, l = () => {
      o.value = [], ee("search_wifi", {});
    }, f = () => {
      r.value = !1, document.body.style.overflow = "auto";
    }, g = (h) => {
      e.value = h.ssid, f();
    }, p = () => {
      ee("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, v = (h, m) => {
      m.placeholder === "WiFi 名称" ? e.value = h : m.placeholder === "WiFi 密码" && (n.value = h);
    };
    return (h, m) => (_e(), Se("div", Or, [
      E("div", jr, [
        E("div", Er, [
          lt(E("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (y) => e.value = y),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, e.value]
          ])
        ]),
        E("div", Cr, [
          E("div", Tr, [
            dt(" WiFi: " + Te(Z.value) + " | 网络: " + Te(i.value) + " ", 1),
            m[2] || (m[2] = E("br", null, null, -1)),
            dt(" zerotier ip地址: " + Te(d.value), 1)
          ])
        ])
      ]),
      E("div", Lr, [
        E("div", Ar, [
          lt(E("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (y) => n.value = y),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, n.value]
          ])
        ]),
        E("div", { class: "column" }, [
          E("div", { class: "button-group" }, [
            E("button", { onClick: c }, "搜索可用 WiFi"),
            E("button", { onClick: p }, "连接 WiFi")
          ])
        ])
      ]),
      Je(Rt(At), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: v,
        class: "scaled-keyboard"
      }),
      r.value ? (_e(), Se("div", Pr, [
        E("div", Ir, [
          m[4] || (m[4] = E("h2", null, "可用的WiFi网络", -1)),
          E("div", Nr, [
            o.value.length === 0 ? (_e(), Se("div", Br, m[3] || (m[3] = [
              E("div", { class: "loading-spinner" }, null, -1),
              E("div", null, "搜索中...", -1)
            ]))) : (_e(!0), Se(ot, { key: 1 }, it(o.value, (y) => (_e(), Se("div", {
              key: y.ssid,
              class: "wifi-item",
              onClick: (j) => g(y)
            }, [
              E("span", $r, Te(y.ssid), 1),
              E("span", Ur, "信号强度: " + Te(y.signal), 1)
            ], 8, Rr))), 128))
          ]),
          E("div", { class: "modal-buttons" }, [
            E("button", { onClick: l }, "重新搜索"),
            E("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : st("", !0)
    ]));
  }
}, Dr = /* @__PURE__ */ ct(Mr, [["__scopeId", "data-v-e6b1dc64"]]), Fr = {
  key: 0,
  class: "numeric-keyboard"
}, Vr = { class: "keyboard" }, Wr = { class: "current-value" }, qr = ["onClick"], zr = {
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
  setup(we, { emit: ee }) {
    const Z = we, i = ee, d = G([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = G("");
    rt(() => Z.showKeyboard, (r) => {
      r && (e.value = Z.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => we.showKeyboard ? (_e(), Se("div", Fr, [
      E("div", Vr, [
        E("div", Wr, Te(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (u) => (_e(), Se("button", {
            key: u,
            onClick: (s) => n(u),
            class: ut({ "function-key": u === "清除" || u === "确定" })
          }, Te(u), 11, qr))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, St = /* @__PURE__ */ ct(zr, [["__scopeId", "data-v-2ccc1cb7"]]), Kr = { class: "container" }, Qr = { class: "column" }, Hr = { class: "status-bar" }, Gr = ["disabled"], Jr = { class: "column" }, Yr = {
  key: 0,
  class: "modal"
}, Xr = { class: "modal-content" }, Zr = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(we, { emit: ee }) {
    const { sendToPyQt: Z } = Ye(), i = mt({
      isPyQtWebEngine: !1
    }), d = G("未激活"), e = G(0), n = G(""), r = G(""), o = G(!1), t = G(7776e3);
    let u, s;
    const a = G(0), c = G(1), l = G(null), f = G(!1), g = G(!1), p = ht(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${c.value} 次锁定 - 剩余时间: ${v.value}`), v = ht(() => {
      const H = Math.floor(e.value / 86400), V = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), M = Math.floor(e.value % (60 * 60) / 60), L = e.value % 60;
      return `${H}天 ${V.toString().padStart(2, "0")}:${M.toString().padStart(2, "0")}:${L.toString().padStart(2, "0")}`;
    }), h = ht(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function m(H) {
      d.value === "未激活" && (H.target.setPointerCapture(H.pointerId), a.value = 0, s = setInterval(() => {
        a.value += 2, a.value >= 100 && (clearInterval(s), C());
      }, 30));
    }
    function y(H) {
      H.target.releasePointerCapture(H.pointerId), j();
    }
    function j() {
      clearInterval(s), a.value = 0;
    }
    function C() {
      Z("activate_device", {});
    }
    function x(H, V) {
      Z("Lock_set_response", { method: "activateDevice", args: { randomCode: H, time: V } }), d.value = "已激活", n.value = H, l.value = V, S();
    }
    function S() {
      b(), u = setInterval(() => {
        e.value > 0 ? b() : w();
      }, 1e3);
    }
    function b() {
      const H = Date.now(), V = l.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((V - H) / 1e3));
    }
    function w() {
      o.value = !0, document.body.style.overflow = "hidden", clearInterval(u), ie();
    }
    function O() {
      T(r.value);
    }
    function T(H) {
      Z("check_lock_password", {
        target: "attemptUnlock",
        password: H,
        lockCount: c.value,
        deviceRandomCode: n.value
      }), r.value = "";
    }
    function _() {
      d.value = "永久激活", o.value = !1, document.body.style.overflow = "auto", clearInterval(u);
    }
    function R() {
      o.value = !1, document.body.style.overflow = "auto", c.value++, u && clearInterval(u), S();
    }
    xt(() => {
      clearInterval(u), clearInterval(s);
    }), ft(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = Ye();
        rt(H, (V) => {
          if (V && V.type === "confirm_lock_password")
            try {
              const M = JSON.parse(V.content);
              M.target === "attemptUnlock" && (M.result === "success" ? (o.value ? l.value = Date.now() : l.value = l.value + t.value * 1e3, Z("update_baseTime", l.value), R(), Z("Lock_set_response", { method: "extendLockTime", args: { baseTime: l.value } })) : M.result === "forever_success" ? (_(), Z("Lock_set_response", { method: "permanentUnlock", args: {} })) : Z("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (M) {
              console.error("Failed to parse confirm lock password :", M);
            }
          else if (V && V.type === "device_activated")
            try {
              const M = JSON.parse(V.content);
              x(M.device_random_code, M.device_base_time);
            } catch (M) {
              console.error("Failed to parse device activation result:", M);
            }
          else if (V && V.type === "device_info")
            try {
              const M = JSON.parse(V.content);
              d.value = M.device_status, n.value = M.device_random_code, c.value = M.device_lock_count, l.value = M.device_base_time, M.device_status === "已激活" ? S() : M.device_status === "永久激活" && _();
            } catch (M) {
              console.error("Failed to parse device status:", M);
            }
          else if (V && V.type === "Lock_init")
            D();
          else if (V && V.type === "Lock_set") {
            console.log("Lock_set:", V.content);
            const M = JSON.parse(V.content);
            M.method === "requestActivation" ? C() : M.method === "attemptUnlock" && T(M.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const D = () => {
      const H = {
        deviceStatus: d.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: r.value,
        isLocked: o.value,
        lockInterval: t.value,
        lockCount: c.value,
        baseTime: l.value,
        progressWidth: a.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: g.value
      };
      console.log("Sending Lock initial state:", H), Z("Lock_init_response", H);
    }, J = ee, ie = () => {
      J("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (H, V) => (_e(), Se("div", Kr, [
      E("div", Qr, [
        E("div", Hr, Te(p.value), 1),
        E("button", {
          class: "activation-button",
          onPointerdown: m,
          onPointerup: y,
          onPointercancel: j,
          onPointerleave: j,
          disabled: d.value !== "未激活"
        }, [
          dt(Te(h.value) + " ", 1),
          E("div", {
            class: "progress-bar",
            style: Ot({ width: a.value + "%" })
          }, null, 4)
        ], 40, Gr)
      ]),
      E("div", Jr, [
        lt(E("input", {
          "onUpdate:modelValue": V[0] || (V[0] = (M) => r.value = M),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: V[1] || (V[1] = (M) => f.value = !0)
        }, null, 544), [
          [vt, r.value]
        ]),
        E("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      o.value ? (_e(), Se("div", Yr, [
        E("div", Xr, [
          V[8] || (V[8] = E("h3", null, "设备已锁定", -1)),
          E("h3", null, "第 " + Te(c.value) + " 次锁定", 1),
          E("h3", null, "设备随机码: " + Te(n.value), 1),
          lt(E("input", {
            "onUpdate:modelValue": V[2] || (V[2] = (M) => r.value = M),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: V[3] || (V[3] = (M) => g.value = !0)
          }, null, 544), [
            [vt, r.value]
          ]),
          E("button", {
            class: "unlock-button",
            onClick: O
          }, "解锁")
        ])
      ])) : st("", !0),
      Je(St, {
        modelValue: r.value,
        "onUpdate:modelValue": V[4] || (V[4] = (M) => r.value = M),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": V[5] || (V[5] = (M) => f.value = M)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Je(St, {
        modelValue: r.value,
        "onUpdate:modelValue": V[6] || (V[6] = (M) => r.value = M),
        showKeyboard: g.value,
        "onUpdate:showKeyboard": V[7] || (V[7] = (M) => g.value = M)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, eo = /* @__PURE__ */ ct(Zr, [["__scopeId", "data-v-3d3fd364"]]), to = { class: "app-container" }, ro = {
  __name: "App",
  setup(we) {
    Ut();
    const ee = G(""), Z = (i) => {
      ee.value = i;
    };
    return (i, d) => (_e(), Se("div", to, [
      d[0] || (d[0] = E("h1", null, "涪特智能养护台车控制系统", -1)),
      Je(Bn),
      Je(xr),
      Je(un),
      Je(lr, { message: ee.value }, null, 8, ["message"]),
      Je(Dr),
      Je(eo, { onMessageFromA: Z })
    ]));
  }
};
export {
  ro as default
};
