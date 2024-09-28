import { ref as d, onMounted as x, provide as I, readonly as q, inject as A, watch as K, openBlock as g, createElementBlock as f, createElementVNode as e, toDisplayString as $, Fragment as U, renderList as F, normalizeClass as W, createCommentVNode as N, reactive as R, createVNode as S, onUnmounted as se, normalizeStyle as B } from "vue";
const H = Symbol(), G = Symbol(), X = Symbol();
function ne(m, a) {
  m && m.messageSignal ? m.messageSignal.connect((i) => {
    try {
      const s = JSON.parse(i);
      a.value = s, console.log("Received message from PyQt:", s);
    } catch (s) {
      console.error("Failed to parse message:", s), a.value = { type: "unknown", content: i };
    }
  }) : console.error("messageSignal not found on bridge");
}
function le() {
  const m = d(null), a = d(null), i = d("");
  function s() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (o) => {
      m.value = o, a.value = o.objects.bridge, console.log("QWebChannel initialized", o, o.objects.bridge), ne(a.value, i), a.value && typeof a.value.vueReady == "function" ? a.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  x(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? s() : document.addEventListener("DOMContentLoaded", s);
  }), I(H, q(m)), I(G, q(a)), I(X, q(i));
}
function P() {
  const m = A(H), a = A(G), i = A(X);
  return (!m || !a || !i) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: m,
    bridge: a,
    message: i,
    sendToPyQt: (o, l) => {
      if (console.log(`Attempting to call ${o} with args:`, l), a && a.value)
        if (typeof a.value.sendToPyQt == "function")
          try {
            a.value.sendToPyQt(o, JSON.stringify(l));
          } catch (v) {
            console.error("Error calling sendToPyQt:", v);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(a.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const T = (m, a) => {
  const i = m.__vccOpts || m;
  for (const [s, o] of a)
    i[s] = o;
  return i;
}, ae = {
  key: 0,
  class: "numeric-keyboard"
}, ie = { class: "keyboard" }, ue = { class: "current-value" }, re = ["onClick"], de = {
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
  setup(m, { emit: a }) {
    const i = m, s = a, o = d([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), l = d("");
    K(() => i.showKeyboard, (b) => {
      b && (l.value = i.modelValue.toString());
    });
    const v = (b) => {
      b === "清除" ? l.value = "" : b === "确定" ? (s("update:modelValue", parseFloat(l.value) || 0), s("update:showKeyboard", !1)) : l.value += b;
    };
    return (b, y) => m.showKeyboard ? (g(), f("div", ae, [
      e("div", ie, [
        e("div", ue, $(l.value), 1),
        (g(!0), f(U, null, F(o.value, (w) => (g(), f("div", {
          key: w.join(),
          class: "row"
        }, [
          (g(!0), f(U, null, F(w, (p) => (g(), f("button", {
            key: p,
            onClick: (C) => v(p),
            class: W({ "function-key": p === "清除" || p === "确定" })
          }, $(p), 11, re))), 128))
        ]))), 128))
      ])
    ])) : N("", !0);
  }
}, M = /* @__PURE__ */ T(de, [["__scopeId", "data-v-541feda2"]]), ve = { class: "settings-container" }, ce = { class: "setting-group" }, pe = { class: "setting-item" }, me = { class: "setting-controls" }, ye = ["value"], ge = { class: "setting-item" }, fe = { class: "setting-controls" }, be = ["value"], _e = { class: "setting-group" }, we = { class: "setting-item" }, he = { class: "setting-controls" }, $e = ["value"], Qe = { class: "setting-item" }, Ce = { class: "setting-controls" }, ke = ["value"], Se = {
  __name: "SensorSettings",
  setup(m) {
    const { sendToPyQt: a } = P(), i = R({
      isPyQtWebEngine: !1
    }), s = d(30), o = d(10), l = d(80), v = d(20), b = d(!1), y = d(null), w = d("");
    x(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: c } = P();
        K(c, (t) => {
          if (t && t.type === "update_limit_settings")
            try {
              const u = JSON.parse(t.content);
              s.value = u.temp_upper, o.value = u.temp_lower, l.value = u.humidity_upper, v.value = u.humidity_lower, console.log("Sensor Settings updated:", u);
            } catch (u) {
              console.error("Failed to parse sensor settings data:", u);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const p = (c, t) => {
      const u = c === "tempUpper" ? s : c === "tempLower" ? o : c === "humidityUpper" ? l : v;
      u.value = (u.value || 0) + t, c.startsWith("temp") ? C(c === "tempUpper" ? "upper" : "lower") : k(c === "humidityUpper" ? "upper" : "lower");
    }, C = (c) => {
      s.value === "" && (s.value = o.value + 1), o.value === "" && (o.value = s.value - 1), c === "upper" ? s.value = Math.max(o.value + 1, s.value) : o.value = Math.min(s.value - 1, o.value), h();
    }, k = (c) => {
      l.value === "" && (l.value = v.value + 1), v.value === "" && (v.value = l.value - 1), c === "upper" ? l.value = Math.min(100, Math.max(v.value + 1, l.value)) : v.value = Math.max(0, Math.min(l.value - 1, v.value)), h();
    }, h = () => {
      if (s.value !== "" && o.value !== "" && l.value !== "" && v.value !== "") {
        const c = {
          temp_upper: s.value,
          temp_lower: o.value,
          humidity_upper: l.value,
          humidity_lower: v.value
        };
        console.log("设置已更新:", c), i.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), a("updateLimitSettings", c)) : console.log("在普通网页环境中执行更新设置");
      }
    }, Q = (c) => {
      y.value = c, b.value = !0, w.value = c.startsWith("temp") ? c === "tempUpper" ? s.value : o.value : c === "humidityUpper" ? l.value : v.value;
    }, E = (c) => {
      const t = parseFloat(c);
      isNaN(t) || (y.value === "tempUpper" ? (s.value = t, C("upper")) : y.value === "tempLower" ? (o.value = t, C("lower")) : y.value === "humidityUpper" ? (l.value = t, k("upper")) : y.value === "humidityLower" && (v.value = t, k("lower"))), y.value = null;
    };
    return (c, t) => (g(), f("div", ve, [
      e("div", ce, [
        t[15] || (t[15] = e("h2", null, "温度设置 (°C)", -1)),
        e("div", pe, [
          t[13] || (t[13] = e("span", { class: "setting-label" }, "上限：", -1)),
          e("div", me, [
            e("button", {
              onClick: t[0] || (t[0] = (u) => p("tempUpper", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: s.value,
              onFocus: t[1] || (t[1] = (u) => Q("tempUpper")),
              readonly: ""
            }, null, 40, ye),
            e("button", {
              onClick: t[2] || (t[2] = (u) => p("tempUpper", 1))
            }, "+")
          ])
        ]),
        e("div", ge, [
          t[14] || (t[14] = e("span", { class: "setting-label" }, "下限：", -1)),
          e("div", fe, [
            e("button", {
              onClick: t[3] || (t[3] = (u) => p("tempLower", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: o.value,
              onFocus: t[4] || (t[4] = (u) => Q("tempLower")),
              readonly: ""
            }, null, 40, be),
            e("button", {
              onClick: t[5] || (t[5] = (u) => p("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      e("div", _e, [
        t[18] || (t[18] = e("h2", null, "湿度设置 (%)", -1)),
        e("div", we, [
          t[16] || (t[16] = e("span", { class: "setting-label" }, "上限：", -1)),
          e("div", he, [
            e("button", {
              onClick: t[6] || (t[6] = (u) => p("humidityUpper", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: l.value,
              onFocus: t[7] || (t[7] = (u) => Q("humidityUpper")),
              readonly: ""
            }, null, 40, $e),
            e("button", {
              onClick: t[8] || (t[8] = (u) => p("humidityUpper", 1))
            }, "+")
          ])
        ]),
        e("div", Qe, [
          t[17] || (t[17] = e("span", { class: "setting-label" }, "下限：", -1)),
          e("div", Ce, [
            e("button", {
              onClick: t[9] || (t[9] = (u) => p("humidityLower", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: v.value,
              onFocus: t[10] || (t[10] = (u) => Q("humidityLower")),
              readonly: ""
            }, null, 40, ke),
            e("button", {
              onClick: t[11] || (t[11] = (u) => p("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      S(M, {
        modelValue: w.value,
        showKeyboard: b.value,
        "onUpdate:modelValue": E,
        "onUpdate:showKeyboard": t[12] || (t[12] = (u) => b.value = u)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, We = /* @__PURE__ */ T(Se, [["__scopeId", "data-v-22394ea0"]]), Pe = { class: "sensor-data-group" }, Ee = { class: "sensor-section" }, xe = { class: "sensor-container" }, Te = { class: "sensor-grid" }, De = { class: "sensor-title" }, Ue = { class: "sensor-value" }, Fe = { class: "sensor-section" }, Ke = { class: "sensor-container" }, Ve = { class: "sensor-grid" }, Le = { class: "sensor-title" }, Ie = { class: "sensor-value" }, qe = {
  __name: "SensorDisplay",
  setup(m) {
    const a = d({ temperature: {}, humidity: {} });
    x(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: s } = P();
        K(s, (o) => {
          if (o && o.type === "update_sensor_data")
            try {
              a.value = JSON.parse(o.content);
            } catch (l) {
              console.error("Failed to parse sensor data:", l);
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
        a.value = o;
      } catch (s) {
        console.error("Error fetching sensor data:", s);
      }
    };
    return (s, o) => (g(), f("div", Pe, [
      e("div", Ee, [
        o[0] || (o[0] = e("h2", null, "温度传感器", -1)),
        e("div", xe, [
          e("div", Te, [
            (g(!0), f(U, null, F(a.value.temperature, (l, v) => (g(), f("div", {
              key: v,
              class: "sensor-card"
            }, [
              e("div", De, $(v), 1),
              e("div", Ue, $(l), 1)
            ]))), 128))
          ])
        ])
      ]),
      e("div", Fe, [
        o[1] || (o[1] = e("h2", null, "湿度传感器", -1)),
        e("div", Ke, [
          e("div", Ve, [
            (g(!0), f(U, null, F(a.value.humidity, (l, v) => (g(), f("div", {
              key: v,
              class: "sensor-card"
            }, [
              e("div", Le, $(v), 1),
              e("div", Ie, $(l), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, Ae = /* @__PURE__ */ T(qe, [["__scopeId", "data-v-947b9192"]]), Ne = { class: "cart-system" }, Me = { class: "water-protection" }, Re = { class: "mode-group" }, Oe = { class: "mode-content" }, je = { key: 0 }, Je = { class: "controls" }, ze = { class: "input-group" }, Be = { class: "input-group" }, He = { class: "button-group" }, Ge = ["disabled"], Xe = ["disabled"], Ye = { class: "visualization" }, Ze = { class: "progress-bar" }, et = { class: "status" }, tt = {
  key: 1,
  class: "auto-mode-container"
}, ot = {
  __name: "CartSystem",
  setup(m) {
    const a = d("semi-auto"), i = d(6), s = d(12), o = d(i.value), l = d(s.value), v = d(i.value), b = d(s.value), y = d(!1), w = d(0), p = d("系统就绪"), C = d("小车尚未工作"), k = d(!1), h = d(!1);
    let Q = null;
    const E = d(!1), c = d(!1), { sendToPyQt: t } = P(), u = R({
      isPyQtWebEngine: !1
    });
    x(() => {
      if (u.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, u.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: _ } = P();
        K(_, (n) => {
          if (n && n.type === "update_dolly_settings")
            try {
              const r = JSON.parse(n.content);
              o.value = r.dolly_single_run_time, l.value = r.dolly_run_interval_time, v.value = o.value, b.value = l.value, console.log("dolly Settings updated:", r);
            } catch (r) {
              console.error("Failed to parse dolly settings data:", r);
            }
          else if (n && n.type === "update_dolly_state")
            n.content ? L("小车正在运行") : L("小车尚未工作");
          else if (n && n.type === "update_water_tank_status")
            try {
              const r = JSON.parse(n.content);
              r.side === "left" ? E.value = r.low_water : r.side === "right" && (c.value = r.low_water), console.log("Water tank status updated:", r);
            } catch (r) {
              console.error("Failed to parse water tank status data:", r);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const O = (_) => {
      a.value = _, u.isPyQtWebEngine && (_ === "auto" ? (J(), t("controlDolly", { target: "setMode", mode: "auto" })) : (V(), L("小车尚未工作"), t("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, Y = () => {
      o.value = Math.max(1, parseInt(o.value) || 1), v.value = o.value, j();
    }, Z = () => {
      l.value = Math.max(0, parseInt(l.value) || 0), b.value = l.value, j();
    };
    function j() {
      if (u.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const _ = {
          target: "dolly_settings",
          dolly_single_run_time: v.value,
          dolly_run_interval_time: b.value
        };
        t("controlDolly", _);
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    const ee = () => {
      y.value = !0, z();
    }, J = () => {
      V(), y.value = !1, cancelAnimationFrame(Q), w.value = 0, p.value = "系统就绪";
    };
    function V() {
      u.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), t("controlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function te() {
      u.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), t("controlDolly", {
        target: "setState",
        dolly_state: !0
      })) : console.log("在普通网页环境中执行更新设置");
    }
    const z = () => {
      te(), p.value = "小车运行中", w.value = 0;
      const _ = Date.now();
      i.value = v.value;
      const n = () => {
        const r = (Date.now() - _) / 1e3, D = Math.max(0, i.value - r);
        w.value = r / i.value * 100, p.value = `小车运行中: 剩余 ${D.toFixed(1)} 秒`, r < i.value && y.value ? Q = requestAnimationFrame(n) : y.value && (w.value = 100, V(), oe());
      };
      Q = requestAnimationFrame(n);
    }, oe = () => {
      p.value = "等待下次运行";
      const _ = Date.now();
      s.value = b.value;
      const n = () => {
        const r = (Date.now() - _) / 1e3, D = Math.max(0, s.value - r);
        p.value = `等待下次运行: ${D.toFixed(1)}秒`, D > 0 && y.value ? Q = requestAnimationFrame(n) : y.value && z();
      };
      Q = requestAnimationFrame(n);
    }, L = (_) => {
      C.value = _;
    };
    return se(() => {
      cancelAnimationFrame(Q);
    }), (_, n) => (g(), f("div", Ne, [
      e("div", Me, [
        e("div", {
          class: W(["water-tank", { "low-water": E.value }])
        }, " 左水箱: " + $(E.value ? "缺水" : "正常"), 3),
        e("div", {
          class: W(["water-tank", { "low-water": c.value }])
        }, " 右水箱: " + $(c.value ? "缺水" : "正常"), 3)
      ]),
      e("div", Re, [
        e("button", {
          class: W(["mode-button", { active: a.value === "semi-auto" }]),
          onClick: n[0] || (n[0] = (r) => a.value === "auto" ? O("semi-auto") : () => {
          })
        }, "半自动模式", 2),
        e("button", {
          class: W(["mode-button", { active: a.value === "auto" }]),
          onClick: n[1] || (n[1] = (r) => a.value === "semi-auto" ? O("auto") : () => {
          })
        }, "自动模式", 2)
      ]),
      e("div", Oe, [
        a.value === "semi-auto" ? (g(), f("div", je, [
          e("div", Je, [
            e("div", ze, [
              n[8] || (n[8] = e("label", null, "单次运行时间 (秒):", -1)),
              e("div", {
                class: "input-wrapper",
                onClick: n[2] || (n[2] = (r) => k.value = !0)
              }, $(o.value), 1)
            ]),
            e("div", Be, [
              n[9] || (n[9] = e("label", null, "循环间隔时间 (秒):", -1)),
              e("div", {
                class: "input-wrapper",
                onClick: n[3] || (n[3] = (r) => h.value = !0)
              }, $(l.value), 1)
            ]),
            e("div", He, [
              e("button", {
                onClick: ee,
                disabled: y.value
              }, "开始", 8, Ge),
              e("button", {
                onClick: J,
                disabled: !y.value
              }, "停止", 8, Xe)
            ])
          ]),
          e("div", Ye, [
            e("div", Ze, [
              e("div", {
                class: "progress",
                style: B({ width: w.value + "%" })
              }, null, 4),
              e("div", {
                class: "cart",
                style: B({ left: w.value + "%" })
              }, n[10] || (n[10] = [
                e("span", { class: "cart-icon" }, "🚜", -1)
              ]), 4)
            ])
          ]),
          e("div", et, $(p.value), 1)
        ])) : (g(), f("div", tt, [
          n[11] || (n[11] = e("div", { class: "auto-mode-title" }, "自动模式受传感器湿度控制", -1)),
          e("div", {
            class: W(["auto-mode-status", { working: C.value === "小车正在运行" }])
          }, $(C.value), 3),
          n[12] || (n[12] = e("div", { class: "auto-mode-placeholder" }, null, -1))
        ]))
      ]),
      S(M, {
        modelValue: o.value,
        "onUpdate:modelValue": [
          n[4] || (n[4] = (r) => o.value = r),
          Y
        ],
        showKeyboard: k.value,
        "onUpdate:showKeyboard": n[5] || (n[5] = (r) => k.value = r)
      }, null, 8, ["modelValue", "showKeyboard"]),
      S(M, {
        modelValue: l.value,
        "onUpdate:modelValue": [
          n[6] || (n[6] = (r) => l.value = r),
          Z
        ],
        showKeyboard: h.value,
        "onUpdate:showKeyboard": n[7] || (n[7] = (r) => h.value = r)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, st = /* @__PURE__ */ T(ot, [["__scopeId", "data-v-79e5d674"]]), nt = { class: "data-actions" }, lt = {
  key: 0,
  class: "modal-overlay"
}, at = {
  key: 1,
  class: "modal-overlay"
}, it = { class: "modal-content" }, ut = {
  __name: "DataExport",
  setup(m) {
    const { sendToPyQt: a } = P(), i = R({
      isPyQtWebEngine: !1
    }), s = d(!1), o = d(!1), l = d("");
    x(() => {
      i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const v = () => {
      i.isPyQtWebEngine && (console.log("导出数据"), a("exportData", !0));
    }, b = () => {
      s.value = !0;
    }, y = () => {
      s.value = !1;
    }, w = () => {
      console.log("清空数据"), s.value = !1, p("所有数据已清空！"), i.isPyQtWebEngine && a("exportData", !1);
    }, p = (k) => {
      l.value = k, o.value = !0;
    }, C = () => {
      o.value = !1;
    };
    return (k, h) => (g(), f("div", nt, [
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
      s.value ? (g(), f("div", lt, [
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
      ])) : N("", !0),
      o.value ? (g(), f("div", at, [
        e("div", it, [
          e("p", null, $(l.value), 1),
          e("div", { class: "modal-buttons" }, [
            e("button", {
              onClick: C,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : N("", !0)
    ]));
  }
}, rt = /* @__PURE__ */ T(ut, [["__scopeId", "data-v-86824edf"]]), dt = { class: "settings-container" }, ct = {
  __name: "App",
  setup(m) {
    return le(), (a, i) => (g(), f("div", dt, [
      i[0] || (i[0] = e("h1", null, "涪特智能养护台车控制系统", -1)),
      S(Ae),
      S(rt),
      S(We),
      S(st)
    ]));
  }
};
export {
  ct as default
};
