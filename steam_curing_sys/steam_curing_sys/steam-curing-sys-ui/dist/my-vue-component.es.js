import Nt, { ref as ee, onMounted as lt, provide as mt, readonly as gt, inject as yt, watch as rt, openBlock as _e, createElementBlock as Se, createElementVNode as C, toDisplayString as Ne, Fragment as ct, renderList as ut, normalizeClass as at, createCommentVNode as st, reactive as vt, createVNode as He, onUnmounted as _t, normalizeStyle as wt, defineComponent as Pt, withDirectives as ft, vModelText as pt, createTextVNode as xt, unref as Bt, computed as bt } from "vue";
const jt = Symbol(), Et = Symbol(), Ct = Symbol();
function Rt(ge, Z) {
  ge && ge.messageSignal ? ge.messageSignal.connect((oe) => {
    try {
      const i = JSON.parse(oe);
      Z.value = i, console.log("Received message from PyQt:", i);
    } catch (i) {
      console.error("Failed to parse message:", i), Z.value = { type: "unknown", content: oe };
    }
  }) : console.error("messageSignal not found on bridge");
}
function It() {
  const ge = ee(null), Z = ee(null), oe = ee("");
  function i() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (d) => {
      ge.value = d, Z.value = d.objects.bridge, console.log("QWebChannel initialized", d, d.objects.bridge), Rt(Z.value, oe), Z.value && typeof Z.value.vueReady == "function" ? Z.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  lt(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? i() : document.addEventListener("DOMContentLoaded", i);
  }), mt(jt, gt(ge)), mt(Et, gt(Z)), mt(Ct, gt(oe));
}
function Ge() {
  const ge = yt(jt), Z = yt(Et), oe = yt(Ct);
  return (!ge || !Z || !oe) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: ge,
    bridge: Z,
    message: oe,
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
const it = (ge, Z) => {
  const oe = ge.__vccOpts || ge;
  for (const [i, d] of Z)
    oe[i] = d;
  return oe;
}, $t = {
  key: 0,
  class: "numeric-keyboard"
}, Ut = { class: "keyboard" }, Dt = { class: "current-value" }, Mt = ["onClick"], Ft = {
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
  setup(ge, { emit: Z }) {
    const oe = ge, i = Z, d = ee([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = ee("");
    rt(() => oe.showKeyboard, (o) => {
      o && (e.value = oe.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", parseFloat(e.value) || 0), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => ge.showKeyboard ? (_e(), Se("div", $t, [
      C("div", Ut, [
        C("div", Dt, Ne(e.value), 1),
        (_e(!0), Se(ct, null, ut(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ct, null, ut(t, (s) => (_e(), Se("button", {
            key: s,
            onClick: (c) => n(s),
            class: at({ "function-key": s === "清除" || s === "确定" })
          }, Ne(s), 11, Mt))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, kt = /* @__PURE__ */ it(Ft, [["__scopeId", "data-v-541feda2"]]), Vt = { class: "settings-container" }, qt = { class: "setting-group" }, Wt = { class: "setting-item" }, zt = { class: "setting-controls" }, Kt = ["value"], Qt = { class: "setting-item" }, Ht = { class: "setting-controls" }, Gt = ["value"], Yt = { class: "setting-group" }, Jt = { class: "setting-item" }, Xt = { class: "setting-controls" }, Zt = ["value"], en = { class: "setting-item" }, tn = { class: "setting-controls" }, nn = ["value"], on = {
  __name: "SensorSettings",
  setup(ge) {
    const { sendToPyQt: Z } = Ge(), oe = vt({
      isPyQtWebEngine: !1
    }), i = ee(35), d = ee(25), e = ee(95), n = ee(90), o = ee(!1), r = ee(null), t = ee("");
    lt(() => {
      if (oe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, oe.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: y } = Ge();
        rt(y, (h) => {
          if (h && h.type === "update_limit_settings")
            try {
              const p = JSON.parse(h.content);
              i.value = p.temp_upper, d.value = p.temp_lower, e.value = p.humidity_upper, n.value = p.humidity_lower, console.log("Sensor Settings updated:", p);
            } catch (p) {
              console.error("Failed to parse sensor settings data:", p);
            }
          else if (h && h.type === "SensorSettings_init")
            console.log("Received SensorSettings_init message"), u();
          else if (h && h.type === "SensorSettings_set") {
            console.log("Received SensorSettings_set message:", h.content);
            const v = JSON.parse(h.content).args;
            i.value = v.temp_upper, d.value = v.temp_lower, e.value = v.humidity_upper, n.value = v.humidity_lower, u();
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const s = (y, h) => {
      const p = y === "tempUpper" ? i : y === "tempLower" ? d : y === "humidityUpper" ? e : n;
      p.value = (p.value || 0) + h, y.startsWith("temp") ? c(y === "tempUpper" ? "upper" : "lower") : a(y === "humidityUpper" ? "upper" : "lower");
    }, c = (y) => {
      i.value === "" && (i.value = d.value + 1), d.value === "" && (d.value = i.value - 1), y === "upper" ? i.value = Math.max(d.value + 1, i.value) : d.value = Math.min(i.value - 1, d.value), u();
    }, a = (y) => {
      e.value === "" && (e.value = n.value + 1), n.value === "" && (n.value = e.value - 1), y === "upper" ? e.value = Math.min(100, Math.max(n.value + 1, e.value)) : n.value = Math.max(0, Math.min(e.value - 1, n.value)), u();
    }, u = () => {
      if (i.value !== "" && d.value !== "" && e.value !== "" && n.value !== "") {
        const y = {
          temp_upper: i.value,
          temp_lower: d.value,
          humidity_upper: e.value,
          humidity_lower: n.value
        };
        console.log("设置已更新:", y), oe.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), Z("updateLimitSettings", y)) : console.log("在普通网页环境中执行更新设置");
      }
    }, l = (y) => {
      r.value = y, o.value = !0, t.value = y.startsWith("temp") ? y === "tempUpper" ? i.value : d.value : y === "humidityUpper" ? e.value : n.value;
    }, f = (y) => {
      const h = parseFloat(y);
      isNaN(h) || (r.value === "tempUpper" ? (i.value = h, c("upper")) : r.value === "tempLower" ? (d.value = h, c("lower")) : r.value === "humidityUpper" ? (e.value = h, a("upper")) : r.value === "humidityLower" && (n.value = h, a("lower"))), r.value = null;
    };
    return (y, h) => (_e(), Se("div", Vt, [
      C("div", qt, [
        h[15] || (h[15] = C("h2", null, "温度设置 (°C)", -1)),
        C("div", Wt, [
          h[13] || (h[13] = C("span", { class: "setting-label" }, "上限：", -1)),
          C("div", zt, [
            C("button", {
              onClick: h[0] || (h[0] = (p) => s("tempUpper", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: i.value,
              onFocus: h[1] || (h[1] = (p) => l("tempUpper")),
              readonly: ""
            }, null, 40, Kt),
            C("button", {
              onClick: h[2] || (h[2] = (p) => s("tempUpper", 1))
            }, "+")
          ])
        ]),
        C("div", Qt, [
          h[14] || (h[14] = C("span", { class: "setting-label" }, "下限：", -1)),
          C("div", Ht, [
            C("button", {
              onClick: h[3] || (h[3] = (p) => s("tempLower", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: d.value,
              onFocus: h[4] || (h[4] = (p) => l("tempLower")),
              readonly: ""
            }, null, 40, Gt),
            C("button", {
              onClick: h[5] || (h[5] = (p) => s("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      C("div", Yt, [
        h[18] || (h[18] = C("h2", null, "湿度设置 (%)", -1)),
        C("div", Jt, [
          h[16] || (h[16] = C("span", { class: "setting-label" }, "上限：", -1)),
          C("div", Xt, [
            C("button", {
              onClick: h[6] || (h[6] = (p) => s("humidityUpper", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: e.value,
              onFocus: h[7] || (h[7] = (p) => l("humidityUpper")),
              readonly: ""
            }, null, 40, Zt),
            C("button", {
              onClick: h[8] || (h[8] = (p) => s("humidityUpper", 1))
            }, "+")
          ])
        ]),
        C("div", en, [
          h[17] || (h[17] = C("span", { class: "setting-label" }, "下限：", -1)),
          C("div", tn, [
            C("button", {
              onClick: h[9] || (h[9] = (p) => s("humidityLower", -1))
            }, "-"),
            C("input", {
              type: "text",
              value: n.value,
              onFocus: h[10] || (h[10] = (p) => l("humidityLower")),
              readonly: ""
            }, null, 40, nn),
            C("button", {
              onClick: h[11] || (h[11] = (p) => s("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      He(kt, {
        modelValue: t.value,
        showKeyboard: o.value,
        "onUpdate:modelValue": f,
        "onUpdate:showKeyboard": h[12] || (h[12] = (p) => o.value = p)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, rn = /* @__PURE__ */ it(on, [["__scopeId", "data-v-c66c99de"]]), an = { class: "sensor-data-group" }, sn = { class: "sensor-section" }, cn = { class: "sensor-container" }, un = { class: "sensor-grid" }, ln = { class: "sensor-title" }, dn = { class: "sensor-value" }, fn = { class: "sensor-section" }, pn = { class: "sensor-container" }, vn = { class: "sensor-grid" }, hn = { class: "sensor-title" }, mn = { class: "sensor-value" }, gn = {
  __name: "SensorDisplay",
  setup(ge) {
    const Z = ee({ temperature: {}, humidity: {} }), { sendToPyQt: oe } = Ge();
    lt(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: d } = Ge();
        rt(d, (e) => {
          if (e && e.type === "update_sensor_data")
            try {
              Z.value = JSON.parse(e.content);
            } catch (n) {
              console.error("Failed to parse sensor data:", n);
            }
          else e && e.type === "get_sensor_data" && oe("update_remote_sensor_data", Z.value);
        });
      } else
        console.log("在普通网页环境中执行"), i(), setInterval(i, 5e3);
    });
    const i = async () => {
      try {
        const d = await fetch("http://localhost:8000/api/sensor-data/");
        if (!d.ok)
          throw new Error(`HTTP error! status: ${d.status}`);
        const e = await d.json();
        Z.value = e;
      } catch (d) {
        console.error("Error fetching sensor data:", d);
      }
    };
    return (d, e) => (_e(), Se("div", an, [
      C("div", sn, [
        e[0] || (e[0] = C("h2", null, "温度传感器", -1)),
        C("div", cn, [
          C("div", un, [
            (_e(!0), Se(ct, null, ut(Z.value.temperature, (n, o) => (_e(), Se("div", {
              key: o,
              class: "sensor-card"
            }, [
              C("div", ln, Ne(o), 1),
              C("div", dn, Ne(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      C("div", fn, [
        e[1] || (e[1] = C("h2", null, "湿度传感器", -1)),
        C("div", pn, [
          C("div", vn, [
            (_e(!0), Se(ct, null, ut(Z.value.humidity, (n, o) => (_e(), Se("div", {
              key: o,
              class: "sensor-card"
            }, [
              C("div", hn, Ne(o), 1),
              C("div", mn, Ne(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, yn = /* @__PURE__ */ it(gn, [["__scopeId", "data-v-575ea4a8"]]), bn = { class: "cart-system" }, wn = { class: "water-protection" }, xn = { class: "mode-group" }, kn = ["disabled"], _n = ["disabled"], Sn = { class: "mode-content" }, On = { key: 0 }, jn = { class: "controls" }, En = { class: "input-group" }, Cn = { class: "input-group" }, Tn = { class: "button-group" }, An = ["disabled"], Ln = ["disabled"], Nn = { class: "visualization" }, Pn = { class: "progress-bar" }, Bn = { class: "status" }, Rn = {
  key: 1,
  class: "auto-mode-container"
}, In = {
  __name: "CartSystem",
  props: {
    message: {
      type: Object,
      // 改为Object类型
      default: () => ({})
    }
  },
  setup(ge) {
    const Z = ee("semi-auto"), oe = ee(6), i = ee(12), d = ee(oe.value), e = ee(i.value), n = ee(oe.value), o = ee(i.value), r = ee(!1), t = ee(0), s = ee("系统就绪"), c = ee("小车尚未工作"), a = ee(!1), u = ee(!1), l = ee(!1);
    let f = null;
    const y = ee(!1), h = ee(!1), p = ee(0), { sendToPyQt: v } = Ge(), m = vt({
      isPyQtWebEngine: !1
    });
    lt(() => {
      if (m.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, m.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: I } = Ge();
        rt(I, (T) => {
          if (T && T.type === "update_dolly_settings")
            try {
              const A = JSON.parse(T.content);
              d.value = A.dolly_single_run_time, e.value = A.dolly_run_interval_time, n.value = d.value, o.value = e.value, console.log("dolly Settings updated:", A);
            } catch (A) {
              console.error("Failed to parse dolly settings data:", A);
            }
          else if (T && T.type === "update_dolly_state")
            T.content ? te("小车正在运行") : te("小车尚未工作");
          else if (T && T.type === "update_water_tank_status")
            try {
              const A = JSON.parse(T.content);
              A.side === "left" ? y.value = A.low_water : A.side === "right" && (h.value = A.low_water), y.value || h.value ? (l.value = !0, Z.value === "auto" ? E("semi-auto") : O()) : l.value = !1, console.log("Water tank status updated:", A);
            } catch (A) {
              console.error("Failed to parse water tank status data:", A);
            }
          else if (T && T.type === "CartSystem_init")
            console.log("Received CartSystem_init message"), g();
          else if (T && T.type === "CartSystem_set") {
            console.log("Received CartSystem_set message:", T.content);
            const A = JSON.parse(T.content);
            if (A.method === "setMode")
              E(A.args.newMode);
            else if (A.method === "startSystem")
              j();
            else if (A.method === "stopSystem")
              O();
            else if (A.method === "updateDollySettings") {
              const L = A.args;
              d.value = L.dolly_single_run_time, e.value = L.dolly_run_interval_time, n.value = d.value, o.value = e.value, console.log("dolly Settings received:", L), b();
            }
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const g = () => {
      const I = {
        mode: Z.value,
        currentRunTime: oe.value,
        currentIntervalTime: i.value,
        tempRunTime: d.value,
        tempIntervalTime: e.value,
        nextRunTime: n.value,
        nextIntervalTime: o.value,
        isRunning: r.value,
        progress: t.value,
        statusMessage: s.value,
        autoModeStatus: c.value,
        low_water: l.value,
        leftTankLowWater: y.value,
        rightTankLowWater: h.value,
        phaseStartTime: p.value
      };
      console.log("Sending initial cart system state:", I), v("CartSystem_init_response", I);
    }, x = ge;
    rt(() => x.message, (I) => {
      I != null && I.content && (Z.value === "auto" ? E("semi-auto") : O());
    });
    const E = (I) => {
      Z.value = I, m.isPyQtWebEngine && (I === "auto" ? (O(), v("controlDolly", { target: "setMode", mode: "auto" })) : (N(), te("小车尚未工作"), v("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, k = () => {
      d.value = Math.max(1, parseInt(d.value) || 1), n.value = d.value, b();
    }, _ = () => {
      e.value = Math.max(0, parseInt(e.value) || 0), o.value = e.value, b();
    };
    function b() {
      if (m.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const I = {
          target: "dolly_settings",
          dolly_single_run_time: n.value,
          dolly_run_interval_time: o.value
        };
        v("controlDolly", I);
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    const j = () => {
      r.value = !0, V();
    }, O = () => {
      N(), r.value = !1, cancelAnimationFrame(f), t.value = 0, s.value = "系统就绪";
    };
    function N() {
      m.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), v("controlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function S() {
      m.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), v("tempControlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function F() {
      m.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), v("controlDolly", {
        target: "setState",
        dolly_state: !0
      })) : console.log("在普通网页环境中执行更新设置");
    }
    const V = () => {
      F(), s.value = "小车运行中", t.value = 0;
      const I = Date.now();
      p.value = I, oe.value = n.value;
      const T = () => {
        const A = (Date.now() - I) / 1e3, L = Math.max(0, oe.value - A);
        t.value = A / oe.value * 100, s.value = `小车运行中: 剩余 ${L.toFixed(1)} 秒`, A < oe.value && r.value ? f = requestAnimationFrame(T) : r.value && (t.value = 100, o.value > 0 && S(), H());
      };
      f = requestAnimationFrame(T);
    }, H = () => {
      s.value = "等待下次运行";
      const I = Date.now();
      p.value = I, i.value = o.value;
      const T = () => {
        const A = (Date.now() - I) / 1e3, L = Math.max(0, i.value - A);
        s.value = `等待下次运行: ${L.toFixed(1)}秒`, L > 0 && r.value ? f = requestAnimationFrame(T) : r.value && V();
      };
      f = requestAnimationFrame(T);
    }, te = (I) => {
      c.value = I;
    };
    return _t(() => {
      cancelAnimationFrame(f);
    }), (I, T) => (_e(), Se("div", bn, [
      C("div", wn, [
        C("div", {
          class: at(["water-tank", { "low-water": y.value }])
        }, " 左水箱: " + Ne(y.value ? "缺水" : "正常"), 3),
        C("div", {
          class: at(["water-tank", { "low-water": h.value }])
        }, " 右水箱: " + Ne(h.value ? "缺水" : "正常"), 3)
      ]),
      C("div", xn, [
        C("button", {
          class: at(["mode-button", { active: Z.value === "semi-auto" && !l.value }]),
          disabled: l.value,
          onClick: T[0] || (T[0] = (A) => Z.value === "auto" ? E("semi-auto") : () => {
          })
        }, "半自动模式", 10, kn),
        C("button", {
          class: at(["mode-button", { active: Z.value === "auto" && !l.value }]),
          disabled: l.value,
          onClick: T[1] || (T[1] = (A) => Z.value === "semi-auto" ? E("auto") : () => {
          })
        }, "自动模式", 10, _n)
      ]),
      C("div", Sn, [
        Z.value === "semi-auto" ? (_e(), Se("div", On, [
          C("div", jn, [
            C("div", En, [
              T[8] || (T[8] = C("label", null, "单次运行时间 (秒):", -1)),
              C("div", {
                class: "input-wrapper",
                onClick: T[2] || (T[2] = (A) => a.value = !0)
              }, Ne(d.value), 1)
            ]),
            C("div", Cn, [
              T[9] || (T[9] = C("label", null, "循环间隔时间 (秒):", -1)),
              C("div", {
                class: "input-wrapper",
                onClick: T[3] || (T[3] = (A) => u.value = !0)
              }, Ne(e.value), 1)
            ]),
            C("div", Tn, [
              C("button", {
                onClick: j,
                disabled: r.value || l.value
              }, "开始", 8, An),
              C("button", {
                onClick: O,
                disabled: !r.value || l.value
              }, "停止", 8, Ln)
            ])
          ]),
          C("div", Nn, [
            C("div", Pn, [
              C("div", {
                class: "progress",
                style: wt({ width: t.value + "%" })
              }, null, 4),
              C("div", {
                class: "cart",
                style: wt({ left: t.value + "%" })
              }, T[10] || (T[10] = [
                C("span", { class: "cart-icon" }, "🚜", -1)
              ]), 4)
            ])
          ]),
          C("div", Bn, Ne(s.value), 1)
        ])) : (_e(), Se("div", Rn, [
          T[11] || (T[11] = C("div", { class: "auto-mode-title" }, "自动模式受传感器湿度控制", -1)),
          C("div", {
            class: at(["auto-mode-status", { working: c.value === "小车正在运行" }])
          }, Ne(c.value), 3),
          T[12] || (T[12] = C("div", { class: "auto-mode-placeholder" }, null, -1))
        ]))
      ]),
      He(kt, {
        modelValue: d.value,
        "onUpdate:modelValue": [
          T[4] || (T[4] = (A) => d.value = A),
          k
        ],
        showKeyboard: a.value,
        "onUpdate:showKeyboard": T[5] || (T[5] = (A) => a.value = A)
      }, null, 8, ["modelValue", "showKeyboard"]),
      He(kt, {
        modelValue: e.value,
        "onUpdate:modelValue": [
          T[6] || (T[6] = (A) => e.value = A),
          _
        ],
        showKeyboard: u.value,
        "onUpdate:showKeyboard": T[7] || (T[7] = (A) => u.value = A)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, $n = /* @__PURE__ */ it(In, [["__scopeId", "data-v-cbf223bf"]]), Un = { class: "data-actions" }, Dn = {
  key: 0,
  class: "modal-overlay"
}, Mn = { class: "modal-content settings-modal" }, Fn = { class: "setting-group" }, Vn = { class: "setting-item" }, qn = { class: "setting-controls" }, Wn = { class: "value-display" }, zn = { class: "setting-item" }, Kn = { class: "setting-controls" }, Qn = { class: "value-display" }, Hn = {
  key: 1,
  class: "modal-overlay"
}, Gn = {
  key: 2,
  class: "modal-overlay"
}, Yn = { class: "modal-content" }, Jn = {
  __name: "DataExport",
  setup(ge) {
    const { sendToPyQt: Z } = Ge(), oe = vt({
      isPyQtWebEngine: !1
    }), i = ee(!1), d = ee(!1), e = ee(""), n = ee(!1), o = ee(0), r = ee(0), t = ee(0), s = ee(0), c = () => {
      t.value = o.value, s.value = r.value, n.value = !0, document.body.style.overflow = "hidden";
    }, a = () => {
      s.value = r.value, t.value = o.value, n.value = !1, document.body.style.overflow = "auto";
    }, u = () => {
      o.value = t.value, r.value = s.value, n.value = !1, document.body.style.overflow = "auto", Z("saveAdjustSettings", { temp_adjust: o.value, humidity_adjust: r.value });
    }, l = (g, x) => {
      g === "tempAdjust" ? t.value = t.value + x : g === "humidityAdjust" && (s.value = s.value + x);
    };
    lt(() => {
      if (oe.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, oe.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: g } = Ge();
        rt(g, (x) => {
          if (x && x.type === "update_adjust_settings")
            try {
              const E = JSON.parse(x.content);
              o.value = E.temp_adjust, r.value = E.humidity_adjust;
            } catch (E) {
              console.error("Failed to parse adjust settings:", E);
            }
          else if (x && x.type === "DataExport_init") {
            const E = {
              tempAdjust: o.value,
              humidityAdjust: r.value
            };
            console.log("Sending initial DataExport state:", E), Z("DataExport_init_response", E);
          } else if (x && x.type === "DataExport_set") {
            const E = JSON.parse(x.content);
            E.method === "saveAdjustSettings" && (t.value = E.args.tempAdjust, s.value = E.args.humidityAdjust, u());
          } else x && x.type === "clearData" && (Z("exportData", !1), Z("clearData_response", ""));
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const f = () => {
      oe.isPyQtWebEngine && (console.log("导出数据"), Z("exportData", !0));
    }, y = () => {
      i.value = !0, document.body.style.overflow = "hidden";
    }, h = () => {
      i.value = !1, document.body.style.overflow = "auto";
    }, p = () => {
      console.log("清空数据"), i.value = !1, v("所有数据已清空！"), document.body.style.overflow = "auto", oe.isPyQtWebEngine && Z("exportData", !1);
    }, v = (g) => {
      e.value = g, d.value = !0;
    }, m = () => {
      d.value = !1;
    };
    return (g, x) => (_e(), Se("div", Un, [
      C("div", { class: "action-buttons" }, [
        C("div", { class: "button-group" }, [
          C("button", {
            onClick: f,
            class: "export-btn"
          }, "导出数据")
        ]),
        C("div", { class: "button-group" }, [
          C("button", {
            onClick: y,
            class: "clear-btn"
          }, "清空数据")
        ]),
        C("div", { class: "button-group" }, [
          C("button", {
            onClick: c,
            class: "settings-btn"
          }, "传感器设置")
        ])
      ]),
      n.value ? (_e(), Se("div", Dn, [
        C("div", Mn, [
          C("div", Fn, [
            x[6] || (x[6] = C("h2", null, "传感器数据设置（设为正/负数使数据整体上/下调）", -1)),
            C("div", Vn, [
              x[4] || (x[4] = C("span", { class: "setting-label" }, "温度数据设置：", -1)),
              C("div", qn, [
                C("button", {
                  onClick: x[0] || (x[0] = (E) => l("tempAdjust", -1))
                }, "-"),
                C("span", Wn, Ne(t.value), 1),
                C("button", {
                  onClick: x[1] || (x[1] = (E) => l("tempAdjust", 1))
                }, "+")
              ])
            ]),
            C("div", zn, [
              x[5] || (x[5] = C("span", { class: "setting-label" }, "湿度数据设置：", -1)),
              C("div", Kn, [
                C("button", {
                  onClick: x[2] || (x[2] = (E) => l("humidityAdjust", -1))
                }, "-"),
                C("span", Qn, Ne(s.value), 1),
                C("button", {
                  onClick: x[3] || (x[3] = (E) => l("humidityAdjust", 1))
                }, "+")
              ])
            ])
          ]),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: u,
              class: "confirm-btn"
            }, "保存"),
            C("button", {
              onClick: a,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : st("", !0),
      i.value ? (_e(), Se("div", Hn, [
        C("div", { class: "modal-content" }, [
          x[7] || (x[7] = C("h2", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: p,
              class: "confirm-btn"
            }, "确定"),
            C("button", {
              onClick: h,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : st("", !0),
      d.value ? (_e(), Se("div", Gn, [
        C("div", Yn, [
          C("h2", null, Ne(e.value), 1),
          C("div", { class: "modal-buttons" }, [
            C("button", {
              onClick: m,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : st("", !0)
    ]));
  }
}, Xn = /* @__PURE__ */ it(Jn, [["__scopeId", "data-v-d0a112d7"]]);
var Zn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function eo(ge) {
  return ge && ge.__esModule && Object.prototype.hasOwnProperty.call(ge, "default") ? ge.default : ge;
}
var Tt = { exports: {} };
(function(ge, Z) {
  (function(oe, i) {
    ge.exports = i(Nt);
  })(typeof self < "u" ? self : Zn, function(oe) {
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
        if (e.r(r), Object.defineProperty(r, "default", { enumerable: !0, value: n }), 2 & o && typeof n != "string") for (var t in n) e.d(r, t, (function(s) {
          return n[s];
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
            return function(s) {
              return o.call(r, s);
            };
          case 2:
            return function(s, c) {
              return o.call(r, s, c);
            };
          case 3:
            return function(s, c, a) {
              return o.call(r, s, c, a);
            };
        }
        return function() {
          return o.apply(r, arguments);
        };
      };
    }, "057f": function(i, d, e) {
      var n = e("fc6a"), o = e("241c").f, r = {}.toString, t = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [], s = function(c) {
        try {
          return o(c);
        } catch {
          return t.slice();
        }
      };
      i.exports.f = function(c) {
        return t && r.call(c) == "[object Window]" ? s(c) : o(n(c));
      };
    }, "06cf": function(i, d, e) {
      var n = e("83ab"), o = e("d1e7"), r = e("5c6c"), t = e("fc6a"), s = e("c04e"), c = e("5135"), a = e("0cfb"), u = Object.getOwnPropertyDescriptor;
      d.f = n ? u : function(l, f) {
        if (l = t(l), f = s(f, !0), a) try {
          return u(l, f);
        } catch {
        }
        if (c(l, f)) return r(!o.f.call(l, f), l[f]);
      };
    }, "0a06": function(i, d, e) {
      var n = e("c532"), o = e("30b5"), r = e("f6b4"), t = e("5270"), s = e("4a7b");
      function c(a) {
        this.defaults = a, this.interceptors = { request: new r(), response: new r() };
      }
      c.prototype.request = function(a) {
        typeof a == "string" ? (a = arguments[1] || {}, a.url = arguments[0]) : a = a || {}, a = s(this.defaults, a), a.method ? a.method = a.method.toLowerCase() : this.defaults.method ? a.method = this.defaults.method.toLowerCase() : a.method = "get";
        var u = [t, void 0], l = Promise.resolve(a);
        for (this.interceptors.request.forEach(function(f) {
          u.unshift(f.fulfilled, f.rejected);
        }), this.interceptors.response.forEach(function(f) {
          u.push(f.fulfilled, f.rejected);
        }); u.length; ) l = l.then(u.shift(), u.shift());
        return l;
      }, c.prototype.getUri = function(a) {
        return a = s(this.defaults, a), o(a.url, a.params, a.paramsSerializer).replace(/^\?/, "");
      }, n.forEach(["delete", "get", "head", "options"], function(a) {
        c.prototype[a] = function(u, l) {
          return this.request(s(l || {}, { method: a, url: u, data: (l || {}).data }));
        };
      }), n.forEach(["post", "put", "patch"], function(a) {
        c.prototype[a] = function(u, l, f) {
          return this.request(s(f || {}, { method: a, url: u, data: l }));
        };
      }), i.exports = c;
    }, "0cb2": function(i, d, e) {
      var n = e("7b0b"), o = Math.floor, r = "".replace, t = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, s = /\$([$&'`]|\d{1,2})/g;
      i.exports = function(c, a, u, l, f, y) {
        var h = u + c.length, p = l.length, v = s;
        return f !== void 0 && (f = n(f), v = t), r.call(y, v, function(m, g) {
          var x;
          switch (g.charAt(0)) {
            case "$":
              return "$";
            case "&":
              return c;
            case "`":
              return a.slice(0, u);
            case "'":
              return a.slice(h);
            case "<":
              x = f[g.slice(1, -1)];
              break;
            default:
              var E = +g;
              if (E === 0) return m;
              if (E > p) {
                var k = o(E / 10);
                return k === 0 ? m : k <= p ? l[k - 1] === void 0 ? g.charAt(1) : l[k - 1] + g.charAt(1) : m;
              }
              x = l[E - 1];
          }
          return x === void 0 ? "" : x;
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
        var t = String(o(this)), s = "", c = n(r);
        if (c < 0 || c == 1 / 0) throw RangeError("Wrong number of repetitions");
        for (; c > 0; (c >>>= 1) && (t += t)) 1 & c && (s += t);
        return s;
      };
    }, 1276: function(i, d, e) {
      var n = e("d784"), o = e("44e7"), r = e("825a"), t = e("1d80"), s = e("4840"), c = e("8aa5"), a = e("50c4"), u = e("14c3"), l = e("9263"), f = e("d039"), y = [].push, h = Math.min, p = 4294967295, v = !f(function() {
        return !RegExp(p, "y");
      });
      n("split", 2, function(m, g, x) {
        var E;
        return E = "abbc".split(/(b)*/)[1] == "c" || "test".split(/(?:)/, -1).length != 4 || "ab".split(/(?:ab)*/).length != 2 || ".".split(/(.?)(.?)/).length != 4 || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(k, _) {
          var b = String(t(this)), j = _ === void 0 ? p : _ >>> 0;
          if (j === 0) return [];
          if (k === void 0) return [b];
          if (!o(k)) return g.call(b, k, j);
          for (var O, N, S, F = [], V = (k.ignoreCase ? "i" : "") + (k.multiline ? "m" : "") + (k.unicode ? "u" : "") + (k.sticky ? "y" : ""), H = 0, te = new RegExp(k.source, V + "g"); (O = l.call(te, b)) && (N = te.lastIndex, !(N > H && (F.push(b.slice(H, O.index)), O.length > 1 && O.index < b.length && y.apply(F, O.slice(1)), S = O[0].length, H = N, F.length >= j))); )
            te.lastIndex === O.index && te.lastIndex++;
          return H === b.length ? !S && te.test("") || F.push("") : F.push(b.slice(H)), F.length > j ? F.slice(0, j) : F;
        } : "0".split(void 0, 0).length ? function(k, _) {
          return k === void 0 && _ === 0 ? [] : g.call(this, k, _);
        } : g, [function(k, _) {
          var b = t(this), j = k == null ? void 0 : k[m];
          return j !== void 0 ? j.call(k, b, _) : E.call(String(b), k, _);
        }, function(k, _) {
          var b = x(E, k, this, _, E !== g);
          if (b.done) return b.value;
          var j = r(k), O = String(this), N = s(j, RegExp), S = j.unicode, F = (j.ignoreCase ? "i" : "") + (j.multiline ? "m" : "") + (j.unicode ? "u" : "") + (v ? "y" : "g"), V = new N(v ? j : "^(?:" + j.source + ")", F), H = _ === void 0 ? p : _ >>> 0;
          if (H === 0) return [];
          if (O.length === 0) return u(V, O) === null ? [O] : [];
          for (var te = 0, I = 0, T = []; I < O.length; ) {
            V.lastIndex = v ? I : 0;
            var A, L = u(V, v ? O : O.slice(I));
            if (L === null || (A = h(a(V.lastIndex + (v ? 0 : I)), O.length)) === te) I = c(O, I, S);
            else {
              if (T.push(O.slice(te, I)), T.length === H) return T;
              for (var P = 1; P <= L.length - 1; P++) if (T.push(L[P]), T.length === H) return T;
              I = te = A;
            }
          }
          return T.push(O.slice(te)), T;
        }];
      }, !v);
    }, "13d5": function(i, d, e) {
      var n = e("23e7"), o = e("d58f").left, r = e("a640"), t = e("2d00"), s = e("605d"), c = r("reduce"), a = !s && t > 79 && t < 83;
      n({ target: "Array", proto: !0, forced: !c || a }, { reduce: function(u) {
        return o(this, u, arguments.length, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "14c3": function(i, d, e) {
      var n = e("c6b6"), o = e("9263");
      i.exports = function(r, t) {
        var s = r.exec;
        if (typeof s == "function") {
          var c = s.call(r, t);
          if (typeof c != "object") throw TypeError("RegExp exec method returned something other than an Object or null");
          return c;
        }
        if (n(r) !== "RegExp") throw TypeError("RegExp#exec called on incompatible receiver");
        return o.call(r, t);
      };
    }, "159b": function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("17c2"), t = e("9112");
      for (var s in o) {
        var c = n[s], a = c && c.prototype;
        if (a && a.forEach !== r) try {
          t(a, "forEach", r);
        } catch {
          a.forEach = r;
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
        var t = 0, s = { next: function() {
          return { done: !!t++ };
        }, return: function() {
          r = !0;
        } };
        s[o] = function() {
          return this;
        }, Array.from(s, function() {
          throw 2;
        });
      } catch {
      }
      i.exports = function(c, a) {
        if (!a && !r) return !1;
        var u = !1;
        try {
          var l = {};
          l[o] = function() {
            return { next: function() {
              return { done: u = !0 };
            } };
          }, c(l);
        } catch {
        }
        return u;
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
      i.exports = function(s) {
        return r >= 51 || !n(function() {
          var c = [], a = c.constructor = {};
          return a[t] = function() {
            return { foo: 1 };
          }, c[s](Boolean).foo !== 1;
        });
      };
    }, "21a1": function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          function o($, D) {
            return D = { exports: {} }, $(D, D.exports), D.exports;
          }
          var r = o(function($, D) {
            (function(G, q) {
              $.exports = q();
            })(0, function() {
              function G(se) {
                var we = se && typeof se == "object";
                return we && Object.prototype.toString.call(se) !== "[object RegExp]" && Object.prototype.toString.call(se) !== "[object Date]";
              }
              function q(se) {
                return Array.isArray(se) ? [] : {};
              }
              function Y(se, we) {
                var ke = we && we.clone === !0;
                return ke && G(se) ? he(q(se), se, we) : se;
              }
              function re(se, we, ke) {
                var Re = se.slice();
                return we.forEach(function(je, Ve) {
                  typeof Re[Ve] > "u" ? Re[Ve] = Y(je, ke) : G(je) ? Re[Ve] = he(se[Ve], je, ke) : se.indexOf(je) === -1 && Re.push(Y(je, ke));
                }), Re;
              }
              function me(se, we, ke) {
                var Re = {};
                return G(se) && Object.keys(se).forEach(function(je) {
                  Re[je] = Y(se[je], ke);
                }), Object.keys(we).forEach(function(je) {
                  G(we[je]) && se[je] ? Re[je] = he(se[je], we[je], ke) : Re[je] = Y(we[je], ke);
                }), Re;
              }
              function he(se, we, ke) {
                var Re = Array.isArray(we), je = ke || { arrayMerge: re }, Ve = je.arrayMerge || re;
                return Re ? Array.isArray(se) ? Ve(se, we, ke) : Y(we, ke) : me(se, we, ke);
              }
              return he.all = function(se, we) {
                if (!Array.isArray(se) || se.length < 2) throw new Error("first argument should be an array with at least two elements");
                return se.reduce(function(ke, Re) {
                  return he(ke, Re, we);
                });
              }, he;
            });
          });
          function t($) {
            return $ = $ || /* @__PURE__ */ Object.create(null), { on: function(D, G) {
              ($[D] || ($[D] = [])).push(G);
            }, off: function(D, G) {
              $[D] && $[D].splice($[D].indexOf(G) >>> 0, 1);
            }, emit: function(D, G) {
              ($[D] || []).map(function(q) {
                q(G);
              }), ($["*"] || []).map(function(q) {
                q(D, G);
              });
            } };
          }
          var s = o(function($, D) {
            var G = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            D.default = G, $.exports = D.default;
          }), c = function($) {
            return Object.keys($).map(function(D) {
              var G = $[D].toString().replace(/"/g, "&quot;");
              return D + '="' + G + '"';
            }).join(" ");
          }, a = s.svg, u = s.xlink, l = {};
          l[a.name] = a.uri, l[u.name] = u.uri;
          var f, y = function($, D) {
            $ === void 0 && ($ = "");
            var G = r(l, D || {}), q = c(G);
            return "<svg " + q + ">" + $ + "</svg>";
          }, h = s.svg, p = s.xlink, v = { attrs: (f = { style: ["position: absolute", "width: 0", "height: 0"].join("; "), "aria-hidden": "true" }, f[h.name] = h.uri, f[p.name] = p.uri, f) }, m = function($) {
            this.config = r(v, $ || {}), this.symbols = [];
          };
          m.prototype.add = function($) {
            var D = this, G = D.symbols, q = this.find($.id);
            return q ? (G[G.indexOf(q)] = $, !1) : (G.push($), !0);
          }, m.prototype.remove = function($) {
            var D = this, G = D.symbols, q = this.find($);
            return !!q && (G.splice(G.indexOf(q), 1), q.destroy(), !0);
          }, m.prototype.find = function($) {
            return this.symbols.filter(function(D) {
              return D.id === $;
            })[0] || null;
          }, m.prototype.has = function($) {
            return this.find($) !== null;
          }, m.prototype.stringify = function() {
            var $ = this.config, D = $.attrs, G = this.symbols.map(function(q) {
              return q.stringify();
            }).join("");
            return y(G, D);
          }, m.prototype.toString = function() {
            return this.stringify();
          }, m.prototype.destroy = function() {
            this.symbols.forEach(function($) {
              return $.destroy();
            });
          };
          var g = function($) {
            var D = $.id, G = $.viewBox, q = $.content;
            this.id = D, this.viewBox = G, this.content = q;
          };
          g.prototype.stringify = function() {
            return this.content;
          }, g.prototype.toString = function() {
            return this.stringify();
          }, g.prototype.destroy = function() {
            var $ = this;
            ["id", "viewBox", "content"].forEach(function(D) {
              return delete $[D];
            });
          };
          var x = function($) {
            var D = !!document.importNode, G = new DOMParser().parseFromString($, "image/svg+xml").documentElement;
            return D ? document.importNode(G, !0) : G;
          }, E = function($) {
            function D() {
              $.apply(this, arguments);
            }
            $ && (D.__proto__ = $), D.prototype = Object.create($ && $.prototype), D.prototype.constructor = D;
            var G = { isMounted: {} };
            return G.isMounted.get = function() {
              return !!this.node;
            }, D.createFromExistingNode = function(q) {
              return new D({ id: q.getAttribute("id"), viewBox: q.getAttribute("viewBox"), content: q.outerHTML });
            }, D.prototype.destroy = function() {
              this.isMounted && this.unmount(), $.prototype.destroy.call(this);
            }, D.prototype.mount = function(q) {
              if (this.isMounted) return this.node;
              var Y = typeof q == "string" ? document.querySelector(q) : q, re = this.render();
              return this.node = re, Y.appendChild(re), re;
            }, D.prototype.render = function() {
              var q = this.stringify();
              return x(y(q)).childNodes[0];
            }, D.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(D.prototype, G), D;
          }(g), k = { autoConfigure: !0, mountTo: "body", syncUrlsWithBaseTag: !1, listenLocationChangeEvent: !0, locationChangeEvent: "locationChange", locationChangeAngularEmitter: !1, usagesToUpdate: "use[*|href]", moveGradientsOutsideSymbol: !1 }, _ = function($) {
            return Array.prototype.slice.call($, 0);
          }, b = { isChrome: function() {
            return /chrome/i.test(navigator.userAgent);
          }, isFirefox: function() {
            return /firefox/i.test(navigator.userAgent);
          }, isIE: function() {
            return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent);
          }, isEdge: function() {
            return /edge/i.test(navigator.userAgent);
          } }, j = function($, D) {
            var G = document.createEvent("CustomEvent");
            G.initCustomEvent($, !1, !1, D), window.dispatchEvent(G);
          }, O = function($) {
            var D = [];
            return _($.querySelectorAll("style")).forEach(function(G) {
              G.textContent += "", D.push(G);
            }), D;
          }, N = function($) {
            return ($ || window.location.href).split("#")[0];
          }, S = function($) {
            angular.module("ng").run(["$rootScope", function(D) {
              D.$on("$locationChangeSuccess", function(G, q, Y) {
                j($, { oldUrl: Y, newUrl: q });
              });
            }]);
          }, F = "linearGradient, radialGradient, pattern, mask, clipPath", V = function($, D) {
            return D === void 0 && (D = F), _($.querySelectorAll("symbol")).forEach(function(G) {
              _(G.querySelectorAll(D)).forEach(function(q) {
                G.parentNode.insertBefore(q, G);
              });
            }), $;
          };
          function H($, D) {
            var G = _($).reduce(function(q, Y) {
              if (!Y.attributes) return q;
              var re = _(Y.attributes), me = D ? re.filter(D) : re;
              return q.concat(me);
            }, []);
            return G;
          }
          var te = s.xlink.uri, I = "xlink:href", T = /[{}|\\\^\[\]`"<>]/g;
          function A($) {
            return $.replace(T, function(D) {
              return "%" + D[0].charCodeAt(0).toString(16).toUpperCase();
            });
          }
          function L($) {
            return $.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          }
          function P($, D, G) {
            return _($).forEach(function(q) {
              var Y = q.getAttribute(I);
              if (Y && Y.indexOf(D) === 0) {
                var re = Y.replace(D, G);
                q.setAttributeNS(te, I, re);
              }
            }), $;
          }
          var Q, J = ["clipPath", "colorProfile", "src", "cursor", "fill", "filter", "marker", "markerStart", "markerMid", "markerEnd", "mask", "stroke", "style"], M = J.map(function($) {
            return "[" + $ + "]";
          }).join(","), be = function($, D, G, q) {
            var Y = A(G), re = A(q), me = $.querySelectorAll(M), he = H(me, function(se) {
              var we = se.localName, ke = se.value;
              return J.indexOf(we) !== -1 && ke.indexOf("url(" + Y) !== -1;
            });
            he.forEach(function(se) {
              return se.value = se.value.replace(new RegExp(L(Y), "g"), re);
            }), P(D, Y, re);
          }, pe = { MOUNT: "mount", SYMBOL_MOUNT: "symbol_mount" }, Pe = function($) {
            function D(q) {
              var Y = this;
              q === void 0 && (q = {}), $.call(this, r(k, q));
              var re = t();
              this._emitter = re, this.node = null;
              var me = this, he = me.config;
              if (he.autoConfigure && this._autoConfigure(q), he.syncUrlsWithBaseTag) {
                var se = document.getElementsByTagName("base")[0].getAttribute("href");
                re.on(pe.MOUNT, function() {
                  return Y.updateUrls("#", se);
                });
              }
              var we = this._handleLocationChange.bind(this);
              this._handleLocationChange = we, he.listenLocationChangeEvent && window.addEventListener(he.locationChangeEvent, we), he.locationChangeAngularEmitter && S(he.locationChangeEvent), re.on(pe.MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && V(ke);
              }), re.on(pe.SYMBOL_MOUNT, function(ke) {
                he.moveGradientsOutsideSymbol && V(ke.parentNode), (b.isIE() || b.isEdge()) && O(ke);
              });
            }
            $ && (D.__proto__ = $), D.prototype = Object.create($ && $.prototype), D.prototype.constructor = D;
            var G = { isMounted: {} };
            return G.isMounted.get = function() {
              return !!this.node;
            }, D.prototype._autoConfigure = function(q) {
              var Y = this, re = Y.config;
              typeof q.syncUrlsWithBaseTag > "u" && (re.syncUrlsWithBaseTag = typeof document.getElementsByTagName("base")[0] < "u"), typeof q.locationChangeAngularEmitter > "u" && (re.locationChangeAngularEmitter = typeof window.angular < "u"), typeof q.moveGradientsOutsideSymbol > "u" && (re.moveGradientsOutsideSymbol = b.isFirefox());
            }, D.prototype._handleLocationChange = function(q) {
              var Y = q.detail, re = Y.oldUrl, me = Y.newUrl;
              this.updateUrls(re, me);
            }, D.prototype.add = function(q) {
              var Y = this, re = $.prototype.add.call(this, q);
              return this.isMounted && re && (q.mount(Y.node), this._emitter.emit(pe.SYMBOL_MOUNT, q.node)), re;
            }, D.prototype.attach = function(q) {
              var Y = this, re = this;
              if (re.isMounted) return re.node;
              var me = typeof q == "string" ? document.querySelector(q) : q;
              return re.node = me, this.symbols.forEach(function(he) {
                he.mount(re.node), Y._emitter.emit(pe.SYMBOL_MOUNT, he.node);
              }), _(me.querySelectorAll("symbol")).forEach(function(he) {
                var se = E.createFromExistingNode(he);
                se.node = he, re.add(se);
              }), this._emitter.emit(pe.MOUNT, me), me;
            }, D.prototype.destroy = function() {
              var q = this, Y = q.config, re = q.symbols, me = q._emitter;
              re.forEach(function(he) {
                return he.destroy();
              }), me.off("*"), window.removeEventListener(Y.locationChangeEvent, this._handleLocationChange), this.isMounted && this.unmount();
            }, D.prototype.mount = function(q, Y) {
              q === void 0 && (q = this.config.mountTo), Y === void 0 && (Y = !1);
              var re = this;
              if (re.isMounted) return re.node;
              var me = typeof q == "string" ? document.querySelector(q) : q, he = re.render();
              return this.node = he, Y && me.childNodes[0] ? me.insertBefore(he, me.childNodes[0]) : me.appendChild(he), this._emitter.emit(pe.MOUNT, he), he;
            }, D.prototype.render = function() {
              return x(this.stringify());
            }, D.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, D.prototype.updateUrls = function(q, Y) {
              if (!this.isMounted) return !1;
              var re = document.querySelectorAll(this.config.usagesToUpdate);
              return be(this.node, re, N(q) + "#", N(Y) + "#"), !0;
            }, Object.defineProperties(D.prototype, G), D;
          }(m), Be = o(function($) {
            /*!
              * domready (c) Dustin Diaz 2014 - License MIT
              */
            (function(D, G) {
              $.exports = G();
            })(0, function() {
              var D, G = [], q = document, Y = q.documentElement.doScroll, re = "DOMContentLoaded", me = (Y ? /^loaded|^c/ : /^loaded|^i|^c/).test(q.readyState);
              return me || q.addEventListener(re, D = function() {
                for (q.removeEventListener(re, D), me = 1; D = G.shift(); ) D();
              }), function(he) {
                me ? setTimeout(he, 0) : G.push(he);
              };
            });
          }), $e = "__SVG_SPRITE_NODE__", Te = "__SVG_SPRITE__", Ae = !!window[Te];
          Ae ? Q = window[Te] : (Q = new Pe({ attrs: { id: $e, "aria-hidden": "true" } }), window[Te] = Q);
          var Ke = function() {
            var $ = document.getElementById($e);
            $ ? Q.attach($) : Q.mount(document.body, !0);
          };
          document.body ? Ke() : Be(Ke);
          var nt = Q;
          return nt;
        });
      }).call(this, e("c8ba"));
    }, 2266: function(i, d, e) {
      var n = e("825a"), o = e("e95a"), r = e("50c4"), t = e("0366"), s = e("35a1"), c = e("2a62"), a = function(u, l) {
        this.stopped = u, this.result = l;
      };
      i.exports = function(u, l, f) {
        var y, h, p, v, m, g, x, E = f && f.that, k = !(!f || !f.AS_ENTRIES), _ = !(!f || !f.IS_ITERATOR), b = !(!f || !f.INTERRUPTED), j = t(l, E, 1 + k + b), O = function(S) {
          return y && c(y), new a(!0, S);
        }, N = function(S) {
          return k ? (n(S), b ? j(S[0], S[1], O) : j(S[0], S[1])) : b ? j(S, O) : j(S);
        };
        if (_) y = u;
        else {
          if (h = s(u), typeof h != "function") throw TypeError("Target is not iterable");
          if (o(h)) {
            for (p = 0, v = r(u.length); v > p; p++) if (m = N(u[p]), m && m instanceof a) return m;
            return new a(!1);
          }
          y = h.call(u);
        }
        for (g = y.next; !(x = g.call(y)).done; ) {
          try {
            m = N(x.value);
          } catch (S) {
            throw c(y), S;
          }
          if (typeof m == "object" && m && m instanceof a) return m;
        }
        return new a(!1);
      };
    }, "23cb": function(i, d, e) {
      var n = e("a691"), o = Math.max, r = Math.min;
      i.exports = function(t, s) {
        var c = n(t);
        return c < 0 ? o(c + s, 0) : r(c, s);
      };
    }, "23e7": function(i, d, e) {
      var n = e("da84"), o = e("06cf").f, r = e("9112"), t = e("6eeb"), s = e("ce4e"), c = e("e893"), a = e("94ca");
      i.exports = function(u, l) {
        var f, y, h, p, v, m, g = u.target, x = u.global, E = u.stat;
        if (y = x ? n : E ? n[g] || s(g, {}) : (n[g] || {}).prototype, y) for (h in l) {
          if (v = l[h], u.noTargetGet ? (m = o(y, h), p = m && m.value) : p = y[h], f = a(x ? h : g + (E ? "." : "#") + h, u.forced), !f && p !== void 0) {
            if (typeof v == typeof p) continue;
            c(v, p);
          }
          (u.sham || p && p.sham) && r(v, "sham", !0), t(y, h, v, u);
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
        function s(u, l) {
          !o.isUndefined(u) && o.isUndefined(u["Content-Type"]) && (u["Content-Type"] = l);
        }
        function c() {
          var u;
          return (typeof XMLHttpRequest < "u" || typeof n < "u" && Object.prototype.toString.call(n) === "[object process]") && (u = e("b50d")), u;
        }
        var a = { adapter: c(), transformRequest: [function(u, l) {
          return r(l, "Accept"), r(l, "Content-Type"), o.isFormData(u) || o.isArrayBuffer(u) || o.isBuffer(u) || o.isStream(u) || o.isFile(u) || o.isBlob(u) ? u : o.isArrayBufferView(u) ? u.buffer : o.isURLSearchParams(u) ? (s(l, "application/x-www-form-urlencoded;charset=utf-8"), u.toString()) : o.isObject(u) ? (s(l, "application/json;charset=utf-8"), JSON.stringify(u)) : u;
        }], transformResponse: [function(u) {
          if (typeof u == "string") try {
            u = JSON.parse(u);
          } catch {
          }
          return u;
        }], timeout: 0, xsrfCookieName: "XSRF-TOKEN", xsrfHeaderName: "X-XSRF-TOKEN", maxContentLength: -1, maxBodyLength: -1, validateStatus: function(u) {
          return u >= 200 && u < 300;
        }, headers: { common: { Accept: "application/json, text/plain, */*" } } };
        o.forEach(["delete", "get", "head"], function(u) {
          a.headers[u] = {};
        }), o.forEach(["post", "put", "patch"], function(u) {
          a.headers[u] = o.merge(t);
        }), i.exports = a;
      }).call(this, e("4362"));
    }, 2532: function(i, d, e) {
      var n = e("23e7"), o = e("5a34"), r = e("1d80"), t = e("ab13");
      n({ target: "String", proto: !0, forced: !t("includes") }, { includes: function(s) {
        return !!~String(r(this)).indexOf(o(s), arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "25f0": function(i, d, e) {
      var n = e("6eeb"), o = e("825a"), r = e("d039"), t = e("ad6d"), s = "toString", c = RegExp.prototype, a = c[s], u = r(function() {
        return a.call({ source: "a", flags: "b" }) != "/a/b";
      }), l = a.name != s;
      (u || l) && n(RegExp.prototype, s, function() {
        var f = o(this), y = String(f.source), h = f.flags, p = String(h === void 0 && f instanceof RegExp && !("flags" in c) ? t.call(f) : h);
        return "/" + y + "/" + p;
      }, { unsafe: !0 });
    }, 2626: function(i, d, e) {
      var n = e("d066"), o = e("9bf2"), r = e("b622"), t = e("83ab"), s = r("species");
      i.exports = function(c) {
        var a = n(c), u = o.f;
        t && a && !a[s] && u(a, s, { configurable: !0, get: function() {
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
      var n, o, r, t = e("da84"), s = e("d039"), c = e("0366"), a = e("1be4"), u = e("cc12"), l = e("1cdc"), f = e("605d"), y = t.location, h = t.setImmediate, p = t.clearImmediate, v = t.process, m = t.MessageChannel, g = t.Dispatch, x = 0, E = {}, k = "onreadystatechange", _ = function(N) {
        if (E.hasOwnProperty(N)) {
          var S = E[N];
          delete E[N], S();
        }
      }, b = function(N) {
        return function() {
          _(N);
        };
      }, j = function(N) {
        _(N.data);
      }, O = function(N) {
        t.postMessage(N + "", y.protocol + "//" + y.host);
      };
      h && p || (h = function(N) {
        for (var S = [], F = 1; arguments.length > F; ) S.push(arguments[F++]);
        return E[++x] = function() {
          (typeof N == "function" ? N : Function(N)).apply(void 0, S);
        }, n(x), x;
      }, p = function(N) {
        delete E[N];
      }, f ? n = function(N) {
        v.nextTick(b(N));
      } : g && g.now ? n = function(N) {
        g.now(b(N));
      } : m && !l ? (o = new m(), r = o.port2, o.port1.onmessage = j, n = c(r.postMessage, r, 1)) : t.addEventListener && typeof postMessage == "function" && !t.importScripts && y && y.protocol !== "file:" && !s(O) ? (n = O, t.addEventListener("message", j, !1)) : n = k in u("script") ? function(N) {
        a.appendChild(u("script"))[k] = function() {
          a.removeChild(this), _(N);
        };
      } : function(N) {
        setTimeout(b(N), 0);
      }), i.exports = { set: h, clear: p };
    }, "2d00": function(i, d, e) {
      var n, o, r = e("da84"), t = e("342f"), s = r.process, c = s && s.versions, a = c && c.v8;
      a ? (n = a.split("."), o = n[0] + n[1]) : t && (n = t.match(/Edge\/(\d+)/), (!n || n[1] >= 74) && (n = t.match(/Chrome\/(\d+)/), n && (o = n[1]))), i.exports = o && +o;
    }, "2d83": function(i, d, e) {
      var n = e("387f");
      i.exports = function(o, r, t, s, c) {
        var a = new Error(o);
        return n(a, r, t, s, c);
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
      i.exports = function(r, t, s) {
        if (!t) return r;
        var c;
        if (s) c = s(t);
        else if (n.isURLSearchParams(t)) c = t.toString();
        else {
          var a = [];
          n.forEach(t, function(l, f) {
            l !== null && typeof l < "u" && (n.isArray(l) ? f += "[]" : l = [l], n.forEach(l, function(y) {
              n.isDate(y) ? y = y.toISOString() : n.isObject(y) && (y = JSON.stringify(y)), a.push(o(f) + "=" + o(y));
            }));
          }), c = a.join("&");
        }
        if (c) {
          var u = r.indexOf("#");
          u !== -1 && (r = r.slice(0, u)), r += (r.indexOf("?") === -1 ? "?" : "&") + c;
        }
        return r;
      };
    }, "342f": function(i, d, e) {
      var n = e("d066");
      i.exports = n("navigator", "userAgent") || "";
    }, "35a1": function(i, d, e) {
      var n = e("f5df"), o = e("3f8c"), r = e("b622"), t = r("iterator");
      i.exports = function(s) {
        if (s != null) return s[t] || s["@@iterator"] || o[n(s)];
      };
    }, "37e8": function(i, d, e) {
      var n = e("83ab"), o = e("9bf2"), r = e("825a"), t = e("df75");
      i.exports = n ? Object.defineProperties : function(s, c) {
        r(s);
        for (var a, u = t(c), l = u.length, f = 0; l > f; ) o.f(s, a = u[f++], c[a]);
        return s;
      };
    }, "387f": function(i, d, e) {
      i.exports = function(n, o, r, t, s) {
        return n.config = o, r && (n.code = r), n.request = t, n.response = s, n.isAxiosError = !0, n.toJSON = function() {
          return { message: this.message, name: this.name, description: this.description, number: this.number, fileName: this.fileName, lineNumber: this.lineNumber, columnNumber: this.columnNumber, stack: this.stack, config: this.config, code: this.code };
        }, n;
      };
    }, "38cd": function(i, d, e) {
      e("acce");
    }, 3934: function(i, d, e) {
      var n = e("c532");
      i.exports = n.isStandardBrowserEnv() ? function() {
        var o, r = /(msie|trident)/i.test(navigator.userAgent), t = document.createElement("a");
        function s(c) {
          var a = c;
          return r && (t.setAttribute("href", a), a = t.href), t.setAttribute("href", a), { href: t.href, protocol: t.protocol ? t.protocol.replace(/:$/, "") : "", host: t.host, search: t.search ? t.search.replace(/^\?/, "") : "", hash: t.hash ? t.hash.replace(/^#/, "") : "", hostname: t.hostname, port: t.port, pathname: t.pathname.charAt(0) === "/" ? t.pathname : "/" + t.pathname };
        }
        return o = s(window.location.href), function(c) {
          var a = n.isString(c) ? s(c) : c;
          return a.protocol === o.protocol && a.host === o.host;
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
      var n = e("6547").charAt, o = e("69f3"), r = e("7dd0"), t = "String Iterator", s = o.set, c = o.getterFor(t);
      r(String, "String", function(a) {
        s(this, { type: t, string: String(a), index: 0 });
      }, function() {
        var a, u = c(this), l = u.string, f = u.index;
        return f >= l.length ? { value: void 0, done: !0 } : (a = n(l, f), u.index += a.length, { value: a, done: !1 });
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
      var n = e("b622"), o = e("7c73"), r = e("9bf2"), t = n("unscopables"), s = Array.prototype;
      s[t] == null && r.f(s, t, { configurable: !0, value: o(null) }), i.exports = function(c) {
        s[t][c] = !0;
      };
    }, "44de": function(i, d, e) {
      var n = e("da84");
      i.exports = function(o, r) {
        var t = n.console;
        t && t.error && (arguments.length === 1 ? t.error(o) : t.error(o, r));
      };
    }, "44e7": function(i, d, e) {
      var n = e("861d"), o = e("c6b6"), r = e("b622"), t = r("match");
      i.exports = function(s) {
        var c;
        return n(s) && ((c = s[t]) !== void 0 ? !!c : o(s) == "RegExp");
      };
    }, "466d": function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("1d80"), s = e("8aa5"), c = e("14c3");
      n("match", 1, function(a, u, l) {
        return [function(f) {
          var y = t(this), h = f == null ? void 0 : f[a];
          return h !== void 0 ? h.call(f, y) : new RegExp(f)[a](String(y));
        }, function(f) {
          var y = l(u, f, this);
          if (y.done) return y.value;
          var h = o(f), p = String(this);
          if (!h.global) return c(h, p);
          var v = h.unicode;
          h.lastIndex = 0;
          for (var m, g = [], x = 0; (m = c(h, p)) !== null; ) {
            var E = String(m[0]);
            g[x] = E, E === "" && (h.lastIndex = s(p, r(h.lastIndex), v)), x++;
          }
          return x === 0 ? null : g;
        }];
      });
    }, "467f": function(i, d, e) {
      var n = e("2d83");
      i.exports = function(o, r, t) {
        var s = t.config.validateStatus;
        t.status && s && !s(t.status) ? r(n("Request failed with status code " + t.status, t.config, null, t.request, t)) : o(t);
      };
    }, 4840: function(i, d, e) {
      var n = e("825a"), o = e("1c0b"), r = e("b622"), t = r("species");
      i.exports = function(s, c) {
        var a, u = n(s).constructor;
        return u === void 0 || (a = n(u)[t]) == null ? c : o(a);
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
        var t = {}, s = ["url", "method", "data"], c = ["headers", "auth", "proxy", "params"], a = ["baseURL", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "timeoutMessage", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "decompress", "maxContentLength", "maxBodyLength", "maxRedirects", "transport", "httpAgent", "httpsAgent", "cancelToken", "socketPath", "responseEncoding"], u = ["validateStatus"];
        function l(p, v) {
          return n.isPlainObject(p) && n.isPlainObject(v) ? n.merge(p, v) : n.isPlainObject(v) ? n.merge({}, v) : n.isArray(v) ? v.slice() : v;
        }
        function f(p) {
          n.isUndefined(r[p]) ? n.isUndefined(o[p]) || (t[p] = l(void 0, o[p])) : t[p] = l(o[p], r[p]);
        }
        n.forEach(s, function(p) {
          n.isUndefined(r[p]) || (t[p] = l(void 0, r[p]));
        }), n.forEach(c, f), n.forEach(a, function(p) {
          n.isUndefined(r[p]) ? n.isUndefined(o[p]) || (t[p] = l(void 0, o[p])) : t[p] = l(void 0, r[p]);
        }), n.forEach(u, function(p) {
          p in r ? t[p] = l(o[p], r[p]) : p in o && (t[p] = l(void 0, o[p]));
        });
        var y = s.concat(c).concat(a).concat(u), h = Object.keys(o).concat(Object.keys(r)).filter(function(p) {
          return y.indexOf(p) === -1;
        });
        return n.forEach(h, f), t;
      };
    }, "4d63": function(i, d, e) {
      var n = e("83ab"), o = e("da84"), r = e("94ca"), t = e("7156"), s = e("9bf2").f, c = e("241c").f, a = e("44e7"), u = e("ad6d"), l = e("9f7f"), f = e("6eeb"), y = e("d039"), h = e("69f3").set, p = e("2626"), v = e("b622"), m = v("match"), g = o.RegExp, x = g.prototype, E = /a/g, k = /a/g, _ = new g(E) !== E, b = l.UNSUPPORTED_Y, j = n && r("RegExp", !_ || b || y(function() {
        return k[m] = !1, g(E) != E || g(k) == k || g(E, "i") != "/a/i";
      }));
      if (j) {
        for (var O = function(V, H) {
          var te, I = this instanceof O, T = a(V), A = H === void 0;
          if (!I && T && V.constructor === O && A) return V;
          _ ? T && !A && (V = V.source) : V instanceof O && (A && (H = u.call(V)), V = V.source), b && (te = !!H && H.indexOf("y") > -1, te && (H = H.replace(/y/g, "")));
          var L = t(_ ? new g(V, H) : g(V, H), I ? this : x, O);
          return b && te && h(L, { sticky: te }), L;
        }, N = function(V) {
          V in O || s(O, V, { configurable: !0, get: function() {
            return g[V];
          }, set: function(H) {
            g[V] = H;
          } });
        }, S = c(g), F = 0; S.length > F; ) N(S[F++]);
        x.constructor = O, O.prototype = x, f(o, "RegExp", O);
      }
      p("RegExp");
    }, "4d64": function(i, d, e) {
      var n = e("fc6a"), o = e("50c4"), r = e("23cb"), t = function(s) {
        return function(c, a, u) {
          var l, f = n(c), y = o(f.length), h = r(u, y);
          if (s && a != a) {
            for (; y > h; ) if (l = f[h++], l != l) return !0;
          } else for (; y > h; h++) if ((s || h in f) && f[h] === a) return s || h || 0;
          return !s && -1;
        };
      };
      i.exports = { includes: t(!0), indexOf: t(!1) };
    }, "4de4": function(i, d, e) {
      var n = e("23e7"), o = e("b727").filter, r = e("1dde"), t = r("filter");
      n({ target: "Array", proto: !0, forced: !t }, { filter: function(s) {
        return o(this, s, arguments.length > 1 ? arguments[1] : void 0);
      } });
    }, "4df4": function(i, d, e) {
      var n = e("0366"), o = e("7b0b"), r = e("9bdd"), t = e("e95a"), s = e("50c4"), c = e("8418"), a = e("35a1");
      i.exports = function(u) {
        var l, f, y, h, p, v, m = o(u), g = typeof this == "function" ? this : Array, x = arguments.length, E = x > 1 ? arguments[1] : void 0, k = E !== void 0, _ = a(m), b = 0;
        if (k && (E = n(E, x > 2 ? arguments[2] : void 0, 2)), _ == null || g == Array && t(_)) for (l = s(m.length), f = new g(l); l > b; b++) v = k ? E(m[b], b) : m[b], c(f, b, v);
        else for (h = _.call(m), p = h.next, f = new g(); !(y = p.call(h)).done; b++) v = k ? r(h, E, [y.value, b], !0) : y.value, c(f, b, v);
        return f.length = b, f;
      };
    }, "4f43": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-close", use: "icon-close-usage", viewBox: "0 0 50 35.93", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 35.93" id="icon-close">\r
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
      t.a.add(s), d.default = s;
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
      function s(c) {
        c.cancelToken && c.cancelToken.throwIfRequested();
      }
      i.exports = function(c) {
        s(c), c.headers = c.headers || {}, c.data = o(c.data, c.headers, c.transformRequest), c.headers = n.merge(c.headers.common || {}, c.headers[c.method] || {}, c.headers), n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function(u) {
          delete c.headers[u];
        });
        var a = c.adapter || t.adapter;
        return a(c).then(function(u) {
          return s(c), u.data = o(u.data, u.headers, c.transformResponse), u;
        }, function(u) {
          return r(u) || (s(c), u && u.response && (u.response.data = o(u.response.data, u.response.headers, c.transformResponse))), Promise.reject(u);
        });
      };
    }, 5319: function(i, d, e) {
      var n = e("d784"), o = e("825a"), r = e("50c4"), t = e("a691"), s = e("1d80"), c = e("8aa5"), a = e("0cb2"), u = e("14c3"), l = Math.max, f = Math.min, y = function(h) {
        return h === void 0 ? h : String(h);
      };
      n("replace", 2, function(h, p, v, m) {
        var g = m.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE, x = m.REPLACE_KEEPS_$0, E = g ? "$" : "$0";
        return [function(k, _) {
          var b = s(this), j = k == null ? void 0 : k[h];
          return j !== void 0 ? j.call(k, b, _) : p.call(String(b), k, _);
        }, function(k, _) {
          if (!g && x || typeof _ == "string" && _.indexOf(E) === -1) {
            var b = v(p, k, this, _);
            if (b.done) return b.value;
          }
          var j = o(k), O = String(this), N = typeof _ == "function";
          N || (_ = String(_));
          var S = j.global;
          if (S) {
            var F = j.unicode;
            j.lastIndex = 0;
          }
          for (var V = []; ; ) {
            var H = u(j, O);
            if (H === null || (V.push(H), !S)) break;
            var te = String(H[0]);
            te === "" && (j.lastIndex = c(O, r(j.lastIndex), F));
          }
          for (var I = "", T = 0, A = 0; A < V.length; A++) {
            H = V[A];
            for (var L = String(H[0]), P = l(f(t(H.index), O.length), 0), Q = [], J = 1; J < H.length; J++) Q.push(y(H[J]));
            var M = H.groups;
            if (N) {
              var be = [L].concat(Q, P, O);
              M !== void 0 && be.push(M);
              var pe = String(_.apply(void 0, be));
            } else pe = a(L, O, P, Q, M, _);
            P >= T && (I += O.slice(T, P) + pe, T = P + L.length);
          }
          return I + O.slice(T);
        }];
      });
    }, "545a": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-handwrite", use: "icon-handwrite-usage", viewBox: "0 0 24.784 33.44", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.784 33.44" id="icon-handwrite">\r
  <g id="icon-handwrite_Handwriting" transform="translate(-783.997 -761.616)">\r
    <rect id="icon-handwrite_矩形_4" data-name="矩形 4" width="7.324" height="23.712" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 798.56, 767.142)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <rect id="icon-handwrite_矩形_5" data-name="矩形 5" width="7.324" height="4.946" rx="1.136" transform="matrix(0.838, 0.546, -0.546, 0.838, 801.262, 763)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <path id="icon-handwrite_路径_3" data-name="路径 3" d="M749.338,499.671l-.407,3.922a1.136,1.136,0,0,0,1.693,1.1l3.425-1.953a1.137,1.137,0,0,0,.057-1.939l-3.017-1.968A1.137,1.137,0,0,0,749.338,499.671Z" transform="translate(36.075 289.183)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, 5530: function(i, d, e) {
      e("466d"), e("ac1f"), e("b680"), function(n, o) {
        var r = n.document, t = r.documentElement, s = r.querySelector('meta[name="viewport"]'), c = r.querySelector('meta[name="flexible"]'), a = 0, u = 0, l = o.flexible || (o.flexible = {});
        if (s) {
          console.warn("将根据已有的meta标签来设置缩放比例");
          var f = s.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
          f && (u = parseFloat(f[1]), a = parseInt(1 / u));
        } else if (c) {
          var y = c.getAttribute("content");
          if (y) {
            var h = y.match(/initial\-dpr=([\d\.]+)/), p = y.match(/maximum\-dpr=([\d\.]+)/);
            h && (a = parseFloat(h[1]), u = parseFloat((1 / a).toFixed(2))), p && (a = parseFloat(p[1]), u = parseFloat((1 / a).toFixed(2)));
          }
        }
        if (!a && !u) {
          n.navigator.appVersion.match(/android/gi);
          var v = n.navigator.appVersion.match(/iphone/gi), m = n.devicePixelRatio;
          a = v ? m >= 3 && (!a || a >= 3) ? 3 : m >= 2 && (!a || a >= 2) ? 2 : 1 : 1, u = 1 / a;
        }
        if (t.setAttribute("data-dpr", a), !s) if (s = r.createElement("meta"), s.setAttribute("name", "viewport"), s.setAttribute("content", "initial-scale=" + u + ", maximum-scale=" + u + ", minimum-scale=" + u + ", user-scalable=no"), t.firstElementChild) t.firstElementChild.appendChild(s);
        else {
          var g = r.createElement("div");
          g.appendChild(s), r.write(g.innerHTML);
        }
        function x() {
          var E = t.getBoundingClientRect().width, k = E / 10;
          t.style.fontSize = k + "px", l.rem = n.rem = k;
        }
        n.addEventListener("resize", function() {
          x();
        }, !1), n.addEventListener("pageshow", function(E) {
          E.persisted && x();
        }, !1), r.readyState === "complete" ? r.body.style.fontSize = 10 * a + "px" : r.addEventListener("DOMContentLoaded", function(E) {
          r.body.style.fontSize = 10 * a + "px";
        }, !1), x(), l.dpr = n.dpr = a, l.refreshRem = x, l.rem2px = function(E) {
          var k = parseFloat(E) * this.rem;
          return typeof E == "string" && E.match(/rem$/) && (k += "px"), k;
        }, l.px2rem = function(E) {
          var k = parseFloat(E) / this.rem;
          return typeof E == "string" && E.match(/px$/) && (k += "rem"), k;
        };
      }(window, window.lib || (window.lib = {}));
    }, 5692: function(i, d, e) {
      var n = e("c430"), o = e("c6cd");
      (i.exports = function(r, t) {
        return o[r] || (o[r] = t !== void 0 ? t : {});
      })("versions", []).push({ version: "3.9.1", mode: n ? "pure" : "global", copyright: "© 2021 Denis Pushkarev (zloirock.ru)" });
    }, "56ef": function(i, d, e) {
      var n = e("d066"), o = e("241c"), r = e("7418"), t = e("825a");
      i.exports = n("Reflect", "ownKeys") || function(s) {
        var c = o.f(t(s)), a = r.f;
        return a ? c.concat(a(s)) : c;
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
        return function(s, c) {
          var a, u, l = String(o(s)), f = n(c), y = l.length;
          return f < 0 || f >= y ? t ? "" : void 0 : (a = l.charCodeAt(f), a < 55296 || a > 56319 || f + 1 === y || (u = l.charCodeAt(f + 1)) < 56320 || u > 57343 ? t ? l.charAt(f) : a : t ? l.slice(f, f + 2) : u - 56320 + (a - 55296 << 10) + 65536);
        };
      };
      i.exports = { codeAt: r(!1), charAt: r(!0) };
    }, 6566: function(i, d, e) {
      var n = e("9bf2").f, o = e("7c73"), r = e("e2cc"), t = e("0366"), s = e("19aa"), c = e("2266"), a = e("7dd0"), u = e("2626"), l = e("83ab"), f = e("f183").fastKey, y = e("69f3"), h = y.set, p = y.getterFor;
      i.exports = { getConstructor: function(v, m, g, x) {
        var E = v(function(j, O) {
          s(j, E, m), h(j, { type: m, index: o(null), first: void 0, last: void 0, size: 0 }), l || (j.size = 0), O != null && c(O, j[x], { that: j, AS_ENTRIES: g });
        }), k = p(m), _ = function(j, O, N) {
          var S, F, V = k(j), H = b(j, O);
          return H ? H.value = N : (V.last = H = { index: F = f(O, !0), key: O, value: N, previous: S = V.last, next: void 0, removed: !1 }, V.first || (V.first = H), S && (S.next = H), l ? V.size++ : j.size++, F !== "F" && (V.index[F] = H)), j;
        }, b = function(j, O) {
          var N, S = k(j), F = f(O);
          if (F !== "F") return S.index[F];
          for (N = S.first; N; N = N.next) if (N.key == O) return N;
        };
        return r(E.prototype, { clear: function() {
          for (var j = this, O = k(j), N = O.index, S = O.first; S; ) S.removed = !0, S.previous && (S.previous = S.previous.next = void 0), delete N[S.index], S = S.next;
          O.first = O.last = void 0, l ? O.size = 0 : j.size = 0;
        }, delete: function(j) {
          var O = this, N = k(O), S = b(O, j);
          if (S) {
            var F = S.next, V = S.previous;
            delete N.index[S.index], S.removed = !0, V && (V.next = F), F && (F.previous = V), N.first == S && (N.first = F), N.last == S && (N.last = V), l ? N.size-- : O.size--;
          }
          return !!S;
        }, forEach: function(j) {
          for (var O, N = k(this), S = t(j, arguments.length > 1 ? arguments[1] : void 0, 3); O = O ? O.next : N.first; )
            for (S(O.value, O.key, this); O && O.removed; ) O = O.previous;
        }, has: function(j) {
          return !!b(this, j);
        } }), r(E.prototype, g ? { get: function(j) {
          var O = b(this, j);
          return O && O.value;
        }, set: function(j, O) {
          return _(this, j === 0 ? 0 : j, O);
        } } : { add: function(j) {
          return _(this, j = j === 0 ? 0 : j, j);
        } }), l && n(E.prototype, "size", { get: function() {
          return k(this).size;
        } }), E;
      }, setStrong: function(v, m, g) {
        var x = m + " Iterator", E = p(m), k = p(x);
        a(v, m, function(_, b) {
          h(this, { type: x, target: _, state: E(_), kind: b, last: void 0 });
        }, function() {
          for (var _ = k(this), b = _.kind, j = _.last; j && j.removed; ) j = j.previous;
          return _.target && (_.last = j = j ? j.next : _.state.first) ? b == "keys" ? { value: j.key, done: !1 } : b == "values" ? { value: j.value, done: !1 } : { value: [j.key, j.value], done: !1 } : (_.target = void 0, { value: void 0, done: !0 });
        }, g ? "entries" : "values", !g, !0), u(m);
      } };
    }, "65f0": function(i, d, e) {
      var n = e("861d"), o = e("e8b5"), r = e("b622"), t = r("species");
      i.exports = function(s, c) {
        var a;
        return o(s) && (a = s.constructor, typeof a != "function" || a !== Array && !o(a.prototype) ? n(a) && (a = a[t], a === null && (a = void 0)) : a = void 0), new (a === void 0 ? Array : a)(c === 0 ? 0 : c);
      };
    }, "69f3": function(i, d, e) {
      var n, o, r, t = e("7f9a"), s = e("da84"), c = e("861d"), a = e("9112"), u = e("5135"), l = e("c6cd"), f = e("f772"), y = e("d012"), h = s.WeakMap, p = function(_) {
        return r(_) ? o(_) : n(_, {});
      }, v = function(_) {
        return function(b) {
          var j;
          if (!c(b) || (j = o(b)).type !== _) throw TypeError("Incompatible receiver, " + _ + " required");
          return j;
        };
      };
      if (t) {
        var m = l.state || (l.state = new h()), g = m.get, x = m.has, E = m.set;
        n = function(_, b) {
          return b.facade = _, E.call(m, _, b), b;
        }, o = function(_) {
          return g.call(m, _) || {};
        }, r = function(_) {
          return x.call(m, _);
        };
      } else {
        var k = f("state");
        y[k] = !0, n = function(_, b) {
          return b.facade = _, a(_, k, b), b;
        }, o = function(_) {
          return u(_, k) ? _[k] : {};
        }, r = function(_) {
          return u(_, k);
        };
      }
      i.exports = { set: n, get: o, has: r, enforce: p, getterFor: v };
    }, "6d55": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-upper", use: "icon-upper-usage", viewBox: "0 0 24.37 32.991", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.37 32.991" id="icon-upper">\r
  <g id="icon-upper_capslock" transform="translate(-437.841 -757.875)">\r
    <path id="icon-upper_路径_1" data-name="路径 1" d="M800.491,472.525l-9.622-9.889a1.53,1.53,0,0,0-2.192,0l-9.622,9.889a1.529,1.529,0,0,0,1.1,2.6h3.975a1.529,1.529,0,0,1,1.529,1.529v8.927a1.529,1.529,0,0,0,1.529,1.529h5.175a1.529,1.529,0,0,0,1.529-1.529V476.65a1.529,1.529,0,0,1,1.529-1.529h3.976A1.529,1.529,0,0,0,800.491,472.525Z" transform="translate(-339.747 296.701)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-upper_直线_2" data-name="直线 2" x2="13.938" transform="translate(442.92 789.865)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, "6d61": function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("94ca"), t = e("6eeb"), s = e("f183"), c = e("2266"), a = e("19aa"), u = e("861d"), l = e("d039"), f = e("1c7e"), y = e("d44e"), h = e("7156");
      i.exports = function(p, v, m) {
        var g = p.indexOf("Map") !== -1, x = p.indexOf("Weak") !== -1, E = g ? "set" : "add", k = o[p], _ = k && k.prototype, b = k, j = {}, O = function(I) {
          var T = _[I];
          t(_, I, I == "add" ? function(A) {
            return T.call(this, A === 0 ? 0 : A), this;
          } : I == "delete" ? function(A) {
            return !(x && !u(A)) && T.call(this, A === 0 ? 0 : A);
          } : I == "get" ? function(A) {
            return x && !u(A) ? void 0 : T.call(this, A === 0 ? 0 : A);
          } : I == "has" ? function(A) {
            return !(x && !u(A)) && T.call(this, A === 0 ? 0 : A);
          } : function(A, L) {
            return T.call(this, A === 0 ? 0 : A, L), this;
          });
        }, N = r(p, typeof k != "function" || !(x || _.forEach && !l(function() {
          new k().entries().next();
        })));
        if (N) b = m.getConstructor(v, p, g, E), s.REQUIRED = !0;
        else if (r(p, !0)) {
          var S = new b(), F = S[E](x ? {} : -0, 1) != S, V = l(function() {
            S.has(1);
          }), H = f(function(I) {
            new k(I);
          }), te = !x && l(function() {
            for (var I = new k(), T = 5; T--; ) I[E](T, T);
            return !I.has(-0);
          });
          H || (b = v(function(I, T) {
            a(I, b, p);
            var A = h(new k(), I, b);
            return T != null && c(T, A[E], { that: A, AS_ENTRIES: g }), A;
          }), b.prototype = _, _.constructor = b), (V || te) && (O("delete"), O("has"), g && O("get")), (te || F) && O(E), x && _.clear && delete _.clear;
        }
        return j[p] = b, n({ global: !0, forced: b != k }, j), y(b, p), x || m.setStrong(b, p, g), b;
      };
    }, "6eeb": function(i, d, e) {
      var n = e("da84"), o = e("9112"), r = e("5135"), t = e("ce4e"), s = e("8925"), c = e("69f3"), a = c.get, u = c.enforce, l = String(String).split("String");
      (i.exports = function(f, y, h, p) {
        var v, m = !!p && !!p.unsafe, g = !!p && !!p.enumerable, x = !!p && !!p.noTargetGet;
        typeof h == "function" && (typeof y != "string" || r(h, "name") || o(h, "name", y), v = u(h), v.source || (v.source = l.join(typeof y == "string" ? y : ""))), f !== n ? (m ? !x && f[y] && (g = !0) : delete f[y], g ? f[y] = h : o(f, y, h)) : g ? f[y] = h : t(y, h);
      })(Function.prototype, "toString", function() {
        return typeof this == "function" && a(this).source || s(this);
      });
    }, "70d3": function(i, d, e) {
    }, 7156: function(i, d, e) {
      var n = e("861d"), o = e("d2bb");
      i.exports = function(r, t, s) {
        var c, a;
        return o && typeof (c = t.constructor) == "function" && c !== s && n(a = c.prototype) && a !== s.prototype && o(r, a), r;
      };
    }, 7305: function(i, d, e) {
    }, 7320: function(i, d, e) {
    }, 7418: function(i, d) {
      d.f = Object.getOwnPropertySymbols;
    }, "746f": function(i, d, e) {
      var n = e("428f"), o = e("5135"), r = e("e538"), t = e("9bf2").f;
      i.exports = function(s) {
        var c = n.Symbol || (n.Symbol = {});
        o(c, s) || t(c, s, { value: r.f(s) });
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
        return { write: function(o, r, t, s, c, a) {
          var u = [];
          u.push(o + "=" + encodeURIComponent(r)), n.isNumber(t) && u.push("expires=" + new Date(t).toGMTString()), n.isString(s) && u.push("path=" + s), n.isString(c) && u.push("domain=" + c), a === !0 && u.push("secure"), document.cookie = u.join("; ");
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
      var n, o = e("825a"), r = e("37e8"), t = e("7839"), s = e("d012"), c = e("1be4"), a = e("cc12"), u = e("f772"), l = ">", f = "<", y = "prototype", h = "script", p = u("IE_PROTO"), v = function() {
      }, m = function(k) {
        return f + h + l + k + f + "/" + h + l;
      }, g = function(k) {
        k.write(m("")), k.close();
        var _ = k.parentWindow.Object;
        return k = null, _;
      }, x = function() {
        var k, _ = a("iframe"), b = "java" + h + ":";
        return _.style.display = "none", c.appendChild(_), _.src = String(b), k = _.contentWindow.document, k.open(), k.write(m("document.F=Object")), k.close(), k.F;
      }, E = function() {
        try {
          n = document.domain && new ActiveXObject("htmlfile");
        } catch {
        }
        E = n ? g(n) : x();
        for (var k = t.length; k--; ) delete E[y][t[k]];
        return E();
      };
      s[p] = !0, i.exports = Object.create || function(k, _) {
        var b;
        return k !== null ? (v[y] = o(k), b = new v(), v[y] = null, b[p] = k) : b = E(), _ === void 0 ? b : r(b, _);
      };
    }, "7db0": function(i, d, e) {
      var n = e("23e7"), o = e("b727").find, r = e("44d2"), t = "find", s = !0;
      t in [] && Array(1)[t](function() {
        s = !1;
      }), n({ target: "Array", proto: !0, forced: s }, { find: function(c) {
        return o(this, c, arguments.length > 1 ? arguments[1] : void 0);
      } }), r(t);
    }, "7dd0": function(i, d, e) {
      var n = e("23e7"), o = e("9ed3"), r = e("e163"), t = e("d2bb"), s = e("d44e"), c = e("9112"), a = e("6eeb"), u = e("b622"), l = e("c430"), f = e("3f8c"), y = e("ae93"), h = y.IteratorPrototype, p = y.BUGGY_SAFARI_ITERATORS, v = u("iterator"), m = "keys", g = "values", x = "entries", E = function() {
        return this;
      };
      i.exports = function(k, _, b, j, O, N, S) {
        o(b, _, j);
        var F, V, H, te = function(J) {
          if (J === O && P) return P;
          if (!p && J in A) return A[J];
          switch (J) {
            case m:
              return function() {
                return new b(this, J);
              };
            case g:
              return function() {
                return new b(this, J);
              };
            case x:
              return function() {
                return new b(this, J);
              };
          }
          return function() {
            return new b(this);
          };
        }, I = _ + " Iterator", T = !1, A = k.prototype, L = A[v] || A["@@iterator"] || O && A[O], P = !p && L || te(O), Q = _ == "Array" && A.entries || L;
        if (Q && (F = r(Q.call(new k())), h !== Object.prototype && F.next && (l || r(F) === h || (t ? t(F, h) : typeof F[v] != "function" && c(F, v, E)), s(F, I, !0, !0), l && (f[I] = E))), O == g && L && L.name !== g && (T = !0, P = function() {
          return L.call(this);
        }), l && !S || A[v] === P || c(A, v, P), f[_] = P, O) if (V = { values: te(g), keys: N ? P : te(m), entries: te(x) }, S) for (H in V) (p || T || !(H in A)) && a(A, H, V[H]);
        else n({ target: _, proto: !0, forced: p || T }, V);
        return V;
      };
    }, "7eb5": function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-drag", use: "icon-drag-usage", viewBox: "0 0 28 29.526", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 29.526" id="icon-drag">\r
  <g id="icon-drag_drag" transform="translate(-1623.5 -915.5)">\r
    <line id="icon-drag_直线_5" data-name="直线 5" y2="22.015" transform="translate(1637.049 919.566)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <line id="icon-drag_直线_6" data-name="直线 6" x1="22.015" transform="translate(1626.041 930.574)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="3" />\r
    <path id="icon-drag_路径_15" data-name="路径 15" d="M728.456,559.625l3.888-3.887,3.885,3.885" transform="translate(904.603 361.262)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_16" data-name="路径 16" d="M736.229,568.465l-3.888,3.888-3.885-3.885" transform="translate(904.603 371.172)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_17" data-name="路径 17" d="M735.8,561.184l3.888,3.888-3.885,3.885" transform="translate(910.317 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
    <path id="icon-drag_路径_18" data-name="路径 18" d="M727.813,568.957l-3.888-3.888,3.885-3.885" transform="translate(901.075 365.503)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
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
      i.exports = function(t, s, c) {
        var a = n(s);
        a in t ? o.f(t, a, r(0, c)) : t[a] = c;
      };
    }, "861d": function(i, d) {
      i.exports = function(e) {
        return typeof e == "object" ? e !== null : typeof e == "function";
      };
    }, 8875: function(i, d, e) {
      var n, o, r;
      (function(t, s) {
        o = [], n = s, r = typeof n == "function" ? n.apply(d, o) : n, r === void 0 || (i.exports = r);
      })(typeof self < "u" && self, function() {
        function t() {
          var s = Object.getOwnPropertyDescriptor(document, "currentScript");
          if (!s && "currentScript" in document && document.currentScript || s && s.get !== t && document.currentScript) return document.currentScript;
          try {
            throw new Error();
          } catch (x) {
            var c, a, u, l = /.*at [^(]*\((.*):(.+):(.+)\)$/gi, f = /@([^@]*):(\d+):(\d+)\s*$/gi, y = l.exec(x.stack) || f.exec(x.stack), h = y && y[1] || !1, p = y && y[2] || !1, v = document.location.href.replace(document.location.hash, ""), m = document.getElementsByTagName("script");
            h === v && (c = document.documentElement.outerHTML, a = new RegExp("(?:[^\\n]+?\\n){0," + (p - 2) + "}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*", "i"), u = c.replace(a, "$1").trim());
            for (var g = 0; g < m.length; g++)
              if (m[g].readyState === "interactive" || m[g].src === h || h === v && m[g].innerHTML && m[g].innerHTML.trim() === u) return m[g];
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
      i.exports = oe;
    }, "8df4": function(i, d, e) {
      var n = e("7a77");
      function o(r) {
        if (typeof r != "function") throw new TypeError("executor must be a function.");
        var t;
        this.promise = new Promise(function(c) {
          t = c;
        });
        var s = this;
        r(function(c) {
          s.reason || (s.reason = new n(c), t(s.reason));
        });
      }
      o.prototype.throwIfRequested = function() {
        if (this.reason) throw this.reason;
      }, o.source = function() {
        var r, t = new o(function(s) {
          r = s;
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
      i.exports = n ? function(t, s, c) {
        return o.f(t, s, r(1, c));
      } : function(t, s, c) {
        return t[s] = c, t;
      };
    }, 9263: function(i, d, e) {
      var n = e("ad6d"), o = e("9f7f"), r = RegExp.prototype.exec, t = String.prototype.replace, s = r, c = function() {
        var f = /a/, y = /b*/g;
        return r.call(f, "a"), r.call(y, "a"), f.lastIndex !== 0 || y.lastIndex !== 0;
      }(), a = o.UNSUPPORTED_Y || o.BROKEN_CARET, u = /()??/.exec("")[1] !== void 0, l = c || u || a;
      l && (s = function(f) {
        var y, h, p, v, m = this, g = a && m.sticky, x = n.call(m), E = m.source, k = 0, _ = f;
        return g && (x = x.replace("y", ""), x.indexOf("g") === -1 && (x += "g"), _ = String(f).slice(m.lastIndex), m.lastIndex > 0 && (!m.multiline || m.multiline && f[m.lastIndex - 1] !== `
`) && (E = "(?: " + E + ")", _ = " " + _, k++), h = new RegExp("^(?:" + E + ")", x)), u && (h = new RegExp("^" + E + "$(?!\\s)", x)), c && (y = m.lastIndex), p = r.call(g ? h : m, _), g ? p ? (p.input = p.input.slice(k), p[0] = p[0].slice(k), p.index = m.lastIndex, m.lastIndex += p[0].length) : m.lastIndex = 0 : c && p && (m.lastIndex = m.global ? p.index + p[0].length : y), u && p && p.length > 1 && t.call(p[0], h, function() {
          for (v = 1; v < arguments.length - 2; v++) arguments[v] === void 0 && (p[v] = void 0);
        }), p;
      }), i.exports = s;
    }, "94ca": function(i, d, e) {
      var n = e("d039"), o = /#|\.prototype\./, r = function(u, l) {
        var f = s[t(u)];
        return f == a || f != c && (typeof l == "function" ? n(l) : !!l);
      }, t = r.normalize = function(u) {
        return String(u).replace(o, ".").toLowerCase();
      }, s = r.data = {}, c = r.NATIVE = "N", a = r.POLYFILL = "P";
      i.exports = r;
    }, "95d9": function(i, d, e) {
    }, "96cf": function(i, d) {
      (function(e) {
        var n, o = Object.prototype, r = o.hasOwnProperty, t = typeof Symbol == "function" ? Symbol : {}, s = t.iterator || "@@iterator", c = t.asyncIterator || "@@asyncIterator", a = t.toStringTag || "@@toStringTag", u = typeof i == "object", l = e.regeneratorRuntime;
        if (l) u && (i.exports = l);
        else {
          l = e.regeneratorRuntime = u ? i.exports : {}, l.wrap = k;
          var f = "suspendedStart", y = "suspendedYield", h = "executing", p = "completed", v = {}, m = {};
          m[s] = function() {
            return this;
          };
          var g = Object.getPrototypeOf, x = g && g(g(T([])));
          x && x !== o && r.call(x, s) && (m = x);
          var E = O.prototype = b.prototype = Object.create(m);
          j.prototype = E.constructor = O, O.constructor = j, O[a] = j.displayName = "GeneratorFunction", l.isGeneratorFunction = function(L) {
            var P = typeof L == "function" && L.constructor;
            return !!P && (P === j || (P.displayName || P.name) === "GeneratorFunction");
          }, l.mark = function(L) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(L, O) : (L.__proto__ = O, a in L || (L[a] = "GeneratorFunction")), L.prototype = Object.create(E), L;
          }, l.awrap = function(L) {
            return { __await: L };
          }, N(S.prototype), S.prototype[c] = function() {
            return this;
          }, l.AsyncIterator = S, l.async = function(L, P, Q, J) {
            var M = new S(k(L, P, Q, J));
            return l.isGeneratorFunction(P) ? M : M.next().then(function(be) {
              return be.done ? be.value : M.next();
            });
          }, N(E), E[a] = "Generator", E[s] = function() {
            return this;
          }, E.toString = function() {
            return "[object Generator]";
          }, l.keys = function(L) {
            var P = [];
            for (var Q in L) P.push(Q);
            return P.reverse(), function J() {
              for (; P.length; ) {
                var M = P.pop();
                if (M in L) return J.value = M, J.done = !1, J;
              }
              return J.done = !0, J;
            };
          }, l.values = T, I.prototype = { constructor: I, reset: function(L) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = n, this.done = !1, this.delegate = null, this.method = "next", this.arg = n, this.tryEntries.forEach(te), !L) for (var P in this) P.charAt(0) === "t" && r.call(this, P) && !isNaN(+P.slice(1)) && (this[P] = n);
          }, stop: function() {
            this.done = !0;
            var L = this.tryEntries[0], P = L.completion;
            if (P.type === "throw") throw P.arg;
            return this.rval;
          }, dispatchException: function(L) {
            if (this.done) throw L;
            var P = this;
            function Q(Be, $e) {
              return be.type = "throw", be.arg = L, P.next = Be, $e && (P.method = "next", P.arg = n), !!$e;
            }
            for (var J = this.tryEntries.length - 1; J >= 0; --J) {
              var M = this.tryEntries[J], be = M.completion;
              if (M.tryLoc === "root") return Q("end");
              if (M.tryLoc <= this.prev) {
                var pe = r.call(M, "catchLoc"), Pe = r.call(M, "finallyLoc");
                if (pe && Pe) {
                  if (this.prev < M.catchLoc) return Q(M.catchLoc, !0);
                  if (this.prev < M.finallyLoc) return Q(M.finallyLoc);
                } else if (pe) {
                  if (this.prev < M.catchLoc) return Q(M.catchLoc, !0);
                } else {
                  if (!Pe) throw new Error("try statement without catch or finally");
                  if (this.prev < M.finallyLoc) return Q(M.finallyLoc);
                }
              }
            }
          }, abrupt: function(L, P) {
            for (var Q = this.tryEntries.length - 1; Q >= 0; --Q) {
              var J = this.tryEntries[Q];
              if (J.tryLoc <= this.prev && r.call(J, "finallyLoc") && this.prev < J.finallyLoc) {
                var M = J;
                break;
              }
            }
            M && (L === "break" || L === "continue") && M.tryLoc <= P && P <= M.finallyLoc && (M = null);
            var be = M ? M.completion : {};
            return be.type = L, be.arg = P, M ? (this.method = "next", this.next = M.finallyLoc, v) : this.complete(be);
          }, complete: function(L, P) {
            if (L.type === "throw") throw L.arg;
            return L.type === "break" || L.type === "continue" ? this.next = L.arg : L.type === "return" ? (this.rval = this.arg = L.arg, this.method = "return", this.next = "end") : L.type === "normal" && P && (this.next = P), v;
          }, finish: function(L) {
            for (var P = this.tryEntries.length - 1; P >= 0; --P) {
              var Q = this.tryEntries[P];
              if (Q.finallyLoc === L) return this.complete(Q.completion, Q.afterLoc), te(Q), v;
            }
          }, catch: function(L) {
            for (var P = this.tryEntries.length - 1; P >= 0; --P) {
              var Q = this.tryEntries[P];
              if (Q.tryLoc === L) {
                var J = Q.completion;
                if (J.type === "throw") {
                  var M = J.arg;
                  te(Q);
                }
                return M;
              }
            }
            throw new Error("illegal catch attempt");
          }, delegateYield: function(L, P, Q) {
            return this.delegate = { iterator: T(L), resultName: P, nextLoc: Q }, this.method === "next" && (this.arg = n), v;
          } };
        }
        function k(L, P, Q, J) {
          var M = P && P.prototype instanceof b ? P : b, be = Object.create(M.prototype), pe = new I(J || []);
          return be._invoke = F(L, Q, pe), be;
        }
        function _(L, P, Q) {
          try {
            return { type: "normal", arg: L.call(P, Q) };
          } catch (J) {
            return { type: "throw", arg: J };
          }
        }
        function b() {
        }
        function j() {
        }
        function O() {
        }
        function N(L) {
          ["next", "throw", "return"].forEach(function(P) {
            L[P] = function(Q) {
              return this._invoke(P, Q);
            };
          });
        }
        function S(L) {
          function P(M, be, pe, Pe) {
            var Be = _(L[M], L, be);
            if (Be.type !== "throw") {
              var $e = Be.arg, Te = $e.value;
              return Te && typeof Te == "object" && r.call(Te, "__await") ? Promise.resolve(Te.__await).then(function(Ae) {
                P("next", Ae, pe, Pe);
              }, function(Ae) {
                P("throw", Ae, pe, Pe);
              }) : Promise.resolve(Te).then(function(Ae) {
                $e.value = Ae, pe($e);
              }, Pe);
            }
            Pe(Be.arg);
          }
          var Q;
          function J(M, be) {
            function pe() {
              return new Promise(function(Pe, Be) {
                P(M, be, Pe, Be);
              });
            }
            return Q = Q ? Q.then(pe, pe) : pe();
          }
          this._invoke = J;
        }
        function F(L, P, Q) {
          var J = f;
          return function(M, be) {
            if (J === h) throw new Error("Generator is already running");
            if (J === p) {
              if (M === "throw") throw be;
              return A();
            }
            for (Q.method = M, Q.arg = be; ; ) {
              var pe = Q.delegate;
              if (pe) {
                var Pe = V(pe, Q);
                if (Pe) {
                  if (Pe === v) continue;
                  return Pe;
                }
              }
              if (Q.method === "next") Q.sent = Q._sent = Q.arg;
              else if (Q.method === "throw") {
                if (J === f) throw J = p, Q.arg;
                Q.dispatchException(Q.arg);
              } else Q.method === "return" && Q.abrupt("return", Q.arg);
              J = h;
              var Be = _(L, P, Q);
              if (Be.type === "normal") {
                if (J = Q.done ? p : y, Be.arg === v) continue;
                return { value: Be.arg, done: Q.done };
              }
              Be.type === "throw" && (J = p, Q.method = "throw", Q.arg = Be.arg);
            }
          };
        }
        function V(L, P) {
          var Q = L.iterator[P.method];
          if (Q === n) {
            if (P.delegate = null, P.method === "throw") {
              if (L.iterator.return && (P.method = "return", P.arg = n, V(L, P), P.method === "throw")) return v;
              P.method = "throw", P.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return v;
          }
          var J = _(Q, L.iterator, P.arg);
          if (J.type === "throw") return P.method = "throw", P.arg = J.arg, P.delegate = null, v;
          var M = J.arg;
          return M ? M.done ? (P[L.resultName] = M.value, P.next = L.nextLoc, P.method !== "return" && (P.method = "next", P.arg = n), P.delegate = null, v) : M : (P.method = "throw", P.arg = new TypeError("iterator result is not an object"), P.delegate = null, v);
        }
        function H(L) {
          var P = { tryLoc: L[0] };
          1 in L && (P.catchLoc = L[1]), 2 in L && (P.finallyLoc = L[2], P.afterLoc = L[3]), this.tryEntries.push(P);
        }
        function te(L) {
          var P = L.completion || {};
          P.type = "normal", delete P.arg, L.completion = P;
        }
        function I(L) {
          this.tryEntries = [{ tryLoc: "root" }], L.forEach(H, this), this.reset(!0);
        }
        function T(L) {
          if (L) {
            var P = L[s];
            if (P) return P.call(L);
            if (typeof L.next == "function") return L;
            if (!isNaN(L.length)) {
              var Q = -1, J = function M() {
                for (; ++Q < L.length; ) if (r.call(L, Q)) return M.value = L[Q], M.done = !1, M;
                return M.value = n, M.done = !0, M;
              };
              return J.next = J;
            }
          }
          return { next: A };
        }
        function A() {
          return { value: n, done: !0 };
        }
      })(/* @__PURE__ */ function() {
        return this;
      }() || Function("return this")());
    }, "99af": function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("e8b5"), t = e("861d"), s = e("7b0b"), c = e("50c4"), a = e("8418"), u = e("65f0"), l = e("1dde"), f = e("b622"), y = e("2d00"), h = f("isConcatSpreadable"), p = 9007199254740991, v = "Maximum allowed index exceeded", m = y >= 51 || !o(function() {
        var k = [];
        return k[h] = !1, k.concat()[0] !== k;
      }), g = l("concat"), x = function(k) {
        if (!t(k)) return !1;
        var _ = k[h];
        return _ !== void 0 ? !!_ : r(k);
      }, E = !m || !g;
      n({ target: "Array", proto: !0, forced: E }, { concat: function(k) {
        var _, b, j, O, N, S = s(this), F = u(S, 0), V = 0;
        for (_ = -1, j = arguments.length; _ < j; _++) if (N = _ === -1 ? S : arguments[_], x(N)) {
          if (O = c(N.length), V + O > p) throw TypeError(v);
          for (b = 0; b < O; b++, V++) b in N && a(F, V, N[b]);
        } else {
          if (V >= p) throw TypeError(v);
          a(F, V++, N);
        }
        return F.length = V, F;
      } });
    }, "9aaf": function(i, d, e) {
      e("70d3");
    }, "9bdd": function(i, d, e) {
      var n = e("825a"), o = e("2a62");
      i.exports = function(r, t, s, c) {
        try {
          return c ? t(n(s)[0], s[1]) : t(s);
        } catch (a) {
          throw o(r), a;
        }
      };
    }, "9bf2": function(i, d, e) {
      var n = e("83ab"), o = e("0cfb"), r = e("825a"), t = e("c04e"), s = Object.defineProperty;
      d.f = n ? s : function(c, a, u) {
        if (r(c), a = t(a, !0), r(u), o) try {
          return s(c, a, u);
        } catch {
        }
        if ("get" in u || "set" in u) throw TypeError("Accessors not supported");
        return "value" in u && (c[a] = u.value), c;
      };
    }, "9ed3": function(i, d, e) {
      var n = e("ae93").IteratorPrototype, o = e("7c73"), r = e("5c6c"), t = e("d44e"), s = e("3f8c"), c = function() {
        return this;
      };
      i.exports = function(a, u, l) {
        var f = u + " Iterator";
        return a.prototype = o(n, { next: r(1, l) }), t(a, f, !1, !0), s[f] = c, a;
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
      var n = e("23e7"), o = e("23cb"), r = e("a691"), t = e("50c4"), s = e("7b0b"), c = e("65f0"), a = e("8418"), u = e("1dde"), l = u("splice"), f = Math.max, y = Math.min, h = 9007199254740991, p = "Maximum allowed length exceeded";
      n({ target: "Array", proto: !0, forced: !l }, { splice: function(v, m) {
        var g, x, E, k, _, b, j = s(this), O = t(j.length), N = o(v, O), S = arguments.length;
        if (S === 0 ? g = x = 0 : S === 1 ? (g = 0, x = O - N) : (g = S - 2, x = y(f(r(m), 0), O - N)), O + g - x > h) throw TypeError(p);
        for (E = c(j, x), k = 0; k < x; k++) _ = N + k, _ in j && a(E, k, j[_]);
        if (E.length = x, g < x) {
          for (k = N; k < O - x; k++) _ = k + x, b = k + g, _ in j ? j[b] = j[_] : delete j[b];
          for (k = O; k > O - x + g; k--) delete j[k - 1];
        } else if (g > x) for (k = O - x; k > N; k--) _ = k + x - 1, b = k + g - 1, _ in j ? j[b] = j[_] : delete j[b];
        for (k = 0; k < g; k++) j[k + N] = arguments[k + 2];
        return j.length = O - x + g, E;
      } });
    }, a4b4: function(i, d, e) {
      var n = e("342f");
      i.exports = /web0s(?!.*chrome)/i.test(n);
    }, a4d3: function(i, d, e) {
      var n = e("23e7"), o = e("da84"), r = e("d066"), t = e("c430"), s = e("83ab"), c = e("4930"), a = e("fdbf"), u = e("d039"), l = e("5135"), f = e("e8b5"), y = e("861d"), h = e("825a"), p = e("7b0b"), v = e("fc6a"), m = e("c04e"), g = e("5c6c"), x = e("7c73"), E = e("df75"), k = e("241c"), _ = e("057f"), b = e("7418"), j = e("06cf"), O = e("9bf2"), N = e("d1e7"), S = e("9112"), F = e("6eeb"), V = e("5692"), H = e("f772"), te = e("d012"), I = e("90e3"), T = e("b622"), A = e("e538"), L = e("746f"), P = e("d44e"), Q = e("69f3"), J = e("b727").forEach, M = H("hidden"), be = "Symbol", pe = "prototype", Pe = T("toPrimitive"), Be = Q.set, $e = Q.getterFor(be), Te = Object[pe], Ae = o.Symbol, Ke = r("JSON", "stringify"), nt = j.f, $ = O.f, D = _.f, G = N.f, q = V("symbols"), Y = V("op-symbols"), re = V("string-to-symbol-registry"), me = V("symbol-to-string-registry"), he = V("wks"), se = o.QObject, we = !se || !se[pe] || !se[pe].findChild, ke = s && u(function() {
        return x($({}, "a", { get: function() {
          return $(this, "a", { value: 7 }).a;
        } })).a != 7;
      }) ? function(W, X, ae) {
        var fe = nt(Te, X);
        fe && delete Te[X], $(W, X, ae), fe && W !== Te && $(Te, X, fe);
      } : $, Re = function(W, X) {
        var ae = q[W] = x(Ae[pe]);
        return Be(ae, { type: be, tag: W, description: X }), s || (ae.description = X), ae;
      }, je = a ? function(W) {
        return typeof W == "symbol";
      } : function(W) {
        return Object(W) instanceof Ae;
      }, Ve = function(W, X, ae) {
        W === Te && Ve(Y, X, ae), h(W);
        var fe = m(X, !0);
        return h(ae), l(q, fe) ? (ae.enumerable ? (l(W, M) && W[M][fe] && (W[M][fe] = !1), ae = x(ae, { enumerable: g(0, !1) })) : (l(W, M) || $(W, M, g(1, {})), W[M][fe] = !0), ke(W, fe, ae)) : $(W, fe, ae);
      }, Ye = function(W, X) {
        h(W);
        var ae = v(X), fe = E(ae).concat(ue(ae));
        return J(fe, function(Ue) {
          s && !ot.call(ae, Ue) || Ve(W, Ue, ae[Ue]);
        }), W;
      }, Xe = function(W, X) {
        return X === void 0 ? x(W) : Ye(x(W), X);
      }, ot = function(W) {
        var X = m(W, !0), ae = G.call(this, X);
        return !(this === Te && l(q, X) && !l(Y, X)) && (!(ae || !l(this, X) || !l(q, X) || l(this, M) && this[M][X]) || ae);
      }, z = function(W, X) {
        var ae = v(W), fe = m(X, !0);
        if (ae !== Te || !l(q, fe) || l(Y, fe)) {
          var Ue = nt(ae, fe);
          return !Ue || !l(q, fe) || l(ae, M) && ae[M][fe] || (Ue.enumerable = !0), Ue;
        }
      }, ne = function(W) {
        var X = D(v(W)), ae = [];
        return J(X, function(fe) {
          l(q, fe) || l(te, fe) || ae.push(fe);
        }), ae;
      }, ue = function(W) {
        var X = W === Te, ae = D(X ? Y : v(W)), fe = [];
        return J(ae, function(Ue) {
          !l(q, Ue) || X && !l(Te, Ue) || fe.push(q[Ue]);
        }), fe;
      };
      if (c || (Ae = function() {
        if (this instanceof Ae) throw TypeError("Symbol is not a constructor");
        var W = arguments.length && arguments[0] !== void 0 ? String(arguments[0]) : void 0, X = I(W), ae = function(fe) {
          this === Te && ae.call(Y, fe), l(this, M) && l(this[M], X) && (this[M][X] = !1), ke(this, X, g(1, fe));
        };
        return s && we && ke(Te, X, { configurable: !0, set: ae }), Re(X, W);
      }, F(Ae[pe], "toString", function() {
        return $e(this).tag;
      }), F(Ae, "withoutSetter", function(W) {
        return Re(I(W), W);
      }), N.f = ot, O.f = Ve, j.f = z, k.f = _.f = ne, b.f = ue, A.f = function(W) {
        return Re(T(W), W);
      }, s && ($(Ae[pe], "description", { configurable: !0, get: function() {
        return $e(this).description;
      } }), t || F(Te, "propertyIsEnumerable", ot, { unsafe: !0 }))), n({ global: !0, wrap: !0, forced: !c, sham: !c }, { Symbol: Ae }), J(E(he), function(W) {
        L(W);
      }), n({ target: be, stat: !0, forced: !c }, { for: function(W) {
        var X = String(W);
        if (l(re, X)) return re[X];
        var ae = Ae(X);
        return re[X] = ae, me[ae] = X, ae;
      }, keyFor: function(W) {
        if (!je(W)) throw TypeError(W + " is not a symbol");
        if (l(me, W)) return me[W];
      }, useSetter: function() {
        we = !0;
      }, useSimple: function() {
        we = !1;
      } }), n({ target: "Object", stat: !0, forced: !c, sham: !s }, { create: Xe, defineProperty: Ve, defineProperties: Ye, getOwnPropertyDescriptor: z }), n({ target: "Object", stat: !0, forced: !c }, { getOwnPropertyNames: ne, getOwnPropertySymbols: ue }), n({ target: "Object", stat: !0, forced: u(function() {
        b.f(1);
      }) }, { getOwnPropertySymbols: function(W) {
        return b.f(p(W));
      } }), Ke) {
        var de = !c || u(function() {
          var W = Ae();
          return Ke([W]) != "[null]" || Ke({ a: W }) != "{}" || Ke(Object(W)) != "{}";
        });
        n({ target: "JSON", stat: !0, forced: de }, { stringify: function(W, X, ae) {
          for (var fe, Ue = [W], qe = 1; arguments.length > qe; ) Ue.push(arguments[qe++]);
          if (fe = X, (y(X) || W !== void 0) && !je(W)) return f(X) || (X = function(Ze, ye) {
            if (typeof fe == "function" && (ye = fe.call(this, Ze, ye)), !je(ye)) return ye;
          }), Ue[1] = X, Ke.apply(null, Ue);
        } });
      }
      Ae[pe][Pe] || S(Ae[pe], Pe, Ae[pe].valueOf), P(Ae, be), te[M] = !0;
    }, a630: function(i, d, e) {
      var n = e("23e7"), o = e("4df4"), r = e("1c7e"), t = !r(function(s) {
        Array.from(s);
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
      var n, o, r, t = e("d039"), s = e("e163"), c = e("9112"), a = e("5135"), u = e("b622"), l = e("c430"), f = u("iterator"), y = !1, h = function() {
        return this;
      };
      [].keys && (r = [].keys(), "next" in r ? (o = s(s(r)), o !== Object.prototype && (n = o)) : y = !0);
      var p = n == null || t(function() {
        var v = {};
        return n[f].call(v) !== v;
      });
      p && (n = {}), l && !p || a(n, f) || c(n, f, h), i.exports = { IteratorPrototype: n, BUGGY_SAFARI_ITERATORS: y };
    }, b041: function(i, d, e) {
      var n = e("00ee"), o = e("f5df");
      i.exports = n ? {}.toString : function() {
        return "[object " + o(this) + "]";
      };
    }, b0c0: function(i, d, e) {
      var n = e("83ab"), o = e("9bf2").f, r = Function.prototype, t = r.toString, s = /^\s*function ([^ (]*)/, c = "name";
      n && !(c in r) && o(r, c, { configurable: !0, get: function() {
        try {
          return t.call(this).match(s)[1];
        } catch {
          return "";
        }
      } });
    }, b50d: function(i, d, e) {
      var n = e("c532"), o = e("467f"), r = e("7aac"), t = e("30b5"), s = e("83b9"), c = e("c345"), a = e("3934"), u = e("2d83");
      i.exports = function(l) {
        return new Promise(function(f, y) {
          var h = l.data, p = l.headers;
          n.isFormData(h) && delete p["Content-Type"];
          var v = new XMLHttpRequest();
          if (l.auth) {
            var m = l.auth.username || "", g = l.auth.password ? unescape(encodeURIComponent(l.auth.password)) : "";
            p.Authorization = "Basic " + btoa(m + ":" + g);
          }
          var x = s(l.baseURL, l.url);
          if (v.open(l.method.toUpperCase(), t(x, l.params, l.paramsSerializer), !0), v.timeout = l.timeout, v.onreadystatechange = function() {
            if (v && v.readyState === 4 && (v.status !== 0 || v.responseURL && v.responseURL.indexOf("file:") === 0)) {
              var k = "getAllResponseHeaders" in v ? c(v.getAllResponseHeaders()) : null, _ = l.responseType && l.responseType !== "text" ? v.response : v.responseText, b = { data: _, status: v.status, statusText: v.statusText, headers: k, config: l, request: v };
              o(f, y, b), v = null;
            }
          }, v.onabort = function() {
            v && (y(u("Request aborted", l, "ECONNABORTED", v)), v = null);
          }, v.onerror = function() {
            y(u("Network Error", l, null, v)), v = null;
          }, v.ontimeout = function() {
            var k = "timeout of " + l.timeout + "ms exceeded";
            l.timeoutErrorMessage && (k = l.timeoutErrorMessage), y(u(k, l, "ECONNABORTED", v)), v = null;
          }, n.isStandardBrowserEnv()) {
            var E = (l.withCredentials || a(x)) && l.xsrfCookieName ? r.read(l.xsrfCookieName) : void 0;
            E && (p[l.xsrfHeaderName] = E);
          }
          if ("setRequestHeader" in v && n.forEach(p, function(k, _) {
            typeof h > "u" && _.toLowerCase() === "content-type" ? delete p[_] : v.setRequestHeader(_, k);
          }), n.isUndefined(l.withCredentials) || (v.withCredentials = !!l.withCredentials), l.responseType) try {
            v.responseType = l.responseType;
          } catch (k) {
            if (l.responseType !== "json") throw k;
          }
          typeof l.onDownloadProgress == "function" && v.addEventListener("progress", l.onDownloadProgress), typeof l.onUploadProgress == "function" && v.upload && v.upload.addEventListener("progress", l.onUploadProgress), l.cancelToken && l.cancelToken.promise.then(function(k) {
            v && (v.abort(), y(k), v = null);
          }), h || (h = null), v.send(h);
        });
      };
    }, b575: function(i, d, e) {
      var n, o, r, t, s, c, a, u, l = e("da84"), f = e("06cf").f, y = e("2cf4").set, h = e("1cdc"), p = e("a4b4"), v = e("605d"), m = l.MutationObserver || l.WebKitMutationObserver, g = l.document, x = l.process, E = l.Promise, k = f(l, "queueMicrotask"), _ = k && k.value;
      _ || (n = function() {
        var b, j;
        for (v && (b = x.domain) && b.exit(); o; ) {
          j = o.fn, o = o.next;
          try {
            j();
          } catch (O) {
            throw o ? t() : r = void 0, O;
          }
        }
        r = void 0, b && b.enter();
      }, h || v || p || !m || !g ? E && E.resolve ? (a = E.resolve(void 0), u = a.then, t = function() {
        u.call(a, n);
      }) : t = v ? function() {
        x.nextTick(n);
      } : function() {
        y.call(l, n);
      } : (s = !0, c = g.createTextNode(""), new m(n).observe(c, { characterData: !0 }), t = function() {
        c.data = s = !s;
      })), i.exports = _ || function(b) {
        var j = { fn: b, next: void 0 };
        r && (r.next = j), o || (o = j, t()), r = j;
      };
    }, b622: function(i, d, e) {
      var n = e("da84"), o = e("5692"), r = e("5135"), t = e("90e3"), s = e("4930"), c = e("fdbf"), a = o("wks"), u = n.Symbol, l = c ? u : u && u.withoutSetter || t;
      i.exports = function(f) {
        return r(a, f) && (s || typeof a[f] == "string") || (s && r(u, f) ? a[f] = u[f] : a[f] = l("Symbol." + f)), a[f];
      };
    }, b64b: function(i, d, e) {
      var n = e("23e7"), o = e("7b0b"), r = e("df75"), t = e("d039"), s = t(function() {
        r(1);
      });
      n({ target: "Object", stat: !0, forced: s }, { keys: function(c) {
        return r(o(c));
      } });
    }, b680: function(i, d, e) {
      var n = e("23e7"), o = e("a691"), r = e("408a"), t = e("1148"), s = e("d039"), c = 1 .toFixed, a = Math.floor, u = function(v, m, g) {
        return m === 0 ? g : m % 2 === 1 ? u(v, m - 1, g * v) : u(v * v, m / 2, g);
      }, l = function(v) {
        for (var m = 0, g = v; g >= 4096; ) m += 12, g /= 4096;
        for (; g >= 2; ) m += 1, g /= 2;
        return m;
      }, f = function(v, m, g) {
        for (var x = -1, E = g; ++x < 6; ) E += m * v[x], v[x] = E % 1e7, E = a(E / 1e7);
      }, y = function(v, m) {
        for (var g = 6, x = 0; --g >= 0; ) x += v[g], v[g] = a(x / m), x = x % m * 1e7;
      }, h = function(v) {
        for (var m = 6, g = ""; --m >= 0; ) if (g !== "" || m === 0 || v[m] !== 0) {
          var x = String(v[m]);
          g = g === "" ? x : g + t.call("0", 7 - x.length) + x;
        }
        return g;
      }, p = c && (8e-5.toFixed(3) !== "0.000" || 0.9.toFixed(0) !== "1" || 1.255.toFixed(2) !== "1.25" || 1000000000000000100 .toFixed(0) !== "1000000000000000128") || !s(function() {
        c.call({});
      });
      n({ target: "Number", proto: !0, forced: p }, { toFixed: function(v) {
        var m, g, x, E, k = r(this), _ = o(v), b = [0, 0, 0, 0, 0, 0], j = "", O = "0";
        if (_ < 0 || _ > 20) throw RangeError("Incorrect fraction digits");
        if (k != k) return "NaN";
        if (k <= -1e21 || k >= 1e21) return String(k);
        if (k < 0 && (j = "-", k = -k), k > 1e-21) if (m = l(k * u(2, 69, 1)) - 69, g = m < 0 ? k * u(2, -m, 1) : k / u(2, m, 1), g *= 4503599627370496, m = 52 - m, m > 0) {
          for (f(b, 0, g), x = _; x >= 7; ) f(b, 1e7, 0), x -= 7;
          for (f(b, u(10, x, 1), 0), x = m - 1; x >= 23; ) y(b, 1 << 23), x -= 23;
          y(b, 1 << x), f(b, 1, 1), y(b, 2), O = h(b);
        } else f(b, 0, g), f(b, 1 << -m, 0), O = h(b) + t.call("0", _);
        return _ > 0 ? (E = O.length, O = j + (E <= _ ? "0." + t.call("0", _ - E) + O : O.slice(0, E - _) + "." + O.slice(E - _))) : O = j + O, O;
      } });
    }, b727: function(i, d, e) {
      var n = e("0366"), o = e("44ad"), r = e("7b0b"), t = e("50c4"), s = e("65f0"), c = [].push, a = function(u) {
        var l = u == 1, f = u == 2, y = u == 3, h = u == 4, p = u == 6, v = u == 7, m = u == 5 || p;
        return function(g, x, E, k) {
          for (var _, b, j = r(g), O = o(j), N = n(x, E, 3), S = t(O.length), F = 0, V = k || s, H = l ? V(g, S) : f || v ? V(g, 0) : void 0; S > F; F++) if ((m || F in O) && (_ = O[F], b = N(_, F, j), u)) if (l) H[F] = b;
          else if (b) switch (u) {
            case 3:
              return !0;
            case 5:
              return _;
            case 6:
              return F;
            case 2:
              c.call(H, _);
          }
          else switch (u) {
            case 4:
              return !1;
            case 7:
              c.call(H, _);
          }
          return p ? -1 : y || h ? h : H;
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
      i.exports = function(o, r) {
        if (!n(o)) return o;
        var t, s;
        if (r && typeof (t = o.toString) == "function" && !n(s = t.call(o)) || typeof (t = o.valueOf) == "function" && !n(s = t.call(o)) || !r && typeof (t = o.toString) == "function" && !n(s = t.call(o))) return s;
        throw TypeError("Can't convert object to primitive value");
      };
    }, c345: function(i, d, e) {
      var n = e("c532"), o = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
      i.exports = function(r) {
        var t, s, c, a = {};
        return r && n.forEach(r.split(`
`), function(u) {
          if (c = u.indexOf(":"), t = n.trim(u.substr(0, c)).toLowerCase(), s = n.trim(u.substr(c + 1)), t) {
            if (a[t] && o.indexOf(t) >= 0) return;
            a[t] = t === "set-cookie" ? (a[t] ? a[t] : []).concat([s]) : a[t] ? a[t] + ", " + s : s;
          }
        }), a;
      };
    }, c401: function(i, d, e) {
      var n = e("c532");
      i.exports = function(o, r, t) {
        return n.forEach(t, function(s) {
          o = s(o, r);
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
      function s(S) {
        return S !== null && !t(S) && S.constructor !== null && !t(S.constructor) && typeof S.constructor.isBuffer == "function" && S.constructor.isBuffer(S);
      }
      function c(S) {
        return o.call(S) === "[object ArrayBuffer]";
      }
      function a(S) {
        return typeof FormData < "u" && S instanceof FormData;
      }
      function u(S) {
        var F;
        return F = typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(S) : S && S.buffer && S.buffer instanceof ArrayBuffer, F;
      }
      function l(S) {
        return typeof S == "string";
      }
      function f(S) {
        return typeof S == "number";
      }
      function y(S) {
        return S !== null && typeof S == "object";
      }
      function h(S) {
        if (o.call(S) !== "[object Object]") return !1;
        var F = Object.getPrototypeOf(S);
        return F === null || F === Object.prototype;
      }
      function p(S) {
        return o.call(S) === "[object Date]";
      }
      function v(S) {
        return o.call(S) === "[object File]";
      }
      function m(S) {
        return o.call(S) === "[object Blob]";
      }
      function g(S) {
        return o.call(S) === "[object Function]";
      }
      function x(S) {
        return y(S) && g(S.pipe);
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
      function b(S, F) {
        if (S !== null && typeof S < "u") if (typeof S != "object" && (S = [S]), r(S)) for (var V = 0, H = S.length; V < H; V++) F.call(null, S[V], V, S);
        else for (var te in S) Object.prototype.hasOwnProperty.call(S, te) && F.call(null, S[te], te, S);
      }
      function j() {
        var S = {};
        function F(te, I) {
          h(S[I]) && h(te) ? S[I] = j(S[I], te) : h(te) ? S[I] = j({}, te) : r(te) ? S[I] = te.slice() : S[I] = te;
        }
        for (var V = 0, H = arguments.length; V < H; V++) b(arguments[V], F);
        return S;
      }
      function O(S, F, V) {
        return b(F, function(H, te) {
          S[te] = V && typeof H == "function" ? n(H, V) : H;
        }), S;
      }
      function N(S) {
        return S.charCodeAt(0) === 65279 && (S = S.slice(1)), S;
      }
      i.exports = { isArray: r, isArrayBuffer: c, isBuffer: s, isFormData: a, isArrayBufferView: u, isString: l, isNumber: f, isObject: y, isPlainObject: h, isUndefined: t, isDate: p, isFile: v, isBlob: m, isFunction: g, isStream: x, isURLSearchParams: E, isStandardBrowserEnv: _, forEach: b, merge: j, extend: O, trim: k, stripBOM: N };
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
        n.forEach(o, function(t, s) {
          s !== r && s.toUpperCase() === r.toUpperCase() && (o[r] = t, delete o[s]);
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
      i.exports = function(s, c) {
        var a, u = o(s), l = 0, f = [];
        for (a in u) !n(t, a) && n(u, a) && f.push(a);
        for (; c.length > l; ) n(u, a = c[l++]) && (~r(f, a) || f.push(a));
        return f;
      };
    }, caad: function(i, d, e) {
      var n = e("23e7"), o = e("4d64").includes, r = e("44d2");
      n({ target: "Array", proto: !0 }, { includes: function(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), r("includes");
    }, cc12: function(i, d, e) {
      var n = e("da84"), o = e("861d"), r = n.document, t = o(r) && o(r.createElement);
      i.exports = function(s) {
        return t ? r.createElement(s) : {};
      };
    }, cdf9: function(i, d, e) {
      var n = e("825a"), o = e("861d"), r = e("f069");
      i.exports = function(t, s) {
        if (n(t), o(s) && s.constructor === t) return s;
        var c = r.f(t), a = c.resolve;
        return a(s), c.promise;
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
      var n = e("c532"), o = e("1d2b"), r = e("0a06"), t = e("4a7b"), s = e("2444");
      function c(u) {
        var l = new r(u), f = o(r.prototype.request, l);
        return n.extend(f, r.prototype, l), n.extend(f, l), f;
      }
      var a = c(s);
      a.Axios = r, a.create = function(u) {
        return c(t(a.defaults, u));
      }, a.Cancel = e("7a77"), a.CancelToken = e("8df4"), a.isCancel = e("2e67"), a.all = function(u) {
        return Promise.all(u);
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
      var n = e("428f"), o = e("da84"), r = function(t) {
        return typeof t == "function" ? t : void 0;
      };
      i.exports = function(t, s) {
        return arguments.length < 2 ? r(n[t]) || r(o[t]) : n[t] && n[t][s] || o[t] && o[t][s];
      };
    }, d1e7: function(i, d, e) {
      var n = {}.propertyIsEnumerable, o = Object.getOwnPropertyDescriptor, r = o && !n.call({ 1: 2 }, 1);
      d.f = r ? function(t) {
        var s = o(this, t);
        return !!s && s.enumerable;
      } : n;
    }, d28b: function(i, d, e) {
      var n = e("746f");
      n("iterator");
    }, d2bb: function(i, d, e) {
      var n = e("825a"), o = e("3bbe");
      i.exports = Object.setPrototypeOf || ("__proto__" in {} ? function() {
        var r, t = !1, s = {};
        try {
          r = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set, r.call(s, []), t = s instanceof Array;
        } catch {
        }
        return function(c, a) {
          return n(c), o(a), t ? r.call(c, a) : c.__proto__ = a, c;
        };
      }() : void 0);
    }, d3b7: function(i, d, e) {
      var n = e("00ee"), o = e("6eeb"), r = e("b041");
      n || o(Object.prototype, "toString", r, { unsafe: !0 });
    }, d40d: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-back", use: "icon-back-usage", viewBox: "0 0 58.6 35.1", content: `<symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 58.6 35.1" id="icon-back">\r
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
      t.a.add(s), d.default = s;
    }, d44e: function(i, d, e) {
      var n = e("9bf2").f, o = e("5135"), r = e("b622"), t = r("toStringTag");
      i.exports = function(s, c, a) {
        s && !o(s = a ? s : s.prototype, t) && n(s, t, { configurable: !0, value: c });
      };
    }, d58f: function(i, d, e) {
      var n = e("1c0b"), o = e("7b0b"), r = e("44ad"), t = e("50c4"), s = function(c) {
        return function(a, u, l, f) {
          n(u);
          var y = o(a), h = r(y), p = t(y.length), v = c ? p - 1 : 0, m = c ? -1 : 1;
          if (l < 2) for (; ; ) {
            if (v in h) {
              f = h[v], v += m;
              break;
            }
            if (v += m, c ? v < 0 : p <= v) throw TypeError("Reduce of empty array with no initial value");
          }
          for (; c ? v >= 0 : p > v; v += m) v in h && (f = u(f, h[v], v, y));
          return f;
        };
      };
      i.exports = { left: s(!1), right: s(!0) };
    }, d69c: function(i, d, e) {
      e.r(d);
      var n = e("e017"), o = e.n(n), r = e("21a1"), t = e.n(r), s = new o.a({ id: "icon-delete", use: "icon-delete-usage", viewBox: "0 0 66.467 28.8", content: `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66.467 28.8" id="icon-delete">\r
  <g id="icon-delete_delet" transform="translate(-1618 -633)">\r
    <path id="icon-delete_路径_2" data-name="路径 2" d="M842.844,477.922l-10.988,8.855a4.545,4.545,0,0,0,0,7.078l10.988,8.855a4.545,4.545,0,0,0,2.852,1.006h44.388a4.545,4.545,0,0,0,4.546-4.545v-17.71a4.545,4.545,0,0,0-4.546-4.545H845.7A4.545,4.545,0,0,0,842.844,477.922Z" transform="translate(788.837 157.084)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_3" data-name="直线 3" x2="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
    <line id="icon-delete_直线_4" data-name="直线 4" x1="7.743" y2="7.743" transform="translate(1651.233 644.027)" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" />\r
  </g>\r
</symbol>` });
      t.a.add(s), d.default = s;
    }, d784: function(i, d, e) {
      e("ac1f");
      var n = e("6eeb"), o = e("d039"), r = e("b622"), t = e("9263"), s = e("9112"), c = r("species"), a = !o(function() {
        var h = /./;
        return h.exec = function() {
          var p = [];
          return p.groups = { a: "7" }, p;
        }, "".replace(h, "$<a>") !== "7";
      }), u = function() {
        return "a".replace(/./, "$0") === "$0";
      }(), l = r("replace"), f = function() {
        return !!/./[l] && /./[l]("a", "$0") === "";
      }(), y = !o(function() {
        var h = /(?:)/, p = h.exec;
        h.exec = function() {
          return p.apply(this, arguments);
        };
        var v = "ab".split(h);
        return v.length !== 2 || v[0] !== "a" || v[1] !== "b";
      });
      i.exports = function(h, p, v, m) {
        var g = r(h), x = !o(function() {
          var O = {};
          return O[g] = function() {
            return 7;
          }, ""[h](O) != 7;
        }), E = x && !o(function() {
          var O = !1, N = /a/;
          return h === "split" && (N = {}, N.constructor = {}, N.constructor[c] = function() {
            return N;
          }, N.flags = "", N[g] = /./[g]), N.exec = function() {
            return O = !0, null;
          }, N[g](""), !O;
        });
        if (!x || !E || h === "replace" && (!a || !u || f) || h === "split" && !y) {
          var k = /./[g], _ = v(g, ""[h], function(O, N, S, F, V) {
            return N.exec === t ? x && !V ? { done: !0, value: k.call(N, S, F) } : { done: !0, value: O.call(S, N, F) } : { done: !1 };
          }, { REPLACE_KEEPS_$0: u, REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: f }), b = _[0], j = _[1];
          n(String.prototype, h, b), n(RegExp.prototype, g, p == 2 ? function(O, N) {
            return j.call(O, this, N);
          } : function(O) {
            return j.call(O, this);
          });
        }
        m && s(RegExp.prototype[g], "sham", !0);
      };
    }, d81d: function(i, d, e) {
      var n = e("23e7"), o = e("b727").map, r = e("1dde"), t = r("map");
      n({ target: "Array", proto: !0, forced: !t }, { map: function(s) {
        return o(this, s, arguments.length > 1 ? arguments[1] : void 0);
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
      var n = e("23e7"), o = e("83ab"), r = e("56ef"), t = e("fc6a"), s = e("06cf"), c = e("8418");
      n({ target: "Object", stat: !0, sham: !o }, { getOwnPropertyDescriptors: function(a) {
        for (var u, l, f = t(a), y = s.f, h = r(f), p = {}, v = 0; h.length > v; ) l = y(f, u = h[v++]), l !== void 0 && c(p, u, l);
        return p;
      } });
    }, ddb0: function(i, d, e) {
      var n = e("da84"), o = e("fdbc"), r = e("e260"), t = e("9112"), s = e("b622"), c = s("iterator"), a = s("toStringTag"), u = r.values;
      for (var l in o) {
        var f = n[l], y = f && f.prototype;
        if (y) {
          if (y[c] !== u) try {
            t(y, c, u);
          } catch {
            y[c] = u;
          }
          if (y[a] || t(y, a, l), o[l]) {
            for (var h in r) if (y[h] !== r[h]) try {
              t(y, h, r[h]);
            } catch {
              y[h] = r[h];
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
        function o(c, a) {
          for (var u = 0, l = c.length - 1; l >= 0; l--) {
            var f = c[l];
            f === "." ? c.splice(l, 1) : f === ".." ? (c.splice(l, 1), u++) : u && (c.splice(l, 1), u--);
          }
          if (a) for (; u--; u) c.unshift("..");
          return c;
        }
        function r(c) {
          typeof c != "string" && (c += "");
          var a, u = 0, l = -1, f = !0;
          for (a = c.length - 1; a >= 0; --a) if (c.charCodeAt(a) === 47) {
            if (!f) {
              u = a + 1;
              break;
            }
          } else l === -1 && (f = !1, l = a + 1);
          return l === -1 ? "" : c.slice(u, l);
        }
        function t(c, a) {
          if (c.filter) return c.filter(a);
          for (var u = [], l = 0; l < c.length; l++) a(c[l], l, c) && u.push(c[l]);
          return u;
        }
        d.resolve = function() {
          for (var c = "", a = !1, u = arguments.length - 1; u >= -1 && !a; u--) {
            var l = u >= 0 ? arguments[u] : n.cwd();
            if (typeof l != "string") throw new TypeError("Arguments to path.resolve must be strings");
            l && (c = l + "/" + c, a = l.charAt(0) === "/");
          }
          return c = o(t(c.split("/"), function(f) {
            return !!f;
          }), !a).join("/"), (a ? "/" : "") + c || ".";
        }, d.normalize = function(c) {
          var a = d.isAbsolute(c), u = s(c, -1) === "/";
          return c = o(t(c.split("/"), function(l) {
            return !!l;
          }), !a).join("/"), c || a || (c = "."), c && u && (c += "/"), (a ? "/" : "") + c;
        }, d.isAbsolute = function(c) {
          return c.charAt(0) === "/";
        }, d.join = function() {
          var c = Array.prototype.slice.call(arguments, 0);
          return d.normalize(t(c, function(a, u) {
            if (typeof a != "string") throw new TypeError("Arguments to path.join must be strings");
            return a;
          }).join("/"));
        }, d.relative = function(c, a) {
          function u(m) {
            for (var g = 0; g < m.length && m[g] === ""; g++) ;
            for (var x = m.length - 1; x >= 0 && m[x] === ""; x--) ;
            return g > x ? [] : m.slice(g, x - g + 1);
          }
          c = d.resolve(c).substr(1), a = d.resolve(a).substr(1);
          for (var l = u(c.split("/")), f = u(a.split("/")), y = Math.min(l.length, f.length), h = y, p = 0; p < y; p++) if (l[p] !== f[p]) {
            h = p;
            break;
          }
          var v = [];
          for (p = h; p < l.length; p++) v.push("..");
          return v = v.concat(f.slice(h)), v.join("/");
        }, d.sep = "/", d.delimiter = ":", d.dirname = function(c) {
          if (typeof c != "string" && (c += ""), c.length === 0) return ".";
          for (var a = c.charCodeAt(0), u = a === 47, l = -1, f = !0, y = c.length - 1; y >= 1; --y) if (a = c.charCodeAt(y), a === 47) {
            if (!f) {
              l = y;
              break;
            }
          } else f = !1;
          return l === -1 ? u ? "/" : "." : u && l === 1 ? "/" : c.slice(0, l);
        }, d.basename = function(c, a) {
          var u = r(c);
          return a && u.substr(-1 * a.length) === a && (u = u.substr(0, u.length - a.length)), u;
        }, d.extname = function(c) {
          typeof c != "string" && (c += "");
          for (var a = -1, u = 0, l = -1, f = !0, y = 0, h = c.length - 1; h >= 0; --h) {
            var p = c.charCodeAt(h);
            if (p !== 47) l === -1 && (f = !1, l = h + 1), p === 46 ? a === -1 ? a = h : y !== 1 && (y = 1) : a !== -1 && (y = -1);
            else if (!f) {
              u = h + 1;
              break;
            }
          }
          return a === -1 || l === -1 || y === 0 || y === 1 && a === l - 1 && a === u + 1 ? "" : c.slice(a, l);
        };
        var s = "ab".substr(-1) === "b" ? function(c, a, u) {
          return c.substr(a, u);
        } : function(c, a, u) {
          return a < 0 && (a = c.length + a), c.substr(a, u);
        };
      }).call(this, e("4362"));
    }, e017: function(i, d, e) {
      (function(n) {
        (function(o, r) {
          i.exports = r();
        })(0, function() {
          var o = function(p) {
            var v = p.id, m = p.viewBox, g = p.content;
            this.id = v, this.viewBox = m, this.content = g;
          };
          o.prototype.stringify = function() {
            return this.content;
          }, o.prototype.toString = function() {
            return this.stringify();
          }, o.prototype.destroy = function() {
            var p = this;
            ["id", "viewBox", "content"].forEach(function(v) {
              return delete p[v];
            });
          };
          var r = function(p) {
            var v = !!document.importNode, m = new DOMParser().parseFromString(p, "image/svg+xml").documentElement;
            return v ? document.importNode(m, !0) : m;
          };
          function t(p, v) {
            return v = { exports: {} }, p(v, v.exports), v.exports;
          }
          var s = t(function(p, v) {
            (function(m, g) {
              p.exports = g();
            })(0, function() {
              function m(b) {
                var j = b && typeof b == "object";
                return j && Object.prototype.toString.call(b) !== "[object RegExp]" && Object.prototype.toString.call(b) !== "[object Date]";
              }
              function g(b) {
                return Array.isArray(b) ? [] : {};
              }
              function x(b, j) {
                var O = j && j.clone === !0;
                return O && m(b) ? _(g(b), b, j) : b;
              }
              function E(b, j, O) {
                var N = b.slice();
                return j.forEach(function(S, F) {
                  typeof N[F] > "u" ? N[F] = x(S, O) : m(S) ? N[F] = _(b[F], S, O) : b.indexOf(S) === -1 && N.push(x(S, O));
                }), N;
              }
              function k(b, j, O) {
                var N = {};
                return m(b) && Object.keys(b).forEach(function(S) {
                  N[S] = x(b[S], O);
                }), Object.keys(j).forEach(function(S) {
                  m(j[S]) && b[S] ? N[S] = _(b[S], j[S], O) : N[S] = x(j[S], O);
                }), N;
              }
              function _(b, j, O) {
                var N = Array.isArray(j), S = O || { arrayMerge: E }, F = S.arrayMerge || E;
                return N ? Array.isArray(b) ? F(b, j, O) : x(j, O) : k(b, j, O);
              }
              return _.all = function(b, j) {
                if (!Array.isArray(b) || b.length < 2) throw new Error("first argument should be an array with at least two elements");
                return b.reduce(function(O, N) {
                  return _(O, N, j);
                });
              }, _;
            });
          }), c = t(function(p, v) {
            var m = { svg: { name: "xmlns", uri: "http://www.w3.org/2000/svg" }, xlink: { name: "xmlns:xlink", uri: "http://www.w3.org/1999/xlink" } };
            v.default = m, p.exports = v.default;
          }), a = function(p) {
            return Object.keys(p).map(function(v) {
              var m = p[v].toString().replace(/"/g, "&quot;");
              return v + '="' + m + '"';
            }).join(" ");
          }, u = c.svg, l = c.xlink, f = {};
          f[u.name] = u.uri, f[l.name] = l.uri;
          var y = function(p, v) {
            p === void 0 && (p = "");
            var m = s(f, {}), g = a(m);
            return "<svg " + g + ">" + p + "</svg>";
          }, h = function(p) {
            function v() {
              p.apply(this, arguments);
            }
            p && (v.__proto__ = p), v.prototype = Object.create(p && p.prototype), v.prototype.constructor = v;
            var m = { isMounted: {} };
            return m.isMounted.get = function() {
              return !!this.node;
            }, v.createFromExistingNode = function(g) {
              return new v({ id: g.getAttribute("id"), viewBox: g.getAttribute("viewBox"), content: g.outerHTML });
            }, v.prototype.destroy = function() {
              this.isMounted && this.unmount(), p.prototype.destroy.call(this);
            }, v.prototype.mount = function(g) {
              if (this.isMounted) return this.node;
              var x = typeof g == "string" ? document.querySelector(g) : g, E = this.render();
              return this.node = E, x.appendChild(E), E;
            }, v.prototype.render = function() {
              var g = this.stringify();
              return r(y(g)).childNodes[0];
            }, v.prototype.unmount = function() {
              this.node.parentNode.removeChild(this.node);
            }, Object.defineProperties(v.prototype, m), v;
          }(o);
          return h;
        });
      }).call(this, e("c8ba"));
    }, e01a: function(i, d, e) {
      var n = e("23e7"), o = e("83ab"), r = e("da84"), t = e("5135"), s = e("861d"), c = e("9bf2").f, a = e("e893"), u = r.Symbol;
      if (o && typeof u == "function" && (!("description" in u.prototype) || u().description !== void 0)) {
        var l = {}, f = function() {
          var m = arguments.length < 1 || arguments[0] === void 0 ? void 0 : String(arguments[0]), g = this instanceof f ? new u(m) : m === void 0 ? u() : u(m);
          return m === "" && (l[g] = !0), g;
        };
        a(f, u);
        var y = f.prototype = u.prototype;
        y.constructor = f;
        var h = y.toString, p = String(u("test")) == "Symbol(test)", v = /^Symbol\((.*)\)[^)]+$/;
        c(y, "description", { configurable: !0, get: function() {
          var m = s(this) ? this.valueOf() : this, g = h.call(m);
          if (t(l, m)) return "";
          var x = p ? g.slice(7, -1) : g.replace(v, "$1");
          return x === "" ? void 0 : x;
        } }), n({ global: !0, forced: !0 }, { Symbol: f });
      }
    }, e163: function(i, d, e) {
      var n = e("5135"), o = e("7b0b"), r = e("f772"), t = e("e177"), s = r("IE_PROTO"), c = Object.prototype;
      i.exports = t ? Object.getPrototypeOf : function(a) {
        return a = o(a), n(a, s) ? a[s] : typeof a.constructor == "function" && a instanceof a.constructor ? a.constructor.prototype : a instanceof Object ? c : null;
      };
    }, e177: function(i, d, e) {
      var n = e("d039");
      i.exports = !n(function() {
        function o() {
        }
        return o.prototype.constructor = null, Object.getPrototypeOf(new o()) !== o.prototype;
      });
    }, e260: function(i, d, e) {
      var n = e("fc6a"), o = e("44d2"), r = e("3f8c"), t = e("69f3"), s = e("7dd0"), c = "Array Iterator", a = t.set, u = t.getterFor(c);
      i.exports = s(Array, "Array", function(l, f) {
        a(this, { type: c, target: n(l), index: 0, kind: f });
      }, function() {
        var l = u(this), f = l.target, y = l.kind, h = l.index++;
        return !f || h >= f.length ? (l.target = void 0, { value: void 0, done: !0 }) : y == "keys" ? { value: h, done: !1 } : y == "values" ? { value: f[h], done: !1 } : { value: [h, f[h]], done: !1 };
      }, "values"), r.Arguments = r.Array, o("keys"), o("values"), o("entries");
    }, e2cc: function(i, d, e) {
      var n = e("6eeb");
      i.exports = function(o, r, t) {
        for (var s in r) n(o, s, r[s], t);
        return o;
      };
    }, e439: function(i, d, e) {
      var n = e("23e7"), o = e("d039"), r = e("fc6a"), t = e("06cf").f, s = e("83ab"), c = o(function() {
        t(1);
      }), a = !s || c;
      n({ target: "Object", stat: !0, forced: a, sham: !s }, { getOwnPropertyDescriptor: function(u, l) {
        return t(r(u), l);
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
      var n, o, r, t, s = e("23e7"), c = e("c430"), a = e("da84"), u = e("d066"), l = e("fea9"), f = e("6eeb"), y = e("e2cc"), h = e("d44e"), p = e("2626"), v = e("861d"), m = e("1c0b"), g = e("19aa"), x = e("8925"), E = e("2266"), k = e("1c7e"), _ = e("4840"), b = e("2cf4").set, j = e("b575"), O = e("cdf9"), N = e("44de"), S = e("f069"), F = e("e667"), V = e("69f3"), H = e("94ca"), te = e("b622"), I = e("605d"), T = e("2d00"), A = te("species"), L = "Promise", P = V.get, Q = V.set, J = V.getterFor(L), M = l, be = a.TypeError, pe = a.document, Pe = a.process, Be = u("fetch"), $e = S.f, Te = $e, Ae = !!(pe && pe.createEvent && a.dispatchEvent), Ke = typeof PromiseRejectionEvent == "function", nt = "unhandledrejection", $ = "rejectionhandled", D = 0, G = 1, q = 2, Y = 1, re = 2, me = H(L, function() {
        var z = x(M) !== String(M);
        if (!z && (T === 66 || !I && !Ke) || c && !M.prototype.finally) return !0;
        if (T >= 51 && /native code/.test(M)) return !1;
        var ne = M.resolve(1), ue = function(W) {
          W(function() {
          }, function() {
          });
        }, de = ne.constructor = {};
        return de[A] = ue, !(ne.then(function() {
        }) instanceof ue);
      }), he = me || !k(function(z) {
        M.all(z).catch(function() {
        });
      }), se = function(z) {
        var ne;
        return !(!v(z) || typeof (ne = z.then) != "function") && ne;
      }, we = function(z, ne) {
        if (!z.notified) {
          z.notified = !0;
          var ue = z.reactions;
          j(function() {
            for (var de = z.value, W = z.state == G, X = 0; ue.length > X; ) {
              var ae, fe, Ue, qe = ue[X++], Ze = W ? qe.ok : qe.fail, ye = qe.resolve, et = qe.reject, Qe = qe.domain;
              try {
                Ze ? (W || (z.rejection === re && Ve(z), z.rejection = Y), Ze === !0 ? ae = de : (Qe && Qe.enter(), ae = Ze(de), Qe && (Qe.exit(), Ue = !0)), ae === qe.promise ? et(be("Promise-chain cycle")) : (fe = se(ae)) ? fe.call(ae, ye, et) : ye(ae)) : et(de);
              } catch (ht) {
                Qe && !Ue && Qe.exit(), et(ht);
              }
            }
            z.reactions = [], z.notified = !1, ne && !z.rejection && Re(z);
          });
        }
      }, ke = function(z, ne, ue) {
        var de, W;
        Ae ? (de = pe.createEvent("Event"), de.promise = ne, de.reason = ue, de.initEvent(z, !1, !0), a.dispatchEvent(de)) : de = { promise: ne, reason: ue }, !Ke && (W = a["on" + z]) ? W(de) : z === nt && N("Unhandled promise rejection", ue);
      }, Re = function(z) {
        b.call(a, function() {
          var ne, ue = z.facade, de = z.value, W = je(z);
          if (W && (ne = F(function() {
            I ? Pe.emit("unhandledRejection", de, ue) : ke(nt, ue, de);
          }), z.rejection = I || je(z) ? re : Y, ne.error)) throw ne.value;
        });
      }, je = function(z) {
        return z.rejection !== Y && !z.parent;
      }, Ve = function(z) {
        b.call(a, function() {
          var ne = z.facade;
          I ? Pe.emit("rejectionHandled", ne) : ke($, ne, z.value);
        });
      }, Ye = function(z, ne, ue) {
        return function(de) {
          z(ne, de, ue);
        };
      }, Xe = function(z, ne, ue) {
        z.done || (z.done = !0, ue && (z = ue), z.value = ne, z.state = q, we(z, !0));
      }, ot = function(z, ne, ue) {
        if (!z.done) {
          z.done = !0, ue && (z = ue);
          try {
            if (z.facade === ne) throw be("Promise can't be resolved itself");
            var de = se(ne);
            de ? j(function() {
              var W = { done: !1 };
              try {
                de.call(ne, Ye(ot, W, z), Ye(Xe, W, z));
              } catch (X) {
                Xe(W, X, z);
              }
            }) : (z.value = ne, z.state = G, we(z, !1));
          } catch (W) {
            Xe({ done: !1 }, W, z);
          }
        }
      };
      me && (M = function(z) {
        g(this, M, L), m(z), n.call(this);
        var ne = P(this);
        try {
          z(Ye(ot, ne), Ye(Xe, ne));
        } catch (ue) {
          Xe(ne, ue);
        }
      }, n = function(z) {
        Q(this, { type: L, done: !1, notified: !1, parent: !1, reactions: [], rejection: !1, state: D, value: void 0 });
      }, n.prototype = y(M.prototype, { then: function(z, ne) {
        var ue = J(this), de = $e(_(this, M));
        return de.ok = typeof z != "function" || z, de.fail = typeof ne == "function" && ne, de.domain = I ? Pe.domain : void 0, ue.parent = !0, ue.reactions.push(de), ue.state != D && we(ue, !1), de.promise;
      }, catch: function(z) {
        return this.then(void 0, z);
      } }), o = function() {
        var z = new n(), ne = P(z);
        this.promise = z, this.resolve = Ye(ot, ne), this.reject = Ye(Xe, ne);
      }, S.f = $e = function(z) {
        return z === M || z === r ? new o(z) : Te(z);
      }, c || typeof l != "function" || (t = l.prototype.then, f(l.prototype, "then", function(z, ne) {
        var ue = this;
        return new M(function(de, W) {
          t.call(ue, de, W);
        }).then(z, ne);
      }, { unsafe: !0 }), typeof Be == "function" && s({ global: !0, enumerable: !0, forced: !0 }, { fetch: function(z) {
        return O(M, Be.apply(a, arguments));
      } }))), s({ global: !0, wrap: !0, forced: me }, { Promise: M }), h(M, L, !1, !0), p(L), r = u(L), s({ target: L, stat: !0, forced: me }, { reject: function(z) {
        var ne = $e(this);
        return ne.reject.call(void 0, z), ne.promise;
      } }), s({ target: L, stat: !0, forced: c || me }, { resolve: function(z) {
        return O(c && this === r ? M : this, z);
      } }), s({ target: L, stat: !0, forced: he }, { all: function(z) {
        var ne = this, ue = $e(ne), de = ue.resolve, W = ue.reject, X = F(function() {
          var ae = m(ne.resolve), fe = [], Ue = 0, qe = 1;
          E(z, function(Ze) {
            var ye = Ue++, et = !1;
            fe.push(void 0), qe++, ae.call(ne, Ze).then(function(Qe) {
              et || (et = !0, fe[ye] = Qe, --qe || de(fe));
            }, W);
          }), --qe || de(fe);
        });
        return X.error && W(X.value), ue.promise;
      }, race: function(z) {
        var ne = this, ue = $e(ne), de = ue.reject, W = F(function() {
          var X = m(ne.resolve);
          E(z, function(ae) {
            X.call(ne, ae).then(ue.resolve, de);
          });
        });
        return W.error && de(W.value), ue.promise;
      } });
    }, e893: function(i, d, e) {
      var n = e("5135"), o = e("56ef"), r = e("06cf"), t = e("9bf2");
      i.exports = function(s, c) {
        for (var a = o(c), u = t.f, l = r.f, f = 0; f < a.length; f++) {
          var y = a[f];
          n(s, y) || u(s, y, l(c, y));
        }
      };
    }, e8b5: function(i, d, e) {
      var n = e("c6b6");
      i.exports = Array.isArray || function(o) {
        return n(o) == "Array";
      };
    }, e95a: function(i, d, e) {
      var n = e("b622"), o = e("3f8c"), r = n("iterator"), t = Array.prototype;
      i.exports = function(s) {
        return s !== void 0 && (o.Array === s || t[r] === s);
      };
    }, ec57: function(i, d, e) {
      var n = { "./back.svg": "d40d", "./close.svg": "4f43", "./delete.svg": "d69c", "./drag.svg": "7eb5", "./handwrite.svg": "545a", "./upper.svg": "6d55" };
      function o(t) {
        var s = r(t);
        return e(s);
      }
      function r(t) {
        if (!e.o(n, t)) {
          var s = new Error("Cannot find module '" + t + "'");
          throw s.code = "MODULE_NOT_FOUND", s;
        }
        return n[t];
      }
      o.keys = function() {
        return Object.keys(n);
      }, o.resolve = r, i.exports = o, o.id = "ec57";
    }, f069: function(i, d, e) {
      var n = e("1c0b"), o = function(r) {
        var t, s;
        this.promise = new r(function(c, a) {
          if (t !== void 0 || s !== void 0) throw TypeError("Bad Promise constructor");
          t = c, s = a;
        }), this.resolve = n(t), this.reject = n(s);
      };
      i.exports.f = function(r) {
        return new o(r);
      };
    }, f183: function(i, d, e) {
      var n = e("d012"), o = e("861d"), r = e("5135"), t = e("9bf2").f, s = e("90e3"), c = e("bb2f"), a = s("meta"), u = 0, l = Object.isExtensible || function() {
        return !0;
      }, f = function(m) {
        t(m, a, { value: { objectID: "O" + ++u, weakData: {} } });
      }, y = function(m, g) {
        if (!o(m)) return typeof m == "symbol" ? m : (typeof m == "string" ? "S" : "P") + m;
        if (!r(m, a)) {
          if (!l(m)) return "F";
          if (!g) return "E";
          f(m);
        }
        return m[a].objectID;
      }, h = function(m, g) {
        if (!r(m, a)) {
          if (!l(m)) return !0;
          if (!g) return !1;
          f(m);
        }
        return m[a].weakData;
      }, p = function(m) {
        return c && v.REQUIRED && l(m) && !r(m, a) && f(m), m;
      }, v = i.exports = { REQUIRED: !1, fastKey: y, getWeakData: h, onFreeze: p };
      n[a] = !0;
    }, f5df: function(i, d, e) {
      var n = e("00ee"), o = e("c6b6"), r = e("b622"), t = r("toStringTag"), s = o(/* @__PURE__ */ function() {
        return arguments;
      }()) == "Arguments", c = function(a, u) {
        try {
          return a[u];
        } catch {
        }
      };
      i.exports = n ? o : function(a) {
        var u, l, f;
        return a === void 0 ? "Undefined" : a === null ? "Null" : typeof (l = c(u = Object(a), t)) == "string" ? l : s ? o(u) : (f = o(u)) == "Object" && typeof u.callee == "function" ? "Arguments" : f;
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
      var t = e("8bbf"), s = { class: "key-board-container" }, c = { class: "key-board-area" };
      function a(w, U, R, B, K, ie) {
        var le = Object(t.resolveComponent)("Result"), ce = Object(t.resolveComponent)("DefaultBoard"), ve = Object(t.resolveComponent)("HandBoard"), Ie = Object(t.resolveComponent)("svg-icon"), De = Object(t.resolveDirective)("handleDrag");
        return Object(t.openBlock)(), Object(t.createBlock)(t.Transition, { name: w.animateClass || "move-bottom-to-top" }, { default: Object(t.withCtx)(function() {
          return [w.visible ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board", onMousedown: U[1] || (U[1] = Object(t.withModifiers)(function() {
          }, ["prevent"])) }, [Object(t.createVNode)("div", s, [Object(t.createVNode)(le, { data: w.resultVal, onChange: w.change }, null, 8, ["data", "onChange"]), Object(t.createVNode)("div", c, [w.showMode === "default" ? (Object(t.openBlock)(), Object(t.createBlock)(ce, { key: 0, ref: "defaultBoardRef", onTrigger: w.trigger, onChange: w.change, onTranslate: w.translate }, null, 8, ["onTrigger", "onChange", "onTranslate"])) : Object(t.createCommentVNode)("", !0), w.showMode === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)(ve, { key: 1, onTrigger: w.trigger, onChange: w.change }, null, 8, ["onTrigger", "onChange"])) : Object(t.createCommentVNode)("", !0)])]), w.showHandleBar ? Object(t.withDirectives)((Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-drag-handle", style: { color: w.color } }, [Object(t.createVNode)("span", null, Object(t.toDisplayString)(w.dargHandleText || "将键盘拖到您喜欢的位置"), 1), Object(t.createVNode)(Ie, { "icon-class": "drag" })], 4)), [[De]]) : Object(t.createCommentVNode)("", !0)], 32)) : Object(t.createCommentVNode)("", !0)];
        }), _: 1 }, 8, ["name"]);
      }
      e("b64b"), e("a4d3"), e("4de4"), e("e439"), e("159b"), e("dbb4");
      function u(w, U, R) {
        return U in w ? Object.defineProperty(w, U, { value: R, enumerable: !0, configurable: !0, writable: !0 }) : w[U] = R, w;
      }
      function l(w, U) {
        var R = Object.keys(w);
        if (Object.getOwnPropertySymbols) {
          var B = Object.getOwnPropertySymbols(w);
          U && (B = B.filter(function(K) {
            return Object.getOwnPropertyDescriptor(w, K).enumerable;
          })), R.push.apply(R, B);
        }
        return R;
      }
      function f(w) {
        for (var U = 1; U < arguments.length; U++) {
          var R = arguments[U] != null ? arguments[U] : {};
          U % 2 ? l(Object(R), !0).forEach(function(B) {
            u(w, B, R[B]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(w, Object.getOwnPropertyDescriptors(R)) : l(Object(R)).forEach(function(B) {
            Object.defineProperty(w, B, Object.getOwnPropertyDescriptor(R, B));
          });
        }
        return w;
      }
      function y(w, U) {
        (U == null || U > w.length) && (U = w.length);
        for (var R = 0, B = new Array(U); R < U; R++) B[R] = w[R];
        return B;
      }
      function h(w) {
        if (Array.isArray(w)) return y(w);
      }
      e("e01a"), e("d3b7"), e("d28b"), e("3ca3"), e("e260"), e("ddb0"), e("a630");
      function p(w) {
        if (typeof Symbol < "u" && Symbol.iterator in Object(w)) return Array.from(w);
      }
      e("fb6a");
      function v(w, U) {
        if (w) {
          if (typeof w == "string") return y(w, U);
          var R = Object.prototype.toString.call(w).slice(8, -1);
          return R === "Object" && w.constructor && (R = w.constructor.name), R === "Map" || R === "Set" ? Array.from(w) : R === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(R) ? y(w, U) : void 0;
        }
      }
      function m() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function g(w) {
        return h(w) || p(w) || v(w) || m();
      }
      e("d81d"), e("7db0"), e("99af"), e("4d63"), e("ac1f"), e("25f0"), e("13d5"), e("5530"), e("7320");
      function x(w, U) {
        if (!(w instanceof U)) throw new TypeError("Cannot call a class as a function");
      }
      function E(w, U) {
        for (var R = 0; R < U.length; R++) {
          var B = U[R];
          B.enumerable = B.enumerable || !1, B.configurable = !0, "value" in B && (B.writable = !0), Object.defineProperty(w, B.key, B);
        }
      }
      function k(w, U, R) {
        return U && E(w.prototype, U), w;
      }
      var _ = function() {
        function w() {
          x(this, w), this.listeners = {};
        }
        return k(w, [{ key: "on", value: function(U, R) {
          var B = this, K = this.listeners[U];
          return K || (K = []), K.push(R), this.listeners[U] = K, function() {
            B.remove(U, R);
          };
        } }, { key: "emit", value: function(U) {
          var R = this.listeners[U];
          if (Array.isArray(R)) {
            for (var B = arguments.length, K = new Array(B > 1 ? B - 1 : 0), ie = 1; ie < B; ie++) K[ie - 1] = arguments[ie];
            for (var le = 0; le < R.length; le++) {
              var ce = R[le];
              typeof ce == "function" && ce.apply(void 0, K);
            }
          }
        } }, { key: "remove", value: function(U, R) {
          if (R) {
            var B = this.listeners[U];
            if (!B) return;
            B = B.filter(function(K) {
              return K !== R;
            }), this.listeners[U] = B;
          } else this.listeners[U] = null, delete this.listeners[U];
        } }]), w;
      }(), b = new _(), j = { mounted: function(w, U, R) {
        var B = w.parentNode;
        w.onmousedown = function(K) {
          var ie = K.clientX - B.offsetLeft, le = K.clientY - B.offsetTop;
          document.onmousemove = function(ce) {
            var ve = ce.clientX - ie, Ie = ce.clientY - le;
            B.style.left = ve + "px", B.style.top = Ie + "px";
          }, document.onmouseup = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.onmousemove = null, document.onmouseup = null;
          };
        }, w.ontouchstart = function(K) {
          var ie = K.touches[0].pageX, le = K.touches[0].pageY, ce = ie - B.offsetLeft, ve = le - B.offsetTop;
          document.ontouchmove = function(Ie) {
            var De = Ie.touches[0].pageX, Fe = Ie.touches[0].pageY, We = De - ce, dt = Fe - ve;
            B.style.left = We + "px", B.style.top = dt + "px";
          }, document.ontouchend = function() {
            Object(t.nextTick)(function() {
              b.emit("updateBound");
            }), document.ontouchmove = null, document.ontouchend = null;
          };
        };
      } }, O = j, N = Object(t.withScopeId)("data-v-02e63132");
      Object(t.pushScopeId)("data-v-02e63132");
      var S = { key: 0, class: "key-board-code-show" }, F = { class: "key-board-result-show" }, V = { class: "key-board-result-show-container" }, H = { key: 0, class: "key-board-result-show-more" };
      Object(t.popScopeId)();
      var te = N(function(w, U, R, B, K, ie) {
        return w.status === "CN" || w.status === "handwrite" ? (Object(t.openBlock)(), Object(t.createBlock)("div", { key: 0, class: "key-board-result", style: { color: w.color } }, [w.status === "CN" ? (Object(t.openBlock)(), Object(t.createBlock)("div", S, Object(t.toDisplayString)(w.data.code), 1)) : Object(t.createCommentVNode)("", !0), Object(t.createVNode)("div", F, [Object(t.createVNode)("div", V, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.showList[w.showIndex], function(le, ce) {
          return Object(t.openBlock)(), Object(t.createBlock)("span", { key: ce, onClick: function(ve) {
            return w.selectWord(le);
          } }, Object(t.toDisplayString)(ce + 1) + "." + Object(t.toDisplayString)(le), 9, ["onClick"]);
        }), 128))]), w.valueList.length > 11 ? (Object(t.openBlock)(), Object(t.createBlock)("div", H, [Object(t.createVNode)("span", { style: w.getStyle, onClick: U[1] || (U[1] = function() {
          return w.upper && w.upper.apply(w, arguments);
        }) }, null, 4), Object(t.createVNode)("span", { style: w.getStyle, onClick: U[2] || (U[2] = function() {
          return w.lower && w.lower.apply(w, arguments);
        }) }, null, 4)])) : Object(t.createCommentVNode)("", !0)])], 4)) : Object(t.createCommentVNode)("", !0);
      }), I = (e("1276"), e("6062"), e("5319"), function(w, U) {
        for (var R = 0, B = []; R < w.length; ) B.push(w.slice(R, R += U));
        return B;
      }), T = Symbol("KEYBOARD_CONTEXT"), A = function(w) {
        Object(t.provide)(T, w);
      }, L = function() {
        return Object(t.inject)(T);
      }, P = Object(t.defineComponent)({ props: { data: Object }, emits: ["change"], setup: function(w, U) {
        var R = U.emit, B = L(), K = Object(t.computed)(function() {
          return { borderTopColor: B == null ? void 0 : B.color };
        }), ie = Object(t.reactive)({ status: "", valueList: [], showList: [], showIndex: 0 });
        function le() {
          ie.showIndex !== 0 && (ie.showIndex -= 1);
        }
        function ce() {
          ie.showIndex !== ie.showList.length - 1 && (ie.showIndex += 1);
        }
        function ve() {
          ie.showIndex = 0, ie.showList = [], ie.valueList = [], b.emit("resultReset");
        }
        function Ie(De) {
          ve(), R("change", De);
        }
        return Object(t.watch)(function() {
          return w.data;
        }, function(De) {
          var Fe;
          ie.showIndex = 0, ie.valueList = (De == null || (Fe = De.value) === null || Fe === void 0 ? void 0 : Fe.split("")) || [], ie.valueList.length !== 0 ? ie.showList = I(ie.valueList, 11) : ie.showList = [];
        }, { immediate: !0 }), Object(t.onMounted)(function() {
          b.on("keyBoardChange", function(De) {
            b.emit("updateBound"), ie.status = De, ve();
          }), b.on("getWordsFromServer", function(De) {
            var Fe = Array.from(new Set(De.replace(/\s+/g, "").split("")));
            ie.valueList = Fe, ie.showList = I(Fe, 11);
          });
        }), Object(t.onUnmounted)(function() {
          b.remove("keyBoardChange"), b.remove("getWordsFromServer");
        }), f({ color: B == null ? void 0 : B.color, upper: le, lower: ce, getStyle: K, selectWord: Ie }, Object(t.toRefs)(ie));
      } });
      e("e66c"), P.render = te, P.__scopeId = "data-v-02e63132";
      var Q = P, J = e("bc3a"), M = e.n(J), be = 15e3, pe = function(w) {
        M.a.defaults.baseURL = w, M.a.defaults.timeout = be, M.a.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      };
      function Pe(w, U, R, B, K, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("svg", { class: "svg-icon", style: { stroke: w.color } }, [Object(t.createVNode)("use", { "xlink:href": w.iconName }, null, 8, ["xlink:href"])], 4);
      }
      var Be = Object(t.defineComponent)({ name: "SvgIcon", props: { iconClass: { type: String, required: !0 }, className: { type: String, default: "" } }, setup: function(w) {
        var U = L(), R = Object(t.computed)(function() {
          return "#icon-".concat(w.iconClass);
        });
        return { color: U == null ? void 0 : U.color, iconName: R };
      } });
      e("38cd"), Be.render = Pe;
      var $e = Be, Te = Object(t.withScopeId)("data-v-1b5e0983");
      Object(t.pushScopeId)("data-v-1b5e0983");
      var Ae = { class: "hand-write-board" }, Ke = { class: "hand-write-board-opers" };
      Object(t.popScopeId)();
      var nt = Te(function(w, U, R, B, K, ie) {
        var le = Object(t.resolveComponent)("PaintBoard"), ce = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Ae, [Object(t.createVNode)(le, { lib: w.isCn ? "CN" : "EN" }, null, 8, ["lib"]), Object(t.createVNode)("div", Ke, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.handBoardOperList, function(ve) {
          return Object(t.openBlock)(), Object(t.createBlock)(ce, { key: ve.type, type: ve.type, data: ve.data, isCn: w.isCn, onClick: w.click }, null, 8, ["type", "data", "isCn", "onClick"]);
        }), 128))])]);
      }), $ = { class: "paint-board" };
      function D(w, U, R, B, K, ie) {
        return Object(t.openBlock)(), Object(t.createBlock)("div", $, [Object(t.createVNode)("canvas", { ref: "canvasRef", width: w.width, height: w.height, onTouchstart: U[1] || (U[1] = function() {
          return w.down && w.down.apply(w, arguments);
        }), onTouchmove: U[2] || (U[2] = function() {
          return w.move && w.move.apply(w, arguments);
        }), onTouchend: U[3] || (U[3] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }), onMousedown: U[4] || (U[4] = function() {
          return w.down && w.down.apply(w, arguments);
        }), onMousemove: U[5] || (U[5] = function() {
          return w.move && w.move.apply(w, arguments);
        }), onMouseup: U[6] || (U[6] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }), onMouseleave: U[7] || (U[7] = function() {
          return w.mouseup && w.mouseup.apply(w, arguments);
        }) }, null, 40, ["width", "height"])]);
      }
      e("e6cf");
      function G(w, U, R, B, K, ie, le) {
        try {
          var ce = w[ie](le), ve = ce.value;
        } catch (Ie) {
          return void R(Ie);
        }
        ce.done ? U(ve) : Promise.resolve(ve).then(B, K);
      }
      function q(w) {
        return function() {
          var U = this, R = arguments;
          return new Promise(function(B, K) {
            var ie = w.apply(U, R);
            function le(ve) {
              G(ie, B, K, le, ce, "next", ve);
            }
            function ce(ve) {
              G(ie, B, K, le, ce, "throw", ve);
            }
            le(void 0);
          });
        };
      }
      e("96cf"), e("caad"), e("2532");
      var Y, re, me = function() {
        var w = q(regeneratorRuntime.mark(function U(R, B, K, ie) {
          return regeneratorRuntime.wrap(function(le) {
            for (; ; ) switch (le.prev = le.next) {
              case 0:
                return le.next = 2, M.a.post("", { lib: ie, lpXis: R, lpYis: B, lpCis: K });
              case 2:
                return le.abrupt("return", le.sent);
              case 3:
              case "end":
                return le.stop();
            }
          }, U);
        }));
        return function(U, R, B, K) {
          return w.apply(this, arguments);
        };
      }(), he = Object(t.defineComponent)({ name: "PaintBoard", props: { lib: String }, setup: function(w) {
        var U = L(), R = Object(t.reactive)({ width: 0, height: 0, isMouseDown: !1, x: 0, y: 0, oldX: 0, oldY: 0, clickX: [], clickY: [], clickC: [] }), B = Object(t.ref)(null);
        function K() {
          return ie.apply(this, arguments);
        }
        function ie() {
          return ie = q(regeneratorRuntime.mark(function Ee() {
            var ze, Me;
            return regeneratorRuntime.wrap(function(Je) {
              for (; ; ) switch (Je.prev = Je.next) {
                case 0:
                  return Je.next = 2, me(R.clickX, R.clickY, R.clickC, w.lib);
                case 2:
                  ze = Je.sent, Me = ze.data, b.emit("getWordsFromServer", (Me == null ? void 0 : Me.v) || "");
                case 5:
                case "end":
                  return Je.stop();
              }
            }, Ee);
          })), ie.apply(this, arguments);
        }
        function le() {
          B.value && Y && (R.clickX = [], R.clickY = [], R.clickC = [], Y.clearRect(0, 0, R.width, R.height));
        }
        function ce(Ee) {
          if (Ee.type.includes("mouse")) {
            var ze = Ee;
            return Math.floor(ze.clientX - R.x);
          }
          if (Ee.type.includes("touch")) {
            var Me, Je = Ee;
            return Math.floor(((Me = Je.targetTouches[0]) === null || Me === void 0 ? void 0 : Me.clientX) - R.x);
          }
          return 0;
        }
        function ve(Ee) {
          if (Ee.type.includes("mouse")) {
            var ze = Ee;
            return Math.floor(ze.clientY - R.y);
          }
          if (Ee.type.includes("touch")) {
            var Me, Je = Ee;
            return Math.floor(((Me = Je.targetTouches[0]) === null || Me === void 0 ? void 0 : Me.clientY) - R.y);
          }
          return 0;
        }
        function Ie(Ee) {
          if (Y) {
            R.isMouseDown = !0;
            var ze = ce(Ee), Me = ve(Ee);
            clearTimeout(re), R.oldX = ze, R.oldY = Me, Y.beginPath();
          }
        }
        function De(Ee) {
          if (Y && (Ee.preventDefault(), R.isMouseDown)) {
            var ze = ce(Ee), Me = ve(Ee);
            R.clickX.push(ze), R.clickY.push(Me), R.clickC.push(0), Y.strokeStyle = U == null ? void 0 : U.color, Y.fillStyle = U == null ? void 0 : U.color, Y.lineWidth = 4, Y.lineCap = "round", Y.moveTo(R.oldX, R.oldY), Y.lineTo(ze, Me), Y.stroke(), R.oldX = ze, R.oldY = Me;
          }
        }
        function Fe() {
          R.isMouseDown && (R.isMouseDown = !1, re = setTimeout(function() {
            le();
          }, 1500), R.clickC.pop(), R.clickC.push(1), K());
        }
        function We() {
          Object(t.nextTick)(function() {
            if (document.querySelector(".paint-board")) {
              var Ee = document.querySelector(".paint-board").getBoundingClientRect();
              R.x = Ee.x, R.y = Ee.y, R.width = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).width), R.height = parseFloat(window.getComputedStyle(document.querySelector(".paint-board")).height);
            }
          });
        }
        function dt() {
          var Ee;
          Y = (Ee = B.value) === null || Ee === void 0 ? void 0 : Ee.getContext("2d"), le(), We(), window.addEventListener("animationend", We), window.addEventListener("resize", We), window.addEventListener("scroll", We);
        }
        return Object(t.onMounted)(function() {
          dt(), b.on("updateBound", function() {
            We();
          });
        }), Object(t.onUnmounted)(function() {
          window.removeEventListener("animationend", We), window.removeEventListener("resize", We), window.removeEventListener("scroll", We), b.remove("updateBound");
        }), f(f({}, Object(t.toRefs)(R)), {}, { move: De, down: Ie, mouseup: Fe, canvasRef: B });
      } });
      he.render = D;
      var se = he;
      function we(w, U, R, B, K, ie) {
        var le = Object(t.resolveComponent)("svg-icon");
        return Object(t.openBlock)(), Object(t.createBlock)("button", { class: ["key-board-button", "key-board-button-".concat(w.type), { "key-board-button-active": w.isUpper && w.type === "upper" || w.isNum && w.type === "change2num" || w.isSymbol && w.type === "#+=" }], style: w.getStyle, onClick: U[1] || (U[1] = function() {
          return w.click && w.click.apply(w, arguments);
        }), onMouseenter: U[2] || (U[2] = function(ce) {
          return w.isHoverStatus = !0;
        }), onMouseleave: U[3] || (U[3] = function(ce) {
          return w.isHoverStatus = !1;
        }) }, [w.type === "upper" || w.type === "delete" || w.type === "handwrite" || w.type === "close" || w.type === "back" ? (Object(t.openBlock)(), Object(t.createBlock)(le, { key: 0, "icon-class": w.type }, null, 8, ["icon-class"])) : (Object(t.openBlock)(), Object(t.createBlock)("span", { key: 1, innerHTML: w.getCode }, null, 8, ["innerHTML"]))], 38);
      }
      var ke = Object(t.defineComponent)({ name: "KeyCodeButton", components: { SvgIcon: $e }, props: { type: String, data: String, isCn: Boolean, isNum: Boolean, isUpper: Boolean, isSymbol: Boolean }, emits: ["click"], setup: function(w, U) {
        var R = U.emit, B = L(), K = Object(t.ref)(!1), ie = Object(t.computed)(function() {
          return w.type === "change2lang" ? w.isCn ? "<label>中</label>/EN" : "<label>EN</label>/中" : w.isUpper ? w.data.toUpperCase() : w.data;
        }), le = Object(t.computed)(function() {
          return w.isUpper && w.type === "upper" || w.isNum && w.type === "change2num" || w.isSymbol && w.type === "#+=" || K.value ? { color: "#f5f5f5", background: B == null ? void 0 : B.color } : { color: B == null ? void 0 : B.color, background: "#f5f5f5" };
        });
        function ce(ve) {
          ve.preventDefault(), R("click", { data: w.isUpper ? w.data.toUpperCase() : w.data, type: w.type });
        }
        return { isHoverStatus: K, getStyle: le, getCode: ie, click: ce };
      } });
      e("de23"), ke.render = we;
      var Re = ke, je = Object(t.defineComponent)({ name: "PaintPart", components: { PaintBoard: se, KeyCodeButton: Re }, setup: function(w, U) {
        var R = U.emit, B = L(), K = Object(t.reactive)({ handBoardOperList: [{ data: "中/EN", type: "change2lang" }, { data: "", type: "back" }, { data: "", type: "delete" }, { data: "", type: "close" }], isCn: !0 });
        function ie(le) {
          var ce = le.data, ve = le.type;
          switch (ve) {
            case "close":
              B == null || B.closeKeyBoard();
              break;
            case "back":
              B == null || B.changeDefaultBoard(), b.emit("resultReset"), b.emit("keyBoardChange", K.isCn && "CN");
              break;
            case "change2lang":
              K.isCn = !K.isCn;
              break;
            case "delete":
              R("trigger", { data: ce, type: ve });
              break;
          }
        }
        return f({ click: ie }, Object(t.toRefs)(K));
      } });
      e("9aaf"), je.render = nt, je.__scopeId = "data-v-1b5e0983";
      var Ve = je, Ye = Object(t.withScopeId)("data-v-4b78e5a1");
      Object(t.pushScopeId)("data-v-4b78e5a1");
      var Xe = { class: "default-key-board" }, ot = { class: "line line4" };
      Object(t.popScopeId)();
      var z = Ye(function(w, U, R, B, K, ie) {
        var le = Object(t.resolveComponent)("KeyCodeButton");
        return Object(t.openBlock)(), Object(t.createBlock)("div", Xe, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.lineList, function(ce, ve) {
          return Object(t.openBlock)(), Object(t.createBlock)("div", { class: ["line", "line".concat(ve + 1)], key: ve }, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(ce, function(Ie) {
            return Object(t.openBlock)(), Object(t.createBlock)(le, { isUpper: w.isUpper, key: Ie, type: Ie, data: Ie, isSymbol: w.isSymbol, onClick: w.click }, null, 8, ["isUpper", "type", "data", "isSymbol", "onClick"]);
          }), 128))], 2);
        }), 128)), Object(t.createVNode)("div", ot, [(Object(t.openBlock)(!0), Object(t.createBlock)(t.Fragment, null, Object(t.renderList)(w.line4, function(ce) {
          return Object(t.openBlock)(), Object(t.createBlock)(le, { key: ce.type, type: ce.type, data: ce.data, isCn: w.isCn, isNum: w.isNum, onClick: w.click }, null, 8, ["type", "data", "isCn", "isNum", "onClick"]);
        }), 128))])]);
      }), ne = (e("a434"), { line1: ["[", "]", "{", "}", "+", "-", "*", "/", "%", "="], line2: ["_", "—", "|", "~", "^", "《", "》", "$", "&"], line3: ["#+=", "……", ",", "?", "!", ".", "’", "'", "delete"] }), ue = { line1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], line2: ["a", "s", "d", "f", "g", "h", "j", "k", "l"], line3: ["upper", "z", "x", "c", "v", "b", "n", "m", "delete"] }, de = { line1: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], line2: ["-", "/", ":", "(", ")", "¥", "@", "“", "”"], line3: ["#+=", "。", "，", "、", "？", "！", ".", ";", "delete"] }, W = [{ data: ".?123", type: "change2num" }, { data: "", type: "change2lang" }, { data: " ", type: "space" }, { data: "", type: "close" }], X = Object(t.defineComponent)({ name: "DefaultKeyBoard", components: { KeyCodeButton: Re }, emits: ["translate", "trigger", "change"], setup: function(w, U) {
        var R = U.emit, B = L(), K = Object(t.reactive)({ lineList: [ue.line1, ue.line2, ue.line3], line4: [], isUpper: !1, isCn: !0, isNum: !1, isSymbol: !1, oldVal: "" });
        function ie() {
          var ce;
          K.line4 = JSON.parse(JSON.stringify(W)), B != null && (ce = B.modeList) !== null && ce !== void 0 && ce.find(function(ve) {
            return ve === "handwrite";
          }) && B !== null && B !== void 0 && B.handApi && K.line4.splice(2, 0, { data: "", type: "handwrite" });
        }
        function le(ce) {
          var ve = ce.data, Ie = ce.type;
          switch (Ie) {
            case "close":
              K.oldVal = "", B == null || B.closeKeyBoard();
              break;
            case "upper":
              K.oldVal = "", K.isUpper = !K.isUpper;
              break;
            case "change2lang":
              K.isCn = !K.isCn, K.isNum || K.isSymbol || b.emit("keyBoardChange", K.isCn ? "CN" : "EN");
              break;
            case "change2num":
              if (K.isNum = !K.isNum, K.isSymbol = !1, K.isNum) {
                var De;
                b.emit("keyBoardChange", "number");
                var Fe = JSON.parse(JSON.stringify(de.line3));
                B != null && (De = B.modeList) !== null && De !== void 0 && De.find(function(We) {
                  return We === "symbol";
                }) || (Fe.shift(), Fe.unshift("+")), K.lineList = [de.line1, de.line2, Fe];
              } else b.emit("keyBoardChange", K.isCn ? "CN" : "EN"), K.lineList = [ue.line1, ue.line2, ue.line3];
              break;
            case "#+=":
              K.isSymbol = !K.isSymbol, K.isSymbol ? (b.emit("keyBoardChange", "symbol"), K.lineList = [ne.line1, ne.line2, ne.line3]) : (b.emit("keyBoardChange", "number"), K.lineList = [de.line1, de.line2, de.line3]);
              break;
            case "handwrite":
            case "delete":
              K.isCn && Ie === "delete" && K.oldVal ? (K.oldVal = K.oldVal.substr(0, K.oldVal.length - 1), R("translate", K.oldVal)) : (Ie === "handwrite" && b.emit("keyBoardChange", "handwrite"), R("trigger", { data: ve, type: Ie }));
              break;
            default:
              !K.isCn || K.isNum || K.isSymbol ? R("change", ve) : (R("translate", K.oldVal + ve), K.oldVal = K.oldVal + ve);
              break;
          }
        }
        return ie(), Object(t.onMounted)(function() {
          b.on("resultReset", function() {
            K.oldVal = "";
          });
        }), f(f({}, Object(t.toRefs)(K)), {}, { click: le });
      } });
      e("f8b0"), X.render = z, X.__scopeId = "data-v-4b78e5a1";
      var ae = X, fe = { a: "阿啊呵腌嗄吖锕", e: "额阿俄恶鹅遏鄂厄饿峨扼娥鳄哦蛾噩愕讹锷垩婀鹗萼谔莪腭锇颚呃阏屙苊轭", ai: "爱埃艾碍癌哀挨矮隘蔼唉皑哎霭捱暧嫒嗳瑷嗌锿砹", ei: "诶", xi: "系西席息希习吸喜细析戏洗悉锡溪惜稀袭夕洒晰昔牺腊烯熙媳栖膝隙犀蹊硒兮熄曦禧嬉玺奚汐徙羲铣淅嘻歙熹矽蟋郗唏皙隰樨浠忾蜥檄郄翕阋鳃舾屣葸螅咭粞觋欷僖醯鼷裼穸饩舄禊诶菥蓰", yi: "一以已意议义益亿易医艺食依移衣异伊仪宜射遗疑毅谊亦疫役忆抑尾乙译翼蛇溢椅沂泄逸蚁夷邑怡绎彝裔姨熠贻矣屹颐倚诣胰奕翌疙弈轶蛾驿壹猗臆弋铱旖漪迤佚翊诒怿痍懿饴峄揖眙镒仡黟肄咿翳挹缢呓刈咦嶷羿钇殪荑薏蜴镱噫癔苡悒嗌瘗衤佾埸圯舣酏劓", an: "安案按岸暗鞍氨俺胺铵谙庵黯鹌桉埯犴揞厂广", han: "厂汉韩含旱寒汗涵函喊憾罕焊翰邯撼瀚憨捍酣悍鼾邗颔蚶晗菡旰顸犴焓撖", ang: "昂仰盎肮", ao: "奥澳傲熬凹鳌敖遨鏖袄坳翱嗷拗懊岙螯骜獒鏊艹媪廒聱", wa: "瓦挖娃洼袜蛙凹哇佤娲呙腽", yu: "于与育余预域予遇奥语誉玉鱼雨渔裕愈娱欲吁舆宇羽逾豫郁寓吾狱喻御浴愉禹俞邪榆愚渝尉淤虞屿峪粥驭瑜禺毓钰隅芋熨瘀迂煜昱汩於臾盂聿竽萸妪腴圄谕觎揄龉谀俣馀庾妤瘐鬻欤鹬阈嵛雩鹆圉蜮伛纡窬窳饫蓣狳肀舁蝓燠", niu: "牛纽扭钮拗妞忸狃", o: "哦噢喔", ba: "把八巴拔伯吧坝爸霸罢芭跋扒叭靶疤笆耙鲅粑岜灞钯捌菝魃茇", pa: "怕帕爬扒趴琶啪葩耙杷钯筢", pi: "被批副否皮坏辟啤匹披疲罢僻毗坯脾譬劈媲屁琵邳裨痞癖陂丕枇噼霹吡纰砒铍淠郫埤濞睥芘蚍圮鼙罴蜱疋貔仳庀擗甓陴", bi: "比必币笔毕秘避闭佛辟壁弊彼逼碧鼻臂蔽拂泌璧庇痹毙弼匕鄙陛裨贲敝蓖吡篦纰俾铋毖筚荸薜婢哔跸濞秕荜愎睥妣芘箅髀畀滗狴萆嬖襞舭", bai: "百白败摆伯拜柏佰掰呗擘捭稗", bo: "波博播勃拨薄佛伯玻搏柏泊舶剥渤卜驳簿脖膊簸菠礴箔铂亳钵帛擘饽跛钹趵檗啵鹁擗踣", bei: "北被备倍背杯勃贝辈悲碑臂卑悖惫蓓陂钡狈呗焙碚褙庳鞴孛鹎邶鐾", ban: "办版半班般板颁伴搬斑扮拌扳瓣坂阪绊钣瘢舨癍", pan: "判盘番潘攀盼拚畔胖叛拌蹒磐爿蟠泮袢襻丬", bin: "份宾频滨斌彬濒殡缤鬓槟摈膑玢镔豳髌傧", bang: "帮邦彭旁榜棒膀镑绑傍磅蚌谤梆浜蒡", pang: "旁庞乓磅螃彷滂逄耪", beng: "泵崩蚌蹦迸绷甭嘣甏堋", bao: "报保包宝暴胞薄爆炮饱抱堡剥鲍曝葆瀑豹刨褒雹孢苞煲褓趵鸨龅勹", bu: "不部步布补捕堡埔卜埠簿哺怖钚卟瓿逋晡醭钸", pu: "普暴铺浦朴堡葡谱埔扑仆蒲曝瀑溥莆圃璞濮菩蹼匍噗氆攵镨攴镤", mian: "面棉免绵缅勉眠冕娩腼渑湎沔黾宀眄", po: "破繁坡迫颇朴泊婆泼魄粕鄱珀陂叵笸泺皤钋钷", fan: "反范犯繁饭泛翻凡返番贩烦拚帆樊藩矾梵蕃钒幡畈蘩蹯燔", fu: "府服副负富复福夫妇幅付扶父符附腐赴佛浮覆辅傅伏抚赋辐腹弗肤阜袱缚甫氟斧孚敷俯拂俘咐腑孵芙涪釜脯茯馥宓绂讣呋罘麸蝠匐芾蜉跗凫滏蝮驸绋蚨砩桴赙菔呒趺苻拊阝鲋怫稃郛莩幞祓艴黻黼鳆", ben: "本体奔苯笨夯贲锛畚坌", feng: "风丰封峰奉凤锋冯逢缝蜂枫疯讽烽俸沣酆砜葑唪", bian: "变便边编遍辩鞭辨贬匾扁卞汴辫砭苄蝙鳊弁窆笾煸褊碥忭缏", pian: "便片篇偏骗翩扁骈胼蹁谝犏缏", zhen: "镇真针圳振震珍阵诊填侦臻贞枕桢赈祯帧甄斟缜箴疹砧榛鸩轸稹溱蓁胗椹朕畛浈", biao: "表标彪镖裱飚膘飙镳婊骠飑杓髟鳔灬瘭", piao: "票朴漂飘嫖瓢剽缥殍瞟骠嘌莩螵", huo: "和活或货获火伙惑霍祸豁嚯藿锪蠖钬耠镬夥灬劐攉", bie: "别鳖憋瘪蹩", min: "民敏闽闵皿泯岷悯珉抿黾缗玟愍苠鳘", fen: "分份纷奋粉氛芬愤粪坟汾焚酚吩忿棼玢鼢瀵偾鲼", bing: "并病兵冰屏饼炳秉丙摒柄槟禀枋邴冫", geng: "更耕颈庚耿梗埂羹哽赓绠鲠", fang: "方放房防访纺芳仿坊妨肪邡舫彷枋鲂匚钫", xian: "现先县见线限显险献鲜洗宪纤陷闲贤仙衔掀咸嫌掺羡弦腺痫娴舷馅酰铣冼涎暹籼锨苋蚬跹岘藓燹鹇氙莶霰跣猃彡祆筅", fou: "不否缶", ca: "拆擦嚓礤", cha: "查察差茶插叉刹茬楂岔诧碴嚓喳姹杈汊衩搽槎镲苴檫馇锸猹", cai: "才采财材菜彩裁蔡猜踩睬", can: "参残餐灿惨蚕掺璨惭粲孱骖黪", shen: "信深参身神什审申甚沈伸慎渗肾绅莘呻婶娠砷蜃哂椹葚吲糁渖诜谂矧胂", cen: "参岑涔", san: "三参散伞叁糁馓毵", cang: "藏仓苍沧舱臧伧", zang: "藏脏葬赃臧奘驵", chen: "称陈沈沉晨琛臣尘辰衬趁忱郴宸谌碜嗔抻榇伧谶龀肜", cao: "草操曹槽糙嘈漕螬艚屮", ce: "策测册侧厕栅恻", ze: "责则泽择侧咋啧仄箦赜笮舴昃迮帻", zhai: "债择齐宅寨侧摘窄斋祭翟砦瘵哜", dao: "到道导岛倒刀盗稻蹈悼捣叨祷焘氘纛刂帱忉", ceng: "层曾蹭噌", zha: "查扎炸诈闸渣咋乍榨楂札栅眨咤柞喳喋铡蚱吒怍砟揸痄哳齄", chai: "差拆柴钗豺侪虿瘥", ci: "次此差词辞刺瓷磁兹慈茨赐祠伺雌疵鹚糍呲粢", zi: "资自子字齐咨滋仔姿紫兹孜淄籽梓鲻渍姊吱秭恣甾孳訾滓锱辎趑龇赀眦缁呲笫谘嵫髭茈粢觜耔", cuo: "措错磋挫搓撮蹉锉厝嵯痤矬瘥脞鹾", chan: "产单阐崭缠掺禅颤铲蝉搀潺蟾馋忏婵孱觇廛谄谗澶骣羼躔蒇冁", shan: "山单善陕闪衫擅汕扇掺珊禅删膳缮赡鄯栅煽姗跚鳝嬗潸讪舢苫疝掸膻钐剡蟮芟埏彡骟", zhan: "展战占站崭粘湛沾瞻颤詹斩盏辗绽毡栈蘸旃谵搌", xin: "新心信辛欣薪馨鑫芯锌忻莘昕衅歆囟忄镡", lian: "联连练廉炼脸莲恋链帘怜涟敛琏镰濂楝鲢殓潋裢裣臁奁莶蠊蔹", chang: "场长厂常偿昌唱畅倡尝肠敞倘猖娼淌裳徜昶怅嫦菖鲳阊伥苌氅惝鬯", zhang: "长张章障涨掌帐胀彰丈仗漳樟账杖璋嶂仉瘴蟑獐幛鄣嫜", chao: "超朝潮炒钞抄巢吵剿绰嘲晁焯耖怊", zhao: "着照招找召朝赵兆昭肇罩钊沼嘲爪诏濯啁棹笊", zhou: "调州周洲舟骤轴昼宙粥皱肘咒帚胄绉纣妯啁诌繇碡籀酎荮", che: "车彻撤尺扯澈掣坼砗屮", ju: "车局据具举且居剧巨聚渠距句拒俱柜菊拘炬桔惧矩鞠驹锯踞咀瞿枸掬沮莒橘飓疽钜趄踽遽琚龃椐苣裾榘狙倨榉苴讵雎锔窭鞫犋屦醵", cheng: "成程城承称盛抢乘诚呈净惩撑澄秤橙骋逞瞠丞晟铛埕塍蛏柽铖酲裎枨", rong: "容荣融绒溶蓉熔戎榕茸冗嵘肜狨蝾", sheng: "生声升胜盛乘圣剩牲甸省绳笙甥嵊晟渑眚", deng: "等登邓灯澄凳瞪蹬噔磴嶝镫簦戥", zhi: "制之治质职只志至指织支值知识直致执置止植纸拓智殖秩旨址滞氏枝芝脂帜汁肢挚稚酯掷峙炙栉侄芷窒咫吱趾痔蜘郅桎雉祉郦陟痣蛭帙枳踯徵胝栀贽祗豸鸷摭轵卮轾彘觯絷跖埴夂黹忮骘膣踬", zheng: "政正证争整征郑丁症挣蒸睁铮筝拯峥怔诤狰徵钲", tang: "堂唐糖汤塘躺趟倘棠烫淌膛搪镗傥螳溏帑羰樘醣螗耥铴瑭", chi: "持吃池迟赤驰尺斥齿翅匙痴耻炽侈弛叱啻坻眙嗤墀哧茌豉敕笞饬踟蚩柢媸魑篪褫彳鸱螭瘛眵傺", shi: "是时实事市十使世施式势视识师史示石食始士失适试什泽室似诗饰殖释驶氏硕逝湿蚀狮誓拾尸匙仕柿矢峙侍噬嗜栅拭嘘屎恃轼虱耆舐莳铈谥炻豕鲥饣螫酾筮埘弑礻蓍鲺贳", qi: "企其起期气七器汽奇齐启旗棋妻弃揭枝歧欺骑契迄亟漆戚岂稽岐琦栖缉琪泣乞砌祁崎绮祺祈凄淇杞脐麒圻憩芪伎俟畦耆葺沏萋骐鳍綦讫蕲屺颀亓碛柒啐汔綮萁嘁蛴槭欹芑桤丌蜞", chuai: "揣踹啜搋膪", tuo: "托脱拓拖妥驼陀沱鸵驮唾椭坨佗砣跎庹柁橐乇铊沲酡鼍箨柝", duo: "多度夺朵躲铎隋咄堕舵垛惰哆踱跺掇剁柁缍沲裰哚隳", xue: "学血雪削薛穴靴谑噱鳕踅泶彐", chong: "重种充冲涌崇虫宠忡憧舂茺铳艟", chou: "筹抽绸酬愁丑臭仇畴稠瞅踌惆俦瘳雠帱", qiu: "求球秋丘邱仇酋裘龟囚遒鳅虬蚯泅楸湫犰逑巯艽俅蝤赇鼽糗", xiu: "修秀休宿袖绣臭朽锈羞嗅岫溴庥馐咻髹鸺貅", chu: "出处础初助除储畜触楚厨雏矗橱锄滁躇怵绌搐刍蜍黜杵蹰亍樗憷楮", tuan: "团揣湍疃抟彖", zhui: "追坠缀揣椎锥赘惴隹骓缒", chuan: "传川船穿串喘椽舛钏遄氚巛舡", zhuan: "专转传赚砖撰篆馔啭颛", yuan: "元员院原源远愿园援圆缘袁怨渊苑宛冤媛猿垣沅塬垸鸳辕鸢瑗圜爰芫鼋橼螈眢箢掾", cuan: "窜攒篡蹿撺爨汆镩", chuang: "创床窗闯幢疮怆", zhuang: "装状庄壮撞妆幢桩奘僮戆", chui: "吹垂锤炊椎陲槌捶棰", chun: "春纯醇淳唇椿蠢鹑朐莼肫蝽", zhun: "准屯淳谆肫窀", cu: "促趋趣粗簇醋卒蹴猝蹙蔟殂徂", dun: "吨顿盾敦蹲墩囤沌钝炖盹遁趸砘礅", qu: "区去取曲趋渠趣驱屈躯衢娶祛瞿岖龋觑朐蛐癯蛆苣阒诎劬蕖蘧氍黢蠼璩麴鸲磲", xu: "需许续须序徐休蓄畜虚吁绪叙旭邪恤墟栩絮圩婿戌胥嘘浒煦酗诩朐盱蓿溆洫顼勖糈砉醑", chuo: "辍绰戳淖啜龊踔辶", zu: "组族足祖租阻卒俎诅镞菹", ji: "济机其技基记计系期际及集级几给积极己纪即继击既激绩急奇吉季齐疾迹鸡剂辑籍寄挤圾冀亟寂暨脊跻肌稽忌饥祭缉棘矶汲畸姬藉瘠骥羁妓讥稷蓟悸嫉岌叽伎鲫诘楫荠戟箕霁嵇觊麂畿玑笈犄芨唧屐髻戢佶偈笄跽蒺乩咭赍嵴虮掎齑殛鲚剞洎丌墼蕺彐芰哜", cong: "从丛匆聪葱囱琮淙枞骢苁璁", zong: "总从综宗纵踪棕粽鬃偬枞腙", cou: "凑辏腠楱", cui: "衰催崔脆翠萃粹摧璀瘁悴淬啐隹毳榱", wei: "为位委未维卫围违威伟危味微唯谓伪慰尾魏韦胃畏帷喂巍萎蔚纬潍尉渭惟薇苇炜圩娓诿玮崴桅偎逶倭猥囗葳隗痿猬涠嵬韪煨艉隹帏闱洧沩隈鲔軎", cun: "村存寸忖皴", zuo: "作做座左坐昨佐琢撮祚柞唑嘬酢怍笮阼胙", zuan: "钻纂攥缵躜", da: "大达打答搭沓瘩惮嗒哒耷鞑靼褡笪怛妲", dai: "大代带待贷毒戴袋歹呆隶逮岱傣棣怠殆黛甙埭诒绐玳呔迨", tai: "大台太态泰抬胎汰钛苔薹肽跆邰鲐酞骀炱", ta: "他它她拓塔踏塌榻沓漯獭嗒挞蹋趿遢铊鳎溻闼", dan: "但单石担丹胆旦弹蛋淡诞氮郸耽殚惮儋眈疸澹掸膻啖箪聃萏瘅赕", lu: "路六陆录绿露鲁卢炉鹿禄赂芦庐碌麓颅泸卤潞鹭辘虏璐漉噜戮鲈掳橹轳逯渌蓼撸鸬栌氇胪镥簏舻辂垆", tan: "谈探坦摊弹炭坛滩贪叹谭潭碳毯瘫檀痰袒坍覃忐昙郯澹钽锬", ren: "人任认仁忍韧刃纫饪妊荏稔壬仞轫亻衽", jie: "家结解价界接节她届介阶街借杰洁截姐揭捷劫戒皆竭桔诫楷秸睫藉拮芥诘碣嗟颉蚧孑婕疖桀讦疥偈羯袷哜喈卩鲒骱", yan: "研严验演言眼烟沿延盐炎燕岩宴艳颜殷彦掩淹阎衍铅雁咽厌焰堰砚唁焉晏檐蜒奄俨腌妍谚兖筵焱偃闫嫣鄢湮赝胭琰滟阉魇酽郾恹崦芫剡鼹菸餍埏谳讠厣罨", dang: "当党档荡挡宕砀铛裆凼菪谠", tao: "套讨跳陶涛逃桃萄淘掏滔韬叨洮啕绦饕鼗", tiao: "条调挑跳迢眺苕窕笤佻啁粜髫铫祧龆蜩鲦", te: "特忑忒铽慝", de: "的地得德底锝", dei: "得", di: "的地第提低底抵弟迪递帝敌堤蒂缔滴涤翟娣笛棣荻谛狄邸嘀砥坻诋嫡镝碲骶氐柢籴羝睇觌", ti: "体提题弟替梯踢惕剔蹄棣啼屉剃涕锑倜悌逖嚏荑醍绨鹈缇裼", tui: "推退弟腿褪颓蜕忒煺", you: "有由又优游油友右邮尤忧幼犹诱悠幽佑釉柚铀鱿囿酉攸黝莠猷蝣疣呦蚴莸莜铕宥繇卣牖鼬尢蚰侑", dian: "电点店典奠甸碘淀殿垫颠滇癫巅惦掂癜玷佃踮靛钿簟坫阽", tian: "天田添填甜甸恬腆佃舔钿阗忝殄畋栝掭", zhu: "主术住注助属逐宁著筑驻朱珠祝猪诸柱竹铸株瞩嘱贮煮烛苎褚蛛拄铢洙竺蛀渚伫杼侏澍诛茱箸炷躅翥潴邾槠舳橥丶瘃麈疰", nian: "年念酿辗碾廿捻撵拈蔫鲶埝鲇辇黏", diao: "调掉雕吊钓刁貂凋碉鲷叼铫铞", yao: "要么约药邀摇耀腰遥姚窑瑶咬尧钥谣肴夭侥吆疟妖幺杳舀窕窈曜鹞爻繇徭轺铫鳐崾珧", die: "跌叠蝶迭碟爹谍牒耋佚喋堞瓞鲽垤揲蹀", she: "设社摄涉射折舍蛇拾舌奢慑赦赊佘麝歙畲厍猞揲滠", ye: "业也夜叶射野液冶喝页爷耶邪咽椰烨掖拽曳晔谒腋噎揶靥邺铘揲", xie: "些解协写血叶谢械鞋胁斜携懈契卸谐泄蟹邪歇泻屑挟燮榭蝎撷偕亵楔颉缬邂鲑瀣勰榍薤绁渫廨獬躞", zhe: "这者着著浙折哲蔗遮辙辄柘锗褶蜇蛰鹧谪赭摺乇磔螫", ding: "定订顶丁鼎盯钉锭叮仃铤町酊啶碇腚疔玎耵", diu: "丢铥", ting: "听庭停厅廷挺亭艇婷汀铤烃霆町蜓葶梃莛", dong: "动东董冬洞懂冻栋侗咚峒氡恫胴硐垌鸫岽胨", tong: "同通统童痛铜桶桐筒彤侗佟潼捅酮砼瞳恸峒仝嗵僮垌茼", zhong: "中重种众终钟忠仲衷肿踵冢盅蚣忪锺舯螽夂", dou: "都斗读豆抖兜陡逗窦渎蚪痘蔸钭篼", du: "度都独督读毒渡杜堵赌睹肚镀渎笃竺嘟犊妒牍蠹椟黩芏髑", duan: "断段短端锻缎煅椴簖", dui: "对队追敦兑堆碓镦怼憝", rui: "瑞兑锐睿芮蕊蕤蚋枘", yue: "月说约越乐跃兑阅岳粤悦曰钥栎钺樾瀹龠哕刖", tun: "吞屯囤褪豚臀饨暾氽", hui: "会回挥汇惠辉恢徽绘毁慧灰贿卉悔秽溃荟晖彗讳诲珲堕诙蕙晦睢麾烩茴喙桧蛔洄浍虺恚蟪咴隳缋哕", wu: "务物无五武午吴舞伍污乌误亡恶屋晤悟吾雾芜梧勿巫侮坞毋诬呜钨邬捂鹜兀婺妩於戊鹉浯蜈唔骛仵焐芴鋈庑鼯牾怃圬忤痦迕杌寤阢", ya: "亚压雅牙押鸭呀轧涯崖邪芽哑讶鸦娅衙丫蚜碣垭伢氩桠琊揠吖睚痖疋迓岈砑", he: "和合河何核盖贺喝赫荷盒鹤吓呵苛禾菏壑褐涸阂阖劾诃颌嗬貉曷翮纥盍", wo: "我握窝沃卧挝涡斡渥幄蜗喔倭莴龌肟硪", en: "恩摁蒽", n: "嗯唔", er: "而二尔儿耳迩饵洱贰铒珥佴鸸鲕", fa: "发法罚乏伐阀筏砝垡珐", quan: "全权券泉圈拳劝犬铨痊诠荃醛蜷颧绻犭筌鬈悛辁畎", fei: "费非飞肥废菲肺啡沸匪斐蜚妃诽扉翡霏吠绯腓痱芾淝悱狒榧砩鲱篚镄", pei: "配培坏赔佩陪沛裴胚妃霈淠旆帔呸醅辔锫", ping: "平评凭瓶冯屏萍苹乒坪枰娉俜鲆", fo: "佛", hu: "和护许户核湖互乎呼胡戏忽虎沪糊壶葫狐蝴弧瑚浒鹄琥扈唬滹惚祜囫斛笏芴醐猢怙唿戽槲觳煳鹕冱瓠虍岵鹱烀轷", ga: "夹咖嘎尬噶旮伽尕钆尜", ge: "个合各革格歌哥盖隔割阁戈葛鸽搁胳舸疙铬骼蛤咯圪镉颌仡硌嗝鬲膈纥袼搿塥哿虼", ha: "哈蛤铪", xia: "下夏峡厦辖霞夹虾狭吓侠暇遐瞎匣瑕唬呷黠硖罅狎瘕柙", gai: "改该盖概溉钙丐芥赅垓陔戤", hai: "海还害孩亥咳骸骇氦嗨胲醢", gan: "干感赶敢甘肝杆赣乾柑尴竿秆橄矸淦苷擀酐绀泔坩旰疳澉", gang: "港钢刚岗纲冈杠缸扛肛罡戆筻", jiang: "将强江港奖讲降疆蒋姜浆匠酱僵桨绛缰犟豇礓洚茳糨耩", hang: "行航杭巷夯吭桁沆绗颃", gong: "工公共供功红贡攻宫巩龚恭拱躬弓汞蚣珙觥肱廾", hong: "红宏洪轰虹鸿弘哄烘泓訇蕻闳讧荭黉薨", guang: "广光逛潢犷胱咣桄", qiong: "穷琼穹邛茕筇跫蛩銎", gao: "高告搞稿膏糕镐皋羔锆杲郜睾诰藁篙缟槁槔", hao: "好号毫豪耗浩郝皓昊皋蒿壕灏嚎濠蚝貉颢嗥薅嚆", li: "理力利立里李历例离励礼丽黎璃厉厘粒莉梨隶栗荔沥犁漓哩狸藜罹篱鲤砺吏澧俐骊溧砾莅锂笠蠡蛎痢雳俪傈醴栎郦俚枥喱逦娌鹂戾砬唳坜疠蜊黧猁鬲粝蓠呖跞疬缡鲡鳢嫠詈悝苈篥轹", jia: "家加价假佳架甲嘉贾驾嫁夹稼钾挟拮迦伽颊浃枷戛荚痂颉镓笳珈岬胛袈郏葭袷瘕铗跏蛱恝哿", luo: "落罗络洛逻螺锣骆萝裸漯烙摞骡咯箩珞捋荦硌雒椤镙跞瘰泺脶猡倮蠃", ke: "可科克客刻课颗渴壳柯棵呵坷恪苛咳磕珂稞瞌溘轲窠嗑疴蝌岢铪颏髁蚵缂氪骒钶锞", qia: "卡恰洽掐髂袷咭葜", gei: "给", gen: "根跟亘艮哏茛", hen: "很狠恨痕哏", gou: "构购够句沟狗钩拘勾苟垢枸篝佝媾诟岣彀缑笱鞲觏遘", kou: "口扣寇叩抠佝蔻芤眍筘", gu: "股古顾故固鼓骨估谷贾姑孤雇辜菇沽咕呱锢钴箍汩梏痼崮轱鸪牯蛊诂毂鹘菰罟嘏臌觚瞽蛄酤牿鲴", pai: "牌排派拍迫徘湃俳哌蒎", gua: "括挂瓜刮寡卦呱褂剐胍诖鸹栝呙", tou: "投头透偷愉骰亠", guai: "怪拐乖", kuai: "会快块筷脍蒯侩浍郐蒉狯哙", guan: "关管观馆官贯冠惯灌罐莞纶棺斡矜倌鹳鳏盥掼涫", wan: "万完晚湾玩碗顽挽弯蔓丸莞皖宛婉腕蜿惋烷琬畹豌剜纨绾脘菀芄箢", ne: "呢哪呐讷疒", gui: "规贵归轨桂柜圭鬼硅瑰跪龟匮闺诡癸鳜桧皈鲑刽晷傀眭妫炅庋簋刿宄匦", jun: "军均俊君峻菌竣钧骏龟浚隽郡筠皲麇捃", jiong: "窘炯迥炅冂扃", jue: "决绝角觉掘崛诀獗抉爵嚼倔厥蕨攫珏矍蹶谲镢鳜噱桷噘撅橛孓觖劂爝", gun: "滚棍辊衮磙鲧绲丨", hun: "婚混魂浑昏棍珲荤馄诨溷阍", guo: "国过果郭锅裹帼涡椁囗蝈虢聒埚掴猓崞蜾呙馘", hei: "黑嘿嗨", kan: "看刊勘堪坎砍侃嵌槛瞰阚龛戡凵莰", heng: "衡横恒亨哼珩桁蘅", mo: "万没么模末冒莫摩墨默磨摸漠脉膜魔沫陌抹寞蘑摹蓦馍茉嘿谟秣蟆貉嫫镆殁耱嬷麽瘼貊貘", peng: "鹏朋彭膨蓬碰苹棚捧亨烹篷澎抨硼怦砰嘭蟛堋", hou: "后候厚侯猴喉吼逅篌糇骺後鲎瘊堠", hua: "化华划话花画滑哗豁骅桦猾铧砉", huai: "怀坏淮徊槐踝", huan: "还环换欢患缓唤焕幻痪桓寰涣宦垸洹浣豢奂郇圜獾鲩鬟萑逭漶锾缳擐", xun: "讯训迅孙寻询循旬巡汛勋逊熏徇浚殉驯鲟薰荀浔洵峋埙巽郇醺恂荨窨蕈曛獯", huang: "黄荒煌皇凰慌晃潢谎惶簧璜恍幌湟蝗磺隍徨遑肓篁鳇蟥癀", nai: "能乃奶耐奈鼐萘氖柰佴艿", luan: "乱卵滦峦鸾栾銮挛孪脔娈", qie: "切且契窃茄砌锲怯伽惬妾趄挈郄箧慊", jian: "建间件见坚检健监减简艰践兼鉴键渐柬剑尖肩舰荐箭浅剪俭碱茧奸歼拣捡煎贱溅槛涧堑笺谏饯锏缄睑謇蹇腱菅翦戬毽笕犍硷鞯牮枧湔鲣囝裥踺搛缣鹣蒹谫僭戋趼楗", nan: "南难男楠喃囡赧腩囝蝻", qian: "前千钱签潜迁欠纤牵浅遣谦乾铅歉黔谴嵌倩钳茜虔堑钎骞阡掮钤扦芊犍荨仟芡悭缱佥愆褰凵肷岍搴箝慊椠", qiang: "强抢疆墙枪腔锵呛羌蔷襁羟跄樯戕嫱戗炝镪锖蜣", xiang: "向项相想乡象响香降像享箱羊祥湘详橡巷翔襄厢镶飨饷缃骧芗庠鲞葙蟓", jiao: "教交较校角觉叫脚缴胶轿郊焦骄浇椒礁佼蕉娇矫搅绞酵剿嚼饺窖跤蛟侥狡姣皎茭峤铰醮鲛湫徼鹪僬噍艽挢敫", zhuo: "着著缴桌卓捉琢灼浊酌拙茁涿镯淖啄濯焯倬擢斫棹诼浞禚", qiao: "桥乔侨巧悄敲俏壳雀瞧翘窍峭锹撬荞跷樵憔鞘橇峤诮谯愀鞒硗劁缲", xiao: "小效销消校晓笑肖削孝萧俏潇硝宵啸嚣霄淆哮筱逍姣箫骁枭哓绡蛸崤枵魈", si: "司四思斯食私死似丝饲寺肆撕泗伺嗣祀厮驷嘶锶俟巳蛳咝耜笥纟糸鸶缌澌姒汜厶兕", kai: "开凯慨岂楷恺揩锴铠忾垲剀锎蒈", jin: "进金今近仅紧尽津斤禁锦劲晋谨筋巾浸襟靳瑾烬缙钅矜觐堇馑荩噤廑妗槿赆衿卺", qin: "亲勤侵秦钦琴禽芹沁寝擒覃噙矜嗪揿溱芩衾廑锓吣檎螓", jing: "经京精境竞景警竟井惊径静劲敬净镜睛晶颈荆兢靖泾憬鲸茎腈菁胫阱旌粳靓痉箐儆迳婧肼刭弪獍", ying: "应营影英景迎映硬盈赢颖婴鹰荧莹樱瑛蝇萦莺颍膺缨瀛楹罂荥萤鹦滢蓥郢茔嘤璎嬴瘿媵撄潆", jiu: "就究九酒久救旧纠舅灸疚揪咎韭玖臼柩赳鸠鹫厩啾阄桕僦鬏", zui: "最罪嘴醉咀蕞觜", juan: "卷捐圈眷娟倦绢隽镌涓鹃鄄蠲狷锩桊", suan: "算酸蒜狻", yun: "员运云允孕蕴韵酝耘晕匀芸陨纭郧筠恽韫郓氲殒愠昀菀狁", qun: "群裙逡麇", ka: "卡喀咖咔咯佧胩", kang: "康抗扛慷炕亢糠伉钪闶", keng: "坑铿吭", kao: "考靠烤拷铐栲尻犒", ken: "肯垦恳啃龈裉", yin: "因引银印音饮阴隐姻殷淫尹荫吟瘾寅茵圻垠鄞湮蚓氤胤龈窨喑铟洇狺夤廴吲霪茚堙", kong: "空控孔恐倥崆箜", ku: "苦库哭酷裤枯窟挎骷堀绔刳喾", kua: "跨夸垮挎胯侉", kui: "亏奎愧魁馈溃匮葵窥盔逵睽馗聩喟夔篑岿喹揆隗傀暌跬蒉愦悝蝰", kuan: "款宽髋", kuang: "况矿框狂旷眶匡筐邝圹哐贶夼诳诓纩", que: "确却缺雀鹊阙瘸榷炔阕悫", kun: "困昆坤捆琨锟鲲醌髡悃阃", kuo: "扩括阔廓蛞", la: "拉落垃腊啦辣蜡喇剌旯砬邋瘌", lai: "来莱赖睐徕籁涞赉濑癞崃疠铼", lan: "兰览蓝篮栏岚烂滥缆揽澜拦懒榄斓婪阑褴罱啉谰镧漤", lin: "林临邻赁琳磷淋麟霖鳞凛拎遴蔺吝粼嶙躏廪檩啉辚膦瞵懔", lang: "浪朗郎廊狼琅榔螂阆锒莨啷蒗稂", liang: "量两粮良辆亮梁凉谅粱晾靓踉莨椋魉墚", lao: "老劳落络牢捞涝烙姥佬崂唠酪潦痨醪铑铹栳耢", mu: "目模木亩幕母牧莫穆姆墓慕牟牡募睦缪沐暮拇姥钼苜仫毪坶", le: "了乐勒肋叻鳓嘞仂泐", lei: "类累雷勒泪蕾垒磊擂镭肋羸耒儡嫘缧酹嘞诔檑", sui: "随岁虽碎尿隧遂髓穗绥隋邃睢祟濉燧谇眭荽", lie: "列烈劣裂猎冽咧趔洌鬣埒捩躐", leng: "冷愣棱楞塄", ling: "领令另零灵龄陵岭凌玲铃菱棱伶羚苓聆翎泠瓴囹绫呤棂蛉酃鲮柃", lia: "俩", liao: "了料疗辽廖聊寥缪僚燎缭撂撩嘹潦镣寮蓼獠钌尥鹩", liu: "流刘六留柳瘤硫溜碌浏榴琉馏遛鎏骝绺镏旒熘鹨锍", lun: "论轮伦仑纶沦抡囵", lv: "率律旅绿虑履吕铝屡氯缕滤侣驴榈闾偻褛捋膂稆", lou: "楼露漏陋娄搂篓喽镂偻瘘髅耧蝼嵝蒌", mao: "贸毛矛冒貌茂茅帽猫髦锚懋袤牦卯铆耄峁瑁蟊茆蝥旄泖昴瞀", long: "龙隆弄垄笼拢聋陇胧珑窿茏咙砻垅泷栊癃", nong: "农浓弄脓侬哝", shuang: "双爽霜孀泷", shu: "术书数属树输束述署朱熟殊蔬舒疏鼠淑叔暑枢墅俞曙抒竖蜀薯梳戍恕孰沭赎庶漱塾倏澍纾姝菽黍腧秫毹殳疋摅", shuai: "率衰帅摔甩蟀", lve: "略掠锊", ma: "么马吗摩麻码妈玛嘛骂抹蚂唛蟆犸杩", me: "么麽", mai: "买卖麦迈脉埋霾荬劢", man: "满慢曼漫埋蔓瞒蛮鳗馒幔谩螨熳缦镘颟墁鞔", mi: "米密秘迷弥蜜谜觅靡泌眯麋猕谧咪糜宓汨醚嘧弭脒冖幂祢縻蘼芈糸敉", men: "们门闷瞒汶扪焖懑鞔钔", mang: "忙盲茫芒氓莽蟒邙硭漭", meng: "蒙盟梦猛孟萌氓朦锰檬勐懵蟒蜢虻黾蠓艨甍艋瞢礞", miao: "苗秒妙描庙瞄缪渺淼藐缈邈鹋杪眇喵", mou: "某谋牟缪眸哞鍪蛑侔厶", miu: "缪谬", mei: "美没每煤梅媒枚妹眉魅霉昧媚玫酶镁湄寐莓袂楣糜嵋镅浼猸鹛", wen: "文问闻稳温纹吻蚊雯紊瘟汶韫刎璺玟阌", mie: "灭蔑篾乜咩蠛", ming: "明名命鸣铭冥茗溟酩瞑螟暝", na: "内南那纳拿哪娜钠呐捺衲镎肭", nei: "内那哪馁", nuo: "难诺挪娜糯懦傩喏搦锘", ruo: "若弱偌箬", nang: "囊馕囔曩攮", nao: "脑闹恼挠瑙淖孬垴铙桡呶硇猱蛲", ni: "你尼呢泥疑拟逆倪妮腻匿霓溺旎昵坭铌鲵伲怩睨猊", nen: "嫩恁", neng: "能", nin: "您恁", niao: "鸟尿溺袅脲茑嬲", nie: "摄聂捏涅镍孽捻蘖啮蹑嗫臬镊颞乜陧", niang: "娘酿", ning: "宁凝拧泞柠咛狞佞聍甯", nu: "努怒奴弩驽帑孥胬", nv: "女钕衄恧", ru: "入如女乳儒辱汝茹褥孺濡蠕嚅缛溽铷洳薷襦颥蓐", nuan: "暖", nve: "虐疟", re: "热若惹喏", ou: "区欧偶殴呕禺藕讴鸥瓯沤耦怄", pao: "跑炮泡抛刨袍咆疱庖狍匏脬", pou: "剖掊裒", pen: "喷盆湓", pie: "瞥撇苤氕丿", pin: "品贫聘频拼拚颦姘嫔榀牝", se: "色塞瑟涩啬穑铯槭", qing: "情青清请亲轻庆倾顷卿晴氢擎氰罄磬蜻箐鲭綮苘黥圊檠謦", zan: "赞暂攒堑昝簪糌瓒錾趱拶", shao: "少绍召烧稍邵哨韶捎勺梢鞘芍苕劭艄筲杓潲", sao: "扫骚嫂梢缫搔瘙臊埽缲鳋", sha: "沙厦杀纱砂啥莎刹杉傻煞鲨霎嗄痧裟挲铩唼歃", xuan: "县选宣券旋悬轩喧玄绚渲璇炫萱癣漩眩暄煊铉楦泫谖痃碹揎镟儇", ran: "然染燃冉苒髯蚺", rang: "让壤攘嚷瓤穰禳", rao: "绕扰饶娆桡荛", reng: "仍扔", ri: "日", rou: "肉柔揉糅鞣蹂", ruan: "软阮朊", run: "润闰", sa: "萨洒撒飒卅仨脎", suo: "所些索缩锁莎梭琐嗦唆唢娑蓑羧挲桫嗍睃", sai: "思赛塞腮噻鳃", shui: "说水税谁睡氵", sang: "桑丧嗓搡颡磉", sen: "森", seng: "僧", shai: "筛晒", shang: "上商尚伤赏汤裳墒晌垧觞殇熵绱", xing: "行省星腥猩惺兴刑型形邢饧醒幸杏性姓陉荇荥擤悻硎", shou: "收手受首售授守寿瘦兽狩绶艏扌", shuo: "说数硕烁朔铄妁槊蒴搠", su: "速素苏诉缩塑肃俗宿粟溯酥夙愫簌稣僳谡涑蔌嗉觫", shua: "刷耍唰", shuan: "栓拴涮闩", shun: "顺瞬舜吮", song: "送松宋讼颂耸诵嵩淞怂悚崧凇忪竦菘", sou: "艘搜擞嗽嗖叟馊薮飕嗾溲锼螋瞍", sun: "损孙笋荪榫隼狲飧", teng: "腾疼藤滕誊", tie: "铁贴帖餮萜", tu: "土突图途徒涂吐屠兔秃凸荼钍菟堍酴", wai: "外歪崴", wang: "王望往网忘亡旺汪枉妄惘罔辋魍", weng: "翁嗡瓮蓊蕹", zhua: "抓挝爪", yang: "样养央阳洋扬杨羊详氧仰秧痒漾疡泱殃恙鸯徉佯怏炀烊鞅蛘", xiong: "雄兄熊胸凶匈汹芎", yo: "哟唷", yong: "用永拥勇涌泳庸俑踊佣咏雍甬镛臃邕蛹恿慵壅痈鳙墉饔喁", za: "杂扎咱砸咋匝咂拶", zai: "在再灾载栽仔宰哉崽甾", zao: "造早遭枣噪灶燥糟凿躁藻皂澡蚤唣", zei: "贼", zen: "怎谮", zeng: "增曾综赠憎锃甑罾缯", zhei: "这", zou: "走邹奏揍诹驺陬楱鄹鲰", zhuai: "转拽", zun: "尊遵鳟樽撙", dia: "嗲", nou: "耨" }, Ue = e("ec57"), qe = function(w) {
        return w.keys().map(w);
      };
      qe(Ue);
      var Ze = [], ye = null, et = Object(t.defineComponent)({ name: "KeyBoard", inheritAttrs: !1, props: { color: { type: String, default: "#eaa050" }, modeList: { type: Array, default: function() {
        return ["handwrite", "symbol"];
      } }, blurHide: { type: Boolean, default: !0 }, showHandleBar: { type: Boolean, default: !0 }, modal: Boolean, closeOnClickModal: { type: Boolean, default: !0 }, handApi: String, animateClass: String, dargHandleText: String }, emits: ["keyChange", "change", "closed", "modalClick"], directives: { handleDrag: O }, components: { Result: Q, SvgIcon: $e, HandBoard: Ve, DefaultBoard: ae }, setup: function(w, U) {
        var R = U.emit, B = Object(t.reactive)({ showMode: "default", visible: !1, resultVal: {} }), K = Object(t.ref)(null);
        function ie(xe) {
          var Oe, Ce;
          switch (Object(t.nextTick)(function() {
            b.emit("keyBoardChange", "CN");
          }), xe) {
            case "en":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Le;
                (Le = K.value) === null || Le === void 0 || Le.click({ data: "", type: "change2lang" });
              });
              break;
            case "number":
              B.showMode = "default", Object(t.nextTick)(function() {
                var Le;
                (Le = K.value) === null || Le === void 0 || Le.click({ data: ".?123", type: "change2num" });
              });
              break;
            case "handwrite":
              (Oe = w.modeList) !== null && Oe !== void 0 && Oe.find(function(Le) {
                return Le === "handwrite";
              }) && w.handApi ? (B.showMode = "handwrite", Object(t.nextTick)(function() {
                b.emit("keyBoardChange", "handwrite");
              })) : B.showMode = "default";
              break;
            case "symbol":
              B.showMode = "default", (Ce = w.modeList) !== null && Ce !== void 0 && Ce.find(function(Le) {
                return Le === "symbol";
              }) && Object(t.nextTick)(function() {
                var Le, tt;
                (Le = K.value) === null || Le === void 0 || Le.click({ data: ".?123", type: "change2num" }), (tt = K.value) === null || tt === void 0 || tt.click({ data: "#+=", type: "#+=" });
              });
              break;
            default:
              B.showMode = "default";
              break;
          }
        }
        function le(xe) {
          if (B.visible = !0, ye = xe.target, ie(ye.getAttribute("data-mode")), document.querySelector(".key-board-modal")) {
            var Oe = document.querySelector(".key-board-modal");
            Oe.style.display = "block";
          }
        }
        function ce() {
          if (ye && ye.blur(), ye = null, B.visible = !1, R("closed"), B.showMode = "default", B.resultVal = {}, document.querySelector(".key-board-modal")) {
            var xe = document.querySelector(".key-board-modal");
            xe.style.display = "none";
          }
        }
        function ve() {
          w.closeOnClickModal && ce(), R("modalClick");
        }
        function Ie() {
          var xe;
          if (document.querySelector(".key-board-modal")) {
            var Oe;
            (Oe = document.querySelector(".key-board-modal")) === null || Oe === void 0 || Oe.addEventListener("click", ve);
          } else {
            var Ce = document.createElement("div");
            Ce.className = "key-board-modal", Ce.style.display = "none", (xe = document.querySelector("body")) === null || xe === void 0 || xe.appendChild(Ce), Ce.addEventListener("click", ve);
          }
        }
        function De() {
          w.handApi && pe(w.handApi), [].concat(g(document.querySelectorAll("input")), g(document.querySelectorAll("textarea"))).forEach(function(xe) {
            xe.getAttribute("data-mode") !== null && (Ze.push(xe), xe.addEventListener("focus", le), w.blurHide && xe.addEventListener("blur", ce));
          });
        }
        function Fe(xe) {
          if (!ye) return "";
          var Oe = ye, Ce = Oe.selectionStart, Le = Oe.selectionEnd;
          if (!Ce || !Le) return "";
          var tt = xe.substring(0, Ce - 1) + xe.substring(Le);
          return Oe.value = tt, Oe.focus(), Oe.selectionStart = Ce - 1, Oe.selectionEnd = Ce - 1, tt;
        }
        function We(xe) {
          var Oe = xe.type;
          switch (Oe) {
            case "handwrite":
              B.showMode = "handwrite";
              break;
            case "delete":
              if (!ye) return;
              var Ce = Fe(ye.value);
              ye.value = Ce, R("change", Ce, ye.getAttribute("data-prop") || ye);
              break;
          }
        }
        function dt(xe, Oe) {
          if (!ye) return "";
          var Ce = ye, Le = Ce.selectionStart || 0, tt = Ce.selectionEnd || 0, St = xe.substring(0, Le) + Oe + xe.substring(tt);
          return Ce.value = St, Ce.focus(), Ce.selectionStart = Le + Oe.length, Ce.selectionEnd = Le + Oe.length, St;
        }
        function Ee(xe) {
          if (ye) {
            var Oe = dt(ye.value, xe);
            ye.value = Oe, R("change", Oe, ye.getAttribute("data-prop") || ye), R("keyChange", xe, ye.getAttribute("data-prop") || ye);
          }
        }
        function ze(xe) {
          var Oe = new RegExp("^".concat(xe, "\\w*")), Ce = Object.keys(fe).filter(function(Le) {
            return Oe.test(Le);
          }).sort();
          B.resultVal = { code: xe, value: xe ? Ce.length > 1 ? Ce.reduce(function(Le, tt) {
            return Le + fe[tt];
          }, "") : fe[Ce[0]] : "" }, ye && R("keyChange", xe, ye.getAttribute("data-prop") || ye);
        }
        function Me() {
          De();
        }
        function Je() {
          return ye;
        }
        return Object(t.onMounted)(function() {
          w.modal && Ie(), De(), b.on("resultReset", function() {
            B.resultVal = {};
          });
        }), Object(t.onUnmounted)(function() {
          var xe;
          (xe = document.querySelector(".key-board-modal")) === null || xe === void 0 || xe.removeEventListener("click", ve), Ze.forEach(function(Oe) {
            Oe.removeEventListener("focus", le), Oe.removeEventListener("blur", ce);
          });
        }), A(Object(t.reactive)({ color: w.color, modeList: w.modeList, handApi: w.handApi, closeKeyBoard: function() {
          ce();
        }, changeDefaultBoard: function() {
          B.showMode = "default";
        } })), f(f({}, Object(t.toRefs)(B)), {}, { defaultBoardRef: K, getCurrentInput: Je, translate: ze, reSignUp: Me, trigger: We, change: Ee });
      } });
      et.render = a;
      var Qe = et;
      Qe.install = function(w) {
        w.component(Qe.name, Qe);
      };
      var ht = Qe, Lt = ht;
      d.default = Lt;
    }, fb6a: function(i, d, e) {
      var n = e("23e7"), o = e("861d"), r = e("e8b5"), t = e("23cb"), s = e("50c4"), c = e("fc6a"), a = e("8418"), u = e("b622"), l = e("1dde"), f = l("slice"), y = u("species"), h = [].slice, p = Math.max;
      n({ target: "Array", proto: !0, forced: !f }, { slice: function(v, m) {
        var g, x, E, k = c(this), _ = s(k.length), b = t(v, _), j = t(m === void 0 ? _ : m, _);
        if (r(k) && (g = k.constructor, typeof g != "function" || g !== Array && !r(g.prototype) ? o(g) && (g = g[y], g === null && (g = void 0)) : g = void 0, g === Array || g === void 0)) return h.call(k, b, j);
        for (x = new (g === void 0 ? Array : g)(p(j - b, 0)), E = 0; b < j; b++, E++) b in k && a(x, E, k[b]);
        return x.length = E, x;
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
})(Tt);
var to = Tt.exports;
const At = /* @__PURE__ */ eo(to);
Pt({
  components: { KeyBoard: At },
  setup() {
    function ge(Z, oe) {
      console.log("change value ---->", Z), console.log("change input dom ---->", oe);
    }
    return {
      change: ge
    };
  }
});
const no = { class: "wifi-component" }, oo = { class: "row" }, ro = { class: "column" }, io = { class: "column" }, ao = { class: "status" }, so = { class: "row" }, co = { class: "column" }, uo = {
  key: 0,
  class: "wifi-modal"
}, lo = { class: "wifi-modal-content" }, fo = { class: "wifi-list" }, po = {
  key: 0,
  class: "no-wifi"
}, vo = ["onClick"], ho = { class: "wifi-ssid" }, mo = { class: "signal-strength" }, go = {
  __name: "WiFi",
  setup(ge) {
    const { sendToPyQt: Z } = Ge(), oe = ee("未连接"), i = ee("无网络"), d = ee("未知"), e = ee(""), n = ee(""), o = ee(!1), r = ee([]), t = ee(null), s = () => {
      Z("check_wifi_status", {});
    }, c = () => {
      t.value = setInterval(s, 5e3);
    }, a = () => {
      t.value && (clearInterval(t.value), t.value = null);
    };
    lt(() => {
      c();
      const { message: v } = Ge();
      rt(v, (m) => {
        if (m && m.type === "wifi_list") {
          const g = JSON.parse(m.content);
          r.value = g;
        } else if (m && m.type === "wifi_status") {
          const g = JSON.parse(m.content);
          oe.value = g.wifi_name, i.value = g.internet_status, d.value = g.zerotier_ip;
        }
      });
    }), _t(() => {
      a();
    });
    const u = async () => {
      o.value = !0, r.value = [], document.body.style.overflow = "hidden", l();
    }, l = () => {
      r.value = [], Z("search_wifi", {});
    }, f = () => {
      o.value = !1, document.body.style.overflow = "auto";
    }, y = (v) => {
      e.value = v.ssid, f();
    }, h = () => {
      Z("connect_wifi", {
        ssid: e.value,
        password: n.value
      });
    }, p = (v, m) => {
      m.placeholder === "WiFi 名称" ? e.value = v : m.placeholder === "WiFi 密码" && (n.value = v);
    };
    return (v, m) => (_e(), Se("div", no, [
      C("div", oo, [
        C("div", ro, [
          ft(C("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (g) => e.value = g),
            placeholder: "WiFi 名称",
            "data-mode": ""
          }, null, 512), [
            [pt, e.value]
          ])
        ]),
        C("div", io, [
          C("div", ao, [
            xt(" WiFi: " + Ne(oe.value) + " | 网络: " + Ne(i.value) + " ", 1),
            m[2] || (m[2] = C("br", null, null, -1)),
            xt(" zerotier ip地址: " + Ne(d.value), 1)
          ])
        ])
      ]),
      C("div", so, [
        C("div", co, [
          ft(C("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (g) => n.value = g),
            placeholder: "WiFi 密码",
            "data-mode": ""
          }, null, 512), [
            [pt, n.value]
          ])
        ]),
        C("div", { class: "column" }, [
          C("div", { class: "button-group" }, [
            C("button", { onClick: u }, "搜索可用 WiFi"),
            C("button", { onClick: h }, "连接 WiFi")
          ])
        ])
      ]),
      He(Bt(At), {
        color: "#2c3e50",
        showHandleBar: !1,
        closeOnClickModal: !1,
        onChange: p,
        class: "scaled-keyboard"
      }),
      o.value ? (_e(), Se("div", uo, [
        C("div", lo, [
          m[4] || (m[4] = C("h2", null, "可用的WiFi网络", -1)),
          C("div", fo, [
            r.value.length === 0 ? (_e(), Se("div", po, m[3] || (m[3] = [
              C("div", { class: "loading-spinner" }, null, -1),
              C("div", null, "搜索中...", -1)
            ]))) : (_e(!0), Se(ct, { key: 1 }, ut(r.value, (g) => (_e(), Se("div", {
              key: g.ssid,
              class: "wifi-item",
              onClick: (x) => y(g)
            }, [
              C("span", ho, Ne(g.ssid), 1),
              C("span", mo, "信号强度: " + Ne(g.signal), 1)
            ], 8, vo))), 128))
          ]),
          C("div", { class: "modal-buttons" }, [
            C("button", { onClick: l }, "重新搜索"),
            C("button", { onClick: f }, "关闭")
          ])
        ])
      ])) : st("", !0)
    ]));
  }
}, yo = /* @__PURE__ */ it(go, [["__scopeId", "data-v-e6b1dc64"]]), bo = {
  key: 0,
  class: "numeric-keyboard"
}, wo = { class: "keyboard" }, xo = { class: "current-value" }, ko = ["onClick"], _o = {
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
  setup(ge, { emit: Z }) {
    const oe = ge, i = Z, d = ee([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), e = ee("");
    rt(() => oe.showKeyboard, (o) => {
      o && (e.value = oe.modelValue.toString());
    });
    const n = (o) => {
      o === "清除" ? e.value = "" : o === "确定" ? (i("update:modelValue", e.value), i("update:showKeyboard", !1)) : e.value += o;
    };
    return (o, r) => ge.showKeyboard ? (_e(), Se("div", bo, [
      C("div", wo, [
        C("div", xo, Ne(e.value), 1),
        (_e(!0), Se(ct, null, ut(d.value, (t) => (_e(), Se("div", {
          key: t.join(),
          class: "row"
        }, [
          (_e(!0), Se(ct, null, ut(t, (s) => (_e(), Se("button", {
            key: s,
            onClick: (c) => n(s),
            class: at({ "function-key": s === "清除" || s === "确定" })
          }, Ne(s), 11, ko))), 128))
        ]))), 128))
      ])
    ])) : st("", !0);
  }
}, Ot = /* @__PURE__ */ it(_o, [["__scopeId", "data-v-2ccc1cb7"]]), So = { class: "container" }, Oo = { class: "column" }, jo = { class: "status-bar" }, Eo = ["disabled"], Co = { class: "column" }, To = {
  key: 0,
  class: "modal"
}, Ao = { class: "modal-content" }, Lo = {
  __name: "Lock",
  emits: ["messageFromA"],
  setup(ge, { emit: Z }) {
    const { sendToPyQt: oe } = Ge(), i = vt({
      isPyQtWebEngine: !1
    }), d = ee("未激活"), e = ee(0), n = ee(""), o = ee(""), r = ee(!1), t = ee(7776e3);
    let s, c;
    const a = ee(0), u = ee(1), l = ee(null), f = ee(!1), y = ee(!1), h = bt(() => d.value === "未激活" ? "设备状态: 未激活" : d.value === "永久激活" ? "设备状态: 已永久激活" : `即将第 ${u.value} 次锁定 - 剩余时间: ${p.value}`), p = bt(() => {
      const I = Math.floor(e.value / 86400), T = Math.floor(e.value % (24 * 60 * 60) / (60 * 60)), A = Math.floor(e.value % (60 * 60) / 60), L = e.value % 60;
      return `${I}天 ${T.toString().padStart(2, "0")}:${A.toString().padStart(2, "0")}:${L.toString().padStart(2, "0")}`;
    }), v = bt(() => d.value === "未激活" ? "按住以激活设备" : `设备码：${n.value}`);
    function m(I) {
      d.value === "未激活" && (I.target.setPointerCapture(I.pointerId), a.value = 0, c = setInterval(() => {
        a.value += 2, a.value >= 100 && (clearInterval(c), E());
      }, 30));
    }
    function g(I) {
      I.target.releasePointerCapture(I.pointerId), x();
    }
    function x() {
      clearInterval(c), a.value = 0;
    }
    function E() {
      oe("activate_device", {});
    }
    function k(I, T) {
      oe("Lock_set_response", { method: "activateDevice", args: { randomCode: I, time: T } }), d.value = "已激活", n.value = I, l.value = T, _();
    }
    function _() {
      b(), s = setInterval(() => {
        e.value > 0 ? b() : j();
      }, 1e3);
    }
    function b() {
      const I = Date.now(), T = l.value + t.value * 1e3;
      e.value = Math.max(0, Math.floor((T - I) / 1e3));
    }
    function j() {
      r.value = !0, document.body.style.overflow = "hidden", clearInterval(s), te();
    }
    function O() {
      N(o.value);
    }
    function N(I) {
      oe("check_lock_password", {
        target: "attemptUnlock",
        password: I,
        lockCount: u.value,
        deviceRandomCode: n.value
      }), o.value = "";
    }
    function S() {
      d.value = "永久激活", r.value = !1, document.body.style.overflow = "auto", clearInterval(s);
    }
    function F() {
      r.value = !1, document.body.style.overflow = "auto", u.value++, s && clearInterval(s), _();
    }
    _t(() => {
      clearInterval(s), clearInterval(c);
    }), lt(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: I } = Ge();
        rt(I, (T) => {
          if (T && T.type === "confirm_lock_password")
            try {
              const A = JSON.parse(T.content);
              A.target === "attemptUnlock" && (A.result === "success" ? (r.value ? l.value = Date.now() : l.value = l.value + t.value * 1e3, oe("update_baseTime", l.value), F(), oe("Lock_set_response", { method: "extendLockTime", args: { baseTime: l.value } })) : A.result === "forever_success" ? (S(), oe("Lock_set_response", { method: "permanentUnlock", args: {} })) : oe("Lock_set_response", { method: "unlockFailed", args: {} }));
            } catch (A) {
              console.error("Failed to parse confirm lock password :", A);
            }
          else if (T && T.type === "device_activated")
            try {
              const A = JSON.parse(T.content);
              k(A.device_random_code, A.device_base_time);
            } catch (A) {
              console.error("Failed to parse device activation result:", A);
            }
          else if (T && T.type === "device_info")
            try {
              const A = JSON.parse(T.content);
              d.value = A.device_status, n.value = A.device_random_code, u.value = A.device_lock_count, l.value = A.device_base_time, A.device_status === "已激活" ? _() : A.device_status === "永久激活" && S();
            } catch (A) {
              console.error("Failed to parse device status:", A);
            }
          else if (T && T.type === "Lock_init")
            V();
          else if (T && T.type === "Lock_set") {
            console.log("Lock_set:", T.content);
            const A = JSON.parse(T.content);
            A.method === "requestActivation" ? E() : A.method === "attemptUnlock" && N(A.args.password);
          }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const V = () => {
      const I = {
        deviceStatus: d.value,
        timeToNextLock: e.value,
        deviceRandomCode: n.value,
        unlockKey: o.value,
        isLocked: r.value,
        lockInterval: t.value,
        lockCount: u.value,
        baseTime: l.value,
        progressWidth: a.value,
        showUnlockKeyboard: f.value,
        showModalUnlockKeyboard: y.value
      };
      console.log("Sending Lock initial state:", I), oe("Lock_init_response", I);
    }, H = Z, te = () => {
      H("messageFromA", {
        content: "hello",
        // 消息内容
        timestamp: Date.now()
        // 时间戳
      });
    };
    return (I, T) => (_e(), Se("div", So, [
      C("div", Oo, [
        C("div", jo, Ne(h.value), 1),
        C("button", {
          class: "activation-button",
          onPointerdown: m,
          onPointerup: g,
          onPointercancel: x,
          onPointerleave: x,
          disabled: d.value !== "未激活"
        }, [
          xt(Ne(v.value) + " ", 1),
          C("div", {
            class: "progress-bar",
            style: wt({ width: a.value + "%" })
          }, null, 4)
        ], 40, Eo)
      ]),
      C("div", Co, [
        ft(C("input", {
          "onUpdate:modelValue": T[0] || (T[0] = (A) => o.value = A),
          placeholder: "输入解锁密钥",
          readonly: "",
          onFocus: T[1] || (T[1] = (A) => f.value = !0)
        }, null, 544), [
          [pt, o.value]
        ]),
        C("button", {
          class: "unlock-button",
          onClick: O
        }, "解锁")
      ]),
      r.value ? (_e(), Se("div", To, [
        C("div", Ao, [
          T[8] || (T[8] = C("h3", null, "设备已锁定", -1)),
          C("h3", null, "第 " + Ne(u.value) + " 次锁定", 1),
          C("h3", null, "设备随机码: " + Ne(n.value), 1),
          ft(C("input", {
            "onUpdate:modelValue": T[2] || (T[2] = (A) => o.value = A),
            placeholder: "输入解锁密钥",
            readonly: "",
            onFocus: T[3] || (T[3] = (A) => y.value = !0)
          }, null, 544), [
            [pt, o.value]
          ]),
          C("button", {
            class: "unlock-button",
            onClick: O
          }, "解锁")
        ])
      ])) : st("", !0),
      He(Ot, {
        modelValue: o.value,
        "onUpdate:modelValue": T[4] || (T[4] = (A) => o.value = A),
        showKeyboard: f.value,
        "onUpdate:showKeyboard": T[5] || (T[5] = (A) => f.value = A)
      }, null, 8, ["modelValue", "showKeyboard"]),
      He(Ot, {
        modelValue: o.value,
        "onUpdate:modelValue": T[6] || (T[6] = (A) => o.value = A),
        showKeyboard: y.value,
        "onUpdate:showKeyboard": T[7] || (T[7] = (A) => y.value = A)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, No = /* @__PURE__ */ it(Lo, [["__scopeId", "data-v-3d3fd364"]]), Po = { class: "app-container" }, Ro = {
  __name: "App",
  setup(ge) {
    It();
    const Z = ee(""), oe = (i) => {
      Z.value = i;
    };
    return (i, d) => (_e(), Se("div", Po, [
      d[0] || (d[0] = C("h1", null, "涪特智能养护台车控制系统", -1)),
      He(yn),
      He(Xn),
      He(rn),
      He($n, { message: Z.value }, null, 8, ["message"]),
      He(yo),
      He(No, { onMessageFromA: oe })
    ]));
  }
};
export {
  Ro as default
};
