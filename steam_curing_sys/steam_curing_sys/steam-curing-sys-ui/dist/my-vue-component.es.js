import Pt, { ref as H, onMounted as dt, provide as yt, readonly as bt, inject as wt, watch as rt, openBlock as ge, createElementBlock as ye, createElementVNode as C, toDisplayString as Te, Fragment as ut, renderList as ct, normalizeClass as nt, createCommentVNode as ot, reactive as mt, createVNode as Ke, withDirectives as st, vModelRadio as Ot, createTextVNode as vt, vModelText as ft, onUnmounted as _t, normalizeStyle as kt, vModelCheckbox as Bt, defineComponent as $t, unref as Rt, computed as xt } from "vue";
const Et = Symbol(), Ct = Symbol(), Tt = Symbol();
function It(me, ee) {
  me && me.messageSignal ? me.messageSignal.connect((X) => {
    try {
      const i = JSON.parse(X);
      ee.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), ee.value = { type: "unknown", content: X };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Ut() {
  const me = H(null), ee = H(null), X = H("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      me.value = d, ee.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), It(ee.value, X), ee.value && typeof ee.value.vueReady == "function" ? ee.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  dt(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), yt(Et, bt(me)), yt(Ct, bt(ee)), yt(Tt, bt(X));
}
function Ge() {
  const me = wt(Et), ee = wt(Ct), X = wt(Tt);
  return (!me || !ee || !X) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: me,
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
const lt = (me, ee) => {
  const X = me.__vccOpts || me;
  for (const [i, d] of ee)
    X[i] = d;
  return X;
}, Dt = {
  key: 0,
  class: "numeric-keyboard"
}, Mt = { class: "keyboard" }, Ft = { class: "current-value" }, Vt = ["onClick"], qt = {
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
  setup(me, { emit: ee }) {
    const X = me, i = ee, d = H([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = H("");
    rt(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => me.showKeyboard ? (ge(), ye("div", Dt, [
      C("div", Mt, [
        C("div", Ft, Te(e.value), 1),
        (ge(!0), ye(ut, null, ct(d.value, (t) => (ge(), ye("div", {
          key: t.join(),
          class: "row"
        }, [
          (ge(!0), ye(ut, null, ct(t, (a) => (ge(), ye("button", {
            key: a,
            onClick: (u) => n(a),
            class: nt({ "function-key": a === "清除" || a === "确定" })
          }, Te(a), 11, Vt))), 128))
        ]))), 128))
      ])
    ])) : ot("", !0);
  }
}, ht = /* @__PURE__ */ lt(qt, [["__scopeId", "data-v-541feda2"]]), Wt = { class: "settings-container" }, zt = { class: "setting-group" }, Kt = { class: "setting-item" }, Qt = { class: "setting-controls" }, Ht = ["value"], Gt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Yt = ["value"], Xt = { class: "setting-group" }, Zt = { class: "setting-item" }, en = { class: "setting-controls" }, tn = ["value"], nn = { class: "setting-item" }, on = { class: "setting-controls" }, rn = ["value"], an = {
  __name: "SensorSettings",
  setup(me) {
    const { sendToPyQt: ee } = Ge(), X = mt({
      isPyQtWebEngine: !1
    }), i = H(35), d = H(25), e = H(95), n = H(90), o = H(!1), r = H(null), t = H("");
    dt(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: y } = Ge();
        rt(y, (p) => {
          if (p && p.type === "update_limit_settings")
            try {
              const v = JSON.parse(p.content);
              i.value = v.temp_upper, d.value = v.temp_lower, e.value = v.humidity_upper, n.value = v.humidity_lower, console.log("Sensor Settings updated:", v);
            } catch (v) {
              console.error("Failed to parse sensor settings data:", v);
            }
          else if (p && p.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), l();
          else if (p && p.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", p.content);
            const m = JSON.parse(p.content).args;
            i.value = m.temp_upper, d.value = m.temp_lower, e.value = m.humidity_upper, n.value = m.humidity_lower, l();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const a = (y, p) => {
      const v = y === "tempUpper" ? i : y === "tempLower" ? d : y === "humidityUpper" ? e : n;
      v.value = (v.value || 0) + p, y.startsWith("temp") ? u(y === "tempUpper" ? "upper" : "lower") : s(y === "humidityUpper" ? "upper" : "lower");
    }, u = (y) => {
      i.value === "" && (i.value = d.value + 1), d.value === "" && (d.value = i.value - 1), y === "upper" ? i.value = Math.max(d.value + 1, i.value) : d.value = Math.min(i.value - 1, d.value), l();
    }, s = (y) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), y === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), l();
    }, l = () => {
      if (i.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const y = {
          temp_upper: i.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", y), X.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), ee("updateLimitSettings", y)) : console.log("在普通网页环境中执行更新设置");
      }
    }, c = (y) => {
      r.value = y, o.value = !0, t.value = y.startsWith("temp") ? y === "tempUpper" ? i.value : d.value : y === "humidityUpper" ? e.value : n.value;
    }, f = (y) => {
      const p = parseFloat(y);
      isNaN(p) || (r.value === "tempUpper" ? (i.value = p, u("upper")) : r.value === "tempLower" ? (d.value = p, u("lower")) : r.value === "humidityUpper" ? (e.value = p, s("upper")) : r.value === "humidityLower" && (n.value = p, s("lower"))), r.value = null;
    };
    return (y, p) => (ge(), ye("div", Wt, [
      C("div", zt, [
        p[15] || (p[15] = C("h2", null, "温度设置 (°C)", -1)),
        C("div", Kt, [
          p[13] || (p[13] = C("span", { class: "setting-label" }, "上限：", -1)),
          C("div", Qt, [
            C("button", {
              onClick: p[0] || (p[0] = (v) => a("tempUpper", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: i.value,
              onFocus: p[1] || (p[1] = (v) => c("tempUpper")),
              readonly: ""
            }, null, 40, Ht),
            C("button", {
              onClick: p[2] || (p[2] = (v) => a("tempUpper", 1))
            }, "+")
          ])
        ]),
        C("div", Gt, [
          p[14] || (p[14] = C("span", { class: "setting-label" }, "下限：", -1)),
          C("div", Jt, [
            C("button", {
              onClick: p[3] || (p[3] = (v) => a("tempLower", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (v) => c("tempLower")),
              readonly: ""
            }, null, 40, Yt),
            C("button", {
              onClick: p[5] || (p[5] = (v) => a("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      C("div", Xt, [
        p[18] || (p[18] = C("h2", null, "湿度设置 (%)", -1)),
        C("div", Zt, [
          p[16] || (p[16] = C("span", { class: "setting-label" }, "上限：", -1)),
          C("div", en, [
            C("button", {
              onClick: p[6] || (p[6] = (v) => a("humidityUpper", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => c("humidityUpper")),
              readonly: ""
            }, null, 40, tn),
            C("button", {
              onClick: p[8] || (p[8] = (v) => a("humidityUpper", 1))
            }, "+")
          ])
        ]),
        C("div", nn, [
          p[17] || (p[17] = C("span", { class: "setting-label" }, "下限：", -1)),
          C("div", on, [
            C("button", {
              onClick: p[9] || (p[9] = (v) => a("humidityLower", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => c("humidityLower")),
              readonly: ""
            }, null, 40, rn),
            C("button", {
              onClick: p[11] || (p[11] = (v) => a("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      Ke(ht, {
        modelValue: t.value,
        showKeyboard: o.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": p[12] || (p[12] = (v) => o.value = v)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, sn = /* @__PURE__ */ lt(an, [["__scopeId", "data-v-c66c99de"]]), un = {
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
  setup(me, { emit: ee }) {
    const X = me, i = ee, d = H([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = H("");
    rt(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : o === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : o === "." && e.value.includes(".") || (e.value += o);
    };
    return (o, r) => me.showKeyboard ? (ge(), ye("div", un, [
      C("div", cn, [
        C("div", ln, Te(e.value), 1),
        (ge(!0), ye(ut, null, ct(d.value, (t) => (ge(), ye("div", {
          key: t.join(),
          class: "row"
        }, [
          (ge(!0), ye(ut, null, ct(t, (a) => (ge(), ye("button", {
            key: a,
            onClick: (u) => n(a),
            class: nt({
              "function-key": ["清除", "确定"].includes(a),
              "operator-key": a === "-"
            })
          }, Te(a), 11, dn))), 128))
        ]))), 128))
      ])
    ])) : ot("", !0);
  }
}, pn = /* @__PURE__ */ lt(fn, [["__scopeId", "data-v-3f49a3dc"]]), vn = { class: "sensor-data-group" }, hn = { class: "sensor-section" }, mn = { class: "sensor-container" }, gn = { class: "sensor-grid" }, yn = ["onClick"], bn = { class: "sensor-title" }, wn = { class: "sensor-value" }, xn = { class: "sensor-section" }, kn = { class: "sensor-container" }, _n = { class: "sensor-grid" }, Sn = ["onClick"], On = { class: "sensor-title" }, jn = { class: "sensor-value" }, En = {
  key: 0,
  class: "dialog-overlay"
}, Cn = { class: "dialog" }, Tn = { class: "dialog-content" }, An = { class: "radio-group" }, Ln = { class: "input-group" }, Nn = ["placeholder"], Pn = { class: "dialog-actions" }, Bn = {
  __name: "SensorDisplay",
  setup(me) {
    const ee = H({ temperature: {}, humidity: {} }), X = H({
      temperature: {},
      humidity: {}
    }), i = H(null), d = H(!1), e = H("offset"), n = H(""), o = H(!1), { sendToPyQt: r } = Ge();
    dt(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: c } = Ge();
        rt(c, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              ee.value = JSON.parse(f.content);
            } catch (y) {
              console.error("Failed to parse sensor data:", y);
            }
          else if (f && f.type === "update_adjust_settings")
            try {
              const y = JSON.parse(f.content);
              X.value.temperature = y.temperature, X.value.humidity = y.humidity;
            } catch (y) {
              console.error("Failed to parse adjustments data:", y);
            }
          else f && f.type === "get_sensor_data" ? r("update_remote_sensor_data", ee.value) : f && f.type === "sensor_debug_mode" && (o.value = JSON.parse(f.content));
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
    }, a = H(!1), u = H(""), s = (c, f) => {
      i.value = f, n.value = c;
      const y = X.value[c][f];
      y ? (e.value = y.type, u.value = String(y.value)) : (e.value = "offset", u.value = ""), d.value = !0, a.value = !1;
    }, l = async () => {
      try {
        const c = {
          sensorType: n.value,
          sensorId: i.value,
          adjustmentType: e.value,
          value: parseFloat(u.value) || 0
        };
        X.value[n.value] || (X.value[n.value] = {}), X.value[n.value][i.value] = {
          type: e.value,
          value: parseFloat(u.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && r("adjust_sensor", c), d.value = !1, u.value = "", a.value = !1;
      } catch (c) {
        console.error("Error applying adjustment:", c);
      }
    };
    return (c, f) => (ge(), ye("div", vn, [
      C("div", hn, [
        f[7] || (f[7] = C("h2", null, "温度传感器", -1)),
        C("div", mn, [
          C("div", gn, [
            (ge(!0), ye(ut, null, ct(ee.value.temperature, (y, p) => (ge(), ye("div", {
              key: p,
              class: "sensor-card",
              onClick: (v) => o.value ? s("temperature", p) : null
            }, [
              C("div", bn, Te(p), 1),
              C("div", wn, Te(y), 1)
            ], 8, yn))), 128))
          ])
        ])
      ]),
      C("div", xn, [
        f[8] || (f[8] = C("h2", null, "湿度传感器", -1)),
        C("div", kn, [
          C("div", _n, [
            (ge(!0), ye(ut, null, ct(ee.value.humidity, (y, p) => (ge(), ye("div", {
              key: p,
              class: "sensor-card",
              onClick: (v) => o.value ? s("humidity", p) : null
            }, [
              C("div", On, Te(p), 1),
              C("div", jn, Te(y), 1)
            ], 8, Sn))), 128))
          ])
        ])
      ]),
      d.value ? (ge(), ye("div", En, [
        C("div", Cn, [
          C("h3", null, "调整传感器: " + Te(i.value), 1),
          C("div", Tn, [
            C("div", An, [
              C("label", null, [
                st(C("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (y) => e.value = y),
                  value: "offset"
                }, null, 512), [
                  [Ot, e.value]
                ]),
                f[9] || (f[9] = vt(" 调整偏移值 "))
              ]),
              C("label", null, [
                st(C("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (y) => e.value = y),
                  value: "value"
                }, null, 512), [
                  [Ot, e.value]
                ]),
                f[10] || (f[10] = vt(" 直接设置值 "))
              ])
            ]),
            C("div", Ln, [
              st(C("input", {
                type: "text",
                "onUpdate:modelValue": f[2] || (f[2] = (y) => u.value = y),
                readonly: "",
                onClick: f[3] || (f[3] = (y) => a.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Nn), [
                [ft, u.value]
              ])
            ])
          ]),
          C("div", Pn, [
            C("button", {
              onClick: f[4] || (f[4] = (y) => d.value = !1)
            }, "取消"),
            C("button", {
              onClick: l,
              class: "primary"
            }, "确定")
          ])
        ]),
        Ke(pn, {
          modelValue: u.value,
          "onUpdate:modelValue": f[5] || (f[5] = (y) => u.value = y),
          showKeyboard: a.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (y) => a.value = y)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : ot("", !0)
    ]));
  }
}, $n = /* @__PURE__ */ lt(Bn, [["__scopeId", "data-v-55a9479e"]]), Rn = { class: "cart-system" }, In = { class: "water-protection" }, Un = { class: "mode-group" }, Dn = { class: "mode-group-left" }, Mn = ["disabled"], Fn = ["disabled"], Vn = { class: "mode-group-right" }, qn = ["disabled"], Wn = ["disabled"], zn = { class: "mode-content" }, Kn = { key: 0 }, Qn = { class: "controls" }, Hn = { class: "input-group" }, Gn = { class: "input-group" }, Jn = { class: "button-group" }, Yn = ["disabled"], Xn = ["disabled"], Zn = { class: "visualization" }, eo = { class: "progress-bar" }, to = { class: "status" }, no = {
  key: 1,
  class: "auto-mode-container"
}, oo = {
  __name: "CartSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(me) {
    const ee = H("semi-auto"), X = H("both-side"), i = H(30), d = H(30), e = H(i.value), n = H(d.value), o = H(i.value), r = H(d.value), t = H(!1), a = H(0), u = H("系统就绪"), s = H("小车尚未工作"), l = H(!1), c = H(!1), f = H(!1);
    let y = null;
    const p = H(!1), v = H(!1), m = H(0), { sendToPyQt: h } = Ge(), b = mt({
      isPyQtWebEngine: !1
    });
    dt(() => {
      if (b.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, b.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: N } = Ge();
        rt(N, (O) => {
          if (O && O.type === "update_dolly_settings")
            try {
              const T = JSON.parse(O.content);
              e.value = T.dolly_single_run_time, n.value = T.dolly_run_interval_time, o.value = e.value, r.value = n.value, console.log("dolly Settings updated:", T);
            } catch (T) {
              console.error("Failed to parse dolly settings data:", T);
            }
          else if (O && O.type === "update_dolly_state")
            O.content ? M("小车正在运行") : M("小车尚未工作");
          else if (O && O.type === "update_water_tank_status")
            try {
              const T = JSON.parse(O.content);
              T.side === "left" ? p.value = T.low_water : T.side === "right" && (v.value = T.low_water), p.value || v.value ? (f.value = !0, ee.value === "auto" ? k("semi-auto") : S()) : f.value = !1, console.log("Water tank status updated:", T);
            } catch (T) {
              console.error("Failed to parse water tank status data:", T);
            }
          else if (O && O.type === "CartSystem_init")
            console.log("Received CartSystem_init message"), E();
          else if (O && O.type === "CartSystem_set") {
            console.log("Received CartSystem_set message:", O.content);
            const T = JSON.parse(O.content);
            if (T.method === "setMode")
              k(T.args.newMode);
            else if (T.method === "startSystem")
              L();
            else if (T.method === "stopSystem")
              S();
            else if (T.method === "updateDollySettings") {
              const q = T.args;
              e.value = q.dolly_single_run_time, n.value = q.dolly_run_interval_time, o.value = e.value, r.value = n.value, console.log("dolly Settings received:", q), j();
            } else T.method === "setTankMode" && w(T.args.newMode);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const E = () => {
      const N = {
        mode: ee.value,
        currentRunTime: i.value,
        currentIntervalTime: d.value,
        tempRunTime: e.value,
        tempIntervalTime: n.value,
        nextRunTime: o.value,
        nextIntervalTime: r.value,
        isRunning: t.value,
        progress: a.value,
        statusMessage: u.value,
        autoModeStatus: s.value,
        low_water: f.value,
        leftTankLowWater: p.value,
        rightTankLowWater: v.value,
        phaseStartTime: m.value,
        tankmode: X.value
      };
      console.log("Sending initial cart system state:", N), h("CartSystem_init_response", N);
    }, A = me;
    rt(() => A.message, (N) => {
      N != null && N.content && (ee.value === "auto" ? k("semi-auto") : S());
    });
    const w = (N) => {
      X.value = N, N === "one-side" ? h("controlDolly", { target: "setTankMode", mode: "one-side" }) : h("controlDolly", { target: "setTankMode", mode: "both-side" });
    }, k = (N) => {
      ee.value = N, b.isPyQtWebEngine && (N === "auto" ? (S(), h("controlDolly", { target: "setMode", mode: "auto" })) : (U(), M("小车尚未工作"), h("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, g = () => {
      e.value = Math.max(1, parseInt(e.value) || 1), o.value = e.value, j();
    }, _ = () => {
      n.value = Math.max(0, parseInt(n.value) || 0), r.value = n.value, j();
    };
    function j() {
      if (b.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const N = {
          target: "dolly_settings",
          dolly_single_run_time: o.value,
          dolly_run_interval_time: r.value
        };
        h("controlDolly", N);
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    const L = () => {
      t.value = !0, ne();
    }, S = () => {
      U(), t.value = !1, cancelAnimationFrame(y), a.value = 0, u.value = "系统就绪";
    };
    function U() {
      b.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), h("controlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function F() {
      b.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), h("tempControlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function G() {
      b.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), h("controlDolly", {
        target: "setState",
        dolly_state: !0
      })) : console.log("在普通网页环境中执行更新设置");
    }
    const ne = () => {
      G(), u.value = "小车运行中", a.value = 0;
      const N = Date.now();
      m.value = N, i.value = o.value;
      const O = () => {
        const T = (Date.now() - N) / 1e3, q = Math.max(0, i.value - T);
        a.value = T / i.value * 100, u.value = `小车运行中: 剩余 ${q.toFixed(1)} 秒`, T < i.value && t.value ? y = requestAnimationFrame(O) : t.value && (a.value = 100, r.value > 0 && F(), Q());
      };
      y = requestAnimationFrame(O);
    }, Q = () => {
      u.value = "等待下次运行";
      const N = Date.now();
      m.value = N, d.value = r.value;
      const O = () => {
        const T = (Date.now() - N) / 1e3, q = Math.max(0, d.value - T);
        u.value = `等待下次运行: ${q.toFixed(1)}秒`, q > 0 && t.value ? y = requestAnimationFrame(O) : t.value && ne();
      };
      y = requestAnimationFrame(O);
    }, M = (N) => {
      s.value = N;
    };
    return _t(() => {
      cancelAnimationFrame(y);
    }), (N, O) => (ge(), ye("div", Rn, [
      O[15] || (O[15] = C("div", { class: "label-box" }, [
        C("label", null, "在数字开关上，output1控制左侧养护开/关，output2控制右侧养护开/关，output3与output4控制小车运动"),
        C("br")
      ], -1)),
      C("div", In, [
        C("div", {
          class: nt(["water-tank", { "low-water": p.value }])
        }, " 左水箱: " + Te(p.value ? "缺水" : "正常"), 3),
        C("div", {
          class: nt(["water-tank", { "low-water": v.value }])
        }, " 右水箱: " + Te(v.value ? "缺水" : "正常"), 3)
      ]),
      C("div", Un, [
        C("div", Dn, [
          C("button", {
            class: nt(["mode-button", { active: ee.value === "semi-auto" && !f.value }]),
            disabled: f.value,
            onClick: O[0] || (O[0] = (T) => ee.value === "auto" ? k("semi-auto") : () => {
            })
          }, "半自动模式", 10, Mn),
          C("button", {
            class: nt(["mode-button", { active: ee.value === "auto" && !f.value }]),
            disabled: f.value,
            onClick: O[1] || (O[1] = (T) => ee.value === "semi-auto" ? k("auto") : () => {
            })
          }, "自动模式", 10, Fn)
        ]),
        C("div", Vn, [
          C("button", {
            class: nt(["mode-button", { active: X.value === "both-side" && !f.value }]),
            disabled: f.value,
            onClick: O[2] || (O[2] = (T) => X.value === "one-side" ? w("both-side") : () => {
            })
          }, "双边养护", 10, qn),
          C("button", {
            class: nt(["mode-button", { active: X.value === "one-side" && !f.value }]),
            disabled: f.value,
            onClick: O[3] || (O[3] = (T) => X.value === "both-side" ? w("one-side") : () => {
            })
          }, "单边交替养护", 10, Wn)
        ])
      ]),
      C("div", zn, [
        ee.value === "semi-auto" ? (ge(), ye("div", Kn, [
          C("div", Qn, [
            C("div", Hn, [
              O[10] || (O[10] = C("label", null, "小车运行时间 (秒):", -1)),
              C("div", {
                class: "input-wrapper",
                onClick: O[4] || (O[4] = (T) => l.value = !0)
              }, Te(e.value), 1)
            ]),
            C("div", Gn, [
              O[11] || (O[11] = C("label", null, "小车暂停时间 (秒):", -1)),
              C("div", {
                class: "input-wrapper",
                onClick: O[5] || (O[5] = (T) => c.value = !0)
              }, Te(n.value), 1)
            ]),
            C("div", Jn, [
              C("button", {
                onClick: L,
                disabled: t.value || f.value
              }, "开始", 8, Yn),
              C("button", {
                onClick: S,
                disabled: !t.value || f.value
              }, "停止", 8, Xn)
            ])
          ]),
          C("div", Zn, [
            C("div", eo, [
              C("div", {
                class: "progress",
                style: kt({ width: a.value + "%" })
              }, null, 4),
              C("div", {
                class: "cart",
                style: kt({ left: a.value + "%" })
              }, O[12] || (O[12] = [
                C("span", { class: "cart-icon" }, "🚜", -1)
              ]), 4)
            ])
          ]),
          C("div", to, Te(u.value), 1)
        ])) : (ge(), ye("div", no, [
          O[13] || (O[13] = C("div", { class: "auto-mode-title" }, "自动模式受传感器湿度控制", -1)),
          C("div", {
            class: nt(["auto-mode-status", { working: s.value === "小车正在运行" }])
          }, Te(s.value), 3),
          O[14] || (O[14] = C("div", { class: "auto-mode-placeholder" }, null, -1))
        ]))
      ]),
      Ke(ht, {
        modelValue: e.value,
        "onUpdate:modelValue": [
          O[6] || (O[6] = (T) => e.value = T),
          g
        ],
        showKeyboard: l.value,
        "onUpdate:showKeyboard": O[7] || (O[7] = (T) => l.value = T)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Ke(ht, {
        modelValue: n.value,
        "onUpdate:modelValue": [
          O[8] || (O[8] = (T) => n.value = T),
          _
        ],
        showKeyboard: c.value,
        "onUpdate:showKeyboard": O[9] || (O[9] = (T) => c.value = T)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, ro = /* @__PURE__ */ lt(oo, [["__scopeId", "data-v-07f22d0a"]]), io = { class: "data-actions" }, ao = {
  key: 0,
  class: "modal-overlay"
}, so = { class: "modal-content settings-modal" }, uo = { class: "setting-group" }, co = { class: "setting-item" }, lo = { class: "toggle-switch" }, fo = {
  key: 1,
  class: "modal-overlay"
}, po = {
  key: 2,
  class: "modal-overlay"
}, vo = { class: "modal-content update-modal" }, ho = {
  key: 3,
  class: "modal-overlay"
}, mo = { class: "modal-content" }, go = {
  __name: "DataExport",
  setup(me) {
    const { sendToPyQt: ee } = Ge(), X = mt({
      isPyQtWebEngine: !1
    }), i = H(!1), d = H(!1), e = H(""), n = H(!1), o = H(!1), r = H(!1), t = H(!1), a = H(""), u = H(!1), s = H(!1), l = () => {
      t.value = !0, a.value = "", document.body.style.overflow = "hidden";
    }, c = () => {
      if (!a.value) {
        A("请输入更新版号！");
        return;
      }
      if (!s.value) {
        A("请先连接到互联网！");
        return;
      }
      X.isPyQtWebEngine && ee("updateVersion", { version: a.value }), t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, f = () => {
      t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, y = () => {
      r.value = o.value, n.value = !0, document.body.style.overflow = "hidden";
    }, p = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto";
    }, v = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto", X.isPyQtWebEngine && ee("saveDebugSettings", { debug_mode: o.value });
    };
    dt(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: k } = Ge();
        rt(k, (g) => {
          if (g && g.type === "update_debug_mode")
            try {
              const _ = JSON.parse(g.content);
              o.value = _.debug_mode, r.value = _.debug_mode;
            } catch (_) {
              console.error("Failed to parse debug settings:", _);
            }
          else if (g && g.type === "DataExport_init") {
            const _ = {
              debugMode: o.value
            };
            console.log("Sending initial DataExport state:", _), ee("DataExport_init_response", _);
          } else if (g && g.type === "clearData")
            ee("exportData", !1), ee("clearData_response", "");
          else if (g && g.type === "updateVersion_response")
            try {
              const _ = JSON.parse(g.content);
              _.status === "success" ? A(`${_.message}，系统即将重启...`) : A(_.message);
            } catch (_) {
              A("解析更新响应失败：" + _);
            }
          else g && g.type === "wifi_status" && (JSON.parse(g.content).internet_status === "已联网" ? s.value = !0 : s.value = !1);
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const m = () => {
      X.isPyQtWebEngine && (console.log("导出数据"), ee("exportData", !0));
    }, h = () => {
      i.value = !0, document.body.style.overflow = "hidden";
    }, b = () => {
      i.value = !1, document.body.style.overflow = "auto";
    }, E = () => {
      console.log("清空数据"), i.value = !1, A("所有数据已清空！"), document.body.style.overflow = "auto", X.isPyQtWebEngine && ee("exportData", !1);
    }, A = (k) => {
      e.value = k, d.value = !0;
    }, w = () => {
      d.value = !1;
    };
    return (k, g) => (ge(), ye("div", io, [
      C("div", { class: "action-buttons" }, [
        C("div", { class: "button-group" }, [
          C("button", {
            onClick: m,
            class: "export-btn"
          }, "导出数据")
        ]),
        C("div", { class: "button-group" }, [
          C("button", {
            onClick: h,
            class: "clear-btn"
          }, "清空数据")
        ]),
        C("div", { class: "button-group" }, [
          C("button", {
            onClick: y,
            class: "settings-btn"
          }, "开发者模式")
        ]),
        C("div", { class: "button-group" }, [
          C("button", {
            onClick: l,
            class: "update-btn"
          }, "更新")
        ])
      ]),
      n.value ? (ge(), ye("div", ao, [
        C("div", so, [
          C("div", uo, [
            g[7] || (g[7] = C("h2", null, "传感器调试模式【开发者测试用】", -1)),
            C("div", co, [
              g[6] || (g[6] = C("span", { class: "setting-label" }, "调试模式：", -1)),
              C("div", lo, [
                st(C("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": g[0] || (g[0] = (_) => r.value = _)
                }, null, 512), [
                  [Bt, r.value]
                ]),
                g[5] || (g[5] = C("label", { for: "debug-toggle" }, null, -1))
              ])
            ]),
            C("div", { class: "modal-buttons" }, [
              C("button", {
                onClick: v,
                class: "confirm-btn"
              }, "保存"),
              C("button", {
                onClick: p,
                class: "cancel-btn"
              }, "取消")
            ])
          ])
        ])
      ])) : ot("", !0),
      i.value ? (ge(), ye("div", fo, [
        C("div", { class: "modal-content" }, [
          g[8] || (g[8] = C("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: E,
              class: "confirm-btn"
            }, "确定"),
            C("button", {
              onClick: b,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ot("", !0),
      t.value ? (ge(), ye("div", po, [
        C("div", vo, [
          g[9] || (g[9] = C("h2", null, "更新版本【注意更新时务必全程联网！否则会更新失败】", -1)),
          C("div", {
            class: "update-input",
            onClick: g[2] || (g[2] = (_) => u.value = !0)
          }, [
            st(C("input", {
              type: "text",
              "onUpdate:modelValue": g[1] || (g[1] = (_) => a.value = _),
              placeholder: "请输入更新版号",
              readonly: ""
            }, null, 512), [
              [ft, a.value]
            ])
          ]),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: c,
              class: "confirm-btn"
            }, "更新"),
            C("button", {
              onClick: f,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : ot("", !0),
      Ke(ht, {
        modelValue: a.value,
        "onUpdate:modelValue": g[3] || (g[3] = (_) => a.value = _),
        "show-keyboard": u.value,
        "onUpdate:showKeyboard": g[4] || (g[4] = (_) => u.value = _)
      }, null, 8, ["modelValue", "show-keyboard"]),
      d.value ? (ge(), ye("div", ho, [
        C("div", mo, [
          C("h2", null, Te(e.value), 1),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: w,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : ot("", !0)
    ]));
  }
}, yo = /* @__PURE__ */ lt(go, [["__scopeId", "data-v-59fa8a4f"]]);
var bo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function wo(me) {
  return me && me.__esModule && Object.prototype.hasOwnProperty.call(me, "default") ? me.default : me;
}
var At = { exports: {} };
(function(me, ee) {
  (function(X, i) {
    me.exports = i(Pt);
  })(typeof self < "u" ? self : bo, function(X) {
    return function(i) {
      var d = {};
      function e(n) {
        if (d[n]) return d[n].exports;
        var o = d[n] = { i: n, l: !1, exports: {} };
        return i[n].call(o.exports, o, o.exports, e), o.l = !0, o.exports;
      }
      return e.m = i, e.c = d, e.d = function(n, o, r) {
        e.o(n, o) || Object.defineProperty(n, o, { enumerable: !0, get: r });
      }, e.r = function(n) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
      }, e.t = function(n, o) {
        if (1 & o && (n = e(n)), 8 & o || 4 & o && typeof n == "object" && n && n.__esModule) return n;
        var r = /* @__PURE__ */ Object.create(null);
        if (e.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: n }), 2 & o && typeof n != "string") for (var t in n) e.d(r, t, (function(a) {
          return n[a];
        }).bind(null, t));
        return r;
      }, e.n = function(n) {
        var o = n && n.__esModule ? function() {
          return n.default;
        } : function() {
          return n;
        };
        return e.d(o, "a", o), o;
      }, e.o = function(n, o) {
        return Object.prototype.hasOwnProperty.call(n, o);
      }, e.p = "", e(e.s = "fb15");
    }({ "00ee": function(i, d, e) {
      var n = e("b622"), o = n("toStringTag"), r = {};
      r[o] = "z", i.exports = String(r) === "[object z]";
    }, "0366": function(i, d, e) {
      var n = e("1c0b");
      i.exports = function(o, r, t) {
        if (n(o), r === void 0) return o;
        switch (t) {
          case 0:
            return function() {
              return o.call(r);
            };
          case 1:
            return function(a) {
              return o.call(r, a);
            };
          case 2:
            return function(a, u) {
              return o.call(r, a, u);
            };
          case 3:
            return function(a, u, s) {
              return o.call(r, a, u, s);
            };
        }
        return function() {
          return o.apply(r, arguments);
        };
      };
    }, "057f": function(i, d, e) {
      var n = e("fc6a"), o = e("241c").f, r = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], a = function(u) {
        try {
          return o(u);
        } catch {
          return t.slice();
        }
      };
      i.exports.f = function(u) {
        return t && r.call(u) == "[object Window]" ? a(u) : o(n(u));
      };
    }, "06cf": function(i, d, e) {
      var n = e("83ab"), o = e("d1e7"), r = e("5c6c"), t = e("fc6a"), a = e("c04e"), u = e("5135"), s = e("0cfb"), l = Object.getOwnPropertyDescriptor;
      d.f = n ? l : function(c, f) {
        if (c = t(c), f = a(f, !0), s) try {
          return l(c, f);
        } catch {
        }
        if (u(c, f)) return r(!o.f.call(c, f), c[f]);
      };
    }, "0a06": function(i, d, e) {
      var n = e("c532"), o = e("30b5"), r = e("f6b4"), t = e("5270"), a = e("4a7b");
      function u(s) {
        this.defaults = s, this.interceptors = { request: new r(), response: new r() };
      }
      u.prototype.request = function(s) {
        typeof s == "string" ? (s = arguments[1] || {}, s.url = arguments[0]) : s = s || {}, s = a(this.defaults, s), s.method ? s.method = s.method.toLowerCase() : this.defaults.method ? s.method = this.defaults.method.toLowerCase() : s.method = "get";
        var l = [t, void 0], c = Promise.resolve(s);
        for (this.interceptors.request.forEach(function(f) {
          l.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          l.push(f.fulfilled, f.rejected);
        }); l.length; ) c = c.then(l.shift(), l.shift());
        return c;
      }, u.prototype.getUri = function(s) {
        return s = a(this.defaults, s), o(s.url, s.params, s.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(s) {
        u.prototype[s] = function(l, c) {
          return this.request(a(c || {}, { method: s, url: l, data: (c || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(s) {
        u.prototype[s] = function(l, c, f) {
          return this.request(a(f || {}, { method: s, url: l, data: c }));
        };
      }), i.exports = u;
    }, "0cb2": function(i, d, e) {
      var n = e("7b0b"), o = Math.floor, r = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, a = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(u, s, l, c, f, y) {
        var p = l + u.length, v = c.length, m = a;
        return f !== void 0 && (f = n(f), m = t), r.call(y, m, function(h, b) {
          var E;
          switch (b.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return u;
            case "`":
              return s.slice(0, l);
            case "'":
              return s.slice(p);
            case "<":
              E = f[b.slice(1, -1)];
              break;
            default:
              var A = +b;
              if (A === 0) return h;
              if (A > v) {
                var w = o(A / 10);
                return w === 0 ? h : w <= v ? c[w - 1] === void 0 ? b.charAt(1) : c[w - 1] + b.charAt(1) : h;
              }
              E = c[A - 1];
          }
          return E === void 0 ? "" : E;
        });
      };
    }, "0cfb": function(i, d, e) {
      var n = e("83ab"), o = e("d039"), r = e("cc12");
      i.exports = !n && !o(function() {
        return Object.defineProperty(r("div"), "a", { get: function() {
          return 7;
        } }).a != 7;
      });
    }, "0df6": function(i, d, e) {
      i.exports = function(n) {
        return function(o) {
          return n.apply(null, o);
        };
      };
    }, 1148: function(i, d, e) {
      var n = e("a691"), o = e("1d80");
      i.exports = "".repeat || function(r) {
        var t = String(o(this)), a = "", u = n(r);
        if (u < 0 || u == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; u > 0; (u >>>= 1) && (t += t)) 1 & u && (a += t);
        return a;
      };
    }, 1276: function(i, d, e) {
      var n = e("d784"), o = e("44e7"), r = e("825a"), t = e("1d80"), a = e("4840"), u = e("8aa5"), s = e("50c4"), l = e("14c3"), c = e("9263"), f = e("d039"), y = [].push, p = Math.min, v = 4294967295, m = !f(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(h, b, E) {
        var A;
        return A = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(w, k) {
          var g = String(t(this)), _ = k === void 0 ? v : k >>> 0;
          if (_ === 0) return [];
          if (w === void 0) return [g];
          if (!o(w)) return b.call(g, w, _);
          for (var j, L, S, U = [], F = (w.ignoreCase ? "i" : "") + (w.multiline ? "m" : "") + (w.unicode ? "u" : "") + (w.sticky ? "y" : ""), G = 0, ne = new RegExp(w.source, F + "g"); (j = c.call(ne, g)) && (L = ne.lastIndex, !(L > G && (U.push(g.slice(G, j.index)), j.length > 1 && j.index < g.length && y.apply(U, j.slice(1)), S = j[0].length, G = L, U.length >= _))); )
            ne.lastIndex === j.index && ne.lastIndex++;
          return G === g.length ? !S && ne.test("") || U.push("") : U.push(g.slice(G)), U.length > _ ? U.slice(0, _) : U;
        } : "0".split(void 0, 0).length ? function(w, k) {
          return w === void 0 && k === 0 ? [] : b.call(this, w, k);
        } : b, [function(w, k) {
          var g = t(this), _ = w == null ? void 0 : w[h];
          return _ !== void 0 ? _.call(w, g, k) : A.call(String(g), w, k);
        }, function(w, k) {
          var g = E(A, w, this, k, A !== b);
          if (g.done) return g.value;
          var _ = r(w), j = String(this), L = a(_, RegExp), S = _.unicode, U = (_.ignoreCase ? "i" : "") + (_.multiline ? "m" : "") + (_.unicode ? "u" : "") + (m ? "y" : "g"), F = new L(m ? _ : "^(?:" + _.source + ")", U), G = k === void 0 ? v : k >>> 0;
          if (G === 0) return [];
          if (j.length === 0) return l(F, j) === null ? [j] : [];
          for (var ne = 0, Q = 0, M = []; Q < j.length; ) {
            F.lastIndex = m ? Q : 0;
            var N, O = l(F, m ? j : j.slice(Q));
            if (O === null || (N = p(s(F.lastIndex + (m ? 0 : Q)), j.length)) === ne) Q = u(j, Q, S);
            else {
              if (M.push(j.slice(ne, Q)), M.length === G) return M;
              for (var T = 1; T <= O.length - 1; T++) if (M.push(O[T]), M.length === G) return M;
              Q = ne = N;
            }
          }
          return M.push(j.slice(ne)), M;
        }];
      }, !m);
    }, "13d5": function(i, d, e) {
      var n = e("23e7"), o = e("d58f").left, r = e("a640"), t = e("2d00"), a = e("605d"), u = r("reduce"), s = !a && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !u || s }, { reduce: function(l) {
        return o(this, l, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(i, d, e) {
      var n = e("c6b6"), o = e("9263");
      i.exports = function(r, t) {
        var a = r.exec;
        if (typeof a == "function") {
          var u = a.call(r, t);
          if (typeof u != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return u;
        }
        if (n(r) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return o.call(r, t);
      };
    }, "159b": function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("17c2"), t = e("9112");
      for (var a in o) {
        var u = n[a], s = u && u.prototype;
        if (s && s.forEach !== r) try {
          t(s, "forEach", r);
        } catch {
          s.forEach = r;
        }
      }
    }, "17c2": function(i, d, e) {
      var n = e("b727").forEach, o = e("a640"), r = o("forEach");
      i.exports = r ? [].forEach : function(t) {
        return n(this, t, arguments.length > 1 ? arguments[1] : void 0);
      };
    }, "19aa": function(i, d) {
      i.exports = function(e, n, o) {
        if (!(e instanceof n)) throw TypeError("Incorrect " + (o ? o + " " : "") + "invocation");
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
      var n = e("b622"), o = n("iterator"), r = !1;
      try {
        var t = 0, a = { next: function() {
          return { done: !!t++ };
        }, return: function() {
          r = !0;
        } };
        a[o] = function() {
          return this;
        }, Array.from(a, function() {
          throw 2;
        });
      } catch {
      }
      i.exports = function(u, s) {
        if (!s && !r) return !1;
        var l = !1;
        try {
          var c = {};
          c[o] = function() {
            return { next: function() {
              return { done: l = !0 };
            } };
          }, u(c);
        } catch {
        }
        return l;
      };
    }, "1cdc": function(i, d, e) {
      var n = e("342f");
      i.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n);
    }, "1d2b": function(i, d, e) {
      i.exports = function(n, o) {
        return function() {
          for (var r = new Array(arguments.length), t = 0; t < r.length; t++) r[t] = arguments[t];
          return n.apply(o, r);
        };
      };
    }, "1d80": function(i, d) {
      i.exports = function(e) {
        if (e == null) throw TypeError("Can't call method on " + e);
        return e;
      };
    }, "1dde": function(i, d, e) {
      var n = e("d039"), o = e("b622"), r = e("2d00"), t = o("species");
      i.exports = function(a) {
        return r >= 51 || !n(function() {
          var u = [], s = u.constructor = {};
          return s[t] = function() {
            return { foo: 1 };
          }, u[a](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          function o($, I) {
            return I = { exports: {} }, $(I, I.exports), I.exports;
          }
          var r = o(function($, I) {
            (function(J, V) {
              $.exports = V();
            })(0, function() {
              function J(se) {
                var ke = se && typeof se == "object";
                return ke && Object.prototype.toString.call(se) !== "[object RegExp]" && Object.prototype.toString.call(se) !== "[object Date]";
              }
              function V(se) {
                return Array.isArray(se) ? [] : {};
              }
              function Y(se, ke) {
                var Se = ke && ke.clone === !0;
                return Se && J(se) ? he(V(se), se, ke) : se;
              }
              function re(se, ke, Se) {
                var $e = se.slice();
                return ke.forEach(function(je, Ve) {
                  typeof $e[Ve] > "u" ? $e[Ve] = Y(je, Se) : J(je) ? $e[Ve] = he(se[Ve], je, Se) : se.indexOf(je) === -1 && $e.push(Y(je, Se));
                }), $e;
              }
              function be(se, ke, Se) {
                var $e = {};
                return J(se) && Object.keys(se).forEach(function(je) {
                  $e[je] = Y(se[je], Se);
                }), Object.keys(ke).forEach(function(je) {
                  J(ke[je]) && se[je] ? $e[je] = he(se[je], ke[je], Se) : $e[je] = Y(ke[je], Se);
                }), $e;
              }
              function he(se, ke, Se) {
                var $e = Array.isArray(ke), je = Se || { arrayMerge: re }, Ve = je.arrayMerge || re;
                return $e ? Array.isArray(se) ? Ve(se, ke, Se) : Y(ke, Se) : be(se, ke, Se);
              }
              return he.all = function(se, ke) {
                if (!Array.isArray(se) || se.length < 2) throw new Error("first argument should be an array with at least two elements");
                return se.reduce(function(Se, $e) {
                  return he(Se, $e, ke);
                });
              }, he;
            });
          });
          function t($) {
            return $ = $ || /* @__PURE__ */ Object.create(null), { on: function(I, J) {
              ($[I] || ($[I] = [])).push(J);
            }, off: function(I, J) {
              $[I] && $[I].splice($[I].indexOf(J) >>> 0, 1);
            }, emit: function(I, J) {
              ($[I] || []).map(function(V) {
                V(J);
              }), ($["*"] || []).map(function(V) {
                V(I, J);
              });
            } };
          }
          var a = o(function($, I) {
            var J = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            I.default = J, $.exports = I.default;
          }), u = function($) {
            return Object.keys($).map(function(I) {
              var J = $[I].toString().replace(/"/g, "&quot;");
              return I + '="' + J + '"';
            }).join(" ");
          }, s = a.svg, l = a.xlink, c = {};
          c[s.name] = s.uri, c[l.name] = l.uri;
          var f, y = function($, I) {
            $ === void 0 && ($ = "");
            var J = r(c, I || {}), V = u(J);
            return "<svg " + V + ">" + $ + "</svg>";
          }, p = a.svg, v = a.xlink, m = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[v.name] = v.uri, f) }, h = function($) {
            this.config = r(m, $ || {}), this.symbols = [];
          };
          h.prototype.add = function($) {
            var I = this, J = I.symbols, V = this.find($.id);
            return V ? (J[J.indexOf(V)] = $, !1) : (J.push($), !0);
          }, h.prototype.remove = function($) {
            var I = this, J = I.symbols, V = this.find($);
            return !!V && (J.splice(J.indexOf(V), 1), V.destroy(), !0);
          }, h.prototype.find = function($) {
            return this.symbols.filter(function(I) {
              return I.id === $;
            })[0] || null;
          }, h.prototype.has = function($) {
            return this.find($) !== null;
          }, h.prototype.stringify = function() {
            var $ = this.config, I = $.attrs, J = this.symbols.map(function(V) {
              return V.stringify();
            }).join("");
            return y(J, I);
          }, h.prototype.toString = function() {
            return this.stringify();
          }, h.prototype.destroy = function() {
            this.symbols.forEach(function($) {
              return $.destroy();
            });
          };
          var b = function($) {
            var I = $.id, J = $.viewBox, V = $.content;
            this.id = I, this.viewBox = J, this.content = V;
          };
          b.prototype.stringify = function() {
            return this.content;
          }, b.prototype.toString = function() {
            return this.stringify();
          }, b.prototype.destroy = function() {
            var $ = this;
            ["id", "viewBox", "content"].forEach(function(I) {
              return delete $[I];
            });
          };
          var E = function($) {
            var I = !!document.importNode, J = new DOMParser().parseFromString($, "image/svg+xml").documentElement;
            return I ? document.importNode(J, !0) : J;
          }, A = function($) {
            function I() {
              $.apply(this, arguments);
            }
            $ && (I.__proto__ = $), I.prototype = Object.create($ && $.prototype), I.prototype.constructor = I;
            var J = { isMounted: {} };
            return J.isMounted.get = function() {
              return !!this.node;
            }, I.createFromExistingNode = function(V) {
              return new I({ id: V.getAttribute("id"), viewBox: V.getAttribute("viewBox"), content: V.outerHTML });
            }, I.prototype.destroy = function() {
              this.isMounted && this.unmount(), $.prototype.destroy.call(this);
            }, I.prototype.mount = function(V) {
              if (this.isMounted) return this.node;
              var Y = typeof V == "string" ? document.querySelector(V) : V, re = this.render();
              return this.node = re, Y.appendChild(re), re;
            }, I.prototype.render = function() {
              var V = this.stringify();
              return E(y(V)).childNodes[0];
            }, I.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(I.prototype, J), I;
          }(b), w = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, k = function($) {
            return Array.prototype.slice.call($, 0);
          }, g = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, _ = function($, I) {
            var J = document.createEvent("CustomEvent");
            J.initCustomEvent($, !1, !1, I), window.dispatchEvent(J);
          }, j = function($) {
            var I = [];
            return k($.querySelectorAll("style")).forEach(function(J) {
              J.textContent += "", I.push(J);
            }), I;
          }, L = function($) {
            return ($ || window.location.href).split("#")[0];
          }, S = function($) {
            angular.module("ng").run(["$rootScope", function(I) {
              I.$on("$locationChangeSuccess", function(J, V, Y) {
                _($, { oldUrl: Y, newUrl: V });
              });
            }]);
          }, U = "linearGradient, radialGradient, pattern, mask, clipPath", F = function($, I) {
            return I === void 0 && (I = U), k($.querySelectorAll("symbol")).forEach(function(J) {
              k(J.querySelectorAll(I)).forEach(function(V) {
                J.parentNode.insertBefore(V, J);
              });
            }), $;
          };
          function G($, I) {
            var J = k($).reduce(function(V, Y) {
              if (!Y.attributes) return V;
              var re = k(Y.attributes), be = I ? re.filter(I) : re;
              return V.concat(be);
            }, []);
            return J;
          }
          var ne = a.xlink.uri, Q = "xlink:href", M = /[{}|\\\^\[\]`"<>]/g;
          function N($) {
            return $.replace(M, function(I) {
              return "%" + I[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function O($) {
            return $.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function T($, I, J) {
            return k($).forEach(function(V) {
              var Y = V.getAttribute(Q);
              if (Y && Y.indexOf(I) === 0) {
                var re = Y.replace(I, J);
                V.setAttributeNS(ne, Q, re);
              }
            }), $;
          }
          var q, Z = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], D = Z.map(function($) {
            return "[" + $ + "]";
          }).join(","), xe = function($, I, J, V) {
            var Y = N(J), re = N(V), be = $.querySelectorAll(D), he = G(be, function(se) {
              var ke = se.localName, Se = se.value;
              return Z.indexOf(ke) !== -1 && Se.indexOf("url(" + Y) !== -1;
            });
            he.forEach(function(se) {
              return se.value = se.value.replace(new RegExp(O(Y), "g"), re);
            }), T(I, Y, re);
          }, pe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Pe = function($) {
            function I(V) {
              var Y = this;
              V === void 0 && (V = {}), $.call(this, r(w, V));
              var re = t();
              this._emitter = re, this.node = null;
              var be = this, he = be.config;
              if (he.autoConfigure && this._autoConfigure(V), he.syncUrlsWithBaseTag) {
                var se = document.getElementsByTagName("base")[0].getAttribute("href");
                re.on(pe.MOUNT, function() {
                  return Y.updateUrls("#", se);
                });
              }
              var ke = this._handleLocationChange.bind(this);
              this._handleLocationChange = ke, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, ke), he.locationChangeAngularEmitter && S(he.locationChangeEvent), re.on(pe.MOUNT, function(Se) {
                he.moveGradientsOutsideSymbol && F(Se);
              }), re.on(pe.SYMBOL_MOUNT, function(Se) {
                he.moveGradientsOutsideSymbol && F(Se.parentNode), (g.isIE() || g.isEdge()) && j(Se);
              });
            }
            $ && (I.__proto__ = $), I.prototype = Object.create($ && $.prototype), I.prototype.constructor = I;
            var J = { isMounted: {} };
            return J.isMounted.get = function() {
              return !!this.node;
            }, I.prototype._autoConfigure = function(V) {
              var Y = this, re = Y.config;
              typeof V.syncUrlsWithBaseTag > "u" && (re.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof V.locationChangeAngularEmitter > "u" && (re.locationChangeAngularEmitter = typeof window.angular < "u"), typeof V.moveGradientsOutsideSymbol > "u" && (re.moveGradientsOutsideSymbol = g.isFirefox());
            }, I.prototype._handleLocationChange = function(V) {
              var Y = V.detail, re = Y.oldUrl, be = Y.newUrl;
              this.updateUrls(re, be);
            }, I.prototype.add = function(V) {
              var Y = this, re = $.prototype.add.call(this, V);
              return this.isMounted && re && (V.mount(Y.node), this._emitter.emit(pe.SYMBOL_MOUNT, V.node)), re;
            }, I.prototype.attach = function(V) {
              var Y = this, re = this;
              if (re.isMounted) return re.node;
              var be = typeof V == "string" ? document.querySelector(V) : V;
              return re.node = be, this.symbols.forEach(function(he) {
                he.mount(re.node), Y._emitter.emit(pe.SYMBOL_MOUNT, he.node);
              }), k(be.querySelectorAll("symbol")).forEach(function(he) {
                var se = A.createFromExistingNode(he);
                se.node = he, re.add(se);
              }), this._emitter.emit(pe.MOUNT, be), be;
            }, I.prototype.destroy = function() {
              var V = this, Y = V.config, re = V.symbols, be = V._emitter;
              re.forEach(function(he) {
                return he.destroy();
              }), be.off("*"), window.removeEventListener(Y.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, I.prototype.mount = function(V, Y) {
              V === void 0 && (V = this.config.mountTo), Y === void 0 && (Y = !1);
              var re = this;
              if (re.isMounted) return re.node;
              var be = typeof V == "string" ? document.querySelector(V) : V, he = re.render();
              return this.node = he, Y && be.childNodes[0] ? be.insertBefore(he, be.childNodes[0]) : be.appendChild(he), this._emitter.emit(pe.MOUNT, he), he;
            }, I.prototype.render = function() {
              return E(this.stringify());
            }, I.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, I.prototype.updateUrls = function(V, Y) {
              if (!this.isMounted) return !1;
              var re = document.querySelectorAll(this.config.usagesToUpdate);
              return xe(this.node, re, L(V) + "#", L(Y) + "#"), !0;
            }, Object.defineProperties(I.prototype, J), I;
          }(h), Be = o(function($) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(I, J) {
              $.exports = J();
            })(0, function() {
              var I, J = [], V = document, Y = V.documentElement.doScroll, re = "DOMContentLoaded", be = (Y ? /^loaded|^c/ : /^loaded|^i|^c/).test(V.readyState);
              return be || V.addEventListener(re, I = function() {
                for (V.removeEventListener(re, I), be = 1; I = J.shift(); ) I();
              }), function(he) {
                be ? setTimeout(he, 0) : J.push(he);
              };
            });
          }), Ie = "__SVG_SPRITE_NODE__", Ae = "__SVG_SPRITE__", Le = !!window[Ae];
          Le ? q = window[Ae] : (q = new Pe({ attrs: { id: Ie, "aria-hidden": "true" } }), window[Ae] = q);
          var Qe = function() {
            var $ = document.getElementById(Ie);
            $ ? q.attach($) : q.mount(document.body, !0);
          };
          document.body ? Qe() : Be(Qe);
          var it = q;
          return it;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, d, e) {
      var n = e("825a"), o = e("e95a"), r = e("50c4"), t = e("0366"), a = e("35a1"), u = e("2a62"), s = function(l, c) {
        this.stopped = l, this.result = c;
      };
      i.exports = function(l, c, f) {
        var y, p, v, m, h, b, E, A = f && f.that, w = !(!f || !f.AS_ENTRIES), k = !(!f || !f.IS_ITERATOR), g = !(!f || !f.INTERRUPTED), _ = t(c, A, 1 + w + g), j = function(S) {
          return y && u(y), new s(!0, S);
        }, L = function(S) {
          return w ? (n(S), g ? _(S[0], S[1], j) : _(S[0], S[1])) : g ? _(S, j) : _(S);
        };
        if (k) y = l;
        else {
          if (p = a(l), typeof p != "function") throw TypeError("Target is not iterable");
          if (o(p)) {
            for (v = 0, m = r(l.length); m > v; v++) if (h = L(l[v]), h && h instanceof s) return h;
            return new s(!1);
          }
          y = p.call(l);
        }
        for (b = y.next; !(E = b.call(y)).done; ) {
          try {
            h = L(E.value);
          } catch (S) {
            throw u(y), S;
          }
          if (typeof h == "object" && h && h instanceof s) return h;
        }
        return new s(!1);
      };
    }, "23cb": function(i, d, e) {
      var n = e("a691"), o = Math.max, r = Math.min;
      i.exports = function(t, a) {
        var u = n(t);
        return u < 0 ? o(u + a, 0) : r(u, a);
      };
    }, "23e7": function(i, d, e) {
      var n = e("da84"), o = e("06cf").f, r = e("9112"), t = e("6eeb"), a = e("ce4e"), u = e("e893"), s = e("94ca");
      i.exports = function(l, c) {
        var f, y, p, v, m, h, b = l.target, E = l.global, A = l.stat;
        if (y = E ? n : A ? n[b] || a(b, {}) : (n[b] || {}).prototype, y) for (p in c) {
          if (m = c[p], l.noTargetGet ? (h = o(y, p), v = h && h.value) : v = y[p], f = s(E ? p : b + (A ? "." : "#") + p, l.forced), !f && v !== void 0) {
            if (typeof m == typeof v) continue;
            u(m, v);
          }
          (l.sham || v && v.sham) && r(m, "sham", !0), t(y, p, m, l);
        }
      };
    }, "241c": function(i, d, e) {
      var n = e("ca84"), o = e("7839"), r = o.concat("length", "prototype");
      d.f = Object.getOwnPropertyNames || function(t) {
        return n(t, r);
      };
    }, 2444: function(i, d, e) {
      (function(n) {
        var o = e("c532"), r = e("c8af"), t = { "Content-Type": "application/x-www-form-urlencoded" };
        function a(l, c) {
          !o.isUndefined(l) && o.isUndefined(l["Content-Type"]) && (l["Content-Type"] = c);
        }
        function u() {
          var l;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (l = e("b50d")), l;
        }
        var s = { adapter: u(), transformRequest: [function(l, c) {
          return r(c, "Accept"), r(c, "Content-Type"), o.isFormData(l) || o.isArrayBuffer(l) || o.isBuffer(l) || o.isStream(l) || o.isFile(l) || o.isBlob(l) ? l : o.isArrayBufferView(l) ? l.buffer : o.isURLSearchParams(l) ? (a(c, "application/x-www-form-urlencoded;charset=utf-8"), l.toString()) : o.isObject(l) ? (a(c, "application/json;charset=utf-8"), JSON.stringify(l)) : l;
        }], transformResponse: [function(l) {
          if (typeof l == "string") try {
            l = JSON.parse(l);
          } catch {
          }
          return l;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(l) {
          return l >= 200 && l < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        o.forEach(["delete", "get", "head"], function(l) {
          s.headers[l] = {};
        }), o.forEach(["post", "put", "patch"], function(l) {
          s.headers[l] = o.merge(t);
        }), i.exports = s;
      }).call(this, e("4362"));
    }, 2532: function(i, d, e) {
      var n = e("23e7"), o = e("5a34"), r = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(a) {
        return !!~String(r(this)).indexOf(o(a), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, d, e) {
      var n = e("6eeb"), o = e("825a"), r = e("d039"), t = e("ad6d"), a = "toString", u = RegExp.prototype, s = u[a], l = r(function() {
        return s.call({ source: "a", flags: "b" }) != "/a/b";
      }), c = s.name != a;
      (l || c) && n(RegExp.prototype, a, function() {
        var f = o(this), y = String(f.source), p = f.flags, v = String(p === void 0 && f instanceof RegExp && !("flags" in u) ? t.call(f) : p);
        return "/" + y + "/" + v;
      }, { unsafe: !0 });
    }, 2626: function(i, d, e) {
      var n = e("d066"), o = e("9bf2"), r = e("b622"), t = e("83ab"), a = r("species");
      i.exports = function(u) {
        var s = n(u), l = o.f;
        t && s && !s[a] && l(s, a, { configurable: !0, get: function() {
          return this;
        } });
      };
    }, "2a62": function(i, d, e) {
      var n = e("825a");
      i.exports = function(o) {
        var r = o.return;
        if (r !== void 0) return n(r.call(o)).value;
      };
    }, "2cf4": function(i, d, e) {
      var n, o, r, t = e("da84"), a = e("d039"), u = e("0366"), s = e("1be4"), l = e("cc12"), c = e("1cdc"), f = e("605d"), y = t.location, p = t.setImmediate, v = t.clearImmediate, m = t.process, h = t.MessageChannel, b = t.Dispatch, E = 0, A = {}, w = "onreadystatechange", k = function(L) {
        if (A.hasOwnProperty(L)) {
          var S = A[L];
          delete A[L], S();
        }
      }, g = function(L) {
        return function() {
          k(L);
        };
      }, _ = function(L) {
        k(L.data);
      }, j = function(L) {
        t.postMessage(L + "", y.protocol + "//" + y.host);
      };
      p && v || (p = function(L) {
        for (var S = [], U = 1; arguments.length > U; ) S.push(arguments[U++]);
        return A[++E] = function() {
          (typeof L == "function" ? L : Function(L)).apply(void 0, S);
        }, n(E), E;
      }, v = function(L) {
        delete A[L];
      }, f ? n = function(L) {
        m.nextTick(g(L));
      } : b && b.now ? n = function(L) {
        b.now(g(L));
      } : h && !c ? (o = new h(), r = o.port2, o.port1.onmessage = _, n = u(r.postMessage, r, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && y && y.protocol !== "file:" && !a(j) ? (n = j, t.addEventListener("message", _, !1)) : n = w in l("script") ? function(L) {
        s.appendChild(l("script"))[w] = function() {
          s.removeChild(this), k(L);
        };
      } : function(L) {
        setTimeout(g(L), 0);
      }), i.exports = { set: p, clear: v };
    }, "2d00": function(i, d, e) {
      var n, o, r = e("da84"), t = e("342f"), a = r.process, u = a && a.versions, s = u && u.v8;
      s ? (n = s.split("."), o = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (o = n[1]))), i.exports = o && +o;
    }, "2d83": function(i, d, e) {
      var n = e("387f");
      i.exports = function(o, r, t, a, u) {
        var s = new Error(o);
        return n(s, r, t, a, u);
      };
    }, "2e67": function(i, d, e) {
      i.exports = function(n) {
        return !(!n || !n.__CANCEL__);
      };
    }, "30b5": function(i, d, e) {
      var n = e("c532");
      function o(r) {
        return encodeURIComponent(r).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      }
      i.exports = function(r, t, a) {
        if (!t) return r;
        var u;
        if (a) u = a(t);
        else if (n.isURLSearchParams(t)) u = t.toString();
        else {
          var s = [];
          n.forEach(t, function(c, f) {
            c !== null && typeof c < "u" && (n.isArray(c) ? f += "[]" : c = [c], n.forEach(c, function(y) {
              n.isDate(y) ? y = y.toISOString() : n.isObject(y) && (y = JSON.stringify(y)), s.push(o(f) + "=" + o(y));
            }));
          }), u = s.join("&");
        }
        if (u) {
          var l = r.indexOf("#");
          l !== -1 && (r = r.slice(0, l)), r += (r.indexOf("?") === -1 ? "?" : "&") + u;
        }
        return r;
      };
    }, "342f": function(i, d, e) {
      var n = e("d066");
      i.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(i, d, e) {
      var n = e("f5df"), o = e("3f8c"), r = e("b622"), t = r("iterator");
      i.exports = function(a) {
        if (a != null) return a[t] || a["@@iterator"] || o[n(a)];
      };
    }, "37e8": function(i, d, e) {
      var n = e("83ab"), o = e("9bf2"), r = e("825a"), t = e("df75");
      i.exports = n ? Object.defineProperties : function(a, u) {
        r(a);
        for (var s, l = t(u), c = l.length, f = 0; c > f; ) o.f(a, s = l[f++], u[s]);
        return a;
      };
    }, "387f": function(i, d, e) {
      i.exports = function(n, o, r, t, a) {
        return n.config = o, r && (n.code = r), n.request = t, n.response = a, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(i, d, e) {
      e("acce");
    }, 3934: function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? function() {
        var o, r = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function a(u) {
          var s = u;
          return r && (t.setAttribute("href", s), s = t.href), t.setAttribute("href", s), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return o = a(window.location.href), function(u) {
          var s = n.isString(u) ? a(u) : u;
          return s.protocol === o.protocol && s.host === o.host;
        };
      }() : /* @__PURE__ */ function() {
        return function() {
          return !0;
        };
      }();
    }, "3bbe": function(i, d, e) {
      var n = e("861d");
      i.exports = function(o) {
        if (!n(o) && o !== null) throw TypeError("Can't set " + String(o) + " as a prototype");
        return o;
      };
    }, "3ca3": function(i, d, e) {
      var n = e("6547").charAt, o = e("69f3"), r = e("7dd0"), t = "String Iterator", a = o.set, u = o.getterFor(t);
      r(String, "String", function(s) {
        a(this, { type: t, string: String(s), index: 0 });
      }, function() {
        var s, l = u(this), c = l.string, f = l.index;
        return f >= c.length ? { value: void 0, done: !0 } : (s = n(c, f), l.index += s.length, { value: s, done: !1 });
      });
    }, "3f8c": function(i, d) {
      i.exports = {};
    }, "408a": function(i, d, e) {
      var n = e("c6b6");
      i.exports = function(o) {
        if (typeof o != "number" && n(o) != "Number") throw TypeError("Incorrect invocation");
        return +o;
      };
    }, "428f": function(i, d, e) {
      var n = e("da84");
      i.exports = n;
    }, 4362: function(i, d, e) {
      d.nextTick = function(n) {
        var o = Array.prototype.slice.call(arguments);
        o.shift(), setTimeout(function() {
          n.apply(null, o);
        }, 0);
      }, d.platform = d.arch = d.execPath = d.title = "browser", d.pid = 1, d.browser = !0, d.env = {}, d.argv = [], d.binding = function(n) {
        throw new Error("No such module. (Possibly not yet loaded)");
      }, function() {
        var n, o = "/";
        d.cwd = function() {
          return o;
        }, d.chdir = function(r) {
          n || (n = e("df7c")), o = n.resolve(r, o);
        };
      }(), d.exit = d.kill = d.umask = d.dlopen = d.uptime = d.memoryUsage = d.uvCounters = function() {
      }, d.features = {};
    }, "44ad": function(i, d, e) {
      var n = e("d039"), o = e("c6b6"), r = "".split;
      i.exports = n(function() {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function(t) {
        return o(t) == "String" ? r.call(t, "") : Object(t);
      } : Object;
    }, "44d2": function(i, d, e) {
      var n = e("b622"), o = e("7c73"), r = e("9bf2"), t = n("unscopables"), a = Array.prototype;
      a[t] == null && r.f(a, t, { configurable: !0, value: o(null) }), i.exports = function(u) {
        a[t][u] = !0;
      };
    }, "44de": function(i, d, e) {
      var n = e("da84");
      i.exports = function(o, r) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(o) : t.error(o, r));
      };
    }, "44e7": function(i, d, e) {
      var n = e("861d"), o = e("c6b6"), r = e("b622"), t = r("match");
      i.exports = function(a) {
        var u;
        return n(a) && ((u = a[t]) !== void 0 ? !!u : o(a) == "RegExp");
      };
    }, "466d": function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("1d80"), a = e("8aa5"), u = e("14c3");
      n("match", 1, function(s, l, c) {
        return [function(f) {
          var y = t(this), p = f == null ? void 0 : f[s];
          return p !== void 0 ? p.call(f, y) : new RegExp(f)[s](String(y));
        }, function(f) {
          var y = c(l, f, this);
          if (y.done) return y.value;
          var p = o(f), v = String(this);
          if (!p.global) return u(p, v);
          var m = p.unicode;
          p.lastIndex = 0;
          for (var h, b = [], E = 0; (h = u(p, v)) !== null; ) {
            var A = String(h[0]);
            b[E] = A, A === "" && (p.lastIndex = a(v, r(p.lastIndex), m)), E++;
          }
          return E === 0 ? null : b;
        }];
      });
    }, "467f": function(i, d, e) {
      var n = e("2d83");
      i.exports = function(o, r, t) {
        var a = t.config.validateStatus;
        t.status && a && !a(t.status) ? r(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : o(t);
      };
    }, 4840: function(i, d, e) {
      var n = e("825a"), o = e("1c0b"), r = e("b622"), t = r("species");
      i.exports = function(a, u) {
        var s, l = n(a).constructor;
        return l === void 0 || (s = n(l)[t]) == null ? u : o(s);
      };
    }, 4930: function(i, d, e) {
      var n = e("605d"), o = e("2d00"), r = e("d039");
      i.exports = !!Object.getOwnPropertySymbols && !r(function() {
        return !Symbol.sham && (n ? o === 38 : o > 37 && o < 41);
      });
    }, "4a7b": function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r) {
        r = r || {};
        var t = {}, a = ["url", "method", "data"], u = ["headers", "auth", "proxy", "params"], s = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], l = ["validateStatus"];
        function c(v, m) {
          return n.isPlainObject(v) && n.isPlainObject(m) ? n.merge(v, m) : n.isPlainObject(m) ? n.merge({}, m) : n.isArray(m) ? m.slice() : m;
        }
        function f(v) {
          n.isUndefined(r[v]) ? n.isUndefined(o[v]) || (t[v] = c(void 0, o[v])) : t[v] = c(o[v], r[v]);
        }
        n.forEach(a, function(v) {
          n.isUndefined(r[v]) || (t[v] = c(void 0, r[v]));
        }), n.forEach(u, f), n.forEach(s, function(v) {
          n.isUndefined(r[v]) ? n.isUndefined(o[v]) || (t[v] = c(void 0, o[v])) : t[v] = c(void 0, r[v]);
        }), n.forEach(l, function(v) {
          v in r ? t[v] = c(o[v], r[v]) : v in o && (t[v] = c(void 0, o[v]));
        });
        var y = a.concat(u).concat(s).concat(l), p = Object.keys(o).concat(Object.keys(r)).filter(function(v) {
          return y.indexOf(v) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(i, d, e) {
      var n = e("83ab"), o = e("da84"), r = e("94ca"), t = e("7156"), a = e("9bf2").f, u = e("241c").f, s = e("44e7"), l = e("ad6d"), c = e("9f7f"), f = e("6eeb"), y = e("d039"), p = e("69f3").set, v = e("2626"), m = e("b622"), h = m("match"), b = o.RegExp, E = b.prototype, A = /a/g, w = /a/g, k = new b(A) !== A, g = c.UNSUPPORTED_Y, _ = n && r("RegExp", !k || g || y(function() {
        return w[h] = !1, b(A) != A || b(w) == w || b(A, "i") != "/a/i";
      }));
      if (_) {
        for (var j = function(F, G) {
          var ne, Q = this instanceof j, M = s(F), N = G === void 0;
          if (!Q && M && F.constructor === j && N) return F;
          k ? M && !N && (F = F.source) : F instanceof j && (N && (G = l.call(F)), F = F.source), g && (ne = !!G && G.indexOf("y") > -1, ne && (G = G.replace(/y/g, "")));
          var O = t(k ? new b(F, G) : b(F, G), Q ? this : E, j);
          return g && ne && p(O, { sticky: ne }), O;
        }, L = function(F) {
          F in j || a(j, F, { configurable: !0, get: function() {
            return b[F];
          }, set: function(G) {
            b[F] = G;
          } });
        }, S = u(b), U = 0; S.length > U; ) L(S[U++]);
        E.constructor = j, j.prototype = E, f(o, "RegExp", j);
      }
      v("RegExp");
    }, "4d64": function(i, d, e) {
      var n = e("fc6a"), o = e("50c4"), r = e("23cb"), t = function(a) {
        return function(u, s, l) {
          var c, f = n(u), y = o(f.length), p = r(l, y);
          if (a && s != s) {
            for (; y > p; ) if (c = f[p++], c != c) return !0;
          } else for (; y > p; p++) if ((a || p in f) && f[p] === s) return a || p || 0;
          return !a && -1;
        };
      };
      i.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(i, d, e) {
      var n = e("23e7"), o = e("b727").filter, r = e("1dde"), t = r("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(a) {
        return o(this, a, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(i, d, e) {
      var n = e("0366"), o = e("7b0b"), r = e("9bdd"), t = e("e95a"), a = e("50c4"), u = e("8418"), s = e("35a1");
      i.exports = function(l) {
        var c, f, y, p, v, m, h = o(l), b = typeof this == "function" ? this : Array, E = arguments.length, A = E > 1 ? arguments[1] : void 0, w = A !== void 0, k = s(h), g = 0;
        if (w && (A = n(A, E > 2 ? arguments[2] : void 0, 2)), k == null || b == Array && t(k)) for (c = a(h.length), f = new b(c); c > g; g++) m = w ? A(h[g], g) : h[g], u(f, g, m);
        else for (p = k.call(h), v = p.next, f = new b(); !(y = v.call(p)).done; g++) m = w ? r(p, A, [y.value, g], !0) : y.value, u(f, g, m);
        return f.length = g, f;
      };
    }, "4f43": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-close", use: "icon-close-usage", viewBox: "0 0 50 35.93", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35.93" id="icon-close">\r
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
      t.a.add(a), d.default = a;
    }, "50c4": function(i, d, e) {
      var n = e("a691"), o = Math.min;
      i.exports = function(r) {
        return r > 0 ? o(n(r), 9007199254740991) : 0;
      };
    }, 5135: function(i, d) {
      var e = {}.hasOwnProperty;
      i.exports = function(n, o) {
        return e.call(n, o);
      };
    }, 5270: function(i, d, e) {
      var n = e("c532"), o = e("c401"), r = e("2e67"), t = e("2444");
      function a(u) {
        u.cancelToken && u.cancelToken.throwIfRequested();
      }
      i.exports = function(u) {
        a(u), u.headers = u.headers || {}, u.data = o(u.data, u.headers, u.transformRequest), u.headers = n.merge(u.headers.common || {}, u.headers[u.method] || {}, u.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(l) {
          delete u.headers[l];
        });
        var s = u.adapter || t.adapter;
        return s(u).then(function(l) {
          return a(u), l.data = o(l.data, l.headers, u.transformResponse), l;
        }, function(l) {
          return r(l) || (a(u), l && l.response && (l.response.data = o(l.response.data, l.response.headers, u.transformResponse))), Promise.reject(l);
        });
      };
    }, 5319: function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("a691"), a = e("1d80"), u = e("8aa5"), s = e("0cb2"), l = e("14c3"), c = Math.max, f = Math.min, y = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, v, m, h) {
        var b = h.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, E = h.REPLACE_KEEPS_$0, A = b ? "$" : "$0";
        return [function(w, k) {
          var g = a(this), _ = w == null ? void 0 : w[p];
          return _ !== void 0 ? _.call(w, g, k) : v.call(String(g), w, k);
        }, function(w, k) {
          if (!b && E || typeof k == "string" && k.indexOf(A) === -1) {
            var g = m(v, w, this, k);
            if (g.done) return g.value;
          }
          var _ = o(w), j = String(this), L = typeof k == "function";
          L || (k = String(k));
          var S = _.global;
          if (S) {
            var U = _.unicode;
            _.lastIndex = 0;
          }
          for (var F = []; ; ) {
            var G = l(_, j);
            if (G === null || (F.push(G), !S)) break;
            var ne = String(G[0]);
            ne === "" && (_.lastIndex = u(j, r(_.lastIndex), U));
          }
          for (var Q = "", M = 0, N = 0; N < F.length; N++) {
            G = F[N];
            for (var O = String(G[0]), T = c(f(t(G.index), j.length), 0), q = [], Z = 1; Z < G.length; Z++) q.push(y(G[Z]));
            var D = G.groups;
            if (L) {
              var xe = [O].concat(q, T, j);
              D !== void 0 && xe.push(D);
              var pe = String(k.apply(void 0, xe));
            } else pe = s(O, j, T, q, D, k);
            T >= M && (Q += j.slice(M, T) + pe, M = T + O.length);
          }
          return Q + j.slice(M);
        }];
      });
    }, "545a": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
    }, 5530: function(i, d, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, o) {
        var r = n.document, t = r.documentElement, a = r.querySelector('meta[name="viewport"]'), u = r.querySelector('meta[name="flexible"]'), s = 0, l = 0, c = o.flexible || (o.flexible = {});
        if (a) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = a.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (l = parseFloat(f[1]), s = parseInt(1 / l));
        } else if (u) {
          var y = u.getAttribute("content");
          if (y) {
            var p = y.match(/initial\-dpr=([\d\.]+)/), v = y.match(/maximum\-dpr=([\d\.]+)/);
            p && (s = parseFloat(p[1]), l = parseFloat((1 / s).toFixed(2))), v && (s = parseFloat(v[1]), l = parseFloat((1 / s).toFixed(2)));
          }
        }
        if (!s && !l) {
          n.navigator.appVersion.match(/android/gi);
          var m = n.navigator.appVersion.match(/iphone/gi), h = n.devicePixelRatio;
          s = m ? h >= 3 && (!s || s >= 3) ? 3 : h >= 2 && (!s || s >= 2) ? 2 : 1 : 1, l = 1 / s;
        }
        if (t.setAttribute("data-dpr", s), !a) if (a = r.createElement("meta"), a.setAttribute("name", "viewport"), a.setAttribute("content", "initial-scale=" + l + ", maximum-scale=" + l + ", minimum-scale=" + l + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(a);
        else {
          var b = r.createElement("div");
          b.appendChild(a), r.write(b.innerHTML);
        }
        function E() {
          var A = t.getBoundingClientRect().width, w = A / 10;
          t.style.fontSize = w + "px", c.rem = n.rem = w;
        }
        n.addEventListener("resize", function() {
          E();
        }, !1), n.addEventListener("pageshow", function(A) {
          A.persisted && E();
        }, !1), r.readyState === "complete" ? r.body.style.fontSize = 10 * s + "px" : r.addEventListener("DOMContentLoaded", function(A) {
          r.body.style.fontSize = 10 * s + "px";
        }, !1), E(), c.dpr = n.dpr = s, c.refreshRem = E, c.rem2px = function(A) {
          var w = parseFloat(A) * this.rem;
          return typeof A == "string" && A.match(/rem$/) && (w += "px"), w;
        }, c.px2rem = function(A) {
          var w = parseFloat(A) / this.rem;
          return typeof A == "string" && A.match(/px$/) && (w += "rem"), w;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(i, d, e) {
      var n = e("c430"), o = e("c6cd");
      (i.exports = function(r, t) {
        return o[r] || (o[r] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(i, d, e) {
      var n = e("d066"), o = e("241c"), r = e("7418"), t = e("825a");
      i.exports = n("Reflect", "ownKeys") || function(a) {
        var u = o.f(t(a)), s = r.f;
        return s ? u.concat(s(a)) : u;
      };
    }, "5a34": function(i, d, e) {
      var n = e("44e7");
      i.exports = function(o) {
        if (n(o)) throw TypeError("The method doesn't accept regular expressions");
        return o;
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
      var n = e("c6b6"), o = e("da84");
      i.exports = n(o.process) == "process";
    }, 6062: function(i, d, e) {
      var n = e("6d61"), o = e("6566");
      i.exports = n("Set", function(r) {
        return function() {
          return r(this, arguments.length ? arguments[0] : void 0);
        };
      }, o);
    }, 6547: function(i, d, e) {
      var n = e("a691"), o = e("1d80"), r = function(t) {
        return function(a, u) {
          var s, l, c = String(o(a)), f = n(u), y = c.length;
          return f < 0 || f >= y ? t ? "" : void 0 : (s = c.charCodeAt(f), s < 55296 || s > 56319 || f + 1 === y || (l = c.charCodeAt(f + 1)) < 56320 || l > 57343 ? t ? c.charAt(f) : s : t ? c.slice(f, f + 2) : l - 56320 + (s - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: r(!1), charAt: r(!0) };
    }, 6566: function(i, d, e) {
      var n = e("9bf2").f, o = e("7c73"), r = e("e2cc"), t = e("0366"), a = e("19aa"), u = e("2266"), s = e("7dd0"), l = e("2626"), c = e("83ab"), f = e("f183").fastKey, y = e("69f3"), p = y.set, v = y.getterFor;
      i.exports = { getConstructor: function(m, h, b, E) {
        var A = m(function(_, j) {
          a(_, A, h), p(_, { type: h, index: o(null), first: void 0, last: void 0, size: 0 }), c || (_.size = 0), j != null && u(j, _[E], { that: _, AS_ENTRIES: b });
        }), w = v(h), k = function(_, j, L) {
          var S, U, F = w(_), G = g(_, j);
          return G ? G.value = L : (F.last = G = { index: U = f(j, !0), key: j, value: L, previous: S = F.last, next: void 0, removed: !1 }, F.first || (F.first = G), S && (S.next = G), c ? F.size++ : _.size++, U !== "F" && (F.index[U] = G)), _;
        }, g = function(_, j) {
          var L, S = w(_), U = f(j);
          if (U !== "F") return S.index[U];
          for (L = S.first; L; L = L.next) if (L.key == j) return L;
        };
        return r(A.prototype, { clear: function() {
          for (var _ = this, j = w(_), L = j.index, S = j.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete L[S.index], S = S.next;
          j.first = j.last = void 0, c ? j.size = 0 : _.size = 0;
        }, delete: function(_) {
          var j = this, L = w(j), S = g(j, _);
          if (S) {
            var U = S.next, F = S.previous;
            delete L.index[S.index], S.removed = !0, F && (F.next = U), U && (U.previous = F), L.first == S && (L.first = U), L.last == S && (L.last = F), c ? L.size-- : j.size--;
          }
          return !!S;
        }, forEach: function(_) {
          for (var j, L = w(this), S = t(_, arguments.length > 1 ? arguments[1] : void 0, 3); j = j ? j.next : L.first; )
            for (S(j.value, j.key, this); j && j.removed; ) j = j.previous;
        }, has: function(_) {
          return !!g(this, _);
        } }), r(A.prototype, b ? { get: function(_) {
          var j = g(this, _);
          return j && j.value;
        }, set: function(_, j) {
          return k(this, _ === 0 ? 0 : _, j);
        } } : { add: function(_) {
          return k(this, _ = _ === 0 ? 0 : _, _);
        } }), c && n(A.prototype, "size", { get: function() {
          return w(this).size;
        } }), A;
      }, setStrong: function(m, h, b) {
        var E = h + " Iterator", A = v(h), w = v(E);
        s(m, h, function(k, g) {
          p(this, { type: E, target: k, state: A(k), kind: g, last: void 0 });
        }, function() {
          for (var k = w(this), g = k.kind, _ = k.last; _ && _.removed; ) _ = _.previous;
          return k.target && (k.last = _ = _ ? _.next : k.state.first) ? g == "keys" ? { value: _.key, done: !1 } : g == "values" ? { value: _.value, done: !1 } : { value: [_.key, _.value], done: !1 } : (k.target = void 0, { value: void 0, done: !0 });
        }, b ? "entries" : "values", !b, !0), l(h);
      } };
    }, "65f0": function(i, d, e) {
      var n = e("861d"), o = e("e8b5"), r = e("b622"), t = r("species");
      i.exports = function(a, u) {
        var s;
        return o(a) && (s = a.constructor, typeof s != "function" || s !== Array && !o(s.prototype) ? n(s) && (s = s[t], s === null && (s = void 0)) : s = void 0), new (s === void 0 ? Array : s)(u === 0 ? 0 : u);
      };
    }, "69f3": function(i, d, e) {
      var n, o, r, t = e("7f9a"), a = e("da84"), u = e("861d"), s = e("9112"), l = e("5135"), c = e("c6cd"), f = e("f772"), y = e("d012"), p = a.WeakMap, v = function(k) {
        return r(k) ? o(k) : n(k, {});
      }, m = function(k) {
        return function(g) {
          var _;
          if (!u(g) || (_ = o(g)).type !== k) throw TypeError("Incompatible receiver, " + k + " required");
          return _;
        };
      };
      if (t) {
        var h = c.state || (c.state = new p()), b = h.get, E = h.has, A = h.set;
        n = function(k, g) {
          return g.facade = k, A.call(h, k, g), g;
        }, o = function(k) {
          return b.call(h, k) || {};
        }, r = function(k) {
          return E.call(h, k);
        };
      } else {
        var w = f("state");
        y[w] = !0, n = function(k, g) {
          return g.facade = k, s(k, w, g), g;
        }, o = function(k) {
          return l(k, w) ? k[w] : {};
        }, r = function(k) {
          return l(k, w);
        };
      }
      i.exports = { set: n, get: o, has: r, enforce: v, getterFor: m };
    }, "6d55": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
    }, "6d61": function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("94ca"), t = e("6eeb"), a = e("f183"), u = e("2266"), s = e("19aa"), l = e("861d"), c = e("d039"), f = e("1c7e"), y = e("d44e"), p = e("7156");
      i.exports = function(v, m, h) {
        var b = v.indexOf("Map") !== -1, E = v.indexOf("Weak") !== -1, A = b ? "set" : "add", w = o[v], k = w && w.prototype, g = w, _ = {}, j = function(Q) {
          var M = k[Q];
          t(k, Q, Q == "add" ? function(N) {
            return M.call(this, N === 0 ? 0 : N), this;
          } : Q == "delete" ? function(N) {
            return !(E && !l(N)) && M.call(this, N === 0 ? 0 : N);
          } : Q == "get" ? function(N) {
            return E && !l(N) ? void 0 : M.call(this, N === 0 ? 0 : N);
          } : Q == "has" ? function(N) {
            return !(E && !l(N)) && M.call(this, N === 0 ? 0 : N);
          } : function(N, O) {
            return M.call(this, N === 0 ? 0 : N, O), this;
          });
        }, L = r(v, typeof w != "function" || !(E || k.forEach && !c(function() {
          new w().entries().next();
        })));
        if (L) g = h.getConstructor(m, v, b, A), a.REQUIRED = !0;
        else if (r(v, !0)) {
          var S = new g(), U = S[A](E ? {} : -0, 1) != S, F = c(function() {
            S.has(1);
          }), G = f(function(Q) {
            new w(Q);
          }), ne = !E && c(function() {
            for (var Q = new w(), M = 5; M--; ) Q[A](M, M);
            return !Q.has(-0);
          });
          G || (g = m(function(Q, M) {
            s(Q, g, v);
            var N = p(new w(), Q, g);
            return M != null && u(M, N[A], { that: N, AS_ENTRIES: b }), N;
          }), g.prototype = k, k.constructor = g), (F || ne) && (j("delete"), j("has"), b && j("get")), (ne || U) && j(A), E && k.clear && delete k.clear;
        }
        return _[v] = g, n({ global: !0, forced: g != w }, _), y(g, v), E || h.setStrong(g, v, b), g;
      };
    }, "6eeb": function(i, d, e) {
      var n = e("da84"), o = e("9112"), r = e("5135"), t = e("ce4e"), a = e("8925"), u = e("69f3"), s = u.get, l = u.enforce, c = String(String).split("String");
      (i.exports = function(f, y, p, v) {
        var m, h = !!v && !!v.unsafe, b = !!v && !!v.enumerable, E = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof y != "string" || r(p, "name") || o(p, "name", y), m = l(p), m.source || (m.source = c.join(typeof y == "string" ? y : ""))), f !== n ? (h ? !E && f[y] && (b = !0) : delete f[y], b ? f[y] = p : o(f, y, p)) : b ? f[y] = p : t(y, p);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && s(this).source || a(this);
      });
    }, "70d3": function(i, d, e) {
    }, 7156: function(i, d, e) {
      var n = e("861d"), o = e("d2bb");
      i.exports = function(r, t, a) {
        var u, s;
        return o && typeof (u = t.constructor) == "function" && u !== a && n(s = u.prototype) && s !== a.prototype && o(r, s), r;
      };
    }, 7305: function(i, d, e) {
    }, 7320: function(i, d, e) {
    }, 7418: function(i, d) {
      d.f = Object.getOwnPropertySymbols;
    }, "746f": function(i, d, e) {
      var n = e("428f"), o = e("5135"), r = e("e538"), t = e("9bf2").f;
      i.exports = function(a) {
        var u = n.Symbol || (n.Symbol = {});
        o(u, a) || t(u, a, { value: r.f(a) });
      };
    }, 7839: function(i, d) {
      i.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"];
    }, "7a77": function(i, d, e) {
      function n(o) {
        this.message = o;
      }
      n.prototype.toString = function() {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }, n.prototype.__CANCEL__ = !0, i.exports = n;
    }, "7aac": function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? /* @__PURE__ */ function() {
        return { write: function(o, r, t, a, u, s) {
          var l = [];
          l.push(o + "=" + encodeURIComponent(r)), n.isNumber(t) && l.push("expires=" + new Date(t).toGMTString()), n.isString(a) && l.push("path=" + a), n.isString(u) && l.push("domain=" + u), s === !0 && l.push("secure"), document.cookie = l.join("; ");
        }, read: function(o) {
          var r = document.cookie.match(new RegExp("(^|;\\s*)(" + o + ")=([^;]*)"));
          return r ? decodeURIComponent(r[3]) : null;
        }, remove: function(o) {
          this.write(o, "", Date.now() - 864e5);
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
      i.exports = function(o) {
        return Object(n(o));
      };
    }, "7c73": function(i, d, e) {
      var n, o = e("825a"), r = e("37e8"), t = e("7839"), a = e("d012"), u = e("1be4"), s = e("cc12"), l = e("f772"), c = ">", f = "<", y = "prototype", p = "script", v = l("IE_PROTO"), m = function() {
      }, h = function(w) {
        return f + p + c + w + f + "/" + p + c;
      }, b = function(w) {
        w.write(h("")), w.close();
        var k = w.parentWindow.Object;
        return w = null, k;
      }, E = function() {
        var w, k = s("iframe"), g = "java" + p + ":";
        return k.style.display = "none", u.appendChild(k), k.src = String(g), w = k.contentWindow.document, w.open(), w.write(h("document.F=Object")), w.close(), w.F;
      }, A = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        A = n ? b(n) : E();
        for (var w = t.length; w--; ) delete A[y][t[w]];
        return A();
      };
      a[v] = !0, i.exports = Object.create || function(w, k) {
        var g;
        return w !== null ? (m[y] = o(w), g = new m(), m[y] = null, g[v] = w) : g = A(), k === void 0 ? g : r(g, k);
      };
    }, "7db0": function(i, d, e) {
      var n = e("23e7"), o = e("b727").find, r = e("44d2"), t = "find", a = !0;
      t in [] && Array(1)[t](function() {
        a = !1;
      }), n({ target: "Array", proto: !0, forced: a }, { find: function(u) {
        return o(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } }), r(t);
    }, "7dd0": function(i, d, e) {
      var n = e("23e7"), o = e("9ed3"), r = e("e163"), t = e("d2bb"), a = e("d44e"), u = e("9112"), s = e("6eeb"), l = e("b622"), c = e("c430"), f = e("3f8c"), y = e("ae93"), p = y.IteratorPrototype, v = y.BUGGY_SAFARI_ITERATORS, m = l("iterator"), h = "keys", b = "values", E = "entries", A = function() {
        return this;
      };
      i.exports = function(w, k, g, _, j, L, S) {
        o(g, k, _);
        var U, F, G, ne = function(Z) {
          if (Z === j && T) return T;
          if (!v && Z in N) return N[Z];
          switch (Z) {
            case h:
              return function() {
                return new g(this, Z);
              };
            case b:
              return function() {
                return new g(this, Z);
              };
            case E:
              return function() {
                return new g(this, Z);
              };
          }
          return function() {
            return new g(this);
          };
        }, Q = k + " Iterator", M = !1, N = w.prototype, O = N[m] || N["@@iterator"] || j && N[j], T = !v && O || ne(j), q = k == "Array" && N.entries || O;
        if (q && (U = r(q.call(new w())), p !== Object.prototype && U.next && (c || r(U) === p || (t ? t(U, p) : typeof U[m] != "function" && u(U, m, A)), a(U, Q, !0, !0), c && (f[Q] = A))), j == b && O && O.name !== b && (M = !0, T = function() {
          return O.call(this);
        }), c && !S || N[m] === T || u(N, m, T), f[k] = T, j) if (F = { values: ne(b), keys: L ? T : ne(h), entries: ne(E) }, S) for (G in F) (v || M || !(G in N)) && s(N, G, F[G]);
        else n({ target: k, proto: !0, forced: v || M }, F);
        return F;
      };
    }, "7eb5": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-drag", use: "icon-drag-usage", viewBox: "0 0 28 29.526", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 29.526" id="icon-drag">\r
  <g id="icon-drag_drag" transform="translate(-1623.5 -915.5)">\r
    <line id="icon-drag_直线_5" data-name="直线 5" y2="22.015" transform="translate(1637.049 919.566)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <line id="icon-drag_直线_6" data-name="直线 6" x1="22.015" transform="translate(1626.041 930.574)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <path id="icon-drag_路径_15" data-name="路径 15" d="M728.456,559.625l3.888-3.887,3.885,3.885" transform="translate(904.603 361.262)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_16" data-name="路径 16" d="M736.229,568.465l-3.888,3.888-3.885-3.885" transform="translate(904.603 371.172)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_17" data-name="路径 17" d="M735.8,561.184l3.888,3.888-3.885,3.885" transform="translate(910.317 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_18" data-name="路径 18" d="M727.813,568.957l-3.888-3.888,3.885-3.885" transform="translate(901.075 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
    }, "7f9a": function(i, d, e) {
      var n = e("da84"), o = e("8925"), r = n.WeakMap;
      i.exports = typeof r == "function" && /native code/.test(o(r));
    }, "825a": function(i, d, e) {
      var n = e("861d");
      i.exports = function(o) {
        if (!n(o)) throw TypeError(String(o) + " is not an object");
        return o;
      };
    }, "83ab": function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        return Object.defineProperty({}, 1, { get: function() {
          return 7;
        } })[1] != 7;
      });
    }, "83b9": function(i, d, e) {
      var n = e("d925"), o = e("e683");
      i.exports = function(r, t) {
        return r && !n(t) ? o(r, t) : t;
      };
    }, 8418: function(i, d, e) {
      var n = e("c04e"), o = e("9bf2"), r = e("5c6c");
      i.exports = function(t, a, u) {
        var s = n(a);
        s in t ? o.f(t, s, r(0, u)) : t[s] = u;
      };
    }, "861d": function(i, d) {
      i.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(i, d, e) {
      var n, o, r;
      (function(t, a) {
        o = [], n = a, r = typeof n == "function" ? n.apply(d, o) : n, r === void 0 || (i.exports = r);
      })(typeof self < "u" && self, function() {
        function t() {
          var a = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!a && "currentScript" in document && document.currentScript || a && a.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (E) {
            var u, s, l, c = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, y = c.exec(E.stack) || f.exec(E.stack), p = y && y[1] || !1, v = y && y[2] || !1, m = document.location.href.replace(document.location.hash, ""), h = document.getElementsByTagName("script");
            p === m && (u = document.documentElement.outerHTML, s = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), l = u.replace(s, "$1").trim());
            for (var b = 0; b < h.length; b++)
              if (h[b].readyState === "interactive" || h[b].src === p || p === m && h[b].innerHTML && h[b].innerHTML.trim() === l) return h[b];
            return null;
          }
        }
        return t;
      });
    }, 8925: function(i, d, e) {
      var n = e("c6cd"), o = Function.toString;
      typeof n.inspectSource != "function" && (n.inspectSource = function(r) {
        return o.call(r);
      }), i.exports = n.inspectSource;
    }, "8aa5": function(i, d, e) {
      var n = e("6547").charAt;
      i.exports = function(o, r, t) {
        return r + (t ? n(o, r).length : 1);
      };
    }, "8bbf": function(i, d) {
      i.exports = X;
    }, "8df4": function(i, d, e) {
      var n = e("7a77");
      function o(r) {
        if (typeof r != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(u) {
          t = u;
        });
        var a = this;
        r(function(u) {
          a.reason || (a.reason = new n(u), t(a.reason));
        });
      }
      o.prototype.throwIfRequested = function() {
        if (this.reason) throw this.reason;
      }, o.source = function() {
        var r, t = new o(function(a) {
          r = a;
        });
        return { token: t, cancel: r };
      }, i.exports = o;
    }, "90e3": function(i, d) {
      var e = 0, n = Math.random();
      i.exports = function(o) {
        return "Symbol(" + String(o === void 0 ? "" : o) + ")_" + (++e + n).toString(36);
      };
    }, 9112: function(i, d, e) {
      var n = e("83ab"), o = e("9bf2"), r = e("5c6c");
      i.exports = n ? function(t, a, u) {
        return o.f(t, a, r(1, u));
      } : function(t, a, u) {
        return t[a] = u, t;
      };
    }, 9263: function(i, d, e) {
      var n = e("ad6d"), o = e("9f7f"), r = RegExp.prototype.exec, t = String.prototype.replace, a = r, u = function() {
        var f = /a/, y = /b*/g;
        return r.call(f, "a"), r.call(y, "a"), f.lastIndex !== 0 || y.lastIndex !== 0;
      }(), s = o.UNSUPPORTED_Y || o.BROKEN_CARET, l = /()??/.exec("")[1] !== void 0, c = u || l || s;
      c && (a = function(f) {
        var y, p, v, m, h = this, b = s && h.sticky, E = n.call(h), A = h.source, w = 0, k = f;
        return b && (E = E.replace("y", ""), E.indexOf("g") === -1 && (E += "g"), k = String(f).slice(h.lastIndex), h.lastIndex > 0 && (!h.multiline || h.multiline && f[h.lastIndex - 1] !== `
`) && (A = "(?: " + A + ")", k = " " + k, w++), p = new RegExp("^(?:" + A + ")", E)), l && (p = new RegExp("^" + A + "$(?!\\s)", E)), u && (y = h.lastIndex), v = r.call(b ? p : h, k), b ? v ? (v.input = v.input.slice(w), v[0] = v[0].slice(w), v.index = h.lastIndex, h.lastIndex += v[0].length) : h.lastIndex = 0 : u && v && (h.lastIndex = h.global ? v.index + v[0].length : y), l && v && v.length > 1 && t.call(v[0], p, function() {
          for (m = 1; m < arguments.length - 2; m++) arguments[m] === void 0 && (v[m] = void 0);
        }), v;
      }), i.exports = a;
    }, "94ca": function(i, d, e) {
      var n = e("d039"), o = /#|\.prototype\./, r = function(l, c) {
        var f = a[t(l)];
        return f == s || f != u && (typeof c == "function" ? n(c) : !!c);
      }, t = r.normalize = function(l) {
        return String(l).replace(o, ".").toLowerCase();
      }, a = r.data = {}, u = r.NATIVE = "N", s = r.POLYFILL = "P";
      i.exports = r;
    }, "95d9": function(i, d, e) {
    }, "96cf": function(i, d) {
      (function(e) {
        var n, o = Object.prototype, r = o.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, a = t.iterator || "@@iterator", u = t.asyncIterator || "@@asyncIterator", s = t.toStringTag || "@@toStringTag", l = typeof i == "object", c = e.regeneratorRuntime;
        if (c) l && (i.exports = c);
        else {
          c = e.regeneratorRuntime = l ? i.exports : {}, c.wrap = w;
          var f = "suspendedStart", y = "suspendedYield", p = "executing", v = "completed", m = {}, h = {};
          h[a] = function() {
            return this;
          };
          var b = Object.getPrototypeOf, E = b && b(b(M([])));
          E && E !== o && r.call(E, a) && (h = E);
          var A = j.prototype = g.prototype = Object.create(h);
          _.prototype = A.constructor = j, j.constructor = _, j[s] = _.displayName = "GeneratorFunction", c.isGeneratorFunction = function(O) {
            var T = typeof O == "function" && O.constructor;
            return !!T && (T === _ || (T.displayName || T.name) === "GeneratorFunction");
          }, c.mark = function(O) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(O, j) : (O.__proto__ = j, s in O || (O[s] = "GeneratorFunction")), O.prototype = Object.create(A), O;
          }, c.awrap = function(O) {
            return { __await: O };
          }, L(S.prototype), S.prototype[u] = function() {
            return this;
          }, c.AsyncIterator = S, c.async = function(O, T, q, Z) {
            var D = new S(w(O, T, q, Z));
            return c.isGeneratorFunction(T) ? D : D.next().then(function(xe) {
              return xe.done ? xe.value : D.next();
            });
          }, L(A), A[s] = "Generator", A[a] = function() {
            return this;
          }, A.toString = function() {
            return "[object Generator]";
          }, c.keys = function(O) {
            var T = [];
            for (var q in O) T.push(q);
            return T.reverse(), function Z() {
              for (; T.length; ) {
                var D = T.pop();
                if (D in O) return Z.value = D, Z.done = !1, Z;
              }
              return Z.done = !0, Z;
            };
          }, c.values = M, Q.prototype = { constructor: Q, reset: function(O) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ne), !O) for (var T in this) T.charAt(0) === "t" && r.call(this, T) && !isNaN(+T.slice(1)) && (this[T] = n);
          }, stop: function() {
            this.done = !0;
            var O = this.tryEntries[0], T = O.completion;
            if (T.type === "throw") throw T.arg;
            return this.rval;
          }, dispatchException: function(O) {
            if (this.done) throw O;
            var T = this;
            function q(Be, Ie) {
              return xe.type = "throw", xe.arg = O, T.next = Be, Ie && (T.method = "next", T.arg = n), !!Ie;
            }
            for (var Z = this.tryEntries.length - 1; Z >= 0; --Z) {
              var D = this.tryEntries[Z], xe = D.completion;
              if (D.tryLoc === "root") return q("end");
              if (D.tryLoc <= this.prev) {
                var pe = r.call(D, "catchLoc"), Pe = r.call(D, "finallyLoc");
                if (pe && Pe) {
                  if (this.prev < D.catchLoc) return q(D.catchLoc, !0);
                  if (this.prev < D.finallyLoc) return q(D.finallyLoc);
                } else if (pe) {
                  if (this.prev < D.catchLoc) return q(D.catchLoc, !0);
                } else {
                  if (!Pe) throw new Error("try statement without catch or finally");
                  if (this.prev < D.finallyLoc) return q(D.finallyLoc);
                }
              }
            }
          }, abrupt: function(O, T) {
            for (var q = this.tryEntries.length - 1; q >= 0; --q) {
              var Z = this.tryEntries[q];
              if (Z.tryLoc <= this.prev && r.call(Z, "finallyLoc") && this.prev < Z.finallyLoc) {
                var D = Z;
                break;
              }
            }
            D && (O === "break" || O === "continue") && D.tryLoc <= T && T <= D.finallyLoc && (D = null);
            var xe = D ? D.completion : {};
            return xe.type = O, xe.arg = T, D ? (this.method = "next", this.next = D.finallyLoc, m) : this.complete(xe);
          }, complete: function(O, T) {
            if (O.type === "throw") throw O.arg;
            return O.type === "break" || O.type === "continue" ? this.next = O.arg : O.type === "return" ? (this.rval = this.arg = O.arg, this.method = "return", this.next = "end") : O.type === "normal" && T && (this.next = T), m;
          }, finish: function(O) {
            for (var T = this.tryEntries.length - 1; T >= 0; --T) {
              var q = this.tryEntries[T];
              if (q.finallyLoc === O) return this.complete(q.completion, q.afterLoc), ne(q), m;
            }
          }, catch: function(O) {
            for (var T = this.tryEntries.length - 1; T >= 0; --T) {
              var q = this.tryEntries[T];
              if (q.tryLoc === O) {
                var Z = q.completion;
                if (Z.type === "throw") {
                  var D = Z.arg;
                  ne(q);
                }
                return D;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(O, T, q) {
            return this.delegate = { iterator: M(O), resultName: T, nextLoc: q }, this.method === "next" && (this.arg = n), m;
          } };
        }
        function w(O, T, q, Z) {
          var D = T && T.prototype instanceof g ? T : g, xe = Object.create(D.prototype), pe = new Q(Z || []);
          return xe._invoke = U(O, q, pe), xe;
        }
        function k(O, T, q) {
          try {
            return { type: "normal", arg: O.call(T, q) };
          } catch (Z) {
            return { type: "throw", arg: Z };
          }
        }
        function g() {
        }
        function _() {
        }
        function j() {
        }
        function L(O) {
          ["next", "throw", "return"].forEach(function(T) {
            O[T] = function(q) {
              return this._invoke(T, q);
            };
          });
        }
        function S(O) {
          function T(D, xe, pe, Pe) {
            var Be = k(O[D], O, xe);
            if (Be.type !== "throw") {
              var Ie = Be.arg, Ae = Ie.value;
              return Ae && typeof Ae == "object" && r.call(Ae, "__await") ? Promise.resolve(Ae.__await).then(function(Le) {
                T("next", Le, pe, Pe);
              }, function(Le) {
                T("throw", Le, pe, Pe);
              }) : Promise.resolve(Ae).then(function(Le) {
                Ie.value = Le, pe(Ie);
              }, Pe);
            }
            Pe(Be.arg);
          }
          var q;
          function Z(D, xe) {
            function pe() {
              return new Promise(function(Pe, Be) {
                T(D, xe, Pe, Be);
              });
            }
            return q = q ? q.then(pe, pe) : pe();
          }
          this._invoke = Z;
        }
        function U(O, T, q) {
          var Z = f;
          return function(D, xe) {
            if (Z === p) throw new Error("Generator is already running");
            if (Z === v) {
              if (D === "throw") throw xe;
              return N();
            }
            for (q.method = D, q.arg = xe; ; ) {
              var pe = q.delegate;
              if (pe) {
                var Pe = F(pe, q);
                if (Pe) {
                  if (Pe === m) continue;
                  return Pe;
                }
              }
              if (q.method === "next") q.sent = q._sent = q.arg;
              else if (q.method === "throw") {
                if (Z === f) throw Z = v, q.arg;
                q.dispatchException(q.arg);
              } else q.method === "return" && q.abrupt("return", q.arg);
              Z = p;
              var Be = k(O, T, q);
              if (Be.type === "normal") {
                if (Z = q.done ? v : y, Be.arg === m) continue;
                return { value: Be.arg, done: q.done };
              }
              Be.type === "throw" && (Z = v, q.method = "throw", q.arg = Be.arg);
            }
          };
        }
        function F(O, T) {
          var q = O.iterator[T.method];
          if (q === n) {
            if (T.delegate = null, T.method === "throw") {
              if (O.iterator.return && (T.method = "return", T.arg = n, F(O, T), T.method === "throw")) return m;
              T.method = "throw", T.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return m;
          }
          var Z = k(q, O.iterator, T.arg);
          if (Z.type === "throw") return T.method = "throw", T.arg = Z.arg, T.delegate = null, m;
          var D = Z.arg;
          return D ? D.done ? (T[O.resultName] = D.value, T.next = O.nextLoc, T.method !== "return" && (T.method = "next", T.arg = n), T.delegate = null, m) : D : (T.method = "throw", T.arg = new TypeError("iterator result is not an object"), T.delegate = null, m);
        }
        function G(O) {
          var T = { tryLoc: O[0] };
          1 in O && (T.catchLoc = O[1]), 2 in O && (T.finallyLoc = O[2], T.afterLoc = O[3]), this.tryEntries.push(T);
        }
        function ne(O) {
          var T = O.completion || {};
          T.type = "normal", delete T.arg, O.completion = T;
        }
        function Q(O) {
          this.tryEntries = [{ tryLoc: "root" }], O.forEach(G, this), this.reset(!0);
        }
        function M(O) {
          if (O) {
            var T = O[a];
            if (T) return T.call(O);
            if (typeof O.next == "function") return O;
            if (!isNaN(O.length)) {
              var q = -1, Z = function D() {
                for (; ++q < O.length; ) if (r.call(O, q)) return D.value = O[q], D.done = !1, D;
                return D.value = n, D.done = !0, D;
              };
              return Z.next = Z;
            }
          }
          return { next: N };
        }
        function N() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("e8b5"), t = e("861d"), a = e("7b0b"), u = e("50c4"), s = e("8418"), l = e("65f0"), c = e("1dde"), f = e("b622"), y = e("2d00"), p = f("isConcatSpreadable"), v = 9007199254740991, m = "Maximum allowed index exceeded", h = y >= 51 || !o(function() {
        var w = [];
        return w[p] = !1, w.concat()[0] !== w;
      }), b = c("concat"), E = function(w) {
        if (!t(w)) return !1;
        var k = w[p];
        return k !== void 0 ? !!k : r(w);
      }, A = !h || !b;
      n({ target: "Array", proto: !0, forced: A }, { concat: function(w) {
        var k, g, _, j, L, S = a(this), U = l(S, 0), F = 0;
        for (k = -1, _ = arguments.length; k < _; k++) if (L = k === -1 ? S : arguments[k], E(L)) {
          if (j = u(L.length), F + j > v) throw TypeError(m);
          for (g = 0; g < j; g++, F++) g in L && s(U, F, L[g]);
        } else {
          if (F >= v) throw TypeError(m);
          s(U, F++, L);
        }
        return U.length = F, U;
      } });
    }, "9aaf": function(i, d, e) {
      e("70d3");
    }, "9bdd": function(i, d, e) {
      var n = e("825a"), o = e("2a62");
      i.exports = function(r, t, a, u) {
        try {
          return u ? t(n(a)[0], a[1]) : t(a);
        } catch (s) {
          throw o(r), s;
        }
      };
    }, "9bf2": function(i, d, e) {
      var n = e("83ab"), o = e("0cfb"), r = e("825a"), t = e("c04e"), a = Object.defineProperty;
      d.f = n ? a : function(u, s, l) {
        if (r(u), s = t(s, !0), r(l), o) try {
          return a(u, s, l);
        } catch {
        }
        if ("get" in l || "set" in l) throw TypeError("Accessors not supported");
        return "value" in l && (u[s] = l.value), u;
      };
    }, "9ed3": function(i, d, e) {
      var n = e("ae93").IteratorPrototype, o = e("7c73"), r = e("5c6c"), t = e("d44e"), a = e("3f8c"), u = function() {
        return this;
      };
      i.exports = function(s, l, c) {
        var f = l + " Iterator";
        return s.prototype = o(n, { next: r(1, c) }), t(s, f, !1, !0), a[f] = u, s;
      };
    }, "9f7f": function(i, d, e) {
      var n = e("d039");
      function o(r, t) {
        return RegExp(r, t);
      }
      d.UNSUPPORTED_Y = n(function() {
        var r = o("a", "y");
        return r.lastIndex = 2, r.exec("abcd") != null;
      }), d.BROKEN_CARET = n(function() {
        var r = o("^r", "gy");
        return r.lastIndex = 2, r.exec("str") != null;
      });
    }, a434: function(i, d, e) {
      var n = e("23e7"), o = e("23cb"), r = e("a691"), t = e("50c4"), a = e("7b0b"), u = e("65f0"), s = e("8418"), l = e("1dde"), c = l("splice"), f = Math.max, y = Math.min, p = 9007199254740991, v = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !c }, { splice: function(m, h) {
        var b, E, A, w, k, g, _ = a(this), j = t(_.length), L = o(m, j), S = arguments.length;
        if (S === 0 ? b = E = 0 : S === 1 ? (b = 0, E = j - L) : (b = S - 2, E = y(f(r(h), 0), j - L)), j + b - E > p) throw TypeError(v);
        for (A = u(_, E), w = 0; w < E; w++) k = L + w, k in _ && s(A, w, _[k]);
        if (A.length = E, b < E) {
          for (w = L; w < j - E; w++) k = w + E, g = w + b, k in _ ? _[g] = _[k] : delete _[g];
          for (w = j; w > j - E + b; w--) delete _[w - 1];
        } else if (b > E) for (w = j - E; w > L; w--) k = w + E - 1, g = w + b - 1, k in _ ? _[g] = _[k] : delete _[g];
        for (w = 0; w < b; w++) _[w + L] = arguments[w + 2];
        return _.length = j - E + b, A;
      } });
    }, a4b4: function(i, d, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("d066"), t = e("c430"), a = e("83ab"), u = e("4930"), s = e("fdbf"), l = e("d039"), c = e("5135"), f = e("e8b5"), y = e("861d"), p = e("825a"), v = e("7b0b"), m = e("fc6a"), h = e("c04e"), b = e("5c6c"), E = e("7c73"), A = e("df75"), w = e("241c"), k = e("057f"), g = e("7418"), _ = e("06cf"), j = e("9bf2"), L = e("d1e7"), S = e("9112"), U = e("6eeb"), F = e("5692"), G = e("f772"), ne = e("d012"), Q = e("90e3"), M = e("b622"), N = e("e538"), O = e("746f"), T = e("d44e"), q = e("69f3"), Z = e("b727").forEach, D = G("hidden"), xe = "Symbol", pe = "prototype", Pe = M("toPrimitive"), Be = q.set, Ie = q.getterFor(xe), Ae = Object[pe], Le = o.Symbol, Qe = r("JSON", "stringify"), it = _.f, $ = j.f, I = k.f, J = L.f, V = F("symbols"), Y = F("op-symbols"), re = F("string-to-symbol-registry"), be = F("symbol-to-string-registry"), he = F("wks"), se = o.QObject, ke = !se || !se[pe] || !se[pe].findChild, Se = a && l(function() {
        return E($({}, "a", { get: function() {
          return $(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(W, te, ae) {
        var fe = it(Ae, te);
        fe && delete Ae[te], $(W, te, ae), fe && W !== Ae && $(Ae, te, fe);
      } : $, $e = function(W, te) {
        var ae = V[W] = E(Le[pe]);
        return Be(ae, { type: xe, tag: W, description: te }), a || (ae.description = te), ae;
      }, je = s ? function(W) {
        return typeof W == "symbol";
      } : function(W) {
        return Object(W) instanceof Le;
      }, Ve = function(W, te, ae) {
        W === Ae && Ve(Y, te, ae), p(W);
        var fe = h(te, !0);
        return p(ae), c(V, fe) ? (ae.enumerable ? (c(W, D) && W[D][fe] && (W[D][fe] = !1), ae = E(ae, { enumerable: b(0, !1) })) : (c(W, D) || $(W, D, b(1, {})), W[D][fe] = !0), Se(W, fe, ae)) : $(W, fe, ae);
      }, Je = function(W, te) {
        p(W);
        var ae = m(te), fe = A(ae).concat(ce(ae));
        return Z(fe, function(Ue) {
          a && !at.call(ae, Ue) || Ve(W, Ue, ae[Ue]);
        }), W;
      }, Xe = function(W, te) {
        return te === void 0 ? E(W) : Je(E(W), te);
      }, at = function(W) {
        var te = h(W, !0), ae = J.call(this, te);
        return !(this === Ae && c(V, te) && !c(Y, te)) && (!(ae || !c(this, te) || !c(V, te) || c(this, D) && this[D][te]) || ae);
      }, z = function(W, te) {
        var ae = m(W), fe = h(te, !0);
        if (ae !== Ae || !c(V, fe) || c(Y, fe)) {
          var Ue = it(ae, fe);
          return !Ue || !c(V, fe) || c(ae, D) && ae[D][fe] || (Ue.enumerable = !0), Ue;
        }
      }, oe = function(W) {
        var te = I(m(W)), ae = [];
        return Z(te, function(fe) {
          c(V, fe) || c(ne, fe) || ae.push(fe);
        }), ae;
      }, ce = function(W) {
        var te = W === Ae, ae = I(te ? Y : m(W)), fe = [];
        return Z(ae, function(Ue) {
          !c(V, Ue) || te && !c(Ae, Ue) || fe.push(V[Ue]);
        }), fe;
      };
      if (u || (Le = function() {
        if (this instanceof Le) throw TypeError("Symbol is not a constructor");
        var W = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, te = Q(W), ae = function(fe) {
          this === Ae && ae.call(Y, fe), c(this, D) && c(this[D], te) && (this[D][te] = !1), Se(this, te, b(1, fe));
        };
        return a && ke && Se(Ae, te, { configurable: !0, set: ae }), $e(te, W);
      }, U(Le[pe], "toString", function() {
        return Ie(this).tag;
      }), U(Le, "withoutSetter", function(W) {
        return $e(Q(W), W);
      }), L.f = at, j.f = Ve, _.f = z, w.f = k.f = oe, g.f = ce, N.f = function(W) {
        return $e(M(W), W);
      }, a && ($(Le[pe], "description", { configurable: !0, get: function() {
        return Ie(this).description;
      } }), t || U(Ae, "propertyIsEnumerable", at, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !u, sham: !u }, { Symbol: Le }), Z(A(he), function(W) {
        O(W);
      }), n({ target: xe, stat: !0, forced: !u }, { for: function(W) {
        var te = String(W);
        if (c(re, te)) return re[te];
        var ae = Le(te);
        return re[te] = ae, be[ae] = te, ae;
      }, keyFor: function(W) {
        if (!je(W)) throw TypeError(W + " is not a symbol");
        if (c(be, W)) return be[W];
      }, useSetter: function() {
        ke = !0;
      }, useSimple: function() {
        ke = !1;
      } }), n({ target: "Object", stat: !0, forced: !u, sham: !a }, { create: Xe, defineProperty: Ve, defineProperties: Je, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !u }, { getOwnPropertyNames: oe, getOwnPropertySymbols: ce }), n({ target: "Object", stat: !0, forced: l(function() {
        g.f(1);
      }) }, { getOwnPropertySymbols: function(W) {
        return g.f(v(W));
      } }), Qe) {
        var de = !u || l(function() {
          var W = Le();
          return Qe([W]) != "[null]" || Qe({ a: W }) != "{}" || Qe(Object(W)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: de }, { stringify: function(W, te, ae) {
          for (var fe, Ue = [W], qe = 1; arguments.length > qe; ) Ue.push(arguments[qe++]);
          if (fe = te, (y(te) || W !== void 0) && !je(W)) return f(te) || (te = function(Ze, we) {
            if (typeof fe == "function" && (we = fe.call(this, Ze, we)), !je(we)) return we;
          }), Ue[1] = te, Qe.apply(null, Ue);
        } });
      }
      Le[pe][Pe] || S(Le[pe], Pe, Le[pe].valueOf), T(Le, xe), ne[D] = !0;
    }, a630: function(i, d, e) {
      var n = e("23e7"), o = e("4df4"), r = e("1c7e"), t = !r(function(a) {
        Array.from(a);
      });
      n({ target: "Array", stat: !0, forced: t }, { from: o });
    }, a640: function(i, d, e) {
      var n = e("d039");
      i.exports = function(o, r) {
        var t = [][o];
        return !!t && n(function() {
          t.call(null, r || function() {
            throw 1;
          }, 1);
        });
      };
    }, a691: function(i, d) {
      var e = Math.ceil, n = Math.floor;
      i.exports = function(o) {
        return isNaN(o = +o) ? 0 : (o > 0 ? n : e)(o);
      };
    }, ab13: function(i, d, e) {
      var n = e("b622"), o = n("match");
      i.exports = function(r) {
        var t = /./;
        try {
          "/./"[r](t);
        } catch {
          try {
            return t[o] = !1, "/./"[r](t);
          } catch {
          }
        }
        return !1;
      };
    }, ac1f: function(i, d, e) {
      var n = e("23e7"), o = e("9263");
      n({ target: "RegExp", proto: !0, forced: /./.exec !== o }, { exec: o });
    }, acce: function(i, d, e) {
    }, ad6d: function(i, d, e) {
      var n = e("825a");
      i.exports = function() {
        var o = n(this), r = "";
        return o.global && (r += "g"), o.ignoreCase && (r += "i"), o.multiline && (r += "m"), o.dotAll && (r += "s"), o.unicode && (r += "u"), o.sticky && (r += "y"), r;
      };
    }, ae93: function(i, d, e) {
      var n, o, r, t = e("d039"), a = e("e163"), u = e("9112"), s = e("5135"), l = e("b622"), c = e("c430"), f = l("iterator"), y = !1, p = function() {
        return this;
      };
      [].keys && (r = [].keys(), "next" in r ? (o = a(a(r)), o !== Object.prototype && (n = o)) : y = !0);
      var v = n == null || t(function() {
        var m = {};
        return n[f].call(m) !== m;
      });
      v && (n = {}), c && !v || s(n, f) || u(n, f, p), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: y };
    }, b041: function(i, d, e) {
      var n = e("00ee"), o = e("f5df");
      i.exports = n ? {}.toString : function() {
        return "[object " + o(this) + "]";
      };
    }, b0c0: function(i, d, e) {
      var n = e("83ab"), o = e("9bf2").f, r = Function.prototype, t = r.toString, a = /^\s*function ([^ (]*)/, u = "name";
      n && !(u in r) && o(r, u, { configurable: !0, get: function() {
        try {
          return t.call(this).match(a)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(i, d, e) {
      var n = e("c532"), o = e("467f"), r = e("7aac"), t = e("30b5"), a = e("83b9"), u = e("c345"), s = e("3934"), l = e("2d83");
      i.exports = function(c) {
        return new Promise(function(f, y) {
          var p = c.data, v = c.headers;
          n.isFormData(p) && delete v["Content-Type"];
          var m = new XMLHttpRequest();
          if (c.auth) {
            var h = c.auth.username || "", b = c.auth.password ? unescape(encodeURIComponent(c.auth.password)) : "";
            v.Authorization = "Basic " + btoa(h + ":" + b);
          }
          var E = a(c.baseURL, c.url);
          if (m.open(c.method.toUpperCase(), t(E, c.params, c.paramsSerializer), !0), m.timeout = c.timeout, m.onreadystatechange = function() {
            if (m && m.readyState === 4 && (m.status !== 0 || m.responseURL && m.responseURL.indexOf("file:") === 0)) {
              var w = "getAllResponseHeaders" in m ? u(m.getAllResponseHeaders()) : null, k = c.responseType && c.responseType !== "text" ? m.response : m.responseText, g = { data: k, status: m.status, statusText: m.statusText, headers: w, config: c, request: m };
              o(f, y, g), m = null;
            }
          }, m.onabort = function() {
            m && (y(l("Request aborted", c, "ECONNABORTED", m)), m = null);
          }, m.onerror = function() {
            y(l("Network Error", c, null, m)), m = null;
          }, m.ontimeout = function() {
            var w = "timeout of " + c.timeout + "ms exceeded";
            c.timeoutErrorMessage && (w = c.timeoutErrorMessage), y(l(w, c, "ECONNABORTED", m)), m = null;
          }, n.isStandardBrowserEnv()) {
            var A = (c.withCredentials || s(E)) && c.xsrfCookieName ? r.read(c.xsrfCookieName) : void 0;
            A && (v[c.xsrfHeaderName] = A);
          }
          if ("setRequestHeader" in m && n.forEach(v, function(w, k) {
            typeof p > "u" && k.toLowerCase() === "content-type" ? delete v[k] : m.setRequestHeader(k, w);
          }), n.isUndefined(c.withCredentials) || (m.withCredentials = !!c.withCredentials), c.responseType) try {
            m.responseType = c.responseType;
          } catch (w) {
            if (c.responseType !== "json") throw w;
          }
          typeof c.onDownloadProgress == "function" && m.addEventListener("progress", c.onDownloadProgress), typeof c.onUploadProgress == "function" && m.upload && m.upload.addEventListener("progress", c.onUploadProgress), c.cancelToken && c.cancelToken.promise.then(function(w) {
            m && (m.abort(), y(w), m = null);
          }), p || (p = null), m.send(p);
        });
      };
    }, b575: function(i, d, e) {
      var n, o, r, t, a, u, s, l, c = e("da84"), f = e("06cf").f, y = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), m = e("605d"), h = c.MutationObserver || c.WebKitMutationObserver, b = c.document, E = c.process, A = c.Promise, w = f(c, "queueMicrotask"), k = w && w.value;
      k || (n = function() {
        var g, _;
        for (m && (g = E.domain) && g.exit(); o; ) {
          _ = o.fn, o = o.next;
          try {
            _();
          } catch (j) {
            throw o ? t() : r = void 0, j;
          }
        }
        r = void 0, g && g.enter();
      }, p || m || v || !h || !b ? A && A.resolve ? (s = A.resolve(void 0), l = s.then, t = function() {
        l.call(s, n);
      }) : t = m ? function() {
        E.nextTick(n);
      } : function() {
        y.call(c, n);
      } : (a = !0, u = b.createTextNode(""), new h(n).observe(u, { characterData: !0 }), t = function() {
        u.data = a = !a;
      })), i.exports = k || function(g) {
        var _ = { fn: g, next: void 0 };
        r && (r.next = _), o || (o = _, t()), r = _;
      };
    }, b622: function(i, d, e) {
      var n = e("da84"), o = e("5692"), r = e("5135"), t = e("90e3"), a = e("4930"), u = e("fdbf"), s = o("wks"), l = n.Symbol, c = u ? l : l && l.withoutSetter || t;
      i.exports = function(f) {
        return r(s, f) && (a || typeof s[f] == "string") || (a && r(l, f) ? s[f] = l[f] : s[f] = c("Symbol." + f)), s[f];
      };
    }, b64b: function(i, d, e) {
      var n = e("23e7"), o = e("7b0b"), r = e("df75"), t = e("d039"), a = t(function() {
        r(1);
      });
      n({ target: "Object", stat: !0, forced: a }, { keys: function(u) {
        return r(o(u));
      } });
    }, b680: function(i, d, e) {
      var n = e("23e7"), o = e("a691"), r = e("408a"), t = e("1148"), a = e("d039"), u = 1 .toFixed, s = Math.floor, l = function(m, h, b) {
        return h === 0 ? b : h % 2 === 1 ? l(m, h - 1, b * m) : l(m * m, h / 2, b);
      }, c = function(m) {
        for (var h = 0, b = m; b >= 4096; ) h += 12, b /= 4096;
        for (; b >= 2; ) h += 1, b /= 2;
        return h;
      }, f = function(m, h, b) {
        for (var E = -1, A = b; ++E < 6; ) A += h * m[E], m[E] = A % 1e7, A = s(A / 1e7);
      }, y = function(m, h) {
        for (var b = 6, E = 0; --b >= 0; ) E += m[b], m[b] = s(E / h), E = E % h * 1e7;
      }, p = function(m) {
        for (var h = 6, b = ""; --h >= 0; ) if (b !== "" || h === 0 || m[h] !== 0) {
          var E = String(m[h]);
          b = b === "" ? E : b + t.call("0", 7 - E.length) + E;
        }
        return b;
      }, v = u && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !a(function() {
        u.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(m) {
        var h, b, E, A, w = r(this), k = o(m), g = [0, 0, 0, 0, 0, 0], _ = "", j = "0";
        if (k < 0 || k > 20) throw RangeError("Incorrect fraction digits");
        if (w != w) return "NaN";
        if (w <= -1e21 || w >= 1e21) return String(w);
        if (w < 0 && (_ = "-", w = -w), w > 1e-21) if (h = c(w * l(2, 69, 1)) - 69, b = h < 0 ? w * l(2, -h, 1) : w / l(2, h, 1), b *= 4503599627370496, h = 52 - h, h > 0) {
          for (f(g, 0, b), E = k; E >= 7; ) f(g, 1e7, 0), E -= 7;
          for (f(g, l(10, E, 1), 0), E = h - 1; E >= 23; ) y(g, 1 << 23), E -= 23;
          y(g, 1 << E), f(g, 1, 1), y(g, 2), j = p(g);
        } else f(g, 0, b), f(g, 1 << -h, 0), j = p(g) + t.call("0", k);
        return k > 0 ? (A = j.length, j = _ + (A <= k ? "0." + t.call("0", k - A) + j : j.slice(0, A - k) + "." + j.slice(A - k))) : j = _ + j, j;
      } });
    }, b727: function(i, d, e) {
      var n = e("0366"), o = e("44ad"), r = e("7b0b"), t = e("50c4"), a = e("65f0"), u = [].push, s = function(l) {
        var c = l == 1, f = l == 2, y = l == 3, p = l == 4, v = l == 6, m = l == 7, h = l == 5 || v;
        return function(b, E, A, w) {
          for (var k, g, _ = r(b), j = o(_), L = n(E, A, 3), S = t(j.length), U = 0, F = w || a, G = c ? F(b, S) : f || m ? F(b, 0) : void 0; S > U; U++) if ((h || U in j) && (k = j[U], g = L(k, U, _), l)) if (c) G[U] = g;
          else if (g) switch (l) {
            case 3:
              return !0;
            case 5:
              return k;
            case 6:
              return U;
            case 2:
              u.call(G, k);
          }
          else switch (l) {
            case 4:
              return !1;
            case 7:
              u.call(G, k);
          }
          return v ? -1 : y || p ? p : G;
        };
      };
      i.exports = { forEach: s(0), map: s(1), filter: s(2), some: s(3), every: s(4), find: s(5), findIndex: s(6), filterOut: s(7) };
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
      i.exports = function(o, r) {
        if (!n(o)) return o;
        var t, a;
        if (r && typeof (t = o.toString) == "function" && !n(a = t.call(o)) || typeof (t = o.valueOf) == "function" && !n(a = t.call(o)) || !r && typeof (t = o.toString) == "function" && !n(a = t.call(o))) return a;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(i, d, e) {
      var n = e("c532"), o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      i.exports = function(r) {
        var t, a, u, s = {};
        return r && n.forEach(r.split(`
`), function(l) {
          if (u = l.indexOf(":"), t = n.trim(l.substr(0, u)).toLowerCase(), a = n.trim(l.substr(u + 1)), t) {
            if (s[t] && o.indexOf(t) >= 0) return;
            s[t] = t === "set-cookie" ? (s[t] ? s[t] : []).concat([a]) : s[t] ? s[t] + ", " + a : a;
          }
        }), s;
      };
    }, c401: function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r, t) {
        return n.forEach(t, function(a) {
          o = a(o, r);
        }), o;
      };
    }, c430: function(i, d) {
      i.exports = !1;
    }, c532: function(i, d, e) {
      var n = e("1d2b"), o = Object.prototype.toString;
      function r(S) {
        return o.call(S) === "[object Array]";
      }
      function t(S) {
        return typeof S > "u";
      }
      function a(S) {
        return S !== null && !t(S) && S.constructor !== null && !t(S.constructor) && typeof S.constructor.isBuffer == "function" && S.constructor.isBuffer(S);
      }
      function u(S) {
        return o.call(S) === "[object ArrayBuffer]";
      }
      function s(S) {
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
      function y(S) {
        return S !== null && typeof S == "object";
      }
      function p(S) {
        if (o.call(S) !== "[object Object]") return !1;
        var U = Object.getPrototypeOf(S);
        return U === null || U === Object.prototype;
      }
      function v(S) {
        return o.call(S) === "[object Date]";
      }
      function m(S) {
        return o.call(S) === "[object File]";
      }
      function h(S) {
        return o.call(S) === "[object Blob]";
      }
      function b(S) {
        return o.call(S) === "[object Function]";
      }
      function E(S) {
        return y(S) && b(S.pipe);
      }
      function A(S) {
        return typeof URLSearchParams < "u" && S instanceof URLSearchParams;
      }
      function w(S) {
        return S.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function k() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function g(S, U) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), r(S)) for (var F = 0, G = S.length; F < G; F++) U.call(null, S[F], F, S);
        else for (var ne in S) Object.prototype.hasOwnProperty.call(S, ne) && U.call(null, S[ne], ne, S);
      }
      function _() {
        var S = {};
        function U(ne, Q) {
          p(S[Q]) && p(ne) ? S[Q] = _(S[Q], ne) : p(ne) ? S[Q] = _({}, ne) : r(ne) ? S[Q] = ne.slice() : S[Q] = ne;
        }
        for (var F = 0, G = arguments.length; F < G; F++) g(arguments[F], U);
        return S;
      }
      function j(S, U, F) {
        return g(U, function(G, ne) {
          S[ne] = F && typeof G == "function" ? n(G, F) : G;
        }), S;
      }
      function L(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      i.exports = { isArray: r, isArrayBuffer: u, isBuffer: a, isFormData: s, isArrayBufferView: l, isString: c, isNumber: f, isObject: y, isPlainObject: p, isUndefined: t, isDate: v, isFile: m, isBlob: h, isFunction: b, isStream: E, isURLSearchParams: A, isStandardBrowserEnv: k, forEach: g, merge: _, extend: j, trim: w, stripBOM: L };
    }, c6b6: function(i, d) {
      var e = {}.toString;
      i.exports = function(n) {
        return e.call(n).slice(8, -1);
      };
    }, c6cd: function(i, d, e) {
      var n = e("da84"), o = e("ce4e"), r = "__core-js_shared__", t = n[r] || o(r, {});
      i.exports = t;
    }, c8af: function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r) {
        n.forEach(o, function(t, a) {
          a !== r && a.toUpperCase() === r.toUpperCase() && (o[r] = t, delete o[a]);
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
      var n = e("5135"), o = e("fc6a"), r = e("4d64").indexOf, t = e("d012");
      i.exports = function(a, u) {
        var s, l = o(a), c = 0, f = [];
        for (s in l) !n(t, s) && n(l, s) && f.push(s);
        for (; u.length > c; ) n(l, s = u[c++]) && (~r(f, s) || f.push(s));
        return f;
      };
    }, caad: function(i, d, e) {
      var n = e("23e7"), o = e("4d64").includes, r = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), r("includes");
    }, cc12: function(i, d, e) {
      var n = e("da84"), o = e("861d"), r = n.document, t = o(r) && o(r.createElement);
      i.exports = function(a) {
        return t ? r.createElement(a) : {};
      };
    }, cdf9: function(i, d, e) {
      var n = e("825a"), o = e("861d"), r = e("f069");
      i.exports = function(t, a) {
        if (n(t), o(a) && a.constructor === t) return a;
        var u = r.f(t), s = u.resolve;
        return s(a), u.promise;
      };
    }, ce4e: function(i, d, e) {
      var n = e("da84"), o = e("9112");
      i.exports = function(r, t) {
        try {
          o(n, r, t);
        } catch {
          n[r] = t;
        }
        return t;
      };
    }, cee4: function(i, d, e) {
      var n = e("c532"), o = e("1d2b"), r = e("0a06"), t = e("4a7b"), a = e("2444");
      function u(l) {
        var c = new r(l), f = o(r.prototype.request, c);
        return n.extend(f, r.prototype, c), n.extend(f, c), f;
      }
      var s = u(a);
      s.Axios = r, s.create = function(l) {
        return u(t(s.defaults, l));
      }, s.Cancel = e("7a77"), s.CancelToken = e("8df4"), s.isCancel = e("2e67"), s.all = function(l) {
        return Promise.all(l);
      }, s.spread = e("0df6"), s.isAxiosError = e("5f02"), i.exports = s, i.exports.default = s;
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
      var n = e("428f"), o = e("da84"), r = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      i.exports = function(t, a) {
        return arguments.length < 2 ? r(n[t]) || r(o[t]) : n[t] && n[t][a] || o[t] && o[t][a];
      };
    }, d1e7: function(i, d, e) {
      var n = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, r = o && !n.call({ 1: 2 }, 1);
      d.f = r ? function(t) {
        var a = o(this, t);
        return !!a && a.enumerable;
      } : n;
    }, d28b: function(i, d, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(i, d, e) {
      var n = e("825a"), o = e("3bbe");
      i.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var r, t = !1, a = {};
        try {
          r = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, r.call(a, []), t = a instanceof Array;
        } catch {
        }
        return function(u, s) {
          return n(u), o(s), t ? r.call(u, s) : u.__proto__ = s, u;
        };
      }() : void 0);
    }, d3b7: function(i, d, e) {
      var n = e("00ee"), o = e("6eeb"), r = e("b041");
      n || o(Object.prototype, "toString", r, { unsafe: !0 });
    }, d40d: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-back", use: "icon-back-usage", viewBox: "0 0 58.6 35.1", content: `<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.6 35.1" id="icon-back">\r
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
      t.a.add(a), d.default = a;
    }, d44e: function(i, d, e) {
      var n = e("9bf2").f, o = e("5135"), r = e("b622"), t = r("toStringTag");
      i.exports = function(a, u, s) {
        a && !o(a = s ? a : a.prototype, t) && n(a, t, { configurable: !0, value: u });
      };
    }, d58f: function(i, d, e) {
      var n = e("1c0b"), o = e("7b0b"), r = e("44ad"), t = e("50c4"), a = function(u) {
        return function(s, l, c, f) {
          n(l);
          var y = o(s), p = r(y), v = t(y.length), m = u ? v - 1 : 0, h = u ? -1 : 1;
          if (c < 2) for (; ; ) {
            if (m in p) {
              f = p[m], m += h;
              break;
            }
            if (m += h, u ? m < 0 : v <= m) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; u ? m >= 0 : v > m; m += h) m in p && (f = l(f, p[m], m, y));
          return f;
        };
      };
      i.exports = { left: a(!1), right: a(!0) };
    }, d69c: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), a = new o.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(a), d.default = a;
    }, d784: function(i, d, e) {
      e("ac1f");
      var n = e("6eeb"), o = e("d039"), r = e("b622"), t = e("9263"), a = e("9112"), u = r("species"), s = !o(function() {
        var p = /./;
        return p.exec = function() {
          var v = [];
          return v.groups = { a: "7" }, v;
        }, "".replace(p, "$<a>") !== "7";
      }), l = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), c = r("replace"), f = function() {
        return !!/./[c] && /./[c]("a", "$0") === "";
      }(), y = !o(function() {
        var p = /(?:)/, v = p.exec;
        p.exec = function() {
          return v.apply(this, arguments);
        };
        var m = "ab".split(p);
        return m.length !== 2 || m[0] !== "a" || m[1] !== "b";
      });
      i.exports = function(p, v, m, h) {
        var b = r(p), E = !o(function() {
          var j = {};
          return j[b] = function() {
            return 7;
          }, ""[p](j) != 7;
        }), A = E && !o(function() {
          var j = !1, L = /a/;
          return p === "split" && (L = {}, L.constructor = {}, L.constructor[u] = function() {
            return L;
          }, L.flags = "", L[b] = /./[b]), L.exec = function() {
            return j = !0, null;
          }, L[b](""), !j;
        });
        if (!E || !A || p === "replace" && (!s || !l || f) || p === "split" && !y) {
          var w = /./[b], k = m(b, ""[p], function(j, L, S, U, F) {
            return L.exec === t ? E && !F ? { done: !0, value: w.call(L, S, U) } : { done: !0, value: j.call(S, L, U) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: l, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), g = k[0], _ = k[1];
          n(String.prototype, p, g), n(RegExp.prototype, b, v == 2 ? function(j, L) {
            return _.call(j, this, L);
          } : function(j) {
            return _.call(j, this);
          });
        }
        h && a(RegExp.prototype[b], "sham", !0);
      };
    }, d81d: function(i, d, e) {
      var n = e("23e7"), o = e("b727").map, r = e("1dde"), t = r("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(a) {
        return o(this, a, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, d925: function(i, d, e) {
      i.exports = function(n) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(n);
      };
    }, da84: function(i, d, e) {
      (function(n) {
        var o = function(r) {
          return r && r.Math == Math && r;
        };
        i.exports = o(typeof globalThis == "object" && globalThis) || o(typeof window == "object" && window) || o(typeof self == "object" && self) || o(typeof n == "object" && n) || /* @__PURE__ */ function() {
          return this;
        }() || Function("return this")();
      }).call(this, e("c8ba"));
    }, dbb4: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("56ef"), t = e("fc6a"), a = e("06cf"), u = e("8418");
      n({ target: "Object", stat: !0, sham: !o }, { getOwnPropertyDescriptors: function(s) {
        for (var l, c, f = t(s), y = a.f, p = r(f), v = {}, m = 0; p.length > m; ) c = y(f, l = p[m++]), c !== void 0 && u(v, l, c);
        return v;
      } });
    }, ddb0: function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("e260"), t = e("9112"), a = e("b622"), u = a("iterator"), s = a("toStringTag"), l = r.values;
      for (var c in o) {
        var f = n[c], y = f && f.prototype;
        if (y) {
          if (y[u] !== l) try {
            t(y, u, l);
          } catch {
            y[u] = l;
          }
          if (y[s] || t(y, s, c), o[c]) {
            for (var p in r) if (y[p] !== r[p]) try {
              t(y, p, r[p]);
            } catch {
              y[p] = r[p];
            }
          }
        }
      }
    }, de23: function(i, d, e) {
      e("7305");
    }, df75: function(i, d, e) {
      var n = e("ca84"), o = e("7839");
      i.exports = Object.keys || function(r) {
        return n(r, o);
      };
    }, df7c: function(i, d, e) {
      (function(n) {
        function o(u, s) {
          for (var l = 0, c = u.length - 1; c >= 0; c--) {
            var f = u[c];
            f === "." ? u.splice(c, 1) : f === ".." ? (u.splice(c, 1), l++) : l && (u.splice(c, 1), l--);
          }
          if (s) for (; l--; l) u.unshift("..");
          return u;
        }
        function r(u) {
          typeof u != "string" && (u += "");
          var s, l = 0, c = -1, f = !0;
          for (s = u.length - 1; s >= 0; --s) if (u.charCodeAt(s) === 47) {
            if (!f) {
              l = s + 1;
              break;
            }
          } else c === -1 && (f = !1, c = s + 1);
          return c === -1 ? "" : u.slice(l, c);
        }
        function t(u, s) {
          if (u.filter) return u.filter(s);
          for (var l = [], c = 0; c < u.length; c++) s(u[c], c, u) && l.push(u[c]);
          return l;
        }
        d.resolve = function() {
          for (var u = "", s = !1, l = arguments.length - 1; l >= -1 && !s; l--) {
            var c = l >= 0 ? arguments[l] : n.cwd();
            if (typeof c != "string") throw new TypeError("Arguments to path.resolve must be strings");
            c && (u = c + "/" + u, s = c.charAt(0) === "/");
          }
          return u = o(t(u.split("/"), function(f) {
            return !!f;
          }), !s).join("/"), (s ? "/" : "") + u || ".";
        }, d.normalize = function(u) {
          var s = d.isAbsolute(u), l = a(u, -1) === "/";
          return u = o(t(u.split("/"), function(c) {
            return !!c;
          }), !s).join("/"), u || s || (u = "."), u && l && (u += "/"), (s ? "/" : "") + u;
        }, d.isAbsolute = function(u) {
          return u.charAt(0) === "/";
        }, d.join = function() {
          var u = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(u, function(s, l) {
            if (typeof s != "string") throw new TypeError("Arguments to path.join must be strings");
            return s;
          }).join("/"));
        }, d.relative = function(u, s) {
          function l(h) {
            for (var b = 0; b < h.length && h[b] === ""; b++) ;
            for (var E = h.length - 1; E >= 0 && h[E] === ""; E--) ;
            return b > E ? [] : h.slice(b, E - b + 1);
          }
          u = d.resolve(u).substr(1), s = d.resolve(s).substr(1);
          for (var c = l(u.split("/")), f = l(s.split("/")), y = Math.min(c.length, f.length), p = y, v = 0; v < y; v++) if (c[v] !== f[v]) {
            p = v;
            break;
          }
          var m = [];
          for (v = p; v < c.length; v++) m.push("..");
          return m = m.concat(f.slice(p)), m.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(u) {
          if (typeof u != "string" && (u += ""), u.length === 0) return ".";
          for (var s = u.charCodeAt(0), l = s === 47, c = -1, f = !0, y = u.length - 1; y >= 1; --y) if (s = u.charCodeAt(y), s === 47) {
            if (!f) {
              c = y;
              break;
            }
          } else f = !1;
          return c === -1 ? l ? "/" : "." : l && c === 1 ? "/" : u.slice(0, c);
        }, d.basename = function(u, s) {
          var l = r(u);
          return s && l.substr(-1 * s.length) === s && (l = l.substr(0, l.length - s.length)), l;
        }, d.extname = function(u) {
          typeof u != "string" && (u += "");
          for (var s = -1, l = 0, c = -1, f = !0, y = 0, p = u.length - 1; p >= 0; --p) {
            var v = u.charCodeAt(p);
            if (v !== 47) c === -1 && (f = !1, c = p + 1), v === 46 ? s === -1 ? s = p : y !== 1 && (y = 1) : s !== -1 && (y = -1);
            else if (!f) {
              l = p + 1;
              break;
            }
          }
          return s === -1 || c === -1 || y === 0 || y === 1 && s === c - 1 && s === l + 1 ? "" : u.slice(s, c);
        };
        var a = "ab".substr(-1) === "b" ? function(u, s, l) {
          return u.substr(s, l);
        } : function(u, s, l) {
          return s < 0 && (s = u.length + s), u.substr(s, l);
        };
      }).call(this, e("4362"));
    }, e017: function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          var o = function(v) {
            var m = v.id, h = v.viewBox, b = v.content;
            this.id = m, this.viewBox = h, this.content = b;
          };
          o.prototype.stringify = function() {
            return this.content;
          }, o.prototype.toString = function() {
            return this.stringify();
          }, o.prototype.destroy = function() {
            var v = this;
            ["id", "viewBox", "content"].forEach(function(m) {
              return delete v[m];
            });
          };
          var r = function(v) {
            var m = !!document.importNode, h = new DOMParser().parseFromString(v, "image/svg+xml").documentElement;
            return m ? document.importNode(h, !0) : h;
          };
          function t(v, m) {
            return m = { exports: {} }, v(m, m.exports), m.exports;
          }
          var a = t(function(v, m) {
            (function(h, b) {
              v.exports = b();
            })(0, function() {
              function h(g) {
                var _ = g && typeof g == "object";
                return _ && Object.prototype.toString.call(g) !== "[object RegExp]" && Object.prototype.toString.call(g) !== "[object Date]";
              }
              function b(g) {
                return Array.isArray(g) ? [] : {};
              }
              function E(g, _) {
                var j = _ && _.clone === !0;
                return j && h(g) ? k(b(g), g, _) : g;
              }
              function A(g, _, j) {
                var L = g.slice();
                return _.forEach(function(S, U) {
                  typeof L[U] > "u" ? L[U] = E(S, j) : h(S) ? L[U] = k(g[U], S, j) : g.indexOf(S) === -1 && L.push(E(S, j));
                }), L;
              }
              function w(g, _, j) {
                var L = {};
                return h(g) && Object.keys(g).forEach(function(S) {
                  L[S] = E(g[S], j);
                }), Object.keys(_).forEach(function(S) {
                  h(_[S]) && g[S] ? L[S] = k(g[S], _[S], j) : L[S] = E(_[S], j);
                }), L;
              }
              function k(g, _, j) {
                var L = Array.isArray(_), S = j || { arrayMerge: A }, U = S.arrayMerge || A;
                return L ? Array.isArray(g) ? U(g, _, j) : E(_, j) : w(g, _, j);
              }
              return k.all = function(g, _) {
                if (!Array.isArray(g) || g.length < 2) throw new Error("first argument should be an array with at least two elements");
                return g.reduce(function(j, L) {
                  return k(j, L, _);
                });
              }, k;
            });
          }), u = t(function(v, m) {
            var h = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            m.default = h, v.exports = m.default;
          }), s = function(v) {
            return Object.keys(v).map(function(m) {
              var h = v[m].toString().replace(/"/g, "&quot;");
              return m + '="' + h + '"';
            }).join(" ");
          }, l = u.svg, c = u.xlink, f = {};
          f[l.name] = l.uri, f[c.name] = c.uri;
          var y = function(v, m) {
            v === void 0 && (v = "");
            var h = a(f, {}), b = s(h);
            return "<svg " + b + ">" + v + "</svg>";
          }, p = function(v) {
            function m() {
              v.apply(this, arguments);
            }
            v && (m.__proto__ = v), m.prototype = Object.create(v && v.prototype), m.prototype.constructor = m;
            var h = { isMounted: {} };
            return h.isMounted.get = function() {
              return !!this.node;
            }, m.createFromExistingNode = function(b) {
              return new m({ id: b.getAttribute("id"), viewBox: b.getAttribute("viewBox"), content: b.outerHTML });
            }, m.prototype.destroy = function() {
              this.isMounted && this.unmount(), v.prototype.destroy.call(this);
            }, m.prototype.mount = function(b) {
              if (this.isMounted) return this.node;
              var E = typeof b == "string" ? document.querySelector(b) : b, A = this.render();
              return this.node = A, E.appendChild(A), A;
            }, m.prototype.render = function() {
              var b = this.stringify();
              return r(y(b)).childNodes[0];
            }, m.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(m.prototype, h), m;
          }(o);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("da84"), t = e("5135"), a = e("861d"), u = e("9bf2").f, s = e("e893"), l = r.Symbol;
      if (o && typeof l == "function" && (!("description" in l.prototype) || l().description !== void 0)) {
        var c = {}, f = function() {
          var h = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), b = this instanceof f ? new l(h) : h === void 0 ? l() : l(h);
          return h === "" && (c[b] = !0), b;
        };
        s(f, l);
        var y = f.prototype = l.prototype;
        y.constructor = f;
        var p = y.toString, v = String(l("test")) == "Symbol(test)", m = /^Symbol\((.*)\)[^)]+$/;
        u(y, "description", { configurable: !0, get: function() {
          var h = a(this) ? this.valueOf() : this, b = p.call(h);
          if (t(c, h)) return "";
          var E = v ? b.slice(7, -1) : b.replace(m, "$1");
          return E === "" ? void 0 : E;
        } }), n({ global: !0, forced: !0 }, { Symbol: f });
      }
    }, e163: function(i, d, e) {
      var n = e("5135"), o = e("7b0b"), r = e("f772"), t = e("e177"), a = r("IE_PROTO"), u = Object.prototype;
      i.exports = t ? Object.getPrototypeOf : function(s) {
        return s = o(s), n(s, a) ? s[a] : typeof s.constructor == "function" && s instanceof s.constructor ? s.constructor.prototype : s instanceof Object ? u : null;
      };
    }, e177: function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        function o() {
        }
        return o.prototype.constructor = null, Object.getPrototypeOf(new o()) !== o.prototype;
      });
    }, e260: function(i, d, e) {
      var n = e("fc6a"), o = e("44d2"), r = e("3f8c"), t = e("69f3"), a = e("7dd0"), u = "Array Iterator", s = t.set, l = t.getterFor(u);
      i.exports = a(Array, "Array", function(c, f) {
        s(this, { type: u, target: n(c), index: 0, kind: f });
      }, function() {
        var c = l(this), f = c.target, y = c.kind, p = c.index++;
        return !f || p >= f.length ? (c.target = void 0, { value: void 0, done: !0 }) : y == "keys" ? { value: p, done: !1 } : y == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
      }, "values"), r.Arguments = r.Array, o("keys"), o("values"), o("entries");
    }, e2cc: function(i, d, e) {
      var n = e("6eeb");
      i.exports = function(o, r, t) {
        for (var a in r) n(o, a, r[a], t);
        return o;
      };
    }, e439: function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("fc6a"), t = e("06cf").f, a = e("83ab"), u = o(function() {
        t(1);
      }), s = !a || u;
      n({ target: "Object", stat: !0, forced: s, sham: !a }, { getOwnPropertyDescriptor: function(l, c) {
        return t(r(l), c);
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
      i.exports = function(n, o) {
        return o ? n.replace(/\/+$/, "") + "/" + o.replace(/^\/+/, "") : n;
      };
    }, e6cf: function(i, d, e) {
      var n, o, r, t, a = e("23e7"), u = e("c430"), s = e("da84"), l = e("d066"), c = e("fea9"), f = e("6eeb"), y = e("e2cc"), p = e("d44e"), v = e("2626"), m = e("861d"), h = e("1c0b"), b = e("19aa"), E = e("8925"), A = e("2266"), w = e("1c7e"), k = e("4840"), g = e("2cf4").set, _ = e("b575"), j = e("cdf9"), L = e("44de"), S = e("f069"), U = e("e667"), F = e("69f3"), G = e("94ca"), ne = e("b622"), Q = e("605d"), M = e("2d00"), N = ne("species"), O = "Promise", T = F.get, q = F.set, Z = F.getterFor(O), D = c, xe = s.TypeError, pe = s.document, Pe = s.process, Be = l("fetch"), Ie = S.f, Ae = Ie, Le = !!(pe && pe.createEvent && s.dispatchEvent), Qe = typeof PromiseRejectionEvent == "function", it = "unhandledrejection", $ = "rejectionhandled", I = 0, J = 1, V = 2, Y = 1, re = 2, be = G(O, function() {
        var z = E(D) !== String(D);
        if (!z && (M === 66 || !Q && !Qe) || u && !D.prototype.finally) return !0;
        if (M >= 51 && /native code/.test(D)) return !1;
        var oe = D.resolve(1), ce = function(W) {
          W(function() {
          }, function() {
          });
        }, de = oe.constructor = {};
        return de[N] = ce, !(oe.then(function() {
        }) instanceof ce);
      }), he = be || !w(function(z) {
        D.all(z).catch(function() {
        });
      }), se = function(z) {
        var oe;
        return !(!m(z) || typeof (oe = z.then) != "function") && oe;
      }, ke = function(z, oe) {
        if (!z.notified) {
          z.notified = !0;
          var ce = z.reactions;
          _(function() {
            for (var de = z.value, W = z.state == J, te = 0; ce.length > te; ) {
              var ae, fe, Ue, qe = ce[te++], Ze = W ? qe.ok : qe.fail, we = qe.resolve, et = qe.reject, He = qe.domain;
              try {
                Ze ? (W || (z.rejection === re && Ve(z), z.rejection = Y), Ze === !0 ? ae = de : (He && He.enter(), ae = Ze(de), He && (He.exit(), Ue = !0)), ae === qe.promise ? et(xe("Promise-chain cycle")) : (fe = se(ae)) ? fe.call(ae, we, et) : we(ae)) : et(de);
              } catch (gt) {
                He && !Ue && He.exit(), et(gt);
              }
            }
            z.reactions = [], z.notified = !1, oe && !z.rejection && $e(z);
          });
        }
      }, Se = function(z, oe, ce) {
        var de, W;
        Le ? (de = pe.createEvent("Event"), de.promise = oe, de.reason = ce, de.initEvent(z, !1, !0), s.dispatchEvent(de)) : de = { promise: oe, reason: ce }, !Qe && (W = s["on" + z]) ? W(de) : z === it && L("Unhandled promise rejection", ce);
      }, $e = function(z) {
        g.call(s, function() {
          var oe, ce = z.facade, de = z.value, W = je(z);
          if (W && (oe = U(function() {
            Q ? Pe.emit("unhandledRejection", de, ce) : Se(it, ce, de);
          }), z.rejection = Q || je(z) ? re : Y, oe.error)) throw oe.value;
        });
      }, je = function(z) {
        return z.rejection !== Y && !z.parent;
      }, Ve = function(z) {
        g.call(s, function() {
          var oe = z.facade;
          Q ? Pe.emit("rejectionHandled", oe) : Se($, oe, z.value);
        });
      }, Je = function(z, oe, ce) {
        return function(de) {
          z(oe, de, ce);
        };
      }, Xe = function(z, oe, ce) {
        z.done || (z.done = !0, ce && (z = ce), z.value = oe, z.state = V, ke(z, !0));
      }, at = function(z, oe, ce) {
        if (!z.done) {
          z.done = !0, ce && (z = ce);
          try {
            if (z.facade === oe) throw xe("Promise can't be resolved itself");
            var de = se(oe);
            de ? _(function() {
              var W = { done: !1 };
              try {
                de.call(oe, Je(at, W, z), Je(Xe, W, z));
              } catch (te) {
                Xe(W, te, z);
              }
            }) : (z.value = oe, z.state = J, ke(z, !1));
          } catch (W) {
            Xe({ done: !1 }, W, z);
          }
        }
      };
      be && (D = function(z) {
        b(this, D, O), h(z), n.call(this);
        var oe = T(this);
        try {
          z(Je(at, oe), Je(Xe, oe));
        } catch (ce) {
          Xe(oe, ce);
        }
      }, n = function(z) {
        q(this, { type: O, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: I, value: void 0 });
      }, n.prototype = y(D.prototype, { then: function(z, oe) {
        var ce = Z(this), de = Ie(k(this, D));
        return de.ok = typeof z != "function" || z, de.fail = typeof oe == "function" && oe, de.domain = Q ? Pe.domain : void 0, ce.parent = !0, ce.reactions.push(de), ce.state != I && ke(ce, !1), de.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), o = function() {
        var z = new n(), oe = T(z);
        this.promise = z, this.resolve = Je(at, oe), this.reject = Je(Xe, oe);
      }, S.f = Ie = function(z) {
        return z === D || z === r ? new o(z) : Ae(z);
      }, u || typeof c != "function" || (t = c.prototype.then, f(c.prototype, "then", function(z, oe) {
        var ce = this;
        return new D(function(de, W) {
          t.call(ce, de, W);
        }).then(z, oe);
      }, { unsafe: !0 }), typeof Be == "function" && a({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return j(D, Be.apply(s, arguments));
      } }))), a({ global: !0, wrap: !0, forced: be }, { Promise: D }), p(D, O, !1, !0), v(O), r = l(O), a({ target: O, stat: !0, forced: be }, { reject: function(z) {
        var oe = Ie(this);
        return oe.reject.call(void 0, z), oe.promise;
      } }), a({ target: O, stat: !0, forced: u || be }, { resolve: function(z) {
        return j(u && this === r ? D : this, z);
      } }), a({ target: O, stat: !0, forced: he }, { all: function(z) {
        var oe = this, ce = Ie(oe), de = ce.resolve, W = ce.reject, te = U(function() {
          var ae = h(oe.resolve), fe = [], Ue = 0, qe = 1;
          A(z, function(Ze) {
            var we = Ue++, et = !1;
            fe.push(void 0), qe++, ae.call(oe, Ze).then(function(He) {
              et || (et = !0, fe[we] = He, --qe || de(fe));
            }, W);
          }), --qe || de(fe);
        });
        return te.error && W(te.value), ce.promise;
      }, race: function(z) {
        var oe = this, ce = Ie(oe), de = ce.reject, W = U(function() {
          var te = h(oe.resolve);
          A(z, function(ae) {
            te.call(oe, ae).then(ce.resolve, de);
          });
        });
        return W.error && de(W.value), ce.promise;
      } });
    }, e893: function(i, d, e) {
      var n = e("5135"), o = e("56ef"), r = e("06cf"), t = e("9bf2");
      i.exports = function(a, u) {
        for (var s = o(u), l = t.f, c = r.f, f = 0; f < s.length; f++) {
          var y = s[f];
          n(a, y) || l(a, y, c(u, y));
        }
      };
    }, e8b5: function(i, d, e) {
      var n = e("c6b6");
      i.exports = Array.isArray || function(o) {
        return n(o) == "Array";
      };
    }, e95a: function(i, d, e) {
      var n = e("b622"), o = e("3f8c"), r = n("iterator"), t = Array.prototype;
      i.exports = function(a) {
        return a !== void 0 && (o.Array === a || t[r] === a);
      };
    }, ec57: function(i, d, e) {
      var n = { "./back.svg": "d40d", "./close.svg": "4f43", "./delete.svg": "d69c", "./drag.svg": "7eb5", "./handwrite.svg": "545a", "./upper.svg": "6d55" };
      function o(t) {
        var a = r(t);
        return e(a);
      }
      function r(t) {
        if (!e.o(n, t)) {
          var a = new Error("Cannot find module '" + t + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }
        return n[t];
      }
      o.keys = function() {
        return Object.keys(n);
      }, o.resolve = r, i.exports = o, o.id = "ec57";
    }, f069: function(i, d, e) {
      var n = e("1c0b"), o = function(r) {
        var t, a;
        this.promise = new r(function(u, s) {
          if (t !== void 0 || a !== void 0) throw TypeError("Bad Promise constructor");
          t = u, a = s;
        }), this.resolve = n(t), this.reject = n(a);
      };
      i.exports.f = function(r) {
        return new o(r);
      };
    }, f183: function(i, d, e) {
      var n = e("d012"), o = e("861d"), r = e("5135"), t = e("9bf2").f, a = e("90e3"), u = e("bb2f"), s = a("meta"), l = 0, c = Object.isExtensible || function() {
        return !0;
      }, f = function(h) {
        t(h, s, { value: { objectID: "O" + ++l, weakData: {} } });
      }, y = function(h, b) {
        if (!o(h)) return typeof h == "symbol" ? h : (typeof h == "string" ? "S" : "P") + h;
        if (!r(h, s)) {
          if (!c(h)) return "F";
          if (!b) return "E";
          f(h);
        }
        return h[s].objectID;
      }, p = function(h, b) {
        if (!r(h, s)) {
          if (!c(h)) return !0;
          if (!b) return !1;
          f(h);
        }
        return h[s].weakData;
      }, v = function(h) {
        return u && m.REQUIRED && c(h) && !r(h, s) && f(h), h;
      }, m = i.exports = { REQUIRED: !1, fastKey: y, getWeakData: p, onFreeze: v };
      n[s] = !0;
    }, f5df: function(i, d, e) {
      var n = e("00ee"), o = e("c6b6"), r = e("b622"), t = r("toStringTag"), a = o(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", u = function(s, l) {
        try {
          return s[l];
        } catch {
        }
      };
      i.exports = n ? o : function(s) {
        var l, c, f;
        return s === void 0 ? "Undefined" : s === null ? "Null" : typeof (c = u(l = Object(s), t)) == "string" ? c : a ? o(l) : (f = o(l)) == "Object" && typeof l.callee == "function" ? "Arguments" : f;
      };
    }, f6b4: function(i, d, e) {
      var n = e("c532");
      function o() {
        this.handlers = [];
      }
      o.prototype.use = function(r, t) {
        return this.handlers.push({ fulfilled: r, rejected: t }), this.handlers.length - 1;
      }, o.prototype.eject = function(r) {
        this.handlers[r] && (this.handlers[r] = null);
      }, o.prototype.forEach = function(r) {
        n.forEach(this.handlers, function(t) {
          t !== null && r(t);
        });
      }, i.exports = o;
    }, f772: function(i, d, e) {
      var n = e("5692"), o = e("90e3"), r = n("keys");
      i.exports = function(t) {
        return r[t] || (r[t] = o(t));
      };
    }, f8b0: function(i, d, e) {
      e("b8d6");
    }, fb15: function(i, d, e) {
      if (e.r(d), typeof window < "u") {
        var n = window.document.currentScript, o = e("8875");
        n = o(), "currentScript" in document || Object.defineProperty(document, "currentScript", { get: o });
        var r = n && n.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);
        r && (e.p = r[1]);
      }
      e("b0c0");
      var t = e("8bbf"), a = { class: "key-board-container" }, u = { class: "key-board-area" };
      function s(x, R, B, P, K, ie) {
        var le = Object(t.resolveComponent)("Result"), ue = Object(t.resolveComponent)("DefaultBoard"), ve = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), De = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: x.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [x.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: R[1] || (R[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", a, [Object(t.createVNode)(le, { data: x.resultVal, onChange: x.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", u, [x.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ue, { key: 0, ref: "defaultBoardRef", onTrigger: x.trigger, onChange: x.change, onTranslate: x.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), x.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ve, { key: 1, onTrigger: x.trigger, onChange: x.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), x.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: x.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(x.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[De]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function l(x, R, B) {
        return R in x ? Object.defineProperty(x, R, { value: B, enumerable: !0, configurable: !0, writable: !0 }) : x[R] = B, x;
      }
      function c(x, R) {
        var B = Object.keys(x);
        if (Object.getOwnPropertySymbols) {
          var P = Object.getOwnPropertySymbols(x);
          R && (P = P.filter(function(K) {
            return Object.getOwnPropertyDescriptor(x, K).enumerable;
          })), B.push.apply(B, P);
        }
        return B;
      }
      function f(x) {
        for (var R = 1; R < arguments.length; R++) {
          var B = arguments[R] != null ? arguments[R] : {};
          R % 2 ? c(Object(B), !0).forEach(function(P) {
            l(x, P, B[P]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(x, Object.getOwnPropertyDescriptors(B)) : c(Object(B)).forEach(function(P) {
            Object.defineProperty(x, P, Object.getOwnPropertyDescriptor(B, P));
          });
        }
        return x;
      }
      function y(x, R) {
        (R == null || R > x.length) && (R = x.length);
        for (var B = 0, P = new Array(R); B < R; B++) P[B] = x[B];
        return P;
      }
      function p(x) {
        if (Array.isArray(x)) return y(x);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(x) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(x)) return Array.from(x);
      }
      e("fb6a");
      function m(x, R) {
        if (x) {
          if (typeof x == "string") return y(x, R);
          var B = Object.prototype.toString.call(x).slice(8, -1);
          return B === "Object" && x.constructor && (B = x.constructor.name), B === "Map" || B === "Set" ? Array.from(x) : B === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(B) ? y(x, R) : void 0;
        }
      }
      function h() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function b(x) {
        return p(x) || v(x) || m(x) || h();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function E(x, R) {
        if (!(x instanceof R)) throw new TypeError("Cannot call a class as a function");
      }
      function A(x, R) {
        for (var B = 0; B < R.length; B++) {
          var P = R[B];
          P.enumerable = P.enumerable || !1, P.configurable = !0, "value" in P && (P.writable = !0), Object.defineProperty(x, P.key, P);
        }
      }
      function w(x, R, B) {
        return R && A(x.prototype, R), x;
      }
      var k = function() {
        function x() {
          E(this, x), this.listeners = {};
        }
        return w(x, [{ key: "on", value: function(R, B) {
          var P = this, K = this.listeners[R];
          return K || (K = []), K.push(B), this.listeners[R] = K, function() {
            P.remove(R, B);
          };
        } }, { key: "emit", value: function(R) {
          var B = this.listeners[R];
          if (Array.isArray(B)) {
            for (var P = arguments.length, K = new Array(P > 1 ? P - 1 : 0), ie = 1; ie < P; ie++) K[ie - 1] = arguments[ie];
            for (var le = 0; le < B.length; le++) {
              var ue = B[le];
              typeof ue == "function" && ue.apply(void 0, K);
            }
          }
        } }, { key: "remove", value: function(R, B) {
          if (B) {
            var P = this.listeners[R];
            if (!P) return;
            P = P.filter(function(K) {
              return K !== B;
            }), this.listeners[R] = P;
          } else this.listeners[R] = null, delete this.listeners[R];
        } }]), x;
      }(), g = new k(), _ = { mounted: function(x, R, B) {
        var P = x.parentNode;
        x.onmousedown = function(K) {
          var ie = K.clientX - P.offsetLeft, le = K.clientY - P.offsetTop;
          document.onmousemove = function(ue) {
            var ve = ue.clientX - ie, Re = ue.clientY - le;
            P.style.left = ve + "px", P.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              g.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, x.ontouchstart = function(K) {
          var ie = K.touches[0].pageX, le = K.touches[0].pageY, ue = ie - P.offsetLeft, ve = le - P.offsetTop;
          document.ontouchmove = function(Re) {
            var De = Re.touches[0].pageX, Fe = Re.touches[0].pageY, We = De - ue, pt = Fe - ve;
            P.style.left = We + "px", P.style.top = pt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              g.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, j = _, L = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, U = { class: "key-board-result-show" }, F = { class: "key-board-result-show-container" }, G = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ne = L(function(x, R, B, P, K, ie) {
        return x.status === "CN" || x.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: x.color } }, [x.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(x.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", U, [Object(t.createVNode)("div", F, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.showList[x.showIndex], function(le, ue) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ue, onClick: function(ve) {
            return x.selectWord(le);
          } }, Object(t.toDisplayString)(ue + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), x.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", G, [Object(t.createVNode)("span", { style: x.getStyle, onClick: R[1] || (R[1] = function() {
          return x.upper && x.upper.apply(x, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: x.getStyle, onClick: R[2] || (R[2] = function() {
          return x.lower && x.lower.apply(x, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), Q = (e("1276"), e("6062"), e("5319"), function(x, R) {
        for (var B = 0, P = []; B < x.length; ) P.push(x.slice(B, B += R));
        return P;
      }), M = Symbol("KEYBOARD_CONTEXT"), N = function(x) {
        Object(t.provide)(M, x);
      }, O = function() {
        return Object(t.inject)(M);
      }, T = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(x, R) {
        var B = R.emit, P = O(), K = Object(t.computed)(function() {
          return { borderTopColor: P == null ? void 0 : P.color };
        }), ie = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          ie.showIndex !== 0 && (ie.showIndex -= 1);
        }
        function ue() {
          ie.showIndex !== ie.showList.length - 1 && (ie.showIndex += 1);
        }
        function ve() {
          ie.showIndex = 0, ie.showList = [], ie.valueList = [], g.emit("resultReset");
        }
        function Re(De) {
          ve(), B("change", De);
        }
        return Object(t.watch)(function() {
          return x.data;
        }, function(De) {
          var Fe;
          ie.showIndex = 0, ie.valueList = (De == null || (Fe = De.value) === null || Fe === void 0 ? void 0 : Fe.split("")) || [], ie.valueList.length !== 0 ? ie.showList = Q(ie.valueList, 11) : ie.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          g.on("keyBoardChange", function(De) {
            g.emit("updateBound"), ie.status = De, ve();
          }), g.on("getWordsFromServer", function(De) {
            var Fe = Array.from(new Set(De.replace(/\s+/g, "").split("")));
            ie.valueList = Fe, ie.showList = Q(Fe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          g.remove("keyBoardChange"), g.remove("getWordsFromServer");
        }), f({ color: P == null ? void 0 : P.color, upper: le, lower: ue, getStyle: K, selectWord: Re }, Object(t.toRefs)(ie));
      } });
      e("e66c"), T.render = ne, T.__scopeId = "data-v-02e63132";
      var q = T, Z = e("bc3a"), D = e.n(Z), xe = 15e3, pe = function(x) {
        D.a.defaults.baseURL = x, D.a.defaults.timeout = xe, D.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Pe(x, R, B, P, K, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: x.color } }, [Object(t.createVNode)("use", { "xlink:href": x.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Be = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(x) {
        var R = O(), B = Object(t.computed)(function() {
          return "#icon-".concat(x.iconClass);
        });
        return { color: R == null ? void 0 : R.color, iconName: B };
      } });
      e("38cd"), Be.render = Pe;
      var Ie = Be, Ae = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Le = { class: "hand-write-board" }, Qe = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var it = Ae(function(x, R, B, P, K, ie) {
        var le = Object(t.resolveComponent)("PaintBoard"), ue = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Le, [Object(t.createVNode)(le, { lib: x.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Qe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.handBoardOperList, function(ve) {
          return Object(t.openBlock)(), Object(t.createBlock)(ue, { key: ve.type, type: ve.type, data: ve.data, isCn: x.isCn, onClick: x.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), $ = { class: "paint-board" };
      function I(x, R, B, P, K, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", $, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: x.width, height: x.height, onTouchstart: R[1] || (R[1] = function() {
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
      function J(x, R, B, P, K, ie, le) {
        try {
          var ue = x[ie](le), ve = ue.value;
        } catch (Re) {
          return void B(Re);
        }
        ue.done ? R(ve) : Promise.resolve(ve).then(P, K);
      }
      function V(x) {
        return function() {
          var R = this, B = arguments;
          return new Promise(function(P, K) {
            var ie = x.apply(R, B);
            function le(ve) {
              J(ie, P, K, le, ue, "next", ve);
            }
            function ue(ve) {
              J(ie, P, K, le, ue, "throw", ve);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var Y, re, be = function() {
        var x = V(regeneratorRuntime.mark(function R(B, P, K, ie) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, D.a.post("", { lib: ie, lpXis: B, lpYis: P, lpCis: K });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, R);
        }));
        return function(R, B, P, K) {
          return x.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(x) {
        var R = O(), B = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), P = Object(t.ref)(null);
        function K() {
          return ie.apply(this, arguments);
        }
        function ie() {
          return ie = V(regeneratorRuntime.mark(function Ee() {
            var ze, Me;
            return regeneratorRuntime.wrap(function(Ye) {
              for (; ; ) switch (Ye.prev = Ye.next) {
                case 0:
                  return Ye.next = 2, be(B.clickX, B.clickY, B.clickC, x.lib);
                case 2:
                  ze = Ye.sent, Me = ze.data, g.emit("getWordsFromServer", (Me == null ? void 0 : Me.v) || "");
                case 5:
                case "end":
                  return Ye.stop();
              }
            }, Ee);
          })), ie.apply(this, arguments);
        }
        function le() {
          P.value && Y && (B.clickX = [], B.clickY = [], B.clickC = [], Y.clearRect(0, 0, B.width, B.height));
        }
        function ue(Ee) {
          if (Ee.type.includes("mouse")) {
            var ze = Ee;
            return Math.floor(ze.clientX - B.x);
          }
          if (Ee.type.includes("touch")) {
            var Me, Ye = Ee;
            return Math.floor(((Me = Ye.targetTouches[0]) === null || Me === void 0 ? void 0 : Me.clientX) - B.x);
          }
          return 0;
        }
        function ve(Ee) {
          if (Ee.type.includes("mouse")) {
            var ze = Ee;
            return Math.floor(ze.clientY - B.y);
          }
          if (Ee.type.includes("touch")) {
            var Me, Ye = Ee;
            return Math.floor(((Me = Ye.targetTouches[0]) === null || Me === void 0 ? void 0 : Me.clientY) - B.y);
          }
          return 0;
        }
        function Re(Ee) {
          if (Y) {
            B.isMouseDown = !0;
            var ze = ue(Ee), Me = ve(Ee);
            clearTimeout(re), B.oldX = ze, B.oldY = Me, Y.beginPath();
          }
        }
        function De(Ee) {
          if (Y && (Ee.preventDefault(), B.isMouseDown)) {
            var ze = ue(Ee), Me = ve(Ee);
            B.clickX.push(ze), B.clickY.push(Me), B.clickC.push(0), Y.strokeStyle = R == null ? void 0 : R.color, Y.fillStyle = R == null ? void 0 : R.color, Y.lineWidth = 4, Y.lineCap = "round", Y.moveTo(B.oldX, B.oldY), Y.lineTo(ze, Me), Y.stroke(), B.oldX = ze, B.oldY = Me;
          }
        }
        function Fe() {
          B.isMouseDown && (B.isMouseDown = !1, re = setTimeout(function() {
            le();
          }, 1500), B.clickC.pop(), B.clickC.push(1), K());
        }
        function We() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ee = document.querySelector(".paint-board").getBoundingClientRect();
              B.x = Ee.x, B.y = Ee.y, B.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), B.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function pt() {
          var Ee;
          Y = (Ee = P.value) === null || Ee === void 0 ? void 0 : Ee.getContext("2d"), le(), We(), window.addEventListener("animationend", We), window.addEventListener("resize", We), window.addEventListener("scroll", We);
        }
        return Object(t.onMounted)(function() {
          pt(), g.on("updateBound", function() {
            We();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", We), window.removeEventListener("resize", We), window.removeEventListener("scroll", We), g.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(B)), {}, { move: De, down: Re, mouseup: Fe, canvasRef: P });
      } });
      he.render = I;
      var se = he;
      function ke(x, R, B, P, K, ie) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(x.type), { "key-board-button-active": x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" }], style: x.getStyle, onClick: R[1] || (R[1] = function() {
          return x.click && x.click.apply(x, arguments);
        }), onMouseenter: R[2] || (R[2] = function(ue) {
          return x.isHoverStatus = !0;
        }), onMouseleave: R[3] || (R[3] = function(ue) {
          return x.isHoverStatus = !1;
        }) }, [x.type === "upper" || x.type === "delete" || x.type === "handwrite" || x.type === "close" || x.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": x.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: x.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Se = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Ie }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(x, R) {
        var B = R.emit, P = O(), K = Object(t.ref)(!1), ie = Object(t.computed)(function() {
          return x.type === "change2lang" ? x.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : x.isUpper ? x.data.toUpperCase() : x.data;
        }), le = Object(t.computed)(function() {
          return x.isUpper && x.type === "upper" || x.isNum && x.type === "change2num" || x.isSymbol && x.type === "#+=" || K.value ? { color: "#f5f5f5", background: P == null ? void 0 : P.color } : { color: P == null ? void 0 : P.color, background: "#f5f5f5" };
        });
        function ue(ve) {
          ve.preventDefault(), B("click", { data: x.isUpper ? x.data.toUpperCase() : x.data, type: x.type });
        }
        return { isHoverStatus: K, getStyle: le, getCode: ie, click: ue };
      } });
      e("de23"), Se.render = ke;
      var $e = Se, je = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: se, KeyCodeButton: $e }, setup: function(x, R) {
        var B = R.emit, P = O(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ie(le) {
          var ue = le.data, ve = le.type;
          switch (ve) {
            case "close":
              P == null || P.closeKeyBoard();
              break;
            case "back":
              P == null || P.changeDefaultBoard(), g.emit("resultReset"), g.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              B("trigger", { data: ue, type: ve });
              break;
          }
        }
        return f({ click: ie }, Object(t.toRefs)(K));
      } });
      e("9aaf"), je.render = it, je.__scopeId = "data-v-1b5e0983";
      var Ve = je, Je = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Xe = { class: "default-key-board" }, at = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Je(function(x, R, B, P, K, ie) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Xe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.lineList, function(ue, ve) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ve + 1)], key: ve }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ue, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: x.isUpper, key: Re, type: Re, data: Re, isSymbol: x.isSymbol, onClick: x.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", at, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(x.line4, function(ue) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ue.type, type: ue.type, data: ue.data, isCn: x.isCn, isNum: x.isNum, onClick: x.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), oe = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), ce = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, de = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, W = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], te = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: $e }, emits: ["translate", "trigger", "change"], setup: function(x, R) {
        var B = R.emit, P = O(), K = Object(t.reactive)({ lineList: [ce.line1, ce.line2, ce.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ie() {
          var ue;
          K.line4 = JSON.parse(JSON.stringify(W)), P != null && (ue = P.modeList) !== null && ue !== void 0 && ue.find(function(ve) {
            return ve === "handwrite";
          }) && P !== null && P !== void 0 && P.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ue) {
          var ve = ue.data, Re = ue.type;
          switch (Re) {
            case "close":
              K.oldVal = "", P == null || P.closeKeyBoard();
              break;
            case "upper":
              K.oldVal = "", K.isUpper = !K.isUpper;
              break;
            case "change2lang":
              K.isCn = !K.isCn, K.isNum || K.isSymbol || g.emit("keyBoardChange", K.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (K.isNum = !K.isNum, K.isSymbol = !1, K.isNum) {
                var De;
                g.emit("keyBoardChange", "number");
                var Fe = JSON.parse(JSON.stringify(de.line3));
                P != null && (De = P.modeList) !== null && De !== void 0 && De.find(function(We) {
                  return We === "symbol";
                }) || (Fe.shift(), Fe.unshift("+")), K.lineList = [de.line1, de.line2, Fe];
              } else g.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [ce.line1, ce.line2, ce.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (g.emit("keyBoardChange", "symbol"), K.lineList = [oe.line1, oe.line2, oe.line3]) : (g.emit("keyBoardChange", "number"), K.lineList = [de.line1, de.line2, de.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && Re === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), B("translate", K.oldVal)) : (Re === "handwrite" && g.emit("keyBoardChange", "handwrite"), B("trigger", { data: ve, type: Re }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? B("change", ve) : (B("translate", K.oldVal + ve), K.oldVal = K.oldVal + ve);
              break;
          }
        }
        return ie(), Object(t.onMounted)(function() {
          g.on("resultReset", function() {
            K.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(K)), {}, { click: le });
      } });
      e("f8b0"), te.render = z, te.__scopeId = "data-v-4b78e5a1";
      var ae = te, fe = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ue = e("ec57"), qe = function(x) {
        return x.keys().map(x);
      };
      qe(Ue);
      var Ze = [], we = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: j }, components: { Result: q, SvgIcon: Ie, HandBoard: Ve, DefaultBoard: ae }, setup: function(x, R) {
        var B = R.emit, P = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function ie(_e) {
          var Oe, Ce;
          switch (Object(t.nextTick)(function() {
            g.emit("keyBoardChange", "CN");
          }), _e) {
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
              (Oe = x.modeList) !== null && Oe !== void 0 && Oe.find(function(Ne) {
                return Ne === "handwrite";
              }) && x.handApi ? (P.showMode = "handwrite", Object(t.nextTick)(function() {
                g.emit("keyBoardChange", "handwrite");
              })) : P.showMode = "default";
              break;
            case "symbol":
              P.showMode = "default", (Ce = x.modeList) !== null && Ce !== void 0 && Ce.find(function(Ne) {
                return Ne === "symbol";
              }) && Object(t.nextTick)(function() {
                var Ne, tt;
                (Ne = K.value) === null || Ne === void 0 || Ne.click({ data: ".?123", type: "change2num" }), (tt = K.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              P.showMode = "default";
              break;
          }
        }
        function le(_e) {
          if (P.visible = !0, we = _e.target, ie(we.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Oe = document.querySelector(".key-board-modal");
            Oe.style.display = "block";
          }
        }
        function ue() {
          if (we && we.blur(), we = null, P.visible = !1, B("closed"), P.showMode = "default", P.resultVal = {}, document.querySelector(".key-board-modal")) {
            var _e = document.querySelector(".key-board-modal");
            _e.style.display = "none";
          }
        }
        function ve() {
          x.closeOnClickModal && ue(), B("modalClick");
        }
        function Re() {
          var _e;
          if (document.querySelector(".key-board-modal")) {
            var Oe;
            (Oe = document.querySelector(".key-board-modal")) === null || Oe === void 0 || Oe.addEventListener("click", ve);
          } else {
            var Ce = document.createElement("div");
            Ce.className = "key-board-modal", Ce.style.display = "none", (_e = document.querySelector("body")) === null || _e === void 0 || _e.appendChild(Ce), Ce.addEventListener("click", ve);
          }
        }
        function De() {
          x.handApi && pe(x.handApi), [].concat(b(document.querySelectorAll("input")), b(document.querySelectorAll("textarea"))).forEach(function(_e) {
            _e.getAttribute("data-mode") !== null && (Ze.push(_e), _e.addEventListener("focus", le), x.blurHide && _e.addEventListener("blur", ue));
          });
        }
        function Fe(_e) {
          if (!we) return "";
          var Oe = we, Ce = Oe.selectionStart, Ne = Oe.selectionEnd;
          if (!Ce || !Ne) return "";
          var tt = _e.substring(0, Ce - 1) + _e.substring(Ne);
          return Oe.value = tt, Oe.focus(), Oe.selectionStart = Ce - 1, Oe.selectionEnd = Ce - 1, tt;
        }
        function We(_e) {
          var Oe = _e.type;
          switch (Oe) {
            case "handwrite":
              P.showMode = "handwrite";
              break;
            case "delete":
              if (!we) return;
              var Ce = Fe(we.value);
              we.value = Ce, B("change", Ce, we.getAttribute("data-prop") || we);
              break;
          }
        }
        function pt(_e, Oe) {
          if (!we) return "";
          var Ce = we, Ne = Ce.selectionStart || 0, tt = Ce.selectionEnd || 0, St = _e.substring(0, Ne) + Oe + _e.substring(tt);
          return Ce.value = St, Ce.focus(), Ce.selectionStart = Ne + Oe.length, Ce.selectionEnd = Ne + Oe.length, St;
        }
        function Ee(_e) {
          if (we) {
            var Oe = pt(we.value, _e);
            we.value = Oe, B("change", Oe, we.getAttribute("data-prop") || we), B("keyChange", _e, we.getAttribute("data-prop") || we);
          }
        }
        function ze(_e) {
          var Oe = new RegExp("^".concat(_e, "\\w*")), Ce = Object.keys(fe).filter(function(Ne) {
            return Oe.test(Ne);
          }).sort();
          P.resultVal = { code: _e, value: _e ? Ce.length > 1 ? Ce.reduce(function(Ne, tt) {
            return Ne + fe[tt];
          }, "") : fe[Ce[0]] : "" }, we && B("keyChange", _e, we.getAttribute("data-prop") || we);
        }
        function Me() {
          De();
        }
        function Ye() {
          return we;
        }
        return Object(t.onMounted)(function() {
          x.modal && Re(), De(), g.on("resultReset", function() {
            P.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var _e;
          (_e = document.querySelector(".key-board-modal")) === null || _e === void 0 || _e.removeEventListener("click", ve), Ze.forEach(function(Oe) {
            Oe.removeEventListener("focus", le), Oe.removeEventListener("blur", ue);
          });
        }), N(Object(t.reactive)({ color: x.color, modeList: x.modeList, handApi: x.handApi, closeKeyBoard: function() {
          ue();
        }, changeDefaultBoard: function() {
          P.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(P)), {}, { defaultBoardRef: K, getCurrentInput: Ye, translate: ze, reSignUp: Me, trigger: We, change: Ee });
      } });
      et.render = s;
      var He = et;
      He.install = function(x) {
        x.component(He.name, He);
      };
      var gt = He, Nt = gt;
      d.default = Nt;
    }, fb6a: function(i, d, e) {
      var n = e("23e7"), o = e("861d"), r = e("e8b5"), t = e("23cb"), a = e("50c4"), u = e("fc6a"), s = e("8418"), l = e("b622"), c = e("1dde"), f = c("slice"), y = l("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(m, h) {
        var b, E, A, w = u(this), k = a(w.length), g = t(m, k), _ = t(h === void 0 ? k : h, k);
        if (r(w) && (b = w.constructor, typeof b != "function" || b !== Array && !r(b.prototype) ? o(b) && (b = b[y], b === null && (b = void 0)) : b = void 0, b === Array || b === void 0)) return p.call(w, g, _);
        for (E = new (b === void 0 ? Array : b)(v(_ - g, 0)), A = 0; g < _; g++, A++) g in w && s(E, A, w[g]);
        return E.length = A, E;
      } });
    }, fc6a: function(i, d, e) {
      var n = e("44ad"), o = e("1d80");
      i.exports = function(r) {
        return n(o(r));
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
})(At);
var xo = At.exports;
const Lt = /* @__PURE__ */ wo(xo);
$t({
  components: { KeyBoard: Lt },
  setup() {
    function me(ee, X) {
      console.log("change value ---->", ee), console.log("change input dom ---->", X);
    }
    return {
      change: me
    };
  }
});
const ko = { class: "wifi-component" }, _o = { class: "row" }, So = { class: "column" }, Oo = { class: "column" }, jo = { class: "status" }, Eo = { class: "row" }, Co = { class: "column" }, To = {
  key: 0,
  class: "wifi-modal"
}, Ao = { class: "wifi-modal-content" }, Lo = { class: "wifi-list" }, No = {
  key: 0,
  class: "no-wifi"
}, Po = ["onClick"], Bo = { class: "wifi-ssid" }, $o = { class: "signal-strength" }, Ro = {
  __name: "WiFi",
  setup(me) {
    const { sendToPyQt: ee } = Ge(), X = H("未连接"), i = H("无网络"), d = H("未知"), e = H(""), n = H(""), o = H(!1), r = H([]), t = H(null), a = () => {
      ee("check_wifi_status", {});
    }, u = () => {
      t.value = setInterval(a, 5e3);
    }, s = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    dt(() => {
      u();
      const { message: m } = Ge();
      rt(m, (h) => {
        if (h && h.type === "wifi_list") {
          const b = JSON.parse(h.content);
          r.value = b;
        } else if (h && h.type === "wifi_status") {
          const b = JSON.parse(h.content);
          X.value = b.wifi_name, i.value = b.internet_status, d.value = b.zerotier_ip;
        }
      });
    }), _t(() => {
      s();
    });
    const l = async () => {
      o.value = !0, r.value = [], document.body.style.overflow = "hidden", c();
    }, c = () => {
      r.value = [], ee("search_wifi", {});
    }, f = () => {
      o.value = !1, document.body.style.overflow = "auto";
    }, y = (m) => {
      e.value = m.ssid, f();
    }, p = () => {
      ee("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, v = (m, h) => {
      h.placeholder === "WiFi 名称" ? e.value = m : h.placeholder === "WiFi 密码" && (n.value = m);
    };
    return (m, h) => (ge(), ye("div", ko, [
      C("div", _o, [
        C("div", So, [
          st(C("input", {
            "onUpdate:modelValue": h[0] || (h[0] = (b) => e.value = b),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [ft, e.value]
          ])
        ]),
        C("div", Oo, [
          C("div", jo, [
            vt(" WiFi: " + Te(X.value) + " | 网络: " + Te(i.value) + " ", 1),
            h[2] || (h[2] = C("br", null, null, -1)),
            vt(" zerotier ip地址: " + Te(d.value), 1)
          ])
        ])
      ]),
      C("div", Eo, [
        C("div", Co, [
          st(C("input", {
            "onUpdate:modelValue": h[1] || (h[1] = (b) => n.value = b),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [ft, n.value]
          ])
        ]),
        C("div", { class: "column" }, [
          C("div", { class: "button-group" }, [
            C("button", { onClick: l }, "搜索可用 WiFi"),
            C("button", { onClick: p }, "连接 WiFi")
          ])
        ])
      ]),
      Ke(Rt(Lt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: v,
        class: "scaled-keyboard"
      }),
      o.value ? (ge(), ye("div", To, [
        C("div", Ao, [
          h[4] || (h[4] = C("h2", null, "可用的WiFi网络", -1)),
          C("div", Lo, [
            r.value.length === 0 ? (ge(), ye("div", No, h[3] || (h[3] = [
              C("div", { class: "loading-spinner" }, null, -1),
              C("div", null, "搜索中...", -1)
            ]))) : (ge(!0), ye(ut, { key: 1 }, ct(r.value, (b) => (ge(), ye("div", {
              key: b.ssid,
              class: "wifi-item",
              onClick: (E) => y(b)
            }, [
              C("span", Bo, Te(b.ssid), 1),
              C("span", $o, "信号强度: " + Te(b.signal), 1)
            ], 8, Po))), 128))
          ]),
          C("div", { class: "modal-buttons" }, [
            C("button", { onClick: c }, "重新搜索"),
            C("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : ot("", !0)
    ]));
  }
}, Io = /* @__PURE__ */ lt(Ro, [["__scopeId", "data-v-e6b1dc64"]]), Uo = {
  key: 0,
  class: "numeric-keyboard"
}, Do = { class: "keyboard" }, Mo = { class: "current-value" }, Fo = ["onClick"], Vo = {
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
  setup(me, { emit: ee }) {
    const X = me, i = ee, d = H([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = H("");
    rt(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => me.showKeyboard ? (ge(), ye("div", Uo, [
      C("div", Do, [
        C("div", Mo, Te(e.value), 1),
        (ge(!0), ye(ut, null, ct(d.value, (t) => (ge(), ye("div", {
          key: t.join(),
          class: "row"
        }, [
          (ge(!0), ye(ut, null, ct(t, (a) => (ge(), ye("button", {
            key: a,
            onClick: (u) => n(a),
            class: nt({ "function-key": a === "清除" || a === "确定" })
          }, Te(a), 11, Fo))), 128))
        ]))), 128))
      ])
    ])) : ot("", !0);
  }
}, jt = /* @__PURE__ */ lt(Vo, [["__scopeId", "data-v-2ccc1cb7"]]), qo = { class: "container" }, Wo = { class: "column" }, zo = { class: "status-bar" }, Ko = ["disabled"], Qo = { class: "column" }, Ho = {
  key: 0,
  class: "modal"
}, Go = { class: "modal-content" }, Jo = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(me, { emit: ee }) {
    const { sendToPyQt: X } = Ge(), i = mt({
      isPyQtWebEngine: !1
    }), d = H("未激活"), e = H(0), n = H(""), o = H(""), r = H(!1), t = H(7776e3);
    let a, u;
    const s = H(0), l = H(1), c = H(null), f = H(!1), y = H(!1), p = xt(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${l.value} 次锁定 - 剩余时间: ${v.value}`), v = xt(() => {
      const Q = Math.floor(e.value / 86400), M = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), N = Math.floor(e.value % (60 * 60) / 60), O = e.value % 60;
      return `${Q}天 ${M.toString().padStart(2, "0")}:${N.toString().padStart(2, "0")}:${O.toString().padStart(2, "0")}`;
    }), m = xt(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function h(Q) {
      d.value === "未激活" && (Q.target.setPointerCapture(Q.pointerId), s.value = 0, u = setInterval(() => {
        s.value += 2, s.value >= 100 && (clearInterval(u), A());
      }, 30));
    }
    function b(Q) {
      Q.target.releasePointerCapture(Q.pointerId), E();
    }
    function E() {
      clearInterval(u), s.value = 0;
    }
    function A() {
      X("activate_device", {});
    }
    function w(Q, M) {
      X("Lock_set_response", { method: "activateDevice", args: { randomCode: Q, time: M } }), d.value = "已激活", n.value = Q, c.value = M, k();
    }
    function k() {
      g(), a = setInterval(() => {
        e.value > 0 ? g() : _();
      }, 1e3);
    }
    function g() {
      const Q = Date.now(), M = c.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((M - Q) / 1e3));
    }
    function _() {
      r.value = !0, document.body.style.overflow = "hidden", clearInterval(a), ne();
    }
    function j() {
      L(o.value);
    }
    function L(Q) {
      X("check_lock_password", {
        target: "attemptUnlock",
        password: Q,
        lockCount: l.value,
        deviceRandomCode: n.value
      }), o.value = "";
    }
    function S() {
      d.value = "永久激活", r.value = !1, document.body.style.overflow = "auto", clearInterval(a);
    }
    function U() {
      r.value = !1, document.body.style.overflow = "auto", l.value++, a && clearInterval(a), k();
    }
    _t(() => {
      clearInterval(a), clearInterval(u);
    }), dt(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: Q } = Ge();
        rt(Q, (M) => {
          if (M && M.type === "confirm_lock_password")
            try {
              const N = JSON.parse(M.content);
              N.target === "attemptUnlock" && (N.result === "success" ? (r.value ? c.value = Date.now() : c.value = c.value + t.value * 1e3, X("update_baseTime", c.value), U(), X("Lock_set_response", { method: "extendLockTime", args: { baseTime: c.value } })) : N.result === "forever_success" ? (S(), X("Lock_set_response", { method: "permanentUnlock", args: {} })) : X("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (N) {
              console.error("Failed to parse confirm lock password :", N);
            }
          else if (M && M.type === "device_activated")
            try {
              const N = JSON.parse(M.content);
              w(N.device_random_code, N.device_base_time);
            } catch (N) {
              console.error("Failed to parse device activation result:", N);
            }
          else if (M && M.type === "device_info")
            try {
              const N = JSON.parse(M.content);
              d.value = N.device_status, n.value = N.device_random_code, l.value = N.device_lock_count, c.value = N.device_base_time, N.device_status === "已激活" ? k() : N.device_status === "永久激活" && S();
            } catch (N) {
              console.error("Failed to parse device status:", N);
            }
          else if (M && M.type === "Lock_init")
            F();
          else if (M && M.type === "Lock_set") {
            console.log("Lock_set:", M.content);
            const N = JSON.parse(M.content);
            N.method === "requestActivation" ? A() : N.method === "attemptUnlock" && L(N.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const F = () => {
      const Q = {
        deviceStatus: d.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: o.value,
        isLocked: r.value,
        lockInterval: t.value,
        lockCount: l.value,
        baseTime: c.value,
        progressWidth: s.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: y.value
      };
      console.log("Sending Lock initial state:", Q), X("Lock_init_response", Q);
    }, G = ee, ne = () => {
      G("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (Q, M) => (ge(), ye("div", qo, [
      C("div", Wo, [
        C("div", zo, Te(p.value), 1),
        C("button", {
          class: "activation-button",
          onPointerdown: h,
          onPointerup: b,
          onPointercancel: E,
          onPointerleave: E,
          disabled: d.value !== "未激活"
        }, [
          vt(Te(m.value) + " ", 1),
          C("div", {
            class: "progress-bar",
            style: kt({ width: s.value + "%" })
          }, null, 4)
        ], 40, Ko)
      ]),
      C("div", Qo, [
        st(C("input", {
          "onUpdate:modelValue": M[0] || (M[0] = (N) => o.value = N),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: M[1] || (M[1] = (N) => f.value = !0)
        }, null, 544), [
          [ft, o.value]
        ]),
        C("button", {
          class: "unlock-button",
          onClick: j
        }, "解锁")
      ]),
      r.value ? (ge(), ye("div", Ho, [
        C("div", Go, [
          M[8] || (M[8] = C("h3", null, "设备已锁定", -1)),
          C("h3", null, "第 " + Te(l.value) + " 次锁定", 1),
          C("h3", null, "设备随机码: " + Te(n.value), 1),
          st(C("input", {
            "onUpdate:modelValue": M[2] || (M[2] = (N) => o.value = N),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: M[3] || (M[3] = (N) => y.value = !0)
          }, null, 544), [
            [ft, o.value]
          ]),
          C("button", {
            class: "unlock-button",
            onClick: j
          }, "解锁")
        ])
      ])) : ot("", !0),
      Ke(jt, {
        modelValue: o.value,
        "onUpdate:modelValue": M[4] || (M[4] = (N) => o.value = N),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": M[5] || (M[5] = (N) => f.value = N)
      }, null, 8, ["modelValue", "showKeyboard"]),
      Ke(jt, {
        modelValue: o.value,
        "onUpdate:modelValue": M[6] || (M[6] = (N) => o.value = N),
        showKeyboard: y.value,
        "onUpdate:showKeyboard": M[7] || (M[7] = (N) => y.value = N)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Yo = /* @__PURE__ */ lt(Jo, [["__scopeId", "data-v-3d3fd364"]]), Xo = { class: "app-container" }, er = {
  __name: "App",
  setup(me) {
    Ut();
    const ee = H(""), X = (i) => {
      ee.value = i;
    };
    return (i, d) => (ge(), ye("div", Xo, [
      d[0] || (d[0] = C("h1", null, "涪特智能养护台车控制系统", -1)),
      Ke($n),
      Ke(yo),
      Ke(sn),
      Ke(ro, { message: ee.value }, null, 8, ["message"]),
      Ke(Io),
      Ke(Yo, { onMessageFromA: X })
    ]));
  }
};
export {
  er as default
};
