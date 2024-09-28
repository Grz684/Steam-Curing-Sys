import { ref as d, onMounted as E, provide as L, readonly as q, inject as A, watch as K, openBlock as g, createElementBlock as b, createElementVNode as e, toDisplayString as Q, Fragment as U, renderList as F, normalizeClass as D, createCommentVNode as M, reactive as R, createVNode as k, onUnmounted as te, normalizeStyle as z } from "vue";
const B = Symbol(), H = Symbol(), G = Symbol();
function oe(m, l) {
  m && m.messageSignal ? m.messageSignal.connect((i) => {
    try {
      const s = JSON.parse(i);
      l.value = s, console.log("Received message from PyQt:", s);
    } catch (s) {
      console.error("Failed to parse message:", s), l.value = { type: "unknown", content: i };
    }
  }) : console.error("messageSignal not found on bridge");
}
function se() {
  const m = d(null), l = d(null), i = d("");
  function s() {
    window.QWebChannel ? new QWebChannel(window.qt.webChannelTransport, (o) => {
      m.value = o, l.value = o.objects.bridge, console.log("QWebChannel initialized", o, o.objects.bridge), oe(l.value, i), l.value && typeof l.value.vueReady == "function" ? l.value.vueReady() : console.error("vueReady method not found on bridge");
    }) : console.error("QWebChannel not found");
  }
  E(() => {
    document.readyState === "complete" || document.readyState === "interactive" ? s() : document.addEventListener("DOMContentLoaded", s);
  }), L(B, q(m)), L(H, q(l)), L(G, q(i));
}
function W() {
  const m = A(B), l = A(H), i = A(G);
  return (!m || !l || !i) && console.error("WebChannel not properly provided. Make sure to call provideWebChannel in a parent component."), {
    channel: m,
    bridge: l,
    message: i,
    sendToPyQt: (o, n) => {
      if (console.log(`Attempting to call ${o} with args:`, n), l && l.value)
        if (typeof l.value.sendToPyQt == "function")
          try {
            l.value.sendToPyQt(o, JSON.stringify(n));
          } catch (u) {
            console.error("Error calling sendToPyQt:", u);
          }
        else
          console.error("Method sendToPyQt not available on bridge"), console.log("Available methods:", Object.keys(l.value));
      else
        console.error("Bridge or bridge.value is undefined");
    }
  };
}
const x = (m, l) => {
  const i = m.__vccOpts || m;
  for (const [s, o] of l)
    i[s] = o;
  return i;
}, ne = {
  key: 0,
  class: "numeric-keyboard"
}, le = { class: "keyboard" }, ae = { class: "current-value" }, ie = ["onClick"], ue = {
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
    const i = m, s = l, o = d([
      ["7", "8", "9"],
      ["4", "5", "6"],
      ["1", "2", "3"],
      ["清除", "0", "确定"]
    ]), n = d("");
    K(() => i.showKeyboard, (f) => {
      f && (n.value = i.modelValue.toString());
    });
    const u = (f) => {
      f === "清除" ? n.value = "" : f === "确定" ? (s("update:modelValue", parseFloat(n.value) || 0), s("update:showKeyboard", !1)) : n.value += f;
    };
    return (f, y) => m.showKeyboard ? (g(), b("div", ne, [
      e("div", le, [
        e("div", ae, Q(n.value), 1),
        (g(!0), b(U, null, F(o.value, (w) => (g(), b("div", {
          key: w.join(),
          class: "row"
        }, [
          (g(!0), b(U, null, F(w, (c) => (g(), b("button", {
            key: c,
            onClick: (C) => u(c),
            class: D({ "function-key": c === "清除" || c === "确定" })
          }, Q(c), 11, ie))), 128))
        ]))), 128))
      ])
    ])) : M("", !0);
  }
}, N = /* @__PURE__ */ x(ue, [["__scopeId", "data-v-541feda2"]]), re = { class: "settings-container" }, de = { class: "setting-group" }, ve = { class: "setting-item" }, ce = { class: "setting-controls" }, pe = ["value"], me = { class: "setting-item" }, ye = { class: "setting-controls" }, ge = ["value"], be = { class: "setting-group" }, fe = { class: "setting-item" }, _e = { class: "setting-controls" }, we = ["value"], he = { class: "setting-item" }, $e = { class: "setting-controls" }, Qe = ["value"], Ce = {
  __name: "SensorSettings",
  setup(m) {
    const { sendToPyQt: l } = W(), i = R({
      isPyQtWebEngine: !1
    }), s = d(30), o = d(10), n = d(80), u = d(20), f = d(!1), y = d(null), w = d("");
    E(() => {
      if (i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: r } = W();
        K(r, (t) => {
          if (t && t.type === "update_limit_settings")
            try {
              const v = JSON.parse(t.content);
              s.value = v.temp_upper, o.value = v.temp_lower, n.value = v.humidity_upper, u.value = v.humidity_lower, console.log("Sensor Settings updated:", v);
            } catch (v) {
              console.error("Failed to parse sensor settings data:", v);
            }
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const c = (r, t) => {
      const v = r === "tempUpper" ? s : r === "tempLower" ? o : r === "humidityUpper" ? n : u;
      v.value = (v.value || 0) + t, r.startsWith("temp") ? C(r === "tempUpper" ? "upper" : "lower") : S(r === "humidityUpper" ? "upper" : "lower");
    }, C = (r) => {
      s.value === "" && (s.value = o.value + 1), o.value === "" && (o.value = s.value - 1), r === "upper" ? s.value = Math.max(o.value + 1, s.value) : o.value = Math.min(s.value - 1, o.value), h();
    }, S = (r) => {
      n.value === "" && (n.value = u.value + 1), u.value === "" && (u.value = n.value - 1), r === "upper" ? n.value = Math.min(100, Math.max(u.value + 1, n.value)) : u.value = Math.max(0, Math.min(n.value - 1, u.value)), h();
    }, h = () => {
      if (s.value !== "" && o.value !== "" && n.value !== "" && u.value !== "") {
        const r = {
          temp_upper: s.value,
          temp_lower: o.value,
          humidity_upper: n.value,
          humidity_lower: u.value
        };
        console.log("设置已更新:", r), i.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), l("updateLimitSettings", r)) : console.log("在普通网页环境中执行更新设置");
      }
    }, $ = (r) => {
      y.value = r, f.value = !0, w.value = r.startsWith("temp") ? r === "tempUpper" ? s.value : o.value : r === "humidityUpper" ? n.value : u.value;
    }, P = (r) => {
      const t = parseFloat(r);
      isNaN(t) || (y.value === "tempUpper" ? (s.value = t, C("upper")) : y.value === "tempLower" ? (o.value = t, C("lower")) : y.value === "humidityUpper" ? (n.value = t, S("upper")) : y.value === "humidityLower" && (u.value = t, S("lower"))), y.value = null;
    };
    return (r, t) => (g(), b("div", re, [
      e("div", de, [
        t[15] || (t[15] = e("h2", null, "温度设置 (°C)", -1)),
        e("div", ve, [
          t[13] || (t[13] = e("span", { class: "setting-label" }, "上限：", -1)),
          e("div", ce, [
            e("button", {
              onClick: t[0] || (t[0] = (v) => c("tempUpper", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: s.value,
              onFocus: t[1] || (t[1] = (v) => $("tempUpper")),
              readonly: ""
            }, null, 40, pe),
            e("button", {
              onClick: t[2] || (t[2] = (v) => c("tempUpper", 1))
            }, "+")
          ])
        ]),
        e("div", me, [
          t[14] || (t[14] = e("span", { class: "setting-label" }, "下限：", -1)),
          e("div", ye, [
            e("button", {
              onClick: t[3] || (t[3] = (v) => c("tempLower", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: o.value,
              onFocus: t[4] || (t[4] = (v) => $("tempLower")),
              readonly: ""
            }, null, 40, ge),
            e("button", {
              onClick: t[5] || (t[5] = (v) => c("tempLower", 1))
            }, "+")
          ])
        ])
      ]),
      e("div", be, [
        t[18] || (t[18] = e("h2", null, "湿度设置 (%)", -1)),
        e("div", fe, [
          t[16] || (t[16] = e("span", { class: "setting-label" }, "上限：", -1)),
          e("div", _e, [
            e("button", {
              onClick: t[6] || (t[6] = (v) => c("humidityUpper", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: n.value,
              onFocus: t[7] || (t[7] = (v) => $("humidityUpper")),
              readonly: ""
            }, null, 40, we),
            e("button", {
              onClick: t[8] || (t[8] = (v) => c("humidityUpper", 1))
            }, "+")
          ])
        ]),
        e("div", he, [
          t[17] || (t[17] = e("span", { class: "setting-label" }, "下限：", -1)),
          e("div", $e, [
            e("button", {
              onClick: t[9] || (t[9] = (v) => c("humidityLower", -1))
            }, "-"),
            e("input", {
              type: "text",
              value: u.value,
              onFocus: t[10] || (t[10] = (v) => $("humidityLower")),
              readonly: ""
            }, null, 40, Qe),
            e("button", {
              onClick: t[11] || (t[11] = (v) => c("humidityLower", 1))
            }, "+")
          ])
        ])
      ]),
      k(N, {
        modelValue: w.value,
        showKeyboard: f.value,
        "onUpdate:modelValue": P,
        "onUpdate:showKeyboard": t[12] || (t[12] = (v) => f.value = v)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, Se = /* @__PURE__ */ x(Ce, [["__scopeId", "data-v-22394ea0"]]), Pe = { class: "sensor-data-group" }, ke = { class: "sensor-section" }, We = { class: "sensor-container" }, Ee = { class: "sensor-grid" }, xe = { class: "sensor-title" }, Te = { class: "sensor-value" }, De = { class: "sensor-section" }, Ue = { class: "sensor-container" }, Fe = { class: "sensor-grid" }, Ke = { class: "sensor-title" }, Ve = { class: "sensor-value" }, Ie = {
  __name: "SensorDisplay",
  setup(m) {
    const l = d({ temperature: {}, humidity: {} });
    E(() => {
      if (typeof window.qt < "u" && window.qt.webChannelTransport) {
        console.log("在PyQt QWebEngine环境中执行");
        const { message: s } = W();
        K(s, (o) => {
          if (o && o.type === "update_sensor_data")
            try {
              l.value = JSON.parse(o.content);
            } catch (n) {
              console.error("Failed to parse sensor data:", n);
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
    return (s, o) => (g(), b("div", Pe, [
      e("div", ke, [
        o[0] || (o[0] = e("h2", null, "温度传感器", -1)),
        e("div", We, [
          e("div", Ee, [
            (g(!0), b(U, null, F(l.value.temperature, (n, u) => (g(), b("div", {
              key: u,
              class: "sensor-card"
            }, [
              e("div", xe, Q(u), 1),
              e("div", Te, Q(n), 1)
            ]))), 128))
          ])
        ])
      ]),
      e("div", De, [
        o[1] || (o[1] = e("h2", null, "湿度传感器", -1)),
        e("div", Ue, [
          e("div", Fe, [
            (g(!0), b(U, null, F(l.value.humidity, (n, u) => (g(), b("div", {
              key: u,
              class: "sensor-card"
            }, [
              e("div", Ke, Q(u), 1),
              e("div", Ve, Q(n), 1)
            ]))), 128))
          ])
        ])
      ])
    ]));
  }
}, Le = /* @__PURE__ */ x(Ie, [["__scopeId", "data-v-947b9192"]]), qe = { class: "cart-system" }, Ae = { class: "mode-group" }, Me = { class: "mode-content" }, Ne = { key: 0 }, Re = { class: "controls" }, Oe = { class: "input-group" }, je = { class: "input-group" }, Je = { class: "button-group" }, ze = ["disabled"], Be = ["disabled"], He = { class: "visualization" }, Ge = { class: "progress-bar" }, Xe = { class: "status" }, Ye = {
  key: 1,
  class: "auto-mode-container"
}, Ze = {
  __name: "CartSystem",
  setup(m) {
    const l = d("semi-auto"), i = d(6), s = d(12), o = d(i.value), n = d(s.value), u = d(i.value), f = d(s.value), y = d(!1), w = d(0), c = d("系统就绪"), C = d("小车尚未工作"), S = d(!1), h = d(!1);
    let $ = null;
    const { sendToPyQt: P } = W(), r = R({
      isPyQtWebEngine: !1
    });
    E(() => {
      if (r.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, r.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中运行");
        const { message: _ } = W();
        K(_, (a) => {
          if (a && a.type === "update_dolly_settings")
            try {
              const p = JSON.parse(a.content);
              o.value = p.dolly_single_run_time, n.value = p.dolly_run_interval_time, u.value = o.value, f.value = n.value, console.log("dolly Settings updated:", p);
            } catch (p) {
              console.error("Failed to parse dolly settings data:", p);
            }
          else a && a.type === "update_dolly_state" && (a.content ? I("小车正在运行") : I("小车尚未工作"));
        });
      } else
        console.log("在普通网页环境中运行");
    });
    const t = (_) => {
      l.value = _, r.isPyQtWebEngine && (_ === "auto" ? (j(), P("controlDolly", { target: "setMode", mode: "auto" })) : (V(), I("小车尚未工作"), P("controlDolly", { target: "setMode", mode: "semi-auto" })));
    }, v = () => {
      o.value = Math.max(1, parseInt(o.value) || 1), u.value = o.value, O();
    }, X = () => {
      n.value = Math.max(0, parseInt(n.value) || 0), f.value = n.value, O();
    };
    function O() {
      if (r.isPyQtWebEngine) {
        console.log("在PyQt QWebEngine环境中执行更新设置");
        const _ = {
          target: "dolly_settings",
          dolly_single_run_time: u.value,
          dolly_run_interval_time: f.value
        };
        P("controlDolly", _);
      } else
        console.log("在普通网页环境中执行更新设置");
    }
    const Y = () => {
      y.value = !0, J();
    }, j = () => {
      V(), y.value = !1, cancelAnimationFrame($), w.value = 0, c.value = "系统就绪";
    };
    function V() {
      r.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), P("controlDolly", {
        target: "setState",
        dolly_state: !1
      })) : console.log("在普通网页环境中执行更新设置");
    }
    function Z() {
      r.isPyQtWebEngine ? (console.log("在PyQt QWebEngine环境中执行更新设置"), P("controlDolly", {
        target: "setState",
        dolly_state: !0
      })) : console.log("在普通网页环境中执行更新设置");
    }
    const J = () => {
      Z(), c.value = "小车运行中", w.value = 0;
      const _ = Date.now();
      i.value = u.value;
      const a = () => {
        const p = (Date.now() - _) / 1e3, T = Math.max(0, i.value - p);
        w.value = p / i.value * 100, c.value = `小车运行中: 剩余 ${T.toFixed(1)} 秒`, p < i.value && y.value ? $ = requestAnimationFrame(a) : y.value && (w.value = 100, V(), ee());
      };
      $ = requestAnimationFrame(a);
    }, ee = () => {
      c.value = "等待下次运行";
      const _ = Date.now();
      s.value = f.value;
      const a = () => {
        const p = (Date.now() - _) / 1e3, T = Math.max(0, s.value - p);
        c.value = `等待下次运行: ${T.toFixed(1)}秒`, T > 0 && y.value ? $ = requestAnimationFrame(a) : y.value && J();
      };
      $ = requestAnimationFrame(a);
    }, I = (_) => {
      C.value = _;
    };
    return te(() => {
      cancelAnimationFrame($);
    }), (_, a) => (g(), b("div", qe, [
      e("div", Ae, [
        e("button", {
          class: D(["mode-button", { active: l.value === "semi-auto" }]),
          onClick: a[0] || (a[0] = (p) => l.value === "auto" ? t("semi-auto") : () => {
          })
        }, "半自动模式", 2),
        e("button", {
          class: D(["mode-button", { active: l.value === "auto" }]),
          onClick: a[1] || (a[1] = (p) => l.value === "semi-auto" ? t("auto") : () => {
          })
        }, "自动模式", 2)
      ]),
      e("div", Me, [
        l.value === "semi-auto" ? (g(), b("div", Ne, [
          e("div", Re, [
            e("div", Oe, [
              a[8] || (a[8] = e("label", null, "单次运行时间 (秒):", -1)),
              e("div", {
                class: "input-wrapper",
                onClick: a[2] || (a[2] = (p) => S.value = !0)
              }, Q(o.value), 1)
            ]),
            e("div", je, [
              a[9] || (a[9] = e("label", null, "循环间隔时间 (秒):", -1)),
              e("div", {
                class: "input-wrapper",
                onClick: a[3] || (a[3] = (p) => h.value = !0)
              }, Q(n.value), 1)
            ]),
            e("div", Je, [
              e("button", {
                onClick: Y,
                disabled: y.value
              }, "开始", 8, ze),
              e("button", {
                onClick: j,
                disabled: !y.value
              }, "停止", 8, Be)
            ])
          ]),
          e("div", He, [
            e("div", Ge, [
              e("div", {
                class: "progress",
                style: z({ width: w.value + "%" })
              }, null, 4),
              e("div", {
                class: "cart",
                style: z({ left: w.value + "%" })
              }, a[10] || (a[10] = [
                e("span", { class: "cart-icon" }, "🚜", -1)
              ]), 4)
            ])
          ]),
          e("div", Xe, Q(c.value), 1)
        ])) : (g(), b("div", Ye, [
          a[11] || (a[11] = e("div", { class: "auto-mode-title" }, "自动模式受传感器湿度控制", -1)),
          e("div", {
            class: D(["auto-mode-status", { working: C.value === "小车正在运行" }])
          }, Q(C.value), 3),
          a[12] || (a[12] = e("div", { class: "auto-mode-placeholder" }, null, -1))
        ]))
      ]),
      k(N, {
        modelValue: o.value,
        "onUpdate:modelValue": [
          a[4] || (a[4] = (p) => o.value = p),
          v
        ],
        showKeyboard: S.value,
        "onUpdate:showKeyboard": a[5] || (a[5] = (p) => S.value = p)
      }, null, 8, ["modelValue", "showKeyboard"]),
      k(N, {
        modelValue: n.value,
        "onUpdate:modelValue": [
          a[6] || (a[6] = (p) => n.value = p),
          X
        ],
        showKeyboard: h.value,
        "onUpdate:showKeyboard": a[7] || (a[7] = (p) => h.value = p)
      }, null, 8, ["modelValue", "showKeyboard"])
    ]));
  }
}, et = /* @__PURE__ */ x(Ze, [["__scopeId", "data-v-6929ac4f"]]), tt = { class: "data-actions" }, ot = {
  key: 0,
  class: "modal-overlay"
}, st = {
  key: 1,
  class: "modal-overlay"
}, nt = { class: "modal-content" }, lt = {
  __name: "DataExport",
  setup(m) {
    const { sendToPyQt: l } = W(), i = R({
      isPyQtWebEngine: !1
    }), s = d(!1), o = d(!1), n = d("");
    E(() => {
      i.isPyQtWebEngine = typeof window.qt < "u" && window.qt.webChannelTransport, i.isPyQtWebEngine ? console.log("在PyQt QWebEngine环境中运行") : console.log("在普通网页环境中运行");
    });
    const u = () => {
      i.isPyQtWebEngine && (console.log("导出数据"), l("exportData", !0));
    }, f = () => {
      s.value = !0;
    }, y = () => {
      s.value = !1;
    }, w = () => {
      console.log("清空数据"), s.value = !1, c("所有数据已清空！"), i.isPyQtWebEngine && l("exportData", !1);
    }, c = (S) => {
      n.value = S, o.value = !0;
    }, C = () => {
      o.value = !1;
    };
    return (S, h) => (g(), b("div", tt, [
      e("div", { class: "action-buttons" }, [
        e("div", { class: "button-group" }, [
          h[0] || (h[0] = e("i", { class: "fas fa-file-excel" }, null, -1)),
          e("button", {
            onClick: u,
            class: "export-btn"
          }, "导出数据")
        ]),
        e("div", { class: "button-group" }, [
          h[1] || (h[1] = e("i", { class: "fas fa-trash-alt" }, null, -1)),
          e("button", {
            onClick: f,
            class: "clear-btn"
          }, "清空数据")
        ])
      ]),
      s.value ? (g(), b("div", ot, [
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
      ])) : M("", !0),
      o.value ? (g(), b("div", st, [
        e("div", nt, [
          e("p", null, Q(n.value), 1),
          e("div", { class: "modal-buttons" }, [
            e("button", {
              onClick: C,
              class: "confirm-btn"
            }, "确定")
          ])
        ])
      ])) : M("", !0)
    ]));
  }
}, at = /* @__PURE__ */ x(lt, [["__scopeId", "data-v-86824edf"]]), it = { class: "settings-container" }, rt = {
  __name: "App",
  setup(m) {
    return se(), (l, i) => (g(), b("div", it, [
      i[0] || (i[0] = e("h1", null, "涪特智能养护台车控制系统", -1)),
      k(Le),
      k(at),
      k(Se),
      k(et)
    ]));
  }
};
export {
  rt as default
};
