import Nt, { ref as G, onMounted as ft, provide as yt, readonly as bt, inject as wt, watch as rt, openBlock as _e, createElementBlock as Se, createElementVNode as j, toDisplayString as Te, Fragment as ot, renderList as it, normalizeClass as ct, createCommentVNode as ut, reactive as mt, createVNode as Ge, withDirectives as lt, vModelRadio as _t, createTextVNode as dt, vModelText as vt, onUnmounted as xt, computed as ht, normalizeStyle as Ot, defineComponent as Pt, unref as Bt } from "vue";
const jt = Symbol(), Et = Symbol(), Ct = Symbol();
function $t(be, Z) {
  be && be.messageSignal ? be.messageSignal.connect((ee) => {
    try {
      const u = JSON.parse(ee);
      Z.value = u, console.log("Received message from PyQt:", u);
    } catch (u) {
      console.error("Failed to parse message:", u), Z.value = { type: "unknown", content: ee };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Rt() {
  const be = G(null), Z = G(null), ee = G("");
  function u() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      be.value = d, Z.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), $t(Z.value, ee), Z.value && typeof Z.value.vueReady == "function" ? Z.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  ft(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? u() : document.addEventListener("DOMContentLoaded", u);
  }), yt(jt, bt(be)), yt(Et, bt(Z)), yt(Ct, bt(ee));
}
function Je() {
  const be = wt(jt), Z = wt(Et), ee = wt(Ct);
  return (!be || !Z || !ee) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: be,
    bridge: Z,
    message: ee,
    sendToPyQt: (d, e) => {
      if (console.log(`Attempting to call ${d} with args:`, e), Z && Z.value)
        if (typeof Z.value.sendToPyQt == "function")
          try {
            Z.value.sendToPyQt(d, JSON.stringify(e));
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
const st = (be, Z) => {
  const ee = be.__vccOpts || be;
  for (const [u, d] of Z)
    ee[u] = d;
  return ee;
}, Ut = {
  key: 0,
  class: "numeric-keyboard"
}, Mt = { class: "keyboard" }, Dt = { class: "current-value" }, Ft = ["onClick"], Vt = {
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
    const ee = be, u = Z, d = G([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = G("");
    rt(() => ee.showKeyboard, (r) => {
      r && (e.value = ee.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (u("update:modelValue", parseFloat(e.value) || 0), u("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (_e(), Se("div", Ut, [
      j("div", Mt, [
        j("div", Dt, Te(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (i) => (_e(), Se("button", {
            key: i,
            onClick: (c) => n(i),
            class: ct({ "function-key": i === "清除" || i === "确定" })
          }, Te(i), 11, Ft))), 128))
        ]))), 128))
      ])
    ])) : ut("", !0);
  }
}, Tt = /* @__PURE__ */ st(Vt, [["__scopeId", "data-v-541feda2"]]), Wt = { class: "settings-container" }, qt = { class: "setting-group" }, zt = { class: "setting-item" }, Kt = { class: "setting-controls" }, Qt = ["value"], Ht = { class: "setting-item" }, Gt = { class: "setting-controls" }, Jt = ["value"], Yt = { class: "setting-group" }, Xt = { class: "setting-item" }, Zt = { class: "setting-controls" }, en = ["value"], tn = { class: "setting-item" }, nn = { class: "setting-controls" }, rn = ["value"], on = {
  __name: "SensorSettings",
  setup(be) {
    const { sendToPyQt: Z } = Je(), ee = mt({
      isPyQtWebEngine: !1
    }), u = G(35), d = G(25), e = G(95), n = G(90), r = G(!1), o = G(null), t = G("");
    ft(() => {
      if (ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: b } = Je();
        rt(b, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const v = JSON.parse(p.content);
              u.value = v.temp_upper, d.value = v.temp_lower, e.value = v.humidity_upper, n.value = v.humidity_lower, console.log("Sensor Settings updated:", v);
            } catch (v) {
              console.error("Failed to parse sensor settings data:", v);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), l();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const h = JSON.parse(p.content).args;
            u.value = h.temp_upper, d.value = h.temp_lower, e.value = h.humidity_upper, n.value = h.humidity_lower, l();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const i = (b, p) => {
      const v = b === "tempUpper" ? u : b === "tempLower" ? d : b === "humidityUpper" ? e : n;
      v.value = (v.value || 0) + p, b.startsWith("temp") ? c(b === "tempUpper" ? "upper" : "lower") : a(b === "humidityUpper" ? "upper" : "lower");
    }, c = (b) => {
      u.value === "" && (u.value = d.value + 1), d.value === "" && (d.value = u.value - 1), b === "upper" ? u.value = Math.max(d.value + 1, u.value) : d.value = Math.min(u.value - 1, d.value), l();
    }, a = (b) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), b === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), l();
    }, l = () => {
      if (u.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const b = {
          temp_upper: u.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", b), ee.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), Z("updateLimitSettings", b)) : console.log("在普通网页环境中执行更新设置");
      }
    }, s = (b) => {
      o.value = b, r.value = !0, t.value = b.startsWith("temp") ? b === "tempUpper" ? u.value : d.value : b === "humidityUpper" ? e.value : n.value;
    }, f = (b) => {
      const p = parseFloat(b);
      isNaN(p) || (o.value === "tempUpper" ? (u.value = p, c("upper")) : o.value === "tempLower" ? (d.value = p, c("lower")) : o.value === "humidityUpper" ? (e.value = p, a("upper")) : o.value === "humidityLower" && (n.value = p, a("lower"))), o.value = null;
    };
    return (b, p) => (_e(), Se("div", Wt, [
      j("div", qt, [
        p[15] || (p[15] = j("h2", null, "温度设置 (°C)", -1)),
        j("div", zt, [
          p[13] || (p[13] = j("span", { class: "setting-label" }, "上限：", -1)),
          j("div", Kt, [
            j("button", {
              onClick: p[0] || (p[0] = (v) => i("tempUpper", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: u.value,
              onFocus: p[1] || (p[1] = (v) => s("tempUpper")),
              readonly: ""
            }, null, 40, Qt),
            j("button", {
              onClick: p[2] || (p[2] = (v) => i("tempUpper", 1))
            }, "+")
          ])
        ]),
        j("div", Ht, [
          p[14] || (p[14] = j("span", { class: "setting-label" }, "下限：", -1)),
          j("div", Gt, [
            j("button", {
              onClick: p[3] || (p[3] = (v) => i("tempLower", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (v) => s("tempLower")),
              readonly: ""
            }, null, 40, Jt),
            j("button", {
              onClick: p[5] || (p[5] = (v) => i("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      j("div", Yt, [
        p[18] || (p[18] = j("h2", null, "湿度设置 (%)", -1)),
        j("div", Xt, [
          p[16] || (p[16] = j("span", { class: "setting-label" }, "上限：", -1)),
          j("div", Zt, [
            j("button", {
              onClick: p[6] || (p[6] = (v) => i("humidityUpper", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => s("humidityUpper")),
              readonly: ""
            }, null, 40, en),
            j("button", {
              onClick: p[8] || (p[8] = (v) => i("humidityUpper", 1))
            }, "+")
          ])
        ]),
        j("div", tn, [
          p[17] || (p[17] = j("span", { class: "setting-label" }, "下限：", -1)),
          j("div", nn, [
            j("button", {
              onClick: p[9] || (p[9] = (v) => i("humidityLower", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => s("humidityLower")),
              readonly: ""
            }, null, 40, rn),
            j("button", {
              onClick: p[11] || (p[11] = (v) => i("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Ge(Tt, {
        modelValue: t.value,
        showKeyboard: r.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": p[12] || (p[12] = (v) => r.value = v)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, an = /* @__PURE__ */ st(on, [["__scopeId", "data-v-c66c99de"]]), un = {
  key: 0,
  class: "numeric-keyboard"
}, sn = { class: "keyboard" }, cn = { class: "current-value" }, ln = ["onClick"], dn = {
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
  setup(be, { emit: Z }) {
    const ee = be, u = Z, d = G([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = G("");
    rt(() => ee.showKeyboard, (r) => {
      r && (e.value = ee.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (u("update:modelValue", parseFloat(e.value) || 0), u("update:showKeyboard", !1)) : r === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : r === "." && e.value.includes(".") || (e.value += r);
    };
    return (r, o) => be.showKeyboard ? (_e(), Se("div", un, [
      j("div", sn, [
        j("div", cn, Te(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (i) => (_e(), Se("button", {
            key: i,
            onClick: (c) => n(i),
            class: ct({
              "function-key": ["清除", "确定"].includes(i),
              "operator-key": i === "-"
            })
          }, Te(i), 11, ln))), 128))
        ]))), 128))
      ])
    ])) : ut("", !0);
  }
}, fn = /* @__PURE__ */ st(dn, [["__scopeId", "data-v-3e928534"]]), pn = { class: "sensor-data-group" }, vn = { class: "sensor-section" }, hn = { class: "sensor-container" }, mn = { class: "sensor-grid" }, gn = ["onClick"], yn = { class: "sensor-title" }, bn = { class: "sensor-value" }, wn = { class: "sensor-section" }, xn = { class: "sensor-container" }, kn = { class: "sensor-grid" }, _n = ["onClick"], Sn = { class: "sensor-title" }, On = { class: "sensor-value" }, jn = {
  key: 0,
  class: "dialog-overlay"
}, En = { class: "dialog" }, Cn = { class: "dialog-content" }, Tn = { class: "radio-group" }, An = { class: "input-group" }, Ln = ["placeholder"], In = { class: "dialog-actions" }, Nn = {
  __name: "SensorDisplay",
  setup(be) {
    const Z = G({ temperature: {}, humidity: {} }), ee = G({
      temperature: {},
      humidity: {}
    }), u = G(null), d = G(!1), e = G("offset"), n = G(""), { sendToPyQt: r } = Je();
    ft(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: l } = Je();
        rt(l, (s) => {
          if (s && s.type === "update_sensor_data")
            try {
              Z.value = JSON.parse(s.content);
            } catch (f) {
              console.error("Failed to parse sensor data:", f);
            }
          else if (s && s.type === "update_adjust_settings")
            try {
              const f = JSON.parse(s.content);
              ee.value.temperature = f.temperature, ee.value.humidity = f.humidity;
            } catch (f) {
              console.error("Failed to parse adjustments data:", f);
            }
          else s && s.type === "get_sensor_data" && r("update_remote_sensor_data", Z.value);
        });
      } else
        console.log("在普通网页环境中执行"), o(), setInterval(o, 5e3);
    });
    const o = async () => {
      try {
        const l = await fetch("http://localhost:8000/api/sensor-data/");
        if (!l.ok)
          throw new Error(`HTTP error! status: ${l.status}`);
        const s = await l.json();
        Z.value = s;
      } catch (l) {
        console.error("Error fetching sensor data:", l);
      }
    }, t = G(!1), i = G(""), c = (l, s) => {
      u.value = s, n.value = l;
      const f = ee.value[l][s];
      f ? (e.value = f.type, i.value = String(f.value)) : (e.value = "offset", i.value = ""), d.value = !0, t.value = !1;
    }, a = async () => {
      try {
        const l = {
          sensorType: n.value,
          sensorId: u.value,
          adjustmentType: e.value,
          value: parseFloat(i.value) || 0
        };
        ee.value[n.value] || (ee.value[n.value] = {}), ee.value[n.value][u.value] = {
          type: e.value,
          value: parseFloat(i.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && r("adjust_sensor", l), d.value = !1, i.value = "", t.value = !1;
      } catch (l) {
        console.error("Error applying adjustment:", l);
      }
    };
    return (l, s) => (_e(), Se("div", pn, [
      j("div", vn, [
        s[7] || (s[7] = j("h2", null, "温度传感器", -1)),
        j("div", hn, [
          j("div", mn, [
            (_e(!0), Se(ot, null, it(Z.value.temperature, (f, b) => (_e(), Se("div", {
              key: b,
              class: "sensor-card",
              onClick: (p) => c("temperature", b)
            }, [
              j("div", yn, Te(b), 1),
              j("div", bn, Te(f), 1)
            ], 8, gn))), 128))
          ])
        ])
      ]),
      j("div", wn, [
        s[8] || (s[8] = j("h2", null, "湿度传感器", -1)),
        j("div", xn, [
          j("div", kn, [
            (_e(!0), Se(ot, null, it(Z.value.humidity, (f, b) => (_e(), Se("div", {
              key: b,
              class: "sensor-card",
              onClick: (p) => c("humidity", b)
            }, [
              j("div", Sn, Te(b), 1),
              j("div", On, Te(f), 1)
            ], 8, _n))), 128))
          ])
        ])
      ]),
      d.value ? (_e(), Se("div", jn, [
        j("div", En, [
          j("h3", null, "调整传感器: " + Te(u.value), 1),
          j("div", Cn, [
            j("div", Tn, [
              j("label", null, [
                lt(j("input", {
                  type: "radio",
                  "onUpdate:modelValue": s[0] || (s[0] = (f) => e.value = f),
                  value: "offset"
                }, null, 512), [
                  [_t, e.value]
                ]),
                s[9] || (s[9] = dt(" 调整偏移值 "))
              ]),
              j("label", null, [
                lt(j("input", {
                  type: "radio",
                  "onUpdate:modelValue": s[1] || (s[1] = (f) => e.value = f),
                  value: "value"
                }, null, 512), [
                  [_t, e.value]
                ]),
                s[10] || (s[10] = dt(" 直接设置值 "))
              ])
            ]),
            j("div", An, [
              lt(j("input", {
                type: "text",
                "onUpdate:modelValue": s[2] || (s[2] = (f) => i.value = f),
                readonly: "",
                onClick: s[3] || (s[3] = (f) => t.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Ln), [
                [vt, i.value]
              ])
            ])
          ]),
          j("div", In, [
            j("button", {
              onClick: s[4] || (s[4] = (f) => d.value = !1)
            }, "取消"),
            j("button", {
              onClick: a,
              class: "primary"
            }, "确定")
          ])
        ]),
        Ge(fn, {
          modelValue: i.value,
          "onUpdate:modelValue": s[5] || (s[5] = (f) => i.value = f),
          showKeyboard: t.value,
          "onUpdate:showKeyboard": s[6] || (s[6] = (f) => t.value = f)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : ut("", !0)
    ]));
  }
}, Pn = /* @__PURE__ */ st(Nn, [["__scopeId", "data-v-d5336aed"]]), Bn = { class: "integrated-control-system" }, $n = { class: "mode-controls" }, Rn = ["disabled"], Un = ["disabled"], Mn = { class: "systems-container" }, Dn = { class: "steam-engine-control left-box" }, Fn = { class: "steam_engine" }, Vn = ["disabled"], Wn = { class: "sprinkler-system middle-box" }, qn = { class: "spray-container" }, zn = { class: "control-row" }, Kn = { class: "sprinkler-section" }, Qn = { class: "visualization" }, Hn = ["onClick"], Gn = { class: "ato_engine" }, Jn = ["disabled"], Yn = { class: "text_status" }, Xn = { class: "time-control right-box" }, Zn = { class: "controls" }, er = { class: "input-group" }, tr = ["value"], nr = { class: "input-group" }, rr = ["value"], or = { class: "input-group" }, ir = ["value"], ar = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(be) {
    const Z = G(!1), ee = G(!1), u = G(10), d = G(0), e = G(10), n = G(u.value), r = G(d.value), o = G(e.value), t = G(u.value), i = G(d.value), c = G(e.value), a = G(0), l = G(""), s = G(Array(12).fill(0)), f = G(0), b = G(!0), p = G(!1), v = G(!1), h = G(null), m = G(""), g = G(!1), w = G(15), C = G(""), k = G(""), S = G(0), { sendToPyQt: y } = Je(), E = G(0), O = mt({
      isPyQtWebEngine: !1
    }), T = G([]);
    let _, D, F;
    const Y = be;
    rt(() => Y.message, (J) => {
      J != null && J.content && (b.value ? L("manual") : L("auto"));
    }), ft(() => {
      if (O.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: J } = Je();
        rt(J, (P) => {
          if (P && P.type === "update_left_steam_status")
            Z.value = P.content;
          else if (P && P.type === "IntegratedControlSystem_init")
            console.log("Received IntegratedControlSystem_init message"), W();
          else if (P && P.type === "update_right_steam_status")
            ee.value = P.content;
          else if (P && P.type === "update_sprinkler_settings")
            try {
              const re = JSON.parse(P.content);
              t.value = re.sprinkler_single_run_time, i.value = re.sprinkler_run_interval_time, c.value = re.sprinkler_loop_interval, r.value = i.value, n.value = t.value, o.value = c.value, console.log("Sprinkler Settings updated:", re);
            } catch (re) {
              console.error("Failed to parse sprinkler settings data:", re);
            }
          else if (P && P.type === "SprinklerSettings_set") {
            console.log("Received SprinklerSettings_set message:", P.content);
            const ke = JSON.parse(P.content).args;
            t.value = ke.sprinkler_single_run_time, i.value = ke.sprinkler_run_interval_time, c.value = ke.sprinkler_loop_interval, r.value = i.value, n.value = t.value, o.value = c.value, Ee();
          } else if (P && P.type === "IntegratedControlSystem_set") {
            console.log("Received IntegratedControlSystem_set message:", P.content);
            const re = JSON.parse(P.content);
            re.method === "startSystem" ? Fe() : re.method === "stopSystem" ? Qe() : re.method === "setMode" ? L(re.args.mode) : re.method === "click_toggleEngine" ? U() : re.method === "click_toggleSteamEngine" ? xe() : re.method === "toggleManualSprinkler" && ce(re.args.n);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    }), xt(() => {
      clearInterval(F), clearInterval(D), H();
    });
    const ae = (J) => {
      J !== void 0 && clearTimeout(J);
    }, H = () => {
      T.value.forEach((J) => {
        ae(J);
      }), T.value = [];
    }, W = () => {
      const J = {
        leftEngineOn: Z.value,
        rightEngineOn: ee.value,
        currentSingleRunTime: u.value,
        currentRunIntervalTime: d.value,
        currentLoopInterval: e.value,
        nextSingleRunTime: n.value,
        nextRunIntervalTime: r.value,
        nextLoopInterval: o.value,
        tempSingleRunTime: t.value,
        tempRunIntervalTime: i.value,
        tempLoopInterval: c.value,
        activeSprinkler: a.value,
        currentPhase: l.value,
        waterLevels: s.value,
        remainingTime: f.value,
        isAutoMode: b.value,
        isRunning: p.value,
        isSwitching: g.value,
        switchingTime: w.value,
        switchingMessage: C.value,
        switchPhase: k.value,
        phaseStartTime: E.value,
        chose_n: S.value
      };
      y("IntegratedControlSystem_init_response", J);
    }, V = ht(() => g.value ? `${C.value}，还需${w.value}秒` : b.value ? p.value ? l.value === "run" ? `喷头 ${a.value} 正在运行，剩余 ${f.value + 1} 秒` : l.value === "interval" ? `运行间隔中，剩余 ${f.value + 1} 秒` : l.value === "loop" ? `循环间隔中，剩余 ${f.value + 1} 秒` : "" : "系统未运行" : "手动模式");
    async function A(J, P) {
      return k.value = P, g.value = !0, w.value = 15, E.value = Date.now(), C.value = J ? "正在切换到喷淋管" : "正在切换到喷雾机", y("controlSprinkler", { target: "switchToSprinkler", state: J }), F = setInterval(() => {
        w.value--, w.value <= 0 && (clearInterval(F), g.value = !1);
      }, 1e3), new Promise((re) => {
        _ = setTimeout(() => {
          g.value = !1, re();
        }, w.value * 1e3), T.value.push(_);
      });
    }
    async function L(J) {
      const P = b.value;
      if (b.value = J === "auto", P !== b.value)
        if (O.isPyQtWebEngine && (y("IntegratedControlSystem_set_response", { method: "setMode", args: { mode: J } }), y("controlSprinkler", { target: "setMode", mode: b.value ? "auto" : "manual" })), b.value) {
          clearInterval(F), H(), g.value = !1, Z.value && await Q(), ee.value && await ne();
          const re = s.value.findIndex((ke) => ke === 100);
          re !== -1 && (s.value[re] = 0, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: re + 1, state: 0 })), y("controlSprinkler", { target: "tankWork", state: 0 });
        } else
          await Qe();
    }
    async function Q() {
      O.isPyQtWebEngine && (y("setEngineState", { engine: "left", state: !Z.value }), Z.value = !Z.value);
    }
    async function ne() {
      O.isPyQtWebEngine && (y("setEngineState", { engine: "right", state: !ee.value }), ee.value = !ee.value);
    }
    async function U() {
      const J = s.value.findIndex((P) => P === 100);
      O.isPyQtWebEngine && J === -1 && (y("IntegratedControlSystem_set_response", { method: "click_toggleEngine", args: {} }), Z.value ? y("controlSprinkler", { target: "tankWork", state: 0 }) : (await A(0, "click_toggleEngine"), y("controlSprinkler", { target: "tankWork", state: 1 })), y("setEngineState", { engine: "left", state: !Z.value }), Z.value = !Z.value);
    }
    async function xe() {
      O.isPyQtWebEngine && (y("IntegratedControlSystem_set_response", { method: "click_toggleSteamEngine", args: {} }), y("setEngineState", { engine: "right", state: !ee.value }), ee.value = !ee.value);
    }
    function ve(J) {
      h.value = J, v.value = !0, m.value = J === "singleRunTime" ? t.value.toString() : J === "runIntervalTime" ? i.value.toString() : c.value.toString();
    }
    function Ne(J) {
      const P = parseInt(J);
      isNaN(P) || (h.value === "singleRunTime" ? (t.value = P, Be()) : h.value === "runIntervalTime" ? (i.value = P, $e()) : h.value === "loopInterval" && (c.value = P, Ae())), h.value = null;
    }
    function Be() {
      t.value = Math.max(1, t.value), n.value = t.value, Ee();
    }
    function $e() {
      i.value = Math.max(0, i.value), r.value = i.value, Ee();
    }
    function Ae() {
      c.value = Math.max(0, c.value), o.value = c.value, Ee();
    }
    function Ee() {
      if (O.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const J = {
          sprinkler_single_run_time: n.value,
          sprinkler_run_interval_time: r.value,
          sprinkler_loop_interval: o.value
        };
        y("controlSprinkler", { target: "settings", settings: JSON.stringify(J) });
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    async function Fe() {
      y("IntegratedControlSystem_set_response", { method: "startSystem", args: {} }), !(p.value || !b.value) && (p.value = !0, s.value = Array(12).fill(0), await $());
    }
    async function Qe() {
      y("IntegratedControlSystem_set_response", { method: "stopSystem", args: {} }), O.isPyQtWebEngine && (a.value > 0 && y("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 0 }), y("controlSprinkler", { target: "setState", state: !1 })), Z.value && await Q(), ee.value && await ne(), B(), y("controlSprinkler", { target: "tankWork", state: 0 });
    }
    function B() {
      p.value = !1, g.value = !1, clearInterval(F), clearInterval(D), H(), a.value = 0, l.value = "", s.value = Array(12).fill(0), f.value = 0;
    }
    async function $() {
      await A(1, "runCycle"), a.value = 1, y("controlSprinkler", { target: "tankWork", state: 1 }), te();
    }
    async function X() {
      a.value = 1, te();
    }
    function M() {
      !p.value || !b.value || (f.value--, f.value > 0 && (_ = setTimeout(M, 1e3), T.value.push(_)));
    }
    function te() {
      if (!p.value || !b.value) return;
      l.value = "run", u.value = n.value, f.value = u.value, E.value = Date.now(), M();
      let J = Date.now();
      y("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 1 }), D = setInterval(() => {
        let P = Date.now() - J, re = Math.min(P / (u.value * 1e3), 1);
        s.value[a.value - 1] = re * 100;
      }, 100), _ = setTimeout(async () => {
        clearInterval(D), a.value < 12 ? (s.value[a.value - 1] = 0, y("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 0 }), ie()) : (s.value[a.value - 1] = 0, y("controlSprinkler", { target: "auto_control_sprayer", index: a.value, state: 0 }), we());
      }, u.value * 1e3), T.value.push(_);
    }
    function ie() {
      !p.value || !b.value || (d.value = r.value, f.value = d.value, E.value = Date.now(), f.value > 0 && (l.value = "interval"), M(), _ = setTimeout(() => {
        a.value++, te();
      }, d.value * 1e3), T.value.push(_));
    }
    async function we() {
      !p.value || !b.value || (e.value = o.value, f.value = e.value, f.value > 0 ? (y("controlSprinkler", { target: "tankWork", state: 0 }), await A(0, "runLoopInterval"), y("controlSprinkler", { target: "setState", state: !0 }), E.value = Date.now(), l.value = "loop", M(), a.value = 0, _ = setTimeout(async () => {
        s.value = Array(12).fill(0), y("controlSprinkler", { target: "setState", state: !1 }), Z.value && await Q(), y("controlSprinkler", { target: "tankWork", state: 0 }), await $();
      }, e.value * 1e3), T.value.push(_)) : (a.value = 0, s.value = Array(12).fill(0), await X()));
    }
    function ge(J) {
      return s.value[J - 1];
    }
    async function ce(J) {
      if (b.value) return;
      y("IntegratedControlSystem_set_response", { method: "toggleManualSprinkler", args: { n: J } });
      const P = s.value.findIndex((re) => re === 100);
      s.value[J - 1] > 0 ? (s.value[J - 1] = 0, O.isPyQtWebEngine && (y("controlSprinkler", { target: "manual_control_sprayer", index: J, state: 0 }), y("controlSprinkler", { target: "tankWork", state: 0 }))) : P !== -1 ? (s.value[P] = 0, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: P + 1, state: 0 }), s.value[J - 1] = 100, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: J, state: 1 })) : (S.value = J, await A(1, "toggleManualSprinkler"), y("controlSprinkler", { target: "tankWork", state: 1 }), s.value[J - 1] = 100, O.isPyQtWebEngine && y("controlSprinkler", { target: "manual_control_sprayer", index: J, state: 1 }));
    }
    return (J, P) => (_e(), Se("div", Bn, [
      P[16] || (P[16] = j("h2", null, "集成控制系统", -1)),
      P[17] || (P[17] = j("div", { class: "label-box" }, [
        j("label", null, "支持自动/手动两种模式，自动模式下蒸汽机启停受温度上下限控制，"),
        j("br"),
        j("label", null, "喷淋/喷雾系统沿喷淋->喷雾->喷淋循环运行，喷淋/喷雾时间由设置决定，其中在喷雾时间内雾化机启停受湿度上下限控制；"),
        j("br"),
        j("label", null, "手动模式下可手动控制蒸汽机/喷淋头/雾化机的启停，注意喷淋头和雾化机同时只能工作一个")
      ], -1)),
      j("div", $n, [
        j("button", {
          onClick: P[0] || (P[0] = (re) => L("auto")),
          class: ct([{ active: b.value }, "mode-btn"])
        }, "自动模式", 2),
        j("button", {
          onClick: P[1] || (P[1] = (re) => L("manual")),
          class: ct([{ active: !b.value }, "mode-btn"])
        }, "手动模式", 2),
        j("button", {
          onClick: Fe,
          disabled: p.value || !b.value,
          class: "control-btn"
        }, "开始", 8, Rn),
        j("button", {
          onClick: Qe,
          disabled: !p.value || !b.value,
          class: "control-btn"
        }, "停止", 8, Un)
      ]),
      j("div", Mn, [
        j("div", Dn, [
          P[7] || (P[7] = j("h3", null, "蒸汽机", -1)),
          j("div", Fn, [
            j("div", {
              class: ct(["status", { on: ee.value }])
            }, [
              P[6] || (P[6] = j("div", { class: "status-indicator" }, null, -1)),
              dt(" " + Te(ee.value ? "开" : "关"), 1)
            ], 2),
            j("button", {
              onClick: xe,
              disabled: b.value,
              class: "control-btn"
            }, Te(ee.value ? "关闭" : "开启"), 9, Vn)
          ])
        ]),
        j("div", Wn, [
          P[11] || (P[11] = j("h3", null, "喷淋/喷雾系统", -1)),
          j("div", qn, [
            j("div", zn, [
              j("div", Kn, [
                P[8] || (P[8] = j("h4", null, "喷淋头", -1)),
                j("div", Qn, [
                  (_e(), Se(ot, null, it(12, (re) => j("div", {
                    key: re,
                    class: ct(["sprinkler", { active: b.value ? a.value === re : s.value[re - 1] > 0 }]),
                    onClick: (ke) => !g.value && !b.value && !Z.value && ce(re)
                  }, [
                    j("div", {
                      class: "water",
                      style: Ot({ height: ge(re) + "%" })
                    }, null, 4),
                    j("span", null, Te(re), 1)
                  ], 10, Hn)), 64))
                ])
              ]),
              j("div", Gn, [
                P[10] || (P[10] = j("h4", null, "雾化机", -1)),
                j("div", {
                  class: ct(["status", { on: Z.value }])
                }, [
                  P[9] || (P[9] = j("div", { class: "status-indicator" }, null, -1)),
                  dt(" " + Te(Z.value ? "开" : "关"), 1)
                ], 2),
                j("button", {
                  onClick: U,
                  disabled: b.value || g.value,
                  class: "control-btn"
                }, Te(Z.value ? "关闭" : "开启"), 9, Jn)
              ])
            ])
          ]),
          j("div", Yn, Te(V.value), 1)
        ]),
        j("div", Xn, [
          P[15] || (P[15] = j("h3", null, "喷淋/喷雾系统时间设置", -1)),
          j("div", Zn, [
            j("div", er, [
              P[12] || (P[12] = j("label", null, "单个喷淋头工作时间 (秒):", -1)),
              j("input", {
                type: "text",
                value: t.value,
                onFocus: P[2] || (P[2] = (re) => ve("singleRunTime")),
                readonly: ""
              }, null, 40, tr)
            ]),
            j("div", nr, [
              P[13] || (P[13] = j("label", null, "喷淋头-喷淋头运行间隔时间 (秒):", -1)),
              j("input", {
                type: "text",
                value: i.value,
                disabled: "",
                onFocus: P[3] || (P[3] = (re) => ve("runIntervalTime")),
                readonly: ""
              }, null, 40, rr)
            ]),
            j("div", or, [
              P[14] || (P[14] = j("label", null, "喷雾时间 (秒):", -1)),
              j("input", {
                type: "text",
                value: c.value,
                onFocus: P[4] || (P[4] = (re) => ve("loopInterval")),
                readonly: ""
              }, null, 40, ir)
            ])
          ])
        ])
      ]),
      Ge(Tt, {
        modelValue: m.value,
        showKeyboard: v.value,
        "onUpdate:modelValue": Ne,
        "onUpdate:showKeyboard": P[5] || (P[5] = (re) => v.value = re)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, ur = /* @__PURE__ */ st(ar, [["__scopeId", "data-v-4e18b647"]]), sr = { class: "data-actions" }, cr = {
  key: 0,
  class: "modal-overlay"
}, lr = { class: "modal-content settings-modal" }, dr = { class: "setting-group" }, fr = { class: "setting-item" }, pr = { class: "setting-controls" }, vr = { class: "value-display" }, hr = { class: "setting-item" }, mr = { class: "setting-controls" }, gr = { class: "value-display" }, yr = {
  key: 1,
  class: "modal-overlay"
}, br = {
  key: 2,
  class: "modal-overlay"
}, wr = { class: "modal-content" }, xr = {
  __name: "DataExport",
  setup(be) {
    const { sendToPyQt: Z } = Je(), ee = mt({
      isPyQtWebEngine: !1
    }), u = G(!1), d = G(!1), e = G(""), n = G(!1), r = G(0), o = G(0), t = G(0), i = G(0), c = () => {
      t.value = r.value, i.value = o.value, n.value = !0, document.body.style.overflow = "hidden";
    }, a = () => {
      i.value = o.value, t.value = r.value, n.value = !1, document.body.style.overflow = "auto";
    }, l = () => {
      r.value = t.value, o.value = i.value, n.value = !1, document.body.style.overflow = "auto", Z("saveAdjustSettings", { temp_adjust: r.value, humidity_adjust: o.value });
    }, s = (g, w) => {
      g === "tempAdjust" ? t.value = t.value + w : g === "humidityAdjust" && (i.value = i.value + w);
    };
    ft(() => {
      if (ee.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, ee.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = Je();
        rt(g, (w) => {
          if (w && w.type === "update_adjust_settings")
            try {
              const C = JSON.parse(w.content);
              r.value = C.temp_adjust, o.value = C.humidity_adjust;
            } catch (C) {
              console.error("Failed to parse adjust settings:", C);
            }
          else if (w && w.type === "DataExport_init") {
            const C = {
              tempAdjust: r.value,
              humidityAdjust: o.value
            };
            console.log("Sending initial DataExport state:", C), Z("DataExport_init_response", C);
          } else if (w && w.type === "DataExport_set") {
            const C = JSON.parse(w.content);
            C.method === "saveAdjustSettings" && (t.value = C.args.tempAdjust, i.value = C.args.humidityAdjust, l());
          } else w && w.type === "clearData" && (Z("exportData", !1), Z("clearData_response", ""));
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const f = () => {
      ee.isPyQtWebEngine && (console.log("导出数据"), Z("exportData", !0));
    }, b = () => {
      u.value = !0, document.body.style.overflow = "hidden";
    }, p = () => {
      u.value = !1, document.body.style.overflow = "auto";
    }, v = () => {
      console.log("清空数据"), u.value = !1, h("所有数据已清空！"), document.body.style.overflow = "auto", ee.isPyQtWebEngine && Z("exportData", !1);
    }, h = (g) => {
      e.value = g, d.value = !0;
    }, m = () => {
      d.value = !1;
    };
    return (g, w) => (_e(), Se("div", sr, [
      j("div", { class: "action-buttons" }, [
        j("div", { class: "button-group" }, [
          j("button", {
            onClick: f,
            class: "export-btn"
          }, "导出数据")
        ]),
        j("div", { class: "button-group" }, [
          j("button", {
            onClick: b,
            class: "clear-btn"
          }, "清空数据")
        ]),
        j("div", { class: "button-group" }, [
          j("button", {
            onClick: c,
            class: "settings-btn"
          }, "传感器设置")
        ])
      ]),
      n.value ? (_e(), Se("div", cr, [
        j("div", lr, [
          j("div", dr, [
            w[6] || (w[6] = j("h2", null, "传感器数据设置（设为正/负数使数据整体上/下调）", -1)),
            j("div", fr, [
              w[4] || (w[4] = j("span", { class: "setting-label" }, "温度数据设置：", -1)),
              j("div", pr, [
                j("button", {
                  onClick: w[0] || (w[0] = (C) => s("tempAdjust", -1))
                }, "-"),
                j("span", vr, Te(t.value), 1),
                j("button", {
                  onClick: w[1] || (w[1] = (C) => s("tempAdjust", 1))
                }, "+")
              ])
            ]),
            j("div", hr, [
              w[5] || (w[5] = j("span", { class: "setting-label" }, "湿度数据设置：", -1)),
              j("div", mr, [
                j("button", {
                  onClick: w[2] || (w[2] = (C) => s("humidityAdjust", -1))
                }, "-"),
                j("span", gr, Te(i.value), 1),
                j("button", {
                  onClick: w[3] || (w[3] = (C) => s("humidityAdjust", 1))
                }, "+")
              ])
            ])
          ]),
          j("div", { class: "modal-buttons" }, [
            j("button", {
              onClick: l,
              class: "confirm-btn"
            }, "保存"),
            j("button", {
              onClick: a,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ut("", !0),
      u.value ? (_e(), Se("div", yr, [
        j("div", { class: "modal-content" }, [
          w[7] || (w[7] = j("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          j("div", { class: "modal-buttons" }, [
            j("button", {
              onClick: v,
              class: "confirm-btn"
            }, "确定"),
            j("button", {
              onClick: p,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ut("", !0),
      d.value ? (_e(), Se("div", br, [
        j("div", wr, [
          j("h2", null, Te(e.value), 1),
          j("div", { class: "modal-buttons" }, [
            j("button", {
              onClick: m,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ut("", !0)
    ]));
  }
}, kr = /* @__PURE__ */ st(xr, [["__scopeId", "data-v-d0a112d7"]]);
var _r = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Sr(be) {
  return be && be.__esModule && Object.prototype.hasOwnProperty.call(be, "default") ? be.default : be;
}
var At = { exports: {} };
(function(be, Z) {
  (function(ee, u) {
    be.exports = u(Nt);
  })(typeof self < "u" ? self : _r, function(ee) {
    return function(u) {
      var d = {};
      function e(n) {
        if (d[n]) return d[n].exports;
        var r = d[n] = { i: n, l: !1, exports: {} };
        return u[n].call(r.exports, r, r.exports, e), r.l = !0, r.exports;
      }
      return e.m = u, e.c = d, e.d = function(n, r, o) {
        e.o(n, r) || Object.defineProperty(n, r, { enumerable: !0, get: o });
      }, e.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, e.t = function(n, r) {
        if (1 & r && (n = e(n)), 8 & r || 4 & r && typeof n == "object" && n && n.__esModule) return n;
        var o = /* @__PURE__ */ Object.create(null);
        if (e.r(o), Object.defineProperty(o, "default", { enumerable: !0, value: n }), 2 & r && typeof n != "string") for (var t in n) e.d(o, t, (function(i) {
          return n[i];
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
    }({ "00ee": function(u, d, e) {
      var n = e("b622"), r = n("toStringTag"), o = {};
      o[r] = "z", u.exports = String(o) === "[object z]";
    }, "0366": function(u, d, e) {
      var n = e("1c0b");
      u.exports = function(r, o, t) {
        if (n(r), o === void 0) return r;
        switch (t) {
          case 0:
            return function() {
              return r.call(o);
            };
          case 1:
            return function(i) {
              return r.call(o, i);
            };
          case 2:
            return function(i, c) {
              return r.call(o, i, c);
            };
          case 3:
            return function(i, c, a) {
              return r.call(o, i, c, a);
            };
        }
        return function() {
          return r.apply(o, arguments);
        };
      };
    }, "057f": function(u, d, e) {
      var n = e("fc6a"), r = e("241c").f, o = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], i = function(c) {
        try {
          return r(c);
        } catch {
          return t.slice();
        }
      };
      u.exports.f = function(c) {
        return t && o.call(c) == "[object Window]" ? i(c) : r(n(c));
      };
    }, "06cf": function(u, d, e) {
      var n = e("83ab"), r = e("d1e7"), o = e("5c6c"), t = e("fc6a"), i = e("c04e"), c = e("5135"), a = e("0cfb"), l = Object.getOwnPropertyDescriptor;
      d.f = n ? l : function(s, f) {
        if (s = t(s), f = i(f, !0), a) try {
          return l(s, f);
        } catch {
        }
        if (c(s, f)) return o(!r.f.call(s, f), s[f]);
      };
    }, "0a06": function(u, d, e) {
      var n = e("c532"), r = e("30b5"), o = e("f6b4"), t = e("5270"), i = e("4a7b");
      function c(a) {
        this.defaults = a, this.interceptors = { request: new o(), response: new o() };
      }
      c.prototype.request = function(a) {
        typeof a == "string" ? (a = arguments[1] || {}, a.url = arguments[0]) : a = a || {}, a = i(this.defaults, a), a.method ? a.method = a.method.toLowerCase() : this.defaults.method ? a.method = this.defaults.method.toLowerCase() : a.method = "get";
        var l = [t, void 0], s = Promise.resolve(a);
        for (this.interceptors.request.forEach(function(f) {
          l.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          l.push(f.fulfilled, f.rejected);
        }); l.length; ) s = s.then(l.shift(), l.shift());
        return s;
      }, c.prototype.getUri = function(a) {
        return a = i(this.defaults, a), r(a.url, a.params, a.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(a) {
        c.prototype[a] = function(l, s) {
          return this.request(i(s || {}, { method: a, url: l, data: (s || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(a) {
        c.prototype[a] = function(l, s, f) {
          return this.request(i(f || {}, { method: a, url: l, data: s }));
        };
      }), u.exports = c;
    }, "0cb2": function(u, d, e) {
      var n = e("7b0b"), r = Math.floor, o = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, i = /\$([$&'`]|\d{1,2})/g;
      u.exports = function(c, a, l, s, f, b) {
        var p = l + c.length, v = s.length, h = i;
        return f !== void 0 && (f = n(f), h = t), o.call(b, h, function(m, g) {
          var w;
          switch (g.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return a.slice(0, l);
            case "'":
              return a.slice(p);
            case "<":
              w = f[g.slice(1, -1)];
              break;
            default:
              var C = +g;
              if (C === 0) return m;
              if (C > v) {
                var k = r(C / 10);
                return k === 0 ? m : k <= v ? s[k - 1] === void 0 ? g.charAt(1) : s[k - 1] + g.charAt(1) : m;
              }
              w = s[C - 1];
          }
          return w === void 0 ? "" : w;
        });
      };
    }, "0cfb": function(u, d, e) {
      var n = e("83ab"), r = e("d039"), o = e("cc12");
      u.exports = !n && !r(function() {
        return Object.defineProperty(o("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(u, d, e) {
      u.exports = function(n) {
        return function(r) {
          return n.apply(null, r);
        };
      };
    }, 1148: function(u, d, e) {
      var n = e("a691"), r = e("1d80");
      u.exports = "".repeat || function(o) {
        var t = String(r(this)), i = "", c = n(o);
        if (c < 0 || c == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; c > 0; (c >>>= 1) && (t += t)) 1 & c && (i += t);
        return i;
      };
    }, 1276: function(u, d, e) {
      var n = e("d784"), r = e("44e7"), o = e("825a"), t = e("1d80"), i = e("4840"), c = e("8aa5"), a = e("50c4"), l = e("14c3"), s = e("9263"), f = e("d039"), b = [].push, p = Math.min, v = 4294967295, h = !f(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(m, g, w) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(k, S) {
          var y = String(t(this)), E = S === void 0 ? v : S >>> 0;
          if (E === 0) return [];
          if (k === void 0) return [y];
          if (!r(k)) return g.call(y, k, E);
          for (var O, T, _, D = [], F = (k.ignoreCase ? "i" : "") + (k.multiline ? "m" : "") + (k.unicode ? "u" : "") + (k.sticky ? "y" : ""), Y = 0, ae = new RegExp(k.source, F + "g"); (O = s.call(ae, y)) && (T = ae.lastIndex, !(T > Y && (D.push(y.slice(Y, O.index)), O.length > 1 && O.index < y.length && b.apply(D, O.slice(1)), _ = O[0].length, Y = T, D.length >= E))); )
            ae.lastIndex === O.index && ae.lastIndex++;
          return Y === y.length ? !_ && ae.test("") || D.push("") : D.push(y.slice(Y)), D.length > E ? D.slice(0, E) : D;
        } : "0".split(void 0, 0).length ? function(k, S) {
          return k === void 0 && S === 0 ? [] : g.call(this, k, S);
        } : g, [function(k, S) {
          var y = t(this), E = k == null ? void 0 : k[m];
          return E !== void 0 ? E.call(k, y, S) : C.call(String(y), k, S);
        }, function(k, S) {
          var y = w(C, k, this, S, C !== g);
          if (y.done) return y.value;
          var E = o(k), O = String(this), T = i(E, RegExp), _ = E.unicode, D = (E.ignoreCase ? "i" : "") + (E.multiline ? "m" : "") + (E.unicode ? "u" : "") + (h ? "y" : "g"), F = new T(h ? E : "^(?:" + E.source + ")", D), Y = S === void 0 ? v : S >>> 0;
          if (Y === 0) return [];
          if (O.length === 0) return l(F, O) === null ? [O] : [];
          for (var ae = 0, H = 0, W = []; H < O.length; ) {
            F.lastIndex = h ? H : 0;
            var V, A = l(F, h ? O : O.slice(H));
            if (A === null || (V = p(a(F.lastIndex + (h ? 0 : H)), O.length)) === ae) H = c(O, H, _);
            else {
              if (W.push(O.slice(ae, H)), W.length === Y) return W;
              for (var L = 1; L <= A.length - 1; L++) if (W.push(A[L]), W.length === Y) return W;
              H = ae = V;
            }
          }
          return W.push(O.slice(ae)), W;
        }];
      }, !h);
    }, "13d5": function(u, d, e) {
      var n = e("23e7"), r = e("d58f").left, o = e("a640"), t = e("2d00"), i = e("605d"), c = o("reduce"), a = !i && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !c || a }, { reduce: function(l) {
        return r(this, l, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(u, d, e) {
      var n = e("c6b6"), r = e("9263");
      u.exports = function(o, t) {
        var i = o.exec;
        if (typeof i == "function") {
          var c = i.call(o, t);
          if (typeof c != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return c;
        }
        if (n(o) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return r.call(o, t);
      };
    }, "159b": function(u, d, e) {
      var n = e("da84"), r = e("fdbc"), o = e("17c2"), t = e("9112");
      for (var i in r) {
        var c = n[i], a = c && c.prototype;
        if (a && a.forEach !== o) try {
          t(a, "forEach", o);
        } catch {
          a.forEach = o;
        }
      }
    }, "17c2": function(u, d, e) {
      var n = e("b727").forEach, r = e("a640"), o = r("forEach");
      u.exports = o ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(u, d) {
      u.exports = function(e, n, r) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
        return e;
      };
    }, "1be4": function(u, d, e) {
      var n = e("d066");
      u.exports = n("document", "documentElement");
    }, "1c0b": function(u, d) {
      u.exports = function(e) {
        if (typeof e != "function") throw TypeError(String(e) + " is not a function");
        return e;
      };
    }, "1c7e": function(u, d, e) {
      var n = e("b622"), r = n("iterator"), o = !1;
      try {
        var t = 0, i = { next: function() {
          return { done: !!t++ };
        }, return: function() {
          o = !0;
        } };
        i[r] = function() {
          return this;
        }, Array.from(i, function() {
          throw 2;
        });
      } catch {
      }
      u.exports = function(c, a) {
        if (!a && !o) return !1;
        var l = !1;
        try {
          var s = {};
          s[r] = function() {
            return { next: function() {
              return { done: l = !0 };
            } };
          }, c(s);
        } catch {
        }
        return l;
      };
    }, "1cdc": function(u, d, e) {
      var n = e("342f");
      u.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(u, d, e) {
      u.exports = function(n, r) {
        return function() {
          for (var o = new Array(arguments.length), t = 0; t < o.length; t++) o[t] = arguments[t];
          return n.apply(r, o);
        };
      };
    }, "1d80": function(u, d) {
      u.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(u, d, e) {
      var n = e("d039"), r = e("b622"), o = e("2d00"), t = r("species");
      u.exports = function(i) {
        return o >= 51 || !n(function() {
          var c = [], a = c.constructor = {};
          return a[t] = function() {
            return { foo: 1 };
          }, c[i](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(u, d, e) {
      (function(n) {
        (function(r, o) {
          u.exports = o();
        })(0, function() {
          function r(B, $) {
            return $ = { exports: {} }, B($, $.exports), $.exports;
          }
          var o = r(function(B, $) {
            (function(X, M) {
              B.exports = M();
            })(0, function() {
              function X(ce) {
                var J = ce && typeof ce == "object";
                return J && Object.prototype.toString.call(ce) !== "[object RegExp]" && Object.prototype.toString.call(ce) !== "[object Date]";
              }
              function M(ce) {
                return Array.isArray(ce) ? [] : {};
              }
              function te(ce, J) {
                var P = J && J.clone === !0;
                return P && X(ce) ? ge(M(ce), ce, J) : ce;
              }
              function ie(ce, J, P) {
                var re = ce.slice();
                return J.forEach(function(ke, We) {
                  typeof re[We] > "u" ? re[We] = te(ke, P) : X(ke) ? re[We] = ge(ce[We], ke, P) : ce.indexOf(ke) === -1 && re.push(te(ke, P));
                }), re;
              }
              function we(ce, J, P) {
                var re = {};
                return X(ce) && Object.keys(ce).forEach(function(ke) {
                  re[ke] = te(ce[ke], P);
                }), Object.keys(J).forEach(function(ke) {
                  X(J[ke]) && ce[ke] ? re[ke] = ge(ce[ke], J[ke], P) : re[ke] = te(J[ke], P);
                }), re;
              }
              function ge(ce, J, P) {
                var re = Array.isArray(J), ke = P || { arrayMerge: ie }, We = ke.arrayMerge || ie;
                return re ? Array.isArray(ce) ? We(ce, J, P) : te(J, P) : we(ce, J, P);
              }
              return ge.all = function(ce, J) {
                if (!Array.isArray(ce) || ce.length < 2) throw new Error("first argument should be an array with at least two elements");
                return ce.reduce(function(P, re) {
                  return ge(P, re, J);
                });
              }, ge;
            });
          });
          function t(B) {
            return B = B || /* @__PURE__ */ Object.create(null), { on: function($, X) {
              (B[$] || (B[$] = [])).push(X);
            }, off: function($, X) {
              B[$] && B[$].splice(B[$].indexOf(X) >>> 0, 1);
            }, emit: function($, X) {
              (B[$] || []).map(function(M) {
                M(X);
              }), (B["*"] || []).map(function(M) {
                M($, X);
              });
            } };
          }
          var i = r(function(B, $) {
            var X = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            $.default = X, B.exports = $.default;
          }), c = function(B) {
            return Object.keys(B).map(function($) {
              var X = B[$].toString().replace(/"/g, "&quot;");
              return $ + '="' + X + '"';
            }).join(" ");
          }, a = i.svg, l = i.xlink, s = {};
          s[a.name] = a.uri, s[l.name] = l.uri;
          var f, b = function(B, $) {
            B === void 0 && (B = "");
            var X = o(s, $ || {}), M = c(X);
            return "<svg " + M + ">" + B + "</svg>";
          }, p = i.svg, v = i.xlink, h = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[v.name] = v.uri, f) }, m = function(B) {
            this.config = o(h, B || {}), this.symbols = [];
          };
          m.prototype.add = function(B) {
            var $ = this, X = $.symbols, M = this.find(B.id);
            return M ? (X[X.indexOf(M)] = B, !1) : (X.push(B), !0);
          }, m.prototype.remove = function(B) {
            var $ = this, X = $.symbols, M = this.find(B);
            return !!M && (X.splice(X.indexOf(M), 1), M.destroy(), !0);
          }, m.prototype.find = function(B) {
            return this.symbols.filter(function($) {
              return $.id === B;
            })[0] || null;
          }, m.prototype.has = function(B) {
            return this.find(B) !== null;
          }, m.prototype.stringify = function() {
            var B = this.config, $ = B.attrs, X = this.symbols.map(function(M) {
              return M.stringify();
            }).join("");
            return b(X, $);
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            this.symbols.forEach(function(B) {
              return B.destroy();
            });
          };
          var g = function(B) {
            var $ = B.id, X = B.viewBox, M = B.content;
            this.id = $, this.viewBox = X, this.content = M;
          };
          g.prototype.stringify = function() {
            return this.content;
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            var B = this;
            ["id", "viewBox", "content"].forEach(function($) {
              return delete B[$];
            });
          };
          var w = function(B) {
            var $ = !!document.importNode, X = new DOMParser().parseFromString(B, "image/svg+xml").documentElement;
            return $ ? document.importNode(X, !0) : X;
          }, C = function(B) {
            function $() {
              B.apply(this, arguments);
            }
            B && ($.__proto__ = B), $.prototype = Object.create(B && B.prototype), $.prototype.constructor = $;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, $.createFromExistingNode = function(M) {
              return new $({ id: M.getAttribute("id"), viewBox: M.getAttribute("viewBox"), content: M.outerHTML });
            }, $.prototype.destroy = function() {
              this.isMounted && this.unmount(), B.prototype.destroy.call(this);
            }, $.prototype.mount = function(M) {
              if (this.isMounted) return this.node;
              var te = typeof M == "string" ? document.querySelector(M) : M, ie = this.render();
              return this.node = ie, te.appendChild(ie), ie;
            }, $.prototype.render = function() {
              var M = this.stringify();
              return w(b(M)).childNodes[0];
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties($.prototype, X), $;
          }(g), k = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, S = function(B) {
            return Array.prototype.slice.call(B, 0);
          }, y = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, E = function(B, $) {
            var X = document.createEvent("CustomEvent");
            X.initCustomEvent(B, !1, !1, $), window.dispatchEvent(X);
          }, O = function(B) {
            var $ = [];
            return S(B.querySelectorAll("style")).forEach(function(X) {
              X.textContent += "", $.push(X);
            }), $;
          }, T = function(B) {
            return (B || window.location.href).split("#")[0];
          }, _ = function(B) {
            angular.module("ng").run(["$rootScope", function($) {
              $.$on("$locationChangeSuccess", function(X, M, te) {
                E(B, { oldUrl: te, newUrl: M });
              });
            }]);
          }, D = "linearGradient, radialGradient, pattern, mask, clipPath", F = function(B, $) {
            return $ === void 0 && ($ = D), S(B.querySelectorAll("symbol")).forEach(function(X) {
              S(X.querySelectorAll($)).forEach(function(M) {
                X.parentNode.insertBefore(M, X);
              });
            }), B;
          };
          function Y(B, $) {
            var X = S(B).reduce(function(M, te) {
              if (!te.attributes) return M;
              var ie = S(te.attributes), we = $ ? ie.filter($) : ie;
              return M.concat(we);
            }, []);
            return X;
          }
          var ae = i.xlink.uri, H = "xlink:href", W = /[{}|\\\^\[\]`"<>]/g;
          function V(B) {
            return B.replace(W, function($) {
              return "%" + $[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function A(B) {
            return B.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function L(B, $, X) {
            return S(B).forEach(function(M) {
              var te = M.getAttribute(H);
              if (te && te.indexOf($) === 0) {
                var ie = te.replace($, X);
                M.setAttributeNS(ae, H, ie);
              }
            }), B;
          }
          var Q, ne = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], U = ne.map(function(B) {
            return "[" + B + "]";
          }).join(","), xe = function(B, $, X, M) {
            var te = V(X), ie = V(M), we = B.querySelectorAll(U), ge = Y(we, function(ce) {
              var J = ce.localName, P = ce.value;
              return ne.indexOf(J) !== -1 && P.indexOf("url(" + te) !== -1;
            });
            ge.forEach(function(ce) {
              return ce.value = ce.value.replace(new RegExp(A(te), "g"), ie);
            }), L($, te, ie);
          }, ve = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Ne = function(B) {
            function $(M) {
              var te = this;
              M === void 0 && (M = {}), B.call(this, o(k, M));
              var ie = t();
              this._emitter = ie, this.node = null;
              var we = this, ge = we.config;
              if (ge.autoConfigure && this._autoConfigure(M), ge.syncUrlsWithBaseTag) {
                var ce = document.getElementsByTagName("base")[0].getAttribute("href");
                ie.on(ve.MOUNT, function() {
                  return te.updateUrls("#", ce);
                });
              }
              var J = this._handleLocationChange.bind(this);
              this._handleLocationChange = J, ge.listenLocationChangeEvent && window.addEventListener(ge.locationChangeEvent, J), ge.locationChangeAngularEmitter && _(ge.locationChangeEvent), ie.on(ve.MOUNT, function(P) {
                ge.moveGradientsOutsideSymbol && F(P);
              }), ie.on(ve.SYMBOL_MOUNT, function(P) {
                ge.moveGradientsOutsideSymbol && F(P.parentNode), (y.isIE() || y.isEdge()) && O(P);
              });
            }
            B && ($.__proto__ = B), $.prototype = Object.create(B && B.prototype), $.prototype.constructor = $;
            var X = { isMounted: {} };
            return X.isMounted.get = function() {
              return !!this.node;
            }, $.prototype._autoConfigure = function(M) {
              var te = this, ie = te.config;
              typeof M.syncUrlsWithBaseTag > "u" && (ie.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof M.locationChangeAngularEmitter > "u" && (ie.locationChangeAngularEmitter = typeof window.angular < "u"), typeof M.moveGradientsOutsideSymbol > "u" && (ie.moveGradientsOutsideSymbol = y.isFirefox());
            }, $.prototype._handleLocationChange = function(M) {
              var te = M.detail, ie = te.oldUrl, we = te.newUrl;
              this.updateUrls(ie, we);
            }, $.prototype.add = function(M) {
              var te = this, ie = B.prototype.add.call(this, M);
              return this.isMounted && ie && (M.mount(te.node), this._emitter.emit(ve.SYMBOL_MOUNT, M.node)), ie;
            }, $.prototype.attach = function(M) {
              var te = this, ie = this;
              if (ie.isMounted) return ie.node;
              var we = typeof M == "string" ? document.querySelector(M) : M;
              return ie.node = we, this.symbols.forEach(function(ge) {
                ge.mount(ie.node), te._emitter.emit(ve.SYMBOL_MOUNT, ge.node);
              }), S(we.querySelectorAll("symbol")).forEach(function(ge) {
                var ce = C.createFromExistingNode(ge);
                ce.node = ge, ie.add(ce);
              }), this._emitter.emit(ve.MOUNT, we), we;
            }, $.prototype.destroy = function() {
              var M = this, te = M.config, ie = M.symbols, we = M._emitter;
              ie.forEach(function(ge) {
                return ge.destroy();
              }), we.off("*"), window.removeEventListener(te.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, $.prototype.mount = function(M, te) {
              M === void 0 && (M = this.config.mountTo), te === void 0 && (te = !1);
              var ie = this;
              if (ie.isMounted) return ie.node;
              var we = typeof M == "string" ? document.querySelector(M) : M, ge = ie.render();
              return this.node = ge, te && we.childNodes[0] ? we.insertBefore(ge, we.childNodes[0]) : we.appendChild(ge), this._emitter.emit(ve.MOUNT, ge), ge;
            }, $.prototype.render = function() {
              return w(this.stringify());
            }, $.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, $.prototype.updateUrls = function(M, te) {
              if (!this.isMounted) return !1;
              var ie = document.querySelectorAll(this.config.usagesToUpdate);
              return xe(this.node, ie, T(M) + "#", T(te) + "#"), !0;
            }, Object.defineProperties($.prototype, X), $;
          }(m), Be = r(function(B) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function($, X) {
              B.exports = X();
            })(0, function() {
              var $, X = [], M = document, te = M.documentElement.doScroll, ie = "DOMContentLoaded", we = (te ? /^loaded|^c/ : /^loaded|^i|^c/).test(M.readyState);
              return we || M.addEventListener(ie, $ = function() {
                for (M.removeEventListener(ie, $), we = 1; $ = X.shift(); ) $();
              }), function(ge) {
                we ? setTimeout(ge, 0) : X.push(ge);
              };
            });
          }), $e = "__SVG_SPRITE_NODE__", Ae = "__SVG_SPRITE__", Ee = !!window[Ae];
          Ee ? Q = window[Ae] : (Q = new Ne({ attrs: { id: $e, "aria-hidden": "true" } }), window[Ae] = Q);
          var Fe = function() {
            var B = document.getElementById($e);
            B ? Q.attach(B) : Q.mount(document.body, !0);
          };
          document.body ? Fe() : Be(Fe);
          var Qe = Q;
          return Qe;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(u, d, e) {
      var n = e("825a"), r = e("e95a"), o = e("50c4"), t = e("0366"), i = e("35a1"), c = e("2a62"), a = function(l, s) {
        this.stopped = l, this.result = s;
      };
      u.exports = function(l, s, f) {
        var b, p, v, h, m, g, w, C = f && f.that, k = !(!f || !f.AS_ENTRIES), S = !(!f || !f.IS_ITERATOR), y = !(!f || !f.INTERRUPTED), E = t(s, C, 1 + k + y), O = function(_) {
          return b && c(b), new a(!0, _);
        }, T = function(_) {
          return k ? (n(_), y ? E(_[0], _[1], O) : E(_[0], _[1])) : y ? E(_, O) : E(_);
        };
        if (S) b = l;
        else {
          if (p = i(l), typeof p != "function") throw TypeError("Target is not iterable");
          if (r(p)) {
            for (v = 0, h = o(l.length); h > v; v++) if (m = T(l[v]), m && m instanceof a) return m;
            return new a(!1);
          }
          b = p.call(l);
        }
        for (g = b.next; !(w = g.call(b)).done; ) {
          try {
            m = T(w.value);
          } catch (_) {
            throw c(b), _;
          }
          if (typeof m == "object" && m && m instanceof a) return m;
        }
        return new a(!1);
      };
    }, "23cb": function(u, d, e) {
      var n = e("a691"), r = Math.max, o = Math.min;
      u.exports = function(t, i) {
        var c = n(t);
        return c < 0 ? r(c + i, 0) : o(c, i);
      };
    }, "23e7": function(u, d, e) {
      var n = e("da84"), r = e("06cf").f, o = e("9112"), t = e("6eeb"), i = e("ce4e"), c = e("e893"), a = e("94ca");
      u.exports = function(l, s) {
        var f, b, p, v, h, m, g = l.target, w = l.global, C = l.stat;
        if (b = w ? n : C ? n[g] || i(g, {}) : (n[g] || {}).prototype, b) for (p in s) {
          if (h = s[p], l.noTargetGet ? (m = r(b, p), v = m && m.value) : v = b[p], f = a(w ? p : g + (C ? "." : "#") + p, l.forced), !f && v !== void 0) {
            if (typeof h == typeof v) continue;
            c(h, v);
          }
          (l.sham || v && v.sham) && o(h, "sham", !0), t(b, p, h, l);
        }
      };
    }, "241c": function(u, d, e) {
      var n = e("ca84"), r = e("7839"), o = r.concat("length", "prototype");
      d.f = Object.getOwnPropertyNames || function(t) {
        return n(t, o);
      };
    }, 2444: function(u, d, e) {
      (function(n) {
        var r = e("c532"), o = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function i(l, s) {
          !r.isUndefined(l) && r.isUndefined(l["Content-Type"]) && (l["Content-Type"] = s);
        }
        function c() {
          var l;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (l = e("b50d")), l;
        }
        var a = { adapter: c(), transformRequest: [function(l, s) {
          return o(s, "Accept"), o(s, "Content-Type"), r.isFormData(l) || r.isArrayBuffer(l) || r.isBuffer(l) || r.isStream(l) || r.isFile(l) || r.isBlob(l) ? l : r.isArrayBufferView(l) ? l.buffer : r.isURLSearchParams(l) ? (i(s, "application/x-www-form-urlencoded;charset=utf-8"), l.toString()) : r.isObject(l) ? (i(s, "application/json;charset=utf-8"), JSON.stringify(l)) : l;
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
          a.headers[l] = {};
        }), r.forEach(["post", "put", "patch"], function(l) {
          a.headers[l] = r.merge(t);
        }), u.exports = a;
      }).call(this, e("4362"));
    }, 2532: function(u, d, e) {
      var n = e("23e7"), r = e("5a34"), o = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(i) {
        return !!~String(o(this)).indexOf(r(i), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(u, d, e) {
      var n = e("6eeb"), r = e("825a"), o = e("d039"), t = e("ad6d"), i = "toString", c = RegExp.prototype, a = c[i], l = o(function() {
        return a.call({ source: "a", flags: "b" }) != "/a/b";
      }), s = a.name != i;
      (l || s) && n(RegExp.prototype, i, function() {
        var f = r(this), b = String(f.source), p = f.flags, v = String(p === void 0 && f instanceof RegExp && !("flags" in c) ? t.call(f) : p);
        return "/" + b + "/" + v;
      }, { unsafe: !0 });
    }, 2626: function(u, d, e) {
      var n = e("d066"), r = e("9bf2"), o = e("b622"), t = e("83ab"), i = o("species");
      u.exports = function(c) {
        var a = n(c), l = r.f;
        t && a && !a[i] && l(a, i, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(u, d, e) {
      var n = e("825a");
      u.exports = function(r) {
        var o = r.return;
        if (o !== void 0) return n(o.call(r)).value;
      };
    }, "2cf4": function(u, d, e) {
      var n, r, o, t = e("da84"), i = e("d039"), c = e("0366"), a = e("1be4"), l = e("cc12"), s = e("1cdc"), f = e("605d"), b = t.location, p = t.setImmediate, v = t.clearImmediate, h = t.process, m = t.MessageChannel, g = t.Dispatch, w = 0, C = {}, k = "onreadystatechange", S = function(T) {
        if (C.hasOwnProperty(T)) {
          var _ = C[T];
          delete C[T], _();
        }
      }, y = function(T) {
        return function() {
          S(T);
        };
      }, E = function(T) {
        S(T.data);
      }, O = function(T) {
        t.postMessage(T + "", b.protocol + "//" + b.host);
      };
      p && v || (p = function(T) {
        for (var _ = [], D = 1; arguments.length > D; ) _.push(arguments[D++]);
        return C[++w] = function() {
          (typeof T == "function" ? T : Function(T)).apply(void 0, _);
        }, n(w), w;
      }, v = function(T) {
        delete C[T];
      }, f ? n = function(T) {
        h.nextTick(y(T));
      } : g && g.now ? n = function(T) {
        g.now(y(T));
      } : m && !s ? (r = new m(), o = r.port2, r.port1.onmessage = E, n = c(o.postMessage, o, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && b && b.protocol !== "file:" && !i(O) ? (n = O, t.addEventListener("message", E, !1)) : n = k in l("script") ? function(T) {
        a.appendChild(l("script"))[k] = function() {
          a.removeChild(this), S(T);
        };
      } : function(T) {
        setTimeout(y(T), 0);
      }), u.exports = { set: p, clear: v };
    }, "2d00": function(u, d, e) {
      var n, r, o = e("da84"), t = e("342f"), i = o.process, c = i && i.versions, a = c && c.v8;
      a ? (n = a.split("."), r = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (r = n[1]))), u.exports = r && +r;
    }, "2d83": function(u, d, e) {
      var n = e("387f");
      u.exports = function(r, o, t, i, c) {
        var a = new Error(r);
        return n(a, o, t, i, c);
      };
    }, "2e67": function(u, d, e) {
      u.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(u, d, e) {
      var n = e("c532");
      function r(o) {
        return encodeURIComponent(o).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      u.exports = function(o, t, i) {
        if (!t) return o;
        var c;
        if (i) c = i(t);
        else if (n.isURLSearchParams(t)) c = t.toString();
        else {
          var a = [];
          n.forEach(t, function(s, f) {
            s !== null && typeof s < "u" && (n.isArray(s) ? f += "[]" : s = [s], n.forEach(s, function(b) {
              n.isDate(b) ? b = b.toISOString() : n.isObject(b) && (b = JSON.stringify(b)), a.push(r(f) + "=" + r(b));
            }));
          }), c = a.join("&");
        }
        if (c) {
          var l = o.indexOf("#");
          l !== -1 && (o = o.slice(0, l)), o += (o.indexOf("?") === -1 ? "?" : "&") + c;
        }
        return o;
      };
    }, "342f": function(u, d, e) {
      var n = e("d066");
      u.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(u, d, e) {
      var n = e("f5df"), r = e("3f8c"), o = e("b622"), t = o("iterator");
      u.exports = function(i) {
        if (i != null) return i[t] || i["@@iterator"] || r[n(i)];
      };
    }, "37e8": function(u, d, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("825a"), t = e("df75");
      u.exports = n ? Object.defineProperties : function(i, c) {
        o(i);
        for (var a, l = t(c), s = l.length, f = 0; s > f; ) r.f(i, a = l[f++], c[a]);
        return i;
      };
    }, "387f": function(u, d, e) {
      u.exports = function(n, r, o, t, i) {
        return n.config = r, o && (n.code = o), n.request = t, n.response = i, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(u, d, e) {
      e("acce");
    }, 3934: function(u, d, e) {
      var n = e("c532");
      u.exports = n.isStandardBrowserEnv() ? function() {
        var r, o = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function i(c) {
          var a = c;
          return o && (t.setAttribute("href", a), a = t.href), t.setAttribute("href", a), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return r = i(window.location.href), function(c) {
          var a = n.isString(c) ? i(c) : c;
          return a.protocol === r.protocol && a.host === r.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(u, d, e) {
      var n = e("861d");
      u.exports = function(r) {
        if (!n(r) && r !== null) throw TypeError("Can't set " + String(r) + " as a prototype");
        return r;
      };
    }, "3ca3": function(u, d, e) {
      var n = e("6547").charAt, r = e("69f3"), o = e("7dd0"), t = "String Iterator", i = r.set, c = r.getterFor(t);
      o(String, "String", function(a) {
        i(this, { type: t, string: String(a), index: 0 });
      }, function() {
        var a, l = c(this), s = l.string, f = l.index;
        return f >= s.length ? { value: void 0, done: !0 } : (a = n(s, f), l.index += a.length, { value: a, done: !1 });
      });
    }, "3f8c": function(u, d) {
      u.exports = {};
    }, "408a": function(u, d, e) {
      var n = e("c6b6");
      u.exports = function(r) {
        if (typeof r != "number" && n(r) != "Number") throw TypeError("Incorrect invocation");
        return +r;
      };
    }, "428f": function(u, d, e) {
      var n = e("da84");
      u.exports = n;
    }, 4362: function(u, d, e) {
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
    }, "44ad": function(u, d, e) {
      var n = e("d039"), r = e("c6b6"), o = "".split;
      u.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return r(t) == "String" ? o.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(u, d, e) {
      var n = e("b622"), r = e("7c73"), o = e("9bf2"), t = n("unscopables"), i = Array.prototype;
      i[t] == null && o.f(i, t, { configurable: !0, value: r(null) }), u.exports = function(c) {
        i[t][c] = !0;
      };
    }, "44de": function(u, d, e) {
      var n = e("da84");
      u.exports = function(r, o) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(r) : t.error(r, o));
      };
    }, "44e7": function(u, d, e) {
      var n = e("861d"), r = e("c6b6"), o = e("b622"), t = o("match");
      u.exports = function(i) {
        var c;
        return n(i) && ((c = i[t]) !== void 0 ? !!c : r(i) == "RegExp");
      };
    }, "466d": function(u, d, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("1d80"), i = e("8aa5"), c = e("14c3");
      n("match", 1, function(a, l, s) {
        return [function(f) {
          var b = t(this), p = f == null ? void 0 : f[a];
          return p !== void 0 ? p.call(f, b) : new RegExp(f)[a](String(b));
        }, function(f) {
          var b = s(l, f, this);
          if (b.done) return b.value;
          var p = r(f), v = String(this);
          if (!p.global) return c(p, v);
          var h = p.unicode;
          p.lastIndex = 0;
          for (var m, g = [], w = 0; (m = c(p, v)) !== null; ) {
            var C = String(m[0]);
            g[w] = C, C === "" && (p.lastIndex = i(v, o(p.lastIndex), h)), w++;
          }
          return w === 0 ? null : g;
        }];
      });
    }, "467f": function(u, d, e) {
      var n = e("2d83");
      u.exports = function(r, o, t) {
        var i = t.config.validateStatus;
        t.status && i && !i(t.status) ? o(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : r(t);
      };
    }, 4840: function(u, d, e) {
      var n = e("825a"), r = e("1c0b"), o = e("b622"), t = o("species");
      u.exports = function(i, c) {
        var a, l = n(i).constructor;
        return l === void 0 || (a = n(l)[t]) == null ? c : r(a);
      };
    }, 4930: function(u, d, e) {
      var n = e("605d"), r = e("2d00"), o = e("d039");
      u.exports = !!Object.getOwnPropertySymbols && !o(function() {
        return !Symbol.sham && (n ? r === 38 : r > 37 && r < 41);
      });
    }, "4a7b": function(u, d, e) {
      var n = e("c532");
      u.exports = function(r, o) {
        o = o || {};
        var t = {}, i = ["url", "method", "data"], c = ["headers", "auth", "proxy", "params"], a = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], l = ["validateStatus"];
        function s(v, h) {
          return n.isPlainObject(v) && n.isPlainObject(h) ? n.merge(v, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function f(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = s(void 0, r[v])) : t[v] = s(r[v], o[v]);
        }
        n.forEach(i, function(v) {
          n.isUndefined(o[v]) || (t[v] = s(void 0, o[v]));
        }), n.forEach(c, f), n.forEach(a, function(v) {
          n.isUndefined(o[v]) ? n.isUndefined(r[v]) || (t[v] = s(void 0, r[v])) : t[v] = s(void 0, o[v]);
        }), n.forEach(l, function(v) {
          v in o ? t[v] = s(r[v], o[v]) : v in r && (t[v] = s(void 0, r[v]));
        });
        var b = i.concat(c).concat(a).concat(l), p = Object.keys(r).concat(Object.keys(o)).filter(function(v) {
          return b.indexOf(v) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(u, d, e) {
      var n = e("83ab"), r = e("da84"), o = e("94ca"), t = e("7156"), i = e("9bf2").f, c = e("241c").f, a = e("44e7"), l = e("ad6d"), s = e("9f7f"), f = e("6eeb"), b = e("d039"), p = e("69f3").set, v = e("2626"), h = e("b622"), m = h("match"), g = r.RegExp, w = g.prototype, C = /a/g, k = /a/g, S = new g(C) !== C, y = s.UNSUPPORTED_Y, E = n && o("RegExp", !S || y || b(function() {
        return k[m] = !1, g(C) != C || g(k) == k || g(C, "i") != "/a/i";
      }));
      if (E) {
        for (var O = function(F, Y) {
          var ae, H = this instanceof O, W = a(F), V = Y === void 0;
          if (!H && W && F.constructor === O && V) return F;
          S ? W && !V && (F = F.source) : F instanceof O && (V && (Y = l.call(F)), F = F.source), y && (ae = !!Y && Y.indexOf("y") > -1, ae && (Y = Y.replace(/y/g, "")));
          var A = t(S ? new g(F, Y) : g(F, Y), H ? this : w, O);
          return y && ae && p(A, { sticky: ae }), A;
        }, T = function(F) {
          F in O || i(O, F, { configurable: !0, get: function() {
            return g[F];
          }, set: function(Y) {
            g[F] = Y;
          } });
        }, _ = c(g), D = 0; _.length > D; ) T(_[D++]);
        w.constructor = O, O.prototype = w, f(r, "RegExp", O);
      }
      v("RegExp");
    }, "4d64": function(u, d, e) {
      var n = e("fc6a"), r = e("50c4"), o = e("23cb"), t = function(i) {
        return function(c, a, l) {
          var s, f = n(c), b = r(f.length), p = o(l, b);
          if (i && a != a) {
            for (; b > p; ) if (s = f[p++], s != s) return !0;
          } else for (; b > p; p++) if ((i || p in f) && f[p] === a) return i || p || 0;
          return !i && -1;
        };
      };
      u.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(u, d, e) {
      var n = e("23e7"), r = e("b727").filter, o = e("1dde"), t = o("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(i) {
        return r(this, i, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(u, d, e) {
      var n = e("0366"), r = e("7b0b"), o = e("9bdd"), t = e("e95a"), i = e("50c4"), c = e("8418"), a = e("35a1");
      u.exports = function(l) {
        var s, f, b, p, v, h, m = r(l), g = typeof this == "function" ? this : Array, w = arguments.length, C = w > 1 ? arguments[1] : void 0, k = C !== void 0, S = a(m), y = 0;
        if (k && (C = n(C, w > 2 ? arguments[2] : void 0, 2)), S == null || g == Array && t(S)) for (s = i(m.length), f = new g(s); s > y; y++) h = k ? C(m[y], y) : m[y], c(f, y, h);
        else for (p = S.call(m), v = p.next, f = new g(); !(b = v.call(p)).done; y++) h = k ? o(p, C, [b.value, y], !0) : b.value, c(f, y, h);
        return f.length = y, f;
      };
    }, "4f43": function(u, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), i = new r.a({ id: "icon-close", use: "icon-close-usage", viewBox: "0 0 50 35.93", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35.93" id="icon-close">\r
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
      t.a.add(i), d.default = i;
    }, "50c4": function(u, d, e) {
      var n = e("a691"), r = Math.min;
      u.exports = function(o) {
        return o > 0 ? r(n(o), 9007199254740991) : 0;
      };
    }, 5135: function(u, d) {
      var e = {}.hasOwnProperty;
      u.exports = function(n, r) {
        return e.call(n, r);
      };
    }, 5270: function(u, d, e) {
      var n = e("c532"), r = e("c401"), o = e("2e67"), t = e("2444");
      function i(c) {
        c.cancelToken && c.cancelToken.throwIfRequested();
      }
      u.exports = function(c) {
        i(c), c.headers = c.headers || {}, c.data = r(c.data, c.headers, c.transformRequest), c.headers = n.merge(c.headers.common || {}, c.headers[c.method] || {}, c.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(l) {
          delete c.headers[l];
        });
        var a = c.adapter || t.adapter;
        return a(c).then(function(l) {
          return i(c), l.data = r(l.data, l.headers, c.transformResponse), l;
        }, function(l) {
          return o(l) || (i(c), l && l.response && (l.response.data = r(l.response.data, l.response.headers, c.transformResponse))), Promise.reject(l);
        });
      };
    }, 5319: function(u, d, e) {
      var n = e("d784"), r = e("825a"), o = e("50c4"), t = e("a691"), i = e("1d80"), c = e("8aa5"), a = e("0cb2"), l = e("14c3"), s = Math.max, f = Math.min, b = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, v, h, m) {
        var g = m.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, w = m.REPLACE_KEEPS_$0, C = g ? "$" : "$0";
        return [function(k, S) {
          var y = i(this), E = k == null ? void 0 : k[p];
          return E !== void 0 ? E.call(k, y, S) : v.call(String(y), k, S);
        }, function(k, S) {
          if (!g && w || typeof S == "string" && S.indexOf(C) === -1) {
            var y = h(v, k, this, S);
            if (y.done) return y.value;
          }
          var E = r(k), O = String(this), T = typeof S == "function";
          T || (S = String(S));
          var _ = E.global;
          if (_) {
            var D = E.unicode;
            E.lastIndex = 0;
          }
          for (var F = []; ; ) {
            var Y = l(E, O);
            if (Y === null || (F.push(Y), !_)) break;
            var ae = String(Y[0]);
            ae === "" && (E.lastIndex = c(O, o(E.lastIndex), D));
          }
          for (var H = "", W = 0, V = 0; V < F.length; V++) {
            Y = F[V];
            for (var A = String(Y[0]), L = s(f(t(Y.index), O.length), 0), Q = [], ne = 1; ne < Y.length; ne++) Q.push(b(Y[ne]));
            var U = Y.groups;
            if (T) {
              var xe = [A].concat(Q, L, O);
              U !== void 0 && xe.push(U);
              var ve = String(S.apply(void 0, xe));
            } else ve = a(A, O, L, Q, U, S);
            L >= W && (H += O.slice(W, L) + ve, W = L + A.length);
          }
          return H + O.slice(W);
        }];
      });
    }, "545a": function(u, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), i = new r.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(i), d.default = i;
    }, 5530: function(u, d, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, r) {
        var o = n.document, t = o.documentElement, i = o.querySelector('meta[name="viewport"]'), c = o.querySelector('meta[name="flexible"]'), a = 0, l = 0, s = r.flexible || (r.flexible = {});
        if (i) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = i.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (l = parseFloat(f[1]), a = parseInt(1 / l));
        } else if (c) {
          var b = c.getAttribute("content");
          if (b) {
            var p = b.match(/initial\-dpr=([\d\.]+)/), v = b.match(/maximum\-dpr=([\d\.]+)/);
            p && (a = parseFloat(p[1]), l = parseFloat((1 / a).toFixed(2))), v && (a = parseFloat(v[1]), l = parseFloat((1 / a).toFixed(2)));
          }
        }
        if (!a && !l) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), m = n.devicePixelRatio;
          a = h ? m >= 3 && (!a || a >= 3) ? 3 : m >= 2 && (!a || a >= 2) ? 2 : 1 : 1, l = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !i) if (i = o.createElement("meta"), i.setAttribute("name", "viewport"), i.setAttribute("content", "initial-scale=" + l + ", maximum-scale=" + l + ", minimum-scale=" + l + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(i);
        else {
          var g = o.createElement("div");
          g.appendChild(i), o.write(g.innerHTML);
        }
        function w() {
          var C = t.getBoundingClientRect().width, k = C / 10;
          t.style.fontSize = k + "px", s.rem = n.rem = k;
        }
        n.addEventListener("resize", function() {
          w();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && w();
        }, !1), o.readyState === "complete" ? o.body.style.fontSize = 10 * a + "px" : o.addEventListener("DOMContentLoaded", function(C) {
          o.body.style.fontSize = 10 * a + "px";
        }, !1), w(), s.dpr = n.dpr = a, s.refreshRem = w, s.rem2px = function(C) {
          var k = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (k += "px"), k;
        }, s.px2rem = function(C) {
          var k = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (k += "rem"), k;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(u, d, e) {
      var n = e("c430"), r = e("c6cd");
      (u.exports = function(o, t) {
        return r[o] || (r[o] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(u, d, e) {
      var n = e("d066"), r = e("241c"), o = e("7418"), t = e("825a");
      u.exports = n("Reflect", "ownKeys") || function(i) {
        var c = r.f(t(i)), a = o.f;
        return a ? c.concat(a(i)) : c;
      };
    }, "5a34": function(u, d, e) {
      var n = e("44e7");
      u.exports = function(r) {
        if (n(r)) throw TypeError("The method doesn't accept regular expressions");
        return r;
      };
    }, "5c6c": function(u, d) {
      u.exports = function(e, n) {
        return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: n };
      };
    }, "5f02": function(u, d, e) {
      u.exports = function(n) {
        return typeof n == "object" && n.isAxiosError === !0;
      };
    }, "605d": function(u, d, e) {
      var n = e("c6b6"), r = e("da84");
      u.exports = n(r.process) == "process";
    }, 6062: function(u, d, e) {
      var n = e("6d61"), r = e("6566");
      u.exports = n("Set", function(o) {
        return function() {
          return o(this, arguments.length ? arguments[0] : void 0);
        };
      }, r);
    }, 6547: function(u, d, e) {
      var n = e("a691"), r = e("1d80"), o = function(t) {
        return function(i, c) {
          var a, l, s = String(r(i)), f = n(c), b = s.length;
          return f < 0 || f >= b ? t ? "" : void 0 : (a = s.charCodeAt(f), a < 55296 || a > 56319 || f + 1 === b || (l = s.charCodeAt(f + 1)) < 56320 || l > 57343 ? t ? s.charAt(f) : a : t ? s.slice(f, f + 2) : l - 56320 + (a - 55296 << 10) + 65536);
        };
      };
      u.exports = { codeAt: o(!1), charAt: o(!0) };
    }, 6566: function(u, d, e) {
      var n = e("9bf2").f, r = e("7c73"), o = e("e2cc"), t = e("0366"), i = e("19aa"), c = e("2266"), a = e("7dd0"), l = e("2626"), s = e("83ab"), f = e("f183").fastKey, b = e("69f3"), p = b.set, v = b.getterFor;
      u.exports = { getConstructor: function(h, m, g, w) {
        var C = h(function(E, O) {
          i(E, C, m), p(E, { type: m, index: r(null), first: void 0, last: void 0, size: 0 }), s || (E.size = 0), O != null && c(O, E[w], { that: E, AS_ENTRIES: g });
        }), k = v(m), S = function(E, O, T) {
          var _, D, F = k(E), Y = y(E, O);
          return Y ? Y.value = T : (F.last = Y = { index: D = f(O, !0), key: O, value: T, previous: _ = F.last, next: void 0, removed: !1 }, F.first || (F.first = Y), _ && (_.next = Y), s ? F.size++ : E.size++, D !== "F" && (F.index[D] = Y)), E;
        }, y = function(E, O) {
          var T, _ = k(E), D = f(O);
          if (D !== "F") return _.index[D];
          for (T = _.first; T; T = T.next) if (T.key == O) return T;
        };
        return o(C.prototype, { clear: function() {
          for (var E = this, O = k(E), T = O.index, _ = O.first; _; ) _.removed = !0, _.previous && (_.previous = _.previous.next = void 0), delete T[_.index], _ = _.next;
          O.first = O.last = void 0, s ? O.size = 0 : E.size = 0;
        }, delete: function(E) {
          var O = this, T = k(O), _ = y(O, E);
          if (_) {
            var D = _.next, F = _.previous;
            delete T.index[_.index], _.removed = !0, F && (F.next = D), D && (D.previous = F), T.first == _ && (T.first = D), T.last == _ && (T.last = F), s ? T.size-- : O.size--;
          }
          return !!_;
        }, forEach: function(E) {
          for (var O, T = k(this), _ = t(E, arguments.length > 1 ? arguments[1] : void 0, 3); O = O ? O.next : T.first; )
            for (_(O.value, O.key, this); O && O.removed; ) O = O.previous;
        }, has: function(E) {
          return !!y(this, E);
        } }), o(C.prototype, g ? { get: function(E) {
          var O = y(this, E);
          return O && O.value;
        }, set: function(E, O) {
          return S(this, E === 0 ? 0 : E, O);
        } } : { add: function(E) {
          return S(this, E = E === 0 ? 0 : E, E);
        } }), s && n(C.prototype, "size", { get: function() {
          return k(this).size;
        } }), C;
      }, setStrong: function(h, m, g) {
        var w = m + " Iterator", C = v(m), k = v(w);
        a(h, m, function(S, y) {
          p(this, { type: w, target: S, state: C(S), kind: y, last: void 0 });
        }, function() {
          for (var S = k(this), y = S.kind, E = S.last; E && E.removed; ) E = E.previous;
          return S.target && (S.last = E = E ? E.next : S.state.first) ? y == "keys" ? { value: E.key, done: !1 } : y == "values" ? { value: E.value, done: !1 } : { value: [E.key, E.value], done: !1 } : (S.target = void 0, { value: void 0, done: !0 });
        }, g ? "entries" : "values", !g, !0), l(m);
      } };
    }, "65f0": function(u, d, e) {
      var n = e("861d"), r = e("e8b5"), o = e("b622"), t = o("species");
      u.exports = function(i, c) {
        var a;
        return r(i) && (a = i.constructor, typeof a != "function" || a !== Array && !r(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(c === 0 ? 0 : c);
      };
    }, "69f3": function(u, d, e) {
      var n, r, o, t = e("7f9a"), i = e("da84"), c = e("861d"), a = e("9112"), l = e("5135"), s = e("c6cd"), f = e("f772"), b = e("d012"), p = i.WeakMap, v = function(S) {
        return o(S) ? r(S) : n(S, {});
      }, h = function(S) {
        return function(y) {
          var E;
          if (!c(y) || (E = r(y)).type !== S) throw TypeError("Incompatible receiver, " + S + " required");
          return E;
        };
      };
      if (t) {
        var m = s.state || (s.state = new p()), g = m.get, w = m.has, C = m.set;
        n = function(S, y) {
          return y.facade = S, C.call(m, S, y), y;
        }, r = function(S) {
          return g.call(m, S) || {};
        }, o = function(S) {
          return w.call(m, S);
        };
      } else {
        var k = f("state");
        b[k] = !0, n = function(S, y) {
          return y.facade = S, a(S, k, y), y;
        }, r = function(S) {
          return l(S, k) ? S[k] : {};
        }, o = function(S) {
          return l(S, k);
        };
      }
      u.exports = { set: n, get: r, has: o, enforce: v, getterFor: h };
    }, "6d55": function(u, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), i = new r.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(i), d.default = i;
    }, "6d61": function(u, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("94ca"), t = e("6eeb"), i = e("f183"), c = e("2266"), a = e("19aa"), l = e("861d"), s = e("d039"), f = e("1c7e"), b = e("d44e"), p = e("7156");
      u.exports = function(v, h, m) {
        var g = v.indexOf("Map") !== -1, w = v.indexOf("Weak") !== -1, C = g ? "set" : "add", k = r[v], S = k && k.prototype, y = k, E = {}, O = function(H) {
          var W = S[H];
          t(S, H, H == "add" ? function(V) {
            return W.call(this, V === 0 ? 0 : V), this;
          } : H == "delete" ? function(V) {
            return !(w && !l(V)) && W.call(this, V === 0 ? 0 : V);
          } : H == "get" ? function(V) {
            return w && !l(V) ? void 0 : W.call(this, V === 0 ? 0 : V);
          } : H == "has" ? function(V) {
            return !(w && !l(V)) && W.call(this, V === 0 ? 0 : V);
          } : function(V, A) {
            return W.call(this, V === 0 ? 0 : V, A), this;
          });
        }, T = o(v, typeof k != "function" || !(w || S.forEach && !s(function() {
          new k().entries().next();
        })));
        if (T) y = m.getConstructor(h, v, g, C), i.REQUIRED = !0;
        else if (o(v, !0)) {
          var _ = new y(), D = _[C](w ? {} : -0, 1) != _, F = s(function() {
            _.has(1);
          }), Y = f(function(H) {
            new k(H);
          }), ae = !w && s(function() {
            for (var H = new k(), W = 5; W--; ) H[C](W, W);
            return !H.has(-0);
          });
          Y || (y = h(function(H, W) {
            a(H, y, v);
            var V = p(new k(), H, y);
            return W != null && c(W, V[C], { that: V, AS_ENTRIES: g }), V;
          }), y.prototype = S, S.constructor = y), (F || ae) && (O("delete"), O("has"), g && O("get")), (ae || D) && O(C), w && S.clear && delete S.clear;
        }
        return E[v] = y, n({ global: !0, forced: y != k }, E), b(y, v), w || m.setStrong(y, v, g), y;
      };
    }, "6eeb": function(u, d, e) {
      var n = e("da84"), r = e("9112"), o = e("5135"), t = e("ce4e"), i = e("8925"), c = e("69f3"), a = c.get, l = c.enforce, s = String(String).split("String");
      (u.exports = function(f, b, p, v) {
        var h, m = !!v && !!v.unsafe, g = !!v && !!v.enumerable, w = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof b != "string" || o(p, "name") || r(p, "name", b), h = l(p), h.source || (h.source = s.join(typeof b == "string" ? b : ""))), f !== n ? (m ? !w && f[b] && (g = !0) : delete f[b], g ? f[b] = p : r(f, b, p)) : g ? f[b] = p : t(b, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && a(this).source || i(this);
      });
    }, "70d3": function(u, d, e) {
    }, 7156: function(u, d, e) {
      var n = e("861d"), r = e("d2bb");
      u.exports = function(o, t, i) {
        var c, a;
        return r && typeof (c = t.constructor) == "function" && c !== i && n(a = c.prototype) && a !== i.prototype && r(o, a), o;
      };
    }, 7305: function(u, d, e) {
    }, 7320: function(u, d, e) {
    }, 7418: function(u, d) {
      d.f = Object.getOwnPropertySymbols;
    }, "746f": function(u, d, e) {
      var n = e("428f"), r = e("5135"), o = e("e538"), t = e("9bf2").f;
      u.exports = function(i) {
        var c = n.Symbol || (n.Symbol = {});
        r(c, i) || t(c, i, { value: o.f(i) });
      };
    }, 7839: function(u, d) {
      u.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(u, d, e) {
      function n(r) {
        this.message = r;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, u.exports = n;
    }, "7aac": function(u, d, e) {
      var n = e("c532");
      u.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(r, o, t, i, c, a) {
          var l = [];
          l.push(r + "=" + encodeURIComponent(o)), n.isNumber(t) && l.push("expires=" + new Date(t).toGMTString()), n.isString(i) && l.push("path=" + i), n.isString(c) && l.push("domain=" + c), a === !0 && l.push("secure"), document.cookie = l.join("; ");
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
    }, "7b0b": function(u, d, e) {
      var n = e("1d80");
      u.exports = function(r) {
        return Object(n(r));
      };
    }, "7c73": function(u, d, e) {
      var n, r = e("825a"), o = e("37e8"), t = e("7839"), i = e("d012"), c = e("1be4"), a = e("cc12"), l = e("f772"), s = ">", f = "<", b = "prototype", p = "script", v = l("IE_PROTO"), h = function() {
      }, m = function(k) {
        return f + p + s + k + f + "/" + p + s;
      }, g = function(k) {
        k.write(m("")), k.close();
        var S = k.parentWindow.Object;
        return k = null, S;
      }, w = function() {
        var k, S = a("iframe"), y = "java" + p + ":";
        return S.style.display = "none", c.appendChild(S), S.src = String(y), k = S.contentWindow.document, k.open(), k.write(m("document.F=Object")), k.close(), k.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? g(n) : w();
        for (var k = t.length; k--; ) delete C[b][t[k]];
        return C();
      };
      i[v] = !0, u.exports = Object.create || function(k, S) {
        var y;
        return k !== null ? (h[b] = r(k), y = new h(), h[b] = null, y[v] = k) : y = C(), S === void 0 ? y : o(y, S);
      };
    }, "7db0": function(u, d, e) {
      var n = e("23e7"), r = e("b727").find, o = e("44d2"), t = "find", i = !0;
      t in [] && Array(1)[t](function() {
        i = !1;
      }), n({ target: "Array", proto: !0, forced: i }, { find: function(c) {
        return r(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), o(t);
    }, "7dd0": function(u, d, e) {
      var n = e("23e7"), r = e("9ed3"), o = e("e163"), t = e("d2bb"), i = e("d44e"), c = e("9112"), a = e("6eeb"), l = e("b622"), s = e("c430"), f = e("3f8c"), b = e("ae93"), p = b.IteratorPrototype, v = b.BUGGY_SAFARI_ITERATORS, h = l("iterator"), m = "keys", g = "values", w = "entries", C = function() {
        return this;
      };
      u.exports = function(k, S, y, E, O, T, _) {
        r(y, S, E);
        var D, F, Y, ae = function(ne) {
          if (ne === O && L) return L;
          if (!v && ne in V) return V[ne];
          switch (ne) {
            case m:
              return function() {
                return new y(this, ne);
              };
            case g:
              return function() {
                return new y(this, ne);
              };
            case w:
              return function() {
                return new y(this, ne);
              };
          }
          return function() {
            return new y(this);
          };
        }, H = S + " Iterator", W = !1, V = k.prototype, A = V[h] || V["@@iterator"] || O && V[O], L = !v && A || ae(O), Q = S == "Array" && V.entries || A;
        if (Q && (D = o(Q.call(new k())), p !== Object.prototype && D.next && (s || o(D) === p || (t ? t(D, p) : typeof D[h] != "function" && c(D, h, C)), i(D, H, !0, !0), s && (f[H] = C))), O == g && A && A.name !== g && (W = !0, L = function() {
          return A.call(this);
        }), s && !_ || V[h] === L || c(V, h, L), f[S] = L, O) if (F = { values: ae(g), keys: T ? L : ae(m), entries: ae(w) }, _) for (Y in F) (v || W || !(Y in V)) && a(V, Y, F[Y]);
        else n({ target: S, proto: !0, forced: v || W }, F);
        return F;
      };
    }, "7eb5": function(u, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), i = new r.a({ id: "icon-drag", use: "icon-drag-usage", viewBox: "0 0 28 29.526", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 29.526" id="icon-drag">\r
  <g id="icon-drag_drag" transform="translate(-1623.5 -915.5)">\r
    <line id="icon-drag_直线_5" data-name="直线 5" y2="22.015" transform="translate(1637.049 919.566)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <line id="icon-drag_直线_6" data-name="直线 6" x1="22.015" transform="translate(1626.041 930.574)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <path id="icon-drag_路径_15" data-name="路径 15" d="M728.456,559.625l3.888-3.887,3.885,3.885" transform="translate(904.603 361.262)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_16" data-name="路径 16" d="M736.229,568.465l-3.888,3.888-3.885-3.885" transform="translate(904.603 371.172)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_17" data-name="路径 17" d="M735.8,561.184l3.888,3.888-3.885,3.885" transform="translate(910.317 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_18" data-name="路径 18" d="M727.813,568.957l-3.888-3.888,3.885-3.885" transform="translate(901.075 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
  </g>\r
</symbol>` });
      t.a.add(i), d.default = i;
    }, "7f9a": function(u, d, e) {
      var n = e("da84"), r = e("8925"), o = n.WeakMap;
      u.exports = typeof o == "function" && /native code/.test(r(o));
    }, "825a": function(u, d, e) {
      var n = e("861d");
      u.exports = function(r) {
        if (!n(r)) throw TypeError(String(r) + " is not an object");
        return r;
      };
    }, "83ab": function(u, d, e) {
      var n = e("d039");
      u.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(u, d, e) {
      var n = e("d925"), r = e("e683");
      u.exports = function(o, t) {
        return o && !n(t) ? r(o, t) : t;
      };
    }, 8418: function(u, d, e) {
      var n = e("c04e"), r = e("9bf2"), o = e("5c6c");
      u.exports = function(t, i, c) {
        var a = n(i);
        a in t ? r.f(t, a, o(0, c)) : t[a] = c;
      };
    }, "861d": function(u, d) {
      u.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(u, d, e) {
      var n, r, o;
      (function(t, i) {
        r = [], n = i, o = typeof n == "function" ? n.apply(d, r) : n, o === void 0 || (u.exports = o);
      })(typeof self < "u" && self, function() {
        function t() {
          var i = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!i && "currentScript" in document && document.currentScript || i && i.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (w) {
            var c, a, l, s = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, b = s.exec(w.stack) || f.exec(w.stack), p = b && b[1] || !1, v = b && b[2] || !1, h = document.location.href.replace(document.location.hash, ""), m = document.getElementsByTagName("script");
            p === h && (c = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), l = c.replace(a, "$1").trim());
            for (var g = 0; g < m.length; g++)
              if (m[g].readyState === "interactive" || m[g].src === p || p === h && m[g].innerHTML && m[g].innerHTML.trim() === l) return m[g];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(u, d, e) {
      var n = e("c6cd"), r = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(o) {
        return r.call(o);
      }), u.exports = n.inspectSource;
    }, "8aa5": function(u, d, e) {
      var n = e("6547").charAt;
      u.exports = function(r, o, t) {
        return o + (t ? n(r, o).length : 1);
      };
    }, "8bbf": function(u, d) {
      u.exports = ee;
    }, "8df4": function(u, d, e) {
      var n = e("7a77");
      function r(o) {
        if (typeof o != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(c) {
          t = c;
        });
        var i = this;
        o(function(c) {
          i.reason || (i.reason = new n(c), t(i.reason));
        });
      }
      r.prototype.throwIfRequested = function() {
        if (this.reason) throw this.reason;
      }, r.source = function() {
        var o, t = new r(function(i) {
          o = i;
        });
        return { token: t, cancel: o };
      }, u.exports = r;
    }, "90e3": function(u, d) {
      var e = 0, n = Math.random();
      u.exports = function(r) {
        return "Symbol(" + String(r === void 0 ? "" : r) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(u, d, e) {
      var n = e("83ab"), r = e("9bf2"), o = e("5c6c");
      u.exports = n ? function(t, i, c) {
        return r.f(t, i, o(1, c));
      } : function(t, i, c) {
        return t[i] = c, t;
      };
    }, 9263: function(u, d, e) {
      var n = e("ad6d"), r = e("9f7f"), o = RegExp.prototype.exec, t = String.prototype.replace, i = o, c = function() {
        var f = /a/, b = /b*/g;
        return o.call(f, "a"), o.call(b, "a"), f.lastIndex !== 0 || b.lastIndex !== 0;
      }(), a = r.UNSUPPORTED_Y || r.BROKEN_CARET, l = /()??/.exec("")[1] !== void 0, s = c || l || a;
      s && (i = function(f) {
        var b, p, v, h, m = this, g = a && m.sticky, w = n.call(m), C = m.source, k = 0, S = f;
        return g && (w = w.replace("y", ""), w.indexOf("g") === -1 && (w += "g"), S = String(f).slice(m.lastIndex), m.lastIndex > 0 && (!m.multiline || m.multiline && f[m.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", S = " " + S, k++), p = new RegExp("^(?:" + C + ")", w)), l && (p = new RegExp("^" + C + "$(?!\\s)", w)), c && (b = m.lastIndex), v = o.call(g ? p : m, S), g ? v ? (v.input = v.input.slice(k), v[0] = v[0].slice(k), v.index = m.lastIndex, m.lastIndex += v[0].length) : m.lastIndex = 0 : c && v && (m.lastIndex = m.global ? v.index + v[0].length : b), l && v && v.length > 1 && t.call(v[0], p, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (v[h] = void 0);
        }), v;
      }), u.exports = i;
    }, "94ca": function(u, d, e) {
      var n = e("d039"), r = /#|\.prototype\./, o = function(l, s) {
        var f = i[t(l)];
        return f == a || f != c && (typeof s == "function" ? n(s) : !!s);
      }, t = o.normalize = function(l) {
        return String(l).replace(r, ".").toLowerCase();
      }, i = o.data = {}, c = o.NATIVE = "N", a = o.POLYFILL = "P";
      u.exports = o;
    }, "95d9": function(u, d, e) {
    }, "96cf": function(u, d) {
      (function(e) {
        var n, r = Object.prototype, o = r.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, i = t.iterator || "@@iterator", c = t.asyncIterator || "@@asyncIterator", a = t.toStringTag || "@@toStringTag", l = typeof u == "object", s = e.regeneratorRuntime;
        if (s) l && (u.exports = s);
        else {
          s = e.regeneratorRuntime = l ? u.exports : {}, s.wrap = k;
          var f = "suspendedStart", b = "suspendedYield", p = "executing", v = "completed", h = {}, m = {};
          m[i] = function() {
            return this;
          };
          var g = Object.getPrototypeOf, w = g && g(g(W([])));
          w && w !== r && o.call(w, i) && (m = w);
          var C = O.prototype = y.prototype = Object.create(m);
          E.prototype = C.constructor = O, O.constructor = E, O[a] = E.displayName = "GeneratorFunction", s.isGeneratorFunction = function(A) {
            var L = typeof A == "function" && A.constructor;
            return !!L && (L === E || (L.displayName || L.name) === "GeneratorFunction");
          }, s.mark = function(A) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(A, O) : (A.__proto__ = O, a in A || (A[a] = "GeneratorFunction")), A.prototype = Object.create(C), A;
          }, s.awrap = function(A) {
            return { __await: A };
          }, T(_.prototype), _.prototype[c] = function() {
            return this;
          }, s.AsyncIterator = _, s.async = function(A, L, Q, ne) {
            var U = new _(k(A, L, Q, ne));
            return s.isGeneratorFunction(L) ? U : U.next().then(function(xe) {
              return xe.done ? xe.value : U.next();
            });
          }, T(C), C[a] = "Generator", C[i] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, s.keys = function(A) {
            var L = [];
            for (var Q in A) L.push(Q);
            return L.reverse(), function ne() {
              for (; L.length; ) {
                var U = L.pop();
                if (U in A) return ne.value = U, ne.done = !1, ne;
              }
              return ne.done = !0, ne;
            };
          }, s.values = W, H.prototype = { constructor: H, reset: function(A) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ae), !A) for (var L in this) L.charAt(0) === "t" && o.call(this, L) && !isNaN(+L.slice(1)) && (this[L] = n);
          }, stop: function() {
            this.done = !0;
            var A = this.tryEntries[0], L = A.completion;
            if (L.type === "throw") throw L.arg;
            return this.rval;
          }, dispatchException: function(A) {
            if (this.done) throw A;
            var L = this;
            function Q(Be, $e) {
              return xe.type = "throw", xe.arg = A, L.next = Be, $e && (L.method = "next", L.arg = n), !!$e;
            }
            for (var ne = this.tryEntries.length - 1; ne >= 0; --ne) {
              var U = this.tryEntries[ne], xe = U.completion;
              if (U.tryLoc === "root") return Q("end");
              if (U.tryLoc <= this.prev) {
                var ve = o.call(U, "catchLoc"), Ne = o.call(U, "finallyLoc");
                if (ve && Ne) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                } else if (ve) {
                  if (this.prev < U.catchLoc) return Q(U.catchLoc, !0);
                } else {
                  if (!Ne) throw new Error("try statement without catch or finally");
                  if (this.prev < U.finallyLoc) return Q(U.finallyLoc);
                }
              }
            }
          }, abrupt: function(A, L) {
            for (var Q = this.tryEntries.length - 1; Q >= 0; --Q) {
              var ne = this.tryEntries[Q];
              if (ne.tryLoc <= this.prev && o.call(ne, "finallyLoc") && this.prev < ne.finallyLoc) {
                var U = ne;
                break;
              }
            }
            U && (A === "break" || A === "continue") && U.tryLoc <= L && L <= U.finallyLoc && (U = null);
            var xe = U ? U.completion : {};
            return xe.type = A, xe.arg = L, U ? (this.method = "next", this.next = U.finallyLoc, h) : this.complete(xe);
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
                var ne = Q.completion;
                if (ne.type === "throw") {
                  var U = ne.arg;
                  ae(Q);
                }
                return U;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(A, L, Q) {
            return this.delegate = { iterator: W(A), resultName: L, nextLoc: Q }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function k(A, L, Q, ne) {
          var U = L && L.prototype instanceof y ? L : y, xe = Object.create(U.prototype), ve = new H(ne || []);
          return xe._invoke = D(A, Q, ve), xe;
        }
        function S(A, L, Q) {
          try {
            return { type: "normal", arg: A.call(L, Q) };
          } catch (ne) {
            return { type: "throw", arg: ne };
          }
        }
        function y() {
        }
        function E() {
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
        function _(A) {
          function L(U, xe, ve, Ne) {
            var Be = S(A[U], A, xe);
            if (Be.type !== "throw") {
              var $e = Be.arg, Ae = $e.value;
              return Ae && typeof Ae == "object" && o.call(Ae, "__await") ? Promise.resolve(Ae.__await).then(function(Ee) {
                L("next", Ee, ve, Ne);
              }, function(Ee) {
                L("throw", Ee, ve, Ne);
              }) : Promise.resolve(Ae).then(function(Ee) {
                $e.value = Ee, ve($e);
              }, Ne);
            }
            Ne(Be.arg);
          }
          var Q;
          function ne(U, xe) {
            function ve() {
              return new Promise(function(Ne, Be) {
                L(U, xe, Ne, Be);
              });
            }
            return Q = Q ? Q.then(ve, ve) : ve();
          }
          this._invoke = ne;
        }
        function D(A, L, Q) {
          var ne = f;
          return function(U, xe) {
            if (ne === p) throw new Error("Generator is already running");
            if (ne === v) {
              if (U === "throw") throw xe;
              return V();
            }
            for (Q.method = U, Q.arg = xe; ; ) {
              var ve = Q.delegate;
              if (ve) {
                var Ne = F(ve, Q);
                if (Ne) {
                  if (Ne === h) continue;
                  return Ne;
                }
              }
              if (Q.method === "next") Q.sent = Q._sent = Q.arg;
              else if (Q.method === "throw") {
                if (ne === f) throw ne = v, Q.arg;
                Q.dispatchException(Q.arg);
              } else Q.method === "return" && Q.abrupt("return", Q.arg);
              ne = p;
              var Be = S(A, L, Q);
              if (Be.type === "normal") {
                if (ne = Q.done ? v : b, Be.arg === h) continue;
                return { value: Be.arg, done: Q.done };
              }
              Be.type === "throw" && (ne = v, Q.method = "throw", Q.arg = Be.arg);
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
          var ne = S(Q, A.iterator, L.arg);
          if (ne.type === "throw") return L.method = "throw", L.arg = ne.arg, L.delegate = null, h;
          var U = ne.arg;
          return U ? U.done ? (L[A.resultName] = U.value, L.next = A.nextLoc, L.method !== "return" && (L.method = "next", L.arg = n), L.delegate = null, h) : U : (L.method = "throw", L.arg = new TypeError("iterator result is not an object"), L.delegate = null, h);
        }
        function Y(A) {
          var L = { tryLoc: A[0] };
          1 in A && (L.catchLoc = A[1]), 2 in A && (L.finallyLoc = A[2], L.afterLoc = A[3]), this.tryEntries.push(L);
        }
        function ae(A) {
          var L = A.completion || {};
          L.type = "normal", delete L.arg, A.completion = L;
        }
        function H(A) {
          this.tryEntries = [{ tryLoc: "root" }], A.forEach(Y, this), this.reset(!0);
        }
        function W(A) {
          if (A) {
            var L = A[i];
            if (L) return L.call(A);
            if (typeof A.next == "function") return A;
            if (!isNaN(A.length)) {
              var Q = -1, ne = function U() {
                for (; ++Q < A.length; ) if (o.call(A, Q)) return U.value = A[Q], U.done = !1, U;
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
    }, "99af": function(u, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("e8b5"), t = e("861d"), i = e("7b0b"), c = e("50c4"), a = e("8418"), l = e("65f0"), s = e("1dde"), f = e("b622"), b = e("2d00"), p = f("isConcatSpreadable"), v = 9007199254740991, h = "Maximum allowed index exceeded", m = b >= 51 || !r(function() {
        var k = [];
        return k[p] = !1, k.concat()[0] !== k;
      }), g = s("concat"), w = function(k) {
        if (!t(k)) return !1;
        var S = k[p];
        return S !== void 0 ? !!S : o(k);
      }, C = !m || !g;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(k) {
        var S, y, E, O, T, _ = i(this), D = l(_, 0), F = 0;
        for (S = -1, E = arguments.length; S < E; S++) if (T = S === -1 ? _ : arguments[S], w(T)) {
          if (O = c(T.length), F + O > v) throw TypeError(h);
          for (y = 0; y < O; y++, F++) y in T && a(D, F, T[y]);
        } else {
          if (F >= v) throw TypeError(h);
          a(D, F++, T);
        }
        return D.length = F, D;
      } });
    }, "9aaf": function(u, d, e) {
      e("70d3");
    }, "9bdd": function(u, d, e) {
      var n = e("825a"), r = e("2a62");
      u.exports = function(o, t, i, c) {
        try {
          return c ? t(n(i)[0], i[1]) : t(i);
        } catch (a) {
          throw r(o), a;
        }
      };
    }, "9bf2": function(u, d, e) {
      var n = e("83ab"), r = e("0cfb"), o = e("825a"), t = e("c04e"), i = Object.defineProperty;
      d.f = n ? i : function(c, a, l) {
        if (o(c), a = t(a, !0), o(l), r) try {
          return i(c, a, l);
        } catch {
        }
        if ("get" in l || "set" in l) throw TypeError("Accessors not supported");
        return "value" in l && (c[a] = l.value), c;
      };
    }, "9ed3": function(u, d, e) {
      var n = e("ae93").IteratorPrototype, r = e("7c73"), o = e("5c6c"), t = e("d44e"), i = e("3f8c"), c = function() {
        return this;
      };
      u.exports = function(a, l, s) {
        var f = l + " Iterator";
        return a.prototype = r(n, { next: o(1, s) }), t(a, f, !1, !0), i[f] = c, a;
      };
    }, "9f7f": function(u, d, e) {
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
    }, a434: function(u, d, e) {
      var n = e("23e7"), r = e("23cb"), o = e("a691"), t = e("50c4"), i = e("7b0b"), c = e("65f0"), a = e("8418"), l = e("1dde"), s = l("splice"), f = Math.max, b = Math.min, p = 9007199254740991, v = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !s }, { splice: function(h, m) {
        var g, w, C, k, S, y, E = i(this), O = t(E.length), T = r(h, O), _ = arguments.length;
        if (_ === 0 ? g = w = 0 : _ === 1 ? (g = 0, w = O - T) : (g = _ - 2, w = b(f(o(m), 0), O - T)), O + g - w > p) throw TypeError(v);
        for (C = c(E, w), k = 0; k < w; k++) S = T + k, S in E && a(C, k, E[S]);
        if (C.length = w, g < w) {
          for (k = T; k < O - w; k++) S = k + w, y = k + g, S in E ? E[y] = E[S] : delete E[y];
          for (k = O; k > O - w + g; k--) delete E[k - 1];
        } else if (g > w) for (k = O - w; k > T; k--) S = k + w - 1, y = k + g - 1, S in E ? E[y] = E[S] : delete E[y];
        for (k = 0; k < g; k++) E[k + T] = arguments[k + 2];
        return E.length = O - w + g, C;
      } });
    }, a4b4: function(u, d, e) {
      var n = e("342f");
      u.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(u, d, e) {
      var n = e("23e7"), r = e("da84"), o = e("d066"), t = e("c430"), i = e("83ab"), c = e("4930"), a = e("fdbf"), l = e("d039"), s = e("5135"), f = e("e8b5"), b = e("861d"), p = e("825a"), v = e("7b0b"), h = e("fc6a"), m = e("c04e"), g = e("5c6c"), w = e("7c73"), C = e("df75"), k = e("241c"), S = e("057f"), y = e("7418"), E = e("06cf"), O = e("9bf2"), T = e("d1e7"), _ = e("9112"), D = e("6eeb"), F = e("5692"), Y = e("f772"), ae = e("d012"), H = e("90e3"), W = e("b622"), V = e("e538"), A = e("746f"), L = e("d44e"), Q = e("69f3"), ne = e("b727").forEach, U = Y("hidden"), xe = "Symbol", ve = "prototype", Ne = W("toPrimitive"), Be = Q.set, $e = Q.getterFor(xe), Ae = Object[ve], Ee = r.Symbol, Fe = o("JSON", "stringify"), Qe = E.f, B = O.f, $ = S.f, X = T.f, M = F("symbols"), te = F("op-symbols"), ie = F("string-to-symbol-registry"), we = F("symbol-to-string-registry"), ge = F("wks"), ce = r.QObject, J = !ce || !ce[ve] || !ce[ve].findChild, P = i && l(function() {
        return w(B({}, "a", { get: function() {
          return B(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(q, oe, le) {
        var me = Qe(Ae, oe);
        me && delete Ae[oe], B(q, oe, le), me && q !== Ae && B(Ae, oe, me);
      } : B, re = function(q, oe) {
        var le = M[q] = w(Ee[ve]);
        return Be(le, { type: xe, tag: q, description: oe }), i || (le.description = oe), le;
      }, ke = a ? function(q) {
        return typeof q == "symbol";
      } : function(q) {
        return Object(q) instanceof Ee;
      }, We = function(q, oe, le) {
        q === Ae && We(te, oe, le), p(q);
        var me = m(oe, !0);
        return p(le), s(M, me) ? (le.enumerable ? (s(q, U) && q[U][me] && (q[U][me] = !1), le = w(le, { enumerable: g(0, !1) })) : (s(q, U) || B(q, U, g(1, {})), q[U][me] = !0), P(q, me, le)) : B(q, me, le);
      }, Ye = function(q, oe) {
        p(q);
        var le = h(oe), me = C(le).concat(fe(le));
        return ne(me, function(Ue) {
          i && !at.call(le, Ue) || We(q, Ue, le[Ue]);
        }), q;
      }, Ze = function(q, oe) {
        return oe === void 0 ? w(q) : Ye(w(q), oe);
      }, at = function(q) {
        var oe = m(q, !0), le = X.call(this, oe);
        return !(this === Ae && s(M, oe) && !s(te, oe)) && (!(le || !s(this, oe) || !s(M, oe) || s(this, U) && this[U][oe]) || le);
      }, z = function(q, oe) {
        var le = h(q), me = m(oe, !0);
        if (le !== Ae || !s(M, me) || s(te, me)) {
          var Ue = Qe(le, me);
          return !Ue || !s(M, me) || s(le, U) && le[U][me] || (Ue.enumerable = !0), Ue;
        }
      }, ue = function(q) {
        var oe = $(h(q)), le = [];
        return ne(oe, function(me) {
          s(M, me) || s(ae, me) || le.push(me);
        }), le;
      }, fe = function(q) {
        var oe = q === Ae, le = $(oe ? te : h(q)), me = [];
        return ne(le, function(Ue) {
          !s(M, Ue) || oe && !s(Ae, Ue) || me.push(M[Ue]);
        }), me;
      };
      if (c || (Ee = function() {
        if (this instanceof Ee) throw TypeError("Symbol is not a constructor");
        var q = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, oe = H(q), le = function(me) {
          this === Ae && le.call(te, me), s(this, U) && s(this[U], oe) && (this[U][oe] = !1), P(this, oe, g(1, me));
        };
        return i && J && P(Ae, oe, { configurable: !0, set: le }), re(oe, q);
      }, D(Ee[ve], "toString", function() {
        return $e(this).tag;
      }), D(Ee, "withoutSetter", function(q) {
        return re(H(q), q);
      }), T.f = at, O.f = We, E.f = z, k.f = S.f = ue, y.f = fe, V.f = function(q) {
        return re(W(q), q);
      }, i && (B(Ee[ve], "description", { configurable: !0, get: function() {
        return $e(this).description;
      } }), t || D(Ae, "propertyIsEnumerable", at, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Ee }), ne(C(ge), function(q) {
        A(q);
      }), n({ target: xe, stat: !0, forced: !c }, { for: function(q) {
        var oe = String(q);
        if (s(ie, oe)) return ie[oe];
        var le = Ee(oe);
        return ie[oe] = le, we[le] = oe, le;
      }, keyFor: function(q) {
        if (!ke(q)) throw TypeError(q + " is not a symbol");
        if (s(we, q)) return we[q];
      }, useSetter: function() {
        J = !0;
      }, useSimple: function() {
        J = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !i }, { create: Ze, defineProperty: We, defineProperties: Ye, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: ue, getOwnPropertySymbols: fe }), n({ target: "Object", stat: !0, forced: l(function() {
        y.f(1);
      }) }, { getOwnPropertySymbols: function(q) {
        return y.f(v(q));
      } }), Fe) {
        var he = !c || l(function() {
          var q = Ee();
          return Fe([q]) != "[null]" || Fe({ a: q }) != "{}" || Fe(Object(q)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: he }, { stringify: function(q, oe, le) {
          for (var me, Ue = [q], qe = 1; arguments.length > qe; ) Ue.push(arguments[qe++]);
          if (me = oe, (b(oe) || q !== void 0) && !ke(q)) return f(oe) || (oe = function(et, Oe) {
            if (typeof me == "function" && (Oe = me.call(this, et, Oe)), !ke(Oe)) return Oe;
          }), Ue[1] = oe, Fe.apply(null, Ue);
        } });
      }
      Ee[ve][Ne] || _(Ee[ve], Ne, Ee[ve].valueOf), L(Ee, xe), ae[U] = !0;
    }, a630: function(u, d, e) {
      var n = e("23e7"), r = e("4df4"), o = e("1c7e"), t = !o(function(i) {
        Array.from(i);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: r });
    }, a640: function(u, d, e) {
      var n = e("d039");
      u.exports = function(r, o) {
        var t = [][r];
        return !!t && n(function() {
          t.call(null, o || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(u, d) {
      var e = Math.ceil, n = Math.floor;
      u.exports = function(r) {
        return isNaN(r = +r) ? 0 : (r > 0 ? n : e)(r);
      };
    }, ab13: function(u, d, e) {
      var n = e("b622"), r = n("match");
      u.exports = function(o) {
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
    }, ac1f: function(u, d, e) {
      var n = e("23e7"), r = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== r }, { exec: r });
    }, acce: function(u, d, e) {
    }, ad6d: function(u, d, e) {
      var n = e("825a");
      u.exports = function() {
        var r = n(this), o = "";
        return r.global && (o += "g"), r.ignoreCase && (o += "i"), r.multiline && (o += "m"), r.dotAll && (o += "s"), r.unicode && (o += "u"), r.sticky && (o += "y"), o;
      };
    }, ae93: function(u, d, e) {
      var n, r, o, t = e("d039"), i = e("e163"), c = e("9112"), a = e("5135"), l = e("b622"), s = e("c430"), f = l("iterator"), b = !1, p = function() {
        return this;
      };
      [].keys && (o = [].keys(), "next" in o ? (r = i(i(o)), r !== Object.prototype && (n = r)) : b = !0);
      var v = n == null || t(function() {
        var h = {};
        return n[f].call(h) !== h;
      });
      v && (n = {}), s && !v || a(n, f) || c(n, f, p), u.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: b };
    }, b041: function(u, d, e) {
      var n = e("00ee"), r = e("f5df");
      u.exports = n ? {}.toString : function() {
        return "[object " + r(this) + "]";
      };
    }, b0c0: function(u, d, e) {
      var n = e("83ab"), r = e("9bf2").f, o = Function.prototype, t = o.toString, i = /^\s*function ([^ (]*)/, c = "name";
      n && !(c in o) && r(o, c, { configurable: !0, get: function() {
        try {
          return t.call(this).match(i)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(u, d, e) {
      var n = e("c532"), r = e("467f"), o = e("7aac"), t = e("30b5"), i = e("83b9"), c = e("c345"), a = e("3934"), l = e("2d83");
      u.exports = function(s) {
        return new Promise(function(f, b) {
          var p = s.data, v = s.headers;
          n.isFormData(p) && delete v["Content-Type"];
          var h = new XMLHttpRequest();
          if (s.auth) {
            var m = s.auth.username || "", g = s.auth.password ? unescape(encodeURIComponent(s.auth.password)) : "";
            v.Authorization = "Basic " + btoa(m + ":" + g);
          }
          var w = i(s.baseURL, s.url);
          if (h.open(s.method.toUpperCase(), t(w, s.params, s.paramsSerializer), !0), h.timeout = s.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var k = "getAllResponseHeaders" in h ? c(h.getAllResponseHeaders()) : null, S = s.responseType && s.responseType !== "text" ? h.response : h.responseText, y = { data: S, status: h.status, statusText: h.statusText, headers: k, config: s, request: h };
              r(f, b, y), h = null;
            }
          }, h.onabort = function() {
            h && (b(l("Request aborted", s, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            b(l("Network Error", s, null, h)), h = null;
          }, h.ontimeout = function() {
            var k = "timeout of " + s.timeout + "ms exceeded";
            s.timeoutErrorMessage && (k = s.timeoutErrorMessage), b(l(k, s, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var C = (s.withCredentials || a(w)) && s.xsrfCookieName ? o.read(s.xsrfCookieName) : void 0;
            C && (v[s.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in h && n.forEach(v, function(k, S) {
            typeof p > "u" && S.toLowerCase() === "content-type" ? delete v[S] : h.setRequestHeader(S, k);
          }), n.isUndefined(s.withCredentials) || (h.withCredentials = !!s.withCredentials), s.responseType) try {
            h.responseType = s.responseType;
          } catch (k) {
            if (s.responseType !== "json") throw k;
          }
          typeof s.onDownloadProgress == "function" && h.addEventListener("progress", s.onDownloadProgress), typeof s.onUploadProgress == "function" && h.upload && h.upload.addEventListener("progress", s.onUploadProgress), s.cancelToken && s.cancelToken.promise.then(function(k) {
            h && (h.abort(), b(k), h = null);
          }), p || (p = null), h.send(p);
        });
      };
    }, b575: function(u, d, e) {
      var n, r, o, t, i, c, a, l, s = e("da84"), f = e("06cf").f, b = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), h = e("605d"), m = s.MutationObserver || s.WebKitMutationObserver, g = s.document, w = s.process, C = s.Promise, k = f(s, "queueMicrotask"), S = k && k.value;
      S || (n = function() {
        var y, E;
        for (h && (y = w.domain) && y.exit(); r; ) {
          E = r.fn, r = r.next;
          try {
            E();
          } catch (O) {
            throw r ? t() : o = void 0, O;
          }
        }
        o = void 0, y && y.enter();
      }, p || h || v || !m || !g ? C && C.resolve ? (a = C.resolve(void 0), l = a.then, t = function() {
        l.call(a, n);
      }) : t = h ? function() {
        w.nextTick(n);
      } : function() {
        b.call(s, n);
      } : (i = !0, c = g.createTextNode(""), new m(n).observe(c, { characterData: !0 }), t = function() {
        c.data = i = !i;
      })), u.exports = S || function(y) {
        var E = { fn: y, next: void 0 };
        o && (o.next = E), r || (r = E, t()), o = E;
      };
    }, b622: function(u, d, e) {
      var n = e("da84"), r = e("5692"), o = e("5135"), t = e("90e3"), i = e("4930"), c = e("fdbf"), a = r("wks"), l = n.Symbol, s = c ? l : l && l.withoutSetter || t;
      u.exports = function(f) {
        return o(a, f) && (i || typeof a[f] == "string") || (i && o(l, f) ? a[f] = l[f] : a[f] = s("Symbol." + f)), a[f];
      };
    }, b64b: function(u, d, e) {
      var n = e("23e7"), r = e("7b0b"), o = e("df75"), t = e("d039"), i = t(function() {
        o(1);
      });
      n({ target: "Object", stat: !0, forced: i }, { keys: function(c) {
        return o(r(c));
      } });
    }, b680: function(u, d, e) {
      var n = e("23e7"), r = e("a691"), o = e("408a"), t = e("1148"), i = e("d039"), c = 1 .toFixed, a = Math.floor, l = function(h, m, g) {
        return m === 0 ? g : m % 2 === 1 ? l(h, m - 1, g * h) : l(h * h, m / 2, g);
      }, s = function(h) {
        for (var m = 0, g = h; g >= 4096; ) m += 12, g /= 4096;
        for (; g >= 2; ) m += 1, g /= 2;
        return m;
      }, f = function(h, m, g) {
        for (var w = -1, C = g; ++w < 6; ) C += m * h[w], h[w] = C % 1e7, C = a(C / 1e7);
      }, b = function(h, m) {
        for (var g = 6, w = 0; --g >= 0; ) w += h[g], h[g] = a(w / m), w = w % m * 1e7;
      }, p = function(h) {
        for (var m = 6, g = ""; --m >= 0; ) if (g !== "" || m === 0 || h[m] !== 0) {
          var w = String(h[m]);
          g = g === "" ? w : g + t.call("0", 7 - w.length) + w;
        }
        return g;
      }, v = c && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !i(function() {
        c.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(h) {
        var m, g, w, C, k = o(this), S = r(h), y = [0, 0, 0, 0, 0, 0], E = "", O = "0";
        if (S < 0 || S > 20) throw RangeError("Incorrect fraction digits");
        if (k != k) return "NaN";
        if (k <= -1e21 || k >= 1e21) return String(k);
        if (k < 0 && (E = "-", k = -k), k > 1e-21) if (m = s(k * l(2, 69, 1)) - 69, g = m < 0 ? k * l(2, -m, 1) : k / l(2, m, 1), g *= 4503599627370496, m = 52 - m, m > 0) {
          for (f(y, 0, g), w = S; w >= 7; ) f(y, 1e7, 0), w -= 7;
          for (f(y, l(10, w, 1), 0), w = m - 1; w >= 23; ) b(y, 1 << 23), w -= 23;
          b(y, 1 << w), f(y, 1, 1), b(y, 2), O = p(y);
        } else f(y, 0, g), f(y, 1 << -m, 0), O = p(y) + t.call("0", S);
        return S > 0 ? (C = O.length, O = E + (C <= S ? "0." + t.call("0", S - C) + O : O.slice(0, C - S) + "." + O.slice(C - S))) : O = E + O, O;
      } });
    }, b727: function(u, d, e) {
      var n = e("0366"), r = e("44ad"), o = e("7b0b"), t = e("50c4"), i = e("65f0"), c = [].push, a = function(l) {
        var s = l == 1, f = l == 2, b = l == 3, p = l == 4, v = l == 6, h = l == 7, m = l == 5 || v;
        return function(g, w, C, k) {
          for (var S, y, E = o(g), O = r(E), T = n(w, C, 3), _ = t(O.length), D = 0, F = k || i, Y = s ? F(g, _) : f || h ? F(g, 0) : void 0; _ > D; D++) if ((m || D in O) && (S = O[D], y = T(S, D, E), l)) if (s) Y[D] = y;
          else if (y) switch (l) {
            case 3:
              return !0;
            case 5:
              return S;
            case 6:
              return D;
            case 2:
              c.call(Y, S);
          }
          else switch (l) {
            case 4:
              return !1;
            case 7:
              c.call(Y, S);
          }
          return v ? -1 : b || p ? p : Y;
        };
      };
      u.exports = { forEach: a(0), map: a(1), filter: a(2), some: a(3), every: a(4), find: a(5), findIndex: a(6), filterOut: a(7) };
    }, b8d6: function(u, d, e) {
    }, bb2f: function(u, d, e) {
      var n = e("d039");
      u.exports = !n(function() {
        return Object.isExtensible(Object.preventExtensions({}));
      });
    }, bc3a: function(u, d, e) {
      u.exports = e("cee4");
    }, c04e: function(u, d, e) {
      var n = e("861d");
      u.exports = function(r, o) {
        if (!n(r)) return r;
        var t, i;
        if (o && typeof (t = r.toString) == "function" && !n(i = t.call(r)) || typeof (t = r.valueOf) == "function" && !n(i = t.call(r)) || !o && typeof (t = r.toString) == "function" && !n(i = t.call(r))) return i;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(u, d, e) {
      var n = e("c532"), r = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      u.exports = function(o) {
        var t, i, c, a = {};
        return o && n.forEach(o.split(`
`), function(l) {
          if (c = l.indexOf(":"), t = n.trim(l.substr(0, c)).toLowerCase(), i = n.trim(l.substr(c + 1)), t) {
            if (a[t] && r.indexOf(t) >= 0) return;
            a[t] = t === "set-cookie" ? (a[t] ? a[t] : []).concat([i]) : a[t] ? a[t] + ", " + i : i;
          }
        }), a;
      };
    }, c401: function(u, d, e) {
      var n = e("c532");
      u.exports = function(r, o, t) {
        return n.forEach(t, function(i) {
          r = i(r, o);
        }), r;
      };
    }, c430: function(u, d) {
      u.exports = !1;
    }, c532: function(u, d, e) {
      var n = e("1d2b"), r = Object.prototype.toString;
      function o(_) {
        return r.call(_) === "[object Array]";
      }
      function t(_) {
        return typeof _ > "u";
      }
      function i(_) {
        return _ !== null && !t(_) && _.constructor !== null && !t(_.constructor) && typeof _.constructor.isBuffer == "function" && _.constructor.isBuffer(_);
      }
      function c(_) {
        return r.call(_) === "[object ArrayBuffer]";
      }
      function a(_) {
        return typeof FormData < "u" && _ instanceof FormData;
      }
      function l(_) {
        var D;
        return D = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(_) : _ && _.buffer && _.buffer instanceof ArrayBuffer, D;
      }
      function s(_) {
        return typeof _ == "string";
      }
      function f(_) {
        return typeof _ == "number";
      }
      function b(_) {
        return _ !== null && typeof _ == "object";
      }
      function p(_) {
        if (r.call(_) !== "[object Object]") return !1;
        var D = Object.getPrototypeOf(_);
        return D === null || D === Object.prototype;
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
      function g(_) {
        return r.call(_) === "[object Function]";
      }
      function w(_) {
        return b(_) && g(_.pipe);
      }
      function C(_) {
        return typeof URLSearchParams < "u" && _ instanceof URLSearchParams;
      }
      function k(_) {
        return _.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function S() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function y(_, D) {
        if (_ !== null && typeof _ < "u") if (typeof _ != "object" && (_ = [_]), o(_)) for (var F = 0, Y = _.length; F < Y; F++) D.call(null, _[F], F, _);
        else for (var ae in _) Object.prototype.hasOwnProperty.call(_, ae) && D.call(null, _[ae], ae, _);
      }
      function E() {
        var _ = {};
        function D(ae, H) {
          p(_[H]) && p(ae) ? _[H] = E(_[H], ae) : p(ae) ? _[H] = E({}, ae) : o(ae) ? _[H] = ae.slice() : _[H] = ae;
        }
        for (var F = 0, Y = arguments.length; F < Y; F++) y(arguments[F], D);
        return _;
      }
      function O(_, D, F) {
        return y(D, function(Y, ae) {
          _[ae] = F && typeof Y == "function" ? n(Y, F) : Y;
        }), _;
      }
      function T(_) {
        return _.charCodeAt(0) === 65279 && (_ = _.slice(1)), _;
      }
      u.exports = { isArray: o, isArrayBuffer: c, isBuffer: i, isFormData: a, isArrayBufferView: l, isString: s, isNumber: f, isObject: b, isPlainObject: p, isUndefined: t, isDate: v, isFile: h, isBlob: m, isFunction: g, isStream: w, isURLSearchParams: C, isStandardBrowserEnv: S, forEach: y, merge: E, extend: O, trim: k, stripBOM: T };
    }, c6b6: function(u, d) {
      var e = {}.toString;
      u.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(u, d, e) {
      var n = e("da84"), r = e("ce4e"), o = "__core-js_shared__", t = n[o] || r(o, {});
      u.exports = t;
    }, c8af: function(u, d, e) {
      var n = e("c532");
      u.exports = function(r, o) {
        n.forEach(r, function(t, i) {
          i !== o && i.toUpperCase() === o.toUpperCase() && (r[o] = t, delete r[i]);
        });
      };
    }, c8ba: function(u, d) {
      var e;
      e = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        e = e || new Function("return this")();
      } catch {
        typeof window == "object" && (e = window);
      }
      u.exports = e;
    }, ca84: function(u, d, e) {
      var n = e("5135"), r = e("fc6a"), o = e("4d64").indexOf, t = e("d012");
      u.exports = function(i, c) {
        var a, l = r(i), s = 0, f = [];
        for (a in l) !n(t, a) && n(l, a) && f.push(a);
        for (; c.length > s; ) n(l, a = c[s++]) && (~o(f, a) || f.push(a));
        return f;
      };
    }, caad: function(u, d, e) {
      var n = e("23e7"), r = e("4d64").includes, o = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return r(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), o("includes");
    }, cc12: function(u, d, e) {
      var n = e("da84"), r = e("861d"), o = n.document, t = r(o) && r(o.createElement);
      u.exports = function(i) {
        return t ? o.createElement(i) : {};
      };
    }, cdf9: function(u, d, e) {
      var n = e("825a"), r = e("861d"), o = e("f069");
      u.exports = function(t, i) {
        if (n(t), r(i) && i.constructor === t) return i;
        var c = o.f(t), a = c.resolve;
        return a(i), c.promise;
      };
    }, ce4e: function(u, d, e) {
      var n = e("da84"), r = e("9112");
      u.exports = function(o, t) {
        try {
          r(n, o, t);
        } catch {
          n[o] = t;
        }
        return t;
      };
    }, cee4: function(u, d, e) {
      var n = e("c532"), r = e("1d2b"), o = e("0a06"), t = e("4a7b"), i = e("2444");
      function c(l) {
        var s = new o(l), f = r(o.prototype.request, s);
        return n.extend(f, o.prototype, s), n.extend(f, s), f;
      }
      var a = c(i);
      a.Axios = o, a.create = function(l) {
        return c(t(a.defaults, l));
      }, a.Cancel = e("7a77"), a.CancelToken = e("8df4"), a.isCancel = e("2e67"), a.all = function(l) {
        return Promise.all(l);
      }, a.spread = e("0df6"), a.isAxiosError = e("5f02"), u.exports = a, u.exports.default = a;
    }, d012: function(u, d) {
      u.exports = {};
    }, d039: function(u, d) {
      u.exports = function(e) {
        try {
          return !!e();
        } catch {
          return !0;
        }
      };
    }, d066: function(u, d, e) {
      var n = e("428f"), r = e("da84"), o = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      u.exports = function(t, i) {
        return arguments.length < 2 ? o(n[t]) || o(r[t]) : n[t] && n[t][i] || r[t] && r[t][i];
      };
    }, d1e7: function(u, d, e) {
      var n = {}.propertyIsEnumerable, r = Object.getOwnPropertyDescriptor, o = r && !n.call({ 1: 2 }, 1);
      d.f = o ? function(t) {
        var i = r(this, t);
        return !!i && i.enumerable;
      } : n;
    }, d28b: function(u, d, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(u, d, e) {
      var n = e("825a"), r = e("3bbe");
      u.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var o, t = !1, i = {};
        try {
          o = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, o.call(i, []), t = i instanceof Array;
        } catch {
        }
        return function(c, a) {
          return n(c), r(a), t ? o.call(c, a) : c.__proto__ = a, c;
        };
      }() : void 0);
    }, d3b7: function(u, d, e) {
      var n = e("00ee"), r = e("6eeb"), o = e("b041");
      n || r(Object.prototype, "toString", o, { unsafe: !0 });
    }, d40d: function(u, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), i = new r.a({ id: "icon-back", use: "icon-back-usage", viewBox: "0 0 58.6 35.1", content: `<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.6 35.1" id="icon-back">\r
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
      t.a.add(i), d.default = i;
    }, d44e: function(u, d, e) {
      var n = e("9bf2").f, r = e("5135"), o = e("b622"), t = o("toStringTag");
      u.exports = function(i, c, a) {
        i && !r(i = a ? i : i.prototype, t) && n(i, t, { configurable: !0, value: c });
      };
    }, d58f: function(u, d, e) {
      var n = e("1c0b"), r = e("7b0b"), o = e("44ad"), t = e("50c4"), i = function(c) {
        return function(a, l, s, f) {
          n(l);
          var b = r(a), p = o(b), v = t(b.length), h = c ? v - 1 : 0, m = c ? -1 : 1;
          if (s < 2) for (; ; ) {
            if (h in p) {
              f = p[h], h += m;
              break;
            }
            if (h += m, c ? h < 0 : v <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; c ? h >= 0 : v > h; h += m) h in p && (f = l(f, p[h], h, b));
          return f;
        };
      };
      u.exports = { left: i(!1), right: i(!0) };
    }, d69c: function(u, d, e) {
      e.r(d);
      var n = e("e017"), r = e.n(n), o = e("21a1"), t = e.n(o), i = new r.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(i), d.default = i;
    }, d784: function(u, d, e) {
      e("ac1f");
      var n = e("6eeb"), r = e("d039"), o = e("b622"), t = e("9263"), i = e("9112"), c = o("species"), a = !r(function() {
        var p = /./;
        return p.exec = function() {
          var v = [];
          return v.groups = { a: "7" }, v;
        }, "".replace(p, "$<a>") !== "7";
      }), l = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), s = o("replace"), f = function() {
        return !!/./[s] && /./[s]("a", "$0") === "";
      }(), b = !r(function() {
        var p = /(?:)/, v = p.exec;
        p.exec = function() {
          return v.apply(this, arguments);
        };
        var h = "ab".split(p);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      u.exports = function(p, v, h, m) {
        var g = o(p), w = !r(function() {
          var O = {};
          return O[g] = function() {
            return 7;
          }, ""[p](O) != 7;
        }), C = w && !r(function() {
          var O = !1, T = /a/;
          return p === "split" && (T = {}, T.constructor = {}, T.constructor[c] = function() {
            return T;
          }, T.flags = "", T[g] = /./[g]), T.exec = function() {
            return O = !0, null;
          }, T[g](""), !O;
        });
        if (!w || !C || p === "replace" && (!a || !l || f) || p === "split" && !b) {
          var k = /./[g], S = h(g, ""[p], function(O, T, _, D, F) {
            return T.exec === t ? w && !F ? { done: !0, value: k.call(T, _, D) } : { done: !0, value: O.call(_, T, D) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: l, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), y = S[0], E = S[1];
          n(String.prototype, p, y), n(RegExp.prototype, g, v == 2 ? function(O, T) {
            return E.call(O, this, T);
          } : function(O) {
            return E.call(O, this);
          });
        }
        m && i(RegExp.prototype[g], "sham", !0);
      };
    }, d81d: function(u, d, e) {
      var n = e("23e7"), r = e("b727").map, o = e("1dde"), t = o("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(i) {
        return r(this, i, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(u, d, e) {
      u.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(u, d, e) {
      (function(n) {
        var r = function(o) {
          return o && o.Math == Math && o;
        };
        u.exports = r(typeof globalThis == "object" && globalThis) || r(typeof window == "object" && window) || r(typeof self == "object" && self) || r(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(u, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("56ef"), t = e("fc6a"), i = e("06cf"), c = e("8418");
      n({ target: "Object", stat: !0, sham: !r }, { getOwnPropertyDescriptors: function(a) {
        for (var l, s, f = t(a), b = i.f, p = o(f), v = {}, h = 0; p.length > h; ) s = b(f, l = p[h++]), s !== void 0 && c(v, l, s);
        return v;
      } });
    }, ddb0: function(u, d, e) {
      var n = e("da84"), r = e("fdbc"), o = e("e260"), t = e("9112"), i = e("b622"), c = i("iterator"), a = i("toStringTag"), l = o.values;
      for (var s in r) {
        var f = n[s], b = f && f.prototype;
        if (b) {
          if (b[c] !== l) try {
            t(b, c, l);
          } catch {
            b[c] = l;
          }
          if (b[a] || t(b, a, s), r[s]) {
            for (var p in o) if (b[p] !== o[p]) try {
              t(b, p, o[p]);
            } catch {
              b[p] = o[p];
            }
          }
        }
      }
    }, de23: function(u, d, e) {
      e("7305");
    }, df75: function(u, d, e) {
      var n = e("ca84"), r = e("7839");
      u.exports = Object.keys || function(o) {
        return n(o, r);
      };
    }, df7c: function(u, d, e) {
      (function(n) {
        function r(c, a) {
          for (var l = 0, s = c.length - 1; s >= 0; s--) {
            var f = c[s];
            f === "." ? c.splice(s, 1) : f === ".." ? (c.splice(s, 1), l++) : l && (c.splice(s, 1), l--);
          }
          if (a) for (; l--; l) c.unshift("..");
          return c;
        }
        function o(c) {
          typeof c != "string" && (c += "");
          var a, l = 0, s = -1, f = !0;
          for (a = c.length - 1; a >= 0; --a) if (c.charCodeAt(a) === 47) {
            if (!f) {
              l = a + 1;
              break;
            }
          } else s === -1 && (f = !1, s = a + 1);
          return s === -1 ? "" : c.slice(l, s);
        }
        function t(c, a) {
          if (c.filter) return c.filter(a);
          for (var l = [], s = 0; s < c.length; s++) a(c[s], s, c) && l.push(c[s]);
          return l;
        }
        d.resolve = function() {
          for (var c = "", a = !1, l = arguments.length - 1; l >= -1 && !a; l--) {
            var s = l >= 0 ? arguments[l] : n.cwd();
            if (typeof s != "string") throw new TypeError("Arguments to path.resolve must be strings");
            s && (c = s + "/" + c, a = s.charAt(0) === "/");
          }
          return c = r(t(c.split("/"), function(f) {
            return !!f;
          }), !a).join("/"), (a ? "/" : "") + c || ".";
        }, d.normalize = function(c) {
          var a = d.isAbsolute(c), l = i(c, -1) === "/";
          return c = r(t(c.split("/"), function(s) {
            return !!s;
          }), !a).join("/"), c || a || (c = "."), c && l && (c += "/"), (a ? "/" : "") + c;
        }, d.isAbsolute = function(c) {
          return c.charAt(0) === "/";
        }, d.join = function() {
          var c = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(c, function(a, l) {
            if (typeof a != "string") throw new TypeError("Arguments to path.join must be strings");
            return a;
          }).join("/"));
        }, d.relative = function(c, a) {
          function l(m) {
            for (var g = 0; g < m.length && m[g] === ""; g++) ;
            for (var w = m.length - 1; w >= 0 && m[w] === ""; w--) ;
            return g > w ? [] : m.slice(g, w - g + 1);
          }
          c = d.resolve(c).substr(1), a = d.resolve(a).substr(1);
          for (var s = l(c.split("/")), f = l(a.split("/")), b = Math.min(s.length, f.length), p = b, v = 0; v < b; v++) if (s[v] !== f[v]) {
            p = v;
            break;
          }
          var h = [];
          for (v = p; v < s.length; v++) h.push("..");
          return h = h.concat(f.slice(p)), h.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(c) {
          if (typeof c != "string" && (c += ""), c.length === 0) return ".";
          for (var a = c.charCodeAt(0), l = a === 47, s = -1, f = !0, b = c.length - 1; b >= 1; --b) if (a = c.charCodeAt(b), a === 47) {
            if (!f) {
              s = b;
              break;
            }
          } else f = !1;
          return s === -1 ? l ? "/" : "." : l && s === 1 ? "/" : c.slice(0, s);
        }, d.basename = function(c, a) {
          var l = o(c);
          return a && l.substr(-1 * a.length) === a && (l = l.substr(0, l.length - a.length)), l;
        }, d.extname = function(c) {
          typeof c != "string" && (c += "");
          for (var a = -1, l = 0, s = -1, f = !0, b = 0, p = c.length - 1; p >= 0; --p) {
            var v = c.charCodeAt(p);
            if (v !== 47) s === -1 && (f = !1, s = p + 1), v === 46 ? a === -1 ? a = p : b !== 1 && (b = 1) : a !== -1 && (b = -1);
            else if (!f) {
              l = p + 1;
              break;
            }
          }
          return a === -1 || s === -1 || b === 0 || b === 1 && a === s - 1 && a === l + 1 ? "" : c.slice(a, s);
        };
        var i = "ab".substr(-1) === "b" ? function(c, a, l) {
          return c.substr(a, l);
        } : function(c, a, l) {
          return a < 0 && (a = c.length + a), c.substr(a, l);
        };
      }).call(this, e("4362"));
    }, e017: function(u, d, e) {
      (function(n) {
        (function(r, o) {
          u.exports = o();
        })(0, function() {
          var r = function(v) {
            var h = v.id, m = v.viewBox, g = v.content;
            this.id = h, this.viewBox = m, this.content = g;
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
          var i = t(function(v, h) {
            (function(m, g) {
              v.exports = g();
            })(0, function() {
              function m(y) {
                var E = y && typeof y == "object";
                return E && Object.prototype.toString.call(y) !== "[object RegExp]" && Object.prototype.toString.call(y) !== "[object Date]";
              }
              function g(y) {
                return Array.isArray(y) ? [] : {};
              }
              function w(y, E) {
                var O = E && E.clone === !0;
                return O && m(y) ? S(g(y), y, E) : y;
              }
              function C(y, E, O) {
                var T = y.slice();
                return E.forEach(function(_, D) {
                  typeof T[D] > "u" ? T[D] = w(_, O) : m(_) ? T[D] = S(y[D], _, O) : y.indexOf(_) === -1 && T.push(w(_, O));
                }), T;
              }
              function k(y, E, O) {
                var T = {};
                return m(y) && Object.keys(y).forEach(function(_) {
                  T[_] = w(y[_], O);
                }), Object.keys(E).forEach(function(_) {
                  m(E[_]) && y[_] ? T[_] = S(y[_], E[_], O) : T[_] = w(E[_], O);
                }), T;
              }
              function S(y, E, O) {
                var T = Array.isArray(E), _ = O || { arrayMerge: C }, D = _.arrayMerge || C;
                return T ? Array.isArray(y) ? D(y, E, O) : w(E, O) : k(y, E, O);
              }
              return S.all = function(y, E) {
                if (!Array.isArray(y) || y.length < 2) throw new Error("first argument should be an array with at least two elements");
                return y.reduce(function(O, T) {
                  return S(O, T, E);
                });
              }, S;
            });
          }), c = t(function(v, h) {
            var m = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = m, v.exports = h.default;
          }), a = function(v) {
            return Object.keys(v).map(function(h) {
              var m = v[h].toString().replace(/"/g, "&quot;");
              return h + '="' + m + '"';
            }).join(" ");
          }, l = c.svg, s = c.xlink, f = {};
          f[l.name] = l.uri, f[s.name] = s.uri;
          var b = function(v, h) {
            v === void 0 && (v = "");
            var m = i(f, {}), g = a(m);
            return "<svg " + g + ">" + v + "</svg>";
          }, p = function(v) {
            function h() {
              v.apply(this, arguments);
            }
            v && (h.__proto__ = v), h.prototype = Object.create(v && v.prototype), h.prototype.constructor = h;
            var m = { isMounted: {} };
            return m.isMounted.get = function() {
              return !!this.node;
            }, h.createFromExistingNode = function(g) {
              return new h({ id: g.getAttribute("id"), viewBox: g.getAttribute("viewBox"), content: g.outerHTML });
            }, h.prototype.destroy = function() {
              this.isMounted && this.unmount(), v.prototype.destroy.call(this);
            }, h.prototype.mount = function(g) {
              if (this.isMounted) return this.node;
              var w = typeof g == "string" ? document.querySelector(g) : g, C = this.render();
              return this.node = C, w.appendChild(C), C;
            }, h.prototype.render = function() {
              var g = this.stringify();
              return o(b(g)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, m), h;
          }(r);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(u, d, e) {
      var n = e("23e7"), r = e("83ab"), o = e("da84"), t = e("5135"), i = e("861d"), c = e("9bf2").f, a = e("e893"), l = o.Symbol;
      if (r && typeof l == "function" && (!("description" in l.prototype) || l().description !== void 0)) {
        var s = {}, f = function() {
          var m = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), g = this instanceof f ? new l(m) : m === void 0 ? l() : l(m);
          return m === "" && (s[g] = !0), g;
        };
        a(f, l);
        var b = f.prototype = l.prototype;
        b.constructor = f;
        var p = b.toString, v = String(l("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        c(b, "description", { configurable: !0, get: function() {
          var m = i(this) ? this.valueOf() : this, g = p.call(m);
          if (t(s, m)) return "";
          var w = v ? g.slice(7, -1) : g.replace(h, "$1");
          return w === "" ? void 0 : w;
        } }), n({ global: !0, forced: !0 }, { Symbol: f });
      }
    }, e163: function(u, d, e) {
      var n = e("5135"), r = e("7b0b"), o = e("f772"), t = e("e177"), i = o("IE_PROTO"), c = Object.prototype;
      u.exports = t ? Object.getPrototypeOf : function(a) {
        return a = r(a), n(a, i) ? a[i] : typeof a.constructor == "function" && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? c : null;
      };
    }, e177: function(u, d, e) {
      var n = e("d039");
      u.exports = !n(function() {
        function r() {
        }
        return r.prototype.constructor = null, Object.getPrototypeOf(new r()) !== r.prototype;
      });
    }, e260: function(u, d, e) {
      var n = e("fc6a"), r = e("44d2"), o = e("3f8c"), t = e("69f3"), i = e("7dd0"), c = "Array Iterator", a = t.set, l = t.getterFor(c);
      u.exports = i(Array, "Array", function(s, f) {
        a(this, { type: c, target: n(s), index: 0, kind: f });
      }, function() {
        var s = l(this), f = s.target, b = s.kind, p = s.index++;
        return !f || p >= f.length ? (s.target = void 0, { value: void 0, done: !0 }) : b == "keys" ? { value: p, done: !1 } : b == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
      }, "values"), o.Arguments = o.Array, r("keys"), r("values"), r("entries");
    }, e2cc: function(u, d, e) {
      var n = e("6eeb");
      u.exports = function(r, o, t) {
        for (var i in o) n(r, i, o[i], t);
        return r;
      };
    }, e439: function(u, d, e) {
      var n = e("23e7"), r = e("d039"), o = e("fc6a"), t = e("06cf").f, i = e("83ab"), c = r(function() {
        t(1);
      }), a = !i || c;
      n({ target: "Object", stat: !0, forced: a, sham: !i }, { getOwnPropertyDescriptor: function(l, s) {
        return t(o(l), s);
      } });
    }, e538: function(u, d, e) {
      var n = e("b622");
      d.f = n;
    }, e667: function(u, d) {
      u.exports = function(e) {
        try {
          return { error: !1, value: e() };
        } catch (n) {
          return { error: !0, value: n };
        }
      };
    }, e66c: function(u, d, e) {
      e("95d9");
    }, e683: function(u, d, e) {
      u.exports = function(n, r) {
        return r ? n.replace(/\/+$/, "") + "/" + r.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(u, d, e) {
      var n, r, o, t, i = e("23e7"), c = e("c430"), a = e("da84"), l = e("d066"), s = e("fea9"), f = e("6eeb"), b = e("e2cc"), p = e("d44e"), v = e("2626"), h = e("861d"), m = e("1c0b"), g = e("19aa"), w = e("8925"), C = e("2266"), k = e("1c7e"), S = e("4840"), y = e("2cf4").set, E = e("b575"), O = e("cdf9"), T = e("44de"), _ = e("f069"), D = e("e667"), F = e("69f3"), Y = e("94ca"), ae = e("b622"), H = e("605d"), W = e("2d00"), V = ae("species"), A = "Promise", L = F.get, Q = F.set, ne = F.getterFor(A), U = s, xe = a.TypeError, ve = a.document, Ne = a.process, Be = l("fetch"), $e = _.f, Ae = $e, Ee = !!(ve && ve.createEvent && a.dispatchEvent), Fe = typeof PromiseRejectionEvent == "function", Qe = "unhandledrejection", B = "rejectionhandled", $ = 0, X = 1, M = 2, te = 1, ie = 2, we = Y(A, function() {
        var z = w(U) !== String(U);
        if (!z && (W === 66 || !H && !Fe) || c && !U.prototype.finally) return !0;
        if (W >= 51 && /native code/.test(U)) return !1;
        var ue = U.resolve(1), fe = function(q) {
          q(function() {
          }, function() {
          });
        }, he = ue.constructor = {};
        return he[V] = fe, !(ue.then(function() {
        }) instanceof fe);
      }), ge = we || !k(function(z) {
        U.all(z).catch(function() {
        });
      }), ce = function(z) {
        var ue;
        return !(!h(z) || typeof (ue = z.then) != "function") && ue;
      }, J = function(z, ue) {
        if (!z.notified) {
          z.notified = !0;
          var fe = z.reactions;
          E(function() {
            for (var he = z.value, q = z.state == X, oe = 0; fe.length > oe; ) {
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
      }, P = function(z, ue, fe) {
        var he, q;
        Ee ? (he = ve.createEvent("Event"), he.promise = ue, he.reason = fe, he.initEvent(z, !1, !0), a.dispatchEvent(he)) : he = { promise: ue, reason: fe }, !Fe && (q = a["on" + z]) ? q(he) : z === Qe && T("Unhandled promise rejection", fe);
      }, re = function(z) {
        y.call(a, function() {
          var ue, fe = z.facade, he = z.value, q = ke(z);
          if (q && (ue = D(function() {
            H ? Ne.emit("unhandledRejection", he, fe) : P(Qe, fe, he);
          }), z.rejection = H || ke(z) ? ie : te, ue.error)) throw ue.value;
        });
      }, ke = function(z) {
        return z.rejection !== te && !z.parent;
      }, We = function(z) {
        y.call(a, function() {
          var ue = z.facade;
          H ? Ne.emit("rejectionHandled", ue) : P(B, ue, z.value);
        });
      }, Ye = function(z, ue, fe) {
        return function(he) {
          z(ue, he, fe);
        };
      }, Ze = function(z, ue, fe) {
        z.done || (z.done = !0, fe && (z = fe), z.value = ue, z.state = M, J(z, !0));
      }, at = function(z, ue, fe) {
        if (!z.done) {
          z.done = !0, fe && (z = fe);
          try {
            if (z.facade === ue) throw xe("Promise can't be resolved itself");
            var he = ce(ue);
            he ? E(function() {
              var q = { done: !1 };
              try {
                he.call(ue, Ye(at, q, z), Ye(Ze, q, z));
              } catch (oe) {
                Ze(q, oe, z);
              }
            }) : (z.value = ue, z.state = X, J(z, !1));
          } catch (q) {
            Ze({ done: !1 }, q, z);
          }
        }
      };
      we && (U = function(z) {
        g(this, U, A), m(z), n.call(this);
        var ue = L(this);
        try {
          z(Ye(at, ue), Ye(Ze, ue));
        } catch (fe) {
          Ze(ue, fe);
        }
      }, n = function(z) {
        Q(this, { type: A, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: $, value: void 0 });
      }, n.prototype = b(U.prototype, { then: function(z, ue) {
        var fe = ne(this), he = $e(S(this, U));
        return he.ok = typeof z != "function" || z, he.fail = typeof ue == "function" && ue, he.domain = H ? Ne.domain : void 0, fe.parent = !0, fe.reactions.push(he), fe.state != $ && J(fe, !1), he.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), r = function() {
        var z = new n(), ue = L(z);
        this.promise = z, this.resolve = Ye(at, ue), this.reject = Ye(Ze, ue);
      }, _.f = $e = function(z) {
        return z === U || z === o ? new r(z) : Ae(z);
      }, c || typeof s != "function" || (t = s.prototype.then, f(s.prototype, "then", function(z, ue) {
        var fe = this;
        return new U(function(he, q) {
          t.call(fe, he, q);
        }).then(z, ue);
      }, { unsafe: !0 }), typeof Be == "function" && i({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return O(U, Be.apply(a, arguments));
      } }))), i({ global: !0, wrap: !0, forced: we }, { Promise: U }), p(U, A, !1, !0), v(A), o = l(A), i({ target: A, stat: !0, forced: we }, { reject: function(z) {
        var ue = $e(this);
        return ue.reject.call(void 0, z), ue.promise;
      } }), i({ target: A, stat: !0, forced: c || we }, { resolve: function(z) {
        return O(c && this === o ? U : this, z);
      } }), i({ target: A, stat: !0, forced: ge }, { all: function(z) {
        var ue = this, fe = $e(ue), he = fe.resolve, q = fe.reject, oe = D(function() {
          var le = m(ue.resolve), me = [], Ue = 0, qe = 1;
          C(z, function(et) {
            var Oe = Ue++, tt = !1;
            me.push(void 0), qe++, le.call(ue, et).then(function(He) {
              tt || (tt = !0, me[Oe] = He, --qe || he(me));
            }, q);
          }), --qe || he(me);
        });
        return oe.error && q(oe.value), fe.promise;
      }, race: function(z) {
        var ue = this, fe = $e(ue), he = fe.reject, q = D(function() {
          var oe = m(ue.resolve);
          C(z, function(le) {
            oe.call(ue, le).then(fe.resolve, he);
          });
        });
        return q.error && he(q.value), fe.promise;
      } });
    }, e893: function(u, d, e) {
      var n = e("5135"), r = e("56ef"), o = e("06cf"), t = e("9bf2");
      u.exports = function(i, c) {
        for (var a = r(c), l = t.f, s = o.f, f = 0; f < a.length; f++) {
          var b = a[f];
          n(i, b) || l(i, b, s(c, b));
        }
      };
    }, e8b5: function(u, d, e) {
      var n = e("c6b6");
      u.exports = Array.isArray || function(r) {
        return n(r) == "Array";
      };
    }, e95a: function(u, d, e) {
      var n = e("b622"), r = e("3f8c"), o = n("iterator"), t = Array.prototype;
      u.exports = function(i) {
        return i !== void 0 && (r.Array === i || t[o] === i);
      };
    }, ec57: function(u, d, e) {
      var n = { "./back.svg": "d40d", "./close.svg": "4f43", "./delete.svg": "d69c", "./drag.svg": "7eb5", "./handwrite.svg": "545a", "./upper.svg": "6d55" };
      function r(t) {
        var i = o(t);
        return e(i);
      }
      function o(t) {
        if (!e.o(n, t)) {
          var i = new Error("Cannot find module '" + t + "'");
          throw i.code = "MODULE_NOT_FOUND", i;
        }
        return n[t];
      }
      r.keys = function() {
        return Object.keys(n);
      }, r.resolve = o, u.exports = r, r.id = "ec57";
    }, f069: function(u, d, e) {
      var n = e("1c0b"), r = function(o) {
        var t, i;
        this.promise = new o(function(c, a) {
          if (t !== void 0 || i !== void 0) throw TypeError("Bad Promise constructor");
          t = c, i = a;
        }), this.resolve = n(t), this.reject = n(i);
      };
      u.exports.f = function(o) {
        return new r(o);
      };
    }, f183: function(u, d, e) {
      var n = e("d012"), r = e("861d"), o = e("5135"), t = e("9bf2").f, i = e("90e3"), c = e("bb2f"), a = i("meta"), l = 0, s = Object.isExtensible || function() {
        return !0;
      }, f = function(m) {
        t(m, a, { value: { objectID: "O" + ++l, weakData: {} } });
      }, b = function(m, g) {
        if (!r(m)) return typeof m == "symbol" ? m : (typeof m == "string" ? "S" : "P") + m;
        if (!o(m, a)) {
          if (!s(m)) return "F";
          if (!g) return "E";
          f(m);
        }
        return m[a].objectID;
      }, p = function(m, g) {
        if (!o(m, a)) {
          if (!s(m)) return !0;
          if (!g) return !1;
          f(m);
        }
        return m[a].weakData;
      }, v = function(m) {
        return c && h.REQUIRED && s(m) && !o(m, a) && f(m), m;
      }, h = u.exports = { REQUIRED: !1, fastKey: b, getWeakData: p, onFreeze: v };
      n[a] = !0;
    }, f5df: function(u, d, e) {
      var n = e("00ee"), r = e("c6b6"), o = e("b622"), t = o("toStringTag"), i = r(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", c = function(a, l) {
        try {
          return a[l];
        } catch {
        }
      };
      u.exports = n ? r : function(a) {
        var l, s, f;
        return a === void 0 ? "Undefined" : a === null ? "Null" : typeof (s = c(l = Object(a), t)) == "string" ? s : i ? r(l) : (f = r(l)) == "Object" && typeof l.callee == "function" ? "Arguments" : f;
      };
    }, f6b4: function(u, d, e) {
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
      }, u.exports = r;
    }, f772: function(u, d, e) {
      var n = e("5692"), r = e("90e3"), o = n("keys");
      u.exports = function(t) {
        return o[t] || (o[t] = r(t));
      };
    }, f8b0: function(u, d, e) {
      e("b8d6");
    }, fb15: function(u, d, e) {
      if (e.r(d), typeof window < "u") {
        var n = window.document.currentScript, r = e("8875");
        n = r(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: r });
        var o = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        o && (e.p = o[1]);
      }
      e("b0c0");
      var t = e("8bbf"), i = { class: "key-board-container" }, c = { class: "key-board-area" };
      function a(x, R, N, I, K, se) {
        var pe = Object(t.resolveComponent)("Result"), de = Object(t.resolveComponent)("DefaultBoard"), ye = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), Me = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: R[1] || (R[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", i, [Object(t.createVNode)(pe, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(de, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ye, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[Me]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function l(x, R, N) {
        return R in x ? Object.defineProperty(x, R, { value: N, enumerable: !0, configurable: !0, writable: !0 }) : x[R] = N, x;
      }
      function s(x, R) {
        var N = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var I = Object.getOwnPropertySymbols(x);
          R && (I = I.filter(function(K) {
            return Object.getOwnPropertyDescriptor(x, K).enumerable;
          })), N.push.apply(N, I);
        }
        return N;
      }
      function f(x) {
        for (var R = 1; R < arguments.length; R++) {
          var N = arguments[R] != null ? arguments[R] : {};
          R % 2 ? s(Object(N), !0).forEach(function(I) {
            l(x, I, N[I]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(N)) : s(Object(N)).forEach(function(I) {
            Object.defineProperty(x, I, Object.getOwnPropertyDescriptor(N, I));
          });
        }
        return x;
      }
      function b(x, R) {
        (R == null || R > x.length) && (R = x.length);
        for (var N = 0, I = new Array(R); N < R; N++) I[N] = x[N];
        return I;
      }
      function p(x) {
        if (Array.isArray(x)) return b(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function h(x, R) {
        if (x) {
          if (typeof x == "string") return b(x, R);
          var N = Object.prototype.toString.call(x).slice(8, -1);
          return N === "Object" && x.constructor && (N = x.constructor.name), N === "Map" || N === "Set" ? Array.from(x) : N === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(N) ? b(x, R) : void 0;
        }
      }
      function m() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function g(x) {
        return p(x) || v(x) || h(x) || m();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function w(x, R) {
        if (!(x instanceof R)) throw new TypeError("Cannot call a class as a function");
      }
      function C(x, R) {
        for (var N = 0; N < R.length; N++) {
          var I = R[N];
          I.enumerable = I.enumerable || !1, I.configurable = !0, "value" in I && (I.writable = !0), Object.defineProperty(x, I.key, I);
        }
      }
      function k(x, R, N) {
        return R && C(x.prototype, R), x;
      }
      var S = function() {
        function x() {
          w(this, x), this.listeners = {};
        }
        return k(x, [{ key: "on", value: function(R, N) {
          var I = this, K = this.listeners[R];
          return K || (K = []), K.push(N), this.listeners[R] = K, function() {
            I.remove(R, N);
          };
        } }, { key: "emit", value: function(R) {
          var N = this.listeners[R];
          if (Array.isArray(N)) {
            for (var I = arguments.length, K = new Array(I > 1 ? I - 1 : 0), se = 1; se < I; se++) K[se - 1] = arguments[se];
            for (var pe = 0; pe < N.length; pe++) {
              var de = N[pe];
              typeof de == "function" && de.apply(void 0, K);
            }
          }
        } }, { key: "remove", value: function(R, N) {
          if (N) {
            var I = this.listeners[R];
            if (!I) return;
            I = I.filter(function(K) {
              return K !== N;
            }), this.listeners[R] = I;
          } else this.listeners[R] = null, delete this.listeners[R];
        } }]), x;
      }(), y = new S(), E = { mounted: function(x, R, N) {
        var I = x.parentNode;
        x.onmousedown = function(K) {
          var se = K.clientX - I.offsetLeft, pe = K.clientY - I.offsetTop;
          document.onmousemove = function(de) {
            var ye = de.clientX - se, Re = de.clientY - pe;
            I.style.left = ye + "px", I.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(K) {
          var se = K.touches[0].pageX, pe = K.touches[0].pageY, de = se - I.offsetLeft, ye = pe - I.offsetTop;
          document.ontouchmove = function(Re) {
            var Me = Re.touches[0].pageX, Ve = Re.touches[0].pageY, ze = Me - de, pt = Ve - ye;
            I.style.left = ze + "px", I.style.top = pt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              y.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, O = E, T = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var _ = { key: 0, class: "key-board-code-show" }, D = { class: "key-board-result-show" }, F = { class: "key-board-result-show-container" }, Y = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ae = T(function(x, R, N, I, K, se) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", _, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", D, [Object(t.createVNode)("div", F, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(pe, de) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: de, onClick: function(ye) {
            return x.selectWord(pe);
          } }, Object(t.toDisplayString)(de + 1) + "." + Object(t.toDisplayString)(pe), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", Y, [Object(t.createVNode)("span", { style: x.getStyle, onClick: R[1] || (R[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: R[2] || (R[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), H = (e("1276"), e("6062"), e("5319"), function(x, R) {
        for (var N = 0, I = []; N < x.length; ) I.push(x.slice(N, N += R));
        return I;
      }), W = Symbol("KEYBOARD_CONTEXT"), V = function(x) {
        Object(t.provide)(W, x);
      }, A = function() {
        return Object(t.inject)(W);
      }, L = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, R) {
        var N = R.emit, I = A(), K = Object(t.computed)(function() {
          return { borderTopColor: I == null ? void 0 : I.color };
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
        function Re(Me) {
          ye(), N("change", Me);
        }
        return Object(t.watch)(function() {
          return x.data;
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
        }), f({ color: I == null ? void 0 : I.color, upper: pe, lower: de, getStyle: K, selectWord: Re }, Object(t.toRefs)(se));
      } });
      e("e66c"), L.render = ae, L.__scopeId = "data-v-02e63132";
      var Q = L, ne = e("bc3a"), U = e.n(ne), xe = 15e3, ve = function(x) {
        U.a.defaults.baseURL = x, U.a.defaults.timeout = xe, U.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Ne(x, R, N, I, K, se) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Be = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var R = A(), N = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: R == null ? void 0 : R.color, iconName: N };
      } });
      e("38cd"), Be.render = Ne;
      var $e = Be, Ae = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Ee = { class: "hand-write-board" }, Fe = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var Qe = Ae(function(x, R, N, I, K, se) {
        var pe = Object(t.resolveComponent)("PaintBoard"), de = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ee, [Object(t.createVNode)(pe, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Fe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(ye) {
          return Object(t.openBlock)(), Object(t.createBlock)(de, { key: ye.type, type: ye.type, data: ye.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), B = { class: "paint-board" };
      function $(x, R, N, I, K, se) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", B, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: R[1] || (R[1] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onTouchmove: R[2] || (R[2] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onTouchend: R[3] || (R[3] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMousedown: R[4] || (R[4] = function() {
          return x.down && x.down.apply(x, arguments);
        }), onMousemove: R[5] || (R[5] = function() {
          return x.move && x.move.apply(x, arguments);
        }), onMouseup: R[6] || (R[6] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }), onMouseleave: R[7] || (R[7] = function() {
          return x.mouseup && x.mouseup.apply(x, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function X(x, R, N, I, K, se, pe) {
        try {
          var de = x[se](pe), ye = de.value;
        } catch (Re) {
          return void N(Re);
        }
        de.done ? R(ye) : Promise.resolve(ye).then(I, K);
      }
      function M(x) {
        return function() {
          var R = this, N = arguments;
          return new Promise(function(I, K) {
            var se = x.apply(R, N);
            function pe(ye) {
              X(se, I, K, pe, de, "next", ye);
            }
            function de(ye) {
              X(se, I, K, pe, de, "throw", ye);
            }
            pe(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var te, ie, we = function() {
        var x = M(regeneratorRuntime.mark(function R(N, I, K, se) {
          return regeneratorRuntime.wrap(function(pe) {
            for (; ; ) switch (pe.prev = pe.next) {
              case 0:
                return pe.next = 2, U.a.post("", { lib: se, lpXis: N, lpYis: I, lpCis: K });
              case 2:
                return pe.abrupt("return", pe.sent);
              case 3:
              case "end":
                return pe.stop();
            }
          }, R);
        }));
        return function(R, N, I, K) {
          return x.apply(this, arguments);
        };
      }(), ge = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var R = A(), N = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), I = Object(t.ref)(null);
        function K() {
          return se.apply(this, arguments);
        }
        function se() {
          return se = M(regeneratorRuntime.mark(function Le() {
            var Ke, De;
            return regeneratorRuntime.wrap(function(Xe) {
              for (; ; ) switch (Xe.prev = Xe.next) {
                case 0:
                  return Xe.next = 2, we(N.clickX, N.clickY, N.clickC, x.lib);
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
          I.value && te && (N.clickX = [], N.clickY = [], N.clickC = [], te.clearRect(0, 0, N.width, N.height));
        }
        function de(Le) {
          if (Le.type.includes("mouse")) {
            var Ke = Le;
            return Math.floor(Ke.clientX - N.x);
          }
          if (Le.type.includes("touch")) {
            var De, Xe = Le;
            return Math.floor(((De = Xe.targetTouches[0]) === null || De === void 0 ? void 0 : De.clientX) - N.x);
          }
          return 0;
        }
        function ye(Le) {
          if (Le.type.includes("mouse")) {
            var Ke = Le;
            return Math.floor(Ke.clientY - N.y);
          }
          if (Le.type.includes("touch")) {
            var De, Xe = Le;
            return Math.floor(((De = Xe.targetTouches[0]) === null || De === void 0 ? void 0 : De.clientY) - N.y);
          }
          return 0;
        }
        function Re(Le) {
          if (te) {
            N.isMouseDown = !0;
            var Ke = de(Le), De = ye(Le);
            clearTimeout(ie), N.oldX = Ke, N.oldY = De, te.beginPath();
          }
        }
        function Me(Le) {
          if (te && (Le.preventDefault(), N.isMouseDown)) {
            var Ke = de(Le), De = ye(Le);
            N.clickX.push(Ke), N.clickY.push(De), N.clickC.push(0), te.strokeStyle = R == null ? void 0 : R.color, te.fillStyle = R == null ? void 0 : R.color, te.lineWidth = 4, te.lineCap = "round", te.moveTo(N.oldX, N.oldY), te.lineTo(Ke, De), te.stroke(), N.oldX = Ke, N.oldY = De;
          }
        }
        function Ve() {
          N.isMouseDown && (N.isMouseDown = !1, ie = setTimeout(function() {
            pe();
          }, 1500), N.clickC.pop(), N.clickC.push(1), K());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Le = document.querySelector(".paint-board").getBoundingClientRect();
              N.x = Le.x, N.y = Le.y, N.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), N.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function pt() {
          var Le;
          te = (Le = I.value) === null || Le === void 0 ? void 0 : Le.getContext("2d"), pe(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          pt(), y.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), y.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(N)), {}, { move: Me, down: Re, mouseup: Ve, canvasRef: I });
      } });
      ge.render = $;
      var ce = ge;
      function J(x, R, N, I, K, se) {
        var pe = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: R[1] || (R[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: R[2] || (R[2] = function(de) {
          return x.isHoverStatus = !0;
        }), onMouseleave: R[3] || (R[3] = function(de) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(pe, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var P = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: $e }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, R) {
        var N = R.emit, I = A(), K = Object(t.ref)(!1), se = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), pe = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || K.value ? { color: "#f5f5f5", background: I == null ? void 0 : I.color } : { color: I == null ? void 0 : I.color, background: "#f5f5f5" };
        });
        function de(ye) {
          ye.preventDefault(), N("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: K, getStyle: pe, getCode: se, click: de };
      } });
      e("de23"), P.render = J;
      var re = P, ke = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: ce, KeyCodeButton: re }, setup: function(x, R) {
        var N = R.emit, I = A(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function se(pe) {
          var de = pe.data, ye = pe.type;
          switch (ye) {
            case "close":
              I == null || I.closeKeyBoard();
              break;
            case "back":
              I == null || I.changeDefaultBoard(), y.emit("resultReset"), y.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              N("trigger", { data: de, type: ye });
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
      var z = Ye(function(x, R, N, I, K, se) {
        var pe = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ze, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(de, ye) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ye + 1)], key: ye }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(de, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(pe, { isUpper: x.isUpper, key: Re, type: Re, data: Re, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", at, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(de) {
          return Object(t.openBlock)(), Object(t.createBlock)(pe, { key: de.type, type: de.type, data: de.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ue = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), fe = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, he = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, q = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], oe = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: re }, emits: ["translate", "trigger", "change"], setup: function(x, R) {
        var N = R.emit, I = A(), K = Object(t.reactive)({ lineList: [fe.line1, fe.line2, fe.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function se() {
          var de;
          K.line4 = JSON.parse(JSON.stringify(q)), I != null && (de = I.modeList) !== null && de !== void 0 && de.find(function(ye) {
            return ye === "handwrite";
          }) && I !== null && I !== void 0 && I.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function pe(de) {
          var ye = de.data, Re = de.type;
          switch (Re) {
            case "close":
              K.oldVal = "", I == null || I.closeKeyBoard();
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
                I != null && (Me = I.modeList) !== null && Me !== void 0 && Me.find(function(ze) {
                  return ze === "symbol";
                }) || (Ve.shift(), Ve.unshift("+")), K.lineList = [he.line1, he.line2, Ve];
              } else y.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [fe.line1, fe.line2, fe.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (y.emit("keyBoardChange", "symbol"), K.lineList = [ue.line1, ue.line2, ue.line3]) : (y.emit("keyBoardChange", "number"), K.lineList = [he.line1, he.line2, he.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && Re === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), N("translate", K.oldVal)) : (Re === "handwrite" && y.emit("keyBoardChange", "handwrite"), N("trigger", { data: ye, type: Re }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? N("change", ye) : (N("translate", K.oldVal + ye), K.oldVal = K.oldVal + ye);
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
      var le = oe, me = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ue = e("ec57"), qe = function(x) {
        return x.keys().map(x);
      };
      qe(Ue);
      var et = [], Oe = null, tt = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: O }, components: { Result: Q, SvgIcon: $e, HandBoard: We, DefaultBoard: le }, setup: function(x, R) {
        var N = R.emit, I = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function se(je) {
          var Ce, Ie;
          switch (Object(t.nextTick)(function() {
            y.emit("keyBoardChange", "CN");
          }), je) {
            case "en":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Pe;
                (Pe = K.value) === null || Pe === void 0 || Pe.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              I.showMode = "default", Object(t.nextTick)(function() {
                var Pe;
                (Pe = K.value) === null || Pe === void 0 || Pe.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Ce = x.modeList) !== null && Ce !== void 0 && Ce.find(function(Pe) {
                return Pe === "handwrite";
              }) && x.handApi ? (I.showMode = "handwrite", Object(t.nextTick)(function() {
                y.emit("keyBoardChange", "handwrite");
              })) : I.showMode = "default";
              break;
            case "symbol":
              I.showMode = "default", (Ie = x.modeList) !== null && Ie !== void 0 && Ie.find(function(Pe) {
                return Pe === "symbol";
              }) && Object(t.nextTick)(function() {
                var Pe, nt;
                (Pe = K.value) === null || Pe === void 0 || Pe.click({ data: ".?123", type: "change2num" }), (nt = K.value) === null || nt === void 0 || nt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              I.showMode = "default";
              break;
          }
        }
        function pe(je) {
          if (I.visible = !0, Oe = je.target, se(Oe.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Ce = document.querySelector(".key-board-modal");
            Ce.style.display = "block";
          }
        }
        function de() {
          if (Oe && Oe.blur(), Oe = null, I.visible = !1, N("closed"), I.showMode = "default", I.resultVal = {}, document.querySelector(".key-board-modal")) {
            var je = document.querySelector(".key-board-modal");
            je.style.display = "none";
          }
        }
        function ye() {
          x.closeOnClickModal && de(), N("modalClick");
        }
        function Re() {
          var je;
          if (document.querySelector(".key-board-modal")) {
            var Ce;
            (Ce = document.querySelector(".key-board-modal")) === null || Ce === void 0 || Ce.addEventListener("click", ye);
          } else {
            var Ie = document.createElement("div");
            Ie.className = "key-board-modal", Ie.style.display = "none", (je = document.querySelector("body")) === null || je === void 0 || je.appendChild(Ie), Ie.addEventListener("click", ye);
          }
        }
        function Me() {
          x.handApi && ve(x.handApi), [].concat(g(document.querySelectorAll("input")), g(document.querySelectorAll("textarea"))).forEach(function(je) {
            je.getAttribute("data-mode") !== null && (et.push(je), je.addEventListener("focus", pe), x.blurHide && je.addEventListener("blur", de));
          });
        }
        function Ve(je) {
          if (!Oe) return "";
          var Ce = Oe, Ie = Ce.selectionStart, Pe = Ce.selectionEnd;
          if (!Ie || !Pe) return "";
          var nt = je.substring(0, Ie - 1) + je.substring(Pe);
          return Ce.value = nt, Ce.focus(), Ce.selectionStart = Ie - 1, Ce.selectionEnd = Ie - 1, nt;
        }
        function ze(je) {
          var Ce = je.type;
          switch (Ce) {
            case "handwrite":
              I.showMode = "handwrite";
              break;
            case "delete":
              if (!Oe) return;
              var Ie = Ve(Oe.value);
              Oe.value = Ie, N("change", Ie, Oe.getAttribute("data-prop") || Oe);
              break;
          }
        }
        function pt(je, Ce) {
          if (!Oe) return "";
          var Ie = Oe, Pe = Ie.selectionStart || 0, nt = Ie.selectionEnd || 0, kt = je.substring(0, Pe) + Ce + je.substring(nt);
          return Ie.value = kt, Ie.focus(), Ie.selectionStart = Pe + Ce.length, Ie.selectionEnd = Pe + Ce.length, kt;
        }
        function Le(je) {
          if (Oe) {
            var Ce = pt(Oe.value, je);
            Oe.value = Ce, N("change", Ce, Oe.getAttribute("data-prop") || Oe), N("keyChange", je, Oe.getAttribute("data-prop") || Oe);
          }
        }
        function Ke(je) {
          var Ce = new RegExp("^".concat(je, "\\w*")), Ie = Object.keys(me).filter(function(Pe) {
            return Ce.test(Pe);
          }).sort();
          I.resultVal = { code: je, value: je ? Ie.length > 1 ? Ie.reduce(function(Pe, nt) {
            return Pe + me[nt];
          }, "") : me[Ie[0]] : "" }, Oe && N("keyChange", je, Oe.getAttribute("data-prop") || Oe);
        }
        function De() {
          Me();
        }
        function Xe() {
          return Oe;
        }
        return Object(t.onMounted)(function() {
          x.modal && Re(), Me(), y.on("resultReset", function() {
            I.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var je;
          (je = document.querySelector(".key-board-modal")) === null || je === void 0 || je.removeEventListener("click", ye), et.forEach(function(Ce) {
            Ce.removeEventListener("focus", pe), Ce.removeEventListener("blur", de);
          });
        }), V(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          de();
        }, changeDefaultBoard: function() {
          I.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(I)), {}, { defaultBoardRef: K, getCurrentInput: Xe, translate: Ke, reSignUp: De, trigger: ze, change: Le });
      } });
      tt.render = a;
      var He = tt;
      He.install = function(x) {
        x.component(He.name, He);
      };
      var gt = He, It = gt;
      d.default = It;
    }, fb6a: function(u, d, e) {
      var n = e("23e7"), r = e("861d"), o = e("e8b5"), t = e("23cb"), i = e("50c4"), c = e("fc6a"), a = e("8418"), l = e("b622"), s = e("1dde"), f = s("slice"), b = l("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(h, m) {
        var g, w, C, k = c(this), S = i(k.length), y = t(h, S), E = t(m === void 0 ? S : m, S);
        if (o(k) && (g = k.constructor, typeof g != "function" || g !== Array && !o(g.prototype) ? r(g) && (g = g[b], g === null && (g = void 0)) : g = void 0, g === Array || g === void 0)) return p.call(k, y, E);
        for (w = new (g === void 0 ? Array : g)(v(E - y, 0)), C = 0; y < E; y++, C++) y in k && a(w, C, k[y]);
        return w.length = C, w;
      } });
    }, fc6a: function(u, d, e) {
      var n = e("44ad"), r = e("1d80");
      u.exports = function(o) {
        return n(r(o));
      };
    }, fdbc: function(u, d) {
      u.exports = { CSSRuleList: 0, CSSStyleDeclaration: 0, CSSValueList: 0, ClientRectList: 0, DOMRectList: 0, DOMStringList: 0, DOMTokenList: 1, DataTransferItemList: 0, FileList: 0, HTMLAllCollection: 0, HTMLCollection: 0, HTMLFormElement: 0, HTMLSelectElement: 0, MediaList: 0, MimeTypeArray: 0, NamedNodeMap: 0, NodeList: 1, PaintRequestList: 0, Plugin: 0, PluginArray: 0, SVGLengthList: 0, SVGNumberList: 0, SVGPathSegList: 0, SVGPointList: 0, SVGStringList: 0, SVGTransformList: 0, SourceBufferList: 0, StyleSheetList: 0, TextTrackCueList: 0, TextTrackList: 0, TouchList: 0 };
    }, fdbf: function(u, d, e) {
      var n = e("4930");
      u.exports = n && !Symbol.sham && typeof Symbol.iterator == "symbol";
    }, fea9: function(u, d, e) {
      var n = e("da84");
      u.exports = n.Promise;
    } });
  });
})(At);
var Or = At.exports;
const Lt = /* @__PURE__ */ Sr(Or);
Pt({
  components: { KeyBoard: Lt },
  setup() {
    function be(Z, ee) {
      console.log("change value ---->", Z), console.log("change input dom ---->", ee);
    }
    return {
      change: be
    };
  }
});
const jr = { class: "wifi-component" }, Er = { class: "row" }, Cr = { class: "column" }, Tr = { class: "column" }, Ar = { class: "status" }, Lr = { class: "row" }, Ir = { class: "column" }, Nr = {
  key: 0,
  class: "wifi-modal"
}, Pr = { class: "wifi-modal-content" }, Br = { class: "wifi-list" }, $r = {
  key: 0,
  class: "no-wifi"
}, Rr = ["onClick"], Ur = { class: "wifi-ssid" }, Mr = { class: "signal-strength" }, Dr = {
  __name: "WiFi",
  setup(be) {
    const { sendToPyQt: Z } = Je(), ee = G("未连接"), u = G("无网络"), d = G("未知"), e = G(""), n = G(""), r = G(!1), o = G([]), t = G(null), i = () => {
      Z("check_wifi_status", {});
    }, c = () => {
      t.value = setInterval(i, 5e3);
    }, a = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    ft(() => {
      c();
      const { message: h } = Je();
      rt(h, (m) => {
        if (m && m.type === "wifi_list") {
          const g = JSON.parse(m.content);
          o.value = g;
        } else if (m && m.type === "wifi_status") {
          const g = JSON.parse(m.content);
          ee.value = g.wifi_name, u.value = g.internet_status, d.value = g.zerotier_ip;
        }
      });
    }), xt(() => {
      a();
    });
    const l = async () => {
      r.value = !0, o.value = [], document.body.style.overflow = "hidden", s();
    }, s = () => {
      o.value = [], Z("search_wifi", {});
    }, f = () => {
      r.value = !1, document.body.style.overflow = "auto";
    }, b = (h) => {
      e.value = h.ssid, f();
    }, p = () => {
      Z("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, v = (h, m) => {
      m.placeholder === "WiFi 名称" ? e.value = h : m.placeholder === "WiFi 密码" && (n.value = h);
    };
    return (h, m) => (_e(), Se("div", jr, [
      j("div", Er, [
        j("div", Cr, [
          lt(j("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (g) => e.value = g),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [vt, e.value]
          ])
        ]),
        j("div", Tr, [
          j("div", Ar, [
            dt(" WiFi: " + Te(ee.value) + " | 网络: " + Te(u.value) + " ", 1),
            m[2] || (m[2] = j("br", null, null, -1)),
            dt(" zerotier ip地址: " + Te(d.value), 1)
          ])
        ])
      ]),
      j("div", Lr, [
        j("div", Ir, [
          lt(j("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (g) => n.value = g),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [vt, n.value]
          ])
        ]),
        j("div", { class: "column" }, [
          j("div", { class: "button-group" }, [
            j("button", { onClick: l }, "搜索可用 WiFi"),
            j("button", { onClick: p }, "连接 WiFi")
          ])
        ])
      ]),
      Ge(Bt(Lt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: v,
        class: "scaled-keyboard"
      }),
      r.value ? (_e(), Se("div", Nr, [
        j("div", Pr, [
          m[4] || (m[4] = j("h2", null, "可用的WiFi网络", -1)),
          j("div", Br, [
            o.value.length === 0 ? (_e(), Se("div", $r, m[3] || (m[3] = [
              j("div", { class: "loading-spinner" }, null, -1),
              j("div", null, "搜索中...", -1)
            ]))) : (_e(!0), Se(ot, { key: 1 }, it(o.value, (g) => (_e(), Se("div", {
              key: g.ssid,
              class: "wifi-item",
              onClick: (w) => b(g)
            }, [
              j("span", Ur, Te(g.ssid), 1),
              j("span", Mr, "信号强度: " + Te(g.signal), 1)
            ], 8, Rr))), 128))
          ]),
          j("div", { class: "modal-buttons" }, [
            j("button", { onClick: s }, "重新搜索"),
            j("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : ut("", !0)
    ]));
  }
}, Fr = /* @__PURE__ */ st(Dr, [["__scopeId", "data-v-e6b1dc64"]]), Vr = {
  key: 0,
  class: "numeric-keyboard"
}, Wr = { class: "keyboard" }, qr = { class: "current-value" }, zr = ["onClick"], Kr = {
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
    const ee = be, u = Z, d = G([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = G("");
    rt(() => ee.showKeyboard, (r) => {
      r && (e.value = ee.modelValue.toString());
    });
    const n = (r) => {
      r === "清除" ? e.value = "" : r === "确定" ? (u("update:modelValue", e.value), u("update:showKeyboard", !1)) : e.value += r;
    };
    return (r, o) => be.showKeyboard ? (_e(), Se("div", Vr, [
      j("div", Wr, [
        j("div", qr, Te(e.value), 1),
        (_e(!0), Se(ot, null, it(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ot, null, it(t, (i) => (_e(), Se("button", {
            key: i,
            onClick: (c) => n(i),
            class: ct({ "function-key": i === "清除" || i === "确定" })
          }, Te(i), 11, zr))), 128))
        ]))), 128))
      ])
    ])) : ut("", !0);
  }
}, St = /* @__PURE__ */ st(Kr, [["__scopeId", "data-v-2ccc1cb7"]]), Qr = { class: "container" }, Hr = { class: "column" }, Gr = { class: "status-bar" }, Jr = ["disabled"], Yr = { class: "column" }, Xr = {
  key: 0,
  class: "modal"
}, Zr = { class: "modal-content" }, eo = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(be, { emit: Z }) {
    const { sendToPyQt: ee } = Je(), u = mt({
      isPyQtWebEngine: !1
    }), d = G("未激活"), e = G(0), n = G(""), r = G(""), o = G(!1), t = G(7776e3);
    let i, c;
    const a = G(0), l = G(1), s = G(null), f = G(!1), b = G(!1), p = ht(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${l.value} 次锁定 - 剩余时间: ${v.value}`), v = ht(() => {
      const H = Math.floor(e.value / 86400), W = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), V = Math.floor(e.value % (60 * 60) / 60), A = e.value % 60;
      return `${H}天 ${W.toString().padStart(2, "0")}:${V.toString().padStart(2, "0")}:${A.toString().padStart(2, "0")}`;
    }), h = ht(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function m(H) {
      d.value === "未激活" && (H.target.setPointerCapture(H.pointerId), a.value = 0, c = setInterval(() => {
        a.value += 2, a.value >= 100 && (clearInterval(c), C());
      }, 30));
    }
    function g(H) {
      H.target.releasePointerCapture(H.pointerId), w();
    }
    function w() {
      clearInterval(c), a.value = 0;
    }
    function C() {
      ee("activate_device", {});
    }
    function k(H, W) {
      ee("Lock_set_response", { method: "activateDevice", args: { randomCode: H, time: W } }), d.value = "已激活", n.value = H, s.value = W, S();
    }
    function S() {
      y(), i = setInterval(() => {
        e.value > 0 ? y() : E();
      }, 1e3);
    }
    function y() {
      const H = Date.now(), W = s.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((W - H) / 1e3));
    }
    function E() {
      o.value = !0, document.body.style.overflow = "hidden", clearInterval(i), ae();
    }
    function O() {
      T(r.value);
    }
    function T(H) {
      ee("check_lock_password", {
        target: "attemptUnlock",
        password: H,
        lockCount: l.value,
        deviceRandomCode: n.value
      }), r.value = "";
    }
    function _() {
      d.value = "永久激活", o.value = !1, document.body.style.overflow = "auto", clearInterval(i);
    }
    function D() {
      o.value = !1, document.body.style.overflow = "auto", l.value++, i && clearInterval(i), S();
    }
    xt(() => {
      clearInterval(i), clearInterval(c);
    }), ft(() => {
      if (u.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, u.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = Je();
        rt(H, (W) => {
          if (W && W.type === "confirm_lock_password")
            try {
              const V = JSON.parse(W.content);
              V.target === "attemptUnlock" && (V.result === "success" ? (o.value ? s.value = Date.now() : s.value = s.value + t.value * 1e3, ee("update_baseTime", s.value), D(), ee("Lock_set_response", { method: "extendLockTime", args: { baseTime: s.value } })) : V.result === "forever_success" ? (_(), ee("Lock_set_response", { method: "permanentUnlock", args: {} })) : ee("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (V) {
              console.error("Failed to parse confirm lock password :", V);
            }
          else if (W && W.type === "device_activated")
            try {
              const V = JSON.parse(W.content);
              k(V.device_random_code, V.device_base_time);
            } catch (V) {
              console.error("Failed to parse device activation result:", V);
            }
          else if (W && W.type === "device_info")
            try {
              const V = JSON.parse(W.content);
              d.value = V.device_status, n.value = V.device_random_code, l.value = V.device_lock_count, s.value = V.device_base_time, V.device_status === "已激活" ? S() : V.device_status === "永久激活" && _();
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
        baseTime: s.value,
        progressWidth: a.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: b.value
      };
      console.log("Sending Lock initial state:", H), ee("Lock_init_response", H);
    }, Y = Z, ae = () => {
      Y("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (H, W) => (_e(), Se("div", Qr, [
      j("div", Hr, [
        j("div", Gr, Te(p.value), 1),
        j("button", {
          class: "activation-button",
          onPointerdown: m,
          onPointerup: g,
          onPointercancel: w,
          onPointerleave: w,
          disabled: d.value !== "未激活"
        }, [
          dt(Te(h.value) + " ", 1),
          j("div", {
            class: "progress-bar",
            style: Ot({ width: a.value + "%" })
          }, null, 4)
        ], 40, Jr)
      ]),
      j("div", Yr, [
        lt(j("input", {
          "onUpdate:modelValue": W[0] || (W[0] = (V) => r.value = V),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: W[1] || (W[1] = (V) => f.value = !0)
        }, null, 544), [
          [vt, r.value]
        ]),
        j("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      o.value ? (_e(), Se("div", Xr, [
        j("div", Zr, [
          W[8] || (W[8] = j("h3", null, "设备已锁定", -1)),
          j("h3", null, "第 " + Te(l.value) + " 次锁定", 1),
          j("h3", null, "设备随机码: " + Te(n.value), 1),
          lt(j("input", {
            "onUpdate:modelValue": W[2] || (W[2] = (V) => r.value = V),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: W[3] || (W[3] = (V) => b.value = !0)
          }, null, 544), [
            [vt, r.value]
          ]),
          j("button", {
            class: "unlock-button",
            onClick: O
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
        showKeyboard: b.value,
        "onUpdate:showKeyboard": W[7] || (W[7] = (V) => b.value = V)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, to = /* @__PURE__ */ st(eo, [["__scopeId", "data-v-3d3fd364"]]), no = { class: "app-container" }, oo = {
  __name: "App",
  setup(be) {
    Rt();
    const Z = G(""), ee = (u) => {
      Z.value = u;
    };
    return (u, d) => (_e(), Se("div", no, [
      d[0] || (d[0] = j("h1", null, "涪特智能养护台车控制系统", -1)),
      Ge(Pn),
      Ge(kr),
      Ge(an),
      Ge(ur, { message: Z.value }, null, 8, ["message"]),
      Ge(Fr),
      Ge(to, { onMessageFromA: ee })
    ]));
  }
};
export {
  oo as default
};
