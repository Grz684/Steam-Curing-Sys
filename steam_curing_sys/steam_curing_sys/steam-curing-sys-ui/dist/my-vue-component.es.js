import Pt, { ref as J, onMounted as dt, provide as bt, readonly as wt, inject as xt, watch as Je, openBlock as ye, createElementBlock as be, createElementVNode as j, toDisplayString as Ee, Fragment as Ze, renderList as lt, normalizeClass as ut, createCommentVNode as rt, reactive as mt, createVNode as qe, withDirectives as ct, vModelRadio as Ot, createTextVNode as ft, vModelText as pt, computed as ht, onUnmounted as _t, normalizeStyle as kt, vModelCheckbox as Bt, defineComponent as $t, unref as Rt } from "vue";
const Et = Symbol(), Ct = Symbol(), Tt = Symbol();
function It(me, G) {
  me && me.messageSignal ? me.messageSignal.connect((X) => {
    try {
      const i = JSON.parse(X);
      G.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), G.value = { type: "unknown", content: X };
    }
  }) : console.error("messageSignal not found on bridge");
}
function Ut() {
  const me = J(null), G = J(null), X = J("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      me.value = d, G.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), It(G.value, X), G.value && typeof G.value.vueReady == "function" ? G.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  dt(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), bt(Et, wt(me)), bt(Ct, wt(G)), bt(Tt, wt(X));
}
function Qe() {
  const me = xt(Et), G = xt(Ct), X = xt(Tt);
  return (!me || !G || !X) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: me,
    bridge: G,
    message: X,
    sendToPyQt: (d, e) => {
      if (console.log(`Attempting to call ${d} with args:`, e), G && G.value)
        if (typeof G.value.sendToPyQt == "function")
          try {
            G.value.sendToPyQt(d, JSON.stringify(e));
          } catch (n) {
            console.error("Error calling sendToPyQt:", n);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(G.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const it = (me, G) => {
  const X = me.__vccOpts || me;
  for (const [i, d] of G)
    X[i] = d;
  return X;
}, Dt = {
  key: 0,
  class: "numeric-keyboard"
}, Ft = { class: "keyboard" }, Mt = { class: "current-value" }, Vt = ["onClick"], Wt = {
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
  setup(me, { emit: G }) {
    const X = me, i = G, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = J("");
    Je(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => me.showKeyboard ? (ye(), be("div", Dt, [
      j("div", Ft, [
        j("div", Mt, Ee(e.value), 1),
        (ye(!0), be(Ze, null, lt(d.value, (t) => (ye(), be("div", {
          key: t.join(),
          class: "row"
        }, [
          (ye(!0), be(Ze, null, lt(t, (a) => (ye(), be("button", {
            key: a,
            onClick: (u) => n(a),
            class: ut({ "function-key": a === "清除" || a === "确定" })
          }, Ee(a), 11, Vt))), 128))
        ]))), 128))
      ])
    ])) : rt("", !0);
  }
}, gt = /* @__PURE__ */ it(Wt, [["__scopeId", "data-v-541feda2"]]), qt = { class: "settings-container" }, zt = { class: "setting-group" }, Kt = { class: "setting-item" }, Qt = { class: "setting-controls" }, Ht = ["value"], Gt = { class: "setting-item" }, Jt = { class: "setting-controls" }, Yt = ["value"], Xt = { class: "setting-group" }, Zt = { class: "setting-item" }, en = { class: "setting-controls" }, tn = ["value"], nn = { class: "setting-item" }, on = { class: "setting-controls" }, rn = ["value"], an = {
  __name: "SensorSettings",
  setup(me) {
    const { sendToPyQt: G } = Qe(), X = mt({
      isPyQtWebEngine: !1
    }), i = J(35), d = J(25), e = J(95), n = J(90), o = J(!1), r = J(null), t = J("");
    dt(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = Qe();
        Je(g, (p) => {
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
    const a = (g, p) => {
      const v = g === "tempUpper" ? i : g === "tempLower" ? d : g === "humidityUpper" ? e : n;
      v.value = (v.value || 0) + p, g.startsWith("temp") ? u(g === "tempUpper" ? "upper" : "lower") : s(g === "humidityUpper" ? "upper" : "lower");
    }, u = (g) => {
      i.value === "" && (i.value = d.value + 1), d.value === "" && (d.value = i.value - 1), g === "upper" ? i.value = Math.max(d.value + 1, i.value) : d.value = Math.min(i.value - 1, d.value), c();
    }, s = (g) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), g === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), c();
    }, c = () => {
      if (i.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const g = {
          temp_upper: i.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", g), X.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), G("updateLimitSettings", g)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (g) => {
      r.value = g, o.value = !0, t.value = g.startsWith("temp") ? g === "tempUpper" ? i.value : d.value : g === "humidityUpper" ? e.value : n.value;
    }, f = (g) => {
      const p = parseFloat(g);
      isNaN(p) || (r.value === "tempUpper" ? (i.value = p, u("upper")) : r.value === "tempLower" ? (d.value = p, u("lower")) : r.value === "humidityUpper" ? (e.value = p, s("upper")) : r.value === "humidityLower" && (n.value = p, s("lower"))), r.value = null;
    };
    return (g, p) => (ye(), be("div", qt, [
      j("div", zt, [
        p[15] || (p[15] = j("h2", null, "温度设置 (°C)", -1)),
        j("div", Kt, [
          p[13] || (p[13] = j("span", { class: "setting-label" }, "上限：", -1)),
          j("div", Qt, [
            j("button", {
              onClick: p[0] || (p[0] = (v) => a("tempUpper", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: i.value,
              onFocus: p[1] || (p[1] = (v) => l("tempUpper")),
              readonly: ""
            }, null, 40, Ht),
            j("button", {
              onClick: p[2] || (p[2] = (v) => a("tempUpper", 1))
            }, "+")
          ])
        ]),
        j("div", Gt, [
          p[14] || (p[14] = j("span", { class: "setting-label" }, "下限：", -1)),
          j("div", Jt, [
            j("button", {
              onClick: p[3] || (p[3] = (v) => a("tempLower", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: d.value,
              onFocus: p[4] || (p[4] = (v) => l("tempLower")),
              readonly: ""
            }, null, 40, Yt),
            j("button", {
              onClick: p[5] || (p[5] = (v) => a("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      j("div", Xt, [
        p[18] || (p[18] = j("h2", null, "湿度设置 (%)", -1)),
        j("div", Zt, [
          p[16] || (p[16] = j("span", { class: "setting-label" }, "上限：", -1)),
          j("div", en, [
            j("button", {
              onClick: p[6] || (p[6] = (v) => a("humidityUpper", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: e.value,
              onFocus: p[7] || (p[7] = (v) => l("humidityUpper")),
              readonly: ""
            }, null, 40, tn),
            j("button", {
              onClick: p[8] || (p[8] = (v) => a("humidityUpper", 1))
            }, "+")
          ])
        ]),
        j("div", nn, [
          p[17] || (p[17] = j("span", { class: "setting-label" }, "下限：", -1)),
          j("div", on, [
            j("button", {
              onClick: p[9] || (p[9] = (v) => a("humidityLower", -1))
            }, "-"),
            j("input", {
              type: "text",
              value: n.value,
              onFocus: p[10] || (p[10] = (v) => l("humidityLower")),
              readonly: ""
            }, null, 40, rn),
            j("button", {
              onClick: p[11] || (p[11] = (v) => a("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      qe(gt, {
        modelValue: t.value,
        showKeyboard: o.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": p[12] || (p[12] = (v) => o.value = v)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, sn = /* @__PURE__ */ it(an, [["__scopeId", "data-v-c66c99de"]]), un = {
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
  setup(me, { emit: G }) {
    const X = me, i = G, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["-", "0", "."],
      ["清除", "确定"]
    ]), e = J("");
    Je(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : o === "-" ? e.value.startsWith("-") ? e.value = e.value.slice(1) : e.value = "-" + e.value : o === "." && e.value.includes(".") || (e.value += o);
    };
    return (o, r) => me.showKeyboard ? (ye(), be("div", un, [
      j("div", cn, [
        j("div", ln, Ee(e.value), 1),
        (ye(!0), be(Ze, null, lt(d.value, (t) => (ye(), be("div", {
          key: t.join(),
          class: "row"
        }, [
          (ye(!0), be(Ze, null, lt(t, (a) => (ye(), be("button", {
            key: a,
            onClick: (u) => n(a),
            class: ut({
              "function-key": ["清除", "确定"].includes(a),
              "operator-key": a === "-"
            })
          }, Ee(a), 11, dn))), 128))
        ]))), 128))
      ])
    ])) : rt("", !0);
  }
}, pn = /* @__PURE__ */ it(fn, [["__scopeId", "data-v-3f49a3dc"]]), vn = { class: "sensor-data-group" }, hn = { class: "sensor-section" }, mn = { class: "sensor-container" }, gn = { class: "sensor-grid" }, yn = ["onClick"], bn = { class: "sensor-title" }, wn = { class: "sensor-value" }, xn = { class: "sensor-section" }, kn = { class: "sensor-container" }, _n = { class: "sensor-grid" }, Sn = ["onClick"], On = { class: "sensor-title" }, jn = { class: "sensor-value" }, En = {
  key: 0,
  class: "dialog-overlay"
}, Cn = { class: "dialog" }, Tn = { class: "dialog-content" }, An = { class: "radio-group" }, Ln = { class: "input-group" }, Nn = ["placeholder"], Pn = { class: "dialog-actions" }, Bn = {
  __name: "SensorDisplay",
  setup(me) {
    const G = J({ temperature: {}, humidity: {} }), X = J({
      temperature: {},
      humidity: {}
    }), i = J(null), d = J(!1), e = J("offset"), n = J(""), o = J(!1), { sendToPyQt: r } = Qe();
    dt(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: l } = Qe();
        Je(l, (f) => {
          if (f && f.type === "update_sensor_data")
            try {
              G.value = JSON.parse(f.content);
            } catch (g) {
              console.error("Failed to parse sensor data:", g);
            }
          else if (f && f.type === "update_adjust_settings")
            try {
              const g = JSON.parse(f.content);
              X.value.temperature = g.temperature, X.value.humidity = g.humidity;
            } catch (g) {
              console.error("Failed to parse adjustments data:", g);
            }
          else f && f.type === "get_sensor_data" ? r("update_remote_sensor_data", G.value) : f && f.type === "sensor_debug_mode" && (o.value = JSON.parse(f.content));
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
        G.value = f;
      } catch (l) {
        console.error("Error fetching sensor data:", l);
      }
    }, a = J(!1), u = J(""), s = (l, f) => {
      i.value = f, n.value = l;
      const g = X.value[l][f];
      g ? (e.value = g.type, u.value = String(g.value)) : (e.value = "offset", u.value = ""), d.value = !0, a.value = !1;
    }, c = async () => {
      try {
        const l = {
          sensorType: n.value,
          sensorId: i.value,
          adjustmentType: e.value,
          value: parseFloat(u.value) || 0
        };
        X.value[n.value] || (X.value[n.value] = {}), X.value[n.value][i.value] = {
          type: e.value,
          value: parseFloat(u.value) || 0
        }, typeof window.qt < "u" && window.qt.webChannelTransport && r("adjust_sensor", l), d.value = !1, u.value = "", a.value = !1;
      } catch (l) {
        console.error("Error applying adjustment:", l);
      }
    };
    return (l, f) => (ye(), be("div", vn, [
      j("div", hn, [
        f[7] || (f[7] = j("h2", null, "温度传感器【温感1与温感2为温湿度传感器温度数据，温感3与温感4为水下温度数据】", -1)),
        j("div", mn, [
          j("div", gn, [
            (ye(!0), be(Ze, null, lt(G.value.temperature, (g, p) => (ye(), be("div", {
              key: p,
              class: "sensor-card",
              onClick: (v) => o.value ? s("temperature", p) : null
            }, [
              j("div", bn, Ee(p), 1),
              j("div", wn, Ee(g), 1)
            ], 8, yn))), 128))
          ])
        ])
      ]),
      j("div", xn, [
        f[8] || (f[8] = j("h2", null, "湿度传感器", -1)),
        j("div", kn, [
          j("div", _n, [
            (ye(!0), be(Ze, null, lt(G.value.humidity, (g, p) => (ye(), be("div", {
              key: p,
              class: "sensor-card",
              onClick: (v) => o.value ? s("humidity", p) : null
            }, [
              j("div", On, Ee(p), 1),
              j("div", jn, Ee(g), 1)
            ], 8, Sn))), 128))
          ])
        ])
      ]),
      d.value ? (ye(), be("div", En, [
        j("div", Cn, [
          j("h3", null, "调整传感器: " + Ee(i.value), 1),
          j("div", Tn, [
            j("div", An, [
              j("label", null, [
                ct(j("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[0] || (f[0] = (g) => e.value = g),
                  value: "offset"
                }, null, 512), [
                  [Ot, e.value]
                ]),
                f[9] || (f[9] = ft(" 调整偏移值 "))
              ]),
              j("label", null, [
                ct(j("input", {
                  type: "radio",
                  "onUpdate:modelValue": f[1] || (f[1] = (g) => e.value = g),
                  value: "value"
                }, null, 512), [
                  [Ot, e.value]
                ]),
                f[10] || (f[10] = ft(" 直接设置值 "))
              ])
            ]),
            j("div", Ln, [
              ct(j("input", {
                type: "text",
                "onUpdate:modelValue": f[2] || (f[2] = (g) => u.value = g),
                readonly: "",
                onClick: f[3] || (f[3] = (g) => a.value = !0),
                placeholder: e.value === "offset" ? "输入偏移值" : "输入设定值"
              }, null, 8, Nn), [
                [pt, u.value]
              ])
            ])
          ]),
          j("div", Pn, [
            j("button", {
              onClick: f[4] || (f[4] = (g) => d.value = !1)
            }, "取消"),
            j("button", {
              onClick: c,
              class: "primary"
            }, "确定")
          ])
        ]),
        qe(pn, {
          modelValue: u.value,
          "onUpdate:modelValue": f[5] || (f[5] = (g) => u.value = g),
          showKeyboard: a.value,
          "onUpdate:showKeyboard": f[6] || (f[6] = (g) => a.value = g)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])) : rt("", !0)
    ]));
  }
}, $n = /* @__PURE__ */ it(Bn, [["__scopeId", "data-v-c3e3c1ad"]]), Rn = { class: "cart-system" }, In = { class: "mode-group" }, Un = { class: "mode-group-left" }, Dn = ["disabled"], Fn = ["disabled"], Mn = { class: "mode-content" }, Vn = { key: 0 }, Wn = { class: "controls" }, qn = { class: "input-group" }, zn = { class: "input-group" }, Kn = { class: "button-group" }, Qn = ["disabled"], Hn = ["disabled"], Gn = { class: "visualization" }, Jn = { class: "progress-bar" }, Yn = { class: "status" }, Xn = {
  key: 1,
  class: "auto-mode-container"
}, Zn = { class: "auto-mode-title" }, eo = {
  __name: "CartSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(me) {
    const G = J("semi-auto"), X = J("both-side"), i = J(30), d = J(30), e = J(i.value), n = J(d.value), o = J(i.value), r = J(d.value), t = J(!1), a = J(0), u = J("半自动模式"), s = J("喷雾尚未工作"), c = J(!1), l = J(!1), f = J(!1);
    let g = null;
    const p = J(!1), v = J(!1), h = J(0), m = J("未知"), y = J(!1), { sendToPyQt: S } = Qe(), C = mt({
      isPyQtWebEngine: !1
    }), x = ht(() => G.value === "auto" && y.value === !1 ? `当前平均湿度: ${m.value}%` : G.value === "auto" && y.value === !0 ? `当前平均湿度: ${m.value}%, 无法使用自动模式, 请检查异常传感器` : " ");
    dt(() => {
      if (C.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, C.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: B } = Qe();
        Je(B, (P) => {
          if (P && P.type === "update_dolly_settings")
            try {
              const T = JSON.parse(P.content);
              e.value = T.dolly_single_run_time, n.value = T.dolly_run_interval_time, o.value = e.value, r.value = n.value, console.log("dolly Settings updated:", T);
            } catch (T) {
              console.error("Failed to parse dolly settings data:", T);
            }
          else if (P && P.type === "update_dolly_state")
            P.content ? N("喷雾正在运行") : N("喷雾尚未工作");
          else if (P && P.type === "update_water_tank_status")
            try {
              const T = JSON.parse(P.content);
              T.side === "left" ? p.value = T.low_water : T.side === "right" && (v.value = T.low_water), p.value || v.value ? (f.value = !0, G.value === "auto" ? O("semi-auto") : Y()) : f.value = !1, console.log("Water tank status updated:", T);
            } catch (T) {
              console.error("Failed to parse water tank status data:", T);
            }
          else if (P && P.type === "CartSystem_init")
            console.log("Received CartSystem_init message"), w();
          else if (P && P.type === "CartSystem_set") {
            console.log("Received CartSystem_set message:", P.content);
            const T = JSON.parse(P.content);
            if (T.method === "setMode")
              O(T.args.newMode);
            else if (T.method === "startSystem")
              V();
            else if (T.method === "stopSystem")
              Y();
            else if (T.method === "updateDollySettings") {
              const pe = T.args;
              e.value = pe.dolly_single_run_time, n.value = pe.dolly_run_interval_time, o.value = e.value, r.value = n.value, console.log("dolly Settings received:", pe), M();
            } else T.method === "setTankMode" && E(T.args.newMode);
          } else if (P && P.type === "update_sensor_avg_data") {
            console.log("Received sensor avg data:", P.content);
            const T = JSON.parse(P.content);
            T.type === "humidity" && (T.value !== -1 ? (m.value = String(T.value), y.value = !1) : (y.value = !0, m.value = "未知"));
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const w = () => {
      const B = {
        mode: G.value,
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
        phaseStartTime: h.value,
        tankmode: X.value
      };
      console.log("Sending initial cart system state:", B), S("CartSystem_init_response", B);
    }, b = me;
    Je(() => b.message, (B) => {
      B != null && B.content && (G.value === "auto" ? O("semi-auto") : Y());
    });
    const E = (B) => {
      X.value = B, B === "one-side" ? S("controlDolly", { target: "setTankMode", mode: "one-side" }) : S("controlDolly", { target: "setTankMode", mode: "both-side" });
    }, O = (B) => {
      G.value = B, C.isPyQtWebEngine && (B === "auto" ? (Y(), S("controlDolly", { target: "setMode", mode: "auto" })) : (ne(), N("喷雾尚未工作"), S("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, A = () => {
      e.value = Math.max(1, parseInt(e.value) || 1), o.value = e.value, M();
    }, _ = () => {
      n.value = Math.max(0, parseInt(n.value) || 0), r.value = n.value, M();
    };
    function M() {
      if (C.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const B = {
          target: "dolly_settings",
          dolly_single_run_time: o.value,
          dolly_run_interval_time: r.value
        };
        S("controlDolly", B);
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    const V = () => {
      t.value = !0, F();
    }, Y = () => {
      ne(), t.value = !1, cancelAnimationFrame(g), a.value = 0, u.value = "半自动模式";
    };
    function ne() {
      C.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), S("controlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function H() {
      C.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), S("tempControlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function q() {
      C.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), S("controlDolly", {
        target: "setState",
        dolly_state: !0
      })) : console.log("在普通网页环境中执行更新设置");
    }
    const F = () => {
      q(), u.value = "喷雾运行中", a.value = 0;
      const B = Date.now();
      h.value = B, i.value = o.value;
      const P = () => {
        const T = (Date.now() - B) / 1e3, pe = Math.max(0, i.value - T);
        a.value = T / i.value * 100, u.value = `喷雾运行中: 剩余 ${pe.toFixed(1)} 秒`, T < i.value && t.value ? g = requestAnimationFrame(P) : t.value && (a.value = 100, r.value > 0 && H(), L());
      };
      g = requestAnimationFrame(P);
    }, L = () => {
      u.value = "等待下次运行";
      const B = Date.now();
      h.value = B, d.value = r.value;
      const P = () => {
        const T = (Date.now() - B) / 1e3, pe = Math.max(0, d.value - T);
        u.value = `等待下次运行: ${pe.toFixed(1)}秒`, pe > 0 && t.value ? g = requestAnimationFrame(P) : t.value && F();
      };
      g = requestAnimationFrame(P);
    }, N = (B) => {
      s.value = B;
    };
    return _t(() => {
      cancelAnimationFrame(g);
    }), (B, P) => (ye(), be(Ze, null, [
      P[12] || (P[12] = j("h2", null, " 喷雾系统【数字开关output1控制】 ", -1)),
      P[13] || (P[13] = j("div", { class: "label-box" }, [
        j("label", null, "自动模式下，当平均湿度低于设置的湿度下限时，喷雾开启；当平均湿度高于设置的湿度上限时，喷雾关闭"),
        j("br")
      ], -1)),
      j("div", Rn, [
        j("div", In, [
          j("div", Un, [
            j("button", {
              class: ut(["mode-button", { active: G.value === "semi-auto" && !f.value }]),
              disabled: f.value,
              onClick: P[0] || (P[0] = (T) => G.value === "auto" ? O("semi-auto") : () => {
              })
            }, "半自动模式", 10, Dn),
            j("button", {
              class: ut(["mode-button", { active: G.value === "auto" && !f.value }]),
              disabled: f.value,
              onClick: P[1] || (P[1] = (T) => G.value === "semi-auto" ? O("auto") : () => {
              })
            }, "自动模式", 10, Fn)
          ])
        ]),
        j("div", Mn, [
          G.value === "semi-auto" ? (ye(), be("div", Vn, [
            j("div", Wn, [
              j("div", qn, [
                P[8] || (P[8] = j("label", null, "喷雾运行时间 (秒):", -1)),
                j("div", {
                  class: "input-wrapper",
                  onClick: P[2] || (P[2] = (T) => c.value = !0)
                }, Ee(e.value), 1)
              ]),
              j("div", zn, [
                P[9] || (P[9] = j("label", null, "喷雾暂停时间 (秒):", -1)),
                j("div", {
                  class: "input-wrapper",
                  onClick: P[3] || (P[3] = (T) => l.value = !0)
                }, Ee(n.value), 1)
              ]),
              j("div", Kn, [
                j("button", {
                  onClick: V,
                  disabled: t.value || f.value
                }, "开始", 8, Qn),
                j("button", {
                  onClick: Y,
                  disabled: !t.value || f.value
                }, "停止", 8, Hn)
              ])
            ]),
            j("div", Gn, [
              j("div", Jn, [
                j("div", {
                  class: "progress",
                  style: kt({ width: a.value + "%" })
                }, null, 4),
                j("div", {
                  class: "cart",
                  style: kt({ left: a.value + "%" })
                }, P[10] || (P[10] = [
                  j("span", { class: "cart-icon" }, "🚜", -1)
                ]), 4)
              ])
            ]),
            j("div", Yn, Ee(u.value), 1)
          ])) : (ye(), be("div", Xn, [
            j("div", Zn, "自动模式受传感器湿度控制, " + Ee(x.value), 1),
            j("div", {
              class: ut(["auto-mode-status", { working: s.value === "喷雾正在运行" }])
            }, Ee(s.value), 3),
            P[11] || (P[11] = j("div", { class: "auto-mode-placeholder" }, null, -1))
          ]))
        ]),
        qe(gt, {
          modelValue: e.value,
          "onUpdate:modelValue": [
            P[4] || (P[4] = (T) => e.value = T),
            A
          ],
          showKeyboard: c.value,
          "onUpdate:showKeyboard": P[5] || (P[5] = (T) => c.value = T)
        }, null, 8, ["modelValue", "showKeyboard"]),
        qe(gt, {
          modelValue: n.value,
          "onUpdate:modelValue": [
            P[6] || (P[6] = (T) => n.value = T),
            _
          ],
          showKeyboard: l.value,
          "onUpdate:showKeyboard": P[7] || (P[7] = (T) => l.value = T)
        }, null, 8, ["modelValue", "showKeyboard"])
      ])
    ], 64));
  }
}, to = /* @__PURE__ */ it(eo, [["__scopeId", "data-v-b68f9413"]]), no = { class: "mode-controls" }, oo = { class: "btn-group" }, ro = { class: "steam_engine" }, io = ["disabled"], ao = { class: "text_status" }, so = {
  __name: "IntegratedControlSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(me) {
    const G = J(!1), X = J(!1), i = J(!1), { sendToPyQt: d } = Qe(), e = mt({
      isPyQtWebEngine: !1
    }), n = me;
    Je(() => n.message, (s) => {
      s != null && s.content && (X.value ? t("manual") : t("auto"));
    }), dt(() => {
      if (e.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, e.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: s } = Qe();
        Je(s, (c) => {
          if (c && c.type === "update_heat_engine_status")
            G.value = c.content;
          else if (c && c.type === "update_sensor_avg_data") {
            console.log("Received sensor avg data:", c.content);
            const l = JSON.parse(c.content);
            l.type === "temp" && (l.value !== -1 ? (o.value = String(l.value), i.value = !1) : (i.value = !0, o.value = "未知"));
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const o = J("未知");
    J("未知");
    const r = ht(() => {
      if (!X.value) return "手动模式";
      if (i.value === !1) return `自动模式受水下传感器温度控制, 水下平均温度: ${o.value}°C`;
      if (i.value === !0) return `自动模式受水下传感器温度控制, 水下平均温度: ${o.value}°C, 无法使用自动模式, 请检查异常传感器`;
    });
    async function t(s) {
      const c = X.value;
      X.value = s === "auto", c !== X.value && (e.isPyQtWebEngine && d("controlSprinkler", { target: "setMode", mode: X.value ? "auto" : "manual" }), X.value ? G.value && await a() : G.value && await a());
    }
    async function a() {
      e.isPyQtWebEngine && (d("setEngineState", { engine: "heatEngine", state: !G.value }), G.value = !G.value);
    }
    async function u() {
      d("setEngineState", { engine: "heatEngine", state: !G.value }), G.value = !G.value;
    }
    return (s, c) => (ye(), be(Ze, null, [
      c[3] || (c[3] = j("h2", null, "水箱加热系统【数字开关output2控制】", -1)),
      c[4] || (c[4] = j("div", { class: "label-box" }, [
        j("label", null, "自动模式下，当平均温度低于设置的温度下限时，加热开启；当平均温度高于设置的温度上限时，加热关闭"),
        j("br")
      ], -1)),
      j("div", no, [
        j("div", oo, [
          j("button", {
            onClick: c[0] || (c[0] = (l) => t("manual")),
            class: ut([{ active: !X.value }, "mode-btn"])
          }, "手动模式", 2),
          j("button", {
            onClick: c[1] || (c[1] = (l) => t("auto")),
            class: ut([{ active: X.value }, "mode-btn"])
          }, "自动模式", 2)
        ])
      ]),
      j("div", ro, [
        j("div", {
          class: ut(["status", { on: G.value }])
        }, [
          c[2] || (c[2] = j("div", { class: "status-indicator" }, null, -1)),
          ft(" " + Ee(G.value ? "开" : "关"), 1)
        ], 2),
        j("button", {
          onClick: u,
          disabled: X.value,
          class: "control-btn"
        }, Ee(G.value ? "关闭" : "开启"), 9, io)
      ]),
      j("div", ao, Ee(r.value), 1)
    ], 64));
  }
}, uo = /* @__PURE__ */ it(so, [["__scopeId", "data-v-de86dcd8"]]), co = { class: "data-actions" }, lo = {
  key: 0,
  class: "modal-overlay"
}, fo = { class: "modal-content settings-modal" }, po = { class: "setting-group" }, vo = { class: "setting-item" }, ho = { class: "toggle-switch" }, mo = {
  key: 1,
  class: "modal-overlay"
}, go = {
  key: 2,
  class: "modal-overlay"
}, yo = { class: "modal-content update-modal" }, bo = {
  key: 3,
  class: "modal-overlay"
}, wo = { class: "modal-content" }, xo = {
  __name: "DataExport",
  setup(me) {
    const { sendToPyQt: G } = Qe(), X = mt({
      isPyQtWebEngine: !1
    }), i = J(!1), d = J(!1), e = J(""), n = J(!1), o = J(!1), r = J(!1), t = J(!1), a = J(""), u = J(!1), s = () => {
      t.value = !0, a.value = "", document.body.style.overflow = "hidden";
    }, c = () => {
      if (!a.value) {
        S("请输入更新版号！");
        return;
      }
      X.isPyQtWebEngine && G("updateVersion", { version: a.value }), t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, l = () => {
      t.value = !1, a.value = "", document.body.style.overflow = "auto";
    }, f = () => {
      r.value = o.value, n.value = !0, document.body.style.overflow = "hidden";
    }, g = () => {
      r.value = o.value, n.value = !1, document.body.style.overflow = "auto";
    }, p = () => {
      o.value = r.value, n.value = !1, document.body.style.overflow = "auto", X.isPyQtWebEngine && G("saveDebugSettings", { debug_mode: o.value });
    };
    dt(() => {
      if (X.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, X.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: x } = Qe();
        Je(x, (w) => {
          if (w && w.type === "update_debug_mode")
            try {
              const b = JSON.parse(w.content);
              o.value = b.debug_mode, r.value = b.debug_mode;
            } catch (b) {
              console.error("Failed to parse debug settings:", b);
            }
          else if (w && w.type === "DataExport_init") {
            const b = {
              debugMode: o.value
            };
            console.log("Sending initial DataExport state:", b), G("DataExport_init_response", b);
          } else if (w && w.type === "clearData")
            G("exportData", !1), G("clearData_response", "");
          else if (w && w.type === "updateVersion_response")
            try {
              const b = JSON.parse(w.content);
              b.status === "success" ? S(`${b.message}，系统即将重启...`) : S(b.message);
            } catch (b) {
              S("解析更新响应失败：" + b);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const v = () => {
      X.isPyQtWebEngine && (console.log("导出数据"), G("exportData", !0));
    }, h = () => {
      i.value = !0, document.body.style.overflow = "hidden";
    }, m = () => {
      i.value = !1, document.body.style.overflow = "auto";
    }, y = () => {
      console.log("清空数据"), i.value = !1, S("所有数据已清空！"), document.body.style.overflow = "auto", X.isPyQtWebEngine && G("exportData", !1);
    }, S = (x) => {
      e.value = x, d.value = !0;
    }, C = () => {
      d.value = !1;
    };
    return (x, w) => (ye(), be("div", co, [
      j("div", { class: "action-buttons" }, [
        j("div", { class: "button-group" }, [
          j("button", {
            onClick: v,
            class: "export-btn"
          }, "导出数据")
        ]),
        j("div", { class: "button-group" }, [
          j("button", {
            onClick: h,
            class: "clear-btn"
          }, "清空数据")
        ]),
        j("div", { class: "button-group" }, [
          j("button", {
            onClick: f,
            class: "settings-btn"
          }, "开发者模式")
        ]),
        j("div", { class: "button-group" }, [
          j("button", {
            onClick: s,
            class: "update-btn"
          }, "更新")
        ])
      ]),
      n.value ? (ye(), be("div", lo, [
        j("div", fo, [
          j("div", po, [
            w[7] || (w[7] = j("h2", null, "传感器调试模式【开发者测试用】", -1)),
            j("div", vo, [
              w[6] || (w[6] = j("span", { class: "setting-label" }, "调试模式：", -1)),
              j("div", ho, [
                ct(j("input", {
                  type: "checkbox",
                  id: "debug-toggle",
                  "onUpdate:modelValue": w[0] || (w[0] = (b) => r.value = b)
                }, null, 512), [
                  [Bt, r.value]
                ]),
                w[5] || (w[5] = j("label", { for: "debug-toggle" }, null, -1))
              ])
            ]),
            j("div", { class: "modal-buttons" }, [
              j("button", {
                onClick: p,
                class: "confirm-btn"
              }, "保存"),
              j("button", {
                onClick: g,
                class: "cancel-btn"
              }, "取消")
            ])
          ])
        ])
      ])) : rt("", !0),
      i.value ? (ye(), be("div", mo, [
        j("div", { class: "modal-content" }, [
          w[8] || (w[8] = j("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          j("div", { class: "modal-buttons" }, [
            j("button", {
              onClick: y,
              class: "confirm-btn"
            }, "确定"),
            j("button", {
              onClick: m,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : rt("", !0),
      t.value ? (ye(), be("div", go, [
        j("div", yo, [
          w[9] || (w[9] = j("h2", null, "更新版本", -1)),
          j("div", {
            class: "update-input",
            onClick: w[2] || (w[2] = (b) => u.value = !0)
          }, [
            ct(j("input", {
              type: "text",
              "onUpdate:modelValue": w[1] || (w[1] = (b) => a.value = b),
              placeholder: "请输入更新版号",
              readonly: ""
            }, null, 512), [
              [pt, a.value]
            ])
          ]),
          j("div", { class: "modal-buttons" }, [
            j("button", {
              onClick: c,
              class: "confirm-btn"
            }, "更新"),
            j("button", {
              onClick: l,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : rt("", !0),
      qe(gt, {
        modelValue: a.value,
        "onUpdate:modelValue": w[3] || (w[3] = (b) => a.value = b),
        "show-keyboard": u.value,
        "onUpdate:showKeyboard": w[4] || (w[4] = (b) => u.value = b)
      }, null, 8, ["modelValue", "show-keyboard"]),
      d.value ? (ye(), be("div", bo, [
        j("div", wo, [
          j("h2", null, Ee(e.value), 1),
          j("div", { class: "modal-buttons" }, [
            j("button", {
              onClick: C,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : rt("", !0)
    ]));
  }
}, ko = /* @__PURE__ */ it(xo, [["__scopeId", "data-v-d87ac98e"]]);
var _o = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function So(me) {
  return me && me.__esModule && Object.prototype.hasOwnProperty.call(me, "default") ? me.default : me;
}
var At = { exports: {} };
(function(me, G) {
  (function(X, i) {
    me.exports = i(Pt);
  })(typeof self < "u" ? self : _o, function(X) {
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
      var n = e("83ab"), o = e("d1e7"), r = e("5c6c"), t = e("fc6a"), a = e("c04e"), u = e("5135"), s = e("0cfb"), c = Object.getOwnPropertyDescriptor;
      d.f = n ? c : function(l, f) {
        if (l = t(l), f = a(f, !0), s) try {
          return c(l, f);
        } catch {
        }
        if (u(l, f)) return r(!o.f.call(l, f), l[f]);
      };
    }, "0a06": function(i, d, e) {
      var n = e("c532"), o = e("30b5"), r = e("f6b4"), t = e("5270"), a = e("4a7b");
      function u(s) {
        this.defaults = s, this.interceptors = { request: new r(), response: new r() };
      }
      u.prototype.request = function(s) {
        typeof s == "string" ? (s = arguments[1] || {}, s.url = arguments[0]) : s = s || {}, s = a(this.defaults, s), s.method ? s.method = s.method.toLowerCase() : this.defaults.method ? s.method = this.defaults.method.toLowerCase() : s.method = "get";
        var c = [t, void 0], l = Promise.resolve(s);
        for (this.interceptors.request.forEach(function(f) {
          c.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          c.push(f.fulfilled, f.rejected);
        }); c.length; ) l = l.then(c.shift(), c.shift());
        return l;
      }, u.prototype.getUri = function(s) {
        return s = a(this.defaults, s), o(s.url, s.params, s.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(s) {
        u.prototype[s] = function(c, l) {
          return this.request(a(l || {}, { method: s, url: c, data: (l || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(s) {
        u.prototype[s] = function(c, l, f) {
          return this.request(a(f || {}, { method: s, url: c, data: l }));
        };
      }), i.exports = u;
    }, "0cb2": function(i, d, e) {
      var n = e("7b0b"), o = Math.floor, r = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, a = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(u, s, c, l, f, g) {
        var p = c + u.length, v = l.length, h = a;
        return f !== void 0 && (f = n(f), h = t), r.call(g, h, function(m, y) {
          var S;
          switch (y.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return u;
            case "`":
              return s.slice(0, c);
            case "'":
              return s.slice(p);
            case "<":
              S = f[y.slice(1, -1)];
              break;
            default:
              var C = +y;
              if (C === 0) return m;
              if (C > v) {
                var x = o(C / 10);
                return x === 0 ? m : x <= v ? l[x - 1] === void 0 ? y.charAt(1) : l[x - 1] + y.charAt(1) : m;
              }
              S = l[C - 1];
          }
          return S === void 0 ? "" : S;
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
      var n = e("d784"), o = e("44e7"), r = e("825a"), t = e("1d80"), a = e("4840"), u = e("8aa5"), s = e("50c4"), c = e("14c3"), l = e("9263"), f = e("d039"), g = [].push, p = Math.min, v = 4294967295, h = !f(function() {
        return !RegExp(v, "y");
      });
      n("split", 2, function(m, y, S) {
        var C;
        return C = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(x, w) {
          var b = String(t(this)), E = w === void 0 ? v : w >>> 0;
          if (E === 0) return [];
          if (x === void 0) return [b];
          if (!o(x)) return y.call(b, x, E);
          for (var O, A, _, M = [], V = (x.ignoreCase ? "i" : "") + (x.multiline ? "m" : "") + (x.unicode ? "u" : "") + (x.sticky ? "y" : ""), Y = 0, ne = new RegExp(x.source, V + "g"); (O = l.call(ne, b)) && (A = ne.lastIndex, !(A > Y && (M.push(b.slice(Y, O.index)), O.length > 1 && O.index < b.length && g.apply(M, O.slice(1)), _ = O[0].length, Y = A, M.length >= E))); )
            ne.lastIndex === O.index && ne.lastIndex++;
          return Y === b.length ? !_ && ne.test("") || M.push("") : M.push(b.slice(Y)), M.length > E ? M.slice(0, E) : M;
        } : "0".split(void 0, 0).length ? function(x, w) {
          return x === void 0 && w === 0 ? [] : y.call(this, x, w);
        } : y, [function(x, w) {
          var b = t(this), E = x == null ? void 0 : x[m];
          return E !== void 0 ? E.call(x, b, w) : C.call(String(b), x, w);
        }, function(x, w) {
          var b = S(C, x, this, w, C !== y);
          if (b.done) return b.value;
          var E = r(x), O = String(this), A = a(E, RegExp), _ = E.unicode, M = (E.ignoreCase ? "i" : "") + (E.multiline ? "m" : "") + (E.unicode ? "u" : "") + (h ? "y" : "g"), V = new A(h ? E : "^(?:" + E.source + ")", M), Y = w === void 0 ? v : w >>> 0;
          if (Y === 0) return [];
          if (O.length === 0) return c(V, O) === null ? [O] : [];
          for (var ne = 0, H = 0, q = []; H < O.length; ) {
            V.lastIndex = h ? H : 0;
            var F, L = c(V, h ? O : O.slice(H));
            if (L === null || (F = p(s(V.lastIndex + (h ? 0 : H)), O.length)) === ne) H = u(O, H, _);
            else {
              if (q.push(O.slice(ne, H)), q.length === Y) return q;
              for (var N = 1; N <= L.length - 1; N++) if (q.push(L[N]), q.length === Y) return q;
              H = ne = F;
            }
          }
          return q.push(O.slice(ne)), q;
        }];
      }, !h);
    }, "13d5": function(i, d, e) {
      var n = e("23e7"), o = e("d58f").left, r = e("a640"), t = e("2d00"), a = e("605d"), u = r("reduce"), s = !a && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !u || s }, { reduce: function(c) {
        return o(this, c, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
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
        var c = !1;
        try {
          var l = {};
          l[o] = function() {
            return { next: function() {
              return { done: c = !0 };
            } };
          }, u(l);
        } catch {
        }
        return c;
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
          function o(I, D) {
            return D = { exports: {} }, I(D, D.exports), D.exports;
          }
          var r = o(function(I, D) {
            (function(Z, W) {
              I.exports = W();
            })(0, function() {
              function Z(se) {
                var ke = se && typeof se == "object";
                return ke && Object.prototype.toString.call(se) !== "[object RegExp]" && Object.prototype.toString.call(se) !== "[object Date]";
              }
              function W(se) {
                return Array.isArray(se) ? [] : {};
              }
              function ee(se, ke) {
                var Se = ke && ke.clone === !0;
                return Se && Z(se) ? ge(W(se), se, ke) : se;
              }
              function re(se, ke, Se) {
                var $e = se.slice();
                return ke.forEach(function(je, Ve) {
                  typeof $e[Ve] > "u" ? $e[Ve] = ee(je, Se) : Z(je) ? $e[Ve] = ge(se[Ve], je, Se) : se.indexOf(je) === -1 && $e.push(ee(je, Se));
                }), $e;
              }
              function we(se, ke, Se) {
                var $e = {};
                return Z(se) && Object.keys(se).forEach(function(je) {
                  $e[je] = ee(se[je], Se);
                }), Object.keys(ke).forEach(function(je) {
                  Z(ke[je]) && se[je] ? $e[je] = ge(se[je], ke[je], Se) : $e[je] = ee(ke[je], Se);
                }), $e;
              }
              function ge(se, ke, Se) {
                var $e = Array.isArray(ke), je = Se || { arrayMerge: re }, Ve = je.arrayMerge || re;
                return $e ? Array.isArray(se) ? Ve(se, ke, Se) : ee(ke, Se) : we(se, ke, Se);
              }
              return ge.all = function(se, ke) {
                if (!Array.isArray(se) || se.length < 2) throw new Error("first argument should be an array with at least two elements");
                return se.reduce(function(Se, $e) {
                  return ge(Se, $e, ke);
                });
              }, ge;
            });
          });
          function t(I) {
            return I = I || /* @__PURE__ */ Object.create(null), { on: function(D, Z) {
              (I[D] || (I[D] = [])).push(Z);
            }, off: function(D, Z) {
              I[D] && I[D].splice(I[D].indexOf(Z) >>> 0, 1);
            }, emit: function(D, Z) {
              (I[D] || []).map(function(W) {
                W(Z);
              }), (I["*"] || []).map(function(W) {
                W(D, Z);
              });
            } };
          }
          var a = o(function(I, D) {
            var Z = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            D.default = Z, I.exports = D.default;
          }), u = function(I) {
            return Object.keys(I).map(function(D) {
              var Z = I[D].toString().replace(/"/g, "&quot;");
              return D + '="' + Z + '"';
            }).join(" ");
          }, s = a.svg, c = a.xlink, l = {};
          l[s.name] = s.uri, l[c.name] = c.uri;
          var f, g = function(I, D) {
            I === void 0 && (I = "");
            var Z = r(l, D || {}), W = u(Z);
            return "<svg " + W + ">" + I + "</svg>";
          }, p = a.svg, v = a.xlink, h = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[p.name] = p.uri, f[v.name] = v.uri, f) }, m = function(I) {
            this.config = r(h, I || {}), this.symbols = [];
          };
          m.prototype.add = function(I) {
            var D = this, Z = D.symbols, W = this.find(I.id);
            return W ? (Z[Z.indexOf(W)] = I, !1) : (Z.push(I), !0);
          }, m.prototype.remove = function(I) {
            var D = this, Z = D.symbols, W = this.find(I);
            return !!W && (Z.splice(Z.indexOf(W), 1), W.destroy(), !0);
          }, m.prototype.find = function(I) {
            return this.symbols.filter(function(D) {
              return D.id === I;
            })[0] || null;
          }, m.prototype.has = function(I) {
            return this.find(I) !== null;
          }, m.prototype.stringify = function() {
            var I = this.config, D = I.attrs, Z = this.symbols.map(function(W) {
              return W.stringify();
            }).join("");
            return g(Z, D);
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            this.symbols.forEach(function(I) {
              return I.destroy();
            });
          };
          var y = function(I) {
            var D = I.id, Z = I.viewBox, W = I.content;
            this.id = D, this.viewBox = Z, this.content = W;
          };
          y.prototype.stringify = function() {
            return this.content;
          }, y.prototype.toString = function() {
            return this.stringify();
          }, y.prototype.destroy = function() {
            var I = this;
            ["id", "viewBox", "content"].forEach(function(D) {
              return delete I[D];
            });
          };
          var S = function(I) {
            var D = !!document.importNode, Z = new DOMParser().parseFromString(I, "image/svg+xml").documentElement;
            return D ? document.importNode(Z, !0) : Z;
          }, C = function(I) {
            function D() {
              I.apply(this, arguments);
            }
            I && (D.__proto__ = I), D.prototype = Object.create(I && I.prototype), D.prototype.constructor = D;
            var Z = { isMounted: {} };
            return Z.isMounted.get = function() {
              return !!this.node;
            }, D.createFromExistingNode = function(W) {
              return new D({ id: W.getAttribute("id"), viewBox: W.getAttribute("viewBox"), content: W.outerHTML });
            }, D.prototype.destroy = function() {
              this.isMounted && this.unmount(), I.prototype.destroy.call(this);
            }, D.prototype.mount = function(W) {
              if (this.isMounted) return this.node;
              var ee = typeof W == "string" ? document.querySelector(W) : W, re = this.render();
              return this.node = re, ee.appendChild(re), re;
            }, D.prototype.render = function() {
              var W = this.stringify();
              return S(g(W)).childNodes[0];
            }, D.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(D.prototype, Z), D;
          }(y), x = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, w = function(I) {
            return Array.prototype.slice.call(I, 0);
          }, b = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, E = function(I, D) {
            var Z = document.createEvent("CustomEvent");
            Z.initCustomEvent(I, !1, !1, D), window.dispatchEvent(Z);
          }, O = function(I) {
            var D = [];
            return w(I.querySelectorAll("style")).forEach(function(Z) {
              Z.textContent += "", D.push(Z);
            }), D;
          }, A = function(I) {
            return (I || window.location.href).split("#")[0];
          }, _ = function(I) {
            angular.module("ng").run(["$rootScope", function(D) {
              D.$on("$locationChangeSuccess", function(Z, W, ee) {
                E(I, { oldUrl: ee, newUrl: W });
              });
            }]);
          }, M = "linearGradient, radialGradient, pattern, mask, clipPath", V = function(I, D) {
            return D === void 0 && (D = M), w(I.querySelectorAll("symbol")).forEach(function(Z) {
              w(Z.querySelectorAll(D)).forEach(function(W) {
                Z.parentNode.insertBefore(W, Z);
              });
            }), I;
          };
          function Y(I, D) {
            var Z = w(I).reduce(function(W, ee) {
              if (!ee.attributes) return W;
              var re = w(ee.attributes), we = D ? re.filter(D) : re;
              return W.concat(we);
            }, []);
            return Z;
          }
          var ne = a.xlink.uri, H = "xlink:href", q = /[{}|\\\^\[\]`"<>]/g;
          function F(I) {
            return I.replace(q, function(D) {
              return "%" + D[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L(I) {
            return I.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function N(I, D, Z) {
            return w(I).forEach(function(W) {
              var ee = W.getAttribute(H);
              if (ee && ee.indexOf(D) === 0) {
                var re = ee.replace(D, Z);
                W.setAttributeNS(ne, H, re);
              }
            }), I;
          }
          var B, P = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], T = P.map(function(I) {
            return "[" + I + "]";
          }).join(","), pe = function(I, D, Z, W) {
            var ee = F(Z), re = F(W), we = I.querySelectorAll(T), ge = Y(we, function(se) {
              var ke = se.localName, Se = se.value;
              return P.indexOf(ke) !== -1 && Se.indexOf("url(" + ee) !== -1;
            });
            ge.forEach(function(se) {
              return se.value = se.value.replace(new RegExp(L(ee), "g"), re);
            }), N(D, ee, re);
          }, ve = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Pe = function(I) {
            function D(W) {
              var ee = this;
              W === void 0 && (W = {}), I.call(this, r(x, W));
              var re = t();
              this._emitter = re, this.node = null;
              var we = this, ge = we.config;
              if (ge.autoConfigure && this._autoConfigure(W), ge.syncUrlsWithBaseTag) {
                var se = document.getElementsByTagName("base")[0].getAttribute("href");
                re.on(ve.MOUNT, function() {
                  return ee.updateUrls("#", se);
                });
              }
              var ke = this._handleLocationChange.bind(this);
              this._handleLocationChange = ke, ge.listenLocationChangeEvent && window.addEventListener(ge.locationChangeEvent, ke), ge.locationChangeAngularEmitter && _(ge.locationChangeEvent), re.on(ve.MOUNT, function(Se) {
                ge.moveGradientsOutsideSymbol && V(Se);
              }), re.on(ve.SYMBOL_MOUNT, function(Se) {
                ge.moveGradientsOutsideSymbol && V(Se.parentNode), (b.isIE() || b.isEdge()) && O(Se);
              });
            }
            I && (D.__proto__ = I), D.prototype = Object.create(I && I.prototype), D.prototype.constructor = D;
            var Z = { isMounted: {} };
            return Z.isMounted.get = function() {
              return !!this.node;
            }, D.prototype._autoConfigure = function(W) {
              var ee = this, re = ee.config;
              typeof W.syncUrlsWithBaseTag > "u" && (re.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof W.locationChangeAngularEmitter > "u" && (re.locationChangeAngularEmitter = typeof window.angular < "u"), typeof W.moveGradientsOutsideSymbol > "u" && (re.moveGradientsOutsideSymbol = b.isFirefox());
            }, D.prototype._handleLocationChange = function(W) {
              var ee = W.detail, re = ee.oldUrl, we = ee.newUrl;
              this.updateUrls(re, we);
            }, D.prototype.add = function(W) {
              var ee = this, re = I.prototype.add.call(this, W);
              return this.isMounted && re && (W.mount(ee.node), this._emitter.emit(ve.SYMBOL_MOUNT, W.node)), re;
            }, D.prototype.attach = function(W) {
              var ee = this, re = this;
              if (re.isMounted) return re.node;
              var we = typeof W == "string" ? document.querySelector(W) : W;
              return re.node = we, this.symbols.forEach(function(ge) {
                ge.mount(re.node), ee._emitter.emit(ve.SYMBOL_MOUNT, ge.node);
              }), w(we.querySelectorAll("symbol")).forEach(function(ge) {
                var se = C.createFromExistingNode(ge);
                se.node = ge, re.add(se);
              }), this._emitter.emit(ve.MOUNT, we), we;
            }, D.prototype.destroy = function() {
              var W = this, ee = W.config, re = W.symbols, we = W._emitter;
              re.forEach(function(ge) {
                return ge.destroy();
              }), we.off("*"), window.removeEventListener(ee.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, D.prototype.mount = function(W, ee) {
              W === void 0 && (W = this.config.mountTo), ee === void 0 && (ee = !1);
              var re = this;
              if (re.isMounted) return re.node;
              var we = typeof W == "string" ? document.querySelector(W) : W, ge = re.render();
              return this.node = ge, ee && we.childNodes[0] ? we.insertBefore(ge, we.childNodes[0]) : we.appendChild(ge), this._emitter.emit(ve.MOUNT, ge), ge;
            }, D.prototype.render = function() {
              return S(this.stringify());
            }, D.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, D.prototype.updateUrls = function(W, ee) {
              if (!this.isMounted) return !1;
              var re = document.querySelectorAll(this.config.usagesToUpdate);
              return pe(this.node, re, A(W) + "#", A(ee) + "#"), !0;
            }, Object.defineProperties(D.prototype, Z), D;
          }(m), Be = o(function(I) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(D, Z) {
              I.exports = Z();
            })(0, function() {
              var D, Z = [], W = document, ee = W.documentElement.doScroll, re = "DOMContentLoaded", we = (ee ? /^loaded|^c/ : /^loaded|^i|^c/).test(W.readyState);
              return we || W.addEventListener(re, D = function() {
                for (W.removeEventListener(re, D), we = 1; D = Z.shift(); ) D();
              }), function(ge) {
                we ? setTimeout(ge, 0) : Z.push(ge);
              };
            });
          }), Ie = "__SVG_SPRITE_NODE__", Ae = "__SVG_SPRITE__", Le = !!window[Ae];
          Le ? B = window[Ae] : (B = new Pe({ attrs: { id: Ie, "aria-hidden": "true" } }), window[Ae] = B);
          var He = function() {
            var I = document.getElementById(Ie);
            I ? B.attach(I) : B.mount(document.body, !0);
          };
          document.body ? He() : Be(He);
          var at = B;
          return at;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, d, e) {
      var n = e("825a"), o = e("e95a"), r = e("50c4"), t = e("0366"), a = e("35a1"), u = e("2a62"), s = function(c, l) {
        this.stopped = c, this.result = l;
      };
      i.exports = function(c, l, f) {
        var g, p, v, h, m, y, S, C = f && f.that, x = !(!f || !f.AS_ENTRIES), w = !(!f || !f.IS_ITERATOR), b = !(!f || !f.INTERRUPTED), E = t(l, C, 1 + x + b), O = function(_) {
          return g && u(g), new s(!0, _);
        }, A = function(_) {
          return x ? (n(_), b ? E(_[0], _[1], O) : E(_[0], _[1])) : b ? E(_, O) : E(_);
        };
        if (w) g = c;
        else {
          if (p = a(c), typeof p != "function") throw TypeError("Target is not iterable");
          if (o(p)) {
            for (v = 0, h = r(c.length); h > v; v++) if (m = A(c[v]), m && m instanceof s) return m;
            return new s(!1);
          }
          g = p.call(c);
        }
        for (y = g.next; !(S = y.call(g)).done; ) {
          try {
            m = A(S.value);
          } catch (_) {
            throw u(g), _;
          }
          if (typeof m == "object" && m && m instanceof s) return m;
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
      i.exports = function(c, l) {
        var f, g, p, v, h, m, y = c.target, S = c.global, C = c.stat;
        if (g = S ? n : C ? n[y] || a(y, {}) : (n[y] || {}).prototype, g) for (p in l) {
          if (h = l[p], c.noTargetGet ? (m = o(g, p), v = m && m.value) : v = g[p], f = s(S ? p : y + (C ? "." : "#") + p, c.forced), !f && v !== void 0) {
            if (typeof h == typeof v) continue;
            u(h, v);
          }
          (c.sham || v && v.sham) && r(h, "sham", !0), t(g, p, h, c);
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
        function a(c, l) {
          !o.isUndefined(c) && o.isUndefined(c["Content-Type"]) && (c["Content-Type"] = l);
        }
        function u() {
          var c;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (c = e("b50d")), c;
        }
        var s = { adapter: u(), transformRequest: [function(c, l) {
          return r(l, "Accept"), r(l, "Content-Type"), o.isFormData(c) || o.isArrayBuffer(c) || o.isBuffer(c) || o.isStream(c) || o.isFile(c) || o.isBlob(c) ? c : o.isArrayBufferView(c) ? c.buffer : o.isURLSearchParams(c) ? (a(l, "application/x-www-form-urlencoded;charset=utf-8"), c.toString()) : o.isObject(c) ? (a(l, "application/json;charset=utf-8"), JSON.stringify(c)) : c;
        }], transformResponse: [function(c) {
          if (typeof c == "string") try {
            c = JSON.parse(c);
          } catch {
          }
          return c;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(c) {
          return c >= 200 && c < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        o.forEach(["delete", "get", "head"], function(c) {
          s.headers[c] = {};
        }), o.forEach(["post", "put", "patch"], function(c) {
          s.headers[c] = o.merge(t);
        }), i.exports = s;
      }).call(this, e("4362"));
    }, 2532: function(i, d, e) {
      var n = e("23e7"), o = e("5a34"), r = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(a) {
        return !!~String(r(this)).indexOf(o(a), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, d, e) {
      var n = e("6eeb"), o = e("825a"), r = e("d039"), t = e("ad6d"), a = "toString", u = RegExp.prototype, s = u[a], c = r(function() {
        return s.call({ source: "a", flags: "b" }) != "/a/b";
      }), l = s.name != a;
      (c || l) && n(RegExp.prototype, a, function() {
        var f = o(this), g = String(f.source), p = f.flags, v = String(p === void 0 && f instanceof RegExp && !("flags" in u) ? t.call(f) : p);
        return "/" + g + "/" + v;
      }, { unsafe: !0 });
    }, 2626: function(i, d, e) {
      var n = e("d066"), o = e("9bf2"), r = e("b622"), t = e("83ab"), a = r("species");
      i.exports = function(u) {
        var s = n(u), c = o.f;
        t && s && !s[a] && c(s, a, { configurable: !0, get: function() {
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
      var n, o, r, t = e("da84"), a = e("d039"), u = e("0366"), s = e("1be4"), c = e("cc12"), l = e("1cdc"), f = e("605d"), g = t.location, p = t.setImmediate, v = t.clearImmediate, h = t.process, m = t.MessageChannel, y = t.Dispatch, S = 0, C = {}, x = "onreadystatechange", w = function(A) {
        if (C.hasOwnProperty(A)) {
          var _ = C[A];
          delete C[A], _();
        }
      }, b = function(A) {
        return function() {
          w(A);
        };
      }, E = function(A) {
        w(A.data);
      }, O = function(A) {
        t.postMessage(A + "", g.protocol + "//" + g.host);
      };
      p && v || (p = function(A) {
        for (var _ = [], M = 1; arguments.length > M; ) _.push(arguments[M++]);
        return C[++S] = function() {
          (typeof A == "function" ? A : Function(A)).apply(void 0, _);
        }, n(S), S;
      }, v = function(A) {
        delete C[A];
      }, f ? n = function(A) {
        h.nextTick(b(A));
      } : y && y.now ? n = function(A) {
        y.now(b(A));
      } : m && !l ? (o = new m(), r = o.port2, o.port1.onmessage = E, n = u(r.postMessage, r, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && g && g.protocol !== "file:" && !a(O) ? (n = O, t.addEventListener("message", E, !1)) : n = x in c("script") ? function(A) {
        s.appendChild(c("script"))[x] = function() {
          s.removeChild(this), w(A);
        };
      } : function(A) {
        setTimeout(b(A), 0);
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
          n.forEach(t, function(l, f) {
            l !== null && typeof l < "u" && (n.isArray(l) ? f += "[]" : l = [l], n.forEach(l, function(g) {
              n.isDate(g) ? g = g.toISOString() : n.isObject(g) && (g = JSON.stringify(g)), s.push(o(f) + "=" + o(g));
            }));
          }), u = s.join("&");
        }
        if (u) {
          var c = r.indexOf("#");
          c !== -1 && (r = r.slice(0, c)), r += (r.indexOf("?") === -1 ? "?" : "&") + u;
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
        for (var s, c = t(u), l = c.length, f = 0; l > f; ) o.f(a, s = c[f++], u[s]);
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
        var s, c = u(this), l = c.string, f = c.index;
        return f >= l.length ? { value: void 0, done: !0 } : (s = n(l, f), c.index += s.length, { value: s, done: !1 });
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
      n("match", 1, function(s, c, l) {
        return [function(f) {
          var g = t(this), p = f == null ? void 0 : f[s];
          return p !== void 0 ? p.call(f, g) : new RegExp(f)[s](String(g));
        }, function(f) {
          var g = l(c, f, this);
          if (g.done) return g.value;
          var p = o(f), v = String(this);
          if (!p.global) return u(p, v);
          var h = p.unicode;
          p.lastIndex = 0;
          for (var m, y = [], S = 0; (m = u(p, v)) !== null; ) {
            var C = String(m[0]);
            y[S] = C, C === "" && (p.lastIndex = a(v, r(p.lastIndex), h)), S++;
          }
          return S === 0 ? null : y;
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
        var s, c = n(a).constructor;
        return c === void 0 || (s = n(c)[t]) == null ? u : o(s);
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
        var t = {}, a = ["url", "method", "data"], u = ["headers", "auth", "proxy", "params"], s = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], c = ["validateStatus"];
        function l(v, h) {
          return n.isPlainObject(v) && n.isPlainObject(h) ? n.merge(v, h) : n.isPlainObject(h) ? n.merge({}, h) : n.isArray(h) ? h.slice() : h;
        }
        function f(v) {
          n.isUndefined(r[v]) ? n.isUndefined(o[v]) || (t[v] = l(void 0, o[v])) : t[v] = l(o[v], r[v]);
        }
        n.forEach(a, function(v) {
          n.isUndefined(r[v]) || (t[v] = l(void 0, r[v]));
        }), n.forEach(u, f), n.forEach(s, function(v) {
          n.isUndefined(r[v]) ? n.isUndefined(o[v]) || (t[v] = l(void 0, o[v])) : t[v] = l(void 0, r[v]);
        }), n.forEach(c, function(v) {
          v in r ? t[v] = l(o[v], r[v]) : v in o && (t[v] = l(void 0, o[v]));
        });
        var g = a.concat(u).concat(s).concat(c), p = Object.keys(o).concat(Object.keys(r)).filter(function(v) {
          return g.indexOf(v) === -1;
        });
        return n.forEach(p, f), t;
      };
    }, "4d63": function(i, d, e) {
      var n = e("83ab"), o = e("da84"), r = e("94ca"), t = e("7156"), a = e("9bf2").f, u = e("241c").f, s = e("44e7"), c = e("ad6d"), l = e("9f7f"), f = e("6eeb"), g = e("d039"), p = e("69f3").set, v = e("2626"), h = e("b622"), m = h("match"), y = o.RegExp, S = y.prototype, C = /a/g, x = /a/g, w = new y(C) !== C, b = l.UNSUPPORTED_Y, E = n && r("RegExp", !w || b || g(function() {
        return x[m] = !1, y(C) != C || y(x) == x || y(C, "i") != "/a/i";
      }));
      if (E) {
        for (var O = function(V, Y) {
          var ne, H = this instanceof O, q = s(V), F = Y === void 0;
          if (!H && q && V.constructor === O && F) return V;
          w ? q && !F && (V = V.source) : V instanceof O && (F && (Y = c.call(V)), V = V.source), b && (ne = !!Y && Y.indexOf("y") > -1, ne && (Y = Y.replace(/y/g, "")));
          var L = t(w ? new y(V, Y) : y(V, Y), H ? this : S, O);
          return b && ne && p(L, { sticky: ne }), L;
        }, A = function(V) {
          V in O || a(O, V, { configurable: !0, get: function() {
            return y[V];
          }, set: function(Y) {
            y[V] = Y;
          } });
        }, _ = u(y), M = 0; _.length > M; ) A(_[M++]);
        S.constructor = O, O.prototype = S, f(o, "RegExp", O);
      }
      v("RegExp");
    }, "4d64": function(i, d, e) {
      var n = e("fc6a"), o = e("50c4"), r = e("23cb"), t = function(a) {
        return function(u, s, c) {
          var l, f = n(u), g = o(f.length), p = r(c, g);
          if (a && s != s) {
            for (; g > p; ) if (l = f[p++], l != l) return !0;
          } else for (; g > p; p++) if ((a || p in f) && f[p] === s) return a || p || 0;
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
      i.exports = function(c) {
        var l, f, g, p, v, h, m = o(c), y = typeof this == "function" ? this : Array, S = arguments.length, C = S > 1 ? arguments[1] : void 0, x = C !== void 0, w = s(m), b = 0;
        if (x && (C = n(C, S > 2 ? arguments[2] : void 0, 2)), w == null || y == Array && t(w)) for (l = a(m.length), f = new y(l); l > b; b++) h = x ? C(m[b], b) : m[b], u(f, b, h);
        else for (p = w.call(m), v = p.next, f = new y(); !(g = v.call(p)).done; b++) h = x ? r(p, C, [g.value, b], !0) : g.value, u(f, b, h);
        return f.length = b, f;
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
        a(u), u.headers = u.headers || {}, u.data = o(u.data, u.headers, u.transformRequest), u.headers = n.merge(u.headers.common || {}, u.headers[u.method] || {}, u.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(c) {
          delete u.headers[c];
        });
        var s = u.adapter || t.adapter;
        return s(u).then(function(c) {
          return a(u), c.data = o(c.data, c.headers, u.transformResponse), c;
        }, function(c) {
          return r(c) || (a(u), c && c.response && (c.response.data = o(c.response.data, c.response.headers, u.transformResponse))), Promise.reject(c);
        });
      };
    }, 5319: function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("a691"), a = e("1d80"), u = e("8aa5"), s = e("0cb2"), c = e("14c3"), l = Math.max, f = Math.min, g = function(p) {
        return p === void 0 ? p : String(p);
      };
      n("replace", 2, function(p, v, h, m) {
        var y = m.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, S = m.REPLACE_KEEPS_$0, C = y ? "$" : "$0";
        return [function(x, w) {
          var b = a(this), E = x == null ? void 0 : x[p];
          return E !== void 0 ? E.call(x, b, w) : v.call(String(b), x, w);
        }, function(x, w) {
          if (!y && S || typeof w == "string" && w.indexOf(C) === -1) {
            var b = h(v, x, this, w);
            if (b.done) return b.value;
          }
          var E = o(x), O = String(this), A = typeof w == "function";
          A || (w = String(w));
          var _ = E.global;
          if (_) {
            var M = E.unicode;
            E.lastIndex = 0;
          }
          for (var V = []; ; ) {
            var Y = c(E, O);
            if (Y === null || (V.push(Y), !_)) break;
            var ne = String(Y[0]);
            ne === "" && (E.lastIndex = u(O, r(E.lastIndex), M));
          }
          for (var H = "", q = 0, F = 0; F < V.length; F++) {
            Y = V[F];
            for (var L = String(Y[0]), N = l(f(t(Y.index), O.length), 0), B = [], P = 1; P < Y.length; P++) B.push(g(Y[P]));
            var T = Y.groups;
            if (A) {
              var pe = [L].concat(B, N, O);
              T !== void 0 && pe.push(T);
              var ve = String(w.apply(void 0, pe));
            } else ve = s(L, O, N, B, T, w);
            N >= q && (H += O.slice(q, N) + ve, q = N + L.length);
          }
          return H + O.slice(q);
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
        var r = n.document, t = r.documentElement, a = r.querySelector('meta[name="viewport"]'), u = r.querySelector('meta[name="flexible"]'), s = 0, c = 0, l = o.flexible || (o.flexible = {});
        if (a) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = a.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (c = parseFloat(f[1]), s = parseInt(1 / c));
        } else if (u) {
          var g = u.getAttribute("content");
          if (g) {
            var p = g.match(/initial\-dpr=([\d\.]+)/), v = g.match(/maximum\-dpr=([\d\.]+)/);
            p && (s = parseFloat(p[1]), c = parseFloat((1 / s).toFixed(2))), v && (s = parseFloat(v[1]), c = parseFloat((1 / s).toFixed(2)));
          }
        }
        if (!s && !c) {
          n.navigator.appVersion.match(/android/gi);
          var h = n.navigator.appVersion.match(/iphone/gi), m = n.devicePixelRatio;
          s = h ? m >= 3 && (!s || s >= 3) ? 3 : m >= 2 && (!s || s >= 2) ? 2 : 1 : 1, c = 1 / s;
        }
        if (t.setAttribute("data-dpr", s), !a) if (a = r.createElement("meta"), a.setAttribute("name", "viewport"), a.setAttribute("content", "initial-scale=" + c + ", maximum-scale=" + c + ", minimum-scale=" + c + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(a);
        else {
          var y = r.createElement("div");
          y.appendChild(a), r.write(y.innerHTML);
        }
        function S() {
          var C = t.getBoundingClientRect().width, x = C / 10;
          t.style.fontSize = x + "px", l.rem = n.rem = x;
        }
        n.addEventListener("resize", function() {
          S();
        }, !1), n.addEventListener("pageshow", function(C) {
          C.persisted && S();
        }, !1), r.readyState === "complete" ? r.body.style.fontSize = 10 * s + "px" : r.addEventListener("DOMContentLoaded", function(C) {
          r.body.style.fontSize = 10 * s + "px";
        }, !1), S(), l.dpr = n.dpr = s, l.refreshRem = S, l.rem2px = function(C) {
          var x = parseFloat(C) * this.rem;
          return typeof C == "string" && C.match(/rem$/) && (x += "px"), x;
        }, l.px2rem = function(C) {
          var x = parseFloat(C) / this.rem;
          return typeof C == "string" && C.match(/px$/) && (x += "rem"), x;
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
          var s, c, l = String(o(a)), f = n(u), g = l.length;
          return f < 0 || f >= g ? t ? "" : void 0 : (s = l.charCodeAt(f), s < 55296 || s > 56319 || f + 1 === g || (c = l.charCodeAt(f + 1)) < 56320 || c > 57343 ? t ? l.charAt(f) : s : t ? l.slice(f, f + 2) : c - 56320 + (s - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: r(!1), charAt: r(!0) };
    }, 6566: function(i, d, e) {
      var n = e("9bf2").f, o = e("7c73"), r = e("e2cc"), t = e("0366"), a = e("19aa"), u = e("2266"), s = e("7dd0"), c = e("2626"), l = e("83ab"), f = e("f183").fastKey, g = e("69f3"), p = g.set, v = g.getterFor;
      i.exports = { getConstructor: function(h, m, y, S) {
        var C = h(function(E, O) {
          a(E, C, m), p(E, { type: m, index: o(null), first: void 0, last: void 0, size: 0 }), l || (E.size = 0), O != null && u(O, E[S], { that: E, AS_ENTRIES: y });
        }), x = v(m), w = function(E, O, A) {
          var _, M, V = x(E), Y = b(E, O);
          return Y ? Y.value = A : (V.last = Y = { index: M = f(O, !0), key: O, value: A, previous: _ = V.last, next: void 0, removed: !1 }, V.first || (V.first = Y), _ && (_.next = Y), l ? V.size++ : E.size++, M !== "F" && (V.index[M] = Y)), E;
        }, b = function(E, O) {
          var A, _ = x(E), M = f(O);
          if (M !== "F") return _.index[M];
          for (A = _.first; A; A = A.next) if (A.key == O) return A;
        };
        return r(C.prototype, { clear: function() {
          for (var E = this, O = x(E), A = O.index, _ = O.first; _; ) _.removed = !0, _.previous && (_.previous = _.previous.next = void 0), delete A[_.index], _ = _.next;
          O.first = O.last = void 0, l ? O.size = 0 : E.size = 0;
        }, delete: function(E) {
          var O = this, A = x(O), _ = b(O, E);
          if (_) {
            var M = _.next, V = _.previous;
            delete A.index[_.index], _.removed = !0, V && (V.next = M), M && (M.previous = V), A.first == _ && (A.first = M), A.last == _ && (A.last = V), l ? A.size-- : O.size--;
          }
          return !!_;
        }, forEach: function(E) {
          for (var O, A = x(this), _ = t(E, arguments.length > 1 ? arguments[1] : void 0, 3); O = O ? O.next : A.first; )
            for (_(O.value, O.key, this); O && O.removed; ) O = O.previous;
        }, has: function(E) {
          return !!b(this, E);
        } }), r(C.prototype, y ? { get: function(E) {
          var O = b(this, E);
          return O && O.value;
        }, set: function(E, O) {
          return w(this, E === 0 ? 0 : E, O);
        } } : { add: function(E) {
          return w(this, E = E === 0 ? 0 : E, E);
        } }), l && n(C.prototype, "size", { get: function() {
          return x(this).size;
        } }), C;
      }, setStrong: function(h, m, y) {
        var S = m + " Iterator", C = v(m), x = v(S);
        s(h, m, function(w, b) {
          p(this, { type: S, target: w, state: C(w), kind: b, last: void 0 });
        }, function() {
          for (var w = x(this), b = w.kind, E = w.last; E && E.removed; ) E = E.previous;
          return w.target && (w.last = E = E ? E.next : w.state.first) ? b == "keys" ? { value: E.key, done: !1 } : b == "values" ? { value: E.value, done: !1 } : { value: [E.key, E.value], done: !1 } : (w.target = void 0, { value: void 0, done: !0 });
        }, y ? "entries" : "values", !y, !0), c(m);
      } };
    }, "65f0": function(i, d, e) {
      var n = e("861d"), o = e("e8b5"), r = e("b622"), t = r("species");
      i.exports = function(a, u) {
        var s;
        return o(a) && (s = a.constructor, typeof s != "function" || s !== Array && !o(s.prototype) ? n(s) && (s = s[t], s === null && (s = void 0)) : s = void 0), new (s === void 0 ? Array : s)(u === 0 ? 0 : u);
      };
    }, "69f3": function(i, d, e) {
      var n, o, r, t = e("7f9a"), a = e("da84"), u = e("861d"), s = e("9112"), c = e("5135"), l = e("c6cd"), f = e("f772"), g = e("d012"), p = a.WeakMap, v = function(w) {
        return r(w) ? o(w) : n(w, {});
      }, h = function(w) {
        return function(b) {
          var E;
          if (!u(b) || (E = o(b)).type !== w) throw TypeError("Incompatible receiver, " + w + " required");
          return E;
        };
      };
      if (t) {
        var m = l.state || (l.state = new p()), y = m.get, S = m.has, C = m.set;
        n = function(w, b) {
          return b.facade = w, C.call(m, w, b), b;
        }, o = function(w) {
          return y.call(m, w) || {};
        }, r = function(w) {
          return S.call(m, w);
        };
      } else {
        var x = f("state");
        g[x] = !0, n = function(w, b) {
          return b.facade = w, s(w, x, b), b;
        }, o = function(w) {
          return c(w, x) ? w[x] : {};
        }, r = function(w) {
          return c(w, x);
        };
      }
      i.exports = { set: n, get: o, has: r, enforce: v, getterFor: h };
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
      var n = e("23e7"), o = e("da84"), r = e("94ca"), t = e("6eeb"), a = e("f183"), u = e("2266"), s = e("19aa"), c = e("861d"), l = e("d039"), f = e("1c7e"), g = e("d44e"), p = e("7156");
      i.exports = function(v, h, m) {
        var y = v.indexOf("Map") !== -1, S = v.indexOf("Weak") !== -1, C = y ? "set" : "add", x = o[v], w = x && x.prototype, b = x, E = {}, O = function(H) {
          var q = w[H];
          t(w, H, H == "add" ? function(F) {
            return q.call(this, F === 0 ? 0 : F), this;
          } : H == "delete" ? function(F) {
            return !(S && !c(F)) && q.call(this, F === 0 ? 0 : F);
          } : H == "get" ? function(F) {
            return S && !c(F) ? void 0 : q.call(this, F === 0 ? 0 : F);
          } : H == "has" ? function(F) {
            return !(S && !c(F)) && q.call(this, F === 0 ? 0 : F);
          } : function(F, L) {
            return q.call(this, F === 0 ? 0 : F, L), this;
          });
        }, A = r(v, typeof x != "function" || !(S || w.forEach && !l(function() {
          new x().entries().next();
        })));
        if (A) b = m.getConstructor(h, v, y, C), a.REQUIRED = !0;
        else if (r(v, !0)) {
          var _ = new b(), M = _[C](S ? {} : -0, 1) != _, V = l(function() {
            _.has(1);
          }), Y = f(function(H) {
            new x(H);
          }), ne = !S && l(function() {
            for (var H = new x(), q = 5; q--; ) H[C](q, q);
            return !H.has(-0);
          });
          Y || (b = h(function(H, q) {
            s(H, b, v);
            var F = p(new x(), H, b);
            return q != null && u(q, F[C], { that: F, AS_ENTRIES: y }), F;
          }), b.prototype = w, w.constructor = b), (V || ne) && (O("delete"), O("has"), y && O("get")), (ne || M) && O(C), S && w.clear && delete w.clear;
        }
        return E[v] = b, n({ global: !0, forced: b != x }, E), g(b, v), S || m.setStrong(b, v, y), b;
      };
    }, "6eeb": function(i, d, e) {
      var n = e("da84"), o = e("9112"), r = e("5135"), t = e("ce4e"), a = e("8925"), u = e("69f3"), s = u.get, c = u.enforce, l = String(String).split("String");
      (i.exports = function(f, g, p, v) {
        var h, m = !!v && !!v.unsafe, y = !!v && !!v.enumerable, S = !!v && !!v.noTargetGet;
        typeof p == "function" && (typeof g != "string" || r(p, "name") || o(p, "name", g), h = c(p), h.source || (h.source = l.join(typeof g == "string" ? g : ""))), f !== n ? (m ? !S && f[g] && (y = !0) : delete f[g], y ? f[g] = p : o(f, g, p)) : y ? f[g] = p : t(g, p);
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
          var c = [];
          c.push(o + "=" + encodeURIComponent(r)), n.isNumber(t) && c.push("expires=" + new Date(t).toGMTString()), n.isString(a) && c.push("path=" + a), n.isString(u) && c.push("domain=" + u), s === !0 && c.push("secure"), document.cookie = c.join("; ");
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
      var n, o = e("825a"), r = e("37e8"), t = e("7839"), a = e("d012"), u = e("1be4"), s = e("cc12"), c = e("f772"), l = ">", f = "<", g = "prototype", p = "script", v = c("IE_PROTO"), h = function() {
      }, m = function(x) {
        return f + p + l + x + f + "/" + p + l;
      }, y = function(x) {
        x.write(m("")), x.close();
        var w = x.parentWindow.Object;
        return x = null, w;
      }, S = function() {
        var x, w = s("iframe"), b = "java" + p + ":";
        return w.style.display = "none", u.appendChild(w), w.src = String(b), x = w.contentWindow.document, x.open(), x.write(m("document.F=Object")), x.close(), x.F;
      }, C = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        C = n ? y(n) : S();
        for (var x = t.length; x--; ) delete C[g][t[x]];
        return C();
      };
      a[v] = !0, i.exports = Object.create || function(x, w) {
        var b;
        return x !== null ? (h[g] = o(x), b = new h(), h[g] = null, b[v] = x) : b = C(), w === void 0 ? b : r(b, w);
      };
    }, "7db0": function(i, d, e) {
      var n = e("23e7"), o = e("b727").find, r = e("44d2"), t = "find", a = !0;
      t in [] && Array(1)[t](function() {
        a = !1;
      }), n({ target: "Array", proto: !0, forced: a }, { find: function(u) {
        return o(this, u, arguments.length > 1 ? arguments[1] : void 0);
      } }), r(t);
    }, "7dd0": function(i, d, e) {
      var n = e("23e7"), o = e("9ed3"), r = e("e163"), t = e("d2bb"), a = e("d44e"), u = e("9112"), s = e("6eeb"), c = e("b622"), l = e("c430"), f = e("3f8c"), g = e("ae93"), p = g.IteratorPrototype, v = g.BUGGY_SAFARI_ITERATORS, h = c("iterator"), m = "keys", y = "values", S = "entries", C = function() {
        return this;
      };
      i.exports = function(x, w, b, E, O, A, _) {
        o(b, w, E);
        var M, V, Y, ne = function(P) {
          if (P === O && N) return N;
          if (!v && P in F) return F[P];
          switch (P) {
            case m:
              return function() {
                return new b(this, P);
              };
            case y:
              return function() {
                return new b(this, P);
              };
            case S:
              return function() {
                return new b(this, P);
              };
          }
          return function() {
            return new b(this);
          };
        }, H = w + " Iterator", q = !1, F = x.prototype, L = F[h] || F["@@iterator"] || O && F[O], N = !v && L || ne(O), B = w == "Array" && F.entries || L;
        if (B && (M = r(B.call(new x())), p !== Object.prototype && M.next && (l || r(M) === p || (t ? t(M, p) : typeof M[h] != "function" && u(M, h, C)), a(M, H, !0, !0), l && (f[H] = C))), O == y && L && L.name !== y && (q = !0, N = function() {
          return L.call(this);
        }), l && !_ || F[h] === N || u(F, h, N), f[w] = N, O) if (V = { values: ne(y), keys: A ? N : ne(m), entries: ne(S) }, _) for (Y in V) (v || q || !(Y in F)) && s(F, Y, V[Y]);
        else n({ target: w, proto: !0, forced: v || q }, V);
        return V;
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
          } catch (S) {
            var u, s, c, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, g = l.exec(S.stack) || f.exec(S.stack), p = g && g[1] || !1, v = g && g[2] || !1, h = document.location.href.replace(document.location.hash, ""), m = document.getElementsByTagName("script");
            p === h && (u = document.documentElement.outerHTML, s = new RegExp("(?:[^\\n]+?\\n){0," + (v - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), c = u.replace(s, "$1").trim());
            for (var y = 0; y < m.length; y++)
              if (m[y].readyState === "interactive" || m[y].src === p || p === h && m[y].innerHTML && m[y].innerHTML.trim() === c) return m[y];
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
        var f = /a/, g = /b*/g;
        return r.call(f, "a"), r.call(g, "a"), f.lastIndex !== 0 || g.lastIndex !== 0;
      }(), s = o.UNSUPPORTED_Y || o.BROKEN_CARET, c = /()??/.exec("")[1] !== void 0, l = u || c || s;
      l && (a = function(f) {
        var g, p, v, h, m = this, y = s && m.sticky, S = n.call(m), C = m.source, x = 0, w = f;
        return y && (S = S.replace("y", ""), S.indexOf("g") === -1 && (S += "g"), w = String(f).slice(m.lastIndex), m.lastIndex > 0 && (!m.multiline || m.multiline && f[m.lastIndex - 1] !== `
`) && (C = "(?: " + C + ")", w = " " + w, x++), p = new RegExp("^(?:" + C + ")", S)), c && (p = new RegExp("^" + C + "$(?!\\s)", S)), u && (g = m.lastIndex), v = r.call(y ? p : m, w), y ? v ? (v.input = v.input.slice(x), v[0] = v[0].slice(x), v.index = m.lastIndex, m.lastIndex += v[0].length) : m.lastIndex = 0 : u && v && (m.lastIndex = m.global ? v.index + v[0].length : g), c && v && v.length > 1 && t.call(v[0], p, function() {
          for (h = 1; h < arguments.length - 2; h++) arguments[h] === void 0 && (v[h] = void 0);
        }), v;
      }), i.exports = a;
    }, "94ca": function(i, d, e) {
      var n = e("d039"), o = /#|\.prototype\./, r = function(c, l) {
        var f = a[t(c)];
        return f == s || f != u && (typeof l == "function" ? n(l) : !!l);
      }, t = r.normalize = function(c) {
        return String(c).replace(o, ".").toLowerCase();
      }, a = r.data = {}, u = r.NATIVE = "N", s = r.POLYFILL = "P";
      i.exports = r;
    }, "95d9": function(i, d, e) {
    }, "96cf": function(i, d) {
      (function(e) {
        var n, o = Object.prototype, r = o.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, a = t.iterator || "@@iterator", u = t.asyncIterator || "@@asyncIterator", s = t.toStringTag || "@@toStringTag", c = typeof i == "object", l = e.regeneratorRuntime;
        if (l) c && (i.exports = l);
        else {
          l = e.regeneratorRuntime = c ? i.exports : {}, l.wrap = x;
          var f = "suspendedStart", g = "suspendedYield", p = "executing", v = "completed", h = {}, m = {};
          m[a] = function() {
            return this;
          };
          var y = Object.getPrototypeOf, S = y && y(y(q([])));
          S && S !== o && r.call(S, a) && (m = S);
          var C = O.prototype = b.prototype = Object.create(m);
          E.prototype = C.constructor = O, O.constructor = E, O[s] = E.displayName = "GeneratorFunction", l.isGeneratorFunction = function(L) {
            var N = typeof L == "function" && L.constructor;
            return !!N && (N === E || (N.displayName || N.name) === "GeneratorFunction");
          }, l.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, O) : (L.__proto__ = O, s in L || (L[s] = "GeneratorFunction")), L.prototype = Object.create(C), L;
          }, l.awrap = function(L) {
            return { __await: L };
          }, A(_.prototype), _.prototype[u] = function() {
            return this;
          }, l.AsyncIterator = _, l.async = function(L, N, B, P) {
            var T = new _(x(L, N, B, P));
            return l.isGeneratorFunction(N) ? T : T.next().then(function(pe) {
              return pe.done ? pe.value : T.next();
            });
          }, A(C), C[s] = "Generator", C[a] = function() {
            return this;
          }, C.toString = function() {
            return "[object Generator]";
          }, l.keys = function(L) {
            var N = [];
            for (var B in L) N.push(B);
            return N.reverse(), function P() {
              for (; N.length; ) {
                var T = N.pop();
                if (T in L) return P.value = T, P.done = !1, P;
              }
              return P.done = !0, P;
            };
          }, l.values = q, H.prototype = { constructor: H, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(ne), !L) for (var N in this) N.charAt(0) === "t" && r.call(this, N) && !isNaN(+N.slice(1)) && (this[N] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], N = L.completion;
            if (N.type === "throw") throw N.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var N = this;
            function B(Be, Ie) {
              return pe.type = "throw", pe.arg = L, N.next = Be, Ie && (N.method = "next", N.arg = n), !!Ie;
            }
            for (var P = this.tryEntries.length - 1; P >= 0; --P) {
              var T = this.tryEntries[P], pe = T.completion;
              if (T.tryLoc === "root") return B("end");
              if (T.tryLoc <= this.prev) {
                var ve = r.call(T, "catchLoc"), Pe = r.call(T, "finallyLoc");
                if (ve && Pe) {
                  if (this.prev < T.catchLoc) return B(T.catchLoc, !0);
                  if (this.prev < T.finallyLoc) return B(T.finallyLoc);
                } else if (ve) {
                  if (this.prev < T.catchLoc) return B(T.catchLoc, !0);
                } else {
                  if (!Pe) throw new Error("try statement without catch or finally");
                  if (this.prev < T.finallyLoc) return B(T.finallyLoc);
                }
              }
            }
          }, abrupt: function(L, N) {
            for (var B = this.tryEntries.length - 1; B >= 0; --B) {
              var P = this.tryEntries[B];
              if (P.tryLoc <= this.prev && r.call(P, "finallyLoc") && this.prev < P.finallyLoc) {
                var T = P;
                break;
              }
            }
            T && (L === "break" || L === "continue") && T.tryLoc <= N && N <= T.finallyLoc && (T = null);
            var pe = T ? T.completion : {};
            return pe.type = L, pe.arg = N, T ? (this.method = "next", this.next = T.finallyLoc, h) : this.complete(pe);
          }, complete: function(L, N) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && N && (this.next = N), h;
          }, finish: function(L) {
            for (var N = this.tryEntries.length - 1; N >= 0; --N) {
              var B = this.tryEntries[N];
              if (B.finallyLoc === L) return this.complete(B.completion, B.afterLoc), ne(B), h;
            }
          }, catch: function(L) {
            for (var N = this.tryEntries.length - 1; N >= 0; --N) {
              var B = this.tryEntries[N];
              if (B.tryLoc === L) {
                var P = B.completion;
                if (P.type === "throw") {
                  var T = P.arg;
                  ne(B);
                }
                return T;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(L, N, B) {
            return this.delegate = { iterator: q(L), resultName: N, nextLoc: B }, this.method === "next" && (this.arg = n), h;
          } };
        }
        function x(L, N, B, P) {
          var T = N && N.prototype instanceof b ? N : b, pe = Object.create(T.prototype), ve = new H(P || []);
          return pe._invoke = M(L, B, ve), pe;
        }
        function w(L, N, B) {
          try {
            return { type: "normal", arg: L.call(N, B) };
          } catch (P) {
            return { type: "throw", arg: P };
          }
        }
        function b() {
        }
        function E() {
        }
        function O() {
        }
        function A(L) {
          ["next", "throw", "return"].forEach(function(N) {
            L[N] = function(B) {
              return this._invoke(N, B);
            };
          });
        }
        function _(L) {
          function N(T, pe, ve, Pe) {
            var Be = w(L[T], L, pe);
            if (Be.type !== "throw") {
              var Ie = Be.arg, Ae = Ie.value;
              return Ae && typeof Ae == "object" && r.call(Ae, "__await") ? Promise.resolve(Ae.__await).then(function(Le) {
                N("next", Le, ve, Pe);
              }, function(Le) {
                N("throw", Le, ve, Pe);
              }) : Promise.resolve(Ae).then(function(Le) {
                Ie.value = Le, ve(Ie);
              }, Pe);
            }
            Pe(Be.arg);
          }
          var B;
          function P(T, pe) {
            function ve() {
              return new Promise(function(Pe, Be) {
                N(T, pe, Pe, Be);
              });
            }
            return B = B ? B.then(ve, ve) : ve();
          }
          this._invoke = P;
        }
        function M(L, N, B) {
          var P = f;
          return function(T, pe) {
            if (P === p) throw new Error("Generator is already running");
            if (P === v) {
              if (T === "throw") throw pe;
              return F();
            }
            for (B.method = T, B.arg = pe; ; ) {
              var ve = B.delegate;
              if (ve) {
                var Pe = V(ve, B);
                if (Pe) {
                  if (Pe === h) continue;
                  return Pe;
                }
              }
              if (B.method === "next") B.sent = B._sent = B.arg;
              else if (B.method === "throw") {
                if (P === f) throw P = v, B.arg;
                B.dispatchException(B.arg);
              } else B.method === "return" && B.abrupt("return", B.arg);
              P = p;
              var Be = w(L, N, B);
              if (Be.type === "normal") {
                if (P = B.done ? v : g, Be.arg === h) continue;
                return { value: Be.arg, done: B.done };
              }
              Be.type === "throw" && (P = v, B.method = "throw", B.arg = Be.arg);
            }
          };
        }
        function V(L, N) {
          var B = L.iterator[N.method];
          if (B === n) {
            if (N.delegate = null, N.method === "throw") {
              if (L.iterator.return && (N.method = "return", N.arg = n, V(L, N), N.method === "throw")) return h;
              N.method = "throw", N.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return h;
          }
          var P = w(B, L.iterator, N.arg);
          if (P.type === "throw") return N.method = "throw", N.arg = P.arg, N.delegate = null, h;
          var T = P.arg;
          return T ? T.done ? (N[L.resultName] = T.value, N.next = L.nextLoc, N.method !== "return" && (N.method = "next", N.arg = n), N.delegate = null, h) : T : (N.method = "throw", N.arg = new TypeError("iterator result is not an object"), N.delegate = null, h);
        }
        function Y(L) {
          var N = { tryLoc: L[0] };
          1 in L && (N.catchLoc = L[1]), 2 in L && (N.finallyLoc = L[2], N.afterLoc = L[3]), this.tryEntries.push(N);
        }
        function ne(L) {
          var N = L.completion || {};
          N.type = "normal", delete N.arg, L.completion = N;
        }
        function H(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(Y, this), this.reset(!0);
        }
        function q(L) {
          if (L) {
            var N = L[a];
            if (N) return N.call(L);
            if (typeof L.next == "function") return L;
            if (!isNaN(L.length)) {
              var B = -1, P = function T() {
                for (; ++B < L.length; ) if (r.call(L, B)) return T.value = L[B], T.done = !1, T;
                return T.value = n, T.done = !0, T;
              };
              return P.next = P;
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
    }, "99af": function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("e8b5"), t = e("861d"), a = e("7b0b"), u = e("50c4"), s = e("8418"), c = e("65f0"), l = e("1dde"), f = e("b622"), g = e("2d00"), p = f("isConcatSpreadable"), v = 9007199254740991, h = "Maximum allowed index exceeded", m = g >= 51 || !o(function() {
        var x = [];
        return x[p] = !1, x.concat()[0] !== x;
      }), y = l("concat"), S = function(x) {
        if (!t(x)) return !1;
        var w = x[p];
        return w !== void 0 ? !!w : r(x);
      }, C = !m || !y;
      n({ target: "Array", proto: !0, forced: C }, { concat: function(x) {
        var w, b, E, O, A, _ = a(this), M = c(_, 0), V = 0;
        for (w = -1, E = arguments.length; w < E; w++) if (A = w === -1 ? _ : arguments[w], S(A)) {
          if (O = u(A.length), V + O > v) throw TypeError(h);
          for (b = 0; b < O; b++, V++) b in A && s(M, V, A[b]);
        } else {
          if (V >= v) throw TypeError(h);
          s(M, V++, A);
        }
        return M.length = V, M;
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
      d.f = n ? a : function(u, s, c) {
        if (r(u), s = t(s, !0), r(c), o) try {
          return a(u, s, c);
        } catch {
        }
        if ("get" in c || "set" in c) throw TypeError("Accessors not supported");
        return "value" in c && (u[s] = c.value), u;
      };
    }, "9ed3": function(i, d, e) {
      var n = e("ae93").IteratorPrototype, o = e("7c73"), r = e("5c6c"), t = e("d44e"), a = e("3f8c"), u = function() {
        return this;
      };
      i.exports = function(s, c, l) {
        var f = c + " Iterator";
        return s.prototype = o(n, { next: r(1, l) }), t(s, f, !1, !0), a[f] = u, s;
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
      var n = e("23e7"), o = e("23cb"), r = e("a691"), t = e("50c4"), a = e("7b0b"), u = e("65f0"), s = e("8418"), c = e("1dde"), l = c("splice"), f = Math.max, g = Math.min, p = 9007199254740991, v = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(h, m) {
        var y, S, C, x, w, b, E = a(this), O = t(E.length), A = o(h, O), _ = arguments.length;
        if (_ === 0 ? y = S = 0 : _ === 1 ? (y = 0, S = O - A) : (y = _ - 2, S = g(f(r(m), 0), O - A)), O + y - S > p) throw TypeError(v);
        for (C = u(E, S), x = 0; x < S; x++) w = A + x, w in E && s(C, x, E[w]);
        if (C.length = S, y < S) {
          for (x = A; x < O - S; x++) w = x + S, b = x + y, w in E ? E[b] = E[w] : delete E[b];
          for (x = O; x > O - S + y; x--) delete E[x - 1];
        } else if (y > S) for (x = O - S; x > A; x--) w = x + S - 1, b = x + y - 1, w in E ? E[b] = E[w] : delete E[b];
        for (x = 0; x < y; x++) E[x + A] = arguments[x + 2];
        return E.length = O - S + y, C;
      } });
    }, a4b4: function(i, d, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("d066"), t = e("c430"), a = e("83ab"), u = e("4930"), s = e("fdbf"), c = e("d039"), l = e("5135"), f = e("e8b5"), g = e("861d"), p = e("825a"), v = e("7b0b"), h = e("fc6a"), m = e("c04e"), y = e("5c6c"), S = e("7c73"), C = e("df75"), x = e("241c"), w = e("057f"), b = e("7418"), E = e("06cf"), O = e("9bf2"), A = e("d1e7"), _ = e("9112"), M = e("6eeb"), V = e("5692"), Y = e("f772"), ne = e("d012"), H = e("90e3"), q = e("b622"), F = e("e538"), L = e("746f"), N = e("d44e"), B = e("69f3"), P = e("b727").forEach, T = Y("hidden"), pe = "Symbol", ve = "prototype", Pe = q("toPrimitive"), Be = B.set, Ie = B.getterFor(pe), Ae = Object[ve], Le = o.Symbol, He = r("JSON", "stringify"), at = E.f, I = O.f, D = w.f, Z = A.f, W = V("symbols"), ee = V("op-symbols"), re = V("string-to-symbol-registry"), we = V("symbol-to-string-registry"), ge = V("wks"), se = o.QObject, ke = !se || !se[ve] || !se[ve].findChild, Se = a && c(function() {
        return S(I({}, "a", { get: function() {
          return I(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(z, te, ae) {
        var fe = at(Ae, te);
        fe && delete Ae[te], I(z, te, ae), fe && z !== Ae && I(Ae, te, fe);
      } : I, $e = function(z, te) {
        var ae = W[z] = S(Le[ve]);
        return Be(ae, { type: pe, tag: z, description: te }), a || (ae.description = te), ae;
      }, je = s ? function(z) {
        return typeof z == "symbol";
      } : function(z) {
        return Object(z) instanceof Le;
      }, Ve = function(z, te, ae) {
        z === Ae && Ve(ee, te, ae), p(z);
        var fe = m(te, !0);
        return p(ae), l(W, fe) ? (ae.enumerable ? (l(z, T) && z[T][fe] && (z[T][fe] = !1), ae = S(ae, { enumerable: y(0, !1) })) : (l(z, T) || I(z, T, y(1, {})), z[T][fe] = !0), Se(z, fe, ae)) : I(z, fe, ae);
      }, Ye = function(z, te) {
        p(z);
        var ae = h(te), fe = C(ae).concat(ce(ae));
        return P(fe, function(Ue) {
          a && !st.call(ae, Ue) || Ve(z, Ue, ae[Ue]);
        }), z;
      }, et = function(z, te) {
        return te === void 0 ? S(z) : Ye(S(z), te);
      }, st = function(z) {
        var te = m(z, !0), ae = Z.call(this, te);
        return !(this === Ae && l(W, te) && !l(ee, te)) && (!(ae || !l(this, te) || !l(W, te) || l(this, T) && this[T][te]) || ae);
      }, K = function(z, te) {
        var ae = h(z), fe = m(te, !0);
        if (ae !== Ae || !l(W, fe) || l(ee, fe)) {
          var Ue = at(ae, fe);
          return !Ue || !l(W, fe) || l(ae, T) && ae[T][fe] || (Ue.enumerable = !0), Ue;
        }
      }, oe = function(z) {
        var te = D(h(z)), ae = [];
        return P(te, function(fe) {
          l(W, fe) || l(ne, fe) || ae.push(fe);
        }), ae;
      }, ce = function(z) {
        var te = z === Ae, ae = D(te ? ee : h(z)), fe = [];
        return P(ae, function(Ue) {
          !l(W, Ue) || te && !l(Ae, Ue) || fe.push(W[Ue]);
        }), fe;
      };
      if (u || (Le = function() {
        if (this instanceof Le) throw TypeError("Symbol is not a constructor");
        var z = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, te = H(z), ae = function(fe) {
          this === Ae && ae.call(ee, fe), l(this, T) && l(this[T], te) && (this[T][te] = !1), Se(this, te, y(1, fe));
        };
        return a && ke && Se(Ae, te, { configurable: !0, set: ae }), $e(te, z);
      }, M(Le[ve], "toString", function() {
        return Ie(this).tag;
      }), M(Le, "withoutSetter", function(z) {
        return $e(H(z), z);
      }), A.f = st, O.f = Ve, E.f = K, x.f = w.f = oe, b.f = ce, F.f = function(z) {
        return $e(q(z), z);
      }, a && (I(Le[ve], "description", { configurable: !0, get: function() {
        return Ie(this).description;
      } }), t || M(Ae, "propertyIsEnumerable", st, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !u, sham: !u }, { Symbol: Le }), P(C(ge), function(z) {
        L(z);
      }), n({ target: pe, stat: !0, forced: !u }, { for: function(z) {
        var te = String(z);
        if (l(re, te)) return re[te];
        var ae = Le(te);
        return re[te] = ae, we[ae] = te, ae;
      }, keyFor: function(z) {
        if (!je(z)) throw TypeError(z + " is not a symbol");
        if (l(we, z)) return we[z];
      }, useSetter: function() {
        ke = !0;
      }, useSimple: function() {
        ke = !1;
      } }), n({ target: "Object", stat: !0, forced: !u, sham: !a }, { create: et, defineProperty: Ve, defineProperties: Ye, getOwnPropertyDescriptor: K }), n({ target: "Object", stat: !0, forced: !u }, { getOwnPropertyNames: oe, getOwnPropertySymbols: ce }), n({ target: "Object", stat: !0, forced: c(function() {
        b.f(1);
      }) }, { getOwnPropertySymbols: function(z) {
        return b.f(v(z));
      } }), He) {
        var de = !u || c(function() {
          var z = Le();
          return He([z]) != "[null]" || He({ a: z }) != "{}" || He(Object(z)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: de }, { stringify: function(z, te, ae) {
          for (var fe, Ue = [z], We = 1; arguments.length > We; ) Ue.push(arguments[We++]);
          if (fe = te, (g(te) || z !== void 0) && !je(z)) return f(te) || (te = function(tt, xe) {
            if (typeof fe == "function" && (xe = fe.call(this, tt, xe)), !je(xe)) return xe;
          }), Ue[1] = te, He.apply(null, Ue);
        } });
      }
      Le[ve][Pe] || _(Le[ve], Pe, Le[ve].valueOf), N(Le, pe), ne[T] = !0;
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
      var n, o, r, t = e("d039"), a = e("e163"), u = e("9112"), s = e("5135"), c = e("b622"), l = e("c430"), f = c("iterator"), g = !1, p = function() {
        return this;
      };
      [].keys && (r = [].keys(), "next" in r ? (o = a(a(r)), o !== Object.prototype && (n = o)) : g = !0);
      var v = n == null || t(function() {
        var h = {};
        return n[f].call(h) !== h;
      });
      v && (n = {}), l && !v || s(n, f) || u(n, f, p), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: g };
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
      var n = e("c532"), o = e("467f"), r = e("7aac"), t = e("30b5"), a = e("83b9"), u = e("c345"), s = e("3934"), c = e("2d83");
      i.exports = function(l) {
        return new Promise(function(f, g) {
          var p = l.data, v = l.headers;
          n.isFormData(p) && delete v["Content-Type"];
          var h = new XMLHttpRequest();
          if (l.auth) {
            var m = l.auth.username || "", y = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            v.Authorization = "Basic " + btoa(m + ":" + y);
          }
          var S = a(l.baseURL, l.url);
          if (h.open(l.method.toUpperCase(), t(S, l.params, l.paramsSerializer), !0), h.timeout = l.timeout, h.onreadystatechange = function() {
            if (h && h.readyState === 4 && (h.status !== 0 || h.responseURL && h.responseURL.indexOf("file:") === 0)) {
              var x = "getAllResponseHeaders" in h ? u(h.getAllResponseHeaders()) : null, w = l.responseType && l.responseType !== "text" ? h.response : h.responseText, b = { data: w, status: h.status, statusText: h.statusText, headers: x, config: l, request: h };
              o(f, g, b), h = null;
            }
          }, h.onabort = function() {
            h && (g(c("Request aborted", l, "ECONNABORTED", h)), h = null);
          }, h.onerror = function() {
            g(c("Network Error", l, null, h)), h = null;
          }, h.ontimeout = function() {
            var x = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (x = l.timeoutErrorMessage), g(c(x, l, "ECONNABORTED", h)), h = null;
          }, n.isStandardBrowserEnv()) {
            var C = (l.withCredentials || s(S)) && l.xsrfCookieName ? r.read(l.xsrfCookieName) : void 0;
            C && (v[l.xsrfHeaderName] = C);
          }
          if ("setRequestHeader" in h && n.forEach(v, function(x, w) {
            typeof p > "u" && w.toLowerCase() === "content-type" ? delete v[w] : h.setRequestHeader(w, x);
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
      var n, o, r, t, a, u, s, c, l = e("da84"), f = e("06cf").f, g = e("2cf4").set, p = e("1cdc"), v = e("a4b4"), h = e("605d"), m = l.MutationObserver || l.WebKitMutationObserver, y = l.document, S = l.process, C = l.Promise, x = f(l, "queueMicrotask"), w = x && x.value;
      w || (n = function() {
        var b, E;
        for (h && (b = S.domain) && b.exit(); o; ) {
          E = o.fn, o = o.next;
          try {
            E();
          } catch (O) {
            throw o ? t() : r = void 0, O;
          }
        }
        r = void 0, b && b.enter();
      }, p || h || v || !m || !y ? C && C.resolve ? (s = C.resolve(void 0), c = s.then, t = function() {
        c.call(s, n);
      }) : t = h ? function() {
        S.nextTick(n);
      } : function() {
        g.call(l, n);
      } : (a = !0, u = y.createTextNode(""), new m(n).observe(u, { characterData: !0 }), t = function() {
        u.data = a = !a;
      })), i.exports = w || function(b) {
        var E = { fn: b, next: void 0 };
        r && (r.next = E), o || (o = E, t()), r = E;
      };
    }, b622: function(i, d, e) {
      var n = e("da84"), o = e("5692"), r = e("5135"), t = e("90e3"), a = e("4930"), u = e("fdbf"), s = o("wks"), c = n.Symbol, l = u ? c : c && c.withoutSetter || t;
      i.exports = function(f) {
        return r(s, f) && (a || typeof s[f] == "string") || (a && r(c, f) ? s[f] = c[f] : s[f] = l("Symbol." + f)), s[f];
      };
    }, b64b: function(i, d, e) {
      var n = e("23e7"), o = e("7b0b"), r = e("df75"), t = e("d039"), a = t(function() {
        r(1);
      });
      n({ target: "Object", stat: !0, forced: a }, { keys: function(u) {
        return r(o(u));
      } });
    }, b680: function(i, d, e) {
      var n = e("23e7"), o = e("a691"), r = e("408a"), t = e("1148"), a = e("d039"), u = 1 .toFixed, s = Math.floor, c = function(h, m, y) {
        return m === 0 ? y : m % 2 === 1 ? c(h, m - 1, y * h) : c(h * h, m / 2, y);
      }, l = function(h) {
        for (var m = 0, y = h; y >= 4096; ) m += 12, y /= 4096;
        for (; y >= 2; ) m += 1, y /= 2;
        return m;
      }, f = function(h, m, y) {
        for (var S = -1, C = y; ++S < 6; ) C += m * h[S], h[S] = C % 1e7, C = s(C / 1e7);
      }, g = function(h, m) {
        for (var y = 6, S = 0; --y >= 0; ) S += h[y], h[y] = s(S / m), S = S % m * 1e7;
      }, p = function(h) {
        for (var m = 6, y = ""; --m >= 0; ) if (y !== "" || m === 0 || h[m] !== 0) {
          var S = String(h[m]);
          y = y === "" ? S : y + t.call("0", 7 - S.length) + S;
        }
        return y;
      }, v = u && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !a(function() {
        u.call({});
      });
      n({ target: "Number", proto: !0, forced: v }, { toFixed: function(h) {
        var m, y, S, C, x = r(this), w = o(h), b = [0, 0, 0, 0, 0, 0], E = "", O = "0";
        if (w < 0 || w > 20) throw RangeError("Incorrect fraction digits");
        if (x != x) return "NaN";
        if (x <= -1e21 || x >= 1e21) return String(x);
        if (x < 0 && (E = "-", x = -x), x > 1e-21) if (m = l(x * c(2, 69, 1)) - 69, y = m < 0 ? x * c(2, -m, 1) : x / c(2, m, 1), y *= 4503599627370496, m = 52 - m, m > 0) {
          for (f(b, 0, y), S = w; S >= 7; ) f(b, 1e7, 0), S -= 7;
          for (f(b, c(10, S, 1), 0), S = m - 1; S >= 23; ) g(b, 1 << 23), S -= 23;
          g(b, 1 << S), f(b, 1, 1), g(b, 2), O = p(b);
        } else f(b, 0, y), f(b, 1 << -m, 0), O = p(b) + t.call("0", w);
        return w > 0 ? (C = O.length, O = E + (C <= w ? "0." + t.call("0", w - C) + O : O.slice(0, C - w) + "." + O.slice(C - w))) : O = E + O, O;
      } });
    }, b727: function(i, d, e) {
      var n = e("0366"), o = e("44ad"), r = e("7b0b"), t = e("50c4"), a = e("65f0"), u = [].push, s = function(c) {
        var l = c == 1, f = c == 2, g = c == 3, p = c == 4, v = c == 6, h = c == 7, m = c == 5 || v;
        return function(y, S, C, x) {
          for (var w, b, E = r(y), O = o(E), A = n(S, C, 3), _ = t(O.length), M = 0, V = x || a, Y = l ? V(y, _) : f || h ? V(y, 0) : void 0; _ > M; M++) if ((m || M in O) && (w = O[M], b = A(w, M, E), c)) if (l) Y[M] = b;
          else if (b) switch (c) {
            case 3:
              return !0;
            case 5:
              return w;
            case 6:
              return M;
            case 2:
              u.call(Y, w);
          }
          else switch (c) {
            case 4:
              return !1;
            case 7:
              u.call(Y, w);
          }
          return v ? -1 : g || p ? p : Y;
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
`), function(c) {
          if (u = c.indexOf(":"), t = n.trim(c.substr(0, u)).toLowerCase(), a = n.trim(c.substr(u + 1)), t) {
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
      function r(_) {
        return o.call(_) === "[object Array]";
      }
      function t(_) {
        return typeof _ > "u";
      }
      function a(_) {
        return _ !== null && !t(_) && _.constructor !== null && !t(_.constructor) && typeof _.constructor.isBuffer == "function" && _.constructor.isBuffer(_);
      }
      function u(_) {
        return o.call(_) === "[object ArrayBuffer]";
      }
      function s(_) {
        return typeof FormData < "u" && _ instanceof FormData;
      }
      function c(_) {
        var M;
        return M = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(_) : _ && _.buffer && _.buffer instanceof ArrayBuffer, M;
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
        if (o.call(_) !== "[object Object]") return !1;
        var M = Object.getPrototypeOf(_);
        return M === null || M === Object.prototype;
      }
      function v(_) {
        return o.call(_) === "[object Date]";
      }
      function h(_) {
        return o.call(_) === "[object File]";
      }
      function m(_) {
        return o.call(_) === "[object Blob]";
      }
      function y(_) {
        return o.call(_) === "[object Function]";
      }
      function S(_) {
        return g(_) && y(_.pipe);
      }
      function C(_) {
        return typeof URLSearchParams < "u" && _ instanceof URLSearchParams;
      }
      function x(_) {
        return _.replace(/^\s*/, "").replace(/\s*$/, "");
      }
      function w() {
        return (typeof navigator > "u" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window < "u" && typeof document < "u";
      }
      function b(_, M) {
        if (_ !== null && typeof _ < "u") if (typeof _ != "object" && (_ = [_]), r(_)) for (var V = 0, Y = _.length; V < Y; V++) M.call(null, _[V], V, _);
        else for (var ne in _) Object.prototype.hasOwnProperty.call(_, ne) && M.call(null, _[ne], ne, _);
      }
      function E() {
        var _ = {};
        function M(ne, H) {
          p(_[H]) && p(ne) ? _[H] = E(_[H], ne) : p(ne) ? _[H] = E({}, ne) : r(ne) ? _[H] = ne.slice() : _[H] = ne;
        }
        for (var V = 0, Y = arguments.length; V < Y; V++) b(arguments[V], M);
        return _;
      }
      function O(_, M, V) {
        return b(M, function(Y, ne) {
          _[ne] = V && typeof Y == "function" ? n(Y, V) : Y;
        }), _;
      }
      function A(_) {
        return _.charCodeAt(0) === 65279 && (_ = _.slice(1)), _;
      }
      i.exports = { isArray: r, isArrayBuffer: u, isBuffer: a, isFormData: s, isArrayBufferView: c, isString: l, isNumber: f, isObject: g, isPlainObject: p, isUndefined: t, isDate: v, isFile: h, isBlob: m, isFunction: y, isStream: S, isURLSearchParams: C, isStandardBrowserEnv: w, forEach: b, merge: E, extend: O, trim: x, stripBOM: A };
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
        var s, c = o(a), l = 0, f = [];
        for (s in c) !n(t, s) && n(c, s) && f.push(s);
        for (; u.length > l; ) n(c, s = u[l++]) && (~r(f, s) || f.push(s));
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
      function u(c) {
        var l = new r(c), f = o(r.prototype.request, l);
        return n.extend(f, r.prototype, l), n.extend(f, l), f;
      }
      var s = u(a);
      s.Axios = r, s.create = function(c) {
        return u(t(s.defaults, c));
      }, s.Cancel = e("7a77"), s.CancelToken = e("8df4"), s.isCancel = e("2e67"), s.all = function(c) {
        return Promise.all(c);
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
        return function(s, c, l, f) {
          n(c);
          var g = o(s), p = r(g), v = t(g.length), h = u ? v - 1 : 0, m = u ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (h in p) {
              f = p[h], h += m;
              break;
            }
            if (h += m, u ? h < 0 : v <= h) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; u ? h >= 0 : v > h; h += m) h in p && (f = c(f, p[h], h, g));
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
      }), c = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), l = r("replace"), f = function() {
        return !!/./[l] && /./[l]("a", "$0") === "";
      }(), g = !o(function() {
        var p = /(?:)/, v = p.exec;
        p.exec = function() {
          return v.apply(this, arguments);
        };
        var h = "ab".split(p);
        return h.length !== 2 || h[0] !== "a" || h[1] !== "b";
      });
      i.exports = function(p, v, h, m) {
        var y = r(p), S = !o(function() {
          var O = {};
          return O[y] = function() {
            return 7;
          }, ""[p](O) != 7;
        }), C = S && !o(function() {
          var O = !1, A = /a/;
          return p === "split" && (A = {}, A.constructor = {}, A.constructor[u] = function() {
            return A;
          }, A.flags = "", A[y] = /./[y]), A.exec = function() {
            return O = !0, null;
          }, A[y](""), !O;
        });
        if (!S || !C || p === "replace" && (!s || !c || f) || p === "split" && !g) {
          var x = /./[y], w = h(y, ""[p], function(O, A, _, M, V) {
            return A.exec === t ? S && !V ? { done: !0, value: x.call(A, _, M) } : { done: !0, value: O.call(_, A, M) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: c, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), b = w[0], E = w[1];
          n(String.prototype, p, b), n(RegExp.prototype, y, v == 2 ? function(O, A) {
            return E.call(O, this, A);
          } : function(O) {
            return E.call(O, this);
          });
        }
        m && a(RegExp.prototype[y], "sham", !0);
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
        for (var c, l, f = t(s), g = a.f, p = r(f), v = {}, h = 0; p.length > h; ) l = g(f, c = p[h++]), l !== void 0 && u(v, c, l);
        return v;
      } });
    }, ddb0: function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("e260"), t = e("9112"), a = e("b622"), u = a("iterator"), s = a("toStringTag"), c = r.values;
      for (var l in o) {
        var f = n[l], g = f && f.prototype;
        if (g) {
          if (g[u] !== c) try {
            t(g, u, c);
          } catch {
            g[u] = c;
          }
          if (g[s] || t(g, s, l), o[l]) {
            for (var p in r) if (g[p] !== r[p]) try {
              t(g, p, r[p]);
            } catch {
              g[p] = r[p];
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
          for (var c = 0, l = u.length - 1; l >= 0; l--) {
            var f = u[l];
            f === "." ? u.splice(l, 1) : f === ".." ? (u.splice(l, 1), c++) : c && (u.splice(l, 1), c--);
          }
          if (s) for (; c--; c) u.unshift("..");
          return u;
        }
        function r(u) {
          typeof u != "string" && (u += "");
          var s, c = 0, l = -1, f = !0;
          for (s = u.length - 1; s >= 0; --s) if (u.charCodeAt(s) === 47) {
            if (!f) {
              c = s + 1;
              break;
            }
          } else l === -1 && (f = !1, l = s + 1);
          return l === -1 ? "" : u.slice(c, l);
        }
        function t(u, s) {
          if (u.filter) return u.filter(s);
          for (var c = [], l = 0; l < u.length; l++) s(u[l], l, u) && c.push(u[l]);
          return c;
        }
        d.resolve = function() {
          for (var u = "", s = !1, c = arguments.length - 1; c >= -1 && !s; c--) {
            var l = c >= 0 ? arguments[c] : n.cwd();
            if (typeof l != "string") throw new TypeError("Arguments to path.resolve must be strings");
            l && (u = l + "/" + u, s = l.charAt(0) === "/");
          }
          return u = o(t(u.split("/"), function(f) {
            return !!f;
          }), !s).join("/"), (s ? "/" : "") + u || ".";
        }, d.normalize = function(u) {
          var s = d.isAbsolute(u), c = a(u, -1) === "/";
          return u = o(t(u.split("/"), function(l) {
            return !!l;
          }), !s).join("/"), u || s || (u = "."), u && c && (u += "/"), (s ? "/" : "") + u;
        }, d.isAbsolute = function(u) {
          return u.charAt(0) === "/";
        }, d.join = function() {
          var u = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(u, function(s, c) {
            if (typeof s != "string") throw new TypeError("Arguments to path.join must be strings");
            return s;
          }).join("/"));
        }, d.relative = function(u, s) {
          function c(m) {
            for (var y = 0; y < m.length && m[y] === ""; y++) ;
            for (var S = m.length - 1; S >= 0 && m[S] === ""; S--) ;
            return y > S ? [] : m.slice(y, S - y + 1);
          }
          u = d.resolve(u).substr(1), s = d.resolve(s).substr(1);
          for (var l = c(u.split("/")), f = c(s.split("/")), g = Math.min(l.length, f.length), p = g, v = 0; v < g; v++) if (l[v] !== f[v]) {
            p = v;
            break;
          }
          var h = [];
          for (v = p; v < l.length; v++) h.push("..");
          return h = h.concat(f.slice(p)), h.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(u) {
          if (typeof u != "string" && (u += ""), u.length === 0) return ".";
          for (var s = u.charCodeAt(0), c = s === 47, l = -1, f = !0, g = u.length - 1; g >= 1; --g) if (s = u.charCodeAt(g), s === 47) {
            if (!f) {
              l = g;
              break;
            }
          } else f = !1;
          return l === -1 ? c ? "/" : "." : c && l === 1 ? "/" : u.slice(0, l);
        }, d.basename = function(u, s) {
          var c = r(u);
          return s && c.substr(-1 * s.length) === s && (c = c.substr(0, c.length - s.length)), c;
        }, d.extname = function(u) {
          typeof u != "string" && (u += "");
          for (var s = -1, c = 0, l = -1, f = !0, g = 0, p = u.length - 1; p >= 0; --p) {
            var v = u.charCodeAt(p);
            if (v !== 47) l === -1 && (f = !1, l = p + 1), v === 46 ? s === -1 ? s = p : g !== 1 && (g = 1) : s !== -1 && (g = -1);
            else if (!f) {
              c = p + 1;
              break;
            }
          }
          return s === -1 || l === -1 || g === 0 || g === 1 && s === l - 1 && s === c + 1 ? "" : u.slice(s, l);
        };
        var a = "ab".substr(-1) === "b" ? function(u, s, c) {
          return u.substr(s, c);
        } : function(u, s, c) {
          return s < 0 && (s = u.length + s), u.substr(s, c);
        };
      }).call(this, e("4362"));
    }, e017: function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          var o = function(v) {
            var h = v.id, m = v.viewBox, y = v.content;
            this.id = h, this.viewBox = m, this.content = y;
          };
          o.prototype.stringify = function() {
            return this.content;
          }, o.prototype.toString = function() {
            return this.stringify();
          }, o.prototype.destroy = function() {
            var v = this;
            ["id", "viewBox", "content"].forEach(function(h) {
              return delete v[h];
            });
          };
          var r = function(v) {
            var h = !!document.importNode, m = new DOMParser().parseFromString(v, "image/svg+xml").documentElement;
            return h ? document.importNode(m, !0) : m;
          };
          function t(v, h) {
            return h = { exports: {} }, v(h, h.exports), h.exports;
          }
          var a = t(function(v, h) {
            (function(m, y) {
              v.exports = y();
            })(0, function() {
              function m(b) {
                var E = b && typeof b == "object";
                return E && Object.prototype.toString.call(b) !== "[object RegExp]" && Object.prototype.toString.call(b) !== "[object Date]";
              }
              function y(b) {
                return Array.isArray(b) ? [] : {};
              }
              function S(b, E) {
                var O = E && E.clone === !0;
                return O && m(b) ? w(y(b), b, E) : b;
              }
              function C(b, E, O) {
                var A = b.slice();
                return E.forEach(function(_, M) {
                  typeof A[M] > "u" ? A[M] = S(_, O) : m(_) ? A[M] = w(b[M], _, O) : b.indexOf(_) === -1 && A.push(S(_, O));
                }), A;
              }
              function x(b, E, O) {
                var A = {};
                return m(b) && Object.keys(b).forEach(function(_) {
                  A[_] = S(b[_], O);
                }), Object.keys(E).forEach(function(_) {
                  m(E[_]) && b[_] ? A[_] = w(b[_], E[_], O) : A[_] = S(E[_], O);
                }), A;
              }
              function w(b, E, O) {
                var A = Array.isArray(E), _ = O || { arrayMerge: C }, M = _.arrayMerge || C;
                return A ? Array.isArray(b) ? M(b, E, O) : S(E, O) : x(b, E, O);
              }
              return w.all = function(b, E) {
                if (!Array.isArray(b) || b.length < 2) throw new Error("first argument should be an array with at least two elements");
                return b.reduce(function(O, A) {
                  return w(O, A, E);
                });
              }, w;
            });
          }), u = t(function(v, h) {
            var m = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            h.default = m, v.exports = h.default;
          }), s = function(v) {
            return Object.keys(v).map(function(h) {
              var m = v[h].toString().replace(/"/g, "&quot;");
              return h + '="' + m + '"';
            }).join(" ");
          }, c = u.svg, l = u.xlink, f = {};
          f[c.name] = c.uri, f[l.name] = l.uri;
          var g = function(v, h) {
            v === void 0 && (v = "");
            var m = a(f, {}), y = s(m);
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
              var S = typeof y == "string" ? document.querySelector(y) : y, C = this.render();
              return this.node = C, S.appendChild(C), C;
            }, h.prototype.render = function() {
              var y = this.stringify();
              return r(g(y)).childNodes[0];
            }, h.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(h.prototype, m), h;
          }(o);
          return p;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("da84"), t = e("5135"), a = e("861d"), u = e("9bf2").f, s = e("e893"), c = r.Symbol;
      if (o && typeof c == "function" && (!("description" in c.prototype) || c().description !== void 0)) {
        var l = {}, f = function() {
          var m = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), y = this instanceof f ? new c(m) : m === void 0 ? c() : c(m);
          return m === "" && (l[y] = !0), y;
        };
        s(f, c);
        var g = f.prototype = c.prototype;
        g.constructor = f;
        var p = g.toString, v = String(c("test")) == "Symbol(test)", h = /^Symbol\((.*)\)[^)]+$/;
        u(g, "description", { configurable: !0, get: function() {
          var m = a(this) ? this.valueOf() : this, y = p.call(m);
          if (t(l, m)) return "";
          var S = v ? y.slice(7, -1) : y.replace(h, "$1");
          return S === "" ? void 0 : S;
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
      var n = e("fc6a"), o = e("44d2"), r = e("3f8c"), t = e("69f3"), a = e("7dd0"), u = "Array Iterator", s = t.set, c = t.getterFor(u);
      i.exports = a(Array, "Array", function(l, f) {
        s(this, { type: u, target: n(l), index: 0, kind: f });
      }, function() {
        var l = c(this), f = l.target, g = l.kind, p = l.index++;
        return !f || p >= f.length ? (l.target = void 0, { value: void 0, done: !0 }) : g == "keys" ? { value: p, done: !1 } : g == "values" ? { value: f[p], done: !1 } : { value: [p, f[p]], done: !1 };
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
      n({ target: "Object", stat: !0, forced: s, sham: !a }, { getOwnPropertyDescriptor: function(c, l) {
        return t(r(c), l);
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
      var n, o, r, t, a = e("23e7"), u = e("c430"), s = e("da84"), c = e("d066"), l = e("fea9"), f = e("6eeb"), g = e("e2cc"), p = e("d44e"), v = e("2626"), h = e("861d"), m = e("1c0b"), y = e("19aa"), S = e("8925"), C = e("2266"), x = e("1c7e"), w = e("4840"), b = e("2cf4").set, E = e("b575"), O = e("cdf9"), A = e("44de"), _ = e("f069"), M = e("e667"), V = e("69f3"), Y = e("94ca"), ne = e("b622"), H = e("605d"), q = e("2d00"), F = ne("species"), L = "Promise", N = V.get, B = V.set, P = V.getterFor(L), T = l, pe = s.TypeError, ve = s.document, Pe = s.process, Be = c("fetch"), Ie = _.f, Ae = Ie, Le = !!(ve && ve.createEvent && s.dispatchEvent), He = typeof PromiseRejectionEvent == "function", at = "unhandledrejection", I = "rejectionhandled", D = 0, Z = 1, W = 2, ee = 1, re = 2, we = Y(L, function() {
        var K = S(T) !== String(T);
        if (!K && (q === 66 || !H && !He) || u && !T.prototype.finally) return !0;
        if (q >= 51 && /native code/.test(T)) return !1;
        var oe = T.resolve(1), ce = function(z) {
          z(function() {
          }, function() {
          });
        }, de = oe.constructor = {};
        return de[F] = ce, !(oe.then(function() {
        }) instanceof ce);
      }), ge = we || !x(function(K) {
        T.all(K).catch(function() {
        });
      }), se = function(K) {
        var oe;
        return !(!h(K) || typeof (oe = K.then) != "function") && oe;
      }, ke = function(K, oe) {
        if (!K.notified) {
          K.notified = !0;
          var ce = K.reactions;
          E(function() {
            for (var de = K.value, z = K.state == Z, te = 0; ce.length > te; ) {
              var ae, fe, Ue, We = ce[te++], tt = z ? We.ok : We.fail, xe = We.resolve, nt = We.reject, Ge = We.domain;
              try {
                tt ? (z || (K.rejection === re && Ve(K), K.rejection = ee), tt === !0 ? ae = de : (Ge && Ge.enter(), ae = tt(de), Ge && (Ge.exit(), Ue = !0)), ae === We.promise ? nt(pe("Promise-chain cycle")) : (fe = se(ae)) ? fe.call(ae, xe, nt) : xe(ae)) : nt(de);
              } catch (yt) {
                Ge && !Ue && Ge.exit(), nt(yt);
              }
            }
            K.reactions = [], K.notified = !1, oe && !K.rejection && $e(K);
          });
        }
      }, Se = function(K, oe, ce) {
        var de, z;
        Le ? (de = ve.createEvent("Event"), de.promise = oe, de.reason = ce, de.initEvent(K, !1, !0), s.dispatchEvent(de)) : de = { promise: oe, reason: ce }, !He && (z = s["on" + K]) ? z(de) : K === at && A("Unhandled promise rejection", ce);
      }, $e = function(K) {
        b.call(s, function() {
          var oe, ce = K.facade, de = K.value, z = je(K);
          if (z && (oe = M(function() {
            H ? Pe.emit("unhandledRejection", de, ce) : Se(at, ce, de);
          }), K.rejection = H || je(K) ? re : ee, oe.error)) throw oe.value;
        });
      }, je = function(K) {
        return K.rejection !== ee && !K.parent;
      }, Ve = function(K) {
        b.call(s, function() {
          var oe = K.facade;
          H ? Pe.emit("rejectionHandled", oe) : Se(I, oe, K.value);
        });
      }, Ye = function(K, oe, ce) {
        return function(de) {
          K(oe, de, ce);
        };
      }, et = function(K, oe, ce) {
        K.done || (K.done = !0, ce && (K = ce), K.value = oe, K.state = W, ke(K, !0));
      }, st = function(K, oe, ce) {
        if (!K.done) {
          K.done = !0, ce && (K = ce);
          try {
            if (K.facade === oe) throw pe("Promise can't be resolved itself");
            var de = se(oe);
            de ? E(function() {
              var z = { done: !1 };
              try {
                de.call(oe, Ye(st, z, K), Ye(et, z, K));
              } catch (te) {
                et(z, te, K);
              }
            }) : (K.value = oe, K.state = Z, ke(K, !1));
          } catch (z) {
            et({ done: !1 }, z, K);
          }
        }
      };
      we && (T = function(K) {
        y(this, T, L), m(K), n.call(this);
        var oe = N(this);
        try {
          K(Ye(st, oe), Ye(et, oe));
        } catch (ce) {
          et(oe, ce);
        }
      }, n = function(K) {
        B(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: D, value: void 0 });
      }, n.prototype = g(T.prototype, { then: function(K, oe) {
        var ce = P(this), de = Ie(w(this, T));
        return de.ok = typeof K != "function" || K, de.fail = typeof oe == "function" && oe, de.domain = H ? Pe.domain : void 0, ce.parent = !0, ce.reactions.push(de), ce.state != D && ke(ce, !1), de.promise;
      }, catch: function(K) {
        return this.then(void 0, K);
      } }), o = function() {
        var K = new n(), oe = N(K);
        this.promise = K, this.resolve = Ye(st, oe), this.reject = Ye(et, oe);
      }, _.f = Ie = function(K) {
        return K === T || K === r ? new o(K) : Ae(K);
      }, u || typeof l != "function" || (t = l.prototype.then, f(l.prototype, "then", function(K, oe) {
        var ce = this;
        return new T(function(de, z) {
          t.call(ce, de, z);
        }).then(K, oe);
      }, { unsafe: !0 }), typeof Be == "function" && a({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(K) {
        return O(T, Be.apply(s, arguments));
      } }))), a({ global: !0, wrap: !0, forced: we }, { Promise: T }), p(T, L, !1, !0), v(L), r = c(L), a({ target: L, stat: !0, forced: we }, { reject: function(K) {
        var oe = Ie(this);
        return oe.reject.call(void 0, K), oe.promise;
      } }), a({ target: L, stat: !0, forced: u || we }, { resolve: function(K) {
        return O(u && this === r ? T : this, K);
      } }), a({ target: L, stat: !0, forced: ge }, { all: function(K) {
        var oe = this, ce = Ie(oe), de = ce.resolve, z = ce.reject, te = M(function() {
          var ae = m(oe.resolve), fe = [], Ue = 0, We = 1;
          C(K, function(tt) {
            var xe = Ue++, nt = !1;
            fe.push(void 0), We++, ae.call(oe, tt).then(function(Ge) {
              nt || (nt = !0, fe[xe] = Ge, --We || de(fe));
            }, z);
          }), --We || de(fe);
        });
        return te.error && z(te.value), ce.promise;
      }, race: function(K) {
        var oe = this, ce = Ie(oe), de = ce.reject, z = M(function() {
          var te = m(oe.resolve);
          C(K, function(ae) {
            te.call(oe, ae).then(ce.resolve, de);
          });
        });
        return z.error && de(z.value), ce.promise;
      } });
    }, e893: function(i, d, e) {
      var n = e("5135"), o = e("56ef"), r = e("06cf"), t = e("9bf2");
      i.exports = function(a, u) {
        for (var s = o(u), c = t.f, l = r.f, f = 0; f < s.length; f++) {
          var g = s[f];
          n(a, g) || c(a, g, l(u, g));
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
      var n = e("d012"), o = e("861d"), r = e("5135"), t = e("9bf2").f, a = e("90e3"), u = e("bb2f"), s = a("meta"), c = 0, l = Object.isExtensible || function() {
        return !0;
      }, f = function(m) {
        t(m, s, { value: { objectID: "O" + ++c, weakData: {} } });
      }, g = function(m, y) {
        if (!o(m)) return typeof m == "symbol" ? m : (typeof m == "string" ? "S" : "P") + m;
        if (!r(m, s)) {
          if (!l(m)) return "F";
          if (!y) return "E";
          f(m);
        }
        return m[s].objectID;
      }, p = function(m, y) {
        if (!r(m, s)) {
          if (!l(m)) return !0;
          if (!y) return !1;
          f(m);
        }
        return m[s].weakData;
      }, v = function(m) {
        return u && h.REQUIRED && l(m) && !r(m, s) && f(m), m;
      }, h = i.exports = { REQUIRED: !1, fastKey: g, getWeakData: p, onFreeze: v };
      n[s] = !0;
    }, f5df: function(i, d, e) {
      var n = e("00ee"), o = e("c6b6"), r = e("b622"), t = r("toStringTag"), a = o(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", u = function(s, c) {
        try {
          return s[c];
        } catch {
        }
      };
      i.exports = n ? o : function(s) {
        var c, l, f;
        return s === void 0 ? "Undefined" : s === null ? "Null" : typeof (l = u(c = Object(s), t)) == "string" ? l : a ? o(c) : (f = o(c)) == "Object" && typeof c.callee == "function" ? "Arguments" : f;
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
      function s(k, U, R, $, Q, ie) {
        var le = Object(t.resolveComponent)("Result"), ue = Object(t.resolveComponent)("DefaultBoard"), he = Object(t.resolveComponent)("HandBoard"), Re = Object(t.resolveComponent)("svg-icon"), De = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: k.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [k.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: U[1] || (U[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", a, [Object(t.createVNode)(le, { data: k.resultVal, onChange: k.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", u, [k.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ue, { key: 0, ref: "defaultBoardRef", onTrigger: k.trigger, onChange: k.change, onTranslate: k.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), k.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(he, { key: 1, onTrigger: k.trigger, onChange: k.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), k.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: k.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(k.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Re, { "icon-class": "drag" })], 4)), [[De]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function c(k, U, R) {
        return U in k ? Object.defineProperty(k, U, { value: R, enumerable: !0, configurable: !0, writable: !0 }) : k[U] = R, k;
      }
      function l(k, U) {
        var R = Object.keys(k);
        if (Object.getOwnPropertySymbols) {
          var $ = Object.getOwnPropertySymbols(k);
          U && ($ = $.filter(function(Q) {
            return Object.getOwnPropertyDescriptor(k, Q).enumerable;
          })), R.push.apply(R, $);
        }
        return R;
      }
      function f(k) {
        for (var U = 1; U < arguments.length; U++) {
          var R = arguments[U] != null ? arguments[U] : {};
          U % 2 ? l(Object(R), !0).forEach(function($) {
            c(k, $, R[$]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(k, Object.getOwnPropertyDescriptors(R)) : l(Object(R)).forEach(function($) {
            Object.defineProperty(k, $, Object.getOwnPropertyDescriptor(R, $));
          });
        }
        return k;
      }
      function g(k, U) {
        (U == null || U > k.length) && (U = k.length);
        for (var R = 0, $ = new Array(U); R < U; R++) $[R] = k[R];
        return $;
      }
      function p(k) {
        if (Array.isArray(k)) return g(k);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function v(k) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(k)) return Array.from(k);
      }
      e("fb6a");
      function h(k, U) {
        if (k) {
          if (typeof k == "string") return g(k, U);
          var R = Object.prototype.toString.call(k).slice(8, -1);
          return R === "Object" && k.constructor && (R = k.constructor.name), R === "Map" || R === "Set" ? Array.from(k) : R === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(R) ? g(k, U) : void 0;
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
      function S(k, U) {
        if (!(k instanceof U)) throw new TypeError("Cannot call a class as a function");
      }
      function C(k, U) {
        for (var R = 0; R < U.length; R++) {
          var $ = U[R];
          $.enumerable = $.enumerable || !1, $.configurable = !0, "value" in $ && ($.writable = !0), Object.defineProperty(k, $.key, $);
        }
      }
      function x(k, U, R) {
        return U && C(k.prototype, U), k;
      }
      var w = function() {
        function k() {
          S(this, k), this.listeners = {};
        }
        return x(k, [{ key: "on", value: function(U, R) {
          var $ = this, Q = this.listeners[U];
          return Q || (Q = []), Q.push(R), this.listeners[U] = Q, function() {
            $.remove(U, R);
          };
        } }, { key: "emit", value: function(U) {
          var R = this.listeners[U];
          if (Array.isArray(R)) {
            for (var $ = arguments.length, Q = new Array($ > 1 ? $ - 1 : 0), ie = 1; ie < $; ie++) Q[ie - 1] = arguments[ie];
            for (var le = 0; le < R.length; le++) {
              var ue = R[le];
              typeof ue == "function" && ue.apply(void 0, Q);
            }
          }
        } }, { key: "remove", value: function(U, R) {
          if (R) {
            var $ = this.listeners[U];
            if (!$) return;
            $ = $.filter(function(Q) {
              return Q !== R;
            }), this.listeners[U] = $;
          } else this.listeners[U] = null, delete this.listeners[U];
        } }]), k;
      }(), b = new w(), E = { mounted: function(k, U, R) {
        var $ = k.parentNode;
        k.onmousedown = function(Q) {
          var ie = Q.clientX - $.offsetLeft, le = Q.clientY - $.offsetTop;
          document.onmousemove = function(ue) {
            var he = ue.clientX - ie, Re = ue.clientY - le;
            $.style.left = he + "px", $.style.top = Re + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, k.ontouchstart = function(Q) {
          var ie = Q.touches[0].pageX, le = Q.touches[0].pageY, ue = ie - $.offsetLeft, he = le - $.offsetTop;
          document.ontouchmove = function(Re) {
            var De = Re.touches[0].pageX, Me = Re.touches[0].pageY, ze = De - ue, vt = Me - he;
            $.style.left = ze + "px", $.style.top = vt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, O = E, A = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var _ = { key: 0, class: "key-board-code-show" }, M = { class: "key-board-result-show" }, V = { class: "key-board-result-show-container" }, Y = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var ne = A(function(k, U, R, $, Q, ie) {
        return k.status === "CN" || k.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: k.color } }, [k.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", _, Object(t.toDisplayString)(k.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", M, [Object(t.createVNode)("div", V, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.showList[k.showIndex], function(le, ue) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ue, onClick: function(he) {
            return k.selectWord(le);
          } }, Object(t.toDisplayString)(ue + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), k.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", Y, [Object(t.createVNode)("span", { style: k.getStyle, onClick: U[1] || (U[1] = function() {
          return k.upper && k.upper.apply(k, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: k.getStyle, onClick: U[2] || (U[2] = function() {
          return k.lower && k.lower.apply(k, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), H = (e("1276"), e("6062"), e("5319"), function(k, U) {
        for (var R = 0, $ = []; R < k.length; ) $.push(k.slice(R, R += U));
        return $;
      }), q = Symbol("KEYBOARD_CONTEXT"), F = function(k) {
        Object(t.provide)(q, k);
      }, L = function() {
        return Object(t.inject)(q);
      }, N = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(k, U) {
        var R = U.emit, $ = L(), Q = Object(t.computed)(function() {
          return { borderTopColor: $ == null ? void 0 : $.color };
        }), ie = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          ie.showIndex !== 0 && (ie.showIndex -= 1);
        }
        function ue() {
          ie.showIndex !== ie.showList.length - 1 && (ie.showIndex += 1);
        }
        function he() {
          ie.showIndex = 0, ie.showList = [], ie.valueList = [], b.emit("resultReset");
        }
        function Re(De) {
          he(), R("change", De);
        }
        return Object(t.watch)(function() {
          return k.data;
        }, function(De) {
          var Me;
          ie.showIndex = 0, ie.valueList = (De == null || (Me = De.value) === null || Me === void 0 ? void 0 : Me.split("")) || [], ie.valueList.length !== 0 ? ie.showList = H(ie.valueList, 11) : ie.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          b.on("keyBoardChange", function(De) {
            b.emit("updateBound"), ie.status = De, he();
          }), b.on("getWordsFromServer", function(De) {
            var Me = Array.from(new Set(De.replace(/\s+/g, "").split("")));
            ie.valueList = Me, ie.showList = H(Me, 11);
          });
        }), Object(t.onUnmounted)(function() {
          b.remove("keyBoardChange"), b.remove("getWordsFromServer");
        }), f({ color: $ == null ? void 0 : $.color, upper: le, lower: ue, getStyle: Q, selectWord: Re }, Object(t.toRefs)(ie));
      } });
      e("e66c"), N.render = ne, N.__scopeId = "data-v-02e63132";
      var B = N, P = e("bc3a"), T = e.n(P), pe = 15e3, ve = function(k) {
        T.a.defaults.baseURL = k, T.a.defaults.timeout = pe, T.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Pe(k, U, R, $, Q, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: k.color } }, [Object(t.createVNode)("use", { "xlink:href": k.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Be = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(k) {
        var U = L(), R = Object(t.computed)(function() {
          return "#icon-".concat(k.iconClass);
        });
        return { color: U == null ? void 0 : U.color, iconName: R };
      } });
      e("38cd"), Be.render = Pe;
      var Ie = Be, Ae = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Le = { class: "hand-write-board" }, He = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var at = Ae(function(k, U, R, $, Q, ie) {
        var le = Object(t.resolveComponent)("PaintBoard"), ue = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Le, [Object(t.createVNode)(le, { lib: k.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", He, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.handBoardOperList, function(he) {
          return Object(t.openBlock)(), Object(t.createBlock)(ue, { key: he.type, type: he.type, data: he.data, isCn: k.isCn, onClick: k.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), I = { class: "paint-board" };
      function D(k, U, R, $, Q, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", I, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: k.width, height: k.height, onTouchstart: U[1] || (U[1] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onTouchmove: U[2] || (U[2] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onTouchend: U[3] || (U[3] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMousedown: U[4] || (U[4] = function() {
          return k.down && k.down.apply(k, arguments);
        }), onMousemove: U[5] || (U[5] = function() {
          return k.move && k.move.apply(k, arguments);
        }), onMouseup: U[6] || (U[6] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }), onMouseleave: U[7] || (U[7] = function() {
          return k.mouseup && k.mouseup.apply(k, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function Z(k, U, R, $, Q, ie, le) {
        try {
          var ue = k[ie](le), he = ue.value;
        } catch (Re) {
          return void R(Re);
        }
        ue.done ? U(he) : Promise.resolve(he).then($, Q);
      }
      function W(k) {
        return function() {
          var U = this, R = arguments;
          return new Promise(function($, Q) {
            var ie = k.apply(U, R);
            function le(he) {
              Z(ie, $, Q, le, ue, "next", he);
            }
            function ue(he) {
              Z(ie, $, Q, le, ue, "throw", he);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var ee, re, we = function() {
        var k = W(regeneratorRuntime.mark(function U(R, $, Q, ie) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, T.a.post("", { lib: ie, lpXis: R, lpYis: $, lpCis: Q });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, U);
        }));
        return function(U, R, $, Q) {
          return k.apply(this, arguments);
        };
      }(), ge = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(k) {
        var U = L(), R = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), $ = Object(t.ref)(null);
        function Q() {
          return ie.apply(this, arguments);
        }
        function ie() {
          return ie = W(regeneratorRuntime.mark(function Ce() {
            var Ke, Fe;
            return regeneratorRuntime.wrap(function(Xe) {
              for (; ; ) switch (Xe.prev = Xe.next) {
                case 0:
                  return Xe.next = 2, we(R.clickX, R.clickY, R.clickC, k.lib);
                case 2:
                  Ke = Xe.sent, Fe = Ke.data, b.emit("getWordsFromServer", (Fe == null ? void 0 : Fe.v) || "");
                case 5:
                case "end":
                  return Xe.stop();
              }
            }, Ce);
          })), ie.apply(this, arguments);
        }
        function le() {
          $.value && ee && (R.clickX = [], R.clickY = [], R.clickC = [], ee.clearRect(0, 0, R.width, R.height));
        }
        function ue(Ce) {
          if (Ce.type.includes("mouse")) {
            var Ke = Ce;
            return Math.floor(Ke.clientX - R.x);
          }
          if (Ce.type.includes("touch")) {
            var Fe, Xe = Ce;
            return Math.floor(((Fe = Xe.targetTouches[0]) === null || Fe === void 0 ? void 0 : Fe.clientX) - R.x);
          }
          return 0;
        }
        function he(Ce) {
          if (Ce.type.includes("mouse")) {
            var Ke = Ce;
            return Math.floor(Ke.clientY - R.y);
          }
          if (Ce.type.includes("touch")) {
            var Fe, Xe = Ce;
            return Math.floor(((Fe = Xe.targetTouches[0]) === null || Fe === void 0 ? void 0 : Fe.clientY) - R.y);
          }
          return 0;
        }
        function Re(Ce) {
          if (ee) {
            R.isMouseDown = !0;
            var Ke = ue(Ce), Fe = he(Ce);
            clearTimeout(re), R.oldX = Ke, R.oldY = Fe, ee.beginPath();
          }
        }
        function De(Ce) {
          if (ee && (Ce.preventDefault(), R.isMouseDown)) {
            var Ke = ue(Ce), Fe = he(Ce);
            R.clickX.push(Ke), R.clickY.push(Fe), R.clickC.push(0), ee.strokeStyle = U == null ? void 0 : U.color, ee.fillStyle = U == null ? void 0 : U.color, ee.lineWidth = 4, ee.lineCap = "round", ee.moveTo(R.oldX, R.oldY), ee.lineTo(Ke, Fe), ee.stroke(), R.oldX = Ke, R.oldY = Fe;
          }
        }
        function Me() {
          R.isMouseDown && (R.isMouseDown = !1, re = setTimeout(function() {
            le();
          }, 1500), R.clickC.pop(), R.clickC.push(1), Q());
        }
        function ze() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ce = document.querySelector(".paint-board").getBoundingClientRect();
              R.x = Ce.x, R.y = Ce.y, R.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), R.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function vt() {
          var Ce;
          ee = (Ce = $.value) === null || Ce === void 0 ? void 0 : Ce.getContext("2d"), le(), ze(), window.addEventListener("animationend", ze), window.addEventListener("resize", ze), window.addEventListener("scroll", ze);
        }
        return Object(t.onMounted)(function() {
          vt(), b.on("updateBound", function() {
            ze();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", ze), window.removeEventListener("resize", ze), window.removeEventListener("scroll", ze), b.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(R)), {}, { move: De, down: Re, mouseup: Me, canvasRef: $ });
      } });
      ge.render = D;
      var se = ge;
      function ke(k, U, R, $, Q, ie) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(k.type), { "key-board-button-active": k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" }], style: k.getStyle, onClick: U[1] || (U[1] = function() {
          return k.click && k.click.apply(k, arguments);
        }), onMouseenter: U[2] || (U[2] = function(ue) {
          return k.isHoverStatus = !0;
        }), onMouseleave: U[3] || (U[3] = function(ue) {
          return k.isHoverStatus = !1;
        }) }, [k.type === "upper" || k.type === "delete" || k.type === "handwrite" || k.type === "close" || k.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": k.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: k.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var Se = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: Ie }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(k, U) {
        var R = U.emit, $ = L(), Q = Object(t.ref)(!1), ie = Object(t.computed)(function() {
          return k.type === "change2lang" ? k.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : k.isUpper ? k.data.toUpperCase() : k.data;
        }), le = Object(t.computed)(function() {
          return k.isUpper && k.type === "upper" || k.isNum && k.type === "change2num" || k.isSymbol && k.type === "#+=" || Q.value ? { color: "#f5f5f5", background: $ == null ? void 0 : $.color } : { color: $ == null ? void 0 : $.color, background: "#f5f5f5" };
        });
        function ue(he) {
          he.preventDefault(), R("click", { data: k.isUpper ? k.data.toUpperCase() : k.data, type: k.type });
        }
        return { isHoverStatus: Q, getStyle: le, getCode: ie, click: ue };
      } });
      e("de23"), Se.render = ke;
      var $e = Se, je = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: se, KeyCodeButton: $e }, setup: function(k, U) {
        var R = U.emit, $ = L(), Q = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ie(le) {
          var ue = le.data, he = le.type;
          switch (he) {
            case "close":
              $ == null || $.closeKeyBoard();
              break;
            case "back":
              $ == null || $.changeDefaultBoard(), b.emit("resultReset"), b.emit("keyBoardChange", Q.isCn && "CN");
              break;
            case "change2lang":
              Q.isCn = !Q.isCn;
              break;
            case "delete":
              R("trigger", { data: ue, type: he });
              break;
          }
        }
        return f({ click: ie }, Object(t.toRefs)(Q));
      } });
      e("9aaf"), je.render = at, je.__scopeId = "data-v-1b5e0983";
      var Ve = je, Ye = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var et = { class: "default-key-board" }, st = { class: "line line4" };
      Object(t.popScopeId)();
      var K = Ye(function(k, U, R, $, Q, ie) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", et, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.lineList, function(ue, he) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(he + 1)], key: he }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ue, function(Re) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: k.isUpper, key: Re, type: Re, data: Re, isSymbol: k.isSymbol, onClick: k.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", st, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(k.line4, function(ue) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ue.type, type: ue.type, data: ue.data, isCn: k.isCn, isNum: k.isNum, onClick: k.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), oe = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), ce = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, de = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, z = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], te = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: $e }, emits: ["translate", "trigger", "change"], setup: function(k, U) {
        var R = U.emit, $ = L(), Q = Object(t.reactive)({ lineList: [ce.line1, ce.line2, ce.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ie() {
          var ue;
          Q.line4 = JSON.parse(JSON.stringify(z)), $ != null && (ue = $.modeList) !== null && ue !== void 0 && ue.find(function(he) {
            return he === "handwrite";
          }) && $ !== null && $ !== void 0 && $.handApi && Q.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ue) {
          var he = ue.data, Re = ue.type;
          switch (Re) {
            case "close":
              Q.oldVal = "", $ == null || $.closeKeyBoard();
              break;
            case "upper":
              Q.oldVal = "", Q.isUpper = !Q.isUpper;
              break;
            case "change2lang":
              Q.isCn = !Q.isCn, Q.isNum || Q.isSymbol || b.emit("keyBoardChange", Q.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (Q.isNum = !Q.isNum, Q.isSymbol = !1, Q.isNum) {
                var De;
                b.emit("keyBoardChange", "number");
                var Me = JSON.parse(JSON.stringify(de.line3));
                $ != null && (De = $.modeList) !== null && De !== void 0 && De.find(function(ze) {
                  return ze === "symbol";
                }) || (Me.shift(), Me.unshift("+")), Q.lineList = [de.line1, de.line2, Me];
              } else b.emit("keyBoardChange", Q.isCn ? "CN" : "EN"), Q.lineList = [ce.line1, ce.line2, ce.line3];
              break;
            case "#+=":
              Q.isSymbol = !Q.isSymbol, Q.isSymbol ? (b.emit("keyBoardChange", "symbol"), Q.lineList = [oe.line1, oe.line2, oe.line3]) : (b.emit("keyBoardChange", "number"), Q.lineList = [de.line1, de.line2, de.line3]);
              break;
            case "handwrite":
            case "delete":
              Q.isCn && Re === "delete" && Q.oldVal ? (Q.oldVal = Q.oldVal.substr(0, Q.oldVal.length - 1), R("translate", Q.oldVal)) : (Re === "handwrite" && b.emit("keyBoardChange", "handwrite"), R("trigger", { data: he, type: Re }));
              break;
            default:
              !Q.isCn || Q.isNum || Q.isSymbol ? R("change", he) : (R("translate", Q.oldVal + he), Q.oldVal = Q.oldVal + he);
              break;
          }
        }
        return ie(), Object(t.onMounted)(function() {
          b.on("resultReset", function() {
            Q.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(Q)), {}, { click: le });
      } });
      e("f8b0"), te.render = K, te.__scopeId = "data-v-4b78e5a1";
      var ae = te, fe = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ue = e("ec57"), We = function(k) {
        return k.keys().map(k);
      };
      We(Ue);
      var tt = [], xe = null, nt = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: O }, components: { Result: B, SvgIcon: Ie, HandBoard: Ve, DefaultBoard: ae }, setup: function(k, U) {
        var R = U.emit, $ = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), Q = Object(t.ref)(null);
        function ie(_e) {
          var Oe, Te;
          switch (Object(t.nextTick)(function() {
            b.emit("keyBoardChange", "CN");
          }), _e) {
            case "en":
              $.showMode = "default", Object(t.nextTick)(function() {
                var Ne;
                (Ne = Q.value) === null || Ne === void 0 || Ne.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              $.showMode = "default", Object(t.nextTick)(function() {
                var Ne;
                (Ne = Q.value) === null || Ne === void 0 || Ne.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Oe = k.modeList) !== null && Oe !== void 0 && Oe.find(function(Ne) {
                return Ne === "handwrite";
              }) && k.handApi ? ($.showMode = "handwrite", Object(t.nextTick)(function() {
                b.emit("keyBoardChange", "handwrite");
              })) : $.showMode = "default";
              break;
            case "symbol":
              $.showMode = "default", (Te = k.modeList) !== null && Te !== void 0 && Te.find(function(Ne) {
                return Ne === "symbol";
              }) && Object(t.nextTick)(function() {
                var Ne, ot;
                (Ne = Q.value) === null || Ne === void 0 || Ne.click({ data: ".?123", type: "change2num" }), (ot = Q.value) === null || ot === void 0 || ot.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              $.showMode = "default";
              break;
          }
        }
        function le(_e) {
          if ($.visible = !0, xe = _e.target, ie(xe.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Oe = document.querySelector(".key-board-modal");
            Oe.style.display = "block";
          }
        }
        function ue() {
          if (xe && xe.blur(), xe = null, $.visible = !1, R("closed"), $.showMode = "default", $.resultVal = {}, document.querySelector(".key-board-modal")) {
            var _e = document.querySelector(".key-board-modal");
            _e.style.display = "none";
          }
        }
        function he() {
          k.closeOnClickModal && ue(), R("modalClick");
        }
        function Re() {
          var _e;
          if (document.querySelector(".key-board-modal")) {
            var Oe;
            (Oe = document.querySelector(".key-board-modal")) === null || Oe === void 0 || Oe.addEventListener("click", he);
          } else {
            var Te = document.createElement("div");
            Te.className = "key-board-modal", Te.style.display = "none", (_e = document.querySelector("body")) === null || _e === void 0 || _e.appendChild(Te), Te.addEventListener("click", he);
          }
        }
        function De() {
          k.handApi && ve(k.handApi), [].concat(y(document.querySelectorAll("input")), y(document.querySelectorAll("textarea"))).forEach(function(_e) {
            _e.getAttribute("data-mode") !== null && (tt.push(_e), _e.addEventListener("focus", le), k.blurHide && _e.addEventListener("blur", ue));
          });
        }
        function Me(_e) {
          if (!xe) return "";
          var Oe = xe, Te = Oe.selectionStart, Ne = Oe.selectionEnd;
          if (!Te || !Ne) return "";
          var ot = _e.substring(0, Te - 1) + _e.substring(Ne);
          return Oe.value = ot, Oe.focus(), Oe.selectionStart = Te - 1, Oe.selectionEnd = Te - 1, ot;
        }
        function ze(_e) {
          var Oe = _e.type;
          switch (Oe) {
            case "handwrite":
              $.showMode = "handwrite";
              break;
            case "delete":
              if (!xe) return;
              var Te = Me(xe.value);
              xe.value = Te, R("change", Te, xe.getAttribute("data-prop") || xe);
              break;
          }
        }
        function vt(_e, Oe) {
          if (!xe) return "";
          var Te = xe, Ne = Te.selectionStart || 0, ot = Te.selectionEnd || 0, St = _e.substring(0, Ne) + Oe + _e.substring(ot);
          return Te.value = St, Te.focus(), Te.selectionStart = Ne + Oe.length, Te.selectionEnd = Ne + Oe.length, St;
        }
        function Ce(_e) {
          if (xe) {
            var Oe = vt(xe.value, _e);
            xe.value = Oe, R("change", Oe, xe.getAttribute("data-prop") || xe), R("keyChange", _e, xe.getAttribute("data-prop") || xe);
          }
        }
        function Ke(_e) {
          var Oe = new RegExp("^".concat(_e, "\\w*")), Te = Object.keys(fe).filter(function(Ne) {
            return Oe.test(Ne);
          }).sort();
          $.resultVal = { code: _e, value: _e ? Te.length > 1 ? Te.reduce(function(Ne, ot) {
            return Ne + fe[ot];
          }, "") : fe[Te[0]] : "" }, xe && R("keyChange", _e, xe.getAttribute("data-prop") || xe);
        }
        function Fe() {
          De();
        }
        function Xe() {
          return xe;
        }
        return Object(t.onMounted)(function() {
          k.modal && Re(), De(), b.on("resultReset", function() {
            $.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var _e;
          (_e = document.querySelector(".key-board-modal")) === null || _e === void 0 || _e.removeEventListener("click", he), tt.forEach(function(Oe) {
            Oe.removeEventListener("focus", le), Oe.removeEventListener("blur", ue);
          });
        }), F(Object(t.reactive)({ color: k.color, modeList: k.modeList, handApi: k.handApi, closeKeyBoard: function() {
          ue();
        }, changeDefaultBoard: function() {
          $.showMode = "default";
        } })), f(f({}, Object(t.toRefs)($)), {}, { defaultBoardRef: Q, getCurrentInput: Xe, translate: Ke, reSignUp: Fe, trigger: ze, change: Ce });
      } });
      nt.render = s;
      var Ge = nt;
      Ge.install = function(k) {
        k.component(Ge.name, Ge);
      };
      var yt = Ge, Nt = yt;
      d.default = Nt;
    }, fb6a: function(i, d, e) {
      var n = e("23e7"), o = e("861d"), r = e("e8b5"), t = e("23cb"), a = e("50c4"), u = e("fc6a"), s = e("8418"), c = e("b622"), l = e("1dde"), f = l("slice"), g = c("species"), p = [].slice, v = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(h, m) {
        var y, S, C, x = u(this), w = a(x.length), b = t(h, w), E = t(m === void 0 ? w : m, w);
        if (r(x) && (y = x.constructor, typeof y != "function" || y !== Array && !r(y.prototype) ? o(y) && (y = y[g], y === null && (y = void 0)) : y = void 0, y === Array || y === void 0)) return p.call(x, b, E);
        for (S = new (y === void 0 ? Array : y)(v(E - b, 0)), C = 0; b < E; b++, C++) b in x && s(S, C, x[b]);
        return S.length = C, S;
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
var Oo = At.exports;
const Lt = /* @__PURE__ */ So(Oo);
$t({
  components: { KeyBoard: Lt },
  setup() {
    function me(G, X) {
      console.log("change value ---->", G), console.log("change input dom ---->", X);
    }
    return {
      change: me
    };
  }
});
const jo = { class: "wifi-component" }, Eo = { class: "row" }, Co = { class: "column" }, To = { class: "column" }, Ao = { class: "status" }, Lo = { class: "row" }, No = { class: "column" }, Po = {
  key: 0,
  class: "wifi-modal"
}, Bo = { class: "wifi-modal-content" }, $o = { class: "wifi-list" }, Ro = {
  key: 0,
  class: "no-wifi"
}, Io = ["onClick"], Uo = { class: "wifi-ssid" }, Do = { class: "signal-strength" }, Fo = {
  __name: "WiFi",
  setup(me) {
    const { sendToPyQt: G } = Qe(), X = J("未连接"), i = J("无网络"), d = J("未知"), e = J(""), n = J(""), o = J(!1), r = J([]), t = J(null), a = () => {
      G("check_wifi_status", {});
    }, u = () => {
      t.value = setInterval(a, 5e3);
    }, s = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    dt(() => {
      u();
      const { message: h } = Qe();
      Je(h, (m) => {
        if (m && m.type === "wifi_list") {
          const y = JSON.parse(m.content);
          r.value = y;
        } else if (m && m.type === "wifi_status") {
          const y = JSON.parse(m.content);
          X.value = y.wifi_name, i.value = y.internet_status, d.value = y.zerotier_ip;
        }
      });
    }), _t(() => {
      s();
    });
    const c = async () => {
      o.value = !0, r.value = [], document.body.style.overflow = "hidden", l();
    }, l = () => {
      r.value = [], G("search_wifi", {});
    }, f = () => {
      o.value = !1, document.body.style.overflow = "auto";
    }, g = (h) => {
      e.value = h.ssid, f();
    }, p = () => {
      G("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, v = (h, m) => {
      m.placeholder === "WiFi 名称" ? e.value = h : m.placeholder === "WiFi 密码" && (n.value = h);
    };
    return (h, m) => (ye(), be("div", jo, [
      j("div", Eo, [
        j("div", Co, [
          ct(j("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (y) => e.value = y),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [pt, e.value]
          ])
        ]),
        j("div", To, [
          j("div", Ao, [
            ft(" WiFi: " + Ee(X.value) + " | 网络: " + Ee(i.value) + " ", 1),
            m[2] || (m[2] = j("br", null, null, -1)),
            ft(" zerotier ip地址: " + Ee(d.value), 1)
          ])
        ])
      ]),
      j("div", Lo, [
        j("div", No, [
          ct(j("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (y) => n.value = y),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [pt, n.value]
          ])
        ]),
        j("div", { class: "column" }, [
          j("div", { class: "button-group" }, [
            j("button", { onClick: c }, "搜索可用 WiFi"),
            j("button", { onClick: p }, "连接 WiFi")
          ])
        ])
      ]),
      qe(Rt(Lt), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: v,
        class: "scaled-keyboard"
      }),
      o.value ? (ye(), be("div", Po, [
        j("div", Bo, [
          m[4] || (m[4] = j("h2", null, "可用的WiFi网络", -1)),
          j("div", $o, [
            r.value.length === 0 ? (ye(), be("div", Ro, m[3] || (m[3] = [
              j("div", { class: "loading-spinner" }, null, -1),
              j("div", null, "搜索中...", -1)
            ]))) : (ye(!0), be(Ze, { key: 1 }, lt(r.value, (y) => (ye(), be("div", {
              key: y.ssid,
              class: "wifi-item",
              onClick: (S) => g(y)
            }, [
              j("span", Uo, Ee(y.ssid), 1),
              j("span", Do, "信号强度: " + Ee(y.signal), 1)
            ], 8, Io))), 128))
          ]),
          j("div", { class: "modal-buttons" }, [
            j("button", { onClick: l }, "重新搜索"),
            j("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : rt("", !0)
    ]));
  }
}, Mo = /* @__PURE__ */ it(Fo, [["__scopeId", "data-v-e6b1dc64"]]), Vo = {
  key: 0,
  class: "numeric-keyboard"
}, Wo = { class: "keyboard" }, qo = { class: "current-value" }, zo = ["onClick"], Ko = {
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
  setup(me, { emit: G }) {
    const X = me, i = G, d = J([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = J("");
    Je(() => X.showKeyboard, (o) => {
      o && (e.value = X.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => me.showKeyboard ? (ye(), be("div", Vo, [
      j("div", Wo, [
        j("div", qo, Ee(e.value), 1),
        (ye(!0), be(Ze, null, lt(d.value, (t) => (ye(), be("div", {
          key: t.join(),
          class: "row"
        }, [
          (ye(!0), be(Ze, null, lt(t, (a) => (ye(), be("button", {
            key: a,
            onClick: (u) => n(a),
            class: ut({ "function-key": a === "清除" || a === "确定" })
          }, Ee(a), 11, zo))), 128))
        ]))), 128))
      ])
    ])) : rt("", !0);
  }
}, jt = /* @__PURE__ */ it(Ko, [["__scopeId", "data-v-2ccc1cb7"]]), Qo = { class: "container" }, Ho = { class: "column" }, Go = { class: "status-bar" }, Jo = ["disabled"], Yo = { class: "column" }, Xo = {
  key: 0,
  class: "modal"
}, Zo = { class: "modal-content" }, er = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(me, { emit: G }) {
    const { sendToPyQt: X } = Qe(), i = mt({
      isPyQtWebEngine: !1
    }), d = J("未激活"), e = J(0), n = J(""), o = J(""), r = J(!1), t = J(7776e3);
    let a, u;
    const s = J(0), c = J(1), l = J(null), f = J(!1), g = J(!1), p = ht(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${c.value} 次锁定 - 剩余时间: ${v.value}`), v = ht(() => {
      const H = Math.floor(e.value / 86400), q = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), F = Math.floor(e.value % (60 * 60) / 60), L = e.value % 60;
      return `${H}天 ${q.toString().padStart(2, "0")}:${F.toString().padStart(2, "0")}:${L.toString().padStart(2, "0")}`;
    }), h = ht(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function m(H) {
      d.value === "未激活" && (H.target.setPointerCapture(H.pointerId), s.value = 0, u = setInterval(() => {
        s.value += 2, s.value >= 100 && (clearInterval(u), C());
      }, 30));
    }
    function y(H) {
      H.target.releasePointerCapture(H.pointerId), S();
    }
    function S() {
      clearInterval(u), s.value = 0;
    }
    function C() {
      X("activate_device", {});
    }
    function x(H, q) {
      X("Lock_set_response", { method: "activateDevice", args: { randomCode: H, time: q } }), d.value = "已激活", n.value = H, l.value = q, w();
    }
    function w() {
      b(), a = setInterval(() => {
        e.value > 0 ? b() : E();
      }, 1e3);
    }
    function b() {
      const H = Date.now(), q = l.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((q - H) / 1e3));
    }
    function E() {
      r.value = !0, document.body.style.overflow = "hidden", clearInterval(a), ne();
    }
    function O() {
      A(o.value);
    }
    function A(H) {
      X("check_lock_password", {
        target: "attemptUnlock",
        password: H,
        lockCount: c.value,
        deviceRandomCode: n.value
      }), o.value = "";
    }
    function _() {
      d.value = "永久激活", r.value = !1, document.body.style.overflow = "auto", clearInterval(a);
    }
    function M() {
      r.value = !1, document.body.style.overflow = "auto", c.value++, a && clearInterval(a), w();
    }
    _t(() => {
      clearInterval(a), clearInterval(u);
    }), dt(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: H } = Qe();
        Je(H, (q) => {
          if (q && q.type === "confirm_lock_password")
            try {
              const F = JSON.parse(q.content);
              F.target === "attemptUnlock" && (F.result === "success" ? (r.value ? l.value = Date.now() : l.value = l.value + t.value * 1e3, X("update_baseTime", l.value), M(), X("Lock_set_response", { method: "extendLockTime", args: { baseTime: l.value } })) : F.result === "forever_success" ? (_(), X("Lock_set_response", { method: "permanentUnlock", args: {} })) : X("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (F) {
              console.error("Failed to parse confirm lock password :", F);
            }
          else if (q && q.type === "device_activated")
            try {
              const F = JSON.parse(q.content);
              x(F.device_random_code, F.device_base_time);
            } catch (F) {
              console.error("Failed to parse device activation result:", F);
            }
          else if (q && q.type === "device_info")
            try {
              const F = JSON.parse(q.content);
              d.value = F.device_status, n.value = F.device_random_code, c.value = F.device_lock_count, l.value = F.device_base_time, F.device_status === "已激活" ? w() : F.device_status === "永久激活" && _();
            } catch (F) {
              console.error("Failed to parse device status:", F);
            }
          else if (q && q.type === "Lock_init")
            V();
          else if (q && q.type === "Lock_set") {
            console.log("Lock_set:", q.content);
            const F = JSON.parse(q.content);
            F.method === "requestActivation" ? C() : F.method === "attemptUnlock" && A(F.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const V = () => {
      const H = {
        deviceStatus: d.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: o.value,
        isLocked: r.value,
        lockInterval: t.value,
        lockCount: c.value,
        baseTime: l.value,
        progressWidth: s.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: g.value
      };
      console.log("Sending Lock initial state:", H), X("Lock_init_response", H);
    }, Y = G, ne = () => {
      Y("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (H, q) => (ye(), be("div", Qo, [
      j("div", Ho, [
        j("div", Go, Ee(p.value), 1),
        j("button", {
          class: "activation-button",
          onPointerdown: m,
          onPointerup: y,
          onPointercancel: S,
          onPointerleave: S,
          disabled: d.value !== "未激活"
        }, [
          ft(Ee(h.value) + " ", 1),
          j("div", {
            class: "progress-bar",
            style: kt({ width: s.value + "%" })
          }, null, 4)
        ], 40, Jo)
      ]),
      j("div", Yo, [
        ct(j("input", {
          "onUpdate:modelValue": q[0] || (q[0] = (F) => o.value = F),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: q[1] || (q[1] = (F) => f.value = !0)
        }, null, 544), [
          [pt, o.value]
        ]),
        j("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      r.value ? (ye(), be("div", Xo, [
        j("div", Zo, [
          q[8] || (q[8] = j("h3", null, "设备已锁定", -1)),
          j("h3", null, "第 " + Ee(c.value) + " 次锁定", 1),
          j("h3", null, "设备随机码: " + Ee(n.value), 1),
          ct(j("input", {
            "onUpdate:modelValue": q[2] || (q[2] = (F) => o.value = F),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: q[3] || (q[3] = (F) => g.value = !0)
          }, null, 544), [
            [pt, o.value]
          ]),
          j("button", {
            class: "unlock-button",
            onClick: O
          }, "解锁")
        ])
      ])) : rt("", !0),
      qe(jt, {
        modelValue: o.value,
        "onUpdate:modelValue": q[4] || (q[4] = (F) => o.value = F),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": q[5] || (q[5] = (F) => f.value = F)
      }, null, 8, ["modelValue", "showKeyboard"]),
      qe(jt, {
        modelValue: o.value,
        "onUpdate:modelValue": q[6] || (q[6] = (F) => o.value = F),
        showKeyboard: g.value,
        "onUpdate:showKeyboard": q[7] || (q[7] = (F) => g.value = F)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, tr = /* @__PURE__ */ it(er, [["__scopeId", "data-v-3d3fd364"]]), nr = { class: "app-container" }, or = { class: "control-row" }, rr = { class: "control-item" }, ir = { class: "control-item" }, sr = {
  __name: "App",
  setup(me) {
    Ut();
    const G = J(""), X = (i) => {
      G.value = i;
    };
    return (i, d) => (ye(), be("div", nr, [
      d[0] || (d[0] = j("h1", null, "涪特智能养护台车控制系统", -1)),
      qe($n),
      qe(ko),
      qe(sn),
      j("div", or, [
        j("div", rr, [
          qe(uo, { message: G.value }, null, 8, ["message"])
        ]),
        j("div", ir, [
          qe(to, { message: G.value }, null, 8, ["message"])
        ])
      ]),
      qe(Mo),
      qe(tr, { onMessageFromA: X })
    ]));
  }
};
export {
  sr as default
};
