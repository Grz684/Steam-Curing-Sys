import { ref as r, onMounted as T, provide as A, readonly as M, inject as N, watch as I, openBlock as g, createElementBlock as f, createElementVNode as e, toDisplayString as Q, Fragment as V, renderList as L, normalizeClass as E, createCommentVNode as R, reactive as j, createVNode as W, onUnmounted as ne, normalizeStyle as H } from "vue";
const G = Symbol(), X = Symbol(), Y = Symbol();
function le(m, l) {
  m && m.messageSignal ? m.messageSignal.connect((i) => {
    try {
      const s = JSON.parse(i);
      l.value = s, console.log("Received message from PyQt:", s);
    } catch (s) {
      console.error("Failed to parse message:", s), l.value = { type: "unknown", content: i };
    }
  }) : console.error("messageSignal not found on bridge");
}
function ae() {
  const m = r(null), l = r(null), i = r("");
  function s() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (o) => {
      m.value = o, l.value = o.objects.bridge, console.log("QWebChannel initialized", o, o.objects.bridge), le(l.value, i), l.value && typeof l.value.vueReady == "function" ? l.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  T(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? s() : document.addEventListener("DOMContentLoaded", s);
  }), A(G, M(m)), A(X, M(l)), A(Y, M(i));
}
function x() {
  const m = N(G), l = N(X), i = N(Y);
  return (!m || !l || !i) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: m,
    bridge: l,
    message: i,
    sendToPyQt: (o, a) => {
      if (console.log(`Attempting to call ${o} with args:`, a), l && l.value)
        if (typeof l.value.sendToPyQt == "function")
          try {
            l.value.sendToPyQt(o, JSON.stringify(a));
          } catch (v) {
            console.error("Error calling sendToPyQt:", v);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(l.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const D = (m, l) => {
  const i = m.__vccOpts || m;
  for (const [s, o] of l)
    i[s] = o;
  return i;
}, ie = {
  key: 0,
  class: "numeric-keyboard"
}, ue = { class: "keyboard" }, re = { class: "current-value" }, de = ["onClick"], ve = {
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
  setup(m, { emit: l }) {
    const i = m, s = l, o = r([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), a = r("");
    I(() => i.showKeyboard, (b) => {
      b && (a.value = i.modelValue.toString());
    });
    const v = (b) => {
      b === "清除" ? a.value = "" : b === "确定" ? (s("update:modelValue", parseFloat(a.value) || 0), s("update:showKeyboard", !1)) : a.value += b;
    };
    return (b, y) => m.showKeyboard ? (g(), f("div", ie, [
      e("div", ue, [
        e("div", re, Q(a.value), 1),
        (g(!0), f(V, null, L(o.value, (w) => (g(), f("div", {
          key: w.join(),
          class: "row"
        }, [
          (g(!0), f(V, null, L(w, (p) => (g(), f("button", {
            key: p,
            onClick: (C) => v(p),
            class: E({ "function-key": p === "清除" || p === "确定" })
          }, Q(p), 11, de))), 128))
        ]))), 128))
      ])
    ])) : R("", !0);
  }
}, O = /* @__PURE__ */ D(ve, [["__scopeId", "data-v-541feda2"]]), ce = { class: "settings-container" }, pe = { class: "setting-group" }, me = { class: "setting-item" }, ye = { class: "setting-controls" }, ge = ["value"], fe = { class: "setting-item" }, be = { class: "setting-controls" }, _e = ["value"], we = { class: "setting-group" }, he = { class: "setting-item" }, $e = { class: "setting-controls" }, Qe = ["value"], Ce = { class: "setting-item" }, ke = { class: "setting-controls" }, Se = ["value"], We = {
  __name: "SensorSettings",
  setup(m) {
    const { sendToPyQt: l } = x(), i = j({
      isPyQtWebEngine: !1
    }), s = r(30), o = r(10), a = r(80), v = r(20), b = r(!1), y = r(null), w = r("");
    T(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: c } = x();
        I(c, (t) => {
          if (t && t.type === "update_limit_settings")
            try {
              const u = JSON.parse(t.content);
              s.value = u.temp_upper, o.value = u.temp_lower, a.value = u.humidity_upper, v.value = u.humidity_lower, console.log("Sensor Settings updated:", u);
            } catch (u) {
              console.error("Failed to parse sensor settings data:", u);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const p = (c, t) => {
      const u = c === "tempUpper" ? s : c === "tempLower" ? o : c === "humidityUpper" ? a : v;
      u.value = (u.value || 0) + t, c.startsWith("temp") ? C(c === "tempUpper" ? "upper" : "lower") : k(c === "humidityUpper" ? "upper" : "lower");
    }, C = (c) => {
      s.value === "" && (s.value = o.value + 1), o.value === "" && (o.value = s.value - 1), c === "upper" ? s.value = Math.max(o.value + 1, s.value) : o.value = Math.min(s.value - 1, o.value), h();
    }, k = (c) => {
      a.value === "" && (a.value = v.value + 1), v.value === "" && (v.value = a.value - 1), c === "upper" ? a.value = Math.min(100, Math.max(v.value + 1, a.value)) : v.value = Math.max(0, Math.min(a.value - 1, v.value)), h();
    }, h = () => {
      if (s.value !== "" && o.value !== "" && a.value !== "" && v.value !== "") {
        const c = {
          temp_upper: s.value,
          temp_lower: o.value,
          humidity_upper: a.value,
          humidity_lower: v.value
        };
        console.log("设置已更新:", c), i.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), l("updateLimitSettings", c)) : console.log("在普通网页环境中执行更新设置");
      }
    }, $ = (c) => {
      y.value = c, b.value = !0, w.value = c.startsWith("temp") ? c === "tempUpper" ? s.value : o.value : c === "humidityUpper" ? a.value : v.value;
    }, S = (c) => {
      const t = parseFloat(c);
      isNaN(t) || (y.value === "tempUpper" ? (s.value = t, C("upper")) : y.value === "tempLower" ? (o.value = t, C("lower")) : y.value === "humidityUpper" ? (a.value = t, k("upper")) : y.value === "humidityLower" && (v.value = t, k("lower"))), y.value = null;
    };
    return (c, t) => (g(), f("div", ce, [
      e("div", pe, [
        t[15] || (t[15] = e("h2", null, "温度设置 (°C)", -1)),
        e("div", me, [
          t[13] || (t[13] = e("span", { class: "setting-label" }, "上限：", -1)),
          e("div", ye, [
            e("button", {
              onClick: t[0] || (t[0] = (u) => p("tempUpper", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: s.value,
              onFocus: t[1] || (t[1] = (u) => $("tempUpper")),
              readonly: ""
            }, null, 40, ge),
            e("button", {
              onClick: t[2] || (t[2] = (u) => p("tempUpper", 1))
            }, "+")
          ])
        ]),
        e("div", fe, [
          t[14] || (t[14] = e("span", { class: "setting-label" }, "下限：", -1)),
          e("div", be, [
            e("button", {
              onClick: t[3] || (t[3] = (u) => p("tempLower", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: o.value,
              onFocus: t[4] || (t[4] = (u) => $("tempLower")),
              readonly: ""
            }, null, 40, _e),
            e("button", {
              onClick: t[5] || (t[5] = (u) => p("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      e("div", we, [
        t[18] || (t[18] = e("h2", null, "湿度设置 (%)", -1)),
        e("div", he, [
          t[16] || (t[16] = e("span", { class: "setting-label" }, "上限：", -1)),
          e("div", $e, [
            e("button", {
              onClick: t[6] || (t[6] = (u) => p("humidityUpper", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: a.value,
              onFocus: t[7] || (t[7] = (u) => $("humidityUpper")),
              readonly: ""
            }, null, 40, Qe),
            e("button", {
              onClick: t[8] || (t[8] = (u) => p("humidityUpper", 1))
            }, "+")
          ])
        ]),
        e("div", Ce, [
          t[17] || (t[17] = e("span", { class: "setting-label" }, "下限：", -1)),
          e("div", ke, [
            e("button", {
              onClick: t[9] || (t[9] = (u) => p("humidityLower", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: v.value,
              onFocus: t[10] || (t[10] = (u) => $("humidityLower")),
              readonly: ""
            }, null, 40, Se),
            e("button", {
              onClick: t[11] || (t[11] = (u) => p("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      W(O, {
        modelValue: w.value,
        showKeyboard: b.value,
        "onUpdate:modelValue": S,
        "onUpdate:showKeyboard": t[12] || (t[12] = (u) => b.value = u)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Pe = /* @__PURE__ */ D(We, [["__scopeId", "data-v-22394ea0"]]), Ee = { class: "sensor-data-group" }, xe = { class: "sensor-section" }, Te = { class: "sensor-container" }, De = { class: "sensor-grid" }, Ue = { class: "sensor-title" }, Fe = { class: "sensor-value" }, Ke = { class: "sensor-section" }, Ve = { class: "sensor-container" }, Le = { class: "sensor-grid" }, Ie = { class: "sensor-title" }, qe = { class: "sensor-value" }, Ae = {
  __name: "SensorDisplay",
  setup(m) {
    const l = r({ temperature: {}, humidity: {} });
    T(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: s } = x();
        I(s, (o) => {
          if (o && o.type === "update_sensor_data")
            try {
              l.value = JSON.parse(o.content);
            } catch (a) {
              console.error("Failed to parse sensor data:", a);
            }
        });
      } else
        console.log("在普通网页环境中执行"), i(), setInterval(i, 5e3);
    });
    const i = async () => {
      try {
        const s = await fetch("http://localhost:8000/api/sensor-data/");
        if (!s.ok)
          throw new Error(`HTTP error! status: ${s.status}`);
        const o = await s.json();
        l.value = o;
      } catch (s) {
        console.error("Error fetching sensor data:", s);
      }
    };
    return (s, o) => (g(), f("div", Ee, [
      e("div", xe, [
        o[0] || (o[0] = e("h2", null, "温度传感器", -1)),
        e("div", Te, [
          e("div", De, [
            (g(!0), f(V, null, L(l.value.temperature, (a, v) => (g(), f("div", {
              key: v,
              class: "sensor-card"
            }, [
              e("div", Ue, Q(v), 1),
              e("div", Fe, Q(a), 1)
            ]))), 128))
          ])
        ])
      ]),
      e("div", Ke, [
        o[1] || (o[1] = e("h2", null, "湿度传感器", -1)),
        e("div", Ve, [
          e("div", Le, [
            (g(!0), f(V, null, L(l.value.humidity, (a, v) => (g(), f("div", {
              key: v,
              class: "sensor-card"
            }, [
              e("div", Ie, Q(v), 1),
              e("div", qe, Q(a), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, Me = /* @__PURE__ */ D(Ae, [["__scopeId", "data-v-39bdb13c"]]), Ne = { class: "cart-system" }, Re = { class: "water-protection" }, Oe = { class: "mode-group" }, je = ["disabled"], Je = ["disabled"], ze = { class: "mode-content" }, Be = { key: 0 }, He = { class: "controls" }, Ge = { class: "input-group" }, Xe = { class: "input-group" }, Ye = { class: "button-group" }, Ze = ["disabled"], et = ["disabled"], tt = { class: "visualization" }, ot = { class: "progress-bar" }, st = { class: "status" }, nt = {
  key: 1,
  class: "auto-mode-container"
}, lt = {
  __name: "CartSystem",
  setup(m) {
    const l = r("semi-auto"), i = r(6), s = r(12), o = r(i.value), a = r(s.value), v = r(i.value), b = r(s.value), y = r(!1), w = r(0), p = r("系统就绪"), C = r("小车尚未工作"), k = r(!1), h = r(!1), $ = r(!1);
    let S = null;
    const c = r(!1), t = r(!1), { sendToPyQt: u } = x(), P = j({
      isPyQtWebEngine: !1
    });
    T(() => {
      if (P.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, P.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: _ } = x();
        I(_, (n) => {
          if (n && n.type === "update_dolly_settings")
            try {
              const d = JSON.parse(n.content);
              o.value = d.dolly_single_run_time, a.value = d.dolly_run_interval_time, v.value = o.value, b.value = a.value, console.log("dolly Settings updated:", d);
            } catch (d) {
              console.error("Failed to parse dolly settings data:", d);
            }
          else if (n && n.type === "update_dolly_state")
            n.content ? F("小车正在运行") : F("小车尚未工作");
          else if (n && n.type === "update_water_tank_status")
            try {
              const d = JSON.parse(n.content);
              d.side === "left" ? c.value = d.low_water : d.side === "right" && (t.value = d.low_water), c.value || t.value ? ($.value = !0, l.value === "auto" ? (F("小车尚未工作"), u("controlDolly", { target: "setMode", mode: "semi-auto" }), U()) : q()) : ($.value = !1, l.value === "auto" && u("controlDolly", { target: "setMode", mode: "auto" })), console.log("Water tank status updated:", d);
            } catch (d) {
              console.error("Failed to parse water tank status data:", d);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const J = (_) => {
      l.value = _, P.isPyQtWebEngine && (_ === "auto" ? (q(), u("controlDolly", { target: "setMode", mode: "auto" })) : (U(), F("小车尚未工作"), u("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, Z = () => {
      o.value = Math.max(1, parseInt(o.value) || 1), v.value = o.value, z();
    }, ee = () => {
      a.value = Math.max(0, parseInt(a.value) || 0), b.value = a.value, z();
    };
    function z() {
      if (P.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const _ = {
          target: "dolly_settings",
          dolly_single_run_time: v.value,
          dolly_run_interval_time: b.value
        };
        u("controlDolly", _);
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    const te = () => {
      y.value = !0, B();
    }, q = () => {
      U(), y.value = !1, cancelAnimationFrame(S), w.value = 0, p.value = "系统就绪";
    };
    function U() {
      P.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), u("controlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function oe() {
      P.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), u("controlDolly", {
        target: "setState",
        dolly_state: !0
      })) : console.log("在普通网页环境中执行更新设置");
    }
    const B = () => {
      oe(), p.value = "小车运行中", w.value = 0;
      const _ = Date.now();
      i.value = v.value;
      const n = () => {
        const d = (Date.now() - _) / 1e3, K = Math.max(0, i.value - d);
        w.value = d / i.value * 100, p.value = `小车运行中: 剩余 ${K.toFixed(1)} 秒`, d < i.value && y.value ? S = requestAnimationFrame(n) : y.value && (w.value = 100, U(), se());
      };
      S = requestAnimationFrame(n);
    }, se = () => {
      p.value = "等待下次运行";
      const _ = Date.now();
      s.value = b.value;
      const n = () => {
        const d = (Date.now() - _) / 1e3, K = Math.max(0, s.value - d);
        p.value = `等待下次运行: ${K.toFixed(1)}秒`, K > 0 && y.value ? S = requestAnimationFrame(n) : y.value && B();
      };
      S = requestAnimationFrame(n);
    }, F = (_) => {
      C.value = _;
    };
    return ne(() => {
      cancelAnimationFrame(S);
    }), (_, n) => (g(), f("div", Ne, [
      e("div", Re, [
        e("div", {
          class: E(["water-tank", { "low-water": c.value }])
        }, " 左水箱: " + Q(c.value ? "缺水" : "正常"), 3),
        e("div", {
          class: E(["water-tank", { "low-water": t.value }])
        }, " 右水箱: " + Q(t.value ? "缺水" : "正常"), 3)
      ]),
      e("div", Oe, [
        e("button", {
          class: E(["mode-button", { active: l.value === "semi-auto" && !$.value }]),
          disabled: $.value,
          onClick: n[0] || (n[0] = (d) => l.value === "auto" ? J("semi-auto") : () => {
          })
        }, "半自动模式", 10, je),
        e("button", {
          class: E(["mode-button", { active: l.value === "auto" && !$.value }]),
          disabled: $.value,
          onClick: n[1] || (n[1] = (d) => l.value === "semi-auto" ? J("auto") : () => {
          })
        }, "自动模式", 10, Je)
      ]),
      e("div", ze, [
        l.value === "semi-auto" ? (g(), f("div", Be, [
          e("div", He, [
            e("div", Ge, [
              n[8] || (n[8] = e("label", null, "单次运行时间 (秒):", -1)),
              e("div", {
                class: "input-wrapper",
                onClick: n[2] || (n[2] = (d) => k.value = !0)
              }, Q(o.value), 1)
            ]),
            e("div", Xe, [
              n[9] || (n[9] = e("label", null, "循环间隔时间 (秒):", -1)),
              e("div", {
                class: "input-wrapper",
                onClick: n[3] || (n[3] = (d) => h.value = !0)
              }, Q(a.value), 1)
            ]),
            e("div", Ye, [
              e("button", {
                onClick: te,
                disabled: y.value || $.value
              }, "开始", 8, Ze),
              e("button", {
                onClick: q,
                disabled: !y.value || $.value
              }, "停止", 8, et)
            ])
          ]),
          e("div", tt, [
            e("div", ot, [
              e("div", {
                class: "progress",
                style: H({ width: w.value + "%" })
              }, null, 4),
              e("div", {
                class: "cart",
                style: H({ left: w.value + "%" })
              }, n[10] || (n[10] = [
                e("span", { class: "cart-icon" }, "🚜", -1)
              ]), 4)
            ])
          ]),
          e("div", st, Q(p.value), 1)
        ])) : (g(), f("div", nt, [
          n[11] || (n[11] = e("div", { class: "auto-mode-title" }, "自动模式受传感器湿度控制", -1)),
          e("div", {
            class: E(["auto-mode-status", { working: C.value === "小车正在运行" }])
          }, Q(C.value), 3),
          n[12] || (n[12] = e("div", { class: "auto-mode-placeholder" }, null, -1))
        ]))
      ]),
      W(O, {
        modelValue: o.value,
        "onUpdate:modelValue": [
          n[4] || (n[4] = (d) => o.value = d),
          Z
        ],
        showKeyboard: k.value,
        "onUpdate:showKeyboard": n[5] || (n[5] = (d) => k.value = d)
      }, null, 8, ["modelValue", "showKeyboard"]),
      W(O, {
        modelValue: a.value,
        "onUpdate:modelValue": [
          n[6] || (n[6] = (d) => a.value = d),
          ee
        ],
        showKeyboard: h.value,
        "onUpdate:showKeyboard": n[7] || (n[7] = (d) => h.value = d)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, at = /* @__PURE__ */ D(lt, [["__scopeId", "data-v-b48d851a"]]), it = { class: "data-actions" }, ut = {
  key: 0,
  class: "modal-overlay"
}, rt = {
  key: 1,
  class: "modal-overlay"
}, dt = { class: "modal-content" }, vt = {
  __name: "DataExport",
  setup(m) {
    const { sendToPyQt: l } = x(), i = j({
      isPyQtWebEngine: !1
    }), s = r(!1), o = r(!1), a = r("");
    T(() => {
      i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const v = () => {
      i.isPyQtWebEngine && (console.log("导出数据"), l("exportData", !0));
    }, b = () => {
      s.value = !0;
    }, y = () => {
      s.value = !1;
    }, w = () => {
      console.log("清空数据"), s.value = !1, p("所有数据已清空！"), i.isPyQtWebEngine && l("exportData", !1);
    }, p = (k) => {
      a.value = k, o.value = !0;
    }, C = () => {
      o.value = !1;
    };
    return (k, h) => (g(), f("div", it, [
      e("div", { class: "action-buttons" }, [
        e("div", { class: "button-group" }, [
          h[0] || (h[0] = e("i", { class: "fas fa-file-excel" }, null, -1)),
          e("button", {
            onClick: v,
            class: "export-btn"
          }, "导出数据")
        ]),
        e("div", { class: "button-group" }, [
          h[1] || (h[1] = e("i", { class: "fas fa-trash-alt" }, null, -1)),
          e("button", {
            onClick: b,
            class: "clear-btn"
          }, "清空数据")
        ])
      ]),
      s.value ? (g(), f("div", ut, [
        e("div", { class: "modal-content" }, [
          h[2] || (h[2] = e("p", null, "确定要清空所有数据吗？此操作不可撤销。", -1)),
          e("div", { class: "modal-buttons" }, [
            e("button", {
              onClick: w,
              class: "confirm-btn"
            }, "确定"),
            e("button", {
              onClick: y,
              class: "cancel-btn"
            }, "取消")
          ])
        ])
      ])) : R("", !0),
      o.value ? (g(), f("div", rt, [
        e("div", dt, [
          e("p", null, Q(a.value), 1),
          e("div", { class: "modal-buttons" }, [
            e("button", {
              onClick: C,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : R("", !0)
    ]));
  }
}, ct = /* @__PURE__ */ D(vt, [["__scopeId", "data-v-86824edf"]]), pt = { class: "settings-container" }, yt = {
  __name: "App",
  setup(m) {
    return ae(), (l, i) => (g(), f("div", pt, [
      i[0] || (i[0] = e("h1", null, "涪特智能养护台车控制系统", -1)),
      W(Me),
      W(ct),
      W(Pe),
      W(at)
    ]));
  }
};
export {
  yt as default
};
